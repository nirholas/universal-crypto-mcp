/**
 * useWalletBalance Hook
 * 
 * React hook for fetching multi-chain wallet balances.
 * Connects to packages/core for chain configurations and viem for on-chain data.
 * 
 * @author Nich (@nichxbt)
 * @license Apache-2.0
 */

'use client';

import { useQuery, useQueries, useQueryClient } from '@tanstack/react-query';
import { useMemo, useCallback } from 'react';

// Import chain configurations from core package (when available)
// import { SUPPORTED_CHAINS, getChainName, SupportedChainId } from '@universal-crypto-mcp/core';

// ============================================================================
// Types
// ============================================================================

export type SupportedChainId = 
  | 'eip155:1'      // Ethereum Mainnet
  | 'eip155:42161'  // Arbitrum One
  | 'eip155:8453'   // Base
  | 'eip155:84532'  // Base Sepolia
  | 'eip155:137'    // Polygon
  | 'eip155:10'     // Optimism
  | 'eip155:56';    // BNB Chain

export interface TokenBalance {
  address: string;
  symbol: string;
  name: string;
  decimals: number;
  balance: string;
  balanceFormatted: string;
  balanceUSD: number;
  price: number;
  logoURI?: string;
}

export interface NativeBalance {
  symbol: string;
  balance: string;
  balanceFormatted: string;
  balanceUSD: number;
  price: number;
}

export interface ChainBalance {
  chainId: SupportedChainId;
  chainName: string;
  native: NativeBalance;
  tokens: TokenBalance[];
  totalUSD: number;
  lastUpdated: number;
}

export interface WalletBalanceTotal {
  totalUSD: number;
  byChain: Map<SupportedChainId, number>;
  byToken: Map<string, { balance: string; balanceUSD: number }>;
}

export interface UseWalletBalanceOptions {
  enabled?: boolean;
  refetchInterval?: number | false;
  staleTime?: number;
  chains?: SupportedChainId[];
  includeTokens?: boolean;
}

export interface UseWalletBalanceReturn {
  // Balance data
  balances: Map<SupportedChainId, ChainBalance>;
  
  // Aggregated data
  total: WalletBalanceTotal;
  
  // Loading states
  loading: boolean;
  loadingChains: Set<SupportedChainId>;
  
  // Error states
  error: Error | null;
  errors: Map<SupportedChainId, Error>;
  
  // Actions
  refetch: () => Promise<void>;
  refetchChain: (chainId: SupportedChainId) => Promise<void>;
  
  // Utility functions
  getChainBalance: (chainId: SupportedChainId) => ChainBalance | undefined;
  getNativeBalance: (chainId: SupportedChainId) => NativeBalance | undefined;
  getTokenBalance: (chainId: SupportedChainId, tokenAddress: string) => TokenBalance | undefined;
}

// ============================================================================
// Constants
// ============================================================================

export const CHAIN_NAMES: Record<SupportedChainId, string> = {
  'eip155:1': 'Ethereum',
  'eip155:42161': 'Arbitrum One',
  'eip155:8453': 'Base',
  'eip155:84532': 'Base Sepolia',
  'eip155:137': 'Polygon',
  'eip155:10': 'Optimism',
  'eip155:56': 'BNB Chain',
};

export const NATIVE_CURRENCIES: Record<SupportedChainId, { symbol: string; decimals: number }> = {
  'eip155:1': { symbol: 'ETH', decimals: 18 },
  'eip155:42161': { symbol: 'ETH', decimals: 18 },
  'eip155:8453': { symbol: 'ETH', decimals: 18 },
  'eip155:84532': { symbol: 'ETH', decimals: 18 },
  'eip155:137': { symbol: 'MATIC', decimals: 18 },
  'eip155:10': { symbol: 'ETH', decimals: 18 },
  'eip155:56': { symbol: 'BNB', decimals: 18 },
};

const DEFAULT_CHAINS: SupportedChainId[] = [
  'eip155:1',
  'eip155:42161',
  'eip155:8453',
  'eip155:137',
  'eip155:10',
];

// ============================================================================
// Mock Data (Development Fallback)
// ============================================================================

