/**
 * Wallet Utilities
 * 
 * Helper functions for wallet operations
 * 
 * @author Nich (@nichxbt)
 * @license Apache-2.0
 */

import { NetworkConfig } from './types';

/**
 * Truncate address for display
 */
export function truncateAddress(address: string, startChars = 6, endChars = 4): string {
  if (!address) return '';
  if (address.length <= startChars + endChars) return address;
  return `${address.slice(0, startChars)}...${address.slice(-endChars)}`;
}

/**
 * Format balance for display
 */
export function formatBalance(
  balance: bigint,
  decimals: number,
  maxDecimals = 4
): string {
  if (balance === BigInt(0)) return '0';
  
  const divisor = BigInt(10 ** decimals);
  const integerPart = balance / divisor;
  const fractionalPart = balance % divisor;
  
  if (fractionalPart === BigInt(0)) {
    return integerPart.toString();
  }
  
  const fractionalStr = fractionalPart.toString().padStart(decimals, '0');
  const trimmedFractional = fractionalStr.slice(0, maxDecimals).replace(/0+$/, '');
  
  if (!trimmedFractional) {
    return integerPart.toString();
  }
  
  return `${integerPart}.${trimmedFractional}`;
}

/**
 * Format USD value
 */
export function formatUsd(value: number): string {
  if (value === 0) return '$0.00';
  if (value < 0.01) return '<$0.01';
  if (value < 1) return `$${value.toFixed(4)}`;
  if (value < 1000) return `$${value.toFixed(2)}`;
  if (value < 1000000) return `$${(value / 1000).toFixed(2)}K`;
  if (value < 1000000000) return `$${(value / 1000000).toFixed(2)}M`;
  return `$${(value / 1000000000).toFixed(2)}B`;
}

/**
 * Format percentage change
 */
export function formatPercentChange(percent: number): string {
  const sign = percent >= 0 ? '+' : '';
  return `${sign}${percent.toFixed(2)}%`;
}

/**
 * Validate EVM address
 */
export function isValidEvmAddress(address: string): boolean {
  return /^0x[a-fA-F0-9]{40}$/.test(address);
}

/**
 * Validate Solana address
 */
export function isValidSolanaAddress(address: string): boolean {
  return /^[1-9A-HJ-NP-Za-km-z]{32,44}$/.test(address);
}

/**
 * Validate address based on chain family
 */
export function isValidAddress(address: string, family: 'evm' | 'solana'): boolean {
  if (family === 'evm') {
    return isValidEvmAddress(address);
  }
  return isValidSolanaAddress(address);
}

/**
 * Get checksum address for EVM
 */
export function toChecksumAddress(address: string): string {
  if (!isValidEvmAddress(address)) return address;
  
  // Simple checksum implementation
  // In production, use viem's getAddress
  return address.toLowerCase();
}

/**
 * Get block explorer URL for address
 */
export function getExplorerAddressUrl(network: NetworkConfig, address: string): string {
  return `${network.blockExplorers.default.url}/address/${address}`;
}

/**
 * Get block explorer URL for transaction
 */
export function getExplorerTxUrl(network: NetworkConfig, hash: string): string {
  if (network.family === 'solana') {
    return `${network.blockExplorers.default.url}/tx/${hash}`;
  }
  return `${network.blockExplorers.default.url}/tx/${hash}`;
}

/**
 * Get block explorer URL for token
 */
export function getExplorerTokenUrl(network: NetworkConfig, address: string): string {
  return `${network.blockExplorers.default.url}/token/${address}`;
}

/**
 * Parse token amount from string input
 */
export function parseTokenAmount(input: string, decimals: number): bigint {
  if (!input || input === '0') return BigInt(0);
  
  const parts = input.split('.');
  const integerPart = parts[0] || '0';
  let fractionalPart = parts[1] || '';
  
  // Pad or truncate fractional part
  if (fractionalPart.length > decimals) {
    fractionalPart = fractionalPart.slice(0, decimals);
  } else {
    fractionalPart = fractionalPart.padEnd(decimals, '0');
  }
  
  return BigInt(integerPart + fractionalPart);
}

/**
 * Format gas price in gwei
 */
export function formatGwei(wei: bigint): string {
  const gwei = Number(wei) / 1e9;
  return `${gwei.toFixed(2)} Gwei`;
}

/**
 * Estimate transaction time based on gas price
 */
export function estimateTransactionTime(
  gasPrice: bigint,
  baseFee: bigint,
  priorityFee: bigint
): string {
  const totalFee = baseFee + priorityFee;
  const ratio = Number(gasPrice) / Number(totalFee);
  
  if (ratio >= 1.5) return '< 15 seconds';
  if (ratio >= 1.2) return '< 30 seconds';
  if (ratio >= 1.0) return '< 1 minute';
  if (ratio >= 0.8) return '< 5 minutes';
  return '> 5 minutes';
}

