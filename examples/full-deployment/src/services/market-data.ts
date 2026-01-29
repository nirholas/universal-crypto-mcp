/**
 * Market Data Service
 * 
 * Real implementations for fetching cryptocurrency market data.
 * Uses CoinGecko API (free tier) with caching and rate limiting.
 * 
 * @author Universal Crypto MCP
 * @license Apache-2.0
 */

// Simple in-memory cache
const cache = new Map<string, { data: any; expires: number }>();
const CACHE_TTL = 30000; // 30 seconds

function getCached<T>(key: string): T | null {
  const entry = cache.get(key);
  if (entry && Date.now() < entry.expires) {
    return entry.data as T;
  }
  cache.delete(key);
  return null;
}

function setCache(key: string, data: any): void {
  cache.set(key, { data, expires: Date.now() + CACHE_TTL });
}

// CoinGecko ID mappings for common symbols
const SYMBOL_TO_ID: Record<string, string> = {
  BTC: "bitcoin",
  ETH: "ethereum",
  SOL: "solana",
  USDC: "usd-coin",
  USDT: "tether",
  BNB: "binancecoin",
  XRP: "ripple",
  ADA: "cardano",
  DOGE: "dogecoin",
  DOT: "polkadot",
  MATIC: "matic-network",
  SHIB: "shiba-inu",
  AVAX: "avalanche-2",
  LINK: "chainlink",
  UNI: "uniswap",
  ATOM: "cosmos",
  LTC: "litecoin",
  ARB: "arbitrum",
  OP: "optimism",
  APT: "aptos",
  NEAR: "near",
  FTM: "fantom",
  AAVE: "aave",
  MKR: "maker",
  CRV: "curve-dao-token",
  LDO: "lido-dao",
  PEPE: "pepe",
  WIF: "dogwifcoin",
  BONK: "bonk",
};

function resolveSymbol(symbol: string): string {
  const upper = symbol.toUpperCase();
  return SYMBOL_TO_ID[upper] || symbol.toLowerCase();
}

export interface PriceData {
  symbol: string;
  name: string;
  price: number;
  change24h: number;
  change7d: number;
  marketCap: number;
  volume24h: number;
  high24h: number;
  low24h: number;
  ath: number;
  athDate: string;
  lastUpdated: string;
}

export interface MarketOverview {
  totalMarketCap: number;
  totalMarketCapFormatted: string;
  totalVolume24h: number;
  totalVolume24hFormatted: string;
  btcDominance: number;
  ethDominance: number;
  activeCryptocurrencies: number;
  markets: number;
  marketCapChange24h: number;
  updatedAt: string;
}

export interface TrendingCoin {
  rank: number;
  id: string;
  name: string;
  symbol: string;
  marketCapRank: number;
  priceUsd: number;
  change24h: number;
  thumb: string;
}

export interface CoinDetails {
  id: string;
  symbol: string;
  name: string;
  description: string;
  links: {
    homepage: string[];
    twitter: string;
    telegram: string;
    reddit: string;
    github: string[];
  };
  marketData: PriceData;
  sentiment: {
    upPercentage: number;
    downPercentage: number;
  };
  developerScore: number;
  communityScore: number;
  liquidityScore: number;
  categories: string[];
}

/**
 * Get current price for a cryptocurrency
 */
export async function getPrice(symbol: string): Promise<PriceData> {
  const coinId = resolveSymbol(symbol);
  const cacheKey = `price:${coinId}`;
  
  const cached = getCached<PriceData>(cacheKey);
  if (cached) return cached;
  
  const response = await fetch(
    `https://api.coingecko.com/api/v3/coins/${coinId}?localization=false&tickers=false&market_data=true&community_data=false&developer_data=false&sparkline=false`
  );
  
  if (!response.ok) {
    if (response.status === 404) {
      throw new Error(`Coin "${symbol}" not found. Try using CoinGecko ID (e.g., bitcoin, ethereum)`);
    }
    throw new Error(`CoinGecko API error: ${response.status}`);
  }
  
  const data = await response.json();
  const market = data.market_data;
  
  const result: PriceData = {
    symbol: data.symbol.toUpperCase(),
    name: data.name,
    price: market.current_price.usd,
    change24h: market.price_change_percentage_24h || 0,
    change7d: market.price_change_percentage_7d || 0,
    marketCap: market.market_cap.usd,
    volume24h: market.total_volume.usd,
    high24h: market.high_24h.usd,
    low24h: market.low_24h.usd,
    ath: market.ath.usd,
    athDate: market.ath_date.usd,
    lastUpdated: data.last_updated,
  };
  
  setCache(cacheKey, result);
  return result;
}

