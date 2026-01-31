/**
 * Transaction History Component
 * 
 * Complete transaction history with filters and details
 * 
 * @author Nich (@nichxbt)
 * @license Apache-2.0
 */

'use client';

import React, { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  ArrowUpRight,
  ArrowDownLeft,
  RefreshCw,
  ArrowLeftRight,
  FileCheck,
  Coins,
  Flame,
  Link as LinkIcon,
  FileCode,
  Image as ImageIcon,
  HelpCircle,
  Search,
  Filter,
  Calendar,
  ExternalLink,
  Copy,
  Check,
  ChevronDown,
  Clock,
  AlertCircle,
  CheckCircle,
  XCircle,
  Loader2,
} from 'lucide-react';
import { useWallet } from '@/providers/WalletProvider';
import { useTransactionHistory } from '@/lib/wallets/hooks';
import { Transaction, TransactionType, TransactionStatus } from '@/lib/wallets/types';
import { 
  formatUsd, 
  formatBalance, 
  formatRelativeTime, 
  truncateAddress,
  copyToClipboard,
  getExplorerTxUrl,
} from '@/lib/wallets/utils';
import { cn } from '@/lib/utils';

// ============================================
// Types
// ============================================

interface TransactionHistoryProps {
  className?: string;
  limit?: number;
}

// ============================================
// Helper Functions
// ============================================

function getTransactionIcon(type: TransactionType) {
  const icons: Record<TransactionType, React.ReactNode> = {
    send: <ArrowUpRight className="w-4 h-4" />,
    receive: <ArrowDownLeft className="w-4 h-4" />,
    swap: <ArrowLeftRight className="w-4 h-4" />,
    approve: <FileCheck className="w-4 h-4" />,
    mint: <Coins className="w-4 h-4" />,
    burn: <Flame className="w-4 h-4" />,
    stake: <Coins className="w-4 h-4" />,
    unstake: <Coins className="w-4 h-4" />,
    bridge: <LinkIcon className="w-4 h-4" />,
    contract: <FileCode className="w-4 h-4" />,
    nft_transfer: <ImageIcon className="w-4 h-4" />,
    unknown: <HelpCircle className="w-4 h-4" />,
  };
  return icons[type] || icons.unknown;
}

function getTransactionColor(type: TransactionType): string {
  const colors: Record<TransactionType, string> = {
    send: 'bg-red-100 text-red-600 dark:bg-red-900/30 dark:text-red-400',
    receive: 'bg-green-100 text-green-600 dark:bg-green-900/30 dark:text-green-400',
    swap: 'bg-purple-100 text-purple-600 dark:bg-purple-900/30 dark:text-purple-400',
    approve: 'bg-yellow-100 text-yellow-600 dark:bg-yellow-900/30 dark:text-yellow-400',
    mint: 'bg-blue-100 text-blue-600 dark:bg-blue-900/30 dark:text-blue-400',
    burn: 'bg-orange-100 text-orange-600 dark:bg-orange-900/30 dark:text-orange-400',
    stake: 'bg-teal-100 text-teal-600 dark:bg-teal-900/30 dark:text-teal-400',
    unstake: 'bg-teal-100 text-teal-600 dark:bg-teal-900/30 dark:text-teal-400',
    bridge: 'bg-indigo-100 text-indigo-600 dark:bg-indigo-900/30 dark:text-indigo-400',
    contract: 'bg-gray-100 text-gray-600 dark:bg-gray-800 dark:text-gray-400',
    nft_transfer: 'bg-pink-100 text-pink-600 dark:bg-pink-900/30 dark:text-pink-400',
    unknown: 'bg-gray-100 text-gray-600 dark:bg-gray-800 dark:text-gray-400',
  };
  return colors[type] || colors.unknown;
}

