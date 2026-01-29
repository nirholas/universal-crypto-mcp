/**
 * compareYields - Compare multiple yield pools with analysis
 * 
 * Provides side-by-side comparison of pools with intelligent
 * recommendations based on risk-adjusted returns.
 */

import { defiLlamaClient } from '../apis/defillama';
import { calculateRiskScore } from '../utils/risk';
import { CompareYieldsInput, YieldComparisonResult, YieldPool } from '../types';

/**
 * Tool definition for MCP registration
 */
export const compareYieldsDefinition = {
  name: 'compareYields',
  description: 'Compare multiple yield pools side-by-side with risk-adjusted recommendations.',
  inputSchema: {
    type: 'object' as const,
    properties: {
      poolIds: {
        type: 'array',
        items: { type: 'string' },
        description: 'Array of DeFiLlama pool IDs to compare (2-10 pools)',
      },
    },
    required: ['poolIds'],
  },
};

// Constraints
const MAX_POOLS_TO_COMPARE = 10;
const MIN_POOLS_TO_COMPARE = 2;

/**
 * Validate input
 */
function validateInput(input: CompareYieldsInput): string[] {
  if (!input.poolIds || !Array.isArray(input.poolIds)) {
    throw new Error('poolIds must be an array of pool identifiers');
  }

  if (input.poolIds.length < MIN_POOLS_TO_COMPARE) {
    throw new Error(`At least ${MIN_POOLS_TO_COMPARE} pools are required for comparison`);
  }

  if (input.poolIds.length > MAX_POOLS_TO_COMPARE) {
    throw new Error(`Maximum ${MAX_POOLS_TO_COMPARE} pools can be compared at once`);
  }

  // Validate and deduplicate pool IDs
  const seen = new Set<string>();
  const validIds: string[] = [];

  for (const id of input.poolIds) {
    if (typeof id !== 'string' || id.trim().length === 0) {
      throw new Error('Each poolId must be a non-empty string');
    }
    
    const trimmed = id.trim();
    if (!seen.has(trimmed)) {
      seen.add(trimmed);
      validIds.push(trimmed);
    }
  }

  if (validIds.length < MIN_POOLS_TO_COMPARE) {
    throw new Error(`At least ${MIN_POOLS_TO_COMPARE} unique pools are required for comparison`);
  }

  return validIds;
}

/**
 * Calculate risk-adjusted return (Sharpe-like ratio)
 */
function calculateRiskAdjustedReturn(apy: number, risk: number): number {
  // Higher is better: APY divided by risk factor
  // Add 1 to risk to avoid division by zero
  return apy / (risk + 1);
}

/**
 * Generate intelligent recommendation based on pool analysis
 */
function generateRecommendation(
  pool: YieldPool, 
  allPools: YieldPool[], 
  risk: number,
  riskLevel: 'low' | 'medium' | 'high' | 'very-high'
): string {
  const recommendations: string[] = [];

  // Calculate rankings
  const sortedByApy = [...allPools].sort((a, b) => b.apy - a.apy);
  const sortedByTvl = [...allPools].sort((a, b) => b.tvlUsd - a.tvlUsd);
  
  const riskScores = allPools.map(p => ({ 
    pool: p.pool, 
    risk: calculateRiskScore(p).overallRisk,
    riskAdjusted: calculateRiskAdjustedReturn(p.apy, calculateRiskScore(p).overallRisk)
  }));
  const sortedByRiskAdjusted = [...riskScores].sort((a, b) => b.riskAdjusted - a.riskAdjusted);
  const sortedByRisk = [...riskScores].sort((a, b) => a.risk - b.risk);

  const apyRank = sortedByApy.findIndex(p => p.pool === pool.pool) + 1;
  const tvlRank = sortedByTvl.findIndex(p => p.pool === pool.pool) + 1;
  const riskRank = sortedByRisk.findIndex(r => r.pool === pool.pool) + 1;
  const riskAdjustedRank = sortedByRiskAdjusted.findIndex(r => r.pool === pool.pool) + 1;

  // Best risk-adjusted return
  if (riskAdjustedRank === 1) {
    recommendations.push('⭐ BEST RISK-ADJUSTED RETURN');
  }

  // APY ranking
  if (apyRank === 1) {
    recommendations.push('Highest APY');
  } else if (apyRank === allPools.length) {
    recommendations.push('Lowest APY');
  }

  // TVL analysis
  if (tvlRank === 1) {
    recommendations.push('Most liquid (highest TVL)');
  } else if (pool.tvlUsd < 1_000_000) {
    recommendations.push('⚠️ Low liquidity');
  }

  // Risk analysis
  if (riskRank === 1) {
    recommendations.push('Lowest risk');
  } else if (riskLevel === 'very-high') {
    recommendations.push('⚠️ Very high risk - small position only');
  } else if (riskLevel === 'high') {
    recommendations.push('Higher risk - consider position sizing');
  }

  // APY sustainability
  if (pool.apy > 100) {
    recommendations.push('⚠️ Very high APY may be unsustainable');
  } else if (pool.apyBase && pool.apyReward && pool.apyReward > pool.apyBase * 2) {
    recommendations.push('APY heavily reward-dependent');
  }

  // Stablecoin advantage
  if (pool.stablecoin) {
    recommendations.push('Stablecoin pool - no price exposure');
  }

  // Use case recommendations
  if (riskLevel === 'low' && pool.stablecoin) {
    recommendations.push('Good for: Conservative yield');
  } else if (riskLevel === 'medium' && pool.tvlUsd > 10_000_000) {
    recommendations.push('Good for: Balanced strategy');
  } else if (riskLevel === 'high' && pool.apy > 30) {
    recommendations.push('Good for: High-risk allocation');
  }

  return recommendations.join(' | ') || 'Standard yield opportunity';
}

/**
 * Get risk level from score
 */
function getRiskLevel(score: number): 'low' | 'medium' | 'high' | 'very-high' {
  if (score <= 3) return 'low';
  if (score <= 5) return 'medium';
  if (score <= 7) return 'high';
  return 'very-high';
}

export async function compareYields(input: CompareYieldsInput): Promise<YieldComparisonResult[]> {
  const poolIds = validateInput(input);

  // Fetch all requested pools in parallel
  const poolPromises = poolIds.map(id => defiLlamaClient.getPool(id));
  const pools = await Promise.all(poolPromises);

  // Filter out not found pools and track which weren't found
  const validPools: YieldPool[] = [];
  const notFound: string[] = [];

  pools.forEach((p, i) => {
    if (p) {
      validPools.push(p);
    } else {
      notFound.push(poolIds[i]);
    }
  });

  if (validPools.length === 0) {
    throw new Error(`No pools found. Invalid pool IDs: ${notFound.join(', ')}`);
  }

  if (validPools.length < MIN_POOLS_TO_COMPARE) {
    throw new Error(
      `Only ${validPools.length} valid pool(s) found. ` +
      `Need at least ${MIN_POOLS_TO_COMPARE}. ` +
      `Not found: ${notFound.join(', ')}`
    );
  }

  // Generate comparison results
  return validPools.map(pool => {
    const assessment = calculateRiskScore(pool);
    const riskLevel = getRiskLevel(assessment.overallRisk);
    const recommendation = generateRecommendation(pool, validPools, assessment.overallRisk, riskLevel);

    return {
      poolId: pool.pool,
      protocol: pool.project,
      chain: pool.chain,
      apy: Math.round(pool.apy * 100) / 100,
      tvl: Math.round(pool.tvlUsd),
      risk: assessment.overallRisk,
      riskLevel,
      recommendation,
      stablecoin: pool.stablecoin,
    };
  });
}
