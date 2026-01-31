/**
 * Network Switcher
 * 
 * 60+ network support with categories, favorites, and health indicators
 * 
 * @author Nich (@nichxbt)
 * @license Apache-2.0
 */

'use client';

import React, { useState, useMemo, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  ChevronDown,
  Search,
  Star,
  StarOff,
  Check,
  Plus,
  Settings,
  Zap,
  Clock,
  AlertTriangle,
  ExternalLink,
  Fuel,
} from 'lucide-react';
import { useWallet } from '@/providers/WalletProvider';
import { useAvailableNetworks, useNetworkHealth } from '@/lib/wallets/hooks';
import { useWalletStore } from '@/lib/wallets/store';
import { NetworkConfig, NetworkType } from '@/lib/wallets/types';
import { formatGwei } from '@/lib/wallets/utils';
import { cn } from '@/lib/utils';

// ============================================
// Types
// ============================================

interface NetworkSwitcherProps {
  compact?: boolean;
  showHealth?: boolean;
  className?: string;
}

type TabType = 'all' | 'favorites' | 'mainnet' | 'l2' | 'testnet';

// ============================================
// Network Item Component
// ============================================

interface NetworkItemProps {
  network: NetworkConfig;
  isSelected: boolean;
  isFavorite: boolean;
  showHealth?: boolean;
  onSelect: () => void;
  onToggleFavorite: () => void;
}

function NetworkItem({
  network,
  isSelected,
  isFavorite,
  showHealth,
  onSelect,
  onToggleFavorite,
}: NetworkItemProps) {
  const { health, isLoading } = useNetworkHealth(showHealth ? network : undefined);

  return (
    <div
      className={cn(
        'flex items-center gap-3 p-3 rounded-xl cursor-pointer transition-all',
        'hover:bg-gray-100 dark:hover:bg-gray-800',
        isSelected && 'bg-blue-50 dark:bg-blue-900/30 border border-blue-200 dark:border-blue-800'
      )}
      onClick={onSelect}
    >
      {/* Network Icon */}
      <div
        className="w-10 h-10 rounded-full flex items-center justify-center"
        style={{ backgroundColor: network.color ? `${network.color}20` : '#f3f4f6' }}
      >
        <img
          src={network.iconUrl || '/icons/chains/default.svg'}
          alt={network.name}
          className="w-6 h-6"
          onError={(e) => {
            (e.target as HTMLImageElement).src = '/icons/chains/default.svg';
          }}
        />
      </div>

      {/* Network Info */}
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2">
          <span className="font-medium text-gray-900 dark:text-white truncate">
            {network.name}
          </span>
          {network.testnet && (
            <span className="px-1.5 py-0.5 text-xs bg-yellow-100 dark:bg-yellow-900 text-yellow-700 dark:text-yellow-300 rounded">
              Testnet
            </span>
          )}
          {network.type === 'l2' && (
            <span className="px-1.5 py-0.5 text-xs bg-blue-100 dark:bg-blue-900 text-blue-700 dark:text-blue-300 rounded">
              L2
            </span>
          )}
        </div>
        {showHealth && health && (
          <div className="flex items-center gap-3 mt-1 text-xs text-gray-500 dark:text-gray-400">
            <span className="flex items-center gap-1">
              <Fuel className="w-3 h-3" />
              {formatGwei(health.gasPrice)}
            </span>
            <span className="flex items-center gap-1">
              <Clock className="w-3 h-3" />
              {health.blockTime}s
            </span>
            <span className={cn(
              'flex items-center gap-1',
              health.isHealthy ? 'text-green-500' : 'text-red-500'
            )}>
              <span className={cn(
                'w-2 h-2 rounded-full',
                health.isHealthy ? 'bg-green-500' : 'bg-red-500'
              )} />
              {health.isHealthy ? 'Healthy' : 'Issues'}
            </span>
          </div>
        )}
      </div>

      {/* Actions */}
      <div className="flex items-center gap-2">
        <button
          onClick={(e) => {
            e.stopPropagation();
            onToggleFavorite();
          }}
          className={cn(
            'p-1.5 rounded-lg transition-colors',
            isFavorite
              ? 'text-yellow-500 hover:bg-yellow-100 dark:hover:bg-yellow-900/30'
              : 'text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800'
          )}
        >
          {isFavorite ? <Star className="w-4 h-4 fill-current" /> : <StarOff className="w-4 h-4" />}
        </button>
        {isSelected && (
          <div className="w-6 h-6 bg-blue-500 rounded-full flex items-center justify-center">
            <Check className="w-4 h-4 text-white" />
          </div>
        )}
      </div>
    </div>
  );
}

// ============================================
// Main Component
// ============================================

