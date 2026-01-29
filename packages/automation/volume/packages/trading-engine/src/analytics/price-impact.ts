/**
 * Price Impact Analytics
 * 
 * Calculate and analyze price impact for trades.
 */

import type { Route, QuoteResponse } from '../types.js';

/**
 * Price impact analysis result
 */
export interface PriceImpactAnalysis {
  /** Raw price impact percentage */
  priceImpactPct: number;
  /** Severity level */
  severity: 'negligible' | 'low' | 'medium' | 'high' | 'extreme';
  /** Warning message if impact is significant */
  warning: string | null;
  /** Recommended action */
  recommendation: string;
  /** Suggested split for large trades */
  suggestedSplits: number | null;
}

/**
 * Price impact thresholds
 */
const IMPACT_THRESHOLDS = {
  negligible: 0.1,  // < 0.1%
  low: 0.5,         // 0.1% - 0.5%
  medium: 1.0,      // 0.5% - 1%
  high: 3.0,        // 1% - 3%
  extreme: Infinity, // > 3%
};

/**
 * Price Impact Calculator
 */
export class PriceImpactCalculator {
  /**
   * Calculate price impact from input/output amounts
   */
  calculatePriceImpact(
    inputAmount: bigint,
    outputAmount: bigint,
    spotPrice: number,
    inputDecimals: number = 9,
    outputDecimals: number = 6
  ): number {
    // Calculate expected output at spot price
    const inputValue = Number(inputAmount) / Math.pow(10, inputDecimals);
    const expectedOutput = inputValue * spotPrice;
    const actualOutput = Number(outputAmount) / Math.pow(10, outputDecimals);

    // Price impact = (expected - actual) / expected * 100
    if (expectedOutput === 0) return 0;
    
    return ((expectedOutput - actualOutput) / expectedOutput) * 100;
  }

  /**
   * Calculate price impact from a route
   */
  calculateFromRoute(route: Route): number {
    return route.priceImpactPct;
  }

  /**
   * Calculate price impact from a Jupiter quote
   */
  calculateFromQuote(quote: QuoteResponse): number {
    return parseFloat(quote.priceImpactPct);
  }

  /**
   * Analyze price impact and provide recommendations
   */
  analyzePriceImpact(impactPct: number, tradeAmount: bigint): PriceImpactAnalysis {
    const severity = this.getSeverity(impactPct);
    const warning = this.getWarning(severity, impactPct);
    const recommendation = this.getRecommendation(severity, tradeAmount);
    const suggestedSplits = this.getSuggestedSplits(severity, impactPct);

    return {
      priceImpactPct: impactPct,
      severity,
      warning,
      recommendation,
      suggestedSplits,
    };
  }

  /**
   * Get severity level from impact percentage
   */
  private getSeverity(impactPct: number): PriceImpactAnalysis['severity'] {
    const abs = Math.abs(impactPct);
    
    if (abs < IMPACT_THRESHOLDS.negligible) return 'negligible';
    if (abs < IMPACT_THRESHOLDS.low) return 'low';
    if (abs < IMPACT_THRESHOLDS.medium) return 'medium';
    if (abs < IMPACT_THRESHOLDS.high) return 'high';
    return 'extreme';
  }

  /**
   * Get warning message
   */
  private getWarning(severity: PriceImpactAnalysis['severity'], impactPct: number): string | null {
    switch (severity) {
      case 'negligible':
      case 'low':
        return null;
      case 'medium':
        return `Price impact of ${impactPct.toFixed(2)}% may result in slightly less favorable execution.`;
      case 'high':
        return `Warning: High price impact of ${impactPct.toFixed(2)}%. Consider splitting your trade.`;
      case 'extreme':
        return `⚠️ Extreme price impact of ${impactPct.toFixed(2)}%! This trade will significantly move the market. Split into smaller trades.`;
    }
  }

  /**
   * Get recommendation
   */
  private getRecommendation(severity: PriceImpactAnalysis['severity'], _amount: bigint): string {
    switch (severity) {
      case 'negligible':
        return 'Proceed with trade - minimal price impact.';
      case 'low':
        return 'Proceed with trade - acceptable price impact.';
      case 'medium':
        return 'Consider using a limit order or splitting the trade.';
      case 'high':
        return 'Strongly recommend splitting into 2-4 smaller trades.';
      case 'extreme':
        return 'Split into 5+ smaller trades or use TWAP execution.';
    }
  }

  /**
   * Get suggested number of splits
   */
  private getSuggestedSplits(severity: PriceImpactAnalysis['severity'], impactPct: number): number | null {
    switch (severity) {
      case 'negligible':
      case 'low':
        return null;
      case 'medium':
        return 2;
      case 'high':
        return Math.ceil(impactPct / 0.5); // Aim for ~0.5% per trade
      case 'extreme':
        return Math.min(Math.ceil(impactPct / 0.3), 20); // Aim for ~0.3% per trade, max 20 splits
    }
  }

  /**
   * Calculate cumulative impact for multiple trades
   */
  calculateCumulativeImpact(trades: Array<{ amount: bigint; priceImpact: number }>): number {
    // Cumulative impact is not simply additive
    // Use compounding formula: (1 + i1) * (1 + i2) - 1
    let cumulative = 1;
    
    for (const trade of trades) {
      cumulative *= (1 + trade.priceImpact / 100);
    }
    
    return (cumulative - 1) * 100;
  }

  /**
   * Estimate optimal trade size for target impact
   */
  estimateOptimalSize(
    availableLiquidity: bigint,
    targetImpactPct: number = 0.5
  ): bigint {
    // Simple heuristic: trade size proportional to liquidity depth
    // For constant product AMM: impact ≈ amount / (2 * reserve)
    // So amount ≈ impact * 2 * reserve
    const factor = BigInt(Math.floor(targetImpactPct * 2 * 100));
    return (availableLiquidity * factor) / 10000n;
  }
}

/**
 * Singleton instance
 */
export const priceImpactCalculator = new PriceImpactCalculator();
