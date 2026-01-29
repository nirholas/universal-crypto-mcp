/**
 * Compute Budget Utilities
 * Automatic compute unit estimation and priority fee calculation
 */

import {
  Connection,
  PublicKey,
  TransactionInstruction,
  TransactionMessage,
  VersionedTransaction,
  ComputeBudgetProgram,
} from '@solana/web3.js';
import { logger } from '../utils/logger.js';

const DEFAULT_COMPUTE_UNITS = 200_000;
const MAX_COMPUTE_UNITS = 1_400_000;
const COMPUTE_UNIT_BUFFER = 1.1; // 10% buffer

export interface ComputeBudgetConfig {
  units?: number;
  microLamportsPerUnit?: number;
  autoDetect?: boolean;
}

/**
 * Estimate compute units needed for a transaction via simulation
 */
export async function estimateComputeUnits(
  connection: Connection,
  instructions: TransactionInstruction[],
  payer: PublicKey,
  lookupTables: import('@solana/web3.js').AddressLookupTableAccount[] = []
): Promise<number> {
  try {
    // Build a test transaction with max compute units for simulation
    const testInstructions = [
      ComputeBudgetProgram.setComputeUnitLimit({ units: MAX_COMPUTE_UNITS }),
      ...instructions,
    ];

    const { blockhash } = await connection.getLatestBlockhash();
    
    const message = new TransactionMessage({
      payerKey: payer,
      recentBlockhash: blockhash,
      instructions: testInstructions,
    }).compileToV0Message();

    const transaction = new VersionedTransaction(message);
    
    const simulation = await connection.simulateTransaction(transaction, {
      sigVerify: false,
      replaceRecentBlockhash: true,
    });

    if (simulation.value.err) {
      logger.warn('Simulation failed during compute estimation', {
        error: simulation.value.err,
        logs: simulation.value.logs?.slice(-5),
      });
      return DEFAULT_COMPUTE_UNITS;
    }

    const unitsConsumed = simulation.value.unitsConsumed || DEFAULT_COMPUTE_UNITS;
    
    // Add buffer
    const estimatedUnits = Math.ceil(unitsConsumed * COMPUTE_UNIT_BUFFER);
    
    logger.debug('Compute units estimated', {
      consumed: unitsConsumed,
      estimated: estimatedUnits,
    });

    return Math.min(estimatedUnits, MAX_COMPUTE_UNITS);
  } catch (error) {
    logger.warn('Compute unit estimation failed', { error: (error as Error).message });
    return DEFAULT_COMPUTE_UNITS;
  }
}

/**
 * Create compute budget instructions
 */
export function createComputeBudgetInstructions(
  units: number,
  microLamportsPerUnit: number = 0
): TransactionInstruction[] {
  const instructions: TransactionInstruction[] = [];

  // Set compute unit limit
  if (units > 0) {
    instructions.push(
      ComputeBudgetProgram.setComputeUnitLimit({ units })
    );
  }

  // Set priority fee
  if (microLamportsPerUnit > 0) {
    instructions.push(
      ComputeBudgetProgram.setComputeUnitPrice({ microLamports: microLamportsPerUnit })
    );
  }

  return instructions;
}

/**
 * Calculate transaction fee
 */
export function calculateTransactionFee(
  computeUnits: number,
  microLamportsPerUnit: number,
  baseFee: number = 5000 // Lamports
): number {
  const priorityFee = Math.ceil((computeUnits * microLamportsPerUnit) / 1_000_000);
  return baseFee + priorityFee;
}

/**
 * Get recommended priority fee tiers
 */
export function getPriorityFeeTiers(): {
  low: number;
  medium: number;
  high: number;
  turbo: number;
} {
  return {
    low: 1_000,      // 0.001 lamports per CU
    medium: 10_000,  // 0.01 lamports per CU
    high: 100_000,   // 0.1 lamports per CU
    turbo: 500_000,  // 0.5 lamports per CU
  };
}
