/**
 * getYieldHistory - Get historical APY and TVL data
 */

import { defiLlamaClient } from '../apis/defillama';
import { GetYieldHistoryInput, YieldHistoryResult } from '../types';

/**
 * Tool definition for MCP registration
 */
export const getYieldHistoryDefinition = {
  name: 'getYieldHistory',
  description: 'Get historical APY and TVL data for a yield pool over a specified time period.',
  inputSchema: {
    type: 'object' as const,
    properties: {
      poolId: {
        type: 'string',
        description: 'The DeFiLlama pool identifier',
      },
      days: {
        type: 'number',
        description: 'Number of days of history (default: 30)',
      },
    },
    required: ['poolId'],
  },
};

export async function getYieldHistory(input: GetYieldHistoryInput): Promise<YieldHistoryResult[]> {
  const { poolId, days = 30 } = input;

  if (!poolId) {
    throw new Error('poolId is required');
  }

  // Verify pool exists
  const pool = await defiLlamaClient.getPool(poolId);
  if (!pool) {
    throw new Error(`Pool not found: ${poolId}`);
  }

  // Get history
  const history = await defiLlamaClient.getHistory(poolId);

  if (!history || history.length === 0) {
    return [];
  }

  // Calculate cutoff date
  const cutoffDate = new Date();
  cutoffDate.setDate(cutoffDate.getDate() - days);
  const cutoffTimestamp = cutoffDate.getTime();

  // Filter and transform history
  const filteredHistory = history
    .filter(point => {
      const pointDate = new Date(point.timestamp);
      return pointDate.getTime() >= cutoffTimestamp;
    })
    .map(point => ({
      timestamp: point.timestamp,
      apy: Math.round(point.apy * 100) / 100,
      tvl: Math.round(point.tvlUsd),
    }));

  // Sort by timestamp ascending
  filteredHistory.sort((a, b) => 
    new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime()
  );

  return filteredHistory;
}
