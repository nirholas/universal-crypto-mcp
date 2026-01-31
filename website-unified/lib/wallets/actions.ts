/**
 * Real Wallet Connection Actions
 * 
 * Enterprise-grade wallet connection using wagmi and Solana wallet adapter
 * This file contains the REAL connection logic that integrates with
 * wagmi for EVM and Solana wallet adapter for Solana
 * 
 * @author Nich (@nichxbt)
 * @license Apache-2.0
 */

import { ConnectedWallet, WalletProviderType } from './types';
import { getNetworkByChainId } from './networks';
import {  
  connectSolanaWallet,
  disconnectSolanaWallet,
  detectSolanaWallets,
  DetectedWallet as SolanaDetectedWallet,
} from './solana';

// ============================================
// EVM Wallet Connection (via wagmi connectors)
// ============================================

/**
 * Connect to an EVM wallet using wagmi connectors
 * This function should be called from wagmi hooks in the component layer
 */
export async function connectEvmWallet(
  provider: WalletProviderType,
  wagmiConnect: (connector: any) => Promise<any>,
  wagmiConnectors: any[]
): Promise<ConnectedWallet> {
  // Map provider to wagmi connector
  const connectorMap: Record<string, string> = {
    metamask: 'metaMask',
    coinbase: 'coinbaseWallet',
    walletconnect: 'walletConnect',
    injected: 'injected',
    safe: 'safe',
    rabby: 'injected', // Rabby uses injected
    brave: 'injected', // Brave uses injected
    trust: 'injected', // Trust uses injected
  };

  const connectorId = connectorMap[provider];
  if (!connectorId) {
    throw new Error(`Unsupported EVM provider: ${provider}`);
  }

  // Find the connector
  const connector = wagmiConnectors.find(
    (c: any) => c.id === connectorId || c.name.toLowerCase().includes(provider)
  );

  if (!connector) {
    throw new Error(`${provider} connector not found`);
  }

  // Connect using wagmi
  const result = await wagmiConnect(connector);

  if (!result || !result.accounts || result.accounts.length === 0) {
    throw new Error('No accounts returned from wallet');
  }

  const address = result.accounts[0];
  const chainId = result.chainId || 1;

  const wallet: ConnectedWallet = {
    id: `${provider}-${Date.now()}`,
    provider,
    address,
    chainId,
    chainFamily: 'evm',
    isConnected: true,
    isDefault: true,
    connectedAt: new Date(),
    lastActiveAt: new Date(),
  };

  return wallet;
}

// ============================================
// Solana Wallet Connection
// ============================================

/**
 * Connect to a Solana wallet using wallet adapter
 */
export async function connectSolana(
  provider: WalletProviderType
): Promise<ConnectedWallet> {
  // Detect available Solana wallets
  const solanaWallets = detectSolanaWallets();
  
  // Find the wallet
  const wallet = solanaWallets.find(w => 
    w.name.toLowerCase() === provider.toLowerCase()
  );

  if (!wallet) {
    throw new Error(`${provider} wallet not detected. Please install it first.`);
  }

  // Connect to the wallet
  const result = await connectSolanaWallet(wallet);

  const connectedWallet: ConnectedWallet = {
    id: `${provider}-${Date.now()}`,
    provider,
    address: result.publicKey,
    chainId: 101, // Solana mainnet
    chainFamily: 'solana',
    isConnected: true,
    isDefault: true,
    connectedAt: new Date(),
    lastActiveAt: new Date(),
  };

  return connectedWallet;
}

/**
 * Disconnect from a Solana wallet
 */
export async function disconnectSolana(wallet: ConnectedWallet): Promise<void> {
  const solanaWallets = detectSolanaWallets();
  const solanaWallet = solanaWallets.find(w => 
    w.name.toLowerCase() === wallet.provider.toLowerCase()
  );

  if (solanaWallet) {
    await disconnectSolanaWallet(solanaWallet);
  }
}

// ============================================
// Unified Connection Logic
// ============================================

export interface ConnectionParams {
  provider: WalletProviderType;
  // For EVM (wagmi)
  wagmiConnect?: (connector: any) => Promise<any>;
  wagmiConnectors?: any[];
  // For Solana (wallet adapter)
  useSolanaAdapter?: boolean;
}

/**
 * Unified wallet connection that routes to appropriate handler
 */
