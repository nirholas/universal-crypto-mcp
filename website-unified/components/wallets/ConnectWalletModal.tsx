/**
 * Connect Wallet Modal
 * 
 * Multi-provider wallet connection modal supporting 10+ wallets
 * 
 * @author Nich (@nichxbt)
 * @license Apache-2.0
 */

'use client';

import React, { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  X, 
  ChevronRight, 
  ExternalLink, 
  Wallet, 
  Shield, 
  Smartphone,
  Clock,
  AlertCircle,
  CheckCircle,
  Loader2,
} from 'lucide-react';
import { useWallet } from '@/providers/WalletProvider';
import { 
  walletProviders, 
  getPopularWallets, 
  getHardwareWallets,
  getWalletProvidersByChain,
} from '@/lib/wallets/providers';
import { WalletProvider, WalletProviderType, ChainFamily } from '@/lib/wallets/types';
import { cn } from '@/lib/utils';

// ============================================
// Types
// ============================================

interface ConnectWalletModalProps {
  isOpen: boolean;
  onClose: () => void;
  defaultChainFamily?: ChainFamily;
}

type ConnectionState = 'idle' | 'connecting' | 'error' | 'success';

// ============================================
// Wallet Option Component
// ============================================

interface WalletOptionProps {
  provider: WalletProvider;
  isInstalled: boolean;
  isConnecting: boolean;
  isRecent: boolean;
  onConnect: () => void;
}

function WalletOption({ 
  provider, 
  isInstalled, 
  isConnecting, 
  isRecent,
  onConnect 
}: WalletOptionProps) {
  return (
    <button
      onClick={onConnect}
      disabled={isConnecting}
      className={cn(
        'flex items-center gap-4 w-full p-4 rounded-xl border transition-all',
        'hover:bg-gray-50 dark:hover:bg-gray-800',
        'focus:outline-none focus:ring-2 focus:ring-blue-500',
        isConnecting && 'opacity-50 cursor-not-allowed',
        'border-gray-200 dark:border-gray-700'
      )}
    >
      {/* Wallet Icon */}
      <div className="relative">
        <div className="w-12 h-12 rounded-xl bg-gray-100 dark:bg-gray-800 flex items-center justify-center">
          <img 
            src={provider.icon} 
            alt={provider.name}
            className="w-8 h-8"
            onError={(e) => {
              (e.target as HTMLImageElement).src = '/icons/wallets/default.svg';
            }}
          />
        </div>
        {isInstalled && (
          <div className="absolute -top-1 -right-1 w-4 h-4 bg-green-500 rounded-full flex items-center justify-center">
            <CheckCircle className="w-3 h-3 text-white" />
          </div>
        )}
      </div>

      {/* Wallet Info */}
      <div className="flex-1 text-left">
        <div className="flex items-center gap-2">
          <span className="font-medium text-gray-900 dark:text-white">
            {provider.name}
          </span>
          {isRecent && (
            <span className="px-2 py-0.5 text-xs bg-blue-100 dark:bg-blue-900 text-blue-700 dark:text-blue-300 rounded-full">
              Recent
            </span>
          )}
          {provider.isHardware && (
            <Shield className="w-4 h-4 text-gray-400" />
          )}
          {provider.isMultisig && (
            <span className="px-2 py-0.5 text-xs bg-purple-100 dark:bg-purple-900 text-purple-700 dark:text-purple-300 rounded-full">
              Multisig
            </span>
          )}
        </div>
        <p className="text-sm text-gray-500 dark:text-gray-400">
          {isInstalled ? 'Detected' : provider.description}
        </p>
      </div>

      {/* Action */}
      <div className="flex items-center">
        {isConnecting ? (
          <Loader2 className="w-5 h-5 text-blue-500 animate-spin" />
        ) : !isInstalled && provider.downloadUrl ? (
          <ExternalLink className="w-5 h-5 text-gray-400" />
        ) : (
          <ChevronRight className="w-5 h-5 text-gray-400" />
        )}
      </div>
    </button>
  );
}

// ============================================
// Main Modal Component
// ============================================

