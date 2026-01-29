/**
 * Orchestrator Package
 * Volume generation and bot coordination for DeFi MCP servers
 */

// Types
export * from './types.js';

// Randomization
export {
  RandomizationEngine,
  getRandomizationEngine,
  resetRandomizationEngine,
  DEFAULT_RANDOMIZATION_CONFIG,
} from './randomization/engine.js';
export {
  AntiDetectionEngine,
  createWalletFingerprint,
  shouldReduceActivity,
  generateRealisticMemo,
  DEFAULT_ANTI_DETECTION_CONFIG,
} from './randomization/anti-detection.js';
export * from './randomization/distributions.js';

// Bots
export { TradingBot, type BotEvents, type BotDependencies } from './bots/bot.js';
export { BotFactory, type BotFactoryConfig, type SwarmOptions } from './bots/bot-factory.js';
export {
  BotCoordinator,
  type CoordinatorConfig,
  type CoordinatorEvents,
} from './bots/coordinator.js';
export {
  BEHAVIOR_PROFILES,
  DEFAULT_PROFILE,
  AGGRESSIVE_PROFILE,
  CONSERVATIVE_PROFILE,
  STEALTH_PROFILE,
  RETAIL_PROFILE,
  WHALE_PROFILE,
  MARKET_MAKER_PROFILE,
  getProfile,
  createCustomProfile,
  getProfileForMode,
  isWithinActiveHours,
  getActivityMultiplier,
  selectProfilesForSwarm,
} from './bots/behavior-profiles.js';

// Queue
export { TaskQueue, DEFAULT_QUEUE_CONFIG, type TaskProcessor } from './queue/task-queue.js';
export { Scheduler, DEFAULT_SCHEDULER_CONFIG } from './queue/scheduler.js';
export {
  processSwapTask,
  validateSwapPayload,
  type SwapPayload,
} from './queue/workers/swap-worker.js';
export {
  processTransferTask,
  validateTransferPayload,
  type TransferPayload,
} from './queue/workers/transfer-worker.js';
export {
  processBalanceTask,
  validateBalancePayload,
  createBalanceCheckTask,
  type BalancePayload,
  type BalanceResult,
} from './queue/workers/balance-worker.js';

// Campaigns
export { VolumeCampaign, type CampaignEvents } from './campaigns/campaign.js';
export {
  CampaignManager,
  type CampaignManagerConfig,
  type CampaignManagerEvents,
} from './campaigns/manager.js';
export {
  AutoAdjuster,
  DEFAULT_ADJUSTER_CONFIG,
  type AutoAdjusterConfig,
  type AdjustmentRecommendation,
} from './campaigns/auto-adjuster.js';

// Monitoring
export {
  MetricsCollector,
  DEFAULT_METRICS_CONFIG,
  type MetricsCollectorConfig,
} from './monitoring/metrics.js';
export {
  PoolMonitor,
  DEFAULT_POOL_MONITOR_CONFIG,
  type PoolMonitorEvents,
} from './monitoring/pool-monitor.js';
export {
  MigrationDetector,
  DEFAULT_MIGRATION_CONFIG,
  type MigrationDetectorConfig,
  type MigrationDetectorEvents,
} from './monitoring/migration-detector.js';

// Main orchestrator class
import { EventEmitter } from 'eventemitter3';
import type {
  OrchestratorConfig,
  Task,
  BotConfig,
  CampaignConfig,
  Campaign,
  CampaignStatus,
  CampaignMetrics,
  BotStatus,
  SystemMetrics,
  WorkerContext,
} from './types.js';
import { RandomizationEngine } from './randomization/engine.js';
import { BotCoordinator } from './bots/coordinator.js';
import { TaskQueue } from './queue/task-queue.js';
import { Scheduler } from './queue/scheduler.js';
import { processSwapTask } from './queue/workers/swap-worker.js';
import { processTransferTask } from './queue/workers/transfer-worker.js';
import { processBalanceTask } from './queue/workers/balance-worker.js';
import { CampaignManager } from './campaigns/manager.js';
import { MetricsCollector } from './monitoring/metrics.js';
import { PoolMonitor } from './monitoring/pool-monitor.js';
import { MigrationDetector } from './monitoring/migration-detector.js';

