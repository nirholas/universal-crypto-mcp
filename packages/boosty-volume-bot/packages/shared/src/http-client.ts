import { APIError, NetworkError, RateLimitError } from './errors.js';
import { TIMEOUTS } from './constants.js';

/**
 * HTTP request options
 */
export interface FetchOptions extends RequestInit {
  /** Request timeout in milliseconds */
  timeout?: number;
}

/**
 * Retry options
 */
export interface RetryOptions {
  /** Maximum number of retries */
  maxRetries?: number;
  /** Base delay between retries in milliseconds */
  baseDelayMs?: number;
  /** Maximum delay between retries in milliseconds */
  maxDelayMs?: number;
  /** Whether to retry on rate limit errors */
  retryOnRateLimit?: boolean;
  /** HTTP status codes to retry on */
  retryableStatuses?: number[];
}

/**
 * Default retry options
 */
const DEFAULT_RETRY_OPTIONS: Required<RetryOptions> = {
  maxRetries: 3,
  baseDelayMs: 1000,
  maxDelayMs: 10_000,
  retryOnRateLimit: true,
  retryableStatuses: [408, 429, 500, 502, 503, 504],
};

/**
 * Fetch with timeout support
 */
async function fetchWithTimeout(
  url: string,
  options: FetchOptions = {}
): Promise<Response> {
  const { timeout = TIMEOUTS.DEFAULT, ...fetchOptions } = options;

  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), timeout);

  try {
    const response = await fetch(url, {
      ...fetchOptions,
      signal: controller.signal,
    });
    return response;
  } catch (error) {
    if (error instanceof Error && error.name === 'AbortError') {
      throw new NetworkError(`Request timeout after ${timeout}ms`, {
        endpoint: url,
        isTimeout: true,
        cause: error,
      });
    }
    throw error;
  } finally {
    clearTimeout(timeoutId);
  }
}

/**
 * Calculate exponential backoff delay
 */
function calculateBackoff(
  attempt: number,
  baseDelayMs: number,
  maxDelayMs: number
): number {
  // Exponential backoff with jitter
  const exponentialDelay = baseDelayMs * Math.pow(2, attempt);
  const jitter = Math.random() * 0.3 * exponentialDelay; // 0-30% jitter
  return Math.min(exponentialDelay + jitter, maxDelayMs);
}

/**
 * Sleep for a given number of milliseconds
 */
