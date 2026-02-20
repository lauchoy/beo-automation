import { z } from 'zod';
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

/**
 * Hello World Agent Configuration
 */
const HELLO_WORLD_CONFIG: AgentConfig = {
  name: 'hello-world',
  description: 'A simple test agent that responds with greeting messages',
  version: '1.0.0',
  enabled: true,
  timeout: 5000, // 5 seconds
  retryAttempts: 2,
  retryDelay: 500,
  requiredSecrets: ['WARP_API_KEY', 'OZ_ENVIRONMENT_ID'],
  capabilities: ['greet', 'echo', 'ping'],
};

/**
 * Supported actions for Hello World Agent
 */
export enum HelloWorldAction {
  GREET = 'greet',
  ECHO = 'echo',
  PING = 'ping',
  ERROR_TEST = 'error_test',
  DELAY_TEST = 'delay_test',
}

/**
 * Hello World Agent Parameters Schemas
 */
const GreetParamsSchema = z.object({
  name: z.string().optional(),
  language: z.enum(['en', 'es', 'fr']).optional(),
});

const EchoParamsSchema = z.object({
  message: z.string(),
});

const DelayTestParamsSchema = z.object({
  delayMs: z.number(),
});

type GreetParams = z.infer<typeof GreetParamsSchema>;
type EchoParams = z.infer<typeof EchoParamsSchema>;
type DelayTestParams = z.infer<typeof DelayTestParamsSchema>;

/**
 * Hello World Agent
 * 
 * A simple test agent demonstrating the agent orchestration pattern.
 * Supports multiple actions for testing different scenarios.
 * 
 * @example
 * ```typescript
 * const agent = new HelloWorldAgent();
 * const result = await agent.execute(
 *   { action: 'greet', parameters: { name: 'Jimmy', language: 'en' } },
 *   context
 * );
 * ```
 */
export class HelloWorldAgent implements IAgent {
  public readonly config: AgentConfig = HELLO_WORLD_CONFIG;

  /**
   * Validate input before execution
   * @param input - Agent input to validate
   * @returns True if input is valid, throws error otherwise
   */
  public validateInput(input: AgentInput): boolean {
    try {
      // Validate base schema
      AgentInputSchema.parse(input);

      // Validate action is supported
      if (!Object.values(HelloWorldAction).includes(input.action as HelloWorldAction)) {
        throw new AgentError(
          `Unsupported action: ${input.action}. Supported actions: ${Object.values(HelloWorldAction).join(', ')}`,
          AgentErrorType.VALIDATION_ERROR,
          this.config.name
        );
      }

      // Action-specific validation
      switch (input.action) {
        case HelloWorldAction.ECHO:
          EchoParamsSchema.parse(input.parameters);
          break;

        case HelloWorldAction.DELAY_TEST:
          DelayTestParamsSchema.parse(input.parameters);
          break;

        case HelloWorldAction.GREET:
          if (input.parameters) {
            GreetParamsSchema.parse(input.parameters);
          }
          break;

        case HelloWorldAction.PING:
        case HelloWorldAction.ERROR_TEST:
          // No required parameters
          break;
      }

      return true;
    } catch (error) {
      if (error instanceof AgentError) {
        throw error;
      }
      throw new AgentError(
        `Input validation failed: ${(error as Error).message}`,
        AgentErrorType.VALIDATION_ERROR,
        this.config.name,
        undefined,
        error as Error
      );
    }
  }

  /**
   * Execute the agent with given input
   * @param input - Agent input parameters
   * @param context - Execution context
   * @returns Promise resolving to agent output
   */
  public async execute(input: AgentInput, context: AgentContext): Promise<AgentOutput> {
    const startTime = Date.now();

    console.log('[HelloWorldAgent] Execution started', {
      action: input.action,
      executionId: context.executionId,
      timestamp: context.timestamp,
    });

    try {
      // Validate environment configuration
      this.validateEnvironment();

      let result: AgentOutput;

      // Route to appropriate handler based on action
      switch (input.action) {
        case HelloWorldAction.GREET:
          const greetParams = input.parameters 
            ? GreetParamsSchema.parse(input.parameters)
            : {};
          result = await this.handleGreet(greetParams, context);
          break;

        case HelloWorldAction.ECHO:
          const echoParams = EchoParamsSchema.parse(input.parameters);
          result = await this.handleEcho(echoParams, context);
          break;

        case HelloWorldAction.PING:
          result = await this.handlePing(context);
          break;

        case HelloWorldAction.ERROR_TEST:
          result = await this.handleErrorTest(context);
          break;

        case HelloWorldAction.DELAY_TEST:
          const delayParams = DelayTestParamsSchema.parse(input.parameters);
          result = await this.handleDelayTest(delayParams, context);
          break;

        default:
          throw new AgentError(
            `Unknown action: ${input.action}`,
            AgentErrorType.EXECUTION_ERROR,
            this.config.name,
            context.executionId
          );
      }

      const executionTime = Date.now() - startTime;

      console.log('[HelloWorldAgent] Execution completed', {
        action: input.action,
        executionId: context.executionId,
        executionTime,
      });

      return {
        ...result,
        executionTime,
      };
    } catch (error) {
      const executionTime = Date.now() - startTime;

      console.error('[HelloWorldAgent] Execution failed', {
        action: input.action,
        executionId: context.executionId,
        error: (error as Error).message,
      });

      if (error instanceof AgentError) {
        throw error;
      }

      throw new AgentError(
        `Execution failed: ${(error as Error).message}`,
        AgentErrorType.EXECUTION_ERROR,
        this.config.name,
        context.executionId,
        error as Error
      );
    }
  }

