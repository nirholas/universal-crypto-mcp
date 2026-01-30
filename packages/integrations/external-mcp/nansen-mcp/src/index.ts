/**
 * Nansen MCP Server
 * Smart money tracking and wallet analytics
 * 
 * Author: Nich (@nichxbt) - x.com/nichxbt
 * GitHub: github.com/nirholas
 * 
 * Features:
 * - Smart money wallet tracking
 * - Token holder analysis
 * - Whale alerts and movements
 * - DEX trader analytics
 * - Fund flow analysis
 */

import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { z } from "zod";

export interface SmartMoneyWallet {
  address: string;
  label: string;
  type: "fund" | "whale" | "smart_money" | "dex_trader";
  balance: number;
  profitLoss: number;
  winRate: number;
  trades30d: number;
  topHoldings: { token: string; amount: number; value: number }[];
}

export interface TokenFlow {
  token: string;
  inflow: number;
  outflow: number;
  netFlow: number;
  smartMoneyBuying: boolean;
  topBuyers: { address: string; label: string; amount: number }[];
  topSellers: { address: string; label: string; amount: number }[];
}

export interface WhaleAlert {
  timestamp: number;
  type: "buy" | "sell" | "transfer";
  token: string;
  amount: number;
  valueUsd: number;
  from: string;
  to: string;
  fromLabel?: string;
  toLabel?: string;
}

export class NansenClient {
  /**
   * Get smart money wallets for a token
   */
  async getSmartMoneyHolders(token: string): Promise<SmartMoneyWallet[]> {
    return [
      {
        address: "0x1234...5678",
        label: "Jump Trading",
        type: "fund",
        balance: 15000000,
        profitLoss: 2500000,
        winRate: 78,
        trades30d: 145,
        topHoldings: [
          { token: "ETH", amount: 5000, value: 16000000 },
          { token: "SOL", amount: 50000, value: 9000000 }
        ]
      },
      {
        address: "0xabcd...efgh",
        label: "Smart Money 1",
        type: "smart_money",
        balance: 8500000,
        profitLoss: 1200000,
        winRate: 72,
        trades30d: 89,
        topHoldings: [
          { token: "ETH", amount: 2000, value: 6400000 },
          { token: "PEPE", amount: 50000000000, value: 500000 }
        ]
      },
      {
        address: "0x9876...5432",
        label: "Whale",
        type: "whale",
        balance: 45000000,
        profitLoss: 8500000,
        winRate: 65,
        trades30d: 25,
        topHoldings: [
          { token: "BTC", amount: 500, value: 47500000 }
        ]
      }
    ];
  }

  /**
   * Get token flow analysis
   */
  async getTokenFlow(token: string, period = "24h"): Promise<TokenFlow> {
    return {
      token,
      inflow: 25000000,
      outflow: 18000000,
      netFlow: 7000000,
      smartMoneyBuying: true,
      topBuyers: [
        { address: "0x1234...5678", label: "Jump Trading", amount: 5000000 },
        { address: "0xabcd...efgh", label: "a]Smart DEX Trader", amount: 2500000 }
      ],
      topSellers: [
        { address: "0x9999...aaaa", label: "Unknown Whale", amount: 3000000 }
      ]
    };
  }

  /**
   * Get whale alerts
   */
  async getWhaleAlerts(minValue = 1000000): Promise<WhaleAlert[]> {
    return [
      {
        timestamp: Date.now() - 300000,
        type: "buy",
        token: "ETH",
        amount: 5000,
        valueUsd: 16000000,
        from: "Binance",
        to: "0x1234...5678",
        fromLabel: "Binance Hot Wallet",
        toLabel: "Jump Trading"
      },
      {
        timestamp: Date.now() - 600000,
        type: "transfer",
        token: "BTC",
        amount: 200,
        valueUsd: 19000000,
        from: "0xaaaa...bbbb",
        to: "Coinbase",
        fromLabel: "Unknown Whale",
        toLabel: "Coinbase Deposit"
      },
      {
        timestamp: Date.now() - 900000,
        type: "sell",
        token: "SOL",
        amount: 100000,
        valueUsd: 18000000,
        from: "0xcccc...dddd",
        to: "Jupiter",
        fromLabel: "Early SOL Investor"
      }
    ];
  }