/**
 * Get prices for multiple cryptocurrencies
 */
export async function getPrices(symbols: string[]): Promise<PriceData[]> {
  const ids = symbols.map(resolveSymbol).join(",");
  const cacheKey = `prices:${ids}`;
  
  const cached = getCached<PriceData[]>(cacheKey);
  if (cached) return cached;
  
  const response = await fetch(
    `https://api.coingecko.com/api/v3/coins/markets?vs_currency=usd&ids=${ids}&order=market_cap_desc&per_page=100&page=1&sparkline=false&price_change_percentage=24h,7d`
  );
  
  if (!response.ok) {
    throw new Error(`CoinGecko API error: ${response.status}`);
  }
  
  const data = await response.json();
  
  const results: PriceData[] = data.map((coin: any) => ({
    symbol: coin.symbol.toUpperCase(),
    name: coin.name,
    price: coin.current_price,
    change24h: coin.price_change_percentage_24h || 0,
    change7d: coin.price_change_percentage_7d_in_currency || 0,
    marketCap: coin.market_cap,
    volume24h: coin.total_volume,
    high24h: coin.high_24h,
    low24h: coin.low_24h,
    ath: coin.ath,
    athDate: coin.ath_date,
    lastUpdated: coin.last_updated,
  }));
  
  setCache(cacheKey, results);
  return results;
}

/**
 * Get global market overview
 */
export async function getMarketOverview(): Promise<MarketOverview> {
  const cacheKey = "market:overview";
  
  const cached = getCached<MarketOverview>(cacheKey);
  if (cached) return cached;
  
  const response = await fetch("https://api.coingecko.com/api/v3/global");
  
  if (!response.ok) {
    throw new Error(`CoinGecko API error: ${response.status}`);
  }
  
  const { data } = await response.json();
  
  const formatLargeNumber = (num: number): string => {
    if (num >= 1e12) return `$${(num / 1e12).toFixed(2)}T`;
    if (num >= 1e9) return `$${(num / 1e9).toFixed(2)}B`;
    if (num >= 1e6) return `$${(num / 1e6).toFixed(2)}M`;
    return `$${num.toFixed(2)}`;
  };
  
  const result: MarketOverview = {
    totalMarketCap: data.total_market_cap.usd,
    totalMarketCapFormatted: formatLargeNumber(data.total_market_cap.usd),
    totalVolume24h: data.total_volume.usd,
    totalVolume24hFormatted: formatLargeNumber(data.total_volume.usd),
    btcDominance: data.market_cap_percentage.btc,
    ethDominance: data.market_cap_percentage.eth,
    activeCryptocurrencies: data.active_cryptocurrencies,
    markets: data.markets,
    marketCapChange24h: data.market_cap_change_percentage_24h_usd,
    updatedAt: new Date().toISOString(),
  };
  
  setCache(cacheKey, result);
  return result;
}

/**
 * Get trending coins
 */
export async function getTrending(): Promise<TrendingCoin[]> {
  const cacheKey = "trending";
  
  const cached = getCached<TrendingCoin[]>(cacheKey);
  if (cached) return cached;
  
  const response = await fetch("https://api.coingecko.com/api/v3/search/trending");
  
  if (!response.ok) {
    throw new Error(`CoinGecko API error: ${response.status}`);
  }
  
  const data = await response.json();
  
  const results: TrendingCoin[] = data.coins.slice(0, 10).map((item: any, index: number) => ({
    rank: index + 1,
    id: item.item.id,
    name: item.item.name,
    symbol: item.item.symbol.toUpperCase(),
    marketCapRank: item.item.market_cap_rank,
    priceUsd: item.item.data?.price || 0,
    change24h: item.item.data?.price_change_percentage_24h?.usd || 0,
    thumb: item.item.thumb,
  }));
  
  setCache(cacheKey, results);
  return results;
}

/**
 * Get detailed coin information
 */