export function NetworkSwitcher({
  compact = false,
  showHealth = true,
  className,
}: NetworkSwitcherProps) {
  const { currentNetwork, switchNetwork } = useWallet();
  const { networks, categories, favorites } = useAvailableNetworks();
  const settings = useWalletStore(state => state.settings);
  const updateSettings = useWalletStore(state => state.updateSettings);

  const [isOpen, setIsOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [activeTab, setActiveTab] = useState<TabType>('all');
  const [showRpcConfig, setShowRpcConfig] = useState(false);

  const dropdownRef = useRef<HTMLDivElement>(null);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Filter networks based on search and tab
  const filteredNetworks = useMemo(() => {
    let filtered = networks;

    // Filter by tab
    switch (activeTab) {
      case 'favorites':
        filtered = favorites;
        break;
      case 'mainnet':
        filtered = networks.filter(n => n.type === 'mainnet');
        break;
      case 'l2':
        filtered = networks.filter(n => n.type === 'l2');
        break;
      case 'testnet':
        filtered = networks.filter(n => n.testnet);
        break;
    }

    // Filter by search
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(
        n =>
          n.name.toLowerCase().includes(query) ||
          n.shortName.toLowerCase().includes(query) ||
          n.nativeCurrency.symbol.toLowerCase().includes(query)
      );
    }

    return filtered;
  }, [networks, favorites, activeTab, searchQuery]);

  // Toggle favorite
  const toggleFavorite = (networkId: string) => {
    const currentFavorites = settings.favoriteNetworks;
    const newFavorites = currentFavorites.includes(networkId)
      ? currentFavorites.filter(id => id !== networkId)
      : [...currentFavorites, networkId];
    updateSettings({ favoriteNetworks: newFavorites });
  };

  // Handle network selection
  const handleNetworkSelect = async (network: NetworkConfig) => {
    try {
      await switchNetwork(network.chainId);
      setIsOpen(false);
    } catch (error) {
      console.error('Failed to switch network:', error);
      // Try to add the network to wallet
      if (typeof window !== 'undefined' && (window as any).ethereum) {
        try {
          await (window as any).ethereum.request({
            method: 'wallet_addEthereumChain',
            params: [
              {
                chainId: `0x${network.chainId.toString(16)}`,
                chainName: network.name,
                nativeCurrency: network.nativeCurrency,
                rpcUrls: [network.rpcUrls.default],
                blockExplorerUrls: [network.blockExplorers.default.url],
              },
            ],
          });
          await switchNetwork(network.chainId);
          setIsOpen(false);
        } catch (addError) {
          console.error('Failed to add network:', addError);
        }
      }
    }
  };

  return (
    <div ref={dropdownRef} className={cn('relative', className)}>
      {/* Trigger Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={cn(
          'flex items-center gap-2 px-3 py-2 rounded-xl border transition-all',
          'hover:bg-gray-100 dark:hover:bg-gray-800',
          'border-gray-200 dark:border-gray-700',
          isOpen && 'ring-2 ring-blue-500'
        )}
      >
        {currentNetwork ? (
          <>
            <div
              className="w-6 h-6 rounded-full flex items-center justify-center"
              style={{ backgroundColor: currentNetwork.color ? `${currentNetwork.color}20` : '#f3f4f6' }}
            >
              <img
                src={currentNetwork.iconUrl || '/icons/chains/default.svg'}
                alt={currentNetwork.name}
                className="w-4 h-4"
              />
            </div>
            {!compact && (
              <span className="font-medium text-gray-900 dark:text-white">
                {currentNetwork.shortName}
              </span>
            )}
          </>
        ) : (
          <>
            <div className="w-6 h-6 rounded-full bg-gray-200 dark:bg-gray-700" />
            {!compact && <span className="text-gray-500">Select Network</span>}
          </>
        )}
        <ChevronDown
          className={cn(
            'w-4 h-4 text-gray-500 transition-transform',
            isOpen && 'rotate-180'
          )}
        />
      </button>

      {/* Dropdown */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className={cn(
              'absolute top-full mt-2 right-0 z-50',
              'w-[380px] max-h-[500px]',
              'bg-white dark:bg-gray-900 rounded-2xl shadow-xl border border-gray-200 dark:border-gray-700',
              'overflow-hidden flex flex-col'
            )}
          >
            {/* Search */}
            <div className="p-4 border-b border-gray-200 dark:border-gray-700">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search networks..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className={cn(
                    'w-full pl-10 pr-4 py-2 rounded-xl',
                    'bg-gray-100 dark:bg-gray-800',
                    'border border-transparent focus:border-blue-500',
                    'text-gray-900 dark:text-white placeholder-gray-500',
                    'outline-none transition-colors'
                  )}
                />
              </div>
            </div>

            {/* Tabs */}
            <div className="flex gap-1 p-2 border-b border-gray-200 dark:border-gray-700 overflow-x-auto">
              {(['all', 'favorites', 'mainnet', 'l2', 'testnet'] as TabType[]).map((tab) => (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  className={cn(
                    'px-3 py-1.5 rounded-lg text-sm font-medium whitespace-nowrap transition-colors',
                    activeTab === tab
                      ? 'bg-blue-500 text-white'
                      : 'text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800'
                  )}
                >
                  {tab === 'favorites' && <Star className="w-3 h-3 inline mr-1" />}
                  {tab.charAt(0).toUpperCase() + tab.slice(1)}
                </button>
              ))}
            </div>

            {/* Network List */}
            <div className="flex-1 overflow-y-auto p-2 space-y-1">
              {filteredNetworks.length === 0 ? (
                <div className="text-center py-8 text-gray-500 dark:text-gray-400">
                  <p>No networks found</p>
                </div>
              ) : (
                filteredNetworks.map((network) => (
                  <NetworkItem
                    key={network.id}
                    network={network}
                    isSelected={currentNetwork?.id === network.id}
                    isFavorite={settings.favoriteNetworks.includes(network.id)}
                    showHealth={showHealth}
                    onSelect={() => handleNetworkSelect(network)}
                    onToggleFavorite={() => toggleFavorite(network.id)}
                  />
                ))
              )}
            </div>

            {/* Footer */}
            <div className="p-3 border-t border-gray-200 dark:border-gray-700 flex items-center justify-between">
              <button
                onClick={() => setShowRpcConfig(true)}
                className="flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300"
              >
                <Settings className="w-4 h-4" />
                Custom RPC
              </button>
              <button
                onClick={() => updateSettings({ showTestnets: !settings.showTestnets })}
                className="flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300"
              >
                {settings.showTestnets ? 'Hide' : 'Show'} Testnets
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

export default NetworkSwitcher;
