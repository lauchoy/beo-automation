import { afterEach, beforeEach, describe, expect, it } from 'vitest';
import { mkdtemp, rm } from 'fs/promises';
import os from 'os';
import path from 'path';
import { NextRequest } from 'next/server';
import { POST as guardedActionPost } from '@/app/api/workflows/guarded-action/route';
import { listDeadLetters } from '@/lib/reliability/dead-letter';

let tempDir: string;

beforeEach(async () => {
  tempDir = await mkdtemp(path.join(os.tmpdir(), 'rosalynn-guarded-route-'));
  process.env.DEAD_LETTER_DIR = tempDir;
  process.env.WORKFLOW_INTERNAL_TOKEN = 'test-internal-token';
  process.env.WORKFLOW_CALLER_ROLE = 'lead';
});

afterEach(async () => {
  await rm(tempDir, { recursive: true, force: true });
  delete process.env.DEAD_LETTER_DIR;
  delete process.env.WORKFLOW_INTERNAL_TOKEN;
  delete process.env.WORKFLOW_CALLER_ROLE;
});

function buildRequest(body: Record<string, unknown>, headers?: Record<string, string>) {
  return new NextRequest('http://localhost/api/workflows/guarded-action', {
    method: 'POST',
    headers: {
      'content-type': 'application/json',
      authorization: 'Bearer test-internal-token',
      ...(headers ?? {}),
    },
    body: JSON.stringify(body),
  });
}

describe('/api/workflows/guarded-action route', () => {
  it('authorizes allowed actor for ready_to_generate', async () => {
    const response = await guardedActionPost(
      buildRequest({
        eventId: 'EVT-301',
        runId: 'run-301',
        action: 'ready_to_generate',
      })
    );

    expect(response.status).toBe(200);
    const data = await response.json();
    expect(data.authorized).toBe(true);
    expect(data.actorRole).toBe('lead');
  });

  it('ignores caller-supplied actor role and uses trusted caller role', async () => {
    const response = await guardedActionPost(
      buildRequest(
        {
          eventId: 'EVT-302',
          runId: 'run-302',
          action: 'ready_to_generate',
          actorRole: 'admin',
        },
        {
          'x-actor-role': 'admin',
        }
      )
    );

    expect(response.status).toBe(200);
    const data = await response.json();
    expect(data.authorized).toBe(true);
    expect(data.actorRole).toBe('lead');
  });

  it('blocks unauthorized trusted role and writes role_guard_blocked dead-letter', async () => {
    process.env.WORKFLOW_CALLER_ROLE = 'chef';

    const response = await guardedActionPost(
      buildRequest({
        eventId: 'EVT-303',
        runId: 'run-303',
        action: 'ready_to_generate',
        actorRole: 'admin',
      })
    );

    expect(response.status).toBe(403);
    const data = await response.json();
    expect(data.authorized).toBe(false);
    expect(data.deadLetter.reason).toBe('role_guard_blocked');

    const entries = await listDeadLetters('role_guard_blocked');
    expect(entries).toHaveLength(1);
    expect(entries[0].eventId).toBe('EVT-303');
    expect(entries[0].stage).toBe('authorization_guard');
  });
});
