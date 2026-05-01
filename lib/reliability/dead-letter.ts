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

const SUPABASE_TABLE = 'dead_letters';
const SUPABASE_CLAIM_RPC = 'dead_letter_claim';
const SUPABASE_PRUNE_RPC = 'dead_letter_prune_if_oversize';

function getDeadLetterDir(): string {
  return process.env.DEAD_LETTER_DIR ?? path.join(process.cwd(), 'data', 'dead-letter');
}

function getDeadLetterBackend(): 'file' | 'supabase' {
  return process.env.DEAD_LETTER_BACKEND === 'supabase' ? 'supabase' : 'file';
}

function usingSupabaseBackend(): boolean {
  return getDeadLetterBackend() === 'supabase';
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

async function readClaimFile(reason: DeadLetterReason, id: string): Promise<DeadLetterClaim | null> {
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

function getSupabaseConfig(): { url: string; serviceRoleKey: string } {
  const url = process.env.SUPABASE_URL?.trim();
  const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY?.trim();

  if (!url || !serviceRoleKey) {
    throw new Error(
      'Server misconfiguration: SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY are required when DEAD_LETTER_BACKEND=supabase.'
    );
  }

  return {
    url: url.replace(/\/$/, ''),
    serviceRoleKey,
  };
}

async function supabaseRequest<T>(
  endpoint: string,
  init: RequestInit = {},
  options: { allow404?: boolean } = {}
): Promise<T> {
  const { url, serviceRoleKey } = getSupabaseConfig();

  const headers = new Headers(init.headers ?? {});
  headers.set('apikey', serviceRoleKey);
  headers.set('Authorization', `Bearer ${serviceRoleKey}`);
  if (!headers.has('Content-Type') && init.body) {
    headers.set('Content-Type', 'application/json');
  }

  const response = await fetch(`${url}${endpoint}`, {
    ...init,
    headers,
  });

  if (!response.ok) {
    if (options.allow404 && response.status === 404) {
      return null as T;
    }

    const body = await response.text();
    throw new Error(`Supabase request failed (${response.status}): ${body}`);
  }

  if (response.status === 204) {
    return null as T;
  }

  return (await response.json()) as T;
}

type SupabaseDeadLetterRow = {
  id: string;
  reason: DeadLetterReason;
  created_at: string;
  event_id: string;
  run_id: string;
  stage: string;
  error_message: string;
  payload: unknown;
  resolved_at: string | null;
  resolved_by: string | null;
  resolution_note: string | null;
  claim_token: string | null;
  claimed_at: string | null;
  claimed_by: string | null;
  claim_expires_at: string | null;
};

type SupabaseClaimRow = {
  claimed: boolean;
  claim_token: string | null;
  existing_claimed_by: string | null;
  existing_claimed_at: string | null;
  existing_claim_expires_at: string | null;
};

function mapSupabaseRowToEntry(row: SupabaseDeadLetterRow): DeadLetterEntry | null {
  const parsed = DeadLetterEntrySchema.safeParse({
    id: row.id,
    reason: row.reason,
    createdAt: row.created_at,
    eventId: row.event_id,
    runId: row.run_id,
    stage: row.stage,
    errorMessage: row.error_message,
    payload: row.payload,
  });

  if (!parsed.success) {
    return null;
  }

  return parsed.data;
}

async function pruneSupabaseDeadLetters(): Promise<void> {
  const maxDbMb = Number(process.env.DEAD_LETTER_MAX_DB_MB ?? '470');
  const targetDbMb = Number(process.env.DEAD_LETTER_TARGET_DB_MB ?? '430');
  const maxDeleteBatch = Number(process.env.DEAD_LETTER_MAX_DELETE_BATCH ?? '2000');

  if (!Number.isFinite(maxDbMb) || !Number.isFinite(targetDbMb) || !Number.isFinite(maxDeleteBatch)) {
    return;
  }

  await supabaseRequest(`/rest/v1/rpc/${SUPABASE_PRUNE_RPC}`, {
    method: 'POST',
    body: JSON.stringify({
      p_max_db_mb: Math.floor(maxDbMb),
      p_target_db_mb: Math.floor(targetDbMb),
      p_max_delete_batch: Math.floor(maxDeleteBatch),
    }),
  });
}

async function writeDeadLetterFile(input: WriteDeadLetterInput): Promise<DeadLetterEntry> {
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

async function writeDeadLetterSupabase(input: WriteDeadLetterInput): Promise<DeadLetterEntry> {
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

  const row = {
    id: entry.id,
    reason: entry.reason,
    created_at: entry.createdAt,
    event_id: entry.eventId,
    run_id: entry.runId,
    stage: entry.stage,
    error_message: entry.errorMessage,
    payload: entry.payload,
  };

  const inserted = await supabaseRequest<SupabaseDeadLetterRow[]>(
    `/rest/v1/${SUPABASE_TABLE}`,
    {
      method: 'POST',
      headers: {
        Prefer: 'return=representation',
      },
      body: JSON.stringify(row),
    }
  );

  const mapped = inserted?.[0] ? mapSupabaseRowToEntry(inserted[0]) : null;

  if (mapped) {
    return mapped;
  }

  return entry;
}

async function listDeadLettersFile(
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

async function listDeadLettersSupabase(
  reason: DeadLetterReason,
  options: ListDeadLettersOptions = {}
): Promise<DeadLetterEntry[]> {
  const params = new URLSearchParams();
  params.set('reason', `eq.${reason}`);
  params.set('order', 'created_at.desc');

  if (!options.includeResolved) {
    params.set('resolved_at', 'is.null');
  }

  if (options.limit && options.limit > 0) {
    params.set('limit', String(Math.floor(options.limit)));
  }

  const rows = await supabaseRequest<SupabaseDeadLetterRow[]>(
    `/rest/v1/${SUPABASE_TABLE}?${params.toString()}`,
    {
      method: 'GET',
    }
  );

  return rows
    .map(mapSupabaseRowToEntry)
    .filter((entry): entry is DeadLetterEntry => entry !== null);
}

async function getDeadLetterByIdFile(reason: DeadLetterReason, id: string): Promise<DeadLetterEntry | null> {
  const entries = await listDeadLettersFile(reason, { includeResolved: true });
  const match = entries.find(entry => entry.id === id);
  return match ?? null;
}

async function getDeadLetterByIdSupabase(reason: DeadLetterReason, id: string): Promise<DeadLetterEntry | null> {
  const params = new URLSearchParams();
  params.set('reason', `eq.${reason}`);
  params.set('id', `eq.${id}`);
  params.set('limit', '1');

  const rows = await supabaseRequest<SupabaseDeadLetterRow[]>(
    `/rest/v1/${SUPABASE_TABLE}?${params.toString()}`,
    {
      method: 'GET',
    }
  );

  const first = rows?.[0];
  return first ? mapSupabaseRowToEntry(first) : null;
}

async function isDeadLetterResolvedFile(reason: DeadLetterReason, id: string): Promise<boolean> {
  const resolvedIds = await loadResolvedIdSet(reason);
  return resolvedIds.has(id);
}

async function isDeadLetterResolvedSupabase(reason: DeadLetterReason, id: string): Promise<boolean> {
  const params = new URLSearchParams();
  params.set('reason', `eq.${reason}`);
  params.set('id', `eq.${id}`);
  params.set('resolved_at', 'not.is.null');
  params.set('select', 'id');
  params.set('limit', '1');

  const rows = await supabaseRequest<Array<{ id: string }>>(
    `/rest/v1/${SUPABASE_TABLE}?${params.toString()}`,
    {
      method: 'GET',
    }
  );

  return Array.isArray(rows) && rows.length > 0;
}

async function claimDeadLetterFile(
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
        await releaseDeadLetterClaimFile(reason, id, existingClaim.claimToken).catch(() => {});
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

async function claimDeadLetterSupabase(
  reason: DeadLetterReason,
  id: string,
  claimedBy: string,
  options: ClaimDeadLetterOptions = {}
): Promise<ClaimDeadLetterResult> {
  const ttlSeconds = options.ttlSeconds ?? 120;

  const data = await supabaseRequest<SupabaseClaimRow | SupabaseClaimRow[]>(
    `/rest/v1/rpc/${SUPABASE_CLAIM_RPC}`,
    {
      method: 'POST',
      body: JSON.stringify({
        p_reason: reason,
        p_id: id,
        p_claimed_by: claimedBy,
        p_ttl_seconds: ttlSeconds,
      }),
    }
  );

  const row = Array.isArray(data) ? data[0] : data;

  if (!row || typeof row.claimed !== 'boolean') {
    return {
      claimed: false,
    };
  }

  if (row.claimed && row.claim_token) {
    return {
      claimed: true,
      claimToken: row.claim_token,
    };
  }

  if (row.existing_claimed_by && row.existing_claimed_at && row.existing_claim_expires_at) {
    return {
      claimed: false,
      existingClaim: {
        claimedBy: row.existing_claimed_by,
        claimedAt: row.existing_claimed_at,
        expiresAt: row.existing_claim_expires_at,
      },
    };
  }

  return {
    claimed: false,
  };
}

async function markDeadLetterResolvedFile(
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

async function markDeadLetterResolvedSupabase(
  reason: DeadLetterReason,
  id: string,
  resolvedBy: string,
  resolutionNote?: string
): Promise<void> {
  const params = new URLSearchParams();
  params.set('reason', `eq.${reason}`);
  params.set('id', `eq.${id}`);

  await supabaseRequest(
    `/rest/v1/${SUPABASE_TABLE}?${params.toString()}`,
    {
      method: 'PATCH',
      headers: {
        Prefer: 'return=minimal',
      },
      body: JSON.stringify({
        resolved_at: new Date().toISOString(),
        resolved_by: resolvedBy,
        resolution_note: resolutionNote ?? null,
      }),
    }
  );
}

async function releaseDeadLetterClaimFile(
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

async function releaseDeadLetterClaimSupabase(
  reason: DeadLetterReason,
  id: string,
  claimToken?: string
): Promise<void> {
  const params = new URLSearchParams();
  params.set('reason', `eq.${reason}`);
  params.set('id', `eq.${id}`);

  if (claimToken) {
    params.set('claim_token', `eq.${claimToken}`);
  }

  await supabaseRequest(
    `/rest/v1/${SUPABASE_TABLE}?${params.toString()}`,
    {
      method: 'PATCH',
      headers: {
        Prefer: 'return=minimal',
      },
      body: JSON.stringify({
        claim_token: null,
        claimed_at: null,
        claimed_by: null,
        claim_expires_at: null,
      }),
    }
  );
}

export async function writeDeadLetter(input: WriteDeadLetterInput): Promise<DeadLetterEntry> {
  if (!usingSupabaseBackend()) {
    return writeDeadLetterFile(input);
  }

  const entry = await writeDeadLetterSupabase(input);

  try {
    await pruneSupabaseDeadLetters();
  } catch (error) {
    console.warn('Failed to prune Supabase dead letters:', error);
  }

  return entry;
}

export async function listDeadLetters(
  reason: DeadLetterReason,
  options: ListDeadLettersOptions = {}
): Promise<DeadLetterEntry[]> {
  if (!usingSupabaseBackend()) {
    return listDeadLettersFile(reason, options);
  }

  return listDeadLettersSupabase(reason, options);
}

export async function getDeadLetterById(
  reason: DeadLetterReason,
  id: string
): Promise<DeadLetterEntry | null> {
  if (!usingSupabaseBackend()) {
    return getDeadLetterByIdFile(reason, id);
  }

  return getDeadLetterByIdSupabase(reason, id);
}

export async function isDeadLetterResolved(reason: DeadLetterReason, id: string): Promise<boolean> {
  if (!usingSupabaseBackend()) {
    return isDeadLetterResolvedFile(reason, id);
  }

  return isDeadLetterResolvedSupabase(reason, id);
}

export async function claimDeadLetter(
  reason: DeadLetterReason,
  id: string,
  claimedBy: string,
  options: ClaimDeadLetterOptions = {}
): Promise<ClaimDeadLetterResult> {
  if (!usingSupabaseBackend()) {
    return claimDeadLetterFile(reason, id, claimedBy, options);
  }

  return claimDeadLetterSupabase(reason, id, claimedBy, options);
}

export async function markDeadLetterResolved(
  reason: DeadLetterReason,
  id: string,
  resolvedBy: string,
  resolutionNote?: string
): Promise<void> {
  if (!usingSupabaseBackend()) {
    await markDeadLetterResolvedFile(reason, id, resolvedBy, resolutionNote);
    return;
  }

  await markDeadLetterResolvedSupabase(reason, id, resolvedBy, resolutionNote);
}

export async function releaseDeadLetterClaim(
  reason: DeadLetterReason,
  id: string,
  claimToken?: string
): Promise<void> {
  if (!usingSupabaseBackend()) {
    await releaseDeadLetterClaimFile(reason, id, claimToken);
    return;
  }

  await releaseDeadLetterClaimSupabase(reason, id, claimToken);
}
