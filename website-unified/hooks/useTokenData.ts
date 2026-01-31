/**
 * useTokenData Hook
 * 
 * React hook for fetching token data including prices, metrics, and metadata.
 * Connects to packages/core for token definitions and external APIs for real-time data.
 * 
 * @author Nich (@nichxbt)
 * @license Apache-2.0
 */

'use client';

import { useQuery, useQueries, useMutation, useQueryClient } from '@tanstack/react-query';
import { useMemo, useCallback } from 'react';

// ============================================================================
// Types
// ============================================================================

export interface TokenInfo {
  address: `0x${string}`;
  symbol: string;
  decimals: number;
  name: string;
  chainId?: number;
  logoURI?: string;
}

export interface TokenPrice {
  symbol: string;
  address: string;
  price: number;
  priceChange24h: number;
  priceChangePercent24h: number;
  volume24h: number;
  marketCap: number;
  lastUpdated: number;
}

export interface TokenMetrics {
  symbol: string;
  holders: number;
  transfers24h: number;
  totalSupply: string;
  circulatingSupply: string;
  maxSupply?: string;
  allTimeHigh: number;
  allTimeLow: number;
}

export interface TokenHistoricalPrice {
  timestamp: number;
  price: number;
  volume: number;
}

export interface UseTokenDataOptions {
  enabled?: boolean;
  refetchInterval?: number | false;
  staleTime?: number;
  includeMetrics?: boolean;
}

export interface UseTokenDataReturn {
  // Price data
  price: TokenPrice | null;
  loading: boolean;
  error: Error | null;
  
  // Metrics (optional)
  metrics: TokenMetrics | null;
  
  // Historical data
  historicalPrices: TokenHistoricalPrice[];
  
  // Actions
  refetch: () => Promise<void>;
  getPrice: () => number;
  getPriceFormatted: (decimals?: number) => string;
}

export interface UseMultiTokenDataReturn {
  prices: Map<string, TokenPrice>;
  loading: boolean;
  error: Error | null;
  getPrice: (symbol: string) => TokenPrice | undefined;
  refetch: () => Promise<void>;
}

// ============================================================================
// Mock Data (Development Fallback)
// ============================================================================

const MOCK_PRICES: Record<string, TokenPrice> = {
  ETH: {
    symbol: 'ETH',
    address: '0xEeeeeEeeeEeEeeEeEeEeeEEEeeeeEeeeeeeeEEeE',
    price: 3245.67,
    priceChange24h: 45.23,
    priceChangePercent24h: 1.41,
    volume24h: 12500000000,
    marketCap: 390000000000,
    lastUpdated: Date.now(),
  },
  USDC: {
    symbol: 'USDC',
    address: '0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48',
    price: 1.0,
    priceChange24h: 0.001,
    priceChangePercent24h: 0.1,
    volume24h: 5000000000,
    marketCap: 25000000000,
    lastUpdated: Date.now(),
  },
  USDT: {
    symbol: 'USDT',
    address: '0xdAC17F958D2ee523a2206206994597C13D831ec7',
    price: 1.0,
    priceChange24h: -0.001,
    priceChangePercent24h: -0.1,
    volume24h: 50000000000,
    marketCap: 83000000000,
    lastUpdated: Date.now(),
  },
  WETH: {
    symbol: 'WETH',
    address: '0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2',
    price: 3245.67,
    priceChange24h: 45.23,
    priceChangePercent24h: 1.41,
    volume24h: 800000000,
    marketCap: 8000000000,
    lastUpdated: Date.now(),
  },
  WBTC: {
    symbol: 'WBTC',
    address: '0x2260FAC5E5542a773Aa44fBCfeDf7C193bc2C599',
    price: 67890.12,
    priceChange24h: 1234.56,
    priceChangePercent24h: 1.85,
    volume24h: 450000000,
    marketCap: 9500000000,
    lastUpdated: Date.now(),
  },
};

const MOCK_METRICS: Record<string, TokenMetrics> = {
  ETH: {
    symbol: 'ETH',
    holders: 120000000,
    transfers24h: 1200000,
    totalSupply: '120000000',
    circulatingSupply: '120000000',
    allTimeHigh: 4878.26,
    allTimeLow: 0.42,
  },
  USDC: {
    symbol: 'USDC',
    holders: 2000000,
    transfers24h: 500000,
    totalSupply: '25000000000',
    circulatingSupply: '25000000000',
    allTimeHigh: 1.17,
    allTimeLow: 0.87,
  },
};

// ============================================================================
// API Functions
// ============================================================================

