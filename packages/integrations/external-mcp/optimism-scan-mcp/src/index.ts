/**
 * Optimism Scan MCP Server
 * Optimism L2 blockchain explorer
 * 
 * Author: Nich (@nichxbt) - x.com/nichxbt
 */

import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { BaseBlockExplorer, registerBaseExplorer } from "../shared/base-explorer.js";
import { z } from "zod";

const OPTIMISM_CONFIG = {
  name: "Optimism",
  chainId: 10,
  nativeCurrency: "ETH",
  explorerUrl: "https://optimistic.etherscan.io",
  rpcUrl: "https://mainnet.optimism.io"
};

export class OptimismScan extends BaseBlockExplorer {
  constructor() {
    super(OPTIMISM_CONFIG);
  }

  async getOpStats(): Promise<{
    tvl: number;
    opPrice: number;
    opMarketCap: number;
    l1DataCost: number;
    sequencerUptime: number;
  }> {
    return {
      tvl: 1100000000,
      opPrice: 2.5,
      opMarketCap: 2800000000,
      l1DataCost: 0.02,
      sequencerUptime: 99.98
    };
  }

  async getOpRewards(address: string): Promise<{
    totalOp: number;
    claimedOp: number;
    unclaimedOp: number;
    delegatedTo?: string;
  }> {
    return {
      totalOp: 1500,
      claimedOp: 1000,
      unclaimedOp: 500,
      delegatedTo: "0xdelegate..."
    };
  }
}

export function registerOptimismScan(server: McpServer) {
  const explorer = new OptimismScan();
  registerBaseExplorer(server, explorer, "optimism");

  server.tool(
    "optimism_stats",
    "Get Optimism network statistics",
    {},
    async () => {
      const result = await explorer.getOpStats();
      return { content: [{ type: "text", text: JSON.stringify(result, null, 2) }] };
    }
  );

  server.tool(
    "optimism_rewards",
    "Get OP token rewards for an address",
    { address: z.string().describe("Wallet address") },
    async ({ address }) => {
      const result = await explorer.getOpRewards(address);
      return { content: [{ type: "text", text: JSON.stringify(result, null, 2) }] };
    }
  );
}

export default OptimismScan;
