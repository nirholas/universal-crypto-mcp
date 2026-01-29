/**
 * PumpFun Integration
 * Create and trade tokens on PumpFun bonding curve
 */

import {
  Connection,
  PublicKey,
  Keypair,
  SystemProgram,
  TransactionMessage,
  VersionedTransaction,
  ComputeBudgetProgram,
  TransactionInstruction,
} from '@solana/web3.js';
import {
  TOKEN_PROGRAM_ID,
  getAssociatedTokenAddressSync,
  createAssociatedTokenAccountInstruction,
  ASSOCIATED_TOKEN_PROGRAM_ID,
} from '@solana/spl-token';
import bs58 from 'bs58';
import type {
  CreatePumpFunTokenParams,
  PumpFunTokenResult,
  BondingCurveState,
} from '../types.js';
import { TokenLaunchError, TokenLaunchErrorCode, CONSTANTS } from '../types.js';
import { logger } from '../utils/logger.js';

const PUMPFUN_PROGRAM = new PublicKey(CONSTANTS.PUMPFUN_PROGRAM);
const PUMPFUN_GLOBAL = new PublicKey(CONSTANTS.PUMPFUN_GLOBAL);
const PUMPFUN_FEE_RECIPIENT = new PublicKey(CONSTANTS.PUMPFUN_FEE_RECIPIENT);

/**
 * Derive PumpFun bonding curve PDA
 */
export function deriveBondingCurve(mint: PublicKey): PublicKey {
  const [bondingCurve] = PublicKey.findProgramAddressSync(
    [Buffer.from(CONSTANTS.PUMPFUN_BONDING_CURVE_SEED), mint.toBuffer()],
    PUMPFUN_PROGRAM
  );
  return bondingCurve;
}

/**
 * Derive associated bonding curve (token account)
 */
export function deriveAssociatedBondingCurve(
  mint: PublicKey,
  bondingCurve: PublicKey
): PublicKey {
  return getAssociatedTokenAddressSync(mint, bondingCurve, true);
}

/**
 * Get bonding curve state
 */
export async function getBondingCurveState(
  connection: Connection,
  mint: string
): Promise<BondingCurveState | null> {
  try {
    const mintPubkey = new PublicKey(mint);
    const bondingCurve = deriveBondingCurve(mintPubkey);
    
    const accountInfo = await connection.getAccountInfo(bondingCurve);
    
    if (!accountInfo) {
      return null;
    }
    
    // Parse bonding curve data
    // PumpFun bonding curve layout:
    // [0-7] discriminator
    // [8-15] virtualSolReserves (u64)
    // [16-23] virtualTokenReserves (u64)
    // [24-31] realSolReserves (u64)
    // [32-39] realTokenReserves (u64)
    // [40-47] tokenTotalSupply (u64)
    // [48] complete (bool)
    
    const data = accountInfo.data;
    
    if (data.length < 49) {
      return null;
    }
    
    const virtualSolReserves = data.readBigUInt64LE(8);
    const virtualTokenReserves = data.readBigUInt64LE(16);
    const realSolReserves = data.readBigUInt64LE(24);
    const realTokenReserves = data.readBigUInt64LE(32);
    const tokenTotalSupply = data.readBigUInt64LE(40);
    const complete = data[48] === 1;
    
    // Check if migrated to Raydium
    let raydiumPool: string | undefined;
    if (complete) {
      // Would need to look up the Raydium pool
      // For now, leave undefined
    }
    
    return {
      mint,
      virtualSolReserves: virtualSolReserves.toString(),
      virtualTokenReserves: virtualTokenReserves.toString(),
      realSolReserves: realSolReserves.toString(),
      realTokenReserves: realTokenReserves.toString(),
      tokenTotalSupply: tokenTotalSupply.toString(),
      complete,
      migrated: complete,
      raydiumPool,
    };
  } catch (error) {
    logger.error('Failed to get bonding curve state', {
      mint,
      error: error instanceof Error ? error.message : 'Unknown',
    });
    return null;
  }
}

/**
 * Check if token is still on bonding curve
 */
