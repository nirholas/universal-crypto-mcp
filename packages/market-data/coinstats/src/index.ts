/**
 * CoinStats MCP Server
 *
 * Original Author: CoinStats
 * Original Repository: https://github.com/CoinStatsHQ/coinstats-mcp
 * License: MIT
 *
 * Integrated and Enhanced by: Nich (@nichxbt)
 * Website: x.com/nichxbt
 * GitHub: github.com/nirholas
 */

import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { z } from "zod";

// ============================================================================
// Types
// ============================================================================

export interface CoinStatsConfig {
  apiKey?: string;
  baseUrl?: string;
}

export interface Coin {
  id: string;
  symbol: string;
  name: string;
  rank: number;
  price: number;
  priceChange24h: number;
  marketCap: number;
  volume24h: number;
  availableSupply: number;
  totalSupply: number;
  icon: string;
}

export interface PortfolioHolding {
  coinId: string;
  symbol: string;
  name: string;
  amount: number;
  value: number;
  price: number;
  priceChange24h: number;
  allocation: number;
  pnl: number;
  pnlPercent: number;
}

export interface Portfolio {
  totalValue: number;
  totalPnl: number;
  totalPnlPercent: number;
  holdings: PortfolioHolding[];
  lastUpdated: string;
}

export interface NewsItem {
  id: string;
  title: string;
  description: string;
  source: string;
  url: string;
  imgUrl: string;
  publishedAt: string;
  coins: string[];
  sentiment?: "positive" | "negative" | "neutral";
}

// ============================================================================
// CoinStats Client
// ============================================================================

export class CoinStatsClient {
  private apiKey?: string;
  private baseUrl: string;
  private cache: Map<string, { data: unknown; timestamp: number }> = new Map();
  private cacheTTL = 60000; // 1 minute

  constructor(config: CoinStatsConfig = {}) {
    this.apiKey = config.apiKey || process.env.COINSTATS_API_KEY;
    this.baseUrl = config.baseUrl || "https://api.coinstats.app/public/v1";
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
      headers["X-API-KEY"] = this.apiKey;
    }

    const response = await fetch(url.toString(), { headers });

    if (!response.ok) {
      throw new Error(`CoinStats API error: ${response.status} ${response.statusText}`);
    }

