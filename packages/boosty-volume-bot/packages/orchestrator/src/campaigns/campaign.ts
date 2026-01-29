/**
 * Campaign Implementation
 * Represents a volume generation campaign
 */

import { EventEmitter } from 'eventemitter3';
import { v4 as uuidv4 } from 'uuid';
import type {
  Campaign,
  CampaignConfig,
  CampaignState,
  CampaignStatus,
  CampaignMetrics,
} from '../types.js';

/**
 * Events emitted by a campaign
 */
export interface CampaignEvents {
  'state-change': (newState: CampaignState, oldState: CampaignState) => void;
  'progress-update': (progress: CampaignStatus['progress']) => void;
  'target-reached': (type: 'volume' | 'transactions' | 'time') => void;
  'bot-added': (botId: string) => void;
  'bot-removed': (botId: string) => void;
  'metrics-updated': (metrics: CampaignMetrics) => void;
  'error': (error: Error) => void;
}

/**
 * VolumeCampaign - Manages a volume generation campaign
 */
export class VolumeCampaign extends EventEmitter<CampaignEvents> implements Campaign {
  public readonly id: string;
  public config: CampaignConfig;
  public state: CampaignState = 'draft';
  public botIds: string[] = [];
  public metrics: CampaignMetrics;
  public createdAt: Date;
  public startedAt?: Date;
  public pausedAt?: Date;
  public completedAt?: Date;

  private checkInterval: NodeJS.Timeout | null = null;
  private durationTimer: NodeJS.Timeout | null = null;

  constructor(config: CampaignConfig, id?: string) {
    super();
    
    this.id = id ?? uuidv4();
    this.config = { ...config };
    this.createdAt = new Date();
    this.metrics = this.createInitialMetrics();
  }

  /**
   * Start the campaign
   */
  start(): void {
    if (this.state === 'active') {
      return;
    }

    const previousState = this.state;
    this.state = 'active';
    this.startedAt = this.startedAt ?? new Date();
    this.metrics.startedAt = this.startedAt;
    this.pausedAt = undefined;

    this.emit('state-change', 'active', previousState);

    // Start progress checking
    this.startProgressChecking();

    // Set duration timer if specified
    if (this.config.duration > 0) {
      this.durationTimer = setTimeout(() => {
        this.complete('duration');
      }, this.config.duration * 60 * 60 * 1000); // Convert hours to ms
    }
  }

  /**
   * Pause the campaign
   */
  pause(): void {
    if (this.state !== 'active') {
      return;
    }

    const previousState = this.state;
    this.state = 'paused';
    this.pausedAt = new Date();

    this.emit('state-change', 'paused', previousState);

    // Stop timers
    this.stopTimers();
  }

  /**
   * Resume the campaign
   */
  resume(): void {
    if (this.state !== 'paused') {
      return;
    }

    const previousState = this.state;
    this.state = 'active';
    this.pausedAt = undefined;

    this.emit('state-change', 'active', previousState);

    // Resume progress checking
    this.startProgressChecking();

    // Recalculate remaining duration if applicable
    if (this.config.duration > 0 && this.startedAt) {
      const elapsed = (Date.now() - this.startedAt.getTime()) / (60 * 60 * 1000);
      const remaining = this.config.duration - elapsed;
      
      if (remaining > 0) {
        this.durationTimer = setTimeout(() => {
          this.complete('duration');
        }, remaining * 60 * 60 * 1000);
      } else {
        this.complete('duration');
      }
    }
  }

  /**
   * Stop the campaign
   */
  stop(): void {
    if (this.state === 'completed' || this.state === 'cancelled') {
      return;
    }

    const previousState = this.state;
    this.state = 'cancelled';
    this.completedAt = new Date();

    this.emit('state-change', 'cancelled', previousState);

    this.stopTimers();
  }

