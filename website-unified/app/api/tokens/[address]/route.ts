/**
 * Individual Token API Route
 * GET /api/tokens/[address] - Get detailed token data
 * 
 * Fetches comprehensive token information from multiple sources
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
const DEXSCREENER_API = 'https://api.dexscreener.com/latest';

const CHAIN_MAP: Record<string, { platform: string; chainId: number }> = {
  ethereum: { platform: 'ethereum', chainId: 1 },
  base: { platform: 'base', chainId: 8453 },
  arbitrum: { platform: 'arbitrum-one', chainId: 42161 },
  polygon: { platform: 'polygon-pos', chainId: 137 },
  optimism: { platform: 'optimistic-ethereum', chainId: 10 },
  bsc: { platform: 'binance-smart-chain', chainId: 56 },
  avalanche: { platform: 'avalanche', chainId: 43114 },
};

// ============================================================================
// Query Schema
// ============================================================================

const QuerySchema = z.object({
  chain: z.string().optional().default('ethereum'),
});

// ============================================================================
// Types
// ============================================================================

interface TokenDetails {
  address: string;
  symbol: string;
  name: string;
  decimals: number;
  chainId: number;
  chain: string;
  logoUri: string | null;
  description: string | null;
  website: string | null;
  twitter: string | null;
  telegram: string | null;
  discord: string | null;
  coingeckoId: string | null;
  price: number;
  priceChange1h: number | null;
  priceChange24h: number;
  priceChange7d: number | null;
  priceChange30d: number | null;
  marketCap: number;
  fullyDilutedValuation: number | null;
  volume24h: number;
  totalSupply: number | null;
  circulatingSupply: number | null;
  maxSupply: number | null;
  ath: number | null;
  athDate: string | null;
  athChangePercentage: number | null;
  atl: number | null;
  atlDate: string | null;
  atlChangePercentage: number | null;
  rank: number | null;
  holders: number | null;
  verified: boolean;
  liquidityPools: LiquidityPool[];
  priceHistory: PricePoint[];
}

interface LiquidityPool {
  dex: string;
  pairAddress: string;
  baseToken: { address: string; symbol: string };
  quoteToken: { address: string; symbol: string };
  liquidity: number;
  volume24h: number;
  priceUsd: number;
}

interface PricePoint {
  timestamp: number;
  price: number;
}

// ============================================================================
// Data Fetchers
// ============================================================================

async function fetchFromCoinGecko(
  address: string,
  platform: string
): Promise<Partial<TokenDetails> | null> {
  try {
    // Try to get token by contract address
    const response = await fetch(
      `${COINGECKO_API}/coins/${platform}/contract/${address}`,
      { next: { revalidate: 60 } }
    );

    if (!response.ok) {
      return null;
    }

    const data = await response.json();

    return {
      symbol: data.symbol?.toUpperCase() || '',
      name: data.name || '',
      logoUri: data.image?.large || data.image?.small || null,
      description: data.description?.en || null,
      website: data.links?.homepage?.[0] || null,
      twitter: data.links?.twitter_screen_name 
        ? `https://twitter.com/${data.links.twitter_screen_name}` 
        : null,
      telegram: data.links?.telegram_channel_identifier
        ? `https://t.me/${data.links.telegram_channel_identifier}`
        : null,
      discord: data.links?.chat_url?.find((u: string) => u.includes('discord')) || null,
      coingeckoId: data.id || null,
      price: data.market_data?.current_price?.usd || 0,
      priceChange1h: data.market_data?.price_change_percentage_1h_in_currency?.usd || null,
      priceChange24h: data.market_data?.price_change_percentage_24h || 0,
      priceChange7d: data.market_data?.price_change_percentage_7d || null,
      priceChange30d: data.market_data?.price_change_percentage_30d || null,
      marketCap: data.market_data?.market_cap?.usd || 0,
      fullyDilutedValuation: data.market_data?.fully_diluted_valuation?.usd || null,
      volume24h: data.market_data?.total_volume?.usd || 0,
      totalSupply: data.market_data?.total_supply || null,
      circulatingSupply: data.market_data?.circulating_supply || null,
      maxSupply: data.market_data?.max_supply || null,
      ath: data.market_data?.ath?.usd || null,
      athDate: data.market_data?.ath_date?.usd || null,
      athChangePercentage: data.market_data?.ath_change_percentage?.usd || null,
      atl: data.market_data?.atl?.usd || null,
      atlDate: data.market_data?.atl_date?.usd || null,
      atlChangePercentage: data.market_data?.atl_change_percentage?.usd || null,
      rank: data.market_cap_rank || null,
      verified: true,
    };
  } catch (error) {
    console.error('CoinGecko fetch error:', error);
    return null;
  }
}

async function fetchFromDefiLlama(
  address: string,
  chain: string
): Promise<{ price: number; symbol: string; decimals: number } | null> {
  try {
    const response = await fetch(
      `${DEFILLAMA_API}/prices/current/${chain}:${address}`,
      { next: { revalidate: 60 } }
    );

    if (!response.ok) return null;

    const data = await response.json();
    const coinData = data.coins?.[`${chain}:${address}`];

    if (!coinData) return null;

    return {
      price: coinData.price || 0,
      symbol: coinData.symbol || '',
      decimals: coinData.decimals || 18,
    };
  } catch (error) {
    console.error('DefiLlama fetch error:', error);
    return null;
  }
}

async function fetchFromDexScreener(
  address: string,
  chain: string
): Promise<{ pools: LiquidityPool[]; price: number } | null> {
  try {
    const response = await fetch(
      `${DEXSCREENER_API}/dex/tokens/${address}`,
      { next: { revalidate: 60 } }
    );

    if (!response.ok) return null;

    const data = await response.json();
    const pairs = data.pairs || [];

    const pools: LiquidityPool[] = pairs.slice(0, 10).map((pair: any) => ({
      dex: pair.dexId || 'unknown',
      pairAddress: pair.pairAddress || '',
      baseToken: {
        address: pair.baseToken?.address || '',
        symbol: pair.baseToken?.symbol || '',
      },
      quoteToken: {
        address: pair.quoteToken?.address || '',
        symbol: pair.quoteToken?.symbol || '',
      },
      liquidity: pair.liquidity?.usd || 0,
      volume24h: pair.volume?.h24 || 0,
      priceUsd: parseFloat(pair.priceUsd) || 0,
    }));

    const price = pairs[0]?.priceUsd ? parseFloat(pairs[0].priceUsd) : 0;

    return { pools, price };
  } catch (error) {
    console.error('DexScreener fetch error:', error);
    return null;
  }
}

async function fetchPriceHistory(
  coingeckoId: string,
  days: number = 7
): Promise<PricePoint[]> {
  try {
    const response = await fetch(
      `${COINGECKO_API}/coins/${coingeckoId}/market_chart?vs_currency=usd&days=${days}`,
      { next: { revalidate: 300 } }
    );

    if (!response.ok) return [];

    const data = await response.json();
    
    return (data.prices || []).map(([timestamp, price]: [number, number]) => ({
      timestamp,
      price,
    }));
  } catch (error) {
    console.error('Price history fetch error:', error);
    return [];
  }
}

// ============================================================================
// GET Handler
// ============================================================================

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ address: string }> }
) {
  try {
    const { address } = await params;
    const { searchParams } = new URL(request.url);
    
    // Validate address format
    const isValidAddress = /^0x[a-fA-F0-9]{40}$/i.test(address);
    if (!isValidAddress) {
      return NextResponse.json(
        {
          success: false,
          error: {
            code: 'INVALID_ADDRESS',
            message: 'Invalid token address format',
          },
        },
        { status: 400 }
      );
    }

    // Parse query params
    const parseResult = QuerySchema.safeParse(Object.fromEntries(searchParams));
    const query = parseResult.success ? parseResult.data : { chain: 'ethereum' };
    
    const chainConfig = CHAIN_MAP[query.chain] || CHAIN_MAP.ethereum;

    // Fetch data from multiple sources in parallel
    const [coinGeckoData, defiLlamaData, dexScreenerData] = await Promise.all([
      fetchFromCoinGecko(address, chainConfig.platform),
      fetchFromDefiLlama(address, query.chain),
      fetchFromDexScreener(address, query.chain),
    ]);

    // Determine best price source
    const price = coinGeckoData?.price || dexScreenerData?.price || defiLlamaData?.price || 0;

    // Build token details
    const tokenDetails: TokenDetails = {
      address,
      symbol: coinGeckoData?.symbol || defiLlamaData?.symbol || 'UNKNOWN',
      name: coinGeckoData?.name || defiLlamaData?.symbol || 'Unknown Token',
      decimals: defiLlamaData?.decimals || 18,
      chainId: chainConfig.chainId,
      chain: query.chain,
      logoUri: coinGeckoData?.logoUri || null,
      description: coinGeckoData?.description || null,
      website: coinGeckoData?.website || null,
      twitter: coinGeckoData?.twitter || null,
      telegram: coinGeckoData?.telegram || null,
      discord: coinGeckoData?.discord || null,
      coingeckoId: coinGeckoData?.coingeckoId || null,
      price,
      priceChange1h: coinGeckoData?.priceChange1h || null,
      priceChange24h: coinGeckoData?.priceChange24h || 0,
      priceChange7d: coinGeckoData?.priceChange7d || null,
      priceChange30d: coinGeckoData?.priceChange30d || null,
      marketCap: coinGeckoData?.marketCap || 0,
      fullyDilutedValuation: coinGeckoData?.fullyDilutedValuation || null,
      volume24h: coinGeckoData?.volume24h || 0,
      totalSupply: coinGeckoData?.totalSupply || null,
      circulatingSupply: coinGeckoData?.circulatingSupply || null,
      maxSupply: coinGeckoData?.maxSupply || null,
      ath: coinGeckoData?.ath || null,
      athDate: coinGeckoData?.athDate || null,
      athChangePercentage: coinGeckoData?.athChangePercentage || null,
      atl: coinGeckoData?.atl || null,
      atlDate: coinGeckoData?.atlDate || null,
      atlChangePercentage: coinGeckoData?.atlChangePercentage || null,
      rank: coinGeckoData?.rank || null,
      holders: null, // Would require on-chain query
      verified: coinGeckoData?.verified || false,
      liquidityPools: dexScreenerData?.pools || [],
      priceHistory: [],
    };

    // Fetch price history if we have a CoinGecko ID
    if (tokenDetails.coingeckoId) {
      tokenDetails.priceHistory = await fetchPriceHistory(tokenDetails.coingeckoId);
    }

    return NextResponse.json({
      success: true,
      data: tokenDetails,
      meta: {
        timestamp: new Date().toISOString(),
        sources: {
          coingecko: !!coinGeckoData,
          defillama: !!defiLlamaData,
          dexscreener: !!dexScreenerData,
        },
      },
    });
  } catch (error) {
    console.error('Token details API error:', error);
    return NextResponse.json(
      {
        success: false,
        error: {
          code: 'INTERNAL_ERROR',
          message: 'Failed to fetch token details',
        },
      },
      { status: 500 }
    );
  }
}
