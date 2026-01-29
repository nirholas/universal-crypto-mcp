/**
 * Batch transfer utilities
 * Optimized batch transfers for SOL and SPL tokens
 */

import {
  Connection,
  PublicKey,
  VersionedTransaction,
  TransactionMessage,
  SystemProgram,
  ComputeBudgetProgram,
} from '@solana/web3.js';
import {
  createTransferInstruction,
  getAssociatedTokenAddress,
  createAssociatedTokenAccountInstruction,
} from '@solana/spl-token';
import type { WalletErrorCode } from '../types.js';
import { WalletManagerError } from '../types.js';

/**
 * Maximum instructions per transaction (conservative limit)
 */
export const MAX_INSTRUCTIONS_PER_TX = 20;

/**
 * Compute budget per SOL transfer
 */
export const COMPUTE_UNITS_PER_TRANSFER = 200;

/**
 * Compute budget per token transfer (including ATA creation if needed)
 */
export const COMPUTE_UNITS_PER_TOKEN_TRANSFER = 100_000;

/**
 * Build batched SOL transfer transactions
 * @param sourceAddress - Source wallet address
 * @param transfers - Array of destination and amount pairs
 * @param connection - Solana connection
 * @returns Array of unsigned transactions
 */
export async function buildBatchSolTransfers(
  sourceAddress: string,
  transfers: Array<{ destination: string; amount: bigint }>,
  connection: Connection
): Promise<VersionedTransaction[]> {
  const sourcePubkey = new PublicKey(sourceAddress);
  const transactions: VersionedTransaction[] = [];

  // Split transfers into batches
  const batches = chunkArray(transfers, MAX_INSTRUCTIONS_PER_TX);

  for (const batch of batches) {
    const instructions = [];

    // Add compute budget instruction
    const computeUnits = batch.length * COMPUTE_UNITS_PER_TRANSFER;
    instructions.push(
      ComputeBudgetProgram.setComputeUnitLimit({ units: computeUnits })
    );

    // Add transfer instructions
    for (const { destination, amount } of batch) {
      const destPubkey = new PublicKey(destination);
      instructions.push(
        SystemProgram.transfer({
          fromPubkey: sourcePubkey,
          toPubkey: destPubkey,
          lamports: amount,
        })
      );
    }

    // Build transaction
    const { blockhash } = await connection.getLatestBlockhash();
    const message = new TransactionMessage({
      payerKey: sourcePubkey,
      recentBlockhash: blockhash,
      instructions,
    }).compileToV0Message();

    transactions.push(new VersionedTransaction(message));
  }

  return transactions;
}

/**
 * Build batched token transfer transactions
 * @param sourceAddress - Source wallet address
 * @param tokenMint - Token mint address
 * @param transfers - Array of destination and amount pairs
 * @param connection - Solana connection
 * @returns Array of unsigned transactions
 */