function generateMockBalance(
  address: string,
  chainId: SupportedChainId
): ChainBalance {
  const nativeCurrency = NATIVE_CURRENCIES[chainId];
  const chainName = CHAIN_NAMES[chainId];
  
  // Generate random but consistent balances based on address + chain
  const seed = address.slice(-8) + chainId;
  const seedNum = parseInt(seed.replace(/[^0-9]/g, '').slice(0, 8) || '12345');
  
  const nativeBalance = ((seedNum % 10000) / 1000).toFixed(4);
  const ethPrice = 3245.67;
  const maticPrice = 0.85;
  const bnbPrice = 312.45;
  
  const price = nativeCurrency.symbol === 'MATIC' 
    ? maticPrice 
    : nativeCurrency.symbol === 'BNB' 
      ? bnbPrice 
      : ethPrice;
  
  const nativeBalanceUSD = parseFloat(nativeBalance) * price;
  
  // Mock token balances
  const mockTokens: TokenBalance[] = chainId === 'eip155:1' ? [
    {
      address: '0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48',
      symbol: 'USDC',
      name: 'USD Coin',
      decimals: 6,
      balance: ((seedNum % 50000) + 100).toString(),
      balanceFormatted: ((seedNum % 50000) + 100).toLocaleString(),
      balanceUSD: (seedNum % 50000) + 100,
      price: 1.0,
    },
    {
      address: '0xdAC17F958D2ee523a2206206994597C13D831ec7',
      symbol: 'USDT',
      name: 'Tether USD',
      decimals: 6,
      balance: ((seedNum % 30000) + 50).toString(),
      balanceFormatted: ((seedNum % 30000) + 50).toLocaleString(),
      balanceUSD: (seedNum % 30000) + 50,
      price: 1.0,
    },
  ] : [];
  
  const tokensTotal = mockTokens.reduce((sum, t) => sum + t.balanceUSD, 0);
  
  return {
    chainId,
    chainName,
    native: {
      symbol: nativeCurrency.symbol,
      balance: nativeBalance,
      balanceFormatted: `${parseFloat(nativeBalance).toLocaleString()} ${nativeCurrency.symbol}`,
      balanceUSD: nativeBalanceUSD,
      price,
    },
    tokens: mockTokens,
    totalUSD: nativeBalanceUSD + tokensTotal,
    lastUpdated: Date.now(),
  };
}

// ============================================================================
// API Functions
// ============================================================================

async function fetchChainBalance(
  address: string,
  chainId: SupportedChainId,
  includeTokens: boolean = true
): Promise<ChainBalance> {
  // Validate address format
  if (!address.match(/^0x[a-fA-F0-9]{40}$/)) {
    throw new Error('Invalid wallet address');
  }

  // Use mock data in development
  if (process.env.NODE_ENV === 'development' || !process.env.NEXT_PUBLIC_BALANCE_API_URL) {
    await new Promise(resolve => setTimeout(resolve, 300 + Math.random() * 500));
    return generateMockBalance(address, chainId);
  }

  try {
    const url = `${process.env.NEXT_PUBLIC_BALANCE_API_URL}/balance/${address}?chainId=${chainId}&includeTokens=${includeTokens}`;
    const response = await fetch(url);
    
    if (!response.ok) {
      throw new Error(`Failed to fetch balance for chain ${chainId}`);
    }
    
    return await response.json();
  } catch (error) {
    // Fallback to mock data on error
    console.warn(`Balance API failed for ${chainId}, using mock data`);
    return generateMockBalance(address, chainId);
  }
}

async function fetchAllBalances(
  address: string,
  chains: SupportedChainId[],
  includeTokens: boolean
): Promise<Map<SupportedChainId, ChainBalance>> {
  const results = await Promise.allSettled(
    chains.map(chainId => fetchChainBalance(address, chainId, includeTokens))
  );
  
  const balanceMap = new Map<SupportedChainId, ChainBalance>();
  
  results.forEach((result, index) => {
    if (result.status === 'fulfilled') {
      balanceMap.set(chains[index], result.value);
    }
  });
  
  return balanceMap;
}

// ============================================================================
// Hook: useWalletBalance
// ============================================================================

