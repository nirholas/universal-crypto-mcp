/**
 * CoinGecko API Client
 * 
 * Production-ready client for CoinGecko's cryptocurrency data API.
 * Implements rate limiting, caching, and proper error handling.
 * 
 * @see https://docs.coingecko.com/reference/introduction
 * 
 * Rate Limits:
 * - Free tier: 10-30 calls/minute
 * - Demo API key: 30 calls/minute
 * - Pro API key: Higher limits
 */

import { 
  SimpleCache, 
  RateLimiter, 
  HttpClient, 
  TokenNotFoundError, 
  APIError 
} from '@boosty/mcp-shared';

const COINGECKO_BASE_URL = 'https://api.coingecko.com/api/v3';
const COINGECKO_PRO_URL = 'https://pro-api.coingecko.com/api/v3';

/**
 * Symbol to CoinGecko ID mapping for popular tokens
 * Provides instant lookups without requiring API calls
 */
const SYMBOL_TO_ID: Record<string, string> = {
  // Major cryptocurrencies
  btc: 'bitcoin',
  eth: 'ethereum',
  usdt: 'tether',
  usdc: 'usd-coin',
  bnb: 'binancecoin',
  xrp: 'ripple',
  ada: 'cardano',
  doge: 'dogecoin',
  sol: 'solana',
  trx: 'tron',
  dot: 'polkadot',
  matic: 'matic-network',
  shib: 'shiba-inu',
  avax: 'avalanche-2',
  link: 'chainlink',
  
  // DeFi tokens
  uni: 'uniswap',
  aave: 'aave',
  mkr: 'maker',
  crv: 'curve-dao-token',
  snx: 'havven',
  comp: 'compound-governance-token',
  ldo: 'lido-dao',
  rpl: 'rocket-pool',
  gmx: 'gmx',
  rdnt: 'radiant-capital',
  pendle: 'pendle',
  '1inch': '1inch',
  dydx: 'dydx',
  bal: 'balancer',
  yfi: 'yearn-finance',
  sushi: 'sushi',
  cake: 'pancakeswap-token',
  
  // Layer 2 & Alt L1s
  arb: 'arbitrum',
  op: 'optimism',
  apt: 'aptos',
  sui: 'sui',
  sei: 'sei-network',
  inj: 'injective-protocol',
  tia: 'celestia',
  stx: 'blockstack',
  near: 'near',
  atom: 'cosmos',
  ftm: 'fantom',
  algo: 'algorand',
  hbar: 'hedera-hashgraph',
  vet: 'vechain',
  
  // Stablecoins
  dai: 'dai',
  frax: 'frax',
  lusd: 'liquity-usd',
  usds: 'boosty-usd',
  tusd: 'true-usd',
  usdp: 'paxos-standard',
  gusd: 'gemini-dollar',
  busd: 'binance-usd',
  
  // Wrapped & Staked assets
  weth: 'weth',
  wbtc: 'wrapped-bitcoin',
  steth: 'staked-ether',
  reth: 'rocket-pool-eth',
  cbeth: 'coinbase-wrapped-staked-eth',
  wsteth: 'wrapped-steth',
  frxeth: 'frax-ether',
  
  // Gaming & Metaverse
  sand: 'the-sandbox',
  mana: 'decentraland',
  axs: 'axie-infinity',
  ape: 'apecoin',
  imx: 'immutable-x',
  magic: 'magic',
  gala: 'gala',
  
  // AI & Data
  rndr: 'render-token',
  grt: 'the-graph',
  fet: 'fetch-ai',
  ocean: 'ocean-protocol',
  ar: 'arweave',
  fil: 'filecoin',
  
  // Meme coins
  pepe: 'pepe',
  floki: 'floki',
  bonk: 'bonk',
  wif: 'dogwifcoin',
  
  // Exchange tokens
  cro: 'crypto-com-chain',
  okb: 'okb',
  kcs: 'kucoin-shares',
  leo: 'leo-token',
  
  // Other notable tokens
  ltc: 'litecoin',
  etc: 'ethereum-classic',
  xlm: 'stellar',
  xmr: 'monero',
  bch: 'bitcoin-cash',
  icp: 'internet-computer',
  blur: 'blur',
  spa: 'boosty',
};

// ============================================================================
// Types & Interfaces
// ============================================================================

export interface TokenPrice {
  price: number;
  change24h: number;
  marketCap: number;
  volume24h: number;
  lastUpdated: string;
}