async function fetchTokenPrice(symbol: string): Promise<TokenPrice> {
  // Use mock data in development or when API is unavailable
  if (process.env.NODE_ENV === 'development' || !process.env.NEXT_PUBLIC_PRICE_API_URL) {
    await new Promise(resolve => setTimeout(resolve, 500)); // Simulate network delay
    const mockPrice = MOCK_PRICES[symbol.toUpperCase()];
    if (mockPrice) {
      return {
        ...mockPrice,
        lastUpdated: Date.now(),
        priceChange24h: mockPrice.priceChange24h * (0.9 + Math.random() * 0.2),
      };
    }
    throw new Error(`Token ${symbol} not found`);
  }

  try {
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_PRICE_API_URL}/price/${symbol.toLowerCase()}`
    );
    
    if (!response.ok) {
      throw new Error(`Failed to fetch price for ${symbol}`);
    }
    
    return await response.json();
  } catch (error) {
    // Fallback to mock data on error
    const mockPrice = MOCK_PRICES[symbol.toUpperCase()];
    if (mockPrice) return mockPrice;
    throw error;
  }
}

async function fetchTokenMetrics(symbol: string): Promise<TokenMetrics | null> {
  // Use mock data in development
  if (process.env.NODE_ENV === 'development' || !process.env.NEXT_PUBLIC_METRICS_API_URL) {
    await new Promise(resolve => setTimeout(resolve, 300));
    return MOCK_METRICS[symbol.toUpperCase()] ?? null;
  }

  try {
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_METRICS_API_URL}/metrics/${symbol.toLowerCase()}`
    );
    
    if (!response.ok) return null;
    return await response.json();
  } catch {
    return MOCK_METRICS[symbol.toUpperCase()] ?? null;
  }
}

async function fetchMultipleTokenPrices(symbols: string[]): Promise<Map<string, TokenPrice>> {
  const priceMap = new Map<string, TokenPrice>();
  
  // Batch fetch or parallel individual fetches
  const results = await Promise.allSettled(
    symbols.map(symbol => fetchTokenPrice(symbol))
  );
  
  results.forEach((result, index) => {
    if (result.status === 'fulfilled') {
      priceMap.set(symbols[index].toUpperCase(), result.value);
    }
  });
  
  return priceMap;
}

