import {
  PublicKey,
  Transaction,
  TransactionInstruction,
  SystemProgram,
  SYSVAR_RENT_PUBKEY,
  ComputeBudgetProgram,
} from '@solana/web3.js';
import { TOKEN_PROGRAM_ID, ASSOCIATED_TOKEN_PROGRAM_ID } from '@solana/spl-token';
import type { SolanaClient } from './solana-client';
import type { PumpFunToken } from './types';
import axios from 'axios';

const PUMP_FUN_PROGRAM = new PublicKey('6EF8rrecthR5Dkzon8Nwu78hRvfCKubJ14M5uBEwF6P');
const PUMP_FUN_GLOBAL = new PublicKey('4wTV1YmiEkRvAtNtsSGPtUrqRYQMe5SKy2uB4Jjaxnjf');
const PUMP_FUN_EVENT_AUTHORITY = new PublicKey('Ce6TQqeHC9p8KetsN6JsjHK7UTZk7nasjjnr7XxXp9F1');
const PUMP_FUN_FEE = new PublicKey('CebN5WGQ4jvEPvsVU4EoHEpgzq1VV7AbicfhtW4xC9iM');

export class PumpFunClient {
  private solana: SolanaClient;
  private apiUrl = 'https://frontend-api.pump.fun';

  constructor(solanaClient: SolanaClient) {
    this.solana = solanaClient;
  }

  async getNewTokens(limit: number = 50): Promise<PumpFunToken[]> {
    try {
      const response = await axios.get(`${this.apiUrl}/coins/latest`, {
        params: { limit, offset: 0 },
      });
      return response.data;
    } catch (error) {
      console.error('Error fetching new tokens:', error);
      return [];
    }
  }

  async getTrendingTokens(): Promise<PumpFunToken[]> {
    try {
      const response = await axios.get(`${this.apiUrl}/coins/trending`);
      return response.data;
    } catch (error) {
      console.error('Error fetching trending tokens:', error);
      return [];
    }
  }

  async getTokenInfo(mint: string): Promise<PumpFunToken | null> {
    try {
      const response = await axios.get(`${this.apiUrl}/coins/${mint}`);
      return response.data;
    } catch (error) {
      console.error('Error fetching token info:', error);
      return null;
    }
  }

  async getBondingCurvePrice(mint: PublicKey): Promise<number> {
    try {
      const response = await axios.get(`${this.apiUrl}/coins/${mint.toBase58()}`);
      return response.data.price || 0;
    } catch (error) {
      return 0;
    }
  }

  async buy(
    mint: PublicKey,
    solAmount: number,
    slippage: number = 5
  ): Promise<string> {
    const bondingCurve = await this.getBondingCurvePDA(mint);
    const associatedBondingCurve = await this.getAssociatedBondingCurvePDA(
      mint,
      bondingCurve
    );

    const userTokenAccount = await this.solana.getOrCreateTokenAccount(mint);

    const buyIx = await this.createBuyInstruction(
      mint,
      bondingCurve,
      associatedBondingCurve,
      userTokenAccount,
      solAmount,
      slippage
    );

    const priorityFee = ComputeBudgetProgram.setComputeUnitPrice({
      microLamports: await this.solana.getRecentPriorityFee(),
    });

    const computeLimit = ComputeBudgetProgram.setComputeUnitLimit({
      units: 100000,
    });

    const transaction = new Transaction().add(priorityFee, computeLimit, buyIx);

    return await this.solana.sendTransaction(transaction, {
      skipPreflight: false,
    });
  }

  async sell(
    mint: PublicKey,
    tokenAmount: number,
    slippage: number = 5
  ): Promise<string> {
    const bondingCurve = await this.getBondingCurvePDA(mint);
    const associatedBondingCurve = await this.getAssociatedBondingCurvePDA(
      mint,
      bondingCurve
    );

    const userTokenAccount = await this.solana.getOrCreateTokenAccount(mint);

    const sellIx = await this.createSellInstruction(
      mint,
      bondingCurve,
      associatedBondingCurve,
      userTokenAccount,
      tokenAmount,
      slippage
    );

    const priorityFee = ComputeBudgetProgram.setComputeUnitPrice({
      microLamports: await this.solana.getRecentPriorityFee(),
    });

    const computeLimit = ComputeBudgetProgram.setComputeUnitLimit({
      units: 100000,
    });

    const transaction = new Transaction().add(priorityFee, computeLimit, sellIx);

    return await this.solana.sendTransaction(transaction, {
      skipPreflight: false,
    });
  }

