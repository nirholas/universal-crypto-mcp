/**
 * Raydium CLMM (Concentrated Liquidity Market Maker) Integration
 * 
 * Handles interactions with Raydium CLMM pools.
 */

import {
  Connection,
  PublicKey,
  Transaction,
  TransactionInstruction,
} from '@solana/web3.js';
import {
  TOKEN_PROGRAM_ID,
  getAssociatedTokenAddress,
  createAssociatedTokenAccountInstruction,
} from '@solana/spl-token';
import type {
  RaydiumCLMMPoolInfo,
  RaydiumSwapParams,
  TransactionResult,
  TradingEngineConfig,
} from '../types.js';
import { RAYDIUM_PROGRAM_IDS } from '../types.js';

/**
 * CLMM pool state layout
 */
const CLMM_LAYOUT = {
  DISCRIMINATOR: 0,
  AMM_CONFIG: 8,
  POOL_CREATOR: 40,
  TOKEN_0_VAULT: 72,
  TOKEN_1_VAULT: 104,
  OBSERVATION_KEY: 136,
  TOKEN_MINT_0: 168,
  TOKEN_MINT_1: 200,
  TOKEN_DECIMALS_0: 232,
  TOKEN_DECIMALS_1: 233,
  TICK_SPACING: 234,
  LIQUIDITY: 236,
  SQRT_PRICE_X64: 244,
  TICK_CURRENT: 260,
  FEE_GROWTH_GLOBAL_0_X64: 264,
  FEE_GROWTH_GLOBAL_1_X64: 280,
  PROTOCOL_FEES_0: 296,
  PROTOCOL_FEES_1: 304,
  SWAP_IN_AMOUNT_0: 312,
  SWAP_OUT_AMOUNT_0: 328,
  SWAP_IN_AMOUNT_1: 344,
  SWAP_OUT_AMOUNT_1: 360,
  STATUS: 376,
  PADDING: 377,
};

/**
 * Raydium CLMM service for concentrated liquidity pools
 */
export class RaydiumCLMM {
  private readonly connection: Connection;
  private readonly programId: PublicKey;

  constructor(config: TradingEngineConfig) {
    this.connection = new Connection(config.rpcEndpoint, 'confirmed');
    this.programId = new PublicKey(RAYDIUM_PROGRAM_IDS.CLMM);
  }

  /**
   * Get CLMM pool info by pool address
   */
  async getPoolInfo(poolAddress: string): Promise<RaydiumCLMMPoolInfo> {
    const poolPubkey = new PublicKey(poolAddress);
    const accountInfo = await this.connection.getAccountInfo(poolPubkey);

    if (!accountInfo) {
      throw new Error(`CLMM pool not found: ${poolAddress}`);
    }

    return this.decodePoolInfo(poolAddress, accountInfo.data);
  }

  /**
   * Decode CLMM pool account data
   */
  private decodePoolInfo(poolId: string, data: Buffer): RaydiumCLMMPoolInfo {
    const tokenVault0 = new PublicKey(data.subarray(CLMM_LAYOUT.TOKEN_0_VAULT, CLMM_LAYOUT.TOKEN_0_VAULT + 32)).toBase58();
    const tokenVault1 = new PublicKey(data.subarray(CLMM_LAYOUT.TOKEN_1_VAULT, CLMM_LAYOUT.TOKEN_1_VAULT + 32)).toBase58();
    const tokenMint0 = new PublicKey(data.subarray(CLMM_LAYOUT.TOKEN_MINT_0, CLMM_LAYOUT.TOKEN_MINT_0 + 32)).toBase58();
    const tokenMint1 = new PublicKey(data.subarray(CLMM_LAYOUT.TOKEN_MINT_1, CLMM_LAYOUT.TOKEN_MINT_1 + 32)).toBase58();

    const tickSpacing = data.readUInt16LE(CLMM_LAYOUT.TICK_SPACING);
    const liquidity = data.readBigUInt64LE(CLMM_LAYOUT.LIQUIDITY);
    const sqrtPriceX64 = data.readBigUInt64LE(CLMM_LAYOUT.SQRT_PRICE_X64);
    const tickCurrent = data.readInt32LE(CLMM_LAYOUT.TICK_CURRENT);
    const feeGrowthGlobal0X64 = data.readBigUInt64LE(CLMM_LAYOUT.FEE_GROWTH_GLOBAL_0_X64);
    const feeGrowthGlobal1X64 = data.readBigUInt64LE(CLMM_LAYOUT.FEE_GROWTH_GLOBAL_1_X64);

    const baseDecimals = data.readUInt8(CLMM_LAYOUT.TOKEN_DECIMALS_0);
    const quoteDecimals = data.readUInt8(CLMM_LAYOUT.TOKEN_DECIMALS_1);
    const feeRate = this.getDefaultFeeRate(tickSpacing);

    // Calculate price from sqrtPriceX64
    const price = this.sqrtPriceX64ToPrice(sqrtPriceX64, baseDecimals, quoteDecimals);

    return {
      id: poolId,
      type: 'CLMM',
      baseMint: tokenMint0,
      quoteMint: tokenMint1,
      baseVault: tokenVault0,
      quoteVault: tokenVault1,
      lpMint: '', // CLMM doesn't have LP mint
      baseReserve: 0n, // Will be fetched
      quoteReserve: 0n, // Will be fetched
      baseDecimals,
      quoteDecimals,
      lpSupply: 0n,
      openTime: 0,
      feeRate,
      swapFeeNumerator: feeRate,
      swapFeeDenominator: 10000,
      price,
      currentTick: tickCurrent,
      currentSqrtPrice: sqrtPriceX64,
      tickSpacing,
      feeGrowthGlobalA: feeGrowthGlobal0X64,
      feeGrowthGlobalB: feeGrowthGlobal1X64,
      liquidity,
    };
  }

