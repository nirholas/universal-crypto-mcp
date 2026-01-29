/**
 * Bot Factory
 * Creates and configures trading bots
 */

import { v4 as uuidv4 } from 'uuid';
import type { Bot, BotConfig, BehaviorProfile, Task } from '../types.js';
import { TradingBot, type BotDependencies } from './bot.js';
import { RandomizationEngine } from '../randomization/engine.js';
import { selectProfilesForSwarm, createCustomProfile, getProfile } from './behavior-profiles.js';

/**
 * Bot factory configuration
 */
export interface BotFactoryConfig {
  /** Default bot configuration */
  defaultConfig: Partial<BotConfig>;
  /** Randomization engine instance */
  randomization: RandomizationEngine;
  /** Task enqueue function */
  enqueueTask: (task: Task) => Promise<string>;
  /** Optional wallet balance checker */
  getWalletBalance?: (walletId: string, tokenMint: string) => Promise<bigint>;
}

/**
 * Swarm creation options
 */
export interface SwarmOptions {
  /** Number of bots to create */
  count: number;
  /** Base configuration for all bots */
  baseConfig: BotConfig;
  /** Campaign mode for behavior distribution */
  mode?: 'aggressive' | 'moderate' | 'stealth';
  /** Custom wallet IDs (if not provided, uses baseConfig.walletId with index) */
  walletIds?: string[];
  /** Variation factor for config parameters (0-1) */
  variationFactor?: number;
}

/**
 * BotFactory - Creates and configures trading bots
 */
export class BotFactory {
  private config: BotFactoryConfig;

  constructor(config: BotFactoryConfig) {
    this.config = config;
  }

  /**
   * Create a single bot with configuration
   */
  createBot(config: BotConfig, id?: string): TradingBot {
    // Merge with defaults
    const mergedConfig: BotConfig = {
      ...this.getDefaultConfig(),
      ...config,
    };

    // Validate configuration
    this.validateConfig(mergedConfig);

    // Create dependencies
    const deps: BotDependencies = {
      randomization: this.config.randomization,
      enqueueTask: this.config.enqueueTask,
      getWalletBalance: this.config.getWalletBalance,
    };

    return new TradingBot(mergedConfig, deps, id);
  }

  /**
   * Create a swarm of bots with varied configurations
   */
  createSwarm(options: SwarmOptions): TradingBot[] {
    const {
      count,
      baseConfig,
      mode = 'moderate',
      walletIds,
      variationFactor = 0.2,
    } = options;

    // Get behavior profiles for the swarm
    const profiles = selectProfilesForSwarm(count, mode);
    const defaultProfile = profiles[0];
    
    if (!defaultProfile) {
      throw new Error('No behavior profiles available for swarm creation');
    }

    // Create bots
    const bots: TradingBot[] = [];

    for (let i = 0; i < count; i++) {
      const profile = profiles[i] ?? defaultProfile;
      const walletId = walletIds?.[i] ?? `${baseConfig.walletId}-${i}`;

      // Create varied configuration
      const variedConfig = this.createVariedConfig(
        baseConfig,
        profile,
        walletId,
        variationFactor
      );

      const bot = this.createBot(variedConfig, `bot-${uuidv4().slice(0, 8)}`);
      bots.push(bot);
    }

    return bots;
  }

  /**
   * Create configuration with variations
   */
  private createVariedConfig(
    baseConfig: BotConfig,
    profile: BehaviorProfile,
    walletId: string,
    variationFactor: number
  ): BotConfig {
    const vary = (value: number, factor: number = variationFactor): number => {
      const variance = value * factor;
      return value + (Math.random() * 2 - 1) * variance;
    };

    const varyBigInt = (value: bigint, factor: number = variationFactor): bigint => {
      const numValue = Number(value);
      const varied = vary(numValue, factor);
      return BigInt(Math.max(1, Math.floor(varied)));
    };

    return {
      ...baseConfig,
      walletId,
      behaviorProfile: profile.name,
      minTradeSize: varyBigInt(baseConfig.minTradeSize, variationFactor * 0.5),
      maxTradeSize: varyBigInt(baseConfig.maxTradeSize, variationFactor * 0.5),
      minInterval: Math.max(1000, Math.floor(vary(baseConfig.minInterval))),
      maxInterval: Math.floor(vary(baseConfig.maxInterval)),
      buyProbability: Math.max(0.1, Math.min(0.9, vary(baseConfig.buyProbability, variationFactor * 0.3))),
      maxDailyTrades: Math.max(1, Math.floor(vary(baseConfig.maxDailyTrades))),
      maxDailyVolume: varyBigInt(baseConfig.maxDailyVolume),
    };
  }

  /**
   * Create a bot from a serialized configuration
   */
  createFromSerialized(
    serialized: {
      id: string;
      config: BotConfig;
      stats?: Record<string, unknown>;
    }
  ): TradingBot {
    const bot = this.createBot(serialized.config, serialized.id);
    
    // Restore stats if provided
    if (serialized.stats) {
      // Stats restoration would happen here
      // This is a simplified version
    }

    return bot;
  }

  /**
   * Clone a bot with new wallet
   */
  cloneBot(sourceBot: Bot, newWalletId: string): TradingBot {
    const status = sourceBot.getStatus();
    const newConfig: BotConfig = {
      ...status.currentConfig,
      walletId: newWalletId,
    };

    return this.createBot(newConfig);
  }

