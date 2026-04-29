# Reliability Controls: Recipient Guard + Dead-Letter Fallback

This project now includes two production safety controls for BEO generation:

1. Recipient mismatch guard (pre-send)
2. Dead-letter fallback for terminal status write failures
3. Role guardrails for sensitive state/actions

Authentication contract (required):
- All `/api/workflows/*` routes require `Authorization: Bearer <WORKFLOW_INTERNAL_TOKEN>`.
- Caller role is derived from trusted runtime config (`WORKFLOW_CALLER_ROLE`), not request body/header.

Important durability note:
- `DEAD_LETTER_DIR` must point to persistent storage in production (mounted volume, network file system, or equivalent).
- Do not rely on ephemeral serverless filesystem for dead-letter retention.

## 1) Recipient Mismatch Guard

Endpoint:
- `POST /api/workflows/dispatch`

What it does:
- Validates each dispatch record before send.
- Blocks sends when audience/document mapping is inconsistent.
- Persists blocked payload to dead-letter storage with reason `recipient_mismatch_blocked`.

### Request example

```json
{
  "eventId": "EVT-028",
  "runId": "run-20260427-001",
  "version": 3,
  "dispatches": [
    {
      "audience": "kitchen",
      "recipientEmail": "kitchen@rosalynn.co",
      "documentUrl": "https://files.example.com/EVT-028_v03_kitchen.pdf",
      "documentAudience": "kitchen",
      "documentVersion": 3
    }
  ]
}
```

### Blocked response example (`409`)

```json
{
  "ok": false,
  "blocked": true,
  "message": "Dispatch blocked: recipient/document mismatch detected.",
  "mismatches": [
    {
      "index": 0,
      "expectedAudience": "kitchen",
      "actualAudience": "client"
    }
  ],
  "deadLetter": {
    "id": "...",
    "reason": "recipient_mismatch_blocked"
  }
}
```

## 2) Dead-Letter Fallback for Terminal Status Writes

Endpoint:
- `POST /api/workflows/terminal-status`

What it does:
- Attempts primary terminal-status write (`Generated`/`Error`).
- On failure, persists the failed write request into dead-letter storage with reason `terminal_status_write_failed`.
- Returns `202` when fallback is used.

### Request example

```json
{
  "eventId": "EVT-028",
  "runId": "run-20260427-001",
  "status": "Error",
  "message": "Carbone render timeout",
  "metadata": {
    "step": "Render Client PDF"
  }
}
```

### Fallback response example (`202`)

```json
{
  "ok": false,
  "fallbackUsed": true,
  "message": "Primary terminal status write failed. Persisted event to dead-letter queue for replay.",
  "deadLetter": {
    "id": "...",
    "reason": "terminal_status_write_failed"
  }
}
```

## Dead-Letter Operations

### List dead letters

- `GET /api/workflows/dead-letters`
- `GET /api/workflows/dead-letters?reason=terminal_status_write_failed&limit=50`
- `GET /api/workflows/dead-letters?reason=recipient_mismatch_blocked&includeResolved=true`

### Replay / resolve

Endpoint:
- `POST /api/workflows/dead-letters/replay`

Replay concurrency guard:
- Dead-letter replay now uses a claim lock per entry.
- If another process is replaying the same ID, the route returns `409`.

Replay terminal-status entry:

```json
{
  "reason": "terminal_status_write_failed",
  "id": "<dead-letter-id>",
  "resolvedBy": "oncall-operator"
}
```

Manual resolve for recipient mismatch (after payload correction out of band):

```json
{
  "reason": "recipient_mismatch_blocked",
  "id": "<dead-letter-id>",
  "manualResolve": true,
  "resolvedBy": "oncall-operator",
  "resolutionNote": "Mapping corrected in n8n and re-run succeeded"
}
```

## n8n Integration Pattern

Use these routes in the generation workflow:

1. Before email send: call `/api/workflows/dispatch`
2. On completion/failure write: call `/api/workflows/terminal-status`
3. Reconciliation workflow: poll `/api/workflows/dead-letters` and replay via `/api/workflows/dead-letters/replay`

This closes both critical reliability gaps without introducing extra infrastructure.

## Role Guardrails

Endpoint:
- `POST /api/workflows/guarded-action`

Use this before sensitive operations:
- `ready_to_generate`
- `resend_latest_version`
- `view_version_history`
- dead-letter replay / manual resolve

If denied, the endpoint returns `403` and writes a dead-letter entry with reason `role_guard_blocked`.
Caller-supplied `actorRole` is treated as audit metadata only and does not control authorization.

### Role policy presets by environment

Generate a preset env line:

```bash
npm run role-policy:seed -- --env production
```

Write a preset into an env file:

```bash
npm run role-policy:seed -- --env staging --write .env.local
```

## n8n Import Runbook

For workflow import order, node-level credential mapping, and smoke-test procedures, use:

- `docs/operations/n8n-import-checklist.md`
