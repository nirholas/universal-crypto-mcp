/**
 * API Error Classes
 * Universal Crypto MCP - API Layer
 * 
 * @author nich
 * @license Apache-2.0
 */

import type { APIError, APIResponse } from './types';

// ============================================================================
// Error Codes
// ============================================================================

export const ErrorCodes = {
  // Client Errors (4xx)
  BAD_REQUEST: 'BAD_REQUEST',
  VALIDATION_ERROR: 'VALIDATION_ERROR',
  UNAUTHORIZED: 'UNAUTHORIZED',
  FORBIDDEN: 'FORBIDDEN',
  NOT_FOUND: 'NOT_FOUND',
  METHOD_NOT_ALLOWED: 'METHOD_NOT_ALLOWED',
  CONFLICT: 'CONFLICT',
  RATE_LIMITED: 'RATE_LIMITED',
  PAYLOAD_TOO_LARGE: 'PAYLOAD_TOO_LARGE',
  UNPROCESSABLE_ENTITY: 'UNPROCESSABLE_ENTITY',

  // Server Errors (5xx)
  INTERNAL_ERROR: 'INTERNAL_ERROR',
  NOT_IMPLEMENTED: 'NOT_IMPLEMENTED',
  SERVICE_UNAVAILABLE: 'SERVICE_UNAVAILABLE',
  GATEWAY_TIMEOUT: 'GATEWAY_TIMEOUT',

  // Business Logic Errors
  INSUFFICIENT_BALANCE: 'INSUFFICIENT_BALANCE',
  INSUFFICIENT_CREDITS: 'INSUFFICIENT_CREDITS',
  SUBSCRIPTION_REQUIRED: 'SUBSCRIPTION_REQUIRED',
  SUBSCRIPTION_EXPIRED: 'SUBSCRIPTION_EXPIRED',
  WALLET_NOT_CONNECTED: 'WALLET_NOT_CONNECTED',
  INVALID_CHAIN: 'INVALID_CHAIN',
  INVALID_ADDRESS: 'INVALID_ADDRESS',
  INVALID_TOKEN: 'INVALID_TOKEN',
  TOOL_NOT_FOUND: 'TOOL_NOT_FOUND',
  TOOL_EXECUTION_FAILED: 'TOOL_EXECUTION_FAILED',
  TOOL_TIMEOUT: 'TOOL_TIMEOUT',
  SERVICE_NOT_FOUND: 'SERVICE_NOT_FOUND',
  PROVIDER_NOT_FOUND: 'PROVIDER_NOT_FOUND',
  ALREADY_EXISTS: 'ALREADY_EXISTS',
  TRANSACTION_FAILED: 'TRANSACTION_FAILED',
  SIMULATION_FAILED: 'SIMULATION_FAILED',
} as const;

export type ErrorCode = typeof ErrorCodes[keyof typeof ErrorCodes];

// ============================================================================
// Error Messages
// ============================================================================

const ErrorMessages: Record<ErrorCode, string> = {
  // Client Errors
  BAD_REQUEST: 'The request was malformed or contained invalid data.',
  VALIDATION_ERROR: 'The request failed validation checks.',
  UNAUTHORIZED: 'Authentication is required to access this resource.',
  FORBIDDEN: 'You do not have permission to access this resource.',
  NOT_FOUND: 'The requested resource was not found.',
  METHOD_NOT_ALLOWED: 'The HTTP method is not allowed for this endpoint.',
  CONFLICT: 'The request conflicts with the current state of the resource.',
  RATE_LIMITED: 'Too many requests. Please try again later.',
  PAYLOAD_TOO_LARGE: 'The request payload exceeds the maximum allowed size.',
  UNPROCESSABLE_ENTITY: 'The request was well-formed but contained semantic errors.',

  // Server Errors
  INTERNAL_ERROR: 'An unexpected error occurred. Please try again later.',
  NOT_IMPLEMENTED: 'This feature is not yet implemented.',
  SERVICE_UNAVAILABLE: 'The service is temporarily unavailable.',
  GATEWAY_TIMEOUT: 'The request timed out. Please try again.',

  // Business Logic Errors
  INSUFFICIENT_BALANCE: 'Insufficient balance to complete this operation.',
  INSUFFICIENT_CREDITS: 'You do not have enough credits. Please purchase more.',
  SUBSCRIPTION_REQUIRED: 'A subscription is required to access this feature.',
  SUBSCRIPTION_EXPIRED: 'Your subscription has expired. Please renew.',
  WALLET_NOT_CONNECTED: 'Please connect your wallet to continue.',
  INVALID_CHAIN: 'The specified blockchain network is not supported.',
  INVALID_ADDRESS: 'The provided address is invalid.',
  INVALID_TOKEN: 'The specified token is not recognized.',
  TOOL_NOT_FOUND: 'The requested tool does not exist.',
  TOOL_EXECUTION_FAILED: 'The tool execution failed. Please try again.',
  TOOL_TIMEOUT: 'The tool execution timed out.',
  SERVICE_NOT_FOUND: 'The requested service was not found.',
  PROVIDER_NOT_FOUND: 'The provider was not found.',
  ALREADY_EXISTS: 'The resource already exists.',
  TRANSACTION_FAILED: 'The transaction failed.',
  SIMULATION_FAILED: 'Transaction simulation failed.',
};

