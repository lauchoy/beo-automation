import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { writeDeadLetter } from '@/lib/reliability/dead-letter';
import {
  GuardedActionSchema,
  RoleGuardError,
  assertRoleAllowed,
  getAllowedRolesForAction,
} from '@/lib/reliability/role-guard';
import {
  WorkflowAuthError,
  assertInternalWorkflowAuth,
} from '@/lib/reliability/internal-auth';

export const runtime = 'nodejs';

const GuardedActionRequestSchema = z.object({
  eventId: z.string().min(1),
  runId: z.string().min(1),
  action: GuardedActionSchema,
  actorRole: z.string().optional(),
  actorId: z.string().optional(),
  metadata: z.record(z.unknown()).optional(),
});

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
    const parsed = GuardedActionRequestSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        {
          error: 'Invalid guarded-action payload',
          details: parsed.error.flatten(),
        },
        { status: 400 }
      );
    }

    const actorRole = authContext.callerRole;
    const requestedActorRole =
      parsed.data.actorRole ?? request.headers.get('x-actor-role') ?? undefined;

    try {
      assertRoleAllowed(parsed.data.action, actorRole);

      return NextResponse.json({
        ok: true,
        authorized: true,
        action: parsed.data.action,
        actorRole,
        callerId: authContext.callerId,
        eventId: parsed.data.eventId,
        runId: parsed.data.runId,
      });
    } catch (error) {
      if (error instanceof RoleGuardError) {
        const deadLetterEntry = await writeDeadLetter({
          reason: 'role_guard_blocked',
          eventId: parsed.data.eventId,
          runId: parsed.data.runId,
          stage: 'authorization_guard',
          errorMessage: error.message,
          payload: {
            action: parsed.data.action,
            actorRole,
            requestedActorRole,
            actorId: parsed.data.actorId,
            metadata: parsed.data.metadata,
          },
        });

        return NextResponse.json(
          {
            ok: false,
            authorized: false,
            action: parsed.data.action,
            actorRole,
            allowedRoles: getAllowedRolesForAction(parsed.data.action),
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
  } catch (error) {
    console.error('Error enforcing role guard:', error);
    return NextResponse.json(
      {
        error: 'Failed to evaluate role guard',
      },
      { status: 500 }
    );
  }
}
