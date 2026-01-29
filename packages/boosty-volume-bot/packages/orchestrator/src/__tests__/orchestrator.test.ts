/**
 * Unit tests for the Orchestrator package
 */

import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import {
  RandomizationEngine,
  DEFAULT_RANDOMIZATION_CONFIG,
  AntiDetectionEngine,
  DEFAULT_ANTI_DETECTION_CONFIG,
  createWalletFingerprint,
  uniformRandom,
  gaussianRandom,
  poissonInterval,
  shuffleArray,
} from '../randomization/index.js';
import {
  BotFactory,
  TradingBot,
  BotCoordinator,
  getProfile,
  BEHAVIOR_PROFILES,
  selectProfilesForSwarm,
  isWithinActiveHours,
} from '../bots/index.js';
import type { BotConfig, Task } from '../types.js';

describe('Randomization Engine', () => {
  let engine: RandomizationEngine;

  beforeEach(() => {
    engine = new RandomizationEngine();
  });

  describe('getNextInterval', () => {
    it('should return interval within bounds for uniform distribution', () => {
      const min = 1000;
      const max = 5000;
      
      for (let i = 0; i < 100; i++) {
        const interval = engine.getNextInterval(min, max, 'uniform');
        expect(interval).toBeGreaterThanOrEqual(min);
        // Allow for jitter
        expect(interval).toBeLessThanOrEqual(max * 1.5);
      }
    });

    it('should return interval within bounds for poisson distribution', () => {
      const min = 1000;
      const max = 5000;
      
      for (let i = 0; i < 100; i++) {
        const interval = engine.getNextInterval(min, max, 'poisson');
        expect(interval).toBeGreaterThanOrEqual(min);
      }
    });

    it('should return interval within bounds for gaussian distribution', () => {
      const min = 1000;
      const max = 5000;
      
      for (let i = 0; i < 100; i++) {
        const interval = engine.getNextInterval(min, max, 'gaussian');
        expect(interval).toBeGreaterThanOrEqual(min);
      }
    });
  });

  describe('getTradeSize', () => {
    it('should return size within bounds for uniform distribution', () => {
      const min = 1000000n;
      const max = 10000000n;
      
      for (let i = 0; i < 100; i++) {
        const size = engine.getTradeSize(min, max, 'uniform');
        expect(size).toBeGreaterThanOrEqual(min);
        expect(size).toBeLessThanOrEqual(max);
      }
    });

    it('should return size within bounds for skewed-low distribution', () => {
      const min = 1000000n;
      const max = 10000000n;
      
      for (let i = 0; i < 100; i++) {
        const size = engine.getTradeSize(min, max, 'skewed-low');
        expect(size).toBeGreaterThanOrEqual(min);
        expect(size).toBeLessThanOrEqual(max);
      }
    });
  });

  describe('shouldBuy', () => {
    it('should return boolean based on probability', () => {
      let buyCount = 0;
      const iterations = 10000;
      const probability = 0.7;

      for (let i = 0; i < iterations; i++) {
        if (engine.shouldBuy(probability)) {
          buyCount++;
        }
      }

      // Should be approximately 70% with some variance
      const ratio = buyCount / iterations;
      expect(ratio).toBeGreaterThan(0.6);
      expect(ratio).toBeLessThan(0.8);
    });
  });

  describe('shuffleWallets', () => {
    it('should return array with same elements', () => {
      const wallets = ['w1', 'w2', 'w3', 'w4', 'w5'];
      const shuffled = engine.shuffleWallets(wallets);
      
      expect(shuffled).toHaveLength(wallets.length);
      expect(shuffled.sort()).toEqual(wallets.sort());
    });
  });

  describe('addJitter', () => {
    it('should add jitter within bounds', () => {
      const value = 1000;
      const jitterPercent = 20;
      
      for (let i = 0; i < 100; i++) {
        const result = engine.addJitter(value, jitterPercent);
        expect(result).toBeGreaterThanOrEqual(value * 0.8);
        expect(result).toBeLessThanOrEqual(value * 1.2);
      }
    });
  });
});

