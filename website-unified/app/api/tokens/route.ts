/**
 * Tokens API Route
 * GET /api/tokens - Get token data from multiple sources
 * 
 * Integrates with @universal-crypto-mcp/core for token configurations
 * 
 * @author nich
 * @license Apache-2.0
 */

import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';

export const runtime = 'edge';

// ============================================================================
// Configuration
// ============================================================================

const COINGECKO_API = 'https://api.coingecko.com/api/v3';
const DEFILLAMA_API = 'https://coins.llama.fi';

// Chain ID to CoinGecko platform mapping
const CHAIN_TO_PLATFORM: Record<string, string> = {
  ethereum: 'ethereum',
  base: 'base',
  arbitrum: 'arbitrum-one',
  polygon: 'polygon-pos',
  optimism: 'optimistic-ethereum',
  bsc: 'binance-smart-chain',
  avalanche: 'avalanche',
};

// ============================================================================
// Query Schema
// ============================================================================

const TokensQuerySchema = z.object({
  chain: z.string().optional().default('ethereum'),
  category: z.enum(['all', 'stablecoins', 'defi', 'memecoins', 'l2', 'gaming', 'ai']).optional().default('all'),
  search: z.string().optional(),
  addresses: z.string().optional(), // Comma-separated addresses
  page: z.coerce.number().int().min(1).default(1),
  limit: z.coerce.number().int().min(1).max(250).default(50),
  sortBy: z.enum(['marketCap', 'volume', 'price', 'change24h']).optional().default('marketCap'),
  sortOrder: z.enum(['asc', 'desc']).optional().default('desc'),
});

// ============================================================================
// Types
// ============================================================================

interface TokenData {
  address: string;
  symbol: string;
  name: string;
  decimals: number;
  chainId: number;
  logoUri: string | null;
  price: number;
  priceChange24h: number;
  priceChange7d: number | null;
  marketCap: number;
  volume24h: number;
  totalSupply: number | null;
  circulatingSupply: number | null;
  ath: number | null;
  athDate: string | null;
  category: string;
  verified: boolean;
}

// ============================================================================
// Token Data Fetcher
// ============================================================================

async function fetchTokensFromCoinGecko(
  platform: string,
  page: number,
  limit: number,
  category?: string
): Promise<TokenData[]> {
  try {
    const categoryParam = category && category !== 'all' 
      ? `&category=${category}` 
      : '';
    
    const response = await fetch(
      `${COINGECKO_API}/coins/markets?vs_currency=usd&order=market_cap_desc&per_page=${limit}&page=${page}&sparkline=false&price_change_percentage=24h,7d${categoryParam}`,
      { 
        next: { revalidate: 60 },
        headers: {
          'Accept': 'application/json',
        }
      }
    );

    if (!response.ok) {
      console.error('CoinGecko API error:', response.status);
      return [];
    }

    const data = await response.json();
    
    return data.map((coin: any) => ({
      address: coin.id, // CoinGecko ID as fallback address
      symbol: coin.symbol?.toUpperCase() || '',
      name: coin.name || '',
      decimals: 18,
      chainId: 1,
      logoUri: coin.image || null,
      price: coin.current_price || 0,
      priceChange24h: coin.price_change_percentage_24h || 0,
      priceChange7d: coin.price_change_percentage_7d_in_currency || null,
      marketCap: coin.market_cap || 0,
      volume24h: coin.total_volume || 0,
      totalSupply: coin.total_supply || null,
      circulatingSupply: coin.circulating_supply || null,
      ath: coin.ath || null,
      athDate: coin.ath_date || null,
      category: coin.categories?.[0] || 'unknown',
      verified: true,
    }));
  } catch (error) {
    console.error('Failed to fetch tokens from CoinGecko:', error);
    return [];
  }
}

