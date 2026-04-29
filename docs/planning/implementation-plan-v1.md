# Rosalynn BEO Automation - Implementation Plan (Greenfield, Reliable MVP)

Date: 2026-04-24
Project Root: /Users/jimmy/development/rosalynn-beo-automation

## 1) Repo + Planning Artifacts Moved
- Working repo moved:
  - from `/Users/jimmy/development/beo-automation`
  - to `/Users/jimmy/development/rosalynn-beo-automation`
- Existing design artifact moved and mirrored:
  - `~/.gstack/projects/rosalynn-beo-automation/jimmy-main-design-20260424-171621.md`
  - `/Users/jimmy/development/rosalynn-beo-automation/docs/planning/initial-office-hours-design.md`

## 2) Target Workflow (Business Requirements)
1. Chef fills event form in Notion (dropdowns + custom entries).
2. Notion creates event page from template.
3. Lead fills details manually and selects menu items.
4. Lead reviews/approves.
5. Lead marks status `Ready to Generate`.
6. Within 15 minutes, generate audience-specific BEO/PDFs:
   - Kitchen version
   - Service version
   - Client version
7. Email each audience its own version.
8. Versioning is mandatory:
   - Any edit => new version
   - PDF filename includes version + timestamp
   - Latest version always accessible
   - Changelog persisted (example: guest count 120->140).

## 3) Platforms, Connections, Credentials, Tooling

### Core Platforms
- Notion (source of truth and status/control plane)
- n8n (orchestration and retries)
- Carbone (templated document/PDF generation)
- Google Drive (storage/distribution links)
- Email provider (Gmail/SMTP/SendGrid)

### Required Connections/Credentials
- Notion via Composio:
  - Composio Notion toolkit connection (OAuth2/API key)
  - Confirmed active in this environment: `notion_alem-augury`
- Composio API access for n8n HTTP calls (or direct SDK runner)
  - `COMPOSIO_API_KEY`
- Carbone:
  - `CARBONE_API_TOKEN`
  - API base `https://api.carbone.io`
- Google Drive:
  - OAuth credential with create/upload/share permissions for target folder
- Email:
  - SMTP or Gmail OAuth credentials
  - Distribution lists (kitchen/service/client)
- n8n runtime:
  - For MVP: single instance + Postgres
  - For higher reliability/volume: queue mode with Redis + workers

### Tooling Needed
- n8n workflow export/import discipline (JSON in repo)
- One source-controlled config file for field mapping
- One source-controlled template version manifest (Carbone template IDs)

## 4) Platform Limitations and Mitigations

### Notion API / Composio-Notion
Limitations:
- Notion rate limit is ~3 req/s average per connection; 429 with Retry-After header.
- Request payload/property size limits apply (e.g., rich text, relation, URL sizes).
- Query pagination required (`has_more`, `next_cursor`).
- Composio Notion property updates are strict by type/name; mismatches error.

Mitigations:
- Use n8n throttling + retry with backoff and jitter.
- Keep payload small (store large blobs in Drive/object storage, not Notion fields).
- Always schema-preflight with `NOTION_FETCH_DATABASE` before writes.
- Make all write operations idempotent with `run_id` and `version_key`.

### n8n
Limitations:
- Single-instance mode is fastest to start but weaker for resilience at load.
- Queue mode requires Redis and shared DB; filesystem binary storage is not supported in queue mode.
- Workflow JSON exports include credential names/IDs (must sanitize before sharing).

Mitigations:
- MVP on single instance, strict retries/error workflow.
- Upgrade to queue mode when execution pressure rises.
- Store binary artifacts in Drive/S3, not local n8n filesystem.
- Use dedicated Error Workflow and execution pruning policies.

### Carbone
Limitations:
- `/render/{templateId}` default returns `renderId`; subsequent `/render/{renderId}` download is one-time.
- Async webhook mode gets one retry only by Carbone.
- Template changes can break tags if mapping drifts.

Mitigations:
- Use `?download=true` in synchronous paths when possible to reduce retrieval race.
- For async mode, treat webhook callbacks as at-least-once and enforce idempotency.
- Lock template tags with contract tests and versioned template IDs.

## 5) Reliability + Fast Iteration Strategy

### MVP Reliability Defaults (Day 1)
- Poll cadence: every 5 minutes (gives budget to meet <= 15 min SLA).
- Status state machine in Notion:
  - `Draft -> In Review -> Approved -> Ready to Generate -> Generating -> Generated`
  - `Error` as terminal error branch.
