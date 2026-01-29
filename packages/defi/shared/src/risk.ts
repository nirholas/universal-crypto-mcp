/**
 * Risk Management and Slippage Protection
 * 
 * Professional risk assessment, slippage calculation, and protection mechanisms
 * for DeFi trading operations.
 */

import { formatUnits, parseUnits } from "viem";

/**
 * Slippage tolerance configuration
 */
export interface SlippageConfig {
  percentage: number; // 0-100
  maxSlippageUSD?: number;
  dynamicAdjustment?: boolean;
}

/**
 * Trade risk assessment
 */
export interface RiskAssessment {
  riskLevel: "low" | "medium" | "high" | "extreme";
  factors: string[];
  score: number; // 0-100
  recommendations: string[];
  shouldProceed: boolean;
}

/**
 * Slippage calculation result
 */
export interface SlippageCalculation {
  inputAmount: bigint;
  expectedOutput: bigint;
  minimumOutput: bigint;
  maximumInput: bigint;
  slippagePercentage: number;
  priceImpact: number;
  estimatedLoss: bigint;
}

/**
 * Calculate minimum output amount with slippage protection
 */
export function calculateMinimumOutput(
  expectedOutput: bigint,
  slippagePercentage: number
): bigint {
  const slippageBps = BigInt(Math.floor(slippagePercentage * 100));
  const minOutput = (expectedOutput * (10000n - slippageBps)) / 10000n;
  return minOutput;
}

/**
 * Calculate maximum input amount with slippage protection
 */
export function calculateMaximumInput(
  expectedInput: bigint,
  slippagePercentage: number
): bigint {
  const slippageBps = BigInt(Math.floor(slippagePercentage * 100));
  const maxInput = (expectedInput * (10000n + slippageBps)) / 10000n;
  return maxInput;
}

/**
 * Calculate price impact of a trade
 */
export function calculatePriceImpact(
  reserveIn: bigint,
  reserveOut: bigint,
  amountIn: bigint,
  amountOut: bigint
): number {
  // Price before trade
  const priceBefore = Number(reserveOut) / Number(reserveIn);

  // Price after trade (accounting for fees)
  const newReserveIn = reserveIn + amountIn;
  const newReserveOut = reserveOut - amountOut;
  const priceAfter = Number(newReserveOut) / Number(newReserveIn);

  // Price impact percentage
  const impact = ((priceAfter - priceBefore) / priceBefore) * 100;

  return Math.abs(impact);
}

/**
 * Calculate slippage with price impact consideration
 */
export function calculateSlippageWithImpact(
  amountIn: bigint,
  expectedOutput: bigint,
  reserveIn: bigint,
  reserveOut: bigint,
  slippageConfig: SlippageConfig
): SlippageCalculation {
  const priceImpact = calculatePriceImpact(reserveIn, reserveOut, amountIn, expectedOutput);

  // Adjust slippage based on price impact if dynamic adjustment is enabled
  let effectiveSlippage = slippageConfig.percentage;

  if (slippageConfig.dynamicAdjustment && priceImpact > 1) {
    // Add price impact to slippage tolerance
    effectiveSlippage = Math.min(effectiveSlippage + priceImpact, 50); // Cap at 50%
  }

  const minimumOutput = calculateMinimumOutput(expectedOutput, effectiveSlippage);
  const maximumInput = calculateMaximumInput(amountIn, effectiveSlippage);
  const estimatedLoss = expectedOutput - minimumOutput;

  return {
    inputAmount: amountIn,
    expectedOutput,
    minimumOutput,
    maximumInput,
    slippagePercentage: effectiveSlippage,
    priceImpact,
    estimatedLoss,
  };
}

/**
 * Assess trading risk based on multiple factors
 */
