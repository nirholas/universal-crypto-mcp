'use client';

import { useQuery } from '@tanstack/react-query';
import { useCallback, useState, useEffect, useRef } from 'react';

// Types
export interface TokenPrice {
  id: string;
  symbol: string;
  name: string;
  current_price: number;
  market_cap: number;
  market_cap_rank: number;
  total_volume: number;
  high_24h: number;
  low_24h: number;
  price_change_24h: number;
  price_change_percentage_24h: number;
  price_change_percentage_7d?: number;
  price_change_percentage_30d?: number;
  circulating_supply: number;
  total_supply: number;
  max_supply: number | null;
  ath: number;
  ath_date: string;
  atl: number;
  atl_date: string;
  image: string;
  last_updated: string;
  sparkline_in_7d?: { price: number[] };
}

export interface MarketData {
  total_market_cap: Record<string, number>;
  total_volume: Record<string, number>;
  market_cap_percentage: Record<string, number>;
  market_cap_change_percentage_24h_usd: number;
  active_cryptocurrencies: number;
  markets: number;
  updated_at: number;
}

export interface PriceHistory {
  prices: [number, number][];
  market_caps: [number, number][];
  total_volumes: [number, number][];
}

export interface FearGreedData {
  value: number;
  classification: 'Extreme Fear' | 'Fear' | 'Neutral' | 'Greed' | 'Extreme Greed';
  timestamp: number;
  time_until_update?: string;
}

// API Functions
async function fetchTokenPrices(params?: {
  vs_currency?: string;
  ids?: string[];
  category?: string;
  order?: string;
  per_page?: number;
  page?: number;
  sparkline?: boolean;
}): Promise<TokenPrice[]> {
  const searchParams = new URLSearchParams();
  searchParams.set('vs_currency', params?.vs_currency || 'usd');
  if (params?.ids?.length) searchParams.set('ids', params.ids.join(','));
  if (params?.category) searchParams.set('category', params.category);
  searchParams.set('order', params?.order || 'market_cap_desc');
  searchParams.set('per_page', String(params?.per_page || 100));
  searchParams.set('page', String(params?.page || 1));
  if (params?.sparkline) searchParams.set('sparkline', 'true');

  const response = await fetch(`/api/market/prices?${searchParams}`);
  if (!response.ok) throw new Error('Failed to fetch prices');
  return response.json();
}

async function fetchGlobalMarketData(): Promise<MarketData> {
  const response = await fetch('/api/market/global');
  if (!response.ok) throw new Error('Failed to fetch market data');
  return response.json();
}

async function fetchPriceHistory(
  tokenId: string,
  days: number | 'max' = 7,
  interval?: 'daily' | 'hourly'
): Promise<PriceHistory> {
  const searchParams = new URLSearchParams();
  searchParams.set('days', String(days));
  if (interval) searchParams.set('interval', interval);

  const response = await fetch(`/api/market/history/${tokenId}?${searchParams}`);
  if (!response.ok) throw new Error('Failed to fetch price history');
  return response.json();
}

async function fetchFearGreedIndex(): Promise<FearGreedData> {
  const response = await fetch('/api/market/fear-greed');
  if (!response.ok) throw new Error('Failed to fetch fear/greed index');
  return response.json();
}

async function searchTokens(query: string): Promise<Array<{
  id: string;
  name: string;
  symbol: string;
  market_cap_rank: number;
  thumb: string;
  large: string;
}>> {
  const response = await fetch(`/api/market/search?q=${encodeURIComponent(query)}`);
  if (!response.ok) throw new Error('Failed to search tokens');
  const data = await response.json();
  return data.coins || [];
}

// Hooks
export function useTokenPrices(params?: {
  ids?: string[];
  category?: string;
  order?: string;
  per_page?: number;
  page?: number;
  sparkline?: boolean;
}) {
  return useQuery({
    queryKey: ['token-prices', params],
    queryFn: () => fetchTokenPrices(params),
    staleTime: 30000, // 30 seconds
    refetchInterval: 60000, // 1 minute
  });
}

