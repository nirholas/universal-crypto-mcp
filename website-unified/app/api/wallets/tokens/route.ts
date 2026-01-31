/**
 * Token Operations API Route
 * /api/wallets/tokens - Token list, prices, and approvals
 * 
 * @author nich
 * @license Apache-2.0
 */

import { NextRequest } from 'next/server';
import { z } from 'zod';
import {
  withHandler,
  createResponse,
  parseQuery,
  setCacheHeaders,
} from '@/lib/api';

export const runtime = 'edge';

// ============================================================================
// Query Schema
// ============================================================================

const TokensQuerySchema = z.object({
  chain: z.string().optional().default('ethereum'),
  category: z.enum(['all', 'stablecoins', 'defi', 'memecoins', 'l2', 'gaming']).optional().default('all'),
  search: z.string().optional(),
  page: z.coerce.number().int().min(1).default(1),
  limit: z.coerce.number().int().min(1).max(100).default(50),
});

// ============================================================================
// Mock Token Data
// ============================================================================

interface Token {
  address: string;
  symbol: string;
  name: string;
  decimals: number;
  logoUri: string;
  price: number;
  change24h: number;
  marketCap: number;
  volume24h: number;
  category: string;
  verified: boolean;
}

const MOCK_TOKENS: Token[] = [
  { address: '0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2', symbol: 'WETH', name: 'Wrapped Ether', decimals: 18, logoUri: 'https://assets.coingecko.com/coins/images/2518/small/weth.png', price: 2500, change24h: 2.5, marketCap: 300000000000, volume24h: 5000000000, category: 'defi', verified: true },
  { address: '0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48', symbol: 'USDC', name: 'USD Coin', decimals: 6, logoUri: 'https://assets.coingecko.com/coins/images/6319/small/usdc.png', price: 1.0, change24h: 0.01, marketCap: 25000000000, volume24h: 3000000000, category: 'stablecoins', verified: true },
  { address: '0xdAC17F958D2ee523a2206206994597C13D831ec7', symbol: 'USDT', name: 'Tether', decimals: 6, logoUri: 'https://assets.coingecko.com/coins/images/325/small/Tether.png', price: 1.0, change24h: -0.01, marketCap: 83000000000, volume24h: 20000000000, category: 'stablecoins', verified: true },
  { address: '0x6B175474E89094C44Da98b954EesC52dcc942e3B', symbol: 'DAI', name: 'Dai Stablecoin', decimals: 18, logoUri: 'https://assets.coingecko.com/coins/images/9956/small/Badge_Dai.png', price: 1.0, change24h: 0.02, marketCap: 5000000000, volume24h: 200000000, category: 'stablecoins', verified: true },
  { address: '0x514910771AF9Ca656af840dff83E8264EcF986CA', symbol: 'LINK', name: 'Chainlink', decimals: 18, logoUri: 'https://assets.coingecko.com/coins/images/877/small/chainlink-new-logo.png', price: 15, change24h: 3.2, marketCap: 8000000000, volume24h: 500000000, category: 'defi', verified: true },
  { address: '0x1f9840a85d5aF5bf1D1762F925BDADdC4201F984', symbol: 'UNI', name: 'Uniswap', decimals: 18, logoUri: 'https://assets.coingecko.com/coins/images/12504/small/uni.jpg', price: 8, change24h: -1.5, marketCap: 6000000000, volume24h: 300000000, category: 'defi', verified: true },
  { address: '0x7Fc66500c84A76Ad7e9c93437bFc5Ac33E2DDaE9', symbol: 'AAVE', name: 'Aave', decimals: 18, logoUri: 'https://assets.coingecko.com/coins/images/12645/small/AAVE.png', price: 180, change24h: 4.1, marketCap: 2500000000, volume24h: 150000000, category: 'defi', verified: true },
  { address: '0x95aD61b0a150d79219dCF64E1E6Cc01f0B64C4cE', symbol: 'SHIB', name: 'Shiba Inu', decimals: 18, logoUri: 'https://assets.coingecko.com/coins/images/11939/small/shiba.png', price: 0.00001, change24h: -5.2, marketCap: 6000000000, volume24h: 200000000, category: 'memecoins', verified: true },
  { address: '0xB8c77482e45F1F44dE1745F52C74426C631bDD52', symbol: 'PEPE', name: 'Pepe', decimals: 18, logoUri: 'https://assets.coingecko.com/coins/images/29850/small/pepe.png', price: 0.000001, change24h: 10.5, marketCap: 3000000000, volume24h: 500000000, category: 'memecoins', verified: true },
  { address: '0x912CE59144191C1204E64559FE8253a0e49E6548', symbol: 'ARB', name: 'Arbitrum', decimals: 18, logoUri: 'https://assets.coingecko.com/coins/images/16547/small/arb.jpg', price: 1.2, change24h: 2.8, marketCap: 3000000000, volume24h: 400000000, category: 'l2', verified: true },
  { address: '0x4200000000000000000000000000000000000042', symbol: 'OP', name: 'Optimism', decimals: 18, logoUri: 'https://assets.coingecko.com/coins/images/25244/small/OP.jpg', price: 2.5, change24h: 1.9, marketCap: 2500000000, volume24h: 250000000, category: 'l2', verified: true },
  { address: '0x0F5D2fB29fb7d3CFeE444a200298f468908cC942', symbol: 'MANA', name: 'Decentraland', decimals: 18, logoUri: 'https://assets.coingecko.com/coins/images/878/small/mana.png', price: 0.45, change24h: -2.1, marketCap: 850000000, volume24h: 50000000, category: 'gaming', verified: true },
  { address: '0xBB0E17EF65F82Ab018d8EDd776e8DD940327B28b', symbol: 'AXS', name: 'Axie Infinity', decimals: 18, logoUri: 'https://assets.coingecko.com/coins/images/13029/small/axs.png', price: 8.5, change24h: 3.5, marketCap: 1200000000, volume24h: 80000000, category: 'gaming', verified: true },
];

