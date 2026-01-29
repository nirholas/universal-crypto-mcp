/**
 * Core types for Universal Crypto MCP
 * 
 * @author nich
 * @license Apache-2.0
 * @see https://github.com/nirholas/universal-crypto-mcp
 * @see https://x.com/nichxbt
 */

import { z } from 'zod';

// ============================================================================
// Network Types
// ============================================================================

export const NetworkSchema = z.object({
  chainId: z.number(),
  name: z.string(),
  rpcUrl: z.string().url(),
  nativeCurrency: z.object({
    name: z.string(),
    symbol: z.string(),
    decimals: z.number(),
  }),
  blockExplorer: z.string().url().optional(),
});

export type Network = z.infer<typeof NetworkSchema>;

// ============================================================================
// Wallet Types
// ============================================================================

export const WalletSchema = z.object({
  address: z.string().regex(/^0x[a-fA-F0-9]{40}$/),
  chainId: z.number().optional(),
});

export type Wallet = z.infer<typeof WalletSchema>;

// ============================================================================
// Token Types
// ============================================================================

export const TokenSchema = z.object({
  address: z.string().regex(/^0x[a-fA-F0-9]{40}$/),
  symbol: z.string(),
  name: z.string(),
  decimals: z.number(),
  chainId: z.number(),
  logoURI: z.string().url().optional(),
});

export type Token = z.infer<typeof TokenSchema>;

// ============================================================================
// Transaction Types
// ============================================================================

export const TransactionSchema = z.object({
  hash: z.string().regex(/^0x[a-fA-F0-9]{64}$/),
  from: z.string(),
  to: z.string().optional(),
  value: z.string(),
  data: z.string().optional(),
  chainId: z.number(),
  status: z.enum(['pending', 'confirmed', 'failed']).optional(),
});

export type Transaction = z.infer<typeof TransactionSchema>;

// ============================================================================
// Price Types
// ============================================================================

export const PriceDataSchema = z.object({
  symbol: z.string(),
  price: z.number(),
  change24h: z.number().optional(),
  volume24h: z.number().optional(),
  marketCap: z.number().optional(),
  timestamp: z.number(),
});

export type PriceData = z.infer<typeof PriceDataSchema>;

// ============================================================================
// MCP Tool Response Types
// ============================================================================

export interface ToolResponse<T = unknown> {
  success: boolean;
  data?: T;
  error?: string;
  metadata?: {
    executionTime?: number;
    network?: string;
    [key: string]: unknown;
  };
}

// ============================================================================
// x402 Payment Types
// ============================================================================

export const X402PaymentSchema = z.object({
  payTo: z.string(),
  price: z.string(),
  network: z.string(),
  token: z.string().optional(),
});

export type X402Payment = z.infer<typeof X402PaymentSchema>;

// ============================================================================
// Configuration Types
// ============================================================================

export interface MCPServerConfig {
  name: string;
  version: string;
  description?: string;
  transport?: 'stdio' | 'sse' | 'http';
  port?: number;
  x402?: X402Payment;
}
