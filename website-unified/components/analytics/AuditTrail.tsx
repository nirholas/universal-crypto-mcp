'use client';

/**
 * Audit Trail Component
 * 
 * Complete audit trail of all portfolio changes, transactions, and events
 * with search, filtering, and export capabilities.
 */

import React, { useState, useMemo } from 'react';
import { cn } from '@/lib/utils/cn';
import { useTransactions, formatDateTime, formatCurrency } from '@/lib/analytics/hooks';
import type { Transaction } from '@/lib/analytics/types';

// ============================================================================
// Types
// ============================================================================

interface AuditTrailProps {
  walletAddresses: string[];
  className?: string;
}

interface AuditEntry {
  id: string;
  timestamp: string;
  type: string;
  action: string;
  details: string;
  user?: string;
  ipAddress?: string;
  status: 'success' | 'failed' | 'pending';
  metadata: Record<string, unknown>;
}

// ============================================================================
// Search Bar Component
// ============================================================================

interface SearchBarProps {
  value: string;
  onChange: (value: string) => void;
  onClear: () => void;
}

function SearchBar({ value, onChange, onClear }: SearchBarProps) {
  return (
    <div className="relative">
      <input
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder="Search audit trail..."
        className="w-full rounded-lg border border-gray-200 pl-10 pr-4 py-2 text-sm focus:border-black focus:outline-none"
      />
      <svg
        className="absolute left-3 top-2.5 h-5 w-5 text-gray-400"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
        />
      </svg>
      {value && (
        <button
          onClick={onClear}
          className="absolute right-3 top-2.5 text-gray-400 hover:text-gray-600"
        >
          <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      )}
    </div>
  );
}

// ============================================================================
// Audit Entry Card Component
// ============================================================================

interface AuditEntryCardProps {
  entry: AuditEntry;
  isExpanded: boolean;
  onToggle: () => void;
}

