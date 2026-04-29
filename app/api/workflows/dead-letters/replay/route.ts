import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import {
  claimDeadLetter,
  DeadLetterReasonSchema,
  getDeadLetterById,
  isDeadLetterResolved,
  markDeadLetterResolved,
  releaseDeadLetterClaim,
  writeDeadLetter,
} from '@/lib/reliability/dead-letter';
import {
  TerminalStatusSchema,
  writeTerminalStatus,
} from '@/lib/reliability/terminal-status-writer';
import {
  RoleGuardError,
  assertRoleAllowed,
  getAllowedRolesForAction,
} from '@/lib/reliability/role-guard';
import {
  WorkflowAuthError,
  assertInternalWorkflowAuth,
} from '@/lib/reliability/internal-auth';

export const runtime = 'nodejs';

const ReplayRequestSchema = z.object({
  reason: DeadLetterReasonSchema,
  id: z.string().min(1),
  resolvedBy: z.string().min(1).default('workflow-operator'),
  actorRole: z.string().optional(),
  resolutionNote: z.string().optional(),
  forceFailure: z.boolean().optional(),
  manualResolve: z.boolean().optional(),
});

function parseTerminalPayload(payload: unknown): {
  status: z.infer<typeof TerminalStatusSchema>;
  message?: string;
  metadata?: Record<string, unknown>;
} | null {
  const payloadRecord = z
    .object({
      status: TerminalStatusSchema,
      message: z.string().optional(),
      metadata: z.record(z.unknown()).optional(),
    })
    .safeParse(payload);

  if (!payloadRecord.success) {
    return null;
  }

  return payloadRecord.data;
}

export async function POST(request: NextRequest) {
  try {
    let authContext;
    try {
      authContext = assertInternalWorkflowAuth(request);
    } catch (error) {
      if (error instanceof WorkflowAuthError) {
        return NextResponse.json(
          {
            error: error.message,
            code: error.code,
          },
          { status: error.status }
        );
      }

      throw error;
    }

    const body = await request.json();
    const parsed = ReplayRequestSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        {
          error: 'Invalid replay payload',
          details: parsed.error.flatten(),
        },
        { status: 400 }
      );
    }

    const {
      reason,
      id,
      resolvedBy,
      actorRole: requestedActorRoleFromBody,
      resolutionNote,
      forceFailure,
      manualResolve,
    } = parsed.data;

    const entry = await getDeadLetterById(reason, id);
    if (!entry) {
      return NextResponse.json(
        {
          error: `Dead-letter entry not found for id=${id}`,
        },
        { status: 404 }
      );
    }

    const actorRole = authContext.callerRole;
    const requestedActorRole =
      requestedActorRoleFromBody ??
      request.headers.get('x-actor-role') ??
      undefined;
    const guardedAction =
      reason === 'recipient_mismatch_blocked'
        ? 'dead_letter_manual_resolve'
        : 'dead_letter_replay';

    try {
      assertRoleAllowed(guardedAction, actorRole);
    } catch (error) {
      if (error instanceof RoleGuardError) {
        const deadLetterEntry = await writeDeadLetter({
          reason: 'role_guard_blocked',
          eventId: entry.eventId,
          runId: entry.runId,
          stage: 'dead_letter_replay_authorization',
          errorMessage: error.message,
          payload: {
            replayReason: reason,
            replayEntryId: id,
            actorRole,
            requestedActorRole,
          },
        });

        return NextResponse.json(
          {
            ok: false,
            replayed: false,
            authorized: false,
            action: guardedAction,
            actorRole,
            allowedRoles: getAllowedRolesForAction(guardedAction),
            message: error.message,
            deadLetter: {
              id: deadLetterEntry.id,
              reason: deadLetterEntry.reason,
              createdAt: deadLetterEntry.createdAt,
            },
          },
          { status: 403 }
        );
      }

      throw error;
    }

    if (await isDeadLetterResolved(reason, id)) {
      return NextResponse.json(
        {
          ok: false,
          replayed: false,
          message: `Dead-letter entry id=${id} is already resolved.`,
        },
        { status: 409 }
      );
    }

    const claim = await claimDeadLetter(reason, id, authContext.callerId, {
      ttlSeconds: 120,
    });
    if (!claim.claimed || !claim.claimToken) {
      return NextResponse.json(
        {
          ok: false,
          replayed: false,
          message: `Dead-letter entry id=${id} is currently being replayed by another process.`,
          existingClaim: claim.existingClaim,
        },
        { status: 409 }
      );
    }

    const claimToken = claim.claimToken;

    if (await isDeadLetterResolved(reason, id)) {
      await releaseDeadLetterClaim(reason, id, claimToken);
      return NextResponse.json(
        {
          ok: false,
          replayed: false,
          message: `Dead-letter entry id=${id} was resolved before replay could start.`,
        },
        { status: 409 }
      );
    }

    if (reason === 'recipient_mismatch_blocked') {
      try {
        if (!manualResolve) {
          return NextResponse.json(
            {
              ok: false,
              message:
                'Recipient mismatch entries cannot be auto-replayed. Fix payload mapping and re-run dispatch. Use manualResolve=true to close this entry once remediated.',
            },
            { status: 409 }
          );
        }

        await markDeadLetterResolved(reason, id, resolvedBy, resolutionNote);

        return NextResponse.json({
          ok: true,
          replayed: false,
          manuallyResolved: true,
          id,
        });
      } finally {
        await releaseDeadLetterClaim(reason, id, claimToken);
      }
    }

    const terminalPayload = parseTerminalPayload(entry.payload);
    if (!terminalPayload) {
      await releaseDeadLetterClaim(reason, id, claimToken);
      return NextResponse.json(
        {
          error:
            'Dead-letter payload is missing required terminal status fields (status/message/metadata).',
        },
        { status: 422 }
      );
    }

    try {
      const writeResult = await writeTerminalStatus(
        {
          eventId: entry.eventId,
          runId: entry.runId,
          status: terminalPayload.status,
          message: terminalPayload.message,
          metadata: terminalPayload.metadata,
        },
        { forceFailure }
      );

      await markDeadLetterResolved(reason, id, resolvedBy, resolutionNote);

      return NextResponse.json({
        ok: true,
        replayed: true,
        id,
        writeResult,
      });
    } catch (error) {
      const replayError =
        error instanceof Error ? error.message : 'Unknown replay failure';

      const newDeadLetter = await writeDeadLetter({
        reason: 'terminal_status_write_failed',
        eventId: entry.eventId,
        runId: entry.runId,
        stage: 'terminal_status_replay',
        errorMessage: replayError,
        payload: terminalPayload,
      });

      return NextResponse.json(
        {
          ok: false,
          replayed: false,
          message: 'Replay attempt failed and was re-queued to dead-letter.',
          error: replayError,
          deadLetter: {
            id: newDeadLetter.id,
            reason: newDeadLetter.reason,
            createdAt: newDeadLetter.createdAt,
          },
        },
        { status: 202 }
      );
    } finally {
      await releaseDeadLetterClaim(reason, id, claimToken);
    }
  } catch (error) {
    console.error('Error replaying dead-letter entry:', error);
    return NextResponse.json(
      {
        error: 'Failed to replay dead-letter entry',
      },
      { status: 500 }
    );
  }
}
