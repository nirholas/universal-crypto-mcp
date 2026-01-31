/**
 * Payment History Page
 * 
 * Complete transaction history with filtering, export, and detailed view
 * 
 * @author Nich (@nichxbt)
 * @license Apache-2.0
 */

'use client';

import React, { useState, useEffect, useCallback, useMemo } from 'react';
import {
  Receipt,
  Download,
  Filter,
  Search,
  Calendar,
  ArrowUpRight,
  ArrowDownLeft,
  CheckCircle,
  XCircle,
  Clock,
  AlertCircle,
  Loader2,
  RefreshCw,
  ExternalLink,
  ChevronLeft,
  ChevronRight,
  X
} from 'lucide-react';

// ============================================
// Types
// ============================================

interface Transaction {
  id: string;
  type: 'payment' | 'refund' | 'payout' | 'subscription';
  status: 'completed' | 'pending' | 'failed' | 'refunded';
  amount: number;
  currency: string;
  description: string;
  createdAt: string;
  metadata?: {
    subscriptionId?: string;
    invoiceId?: string;
    paymentMethod?: string;
    chain?: string;
    txHash?: string;
  };
}

interface TransactionFilters {
  type: string;
  status: string;
  dateFrom: string;
  dateTo: string;
  search: string;
}

interface Pagination {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
}

// ============================================
// History API Service
// ============================================

class HistoryService {
  private baseUrl = '/api/history';

  async fetchTransactions(filters: TransactionFilters, page: number = 1): Promise<{
    transactions: Transaction[];
    pagination: Pagination;
  }> {
    const params = new URLSearchParams({
      page: page.toString(),
      limit: '20',
      ...(filters.type && filters.type !== 'all' && { type: filters.type }),
      ...(filters.status && filters.status !== 'all' && { status: filters.status }),
      ...(filters.dateFrom && { dateFrom: filters.dateFrom }),
      ...(filters.dateTo && { dateTo: filters.dateTo }),
      ...(filters.search && { search: filters.search }),
    });

    const response = await fetch(`${this.baseUrl}?${params}`, {
      credentials: 'include',
    });
    if (!response.ok) throw new Error('Failed to fetch transactions');
    return response.json();
  }

  async fetchTransaction(id: string): Promise<Transaction> {
    const response = await fetch(`${this.baseUrl}/${id}`, {
      credentials: 'include',
    });
    if (!response.ok) throw new Error('Failed to fetch transaction');
    return response.json();
  }

  async exportTransactions(filters: TransactionFilters, format: 'csv' | 'json' | 'pdf'): Promise<Blob> {
    const params = new URLSearchParams({
      format,
      ...(filters.type && filters.type !== 'all' && { type: filters.type }),
      ...(filters.status && filters.status !== 'all' && { status: filters.status }),
      ...(filters.dateFrom && { dateFrom: filters.dateFrom }),
      ...(filters.dateTo && { dateTo: filters.dateTo }),
    });

    const response = await fetch(`${this.baseUrl}/export?${params}`, {
      credentials: 'include',
    });
    if (!response.ok) throw new Error('Failed to export transactions');
    return response.blob();
  }

  async getStats(): Promise<{
    totalVolume: number;
    transactionCount: number;
    avgTransactionSize: number;
    successRate: number;
  }> {
    const response = await fetch(`${this.baseUrl}/stats`, {
      credentials: 'include',
    });
    if (!response.ok) throw new Error('Failed to fetch stats');
    return response.json();
  }
}

const historyService = new HistoryService();

// ============================================
// Component
// ============================================

