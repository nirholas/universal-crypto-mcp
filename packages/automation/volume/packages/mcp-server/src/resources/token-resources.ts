/**
 * Token Resources
 * MCP resource providers for token data with real API integrations
 */

import type { Resource, ResourceTemplate } from '../types.js';
import { logger } from '../utils/logger.js';

// API endpoints
const JUPITER_PRICE_API = 'https://api.jup.ag/price/v2';
const JUPITER_TOKEN_LIST = 'https://token.jup.ag/strict';
const BIRDEYE_API = 'https://public-api.birdeye.so';
const HELIUS_RPC = process.env.HELIUS_API_KEY
  ? `https://mainnet.helius-rpc.com/?api-key=${process.env.HELIUS_API_KEY}`
  : undefined;

// Token cache (TTL: 5 minutes)
const tokenCache = new Map<string, { data: TokenInfo; timestamp: number }>();
const CACHE_TTL = 5 * 60 * 1000;

export interface TokenInfo {
  mint: string;
  symbol: string;
  name: string;
  decimals: number;
  logoURI?: string;
  priceUSD?: number;
  priceChange24h?: number;
  volume24h?: number;
  marketCap?: number;
  supply?: number;
  holders?: number;
  verified: boolean;
}

export const tokenResourceTemplates: ResourceTemplate[] = [
  {
    uriTemplate: 'tokens://{mint}/info',
    name: 'Token Info',
    description: 'Detailed information about a token',
    mimeType: 'application/json',
  },
  {
    uriTemplate: 'tokens://{mint}/price',
    name: 'Token Price',
    description: 'Current price and 24h change',
    mimeType: 'application/json',
  },
  {
    uriTemplate: 'tokens://list/trending',
    name: 'Trending Tokens',
    description: 'List of trending tokens on Solana',
    mimeType: 'application/json',
  },
];

export async function getTokenInfoResource(mint: string): Promise<Resource & { content: string }> {
  logger.debug({ mint }, 'Fetching token info resource');
  
  // Check cache first
  const cached = tokenCache.get(mint);
  if (cached && Date.now() - cached.timestamp < CACHE_TTL) {
    return {
      uri: `tokens://${mint}/info`,
      name: `Token ${cached.data.symbol || mint.slice(0, 8)}`,
      mimeType: 'application/json',
      content: JSON.stringify(cached.data, null, 2),
    };
  }
  
  // Fetch token info from multiple sources
  const [tokenMetadata, priceData, supplyInfo] = await Promise.all([
    fetchTokenMetadata(mint),
    fetchTokenPrice(mint),
    fetchTokenSupply(mint),
  ]);
  
  const tokenInfo: TokenInfo = {
    mint,
    symbol: tokenMetadata?.symbol || 'UNKNOWN',
    name: tokenMetadata?.name || 'Unknown Token',
    decimals: tokenMetadata?.decimals || 9,
    logoURI: tokenMetadata?.logoURI,
    priceUSD: priceData?.price,
    priceChange24h: priceData?.priceChange24h,
    volume24h: priceData?.volume24h,
    marketCap: priceData?.price && supplyInfo?.supply
      ? priceData.price * supplyInfo.supply
      : undefined,
    supply: supplyInfo?.supply,
    holders: supplyInfo?.holders,
    verified: tokenMetadata?.verified || false,
  };
  
  // Update cache
  tokenCache.set(mint, { data: tokenInfo, timestamp: Date.now() });
  
  return {
    uri: `tokens://${mint}/info`,
    name: `Token ${tokenInfo.symbol}`,
    mimeType: 'application/json',
    content: JSON.stringify(tokenInfo, null, 2),
  };
}

export async function getTokenPriceResource(mint: string): Promise<Resource & { content: string }> {
  logger.debug({ mint }, 'Fetching token price resource');
  
  const priceData = await fetchTokenPrice(mint);
  
  return {
    uri: `tokens://${mint}/price`,
    name: `Price for ${mint.slice(0, 8)}...`,
    mimeType: 'application/json',
    content: JSON.stringify({
      mint,
      priceUSD: priceData?.price || 0,
      priceChange24h: priceData?.priceChange24h || 0,
      volume24h: priceData?.volume24h || 0,
      lastUpdated: new Date().toISOString(),
    }, null, 2),
  };
}

export async function getTrendingTokensResource(): Promise<Resource & { content: string }> {
  logger.debug('Fetching trending tokens resource');
  
  const tokens = await fetchTrendingTokens();
  
  return {
    uri: 'tokens://list/trending',
    name: 'Trending Tokens',
    mimeType: 'application/json',
    content: JSON.stringify({ tokens, count: tokens.length }, null, 2),
  };
}

