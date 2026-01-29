/**
 * getRiskAssessment - Get comprehensive risk assessment for a pool
 * 
 * Provides detailed risk analysis including:
 * - Overall risk score (1-10)
 * - Individual risk factors
 * - Audit information
 * - Warnings and recommendations
 */

import { defiLlamaClient } from '../apis/defillama';
import { calculateRiskScore } from '../utils/risk';
import { GetRiskAssessmentInput, RiskAssessmentResult } from '../types';

/**
 * Tool definition for MCP registration
 */
export const getRiskAssessmentDefinition = {
  name: 'getRiskAssessment',
  description: 'Get comprehensive risk assessment for a yield pool including risk score, audit status, and warnings.',
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
 * Validate pool ID
 */
function validatePoolId(poolId: unknown): string {
  if (!poolId || typeof poolId !== 'string') {
    throw new Error('poolId is required and must be a string');
  }
  
  const trimmed = poolId.trim();
  if (trimmed.length === 0) {
    throw new Error('poolId cannot be empty');
  }
  
  return trimmed;
}

export async function getRiskAssessment(input: GetRiskAssessmentInput): Promise<RiskAssessmentResult> {
  const poolId = validatePoolId(input.poolId);

  // Fetch pool data
  const pool = await defiLlamaClient.getPool(poolId);

  if (!pool) {
    throw new Error(`Pool not found: ${poolId}. Verify the pool ID from DeFiLlama.`);
  }

  // Calculate comprehensive risk assessment
  const assessment = calculateRiskScore(pool);

  return {
    overallRisk: assessment.overallRisk,
    riskLevel: assessment.riskLevel,
    factors: assessment.factors,
    audits: assessment.audits,
    warnings: assessment.warnings,
    recommendations: assessment.recommendations,
  };
}
