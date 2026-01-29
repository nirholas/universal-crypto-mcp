/**
 * Trading Engine Errors
 * 
 * Custom error types for different failure scenarios.
 */

/**
 * Base error for trading engine
 */
export class TradingEngineError extends Error {
  readonly code: string;
  readonly cause?: Error;

  constructor(message: string, code: string, cause?: Error) {
    super(message);
    this.name = 'TradingEngineError';
    this.code = code;
    this.cause = cause;
  }
}

/**
 * Error when no route is found for a swap
 */
export class NoRouteError extends TradingEngineError {
  readonly inputMint: string;
  readonly outputMint: string;
  readonly amount: bigint;

  constructor(inputMint: string, outputMint: string, amount: bigint) {
    super(
      `No route found for ${amount} ${inputMint} -> ${outputMint}`,
      'NO_ROUTE'
    );
    this.name = 'NoRouteError';
    this.inputMint = inputMint;
    this.outputMint = outputMint;
    this.amount = amount;
  }
}

/**
 * Error when slippage exceeds tolerance
 */
export class SlippageExceededError extends TradingEngineError {
  readonly expectedOutput: bigint;
  readonly actualOutput: bigint;
  readonly slippageBps: number;
  readonly maxSlippageBps: number;

  constructor(
    expectedOutput: bigint,
    actualOutput: bigint,
    slippageBps: number,
    maxSlippageBps: number
  ) {
    super(
      `Slippage ${slippageBps} bps exceeded maximum ${maxSlippageBps} bps. Expected ${expectedOutput}, got ${actualOutput}`,
      'SLIPPAGE_EXCEEDED'
    );
    this.name = 'SlippageExceededError';
    this.expectedOutput = expectedOutput;
    this.actualOutput = actualOutput;
    this.slippageBps = slippageBps;
    this.maxSlippageBps = maxSlippageBps;
  }
}

/**
 * Error when price impact is too high
 */
export class PriceImpactTooHighError extends TradingEngineError {
  readonly priceImpactPct: number;
  readonly maxPriceImpactPct: number;

  constructor(priceImpactPct: number, maxPriceImpactPct: number) {
    super(
      `Price impact ${priceImpactPct.toFixed(2)}% exceeds maximum ${maxPriceImpactPct}%`,
      'PRICE_IMPACT_TOO_HIGH'
    );
    this.name = 'PriceImpactTooHighError';
    this.priceImpactPct = priceImpactPct;
    this.maxPriceImpactPct = maxPriceImpactPct;
  }
}

/**
 * Error when insufficient liquidity
 */
export class InsufficientLiquidityError extends TradingEngineError {
  readonly availableLiquidity: bigint;
  readonly requiredLiquidity: bigint;
  readonly poolAddress?: string;

  constructor(availableLiquidity: bigint, requiredLiquidity: bigint, poolAddress?: string) {
    super(
      `Insufficient liquidity. Available: ${availableLiquidity}, Required: ${requiredLiquidity}${poolAddress ? ` in pool ${poolAddress}` : ''}`,
      'INSUFFICIENT_LIQUIDITY'
    );
    this.name = 'InsufficientLiquidityError';
    this.availableLiquidity = availableLiquidity;
    this.requiredLiquidity = requiredLiquidity;
    this.poolAddress = poolAddress;
  }
}

/**
 * Error when transaction simulation fails
 */
export class SimulationError extends TradingEngineError {
  readonly logs?: string[];
  readonly unitsConsumed?: number;

  constructor(message: string, logs?: string[], unitsConsumed?: number) {
    super(`Transaction simulation failed: ${message}`, 'SIMULATION_FAILED');
    this.name = 'SimulationError';
    this.logs = logs;
    this.unitsConsumed = unitsConsumed;
  }
}

/**
 * Error when transaction confirmation fails
 */
export class ConfirmationError extends TradingEngineError {
  readonly signature: string;
  readonly slot?: number;
  readonly confirmations?: number;

  constructor(signature: string, message: string, slot?: number, confirmations?: number) {
    super(`Transaction ${signature} failed to confirm: ${message}`, 'CONFIRMATION_FAILED');
    this.name = 'ConfirmationError';
    this.signature = signature;
    this.slot = slot;
    this.confirmations = confirmations;
  }
}

/**
 * Error when transaction expires before confirmation
 */
export class TransactionExpiredError extends TradingEngineError {
  readonly signature?: string;
  readonly blockhash: string;

