/**
 * Bot Implementation
 * Individual trading bot that executes trades based on configuration
 */

import { EventEmitter } from 'eventemitter3';
import { v4 as uuidv4 } from 'uuid';
import type {
  Bot,
  BotConfig,
  BotStatus,
  BotStats,
  BotState,
  BehaviorProfile,
  Task,
} from '../types.js';
import { RandomizationEngine } from '../randomization/engine.js';
import { getProfile, isWithinActiveHours, getActivityMultiplier } from './behavior-profiles.js';

/**
 * Events emitted by a trading bot
 */
export interface BotEvents {
  'state-change': (state: BotState, previousState: BotState) => void;
  'trade-scheduled': (trade: { type: 'buy' | 'sell'; size: bigint; scheduledAt: Date }) => void;
  'trade-executed': (trade: { type: 'buy' | 'sell'; size: bigint; success: boolean; signature?: string }) => void;
  'trade-failed': (error: Error, trade: { type: 'buy' | 'sell'; size: bigint }) => void;
  'config-updated': (config: BotConfig) => void;
  'daily-reset': () => void;
  'error': (error: Error) => void;
}

/**
 * Dependencies injected into the bot
 */
export interface BotDependencies {
  randomization: RandomizationEngine;
  enqueueTask: (task: Task) => Promise<string>;
  getWalletBalance?: (walletId: string, tokenMint: string) => Promise<bigint>;
}

/**
 * TradingBot - Individual bot implementation
 */
export class TradingBot extends EventEmitter<BotEvents> implements Bot {
  public readonly id: string;
  public config: BotConfig;
  
  private _state: BotState = 'idle';
  private _stats: BotStats;
  private _lastTradeAt?: Date;
  private _nextTradeAt?: Date;
  private _errorMessage?: string;
  private _createdAt: Date;
  private _updatedAt: Date;
  
  private profile: BehaviorProfile;
  private deps: BotDependencies;
  private tradeTimer: NodeJS.Timeout | null = null;
  private dailyResetTimer: NodeJS.Timeout | null = null;
  private isShuttingDown = false;

  constructor(
    config: BotConfig,
    deps: BotDependencies,
    id?: string
  ) {
    super();
    
    this.id = id ?? uuidv4();
    this.config = { ...config };
    this.deps = deps;
    this.profile = getProfile(config.behaviorProfile ?? 'default');
    
    this._createdAt = new Date();
    this._updatedAt = new Date();
    this._stats = this.createInitialStats();
  }

  /**
   * Get current bot state
   */
  get state(): BotState {
    return this._state;
  }

  /**
   * Get current bot status
   */
  get status(): BotStatus {
    return this.getStatus();
  }

  /**
   * Start the bot
   */
  async start(): Promise<void> {
    if (this._state === 'running') {
      return;
    }

    if (!this.config.enabled) {
      throw new Error('Cannot start disabled bot');
    }

    const previousState = this._state;
    this._state = 'running';
    this._errorMessage = undefined;
    this._updatedAt = new Date();
    this.isShuttingDown = false;

    this.emit('state-change', 'running', previousState);

    // Set up daily reset
    this.setupDailyReset();

    // Schedule first trade
    await this.scheduleNextTrade();
  }

  /**
   * Stop the bot
   */
  async stop(): Promise<void> {
    if (this._state === 'stopped') {
      return;
    }

    this.isShuttingDown = true;
    const previousState = this._state;
    this._state = 'stopped';
    this._updatedAt = new Date();

    // Clear timers
    if (this.tradeTimer) {
      clearTimeout(this.tradeTimer);
      this.tradeTimer = null;
    }
    if (this.dailyResetTimer) {
      clearTimeout(this.dailyResetTimer);
      this.dailyResetTimer = null;
    }

    this._nextTradeAt = undefined;

    this.emit('state-change', 'stopped', previousState);
  }

  /**
   * Pause the bot
   */
  async pause(): Promise<void> {
    if (this._state !== 'running') {
      return;
    }

    const previousState = this._state;
    this._state = 'paused';
    this._updatedAt = new Date();

    // Clear trade timer but keep daily reset
    if (this.tradeTimer) {
      clearTimeout(this.tradeTimer);
      this.tradeTimer = null;
    }

    this.emit('state-change', 'paused', previousState);
  }

