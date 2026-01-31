/**
 * Wallet Adapter Layer
 * 
 * Unified wallet connection for EVM and Solana chains.
 * Wraps wagmi, viem, and solana-wallet-adapter.
 * 
 * Reference: /vendor/wallet/
 */

import { createConfig, http } from 'wagmi';
import { mainnet, polygon, arbitrum, optimism, base } from 'wagmi/chains';
import { createPublicClient, createWalletClient as viemWalletClient, type Chain } from 'viem';

// ============================================================
// Types
// ============================================================

export interface WalletConfig {
  chains?: Chain[];
  projectId?: string;
  appName?: string;
}

export interface WalletState {
  address: string | null;
  chainId: number | null;
  isConnected: boolean;
  isConnecting: boolean;
}

export interface WalletClient {
  connect: (connector: string) => Promise<void>;
  disconnect: () => Promise<void>;
  switchChain: (chainId: number) => Promise<void>;
  signMessage: (message: string) => Promise<string>;
  getState: () => WalletState;
}

// ============================================================
// Default Configuration
// ============================================================

const DEFAULT_CHAINS = [mainnet, polygon, arbitrum, optimism, base];

// ============================================================
// Wallet Client Factory
// ============================================================

export function createWalletConfig(options: WalletConfig = {}) {
  const chains = options.chains || DEFAULT_CHAINS;
  
  return createConfig({
    chains: chains as [Chain, ...Chain[]],
    transports: Object.fromEntries(
      chains.map(chain => [chain.id, http()])
    ),
  });
}

export function createPublicClientForChain(chain: Chain) {
  return createPublicClient({
    chain,
    transport: http(),
  });
}

// ============================================================
// React Hooks (re-exports with UCM conventions)
// ============================================================

export { 
  useAccount,
  useConnect,
  useDisconnect,
  useBalance,
  useChainId,
  useSwitchChain,
  useSignMessage,
  useSignTypedData,
  useSendTransaction,
  useWaitForTransactionReceipt,
} from 'wagmi';

// ============================================================
// Chain Utilities
// ============================================================

export { 
  mainnet, 
  polygon, 
  arbitrum, 
  optimism, 
  base,
  sepolia,
  goerli,
} from 'wagmi/chains';

export function getChainById(chainId: number): Chain | undefined {
  return DEFAULT_CHAINS.find(chain => chain.id === chainId);
}

export function getSupportedChainIds(): number[] {
  return DEFAULT_CHAINS.map(chain => chain.id);
}

// ============================================================
// Address Utilities
// ============================================================

export function formatAddress(address: string, chars = 4): string {
  if (!address || address.length < 10) return address;
  return `${address.slice(0, chars + 2)}...${address.slice(-chars)}`;
}

export function isValidAddress(address: string): boolean {
  return /^0x[a-fA-F0-9]{40}$/.test(address);
}