// ============================================================================
// HTTP Status Codes
// ============================================================================

const ErrorStatusCodes: Record<ErrorCode, number> = {
  BAD_REQUEST: 400,
  VALIDATION_ERROR: 400,
  UNAUTHORIZED: 401,
  FORBIDDEN: 403,
  NOT_FOUND: 404,
  METHOD_NOT_ALLOWED: 405,
  CONFLICT: 409,
  RATE_LIMITED: 429,
  PAYLOAD_TOO_LARGE: 413,
  UNPROCESSABLE_ENTITY: 422,
  INTERNAL_ERROR: 500,
  NOT_IMPLEMENTED: 501,
  SERVICE_UNAVAILABLE: 503,
  GATEWAY_TIMEOUT: 504,
  INSUFFICIENT_BALANCE: 402,
  INSUFFICIENT_CREDITS: 402,
  SUBSCRIPTION_REQUIRED: 402,
  SUBSCRIPTION_EXPIRED: 402,
  WALLET_NOT_CONNECTED: 401,
  INVALID_CHAIN: 400,
  INVALID_ADDRESS: 400,
  INVALID_TOKEN: 400,
  TOOL_NOT_FOUND: 404,
  TOOL_EXECUTION_FAILED: 500,
  TOOL_TIMEOUT: 504,
  SERVICE_NOT_FOUND: 404,
  PROVIDER_NOT_FOUND: 404,
  ALREADY_EXISTS: 409,
  TRANSACTION_FAILED: 500,
  SIMULATION_FAILED: 400,
};

// ============================================================================
// Base API Error Class
// ============================================================================

export class APIException extends Error {
  public readonly code: ErrorCode;
  public readonly statusCode: number;
  public readonly details?: unknown;
  public readonly field?: string;
  public readonly path?: string;

  constructor(
    code: ErrorCode,
    message?: string,
    options?: {
      details?: unknown;
      field?: string;
      path?: string;
      cause?: Error;
    }
  ) {
    super(message || ErrorMessages[code]);
    this.name = 'APIException';
    this.code = code;
    this.statusCode = ErrorStatusCodes[code];
    this.details = options?.details;
    this.field = options?.field;
    this.path = options?.path;
    
    if (options?.cause) {
      this.cause = options.cause;
    }

    // Maintain proper stack trace
    Error.captureStackTrace(this, this.constructor);
  }

  toJSON(): APIError {
    return {
      code: this.code,
      message: this.message,
      details: this.details,
      field: this.field,
      path: this.path,
    };
  }

  toResponse(): APIResponse {
    return {
      success: false,
      error: this.toJSON(),
    };
  }
}

// ============================================================================
// Specific Error Classes
// ============================================================================

export class BadRequestError extends APIException {
  constructor(message?: string, details?: unknown) {
    super(ErrorCodes.BAD_REQUEST, message, { details });
    this.name = 'BadRequestError';
  }
}

export class ValidationError extends APIException {
  public readonly errors: APIError[];

  constructor(errors: Array<{ field: string; message: string; details?: unknown }>) {
    super(ErrorCodes.VALIDATION_ERROR, 'Validation failed');
    this.name = 'ValidationError';
    this.errors = errors.map((e) => ({
      code: ErrorCodes.VALIDATION_ERROR,
      message: e.message,
      field: e.field,
      details: e.details,
    }));
  }

  toResponse(): APIResponse {
    return {
      success: false,
      error: {
        code: this.code,
        message: this.message,
      },
      errors: this.errors,
    };
  }
}