export function assessTradeRisk(params: {
  priceImpact: number;
  slippagePercentage: number;
  liquidityDepth: bigint;
  tradeSize: bigint;
  volatility?: number;
  gasPrice?: bigint;
}): RiskAssessment {
  const factors: string[] = [];
  let score = 0;

  // Price impact assessment (0-30 points)
  if (params.priceImpact > 10) {
    factors.push(`Very high price impact: ${params.priceImpact.toFixed(2)}%`);
    score += 30;
  } else if (params.priceImpact > 5) {
    factors.push(`High price impact: ${params.priceImpact.toFixed(2)}%`);
    score += 20;
  } else if (params.priceImpact > 1) {
    factors.push(`Moderate price impact: ${params.priceImpact.toFixed(2)}%`);
    score += 10;
  }

  // Slippage assessment (0-20 points)
  if (params.slippagePercentage > 5) {
    factors.push(`High slippage tolerance: ${params.slippagePercentage}%`);
    score += 20;
  } else if (params.slippagePercentage > 1) {
    factors.push(`Moderate slippage tolerance: ${params.slippagePercentage}%`);
    score += 10;
  }

  // Liquidity depth assessment (0-25 points)
  const liquidityRatio = Number(params.tradeSize) / Number(params.liquidityDepth);
  if (liquidityRatio > 0.1) {
    factors.push(`Trade size is ${(liquidityRatio * 100).toFixed(1)}% of pool liquidity`);
    score += 25;
  } else if (liquidityRatio > 0.05) {
    factors.push(`Trade size is ${(liquidityRatio * 100).toFixed(1)}% of pool liquidity`);
    score += 15;
  }

  // Volatility assessment (0-15 points)
  if (params.volatility !== undefined) {
    if (params.volatility > 50) {
      factors.push(`Extremely high volatility: ${params.volatility.toFixed(1)}%`);
      score += 15;
    } else if (params.volatility > 20) {
      factors.push(`High volatility: ${params.volatility.toFixed(1)}%`);
      score += 10;
    }
  }

  // Gas price assessment (0-10 points)
  if (params.gasPrice) {
    const gasPriceGwei = Number(params.gasPrice) / 1e9;
    if (gasPriceGwei > 100) {
      factors.push(`Very high gas price: ${gasPriceGwei.toFixed(0)} Gwei`);
      score += 10;
    } else if (gasPriceGwei > 50) {
      factors.push(`High gas price: ${gasPriceGwei.toFixed(0)} Gwei`);
      score += 5;
    }
  }

  // Determine risk level and recommendations
  let riskLevel: "low" | "medium" | "high" | "extreme";
  let shouldProceed = true;
  const recommendations: string[] = [];

  if (score >= 70) {
    riskLevel = "extreme";
    shouldProceed = false;
    recommendations.push("DO NOT PROCEED - Risk level is too high");
    recommendations.push("Consider waiting for better market conditions");
    recommendations.push("Reduce trade size significantly");
  } else if (score >= 50) {
    riskLevel = "high";
    shouldProceed = false;
    recommendations.push("High risk detected - proceed with extreme caution");
    recommendations.push("Consider reducing trade size by 50% or more");
    recommendations.push("Increase slippage tolerance if price impact is acceptable");
  } else if (score >= 25) {
    riskLevel = "medium";
    recommendations.push("Moderate risk - monitor trade execution closely");
    recommendations.push("Consider splitting trade into smaller chunks");
    recommendations.push("Set appropriate slippage tolerance (1-2%)");
  } else {
    riskLevel = "low";
    recommendations.push("Low risk trade - proceed with standard precautions");
    recommendations.push("Standard slippage tolerance (0.5-1%) recommended");
  }

  return {
    riskLevel,
    factors,
    score,
    recommendations,
    shouldProceed,
  };
}

/**
 * Calculate optimal trade size to limit price impact
 */
export function calculateOptimalTradeSize(
  reserveIn: bigint,
  reserveOut: bigint,
  maxPriceImpact: number
): bigint {
  // Binary search for optimal trade size
  let low = 0n;
  let high = reserveIn / 10n; // Start with 10% of reserve
  let optimal = 0n;

  while (low <= high) {
    const mid = (low + high) / 2n;

    // Calculate expected output using constant product formula
    // amountOut = (amountIn * reserveOut) / (reserveIn + amountIn)
    const amountOut = (mid * reserveOut) / (reserveIn + mid);

    const impact = calculatePriceImpact(reserveIn, reserveOut, mid, amountOut);

    if (impact <= maxPriceImpact) {
      optimal = mid;
      low = mid + 1n;
    } else {
      high = mid - 1n;
    }
  }

  return optimal;
}

/**
 * Split large trade into optimal chunks
 */