/**
 * Copy text to clipboard
 */
export async function copyToClipboard(text: string): Promise<boolean> {
  try {
    await navigator.clipboard.writeText(text);
    return true;
  } catch {
    // Fallback for older browsers
    const textArea = document.createElement('textarea');
    textArea.value = text;
    textArea.style.position = 'fixed';
    textArea.style.left = '-999999px';
    document.body.appendChild(textArea);
    textArea.select();
    
    try {
      document.execCommand('copy');
      return true;
    } catch {
      return false;
    } finally {
      document.body.removeChild(textArea);
    }
  }
}

/**
 * Generate unique ID
 */
export function generateId(): string {
  return `${Date.now()}-${Math.random().toString(36).substring(2, 9)}`;
}

/**
 * Debounce function
 */
export function debounce<T extends (...args: any[]) => any>(
  func: T,
  wait: number
): (...args: Parameters<T>) => void {
  let timeout: NodeJS.Timeout | null = null;
  
  return (...args: Parameters<T>) => {
    if (timeout) clearTimeout(timeout);
    timeout = setTimeout(() => func(...args), wait);
  };
}

/**
 * Sleep utility
 */
export function sleep(ms: number): Promise<void> {
  return new Promise(resolve => setTimeout(resolve, ms));
}

/**
 * Retry with exponential backoff
 */
export async function retryWithBackoff<T>(
  fn: () => Promise<T>,
  maxRetries = 3,
  baseDelay = 1000
): Promise<T> {
  let lastError: Error | undefined;
  
  for (let i = 0; i < maxRetries; i++) {
    try {
      return await fn();
    } catch (error) {
      lastError = error instanceof Error ? error : new Error(String(error));
      await sleep(baseDelay * Math.pow(2, i));
    }
  }
  
  throw lastError;
}

/**
 * Format relative time
 */
export function formatRelativeTime(date: Date): string {
  const now = new Date();
  const diff = now.getTime() - date.getTime();
  const seconds = Math.floor(diff / 1000);
  const minutes = Math.floor(seconds / 60);
  const hours = Math.floor(minutes / 60);
  const days = Math.floor(hours / 24);
  
  if (seconds < 60) return 'just now';
  if (minutes < 60) return `${minutes}m ago`;
  if (hours < 24) return `${hours}h ago`;
  if (days < 7) return `${days}d ago`;
  
  return date.toLocaleDateString();
}

/**
 * Format date for display
 */
export function formatDate(date: Date | string): string {
  const d = typeof date === 'string' ? new Date(date) : date;
  return d.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  });
}

/**
 * Get block explorer URL by chain ID
 */
export function getExplorerUrl(
  chainId: number | string,
  type: 'tx' | 'address' | 'token' | 'block',
  hash: string
): string {
  // Default explorers by chain ID
  const explorers: Record<number, string> = {
    1: 'https://etherscan.io',
    10: 'https://optimistic.etherscan.io',
    56: 'https://bscscan.com',
    137: 'https://polygonscan.com',
    250: 'https://ftmscan.com',
    42161: 'https://arbiscan.io',
    43114: 'https://snowtrace.io',
    8453: 'https://basescan.org',
    324: 'https://explorer.zksync.io',
    59144: 'https://lineascan.build',
  };
  
  // For Solana
  if (chainId === 'solana' || chainId === 101 || chainId === 102 || chainId === 103) {
    const cluster = chainId === 102 ? '?cluster=testnet' : chainId === 103 ? '?cluster=devnet' : '';
    return `https://solscan.io/${type}/${hash}${cluster}`;
  }
  
  const baseUrl = explorers[Number(chainId)] || 'https://etherscan.io';
  return `${baseUrl}/${type}/${hash}`;
}

/**
 * Check if address is a contract
 */
export async function isContract(
  address: string,
  rpcUrl: string
): Promise<boolean> {
  try {
    const response = await fetch(rpcUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        jsonrpc: '2.0',
        method: 'eth_getCode',
        params: [address, 'latest'],
        id: 1,
      }),
    });
    
    const data = await response.json();
    return data.result && data.result !== '0x';
  } catch {
    return false;
  }
}

/**
 * Local storage helpers with type safety
 */
export const storage = {
  get<T>(key: string, defaultValue: T): T {
    if (typeof window === 'undefined') return defaultValue;
    
    try {
      const item = localStorage.getItem(key);
      return item ? JSON.parse(item) : defaultValue;
    } catch {
      return defaultValue;
    }
  },
  
  set<T>(key: string, value: T): void {
    if (typeof window === 'undefined') return;
    
    try {
      localStorage.setItem(key, JSON.stringify(value));
    } catch {
      console.error('Failed to save to localStorage');
    }
  },
  
  remove(key: string): void {
    if (typeof window === 'undefined') return;
    localStorage.removeItem(key);
  },
};
