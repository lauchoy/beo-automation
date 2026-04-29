import { NextRequest, NextResponse } from 'next/server';
import {
  DeadLetterReason,
  DeadLetterReasonSchema,
  listDeadLetters,
} from '@/lib/reliability/dead-letter';
import {
  WorkflowAuthError,
  assertInternalWorkflowAuth,
} from '@/lib/reliability/internal-auth';

export const runtime = 'nodejs';

const ALL_REASONS: DeadLetterReason[] = [
  'terminal_status_write_failed',
  'recipient_mismatch_blocked',
  'role_guard_blocked',
];

function parseLimit(value: string | null): number | undefined {
  if (!value) {
    return undefined;
  }

  const parsed = Number(value);

  if (!Number.isFinite(parsed) || parsed <= 0) {
    return undefined;
  }

  return Math.floor(parsed);
}

export async function GET(request: NextRequest) {
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

    const searchParams = request.nextUrl.searchParams;
    const reasonParam = searchParams.get('reason');
    const includeResolved = searchParams.get('includeResolved') === 'true';
    const limit = parseLimit(searchParams.get('limit'));

    if (reasonParam) {
      const parsedReason = DeadLetterReasonSchema.safeParse(reasonParam);
      if (!parsedReason.success) {
        return NextResponse.json(
          {
            error: 'Invalid dead-letter reason',
            validReasons: ALL_REASONS,
          },
          { status: 400 }
        );
      }

      const entries = await listDeadLetters(parsedReason.data, {
        includeResolved,
        limit,
      });

      return NextResponse.json({
        reason: parsedReason.data,
        count: entries.length,
        entries,
      });
    }

    const grouped = await Promise.all(
      ALL_REASONS.map(async reason => {
        const entries = await listDeadLetters(reason, {
          includeResolved,
          limit,
        });

        return {
          reason,
          count: entries.length,
          entries,
        };
      })
    );

    return NextResponse.json({
      reasons: grouped,
      total: grouped.reduce((sum, group) => sum + group.count, 0),
    });
  } catch (error) {
    console.error('Error listing dead letters:', error);
    return NextResponse.json(
      {
        error: 'Failed to list dead letters',
      },
      { status: 500 }
    );
  }
}