async function fetchTokenPricesFromDefiLlama(
  chain: string,
  addresses: string[]
): Promise<Map<string, { price: number; symbol: string; decimals: number }>> {
  const priceMap = new Map<string, { price: number; symbol: string; decimals: number }>();
  
  if (addresses.length === 0) return priceMap;

  try {
    const coins = addresses.map(addr => `${chain}:${addr}`).join(',');
    const response = await fetch(
      `${DEFILLAMA_API}/prices/current/${coins}`,
      { next: { revalidate: 60 } }
    );

    if (!response.ok) return priceMap;

    const data = await response.json();
    
    for (const [key, value] of Object.entries(data.coins || {})) {
      const addr = key.split(':')[1];
      if (addr && value) {
        const coinData = value as any;
        priceMap.set(addr.toLowerCase(), {
          price: coinData.price || 0,
          symbol: coinData.symbol || '',
          decimals: coinData.decimals || 18,
        });
      }
    }
  } catch (error) {
    console.error('Failed to fetch prices from DefiLlama:', error);
  }

  return priceMap;
}

// ============================================================================
// Popular Tokens by Chain
// ============================================================================

const POPULAR_TOKENS: Record<string, TokenData[]> = {
  ethereum: [
    { address: '0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2', symbol: 'WETH', name: 'Wrapped Ether', decimals: 18, chainId: 1, logoUri: 'https://assets.coingecko.com/coins/images/2518/small/weth.png', price: 0, priceChange24h: 0, priceChange7d: null, marketCap: 0, volume24h: 0, totalSupply: null, circulatingSupply: null, ath: null, athDate: null, category: 'defi', verified: true },
    { address: '0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48', symbol: 'USDC', name: 'USD Coin', decimals: 6, chainId: 1, logoUri: 'https://assets.coingecko.com/coins/images/6319/small/usdc.png', price: 1, priceChange24h: 0, priceChange7d: null, marketCap: 0, volume24h: 0, totalSupply: null, circulatingSupply: null, ath: null, athDate: null, category: 'stablecoins', verified: true },
    { address: '0xdAC17F958D2ee523a2206206994597C13D831ec7', symbol: 'USDT', name: 'Tether', decimals: 6, chainId: 1, logoUri: 'https://assets.coingecko.com/coins/images/325/small/Tether.png', price: 1, priceChange24h: 0, priceChange7d: null, marketCap: 0, volume24h: 0, totalSupply: null, circulatingSupply: null, ath: null, athDate: null, category: 'stablecoins', verified: true },
    { address: '0x514910771AF9Ca656af840dff83E8264EcF986CA', symbol: 'LINK', name: 'Chainlink', decimals: 18, chainId: 1, logoUri: 'https://assets.coingecko.com/coins/images/877/small/chainlink-new-logo.png', price: 0, priceChange24h: 0, priceChange7d: null, marketCap: 0, volume24h: 0, totalSupply: null, circulatingSupply: null, ath: null, athDate: null, category: 'defi', verified: true },
    { address: '0x1f9840a85d5aF5bf1D1762F925BDADdC4201F984', symbol: 'UNI', name: 'Uniswap', decimals: 18, chainId: 1, logoUri: 'https://assets.coingecko.com/coins/images/12504/small/uni.jpg', price: 0, priceChange24h: 0, priceChange7d: null, marketCap: 0, volume24h: 0, totalSupply: null, circulatingSupply: null, ath: null, athDate: null, category: 'defi', verified: true },
    { address: '0x7Fc66500c84A76Ad7e9c93437bFc5Ac33E2DDaE9', symbol: 'AAVE', name: 'Aave', decimals: 18, chainId: 1, logoUri: 'https://assets.coingecko.com/coins/images/12645/small/AAVE.png', price: 0, priceChange24h: 0, priceChange7d: null, marketCap: 0, volume24h: 0, totalSupply: null, circulatingSupply: null, ath: null, athDate: null, category: 'defi', verified: true },
  ],
  base: [
    { address: '0x4200000000000000000000000000000000000006', symbol: 'WETH', name: 'Wrapped Ether', decimals: 18, chainId: 8453, logoUri: 'https://assets.coingecko.com/coins/images/2518/small/weth.png', price: 0, priceChange24h: 0, priceChange7d: null, marketCap: 0, volume24h: 0, totalSupply: null, circulatingSupply: null, ath: null, athDate: null, category: 'defi', verified: true },
    { address: '0x833589fCD6eDb6E08f4c7C32D4f71b54bdA02913', symbol: 'USDC', name: 'USD Coin', decimals: 6, chainId: 8453, logoUri: 'https://assets.coingecko.com/coins/images/6319/small/usdc.png', price: 1, priceChange24h: 0, priceChange7d: null, marketCap: 0, volume24h: 0, totalSupply: null, circulatingSupply: null, ath: null, athDate: null, category: 'stablecoins', verified: true },
  ],
  arbitrum: [
    { address: '0x82aF49447D8a07e3bd95BD0d56f35241523fBab1', symbol: 'WETH', name: 'Wrapped Ether', decimals: 18, chainId: 42161, logoUri: 'https://assets.coingecko.com/coins/images/2518/small/weth.png', price: 0, priceChange24h: 0, priceChange7d: null, marketCap: 0, volume24h: 0, totalSupply: null, circulatingSupply: null, ath: null, athDate: null, category: 'defi', verified: true },
    { address: '0x912CE59144191C1204E64559FE8253a0e49E6548', symbol: 'ARB', name: 'Arbitrum', decimals: 18, chainId: 42161, logoUri: 'https://assets.coingecko.com/coins/images/16547/small/arb.jpg', price: 0, priceChange24h: 0, priceChange7d: null, marketCap: 0, volume24h: 0, totalSupply: null, circulatingSupply: null, ath: null, athDate: null, category: 'l2', verified: true },
  ],
};

