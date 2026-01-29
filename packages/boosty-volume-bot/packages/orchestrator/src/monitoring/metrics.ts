/**
 * Metrics Collector
 * Collects and exports metrics for monitoring
 */

import { Registry, Counter, Gauge, Histogram, Summary } from 'prom-client';
import { v4 as uuidv4 } from 'uuid';
import type {
  MetricsCollectorInterface,
  TradeRecord,
  ErrorRecord,
  VolumeMetrics,
  BotMetrics,
  CampaignMetrics,
  SystemMetrics,
} from '../types.js';

/**
 * Metrics collector configuration
 */
export interface MetricsCollectorConfig {
  /** Metrics prefix */
  prefix: string;
  /** Enable Prometheus metrics */
  enablePrometheus: boolean;
  /** Retention period for trades (ms) */
  tradeRetention: number;
  /** Retention period for errors (ms) */
  errorRetention: number;
}

/**
 * Default metrics configuration
 */
export const DEFAULT_METRICS_CONFIG: MetricsCollectorConfig = {
  prefix: 'orchestrator',
  enablePrometheus: true,
  tradeRetention: 24 * 60 * 60 * 1000, // 24 hours
  errorRetention: 7 * 24 * 60 * 60 * 1000, // 7 days
};

/**
 * MetricsCollector - Collects and exports metrics
 */
export class MetricsCollector implements MetricsCollectorInterface {
  private config: MetricsCollectorConfig;
  private registry: Registry;
  private startTime: number;

  // Trade storage
  private trades: TradeRecord[] = [];
  private errors: ErrorRecord[] = [];

  // Bot metrics storage
  private botMetricsStore: Map<string, {
    trades: number;
    successfulTrades: number;
    volume: bigint;
    fees: bigint;
    lastTradeAt?: Date;
    errors: number;
    lastError?: string;
    startTime: number;
  }> = new Map();

  // Prometheus metrics
  private tradeCounter!: Counter;
  private tradeVolumeCounter!: Counter;
  private tradeSuccessCounter!: Counter;
  private tradeFailureCounter!: Counter;
  private errorCounter!: Counter;
  private activeBotsGauge!: Gauge;
  private activeCampaignsGauge!: Gauge;
  private queueSizeGauge!: Gauge;
  private tradeDurationHistogram!: Histogram;
  private tradeSizeSummary!: Summary;

  // Cleanup timer
  private cleanupTimer: NodeJS.Timeout | null = null;

  constructor(config: Partial<MetricsCollectorConfig> = {}) {
    this.config = { ...DEFAULT_METRICS_CONFIG, ...config };
    this.registry = new Registry();
    this.startTime = Date.now();

    if (this.config.enablePrometheus) {
      this.initializePrometheusMetrics();
    }

    // Start cleanup timer
    this.cleanupTimer = setInterval(() => {
      this.cleanup();
    }, 60000); // Cleanup every minute
  }

  /**
   * Record a trade
   */
  recordTrade(trade: TradeRecord): void {
    // Store trade
    this.trades.push(trade);

    // Update bot metrics
    this.updateBotMetrics(trade);

    // Update Prometheus metrics
    if (this.config.enablePrometheus) {
      const labels = {
        token: trade.tokenMint,
        type: trade.type,
        bot_id: trade.botId,
      };

      this.tradeCounter.inc(labels);
      this.tradeVolumeCounter.inc(labels, Number(trade.amount));

      if (trade.success) {
        this.tradeSuccessCounter.inc(labels);
      } else {
        this.tradeFailureCounter.inc(labels);
      }

      this.tradeSizeSummary.observe(labels, Number(trade.amount));
    }
  }

  /**
   * Record an error
   */
  recordError(error: ErrorRecord): void {
    this.errors.push(error);

    // Update bot error metrics
    if (error.botId) {
      const botMetrics = this.botMetricsStore.get(error.botId);
      if (botMetrics) {
        botMetrics.errors++;
        botMetrics.lastError = error.errorMessage;
      }
    }

    // Update Prometheus metrics
    if (this.config.enablePrometheus) {
      this.errorCounter.inc({
        type: error.errorType,
        bot_id: error.botId ?? 'unknown',
      });
    }
  }

