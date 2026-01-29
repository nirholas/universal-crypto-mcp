/**
 * Pool Monitor
 * Monitors liquidity pools for changes and migrations
 */

import { EventEmitter } from 'eventemitter3';
import type { PoolInfo, PoolType, PoolMonitorConfig } from '../types.js';

/**
 * Events emitted by the pool monitor
 */
export interface PoolMonitorEvents {
  'pool-discovered': (pool: PoolInfo) => void;
  'pool-updated': (pool: PoolInfo, changes: Partial<PoolInfo>) => void;
  'pool-inactive': (pool: PoolInfo) => void;
  'liquidity-change': (pool: PoolInfo, oldLiquidity: bigint, newLiquidity: bigint) => void;
  'error': (error: Error) => void;
}

/**
 * Default pool monitor configuration
 */
export const DEFAULT_POOL_MONITOR_CONFIG: PoolMonitorConfig = {
  tokenMints: [],
  pollingInterval: 30000, // 30 seconds
  minLiquidity: 1000000000n, // 1 SOL minimum
  autoRedirect: true,
};

/**
 * PoolMonitor - Monitors liquidity pools
 */
export class PoolMonitor extends EventEmitter<PoolMonitorEvents> {
  private config: PoolMonitorConfig;
  private pools: Map<string, PoolInfo[]> = new Map(); // tokenMint -> pools
  private isMonitoring = false;
  private pollTimer: NodeJS.Timeout | null = null;
  
  // Callbacks for fetching pool data
  private fetchPoolsFn?: (tokenMint: string) => Promise<PoolInfo[]>;

  constructor(
    config: Partial<PoolMonitorConfig> = {},
    fetchPoolsFn?: (tokenMint: string) => Promise<PoolInfo[]>
  ) {
    super();
    this.config = { ...DEFAULT_POOL_MONITOR_CONFIG, ...config };
    this.fetchPoolsFn = fetchPoolsFn;
  }

  /**
   * Start monitoring
   */
  async startMonitoring(): Promise<void> {
    if (this.isMonitoring) {
      return;
    }

    this.isMonitoring = true;

    // Initial fetch
    await this.pollPools();

    // Start polling
    this.pollTimer = setInterval(() => {
      this.pollPools().catch((err) => {
        this.emit('error', err);
      });
    }, this.config.pollingInterval);
  }

  /**
   * Stop monitoring
   */
  async stopMonitoring(): Promise<void> {
    this.isMonitoring = false;

    if (this.pollTimer) {
      clearInterval(this.pollTimer);
      this.pollTimer = null;
    }
  }

  /**
   * Add a token to monitor
   */
  addToken(tokenMint: string): void {
    if (!this.config.tokenMints.includes(tokenMint)) {
      this.config.tokenMints.push(tokenMint);
      
      // Fetch pools immediately if monitoring
      if (this.isMonitoring) {
        this.fetchPoolsForToken(tokenMint).catch((err) => {
          this.emit('error', err);
        });
      }
    }
  }

  /**
   * Remove a token from monitoring
   */
  removeToken(tokenMint: string): void {
    const index = this.config.tokenMints.indexOf(tokenMint);
    if (index !== -1) {
      this.config.tokenMints.splice(index, 1);
      this.pools.delete(tokenMint);
    }
  }

  /**
   * Get pool info for a token
   */
  async getPoolInfo(tokenMint: string): Promise<PoolInfo | null> {
    const pools = this.pools.get(tokenMint);
    
    if (!pools || pools.length === 0) {
      // Try to fetch
      if (this.fetchPoolsFn) {
        const fetchedPools = await this.fetchPoolsFn(tokenMint);
        if (fetchedPools.length > 0) {
          this.pools.set(tokenMint, fetchedPools);
          return this.getBestPool(fetchedPools);
        }
      }
      return null;
    }

    return this.getBestPool(pools);
  }

  /**
   * Get all pools for a token
   */
  getAllPools(tokenMint: string): PoolInfo[] {
    return this.pools.get(tokenMint) ?? [];
  }

  /**
   * Get active pools for a token
   */
  getActivePools(tokenMint: string): PoolInfo[] {
    const pools = this.pools.get(tokenMint) ?? [];
    return pools.filter((p) => p.isActive && p.liquidity >= this.config.minLiquidity);
  }

  /**
   * Get the best pool (highest liquidity)
   */
  getBestPool(pools: PoolInfo[]): PoolInfo | null {
    const activePools = pools.filter(
      (p) => p.isActive && p.liquidity >= this.config.minLiquidity
    );

    if (activePools.length === 0) {
      return null;
    }

    return activePools.reduce((best, current) =>
      current.liquidity > best.liquidity ? current : best
    );
  }

  /**
   * Check if a token has an active pool
   */
  hasActivePool(tokenMint: string): boolean {
    return this.getActivePools(tokenMint).length > 0;
  }