describe('Anti-Detection Engine', () => {
  let engine: AntiDetectionEngine;

  beforeEach(() => {
    engine = new AntiDetectionEngine();
  });

  describe('recordTrade', () => {
    it('should track trades', () => {
      engine.recordTrade('wallet1', 'buy', 1000n);
      engine.recordTrade('wallet2', 'sell', 2000n);
      
      const stats = engine.getStats();
      expect(stats.totalTrackedTrades).toBe(2);
    });
  });

  describe('shouldFlipDirection', () => {
    it('should return true after many consecutive same-direction trades', () => {
      // Fill with same direction trades
      for (let i = 0; i < 10; i++) {
        engine.recordTrade(`wallet${i}`, 'buy', BigInt(1000 * i));
      }
      
      expect(engine.shouldFlipDirection()).toBe(true);
    });
  });

  describe('analyzeActivityPattern', () => {
    it('should not report suspicious for few trades', () => {
      engine.recordTrade('wallet1', 'buy', 1000n);
      
      const analysis = engine.analyzeActivityPattern();
      expect(analysis.suspicious).toBe(false);
    });
  });
});

describe('Wallet Fingerprint', () => {
  it('should create deterministic fingerprint', () => {
    const fp1 = createWalletFingerprint('wallet123');
    const fp2 = createWalletFingerprint('wallet123');
    
    expect(fp1.timingBias).toBe(fp2.timingBias);
    expect(fp1.sizeBias).toBe(fp2.sizeBias);
    expect(fp1.buyBias).toBe(fp2.buyBias);
  });

  it('should create different fingerprints for different wallets', () => {
    const fp1 = createWalletFingerprint('wallet123');
    const fp2 = createWalletFingerprint('wallet456');
    
    // Very unlikely to be exactly the same
    expect(
      fp1.timingBias !== fp2.timingBias ||
      fp1.sizeBias !== fp2.sizeBias ||
      fp1.buyBias !== fp2.buyBias
    ).toBe(true);
  });
});

describe('Distribution Functions', () => {
  describe('uniformRandom', () => {
    it('should return values within range', () => {
      for (let i = 0; i < 100; i++) {
        const value = uniformRandom(10, 20);
        expect(value).toBeGreaterThanOrEqual(10);
        expect(value).toBeLessThanOrEqual(20);
      }
    });
  });

  describe('gaussianRandom', () => {
    it('should return values centered around mean', () => {
      const values: number[] = [];
      for (let i = 0; i < 1000; i++) {
        values.push(gaussianRandom(100, 10));
      }
      
      const mean = values.reduce((a, b) => a + b, 0) / values.length;
      expect(mean).toBeGreaterThan(90);
      expect(mean).toBeLessThan(110);
    });
  });

  describe('shuffleArray', () => {
    it('should shuffle array without losing elements', () => {
      const arr = [1, 2, 3, 4, 5];
      const shuffled = shuffleArray(arr);
      
      expect(shuffled).toHaveLength(arr.length);
      expect(shuffled.sort()).toEqual(arr.sort());
    });
  });
});

describe('Behavior Profiles', () => {
  describe('getProfile', () => {
    it('should return default profile for unknown name', () => {
      const profile = getProfile('unknown');
      expect(profile.name).toBe('default');
    });

    it('should return named profiles', () => {
      expect(getProfile('aggressive').name).toBe('aggressive');
      expect(getProfile('stealth').name).toBe('stealth');
      expect(getProfile('whale').name).toBe('whale');
    });
  });

  describe('selectProfilesForSwarm', () => {
    it('should return correct number of profiles', () => {
      const profiles = selectProfilesForSwarm(10, 'moderate');
      expect(profiles).toHaveLength(10);
    });

    it('should return profiles with varied variance factors', () => {
      const profiles = selectProfilesForSwarm(20, 'moderate');
      const factors = profiles.map(p => p.varianceFactor);
      const unique = new Set(factors);
      
      // Should have some variety
      expect(unique.size).toBeGreaterThan(1);
    });
  });

  describe('isWithinActiveHours', () => {
    it('should return true during active hours', () => {
      const profile = BEHAVIOR_PROFILES['default'];
      const activeDate = new Date();
      activeDate.setHours(12); // Noon
      
      expect(isWithinActiveHours(profile, activeDate)).toBe(true);
    });
  });
});