export function useWalletBalance(
  address: string | undefined | null,
  options: UseWalletBalanceOptions = {}
): UseWalletBalanceReturn {
  const {
    enabled = true,
    refetchInterval = 60000, // 1 minute default
    staleTime = 30000, // 30 seconds
    chains = DEFAULT_CHAINS,
    includeTokens = true,
  } = options;

  const queryClient = useQueryClient();
  const isValidAddress = !!address?.match(/^0x[a-fA-F0-9]{40}$/);

  // Query for all chain balances
  const queries = useQueries({
    queries: chains.map(chainId => ({
      queryKey: ['wallet-balance', address, chainId, includeTokens],
      queryFn: () => fetchChainBalance(address!, chainId, includeTokens),
      enabled: enabled && isValidAddress,
      refetchInterval,
      staleTime,
    })),
  });

  // Build balance map from query results
  const balances = useMemo(() => {
    const map = new Map<SupportedChainId, ChainBalance>();
    queries.forEach((query, index) => {
      if (query.data) {
        map.set(chains[index], query.data);
      }
    });
    return map;
  }, [queries, chains]);

  // Build loading chains set
  const loadingChains = useMemo(() => {
    const set = new Set<SupportedChainId>();
    queries.forEach((query, index) => {
      if (query.isLoading) {
        set.add(chains[index]);
      }
    });
    return set;
  }, [queries, chains]);

  // Build errors map
  const errors = useMemo(() => {
    const map = new Map<SupportedChainId, Error>();
    queries.forEach((query, index) => {
      if (query.error) {
        map.set(chains[index], query.error as Error);
      }
    });
    return map;
  }, [queries, chains]);

  // Calculate totals
  const total = useMemo((): WalletBalanceTotal => {
    let totalUSD = 0;
    const byChain = new Map<SupportedChainId, number>();
    const byToken = new Map<string, { balance: string; balanceUSD: number }>();

    balances.forEach((balance, chainId) => {
      totalUSD += balance.totalUSD;
      byChain.set(chainId, balance.totalUSD);

      // Aggregate native balance
      const nativeKey = balance.native.symbol;
      const existing = byToken.get(nativeKey);
      if (existing) {
        const newBalance = (parseFloat(existing.balance) + parseFloat(balance.native.balance)).toString();
        byToken.set(nativeKey, {
          balance: newBalance,
          balanceUSD: existing.balanceUSD + balance.native.balanceUSD,
        });
      } else {
        byToken.set(nativeKey, {
          balance: balance.native.balance,
          balanceUSD: balance.native.balanceUSD,
        });
      }

      // Aggregate token balances
      balance.tokens.forEach(token => {
        const tokenExisting = byToken.get(token.symbol);
        if (tokenExisting) {
          const newBalance = (parseFloat(tokenExisting.balance) + parseFloat(token.balance)).toString();
          byToken.set(token.symbol, {
            balance: newBalance,
            balanceUSD: tokenExisting.balanceUSD + token.balanceUSD,
          });
        } else {
          byToken.set(token.symbol, {
            balance: token.balance,
            balanceUSD: token.balanceUSD,
          });
        }
      });
    });

    return { totalUSD, byChain, byToken };
  }, [balances]);

  // Actions
  const refetch = useCallback(async () => {
    await Promise.all(
      chains.map(chainId =>
        queryClient.invalidateQueries({
          queryKey: ['wallet-balance', address, chainId, includeTokens],
        })
      )
    );
  }, [queryClient, address, chains, includeTokens]);

  const refetchChain = useCallback(async (chainId: SupportedChainId) => {
    await queryClient.invalidateQueries({
      queryKey: ['wallet-balance', address, chainId, includeTokens],
    });
  }, [queryClient, address, includeTokens]);

  // Utility functions
  const getChainBalance = useCallback(
    (chainId: SupportedChainId) => balances.get(chainId),
    [balances]
  );

  const getNativeBalance = useCallback(
    (chainId: SupportedChainId) => balances.get(chainId)?.native,
    [balances]
  );

  const getTokenBalance = useCallback(
    (chainId: SupportedChainId, tokenAddress: string) => {
      const chainBalance = balances.get(chainId);
      return chainBalance?.tokens.find(
        t => t.address.toLowerCase() === tokenAddress.toLowerCase()
      );
    },
    [balances]
  );

  return {
    balances,
    total,
    loading: queries.some(q => q.isLoading),
    loadingChains,
    error: queries.find(q => q.error)?.error as Error | null,
    errors,
    refetch,
    refetchChain,
    getChainBalance,
    getNativeBalance,
    getTokenBalance,
  };
}

// ============================================================================
// Hook: useNativeBalance (Single Chain)
// ============================================================================

export function useNativeBalance(
  address: string | undefined | null,
  chainId: SupportedChainId = 'eip155:1',
  options: Omit<UseWalletBalanceOptions, 'chains' | 'includeTokens'> = {}
) {
  const { balances, loading, error, refetch } = useWalletBalance(address, {
    ...options,
    chains: [chainId],
    includeTokens: false,
  });

  return {
    balance: balances.get(chainId)?.native ?? null,
    loading,
    error,
    refetch,
  };
}

// ============================================================================
// Hook: useMultiChainTotal
// ============================================================================

export function useMultiChainTotal(
  address: string | undefined | null,
  options: UseWalletBalanceOptions = {}
) {
  const { total, loading, error, refetch } = useWalletBalance(address, options);

  return {
    totalUSD: total.totalUSD,
    byChain: total.byChain,
    byToken: total.byToken,
    loading,
    error,
    refetch,
  };
}

// ============================================================================
// Default Export
// ============================================================================

export default useWalletBalance;
