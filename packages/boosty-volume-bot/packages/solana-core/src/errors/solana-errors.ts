/**
 * Enhanced Error Types for Solana Operations
 * Specific error classes for better error handling
 */

export enum SolanaErrorCode {
  // Connection errors
  CONNECTION_FAILED = 'CONNECTION_FAILED',
  RPC_ERROR = 'RPC_ERROR',
  RATE_LIMITED = 'RATE_LIMITED',
  TIMEOUT = 'TIMEOUT',
  
  // Transaction errors
  TRANSACTION_FAILED = 'TRANSACTION_FAILED',
  SIMULATION_FAILED = 'SIMULATION_FAILED',
  INSUFFICIENT_FUNDS = 'INSUFFICIENT_FUNDS',
  BLOCKHASH_EXPIRED = 'BLOCKHASH_EXPIRED',
  SIGNATURE_VERIFICATION_FAILED = 'SIGNATURE_VERIFICATION_FAILED',
  
  // Account errors
  ACCOUNT_NOT_FOUND = 'ACCOUNT_NOT_FOUND',
  INVALID_ACCOUNT_DATA = 'INVALID_ACCOUNT_DATA',
  ACCOUNT_NOT_INITIALIZED = 'ACCOUNT_NOT_INITIALIZED',
  
  // Token errors
  TOKEN_NOT_FOUND = 'TOKEN_NOT_FOUND',
  INSUFFICIENT_TOKEN_BALANCE = 'INSUFFICIENT_TOKEN_BALANCE',
  INVALID_TOKEN_MINT = 'INVALID_TOKEN_MINT',
  TOKEN_ACCOUNT_NOT_FOUND = 'TOKEN_ACCOUNT_NOT_FOUND',
  
  // Program errors
  PROGRAM_ERROR = 'PROGRAM_ERROR',
  INVALID_INSTRUCTION = 'INVALID_INSTRUCTION',
  
  // Validation errors
  INVALID_ADDRESS = 'INVALID_ADDRESS',
  INVALID_AMOUNT = 'INVALID_AMOUNT',
  INVALID_PARAMETER = 'INVALID_PARAMETER',
  
  // External service errors
  ORACLE_ERROR = 'ORACLE_ERROR',
  DEX_ERROR = 'DEX_ERROR',
  API_ERROR = 'API_ERROR',
}

export interface ErrorContext {
  address?: string;
  transactionSignature?: string;
  mint?: string;
  programId?: string;
  slot?: number;
  logs?: string[];
  [key: string]: unknown;
}

/**
 * Base Solana error class
 */
export class SolanaError extends Error {
  readonly code: SolanaErrorCode;
  readonly context?: ErrorContext;
  readonly cause?: Error;

  constructor(
    code: SolanaErrorCode,
    message: string,
    context?: ErrorContext,
    cause?: Error
  ) {
    super(message);
    this.name = 'SolanaError';
    this.code = code;
    this.context = context;
    this.cause = cause;
    
    // Capture stack trace
    Error.captureStackTrace?.(this, this.constructor);
  }

  toJSON(): Record<string, unknown> {
    return {
      name: this.name,
      code: this.code,
      message: this.message,
      context: this.context,
      cause: this.cause?.message,
    };
  }
}

/**
 * Connection-related errors
 */
export class ConnectionError extends SolanaError {
  constructor(message: string, context?: ErrorContext, cause?: Error) {
    super(SolanaErrorCode.CONNECTION_FAILED, message, context, cause);
    this.name = 'ConnectionError';
  }
}

export class RpcError extends SolanaError {
  readonly rpcErrorCode?: number;
  
  constructor(message: string, rpcErrorCode?: number, context?: ErrorContext, cause?: Error) {
    super(SolanaErrorCode.RPC_ERROR, message, context, cause);
    this.name = 'RpcError';
    this.rpcErrorCode = rpcErrorCode;
  }
}

export class RateLimitError extends SolanaError {
  readonly retryAfter?: number;
  
  constructor(message: string, retryAfter?: number, context?: ErrorContext) {
    super(SolanaErrorCode.RATE_LIMITED, message, context);
    this.name = 'RateLimitError';
    this.retryAfter = retryAfter;
  }
}

export class TimeoutError extends SolanaError {
  readonly timeoutMs?: number;
  
  constructor(message: string, timeoutMs?: number, context?: ErrorContext) {
    super(SolanaErrorCode.TIMEOUT, message, context);
    this.name = 'TimeoutError';
    this.timeoutMs = timeoutMs;
  }
}

/**
 * Transaction-related errors
 */
export class TransactionError extends SolanaError {
  readonly logs?: string[];
  
  constructor(
    code: SolanaErrorCode,
    message: string,
    context?: ErrorContext,
    cause?: Error
  ) {
    super(code, message, context, cause);
    this.name = 'TransactionError';
    this.logs = context?.logs as string[];
  }
}

export class InsufficientFundsError extends TransactionError {
  readonly required?: number;
  readonly available?: number;
  
  constructor(required?: number, available?: number, context?: ErrorContext) {
    const message = required && available
      ? `Insufficient funds: required ${required} lamports, available ${available} lamports`
      : 'Insufficient funds for transaction';
    super(SolanaErrorCode.INSUFFICIENT_FUNDS, message, context);
    this.name = 'InsufficientFundsError';
    this.required = required;
    this.available = available;
  }
}

export class BlockhashExpiredError extends TransactionError {
  constructor(blockhash: string, context?: ErrorContext) {
    super(
      SolanaErrorCode.BLOCKHASH_EXPIRED,
      `Blockhash expired: ${blockhash}`,
      context
    );
    this.name = 'BlockhashExpiredError';
  }
}

