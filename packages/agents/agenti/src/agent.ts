/**
 * @module @universal-crypto-mcp/agenti
 * 
 * Agenti Agent Implementation
 * 
 * Base agent framework with guardrails, observability, and human-in-the-loop support.
 * This module provides the foundation for building AI agents that can safely execute
 * crypto operations with proper safeguards.
 * 
 * @category Agents
 * 
 * @example
 * ```typescript
 * import { Agent, AgentConfig } from '@universal-crypto-mcp/agenti';
 * 
 * const config: AgentConfig = {
 *   name: 'trading-agent',
 *   description: 'Automated trading agent with guardrails',
 *   enableMetrics: true,
 * };
 * 
 * const agent = new Agent(config);
 * 
 * // Execute an action with guardrails
 * const result = await agent.executeAction(
 *   { type: 'swap', context: 'Token swap on Uniswap' },
 *   async () => performSwap(params)
 * );
 * ```
 */

import { VERSION } from '@universal-crypto-mcp/core';
import {
  AgentGuardrails,
  createDefaultGuardrails,
  type AgentAction,
  type GuardrailCheckResult,
  HITLManager,
  createConsoleHITL,
  type HITLConfig,
  Logger,
  MetricsRegistry,
  Counter,
  Gauge,
  Histogram,
} from '@ucmcp/shared-utils';

/**
 * Configuration options for creating an Agent instance.
 * 
 * @interface AgentConfig
 * @category Agents
 * 
 * @example
 * ```typescript
 * const config: AgentConfig = {
 *   name: 'my-agent',
 *   description: 'DeFi trading agent',
 *   enableMetrics: true,
 * };
 * ```
 */
export interface AgentConfig {
  /** Unique name identifier for the agent */
  name: string;
  /** Human-readable description of the agent's purpose */
  description?: string;
  /** Custom guardrails for action validation */
  guardrails?: AgentGuardrails;
  /** Human-in-the-loop manager for approval workflows */
  hitl?: HITLManager;
  /** Custom logger instance */
  logger?: Logger;
  /** Enable Prometheus-compatible metrics collection */
  enableMetrics?: boolean;
}

/**
 * Prometheus-compatible metrics for agent observability.
 * 
 * @interface AgentMetrics
 * @category Agents
 */
export interface AgentMetrics {
  /** Counter for total actions executed by the agent */
  actionsExecuted: Counter;
  /** Counter for actions blocked by guardrails */
  actionsBlocked: Counter;
  /** Histogram tracking action execution duration */
  actionDuration: Histogram;
  /** Gauge tracking currently active operations */
  activeOperations: Gauge;
}

/**
 * Base AI Agent class with built-in guardrails, observability, and HITL support.
 * 
 * The Agent class provides a foundation for building AI-powered crypto agents
 * with enterprise-grade safety features:
 * 
 * - **Guardrails**: Validate actions before execution
 * - **HITL**: Human-in-the-loop approval for sensitive operations  
 * - **Metrics**: Prometheus-compatible observability
 * - **Logging**: Structured logging for debugging
 * 
 * @class Agent
 * @category Agents
 * 
 * @example
 * ```typescript
 * const agent = new Agent({
 *   name: 'trading-bot',
 *   enableMetrics: true,
 * });
 * 
 * // Execute with automatic guardrail checking
 * const result = await agent.executeAction(
 *   { type: 'transfer', context: 'Send 1 ETH' },
 *   async () => wallet.sendTransaction(tx)
 * );
 * ```
 */
export class Agent {
  private config: AgentConfig;
  private guardrails: AgentGuardrails;
  private hitl?: HITLManager;
  private logger: Logger;
  private metrics?: AgentMetrics;
  private metricsRegistry?: MetricsRegistry;
  private isShutdown = false;

  constructor(config: AgentConfig) {
    this.config = config;
    this.guardrails = config.guardrails ?? createDefaultGuardrails();
    this.hitl = config.hitl;
    this.logger = config.logger ?? new Logger({ 
      context: { agent: config.name },
    });

    if (config.enableMetrics !== false) {
      this.metricsRegistry = new MetricsRegistry();
      this.metrics = {
        actionsExecuted: this.metricsRegistry.counter(
          `agent_${config.name}_actions_executed_total`,
          'Total actions executed by agent'
        ),
        actionsBlocked: this.metricsRegistry.counter(
          `agent_${config.name}_actions_blocked_total`,
          'Total actions blocked by guardrails'
        ),
        actionDuration: this.metricsRegistry.histogram(
          `agent_${config.name}_action_duration_seconds`,
          'Action execution duration'
        ),
        activeOperations: this.metricsRegistry.gauge(
          `agent_${config.name}_active_operations`,
          'Currently active operations'
        ),
      };
    }
  }

