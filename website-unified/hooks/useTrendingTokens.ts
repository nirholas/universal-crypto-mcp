'use client';

import { useQuery } from '@tanstack/react-query';

// Types
export interface TrendingToken {
  id: string;
  coin_id: number;
  name: string;
  symbol: string;
  market_cap_rank: number;
  thumb: string;
  small: string;
  large: string;
  slug: string;
  price_btc: number;
  score: number;
  data: {
    price: number;
    price_btc: string;
    price_change_percentage_24h: Record<string, number>;
    market_cap: string;
    market_cap_btc: string;
    total_volume: string;
    total_volume_btc: string;
    sparkline: string;
    content?: {
      title: string;
      description: string;
    };
  };
}

export interface TrendingNFT {
  id: string;
  name: string;
  symbol: string;
  thumb: string;
  floor_price_in_native_currency: number;
  floor_price_24h_percentage_change: number;
  native_currency: string;
  native_currency_symbol: string;
}

export interface TrendingCategory {
  id: number;
  name: string;
  market_cap_1h_change: number;
  slug: string;
  coins_count: number;
  data: {
    market_cap: number;
    market_cap_btc: number;
    total_volume: number;
    total_volume_btc: number;
    market_cap_change_percentage_24h: Record<string, number>;
    sparkline: string;
  };
}

export interface TrendingData {
  coins: TrendingToken[];
  nfts: TrendingNFT[];
  categories: TrendingCategory[];
}

export interface SocialTrend {
  id: string;
  symbol: string;
  name: string;
  mentions: number;
  mentionChange24h: number;
  sentiment: number; // -1 to 1
  sources: Array<{
    platform: 'twitter' | 'reddit' | 'telegram' | 'discord';
    mentions: number;
    sentiment: number;
  }>;
}

// API Functions
async function fetchTrendingTokens(): Promise<TrendingData> {
  const response = await fetch('/api/market/trending');
  if (!response.ok) throw new Error('Failed to fetch trending');
  return response.json();
}

async function fetchGainerTokens(timeframe: '1h' | '24h' | '7d' = '24h'): Promise<TrendingToken[]> {
  const response = await fetch(`/api/market/gainers?timeframe=${timeframe}`);
  if (!response.ok) throw new Error('Failed to fetch gainers');
  return response.json();
}

async function fetchLoserTokens(timeframe: '1h' | '24h' | '7d' = '24h'): Promise<TrendingToken[]> {
  const response = await fetch(`/api/market/losers?timeframe=${timeframe}`);
  if (!response.ok) throw new Error('Failed to fetch losers');
  return response.json();
}

async function fetchMostVisited(): Promise<TrendingToken[]> {
  const response = await fetch('/api/market/most-visited');
  if (!response.ok) throw new Error('Failed to fetch most visited');
  return response.json();
}

async function fetchRecentlyAdded(): Promise<TrendingToken[]> {
  const response = await fetch('/api/market/recently-added');
  if (!response.ok) throw new Error('Failed to fetch recently added');
  return response.json();
}

async function fetchSocialTrends(): Promise<SocialTrend[]> {
  const response = await fetch('/api/market/social-trends');
  if (!response.ok) throw new Error('Failed to fetch social trends');
  return response.json();
}

// Hooks
export function useTrendingTokens() {
  return useQuery({
    queryKey: ['trending-tokens'],
    queryFn: fetchTrendingTokens,
    staleTime: 120000, // 2 minutes
    refetchInterval: 300000, // 5 minutes
  });
}

export function useGainers(timeframe: '1h' | '24h' | '7d' = '24h') {
  return useQuery({
    queryKey: ['gainers', timeframe],
    queryFn: () => fetchGainerTokens(timeframe),
    staleTime: 60000, // 1 minute
    refetchInterval: 120000, // 2 minutes
  });
}

export function useLosers(timeframe: '1h' | '24h' | '7d' = '24h') {
  return useQuery({
    queryKey: ['losers', timeframe],
    queryFn: () => fetchLoserTokens(timeframe),
    staleTime: 60000, // 1 minute
    refetchInterval: 120000, // 2 minutes
  });
}

export function useMostVisited() {
  return useQuery({
    queryKey: ['most-visited'],
    queryFn: fetchMostVisited,
    staleTime: 300000, // 5 minutes
    refetchInterval: 600000, // 10 minutes
  });
}

export function useRecentlyAdded() {
  return useQuery({
    queryKey: ['recently-added'],
    queryFn: fetchRecentlyAdded,
    staleTime: 300000, // 5 minutes
    refetchInterval: 600000, // 10 minutes
  });
}

export function useSocialTrends() {
  return useQuery({
    queryKey: ['social-trends'],
    queryFn: fetchSocialTrends,
    staleTime: 120000, // 2 minutes
    refetchInterval: 300000, // 5 minutes
  });
}

// Combined hook for trending page
export function useTrendingData() {
  const { data: trending, isLoading: trendingLoading } = useTrendingTokens();
  const { data: gainers = [], isLoading: gainersLoading } = useGainers();
  const { data: losers = [], isLoading: losersLoading } = useLosers();
  const { data: socialTrends = [], isLoading: socialLoading } = useSocialTrends();

  return {
    trending: trending?.coins || [],
    trendingNFTs: trending?.nfts || [],
    trendingCategories: trending?.categories || [],
    gainers,
    losers,
    socialTrends,
    isLoading: trendingLoading || gainersLoading || losersLoading || socialLoading,
  };
}

export default useTrendingTokens;