// Fetch token metadata from Jupiter token list
async function fetchTokenMetadata(mint: string): Promise<{
  symbol: string;
  name: string;
  decimals: number;
  logoURI?: string;
  verified: boolean;
} | null> {
  try {
    const response = await fetch(JUPITER_TOKEN_LIST, {
      signal: AbortSignal.timeout(10000),
    });

    if (!response.ok) return null;

    const tokens = await response.json() as Array<{
      address: string;
      symbol: string;
      name: string;
      decimals: number;
      logoURI?: string;
    }>;

    const token = tokens.find((t) => t.address === mint);
    if (!token) return null;

    return {
      symbol: token.symbol,
      name: token.name,
      decimals: token.decimals,
      logoURI: token.logoURI,
      verified: true, // Jupiter strict list = verified
    };
  } catch (error) {
    logger.error({ error, mint }, 'Failed to fetch token metadata');
    return null;
  }
}

// Fetch token price from Jupiter Price API
async function fetchTokenPrice(mint: string): Promise<{
  price: number;
  priceChange24h?: number;
  volume24h?: number;
} | null> {
  try {
    const response = await fetch(`${JUPITER_PRICE_API}?ids=${mint}`, {
      signal: AbortSignal.timeout(10000),
    });

    if (!response.ok) return null;

    const data = await response.json() as {
      data?: Record<string, { price?: string }>;
    };

    const tokenData = data.data?.[mint];
    if (!tokenData?.price) return null;

    // Try to get extended data from Birdeye
    let priceChange24h: number | undefined;
    let volume24h: number | undefined;

    if (process.env.BIRDEYE_API_KEY) {
      try {
        const birdeyeResponse = await fetch(
          `${BIRDEYE_API}/defi/token_overview?address=${mint}`,
          {
            headers: { 'X-API-KEY': process.env.BIRDEYE_API_KEY },
            signal: AbortSignal.timeout(5000),
          }
        );

        if (birdeyeResponse.ok) {
          const birdeyeData = await birdeyeResponse.json() as {
            data?: { priceChange24h?: number; v24hUSD?: number };
          };
          priceChange24h = birdeyeData.data?.priceChange24h;
          volume24h = birdeyeData.data?.v24hUSD;
        }
      } catch {
        // Birdeye data is optional
      }
    }

    return {
      price: parseFloat(tokenData.price),
      priceChange24h,
      volume24h,
    };
  } catch (error) {
    logger.error({ error, mint }, 'Failed to fetch token price');
    return null;
  }
}

// Fetch token supply info from Solana RPC
async function fetchTokenSupply(mint: string): Promise<{
  supply: number;
  holders?: number;
} | null> {
  if (!HELIUS_RPC) return null;

  try {
    const response = await fetch(HELIUS_RPC, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        jsonrpc: '2.0',
        id: 1,
        method: 'getTokenSupply',
        params: [mint],
      }),
      signal: AbortSignal.timeout(10000),
    });

    if (!response.ok) return null;

    const data = await response.json() as {
      result?: { value?: { uiAmount?: number } };
    };

    return {
      supply: data.result?.value?.uiAmount || 0,
    };
  } catch (error) {
    logger.error({ error, mint }, 'Failed to fetch token supply');
    return null;
  }
}

// Fetch trending tokens from Birdeye
async function fetchTrendingTokens(): Promise<Array<{
  mint: string;
  symbol: string;
  name: string;
  priceUSD: number;
  priceChange24h: number;
  volume24h: number;
}>> {
  if (!process.env.BIRDEYE_API_KEY) {
    return [];
  }

  try {
    const response = await fetch(
      `${BIRDEYE_API}/defi/tokenlist?sort_by=v24hUSD&sort_type=desc&limit=20`,
      {
        headers: { 'X-API-KEY': process.env.BIRDEYE_API_KEY },
        signal: AbortSignal.timeout(10000),
      }
    );

    if (!response.ok) return [];

    const data = await response.json() as {
      data?: { tokens?: Array<{
        address: string;
        symbol: string;
        name: string;
        price?: number;
        priceChange24h?: number;
        v24hUSD?: number;
      }> };
    };

    return (data.data?.tokens || []).map((t) => ({
      mint: t.address,
      symbol: t.symbol,
      name: t.name,
      priceUSD: t.price || 0,
      priceChange24h: t.priceChange24h || 0,
      volume24h: t.v24hUSD || 0,
    }));
  } catch (error) {
    logger.error({ error }, 'Failed to fetch trending tokens');
    return [];
  }
}

// Clear token cache
export function clearTokenCache(): void {
  tokenCache.clear();
  logger.info('Token cache cleared');
}
