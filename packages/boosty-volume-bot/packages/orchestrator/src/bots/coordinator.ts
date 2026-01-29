/**
 * Bot Coordinator
 * Manages and coordinates multiple trading bots
 */

import { EventEmitter } from 'eventemitter3';
import type {
  Bot,
  BotConfig,
  BotStatus,
  BotCoordinatorInterface,
  Task,
} from '../types.js';
import { TradingBot } from './bot.js';
import { BotFactory, type BotFactoryConfig } from './bot-factory.js';
import { RandomizationEngine } from '../randomization/engine.js';

/**
 * Events emitted by the coordinator
 */
export interface CoordinatorEvents {
  'bot-created': (bot: Bot) => void;
  'bot-started': (botId: string) => void;
  'bot-stopped': (botId: string) => void;
  'bot-error': (botId: string, error: Error) => void;
  'all-started': () => void;
  'all-stopped': () => void;
  'shutdown-complete': () => void;
}

/**
 * Coordinator configuration
 */
export interface CoordinatorConfig {
  /** Maximum concurrent running bots */
  maxConcurrentBots: number;
  /** Task queue enqueue function */
  enqueueTask: (task: Task) => Promise<string>;
  /** Randomization engine instance */
  randomization?: RandomizationEngine;
  /** Default bot configuration */
  defaultBotConfig?: Partial<BotConfig>;
  /** Graceful shutdown timeout (ms) */
  shutdownTimeout?: number;
}

/**
 * BotCoordinator - Manages thousands of virtual trading bots
 */
export class BotCoordinator extends EventEmitter<CoordinatorEvents> implements BotCoordinatorInterface {
  private bots: Map<string, TradingBot> = new Map();
  private runningBots: Set<string> = new Set();
  private factory: BotFactory;
  private config: CoordinatorConfig;
  private randomization: RandomizationEngine;
  private isShuttingDown = false;

  constructor(config: CoordinatorConfig) {
    super();

    this.config = {
      shutdownTimeout: 30000,
      ...config,
    };

    this.randomization = config.randomization ?? new RandomizationEngine();

    const factoryConfig: BotFactoryConfig = {
      defaultConfig: config.defaultBotConfig ?? {},
      randomization: this.randomization,
      enqueueTask: config.enqueueTask,
    };

    this.factory = new BotFactory(factoryConfig);
  }

  /**
   * Create a new bot
   */
  async createBot(config: BotConfig): Promise<Bot> {
    if (this.isShuttingDown) {
      throw new Error('Coordinator is shutting down');
    }

    const bot = this.factory.createBot(config);
    
    // Set up event listeners
    this.setupBotListeners(bot);
    
    // Register bot
    this.bots.set(bot.id, bot);

    this.emit('bot-created', bot);

    return bot;
  }

  /**
   * Create a swarm of bots
   */
  async createBotSwarm(count: number, baseConfig: BotConfig): Promise<Bot[]> {
    if (this.isShuttingDown) {
      throw new Error('Coordinator is shutting down');
    }

    // Generate wallet IDs if not provided with variation
    const walletIds: string[] = [];
    for (let i = 0; i < count; i++) {
      walletIds.push(`${baseConfig.walletId}-${i.toString().padStart(4, '0')}`);
    }

    const bots = this.factory.createSwarm({
      count,
      baseConfig,
      walletIds,
      mode: this.getModeFromConfig(baseConfig),
    });

    // Register all bots
    for (const bot of bots) {
      this.setupBotListeners(bot);
      this.bots.set(bot.id, bot);
      this.emit('bot-created', bot);
    }

    return bots;
  }

  /**
   * Start a specific bot
   */
  async startBot(botId: string): Promise<void> {
    const bot = this.bots.get(botId);
    if (!bot) {
      throw new Error(`Bot ${botId} not found`);
    }

    if (this.runningBots.size >= this.config.maxConcurrentBots) {
      throw new Error(`Maximum concurrent bots (${this.config.maxConcurrentBots}) reached`);
    }

    await bot.start();
    this.runningBots.add(botId);
    this.emit('bot-started', botId);
  }

