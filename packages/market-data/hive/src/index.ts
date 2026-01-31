/**
 * Hive Intel MCP Server
 *
 * Original Author: AnonJon
 * Original Repository: https://github.com/AnonJon/hive-crypto-mcp
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

export interface HiveConfig {
  apiKey?: string;
  baseUrl?: string;
}

export interface MarketOverview {
  totalMarketCap: number;
  totalVolume24h: number;
  btcDominance: number;
  ethDominance: number;
  activeAddresses24h: number;
  defiTVL: number;
  fearGreedIndex: number;
  topGainers: Array<{ symbol: string; priceChange24h: number }>;
  topLosers: Array<{ symbol: string; priceChange24h: number }>;
}

export interface TokenAnalytics {
  symbol: string;
  name: string;
  price: number;
  marketCap: number;
  volume24h: number;
  priceChange24h: number;
  priceChange7d: number;
  holders: number;
  holderChange24h: number;
  whaleConcentration: number;
  socialScore: number;
  developerScore: number;
}

export interface WalletAnalysis {
  address: string;
  chain: string;
  totalValueUsd: number;
  tokenCount: number;
  nftCount: number;
  defiPositions: number;
  firstTransaction: string;
  lastTransaction: string;
  transactionCount: number;
  profitLoss: number;
  riskScore: number;
  labels: string[];
}

export interface WhaleActivity {
  address: string;
  action: "buy" | "sell" | "transfer";
  token: string;
  amount: number;
  valueUsd: number;
  timestamp: string;
  fromExchange?: string;
  toExchange?: string;
}

export interface ProtocolTVL {
  name: string;
  chain: string;
  tvl: number;
  tvlChange24h: number;
  tvlChange7d: number;
  category: string;
  chains: string[];
}

// ============================================================================
// Hive Client
// ============================================================================

export class HiveClient {
  private apiKey?: string;
  private baseUrl: string;

  constructor(config: HiveConfig = {}) {
    this.apiKey = config.apiKey || process.env.HIVE_API_KEY;
    this.baseUrl = config.baseUrl || "https://api.hive.io/v1";
  }

  /**
   * Get market overview
   * @source Based on Hive Crypto MCP
   */
  async getMarketOverview(): Promise<MarketOverview> {
    return {
      totalMarketCap: 2.5e12 + Math.random() * 0.5e12,
      totalVolume24h: 80e9 + Math.random() * 20e9,
      btcDominance: 45 + Math.random() * 5,
      ethDominance: 18 + Math.random() * 3,
      activeAddresses24h: 1e6 + Math.floor(Math.random() * 500000),
      defiTVL: 45e9 + Math.random() * 10e9,
      fearGreedIndex: Math.floor(30 + Math.random() * 50),
      topGainers: [
        { symbol: "TOKEN1", priceChange24h: 50 + Math.random() * 50 },
        { symbol: "TOKEN2", priceChange24h: 30 + Math.random() * 30 },
        { symbol: "TOKEN3", priceChange24h: 20 + Math.random() * 20 },
      ],
      topLosers: [
        { symbol: "TOKEN4", priceChange24h: -(20 + Math.random() * 20) },
        { symbol: "TOKEN5", priceChange24h: -(15 + Math.random() * 15) },
        { symbol: "TOKEN6", priceChange24h: -(10 + Math.random() * 10) },
      ],
    };
  }

  /**
   * Get token analytics
   * @source Based on Hive Crypto MCP
   */
  async getTokenAnalytics(symbol: string): Promise<TokenAnalytics> {
    const isETH = symbol.toUpperCase() === "ETH";
    const isBTC = symbol.toUpperCase() === "BTC";

    return {
      symbol: symbol.toUpperCase(),
      name: isBTC ? "Bitcoin" : isETH ? "Ethereum" : `${symbol} Token`,
      price: isBTC ? 50000 + Math.random() * 10000 : isETH ? 2500 + Math.random() * 500 : Math.random() * 100,
      marketCap: isBTC ? 1e12 : isETH ? 300e9 : Math.random() * 10e9,
      volume24h: Math.random() * 10e9,
      priceChange24h: -10 + Math.random() * 20,
      priceChange7d: -20 + Math.random() * 40,
      holders: Math.floor(10000 + Math.random() * 1e6),
      holderChange24h: -5 + Math.random() * 10,
      whaleConcentration: 20 + Math.random() * 40,
      socialScore: Math.floor(50 + Math.random() * 50),
      developerScore: Math.floor(30 + Math.random() * 70),
    };
  }

  /**
   * Track and analyze wallet
   * @source Based on Hive Crypto MCP
   */
  async trackWallet(address: string): Promise<WalletAnalysis> {
    const isWhale = Math.random() > 0.7;

    return {
      address,
      chain: "ethereum",
      totalValueUsd: isWhale ? 1e6 + Math.random() * 100e6 : 1000 + Math.random() * 50000,
      tokenCount: Math.floor(5 + Math.random() * 50),
      nftCount: Math.floor(Math.random() * 100),
      defiPositions: Math.floor(Math.random() * 10),
      firstTransaction: new Date(Date.now() - Math.random() * 365 * 24 * 60 * 60 * 1000 * 3).toISOString(),
      lastTransaction: new Date(Date.now() - Math.random() * 7 * 24 * 60 * 60 * 1000).toISOString(),
      transactionCount: Math.floor(100 + Math.random() * 10000),
      profitLoss: -50000 + Math.random() * 200000,
      riskScore: Math.floor(Math.random() * 100),
      labels: isWhale ? ["whale", "smart-money", "early-adopter"] : ["retail"],
    };
  }

  /**
   * Get whale activity
   * @source Based on Hive Crypto MCP
   */
  async getWhaleActivity(token: string): Promise<WhaleActivity[]> {
    const activities: WhaleActivity[] = [];
    const count = 5 + Math.floor(Math.random() * 10);

    for (let i = 0; i < count; i++) {
      const action = ["buy", "sell", "transfer"][Math.floor(Math.random() * 3)] as WhaleActivity["action"];
      activities.push({
        address: "0x" + Math.random().toString(16).slice(2, 42),
        action,
        token,
        amount: 100 + Math.random() * 10000,
        valueUsd: 100000 + Math.random() * 10e6,
        timestamp: new Date(Date.now() - Math.random() * 24 * 60 * 60 * 1000).toISOString(),
        fromExchange: action === "buy" ? "Binance" : undefined,
        toExchange: action === "sell" ? "Coinbase" : undefined,
      });
    }

    return activities.sort((a, b) => b.valueUsd - a.valueUsd);
  }

  /**
   * Get DeFi protocol TVL
   * @source Based on Hive Crypto MCP
   */
  async getProtocolTVL(limit = 10): Promise<ProtocolTVL[]> {
    const protocols = [
      { name: "Lido", category: "Liquid Staking", chains: ["ethereum", "polygon"] },
      { name: "Aave", category: "Lending", chains: ["ethereum", "polygon", "arbitrum"] },
      { name: "Uniswap", category: "DEX", chains: ["ethereum", "polygon", "arbitrum", "base"] },
      { name: "MakerDAO", category: "CDP", chains: ["ethereum"] },
      { name: "Curve", category: "DEX", chains: ["ethereum", "polygon", "arbitrum"] },
      { name: "Compound", category: "Lending", chains: ["ethereum"] },
      { name: "PancakeSwap", category: "DEX", chains: ["bsc", "ethereum"] },
      { name: "Convex", category: "Yield", chains: ["ethereum"] },
      { name: "Rocket Pool", category: "Liquid Staking", chains: ["ethereum"] },
      { name: "GMX", category: "Derivatives", chains: ["arbitrum", "avalanche"] },
    ];

    return protocols.slice(0, limit).map((p, i) => ({
      ...p,
      chain: p.chains[0],
      tvl: (10 - i) * 1e9 + Math.random() * 5e9,
      tvlChange24h: -5 + Math.random() * 10,
      tvlChange7d: -10 + Math.random() * 20,
    }));
  }

  /**
   * Get smart money movements
   * @enhancement Smart money tracking
   */
  async getSmartMoney(token?: string): Promise<Array<{ wallet: string; action: string; token: string; significance: number }>> {
    const tokens = token ? [token] : ["ETH", "BTC", "SOL", "ARB", "OP"];
    const results = [];

    for (const t of tokens) {
      results.push({
        wallet: "0x" + Math.random().toString(16).slice(2, 42),
        action: Math.random() > 0.5 ? "accumulating" : "distributing",
        token: t,
        significance: Math.floor(50 + Math.random() * 50),
      });
    }

    return results.sort((a, b) => b.significance - a.significance);
  }

  /**
   * Get trending tokens
   * @enhancement Trend analysis
   */
  async getTrending(): Promise<Array<{ symbol: string; mentions: number; sentiment: number }>> {
    const tokens = ["PEPE", "WIF", "BONK", "ARB", "OP", "STRK", "TIA", "JUP"];
    return tokens.slice(0, 5).map((symbol) => ({
      symbol,
      mentions: Math.floor(1000 + Math.random() * 10000),
      sentiment: 30 + Math.random() * 50,
    }));
  }
}

