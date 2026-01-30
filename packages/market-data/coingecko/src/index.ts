/**
 * CoinGecko MCP Server
 *
 * Original Author: CoinGecko
 * Original Repository: https://github.com/coingecko/coingecko-typescript
 * License: MIT
 *
 * Integrated and Enhanced by: Nich (@nichxbt)
 * Website: x.com/nichxbt
 * GitHub: github.com/nirholas
 *
 * This integration maintains the original MIT license while adding
 * Apache-2.0 licensed enhancements for unified API compatibility.
 */

import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { z } from "zod";

// ============================================================================
// CoinGecko API Client
// ============================================================================

export interface CoinGeckoConfig {
  apiKey?: string;
  baseUrl?: string;
  timeout?: number;
}

export interface CoinPrice {
  id: string;
  symbol: string;
  name: string;
  current_price: number;
  market_cap: number;
  market_cap_rank: number;
  price_change_24h: number;
  price_change_percentage_24h: number;
  total_volume: number;
  high_24h: number;
  low_24h: number;
  ath: number;
  ath_change_percentage: number;
  last_updated: string;
}

export interface GlobalData {
  active_cryptocurrencies: number;
  markets: number;
  total_market_cap: Record<string, number>;
  total_volume: Record<string, number>;
  market_cap_percentage: Record<string, number>;
  market_cap_change_percentage_24h_usd: number;
}

export interface TrendingCoin {
  id: string;
  name: string;
  symbol: string;
  market_cap_rank: number;
  price_btc: number;
  score: number;
}

export interface OHLCData {
  timestamp: number;
  open: number;
  high: number;
  low: number;
  close: number;
}

export class CoinGeckoClient {
  private apiKey?: string;
  private baseUrl: string;
  private timeout: number;
  private cache: Map<string, { data: unknown; timestamp: number }> = new Map();
  private cacheTTL = 60000; // 1 minute cache

  constructor(config: CoinGeckoConfig = {}) {
    this.apiKey = config.apiKey || process.env.COINGECKO_API_KEY;
    this.baseUrl = config.baseUrl || "https://api.coingecko.com/api/v3";
    this.timeout = config.timeout || 30000;
  }

  private async fetch<T>(endpoint: string, params: Record<string, string> = {}): Promise<T> {
    const cacheKey = `${endpoint}:${JSON.stringify(params)}`;
    const cached = this.cache.get(cacheKey);

    if (cached && Date.now() - cached.timestamp < this.cacheTTL) {
      return cached.data as T;
    }

    const url = new URL(`${this.baseUrl}${endpoint}`);
    Object.entries(params).forEach(([key, value]) => {
      url.searchParams.append(key, value);
    });

    const headers: Record<string, string> = {
      Accept: "application/json",
    };

    if (this.apiKey) {
      headers["x-cg-demo-api-key"] = this.apiKey;
    }

    const response = await fetch(url.toString(), {
      headers,
      signal: AbortSignal.timeout(this.timeout),
    });

    if (!response.ok) {
      throw new Error(`CoinGecko API error: ${response.status} ${response.statusText}`);
    }

    const data = await response.json();
    this.cache.set(cacheKey, { data, timestamp: Date.now() });
    return data as T;
  }

  /**
   * Get simple price for coins
   * @source Based on CoinGecko API
   */
  async getPrice(
    coinId: string,
    currency = "usd"
  ): Promise<{ price: number; change24h?: number; marketCap?: number; volume24h?: number }> {
    const data = await this.fetch<Record<string, Record<string, number>>>("/simple/price", {
      ids: coinId,
      vs_currencies: currency,
      include_24hr_change: "true",
      include_market_cap: "true",
      include_24hr_vol: "true",
    });

    const coinData = data[coinId];
    if (!coinData) {
      throw new Error(`Coin not found: ${coinId}`);
    }

    return {
      price: coinData[currency],
      change24h: coinData[`${currency}_24h_change`],
      marketCap: coinData[`${currency}_market_cap`],
      volume24h: coinData[`${currency}_24h_vol`],
    };
  }