/**
 * Default orchestrator configuration
 */
export const DEFAULT_ORCHESTRATOR_CONFIG: OrchestratorConfig = {
  redis: {
    url: 'redis://localhost:6379',
    prefix: 'orchestrator',
    enablePersistence: true,
  },
  bots: {
    maxConcurrent: 10000,
    defaultConfig: {
      mode: 'volume',
      minTradeSize: 10000000n,
      maxTradeSize: 100000000n,
      minInterval: 30000,
      maxInterval: 300000,
      buyProbability: 0.5,
      maxDailyTrades: 100,
      maxDailyVolume: 10000000000n,
      enabled: true,
    },
  },
  queue: {
    redisUrl: 'redis://localhost:6379',
    queuePrefix: 'orchestrator',
    defaultJobOptions: {
      attempts: 3,
      backoff: { type: 'exponential', delay: 1000 },
      removeOnComplete: 1000,
      removeOnFail: 5000,
    },
    concurrency: 50,
  },
  scheduler: {
    timezone: 'UTC',
    maxConcurrentScheduled: 100,
  },
  randomization: {
    defaultTimingDistribution: 'poisson',
    defaultSizeDistribution: 'skewed-low',
    timingJitterPercent: 15,
    sizeJitterPercent: 10,
  },
  poolMonitor: {
    tokenMints: [],
    pollingInterval: 30000,
    minLiquidity: 1000000000n,
    autoRedirect: true,
  },
  metrics: {
    enabled: true,
    exportInterval: 60000,
    retentionPeriod: 86400000,
  },
  shutdownTimeout: 30000,
};

/**
 * Orchestrator events
 */
export interface OrchestratorEvents {
  'initialized': () => void;
  'shutdown-started': () => void;
  'shutdown-complete': () => void;
  'error': (error: Error) => void;
}

/**
 * Orchestrator - Main entry point for the orchestration system
 */
export class Orchestrator extends EventEmitter<OrchestratorEvents> {
  private config: OrchestratorConfig;
  private isInitialized = false;
  private isShuttingDown = false;

  // Components
  private randomization!: RandomizationEngine;
  private metrics!: MetricsCollector;
  private taskQueue!: TaskQueue;
  private scheduler!: Scheduler;
  private botCoordinator!: BotCoordinator;
  private campaignManager!: CampaignManager;
  private poolMonitor!: PoolMonitor;
  private migrationDetector!: MigrationDetector;

  constructor(config: Partial<OrchestratorConfig> = {}) {
    super();
    this.config = this.mergeConfig(DEFAULT_ORCHESTRATOR_CONFIG, config);
  }

