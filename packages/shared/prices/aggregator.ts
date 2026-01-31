/**
 * @file aggregator.ts
 * @author nirholas
 * @copyright (c) 2026 nichxbt
 * @repository universal-crypto-mcp
 * @version 0.4.14.3
 *
 * Price feed aggregator with CoinGecko and DeFiLlama support
 * Implements: workers.ts#L96 TODO
 */

// Cache for price data
const priceCache = new Map<string, { price: number; timestamp: number }>();
const CACHE_TTL = 60 * 1000; // 1 minute

export interface PriceData {
  id: string;
  symbol: string;
  price: number;
  change24h: number;
  volume24h: number;
  marketCap: number;
  lastUpdated: string;
}

export interface TokenPriceResult {
  price: number;
  source: "coingecko" | "defillama" | "cache";
  timestamp: number;
}

/**
 * Fetch prices from CoinGecko API
 */
export async function getCoinGeckoPrices(
  tokenIds: string[],
  vsCurrency: string = "usd"
): Promise<Record<string, PriceData>> {
  const ids = tokenIds.join(",");
  const url = `https://api.coingecko.com/api/v3/coins/markets?vs_currency=${vsCurrency}&ids=${ids}&order=market_cap_desc&sparkline=false&price_change_percentage=24h`;

  const response = await fetch(url, {
    headers: {
      Accept: "application/json",
      "x-cg-demo-api-key": process.env.COINGECKO_API_KEY || "",
    },
    signal: AbortSignal.timeout(10000),
  });

  if (!response.ok) {
    throw new Error(`CoinGecko API error: ${response.status}`);
  }

  const data = (await response.json()) as Array<{
    id: string;
    symbol: string;
    current_price: number;
    price_change_percentage_24h: number;
    total_volume: number;
    market_cap: number;
    last_updated: string;
  }>;

  const result: Record<string, PriceData> = {};

  for (const coin of data) {
    result[coin.id] = {
      id: coin.id,
      symbol: coin.symbol,
      price: coin.current_price,
      change24h: coin.price_change_percentage_24h || 0,
      volume24h: coin.total_volume || 0,
      marketCap: coin.market_cap || 0,
      lastUpdated: coin.last_updated,
    };

    // Update cache
    priceCache.set(coin.id, {
      price: coin.current_price,
      timestamp: Date.now(),
    });
  }

  return result;
}

/**
 * Fetch prices from DeFiLlama API
 */
export async function getDefiLlamaPrices(
  coins: string[] // Format: "chain:address" e.g., "ethereum:0x..."
): Promise<Record<string, number>> {
  const coinsParam = coins.join(",");
  const url = `https://coins.llama.fi/prices/current/${coinsParam}`;

  const response = await fetch(url, {
    signal: AbortSignal.timeout(10000),
  });

  if (!response.ok) {
    throw new Error(`DeFiLlama API error: ${response.status}`);
  }

  const data = (await response.json()) as {
    coins: Record<string, { price: number; symbol: string; decimals: number }>;
  };

  const result: Record<string, number> = {};

  for (const [key, value] of Object.entries(data.coins || {})) {
    result[key] = value.price;

    // Update cache
    priceCache.set(key, {
      price: value.price,
      timestamp: Date.now(),
    });
  }

  return result;
}

/**
 * Get price with caching
 */
export async function getCachedPrice(
  tokenId: string
): Promise<TokenPriceResult | null> {
  const cached = priceCache.get(tokenId);

  if (cached && Date.now() - cached.timestamp < CACHE_TTL) {
    return {
      price: cached.price,
      source: "cache",
      timestamp: cached.timestamp,
    };
  }

  try {
    const prices = await getCoinGeckoPrices([tokenId]);
    if (prices[tokenId]) {
      return {
        price: prices[tokenId].price,
        source: "coingecko",
        timestamp: Date.now(),
      };
    }
    return null;
  } catch (error) {
    console.error(`Failed to fetch price for ${tokenId}:`, error);
    // Return stale cache if available
    if (cached) {
      return {
        price: cached.price,
        source: "cache",
        timestamp: cached.timestamp,
      };
    }
    return null;
  }
}

/**
 * Token address to CoinGecko ID mapping
 */
const TOKEN_ID_MAP: Record<string, string> = {
  // Ethereum Mainnet
  "0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48": "usd-coin",
  "0xdAC17F958D2ee523a2206206994597C13D831ec7": "tether",
  "0x6B175474E89094C44Da98b954EedeAC495271d0F": "dai",
  "0x2260FAC5E5542a773Aa44fBCfeDf7C193bc2C599": "wrapped-bitcoin",
  "0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2": "weth",
  "0x7Fc66500c84A76Ad7e9c93437bFc5Ac33E2DDaE9": "aave",
  "0x1f9840a85d5aF5bf1D1762F925BDADdC4201F984": "uniswap",
  // Base
  "0x833589fCD6eDb6E08f4c7C32D4f71b54bdA02913": "usd-coin",
  "0x4200000000000000000000000000000000000006": "weth",
  "0x50c5725949A6F0c72E6C4a641F24049A917DB0Cb": "dai",
  // Arbitrum
  "0xaf88d065e77c8cC2239327C5EDb3A432268e5831": "usd-coin",
  "0x82aF49447D8a07e3bd95BD0d56f35241523fBab1": "weth",
  "0xFd086bC7CD5C481DCC9C85ebE478A1C0b69FCbb9": "tether",
  // Solana (use native addresses)
  So11111111111111111111111111111111111111112: "solana",
  EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v: "usd-coin",
  Es9vMFrzaCERmJfrF4H2FYD4KCoNkY11McCe8BenwNYB: "tether",
};