  /**
   * Get pool type
   */
  getPoolType(poolAddress: string): PoolType {
    // This would need actual logic to determine pool type
    // For now, return unknown
    for (const pools of this.pools.values()) {
      const pool = pools.find((p) => p.address === poolAddress);
      if (pool) {
        return pool.type;
      }
    }
    return 'unknown';
  }

  /**
   * Update configuration
   */
  updateConfig(updates: Partial<PoolMonitorConfig>): void {
    this.config = { ...this.config, ...updates };

    // Restart polling if interval changed
    if (updates.pollingInterval && this.isMonitoring) {
      this.stopMonitoring();
      this.startMonitoring();
    }
  }

  /**
   * Get current configuration
   */
  getConfig(): PoolMonitorConfig {
    return { ...this.config };
  }

  /**
   * Get monitoring status
   */
  getStatus(): {
    isMonitoring: boolean;
    tokenCount: number;
    poolCount: number;
    activePoolCount: number;
  } {
    let poolCount = 0;
    let activePoolCount = 0;

    for (const pools of this.pools.values()) {
      poolCount += pools.length;
      activePoolCount += pools.filter((p) => p.isActive).length;
    }

    return {
      isMonitoring: this.isMonitoring,
      tokenCount: this.config.tokenMints.length,
      poolCount,
      activePoolCount,
    };
  }

  /**
   * Poll all pools
   */
  private async pollPools(): Promise<void> {
    const promises = this.config.tokenMints.map((tokenMint) =>
      this.fetchPoolsForToken(tokenMint).catch((err) => {
        console.error(`Failed to fetch pools for ${tokenMint}:`, err);
      })
    );

    await Promise.all(promises);
  }

  /**
   * Fetch pools for a specific token
   */
  private async fetchPoolsForToken(tokenMint: string): Promise<void> {
    if (!this.fetchPoolsFn) {
      // Use mock data if no fetch function provided
      return this.useMockPools(tokenMint);
    }

    const newPools = await this.fetchPoolsFn(tokenMint);
    const existingPools = this.pools.get(tokenMint) ?? [];

    // Check for changes
    for (const newPool of newPools) {
      const existing = existingPools.find((p) => p.address === newPool.address);

      if (!existing) {
        // New pool discovered
        this.emit('pool-discovered', newPool);
      } else {
        // Check for changes
        const changes: Partial<PoolInfo> = {};

        if (existing.liquidity !== newPool.liquidity) {
          changes.liquidity = newPool.liquidity;
          this.emit('liquidity-change', newPool, existing.liquidity, newPool.liquidity);
        }

        if (existing.isActive !== newPool.isActive) {
          changes.isActive = newPool.isActive;
          if (!newPool.isActive) {
            this.emit('pool-inactive', newPool);
          }
        }

        if (Object.keys(changes).length > 0) {
          this.emit('pool-updated', newPool, changes);
        }
      }
    }

    this.pools.set(tokenMint, newPools);
  }

  /**
   * Use mock pool data for testing
   */
  private useMockPools(tokenMint: string): void {
    const existingPools = this.pools.get(tokenMint);

    if (!existingPools) {
      // Create initial mock pool
      const mockPool: PoolInfo = {
        address: `mock-pool-${tokenMint.slice(0, 8)}`,
        type: 'raydium',
        tokenMint,
        baseMint: tokenMint,
        quoteMint: 'So11111111111111111111111111111111111111112', // SOL
        liquidity: BigInt(Math.floor(Math.random() * 100)) * 1000000000n,
        volume24h: BigInt(Math.floor(Math.random() * 10)) * 1000000000n,
        createdAt: new Date(),
        isActive: true,
      };

      this.pools.set(tokenMint, [mockPool]);
      this.emit('pool-discovered', mockPool);
    } else {
      // Simulate liquidity changes
      for (const pool of existingPools) {
        const oldLiquidity = pool.liquidity;
        const change = BigInt(Math.floor((Math.random() - 0.5) * 10)) * 100000000n;
        pool.liquidity = pool.liquidity + change;
        
        if (pool.liquidity < 0n) {
          pool.liquidity = 0n;
        }

        if (pool.liquidity !== oldLiquidity) {
          this.emit('liquidity-change', pool, oldLiquidity, pool.liquidity);
        }
      }
    }
  }

  /**
   * Manual pool update
   */
  updatePool(poolInfo: PoolInfo): void {
    const pools = this.pools.get(poolInfo.tokenMint) ?? [];
    const index = pools.findIndex((p) => p.address === poolInfo.address);

    if (index !== -1) {
      const oldPool = pools[index];
      pools[index] = poolInfo;

      // Check for significant changes
      if (oldPool && oldPool.liquidity !== poolInfo.liquidity) {
        this.emit('liquidity-change', poolInfo, oldPool.liquidity, poolInfo.liquidity);
      }
    } else {
      pools.push(poolInfo);
      this.emit('pool-discovered', poolInfo);
    }

    this.pools.set(poolInfo.tokenMint, pools);
  }

  /**
   * Clear all pool data
   */
  clearPools(): void {
    this.pools.clear();
  }
}