function AuditEntryCard({ entry, isExpanded, onToggle }: AuditEntryCardProps) {
  const getTypeColor = (type: string) => {
    switch (type.toLowerCase()) {
      case 'transaction':
        return 'bg-blue-100 text-blue-700';
      case 'wallet':
        return 'bg-purple-100 text-purple-700';
      case 'settings':
        return 'bg-gray-100 text-gray-700';
      case 'security':
        return 'bg-red-100 text-red-700';
      case 'api':
        return 'bg-green-100 text-green-700';
      default:
        return 'bg-gray-100 text-gray-700';
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'success':
        return 'bg-green-100 text-green-700';
      case 'failed':
        return 'bg-red-100 text-red-700';
      case 'pending':
        return 'bg-yellow-100 text-yellow-700';
      default:
        return 'bg-gray-100 text-gray-700';
    }
  };

  return (
    <div className="rounded-xl border border-gray-200 bg-white">
      <button
        onClick={onToggle}
        className="w-full p-4 text-left hover:bg-gray-50"
      >
        <div className="flex items-start justify-between gap-4">
          <div className="flex-1">
            <div className="flex items-center gap-3">
              <span className={cn('rounded-md px-2 py-1 text-xs font-medium', getTypeColor(entry.type))}>
                {entry.type}
              </span>
              <span className={cn('rounded-full px-2 py-0.5 text-xs font-medium', getStatusColor(entry.status))}>
                {entry.status}
              </span>
              <span className="text-xs text-gray-500">{formatDateTime(entry.timestamp)}</span>
            </div>
            <div className="mt-2 font-medium">{entry.action}</div>
            <div className="mt-1 text-sm text-gray-600">{entry.details}</div>
          </div>
          <svg
            className={cn(
              'h-5 w-5 text-gray-400 transition-transform',
              isExpanded && 'rotate-180'
            )}
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
          </svg>
        </div>
      </button>

      {isExpanded && (
        <div className="border-t border-gray-200 bg-gray-50 p-4">
          <h5 className="mb-3 text-sm font-semibold text-gray-700">Metadata</h5>
          <div className="space-y-2">
            {entry.user && (
              <div className="flex justify-between text-sm">
                <span className="text-gray-500">User:</span>
                <span className="font-medium">{entry.user}</span>
              </div>
            )}
            {entry.ipAddress && (
              <div className="flex justify-between text-sm">
                <span className="text-gray-500">IP Address:</span>
                <span className="font-mono font-medium">{entry.ipAddress}</span>
              </div>
            )}
            {Object.entries(entry.metadata).map(([key, value]) => (
              <div key={key} className="flex justify-between text-sm">
                <span className="text-gray-500">{key}:</span>
                <span className="font-medium">{String(value)}</span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

// ============================================================================
// Filters Component
// ============================================================================

interface FiltersProps {
  typeFilter: string;
  statusFilter: string;
  dateRange: string;
  onTypeChange: (type: string) => void;
  onStatusChange: (status: string) => void;
  onDateRangeChange: (range: string) => void;
}

function Filters({
  typeFilter,
  statusFilter,
  dateRange,
  onTypeChange,
  onStatusChange,
  onDateRangeChange,
}: FiltersProps) {
  return (
    <div className="flex flex-wrap items-center gap-4">
      <select
        value={typeFilter}
        onChange={(e) => onTypeChange(e.target.value)}
        className="rounded-lg border border-gray-200 px-3 py-2 text-sm"
      >
        <option value="all">All Types</option>
        <option value="transaction">Transaction</option>
        <option value="wallet">Wallet</option>
        <option value="settings">Settings</option>
        <option value="security">Security</option>
        <option value="api">API</option>
      </select>

      <select
        value={statusFilter}
        onChange={(e) => onStatusChange(e.target.value)}
        className="rounded-lg border border-gray-200 px-3 py-2 text-sm"
      >
        <option value="all">All Status</option>
        <option value="success">Success</option>
        <option value="failed">Failed</option>
        <option value="pending">Pending</option>
      </select>

      <select
        value={dateRange}
        onChange={(e) => onDateRangeChange(e.target.value)}
        className="rounded-lg border border-gray-200 px-3 py-2 text-sm"
      >
        <option value="24h">Last 24 Hours</option>
        <option value="7d">Last 7 Days</option>
        <option value="30d">Last 30 Days</option>
        <option value="90d">Last 90 Days</option>
        <option value="all">All Time</option>
      </select>
    </div>
  );
}

// ============================================================================
// Main Component
// ============================================================================

export function AuditTrail({ walletAddresses, className }: AuditTrailProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [typeFilter, setTypeFilter] = useState('all');
  const [statusFilter, setStatusFilter] = useState('all');
  const [dateRange, setDateRange] = useState('30d');
  const [expandedEntries, setExpandedEntries] = useState<Set<string>>(new Set());

  const { data: transactionData, loading } = useTransactions(walletAddresses);

  // Convert transactions to audit entries
  const auditEntries = useMemo<AuditEntry[]>(() => {
    if (!transactionData?.transactions) return [];

    return transactionData.transactions.map((tx): AuditEntry => {
      const assetsText = tx.assets.map(a => 
        `${a.direction === 'in' ? '+' : '-'}${a.amount} ${a.symbol}`
      ).join(', ');

      return {
        id: tx.id,
        timestamp: tx.timestamp,
        type: 'transaction',
        action: `${tx.type.charAt(0).toUpperCase() + tx.type.slice(1)} Transaction`,
        details: `${assetsText} on ${tx.chain}`,
        status: tx.status === 'confirmed' ? 'success' : tx.status === 'failed' ? 'failed' : 'pending',
        metadata: {
          hash: tx.hash,
          chain: tx.chain,
          from: tx.from,
          to: tx.to,
          fee: `${tx.fee} ${tx.feeToken}`,
          ...(tx.protocol && { protocol: tx.protocol }),
        },
      };
    });
  }, [transactionData]);

  // Filter audit entries
  const filteredEntries = useMemo(() => {
    let result = [...auditEntries];

    // Search filter
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      result = result.filter(
        (entry) =>
          entry.action.toLowerCase().includes(query) ||
          entry.details.toLowerCase().includes(query) ||
          entry.type.toLowerCase().includes(query)
      );
    }

    // Type filter
    if (typeFilter !== 'all') {
      result = result.filter((entry) => entry.type === typeFilter);
    }

    // Status filter
    if (statusFilter !== 'all') {
      result = result.filter((entry) => entry.status === statusFilter);
    }

    // Date range filter
    if (dateRange !== 'all') {
      const now = Date.now();
      const ranges: Record<string, number> = {
        '24h': 24 * 60 * 60 * 1000,
        '7d': 7 * 24 * 60 * 60 * 1000,
        '30d': 30 * 24 * 60 * 60 * 1000,
        '90d': 90 * 24 * 60 * 60 * 1000,
      };
      const cutoff = now - (ranges[dateRange] || 0);
      result = result.filter((entry) => new Date(entry.timestamp).getTime() >= cutoff);
    }

    return result;
  }, [auditEntries, searchQuery, typeFilter, statusFilter, dateRange]);

  const handleToggleExpand = (entryId: string) => {
    setExpandedEntries((prev) => {
      const newSet = new Set(prev);
      if (newSet.has(entryId)) {
        newSet.delete(entryId);
      } else {
        newSet.add(entryId);
      }
      return newSet;
    });
  };

  const handleExport = () => {
    const csvContent = [
      'Timestamp,Type,Action,Details,Status',
      ...filteredEntries.map(e => 
        `${e.timestamp},${e.type},${e.action},"${e.details}",${e.status}`
      )
    ].join('\n');
    
    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'audit-trail.csv';
    a.click();
    URL.revokeObjectURL(url);
  };

  if (loading) {
    return (
      <div className={cn('space-y-6', className)}>
        <div className="animate-pulse space-y-4">
          {[...Array(5)].map((_, i) => (
            <div key={i} className="h-24 rounded-xl bg-gray-200" />
          ))}
        </div>
      </div>
    );
  }

  if (walletAddresses.length === 0) {
    return (
      <div className={cn('space-y-6', className)}>
        <div className="rounded-2xl border-2 border-dashed border-gray-300 bg-gray-50 p-12 text-center">
          <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
          </svg>
          <h3 className="mt-4 text-lg font-semibold text-gray-900">No Wallet Connected</h3>
          <p className="mt-2 text-sm text-gray-500">
            Add wallet addresses in the Portfolio Dashboard to view audit trail.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className={cn('space-y-6', className)}>
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-lg font-semibold">Audit Trail</h3>
          <p className="text-sm text-gray-500">{filteredEntries.length} entries</p>
        </div>
        <button
          onClick={handleExport}
          className="rounded-lg border border-gray-200 px-4 py-2 text-sm font-medium hover:bg-gray-50"
        >
          Export CSV
        </button>
      </div>

      {/* Search and Filters */}
      <div className="space-y-4">
        <SearchBar
          value={searchQuery}
          onChange={setSearchQuery}
          onClear={() => setSearchQuery('')}
        />
        <Filters
          typeFilter={typeFilter}
          statusFilter={statusFilter}
          dateRange={dateRange}
          onTypeChange={setTypeFilter}
          onStatusChange={setStatusFilter}
          onDateRangeChange={setDateRange}
        />
      </div>

      {/* Audit Entries */}
      <div className="space-y-3">
        {filteredEntries.map((entry) => (
          <AuditEntryCard
            key={entry.id}
            entry={entry}
            isExpanded={expandedEntries.has(entry.id)}
            onToggle={() => handleToggleExpand(entry.id)}
          />
        ))}
      </div>

      {filteredEntries.length === 0 && (
        <div className="rounded-2xl border-2 border-dashed border-gray-300 bg-gray-50 p-12 text-center">
          <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
          </svg>
          <h3 className="mt-4 text-lg font-semibold text-gray-900">No Entries Found</h3>
          <p className="mt-2 text-sm text-gray-500">
            {searchQuery
              ? 'Try adjusting your search or filters'
              : 'No audit entries available for the selected criteria'}
          </p>
        </div>
      )}
    </div>
  );
}

export default AuditTrail;
