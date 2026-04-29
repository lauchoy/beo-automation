import { beforeEach, afterEach, describe, expect, it } from 'vitest';
import { mkdtemp, rm } from 'fs/promises';
import os from 'os';
import path from 'path';
import { NextRequest } from 'next/server';
import { POST as dispatchPost } from '@/app/api/workflows/dispatch/route';
import { POST as terminalStatusPost } from '@/app/api/workflows/terminal-status/route';
import { GET as deadLettersGet } from '@/app/api/workflows/dead-letters/route';
import { POST as replayPost } from '@/app/api/workflows/dead-letters/replay/route';
import { POST as guardedActionPost } from '@/app/api/workflows/guarded-action/route';

let tempDir: string;

beforeEach(async () => {
  tempDir = await mkdtemp(path.join(os.tmpdir(), 'rosalynn-workflow-auth-'));
  process.env.DEAD_LETTER_DIR = tempDir;
  process.env.WORKFLOW_INTERNAL_TOKEN = 'test-internal-token';
  process.env.WORKFLOW_CALLER_ROLE = 'system';
});

afterEach(async () => {
  await rm(tempDir, { recursive: true, force: true });
  delete process.env.DEAD_LETTER_DIR;
  delete process.env.WORKFLOW_INTERNAL_TOKEN;
  delete process.env.WORKFLOW_CALLER_ROLE;
});

function buildPostRequest(
  url: string,
  body: Record<string, unknown>,
  includeAuth: boolean
) {
  return new NextRequest(url, {
    method: 'POST',
    headers: {
      'content-type': 'application/json',
      ...(includeAuth
        ? { authorization: 'Bearer test-internal-token' }
        : {}),
    },
    body: JSON.stringify(body),
  });
}

function buildGetRequest(url: string, includeAuth: boolean) {
  return new NextRequest(url, {
    method: 'GET',
    headers: includeAuth
      ? { authorization: 'Bearer test-internal-token' }
      : undefined,
  });
}

describe('workflow route auth gate', () => {
  it('returns 401 for all workflow routes when auth is missing', async () => {
    const responses = await Promise.all([
      dispatchPost(
        buildPostRequest(
          'http://localhost/api/workflows/dispatch',
          {
            eventId: 'EVT-AUTH-1',
            runId: 'run-auth-1',
            version: 1,
            dispatches: [
              {
                audience: 'kitchen',
                recipientEmail: 'kitchen@example.com',
                documentUrl: 'https://files.example.com/EVT-AUTH-1_v01_kitchen.pdf',
              },
            ],
          },
          false
        )
      ),
      terminalStatusPost(
        buildPostRequest(
          'http://localhost/api/workflows/terminal-status',
          {
            eventId: 'EVT-AUTH-2',
            runId: 'run-auth-2',
            status: 'Error',
          },
          false
        )
      ),
      deadLettersGet(
        buildGetRequest(
          'http://localhost/api/workflows/dead-letters?reason=terminal_status_write_failed',
          false
        )
      ),
      replayPost(
        buildPostRequest(
          'http://localhost/api/workflows/dead-letters/replay',
          {
            reason: 'terminal_status_write_failed',
            id: 'missing-entry',
          },
          false
        )
      ),
      guardedActionPost(
        buildPostRequest(
          'http://localhost/api/workflows/guarded-action',
          {
            eventId: 'EVT-AUTH-3',
            runId: 'run-auth-3',
            action: 'ready_to_generate',
          },
          false
        )
      ),
    ]);

    for (const response of responses) {
      expect(response.status).toBe(401);
    }
  });
});