  /**
   * Gets the agent's unique name identifier.
   * @returns The agent name string
   */
  getName(): string {
    return this.config.name;
  }

  /**
   * Gets the agent's human-readable description.
   * @returns The description or default fallback
   */
  getDescription(): string {
    return this.config.description ?? 'No description';
  }

  /**
   * Gets the core library version the agent is using.
   * @returns Semantic version string
   */
  getCoreVersion(): string {
    return VERSION;
  }

  /**
   * Gets the guardrails instance used by this agent.
   * @returns The AgentGuardrails instance
   */
  getGuardrails(): AgentGuardrails {
    return this.guardrails;
  }

  /**
   * Execute an action through guardrails with optional HITL approval.
   * 
   * This method provides the core execution pathway that:
   * 1. Validates the action against guardrails
   * 2. Optionally requests human approval (HITL)
   * 3. Executes the action and records metrics
   * 
   * @template T - The return type of the action executor
   * @param action - The action to execute with type and context
   * @param executor - Async function that performs the actual action
   * @returns Promise resolving to the action result
   * @throws Error if guardrails block the action or execution fails
   * 
   * @example
   * ```typescript
   * const result = await agent.executeAction(
   *   { type: 'swap', context: 'Swap 100 USDC for ETH' },
   *   async () => uniswap.swap({ tokenIn: 'USDC', tokenOut: 'ETH', amount: 100 })
   * );
   * ```
   */
  async executeAction<T>(
    action: AgentAction,
    executor: () => Promise<T>
  ): Promise<T> {
    if (this.isShutdown) {
      throw new Error('Agent has been shut down');
    }

    this.logger.info('Executing action', { 
      action: action.type,
      actionId: action.id,
    });

    this.metrics?.activeOperations.inc();

    try {
      // Check guardrails
      const checkResult = await this.guardrails.checkAction(action);
      
      if (!checkResult.allowed) {
        this.logger.warn('Action blocked by guardrails', {
          action: action.type,
          reason: checkResult.reason,
          violations: checkResult.violations,
        });
        this.metrics?.actionsBlocked.inc();
        throw new Error(`Action blocked: ${checkResult.reason}`);
      }

      // Check if HITL approval is required
      if (checkResult.requiresApproval && this.hitl) {
        this.logger.info('Requesting human approval', { action: action.type });
        
        const approved = await this.hitl.requestApproval({
          action: action.type,
          details: action.details,
          urgency: action.priority ?? 'normal',
          timeout: 300000, // 5 minutes
        });

        if (!approved) {
          this.logger.warn('Human rejected action', { action: action.type });
          this.metrics?.actionsBlocked.inc();
          throw new Error('Action rejected by human operator');
        }
      }

      // Execute the action
      const startTime = Date.now();
      const result = await executor();
      const duration = (Date.now() - startTime) / 1000;

      this.metrics?.actionsExecuted.inc();
      this.metrics?.actionDuration.observe(duration);

      this.logger.info('Action completed', {
        action: action.type,
        duration,
      });

      return result;
    } finally {
      this.metrics?.activeOperations.dec();
    }
  }

  /**
   * Get metrics in Prometheus format
   */
  getMetrics(): string {
    return this.metricsRegistry?.collect() ?? '';
  }

  /**
   * Shutdown the agent gracefully
   */
  async shutdown(): Promise<void> {
    this.logger.info('Shutting down agent');
    this.isShutdown = true;
    
    if (this.hitl) {
      await this.hitl.shutdown();
    }
  }
}

export function createAgent(config: AgentConfig): Agent {
  return new Agent(config);
}

/**
 * Create an agent with console HITL for development
 */
export function createDevAgent(config: Omit<AgentConfig, 'hitl'>): Agent {
  return new Agent({
    ...config,
    hitl: createConsoleHITL(),
  });
}