  private async createBuyInstruction(
    mint: PublicKey,
    bondingCurve: PublicKey,
    associatedBondingCurve: PublicKey,
    userTokenAccount: PublicKey,
    solAmount: number,
    slippage: number
  ): Promise<TransactionInstruction> {
    const lamports = Math.floor(solAmount * 1e9);
    const minTokensOut = 0; // Calculate based on bonding curve

    const keys = [
      { pubkey: PUMP_FUN_GLOBAL, isSigner: false, isWritable: false },
      { pubkey: PUMP_FUN_FEE, isSigner: false, isWritable: true },
      { pubkey: mint, isSigner: false, isWritable: false },
      { pubkey: bondingCurve, isSigner: false, isWritable: true },
      { pubkey: associatedBondingCurve, isSigner: false, isWritable: true },
      { pubkey: userTokenAccount, isSigner: false, isWritable: true },
      { pubkey: this.solana.getPublicKey(), isSigner: true, isWritable: true },
      { pubkey: SystemProgram.programId, isSigner: false, isWritable: false },
      { pubkey: TOKEN_PROGRAM_ID, isSigner: false, isWritable: false },
      { pubkey: SYSVAR_RENT_PUBKEY, isSigner: false, isWritable: false },
      { pubkey: PUMP_FUN_EVENT_AUTHORITY, isSigner: false, isWritable: false },
      { pubkey: PUMP_FUN_PROGRAM, isSigner: false, isWritable: false },
    ];

    // Buy instruction discriminator
    const data = Buffer.alloc(24);
    data.writeUInt8(0x66, 0); // Buy discriminator
    data.writeBigUInt64LE(BigInt(lamports), 8);
    data.writeBigUInt64LE(BigInt(minTokensOut), 16);

    return new TransactionInstruction({
      keys,
      programId: PUMP_FUN_PROGRAM,
      data,
    });
  }

  private async createSellInstruction(
    mint: PublicKey,
    bondingCurve: PublicKey,
    associatedBondingCurve: PublicKey,
    userTokenAccount: PublicKey,
    tokenAmount: number,
    slippage: number
  ): Promise<TransactionInstruction> {
    const tokenInfo = await this.solana.getTokenInfo(mint);
    const amount = Math.floor(tokenAmount * Math.pow(10, tokenInfo.decimals));
    const minSolOut = 0; // Calculate based on bonding curve

    const keys = [
      { pubkey: PUMP_FUN_GLOBAL, isSigner: false, isWritable: false },
      { pubkey: PUMP_FUN_FEE, isSigner: false, isWritable: true },
      { pubkey: mint, isSigner: false, isWritable: false },
      { pubkey: bondingCurve, isSigner: false, isWritable: true },
      { pubkey: associatedBondingCurve, isSigner: false, isWritable: true },
      { pubkey: userTokenAccount, isSigner: false, isWritable: true },
      { pubkey: this.solana.getPublicKey(), isSigner: true, isWritable: true },
      { pubkey: SystemProgram.programId, isSigner: false, isWritable: false },
      { pubkey: TOKEN_PROGRAM_ID, isSigner: false, isWritable: false },
      { pubkey: ASSOCIATED_TOKEN_PROGRAM_ID, isSigner: false, isWritable: false },
      { pubkey: PUMP_FUN_EVENT_AUTHORITY, isSigner: false, isWritable: false },
      { pubkey: PUMP_FUN_PROGRAM, isSigner: false, isWritable: false },
    ];

    // Sell instruction discriminator
    const data = Buffer.alloc(24);
    data.writeUInt8(0x33, 0); // Sell discriminator
    data.writeBigUInt64LE(BigInt(amount), 8);
    data.writeBigUInt64LE(BigInt(minSolOut), 16);

    return new TransactionInstruction({
      keys,
      programId: PUMP_FUN_PROGRAM,
      data,
    });
  }

  private async getBondingCurvePDA(mint: PublicKey): Promise<PublicKey> {
    const [pda] = PublicKey.findProgramAddressSync(
      [Buffer.from('bonding-curve'), mint.toBuffer()],
      PUMP_FUN_PROGRAM
    );
    return pda;
  }

  private async getAssociatedBondingCurvePDA(
    mint: PublicKey,
    bondingCurve: PublicKey
  ): Promise<PublicKey> {
    const [pda] = PublicKey.findProgramAddressSync(
      [
        bondingCurve.toBuffer(),
        TOKEN_PROGRAM_ID.toBuffer(),
        mint.toBuffer(),
      ],
      ASSOCIATED_TOKEN_PROGRAM_ID
    );
    return pda;
  }
}
