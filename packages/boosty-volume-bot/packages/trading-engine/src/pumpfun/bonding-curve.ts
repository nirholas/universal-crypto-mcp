/**
 * PumpFun Bonding Curve Integration
 * 
 * Handles bonding curve calculations and state decoding for PumpFun tokens.
 */

import {
  Connection,
  PublicKey,
} from '@solana/web3.js';
import type {
  BondingCurveState,
  TradingEngineConfig,
} from '../types.js';
import { PUMPFUN_PROGRAM_IDS } from '../types.js';

/**
 * Bonding curve account layout offsets
 */
const BONDING_CURVE_LAYOUT = {
  DISCRIMINATOR: 0,
  VIRTUAL_TOKEN_RESERVES: 8,
  VIRTUAL_SOL_RESERVES: 16,
  REAL_TOKEN_RESERVES: 24,
  REAL_SOL_RESERVES: 32,
  TOKEN_TOTAL_SUPPLY: 40,
  COMPLETE: 48,
};

/**
 * PumpFun constants
 */
const PUMPFUN_CONSTANTS = {
  INITIAL_VIRTUAL_TOKEN_RESERVES: 1_073_000_000_000_000n, // 1.073B tokens
  INITIAL_VIRTUAL_SOL_RESERVES: 30_000_000_000n, // 30 SOL
  TOTAL_SUPPLY: 1_000_000_000_000_000n, // 1B tokens (6 decimals)
  MIGRATION_THRESHOLD_SOL: 85_000_000_000n, // ~85 SOL triggers migration
  TOKEN_DECIMALS: 6,
  FEE_BPS: 100, // 1% fee
};

/**
 * PumpFun Bonding Curve service
 */
export class PumpFunBondingCurve {
  private readonly connection: Connection;
  private readonly programId: PublicKey;

  constructor(config: TradingEngineConfig) {
    this.connection = new Connection(config.rpcEndpoint, 'confirmed');
    this.programId = new PublicKey(PUMPFUN_PROGRAM_IDS.PROGRAM);
  }

  /**
   * Get bonding curve PDA for a token
   */
  getBondingCurvePDA(mint: string): PublicKey {
    const [bondingCurve] = PublicKey.findProgramAddressSync(
      [
        Buffer.from('bonding-curve'),
        new PublicKey(mint).toBuffer(),
      ],
      this.programId
    );
    return bondingCurve;
  }

  /**
   * Get associated bonding curve (token account for the bonding curve)
   */
  getAssociatedBondingCurvePDA(mint: string, bondingCurve: PublicKey): PublicKey {
    const [associatedBondingCurve] = PublicKey.findProgramAddressSync(
      [
        bondingCurve.toBuffer(),
        new PublicKey('TokenkegQfeZyiNwAJbNbGKPFXCWuBvf9Ss623VQ5DA').toBuffer(),
        new PublicKey(mint).toBuffer(),
      ],
      new PublicKey('ATokenGPvbdGVxr1b2hvZbsiqW5xWH25efTNsLJA8knL')
    );
    return associatedBondingCurve;
  }

  /**
   * Get bonding curve state for a token
   */
  async getBondingCurveState(mint: string): Promise<BondingCurveState> {
    const bondingCurve = this.getBondingCurvePDA(mint);
    const accountInfo = await this.connection.getAccountInfo(bondingCurve);

    if (!accountInfo) {
      throw new Error(`Bonding curve not found for mint: ${mint}`);
    }

    return this.decodeBondingCurveState(bondingCurve.toBase58(), mint, accountInfo.data);
  }

  /**
   * Decode bonding curve account data
   */
  private decodeBondingCurveState(address: string, mint: string, data: Buffer): BondingCurveState {
    const virtualTokenReserves = data.readBigUInt64LE(BONDING_CURVE_LAYOUT.VIRTUAL_TOKEN_RESERVES);
    const virtualSolReserves = data.readBigUInt64LE(BONDING_CURVE_LAYOUT.VIRTUAL_SOL_RESERVES);
    const realTokenReserves = data.readBigUInt64LE(BONDING_CURVE_LAYOUT.REAL_TOKEN_RESERVES);
    const realSolReserves = data.readBigUInt64LE(BONDING_CURVE_LAYOUT.REAL_SOL_RESERVES);
    const tokenTotalSupply = data.readBigUInt64LE(BONDING_CURVE_LAYOUT.TOKEN_TOTAL_SUPPLY);
    const complete = data.readUInt8(BONDING_CURVE_LAYOUT.COMPLETE) === 1;

    // Calculate migration progress (0-100)
    // Migration threshold is typically 85 SOL
    const MIGRATION_THRESHOLD = 85n * BigInt(1e9); // 85 SOL in lamports
    const migrationProgress = complete ? 100 : Math.min(100, Number((realSolReserves * 100n) / MIGRATION_THRESHOLD));

    return {
      address,
      mint,
      virtualSolReserves,
      virtualTokenReserves,
      realSolReserves,
      realTokenReserves,
      tokenTotalSupply,
      complete,
      migrationProgress,
    };
  }

