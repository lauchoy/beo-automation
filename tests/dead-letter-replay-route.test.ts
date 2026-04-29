import { afterEach, beforeEach, describe, expect, it } from 'vitest';
import { mkdtemp, rm } from 'fs/promises';
import os from 'os';
import path from 'path';
import { NextRequest } from 'next/server';
import { POST as replayPost } from '@/app/api/workflows/dead-letters/replay/route';
import { listDeadLetters, writeDeadLetter } from '@/lib/reliability/dead-letter';

let tempDir: string;

beforeEach(async () => {
  tempDir = await mkdtemp(path.join(os.tmpdir(), 'rosalynn-replay-route-'));
  process.env.DEAD_LETTER_DIR = tempDir;
  process.env.WORKFLOW_INTERNAL_TOKEN = 'test-internal-token';
  process.env.WORKFLOW_CALLER_ROLE = 'ops-manager';
  delete process.env.SIMULATE_TERMINAL_STATUS_FAILURE;
  delete process.env.TERMINAL_STATUS_WEBHOOK_URL;
});

afterEach(async () => {
  await rm(tempDir, { recursive: true, force: true });
  delete process.env.DEAD_LETTER_DIR;
  delete process.env.WORKFLOW_INTERNAL_TOKEN;
  delete process.env.WORKFLOW_CALLER_ROLE;
  delete process.env.SIMULATE_TERMINAL_STATUS_FAILURE;
  delete process.env.TERMINAL_STATUS_WEBHOOK_URL;
});

function buildRequest(body: Record<string, unknown>, headers?: Record<string, string>) {
  return new NextRequest('http://localhost/api/workflows/dead-letters/replay', {
    method: 'POST',
    headers: {
      'content-type': 'application/json',
      authorization: 'Bearer test-internal-token',
      ...(headers ?? {}),
    },
    body: JSON.stringify(body),
  });
}

describe('/api/workflows/dead-letters/replay route', () => {
  it('replays terminal_status_write_failed entry for authorized role', async () => {
    const entry = await writeDeadLetter({
      reason: 'terminal_status_write_failed',
      eventId: 'EVT-401',
      runId: 'run-401',
      stage: 'terminal_status_write',
      errorMessage: 'upstream failed',
      payload: {
        status: 'Error',
        message: 'upstream failed',
      },
    });

    const response = await replayPost(
      buildRequest({
        reason: 'terminal_status_write_failed',
        id: entry.id,
        resolvedBy: 'ops-manager',
      })
    );

    expect(response.status).toBe(200);
    const data = await response.json();
    expect(data.replayed).toBe(true);
    expect(data.writeResult.provider).toBe('mock');

    const unresolved = await listDeadLetters('terminal_status_write_failed');
    expect(unresolved).toHaveLength(0);
  });

  it('blocks unauthorized replay and writes role_guard_blocked entry', async () => {
    process.env.WORKFLOW_CALLER_ROLE = 'chef';

    const entry = await writeDeadLetter({
      reason: 'terminal_status_write_failed',
      eventId: 'EVT-402',
      runId: 'run-402',
      stage: 'terminal_status_write',
      errorMessage: 'upstream failed',
      payload: {
        status: 'Error',
      },
    });

    const response = await replayPost(
      buildRequest({
        reason: 'terminal_status_write_failed',
        id: entry.id,
        actorRole: 'admin',
      }, {
        'x-actor-role': 'admin',
      })
    );

    expect(response.status).toBe(403);
    const data = await response.json();
    expect(data.authorized).toBe(false);
    expect(data.deadLetter.reason).toBe('role_guard_blocked');

    const guardEntries = await listDeadLetters('role_guard_blocked');
    expect(guardEntries).toHaveLength(1);
    expect(guardEntries[0].stage).toBe('dead_letter_replay_authorization');
  });

  it('requires manualResolve for recipient mismatch entries', async () => {
    const entry = await writeDeadLetter({
      reason: 'recipient_mismatch_blocked',
      eventId: 'EVT-403',
      runId: 'run-403',
      stage: 'pre_send_guard',
      errorMessage: 'mismatch',
      payload: {
        mismatch: true,
      },
    });

    const blockedResponse = await replayPost(
      buildRequest({
        reason: 'recipient_mismatch_blocked',
        id: entry.id,
      })
    );

    expect(blockedResponse.status).toBe(409);

    const resolveResponse = await replayPost(
      buildRequest({
        reason: 'recipient_mismatch_blocked',
        id: entry.id,
        resolvedBy: 'lead-user',
        manualResolve: true,
      })
    );

    expect(resolveResponse.status).toBe(200);
    const resolved = await resolveResponse.json();
    expect(resolved.manuallyResolved).toBe(true);

    const unresolved = await listDeadLetters('recipient_mismatch_blocked');
    expect(unresolved).toHaveLength(0);
  });

  it('allows only one replay claim for concurrent requests on the same entry', async () => {
    const entry = await writeDeadLetter({
      reason: 'terminal_status_write_failed',
      eventId: 'EVT-404',
      runId: 'run-404',
      stage: 'terminal_status_write',
      errorMessage: 'upstream failed',
      payload: {
        status: 'Error',
      },
    });

    const [responseA, responseB] = await Promise.all([
      replayPost(
        buildRequest({
          reason: 'terminal_status_write_failed',
          id: entry.id,
          resolvedBy: 'ops-a',
        })
      ),
      replayPost(
        buildRequest({
          reason: 'terminal_status_write_failed',
          id: entry.id,
          resolvedBy: 'ops-b',
        })
      ),
    ]);

    const statuses = [responseA.status, responseB.status].sort((a, b) => a - b);
    expect(statuses).toEqual([200, 409]);

    const unresolved = await listDeadLetters('terminal_status_write_failed');
    expect(unresolved).toHaveLength(0);
  });
});
