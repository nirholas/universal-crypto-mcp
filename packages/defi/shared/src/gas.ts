/**
 * Gas estimation and optimization utilities
 * 
 * Provides real-time gas price data and estimation for DeFi operations.
 */

import { type PublicClient, formatGwei, parseGwei } from "viem";

/**
 * Gas price tiers
 */
export interface GasPrices {
  slow: bigint;
  standard: bigint;
  fast: bigint;
  instant: bigint;
}

/**
 * Gas estimate for a transaction
 */
export interface GasEstimate {
  gasLimit: bigint;
  maxFeePerGas: bigint;
  maxPriorityFeePerGas: bigint;
  estimatedCost: bigint;
}

/**
 * Get current gas prices from the network
 */
export async function getCurrentGasPrices(
  publicClient: PublicClient
): Promise<GasPrices> {
  const feeHistory = await publicClient.getFeeHistory({
    blockCount: 10,
    rewardPercentiles: [25, 50, 75, 95],
  });

  // Calculate base fee for next block
  const latestBaseFee = feeHistory.baseFeePerGas[feeHistory.baseFeePerGas.length - 1] || 0n;
  const nextBaseFee = (latestBaseFee * 125n) / 100n; // EIP-1559: max 12.5% increase

  // Get average priority fees from recent blocks
  const priorityFees = feeHistory.reward?.flat() || [];
  const avgPriorityFee = priorityFees.length > 0 
    ? priorityFees.reduce((sum, fee) => sum + (fee || 0n), 0n) / BigInt(priorityFees.length)
    : parseGwei("1.5");

  return {
    slow: nextBaseFee + avgPriorityFee / 2n,
    standard: nextBaseFee + avgPriorityFee,
    fast: nextBaseFee + (avgPriorityFee * 150n) / 100n,
    instant: nextBaseFee + (avgPriorityFee * 200n) / 100n,
  };
}

/**
 * Estimate gas for a swap operation
 */
export async function estimateSwapGas(
  publicClient: PublicClient,
  params: {
    from: `0x${string}`;
    to: `0x${string}`;
    data: `0x${string}`;
    value?: bigint;
  }
): Promise<GasEstimate> {
  const [gasLimit, gasPrices, block] = await Promise.all([
    publicClient.estimateGas({
      account: params.from,
      to: params.to,
      data: params.data,
      value: params.value,
    }),
    getCurrentGasPrices(publicClient),
    publicClient.getBlock(),
  ]);

  // Add 20% buffer to gas limit
  const bufferedGasLimit = (gasLimit * 120n) / 100n;

  const baseFee = block.baseFeePerGas || 0n;
  const priorityFee = parseGwei("2"); // 2 gwei priority fee

  const maxFeePerGas = (baseFee * 2n) + priorityFee; // 2x base fee for safety
  const maxPriorityFeePerGas = priorityFee;

  return {
    gasLimit: bufferedGasLimit,
    maxFeePerGas,
    maxPriorityFeePerGas,
    estimatedCost: bufferedGasLimit * maxFeePerGas,
  };
}

/**
 * Calculate transaction cost in USD
 */
export function calculateTransactionCostUSD(
  gasEstimate: GasEstimate,
  nativeTokenPriceUSD: number
): number {
  const costInEth = Number(gasEstimate.estimatedCost) / 1e18;
  return costInEth * nativeTokenPriceUSD;
}

/**
 * Wait for gas prices to drop below threshold
 */
export async function waitForGasPrice(
  publicClient: PublicClient,
  maxGwei: number,
  pollIntervalMs: number = 12000
): Promise<GasPrices> {
  const threshold = parseGwei(maxGwei.toString());

  while (true) {
    const prices = await getCurrentGasPrices(publicClient);
    
    if (prices.standard <= threshold) {
      return prices;
    }

    await new Promise(resolve => setTimeout(resolve, pollIntervalMs));
  }
}

/**
 * Format gas prices for display
 */
export function formatGasPrices(prices: GasPrices): {
  slow: string;
  standard: string;
  fast: string;
  instant: string;
} {
  return {
    slow: formatGwei(prices.slow),
    standard: formatGwei(prices.standard),
    fast: formatGwei(prices.fast),
    instant: formatGwei(prices.instant),
  };
}

/**
 * Advanced gas optimization strategies
 */

/**
 * Gas price history tracker for trend analysis
 */
export class GasPriceTracker {
  private history: Array<{ timestamp: number; prices: GasPrices }> = [];
  private maxHistorySize = 1000;

  /**
   * Record current gas prices
   */
  record(prices: GasPrices): void {
    this.history.push({
      timestamp: Date.now(),
      prices,
    });

    // Trim history if too large
    if (this.history.length > this.maxHistorySize) {
      this.history = this.history.slice(-this.maxHistorySize);
    }
  }

  /**
   * Get average gas price over time period
   */
  getAverage(periodMs: number): GasPrices | null {
    const cutoff = Date.now() - periodMs;
    const recent = this.history.filter(h => h.timestamp >= cutoff);

    if (recent.length === 0) return null;

    const sum = recent.reduce(
      (acc, h) => ({
        slow: acc.slow + h.prices.slow,
        standard: acc.standard + h.prices.standard,
        fast: acc.fast + h.prices.fast,
        instant: acc.instant + h.prices.instant,
      }),
      { slow: 0n, standard: 0n, fast: 0n, instant: 0n }
    );

    const count = BigInt(recent.length);

    return {
      slow: sum.slow / count,
      standard: sum.standard / count,
      fast: sum.fast / count,
      instant: sum.instant / count,
    };
  }

