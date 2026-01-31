/**
 * Wallet Provider
 * 
 * Context provider for unified wallet state across EVM and Solana
 * Integrates with wagmi for EVM and Solana wallet adapter for Solana
 * 
 * @author Nich (@nichxbt)
 * @license Apache-2.0
 */

'use client';

import React, { createContext, useContext, useEffect, useState, useCallback, ReactNode } from 'react';
import { WagmiProvider } from 'wagmi';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { useWalletStore } from '@/lib/wallets/store';
import { 
  NetworkConfig,
  ConnectedWallet,
  WalletProviderType,
} from '@/lib/wallets/types';
import { getNetworkByChainId } from '@/lib/wallets/networks';
import { isWalletInstalled } from '@/lib/wallets/providers';
import { wagmiConfig } from '@/lib/wallets/wagmi';
import { detectSolanaWallets, isPhantomInstalled, isSolflareInstalled } from '@/lib/wallets/solana';

// ============================================
// Context Types
// ============================================

interface WalletContextValue {
  // Connection state
  isConnected: boolean;
  isConnecting: boolean;
  isReconnecting: boolean;
  error: Error | undefined;
  
  // Wallets
  wallets: ConnectedWallet[];
  activeWallet: ConnectedWallet | undefined;
  
  // Network
  currentNetwork: NetworkConfig | undefined;
  supportedNetworks: NetworkConfig[];
  
  // Actions
  connect: (provider: WalletProviderType) => Promise<void>;
  disconnect: (walletId?: string) => Promise<void>;
  switchNetwork: (chainId: number | string) => Promise<void>;
  setActiveWallet: (walletId: string) => void;
  
  // Provider detection
  isProviderInstalled: (provider: WalletProviderType) => boolean;
  
  // Modal controls
  openConnectModal: () => void;
  closeConnectModal: () => void;
  isConnectModalOpen: boolean;
}

const WalletContext = createContext<WalletContextValue | undefined>(undefined);

// ============================================
// Query Client for wagmi
// ============================================

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
      retry: false,
    },
  },
});

// ============================================
// Provider Component
// ============================================

interface WalletProviderProps {
  children: ReactNode;
  autoConnect?: boolean;
  defaultNetwork?: number | string;
}

export function WalletProvider({ 
  children, 
  autoConnect = true,
  defaultNetwork = 1,
}: WalletProviderProps) {
  return (
    <WagmiProvider config={wagmiConfig}>
      <QueryClientProvider client={queryClient}>
        <InternalWalletProvider autoConnect={autoConnect} defaultNetwork={defaultNetwork}>
          {children}
        </InternalWalletProvider>
      </QueryClientProvider>
    </WagmiProvider>
  );
}

