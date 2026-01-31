/**
 * Transaction Tracker Component
 * 
 * Pending transactions list with speed up/cancel options
 * 
 * @author Nich (@nichxbt)
 * @license Apache-2.0
 */

'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Clock,
  CheckCircle,
  XCircle,
  Loader2,
  Zap,
  X,
  ExternalLink,
  ChevronRight,
  Fuel,
  AlertTriangle,
  RotateCw,
} from 'lucide-react';
import { useWallet } from '@/providers/WalletProvider';
import { Transaction } from '@/lib/wallets/types';
import { formatBalance, truncateAddress, getExplorerUrl } from '@/lib/wallets/utils';
import { cn } from '@/lib/utils';

// ============================================
// Types
// ============================================

interface PendingTransaction extends Transaction {
  estimatedTime?: number; // seconds
  startTime: number;
  canSpeedUp: boolean;
  canCancel: boolean;
}

interface TransactionTrackerProps {
  transactions: PendingTransaction[];
  onSpeedUp?: (tx: PendingTransaction) => void;
  onCancel?: (tx: PendingTransaction) => void;
  onDismiss?: (txHash: string) => void;
  compact?: boolean;
}

// ============================================
// Transaction Item
// ============================================

function TransactionItem({
  transaction,
  onSpeedUp,
  onCancel,
  onDismiss,
  compact = false,
}: {
  transaction: PendingTransaction;
  onSpeedUp?: (tx: PendingTransaction) => void;
  onCancel?: (tx: PendingTransaction) => void;
  onDismiss?: (txHash: string) => void;
  compact?: boolean;
}) {
  const [expanded, setExpanded] = useState(false);
  const { currentNetwork } = useWallet();

  // Calculate elapsed time
  const elapsed = Math.floor((Date.now() - transaction.startTime) / 1000);
  const progress = transaction.estimatedTime 
    ? Math.min(100, (elapsed / transaction.estimatedTime) * 100) 
    : 0;

  // Format elapsed time
  const formatTime = (seconds: number) => {
    if (seconds < 60) return `${seconds}s`;
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}m ${secs}s`;
  };

  // Status icon
  const StatusIcon = () => {
    switch (transaction.status) {
      case 'pending':
        return <Loader2 className="w-5 h-5 animate-spin text-yellow-500" />;
      case 'confirmed':
        return <CheckCircle className="w-5 h-5 text-green-500" />;
      case 'failed':
        return <XCircle className="w-5 h-5 text-red-500" />;
      default:
        return <Clock className="w-5 h-5 text-gray-400" />;
    }
  };

  // Transaction type icon
  const TypeIcon = () => {
    switch (transaction.type) {
      case 'send':
        return '↑';
      case 'receive':
        return '↓';
      case 'swap':
        return '↔';
      case 'approve':
        return '✓';
      case 'contract':
        return '📄';
      default:
        return '•';
    }
  };

  if (compact) {
    return (
      <div className="flex items-center gap-3 p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
        <StatusIcon />
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2">
            <span className="font-medium text-gray-900 dark:text-white capitalize">
              {transaction.type}
            </span>
            {transaction.value && (
              <span className="text-gray-500 text-sm">
                {formatBalance(transaction.value, 18, 4)} ETH
              </span>
            )}
          </div>
          <div className="text-sm text-gray-500">
            {formatTime(elapsed)} ago
          </div>
        </div>
        {transaction.status === 'pending' && transaction.canSpeedUp && onSpeedUp && (
          <button
            onClick={() => onSpeedUp(transaction)}
            className="p-2 hover:bg-gray-200 dark:hover:bg-gray-700 rounded-lg transition-colors"
            title="Speed Up"
          >
            <Zap className="w-4 h-4 text-yellow-500" />
          </button>
        )}
      </div>
    );
  }

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, x: -100 }}
      className={cn(
        'bg-white dark:bg-gray-900 border rounded-xl overflow-hidden',
        transaction.status === 'pending' && 'border-yellow-200 dark:border-yellow-800',
        transaction.status === 'confirmed' && 'border-green-200 dark:border-green-800',
        transaction.status === 'failed' && 'border-red-200 dark:border-red-800',
        !['pending', 'confirmed', 'failed'].includes(transaction.status) && 'border-gray-200 dark:border-gray-700'
      )}
    >
      {/* Progress bar */}
      {transaction.status === 'pending' && (
        <div className="h-1 bg-gray-100 dark:bg-gray-800">
          <motion.div
            className="h-full bg-yellow-500"
            initial={{ width: 0 }}
            animate={{ width: `${progress}%` }}
            transition={{ duration: 0.5 }}
          />
        </div>
      )}

      {/* Main content */}
      <div className="p-4">
        <div className="flex items-center gap-3">
          {/* Status Icon */}
          <div className={cn(
            'w-10 h-10 rounded-full flex items-center justify-center',
            transaction.status === 'pending' && 'bg-yellow-100 dark:bg-yellow-900/30',
            transaction.status === 'confirmed' && 'bg-green-100 dark:bg-green-900/30',
            transaction.status === 'failed' && 'bg-red-100 dark:bg-red-900/30'
          )}>
            <StatusIcon />
          </div>

          {/* Transaction info */}
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2">
              <span className="font-medium text-gray-900 dark:text-white capitalize">
                {transaction.type}
              </span>
              <span className="text-xl">{TypeIcon()}</span>
            </div>
            <div className="text-sm text-gray-500 flex items-center gap-2">
              <span>{formatTime(elapsed)}</span>
              {transaction.estimatedTime && transaction.status === 'pending' && (
                <>
                  <span>•</span>
                  <span>~{formatTime(Math.max(0, transaction.estimatedTime - elapsed))} remaining</span>
                </>
              )}
            </div>
          </div>

          {/* Value */}
          {transaction.value && (
            <div className="text-right">
              <div className="font-medium text-gray-900 dark:text-white">
                {formatBalance(transaction.value, 18, 4)} ETH
              </div>
              {transaction.gasFee && (
                <div className="text-sm text-gray-500 flex items-center justify-end gap-1">
                  <Fuel className="w-3 h-3" />
                  {formatBalance(transaction.gasFee, 18, 6)} ETH
                </div>
              )}
            </div>
          )}

          {/* Expand button */}
          <button
            onClick={() => setExpanded(!expanded)}
            className="p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition-colors"
          >
            <ChevronRight className={cn(
              'w-5 h-5 text-gray-400 transition-transform',
              expanded && 'rotate-90'
            )} />
          </button>
        </div>

        {/* Expanded content */}
        <AnimatePresence>
          {expanded && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              className="overflow-hidden"
            >
              <div className="mt-4 pt-4 border-t border-gray-100 dark:border-gray-800 space-y-3">
                {/* Transaction Hash */}
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-500">Transaction Hash</span>
                  <a
                    href={getExplorerUrl(currentNetwork?.chainId || 1, 'tx', transaction.hash)}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-sm text-blue-500 hover:text-blue-600 font-mono flex items-center gap-1"
                  >
                    {truncateAddress(transaction.hash)}
                    <ExternalLink className="w-3 h-3" />
                  </a>
                </div>

                {/* From */}
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-500">From</span>
                  <span className="text-sm text-gray-900 dark:text-white font-mono">
                    {truncateAddress(transaction.from)}
                  </span>
                </div>

                {/* To */}
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-500">To</span>
                  <span className="text-sm text-gray-900 dark:text-white font-mono">
                    {truncateAddress(transaction.to)}
                  </span>
                </div>

                {/* Nonce */}
                {transaction.nonce !== undefined && (
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-500">Nonce</span>
                    <span className="text-sm text-gray-900 dark:text-white">
                      {transaction.nonce}
                    </span>
                  </div>
                )}

                {/* Actions */}
                {transaction.status === 'pending' && (
                  <div className="flex gap-2 pt-2">
                    {transaction.canSpeedUp && onSpeedUp && (
                      <button
                        onClick={() => onSpeedUp(transaction)}
                        className="flex-1 flex items-center justify-center gap-2 py-2 px-4 bg-yellow-100 dark:bg-yellow-900/30 text-yellow-700 dark:text-yellow-400 hover:bg-yellow-200 dark:hover:bg-yellow-900/50 rounded-lg transition-colors"
                      >
                        <Zap className="w-4 h-4" />
                        Speed Up
                      </button>
                    )}
                    {transaction.canCancel && onCancel && (
                      <button
                        onClick={() => onCancel(transaction)}
                        className="flex-1 flex items-center justify-center gap-2 py-2 px-4 bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-400 hover:bg-red-200 dark:hover:bg-red-900/50 rounded-lg transition-colors"
                      >
                        <X className="w-4 h-4" />
                        Cancel
                      </button>
                    )}
                  </div>
                )}

                {/* Retry for failed */}
                {transaction.status === 'failed' && (
                  <div className="flex gap-2 pt-2">
                    <button className="flex-1 flex items-center justify-center gap-2 py-2 px-4 bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700 rounded-lg transition-colors">
                      <RotateCw className="w-4 h-4" />
                      Retry Transaction
                    </button>
                  </div>
                )}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Dismiss for completed/failed */}
      {(transaction.status === 'confirmed' || transaction.status === 'failed') && onDismiss && (
        <button
          onClick={() => onDismiss(transaction.hash)}
          className="absolute top-2 right-2 p-1 hover:bg-gray-100 dark:hover:bg-gray-800 rounded"
        >
          <X className="w-4 h-4 text-gray-400" />
        </button>
      )}
    </motion.div>
  );
}

// ============================================
// Main Tracker Component
// ============================================

export function TransactionTracker({
  transactions,
  onSpeedUp,
  onCancel,
  onDismiss,
  compact = false,
}: TransactionTrackerProps) {
  const pendingTxs = transactions.filter(tx => tx.status === 'pending');
  const recentTxs = transactions.filter(tx => tx.status !== 'pending');

  if (transactions.length === 0) {
    return null;
  }

  return (
    <div className="space-y-4">
      {/* Pending Transactions */}
      {pendingTxs.length > 0 && (
        <div>
          <div className="flex items-center gap-2 mb-3">
            <Loader2 className="w-4 h-4 animate-spin text-yellow-500" />
            <h3 className="text-sm font-medium text-gray-700 dark:text-gray-300">
              Pending ({pendingTxs.length})
            </h3>
          </div>
          <div className="space-y-3">
            <AnimatePresence mode="popLayout">
              {pendingTxs.map((tx) => (
                <TransactionItem
                  key={tx.hash}
                  transaction={tx}
                  onSpeedUp={onSpeedUp}
                  onCancel={onCancel}
                  onDismiss={onDismiss}
                  compact={compact}
                />
              ))}
            </AnimatePresence>
          </div>
        </div>
      )}

      {/* Recent Transactions */}
      {recentTxs.length > 0 && (
        <div>
          <h3 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
            Recent
          </h3>
          <div className="space-y-3">
            <AnimatePresence mode="popLayout">
              {recentTxs.slice(0, 5).map((tx) => (
                <TransactionItem
                  key={tx.hash}
                  transaction={tx}
                  onDismiss={onDismiss}
                  compact={compact}
                />
              ))}
            </AnimatePresence>
          </div>
        </div>
      )}
    </div>
  );
}

// ============================================
// Toast Notification Component
// ============================================

export function TransactionToast({
  transaction,
  onDismiss,
}: {
  transaction: PendingTransaction;
  onDismiss: () => void;
}) {
  const { currentNetwork } = useWallet();

  return (
    <motion.div
      initial={{ opacity: 0, y: 50, x: 50 }}
      animate={{ opacity: 1, y: 0, x: 0 }}
      exit={{ opacity: 0, y: 50, x: 50 }}
      className={cn(
        'fixed bottom-4 right-4 max-w-sm w-full bg-white dark:bg-gray-900 rounded-xl shadow-lg border overflow-hidden z-50',
        transaction.status === 'pending' && 'border-yellow-200 dark:border-yellow-800',
        transaction.status === 'confirmed' && 'border-green-200 dark:border-green-800',
        transaction.status === 'failed' && 'border-red-200 dark:border-red-800'
      )}
    >
      {/* Progress bar for pending */}
      {transaction.status === 'pending' && (
        <div className="h-1 bg-gray-100 dark:bg-gray-800">
          <motion.div
            className="h-full bg-yellow-500"
            initial={{ width: '0%' }}
            animate={{ width: '100%' }}
            transition={{ duration: transaction.estimatedTime || 30 }}
          />
        </div>
      )}

      <div className="p-4">
        <div className="flex items-start gap-3">
          {/* Icon */}
          <div className={cn(
            'w-10 h-10 rounded-full flex items-center justify-center shrink-0',
            transaction.status === 'pending' && 'bg-yellow-100 dark:bg-yellow-900/30',
            transaction.status === 'confirmed' && 'bg-green-100 dark:bg-green-900/30',
            transaction.status === 'failed' && 'bg-red-100 dark:bg-red-900/30'
          )}>
            {transaction.status === 'pending' && (
              <Loader2 className="w-5 h-5 animate-spin text-yellow-500" />
            )}
            {transaction.status === 'confirmed' && (
              <CheckCircle className="w-5 h-5 text-green-500" />
            )}
            {transaction.status === 'failed' && (
              <XCircle className="w-5 h-5 text-red-500" />
            )}
          </div>

          {/* Content */}
          <div className="flex-1 min-w-0">
            <div className="font-medium text-gray-900 dark:text-white capitalize">
              {transaction.status === 'pending' && 'Transaction Pending'}
              {transaction.status === 'confirmed' && 'Transaction Confirmed'}
              {transaction.status === 'failed' && 'Transaction Failed'}
            </div>
            <div className="text-sm text-gray-500 mt-1">
              {transaction.type.charAt(0).toUpperCase() + transaction.type.slice(1)}
              {transaction.value && (
                <span> • {formatBalance(transaction.value, 18, 4)} ETH</span>
              )}
            </div>
          </div>

          {/* Close button */}
          <button
            onClick={onDismiss}
            className="p-1 hover:bg-gray-100 dark:hover:bg-gray-800 rounded"
          >
            <X className="w-4 h-4 text-gray-400" />
          </button>
        </div>

        {/* View on explorer */}
        <a
          href={getExplorerUrl(currentNetwork?.chainId || 1, 'tx', transaction.hash)}
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center justify-center gap-1 mt-3 text-sm text-blue-500 hover:text-blue-600"
        >
          View on Explorer
          <ExternalLink className="w-3 h-3" />
        </a>
      </div>
    </motion.div>
  );
}