export default function PaymentHistoryPage() {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [pagination, setPagination] = useState<Pagination>({
    page: 1,
    limit: 20,
    total: 0,
    totalPages: 0,
  });
  const [stats, setStats] = useState<{
    totalVolume: number;
    transactionCount: number;
    avgTransactionSize: number;
    successRate: number;
  } | null>(null);
  const [filters, setFilters] = useState<TransactionFilters>({
    type: 'all',
    status: 'all',
    dateFrom: '',
    dateTo: '',
    search: '',
  });
  const [loading, setLoading] = useState(true);
  const [exporting, setExporting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [selectedTransaction, setSelectedTransaction] = useState<Transaction | null>(null);
  const [showFilters, setShowFilters] = useState(false);

  const fetchData = useCallback(async (page: number = 1) => {
    setLoading(true);
    setError(null);
    try {
      const [transactionsData, statsData] = await Promise.all([
        historyService.fetchTransactions(filters, page),
        historyService.getStats(),
      ]);
      setTransactions(transactionsData.transactions);
      setPagination(transactionsData.pagination);
      setStats(statsData);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load data');
    } finally {
      setLoading(false);
    }
  }, [filters]);

  useEffect(() => {
    fetchData(1);
  }, [fetchData]);

  const handleExport = async (format: 'csv' | 'json' | 'pdf') => {
    setExporting(true);
    try {
      const blob = await historyService.exportTransactions(filters, format);
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `transactions-${new Date().toISOString().split('T')[0]}.${format}`;
      a.click();
      URL.revokeObjectURL(url);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Export failed');
    } finally {
      setExporting(false);
    }
  };

  const getStatusIcon = (status: Transaction['status']) => {
    switch (status) {
      case 'completed':
        return <CheckCircle className="w-4 h-4 text-green-500" />;
      case 'pending':
        return <Clock className="w-4 h-4 text-yellow-500" />;
      case 'failed':
        return <XCircle className="w-4 h-4 text-red-500" />;
      case 'refunded':
        return <ArrowDownLeft className="w-4 h-4 text-blue-500" />;
    }
  };

  const getTypeIcon = (type: Transaction['type']) => {
    switch (type) {
      case 'payment':
        return <ArrowUpRight className="w-4 h-4 text-green-500" />;
      case 'refund':
        return <ArrowDownLeft className="w-4 h-4 text-red-500" />;
      case 'payout':
        return <ArrowDownLeft className="w-4 h-4 text-blue-500" />;
      case 'subscription':
        return <Receipt className="w-4 h-4 text-purple-500" />;
    }
  };

  const formatAmount = (amount: number, currency: string, type: Transaction['type']) => {
    const prefix = type === 'refund' || type === 'payout' ? '-' : '+';
    return `${prefix}${new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency,
    }).format(Math.abs(amount))}`;
  };

  return (
    <div className="min-h-screen bg-gray-950 text-white">
      {/* Header */}
      <header className="border-b border-gray-800 bg-gray-900/50 backdrop-blur-sm sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 py-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold">Payment History</h1>
              <p className="text-gray-400 text-sm">View all your transactions</p>
            </div>
            <div className="flex items-center gap-3">
              <button
                onClick={() => fetchData(pagination.page)}
                disabled={loading}
                className="p-2 bg-gray-800 text-gray-400 hover:text-white rounded-lg transition-colors disabled:opacity-50"
              >
                <RefreshCw className={`w-5 h-5 ${loading ? 'animate-spin' : ''}`} />
              </button>
              <div className="relative">
                <button
                  onClick={() => handleExport('csv')}
                  disabled={exporting}
                  className="flex items-center gap-2 px-4 py-2 bg-gray-800 hover:bg-gray-700 text-white rounded-lg transition-colors disabled:opacity-50"
                >
                  {exporting ? (
                    <Loader2 className="w-4 h-4 animate-spin" />
                  ) : (
                    <Download className="w-4 h-4" />
                  )}
                  Export
                </button>
              </div>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 py-8">
        {/* Stats Cards */}
        {stats && (
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
            <div className="bg-gray-900 rounded-xl border border-gray-800 p-5">
              <div className="text-gray-400 text-sm mb-1">Total Volume</div>
              <div className="text-2xl font-bold">
                ${stats.totalVolume.toLocaleString()}
              </div>
            </div>
            <div className="bg-gray-900 rounded-xl border border-gray-800 p-5">
              <div className="text-gray-400 text-sm mb-1">Transactions</div>
              <div className="text-2xl font-bold">{stats.transactionCount.toLocaleString()}</div>
            </div>
            <div className="bg-gray-900 rounded-xl border border-gray-800 p-5">
              <div className="text-gray-400 text-sm mb-1">Avg. Transaction</div>
              <div className="text-2xl font-bold">${stats.avgTransactionSize.toFixed(2)}</div>
            </div>
            <div className="bg-gray-900 rounded-xl border border-gray-800 p-5">
              <div className="text-gray-400 text-sm mb-1">Success Rate</div>
              <div className="text-2xl font-bold text-green-500">
                {stats.successRate.toFixed(1)}%
              </div>
            </div>
          </div>
        )}

        {/* Filters */}
        <div className="bg-gray-900 rounded-xl border border-gray-800 p-4 mb-6">
          <div className="flex flex-wrap items-center gap-4">
            {/* Search */}
            <div className="relative flex-1 min-w-[200px]">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
              <input
                type="text"
                placeholder="Search transactions..."
                value={filters.search}
                onChange={(e) => setFilters({ ...filters, search: e.target.value })}
                className="w-full pl-10 pr-4 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white placeholder-gray-500"
              />
            </div>

            {/* Type Filter */}
            <select
              value={filters.type}
              onChange={(e) => setFilters({ ...filters, type: e.target.value })}
              className="px-4 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white"
            >
              <option value="all">All Types</option>
              <option value="payment">Payments</option>
              <option value="refund">Refunds</option>
              <option value="payout">Payouts</option>
              <option value="subscription">Subscriptions</option>
            </select>

            {/* Status Filter */}
            <select
              value={filters.status}
              onChange={(e) => setFilters({ ...filters, status: e.target.value })}
              className="px-4 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white"
            >
              <option value="all">All Status</option>
              <option value="completed">Completed</option>
              <option value="pending">Pending</option>
              <option value="failed">Failed</option>
              <option value="refunded">Refunded</option>
            </select>

            {/* Date Range Toggle */}
            <button
              onClick={() => setShowFilters(!showFilters)}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-colors ${
                showFilters
                  ? 'bg-blue-500/20 text-blue-400 border border-blue-500/30'
                  : 'bg-gray-800 border border-gray-700 text-gray-400 hover:text-white'
              }`}
            >
              <Calendar className="w-4 h-4" />
              Date Range
            </button>
          </div>

          {/* Date Range Inputs */}
          {showFilters && (
            <div className="flex items-center gap-4 mt-4 pt-4 border-t border-gray-800">
              <div>
                <label className="block text-sm text-gray-400 mb-1">From</label>
                <input
                  type="date"
                  value={filters.dateFrom}
                  onChange={(e) => setFilters({ ...filters, dateFrom: e.target.value })}
                  className="px-3 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white"
                />
              </div>
              <div>
                <label className="block text-sm text-gray-400 mb-1">To</label>
                <input
                  type="date"
                  value={filters.dateTo}
                  onChange={(e) => setFilters({ ...filters, dateTo: e.target.value })}
                  className="px-3 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white"
                />
              </div>
              <button
                onClick={() => setFilters({ ...filters, dateFrom: '', dateTo: '' })}
                className="mt-6 text-gray-400 hover:text-white"
              >
                Clear
              </button>
            </div>
          )}
        </div>

        {/* Error State */}
        {error && (
          <div className="mb-6 bg-red-500/10 border border-red-500/30 rounded-lg p-4 flex items-center gap-3">
            <AlertCircle className="w-5 h-5 text-red-500" />
            <span className="text-red-400">{error}</span>
            <button onClick={() => setError(null)} className="ml-auto text-red-400 hover:text-red-300">
              <X className="w-4 h-4" />
            </button>
          </div>
        )}

        {/* Loading State */}
        {loading && (
          <div className="flex items-center justify-center py-20">
            <Loader2 className="w-8 h-8 animate-spin text-blue-500" />
          </div>
        )}

        {/* Transactions Table */}
        {!loading && (
          <div className="bg-gray-900 rounded-xl border border-gray-800 overflow-hidden">
            {transactions.length === 0 ? (
              <div className="p-12 text-center">
                <Receipt className="w-16 h-16 text-gray-600 mx-auto mb-4" />
                <h3 className="text-xl font-semibold mb-2">No Transactions Found</h3>
                <p className="text-gray-400">
                  {filters.search || filters.type !== 'all' || filters.status !== 'all'
                    ? 'Try adjusting your filters'
                    : "You haven't made any transactions yet"}
                </p>
              </div>
            ) : (
              <>
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-gray-800">
                      <th className="text-left text-gray-400 font-medium text-sm px-6 py-4">Transaction</th>
                      <th className="text-left text-gray-400 font-medium text-sm px-6 py-4">Type</th>
                      <th className="text-left text-gray-400 font-medium text-sm px-6 py-4">Status</th>
                      <th className="text-left text-gray-400 font-medium text-sm px-6 py-4">Date</th>
                      <th className="text-right text-gray-400 font-medium text-sm px-6 py-4">Amount</th>
                    </tr>
                  </thead>
                  <tbody>
                    {transactions.map((tx) => (
                      <tr
                        key={tx.id}
                        onClick={() => setSelectedTransaction(tx)}
                        className="border-b border-gray-800 last:border-0 hover:bg-gray-800/50 cursor-pointer transition-colors"
                      >
                        <td className="px-6 py-4">
                          <div className="font-medium text-white">{tx.description}</div>
                          <div className="text-gray-500 text-sm font-mono">{tx.id}</div>
                        </td>
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-2">
                            {getTypeIcon(tx.type)}
                            <span className="capitalize text-gray-300">{tx.type}</span>
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-2">
                            {getStatusIcon(tx.status)}
                            <span className="capitalize text-gray-300">{tx.status}</span>
                          </div>
                        </td>
                        <td className="px-6 py-4 text-gray-400">
                          {new Date(tx.createdAt).toLocaleDateString('en-US', {
                            month: 'short',
                            day: 'numeric',
                            year: 'numeric',
                          })}
                        </td>
                        <td className="px-6 py-4 text-right">
                          <span className={`font-medium ${
                            tx.type === 'refund' || tx.type === 'payout'
                              ? 'text-red-400'
                              : 'text-green-400'
                          }`}>
                            {formatAmount(tx.amount, tx.currency, tx.type)}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>

                {/* Pagination */}
                {pagination.totalPages > 1 && (
                  <div className="flex items-center justify-between px-6 py-4 border-t border-gray-800">
                    <div className="text-gray-400 text-sm">
                      Showing {(pagination.page - 1) * pagination.limit + 1} to{' '}
                      {Math.min(pagination.page * pagination.limit, pagination.total)} of{' '}
                      {pagination.total} transactions
                    </div>
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => fetchData(pagination.page - 1)}
                        disabled={pagination.page === 1}
                        className="p-2 bg-gray-800 text-gray-400 hover:text-white rounded-lg disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                      >
                        <ChevronLeft className="w-5 h-5" />
                      </button>
                      <span className="text-gray-400 px-2">
                        Page {pagination.page} of {pagination.totalPages}
                      </span>
                      <button
                        onClick={() => fetchData(pagination.page + 1)}
                        disabled={pagination.page === pagination.totalPages}
                        className="p-2 bg-gray-800 text-gray-400 hover:text-white rounded-lg disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                      >
                        <ChevronRight className="w-5 h-5" />
                      </button>
                    </div>
                  </div>
                )}
              </>
            )}
          </div>
        )}

        {/* Transaction Detail Modal */}
        {selectedTransaction && (
          <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
            <div className="bg-gray-900 rounded-xl border border-gray-800 max-w-lg w-full max-h-[90vh] overflow-y-auto">
              <div className="flex items-center justify-between p-6 border-b border-gray-800">
                <h3 className="text-lg font-semibold">Transaction Details</h3>
                <button
                  onClick={() => setSelectedTransaction(null)}
                  className="p-2 hover:bg-gray-800 rounded-lg transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
              <div className="p-6 space-y-4">
                <div className="flex justify-between items-center">
                  <span className="text-gray-400">ID</span>
                  <span className="font-mono text-sm">{selectedTransaction.id}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-400">Type</span>
                  <span className="capitalize">{selectedTransaction.type}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-400">Status</span>
                  <div className="flex items-center gap-2">
                    {getStatusIcon(selectedTransaction.status)}
                    <span className="capitalize">{selectedTransaction.status}</span>
                  </div>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-400">Amount</span>
                  <span className="font-semibold">
                    {formatAmount(
                      selectedTransaction.amount,
                      selectedTransaction.currency,
                      selectedTransaction.type
                    )}
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-400">Date</span>
                  <span>
                    {new Date(selectedTransaction.createdAt).toLocaleString()}
                  </span>
                </div>
                <div className="flex justify-between items-start">
                  <span className="text-gray-400">Description</span>
                  <span className="text-right">{selectedTransaction.description}</span>
                </div>
                {selectedTransaction.metadata?.txHash && (
                  <div className="flex justify-between items-center">
                    <span className="text-gray-400">TX Hash</span>
                    <a
                      href={`https://etherscan.io/tx/${selectedTransaction.metadata.txHash}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-1 text-blue-400 hover:text-blue-300 font-mono text-sm"
                    >
                      {selectedTransaction.metadata.txHash.slice(0, 10)}...
                      <ExternalLink className="w-3 h-3" />
                    </a>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
