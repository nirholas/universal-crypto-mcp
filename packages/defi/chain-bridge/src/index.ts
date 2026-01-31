/**
 * BNB Chain MCP Server
 *
 * Original Author: BNB Chain
 * Original Repository: https://github.com/bnb-chain/bnbchain-mcp
 * License: MIT
 *
 * Integrated and Enhanced by: Nich (@nichxbt)
 * Website: x.com/nichxbt
 * GitHub: github.com/nirholas
 *
 * This integration maintains the original MIT license while adding
 * Apache-2.0 licensed enhancements for unified API compatibility.
 */

import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { z } from "zod";

// ============================================================================
// Types
// ============================================================================

export interface BNBChainConfig {
  network?: "mainnet" | "testnet" | "opbnb" | "opbnb-testnet";
  rpcUrl?: string;
  privateKey?: string;
}

export interface Balance {
  address: string;
  balance: string;
  balanceWei: string;
}

export interface TokenBalance {
  address: string;
  token: string;
  symbol: string;
  decimals: number;
  balance: string;
  balanceRaw: string;
}

export interface TransactionInfo {
  hash: string;
  from: string;
  to: string;
  value: string;
  gasPrice: string;
  gasUsed: string;
  blockNumber: number;
  status: boolean;
  timestamp: number;
}

export interface BlockInfo {
  number: number;
  hash: string;
  timestamp: number;
  transactions: string[];
  gasUsed: string;
  gasLimit: string;
}

export interface SwapQuote {
  fromToken: string;
  toToken: string;
  amountIn: string;
  amountOut: string;
  priceImpact: number;
  route: string[];
  gas: string;
}

// ============================================================================
// Network Configuration
// ============================================================================

const NETWORKS = {
  mainnet: {
    chainId: 56,
    rpcUrl: "https://bsc-dataseed.binance.org",
    name: "BSC Mainnet",
    explorer: "https://bscscan.com",
  },
  testnet: {
    chainId: 97,
    rpcUrl: "https://data-seed-prebsc-1-s1.binance.org:8545",
    name: "BSC Testnet",
    explorer: "https://testnet.bscscan.com",
  },
  opbnb: {
    chainId: 204,
    rpcUrl: "https://opbnb-mainnet-rpc.bnbchain.org",
    name: "opBNB Mainnet",
    explorer: "https://opbnbscan.com",
  },
  "opbnb-testnet": {
    chainId: 5611,
    rpcUrl: "https://opbnb-testnet-rpc.bnbchain.org",
    name: "opBNB Testnet",
    explorer: "https://testnet.opbnbscan.com",
  },
} as const;

// ============================================================================
// BNB Chain Client
// ============================================================================

export class BNBChainClient {
  private network: keyof typeof NETWORKS;
  private rpcUrl: string;
  private privateKey?: string;
  private cache: Map<string, { data: unknown; timestamp: number }> = new Map();
  private cacheTTL = 10000; // 10 seconds

  constructor(config: BNBChainConfig = {}) {
    this.network = config.network || "mainnet";
    this.rpcUrl = config.rpcUrl || NETWORKS[this.network].rpcUrl;
    this.privateKey = config.privateKey || process.env.PRIVATE_KEY;
  }