describe('Bot Factory', () => {
  let factory: BotFactory;
  const mockEnqueue = vi.fn().mockResolvedValue('task-id');

  beforeEach(() => {
    factory = new BotFactory({
      defaultConfig: {},
      randomization: new RandomizationEngine(),
      enqueueTask: mockEnqueue,
    });
    vi.clearAllMocks();
  });

  describe('createBot', () => {
    it('should create a bot with valid config', () => {
      const config: BotConfig = {
        walletId: 'wallet1',
        targetToken: 'token1',
        mode: 'volume',
        minTradeSize: 1000n,
        maxTradeSize: 10000n,
        minInterval: 5000,
        maxInterval: 30000,
        buyProbability: 0.5,
        maxDailyTrades: 100,
        maxDailyVolume: 1000000n,
        enabled: true,
      };

      const bot = factory.createBot(config);
      
      expect(bot).toBeDefined();
      expect(bot.config.walletId).toBe('wallet1');
      expect(bot.config.targetToken).toBe('token1');
    });

    it('should throw for invalid config', () => {
      const invalidConfig = {
        // Missing walletId
        targetToken: 'token1',
      } as BotConfig;

      expect(() => factory.createBot(invalidConfig)).toThrow();
    });
  });

  describe('createSwarm', () => {
    it('should create multiple bots', () => {
      const baseConfig: BotConfig = {
        walletId: 'base',
        targetToken: 'token1',
        mode: 'volume',
        minTradeSize: 1000n,
        maxTradeSize: 10000n,
        minInterval: 5000,
        maxInterval: 30000,
        buyProbability: 0.5,
        maxDailyTrades: 100,
        maxDailyVolume: 1000000n,
        enabled: true,
      };

      const bots = factory.createSwarm({
        count: 5,
        baseConfig,
        mode: 'moderate',
      });

      expect(bots).toHaveLength(5);
      
      // Each bot should have unique wallet ID
      const walletIds = bots.map(b => b.config.walletId);
      const uniqueIds = new Set(walletIds);
      expect(uniqueIds.size).toBe(5);
    });
  });
});

describe('Bot Coordinator', () => {
  let coordinator: BotCoordinator;
  const mockEnqueue = vi.fn().mockResolvedValue('task-id');

  beforeEach(() => {
    coordinator = new BotCoordinator({
      maxConcurrentBots: 100,
      enqueueTask: mockEnqueue,
    });
    vi.clearAllMocks();
  });

  afterEach(async () => {
    await coordinator.shutdown();
  });

  describe('createBot', () => {
    it('should create and register a bot', async () => {
      const config: BotConfig = {
        walletId: 'wallet1',
        targetToken: 'token1',
        mode: 'volume',
        minTradeSize: 1000n,
        maxTradeSize: 10000n,
        minInterval: 5000,
        maxInterval: 30000,
        buyProbability: 0.5,
        maxDailyTrades: 100,
        maxDailyVolume: 1000000n,
        enabled: true,
      };

      const bot = await coordinator.createBot(config);
      
      expect(bot).toBeDefined();
      expect(coordinator.getTotalCount()).toBe(1);
    });
  });

  describe('createBotSwarm', () => {
    it('should create multiple bots', async () => {
      const config: BotConfig = {
        walletId: 'wallet',
        targetToken: 'token1',
        mode: 'volume',
        minTradeSize: 1000n,
        maxTradeSize: 10000n,
        minInterval: 5000,
        maxInterval: 30000,
        buyProbability: 0.5,
        maxDailyTrades: 100,
        maxDailyVolume: 1000000n,
        enabled: true,
      };

      const bots = await coordinator.createBotSwarm(5, config);
      
      expect(bots).toHaveLength(5);
      expect(coordinator.getTotalCount()).toBe(5);
    });
  });

  describe('getAggregateStats', () => {
    it('should return aggregate statistics', async () => {
      const config: BotConfig = {
        walletId: 'wallet',
        targetToken: 'token1',
        mode: 'volume',
        minTradeSize: 1000n,
        maxTradeSize: 10000n,
        minInterval: 5000,
        maxInterval: 30000,
        buyProbability: 0.5,
        maxDailyTrades: 100,
        maxDailyVolume: 1000000n,
        enabled: true,
      };

      await coordinator.createBotSwarm(3, config);
      
      const stats = coordinator.getAggregateStats();
      
      expect(stats.totalBots).toBe(3);
      expect(stats.runningBots).toBe(0);
      expect(stats.totalTrades).toBe(0);
    });
  });
});
