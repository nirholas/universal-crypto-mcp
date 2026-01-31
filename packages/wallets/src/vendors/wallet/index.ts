/**
 * wallet Implementation
 *
 * Adapted from: connect-kit, connect-modal, evm-client, evm-hooks, multisig-sdk, sign-in-ethereum, solana-adapter, wallet-connect
 * See vendor/wallet/ for reference implementations.
 */

export * from './types';

// ============================================================
// Functions
// ============================================================

// From vendor code
export export function useChainIsSupported(chainId?: number): boolean | null {
  // TODO: Implement - see vendor/wallet/
  throw new Error('Not implemented: useChainIsSupported');
}

// From vendor code
export export function useChains() {
  // TODO: Implement - see vendor/wallet/
  throw new Error('Not implemented: useChains');
}

// From vendor code
export export function useConnectors() {
  // TODO: Implement - see vendor/wallet/
  throw new Error('Not implemented: useConnectors');
}

// From vendor code
export export function useConnector(id: string, uuid?: string) {
  // TODO: Implement - see vendor/wallet/
  throw new Error('Not implemented: useConnector');
}

// From vendor code
export export function useFamilyAccountsConnector() {
  // TODO: Implement - see vendor/wallet/
  throw new Error('Not implemented: useFamilyAccountsConnector');
}

// From vendor code
export export function useFamilyConnector() {
  // TODO: Implement - see vendor/wallet/
  throw new Error('Not implemented: useFamilyConnector');
}

// From vendor code
export export function useInjectedConnector(uuid?: string) {
  // TODO: Implement - see vendor/wallet/
  throw new Error('Not implemented: useInjectedConnector');
}

// From vendor code
export export function useWalletConnectConnector() {
  // TODO: Implement - see vendor/wallet/
  throw new Error('Not implemented: useWalletConnectConnector');
}

// From vendor code
export export function useCoinbaseWalletConnector() {
  // TODO: Implement - see vendor/wallet/
  throw new Error('Not implemented: useCoinbaseWalletConnector');
}

// From vendor code
export export function useMetaMaskConnector() {
  // TODO: Implement - see vendor/wallet/
  throw new Error('Not implemented: useMetaMaskConnector');
}

// From vendor code
export export function useEnsFallbackConfig(): Config | undefined {
  // TODO: Implement - see vendor/wallet/
  throw new Error('Not implemented: useEnsFallbackConfig');
}

// From vendor code
export function useIsMobile() {
  // TODO: Implement - see vendor/wallet/
  throw new Error('Not implemented: useIsMobile');
}

// From vendor code
export function useLockBodyScroll(initialLocked: boolean) {
  // TODO: Implement - see vendor/wallet/
  throw new Error('Not implemented: useLockBodyScroll');
}

// From vendor code
export function useWindowSize() {
  // TODO: Implement - see vendor/wallet/
  throw new Error('Not implemented: useWindowSize');
}

// From vendor code
export function handleResize() {
  // TODO: Implement - see vendor/wallet/
  throw new Error('Not implemented: handleResize');
}

// UCM expected export
export function useWallet(...args: unknown[]): unknown {
  // TODO: Implement based on vendor/wallet/ patterns
  throw new Error('Not implemented: useWallet');
}

// UCM expected export
export function useConnect(...args: unknown[]): unknown {
  // TODO: Implement based on vendor/wallet/ patterns
  throw new Error('Not implemented: useConnect');
}

// UCM expected export
export function useDisconnect(...args: unknown[]): unknown {
  // TODO: Implement based on vendor/wallet/ patterns
  throw new Error('Not implemented: useDisconnect');
}

// UCM expected export
export function useAccount(...args: unknown[]): unknown {
  // TODO: Implement based on vendor/wallet/ patterns
  throw new Error('Not implemented: useAccount');
}

// UCM expected export
export function useBalance(...args: unknown[]): unknown {
  // TODO: Implement based on vendor/wallet/ patterns
  throw new Error('Not implemented: useBalance');
}

// UCM expected export
export function useNetwork(...args: unknown[]): unknown {
  // TODO: Implement based on vendor/wallet/ patterns
  throw new Error('Not implemented: useNetwork');
}

// UCM expected export
export function useSigner(...args: unknown[]): unknown {
  // TODO: Implement based on vendor/wallet/ patterns
  throw new Error('Not implemented: useSigner');
}

// ============================================================
// Classes
// ============================================================

// From vendor code
export class FriendlyError extends Error {
  constructor() {
    // TODO: Implement - see vendor/wallet/
    throw new Error('Not implemented: FriendlyError');
  }
}

// From vendor code
export class ValidationError extends Error {
  constructor() {
    // TODO: Implement - see vendor/wallet/
    throw new Error('Not implemented: ValidationError');
  }
}

// From vendor code
export class SafeApiKit {
  constructor() {
    // TODO: Implement - see vendor/wallet/
    throw new Error('Not implemented: SafeApiKit');
  }
}

// From vendor code
export class Safe {
  constructor() {
    // TODO: Implement - see vendor/wallet/
    throw new Error('Not implemented: Safe');
  }
}

// From vendor code
export class SafeProvider {
  constructor() {
    // TODO: Implement - see vendor/wallet/
    throw new Error('Not implemented: SafeProvider');
  }
}

// From vendor code
export class BaseContract<ContractAbiType extends Abi> {
  constructor() {
    // TODO: Implement - see vendor/wallet/
    throw new Error('Not implemented: BaseContract');
  }
}

// From vendor code
export class ContractManager {
  constructor() {
    // TODO: Implement - see vendor/wallet/
    throw new Error('Not implemented: ContractManager');
  }
}

// From vendor code
export class FallbackHandlerManager {
  constructor() {
    // TODO: Implement - see vendor/wallet/
    throw new Error('Not implemented: FallbackHandlerManager');
  }
}

// From vendor code
export class GuardManager {
  constructor() {
    // TODO: Implement - see vendor/wallet/
    throw new Error('Not implemented: GuardManager');
  }
}
