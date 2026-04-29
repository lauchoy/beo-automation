import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { writeDeadLetter } from '@/lib/reliability/dead-letter';
import {
  TerminalStatusWriteInputSchema,
  writeTerminalStatus,
} from '@/lib/reliability/terminal-status-writer';
import {
  WorkflowAuthError,
  assertInternalWorkflowAuth,
} from '@/lib/reliability/internal-auth';

export const runtime = 'nodejs';

const TerminalStatusRequestSchema = TerminalStatusWriteInputSchema.extend({
  forceFailure: z.boolean().optional(),
});

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
    const parsed = TerminalStatusRequestSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        {
          error: 'Invalid terminal status payload',
          details: parsed.error.flatten(),
        },
        { status: 400 }
      );
    }

    const { forceFailure, ...statusWriteInput } = parsed.data;

    try {
      const writeResult = await writeTerminalStatus(statusWriteInput, {
        forceFailure,
      });

      return NextResponse.json({
        ok: true,
        fallbackUsed: false,
        writeResult,
      });
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : 'Unknown terminal status write error';

      const deadLetterEntry = await writeDeadLetter({
        reason: 'terminal_status_write_failed',
        eventId: statusWriteInput.eventId,
        runId: statusWriteInput.runId,
        stage: 'terminal_status_write',
        errorMessage,
        payload: {
          status: statusWriteInput.status,
          message: statusWriteInput.message,
          metadata: statusWriteInput.metadata,
        },
      });

      return NextResponse.json(
        {
          ok: false,
          fallbackUsed: true,
          message:
            'Primary terminal status write failed. Persisted event to dead-letter queue for replay.',
          deadLetter: {
            id: deadLetterEntry.id,
            reason: deadLetterEntry.reason,
            createdAt: deadLetterEntry.createdAt,
          },
          error: errorMessage,
        },
        { status: 202 }
      );
    }
  } catch (error) {
    console.error('Error handling terminal status update:', error);
    return NextResponse.json(
      {
        error: 'Failed to process terminal status update',
      },
      { status: 500 }
    );
  }
}
