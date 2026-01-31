/**
 * Standardized Error Handling
 * 
 * Provides consistent error types and handling across all packages.
 * 
 * @module errors
 * @author nich <nich@nichxbt.com>
 */

// ============================================================================
// Base Error Classes
// ============================================================================

/**
 * Base error class for all Universal Crypto MCP errors
 */
export class UCMCPError extends Error {
  readonly code: string;
  readonly timestamp: Date;
  readonly context?: Record<string, unknown>;
  readonly cause?: Error;

  constructor(
    message: string,
    code: string,
    options?: { cause?: Error; context?: Record<string, unknown> }
  ) {
    super(message);
    this.name = 'UCMCPError';
    this.code = code;
    this.timestamp = new Date();
    this.cause = options?.cause;
    this.context = options?.context;

    // Maintains proper stack trace for where error was thrown
    Error.captureStackTrace?.(this, this.constructor);
  }

  /**
   * Convert to JSON for logging/serialization
   */
  toJSON(): Record<string, unknown> {
    return {
      name: this.name,
      code: this.code,
      message: this.message,
      timestamp: this.timestamp.toISOString(),
      context: this.context,
      cause: this.cause?.message,
      stack: this.stack,
    };
  }

  /**
   * Convert to MCP error response format
   */
  toMCPResponse(): { content: Array<{ type: string; text: string }>; isError: true } {
    return {
      content: [
        {
          type: 'text',
          text: JSON.stringify({
            error: this.code,
            message: this.message,
            timestamp: this.timestamp.toISOString(),
            context: this.context,
          }),
        },
      ],
      isError: true,
    };
  }
}

// ============================================================================
// Specific Error Types
// ============================================================================

/**
 * API errors from external services
 */
export class ApiError extends UCMCPError {
  readonly statusCode?: number;
  readonly endpoint?: string;

  constructor(
    message: string,
    options?: {
      code?: string;
      statusCode?: number;
      endpoint?: string;
      cause?: Error;
      context?: Record<string, unknown>;
    }
  ) {
    super(message, options?.code ?? 'API_ERROR', {
      cause: options?.cause,
      context: { ...options?.context, endpoint: options?.endpoint },
    });
    this.name = 'ApiError';
    this.statusCode = options?.statusCode;
    this.endpoint = options?.endpoint;
  }

  static fromResponse(
    statusCode: number,
    body: unknown,
    endpoint?: string
  ): ApiError {
    const message = typeof body === 'string' 
      ? body 
      : (body as { message?: string; error?: string })?.message 
        ?? (body as { message?: string; error?: string })?.error 
        ?? `API error: ${statusCode}`;
    
    return new ApiError(message, {
      code: `API_ERROR_${statusCode}`,
      statusCode,
      endpoint,
      context: { response: body },
    });
  }
}

/**
 * Rate limit exceeded error
 */
export class RateLimitError extends UCMCPError {
  readonly retryAfter?: number;
  readonly limit?: number;
  readonly remaining?: number;

  constructor(
    message: string = 'Rate limit exceeded',
    options?: {
      retryAfter?: number;
      limit?: number;
      remaining?: number;
      context?: Record<string, unknown>;
    }
  ) {
    super(message, 'RATE_LIMIT_EXCEEDED', {
      context: {
        retryAfter: options?.retryAfter,
        limit: options?.limit,
        remaining: options?.remaining,
        ...options?.context,
      },
    });
    this.name = 'RateLimitError';
    this.retryAfter = options?.retryAfter;
    this.limit = options?.limit;
    this.remaining = options?.remaining;
  }
}

/**
 * Timeout error
 */
export class TimeoutError extends UCMCPError {
  readonly timeoutMs: number;
  readonly operation?: string;

