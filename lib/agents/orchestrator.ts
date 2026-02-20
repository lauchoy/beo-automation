import { v4 as uuidv4 } from 'uuid';
import {
  IAgent,
  AgentInput,
  AgentOutput,
  AgentContext,
  AgentExecutionResult,
  AgentStatus,
  AgentPriority,
  AgentRegistryEntry,
  ExecutionQueueItem,
  AgentMetrics,
  OrchestratorConfig,
  OrchestratorConfigSchema,
  AgentError,
  AgentErrorType,
  AgentLogEntry,
} from './types';

/**
 * Agent Orchestrator
 * Manages agent lifecycle, execution, and coordination
 * 
 * Features:
 * - Agent registration and discovery
 * - Execution queue management with priority
 * - Concurrent execution control
 * - Retry logic with exponential backoff
 * - Comprehensive logging and metrics
 * - Error handling and recovery
 * 
 * @example
 * ```typescript
 * const orchestrator = AgentOrchestrator.getInstance();
 * orchestrator.registerAgent(myAgent);
 * const result = await orchestrator.executeAgent('my-agent', input, context);
 * ```
 */
export class AgentOrchestrator {
  private static instance: AgentOrchestrator;
  private agents: Map<string, AgentRegistryEntry> = new Map();
  private executionQueue: ExecutionQueueItem[] = [];
  private activeExecutions: Map<string, Promise<AgentExecutionResult>> = new Map();
  private executionHistory: Map<string, AgentExecutionResult> = new Map();
  private config: OrchestratorConfig;
  private logs: AgentLogEntry[] = [];

  /**
   * Private constructor for singleton pattern
   */
  private constructor(config?: Partial<OrchestratorConfig>) {
    this.config = OrchestratorConfigSchema.parse(config || {});
    this.log('info', 'Agent Orchestrator initialized', { config: this.config });
  }

  /**
   * Get singleton instance of orchestrator
   * @param config - Optional configuration overrides
   * @returns Orchestrator instance
   */
  public static getInstance(config?: Partial<OrchestratorConfig>): AgentOrchestrator {
    if (!AgentOrchestrator.instance) {
      AgentOrchestrator.instance = new AgentOrchestrator(config);
    }
    return AgentOrchestrator.instance;
  }

  /**
   * Register an agent with the orchestrator
   * @param agent - Agent instance to register
   * @throws AgentError if agent with same name already exists
   */
  public registerAgent(agent: IAgent): void {
    const { name } = agent.config;

    if (this.agents.has(name)) {
      throw new AgentError(
        `Agent '${name}' is already registered`,
        AgentErrorType.CONFIGURATION_ERROR,
        name
      );
    }

    const entry: AgentRegistryEntry = {
      name,
      instance: agent,
      config: agent.config,
      registeredAt: new Date(),
      executionCount: 0,
      successCount: 0,
      failureCount: 0,
    };

    this.agents.set(name, entry);
    this.log('info', `Agent '${name}' registered successfully`, {
      version: agent.config.version,
      capabilities: agent.config.capabilities,
    });
  }

  /**
   * Unregister an agent
   * @param agentName - Name of agent to unregister
   * @returns True if agent was unregistered, false if not found
   */
  public unregisterAgent(agentName: string): boolean {
    const removed = this.agents.delete(agentName);
    if (removed) {
      this.log('info', `Agent '${agentName}' unregistered`);
    }
    return removed;
  }

