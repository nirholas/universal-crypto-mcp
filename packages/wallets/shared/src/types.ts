/**
 * @universal-crypto-mcp/wallets-shared
 * 
 * Zod schemas for wallet request validation
 * 
 * @author nich
 * @license Apache-2.0
 * @see https://github.com/nirholas/universal-crypto-mcp
 */

import { z } from "zod";

// ============================================================================
// Address Validation
// ============================================================================

/**
 * EVM address pattern (0x + 40 hex characters)
 */
export const EVMAddressSchema = z
  .string()
  .regex(/^0x[a-fA-F0-9]{40}$/, "Invalid EVM address");

/**
 * Solana address pattern (32-44 base58 characters)
 */
export const SolanaAddressSchema = z
  .string()
  .regex(/^[1-9A-HJ-NP-Za-km-z]{32,44}$/, "Invalid Solana address");

// ============================================================================
// Balance Requests
// ============================================================================

/**
 * Request to get balance
 */
export const BalanceRequestSchema = z.object({
  /** Address to check (defaults to wallet address) */
  address: z.string().optional().describe("Address to check balance for"),
  /** Token address for token balance */
  token: z.string().optional().describe("Token contract/mint address"),
});

export type BalanceRequest = z.infer<typeof BalanceRequestSchema>;

// ============================================================================
// Transfer Requests
// ============================================================================

/**
 * Request to transfer tokens
 */
export const TransferRequestSchema = z.object({
  /** Recipient address */
  to: z.string().describe("Recipient address"),
  /** Amount to transfer */
  amount: z.string().describe("Amount to transfer"),
  /** Token address (for token transfers) */
  token: z.string().optional().describe("Token contract/mint address"),
  /** Memo/note for the transaction */
  memo: z.string().optional().describe("Optional memo for the transaction"),
});

export type TransferRequest = z.infer<typeof TransferRequestSchema>;

// ============================================================================
// Signing Requests
// ============================================================================

/**
 * Request to sign a message
 */
export const SignMessageRequestSchema = z.object({
  /** Message to sign */
  message: z.string().describe("Message to sign"),
});

export type SignMessageRequest = z.infer<typeof SignMessageRequestSchema>;

/**
 * Request to sign typed data (EIP-712)
 */
export const SignTypedDataRequestSchema = z.object({
  /** Domain separator */
  domain: z.record(z.unknown()).describe("Domain separator"),
  /** Type definitions */
  types: z.record(z.array(z.object({
    name: z.string(),
    type: z.string(),
  }))).describe("Type definitions"),
  /** Primary type */
  primaryType: z.string().describe("Primary type name"),
  /** Message data */
  message: z.record(z.unknown()).describe("Message data"),
});

export type SignTypedDataRequest = z.infer<typeof SignTypedDataRequestSchema>;

// ============================================================================
// Transaction Requests
// ============================================================================

/**
 * Request to send a transaction
 */
export const SendTransactionRequestSchema = z.object({
  /** Recipient address */
  to: z.string().describe("Recipient address"),
  /** Value to send (in native token) */
  value: z.string().optional().describe("Value to send"),
  /** Transaction data */
  data: z.string().optional().describe("Transaction data (hex encoded)"),
  /** Gas limit */
  gasLimit: z.string().optional().describe("Gas limit"),
});

export type SendTransactionRequest = z.infer<typeof SendTransactionRequestSchema>;

// ============================================================================
// Token Requests
// ============================================================================

/**
 * Request to get token information
 */
export const TokenInfoRequestSchema = z.object({
  /** Token contract/mint address */
  address: z.string().describe("Token contract/mint address"),
});

export type TokenInfoRequest = z.infer<typeof TokenInfoRequestSchema>;

/**
 * Request to list tokens
 */
export const ListTokensRequestSchema = z.object({
  /** Include zero balances */
  includeZeroBalance: z.boolean().optional().default(false),
});

export type ListTokensRequest = z.infer<typeof ListTokensRequestSchema>;

// ============================================================================
// NFT Requests
// ============================================================================

/**
 * Request to get NFT information
 */
export const NFTInfoRequestSchema = z.object({
  /** Collection address */
  collection: z.string().describe("NFT collection/contract address"),
  /** Token ID */
  tokenId: z.string().describe("NFT token ID"),
});

export type NFTInfoRequest = z.infer<typeof NFTInfoRequestSchema>;

/**
 * Request to transfer an NFT
 */
export const TransferNFTRequestSchema = z.object({
  /** Collection address */
  collection: z.string().describe("NFT collection/contract address"),
  /** Token ID */
  tokenId: z.string().describe("NFT token ID"),
  /** Recipient address */
  to: z.string().describe("Recipient address"),
});

export type TransferNFTRequest = z.infer<typeof TransferNFTRequestSchema>;

/**
 * Request to list NFTs
 */
export const ListNFTsRequestSchema = z.object({
  /** Address to check (defaults to wallet address) */
  address: z.string().optional().describe("Address to check"),
  /** Filter by collection */
  collection: z.string().optional().describe("Filter by collection address"),
});

export type ListNFTsRequest = z.infer<typeof ListNFTsRequestSchema>;

// ============================================================================
// Wallet Configuration
// ============================================================================

/**
 * Wallet configuration schema
 */
export const WalletConfigSchema = z.object({
  /** Private key */
  privateKey: z.string().describe("Private key (hex for EVM, base58 for Solana)"),
  /** Chain identifier */
  chainId: z.string().describe("Chain identifier (e.g., eip155:1, solana:mainnet)"),
  /** Custom RPC URL */
  rpcUrl: z.string().url().optional().describe("Custom RPC URL"),
});

export type WalletConfigInput = z.infer<typeof WalletConfigSchema>;
