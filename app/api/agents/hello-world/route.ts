import { NextRequest, NextResponse } from 'next/server';
import { getOrchestrator } from '@/lib/agents/orchestrator';
import { createHelloWorldAgent } from '@/lib/agents/hello-world-agent';
import {
  AgentInput,
  AgentInputSchema,
  AgentContext,
  AgentPriority,
  AgentError,
  AgentErrorType,
} from '@/lib/agents/types';

/**
 * Initialize orchestrator and register Hello World agent
 * Singleton pattern ensures agent is registered only once
 */
let isInitialized = false;

function initializeAgent() {
  if (!isInitialized) {
    try {
      const orchestrator = getOrchestrator({
        maxConcurrentExecutions: 5,
        defaultTimeout: 30000,
        enableLogging: true,
        logLevel: 'info',
      });

      const helloWorldAgent = createHelloWorldAgent();
      orchestrator.registerAgent(helloWorldAgent);

      console.log('[API] Hello World agent registered successfully');
      isInitialized = true;
    } catch (error) {
      // Agent might already be registered, which is fine
      if (
        error instanceof AgentError &&
        error.type === AgentErrorType.CONFIGURATION_ERROR
      ) {
        console.log('[API] Hello World agent already registered');
        isInitialized = true;
      } else {
        throw error;
      }
    }
  }
}

/**
 * GET /api/agents/hello-world
 * 
 * Get Hello World agent information and health status
 * 
 * @example
 * ```bash
 * curl http://localhost:3000/api/agents/hello-world
 * ```
 * 
 * @returns Agent metadata, health status, and metrics
 */
export async function GET(request: NextRequest) {
  try {
    initializeAgent();

    const orchestrator = getOrchestrator();
    const agentEntry = orchestrator.getAgent('hello-world');

    if (!agentEntry) {
      return NextResponse.json(
        { error: 'Hello World agent not found' },
        { status: 404 }
      );
    }

    // Get health status
    const healthStatus = await agentEntry.instance.healthCheck();

    // Get metrics
    const metrics = orchestrator.getAgentMetrics('hello-world');

    // Get agent info (if available)
    const agentInfo =
      'getInfo' in agentEntry.instance
        ? (agentEntry.instance as any).getInfo()
        : null;

    return NextResponse.json({
      agent: {
        name: agentEntry.name,
        description: agentEntry.config.description,
        version: agentEntry.config.version,
        enabled: agentEntry.config.enabled,
        registeredAt: agentEntry.registeredAt.toISOString(),
        lastExecutedAt: agentEntry.lastExecutedAt?.toISOString(),
        ...agentInfo,
      },
      health: healthStatus,
      metrics,
      config: {
        timeout: agentEntry.config.timeout,
        retryAttempts: agentEntry.config.retryAttempts,
        capabilities: agentEntry.config.capabilities,
      },
    });
  } catch (error) {
    console.error('[API] Error fetching agent info:', error);
    return NextResponse.json(
      {
        error: 'Failed to fetch agent information',
        details: (error as Error).message,
      },
      { status: 500 }
    );
  }
}

/**
 * POST /api/agents/hello-world
 * 
 * Execute the Hello World agent with specified action and parameters
 * 
 * @example
 * ```bash
 * # Greet action
 * curl -X POST http://localhost:3000/api/agents/hello-world \
 *   -H "Content-Type: application/json" \
 *   -d '{"action":"greet","parameters":{"name":"Jimmy","language":"en"}}'
 * 
 * # Echo action
 * curl -X POST http://localhost:3000/api/agents/hello-world \
 *   -H "Content-Type: application/json" \
 *   -d '{"action":"echo","parameters":{"message":"Hello from API"}}'
 * 
 * # Ping action
 * curl -X POST http://localhost:3000/api/agents/hello-world \
 *   -H "Content-Type: application/json" \
 *   -d '{"action":"ping"}'
 * ```
 * 
 * Request body:
 * ```typescript
 * {
 *   action: string;              // Required: 'greet' | 'echo' | 'ping' | 'error_test' | 'delay_test'
 *   parameters?: {               // Optional: action-specific parameters
 *     name?: string;             // For 'greet'
 *     language?: 'en'|'es'|'fr'; // For 'greet'
 *     message?: string;          // For 'echo'
 *     delayMs?: number;          // For 'delay_test'
 *   };
 *   context?: {                  // Optional: execution context
 *     userId?: string;
 *     priority?: 'low'|'medium'|'high'|'critical';
 *     metadata?: Record<string, any>;
 *   };
 * }
 * ```
 * 
 * @returns Execution result with output data, timing, and logs
 */
