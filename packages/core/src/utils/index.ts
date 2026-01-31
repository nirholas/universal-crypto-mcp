/**
 * Core utilities for Universal Crypto MCP
 * 
 * This module provides essential utility functions used across all packages
 * including address validation, number formatting, JSON handling, and async helpers.
 * 
 * @module @universal-crypto-mcp/core/utils
 * @category Core
 * @author nich
 * @license Apache-2.0
 * 
 * @example
 * ```typescript
 * import { 
 *   isValidAddress, 
 *   formatUnits, 
 *   withRetry, 
 *   truncateAddress 
 * } from '@universal-crypto-mcp/core';
 * 
 * // Validate an address
 * if (isValidAddress('0x742d35Cc6634C0532925a3b844Bc9e7595f1b3e1')) {
 *   console.log('Valid!');
 * }
 * 
 * // Format token amounts
 * const formatted = formatUnits(1000000000000000000n, 18); // "1"
 * 
 * // Truncate for display
 * const short = truncateAddress('0x742d35Cc6634C0532925a3b844Bc9e7595f1b3e1');
 * console.log(short); // "0x742d...b3e1"
 * ```
 */

import type { Address } from 'viem';

// ============================================================================
// Address Utilities
// ============================================================================

/**
 * Validates an Ethereum address format.
 * 
 * Checks if the address is a valid 0x-prefixed 40-character hex string.
 * Does NOT validate checksums - use `checksumAddress` for that.
 * 
 * @param address - The address string to validate
 * @returns True if the address format is valid
 * @category Wallets
 * 
 * @example
 * ```typescript
 * isValidAddress('0x742d35Cc6634C0532925a3b844Bc9e7595f1b3e1'); // true
 * isValidAddress('0x123'); // false
 * isValidAddress('invalid'); // false
 * ```
 */
export function isValidAddress(address: string): address is Address {
  return /^0x[a-fA-F0-9]{40}$/.test(address);
}

/**
 * Validates and returns a checksummed Ethereum address.
 * 
 * @param address - The address to checksum
 * @returns The checksummed address
 * @throws Error if the address format is invalid
 * @category Wallets
 * 
 * @example
 * ```typescript
 * const checksummed = checksumAddress('0x742d35cc6634c0532925a3b844bc9e7595f1b3e1');
 * // Returns: '0x742d35Cc6634C0532925a3b844Bc9e7595f1b3e1'
 * ```
 */
export function checksumAddress(address: string): Address {
  if (!isValidAddress(address)) {
    throw new Error(`Invalid address: ${address}`);
  }
  return address as Address;
}

/**
 * Truncates an address for display purposes.
 * 
 * @param address - The full address to truncate
 * @param chars - Number of characters to show on each end (default: 4)
 * @returns Truncated address like "0x742d...b3e1"
 * @category Wallets
 * 
 * @example
 * ```typescript
 * truncateAddress('0x742d35Cc6634C0532925a3b844Bc9e7595f1b3e1'); 
 * // Returns: "0x742d...b3e1"
 * 
 * truncateAddress('0x742d35Cc6634C0532925a3b844Bc9e7595f1b3e1', 6);
 * // Returns: "0x742d35...f1b3e1"
 * ```
 */
export function truncateAddress(address: string, chars = 4): string {
  if (!isValidAddress(address)) return address;
  return `${address.slice(0, chars + 2)}...${address.slice(-chars)}`;
}

// ============================================================================
// Number Utilities
// ============================================================================

/**
 * Formats a bigint value with decimal places.
 * 
 * Converts a raw token amount (in smallest units) to a human-readable
 * decimal string. This is the inverse of `parseUnits`.
 * 
 * @param value - The raw value as bigint
 * @param decimals - Number of decimal places
 * @returns Formatted decimal string
 * @category Tokens
 * 
 * @example
 * ```typescript
 * // Format 1 ETH (18 decimals)
 * formatUnits(1000000000000000000n, 18); // "1"
 * 
 * // Format 1 USDC (6 decimals)
 * formatUnits(1000000n, 6); // "1"
 * 
 * // Format with fractional part
 * formatUnits(1500000n, 6); // "1.5"
 * ```
 */
export function formatUnits(value: bigint, decimals: number): string {
  const divisor = BigInt(10 ** decimals);
  const integerPart = value / divisor;
  const fractionalPart = value % divisor;
  
  if (fractionalPart === 0n) {
    return integerPart.toString();
  }
  
  const fractionalStr = fractionalPart.toString().padStart(decimals, '0');
  const trimmed = fractionalStr.replace(/0+$/, '');
  
  return `${integerPart}.${trimmed}`;
}

/**
 * Parses a decimal string into bigint with specified decimals.
 * 
 * Converts a human-readable decimal amount to raw token units.
 * This is the inverse of `formatUnits`.
 * 
 * @param value - The decimal string to parse
 * @param decimals - Number of decimal places
 * @returns The value as bigint in smallest units
 * @category Tokens
 * 
 * @example
 * ```typescript
 * // Parse 1 ETH
 * parseUnits("1", 18); // 1000000000000000000n
 * 
 * // Parse 1.5 USDC
 * parseUnits("1.5", 6); // 1500000n
 * 
 * // Parse with many decimals
 * parseUnits("0.001", 18); // 1000000000000000n
 * ```
 */