  /**
   * Convert sqrtPriceX64 to price
   */
  private sqrtPriceX64ToPrice(sqrtPriceX64: bigint, decimals0: number, decimals1: number): number {
    const sqrtPrice = Number(sqrtPriceX64) / Math.pow(2, 64);
    const price = sqrtPrice * sqrtPrice;
    const decimalAdjustment = Math.pow(10, decimals0 - decimals1);
    return price * decimalAdjustment;
  }

  /**
   * Get default fee rate for tick spacing
   */
  private getDefaultFeeRate(tickSpacing: number): number {
    // Common tick spacing to fee rate mapping (in basis points)
    const feeRates: Record<number, number> = {
      1: 1,    // 0.01%
      10: 5,   // 0.05%
      60: 30,  // 0.30%
      200: 100, // 1.00%
    };
    return feeRates[tickSpacing] ?? 30;
  }

  /**
   * Get tick from price
   */
  tickFromPrice(price: number, tickSpacing: number): number {
    const tick = Math.floor(Math.log(price) / Math.log(1.0001));
    return Math.floor(tick / tickSpacing) * tickSpacing;
  }

  /**
   * Get price from tick
   */
  priceFromTick(tick: number): number {
    return Math.pow(1.0001, tick);
  }

  /**
   * Calculate swap output for CLMM
   */
  async calculateSwapOutput(
    poolAddress: string,
    amountIn: bigint,
    inputMint: string,
    slippageBps: number = 100
  ): Promise<{
    amountOut: bigint;
    minAmountOut: bigint;
    priceImpact: number;
    fee: bigint;
  }> {
    const poolInfo = await this.getPoolInfo(poolAddress);
    
    // Determine swap direction
    const isToken0ToToken1 = inputMint === poolInfo.baseMint;
    
    // Get reserves
    const [vault0Balance, vault1Balance] = await Promise.all([
      this.connection.getTokenAccountBalance(new PublicKey(poolInfo.baseVault)),
      this.connection.getTokenAccountBalance(new PublicKey(poolInfo.quoteVault)),
    ]);

    const reserve0 = BigInt(vault0Balance.value.amount);
    const reserve1 = BigInt(vault1Balance.value.amount);

    // Simplified calculation using constant product formula
    // Real CLMM requires tick-by-tick calculation
    const reserveIn = isToken0ToToken1 ? reserve0 : reserve1;
    const reserveOut = isToken0ToToken1 ? reserve1 : reserve0;

    // Apply fee
    const feeMultiplier = 10000n - BigInt(poolInfo.feeRate);
    const amountInWithFee = amountIn * feeMultiplier / 10000n;
    const fee = amountIn - amountInWithFee;

    // Constant product approximation
    const amountOut = (reserveOut * amountInWithFee) / (reserveIn + amountInWithFee);
    
    // Apply slippage
    const slippageMultiplier = 10000n - BigInt(slippageBps);
    const minAmountOut = amountOut * slippageMultiplier / 10000n;

    // Calculate price impact
    const spotPrice = Number(reserveOut) / Number(reserveIn);
    const executionPrice = Number(amountOut) / Number(amountIn);
    const priceImpact = Math.abs((spotPrice - executionPrice) / spotPrice) * 100;

    return {
      amountOut,
      minAmountOut,
      priceImpact,
      fee,
    };
  }

  /**
   * Build swap instruction for CLMM
   */
  async buildSwapInstruction(
    poolInfo: RaydiumCLMMPoolInfo,
    params: RaydiumSwapParams,
    userTokenAccounts: {
      userSourceToken: PublicKey;
      userDestToken: PublicKey;
    }
  ): Promise<TransactionInstruction> {
    const poolPubkey = new PublicKey(poolInfo.id);
    const userPubkey = new PublicKey(params.userPublicKey);
    
    const isToken0ToToken1 = params.inputMint === poolInfo.baseMint;

    // CLMM requires tick array accounts
    // For simplicity, we'll use a basic instruction structure
    const keys = [
      { pubkey: poolPubkey, isSigner: false, isWritable: true },
      { pubkey: new PublicKey(poolInfo.baseVault), isSigner: false, isWritable: true },
      { pubkey: new PublicKey(poolInfo.quoteVault), isSigner: false, isWritable: true },
      { pubkey: userTokenAccounts.userSourceToken, isSigner: false, isWritable: true },
      { pubkey: userTokenAccounts.userDestToken, isSigner: false, isWritable: true },
      { pubkey: userPubkey, isSigner: true, isWritable: false },
      { pubkey: TOKEN_PROGRAM_ID, isSigner: false, isWritable: false },
    ];

    // Swap instruction data
    const data = Buffer.alloc(1 + 8 + 8 + 1);
    data.writeUInt8(isToken0ToToken1 ? 0 : 1, 0); // Direction
    data.writeBigUInt64LE(params.amountIn, 1);
    data.writeBigUInt64LE(params.minAmountOut, 9);
    data.writeUInt8(params.fixedSide === 'in' ? 0 : 1, 17);

    return new TransactionInstruction({
      programId: this.programId,
      keys,
      data,
    });
  }