  /**
   * Stop a specific bot
   */
  async stopBot(botId: string): Promise<void> {
    const bot = this.bots.get(botId);
    if (!bot) {
      throw new Error(`Bot ${botId} not found`);
    }

    await bot.stop();
    this.runningBots.delete(botId);
    this.emit('bot-stopped', botId);
  }

  /**
   * Start all bots (respecting concurrency limit)
   */
  async startAllBots(): Promise<void> {
    if (this.isShuttingDown) {
      throw new Error('Coordinator is shutting down');
    }

    const botsToStart = Array.from(this.bots.values())
      .filter(bot => bot.config.enabled && bot.state !== 'running');

    // Shuffle for randomized start order
    const shuffled = this.randomization.shuffleWallets(
      botsToStart.map(b => b.id)
    );

    // Start bots with staggered timing
    const startPromises: Promise<void>[] = [];
    let started = 0;

    for (const botId of shuffled) {
      if (this.runningBots.size + started >= this.config.maxConcurrentBots) {
        break;
      }

      const delay = this.randomization.getNextInterval(100, 1000);
      
      startPromises.push(
        new Promise<void>(resolve => {
          setTimeout(async () => {
            try {
              await this.startBot(botId);
            } catch (error) {
              // Log but don't fail the entire operation
              console.error(`Failed to start bot ${botId}:`, error);
            }
            resolve();
          }, delay * started);
        })
      );

      started++;
    }

    await Promise.all(startPromises);
    this.emit('all-started');
  }

  /**
   * Stop all bots
   */
  async stopAllBots(): Promise<void> {
    const stopPromises = Array.from(this.runningBots).map(botId => 
      this.stopBot(botId).catch(err => {
        console.error(`Error stopping bot ${botId}:`, err);
      })
    );

    await Promise.all(stopPromises);
    this.emit('all-stopped');
  }

  /**
   * Get status of a specific bot
   */
  async getBotStatus(botId: string): Promise<BotStatus> {
    const bot = this.bots.get(botId);
    if (!bot) {
      throw new Error(`Bot ${botId} not found`);
    }

    return bot.getStatus();
  }

  /**
   * Get status of all bots
   */
  async getAllBotStatuses(): Promise<Map<string, BotStatus>> {
    const statuses = new Map<string, BotStatus>();
    
    for (const [botId, bot] of this.bots) {
      statuses.set(botId, bot.getStatus());
    }

    return statuses;
  }

  /**
   * Update configuration for a specific bot
   */
  updateBotConfig(botId: string, config: Partial<BotConfig>): void {
    const bot = this.bots.get(botId);
    if (!bot) {
      throw new Error(`Bot ${botId} not found`);
    }

    bot.updateConfig(config);
  }

  /**
   * Update configuration for all bots
   */
  updateAllBotsConfig(config: Partial<BotConfig>): void {
    for (const bot of this.bots.values()) {
      bot.updateConfig(config);
    }
  }

  /**
   * Remove a bot from the coordinator
   */
  async removeBot(botId: string): Promise<void> {
    const bot = this.bots.get(botId);
    if (!bot) {
      return;
    }

    // Stop if running
    if (this.runningBots.has(botId)) {
      await this.stopBot(botId);
    }

    // Clean up
    bot.destroy();
    this.bots.delete(botId);
  }

  /**
   * Pause a specific bot
   */
  async pauseBot(botId: string): Promise<void> {
    const bot = this.bots.get(botId);
    if (!bot) {
      throw new Error(`Bot ${botId} not found`);
    }

    await bot.pause();
  }

  /**
   * Resume a paused bot
   */
  async resumeBot(botId: string): Promise<void> {
    const bot = this.bots.get(botId);
    if (!bot) {
      throw new Error(`Bot ${botId} not found`);
    }

    await bot.resume();
  }

  /**
   * Get running bot count
   */
  getRunningCount(): number {
    return this.runningBots.size;
  }

  /**
   * Get total bot count
   */
  getTotalCount(): number {
    return this.bots.size;
  }

  /**
   * Get bots by state
   */
  getBotsByState(state: 'idle' | 'running' | 'paused' | 'stopped' | 'error'): Bot[] {
    return Array.from(this.bots.values()).filter(bot => bot.state === state);
  }

