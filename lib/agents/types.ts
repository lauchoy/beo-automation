import { z } from 'zod';

/**
 * Agent Execution Status
 * Tracks the current state of an agent execution
 */
export enum AgentStatus {
  PENDING = 'pending',
  RUNNING = 'running',
  COMPLETED = 'completed',
  FAILED = 'failed',
  CANCELLED = 'cancelled',
}

/**
 * Agent Priority Levels
 * Determines execution order when multiple agents are queued
 */
export enum AgentPriority {
  LOW = 'low',
  MEDIUM = 'medium',
  HIGH = 'high',
  CRITICAL = 'critical',
}

/**
 * Agent Execution Context Schema
 * Contains metadata and configuration for agent execution
 */
export const AgentContextSchema = z.object({
  executionId: z.string().uuid(),
  userId: z.string().optional(),
  environmentId: z.string(),
  timestamp: z.string().datetime(),
  priority: z.nativeEnum(AgentPriority).default(AgentPriority.MEDIUM),
  metadata: z.record(z.unknown()).optional(),
});

export type AgentContext = z.infer<typeof AgentContextSchema>;

/**
 * Agent Input Schema
 * Validates input parameters for agent execution
 */
export const AgentInputSchema = z.object({
  action: z.string(),
  parameters: z.record(z.unknown()).optional(),
  context: AgentContextSchema.optional(),
});

export type AgentInput = z.infer<typeof AgentInputSchema>;

/**
 * Agent Output Schema
 * Standardized response format for all agent executions
 */
export const AgentOutputSchema = z.object({
  success: z.boolean(),
  data: z.unknown().optional(),
  message: z.string().optional(),
  error: z.string().optional(),
  executionTime: z.number().optional(), // milliseconds
  metadata: z.record(z.unknown()).optional(),
});

export type AgentOutput = z.infer<typeof AgentOutputSchema>;

/**
 * Agent Execution Log Entry Schema
 * Captures detailed execution logs for debugging and auditing
 */
export const AgentLogEntrySchema = z.object({
  timestamp: z.string().datetime(),
  level: z.enum(['debug', 'info', 'warn', 'error']),
  message: z.string(),
  data: z.unknown().optional(),
  executionId: z.string().uuid().optional(),
});

export type AgentLogEntry = z.infer<typeof AgentLogEntrySchema>;

/**
 * Agent Configuration Schema
 * Defines agent capabilities and constraints
 */
export const AgentConfigSchema = z.object({
  name: z.string(),
  description: z.string(),
  version: z.string(),
  enabled: z.boolean().default(true),
  timeout: z.number().positive().default(30000), // milliseconds
  retryAttempts: z.number().int().min(0).default(3),
  retryDelay: z.number().positive().default(1000), // milliseconds
  requiredSecrets: z.array(z.string()).optional(),
  capabilities: z.array(z.string()).optional(),
});

export type AgentConfig = z.infer<typeof AgentConfigSchema>;

/**
 * Agent Execution Result Schema
 * Complete execution result with timing and logging
 */
export const AgentExecutionResultSchema = z.object({
  executionId: z.string().uuid(),
  agentName: z.string(),
  status: z.nativeEnum(AgentStatus),
  input: AgentInputSchema,
  output: AgentOutputSchema.optional(),
  startTime: z.string().datetime(),
  endTime: z.string().datetime().optional(),
  duration: z.number().optional(), // milliseconds
  logs: z.array(AgentLogEntrySchema).default([]),
  error: z.string().optional(),
  retryCount: z.number().int().min(0).default(0),
});

export type AgentExecutionResult = z.infer<typeof AgentExecutionResultSchema>;

/**
 * Warp API Configuration Schema
 * Configuration for Warp API integration
 */
export const WarpConfigSchema = z.object({
  apiKey: z.string(),
  environmentId: z.string(),
  baseUrl: z.string().url().default('https://api.warp.dev'),
  timeout: z.number().positive().default(30000),
});

export type WarpConfig = z.infer<typeof WarpConfigSchema>;

/**
 * Agent Interface
 * Base interface that all agents must implement
 */
export interface IAgent {
  /**
   * Agent configuration
   */
  config: AgentConfig;

  /**
   * Execute the agent with given input
   * @param input - Agent input parameters
   * @param context - Execution context
   * @returns Promise resolving to agent output
   */
  execute(input: AgentInput, context: AgentContext): Promise<AgentOutput>;

  /**
   * Validate input before execution
   * @param input - Agent input to validate
   * @returns True if input is valid
   */
  validateInput(input: AgentInput): boolean;

  /**
   * Get agent health status
   * @returns Health check result
   */
  healthCheck(): Promise<{ healthy: boolean; message?: string }>;
}

/**
 * Orchestrator Configuration Schema
 * Configuration for the agent orchestration layer
 */
export const OrchestratorConfigSchema = z.object({
  maxConcurrentExecutions: z.number().int().positive().default(10),
  defaultTimeout: z.number().positive().default(30000),
  enableLogging: z.boolean().default(true),
  logLevel: z.enum(['debug', 'info', 'warn', 'error']).default('info'),
  retryPolicy: z.object({
    maxAttempts: z.number().int().min(0).default(3),
    backoffMultiplier: z.number().positive().default(2),
    initialDelay: z.number().positive().default(1000),
  }).optional(),
});

export type OrchestratorConfig = z.infer<typeof OrchestratorConfigSchema>;

/**
 * Agent Registry Entry
 * Metadata for registered agents in the orchestrator
 */
export interface AgentRegistryEntry {
  name: string;
  instance: IAgent;
  config: AgentConfig;
  registeredAt: Date;
  lastExecutedAt?: Date;
  executionCount: number;
  successCount: number;
  failureCount: number;
}

/**
 * Execution Queue Item
 * Represents a queued agent execution
 */
export interface ExecutionQueueItem {
  executionId: string;
  agentName: string;
  input: AgentInput;
  context: AgentContext;
  priority: AgentPriority;
  queuedAt: Date;
  startedAt?: Date;
}

/**
 * Agent Metrics
 * Performance and usage metrics for agents
 */
export interface AgentMetrics {
  agentName: string;
  totalExecutions: number;
  successfulExecutions: number;
  failedExecutions: number;
  averageExecutionTime: number;
  lastExecutionTime?: number;
  uptime: number;
  errorRate: number;
}

/**
 * Error Types
 */
export enum AgentErrorType {
  VALIDATION_ERROR = 'VALIDATION_ERROR',
  EXECUTION_ERROR = 'EXECUTION_ERROR',
  TIMEOUT_ERROR = 'TIMEOUT_ERROR',
  CONFIGURATION_ERROR = 'CONFIGURATION_ERROR',
  NETWORK_ERROR = 'NETWORK_ERROR',
  AUTHENTICATION_ERROR = 'AUTHENTICATION_ERROR',
  RESOURCE_ERROR = 'RESOURCE_ERROR',
  UNKNOWN_ERROR = 'UNKNOWN_ERROR',
}

/**
 * Agent Error Class
 * Custom error class for agent-related errors
 */
export class AgentError extends Error {
  constructor(
    message: string,
    public type: AgentErrorType,
    public agentName?: string,
    public executionId?: string,
    public originalError?: Error
  ) {
    super(message);
    this.name = 'AgentError';
    Object.setPrototypeOf(this, AgentError.prototype);
  }

  toJSON() {
    return {
      name: this.name,
      message: this.message,
      type: this.type,
      agentName: this.agentName,
      executionId: this.executionId,
      stack: this.stack,
    };
  }
}
