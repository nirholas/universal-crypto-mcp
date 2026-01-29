/**
 * Signing Queue
 * Rate-limited queue for transaction signing operations with retry logic
 */

import { v4 as uuidv4 } from 'uuid';
import type { SigningQueueEntry, WalletErrorCode } from '../types.js';
import { WalletManagerError } from '../types.js';

/**
 * Default rate limit: 60 signing operations per minute
 */
const DEFAULT_RATE_LIMIT = 60;

/**
 * Rate limit window in milliseconds (1 minute)
 */
const RATE_LIMIT_WINDOW_MS = 60_000;

/**
 * Default retry configuration
 */
const DEFAULT_MAX_RETRIES = 3;
const DEFAULT_BASE_DELAY_MS = 1000;
const DEFAULT_MAX_DELAY_MS = 30000;

/**
 * Retry configuration
 */
export interface RetryConfig {
  maxRetries: number;
  baseDelayMs: number;
  maxDelayMs: number;
  jitterFactor: number; // 0-1, adds randomness to prevent thundering herd
}

/**
 * Calculate exponential backoff delay with jitter
 * @param attempt - Current attempt number (0-indexed)
 * @param config - Retry configuration
 * @returns Delay in milliseconds
 */
export function calculateBackoffDelay(
  attempt: number,
  config: RetryConfig = {
    maxRetries: DEFAULT_MAX_RETRIES,
    baseDelayMs: DEFAULT_BASE_DELAY_MS,
    maxDelayMs: DEFAULT_MAX_DELAY_MS,
    jitterFactor: 0.3,
  }
): number {
  // Exponential backoff: baseDelay * 2^attempt
  const exponentialDelay = config.baseDelayMs * Math.pow(2, attempt);
  
  // Cap at max delay
  const cappedDelay = Math.min(exponentialDelay, config.maxDelayMs);
  
  // Add jitter: delay * (1 - jitter + random * 2 * jitter)
  const jitter = config.jitterFactor * (2 * Math.random() - 1);
  const delayWithJitter = cappedDelay * (1 + jitter);
  
  return Math.floor(delayWithJitter);
}

/**
 * Sleep for a given duration
 */
async function sleep(ms: number): Promise<void> {
  return new Promise(resolve => setTimeout(resolve, ms));
}

/**
 * Signing queue state
 */
interface QueueState {
  entries: Map<string, SigningQueueEntry>;
  timestamps: number[];
  rateLimit: number;
  processing: boolean;
  retryConfig: RetryConfig;
}

/**
 * Signing Queue implementation with retry support
 */
export class SigningQueue {
  private state: QueueState;

  constructor(options?: {
    rateLimit?: number;
    retryConfig?: Partial<RetryConfig>;
  }) {
    this.state = {
      entries: new Map(),
      timestamps: [],
      rateLimit: options?.rateLimit || DEFAULT_RATE_LIMIT,
      processing: false,
      retryConfig: {
        maxRetries: options?.retryConfig?.maxRetries ?? DEFAULT_MAX_RETRIES,
        baseDelayMs: options?.retryConfig?.baseDelayMs ?? DEFAULT_BASE_DELAY_MS,
        maxDelayMs: options?.retryConfig?.maxDelayMs ?? DEFAULT_MAX_DELAY_MS,
        jitterFactor: options?.retryConfig?.jitterFactor ?? 0.3,
      },
    };
  }

  /**
   * Add an entry to the queue
   */
  add(entry: Omit<SigningQueueEntry, 'id' | 'createdAt' | 'status'>): SigningQueueEntry {
    const fullEntry: SigningQueueEntry = {
      ...entry,
      id: uuidv4(),
      createdAt: new Date(),
      status: 'pending',
    };

    this.state.entries.set(fullEntry.id, fullEntry);
    return fullEntry;
  }

  /**
   * Get an entry by ID
   */
  get(entryId: string): SigningQueueEntry | undefined {
    return this.state.entries.get(entryId);
  }

  /**
   * Remove an entry from the queue
   */
  remove(entryId: string): boolean {
    return this.state.entries.delete(entryId);
  }

  /**
   * Check if we can sign (rate limit check)
   */
  canSign(): boolean {
    this.cleanupOldTimestamps();
    return this.state.timestamps.length < this.state.rateLimit;
  }

  /**
   * Record a signing operation
   */
  recordSigning(): void {
    this.state.timestamps.push(Date.now());
  }

  /**
   * Wait for rate limit to allow signing
   */
  async waitForRateLimit(): Promise<void> {
    while (!this.canSign()) {
      // Calculate wait time until oldest timestamp expires
      const oldestTimestamp = this.state.timestamps[0];
      const waitTime = (oldestTimestamp ?? Date.now()) + RATE_LIMIT_WINDOW_MS - Date.now() + 100;

      if (waitTime > 0) {
        await new Promise(resolve => setTimeout(resolve, waitTime));
      }

      this.cleanupOldTimestamps();
    }
  }

  /**
   * Clean up timestamps outside the rate limit window
   */
  private cleanupOldTimestamps(): void {
    const cutoff = Date.now() - RATE_LIMIT_WINDOW_MS;
    this.state.timestamps = this.state.timestamps.filter(ts => ts > cutoff);
  }

