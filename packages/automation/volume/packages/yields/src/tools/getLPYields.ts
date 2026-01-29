/**
 * getLPYields - Find LP pool yields for a specific token pair
 * 
 * Searches for liquidity pools containing both specified tokens
 * across all protocols and chains.
 */

import { defiLlamaClient } from '../apis/defillama';
import { getSimpleRiskScore, meetsMinimumSafetyStandards } from '../utils/risk';
import { GetLPYieldsInput, LPYieldResult, YieldPool } from '../types';

/**
 * Tool definition for MCP registration
 */
export const getLPYieldsDefinition = {
  name: 'getLPYields',
  description: 'Find LP pool yields for a specific token pair across all protocols and chains.',
  inputSchema: {
    type: 'object' as const,
    properties: {
      token0: {
        type: 'string',
        description: 'First token symbol (e.g., ETH, USDC)',
      },
      token1: {
        type: 'string',
        description: 'Second token symbol (e.g., USDT, WBTC)',
      },
      chain: {
        type: 'string',
        description: 'Filter by blockchain',
      },
      minTvl: {
        type: 'number',
        description: 'Minimum TVL in USD',
      },
      limit: {
        type: 'number',
        description: 'Maximum results (default: 20)',
      },
    },
    required: ['token0', 'token1'],
  },
};

// Protocol fee defaults (based on common protocol configurations)
const PROTOCOL_FEES: Record<string, number> = {
  'uniswap-v3': 0.3,      // Variable, but 0.3% is common
  'uniswap-v2': 0.3,
  'uniswap': 0.3,
  'sushiswap': 0.3,
  'pancakeswap': 0.25,
  'pancakeswap-amm': 0.25,
  'pancakeswap-amm-v3': 0.25,
  'curve': 0.04,
  'curve-dex': 0.04,
  'balancer': 0.3,        // Variable
  'balancer-v2': 0.3,
  'velodrome': 0.3,
  'velodrome-v2': 0.3,
  'aerodrome': 0.3,
  'camelot': 0.3,
  'camelot-v3': 0.3,
  'trader-joe': 0.3,
  'traderjoe': 0.3,
  'quickswap': 0.3,
  'quickswap-v3': 0.3,
};

/**
 * Normalize token symbol for comparison
 */
function normalizeToken(token: string): string {
  const upper = token.toUpperCase().trim();
  
  // Handle wrapped token variants
  if (upper === 'WETH' || upper === 'ETH') return 'ETH';
  if (upper === 'WBTC' || upper === 'BTC') return 'BTC';
  if (upper === 'WMATIC' || upper === 'MATIC' || upper === 'POL') return 'MATIC';
  if (upper === 'WAVAX' || upper === 'AVAX') return 'AVAX';
  if (upper === 'WBNB' || upper === 'BNB') return 'BNB';
  if (upper === 'WFTM' || upper === 'FTM') return 'FTM';
  
  return upper;
}

/**
 * Check if pool contains both tokens
 */
function poolContainsTokens(pool: YieldPool, token0: string, token1: string): boolean {
  const symbolUpper = pool.symbol.toUpperCase();
  const tokens = symbolUpper.split(/[-/]/).map(t => normalizeToken(t));
  
  const normalToken0 = normalizeToken(token0);
  const normalToken1 = normalizeToken(token1);
  
  // Check if both normalized tokens are present
  const hasToken0 = tokens.some(t => t === normalToken0 || t.includes(normalToken0));
  const hasToken1 = tokens.some(t => t === normalToken1 || t.includes(normalToken1));
  
  return hasToken0 && hasToken1;
}

/**
 * Extract fee from pool metadata or use protocol default
 */
function extractFee(pool: YieldPool): number | null {
  // Try to extract from pool metadata
  if (pool.poolMeta) {
    const feeMatch = pool.poolMeta.match(/(\d+\.?\d*)\s*%?\s*fee/i) || 
                     pool.poolMeta.match(/fee[:\s]*(\d+\.?\d*)\s*%?/i) ||
                     pool.poolMeta.match(/(\d+\.?\d*)\s*bps/i);
    if (feeMatch) {
      let fee = parseFloat(feeMatch[1]);
      // If in bps, convert to percentage
      if (pool.poolMeta.toLowerCase().includes('bps')) {
        fee = fee / 100;
      }
      if (fee > 0 && fee < 100) {
        return fee;
      }
    }
  }

  // Use protocol default
  const projectLower = pool.project.toLowerCase();
  for (const [protocol, fee] of Object.entries(PROTOCOL_FEES)) {
    if (projectLower.includes(protocol) || projectLower === protocol) {
      return fee;
    }
  }

  return null;
}

/**
 * Validate input
 */
function validateInput(input: GetLPYieldsInput): { token0: string; token1: string; chain: string | null } {
  if (!input.token0 || typeof input.token0 !== 'string') {
    throw new Error('token0 is required and must be a string');
  }
  
  if (!input.token1 || typeof input.token1 !== 'string') {
    throw new Error('token1 is required and must be a string');
  }

  const token0 = input.token0.trim();
  const token1 = input.token1.trim();
  
  if (token0.length === 0) {
    throw new Error('token0 cannot be empty');
  }
  
  if (token1.length === 0) {
    throw new Error('token1 cannot be empty');
  }

  if (normalizeToken(token0) === normalizeToken(token1)) {
    throw new Error('token0 and token1 must be different tokens');
  }

  return {
    token0,
    token1,
    chain: input.chain?.trim().toLowerCase() || null,
  };
}

export async function getLPYields(input: GetLPYieldsInput): Promise<LPYieldResult[]> {
  const params = validateInput(input);

  // Fetch all pools
  const pools = await defiLlamaClient.getYields();

  // Filter for LP pools containing both tokens
  const filtered: Array<{ pool: YieldPool; fee: number | null; risk: number }> = [];

  for (const pool of pools) {
    // Safety filter
    if (!meetsMinimumSafetyStandards(pool)) {
      continue;
    }

    // Must be multi-asset pool
    if (pool.exposure !== 'multi') {
      continue;
    }

    // Chain filter
    if (params.chain && pool.chain.toLowerCase() !== params.chain) {
      continue;
    }

    // Token pair filter
    if (!poolContainsTokens(pool, params.token0, params.token1)) {
      continue;
    }

    // Calculate fee and risk
    const fee = extractFee(pool);
    const risk = getSimpleRiskScore(pool);

    filtered.push({ pool, fee, risk });
  }

  // Sort by APY descending
  filtered.sort((a, b) => b.pool.apy - a.pool.apy);

  // Limit to top 30
  const topPools = filtered.slice(0, 30);

  // Transform to output format
  return topPools.map(({ pool, fee, risk }) => ({
    pool: pool.pool,
    protocol: pool.project,
    chain: pool.chain,
    apy: Math.round(pool.apy * 100) / 100,
    tvl: Math.round(pool.tvlUsd),
    fee,
    ilRisk: pool.ilRisk || 'yes', // LP pools have IL risk by default
    risk,
  }));
}
