/**
 * Agent Orchestration Layer - Main Export
 * 
 * Provides a centralized export for all agent-related functionality.
 * 
 * @example
 * ```typescript
 * import { 
 *   getOrchestrator, 
 *   createHelloWorldAgent,
 *   AgentPriority 
 * } from '@/lib/agents';
 * ```
 */

// Core Types
export type {
  IAgent,
  AgentInput,
  AgentOutput,
  AgentContext,
  AgentConfig,
  AgentExecutionResult,
  AgentLogEntry,
  AgentRegistryEntry,
  ExecutionQueueItem,
  AgentMetrics,
  WarpConfig,
  OrchestratorConfig,
} from './types';

// Enums
export {
  AgentStatus,
  AgentPriority,
  AgentErrorType,
} from './types';

// Schemas for validation
export {
  AgentContextSchema,
  AgentInputSchema,
  AgentOutputSchema,
  AgentLogEntrySchema,
  AgentConfigSchema,
  AgentExecutionResultSchema,
  WarpConfigSchema,
  OrchestratorConfigSchema,
} from './types';

// Custom Error Class
export { AgentError } from './types';

// Orchestrator
export {
  AgentOrchestrator,
  getOrchestrator,
} from './orchestrator';

// Agents
export {
  HelloWorldAgent,
  HelloWorldAction,
  createHelloWorldAgent,
} from './hello-world-agent';
