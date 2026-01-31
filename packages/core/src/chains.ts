/**
 * Chain configurations for Universal Crypto MCP
 * 
 * This module provides comprehensive chain configuration for all supported
 * EVM-compatible networks. It uses CAIP-2 identifiers for chain addressing
 * and integrates with viem for chain definitions.
 * 
 * @module @universal-crypto-mcp/core/chains
 * @category Core
 * 
 * @example
 * ```typescript
 * import { getChain, getChainName, getTxExplorerUrl } from '@universal-crypto-mcp/core';
 * 
 * const base = getChain('eip155:8453');
 * console.log(getChainName('eip155:8453')); // "Base"
 * 
 * const txUrl = getTxExplorerUrl('eip155:1', '0x1234...');
 * console.log(txUrl); // "https://etherscan.io/tx/0x1234..."
 * ```
 */

import { defineChain } from "viem";
import { mainnet, arbitrum, base, baseSepolia, polygon, optimism, bsc } from "viem/chains";

// ============================================================================
// Supported Chains
// ============================================================================

export const SUPPORTED_CHAINS = {
  "eip155:1": mainnet,
  "eip155:42161": arbitrum,
  "eip155:8453": base,
  "eip155:84532": baseSepolia,
  "eip155:137": polygon,
  "eip155:10": optimism,
  "eip155:56": bsc,
} as const;

export type SupportedChainId = keyof typeof SUPPORTED_CHAINS;

// ============================================================================
// Chain Utilities
// ============================================================================

/**
 * Gets a chain by its CAIP-2 identifier
 */
export function getChain(caip2Id: string) {
  return SUPPORTED_CHAINS[caip2Id as SupportedChainId];
}

/**
 * Gets the numeric chain ID from a CAIP-2 identifier
 */
export function getChainId(caip2Id: string): number {
  const chain = getChain(caip2Id);
  return chain?.id ?? 0;
}

/**
 * Gets the CAIP-2 identifier from a numeric chain ID
 */
export function getCaip2Id(chainId: number): string | undefined {
  const entry = Object.entries(SUPPORTED_CHAINS).find(
    ([_, chain]) => chain.id === chainId
  );
  return entry?.[0];
}

/**
 * Checks if a chain is supported
 */
export function isChainSupported(caip2Id: string): boolean {
  return caip2Id in SUPPORTED_CHAINS;
}

// ============================================================================
// Chain Names
// ============================================================================

export const CHAIN_NAMES: Record<SupportedChainId, string> = {
  "eip155:1": "Ethereum",
  "eip155:42161": "Arbitrum One",
  "eip155:8453": "Base",
  "eip155:84532": "Base Sepolia",
  "eip155:137": "Polygon",
  "eip155:10": "Optimism",
  "eip155:56": "BNB Chain",
};

/**
 * Gets the human-readable name for a chain
 */
export function getChainName(caip2Id: string): string {
  return CHAIN_NAMES[caip2Id as SupportedChainId] ?? "Unknown Chain";
}

// ============================================================================
// RPC URLs
// ============================================================================

export const DEFAULT_RPC_URLS: Record<SupportedChainId, string> = {
  "eip155:1": "https://eth.llamarpc.com",
  "eip155:42161": "https://arb1.arbitrum.io/rpc",
  "eip155:8453": "https://mainnet.base.org",
  "eip155:84532": "https://sepolia.base.org",
  "eip155:137": "https://polygon-rpc.com",
  "eip155:10": "https://mainnet.optimism.io",
  "eip155:56": "https://bsc-dataseed.binance.org",
};

/**
 * Gets the default RPC URL for a chain
 */
export function getDefaultRpcUrl(caip2Id: string): string | undefined {
  return DEFAULT_RPC_URLS[caip2Id as SupportedChainId];
}

// ============================================================================
// Explorer URLs
// ============================================================================

export const EXPLORER_URLS: Record<SupportedChainId, string> = {
  "eip155:1": "https://etherscan.io",
  "eip155:42161": "https://arbiscan.io",
  "eip155:8453": "https://basescan.org",
  "eip155:84532": "https://sepolia.basescan.org",
  "eip155:137": "https://polygonscan.com",
  "eip155:10": "https://optimistic.etherscan.io",
  "eip155:56": "https://bscscan.com",
};

/**
 * Gets the block explorer URL for a chain
 */
export function getExplorerUrl(caip2Id: string): string | undefined {
  return EXPLORER_URLS[caip2Id as SupportedChainId];
}

/**
 * Gets a transaction URL on the block explorer
 */
export function getTxExplorerUrl(caip2Id: string, txHash: string): string | undefined {
  const baseUrl = getExplorerUrl(caip2Id);
  return baseUrl ? `${baseUrl}/tx/${txHash}` : undefined;
}

/**
 * Gets an address URL on the block explorer
 */
export function getAddressExplorerUrl(caip2Id: string, address: string): string | undefined {
  const baseUrl = getExplorerUrl(caip2Id);
  return baseUrl ? `${baseUrl}/address/${address}` : undefined;
}

// ============================================================================
// Chain Lists
// ============================================================================

/**
 * Gets all supported chain IDs
 */
export function getSupportedChainIds(): SupportedChainId[] {
  return Object.keys(SUPPORTED_CHAINS) as SupportedChainId[];
}

/**
 * Gets all mainnet chains (excludes testnets)
 */
export function getMainnetChains(): SupportedChainId[] {
  return getSupportedChainIds().filter(id => !id.includes('sepolia'));
}

/**
 * Gets all testnet chains
 */
export function getTestnetChains(): SupportedChainId[] {
  return getSupportedChainIds().filter(id => id.includes('sepolia'));
}
