/**
 * Raydium Client
 * 
 * Main client for interacting with Raydium DEX pools (AMM V4 and CLMM).
 */

import { Connection } from '@solana/web3.js';
import { RaydiumAMM } from './amm.js';
import { RaydiumCLMM } from './clmm.js';
import { RaydiumLiquidity, type LiquidityCalculation, type RemoveLiquidityCalculation } from './liquidity.js';
import type {
  RaydiumPoolInfo,
  RaydiumCLMMPoolInfo,
  RaydiumSwapParams,
  RaydiumPoolType,
  AddLiquidityParams,
  RemoveLiquidityParams,
  TransactionResult,
  TradingEngineConfig,
  IRaydiumClient,
} from '../types.js';

/**
 * Raydium Client - Full integration with Raydium DEX
 */
export class RaydiumClient implements IRaydiumClient {
  private readonly connection: Connection;
  private readonly amm: RaydiumAMM;
  private readonly clmm: RaydiumCLMM;
  private readonly liquidity: RaydiumLiquidity;

  // Pool cache
  private poolCache: Map<string, RaydiumPoolInfo | RaydiumCLMMPoolInfo> = new Map();
  private poolCacheTime: Map<string, number> = new Map();
  private readonly poolCacheTtlMs = 30_000; // 30 seconds

  constructor(config: TradingEngineConfig) {
    this.connection = new Connection(config.rpcEndpoint, 'confirmed');
    this.amm = new RaydiumAMM(config);
    this.clmm = new RaydiumCLMM(config);
    this.liquidity = new RaydiumLiquidity(config);
  }

  /**
   * Get pool info by ID (auto-detects AMM V4 or CLMM)
   */
  async getPoolInfo(poolId: string): Promise<RaydiumPoolInfo> {
    // Check cache
    const cached = this.poolCache.get(poolId);
    const cacheTime = this.poolCacheTime.get(poolId);
    if (cached && cacheTime && Date.now() - cacheTime < this.poolCacheTtlMs) {
      return cached;
    }

    // Try AMM V4 first
    try {
      const poolInfo = await this.amm.getFullPoolInfo(poolId);
      this.poolCache.set(poolId, poolInfo);
      this.poolCacheTime.set(poolId, Date.now());
      return poolInfo;
    } catch {
      // Try CLMM
      const poolInfo = await this.clmm.getPoolInfo(poolId);
      this.poolCache.set(poolId, poolInfo);
      this.poolCacheTime.set(poolId, Date.now());
      return poolInfo;
    }
  }

  /**
   * Get CLMM pool info specifically
   */
  async getCLMMPoolInfo(poolId: string): Promise<RaydiumCLMMPoolInfo> {
    return this.clmm.getPoolInfo(poolId);
  }

  /**
   * Get all pools for a token (both AMM V4 and CLMM)
   */
  async getPoolsByToken(mint: string): Promise<RaydiumPoolInfo[]> {
    const [ammPools, clmmPools] = await Promise.all([
      this.amm.getPoolsByToken(mint),
      this.clmm.getPoolsByToken(mint),
    ]);

    return [...ammPools, ...clmmPools];
  }

  /**
   * Get AMM V4 pools only for a token
   */
  async getAMMPoolsByToken(mint: string): Promise<RaydiumPoolInfo[]> {
    return this.amm.getPoolsByToken(mint);
  }

  /**
   * Get CLMM pools only for a token
   */
  async getCLMMPoolsByToken(mint: string): Promise<RaydiumCLMMPoolInfo[]> {
    return this.clmm.getPoolsByToken(mint);
  }

  /**
   * Execute a swap (auto-detects pool type)
   */
  async swap(_params: RaydiumSwapParams): Promise<TransactionResult> {
    throw new Error('swap requires a signer. Use swapWithSigner instead.');
  }

  /**
   * Execute a swap with signer
   */
  async swapWithSigner(
    params: RaydiumSwapParams,
    signer: Uint8Array | ((tx: any) => Promise<any>)
  ): Promise<TransactionResult> {
    const poolInfo = await this.getPoolInfo(params.poolId);

    if (poolInfo.type === 'CLMM') {
      return this.clmm.swap(params, signer);
    } else {
      return this.amm.swap(params, signer);
    }
  }

