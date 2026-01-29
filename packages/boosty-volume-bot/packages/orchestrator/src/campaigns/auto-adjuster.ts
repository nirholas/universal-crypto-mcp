/**
 * Auto-Adjuster
 * Automatically adjusts campaign parameters to meet targets
 */

import type { CampaignConfig, BotConfig, CampaignStatus } from '../types.js';
import { VolumeCampaign } from './campaign.js';

/**
 * Adjustment recommendation
 */
export interface AdjustmentRecommendation {
  type: 'increase-bots' | 'decrease-bots' | 'increase-frequency' | 'decrease-frequency' | 
        'increase-size' | 'decrease-size' | 'adjust-buy-ratio' | 'none';
  reason: string;
  suggestedValue?: number | bigint;
  urgency: 'low' | 'medium' | 'high' | 'critical';
}

/**
 * Auto-adjuster configuration
 */
export interface AutoAdjusterConfig {
  /** Enable automatic adjustments */
  enabled: boolean;
  /** Check interval in ms */
  checkInterval: number;
  /** Minimum time before first adjustment (ms) */
  warmupPeriod: number;
  /** Maximum adjustments per hour */
  maxAdjustmentsPerHour: number;
  /** Target progress threshold for adjustments (%) */
  progressThreshold: number;
  /** Aggression factor (0-1) - how much to adjust */
  aggressionFactor: number;
}

/**
 * Default auto-adjuster configuration
 */
export const DEFAULT_ADJUSTER_CONFIG: AutoAdjusterConfig = {
  enabled: true,
  checkInterval: 300000, // 5 minutes
  warmupPeriod: 900000, // 15 minutes
  maxAdjustmentsPerHour: 4,
  progressThreshold: 10, // Adjust if more than 10% off target
  aggressionFactor: 0.3,
};

/**
 * AutoAdjuster - Adjusts campaign parameters automatically
 */
export class AutoAdjuster {
  private config: AutoAdjusterConfig;
  private campaign: VolumeCampaign;
  private adjustmentHistory: Array<{
    timestamp: Date;
    recommendation: AdjustmentRecommendation;
    applied: boolean;
  }> = [];
  private checkTimer: NodeJS.Timeout | null = null;
  private startedAt?: Date;

  // Callbacks for applying adjustments
  private onAddBots?: (count: number) => Promise<void>;
  private onRemoveBots?: (count: number) => Promise<void>;
  private onUpdateBotConfigs?: (updates: Partial<BotConfig>) => Promise<void>;

  constructor(
    campaign: VolumeCampaign,
    config: Partial<AutoAdjusterConfig> = {},
    callbacks?: {
      onAddBots?: (count: number) => Promise<void>;
      onRemoveBots?: (count: number) => Promise<void>;
      onUpdateBotConfigs?: (updates: Partial<BotConfig>) => Promise<void>;
    }
  ) {
    this.campaign = campaign;
    this.config = { ...DEFAULT_ADJUSTER_CONFIG, ...config };
    this.onAddBots = callbacks?.onAddBots;
    this.onRemoveBots = callbacks?.onRemoveBots;
    this.onUpdateBotConfigs = callbacks?.onUpdateBotConfigs;
  }

  /**
   * Start the auto-adjuster
   */
  start(): void {
    if (!this.config.enabled || this.checkTimer) {
      return;
    }

    this.startedAt = new Date();
    
    this.checkTimer = setInterval(() => {
      this.checkAndAdjust();
    }, this.config.checkInterval);
  }

  /**
   * Stop the auto-adjuster
   */
  stop(): void {
    if (this.checkTimer) {
      clearInterval(this.checkTimer);
      this.checkTimer = null;
    }
  }

