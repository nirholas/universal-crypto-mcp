/**
 * PumpFun Client
 * 
 * Main client for interacting with PumpFun bonding curve tokens.
 */

import {
  Connection,
  PublicKey,
  Transaction,
  TransactionInstruction,
  SystemProgram,
  LAMPORTS_PER_SOL,
} from '@solana/web3.js';
import {
  TOKEN_PROGRAM_ID,
  getAssociatedTokenAddress,
  createAssociatedTokenAccountInstruction,
  ASSOCIATED_TOKEN_PROGRAM_ID,
} from '@solana/spl-token';
import { PumpFunBondingCurve } from './bonding-curve.js';
import { PumpFunMonitor } from './monitor.js';
import type {
  PumpFunTokenInfo,
  BondingCurveState,
  PumpFunBuyParams,
  PumpFunSellParams,
  NewPumpFunToken,
  TransactionResult,
  TradingEngineConfig,
  IPumpFunClient,
} from '../types.js';
import { PUMPFUN_PROGRAM_IDS, KNOWN_TOKENS } from '../types.js';

/**
 * PumpFun API response types
 */
interface PumpFunAPIToken {
  mint: string;
  name: string;
  symbol: string;
  description: string;
  image_uri: string;
  creator: string;
  created_timestamp: number;
  complete: boolean;
  raydium_pool?: string;
  market_cap: number;
  usd_market_cap?: number;
  virtual_sol_reserves?: number;
  virtual_token_reserves?: number;
  total_supply?: number;
  reply_count?: number;
  holder_count?: number;
}

/**
 * PumpFun Client - Full integration with PumpFun DEX
 */
export class PumpFunClient implements IPumpFunClient {
  private readonly connection: Connection;
  private readonly config: TradingEngineConfig;
  private readonly bondingCurve: PumpFunBondingCurve;
  private readonly monitor: PumpFunMonitor;
  private readonly programId: PublicKey;

  // Token info cache
  private tokenCache: Map<string, PumpFunTokenInfo> = new Map();
  private tokenCacheTime: Map<string, number> = new Map();
  private readonly tokenCacheTtlMs = 60_000; // 1 minute

  constructor(config: TradingEngineConfig) {
    this.config = config;
    this.connection = new Connection(config.rpcEndpoint, 'confirmed');
    this.bondingCurve = new PumpFunBondingCurve(config);
    this.monitor = new PumpFunMonitor(config);
    this.programId = new PublicKey(PUMPFUN_PROGRAM_IDS.PROGRAM);
  }

  /**
   * Get token info from PumpFun API and on-chain data
   */
  async getTokenInfo(mint: string): Promise<PumpFunTokenInfo> {
    // Check cache
    const cached = this.tokenCache.get(mint);
    const cacheTime = this.tokenCacheTime.get(mint);
    if (cached && cacheTime && Date.now() - cacheTime < this.tokenCacheTtlMs) {
      return cached;
    }

    // Fetch from API
    const response = await fetch(`https://frontend-api.pump.fun/coins/${mint}`);
    
    if (!response.ok) {
      throw new Error(`Token not found: ${mint}`);
    }

    const data = await response.json() as PumpFunAPIToken;

    // Get on-chain bonding curve state
    let bondingCurveState: BondingCurveState | null = null;
    try {
      bondingCurveState = await this.bondingCurve.getBondingCurveState(mint);
    } catch {
      // Bonding curve might not exist if token is migrated
    }

    const priceInSol = bondingCurveState 
      ? this.bondingCurve.getCurrentPrice(bondingCurveState)
      : 0;

    const marketCapSol = bondingCurveState
      ? this.bondingCurve.getMarketCapSol(bondingCurveState)
      : data.market_cap / LAMPORTS_PER_SOL;

    const tokenInfo: PumpFunTokenInfo = {
      mint: data.mint,
      name: data.name,
      symbol: data.symbol,
      description: data.description,
      imageUri: data.image_uri,
      creator: data.creator,
      createdAt: data.created_timestamp,
      isMigrated: data.complete,
      raydiumPoolId: data.raydium_pool,
      marketCapSol,
      priceInSol,
      holderCount: data.holder_count,
      replyCount: data.reply_count,
    };

    // Update cache
    this.tokenCache.set(mint, tokenInfo);
    this.tokenCacheTime.set(mint, Date.now());

    return tokenInfo;
  }

  /**
   * Get bonding curve state
   */
  async getBondingCurveState(mint: string): Promise<BondingCurveState> {
    return this.bondingCurve.getBondingCurveState(mint);
  }

  /**
   * Check if token is migrated to Raydium
   */
  async isMigrated(mint: string): Promise<boolean> {
    try {
      const state = await this.bondingCurve.getBondingCurveState(mint);
      return state.complete;
    } catch {
      // If bonding curve doesn't exist, token might already be migrated
      const info = await this.getTokenInfo(mint);
      return info.isMigrated;
    }
  }

  /**
   * Buy tokens with SOL
   */
  async buy(params: PumpFunBuyParams): Promise<TransactionResult> {
    throw new Error('buy requires a signer. Use buyWithSigner instead.');
  }

