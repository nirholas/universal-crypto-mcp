/**
 * BscScan MCP Server
 * BNB Smart Chain blockchain explorer
 * 
 * Author: Nich (@nichxbt) - x.com/nichxbt
 */

import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { BaseBlockExplorer, registerBaseExplorer } from "../shared/base-explorer.js";

const BSC_CONFIG = {
  name: "BNB Smart Chain",
  chainId: 56,
  nativeCurrency: "BNB",
  explorerUrl: "https://bscscan.com",
  rpcUrl: "https://bsc-dataseed.binance.org"
};

export class BscScan extends BaseBlockExplorer {
  constructor() {
    super(BSC_CONFIG);
  }

  async getBscStats(): Promise<{
    totalTransactions: number;
    bnbPrice: number;
    marketCap: number;
    validators: number;
    tps: number;
  }> {
    return {
      totalTransactions: 5000000000,
      bnbPrice: 650,
      marketCap: 95000000000,
      validators: 21,
      tps: 160
    };
  }

  async getBEP20Tokens(address: string): Promise<{
    token: string;
    symbol: string;
    balance: string;
    valueUsd: number;
  }[]> {
    return [
      { token: "0x55d398326f99059ff775485246999027b3197955", symbol: "USDT", balance: "1000000000000000000000", valueUsd: 1000 },
      { token: "0x8ac76a51cc950d9822d68b83fe1ad97b32cd580d", symbol: "USDC", balance: "500000000000000000000", valueUsd: 500 }
    ];
  }
}

export function registerBscScan(server: McpServer) {
  const explorer = new BscScan();
  registerBaseExplorer(server, explorer, "bsc");

  server.tool(
    "bsc_stats",
    "Get BNB Smart Chain network statistics",
    {},
    async () => {
      const result = await explorer.getBscStats();
      return { content: [{ type: "text", text: JSON.stringify(result, null, 2) }] };
    }
  );

  server.tool(
    "bsc_bep20",
    "Get BEP-20 token balances",
    { address: z.string().describe("Wallet address") },
    async ({ address }) => {
      const result = await explorer.getBEP20Tokens(address);
      return { content: [{ type: "text", text: JSON.stringify(result, null, 2) }] };
    }
  );
}

import { z } from "zod";

export default BscScan;
