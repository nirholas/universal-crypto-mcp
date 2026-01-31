/**
 * Token Market Data API Route
 * /api/analytics/market/[symbol] - Individual token market data
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
// Mock Token Data
// ============================================================================

const MOCK_TOKENS: Record<string, TokenMarketData> = {
  ETH: {
    id: 'ethereum',
    symbol: 'ETH',
    name: 'Ethereum',
    priceUsd: 2500,
    change1h: 0.5,
    change24h: 2.5,
    change7d: -1.2,
    volume24h: 15000000000,
    marketCap: 300000000000,
    rank: 2,
    circulatingSupply: 120000000,
    totalSupply: 120000000,
    ath: 4878,
    athDate: '2021-11-10',
    atl: 0.42,
    atlDate: '2015-10-20',
    logoUri: 'https://assets.coingecko.com/coins/images/279/small/ethereum.png',
  },
  BTC: {
    id: 'bitcoin',
    symbol: 'BTC',
    name: 'Bitcoin',
    priceUsd: 45000,
    change1h: 0.3,
    change24h: 1.8,
    change7d: 3.5,
    volume24h: 25000000000,
    marketCap: 900000000000,
    rank: 1,
    circulatingSupply: 19500000,
    totalSupply: 21000000,
    maxSupply: 21000000,
    ath: 73750,
    athDate: '2024-03-14',
    atl: 67.81,
    atlDate: '2013-07-06',
    logoUri: 'https://assets.coingecko.com/coins/images/1/small/bitcoin.png',
  },
  SOL: {
    id: 'solana',
    symbol: 'SOL',
    name: 'Solana',
    priceUsd: 105,
    change1h: 1.2,
    change24h: 5.5,
    change7d: 12.3,
    volume24h: 2000000000,
    marketCap: 45000000000,
    rank: 5,
    circulatingSupply: 430000000,
    totalSupply: 580000000,
    ath: 260,
    athDate: '2021-11-06',
    atl: 0.5,
    atlDate: '2020-05-11',
    logoUri: 'https://assets.coingecko.com/coins/images/4128/small/solana.png',
  },
  ARB: {
    id: 'arbitrum',
    symbol: 'ARB',
    name: 'Arbitrum',
    priceUsd: 1.25,
    change1h: 0.8,
    change24h: 3.2,
    change7d: -2.5,
    volume24h: 400000000,
    marketCap: 3000000000,
    rank: 35,
    circulatingSupply: 2500000000,
    totalSupply: 10000000000,
    ath: 2.39,
    athDate: '2024-01-12',
    atl: 0.74,
    atlDate: '2023-09-11',
    logoUri: 'https://assets.coingecko.com/coins/images/16547/small/arb.jpg',
  },
  OP: {
    id: 'optimism',
    symbol: 'OP',
    name: 'Optimism',
    priceUsd: 2.50,
    change1h: 0.5,
    change24h: 2.1,
    change7d: 5.8,
    volume24h: 250000000,
    marketCap: 2500000000,
    rank: 40,
    circulatingSupply: 1000000000,
    totalSupply: 4294967296,
    ath: 4.57,
    athDate: '2024-03-06',
    atl: 0.40,
    atlDate: '2022-06-18',
    logoUri: 'https://assets.coingecko.com/coins/images/25244/small/OP.jpg',
  },
};

interface TokenDetailedData extends TokenMarketData {
  description: string;
  website: string;
  explorer: string;
  socialLinks: {
    twitter?: string;
    discord?: string;
    telegram?: string;
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

function generatePriceHistory(basePrice: number, period: '24h' | '7d' | '30d') {
  const intervals = { '24h': 24, '7d': 168, '30d': 720 };
  const count = Math.min(intervals[period], 100);
  const now = Date.now();
  const step = (intervals[period] * 3600000) / count;
  
  return Array.from({ length: count }, (_, i) => ({
    timestamp: now - (count - i) * step,
    price: basePrice * (1 + (Math.random() - 0.5) * 0.1),
  }));
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
  
  const token = MOCK_TOKENS[upperSymbol];
  if (!token) {
    throw new NotFoundError('Token', symbol);
  }
  
  // Add random variation to price
  const currentPrice = token.priceUsd * (1 + (Math.random() - 0.5) * 0.02);
  
  const detailedData: TokenDetailedData = {
    ...token,
    priceUsd: currentPrice,
    change1h: (Math.random() - 0.5) * 2,
    change24h: (Math.random() - 0.5) * 8,
    change7d: (Math.random() - 0.5) * 15,
    description: `${token.name} is a decentralized cryptocurrency that powers the ${token.name} network.`,
    website: `https://${token.id}.org`,
    explorer: `https://etherscan.io/token/${token.symbol}`,
    socialLinks: {
      twitter: `https://twitter.com/${token.id}`,
      discord: `https://discord.gg/${token.id}`,
    },
    priceHistory: {
      '24h': generatePriceHistory(token.priceUsd, '24h'),
      '7d': generatePriceHistory(token.priceUsd, '7d'),
      '30d': generatePriceHistory(token.priceUsd, '30d'),
    },
    technicalIndicators: {
      rsi: 30 + Math.random() * 40,
      macd: {
        value: (Math.random() - 0.5) * 10,
        signal: (Math.random() - 0.5) * 8,
        histogram: (Math.random() - 0.5) * 5,
      },
      ma50: token.priceUsd * (1 + (Math.random() - 0.5) * 0.1),
      ma200: token.priceUsd * (1 + (Math.random() - 0.5) * 0.15),
    },
  };
  
  const response = createResponse(detailedData);
  
  // Cache for 30 seconds
  setCacheHeaders(response, { maxAge: 30, staleWhileRevalidate: 60 });
  
  return response;
}

export const GET = withHandler(handler, {
  rateLimit: { windowMs: 60000, maxRequests: 100 },
});
