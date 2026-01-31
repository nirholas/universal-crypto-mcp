/**
 * API Layer
 * 
 * API client utilities and type-safe RPC.
 * 
 * Reference: /vendor/api/
 */

// ============================================================
// Types
// ============================================================

export interface APIResponse<T> {
  success: boolean;
  data?: T;
  error?: {
    code: string;
    message: string;
    details?: unknown;
  };
  meta?: {
    page?: number;
    total?: number;
    rateLimit?: RateLimitInfo;
  };
}

export interface RateLimitInfo {
  limit: number;
  remaining: number;
  reset: number;
}

export interface RequestConfig {
  baseURL?: string;
  headers?: Record<string, string>;
  timeout?: number;
}

// ============================================================
// HTTP Client
// ============================================================

export class APIClient {
  private baseURL: string;
  private headers: Record<string, string>;
  private timeout: number;

  constructor(config: RequestConfig = {}) {
    this.baseURL = config.baseURL || '';
    this.headers = config.headers || {};
    this.timeout = config.timeout || 30000;
  }

  async get<T>(path: string, params?: Record<string, string>): Promise<APIResponse<T>> {
    const url = new URL(path, this.baseURL);
    if (params) {
      Object.entries(params).forEach(([key, value]) => url.searchParams.set(key, value));
    }
    return this.request<T>(url.toString(), { method: 'GET' });
  }

  async post<T>(path: string, body?: unknown): Promise<APIResponse<T>> {
    return this.request<T>(`${this.baseURL}${path}`, {
      method: 'POST',
      body: body ? JSON.stringify(body) : undefined,
    });
  }

  async put<T>(path: string, body?: unknown): Promise<APIResponse<T>> {
    return this.request<T>(`${this.baseURL}${path}`, {
      method: 'PUT',
      body: body ? JSON.stringify(body) : undefined,
    });
  }

  async delete<T>(path: string): Promise<APIResponse<T>> {
    return this.request<T>(`${this.baseURL}${path}`, { method: 'DELETE' });
  }

  private async request<T>(url: string, init: RequestInit): Promise<APIResponse<T>> {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), this.timeout);

    try {
      const response = await fetch(url, {
        ...init,
        headers: {
          'Content-Type': 'application/json',
          ...this.headers,
          ...init.headers,
        },
        signal: controller.signal,
      });

      clearTimeout(timeoutId);

      const data = await response.json();

      if (!response.ok) {
        return {
          success: false,
          error: {
            code: `HTTP_${response.status}`,
            message: data.message || response.statusText,
            details: data,
          },
        };
      }

      return { success: true, data };
    } catch (error) {
      clearTimeout(timeoutId);
      return {
        success: false,
        error: {
          code: 'NETWORK_ERROR',
          message: error instanceof Error ? error.message : 'Unknown error',
        },
      };
    }
  }

  setHeader(key: string, value: string): void {
    this.headers[key] = value;
  }
}

// ============================================================
// Factory
// ============================================================

export function createAPIClient(config?: RequestConfig): APIClient {
  return new APIClient(config);
}