- Idempotency keys:
  - `run_id` (per execution)
  - `version_key = event_id + snapshot_hash`
- Circuit-breaker rules:
  - max retries per event: 3
  - move to `Error` with actionable reason after retry exhaustion
- Reconciliation workflow every 30 min:
  - find `Generating` older than threshold (e.g., 20 min)
  - requeue or error with reason

### Fast Iteration Practices
- Keep one `mapping.json` for Notion->template payload transformations.
- Keep one `templates.json` for template IDs by audience.
- Validate with 5-event canary set before broad rollout.
- Every workflow change: export n8n JSON into repo + short changelog entry.

## 6) Notion via Composio: Precise Tool Calling Plan

Use a fixed `session_id` per run and call tools through `COMPOSIO_MULTI_EXECUTE_TOOL`.

### Step A - Schema preflight (required)
Tool: `NOTION_FETCH_DATABASE`

```json
{
  "session_id": "<session>",
  "sync_response_to_workbench": false,
  "current_step": "SCHEMA_PREFLIGHT",
  "tools": [
    {
      "tool_slug": "NOTION_FETCH_DATABASE",
      "arguments": { "database_id": "<EVENT_DB_ID>" }
    },
    {
      "tool_slug": "NOTION_FETCH_DATABASE",
      "arguments": { "database_id": "<EVENT_VERSION_DB_ID>" }
    }
  ]
}
```

### Step B - Fetch events ready to generate
Tool: `NOTION_QUERY_DATABASE_WITH_FILTER`

```json
{
  "session_id": "<session>",
  "sync_response_to_workbench": false,
  "current_step": "FETCH_READY_EVENTS",
  "tools": [
    {
      "tool_slug": "NOTION_QUERY_DATABASE_WITH_FILTER",
      "arguments": {
        "database_id": "<EVENT_DB_ID>",
        "page_size": 100,
        "filter": {
          "property": "Workflow Status",
          "select": { "equals": "Ready to Generate" }
        },
        "sorts": [
          { "timestamp": "last_edited_time", "direction": "ascending" }
        ]
      }
    }
  ]
}
```

### Step C - Lock event row (`Generating`)
Tool: `NOTION_UPDATE_ROW_DATABASE`

```json
{
  "session_id": "<session>",
  "sync_response_to_workbench": false,
  "current_step": "LOCK_EVENT",
  "tools": [
    {
      "tool_slug": "NOTION_UPDATE_ROW_DATABASE",
      "arguments": {
        "row_id": "<EVENT_ROW_ID>",
        "properties": [
          { "name": "Workflow Status", "type": "select", "value": "Generating" },
          { "name": "Run ID", "type": "rich_text", "value": "<run_id>" }
        ]
      }
    }
  ]
}
```

### Step D - Read full row for payload
Tool: `NOTION_FETCH_ROW`

```json
{
  "session_id": "<session>",
  "sync_response_to_workbench": false,
  "current_step": "FETCH_EVENT_ROW",
  "tools": [
    {
      "tool_slug": "NOTION_FETCH_ROW",
      "arguments": { "page_id": "<EVENT_ROW_ID>" }
    }
  ]
}
```

### Step E - Create immutable version record
Tool: `NOTION_INSERT_ROW_DATABASE` (or `NOTION_UPSERT_ROW_DATABASE` for strict idempotency)

```json
{
  "session_id": "<session>",
  "sync_response_to_workbench": false,
  "current_step": "WRITE_VERSION_ROW",
  "tools": [
    {
      "tool_slug": "NOTION_INSERT_ROW_DATABASE",
      "arguments": {
        "database_id": "<EVENT_VERSION_DB_ID>",
        "properties": [
          { "name": "Event ID", "type": "rich_text", "value": "<event_id>" },
          { "name": "Version", "type": "number", "value": "<version_int>" },
          { "name": "Snapshot Hash", "type": "rich_text", "value": "<sha256>" },
          { "name": "Change Log", "type": "rich_text", "value": "<human_diff>" }
        ]
      }
    }
  ]
}
```

### Step F - Write success/failure back to Event row
Tool: `NOTION_UPDATE_ROW_DATABASE`

- Success update: status `Generated`, latest URLs, version, cleared error
- Failure update: status `Error`, `Last Error Message`, `Failed At`

