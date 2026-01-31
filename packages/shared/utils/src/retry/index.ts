/**
 * Retry Logic with Exponential Backoff and Circuit Breaker
 * 
 * Provides robust retry mechanisms for handling transient failures
 * in distributed systems and API calls.
 * 
 * @module retry
 * @author nich <nich@nichxbt.com>
 */

export interface RetryConfig {
  /** Maximum number of retry attempts */
  maxRetries: number;
  /** Initial delay in milliseconds */
  initialDelay: number;
  /** Maximum delay in milliseconds */
  maxDelay: number;
  /** Backoff multiplier (default: 2 for exponential) */
  backoffMultiplier?: number;
  /** Add random jitter to prevent thundering herd */
  jitter?: boolean;
  /** Jitter factor (0-1, default: 0.1) */
  jitterFactor?: number;
  /** Errors to retry on (default: all errors) */
  retryableErrors?: (new (...args: unknown[]) => Error)[];
  /** HTTP status codes to retry on */
  retryableStatusCodes?: number[];
  /** Callback on each retry */
  onRetry?: (error: Error, attempt: number, delay: number) => void;
}

export interface RetryResult<T> {
  success: boolean;
  data?: T;
  error?: Error;
  attempts: number;
  totalTime: number;
}

const DEFAULT_RETRY_CONFIG: Required<RetryConfig> = {
  maxRetries: 3,
  initialDelay: 1000,
  maxDelay: 30000,
  backoffMultiplier: 2,
  jitter: true,
  jitterFactor: 0.1,
  retryableErrors: [],
  retryableStatusCodes: [408, 429, 500, 502, 503, 504],
  onRetry: () => {},
};

/**
 * Check if an error is retryable
 */
function isRetryableError(error: Error, config: Required<RetryConfig>): boolean {
  // Check for specific error types
  if (config.retryableErrors.length > 0) {
    return config.retryableErrors.some(ErrorType => error instanceof ErrorType);
  }

  // Check for HTTP status codes
  if ('status' in error || 'statusCode' in error) {
    const status = (error as { status?: number; statusCode?: number }).status 
      ?? (error as { status?: number; statusCode?: number }).statusCode;
    if (status && config.retryableStatusCodes.includes(status)) {
      return true;
    }
  }

  // Check for common transient error messages
  const transientPatterns = [
    /timeout/i,
    /ECONNRESET/,
    /ECONNREFUSED/,
    /ETIMEDOUT/,
    /ENOTFOUND/,
    /network/i,
    /socket hang up/i,
    /rate limit/i,
    /too many requests/i,
    /temporarily unavailable/i,
    /service unavailable/i,
  ];

  return transientPatterns.some(pattern => pattern.test(error.message));
}

/**
 * Calculate delay with exponential backoff and optional jitter
 */
function calculateDelay(
  attempt: number,
  config: Required<RetryConfig>
): number {
  // Exponential backoff
  let delay = config.initialDelay * Math.pow(config.backoffMultiplier, attempt - 1);
  
  // Cap at max delay
  delay = Math.min(delay, config.maxDelay);
  
  // Add jitter
  if (config.jitter) {
    const jitterRange = delay * config.jitterFactor;
    delay = delay + (Math.random() * 2 - 1) * jitterRange;
  }
  
  return Math.floor(delay);
}

/**
 * Retry a function with exponential backoff
 * 
 * @example
 * ```typescript
 * const result = await retry(
 *   async () => await fetch('https://api.example.com/data'),
 *   { maxRetries: 3, initialDelay: 1000 }
 * );
 * ```
 */
export async function retry<T>(
  fn: () => Promise<T>,
  config: Partial<RetryConfig> = {}
): Promise<RetryResult<T>> {
  const fullConfig: Required<RetryConfig> = { ...DEFAULT_RETRY_CONFIG, ...config };
  const startTime = Date.now();
  let lastError: Error | undefined;

  for (let attempt = 1; attempt <= fullConfig.maxRetries + 1; attempt++) {
    try {
      const data = await fn();
      return {
        success: true,
        data,
        attempts: attempt,
        totalTime: Date.now() - startTime,
      };
    } catch (error) {
      lastError = error instanceof Error ? error : new Error(String(error));

      // Check if we should retry
      if (attempt > fullConfig.maxRetries) {
        break;
      }

      if (!isRetryableError(lastError, fullConfig)) {
        break;
      }

      // Calculate delay and wait
      const delay = calculateDelay(attempt, fullConfig);
      fullConfig.onRetry(lastError, attempt, delay);
      
      await new Promise(resolve => setTimeout(resolve, delay));
    }
  }

  return {
    success: false,
    error: lastError,
    attempts: fullConfig.maxRetries + 1,
    totalTime: Date.now() - startTime,
  };
}

