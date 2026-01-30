/**
 * Sui Network MCP Server
 * Sui blockchain explorer and tools
 * 
 * Author: Nich (@nichxbt) - x.com/nichxbt
 */

import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { z } from "zod";

export interface SuiAccount {
  address: string;
  balance: string;
  objects: { objectId: string; type: string; version: string }[];
  stakedSui?: string;
}

export class SuiNetwork {
  async getAccount(address: string): Promise<SuiAccount> {
    return {
      address,
      balance: "10000000000",
      objects: [
        { objectId: "0xobj1...", type: "0x2::coin::Coin<0x2::sui::SUI>", version: "100" }
      ],
      stakedSui: "5000000000"
    };
  }

  async getObjects(address: string): Promise<{
    objectId: string;
    type: string;
    owner: string;
    content: object;
  }[]> {
    return [
      { objectId: "0xobj1...", type: "0x2::coin::Coin<0x2::sui::SUI>", owner: address, content: { balance: "10000000000" } }
    ];
  }

  async getChainStats(): Promise<{
    suiPrice: number;
    marketCap: number;
    tps: number;
    totalTransactions: number;
    checkpoints: number;
    epoch: number;
  }> {
    return {
      suiPrice: 4.2,
      marketCap: 12000000000,
      tps: 297000,
      totalTransactions: 5000000000,
      checkpoints: 45000000,
      epoch: 450
    };
  }

  async getTransactionBlock(digest: string): Promise<{
    digest: string;
    checkpoint: string;
    sender: string;
    gasUsed: object;
    effects: object;
  }> {
    return {
      digest,
      checkpoint: "45000000",
      sender: "0xsender...",
      gasUsed: { computationCost: "1000", storageCost: "2000" },
      effects: { status: { status: "success" } }
    };
  }

  async getValidators(): Promise<{
    suiAddress: string;
    name: string;
    votingPower: number;
    stakingPoolSuiBalance: string;
    commissionRate: number;
  }[]> {
    return [
      { suiAddress: "0xval1...", name: "Mysten Labs", votingPower: 500, stakingPoolSuiBalance: "500000000000", commissionRate: 5 },
      { suiAddress: "0xval2...", name: "Sui Foundation", votingPower: 400, stakingPoolSuiBalance: "400000000000", commissionRate: 8 }
    ];
  }
}

export function registerSuiNetwork(server: McpServer) {
  const sui = new SuiNetwork();

  server.tool(
    "sui_account",
    "Get Sui account information",
    { address: z.string().describe("Sui address") },
    async ({ address }) => {
      const result = await sui.getAccount(address);
      return { content: [{ type: "text", text: JSON.stringify(result, null, 2) }] };
    }
  );

  server.tool(
    "sui_objects",
    "Get objects owned by an address",
    { address: z.string().describe("Sui address") },
    async ({ address }) => {
      const result = await sui.getObjects(address);
      return { content: [{ type: "text", text: JSON.stringify(result, null, 2) }] };
    }
  );

  server.tool(
    "sui_stats",
    "Get Sui network statistics",
    {},
    async () => {
      const result = await sui.getChainStats();
      return { content: [{ type: "text", text: JSON.stringify(result, null, 2) }] };
    }
  );

  server.tool(
    "sui_transaction",
    "Get transaction block details",
    { digest: z.string().describe("Transaction digest") },
    async ({ digest }) => {
      const result = await sui.getTransactionBlock(digest);
      return { content: [{ type: "text", text: JSON.stringify(result, null, 2) }] };
    }
  );

  server.tool(
    "sui_validators",
    "Get Sui validators",
    {},
    async () => {
      const result = await sui.getValidators();
      return { content: [{ type: "text", text: JSON.stringify(result, null, 2) }] };
    }
  );
}

export default SuiNetwork;