export async function connectWallet(params: ConnectionParams): Promise<ConnectedWallet> {
  const { provider, wagmiConnect, wagmiConnectors } = params;

  // Determine if this is a Solana wallet
  const solanaProviders = ['phantom', 'solflare', 'backpack', 'glow'];
  const isSolana = solanaProviders.includes(provider);

  if (isSolana) {
    return connectSolana(provider);
  } else {
    if (!wagmiConnect || !wagmiConnectors) {
      throw new Error('wagmiConnect and wagmiConnectors required for EVM wallets');
    }
    return connectEvmWallet(provider, wagmiConnect, wagmiConnectors);
  }
}

/**
 * Unified wallet disconnection
 */
export async function disconnectWallet(
  wallet: ConnectedWallet,
  wagmiDisconnect?: () => Promise<void>
): Promise<void> {
  if (wallet.chainFamily === 'solana') {
    await disconnectSolana(wallet);
  } else {
    if (wagmiDisconnect) {
      await wagmiDisconnect();
    }
  }
}

// ============================================
// Network Switching
// ============================================

/**
 * Switch network for EVM chains using wagmi
 */
export async function switchEvmNetwork(
  chainId: number,
  wagmiSwitchChain: (chainId: number) => Promise<void>
): Promise<void> {
  await wagmiSwitchChain(chainId);
}

/**
 * Switch network for Solana (changes cluster)
 */
export async function switchSolanaNetwork(
  chainId: number
): Promise<void> {
  // Solana network switching is handled by RPC URL changes
  // This is typically done through wallet settings
  // For now, we just validate the chainId
  const validSolanaChainIds = [101, 102, 103]; // mainnet, testnet, devnet
  
  if (!validSolanaChainIds.includes(chainId)) {
    throw new Error(`Invalid Solana chain ID: ${chainId}`);
  }
  
  // Network switching for Solana happens at the RPC level
  // The wallet maintains its connection
}

/**
 * Unified network switching
 */
export async function switchNetwork(
  chainId: number,
  currentWallet: ConnectedWallet | undefined,
  wagmiSwitchChain?: (chainId: number) => Promise<void>
): Promise<void> {
  const network = getNetworkByChainId(chainId);
  
  if (!network) {
    throw new Error(`Network with chainId ${chainId} not found`);
  }

  if (!currentWallet) {
    throw new Error('No active wallet');
  }

  if (currentWallet.chainFamily === 'evm') {
    if (!wagmiSwitchChain) {
      throw new Error('wagmiSwitchChain required for EVM network switching');
    }
    await switchEvmNetwork(chainId, wagmiSwitchChain);
  } else {
    await switchSolanaNetwork(chainId);
  }
}

// ============================================
// Persistence Helpers
// ============================================

/**
 * Save connected wallet to localStorage for auto-reconnect
 */
export function saveConnectedWallet(provider: WalletProviderType): void {
  if (typeof localStorage === 'undefined') return;
  
  try {
    const connectedWallets = JSON.parse(localStorage.getItem('connected-wallets') || '[]');
    if (!connectedWallets.includes(provider)) {
      connectedWallets.push(provider);
      localStorage.setItem('connected-wallets', JSON.stringify(connectedWallets));
    }
  } catch (err) {
    console.error('Failed to save connected wallet:', err);
  }
}

/**
 * Remove wallet from localStorage
 */
export function removeConnectedWallet(provider: WalletProviderType): void {
  if (typeof localStorage === 'undefined') return;
  
  try {
    const connectedWallets = JSON.parse(localStorage.getItem('connected-wallets') || '[]');
    const filtered = connectedWallets.filter((p: string) => p !== provider);
    localStorage.setItem('connected-wallets', JSON.stringify(filtered));
  } catch (err) {
    console.error('Failed to remove connected wallet:', err);
  }
}

/**
 * Get list of previously connected wallets
 */
export function getConnectedWallets(): WalletProviderType[] {
  if (typeof localStorage === 'undefined') return [];
  
  try {
    return JSON.parse(localStorage.getItem('connected-wallets') || '[]');
  } catch (err) {
    console.error('Failed to get connected wallets:', err);
    return [];
  }
}

/**
 * Clear all connected wallets from localStorage
 */
export function clearConnectedWallets(): void {
  if (typeof localStorage === 'undefined') return;
  
  try {
    localStorage.removeItem('connected-wallets');
  } catch (err) {
    console.error('Failed to clear connected wallets:', err);
  }
}