  /**
   * Complete the campaign
   */
  private complete(reason: 'duration' | 'volume' | 'transactions' | 'manual'): void {
    if (this.state !== 'active') {
      return;
    }

    const previousState = this.state;
    this.state = 'completed';
    this.completedAt = new Date();

    this.emit('state-change', 'completed', previousState);
    
    if (reason !== 'manual') {
      this.emit('target-reached', reason === 'duration' ? 'time' : reason);
    }

    this.stopTimers();
  }

  /**
   * Add a bot to the campaign
   */
  addBot(botId: string): void {
    if (!this.botIds.includes(botId)) {
      this.botIds.push(botId);
      this.emit('bot-added', botId);
    }
  }

  /**
   * Remove a bot from the campaign
   */
  removeBot(botId: string): void {
    const index = this.botIds.indexOf(botId);
    if (index !== -1) {
      this.botIds.splice(index, 1);
      this.emit('bot-removed', botId);
    }
  }

  /**
   * Update campaign metrics
   */
  updateMetrics(updates: Partial<CampaignMetrics>): void {
    this.metrics = {
      ...this.metrics,
      ...updates,
      lastUpdatedAt: new Date(),
    };

    this.emit('metrics-updated', this.metrics);

    // Check if targets reached
    this.checkTargets();
  }

  /**
   * Record a trade
   */
  recordTrade(
    type: 'buy' | 'sell',
    amount: bigint,
    fees: bigint,
    walletId: string,
    success: boolean
  ): void {
    this.metrics.totalTransactions++;
    
    if (success) {
      this.metrics.totalVolume += amount;
      this.metrics.totalFeesSpent += fees;
      
      if (type === 'buy') {
        this.metrics.buyVolume += amount;
        this.metrics.buyCount++;
      } else {
        this.metrics.sellVolume += amount;
        this.metrics.sellCount++;
      }

      // Track unique wallets
      // Note: In production, use a Set stored separately
      this.metrics.uniqueWallets = this.botIds.length;

      // Update average
      this.metrics.avgTransactionSize = 
        this.metrics.totalVolume / BigInt(this.metrics.totalTransactions);

      // Update hourly volume
      const hour = new Date().getHours();
      const currentHourVolume = this.metrics.hourlyVolume.get(hour) ?? 0n;
      this.metrics.hourlyVolume.set(hour, currentHourVolume + amount);

      // Update success rate
      const totalAttempts = this.metrics.buyCount + this.metrics.sellCount;
      this.metrics.successRate = totalAttempts / this.metrics.totalTransactions;
    }

    this.metrics.lastUpdatedAt = new Date();

    this.emit('metrics-updated', this.metrics);
    this.checkTargets();
  }

  /**
   * Get current status
   */
  getStatus(): CampaignStatus {
    const now = Date.now();
    const startTime = this.startedAt?.getTime() ?? now;
    const duration = this.config.duration * 60 * 60 * 1000;

    const volumeProgress = Number(
      (this.metrics.totalVolume * 100n) / this.config.targetVolume24h
    );
    const transactionProgress = 
      (this.metrics.totalTransactions / this.config.targetTransactionCount24h) * 100;
    const timeProgress = duration > 0 
      ? ((now - startTime) / duration) * 100 
      : 0;

    // Estimate completion
    let estimatedCompletion: Date | undefined;
    if (this.state === 'active' && volumeProgress > 0) {
      const elapsedMs = now - startTime;
      const estimatedTotalMs = elapsedMs / (volumeProgress / 100);
      estimatedCompletion = new Date(startTime + estimatedTotalMs);
    }

    return {
      campaignId: this.id,
      state: this.state,
      progress: {
        volumeProgress: Math.min(100, volumeProgress),
        transactionProgress: Math.min(100, transactionProgress),
        timeProgress: Math.min(100, timeProgress),
      },
      activeBots: this.botIds.length,
      totalBots: this.config.botCount,
      errorCount: this.metrics.totalTransactions - 
        (this.metrics.buyCount + this.metrics.sellCount),
      estimatedCompletion,
    };
  }

