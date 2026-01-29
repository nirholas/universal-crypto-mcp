/**
 * Utility Functions
 */

import { PublicKey } from '@solana/web3.js';

export function sleep(ms: number): Promise<void> {
  return new Promise(resolve => setTimeout(resolve, ms));
}

export function isValidPublicKey(address: string): boolean {
  try {
    new PublicKey(address);
    return true;
  } catch {
    return false;
  }
}

export function shortenAddress(address: string | PublicKey, chars = 4): string {
  const str = address.toString();
  return `${str.slice(0, chars)}...${str.slice(-chars)}`;
}

export function lamportsToSol(lamports: number | bigint): number {
  return Number(lamports) / 1e9;
}

export function solToLamports(sol: number): bigint {
  return BigInt(Math.floor(sol * 1e9));
}

export function formatTokenAmount(amount: bigint, decimals: number): string {
  const divisor = BigInt(10 ** decimals);
  const integerPart = amount / divisor;
  const fractionalPart = amount % divisor;
  const paddedFractional = fractionalPart.toString().padStart(decimals, '0');
  return `${integerPart}.${paddedFractional}`.replace(/\.?0+$/, '');
}

export function parseTokenAmount(amount: string, decimals: number): bigint {
  const [intPart, decPart = ''] = amount.split('.');
  const paddedDecimal = decPart.padEnd(decimals, '0').slice(0, decimals);
  return BigInt(intPart + paddedDecimal);
}

export function chunkArray<T>(array: T[], size: number): T[][] {
  const chunks: T[][] = [];
  for (let i = 0; i < array.length; i += size) {
    chunks.push(array.slice(i, i + size));
  }
  return chunks;
}

export async function retryWithBackoff<T>(
  fn: () => Promise<T>,
  maxRetries: number = 3,
  initialDelayMs: number = 1000
): Promise<T> {
  let lastError: Error;
  
  for (let attempt = 0; attempt <= maxRetries; attempt++) {
    try {
      return await fn();
    } catch (error) {
      lastError = error as Error;
      
      if (attempt < maxRetries) {
        const delay = initialDelayMs * Math.pow(2, attempt);
        await sleep(delay);
      }
    }
  }
  
  throw lastError!;
}

export function nowMs(): number {
  return Date.now();
}

export function msSince(startMs: number): number {
  return Date.now() - startMs;
}
// ============================================================================
// Rent Calculation Utilities
// ============================================================================

/**
 * Account size constants in bytes
 */
export const ACCOUNT_SIZES = {
  /** Standard SPL Token account */
  TOKEN_ACCOUNT: 165,
  /** Token-2022 base account (without extensions) */
  TOKEN_2022_ACCOUNT: 165,
  /** Mint account */
  MINT_ACCOUNT: 82,
  /** Multisig account */
  MULTISIG_ACCOUNT: 355,
  /** Metadata account (approximate) */
  METADATA_ACCOUNT: 679,
  /** Master Edition account */
  MASTER_EDITION_ACCOUNT: 282,
} as const;

/**
 * Get estimated rent exemption for common account types
 * Note: Use connection.getMinimumBalanceForRentExemption for precise values
 * These are estimates based on typical rent rates
 */
export function estimateRentExemption(dataSize: number): number {
  // Rent is approximately 0.00089088 SOL per byte per epoch (2 days)
  // Rent exemption requires ~2 years worth of rent
  const LAMPORTS_PER_BYTE_YEAR = 6960;
  const EXEMPTION_YEARS = 2;
  return dataSize * LAMPORTS_PER_BYTE_YEAR * EXEMPTION_YEARS;
}

/**
 * Get rent exemption for a token account
 */
export function estimateTokenAccountRent(): number {
  return estimateRentExemption(ACCOUNT_SIZES.TOKEN_ACCOUNT);
}

/**
 * Get rent exemption for a mint account
 */
export function estimateMintRent(): number {
  return estimateRentExemption(ACCOUNT_SIZES.MINT_ACCOUNT);
}

// ============================================================================
// Rate Limiting Utilities
// ============================================================================

/**
 * Simple token bucket rate limiter
 */
export class RateLimiter {
  private tokens: number;
  private lastRefill: number;

  constructor(
    private readonly maxTokens: number,
    private readonly refillRate: number, // tokens per second
  ) {
    this.tokens = maxTokens;
    this.lastRefill = Date.now();
  }

  private refill(): void {
    const now = Date.now();
    const elapsed = (now - this.lastRefill) / 1000;
    this.tokens = Math.min(this.maxTokens, this.tokens + elapsed * this.refillRate);
    this.lastRefill = now;
  }

  async acquire(): Promise<void> {
    this.refill();
    
    if (this.tokens >= 1) {
      this.tokens -= 1;
      return;
    }

    // Wait until we have a token
    const waitTime = ((1 - this.tokens) / this.refillRate) * 1000;
    await sleep(waitTime);
    this.tokens = 0;
  }

  tryAcquire(): boolean {
    this.refill();
    
    if (this.tokens >= 1) {
      this.tokens -= 1;
      return true;
    }
    
    return false;
  }

  getAvailableTokens(): number {
    this.refill();
    return Math.floor(this.tokens);
  }
}

// ============================================================================
// Batch Processing Utilities
// ============================================================================

/**
 * Process items in batches with concurrency control
 */
export async function batchProcess<T, R>(
  items: T[],
  processor: (item: T) => Promise<R>,
  options: {
    batchSize?: number;
    concurrency?: number;
    delayBetweenBatches?: number;
  } = {}
): Promise<R[]> {
  const { batchSize = 10, concurrency = 5, delayBetweenBatches = 0 } = options;
  const results: R[] = [];
  
  for (let i = 0; i < items.length; i += batchSize) {
    const batch = items.slice(i, i + batchSize);
    
    // Process batch with concurrency limit
    const batchResults: R[] = [];
    for (let j = 0; j < batch.length; j += concurrency) {
      const concurrent = batch.slice(j, j + concurrency);
      const concurrentResults = await Promise.all(concurrent.map(processor));
      batchResults.push(...concurrentResults);
    }
    
    results.push(...batchResults);
    
    if (delayBetweenBatches > 0 && i + batchSize < items.length) {
      await sleep(delayBetweenBatches);
    }
  }
  
  return results;
}

/**
 * Debounce a function
 */
export function debounce<T extends (...args: unknown[]) => unknown>(
  fn: T,
  delayMs: number
): (...args: Parameters<T>) => void {
  let timeoutId: ReturnType<typeof setTimeout> | null = null;
  
  return (...args: Parameters<T>) => {
    if (timeoutId) {
      clearTimeout(timeoutId);
    }
    timeoutId = setTimeout(() => fn(...args), delayMs);
  };
}

/**
 * Throttle a function
 */
export function throttle<T extends (...args: unknown[]) => unknown>(
  fn: T,
  limitMs: number
): (...args: Parameters<T>) => void {
  let lastRun = 0;
  
  return (...args: Parameters<T>) => {
    const now = Date.now();
    if (now - lastRun >= limitMs) {
      lastRun = now;
      fn(...args);
    }
  };
}
