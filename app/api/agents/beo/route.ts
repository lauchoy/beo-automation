/**
 * BEO Monolithic Agent — HTTP API Route
 *
 * Exposes all 4 domain capabilities (Order Processing, Menu Management,
 * Kitchen Coordination, Service Coordination) through a single endpoint.
 *
 * POST /api/agents/beo  — Execute an action
 * GET  /api/agents/beo  — Agent info + health check
 *
 * Linear: OPS-470
 */

import { NextRequest, NextResponse } from 'next/server';
import { getOrchestrator } from '@/lib/agents/orchestrator';
import {
  createBEOMonolithicAgent,
  OrderProcessingAction,
  MenuManagementAction,
  KitchenCoordinationAction,
  ServiceCoordinationAction,
} from '@/lib/agents/beo-monolithic-agent';
import { AgentStatus } from '@/lib/agents/types';

// Register agent once at module level
const orchestrator = getOrchestrator();
const beoAgent = createBEOMonolithicAgent();

try {
  orchestrator.registerAgent(beoAgent);
} catch {
  // Already registered (hot reload in dev)
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { action, params, priority, userId } = body;

    if (!action) {
      return NextResponse.json({ success: false, error: 'Missing required field: action' }, { status: 400 });
    }

    const result = await orchestrator.executeAgent('beo-monolithic', { action, params: params || {} }, { priority, userId });

    if (result.status === AgentStatus.COMPLETED) {
      return NextResponse.json({ success: true, data: result.output, executionId: result.executionId, duration: result.duration });
    } else {
      return NextResponse.json({ success: false, error: result.error, executionId: result.executionId }, { status: 500 });
    }
  } catch (error) {
    console.error('[BEO Agent Route] Error:', error);
    return NextResponse.json(
      { success: false, error: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 },
    );
  }
}

export async function GET() {
  const health = await orchestrator.healthCheck();
  const allActions = {
    orderProcessing:    Object.values(OrderProcessingAction),
    menuManagement:     Object.values(MenuManagementAction),
    kitchenCoordination:Object.values(KitchenCoordinationAction),
    serviceCoordination:Object.values(ServiceCoordinationAction),
  };
  return NextResponse.json({
    agent:    'beo-monolithic',
    version:  '1.0.0',
    health:   health.agents['beo-monolithic'],
    actions:  allActions,
    totalActions: Object.values(allActions).flat().length,
    migration: {
      from: '4 separate agents (@warp/oz-agent-sdk)',
      to:   '1 LangChain-ready monolithic service',
      ozSdkRemoved: true,
      bullmqNote: 'InMemoryJobQueue in place — swap for BullMQ when Redis is available',
    },
  });
}
