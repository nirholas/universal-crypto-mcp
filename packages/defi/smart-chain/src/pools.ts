/**
 * Liquidity Pool Utilities
 * 
 * Query and interact with PancakeSwap V3 liquidity pools.
 */

import {
  createPublicClient,
  http,
  type PublicClient,
  formatUnits,
} from "viem";
import { bsc } from "viem/chains";

/**
 * Pool information
 */
export interface PoolInfo {
  address: `0x${string}`;
  token0: `0x${string}`;
  token1: `0x${string}`;
  fee: number;
  liquidity: bigint;
  sqrtPriceX96: bigint;
  tick: number;
  observationIndex: number;
}

/**
 * Pool position
 */
export interface Position {
  tokenId: bigint;
  operator: `0x${string}`;
  token0: `0x${string}`;
  token1: `0x${string}`;
  fee: number;
  tickLower: number;
  tickUpper: number;
  liquidity: bigint;
  tokensOwed0: bigint;
  tokensOwed1: bigint;
}

/**
 * UniswapV3 Pool ABI (subset for reading pool data)
 */
const POOL_ABI = [
  {
    inputs: [],
    name: "slot0",
    outputs: [
      { name: "sqrtPriceX96", type: "uint160" },
      { name: "tick", type: "int24" },
      { name: "observationIndex", type: "uint16" },
      { name: "observationCardinality", type: "uint16" },
      { name: "observationCardinalityNext", type: "uint16" },
      { name: "feeProtocol", type: "uint8" },
      { name: "unlocked", type: "bool" },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "liquidity",
    outputs: [{ name: "", type: "uint128" }],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "token0",
    outputs: [{ name: "", type: "address" }],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "token1",
    outputs: [{ name: "", type: "address" }],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "fee",
    outputs: [{ name: "", type: "uint24" }],
    stateMutability: "view",
    type: "function",
  },
] as const;

/**
 * PancakeSwap V3 Pool Manager
 */
export class PoolManager {
  private publicClient: PublicClient;

  constructor(rpcUrl?: string) {
    const transport = http(rpcUrl);
    this.publicClient = createPublicClient({
      chain: bsc,
      transport,
    });
  }

  /**
   * Get pool information
   */
  async getPoolInfo(poolAddress: `0x${string}`): Promise<PoolInfo> {
    const [slot0Data, liquidity, token0, token1, fee] = await Promise.all([
      this.publicClient.readContract({
        address: poolAddress,
        abi: POOL_ABI,
        functionName: "slot0",
      }),
      this.publicClient.readContract({
        address: poolAddress,
        abi: POOL_ABI,
        functionName: "liquidity",
      }),
      this.publicClient.readContract({
        address: poolAddress,
        abi: POOL_ABI,
        functionName: "token0",
      }),
      this.publicClient.readContract({
        address: poolAddress,
        abi: POOL_ABI,
        functionName: "token1",
      }),
      this.publicClient.readContract({
        address: poolAddress,
        abi: POOL_ABI,
        functionName: "fee",
      }),
    ]);

    const slot0 = slot0Data as any[];

    return {
      address: poolAddress,
      token0: token0 as `0x${string}`,
      token1: token1 as `0x${string}`,
      fee: Number(fee),
      liquidity: liquidity as bigint,
      sqrtPriceX96: slot0[0] as bigint,
      tick: Number(slot0[1]),
      observationIndex: Number(slot0[2]),
    };
  }

  /**
   * Calculate price from sqrtPriceX96
   */
  calculatePrice(sqrtPriceX96: bigint, decimals0: number, decimals1: number): number {
    const Q96 = 2n ** 96n;
    const price = Number(sqrtPriceX96) / Number(Q96);
    const priceSquared = price * price;
    
    // Adjust for decimals
    const decimalAdjustment = 10 ** (decimals1 - decimals0);
    
    return priceSquared * decimalAdjustment;
  }

  /**
   * Get token price from pool
   */
  async getTokenPrice(
    poolAddress: `0x${string}`,
    token0Decimals: number = 18,
    token1Decimals: number = 18
  ): Promise<{ token0Price: number; token1Price: number }> {
    const poolInfo = await this.getPoolInfo(poolAddress);
    
    const token0Price = this.calculatePrice(
      poolInfo.sqrtPriceX96,
      token0Decimals,
      token1Decimals
    );
    
    const token1Price = 1 / token0Price;

    return {
      token0Price,
      token1Price,
    };
  }

  /**
   * Calculate fee tier percentage
   */
  calculateFeeTier(fee: number): number {
    return fee / 10000; // fee is in hundredths of a bip
  }

  /**
   * Get multiple pool prices in parallel
   */
  async getMultiplePoolPrices(
    pools: Array<{
      address: `0x${string}`;
      decimals0: number;
      decimals1: number;
    }>
  ): Promise<
    Array<{
      address: `0x${string}`;
      token0Price: number;
      token1Price: number;
    }>
  > {
    const prices = await Promise.all(
      pools.map(async (pool) => {
        const { token0Price, token1Price } = await this.getTokenPrice(
          pool.address,
          pool.decimals0,
          pool.decimals1
        );

        return {
          address: pool.address,
          token0Price,
          token1Price,
        };
      })
    );

    return prices;
  }

  /**
   * Estimate pool TVL (Total Value Locked)
   * Note: Requires token prices in USD
   */
  calculatePoolTVL(
    liquidity: bigint,
    sqrtPriceX96: bigint,
    token0PriceUSD: number,
    token1PriceUSD: number,
    token0Decimals: number = 18,
    token1Decimals: number = 18
  ): number {
    const Q96 = 2n ** 96n;
    const price = Number(sqrtPriceX96) / Number(Q96);
    const priceSquared = price * price;

    // Convert liquidity to token amounts (simplified)
    const amount0 = Number(liquidity) / (10 ** token0Decimals);
    const amount1 = Number(liquidity) / (10 ** token1Decimals);

    const tvl0 = amount0 * token0PriceUSD;
    const tvl1 = amount1 * token1PriceUSD;

    return tvl0 + tvl1;
  }

  /**
   * Check if pool has sufficient liquidity for trade
   */
  async hasLiquidityForTrade(
    poolAddress: `0x${string}`,
    requiredLiquidity: bigint
  ): Promise<boolean> {
    const poolInfo = await this.getPoolInfo(poolAddress);
    return poolInfo.liquidity >= requiredLiquidity;
  }
}