  /**
   * Get adjustment recommendations
   */
  getRecommendations(): AdjustmentRecommendation[] {
    const status = this.campaign.getStatus();
    const metrics = this.campaign.getMetrics();
    const config = this.campaign.config;
    const recommendations: AdjustmentRecommendation[] = [];

    // Check if in warmup period
    if (this.startedAt && Date.now() - this.startedAt.getTime() < this.config.warmupPeriod) {
      return recommendations;
    }

    // Calculate expected progress based on time
    const expectedProgress = status.progress.timeProgress;

    // Volume progress analysis
    const volumeDeviation = expectedProgress - status.progress.volumeProgress;
    if (volumeDeviation > this.config.progressThreshold) {
      // Behind on volume
      recommendations.push(this.getVolumeAdjustment(volumeDeviation, config, status));
    } else if (volumeDeviation < -this.config.progressThreshold * 2) {
      // Way ahead - can reduce activity
      recommendations.push({
        type: 'decrease-frequency',
        reason: 'Volume target being exceeded, reducing activity',
        suggestedValue: 1.2, // Increase intervals by 20%
        urgency: 'low',
      });
    }

    // Transaction count analysis
    const txDeviation = expectedProgress - status.progress.transactionProgress;
    if (txDeviation > this.config.progressThreshold) {
      recommendations.push(this.getTransactionAdjustment(txDeviation, config, status));
    }

    // Bot utilization analysis
    const botUtilization = status.activeBots / status.totalBots;
    if (botUtilization < 0.5 && status.progress.volumeProgress < 50) {
      recommendations.push({
        type: 'increase-bots',
        reason: 'Low bot utilization, increasing active bots',
        suggestedValue: Math.ceil(status.totalBots * 0.2),
        urgency: 'medium',
      });
    }

    // Buy/sell ratio analysis
    const buyRatio = metrics.buyCount / (metrics.buyCount + metrics.sellCount || 1);
    if (buyRatio > 0.7 || buyRatio < 0.3) {
      recommendations.push({
        type: 'adjust-buy-ratio',
        reason: `Buy/sell ratio (${(buyRatio * 100).toFixed(1)}%) is imbalanced`,
        suggestedValue: buyRatio > 0.7 ? 0.55 : 0.45,
        urgency: 'low',
      });
    }

    // Success rate analysis
    if (metrics.successRate < 0.9) {
      recommendations.push({
        type: 'decrease-frequency',
        reason: `High failure rate (${((1 - metrics.successRate) * 100).toFixed(1)}%)`,
        suggestedValue: 1.3, // Increase intervals by 30%
        urgency: 'high',
      });
    }

    return recommendations;
  }

  /**
   * Check and apply adjustments if needed
   */
  async checkAndAdjust(): Promise<void> {
    if (!this.canAdjust()) {
      return;
    }

    const recommendations = this.getRecommendations();
    
    // Sort by urgency
    const sortedRecs = recommendations.sort((a, b) => {
      const urgencyOrder = { critical: 0, high: 1, medium: 2, low: 3 };
      return urgencyOrder[a.urgency] - urgencyOrder[b.urgency];
    });

    // Apply highest priority adjustment
    const topRec = sortedRecs[0];
    if (topRec && topRec.type !== 'none') {
      await this.applyAdjustment(topRec);
    }
  }

