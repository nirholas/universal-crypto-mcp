/**
 * MCP Tool: getDeFiPositions
 * Get DeFi protocol positions for a wallet
 */

import { z } from 'zod';
import { defiLlamaClient } from '../apis/defillama';

export const getDeFiPositionsSchema = z.object({
  address: z.string().regex(/^0x[a-fA-F0-9]{40}$/, 'Invalid Ethereum address'),
});

export type GetDeFiPositionsInput = z.infer<typeof getDeFiPositionsSchema>;

export interface DeFiPosition {
  protocol: string;
  category: string;
  chain: string;
  type: 'lending' | 'borrowing' | 'liquidity' | 'staking' | 'farming' | 'other';
  valueUsd: number;
  rewardUsd?: number;
  debtUsd?: number;
  healthFactor?: number;
}

export interface GetDeFiPositionsOutput {
  address: string;
  totalValueUsd: number;
  totalDebtUsd: number;
  netValueUsd: number;
  positions: DeFiPosition[];
  protocolCount: number;
  lastUpdated: string;
}

export const getDeFiPositionsDefinition = {
  name: 'getDeFiPositions',
  description:
    'Get all DeFi protocol positions for a wallet including lending, borrowing, liquidity positions, and staking',
  inputSchema: {
    type: 'object' as const,
    properties: {
      address: {
        type: 'string',
        description: 'Wallet address (0x...)',
      },
    },
    required: ['address'],
  },
};

function categorizePosition(category: string): DeFiPosition['type'] {
  const lowerCategory = category.toLowerCase();
  if (lowerCategory.includes('lend')) return 'lending';
  if (lowerCategory.includes('borrow')) return 'borrowing';
  if (lowerCategory.includes('liquid') || lowerCategory.includes('dex')) return 'liquidity';
  if (lowerCategory.includes('stak')) return 'staking';
  if (lowerCategory.includes('farm') || lowerCategory.includes('yield')) return 'farming';
  return 'other';
}

export async function getDeFiPositions(
  input: GetDeFiPositionsInput
): Promise<GetDeFiPositionsOutput> {
  const { address } = getDeFiPositionsSchema.parse(input);

  const rawPositions = await defiLlamaClient.getPositions(address);

  const positions: DeFiPosition[] = rawPositions.map((pos) => ({
    protocol: pos.name || pos.protocol,
    category: pos.category,
    chain: pos.chain,
    type: categorizePosition(pos.category),
    valueUsd: pos.balanceUsd || 0,
    rewardUsd: pos.rewardUsd,
    debtUsd: pos.debtUsd,
  }));

  const totalValueUsd = positions.reduce((sum, p) => sum + p.valueUsd, 0);
  const totalDebtUsd = positions.reduce((sum, p) => sum + (p.debtUsd || 0), 0);

  // Sort by value
  positions.sort((a, b) => b.valueUsd - a.valueUsd);

  // Count unique protocols
  const uniqueProtocols = new Set(positions.map((p) => p.protocol));

  return {
    address,
    totalValueUsd: Math.round(totalValueUsd * 100) / 100,
    totalDebtUsd: Math.round(totalDebtUsd * 100) / 100,
    netValueUsd: Math.round((totalValueUsd - totalDebtUsd) * 100) / 100,
    positions,
    protocolCount: uniqueProtocols.size,
    lastUpdated: new Date().toISOString(),
  };
}