export async function buildBatchTokenTransfers(
  sourceAddress: string,
  tokenMint: string,
  transfers: Array<{ destination: string; amount: bigint }>,
  connection: Connection
): Promise<VersionedTransaction[]> {
  const sourcePubkey = new PublicKey(sourceAddress);
  const mintPubkey = new PublicKey(tokenMint);
  const transactions: VersionedTransaction[] = [];

  // Get source token account
  const sourceAta = await getAssociatedTokenAddress(mintPubkey, sourcePubkey);

  // Check which destination ATAs exist
  const destinationChecks = await Promise.all(
    transfers.map(async ({ destination }) => {
      const destPubkey = new PublicKey(destination);
      const destAta = await getAssociatedTokenAddress(mintPubkey, destPubkey);
      const accountInfo = await connection.getAccountInfo(destAta);
      return {
        destination,
        destPubkey,
        destAta,
        exists: accountInfo !== null,
      };
    })
  );

  // Group transfers by whether ATA needs creation
  // Reduce batch size when ATAs need creation
  const batchSize = 10; // Smaller batches for token transfers

  const batches = chunkArray(
    transfers.map((t, i) => {
      const check = destinationChecks[i]!;
      return { ...t, destPubkey: check.destPubkey, destAta: check.destAta, exists: check.exists };
    }),
    batchSize
  );

  for (const batch of batches) {
    const instructions = [];

    // Add compute budget
    instructions.push(
      ComputeBudgetProgram.setComputeUnitLimit({
        units: batch.length * COMPUTE_UNITS_PER_TOKEN_TRANSFER,
      })
    );

    for (const { amount, destPubkey, destAta, exists } of batch) {
      // Create ATA if needed
      if (!exists) {
        instructions.push(
          createAssociatedTokenAccountInstruction(
            sourcePubkey, // Payer
            destAta,
            destPubkey,
            mintPubkey
          )
        );
      }

      // Add transfer instruction
      instructions.push(
        createTransferInstruction(
          sourceAta,
          destAta,
          sourcePubkey,
          amount
        )
      );
    }

    // Build transaction
    const { blockhash } = await connection.getLatestBlockhash();
    const message = new TransactionMessage({
      payerKey: sourcePubkey,
      recentBlockhash: blockhash,
      instructions,
    }).compileToV0Message();

    transactions.push(new VersionedTransaction(message));
  }

  return transactions;
}

/**
 * Calculate distribution amounts based on strategy
 * @param totalAmount - Total amount to distribute
 * @param walletCount - Number of wallets
 * @param strategy - Distribution strategy
 * @param weights - Optional weights for weighted distribution
 * @returns Array of amounts per wallet
 */
export function calculateDistribution(
  totalAmount: bigint,
  walletCount: number,
  strategy: 'even' | 'random' | 'weighted',
  weights?: number[]
): bigint[] {
  if (walletCount <= 0) {
    return [];
  }

  switch (strategy) {
    case 'even': {
      const baseAmount = totalAmount / BigInt(walletCount);
      const remainder = totalAmount % BigInt(walletCount);
      
      return Array(walletCount).fill(baseAmount).map((amount, i) => {
        // Distribute remainder to first wallets
        return i < Number(remainder) ? amount + BigInt(1) : amount;
      });
    }

    case 'random': {
      // Generate random weights
      const randomWeights = Array(walletCount)
        .fill(0)
        .map(() => Math.random());
      const totalWeight = randomWeights.reduce((a, b) => a + b, 0);
      const normalizedWeights = randomWeights.map(w => w / totalWeight);

      return distributeByWeights(totalAmount, normalizedWeights);
    }

    case 'weighted': {
      if (!weights || weights.length !== walletCount) {
        throw new WalletManagerError(
          'DISTRIBUTION_FAILED' as WalletErrorCode,
          'Weights array must match wallet count for weighted distribution'
        );
      }

      // Normalize weights
      const totalWeight = weights.reduce((a, b) => a + b, 0);
      if (totalWeight <= 0) {
        throw new WalletManagerError(
          'DISTRIBUTION_FAILED' as WalletErrorCode,
          'Weights must sum to a positive value'
        );
      }

      const normalizedWeights = weights.map(w => w / totalWeight);
      return distributeByWeights(totalAmount, normalizedWeights);
    }

    default:
      return calculateDistribution(totalAmount, walletCount, 'even');
  }
}

/**
 * Distribute amount by normalized weights
 */
function distributeByWeights(totalAmount: bigint, weights: number[]): bigint[] {
  const amounts = weights.map(w => {
    const amount = BigInt(Math.floor(Number(totalAmount) * w));
    return amount;
  });

  // Distribute any remainder due to rounding
  const distributed = amounts.reduce((a, b) => a + b, BigInt(0));
  let remainder = totalAmount - distributed;

  for (let i = 0; remainder > BigInt(0) && i < amounts.length; i++) {
    const current = amounts[i];
    if (current !== undefined) {
      amounts[i] = current + BigInt(1);
    }
    remainder -= BigInt(1);
  }

  return amounts;
}