  /**
   * Get volume metrics for a token
   */
  async getVolumeMetrics(
    tokenMint: string,
    period: '1h' | '24h' | '7d'
  ): Promise<VolumeMetrics> {
    const now = Date.now();
    const periodMs = {
      '1h': 60 * 60 * 1000,
      '24h': 24 * 60 * 60 * 1000,
      '7d': 7 * 24 * 60 * 60 * 1000,
    }[period];

    const cutoff = now - periodMs;
    const relevantTrades = this.trades.filter(
      (t) => t.tokenMint === tokenMint && t.timestamp.getTime() > cutoff && t.success
    );

    const metrics: VolumeMetrics = {
      tokenMint,
      period,
      totalVolume: 0n,
      buyVolume: 0n,
      sellVolume: 0n,
      transactionCount: relevantTrades.length,
      uniqueWallets: new Set(relevantTrades.map((t) => t.walletId)).size,
      avgTransactionSize: 0n,
      volumeByHour: new Map(),
    };

    // Calculate volumes
    for (const trade of relevantTrades) {
      metrics.totalVolume += trade.amount;
      if (trade.type === 'buy') {
        metrics.buyVolume += trade.amount;
      } else {
        metrics.sellVolume += trade.amount;
      }

      // Track hourly volume
      const hour = trade.timestamp.getHours();
      const hourVolume = metrics.volumeByHour.get(hour) ?? 0n;
      metrics.volumeByHour.set(hour, hourVolume + trade.amount);
    }

    // Calculate average
    if (relevantTrades.length > 0) {
      metrics.avgTransactionSize = metrics.totalVolume / BigInt(relevantTrades.length);
    }

    // Find peak hour
    let peakHour = 0;
    let peakVolume = 0n;
    for (const [hour, volume] of metrics.volumeByHour) {
      if (volume > peakVolume) {
        peakVolume = volume;
        peakHour = hour;
      }
    }
    metrics.peakHour = peakHour;

    return metrics;
  }

  /**
   * Get metrics for a specific bot
   */
  async getBotMetrics(botId: string): Promise<BotMetrics> {
    const stored = this.botMetricsStore.get(botId);
    
    if (!stored) {
      return {
        botId,
        uptime: 0,
        totalTrades: 0,
        successfulTrades: 0,
        failedTrades: 0,
        totalVolume: 0n,
        totalFeesSpent: 0n,
        avgTradeSize: 0n,
        avgTradeInterval: 0,
        errorCount: 0,
      };
    }

    const now = Date.now();
    const uptime = now - stored.startTime;

    // Calculate average trade interval from recent trades
    const botTrades = this.trades
      .filter((t) => t.botId === botId)
      .sort((a, b) => a.timestamp.getTime() - b.timestamp.getTime());
    
    let avgTradeInterval = 0;
    if (botTrades.length > 1) {
      const intervals: number[] = [];
      for (let i = 1; i < botTrades.length; i++) {
        const current = botTrades[i];
        const previous = botTrades[i - 1];
        if (current && previous) {
          intervals.push(
            current.timestamp.getTime() - previous.timestamp.getTime()
          );
        }
      }
      avgTradeInterval = intervals.length > 0 ? intervals.reduce((a, b) => a + b, 0) / intervals.length : 0;
    }

    return {
      botId,
      uptime,
      totalTrades: stored.trades,
      successfulTrades: stored.successfulTrades,
      failedTrades: stored.trades - stored.successfulTrades,
      totalVolume: stored.volume,
      totalFeesSpent: stored.fees,
      avgTradeSize: stored.trades > 0 ? stored.volume / BigInt(stored.trades) : 0n,
      avgTradeInterval,
      lastTradeAt: stored.lastTradeAt,
      errorCount: stored.errors,
      lastError: stored.lastError,
    };
  }