export function useGlobalMarket() {
  return useQuery({
    queryKey: ['global-market'],
    queryFn: fetchGlobalMarketData,
    staleTime: 60000, // 1 minute
    refetchInterval: 120000, // 2 minutes
  });
}

export function usePriceHistory(
  tokenId: string | undefined,
  days: number | 'max' = 7,
  interval?: 'daily' | 'hourly'
) {
  return useQuery({
    queryKey: ['price-history', tokenId, days, interval],
    queryFn: () => fetchPriceHistory(tokenId!, days, interval),
    enabled: !!tokenId,
    staleTime: 300000, // 5 minutes
  });
}

export function useFearGreedIndex() {
  return useQuery({
    queryKey: ['fear-greed'],
    queryFn: fetchFearGreedIndex,
    staleTime: 300000, // 5 minutes
    refetchInterval: 600000, // 10 minutes
  });
}

export function useTokenSearch(debounceMs: number = 300) {
  const [query, setQuery] = useState('');
  const [debouncedQuery, setDebouncedQuery] = useState('');

  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedQuery(query);
    }, debounceMs);

    return () => clearTimeout(timer);
  }, [query, debounceMs]);

  const { data: results = [], isLoading } = useQuery({
    queryKey: ['token-search', debouncedQuery],
    queryFn: () => searchTokens(debouncedQuery),
    enabled: debouncedQuery.length >= 2,
    staleTime: 60000,
  });

  return {
    query,
    setQuery,
    results,
    isLoading: isLoading && debouncedQuery.length >= 2,
  };
}

// Real-time price stream using WebSocket
export function usePriceStream(tokenIds: string[]) {
  const [prices, setPrices] = useState<Record<string, number>>({});
  const wsRef = useRef<WebSocket | null>(null);

  useEffect(() => {
    if (tokenIds.length === 0) return;

    const wsUrl = process.env.NEXT_PUBLIC_WS_URL || 'wss://api.example.com/ws';
    const ws = new WebSocket(wsUrl);
    wsRef.current = ws;

    ws.onopen = () => {
      ws.send(JSON.stringify({
        type: 'subscribe',
        channels: ['prices'],
        tokens: tokenIds,
      }));
    };

    ws.onmessage = (event) => {
      try {
        const data = JSON.parse(event.data);
        if (data.type === 'price_update') {
          setPrices((prev) => ({
            ...prev,
            [data.token]: data.price,
          }));
        }
      } catch {
        // Ignore invalid messages
      }
    };

    return () => {
      ws.close();
    };
  }, [tokenIds.join(',')]);

  return prices;
}

// Combined hook for market dashboard
export function useMarketData() {
  const { data: topTokens = [], isLoading: tokensLoading } = useTokenPrices({
    per_page: 100,
    sparkline: true,
  });

  const { data: globalData, isLoading: globalLoading } = useGlobalMarket();
  const { data: fearGreed, isLoading: fgLoading } = useFearGreedIndex();

  // Derived data
  const btc = topTokens.find((t) => t.symbol === 'btc');
  const eth = topTokens.find((t) => t.symbol === 'eth');

  const gainers = [...topTokens]
    .filter((t) => t.price_change_percentage_24h > 0)
    .sort((a, b) => b.price_change_percentage_24h - a.price_change_percentage_24h)
    .slice(0, 10);

  const losers = [...topTokens]
    .filter((t) => t.price_change_percentage_24h < 0)
    .sort((a, b) => a.price_change_percentage_24h - b.price_change_percentage_24h)
    .slice(0, 10);

  return {
    // Token data
    tokens: topTokens,
    btc,
    eth,
    gainers,
    losers,
    tokensLoading,

    // Global market
    globalData,
    globalLoading,

    // Fear & Greed
    fearGreed,
    fgLoading,

    // Overall loading state
    isLoading: tokensLoading || globalLoading || fgLoading,
  };
}

export default useMarketData;