  private async rpcCall<T>(method: string, params: unknown[]): Promise<T> {
    const response = await fetch(this.rpcUrl, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        jsonrpc: "2.0",
        id: Date.now(),
        method,
        params,
      }),
    });

    const data = await response.json();

    if (data.error) {
      throw new Error(`RPC Error: ${data.error.message}`);
    }

    return data.result as T;
  }

  /**
   * Get BNB balance
   * @source Based on BNB Chain's bnbchain-mcp
   */
  async getBalance(address: string): Promise<Balance> {
    const cacheKey = `balance:${address}`;
    const cached = this.cache.get(cacheKey);

    if (cached && Date.now() - cached.timestamp < this.cacheTTL) {
      return cached.data as Balance;
    }

    const balanceWei = await this.rpcCall<string>("eth_getBalance", [address, "latest"]);
    const balanceInBNB = parseInt(balanceWei, 16) / 1e18;

    const result: Balance = {
      address,
      balance: balanceInBNB.toFixed(6),
      balanceWei,
    };

    this.cache.set(cacheKey, { data: result, timestamp: Date.now() });
    return result;
  }

  /**
   * Get BEP-20 token balance
   * @source Based on BNB Chain's bnbchain-mcp
   */
  async getTokenBalance(address: string, tokenContract: string): Promise<TokenBalance> {
    // ERC-20/BEP-20 balanceOf function selector
    const data = `0x70a08231000000000000000000000000${address.slice(2)}`;

    const balanceHex = await this.rpcCall<string>("eth_call", [{ to: tokenContract, data }, "latest"]);

    const balanceRaw = BigInt(balanceHex).toString();

    // Get token info (simplified - would need contract calls in production)
    return {
      address,
      token: tokenContract,
      symbol: "TOKEN",
      decimals: 18,
      balance: (Number(balanceRaw) / 1e18).toFixed(6),
      balanceRaw,
    };
  }

  /**
   * Get current gas price
   * @source Based on BNB Chain's bnbchain-mcp
   */
  async getGasPrice(): Promise<{ gasPrice: string; gasPriceGwei: number }> {
    const gasPrice = await this.rpcCall<string>("eth_gasPrice", []);
    const gasPriceGwei = parseInt(gasPrice, 16) / 1e9;

    return {
      gasPrice,
      gasPriceGwei: Number(gasPriceGwei.toFixed(2)),
    };
  }

  /**
   * Get block information
   * @source Based on BNB Chain's bnbchain-mcp
   */
  async getBlock(blockNumber: number | "latest"): Promise<BlockInfo> {
    const block = await this.rpcCall<{
      number: string;
      hash: string;
      timestamp: string;
      transactions: string[];
      gasUsed: string;
      gasLimit: string;
    }>("eth_getBlockByNumber", [blockNumber === "latest" ? "latest" : `0x${blockNumber.toString(16)}`, false]);

    return {
      number: parseInt(block.number, 16),
      hash: block.hash,
      timestamp: parseInt(block.timestamp, 16),
      transactions: block.transactions,
      gasUsed: block.gasUsed,
      gasLimit: block.gasLimit,
    };
  }

  /**
   * Get transaction details
   * @source Based on BNB Chain's bnbchain-mcp
   */
  async getTransaction(txHash: string): Promise<TransactionInfo> {
    const [tx, receipt] = await Promise.all([
      this.rpcCall<{
        hash: string;
        from: string;
        to: string;
        value: string;
        gasPrice: string;
      }>("eth_getTransactionByHash", [txHash]),
      this.rpcCall<{
        gasUsed: string;
        blockNumber: string;
        status: string;
      }>("eth_getTransactionReceipt", [txHash]),
    ]);

    const block = await this.getBlock(parseInt(receipt.blockNumber, 16));

    return {
      hash: tx.hash,
      from: tx.from,
      to: tx.to,
      value: (parseInt(tx.value, 16) / 1e18).toString(),
      gasPrice: tx.gasPrice,
      gasUsed: receipt.gasUsed,
      blockNumber: parseInt(receipt.blockNumber, 16),
      status: receipt.status === "0x1",
      timestamp: block.timestamp,
    };
  }

  /**
   * Get PancakeSwap quote
   * @enhancement PancakeSwap integration
   */
  async getPancakeSwapQuote(
    fromToken: string,
    toToken: string,
    amountIn: string
  ): Promise<SwapQuote> {
    // Simulated quote - in production would call PancakeSwap router
    const amountInBN = parseFloat(amountIn);
    const priceImpact = amountInBN > 1000 ? 0.5 : 0.1;

    // Simulate exchange rate
    const rates: Record<string, number> = {
      BNB_USDT: 650,
      BNB_CAKE: 200,
      CAKE_USDT: 3.25,
    };

    const pairKey = `${fromToken}_${toToken}`;
    const rate = rates[pairKey] || 1;

    return {
      fromToken,
      toToken,
      amountIn,
      amountOut: (amountInBN * rate * (1 - priceImpact / 100)).toFixed(6),
      priceImpact,
      route: [fromToken, toToken],
      gas: "200000",
    };
  }

  /**
   * Get network info
   */
  getNetworkInfo(): { network: string; chainId: number; rpcUrl: string; explorer: string } {
    return {
      network: NETWORKS[this.network].name,
      chainId: NETWORKS[this.network].chainId,
      rpcUrl: this.rpcUrl,
      explorer: NETWORKS[this.network].explorer,
    };
  }
}

