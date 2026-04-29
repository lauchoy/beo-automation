import { promises as fs } from 'fs';
import path from 'path';
import { randomUUID } from 'crypto';
import { z } from 'zod';

export const DeadLetterReasonSchema = z.enum([
  'terminal_status_write_failed',
  'recipient_mismatch_blocked',
  'role_guard_blocked',
]);

export type DeadLetterReason = z.infer<typeof DeadLetterReasonSchema>;

export const DeadLetterEntrySchema = z.object({
  id: z.string(),
  reason: DeadLetterReasonSchema,
  createdAt: z.string(),
  eventId: z.string(),
  runId: z.string(),
  stage: z.string(),
  errorMessage: z.string(),
  payload: z.unknown(),
});

export type DeadLetterEntry = z.infer<typeof DeadLetterEntrySchema>;

const DeadLetterResolutionSchema = z.object({
  id: z.string(),
  resolvedAt: z.string(),
  resolvedBy: z.string(),
  resolutionNote: z.string().optional(),
});

type DeadLetterResolution = z.infer<typeof DeadLetterResolutionSchema>;

const DeadLetterClaimSchema = z.object({
  id: z.string(),
  claimToken: z.string(),
  claimedAt: z.string(),
  claimedBy: z.string(),
  expiresAt: z.string(),
});

type DeadLetterClaim = z.infer<typeof DeadLetterClaimSchema>;

export interface WriteDeadLetterInput {
  reason: DeadLetterReason;
  eventId: string;
  runId: string;
  stage: string;
  errorMessage: string;
  payload: unknown;
}

export interface ListDeadLettersOptions {
  includeResolved?: boolean;
  limit?: number;
}

export interface ClaimDeadLetterOptions {
  ttlSeconds?: number;
}

export interface ClaimDeadLetterResult {
  claimed: boolean;
  claimToken?: string;
  existingClaim?: {
    claimedBy: string;
    claimedAt: string;
    expiresAt: string;
  };
}

const DEAD_LETTER_FILE_BY_REASON: Record<DeadLetterReason, string> = {
  terminal_status_write_failed: 'terminal-status-write-failures.jsonl',
  recipient_mismatch_blocked: 'recipient-mismatch-blocked.jsonl',
  role_guard_blocked: 'role-guard-blocked.jsonl',
};

function getDeadLetterDir(): string {
  return process.env.DEAD_LETTER_DIR ?? path.join(process.cwd(), 'data', 'dead-letter');
}

function getDeadLetterFilePath(reason: DeadLetterReason): string {
  return path.join(getDeadLetterDir(), DEAD_LETTER_FILE_BY_REASON[reason]);
}

function getResolutionFilePath(reason: DeadLetterReason): string {
  return `${getDeadLetterFilePath(reason)}.resolved`;
}

function getClaimDirPath(reason: DeadLetterReason): string {
  return path.join(getDeadLetterDir(), 'claims', reason);
}

function getClaimFilePath(reason: DeadLetterReason, id: string): string {
  return path.join(getClaimDirPath(reason), `${id}.json`);
}

async function ensureDeadLetterDir(): Promise<void> {
  await fs.mkdir(getDeadLetterDir(), { recursive: true });
}

async function ensureClaimDir(reason: DeadLetterReason): Promise<void> {
  await fs.mkdir(getClaimDirPath(reason), { recursive: true });
}

async function appendJsonLine(filePath: string, value: unknown): Promise<void> {
  await ensureDeadLetterDir();
  await fs.appendFile(filePath, `${JSON.stringify(value)}\n`, 'utf8');
}

function parseJsonLines<T>(raw: string): T[] {
  return raw
    .split('\n')
    .map(line => line.trim())
    .filter(Boolean)
    .flatMap(line => {
      try {
        return [JSON.parse(line) as T];
      } catch {
        return [];
      }
    });
}

async function readJsonLinesFile<T>(filePath: string): Promise<T[]> {
  try {
    const raw = await fs.readFile(filePath, 'utf8');
    return parseJsonLines<T>(raw);
  } catch (error) {
    if ((error as NodeJS.ErrnoException).code === 'ENOENT') {
      return [];
    }

    throw error;
  }
}

async function loadResolvedIdSet(reason: DeadLetterReason): Promise<Set<string>> {
  const resolutionFilePath = getResolutionFilePath(reason);
  const resolutions = await readJsonLinesFile<DeadLetterResolution>(resolutionFilePath);

  return new Set(
    resolutions
      .map(item => {
        const parsed = DeadLetterResolutionSchema.safeParse(item);
        return parsed.success ? parsed.data.id : null;
      })
      .filter((id): id is string => id !== null)
  );
}

