import { NextRequest, NextResponse } from 'next/server';
import {
  DispatchEnvelopeSchema,
  findRecipientMismatches,
} from '@/lib/reliability/recipient-guard';
import { writeDeadLetter } from '@/lib/reliability/dead-letter';
import {
  WorkflowAuthError,
  assertInternalWorkflowAuth,
} from '@/lib/reliability/internal-auth';

export const runtime = 'nodejs';

export async function POST(request: NextRequest) {
  try {
    try {
      assertInternalWorkflowAuth(request);
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
    const parsed = DispatchEnvelopeSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        {
          error: 'Invalid dispatch payload',
          details: parsed.error.flatten(),
        },
        { status: 400 }
      );
    }

    const envelope = parsed.data;
    const mismatches = findRecipientMismatches(envelope);

    if (mismatches.length > 0) {
      const deadLetterEntry = await writeDeadLetter({
        reason: 'recipient_mismatch_blocked',
        eventId: envelope.eventId,
        runId: envelope.runId,
        stage: 'pre_send_guard',
        errorMessage: 'Recipient mismatch guard blocked dispatch.',
        payload: {
          version: envelope.version,
          dispatches: envelope.dispatches,
          mismatches,
        },
      });

      return NextResponse.json(
        {
          ok: false,
          blocked: true,
          message: 'Dispatch blocked: recipient/document mismatch detected.',
          mismatches,
          deadLetter: {
            id: deadLetterEntry.id,
            reason: deadLetterEntry.reason,
            createdAt: deadLetterEntry.createdAt,
          },
        },
        { status: 409 }
      );
    }

    return NextResponse.json({
      ok: true,
      blocked: false,
      message: 'Dispatch validated. No mismatches detected.',
      validatedDispatches: envelope.dispatches.length,
      eventId: envelope.eventId,
      runId: envelope.runId,
      version: envelope.version,
    });
  } catch (error) {
    console.error('Error running dispatch guard:', error);
    return NextResponse.json(
      {
        error: 'Failed to run dispatch guard',
      },
      { status: 500 }
    );
  }
}
