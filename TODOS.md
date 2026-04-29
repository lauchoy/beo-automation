# TODOS

## Infrastructure

- None currently deferred in this category.

## Completed

### Add dead-letter fallback for failed terminal status writes (completed 2026-04-27)

**What:** Persist failed `Mark Error` terminal-state updates to a durable dead-letter sink with replay support.

**Implemented:**
- `POST /api/workflows/terminal-status` now writes failed terminal updates to dead-letter (`terminal_status_write_failed`).
- `GET /api/workflows/dead-letters` provides queue inspection.
- `POST /api/workflows/dead-letters/replay` provides replay/resolution path.

**Files:**
- `app/api/workflows/terminal-status/route.ts`
- `app/api/workflows/dead-letters/route.ts`
- `app/api/workflows/dead-letters/replay/route.ts`
- `lib/reliability/dead-letter.ts`
- `lib/reliability/terminal-status-writer.ts`

### Add recipient mismatch guard before send (completed 2026-04-27)

**What:** Validate audience-to-document mapping before dispatch (`kitchen->kitchen PDF`, `service->service PDF`, `client->client PDF`).

**Implemented:**
- `POST /api/workflows/dispatch` validates audience, document audience inference, and document version.
- Mismatch blocks dispatch and writes dead-letter (`recipient_mismatch_blocked`) for operator triage.

**Files:**
- `app/api/workflows/dispatch/route.ts`
- `lib/reliability/recipient-guard.ts`
- `lib/reliability/dead-letter.ts`

### Add role-based transition guardrails for `Ready to Generate` and sensitive actions (completed 2026-04-28)

**What:** Enforce role checks on sensitive state transitions and replay operations.

**Implemented:**
- `POST /api/workflows/guarded-action` enforces role policy on:
  - `ready_to_generate`
  - `resend_latest_version`
  - `view_version_history`
  - dead-letter replay/manual resolve actions
- `POST /api/workflows/dead-letters/replay` now enforces role guard before replay.
- Denied attempts are persisted to dead-letter with reason `role_guard_blocked`.

**Files:**
- `app/api/workflows/guarded-action/route.ts`
- `app/api/workflows/dead-letters/replay/route.ts`
- `lib/reliability/role-guard.ts`
- `lib/reliability/dead-letter.ts`