const CHAIN_IDS: Record<string, number> = {
  ethereum: 1,
  base: 8453,
  arbitrum: 42161,
  polygon: 137,
  optimism: 10,
  bsc: 56,
  avalanche: 43114,
};

// ============================================================================
// GET Handler
// ============================================================================

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    
    // Parse and validate query parameters
    const parseResult = TokensQuerySchema.safeParse(Object.fromEntries(searchParams));
    if (!parseResult.success) {
      return NextResponse.json(
        { 
          success: false, 
          error: { 
            code: 'VALIDATION_ERROR', 
            message: 'Invalid query parameters',
            details: parseResult.error.flatten()
          } 
        },
        { status: 400 }
      );
    }

    const query = parseResult.data;
    const chainId = CHAIN_IDS[query.chain] || 1;

    // If specific addresses requested, fetch prices for those
    if (query.addresses) {
      const addresses = query.addresses.split(',').map(a => a.trim());
      const priceMap = await fetchTokenPricesFromDefiLlama(query.chain, addresses);
      
      const tokens = addresses.map(addr => {
        const priceData = priceMap.get(addr.toLowerCase());
        return {
          address: addr,
          symbol: priceData?.symbol || 'UNKNOWN',
          name: priceData?.symbol || 'Unknown Token',
          decimals: priceData?.decimals || 18,
          chainId,
          logoUri: null,
          price: priceData?.price || 0,
          priceChange24h: 0,
          priceChange7d: null,
          marketCap: 0,
          volume24h: 0,
          totalSupply: null,
          circulatingSupply: null,
          ath: null,
          athDate: null,
          category: 'unknown',
          verified: false,
        };
      });

      return NextResponse.json({
        success: true,
        data: {
          chain: query.chain,
          chainId,
          tokens,
          pagination: {
            page: 1,
            limit: tokens.length,
            total: tokens.length,
            hasMore: false,
          },
        },
        meta: {
          timestamp: new Date().toISOString(),
        },
      });
    }

    // Fetch from CoinGecko for general token listing
    const tokens = await fetchTokensFromCoinGecko(
      CHAIN_TO_PLATFORM[query.chain] || 'ethereum',
      query.page,
      query.limit,
      query.category !== 'all' ? query.category : undefined
    );

    // If CoinGecko fails, fall back to popular tokens
    let resultTokens = tokens.length > 0 ? tokens : (POPULAR_TOKENS[query.chain] || []);

    // Filter by search
    if (query.search) {
      const searchLower = query.search.toLowerCase();
      resultTokens = resultTokens.filter(
        t => t.symbol.toLowerCase().includes(searchLower) ||
             t.name.toLowerCase().includes(searchLower)
      );
    }

    // Sort
    resultTokens.sort((a, b) => {
      const multiplier = query.sortOrder === 'desc' ? -1 : 1;
      switch (query.sortBy) {
        case 'volume':
          return (a.volume24h - b.volume24h) * multiplier;
        case 'price':
          return (a.price - b.price) * multiplier;
        case 'change24h':
          return (a.priceChange24h - b.priceChange24h) * multiplier;
        default:
          return (a.marketCap - b.marketCap) * multiplier;
      }
    });

    // Update chain ID for results
    resultTokens = resultTokens.map(t => ({ ...t, chainId }));

    return NextResponse.json({
      success: true,
      data: {
        chain: query.chain,
        chainId,
        tokens: resultTokens,
        pagination: {
          page: query.page,
          limit: query.limit,
          total: resultTokens.length,
          hasMore: resultTokens.length === query.limit,
        },
      },
      meta: {
        timestamp: new Date().toISOString(),
        source: tokens.length > 0 ? 'coingecko' : 'cache',
      },
    });
  } catch (error) {
    console.error('Tokens API error:', error);
    return NextResponse.json(
      {
        success: false,
        error: {
          code: 'INTERNAL_ERROR',
          message: 'Failed to fetch tokens',
        },
      },
      { status: 500 }
    );
  }
}

