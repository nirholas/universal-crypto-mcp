/**
 * Wallet Store
 * 
 * Zustand store for wallet state management
 * 
 * @author Nich (@nichxbt)
 * @license Apache-2.0
 */

import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import {
  WalletStore,
  WalletState,
  WalletSettings,
  ConnectedWallet,
  Contact,
  PendingTransaction,
  NetworkConfig,
  WalletProviderType,
  TransactionRequest,
  TokenApproval,
  Token,
} from './types';
import { allNetworks, getNetworkByChainId } from './networks';

// Default settings
const defaultSettings: WalletSettings = {
  autoLockTimeout: 30,
  requireConfirmation: true,
  confirmationThreshold: 100,
  displayCurrency: 'USD',
  currency: 'USD',
  hideSmallBalances: true,
  hideZeroBalances: true,
  smallBalanceThreshold: 1,
  showTestnets: false,
  favoriteNetworks: ['ethereum', 'polygon', 'arbitrum', 'base', 'solana'],
  defaultGasSpeed: 'standard',
  theme: 'system',
  notifications: {
    transactions: true,
    approvals: true,
    security: true,
    price: false,
  },
};

// Initial state
const initialState: WalletState = {
  isConnecting: false,
  isConnected: false,
  isReconnecting: false,
  error: undefined,
  wallets: [],
  activeWallet: undefined,
  currentNetwork: undefined,
  supportedNetworks: allNetworks,
  networkHealth: undefined,
  portfolio: undefined,
  isLoadingPortfolio: false,
  pendingTransactions: [],
  settings: defaultSettings,
  recentAddresses: [],
  contacts: [],
};

/**
 * Wallet store with persistence
 */
