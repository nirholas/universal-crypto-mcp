/**
 * UCAI - Universal Crypto AI Implementation
 * 
 * Multi-chain crypto AI agent with comprehensive safety features.
 */

import { VERSION } from '@universal-crypto-mcp/core';
import {
  AgentGuardrails,
  createDefaultGuardrails,
  createStrictGuardrails,
  type AgentAction,
  type SpendingLimit,
  HITLManager,
  createConsoleHITL,
  createWebhookHITL,
  Logger,
  MetricsRegistry,
  Counter,
  Gauge,
  Histogram,
  RateLimiter,
  retry,
  CircuitBreaker,
} from '@ucmcp/shared-utils';

export interface UCAIConfig {
  name: string;
  chains: string[];
  capabilities?: string[];
  /** Enable strict guardrails (recommended for production) */
  strictMode?: boolean;
  /** Custom spending limits per chain */
  spendingLimits?: Record<string, SpendingLimit>;
  /** HITL configuration for high-value operations */
  hitlEnabled?: boolean;
  hitlWebhookUrl?: string;
  /** Rate limits for chain operations */
  rateLimit?: {
    maxRequests: number;
    windowMs: number;
  };
}

export interface ChainMetrics {
  transactions: Counter;
  errors: Counter;
  latency: Histogram;
}

export class UCAIAgent {
  private config: UCAIConfig;
  private guardrails: AgentGuardrails;
  private hitl?: HITLManager;
  private logger: Logger;
  private metricsRegistry: MetricsRegistry;
  private chainMetrics: Map<string, ChainMetrics> = new Map();
  private rateLimiter: RateLimiter;
  private circuitBreakers: Map<string, CircuitBreaker> = new Map();
  private isShutdown = false;

  constructor(config: UCAIConfig) {
    this.config = config;
    
    // Initialize logger
    this.logger = new Logger({
      context: { agent: 'ucai', name: config.name },
      redactPaths: ['privateKey', 'mnemonic', 'seed', 'password'],
    });

    // Initialize guardrails
    this.guardrails = config.strictMode
      ? createStrictGuardrails()
      : createDefaultGuardrails();

    // Apply custom spending limits
    if (config.spendingLimits) {
      for (const [chain, limit] of Object.entries(config.spendingLimits)) {
        this.guardrails.setSpendingLimit(chain, limit);
      }
    }

    // Initialize HITL
    if (config.hitlEnabled) {
      this.hitl = config.hitlWebhookUrl
        ? createWebhookHITL(config.hitlWebhookUrl)
        : createConsoleHITL();
    }

    // Initialize rate limiter
    this.rateLimiter = new RateLimiter({
      maxRequests: config.rateLimit?.maxRequests ?? 10,
      windowMs: config.rateLimit?.windowMs ?? 1000,
      name: `ucai-${config.name}`,
    });

    // Initialize metrics registry
    this.metricsRegistry = new MetricsRegistry();

    // Initialize circuit breakers and metrics for each chain
    for (const chain of config.chains) {
      this.circuitBreakers.set(chain, new CircuitBreaker({
        failureThreshold: 5,
        resetTimeout: 60000,
        name: `ucai-${chain}`,
      }));

      this.chainMetrics.set(chain, {
        transactions: this.metricsRegistry.counter(
          `ucai_${chain}_transactions_total`,
          `Total transactions on ${chain}`
        ),
        errors: this.metricsRegistry.counter(
          `ucai_${chain}_errors_total`,
          `Total errors on ${chain}`
        ),
        latency: this.metricsRegistry.histogram(
          `ucai_${chain}_latency_seconds`,
          `Transaction latency on ${chain}`
        ),
      });
    }

    this.logger.info('UCAI agent initialized', {
      chains: config.chains,
      strictMode: config.strictMode ?? false,
      hitlEnabled: config.hitlEnabled ?? false,
    });
  }

  getName(): string {
    return this.config.name;
  }

  getChains(): string[] {
    return this.config.chains;
  }

  getCapabilities(): string[] {
    return this.config.capabilities ?? [];
  }

  getCoreVersion(): string {
    return VERSION;
  }