## 7) n8n Workflow JSON Architecture (Surgically Precise Blueprint)

n8n requires workflow JSON with top-level keys: `name`, `nodes`, `connections`, `settings`.

```json
{
  "name": "rosalynn-beo-generation-v1",
  "nodes": [
    { "name": "Schedule Trigger", "type": "n8n-nodes-base.scheduleTrigger" },
    { "name": "Init Run Context", "type": "n8n-nodes-base.code" },
    { "name": "Fetch Ready Events (Composio)", "type": "n8n-nodes-base.httpRequest" },
    { "name": "Split Events", "type": "n8n-nodes-base.splitInBatches" },
    { "name": "Lock Event Generating", "type": "n8n-nodes-base.httpRequest" },
    { "name": "Fetch Event Row", "type": "n8n-nodes-base.httpRequest" },
    { "name": "Build Snapshot + Hash + Diff", "type": "n8n-nodes-base.code" },
    { "name": "Render Kitchen PDF (Carbone)", "type": "n8n-nodes-base.httpRequest" },
    { "name": "Render Service PDF (Carbone)", "type": "n8n-nodes-base.httpRequest" },
    { "name": "Render Client PDF (Carbone)", "type": "n8n-nodes-base.httpRequest" },
    { "name": "Upload/Link Drive Files", "type": "n8n-nodes-base.googleDrive" },
    { "name": "Write Version Row", "type": "n8n-nodes-base.httpRequest" },
    { "name": "Send Audience Emails", "type": "n8n-nodes-base.gmail" },
    { "name": "Mark Generated", "type": "n8n-nodes-base.httpRequest" },
    { "name": "Mark Error", "type": "n8n-nodes-base.httpRequest" }
  ],
  "connections": {
    "Schedule Trigger": { "main": [[{ "node": "Init Run Context" }]] },
    "Init Run Context": { "main": [[{ "node": "Fetch Ready Events (Composio)" }]] },
    "Fetch Ready Events (Composio)": { "main": [[{ "node": "Split Events" }]] },
    "Split Events": { "main": [[{ "node": "Lock Event Generating" }]] },
    "Lock Event Generating": { "main": [[{ "node": "Fetch Event Row" }]] },
    "Fetch Event Row": { "main": [[{ "node": "Build Snapshot + Hash + Diff" }]] },
    "Build Snapshot + Hash + Diff": {
      "main": [[{ "node": "Render Kitchen PDF (Carbone)" }]]
    },
    "Render Kitchen PDF (Carbone)": { "main": [[{ "node": "Render Service PDF (Carbone)" }]] },
    "Render Service PDF (Carbone)": { "main": [[{ "node": "Render Client PDF (Carbone)" }]] },
    "Render Client PDF (Carbone)": { "main": [[{ "node": "Upload/Link Drive Files" }]] },
    "Upload/Link Drive Files": { "main": [[{ "node": "Write Version Row" }]] },
    "Write Version Row": { "main": [[{ "node": "Send Audience Emails" }]] },
    "Send Audience Emails": { "main": [[{ "node": "Mark Generated" }]] }
  },
  "settings": {
    "errorWorkflow": "rosalynn-beo-error-handler",
    "timezone": "America/Los_Angeles"
  }
}
```

### n8n Node-Level Reliability Settings
Apply to all HTTP nodes calling Composio/Carbone:
- Settings -> `Retry On Fail = true`
- `Max Tries = 3`
- `Wait Between Tries (ms) = 1000-3000` with jitter logic in code node
- `On Error = Continue (using error output)` and route to `Mark Error`

Workflow-level settings:
- Save failed production executions: ON
- Save successful production executions: OFF (or short retention)
- Save execution progress: ON for debugging until stabilized

## 8) Carbone Generation Design (Versioned Multi-Audience)

### Template strategy
- 3 templates, each versioned independently:
  - `kitchen-template`
  - `service-template`
  - `client-template`
- Upload/manage via `/template` endpoints.
- Keep template IDs in `templates.json` in repo.

### Render calls
Endpoint:
- `POST /render/{templateId-or-versionId}`

Core body fields:
- `data`: mapped event payload
- `convertTo`: `pdf`
- `reportName`: include event/version/timestamp/audience
- optional `carbone-webhook-url` for async render

Example payload:

