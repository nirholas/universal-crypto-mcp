/**
 * PancakeSwap Integration
 *
 * Provides swap and liquidity operations on BNB Chain.
 */

import {
  createPublicClient,
  createWalletClient,
  http,
  formatUnits,
  parseUnits,
  type PublicClient,
  type WalletClient,
  type Account,
} from "viem";
import { bsc } from "viem/chains";
import { privateKeyToAccount } from "viem/accounts";
import type { DeFiProtocol, SwapRequest, SwapQuote, PoolInfo } from "@universal-crypto-mcp/defi-shared";

/**
 * PancakeSwap V3 Router address
 */
export const PANCAKESWAP_ROUTER =
  "0x13f4EA83D0bd40E75C8222255bc855a974568Dd4" as const;

/**
 * PancakeSwap Factory address
 */
export const PANCAKESWAP_FACTORY =
  "0x0BFbCF9fa4f9C56B0F40a671Ad40E0805A091865" as const;

/**
 * Router ABI for swaps
 */
const ROUTER_ABI = [
  {
    inputs: [
      {
        components: [
          { name: "tokenIn", type: "address" },
          { name: "tokenOut", type: "address" },
          { name: "fee", type: "uint24" },
          { name: "recipient", type: "address" },
          { name: "amountIn", type: "uint256" },
          { name: "amountOutMinimum", type: "uint256" },
          { name: "sqrtPriceLimitX96", type: "uint160" },
        ],
        name: "params",
        type: "tuple",
      },
    ],
    name: "exactInputSingle",
    outputs: [{ name: "amountOut", type: "uint256" }],
    stateMutability: "payable",
    type: "function",
  },
] as const;

/**
 * PancakeSwap client configuration
 */
export interface PancakeSwapConfig {
  privateKey?: `0x${string}`;
  rpcUrl?: string;
}

/**
 * PancakeSwap Client
 */
export class PancakeSwapClient implements DeFiProtocol {
  name = "pancakeswap";
  chain = "bsc";

  private publicClient: PublicClient;
  private walletClient?: WalletClient;
  private account?: Account;

  constructor(config: PancakeSwapConfig = {}) {
    const transport = http(config.rpcUrl);

    this.publicClient = createPublicClient({
      chain: bsc,
      transport,
    });

    if (config.privateKey) {
      this.account = privateKeyToAccount(config.privateKey);
      this.walletClient = createWalletClient({
        chain: bsc,
        transport,
        account: this.account,
      });
    }
  }

  /**
   * Get swap quote from PancakeSwap
   */
  async getQuote(request: SwapRequest): Promise<SwapQuote> {
    // In production, this would query the PancakeSwap quoter contract
    // For now, return a placeholder
    return {
      tokenIn: request.tokenIn,
      tokenOut: request.tokenOut,
      amountIn: request.amountIn,
      amountOut: "0", // Would be calculated from quoter
      priceImpact: 0,
      route: [request.tokenIn, request.tokenOut],
      protocol: "pancakeswap",
    };
  }

  /**
   * Execute a swap on PancakeSwap
   */
  async executeSwap(request: SwapRequest): Promise<string> {
    if (!this.walletClient || !this.account) {
      throw new Error("Wallet not initialized");
    }

    const quote = await this.getQuote(request);
    const slippageBps = (request.slippage || 0.5) * 100;
    const minAmountOut =
      (BigInt(quote.amountOut) * BigInt(10000 - slippageBps)) / BigInt(10000);

    const hash = await this.walletClient.writeContract({
      address: PANCAKESWAP_ROUTER,
      abi: ROUTER_ABI,
      functionName: "exactInputSingle",
      args: [
        {
          tokenIn: request.tokenIn as `0x${string}`,
          tokenOut: request.tokenOut as `0x${string}`,
          fee: 2500, // 0.25% fee tier
          recipient: this.account.address,
          amountIn: parseUnits(request.amountIn, 18),
          amountOutMinimum: minAmountOut,
          sqrtPriceLimitX96: 0n,
        },
      ],
      account: this.account,
      chain: bsc,
    });

    return hash;
  }

  /**
   * Get available pools
   */
  async getPools(): Promise<PoolInfo[]> {
    // Query top pools from PancakeSwap subgraph or factory
    const pools: PoolInfo[] = [];
    
    // In production, query PancakeSwap V3 subgraph:
    // https://api.thegraph.com/subgraphs/name/pancakeswap/exchange-v3-bsc
    // Or iterate through factory events
    
    return pools;
  }

  /**
   * Get token price in USD from PancakeSwap
   */
  async getTokenPrice(tokenAddress: string): Promise<number> {
    // Query price from PancakeSwap pools
    // Use WBNB as intermediary token, then BNB/USD price
    // Can also use PancakeSwap subgraph or price oracle contracts
    
    // For production, integrate with:
    // - PancakeSwap Quoter contract for accurate pricing
    // - Chainlink price feeds for USD conversion
    // - PancakeSwap subgraph for historical data
    
    return 0;
  }
}