  /**
   * Get prices for multiple coins (batch)
   * @enhancement Batch processing for efficiency
   */
  async getPricesBatch(
    coinIds: string[],
    currency = "usd"
  ): Promise<Record<string, { price: number; change24h?: number; marketCap?: number }>> {
    const data = await this.fetch<Record<string, Record<string, number>>>("/simple/price", {
      ids: coinIds.join(","),
      vs_currencies: currency,
      include_24hr_change: "true",
      include_market_cap: "true",
    });

    const result: Record<string, { price: number; change24h?: number; marketCap?: number }> = {};

    for (const coinId of coinIds) {
      const coinData = data[coinId];
      if (coinData) {
        result[coinId] = {
          price: coinData[currency],
          change24h: coinData[`${currency}_24h_change`],
          marketCap: coinData[`${currency}_market_cap`],
        };
      }
    }

    return result;
  }

  /**
   * Get top coins by market cap
   * @source Based on CoinGecko API
   */
  async getTopCoins(limit = 100, currency = "usd"): Promise<CoinPrice[]> {
    return this.fetch<CoinPrice[]>("/coins/markets", {
      vs_currency: currency,
      order: "market_cap_desc",
      per_page: limit.toString(),
      page: "1",
      sparkline: "false",
    });
  }

  /**
   * Get trending coins
   * @source Based on CoinGecko API
   */
  async getTrending(): Promise<TrendingCoin[]> {
    const data = await this.fetch<{ coins: Array<{ item: TrendingCoin }> }>("/search/trending");
    return data.coins.map((c) => c.item);
  }

  /**
   * Get global cryptocurrency stats
   * @source Based on CoinGecko API
   */
  async getGlobalData(): Promise<GlobalData> {
    const data = await this.fetch<{ data: GlobalData }>("/global");
    return data.data;
  }

  /**
   * Get historical market data
   * @source Based on CoinGecko API
   */
  async getHistoricalData(
    coinId: string,
    days: number,
    currency = "usd"
  ): Promise<{ prices: [number, number][]; market_caps: [number, number][]; volumes: [number, number][] }> {
    return this.fetch("/coins/" + coinId + "/market_chart", {
      vs_currency: currency,
      days: days.toString(),
    });
  }

  /**
   * Get OHLC candlestick data
   * @source Based on CoinGecko API
   */
  async getOHLC(coinId: string, days: number, currency = "usd"): Promise<OHLCData[]> {
    const data = await this.fetch<number[][]>("/coins/" + coinId + "/ohlc", {
      vs_currency: currency,
      days: days.toString(),
    });

    return data.map(([timestamp, open, high, low, close]) => ({
      timestamp,
      open,
      high,
      low,
      close,
    }));
  }

  /**
   * Search for coins
   * @source Based on CoinGecko API
   */
  async search(
    query: string
  ): Promise<{ coins: Array<{ id: string; name: string; symbol: string; market_cap_rank: number }> }> {
    return this.fetch("/search", { query });
  }

  /**
   * Get coin details
   * @source Based on CoinGecko API
   */
  async getCoinDetails(coinId: string): Promise<{
    id: string;
    symbol: string;
    name: string;
    description: { en: string };
    links: { homepage: string[]; blockchain_site: string[] };
    market_data: {
      current_price: Record<string, number>;
      market_cap: Record<string, number>;
      total_volume: Record<string, number>;
      price_change_percentage_24h: number;
      price_change_percentage_7d: number;
      price_change_percentage_30d: number;
    };
  }> {
    return this.fetch("/coins/" + coinId, {
      localization: "false",
      tickers: "false",
      community_data: "false",
      developer_data: "false",
    });
  }
}

// ============================================================================
// MCP Tool Registration
// ============================================================================

/**
 * Register CoinGecko tools with MCP server
 * @enhancement Unified API for MCP integration
 */