  constructor(
    message: string = 'Operation timed out',
    options?: { timeoutMs?: number; operation?: string; context?: Record<string, unknown> }
  ) {
    super(message, 'TIMEOUT', {
      context: { ...options?.context, timeoutMs: options?.timeoutMs, operation: options?.operation },
    });
    this.name = 'TimeoutError';
    this.timeoutMs = options?.timeoutMs ?? 0;
    this.operation = options?.operation;
  }
}

/**
 * Authentication error
 */
export class AuthenticationError extends UCMCPError {
  constructor(
    message: string = 'Authentication failed',
    options?: { cause?: Error; context?: Record<string, unknown> }
  ) {
    super(message, 'AUTH_FAILED', options);
    this.name = 'AuthenticationError';
  }
}

/**
 * Authorization error (authenticated but not allowed)
 */
export class AuthorizationError extends UCMCPError {
  readonly requiredPermission?: string;

  constructor(
    message: string = 'Not authorized',
    options?: { requiredPermission?: string; cause?: Error; context?: Record<string, unknown> }
  ) {
    super(message, 'NOT_AUTHORIZED', {
      cause: options?.cause,
      context: { ...options?.context, requiredPermission: options?.requiredPermission },
    });
    this.name = 'AuthorizationError';
    this.requiredPermission = options?.requiredPermission;
  }
}

/**
 * Validation error for invalid inputs
 */
export class ValidationError extends UCMCPError {
  readonly field?: string;
  readonly value?: unknown;
  readonly constraints?: string[];

  constructor(
    message: string,
    options?: {
      field?: string;
      value?: unknown;
      constraints?: string[];
      cause?: Error;
      context?: Record<string, unknown>;
    }
  ) {
    super(message, 'VALIDATION_ERROR', {
      cause: options?.cause,
      context: {
        field: options?.field,
        value: options?.value,
        constraints: options?.constraints,
        ...options?.context,
      },
    });
    this.name = 'ValidationError';
    this.field = options?.field;
    this.value = options?.value;
    this.constraints = options?.constraints;
  }
}

/**
 * Network error (connection issues)
 */
export class NetworkError extends UCMCPError {
  readonly host?: string;
  readonly port?: number;

  constructor(
    message: string = 'Network error',
    options?: { host?: string; port?: number; cause?: Error; context?: Record<string, unknown> }
  ) {
    super(message, 'NETWORK_ERROR', {
      cause: options?.cause,
      context: { host: options?.host, port: options?.port, ...options?.context },
    });
    this.name = 'NetworkError';
    this.host = options?.host;
    this.port = options?.port;
  }
}

/**
 * Configuration error
 */
export class ConfigurationError extends UCMCPError {
  readonly configKey?: string;

  constructor(
    message: string,
    options?: { configKey?: string; cause?: Error; context?: Record<string, unknown> }
  ) {
    super(message, 'CONFIG_ERROR', {
      cause: options?.cause,
      context: { configKey: options?.configKey, ...options?.context },
    });
    this.name = 'ConfigurationError';
    this.configKey = options?.configKey;
  }
}

/**
 * Blockchain/transaction error
 */
export class BlockchainError extends UCMCPError {
  readonly chainId?: number;
  readonly txHash?: string;

  constructor(
    message: string,
    options?: {
      code?: string;
      chainId?: number;
      txHash?: string;
      cause?: Error;
      context?: Record<string, unknown>;
    }
  ) {
    super(message, options?.code ?? 'BLOCKCHAIN_ERROR', {
      cause: options?.cause,
      context: { chainId: options?.chainId, txHash: options?.txHash, ...options?.context },
    });
    this.name = 'BlockchainError';
    this.chainId = options?.chainId;
    this.txHash = options?.txHash;
  }
}

/**
 * Agent execution error
 */
export class AgentError extends UCMCPError {
  readonly agentId?: string;
  readonly action?: string;

  constructor(
    message: string,
    options?: {
      code?: string;
      agentId?: string;
      action?: string;
      cause?: Error;
      context?: Record<string, unknown>;
    }
  ) {
    super(message, options?.code ?? 'AGENT_ERROR', {
      cause: options?.cause,
      context: { agentId: options?.agentId, action: options?.action, ...options?.context },
    });
    this.name = 'AgentError';
    this.agentId = options?.agentId;
    this.action = options?.action;
  }
}

