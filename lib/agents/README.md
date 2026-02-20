# BEO Automation - Agent Orchestration Layer

Production-ready agent orchestration system for the BEO Automation platform.

## Overview

The agent orchestration layer provides a robust, scalable framework for managing and executing intelligent agents within the BEO Automation system. It handles agent lifecycle management, execution coordination, error handling, retry logic, and comprehensive logging.

## Architecture

### Core Components

1. **Type System** (`types.ts`)
   - Comprehensive TypeScript types and Zod schemas
   - Type-safe interfaces for all agent operations
   - Custom error classes for detailed error handling

2. **Orchestrator** (`orchestrator.ts`)
   - Singleton pattern for centralized agent management
   - Concurrent execution control with queue management
   - Retry logic with exponential backoff
   - Comprehensive logging and metrics tracking

3. **Agents** (e.g., `hello-world-agent.ts`)
   - Implement the `IAgent` interface
   - Self-contained execution logic
   - Input validation and health checks

4. **API Routes** (`app/api/agents/*/route.ts`)
   - RESTful endpoints for agent interaction
   - Next.js 14 App Router pattern
   - Comprehensive error handling

## Quick Start

### 1. Installation

The required dependencies are already in `package.json`. Install them:

```bash
npm install
# or
yarn install
```

### 2. Environment Setup

Copy the example environment file and add your credentials:

```bash
cp .env.example .env.local
```

Required environment variables for agents:
```env
WARP_API_KEY=wk-1.2f527b6a0b1a46b3577c544b5cda4dc9947714babb7296f979f79f0dd368e860
OZ_ENVIRONMENT_ID=5c65dad1e6cbca5f347e77e8a9443bdd
```

### 3. Run the Development Server

```bash
npm run dev
```

### 4. Test the Hello World Agent

#### Get Agent Info
```bash
curl http://localhost:3000/api/agents/hello-world
```

#### Execute Agent - Greet Action
```bash
curl -X POST http://localhost:3000/api/agents/hello-world \
  -H "Content-Type: application/json" \
  -d '{
    "action": "greet",
    "parameters": {
      "name": "Jimmy",
      "language": "en"
    }
  }'
```

#### Execute Agent - Echo Action
```bash
curl -X POST http://localhost:3000/api/agents/hello-world \
  -H "Content-Type: application/json" \
  -d '{
    "action": "echo",
    "parameters": {
      "message": "Hello from BEO Automation!"
    }
  }'
```

#### Execute Agent - Ping Action
```bash
curl -X POST http://localhost:3000/api/agents/hello-world \
  -H "Content-Type: application/json" \
  -d '{"action": "ping"}'
```

## Creating a New Agent

### Step 1: Define Agent Class

Create a new file `lib/agents/my-agent.ts`:

```typescript
import {
  IAgent,
  AgentInput,
  AgentOutput,
  AgentContext,
  AgentConfig,
  AgentInputSchema,
  AgentError,
  AgentErrorType,
} from './types';

const MY_AGENT_CONFIG: AgentConfig = {
  name: 'my-agent',
  description: 'Description of what your agent does',
  version: '1.0.0',
  enabled: true,
  timeout: 10000,
  retryAttempts: 3,
  retryDelay: 1000,
  requiredSecrets: ['WARP_API_KEY', 'OZ_ENVIRONMENT_ID'],
  capabilities: ['capability1', 'capability2'],
};

export class MyAgent implements IAgent {
  public readonly config: AgentConfig = MY_AGENT_CONFIG;

  public validateInput(input: AgentInput): boolean {
    AgentInputSchema.parse(input);
    // Add custom validation
    return true;
  }

  public async execute(
    input: AgentInput,
    context: AgentContext
  ): Promise<AgentOutput> {
    // Your agent logic here
    return {
      success: true,
      message: 'Agent executed successfully',
      data: { /* your data */ },
    };
  }

  public async healthCheck(): Promise<{ healthy: boolean; message?: string }> {
    return { healthy: true, message: 'Agent is healthy' };
  }
}

export function createMyAgent(): MyAgent {
  return new MyAgent();
}
```