// ============================================================================
// Handler
// ============================================================================

async function handler(request: NextRequest) {
  const query = parseQuery(request, TokensQuerySchema);
  
  let tokens = [...MOCK_TOKENS];
  
  // Filter by category
  if (query.category !== 'all') {
    tokens = tokens.filter((t) => t.category === query.category);
  }
  
  // Filter by search
  if (query.search) {
    const searchLower = query.search.toLowerCase();
    tokens = tokens.filter(
      (t) =>
        t.symbol.toLowerCase().includes(searchLower) ||
        t.name.toLowerCase().includes(searchLower)
    );
  }
  
  // Sort by market cap
  tokens.sort((a, b) => b.marketCap - a.marketCap);
  
  // Paginate
  const total = tokens.length;
  const offset = (query.page - 1) * query.limit;
  const paginatedTokens = tokens.slice(offset, offset + query.limit);
  
  const response = createResponse({
    chain: query.chain,
    tokens: paginatedTokens,
    categories: [
      { id: 'all', name: 'All Tokens', count: MOCK_TOKENS.length },
      { id: 'stablecoins', name: 'Stablecoins', count: MOCK_TOKENS.filter((t) => t.category === 'stablecoins').length },
      { id: 'defi', name: 'DeFi', count: MOCK_TOKENS.filter((t) => t.category === 'defi').length },
      { id: 'memecoins', name: 'Memecoins', count: MOCK_TOKENS.filter((t) => t.category === 'memecoins').length },
      { id: 'l2', name: 'Layer 2', count: MOCK_TOKENS.filter((t) => t.category === 'l2').length },
      { id: 'gaming', name: 'Gaming', count: MOCK_TOKENS.filter((t) => t.category === 'gaming').length },
    ],
  }, {
    meta: {
      page: query.page,
      limit: query.limit,
      total,
      totalPages: Math.ceil(total / query.limit),
      hasNext: offset + query.limit < total,
      hasPrevious: query.page > 1,
    },
  });
  
  // Cache for 1 minute
  setCacheHeaders(response, { maxAge: 60, staleWhileRevalidate: 120 });
  
  return response;
}

export const GET = withHandler(handler, {
  rateLimit: { windowMs: 60000, maxRequests: 100 },
});
