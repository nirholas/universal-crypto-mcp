/**
 * RPC Health Checker
 * Monitors endpoint health and latency for optimal routing
 */

import { Connection } from '@solana/web3.js';
import { RpcEndpoint, RpcHealth } from '../types.js';
import { logger } from '../utils/logger.js';
import { nowMs, msSince } from '../utils/helpers.js';

export class HealthChecker {
  private healthMap: Map<string, RpcHealth> = new Map();
  private checkInterval: NodeJS.Timeout | null = null;
  private readonly checkIntervalMs: number;
  private readonly timeoutMs: number;

  constructor(
    private readonly endpoints: RpcEndpoint[],
    options: { checkIntervalMs?: number; timeoutMs?: number } = {}
  ) {
    this.checkIntervalMs = options.checkIntervalMs || 30000;
    this.timeoutMs = options.timeoutMs || 5000;
    
    // Initialize health map
    for (const endpoint of endpoints) {
      this.healthMap.set(endpoint.url, {
        endpoint: endpoint.url,
        healthy: true, // Assume healthy until checked
        latencyMs: 0,
        lastChecked: new Date(0),
        currentSlot: 0,
        errors: 0,
      });
    }
  }

  /**
   * Start periodic health checking
   */
  start(): void {
    if (this.checkInterval) return;
    
    // Initial check
    this.checkAllEndpoints();
    
    // Periodic checks
    this.checkInterval = setInterval(() => {
      this.checkAllEndpoints();
    }, this.checkIntervalMs);
    
    logger.info('Health checker started', { 
      endpoints: this.endpoints.length, 
      intervalMs: this.checkIntervalMs 
    });
  }

  /**
   * Stop health checking
   */
  stop(): void {
    if (this.checkInterval) {
      clearInterval(this.checkInterval);
      this.checkInterval = null;
      logger.info('Health checker stopped');
    }
  }

  /**
   * Check all endpoints
   */
  async checkAllEndpoints(): Promise<void> {
    const checks = this.endpoints.map(endpoint => this.checkEndpoint(endpoint));
    await Promise.allSettled(checks);
  }

  /**
   * Check single endpoint health
   */
  async checkEndpoint(endpoint: RpcEndpoint): Promise<RpcHealth> {
    const startTime = nowMs();
    const connection = new Connection(endpoint.url, { commitment: 'processed' });
    
    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), this.timeoutMs);
      
      const slot = await connection.getSlot();
      clearTimeout(timeoutId);
      
      const latencyMs = msSince(startTime);
      
      const health: RpcHealth = {
        endpoint: endpoint.url,
        healthy: true,
        latencyMs,
        lastChecked: new Date(),
        currentSlot: slot,
        errors: 0,
      };
      
      this.healthMap.set(endpoint.url, health);
      
      logger.debug('Endpoint healthy', { 
        name: endpoint.name, 
        latencyMs, 
        slot 
      });
      
      return health;
    } catch (error) {
      const existing = this.healthMap.get(endpoint.url);
      const errorCount = (existing?.errors || 0) + 1;
      
      const health: RpcHealth = {
        endpoint: endpoint.url,
        healthy: false,
        latencyMs: msSince(startTime),
        lastChecked: new Date(),
        currentSlot: existing?.currentSlot || 0,
        errors: errorCount,
      };
      
      this.healthMap.set(endpoint.url, health);
      
      logger.warn('Endpoint unhealthy', { 
        name: endpoint.name, 
        error: (error as Error).message,
        errorCount 
      });
      
      return health;
    }
  }

  /**
   * Get health status for an endpoint
   */
  getHealth(url: string): RpcHealth | undefined {
    return this.healthMap.get(url);
  }

  /**
   * Get all healthy endpoints sorted by latency
   */
  getHealthyEndpoints(): RpcEndpoint[] {
    return this.endpoints
      .filter(endpoint => {
        const health = this.healthMap.get(endpoint.url);
        return health?.healthy !== false;
      })
      .sort((a, b) => {
        const healthA = this.healthMap.get(a.url);
        const healthB = this.healthMap.get(b.url);
        
        // Sort by weight first (higher is better)
        if (a.weight !== b.weight) {
          return b.weight - a.weight;
        }
        
        // Then by latency (lower is better)
        return (healthA?.latencyMs || Infinity) - (healthB?.latencyMs || Infinity);
      });
  }

  /**
   * Get the best endpoint
   */
  getBestEndpoint(): RpcEndpoint | null {
    const healthy = this.getHealthyEndpoints();
    return healthy[0] || null;
  }

  /**
   * Get all health statuses
   */
  getAllHealth(): RpcHealth[] {
    return Array.from(this.healthMap.values());
  }

  /**
   * Mark an endpoint as having an error
   */
  recordError(url: string): void {
    const health = this.healthMap.get(url);
    if (health) {
      health.errors += 1;
      if (health.errors >= 3) {
        health.healthy = false;
      }
    }
  }

  /**
   * Reset error count for an endpoint
   */
  resetErrors(url: string): void {
    const health = this.healthMap.get(url);
    if (health) {
      health.errors = 0;
      health.healthy = true;
    }
  }
}
