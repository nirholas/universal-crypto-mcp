/**
 * Core types for Universal Crypto MCP
 * 
 * This module provides the foundational type definitions used across all
 * Universal Crypto MCP packages. It includes network configurations,
 * wallet types, token definitions, transaction schemas, and MCP-specific types.
 * 
 * @module @universal-crypto-mcp/core/types
 * @author nich
 * @license Apache-2.0
 * @see https://github.com/nirholas/universal-crypto-mcp
 * @see https://x.com/nichxbt
 * 
 * @example
 * ```typescript
 * import { Network, Token, Transaction } from '@universal-crypto-mcp/core';
 * 
 * const ethereum: Network = {
 *   chainId: 1,
 *   name: 'Ethereum Mainnet',
 *   rpcUrl: 'https://eth.llamarpc.com',
 *   nativeCurrency: { name: 'Ether', symbol: 'ETH', decimals: 18 },
 *   blockExplorer: 'https://etherscan.io',
 * };
 * ```
 */

import { z } from 'zod';

// ============================================================================
// Network Types
// ============================================================================

/**
 * Zod schema for validating blockchain network configurations.
 * 
 * @category Core
 * @example
 * ```typescript
 * const result = NetworkSchema.safeParse({
 *   chainId: 1,
 *   name: 'Ethereum',
 *   rpcUrl: 'https://eth.llamarpc.com',
 *   nativeCurrency: { name: 'Ether', symbol: 'ETH', decimals: 18 },
 * });
 * ```
 */
export const NetworkSchema = z.object({
  /** The unique chain identifier (e.g., 1 for Ethereum Mainnet) */
  chainId: z.number(),
  /** Human-readable network name */
  name: z.string(),
  /** JSON-RPC endpoint URL for the network */
  rpcUrl: z.string().url(),
  /** Native currency configuration */
  nativeCurrency: z.object({
    /** Full name of the native currency (e.g., "Ether") */
    name: z.string(),
    /** Symbol of the native currency (e.g., "ETH") */
    symbol: z.string(),
    /** Decimal places for the currency (typically 18) */
    decimals: z.number(),
  }),
  /** Optional block explorer URL */
  blockExplorer: z.string().url().optional(),
});

/**
 * Represents a blockchain network configuration.
 * 
 * Networks define the connection parameters and metadata for interacting
 * with a specific blockchain. Universal Crypto MCP supports 60+ networks.
 * 
 * @category Core
 * @example
 * ```typescript
 * const base: Network = {
 *   chainId: 8453,
 *   name: 'Base',
 *   rpcUrl: 'https://mainnet.base.org',
 *   nativeCurrency: { name: 'Ether', symbol: 'ETH', decimals: 18 },
 *   blockExplorer: 'https://basescan.org',
 * };
 * ```
 */
export type Network = z.infer<typeof NetworkSchema>;

// ============================================================================
// Wallet Types
// ============================================================================

/**
 * Zod schema for validating wallet addresses.
 * 
 * @category Wallets
 */
export const WalletSchema = z.object({
  /** EVM-compatible wallet address (0x-prefixed, 40 hex characters) */
  address: z.string().regex(/^0x[a-fA-F0-9]{40}$/),
  /** Optional chain ID the wallet is connected to */
  chainId: z.number().optional(),
});

/**
 * Represents an EVM wallet address with optional chain binding.
 * 
 * @category Wallets
 * @example
 * ```typescript
 * const wallet: Wallet = {
 *   address: '0x742d35Cc6634C0532925a3b844Bc9e7595f1b3e1',
 *   chainId: 1,
 * };
 * ```
 */
export type Wallet = z.infer<typeof WalletSchema>;

// ============================================================================
// Token Types
// ============================================================================

/**
 * Zod schema for validating ERC-20 token configurations.
 * 
 * @category Tokens
 */
export const TokenSchema = z.object({
  /** Token contract address */
  address: z.string().regex(/^0x[a-fA-F0-9]{40}$/),
  /** Token symbol (e.g., "USDC") */
  symbol: z.string(),
  /** Full token name (e.g., "USD Coin") */
  name: z.string(),
  /** Decimal places for the token */
  decimals: z.number(),
  /** Chain ID where the token is deployed */
  chainId: z.number(),
  /** Optional logo image URL */
  logoURI: z.string().url().optional(),
});

/**
 * Represents an ERC-20 compatible token.
 * 
 * Tokens are the fundamental unit of value in DeFi. This type captures
 * all metadata needed to interact with a token across chains.
 * 
 * @category Tokens
 * @example
 * ```typescript
 * const usdc: Token = {
 *   address: '0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48',
 *   symbol: 'USDC',
 *   name: 'USD Coin',
 *   decimals: 6,
 *   chainId: 1,
 *   logoURI: 'https://assets.coingecko.com/coins/images/6319/small/USD_Coin_icon.png',
 * };
 * ```
 */
export type Token = z.infer<typeof TokenSchema>;

// ============================================================================
// Transaction Types
// ============================================================================

/**
 * Zod schema for validating blockchain transactions.
 * 
 * @category Transactions
 */
