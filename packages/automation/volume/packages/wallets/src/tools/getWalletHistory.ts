/**
 * getWalletHistory Tool
 * Get transaction history for a wallet on a specific chain
 */

import { z } from 'zod';
import { Cache, type Chain } from '../lib';
import { getAlchemyClient } from '../apis/alchemy';
import { isValidAddress, normalizeAddress } from '../utils/address';
import type { TransactionType } from '../types';

// Input schema
export const getWalletHistorySchema = {
  type: 'object' as const,
  properties: {
    address: {
      type: 'string',
      description: 'Wallet address to get history for',
    },
    chain: {
      type: 'string',
      description: 'Chain identifier (e.g., ethereum, arbitrum, polygon)',
      default: 'ethereum',
      enum: ['ethereum', 'arbitrum', 'base', 'polygon'],
    },
    limit: {
      type: 'number',
      description: 'Maximum number of transactions to return (default: 50, max: 100)',
    },
  },
  required: ['address'],
};

// Tool definition for MCP registration
export const getWalletHistoryDefinition = {
  name: 'getWalletHistory',
  description: 'Get transaction history for a wallet on a specific blockchain network',
  inputSchema: getWalletHistorySchema,
};

// Zod validation schema
const inputSchema = z.object({
  address: z.string().min(1),
  chain: z.string().min(1),
  limit: z.number().min(1).max(100).optional().default(50),
});

// Transaction interface for output
interface Transaction {
  hash: string;
  type: TransactionType;
  from: string;
  to: string;
  value: string;
  timestamp: number;
  status: 'success' | 'failed' | 'pending';
  gasUsed?: string;
  gasPrice?: string;
  blockNumber?: number;
  chain: Chain;
}

// Output interface
interface WalletHistoryOutput {
  address: string;
  chain: Chain;
  transactions: Transaction[];
  total: number;
  lastUpdated: string;
}

// Cache with 1 minute TTL
const cache = new Cache({ defaultTTL: 60 });

function mapTypeToTransactionType(type: string): TransactionType {
  const mapping: Record<string, TransactionType> = {
    transfer: 'transfer',
    swap: 'swap',
    approve: 'approve',
    mint: 'mint',
    burn: 'burn',
    stake: 'stake',
    unstake: 'unstake',
    claim: 'claim',
    deposit: 'deposit',
    withdraw: 'withdraw',
    contract_interaction: 'contract_interaction',
  };
  return mapping[type] || 'unknown';
}

/**
 * Get transaction history for a wallet
 */
export async function getWalletHistory(args: unknown): Promise<WalletHistoryOutput> {
  // Validate input
  const input = inputSchema.parse(args);
  const { address, chain, limit } = input;

  // Validate address
  if (!isValidAddress(address)) {
    throw new Error(`Invalid address: ${address}`);
  }

  const normalizedAddress = normalizeAddress(address);
  const chainId = chain as Chain;

  // Check cache
  const cacheKey = `history:${normalizedAddress}:${chainId}:${limit}`;
  const cached = cache.get<WalletHistoryOutput>(cacheKey);
  if (cached) {
    return cached;
  }

  // Fetch from Alchemy
  const alchemyClient = getAlchemyClient();
  const rawTransactions = await alchemyClient.getHistory(normalizedAddress, chainId, limit);

  // Map to proper transaction type
  const transactions: Transaction[] = rawTransactions.map((tx) => ({
    ...tx,
    type: mapTypeToTransactionType(tx.type),
  }));

  const result: WalletHistoryOutput = {
    address: normalizedAddress,
    chain: chainId,
    transactions,
    total: transactions.length,
    lastUpdated: new Date().toISOString(),
  };

  // Cache the result
  cache.set(cacheKey, result);

  return result;
}

// For testing
export { inputSchema as walletHistoryInputSchema };