function getStatusIcon(status: TransactionStatus) {
  switch (status) {
    case 'confirmed':
      return <CheckCircle className="w-4 h-4 text-green-500" />;
    case 'pending':
    case 'confirming':
      return <Loader2 className="w-4 h-4 text-yellow-500 animate-spin" />;
    case 'failed':
      return <XCircle className="w-4 h-4 text-red-500" />;
    case 'cancelled':
    case 'replaced':
      return <AlertCircle className="w-4 h-4 text-gray-500" />;
  }
}

function getTransactionLabel(type: TransactionType): string {
  const labels: Record<TransactionType, string> = {
    send: 'Sent',
    receive: 'Received',
    swap: 'Swapped',
    approve: 'Approved',
    mint: 'Minted',
    burn: 'Burned',
    stake: 'Staked',
    unstake: 'Unstaked',
    bridge: 'Bridged',
    contract: 'Contract Call',
    nft_transfer: 'NFT Transfer',
    unknown: 'Transaction',
  };
  return labels[type] || labels.unknown;
}

// ============================================
// Transaction Row Component
// ============================================

interface TransactionRowProps {
  transaction: Transaction;
  isExpanded: boolean;
  onToggle: () => void;
}

function TransactionRow({ transaction, isExpanded, onToggle }: TransactionRowProps) {
  const { currentNetwork } = useWallet();
  const [copiedHash, setCopiedHash] = useState(false);

  const handleCopyHash = async () => {
    await copyToClipboard(transaction.hash);
    setCopiedHash(true);
    setTimeout(() => setCopiedHash(false), 2000);
  };

  const openExplorer = () => {
    if (currentNetwork) {
      const url = getExplorerTxUrl(currentNetwork, transaction.hash);
      window.open(url, '_blank');
    }
  };

  return (
    <div className="border-b border-gray-100 dark:border-gray-800 last:border-b-0">
      {/* Main Row */}
      <div
        onClick={onToggle}
        className={cn(
          'flex items-center gap-4 p-4 cursor-pointer transition-colors',
          'hover:bg-gray-50 dark:hover:bg-gray-800/50',
          isExpanded && 'bg-gray-50 dark:bg-gray-800/50'
        )}
      >
        {/* Type Icon */}
        <div className={cn(
          'w-10 h-10 rounded-full flex items-center justify-center',
          getTransactionColor(transaction.type)
        )}>
          {getTransactionIcon(transaction.type)}
        </div>

        {/* Transaction Info */}
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2">
            <span className="font-medium text-gray-900 dark:text-white">
              {getTransactionLabel(transaction.type)}
            </span>
            {getStatusIcon(transaction.status)}
          </div>
          <div className="flex items-center gap-2 text-sm text-gray-500">
            <span>
              {transaction.type === 'receive' ? 'From' : 'To'}: {truncateAddress(transaction.type === 'receive' ? transaction.from : transaction.to)}
            </span>
            <span>•</span>
            <span className="flex items-center gap-1">
              <Clock className="w-3 h-3" />
              {transaction.blockTimestamp 
                ? formatRelativeTime(transaction.blockTimestamp)
                : 'Pending'}
            </span>
          </div>
        </div>

        {/* Value */}
        <div className="text-right">
          <div className={cn(
            'font-medium',
            transaction.type === 'receive'
              ? 'text-green-600 dark:text-green-400'
              : 'text-gray-900 dark:text-white'
          )}>
            {transaction.type === 'receive' ? '+' : '-'}
            {transaction.valueFormatted} {transaction.token?.symbol || 'ETH'}
          </div>
          {transaction.valueUsd && (
            <div className="text-sm text-gray-500">
              {formatUsd(transaction.valueUsd)}
            </div>
          )}
        </div>

        {/* Expand Arrow */}
        <ChevronDown
          className={cn(
            'w-5 h-5 text-gray-400 transition-transform',
            isExpanded && 'rotate-180'
          )}
        />
      </div>

      {/* Expanded Details */}
      <AnimatePresence>
        {isExpanded && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="overflow-hidden"
          >
            <div className="px-4 pb-4 pt-0">
              <div className="bg-gray-100 dark:bg-gray-800 rounded-xl p-4 space-y-3">
                {/* Transaction Hash */}
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-500">Transaction Hash</span>
                  <div className="flex items-center gap-2">
                    <code className="text-sm text-gray-900 dark:text-white font-mono">
                      {truncateAddress(transaction.hash, 12, 10)}
                    </code>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleCopyHash();
                      }}
                      className="p-1 hover:bg-gray-200 dark:hover:bg-gray-700 rounded"
                    >
                      {copiedHash ? (
                        <Check className="w-4 h-4 text-green-500" />
                      ) : (
                        <Copy className="w-4 h-4 text-gray-400" />
                      )}
                    </button>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        openExplorer();
                      }}
                      className="p-1 hover:bg-gray-200 dark:hover:bg-gray-700 rounded"
                    >
                      <ExternalLink className="w-4 h-4 text-gray-400" />
                    </button>
                  </div>
                </div>

                {/* From/To */}
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-500">From</span>
                  <code className="text-sm text-gray-900 dark:text-white font-mono">
                    {truncateAddress(transaction.from, 10, 8)}
                  </code>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-500">To</span>
                  <code className="text-sm text-gray-900 dark:text-white font-mono">
                    {truncateAddress(transaction.to, 10, 8)}
                  </code>
                </div>

                {/* Block & Confirmations */}
                {transaction.blockNumber && (
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-500">Block</span>
                    <span className="text-sm text-gray-900 dark:text-white">
                      {transaction.blockNumber.toLocaleString()}
                    </span>
                  </div>
                )}
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-500">Confirmations</span>
                  <span className="text-sm text-gray-900 dark:text-white">
                    {transaction.confirmations.toLocaleString()}
                  </span>
                </div>

                {/* Gas */}
                {transaction.gasUsed && transaction.gasPrice && (
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-500">Gas Fee</span>
                    <span className="text-sm text-gray-900 dark:text-white">
                      {transaction.gasCostUsd 
                        ? formatUsd(transaction.gasCostUsd)
                        : `${formatBalance(transaction.gasUsed * transaction.gasPrice, 18)} ETH`}
                    </span>
                  </div>
                )}

                {/* Nonce */}
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-500">Nonce</span>
                  <span className="text-sm text-gray-900 dark:text-white">
                    {transaction.nonce}
                  </span>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

