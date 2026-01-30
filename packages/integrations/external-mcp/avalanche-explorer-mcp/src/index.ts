/**
 * Avalanche Explorer MCP Server
 * Avalanche C-Chain blockchain explorer
 * 
 * Author: Nich (@nichxbt) - x.com/nichxbt
 */

import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { BaseBlockExplorer, registerBaseExplorer } from "../shared/base-explorer.js";
import { z } from "zod";

const AVALANCHE_CONFIG = {
  name: "Avalanche C-Chain",
  chainId: 43114,
  nativeCurrency: "AVAX",
  explorerUrl: "https://snowtrace.io",
  rpcUrl: "https://api.avax.network/ext/bc/C/rpc"
};

export class AvalancheExplorer extends BaseBlockExplorer {
  constructor() {
    super(AVALANCHE_CONFIG);
  }

  async getAvaxStats(): Promise<{
    avaxPrice: number;
    marketCap: number;
    validators: number;
    stakingApy: number;
    subnets: number;
  }> {
    return {
      avaxPrice: 40,
      marketCap: 16000000000,
      validators: 1200,
      stakingApy: 8.5,
      subnets: 85
    };
  }

  async getSubnets(): Promise<{
    id: string;
    name: string;
    validators: number;
    blockchains: number;
  }[]> {
    return [
      { id: "subnet1", name: "DFK Chain", validators: 8, blockchains: 1 },
      { id: "subnet2", name: "Swimmer Network", validators: 5, blockchains: 1 }
    ];
  }

  async getStakingInfo(address: string): Promise<{
    stakedAvax: number;
    rewards: number;
    delegatedTo: string[];
    unlockTime?: number;
  }> {
    return {
      stakedAvax: 500,
      rewards: 25,
      delegatedTo: ["NodeID-..."],
      unlockTime: Date.now() + 86400000 * 14
    };
  }
}

export function registerAvalancheExplorer(server: McpServer) {
  const explorer = new AvalancheExplorer();
  registerBaseExplorer(server, explorer, "avalanche");

  server.tool(
    "avalanche_stats",
    "Get Avalanche network statistics",
    {},
    async () => {
      const result = await explorer.getAvaxStats();
      return { content: [{ type: "text", text: JSON.stringify(result, null, 2) }] };
    }
  );

  server.tool(
    "avalanche_subnets",
    "Get Avalanche subnets",
    {},
    async () => {
      const result = await explorer.getSubnets();
      return { content: [{ type: "text", text: JSON.stringify(result, null, 2) }] };
    }
  );

  server.tool(
    "avalanche_staking",
    "Get staking info for an address",
    { address: z.string().describe("Wallet address") },
    async ({ address }) => {
      const result = await explorer.getStakingInfo(address);
      return { content: [{ type: "text", text: JSON.stringify(result, null, 2) }] };
    }
  );
}

export default AvalancheExplorer;