  /**
   * Get metrics
   */
  getMetrics(): CampaignMetrics {
    return { ...this.metrics };
  }

  /**
   * Update configuration
   */
  updateConfig(updates: Partial<CampaignConfig>): void {
    this.config = {
      ...this.config,
      ...updates,
    };
  }

  /**
   * Check if targets have been reached
   */
  private checkTargets(): void {
    if (this.state !== 'active') {
      return;
    }

    // Check volume target
    if (this.metrics.totalVolume >= this.config.targetVolume24h) {
      this.emit('target-reached', 'volume');
      
      if (this.config.autoStopOnTarget) {
        this.complete('volume');
      }
    }

    // Check transaction count target
    if (this.metrics.totalTransactions >= this.config.targetTransactionCount24h) {
      this.emit('target-reached', 'transactions');
      
      if (this.config.autoStopOnTarget) {
        this.complete('transactions');
      }
    }

    // Check budget limit
    if (this.config.budgetLimit && this.metrics.totalFeesSpent >= this.config.budgetLimit) {
      this.stop();
    }
  }

  /**
   * Start progress checking interval
   */
  private startProgressChecking(): void {
    if (this.checkInterval) {
      clearInterval(this.checkInterval);
    }

    this.checkInterval = setInterval(() => {
      const status = this.getStatus();
      this.emit('progress-update', status.progress);
    }, 60000); // Check every minute
  }

  /**
   * Stop all timers
   */
  private stopTimers(): void {
    if (this.checkInterval) {
      clearInterval(this.checkInterval);
      this.checkInterval = null;
    }

    if (this.durationTimer) {
      clearTimeout(this.durationTimer);
      this.durationTimer = null;
    }
  }

  /**
   * Create initial metrics object
   */
  private createInitialMetrics(): CampaignMetrics {
    return {
      totalVolume: 0n,
      totalTransactions: 0,
      buyVolume: 0n,
      sellVolume: 0n,
      buyCount: 0,
      sellCount: 0,
      uniqueWallets: 0,
      avgTransactionSize: 0n,
      totalFeesSpent: 0n,
      successRate: 1.0,
      hourlyVolume: new Map(),
      lastUpdatedAt: new Date(),
    };
  }

  /**
   * Serialize campaign for persistence
   */
  serialize(): {
    id: string;
    config: CampaignConfig;
    state: CampaignState;
    botIds: string[];
    createdAt: string;
    startedAt?: string;
    pausedAt?: string;
    completedAt?: string;
    metrics: {
      totalVolume: string;
      totalTransactions: number;
      buyVolume: string;
      sellVolume: string;
      buyCount: number;
      sellCount: number;
      uniqueWallets: number;
      avgTransactionSize: string;
      totalFeesSpent: string;
      successRate: number;
    };
  } {
    return {
      id: this.id,
      config: this.config,
      state: this.state,
      botIds: [...this.botIds],
      createdAt: this.createdAt.toISOString(),
      startedAt: this.startedAt?.toISOString(),
      pausedAt: this.pausedAt?.toISOString(),
      completedAt: this.completedAt?.toISOString(),
      metrics: {
        totalVolume: this.metrics.totalVolume.toString(),
        totalTransactions: this.metrics.totalTransactions,
        buyVolume: this.metrics.buyVolume.toString(),
        sellVolume: this.metrics.sellVolume.toString(),
        buyCount: this.metrics.buyCount,
        sellCount: this.metrics.sellCount,
        uniqueWallets: this.metrics.uniqueWallets,
        avgTransactionSize: this.metrics.avgTransactionSize.toString(),
        totalFeesSpent: this.metrics.totalFeesSpent.toString(),
        successRate: this.metrics.successRate,
      },
    };
  }

  /**
   * Clean up resources
   */
  destroy(): void {
    this.stopTimers();
    this.removeAllListeners();
  }
}
