/**
 * Internal HTTP Client
 * Production-ready HTTP client with retry, timeout, and error handling
 */

export interface HttpClientConfig {
  baseUrl?: string;
  timeout?: number;
  headers?: Record<string, string>;
  retries?: number;
  retryDelay?: number;
}

export interface HttpResponse<T> {
  data: T;
  status: number;
  headers: Record<string, string>;
}

export class HttpClient {
  private baseUrl: string;
  private timeout: number;
  private headers: Record<string, string>;
  private retries: number;
  private retryDelay: number;

  constructor(config: HttpClientConfig = {}) {
    this.baseUrl = config.baseUrl || '';
    this.timeout = config.timeout || 30000;
    this.headers = config.headers || {};
    this.retries = config.retries || 3;
    this.retryDelay = config.retryDelay || 1000;
  }

  private async sleep(ms: number): Promise<void> {
    return new Promise((resolve) => setTimeout(resolve, ms));
  }

  private async fetchWithRetry<T>(
    url: string,
    options: RequestInit,
    retriesLeft: number
  ): Promise<HttpResponse<T>> {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), this.timeout);

    try {
      const response = await fetch(url, {
        ...options,
        signal: controller.signal,
        headers: {
          'Content-Type': 'application/json',
          ...this.headers,
          ...(options.headers as Record<string, string>),
        },
      });

      clearTimeout(timeoutId);

      if (!response.ok) {
        const errorText = await response.text().catch(() => 'Unknown error');
        
        // Retry on 5xx errors or rate limits
        if ((response.status >= 500 || response.status === 429) && retriesLeft > 0) {
          const retryAfter = response.headers.get('Retry-After');
          const delay = retryAfter ? parseInt(retryAfter) * 1000 : this.retryDelay;
          await this.sleep(delay);
          return this.fetchWithRetry<T>(url, options, retriesLeft - 1);
        }

        throw new Error(`HTTP ${response.status}: ${errorText}`);
      }

      const data = await response.json() as T;
      const headers: Record<string, string> = {};
      response.headers.forEach((value, key) => {
        headers[key] = value;
      });

      return { data, status: response.status, headers };
    } catch (error) {
      clearTimeout(timeoutId);

      if (error instanceof Error && error.name === 'AbortError') {
        if (retriesLeft > 0) {
          await this.sleep(this.retryDelay);
          return this.fetchWithRetry<T>(url, options, retriesLeft - 1);
        }
        throw new Error(`Request timeout after ${this.timeout}ms`);
      }

      if (retriesLeft > 0 && error instanceof TypeError) {
        // Network errors
        await this.sleep(this.retryDelay);
        return this.fetchWithRetry<T>(url, options, retriesLeft - 1);
      }

      throw error;
    }
  }

  async get<T>(path: string, options?: { params?: Record<string, string | number | boolean>; headers?: Record<string, string> }): Promise<HttpResponse<T>> {
    let url = `${this.baseUrl}${path}`;
    
    if (options?.params) {
      const searchParams = new URLSearchParams();
      for (const [key, value] of Object.entries(options.params)) {
        searchParams.append(key, String(value));
      }
      url += `?${searchParams.toString()}`;
    }

    return this.fetchWithRetry<T>(url, {
      method: 'GET',
      headers: options?.headers,
    }, this.retries);
  }

  async post<T>(url: string, body?: unknown, options?: { headers?: Record<string, string> }): Promise<HttpResponse<T>> {
    const fullUrl = url.startsWith('http') ? url : `${this.baseUrl}${url}`;
    
    return this.fetchWithRetry<T>(fullUrl, {
      method: 'POST',
      body: body ? JSON.stringify(body) : undefined,
      headers: options?.headers,
    }, this.retries);
  }
}

export function createHttpClient(config?: HttpClientConfig): HttpClient {
  return new HttpClient(config);
}
