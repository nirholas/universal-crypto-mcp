/**
 * @universal-crypto-mcp/wallet-solana
 * 
 * Solana-specific type definitions
 * 
 * @author nich
 * @license Apache-2.0
 */

import type { PublicKey } from "@solana/web3.js";

/**
 * Solana wallet configuration
 */
export interface SolanaWalletConfig {
  /** Private key as base58 string or Uint8Array */
  privateKey: string | Uint8Array;
  /** Network to connect to */
  network: SolanaNetwork;
  /** Custom RPC URL */
  rpcUrl?: string;
}

/**
 * Supported Solana networks
 */
export type SolanaNetwork = "mainnet" | "devnet" | "testnet" | "localnet";

/**
 * Solana chain ID mapping (CAIP-2 format)
 */
export const SOLANA_CHAIN_IDS: Record<SolanaNetwork, string> = {
  mainnet: "solana:mainnet",
  devnet: "solana:devnet",
  testnet: "solana:testnet",
  localnet: "solana:localnet",
};

/**
 * Default RPC URLs for Solana networks
 */
export const SOLANA_RPC_URLS: Record<SolanaNetwork, string> = {
  mainnet: "https://api.mainnet-beta.solana.com",
  devnet: "https://api.devnet.solana.com",
  testnet: "https://api.testnet.solana.com",
  localnet: "http://localhost:8899",
};

/**
 * SPL Token information
 */
export interface SPLToken {
  /** Token mint address */
  mint: string;
  /** Token account address (for this wallet) */
  tokenAccount?: string;
  /** Token symbol */
  symbol?: string;
  /** Token name */
  name?: string;
  /** Decimal places */
  decimals: number;
  /** Balance (if fetched) */
  balance?: string;
}

/**
 * Solana NFT information
 */
export interface SolanaNFT {
  /** NFT mint address */
  mint: string;
  /** Token account holding the NFT */
  tokenAccount: string;
  /** Metadata account */
  metadataAccount?: string;
  /** NFT name */
  name?: string;
  /** NFT symbol */
  symbol?: string;
  /** Metadata URI */
  uri?: string;
  /** Collection address */
  collection?: string;
}

/**
 * Transaction confirmation status
 */
export type ConfirmationStatus = "processed" | "confirmed" | "finalized";

/**
 * Transaction options
 */
export interface SolanaTransactionOptions {
  /** Skip preflight transaction simulation */
  skipPreflight?: boolean;
  /** Commitment level for confirmation */
  commitment?: ConfirmationStatus;
  /** Max retries for sending */
  maxRetries?: number;
}

/**
 * Signature result with additional Solana-specific info
 */
export interface SolanaSignatureResult {
  /** Transaction signature (base58) */
  signature: string;
  /** Confirmation status */
  confirmationStatus?: ConfirmationStatus;
  /** Slot where transaction was confirmed */
  slot?: number;
  /** Block time (unix timestamp) */
  blockTime?: number;
}

/**
 * Account info
 */
export interface SolanaAccountInfo {
  /** Account public key */
  address: string;
  /** Account lamports balance */
  lamports: string;
  /** Account owner program */
  owner: string;
  /** Is account executable */
  executable: boolean;
  /** Rent epoch */
  rentEpoch: number;
}
