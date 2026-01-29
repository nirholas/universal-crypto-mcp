/**
 * Transaction Sender
 * Send and confirm transactions with retry logic
 */

import {
  Connection,
  VersionedTransaction,
  Commitment,
  TransactionConfirmationStatus,
  SendOptions as SolanaSendOptions,
} from '@solana/web3.js';
import {
  TransactionSender as ITransactionSender,
  TransactionResult,
  SendOptions,
} from '../types.js';
import { logger, logTransaction } from '../utils/logger.js';
import { sleep, retryWithBackoff } from '../utils/helpers.js';

const CONFIRMATION_TIMEOUT_MS = 60000;
const CONFIRMATION_CHECK_INTERVAL_MS = 1000;

export class TransactionSender implements ITransactionSender {
  constructor(
    private readonly connection: Connection,
    private readonly defaultCommitment: Commitment = 'confirmed'
  ) {}

  /**
   * Send transaction without waiting for confirmation
   */
  async send(
    transaction: VersionedTransaction,
    options: SendOptions = {}
  ): Promise<string> {
    const sendOptions: SolanaSendOptions = {
      skipPreflight: options.skipPreflight ?? false,
      preflightCommitment: options.preflightCommitment ?? 'confirmed',
      maxRetries: options.maxRetries ?? 3,
      minContextSlot: options.minContextSlot,
    };

    const signature = await this.connection.sendTransaction(transaction, sendOptions);
    
    logTransaction(signature, 'sent');
    
    return signature;
  }

  /**
   * Send transaction and wait for confirmation
   */
  async sendAndConfirm(
    transaction: VersionedTransaction,
    options: SendOptions & { commitment?: Commitment } = {}
  ): Promise<TransactionResult> {
    const commitment = options.commitment ?? this.defaultCommitment;
    const startTime = Date.now();

    // Send the transaction
    const signature = await this.send(transaction, options);

    // Wait for confirmation
    const result = await this.confirmTransaction(signature, commitment);

    logger.info('Transaction confirmed', {
      signature: signature.slice(0, 16) + '...',
      status: result.confirmationStatus,
      slot: result.slot,
      durationMs: Date.now() - startTime,
    });

    return result;
  }

  /**
   * Confirm a transaction signature
   */
  async confirmTransaction(
    signature: string,
    commitment: Commitment = this.defaultCommitment
  ): Promise<TransactionResult> {
    const startTime = Date.now();
    
    // Get the latest blockhash for confirmation
    const { blockhash, lastValidBlockHeight } = await this.connection.getLatestBlockhash(commitment);

    while (Date.now() - startTime < CONFIRMATION_TIMEOUT_MS) {
      // Check if blockhash is still valid
      const currentBlockHeight = await this.connection.getBlockHeight(commitment);
      if (currentBlockHeight > lastValidBlockHeight) {
        return {
          signature,
          slot: 0,
          confirmationStatus: 'processed' as TransactionConfirmationStatus,
          error: 'Transaction expired: blockhash no longer valid',
          fee: 0,
        };
      }

      // Check signature status
      const status = await this.connection.getSignatureStatus(signature, {
        searchTransactionHistory: true,
      });

      if (status.value) {
        const { err, confirmationStatus, slot } = status.value;

        if (err) {
          logTransaction(signature, 'failed');
          return {
            signature,
            slot: slot || 0,
            confirmationStatus: confirmationStatus || 'processed',
            error: JSON.stringify(err),
            fee: 0,
          };
        }

        // Check if we've reached desired confirmation level
        const confirmationLevels: TransactionConfirmationStatus[] = ['processed', 'confirmed', 'finalized'];
        const currentLevel = confirmationLevels.indexOf(confirmationStatus || 'processed');
        const desiredLevel = confirmationLevels.indexOf(
          commitment === 'finalized' ? 'finalized' : 'confirmed'
        );

        if (currentLevel >= desiredLevel) {
          logTransaction(signature, confirmationStatus || 'confirmed');
          
          // Get transaction details for fee info
          let fee = 5000; // Default base fee
          try {
            const tx = await this.connection.getTransaction(signature, {
              commitment: 'confirmed',
              maxSupportedTransactionVersion: 0,
            });
            if (tx?.meta) {
              fee = tx.meta.fee;
            }
          } catch {
            // Ignore errors getting transaction details
          }

          return {
            signature,
            slot: slot || 0,
            confirmationStatus: confirmationStatus || 'confirmed',
            fee,
          };
        }
      }

      await sleep(CONFIRMATION_CHECK_INTERVAL_MS);
    }

    logTransaction(signature, 'timeout');
    return {
      signature,
      slot: 0,
      confirmationStatus: 'processed',
      error: 'Confirmation timeout',
      fee: 0,
    };
  }

  /**
   * Resend transaction until confirmed
   */
  async resendUntilConfirmed(
    transaction: VersionedTransaction,
    commitment: Commitment = this.defaultCommitment,
    maxAttempts: number = 5
  ): Promise<TransactionResult> {
    return retryWithBackoff(
      async () => {
        const result = await this.sendAndConfirm(transaction, { commitment });
        if (result.error) {
          throw new Error(result.error);
        }
        return result;
      },
      maxAttempts,
      500
    );
  }

  /**
   * Send via Jito (implemented in jito-bundle.ts)
   * This is a placeholder that throws - use JitoBundleSender for MEV protection
   */
  async sendViaJito(): Promise<TransactionResult> {
    throw new Error('Use JitoBundleSender for Jito transactions');
  }

  /**
   * Send bundle (implemented in jito-bundle.ts)
   * This is a placeholder that throws - use JitoBundleSender for bundles
   */
  async sendBundle(): Promise<TransactionResult[]> {
    throw new Error('Use JitoBundleSender for bundle transactions');
  }
}

/**
 * Create a transaction sender
 */
export function createTransactionSender(
  connection: Connection,
  commitment: Commitment = 'confirmed'
): TransactionSender {
  return new TransactionSender(connection, commitment);
}
