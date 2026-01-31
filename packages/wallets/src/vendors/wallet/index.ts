/**
 * Wallet Implementation
 *
 * Universal wallet hooks and utilities for EVM and Solana
 * Uses viem for EVM, @solana/web3.js patterns for Solana
 */

import {
  createPublicClient,
  createWalletClient,
  http,
  formatEther,
  formatUnits,
  type Address,
  type Chain,
  type Abi,
} from 'viem';
import { mainnet, arbitrum, base, optimism, polygon } from 'viem/chains';
import { privateKeyToAccount } from 'viem/accounts';

export * from './types';

// ============================================================
// Configuration
// ============================================================

const SUPPORTED_CHAINS: Record<number, Chain> = {
  1: mainnet,
  42161: arbitrum,
  8453: base,
  10: optimism,
  137: polygon,
};

const RPC_URLS: Record<number, string> = {
  1: process.env.RPC_MAINNET || 'https://eth.llamarpc.com',
  42161: process.env.RPC_ARBITRUM || 'https://arb1.arbitrum.io/rpc',
  8453: process.env.RPC_BASE || 'https://mainnet.base.org',
  10: process.env.RPC_OPTIMISM || 'https://mainnet.optimism.io',
  137: process.env.RPC_POLYGON || 'https://polygon-rpc.com',
};

// ============================================================
// State Management (Server-side wallet state)
// ============================================================

interface WalletState {
  address: Address | null;
  chainId: number;
  connected: boolean;
  connector: string | null;
}

let walletState: WalletState = {
  address: null,
  chainId: 1,
  connected: false,
  connector: null,
};

const connectors = new Map<string, { id: string; name: string; type: string }>();

// Initialize default connectors
connectors.set('injected', { id: 'injected', name: 'Browser Wallet', type: 'injected' });
connectors.set('walletconnect', { id: 'walletconnect', name: 'WalletConnect', type: 'walletconnect' });
connectors.set('coinbase', { id: 'coinbase', name: 'Coinbase Wallet', type: 'coinbase' });

// ============================================================
// Chain Hooks
// ============================================================

export function useChainIsSupported(chainId?: number): boolean | null {
  if (chainId === undefined) return null;
  return chainId in SUPPORTED_CHAINS;
}

export function useChains(): Chain[] {
  return Object.values(SUPPORTED_CHAINS);
}

// ============================================================
// Connector Hooks
// ============================================================

export function useConnectors(): Array<{ id: string; name: string; type: string }> {
  return Array.from(connectors.values());
}

export function useConnector(id: string, _uuid?: string): { id: string; name: string; type: string } | null {
  return connectors.get(id) || null;
}

export function useFamilyAccountsConnector(): { id: string; name: string; type: string } | null {
  return connectors.get('family') || null;
}

export function useFamilyConnector(): { id: string; name: string; type: string } | null {
  return connectors.get('family') || null;
}

export function useInjectedConnector(_uuid?: string): { id: string; name: string; type: string } | null {
  return connectors.get('injected') || null;
}

export function useWalletConnectConnector(): { id: string; name: string; type: string } | null {
  return connectors.get('walletconnect') || null;
}

export function useCoinbaseWalletConnector(): { id: string; name: string; type: string } | null {
  return connectors.get('coinbase') || null;
}

export function useMetaMaskConnector(): { id: string; name: string; type: string } | null {
  return connectors.get('injected') || null;
}

// ============================================================
// ENS & Config Hooks
// ============================================================

interface Config {
  chains: Chain[];
  rpcUrls: Record<number, string>;
}

export function useEnsFallbackConfig(): Config | undefined {
  return {
    chains: Object.values(SUPPORTED_CHAINS),
    rpcUrls: RPC_URLS,
  };
}

// ============================================================
// UI Utility Hooks
// ============================================================

export function useIsMobile(): boolean {
  // Server-side always returns false
  return false;
}

export function useLockBodyScroll(_initialLocked: boolean): void {
  // No-op on server side
}

export function useWindowSize(): { width: number; height: number } {
  return { width: 1920, height: 1080 };
}

export function handleResize(): void {
  // No-op on server side
}

// ============================================================
// Core Wallet Hooks
// ============================================================

export function useWallet(): WalletState {
  return { ...walletState };
}

export function useConnect(): {
  connect: (connector: string, privateKey?: string) => Promise<Address>;
  connectors: Array<{ id: string; name: string }>;
  isConnecting: boolean;
  error: Error | null;
} {
  return {
    connect: async (connector: string, privateKey?: string) => {
      if (privateKey) {
        const account = privateKeyToAccount(privateKey as `0x${string}`);
        walletState = {
          address: account.address,
          chainId: walletState.chainId,
          connected: true,
          connector,
        };
        return account.address;
      }
      throw new Error('Private key required for server-side wallet connection');
    },
    connectors: Array.from(connectors.values()),
    isConnecting: false,
    error: null,
  };
}

export function useDisconnect(): { disconnect: () => void; isDisconnecting: boolean } {
  return {
    disconnect: () => {
      walletState = {
        address: null,
        chainId: walletState.chainId,
        connected: false,
        connector: null,
      };
    },
    isDisconnecting: false,
  };
}

export function useAccount(): {
  address: Address | null;
  isConnected: boolean;
  isConnecting: boolean;
  isDisconnected: boolean;
} {
  return {
    address: walletState.address,
    isConnected: walletState.connected,
    isConnecting: false,
    isDisconnected: !walletState.connected,
  };
}

