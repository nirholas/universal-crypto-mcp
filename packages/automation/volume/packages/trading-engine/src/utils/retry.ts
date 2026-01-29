/**
 * Retry Utilities
 * 
 * Provides exponential backoff retry logic for network operations.
 */

/**
 * Retry configuration
 */
export interface RetryConfig {
  /** Maximum number of retry attempts */
  maxAttempts: number;
  /** Initial delay in milliseconds */
  initialDelayMs: number;
  /** Maximum delay in milliseconds */
  maxDelayMs: number;
  /** Backoff multiplier */
  backoffMultiplier: number;
  /** Jitter factor (0-1) to add randomness */
  jitterFactor: number;
  /** Error types that should be retried */
  retryableErrors?: string[];
  /** Custom function to determine if error is retryable */
  isRetryable?: (error: unknown) => boolean;
}

/**
 * Default retry configuration
 */
export const DEFAULT_RETRY_CONFIG: RetryConfig = {
  maxAttempts: 3,
  initialDelayMs: 1000,
  maxDelayMs: 30000,
  backoffMultiplier: 2,
  jitterFactor: 0.1,
  retryableErrors: [
    'ECONNRESET',
    'ETIMEDOUT',
    'ECONNREFUSED',
    'EPIPE',
    'ENOTFOUND',
    'ENETUNREACH',
    'EAI_AGAIN',
    'fetch failed',
    'network error',
    '429', // Rate limited
    '502', // Bad gateway
    '503', // Service unavailable
    '504', // Gateway timeout
  ],
};

/**
 * Retry state for tracking attempts
 */
export interface RetryState {
  attempt: number;
  totalAttempts: number;
  lastError: unknown;
  elapsedMs: number;
}

/**
 * Calculate delay with exponential backoff and jitter
 */
export function calculateBackoffDelay(
  attempt: number,
  config: RetryConfig
): number {
  // Exponential backoff: delay = initialDelay * (multiplier ^ attempt)
  const exponentialDelay = config.initialDelayMs * Math.pow(config.backoffMultiplier, attempt);
  
  // Cap at max delay
  const cappedDelay = Math.min(exponentialDelay, config.maxDelayMs);
  
  // Add jitter to prevent thundering herd
  const jitter = cappedDelay * config.jitterFactor * (Math.random() * 2 - 1);
  
  return Math.max(0, cappedDelay + jitter);
}

/**
 * Check if an error is retryable
 */
export function isRetryableError(error: unknown, config: RetryConfig): boolean {
  // Custom retry check
  if (config.isRetryable) {
    return config.isRetryable(error);
  }

  // Check against known retryable error patterns
  const errorString = String(error);
  const errorMessage = error instanceof Error ? error.message : errorString;
  const errorName = error instanceof Error ? error.name : '';

  for (const pattern of config.retryableErrors ?? []) {
    if (
      errorString.includes(pattern) ||
      errorMessage.includes(pattern) ||
      errorName.includes(pattern)
    ) {
      return true;
    }
  }

  // Check for specific error types
  if (error instanceof TypeError && errorMessage.includes('fetch')) {
    return true;
  }

  return false;
}

/**
 * Sleep for a specified duration
 */
export function sleep(ms: number): Promise<void> {
  return new Promise(resolve => setTimeout(resolve, ms));
}

/**
 * Execute a function with retry logic
 */
export async function withRetry<T>(
  fn: (state: RetryState) => Promise<T>,
  config: Partial<RetryConfig> = {}
): Promise<T> {
  const fullConfig: RetryConfig = { ...DEFAULT_RETRY_CONFIG, ...config };
  const startTime = Date.now();
  let lastError: unknown;

  for (let attempt = 0; attempt < fullConfig.maxAttempts; attempt++) {
    const state: RetryState = {
      attempt,
      totalAttempts: fullConfig.maxAttempts,
      lastError,
      elapsedMs: Date.now() - startTime,
    };

    try {
      return await fn(state);
    } catch (error) {
      lastError = error;

      // Don't retry on final attempt
      if (attempt === fullConfig.maxAttempts - 1) {
        throw error;
      }

      // Check if error is retryable
      if (!isRetryableError(error, fullConfig)) {
        throw error;
      }

      // Calculate and wait for backoff delay
      const delay = calculateBackoffDelay(attempt, fullConfig);
      await sleep(delay);
    }
  }

  // Should never reach here, but TypeScript needs this
  throw lastError;
}

/**
 * Create a retry wrapper with pre-configured settings
 */
export function createRetryWrapper(config: Partial<RetryConfig> = {}) {
  return <T>(fn: (state: RetryState) => Promise<T>) => withRetry(fn, config);
}

/**
 * Retry decorator for class methods (can be used manually)
 */
export function retryable(config: Partial<RetryConfig> = {}) {
  return function <T>(
    _target: unknown,
    _propertyKey: string,
    descriptor: PropertyDescriptor
  ): PropertyDescriptor {
    const originalMethod = descriptor.value;

    descriptor.value = async function (...args: unknown[]): Promise<T> {
      return withRetry(
        () => originalMethod.apply(this, args),
        config
      );
    };

    return descriptor;
  };
}

/**
 * Specialized retry config for RPC calls
 */
export const RPC_RETRY_CONFIG: Partial<RetryConfig> = {
  maxAttempts: 5,
  initialDelayMs: 500,
  maxDelayMs: 10000,
  backoffMultiplier: 1.5,
  jitterFactor: 0.2,
  retryableErrors: [
    ...DEFAULT_RETRY_CONFIG.retryableErrors!,
    'blockhash not found',
    'Transaction simulation failed',
    'Node is behind',
  ],
};

/**
 * Specialized retry config for API calls
 */
export const API_RETRY_CONFIG: Partial<RetryConfig> = {
  maxAttempts: 3,
  initialDelayMs: 1000,
  maxDelayMs: 15000,
  backoffMultiplier: 2,
  jitterFactor: 0.1,
};

/**
 * Specialized retry config for transaction confirmation
 */
export const CONFIRMATION_RETRY_CONFIG: Partial<RetryConfig> = {
  maxAttempts: 10,
  initialDelayMs: 2000,
  maxDelayMs: 30000,
  backoffMultiplier: 1.2,
  jitterFactor: 0.1,
  retryableErrors: [
    'not confirmed',
    'BlockheightExceeded',
  ],
};