  /**
   * Execute a chain operation with full safety features
   */
  async executeChainOperation<T>(
    chain: string,
    action: AgentAction,
    executor: () => Promise<T>
  ): Promise<T> {
    if (this.isShutdown) {
      throw new Error('Agent has been shut down');
    }

    if (!this.config.chains.includes(chain)) {
      throw new Error(`Chain ${chain} is not configured for this agent`);
    }

    const metrics = this.chainMetrics.get(chain)!;
    const circuitBreaker = this.circuitBreakers.get(chain)!;

    this.logger.info('Executing chain operation', {
      chain,
      action: action.type,
      actionId: action.id,
    });

    // Check guardrails
    const checkResult = await this.guardrails.checkAction(action);
    if (!checkResult.allowed) {
      this.logger.warn('Action blocked by guardrails', {
        chain,
        action: action.type,
        reason: checkResult.reason,
        violations: checkResult.violations,
      });
      throw new Error(`Action blocked: ${checkResult.reason}`);
    }

    // Request HITL approval if needed
    if (checkResult.requiresApproval && this.hitl) {
      const approved = await this.hitl.requestApproval({
        action: action.type,
        details: { chain, ...action.details },
        urgency: 'high',
        timeout: 300000,
      });

      if (!approved) {
        throw new Error('Action rejected by human operator');
      }
    }

    // Execute with rate limiting and circuit breaker
    await this.rateLimiter.acquire();

    const startTime = Date.now();

    try {
      const result = await circuitBreaker.execute(async () => {
        return retry(executor, {
          maxAttempts: 3,
          baseDelay: 1000,
          maxDelay: 10000,
          shouldRetry: (error) => {
            // Retry on network/transient errors, not on validation errors
            return !error.message.includes('insufficient') &&
                   !error.message.includes('invalid') &&
                   !error.message.includes('rejected');
          },
        });
      });

      const duration = (Date.now() - startTime) / 1000;
      metrics.transactions.inc();
      metrics.latency.observe(duration);

      this.logger.info('Chain operation completed', {
        chain,
        action: action.type,
        duration,
      });

      return result;
    } catch (error) {
      metrics.errors.inc();
      this.logger.error('Chain operation failed', {
        chain,
        action: action.type,
        error: error instanceof Error ? error.message : String(error),
      });
      throw error;
    }
  }

  /**
   * Get current spending status
   */
  getSpendingStatus(): Record<string, { used: number; limit: number }> {
    const status: Record<string, { used: number; limit: number }> = {};
    
    for (const chain of this.config.chains) {
      const spendingInfo = this.guardrails.getSpendingInfo(chain);
      if (spendingInfo) {
        status[chain] = {
          used: spendingInfo.used,
          limit: spendingInfo.limit,
        };
      }
    }
    
    return status;
  }

  /**
   * Get metrics in Prometheus format
   */
  getMetrics(): string {
    return this.metricsRegistry.collect();
  }

  /**
   * Check circuit breaker status for all chains
   */
  getCircuitBreakerStatus(): Record<string, string> {
    const status: Record<string, string> = {};
    
    for (const [chain, cb] of this.circuitBreakers) {
      status[chain] = cb.getState();
    }
    
    return status;
  }

  /**
   * Emergency kill switch - stops all operations
   */
  async emergencyStop(): Promise<void> {
    this.logger.warn('Emergency stop activated');
    this.isShutdown = true;
    this.guardrails.activateKillSwitch('Emergency stop triggered');
  }

  /**
   * Graceful shutdown
   */
  async shutdown(): Promise<void> {
    this.logger.info('Shutting down UCAI agent');
    this.isShutdown = true;
    
    if (this.hitl) {
      await this.hitl.shutdown();
    }
  }
}

export function createUCAI(config: UCAIConfig): UCAIAgent {
  return new UCAIAgent(config);
}

/**
 * Create a production-ready UCAI agent with strict settings
 */
export function createProductionUCAI(config: Omit<UCAIConfig, 'strictMode' | 'hitlEnabled'>): UCAIAgent {
  return new UCAIAgent({
    ...config,
    strictMode: true,
    hitlEnabled: true,
  });
}