// Internal provider with wagmi hooks
function InternalWalletProvider({
  children,
  autoConnect,
  defaultNetwork,
}: WalletProviderProps) {
  const [isConnectModalOpen, setIsConnectModalOpen] = useState(false);
  const [isInitialized, setIsInitialized] = useState(false);

  // Get store values
  const {
    isConnected,
    isConnecting,
    isReconnecting,
    error,
    wallets,
    activeWallet,
    currentNetwork,
    supportedNetworks,
    connect,
    disconnect,
    switchNetwork,
    setActiveWallet,
  } = useWalletStore();

  // Initialize on mount
  useEffect(() => {
    if (isInitialized) return;

    const initialize = async () => {
      // Set default network if not set
      if (!currentNetwork) {
        const defaultNet = getNetworkByChainId(defaultNetwork);
        if (defaultNet) {
          useWalletStore.setState({ currentNetwork: defaultNet });
        }
      }

      // Auto-reconnect if enabled
      if (autoConnect && wallets.length > 0) {
        // In a real implementation, this would attempt to reconnect
        // to previously connected wallets
      }

      setIsInitialized(true);
    };

    initialize();
  }, [isInitialized, autoConnect, defaultNetwork, currentNetwork, wallets.length]);

  // Handle wallet events
  useEffect(() => {
    if (typeof window === 'undefined') return;

    const handleAccountsChanged = (accounts: string[]) => {
      if (accounts.length === 0) {
        // User disconnected their wallet
        disconnect();
      } else if (activeWallet) {
        // Account changed
        useWalletStore.setState(state => ({
          wallets: state.wallets.map(w =>
            w.id === activeWallet.id ? { ...w, address: accounts[0] } : w
          ),
          activeWallet: { ...activeWallet, address: accounts[0] },
        }));
      }
    };

    const handleChainChanged = (chainIdHex: string) => {
      const chainId = parseInt(chainIdHex, 16);
      const network = getNetworkByChainId(chainId);
      
      if (network) {
        useWalletStore.setState({ currentNetwork: network });
        
        if (activeWallet) {
          useWalletStore.setState(state => ({
            wallets: state.wallets.map(w =>
              w.id === activeWallet.id ? { ...w, chainId } : w
            ),
            activeWallet: { ...activeWallet, chainId },
          }));
        }
      }
    };

    const ethereum = (window as any).ethereum;
    if (ethereum) {
      ethereum.on('accountsChanged', handleAccountsChanged);
      ethereum.on('chainChanged', handleChainChanged);

      return () => {
        ethereum.removeListener('accountsChanged', handleAccountsChanged);
        ethereum.removeListener('chainChanged', handleChainChanged);
      };
    }
  }, [activeWallet, disconnect]);

  // Provider detection with enhanced checks
  const isProviderInstalled = useCallback((provider: WalletProviderType) => {
    // Check using our provider detection utilities
    if (provider === 'phantom') return isPhantomInstalled();
    if (provider === 'solflare') return isSolflareInstalled();
    return isWalletInstalled(provider);
  }, []);

  // Modal controls
  const openConnectModal = useCallback(() => {
    setIsConnectModalOpen(true);
  }, []);

  const closeConnectModal = useCallback(() => {
    setIsConnectModalOpen(false);
  }, []);

  // Enhanced connect that closes modal on success
  const handleConnect = useCallback(async (provider: WalletProviderType) => {
    try {
      await connect(provider);
      closeConnectModal();
    } catch (err) {
      console.error('Connection failed:', err);
      throw err;
    }
  }, [connect, closeConnectModal]);

  const value: WalletContextValue = {
    isConnected,
    isConnecting,
    isReconnecting,
    error,
    wallets,
    activeWallet,
    currentNetwork,
    supportedNetworks,
    connect: handleConnect,
    disconnect,
    switchNetwork,
    setActiveWallet,
    isProviderInstalled,
    openConnectModal,
    closeConnectModal,
    isConnectModalOpen,
  };

  return (
    <WalletContext.Provider value={value}>
      {children}
    </WalletContext.Provider>
  );
}

// ============================================
// Hook
// ============================================

export function useWallet(): WalletContextValue {
  const context = useContext(WalletContext);
  
  if (!context) {
    throw new Error('useWallet must be used within a WalletProvider');
  }
  
  return context;
}

// ============================================
// Utility Components
// ============================================

interface WalletGuardProps {
  children: ReactNode;
  fallback?: ReactNode;
}

/**
 * Component that only renders children when wallet is connected
 */
export function WalletGuard({ children, fallback }: WalletGuardProps) {
  const { isConnected } = useWallet();
  
  if (!isConnected) {
    return fallback ?? null;
  }
  
  return <>{children}</>;
}

interface NetworkGuardProps {
  children: ReactNode;
  chainIds: (number | string)[];
  fallback?: ReactNode;
}

/**
 * Component that only renders children when connected to specific networks
 */
export function NetworkGuard({ children, chainIds, fallback }: NetworkGuardProps) {
  const { currentNetwork } = useWallet();
  
  if (!currentNetwork || !chainIds.includes(currentNetwork.chainId)) {
    return fallback ?? null;
  }
  
  return <>{children}</>;
}