  /**
   * Handle greet action
   * @private
   */
  private async handleGreet(
    params: GreetParams,
    context: AgentContext
  ): Promise<AgentOutput> {
    const name = params.name || 'World';
    const language = params.language || 'en';

    const greetings: Record<string, string> = {
      en: `Hello, ${name}!`,
      es: `¡Hola, ${name}!`,
      fr: `Bonjour, ${name}!`,
    };

    const message = greetings[language] || greetings.en;

    return {
      success: true,
      message,
      data: {
        greeting: message,
        name,
        language,
        executionId: context.executionId,
        timestamp: new Date().toISOString(),
      },
      metadata: {
        action: HelloWorldAction.GREET,
        agentVersion: this.config.version,
      },
    };
  }

  /**
   * Handle echo action
   * @private
   */
  private async handleEcho(
    params: EchoParams,
    context: AgentContext
  ): Promise<AgentOutput> {
    const { message } = params;

    return {
      success: true,
      message: `Echo: ${message}`,
      data: {
        originalMessage: message,
        echoedMessage: `Echo: ${message}`,
        executionId: context.executionId,
        timestamp: new Date().toISOString(),
      },
      metadata: {
        action: HelloWorldAction.ECHO,
        agentVersion: this.config.version,
        messageLength: message.length,
      },
    };
  }

  /**
   * Handle ping action
   * @private
   */
  private async handlePing(context: AgentContext): Promise<AgentOutput> {
    return {
      success: true,
      message: 'Pong!',
      data: {
        status: 'healthy',
        executionId: context.executionId,
        timestamp: new Date().toISOString(),
        environment: {
          nodeVersion: process.version,
          platform: process.platform,
          environmentId: context.environmentId,
        },
      },
      metadata: {
        action: HelloWorldAction.PING,
        agentVersion: this.config.version,
      },
    };
  }

  /**
   * Handle error test action (for testing error handling)
   * @private
   */
  private async handleErrorTest(context: AgentContext): Promise<AgentOutput> {
    throw new AgentError(
      'This is a test error for error handling validation',
      AgentErrorType.EXECUTION_ERROR,
      this.config.name,
      context.executionId
    );
  }

  /**
   * Handle delay test action (for testing timeout scenarios)
   * @private
   */
  private async handleDelayTest(
    params: DelayTestParams,
    context: AgentContext
  ): Promise<AgentOutput> {
    const { delayMs } = params;
    const startTime = Date.now();

    await new Promise((resolve) => setTimeout(resolve, delayMs));

    const actualDelay = Date.now() - startTime;

    return {
      success: true,
      message: `Delayed for ${actualDelay}ms`,
      data: {
        requestedDelay: delayMs,
        actualDelay,
        executionId: context.executionId,
        timestamp: new Date().toISOString(),
      },
      metadata: {
        action: HelloWorldAction.DELAY_TEST,
        agentVersion: this.config.version,
      },
    };
  }

  /**
   * Validate required environment variables
   * @private
   */
  private validateEnvironment(): void {
    const warpApiKey = process.env.WARP_API_KEY || process.env.NEXT_PUBLIC_WARP_API_KEY;
    const environmentId =
      process.env.OZ_ENVIRONMENT_ID || process.env.NEXT_PUBLIC_OZ_ENVIRONMENT_ID;

    if (!warpApiKey) {
      throw new AgentError(
        'WARP_API_KEY environment variable is not set',
        AgentErrorType.CONFIGURATION_ERROR,
        this.config.name
      );
    }

    if (!environmentId) {
      throw new AgentError(
        'OZ_ENVIRONMENT_ID environment variable is not set',
        AgentErrorType.CONFIGURATION_ERROR,
        this.config.name
      );
    }

    // Validate format (basic check)
    if (!warpApiKey.startsWith('wk-')) {
      throw new AgentError(
        'Invalid WARP_API_KEY format (should start with "wk-")',
        AgentErrorType.CONFIGURATION_ERROR,
        this.config.name
      );
    }
  }

  /**
   * Health check for the agent
   * @returns Health status
   */
  public async healthCheck(): Promise<{ healthy: boolean; message?: string }> {
    try {
      this.validateEnvironment();

      return {
        healthy: true,
        message: `Agent '${this.config.name}' is healthy and ready`,
      };
    } catch (error) {
      return {
        healthy: false,
        message: `Health check failed: ${(error as Error).message}`,
      };
    }
  }

  /**
   * Get agent information
   * @returns Agent metadata
   */
  public getInfo(): {
    name: string;
    description: string;
    version: string;
    capabilities: string[];
    supportedActions: string[];
  } {
    return {
      name: this.config.name,
      description: this.config.description,
      version: this.config.version,
      capabilities: this.config.capabilities || [],
      supportedActions: Object.values(HelloWorldAction),
    };
  }
}

/**
 * Create and return a new HelloWorldAgent instance
 * @returns HelloWorldAgent instance
 */
export function createHelloWorldAgent(): HelloWorldAgent {
  return new HelloWorldAgent();
}
