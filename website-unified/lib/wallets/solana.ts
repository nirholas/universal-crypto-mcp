/**
 * Solana Wallet Adapter Configuration
 * 
 * Real wallet connection logic for Solana using @solana/wallet-adapter
 * 
 * @author Nich (@nichxbt)
 * @license Apache-2.0
 */

import { Connection, clusterApiUrl, PublicKey, Transaction, VersionedTransaction, SendOptions } from '@solana/web3.js';
import type { WalletName } from '@solana/wallet-adapter-base';

// ============================================
// Types
// ============================================

export interface SolanaWalletAdapter {
  name: string;
  icon: string;
  url: string;
  readyState: 'Installed' | 'NotDetected' | 'Loadable' | 'Unsupported';
  publicKey: PublicKey | null;
  connected: boolean;
  connecting: boolean;
  connect(): Promise<void>;
  disconnect(): Promise<void>;
  signTransaction<T extends Transaction | VersionedTransaction>(transaction: T): Promise<T>;
  signAllTransactions<T extends Transaction | VersionedTransaction>(transactions: T[]): Promise<T[]>;
  signMessage(message: Uint8Array): Promise<Uint8Array>;
  sendTransaction(
    transaction: Transaction | VersionedTransaction,
    connection: Connection,
    options?: SendOptions
  ): Promise<string>;
}

export type SolanaCluster = 'mainnet-beta' | 'testnet' | 'devnet';

// ============================================
// Cluster Configuration
// ============================================

const HELIUS_API_KEY = process.env.NEXT_PUBLIC_HELIUS_API_KEY || '';

export function getSolanaRpcUrl(cluster: SolanaCluster = 'mainnet-beta'): string {
  // Use Helius RPC if configured
  if (HELIUS_API_KEY) {
    if (cluster === 'mainnet-beta') {
      return `https://mainnet.helius-rpc.com/?api-key=${HELIUS_API_KEY}`;
    }
    if (cluster === 'devnet') {
      return `https://devnet.helius-rpc.com/?api-key=${HELIUS_API_KEY}`;
    }
  }
  
  // Fallback to public RPC
  return clusterApiUrl(cluster);
}

export function createSolanaConnection(cluster: SolanaCluster = 'mainnet-beta'): Connection {
  return new Connection(getSolanaRpcUrl(cluster), 'confirmed');
}

// ============================================
// Wallet Detection
// ============================================

interface SolanaWindowWallet {
  isPhantom?: boolean;
  isSolflare?: boolean;
  isBackpack?: boolean;
  isMagicEden?: boolean;
  isGlow?: boolean;
  isBrave?: boolean;
  signTransaction<T extends Transaction | VersionedTransaction>(transaction: T): Promise<T>;
  signAllTransactions<T extends Transaction | VersionedTransaction>(transactions: T[]): Promise<T[]>;
  signMessage(message: Uint8Array, display?: 'utf8' | 'hex'): Promise<{ signature: Uint8Array }>;
  connect(): Promise<{ publicKey: PublicKey }>;
  disconnect(): Promise<void>;
  publicKey?: PublicKey;
}

export interface DetectedWallet {
  name: string;
  icon: string;
  provider: SolanaWindowWallet;
}

/**
 * Detect installed Solana wallets
 */
