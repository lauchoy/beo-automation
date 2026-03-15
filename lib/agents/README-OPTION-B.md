# Option B: LangChain Monolithic Service

**Created:** March 15, 2026  
**Linear:** OPS-470  
**ADR:** Oz SDK Contingency (LAU-190 Child)

## Overview

Collapses 4 separate agent services into 1 `BEOMonolithicAgent`:

| Removed (Oz SDK) | Replaced By |
|---|---|
| Order Processing Agent | `OrderProcessingAction` in `beo-monolithic-agent.ts` |
| Menu Management Agent | `MenuManagementAction` in `beo-monolithic-agent.ts` |
| Kitchen Coordination Agent | `KitchenCoordinationAction` in `beo-monolithic-agent.ts` |
| Service Coordination Agent | `ServiceCoordinationAction` in `beo-monolithic-agent.ts` |

## Architecture

```
POST /api/agents/beo
    ↓
AgentOrchestrator (existing)
    ↓
BEOMonolithicAgent
    ├── handleOrderProcessing()     → order.* actions
    ├── handleMenuManagement()      → menu.* actions
    ├── handleKitchenCoordination() → kitchen.* actions
    └── handleServiceCoordination() → service.* actions
```

## What's Removed

- `@warp/oz-agent-sdk` — never installed, vendor unresponsive 17+ days
- `WARP_API_KEY` + `OZ_ENVIRONMENT_ID` requirements from agent config
- 4-agent distributed architecture (replaced by domain routing)

## Next Steps

1. Wire `order.*` and `menu.*` handlers to `lib/airtable-client.ts`
2. Add `bullmq` + Redis for production job queue (swap `InMemoryJobQueue`)
3. Add LangChain chains for natural-language BEO generation
4. Write integration tests per acceptance criteria in OPS-470
5. Remove `hello-world-agent.ts` Warp/OZ healthcheck once confirmed stable
