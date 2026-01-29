/**
 * HTTP Client with Timeout Support
 * 
 * Provides a fetch wrapper with configurable timeouts, retries, and proper error handling.
 */

import { withRetry, API_RETRY_CONFIG, type RetryConfig } from './retry.js';

/**
 * HTTP client configuration
 */
export interface HttpClientConfig {
  /** Request timeout in milliseconds */
  timeoutMs: number;
  /** Base URL for requests */
  baseUrl?: string;
  /** Default headers */
  defaultHeaders?: Record<string, string>;
  /** Retry configuration */
  retryConfig?: Partial<RetryConfig>;
  /** Enable request logging */
  enableLogging?: boolean;
}

/**
 * Default HTTP client configuration
 */
export const DEFAULT_HTTP_CONFIG: HttpClientConfig = {
  timeoutMs: 30000, // 30 seconds
  defaultHeaders: {
    'Accept': 'application/json',
    'Content-Type': 'application/json',
  },
  retryConfig: API_RETRY_CONFIG,
  enableLogging: false,
};

/**
 * HTTP error with status code and response body
 */
export class HttpError extends Error {
  readonly status: number;
  readonly statusText: string;
  readonly body: string;
  readonly url: string;

  constructor(status: number, statusText: string, body: string, url: string) {
    super(`HTTP ${status} ${statusText}: ${body.slice(0, 200)}`);
    this.name = 'HttpError';
    this.status = status;
    this.statusText = statusText;
    this.body = body;
    this.url = url;
  }

  /**
   * Check if error is due to rate limiting
   */
  get isRateLimited(): boolean {
    return this.status === 429;
  }

  /**
   * Check if error is a server error
   */
  get isServerError(): boolean {
    return this.status >= 500 && this.status < 600;
  }

  /**
   * Check if error is a client error
   */
  get isClientError(): boolean {
    return this.status >= 400 && this.status < 500;
  }
}

/**
 * Timeout error
 */
export class TimeoutError extends Error {
  readonly url: string;
  readonly timeoutMs: number;

  constructor(url: string, timeoutMs: number) {
    super(`Request to ${url} timed out after ${timeoutMs}ms`);
    this.name = 'TimeoutError';
    this.url = url;
    this.timeoutMs = timeoutMs;
  }
}

/**
 * Fetch with timeout support
 */
async function fetchWithTimeout(
  url: string,
  options: RequestInit,
  timeoutMs: number
): Promise<Response> {
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), timeoutMs);

  try {
    const response = await fetch(url, {
      ...options,
      signal: controller.signal,
    });
    return response;
  } catch (error) {
    if (error instanceof Error && error.name === 'AbortError') {
      throw new TimeoutError(url, timeoutMs);
    }
    throw error;
  } finally {
    clearTimeout(timeoutId);
  }
}

/**
 * HTTP Client with built-in timeout and retry support
 */
export class HttpClient {
  private readonly config: HttpClientConfig;

  constructor(config: Partial<HttpClientConfig> = {}) {
    this.config = { ...DEFAULT_HTTP_CONFIG, ...config };
  }

  /**
   * Build full URL
   */
  private buildUrl(path: string): string {
    if (path.startsWith('http://') || path.startsWith('https://')) {
      return path;
    }
    if (this.config.baseUrl) {
      return `${this.config.baseUrl}${path}`;
    }
    return path;
  }

  /**
   * Execute HTTP GET request
   */
  async get<T>(url: string, options: {
    headers?: Record<string, string>;
    timeoutMs?: number;
    skipRetry?: boolean;
  } = {}): Promise<T> {
    return this.request<T>('GET', url, undefined, options);
  }

  /**
   * Execute HTTP POST request
   */
  async post<T>(url: string, body?: unknown, options: {
    headers?: Record<string, string>;
    timeoutMs?: number;
    skipRetry?: boolean;
  } = {}): Promise<T> {
    return this.request<T>('POST', url, body, options);
  }

  /**
   * Execute HTTP request with retry and timeout
   */
  private async request<T>(
    method: string,
    url: string,
    body?: unknown,
    options: {
      headers?: Record<string, string>;
      timeoutMs?: number;
      skipRetry?: boolean;
    } = {}
  ): Promise<T> {
    const fullUrl = this.buildUrl(url);
    const timeoutMs = options.timeoutMs ?? this.config.timeoutMs;
    const headers = { ...this.config.defaultHeaders, ...options.headers };

    const requestOptions: RequestInit = {
      method,
      headers,
    };

    if (body !== undefined) {
      requestOptions.body = JSON.stringify(body);
    }

    const executeRequest = async (): Promise<T> => {
      if (this.config.enableLogging) {
        console.log(`[HTTP] ${method} ${fullUrl}`);
      }

      const response = await fetchWithTimeout(fullUrl, requestOptions, timeoutMs);

      if (!response.ok) {
        const errorBody = await response.text();
        throw new HttpError(response.status, response.statusText, errorBody, fullUrl);
      }

      const data = await response.json() as T;
      return data;
    };

    if (options.skipRetry) {
      return executeRequest();
    }

    return withRetry(
      () => executeRequest(),
      {
        ...this.config.retryConfig,
        isRetryable: (error) => {
          // Retry on timeout
          if (error instanceof TimeoutError) {
            return true;
          }
          // Retry on server errors and rate limits
          if (error instanceof HttpError) {
            return error.isServerError || error.isRateLimited;
          }
          // Check default retryable errors
          return false;
        },
      }
    );
  }

  /**
   * Execute HTTP request and return raw response
   */
  async requestRaw(
    method: string,
    url: string,
    body?: unknown,
    options: {
      headers?: Record<string, string>;
      timeoutMs?: number;
    } = {}
  ): Promise<Response> {
    const fullUrl = this.buildUrl(url);
    const timeoutMs = options.timeoutMs ?? this.config.timeoutMs;
    const headers = { ...this.config.defaultHeaders, ...options.headers };

    const requestOptions: RequestInit = {
      method,
      headers,
    };

    if (body !== undefined) {
      requestOptions.body = JSON.stringify(body);
    }

    return fetchWithTimeout(fullUrl, requestOptions, timeoutMs);
  }
}

/**
 * Create a pre-configured HTTP client
 */
export function createHttpClient(config: Partial<HttpClientConfig> = {}): HttpClient {
  return new HttpClient(config);
}

/**
 * Jupiter API client
 */
export const jupiterHttpClient = new HttpClient({
  baseUrl: 'https://quote-api.jup.ag/v6',
  timeoutMs: 15000,
  retryConfig: {
    maxAttempts: 3,
    initialDelayMs: 500,
  },
});

/**
 * Jito API client
 */
export const jitoHttpClient = new HttpClient({
  baseUrl: 'https://mainnet.block-engine.jito.wtf',
  timeoutMs: 30000,
  retryConfig: {
    maxAttempts: 2,
    initialDelayMs: 1000,
  },
});

/**
 * PumpFun API client
 */
export const pumpFunHttpClient = new HttpClient({
  baseUrl: 'https://frontend-api.pump.fun',
  timeoutMs: 10000,
  retryConfig: {
    maxAttempts: 3,
    initialDelayMs: 500,
  },
});
