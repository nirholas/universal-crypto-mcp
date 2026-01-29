/**
 * Pool Migration Detector
 * Detects pool migrations (e.g., PumpFun → Raydium)
 */

import { EventEmitter } from 'eventemitter3';
import type {
  PoolInfo,
  PoolMigrationEvent,
  PoolMigrationDetectorInterface,
  PoolType,
} from '../types.js';
import { PoolMonitor } from './pool-monitor.js';

/**
 * Events emitted by the migration detector
 */
export interface MigrationDetectorEvents {
  'migration-detected': (event: PoolMigrationEvent) => void;
  'migration-confirmed': (event: PoolMigrationEvent) => void;
  'monitoring-started': (tokenMint: string) => void;
  'monitoring-stopped': (tokenMint: string) => void;
  'error': (error: Error) => void;
}

/**
 * Migration detector configuration
 */
export interface MigrationDetectorConfig {
  /** Minimum liquidity increase to consider as migration (ratio) */
  liquidityIncreaseThreshold: number;
  /** Time window to confirm migration (ms) */
  confirmationWindow: number;
  /** Pool types to watch for as source */
  sourcePoolTypes: PoolType[];
  /** Pool types to watch for as destination */
  destinationPoolTypes: PoolType[];
  /** Auto-notify on migration */
  autoNotify: boolean;
}

/**
 * Default migration detector configuration
 */
export const DEFAULT_MIGRATION_CONFIG: MigrationDetectorConfig = {
  liquidityIncreaseThreshold: 2.0, // 2x liquidity increase
  confirmationWindow: 60000, // 1 minute
  sourcePoolTypes: ['pumpfun'],
  destinationPoolTypes: ['raydium', 'orca', 'meteora'],
  autoNotify: true,
};

/**
 * Pending migration for confirmation
 */
interface PendingMigration {
  tokenMint: string;
  fromPool: PoolInfo;
  toPool: PoolInfo;
  detectedAt: Date;
  confirmed: boolean;
}

/**
 * MigrationDetector - Detects and reports pool migrations
 */