export async function useBalance(address?: Address): Promise<{
  value: bigint;
  formatted: string;
  symbol: string;
} | null> {
  const targetAddress = address || walletState.address;
  if (!targetAddress) return null;

  const chain = SUPPORTED_CHAINS[walletState.chainId];
  if (!chain) return null;

  const client = createPublicClient({
    chain,
    transport: http(RPC_URLS[walletState.chainId]),
  });

  const balance = await client.getBalance({ address: targetAddress });

  return {
    value: balance,
    formatted: formatEther(balance),
    symbol: chain.nativeCurrency.symbol,
  };
}

export function useNetwork(): {
  chain: Chain | null;
  chains: Chain[];
  switchNetwork: (chainId: number) => void;
} {
  return {
    chain: SUPPORTED_CHAINS[walletState.chainId] || null,
    chains: Object.values(SUPPORTED_CHAINS),
    switchNetwork: (chainId: number) => {
      if (chainId in SUPPORTED_CHAINS) {
        walletState.chainId = chainId;
      }
    },
  };
}

export function useSigner(privateKey: string): {
  signMessage: (message: string) => Promise<string>;
  signTransaction: (tx: unknown) => Promise<string>;
} {
  const account = privateKeyToAccount(privateKey as `0x${string}`);

  return {
    signMessage: async (message: string) => {
      return account.signMessage({ message });
    },
    signTransaction: async (tx: unknown) => {
      return account.signTransaction(tx as Parameters<typeof account.signTransaction>[0]);
    },
  };
}

// ============================================================
// Error Classes
// ============================================================

export class FriendlyError extends Error {
  public readonly userMessage: string;

  constructor(message: string, userMessage?: string) {
    super(message);
    this.name = 'FriendlyError';
    this.userMessage = userMessage || message;
  }
}

export class ValidationError extends Error {
  public readonly field: string;
  public readonly code: string;

  constructor(message: string, field: string = '', code: string = 'VALIDATION_ERROR') {
    super(message);
    this.name = 'ValidationError';
    this.field = field;
    this.code = code;
  }
}

// ============================================================
// Safe/Multisig Classes (Placeholder implementations)
// ============================================================

export class SafeApiKit {
  private chainId: number;
  private apiUrl: string;

  constructor(config: { chainId: number; txServiceUrl?: string }) {
    this.chainId = config.chainId;
    this.apiUrl = config.txServiceUrl || `https://safe-transaction-mainnet.safe.global`;
  }

  async getSafeInfo(safeAddress: string): Promise<unknown> {
    const response = await fetch(`${this.apiUrl}/api/v1/safes/${safeAddress}/`);
    return response.json();
  }

  async getPendingTransactions(safeAddress: string): Promise<unknown[]> {
    const response = await fetch(`${this.apiUrl}/api/v1/safes/${safeAddress}/multisig-transactions/?executed=false`);
    const data = await response.json() as { results: unknown[] };
    return data.results;
  }
}

export class Safe {
  private address: Address;
  private chainId: number;

  constructor(config: { safeAddress: Address; chainId: number }) {
    this.address = config.safeAddress;
    this.chainId = config.chainId;
  }

  getAddress(): Address {
    return this.address;
  }

  async getOwners(): Promise<Address[]> {
    // Would query Safe contract
    return [];
  }

  async getThreshold(): Promise<number> {
    // Would query Safe contract
    return 1;
  }
}

export class SafeProvider {
  private chainId: number;
  private rpcUrl: string;

  constructor(config: { chainId: number; rpcUrl?: string }) {
    this.chainId = config.chainId;
    this.rpcUrl = config.rpcUrl || RPC_URLS[config.chainId] || '';
  }

  getChainId(): number {
    return this.chainId;
  }
}

// ============================================================
// Contract Classes
// ============================================================

export class BaseContract<ContractAbiType extends Abi> {
  protected address: Address;
  protected abi: ContractAbiType;
  protected chainId: number;

  constructor(address: Address, abi: ContractAbiType, chainId: number = 1) {
    this.address = address;
    this.abi = abi;
    this.chainId = chainId;
  }

  getAddress(): Address {
    return this.address;
  }

  getAbi(): ContractAbiType {
    return this.abi;
  }
}

export class ContractManager {
  private contracts: Map<string, BaseContract<Abi>> = new Map();

  register(name: string, contract: BaseContract<Abi>): void {
    this.contracts.set(name, contract);
  }

  get(name: string): BaseContract<Abi> | undefined {
    return this.contracts.get(name);
  }

  list(): string[] {
    return Array.from(this.contracts.keys());
  }
}

export class FallbackHandlerManager {
  private handlers: Map<string, (data: unknown) => Promise<unknown>> = new Map();

  register(selector: string, handler: (data: unknown) => Promise<unknown>): void {
    this.handlers.set(selector, handler);
  }

  async handle(selector: string, data: unknown): Promise<unknown> {
    const handler = this.handlers.get(selector);
    if (!handler) {
      throw new Error(`No handler for selector: ${selector}`);
    }
    return handler(data);
  }
}

export class GuardManager {
  private guards: Array<(tx: unknown) => Promise<boolean>> = [];

  addGuard(guard: (tx: unknown) => Promise<boolean>): void {
    this.guards.push(guard);
  }

  async validate(tx: unknown): Promise<boolean> {
    for (const guard of this.guards) {
      if (!(await guard(tx))) {
        return false;
      }
    }
    return true;
  }
}
