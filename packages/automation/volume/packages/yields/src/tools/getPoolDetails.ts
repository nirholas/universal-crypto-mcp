/**
 * getPoolDetails - Get detailed information about a yield pool
 * 
 * Returns comprehensive pool information including APY breakdown,
 * TVL, tokens, audit status, and risk assessment.
 */

import { defiLlamaClient } from '../apis/defillama';
import { GetPoolDetailsInput, PoolDetailsResult } from '../types';

/**
 * Tool definition for MCP registration
 */
export const getPoolDetailsDefinition = {
  name: 'getPoolDetails',
  description: 'Get detailed information about a specific yield pool including APY breakdown, TVL, tokens, and audit status.',
  inputSchema: {
    type: 'object' as const,
    properties: {
      poolId: {
        type: 'string',
        description: 'The DeFiLlama pool identifier',
      },
    },
    required: ['poolId'],
  },
};

/**
 * Validate pool ID format
 */
function validatePoolId(poolId: unknown): string {
  if (!poolId || typeof poolId !== 'string') {
    throw new Error('poolId is required and must be a string');
  }
  
  const trimmed = poolId.trim();
  if (trimmed.length === 0) {
    throw new Error('poolId cannot be empty');
  }
  
  if (trimmed.length > 200) {
    throw new Error('poolId is too long');
  }
  
  return trimmed;
}

export async function getPoolDetails(input: GetPoolDetailsInput): Promise<PoolDetailsResult> {
  const poolId = validatePoolId(input.poolId);

  const pool = await defiLlamaClient.getPool(poolId);

  if (!pool) {
    throw new Error(`Pool not found: ${poolId}. Verify the pool ID from DeFiLlama.`);
  }

  // Parse audit information
  const auditCount = pool.audits ? parseInt(pool.audits, 10) || 0 : 0;
  const audited = auditCount > 0 || Boolean(pool.audit_links && pool.audit_links.length > 0);

  // Extract token symbols
  const tokens = pool.symbol
    .split('-')
    .map(t => t.trim())
    .filter(t => t.length > 0);

  return {
    pool: pool.pool,
    protocol: pool.project,
    chain: pool.chain,
    apy: Math.round(pool.apy * 100) / 100,
    apyBase: pool.apyBase !== null ? Math.round(pool.apyBase * 100) / 100 : null,
    apyReward: pool.apyReward !== null ? Math.round(pool.apyReward * 100) / 100 : null,
    tvl: Math.round(pool.tvlUsd),
    tokens,
    ilRisk: pool.ilRisk || 'unknown',
    audited,
    auditCount,
    url: pool.url,
    stablecoin: pool.stablecoin,
    exposure: pool.exposure,
  };
}