export interface PriceHistoryPoint {
  timestamp: number;
  price: number;
}

export interface TopCoin {
  id: string;
  symbol: string;
  name: string;
  price: number;
  change1h: number;
  change24h: number;
  change7d: number;
  marketCap: number;
  volume24h: number;
  rank: number;
}

export interface SearchResult {
  id: string;
  symbol: string;
  name: string;
  rank: number | null;
}

// CoinGecko API Response Types
interface CGPriceResponse {
  [coinId: string]: {
    [key: string]: number | undefined;
  };
}

interface CGMarketChartResponse {
  prices: Array<[number, number]>;
  market_caps: Array<[number, number]>;
  total_volumes: Array<[number, number]>;
}

interface CGMarketCoin {
  id: string;
  symbol: string;
  name: string;
  current_price: number | null;
  market_cap: number | null;
  market_cap_rank: number | null;
  total_volume: number | null;
  price_change_percentage_1h_in_currency: number | null;
  price_change_percentage_24h_in_currency: number | null;
  price_change_percentage_7d_in_currency: number | null;
}

interface CGSearchResponse {
  coins: Array<{
    id: string;
    symbol: string;
    name: string;
    market_cap_rank: number | null;
  }>;
}

// ============================================================================
// CoinGecko Client Implementation
// ============================================================================

export interface CoinGeckoClientOptions {
  apiKey?: string;
  usePro?: boolean;
  timeout?: number;
}

export class CoinGeckoClient {
  private cache: SimpleCache<unknown>;
  private rateLimiter: RateLimiter;
  private httpClient: HttpClient;

  constructor(options: CoinGeckoClientOptions = {}) {
    const apiKey = options.apiKey || process.env.COINGECKO_API_KEY;
    const usePro = options.usePro || !!process.env.COINGECKO_PRO_API_KEY;
    const timeout = options.timeout || 15_000;

    // Cache: 30 second default TTL, max 1000 entries
    this.cache = new SimpleCache(30_000, 1000);

    // Rate limiter: 0.4 tokens/sec = ~24/min (conservative for free tier)
    // Pro users can create with higher limits
    this.rateLimiter = new RateLimiter({
      maxTokens: 10,
      refillRate: apiKey ? 0.5 : 0.4,
      initialTokens: 10,
    });

    // HTTP client configuration
    const baseUrl = usePro ? COINGECKO_PRO_URL : COINGECKO_BASE_URL;
    const headers: Record<string, string> = {
      'Accept': 'application/json',
    };

    if (apiKey) {
      if (usePro) {
        headers['x-cg-pro-api-key'] = apiKey;
      } else {
        headers['x-cg-demo-api-key'] = apiKey;
      }
    }

    this.httpClient = new HttpClient({
      baseUrl,
      timeout,
      headers,
    });
  }

  /**
   * Build URL query string from parameters
   */
  private buildQueryString(params: Record<string, string | number | boolean | undefined>): string {
    const searchParams = new URLSearchParams();
    for (const [key, value] of Object.entries(params)) {
      if (value !== undefined && value !== null && value !== '') {
        searchParams.append(key, String(value));
      }
    }
    const query = searchParams.toString();
    return query ? `?${query}` : '';
  }

  /**
   * Convert symbol to CoinGecko ID
   * Uses mapping for known symbols, falls back to symbol as ID
   */
  private symbolToId(symbol: string): string {
    const normalized = symbol.toLowerCase().trim();
    return SYMBOL_TO_ID[normalized] || normalized;
  }

  /**
   * Get current price for a single token
   * 
   * @param symbol - Token symbol (e.g., 'BTC', 'ETH')
   * @param currency - Fiat currency for price (default: 'usd')
   * @returns Token price data
   * @throws TokenNotFoundError if token not found
   */
  async getPrice(symbol: string, currency: string = 'usd'): Promise<TokenPrice> {
    const cacheKey = `price:${symbol.toLowerCase()}:${currency.toLowerCase()}`;
    const cached = this.cache.get(cacheKey) as TokenPrice | undefined;
    if (cached) return cached;

    await this.rateLimiter.acquire();

    const coinId = this.symbolToId(symbol);
    const currencyLower = currency.toLowerCase();

    const queryString = this.buildQueryString({
      ids: coinId,
      vs_currencies: currencyLower,
      include_24hr_change: true,
      include_market_cap: true,
      include_24hr_vol: true,
      include_last_updated_at: true,
    });

    const response = await this.httpClient.get<CGPriceResponse>(
      `/simple/price${queryString}`
    );

    const data = response[coinId];
    if (!data || data[currencyLower] === undefined) {
      throw new TokenNotFoundError(symbol, 'coingecko');
    }

    const result: TokenPrice = {
      price: data[currencyLower] ?? 0,
      change24h: data[`${currencyLower}_24h_change`] ?? 0,
      marketCap: data[`${currencyLower}_market_cap`] ?? 0,
      volume24h: data[`${currencyLower}_24h_vol`] ?? 0,
      lastUpdated: data['last_updated_at']
        ? new Date((data['last_updated_at'] as number) * 1000).toISOString()
        : new Date().toISOString(),
    };

    this.cache.set(cacheKey, result, 30_000);
    return result;
  }

