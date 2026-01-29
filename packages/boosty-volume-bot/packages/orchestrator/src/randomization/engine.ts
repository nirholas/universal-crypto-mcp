/**
 * Randomization Engine
 * Provides natural-looking randomization for trading patterns
 */

import {
  uniformRandom,
  uniformRandomInt,
  gaussianRandom,
  truncatedGaussian,
  poissonInterval,
  skewedRandom,
  shuffleArray,
  addJitter as distributionAddJitter,
  clamp,
  getTimeOfDayWeight,
  getDayOfWeekWeight,
} from './distributions.js';
import { 
  AntiDetectionEngine, 
  createWalletFingerprint,
  type AntiDetectionConfig 
} from './anti-detection.js';
import type { 
  RandomizationEngineInterface, 
  TimingDistribution, 
  SizeDistribution,
  RandomizationConfig 
} from '../types.js';

/**
 * Default randomization configuration
 */
export const DEFAULT_RANDOMIZATION_CONFIG: RandomizationConfig = {
  defaultTimingDistribution: 'poisson',
  defaultSizeDistribution: 'skewed-low',
  timingJitterPercent: 15,
  sizeJitterPercent: 10,
};

/**
 * RandomizationEngine - Core implementation
 */
export class RandomizationEngine implements RandomizationEngineInterface {
  private config: RandomizationConfig;
  private antiDetection: AntiDetectionEngine;
  private walletFingerprints: Map<string, ReturnType<typeof createWalletFingerprint>> = new Map();

  constructor(
    config: Partial<RandomizationConfig> = {},
    antiDetectionConfig: Partial<AntiDetectionConfig> = {}
  ) {
    this.config = { ...DEFAULT_RANDOMIZATION_CONFIG, ...config };
    this.antiDetection = new AntiDetectionEngine(antiDetectionConfig);

    // Initialize seed if provided
    if (this.config.seed !== undefined) {
      // Note: This affects Math.random globally which is generally not recommended
      // In production, consider using a seeded PRNG library
      console.warn('Seed provided but JavaScript Math.random cannot be seeded. Consider using a PRNG library.');
    }
  }

  /**
   * Get the next interval between trades
   * @param minMs - Minimum interval in milliseconds
   * @param maxMs - Maximum interval in milliseconds
   * @param distribution - Distribution type to use
   */
  getNextInterval(
    minMs: number,
    maxMs: number,
    distribution: TimingDistribution = this.config.defaultTimingDistribution
  ): number {
    let interval: number;

    switch (distribution) {
      case 'uniform':
        interval = uniformRandom(minMs, maxMs);
        break;

      case 'poisson': {
        // Convert interval range to rate
        const avgInterval = (minMs + maxMs) / 2;
        const rate = 1 / avgInterval;
        const poissonValue = poissonInterval(rate);
        interval = clamp(poissonValue, minMs, maxMs);
        break;
      }

      case 'gaussian': {
        const mean = (minMs + maxMs) / 2;
        const stdDev = (maxMs - minMs) / 4; // ~95% of values within range
        interval = truncatedGaussian(mean, stdDev, minMs, maxMs);
        break;
      }

      default:
        interval = uniformRandom(minMs, maxMs);
    }

    // Apply time-of-day adjustment
    const hour = new Date().getHours();
    const timeWeight = getTimeOfDayWeight(hour);
    
    // During low activity hours, increase intervals
    if (timeWeight < 0.5) {
      interval *= 2 - timeWeight;
    }

    // Apply anti-detection timing adjustment
    interval = this.antiDetection.getTimingAdjustment(interval);

    // Add final jitter
    interval = distributionAddJitter(interval, this.config.timingJitterPercent);

    return Math.max(minMs, Math.round(interval));
  }

  /**
   * Get a randomized trade size
   * @param min - Minimum size
   * @param max - Maximum size
   * @param distribution - Distribution type to use
   */
  getTradeSize(
    min: bigint,
    max: bigint,
    distribution: SizeDistribution = this.config.defaultSizeDistribution
  ): bigint {
    const minNum = Number(min);
    const maxNum = Number(max);
    let size: number;

    switch (distribution) {
      case 'uniform':
        size = uniformRandom(minNum, maxNum);
        break;

      case 'skewed-low': {
        // Use power law to skew towards smaller sizes
        size = skewedRandom(minNum, maxNum, 0.5);
        break;
      }

      case 'skewed-high': {
        // Use inverse power law to skew towards larger sizes
        size = skewedRandom(minNum, maxNum, 2);
        break;
      }

      default:
        size = uniformRandom(minNum, maxNum);
    }

    // Add jitter
    size = distributionAddJitter(size, this.config.sizeJitterPercent);
    
    // Clamp to bounds
    size = clamp(size, minNum, maxNum);

    // Convert to bigint and apply anti-detection adjustment
    let sizeBI = BigInt(Math.floor(size));
    sizeBI = this.antiDetection.adjustTradeSize(sizeBI, min, max);

    return sizeBI;
  }

  /**
   * Determine if the next trade should be a buy
   * @param probability - Base probability of buying (0-1)
   */
  shouldBuy(probability: number): boolean {
    // Check if we should flip direction to break patterns
    if (this.antiDetection.shouldFlipDirection()) {
      return Math.random() >= probability;
    }

    return Math.random() < probability;
  }

  /**
   * Shuffle wallets for optimal trading order
   * @param wallets - Array of wallet IDs
   */
  shuffleWallets(wallets: string[]): string[] {
    return this.antiDetection.getOptimalWalletOrder(wallets);
  }

  /**
   * Add jitter to a value
   * @param value - Base value
   * @param jitterPercent - Jitter percentage (0-100)
   */
  addJitter(value: number, jitterPercent: number): number {
    return distributionAddJitter(value, jitterPercent);
  }

