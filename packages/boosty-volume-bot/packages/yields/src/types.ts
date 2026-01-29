/**
 * Type definitions for the yields MCP server
 * 
 * These types are based on the DeFiLlama Yields API schema.
 * @see https://yields.llama.fi/pools
 */

/**
 * Yield pool data from DeFiLlama
 */
export interface YieldPool {
  /** Unique pool identifier */
  pool: string;
  /** Blockchain network */
  chain: string;
  /** Protocol/project name */
  project: string;
  /** Token symbol(s) in the pool */
  symbol: string;
  /** Total value locked in USD */
  tvlUsd: number;
  /** Base APY from trading fees/interest */
  apyBase: number | null;
  /** Reward APY from token emissions */
  apyReward: number | null;
  /** Total APY (apyBase + apyReward) */
  apy: number;
  /** Reward token addresses */
  rewardTokens: string[] | null;
  /** Underlying token addresses */
  underlyingTokens: string[] | null;
  /** Impermanent loss risk indicator */
  ilRisk: string;
  /** Exposure type: 'single' or 'multi' */
  exposure: string;
  /** Whether pool contains only stablecoins */
  stablecoin: boolean;
  /** Additional pool metadata */
  poolMeta: string | null;
  /** Mean APY (statistical) */
  mu: number | null;
  /** Standard deviation of APY */
  sigma: number | null;
  /** Data point count */
  count: number | null;
  /** Statistical outlier flag */
  outlier: boolean;
  /** Number of audits */
  audits: string | null;
  /** Links to audit reports */
  audit_links: string[] | null;
  /** URL to pool interface */
  url: string | null;
  /** APY from 7 days ago */
  apyPct7D?: number | null;
  /** APY from 30 days ago */
  apyPct30D?: number | null;
  /** Mean APY over 7 days */
  apyMean7d?: number | null;
  /** Mean APY over 30 days */
  apyMean30d?: number | null;
  /** Volume in USD (24h) */
  volumeUsd1d?: number | null;
  /** Volume in USD (7d) */
  volumeUsd7d?: number | null;
  /** APY breakdown by source */
  apyBreakdown?: Record<string, number> | null;
}

/**
 * Historical yield data point
 */
export interface YieldHistoryPoint {
  /** ISO timestamp */
  timestamp: string;
  /** Total value locked in USD */
  tvlUsd: number;
  /** Total APY at this point */
  apy: number;
  /** Base APY */
  apyBase: number | null;
  /** Reward APY */
  apyReward: number | null;
}

/**
 * Simplified yield result for top yields listing
 */
export interface TopYieldResult {
  /** Pool identifier */
  pool: string;
  /** Protocol name */
  protocol: string;
  /** Chain name */
  chain: string;
  /** Total APY percentage */
  apy: number;
  /** Total value locked in USD */
  tvl: number;
  /** Token symbols in the pool */
  tokens: string[];
  /** Risk score (1-10, lower is safer) */
  risk: number;
  /** Whether this is a stablecoin pool */
  stablecoin?: boolean;
}

/**
 * Detailed pool information
 */
export interface PoolDetailsResult {
  /** Pool identifier */
  pool: string;
  /** Protocol name */
  protocol: string;
  /** Chain name */
  chain: string;
  /** Total APY percentage */
  apy: number;
  /** Base APY from fees/interest */
  apyBase: number | null;
  /** Reward APY from emissions */
  apyReward: number | null;
  /** Total value locked in USD */
  tvl: number;
  /** Token symbols */
  tokens: string[];
  /** Impermanent loss risk indicator */
  ilRisk: string;
  /** Whether protocol has been audited */
  audited: boolean;
  /** Number of audits */
  auditCount: number;
  /** URL to pool interface */
  url: string | null;
  /** Whether this is a stablecoin pool */
  stablecoin: boolean;
  /** Pool exposure type */
  exposure: string;
}

/**
 * Historical yield data point (simplified)
 */
export interface YieldHistoryResult {
  /** ISO timestamp */
  timestamp: string;
  /** APY at this point */
  apy: number;
  /** TVL at this point */
  tvl: number;
}

/**
 * Yield comparison result with recommendations
 */
export interface YieldComparisonResult {
  /** Pool identifier */
  poolId: string;
  /** Protocol name */
  protocol: string;
  /** Chain name */
  chain: string;
  /** Total APY percentage */
  apy: number;
  /** Total value locked in USD */
  tvl: number;
  /** Risk score (1-10) */
  risk: number;
  /** Risk level category */
  riskLevel: 'low' | 'medium' | 'high' | 'very-high';
  /** Analysis and recommendations */
  recommendation: string;
  /** Whether this is a stablecoin pool */
  stablecoin: boolean;
}

/**
 * Stablecoin yield result
 */
export interface StablecoinYieldResult {
  /** Pool identifier */
  pool: string;
  /** Protocol name */
  protocol: string;
  /** Chain name */
  chain: string;
  /** Total APY percentage */
  apy: number;
  /** Total value locked in USD */
  tvl: number;
  /** Primary stablecoin in pool */
  stablecoin: string;
  /** Risk score (1-10) */
  risk: number;
}

/**
 * LP yield result for token pairs
 */
export interface LPYieldResult {
  /** Pool identifier */
  pool: string;
  /** Protocol name */
  protocol: string;
  /** Chain name */
  chain: string;
  /** Total APY percentage */
  apy: number;
  /** Total value locked in USD */
  tvl: number;
  /** Trading fee percentage (if available) */
  fee: number | null;
  /** Impermanent loss risk */
  ilRisk: string;
  /** Risk score (1-10) */
  risk: number;
}

/**
 * Estimated returns calculation
 */
export interface EstimatedReturnsResult {
  /** Initial investment amount */
  principal: number;
  /** Estimated total return in USD */
  estimatedReturn: number;
  /** Pool APY used for calculation */
  apy: number;
  /** Final value (principal + returns) */
  finalValue: number;
  /** Average daily return */
  dailyReturn: number;
  /** Investment period in days */
  periodDays: number;
  /** Disclaimer about estimates */
  disclaimer: string;
}

/**
 * Comprehensive risk assessment
 */
export interface RiskAssessmentResult {
  /** Overall risk score (1-10) */
  overallRisk: number;
  /** Risk level category */
  riskLevel: 'low' | 'medium' | 'high' | 'very-high';
  /** Individual risk factors */
  factors: {
    /** Impermanent loss risk (1-10) */
    ilRisk: number;
    /** Smart contract risk (1-10) */
    smartContractRisk: number;
    /** Protocol maturity risk (1-10) */
    protocolRisk: number;
    /** Chain security risk (1-10) */
    chainRisk: number;
  };
  /** Audit report links */
  audits: string[];
  /** Risk warnings */
  warnings: string[];
  /** Recommendations based on risk analysis */
  recommendations: string[];
}

// Input types for tools
export interface GetTopYieldsInput {
  chain?: string;
  minTvl?: number;
  minApy?: number;
  maxRisk?: number;
  limit?: number;
  stablecoinOnly?: boolean;
}

export interface GetPoolDetailsInput {
  poolId: string;
}

export interface GetYieldHistoryInput {
  poolId: string;
  days?: number;
}

export interface CompareYieldsInput {
  poolIds: string[];
}

export interface GetStablecoinYieldsInput {
  stablecoin?: string;
  chain?: string;
  minApy?: number;
}

export interface GetLPYieldsInput {
  token0: string;
  token1: string;
  chain?: string;
}

export interface EstimateReturnsInput {
  poolId: string;
  amount: number;
  days: number;
}

export interface GetRiskAssessmentInput {
  poolId: string;
}