  /**
   * Resume the bot from paused state
   */
  async resume(): Promise<void> {
    if (this._state !== 'paused') {
      return;
    }

    const previousState = this._state;
    this._state = 'running';
    this._updatedAt = new Date();

    this.emit('state-change', 'running', previousState);

    // Schedule next trade
    await this.scheduleNextTrade();
  }

  /**
   * Update bot configuration
   */
  updateConfig(config: Partial<BotConfig>): void {
    this.config = { ...this.config, ...config };
    this._updatedAt = new Date();

    // Update behavior profile if changed
    if (config.behaviorProfile) {
      this.profile = getProfile(config.behaviorProfile);
    }

    this.emit('config-updated', this.config);

    // If disabled, stop the bot
    if (config.enabled === false && this._state === 'running') {
      this.pause();
    }
  }

  /**
   * Get current status
   */
  getStatus(): BotStatus {
    return {
      botId: this.id,
      walletId: this.config.walletId,
      state: this._state,
      currentConfig: { ...this.config },
      stats: this.getStats(),
      lastTradeAt: this._lastTradeAt,
      nextTradeAt: this._nextTradeAt,
      errorMessage: this._errorMessage,
      createdAt: this._createdAt,
      updatedAt: this._updatedAt,
    };
  }

  /**
   * Get current statistics
   */
  getStats(): BotStats {
    return { ...this._stats };
  }

  /**
   * Schedule the next trade
   */
  private async scheduleNextTrade(): Promise<void> {
    if (this._state !== 'running' || this.isShuttingDown) {
      return;
    }

    // Check if within active hours
    if (!isWithinActiveHours(this.profile)) {
      // Schedule check for when active hours begin
      const now = new Date();
      const msUntilActive = this.getMsUntilActiveHours(now);
      
      this.tradeTimer = setTimeout(() => {
        this.scheduleNextTrade();
      }, msUntilActive);
      
      return;
    }

    // Check daily limits
    if (this._stats.dailyTrades >= this.config.maxDailyTrades) {
      return; // Wait for daily reset
    }

    if (this._stats.dailyVolume >= this.config.maxDailyVolume) {
      return; // Wait for daily reset
    }

    // Calculate next interval
    const activityMultiplier = getActivityMultiplier(this.profile);
    const baseInterval = this.deps.randomization.getNextInterval(
      this.config.minInterval,
      this.config.maxInterval,
      this.profile.timingDistribution
    );
    
    // Apply profile variance
    const interval = Math.round(baseInterval / activityMultiplier * this.profile.varianceFactor);

    // Apply anti-detection cooldown if needed
    const cooldown = this.deps.randomization.getRecommendedCooldown();
    const totalDelay = interval + cooldown;

    this._nextTradeAt = new Date(Date.now() + totalDelay);

    this.tradeTimer = setTimeout(async () => {
      await this.executeTrade();
    }, totalDelay);
  }

  /**
   * Execute a trade
   */
  private async executeTrade(): Promise<void> {
    if (this._state !== 'running' || this.isShuttingDown) {
      return;
    }

    try {
      // Determine trade direction
      let isBuy = this.deps.randomization.shouldBuy(this.config.buyProbability);

      // Adjust based on mode
      if (this.config.mode === 'accumulate') {
        isBuy = Math.random() < 0.8; // 80% buys
      } else if (this.config.mode === 'distribute') {
        isBuy = Math.random() < 0.2; // 20% buys
      }

      // Determine trade size
      const size = this.deps.randomization.getTradeSize(
        this.config.minTradeSize,
        this.config.maxTradeSize,
        this.profile.sizeDistribution
      );

      // Check if trade would exceed daily limits
      if (this._stats.dailyVolume + size > this.config.maxDailyVolume) {
        // Adjust size or skip
        const remainingVolume = this.config.maxDailyVolume - this._stats.dailyVolume;
        if (remainingVolume < this.config.minTradeSize) {
          // Can't make minimum trade, wait for reset
          return;
        }
      }

      const tradeType = isBuy ? 'buy' : 'sell';

      this.emit('trade-scheduled', {
        type: tradeType,
        size,
        scheduledAt: new Date(),
      });

      // Create and enqueue the trade task
      const task: Task = {
        type: 'swap',
        payload: {
          botId: this.id,
          walletId: this.config.walletId,
          tokenMint: this.config.targetToken,
          direction: tradeType,
          amount: size.toString(),
          slippageBps: this.config.slippageBps ?? 100,
          priorityFee: this.config.priorityFee?.toString(),
        },
        priority: 'normal',
        maxRetries: 3,
        timeout: 60000,
        walletId: this.config.walletId,
        botId: this.id,
      };

      await this.deps.enqueueTask(task);

      // Record the trade attempt (actual result comes from task completion)
      this.deps.randomization.recordTrade(this.config.walletId, tradeType, size);

      // Update stats optimistically (will be corrected on task completion)
      this._stats.totalTrades++;
      this._stats.dailyTrades++;
      this._stats.totalVolume += size;
      this._stats.dailyVolume += size;
      
      if (isBuy) {
        this._stats.buyCount++;
      } else {
        this._stats.sellCount++;
      }

      this._stats.averageTradeSize = this._stats.totalVolume / BigInt(this._stats.totalTrades);
      this._lastTradeAt = new Date();
      this._updatedAt = new Date();

      this.emit('trade-executed', {
        type: tradeType,
        size,
        success: true, // Assumed, will be updated by task result
      });

    } catch (error) {
      const err = error instanceof Error ? error : new Error(String(error));
      this._errorMessage = err.message;
      this.emit('error', err);
      
      // Don't stop the bot on trade errors, just log and continue
    } finally {
      // Schedule next trade
      await this.scheduleNextTrade();
    }
  }