// ============================================================================
// POST Handler - Search tokens across chains
// ============================================================================

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { query, chains } = body as { query: string; chains?: string[] };

    if (!query || query.length < 2) {
      return NextResponse.json(
        {
          success: false,
          error: {
            code: 'VALIDATION_ERROR',
            message: 'Search query must be at least 2 characters',
          },
        },
        { status: 400 }
      );
    }

    const searchChains = chains || ['ethereum', 'base', 'arbitrum', 'polygon'];
    const results: TokenData[] = [];

    // Search CoinGecko
    try {
      const response = await fetch(
        `${COINGECKO_API}/search?query=${encodeURIComponent(query)}`,
        { next: { revalidate: 60 } }
      );

      if (response.ok) {
        const data = await response.json();
        const coins = data.coins?.slice(0, 20) || [];
        
        for (const coin of coins) {
          results.push({
            address: coin.id,
            symbol: coin.symbol?.toUpperCase() || '',
            name: coin.name || '',
            decimals: 18,
            chainId: 1,
            logoUri: coin.large || coin.thumb || null,
            price: 0,
            priceChange24h: 0,
            priceChange7d: null,
            marketCap: coin.market_cap_rank || 0,
            volume24h: 0,
            totalSupply: null,
            circulatingSupply: null,
            ath: null,
            athDate: null,
            category: 'unknown',
            verified: true,
          });
        }
      }
    } catch (e) {
      console.error('CoinGecko search failed:', e);
    }

    // Also search local popular tokens
    const searchLower = query.toLowerCase();
    for (const chain of searchChains) {
      const chainTokens = POPULAR_TOKENS[chain] || [];
      const matches = chainTokens.filter(
        t => t.symbol.toLowerCase().includes(searchLower) ||
             t.name.toLowerCase().includes(searchLower)
      );
      results.push(...matches);
    }

    // Remove duplicates by symbol
    const uniqueResults = Array.from(
      new Map(results.map(r => [r.symbol, r])).values()
    );

    return NextResponse.json({
      success: true,
      data: {
        query,
        results: uniqueResults.slice(0, 50),
        total: uniqueResults.length,
      },
      meta: {
        timestamp: new Date().toISOString(),
      },
    });
  } catch (error) {
    console.error('Token search error:', error);
    return NextResponse.json(
      {
        success: false,
        error: {
          code: 'INTERNAL_ERROR',
          message: 'Search failed',
        },
      },
      { status: 500 }
    );
  }
}