```json
{
  "data": { "event": { "id": "EVT-028" }, "version": 3, "audience": "kitchen" },
  "convertTo": "pdf",
  "reportName": "EVT-028_v03_20260424-1730_kitchen.pdf"
}
```

### Download behavior
- If synchronous and using `?download=true`, consume file stream directly.
- If asynchronous and using render IDs, download exactly once from `/render/{renderId}` and persist immediately.

### Changelog generation
Compute diff in n8n code node between previous snapshot and current snapshot:
- changed scalar fields: `field old->new`
- changed arrays (menu items): added/removed counts and items
Store both:
- human summary in Notion (`vN: ...`)
- structured JSON diff for future auditing

## 9) Suggested Delivery Sequence (Low Debug Path)

Phase 0 (half day)
- Create Notion schemas (Events + Event Versions).
- Create Drive folder + mailing lists.
- Provision Carbone API token and upload initial templates.

Phase 1 MVP (1-2 days)
- Build n8n workflow skeleton with one audience first (Kitchen) and full status loop.
- Add two more audience branches.
- Add Notion version write + changelog.
- Run 5-event canary.

Phase 2 Reliability (1 day)
- Add error workflow + reconciliation workflow.
- Add metric logging and alerting for stuck `Generating` and SLA misses.
- Tune retries and rate limits.

Phase 3 Hardening (optional)
- Move to n8n queue mode (Redis + workers) when throughput or reliability needs justify it.
- Add automated template contract tests in CI.

## 10) Open Decisions You Should Lock Before Build
1. Exact Notion status options and who can transition each status.
2. Whether any edit auto-queues generation or requires manual re-approval.
3. Client-visible field whitelist (privacy boundary).
4. Email content policy: attachment vs links only.
5. Retention policy for historical versions.

## 11) Documentation References
- Notion API request/rate/size limits:
  - https://developers.notion.com/reference/request-limits
- Composio Notion toolkit (auth + tools catalog):
  - https://docs.composio.dev/toolkits/notion
- n8n workflow JSON import/export:
  - https://docs.n8n.io/workflows/export-import/
- n8n create workflow object fields (`name`, `nodes`, `connections`, `settings`):
  - https://docs.n8n.io/integrations/builtin/core-nodes/n8n-nodes-base.n8n/
- n8n queue mode and scaling:
  - https://docs.n8n.io/hosting/scaling/queue-mode/
- n8n execution data retention/pruning:
  - https://docs.n8n.io/hosting/scaling/execution-data/
- n8n error workflow handling:
  - https://docs.n8n.io/flow-logic/error-handling/
- n8n HTTP Request node + retry guidance:
  - https://docs.n8n.io/integrations/builtin/core-nodes/n8n-nodes-base.httprequest/
  - https://docs.n8n.io/integrations/builtin/core-nodes/n8n-nodes-base.httprequest/common-issues/
  - https://docs.n8n.io/integrations/builtin/rate-limits/
- Carbone API generate/download/templates:
  - https://carbone.io/documentation/developer/http-api/generate-reports.html
  - https://carbone.io/documentation/developer/http-api/download-reports.html
  - https://carbone.io/documentation/developer/http-api/manage-templates.html
- Carbone template syntax (tags/loops/conditions):
  - https://carbone.io/documentation/design/substitutions/the-basics.html
  - https://carbone.io/documentation/design/repetitions/with-arrays.html
  - https://carbone.io/documentation/design/conditions/inline-conditions.html
  - https://carbone.io/documentation/design/conditions/conditional-blocks.html

## 12) Notes from live Composio discovery in this session
- Session ID used: `flew`
- Notion toolkit connection status: active
- High-signal tool slugs validated: `NOTION_FETCH_DATABASE`, `NOTION_QUERY_DATABASE_WITH_FILTER`, `NOTION_FETCH_ROW`, `NOTION_INSERT_ROW_DATABASE`, `NOTION_UPDATE_ROW_DATABASE`, `NOTION_UPSERT_ROW_DATABASE`

## 13) Engineering Review Addendum (2026-04-27)
Branch: `main`  
Commit reviewed: `51a755a`  
Review mode: `FULL_REVIEW` (eng manager pass with reliability-first bias)

### 13.1 Step 0 - Scope Challenge Outcome
Scope check result: complexity threshold is triggered (workflow plus config plus alerting plus resend plus contract tests).  
Decision: **keep scope** because business requirements explicitly require multi-audience generation, version history, and operational reliability; reduce implementation surface by enforcing strict artifact boundaries instead of dropping requirements.

