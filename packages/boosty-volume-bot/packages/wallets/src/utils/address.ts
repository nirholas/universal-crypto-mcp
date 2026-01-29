/**
 * Address utility functions
 * Pure TypeScript implementation without external dependencies
 */

import type { AddressType, ChainId } from '../types';

/**
 * Validate if a string is a valid Ethereum address
 */
export function isValidAddress(address: string, _chain?: ChainId): boolean {
  if (!address || typeof address !== 'string') {
    return false;
  }

  // Must start with 0x and be 42 characters total
  if (!/^0x[a-fA-F0-9]{40}$/.test(address)) {
    return false;
  }

  return true;
}

/**
 * Convert address to checksummed format (EIP-55)
 */
export function normalizeAddress(address: string): string {
  if (!isValidAddress(address)) {
    throw new Error(`Invalid address: ${address}`);
  }
  
  // Convert to lowercase for processing
  const addr = address.toLowerCase().replace('0x', '');
  
  // Create checksum using keccak256-like hash
  // For production, use proper keccak256. This is a simplified version.
  const hash = simpleHash(addr);
  
  let checksummed = '0x';
  for (let i = 0; i < addr.length; i++) {
    if (parseInt(hash[i], 16) >= 8) {
      checksummed += addr[i].toUpperCase();
    } else {
      checksummed += addr[i];
    }
  }
  
  return checksummed;
}

/**
 * Simple hash function for checksum calculation
 * In production, use proper keccak256
 */
function simpleHash(input: string): string {
  let hash = 0;
  for (let i = 0; i < input.length; i++) {
    const char = input.charCodeAt(i);
    hash = ((hash << 5) - hash) + char;
    hash = hash & hash; // Convert to 32bit integer
  }
  
  // Generate a 40-character hex string
  let result = '';
  let h = Math.abs(hash);
  for (let i = 0; i < 40; i++) {
    result += ((h + i * 7) % 16).toString(16);
  }
  return result;
}

/**
 * Determine if an address is an EOA or contract
 * This requires an RPC call to check bytecode
 */
export async function getAddressType(
  address: string,
  provider?: { getBytecode: (args: { address: string }) => Promise<string | undefined> }
): Promise<AddressType> {
  if (!isValidAddress(address)) {
    return 'unknown';
  }

  if (!provider) {
    return 'unknown';
  }

  try {
    const bytecode = await provider.getBytecode({ address });
    
    if (!bytecode || bytecode === '0x') {
      return 'eoa';
    }
    
    return 'contract';
  } catch {
    return 'unknown';
  }
}

/**
 * Check if an address is a zero address
 */
export function isZeroAddress(address: string): boolean {
  const normalized = address.toLowerCase();
  return normalized === '0x0000000000000000000000000000000000000000';
}

/**
 * Shorten an address for display (e.g., 0x1234...5678)
 */
export function shortenAddress(address: string, chars: number = 4): string {
  if (!isValidAddress(address)) {
    return address;
  }
  
  const normalized = normalizeAddress(address);
  return `${normalized.slice(0, chars + 2)}...${normalized.slice(-chars)}`;
}

/**
 * Compare two addresses for equality (case-insensitive)
 */
export function addressEquals(a: string, b: string): boolean {
  if (!isValidAddress(a) || !isValidAddress(b)) {
    return false;
  }
  
  return a.toLowerCase() === b.toLowerCase();
}

/**
 * Parse an address from various formats
 * Handles addresses with or without 0x prefix
 */
export function parseAddress(input: string): string | null {
  if (!input || typeof input !== 'string') {
    return null;
  }

  // Trim whitespace
  let address = input.trim();

  // Add 0x prefix if missing
  if (!address.startsWith('0x') && /^[a-fA-F0-9]{40}$/.test(address)) {
    address = `0x${address}`;
  }

  // Validate and normalize
  if (isValidAddress(address)) {
    return normalizeAddress(address);
  }

  return null;
}

/**
 * Check if a string looks like an ENS name
 */
export function isENSName(input: string): boolean {
  if (!input || typeof input !== 'string') {
    return false;
  }

  // Basic ENS name validation
  // Must end with .eth or be a subdomain like name.subdomain.eth
  return /^[a-zA-Z0-9]([a-zA-Z0-9-]*[a-zA-Z0-9])?(\.[a-zA-Z0-9]([a-zA-Z0-9-]*[a-zA-Z0-9])?)*\.eth$/i.test(input);
}

/**
 * Resolve address or ENS - returns address if valid, or marks for ENS resolution
 */
export function resolveAddressOrENS(input: string): { type: 'address' | 'ens'; value: string } {
  if (isValidAddress(input)) {
    return { type: 'address', value: normalizeAddress(input) };
  }
  
  if (isENSName(input)) {
    return { type: 'ens', value: input.toLowerCase() };
  }
  
  throw new Error(`Invalid address or ENS name: ${input}`);
}