  /**
   * Calculate buy output (SOL -> Token)
   */
  calculateBuyOutput(
    state: BondingCurveState,
    solAmount: bigint
  ): {
    tokenAmount: bigint;
    fee: bigint;
    newPrice: number;
    priceImpact: number;
  } {
    // Apply fee
    const fee = (solAmount * BigInt(PUMPFUN_CONSTANTS.FEE_BPS)) / 10000n;
    const solAmountAfterFee = solAmount - fee;

    // Constant product: k = virtualSol * virtualToken
    // newVirtualSol = virtualSol + solAmountAfterFee
    // newVirtualToken = k / newVirtualSol
    // tokenAmount = virtualToken - newVirtualToken

    const k = state.virtualSolReserves * state.virtualTokenReserves;
    const newVirtualSol = state.virtualSolReserves + solAmountAfterFee;
    const newVirtualToken = k / newVirtualSol;
    const tokenAmount = state.virtualTokenReserves - newVirtualToken;

    // Calculate price before and after
    const priceBefore = Number(state.virtualSolReserves) / Number(state.virtualTokenReserves);
    const priceAfter = Number(newVirtualSol) / Number(newVirtualToken);
    const priceImpact = ((priceAfter - priceBefore) / priceBefore) * 100;

    return {
      tokenAmount,
      fee,
      newPrice: priceAfter * Math.pow(10, 9 - PUMPFUN_CONSTANTS.TOKEN_DECIMALS), // SOL per token
      priceImpact,
    };
  }

  /**
   * Calculate sell output (Token -> SOL)
   */
  calculateSellOutput(
    state: BondingCurveState,
    tokenAmount: bigint
  ): {
    solAmount: bigint;
    fee: bigint;
    newPrice: number;
    priceImpact: number;
  } {
    // Constant product: k = virtualSol * virtualToken
    // newVirtualToken = virtualToken + tokenAmount
    // newVirtualSol = k / newVirtualToken
    // solAmountBeforeFee = virtualSol - newVirtualSol

    const k = state.virtualSolReserves * state.virtualTokenReserves;
    const newVirtualToken = state.virtualTokenReserves + tokenAmount;
    const newVirtualSol = k / newVirtualToken;
    const solAmountBeforeFee = state.virtualSolReserves - newVirtualSol;

    // Apply fee
    const fee = (solAmountBeforeFee * BigInt(PUMPFUN_CONSTANTS.FEE_BPS)) / 10000n;
    const solAmount = solAmountBeforeFee - fee;

    // Calculate price before and after
    const priceBefore = Number(state.virtualSolReserves) / Number(state.virtualTokenReserves);
    const priceAfter = Number(newVirtualSol) / Number(newVirtualToken);
    const priceImpact = ((priceBefore - priceAfter) / priceBefore) * 100;

    return {
      solAmount,
      fee,
      newPrice: priceAfter * Math.pow(10, 9 - PUMPFUN_CONSTANTS.TOKEN_DECIMALS),
      priceImpact,
    };
  }

  /**
   * Calculate required SOL for desired token amount
   */
  calculateRequiredSolForTokens(
    state: BondingCurveState,
    tokenAmount: bigint
  ): {
    solRequired: bigint;
    fee: bigint;
  } {
    // Inverse of buy calculation
    const k = state.virtualSolReserves * state.virtualTokenReserves;
    const newVirtualToken = state.virtualTokenReserves - tokenAmount;
    const newVirtualSol = k / newVirtualToken;
    const solAmountAfterFee = newVirtualSol - state.virtualSolReserves;

    // Add fee back
    const solRequired = (solAmountAfterFee * 10000n) / (10000n - BigInt(PUMPFUN_CONSTANTS.FEE_BPS));
    const fee = solRequired - solAmountAfterFee;

    return { solRequired, fee };
  }

  /**
   * Get current token price in SOL
   */
  getCurrentPrice(state: BondingCurveState): number {
    // Price = virtualSolReserves / virtualTokenReserves
    const priceRaw = Number(state.virtualSolReserves) / Number(state.virtualTokenReserves);
    // Adjust for decimals (SOL has 9, token has 6)
    return priceRaw * Math.pow(10, 9 - PUMPFUN_CONSTANTS.TOKEN_DECIMALS);
  }

  /**
   * Get market cap in SOL
   */
  getMarketCapSol(state: BondingCurveState): number {
    const price = this.getCurrentPrice(state);
    const totalSupply = Number(state.tokenTotalSupply) / Math.pow(10, PUMPFUN_CONSTANTS.TOKEN_DECIMALS);
    return price * totalSupply;
  }

  /**
   * Check if token is ready for migration
   */
  isMigrationReady(state: BondingCurveState): boolean {
    return state.realSolReserves >= PUMPFUN_CONSTANTS.MIGRATION_THRESHOLD_SOL;
  }

  /**
   * Calculate progress to migration (0-100%)
   */
  getMigrationProgress(state: BondingCurveState): number {
    return Math.min(
      100,
      (Number(state.realSolReserves) / Number(PUMPFUN_CONSTANTS.MIGRATION_THRESHOLD_SOL)) * 100
    );
  }

  /**
   * Check if bonding curve is complete (migrated)
   */
  isComplete(state: BondingCurveState): boolean {
    return state.complete;
  }

  /**
   * Get bonding curve statistics
   */
  async getStatistics(mint: string): Promise<{
    currentPrice: number;
    marketCapSol: number;
    virtualSolReserves: string;
    virtualTokenReserves: string;
    realSolReserves: string;
    realTokenReserves: string;
    migrationProgress: number;
    isComplete: boolean;
    totalSupply: string;
  }> {
    const state = await this.getBondingCurveState(mint);

    return {
      currentPrice: this.getCurrentPrice(state),
      marketCapSol: this.getMarketCapSol(state),
      virtualSolReserves: (Number(state.virtualSolReserves) / 1e9).toFixed(4),
      virtualTokenReserves: (Number(state.virtualTokenReserves) / 1e6).toFixed(0),
      realSolReserves: (Number(state.realSolReserves) / 1e9).toFixed(4),
      realTokenReserves: (Number(state.realTokenReserves) / 1e6).toFixed(0),
      migrationProgress: this.getMigrationProgress(state),
      isComplete: state.complete,
      totalSupply: (Number(state.tokenTotalSupply) / 1e6).toFixed(0),
    };
  }
}