Minimum artifact set for MVP + reliability:
1. `workflows/n8n/rosalynn-beo-generation-v1.json` (main generation flow)
2. `workflows/n8n/rosalynn-beo-reconcile-v1.json` (stuck-run recovery)
3. `workflows/n8n/rosalynn-beo-resend-v1.json` (one-click resend latest version)
4. `config/notion-schema-map.v1.json` (typed property map, no inline string literals)
5. `config/templates.v1.json` (Carbone template IDs + audience mapping)
6. `tests/contracts/template-contract.test.ts` (required before template publish)

Search check note: web search was not required for this pass because primary-source references are already present in Section 11 and the recommendations are architecture-level constraints, not version-sensitive API facts.

### 13.2 Architecture Review (4 issues)
1. `[P1] (confidence: 9/10) plan section 7 lock sequence - duplicate generation race`
   - Risk: two poll executions can lock the same event if status write is not treated as a lease with ownership checks.
   - Resolution applied to plan:
     - Add lease fields on Event row: `Generation Lock Token`, `Lock Acquired At`, `Lock Expires At`.
     - Every mutating step validates lock token ownership before continuing.
     - Reconciliation flow reclaims only expired leases.

2. `[P1] (confidence: 9/10) plan sections 6/8 idempotency - duplicate versions under retry`
   - Risk: retries can generate extra PDFs for the same snapshot when downstream calls partially succeed.
   - Resolution applied to plan:
     - Compute canonical snapshot hash before render.
     - Use `version_key = event_id + snapshot_hash` as idempotency key.
     - If `version_key` already exists, skip render and only refresh `Latest Version` pointers.

3. `[P1] (confidence: 8/10) plan section 7 timeline - missing explicit immutable event log write path`
   - Risk: incidents cannot be debugged quickly without stage-level audit records.
   - Resolution applied to plan:
     - Add `Write Event Log Entry` after each major transition:
       `LOCKED`, `SNAPSHOT_BUILT`, `RENDERED_<AUDIENCE>`, `EMAILED_<AUDIENCE>`, `FAILED`.
     - Event log is append-only and keyed by `run_id`.

4. `[P2] (confidence: 8/10) plan section 9 distribution - no repeatable promotion contract`
   - Risk: workflow drift between environments and hard-to-reproduce failures.
   - Resolution applied to plan:
     - Require JSON export + schema lint + import smoke test on every workflow change.
     - Keep CI light for MVP: validate JSON shape and required node names; no full deploy automation yet.

### 13.3 Code Quality Review (3 issues)
1. `[P2] (confidence: 8/10) section 7 render nodes - hardcoded per-audience branches`
   - Risk: drift between kitchen/service/client branches and high maintenance burden.
   - Resolution applied to plan:
     - Replace fixed three-node render chain with loop over `audiences[]` from `templates.v1.json`.
     - Keep per-audience formatting in config, not workflow graph duplication.

2. `[P2] (confidence: 9/10) sections 6/8 mapping discipline - schema and template IDs not version-locked`
   - Risk: silent breakage when Notion property names or template tags change.
   - Resolution applied to plan:
     - Freeze schema and template contracts in versioned JSON config files.
     - Add preflight gate that fails fast if required properties/tags are missing.

3. `[P2] (confidence: 8/10) section 8 changelog generation - non-canonical diffs create noisy history`
   - Risk: same logical payload can hash differently based on key order/list order.
   - Resolution applied to plan:
     - Canonicalize snapshot objects before hashing (sorted keys, normalized menu arrays).
     - Diff engine outputs stable field ordering for human-readable change logs.

### 13.4 Test Review
Test framework detection:
- `RUNTIME:node`
- No framework config detected (`jest`, `vitest`, `playwright`, `cypress` absent)
- No test directories detected

Required test harness decision for this plan:
1. Add `vitest` for unit/integration tests on mapping, hashing, and diff logic.
2. Add workflow-contract tests that validate required node names and connection invariants in exported n8n JSON.
3. Add template contract tests that render fixture payloads against each Carbone template and assert required placeholders exist.

ASCII coverage diagram (current: planned coverage gaps are all open):

