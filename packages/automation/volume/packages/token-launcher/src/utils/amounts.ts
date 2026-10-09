/**
 * Decimal amount conversion without floating point rounding.
 */

import { TokenLaunchError, TokenLaunchErrorCode } from '../types.js';

const DECIMAL_AMOUNT = /^\d+(\.\d+)?$/;

/**
 * Convert a whole-unit decimal string (e.g. "0.25") to base units of a mint
 * with `decimals` decimals. Digits past `decimals` are truncated.
 */
export function toBaseUnits(amount: string, decimals: number): bigint {
  const trimmed = amount.trim();
  if (!DECIMAL_AMOUNT.test(trimmed)) {
    throw new TokenLaunchError(
      TokenLaunchErrorCode.INVALID_PARAMS,
      `Invalid amount "${amount}": expected a non-negative decimal number`
    );
  }
  const [whole = '0', fraction = ''] = trimmed.split('.');
  const paddedFraction = fraction.slice(0, decimals).padEnd(decimals, '0');
  return BigInt(whole) * 10n ** BigInt(decimals) + BigInt(paddedFraction || '0');
}
