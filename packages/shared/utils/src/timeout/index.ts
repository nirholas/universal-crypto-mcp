/**
 * Timeout Utilities
 * 
 * Provides timeout handling for async operations to prevent hanging.
 * 
 * @module timeout
 * @author nich <nich@nichxbt.com>
 */

import { TimeoutError } from '../errors/index.js';

// ============================================================================
// Types
// ============================================================================

export interface TimeoutConfig {
  /** Timeout in milliseconds */
  timeoutMs: number;
  /** Custom error message */
  message?: string;
  /** Operation name for error context */
  operation?: string;
}

// ============================================================================
// Default Timeouts
// ============================================================================

export const DEFAULT_TIMEOUTS = {
  /** Default HTTP request timeout */
  HTTP_REQUEST: 30000,
  /** Fast API calls (price checks, etc.) */
  FAST_API: 5000,
  /** Slow API calls (large data fetches) */
  SLOW_API: 60000,
  /** Blockchain RPC calls */
  BLOCKCHAIN_RPC: 15000,
  /** Transaction submission */
  TRANSACTION: 30000,
  /** Transaction confirmation */
  CONFIRMATION: 120000,
  /** WebSocket connection */
  WEBSOCKET: 10000,
  /** Database query */
  DATABASE: 10000,
} as const;

// ============================================================================
// Timeout Functions
// ============================================================================

/**
 * Wrap a promise with a timeout
 * 
 * @example
 * ```typescript
 * const result = await withTimeout(
 *   fetch('https://api.example.com'),
 *   { timeoutMs: 5000, operation: 'fetch-data' }
 * );
 * ```
 */
export async function withTimeout<T>(
  promise: Promise<T>,
  config: TimeoutConfig | number
): Promise<T> {
  const { timeoutMs, message, operation } = typeof config === 'number'
    ? { timeoutMs: config, message: undefined, operation: undefined }
    : config;

  let timeoutId: NodeJS.Timeout | undefined;

  const timeoutPromise = new Promise<never>((_, reject) => {
    timeoutId = setTimeout(() => {
      reject(new TimeoutError(
        message ?? `Operation timed out after ${timeoutMs}ms`,
        { timeoutMs, operation }
      ));
    }, timeoutMs);
  });

  try {
    const result = await Promise.race([promise, timeoutPromise]);
    return result;
  } finally {
    if (timeoutId) {
      clearTimeout(timeoutId);
    }
  }
}

/**
 * Create a timeout-wrapped version of an async function
 * 
 * @example
 * ```typescript
 * const fetchWithTimeout = createTimeoutWrapper(
 *   fetch,
 *   { timeoutMs: 5000 }
 * );
 * const response = await fetchWithTimeout('https://api.example.com');
 * ```
 */
export function createTimeoutWrapper<T extends (...args: unknown[]) => Promise<unknown>>(
  fn: T,
  config: TimeoutConfig
): T {
  return (async (...args: Parameters<T>): Promise<ReturnType<T>> => {
    return withTimeout(fn(...args), config) as Promise<ReturnType<T>>;
  }) as T;
}

/**
 * Decorator for adding timeout to class methods
 */
export function timeout(config: TimeoutConfig) {
  return function <T extends (...args: unknown[]) => Promise<unknown>>(
    _target: unknown,
    propertyKey: string,
    descriptor: TypedPropertyDescriptor<T>
  ): TypedPropertyDescriptor<T> {
    const originalMethod = descriptor.value!;

    descriptor.value = async function (...args: Parameters<T>): Promise<ReturnType<T>> {
      return withTimeout(
        originalMethod.apply(this, args),
        { ...config, operation: config.operation ?? propertyKey }
      ) as Promise<ReturnType<T>>;
    } as T;

    return descriptor;
  };
}

/**
 * Wait for a condition with timeout
 * 
 * @example
 * ```typescript
 * await waitFor(
 *   async () => await isTransactionConfirmed(txHash),
 *   { timeoutMs: 60000, pollInterval: 1000 }
 * );
 * ```
 */
export async function waitFor(
  condition: () => Promise<boolean> | boolean,
  config: TimeoutConfig & { pollInterval?: number }
): Promise<void> {
  const { timeoutMs, pollInterval = 1000, message, operation } = config;
  const startTime = Date.now();

  while (true) {
    const result = await condition();
    if (result) {
      return;
    }

    const elapsed = Date.now() - startTime;
    if (elapsed >= timeoutMs) {
      throw new TimeoutError(
        message ?? `Condition not met within ${timeoutMs}ms`,
        { timeoutMs, operation }
      );
    }

    await sleep(Math.min(pollInterval, timeoutMs - elapsed));
  }
}

/**
 * Sleep for a specified duration
 */
export function sleep(ms: number): Promise<void> {
  return new Promise(resolve => setTimeout(resolve, ms));
}

/**
 * Create a deadline (absolute timeout)
 * 
 * @example
 * ```typescript
 * const deadline = createDeadline(5000);
 * 
 * while (!deadline.expired) {
 *   // Do work
 *   if (deadline.remaining < 1000) break;
 * }
 * ```
 */
export function createDeadline(timeoutMs: number): {
  expired: boolean;
  remaining: number;
  createdAt: number;
  expiresAt: number;
} {
  const createdAt = Date.now();
  const expiresAt = createdAt + timeoutMs;

  return {
    get expired() {
      return Date.now() >= expiresAt;
    },
    get remaining() {
      return Math.max(0, expiresAt - Date.now());
    },
    createdAt,
    expiresAt,
  };
}

/**
 * AbortController with timeout
 * 
 * @example
 * ```typescript
 * const controller = createTimeoutAbortController(5000);
 * 
 * const response = await fetch(url, { signal: controller.signal });
 * ```
 */
export function createTimeoutAbortController(timeoutMs: number): AbortController & { timeoutId: NodeJS.Timeout } {
  const controller = new AbortController();
  const timeoutId = setTimeout(() => {
    controller.abort(new TimeoutError(`Request aborted after ${timeoutMs}ms`, { timeoutMs }));
  }, timeoutMs);

  return Object.assign(controller, { timeoutId });
}

/**
 * Race multiple promises with a timeout
 */
export async function raceWithTimeout<T>(
  promises: Promise<T>[],
  config: TimeoutConfig
): Promise<T> {
  return withTimeout(Promise.race(promises), config);
}

/**
 * All promises with timeout
 */
export async function allWithTimeout<T>(
  promises: Promise<T>[],
  config: TimeoutConfig
): Promise<T[]> {
  return withTimeout(Promise.all(promises), config);
}