  /**
   * Buy tokens with signer
   */
  async buyWithSigner(
    params: PumpFunBuyParams,
    signer: Uint8Array | ((tx: Transaction) => Promise<Transaction>)
  ): Promise<TransactionResult> {
    // Check if migrated
    const isMigrated = await this.isMigrated(params.mint);
    if (isMigrated) {
      throw new Error('Token is migrated to Raydium. Use Raydium or Jupiter for trading.');
    }

    const userPubkey = new PublicKey(params.userPublicKey);
    const mint = new PublicKey(params.mint);
    
    // Get bonding curve PDAs
    const bondingCurve = this.bondingCurve.getBondingCurvePDA(params.mint);
    const associatedBondingCurve = this.bondingCurve.getAssociatedBondingCurvePDA(
      params.mint,
      bondingCurve
    );

    // Get user token account
    const userTokenAccount = await getAssociatedTokenAddress(mint, userPubkey);

    // Calculate expected output
    const state = await this.bondingCurve.getBondingCurveState(params.mint);
    const output = this.bondingCurve.calculateBuyOutput(state, params.solAmount);

    // Apply slippage
    const slippageBps = params.slippageBps ?? 100;
    const minTokenAmount = params.minTokenAmount ??
      (output.tokenAmount * (10000n - BigInt(slippageBps))) / 10000n;

    const transaction = new Transaction();

    // Create user token account if needed
    const userAtaInfo = await this.connection.getAccountInfo(userTokenAccount);
    if (!userAtaInfo) {
      transaction.add(
        createAssociatedTokenAccountInstruction(
          userPubkey,
          userTokenAccount,
          userPubkey,
          mint
        )
      );
    }

    // Build buy instruction
    const buyIx = this.buildBuyInstruction(
      userPubkey,
      mint,
      bondingCurve,
      associatedBondingCurve,
      userTokenAccount,
      params.solAmount,
      minTokenAmount
    );
    transaction.add(buyIx);

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
   * Build buy instruction
   */
  private buildBuyInstruction(
    user: PublicKey,
    mint: PublicKey,
    bondingCurve: PublicKey,
    associatedBondingCurve: PublicKey,
    userTokenAccount: PublicKey,
    solAmount: bigint,
    minTokenAmount: bigint
  ): TransactionInstruction {
    const keys = [
      { pubkey: new PublicKey(PUMPFUN_PROGRAM_IDS.GLOBAL), isSigner: false, isWritable: false },
      { pubkey: new PublicKey(PUMPFUN_PROGRAM_IDS.FEE_RECIPIENT), isSigner: false, isWritable: true },
      { pubkey: mint, isSigner: false, isWritable: false },
      { pubkey: bondingCurve, isSigner: false, isWritable: true },
      { pubkey: associatedBondingCurve, isSigner: false, isWritable: true },
      { pubkey: userTokenAccount, isSigner: false, isWritable: true },
      { pubkey: user, isSigner: true, isWritable: true },
      { pubkey: SystemProgram.programId, isSigner: false, isWritable: false },
      { pubkey: TOKEN_PROGRAM_ID, isSigner: false, isWritable: false },
      { pubkey: ASSOCIATED_TOKEN_PROGRAM_ID, isSigner: false, isWritable: false },
      { pubkey: new PublicKey(PUMPFUN_PROGRAM_IDS.EVENT_AUTHORITY), isSigner: false, isWritable: false },
      { pubkey: this.programId, isSigner: false, isWritable: false },
    ];

    // Buy instruction data: [discriminator (8)] [amount (8)] [max_sol_cost (8)]
    const data = Buffer.alloc(8 + 8 + 8);
    
    // Buy discriminator
    const discriminator = Buffer.from([102, 6, 61, 18, 1, 218, 235, 234]);
    discriminator.copy(data, 0);
    
    data.writeBigUInt64LE(minTokenAmount, 8);
    data.writeBigUInt64LE(solAmount, 16);

    return new TransactionInstruction({
      programId: this.programId,
      keys,
      data,
    });
  }

  /**
   * Sell tokens for SOL
   */
  async sell(params: PumpFunSellParams): Promise<TransactionResult> {
    throw new Error('sell requires a signer. Use sellWithSigner instead.');
  }

  /**
   * Sell tokens with signer
   */
  async sellWithSigner(
    params: PumpFunSellParams,
    signer: Uint8Array | ((tx: Transaction) => Promise<Transaction>)
  ): Promise<TransactionResult> {
    // Check if migrated
    const isMigrated = await this.isMigrated(params.mint);
    if (isMigrated) {
      throw new Error('Token is migrated to Raydium. Use Raydium or Jupiter for trading.');
    }

    const userPubkey = new PublicKey(params.userPublicKey);
    const mint = new PublicKey(params.mint);
    
    // Get bonding curve PDAs
    const bondingCurve = this.bondingCurve.getBondingCurvePDA(params.mint);
    const associatedBondingCurve = this.bondingCurve.getAssociatedBondingCurvePDA(
      params.mint,
      bondingCurve
    );

    // Get user token account
    const userTokenAccount = await getAssociatedTokenAddress(mint, userPubkey);

    // Calculate expected output
    const state = await this.bondingCurve.getBondingCurveState(params.mint);
    const output = this.bondingCurve.calculateSellOutput(state, params.tokenAmount);

    // Apply slippage
    const slippageBps = params.slippageBps ?? 100;
    const minSolAmount = params.minSolAmount ??
      (output.solAmount * (10000n - BigInt(slippageBps))) / 10000n;

    const transaction = new Transaction();

    // Build sell instruction
    const sellIx = this.buildSellInstruction(
      userPubkey,
      mint,
      bondingCurve,
      associatedBondingCurve,
      userTokenAccount,
      params.tokenAmount,
      minSolAmount
    );
    transaction.add(sellIx);

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
   * Build sell instruction
   */
  private buildSellInstruction(
    user: PublicKey,
    mint: PublicKey,
    bondingCurve: PublicKey,
    associatedBondingCurve: PublicKey,
    userTokenAccount: PublicKey,
    tokenAmount: bigint,
    minSolAmount: bigint
  ): TransactionInstruction {
    const keys = [
      { pubkey: new PublicKey(PUMPFUN_PROGRAM_IDS.GLOBAL), isSigner: false, isWritable: false },
      { pubkey: new PublicKey(PUMPFUN_PROGRAM_IDS.FEE_RECIPIENT), isSigner: false, isWritable: true },
      { pubkey: mint, isSigner: false, isWritable: false },
      { pubkey: bondingCurve, isSigner: false, isWritable: true },
      { pubkey: associatedBondingCurve, isSigner: false, isWritable: true },
      { pubkey: userTokenAccount, isSigner: false, isWritable: true },
      { pubkey: user, isSigner: true, isWritable: true },
      { pubkey: SystemProgram.programId, isSigner: false, isWritable: false },
      { pubkey: TOKEN_PROGRAM_ID, isSigner: false, isWritable: false },
      { pubkey: new PublicKey(PUMPFUN_PROGRAM_IDS.EVENT_AUTHORITY), isSigner: false, isWritable: false },
      { pubkey: this.programId, isSigner: false, isWritable: false },
    ];

    // Sell instruction data: [discriminator (8)] [amount (8)] [min_sol_output (8)]
    const data = Buffer.alloc(8 + 8 + 8);
    
    // Sell discriminator
    const discriminator = Buffer.from([51, 230, 133, 164, 1, 127, 131, 173]);
    discriminator.copy(data, 0);
    
    data.writeBigUInt64LE(tokenAmount, 8);
    data.writeBigUInt64LE(minSolAmount, 16);

    return new TransactionInstruction({
      programId: this.programId,
      keys,
      data,
    });
  }

  /**
   * Subscribe to new token launches
   */
  subscribeToNewTokens(callback: (token: NewPumpFunToken) => void): () => void {
    return this.monitor.subscribeToNewTokens(callback);
  }

  /**
   * Get recent token launches
   */
  async getRecentTokens(limit: number = 50): Promise<NewPumpFunToken[]> {
    return this.monitor.getRecentTokens(limit);
  }

  /**
   * Calculate buy output
   */
  async calculateBuyOutput(
    mint: string,
    solAmount: bigint
  ): Promise<{
    tokenAmount: bigint;
    fee: bigint;
    newPrice: number;
    priceImpact: number;
  }> {
    const state = await this.bondingCurve.getBondingCurveState(mint);
    return this.bondingCurve.calculateBuyOutput(state, solAmount);
  }

  /**
   * Calculate sell output
   */
  async calculateSellOutput(
    mint: string,
    tokenAmount: bigint
  ): Promise<{
    solAmount: bigint;
    fee: bigint;
    newPrice: number;
    priceImpact: number;
  }> {
    const state = await this.bondingCurve.getBondingCurveState(mint);
    return this.bondingCurve.calculateSellOutput(state, tokenAmount);
  }

  /**
   * Get current price
   */
  async getCurrentPrice(mint: string): Promise<number> {
    const state = await this.bondingCurve.getBondingCurveState(mint);
    return this.bondingCurve.getCurrentPrice(state);
  }

  /**
   * Get market cap in SOL
   */
  async getMarketCapSol(mint: string): Promise<number> {
    const state = await this.bondingCurve.getBondingCurveState(mint);
    return this.bondingCurve.getMarketCapSol(state);
  }

  /**
   * Get migration progress
   */
  async getMigrationProgress(mint: string): Promise<number> {
    const state = await this.bondingCurve.getBondingCurveState(mint);
    return this.bondingCurve.getMigrationProgress(state);
  }

  /**
   * Get connection instance
   */
  getConnection(): Connection {
    return this.connection;
  }

  /**
   * Clear token cache
   */
  clearCache(): void {
    this.tokenCache.clear();
    this.tokenCacheTime.clear();
  }

  /**
   * Clean up resources
   */
  async dispose(): Promise<void> {
    await this.monitor.dispose();
    this.clearCache();
  }
}