```text
CODE PATHS                                                     USER FLOWS
[+] generation workflow                                         [+] Lead sets "Ready to Generate"
  |- [GAP] fetch ready events                                    |- [GAP] first-time generation < 15 min
  |- [GAP] acquire lease lock                                    |- [GAP] edited event creates new version
  |- [GAP] build canonical snapshot + hash                       |- [GAP] unchanged snapshot does NOT re-render
  |- [GAP] idempotency short-circuit                             |- [GAP] Carbone failure sets Error state
  |- [GAP] render per audience loop                              |- [GAP] one-click resend latest version
  |- [GAP] upload artifacts + update latest pointers             |- [GAP] stuck Generating is recovered
  |- [GAP] write immutable version row                           |- [GAP] version changelog is human-readable
  |- [GAP] write immutable event log                             |- [GAP] recipient routing is audience-correct
  |- [GAP] dispatch emails                                       |- [GAP] terminal status write failure is visible
  |- [GAP] mark generated / mark error

COVERAGE: 0/12 paths tested (0%)
QUALITY: ★★★:0 ★★:0 ★:0 | GAPS: 12
```

Regression rule:
- No code regression detected yet because implementation has not started.
- Once implementation begins, any change to existing generation behavior must include a regression test in the same change.

Test requirements to add to implementation checklist:
1. `tests/unit/canonical-hash.test.ts` (stable hash across key order permutations)
2. `tests/unit/changelog-diff.test.ts` (scalar and menu-array diff scenarios)
3. `tests/integration/idempotency-ledger.test.ts` (duplicate run suppression)
4. `tests/integration/lease-locking.test.ts` (lock ownership and expiry recovery)
5. `tests/contracts/notion-schema-contract.test.ts` (required property/type assertions)
6. `tests/contracts/template-contract.test.ts` (required placeholders by audience)
7. `tests/contracts/workflow-shape.test.ts` (required n8n nodes/connections present)
8. `tests/e2e/generation-happy-path.spec.ts` (ready -> generated with 3 PDFs)
9. `tests/e2e/recovery-timeout.spec.ts` (Carbone timeout -> error + reconciliation)
10. `tests/e2e/resend-latest-version.spec.ts` (resend only latest version artifact)
11. `tests/e2e/version-bump-on-edit.spec.ts` (edit creates v+1 and changelog)
12. `tests/e2e/routing-safety.spec.ts` (audience->document routing correctness)

### 13.5 Performance Review (2 issues)
1. `[P2] (confidence: 8/10) Notion API pressure under polling bursts`
   - Resolution applied to plan:
     - Explicit rate limiter node target: 2 requests/sec per connection.
     - Strict pagination handling with `next_cursor`.
     - Batch size default 25; configurable via env.

2. `[P2] (confidence: 8/10) SLA risk from purely sequential rendering per event`
   - Resolution applied to plan:
     - Parallelize audience rendering per event with bounded concurrency (`max 2 concurrent renders`).
     - Keep event-level concurrency separate (`max 3 events in-flight`) to preserve 15-minute SLA.

### 13.6 Failure Modes (critical gaps)
1. `Recipient mismatch before send`  
   - Test exists: NO  
   - Error handling exists: NO (deferred)  
   - User-visible: potentially silent misdelivery  
   - Status: **CRITICAL GAP (deferred in TODOS.md)**

2. `Terminal Error writeback fails after upstream failure`  
   - Test exists: NO  
   - Error handling exists: partial only (no durable dead-letter replay yet)  
   - User-visible: event may remain stuck in `Generating`  
   - Status: **CRITICAL GAP (deferred in TODOS.md)**

3. `Duplicate generation under retry/race`  
   - Test exists: planned  
   - Error handling exists: now covered by lock lease + idempotency design  
   - User-visible: prevented after this plan correction

### 13.7 NOT in Scope (explicitly deferred)
1. Role-based transition guardrails for `Ready to Generate` (deferred for MVP speed; tracked in `TODOS.md`).
2. Recipient mismatch pre-send enforcement node (deferred by explicit scope decision; tracked in `TODOS.md`).
3. Durable dead-letter replay worker for terminal status writes (deferred by explicit scope decision; tracked in `TODOS.md`).
4. Full queue-mode deployment (`n8n + Redis + workers`) (defer until measured throughput justifies operational overhead).
5. Full CI/CD auto-deploy for workflows (keep MVP with exported JSON + validation gates first).