  /**
   * Calculate swap output
   */
  async calculateSwapOutput(
    poolId: string,
    amountIn: bigint,
    inputMint: string,
    slippageBps: number = 100
  ): Promise<{
    amountOut: bigint;
    minAmountOut: bigint;
    priceImpact: number;
    fee: bigint;
  }> {
    const poolInfo = await this.getPoolInfo(poolId);

    if (poolInfo.type === 'CLMM') {
      return this.clmm.calculateSwapOutput(poolId, amountIn, inputMint, slippageBps);
    }

    // AMM V4 calculation
    const isBaseToQuote = inputMint === poolInfo.baseMint;
    const reserveIn = isBaseToQuote ? poolInfo.baseReserve : poolInfo.quoteReserve;
    const reserveOut = isBaseToQuote ? poolInfo.quoteReserve : poolInfo.baseReserve;

    const result = this.amm.calculateSwapOutput(amountIn, reserveIn, reserveOut, poolInfo.feeRate);
    const slippageMultiplier = 10000n - BigInt(slippageBps);
    const minAmountOut = result.amountOut * slippageMultiplier / 10000n;

    return {
      amountOut: result.amountOut,
      minAmountOut,
      priceImpact: result.priceImpact,
      fee: result.fee,
    };
  }

  /**
   * Add liquidity to a pool
   */
  async addLiquidity(_params: AddLiquidityParams): Promise<TransactionResult> {
    throw new Error('addLiquidity requires a signer. Use addLiquidityWithSigner instead.');
  }

  /**
   * Add liquidity with signer
   */
  async addLiquidityWithSigner(
    params: AddLiquidityParams,
    signer: Uint8Array | ((tx: any) => Promise<any>)
  ): Promise<TransactionResult> {
    return this.liquidity.addLiquidity(params, signer);
  }

  /**
   * Remove liquidity from a pool
   */
  async removeLiquidity(_params: RemoveLiquidityParams): Promise<TransactionResult> {
    throw new Error('removeLiquidity requires a signer. Use removeLiquidityWithSigner instead.');
  }

  /**
   * Remove liquidity with signer
   */
  async removeLiquidityWithSigner(
    params: RemoveLiquidityParams,
    signer: Uint8Array | ((tx: any) => Promise<any>)
  ): Promise<TransactionResult> {
    return this.liquidity.removeLiquidity(params, signer);
  }

  /**
   * Calculate add liquidity amounts
   */
  async calculateAddLiquidity(
    poolId: string,
    baseAmount: bigint,
    quoteAmount: bigint,
    fixedSide: 'base' | 'quote'
  ): Promise<LiquidityCalculation> {
    return this.liquidity.calculateAddLiquidity(poolId, baseAmount, quoteAmount, fixedSide);
  }

  /**
   * Calculate remove liquidity amounts
   */
  async calculateRemoveLiquidity(
    poolId: string,
    lpAmount: bigint
  ): Promise<RemoveLiquidityCalculation> {
    return this.liquidity.calculateRemoveLiquidity(poolId, lpAmount);
  }

  /**
   * Get user's LP balance
   */
  async getUserLpBalance(poolId: string, userPublicKey: string): Promise<bigint> {
    return this.liquidity.getUserLpBalance(poolId, userPublicKey);
  }

  /**
   * Get user's pool share
   */
  async getUserPoolShare(poolId: string, userPublicKey: string): Promise<{
    lpBalance: bigint;
    sharePercent: number;
    baseValue: bigint;
    quoteValue: bigint;
  }> {
    return this.liquidity.getUserPoolShare(poolId, userPublicKey);
  }

  /**
   * Get current price from pool
   */
  async getPrice(poolId: string): Promise<number> {
    const poolInfo = await this.getPoolInfo(poolId);
    return poolInfo.price;
  }

  /**
   * Get pool TVL estimate
   */
  async getPoolTVL(
    poolId: string,
    basePriceUsd: number,
    quotePriceUsd: number
  ): Promise<number> {
    const poolInfo = await this.getPoolInfo(poolId);
    
    // This is simplified - would need proper decimal handling
    const baseValueUsd = Number(poolInfo.baseReserve) * basePriceUsd;
    const quoteValueUsd = Number(poolInfo.quoteReserve) * quotePriceUsd;
    
    return baseValueUsd + quoteValueUsd;
  }

  /**
   * Find best pool for a swap
   */
  async findBestPool(
    inputMint: string,
    outputMint: string,
    amount: bigint
  ): Promise<{
    poolId: string;
    poolType: RaydiumPoolType;
    expectedOutput: bigint;
    priceImpact: number;
  } | null> {
    // Get all pools containing the input token
    const pools = await this.getPoolsByToken(inputMint);
    
    // Filter to pools with the output token
    const relevantPools = pools.filter(pool =>
      (pool.baseMint === inputMint && pool.quoteMint === outputMint) ||
      (pool.baseMint === outputMint && pool.quoteMint === inputMint)
    );

    if (relevantPools.length === 0) {
      return null;
    }

    // Calculate output for each pool
    const results = await Promise.all(
      relevantPools.map(async pool => {
        try {
          const output = await this.calculateSwapOutput(pool.id, amount, inputMint);
          return {
            poolId: pool.id,
            poolType: pool.type,
            expectedOutput: output.amountOut,
            priceImpact: output.priceImpact,
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