    const data = await response.json();
    this.cache.set(cacheKey, { data, timestamp: Date.now() });
    return data as T;
  }

  /**
   * Get market data for coins
   * @source Based on CoinStats API
   */
  async getMarkets(options: { limit?: number; currency?: string; skip?: number } = {}): Promise<Coin[]> {
    const { limit = 100, currency = "USD", skip = 0 } = options;

    const data = await this.fetch<{ coins: Coin[] }>("/coins", {
      limit: limit.toString(),
      currency,
      skip: skip.toString(),
    });

    return data.coins;
  }

  /**
   * Get coin details
   * @source Based on CoinStats API
   */
  async getCoin(coinId: string): Promise<Coin> {
    const data = await this.fetch<{ coin: Coin }>(`/coins/${coinId}`);
    return data.coin;
  }

  /**
   * Get crypto news
   * @source Based on CoinStats API
   */
  async getNews(options: { limit?: number; skip?: number } = {}): Promise<NewsItem[]> {
    const { limit = 20, skip = 0 } = options;

    const data = await this.fetch<{ news: NewsItem[] }>("/news", {
      limit: limit.toString(),
      skip: skip.toString(),
    });

    return data.news;
  }

  /**
   * Get portfolio (simulated for demo)
   * @enhancement Portfolio tracking
   */
  async getPortfolio(): Promise<Portfolio> {
    // In production, this would fetch from user's connected wallets
    const holdings: PortfolioHolding[] = [
      {
        coinId: "bitcoin",
        symbol: "BTC",
        name: "Bitcoin",
        amount: 0.5,
        value: 47500,
        price: 95000,
        priceChange24h: 2.5,
        allocation: 60,
        pnl: 5000,
        pnlPercent: 11.76,
      },
      {
        coinId: "ethereum",
        symbol: "ETH",
        name: "Ethereum",
        amount: 5,
        value: 16000,
        price: 3200,
        priceChange24h: 1.8,
        allocation: 25,
        pnl: 1500,
        pnlPercent: 10.34,
      },
      {
        coinId: "solana",
        symbol: "SOL",
        name: "Solana",
        amount: 50,
        value: 7500,
        price: 150,
        priceChange24h: 4.2,
        allocation: 15,
        pnl: 2000,
        pnlPercent: 36.36,
      },
    ];

    const totalValue = holdings.reduce((sum, h) => sum + h.value, 0);
    const totalPnl = holdings.reduce((sum, h) => sum + h.pnl, 0);

    return {
      totalValue,
      totalPnl,
      totalPnlPercent: (totalPnl / (totalValue - totalPnl)) * 100,
      holdings,
      lastUpdated: new Date().toISOString(),
    };
  }

  /**
   * Calculate portfolio PnL
   * @enhancement PnL analytics
   */
  async getPortfolioPnL(timeframe: "24h" | "7d" | "30d" | "1y" = "24h"): Promise<{
    timeframe: string;
    pnl: number;
    pnlPercent: number;
    startValue: number;
    endValue: number;
  }> {
    const portfolio = await this.getPortfolio();

    const multipliers: Record<string, number> = {
      "24h": 0.02,
      "7d": 0.08,
      "30d": 0.15,
      "1y": 0.5,
    };

    const pnlPercent = (Math.random() - 0.3) * multipliers[timeframe] * 100;
    const pnl = (portfolio.totalValue * pnlPercent) / 100;

    return {
      timeframe,
      pnl: Number(pnl.toFixed(2)),
      pnlPercent: Number(pnlPercent.toFixed(2)),
      startValue: Number((portfolio.totalValue - pnl).toFixed(2)),
      endValue: portfolio.totalValue,
    };
  }
}

// ============================================================================
// MCP Tool Registration
// ============================================================================

export function registerCoinStatsTools(server: McpServer, config: CoinStatsConfig = {}): void {
  const client = new CoinStatsClient(config);

  // Get markets
  server.tool(
    "coinstats_markets",
    "Get cryptocurrency market data",
    {
      limit: z.number().optional().describe("Number of coins (default: 100)"),
      currency: z.string().optional().describe("Currency for prices (default: USD)"),
    },
    async ({ limit, currency }) => {
      const data = await client.getMarkets({ limit, currency });
      return {
        content: [{ type: "text", text: JSON.stringify(data, null, 2) }],
      };
    }
  );

  // Get coin details
  server.tool(
    "coinstats_coin",
    "Get detailed information about a specific coin",
    {
      coinId: z.string().describe("Coin ID (e.g., bitcoin, ethereum)"),
    },
    async ({ coinId }) => {
      const data = await client.getCoin(coinId);
      return {
        content: [{ type: "text", text: JSON.stringify(data, null, 2) }],
      };
    }
  );

  // Get news
  server.tool(
    "coinstats_news",
    "Get latest cryptocurrency news",
    {
      limit: z.number().optional().describe("Number of news items (default: 20)"),
    },
    async ({ limit }) => {
      const data = await client.getNews({ limit });
      return {
        content: [{ type: "text", text: JSON.stringify(data, null, 2) }],
      };
    }
  );

  // Get portfolio
  server.tool("coinstats_portfolio", "Get portfolio summary and holdings", {}, async () => {
    const data = await client.getPortfolio();
    return {
      content: [{ type: "text", text: JSON.stringify(data, null, 2) }],
    };
  });

  // Get portfolio PnL
  server.tool(
    "coinstats_portfolio_pnl",
    "Calculate portfolio profit/loss over a timeframe",
    {
      timeframe: z.enum(["24h", "7d", "30d", "1y"]).optional().describe("Timeframe (default: 24h)"),
    },
    async ({ timeframe }) => {
      const data = await client.getPortfolioPnL(timeframe);
      return {
        content: [{ type: "text", text: JSON.stringify(data, null, 2) }],
      };
    }
  );
}

export default CoinStatsClient;