async function fetchHistoricalPrices(
  symbol: string,
  days: number = 7
): Promise<TokenHistoricalPrice[]> {
  // Generate mock historical data
  if (process.env.NODE_ENV === 'development' || !process.env.NEXT_PUBLIC_PRICE_API_URL) {
    const mockPrice = MOCK_PRICES[symbol.toUpperCase()];
    if (!mockPrice) return [];
    
    const now = Date.now();
    const interval = (days * 24 * 60 * 60 * 1000) / 100; // 100 data points
    
    return Array.from({ length: 100 }, (_, i) => {
      const variance = (Math.random() - 0.5) * 0.1; // ±5% variance
      return {
        timestamp: now - (100 - i) * interval,
        price: mockPrice.price * (1 + variance),
        volume: mockPrice.volume24h / 24 * (0.5 + Math.random()),
      };
    });
  }

  try {
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_PRICE_API_URL}/history/${symbol.toLowerCase()}?days=${days}`
    );
    
    if (!response.ok) return [];
    return await response.json();
  } catch {
    return [];
  }
}

// ============================================================================
// Hook: useTokenData (Single Token)
// ============================================================================

export function useTokenData(
  symbol: string,
  options: UseTokenDataOptions = {}
): UseTokenDataReturn {
  const {
    enabled = true,
    refetchInterval = 30000, // 30 seconds default
    staleTime = 10000, // 10 seconds
    includeMetrics = false,
  } = options;

  const queryClient = useQueryClient();

  // Fetch price data
  const priceQuery = useQuery({
    queryKey: ['token-price', symbol],
    queryFn: () => fetchTokenPrice(symbol),
    enabled: enabled && !!symbol,
    refetchInterval,
    staleTime,
  });

  // Fetch metrics data (optional)
  const metricsQuery = useQuery({
    queryKey: ['token-metrics', symbol],
    queryFn: () => fetchTokenMetrics(symbol),
    enabled: enabled && !!symbol && includeMetrics,
    refetchInterval: refetchInterval ? refetchInterval * 2 : false,
    staleTime: staleTime * 2,
  });

  // Fetch historical prices
  const historicalQuery = useQuery({
    queryKey: ['token-history', symbol],
    queryFn: () => fetchHistoricalPrices(symbol),
    enabled: enabled && !!symbol,
    staleTime: 60000, // 1 minute
    refetchInterval: 60000,
  });

  const refetch = useCallback(async () => {
    await Promise.all([
      queryClient.invalidateQueries({ queryKey: ['token-price', symbol] }),
      queryClient.invalidateQueries({ queryKey: ['token-metrics', symbol] }),
      queryClient.invalidateQueries({ queryKey: ['token-history', symbol] }),
    ]);
  }, [queryClient, symbol]);

  const getPrice = useCallback(() => {
    return priceQuery.data?.price ?? 0;
  }, [priceQuery.data]);

  const getPriceFormatted = useCallback((decimals: number = 2) => {
    const price = priceQuery.data?.price ?? 0;
    if (price >= 1000) {
      return price.toLocaleString('en-US', {
        style: 'currency',
        currency: 'USD',
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
      });
    }
    return price.toLocaleString('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: decimals,
      maximumFractionDigits: decimals,
    });
  }, [priceQuery.data]);

  return {
    price: priceQuery.data ?? null,
    loading: priceQuery.isLoading,
    error: priceQuery.error as Error | null,
    metrics: metricsQuery.data ?? null,
    historicalPrices: historicalQuery.data ?? [],
    refetch,
    getPrice,
    getPriceFormatted,
  };
}

// ============================================================================
// Hook: useMultiTokenData (Multiple Tokens)
// ============================================================================

export function useMultiTokenData(
  symbols: string[],
  options: UseTokenDataOptions = {}
): UseMultiTokenDataReturn {
  const {
    enabled = true,
    refetchInterval = 30000,
    staleTime = 10000,
  } = options;

  const queryClient = useQueryClient();

  const query = useQuery({
    queryKey: ['multi-token-prices', symbols.sort().join(',')],
    queryFn: () => fetchMultipleTokenPrices(symbols),
    enabled: enabled && symbols.length > 0,
    refetchInterval,
    staleTime,
  });

  const getPrice = useCallback((symbol: string): TokenPrice | undefined => {
    return query.data?.get(symbol.toUpperCase());
  }, [query.data]);

  const refetch = useCallback(async () => {
    await queryClient.invalidateQueries({ 
      queryKey: ['multi-token-prices', symbols.sort().join(',')] 
    });
  }, [queryClient, symbols]);

  return {
    prices: query.data ?? new Map(),
    loading: query.isLoading,
    error: query.error as Error | null,
    getPrice,
    refetch,
  };
}

// ============================================================================
// Hook: useTokenSearch
// ============================================================================

export interface TokenSearchResult {
  symbol: string;
  name: string;
  address: string;
  chainId: number;
  logoURI?: string;
}

export function useTokenSearch(query: string, chainId?: number) {
  return useQuery({
    queryKey: ['token-search', query, chainId],
    queryFn: async (): Promise<TokenSearchResult[]> => {
      if (!query || query.length < 2) return [];
      
      // Mock search in development
      if (process.env.NODE_ENV === 'development') {
        await new Promise(resolve => setTimeout(resolve, 200));
        const results = Object.values(MOCK_PRICES)
          .filter(p => 
            p.symbol.toLowerCase().includes(query.toLowerCase())
          )
          .map(p => ({
            symbol: p.symbol,
            name: p.symbol === 'ETH' ? 'Ethereum' : p.symbol,
            address: p.address,
            chainId: chainId ?? 1,
          }));
        return results;
      }

      const response = await fetch(
        `/api/tokens/search?q=${encodeURIComponent(query)}${chainId ? `&chainId=${chainId}` : ''}`
      );
      
      if (!response.ok) return [];
      return response.json();
    },
    enabled: query.length >= 2,
    staleTime: 60000,
  });
}

// ============================================================================
// Hook: useTokenPortfolio
// ============================================================================

export interface PortfolioToken extends TokenPrice {
  balance: string;
  balanceUSD: number;
}

export interface UseTokenPortfolioReturn {
  tokens: PortfolioToken[];
  totalValue: number;
  loading: boolean;
  error: Error | null;
  refetch: () => Promise<void>;
}

export function useTokenPortfolio(
  tokens: Array<{ symbol: string; balance: string }>,
  options: UseTokenDataOptions = {}
): UseTokenPortfolioReturn {
  const symbols = useMemo(() => tokens.map(t => t.symbol), [tokens]);
  const { prices, loading, error, refetch } = useMultiTokenData(symbols, options);

  const portfolioTokens = useMemo(() => {
    return tokens.map(token => {
      const priceData = prices.get(token.symbol.toUpperCase());
      const balance = parseFloat(token.balance) || 0;
      const price = priceData?.price ?? 0;
      
      return {
        ...priceData,
        symbol: token.symbol,
        address: priceData?.address ?? '',
        price,
        priceChange24h: priceData?.priceChange24h ?? 0,
        priceChangePercent24h: priceData?.priceChangePercent24h ?? 0,
        volume24h: priceData?.volume24h ?? 0,
        marketCap: priceData?.marketCap ?? 0,
        lastUpdated: priceData?.lastUpdated ?? Date.now(),
        balance: token.balance,
        balanceUSD: balance * price,
      };
    });
  }, [tokens, prices]);

  const totalValue = useMemo(() => {
    return portfolioTokens.reduce((sum, token) => sum + token.balanceUSD, 0);
  }, [portfolioTokens]);

  return {
    tokens: portfolioTokens,
    totalValue,
    loading,
    error,
    refetch,
  };
}

// ============================================================================
// Default Export
// ============================================================================

export default useTokenData;