  /**
   * Execute a swap on CLMM
   */
  async swap(
    params: RaydiumSwapParams,
    signer: Uint8Array | ((tx: Transaction) => Promise<Transaction>)
  ): Promise<TransactionResult> {
    const poolInfo = await this.getPoolInfo(params.poolId);

    const userPubkey = new PublicKey(params.userPublicKey);
    const inputMint = new PublicKey(params.inputMint);
    const outputMint = new PublicKey(
      params.inputMint === poolInfo.baseMint ? poolInfo.quoteMint : poolInfo.baseMint
    );

    // Get user token accounts
    const userSourceToken = await getAssociatedTokenAddress(inputMint, userPubkey);
    const userDestToken = await getAssociatedTokenAddress(outputMint, userPubkey);

    const transaction = new Transaction();

    // Check if destination ATA needs to be created
    const destAtaInfo = await this.connection.getAccountInfo(userDestToken);
    if (!destAtaInfo) {
      transaction.add(
        createAssociatedTokenAccountInstruction(
          userPubkey,
          userDestToken,
          userPubkey,
          outputMint
        )
      );
    }

    // Add swap instruction
    const swapIx = await this.buildSwapInstruction(poolInfo, params, {
      userSourceToken,
      userDestToken,
    });
    transaction.add(swapIx);

    // Set compute budget
    if (params.computeBudgetConfig) {
      const { ComputeBudgetProgram } = await import('@solana/web3.js');
      if (params.computeBudgetConfig.units) {
        transaction.add(
          ComputeBudgetProgram.setComputeUnitLimit({
            units: params.computeBudgetConfig.units,
          })
        );
      }
      if (params.computeBudgetConfig.microLamports) {
        transaction.add(
          ComputeBudgetProgram.setComputeUnitPrice({
            microLamports: params.computeBudgetConfig.microLamports,
          })
        );
      }
    }

    // Set recent blockhash
    const { blockhash, lastValidBlockHeight } = await this.connection.getLatestBlockhash();
    transaction.recentBlockhash = blockhash;
    transaction.feePayer = userPubkey;

    // Sign
    if (signer instanceof Uint8Array) {
      const { Keypair } = await import('@solana/web3.js');
      const keypair = Keypair.fromSecretKey(signer);
      transaction.sign(keypair);
    } else {
      await signer(transaction);
    }

    // Send and confirm
    try {
      const signature = await this.connection.sendRawTransaction(transaction.serialize(), {
        skipPreflight: false,
        maxRetries: 3,
      });

      const confirmation = await this.connection.confirmTransaction({
        signature,
        blockhash,
        lastValidBlockHeight,
      }, 'confirmed');

      return {
        signature,
        confirmed: !confirmation.value.err,
        error: confirmation.value.err ? JSON.stringify(confirmation.value.err) : undefined,
      };
    } catch (error) {
      return {
        signature: '',
        confirmed: false,
        error: error instanceof Error ? error.message : 'Unknown error',
      };
    }
  }

  /**
   * Get all CLMM pools for a token
   */
  async getPoolsByToken(mint: string): Promise<RaydiumCLMMPoolInfo[]> {
    // Query pools by token mint 0
    const token0Pools = await this.connection.getProgramAccounts(this.programId, {
      filters: [
        {
          memcmp: {
            offset: CLMM_LAYOUT.TOKEN_MINT_0,
            bytes: mint,
          },
        },
      ],
    });

    // Query pools by token mint 1
    const token1Pools = await this.connection.getProgramAccounts(this.programId, {
      filters: [
        {
          memcmp: {
            offset: CLMM_LAYOUT.TOKEN_MINT_1,
            bytes: mint,
          },
        },
      ],
    });

    const allPools = [...token0Pools, ...token1Pools];
    const uniquePools = new Map<string, RaydiumCLMMPoolInfo>();

    for (const { pubkey, account } of allPools) {
      const poolId = pubkey.toBase58();
      if (!uniquePools.has(poolId)) {
        try {
          uniquePools.set(poolId, this.decodePoolInfo(poolId, account.data));
        } catch {
          // Skip invalid pools
        }
      }
    }

    return Array.from(uniquePools.values());
  }
}
