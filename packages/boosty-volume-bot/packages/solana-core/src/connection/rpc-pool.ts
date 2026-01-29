/**
 * RPC Connection Pool
 * Round-robin and failover RPC connection management
 */

import { Connection, Commitment } from '@solana/web3.js';
import { RpcEndpoint } from '../types.js';
import { HealthChecker } from './health-checker.js';
import { logger, logRpc } from '../utils/logger.js';
import { nowMs, msSince, sleep } from '../utils/helpers.js';
import NodeCache from 'node-cache';

interface PooledConnection {
  connection: Connection;
  endpoint: RpcEndpoint;
  lastUsed: number;
  requestCount: number;
  errorCount: number;
}

export class RpcPool {
  private connections: Map<string, PooledConnection> = new Map();
  private healthChecker: HealthChecker;
  private currentIndex: number = 0;
  private requestCounters: Map<string, { count: number; windowStart: number }> = new Map();
  private blockhashCache: NodeCache;
  
  constructor(
    private readonly endpoints: RpcEndpoint[],
    private readonly commitment: Commitment = 'confirmed',
    options: { healthCheckIntervalMs?: number } = {}
  ) {
    this.healthChecker = new HealthChecker(endpoints, {
      checkIntervalMs: options.healthCheckIntervalMs,
    });
    
    this.blockhashCache = new NodeCache({ stdTTL: 30, checkperiod: 10 });
    
    // Initialize connections
    for (const endpoint of endpoints) {
      this.connections.set(endpoint.url, {
        connection: new Connection(endpoint.url, { commitment: this.commitment }),
        endpoint,
        lastUsed: 0,
        requestCount: 0,
        errorCount: 0,
      });
      
      this.requestCounters.set(endpoint.url, { count: 0, windowStart: nowMs() });
    }
    
    logger.info('RPC pool initialized', { endpoints: endpoints.length });
  }

  /**
   * Start health checking
   */
  start(): void {
    this.healthChecker.start();
  }

  /**
   * Stop health checking
   */
  stop(): void {
    this.healthChecker.stop();
  }

  /**
   * Get a connection using round-robin with rate limit awareness
   */
  getConnection(): Connection {
    const pooled = this.getPooledConnection();
    return pooled.connection;
  }

  /**
   * Get the best available connection based on health
   */
  getBestConnection(): Connection {
    const best = this.healthChecker.getBestEndpoint();
    if (!best) {
      throw new Error('No healthy RPC endpoints available');
    }
    
    const pooled = this.connections.get(best.url);
    if (!pooled) {
      throw new Error('Connection not found in pool');
    }
    
    return pooled.connection;
  }

  /**
   * Get pooled connection with round-robin and rate limiting
   */
  private getPooledConnection(): PooledConnection {
    const healthyEndpoints = this.healthChecker.getHealthyEndpoints();
    
    if (healthyEndpoints.length === 0) {
      // Fallback to any endpoint
      const firstEndpoint = this.endpoints[0];
      const pooled = this.connections.get(firstEndpoint.url);
      if (!pooled) {
        throw new Error('No RPC endpoints available');
      }
      logger.warn('No healthy endpoints, using fallback', { endpoint: firstEndpoint.name });
      return pooled;
    }

    // Find endpoint with capacity
    for (let i = 0; i < healthyEndpoints.length; i++) {
      const idx = (this.currentIndex + i) % healthyEndpoints.length;
      const endpoint = healthyEndpoints[idx];
      
      if (this.hasCapacity(endpoint)) {
        this.currentIndex = (idx + 1) % healthyEndpoints.length;
        const pooled = this.connections.get(endpoint.url)!;
        pooled.lastUsed = nowMs();
        pooled.requestCount++;
        this.incrementRequestCount(endpoint.url);
        return pooled;
      }
    }

    // All endpoints at capacity, use the one with highest limit
    const endpoint = healthyEndpoints[0];
    const pooled = this.connections.get(endpoint.url)!;
    pooled.lastUsed = nowMs();
    pooled.requestCount++;
    return pooled;
  }

  /**
   * Check if endpoint has rate limit capacity
   */
  private hasCapacity(endpoint: RpcEndpoint): boolean {
    const counter = this.requestCounters.get(endpoint.url);
    if (!counter) return true;

    const now = nowMs();
    const windowMs = 1000; // 1 second window
    
    // Reset counter if window has passed
    if (now - counter.windowStart > windowMs) {
      counter.count = 0;
      counter.windowStart = now;
      return true;
    }

    return counter.count < endpoint.rateLimit;
  }

  /**
   * Increment request counter
   */
  private incrementRequestCount(url: string): void {
    const counter = this.requestCounters.get(url);
    if (counter) {
      counter.count++;
    }
  }

  /**
   * Execute an RPC call with automatic failover
   */
  async execute<T>(
    method: string,
    fn: (connection: Connection) => Promise<T>,
    retries: number = 3
  ): Promise<T> {
    let lastError: Error | null = null;
    const tried: Set<string> = new Set();

    for (let attempt = 0; attempt < retries; attempt++) {
      const pooled = this.getPooledConnection();
      
      // Skip if already tried this endpoint
      if (tried.has(pooled.endpoint.url) && tried.size < this.endpoints.length) {
        continue;
      }
      tried.add(pooled.endpoint.url);

      const startTime = nowMs();
      
      try {
        const result = await fn(pooled.connection);
        logRpc(method, pooled.endpoint.name, msSince(startTime));
        return result;
      } catch (error) {
        const err = error as Error;
        lastError = err;
        
        logRpc(method, pooled.endpoint.name, msSince(startTime), err);
        pooled.errorCount++;
        
        // Check for rate limit
        if (err.message.includes('429') || err.message.toLowerCase().includes('rate limit')) {
          this.healthChecker.recordError(pooled.endpoint.url);
          await sleep(100 * Math.pow(2, attempt));
          continue;
        }
        
        // Network error - try another endpoint
        if (err.message.includes('fetch') || err.message.includes('network')) {
          this.healthChecker.recordError(pooled.endpoint.url);
          continue;
        }
        
        // Other errors - don't retry
        throw error;
      }
    }

    throw lastError || new Error('All RPC attempts failed');
  }

  /**
   * Get a recent blockhash with caching
   */
  async getRecentBlockhash(): Promise<{ blockhash: string; lastValidBlockHeight: number }> {
    const cached = this.blockhashCache.get<{ blockhash: string; lastValidBlockHeight: number }>('blockhash');
    if (cached) {
      return cached;
    }

    const result = await this.execute('getLatestBlockhash', async (conn) => {
      return conn.getLatestBlockhash(this.commitment);
    });

    this.blockhashCache.set('blockhash', result);
    return result;
  }

  /**
   * Get health checker instance
   */
  getHealthChecker(): HealthChecker {
    return this.healthChecker;
  }

  /**
   * Get pool statistics
   */
  getStats(): { endpoint: string; requestCount: number; errorCount: number }[] {
    return Array.from(this.connections.values()).map(pooled => ({
      endpoint: pooled.endpoint.name,
      requestCount: pooled.requestCount,
      errorCount: pooled.errorCount,
    }));
  }
}