  /**
   * Get campaign metrics
   */
  async getCampaignMetrics(campaignId: string): Promise<CampaignMetrics> {
    const campaignTrades = this.trades.filter((t) => t.campaignId === campaignId);

    const metrics: CampaignMetrics = {
      totalVolume: 0n,
      totalTransactions: campaignTrades.length,
      buyVolume: 0n,
      sellVolume: 0n,
      buyCount: 0,
      sellCount: 0,
      uniqueWallets: new Set(campaignTrades.map((t) => t.walletId)).size,
      avgTransactionSize: 0n,
      totalFeesSpent: 0n,
      successRate: 0,
      hourlyVolume: new Map(),
      lastUpdatedAt: new Date(),
    };

    let successCount = 0;

    for (const trade of campaignTrades) {
      metrics.totalVolume += trade.amount;
      metrics.totalFeesSpent += trade.fees;

      if (trade.type === 'buy') {
        metrics.buyVolume += trade.amount;
        metrics.buyCount++;
      } else {
        metrics.sellVolume += trade.amount;
        metrics.sellCount++;
      }

      if (trade.success) {
        successCount++;
      }

      const hour = trade.timestamp.getHours();
      const hourVolume = metrics.hourlyVolume.get(hour) ?? 0n;
      metrics.hourlyVolume.set(hour, hourVolume + trade.amount);
    }

    if (campaignTrades.length > 0) {
      metrics.avgTransactionSize = metrics.totalVolume / BigInt(campaignTrades.length);
      metrics.successRate = successCount / campaignTrades.length;
    }

    // Find start time
    if (campaignTrades.length > 0) {
      const sortedTrades = [...campaignTrades].sort(
        (a, b) => a.timestamp.getTime() - b.timestamp.getTime()
      );
      const firstTrade = sortedTrades[0];
      if (firstTrade) {
        metrics.startedAt = firstTrade.timestamp;
      }
    }

    return metrics;
  }

  /**
   * Get system-wide metrics
   */
  async getSystemMetrics(): Promise<SystemMetrics> {
    const now = Date.now();
    const last24h = now - 24 * 60 * 60 * 1000;

    const recentTrades = this.trades.filter((t) => t.timestamp.getTime() > last24h);
    
    let totalVolume24h = 0n;
    let totalFees24h = 0n;
    for (const trade of recentTrades) {
      if (trade.success) {
        totalVolume24h += trade.amount;
        totalFees24h += trade.fees;
      }
    }

    const recentErrors = this.errors.filter((e) => e.timestamp.getTime() > last24h);
    const errorRate = recentTrades.length > 0 
      ? recentErrors.length / recentTrades.length 
      : 0;

    const memUsage = process.memoryUsage();

    return {
      activeBots: this.botMetricsStore.size,
      totalBots: this.botMetricsStore.size,
      activeCampaigns: 0, // Would need reference to campaign manager
      queueSize: 0, // Would need reference to task queue
      queueProcessingRate: 0,
      totalVolume24h,
      totalTransactions24h: recentTrades.length,
      totalFeesSpent24h: totalFees24h,
      errorRate,
      uptime: now - this.startTime,
      memoryUsage: {
        heapUsed: memUsage.heapUsed,
        heapTotal: memUsage.heapTotal,
        external: memUsage.external,
        rss: memUsage.rss,
      },
      redisConnected: true, // Would need to check actual connection
      lastUpdatedAt: new Date(),
    };
  }

  /**
   * Export metrics
   */
  async exportMetrics(format: 'json' | 'prometheus'): Promise<string> {
    if (format === 'prometheus') {
      return this.registry.metrics();
    }

    // JSON format
    const systemMetrics = await this.getSystemMetrics();
    
    return JSON.stringify({
      system: {
        ...systemMetrics,
        totalVolume24h: systemMetrics.totalVolume24h.toString(),
        totalFeesSpent24h: systemMetrics.totalFeesSpent24h.toString(),
      },
      recentTrades: this.trades.slice(-100).map((t) => ({
        ...t,
        amount: t.amount.toString(),
        fees: t.fees.toString(),
      })),
      recentErrors: this.errors.slice(-50),
    }, null, 2);
  }

  /**
   * Set active bots count (for Prometheus)
   */
  setActiveBots(count: number): void {
    if (this.config.enablePrometheus) {
      this.activeBotsGauge.set(count);
    }
  }

  /**
   * Set active campaigns count (for Prometheus)
   */
  setActiveCampaigns(count: number): void {
    if (this.config.enablePrometheus) {
      this.activeCampaignsGauge.set(count);
    }
  }

  /**
   * Set queue size (for Prometheus)
   */
  setQueueSize(size: number): void {
    if (this.config.enablePrometheus) {
      this.queueSizeGauge.set(size);
    }
  }

  /**
   * Record trade duration
   */
  recordTradeDuration(durationMs: number, labels: { type: string; success: string }): void {
    if (this.config.enablePrometheus) {
      this.tradeDurationHistogram.observe(labels, durationMs);
    }
  }