  /**
   * Apply an adjustment
   */
  async applyAdjustment(recommendation: AdjustmentRecommendation): Promise<void> {
    let applied = false;

    try {
      switch (recommendation.type) {
        case 'increase-bots':
          if (this.onAddBots && typeof recommendation.suggestedValue === 'number') {
            await this.onAddBots(recommendation.suggestedValue);
            applied = true;
          }
          break;

        case 'decrease-bots':
          if (this.onRemoveBots && typeof recommendation.suggestedValue === 'number') {
            await this.onRemoveBots(recommendation.suggestedValue);
            applied = true;
          }
          break;

        case 'increase-frequency':
          if (this.onUpdateBotConfigs && typeof recommendation.suggestedValue === 'number') {
            const factor = recommendation.suggestedValue;
            await this.onUpdateBotConfigs({
              minInterval: Math.round(this.campaign.config.walletFundingAmount ? 10000 / factor : 10000),
              maxInterval: Math.round(60000 / factor),
            });
            applied = true;
          }
          break;

        case 'decrease-frequency':
          if (this.onUpdateBotConfigs && typeof recommendation.suggestedValue === 'number') {
            const factor = recommendation.suggestedValue;
            await this.onUpdateBotConfigs({
              minInterval: Math.round(10000 * factor),
              maxInterval: Math.round(60000 * factor),
            });
            applied = true;
          }
          break;

        case 'increase-size':
          if (this.onUpdateBotConfigs && typeof recommendation.suggestedValue === 'bigint') {
            await this.onUpdateBotConfigs({
              minTradeSize: recommendation.suggestedValue,
            });
            applied = true;
          }
          break;

        case 'decrease-size':
          if (this.onUpdateBotConfigs && typeof recommendation.suggestedValue === 'bigint') {
            await this.onUpdateBotConfigs({
              maxTradeSize: recommendation.suggestedValue,
            });
            applied = true;
          }
          break;

        case 'adjust-buy-ratio':
          if (this.onUpdateBotConfigs && typeof recommendation.suggestedValue === 'number') {
            await this.onUpdateBotConfigs({
              buyProbability: recommendation.suggestedValue,
            });
            applied = true;
          }
          break;
      }
    } catch (error) {
      console.error('Failed to apply adjustment:', error);
    }

    // Record adjustment
    this.adjustmentHistory.push({
      timestamp: new Date(),
      recommendation,
      applied,
    });

    // Keep only last 100 entries
    if (this.adjustmentHistory.length > 100) {
      this.adjustmentHistory = this.adjustmentHistory.slice(-100);
    }
  }

  /**
   * Check if we can make an adjustment
   */
  private canAdjust(): boolean {
    const now = Date.now();
    const oneHourAgo = now - 3600000;

    // Count adjustments in last hour
    const recentAdjustments = this.adjustmentHistory.filter(
      (a) => a.applied && a.timestamp.getTime() > oneHourAgo
    ).length;

    return recentAdjustments < this.config.maxAdjustmentsPerHour;
  }

  /**
   * Get volume adjustment recommendation
   */
  private getVolumeAdjustment(
    deviation: number,
    _config: CampaignConfig,
    status: CampaignStatus
  ): AdjustmentRecommendation {
    const urgency = deviation > 30 ? 'critical' : deviation > 20 ? 'high' : 'medium';

    // Determine best action
    if (status.activeBots < status.totalBots * 0.8) {
      return {
        type: 'increase-bots',
        reason: `Volume ${deviation.toFixed(1)}% behind target, adding more bots`,
        suggestedValue: Math.ceil(status.totalBots * 0.1 * this.config.aggressionFactor),
        urgency,
      };
    }

    return {
      type: 'increase-frequency',
      reason: `Volume ${deviation.toFixed(1)}% behind target, increasing trade frequency`,
      suggestedValue: 1 + (deviation / 100) * this.config.aggressionFactor,
      urgency,
    };
  }

  /**
   * Get transaction count adjustment recommendation
   */
  private getTransactionAdjustment(
    deviation: number,
    _config: CampaignConfig,
    _status: CampaignStatus
  ): AdjustmentRecommendation {
    const urgency = deviation > 30 ? 'critical' : deviation > 20 ? 'high' : 'medium';

    return {
      type: 'increase-frequency',
      reason: `Transactions ${deviation.toFixed(1)}% behind target`,
      suggestedValue: 1 + (deviation / 100) * this.config.aggressionFactor,
      urgency,
    };
  }

  /**
   * Get adjustment history
   */
  getHistory(): Array<{
    timestamp: Date;
    recommendation: AdjustmentRecommendation;
    applied: boolean;
  }> {
    return [...this.adjustmentHistory];
  }

  /**
   * Clear history
   */
  clearHistory(): void {
    this.adjustmentHistory = [];
  }

  /**
   * Update configuration
   */
  updateConfig(updates: Partial<AutoAdjusterConfig>): void {
    this.config = { ...this.config, ...updates };
  }

  /**
   * Get current configuration
   */
  getConfig(): AutoAdjusterConfig {
    return { ...this.config };
  }
}
