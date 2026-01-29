/**
 * Liquidity Analytics
 * 
 * Analyze liquidity depth and pool health across DEXs.
 */

import type {
  RaydiumPoolInfo,
  RaydiumCLMMPoolInfo,
  WhirlpoolInfo,
  BondingCurveState,
} from '../types.js';

/**
 * Liquidity depth analysis
 */
export interface LiquidityDepth {
  /** Total value locked in USD */
  tvlUsd: number;
  /** Liquidity available at 1% price impact */
  depth1Percent: bigint;
  /** Liquidity available at 2% price impact */
  depth2Percent: bigint;
  /** Liquidity available at 5% price impact */
  depth5Percent: bigint;
  /** Bid-ask spread in basis points */
  spreadBps: number;
  /** Liquidity health score (0-100) */
  healthScore: number;
}

/**
 * Pool comparison result
 */
export interface PoolComparison {
  pools: Array<{
    source: string;
    address: string;
    tvl: number;
    fee: number;
    depth: LiquidityDepth;
    recommended: boolean;
  }>;
  bestPool: string;
  reason: string;
}

/**
 * Liquidity Analyzer
 */
export class LiquidityAnalyzer {
  /**
   * Analyze Raydium AMM pool liquidity
   */
  analyzeRaydiumPool(pool: RaydiumPoolInfo, tokenPriceUsd: number): LiquidityDepth {
    // Calculate TVL
    const baseValue = Number(pool.baseReserve) / Math.pow(10, pool.baseDecimals);
    const quoteValue = Number(pool.quoteReserve) / Math.pow(10, pool.quoteDecimals);
    const tvlUsd = (baseValue + quoteValue) * tokenPriceUsd;
    
    return {
      tvlUsd,
      depth1Percent: this.calculateDepthAtImpact(pool.baseReserve, 0.01),
      depth2Percent: this.calculateDepthAtImpact(pool.baseReserve, 0.02),
      depth5Percent: this.calculateDepthAtImpact(pool.baseReserve, 0.05),
      spreadBps: pool.swapFeeNumerator * 10000 / pool.swapFeeDenominator,
      healthScore: this.calculateHealthScore(tvlUsd, pool.volume24h ?? 0),
    };
  }

  /**
   * Analyze Raydium CLMM pool liquidity
   */
  analyzeRaydiumCLMMPool(pool: RaydiumCLMMPoolInfo, tokenPriceUsd: number): LiquidityDepth {
    const tvlUsd = pool.tvl ?? 0;
    
    // For CLMM, liquidity is concentrated - use TVL as proxy
    const depth1 = BigInt(Math.floor(tvlUsd * 0.1 / tokenPriceUsd * 1e9));
    const depth2 = BigInt(Math.floor(tvlUsd * 0.2 / tokenPriceUsd * 1e9));
    const depth5 = BigInt(Math.floor(tvlUsd * 0.5 / tokenPriceUsd * 1e9));

    return {
      tvlUsd,
      depth1Percent: depth1,
      depth2Percent: depth2,
      depth5Percent: depth5,
      spreadBps: pool.feeRate,
      healthScore: this.calculateHealthScore(tvlUsd, pool.volume24h ?? 0),
    };
  }

  /**
   * Analyze Orca Whirlpool liquidity
   */
  analyzeWhirlpool(pool: WhirlpoolInfo, tokenPriceUsd: number): LiquidityDepth {
    const tvlUsd = pool.tvl ?? 0;

    // Similar to CLMM analysis
    const depth1 = BigInt(Math.floor(tvlUsd * 0.1 / tokenPriceUsd * 1e9));
    const depth2 = BigInt(Math.floor(tvlUsd * 0.2 / tokenPriceUsd * 1e9));
    const depth5 = BigInt(Math.floor(tvlUsd * 0.5 / tokenPriceUsd * 1e9));

    return {
      tvlUsd,
      depth1Percent: depth1,
      depth2Percent: depth2,
      depth5Percent: depth5,
      spreadBps: pool.feeRate / 100, // Convert from hundredths
      healthScore: this.calculateHealthScore(tvlUsd, pool.volume24h ?? 0),
    };
  }

  /**
   * Analyze PumpFun bonding curve liquidity
   */
  analyzeBondingCurve(state: BondingCurveState, tokenPriceUsd: number): LiquidityDepth {
    // PumpFun TVL is based on real SOL reserves
    const tvlUsd = Number(state.realSolReserves) / 1e9 * tokenPriceUsd;

    return {
      tvlUsd,
      depth1Percent: state.realSolReserves / 100n,
      depth2Percent: state.realSolReserves / 50n,
      depth5Percent: state.realSolReserves / 20n,
      spreadBps: 100, // 1% PumpFun fee
      healthScore: this.calculateBondingCurveHealth(state),
    };
  }

  /**
   * Calculate depth at a given price impact
   * For constant product AMM: trade_size ≈ reserve * impact
   */
  private calculateDepthAtImpact(reserve: bigint, impact: number): bigint {
    return BigInt(Math.floor(Number(reserve) * impact));
  }

