# Supabase Dead-Letter Backend Runbook

Use this when running the API on serverless/cloud where local filesystem durability is weak.

## 1) Apply SQL objects

Run the SQL in:

- `docs/operations/supabase-dead-letter.sql`

This creates:

- `public.dead_letters` table
- `public.dead_letter_claim(...)` RPC for atomic replay claims
- `public.dead_letter_prune_if_oversize(...)` RPC for DB-size-triggered pruning

## 2) Set runtime env

Set these on the API runtime (via Doppler + host env injection):

- `DEAD_LETTER_BACKEND=supabase`
- `SUPABASE_URL=<https://<project-ref>.supabase.co>`
- `SUPABASE_SERVICE_ROLE_KEY=<service role key>`

Optional pruning thresholds:

- `DEAD_LETTER_MAX_DB_MB=470`
- `DEAD_LETTER_TARGET_DB_MB=430`
- `DEAD_LETTER_MAX_DELETE_BATCH=2000`

## 3) Optional scheduled prune safety net

Even though write-path pruning is enabled, schedule a periodic prune in Supabase Cron.

Example (every 10 minutes):

```sql
select cron.schedule(
  'dead-letter-prune',
  '*/10 * * * *',
  $$select * from public.dead_letter_prune_if_oversize(470, 430, 2000);$$
);
```

Disable/remove:

```sql
select cron.unschedule('dead-letter-prune');
```

## 4) Retention behavior

When DB size exceeds `DEAD_LETTER_MAX_DB_MB`:

1. Resolved dead letters are deleted first (oldest first).
2. If still oversized, unresolved dead letters are trimmed oldest-first.

This prevents hard read-only incidents on free-tier limits while preserving freshest incidents.
