/**
 * Payment History Table Component
 * 
 * Sortable, filterable table for displaying payment history
 * 
 * @author Nich (@nichxbt)
 * @license Apache-2.0
 */

'use client';

import React, { useState, useMemo } from 'react';
import { 
  ChevronDown, 
  ChevronUp, 
  Filter, 
  Download, 
  ExternalLink,
  ChevronLeft,
  ChevronRight,
  MoreHorizontal,
  RefreshCw,
  Eye
} from 'lucide-react';
import { PaymentStatusBadge } from './PaymentStatus';
import { getExplorerTxUrl, getChainName, formatTokenAmount } from '@/lib/payments/config';
import type { Payment, PaymentStatus } from '@/lib/payments/types';

// ============================================
// Types
// ============================================

interface PaymentHistoryProps {
  payments: Payment[];
  isLoading?: boolean;
  onRefresh?: () => void;
  onViewPayment?: (payment: Payment) => void;
  onRefundPayment?: (payment: Payment) => void;
  showPagination?: boolean;
  pageSize?: number;
}

type SortField = 'createdAt' | 'amount' | 'status';
type SortOrder = 'asc' | 'desc';

interface FilterState {
  type: 'all' | 'sent' | 'received';
  status: 'all' | PaymentStatus;
  dateRange: 'all' | '7d' | '30d' | '90d';
}

// ============================================
// Component
// ============================================