  /**
   * Get prices for multiple tokens in a single request
   * 
   * @param symbols - Array of token symbols
   * @param currency - Fiat currency for prices
   * @returns Map of symbol -> price data
   */
  async getPrices(symbols: string[], currency: string = 'usd'): Promise<Map<string, TokenPrice>> {
    const results = new Map<string, TokenPrice>();
    const uncachedSymbols: string[] = [];
    const uncachedIds: string[] = [];
    const currencyLower = currency.toLowerCase();

    // Check cache first
    for (const symbol of symbols) {
      const cacheKey = `price:${symbol.toLowerCase()}:${currencyLower}`;
      const cached = this.cache.get(cacheKey) as TokenPrice | undefined;
      if (cached) {
        results.set(symbol.toUpperCase(), cached);
      } else {
        uncachedSymbols.push(symbol);
        uncachedIds.push(this.symbolToId(symbol));
      }
    }

    // Batch fetch uncached prices
    if (uncachedIds.length > 0) {
      await this.rateLimiter.acquire();

      const queryString = this.buildQueryString({
        ids: uncachedIds.join(','),
        vs_currencies: currencyLower,
        include_24hr_change: true,
        include_market_cap: true,
        include_24hr_vol: true,
        include_last_updated_at: true,
      });

      const response = await this.httpClient.get<CGPriceResponse>(
        `/simple/price${queryString}`
      );

      for (let i = 0; i < uncachedSymbols.length; i++) {
        const symbol = uncachedSymbols[i];
        const coinId = uncachedIds[i];
        const data = response[coinId];

        if (data && data[currencyLower] !== undefined) {
          const tokenPrice: TokenPrice = {
            price: data[currencyLower] ?? 0,
            change24h: data[`${currencyLower}_24h_change`] ?? 0,
            marketCap: data[`${currencyLower}_market_cap`] ?? 0,
            volume24h: data[`${currencyLower}_24h_vol`] ?? 0,
            lastUpdated: data['last_updated_at']
              ? new Date((data['last_updated_at'] as number) * 1000).toISOString()
              : new Date().toISOString(),
          };

          const cacheKey = `price:${symbol.toLowerCase()}:${currencyLower}`;
          this.cache.set(cacheKey, tokenPrice, 30_000);
          results.set(symbol.toUpperCase(), tokenPrice);
        }
      }
    }

    return results;
  }

  /**
   * Get historical price data for a token
   * 
   * @param symbol - Token symbol
   * @param days - Number of days of history (1-365)
   * @param currency - Fiat currency
   * @returns Array of price points
   */
  async getHistory(
    symbol: string,
    days: number,
    currency: string = 'usd'
  ): Promise<PriceHistoryPoint[]> {
    // Validate days parameter
    if (days < 1 || days > 365) {
      throw new Error('Days must be between 1 and 365');
    }

    const cacheKey = `history:${symbol.toLowerCase()}:${days}:${currency.toLowerCase()}`;
    const cached = this.cache.get(cacheKey) as PriceHistoryPoint[] | undefined;
    if (cached) return cached;

    await this.rateLimiter.acquire();

    const coinId = this.symbolToId(symbol);
    const queryString = this.buildQueryString({
      vs_currency: currency.toLowerCase(),
      days: days,
    });

    const response = await this.httpClient.get<CGMarketChartResponse>(
      `/coins/${coinId}/market_chart${queryString}`
    );

    if (!response.prices || !Array.isArray(response.prices)) {
      throw new APIError('Invalid response format from CoinGecko', {
        endpoint: `/coins/${coinId}/market_chart`,
        details: { receivedKeys: Object.keys(response) },
      });
    }

    const result: PriceHistoryPoint[] = response.prices.map(
      ([timestamp, price]) => ({ timestamp, price })
    );

    // Cache based on days (longer history = longer cache)
    const cacheTtl = days > 30 ? 10 * 60_000 : 5 * 60_000;
    this.cache.set(cacheKey, result, cacheTtl);
    return result;
  }