export function splitTradeIntoChunks(
  totalAmount: bigint,
  reserveIn: bigint,
  reserveOut: bigint,
  maxPriceImpactPerTrade: number
): bigint[] {
  const chunks: bigint[] = [];
  let remaining = totalAmount;
  let currentReserveIn = reserveIn;
  let currentReserveOut = reserveOut;

  while (remaining > 0n) {
    const chunkSize = calculateOptimalTradeSize(
      currentReserveIn,
      currentReserveOut,
      maxPriceImpactPerTrade
    );

    if (chunkSize === 0n || chunkSize > remaining) {
      // Last chunk or can't split further
      chunks.push(remaining);
      break;
    }

    chunks.push(chunkSize);
    remaining -= chunkSize;

    // Update reserves for next iteration
    const amountOut = (chunkSize * currentReserveOut) / (currentReserveIn + chunkSize);
    currentReserveIn += chunkSize;
    currentReserveOut -= amountOut;
  }

  return chunks;
}

/**
 * Sandwich attack detection
 */
export interface SandwichDetection {
  detected: boolean;
  confidence: number;
  indicators: string[];
  recommendation: string;
}

/**
 * Detect potential sandwich attack patterns
 */
export function detectSandwichAttack(params: {
  recentPriceChanges: number[];
  memPoolActivity: number;
  gasPrice: bigint;
  averageGasPrice: bigint;
}): SandwichDetection {
  const indicators: string[] = [];
  let confidenceScore = 0;

  // Check for unusual price volatility
  const priceVolatility = Math.max(...params.recentPriceChanges.map(Math.abs));
  if (priceVolatility > 2) {
    indicators.push(`High recent price volatility: ${priceVolatility.toFixed(2)}%`);
    confidenceScore += 30;
  }

  // Check for high mempool activity
  if (params.memPoolActivity > 100) {
    indicators.push(`High mempool activity: ${params.memPoolActivity} pending transactions`);
    confidenceScore += 25;
  }

  // Check for unusually high gas price
  if (params.gasPrice > params.averageGasPrice * 2n) {
    indicators.push("Significantly elevated gas price compared to average");
    confidenceScore += 25;
  }

  // Check for rapid consecutive price changes
  if (params.recentPriceChanges.length >= 3) {
    const rapidChanges = params.recentPriceChanges.filter(
      (change, i, arr) => i > 0 && Math.abs(change) > 1 && Math.abs(arr[i - 1]) > 1
    );

    if (rapidChanges.length >= 2) {
      indicators.push("Rapid consecutive price movements detected");
      confidenceScore += 20;
    }
  }

  const detected = confidenceScore >= 50;

  let recommendation: string;
  if (confidenceScore >= 75) {
    recommendation = "HIGH RISK - Strong sandwich attack indicators. Consider waiting or using MEV protection.";
  } else if (confidenceScore >= 50) {
    recommendation = "MODERATE RISK - Potential sandwich attack. Use private RPC or reduce trade size.";
  } else {
    recommendation = "LOW RISK - No strong sandwich attack indicators detected.";
  }

  return {
    detected,
    confidence: confidenceScore,
    indicators,
    recommendation,
  };
}

/**
 * Front-running protection recommendations
 */
export function getFrontRunningProtection(): {
  strategies: Array<{ name: string; description: string; effectiveness: number }>;
  recommendation: string;
} {
  return {
    strategies: [
      {
        name: "Private RPC",
        description: "Send transactions through private mempool (e.g., Flashbots Protect)",
        effectiveness: 95,
      },
      {
        name: "Lower Slippage",
        description: "Set tighter slippage tolerance to limit MEV extraction",
        effectiveness: 60,
      },
      {
        name: "Split Orders",
        description: "Break large orders into smaller chunks over time",
        effectiveness: 70,
      },
      {
        name: "Limit Orders",
        description: "Use limit orders instead of market orders when possible",
        effectiveness: 80,
      },
      {
        name: "MEV Blocker",
        description: "Use MEV blocker RPC endpoints to prevent exploitation",
        effectiveness: 90,
      },
    ],
    recommendation:
      "For maximum protection, use private RPC (Flashbots Protect) combined with appropriate slippage settings.",
  };
}