export class UnauthorizedError extends APIException {
  constructor(message?: string) {
    super(ErrorCodes.UNAUTHORIZED, message);
    this.name = 'UnauthorizedError';
  }
}

export class ForbiddenError extends APIException {
  constructor(message?: string) {
    super(ErrorCodes.FORBIDDEN, message);
    this.name = 'ForbiddenError';
  }
}

export class NotFoundError extends APIException {
  constructor(resource: string, identifier?: string) {
    const message = identifier
      ? `${resource} with identifier '${identifier}' was not found.`
      : `${resource} was not found.`;
    super(ErrorCodes.NOT_FOUND, message);
    this.name = 'NotFoundError';
  }
}

export class RateLimitError extends APIException {
  public readonly retryAfter: number;
  public readonly limit: number;
  public readonly remaining: number;
  public readonly reset: number;

  constructor(options: {
    retryAfter: number;
    limit: number;
    remaining: number;
    reset: number;
  }) {
    super(ErrorCodes.RATE_LIMITED, `Rate limit exceeded. Try again in ${options.retryAfter} seconds.`);
    this.name = 'RateLimitError';
    this.retryAfter = options.retryAfter;
    this.limit = options.limit;
    this.remaining = options.remaining;
    this.reset = options.reset;
  }

  toResponse(): APIResponse {
    return {
      success: false,
      error: this.toJSON(),
      meta: {
        rateLimit: {
          limit: this.limit,
          remaining: this.remaining,
          reset: this.reset,
          retryAfter: this.retryAfter,
        },
      },
    };
  }
}

export class ToolExecutionError extends APIException {
  constructor(toolId: string, message?: string, details?: unknown) {
    super(
      ErrorCodes.TOOL_EXECUTION_FAILED,
      message || `Tool '${toolId}' execution failed.`,
      { details }
    );
    this.name = 'ToolExecutionError';
  }
}

export class ToolTimeoutError extends APIException {
  constructor(toolId: string, timeout: number) {
    super(
      ErrorCodes.TOOL_TIMEOUT,
      `Tool '${toolId}' execution timed out after ${timeout}ms.`
    );
    this.name = 'ToolTimeoutError';
  }
}

export class InsufficientCreditsError extends APIException {
  public readonly required: number;
  public readonly available: number;

  constructor(required: number, available: number) {
    super(
      ErrorCodes.INSUFFICIENT_CREDITS,
      `Insufficient credits. Required: ${required}, Available: ${available}`
    );
    this.name = 'InsufficientCreditsError';
    this.required = required;
    this.available = available;
  }
}

export class TransactionError extends APIException {
  public readonly txHash?: string;

  constructor(message: string, txHash?: string, details?: unknown) {
    super(ErrorCodes.TRANSACTION_FAILED, message, { details });
    this.name = 'TransactionError';
    this.txHash = txHash;
  }
}

// ============================================================================
// Error Handler Utility
// ============================================================================

export function handleError(error: unknown): APIResponse {
  // Already an API error
  if (error instanceof APIException) {
    return error.toResponse();
  }

  // Zod validation error
  if (error && typeof error === 'object' && 'issues' in error) {
    const zodError = error as { issues: Array<{ path: string[]; message: string }> };
    const validationError = new ValidationError(
      zodError.issues.map((issue) => ({
        field: issue.path.join('.'),
        message: issue.message,
      }))
    );
    return validationError.toResponse();
  }

  // Standard Error
  if (error instanceof Error) {
    console.error('[API Error]', error);
    return {
      success: false,
      error: {
        code: ErrorCodes.INTERNAL_ERROR,
        message: process.env.NODE_ENV === 'development'
          ? error.message
          : ErrorMessages.INTERNAL_ERROR,
      },
    };
  }

  // Unknown error
  console.error('[API Error] Unknown error type:', error);
  return {
    success: false,
    error: {
      code: ErrorCodes.INTERNAL_ERROR,
      message: ErrorMessages.INTERNAL_ERROR,
    },
  };
}

// ============================================================================
// Error Logging (Sentry Integration Placeholder)
// ============================================================================

export function logError(error: unknown, context?: Record<string, unknown>): void {
  // In production, this would send to Sentry
  console.error('[Error Log]', {
    error: error instanceof Error ? {
      name: error.name,
      message: error.message,
      stack: error.stack,
    } : error,
    context,
    timestamp: new Date().toISOString(),
  });

  // TODO: Integrate with Sentry
  // if (process.env.SENTRY_DSN) {
  //   Sentry.captureException(error, { extra: context });
  // }
}