### Step 2: Create API Route

Create `app/api/agents/my-agent/route.ts`:

```typescript
import { NextRequest, NextResponse } from 'next/server';
import { getOrchestrator } from '@/lib/agents/orchestrator';
import { createMyAgent } from '@/lib/agents/my-agent';
import { AgentInputSchema } from '@/lib/agents/types';

let isInitialized = false;

function initializeAgent() {
  if (!isInitialized) {
    const orchestrator = getOrchestrator();
    const agent = createMyAgent();
    orchestrator.registerAgent(agent);
    isInitialized = true;
  }
}

export async function POST(request: NextRequest) {
  try {
    initializeAgent();
    
    const body = await request.json();
    const input = AgentInputSchema.parse(body);
    
    const orchestrator = getOrchestrator();
    const result = await orchestrator.executeAgent('my-agent', input);
    
    return NextResponse.json({
      success: result.status === 'completed',
      executionId: result.executionId,
      output: result.output,
    });
  } catch (error) {
    return NextResponse.json(
      { error: (error as Error).message },
      { status: 500 }
    );
  }
}
```

### Step 3: Test Your Agent

```bash
curl -X POST http://localhost:3000/api/agents/my-agent \
  -H "Content-Type: application/json" \
  -d '{"action":"your-action","parameters":{}}'
```

## Agent Configuration

### AgentConfig Properties

```typescript
{
  name: string;              // Unique agent identifier
  description: string;       // Agent description
  version: string;          // Semantic version
  enabled: boolean;         // Enable/disable agent
  timeout: number;          // Execution timeout (ms)
  retryAttempts: number;    // Max retry attempts
  retryDelay: number;       // Base retry delay (ms)
  requiredSecrets: string[]; // Required environment variables
  capabilities: string[];    // Agent capabilities
}
```

## Orchestrator Features

### Execution Control

```typescript
const orchestrator = getOrchestrator({
  maxConcurrentExecutions: 10,  // Max parallel executions
  defaultTimeout: 30000,         // Default timeout (ms)
  enableLogging: true,           // Enable logging
  logLevel: 'info',              // Log level
});
```

### Priority-Based Execution

```typescript
const result = await orchestrator.executeAgent(
  'my-agent',
  input,
  {
    priority: AgentPriority.HIGH,  // HIGH, MEDIUM, LOW, CRITICAL
    userId: 'user-123',
    metadata: { /* custom metadata */ }
  }
);
```

### Retry Policy

Automatic retry with exponential backoff:
- Initial delay: `retryDelay`
- Subsequent delays: `retryDelay * (backoffMultiplier ^ retryCount)`
- Default backoff multiplier: 2

### Metrics and Monitoring

```typescript
// Get agent metrics
const metrics = orchestrator.getAgentMetrics('my-agent');
// Returns: totalExecutions, successfulExecutions, failedExecutions, 
//          averageExecutionTime, errorRate, uptime

// Get execution logs
const logs = orchestrator.getLogs(limit);

// Health check
const health = await orchestrator.healthCheck();
```

## Error Handling

### Error Types

- `VALIDATION_ERROR` - Input validation failed
- `EXECUTION_ERROR` - Agent execution failed
- `TIMEOUT_ERROR` - Execution timed out
- `CONFIGURATION_ERROR` - Configuration issue
- `NETWORK_ERROR` - Network request failed
- `AUTHENTICATION_ERROR` - Authentication failed
- `RESOURCE_ERROR` - Resource not available
- `UNKNOWN_ERROR` - Unknown error

### Custom Error Handling

```typescript
import { AgentError, AgentErrorType } from '@/lib/agents/types';

throw new AgentError(
  'Error message',
  AgentErrorType.VALIDATION_ERROR,
  'agent-name',
  'execution-id'
);
```

## API Response Format

### Success Response