export async function isOnBondingCurve(
  connection: Connection,
  mint: string
): Promise<boolean> {
  const state = await getBondingCurveState(connection, mint);
  return state !== null && !state.complete;
}

/**
 * Calculate buy amount on bonding curve
 */
export function calculateBuyAmount(
  virtualSolReserves: bigint,
  virtualTokenReserves: bigint,
  solAmount: bigint
): bigint {
  // Constant product formula: x * y = k
  // newTokenReserves = k / (solReserves + solAmount)
  // tokensOut = tokenReserves - newTokenReserves
  
  const k = virtualSolReserves * virtualTokenReserves;
  const newSolReserves = virtualSolReserves + solAmount;
  const newTokenReserves = k / newSolReserves;
  const tokensOut = virtualTokenReserves - newTokenReserves;
  
  return tokensOut;
}

/**
 * Calculate sell amount on bonding curve
 */
export function calculateSellAmount(
  virtualSolReserves: bigint,
  virtualTokenReserves: bigint,
  tokenAmount: bigint
): bigint {
  const k = virtualSolReserves * virtualTokenReserves;
  const newTokenReserves = virtualTokenReserves + tokenAmount;
  const newSolReserves = k / newTokenReserves;
  const solOut = virtualSolReserves - newSolReserves;
  
  return solOut;
}

/**
 * Build PumpFun create token instruction
 * Note: This is a simplified version - actual PumpFun requires their API
 */
export function buildPumpFunCreateInstruction(
  payer: PublicKey,
  mint: PublicKey,
  name: string,
  symbol: string,
  uri: string
): TransactionInstruction {
  const bondingCurve = deriveBondingCurve(mint);
  const associatedBondingCurve = deriveAssociatedBondingCurve(mint, bondingCurve);
  
  // Build instruction data
  // PumpFun create discriminator + params
  const nameBytes = Buffer.from(name.slice(0, 32));
  const symbolBytes = Buffer.from(symbol.slice(0, 10));
  const uriBytes = Buffer.from(uri.slice(0, 200));
  
  const data = Buffer.alloc(8 + 4 + nameBytes.length + 4 + symbolBytes.length + 4 + uriBytes.length);
  let offset = 0;
  
  // Discriminator for 'create' instruction (example - actual value from IDL)
  const discriminator = Buffer.from([24, 30, 200, 40, 5, 28, 7, 119]);
  discriminator.copy(data, offset);
  offset += 8;
  
  // Name
  data.writeUInt32LE(nameBytes.length, offset);
  offset += 4;
  nameBytes.copy(data, offset);
  offset += nameBytes.length;
  
  // Symbol
  data.writeUInt32LE(symbolBytes.length, offset);
  offset += 4;
  symbolBytes.copy(data, offset);
  offset += symbolBytes.length;
  
  // URI
  data.writeUInt32LE(uriBytes.length, offset);
  offset += 4;
  uriBytes.copy(data, offset);
  
  return new TransactionInstruction({
    programId: PUMPFUN_PROGRAM,
    keys: [
      { pubkey: mint, isSigner: true, isWritable: true },
      { pubkey: bondingCurve, isSigner: false, isWritable: true },
      { pubkey: associatedBondingCurve, isSigner: false, isWritable: true },
      { pubkey: PUMPFUN_GLOBAL, isSigner: false, isWritable: false },
      { pubkey: payer, isSigner: true, isWritable: true },
      { pubkey: SystemProgram.programId, isSigner: false, isWritable: false },
      { pubkey: TOKEN_PROGRAM_ID, isSigner: false, isWritable: false },
      { pubkey: ASSOCIATED_TOKEN_PROGRAM_ID, isSigner: false, isWritable: false },
    ],
    data,
  });
}

/**
 * Build PumpFun buy instruction
 */