/**
 * Decorator version for class methods
 */
export function withRetry<T extends (...args: unknown[]) => Promise<unknown>>(
  config: Partial<RetryConfig> = {}
) {
  return function (
    _target: unknown,
    _propertyKey: string,
    descriptor: TypedPropertyDescriptor<T>
  ): TypedPropertyDescriptor<T> {
    const originalMethod = descriptor.value!;

    descriptor.value = async function (...args: Parameters<T>): Promise<ReturnType<T>> {
      const result = await retry(() => originalMethod.apply(this, args), config);
      if (result.success) {
        return result.data as ReturnType<T>;
      }
      throw result.error;
    } as T;

    return descriptor;
  };
}

// ============================================================================
// Circuit Breaker
// ============================================================================

export enum CircuitState {
  CLOSED = 'CLOSED',     // Normal operation
  OPEN = 'OPEN',         // Blocking all requests
  HALF_OPEN = 'HALF_OPEN' // Testing if service recovered
}

export interface CircuitBreakerConfig {
  /** Number of failures before opening circuit */
  failureThreshold: number;
  /** Time in ms to wait before attempting recovery */
  resetTimeout: number;
  /** Number of successes needed in half-open state to close */
  successThreshold: number;
  /** Time window for counting failures (ms) */
  failureWindow?: number;
  /** Callback when circuit state changes */
  onStateChange?: (from: CircuitState, to: CircuitState) => void;
}

export interface CircuitBreakerStats {
  state: CircuitState;
  failures: number;
  successes: number;
  lastFailure?: Date;
  lastSuccess?: Date;
  openedAt?: Date;
}

/**
 * Circuit Breaker Pattern Implementation
 * 
 * Prevents cascading failures by stopping requests to failing services.
 * 
 * @example
 * ```typescript
 * const breaker = new CircuitBreaker({
 *   failureThreshold: 5,
 *   resetTimeout: 30000,
 *   successThreshold: 2
 * });
 * 
 * const result = await breaker.execute(() => api.call());
 * ```
 */
export class CircuitBreaker {
  private state: CircuitState = CircuitState.CLOSED;
  private failures: number = 0;
  private successes: number = 0;
  private lastFailure?: Date;
  private lastSuccess?: Date;
  private openedAt?: Date;
  private failureTimestamps: number[] = [];
  private config: Required<CircuitBreakerConfig>;

  constructor(config: CircuitBreakerConfig) {
    this.config = {
      failureThreshold: config.failureThreshold,
      resetTimeout: config.resetTimeout,
      successThreshold: config.successThreshold,
      failureWindow: config.failureWindow ?? 60000,
      onStateChange: config.onStateChange ?? (() => {}),
    };
  }

  /**
   * Execute a function through the circuit breaker
   */
  async execute<T>(fn: () => Promise<T>): Promise<T> {
    if (!this.canExecute()) {
      throw new CircuitOpenError(
        `Circuit is ${this.state}. Reset in ${this.getTimeUntilReset()}ms`
      );
    }

    try {
      const result = await fn();
      this.onSuccess();
      return result;
    } catch (error) {
      this.onFailure(error instanceof Error ? error : new Error(String(error)));
      throw error;
    }
  }

  /**
   * Check if execution is allowed
   */
  canExecute(): boolean {
    if (this.state === CircuitState.CLOSED) {
      return true;
    }

    if (this.state === CircuitState.OPEN) {
      if (this.shouldAttemptReset()) {
        this.transitionTo(CircuitState.HALF_OPEN);
        return true;
      }
      return false;
    }

    // HALF_OPEN: allow single test request
    return true;
  }

  /**
   * Record a successful execution
   */
  private onSuccess(): void {
    this.lastSuccess = new Date();

    if (this.state === CircuitState.HALF_OPEN) {
      this.successes++;
      if (this.successes >= this.config.successThreshold) {
        this.transitionTo(CircuitState.CLOSED);
      }
    } else if (this.state === CircuitState.CLOSED) {
      // Reset failure count on success
      this.failures = 0;
      this.failureTimestamps = [];
    }
  }

