/**
 * Raydium Pool Creation
 */

import {
  Connection,
  PublicKey,
  Keypair,
  SystemProgram,
  VersionedTransaction,
} from '@solana/web3.js';
import {
  getAssociatedTokenAddressSync,
  createAssociatedTokenAccountInstruction,
  createSyncNativeInstruction,
  NATIVE_MINT,
} from '@solana/spl-token';
import type { CreateRaydiumPoolParams, CreatePoolResult } from '../types.js';
import { TokenLaunchError, TokenLaunchErrorCode, CONSTANTS } from '../types.js';
import { logger } from '../utils/logger.js';

const RAYDIUM_AMM_PROGRAM = new PublicKey(CONSTANTS.RAYDIUM_AMM_PROGRAM);
const RAYDIUM_CPMM_PROGRAM = new PublicKey(CONSTANTS.RAYDIUM_CPMM_PROGRAM);

export function deriveAmmPoolAddress(marketId: PublicKey): PublicKey {
  const [poolAddress] = PublicKey.findProgramAddressSync(
    [RAYDIUM_AMM_PROGRAM.toBuffer(), marketId.toBuffer(), Buffer.from('amm_associated_seed')],
    RAYDIUM_AMM_PROGRAM
  );
  return poolAddress;
}

export function deriveCpmmPoolAddress(baseMint: PublicKey, quoteMint: PublicKey, configIndex = 0): PublicKey {
  const [poolAddress] = PublicKey.findProgramAddressSync(
    [Buffer.from('pool'), Buffer.from([configIndex]), baseMint.toBuffer(), quoteMint.toBuffer()],
    RAYDIUM_CPMM_PROGRAM
  );
  return poolAddress;
}

export async function getPoolInfo(poolId: string): Promise<{
  baseMint: string; quoteMint: string; lpMint: string;
  baseReserve: string; quoteReserve: string; lpSupply: string; price: number;
} | null> {
  try {
    const response = await fetch(`https://api.raydium.io/v2/main/pool/${poolId}`);
    if (!response.ok) return null;
    return await response.json() as any;
  } catch (error) {
    logger.error('Failed to get pool info', { poolId, error });
    return null;
  }
}

export async function findPoolsForPair(baseMint: string, quoteMint: string): Promise<Array<{ poolId: string; type: 'amm' | 'cpmm'; liquidity: string }>> {
  try {
    const response = await fetch(`https://api.raydium.io/v2/main/pairs?baseMint=${baseMint}&quoteMint=${quoteMint}`);
    if (!response.ok) return [];
    const data = await response.json() as any;
    return data.data?.map((pool: any) => ({ poolId: pool.ammId, type: pool.type || 'amm', liquidity: pool.liquidity })) || [];
  } catch (error) {
    logger.error('Failed to find pools', { baseMint, quoteMint, error });
    return [];
  }
}

export function estimatePoolCreationCost(): bigint {
  return BigInt(1_100_000_000);
}

export async function buildCpmmPoolInstructions(connection: Connection, params: CreateRaydiumPoolParams, payer: PublicKey): Promise<{ instructions: any[]; poolKeypair: Keypair }> {
  const tokenMint = new PublicKey(params.tokenMint);
  const quoteMint = new PublicKey(params.quoteMint);
  const poolKeypair = Keypair.generate();
  const instructions: any[] = [];
  
  const payerTokenAta = getAssociatedTokenAddressSync(tokenMint, payer);
  const payerQuoteAta = getAssociatedTokenAddressSync(quoteMint, payer);
  
  if (!(await connection.getAccountInfo(payerTokenAta))) {
    instructions.push(createAssociatedTokenAccountInstruction(payer, payerTokenAta, payer, tokenMint));
  }
  if (!(await connection.getAccountInfo(payerQuoteAta))) {
    instructions.push(createAssociatedTokenAccountInstruction(payer, payerQuoteAta, payer, quoteMint));
  }
  
  if (quoteMint.equals(NATIVE_MINT)) {
    instructions.push(
      SystemProgram.transfer({ fromPubkey: payer, toPubkey: payerQuoteAta, lamports: BigInt(params.quoteAmount) }),
      createSyncNativeInstruction(payerQuoteAta)
    );
  }
  
  logger.info('CPMM pool instructions prepared', { tokenMint: params.tokenMint, quoteMint: params.quoteMint });
  return { instructions, poolKeypair };
}

export async function createRaydiumPool(_connection: Connection, params: CreateRaydiumPoolParams, _signTransaction: (tx: VersionedTransaction) => Promise<VersionedTransaction>): Promise<CreatePoolResult> {
  logger.info('Creating Raydium pool', { tokenMint: params.tokenMint, quoteMint: params.quoteMint });
  throw new TokenLaunchError(TokenLaunchErrorCode.TRANSACTION_FAILED, 'Raydium pool creation requires Raydium SDK.', { hint: 'npm install @raydium-io/raydium-sdk-v2' });
}

export function calculateInitialPrice(tokenAmount: string, quoteAmount: string, tokenDecimals = 9, quoteDecimals = 9): number {
  return (Number(quoteAmount) / Math.pow(10, quoteDecimals)) / (Number(tokenAmount) / Math.pow(10, tokenDecimals));
}
