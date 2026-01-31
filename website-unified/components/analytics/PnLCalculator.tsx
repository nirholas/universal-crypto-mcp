'use client';

/**
 * PnL Calculator Component
 * 
 * Comprehensive profit and loss tracking with realized/unrealized gains,
 * tax lot selection, cost basis methods, and export functionality.
 */

import React, { useState, useMemo } from 'react';
import { cn } from '@/lib/utils/cn';
import type { PnLSummary, PnLByAsset, TaxLot, CostBasisMethod } from '@/lib/analytics/types';
import { formatCurrency, formatPercentage, formatDate } from '@/lib/analytics/hooks';

// ============================================================================
// Types
// ============================================================================

interface PnLCalculatorProps {
  data: PnLSummary | null;
  loading?: boolean;
  onMethodChange?: (method: CostBasisMethod) => void;
  onExport?: (format: 'csv' | 'pdf') => void;
  currentMethod?: CostBasisMethod;
  className?: string;
}

type ViewTab = 'summary' | 'by-asset' | 'tax-lots';
type SortField = 'asset' | 'pnl' | 'value' | 'costBasis';
type SortDirection = 'asc' | 'desc';

// ============================================================================
// Constants
// ============================================================================

const COST_BASIS_METHODS: { value: CostBasisMethod; label: string; description: string }[] = [
  { value: 'FIFO', label: 'FIFO', description: 'First In, First Out' },
  { value: 'LIFO', label: 'LIFO', description: 'Last In, First Out' },
  { value: 'HIFO', label: 'HIFO', description: 'Highest In, First Out' },
  { value: 'ACB', label: 'ACB', description: 'Average Cost Basis' },
];

// ============================================================================
// Summary Cards Component
// ============================================================================

interface SummaryCardsProps {
  data: PnLSummary;
}

function SummaryCards({ data }: SummaryCardsProps) {
  const totalPnL = data.totalRealizedGains + data.totalUnrealizedGains;
  const totalPnLPercent = data.totalCostBasis > 0 
    ? ((data.currentValue - data.totalCostBasis) / data.totalCostBasis) * 100 
    : 0;

  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
      {/* Total P&L */}
      <div className="rounded-xl bg-gradient-to-br from-gray-900 to-gray-800 p-4 text-white">
        <div className="text-sm opacity-80">Total P&L</div>
        <div className="mt-1 text-2xl font-bold">
          {formatCurrency(totalPnL)}
        </div>
        <div className={cn(
          'mt-1 text-sm',
          totalPnL >= 0 ? 'text-green-400' : 'text-red-400'
        )}>
          {formatPercentage(totalPnLPercent)}
        </div>
      </div>

      {/* Realized Gains */}
      <div className="rounded-xl border border-gray-200 bg-white p-4">
        <div className="text-sm text-gray-500">Realized Gains</div>
        <div className={cn(
          'mt-1 text-2xl font-bold',
          data.totalRealizedGains >= 0 ? 'text-green-600' : 'text-red-600'
        )}>
          {formatCurrency(data.totalRealizedGains)}
        </div>
        <div className="mt-1 flex gap-3 text-xs">
          <span className="text-gray-500">
            ST: <span className={data.shortTermGains >= 0 ? 'text-green-600' : 'text-red-600'}>
              {formatCurrency(data.shortTermGains)}
            </span>
          </span>
          <span className="text-gray-500">
            LT: <span className={data.longTermGains >= 0 ? 'text-green-600' : 'text-red-600'}>
              {formatCurrency(data.longTermGains)}
            </span>
          </span>
        </div>
      </div>

      {/* Unrealized Gains */}
      <div className="rounded-xl border border-gray-200 bg-white p-4">
        <div className="text-sm text-gray-500">Unrealized Gains</div>
        <div className={cn(
          'mt-1 text-2xl font-bold',
          data.totalUnrealizedGains >= 0 ? 'text-green-600' : 'text-red-600'
        )}>
          {formatCurrency(data.totalUnrealizedGains)}
        </div>
        <div className="mt-1 text-xs text-gray-500">
          {data.taxLots.length} open positions
        </div>
      </div>

      {/* Cost Basis */}
      <div className="rounded-xl border border-gray-200 bg-white p-4">
        <div className="text-sm text-gray-500">Total Cost Basis</div>
        <div className="mt-1 text-2xl font-bold">
          {formatCurrency(data.totalCostBasis)}
        </div>
        <div className="mt-1 text-xs text-gray-500">
          Current: {formatCurrency(data.currentValue)}
        </div>
      </div>
    </div>
  );
}