export async function POST(request: NextRequest) {
  const startTime = Date.now();

  try {
    initializeAgent();

    // Parse and validate request body
    const body = await request.json();
    console.log('[API] Received request:', JSON.stringify(body, null, 2));

    // Validate input schema
    let input: AgentInput;
    try {
      input = AgentInputSchema.parse(body);
    } catch (error) {
      console.error('[API] Input validation failed:', error);
      return NextResponse.json(
        {
          success: false,
          error: 'Invalid input format',
          details: (error as Error).message,
          validationErrors:
            'errors' in (error as any) ? (error as any).errors : undefined,
        },
        { status: 400 }
      );
    }

    // Build execution context
    const context: Partial<AgentContext> = {
      userId: body.context?.userId || 'anonymous',
      priority: body.context?.priority || AgentPriority.MEDIUM,
      environmentId:
        process.env.OZ_ENVIRONMENT_ID ||
        process.env.NEXT_PUBLIC_OZ_ENVIRONMENT_ID ||
        '5c65dad1e6cbca5f347e77e8a9443bdd',
      metadata: {
        ...body.context?.metadata,
        requestUrl: request.url,
        userAgent: request.headers.get('user-agent') || 'unknown',
        ip:
          request.headers.get('x-forwarded-for') ||
          request.headers.get('x-real-ip') ||
          'unknown',
      },
    };

    console.log('[API] Executing agent with context:', context);

    // Execute agent through orchestrator
    const orchestrator = getOrchestrator();
    const result = await orchestrator.executeAgent('hello-world', input, context);

    const totalTime = Date.now() - startTime;

    console.log('[API] Execution completed:', {
      executionId: result.executionId,
      status: result.status,
      duration: result.duration,
      totalApiTime: totalTime,
    });

    // Return successful result
    return NextResponse.json(
      {
        success: result.status === 'completed',
        executionId: result.executionId,
        status: result.status,
        output: result.output,
        timing: {
          agentExecutionTime: result.duration,
          totalApiTime: totalTime,
          startTime: result.startTime,
          endTime: result.endTime,
        },
        logs: result.logs,
        metadata: {
          agentName: result.agentName,
          retryCount: result.retryCount,
          action: input.action,
        },
      },
      { status: 200 }
    );
  } catch (error) {
    const totalTime = Date.now() - startTime;

    console.error('[API] Execution error:', error);

    // Handle AgentError specifically
    if (error instanceof AgentError) {
      const statusCode =
        error.type === AgentErrorType.VALIDATION_ERROR
          ? 400
          : error.type === AgentErrorType.TIMEOUT_ERROR
          ? 408
          : error.type === AgentErrorType.AUTHENTICATION_ERROR
          ? 401
          : 500;

      return NextResponse.json(
        {
          success: false,
          error: error.message,
          errorType: error.type,
          agentName: error.agentName,
          executionId: error.executionId,
          timing: {
            totalApiTime: totalTime,
          },
        },
        { status: statusCode }
      );
    }

    // Handle generic errors
    return NextResponse.json(
      {
        success: false,
        error: 'Agent execution failed',
        details: (error as Error).message,
        timing: {
          totalApiTime: totalTime,
        },
      },
      { status: 500 }
    );
  }
}

/**
 * DELETE /api/agents/hello-world
 * 
 * Unregister the Hello World agent from the orchestrator
 * 
 * @example
 * ```bash
 * curl -X DELETE http://localhost:3000/api/agents/hello-world
 * ```
 * 
 * @returns Success status
 */
export async function DELETE(request: NextRequest) {
  try {
    const orchestrator = getOrchestrator();
    const removed = orchestrator.unregisterAgent('hello-world');

    if (removed) {
      isInitialized = false;
      console.log('[API] Hello World agent unregistered');

      return NextResponse.json({
        success: true,
        message: 'Hello World agent unregistered successfully',
      });
    }

    return NextResponse.json(
      {
        success: false,
        error: 'Agent not found or already unregistered',
      },
      { status: 404 }
    );
  } catch (error) {
    console.error('[API] Error unregistering agent:', error);
    return NextResponse.json(
      {
        success: false,
        error: 'Failed to unregister agent',
        details: (error as Error).message,
      },
      { status: 500 }
    );
  }
}

/**
 * PATCH /api/agents/hello-world
 * 
 * Get execution history and metrics for the Hello World agent
 * 
 * @example
 * ```bash
 * curl -X PATCH http://localhost:3000/api/agents/hello-world?limit=10
 * ```
 * 
 * Query parameters:
 * - limit: Number of recent executions to return (default: 10)
 * 
 * @returns Recent execution history and detailed metrics
 */
export async function PATCH(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const limit = parseInt(searchParams.get('limit') || '10');

    const orchestrator = getOrchestrator();
    const metrics = orchestrator.getAgentMetrics('hello-world');
    const logs = orchestrator.getLogs(limit);

    return NextResponse.json({
      success: true,
      metrics,
      recentLogs: logs,
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    console.error('[API] Error fetching metrics:', error);
    return NextResponse.json(
      {
        success: false,
        error: 'Failed to fetch metrics',
        details: (error as Error).message,
      },
      { status: 500 }
    );
  }
}
