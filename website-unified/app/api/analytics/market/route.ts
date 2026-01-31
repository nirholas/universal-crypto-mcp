/**
 * Market Data API Route
 * /api/analytics/market - Market overview and token data
 * 
 * Production implementation using CoinGecko API
 * 
 * @author nich
 * @license Apache-2.0
 */

import { NextRequest } from 'next/server';
import { z } from 'zod';
import {
  withHandler,
  createResponse,
  createErrorResponse,
  parseQuery,
  setCacheHeaders,
} from '@/lib/api';
import { BadRequestError } from '@/lib/api/errors';
import type { MarketOverview, TrendingToken, TokenMarketData, RequestContext } from '@/lib/api';

export const runtime = 'edge';

// ============================================================================
// Configuration
// ============================================================================

const COINGECKO_API = 'https://api.coingecko.com/api/v3';
const COINGECKO_API_KEY = process.env.COINGECKO_API_KEY;

// ============================================================================
// Query Schema
// ============================================================================

const MarketQuerySchema = z.object({
  section: z.enum(['overview', 'trending', 'gainers', 'losers', 'prices']).optional().default('overview'),
  limit: z.coerce.number().int().min(1).max(100).optional().default(10),
});

// ============================================================================
// CoinGecko API Helpers
// ============================================================================

async function coinGeckoFetch<T>(endpoint: string, params: Record<string, string> = {}): Promise<T> {
  const url = new URL(`${COINGECKO_API}${endpoint}`);
  Object.entries(params).forEach(([key, value]) => {
    url.searchParams.append(key, value);
  });
  
  const headers: Record<string, string> = {
    'Accept': 'application/json',
  };
  
  if (COINGECKO_API_KEY) {
    headers['x-cg-demo-api-key'] = COINGECKO_API_KEY;
  }
  
  const response = await fetch(url.toString(), { headers });
  
  if (!response.ok) {
    throw new Error(`CoinGecko API error: ${response.status} ${response.statusText}`);
  }
  
  return response.json();
}

async function fetchGlobalMarketData(): Promise<{
  totalMarketCap: number;
  totalMarketCapChange24h: number;
  totalVolume24h: number;
  btcDominance: number;
  ethDominance: number;
}> {
  interface GlobalData {
    data: {
      total_market_cap: { usd: number };
      market_cap_change_percentage_24h_usd: number;
      total_volume: { usd: number };
      market_cap_percentage: { btc: number; eth: number };
    };
  }
  
  const data = await coinGeckoFetch<GlobalData>('/global');
  
  return {
    totalMarketCap: data.data.total_market_cap.usd,
    totalMarketCapChange24h: data.data.market_cap_change_percentage_24h_usd,
    totalVolume24h: data.data.total_volume.usd,
    btcDominance: data.data.market_cap_percentage.btc,
    ethDominance: data.data.market_cap_percentage.eth,
  };
}

async function fetchFearGreedIndex(): Promise<{ value: number; label: string }> {
  try {
    // Alternative Fear & Greed Index API
    const response = await fetch('https://api.alternative.me/fng/?limit=1');
    const data = await response.json();
    
    if (data.data && data.data[0]) {
      return {
        value: parseInt(data.data[0].value, 10),
        label: data.data[0].value_classification,
      };
    }
  } catch (error) {
    console.warn('Fear & Greed API error:', error);
  }
  
  // Fallback
  return { value: 50, label: 'Neutral' };
}

async function fetchTrendingTokens(limit: number): Promise<TrendingToken[]> {
  interface TrendingData {
    coins: Array<{
      item: {
        id: string;
        symbol: string;
        name: string;
        market_cap_rank: number;
        data: {
          price: number;
          price_change_percentage_24h: { usd: number };
          total_volume: string;
          market_cap: string;
        };
      };
    }>;
  }
  
  const data = await coinGeckoFetch<TrendingData>('/search/trending');
  
  return data.coins.slice(0, limit).map((coin, index) => ({
    id: coin.item.id,
    symbol: coin.item.symbol.toUpperCase(),
    name: coin.item.name,
    rank: coin.item.market_cap_rank || index + 1,
    priceUsd: coin.item.data?.price || 0,
    change24h: coin.item.data?.price_change_percentage_24h?.usd || 0,
    volume24h: parseFloat(coin.item.data?.total_volume?.replace(/[^0-9.]/g, '') || '0'),
    marketCap: parseFloat(coin.item.data?.market_cap?.replace(/[^0-9.]/g, '') || '0'),
  }));
}