export const TransactionSchema = z.object({
  /** Transaction hash (0x-prefixed, 64 hex characters) */
  hash: z.string().regex(/^0x[a-fA-F0-9]{64}$/),
  /** Sender address */
  from: z.string(),
  /** Recipient address (undefined for contract deployments) */
  to: z.string().optional(),
  /** Value transferred in wei (as string for precision) */
  value: z.string(),
  /** Optional calldata for contract interactions */
  data: z.string().optional(),
  /** Chain ID where the transaction was submitted */
  chainId: z.number(),
  /** Current transaction status */
  status: z.enum(['pending', 'confirmed', 'failed']).optional(),
});

/**
 * Represents a blockchain transaction.
 * 
 * Transactions are the fundamental unit of state change on blockchains.
 * This type captures the core transaction data needed for tracking and display.
 * 
 * @category Transactions
 * @example
 * ```typescript
 * const tx: Transaction = {
 *   hash: '0x1234567890abcdef1234567890abcdef1234567890abcdef1234567890abcdef',
 *   from: '0x742d35Cc6634C0532925a3b844Bc9e7595f1b3e1',
 *   to: '0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48',
 *   value: '1000000000000000000',
 *   chainId: 1,
 *   status: 'confirmed',
 * };
 * ```
 */
export type Transaction = z.infer<typeof TransactionSchema>;

// ============================================================================
// Price Types
// ============================================================================

/**
 * Zod schema for validating price data.
 * 
 * @category Market Data
 */
export const PriceDataSchema = z.object({
  /** Token or asset symbol */
  symbol: z.string(),
  /** Current price in USD */
  price: z.number(),
  /** 24-hour price change percentage */
  change24h: z.number().optional(),
  /** 24-hour trading volume in USD */
  volume24h: z.number().optional(),
  /** Market capitalization in USD */
  marketCap: z.number().optional(),
  /** Unix timestamp of the price data */
  timestamp: z.number(),
});

/**
 * Represents market price data for a token or asset.
 * 
 * @category Market Data
 * @example
 * ```typescript
 * const btcPrice: PriceData = {
 *   symbol: 'BTC',
 *   price: 45000.50,
 *   change24h: 2.5,
 *   volume24h: 25000000000,
 *   marketCap: 880000000000,
 *   timestamp: Date.now(),
 * };
 * ```
 */
export type PriceData = z.infer<typeof PriceDataSchema>;

// ============================================================================
// MCP Tool Response Types
// ============================================================================

/**
 * Standard response wrapper for MCP tool executions.
 * 
 * All MCP tools return responses in this format, providing consistent
 * error handling and metadata across the platform.
 * 
 * @template T - The type of data returned on success
 * @category MCP
 * @example
 * ```typescript
 * const response: ToolResponse<PriceData> = {
 *   success: true,
 *   data: { symbol: 'ETH', price: 3500, timestamp: Date.now() },
 *   metadata: { executionTime: 150, network: 'ethereum' },
 * };
 * ```
 */
export interface ToolResponse<T = unknown> {
  /** Whether the tool execution succeeded */
  success: boolean;
  /** The response data (present when success is true) */
  data?: T;
  /** Error message (present when success is false) */
  error?: string;
  /** Optional metadata about the execution */
  metadata?: {
    /** Execution time in milliseconds */
    executionTime?: number;
    /** Network used for the operation */
    network?: string;
    /** Additional custom metadata */
    [key: string]: unknown;
  };
}

// ============================================================================
// x402 Payment Types
// ============================================================================

/**
 * Zod schema for validating x402 payment configurations.
 * 
 * @category Payments
 */
export const X402PaymentSchema = z.object({
  /** Address to receive payments */
  payTo: z.string(),
  /** Price per request (in token units) */
  price: z.string(),
  /** Network for payments (e.g., "base", "ethereum") */
  network: z.string(),
  /** Optional token address (defaults to native currency) */
  token: z.string().optional(),
});

/**
 * Configuration for x402 HTTP Payment Required protocol.
 * 
 * x402 enables pay-per-request APIs where AI agents can autonomously
 * pay for API access using cryptocurrency.
 * 
 * @category Payments
 * @see https://www.x402.org
 * @example
 * ```typescript
 * const payment: X402Payment = {
 *   payTo: '0x742d35Cc6634C0532925a3b844Bc9e7595f1b3e1',
 *   price: '0.001',
 *   network: 'base',
 *   token: '0x833589fCD6eDb6E08f4c7C32D4f71b54bdA02913', // USDC on Base
 * };
 * ```
 */
export type X402Payment = z.infer<typeof X402PaymentSchema>;

// ============================================================================
// Configuration Types
// ============================================================================

/**
 * Configuration options for an MCP server instance.
 * 
 * This interface defines all configuration options available when
 * creating a new Universal Crypto MCP server.
 * 
 * @category MCP
 * @example
 * ```typescript
 * const config: MCPServerConfig = {
 *   name: 'my-crypto-mcp',
 *   version: '1.0.0',
 *   description: 'Custom crypto tools for AI agents',
 *   transport: 'http',
 *   port: 3000,
 *   x402: {
 *     payTo: '0x...',
 *     price: '0.01',
 *     network: 'base',
 *   },
 * };
 * ```
 */
export interface MCPServerConfig {
  /** Server name identifier */
  name: string;
  /** Semantic version string */
  version: string;
  /** Human-readable description */
  description?: string;
  /** Transport protocol for MCP communication */
  transport?: 'stdio' | 'sse' | 'http';
  /** Port number for HTTP/SSE transports */
  port?: number;
  /** Optional x402 payment configuration for monetized APIs */
  x402?: X402Payment;
}
