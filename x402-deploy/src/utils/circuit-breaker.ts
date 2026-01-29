/**
 * Circuit breaker pattern implementation
 * Prevents cascading failures by stopping requests to failing services
 * @module utils/circuit-breaker
 */

export type CircuitState = 'CLOSED' | 'OPEN' | 'HALF_OPEN';

export interface CircuitBreakerOptions {
  /** Failure threshold to open circuit */
  failureThreshold?: number;
  /** Success threshold to close circuit from half-open */
  successThreshold?: number;
  /** Timeout in milliseconds before attempting half-open */
  timeout?: number;
  /** Rolling window size for failure tracking */
  volumeThreshold?: number;
  /** Error filter function */
  isError?: (error: Error) => boolean;
  /** State change callback */
  onStateChange?: (from: CircuitState, to: CircuitState) => void;
}

const DEFAULT_OPTIONS: Required<CircuitBreakerOptions> = {
  failureThreshold: 5,
  successThreshold: 2,
  timeout: 60000,
  volumeThreshold: 10,
  isError: () => true,
  onStateChange: () => {},
};

/**
 * Circuit breaker for protecting against cascading failures
 * 
 * @example
 * ```typescript
 * const breaker = new CircuitBreaker({ failureThreshold: 3 });
 * 
 * const result = await breaker.execute(async () => {
 *   return await riskyOperation();
 * });
 * ```
 */
export class CircuitBreaker {
  private state: CircuitState = 'CLOSED';
  private failureCount = 0;
  private successCount = 0;
  private nextAttempt = Date.now();
  private options: Required<CircuitBreakerOptions>;
  
  constructor(options: CircuitBreakerOptions = {}) {
    this.options = { ...DEFAULT_OPTIONS, ...options };
  }
  
  /**
   * Execute a function through the circuit breaker
   */
  async execute<T>(fn: () => Promise<T>): Promise<T> {
    // Check if circuit is open
    if (this.state === 'OPEN') {
      if (Date.now() < this.nextAttempt) {
        throw new Error('Circuit breaker is OPEN');
      }
      // Transition to half-open
      this.setState('HALF_OPEN');
    }
    
    try {
      const result = await fn();
      this.onSuccess();
      return result;
    } catch (error) {
      this.onFailure(error as Error);
      throw error;
    }
  }
  
  /**
   * Handle successful execution
   */
  private onSuccess(): void {
    this.failureCount = 0;
    
    if (this.state === 'HALF_OPEN') {
      this.successCount++;
      if (this.successCount >= this.options.successThreshold) {
        this.setState('CLOSED');
        this.successCount = 0;
      }
    }
  }
  
  /**
   * Handle failed execution
   */
  private onFailure(error: Error): void {
    if (!this.options.isError(error)) {
      return;
    }
    
    this.failureCount++;
    this.successCount = 0;
    
    if (this.state === 'HALF_OPEN') {
      this.setState('OPEN');
      this.nextAttempt = Date.now() + this.options.timeout;
    } else if (this.failureCount >= this.options.failureThreshold) {
      this.setState('OPEN');
      this.nextAttempt = Date.now() + this.options.timeout;
    }
  }
  
  /**
   * Change circuit state
   */
  private setState(newState: CircuitState): void {
    const oldState = this.state;
    this.state = newState;
    this.options.onStateChange(oldState, newState);
  }
  
  /**
   * Get current state
   */
  getState(): CircuitState {
    return this.state;
  }
  
  /**
   * Reset circuit breaker
   */
  reset(): void {
    this.state = 'CLOSED';
    this.failureCount = 0;
    this.successCount = 0;
    this.nextAttempt = Date.now();
  }
  
  /**
   * Get metrics
   */
  getMetrics() {
    return {
      state: this.state,
      failureCount: this.failureCount,
      successCount: this.successCount,
      nextAttempt: this.nextAttempt,
    };
  }
}

/**
 * Create a circuit breaker instance
 */
export function createCircuitBreaker(
  options: CircuitBreakerOptions = {}
): CircuitBreaker {
  return new CircuitBreaker(options);
}