/**
 * Priority fee levels for transaction speed
 */
export type PriorityLevel = 'low' | 'medium' | 'high' | 'very-high';

/**
 * Get priority fee statistics from recent blocks
 * @param connection - Solana connection
 * @returns Priority fee statistics
 */
export async function getPriorityFeeStats(
  connection: Connection
): Promise<{
  min: number;
  low: number;
  medium: number;
  high: number;
  veryHigh: number;
  samples: number;
}> {
  const recentFees = await connection.getRecentPrioritizationFees();
  
  if (recentFees.length === 0) {
    return { min: 0, low: 0, medium: 0, high: 0, veryHigh: 0, samples: 0 };
  }
  
  const fees = recentFees.map(f => f.prioritizationFee).sort((a, b) => a - b);
  const len = fees.length;
  
  return {
    min: fees[0] ?? 0,
    low: fees[Math.floor(len * 0.25)] ?? 0,      // 25th percentile
    medium: fees[Math.floor(len * 0.5)] ?? 0,    // 50th percentile (median)
    high: fees[Math.floor(len * 0.75)] ?? 0,     // 75th percentile
    veryHigh: fees[Math.floor(len * 0.9)] ?? 0,  // 90th percentile
    samples: len,
  };
}

/**
 * Get recommended priority fee for a given level
 * @param connection - Solana connection
 * @param level - Desired priority level
 * @returns Recommended priority fee in micro-lamports per compute unit
 */
export async function getRecommendedPriorityFee(
  connection: Connection,
  level: PriorityLevel = 'medium'
): Promise<number> {
  const stats = await getPriorityFeeStats(connection);
  
  switch (level) {
    case 'low': return stats.low;
    case 'medium': return stats.medium;
    case 'high': return stats.high;
    case 'very-high': return stats.veryHigh;
    default: return stats.medium;
  }
}

/**
 * Estimate transaction fees for batch transfers with priority level
 * @param transferCount - Number of transfers
 * @param isToken - Whether these are token transfers
 * @param connection - Solana connection
 * @param priorityLevel - Desired priority level
 * @returns Estimated fees in lamports
 */
export async function estimateBatchTransferFees(
  transferCount: number,
  isToken: boolean,
  connection: Connection,
  priorityLevel: PriorityLevel = 'medium'
): Promise<{
  baseFee: bigint;
  priorityFee: bigint;
  totalFee: bigint;
  transactionCount: number;
}> {
  const batchSize = isToken ? 10 : MAX_INSTRUCTIONS_PER_TX;
  const transactionCount = Math.ceil(transferCount / batchSize);

  // Calculate compute units per transaction
  const computeUnitsPerTx = isToken 
    ? batchSize * COMPUTE_UNITS_PER_TOKEN_TRANSFER
    : batchSize * COMPUTE_UNITS_PER_TRANSFER;

  // Get recommended priority fee (micro-lamports per compute unit)
  const priorityFeePerCU = await getRecommendedPriorityFee(connection, priorityLevel);
  
  // Priority fee = (priority fee per CU * compute units) / 1,000,000
  const priorityFeePerTx = BigInt(Math.ceil((priorityFeePerCU * computeUnitsPerTx) / 1_000_000));

  // Base fee per signature (5000 lamports)
  const baseFeePerTx = BigInt(5000);
  
  const baseFee = BigInt(transactionCount) * baseFeePerTx;
  const priorityFee = BigInt(transactionCount) * priorityFeePerTx;

  return {
    baseFee,
    priorityFee,
    totalFee: baseFee + priorityFee,
    transactionCount,
  };
}

/**
 * Split array into chunks
 */
function chunkArray<T>(array: T[], size: number): T[][] {
  const chunks: T[][] = [];
  for (let i = 0; i < array.length; i += size) {
    chunks.push(array.slice(i, i + size));
  }
  return chunks;
}