  /**
   * Initialize the orchestrator
   */
  async initialize(): Promise<void> {
    if (this.isInitialized) {
      return;
    }

    try {
      // Initialize randomization engine
      this.randomization = new RandomizationEngine(this.config.randomization);

      // Initialize metrics collector
      this.metrics = new MetricsCollector({
        prefix: this.config.redis.prefix,
        enablePrometheus: this.config.metrics.enabled,
      });

      // Create worker context
      const workerContext: WorkerContext = {
        redis: null, // Will be set by task queue
        metricsCollector: this.metrics,
      };

      // Initialize task queue
      this.taskQueue = new TaskQueue(
        {
          ...this.config.queue,
          redisUrl: this.config.redis.url,
          queuePrefix: this.config.redis.prefix,
        },
        workerContext
      );

      // Register task processors
      this.taskQueue.registerProcessor('swap', processSwapTask);
      this.taskQueue.registerProcessor('transfer', processTransferTask);
      this.taskQueue.registerProcessor('check-balance', processBalanceTask);

      // Initialize scheduler
      this.scheduler = new Scheduler(this.taskQueue, this.config.scheduler);

      // Initialize bot coordinator
      this.botCoordinator = new BotCoordinator({
        maxConcurrentBots: this.config.bots.maxConcurrent,
        enqueueTask: (task: Task) => this.taskQueue.enqueue(task),
        randomization: this.randomization,
        defaultBotConfig: this.config.bots.defaultConfig,
        shutdownTimeout: this.config.shutdownTimeout,
      });

      // Initialize campaign manager
      this.campaignManager = new CampaignManager({
        botCoordinator: this.botCoordinator,
        enqueueTask: (task: Task) => this.taskQueue.enqueue(task),
        maxConcurrentCampaigns: 10,
        enableAutoAdjustment: true,
      });

      // Initialize pool monitor and migration detector
      this.poolMonitor = new PoolMonitor(this.config.poolMonitor);
      this.migrationDetector = new MigrationDetector(this.poolMonitor);

      // Set up migration handler
      this.migrationDetector.onMigration((event) => {
        console.log(`Migration detected for ${event.tokenMint}: ${event.fromPool.type} → ${event.toPool.type}`);
        // Could auto-redirect bots here
      });

      // Start processing
      await this.taskQueue.startProcessing();
      this.scheduler.start();

      this.isInitialized = true;
      this.emit('initialized');
    } catch (error) {
      const err = error instanceof Error ? error : new Error(String(error));
      this.emit('error', err);
      throw err;
    }
  }

  /**
   * Graceful shutdown
   */
  async shutdown(): Promise<void> {
    if (this.isShuttingDown || !this.isInitialized) {
      return;
    }

    this.isShuttingDown = true;
    this.emit('shutdown-started');

    try {
      // Stop accepting new tasks
      await this.taskQueue.pause();

      // Stop scheduler
      this.scheduler.stop();

      // Stop campaigns
      await this.campaignManager.shutdown();

      // Stop bots
      await this.botCoordinator.shutdown();

      // Stop monitoring
      await this.migrationDetector.stopMonitoring();

      // Close task queue
      await this.taskQueue.close();

      // Close metrics
      this.metrics.close();

      this.isInitialized = false;
      this.emit('shutdown-complete');
    } catch (error) {
      const err = error instanceof Error ? error : new Error(String(error));
      this.emit('error', err);
      throw err;
    }
  }

  // ============================================================================
  // Bot Management
  // ============================================================================

  async createBot(config: BotConfig): Promise<string> {
    const bot = await this.botCoordinator.createBot(config);
    return bot.id;
  }

  async createBotSwarm(count: number, baseConfig: BotConfig): Promise<string[]> {
    const bots = await this.botCoordinator.createBotSwarm(count, baseConfig);
    return bots.map((b) => b.id);
  }

  async startBot(botId: string): Promise<void> {
    await this.botCoordinator.startBot(botId);
  }

  async stopBot(botId: string): Promise<void> {
    await this.botCoordinator.stopBot(botId);
  }

  async startAllBots(): Promise<void> {
    await this.botCoordinator.startAllBots();
  }

  async stopAllBots(): Promise<void> {
    await this.botCoordinator.stopAllBots();
  }

  async getBotStatus(botId: string): Promise<BotStatus> {
    return this.botCoordinator.getBotStatus(botId);
  }

  async getAllBotStatuses(): Promise<Map<string, BotStatus>> {
    return this.botCoordinator.getAllBotStatuses();
  }

  updateBotConfig(botId: string, config: Partial<BotConfig>): void {
    this.botCoordinator.updateBotConfig(botId, config);
  }

  // ============================================================================
  // Campaign Management
  // ============================================================================

  async createCampaign(config: CampaignConfig): Promise<Campaign> {
    return this.campaignManager.createCampaign(config);
  }

  async startCampaign(campaignId: string): Promise<void> {
    await this.campaignManager.startCampaign(campaignId);
  }

  async pauseCampaign(campaignId: string): Promise<void> {
    await this.campaignManager.pauseCampaign(campaignId);
  }

