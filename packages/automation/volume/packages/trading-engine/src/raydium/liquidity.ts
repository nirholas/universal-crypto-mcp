/**
 * Raydium Liquidity Operations
 * 
 * Handles liquidity provision and removal for Raydium pools.
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
  RaydiumPoolInfo,
  AddLiquidityParams,
  RemoveLiquidityParams,
  TransactionResult,
  TradingEngineConfig,
} from '../types.js';
import { RAYDIUM_PROGRAM_IDS } from '../types.js';
import { RaydiumAMM } from './amm.js';

/**
 * Liquidity calculation result
 */
export interface LiquidityCalculation {
  /** Base amount to add */
  baseAmount: bigint;
  /** Quote amount to add */
  quoteAmount: bigint;
  /** LP tokens to receive */
  lpTokens: bigint;
  /** Share of pool after adding */
  shareOfPool: number;
}

/**
 * Remove liquidity calculation result
 */
export interface RemoveLiquidityCalculation {
  /** Base amount to receive */
  baseAmount: bigint;
  /** Quote amount to receive */
  quoteAmount: bigint;
  /** Share of pool being removed */
  shareOfPool: number;
}

/**
 * Raydium Liquidity service
 */
export class RaydiumLiquidity {
  private readonly connection: Connection;
  private readonly programId: PublicKey;
  private readonly amm: RaydiumAMM;

  constructor(config: TradingEngineConfig) {
    this.connection = new Connection(config.rpcEndpoint, 'confirmed');
    this.programId = new PublicKey(RAYDIUM_PROGRAM_IDS.AMM_V4);
    this.amm = new RaydiumAMM(config);
  }

  /**
   * Calculate liquidity amounts for adding liquidity
   */
  async calculateAddLiquidity(
    poolId: string,
    baseAmount: bigint,
    quoteAmount: bigint,
    fixedSide: 'base' | 'quote'
  ): Promise<LiquidityCalculation> {
    const poolInfo = await this.amm.getFullPoolInfo(poolId);

    let actualBaseAmount: bigint;
    let actualQuoteAmount: bigint;

    if (poolInfo.baseReserve === 0n || poolInfo.quoteReserve === 0n) {
      // Pool is empty, use provided amounts
      actualBaseAmount = baseAmount;
      actualQuoteAmount = quoteAmount;
    } else if (fixedSide === 'base') {
      // Calculate quote amount based on base amount and pool ratio
      actualBaseAmount = baseAmount;
      actualQuoteAmount = (baseAmount * poolInfo.quoteReserve) / poolInfo.baseReserve;
    } else {
      // Calculate base amount based on quote amount and pool ratio
      actualQuoteAmount = quoteAmount;
      actualBaseAmount = (quoteAmount * poolInfo.baseReserve) / poolInfo.quoteReserve;
    }

    // Calculate LP tokens to receive
    let lpTokens: bigint;
    if (poolInfo.lpSupply === 0n) {
      // Initial liquidity - use geometric mean
      lpTokens = this.sqrt(actualBaseAmount * actualQuoteAmount);
    } else {
      // Proportional to smaller of the two ratios
      const baseRatio = (actualBaseAmount * poolInfo.lpSupply) / poolInfo.baseReserve;
      const quoteRatio = (actualQuoteAmount * poolInfo.lpSupply) / poolInfo.quoteReserve;
      lpTokens = baseRatio < quoteRatio ? baseRatio : quoteRatio;
    }

    // Calculate share of pool
    const newTotalSupply = poolInfo.lpSupply + lpTokens;
    const shareOfPool = newTotalSupply > 0n 
      ? Number(lpTokens * 10000n / newTotalSupply) / 100
      : 100;

    return {
      baseAmount: actualBaseAmount,
      quoteAmount: actualQuoteAmount,
      lpTokens,
      shareOfPool,
    };
  }

  /**
   * Calculate amounts to receive when removing liquidity
   */
  async calculateRemoveLiquidity(
    poolId: string,
    lpAmount: bigint
  ): Promise<RemoveLiquidityCalculation> {
    const poolInfo = await this.amm.getFullPoolInfo(poolId);

    if (poolInfo.lpSupply === 0n) {
      throw new Error('Pool has no liquidity');
    }

    // Calculate proportional amounts
    const baseAmount = (lpAmount * poolInfo.baseReserve) / poolInfo.lpSupply;
    const quoteAmount = (lpAmount * poolInfo.quoteReserve) / poolInfo.lpSupply;
    const shareOfPool = Number(lpAmount * 10000n / poolInfo.lpSupply) / 100;

    return {
      baseAmount,
      quoteAmount,
      shareOfPool,
    };
  }