### 13.8 What Already Exists
1. `docs/planning/initial-office-hours-design.md` - validated problem framing and MVP wedge.
2. `~/.gstack/projects/rosalynn-beo-automation/ceo-plans/2026-04-26-versioned-beo-pipeline.md` - accepted scope expansions and deferred decisions.
3. `TODOS.md` - three deferred reliability/security items already documented with context.
4. Existing Next.js/Airtable app code in this repo is not reused for the new Notion+n8n+Carbone workflow and should not drive architecture decisions.

### 13.9 Worktree Parallelization Strategy
| Step | Modules touched | Depends on |
|------|-----------------|------------|
| Build generation workflow core | `workflows/n8n/`, `config/` | - |
| Implement reconciliation + resend workflows | `workflows/n8n/` | Build generation workflow core |
| Add schema/template contract tests | `tests/contracts/`, `config/` | Build generation workflow core |
| Add unit/integration tests for hashing, locking, diff | `tests/unit/`, `tests/integration/` | Build generation workflow core |
| Add e2e workflow tests | `tests/e2e/`, `workflows/n8n/` | reconciliation + resend + contract tests |

Parallel lanes:
- Lane A: generation workflow core -> reconciliation + resend (sequential, shared `workflows/n8n/`)
- Lane B: contract tests -> unit/integration tests (sequential, shared `tests/`)
- Lane C: e2e tests (after Lane A and B merge)

Execution order:
1. Launch Lane A and Lane B in parallel worktrees.
2. Merge Lane A and Lane B.
3. Run Lane C after both are merged.

Conflict flags:
- Lane A and Lane C both touch `workflows/n8n/`; Lane C must wait.
- Lane B and Lane C both touch `tests/`; Lane C must wait.

### 13.10 Completion Summary
- Step 0: Scope Challenge - scope accepted as-is (artifact set reduced, requirements intact)
- Architecture Review: 4 issues found
- Code Quality Review: 3 issues found
- Test Review: diagram produced, 12 gaps identified
- Performance Review: 2 issues found
- NOT in scope: written
- What already exists: written
- TODOS.md updates: 0 new items proposed (3 existing deferred items remain active)
- Failure modes: 2 critical gaps flagged
- Outside voice: skipped in this pass
- Parallelization: 3 lanes (2 parallel-capable, 1 sequential follow-up)
- Lake Score: 7/9 recommendations took complete-option path

## GSTACK REVIEW REPORT

| Review | Trigger | Why | Runs | Status | Findings |
|--------|---------|-----|------|--------|----------|
| CEO Review | `/plan-ceo-review` | Scope and strategy | 1 | ISSUES_OPEN | 6 proposals, 4 accepted, 0 deferred |
| Codex Review | `/codex review` | Independent 2nd opinion | 0 | - | not run |
| Eng Review | `/plan-eng-review` | Architecture and tests (required) | 1 | ISSUES_OPEN | 21 issues total, 2 critical gaps |
| Design Review | `/plan-design-review` | UI/UX gaps | 1 | CLEAN | no first-party UI scope in this plan; exited early per design-review rule |
| DX Review | `/plan-devex-review` | Developer experience gaps | 0 | - | not run |

- DESIGN: no first-party UI scope detected (backend/integration-only plan), so visual design passes were not applicable.
- UNRESOLVED: 0 decisions
- VERDICT: CEO + ENG reviewed; eng review has open critical gaps tracked in `TODOS.md`

## 14) Implementation Update (2026-04-27)
The two previously critical reliability gaps are now implemented in code:

1. Recipient mismatch guard before send
   - `POST /api/workflows/dispatch` blocks audience/document mismatches.
   - Implementation: `app/api/workflows/dispatch/route.ts`, `lib/reliability/recipient-guard.ts`.
2. Dead-letter fallback for failed terminal status writes
   - `POST /api/workflows/terminal-status` persists failures to dead-letter queue.
   - `GET /api/workflows/dead-letters` and `POST /api/workflows/dead-letters/replay` provide queue operations.
   - Implementation: `app/api/workflows/terminal-status/route.ts`, `app/api/workflows/dead-letters/*`, `lib/reliability/dead-letter.ts`, `lib/reliability/terminal-status-writer.ts`.
3. Role-based transition and replay guardrails
   - `POST /api/workflows/guarded-action` enforces role policy for sensitive actions.
   - `POST /api/workflows/dead-letters/replay` enforces role checks before replay/manual resolve.
   - Implementation: `app/api/workflows/guarded-action/route.ts`, `lib/reliability/role-guard.ts`.