export function registerCoinGeckoTools(server: McpServer, config: CoinGeckoConfig = {}): void {
  const client = new CoinGeckoClient(config);

  // Get current price
  server.tool(
    "coingecko_price",
    "Get current price for a cryptocurrency",
    {
      coinId: z.string().describe("Coin ID (e.g., bitcoin, ethereum)"),
      currency: z.string().optional().describe("Currency to compare against (default: usd)"),
    },
    async ({ coinId, currency }) => {
      const data = await client.getPrice(coinId, currency);
      return {
        content: [
          {
            type: "text",
            text: JSON.stringify(data, null, 2),
          },
        ],
      };
    }
  );

  // Get batch prices
  server.tool(
    "coingecko_prices_batch",
    "Get prices for multiple cryptocurrencies at once",
    {
      coinIds: z.array(z.string()).describe("Array of coin IDs"),
      currency: z.string().optional().describe("Currency to compare against (default: usd)"),
    },
    async ({ coinIds, currency }) => {
      const data = await client.getPricesBatch(coinIds, currency);
      return {
        content: [
          {
            type: "text",
            text: JSON.stringify(data, null, 2),
          },
        ],
      };
    }
  );

  // Get top coins
  server.tool(
    "coingecko_top_coins",
    "Get top cryptocurrencies by market cap",
    {
      limit: z.number().optional().describe("Number of coins to return (default: 100)"),
      currency: z.string().optional().describe("Currency for prices (default: usd)"),
    },
    async ({ limit, currency }) => {
      const data = await client.getTopCoins(limit, currency);
      return {
        content: [
          {
            type: "text",
            text: JSON.stringify(data, null, 2),
          },
        ],
      };
    }
  );

  // Get trending coins
  server.tool("coingecko_trending", "Get trending cryptocurrencies", {}, async () => {
    const data = await client.getTrending();
    return {
      content: [
        {
          type: "text",
          text: JSON.stringify(data, null, 2),
        },
      ],
    };
  });

  // Get global stats
  server.tool("coingecko_global", "Get global cryptocurrency market statistics", {}, async () => {
    const data = await client.getGlobalData();
    return {
      content: [
        {
          type: "text",
          text: JSON.stringify(data, null, 2),
        },
      ],
    };
  });

  // Get historical data
  server.tool(
    "coingecko_historical",
    "Get historical price data for a cryptocurrency",
    {
      coinId: z.string().describe("Coin ID"),
      days: z.number().describe("Number of days of data"),
      currency: z.string().optional().describe("Currency (default: usd)"),
    },
    async ({ coinId, days, currency }) => {
      const data = await client.getHistoricalData(coinId, days, currency);
      return {
        content: [
          {
            type: "text",
            text: JSON.stringify(data, null, 2),
          },
        ],
      };
    }
  );

  // Get OHLC data
  server.tool(
    "coingecko_ohlc",
    "Get OHLC candlestick data for a cryptocurrency",
    {
      coinId: z.string().describe("Coin ID"),
      days: z.number().describe("Number of days (1, 7, 14, 30, 90, 180, 365)"),
      currency: z.string().optional().describe("Currency (default: usd)"),
    },
    async ({ coinId, days, currency }) => {
      const data = await client.getOHLC(coinId, days, currency);
      return {
        content: [
          {
            type: "text",
            text: JSON.stringify(data, null, 2),
          },
        ],
      };
    }
  );

  // Search coins
  server.tool(
    "coingecko_search",
    "Search for cryptocurrencies by name or symbol",
    {
      query: z.string().describe("Search query"),
    },
    async ({ query }) => {
      const data = await client.search(query);
      return {
        content: [
          {
            type: "text",
            text: JSON.stringify(data, null, 2),
          },
        ],
      };
    }
  );

  // Get coin details
  server.tool(
    "coingecko_coin_details",
    "Get detailed information about a cryptocurrency",
    {
      coinId: z.string().describe("Coin ID"),
    },
    async ({ coinId }) => {
      const data = await client.getCoinDetails(coinId);
      return {
        content: [
          {
            type: "text",
            text: JSON.stringify(data, null, 2),
          },
        ],
      };
    }
  );
}

export default CoinGeckoClient;