  /**
   * Handle trade completion callback
   */
  onTradeCompleted(success: boolean, signature?: string, fees?: bigint): void {
    if (success) {
      this._stats.successRate = 
        (this._stats.successRate * (this._stats.totalTrades - 1) + 1) / this._stats.totalTrades;
      
      if (fees) {
        this._stats.totalFeesSpent += fees;
      }
    } else {
      this._stats.successRate = 
        (this._stats.successRate * (this._stats.totalTrades - 1)) / this._stats.totalTrades;
    }

    this._updatedAt = new Date();
  }

  /**
   * Set up daily statistics reset
   */
  private setupDailyReset(): void {
    if (this.dailyResetTimer) {
      clearTimeout(this.dailyResetTimer);
    }

    // Calculate ms until midnight UTC
    const now = new Date();
    const midnight = new Date(now);
    midnight.setUTCHours(24, 0, 0, 0);
    const msUntilMidnight = midnight.getTime() - now.getTime();

    this.dailyResetTimer = setTimeout(() => {
      this.resetDailyStats();
      // Set up next reset
      this.setupDailyReset();
    }, msUntilMidnight);
  }

  /**
   * Reset daily statistics
   */
  private resetDailyStats(): void {
    this._stats.dailyTrades = 0;
    this._stats.dailyVolume = 0n;
    this._stats.lastResetAt = new Date();
    this._updatedAt = new Date();

    this.emit('daily-reset');

    // If bot was waiting due to daily limits, schedule next trade
    if (this._state === 'running' && !this.tradeTimer) {
      this.scheduleNextTrade();
    }
  }

  /**
   * Create initial stats object
   */
  private createInitialStats(): BotStats {
    return {
      totalTrades: 0,
      totalVolume: 0n,
      buyCount: 0,
      sellCount: 0,
      successRate: 1.0,
      dailyTrades: 0,
      dailyVolume: 0n,
      averageTradeSize: 0n,
      totalFeesSpent: 0n,
      lastResetAt: new Date(),
    };
  }

  /**
   * Calculate milliseconds until active hours begin
   */
  private getMsUntilActiveHours(now: Date): number {
    const currentHour = now.getHours();
    const { start, end } = this.profile.activeHours;

    let hoursUntilActive: number;

    if (start <= end) {
      // Normal range (e.g., 9-17)
      if (currentHour < start) {
        hoursUntilActive = start - currentHour;
      } else {
        // After end, wait until tomorrow's start
        hoursUntilActive = 24 - currentHour + start;
      }
    } else {
      // Wrapped range (e.g., 22-6)
      if (currentHour >= end && currentHour < start) {
        hoursUntilActive = start - currentHour;
      } else {
        hoursUntilActive = 0; // Already in active hours
      }
    }

    return hoursUntilActive * 60 * 60 * 1000;
  }

  /**
   * Check if bot should execute burst trades
   */
  shouldBurst(): boolean {
    return Math.random() < this.profile.burstProbability;
  }

  /**
   * Get burst trade count
   */
  getBurstCount(): number {
    const { min, max } = this.profile.burstTradeRange;
    return Math.floor(Math.random() * (max - min + 1)) + min;
  }

  /**
   * Clean up resources
   */
  destroy(): void {
    this.stop();
    this.removeAllListeners();
  }
}
