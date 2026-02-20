/**
 * Agent Orchestration Layer - Usage Examples
 * 
 * This file contains practical examples of how to use the agent orchestration system.
 * These examples can be used for testing, learning, or as templates for new implementations.
 */

import {
  getOrchestrator,
  createHelloWorldAgent,
  AgentPriority,
  AgentInput,
  AgentContext,
} from './index';

/**
 * Example 1: Basic Agent Registration and Execution
 * 
 * Demonstrates the simplest use case - registering and executing an agent.
 */
export async function basicAgentExecution() {
  console.log('=== Example 1: Basic Agent Execution ===\n');

  // Get orchestrator instance
  const orchestrator = getOrchestrator();

  // Create and register agent
  const helloAgent = createHelloWorldAgent();
  orchestrator.registerAgent(helloAgent);

  // Define input
  const input: AgentInput = {
    action: 'greet',
    parameters: {
      name: 'Jimmy',
      language: 'en',
    },
  };

  // Execute agent
  const result = await orchestrator.executeAgent('hello-world', input);

  console.log('Execution Result:');
  console.log('- Status:', result.status);
  console.log('- Duration:', result.duration, 'ms');
  console.log('- Output:', JSON.stringify(result.output, null, 2));
  console.log();

  return result;
}

/**
 * Example 2: Priority-Based Execution
 * 
 * Shows how to use priority levels to control execution order.
 */
export async function priorityBasedExecution() {
  console.log('=== Example 2: Priority-Based Execution ===\n');

  const orchestrator = getOrchestrator();

  // High priority execution
  const highPriorityResult = await orchestrator.executeAgent(
    'hello-world',
    {
      action: 'ping',
    },
    {
      priority: AgentPriority.HIGH,
      userId: 'admin-user',
      metadata: {
        importance: 'critical',
      },
    }
  );

  console.log('High Priority Execution:');
  console.log('- Execution ID:', highPriorityResult.executionId);
  console.log('- Priority:', AgentPriority.HIGH);
  console.log('- Duration:', highPriorityResult.duration, 'ms');
  console.log();

  return highPriorityResult;
}

/**
 * Example 3: Error Handling
 * 
 * Demonstrates how errors are handled and retried.
 */
export async function errorHandlingExample() {
  console.log('=== Example 3: Error Handling ===\n');

  const orchestrator = getOrchestrator();

  try {
    // This will trigger an intentional error
    const result = await orchestrator.executeAgent('hello-world', {
      action: 'error_test',
    });

    console.log('Result:', result);
  } catch (error) {
    console.log('Caught error as expected:');
    console.log('- Message:', (error as Error).message);
    console.log('- Type:', (error as any).type);
    console.log();
  }
}

/**
 * Example 4: Timeout Testing
 * 
 * Shows how timeouts work with delayed operations.
 */
export async function timeoutExample() {
  console.log('=== Example 4: Timeout Testing ===\n');

  const orchestrator = getOrchestrator();

  // Test with delay shorter than timeout (should succeed)
  const successResult = await orchestrator.executeAgent('hello-world', {
    action: 'delay_test',
    parameters: {
      delayMs: 1000, // 1 second delay
    },
  });

  console.log('Successful Delayed Execution:');
  console.log('- Status:', successResult.status);
  console.log('- Duration:', successResult.duration, 'ms');
  console.log();

  return successResult;
}

/**
 * Example 5: Metrics and Monitoring
 * 
 * Demonstrates how to retrieve and use agent metrics.
 */
export async function metricsExample() {
  console.log('=== Example 5: Metrics and Monitoring ===\n');

  const orchestrator = getOrchestrator();

  // Execute several times to generate metrics
  for (let i = 0; i < 3; i++) {
    await orchestrator.executeAgent('hello-world', {
      action: 'ping',
    });
  }

  // Get metrics
  const metrics = orchestrator.getAgentMetrics('hello-world');

  console.log('Agent Metrics:');
  console.log('- Total Executions:', metrics?.totalExecutions);
  console.log('- Successful:', metrics?.successfulExecutions);
  console.log('- Failed:', metrics?.failedExecutions);
  console.log('- Average Time:', metrics?.averageExecutionTime.toFixed(2), 'ms');
  console.log('- Error Rate:', (metrics?.errorRate! * 100).toFixed(2), '%');
  console.log();

  return metrics;
}

/**
 * Example 6: Health Checks
 * 
 * Shows how to perform health checks on agents.
 */
export async function healthCheckExample() {
  console.log('=== Example 6: Health Checks ===\n');

  const orchestrator = getOrchestrator();

  // Perform health check
  const health = await orchestrator.healthCheck();

  console.log('Orchestrator Health:', health.orchestrator);
  console.log('\nAgent Health:');
  Object.entries(health.agents).forEach(([name, status]) => {
    console.log(`- ${name}:`, status.healthy ? '✅ Healthy' : '❌ Unhealthy');
    if (status.message) {
      console.log(`  Message: ${status.message}`);
    }
  });
  console.log();

  return health;
}

