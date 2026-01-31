/**
 * contracts Implementation
 *
 * Adapted from: abi-types, ethers, foundry-toolkit, permit-approvals
 * See vendor/contracts/ for reference implementations.
 */

export * from './types';

// ============================================================
// Functions
// ============================================================

// From vendor code
export export function formatAbi<const abi extends Abi | readonly unknown[]>(
  abi: abi,
): FormatAbi<abi> {
  // TODO: Implement - see vendor/contracts/
  throw new Error('Not implemented: formatAbi');
}

// From vendor code
export export function formatAbiItem<const abiItem extends Abi[number]>(
  abiItem: abiItem,
): FormatAbiItem<abiItem> {
  // TODO: Implement - see vendor/contracts/
  throw new Error('Not implemented: formatAbiItem');
}

// From vendor code
export export function formatAbiParameter<
  const abiParameter extends AbiParameter | AbiEventParameter,
>(abiParameter: abiParameter): FormatAbiParameter<abiParameter> {
  // TODO: Implement - see vendor/contracts/
  throw new Error('Not implemented: formatAbiParameter');
}

// From vendor code
export export function formatAbiParameters<
  const abiParameters extends readonly [
    AbiParameter | AbiEventParameter,
    ...(readonly (AbiParameter | AbiEventParameter)[]),
  ],
>(abiParameters: abiParameters): FormatAbiParameters<abiParameters> {
  // TODO: Implement - see vendor/contracts/
  throw new Error('Not implemented: formatAbiParameters');
}

// From vendor code
export export function parseAbi<const signatures extends readonly string[]>(
  signatures: signatures['length'] extends 0
    ? Error<'At least one signature required'>
    : Signatures<signatures> extends signatures
      ? signatures
      : Signatures<signatures>,
): ParseAbi<signatures> {
  // TODO: Implement - see vendor/contracts/
  throw new Error('Not implemented: parseAbi');
}

// UCM expected export
export function getContract(...args: unknown[]): unknown {
  // TODO: Implement based on vendor/contracts/ patterns
  throw new Error('Not implemented: getContract');
}

// UCM expected export
export function readContract(...args: unknown[]): unknown {
  // TODO: Implement based on vendor/contracts/ patterns
  throw new Error('Not implemented: readContract');
}

// UCM expected export
export function writeContract(...args: unknown[]): unknown {
  // TODO: Implement based on vendor/contracts/ patterns
  throw new Error('Not implemented: writeContract');
}

// UCM expected export
export function watchEvent(...args: unknown[]): unknown {
  // TODO: Implement based on vendor/contracts/ patterns
  throw new Error('Not implemented: watchEvent');
}

// ============================================================
// Classes
// ============================================================

// From vendor code
export export class BaseError extends Error {
  constructor() {
    // TODO: Implement - see vendor/contracts/
    throw new Error('Not implemented: BaseError');
  }
}