// ============================================
// Main Component
// ============================================

export function TransactionHistory({ className, limit }: TransactionHistoryProps) {
  const { activeWallet, currentNetwork } = useWallet();
  const { transactions, isLoading, error, hasMore, loadMore } = useTransactionHistory(
    activeWallet?.address,
    { chainId: currentNetwork?.chainId, limit }
  );

  const [searchQuery, setSearchQuery] = useState('');
  const [typeFilter, setTypeFilter] = useState<TransactionType | 'all'>('all');
  const [expandedTx, setExpandedTx] = useState<string | null>(null);
  const [showFilters, setShowFilters] = useState(false);

  // Filter transactions
  const filteredTransactions = useMemo(() => {
    let filtered = [...transactions];

    // Type filter
    if (typeFilter !== 'all') {
      filtered = filtered.filter(tx => tx.type === typeFilter);
    }

    // Search filter
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(
        tx =>
          tx.hash.toLowerCase().includes(query) ||
          tx.from.toLowerCase().includes(query) ||
          tx.to.toLowerCase().includes(query)
      );
    }

    return filtered;
  }, [transactions, typeFilter, searchQuery]);

  // Transaction type options
  const typeOptions: { value: TransactionType | 'all'; label: string }[] = [
    { value: 'all', label: 'All Types' },
    { value: 'send', label: 'Sent' },
    { value: 'receive', label: 'Received' },
    { value: 'swap', label: 'Swaps' },
    { value: 'approve', label: 'Approvals' },
    { value: 'contract', label: 'Contract Calls' },
    { value: 'nft_transfer', label: 'NFT Transfers' },
  ];

  // Loading state
  if (isLoading && transactions.length === 0) {
    return (
      <div className={cn('p-6', className)}>
        <div className="space-y-4">
          {[1, 2, 3, 4, 5].map((i) => (
            <div key={i} className="flex items-center gap-4 animate-pulse">
              <div className="w-10 h-10 rounded-full bg-gray-200 dark:bg-gray-700" />
              <div className="flex-1">
                <div className="h-4 w-32 bg-gray-200 dark:bg-gray-700 rounded mb-2" />
                <div className="h-3 w-48 bg-gray-200 dark:bg-gray-700 rounded" />
              </div>
              <div className="h-4 w-24 bg-gray-200 dark:bg-gray-700 rounded" />
            </div>
          ))}
        </div>
      </div>
    );
  }

  // Empty state
  if (transactions.length === 0) {
    return (
      <div className={cn('p-12 text-center', className)}>
        <div className="w-20 h-20 bg-gray-100 dark:bg-gray-800 rounded-full flex items-center justify-center mx-auto mb-4">
          <Clock className="w-10 h-10 text-gray-400" />
        </div>
        <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
          No Transactions
        </h3>
        <p className="text-gray-500 dark:text-gray-400">
          Your transaction history will appear here
        </p>
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
              placeholder="Search by hash or address..."
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

          {/* Type Filter */}
          <select
            value={typeFilter}
            onChange={(e) => setTypeFilter(e.target.value as TransactionType | 'all')}
            className={cn(
              'px-4 py-2 rounded-xl',
              'bg-gray-100 dark:bg-gray-800',
              'border border-gray-200 dark:border-gray-700',
              'text-gray-900 dark:text-white',
              'outline-none focus:border-blue-500'
            )}
          >
            {typeOptions.map(option => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>

          {/* Date Filter */}
          <button
            onClick={() => setShowFilters(!showFilters)}
            className={cn(
              'p-2 rounded-xl border transition-colors',
              showFilters
                ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20 text-blue-500'
                : 'border-gray-200 dark:border-gray-700 text-gray-500 hover:bg-gray-100 dark:hover:bg-gray-800'
            )}
          >
            <Calendar className="w-5 h-5" />
          </button>
        </div>
      </div>

      {/* Transaction List */}
      <div>
        <AnimatePresence>
          {filteredTransactions.length === 0 ? (
            <div className="p-8 text-center text-gray-500">
              No transactions match your filters
            </div>
          ) : (
            filteredTransactions.map((tx) => (
              <TransactionRow
                key={tx.hash}
                transaction={tx}
                isExpanded={expandedTx === tx.hash}
                onToggle={() => setExpandedTx(expandedTx === tx.hash ? null : tx.hash)}
              />
            ))
          )}
        </AnimatePresence>
      </div>

      {/* Load More */}
      {hasMore && (
        <div className="p-4 border-t border-gray-200 dark:border-gray-800">
          <button
            onClick={loadMore}
            disabled={isLoading}
            className={cn(
              'w-full py-3 text-center font-medium rounded-xl transition-colors',
              'bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700',
              'text-gray-700 dark:text-gray-300',
              isLoading && 'opacity-50 cursor-not-allowed'
            )}
          >
            {isLoading ? (
              <span className="flex items-center justify-center gap-2">
                <Loader2 className="w-4 h-4 animate-spin" />
                Loading...
              </span>
            ) : (
              'Load More'
            )}
          </button>
        </div>
      )}

      {/* Summary */}
      <div className="p-4 bg-gray-50 dark:bg-gray-800/50 border-t border-gray-200 dark:border-gray-800">
        <div className="flex items-center justify-between text-sm text-gray-500">
          <span>{filteredTransactions.length} transaction{filteredTransactions.length !== 1 && 's'}</span>
          <span>On {currentNetwork?.name || 'Unknown Network'}</span>
        </div>
      </div>
    </div>
  );
}

export default TransactionHistory;
