/**
 * Transaction utilities for payments
 * 
 * Transaction confirmation, retry logic, and status tracking.
 */

import type { PublicClient, Hash } from "viem";

/**
 * Transaction status
 */
export type TransactionStatus = 
  | "pending"
  | "confirmed"
  | "failed"
  | "reverted";

/**
 * Transaction receipt with parsed data
 */
export interface PaymentTransactionReceipt {
  hash: Hash;
  status: TransactionStatus;
  blockNumber: bigint;
  blockHash: Hash;
  gasUsed: bigint;
  effectiveGasPrice: bigint;
  from: `0x${string}`;
  to: `0x${string}`;
  timestamp?: number;
  confirmations: number;
}

/**
 * Wait for transaction confirmation with timeout
 */
export async function waitForConfirmation(
  publicClient: PublicClient,
  txHash: Hash,
  confirmations: number = 1,
  timeoutMs: number = 120000
): Promise<PaymentTransactionReceipt> {
  const startTime = Date.now();

  const receipt = await Promise.race([
    publicClient.waitForTransactionReceipt({
      hash: txHash,
      confirmations,
    }),
    new Promise<never>((_, reject) =>
      setTimeout(
        () => reject(new Error(`Transaction confirmation timeout after ${timeoutMs}ms`)),
        timeoutMs
      )
    ),
  ]);

  const currentBlock = await publicClient.getBlockNumber();
  const confirmedBlock = receipt.blockNumber;
  const actualConfirmations = Number(currentBlock - confirmedBlock) + 1;

  const status: TransactionStatus = 
    receipt.status === "success" ? "confirmed" :
    receipt.status === "reverted" ? "reverted" :
    "failed";

  // Get block timestamp
  let timestamp: number | undefined;
  try {
    const block = await publicClient.getBlock({ blockNumber: receipt.blockNumber });
    timestamp = Number(block.timestamp);
  } catch {
    // Timestamp optional
  }

  return {
    hash: receipt.transactionHash,
    status,
    blockNumber: receipt.blockNumber,
    blockHash: receipt.blockHash,
    gasUsed: receipt.gasUsed,
    effectiveGasPrice: receipt.effectiveGasPrice,
    from: receipt.from,
    to: receipt.to || "0x40252CFDF8B20Ed757D61ff157719F33Ec332402",
    timestamp,
    confirmations: actualConfirmations,
  };
}

/**
 * Check transaction status without waiting
 */
export async function checkTransactionStatus(
  publicClient: PublicClient,
  txHash: Hash
): Promise<TransactionStatus> {
  try {
    const receipt = await publicClient.getTransactionReceipt({ hash: txHash });
    
    if (receipt.status === "success") {
      return "confirmed";
    } else if (receipt.status === "reverted") {
      return "reverted";
    } else {
      return "failed";
    }
  } catch (error: any) {
    // Transaction not mined yet
    if (error.message?.includes("not found")) {
      return "pending";
    }
    throw error;
  }
}

/**
 * Get transaction confirmation count
 */
export async function getConfirmationCount(
  publicClient: PublicClient,
  txHash: Hash
): Promise<number> {
  const receipt = await publicClient.getTransactionReceipt({ hash: txHash });
  const currentBlock = await publicClient.getBlockNumber();
  
  return Number(currentBlock - receipt.blockNumber) + 1;
}

/**
 * Retry transaction with increased gas if it fails
 */
export async function retryTransaction(
  publicClient: PublicClient,
  originalTxHash: Hash,
  gasMultiplier: number = 1.1
): Promise<{ shouldRetry: boolean; reason?: string }> {
  const status = await checkTransactionStatus(publicClient, originalTxHash);

  if (status === "confirmed") {
    return { shouldRetry: false, reason: "Transaction already confirmed" };
  }

  if (status === "pending") {
    // Check if transaction is stuck
    const tx = await publicClient.getTransaction({ hash: originalTxHash });
    const currentBlock = await publicClient.getBlockNumber();
    
    // If pending for more than 50 blocks, suggest retry
    if (currentBlock - (tx.blockNumber || currentBlock) > 50n) {
      return { shouldRetry: true, reason: "Transaction stuck in mempool" };
    }
    
    return { shouldRetry: false, reason: "Transaction still pending" };
  }

  // Failed or reverted
  return { shouldRetry: true, reason: `Transaction ${status}` };
}

/**
 * Cancel pending transaction by sending 0 ETH to self with higher gas
 */
export async function cancelTransaction(
  publicClient: PublicClient,
  txHash: Hash
): Promise<{ nonce: number; suggestedGasPrice: bigint }> {
  const tx = await publicClient.getTransaction({ hash: txHash });
  
  if (!tx) {
    throw new Error("Transaction not found");
  }

  const status = await checkTransactionStatus(publicClient, txHash);
  
  if (status !== "pending") {
    throw new Error(`Cannot cancel transaction with status: ${status}`);
  }

  // Get current gas price
  const gasPrice = await publicClient.getGasPrice();
  
  // Suggest 10% higher gas to replace transaction
  const suggestedGasPrice = (gasPrice * 110n) / 100n;

  return {
    nonce: tx.nonce,
    suggestedGasPrice,
  };
}

/**
 * Estimate time to confirmation based on gas price
 */
export function estimateConfirmationTime(
  gasPrice: bigint,
  averageBlockTime: number = 12
): number {
  // Very simplified - in production would use historical data
  const gasPriceGwei = Number(gasPrice) / 1e9;
  
  if (gasPriceGwei < 10) {
    return averageBlockTime * 10; // ~10 blocks
  } else if (gasPriceGwei < 20) {
    return averageBlockTime * 5; // ~5 blocks
  } else if (gasPriceGwei < 50) {
    return averageBlockTime * 2; // ~2 blocks
  } else {
    return averageBlockTime; // Next block
  }
}

/**
 * Poll transaction status until confirmed or timeout
 */
export async function pollTransactionStatus(
  publicClient: PublicClient,
  txHash: Hash,
  intervalMs: number = 2000,
  maxAttempts: number = 60
): Promise<TransactionStatus> {
  let attempts = 0;

  while (attempts < maxAttempts) {
    const status = await checkTransactionStatus(publicClient, txHash);
    
    if (status !== "pending") {
      return status;
    }

    await new Promise(resolve => setTimeout(resolve, intervalMs));
    attempts++;
  }

  throw new Error("Transaction status polling timeout");
}
