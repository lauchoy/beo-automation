# n8n Import Checklist and Credential Mapping

This runbook is for importing and safely activating:

- `workflows/n8n/rosalynn-beo-generation-v1.json`
- `workflows/n8n/rosalynn-beo-dead-letter-reconcile-v1.json`

## 1) Preconditions

1. Next.js API is reachable from n8n at `INTERNAL_API_BASE_URL`.
2. Dead-letter storage is persistent on the API runtime (`DEAD_LETTER_DIR`).
3. Composio endpoint and API key are available to n8n.
4. Role policy is set (default or seeded override via `npm run role-policy:seed`).
5. Internal workflow token is set on API runtime (`WORKFLOW_INTERNAL_TOKEN`) and in n8n credential.

## 2) Required Environment Variables

| Location | Variable | Required | Purpose |
|---|---|---:|---|
| n8n | `INTERNAL_API_BASE_URL` | Yes | Base URL for `/api/workflows/*` guard, status, and dead-letter endpoints |
| n8n | `COMPOSIO_MULTI_EXECUTE_URL` | Yes | URL used by `Fetch Ready Events` node |
| n8n | `COMPOSIO_API_KEY` | Yes | Bearer/API key for Composio endpoint auth |
| n8n | `WORKFLOW_INTERNAL_TOKEN` | Yes | Bearer token used on all `/api/workflows/*` API calls |
| API runtime | `WORKFLOW_INTERNAL_TOKEN` | Yes | Shared token used to authenticate internal workflow calls |
| API runtime | `WORKFLOW_CALLER_ROLE` | Yes | Trusted caller role for workflow authorization (`system` default) |
| API runtime | `DEAD_LETTER_DIR` | Yes | Persistent JSONL dead-letter store |
| API runtime | `WORKFLOW_ROLE_POLICY_OVERRIDES` | Optional | Override default role policy |
| API runtime | `TERMINAL_STATUS_WEBHOOK_URL` | Optional | Real terminal status write target |
| API runtime | `SIMULATE_TERMINAL_STATUS_FAILURE` | Optional | Set `true` only for failure-path drills |

## 3) n8n Credentials to Create

### Credential A: `Composio API` (HTTP Header Auth)
- Type: `HTTP Header Auth`
- Header name: `Authorization`
- Header value: `Bearer {{$env.COMPOSIO_API_KEY}}`

### Credential B: `Internal Workflow API` (choose one)
- Required:
  - Type: `HTTP Header Auth`
  - Header name: `Authorization`
  - Header value: `Bearer {{$env.WORKFLOW_INTERNAL_TOKEN}}`

## 4) Import Steps

1. In n8n, import both JSON workflow files from `workflows/n8n/`.
2. Open each HTTP Request node and assign credentials per mapping table below.
3. Ensure all expression URLs resolve (no red expression errors).
4. Save workflows.
5. Run manual tests before enabling schedules.

## 5) Node Credential Mapping

## 5.1 `rosalynn-beo-generation-v1`

| Node | Type | URL / Action | Credential | Expected Success | Failure Behavior |
|---|---|---|---|---|---|
| `Schedule Trigger` | Schedule Trigger | Every 5 min | n/a | Starts workflow | n/a |
| `Fetch Ready Events` | HTTP Request | `{{$env.COMPOSIO_MULTI_EXECUTE_URL}}` | `Composio API` | `200` with event items | Stop run; inspect Composio auth/payload |
| `Split Events` | Split In Batches | One event per batch | n/a | Iterates items | Empty input ends cleanly |
| `Build Dispatch Payload` | Code | Build `eventId/runId/version/dispatches` | n/a | Emits payload JSON | Script error fails run |
| `Authorize Ready To Generate` | HTTP Request | `POST /api/workflows/guarded-action` (`ready_to_generate`) | `Internal Workflow API` | `200` with `authorized=true` | `401` missing/invalid token; `403` denied and written as `role_guard_blocked` dead-letter |
| `Recipient Mismatch Guard` | HTTP Request | `POST /api/workflows/dispatch` | `Internal Workflow API` | `200` with `blocked=false` | `401` missing/invalid token; `409` blocked and written as `recipient_mismatch_blocked` |
| `IF Guard Blocked` | IF | Route on `blocked` | n/a | Branches correctly | Miswired condition sends wrong branch |
| `Mark Error` | HTTP Request | `POST /api/workflows/terminal-status` (`Error`) | `Internal Workflow API` | `200` or `202` | `401` missing/invalid token; `202` means dead-letter fallback engaged |
| `Send Emails` | Code placeholder | Replace with actual delivery path | n/a | Should emit send result | Placeholder currently no-op send |
| `Mark Generated` | HTTP Request | `POST /api/workflows/terminal-status` (`Generated`) | `Internal Workflow API` | `200` or `202` | `401` missing/invalid token; `202` means dead-letter fallback engaged |

## 5.2 `rosalynn-beo-dead-letter-reconcile-v1`

| Node | Type | URL / Action | Credential | Expected Success | Failure Behavior |
|---|---|---|---|---|---|
| `Schedule Trigger` | Schedule Trigger | Every 10 min | n/a | Starts workflow | n/a |
| `Fetch Dead Letters` | HTTP Request | `GET /api/workflows/dead-letters?reason=terminal_status_write_failed&limit=100` | `Internal Workflow API` | `200` with entries array | `401` missing/invalid token; stop run and verify auth |
| `Explode Entries` | Code | Flatten entries array | n/a | One item per dead-letter | Empty array ends cleanly |
| `Authorize Dead Letter Replay` | HTTP Request | `POST /api/workflows/guarded-action` (`dead_letter_replay`) | `Internal Workflow API` | `200` with `authorized=true` | `401` missing/invalid token; `403` denied and written as `role_guard_blocked` |
| `Replay Entry` | HTTP Request | `POST /api/workflows/dead-letters/replay` | `Internal Workflow API` | `200` replay success | `401` missing/invalid token; `409` already claimed/manual-resolve needed; `202` replay failed and re-queued; `403` role denied |

## 6) Post-Import Smoke Test (Required)

1. Manual run `rosalynn-beo-generation-v1` with a known good payload.
2. Verify route sequence reaches `Mark Generated`.
3. Manual failure drill:
   - Temporarily set `SIMULATE_TERMINAL_STATUS_FAILURE=true` on API runtime.
   - Re-run generation path and confirm `terminal_status_write_failed` entries appear.
4. Manual mismatch drill:
   - Force one dispatch audience/document mismatch and confirm `409` from guard.
5. Manual replay drill:
   - Run `rosalynn-beo-dead-letter-reconcile-v1` and verify unresolved dead-letters decrease.

## 7) Operational Guardrails

- Never enable schedules until manual run is clean.
- Keep `Send Emails` placeholder replaced before production enablement.
- Keep role policy under change control:
  - Generate preset with `npm run role-policy:seed -- --env <env>`
  - Apply to runtime config and record change in release notes.
