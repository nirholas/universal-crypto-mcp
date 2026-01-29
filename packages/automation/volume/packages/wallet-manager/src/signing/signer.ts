/**
 * Transaction Signer
 * Secure transaction signing without exposing private keys
 */

import {
  PublicKey,
  VersionedTransaction,
  Keypair,
} from '@solana/web3.js';
import nacl from 'tweetnacl';
import bs58 from 'bs58';
import type {
  TransactionSigner as ITransactionSigner,
  WalletErrorCode,
  AuditAction,
} from '../types.js';
import { WalletManagerError } from '../types.js';
import { SigningQueue, createSigningQueue } from './signing-queue.js';
import { KeyVaultImpl } from '../vault/key-vault.js';

/**
 * Audit logger type
 */
type AuditLogFn = (
  action: AuditAction,
  walletId: string | undefined,
  success: boolean,
  error?: string
) => void;

/**
 * Transaction Signer implementation
 */
export class TransactionSignerImpl implements ITransactionSigner {
  private keyVault: KeyVaultImpl;
  private signingQueue: SigningQueue;
  private walletAddresses: Map<string, string>; // walletId -> address
  private auditLog?: AuditLogFn;

  constructor(options: {
    keyVault: KeyVaultImpl;
    rateLimitPerMinute?: number;
    auditLog?: AuditLogFn;
  }) {
    this.keyVault = options.keyVault;
    this.signingQueue = createSigningQueue({
      rateLimit: options.rateLimitPerMinute || 60,
    });
    this.walletAddresses = new Map();
    this.auditLog = options.auditLog;
  }

  /**
   * Log an audit event
   */
  private log(
    action: AuditAction,
    walletId: string | undefined,
    success: boolean,
    error?: string
  ): void {
    if (this.auditLog) {
      this.auditLog(action, walletId, success, error);
    }
  }

  /**
   * Register a wallet address
   */
  registerWallet(walletId: string, address: string): void {
    this.walletAddresses.set(walletId, address);
  }

  /**
   * Sign a transaction
   */
  async signTransaction(
    walletId: string,
    transaction: VersionedTransaction,
    password: string
  ): Promise<VersionedTransaction> {
    try {
      // Check rate limit
      await this.signingQueue.waitForRateLimit();

      // Retrieve the private key
      const privateKey = await this.keyVault.retrieveKey(walletId, password);

      // Create keypair from private key
      const keypair = Keypair.fromSecretKey(privateKey);

      // Verify the public key matches
      const address = this.walletAddresses.get(walletId);
      if (address && keypair.publicKey.toString() !== address) {
        throw new WalletManagerError(
          'SIGNING_FAILED' as WalletErrorCode,
          'Private key does not match registered wallet address'
        );
      }

      // Sign the transaction
      transaction.sign([keypair]);

      // Record the signing operation
      this.signingQueue.recordSigning();

      // Clear the private key from memory (best effort)
      privateKey.fill(0);

      this.log('sign_transaction', walletId, true);

      return transaction;
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Unknown error';
      this.log('sign_transaction', walletId, false, errorMessage);
      throw error;
    }
  }

  /**
   * Sign multiple transactions
   */
  async signAllTransactions(
    walletId: string,
    transactions: VersionedTransaction[],
    password: string
  ): Promise<VersionedTransaction[]> {
    try {
      // Check rate limit for batch
      for (let i = 0; i < transactions.length; i++) {
        await this.signingQueue.waitForRateLimit();
      }

      // Retrieve the private key once
      const privateKey = await this.keyVault.retrieveKey(walletId, password);
      const keypair = Keypair.fromSecretKey(privateKey);

      // Verify the public key
      const address = this.walletAddresses.get(walletId);
      if (address && keypair.publicKey.toString() !== address) {
        throw new WalletManagerError(
          'SIGNING_FAILED' as WalletErrorCode,
          'Private key does not match registered wallet address'
        );
      }

      // Sign all transactions
      const signedTransactions: VersionedTransaction[] = [];

      for (const tx of transactions) {
        tx.sign([keypair]);
        signedTransactions.push(tx);
        this.signingQueue.recordSigning();
      }

      // Clear the private key
      privateKey.fill(0);

      this.log('sign_transaction', walletId, true);

      return signedTransactions;
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Unknown error';
      this.log('sign_transaction', walletId, false, errorMessage);
      throw error;
    }
  }

  /**
   * Sign a message
   */
  async signMessage(
    walletId: string,
    message: Uint8Array,
    password: string
  ): Promise<Uint8Array> {
    try {
      await this.signingQueue.waitForRateLimit();

      // Retrieve the private key
      const privateKey = await this.keyVault.retrieveKey(walletId, password);

      // Sign the message using nacl
      const signature = nacl.sign.detached(message, privateKey);

      // Record signing
      this.signingQueue.recordSigning();

      // Clear the private key
      privateKey.fill(0);

      this.log('sign_message', walletId, true);

      return signature;
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Unknown error';
      this.log('sign_message', walletId, false, errorMessage);
      throw error;
    }
  }

  /**
   * Get the public key for a wallet
   */
  async getPublicKey(walletId: string): Promise<PublicKey> {
    const address = this.walletAddresses.get(walletId);

    if (!address) {
      throw new WalletManagerError(
        'WALLET_NOT_FOUND' as WalletErrorCode,
        'Wallet not registered with signer'
      );
    }

    return new PublicKey(address);
  }

  /**
   * Get signing queue statistics
   */
  getQueueStats(): {
    currentRate: number;
    remainingCapacity: number;
    timeUntilNextSlot: number;
  } {
    return {
      currentRate: this.signingQueue.getCurrentRate(),
      remainingCapacity: this.signingQueue.getRemainingCapacity(),
      timeUntilNextSlot: this.signingQueue.getTimeUntilNextSlot(),
    };
  }

  /**
   * Set the rate limit for signing operations
   */
  setRateLimit(ratePerMinute: number): void {
    this.signingQueue.setRateLimit(ratePerMinute);
  }

  /**
   * Check if signing is available (not rate limited)
   */
  canSign(): boolean {
    return this.signingQueue.canSign();
  }

  /**
   * Get remaining signing capacity
   */
  getRemainingCapacity(): number {
    return this.signingQueue.getRemainingCapacity();
  }

  /**
   * Verify a signature
   */
  verifySignature(
    message: Uint8Array,
    signature: Uint8Array,
    publicKey: PublicKey | string
  ): boolean {
    try {
      const pubkeyBytes =
        publicKey instanceof PublicKey
          ? publicKey.toBytes()
          : bs58.decode(publicKey);

      return nacl.sign.detached.verify(message, signature, pubkeyBytes);
    } catch {
      return false;
    }
  }
}

/**
 * Create a transaction signer instance
 */
export function createTransactionSigner(options: {
  keyVault: KeyVaultImpl;
  rateLimitPerMinute?: number;
  auditLog?: AuditLogFn;
}): TransactionSignerImpl {
  return new TransactionSignerImpl(options);
}
