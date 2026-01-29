/**
 * getStablecoinYields - Get yield opportunities for stablecoins
 * 
 * Returns filtered yields specifically for stablecoin pools,
 * which typically have lower impermanent loss risk.
 */

import { defiLlamaClient } from '../apis/defillama';
import { getSimpleRiskScore, meetsMinimumSafetyStandards } from '../utils/risk';
import { GetStablecoinYieldsInput, StablecoinYieldResult, YieldPool } from '../types';

/**
 * Tool definition for MCP registration
 */
export const getStablecoinYieldsDefinition = {
  name: 'getStablecoinYields',
  description: 'Get yield opportunities specifically for stablecoin pools with lower impermanent loss risk.',
  inputSchema: {
    type: 'object' as const,
    properties: {
      stablecoin: {
        type: 'string',
        description: 'Filter by specific stablecoin (USDC, USDT, DAI, etc.)',
      },
      chain: {
        type: 'string',
        description: 'Filter by blockchain',
      },
      minTvl: {
        type: 'number',
        description: 'Minimum TVL in USD',
      },
      minApy: {
        type: 'number',
        description: 'Minimum APY percentage',
      },
      limit: {
        type: 'number',
        description: 'Maximum results (default: 20)',
      },
    },
    required: [],
  },
};

// Comprehensive list of stablecoins
const STABLECOINS = new Set([
  // USD-pegged
  'USDC', 'USDT', 'DAI', 'FRAX', 'BUSD', 'TUSD', 'USDP', 'GUSD',
  'LUSD', 'SUSD', 'MIM', 'CUSD', 'USDD', 'DOLA', 'MAI', 'ZUSD',
  'ALUSD', 'MUSD', 'EUSD', 'OUSD', 'CRVUSD', 'GRAI', 'PYUSD',
  'USDS', 'USDX', 'USDE', 'GHO', 'FDUSD', 'USDB', 'USD+',
  'FRAXBP', 'USDM', 'XUSD', 'USDN', 'USK',
  // EUR-pegged
  'EURC', 'EURS', 'EURT', 'AGEUR', 'JEUR', 'PAR', 'EURA',
  // Other fiat-pegged
  'CADC', 'XSGD', 'TRYB', 'BIDR', 'BRLA', 'JPYC',
]);

// Patterns to detect stablecoin variants
const STABLECOIN_PATTERNS = [
  /^[awsc]?USD[CETPX]?$/i,  // aUSDC, sUSDT, etc.
  /^[awsc]?DAI$/i,          // aDAI, sDAI, etc.
  /^[awsc]?FRAX$/i,
  /^st.*USD/i,              // stUSD variants
];

/**
 * Extract primary stablecoin from pool symbol
 */
function extractStablecoin(symbol: string): string | null {
  const upperSymbol = symbol.toUpperCase();
  const tokens = upperSymbol.split(/[-/]/);
  
  for (const token of tokens) {
    // Direct match
    if (STABLECOINS.has(token)) {
      return token;
    }
    
    // Pattern match
    for (const pattern of STABLECOIN_PATTERNS) {
      if (pattern.test(token)) {
        // Extract base stablecoin
        for (const stable of STABLECOINS) {
          if (token.includes(stable)) {
            return stable;
          }
        }
        return token;
      }
    }
  }
  
  return null;
}

/**
 * Check if pool contains specified stablecoin
 */
function containsStablecoin(pool: YieldPool, stablecoin: string): boolean {
  const upperStable = stablecoin.toUpperCase();
  const symbolUpper = pool.symbol.toUpperCase();
  
  // Direct check in symbol
  if (symbolUpper.includes(upperStable)) {
    return true;
  }
  
  // Check underlying tokens
  if (pool.underlyingTokens) {
    return pool.underlyingTokens.some(t => 
      t.toUpperCase().includes(upperStable)
    );
  }
  
  return false;
}

/**
 * Validate input
 */
function validateInput(input: GetStablecoinYieldsInput): {
  stablecoin: string | null;
  chain: string | null;
  minApy: number;
} {
  return {
    stablecoin: input.stablecoin?.trim().toUpperCase() || null,
    chain: input.chain?.trim().toLowerCase() || null,
    minApy: Math.max(0, input.minApy ?? 0),
  };
}

export async function getStablecoinYields(input: GetStablecoinYieldsInput = {}): Promise<StablecoinYieldResult[]> {
  const params = validateInput(input);

  // Get stablecoin pools from DeFiLlama
  let pools = await defiLlamaClient.getStablecoinPools();

  // Apply filters
  const filtered: Array<{ pool: YieldPool; stablecoin: string; risk: number }> = [];

  for (const pool of pools) {
    // Safety filter
    if (!meetsMinimumSafetyStandards(pool)) {
      continue;
    }

    // Chain filter
    if (params.chain && pool.chain.toLowerCase() !== params.chain) {
      continue;
    }

    // APY filter
    if (pool.apy < params.minApy) {
      continue;
    }

    // Extract stablecoin
    const stablecoin = extractStablecoin(pool.symbol);
    if (!stablecoin) {
      continue; // Skip if we can't identify the stablecoin
    }

    // Specific stablecoin filter
    if (params.stablecoin && !containsStablecoin(pool, params.stablecoin)) {
      continue;
    }

    // Calculate risk
    const risk = getSimpleRiskScore(pool);

    filtered.push({ pool, stablecoin, risk });
  }

  // Sort by APY descending
  filtered.sort((a, b) => b.pool.apy - a.pool.apy);

  // Limit to top 50
  const topPools = filtered.slice(0, 50);

  // Transform to output format
  return topPools.map(({ pool, stablecoin, risk }) => ({
    pool: pool.pool,
    protocol: pool.project,
    chain: pool.chain,
    apy: Math.round(pool.apy * 100) / 100,
    tvl: Math.round(pool.tvlUsd),
    stablecoin,
    risk,
  }));
}
