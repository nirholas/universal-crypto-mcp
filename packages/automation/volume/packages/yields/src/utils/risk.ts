/**
 * Risk calculation utilities
 * 
 * Production-grade risk assessment system for DeFi yield pools.
 * Uses multiple factors including:
 * - Impermanent loss risk
 * - Smart contract risk
 * - Protocol maturity
 * - Chain security
 * - Historical volatility
 * - Audit status
 */

import { YieldPool } from '../types';

export interface RiskFactors {
  ilRisk: number;            // 1-10: Impermanent loss risk
  smartContractRisk: number; // 1-10: Smart contract risk
  protocolRisk: number;      // 1-10: Protocol maturity/trust
  chainRisk: number;         // 1-10: Chain security/decentralization
}

export interface RiskAssessment {
  overallRisk: number;
  riskLevel: 'low' | 'medium' | 'high' | 'very-high';
  factors: RiskFactors;
  audits: string[];
  warnings: string[];
  recommendations: string[];
}

// Comprehensive chain risk scores based on security, decentralization, and track record
// Lower = safer, scores from 1-10
const CHAIN_RISK_SCORES: Record<string, number> = {
  // Tier 1: Battle-tested, highly decentralized
  ethereum: 2,
  
  // Tier 2: Well-established L2s and sidechains
  arbitrum: 3,
  optimism: 3,
  base: 3,
  polygon: 3,
  'polygon-zkevm': 4,
  zksync: 4,
  linea: 4,
  scroll: 4,
  mantle: 4,
  
  // Tier 3: Established but higher risk
  avalanche: 4,
  bsc: 4,
  gnosis: 4,
  
  // Tier 4: Newer or less decentralized
  fantom: 5,
  celo: 5,
  moonbeam: 5,
  aurora: 5,
  metis: 5,
  blast: 5,
  mode: 5,
  
  // Tier 5: Higher risk chains
  moonriver: 6,
  cronos: 6,
  boba: 6,
  kava: 6,
  
  // Tier 6: Caution advised
  harmony: 8, // Had bridge exploit
  
  default: 6,
};

// TVL-based protocol risk thresholds
const TVL_RISK_THRESHOLDS = [
  { minTvl: 10_000_000_000, risk: 1 }, // >$10B = extremely safe
  { minTvl: 1_000_000_000, risk: 2 },  // >$1B = very safe
  { minTvl: 500_000_000, risk: 2 },    // >$500M = very safe
  { minTvl: 100_000_000, risk: 3 },    // >$100M = safe
  { minTvl: 50_000_000, risk: 4 },     // >$50M = moderately safe
  { minTvl: 10_000_000, risk: 5 },     // >$10M = moderate
  { minTvl: 5_000_000, risk: 6 },      // >$5M = moderate risk
  { minTvl: 1_000_000, risk: 7 },      // >$1M = risky
  { minTvl: 100_000, risk: 8 },        // >$100K = very risky
  { minTvl: 10_000, risk: 9 },         // >$10K = extremely risky
  { minTvl: 0, risk: 10 },             // <$10K = maximum risk
];

// Well-known, audited protocols with strong security track records
const TIER1_PROTOCOLS = new Set([
  'aave-v2', 'aave-v3', 'aave',
  'compound', 'compound-v3',
  'uniswap', 'uniswap-v2', 'uniswap-v3',
  'curve', 'curve-dex',
  'convex-finance', 'convex',
  'lido',
  'maker', 'makerdao',
  'yearn-finance', 'yearn',
  'balancer', 'balancer-v2',
  'frax', 'frax-ether',
  'rocket-pool',
  'eigenlayer',
  'pendle',
]);

const TIER2_PROTOCOLS = new Set([
  'sushiswap',
  'pancakeswap', 'pancakeswap-amm', 'pancakeswap-amm-v3',
  'gmx', 'gmx-v2',
  'morpho', 'morpho-blue', 'morpho-compound',
  'radiant', 'radiant-v2',
  'benqi', 'benqi-lending',
  'stargate',
  'velodrome', 'velodrome-v2',
  'aerodrome',
  'camelot', 'camelot-v3',
  'trader-joe', 'traderjoe',
  'quickswap', 'quickswap-v3',
  'spark',
  'venus',
  'instadapp',
  'beefy',
  'sommelier',
  'extra-finance',
]);

/**
 * Calculate IL risk based on pool type, tokens, and exposure
 */
