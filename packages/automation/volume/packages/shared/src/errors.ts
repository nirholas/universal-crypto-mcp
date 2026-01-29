/**
 * Base MCP error class
 */
export class MCPError extends Error {
  public readonly code: string;
  public readonly statusCode?: number;
  public readonly details?: Record<string, unknown>;

  constructor(
    message: string,
    code: string = 'MCP_ERROR',
    options?: {
      statusCode?: number;
      details?: Record<string, unknown>;
      cause?: Error;
    }
  ) {
    super(message, { cause: options?.cause });
    this.name = 'MCPError';
    this.code = code;
    this.statusCode = options?.statusCode;
    this.details = options?.details;

    // Maintains proper stack trace for where our error was thrown (only available on V8)
    if (Error.captureStackTrace) {
      Error.captureStackTrace(this, MCPError);
    }
  }

  toJSON(): Record<string, unknown> {
    return {
      name: this.name,
      message: this.message,
      code: this.code,
      statusCode: this.statusCode,
      details: this.details,
    };
  }
}

/**
 * Rate limit exceeded error
 */
export class RateLimitError extends MCPError {
  public readonly retryAfterMs?: number;

  constructor(
    message: string = 'Rate limit exceeded',
    options?: {
      retryAfterMs?: number;
      details?: Record<string, unknown>;
      cause?: Error;
    }
  ) {
    super(message, 'RATE_LIMIT_EXCEEDED', {
      statusCode: 429,
      details: options?.details,
      cause: options?.cause,
    });
    this.name = 'RateLimitError';
    this.retryAfterMs = options?.retryAfterMs;
  }

  toJSON(): Record<string, unknown> {
    return {
      ...super.toJSON(),
      retryAfterMs: this.retryAfterMs,
    };
  }
}

/**
 * API request error
 */
export class APIError extends MCPError {
  public readonly endpoint?: string;
  public readonly method?: string;

  constructor(
    message: string,
    options?: {
      statusCode?: number;
      endpoint?: string;
      method?: string;
      details?: Record<string, unknown>;
      cause?: Error;
    }
  ) {
    super(message, 'API_ERROR', {
      statusCode: options?.statusCode,
      details: options?.details,
      cause: options?.cause,
    });
    this.name = 'APIError';
    this.endpoint = options?.endpoint;
    this.method = options?.method;
  }

  toJSON(): Record<string, unknown> {
    return {
      ...super.toJSON(),
      endpoint: this.endpoint,
      method: this.method,
    };
  }
}

/**
 * Validation error
 */
export class ValidationError extends MCPError {
  public readonly field?: string;
  public readonly value?: unknown;

  constructor(
    message: string,
    options?: {
      field?: string;
      value?: unknown;
      details?: Record<string, unknown>;
      cause?: Error;
    }
  ) {
    super(message, 'VALIDATION_ERROR', {
      statusCode: 400,
      details: options?.details,
      cause: options?.cause,
    });
    this.name = 'ValidationError';
    this.field = options?.field;
    this.value = options?.value;
  }

  toJSON(): Record<string, unknown> {
    return {
      ...super.toJSON(),
      field: this.field,
      value: this.value,
    };
  }
}

/**
 * Network/connection error
 */
export class NetworkError extends MCPError {
  public readonly endpoint?: string;
  public readonly isTimeout: boolean;

  constructor(
    message: string,
    options?: {
      endpoint?: string;
      isTimeout?: boolean;
      details?: Record<string, unknown>;
      cause?: Error;
    }
  ) {
    super(message, 'NETWORK_ERROR', {
      statusCode: 503,
      details: options?.details,
      cause: options?.cause,
    });
    this.name = 'NetworkError';
    this.endpoint = options?.endpoint;
    this.isTimeout = options?.isTimeout ?? false;
  }

  toJSON(): Record<string, unknown> {
    return {
      ...super.toJSON(),
      endpoint: this.endpoint,
      isTimeout: this.isTimeout,
    };
  }
}

/**
 * Chain not supported error
 */
export class ChainNotSupportedError extends MCPError {
  public readonly chain: string;
  public readonly supportedChains: string[];

  constructor(chain: string, supportedChains: string[]) {
    super(`Chain "${chain}" is not supported`, 'CHAIN_NOT_SUPPORTED', {
      statusCode: 400,
      details: { chain, supportedChains },
    });
    this.name = 'ChainNotSupportedError';
    this.chain = chain;
    this.supportedChains = supportedChains;
  }

  toJSON(): Record<string, unknown> {
    return {
      ...super.toJSON(),
      chain: this.chain,
      supportedChains: this.supportedChains,
    };
  }
}

/**
 * Token not found error
 */
export class TokenNotFoundError extends MCPError {
  public readonly tokenAddress: string;
  public readonly chain: string;

  constructor(tokenAddress: string, chain: string) {
    super(`Token "${tokenAddress}" not found on ${chain}`, 'TOKEN_NOT_FOUND', {
      statusCode: 404,
      details: { tokenAddress, chain },
    });
    this.name = 'TokenNotFoundError';
    this.tokenAddress = tokenAddress;
    this.chain = chain;
  }

  toJSON(): Record<string, unknown> {
    return {
      ...super.toJSON(),
      tokenAddress: this.tokenAddress,
      chain: this.chain,
    };
  }
}

/**
 * Check if an error is an MCP error
 */
export function isMCPError(error: unknown): error is MCPError {
  return error instanceof MCPError;
}

/**
 * Wrap an unknown error into an MCPError
 */
export function wrapError(error: unknown, defaultMessage: string = 'An unexpected error occurred'): MCPError {
  if (error instanceof MCPError) {
    return error;
  }

  if (error instanceof Error) {
    return new MCPError(error.message || defaultMessage, 'UNKNOWN_ERROR', {
      cause: error,
    });
  }

  return new MCPError(
    typeof error === 'string' ? error : defaultMessage,
    'UNKNOWN_ERROR'
  );
}
