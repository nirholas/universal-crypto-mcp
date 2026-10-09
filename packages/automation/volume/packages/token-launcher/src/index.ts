/**
 * Token Launcher
 * Complete token creation, LP deployment, and launch sniping for Solana
 *
 * @packageDocumentation
 */

// =============================================================================
// Types
// =============================================================================

export type {
  CreateTokenParams,
  CreateTokenWithMetadataParams,
  CreateTokenResult,
  DEXType,
  CreateRaydiumPoolParams,
  CreateMeteoraPoolParams,
  CreatePoolResult,
  CreatePumpFunTokenParams,
  PumpFunTokenResult,
  PumpFunVenue,
  BondingCurveState,
  BundledLaunchParams,
  BundledLaunchResult,
  SnipeLaunchParams,
  SnipeResult,
  TokenInfo,
  TokenLauncherConfig,
} from './types.js';

export {
  TokenLaunchErrorCode,
  TokenLaunchError,
  CONSTANTS,
} from './types.js';

// =============================================================================
// Token Creation
// =============================================================================

export {
  buildCreateTokenInstructions,
  createToken,
  createTokenWithMetadata,
} from './token/index.js';

// =============================================================================
// PumpFun Integration
// =============================================================================

export {
  deriveBondingCurve,
  deriveAssociatedBondingCurve,
  fetchPumpFunCurve,
  getBondingCurveState,
  isOnBondingCurve,
  calculateBuyAmount,
  calculateSellAmount,
  buildPumpFunCreateInstructions,
  buildPumpFunBuyInstructions,
  buildPumpFunSellInstructions,
  buildPumpFunBuyTransaction,
  buyOnPumpFun,
  sellOnPumpFun,
  createPumpFunToken,
  findPumpSwapPool,
  buildPumpSwapBuyInstructions,
  buildPumpSwapSellInstructions,
} from './pumpfun/index.js';

export type {
  PumpFunCurve,
  PumpFunTradeInstructions,
  PumpFunCreateInstructionsParams,
} from './pumpfun/index.js';

// =============================================================================
// Pool Creation
// =============================================================================

export {
  // Raydium
  deriveAmmPoolAddress,
  deriveCpmmPoolAddress,
  getPoolInfo,
  findPoolsForPair,
  estimatePoolCreationCost,
  buildCpmmPoolInstructions,
  createRaydiumPool,
  calculateInitialPrice,
  
  // Meteora
  deriveDlmmPoolAddress,
  getDlmmPoolInfo,
  findDlmmPools,
  createMeteoraPool,
  binIdToPrice,
  priceToBinId,
} from './pools/index.js';

// =============================================================================
// Sniping
// =============================================================================

export {
  snipeLaunch,
  snipeWithJitoBundle,
} from './snipe/index.js';

// =============================================================================
// Utilities
// =============================================================================

export { logger } from './utils/logger.js';

// =============================================================================
// Token Launcher Class (Facade)
// =============================================================================

import { Connection, PublicKey, VersionedTransaction } from '@solana/web3.js';
import type {
  CreateTokenParams,
  CreateTokenWithMetadataParams,
  CreateTokenResult,
  SnipeLaunchParams,
  SnipeResult,
  BondingCurveState,
  CreatePumpFunTokenParams,
  PumpFunTokenResult,
  TokenLauncherConfig,
} from './types.js';
import { createToken, createTokenWithMetadata } from './token/index.js';
import {
  getBondingCurveState,
  buyOnPumpFun,
  sellOnPumpFun,
  createPumpFunToken,
} from './pumpfun/index.js';
import { snipeLaunch } from './snipe/index.js';
import { logger } from './utils/logger.js';

export interface WalletProvider {
  getPublicKey(walletId: string): Promise<PublicKey>;
  signTransaction(walletId: string, tx: VersionedTransaction): Promise<VersionedTransaction>;
}

/**
 * Token Launcher - Main facade class
 */
export class TokenLauncher {
  private connection: Connection;
  private walletProvider: WalletProvider;
  
