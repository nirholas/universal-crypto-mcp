/**
 * Anti-Detection Module
 * Implements strategies to avoid pattern detection and correlation analysis
 */

import { shuffleArray, addJitter, uniformRandomInt, gaussianRandom } from './distributions.js';

/**
 * Configuration for anti-detection measures
 */
export interface AntiDetectionConfig {
  /** Enable wallet activity variance */
  enableActivityVariance: boolean;
  /** Minimum wallets between same-wallet trades */
  minWalletGap: number;
  /** Enable time-based pattern breaking */
  enableTimingVariance: boolean;
  /** Maximum consecutive same-direction trades */
  maxConsecutiveSameDirection: number;
  /** Enable size pattern breaking */
  enableSizeVariance: boolean;
  /** Cooldown between similar-sized trades (ms) */
  similarSizeCooldown: number;
}

/**
 * Default anti-detection configuration
 */
export const DEFAULT_ANTI_DETECTION_CONFIG: AntiDetectionConfig = {
  enableActivityVariance: true,
  minWalletGap: 3,
  enableTimingVariance: true,
  maxConsecutiveSameDirection: 4,
  enableSizeVariance: true,
  similarSizeCooldown: 30000, // 30 seconds
};

/**
 * Trade history for pattern analysis
 */
interface TradeHistoryEntry {
  walletId: string;
  direction: 'buy' | 'sell';
  size: bigint;
  timestamp: number;
}

/**
 * AntiDetectionEngine - Manages strategies to avoid detection
 */
export class AntiDetectionEngine {
  private config: AntiDetectionConfig;
  private recentTrades: TradeHistoryEntry[] = [];
  private walletLastUsed: Map<string, number> = new Map();
  private consecutiveSameDirection: number = 0;
  private lastDirection: 'buy' | 'sell' | null = null;
  private readonly maxHistorySize = 1000;

  constructor(config: Partial<AntiDetectionConfig> = {}) {
    this.config = { ...DEFAULT_ANTI_DETECTION_CONFIG, ...config };
  }

  /**
   * Record a trade for pattern analysis
   */
  recordTrade(walletId: string, direction: 'buy' | 'sell', size: bigint): void {
    const entry: TradeHistoryEntry = {
      walletId,
      direction,
      size,
      timestamp: Date.now(),
    };

    this.recentTrades.push(entry);
    if (this.recentTrades.length > this.maxHistorySize) {
      this.recentTrades.shift();
    }

    this.walletLastUsed.set(walletId, Date.now());

    // Track consecutive same-direction trades
    if (direction === this.lastDirection) {
      this.consecutiveSameDirection++;
    } else {
      this.consecutiveSameDirection = 1;
      this.lastDirection = direction;
    }
  }

  /**
   * Check if a wallet should be used based on anti-detection rules
   */
  shouldUseWallet(walletId: string, availableWallets: string[]): boolean {
    if (!this.config.enableActivityVariance) return true;

    const lastUsed = this.walletLastUsed.get(walletId);
    if (!lastUsed) return true;

    // Count how many unique wallets have been used since this wallet
    const walletsSinceLastUse = this.recentTrades
      .filter(t => t.timestamp > lastUsed)
      .reduce((set, t) => set.add(t.walletId), new Set<string>());

    return walletsSinceLastUse.size >= this.config.minWalletGap;
  }

  /**
   * Get optimal wallet order to avoid patterns
   */
  getOptimalWalletOrder(wallets: string[]): string[] {
    if (!this.config.enableActivityVariance) {
      return shuffleArray(wallets);
    }

    // Sort by time since last use (oldest first)
    const sorted = [...wallets].sort((a, b) => {
      const aTime = this.walletLastUsed.get(a) ?? 0;
      const bTime = this.walletLastUsed.get(b) ?? 0;
      return aTime - bTime;
    });

    // Add some randomization to avoid predictable ordering
    const result: string[] = [];
    const groups = this.chunkArray(sorted, Math.ceil(sorted.length / 4));
    
    for (const group of shuffleArray(groups)) {
      result.push(...shuffleArray(group));
    }

    return result;
  }

  /**
   * Should we flip the trade direction to break patterns?
   */
  shouldFlipDirection(): boolean {
    if (!this.config.enableTimingVariance) return false;
    
    return this.consecutiveSameDirection >= this.config.maxConsecutiveSameDirection;
  }

