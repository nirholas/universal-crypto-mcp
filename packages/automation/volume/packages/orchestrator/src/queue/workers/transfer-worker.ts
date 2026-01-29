/**
 * Transfer Worker
 * Processes token/SOL transfer tasks
 */

import type { Task, WorkerContext, WorkerResult } from '../../types.js';

/**
 * Transfer task payload interface
 */
export interface TransferPayload {
  fromWalletId: string;
  toWalletId?: string;
  toAddress?: string;
  tokenMint?: string; // If not provided, transfers SOL
  amount: string;
  priorityFee?: string;
}

/**
 * Process a transfer task
 */
export async function processTransferTask(
  task: Task,
  context: WorkerContext
): Promise<WorkerResult> {
  const payload = task.payload as unknown as TransferPayload;
  const startTime = Date.now();

  try {
    // Validate payload
    if (!payload.fromWalletId || !payload.amount) {
      throw new Error('Invalid transfer payload: missing required fields');
    }

    if (!payload.toWalletId && !payload.toAddress) {
      throw new Error('Invalid transfer payload: must specify toWalletId or toAddress');
    }

    // Get wallet manager from context
    const walletManager = context.walletManager as {
      transfer?: (params: {
        fromWalletId: string;
        toAddress: string;
        amount: bigint;
        tokenMint?: string;
        priorityFee?: bigint;
      }) => Promise<{ signature: string }>;
      getWalletAddress?: (walletId: string) => Promise<string>;
    } | undefined;

    // Resolve destination address
    let toAddress = payload.toAddress;
    if (!toAddress && payload.toWalletId && walletManager?.getWalletAddress) {
      toAddress = await walletManager.getWalletAddress(payload.toWalletId);
    }

    if (!toAddress) {
      throw new Error('Could not resolve destination address');
    }

    if (!walletManager?.transfer) {
      // Mock execution for testing
      console.warn('Wallet manager not available, simulating transfer');

      await simulateTransfer(payload);

      return {
        success: true,
        data: {
          signature: `mock-transfer-${Date.now().toString(36)}`,
          from: payload.fromWalletId,
          to: toAddress,
          amount: payload.amount,
          tokenMint: payload.tokenMint ?? 'SOL',
          executionTime: Date.now() - startTime,
        },
      };
    }

    // Execute actual transfer
    const result = await walletManager.transfer({
      fromWalletId: payload.fromWalletId,
      toAddress,
      amount: BigInt(payload.amount),
      tokenMint: payload.tokenMint,
      priorityFee: payload.priorityFee ? BigInt(payload.priorityFee) : undefined,
    });

    return {
      success: true,
      data: {
        signature: result.signature,
        from: payload.fromWalletId,
        to: toAddress,
        amount: payload.amount,
        tokenMint: payload.tokenMint ?? 'SOL',
        executionTime: Date.now() - startTime,
      },
    };
  } catch (error) {
    const err = error instanceof Error ? error : new Error(String(error));
    return {
      success: false,
      error: err.message,
    };
  }
}

/**
 * Simulate a transfer for testing
 */
async function simulateTransfer(_payload: TransferPayload): Promise<void> {
  // Simulate network delay
  const delay = 300 + Math.random() * 700;
  await new Promise((resolve) => setTimeout(resolve, delay));

  // Simulate occasional failures (2% failure rate)
  if (Math.random() < 0.02) {
    throw new Error('Simulated transfer failure');
  }
}

/**
 * Validate transfer payload
 */
export function validateTransferPayload(payload: unknown): payload is TransferPayload {
  if (typeof payload !== 'object' || payload === null) {
    return false;
  }

  const p = payload as Record<string, unknown>;

  return (
    typeof p.fromWalletId === 'string' &&
    (typeof p.toWalletId === 'string' || typeof p.toAddress === 'string') &&
    typeof p.amount === 'string'
  );
}