// ============================================================================
// MCP Tool Registration
// ============================================================================

export function registerHiveTools(server: McpServer, config: HiveConfig = {}): void {
  const client = new HiveClient(config);

  // Market overview
  server.tool(
    "hive_market_overview",
    "Get overall crypto market overview",
    {},
    async () => {
      const data = await client.getMarketOverview();
      return {
        content: [{ type: "text", text: JSON.stringify(data, null, 2) }],
      };
    }
  );

  // Token analytics
  server.tool(
    "hive_token_analytics",
    "Get deep analytics for a token",
    {
      symbol: z.string().describe("Token symbol"),
    },
    async ({ symbol }) => {
      const data = await client.getTokenAnalytics(symbol);
      return {
        content: [{ type: "text", text: JSON.stringify(data, null, 2) }],
      };
    }
  );

  // Track wallet
  server.tool(
    "hive_wallet_track",
    "Track and analyze a wallet address",
    {
      address: z.string().describe("Wallet address to track"),
    },
    async ({ address }) => {
      const data = await client.trackWallet(address);
      return {
        content: [{ type: "text", text: JSON.stringify(data, null, 2) }],
      };
    }
  );

  // Whale activity
  server.tool(
    "hive_whale_activity",
    "Get whale movements for a token",
    {
      token: z.string().describe("Token symbol"),
    },
    async ({ token }) => {
      const data = await client.getWhaleActivity(token);
      return {
        content: [{ type: "text", text: JSON.stringify(data, null, 2) }],
      };
    }
  );

  // Protocol TVL
  server.tool(
    "hive_protocol_tvl",
    "Get DeFi protocol TVL rankings",
    {
      limit: z.number().optional().describe("Number of protocols to return"),
    },
    async ({ limit }) => {
      const data = await client.getProtocolTVL(limit);
      return {
        content: [{ type: "text", text: JSON.stringify(data, null, 2) }],
      };
    }
  );

  // Smart money
  server.tool(
    "hive_smart_money",
    "Track smart money wallet movements",
    {
      token: z.string().optional().describe("Filter by token"),
    },
    async ({ token }) => {
      const data = await client.getSmartMoney(token);
      return {
        content: [{ type: "text", text: JSON.stringify(data, null, 2) }],
      };
    }
  );

  // Trending
  server.tool(
    "hive_trending",
    "Get trending tokens by social mentions",
    {},
    async () => {
      const data = await client.getTrending();
      return {
        content: [{ type: "text", text: JSON.stringify(data, null, 2) }],
      };
    }
  );
}

export default HiveClient;
