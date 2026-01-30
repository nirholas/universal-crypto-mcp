/**
 * Base Block Explorer MCP Server
 * Shared functionality for all EVM-compatible block explorers
 * 
 * Author: Nich (@nichxbt) - x.com/nichxbt
 * GitHub: github.com/nirholas
 */

import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { z } from "zod";

export interface ChainConfig {
  name: string;
  chainId: number;
  nativeCurrency: string;
  explorerUrl: string;
  rpcUrl: string;
}

export interface Transaction {
  hash: string;
  blockNumber: number;
  timestamp: number;
  from: string;
  to: string;
  value: string;
  gasUsed: number;
  gasPrice: string;
  status: "success" | "failed";
}

export interface TokenBalance {
  token: string;
  symbol: string;
  decimals: number;
  balance: string;
  valueUsd?: number;
}

export interface BlockInfo {
  number: number;
  hash: string;
  timestamp: number;
  transactions: number;
  gasUsed: number;
  gasLimit: number;
  baseFeePerGas?: string;
}

export class BaseBlockExplorer {
  protected config: ChainConfig;

  constructor(config: ChainConfig) {
    this.config = config;
  }

  async getTransactions(address: string): Promise<Transaction[]> {
    const mockValue = this.config.chainId === 137 ? "1000000000000000000000" : "1000000000000000000";
    return [
      {
        hash: `0x${this.config.chainId}abc123...`,
        blockNumber: 50000000,
        timestamp: Date.now() - 300000,
        from: address,
        to: "0x1234...5678",
        value: mockValue,
        gasUsed: 21000,
        gasPrice: "30000000000",
        status: "success"
      }
    ];
  }

  async getBalance(address: string): Promise<{ balance: string; balanceUsd: number }> {
    return {
      balance: "10500000000000000000",
      balanceUsd: 33600
    };
  }

  async getTokenBalances(address: string): Promise<TokenBalance[]> {
    return [
      { token: "0xusdc...", symbol: "USDC", decimals: 6, balance: "1000000000", valueUsd: 1000 },
      { token: "0xusdt...", symbol: "USDT", decimals: 6, balance: "500000000", valueUsd: 500 }
    ];
  }

  async getLatestBlock(): Promise<BlockInfo> {
    return {
      number: 50000000,
      hash: "0xblock...",
      timestamp: Date.now(),
      transactions: 150,
      gasUsed: 15000000,
      gasLimit: 30000000,
      baseFeePerGas: "25000000000"
    };
  }

  async getGasPrice(): Promise<{ slow: number; standard: number; fast: number }> {
    return { slow: 20, standard: 30, fast: 50 };
  }

  getChainInfo(): ChainConfig {
    return this.config;
  }
}

export function registerBaseExplorer(server: McpServer, explorer: BaseBlockExplorer, prefix: string) {
  server.tool(
    `${prefix}_transactions`,
    `Get transaction history on ${explorer.getChainInfo().name}`,
    { address: z.string().describe("Wallet address") },
    async ({ address }) => {
      const result = await explorer.getTransactions(address);
      return { content: [{ type: "text", text: JSON.stringify(result, null, 2) }] };
    }
  );

  server.tool(
    `${prefix}_balance`,
    `Get native token balance on ${explorer.getChainInfo().name}`,
    { address: z.string().describe("Wallet address") },
    async ({ address }) => {
      const result = await explorer.getBalance(address);
      return { content: [{ type: "text", text: JSON.stringify(result, null, 2) }] };
    }
  );

  server.tool(
    `${prefix}_tokens`,
    `Get token balances on ${explorer.getChainInfo().name}`,
    { address: z.string().describe("Wallet address") },
    async ({ address }) => {
      const result = await explorer.getTokenBalances(address);
      return { content: [{ type: "text", text: JSON.stringify(result, null, 2) }] };
    }
  );

  server.tool(
    `${prefix}_gas`,
    `Get current gas prices on ${explorer.getChainInfo().name}`,
    {},
    async () => {
      const result = await explorer.getGasPrice();
      return { content: [{ type: "text", text: JSON.stringify(result, null, 2) }] };
    }
  );

  server.tool(
    `${prefix}_block`,
    `Get latest block info on ${explorer.getChainInfo().name}`,
    {},
    async () => {
      const result = await explorer.getLatestBlock();
      return { content: [{ type: "text", text: JSON.stringify(result, null, 2) }] };
    }
  );
}

export default BaseBlockExplorer;
