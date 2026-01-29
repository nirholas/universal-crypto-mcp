/**
 * Custom error classes for better error handling
 * @author nich
 * @github github.com/nirholas
 * @license Apache-2.0
 */

/**
 * Base error class for MCP errors
 */
export class McpError extends Error {
  public readonly code: string
  public readonly context?: Record<string, unknown>

  constructor(
    message: string,
    code: string,
    context?: Record<string, unknown>
  ) {
    super(message)
    this.name = "McpError"
    this.code = code
    this.context = context
    Error.captureStackTrace?.(this, this.constructor)
  }

  toJSON() {
    return {
      name: this.name,
      message: this.message,
      code: this.code,
      context: this.context
    }
  }
}

/**
 * Network-related errors
 */
export class NetworkError extends McpError {
  constructor(message: string, context?: Record<string, unknown>) {
    super(message, "NETWORK_ERROR", context)
    this.name = "NetworkError"
  }
}

/**
 * Validation errors
 */
export class ValidationError extends McpError {
  constructor(message: string, context?: Record<string, unknown>) {
    super(message, "VALIDATION_ERROR", context)
    this.name = "ValidationError"
  }
}

/**
 * Authentication/authorization errors
 */
export class AuthError extends McpError {
  constructor(message: string, context?: Record<string, unknown>) {
    super(message, "AUTH_ERROR", context)
    this.name = "AuthError"
  }
}

/**
 * Rate limiting errors
 */
export class RateLimitError extends McpError {
  public readonly retryAfter?: number

  constructor(
    message: string,
    retryAfter?: number,
    context?: Record<string, unknown>
  ) {
    super(message, "RATE_LIMIT_ERROR", context)
    this.name = "RateLimitError"
    this.retryAfter = retryAfter
  }
}

/**
 * Contract interaction errors
 */
export class ContractError extends McpError {
  constructor(message: string, context?: Record<string, unknown>) {
    super(message, "CONTRACT_ERROR", context)
    this.name = "ContractError"
  }
}

/**
 * Transaction errors
 */
export class TransactionError extends McpError {
  public readonly txHash?: string

  constructor(
    message: string,
    txHash?: string,
    context?: Record<string, unknown>
  ) {
    super(message, "TRANSACTION_ERROR", context)
    this.name = "TransactionError"
    this.txHash = txHash
  }
}

/**
 * Insufficient funds errors
 */
export class InsufficientFundsError extends McpError {
  public readonly required: string
  public readonly available: string

  constructor(
    required: string,
    available: string,
    context?: Record<string, unknown>
  ) {
    super(
      `Insufficient funds: required ${required}, available ${available}`,
      "INSUFFICIENT_FUNDS",
      context
    )
    this.name = "InsufficientFundsError"
    this.required = required
    this.available = available
  }
}

/**
 * Chain not supported errors
 */
export class ChainNotSupportedError extends McpError {
  public readonly chainId: number

  constructor(chainId: number, context?: Record<string, unknown>) {
    super(`Chain ${chainId} is not supported`, "CHAIN_NOT_SUPPORTED", context)
    this.name = "ChainNotSupportedError"
    this.chainId = chainId
  }
}

/**
 * Helper to extract error message from unknown error
 */
export function getErrorMessage(error: unknown): string {
  if (error instanceof Error) {
    return error.message
  }
  if (typeof error === "string") {
    return error
  }
  if (error && typeof error === "object" && "message" in error) {
    return String((error as { message: unknown }).message)
  }
  return "An unknown error occurred"
}

/**
 * Helper to wrap unknown errors in McpError
 */
export function wrapError(
  error: unknown,
  defaultMessage: string
): McpError {
  if (error instanceof McpError) {
    return error
  }
  
  const message = getErrorMessage(error)
  return new McpError(
    message || defaultMessage,
    "UNKNOWN_ERROR",
    { originalError: error }
  )
}

/**
 * Retry configuration
 */
export interface RetryConfig {
  maxRetries: number
  baseDelayMs: number
  maxDelayMs: number
  shouldRetry?: (error: unknown, attempt: number) => boolean
}

const DEFAULT_RETRY_CONFIG: RetryConfig = {
  maxRetries: 3,
  baseDelayMs: 1000,
  maxDelayMs: 10000,
  shouldRetry: (error) => {
    // Retry on network errors and rate limits
    if (error instanceof NetworkError) return true
    if (error instanceof RateLimitError) return true
    return false
  }
}

/**
 * Retry a function with exponential backoff
 */
export async function withRetry<T>(
  fn: () => Promise<T>,
  config: Partial<RetryConfig> = {}
): Promise<T> {
  const { maxRetries, baseDelayMs, maxDelayMs, shouldRetry } = {
    ...DEFAULT_RETRY_CONFIG,
    ...config
  }

  let lastError: unknown

  for (let attempt = 0; attempt <= maxRetries; attempt++) {
    try {
      return await fn()
    } catch (error) {
      lastError = error

      if (attempt === maxRetries) {
        break
      }

      if (shouldRetry && !shouldRetry(error, attempt)) {
        break
      }

      // Exponential backoff with jitter
      const delay = Math.min(
        baseDelayMs * Math.pow(2, attempt) + Math.random() * 1000,
        maxDelayMs
      )

      await new Promise((resolve) => setTimeout(resolve, delay))
    }
  }

  throw lastError
}

// =============================================================================
// X402 Payment Error Classes
// =============================================================================

/**
 * Base error class for x402 payment errors
 */
export class X402Error extends McpError {
  public readonly statusCode: number
  public readonly details?: Record<string, unknown>