/**
 * Example 7: Multiple Actions
 * 
 * Demonstrates executing different actions on the same agent.
 */
export async function multipleActionsExample() {
  console.log('=== Example 7: Multiple Actions ===\n');

  const orchestrator = getOrchestrator();

  const actions = [
    { action: 'greet', parameters: { name: 'Alice', language: 'en' } },
    { action: 'greet', parameters: { name: 'Carlos', language: 'es' } },
    { action: 'greet', parameters: { name: 'Marie', language: 'fr' } },
    { action: 'echo', parameters: { message: 'Hello World!' } },
    { action: 'ping' },
  ];

  const results = [];

  for (const input of actions) {
    const result = await orchestrator.executeAgent('hello-world', input as AgentInput);
    results.push({
      action: input.action,
      message: result.output?.message,
      duration: result.duration,
    });
  }

  console.log('Multiple Action Results:');
  results.forEach((r, i) => {
    console.log(`${i + 1}. ${r.action}: "${r.message}" (${r.duration}ms)`);
  });
  console.log();

  return results;
}

/**
 * Example 8: Concurrent Execution
 * 
 * Shows how multiple agents can execute concurrently.
 */
export async function concurrentExecutionExample() {
  console.log('=== Example 8: Concurrent Execution ===\n');

  const orchestrator = getOrchestrator();

  // Execute multiple agents concurrently
  const promises = [
    orchestrator.executeAgent('hello-world', { action: 'ping' }),
    orchestrator.executeAgent('hello-world', {
      action: 'greet',
      parameters: { name: 'User1' },
    }),
    orchestrator.executeAgent('hello-world', {
      action: 'echo',
      parameters: { message: 'Concurrent test' },
    }),
  ];

  const startTime = Date.now();
  const results = await Promise.all(promises);
  const totalTime = Date.now() - startTime;

  console.log('Concurrent Execution Results:');
  console.log('- Executions:', results.length);
  console.log('- Total Time:', totalTime, 'ms');
  console.log('- Average Time per execution:', (totalTime / results.length).toFixed(2), 'ms');
  console.log('\nIndividual Results:');
  results.forEach((r, i) => {
    console.log(`${i + 1}. ${r.output?.message} (${r.duration}ms)`);
  });
  console.log();

  return results;
}

/**
 * Example 9: Custom Context
 * 
 * Shows how to pass custom context and metadata.
 */
export async function customContextExample() {
  console.log('=== Example 9: Custom Context ===\n');

  const orchestrator = getOrchestrator();

  const customContext: Partial<AgentContext> = {
    userId: 'user-12345',
    priority: AgentPriority.MEDIUM,
    environmentId: process.env.OZ_ENVIRONMENT_ID || 'default',
    metadata: {
      requestSource: 'example-script',
      timestamp: new Date().toISOString(),
      customData: {
        feature: 'agent-orchestration',
        version: '1.0.0',
      },
    },
  };

  const result = await orchestrator.executeAgent(
    'hello-world',
    { action: 'ping' },
    customContext
  );

  console.log('Execution with Custom Context:');
  console.log('- User ID:', customContext.userId);
  console.log('- Priority:', customContext.priority);
  console.log('- Metadata:', JSON.stringify(customContext.metadata, null, 2));
  console.log('- Result:', result.output?.message);
  console.log();

  return result;
}

/**
 * Example 10: Logging
 * 
 * Demonstrates how to access execution logs.
 */
export async function loggingExample() {
  console.log('=== Example 10: Logging ===\n');

  const orchestrator = getOrchestrator();

  // Execute some actions
  await orchestrator.executeAgent('hello-world', { action: 'greet' });
  await orchestrator.executeAgent('hello-world', { action: 'ping' });

  // Get recent logs
  const logs = orchestrator.getLogs(5);

  console.log('Recent Orchestrator Logs:');
  logs.forEach((log, i) => {
    console.log(`\n${i + 1}. [${log.level.toUpperCase()}] ${log.timestamp}`);
    console.log(`   ${log.message}`);
    if (log.data) {
      console.log('   Data:', JSON.stringify(log.data, null, 2));
    }
  });
  console.log();

  return logs;
}

/**
 * Run All Examples
 * 
 * Executes all examples in sequence for demonstration.
 */
export async function runAllExamples() {
  console.log('\n🚀 Running All Agent Orchestration Examples\n');
  console.log('='.repeat(60));
  console.log();

  try {
    await basicAgentExecution();
    await priorityBasedExecution();
    await errorHandlingExample();
    await timeoutExample();
    await metricsExample();
    await healthCheckExample();
    await multipleActionsExample();
    await concurrentExecutionExample();
    await customContextExample();
    await loggingExample();

    console.log('='.repeat(60));
    console.log('\n✅ All examples completed successfully!\n');
  } catch (error) {
    console.error('\n❌ Error running examples:', error);
    throw error;
  }
}

// Uncomment to run examples directly
// if (require.main === module) {
//   runAllExamples().catch(console.error);
// }
