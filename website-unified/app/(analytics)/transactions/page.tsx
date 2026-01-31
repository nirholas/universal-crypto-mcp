'use client';

/**
 * Transaction Analytics Page
 * 
 * Comprehensive transaction history with tax reporting, cost basis tracking,
 * and audit trail functionality. Uses real API integration.
 */

import React, { useState, useMemo, useCallback } from 'react';
import { cn } from '@/lib/utils/cn';
import { TaxReport } from '@/components/analytics/TaxReport';
import { CostBasis } from '@/components/analytics/CostBasis';
import { AuditTrail } from '@/components/analytics/AuditTrail';
import { 
  useTransactions, 
  useTransactionSummary, 
  formatCurrency, 
  formatDateTime,
  useLocalStorage 
} from '@/lib/analytics/hooks';
import type { Transaction, TransactionSummary } from '@/lib/analytics/types';

// ============================================================================
// Transaction Stats Component
// ============================================================================

interface TransactionStatsProps {
  summary: TransactionSummary | null;
  isLoading: boolean;
}

function TransactionStats({ summary, isLoading }: TransactionStatsProps) {
  if (isLoading) {
    return (
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {[...Array(4)].map((_, i) => (
          <div key={i} className="animate-pulse rounded-2xl bg-gray-200 p-6 h-32" />
        ))}
      </div>
    );
  }

  if (!summary) {
    return (
      <div className="rounded-2xl border-2 border-gray-200 bg-white p-8 text-center">
        <p className="text-gray-500">No transaction data available</p>
      </div>
    );
  }

  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
      <div className="rounded-2xl bg-gradient-to-br from-blue-600 to-indigo-700 p-6 text-white">
        <div className="text-sm opacity-80">Total Transactions</div>
        <div className="mt-2 text-3xl font-bold">{summary.totalTransactions}</div>
        <div className="mt-2 text-sm opacity-80">
          Success: {(summary.successRate * 100).toFixed(1)}%
        </div>
      </div>

      <div className="rounded-2xl bg-gradient-to-br from-green-500 to-emerald-600 p-6 text-white">
        <div className="text-sm opacity-80">Total Volume</div>
        <div className="mt-2 text-3xl font-bold">
          {formatCurrency(summary.totalVolume)}
        </div>
        <div className="mt-2 text-sm opacity-80">
          Fees Paid: {formatCurrency(summary.totalFeesPaid)}
        </div>
      </div>

      <div className="rounded-2xl border-2 border-gray-200 bg-white p-6">
        <div className="text-sm text-gray-500">Most Used Protocol</div>
        <div className="mt-2 text-2xl font-bold truncate">
          {summary.mostUsedProtocol || 'N/A'}
        </div>
        <div className="mt-2 text-sm text-gray-500">
          {summary.transactionsByType.length} different types
        </div>
      </div>

      <div className="rounded-2xl border-2 border-gray-200 bg-white p-6">
        <div className="text-sm text-gray-500">Active Chains</div>
        <div className="mt-2 text-3xl font-bold">
          {summary.transactionsByChain.length}
        </div>
        <div className="mt-2 flex flex-wrap gap-1">
          {summary.transactionsByChain.slice(0, 3).map((c) => (
            <span 
              key={c.chain} 
              className="rounded-md bg-gray-100 px-1.5 py-0.5 text-xs"
            >
              {c.chain}
            </span>
          ))}
          {summary.transactionsByChain.length > 3 && (
            <span className="text-xs text-gray-400">
              +{summary.transactionsByChain.length - 3}
            </span>
          )}
        </div>
      </div>
    </div>
  );
}

// ============================================================================
// Transaction Type Badge Component
// ============================================================================

interface TypeBadgeProps {
  type: Transaction['type'];
}

function TypeBadge({ type }: TypeBadgeProps) {
  const colors: Record<Transaction['type'], string> = {
    send: 'bg-orange-100 text-orange-700',
    receive: 'bg-green-100 text-green-700',
    swap: 'bg-blue-100 text-blue-700',
    approve: 'bg-gray-100 text-gray-700',
    stake: 'bg-indigo-100 text-indigo-700',
    unstake: 'bg-indigo-100 text-indigo-700',
    claim: 'bg-yellow-100 text-yellow-700',
    mint: 'bg-purple-100 text-purple-700',
    burn: 'bg-red-100 text-red-700',
    bridge: 'bg-pink-100 text-pink-700',
    unknown: 'bg-gray-100 text-gray-700',
  };

  const labels: Record<Transaction['type'], string> = {
    send: 'Send',
    receive: 'Receive',
    swap: 'Swap',
    approve: 'Approve',
    stake: 'Stake',
    unstake: 'Unstake',
    claim: 'Claim',
    mint: 'Mint',
    burn: 'Burn',
    bridge: 'Bridge',
    unknown: 'Unknown',
  };

  return (
    <span className={cn('rounded-md px-2 py-1 text-xs font-medium', colors[type])}>
      {labels[type]}
    </span>
  );
}