async function fetchTopCoins(limit: number, orderBy: 'market_cap_desc' | 'volume_desc'): Promise<TokenMarketData[]> {
  interface CoinData {
    id: string;
    symbol: string;
    name: string;
    current_price: number;
    price_change_percentage_1h_in_currency: number;
    price_change_percentage_24h: number;
    price_change_percentage_7d_in_currency: number;
    total_volume: number;
    market_cap: number;
    market_cap_rank: number;
    circulating_supply: number;
    total_supply: number;
    ath: number;
    ath_date: string;
    atl: number;
    atl_date: string;
  }
  
  const data = await coinGeckoFetch<CoinData[]>('/coins/markets', {
    vs_currency: 'usd',
    order: orderBy,
    per_page: limit.toString(),
    page: '1',
    sparkline: 'false',
    price_change_percentage: '1h,24h,7d',
  });
  
  return data.map((coin) => ({
    id: coin.id,
    symbol: coin.symbol.toUpperCase(),
    name: coin.name,
    priceUsd: coin.current_price,
    change1h: coin.price_change_percentage_1h_in_currency || 0,
    change24h: coin.price_change_percentage_24h || 0,
    change7d: coin.price_change_percentage_7d_in_currency || 0,
    volume24h: coin.total_volume,
    marketCap: coin.market_cap,
    rank: coin.market_cap_rank,
    circulatingSupply: coin.circulating_supply,
    totalSupply: coin.total_supply,
    ath: coin.ath,
    athDate: coin.ath_date,
    atl: coin.atl,
    atlDate: coin.atl_date,
  }));
}

async function fetchGainersAndLosers(limit: number): Promise<{
  gainers: TokenMarketData[];
  losers: TokenMarketData[];
}> {
  // Fetch top 250 coins to find gainers and losers
  const data = await fetchTopCoins(250, 'market_cap_desc');
  
  // Sort by 24h change
  const sorted = [...data].sort((a, b) => b.change24h - a.change24h);
  
  return {
    gainers: sorted.slice(0, limit),
    losers: sorted.slice(-limit).reverse(),
  };
}

// ============================================================================
// Handler
// ============================================================================

async function handler(request: NextRequest, context: RequestContext) {
  const query = parseQuery(request, MarketQuerySchema);
  const limit = query.limit || 20;
  
  try {
    let data: unknown;
    
    switch (query.section) {
      case 'trending': {
        const trending = await fetchTrendingTokens(limit);
        data = { trending };
        break;
      }
      
      case 'gainers': {
        const { gainers } = await fetchGainersAndLosers(limit);
        data = { gainers };
        break;
      }
      
      case 'losers': {
        const { losers } = await fetchGainersAndLosers(limit);
        data = { losers };
        break;
      }
      
      case 'prices': {
        const coins = await fetchTopCoins(limit, 'market_cap_desc');
        data = {
          prices: coins.map((c) => ({
            id: c.id,
            symbol: c.symbol,
            name: c.name,
            price: c.priceUsd,
            change24h: c.change24h,
            marketCap: c.marketCap,
          })),
        };
        break;
      }
      
      case 'overview':
      default: {
        // Fetch all data in parallel
        const [globalData, fearGreed, trending, topCoins] = await Promise.all([
          fetchGlobalMarketData(),
          fetchFearGreedIndex(),
          fetchTrendingTokens(5),
          fetchGainersAndLosers(5),
        ]);
        
        const overview: MarketOverview = {
          totalMarketCap: globalData.totalMarketCap,
          totalMarketCapChange24h: globalData.totalMarketCapChange24h,
          totalVolume24h: globalData.totalVolume24h,
          btcDominance: globalData.btcDominance,
          ethDominance: globalData.ethDominance,
          fearGreedIndex: fearGreed.value,
          fearGreedLabel: fearGreed.label,
          trending,
          gainers: topCoins.gainers,
          losers: topCoins.losers,
        };
        
        data = overview;
        break;
      }
    }
    
    const response = createResponse({
      ...data as object,
      timestamp: Date.now(),
      source: 'CoinGecko',
    });
    
    // Cache for 60 seconds (CoinGecko free tier has rate limits)
    setCacheHeaders(response, { maxAge: 60, staleWhileRevalidate: 120 });
    
    return response;
  } catch (error) {
    console.error('[API] Market data error:', error);
    return createErrorResponse(error);
  }
}

export const GET = withHandler(handler, {
  rateLimit: { windowMs: 60000, maxRequests: 60 },
});