  /**
   * Execute an agent by name
   * @param agentName - Name of the agent to execute
   * @param input - Input parameters for the agent
   * @param context - Optional execution context
   * @returns Promise resolving to execution result
   * @throws AgentError if agent not found or execution fails
   */
  public async executeAgent(
    agentName: string,
    input: AgentInput,
    context?: Partial<AgentContext>
  ): Promise<AgentExecutionResult> {
    const executionId = uuidv4();
    const startTime = new Date();

    // Build full context
    const fullContext: AgentContext = {
      executionId,
      environmentId: context?.environmentId || process.env.OZ_ENVIRONMENT_ID || '',
      timestamp: startTime.toISOString(),
      priority: context?.priority || AgentPriority.MEDIUM,
      userId: context?.userId,
      metadata: context?.metadata,
    };

    this.log('info', `Starting agent execution: ${agentName}`, {
      executionId,
      input,
      context: fullContext,
    });

    // Get agent from registry
    const agentEntry = this.agents.get(agentName);
    if (!agentEntry) {
      const error = new AgentError(
        `Agent '${agentName}' not found`,
        AgentErrorType.CONFIGURATION_ERROR,
        agentName,
        executionId
      );
      return this.createErrorResult(executionId, agentName, input, startTime, error);
    }

    const { instance: agent, config } = agentEntry;

    // Check if agent is enabled
    if (!config.enabled) {
      const error = new AgentError(
        `Agent '${agentName}' is disabled`,
        AgentErrorType.CONFIGURATION_ERROR,
        agentName,
        executionId
      );
      return this.createErrorResult(executionId, agentName, input, startTime, error);
    }

    // Check concurrent execution limit
    if (this.activeExecutions.size >= this.config.maxConcurrentExecutions) {
      this.log('warn', `Max concurrent executions reached, queueing execution`, {
        executionId,
        activeCount: this.activeExecutions.size,
      });
      return this.queueExecution(agentName, input, fullContext);
    }

    // Execute with retry logic
    const executionPromise = this.executeWithRetry(
      agent,
      input,
      fullContext,
      executionId,
      startTime
    );

    this.activeExecutions.set(executionId, executionPromise);

    try {
      const result = await executionPromise;
      agentEntry.executionCount++;
      agentEntry.lastExecutedAt = new Date();

      if (result.status === AgentStatus.COMPLETED) {
        agentEntry.successCount++;
      } else {
        agentEntry.failureCount++;
      }

      this.executionHistory.set(executionId, result);
      return result;
    } finally {
      this.activeExecutions.delete(executionId);
      this.processQueue();
    }
  }

  /**
   * Execute agent with retry logic and timeout
   * @private
   */
  private async executeWithRetry(
    agent: IAgent,
    input: AgentInput,
    context: AgentContext,
    executionId: string,
    startTime: Date,
    retryCount: number = 0
  ): Promise<AgentExecutionResult> {
    const logs: AgentLogEntry[] = [];
    const timeout = agent.config.timeout || this.config.defaultTimeout;

    try {
      // Validate input
      if (!agent.validateInput(input)) {
        throw new AgentError(
          'Input validation failed',
          AgentErrorType.VALIDATION_ERROR,
          agent.config.name,
          executionId
        );
      }

      logs.push(this.createLogEntry('info', 'Input validated successfully', { input }));

      // Execute with timeout
      const output = await this.executeWithTimeout(agent, input, context, timeout);

      const endTime = new Date();
      const duration = endTime.getTime() - startTime.getTime();

      logs.push(
        this.createLogEntry('info', 'Agent execution completed successfully', {
          duration,
          output,
        })
      );

      return {
        executionId,
        agentName: agent.config.name,
        status: AgentStatus.COMPLETED,
        input,
        output,
        startTime: startTime.toISOString(),
        endTime: endTime.toISOString(),
        duration,
        logs,
        retryCount,
      };
    } catch (error) {
      const err = error as Error;
      logs.push(
        this.createLogEntry('error', `Execution failed: ${err.message}`, {
          error: err,
          retryCount,
        })
      );

      // Retry logic
      if (retryCount < agent.config.retryAttempts) {
        const delay = this.calculateRetryDelay(retryCount, agent.config.retryDelay);
        this.log('warn', `Retrying agent execution after ${delay}ms`, {
          executionId,
          retryCount: retryCount + 1,
          maxRetries: agent.config.retryAttempts,
        });

        await this.sleep(delay);
        return this.executeWithRetry(
          agent,
          input,
          context,
          executionId,
          startTime,
          retryCount + 1
        );
      }

      // Max retries exceeded
      const endTime = new Date();
      const duration = endTime.getTime() - startTime.getTime();

      return {
        executionId,
        agentName: agent.config.name,
        status: AgentStatus.FAILED,
        input,
        startTime: startTime.toISOString(),
        endTime: endTime.toISOString(),
        duration,
        logs,
        error: err.message,
        retryCount,
      };
    }
  }

