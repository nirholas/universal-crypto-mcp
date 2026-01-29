/**
 * MCP Tool: getTokenBalances
 * Get detailed token balances for a wallet
 */

import { z } from 'zod';
import { alchemyClient } from '../apis/alchemy';
import { type Chain } from '../lib';

export const getTokenBalancesSchema = z.object({
  address: z.string().regex(/^0x[a-fA-F0-9]{40}$/, 'Invalid Ethereum address'),
  chain: z.enum(['ethereum', 'arbitrum', 'base', 'polygon']).default('ethereum'),
  includeSpam: z.boolean().default(false),
});

export type GetTokenBalancesInput = z.infer<typeof getTokenBalancesSchema>;

export interface TokenBalance {
  contractAddress: string;
  symbol: string;
  name: string;
  decimals: number;
  balance: string;
  rawBalance: string;
  logoUrl?: string;
}

export interface GetTokenBalancesOutput {
  address: string;
  chain: string;
  nativeBalance: {
    symbol: string;
    balance: string;
  };
  tokens: TokenBalance[];
  totalTokens: number;
  lastUpdated: string;
}

export const getTokenBalancesDefinition = {
  name: 'getTokenBalances',
  description:
    'Get detailed ERC20 token balances for a wallet address including native token balance',
  inputSchema: {
    type: 'object' as const,
    properties: {
      address: {
        type: 'string',
        description: 'Wallet address (0x...)',
      },
      chain: {
        type: 'string',
        description: 'Blockchain network',
        default: 'ethereum',
        enum: ['ethereum', 'arbitrum', 'base', 'polygon'],
      },
      includeSpam: {
        type: 'boolean',
        description: 'Include potential spam tokens',
        default: false,
      },
    },
    required: ['address'],
  },
};

export async function getTokenBalances(
  input: GetTokenBalancesInput
): Promise<GetTokenBalancesOutput> {
  const { address, chain } = getTokenBalancesSchema.parse(input);

  const [tokenBalances, ethBalance] = await Promise.all([
    alchemyClient.getTokenBalances(address, chain as Chain),
    alchemyClient.getETHBalance(address, chain as Chain),
  ]);

  const nativeBalance = parseInt(ethBalance, 16) / 1e18;
  const nativeSymbol = chain === 'polygon' ? 'MATIC' : 'ETH';

  const tokens: TokenBalance[] = tokenBalances
    .filter((t) => t.metadata)
    .map((token) => {
      const decimals = token.metadata!.decimals;
      const balance = parseInt(token.balance, 16) / Math.pow(10, decimals);
      return {
        contractAddress: token.contractAddress,
        symbol: token.metadata!.symbol || 'UNKNOWN',
        name: token.metadata!.name || 'Unknown Token',
        decimals,
        balance: balance.toFixed(decimals > 6 ? 6 : decimals),
        rawBalance: token.balance,
        logoUrl: token.metadata!.logo,
      };
    })
    .filter((t) => parseFloat(t.balance) > 0);

  return {
    address,
    chain,
    nativeBalance: {
      symbol: nativeSymbol,
      balance: nativeBalance.toFixed(6),
    },
    tokens,
    totalTokens: tokens.length,
    lastUpdated: new Date().toISOString(),
  };
}
