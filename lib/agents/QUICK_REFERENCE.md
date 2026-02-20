# Agent Orchestration - Quick Reference

Fast reference guide for common agent operations.

## 🚀 Quick Start (30 seconds)

```bash
# 1. Install dependencies
npm install

# 2. Start server
npm run dev

# 3. Test agent
curl http://localhost:3000/api/agents/hello-world
```

## 📦 Imports

```typescript
// Everything you need
import {
  getOrchestrator,
  createHelloWorldAgent,
  AgentPriority,
  AgentInput,
  AgentError,
  AgentErrorType
} from '@/lib/agents';
```

## 🎯 Common Operations

### Execute an Agent

```typescript
const orchestrator = getOrchestrator();
const result = await orchestrator.executeAgent('hello-world', {
  action: 'greet',
  parameters: { name: 'Jimmy' }
});
```

### Register an Agent

```typescript
const orchestrator = getOrchestrator();
const agent = createHelloWorldAgent();
orchestrator.registerAgent(agent);
```

### Get Agent Metrics

```typescript
const metrics = orchestrator.getAgentMetrics('hello-world');
console.log('Success rate:', 
  (metrics.successfulExecutions / metrics.totalExecutions * 100) + '%'
);
```

### Health Check

```typescript
const health = await orchestrator.healthCheck();
console.log(health.orchestrator.healthy ? '✅' : '❌');
```

## 🔧 API Endpoints

### GET - Agent Info
```bash
curl http://localhost:3000/api/agents/hello-world
```

### POST - Execute Agent
```bash
curl -X POST http://localhost:3000/api/agents/hello-world \
  -H "Content-Type: application/json" \
  -d '{"action":"greet","parameters":{"name":"Jimmy"}}'
```

### PATCH - Get Metrics
```bash
curl -X PATCH http://localhost:3000/api/agents/hello-world?limit=10
```

### DELETE - Unregister
```bash
curl -X DELETE http://localhost:3000/api/agents/hello-world
```

## 🎨 Hello World Actions

```bash
# Greet
{"action":"greet","parameters":{"name":"Jimmy","language":"en"}}

# Echo
{"action":"echo","parameters":{"message":"Hello!"}}

# Ping
{"action":"ping"}

# Error Test
{"action":"error_test"}

# Delay Test
{"action":"delay_test","parameters":{"delayMs":2000}}
```

## ⚙️ Configuration

### Orchestrator Config
```typescript
getOrchestrator({
  maxConcurrentExecutions: 10,
  defaultTimeout: 30000,
  enableLogging: true,
  logLevel: 'info'
});
```

### Agent Config
```typescript
{
  name: 'my-agent',
  description: 'My awesome agent',
  version: '1.0.0',
  enabled: true,
  timeout: 10000,
  retryAttempts: 3,
  retryDelay: 1000
}
```

## 🎭 Priorities

```typescript
AgentPriority.CRITICAL  // Highest
AgentPriority.HIGH
AgentPriority.MEDIUM    // Default
AgentPriority.LOW       // Lowest
```

## ⚠️ Error Types

```typescript
AgentErrorType.VALIDATION_ERROR      // 400
AgentErrorType.AUTHENTICATION_ERROR  // 401
AgentErrorType.TIMEOUT_ERROR         // 408
AgentErrorType.EXECUTION_ERROR       // 500
AgentErrorType.CONFIGURATION_ERROR   // 500
AgentErrorType.NETWORK_ERROR         // 500
AgentErrorType.RESOURCE_ERROR        // 500
AgentErrorType.UNKNOWN_ERROR         // 500
```

## 🐛 Debugging

### View Logs
```typescript
const logs = orchestrator.getLogs(50);
logs.forEach(log => 
  console.log(`[${log.level}] ${log.message}`)
);
```

### Check Execution Result
```typescript
const result = orchestrator.getExecutionResult(executionId);
console.log('Status:', result.status);
console.log('Duration:', result.duration, 'ms');
console.log('Logs:', result.logs);
```

### Monitor Metrics
```typescript
const metrics = orchestrator.getAgentMetrics('my-agent');
console.log({
  total: metrics.totalExecutions,
  success: metrics.successfulExecutions,
  failed: metrics.failedExecutions,
  avgTime: metrics.averageExecutionTime,
  errorRate: metrics.errorRate * 100 + '%'
});
```

## 🎯 Response Format

### Success
```json
{
  "success": true,
  "executionId": "uuid",
  "status": "completed",
  "output": {
    "success": true,
    "data": {},
    "message": "Success!",
    "executionTime": 123
  },
  "timing": {
    "agentExecutionTime": 123,
    "totalApiTime": 150
  }
}
```

### Error
```json
{
  "success": false,
  "error": "Error message",
  "errorType": "VALIDATION_ERROR",
  "agentName": "my-agent",
  "executionId": "uuid"
}
```

## 📊 Metrics Structure

```typescript
{
  agentName: string,
  totalExecutions: number,
  successfulExecutions: number,
  failedExecutions: number,
  averageExecutionTime: number,  // ms
  lastExecutionTime: number,     // ms
  uptime: number,                // ms
  errorRate: number              // 0-1
}
```

## 🔐 Environment Variables

```env
WARP_API_KEY=wk-1.2f527b6a0b1a46b3577c544b5cda4dc9947714babb7296f979f79f0dd368e860
OZ_ENVIRONMENT_ID=5c65dad1e6cbca5f347e77e8a9443bdd
```

## 💡 Tips

1. **Always validate input** before execution
2. **Set appropriate timeouts** based on operation complexity
3. **Use priority** for time-sensitive operations
4. **Monitor metrics** to identify performance issues
5. **Check health** regularly in production
6. **Log important events** for debugging
7. **Handle errors** gracefully with try-catch
8. **Test retry logic** with error_test action

## 🚨 Common Issues

### Agent Not Found
```typescript
// Check if registered
const agent = orchestrator.getAgent('my-agent');
if (!agent) {
  console.log('Agent not registered!');
}
```

### Timeout
```typescript
// Increase timeout
const agent = createMyAgent();
agent.config.timeout = 60000; // 60 seconds
```

### Validation Failed
```typescript
// Check input schema
try {
  AgentInputSchema.parse(input);
} catch (error) {
  console.log('Validation errors:', error.errors);
}
```

## 📚 More Info

- Full docs: [README.md](./README.md)
- Examples: [examples.ts](./examples.ts)
- Implementation: [AGENT_IMPLEMENTATION.md](../../AGENT_IMPLEMENTATION.md)

## 🔗 Quick Links

- [Types](./types.ts) - All type definitions
- [Orchestrator](./orchestrator.ts) - Main orchestrator
- [Hello World Agent](./hello-world-agent.ts) - Example agent
- [API Route](../../app/api/agents/hello-world/route.ts) - API endpoint

---

**Need help?** Check the full [README.md](./README.md) or [examples.ts](./examples.ts)