  /**
   * Adjust trade size to avoid patterns
   */
  adjustTradeSize(size: bigint, minSize: bigint, maxSize: bigint): bigint {
    if (!this.config.enableSizeVariance) return size;

    // Check recent trades for similar sizes
    const now = Date.now();
    const recentSimilarTrades = this.recentTrades.filter(t => {
      if (now - t.timestamp > this.config.similarSizeCooldown) return false;
      const diff = size > t.size ? size - t.size : t.size - size;
      const threshold = size / 10n; // 10% similarity threshold
      return diff < threshold;
    });

    // If similar sizes found, add more variance
    if (recentSimilarTrades.length > 2) {
      const variance = Number(maxSize - minSize) / 4;
      const adjustment = BigInt(Math.floor(gaussianRandom(0, variance)));
      let newSize = size + adjustment;
      
      // Clamp to bounds
      if (newSize < minSize) newSize = minSize;
      if (newSize > maxSize) newSize = maxSize;
      
      return newSize;
    }

    return size;
  }

  /**
   * Get timing adjustment to avoid patterns
   */
  getTimingAdjustment(baseInterval: number): number {
    if (!this.config.enableTimingVariance) return baseInterval;

    // Analyze recent trade intervals
    const intervals: number[] = [];
    for (let i = 1; i < Math.min(this.recentTrades.length, 20); i++) {
      const current = this.recentTrades[i];
      const prev = this.recentTrades[i - 1];
      if (current && prev) {
        intervals.push(current.timestamp - prev.timestamp);
      }
    }

    if (intervals.length < 5) return baseInterval;

    // Calculate average interval
    const avgInterval = intervals.reduce((a, b) => a + b, 0) / intervals.length;
    
    // If base interval is close to average, add extra variance
    if (Math.abs(baseInterval - avgInterval) < avgInterval * 0.2) {
      return addJitter(baseInterval, 30); // Add up to 30% jitter
    }

    return addJitter(baseInterval, 15); // Normal 15% jitter
  }

  /**
   * Generate a natural-looking burst of trades
   */
  generateBurstPattern(
    baseCount: number,
    minInterval: number,
    maxInterval: number
  ): number[] {
    const intervals: number[] = [];
    const count = uniformRandomInt(
      Math.floor(baseCount * 0.7),
      Math.ceil(baseCount * 1.3)
    );

    // Start with some quick trades
    const burstPhase = Math.floor(count * 0.4);
    for (let i = 0; i < burstPhase; i++) {
      intervals.push(
        uniformRandomInt(minInterval, minInterval + (maxInterval - minInterval) * 0.3)
      );
    }

    // Then slow down
    for (let i = burstPhase; i < count; i++) {
      intervals.push(
        uniformRandomInt(
          minInterval + (maxInterval - minInterval) * 0.4,
          maxInterval
        )
      );
    }

    // Shuffle a bit to avoid obvious pattern
    for (let i = 0; i < intervals.length - 1; i += 2) {
      if (Math.random() > 0.6) {
        const a = intervals[i]!;
        const b = intervals[i + 1]!;
        intervals[i] = b;
        intervals[i + 1] = a;
      }
    }

    return intervals;
  }

  /**
   * Check if current activity looks suspicious
   */
  analyzeActivityPattern(): {
    suspicious: boolean;
    reasons: string[];
    recommendations: string[];
  } {
    const reasons: string[] = [];
    const recommendations: string[] = [];

    if (this.recentTrades.length < 10) {
      return { suspicious: false, reasons: [], recommendations: [] };
    }

    // Check for too-regular intervals
    const intervals: number[] = [];
    for (let i = 1; i < this.recentTrades.length; i++) {
      const current = this.recentTrades[i];
      const prev = this.recentTrades[i - 1];
      if (current && prev) {
        intervals.push(current.timestamp - prev.timestamp);
      }
    }
    
    const avgInterval = intervals.reduce((a, b) => a + b, 0) / intervals.length;
    const variance = intervals.reduce((sum, i) => sum + Math.pow(i - avgInterval, 2), 0) / intervals.length;
    const stdDev = Math.sqrt(variance);
    const coefficientOfVariation = stdDev / avgInterval;

    if (coefficientOfVariation < 0.2) {
      reasons.push('Trade intervals are too regular');
      recommendations.push('Increase timing variance');
    }

    // Check for wallet overuse
    const walletCounts = new Map<string, number>();
    this.recentTrades.slice(-50).forEach(t => {
      walletCounts.set(t.walletId, (walletCounts.get(t.walletId) ?? 0) + 1);
    });
    
    const maxWalletUse = Math.max(...walletCounts.values());
    if (maxWalletUse > 10) {
      reasons.push('Some wallets are being used too frequently');
      recommendations.push('Distribute activity across more wallets');
    }

    // Check for size patterns
    const sizes = this.recentTrades.slice(-20).map(t => t.size);
    const uniqueSizes = new Set(sizes.map(s => s.toString())).size;
    if (uniqueSizes < sizes.length * 0.5) {
      reasons.push('Trade sizes show repetitive patterns');
      recommendations.push('Increase size variance');
    }

    // Check buy/sell ratio
    const recent = this.recentTrades.slice(-50);
    const buyCount = recent.filter(t => t.direction === 'buy').length;
    const ratio = buyCount / recent.length;
    if (ratio > 0.85 || ratio < 0.15) {
      reasons.push('Buy/sell ratio is extremely skewed');
      recommendations.push('Balance buy and sell operations');
    }

    return {
      suspicious: reasons.length > 0,
      reasons,
      recommendations,
    };
  }

