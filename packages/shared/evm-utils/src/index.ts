/**
 * @universal-crypto-mcp/evm-utils
 * 
 * EVM helper utilities for Universal Crypto MCP
 */

import {
  createPublicClient,
  createWalletClient,
  http,
  type Address,
  type Chain,
  type PublicClient,
  type WalletClient,
  type Transport,
  formatEther,
  formatUnits,
  parseEther,
  parseUnits,
} from 'viem';
import { privateKeyToAccount } from 'viem/accounts';

// ============================================================================
// Client Creation
// ============================================================================

export interface ClientOptions {
  chain: Chain;
  rpcUrl?: string;
}

export interface WalletClientOptions extends ClientOptions {
  privateKey: `0x${string}`;
}

/**
 * Creates a public client for reading blockchain state
 */
export function createReadClient(options: ClientOptions): PublicClient {
  const { chain, rpcUrl } = options;
  return createPublicClient({
    chain,
    transport: http(rpcUrl),
  });
}

/**
 * Creates a wallet client for signing transactions
 */
export function createSignerClient(
  options: WalletClientOptions
): WalletClient {
  const { chain, rpcUrl, privateKey } = options;
  const account = privateKeyToAccount(privateKey);
  
  return createWalletClient({
    account,
    chain,
    transport: http(rpcUrl),
  });
}

// ============================================================================
// Balance Utilities
// ============================================================================

/**
 * Gets the native balance of an address
 */
export async function getNativeBalance(
  client: PublicClient,
  address: Address
): Promise<bigint> {
  return client.getBalance({ address });
}

/**
 * Formats native balance to human-readable string
 */
export function formatNativeBalance(
  balance: bigint,
  decimals: number = 18
): string {
  return formatUnits(balance, decimals);
}

// ============================================================================
// Transaction Utilities
// ============================================================================

export interface TransactionConfig {
  to: Address;
  value?: bigint;
  data?: `0x${string}`;
  gasLimit?: bigint;
}

/**
 * Estimates gas for a transaction
 */
export async function estimateGas(
  client: PublicClient,
  config: TransactionConfig & { from: Address }
): Promise<bigint> {
  return client.estimateGas({
    account: config.from,
    to: config.to,
    value: config.value,
    data: config.data,
  });
}

/**
 * Gets current gas price
 */
export async function getGasPrice(client: PublicClient): Promise<bigint> {
  return client.getGasPrice();
}

// ============================================================================
// Contract Utilities
// ============================================================================

/**
 * Reads a contract function
 */
export async function readContract<T>(
  client: PublicClient,
  config: {
    address: Address;
    abi: readonly unknown[];
    functionName: string;
    args?: readonly unknown[];
  }
): Promise<T> {
  return client.readContract(config) as Promise<T>;
}

// ============================================================================
// Re-exports from viem for convenience
// ============================================================================

export {
  formatEther,
  formatUnits,
  parseEther,
  parseUnits,
  type Address,
  type Chain,
  type PublicClient,
  type WalletClient,
  type Transport,
};

// Export version
export const VERSION = '1.0.0';
export const PACKAGE_NAME = '@universal-crypto-mcp/evm-utils';