export function detectSolanaWallets(): DetectedWallet[] {
  if (typeof window === 'undefined') return [];
  
  const wallets: DetectedWallet[] = [];
  const win = window as any;
  
  // Check for Phantom
  if (win.phantom?.solana?.isPhantom) {
    wallets.push({
      name: 'Phantom',
      icon: 'https://raw.githubusercontent.com/solana-labs/wallet-adapter/master/packages/wallets/icons/phantom.svg',
      provider: win.phantom.solana,
    });
  }
  
  // Check for Solflare
  if (win.solflare?.isSolflare) {
    wallets.push({
      name: 'Solflare',
      icon: 'https://raw.githubusercontent.com/solana-labs/wallet-adapter/master/packages/wallets/icons/solflare.svg',
      provider: win.solflare,
    });
  }
  
  // Check for Backpack
  if (win.backpack?.isBackpack) {
    wallets.push({
      name: 'Backpack',
      icon: 'https://raw.githubusercontent.com/solana-labs/wallet-adapter/master/packages/wallets/icons/backpack.svg',
      provider: win.backpack,
    });
  }
  
  // Check for Magic Eden
  if (win.magicEden?.solana) {
    wallets.push({
      name: 'Magic Eden',
      icon: 'https://www.magiceden.io/img/favicon.ico',
      provider: win.magicEden.solana,
    });
  }
  
  // Check for Glow
  if (win.glow?.isGlow) {
    wallets.push({
      name: 'Glow',
      icon: 'https://glow.app/favicon.ico',
      provider: win.glow,
    });
  }
  
  // Check for Brave Wallet (Solana)
  if (win.braveSolana?.isBrave) {
    wallets.push({
      name: 'Brave Wallet',
      icon: 'https://brave.com/static-assets/images/brave-logo-sans-text.svg',
      provider: win.braveSolana,
    });
  }
  
  // Check for standard Solana provider
  if (win.solana && !wallets.find(w => w.provider === win.solana)) {
    wallets.push({
      name: 'Solana Wallet',
      icon: 'https://solana.com/favicon.ico',
      provider: win.solana,
    });
  }
  
  return wallets;
}

/**
 * Check if Phantom is installed
 */
export function isPhantomInstalled(): boolean {
  if (typeof window === 'undefined') return false;
  return Boolean((window as any).phantom?.solana?.isPhantom);
}

/**
 * Check if Solflare is installed
 */
export function isSolflareInstalled(): boolean {
  if (typeof window === 'undefined') return false;
  return Boolean((window as any).solflare?.isSolflare);
}

// ============================================
// Wallet Operations
// ============================================

/**
 * Connect to a Solana wallet
 */
export async function connectSolanaWallet(wallet: DetectedWallet): Promise<{
  publicKey: string;
  wallet: DetectedWallet;
}> {
  try {
    const response = await wallet.provider.connect();
    const publicKey = response.publicKey || wallet.provider.publicKey;
    
    if (!publicKey) {
      throw new Error('Failed to get public key');
    }
    
    return {
      publicKey: publicKey.toBase58(),
      wallet,
    };
  } catch (error) {
    console.error('Failed to connect wallet:', error);
    throw error;
  }
}

/**
 * Disconnect from a Solana wallet
 */
export async function disconnectSolanaWallet(wallet: DetectedWallet): Promise<void> {
  try {
    await wallet.provider.disconnect();
  } catch (error) {
    console.error('Failed to disconnect wallet:', error);
    throw error;
  }
}

/**
 * Sign a message with Solana wallet
 */
export async function signSolanaMessage(
  wallet: DetectedWallet,
  message: string
): Promise<string> {
  const encodedMessage = new TextEncoder().encode(message);
  const { signature } = await wallet.provider.signMessage(encodedMessage, 'utf8');
  
  // Convert to base58
  return Buffer.from(signature).toString('base64');
}

/**
 * Sign a Solana transaction
 */
export async function signSolanaTransaction<T extends Transaction | VersionedTransaction>(
  wallet: DetectedWallet,
  transaction: T
): Promise<T> {
  return wallet.provider.signTransaction(transaction);
}

/**
 * Sign and send a Solana transaction
 */
export async function signAndSendSolanaTransaction(
  wallet: DetectedWallet,
  transaction: Transaction | VersionedTransaction,
  connection: Connection,
  options?: SendOptions
): Promise<string> {
  return wallet.provider.sendTransaction(transaction, connection, options);
}

// ============================================
// Transaction Building
// ============================================

import { SystemProgram, LAMPORTS_PER_SOL } from '@solana/web3.js';

/**
 * Create a SOL transfer transaction
 */