  /**
   * Calculate pool health score (0-100)
   */
  private calculateHealthScore(tvlUsd: number, volume24h: number): number {
    // Higher TVL = better (max 50 points)
    const tvlScore = Math.min(tvlUsd / 100000, 1) * 50;

    // Volume/TVL ratio (utilization) = good sign (max 30 points)
    const utilization = tvlUsd > 0 ? volume24h / tvlUsd : 0;
    const utilizationScore = Math.min(utilization, 1) * 30;

    // Base score for existing (20 points)
    const baseScore = 20;

    return Math.round(tvlScore + utilizationScore + baseScore);
  }

  /**
   * Calculate bonding curve health
   */
  private calculateBondingCurveHealth(state: BondingCurveState): number {
    if (state.complete) {
      return 0; // Migrated, not tradeable on bonding curve
    }

    // Progress towards migration (0-100%)
    const progress = state.migrationProgress;

    // Higher progress = lower health (approaching migration)
    // But some progress shows activity
    if (progress > 90) return 30;
    if (progress > 70) return 50;
    if (progress > 50) return 70;
    if (progress > 20) return 85;
    return 100;
  }

  /**
   * Compare liquidity across multiple pools
   */
  comparePools(
    pools: Array<{
      source: 'raydium' | 'raydium-clmm' | 'orca' | 'pumpfun';
      address: string;
      data: RaydiumPoolInfo | RaydiumCLMMPoolInfo | WhirlpoolInfo | BondingCurveState;
    }>,
    tokenPriceUsd: number
  ): PoolComparison {
    const analyzed = pools.map(pool => {
      let depth: LiquidityDepth;
      let fee: number;

      switch (pool.source) {
        case 'raydium':
          depth = this.analyzeRaydiumPool(pool.data as RaydiumPoolInfo, tokenPriceUsd);
          fee = (pool.data as RaydiumPoolInfo).swapFeeNumerator * 10000 / 
                (pool.data as RaydiumPoolInfo).swapFeeDenominator;
          break;
        case 'raydium-clmm':
          depth = this.analyzeRaydiumCLMMPool(pool.data as RaydiumCLMMPoolInfo, tokenPriceUsd);
          fee = (pool.data as RaydiumCLMMPoolInfo).feeRate;
          break;
        case 'orca':
          depth = this.analyzeWhirlpool(pool.data as WhirlpoolInfo, tokenPriceUsd);
          fee = (pool.data as WhirlpoolInfo).feeRate / 100;
          break;
        case 'pumpfun':
          depth = this.analyzeBondingCurve(pool.data as BondingCurveState, tokenPriceUsd);
          fee = 100; // 1%
          break;
      }

      return {
        source: pool.source,
        address: pool.address,
        tvl: depth.tvlUsd,
        fee,
        depth,
        recommended: false,
      };
    });

    // Sort by health score, then TVL
    analyzed.sort((a, b) => {
      const healthDiff = b.depth.healthScore - a.depth.healthScore;
      if (healthDiff !== 0) return healthDiff;
      return b.tvl - a.tvl;
    });

    // Mark best as recommended
    if (analyzed.length > 0) {
      analyzed[0]!.recommended = true;
    }

    const best = analyzed[0];
    const reason = best
      ? `Highest health score (${best.depth.healthScore}) with $${best.tvl.toLocaleString()} TVL`
      : 'No pools available';

    return {
      pools: analyzed,
      bestPool: best?.address ?? '',
      reason,
    };
  }

  /**
   * Calculate overall market liquidity score
   */
  calculateMarketLiquidityScore(depths: LiquidityDepth[]): {
    score: number;
    grade: 'A' | 'B' | 'C' | 'D' | 'F';
    recommendation: string;
  } {
    if (depths.length === 0) {
      return {
        score: 0,
        grade: 'F',
        recommendation: 'No liquidity pools found. Trading not recommended.',
      };
    }

    // Average health score
    const avgHealth = depths.reduce((sum, d) => sum + d.healthScore, 0) / depths.length;
    
    // Total TVL
    const totalTvl = depths.reduce((sum, d) => sum + d.tvlUsd, 0);

    // Combined score
    const score = Math.round(
      avgHealth * 0.6 + // Health weight
      Math.min(totalTvl / 100000, 100) * 0.4 // TVL weight (cap at $100k = 100)
    );

    let grade: 'A' | 'B' | 'C' | 'D' | 'F';
    let recommendation: string;

    if (score >= 80) {
      grade = 'A';
      recommendation = 'Excellent liquidity. Large trades supported with minimal impact.';
    } else if (score >= 60) {
      grade = 'B';
      recommendation = 'Good liquidity. Consider splitting very large trades.';
    } else if (score >= 40) {
      grade = 'C';
      recommendation = 'Moderate liquidity. Split trades over $10k for best execution.';
    } else if (score >= 20) {
      grade = 'D';
      recommendation = 'Low liquidity. Use limit orders and small trade sizes.';
    } else {
      grade = 'F';
      recommendation = 'Very low liquidity. High risk of slippage. Trade with extreme caution.';
    }

    return { score, grade, recommendation };
  }
}

/**
 * Singleton instance
 */
export const liquidityAnalyzer = new LiquidityAnalyzer();
