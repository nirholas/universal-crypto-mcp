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
  getBondingCurveState,
  isOnBondingCurve,
  calculateBuyAmount,
  calculateSellAmount,
  buildPumpFunCreateInstruction,
  buildPumpFunBuyInstruction,
  buildPumpFunSellInstruction,
  buyOnPumpFun,
  sellOnPumpFun,
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
  TokenLauncherConfig,
} from './types.js';
import { createToken, createTokenWithMetadata } from './token/index.js';
import { getBondingCurveState, buyOnPumpFun, sellOnPumpFun } from './pumpfun/index.js';
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
   * Get PumpFun bonding curve state
   */
  async getBondingCurveState(mint: string): Promise<BondingCurveState | null> {
    return getBondingCurveState(this.connection, mint);
  }
  
  /**
   * Buy tokens on PumpFun
   */
  async buyOnPumpFun(
    mint: string,
    walletId: string,
    solAmount: bigint,
    slippageBps: number = 100
  ): Promise<{ signature: string; tokensReceived: bigint }> {
    const publicKey = await this.walletProvider.getPublicKey(walletId);
    const signTx = async (tx: VersionedTransaction) => {
      return this.walletProvider.signTransaction(walletId, tx);
    };
    
    return buyOnPumpFun(this.connection, mint, publicKey, solAmount, slippageBps, signTx);
  }
  
  /**
   * Sell tokens on PumpFun
   */
  async sellOnPumpFun(
    mint: string,
    walletId: string,
    tokenAmount: bigint,
    slippageBps: number = 100
  ): Promise<{ signature: string; solReceived: bigint }> {
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
