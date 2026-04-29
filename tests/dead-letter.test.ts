import { afterEach, beforeEach, describe, expect, it } from 'vitest';
import { mkdtemp, rm } from 'fs/promises';
import os from 'os';
import path from 'path';
import {
  listDeadLetters,
  markDeadLetterResolved,
  writeDeadLetter,
} from '@/lib/reliability/dead-letter';

let tempDir: string;

beforeEach(async () => {
  tempDir = await mkdtemp(path.join(os.tmpdir(), 'rosalynn-dead-letter-'));
  process.env.DEAD_LETTER_DIR = tempDir;
});

afterEach(async () => {
  await rm(tempDir, { recursive: true, force: true });
  delete process.env.DEAD_LETTER_DIR;
});

describe('dead letter queue', () => {
  it('writes and lists dead-letter entries', async () => {
    await writeDeadLetter({
      reason: 'terminal_status_write_failed',
      eventId: 'EVT-200',
      runId: 'run-200',
      stage: 'terminal_status_write',
      errorMessage: 'upstream timeout',
      payload: { status: 'Error' },
    });

    const entries = await listDeadLetters('terminal_status_write_failed');
    expect(entries).toHaveLength(1);
    expect(entries[0].eventId).toBe('EVT-200');
    expect(entries[0].stage).toBe('terminal_status_write');
  });

  it('hides resolved entries by default', async () => {
    const entry = await writeDeadLetter({
      reason: 'recipient_mismatch_blocked',
      eventId: 'EVT-201',
      runId: 'run-201',
      stage: 'pre_send_guard',
      errorMessage: 'mismatch',
      payload: { audience: 'client' },
    });

    await markDeadLetterResolved(
      'recipient_mismatch_blocked',
      entry.id,
      'ops-manager',
      'fixed mapping'
    );

    const unresolved = await listDeadLetters('recipient_mismatch_blocked');
    expect(unresolved).toHaveLength(0);

    const all = await listDeadLetters('recipient_mismatch_blocked', {
      includeResolved: true,
    });
    expect(all).toHaveLength(1);
  });
});