  /**
   * Build add liquidity instruction
   */
  private buildAddLiquidityInstruction(
    poolInfo: RaydiumPoolInfo,
    params: AddLiquidityParams,
    userAccounts: {
      userBaseToken: PublicKey;
      userQuoteToken: PublicKey;
      userLpToken: PublicKey;
    },
    calculation: LiquidityCalculation
  ): TransactionInstruction {
    const poolPubkey = new PublicKey(poolInfo.id);
    const userPubkey = new PublicKey(params.userPublicKey);

    const keys = [
      { pubkey: TOKEN_PROGRAM_ID, isSigner: false, isWritable: false },
      { pubkey: poolPubkey, isSigner: false, isWritable: true },
      { pubkey: userPubkey, isSigner: true, isWritable: false },
      { pubkey: new PublicKey(poolInfo.baseVault), isSigner: false, isWritable: true },
      { pubkey: new PublicKey(poolInfo.quoteVault), isSigner: false, isWritable: true },
      { pubkey: new PublicKey(poolInfo.lpMint), isSigner: false, isWritable: true },
      { pubkey: userAccounts.userBaseToken, isSigner: false, isWritable: true },
      { pubkey: userAccounts.userQuoteToken, isSigner: false, isWritable: true },
      { pubkey: userAccounts.userLpToken, isSigner: false, isWritable: true },
    ];

    // Add liquidity instruction data
    const data = Buffer.alloc(1 + 8 + 8 + 8);
    data.writeUInt8(3, 0); // Add liquidity instruction
    data.writeBigUInt64LE(calculation.baseAmount, 1);
    data.writeBigUInt64LE(calculation.quoteAmount, 9);
    data.writeBigUInt64LE(calculation.lpTokens, 17);

    return new TransactionInstruction({
      programId: this.programId,
      keys,
      data,
    });
  }