export class SimulationError extends TransactionError {
  constructor(message: string, logs?: string[], context?: ErrorContext) {
    super(
      SolanaErrorCode.SIMULATION_FAILED,
      message,
      { ...context, logs },
    );
    this.name = 'SimulationError';
  }
}

/**
 * Account-related errors
 */
export class AccountError extends SolanaError {
  constructor(
    code: SolanaErrorCode,
    message: string,
    context?: ErrorContext,
    cause?: Error
  ) {
    super(code, message, context, cause);
    this.name = 'AccountError';
  }
}

export class AccountNotFoundError extends AccountError {
  constructor(address: string, context?: ErrorContext) {
    super(
      SolanaErrorCode.ACCOUNT_NOT_FOUND,
      `Account not found: ${address}`,
      { ...context, address }
    );
    this.name = 'AccountNotFoundError';
  }
}

/**
 * Token-related errors
 */
export class TokenError extends SolanaError {
  constructor(
    code: SolanaErrorCode,
    message: string,
    context?: ErrorContext,
    cause?: Error
  ) {
    super(code, message, context, cause);
    this.name = 'TokenError';
  }
}

export class TokenNotFoundError extends TokenError {
  constructor(mint: string, context?: ErrorContext) {
    super(
      SolanaErrorCode.TOKEN_NOT_FOUND,
      `Token not found: ${mint}`,
      { ...context, mint }
    );
    this.name = 'TokenNotFoundError';
  }
}

export class InsufficientTokenBalanceError extends TokenError {
  readonly required?: string;
  readonly available?: string;
  
  constructor(mint: string, required?: string, available?: string, context?: ErrorContext) {
    const message = required && available
      ? `Insufficient token balance for ${mint}: required ${required}, available ${available}`
      : `Insufficient token balance for ${mint}`;
    super(SolanaErrorCode.INSUFFICIENT_TOKEN_BALANCE, message, { ...context, mint });
    this.name = 'InsufficientTokenBalanceError';
    this.required = required;
    this.available = available;
  }
}

/**
 * Validation errors
 */
export class ValidationError extends SolanaError {
  constructor(
    code: SolanaErrorCode,
    message: string,
    context?: ErrorContext
  ) {
    super(code, message, context);
    this.name = 'ValidationError';
  }
}

export class InvalidAddressError extends ValidationError {
  constructor(address: string, context?: ErrorContext) {
    super(
      SolanaErrorCode.INVALID_ADDRESS,
      `Invalid Solana address: ${address}`,
      { ...context, address }
    );
    this.name = 'InvalidAddressError';
  }
}

export class InvalidAmountError extends ValidationError {
  constructor(amount: string | number, reason?: string, context?: ErrorContext) {
    const message = reason
      ? `Invalid amount ${amount}: ${reason}`
      : `Invalid amount: ${amount}`;
    super(SolanaErrorCode.INVALID_AMOUNT, message, context);
    this.name = 'InvalidAmountError';
  }
}

/**
 * External service errors
 */
export class OracleError extends SolanaError {
  readonly oracleType?: 'pyth' | 'switchboard';
  
  constructor(message: string, oracleType?: 'pyth' | 'switchboard', context?: ErrorContext, cause?: Error) {
    super(SolanaErrorCode.ORACLE_ERROR, message, context, cause);
    this.name = 'OracleError';
    this.oracleType = oracleType;
  }
}

export class DexError extends SolanaError {
  readonly dex?: string;
  
  constructor(message: string, dex?: string, context?: ErrorContext, cause?: Error) {
    super(SolanaErrorCode.DEX_ERROR, message, context, cause);
    this.name = 'DexError';
    this.dex = dex;
  }
}

/**
 * Error utility functions
 */

export function isSolanaError(error: unknown): error is SolanaError {
  return error instanceof SolanaError;
}

export function isRetryableError(error: unknown): boolean {
  if (!isSolanaError(error)) {
    return false;
  }
  
  const retryableCodes: SolanaErrorCode[] = [
    SolanaErrorCode.CONNECTION_FAILED,
    SolanaErrorCode.RPC_ERROR,
    SolanaErrorCode.RATE_LIMITED,
    SolanaErrorCode.TIMEOUT,
    SolanaErrorCode.BLOCKHASH_EXPIRED,
  ];
  
  return retryableCodes.includes(error.code);
}

export function parseRpcError(error: unknown): SolanaError {
  if (isSolanaError(error)) {
    return error;
  }
  
  const errorMessage = error instanceof Error ? error.message : String(error);
  
  // Parse common RPC errors
  if (errorMessage.includes('429') || errorMessage.includes('rate limit')) {
    return new RateLimitError('RPC rate limit exceeded');
  }
  
  if (errorMessage.includes('timeout') || errorMessage.includes('ETIMEDOUT')) {
    return new TimeoutError('RPC request timed out');
  }
  
  if (errorMessage.includes('insufficient funds') || errorMessage.includes('0x1')) {
    return new InsufficientFundsError();
  }
  
  if (errorMessage.includes('blockhash not found') || errorMessage.includes('expired')) {
    return new BlockhashExpiredError('unknown');
  }
  
  if (errorMessage.includes('account not found') || errorMessage.includes('AccountNotFound')) {
    return new AccountNotFoundError('unknown');
  }
  
  return new SolanaError(
    SolanaErrorCode.RPC_ERROR,
    errorMessage,
    undefined,
    error instanceof Error ? error : undefined
  );
}

/**
 * Wrap async function with error handling
 */
export async function withErrorHandling<T>(
  fn: () => Promise<T>,
  _context?: ErrorContext
): Promise<T> {
  try {
    return await fn();
  } catch (error) {
    throw parseRpcError(error);
  }
}
