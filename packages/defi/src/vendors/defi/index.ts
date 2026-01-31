/**
 * defi Implementation
 *
 * Adapted from: tvl-adapters
 * See vendor/defi/ for reference implementations.
 */

export * from './types';

// ============================================================
// Functions
// ============================================================

// From vendor code
export function collateralPriceAtRatio({
  colRatio,
  collateral,
  vaultDebt,
}: {
  colRatio: BigNumber;
  collateral: BigNumber;
  vaultDebt: BigNumber;
}): BigNumber {
  // TODO: Implement - see vendor/defi/
  throw new Error('Not implemented: collateralPriceAtRatio');
}

// From vendor code
export async function displayDebugInfo(skippedTokens: Set<string>, liqs: Liq[], bins: Bins) {
  // TODO: Implement - see vendor/defi/
  throw new Error('Not implemented: displayDebugInfo');
}

// From vendor code
export async function main() {
  // TODO: Implement - see vendor/defi/
  throw new Error('Not implemented: main');
}

// From vendor code
export export async function binResults(liqs: Liq[]) {
  // TODO: Implement - see vendor/defi/
  throw new Error('Not implemented: binResults');
}

// From vendor code
export export async function getPagedGql(url: string, query: string, itemName: string, pageSize = 1000) {
  // TODO: Implement - see vendor/defi/
  throw new Error('Not implemented: getPagedGql');
}

// From vendor code
export function fromBase64(base64String) {
  // TODO: Implement - see vendor/defi/
  throw new Error('Not implemented: fromBase64');
}

// From vendor code
export function toBase64(bytes) {
  // TODO: Implement - see vendor/defi/
  throw new Error('Not implemented: toBase64');
}

// UCM expected export
export function getProtocol(...args: unknown[]): unknown {
  // TODO: Implement based on vendor/defi/ patterns
  throw new Error('Not implemented: getProtocol');
}

// UCM expected export
export function getTVL(...args: unknown[]): unknown {
  // TODO: Implement based on vendor/defi/ patterns
  throw new Error('Not implemented: getTVL');
}

// UCM expected export
export function getAPY(...args: unknown[]): unknown {
  // TODO: Implement based on vendor/defi/ patterns
  throw new Error('Not implemented: getAPY');
}

// UCM expected export
export function getPool(...args: unknown[]): unknown {
  // TODO: Implement based on vendor/defi/ patterns
  throw new Error('Not implemented: getPool');
}

// UCM expected export
export function swap(...args: unknown[]): unknown {
  // TODO: Implement based on vendor/defi/ patterns
  throw new Error('Not implemented: swap');
}