  constructor(blockhash: string, signature?: string) {
    super(
      `Transaction with blockhash ${blockhash} expired before confirmation`,
      'TRANSACTION_EXPIRED'
    );
    this.name = 'TransactionExpiredError';
    this.signature = signature;
    this.blockhash = blockhash;
  }
}

/**
 * Error when a token is not found
 */
export class TokenNotFoundError extends TradingEngineError {
  readonly mint: string;

  constructor(mint: string) {
    super(`Token not found: ${mint}`, 'TOKEN_NOT_FOUND');
    this.name = 'TokenNotFoundError';
    this.mint = mint;
  }
}

/**
 * Error when a pool is not found
 */
export class PoolNotFoundError extends TradingEngineError {
  readonly tokenA: string;
  readonly tokenB: string;
  readonly dex: string;

  constructor(tokenA: string, tokenB: string, dex: string) {
    super(`No ${dex} pool found for ${tokenA}/${tokenB}`, 'POOL_NOT_FOUND');
    this.name = 'PoolNotFoundError';
    this.tokenA = tokenA;
    this.tokenB = tokenB;
    this.dex = dex;
  }
}

/**
 * Error when PumpFun bonding curve operations fail
 */
export class BondingCurveError extends TradingEngineError {
  readonly mint: string;
  readonly reason: 'MIGRATED' | 'NOT_FOUND' | 'INVALID_STATE';

  constructor(mint: string, reason: 'MIGRATED' | 'NOT_FOUND' | 'INVALID_STATE', message?: string) {
    const messages = {
      MIGRATED: 'Token has migrated to Raydium. Use Raydium or Jupiter for trading.',
      NOT_FOUND: 'Bonding curve not found. Token may not exist or may have migrated.',
      INVALID_STATE: 'Bonding curve is in an invalid state.',
    };
    super(message ?? messages[reason], 'BONDING_CURVE_ERROR');
    this.name = 'BondingCurveError';
    this.mint = mint;
    this.reason = reason;
  }
}

/**
 * Error when rate limit is exceeded
 */
export class RateLimitError extends TradingEngineError {
  readonly retryAfterMs?: number;
  readonly service: string;

  constructor(service: string, retryAfterMs?: number) {
    super(
      `Rate limit exceeded for ${service}${retryAfterMs ? `. Retry after ${retryAfterMs}ms` : ''}`,
      'RATE_LIMIT_EXCEEDED'
    );
    this.name = 'RateLimitError';
    this.service = service;
    this.retryAfterMs = retryAfterMs;
  }
}

/**
 * Error when Jito bundle submission fails
 */
export class JitoBundleError extends TradingEngineError {
  readonly bundleId?: string;
  readonly reason: 'REJECTED' | 'EXPIRED' | 'DROPPED' | 'INVALID';

  constructor(reason: 'REJECTED' | 'EXPIRED' | 'DROPPED' | 'INVALID', message: string, bundleId?: string) {
    super(message, 'JITO_BUNDLE_ERROR');
    this.name = 'JitoBundleError';
    this.bundleId = bundleId;
    this.reason = reason;
  }
}

/**
 * Error when user has insufficient balance
 */
export class InsufficientBalanceError extends TradingEngineError {
  readonly mint: string;
  readonly available: bigint;
  readonly required: bigint;

  constructor(mint: string, available: bigint, required: bigint) {
    super(
      `Insufficient balance of ${mint}. Available: ${available}, Required: ${required}`,
      'INSUFFICIENT_BALANCE'
    );
    this.name = 'InsufficientBalanceError';
    this.mint = mint;
    this.available = available;
    this.required = required;
  }
}

/**
 * Error when signer is required but not provided
 */
export class SignerRequiredError extends TradingEngineError {
  constructor(operation: string) {
    super(`Signer required for ${operation}`, 'SIGNER_REQUIRED');
    this.name = 'SignerRequiredError';
  }
}

/**
 * Type guard for TradingEngineError
 */
export function isTradingEngineError(error: unknown): error is TradingEngineError {
  return error instanceof TradingEngineError;
}

/**
 * Get user-friendly error message
 */
export function getErrorMessage(error: unknown): string {
  if (isTradingEngineError(error)) {
    return error.message;
  }
  if (error instanceof Error) {
    return error.message;
  }
  return String(error);
}

/**
 * Get error code for programmatic handling
 */
export function getErrorCode(error: unknown): string {
  if (isTradingEngineError(error)) {
    return error.code;
  }
  return 'UNKNOWN_ERROR';
}