/**
 * Guardrail violation error
 */
export class GuardrailError extends UCMCPError {
  readonly guardrail: string;
  readonly threshold?: unknown;
  readonly actual?: unknown;

  constructor(
    message: string,
    options: {
      guardrail: string;
      threshold?: unknown;
      actual?: unknown;
      context?: Record<string, unknown>;
    }
  ) {
    super(message, 'GUARDRAIL_VIOLATION', {
      context: {
        guardrail: options.guardrail,
        threshold: options.threshold,
        actual: options.actual,
        ...options.context,
      },
    });
    this.name = 'GuardrailError';
    this.guardrail = options.guardrail;
    this.threshold = options.threshold;
    this.actual = options.actual;
  }
}

// ============================================================================
// Error Handling Utilities
// ============================================================================

/**
 * Wrap an async function with standardized error handling
 */
export async function withErrorHandling<T>(
  fn: () => Promise<T>,
  options?: {
    context?: Record<string, unknown>;
    errorMapper?: (error: unknown) => UCMCPError;
  }
): Promise<T> {
  try {
    return await fn();
  } catch (error) {
    if (error instanceof UCMCPError) {
      if (options?.context) {
        error.context && Object.assign(error.context, options.context);
      }
      throw error;
    }

    if (options?.errorMapper) {
      throw options.errorMapper(error);
    }

    const originalError = error instanceof Error ? error : new Error(String(error));
    throw new UCMCPError(originalError.message, 'UNKNOWN_ERROR', {
      cause: originalError,
      context: options?.context,
    });
  }
}

/**
 * Check if an error is of a specific type
 */
export function isErrorCode(error: unknown, code: string): error is UCMCPError {
  return error instanceof UCMCPError && error.code === code;
}

/**
 * Check if an error is retryable
 */
export function isRetryableError(error: unknown): boolean {
  if (error instanceof RateLimitError) return true;
  if (error instanceof TimeoutError) return true;
  if (error instanceof NetworkError) return true;
  if (error instanceof ApiError) {
    const retryableCodes = [408, 429, 500, 502, 503, 504];
    return error.statusCode !== undefined && retryableCodes.includes(error.statusCode);
  }
  return false;
}

/**
 * Create error from HTTP response
 */
export function createErrorFromResponse(
  statusCode: number,
  body?: unknown,
  endpoint?: string
): UCMCPError {
  if (statusCode === 401) {
    return new AuthenticationError('Authentication required', {
      context: { endpoint, response: body },
    });
  }
  if (statusCode === 403) {
    return new AuthorizationError('Access denied', {
      context: { endpoint, response: body },
    });
  }
  if (statusCode === 429) {
    const retryAfter = typeof body === 'object' && body 
      ? (body as { retryAfter?: number }).retryAfter 
      : undefined;
    return new RateLimitError('Rate limit exceeded', {
      retryAfter,
      context: { endpoint, response: body },
    });
  }
  return ApiError.fromResponse(statusCode, body, endpoint);
}

/**
 * Safely extract error message from unknown error
 */
export function getErrorMessage(error: unknown): string {
  if (error instanceof Error) {
    return error.message;
  }
  if (typeof error === 'string') {
    return error;
  }
  if (typeof error === 'object' && error !== null && 'message' in error) {
    return String((error as { message: unknown }).message);
  }
  return 'Unknown error';
}

/**
 * Convert any error to UCMCPError
 */
export function toUCMCPError(error: unknown, defaultCode: string = 'UNKNOWN_ERROR'): UCMCPError {
  if (error instanceof UCMCPError) {
    return error;
  }
  
  const originalError = error instanceof Error ? error : new Error(getErrorMessage(error));
  return new UCMCPError(originalError.message, defaultCode, { cause: originalError });
}