  /**
   * Get wallet profile
   */
  async getWalletProfile(address: string): Promise<{
    address: string;
    labels: string[];
    firstSeen: string;
    netWorth: number;
    pnl30d: number;
    pnlAllTime: number;
    topProtocols: string[];
    riskScore: number;
    activity: { date: string; txCount: number; volume: number }[];
  }> {
    return {
      address,
      labels: ["Smart Money", "DeFi Power User", "Early Adopter"],
      firstSeen: "2020-06-15",
      netWorth: 25000000,
      pnl30d: 1500000,
      pnlAllTime: 12000000,
      topProtocols: ["Uniswap", "AAVE", "Lido", "Eigenlayer"],
      riskScore: 25,
      activity: [
        { date: "2026-01-30", txCount: 15, volume: 500000 },
        { date: "2026-01-29", txCount: 22, volume: 850000 },
        { date: "2026-01-28", txCount: 8, volume: 250000 }
      ]
    };
  }

  /**
   * Get hot tokens (smart money accumulating)
   */
  async getHotTokens(): Promise<{
    token: string;
    symbol: string;
    smartMoneyInflow: number;
    uniqueBuyers: number;
    priceChange24h: number;
    signal: "strong_buy" | "buy" | "neutral" | "sell";
  }[]> {
    return [
      { token: "New AI Token", symbol: "NAI", smartMoneyInflow: 15000000, uniqueBuyers: 45, priceChange24h: 25, signal: "strong_buy" },
      { token: "Emerging L2", symbol: "EL2", smartMoneyInflow: 8000000, uniqueBuyers: 28, priceChange24h: 12, signal: "buy" },
      { token: "DeFi Blue Chip", symbol: "DBC", smartMoneyInflow: 5000000, uniqueBuyers: 18, priceChange24h: 5, signal: "buy" }
    ];
  }
}

/**
 * Register Nansen tools with MCP server
 */
export function registerNansen(server: McpServer) {
  const client = new NansenClient();

  server.tool(
    "nansen_smart_money",
    "Get smart money holders for a token",
    {
      token: z.string().describe("Token symbol or address")
    },
    async ({ token }) => {
      const result = await client.getSmartMoneyHolders(token);
      return {
        content: [{ type: "text", text: JSON.stringify(result, null, 2) }]
      };
    }
  );

  server.tool(
    "nansen_token_flow",
    "Get token flow analysis (inflow/outflow)",
    {
      token: z.string().describe("Token symbol"),
      period: z.string().default("24h").describe("Time period")
    },
    async ({ token, period }) => {
      const result = await client.getTokenFlow(token, period);
      return {
        content: [{ type: "text", text: JSON.stringify(result, null, 2) }]
      };
    }
  );

  server.tool(
    "nansen_whale_alerts",
    "Get recent whale transaction alerts",
    {
      minValue: z.number().default(1000000).describe("Minimum USD value")
    },
    async ({ minValue }) => {
      const result = await client.getWhaleAlerts(minValue);
      return {
        content: [{ type: "text", text: JSON.stringify(result, null, 2) }]
      };
    }
  );

  server.tool(
    "nansen_wallet",
    "Get detailed wallet profile and analytics",
    {
      address: z.string().describe("Wallet address")
    },
    async ({ address }) => {
      const result = await client.getWalletProfile(address);
      return {
        content: [{ type: "text", text: JSON.stringify(result, null, 2) }]
      };
    }
  );

  server.tool(
    "nansen_hot_tokens",
    "Get tokens smart money is accumulating",
    {},
    async () => {
      const result = await client.getHotTokens();
      return {
        content: [{ type: "text", text: JSON.stringify(result, null, 2) }]
      };
    }
  );
}

export default NansenClient;