  /**
   * Execute agent with timeout protection
   * @private
   */
  private async executeWithTimeout(
    agent: IAgent,
    input: AgentInput,
    context: AgentContext,
    timeout: number
  ): Promise<AgentOutput> {
    return Promise.race([
      agent.execute(input, context),
      this.createTimeoutPromise(timeout, agent.config.name, context.executionId),
    ]);
  }

  /**
   * Create a timeout promise that rejects after specified duration
   * @private
   */
  private createTimeoutPromise(
    timeout: number,
    agentName: string,
    executionId: string
  ): Promise<never> {
    return new Promise((_, reject) => {
      setTimeout(() => {
        reject(
          new AgentError(
            `Agent execution timed out after ${timeout}ms`,
            AgentErrorType.TIMEOUT_ERROR,
            agentName,
            executionId
          )
        );
      }, timeout);
    });
  }

  /**
   * Queue an execution for later processing
   * @private
   */
  private async queueExecution(
    agentName: string,
    input: AgentInput,
    context: AgentContext
  ): Promise<AgentExecutionResult> {
    const queueItem: ExecutionQueueItem = {
      executionId: context.executionId,
      agentName,
      input,
      context,
      priority: context.priority,
      queuedAt: new Date(),
    };

    this.executionQueue.push(queueItem);
    this.executionQueue.sort((a, b) => this.comparePriority(b.priority, a.priority));

    this.log('info', 'Execution queued', { executionId: context.executionId, agentName });

    // Wait for execution to be processed
    return new Promise((resolve) => {
      const checkInterval = setInterval(() => {
        const result = this.executionHistory.get(context.executionId);
        if (result) {
          clearInterval(checkInterval);
          resolve(result);
        }
      }, 100);
    });
  }

  /**
   * Process queued executions
   * @private
   */
  private processQueue(): void {
    while (
      this.executionQueue.length > 0 &&
      this.activeExecutions.size < this.config.maxConcurrentExecutions
    ) {
      const item = this.executionQueue.shift();
      if (item) {
        this.executeAgent(item.agentName, item.input, item.context).catch((error) => {
          this.log('error', 'Queued execution failed', { error, item });
        });
      }
    }
  }

  /**
   * Calculate retry delay with exponential backoff
   * @private
   */
  private calculateRetryDelay(retryCount: number, baseDelay: number): number {
    const backoffMultiplier = this.config.retryPolicy?.backoffMultiplier || 2;
    return baseDelay * Math.pow(backoffMultiplier, retryCount);
  }

  /**
   * Compare priority levels for sorting
   * @private
   */
  private comparePriority(a: AgentPriority, b: AgentPriority): number {
    const priorityOrder = {
      [AgentPriority.CRITICAL]: 4,
      [AgentPriority.HIGH]: 3,
      [AgentPriority.MEDIUM]: 2,
      [AgentPriority.LOW]: 1,
    };
    return priorityOrder[a] - priorityOrder[b];
  }

  /**
   * Create error execution result
   * @private
   */
  private createErrorResult(
    executionId: string,
    agentName: string,
    input: AgentInput,
    startTime: Date,
    error: AgentError
  ): AgentExecutionResult {
    const endTime = new Date();
    const duration = endTime.getTime() - startTime.getTime();

    this.log('error', `Agent execution failed: ${error.message}`, {
      executionId,
      agentName,
      error: error.toJSON(),
    });

    return {
      executionId,
      agentName,
      status: AgentStatus.FAILED,
      input,
      startTime: startTime.toISOString(),
      endTime: endTime.toISOString(),
      duration,
      logs: [this.createLogEntry('error', error.message, { error: error.toJSON() })],
      error: error.message,
      retryCount: 0,
    };
  }

  /**
   * Create a log entry
   * @private
   */
  private createLogEntry(
    level: 'debug' | 'info' | 'warn' | 'error',
    message: string,
    data?: unknown
  ): AgentLogEntry {
    return {
      timestamp: new Date().toISOString(),
      level,
      message,
      data,
    };
  }