  constructor(config: TokenLauncherConfig, walletProvider: WalletProvider) {
    this.connection = new Connection(config.rpcUrl, {
      commitment: config.commitment || 'confirmed',
    });
    this.walletProvider = walletProvider;
    
    logger.info('TokenLauncher initialized', { rpcUrl: config.rpcUrl });
  }
  
  /**
   * Create a new SPL token
   */
  async createToken(params: CreateTokenParams): Promise<CreateTokenResult> {
    const signTx = async (tx: VersionedTransaction) => {
      return this.walletProvider.signTransaction(params.walletId, tx);
    };
    
    return createToken(this.connection, params, signTx);
  }
  
  /**
   * Create token with metadata
   */
  async createTokenWithMetadata(
    params: CreateTokenWithMetadataParams,
    uploadMetadata: (metadata: Record<string, unknown>) => Promise<string>
  ): Promise<CreateTokenResult> {
    const signTx = async (tx: VersionedTransaction) => {
      return this.walletProvider.signTransaction(params.walletId, tx);
    };
    
    return createTokenWithMetadata(this.connection, params, signTx, uploadMetadata);
  }
  
  /**
   * Get PumpFun bonding curve state, including where the coin trades now
   * (`venue`: curve, completed, pumpswap or raydium)
   */
  async getBondingCurveState(mint: string): Promise<BondingCurveState | null> {
    return getBondingCurveState(this.connection, mint);
  }
  
  /**
   * Create a pump coin with `create_v2` (Token-2022), optionally with the
   * creator's first buy in the same transaction
   */
  async createPumpFunToken(
    params: CreatePumpFunTokenParams,
    uploadMetadata: (metadata: Record<string, unknown>) => Promise<string>
  ): Promise<PumpFunTokenResult> {
    const publicKey = await this.walletProvider.getPublicKey(params.walletId);
    const signTx = async (tx: VersionedTransaction) => {
      return this.walletProvider.signTransaction(params.walletId, tx);
    };
    
    return createPumpFunToken(this.connection, params, publicKey, signTx, uploadMetadata);
  }
  
  /**
   * Buy a pump coin spending `quoteAmount` base units of its quote mint
   * (lamports for SOL-paired coins), on its curve or its PumpSwap pool
   */
  async buyOnPumpFun(
    mint: string,
    walletId: string,
    quoteAmount: bigint,
    slippageBps: number = 100
  ): Promise<{ signature: string; tokensReceived: bigint; venue: 'curve' | 'pumpswap' }> {
    const publicKey = await this.walletProvider.getPublicKey(walletId);
    const signTx = async (tx: VersionedTransaction) => {
      return this.walletProvider.signTransaction(walletId, tx);
    };
    
    return buyOnPumpFun(this.connection, mint, publicKey, quoteAmount, slippageBps, signTx);
  }
  
  /**
   * Sell `tokenAmount` base units of a pump coin for its quote mint, on its
   * curve or its PumpSwap pool
   */
  async sellOnPumpFun(
    mint: string,
    walletId: string,
    tokenAmount: bigint,
    slippageBps: number = 100
  ): Promise<{ signature: string; quoteReceived: bigint; venue: 'curve' | 'pumpswap' }> {
    const publicKey = await this.walletProvider.getPublicKey(walletId);
    const signTx = async (tx: VersionedTransaction) => {
      return this.walletProvider.signTransaction(walletId, tx);
    };
    
    return sellOnPumpFun(this.connection, mint, publicKey, tokenAmount, slippageBps, signTx);
  }
  
  /**
   * Snipe a token launch
   */
  async snipeLaunch(params: SnipeLaunchParams): Promise<SnipeResult> {
    const getWalletKeypair = async (walletId: string) => {
      const publicKey = await this.walletProvider.getPublicKey(walletId);
      return {
        publicKey,
        signTransaction: async (tx: VersionedTransaction) => {
          return this.walletProvider.signTransaction(walletId, tx);
        },
      };
    };
    
    return snipeLaunch(this.connection, params, getWalletKeypair);
  }
  
  /**
   * Get Solana connection
   */
  getConnection(): Connection {
    return this.connection;
  }
}
