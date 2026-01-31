/**
 * Wallet Provider
 * 
 * Enterprise-grade unified wallet management for EVM and Solana
 * Uses wagmi v2 for EVM chains and Solana wallet adapter for Solana
 * 
 * @author Nich (@nichxbt)
 * @license Apache-2.0
 */

'use client';

import React, { createContext, useContext, useEffect, useState, useCallback, ReactNode, useMemo } from 'react';
import { WagmiProvider, useAccount, useConnect, useDisconnect, useSwitchChain, useChainId } from 'wagmi';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { useWalletStore } from '@/lib/wallets/store';
import { 
  NetworkConfig,
  ConnectedWallet,
  WalletProviderType,
} from '@/lib/wallets/types';
import { getNetworkByChainId, allNetworks } from '@/lib/wallets/networks';
import { isWalletInstalled } from '@/lib/wallets/providers';
import { wagmiConfig } from '@/lib/wallets/wagmi';
import { 
  detectSolanaWallets, 
  isPhantomInstalled, 
  isSolflareInstalled,
  connectSolanaWallet,
  disconnectSolanaWallet,
  DetectedWallet as SolanaDetectedWallet,
} from '@/lib/wallets/solana';

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
  chainId: number | undefined;
  
  // EVM-specific (from wagmi)
  evmAddress: `0x${string}` | undefined;
  evmConnector: any;
  evmConnectors: readonly any[];
  
  // Actions
  connect: (provider: WalletProviderType) => Promise<void>;
  disconnect: (walletId?: string) => Promise<void>;
  switchNetwork: (chainId: number | string) => Promise<void>;
  setActiveWallet: (walletId: string) => void;
  
  // Provider detection
  isProviderInstalled: (provider: WalletProviderType) => boolean;
  getDetectedWallets: () => { evm: string[]; solana: string[] };
  
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

  // ========================================
  // Wagmi Hooks - Real EVM wallet connection
  // ========================================
  const { 
    address: evmAddress, 
    isConnected: evmIsConnected, 
    isConnecting: evmIsConnecting,
    isReconnecting: evmIsReconnecting,
    connector: evmConnector,
    chainId: evmChainId,
  } = useAccount();
  
  const { 
    connect: wagmiConnect, 
    connectors: evmConnectors,
    isPending: connectIsPending,
    error: connectError,
  } = useConnect();
  
  const { 
    disconnect: wagmiDisconnect,
    isPending: disconnectIsPending,
  } = useDisconnect();
  
  const { 
    switchChain, 
    isPending: switchIsPending,
    error: switchError,
  } = useSwitchChain();

  // Get current chain ID from wagmi
  const currentChainId = useChainId();

  // Get store values
  const {
    wallets,
    activeWallet,
    currentNetwork,
    supportedNetworks,
    connect: storeConnect,
    disconnect: storeDisconnect,
    switchNetwork: storeSwitchNetwork,
    setActiveWallet,
  } = useWalletStore();

  // Derive connection states
  const isConnecting = evmIsConnecting || connectIsPending;
  const isReconnecting = evmIsReconnecting;
  const error = (connectError || switchError) ? new Error(String(connectError || switchError)) : undefined;
  const isConnected = evmIsConnected || wallets.some(w => w.chainFamily === 'solana');

  // ========================================
  // Sync wagmi state to Zustand store
  // ========================================
  useEffect(() => {
    if (evmIsConnected && evmAddress && evmConnector) {
      // Check if this wallet is already in store
      const existingWallet = wallets.find(w => 
        w.address.toLowerCase() === evmAddress.toLowerCase()
      );

      if (!existingWallet) {
        // Determine provider type from connector name
        let providerType: WalletProviderType = 'metamask';
        const connectorName = evmConnector.name.toLowerCase();
        
        if (connectorName.includes('walletconnect')) providerType = 'walletconnect';
        else if (connectorName.includes('coinbase')) providerType = 'coinbase';
        else if (connectorName.includes('safe')) providerType = 'safe';
        else if (connectorName.includes('phantom')) providerType = 'phantom';
        else if (connectorName.includes('rainbow')) providerType = 'rainbow';
        else if (connectorName.includes('trust')) providerType = 'trust';
        else if (connectorName.includes('ledger')) providerType = 'ledger';
        else if (connectorName.includes('trezor')) providerType = 'trezor';

        // Create new wallet entry
        const newWallet: ConnectedWallet = {
          id: `evm-${evmAddress.slice(0, 10)}-${Date.now()}`,
          address: evmAddress,
          chainId: evmChainId || 1,
          chainFamily: 'evm',
          provider: providerType,
          label: `${evmConnector.name} Wallet`,
          isActive: true,
          connectedAt: Date.now(),
        };

        // Get network config
        const network = getNetworkByChainId(evmChainId || 1);

        storeConnect(providerType, {
          wallet: newWallet,
          network: network || undefined,
        });
      }

      // Update current network from wagmi chainId
      if (evmChainId) {
        const network = getNetworkByChainId(evmChainId);
        if (network && (!currentNetwork || currentNetwork.chainId !== evmChainId)) {
          storeSwitchNetwork(evmChainId, network);
        }
      }
    } else if (!evmIsConnected && activeWallet?.chainFamily === 'evm') {
      // EVM wallet disconnected
      storeDisconnect(activeWallet.id);
    }
  }, [evmIsConnected, evmAddress, evmConnector, evmChainId]);

  // ========================================
  // Initialize on mount
  // ========================================
  useEffect(() => {
    if (isInitialized) return;

    const initialize = async () => {
      // Set default network if not set
      if (!currentNetwork && defaultNetwork !== undefined && defaultNetwork !== undefined) {
        const defaultNet = getNetworkByChainId(defaultNetwork);
        if (defaultNet) {
          useWalletStore.setState({ currentNetwork: defaultNet });
        }
      }

      setIsInitialized(true);
    };

    initialize();
  }, [isInitialized, defaultNetwork, currentNetwork]);

  // ========================================
  // Provider detection with enhanced checks
  // ========================================
  const isProviderInstalled = useCallback((provider: WalletProviderType) => {
    // Check using our provider detection utilities
    if (provider === 'phantom') return isPhantomInstalled();
    if (provider === 'solflare') return isSolflareInstalled();
    return isWalletInstalled(provider);
  }, []);

  // Get all detected wallets
  const getDetectedWallets = useCallback(() => {
    const evm: string[] = [];
    const solana: string[] = [];

    // Check EVM wallets
    if (isWalletInstalled('metamask')) evm.push('metamask');
    if (isWalletInstalled('coinbase')) evm.push('coinbase');
    if (isWalletInstalled('trust')) evm.push('trust');
    if (isWalletInstalled('rainbow')) evm.push('rainbow');
    
    // Check Solana wallets
    if (isPhantomInstalled()) solana.push('phantom');
    if (isSolflareInstalled()) solana.push('solflare');

    return { evm, solana };
  }, []);

  // ========================================
  // Modal controls
  // ========================================
  const openConnectModal = useCallback(() => {
    setIsConnectModalOpen(true);
  }, []);

  const closeConnectModal = useCallback(() => {
    setIsConnectModalOpen(false);
  }, []);

  // ========================================
  // Connect handler - Real wallet connection
  // ========================================
  const handleConnect = useCallback(async (provider: WalletProviderType) => {
    try {
      // Determine if this is an EVM or Solana provider
      const solanaProviders: WalletProviderType[] = ['phantom', 'solflare'];
      const isSolanaProvider = solanaProviders.includes(provider);

      if (isSolanaProvider) {
        // Detect Solana wallets and find the one matching the provider
        const detectedWallets = detectSolanaWallets();
        const solanaWallet = detectedWallets.find(w => 
          w.name.toLowerCase().includes(provider)
        );
        
        if (!solanaWallet) {
          throw new Error(`${provider} wallet not detected. Please install the wallet extension.`);
        }
        
        // Connect Solana wallet using our Solana adapter
        const result = await connectSolanaWallet(solanaWallet);
        
        if (result) {
          const newWallet: ConnectedWallet = {
            id: `solana-${result.publicKey.slice(0, 10)}-${Date.now()}`,
            address: result.publicKey,
            chainId: 'solana-mainnet',
            chainFamily: 'solana',
            provider: provider,
            label: `${provider.charAt(0).toUpperCase() + provider.slice(1)} Wallet`,
            isActive: true,
            connectedAt: Date.now(),
          };

          const network = getNetworkByChainId('solana-mainnet');
          storeConnect(provider, {
            wallet: newWallet,
            network: network || undefined,
          });
        }
      } else {
        // Connect EVM wallet using wagmi
        // Find the appropriate connector
        let connector = evmConnectors.find(c => {
          const name = c.name.toLowerCase();
          switch (provider) {
            case 'metamask': return name.includes('metamask') || c.id === 'injected';
            case 'walletconnect': return name.includes('walletconnect');
            case 'coinbase': return name.includes('coinbase');
            case 'safe': return name.includes('safe');
            default: return name.includes(provider);
          }
        });

        // Fallback to injected connector for unknown providers
        if (!connector) {
          connector = evmConnectors.find(c => c.id === 'injected');
        }

        if (connector) {
          wagmiConnect({ connector });
        } else {
          throw new Error(`No connector found for provider: ${provider}`);
        }
      }

      closeConnectModal();
    } catch (err) {
      console.error('Connection failed:', err);
      throw err;
    }
  }, [evmConnectors, wagmiConnect, storeConnect, closeConnectModal]);

  // ========================================
  // Disconnect handler
  // ========================================
  const handleDisconnect = useCallback(async (walletId?: string) => {
    try {
      const walletToDisconnect = walletId 
        ? wallets.find(w => w.id === walletId)
        : activeWallet;

      if (!walletToDisconnect) return;

      if (walletToDisconnect.chainFamily === 'solana') {
        // Detect Solana wallets and find the one matching the provider
        const detectedWallets = detectSolanaWallets();
        const solanaWallet = detectedWallets.find(w => 
          w.name.toLowerCase().includes(walletToDisconnect.provider)
        );
        
        if (solanaWallet) {
          await disconnectSolanaWallet(solanaWallet);
        }
        storeDisconnect(walletToDisconnect.id);
      } else {
        // Disconnect EVM wallet using wagmi
        wagmiDisconnect();
        storeDisconnect(walletToDisconnect.id);
      }
    } catch (err) {
      console.error('Disconnect failed:', err);
      throw err;
    }
  }, [wallets, activeWallet, wagmiDisconnect, storeDisconnect]);

  // ========================================
  // Switch network handler
  // ========================================
  const handleSwitchNetwork = useCallback(async (chainId: number | string) => {
    try {
      const network = getNetworkByChainId(chainId);
      
      if (!network) {
        throw new Error(`Network not found for chainId: ${chainId}`);
      }

      if (network.family === 'evm' && typeof chainId === 'number') {
        // Use wagmi to switch EVM chains
        switchChain({ chainId });
      } else if (network.family === 'solana') {
        // Solana doesn't have network switching in the same way
        // Just update the store
        storeSwitchNetwork(chainId, network);
      } else {
        // For other chains, just update the store
        storeSwitchNetwork(chainId, network);
      }
    } catch (err) {
      console.error('Network switch failed:', err);
      throw err;
    }
  }, [switchChain, storeSwitchNetwork]);

  // ========================================
  // Build context value
  // ========================================
  const value: WalletContextValue = {
    // Connection state
    isConnected,
    isConnecting,
    isReconnecting,
    error,
    
    // Wallets
    wallets,
    activeWallet,
    
    // Network
    currentNetwork,
    supportedNetworks,
    chainId: evmChainId || currentChainId,
    
    // EVM-specific
    evmAddress,
    evmConnector,
    evmConnectors,
    
    // Actions
    connect: handleConnect,
    disconnect: handleDisconnect,
    switchNetwork: handleSwitchNetwork,
    setActiveWallet,
    
    // Provider detection
    isProviderInstalled,
    getDetectedWallets,
    
    // Modal controls
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
