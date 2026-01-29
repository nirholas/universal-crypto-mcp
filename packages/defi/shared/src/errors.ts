/**
 * DeFi error handling utilities
 * 
 * Parse and handle common DeFi protocol errors.
 */

/**
 * Known DeFi error types
 */
export enum DeFiErrorType {
  INSUFFICIENT_BALANCE = "INSUFFICIENT_BALANCE",
  INSUFFICIENT_ALLOWANCE = "INSUFFICIENT_ALLOWANCE",
  SLIPPAGE_EXCEEDED = "SLIPPAGE_EXCEEDED",
  DEADLINE_EXCEEDED = "DEADLINE_EXCEEDED",
  INSUFFICIENT_LIQUIDITY = "INSUFFICIENT_LIQUIDITY",
  PRICE_IMPACT_TOO_HIGH = "PRICE_IMPACT_TOO_HIGH",
  INVALID_PATH = "INVALID_PATH",
  PAUSED = "PAUSED",
  REVERTED = "REVERTED",
  GAS_LIMIT_EXCEEDED = "GAS_LIMIT_EXCEEDED",
  NONCE_TOO_LOW = "NONCE_TOO_LOW",
  REPLACEMENT_UNDERPRICED = "REPLACEMENT_UNDERPRICED",
  UNKNOWN = "UNKNOWN",
}

/**
 * Parsed DeFi error
 */
export interface DeFiError {
  type: DeFiErrorType;
  message: string;
  originalError: Error;
  isRetryable: boolean;
  suggestedAction?: string;
}

/**
 * Parse error from transaction revert
 */
export function parseDeFiError(error: any): DeFiError {
  const errorMessage = error.message || error.toString();
  const lowerMessage = errorMessage.toLowerCase();

  // Insufficient balance
  if (
    lowerMessage.includes("insufficient balance") ||
    lowerMessage.includes("transfer amount exceeds balance")
  ) {
    return {
      type: DeFiErrorType.INSUFFICIENT_BALANCE,
      message: "Insufficient token balance for transaction",
      originalError: error,
      isRetryable: false,
      suggestedAction: "Check your token balance and reduce the amount",
    };
  }

  // Insufficient allowance
  if (
    lowerMessage.includes("insufficient allowance") ||
    lowerMessage.includes("transfer amount exceeds allowance")
  ) {
    return {
      type: DeFiErrorType.INSUFFICIENT_ALLOWANCE,
      message: "Token approval required",
      originalError: error,
      isRetryable: false,
      suggestedAction: "Approve the contract to spend your tokens",
    };
  }

  // Slippage exceeded
  if (
    lowerMessage.includes("too little received") ||
    lowerMessage.includes("excessive slippage") ||
    lowerMessage.includes("min return") ||
    lowerMessage.includes("output amount")
  ) {
    return {
      type: DeFiErrorType.SLIPPAGE_EXCEEDED,
      message: "Transaction slippage tolerance exceeded",
      originalError: error,
      isRetryable: true,
      suggestedAction: "Increase slippage tolerance or try again with better price",
    };
  }

  // Deadline exceeded
  if (
    lowerMessage.includes("expired") ||
    lowerMessage.includes("deadline")
  ) {
    return {
      type: DeFiErrorType.DEADLINE_EXCEEDED,
      message: "Transaction deadline exceeded",
      originalError: error,
      isRetryable: true,
      suggestedAction: "Retry the transaction with a longer deadline",
    };
  }

  // Insufficient liquidity
  if (
    lowerMessage.includes("insufficient liquidity") ||
    lowerMessage.includes("k")
  ) {
    return {
      type: DeFiErrorType.INSUFFICIENT_LIQUIDITY,
      message: "Insufficient liquidity in pool",
      originalError: error,
      isRetryable: false,
      suggestedAction: "Reduce trade size or use a different pool",
    };
  }

  // Paused
  if (lowerMessage.includes("paused")) {
    return {
      type: DeFiErrorType.PAUSED,
      message: "Protocol is currently paused",
      originalError: error,
      isRetryable: true,
      suggestedAction: "Wait for protocol to resume operations",
    };
  }

  // Gas limit
  if (
    lowerMessage.includes("out of gas") ||
    lowerMessage.includes("gas limit")
  ) {
    return {
      type: DeFiErrorType.GAS_LIMIT_EXCEEDED,
      message: "Transaction ran out of gas",
      originalError: error,
      isRetryable: true,
      suggestedAction: "Increase gas limit for the transaction",
    };
  }

  // Nonce issues
  if (
    lowerMessage.includes("nonce too low") ||
    lowerMessage.includes("already known")
  ) {
    return {
      type: DeFiErrorType.NONCE_TOO_LOW,
      message: "Transaction nonce conflict",
      originalError: error,
      isRetryable: true,
      suggestedAction: "Wait for pending transactions to complete",
    };
  }

  // Replacement underpriced
  if (lowerMessage.includes("replacement underpriced")) {
    return {
      type: DeFiErrorType.REPLACEMENT_UNDERPRICED,
      message: "Gas price too low to replace pending transaction",
      originalError: error,
      isRetryable: true,
      suggestedAction: "Increase gas price by at least 10%",
    };
  }

  // Generic revert
  if (lowerMessage.includes("revert")) {
    return {
      type: DeFiErrorType.REVERTED,
      message: errorMessage,
      originalError: error,
      isRetryable: false,
      suggestedAction: "Check transaction parameters and try again",
    };
  }

  // Unknown error
  return {
    type: DeFiErrorType.UNKNOWN,
    message: errorMessage,
    originalError: error,
    isRetryable: false,
    suggestedAction: "Review error details and consult documentation",
  };
}

/**
 * Retry transaction with exponential backoff
 */
export async function retryWithBackoff<T>(
  operation: () => Promise<T>,
  maxRetries: number = 3,
  baseDelayMs: number = 1000,
  shouldRetry?: (error: any) => boolean
): Promise<T> {
  let lastError: any;

  for (let attempt = 0; attempt <= maxRetries; attempt++) {
    try {
      return await operation();
    } catch (error: any) {
      lastError = error;

      const defiError = parseDeFiError(error);
      
      // Don't retry if error is not retryable
      if (!defiError.isRetryable) {
        throw error;
      }

      // Check custom retry condition
      if (shouldRetry && !shouldRetry(error)) {
        throw error;
      }

      // Don't delay on last attempt
      if (attempt < maxRetries) {
        const delay = baseDelayMs * Math.pow(2, attempt);
        await new Promise(resolve => setTimeout(resolve, delay));
      }
    }
  }

  throw lastError;
}

/**
 * Execute operation with timeout
 */
export async function withTimeout<T>(
  operation: Promise<T>,
  timeoutMs: number,
  errorMessage: string = "Operation timed out"
): Promise<T> {
  return Promise.race([
    operation,
    new Promise<never>((_, reject) =>
      setTimeout(() => reject(new Error(errorMessage)), timeoutMs)
    ),
  ]);
}

/**
 * Handle errors with fallback
 */
export async function withFallback<T>(
  primary: () => Promise<T>,
  fallback: () => Promise<T>
): Promise<T> {
  try {
    return await primary();
  } catch (error) {
    const defiError = parseDeFiError(error);
    console.warn(`Primary operation failed: ${defiError.message}. Trying fallback...`);
    return await fallback();
  }
}

/**
 * Log error with context
 */
export function logDeFiError(
  error: DeFiError,
  context: Record<string, any>
): void {
  console.error("DeFi Error:", {
    type: error.type,
    message: error.message,
    isRetryable: error.isRetryable,
    suggestedAction: error.suggestedAction,
    context,
  });
}
