/**
 * Core utilities for Universal Crypto MCP
 * 
 * @author nich
 * @license Apache-2.0
 * @see https://github.com/nirholas/universal-crypto-mcp
 * @see https://x.com/nichxbt
 */

import type { Address } from 'viem';

// ============================================================================
// Address Utilities
// ============================================================================

/**
 * Validates an Ethereum address
 */
export function isValidAddress(address: string): address is Address {
  return /^0x[a-fA-F0-9]{40}$/.test(address);
}

/**
 * Checksums an Ethereum address
 */
export function checksumAddress(address: string): Address {
  if (!isValidAddress(address)) {
    throw new Error(`Invalid address: ${address}`);
  }
  return address as Address;
}

/**
 * Truncates an address for display
 */
export function truncateAddress(address: string, chars = 4): string {
  if (!isValidAddress(address)) return address;
  return `${address.slice(0, chars + 2)}...${address.slice(-chars)}`;
}

// ============================================================================
// Number Utilities
// ============================================================================

/**
 * Formats a number with specified decimals
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
 * Parses a decimal string into bigint with specified decimals
 */
export function parseUnits(value: string, decimals: number): bigint {
  const [integerPart, fractionalPart = ''] = value.split('.');
  const paddedFractional = fractionalPart.padEnd(decimals, '0').slice(0, decimals);
  return BigInt(integerPart + paddedFractional);
}

/**
 * Formats a number for display with commas
 */
export function formatNumber(num: number, decimals = 2): string {
  return new Intl.NumberFormat('en-US', {
    minimumFractionDigits: 0,
    maximumFractionDigits: decimals,
  }).format(num);
}

/**
 * Formats a currency value
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
 * Safely parses JSON with error handling
 */
export function safeJsonParse<T>(json: string, fallback: T): T {
  try {
    return JSON.parse(json) as T;
  } catch {
    return fallback;
  }
}

/**
 * Formats an object as pretty JSON
 */
export function formatJson(obj: unknown, indent = 2): string {
  return JSON.stringify(obj, null, indent);
}

// ============================================================================
// Async Utilities
// ============================================================================

/**
 * Delays execution for specified milliseconds
 */
export function sleep(ms: number): Promise<void> {
  return new Promise(resolve => setTimeout(resolve, ms));
}

/**
 * Retries a function with exponential backoff
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
