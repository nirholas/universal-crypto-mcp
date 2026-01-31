/**
 * HTTP Client with Rate Limiting, Retry, Timeout, and Observability
 * 
 * A resilient HTTP client that combines all utility features.
 * 
 * @module http
 * @author nich <nich@nichxbt.com>
 */

import { RateLimiter, RateLimiterConfig, API_RATE_LIMITS } from '../rate-limiter/index.js';
import { retry, RetryConfig, CircuitBreaker, CircuitBreakerConfig } from '../retry/index.js';
import { withTimeout, DEFAULT_TIMEOUTS } from '../timeout/index.js';
import { ApiError, RateLimitError, TimeoutError, createErrorFromResponse } from '../errors/index.js';
import { Logger, createLogger } from '../logger/index.js';
import { Histogram, Counter } from '../metrics/index.js';

// ============================================================================
// Types
// ============================================================================

export interface HttpClientConfig {
  /** Base URL for all requests */
  baseUrl: string;
  /** Client name (for logging and metrics) */
  name: string;
  /** Default headers */
  headers?: Record<string, string>;
  /** Request timeout in ms */
  timeout?: number;
  /** Rate limiter config */
  rateLimit?: RateLimiterConfig | keyof typeof API_RATE_LIMITS;
  /** Retry config */
  retry?: Partial<RetryConfig>;
  /** Circuit breaker config */
  circuitBreaker?: CircuitBreakerConfig;
  /** Enable request/response logging */
  logging?: boolean;
  /** Log level for requests */
  logLevel?: 'debug' | 'info';
}

export interface RequestOptions {
  method?: 'GET' | 'POST' | 'PUT' | 'DELETE' | 'PATCH';
  headers?: Record<string, string>;
  body?: unknown;
  params?: Record<string, string | number | boolean | undefined>;
  timeout?: number;
  skipRateLimit?: boolean;
  skipRetry?: boolean;
  skipCircuitBreaker?: boolean;
}

export interface HttpResponse<T = unknown> {
  data: T;
  status: number;
  headers: Record<string, string>;
  duration: number;
}

// ============================================================================
// HTTP Client
// ============================================================================

/**
 * Resilient HTTP Client
 * 
 * @example
 * ```typescript
 * const client = new HttpClient({
 *   baseUrl: 'https://api.coingecko.com/api/v3',
 *   name: 'coingecko',
 *   rateLimit: 'coingecko',
 *   retry: { maxRetries: 3 },
 *   timeout: 10000
 * });
 * 
 * const price = await client.get('/simple/price', {
 *   params: { ids: 'bitcoin', vs_currencies: 'usd' }
 * });
 * ```
 */
export class HttpClient {
  private config: Required<Omit<HttpClientConfig, 'rateLimit' | 'retry' | 'circuitBreaker'>> & {
    rateLimit?: RateLimiterConfig;
    retry?: Partial<RetryConfig>;
    circuitBreaker?: CircuitBreakerConfig;
  };
  private rateLimiter?: RateLimiter;
  private circuitBreaker?: CircuitBreaker;
  private logger: Logger;
  
  // Metrics
  private requestCounter: Counter;
  private requestDuration: Histogram;
  private errorCounter: Counter;

  constructor(config: HttpClientConfig) {
    this.config = {
      ...config,
      headers: config.headers ?? {},
      timeout: config.timeout ?? DEFAULT_TIMEOUTS.HTTP_REQUEST,
      logging: config.logging ?? true,
      logLevel: config.logLevel ?? 'debug',
    };

    // Setup rate limiter
    if (config.rateLimit) {
      const rateLimitConfig = typeof config.rateLimit === 'string'
        ? API_RATE_LIMITS[config.rateLimit]
        : config.rateLimit;
      this.rateLimiter = new RateLimiter(rateLimitConfig);
    }

    // Setup circuit breaker
    if (config.circuitBreaker) {
      this.circuitBreaker = new CircuitBreaker(config.circuitBreaker);
    }

    // Setup logger
    this.logger = createLogger({ name: `http:${config.name}` });

    // Setup metrics
    this.requestCounter = new Counter(
      `http_${config.name}_requests_total`,
      `Total HTTP requests to ${config.name}`
    );
    this.requestDuration = new Histogram(
      `http_${config.name}_request_duration_seconds`,
      `HTTP request duration for ${config.name}`
    );
    this.errorCounter = new Counter(
      `http_${config.name}_errors_total`,
      `Total HTTP errors for ${config.name}`
    );
  }

  /**
   * Make a GET request
   */
  async get<T = unknown>(path: string, options?: Omit<RequestOptions, 'method' | 'body'>): Promise<HttpResponse<T>> {
    return this.request<T>(path, { ...options, method: 'GET' });
  }

  /**
   * Make a POST request
   */
  async post<T = unknown>(path: string, body?: unknown, options?: Omit<RequestOptions, 'method' | 'body'>): Promise<HttpResponse<T>> {
    return this.request<T>(path, { ...options, method: 'POST', body });
  }

  /**
   * Make a PUT request
   */
  async put<T = unknown>(path: string, body?: unknown, options?: Omit<RequestOptions, 'method' | 'body'>): Promise<HttpResponse<T>> {
    return this.request<T>(path, { ...options, method: 'PUT', body });
  }

  /**
   * Make a DELETE request
   */
  async delete<T = unknown>(path: string, options?: Omit<RequestOptions, 'method' | 'body'>): Promise<HttpResponse<T>> {
    return this.request<T>(path, { ...options, method: 'DELETE' });
  }

  /**
   * Make a PATCH request
   */
  async patch<T = unknown>(path: string, body?: unknown, options?: Omit<RequestOptions, 'method' | 'body'>): Promise<HttpResponse<T>> {
    return this.request<T>(path, { ...options, method: 'PATCH', body });
  }