  /**
   * Record a failed execution
   */
  private onFailure(_error: Error): void {
    this.lastFailure = new Date();
    this.failures++;

    if (this.state === CircuitState.HALF_OPEN) {
      // Any failure in half-open state opens the circuit again
      this.transitionTo(CircuitState.OPEN);
      return;
    }

    // Track failures within window
    const now = Date.now();
    this.failureTimestamps.push(now);
    this.failureTimestamps = this.failureTimestamps.filter(
      t => now - t < this.config.failureWindow
    );

    if (this.failureTimestamps.length >= this.config.failureThreshold) {
      this.transitionTo(CircuitState.OPEN);
    }
  }

  /**
   * Check if we should attempt to reset the circuit
   */
  private shouldAttemptReset(): boolean {
    if (!this.openedAt) return false;
    return Date.now() - this.openedAt.getTime() >= this.config.resetTimeout;
  }

  /**
   * Transition to a new state
   */
  private transitionTo(newState: CircuitState): void {
    const oldState = this.state;
    this.state = newState;

    if (newState === CircuitState.OPEN) {
      this.openedAt = new Date();
      this.successes = 0;
    } else if (newState === CircuitState.CLOSED) {
      this.failures = 0;
      this.successes = 0;
      this.failureTimestamps = [];
      this.openedAt = undefined;
    } else if (newState === CircuitState.HALF_OPEN) {
      this.successes = 0;
    }

    this.config.onStateChange(oldState, newState);
  }

  /**
   * Get time until circuit reset (if open)
   */
  getTimeUntilReset(): number {
    if (this.state !== CircuitState.OPEN || !this.openedAt) {
      return 0;
    }
    const elapsed = Date.now() - this.openedAt.getTime();
    return Math.max(0, this.config.resetTimeout - elapsed);
  }

  /**
   * Get current statistics
   */
  getStats(): CircuitBreakerStats {
    return {
      state: this.state,
      failures: this.failures,
      successes: this.successes,
      lastFailure: this.lastFailure,
      lastSuccess: this.lastSuccess,
      openedAt: this.openedAt,
    };
  }

  /**
   * Force circuit to close (use with caution)
   */
  forceClose(): void {
    this.transitionTo(CircuitState.CLOSED);
  }

  /**
   * Force circuit to open (use for maintenance)
   */
  forceOpen(): void {
    this.transitionTo(CircuitState.OPEN);
  }
}

/**
 * Error thrown when circuit is open
 */
export class CircuitOpenError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'CircuitOpenError';
  }
}

// ============================================================================
// Combined Retry with Circuit Breaker
// ============================================================================

export interface ResilientConfig {
  retry: Partial<RetryConfig>;
  circuitBreaker: CircuitBreakerConfig;
}

/**
 * Combines retry logic with circuit breaker for maximum resilience
 */
export class ResilientExecutor {
  private circuitBreaker: CircuitBreaker;
  private retryConfig: Partial<RetryConfig>;

  constructor(config: ResilientConfig) {
    this.circuitBreaker = new CircuitBreaker(config.circuitBreaker);
    this.retryConfig = config.retry;
  }

  async execute<T>(fn: () => Promise<T>): Promise<RetryResult<T>> {
    return retry(
      () => this.circuitBreaker.execute(fn),
      this.retryConfig
    );
  }

  getCircuitState(): CircuitState {
    return this.circuitBreaker.getStats().state;
  }

  getStats(): CircuitBreakerStats {
    return this.circuitBreaker.getStats();
  }
}

/**
 * Create a resilient executor with sensible defaults
 */
export function createResilientExecutor(
  name: string,
  overrides?: Partial<ResilientConfig>
): ResilientExecutor {
  return new ResilientExecutor({
    retry: {
      maxRetries: 3,
      initialDelay: 1000,
      maxDelay: 10000,
      onRetry: (error, attempt, delay) => {
        console.warn(`[${name}] Retry attempt ${attempt}, waiting ${delay}ms: ${error.message}`);
      },
      ...overrides?.retry,
    },
    circuitBreaker: {
      failureThreshold: 5,
      resetTimeout: 30000,
      successThreshold: 2,
      onStateChange: (from, to) => {
        console.warn(`[${name}] Circuit state changed: ${from} -> ${to}`);
      },
      ...overrides?.circuitBreaker,
    },
  });
}