  /**
   * Initialize bot tracking
   */
  initBot(botId: string): void {
    if (!this.botMetricsStore.has(botId)) {
      this.botMetricsStore.set(botId, {
        trades: 0,
        successfulTrades: 0,
        volume: 0n,
        fees: 0n,
        errors: 0,
        startTime: Date.now(),
      });
    }
  }

  /**
   * Remove bot tracking
   */
  removeBot(botId: string): void {
    this.botMetricsStore.delete(botId);
  }

  /**
   * Get Prometheus registry
   */
  getRegistry(): Registry {
    return this.registry;
  }

  /**
   * Reset all metrics
   */
  reset(): void {
    this.trades = [];
    this.errors = [];
    this.botMetricsStore.clear();
    this.registry.resetMetrics();
  }

  /**
   * Close metrics collector
   */
  close(): void {
    if (this.cleanupTimer) {
      clearInterval(this.cleanupTimer);
      this.cleanupTimer = null;
    }
  }

  /**
   * Update bot metrics after a trade
   */
  private updateBotMetrics(trade: TradeRecord): void {
    let botMetrics = this.botMetricsStore.get(trade.botId);
    
    if (!botMetrics) {
      botMetrics = {
        trades: 0,
        successfulTrades: 0,
        volume: 0n,
        fees: 0n,
        errors: 0,
        startTime: Date.now(),
      };
      this.botMetricsStore.set(trade.botId, botMetrics);
    }

    botMetrics.trades++;
    botMetrics.lastTradeAt = trade.timestamp;

    if (trade.success) {
      botMetrics.successfulTrades++;
      botMetrics.volume += trade.amount;
      botMetrics.fees += trade.fees;
    }
  }

  /**
   * Initialize Prometheus metrics
   */
  private initializePrometheusMetrics(): void {
    const prefix = this.config.prefix;

    this.tradeCounter = new Counter({
      name: `${prefix}_trades_total`,
      help: 'Total number of trades',
      labelNames: ['token', 'type', 'bot_id'],
      registers: [this.registry],
    });

    this.tradeVolumeCounter = new Counter({
      name: `${prefix}_trade_volume_total`,
      help: 'Total trade volume',
      labelNames: ['token', 'type', 'bot_id'],
      registers: [this.registry],
    });

    this.tradeSuccessCounter = new Counter({
      name: `${prefix}_trades_success_total`,
      help: 'Total successful trades',
      labelNames: ['token', 'type', 'bot_id'],
      registers: [this.registry],
    });

    this.tradeFailureCounter = new Counter({
      name: `${prefix}_trades_failure_total`,
      help: 'Total failed trades',
      labelNames: ['token', 'type', 'bot_id'],
      registers: [this.registry],
    });

    this.errorCounter = new Counter({
      name: `${prefix}_errors_total`,
      help: 'Total errors',
      labelNames: ['type', 'bot_id'],
      registers: [this.registry],
    });

    this.activeBotsGauge = new Gauge({
      name: `${prefix}_active_bots`,
      help: 'Number of active bots',
      registers: [this.registry],
    });

    this.activeCampaignsGauge = new Gauge({
      name: `${prefix}_active_campaigns`,
      help: 'Number of active campaigns',
      registers: [this.registry],
    });

    this.queueSizeGauge = new Gauge({
      name: `${prefix}_queue_size`,
      help: 'Current queue size',
      registers: [this.registry],
    });

    this.tradeDurationHistogram = new Histogram({
      name: `${prefix}_trade_duration_ms`,
      help: 'Trade execution duration in milliseconds',
      labelNames: ['type', 'success'],
      buckets: [100, 250, 500, 1000, 2500, 5000, 10000],
      registers: [this.registry],
    });

    this.tradeSizeSummary = new Summary({
      name: `${prefix}_trade_size`,
      help: 'Trade size distribution',
      labelNames: ['token', 'type', 'bot_id'],
      percentiles: [0.5, 0.9, 0.99],
      registers: [this.registry],
    });
  }

  /**
   * Cleanup old data
   */
  private cleanup(): void {
    const now = Date.now();

    // Clean old trades
    const tradeRetention = now - this.config.tradeRetention;
    this.trades = this.trades.filter((t) => t.timestamp.getTime() > tradeRetention);

    // Clean old errors
    const errorRetention = now - this.config.errorRetention;
    this.errors = this.errors.filter((e) => e.timestamp.getTime() > errorRetention);
  }
}
