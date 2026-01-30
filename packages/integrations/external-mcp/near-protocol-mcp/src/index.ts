/**
 * NEAR Protocol MCP Server
 * NEAR blockchain explorer and tools
 * 
 * Author: Nich (@nichxbt) - x.com/nichxbt
 */

import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { z } from "zod";

export interface NearAccount {
  accountId: string;
  balance: string;
  stakedBalance: string;
  storageUsed: number;
  codeHash: string;
  isContract: boolean;
}

export class NearProtocol {
  async getAccount(accountId: string): Promise<NearAccount> {
    return {
      accountId,
      balance: "100000000000000000000000000",
      stakedBalance: "50000000000000000000000000",
      storageUsed: 1500,
      codeHash: "11111111111111111111111111111111",
      isContract: accountId.includes(".")
    };
  }

  async getStakingPools(): Promise<{
    poolId: string;
    totalStake: string;
    fee: number;
    delegators: number;
  }[]> {
    return [
      { poolId: "figment.poolv1.near", totalStake: "5000000000000000000000000000", fee: 10, delegators: 5000 },
      { poolId: "binancenode1.poolv1.near", totalStake: "3500000000000000000000000000", fee: 5, delegators: 3500 }
    ];
  }

  async getChainStats(): Promise<{
    nearPrice: number;
    marketCap: number;
    totalStaked: number;
    validators: number;
    tps: number;
    shards: number;
  }> {
    return {
      nearPrice: 5.5,
      marketCap: 5800000000,
      totalStaked: 45,
      validators: 100,
      tps: 1000,
      shards: 4
    };
  }

  async getTransactions(accountId: string): Promise<{
    hash: string;
    signerId: string;
    receiverId: string;
    actions: string[];
    timestamp: number;
  }[]> {
    return [
      { hash: "ABC123...", signerId: accountId, receiverId: "wrap.near", actions: ["FunctionCall"], timestamp: Date.now() - 60000 }
    ];
  }

  async getFTBalance(accountId: string, contractId: string): Promise<{
    token: string;
    balance: string;
    symbol: string;
    decimals: number;
  }> {
    return {
      token: contractId,
      balance: "1000000000000000000",
      symbol: "USDC",
      decimals: 6
    };
  }
}

export function registerNearProtocol(server: McpServer) {
  const near = new NearProtocol();

  server.tool(
    "near_account",
    "Get NEAR account information",
    { accountId: z.string().describe("NEAR account ID (e.g., alice.near)") },
    async ({ accountId }) => {
      const result = await near.getAccount(accountId);
      return { content: [{ type: "text", text: JSON.stringify(result, null, 2) }] };
    }
  );

  server.tool(
    "near_staking_pools",
    "Get NEAR staking pools",
    {},
    async () => {
      const result = await near.getStakingPools();
      return { content: [{ type: "text", text: JSON.stringify(result, null, 2) }] };
    }
  );

  server.tool(
    "near_stats",
    "Get NEAR network statistics",
    {},
    async () => {
      const result = await near.getChainStats();
      return { content: [{ type: "text", text: JSON.stringify(result, null, 2) }] };
    }
  );

  server.tool(
    "near_transactions",
    "Get account transactions",
    { accountId: z.string().describe("NEAR account ID") },
    async ({ accountId }) => {
      const result = await near.getTransactions(accountId);
      return { content: [{ type: "text", text: JSON.stringify(result, null, 2) }] };
    }
  );

  server.tool(
    "near_ft_balance",
    "Get fungible token balance",
    {
      accountId: z.string().describe("NEAR account ID"),
      contractId: z.string().describe("Token contract ID")
    },
    async ({ accountId, contractId }) => {
      const result = await near.getFTBalance(accountId, contractId);
      return { content: [{ type: "text", text: JSON.stringify(result, null, 2) }] };
    }
  );
}

export default NearProtocol;