function calculateILRisk(pool: YieldPool): number {
  // Stablecoin pools have minimal IL risk
  if (pool.stablecoin) {
    return 1;
  }

  // Check the ilRisk field from DeFiLlama
  const ilRiskLower = pool.ilRisk?.toLowerCase();
  if (ilRiskLower === 'no') {
    return 1;
  }
  if (ilRiskLower === 'yes') {
    return 7;
  }

  // Single-sided staking has no IL
  if (pool.exposure === 'single') {
    return 1;
  }

  // Multi-asset pools
  if (pool.exposure === 'multi') {
    const symbolUpper = pool.symbol.toUpperCase();
    const stablePatterns = ['USDC', 'USDT', 'DAI', 'FRAX', 'BUSD', 'LUSD', 'CUSD'];
    const stableCount = stablePatterns.filter(s => symbolUpper.includes(s)).length;
    
    if (stableCount >= 2) {
      return 2; // Stablecoin pair, very low IL
    }
    
    // Check for correlated assets
    if (symbolUpper.includes('WETH') && symbolUpper.includes('STETH') ||
        symbolUpper.includes('WETH') && symbolUpper.includes('RETH') ||
        symbolUpper.includes('WBTC') && symbolUpper.includes('BTC')) {
      return 3; // Correlated assets, low IL
    }
    
    return 6; // Standard LP with IL exposure
  }

  return 5; // Default moderate risk
}

/**
 * Calculate smart contract risk based on multiple factors
 */
function calculateSmartContractRisk(pool: YieldPool): number {
  let risk = 5; // Default moderate

  const projectLower = pool.project.toLowerCase();

  // Protocol tier adjustments
  if (TIER1_PROTOCOLS.has(projectLower)) {
    risk = 2;
  } else if (TIER2_PROTOCOLS.has(projectLower)) {
    risk = 3;
  }

  // Audit information adjustments
  if (pool.audits && pool.audits !== '0') {
    const auditCount = parseInt(pool.audits, 10);
    if (auditCount >= 3) risk -= 1;
    if (auditCount >= 1) risk -= 0.5;
  }

  // TVL as proxy for battle-testing
  if (pool.tvlUsd > 500_000_000) {
    risk -= 1;
  } else if (pool.tvlUsd > 100_000_000) {
    risk -= 0.5;
  } else if (pool.tvlUsd < 1_000_000) {
    risk += 1;
  } else if (pool.tvlUsd < 100_000) {
    risk += 2;
  }

  // Outlier flag (suspicious APY patterns)
  if (pool.outlier) {
    risk += 2;
  }

  // Extremely high APY can indicate risk
  if (pool.apy > 500) {
    risk += 2;
  } else if (pool.apy > 200) {
    risk += 1;
  }

  return Math.max(1, Math.min(10, Math.round(risk)));
}

/**
 * Calculate protocol risk based on TVL and maturity
 */
function calculateProtocolRisk(pool: YieldPool): number {
  for (const threshold of TVL_RISK_THRESHOLDS) {
    if (pool.tvlUsd >= threshold.minTvl) {
      return threshold.risk;
    }
  }
  return 10;
}

/**
 * Calculate chain risk
 */
function calculateChainRisk(pool: YieldPool): number {
  const chain = pool.chain.toLowerCase().replace(/\s+/g, '-');
  return CHAIN_RISK_SCORES[chain] ?? CHAIN_RISK_SCORES.default;
}

/**
 * Determine risk level from score
 */
function getRiskLevel(score: number): 'low' | 'medium' | 'high' | 'very-high' {
  if (score <= 3) return 'low';
  if (score <= 5) return 'medium';
  if (score <= 7) return 'high';
  return 'very-high';
}

/**
 * Generate warnings based on pool characteristics
 */
