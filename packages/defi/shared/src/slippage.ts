/**
 * Slippage protection utilities
 * 
 * Calculate minimum amounts and price impact for swaps.
 */

/**
 * Calculate minimum amount out with slippage tolerance
 */
export function calculateMinimumAmountOut(
  expectedAmount: bigint,
  slippagePercent: number
): bigint {
  if (slippagePercent < 0 || slippagePercent > 100) {
    throw new Error("Slippage must be between 0 and 100");
  }

  const slippageBps = BigInt(Math.floor(slippagePercent * 100));
  const minAmount = (expectedAmount * (10000n - slippageBps)) / 10000n;
  
  return minAmount;
}

/**
 * Calculate maximum amount in with slippage tolerance
 */
export function calculateMaximumAmountIn(
  expectedAmount: bigint,
  slippagePercent: number
): bigint {
  if (slippagePercent < 0 || slippagePercent > 100) {
    throw new Error("Slippage must be between 0 and 100");
  }

  const slippageBps = BigInt(Math.floor(slippagePercent * 100));
  const maxAmount = (expectedAmount * (10000n + slippageBps)) / 10000n;
  
  return maxAmount;
}

/**
 * Calculate price impact percentage
 */
export function calculatePriceImpact(
  amountIn: bigint,
  amountOut: bigint,
  reserveIn: bigint,
  reserveOut: bigint
): number {
  // Calculate spot price: reserveOut / reserveIn
  const spotPrice = Number(reserveOut) / Number(reserveIn);
  
  // Calculate execution price: amountOut / amountIn
  const executionPrice = Number(amountOut) / Number(amountIn);
  
  // Price impact = (spotPrice - executionPrice) / spotPrice * 100
  const impact = ((spotPrice - executionPrice) / spotPrice) * 100;
  
  return Math.abs(impact);
}

/**
 * Validate price impact is acceptable
 */
export function validatePriceImpact(
  priceImpact: number,
  maxImpactPercent: number = 5
): { valid: boolean; error?: string } {
  if (priceImpact > maxImpactPercent) {
    return {
      valid: false,
      error: `Price impact ${priceImpact.toFixed(2)}% exceeds maximum ${maxImpactPercent}%`,
    };
  }

  return { valid: true };
}

/**
 * Calculate effective price with slippage
 */
export function calculateEffectivePrice(
  amountIn: bigint,
  amountOut: bigint,
  slippagePercent: number
): bigint {
  const minAmountOut = calculateMinimumAmountOut(amountOut, slippagePercent);
  
  // Effective price = amountIn / minAmountOut
  const effectivePrice = (amountIn * 10000n) / minAmountOut;
  
  return effectivePrice;
}

/**
 * Check if slippage tolerance is reasonable
 */
export function validateSlippage(
  slippagePercent: number
): { valid: boolean; warning?: string } {
  if (slippagePercent < 0.1) {
    return {
      valid: true,
      warning: "Very low slippage may cause transaction failures",
    };
  }

  if (slippagePercent > 5) {
    return {
      valid: true,
      warning: "High slippage tolerance increases MEV risk",
    };
  }

  if (slippagePercent > 10) {
    return {
      valid: false,
      warning: "Slippage tolerance too high, transaction likely to be sandwiched",
    };
  }

  return { valid: true };
}

/**
 * Calculate deadline timestamp (current time + seconds)
 */
export function calculateDeadline(secondsFromNow: number = 1200): bigint {
  return BigInt(Math.floor(Date.now() / 1000) + secondsFromNow);
}

/**
 * Format slippage for display
 */
export function formatSlippage(slippagePercent: number): string {
  return `${slippagePercent.toFixed(2)}%`;
}

/**
 * Parse slippage from user input
 */
export function parseSlippage(input: string): number {
  const cleaned = input.replace('%', '').trim();
  const value = parseFloat(cleaned);
  
  if (isNaN(value)) {
    throw new Error("Invalid slippage value");
  }
  
  return value;
}
