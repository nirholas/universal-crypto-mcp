/**
 * Token Market Data API Route
 * /api/analytics/market/[symbol] - Individual token market data
 * 
 * Real implementation using CoinGecko API
 * 
 * @author nich
 * @license Apache-2.0
 */

import { NextRequest } from 'next/server';
import {
  withHandler,
  createResponse,
  NotFoundError,
  setCacheHeaders,
} from '@/lib/api';
import type { TokenMarketData } from '@/lib/api';

export const runtime = 'edge';

// ============================================================================
// Symbol to CoinGecko ID Mapping
// ============================================================================

const SYMBOL_TO_COINGECKO_ID: Record<string, string> = {
  BTC: 'bitcoin',
  ETH: 'ethereum',
  SOL: 'solana',
  ARB: 'arbitrum',
  OP: 'optimism',
  MATIC: 'matic-network',
  AVAX: 'avalanche-2',
  BNB: 'binancecoin',
  USDC: 'usd-coin',
  USDT: 'tether',
  DAI: 'dai',
  LINK: 'chainlink',
  UNI: 'uniswap',
  AAVE: 'aave',
  CRV: 'curve-dao-token',
  MKR: 'maker',
  LDO: 'lido-dao',
  SNX: 'havven',
  COMP: 'compound-governance-token',
  DOGE: 'dogecoin',
  SHIB: 'shiba-inu',
  PEPE: 'pepe',
  DYDX: 'dydx-chain',
  GMX: 'gmx',
  PENDLE: 'pendle',
  RETH: 'rocket-pool-eth',
  CBETH: 'coinbase-wrapped-staked-eth',
  STETH: 'staked-ether',
  WETH: 'weth',
  WBTC: 'wrapped-bitcoin',
  XRP: 'ripple',
  ADA: 'cardano',
  DOT: 'polkadot',
  ATOM: 'cosmos',
  NEAR: 'near',
  APT: 'aptos',
  SUI: 'sui',
  SEI: 'sei-network',
  INJ: 'injective-protocol',
  TIA: 'celestia',
  FTM: 'fantom',
  TON: 'the-open-network',
};

interface CoinGeckoDetailedData {
  id: string;
  symbol: string;
  name: string;
  market_data: {
    current_price: { usd: number };
    price_change_percentage_1h_in_currency?: { usd: number };
    price_change_percentage_24h: number;
    price_change_percentage_7d: number;
    total_volume: { usd: number };
    market_cap: { usd: number };
    market_cap_rank: number;
    circulating_supply: number;
    total_supply: number;
    max_supply: number | null;
    ath: { usd: number };
    ath_date: { usd: string };
    atl: { usd: number };
    atl_date: { usd: string };
  };
  image: { small: string };
  description: { en: string };
  links: {
    homepage: string[];
    blockchain_site: string[];
    official_forum_url: string[];
    chat_url: string[];
    twitter_screen_name: string;
    subreddit_url: string;
  };
}

interface TokenDetailedData extends TokenMarketData {
  description: string;
  website: string;
  explorer: string;
  socialLinks: {
    twitter?: string;
    discord?: string;
    telegram?: string;
    reddit?: string;
  };
  priceHistory: {
    '24h': Array<{ timestamp: number; price: number }>;
    '7d': Array<{ timestamp: number; price: number }>;
    '30d': Array<{ timestamp: number; price: number }>;
  };
  technicalIndicators: {
    rsi: number;
    macd: { value: number; signal: number; histogram: number };
    ma50: number;
    ma200: number;
  };
}

// ============================================================================
// Fetch Real Data from CoinGecko
// ============================================================================

async function fetchCoinGeckoData(coinId: string): Promise<CoinGeckoDetailedData> {
  const response = await fetch(
    `https://api.coingecko.com/api/v3/coins/${coinId}?localization=false&tickers=false&community_data=false&developer_data=false`,
    {
      headers: { 'Accept': 'application/json' },
      next: { revalidate: 60 }, // Cache for 60 seconds
    }
  );

  if (!response.ok) {
    if (response.status === 404) {
      throw new NotFoundError('Token', coinId);
    }
    throw new Error(`CoinGecko API error: ${response.status}`);
  }

  return response.json();
}

async function fetchPriceHistory(coinId: string, days: number): Promise<Array<{ timestamp: number; price: number }>> {
  try {
    const response = await fetch(
      `https://api.coingecko.com/api/v3/coins/${coinId}/market_chart?vs_currency=usd&days=${days}`,
      {
        headers: { 'Accept': 'application/json' },
        next: { revalidate: 300 }, // Cache for 5 minutes
      }
    );

    if (!response.ok) {
      return [];
    }

    const data = await response.json();
    return (data.prices || []).map(([timestamp, price]: [number, number]) => ({
      timestamp,
      price,
    }));
  } catch {
    return [];
  }
}