export class MigrationDetector
  extends EventEmitter<MigrationDetectorEvents>
  implements PoolMigrationDetectorInterface
{
  private config: MigrationDetectorConfig;
  private poolMonitor: PoolMonitor;
  private pendingMigrations: Map<string, PendingMigration> = new Map();
  private confirmedMigrations: PoolMigrationEvent[] = [];
  private migrationCallbacks: Array<(event: PoolMigrationEvent) => void> = [];
  private confirmationTimers: Map<string, NodeJS.Timeout> = new Map();

  constructor(
    poolMonitor: PoolMonitor,
    config: Partial<MigrationDetectorConfig> = {}
  ) {
    super();
    this.config = { ...DEFAULT_MIGRATION_CONFIG, ...config };
    this.poolMonitor = poolMonitor;

    // Set up pool monitor listeners
    this.setupPoolMonitorListeners();
  }

  /**
   * Start monitoring for migrations
   */
  async startMonitoring(): Promise<void> {
    await this.poolMonitor.startMonitoring();
  }

  /**
   * Stop monitoring
   */
  async stopMonitoring(): Promise<void> {
    await this.poolMonitor.stopMonitoring();

    // Clear confirmation timers
    for (const timer of this.confirmationTimers.values()) {
      clearTimeout(timer);
    }
    this.confirmationTimers.clear();
  }

  /**
   * Add a token to monitor
   */
  addToken(tokenMint: string): void {
    this.poolMonitor.addToken(tokenMint);
    this.emit('monitoring-started', tokenMint);
  }

  /**
   * Remove a token from monitoring
   */
  removeToken(tokenMint: string): void {
    this.poolMonitor.removeToken(tokenMint);
    this.emit('monitoring-stopped', tokenMint);

    // Clean up pending migrations
    this.pendingMigrations.delete(tokenMint);
    const timer = this.confirmationTimers.get(tokenMint);
    if (timer) {
      clearTimeout(timer);
      this.confirmationTimers.delete(tokenMint);
    }
  }

  /**
   * Get pool info for a token
   */
  async getPoolInfo(tokenMint: string): Promise<PoolInfo | null> {
    return this.poolMonitor.getPoolInfo(tokenMint);
  }

  /**
   * Register a migration callback
   */
  onMigration(callback: (event: PoolMigrationEvent) => void): void {
    this.migrationCallbacks.push(callback);
  }

  /**
   * Check if a migration is in progress for a token
   */
  isMigrationPending(tokenMint: string): boolean {
    return this.pendingMigrations.has(tokenMint);
  }

  /**
   * Get pending migration for a token
   */
  getPendingMigration(tokenMint: string): PendingMigration | undefined {
    return this.pendingMigrations.get(tokenMint);
  }

  /**
   * Get all confirmed migrations
   */
  getConfirmedMigrations(): PoolMigrationEvent[] {
    return [...this.confirmedMigrations];
  }

  /**
   * Get migrations for a specific token
   */
  getMigrationsForToken(tokenMint: string): PoolMigrationEvent[] {
    return this.confirmedMigrations.filter((m) => m.tokenMint === tokenMint);
  }

  /**
   * Manually check for migration
   */
  async checkForMigration(tokenMint: string): Promise<PoolMigrationEvent | null> {
    const pools = this.poolMonitor.getAllPools(tokenMint);

    const sourcePools = pools.filter((p) =>
      this.config.sourcePoolTypes.includes(p.type)
    );
    const destPools = pools.filter((p) =>
      this.config.destinationPoolTypes.includes(p.type)
    );

    // Check if there's a significant liquidity shift
    for (const sourcePool of sourcePools) {
      for (const destPool of destPools) {
        if (this.detectMigration(sourcePool, destPool)) {
          const event: PoolMigrationEvent = {
            tokenMint,
            fromPool: sourcePool,
            toPool: destPool,
            detectedAt: new Date(),
          };

          return event;
        }
      }
    }

    return null;
  }

  /**
   * Get the recommended pool after migration
   */
  getRecommendedPool(tokenMint: string): PoolInfo | null {
    // Check for recent migration
    const migrations = this.getMigrationsForToken(tokenMint);
    if (migrations.length > 0) {
      const latestMigration = migrations[migrations.length - 1];
      if (latestMigration?.toPool.isActive) {
        return latestMigration.toPool;
      }
    }

    // Fall back to best available pool
    return this.poolMonitor.getBestPool(this.poolMonitor.getAllPools(tokenMint));
  }

  /**
   * Update configuration
   */
  updateConfig(updates: Partial<MigrationDetectorConfig>): void {
    this.config = { ...this.config, ...updates };
  }

  /**
   * Get current configuration
   */
  getConfig(): MigrationDetectorConfig {
    return { ...this.config };
  }

  /**
   * Set up pool monitor event listeners
   */
  private setupPoolMonitorListeners(): void {
    this.poolMonitor.on('pool-discovered', (pool) => {
      this.handlePoolDiscovered(pool);
    });

    this.poolMonitor.on('liquidity-change', (pool, oldLiquidity, newLiquidity) => {
      this.handleLiquidityChange(pool, oldLiquidity, newLiquidity);
    });

    this.poolMonitor.on('pool-inactive', (pool) => {
      this.handlePoolInactive(pool);
    });

    this.poolMonitor.on('error', (error) => {
      this.emit('error', error);
    });
  }

  /**
   * Handle new pool discovery
   */
  private handlePoolDiscovered(pool: PoolInfo): void {
    // Check if this is a destination pool type with significant liquidity
    if (
      this.config.destinationPoolTypes.includes(pool.type) &&
      pool.liquidity >= 1000000000n // At least 1 SOL
    ) {
      // Check for existing source pool
      const pools = this.poolMonitor.getAllPools(pool.tokenMint);
      const sourcePool = pools.find(
        (p) =>
          this.config.sourcePoolTypes.includes(p.type) &&
          p.address !== pool.address
      );

      if (sourcePool) {
        this.detectAndReportMigration(pool.tokenMint, sourcePool, pool);
      }
    }
  }

  /**
   * Handle liquidity change
   */
  private handleLiquidityChange(
    pool: PoolInfo,
    oldLiquidity: bigint,
    newLiquidity: bigint
  ): void {
    // Check for significant liquidity increase in destination pool
    if (
      this.config.destinationPoolTypes.includes(pool.type) &&
      newLiquidity > oldLiquidity * BigInt(Math.floor(this.config.liquidityIncreaseThreshold))
    ) {
      // Look for source pool losing liquidity
      const pools = this.poolMonitor.getAllPools(pool.tokenMint);
      const sourcePool = pools.find(
        (p) =>
          this.config.sourcePoolTypes.includes(p.type) &&
          p.address !== pool.address &&
          p.liquidity < pool.liquidity
      );

      if (sourcePool) {
        this.detectAndReportMigration(pool.tokenMint, sourcePool, pool);
      }
    }
  }

  /**
   * Handle pool becoming inactive
   */
  private handlePoolInactive(pool: PoolInfo): void {
    // If source pool becomes inactive, check for destination
    if (this.config.sourcePoolTypes.includes(pool.type)) {
      const pools = this.poolMonitor.getAllPools(pool.tokenMint);
      const destPool = pools.find(
        (p) =>
          this.config.destinationPoolTypes.includes(p.type) &&
          p.isActive &&
          p.liquidity > 0n
      );

      if (destPool) {
        this.detectAndReportMigration(pool.tokenMint, pool, destPool);
      }
    }
  }

  /**
   * Detect if a migration occurred
   */
  private detectMigration(sourcePool: PoolInfo, destPool: PoolInfo): boolean {
    // Check if destination has significantly more liquidity
    if (destPool.liquidity > sourcePool.liquidity * 2n) {
      return true;
    }

    // Check if source is inactive and destination is active
    if (!sourcePool.isActive && destPool.isActive && destPool.liquidity > 0n) {
      return true;
    }

    return false;
  }

  /**
   * Detect and report a migration
   */
  private detectAndReportMigration(
    tokenMint: string,
    fromPool: PoolInfo,
    toPool: PoolInfo
  ): void {
    // Check if we already have a pending migration for this token
    if (this.pendingMigrations.has(tokenMint)) {
      return;
    }

    const pending: PendingMigration = {
      tokenMint,
      fromPool,
      toPool,
      detectedAt: new Date(),
      confirmed: false,
    };

    this.pendingMigrations.set(tokenMint, pending);

    const migrationEvent: PoolMigrationEvent = {
      tokenMint,
      fromPool,
      toPool,
      detectedAt: pending.detectedAt,
    };

    // Emit initial detection
    this.emit('migration-detected', migrationEvent);

    // Set up confirmation timer
    const timer = setTimeout(() => {
      this.confirmMigration(tokenMint);
    }, this.config.confirmationWindow);

    this.confirmationTimers.set(tokenMint, timer);
  }

  /**
   * Confirm a pending migration
   */
  private confirmMigration(tokenMint: string): void {
    const pending = this.pendingMigrations.get(tokenMint);
    if (!pending) {
      return;
    }

    // Re-check pools to confirm migration
    const currentPools = this.poolMonitor.getAllPools(tokenMint);
    const currentFromPool = currentPools.find(
      (p) => p.address === pending.fromPool.address
    );
    const currentToPool = currentPools.find(
      (p) => p.address === pending.toPool.address
    );

    // Confirm if destination still has more liquidity
    if (
      currentToPool &&
      currentToPool.isActive &&
      (!currentFromPool ||
        !currentFromPool.isActive ||
        currentToPool.liquidity > currentFromPool.liquidity)
    ) {
      pending.confirmed = true;

      const event: PoolMigrationEvent = {
        tokenMint,
        fromPool: currentFromPool ?? pending.fromPool,
        toPool: currentToPool,
        detectedAt: pending.detectedAt,
      };

      this.confirmedMigrations.push(event);

      // Emit confirmed migration
      this.emit('migration-confirmed', event);

      // Notify callbacks
      for (const callback of this.migrationCallbacks) {
        try {
          callback(event);
        } catch (error) {
          console.error('Migration callback error:', error);
        }
      }
    }

    // Clean up
    this.pendingMigrations.delete(tokenMint);
    this.confirmationTimers.delete(tokenMint);
  }

  /**
   * Clear migration history
   */
  clearHistory(): void {
    this.confirmedMigrations = [];
    this.pendingMigrations.clear();
    
    for (const timer of this.confirmationTimers.values()) {
      clearTimeout(timer);
    }
    this.confirmationTimers.clear();
  }
}