  /**
   * Add liquidity to a pool
   */
  async addLiquidity(
    params: AddLiquidityParams,
    signer: Uint8Array | ((tx: Transaction) => Promise<Transaction>)
  ): Promise<TransactionResult> {
    const poolInfo = await this.amm.getFullPoolInfo(params.poolId);
    const calculation = await this.calculateAddLiquidity(
      params.poolId,
      params.baseAmount,
      params.quoteAmount,
      params.fixedSide
    );

    const userPubkey = new PublicKey(params.userPublicKey);
    const baseMint = new PublicKey(poolInfo.baseMint);
    const quoteMint = new PublicKey(poolInfo.quoteMint);
    const lpMint = new PublicKey(poolInfo.lpMint);

    // Get user token accounts
    const userBaseToken = await getAssociatedTokenAddress(baseMint, userPubkey);
    const userQuoteToken = await getAssociatedTokenAddress(quoteMint, userPubkey);
    const userLpToken = await getAssociatedTokenAddress(lpMint, userPubkey);

    const transaction = new Transaction();

    // Create LP token account if needed
    const lpAtaInfo = await this.connection.getAccountInfo(userLpToken);
    if (!lpAtaInfo) {
      transaction.add(
        createAssociatedTokenAccountInstruction(
          userPubkey,
          userLpToken,
          userPubkey,
          lpMint
        )
      );
    }

    // Add liquidity instruction
    transaction.add(
      this.buildAddLiquidityInstruction(poolInfo, params, {
        userBaseToken,
        userQuoteToken,
        userLpToken,
      }, calculation)
    );

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
      const signature = await this.connection.sendRawTransaction(transaction.serialize());
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
   * Build remove liquidity instruction
   */
  private buildRemoveLiquidityInstruction(
    poolInfo: RaydiumPoolInfo,
    params: RemoveLiquidityParams,
    userAccounts: {
      userBaseToken: PublicKey;
      userQuoteToken: PublicKey;
      userLpToken: PublicKey;
    }
  ): TransactionInstruction {
    const poolPubkey = new PublicKey(poolInfo.id);
    const userPubkey = new PublicKey(params.userPublicKey);

    const keys = [
      { pubkey: TOKEN_PROGRAM_ID, isSigner: false, isWritable: false },
      { pubkey: poolPubkey, isSigner: false, isWritable: true },
      { pubkey: userPubkey, isSigner: true, isWritable: false },
      { pubkey: new PublicKey(poolInfo.baseVault), isSigner: false, isWritable: true },
      { pubkey: new PublicKey(poolInfo.quoteVault), isSigner: false, isWritable: true },
      { pubkey: new PublicKey(poolInfo.lpMint), isSigner: false, isWritable: true },
      { pubkey: userAccounts.userBaseToken, isSigner: false, isWritable: true },
      { pubkey: userAccounts.userQuoteToken, isSigner: false, isWritable: true },
      { pubkey: userAccounts.userLpToken, isSigner: false, isWritable: true },
    ];

    // Remove liquidity instruction data
    const data = Buffer.alloc(1 + 8 + 8 + 8);
    data.writeUInt8(4, 0); // Remove liquidity instruction
    data.writeBigUInt64LE(params.lpAmount, 1);
    data.writeBigUInt64LE(params.minBaseAmount ?? 0n, 9);
    data.writeBigUInt64LE(params.minQuoteAmount ?? 0n, 17);

    return new TransactionInstruction({
      programId: this.programId,
      keys,
      data,
    });
  }

  /**
   * Remove liquidity from a pool
   */
  async removeLiquidity(
    params: RemoveLiquidityParams,
    signer: Uint8Array | ((tx: Transaction) => Promise<Transaction>)
  ): Promise<TransactionResult> {
    const poolInfo = await this.amm.getFullPoolInfo(params.poolId);

    const userPubkey = new PublicKey(params.userPublicKey);
    const baseMint = new PublicKey(poolInfo.baseMint);
    const quoteMint = new PublicKey(poolInfo.quoteMint);
    const lpMint = new PublicKey(poolInfo.lpMint);

    // Get user token accounts
    const userBaseToken = await getAssociatedTokenAddress(baseMint, userPubkey);
    const userQuoteToken = await getAssociatedTokenAddress(quoteMint, userPubkey);
    const userLpToken = await getAssociatedTokenAddress(lpMint, userPubkey);

    const transaction = new Transaction();

    // Create base token account if needed
    const baseAtaInfo = await this.connection.getAccountInfo(userBaseToken);
    if (!baseAtaInfo) {
      transaction.add(
        createAssociatedTokenAccountInstruction(
          userPubkey,
          userBaseToken,
          userPubkey,
          baseMint
        )
      );
    }

    // Create quote token account if needed
    const quoteAtaInfo = await this.connection.getAccountInfo(userQuoteToken);
    if (!quoteAtaInfo) {
      transaction.add(
        createAssociatedTokenAccountInstruction(
          userPubkey,
          userQuoteToken,
          userPubkey,
          quoteMint
        )
      );
    }

    // Remove liquidity instruction
    transaction.add(
      this.buildRemoveLiquidityInstruction(poolInfo, params, {
        userBaseToken,
        userQuoteToken,
        userLpToken,
      })
    );

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
      const signature = await this.connection.sendRawTransaction(transaction.serialize());
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
   * Get user's LP token balance for a pool
   */
  async getUserLpBalance(poolId: string, userPublicKey: string): Promise<bigint> {
    const poolInfo = await this.amm.getPoolInfo(poolId);
    const userPubkey = new PublicKey(userPublicKey);
    const lpMint = new PublicKey(poolInfo.lpMint);
    const userLpToken = await getAssociatedTokenAddress(lpMint, userPubkey);

    try {
      const balance = await this.connection.getTokenAccountBalance(userLpToken);
      return BigInt(balance.value.amount);
    } catch {
      return 0n;
    }
  }

  /**
   * Calculate user's share of pool
   */
  async getUserPoolShare(poolId: string, userPublicKey: string): Promise<{
    lpBalance: bigint;
    sharePercent: number;
    baseValue: bigint;
    quoteValue: bigint;
  }> {
    const poolInfo = await this.amm.getFullPoolInfo(poolId);
    const lpBalance = await this.getUserLpBalance(poolId, userPublicKey);

    if (poolInfo.lpSupply === 0n || lpBalance === 0n) {
      return {
        lpBalance: 0n,
        sharePercent: 0,
        baseValue: 0n,
        quoteValue: 0n,
      };
    }

    const sharePercent = Number(lpBalance * 10000n / poolInfo.lpSupply) / 100;
    const baseValue = (lpBalance * poolInfo.baseReserve) / poolInfo.lpSupply;
    const quoteValue = (lpBalance * poolInfo.quoteReserve) / poolInfo.lpSupply;

    return {
      lpBalance,
      sharePercent,
      baseValue,
      quoteValue,
    };
  }

  /**
   * Integer square root using Newton's method
   */
  private sqrt(value: bigint): bigint {
    if (value < 0n) {
      throw new Error('Square root of negative number');
    }
    if (value < 2n) {
      return value;
    }

    let x = value;
    let y = (x + 1n) / 2n;
    while (y < x) {
      x = y;
      y = (x + value / x) / 2n;
    }
    return x;
  }
}