  /**
   * Get the current rate (signings per minute)
   */
  getCurrentRate(): number {
    this.cleanupOldTimestamps();
    return this.state.timestamps.length;
  }

  /**
   * Get remaining capacity in the current window
   */
  getRemainingCapacity(): number {
    this.cleanupOldTimestamps();
    return Math.max(0, this.state.rateLimit - this.state.timestamps.length);
  }

  /**
   * Get time until next available signing slot (in ms)
   */
  getTimeUntilNextSlot(): number {
    if (this.canSign()) {
      return 0;
    }

    const oldestTimestamp = this.state.timestamps[0];
    return Math.max(0, (oldestTimestamp ?? Date.now()) + RATE_LIMIT_WINDOW_MS - Date.now());
  }

  /**
   * Get queue statistics
   */
  getStats(): {
    queueSize: number;
    pendingCount: number;
    signingCount: number;
    completedCount: number;
    failedCount: number;
    currentRate: number;
    remainingCapacity: number;
  } {
    let pendingCount = 0;
    let signingCount = 0;
    let completedCount = 0;
    let failedCount = 0;

    for (const entry of this.state.entries.values()) {
      switch (entry.status) {
        case 'pending':
          pendingCount++;
          break;
        case 'signing':
          signingCount++;
          break;
        case 'completed':
          completedCount++;
          break;
        case 'failed':
          failedCount++;
          break;
      }
    }

    return {
      queueSize: this.state.entries.size,
      pendingCount,
      signingCount,
      completedCount,
      failedCount,
      currentRate: this.getCurrentRate(),
      remainingCapacity: this.getRemainingCapacity(),
    };
  }

  /**
   * Update the rate limit
   */
  setRateLimit(limit: number): void {
    if (limit <= 0) {
      throw new WalletManagerError(
        'RATE_LIMITED' as WalletErrorCode,
        'Rate limit must be positive'
      );
    }
    this.state.rateLimit = limit;
  }

  /**
   * Clear all entries from the queue
   */
  clear(): void {
    this.state.entries.clear();
  }

  /**
   * Get all pending entries sorted by priority
   */
  getPendingEntries(): SigningQueueEntry[] {
    return Array.from(this.state.entries.values())
      .filter(e => e.status === 'pending')
      .sort((a, b) => b.priority - a.priority);
  }

  /**
   * Update entry status
   */
  updateStatus(
    entryId: string,
    status: SigningQueueEntry['status'],
    error?: string
  ): void {
    const entry = this.state.entries.get(entryId);
    if (entry) {
      entry.status = status;
      if (error) {
        entry.error = error;
      }
    }
  }

  /**
   * Execute a function with exponential backoff retry
   * @param fn - Async function to execute
   * @param shouldRetry - Optional function to determine if error is retryable
   * @returns Result of the function
   */
  async executeWithRetry<T>(
    fn: () => Promise<T>,
    shouldRetry?: (error: Error, attempt: number) => boolean
  ): Promise<T> {
    let lastError: Error | undefined;
    
    for (let attempt = 0; attempt <= this.state.retryConfig.maxRetries; attempt++) {
      try {
        // Wait for rate limit before each attempt
        await this.waitForRateLimit();
        
        // Execute the function
        const result = await fn();
        this.recordSigning();
        return result;
      } catch (error) {
        lastError = error instanceof Error ? error : new Error(String(error));
        
        // Check if we should retry
        const isRetryable = shouldRetry 
          ? shouldRetry(lastError, attempt)
          : this.isRetryableError(lastError);
        
        if (!isRetryable || attempt === this.state.retryConfig.maxRetries) {
          break;
        }
        
        // Calculate backoff delay
        const delay = calculateBackoffDelay(attempt, this.state.retryConfig);
        console.warn(
          `Signing attempt ${attempt + 1} failed, retrying in ${delay}ms: ${lastError.message}`
        );
        
        await sleep(delay);
      }
    }
    
    throw lastError || new Error('Unknown error during retry');
  }

  /**
   * Determine if an error is retryable
   * @param error - The error to check
   * @returns True if the error is retryable
   */
  private isRetryableError(error: Error): boolean {
    const message = error.message.toLowerCase();
    
    // Retryable network/RPC errors
    const retryablePatterns = [
      'timeout',
      'econnreset',
      'econnrefused',
      'network',
      'socket hang up',
      'rate limit',
      '429', // Too Many Requests
      '503', // Service Unavailable
      '502', // Bad Gateway
      'blockhash not found',
      'block height exceeded',
      'transaction simulation failed', // May succeed on retry with new blockhash
    ];
    
    return retryablePatterns.some(pattern => message.includes(pattern));
  }

  /**
   * Get the current retry configuration
   */
  getRetryConfig(): RetryConfig {
    return { ...this.state.retryConfig };
  }

  /**
   * Update retry configuration
   */
  setRetryConfig(config: Partial<RetryConfig>): void {
    this.state.retryConfig = {
      ...this.state.retryConfig,
      ...config,
    };
  }
}

/**
 * Create a signing queue instance
 */
export function createSigningQueue(options?: {
  rateLimit?: number;
  retryConfig?: Partial<RetryConfig>;
}): SigningQueue {
  return new SigningQueue(options);
}