export async function getCoinDetails(symbol: string): Promise<CoinDetails> {
  const coinId = resolveSymbol(symbol);
  const cacheKey = `details:${coinId}`;
  
  const cached = getCached<CoinDetails>(cacheKey);
  if (cached) return cached;
  
  const response = await fetch(
    `https://api.coingecko.com/api/v3/coins/${coinId}?localization=false&tickers=false&market_data=true&community_data=true&developer_data=true&sparkline=false`
  );
  
  if (!response.ok) {
    if (response.status === 404) {
      throw new Error(`Coin "${symbol}" not found`);
    }
    throw new Error(`CoinGecko API error: ${response.status}`);
  }
  
  const data = await response.json();
  const market = data.market_data;
  
  const result: CoinDetails = {
    id: data.id,
    symbol: data.symbol.toUpperCase(),
    name: data.name,
    description: data.description?.en?.slice(0, 500) || "",
    links: {
      homepage: data.links?.homepage?.filter(Boolean) || [],
      twitter: data.links?.twitter_screen_name ? `https://twitter.com/${data.links.twitter_screen_name}` : "",
      telegram: data.links?.telegram_channel_identifier ? `https://t.me/${data.links.telegram_channel_identifier}` : "",
      reddit: data.links?.subreddit_url || "",
      github: data.links?.repos_url?.github?.filter(Boolean) || [],
    },
    marketData: {
      symbol: data.symbol.toUpperCase(),
      name: data.name,
      price: market.current_price.usd,
      change24h: market.price_change_percentage_24h || 0,
      change7d: market.price_change_percentage_7d || 0,
      marketCap: market.market_cap.usd,
      volume24h: market.total_volume.usd,
      high24h: market.high_24h.usd,
      low24h: market.low_24h.usd,
      ath: market.ath.usd,
      athDate: market.ath_date.usd,
      lastUpdated: data.last_updated,
    },
    sentiment: {
      upPercentage: data.sentiment_votes_up_percentage || 0,
      downPercentage: data.sentiment_votes_down_percentage || 0,
    },
    developerScore: data.developer_score || 0,
    communityScore: data.community_score || 0,
    liquidityScore: data.liquidity_score || 0,
    categories: data.categories || [],
  };
  
  setCache(cacheKey, result);
  return result;
}

/**
 * Get Fear & Greed Index
 */
export async function getFearGreedIndex(): Promise<{
  value: number;
  classification: string;
  timestamp: string;
  previousValue: number;
  previousClassification: string;
}> {
  const cacheKey = "feargreed";
  
  const cached = getCached<any>(cacheKey);
  if (cached) return cached;
  
  const response = await fetch("https://api.alternative.me/fng/?limit=2");
  
  if (!response.ok) {
    throw new Error(`Fear & Greed API error: ${response.status}`);
  }
  
  const { data } = await response.json();
  
  const result = {
    value: parseInt(data[0].value),
    classification: data[0].value_classification,
    timestamp: new Date(parseInt(data[0].timestamp) * 1000).toISOString(),
    previousValue: parseInt(data[1].value),
    previousClassification: data[1].value_classification,
  };
  
  setCache(cacheKey, result);
  return result;
}

/**
 * Get OHLCV data for a coin
 */
export async function getOHLCV(
  symbol: string,
  days: number = 30
): Promise<{
  symbol: string;
  data: Array<{
    timestamp: string;
    open: number;
    high: number;
    low: number;
    close: number;
  }>;
}> {
  const coinId = resolveSymbol(symbol);
  const cacheKey = `ohlcv:${coinId}:${days}`;
  
  const cached = getCached<any>(cacheKey);
  if (cached) return cached;
  
  const response = await fetch(
    `https://api.coingecko.com/api/v3/coins/${coinId}/ohlc?vs_currency=usd&days=${days}`
  );
  
  if (!response.ok) {
    throw new Error(`CoinGecko API error: ${response.status}`);
  }
  
  const data = await response.json();
  
  const result = {
    symbol: symbol.toUpperCase(),
    data: data.map((candle: number[]) => ({
      timestamp: new Date(candle[0]).toISOString(),
      open: candle[1],
      high: candle[2],
      low: candle[3],
      close: candle[4],
    })),
  };
  
  setCache(cacheKey, result);
  return result;
}