  /**
   * Make a request with all resilience features
   */
  async request<T = unknown>(path: string, options: RequestOptions = {}): Promise<HttpResponse<T>> {
    const method = options.method ?? 'GET';
    const url = this.buildUrl(path, options.params);
    const timeout = options.timeout ?? this.config.timeout;
    const startTime = Date.now();

    // Log request
    if (this.config.logging) {
      this.logger[this.config.logLevel](`${method} ${url}`, {
        timeout,
        hasBody: !!options.body,
      });
    }

    // Increment request counter
    this.requestCounter.inc({ method, path });

    // Apply rate limiting
    if (!options.skipRateLimit && this.rateLimiter) {
      const rateLimitResult = await this.rateLimiter.acquire();
      if (!rateLimitResult.allowed) {
        this.errorCounter.inc({ method, path, error: 'rate_limit' });
        throw new RateLimitError('Rate limit exceeded', {
          retryAfter: rateLimitResult.retryAfter,
        });
      }
    }

    // The actual request function
    const makeRequest = async (): Promise<HttpResponse<T>> => {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), timeout);

      try {
        const headers: Record<string, string> = {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
          ...this.config.headers,
          ...options.headers,
        };

        const response = await fetch(url, {
          method,
          headers,
          body: options.body ? JSON.stringify(options.body) : undefined,
          signal: controller.signal,
        });

        const duration = Date.now() - startTime;
        this.requestDuration.observe(duration / 1000, { method, path });

        // Parse response
        const contentType = response.headers.get('content-type');
        let data: T;
        if (contentType?.includes('application/json')) {
          data = await response.json() as T;
        } else {
          data = await response.text() as unknown as T;
        }

        // Log response
        if (this.config.logging) {
          this.logger[this.config.logLevel](`${method} ${url} -> ${response.status}`, {
            durationMs: duration,
          });
        }

        // Handle error responses
        if (!response.ok) {
          this.errorCounter.inc({ method, path, error: `http_${response.status}` });
          throw createErrorFromResponse(response.status, data, url);
        }

        return {
          data,
          status: response.status,
          headers: Object.fromEntries(response.headers.entries()),
          duration,
        };
      } catch (error) {
        if (error instanceof Error && error.name === 'AbortError') {
          this.errorCounter.inc({ method, path, error: 'timeout' });
          throw new TimeoutError(`Request timed out after ${timeout}ms`, {
            timeoutMs: timeout,
            operation: `${method} ${url}`,
          });
        }
        throw error;
      } finally {
        clearTimeout(timeoutId);
      }
    };

    // Apply circuit breaker
    let requestFn = makeRequest;
    if (!options.skipCircuitBreaker && this.circuitBreaker) {
      requestFn = () => this.circuitBreaker!.execute(makeRequest);
    }

    // Apply retry logic
    if (!options.skipRetry && this.config.retry) {
      const result = await retry(requestFn, {
        ...this.config.retry,
        onRetry: (error, attempt, delay) => {
          this.logger.warn(`Retry attempt ${attempt} for ${method} ${url}`, {
            error: error.message,
            delayMs: delay,
          });
        },
      });

      if (!result.success) {
        throw result.error;
      }
      return result.data!;
    }

    return requestFn();
  }

  /**
   * Build URL with query parameters
   */
  private buildUrl(path: string, params?: Record<string, string | number | boolean | undefined>): string {
    const base = this.config.baseUrl.endsWith('/')
      ? this.config.baseUrl.slice(0, -1)
      : this.config.baseUrl;
    const fullPath = path.startsWith('/') ? path : `/${path}`;
    const url = new URL(base + fullPath);

    if (params) {
      for (const [key, value] of Object.entries(params)) {
        if (value !== undefined) {
          url.searchParams.set(key, String(value));
        }
      }
    }

    return url.toString();
  }

  /**
   * Get circuit breaker status
   */
  getCircuitBreakerStatus(): { state: string; failures: number } | undefined {
    if (!this.circuitBreaker) return undefined;
    const stats = this.circuitBreaker.getStats();
    return { state: stats.state, failures: stats.failures };
  }

  /**
   * Get rate limiter status
   */
  getRateLimiterStatus(): { tokens: number; maxTokens: number } | undefined {
    if (!this.rateLimiter) return undefined;
    return this.rateLimiter.getStatus();
  }
}

// ============================================================================
// Factory Functions
// ============================================================================

/**
 * Create a pre-configured HTTP client for common APIs
 */
export function createApiClient(
  name: keyof typeof API_RATE_LIMITS,
  baseUrl: string,
  options?: Partial<HttpClientConfig>
): HttpClient {
  return new HttpClient({
    name,
    baseUrl,
    rateLimit: name,
    retry: {
      maxRetries: 3,
      initialDelay: 1000,
      maxDelay: 10000,
    },
    circuitBreaker: {
      failureThreshold: 5,
      resetTimeout: 30000,
      successThreshold: 2,
    },
    ...options,
  });
}

/**
 * Pre-configured clients for common APIs
 */
export const apiClients = {
  coingecko: () => createApiClient('coingecko', 'https://api.coingecko.com/api/v3'),
  etherscan: (apiKey?: string) => createApiClient(
    'etherscan',
    'https://api.etherscan.io/api',
    { headers: apiKey ? { 'X-API-Key': apiKey } : undefined }
  ),
  dune: (apiKey?: string) => createApiClient(
    'dune',
    'https://api.dune.com/api/v1',
    { headers: apiKey ? { 'X-DUNE-API-KEY': apiKey } : undefined }
  ),
};