  async stopCampaign(campaignId: string): Promise<void> {
    await this.campaignManager.stopCampaign(campaignId);
  }

  async getCampaignStatus(campaignId: string): Promise<CampaignStatus> {
    return this.campaignManager.getCampaignStatus(campaignId);
  }

  async getCampaignMetrics(campaignId: string): Promise<CampaignMetrics> {
    return this.campaignManager.getCampaignMetrics(campaignId);
  }

  async adjustCampaignParams(
    campaignId: string,
    params: Partial<CampaignConfig>
  ): Promise<void> {
    await this.campaignManager.adjustCampaignParams(campaignId, params);
  }

  // ============================================================================
  // Task Queue
  // ============================================================================

  async enqueueTask(task: Task): Promise<string> {
    return this.taskQueue.enqueue(task);
  }

  async enqueueBatch(tasks: Task[]): Promise<string[]> {
    return this.taskQueue.enqueueBatch(tasks);
  }

  async getQueueStats() {
    return this.taskQueue.getQueueStats();
  }

  // ============================================================================
  // Metrics & Monitoring
  // ============================================================================

  async getSystemMetrics(): Promise<SystemMetrics> {
    const systemMetrics = await this.metrics.getSystemMetrics();
    
    // Update with live data
    systemMetrics.activeBots = this.botCoordinator.getRunningCount();
    systemMetrics.totalBots = this.botCoordinator.getTotalCount();
    systemMetrics.activeCampaigns = this.campaignManager.getActiveCampaigns().length;
    
    const queueStats = await this.taskQueue.getQueueStats();
    systemMetrics.queueSize = queueStats.pending + queueStats.active;
    systemMetrics.queueProcessingRate = queueStats.throughput.perMinute;

    return systemMetrics;
  }

  async exportMetrics(format: 'json' | 'prometheus'): Promise<string> {
    return this.metrics.exportMetrics(format);
  }

  // ============================================================================
  // Pool Monitoring
  // ============================================================================

  async startPoolMonitoring(): Promise<void> {
    await this.migrationDetector.startMonitoring();
  }

  async stopPoolMonitoring(): Promise<void> {
    await this.migrationDetector.stopMonitoring();
  }

  addMonitoredToken(tokenMint: string): void {
    this.migrationDetector.addToken(tokenMint);
  }

  removeMonitoredToken(tokenMint: string): void {
    this.migrationDetector.removeToken(tokenMint);
  }

  // ============================================================================
  // Getters
  // ============================================================================

  getRandomization(): RandomizationEngine {
    return this.randomization;
  }

  getBotCoordinator(): BotCoordinator {
    return this.botCoordinator;
  }

  getCampaignManager(): CampaignManager {
    return this.campaignManager;
  }

  getTaskQueue(): TaskQueue {
    return this.taskQueue;
  }

  getScheduler(): Scheduler {
    return this.scheduler;
  }

  getMetricsCollector(): MetricsCollector {
    return this.metrics;
  }

  getPoolMonitor(): PoolMonitor {
    return this.poolMonitor;
  }

  getMigrationDetector(): MigrationDetector {
    return this.migrationDetector;
  }

  // ============================================================================
  // Helpers
  // ============================================================================

  private mergeConfig(
    defaults: OrchestratorConfig,
    overrides: Partial<OrchestratorConfig>
  ): OrchestratorConfig {
    return {
      ...defaults,
      ...overrides,
      redis: { ...defaults.redis, ...overrides.redis },
      bots: { ...defaults.bots, ...overrides.bots },
      queue: { ...defaults.queue, ...overrides.queue },
      scheduler: { ...defaults.scheduler, ...overrides.scheduler },
      randomization: { ...defaults.randomization, ...overrides.randomization },
      poolMonitor: { ...defaults.poolMonitor, ...overrides.poolMonitor },
      metrics: { ...defaults.metrics, ...overrides.metrics },
    };
  }
}

// Default export
export default Orchestrator;
