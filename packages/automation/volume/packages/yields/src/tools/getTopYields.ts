/**
 * getTopYields - Get top DeFi yields with comprehensive filtering
 * 
 * This tool queries the DeFiLlama yields API and returns the highest
 * yielding pools with risk scoring and filtering options.
 */

import { defiLlamaClient } from '../apis/defillama';
import { getSimpleRiskScore, meetsMinimumSafetyStandards } from '../utils/risk';
import { GetTopYieldsInput, TopYieldResult, YieldPool } from '../types';

// Input validation constants
const MAX_LIMIT = 100;
const DEFAULT_LIMIT = 20;
const MIN_TVL_DEFAULT = 10000; // $10K minimum by default for safety

/**
 * Tool definition for MCP registration
 */
export const getTopYieldsDefinition = {
  name: 'getTopYields',
  description: 'Get top DeFi yields with filtering by chain, APY, TVL, and risk score. Returns highest-yielding pools with risk assessment.',
  inputSchema: {
    type: 'object' as const,
    properties: {
      chain: {
        type: 'string',
        description: 'Filter by blockchain (ethereum, arbitrum, solana, etc.)',
      },
      minTvl: {
        type: 'number',
        description: 'Minimum TVL in USD (default: 10000)',
      },
      minApy: {
        type: 'number',
        description: 'Minimum APY percentage',
      },
      maxRisk: {
        type: 'number',
        description: 'Maximum risk score 1-10 (default: 10)',
      },
      limit: {
        type: 'number',
        description: 'Number of results (max: 100, default: 20)',
      },
      stablecoinOnly: {
        type: 'boolean',
        description: 'Only return stablecoin pools',
      },
    },
    required: [],
  },
};

/**
 * Validate and sanitize input parameters
 */
function validateInput(input: GetTopYieldsInput): Required<GetTopYieldsInput> {
  return {
    chain: input.chain?.trim().toLowerCase() || '',
    minTvl: Math.max(0, input.minTvl ?? MIN_TVL_DEFAULT),
    minApy: Math.max(0, input.minApy ?? 0),
    maxRisk: Math.min(10, Math.max(1, input.maxRisk ?? 10)),
    limit: Math.min(MAX_LIMIT, Math.max(1, input.limit ?? DEFAULT_LIMIT)),
    stablecoinOnly: input.stablecoinOnly ?? false,
  };
}

/**
 * Filter pools based on criteria
 */
function filterPool(pool: YieldPool, params: Required<GetTopYieldsInput>): boolean {
  // Basic safety filters - always applied
  if (!meetsMinimumSafetyStandards(pool)) {
    return false;
  }

  // Chain filter
  if (params.chain && pool.chain.toLowerCase() !== params.chain) {
    return false;
  }

  // TVL filter
  if (pool.tvlUsd < params.minTvl) {
    return false;
  }

  // APY filter
  if (pool.apy < params.minApy) {
    return false;
  }

  // Stablecoin filter
  if (params.stablecoinOnly && !pool.stablecoin) {
    return false;
  }

  return true;
}

export async function getTopYields(input: GetTopYieldsInput = {}): Promise<TopYieldResult[]> {
  const params = validateInput(input);

  // Fetch all pools from DeFiLlama
  const pools = await defiLlamaClient.getYields();

  // Filter and score pools
  const scoredPools: Array<{ pool: YieldPool; risk: number }> = [];

  for (const pool of pools) {
    if (!filterPool(pool, params)) {
      continue;
    }

    const risk = getSimpleRiskScore(pool);
    
    // Apply risk filter
    if (risk > params.maxRisk) {
      continue;
    }

    scoredPools.push({ pool, risk });
  }

  // Sort by APY descending
  scoredPools.sort((a, b) => b.pool.apy - a.pool.apy);

  // Limit results
  const topPools = scoredPools.slice(0, params.limit);

  // Transform to output format
  return topPools.map(({ pool, risk }) => ({
    pool: pool.pool,
    protocol: pool.project,
    chain: pool.chain,
    apy: Math.round(pool.apy * 100) / 100,
    tvl: Math.round(pool.tvlUsd),
    tokens: pool.symbol.split('-').map(t => t.trim()),
    risk,
    stablecoin: pool.stablecoin,
  }));
}