  /**
   * Log a message
   * @private
   */
  private log(
    level: 'debug' | 'info' | 'warn' | 'error',
    message: string,
    data?: unknown
  ): void {
    if (!this.config.enableLogging) return;

    const logLevels = { debug: 0, info: 1, warn: 2, error: 3 };
    const currentLevel = logLevels[this.config.logLevel];
    const messageLevel = logLevels[level];

    if (messageLevel >= currentLevel) {
      const entry = this.createLogEntry(level, message, data);
      this.logs.push(entry);

      // Console output
      const logMethod = level === 'error' ? console.error : console.log;
      logMethod(`[AgentOrchestrator] [${level.toUpperCase()}] ${message}`, data || '');
    }
  }

  /**
   * Sleep utility
   * @private
   */
  private sleep(ms: number): Promise<void> {
    return new Promise((resolve) => setTimeout(resolve, ms));
  }

  /**
   * Get agent by name
   * @param agentName - Name of the agent
   * @returns Agent registry entry or undefined
   */
  public getAgent(agentName: string): AgentRegistryEntry | undefined {
    return this.agents.get(agentName);
  }

  /**
   * Get all registered agents
   * @returns Array of agent registry entries
   */
  public getAllAgents(): AgentRegistryEntry[] {
    return Array.from(this.agents.values());
  }

  /**
   * Get execution result by ID
   * @param executionId - Execution ID
   * @returns Execution result or undefined
   */
  public getExecutionResult(executionId: string): AgentExecutionResult | undefined {
    return this.executionHistory.get(executionId);
  }

  /**
   * Get metrics for an agent
   * @param agentName - Name of the agent
   * @returns Agent metrics or undefined
   */
  public getAgentMetrics(agentName: string): AgentMetrics | undefined {
    const entry = this.agents.get(agentName);
    if (!entry) return undefined;

    const executions = Array.from(this.executionHistory.values()).filter(
      (r) => r.agentName === agentName
    );

    const totalExecutionTime = executions.reduce((sum, r) => sum + (r.duration || 0), 0);
    const averageExecutionTime =
      executions.length > 0 ? totalExecutionTime / executions.length : 0;

    return {
      agentName,
      totalExecutions: entry.executionCount,
      successfulExecutions: entry.successCount,
      failedExecutions: entry.failureCount,
      averageExecutionTime,
      lastExecutionTime: executions[executions.length - 1]?.duration,
      uptime: Date.now() - entry.registeredAt.getTime(),
      errorRate:
        entry.executionCount > 0 ? entry.failureCount / entry.executionCount : 0,
    };
  }

  /**
   * Get orchestrator logs
   * @param limit - Maximum number of logs to return
   * @returns Array of log entries
   */
  public getLogs(limit?: number): AgentLogEntry[] {
    const logs = [...this.logs].reverse();
    return limit ? logs.slice(0, limit) : logs;
  }

  /**
   * Clear execution history
   * @param olderThan - Optional date to clear executions older than
   */
  public clearHistory(olderThan?: Date): void {
    if (olderThan) {
      const cutoffTime = olderThan.getTime();
      for (const [id, result] of this.executionHistory.entries()) {
        const resultTime = new Date(result.startTime).getTime();
        if (resultTime < cutoffTime) {
          this.executionHistory.delete(id);
        }
      }
    } else {
      this.executionHistory.clear();
    }

    this.log('info', 'Execution history cleared', { olderThan });
  }

  /**
   * Health check for orchestrator and all agents
   * @returns Health status for all components
   */
  public async healthCheck(): Promise<{
    orchestrator: { healthy: boolean; message?: string };
    agents: Record<string, { healthy: boolean; message?: string }>;
  }> {
    const agentHealth: Record<string, { healthy: boolean; message?: string }> = {};

    for (const [name, entry] of this.agents.entries()) {
      try {
        agentHealth[name] = await entry.instance.healthCheck();
      } catch (error) {
        agentHealth[name] = {
          healthy: false,
          message: `Health check failed: ${(error as Error).message}`,
        };
      }
    }

    return {
      orchestrator: {
        healthy: true,
        message: `${this.agents.size} agents registered, ${this.activeExecutions.size} active executions`,
      },
      agents: agentHealth,
    };
  }
}

/**
 * Get the singleton orchestrator instance
 * @param config - Optional configuration
 * @returns Orchestrator instance
 */
export function getOrchestrator(config?: Partial<OrchestratorConfig>): AgentOrchestrator {
  return AgentOrchestrator.getInstance(config);
}