  /**
   * Get a wallet-specific fingerprint for behavior variance
   * @param walletId - Wallet ID
   */
  getWalletFingerprint(walletId: string): ReturnType<typeof createWalletFingerprint> {
    let fingerprint = this.walletFingerprints.get(walletId);
    if (!fingerprint) {
      fingerprint = createWalletFingerprint(walletId);
      this.walletFingerprints.set(walletId, fingerprint);
    }
    return fingerprint;
  }

  /**
   * Get adjusted parameters for a specific wallet
   * Makes each wallet behave slightly differently
   */
  getWalletAdjustedParams(
    walletId: string,
    baseInterval: number,
    baseSize: bigint,
    baseBuyProbability: number
  ): {
    interval: number;
    size: bigint;
    buyProbability: number;
  } {
    const fingerprint = this.getWalletFingerprint(walletId);

    return {
      interval: Math.round(baseInterval * fingerprint.timingBias),
      size: BigInt(Math.floor(Number(baseSize) * fingerprint.sizeBias)),
      buyProbability: clamp(
        baseBuyProbability + (fingerprint.buyBias - 0.5) * 0.2,
        0.1,
        0.9
      ),
    };
  }

  /**
   * Get an interval with day/time awareness
   */
  getTimeAwareInterval(minMs: number, maxMs: number): number {
    const now = new Date();
    const hourWeight = getTimeOfDayWeight(now.getHours());
    const dayWeight = getDayOfWeekWeight(now.getDay());
    const combinedWeight = hourWeight * dayWeight;

    // Lower weight = less activity = longer intervals
    const adjustedMin = Math.round(minMs / combinedWeight);
    const adjustedMax = Math.round(maxMs / combinedWeight);

    return this.getNextInterval(adjustedMin, adjustedMax);
  }

  /**
   * Generate burst trade parameters
   * @param baseCount - Base number of trades
   * @param minInterval - Minimum interval
   * @param maxInterval - Maximum interval
   */
  generateBurst(
    baseCount: number,
    minInterval: number,
    maxInterval: number
  ): { intervals: number[]; sizes: number[] } {
    const intervals = this.antiDetection.generateBurstPattern(
      baseCount,
      minInterval,
      maxInterval
    );

    // Generate corresponding sizes (smaller during fast trading)
    const sizes = intervals.map((interval) => {
      // Faster trades = smaller sizes (more natural)
      const speedFactor = 1 - (maxInterval - interval) / (maxInterval - minInterval) * 0.5;
      return Math.round(speedFactor * 100);
    });

    return { intervals, sizes };
  }

  /**
   * Record a trade for anti-detection analysis
   */
  recordTrade(walletId: string, direction: 'buy' | 'sell', size: bigint): void {
    this.antiDetection.recordTrade(walletId, direction, size);
  }

  /**
   * Check if activity patterns look suspicious
   */
  analyzePatterns(): {
    suspicious: boolean;
    reasons: string[];
    recommendations: string[];
  } {
    return this.antiDetection.analyzeActivityPattern();
  }

  /**
   * Get recommended cooldown before next trade
   */
  getRecommendedCooldown(): number {
    return this.antiDetection.getRecommendedCooldown();
  }

  /**
   * Check if a wallet should be used based on recent activity
   */
  shouldUseWallet(walletId: string, availableWallets: string[]): boolean {
    return this.antiDetection.shouldUseWallet(walletId, availableWallets);
  }

  /**
   * Select random items from array with optional weights
   */
  selectRandom<T>(items: T[], count: number, weights?: number[]): T[] {
    if (count >= items.length) return shuffleArray(items);

    if (weights) {
      // Weighted selection without replacement
      const result: T[] = [];
      const remaining = [...items];
      const remainingWeights = [...weights];

      for (let i = 0; i < count; i++) {
        const totalWeight = remainingWeights.reduce((a, b) => a + b, 0);
        let random = Math.random() * totalWeight;

        for (let j = 0; j < remaining.length; j++) {
          const weight = remainingWeights[j];
          const item = remaining[j];
          if (weight === undefined || item === undefined) continue;
          
          random -= weight;
          if (random <= 0) {
            result.push(item);
            remaining.splice(j, 1);
            remainingWeights.splice(j, 1);
            break;
          }
        }
      }

      return result;
    }

    // Unweighted random selection
    const shuffled = shuffleArray(items);
    return shuffled.slice(0, count);
  }

  /**
   * Generate a realistic delay for human-like behavior
   */
  getHumanDelay(baseMs: number): number {
    // Humans have reaction time variance
    const reactionTime = gaussianRandom(200, 50);
    const thinkingTime = gaussianRandom(baseMs, baseMs * 0.3);
    return Math.max(100, Math.round(reactionTime + thinkingTime));
  }

  /**
   * Reset internal state
   */
  reset(): void {
    this.antiDetection.reset();
    this.walletFingerprints.clear();
  }

  /**
   * Get internal statistics
   */
  getStats(): {
    antiDetection: ReturnType<AntiDetectionEngine['getStats']>;
    fingerprintsGenerated: number;
  } {
    return {
      antiDetection: this.antiDetection.getStats(),
      fingerprintsGenerated: this.walletFingerprints.size,
    };
  }
}

// Export singleton for simple usage
let defaultEngine: RandomizationEngine | null = null;

export function getRandomizationEngine(
  config?: Partial<RandomizationConfig>,
  antiDetectionConfig?: Partial<AntiDetectionConfig>
): RandomizationEngine {
  if (!defaultEngine) {
    defaultEngine = new RandomizationEngine(config, antiDetectionConfig);
  }
  return defaultEngine;
}

export function resetRandomizationEngine(): void {
  defaultEngine = null;
}