  /**
   * Predict if gas prices are trending up or down
   */
  getTrend(periodMs: number = 3600000): "up" | "down" | "stable" {
    const recent = this.history.filter(h => h.timestamp >= Date.now() - periodMs);

    if (recent.length < 10) return "stable";

    const mid = Math.floor(recent.length / 2);
    const firstHalf = recent.slice(0, mid);
    const secondHalf = recent.slice(mid);

    const avgFirst =
      firstHalf.reduce((sum, h) => sum + h.prices.standard, 0n) / BigInt(firstHalf.length);
    const avgSecond =
      secondHalf.reduce((sum, h) => sum + h.prices.standard, 0n) / BigInt(secondHalf.length);

    const diff = Number(avgSecond - avgFirst);
    const threshold = Number(avgFirst) * 0.1; // 10% change threshold

    if (diff > threshold) return "up";
    if (diff < -threshold) return "down";
    return "stable";
  }

  /**
   * Find optimal time window for transaction
   */
  findOptimalWindow(
    lookbackHours: number = 24
  ): { timestamp: number; prices: GasPrices } | null {
    const cutoff = Date.now() - lookbackHours * 3600000;
    const candidates = this.history.filter(h => h.timestamp >= cutoff);

    if (candidates.length === 0) return null;

    // Find lowest standard gas price
    return candidates.reduce((best, current) =>
      current.prices.standard < best.prices.standard ? current : best
    );
  }

  /**
   * Export history for analysis
   */
  exportHistory(): Array<{ timestamp: number; prices: GasPrices }> {
    return [...this.history];
  }
}

/**
 * Gas optimization recommendations
 */
export interface GasOptimizationRecommendation {
  shouldExecuteNow: boolean;
  reason: string;
  estimatedSavings?: string;
  recommendedAction: string;
  alternativeTime?: number;
}

/**
 * Analyze gas conditions and provide optimization recommendations
 */
export async function getGasOptimizationRecommendation(
  publicClient: PublicClient,
  tracker: GasPriceTracker,
  urgency: "low" | "medium" | "high"
): Promise<GasOptimizationRecommendation> {
  const currentPrices = await getCurrentGasPrices(publicClient);
  const avgPrices = tracker.getAverage(3600000); // Last hour
  const trend = tracker.getTrend();

  // High urgency: execute immediately
  if (urgency === "high") {
    return {
      shouldExecuteNow: true,
      reason: "High urgency requires immediate execution",
      recommendedAction: "Execute with fast gas price",
    };
  }

  // Low urgency: optimize for cost
  if (urgency === "low") {
    if (avgPrices) {
      const currentStandard = Number(currentPrices.standard);
      const avgStandard = Number(avgPrices.standard);

      if (currentStandard > avgStandard * 1.2) {
        // Current prices 20% above average
        const optimal = tracker.findOptimalWindow(48);
        return {
          shouldExecuteNow: false,
          reason: "Current gas prices are 20% above hourly average",
          estimatedSavings: `${(((currentStandard - avgStandard) / currentStandard) * 100).toFixed(1)}%`,
          recommendedAction: "Wait for gas prices to decrease",
          alternativeTime: optimal?.timestamp,
        };
      }
    }

    if (trend === "up") {
      return {
        shouldExecuteNow: false,
        reason: "Gas prices are trending upward, but not urgent",
        recommendedAction: "Monitor prices and execute during next dip",
      };
    }
  }

  // Medium urgency: balance cost and time
  if (avgPrices && Number(currentPrices.standard) > Number(avgPrices.standard) * 1.5) {
    return {
      shouldExecuteNow: false,
      reason: "Current gas prices are significantly elevated (50% above average)",
      recommendedAction: "Wait 15-30 minutes for prices to normalize",
    };
  }

  return {
    shouldExecuteNow: true,
    reason: "Gas prices are acceptable for execution",
    recommendedAction: "Execute with standard gas price",
  };
}

/**
 * Calculate break-even gas price for MEV protection
 */
export function calculateMEVProtectedGasPrice(
  baseGasPrice: bigint,
  mevBribePercentage: number
): bigint {
  const bribe = (baseGasPrice * BigInt(Math.floor(mevBribePercentage * 100))) / 10000n;
  return baseGasPrice + bribe;
}

/**
 * Estimate total transaction cost including gas token costs
 */
export async function estimateTotalTransactionCost(
  publicClient: PublicClient,
  txParams: {
    from: `0x${string}`;
    to: `0x${string}`;
    data: `0x${string}`;
    value?: bigint;
  },
  nativeTokenPriceUSD: number
): Promise<{
  gasLimit: bigint;
  gasCostNative: bigint;
  gasCostUSD: string;
  totalCostUSD: string; // Including value sent
}> {
  const estimate = await estimateSwapGas(publicClient, txParams);
  const gasCostNative = estimate.estimatedCost;
  const gasCostUSD = calculateTransactionCostUSD(estimate, nativeTokenPriceUSD);
  const valueSentUSD = txParams.value
    ? (Number(txParams.value) / 1e18) * nativeTokenPriceUSD
    : 0;

  return {
    gasLimit: estimate.gasLimit,
    gasCostNative,
    gasCostUSD: gasCostUSD.toFixed(2),
    totalCostUSD: (gasCostUSD + valueSentUSD).toFixed(2),
  };
}