function sleep(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

/**
 * Check if a status code is retryable
 */
function isRetryableStatus(status: number, retryableStatuses: number[]): boolean {
  return retryableStatuses.includes(status);
}

/**
 * Fetch with retry logic and exponential backoff
 * 
 * @param url - URL to fetch
 * @param options - Fetch options
 * @param retryOptions - Retry configuration
 * @returns Response object
 */
export async function fetchWithRetry(
  url: string,
  options: FetchOptions = {},
  retryOptions: RetryOptions = {}
): Promise<Response> {
  const config = { ...DEFAULT_RETRY_OPTIONS, ...retryOptions };
  let lastError: Error | undefined;

  for (let attempt = 0; attempt <= config.maxRetries; attempt++) {
    try {
      const response = await fetchWithTimeout(url, options);

      // Handle rate limiting
      if (response.status === 429) {
        if (!config.retryOnRateLimit || attempt === config.maxRetries) {
          const retryAfter = response.headers.get('Retry-After');
          throw new RateLimitError('Rate limit exceeded', {
            retryAfterMs: retryAfter ? parseInt(retryAfter, 10) * 1000 : undefined,
            details: { url, attempt },
          });
        }

        // Wait and retry
        const retryAfter = response.headers.get('Retry-After');
        const delayMs = retryAfter
          ? parseInt(retryAfter, 10) * 1000
          : calculateBackoff(attempt, config.baseDelayMs, config.maxDelayMs);

        await sleep(delayMs);
        continue;
      }

      // Handle other retryable status codes
      if (isRetryableStatus(response.status, config.retryableStatuses)) {
        if (attempt === config.maxRetries) {
          throw new APIError(`HTTP ${response.status}: ${response.statusText}`, {
            statusCode: response.status,
            endpoint: url,
            method: options.method || 'GET',
          });
        }

        const delayMs = calculateBackoff(attempt, config.baseDelayMs, config.maxDelayMs);
        await sleep(delayMs);
        continue;
      }

      // Return successful or non-retryable response
      return response;
    } catch (error) {
      lastError = error instanceof Error ? error : new Error(String(error));

      // Don't retry on non-network errors (except our custom errors which we've already handled)
      if (!(error instanceof NetworkError) && !(error instanceof RateLimitError)) {
        // Check if it's a network-level error that we should retry
        if (error instanceof TypeError && error.message.includes('fetch')) {
          // Network error, retry
          if (attempt < config.maxRetries) {
            const delayMs = calculateBackoff(attempt, config.baseDelayMs, config.maxDelayMs);
            await sleep(delayMs);
            continue;
          }
        }
        throw error;
      }

      // Retry on network errors
      if (attempt < config.maxRetries && error instanceof NetworkError && !error.isTimeout) {
        const delayMs = calculateBackoff(attempt, config.baseDelayMs, config.maxDelayMs);
        await sleep(delayMs);
        continue;
      }

      throw error;
    }
  }

  // Should not reach here, but just in case
  throw lastError ?? new NetworkError('Request failed after all retries', { endpoint: url });
}

/**
 * Fetch JSON with retry logic
 * 
 * @param url - URL to fetch
 * @param options - Fetch options
 * @param retryOptions - Retry configuration
 * @returns Parsed JSON response
 */
export async function fetchJson<T = unknown>(
  url: string,
  options: FetchOptions = {},
  retryOptions: RetryOptions = {}
): Promise<T> {
  const response = await fetchWithRetry(url, {
    ...options,
    headers: {
      'Accept': 'application/json',
      ...options.headers,
    },
  }, retryOptions);

  if (!response.ok) {
    let errorBody: unknown;
    try {
      errorBody = await response.json();
    } catch {
      errorBody = await response.text();
    }

    throw new APIError(`HTTP ${response.status}: ${response.statusText}`, {
      statusCode: response.status,
      endpoint: url,
      method: options.method || 'GET',
      details: { body: errorBody },
    });
  }

  return response.json() as Promise<T>;
}

/**
 * HTTP client with built-in retry and rate limiting support
 */
export class HttpClient {
  private baseUrl: string;
  private defaultHeaders: Record<string, string>;
  private defaultTimeout: number;
  private retryOptions: RetryOptions;

  constructor(options: {
    baseUrl?: string;
    headers?: Record<string, string>;
    timeout?: number;
    retryOptions?: RetryOptions;
  } = {}) {
    this.baseUrl = options.baseUrl ?? '';
    this.defaultHeaders = options.headers ?? {};
    this.defaultTimeout = options.timeout ?? TIMEOUTS.DEFAULT;
    this.retryOptions = options.retryOptions ?? {};
  }

  /**
   * Build full URL
   */
  private buildUrl(path: string): string {
    if (path.startsWith('http://') || path.startsWith('https://')) {
      return path;
    }
    return `${this.baseUrl}${path}`;
  }

  /**
   * Make a GET request
   */
  async get<T = unknown>(path: string, options: FetchOptions = {}): Promise<T> {
    return fetchJson<T>(
      this.buildUrl(path),
      {
        ...options,
        method: 'GET',
        timeout: options.timeout ?? this.defaultTimeout,
        headers: {
          ...this.defaultHeaders,
          ...options.headers,
        },
      },
      this.retryOptions
    );
  }

  /**
   * Make a POST request
   */
  async post<T = unknown>(
    path: string,
    body?: unknown,
    options: FetchOptions = {}
  ): Promise<T> {
    return fetchJson<T>(
      this.buildUrl(path),
      {
        ...options,
        method: 'POST',
        timeout: options.timeout ?? this.defaultTimeout,
        headers: {
          'Content-Type': 'application/json',
          ...this.defaultHeaders,
          ...options.headers,
        },
        body: body ? JSON.stringify(body) : undefined,
      },
      this.retryOptions
    );
  }

  /**
   * Make a PUT request
   */
  async put<T = unknown>(
    path: string,
    body?: unknown,
    options: FetchOptions = {}
  ): Promise<T> {
    return fetchJson<T>(
      this.buildUrl(path),
      {
        ...options,
        method: 'PUT',
        timeout: options.timeout ?? this.defaultTimeout,
        headers: {
          'Content-Type': 'application/json',
          ...this.defaultHeaders,
          ...options.headers,
        },
        body: body ? JSON.stringify(body) : undefined,
      },
      this.retryOptions
    );
  }

  /**
   * Make a DELETE request
   */
  async delete<T = unknown>(path: string, options: FetchOptions = {}): Promise<T> {
    return fetchJson<T>(
      this.buildUrl(path),
      {
        ...options,
        method: 'DELETE',
        timeout: options.timeout ?? this.defaultTimeout,
        headers: {
          ...this.defaultHeaders,
          ...options.headers,
        },
      },
      this.retryOptions
    );
  }
}

/**
 * HTTP client options for factory function
 */
export interface HttpClientOptions {
  /** Base URL for all requests */
  baseUrl?: string;
  /** Default headers */
  headers?: Record<string, string>;
  /** Request timeout in ms */
  timeout?: number;
  /** Retry configuration */
  retryOptions?: RetryOptions;
}

/**
 * Factory function to create an HTTP client instance
 */
export function createHttpClient(options: HttpClientOptions = {}): HttpClient {
  return new HttpClient(options);
}