Added orchestration scaffolds:
- `workflows/n8n/rosalynn-beo-generation-v1.json`
- `workflows/n8n/rosalynn-beo-dead-letter-reconcile-v1.json`
  - Both now include explicit authorization calls before sensitive operations.

Verification status:
- `npm run type-check` passes.
- `npm test` passes (16 tests), including route-level integration tests for role/guard/dead-letter flows.

Remaining deferred item:
- None of the previously flagged critical controls remain deferred.

## 15) Pilot Hardening Update (2026-04-28, 2-3 trusted users)

Context:
- The current implementation closes the original reliability gaps (recipient guard + dead-letter fallback + role guard routes).
- A security/reliability review found four additional production-facing risks that can still impact a trusted pilot:
  1. caller-controlled role spoofing
  2. missing API authentication on workflow control routes
  3. replay race (same dead-letter entry can be processed twice)
  4. non-durable dead-letter storage in ephemeral environments

Decision:
- For MVP speed and low maintenance, adopt a **single internal-token architecture** for all workflow-control routes instead of full user/session auth in this phase.
- This keeps changes small, avoids long debugging cycles, and materially reduces risk.

### 15.1 Required controls for pilot launch

1. Internal API token gate (must-have)
   - Protect every route under `/api/workflows/*`.
   - Require `Authorization: Bearer <WORKFLOW_INTERNAL_TOKEN>`.
   - Reject unauthorized requests with `401`.
   - n8n is the only caller in this phase.

2. Trusted role derivation (must-have)
   - Do not trust `actorRole` from request body or ad-hoc headers.
   - Derive actor role from authenticated caller identity:
     - default mapping for pilot: `WORKFLOW_INTERNAL_TOKEN -> system`.
   - Keep body `actorRole` only as optional audit metadata, not authorization input.

3. Replay claim lock (must-have)
   - Add atomic claim before replaying dead-letter entries.
   - Single-entry replay flow:
     - claim entry (`claimToken`, `claimedAt`, `claimedBy`)
     - execute replay
     - resolve or release claim
   - Reject concurrent replay attempts on already-claimed entries (`409`).

4. Dead-letter durability boundary (must-have for runtime choice)
   - Pilot is approved on:
     - single always-on host with persistent filesystem path for `DEAD_LETTER_DIR`, or
     - durable backing store (DB/object store) if running serverless/ephemeral.
   - If runtime is ephemeral and no durable store is configured, launch is blocked.

### 15.2 Minimal file-level implementation plan

1. Auth gate middleware/helper:
   - new: `lib/reliability/internal-auth.ts`
   - apply to:
     - `app/api/workflows/dispatch/route.ts`
     - `app/api/workflows/terminal-status/route.ts`
     - `app/api/workflows/dead-letters/route.ts`
     - `app/api/workflows/dead-letters/replay/route.ts`
     - `app/api/workflows/guarded-action/route.ts`

2. Role derivation changes:
   - update:
     - `app/api/workflows/guarded-action/route.ts`
     - `app/api/workflows/dead-letters/replay/route.ts`
   - remove authorization dependency on caller-supplied role fields.

3. Replay claim semantics:
   - update:
     - `lib/reliability/dead-letter.ts`
     - `app/api/workflows/dead-letters/replay/route.ts`
   - add claim/release/resolve helpers.

4. Configuration contract:
   - `.env.example` must include:
     - `WORKFLOW_INTERNAL_TOKEN`
     - `WORKFLOW_CALLER_ROLE` (default `system`)
   - docs updates:
     - `docs/operations/reliability-controls.md`
     - `docs/operations/n8n-import-checklist.md`

### 15.3 Test gates (required before merge)

1. Unauthorized request to each `/api/workflows/*` route returns `401`.
2. Spoofed `actorRole=admin` in body/header does not escalate access.
3. Two parallel replay attempts on same dead-letter ID:
   - one succeeds
   - one returns `409` already claimed.
4. Existing reliability tests remain green (`npm test` + `npm run type-check`).

### 15.4 Out of scope for this pilot patch

1. End-user identity and per-human RBAC for direct API calls.
2. Multi-tenant auth model.
3. Queue-mode deployment (`n8n + Redis + workers`).
4. Full migration of dead-letter store to database (recommended next if runtime changes from single-host persistent disk).
