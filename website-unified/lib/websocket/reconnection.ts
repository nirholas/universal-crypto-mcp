/**
 * Reconnection Manager
 * 
 * Handles automatic reconnection with exponential backoff,
 * jitter, and configurable retry limits
 * 
 * @author Nich (@nichxbt)
 * @license Apache-2.0
 */

export interface ReconnectionConfig {
  // Maximum number of reconnection attempts
  maxAttempts: number;
  // Base delay between attempts (ms)
  baseDelay: number;
  // Maximum delay cap (ms)
  maxDelay: number;
  // Exponential factor
  factor: number;
  // Add random jitter (0-1)
  jitter: number;
  // Callback when attempting reconnect
  onReconnect: () => void;
  // Callback when max attempts reached
  onMaxAttemptsReached: () => void;
  // Callback on each attempt
  onAttempt?: (attempt: number, delay: number) => void;
}

export interface ReconnectionState {
  attempts: number;
  nextDelay: number;
  isReconnecting: boolean;
  lastAttemptAt: number | null;
  scheduledAt: number | null;
}

const DEFAULT_CONFIG: ReconnectionConfig = {
  maxAttempts: 10,
  baseDelay: 1000,
  maxDelay: 30000,
  factor: 2,
  jitter: 0.3,
  onReconnect: () => {},
  onMaxAttemptsReached: () => {},
};

export class ReconnectionManager {
  private config: ReconnectionConfig;
  private state: ReconnectionState = {
    attempts: 0,
    nextDelay: 0,
    isReconnecting: false,
    lastAttemptAt: null,
    scheduledAt: null,
  };
  private reconnectTimer: NodeJS.Timeout | null = null;

  constructor(config: Partial<ReconnectionConfig> = {}) {
    this.config = { ...DEFAULT_CONFIG, ...config };
    this.state.nextDelay = this.config.baseDelay;
  }

  // ============================================================================
  // Core Operations
  // ============================================================================

  /**
   * Schedule a reconnection attempt
   */
  scheduleReconnect(): void {
    if (this.state.isReconnecting) {
      return;
    }

    if (this.state.attempts >= this.config.maxAttempts) {
      this.config.onMaxAttemptsReached();
      return;
    }

    this.state.isReconnecting = true;
    this.state.attempts++;

    // Calculate delay with exponential backoff
    const delay = this.calculateDelay();
    this.state.nextDelay = delay;
    this.state.scheduledAt = Date.now();

    // Notify about attempt
    if (this.config.onAttempt) {
      this.config.onAttempt(this.state.attempts, delay);
    }

    console.log(`[Reconnection] Attempt ${this.state.attempts}/${this.config.maxAttempts} in ${delay}ms`);

    // Schedule reconnection
    this.reconnectTimer = setTimeout(() => {
      this.state.lastAttemptAt = Date.now();
      this.state.isReconnecting = false;
      this.config.onReconnect();
    }, delay);
  }

  /**
   * Calculate delay with exponential backoff and jitter
   */
  private calculateDelay(): number {
    // Exponential backoff: baseDelay * factor^(attempts-1)
    let delay = this.config.baseDelay * Math.pow(this.config.factor, this.state.attempts - 1);

    // Apply max delay cap
    delay = Math.min(delay, this.config.maxDelay);

    // Add jitter
    if (this.config.jitter > 0) {
      const jitterRange = delay * this.config.jitter;
      const jitterValue = Math.random() * jitterRange * 2 - jitterRange;
      delay = Math.max(this.config.baseDelay, delay + jitterValue);
    }

    return Math.round(delay);
  }

  /**
   * Stop any pending reconnection
   */
  stop(): void {
    if (this.reconnectTimer) {
      clearTimeout(this.reconnectTimer);
      this.reconnectTimer = null;
    }
    this.state.isReconnecting = false;
    this.state.scheduledAt = null;
  }

  /**
   * Reset the reconnection state
   */
  reset(): void {
    this.stop();
    this.state = {
      attempts: 0,
      nextDelay: this.config.baseDelay,
      isReconnecting: false,
      lastAttemptAt: null,
      scheduledAt: null,
    };
  }

  /**
   * Force an immediate reconnection attempt
   */
  reconnectNow(): void {
    this.stop();
    this.state.attempts++;
    this.state.lastAttemptAt = Date.now();
    this.config.onReconnect();
  }

  // ============================================================================
  // State Accessors
  // ============================================================================

  /**
   * Get current attempt count
   */
  get attempts(): number {
    return this.state.attempts;
  }

  /**
   * Check if currently reconnecting
   */
  get isReconnecting(): boolean {
    return this.state.isReconnecting;
  }

  /**
   * Get next scheduled delay
   */
  get nextDelay(): number {
    return this.state.nextDelay;
  }

  /**
   * Get remaining time until next attempt
   */
  get remainingTime(): number {
    if (!this.state.scheduledAt || !this.state.isReconnecting) {
      return 0;
    }
    const elapsed = Date.now() - this.state.scheduledAt;
    return Math.max(0, this.state.nextDelay - elapsed);
  }

  /**
   * Check if max attempts reached
   */
  get maxAttemptsReached(): boolean {
    return this.state.attempts >= this.config.maxAttempts;
  }

  /**
   * Get full state
   */
  getState(): ReconnectionState {
    return { ...this.state };
  }

  // ============================================================================
  // Configuration
  // ============================================================================

  /**
   * Update configuration
   */
  updateConfig(config: Partial<ReconnectionConfig>): void {
    this.config = { ...this.config, ...config };
  }

  /**
   * Get current configuration
   */
  getConfig(): ReconnectionConfig {
    return { ...this.config };
  }
}

// Export factory function
export function createReconnectionManager(
  config?: Partial<ReconnectionConfig>
): ReconnectionManager {
  return new ReconnectionManager(config);
}

// ============================================================================
// Utility Functions
// ============================================================================

/**
 * Calculate exponential backoff delay
 */
export function calculateBackoffDelay(
  attempt: number,
  baseDelay: number = 1000,
  maxDelay: number = 30000,
  factor: number = 2
): number {
  const delay = baseDelay * Math.pow(factor, attempt - 1);
  return Math.min(delay, maxDelay);
}

/**
 * Add jitter to a delay value
 */
export function addJitter(delay: number, jitterFactor: number = 0.3): number {
  const jitterRange = delay * jitterFactor;
  const jitter = Math.random() * jitterRange * 2 - jitterRange;
  return Math.max(0, delay + jitter);
}

/**
 * Create a delay promise
 */
export function delay(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

/**
 * Retry a function with exponential backoff
 */
export async function retryWithBackoff<T>(
  fn: () => Promise<T>,
  options: {
    maxAttempts?: number;
    baseDelay?: number;
    maxDelay?: number;
    factor?: number;
    onRetry?: (attempt: number, error: Error) => void;
  } = {}
): Promise<T> {
  const {
    maxAttempts = 3,
    baseDelay = 1000,
    maxDelay = 30000,
    factor = 2,
    onRetry,
  } = options;

  let lastError: Error | undefined;

  for (let attempt = 1; attempt <= maxAttempts; attempt++) {
    try {
      return await fn();
    } catch (error) {
      lastError = error instanceof Error ? error : new Error(String(error));
      
      if (attempt === maxAttempts) {
        break;
      }

      const delayMs = calculateBackoffDelay(attempt, baseDelay, maxDelay, factor);
      
      if (onRetry) {
        onRetry(attempt, lastError);
      }

      await delay(addJitter(delayMs));
    }
  }

  throw lastError || new Error('Max retries exceeded');
}