export function parseUnits(value: string, decimals: number): bigint {
  const [integerPart, fractionalPart = ''] = value.split('.');
  const paddedFractional = fractionalPart.padEnd(decimals, '0').slice(0, decimals);
  return BigInt(integerPart + paddedFractional);
}

/**
 * Formats a number for display with thousands separators.
 * 
 * @param num - The number to format
 * @param decimals - Maximum decimal places (default: 2)
 * @returns Formatted string with commas
 * @category Market Data
 * 
 * @example
 * ```typescript
 * formatNumber(1234567.89); // "1,234,567.89"
 * formatNumber(1234567.89, 0); // "1,234,568"
 * ```
 */
export function formatNumber(num: number, decimals = 2): string {
  return new Intl.NumberFormat('en-US', {
    minimumFractionDigits: 0,
    maximumFractionDigits: decimals,
  }).format(num);
}

/**
 * Formats a number as currency.
 * 
 * @param value - The value to format
 * @param currency - ISO 4217 currency code (default: 'USD')
 * @returns Formatted currency string
 * @category Market Data
 * 
 * @example
 * ```typescript
 * formatCurrency(1234.56); // "$1,234.56"
 * formatCurrency(1234.56, 'EUR'); // "€1,234.56"
 * ```
 */
export function formatCurrency(value: number, currency = 'USD'): string {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency,
  }).format(value);
}

// ============================================================================
// JSON Utilities
// ============================================================================

/**
 * Safely parses JSON with a fallback value.
 * 
 * @template T - The expected type of the parsed value
 * @param json - The JSON string to parse
 * @param fallback - Value to return if parsing fails
 * @returns The parsed value or fallback
 * @category Core
 * 
 * @example
 * ```typescript
 * const data = safeJsonParse('{"key": "value"}', {}); // { key: 'value' }
 * const invalid = safeJsonParse('not json', {}); // {}
 * ```
 */
export function safeJsonParse<T>(json: string, fallback: T): T {
  try {
    return JSON.parse(json) as T;
  } catch {
    return fallback;
  }
}

/**
 * Formats an object as pretty-printed JSON.
 * 
 * @param obj - The object to format
 * @param indent - Indentation spaces (default: 2)
 * @returns Pretty-printed JSON string
 * @category Core
 */
export function formatJson(obj: unknown, indent = 2): string {
  return JSON.stringify(obj, null, indent);
}

// ============================================================================
// Async Utilities
// ============================================================================

/**
 * Delays execution for specified milliseconds.
 * 
 * @param ms - Milliseconds to sleep
 * @returns Promise that resolves after the delay
 * @category Core
 * 
 * @example
 * ```typescript
 * await sleep(1000); // Wait 1 second
 * ```
 */
export function sleep(ms: number): Promise<void> {
  return new Promise(resolve => setTimeout(resolve, ms));
}

/**
 * Retries a function with exponential backoff.
 * 
 * Useful for handling transient network errors or rate limits.
 * 
 * @template T - Return type of the function
 * @param fn - Async function to retry
 * @param options - Retry configuration
 * @param options.maxRetries - Maximum retry attempts (default: 3)
 * @param options.initialDelay - Initial delay in ms (default: 1000)
 * @param options.maxDelay - Maximum delay in ms (default: 10000)
 * @returns Result of the function
 * @throws The last error if all retries fail
 * @category Core
 * 
 * @example
 * ```typescript
 * const result = await withRetry(
 *   () => fetchPriceData('BTC'),
 *   { maxRetries: 5, initialDelay: 500 }
 * );
 * ```
 */
export async function withRetry<T>(
  fn: () => Promise<T>,
  options: {
    maxRetries?: number;
    initialDelay?: number;
    maxDelay?: number;
  } = {}
): Promise<T> {
  const { maxRetries = 3, initialDelay = 1000, maxDelay = 10000 } = options;
  
  let lastError: Error | undefined;
  
  for (let attempt = 0; attempt <= maxRetries; attempt++) {
    try {
      return await fn();
    } catch (error) {
      lastError = error instanceof Error ? error : new Error(String(error));
      
      if (attempt === maxRetries) break;
      
      const delay = Math.min(initialDelay * Math.pow(2, attempt), maxDelay);
      await sleep(delay);
    }
  }
  
  throw lastError;
}

// ============================================================================
// Error Utilities
// ============================================================================

/**
 * Wraps an error with additional context
 */
export class MCPError extends Error {
  constructor(
    message: string,
    public code: string,
    public details?: Record<string, unknown>
  ) {
    super(message);
    this.name = 'MCPError';
  }
}

/**
 * Creates a standardized error response
 */
export function createErrorResponse(error: unknown): { error: string; code: string } {
  if (error instanceof MCPError) {
    return { error: error.message, code: error.code };
  }
  if (error instanceof Error) {
    return { error: error.message, code: 'UNKNOWN_ERROR' };
  }
  return { error: String(error), code: 'UNKNOWN_ERROR' };
}
