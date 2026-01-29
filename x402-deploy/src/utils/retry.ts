/**
 * Retry utility with exponential backoff
 * @module utils/retry
 */

export interface RetryOptions {
  /** Maximum number of retry attempts */
  maxAttempts?: number;
  /** Initial delay in milliseconds */
  initialDelay?: number;
  /** Maximum delay in milliseconds */
  maxDelay?: number;
  /** Backoff multiplier */
  backoffMultiplier?: number;
  /** Whether to add jitter to delays */
  jitter?: boolean;
  /** Function to determine if error is retryable */
  isRetryable?: (error: Error) => boolean;
  /** Callback on retry */
  onRetry?: (error: Error, attempt: number) => void;
}

const DEFAULT_OPTIONS: Required<RetryOptions> = {
  maxAttempts: 3,
  initialDelay: 1000,
  maxDelay: 30000,
  backoffMultiplier: 2,
  jitter: true,
  isRetryable: () => true,
  onRetry: () => {},
};

/**
 * Retry a function with exponential backoff
 * 
 * @example
 * ```typescript
 * const result = await retry(
 *   async () => await fetchData(),
 *   { maxAttempts: 5, initialDelay: 2000 }
 * );
 * ```
 */
export async function retry<T>(
  fn: () => Promise<T>,
  options: RetryOptions = {}
): Promise<T> {
  const opts = { ...DEFAULT_OPTIONS, ...options };
  let lastError: Error;
  
  for (let attempt = 1; attempt <= opts.maxAttempts; attempt++) {
    try {
      return await fn();
    } catch (error) {
      lastError = error as Error;
      
      // Check if error is retryable
      if (!opts.isRetryable(lastError)) {
        throw lastError;
      }
      
      // Don't wait after last attempt
      if (attempt === opts.maxAttempts) {
        throw lastError;
      }
      
      // Calculate delay with exponential backoff
      let delay = Math.min(
        opts.initialDelay * Math.pow(opts.backoffMultiplier, attempt - 1),
        opts.maxDelay
      );
      
      // Add jitter if enabled
      if (opts.jitter) {
        delay = delay * (0.5 + Math.random() * 0.5);
      }
      
      // Call onRetry callback
      opts.onRetry(lastError, attempt);
      
      // Wait before next attempt
      await new Promise(resolve => setTimeout(resolve, delay));
    }
  }
  
  throw lastError!;
}

/**
 * Retry with specific error types
 */
export function retryOnError<T>(
  fn: () => Promise<T>,
  errorTypes: (new (...args: any[]) => Error)[],
  options: RetryOptions = {}
): Promise<T> {
  return retry(fn, {
    ...options,
    isRetryable: (error) => {
      return errorTypes.some(ErrorType => error instanceof ErrorType);
    },
  });
}

/**
 * Retry on network errors
 */
export function retryOnNetworkError<T>(
  fn: () => Promise<T>,
  options: RetryOptions = {}
): Promise<T> {
  return retry(fn, {
    ...options,
    isRetryable: (error) => {
      const networkErrors = [
        'ECONNREFUSED',
        'ECONNRESET',
        'ETIMEDOUT',
        'ENOTFOUND',
        'ENETUNREACH',
      ];
      return networkErrors.some(code => error.message.includes(code));
    },
  });
}

/**
 * Retry HTTP requests based on status codes
 */
export function retryOnHttpError<T>(
  fn: () => Promise<T>,
  retryableCodes: number[] = [408, 429, 500, 502, 503, 504],
  options: RetryOptions = {}
): Promise<T> {
  return retry(fn, {
    ...options,
    isRetryable: (error: any) => {
      if (error.status || error.statusCode) {
        const status = error.status || error.statusCode;
        return retryableCodes.includes(status);
      }
      return false;
    },
  });
}