  /**
   * Get recommended wait time before next trade
   */
  getRecommendedCooldown(): number {
    const analysis = this.analyzeActivityPattern();
    
    if (analysis.suspicious) {
      // Add extra cooldown if patterns detected
      return uniformRandomInt(5000, 15000);
    }

    return 0;
  }

  /**
   * Reset tracking state
   */
  reset(): void {
    this.recentTrades = [];
    this.walletLastUsed.clear();
    this.consecutiveSameDirection = 0;
    this.lastDirection = null;
  }

  /**
   * Helper: chunk array into smaller arrays
   */
  private chunkArray<T>(array: T[], chunkSize: number): T[][] {
    const chunks: T[][] = [];
    for (let i = 0; i < array.length; i += chunkSize) {
      chunks.push(array.slice(i, i + chunkSize));
    }
    return chunks;
  }

  /**
   * Get current stats
   */
  getStats(): {
    totalTrackedTrades: number;
    uniqueWallets: number;
    consecutiveSameDirection: number;
    lastDirection: string | null;
  } {
    return {
      totalTrackedTrades: this.recentTrades.length,
      uniqueWallets: this.walletLastUsed.size,
      consecutiveSameDirection: this.consecutiveSameDirection,
      lastDirection: this.lastDirection,
    };
  }
}

/**
 * Create fingerprint variance for wallet behavior
 * Makes each wallet appear to have unique trading characteristics
 */
export function createWalletFingerprint(walletId: string): {
  timingBias: number;
  sizeBias: number;
  buyBias: number;
  activityLevel: number;
} {
  // Use wallet ID to generate deterministic but varied characteristics
  let hash = 0;
  for (let i = 0; i < walletId.length; i++) {
    const char = walletId.charCodeAt(i);
    hash = ((hash << 5) - hash) + char;
    hash = hash & hash;
  }

  const pseudoRandom = (seed: number): number => {
    const x = Math.sin(seed) * 10000;
    return x - Math.floor(x);
  };

  return {
    timingBias: 0.7 + pseudoRandom(hash) * 0.6, // 0.7 - 1.3
    sizeBias: 0.8 + pseudoRandom(hash + 1) * 0.4, // 0.8 - 1.2
    buyBias: 0.4 + pseudoRandom(hash + 2) * 0.2, // 0.4 - 0.6
    activityLevel: 0.5 + pseudoRandom(hash + 3) * 0.5, // 0.5 - 1.0
  };
}

/**
 * Determine if activity should pause based on time of day
 * Returns true if trading should be reduced
 */
export function shouldReduceActivity(hour: number): boolean {
  // Reduce activity during very late night / early morning
  if (hour >= 2 && hour <= 5) {
    return Math.random() > 0.3; // 70% chance to skip
  }
  return false;
}

/**
 * Generate realistic-looking transaction memo/reference
 */
export function generateRealisticMemo(): string {
  const memos = [
    '', // Empty is most common
    '',
    '',
    'swap',
    'trade',
    'buy',
    'sell',
    `tx-${Date.now().toString(36)}`,
    Math.random().toString(36).substring(2, 8),
  ];
  
  return memos[Math.floor(Math.random() * memos.length)] ?? '';
}
