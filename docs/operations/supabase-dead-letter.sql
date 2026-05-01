-- Supabase dead-letter durable store
-- Run in Supabase SQL editor for production use when DEAD_LETTER_BACKEND=supabase.

create extension if not exists pgcrypto;

create table if not exists public.dead_letters (
  id uuid primary key,
  reason text not null check (
    reason in ('terminal_status_write_failed', 'recipient_mismatch_blocked', 'role_guard_blocked')
  ),
  created_at timestamptz not null default now(),
  event_id text not null,
  run_id text not null,
  stage text not null,
  error_message text not null,
  payload jsonb not null,
  resolved_at timestamptz,
  resolved_by text,
  resolution_note text,
  claim_token uuid,
  claimed_at timestamptz,
  claimed_by text,
  claim_expires_at timestamptz
);

create index if not exists idx_dead_letters_reason_created
  on public.dead_letters (reason, created_at desc);

create index if not exists idx_dead_letters_reason_resolved_created
  on public.dead_letters (reason, resolved_at, created_at desc);

create index if not exists idx_dead_letters_claim_expires
  on public.dead_letters (claim_expires_at);

-- Optional: lock this table down to service-role only usage.
alter table public.dead_letters enable row level security;

-- These policies intentionally deny anon/authenticated access.
do $$
begin
  if not exists (
    select 1 from pg_policies
    where schemaname = 'public'
      and tablename = 'dead_letters'
      and policyname = 'dead_letters_deny_all_select'
  ) then
    create policy dead_letters_deny_all_select
      on public.dead_letters
      for select
      to anon, authenticated
      using (false);
  end if;

  if not exists (
    select 1 from pg_policies
    where schemaname = 'public'
      and tablename = 'dead_letters'
      and policyname = 'dead_letters_deny_all_modify'
  ) then
    create policy dead_letters_deny_all_modify
      on public.dead_letters
      for all
      to anon, authenticated
      using (false)
      with check (false);
  end if;
end
$$;

create or replace function public.dead_letter_claim(
  p_reason text,
  p_id uuid,
  p_claimed_by text,
  p_ttl_seconds integer default 120
)
returns table(
  claimed boolean,
  claim_token uuid,
  existing_claimed_by text,
  existing_claimed_at timestamptz,
  existing_claim_expires_at timestamptz
)
language plpgsql
security definer
set search_path = public
as $$
declare
  v_now timestamptz := now();
  v_ttl integer := greatest(p_ttl_seconds, 30);
  v_new_claim uuid := gen_random_uuid();
begin
  update public.dead_letters
  set claim_token = null,
      claimed_at = null,
      claimed_by = null,
      claim_expires_at = null
  where reason = p_reason
    and id = p_id
    and claim_expires_at is not null
    and claim_expires_at <= v_now;

  update public.dead_letters
  set claim_token = v_new_claim,
      claimed_at = v_now,
      claimed_by = p_claimed_by,
      claim_expires_at = v_now + make_interval(secs => v_ttl)
  where reason = p_reason
    and id = p_id
    and resolved_at is null
    and (claim_token is null or claim_expires_at <= v_now);

  if found then
    return query
    select true, v_new_claim, null::text, null::timestamptz, null::timestamptz;
    return;
  end if;

  return query
  select
    false,
    null::uuid,
    d.claimed_by,
    d.claimed_at,
    d.claim_expires_at
  from public.dead_letters d
  where d.reason = p_reason
    and d.id = p_id
  limit 1;
end;
$$;

-- Prunes old dead-letter records if total DB size exceeds threshold.
-- Deletion priority: resolved rows first, then oldest unresolved rows.
create or replace function public.dead_letter_prune_if_oversize(
  p_max_db_mb integer default 470,
  p_target_db_mb integer default 430,
  p_max_delete_batch integer default 2000
)
returns table(
  deleted_count integer,
  before_bytes bigint,
  after_bytes bigint
)
language plpgsql
security definer
set search_path = public
as $$
declare
  v_before bigint := pg_database_size(current_database());
  v_after bigint := v_before;
  v_target_bytes bigint := greatest(p_target_db_mb, 1)::bigint * 1024 * 1024;
  v_max_bytes bigint := greatest(p_max_db_mb, 1)::bigint * 1024 * 1024;
  v_limit integer := greatest(p_max_delete_batch, 100);
  v_deleted integer := 0;
  v_batch_deleted integer := 0;
begin
  if v_before <= v_max_bytes then
    return query select 0, v_before, v_before;
    return;
  end if;

  loop
    with candidates as (
      select id
      from public.dead_letters
      order by
        case when resolved_at is null then 1 else 0 end asc,
        coalesce(resolved_at, created_at) asc,
        created_at asc
      limit v_limit
    ),
    deleted as (
      delete from public.dead_letters d
      using candidates c
      where d.id = c.id
      returning 1
    )
    select count(*) into v_batch_deleted from deleted;

    v_deleted := v_deleted + v_batch_deleted;

    if v_batch_deleted = 0 then
      exit;
    end if;

    v_after := pg_database_size(current_database());

    exit when v_after <= v_target_bytes;
  end loop;

  v_after := pg_database_size(current_database());

  return query select v_deleted, v_before, v_after;
end;
$$;