export function ConnectWalletModal({ 
  isOpen, 
  onClose,
  defaultChainFamily = 'evm',
}: ConnectWalletModalProps) {
  const { connect, isProviderInstalled, isConnecting } = useWallet();
  const [selectedChain, setSelectedChain] = useState<ChainFamily>(defaultChainFamily);
  const [connectionState, setConnectionState] = useState<ConnectionState>('idle');
  const [connectingProvider, setConnectingProvider] = useState<WalletProviderType | null>(null);
  const [error, setError] = useState<string | null>(null);

  // Get recent wallets from localStorage
  const recentWallets = useMemo(() => {
    if (typeof window === 'undefined') return [];
    const stored = localStorage.getItem('recent-wallets');
    return stored ? JSON.parse(stored) : [];
  }, []);

  // Filter providers by selected chain
  const availableProviders = useMemo(() => {
    return getWalletProvidersByChain(selectedChain);
  }, [selectedChain]);

  // Separate installed and other providers
  const { installed, other } = useMemo(() => {
    const installed: WalletProvider[] = [];
    const other: WalletProvider[] = [];

    availableProviders.forEach(provider => {
      if (isProviderInstalled(provider.id)) {
        installed.push(provider);
      } else {
        other.push(provider);
      }
    });

    return { installed, other };
  }, [availableProviders, isProviderInstalled]);

  // Handle wallet connection
  const handleConnect = async (providerId: WalletProviderType) => {
    const provider = walletProviders[providerId];
    
    // If not installed, open download page
    if (!isProviderInstalled(providerId) && provider.downloadUrl) {
      window.open(provider.downloadUrl, '_blank');
      return;
    }

    setConnectingProvider(providerId);
    setConnectionState('connecting');
    setError(null);

    try {
      await connect(providerId);
      setConnectionState('success');
      
      // Save to recent wallets
      const recent = [providerId, ...recentWallets.filter((w: string) => w !== providerId)].slice(0, 3);
      localStorage.setItem('recent-wallets', JSON.stringify(recent));
      
      // Close modal after brief success state
      setTimeout(() => {
        onClose();
        setConnectionState('idle');
        setConnectingProvider(null);
      }, 500);
    } catch (err) {
      setConnectionState('error');
      setError(err instanceof Error ? err.message : 'Connection failed');
      setConnectingProvider(null);
    }
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center">
        {/* Backdrop */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="absolute inset-0 bg-black/50 backdrop-blur-sm"
        />

        {/* Modal */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.95 }}
          className={cn(
            'relative z-10 w-full max-w-md mx-4',
            'bg-white dark:bg-gray-900 rounded-2xl shadow-xl',
            'max-h-[85vh] overflow-hidden flex flex-col'
          )}
        >
          {/* Header */}
          <div className="flex items-center justify-between p-6 border-b border-gray-200 dark:border-gray-700">
            <div className="flex items-center gap-3">
              <Wallet className="w-6 h-6 text-blue-500" />
              <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
                Connect Wallet
              </h2>
            </div>
            <button
              onClick={onClose}
              className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
            >
              <X className="w-5 h-5 text-gray-500" />
            </button>
          </div>

          {/* Chain Tabs */}
          <div className="flex gap-2 p-4 border-b border-gray-200 dark:border-gray-700">
            <button
              onClick={() => setSelectedChain('evm')}
              className={cn(
                'flex-1 py-2 px-4 rounded-lg font-medium transition-colors',
                selectedChain === 'evm'
                  ? 'bg-blue-500 text-white'
                  : 'bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300'
              )}
            >
              EVM Chains
            </button>
            <button
              onClick={() => setSelectedChain('solana')}
              className={cn(
                'flex-1 py-2 px-4 rounded-lg font-medium transition-colors',
                selectedChain === 'solana'
                  ? 'bg-purple-500 text-white'
                  : 'bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300'
              )}
            >
              Solana
            </button>
          </div>

          {/* Error Message */}
          {error && (
            <div className="mx-4 mt-4 p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-xl">
              <div className="flex items-center gap-2 text-red-700 dark:text-red-400">
                <AlertCircle className="w-5 h-5" />
                <span className="font-medium">Connection Failed</span>
              </div>
              <p className="mt-1 text-sm text-red-600 dark:text-red-400">{error}</p>
            </div>
          )}

          {/* Wallet List */}
          <div className="flex-1 overflow-y-auto p-4 space-y-6">
            {/* Installed Wallets */}
            {installed.length > 0 && (
              <div>
                <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-3 flex items-center gap-2">
                  <CheckCircle className="w-4 h-4" />
                  Detected Wallets
                </h3>
                <div className="space-y-2">
                  {installed.map(provider => (
                    <WalletOption
                      key={provider.id}
                      provider={provider}
                      isInstalled={true}
                      isConnecting={connectingProvider === provider.id}
                      isRecent={recentWallets.includes(provider.id)}
                      onConnect={() => handleConnect(provider.id)}
                    />
                  ))}
                </div>
              </div>
            )}

            {/* Other Wallets */}
            {other.length > 0 && (
              <div>
                <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-3 flex items-center gap-2">
                  <Smartphone className="w-4 h-4" />
                  Other Wallets
                </h3>
                <div className="space-y-2">
                  {other.map(provider => (
                    <WalletOption
                      key={provider.id}
                      provider={provider}
                      isInstalled={false}
                      isConnecting={connectingProvider === provider.id}
                      isRecent={recentWallets.includes(provider.id)}
                      onConnect={() => handleConnect(provider.id)}
                    />
                  ))}
                </div>
              </div>
            )}

            {/* Hardware Wallets */}
            {selectedChain === 'evm' && (
              <div>
                <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-3 flex items-center gap-2">
                  <Shield className="w-4 h-4" />
                  Hardware Wallets
                </h3>
                <div className="space-y-2">
                  {getHardwareWallets().map(provider => (
                    <WalletOption
                      key={provider.id}
                      provider={provider}
                      isInstalled={false}
                      isConnecting={connectingProvider === provider.id}
                      isRecent={false}
                      onConnect={() => handleConnect(provider.id)}
                    />
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Footer */}
          <div className="p-4 border-t border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800/50">
            <p className="text-xs text-center text-gray-500 dark:text-gray-400">
              By connecting a wallet, you agree to the Terms of Service and acknowledge that you have read the Privacy Policy.
            </p>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}

export default ConnectWalletModal;