export async function createSolTransferTransaction(
  connection: Connection,
  from: PublicKey,
  to: PublicKey,
  amountSol: number
): Promise<Transaction> {
  const transaction = new Transaction().add(
    SystemProgram.transfer({
      fromPubkey: from,
      toPubkey: to,
      lamports: Math.floor(amountSol * LAMPORTS_PER_SOL),
    })
  );
  
  const { blockhash, lastValidBlockHeight } = await connection.getLatestBlockhash();
  transaction.recentBlockhash = blockhash;
  transaction.lastValidBlockHeight = lastValidBlockHeight;
  transaction.feePayer = from;
  
  return transaction;
}

/**
 * Create an SPL token transfer transaction
 */
export async function createTokenTransferTransaction(
  connection: Connection,
  from: PublicKey,
  to: PublicKey,
  mint: PublicKey,
  amount: bigint,
  decimals: number
): Promise<Transaction> {
  const { 
    getAssociatedTokenAddress, 
    createTransferInstruction,
    createAssociatedTokenAccountInstruction,
    getAccount,
  } = await import('@solana/spl-token');
  
  const fromAta = await getAssociatedTokenAddress(mint, from);
  const toAta = await getAssociatedTokenAddress(mint, to);
  
  const transaction = new Transaction();
  
  // Check if destination ATA exists
  try {
    await getAccount(connection, toAta);
  } catch {
    // Create ATA if it doesn't exist
    transaction.add(
      createAssociatedTokenAccountInstruction(
        from, // payer
        toAta, // ata
        to, // owner
        mint // mint
      )
    );
  }
  
  // Add transfer instruction
  transaction.add(
    createTransferInstruction(
      fromAta,
      toAta,
      from,
      amount
    )
  );
  
  const { blockhash, lastValidBlockHeight } = await connection.getLatestBlockhash();
  transaction.recentBlockhash = blockhash;
  transaction.lastValidBlockHeight = lastValidBlockHeight;
  transaction.feePayer = from;
  
  return transaction;
}

// ============================================
// Balance Queries
// ============================================

/**
 * Get SOL balance
 */
export async function getSolBalance(
  connection: Connection,
  publicKey: PublicKey
): Promise<number> {
  const balance = await connection.getBalance(publicKey);
  return balance / LAMPORTS_PER_SOL;
}

/**
 * Get token balance
 */
export async function getTokenBalance(
  connection: Connection,
  publicKey: PublicKey,
  mint: PublicKey
): Promise<bigint> {
  const { getAssociatedTokenAddress, getAccount } = await import('@solana/spl-token');
  
  try {
    const ata = await getAssociatedTokenAddress(mint, publicKey);
    const account = await getAccount(connection, ata);
    return account.amount;
  } catch {
    return BigInt(0);
  }
}

// ============================================
// Transaction Status
// ============================================

/**
 * Wait for transaction confirmation
 */
export async function waitForConfirmation(
  connection: Connection,
  signature: string,
  maxRetries = 30
): Promise<{ success: boolean; error?: string }> {
  let retries = 0;
  
  while (retries < maxRetries) {
    const status = await connection.getSignatureStatus(signature);
    
    if (status?.value?.confirmationStatus === 'confirmed' || 
        status?.value?.confirmationStatus === 'finalized') {
      if (status.value.err) {
        return { success: false, error: JSON.stringify(status.value.err) };
      }
      return { success: true };
    }
    
    await new Promise(resolve => setTimeout(resolve, 1000));
    retries++;
  }
  
  return { success: false, error: 'Transaction confirmation timeout' };
}

/**
 * Get transaction details
 */
export async function getTransactionDetails(
  connection: Connection,
  signature: string
) {
  return connection.getParsedTransaction(signature, {
    maxSupportedTransactionVersion: 0,
  });
}

// ============================================
// Chain ID Helpers
// ============================================

export function getSolanaChainId(cluster: SolanaCluster): number {
  switch (cluster) {
    case 'mainnet-beta':
      return 101;
    case 'testnet':
      return 102;
    case 'devnet':
      return 103;
    default:
      return 101;
  }
}

export function getClusterFromChainId(chainId: number): SolanaCluster {
  switch (chainId) {
    case 101:
      return 'mainnet-beta';
    case 102:
      return 'testnet';
    case 103:
      return 'devnet';
    default:
      return 'mainnet-beta';
  }
}