// ============================================================================
// Transaction List Component
// ============================================================================

interface TransactionListProps {
  transactions: Transaction[];
  total: number;
  isLoading: boolean;
  page: number;
  onPageChange: (page: number) => void;
  typeFilter: string;
  onTypeFilterChange: (type: string) => void;
  chainFilter: string;
  onChainFilterChange: (chain: string) => void;
}

function TransactionList({
  transactions,
  total,
  isLoading,
  page,
  onPageChange,
  typeFilter,
  onTypeFilterChange,
  chainFilter,
  onChainFilterChange,
}: TransactionListProps) {
  const [sortField, setSortField] = useState<'timestamp' | 'value'>('timestamp');
  const [sortDir, setSortDir] = useState<'asc' | 'desc'>('desc');
  const pageSize = 25;
  const totalPages = Math.ceil(total / pageSize);

  const sortedTransactions = useMemo(() => {
    if (isLoading || !transactions.length) return transactions;
    
    return [...transactions].sort((a, b) => {
      if (sortField === 'timestamp') {
        return sortDir === 'desc'
          ? new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()
          : new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime();
      }
      // Sort by total asset value
      const aValue = a.assets.reduce((sum, asset) => sum + asset.value, 0);
      const bValue = b.assets.reduce((sum, asset) => sum + asset.value, 0);
      return sortDir === 'desc' ? bValue - aValue : aValue - bValue;
    });
  }, [transactions, sortField, sortDir, isLoading]);

  const transactionTypes = [
    'all', 'send', 'receive', 'swap', 'approve', 'stake', 
    'unstake', 'claim', 'mint', 'burn', 'bridge'
  ];

  const chains = ['all', 'ethereum', 'polygon', 'arbitrum', 'optimism', 'base', 'bsc'];

  const getExplorerUrl = (tx: Transaction): string => {
    const explorers: Record<string, string> = {
      ethereum: 'https://etherscan.io/tx/',
      polygon: 'https://polygonscan.com/tx/',
      arbitrum: 'https://arbiscan.io/tx/',
      optimism: 'https://optimistic.etherscan.io/tx/',
      base: 'https://basescan.org/tx/',
      bsc: 'https://bscscan.com/tx/',
    };
    const baseUrl = explorers[tx.chain.toLowerCase()] || 'https://etherscan.io/tx/';
    return `${baseUrl}${tx.hash}`;
  };

  const getTotalValue = (tx: Transaction): number => {
    return tx.assets.reduce((sum, asset) => sum + asset.value, 0);
  };

  if (isLoading) {
    return (
      <div className="rounded-2xl border-2 border-gray-200 bg-white">
        <div className="animate-pulse">
          <div className="border-b border-gray-200 p-6">
            <div className="h-8 bg-gray-200 rounded w-48" />
          </div>
          <div className="divide-y divide-gray-100">
            {[...Array(5)].map((_, i) => (
              <div key={i} className="p-4 flex gap-4">
                <div className="h-4 bg-gray-200 rounded w-24" />
                <div className="h-4 bg-gray-200 rounded w-16" />
                <div className="h-4 bg-gray-200 rounded w-32 flex-1" />
                <div className="h-4 bg-gray-200 rounded w-20" />
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="rounded-2xl border-2 border-gray-200 bg-white">
      {/* Header */}
      <div className="border-b border-gray-200 p-6">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <h3 className="text-lg font-semibold">Transaction History</h3>
            <p className="text-sm text-gray-500">{total} total transactions</p>
          </div>
          
          <div className="flex items-center gap-4">
            {/* Type Filter */}
            <select
              value={typeFilter}
              onChange={(e) => onTypeFilterChange(e.target.value)}
              className="rounded-lg border border-gray-200 px-3 py-2 text-sm"
            >
              {transactionTypes.map((type) => (
                <option key={type} value={type}>
                  {type === 'all' ? 'All Types' : type.charAt(0).toUpperCase() + type.slice(1)}
                </option>
              ))}
            </select>

            {/* Chain Filter */}
            <select
              value={chainFilter}
              onChange={(e) => onChainFilterChange(e.target.value)}
              className="rounded-lg border border-gray-200 px-3 py-2 text-sm"
            >
              {chains.map((chain) => (
                <option key={chain} value={chain}>
                  {chain === 'all' ? 'All Chains' : chain.charAt(0).toUpperCase() + chain.slice(1)}
                </option>
              ))}
            </select>

            {/* Sort */}
            <select
              value={`${sortField}-${sortDir}`}
              onChange={(e) => {
                const [field, dir] = e.target.value.split('-') as [typeof sortField, typeof sortDir];
                setSortField(field);
                setSortDir(dir);
              }}
              className="rounded-lg border border-gray-200 px-3 py-2 text-sm"
            >
              <option value="timestamp-desc">Newest First</option>
              <option value="timestamp-asc">Oldest First</option>
              <option value="value-desc">Highest Value</option>
              <option value="value-asc">Lowest Value</option>
            </select>

            {/* Export */}
            <button 
              className="rounded-lg bg-black px-4 py-2 text-sm font-medium text-white hover:bg-gray-900"
              onClick={() => {
                // Trigger CSV export via API
                const headers = 'Date,Type,Hash,Chain,Status,Assets,Total Value,Fee\n';
                const csvContent = headers + transactions.map(tx => {
                  const assets = tx.assets.map(a => `${a.direction === 'in' ? '+' : '-'}${a.amount} ${a.symbol}`).join('; ');
                  return `${tx.timestamp},${tx.type},${tx.hash},${tx.chain},${tx.status},"${assets}",${getTotalValue(tx)},${tx.fee} ${tx.feeToken}`;
                }).join('\n');
                const blob = new Blob([csvContent], { type: 'text/csv' });
                const url = URL.createObjectURL(blob);
                const a = document.createElement('a');
                a.href = url;
                a.download = 'transactions.csv';
                a.click();
                URL.revokeObjectURL(url);
              }}
            >
              Export CSV
            </button>
          </div>
        </div>
      </div>

      {/* Transaction Table */}
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">Date</th>
              <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">Type</th>
              <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">Assets</th>
              <th className="px-4 py-3 text-right text-sm font-semibold text-gray-700">Value</th>
              <th className="px-4 py-3 text-right text-sm font-semibold text-gray-700">Fee</th>
              <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">Chain</th>
              <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">Status</th>
              <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">Hash</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {sortedTransactions.map((tx) => (
              <tr key={tx.id} className="hover:bg-gray-50">
                <td className="px-4 py-4">
                  <div className="text-sm">{formatDateTime(tx.timestamp)}</div>
                </td>
                <td className="px-4 py-4">
                  <TypeBadge type={tx.type} />
                </td>
                <td className="px-4 py-4">
                  <div className="space-y-1">
                    {tx.assets.map((asset, idx) => (
                      <div key={idx} className="flex items-center gap-2 text-sm">
                        <span className={cn(
                          'font-medium',
                          asset.direction === 'in' ? 'text-green-600' : 'text-red-600'
                        )}>
                          {asset.direction === 'in' ? '+' : '-'}{asset.amount}
                        </span>
                        <span className="text-gray-700">{asset.symbol}</span>
                      </div>
                    ))}
                  </div>
                </td>
                <td className="px-4 py-4 text-right font-medium">
                  {formatCurrency(getTotalValue(tx))}
                </td>
                <td className="px-4 py-4 text-right text-sm text-gray-600">
                  {tx.fee} {tx.feeToken}
                </td>
                <td className="px-4 py-4">
                  <span className="rounded-md bg-gray-100 px-2 py-1 text-xs capitalize">
                    {tx.chain}
                  </span>
                </td>
                <td className="px-4 py-4">
                  <span className={cn(
                    'rounded-full px-2 py-0.5 text-xs font-medium capitalize',
                    tx.status === 'confirmed' ? 'bg-green-100 text-green-700' :
                    tx.status === 'pending' ? 'bg-yellow-100 text-yellow-700' :
                    'bg-red-100 text-red-700'
                  )}>
                    {tx.status}
                  </span>
                </td>
                <td className="px-4 py-4">
                  <a
                    href={getExplorerUrl(tx)}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-xs text-blue-600 hover:underline font-mono"
                  >
                    {tx.hash.slice(0, 6)}...{tx.hash.slice(-4)}
                  </a>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {sortedTransactions.length === 0 && (
        <div className="py-12 text-center text-gray-500">
          No transactions found
        </div>
      )}

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex items-center justify-between border-t border-gray-200 px-6 py-4">
          <div className="text-sm text-gray-500">
            Page {page} of {totalPages}
          </div>
          <div className="flex gap-2">
            <button
              onClick={() => onPageChange(page - 1)}
              disabled={page === 1}
              className={cn(
                'rounded-lg px-3 py-2 text-sm font-medium',
                page === 1
                  ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              )}
            >
              Previous
            </button>
            <button
              onClick={() => onPageChange(page + 1)}
              disabled={page === totalPages}
              className={cn(
                'rounded-lg px-3 py-2 text-sm font-medium',
                page === totalPages
                  ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              )}
            >
              Next
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

// ============================================================================
// Main Page Component
// ============================================================================

export default function TransactionsPage() {
  const [activeTab, setActiveTab] = useState<'transactions' | 'tax' | 'cost-basis' | 'audit'>('transactions');
  const [page, setPage] = useState(1);
  const [typeFilter, setTypeFilter] = useState('all');
  const [chainFilter, setChainFilter] = useState('all');
  
  // Load wallet addresses from local storage or context
  const [walletAddresses] = useLocalStorage<string[]>('portfolio-wallets', []);
  
  // Fetch transaction data via API
  const { 
    data: transactionData, 
    loading: txLoading,
    refetch: refetchTransactions 
  } = useTransactions(
    walletAddresses,
    {
      limit: 25,
      offset: (page - 1) * 25,
      ...(typeFilter !== 'all' && { type: typeFilter }),
      ...(chainFilter !== 'all' && { chain: chainFilter }),
    }
  );
  
  const { 
    data: summary, 
    loading: summaryLoading 
  } = useTransactionSummary(walletAddresses);

  const handleTypeFilterChange = useCallback((type: string) => {
    setTypeFilter(type);
    setPage(1); // Reset to first page on filter change
  }, []);

  const handleChainFilterChange = useCallback((chain: string) => {
    setChainFilter(chain);
    setPage(1); // Reset to first page on filter change
  }, []);

  const handlePageChange = useCallback((newPage: number) => {
    setPage(newPage);
  }, []);

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold">Transaction Analytics</h1>
            <p className="mt-2 text-gray-600">
              Track transactions, generate tax reports, and maintain audit trails.
            </p>
          </div>
          <button
            onClick={() => refetchTransactions()}
            className="rounded-lg border border-gray-200 px-4 py-2 text-sm font-medium hover:bg-gray-50"
          >
            Refresh
          </button>
        </div>
        
        {walletAddresses.length === 0 && (
          <div className="mt-4 rounded-lg bg-yellow-50 border border-yellow-200 p-4">
            <p className="text-sm text-yellow-800">
              No wallet addresses configured. Add wallets in the Portfolio Dashboard to track transactions.
            </p>
          </div>
        )}
      </div>

      {/* Stats */}
      <div className="mb-8">
        <TransactionStats 
          summary={summary} 
          isLoading={summaryLoading}
        />
      </div>

      {/* Tabs */}
      <div className="mb-6 flex gap-1 rounded-lg bg-gray-100 p-1">
        {([
          { id: 'transactions', label: 'Transactions' },
          { id: 'tax', label: 'Tax Report' },
          { id: 'cost-basis', label: 'Cost Basis' },
          { id: 'audit', label: 'Audit Trail' },
        ] as const).map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={cn(
              'flex-1 rounded-md px-4 py-2.5 text-sm font-medium transition-all',
              activeTab === tab.id
                ? 'bg-white text-black shadow-sm'
                : 'text-gray-600 hover:text-black'
            )}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Tab Content */}
      {activeTab === 'transactions' && (
        <TransactionList 
          transactions={transactionData?.transactions || []}
          total={transactionData?.total || 0}
          isLoading={txLoading}
          page={page}
          onPageChange={handlePageChange}
          typeFilter={typeFilter}
          onTypeFilterChange={handleTypeFilterChange}
          chainFilter={chainFilter}
          onChainFilterChange={handleChainFilterChange}
        />
      )}

      {activeTab === 'tax' && (
        <TaxReport walletAddresses={walletAddresses} />
      )}

      {activeTab === 'cost-basis' && (
        <CostBasis walletAddresses={walletAddresses} />
      )}

      {activeTab === 'audit' && (
        <AuditTrail walletAddresses={walletAddresses} />
      )}
    </div>
  );
}