export function buildPumpFunBuyInstruction(
  payer: PublicKey,
  mint: PublicKey,
  solAmount: bigint,
  minTokensOut: bigint
): TransactionInstruction {
  const bondingCurve = deriveBondingCurve(mint);
  const associatedBondingCurve = deriveAssociatedBondingCurve(mint, bondingCurve);
  const payerAta = getAssociatedTokenAddressSync(mint, payer);
  
  // Build instruction data
  const data = Buffer.alloc(8 + 8 + 8);
  let offset = 0;
  
  // Discriminator for 'buy' instruction
  const discriminator = Buffer.from([102, 6, 61, 18, 1, 218, 235, 234]);
  discriminator.copy(data, offset);
  offset += 8;
  
  // Sol amount
  data.writeBigUInt64LE(solAmount, offset);
  offset += 8;
  
  // Min tokens out
  data.writeBigUInt64LE(minTokensOut, offset);
  
  return new TransactionInstruction({
    programId: PUMPFUN_PROGRAM,
    keys: [
      { pubkey: PUMPFUN_GLOBAL, isSigner: false, isWritable: false },
      { pubkey: PUMPFUN_FEE_RECIPIENT, isSigner: false, isWritable: true },
      { pubkey: mint, isSigner: false, isWritable: false },
      { pubkey: bondingCurve, isSigner: false, isWritable: true },
      { pubkey: associatedBondingCurve, isSigner: false, isWritable: true },
      { pubkey: payerAta, isSigner: false, isWritable: true },
      { pubkey: payer, isSigner: true, isWritable: true },
      { pubkey: SystemProgram.programId, isSigner: false, isWritable: false },
      { pubkey: TOKEN_PROGRAM_ID, isSigner: false, isWritable: false },
    ],
    data,
  });
}

/**
 * Build PumpFun sell instruction
 */
export function buildPumpFunSellInstruction(
  payer: PublicKey,
  mint: PublicKey,
  tokenAmount: bigint,
  minSolOut: bigint
): TransactionInstruction {
  const bondingCurve = deriveBondingCurve(mint);
  const associatedBondingCurve = deriveAssociatedBondingCurve(mint, bondingCurve);
  const payerAta = getAssociatedTokenAddressSync(mint, payer);
  
  // Build instruction data
  const data = Buffer.alloc(8 + 8 + 8);
  let offset = 0;
  
  // Discriminator for 'sell' instruction
  const discriminator = Buffer.from([51, 230, 133, 164, 1, 127, 131, 173]);
  discriminator.copy(data, offset);
  offset += 8;
  
  // Token amount
  data.writeBigUInt64LE(tokenAmount, offset);
  offset += 8;
  
  // Min SOL out
  data.writeBigUInt64LE(minSolOut, offset);
  
  return new TransactionInstruction({
    programId: PUMPFUN_PROGRAM,
    keys: [
      { pubkey: PUMPFUN_GLOBAL, isSigner: false, isWritable: false },
      { pubkey: PUMPFUN_FEE_RECIPIENT, isSigner: false, isWritable: true },
      { pubkey: mint, isSigner: false, isWritable: false },
      { pubkey: bondingCurve, isSigner: false, isWritable: true },
      { pubkey: associatedBondingCurve, isSigner: false, isWritable: true },
      { pubkey: payerAta, isSigner: false, isWritable: true },
      { pubkey: payer, isSigner: true, isWritable: true },
      { pubkey: SystemProgram.programId, isSigner: false, isWritable: false },
      { pubkey: TOKEN_PROGRAM_ID, isSigner: false, isWritable: false },
    ],
    data,
  });
}

/**
 * Buy tokens on PumpFun bonding curve
 */
