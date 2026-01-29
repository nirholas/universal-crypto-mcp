/**
 * Core Blockchain Types
 * Shared types for Solana and EVM blockchain interactions
 */

// Network types
export type SolanaNetwork = 'mainnet-beta' | 'devnet' | 'testnet' | 'localnet';
export type EVMNetwork = 'ethereum' | 'polygon' | 'arbitrum' | 'optimism' | 'base' | 'bsc' | 'avalanche';
export type BlockchainNetwork = SolanaNetwork | EVMNetwork;

// Transaction types
export interface TransactionResult {
  signature: string;
  slot?: number;
  blockTime?: number;
  confirmations?: number;
  err?: string | null;
}

export type TransactionStatus = 'pending' | 'confirmed' | 'finalized' | 'failed';

export interface GasEstimate {
  baseFee: bigint;
  priorityFee: bigint;
  totalFee: bigint;
  estimatedUnits: number;
}

// Account types
export interface AccountInfo {
  address: string;
  lamports?: bigint;
  balance?: bigint;
  owner?: string;
  executable?: boolean;
  rentEpoch?: number;
  data?: Buffer;
}

export interface TokenBalance {
  mint: string;
  owner: string;
  amount: bigint;
  decimals: number;
  uiAmount: number;
  symbol?: string;
  name?: string;
}

export interface SignedTransaction {
  serialized: Uint8Array;
  signature: string;
  signers: string[];
}