// ============================================================================
// By Asset Table Component
// ============================================================================

interface ByAssetTableProps {
  taxLots: TaxLot[];
}

function ByAssetTable({ taxLots }: ByAssetTableProps) {
  const [sortField, setSortField] = useState<SortField>('pnl');
  const [sortDirection, setSortDirection] = useState<SortDirection>('desc');

  // Aggregate by asset
  const byAsset = useMemo(() => {
    const assetMap = new Map<string, PnLByAsset>();
    
    taxLots.forEach((lot) => {
      const existing = assetMap.get(lot.asset);
      if (existing) {
        existing.unrealizedPnL += lot.unrealizedGain;
        existing.costBasis += lot.costBasis;
        existing.currentValue += lot.currentValue;
        existing.transactions += 1;
      } else {
        assetMap.set(lot.asset, {
          symbol: lot.asset,
          name: lot.asset,
          realizedPnL: 0, // Would need actual realized data
          unrealizedPnL: lot.unrealizedGain,
          costBasis: lot.costBasis,
          currentValue: lot.currentValue,
          transactions: 1,
        });
      }
    });
    
    return Array.from(assetMap.values());
  }, [taxLots]);

  // Sort data
  const sortedData = useMemo(() => {
    return [...byAsset].sort((a, b) => {
      let aVal: number, bVal: number;
      
      switch (sortField) {
        case 'asset':
          return sortDirection === 'asc'
            ? a.symbol.localeCompare(b.symbol)
            : b.symbol.localeCompare(a.symbol);
        case 'pnl':
          aVal = a.realizedPnL + a.unrealizedPnL;
          bVal = b.realizedPnL + b.unrealizedPnL;
          break;
        case 'value':
          aVal = a.currentValue;
          bVal = b.currentValue;
          break;
        case 'costBasis':
          aVal = a.costBasis;
          bVal = b.costBasis;
          break;
        default:
          return 0;
      }
      
      return sortDirection === 'asc' ? aVal - bVal : bVal - aVal;
    });
  }, [byAsset, sortField, sortDirection]);

  const handleSort = (field: SortField) => {
    if (sortField === field) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortDirection('desc');
    }
  };

  const SortHeader = ({ field, children }: { field: SortField; children: React.ReactNode }) => (
    <th
      className="cursor-pointer px-4 py-3 text-left text-sm font-semibold text-gray-700 hover:bg-gray-50"
      onClick={() => handleSort(field)}
    >
      <div className="flex items-center gap-1">
        {children}
        {sortField === field && (
          <span className="text-xs">{sortDirection === 'asc' ? '↑' : '↓'}</span>
        )}
      </div>
    </th>
  );

  return (
    <div className="overflow-x-auto">
      <table className="w-full">
        <thead className="bg-gray-50">
          <tr>
            <SortHeader field="asset">Asset</SortHeader>
            <SortHeader field="costBasis">Cost Basis</SortHeader>
            <SortHeader field="value">Current Value</SortHeader>
            <SortHeader field="pnl">Total P&L</SortHeader>
            <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">Return %</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-100">
          {sortedData.map((asset) => {
            const totalPnL = asset.realizedPnL + asset.unrealizedPnL;
            const returnPct = asset.costBasis > 0 
              ? ((asset.currentValue - asset.costBasis) / asset.costBasis) * 100 
              : 0;

            return (
              <tr key={asset.symbol} className="hover:bg-gray-50">
                <td className="px-4 py-3">
                  <div className="font-semibold">{asset.symbol}</div>
                  <div className="text-xs text-gray-500">{asset.transactions} lots</div>
                </td>
                <td className="px-4 py-3 font-medium">
                  {formatCurrency(asset.costBasis)}
                </td>
                <td className="px-4 py-3 font-medium">
                  {formatCurrency(asset.currentValue)}
                </td>
                <td className={cn(
                  'px-4 py-3 font-semibold',
                  totalPnL >= 0 ? 'text-green-600' : 'text-red-600'
                )}>
                  {formatCurrency(totalPnL)}
                </td>
                <td className={cn(
                  'px-4 py-3',
                  returnPct >= 0 ? 'text-green-600' : 'text-red-600'
                )}>
                  {formatPercentage(returnPct)}
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}

// ============================================================================
// Tax Lots Table Component
// ============================================================================

interface TaxLotsTableProps {
  taxLots: TaxLot[];
}

function TaxLotsTable({ taxLots }: TaxLotsTableProps) {
  const [filter, setFilter] = useState<'all' | 'short' | 'long'>('all');

  const filteredLots = useMemo(() => {
    if (filter === 'all') return taxLots;
    return taxLots.filter((lot) => lot.holdingPeriod === filter);
  }, [taxLots, filter]);

  return (
    <div>
      {/* Filter */}
      <div className="mb-4 flex gap-2">
        {(['all', 'short', 'long'] as const).map((f) => (
          <button
            key={f}
            onClick={() => setFilter(f)}
            className={cn(
              'rounded-lg px-3 py-1.5 text-sm font-medium capitalize transition-all',
              filter === f
                ? 'bg-black text-white'
                : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
            )}
          >
            {f === 'all' ? 'All Lots' : `${f}-term`}
          </button>
        ))}
      </div>

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">Asset</th>
              <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">Acquired</th>
              <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">Quantity</th>
              <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">Cost Basis</th>
              <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">Current Value</th>
              <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">Unrealized Gain</th>
              <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">Holding</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {filteredLots.map((lot) => (
              <tr key={lot.id} className="hover:bg-gray-50">
                <td className="px-4 py-3 font-semibold">{lot.asset}</td>
                <td className="px-4 py-3 text-sm text-gray-600">
                  {formatDate(lot.acquiredDate)}
                </td>
                <td className="px-4 py-3 font-medium">{lot.quantity.toFixed(6)}</td>
                <td className="px-4 py-3">{formatCurrency(lot.costBasis)}</td>
                <td className="px-4 py-3">{formatCurrency(lot.currentValue)}</td>
                <td className={cn(
                  'px-4 py-3 font-semibold',
                  lot.unrealizedGain >= 0 ? 'text-green-600' : 'text-red-600'
                )}>
                  {formatCurrency(lot.unrealizedGain)}
                </td>
                <td className="px-4 py-3">
                  <span className={cn(
                    'inline-flex rounded-full px-2 py-0.5 text-xs font-medium',
                    lot.holdingPeriod === 'long'
                      ? 'bg-green-100 text-green-700'
                      : 'bg-yellow-100 text-yellow-700'
                  )}>
                    {lot.holdingPeriod === 'long' ? 'Long-term' : 'Short-term'}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

// ============================================================================
// Loading Skeleton
// ============================================================================

function LoadingSkeleton() {
  return (
    <div className="space-y-4">
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {[1, 2, 3, 4].map((i) => (
          <div key={i} className="h-28 animate-pulse rounded-xl bg-gray-200" />
        ))}
      </div>
      <div className="h-64 animate-pulse rounded-xl bg-gray-200" />
    </div>
  );
}

// ============================================================================
// Main Component
// ============================================================================

export function PnLCalculator({
  data,
  loading = false,
  onMethodChange,
  onExport,
  currentMethod = 'FIFO',
  className,
}: PnLCalculatorProps) {
  const [activeTab, setActiveTab] = useState<ViewTab>('summary');
  const [selectedMethod, setSelectedMethod] = useState<CostBasisMethod>(currentMethod);

  const handleMethodChange = (method: CostBasisMethod) => {
    setSelectedMethod(method);
    onMethodChange?.(method);
  };

  if (loading) {
    return (
      <div className={cn('rounded-2xl border-2 border-gray-200 bg-white p-6', className)}>
        <h3 className="mb-6 text-lg font-semibold">Profit & Loss</h3>
        <LoadingSkeleton />
      </div>
    );
  }

  if (!data) {
    return (
      <div className={cn('rounded-2xl border-2 border-gray-200 bg-white p-6', className)}>
        <h3 className="mb-6 text-lg font-semibold">Profit & Loss</h3>
        <div className="flex h-48 items-center justify-center text-gray-500">
          No P&L data available
        </div>
      </div>
    );
  }

  return (
    <div className={cn('rounded-2xl border-2 border-gray-200 bg-white p-6', className)}>
      {/* Header */}
      <div className="mb-6 flex flex-wrap items-center justify-between gap-4">
        <h3 className="text-lg font-semibold">Profit & Loss</h3>
        
        <div className="flex flex-wrap items-center gap-3">
          {/* Cost Basis Method Selector */}
          <div className="flex items-center gap-2">
            <span className="text-sm text-gray-500">Method:</span>
            <select
              value={selectedMethod}
              onChange={(e) => handleMethodChange(e.target.value as CostBasisMethod)}
              className="rounded-lg border border-gray-200 bg-white px-3 py-1.5 text-sm font-medium focus:border-black focus:outline-none"
            >
              {COST_BASIS_METHODS.map((method) => (
                <option key={method.value} value={method.value}>
                  {method.label} - {method.description}
                </option>
              ))}
            </select>
          </div>

          {/* Export Buttons */}
          {onExport && (
            <div className="flex gap-2">
              <button
                onClick={() => onExport('csv')}
                className="rounded-lg bg-gray-100 px-3 py-1.5 text-sm font-medium text-gray-700 hover:bg-gray-200"
              >
                Export CSV
              </button>
              <button
                onClick={() => onExport('pdf')}
                className="rounded-lg bg-gray-100 px-3 py-1.5 text-sm font-medium text-gray-700 hover:bg-gray-200"
              >
                Export PDF
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Summary Cards */}
      <SummaryCards data={data} />

      {/* Tabs */}
      <div className="mt-6 border-b border-gray-200">
        <div className="flex gap-6">
          {([
            { value: 'summary', label: 'Summary' },
            { value: 'by-asset', label: 'By Asset' },
            { value: 'tax-lots', label: 'Tax Lots' },
          ] as const).map((tab) => (
            <button
              key={tab.value}
              onClick={() => setActiveTab(tab.value)}
              className={cn(
                'border-b-2 pb-3 text-sm font-medium transition-all',
                activeTab === tab.value
                  ? 'border-black text-black'
                  : 'border-transparent text-gray-500 hover:text-gray-700'
              )}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* Tab Content */}
      <div className="mt-6">
        {activeTab === 'summary' && (
          <div className="space-y-6">
            {/* Gains Breakdown */}
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="rounded-xl bg-green-50 p-4">
                <h4 className="font-semibold text-green-900">Gains</h4>
                <div className="mt-2 space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-green-700">Short-term</span>
                    <span className="font-medium text-green-900">
                      {formatCurrency(Math.max(0, data.shortTermGains))}
                    </span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-green-700">Long-term</span>
                    <span className="font-medium text-green-900">
                      {formatCurrency(Math.max(0, data.longTermGains))}
                    </span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-green-700">Unrealized</span>
                    <span className="font-medium text-green-900">
                      {formatCurrency(Math.max(0, data.totalUnrealizedGains))}
                    </span>
                  </div>
                </div>
              </div>

              <div className="rounded-xl bg-red-50 p-4">
                <h4 className="font-semibold text-red-900">Losses</h4>
                <div className="mt-2 space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-red-700">Short-term</span>
                    <span className="font-medium text-red-900">
                      {formatCurrency(Math.abs(Math.min(0, data.shortTermGains)))}
                    </span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-red-700">Long-term</span>
                    <span className="font-medium text-red-900">
                      {formatCurrency(Math.abs(Math.min(0, data.longTermGains)))}
                    </span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-red-700">Unrealized</span>
                    <span className="font-medium text-red-900">
                      {formatCurrency(Math.abs(Math.min(0, data.totalUnrealizedGains)))}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Method Info */}
            <div className="rounded-xl bg-gray-50 p-4">
              <div className="flex items-start gap-3">
                <div className="rounded-full bg-gray-200 p-2">
                  <svg className="h-4 w-4 text-gray-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <div>
                  <h4 className="font-semibold">
                    {COST_BASIS_METHODS.find((m) => m.value === selectedMethod)?.description}
                  </h4>
                  <p className="mt-1 text-sm text-gray-600">
                    {selectedMethod === 'FIFO' && 'Sells oldest lots first. Often results in lower short-term gains.'}
                    {selectedMethod === 'LIFO' && 'Sells newest lots first. May defer long-term gains.'}
                    {selectedMethod === 'HIFO' && 'Sells highest cost lots first. Minimizes taxable gains.'}
                    {selectedMethod === 'ACB' && 'Uses average cost of all lots. Simplest method for reporting.'}
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'by-asset' && (
          <ByAssetTable taxLots={data.taxLots} />
        )}

        {activeTab === 'tax-lots' && (
          <TaxLotsTable taxLots={data.taxLots} />
        )}
      </div>
    </div>
  );
}

export default PnLCalculator;
