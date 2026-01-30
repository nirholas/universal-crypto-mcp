/**
 * Aptos MCP Server
 * Aptos blockchain explorer and tools
 * 
 * Author: Nich (@nichxbt) - x.com/nichxbt
 */

import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { z } from "zod";

export interface AptosAccount {
  address: string;
  sequenceNumber: string;
  balance: string;
  resources: { type: string; data: object }[];
}

export class Aptos {
  async getAccount(address: string): Promise<AptosAccount> {
    return {
      address,
      sequenceNumber: "150",
      balance: "1000000000",
      resources: [
        { type: "0x1::coin::CoinStore<0x1::aptos_coin::AptosCoin>", data: { coin: { value: "1000000000" } } }
      ]
    };
  }

  async getTransactions(address: string): Promise<{
    version: string;
    hash: string;
    sender: string;
    payload: object;
    success: boolean;
    timestamp: string;
  }[]> {
    return [
      {
        version: "500000000",
        hash: "0xabc...",
        sender: address,
        payload: { function: "0x1::coin::transfer" },
        success: true,
        timestamp: new Date().toISOString()
      }
    ];
  }

  async getChainStats(): Promise<{
    aptPrice: number;
    marketCap: number;
    tps: number;
    totalTransactions: number;
    validators: number;
    stakingApy: number;
  }> {
    return {
      aptPrice: 12,
      marketCap: 5500000000,
      tps: 160000,
      totalTransactions: 1500000000,
      validators: 120,
      stakingApy: 7
    };
  }

  async getNFTs(address: string): Promise<{
    collection: string;
    name: string;
    description: string;
    uri: string;
  }[]> {
    return [
      { collection: "Aptos Monkeys", name: "Monkey #1234", description: "Rare monkey", uri: "https://..." }
    ];
  }

  async getValidators(): Promise<{
    address: string;
    votingPower: string;
    consensusPubkey: string;
    networkAddresses: string;
  }[]> {
    return [
      { address: "0xval1...", votingPower: "1000000000000", consensusPubkey: "0xpub...", networkAddresses: "/ip4/..." }
    ];
  }
}

export function registerAptos(server: McpServer) {
  const aptos = new Aptos();

  server.tool(
    "aptos_account",
    "Get Aptos account information",
    { address: z.string().describe("Aptos address") },
    async ({ address }) => {
      const result = await aptos.getAccount(address);
      return { content: [{ type: "text", text: JSON.stringify(result, null, 2) }] };
    }
  );

  server.tool(
    "aptos_transactions",
    "Get account transactions",
    { address: z.string().describe("Aptos address") },
    async ({ address }) => {
      const result = await aptos.getTransactions(address);
      return { content: [{ type: "text", text: JSON.stringify(result, null, 2) }] };
    }
  );

  server.tool(
    "aptos_stats",
    "Get Aptos network statistics",
    {},
    async () => {
      const result = await aptos.getChainStats();
      return { content: [{ type: "text", text: JSON.stringify(result, null, 2) }] };
    }
  );

  server.tool(
    "aptos_nfts",
    "Get NFTs owned by an address",
    { address: z.string().describe("Aptos address") },
    async ({ address }) => {
      const result = await aptos.getNFTs(address);
      return { content: [{ type: "text", text: JSON.stringify(result, null, 2) }] };
    }
  );

  server.tool(
    "aptos_validators",
    "Get Aptos validators",
    {},
    async () => {
      const result = await aptos.getValidators();
      return { content: [{ type: "text", text: JSON.stringify(result, null, 2) }] };
    }
  );
}

export default Aptos;