  /**
   * Get bots by target token
   */
  getBotsByToken(tokenMint: string): Bot[] {
    return Array.from(this.bots.values()).filter(
      bot => bot.config.targetToken === tokenMint
    );
  }

  /**
   * Get aggregate statistics
   */
  getAggregateStats(): {
    totalBots: number;
    runningBots: number;
    totalTrades: number;
    totalVolume: bigint;
    avgSuccessRate: number;
    totalFeesSpent: bigint;
  } {
    let totalTrades = 0;
    let totalVolume = 0n;
    let totalSuccessRate = 0;
    let totalFeesSpent = 0n;
    let botCount = 0;

    for (const bot of this.bots.values()) {
      const stats = bot.getStats();
      totalTrades += stats.totalTrades;
      totalVolume += stats.totalVolume;
      totalSuccessRate += stats.successRate;
      totalFeesSpent += stats.totalFeesSpent;
      botCount++;
    }

    return {
      totalBots: this.bots.size,
      runningBots: this.runningBots.size,
      totalTrades,
      totalVolume,
      avgSuccessRate: botCount > 0 ? totalSuccessRate / botCount : 0,
      totalFeesSpent,
    };
  }

  /**
   * Graceful shutdown
   */
  async shutdown(): Promise<void> {
    this.isShuttingDown = true;

    // Stop accepting new operations
    console.log('Coordinator: Starting graceful shutdown...');

    // Stop all bots
    await this.stopAllBots();

    // Wait for in-flight operations (with timeout)
    await this.waitForCompletion();

    // Clean up
    for (const bot of this.bots.values()) {
      bot.destroy();
    }
    this.bots.clear();
    this.runningBots.clear();

    this.emit('shutdown-complete');
    console.log('Coordinator: Shutdown complete');
  }

  /**
   * Wait for in-flight operations to complete
   */
  private async waitForCompletion(): Promise<void> {
    const timeout = this.config.shutdownTimeout ?? 30000;
    const start = Date.now();

    while (this.runningBots.size > 0) {
      if (Date.now() - start > timeout) {
        console.warn('Coordinator: Shutdown timeout reached, forcing stop');
        break;
      }
      await new Promise(resolve => setTimeout(resolve, 100));
    }
  }

  /**
   * Set up event listeners for a bot
   */
  private setupBotListeners(bot: TradingBot): void {
    bot.on('error', (error) => {
      this.emit('bot-error', bot.id, error);
    });

    bot.on('state-change', (newState, _oldState) => {
      if (newState === 'stopped') {
        this.runningBots.delete(bot.id);
      } else if (newState === 'running') {
        this.runningBots.add(bot.id);
      }
    });
  }

  /**
   * Determine mode from bot config
   */
  private getModeFromConfig(config: BotConfig): 'aggressive' | 'moderate' | 'stealth' {
    const intervalRange = config.maxInterval - config.minInterval;
    
    if (intervalRange < 60000) {
      return 'aggressive';
    } else if (intervalRange > 300000) {
      return 'stealth';
    }
    return 'moderate';
  }

  /**
   * Handle trade completion for a specific bot
   */
  handleTradeCompletion(botId: string, success: boolean, signature?: string, fees?: bigint): void {
    const bot = this.bots.get(botId);
    if (bot) {
      bot.onTradeCompleted(success, signature, fees);
    }
  }

  /**
   * Serialize all bots for persistence
   */
  serializeAll(): Array<{
    id: string;
    config: BotConfig;
    status: BotStatus;
  }> {
    return Array.from(this.bots.values()).map(bot => ({
      id: bot.id,
      config: bot.config,
      status: bot.getStatus(),
    }));
  }

  /**
   * Restore bots from serialized data
   */
  async restoreFromSerialized(
    data: Array<{ id: string; config: BotConfig }>
  ): Promise<void> {
    for (const item of data) {
      const bot = this.factory.createBot(item.config, item.id);
      this.setupBotListeners(bot);
      this.bots.set(bot.id, bot);
    }
  }
}
