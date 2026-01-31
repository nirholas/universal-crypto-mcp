/**
 * Agenti Agent Implementation
 * 
 * Base agent framework with guardrails, observability, and human-in-the-loop support.
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

export interface AgentConfig {
  name: string;
  description?: string;
  guardrails?: AgentGuardrails;
  hitl?: HITLManager;
  logger?: Logger;
  enableMetrics?: boolean;
}

export interface AgentMetrics {
  actionsExecuted: Counter;
  actionsBlocked: Counter;
  actionDuration: Histogram;
  activeOperations: Gauge;
}

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

  getName(): string {
    return this.config.name;
  }

  getDescription(): string {
    return this.config.description ?? 'No description';
  }

  getCoreVersion(): string {
    return VERSION;
  }

  getGuardrails(): AgentGuardrails {
    return this.guardrails;
  }

  /**
   * Execute an action through guardrails
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