export function PaymentHistory({
  payments,
  isLoading = false,
  onRefresh,
  onViewPayment,
  onRefundPayment,
  showPagination = true,
  pageSize = 10,
}: PaymentHistoryProps) {
  const [sortField, setSortField] = useState<SortField>('createdAt');
  const [sortOrder, setSortOrder] = useState<SortOrder>('desc');
  const [filters, setFilters] = useState<FilterState>({
    type: 'all',
    status: 'all',
    dateRange: 'all',
  });
  const [showFilters, setShowFilters] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [expandedPayment, setExpandedPayment] = useState<string | null>(null);

  // Filter payments
  const filteredPayments = useMemo(() => {
    let result = [...payments];

    // Filter by type (simplified - would need user address in real implementation)
    // if (filters.type !== 'all') {
    //   result = result.filter(p => ...)
    // }

    // Filter by status
    if (filters.status !== 'all') {
      result = result.filter((p) => p.status === filters.status);
    }

    // Filter by date range
    if (filters.dateRange !== 'all') {
      const now = Math.floor(Date.now() / 1000);
      const ranges = {
        '7d': 7 * 24 * 60 * 60,
        '30d': 30 * 24 * 60 * 60,
        '90d': 90 * 24 * 60 * 60,
      };
      const cutoff = now - ranges[filters.dateRange];
      result = result.filter((p) => p.createdAt >= cutoff);
    }

    return result;
  }, [payments, filters]);

  // Sort payments
  const sortedPayments = useMemo(() => {
    return [...filteredPayments].sort((a, b) => {
      let comparison = 0;

      switch (sortField) {
        case 'createdAt':
          comparison = a.createdAt - b.createdAt;
          break;
        case 'amount':
          comparison = parseFloat(a.amount) - parseFloat(b.amount);
          break;
        case 'status':
          comparison = a.status.localeCompare(b.status);
          break;
      }

      return sortOrder === 'desc' ? -comparison : comparison;
    });
  }, [filteredPayments, sortField, sortOrder]);

  // Paginate
  const totalPages = Math.ceil(sortedPayments.length / pageSize);
  const paginatedPayments = showPagination
    ? sortedPayments.slice((currentPage - 1) * pageSize, currentPage * pageSize)
    : sortedPayments;

  // Handle sort
  const handleSort = (field: SortField) => {
    if (sortField === field) {
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortOrder('desc');
    }
  };

  // Export to CSV
  const exportToCsv = () => {
    const headers = ['Date', 'Amount', 'Token', 'Status', 'Recipient', 'Transaction Hash'];
    const rows = sortedPayments.map((p) => [
      new Date(p.createdAt * 1000).toISOString(),
      p.amount,
      p.token.symbol,
      p.status,
      p.recipient,
      p.txHash || '',
    ]);

    const csv = [headers.join(','), ...rows.map((r) => r.join(','))].join('\n');
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `payment-history-${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  };

  // Format date
  const formatDate = (timestamp: number): string => {
    return new Date(timestamp * 1000).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  // Sort icon
  const SortIcon = ({ field }: { field: SortField }) => {
    if (sortField !== field) {
      return <ChevronDown className="w-4 h-4 text-gray-500" />;
    }
    return sortOrder === 'asc' 
      ? <ChevronUp className="w-4 h-4 text-blue-500" />
      : <ChevronDown className="w-4 h-4 text-blue-500" />;
  };

  return (
    <div className="bg-gray-900 rounded-xl border border-gray-800 overflow-hidden">
      {/* Header */}
      <div className="p-4 border-b border-gray-800 flex items-center justify-between">
        <h2 className="text-lg font-semibold text-white">Payment History</h2>
        <div className="flex items-center gap-2">
          <button
            onClick={() => setShowFilters(!showFilters)}
            className={`p-2 rounded-lg transition-colors ${
              showFilters ? 'bg-blue-500/20 text-blue-400' : 'bg-gray-800 text-gray-400 hover:text-white'
            }`}
          >
            <Filter className="w-4 h-4" />
          </button>
          <button
            onClick={exportToCsv}
            className="p-2 bg-gray-800 text-gray-400 hover:text-white rounded-lg transition-colors"
            title="Export to CSV"
          >
            <Download className="w-4 h-4" />
          </button>
          {onRefresh && (
            <button
              onClick={onRefresh}
              disabled={isLoading}
              className="p-2 bg-gray-800 text-gray-400 hover:text-white rounded-lg transition-colors disabled:opacity-50"
            >
              <RefreshCw className={`w-4 h-4 ${isLoading ? 'animate-spin' : ''}`} />
            </button>
          )}
        </div>
      </div>

      {/* Filters */}
      {showFilters && (
        <div className="p-4 border-b border-gray-800 bg-gray-850 flex flex-wrap gap-4">
          <div>
            <label className="block text-xs text-gray-400 mb-1">Type</label>
            <select
              value={filters.type}
              onChange={(e) => setFilters({ ...filters, type: e.target.value as FilterState['type'] })}
              className="bg-gray-800 text-white px-3 py-1.5 rounded-lg border border-gray-700 text-sm"
            >
              <option value="all">All</option>
              <option value="sent">Sent</option>
              <option value="received">Received</option>
            </select>
          </div>
          <div>
            <label className="block text-xs text-gray-400 mb-1">Status</label>
            <select
              value={filters.status}
              onChange={(e) => setFilters({ ...filters, status: e.target.value as FilterState['status'] })}
              className="bg-gray-800 text-white px-3 py-1.5 rounded-lg border border-gray-700 text-sm"
            >
              <option value="all">All</option>
              <option value="pending">Pending</option>
              <option value="completed">Completed</option>
              <option value="failed">Failed</option>
              <option value="refunded">Refunded</option>
            </select>
          </div>
          <div>
            <label className="block text-xs text-gray-400 mb-1">Date Range</label>
            <select
              value={filters.dateRange}
              onChange={(e) => setFilters({ ...filters, dateRange: e.target.value as FilterState['dateRange'] })}
              className="bg-gray-800 text-white px-3 py-1.5 rounded-lg border border-gray-700 text-sm"
            >
              <option value="all">All Time</option>
              <option value="7d">Last 7 Days</option>
              <option value="30d">Last 30 Days</option>
              <option value="90d">Last 90 Days</option>
            </select>
          </div>
        </div>
      )}

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="text-left text-sm text-gray-400 border-b border-gray-800">
              <th 
                className="px-4 py-3 cursor-pointer hover:text-white transition-colors"
                onClick={() => handleSort('createdAt')}
              >
                <div className="flex items-center gap-1">
                  Date
                  <SortIcon field="createdAt" />
                </div>
              </th>
              <th 
                className="px-4 py-3 cursor-pointer hover:text-white transition-colors"
                onClick={() => handleSort('amount')}
              >
                <div className="flex items-center gap-1">
                  Amount
                  <SortIcon field="amount" />
                </div>
              </th>
              <th 
                className="px-4 py-3 cursor-pointer hover:text-white transition-colors"
                onClick={() => handleSort('status')}
              >
                <div className="flex items-center gap-1">
                  Status
                  <SortIcon field="status" />
                </div>
              </th>
              <th className="px-4 py-3">Recipient</th>
              <th className="px-4 py-3">Network</th>
              <th className="px-4 py-3 text-right">Actions</th>
            </tr>
          </thead>
          <tbody>
            {paginatedPayments.length === 0 ? (
              <tr>
                <td colSpan={6} className="px-4 py-12 text-center text-gray-400">
                  No payments found
                </td>
              </tr>
            ) : (
              paginatedPayments.map((payment) => (
                <React.Fragment key={payment.id}>
                  <tr 
                    className="border-b border-gray-800/50 hover:bg-gray-800/30 transition-colors cursor-pointer"
                    onClick={() => setExpandedPayment(
                      expandedPayment === payment.id ? null : payment.id
                    )}
                  >
                    <td className="px-4 py-3 text-sm text-gray-300">
                      {formatDate(payment.createdAt)}
                    </td>
                    <td className="px-4 py-3">
                      <div className="font-medium text-white">
                        {payment.amount} {payment.token.symbol}
                      </div>
                      {payment.amountUsd && (
                        <div className="text-xs text-gray-400">
                          ${payment.amountUsd}
                        </div>
                      )}
                    </td>
                    <td className="px-4 py-3">
                      <PaymentStatusBadge status={payment.status} size="sm" />
                    </td>
                    <td className="px-4 py-3 font-mono text-sm text-gray-400">
                      {payment.recipient.slice(0, 6)}...{payment.recipient.slice(-4)}
                    </td>
                    <td className="px-4 py-3 text-sm text-gray-400">
                      {getChainName(payment.chainId)}
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex items-center justify-end gap-2">
                        {payment.txHash && (
                          <a
                            href={getExplorerTxUrl(payment.chainId, payment.txHash)}
                            target="_blank"
                            rel="noopener noreferrer"
                            onClick={(e) => e.stopPropagation()}
                            className="p-1.5 text-gray-400 hover:text-blue-400 transition-colors"
                            title="View transaction"
                          >
                            <ExternalLink className="w-4 h-4" />
                          </a>
                        )}
                        {onViewPayment && (
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              onViewPayment(payment);
                            }}
                            className="p-1.5 text-gray-400 hover:text-white transition-colors"
                            title="View details"
                          >
                            <Eye className="w-4 h-4" />
                          </button>
                        )}
                        <button
                          onClick={(e) => e.stopPropagation()}
                          className="p-1.5 text-gray-400 hover:text-white transition-colors"
                        >
                          <MoreHorizontal className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                  
                  {/* Expanded Details */}
                  {expandedPayment === payment.id && (
                    <tr className="bg-gray-800/20">
                      <td colSpan={6} className="px-4 py-4">
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                          <div>
                            <div className="text-gray-400 mb-1">Payment ID</div>
                            <div className="font-mono text-gray-300">{payment.id}</div>
                          </div>
                          <div>
                            <div className="text-gray-400 mb-1">Description</div>
                            <div className="text-gray-300">{payment.description || '-'}</div>
                          </div>
                          <div>
                            <div className="text-gray-400 mb-1">Sender</div>
                            <div className="font-mono text-gray-300">
                              {payment.sender.slice(0, 10)}...{payment.sender.slice(-8)}
                            </div>
                          </div>
                          {payment.completedAt && (
                            <div>
                              <div className="text-gray-400 mb-1">Completed</div>
                              <div className="text-gray-300">
                                {formatDate(payment.completedAt)}
                              </div>
                            </div>
                          )}
                        </div>
                        
                        {/* Actions */}
                        {payment.status === 'completed' && onRefundPayment && (
                          <div className="mt-4 pt-4 border-t border-gray-700">
                            <button
                              onClick={() => onRefundPayment(payment)}
                              className="px-3 py-1.5 text-sm bg-gray-800 text-gray-300 hover:text-white rounded-lg transition-colors"
                            >
                              Request Refund
                            </button>
                          </div>
                        )}
                      </td>
                    </tr>
                  )}
                </React.Fragment>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      {showPagination && totalPages > 1 && (
        <div className="p-4 border-t border-gray-800 flex items-center justify-between">
          <div className="text-sm text-gray-400">
            Showing {(currentPage - 1) * pageSize + 1} to{' '}
            {Math.min(currentPage * pageSize, sortedPayments.length)} of{' '}
            {sortedPayments.length} payments
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
              disabled={currentPage === 1}
              className="p-2 bg-gray-800 text-gray-400 hover:text-white rounded-lg transition-colors disabled:opacity-50"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            <span className="text-sm text-gray-400">
              Page {currentPage} of {totalPages}
            </span>
            <button
              onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
              disabled={currentPage === totalPages}
              className="p-2 bg-gray-800 text-gray-400 hover:text-white rounded-lg transition-colors disabled:opacity-50"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

export default PaymentHistory;