function generateWarnings(pool: YieldPool, factors: RiskFactors): string[] {
  const warnings: string[] = [];

  // APY warnings
  if (pool.apy > 500) {
    warnings.push('⚠️ Extremely high APY (>500%) - high probability of being unsustainable or a scam');
  } else if (pool.apy > 200) {
    warnings.push('⚠️ Very high APY (>200%) - likely unsustainable, verify reward source');
  } else if (pool.apy > 100) {
    warnings.push('⚠️ High APY (>100%) - exercise caution, may not be sustainable');
  } else if (pool.apy > 50) {
    warnings.push('High APY - verify the source of yield');
  }

  // TVL warnings
  if (pool.tvlUsd < 10_000) {
    warnings.push('⚠️ Extremely low TVL (<$10K) - very high slippage and rug risk');
  } else if (pool.tvlUsd < 100_000) {
    warnings.push('⚠️ Very low TVL (<$100K) - high slippage risk and potential liquidity issues');
  } else if (pool.tvlUsd < 1_000_000) {
    warnings.push('Low TVL (<$1M) - potential liquidity concerns');
  }

  // IL warnings
  if (factors.ilRisk >= 7) {
    warnings.push('High impermanent loss risk - volatile asset pair');
  } else if (factors.ilRisk >= 5) {
    warnings.push('Moderate impermanent loss risk');
  }

  // Outlier warning
  if (pool.outlier) {
    warnings.push('⚠️ APY flagged as statistical outlier - verify source before depositing');
  }

  // Audit warnings
  if (!pool.audits || pool.audits === '0') {
    warnings.push('No audit information available - smart contract risk is higher');
  }

  // Chain warnings
  if (factors.chainRisk >= 7) {
    warnings.push('⚠️ Higher risk chain - consider bridge risks and chain security');
  } else if (factors.chainRisk >= 5) {
    warnings.push('Moderately established chain - be aware of ecosystem-specific risks');
  }

  // Reward-heavy APY
  if (pool.apyReward && pool.apyBase !== null && pool.apyReward > pool.apyBase * 3) {
    warnings.push('APY heavily dependent on reward tokens - may decrease if rewards are reduced');
  }

  return warnings;
}

/**
 * Generate recommendations based on pool analysis
 */
function generateRecommendations(pool: YieldPool, factors: RiskFactors, overallRisk: number): string[] {
  const recommendations: string[] = [];

  if (overallRisk <= 3) {
    recommendations.push('Suitable for conservative DeFi strategies');
  } else if (overallRisk <= 5) {
    recommendations.push('Suitable for moderate risk tolerance');
  } else if (overallRisk <= 7) {
    recommendations.push('Only suitable for high risk tolerance - limit position size');
  } else {
    recommendations.push('⚠️ Very high risk - only for experienced users with small positions');
  }

  if (pool.stablecoin && factors.ilRisk <= 2) {
    recommendations.push('Good option for stable yield without IL exposure');
  }

  if (factors.smartContractRisk <= 3 && pool.tvlUsd > 100_000_000) {
    recommendations.push('Well-established protocol with strong security track record');
  }

  if (pool.apyBase && pool.apyBase > 2 && (!pool.apyReward || pool.apyReward < pool.apyBase)) {
    recommendations.push('Yield primarily from trading fees - more sustainable than reward emissions');
  }

  if (factors.chainRisk <= 3) {
    recommendations.push('Operating on well-established, secure chain');
  }

  return recommendations;
}

/**
 * Calculate comprehensive risk score for a pool
 */
export function calculateRiskScore(pool: YieldPool): RiskAssessment {
  const factors: RiskFactors = {
    ilRisk: calculateILRisk(pool),
    smartContractRisk: calculateSmartContractRisk(pool),
    protocolRisk: calculateProtocolRisk(pool),
    chainRisk: calculateChainRisk(pool),
  };

  // Weighted average of risk factors
  const weights = {
    ilRisk: 0.20,
    smartContractRisk: 0.35,
    protocolRisk: 0.25,
    chainRisk: 0.20,
  };

  const weightedRisk = 
    factors.ilRisk * weights.ilRisk +
    factors.smartContractRisk * weights.smartContractRisk +
    factors.protocolRisk * weights.protocolRisk +
    factors.chainRisk * weights.chainRisk;

  const overallRisk = Math.max(1, Math.min(10, Math.round(weightedRisk)));

  // Get audit info
  const audits: string[] = [];
  if (pool.audit_links && Array.isArray(pool.audit_links)) {
    audits.push(...pool.audit_links);
  }

  const warnings = generateWarnings(pool, factors);
  const recommendations = generateRecommendations(pool, factors, overallRisk);
  const riskLevel = getRiskLevel(overallRisk);

  return {
    overallRisk,
    riskLevel,
    factors,
    audits,
    warnings,
    recommendations,
  };
}

/**
 * Get a simple risk score (1-10) for a pool
 */
export function getSimpleRiskScore(pool: YieldPool): number {
  return calculateRiskScore(pool).overallRisk;
}

/**
 * Check if a pool meets minimum safety criteria
 */
export function meetsMinimumSafetyStandards(pool: YieldPool): boolean {
  const assessment = calculateRiskScore(pool);
  return (
    assessment.overallRisk <= 7 &&
    !pool.outlier &&
    pool.tvlUsd >= 10_000 &&
    pool.apy < 1000 &&
    pool.apy > 0
  );
}
