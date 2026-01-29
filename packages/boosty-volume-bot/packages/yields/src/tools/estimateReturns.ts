/**
 * estimateReturns - Estimate potential returns for an investment
 * 
 * Calculates compound interest returns based on current pool APY.
 * Includes important disclaimers about the speculative nature of estimates.
 */

import { defiLlamaClient } from '../apis/defillama';
import { EstimateReturnsInput, EstimatedReturnsResult } from '../types';

/**
 * Tool definition for MCP registration
 */
export const estimateReturnsDefinition = {
  name: 'estimateReturns',
  description: 'Estimate potential returns for an investment in a yield pool based on current APY.',
  inputSchema: {
    type: 'object' as const,
    properties: {
      poolId: {
        type: 'string',
        description: 'The DeFiLlama pool identifier',
      },
      amount: {
        type: 'number',
        description: 'Investment amount in USD',
      },
      days: {
        type: 'number',
        description: 'Investment duration in days',
      },
    },
    required: ['poolId', 'amount', 'days'],
  },
};

// Validation constants
const MAX_AMOUNT = 1_000_000_000_000; // $1 trillion max
const MAX_DAYS = 3650; // 10 years max

/**
 * Validate input parameters
 */
function validateInput(input: EstimateReturnsInput): { poolId: string; amount: number; days: number } {
  if (!input.poolId || typeof input.poolId !== 'string') {
    throw new Error('poolId is required and must be a string');
  }

  const poolId = input.poolId.trim();
  if (poolId.length === 0) {
    throw new Error('poolId cannot be empty');
  }

  if (typeof input.amount !== 'number' || !Number.isFinite(input.amount)) {
    throw new Error('amount must be a valid number');
  }

  if (input.amount <= 0) {
    throw new Error('amount must be a positive number');
  }

  if (input.amount > MAX_AMOUNT) {
    throw new Error(`amount cannot exceed ${MAX_AMOUNT.toLocaleString()}`);
  }

  if (typeof input.days !== 'number' || !Number.isInteger(input.days)) {
    throw new Error('days must be an integer');
  }

  if (input.days <= 0) {
    throw new Error('days must be a positive number');
  }

  if (input.days > MAX_DAYS) {
    throw new Error(`days cannot exceed ${MAX_DAYS} (10 years)`);
  }

  return { poolId, amount: input.amount, days: input.days };
}

export async function estimateReturns(input: EstimateReturnsInput): Promise<EstimatedReturnsResult> {
  const { poolId, amount, days } = validateInput(input);

  // Fetch pool data
  const pool = await defiLlamaClient.getPool(poolId);

  if (!pool) {
    throw new Error(`Pool not found: ${poolId}. Verify the pool ID from DeFiLlama.`);
  }

  const apy = pool.apy;
  
  if (apy <= 0) {
    throw new Error('Pool has zero or negative APY - cannot estimate returns');
  }

  if (apy > 10000) {
    throw new Error('Pool APY is suspiciously high (>10000%) - cannot provide reliable estimate');
  }

  // Calculate compound interest
  // Formula: A = P * (1 + r/n)^(n*t)
  // Using daily compounding: A = P * (1 + APY/365)^days
  const dailyRate = apy / 100 / 365;
  const finalValue = amount * Math.pow(1 + dailyRate, days);
  const estimatedReturn = finalValue - amount;
  const dailyReturn = estimatedReturn / days;

  // Generate appropriate disclaimer
  const disclaimer = apy > 100
    ? '⚠️ IMPORTANT: High APY yields are often unsustainable. This estimate assumes constant APY which is unlikely. Actual returns may be significantly lower. DYOR and never invest more than you can afford to lose.'
    : 'Note: This estimate assumes constant APY over the period. Actual returns may vary significantly due to changing market conditions, TVL fluctuations, and reward emissions. Past performance does not guarantee future results.';

  return {
    principal: amount,
    estimatedReturn: Math.round(estimatedReturn * 100) / 100,
    apy: Math.round(apy * 100) / 100,
    finalValue: Math.round(finalValue * 100) / 100,
    dailyReturn: Math.round(dailyReturn * 100) / 100,
    periodDays: days,
    disclaimer,
  };
}