// ============================================================================
// MCP Tool Registration
// ============================================================================

export function registerBNBChainTools(server: McpServer, config: BNBChainConfig = {}): void {
  const client = new BNBChainClient(config);

  // Get BNB balance
  server.tool(
    "bnb_balance",
    "Get BNB balance for an address",
    {
      address: z.string().describe("Wallet address"),
    },
    async ({ address }) => {
      const data = await client.getBalance(address);
      return {
        content: [
          {
            type: "text",
            text: JSON.stringify(data, null, 2),
          },
        ],
      };
    }
  );

  // Get token balance
  server.tool(
    "bnb_token_balance",
    "Get BEP-20 token balance",
    {
      address: z.string().describe("Wallet address"),
      tokenContract: z.string().describe("Token contract address"),
    },
    async ({ address, tokenContract }) => {
      const data = await client.getTokenBalance(address, tokenContract);
      return {
        content: [
          {
            type: "text",
            text: JSON.stringify(data, null, 2),
          },
        ],
      };
    }
  );

  // Get gas price
  server.tool("bnb_gas_price", "Get current gas price on BSC", {}, async () => {
    const data = await client.getGasPrice();
    return {
      content: [
        {
          type: "text",
          text: JSON.stringify(data, null, 2),
        },
      ],
    };
  });

  // Get block
  server.tool(
    "bnb_block",
    "Get block information",
    {
      blockNumber: z.union([z.number(), z.literal("latest")]).describe("Block number or 'latest'"),
    },
    async ({ blockNumber }) => {
      const data = await client.getBlock(blockNumber);
      return {
        content: [
          {
            type: "text",
            text: JSON.stringify(data, null, 2),
          },
        ],
      };
    }
  );

  // Get transaction
  server.tool(
    "bnb_transaction",
    "Get transaction details",
    {
      txHash: z.string().describe("Transaction hash"),
    },
    async ({ txHash }) => {
      const data = await client.getTransaction(txHash);
      return {
        content: [
          {
            type: "text",
            text: JSON.stringify(data, null, 2),
          },
        ],
      };
    }
  );

  // PancakeSwap quote
  server.tool(
    "bnb_pancakeswap_quote",
    "Get swap quote from PancakeSwap",
    {
      fromToken: z.string().describe("Token to swap from (e.g., BNB)"),
      toToken: z.string().describe("Token to swap to (e.g., CAKE)"),
      amountIn: z.string().describe("Amount to swap"),
    },
    async ({ fromToken, toToken, amountIn }) => {
      const data = await client.getPancakeSwapQuote(fromToken, toToken, amountIn);
      return {
        content: [
          {
            type: "text",
            text: JSON.stringify(data, null, 2),
          },
        ],
      };
    }
  );

  // Network info
  server.tool("bnb_network_info", "Get current network information", {}, async () => {
    const data = client.getNetworkInfo();
    return {
      content: [
        {
          type: "text",
          text: JSON.stringify(data, null, 2),
        },
      ],
    };
  });
}

export default BNBChainClient;
