/**
 * Orca Client
 * 
 * Main client for interacting with Orca Whirlpools.
 */

import { Connection, Transaction } from '@solana/web3.js';
import { OrcaWhirlpool } from './whirlpool.js';
import type {
  WhirlpoolInfo,
  OrcaSwapParams,
  OrcaPosition,
  TransactionResult,
  TradingEngineConfig,
  IOrcaClient,
} from '../types.js';

/**
 * Orca Client - Full integration with Orca Whirlpools
 */
export class OrcaClient implements IOrcaClient {
  private readonly connection: Connection;
  private readonly whirlpool: OrcaWhirlpool;

  // Pool cache
  private poolCache: Map<string, WhirlpoolInfo> = new Map();
  private poolCacheTime: Map<string, number> = new Map();
  private readonly poolCacheTtlMs = 30_000; // 30 seconds

  constructor(config: TradingEngineConfig) {
    this.connection = new Connection(config.rpcEndpoint, 'confirmed');
    this.whirlpool = new OrcaWhirlpool(config);
  }

  /**
   * Get whirlpool info by address
   */
  async getWhirlpoolInfo(address: string): Promise<WhirlpoolInfo> {
    // Check cache
    const cached = this.poolCache.get(address);
    const cacheTime = this.poolCacheTime.get(address);
    if (cached && cacheTime && Date.now() - cacheTime < this.poolCacheTtlMs) {
      return cached;
    }

    const info = await this.whirlpool.getWhirlpoolInfo(address);
    this.poolCache.set(address, info);
    this.poolCacheTime.set(address, Date.now());
    return info;
  }

  /**
   * Get whirlpools by token mint
   */
  async getWhirlpoolsByToken(mint: string): Promise<WhirlpoolInfo[]> {
    return this.whirlpool.getWhirlpoolsByToken(mint);
  }

  /**
   * Execute a swap
   */
  async swap(_params: OrcaSwapParams): Promise<TransactionResult> {
    throw new Error('swap requires a signer. Use swapWithSigner instead.');
  }

  /**
   * Execute a swap with signer
   */
  async swapWithSigner(
    params: OrcaSwapParams,
    signer: Uint8Array | ((tx: Transaction) => Promise<Transaction>)
  ): Promise<TransactionResult> {
    return this.whirlpool.swap(params, signer);
  }

  /**
   * Calculate swap output
   */
  async calculateSwapOutput(
    whirlpoolAddress: string,
    amount: bigint,
    inputMint: string,
    isExactIn: boolean = true,
    slippageBps: number = 100
  ): Promise<{
    amountOut: bigint;
    minAmountOut: bigint;
    priceImpact: number;
    fee: bigint;
  }> {
    return this.whirlpool.calculateSwapOutput(
      whirlpoolAddress,
      amount,
      inputMint,
      isExactIn,
      slippageBps
    );
  }

  /**
   * Get position info
   */
  async getPosition(positionAddress: string): Promise<OrcaPosition> {
    return this.whirlpool.getPosition(positionAddress);
  }

  /**
   * Get all positions owned by a user
   */
  async getPositionsByOwner(owner: string): Promise<OrcaPosition[]> {
    return this.whirlpool.getPositionsByOwner(owner);
  }

  /**
   * Get current price from whirlpool
   */
  async getPrice(whirlpoolAddress: string, decimalsA: number, decimalsB: number): Promise<number> {
    return this.whirlpool.getPrice(whirlpoolAddress, decimalsA, decimalsB);
  }

  /**
   * Find best whirlpool for a swap
   */
  async findBestWhirlpool(
    inputMint: string,
    outputMint: string,
    amount: bigint
  ): Promise<{
    address: string;
    expectedOutput: bigint;
    priceImpact: number;
    feeRate: number;
  } | null> {
    // Get all whirlpools containing the input token
    const pools = await this.getWhirlpoolsByToken(inputMint);
    
    // Filter to pools with the output token
    const relevantPools = pools.filter(pool =>
      (pool.tokenMintA === inputMint && pool.tokenMintB === outputMint) ||
      (pool.tokenMintA === outputMint && pool.tokenMintB === inputMint)
    );

    if (relevantPools.length === 0) {
      return null;
    }

    // Calculate output for each pool
    const results = await Promise.all(
      relevantPools.map(async pool => {
        try {
          const output = await this.calculateSwapOutput(pool.address, amount, inputMint);
          return {
            address: pool.address,
            expectedOutput: output.amountOut,
            priceImpact: output.priceImpact,
            feeRate: pool.feeRate,
          };
        } catch {
          return null;
        }
      })
    );

    // Find best result (highest output)
    const validResults = results.filter((r): r is NonNullable<typeof r> => r !== null);
    if (validResults.length === 0) {
      return null;
    }

    return validResults.reduce((best, current) =>
      current.expectedOutput > best.expectedOutput ? current : best
    );
  }

  /**
   * Calculate price from sqrt price
   */
  sqrtPriceToPrice(sqrtPrice: bigint, decimalsA: number, decimalsB: number): number {
    return this.whirlpool.sqrtPriceToPrice(sqrtPrice, decimalsA, decimalsB);
  }

  /**
   * Calculate tick from price
   */
  priceToTick(price: number): number {
    return this.whirlpool.priceToTick(price);
  }

  /**
   * Calculate price from tick
   */
  tickToPrice(tick: number): number {
    return this.whirlpool.tickToPrice(tick);
  }

  /**
   * Get connection instance
   */
  getConnection(): Connection {
    return this.connection;
  }

  /**
   * Clear pool cache
   */
  clearCache(): void {
    this.poolCache.clear();
    this.poolCacheTime.clear();
  }
}