```json
{
  "success": true,
  "executionId": "uuid",
  "status": "completed",
  "output": {
    "success": true,
    "data": { /* agent output */ },
    "message": "Success message",
    "executionTime": 123
  },
  "timing": {
    "agentExecutionTime": 123,
    "totalApiTime": 150,
    "startTime": "2026-02-20T05:00:00.000Z",
    "endTime": "2026-02-20T05:00:00.123Z"
  },
  "logs": [ /* execution logs */ ],
  "metadata": {
    "agentName": "my-agent",
    "retryCount": 0,
    "action": "greet"
  }
}
```

### Error Response

```json
{
  "success": false,
  "error": "Error message",
  "errorType": "VALIDATION_ERROR",
  "agentName": "my-agent",
  "executionId": "uuid",
  "timing": {
    "totalApiTime": 50
  }
}
```

## Best Practices

### 1. Input Validation

Always validate input before execution:
```typescript
public validateInput(input: AgentInput): boolean {
  AgentInputSchema.parse(input);
  // Add custom validation logic
  if (!input.parameters?.requiredField) {
    throw new AgentError(
      'Missing required field',
      AgentErrorType.VALIDATION_ERROR,
      this.config.name
    );
  }
  return true;
}
```

### 2. Error Handling

Use AgentError for consistent error handling:
```typescript
try {
  // Agent logic
} catch (error) {
  throw new AgentError(
    `Operation failed: ${error.message}`,
    AgentErrorType.EXECUTION_ERROR,
    this.config.name,
    context.executionId,
    error
  );
}
```

### 3. Logging

Log important events:
```typescript
console.log('[AgentName] Operation started', { data });
console.error('[AgentName] Operation failed', { error });
```

### 4. Health Checks

Implement robust health checks:
```typescript
public async healthCheck(): Promise<{ healthy: boolean; message?: string }> {
  try {
    // Check dependencies
    await this.checkDependencies();
    
    return { healthy: true, message: 'All systems operational' };
  } catch (error) {
    return { 
      healthy: false, 
      message: `Health check failed: ${error.message}` 
    };
  }
}
```

### 5. Timeouts

Set appropriate timeouts based on agent complexity:
- Simple agents: 5-10 seconds
- Medium complexity: 15-30 seconds
- Complex operations: 60+ seconds

### 6. Retry Strategy

Configure retries based on operation type:
- Idempotent operations: 3-5 retries
- Non-idempotent operations: 0-1 retry
- Network operations: 3 retries with exponential backoff

## Testing

### Unit Testing Agent

```typescript
import { createMyAgent } from '@/lib/agents/my-agent';

describe('MyAgent', () => {
  it('should execute successfully', async () => {
    const agent = createMyAgent();
    const result = await agent.execute(
      { action: 'test' },
      { 
        executionId: 'test-id',
        environmentId: 'test-env',
        timestamp: new Date().toISOString()
      }
    );
    expect(result.success).toBe(true);
  });
});
```

### Integration Testing API

```bash
# Test agent endpoint
npm run test:e2e
```

## Monitoring and Debugging

### View Logs

```bash
# Get recent logs
curl http://localhost:3000/api/agents/my-agent?limit=50

# View orchestrator logs
curl http://localhost:3000/api/agents/hello-world
```

### Metrics Dashboard

Access agent metrics via the API:
```bash
curl http://localhost:3000/api/agents/my-agent
```

## Troubleshooting

### Agent Not Found

**Problem**: `Agent 'my-agent' not found`

**Solution**: Ensure agent is registered in the API route initialization.

### Timeout Errors

**Problem**: `Agent execution timed out after Xms`

**Solution**: Increase timeout in agent config or optimize agent logic.

### Validation Errors

**Problem**: `Input validation failed`

**Solution**: Check input schema matches agent expectations.

### Environment Variables

**Problem**: `WARP_API_KEY environment variable is not set`

**Solution**: Add required variables to `.env.local`.

## Related Tickets

- LAU-377: Agent orchestration layer implementation

## Support

For issues or questions:
- Check the [main README](../../README.md)
- Review agent logs via API endpoints
- Contact: Jimmy Lauchoy

---

**Version**: 1.0.0  
**Last Updated**: 2026-02-20  
**Status**: Production Ready ✅