  /**
   * Get top coins by market cap
   * 
   * @param limit - Number of coins to return (max 250)
   * @param currency - Fiat currency
   * @param order - Sort order
   * @returns Array of top coins
   */
  async getTopCoins(
    limit: number = 100,
    currency: string = 'usd',
    order: 'market_cap_desc' | 'volume_desc' = 'market_cap_desc'
  ): Promise<TopCoin[]> {
    const safeLimit = Math.min(Math.max(1, limit), 250);
    const cacheKey = `top:${safeLimit}:${currency.toLowerCase()}:${order}`;
    const cached = this.cache.get(cacheKey) as TopCoin[] | undefined;
    if (cached) return cached;

    await this.rateLimiter.acquire();

    const queryString = this.buildQueryString({
      vs_currency: currency.toLowerCase(),
      order,
      per_page: safeLimit,
      page: 1,
      sparkline: false,
      price_change_percentage: '1h,24h,7d',
    });

    const response = await this.httpClient.get<CGMarketCoin[]>(
      `/coins/markets${queryString}`
    );

    if (!Array.isArray(response)) {
      throw new APIError('Invalid response format from CoinGecko', {
        endpoint: '/coins/markets',
        details: { type: typeof response },
      });
    }

    const result: TopCoin[] = response.map((coin) => ({
      id: coin.id,
      symbol: coin.symbol.toUpperCase(),
      name: coin.name,
      price: coin.current_price ?? 0,
      change1h: coin.price_change_percentage_1h_in_currency ?? 0,
      change24h: coin.price_change_percentage_24h_in_currency ?? 0,
      change7d: coin.price_change_percentage_7d_in_currency ?? 0,
      marketCap: coin.market_cap ?? 0,
      volume24h: coin.total_volume ?? 0,
      rank: coin.market_cap_rank ?? 0,
    }));

    // Cache for 1 minute
    this.cache.set(cacheKey, result, 60_000);
    return result;
  }

  /**
   * Search for coins by name or symbol
   * 
   * @param query - Search query
   * @returns Array of matching coins
   */
  async searchCoin(query: string): Promise<SearchResult[]> {
    if (!query || query.trim().length === 0) {
      return [];
    }

    const cacheKey = `search:${query.toLowerCase().trim()}`;
    const cached = this.cache.get(cacheKey) as SearchResult[] | undefined;
    if (cached) return cached;

    await this.rateLimiter.acquire();

    const queryString = this.buildQueryString({ query: query.trim() });
    const response = await this.httpClient.get<CGSearchResponse>(
      `/search${queryString}`
    );

    if (!response.coins || !Array.isArray(response.coins)) {
      return [];
    }

    const result: SearchResult[] = response.coins.slice(0, 25).map((coin) => ({
      id: coin.id,
      symbol: coin.symbol.toUpperCase(),
      name: coin.name,
      rank: coin.market_cap_rank,
    }));

    // Cache for 10 minutes
    this.cache.set(cacheKey, result, 10 * 60_000);
    return result;
  }

  /**
   * Clear all cached data
   */
  clearCache(): void {
    this.cache.clear();
  }
}

// ============================================================================
// Singleton Instance
// ============================================================================

let clientInstance: CoinGeckoClient | null = null;

/**
 * Get or create the CoinGecko client singleton
 */
export function getCoingeckoClient(): CoinGeckoClient {
  if (!clientInstance) {
    clientInstance = new CoinGeckoClient();
  }
  return clientInstance;
}

/**
 * Reset the client singleton (useful for testing)
 */
export function resetCoingeckoClient(): void {
  clientInstance = null;
}

// Convenience export for direct usage
export const coingeckoClient = {
  getPrice: (symbol: string, currency?: string) =>
    getCoingeckoClient().getPrice(symbol, currency),
  getPrices: (symbols: string[], currency?: string) =>
    getCoingeckoClient().getPrices(symbols, currency),
  getHistory: (symbol: string, days: number, currency?: string) =>
    getCoingeckoClient().getHistory(symbol, days, currency),
  getTopCoins: (limit?: number, currency?: string) =>
    getCoingeckoClient().getTopCoins(limit, currency),
  searchCoin: (query: string) =>
    getCoingeckoClient().searchCoin(query),
};