function calculateTechnicalIndicators(priceHistory: Array<{ timestamp: number; price: number }>): {
  rsi: number;
  macd: { value: number; signal: number; histogram: number };
  ma50: number;
  ma200: number;
} {
  const prices = priceHistory.map(p => p.price);
  
  // Calculate Simple Moving Averages
  const calculateSMA = (data: number[], period: number) => {
    if (data.length < period) return data.length > 0 ? data[data.length - 1] : 0;
    const slice = data.slice(-period);
    return slice.reduce((a, b) => a + b, 0) / period;
  };

  // Calculate RSI (simplified)
  const calculateRSI = (data: number[], period: number = 14) => {
    if (data.length < period + 1) return 50;
    
    const changes = [];
    for (let i = 1; i < data.length; i++) {
      changes.push(data[i] - data[i - 1]);
    }
    
    const gains = changes.filter(c => c > 0);
    const losses = changes.filter(c => c < 0).map(c => Math.abs(c));
    
    const avgGain = gains.length > 0 ? gains.reduce((a, b) => a + b, 0) / period : 0;
    const avgLoss = losses.length > 0 ? losses.reduce((a, b) => a + b, 0) / period : 0;
    
    if (avgLoss === 0) return 100;
    const rs = avgGain / avgLoss;
    return 100 - (100 / (1 + rs));
  };

  // Calculate EMA (for MACD)
  const calculateEMA = (data: number[], period: number) => {
    if (data.length === 0) return 0;
    const multiplier = 2 / (period + 1);
    let ema = data[0];
    for (let i = 1; i < data.length; i++) {
      ema = (data[i] - ema) * multiplier + ema;
    }
    return ema;
  };

  const ma50 = calculateSMA(prices, Math.min(50, prices.length));
  const ma200 = calculateSMA(prices, Math.min(200, prices.length));
  const rsi = calculateRSI(prices);
  
  // MACD (12, 26, 9)
  const ema12 = calculateEMA(prices, 12);
  const ema26 = calculateEMA(prices, 26);
  const macdValue = ema12 - ema26;
  const signal = calculateEMA([macdValue], 9);
  
  return {
    rsi,
    macd: {
      value: macdValue,
      signal,
      histogram: macdValue - signal,
    },
    ma50,
    ma200,
  };
}

// ============================================================================
// Handler
// ============================================================================

async function handler(
  request: NextRequest,
  context: { params: Promise<{ symbol: string }> }
) {
  const { symbol } = await context.params;
  const upperSymbol = symbol.toUpperCase();
  
  // Get CoinGecko ID from symbol
  const coinId = SYMBOL_TO_COINGECKO_ID[upperSymbol];
  if (!coinId) {
    throw new NotFoundError('Token', symbol);
  }
  
  // Fetch real data from CoinGecko
  const [coinData, history24h, history7d, history30d] = await Promise.all([
    fetchCoinGeckoData(coinId),
    fetchPriceHistory(coinId, 1),
    fetchPriceHistory(coinId, 7),
    fetchPriceHistory(coinId, 30),
  ]);

  const md = coinData.market_data;
  
  // Calculate technical indicators from 30-day price history
  const technicalIndicators = calculateTechnicalIndicators(history30d);
  
  const detailedData: TokenDetailedData = {
    id: coinData.id,
    symbol: coinData.symbol.toUpperCase(),
    name: coinData.name,
    priceUsd: md.current_price.usd,
    change1h: md.price_change_percentage_1h_in_currency?.usd || 0,
    change24h: md.price_change_percentage_24h || 0,
    change7d: md.price_change_percentage_7d || 0,
    volume24h: md.total_volume.usd,
    marketCap: md.market_cap.usd,
    rank: md.market_cap_rank,
    circulatingSupply: md.circulating_supply,
    totalSupply: md.total_supply,
    maxSupply: md.max_supply || undefined,
    ath: md.ath.usd,
    athDate: md.ath_date.usd,
    atl: md.atl.usd,
    atlDate: md.atl_date.usd,
    logoUri: coinData.image.small,
    description: coinData.description.en?.substring(0, 500) || `${coinData.name} is a cryptocurrency.`,
    website: coinData.links.homepage[0] || `https://${coinData.id}.org`,
    explorer: coinData.links.blockchain_site[0] || `https://etherscan.io/token/${coinData.symbol}`,
    socialLinks: {
      twitter: coinData.links.twitter_screen_name 
        ? `https://twitter.com/${coinData.links.twitter_screen_name}` 
        : undefined,
      reddit: coinData.links.subreddit_url || undefined,
      discord: coinData.links.chat_url[0] || undefined,
    },
    priceHistory: {
      '24h': history24h.slice(-24), // Limit to 24 data points
      '7d': history7d.slice(-168),
      '30d': history30d.slice(-100),
    },
    technicalIndicators,
  };
  
  const response = createResponse(detailedData);
  
  // Cache for 30 seconds
  setCacheHeaders(response, { maxAge: 30, staleWhileRevalidate: 60 });
  
  return response;
}

export async function GET(
  request: NextRequest,
  context: { params: Promise<{ symbol: string }> }
) {
  return withHandler(() => handler(request, context), {
    rateLimit: { windowMs: 60000, maxRequests: 100 },
  })(request);
}
