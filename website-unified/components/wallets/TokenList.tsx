/**
 * Token List Component
 * 
 * Display all ERC-20/SPL tokens with balances, prices, and actions
 * 
 * @author Nich (@nichxbt)
 * @license Apache-2.0
 */

'use client';

import React, { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Search,
  SlidersHorizontal,
  ArrowUpDown,
  TrendingUp,
  TrendingDown,
  Eye,
  EyeOff,
  Plus,
  ExternalLink,
  Send,
  MoreVertical,
} from 'lucide-react';
import { useWallet } from '@/providers/WalletProvider';
import { useTokenBalances } from '@/lib/wallets/hooks';
import { useWalletStore } from '@/lib/wallets/store';
import { TokenBalance } from '@/lib/wallets/types';
import { formatBalance, formatUsd, formatPercentChange, getExplorerTokenUrl } from '@/lib/wallets/utils';
import { cn } from '@/lib/utils';

// ============================================
// Types
// ============================================

type SortKey = 'value' | 'name' | 'change';
type SortOrder = 'asc' | 'desc';

interface TokenListProps {
  className?: string;
}

// ============================================
// Token Row Component
// ============================================

interface TokenRowProps {
  token: TokenBalance;
  onSend?: () => void;
  onHide?: () => void;
}

function TokenRow({ token, onSend, onHide }: TokenRowProps) {
  const [showActions, setShowActions] = useState(false);
  const { currentNetwork } = useWallet();

  const priceChange = token.token.priceChange24h || 0;
  const isPositive = priceChange >= 0;

  const openExplorer = () => {
    if (currentNetwork && token.token.address) {
      const url = getExplorerTokenUrl(currentNetwork, token.token.address);
      window.open(url, '_blank');
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className={cn(
        'flex items-center gap-4 p-4 hover:bg-gray-50 dark:hover:bg-gray-800/50',
        'transition-colors border-b border-gray-100 dark:border-gray-800 last:border-b-0'
      )}
      onMouseEnter={() => setShowActions(true)}
      onMouseLeave={() => setShowActions(false)}
    >
      {/* Token Icon */}
      <div className="relative">
        <div className="w-10 h-10 rounded-full bg-gray-100 dark:bg-gray-800 flex items-center justify-center overflow-hidden">
          {token.token.logoUri ? (
            <img
              src={token.token.logoUri}
              alt={token.token.symbol}
              className="w-full h-full object-cover"
              onError={(e) => {
                (e.target as HTMLImageElement).src = '/icons/tokens/default.svg';
              }}
            />
          ) : (
            <span className="text-sm font-bold text-gray-500">
              {token.token.symbol.slice(0, 2)}
            </span>
          )}
        </div>
        {token.token.isNative && (
          <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-blue-500 rounded-full flex items-center justify-center">
            <span className="text-[8px] text-white font-bold">N</span>
          </div>
        )}
      </div>

      {/* Token Info */}
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2">
          <span className="font-medium text-gray-900 dark:text-white">
            {token.token.symbol}
          </span>
          <span className="text-sm text-gray-500 dark:text-gray-400 truncate">
            {token.token.name}
          </span>
        </div>
        <div className="text-sm text-gray-500">
          {token.balanceFormatted} {token.token.symbol}
        </div>
      </div>

      {/* Price & Change */}
      <div className="text-right">
        <div className="font-medium text-gray-900 dark:text-white">
          {token.token.priceUsd ? formatUsd(token.token.priceUsd) : '-'}
        </div>
        <div className={cn(
          'flex items-center justify-end gap-1 text-sm',
          isPositive ? 'text-green-500' : 'text-red-500'
        )}>
          {isPositive ? (
            <TrendingUp className="w-3 h-3" />
          ) : (
            <TrendingDown className="w-3 h-3" />
          )}
          {formatPercentChange(priceChange)}
        </div>
      </div>

      {/* Value */}
      <div className="w-32 text-right">
        <div className="font-semibold text-gray-900 dark:text-white">
          {formatUsd(token.valueUsd)}
        </div>
      </div>

      {/* Actions */}
      <div className={cn(
        'flex items-center gap-1 transition-opacity',
        showActions ? 'opacity-100' : 'opacity-0'
      )}>
        <button
          onClick={onSend}
          className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-500 hover:text-blue-500 transition-colors"
          title="Send"
        >
          <Send className="w-4 h-4" />
        </button>
        <button
          onClick={openExplorer}
          className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-500 hover:text-blue-500 transition-colors"
          title="View on explorer"
        >
          <ExternalLink className="w-4 h-4" />
        </button>
        <button
          onClick={onHide}
          className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-500 hover:text-gray-700 transition-colors"
          title="Hide token"
        >
          <EyeOff className="w-4 h-4" />
        </button>
      </div>
    </motion.div>
  );
}

// ============================================
// Main Component
// ============================================

export function TokenList({ className }: TokenListProps) {
  const { activeWallet, currentNetwork } = useWallet();
  const settings = useWalletStore(state => state.settings);
  const hideToken = useWalletStore(state => state.hideToken);

  const { balances, isLoading, error } = useTokenBalances(
    activeWallet?.address,
    currentNetwork?.chainId
  );

  const [searchQuery, setSearchQuery] = useState('');
  const [sortKey, setSortKey] = useState<SortKey>('value');
  const [sortOrder, setSortOrder] = useState<SortOrder>('desc');
  const [showFilters, setShowFilters] = useState(false);
  const [hideSmallBalances, setHideSmallBalances] = useState(settings.hideSmallBalances);
  const [showAddToken, setShowAddToken] = useState(false);

  // Filter and sort tokens
  const filteredTokens = useMemo(() => {
    let filtered = [...balances];

    // Search filter
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(
        t =>
          t.token.name.toLowerCase().includes(query) ||
          t.token.symbol.toLowerCase().includes(query) ||
          t.token.address.toLowerCase().includes(query)
      );
    }

    // Hide small balances
    if (hideSmallBalances) {
      filtered = filtered.filter(t => t.valueUsd >= settings.smallBalanceThreshold);
    }

    // Sort
    filtered.sort((a, b) => {
      let comparison = 0;
      switch (sortKey) {
        case 'value':
          comparison = a.valueUsd - b.valueUsd;
          break;
        case 'name':
          comparison = a.token.name.localeCompare(b.token.name);
          break;
        case 'change':
          comparison = (a.token.priceChange24h || 0) - (b.token.priceChange24h || 0);
          break;
      }
      return sortOrder === 'asc' ? comparison : -comparison;
    });

    return filtered;
  }, [balances, searchQuery, sortKey, sortOrder, hideSmallBalances, settings.smallBalanceThreshold]);

  // Toggle sort
  const toggleSort = (key: SortKey) => {
    if (sortKey === key) {
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
    } else {
      setSortKey(key);
      setSortOrder('desc');
    }
  };

  // Handle hide token
  const handleHideToken = (token: TokenBalance) => {
    hideToken(token.token.address, token.chainId);
  };

  // Loading state
  if (isLoading) {
    return (
      <div className={cn('p-6', className)}>
        <div className="space-y-4">
          {[1, 2, 3, 4, 5].map((i) => (
            <div key={i} className="flex items-center gap-4 animate-pulse">
              <div className="w-10 h-10 rounded-full bg-gray-200 dark:bg-gray-700" />
              <div className="flex-1">
                <div className="h-4 w-24 bg-gray-200 dark:bg-gray-700 rounded mb-2" />
                <div className="h-3 w-16 bg-gray-200 dark:bg-gray-700 rounded" />
              </div>
              <div className="h-4 w-20 bg-gray-200 dark:bg-gray-700 rounded" />
            </div>
          ))}
        </div>
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <div className={cn('p-6 text-center', className)}>
        <p className="text-red-500">Failed to load tokens</p>
        <p className="text-sm text-gray-500 mt-1">{error.message}</p>
      </div>
    );
  }

  return (
    <div className={className}>
      {/* Header */}
      <div className="p-4 border-b border-gray-200 dark:border-gray-800">
        <div className="flex items-center gap-4">
          {/* Search */}
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input
              type="text"
              placeholder="Search tokens..."
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

          {/* Filters Toggle */}
          <button
            onClick={() => setShowFilters(!showFilters)}
            className={cn(
              'p-2 rounded-xl border transition-colors',
              showFilters
                ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20 text-blue-500'
                : 'border-gray-200 dark:border-gray-700 text-gray-500 hover:bg-gray-100 dark:hover:bg-gray-800'
            )}
          >
            <SlidersHorizontal className="w-5 h-5" />
          </button>

          {/* Add Token */}
          <button
            onClick={() => setShowAddToken(true)}
            className="flex items-center gap-2 px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-xl transition-colors"
          >
            <Plus className="w-4 h-4" />
            Add Token
          </button>
        </div>

        {/* Filter Options */}
        <AnimatePresence>
          {showFilters && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              className="overflow-hidden"
            >
              <div className="flex items-center gap-4 mt-4 pt-4 border-t border-gray-200 dark:border-gray-800">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={hideSmallBalances}
                    onChange={(e) => setHideSmallBalances(e.target.checked)}
                    className="w-4 h-4 rounded border-gray-300 text-blue-500 focus:ring-blue-500"
                  />
                  <span className="text-sm text-gray-700 dark:text-gray-300">
                    Hide small balances (&lt;${settings.smallBalanceThreshold})
                  </span>
                </label>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Table Header */}
      <div className="flex items-center gap-4 px-4 py-3 bg-gray-50 dark:bg-gray-800/50 text-sm text-gray-500 dark:text-gray-400">
        <div className="w-10" /> {/* Icon spacer */}
        <button
          onClick={() => toggleSort('name')}
          className="flex-1 flex items-center gap-1 hover:text-gray-900 dark:hover:text-white"
        >
          Token
          {sortKey === 'name' && (
            <ArrowUpDown className={cn('w-3 h-3', sortOrder === 'asc' && 'rotate-180')} />
          )}
        </button>
        <button
          onClick={() => toggleSort('change')}
          className="w-24 flex items-center gap-1 justify-end hover:text-gray-900 dark:hover:text-white"
        >
          Price
          {sortKey === 'change' && (
            <ArrowUpDown className={cn('w-3 h-3', sortOrder === 'asc' && 'rotate-180')} />
          )}
        </button>
        <button
          onClick={() => toggleSort('value')}
          className="w-32 flex items-center gap-1 justify-end hover:text-gray-900 dark:hover:text-white"
        >
          Value
          {sortKey === 'value' && (
            <ArrowUpDown className={cn('w-3 h-3', sortOrder === 'asc' && 'rotate-180')} />
          )}
        </button>
        <div className="w-24" /> {/* Actions spacer */}
      </div>

      {/* Token List */}
      <div className="divide-y divide-gray-100 dark:divide-gray-800">
        <AnimatePresence>
          {filteredTokens.length === 0 ? (
            <div className="p-8 text-center text-gray-500">
              {searchQuery ? 'No tokens match your search' : 'No tokens found'}
            </div>
          ) : (
            filteredTokens.map((token) => (
              <TokenRow
                key={`${token.token.address}-${token.chainId}`}
                token={token}
                onHide={() => handleHideToken(token)}
              />
            ))
          )}
        </AnimatePresence>
      </div>

      {/* Summary */}
      <div className="p-4 bg-gray-50 dark:bg-gray-800/50 border-t border-gray-200 dark:border-gray-800">
        <div className="flex items-center justify-between text-sm">
          <span className="text-gray-500">
            {filteredTokens.length} token{filteredTokens.length !== 1 && 's'}
          </span>
          <span className="font-medium text-gray-900 dark:text-white">
            Total: {formatUsd(filteredTokens.reduce((sum, t) => sum + t.valueUsd, 0))}
          </span>
        </div>
      </div>
    </div>
  );
}

export default TokenList;