export async function buyOnPumpFun(
  connection: Connection,
  mint: string,
  payer: PublicKey,
  solAmount: bigint,
  slippageBps: number,
  signTransaction: (tx: VersionedTransaction) => Promise<VersionedTransaction>
): Promise<{ signature: string; tokensReceived: bigint }> {
  const mintPubkey = new PublicKey(mint);
  
  // Get bonding curve state
  const state = await getBondingCurveState(connection, mint);
  if (!state) {
    throw new TokenLaunchError(
      TokenLaunchErrorCode.POOL_NOT_FOUND,
      'Bonding curve not found for token'
    );
  }
  
  if (state.complete) {
    throw new TokenLaunchError(
      TokenLaunchErrorCode.POOL_NOT_FOUND,
      'Token has graduated from bonding curve'
    );
  }
  
  // Calculate expected tokens
  const expectedTokens = calculateBuyAmount(
    BigInt(state.virtualSolReserves),
    BigInt(state.virtualTokenReserves),
    solAmount
  );
  
  // Apply slippage
  const minTokensOut = expectedTokens - (expectedTokens * BigInt(slippageBps) / BigInt(10000));
  
  logger.info('Buying on PumpFun', {
    mint,
    solAmount: solAmount.toString(),
    expectedTokens: expectedTokens.toString(),
    minTokensOut: minTokensOut.toString(),
  });
  
  // Build transaction
  const payerAta = getAssociatedTokenAddressSync(mintPubkey, payer);
  
  const instructions = [
    ComputeBudgetProgram.setComputeUnitLimit({ units: 200_000 }),
    ComputeBudgetProgram.setComputeUnitPrice({ microLamports: 100_000 }),
  ];
  
  // Check if ATA exists, create if not
  const ataInfo = await connection.getAccountInfo(payerAta);
  if (!ataInfo) {
    instructions.push(
      createAssociatedTokenAccountInstruction(payer, payerAta, payer, mintPubkey)
    );
  }
  
  instructions.push(buildPumpFunBuyInstruction(payer, mintPubkey, solAmount, minTokensOut));
  
  const { blockhash, lastValidBlockHeight } = await connection.getLatestBlockhash();
  
  const message = new TransactionMessage({
    payerKey: payer,
    recentBlockhash: blockhash,
    instructions,
  }).compileToV0Message();
  
  const transaction = new VersionedTransaction(message);
  const signedTx = await signTransaction(transaction);
  
  const signature = await connection.sendTransaction(signedTx);
  await connection.confirmTransaction({ signature, blockhash, lastValidBlockHeight });
  
  return { signature, tokensReceived: expectedTokens };
}

/**
 * Sell tokens on PumpFun bonding curve
 */
export async function sellOnPumpFun(
  connection: Connection,
  mint: string,
  payer: PublicKey,
  tokenAmount: bigint,
  slippageBps: number,
  signTransaction: (tx: VersionedTransaction) => Promise<VersionedTransaction>
): Promise<{ signature: string; solReceived: bigint }> {
  const mintPubkey = new PublicKey(mint);
  
  // Get bonding curve state
  const state = await getBondingCurveState(connection, mint);
  if (!state) {
    throw new TokenLaunchError(
      TokenLaunchErrorCode.POOL_NOT_FOUND,
      'Bonding curve not found for token'
    );
  }
  
  if (state.complete) {
    throw new TokenLaunchError(
      TokenLaunchErrorCode.POOL_NOT_FOUND,
      'Token has graduated from bonding curve'
    );
  }
  
  // Calculate expected SOL
  const expectedSol = calculateSellAmount(
    BigInt(state.virtualSolReserves),
    BigInt(state.virtualTokenReserves),
    tokenAmount
  );
  
  // Apply slippage
  const minSolOut = expectedSol - (expectedSol * BigInt(slippageBps) / BigInt(10000));
  
  logger.info('Selling on PumpFun', {
    mint,
    tokenAmount: tokenAmount.toString(),
    expectedSol: expectedSol.toString(),
    minSolOut: minSolOut.toString(),
  });
  
  // Build transaction
  const instructions = [
    ComputeBudgetProgram.setComputeUnitLimit({ units: 200_000 }),
    ComputeBudgetProgram.setComputeUnitPrice({ microLamports: 100_000 }),
    buildPumpFunSellInstruction(payer, mintPubkey, tokenAmount, minSolOut),
  ];
  
  const { blockhash, lastValidBlockHeight } = await connection.getLatestBlockhash();
  
  const message = new TransactionMessage({
    payerKey: payer,
    recentBlockhash: blockhash,
    instructions,
  }).compileToV0Message();
  
  const transaction = new VersionedTransaction(message);
  const signedTx = await signTransaction(transaction);
  
  const signature = await connection.sendTransaction(signedTx);
  await connection.confirmTransaction({ signature, blockhash, lastValidBlockHeight });
  
  return { signature, solReceived: expectedSol };
}