export function getTokenIdFromAddress(address: string): string | undefined {
  return TOKEN_ID_MAP[address] || TOKEN_ID_MAP[address.toLowerCase()];
}

/**
 * Chain name to DeFiLlama prefix mapping
 */
const CHAIN_PREFIXES: Record<string, string> = {
  ethereum: "ethereum",
  base: "base",
  arbitrum: "arbitrum",
  optimism: "optimism",
  polygon: "polygon",
  avalanche: "avax",
  bsc: "bsc",
};

/**
 * Multi-source price aggregator
 */
export async function getAggregatedPrice(
  tokenAddress: string,
  chain: string = "ethereum"
): Promise<TokenPriceResult | null> {
  // Check cache first
  const cacheKey = `${chain}:${tokenAddress}`;
  const cached = priceCache.get(cacheKey);
  if (cached && Date.now() - cached.timestamp < CACHE_TTL) {
    return {
      price: cached.price,
      source: "cache",
      timestamp: cached.timestamp,
    };
  }

  // Try CoinGecko first (if we have a mapping)
  const geckoId = getTokenIdFromAddress(tokenAddress);
  if (geckoId) {
    try {
      const prices = await getCoinGeckoPrices([geckoId]);
      if (prices[geckoId]) {
        priceCache.set(cacheKey, {
          price: prices[geckoId].price,
          timestamp: Date.now(),
        });
        return {
          price: prices[geckoId].price,
          source: "coingecko",
          timestamp: Date.now(),
        };
      }
    } catch (error) {
      console.warn(`CoinGecko failed for ${geckoId}:`, error);
    }
  }

  // Fallback to DeFiLlama
  try {
    const chainPrefix = CHAIN_PREFIXES[chain.toLowerCase()] || chain;
    const llamaKey = `${chainPrefix}:${tokenAddress}`;
    const prices = await getDefiLlamaPrices([llamaKey]);
    if (prices[llamaKey]) {
      priceCache.set(cacheKey, {
        price: prices[llamaKey],
        timestamp: Date.now(),
      });
      return {
        price: prices[llamaKey],
        source: "defillama",
        timestamp: Date.now(),
      };
    }
  } catch (error) {
    console.warn(`DeFiLlama failed for ${tokenAddress}:`, error);
  }

  // Return stale cache if available
  if (cached) {
    return {
      price: cached.price,
      source: "cache",
      timestamp: cached.timestamp,
    };
  }

  return null;
}

/**
 * Batch price fetcher for multiple tokens
 */
export async function getBatchPrices(
  tokens: Array<{ address: string; chain: string }>
): Promise<Record<string, TokenPriceResult>> {
  const results: Record<string, TokenPriceResult> = {};

  // Group by approach
  const geckoIds: string[] = [];
  const llamaKeys: string[] = [];
  const tokenKeyMap: Record<string, string> = {};

  for (const token of tokens) {
    const key = `${token.chain}:${token.address}`;
    const geckoId = getTokenIdFromAddress(token.address);

    if (geckoId) {
      geckoIds.push(geckoId);
      tokenKeyMap[geckoId] = key;
    } else {
      const chainPrefix =
        CHAIN_PREFIXES[token.chain.toLowerCase()] || token.chain;
      const llamaKey = `${chainPrefix}:${token.address}`;
      llamaKeys.push(llamaKey);
      tokenKeyMap[llamaKey] = key;
    }
  }

  // Fetch from CoinGecko
  if (geckoIds.length > 0) {
    try {
      const geckoData = await getCoinGeckoPrices(geckoIds);
      for (const [id, data] of Object.entries(geckoData)) {
        const key = tokenKeyMap[id];
        if (key) {
          results[key] = {
            price: data.price,
            source: "coingecko",
            timestamp: Date.now(),
          };
        }
      }
    } catch (error) {
      console.warn("CoinGecko batch failed:", error);
    }
  }

  // Fetch from DeFiLlama
  if (llamaKeys.length > 0) {
    try {
      const llamaData = await getDefiLlamaPrices(llamaKeys);
      for (const [llamaKey, price] of Object.entries(llamaData)) {
        const key = tokenKeyMap[llamaKey];
        if (key) {
          results[key] = {
            price,
            source: "defillama",
            timestamp: Date.now(),
          };
        }
      }
    } catch (error) {
      console.warn("DeFiLlama batch failed:", error);
    }
  }

  return results;
}

/**
 * Clear the price cache
 */
export function clearPriceCache(): void {
  priceCache.clear();
}

export default {
  getCoinGeckoPrices,
  getDefiLlamaPrices,
  getCachedPrice,
  getAggregatedPrice,
  getBatchPrices,
  getTokenIdFromAddress,
  clearPriceCache,
};