async function readClaimFile(
  reason: DeadLetterReason,
  id: string
): Promise<DeadLetterClaim | null> {
  const claimPath = getClaimFilePath(reason, id);

  try {
    const raw = await fs.readFile(claimPath, 'utf8');
    const parsed = DeadLetterClaimSchema.safeParse(JSON.parse(raw));
    return parsed.success ? parsed.data : null;
  } catch (error) {
    if ((error as NodeJS.ErrnoException).code === 'ENOENT') {
      return null;
    }

    return null;
  }
}

export async function writeDeadLetter(
  input: WriteDeadLetterInput
): Promise<DeadLetterEntry> {
  const entry: DeadLetterEntry = {
    id: randomUUID(),
    reason: input.reason,
    createdAt: new Date().toISOString(),
    eventId: input.eventId,
    runId: input.runId,
    stage: input.stage,
    errorMessage: input.errorMessage,
    payload: input.payload,
  };

  await appendJsonLine(getDeadLetterFilePath(input.reason), entry);

  return entry;
}

export async function listDeadLetters(
  reason: DeadLetterReason,
  options: ListDeadLettersOptions = {}
): Promise<DeadLetterEntry[]> {
  const entries = await readJsonLinesFile<DeadLetterEntry>(getDeadLetterFilePath(reason));
  const parsedEntries = entries
    .map(item => DeadLetterEntrySchema.safeParse(item))
    .filter(result => result.success)
    .map(result => result.data);

  const resolvedIds = options.includeResolved ? new Set<string>() : await loadResolvedIdSet(reason);
  const unresolvedEntries = parsedEntries.filter(entry => !resolvedIds.has(entry.id));

  if (options.limit && options.limit > 0) {
    return unresolvedEntries.slice(-options.limit).reverse();
  }

  return unresolvedEntries.reverse();
}

export async function getDeadLetterById(
  reason: DeadLetterReason,
  id: string
): Promise<DeadLetterEntry | null> {
  const entries = await listDeadLetters(reason, { includeResolved: true });
  const match = entries.find(entry => entry.id === id);
  return match ?? null;
}

export async function isDeadLetterResolved(
  reason: DeadLetterReason,
  id: string
): Promise<boolean> {
  const resolvedIds = await loadResolvedIdSet(reason);
  return resolvedIds.has(id);
}

export async function claimDeadLetter(
  reason: DeadLetterReason,
  id: string,
  claimedBy: string,
  options: ClaimDeadLetterOptions = {}
): Promise<ClaimDeadLetterResult> {
  const ttlSeconds = options.ttlSeconds ?? 120;
  const claimPath = getClaimFilePath(reason, id);
  await ensureDeadLetterDir();
  await ensureClaimDir(reason);

  const now = new Date();
  const claim: DeadLetterClaim = {
    id,
    claimToken: randomUUID(),
    claimedAt: now.toISOString(),
    claimedBy,
    expiresAt: new Date(now.getTime() + ttlSeconds * 1000).toISOString(),
  };

  for (let attempt = 0; attempt < 2; attempt += 1) {
    try {
      const handle = await fs.open(claimPath, 'wx');
      await handle.writeFile(JSON.stringify(claim), 'utf8');
      await handle.close();
      return {
        claimed: true,
        claimToken: claim.claimToken,
      };
    } catch (error) {
      if ((error as NodeJS.ErrnoException).code !== 'EEXIST') {
        throw error;
      }
    }

    const existingClaim = await readClaimFile(reason, id);
    if (existingClaim) {
      const expiry = new Date(existingClaim.expiresAt).getTime();
      if (Number.isFinite(expiry) && expiry <= Date.now()) {
        await releaseDeadLetterClaim(reason, id, existingClaim.claimToken).catch(() => {});
        continue;
      }

      return {
        claimed: false,
        existingClaim: {
          claimedBy: existingClaim.claimedBy,
          claimedAt: existingClaim.claimedAt,
          expiresAt: existingClaim.expiresAt,
        },
      };
    }

    return {
      claimed: false,
    };
  }

  return {
    claimed: false,
  };
}

export async function markDeadLetterResolved(
  reason: DeadLetterReason,
  id: string,
  resolvedBy: string,
  resolutionNote?: string
): Promise<void> {
  const resolution: DeadLetterResolution = {
    id,
    resolvedAt: new Date().toISOString(),
    resolvedBy,
    resolutionNote,
  };

  await appendJsonLine(getResolutionFilePath(reason), resolution);
}

export async function releaseDeadLetterClaim(
  reason: DeadLetterReason,
  id: string,
  claimToken?: string
): Promise<void> {
  const claimPath = getClaimFilePath(reason, id);

  if (!claimToken) {
    await fs.unlink(claimPath).catch(() => {});
    return;
  }

  const existingClaim = await readClaimFile(reason, id);
  if (!existingClaim || existingClaim.claimToken !== claimToken) {
    return;
  }

  await fs.unlink(claimPath).catch(() => {});
}