  constructor(
    message: string,
    code: string,
    statusCode: number = 500,
    details?: Record<string, unknown>
  ) {
    super(message, code, details)
    this.name = "X402Error"
    this.statusCode = statusCode
    this.details = details
  }

  toJSON() {
    return {
      name: this.name,
      message: this.message,
      code: this.code,
      statusCode: this.statusCode,
      details: this.details
    }
  }
}

/**
 * Payment required error (HTTP 402)
 */
export class PaymentRequiredError extends X402Error {
  public readonly paymentDetails: {
    price: string
    currency: string
    payTo: string
    network: string
  }

  constructor(
    message: string = "Payment required",
    paymentDetails: {
      price: string
      currency: string
      payTo: string
      network: string
    },
    details?: Record<string, unknown>
  ) {
    super(message, "PAYMENT_REQUIRED", 402, details)
    this.name = "PaymentRequiredError"
    this.paymentDetails = paymentDetails
  }

  toJSON() {
    return {
      ...super.toJSON(),
      paymentDetails: this.paymentDetails
    }
  }
}

/**
 * Invalid payment error
 */
export class InvalidPaymentError extends X402Error {
  constructor(message: string = "Invalid payment", details?: Record<string, unknown>) {
    super(message, "INVALID_PAYMENT", 400, details)
    this.name = "InvalidPaymentError"
  }
}

/**
 * Payment expired error
 */
export class PaymentExpiredError extends X402Error {
  public readonly expiredAt: Date

  constructor(
    message: string = "Payment has expired",
    expiredAt: Date = new Date(),
    details?: Record<string, unknown>
  ) {
    super(message, "PAYMENT_EXPIRED", 400, details)
    this.name = "PaymentExpiredError"
    this.expiredAt = expiredAt
  }
}

/**
 * Payment verification failed error
 */
export class PaymentVerificationError extends X402Error {
  public readonly txHash?: string

  constructor(
    message: string = "Payment verification failed",
    txHash?: string,
    details?: Record<string, unknown>
  ) {
    super(message, "PAYMENT_VERIFICATION_FAILED", 400, { ...details, txHash })
    this.name = "PaymentVerificationError"
    this.txHash = txHash
  }
}

/**
 * Deployment error
 */
export class DeploymentError extends X402Error {
  public readonly provider?: string
  public readonly stage?: string

  constructor(
    message: string,
    provider?: string,
    stage?: string,
    details?: Record<string, unknown>
  ) {
    super(message, "DEPLOYMENT_ERROR", 500, { ...details, provider, stage })
    this.name = "DeploymentError"
    this.provider = provider
    this.stage = stage
  }
}

/**
 * Configuration error
 */
export class ConfigurationError extends X402Error {
  public readonly configKey?: string

  constructor(
    message: string,
    configKey?: string,
    details?: Record<string, unknown>
  ) {
    super(message, "CONFIGURATION_ERROR", 500, { ...details, configKey })
    this.name = "ConfigurationError"
    this.configKey = configKey
  }
}

/**
 * Service unavailable error
 */
export class ServiceUnavailableError extends X402Error {
  public readonly retryAfter?: number

  constructor(
    message: string = "Service temporarily unavailable",
    retryAfter?: number,
    details?: Record<string, unknown>
  ) {
    super(message, "SERVICE_UNAVAILABLE", 503, details)
    this.name = "ServiceUnavailableError"
    this.retryAfter = retryAfter
  }
}

// =============================================================================
// Express Error Handler Middleware
// =============================================================================

/**
 * Express error handler middleware for X402 and MCP errors
 */
export function errorHandler(
  err: Error,
  req: { method?: string; path?: string; url?: string },
  res: {
    status: (code: number) => { json: (body: unknown) => void }
    headersSent?: boolean
  },
  next: (err?: Error) => void
): void {
  // If headers already sent, delegate to default handler
  if (res.headersSent) {
    return next(err)
  }

  // Handle X402 errors
  if (err instanceof X402Error) {
    res.status(err.statusCode).json({
      error: err.message,
      code: err.code,
      details: err.details,
      ...(err instanceof PaymentRequiredError && {
        paymentDetails: err.paymentDetails
      })
    })
    return
  }

  // Handle MCP errors
  if (err instanceof McpError) {
    const statusCode = err instanceof RateLimitError ? 429 : 400
    res.status(statusCode).json({
      error: err.message,
      code: err.code,
      context: err.context
    })
    return
  }

  // Log unexpected errors
  console.error("Unhandled error:", err)

  // Generic error response
  res.status(500).json({
    error: "Internal server error",
    code: "INTERNAL_ERROR",
    message: process.env.NODE_ENV === "development" ? err.message : undefined
  })
}

/**
 * Async handler wrapper for Express routes
 */
export function asyncHandler<T>(
  fn: (req: T, res: unknown, next: (err?: Error) => void) => Promise<void>
): (req: T, res: unknown, next: (err?: Error) => void) => void {
  return (req, res, next) => {
    Promise.resolve(fn(req, res, next)).catch(next)
  }
}

/**
 * Create a standardized error response
 */
export function createErrorResponse(
  error: Error | X402Error | McpError,
  includeStack = false
): {
  success: false
  error: {
    message: string
    code: string
    details?: Record<string, unknown>
    stack?: string
  }
} {
  const response: ReturnType<typeof createErrorResponse> = {
    success: false,
    error: {
      message: error.message,
      code: error instanceof McpError ? error.code : "UNKNOWN_ERROR"
    }
  }

  if (error instanceof X402Error && error.details) {
    response.error.details = error.details
  }

  if (includeStack && error.stack) {
    response.error.stack = error.stack
  }

  return response
}