export const useWalletStore = create<WalletStore>()(
  persist(
    (set, get) => ({
      ...initialState,

      // ============================================
      // Connection Actions
      // ============================================

      connect: async (provider: WalletProviderType, connectionData?: any) => {
        // This is now just a state setter - actual connection happens in WalletProvider
        // using wagmi hooks for EVM and Solana wallet adapter for Solana
        set({ isConnecting: true, error: undefined });

        try {
          if (!connectionData) {
            throw new Error('Connection data required');
          }

          const { wallet } = connectionData;

          set(state => ({
            isConnecting: false,
            isConnected: true,
            wallets: [...state.wallets.filter(w => w.address.toLowerCase() !== wallet.address.toLowerCase()), wallet],
            activeWallet: wallet,
            currentNetwork: getNetworkByChainId(wallet.chainId),
          }));

          // Store in localStorage for reconnection
          if (typeof localStorage !== 'undefined') {
            const connectedWallets = JSON.parse(localStorage.getItem('connected-wallets') || '[]');
            if (!connectedWallets.includes(provider)) {
              connectedWallets.push(provider);
              localStorage.setItem('connected-wallets', JSON.stringify(connectedWallets));
            }
          }

        } catch (error) {
          set({
            isConnecting: false,
            error: error instanceof Error ? error : new Error('Connection failed'),
          });
          throw error;
        }
      },

      disconnect: async (walletId?: string) => {
        // State update only - actual disconnect happens in WalletProvider
        const { wallets, activeWallet } = get();
        
        if (walletId) {
          // Disconnect specific wallet
          const updatedWallets = wallets.filter(w => w.id !== walletId);
          const newActiveWallet = activeWallet?.id === walletId 
            ? updatedWallets[0] 
            : activeWallet;

          set({
            wallets: updatedWallets,
            activeWallet: newActiveWallet,
            isConnected: updatedWallets.length > 0,
          });

          // Update localStorage
          if (typeof localStorage !== 'undefined') {
            const disconnectedWallet = wallets.find(w => w.id === walletId);
            if (disconnectedWallet) {
              const connectedWallets = JSON.parse(localStorage.getItem('connected-wallets') || '[]');
              const filtered = connectedWallets.filter((p: string) => p !== disconnectedWallet.provider);
              localStorage.setItem('connected-wallets', JSON.stringify(filtered));
            }
          }
        } else {
          // Disconnect all wallets
          set({
            wallets: [],
            activeWallet: undefined,
            isConnected: false,
            portfolio: undefined,
          });

          // Clear localStorage
          if (typeof localStorage !== 'undefined') {
            localStorage.removeItem('connected-wallets');
          }
        }
      },

      switchNetwork: async (chainId: number | string, newChainId?: number) => {
        // State update only - actual switch happens in WalletProvider via wagmi
        const network = getNetworkByChainId(chainId);
        if (!network) {
          throw new Error(`Network with chainId ${chainId} not found`);
        }

        const { activeWallet } = get();
        const finalChainId = newChainId || Number(chainId);
        
        // Update state
        set(state => ({
                  params: [{
                    chainId: `0x${Number(chainId).toString(16)}`,
                    chainName: network.name,
                    nativeCurrency: network.nativeCurrency,
                    rpcUrls: [network.rpcUrl],
                    blockExplorerUrls: network.blockExplorer ? [network.blockExplorer] : undefined,
                  }],
                });
              } else {
                throw switchError;
              }
            }
          }
        }

        set({ currentNetwork: network });
      },

      setActiveWallet: (walletId: string) => {
        const wallet = get().wallets.find(w => w.id === walletId);
        if (wallet) {
          set({
            activeWallet: wallet,
            currentNetwork: getNetworkByChainId(wallet.chainId),
          });
        }
      },

      // ============================================
      // Portfolio Actions
      // ============================================

      refreshPortfolio: async () => {
        set({ isLoadingPortfolio: true });

        try {
          // This would fetch portfolio data from APIs
          // Placeholder implementation
          await new Promise(resolve => setTimeout(resolve, 1000));

          set({
            isLoadingPortfolio: false,
            portfolio: {
              totalValueUsd: 0,
              change24h: 0,
              changePercent24h: 0,
              tokens: [],
              nfts: [],
              defiPositions: [],
              chainBreakdown: [],
              lastUpdated: new Date(),
            },
          });
        } catch (error) {
          set({ isLoadingPortfolio: false });
          throw error;
        }
      },

      hideToken: (tokenAddress: string, chainId: number | string) => {
        // Implementation would update hidden tokens list
        console.log('Hiding token:', tokenAddress, 'on chain:', chainId);
      },

      addCustomToken: async (token: Token) => {
        // Implementation would add custom token to portfolio
        console.log('Adding custom token:', token);
      },

      // ============================================
      // Transaction Actions
      // ============================================

      sendTransaction: async (request: TransactionRequest): Promise<string> => {
        // This would be replaced with actual transaction sending logic
        const mockHash = '0x' + Math.random().toString(16).substring(2);
        
        const pendingTx: PendingTransaction = {
          hash: mockHash,
          chainId: request.chainId,
          type: 'send',
          status: 'pending',
          from: request.from || get().activeWallet?.address || '',
          to: request.to,
          value: request.value || BigInt(0),
          valueFormatted: '0',
          nonce: request.nonce || 0,
          confirmations: 0,
          submittedAt: new Date(),
          canSpeedUp: true,
          canCancel: true,
        };

        set(state => ({
          pendingTransactions: [...state.pendingTransactions, pendingTx],
        }));

        return mockHash;
      },

      speedUpTransaction: async (hash: string): Promise<string> => {
        // Implementation would create replacement transaction with higher gas
        const newHash = '0x' + Math.random().toString(16).substring(2);
        
        set(state => ({
          pendingTransactions: state.pendingTransactions.map(tx =>
            tx.hash === hash ? { ...tx, status: 'replaced' as const } : tx
          ),
        }));

        return newHash;
      },

      cancelTransaction: async (hash: string): Promise<string> => {
        // Implementation would create 0-value self-send to cancel
        const newHash = '0x' + Math.random().toString(16).substring(2);
        
        set(state => ({
          pendingTransactions: state.pendingTransactions.map(tx =>
            tx.hash === hash ? { ...tx, status: 'cancelled' as const } : tx
          ),
        }));

        return newHash;
      },

      clearPendingTransactions: () => {
        set({ pendingTransactions: [] });
      },

      // ============================================
      // Settings Actions
      // ============================================

      updateSettings: (updates: Partial<WalletSettings>) => {
        set(state => ({
          settings: { ...state.settings, ...updates },
        }));
      },

      // ============================================
      // Contact Actions
      // ============================================

      addContact: (contactData): Contact => {
        const contact: Contact = {
          ...contactData,
          id: `contact-${Date.now()}`,
          createdAt: new Date(),
          updatedAt: new Date(),
        };

        set(state => ({
          contacts: [...state.contacts, contact],
        }));

        return contact;
      },

      updateContact: (id: string, updates: Partial<Contact>): Contact => {
        let updatedContact: Contact | undefined;

        set(state => ({
          contacts: state.contacts.map(c => {
            if (c.id === id) {
              updatedContact = { ...c, ...updates, updatedAt: new Date() };
              return updatedContact;
            }
            return c;
          }),
        }));

        if (!updatedContact) {
          throw new Error(`Contact ${id} not found`);
        }

        return updatedContact;
      },

      deleteContact: (id: string) => {
        set(state => ({
          contacts: state.contacts.filter(c => c.id !== id),
        }));
      },

      // ============================================
      // Approval Actions
      // ============================================

      revokeApproval: async (tokenAddress: string, spender: string): Promise<string> => {
        // Implementation would send revoke transaction (set approval to 0)
        const hash = '0x' + Math.random().toString(16).substring(2);
        console.log('Revoking approval for token:', tokenAddress, 'spender:', spender);
        
        // Simulate transaction delay
        await new Promise(resolve => setTimeout(resolve, 2000));
        
        return hash;
      },

      batchRevokeApprovals: async (approvals: Array<{ tokenAddress: string; spender: string }>): Promise<string[]> => {
        // Implementation would batch revoke transactions
        const hashes = approvals.map(() => '0x' + Math.random().toString(16).substring(2));
        
        // Simulate transaction delay
        await new Promise(resolve => setTimeout(resolve, 3000));
        
        return hashes;
      },
    }),
    {
      name: 'wallet-storage',
      storage: createJSONStorage(() => localStorage),
      partialize: (state) => ({
        settings: state.settings,
        contacts: state.contacts,
        recentAddresses: state.recentAddresses,
      }),
    }
  )
);

// ============================================
// Selector Hooks
// ============================================

export const useIsConnected = () => useWalletStore(state => state.isConnected);
export const useActiveWallet = () => useWalletStore(state => state.activeWallet);
export const useCurrentNetwork = () => useWalletStore(state => state.currentNetwork);
export const useWalletSettings = () => useWalletStore(state => state.settings);
export const useContacts = () => useWalletStore(state => state.contacts);
export const usePendingTransactions = () => useWalletStore(state => state.pendingTransactions);
export const usePortfolio = () => useWalletStore(state => state.portfolio);