  /**
   * Create bots optimized for specific target volume
   */
  createForTargetVolume(
    targetVolume24h: bigint,
    targetToken: string,
    availableWallets: string[],
    mode: 'aggressive' | 'moderate' | 'stealth' = 'moderate'
  ): TradingBot[] {
    // Calculate optimal bot count and configuration
    const { botCount, avgTradeSize, tradesPerDay } = this.calculateOptimalParams(
      targetVolume24h,
      availableWallets.length,
      mode
    );

    const actualBotCount = Math.min(botCount, availableWallets.length);

    // Calculate per-bot targets
    const volumePerBot = targetVolume24h / BigInt(actualBotCount);
    const tradesPerBot = Math.ceil(tradesPerDay / actualBotCount);

    // Base configuration
    const baseConfig: BotConfig = {
      walletId: '', // Will be set per bot
      targetToken,
      mode: 'volume',
      minTradeSize: avgTradeSize / 2n,
      maxTradeSize: avgTradeSize * 2n,
      minInterval: this.getIntervalForMode(mode).min,
      maxInterval: this.getIntervalForMode(mode).max,
      buyProbability: 0.5,
      maxDailyTrades: tradesPerBot,
      maxDailyVolume: volumePerBot,
      enabled: true,
    };

    return this.createSwarm({
      count: actualBotCount,
      baseConfig,
      mode,
      walletIds: availableWallets.slice(0, actualBotCount),
      variationFactor: mode === 'stealth' ? 0.3 : 0.2,
    });
  }

  /**
   * Calculate optimal parameters for target volume
   */
  private calculateOptimalParams(
    targetVolume24h: bigint,
    maxBots: number,
    mode: 'aggressive' | 'moderate' | 'stealth'
  ): {
    botCount: number;
    avgTradeSize: bigint;
    tradesPerDay: number;
  } {
    // Mode-specific parameters
    const modeParams = {
      aggressive: { tradesPerBotPerHour: 20, minBots: 50 },
      moderate: { tradesPerBotPerHour: 10, minBots: 30 },
      stealth: { tradesPerBotPerHour: 4, minBots: 20 },
    };

    const params = modeParams[mode];
    const tradesPerBotPerDay = params.tradesPerBotPerHour * 24;

    // Start with minimum bots for the mode
    let botCount = Math.min(params.minBots, maxBots);
    let tradesPerDay = botCount * tradesPerBotPerDay;
    let avgTradeSize = targetVolume24h / BigInt(tradesPerDay);

    // Adjust if trade size is too large or too small
    const minTradeSize = 1000000n; // 0.001 SOL in lamports
    const maxTradeSize = 1000000000n; // 1 SOL in lamports

    if (avgTradeSize > maxTradeSize) {
      // Need more bots or trades
      botCount = Math.min(
        maxBots,
        Number(targetVolume24h / (maxTradeSize * BigInt(tradesPerBotPerDay)))
      );
      tradesPerDay = botCount * tradesPerBotPerDay;
      avgTradeSize = targetVolume24h / BigInt(tradesPerDay);
    } else if (avgTradeSize < minTradeSize) {
      // Can use fewer bots
      tradesPerDay = Number(targetVolume24h / minTradeSize);
      botCount = Math.max(1, Math.ceil(tradesPerDay / tradesPerBotPerDay));
      avgTradeSize = targetVolume24h / BigInt(tradesPerDay);
    }

    return {
      botCount: Math.max(1, Math.min(botCount, maxBots)),
      avgTradeSize,
      tradesPerDay,
    };
  }

  /**
   * Get interval range for mode
   */
  private getIntervalForMode(mode: 'aggressive' | 'moderate' | 'stealth'): {
    min: number;
    max: number;
  } {
    switch (mode) {
      case 'aggressive':
        return { min: 5000, max: 60000 }; // 5s - 1min
      case 'stealth':
        return { min: 60000, max: 900000 }; // 1min - 15min
      case 'moderate':
      default:
        return { min: 15000, max: 300000 }; // 15s - 5min
    }
  }

  /**
   * Get default bot configuration
   */
  private getDefaultConfig(): Partial<BotConfig> {
    return {
      mode: 'volume',
      minTradeSize: 10000000n, // 0.01 SOL
      maxTradeSize: 100000000n, // 0.1 SOL
      minInterval: 30000, // 30 seconds
      maxInterval: 300000, // 5 minutes
      buyProbability: 0.5,
      maxDailyTrades: 100,
      maxDailyVolume: 10000000000n, // 10 SOL
      enabled: true,
      slippageBps: 100,
      ...this.config.defaultConfig,
    };
  }

  /**
   * Validate bot configuration
   */
  private validateConfig(config: BotConfig): void {
    if (!config.walletId) {
      throw new Error('Bot config must have a walletId');
    }

    if (!config.targetToken) {
      throw new Error('Bot config must have a targetToken');
    }

    if (config.minTradeSize > config.maxTradeSize) {
      throw new Error('minTradeSize cannot be greater than maxTradeSize');
    }

    if (config.minInterval > config.maxInterval) {
      throw new Error('minInterval cannot be greater than maxInterval');
    }

    if (config.buyProbability < 0 || config.buyProbability > 1) {
      throw new Error('buyProbability must be between 0 and 1');
    }

    if (config.maxDailyTrades < 1) {
      throw new Error('maxDailyTrades must be at least 1');
    }

    if (config.maxDailyVolume < config.minTradeSize) {
      throw new Error('maxDailyVolume must be at least minTradeSize');
    }
  }

  /**
   * Serialize bot for persistence
   */
  static serializeBot(bot: Bot): {
    id: string;
    config: BotConfig;
    status: ReturnType<Bot['getStatus']>;
    stats: ReturnType<Bot['getStats']>;
  } {
    return {
      id: bot.id,
      config: bot.config,
      status: bot.getStatus(),
      stats: bot.getStats(),
    };
  }
}
