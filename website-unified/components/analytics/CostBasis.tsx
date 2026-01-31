'use client';

/**
 * Cost Basis Component
 * 
 * Track cost basis for crypto assets with multiple accounting methods
 * (FIFO, LIFO, HIFO, Specific ID) for accurate tax reporting.
 */

import React, { useState, useMemo } from 'react';
import { cn } from '@/lib/utils/cn';
import { useTransactions, formatCurrency, formatDate } from '@/lib/analytics/hooks';
import type { CostBasisMethod, Transaction } from '@/lib/analytics/types';

// ============================================================================
// Types
// ============================================================================

interface CostBasisProps {
  walletAddresses: string[];
  className?: string;
}

interface TaxLot {
  id: string;
  asset: string;
  purchaseDate: string;
  amount: number;
  costBasis: number;
  currentValue: number;
  unrealizedGainLoss: number;
  holdingPeriod: 'short' | 'long';
}

// ============================================================================
// Method Selector Component
// ============================================================================

interface MethodSelectorProps {
  selected: CostBasisMethod;
  onSelect: (method: CostBasisMethod) => void;
}

function MethodSelector({ selected, onSelect }: MethodSelectorProps) {
  const methods: { id: CostBasisMethod; name: string; description: string }[] = [
    { 
      id: 'fifo', 
      name: 'FIFO', 
      description: 'First In, First Out - Sells oldest assets first' 
    },
    { 
      id: 'lifo', 
      name: 'LIFO', 
      description: 'Last In, First Out - Sells newest assets first' 
    },
    { 
      id: 'hifo', 
      name: 'HIFO', 
      description: 'Highest In, First Out - Sells highest cost assets first' 
    },
    { 
      id: 'specific', 
      name: 'Specific ID', 
      description: 'Manually select which lots to sell' 
    },
  ];

  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
      {methods.map((method) => (
        <button
          key={method.id}
          onClick={() => onSelect(method.id)}
          className={cn(
            'rounded-xl border-2 p-4 text-left transition-all',
            selected === method.id
              ? 'border-black bg-gray-50'
              : 'border-gray-200 hover:border-gray-300'
          )}
        >
          <div className="font-semibold">{method.name}</div>
          <div className="mt-1 text-xs text-gray-500">{method.description}</div>
        </button>
      ))}
    </div>
  );
}

// ============================================================================
// Tax Lots Table Component
// ============================================================================

interface TaxLotsTableProps {
  lots: TaxLot[];
  method: CostBasisMethod;
  onSelectLot?: (lotId: string) => void;
  selectedLots?: Set<string>;
}

function TaxLotsTable({ lots, method, onSelectLot, selectedLots }: TaxLotsTableProps) {
  const totals = useMemo(() => {
    const totalCost = lots.reduce((sum, lot) => sum + lot.costBasis, 0);
    const totalValue = lots.reduce((sum, lot) => sum + lot.currentValue, 0);
    const totalGainLoss = lots.reduce((sum, lot) => sum + lot.unrealizedGainLoss, 0);
    return { totalCost, totalValue, totalGainLoss };
  }, [lots]);

  return (
    <div className="rounded-xl border border-gray-200 bg-white">
      <div className="border-b border-gray-200 bg-gray-50 px-6 py-4">
        <div className="flex items-center justify-between">
          <div>
            <h4 className="font-semibold">Tax Lots</h4>
            <p className="text-xs text-gray-500">
              {lots.length} lots • Method: {method.toUpperCase()}
            </p>
          </div>
          {method === 'specific' && onSelectLot && (
            <span className="text-xs text-gray-500">
              Click rows to select lots
            </span>
          )}
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-gray-50">
            <tr>
              {method === 'specific' && (
                <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">
                  <input type="checkbox" className="rounded" />
                </th>
              )}
              <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">Purchase Date</th>
              <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">Asset</th>
              <th className="px-4 py-3 text-right text-sm font-semibold text-gray-700">Amount</th>
              <th className="px-4 py-3 text-right text-sm font-semibold text-gray-700">Cost Basis</th>
              <th className="px-4 py-3 text-right text-sm font-semibold text-gray-700">Current Value</th>
              <th className="px-4 py-3 text-right text-sm font-semibold text-gray-700">Unrealized G/L</th>
              <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">Holding Period</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {lots.map((lot) => (
              <tr 
                key={lot.id} 
                className={cn(
                  'hover:bg-gray-50',
                  method === 'specific' && onSelectLot && 'cursor-pointer',
                  selectedLots?.has(lot.id) && 'bg-blue-50'
                )}
                onClick={() => method === 'specific' && onSelectLot?.(lot.id)}
              >
                {method === 'specific' && (
                  <td className="px-4 py-3">
                    <input 
                      type="checkbox" 
                      className="rounded"
                      checked={selectedLots?.has(lot.id)}
                      readOnly
                    />
                  </td>
                )}
                <td className="px-4 py-3 text-sm">{formatDate(lot.purchaseDate)}</td>
                <td className="px-4 py-3 text-sm font-medium">{lot.asset}</td>
                <td className="px-4 py-3 text-right text-sm">{lot.amount.toFixed(8)}</td>
                <td className="px-4 py-3 text-right text-sm">{formatCurrency(lot.costBasis)}</td>
                <td className="px-4 py-3 text-right text-sm">{formatCurrency(lot.currentValue)}</td>
                <td className="px-4 py-3 text-right">
                  <span className={cn(
                    'font-medium',
                    lot.unrealizedGainLoss >= 0 ? 'text-green-600' : 'text-red-600'
                  )}>
                    {lot.unrealizedGainLoss >= 0 ? '+' : ''}{formatCurrency(lot.unrealizedGainLoss)}
                  </span>
                </td>
                <td className="px-4 py-3">
                  <span className={cn(
                    'rounded-full px-2 py-0.5 text-xs font-medium',
                    lot.holdingPeriod === 'short' 
                      ? 'bg-yellow-100 text-yellow-700'
                      : 'bg-green-100 text-green-700'
                  )}>
                    {lot.holdingPeriod === 'short' ? 'Short-term' : 'Long-term'}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
          <tfoot className="border-t-2 border-gray-300 bg-gray-50 font-semibold">
            <tr>
              <td colSpan={method === 'specific' ? 4 : 3} className="px-4 py-3 text-sm">Total</td>
              <td className="px-4 py-3 text-right text-sm">{formatCurrency(totals.totalCost)}</td>
              <td className="px-4 py-3 text-right text-sm">{formatCurrency(totals.totalValue)}</td>
              <td className="px-4 py-3 text-right">
                <span className={cn(
                  totals.totalGainLoss >= 0 ? 'text-green-600' : 'text-red-600'
                )}>
                  {totals.totalGainLoss >= 0 ? '+' : ''}{formatCurrency(totals.totalGainLoss)}
                </span>
              </td>
              <td></td>
            </tr>
          </tfoot>
        </table>
      </div>

      {lots.length === 0 && (
        <div className="py-8 text-center text-sm text-gray-500">
          No tax lots available
        </div>
      )}
    </div>
  );
}

// ============================================================================
// Summary Stats Component
// ============================================================================

interface SummaryStatsProps {
  lots: TaxLot[];
}

function SummaryStats({ lots }: SummaryStatsProps) {
  const stats = useMemo(() => {
    const totalCost = lots.reduce((sum, lot) => sum + lot.costBasis, 0);
    const totalValue = lots.reduce((sum, lot) => sum + lot.currentValue, 0);
    const totalGainLoss = totalValue - totalCost;
    const returnPct = totalCost > 0 ? ((totalValue - totalCost) / totalCost) * 100 : 0;
    
    const shortTermLots = lots.filter(l => l.holdingPeriod === 'short');
    const longTermLots = lots.filter(l => l.holdingPeriod === 'long');

    return {
      totalCost,
      totalValue,
      totalGainLoss,
      returnPct,
      shortTermCount: shortTermLots.length,
      longTermCount: longTermLots.length,
    };
  }, [lots]);

  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
      <div className="rounded-xl border-2 border-gray-200 bg-white p-6">
        <div className="text-sm text-gray-500">Total Cost Basis</div>
        <div className="mt-2 text-2xl font-bold">{formatCurrency(stats.totalCost)}</div>
        <div className="mt-1 text-xs text-gray-500">{lots.length} tax lots</div>
      </div>

      <div className="rounded-xl border-2 border-gray-200 bg-white p-6">
        <div className="text-sm text-gray-500">Current Value</div>
        <div className="mt-2 text-2xl font-bold">{formatCurrency(stats.totalValue)}</div>
        <div className="mt-1 text-xs text-gray-500">Market value</div>
      </div>

      <div className={cn(
        'rounded-xl p-6',
        stats.totalGainLoss >= 0
          ? 'bg-gradient-to-br from-green-500 to-emerald-600 text-white'
          : 'bg-gradient-to-br from-red-500 to-rose-600 text-white'
      )}>
        <div className="text-sm opacity-80">Unrealized G/L</div>
        <div className="mt-2 text-2xl font-bold">
          {stats.totalGainLoss >= 0 ? '+' : ''}{formatCurrency(stats.totalGainLoss)}
        </div>
        <div className="mt-1 text-xs opacity-80">
          {stats.returnPct >= 0 ? '+' : ''}{stats.returnPct.toFixed(2)}%
        </div>
      </div>

      <div className="rounded-xl border-2 border-gray-200 bg-white p-6">
        <div className="text-sm text-gray-500">Holding Periods</div>
        <div className="mt-2 flex items-center gap-4">
          <div>
            <div className="text-lg font-bold text-yellow-600">{stats.shortTermCount}</div>
            <div className="text-xs text-gray-500">Short-term</div>
          </div>
          <div>
            <div className="text-lg font-bold text-green-600">{stats.longTermCount}</div>
            <div className="text-xs text-gray-500">Long-term</div>
          </div>
        </div>
      </div>
    </div>
  );
}

// ============================================================================
// Main Component
// ============================================================================

export function CostBasis({ walletAddresses, className }: CostBasisProps) {
  const [method, setMethod] = useState<CostBasisMethod>('fifo');
  const [selectedLots, setSelectedLots] = useState<Set<string>>(new Set());
  const [assetFilter, setAssetFilter] = useState('all');

  const { data: transactionData, loading } = useTransactions(walletAddresses);

  // Generate tax lots from transactions (simplified - real implementation would use API)
  const taxLots = useMemo<TaxLot[]>(() => {
    if (!transactionData?.transactions) return [];
    
    // This is a simplified mock - real implementation would fetch from API
    const lots: TaxLot[] = [];
    const buyTransactions = transactionData.transactions.filter(
      tx => tx.type === 'receive' || tx.type === 'swap'
    );

    buyTransactions.forEach((tx, idx) => {
      tx.assets.filter(a => a.direction === 'in').forEach((asset, assetIdx) => {
        const purchaseDate = tx.timestamp;
        const daysSincePurchase = Math.floor(
          (Date.now() - new Date(purchaseDate).getTime()) / (1000 * 60 * 60 * 24)
        );
        
        lots.push({
          id: `${tx.id}-${assetIdx}`,
          asset: asset.symbol,
          purchaseDate,
          amount: asset.amount,
          costBasis: asset.value,
          currentValue: asset.value * (1 + (Math.random() * 0.4 - 0.2)), // Mock current value
          unrealizedGainLoss: asset.value * (Math.random() * 0.4 - 0.2), // Mock gain/loss
          holdingPeriod: daysSincePurchase > 365 ? 'long' : 'short',
        });
      });
    });

    return lots;
  }, [transactionData]);

  const filteredLots = useMemo(() => {
    if (assetFilter === 'all') return taxLots;
    return taxLots.filter(lot => lot.asset === assetFilter);
  }, [taxLots, assetFilter]);

  const availableAssets = useMemo(() => {
    return ['all', ...new Set(taxLots.map(lot => lot.asset))];
  }, [taxLots]);

  const handleSelectLot = (lotId: string) => {
    if (method !== 'specific') return;
    
    setSelectedLots((prev) => {
      const newSet = new Set(prev);
      if (newSet.has(lotId)) {
        newSet.delete(lotId);
      } else {
        newSet.add(lotId);
      }
      return newSet;
    });
  };

  if (loading) {
    return (
      <div className={cn('space-y-6', className)}>
        <div className="animate-pulse space-y-6">
          <div className="h-24 rounded-xl bg-gray-200" />
          <div className="grid gap-4 sm:grid-cols-4">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="h-32 rounded-xl bg-gray-200" />
            ))}
          </div>
          <div className="h-96 rounded-xl bg-gray-200" />
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
            Add wallet addresses in the Portfolio Dashboard to track cost basis.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className={cn('space-y-6', className)}>
      {/* Method Selector */}
      <MethodSelector selected={method} onSelect={setMethod} />

      {/* Summary Stats */}
      <SummaryStats lots={filteredLots} />

      {/* Filters */}
      <div className="flex items-center gap-4">
        <label className="text-sm font-medium text-gray-700">Filter by Asset:</label>
        <select
          value={assetFilter}
          onChange={(e) => setAssetFilter(e.target.value)}
          className="rounded-lg border border-gray-200 px-3 py-2 text-sm"
        >
          {availableAssets.map((asset) => (
            <option key={asset} value={asset}>
              {asset === 'all' ? 'All Assets' : asset}
            </option>
          ))}
        </select>

        <div className="ml-auto flex gap-2">
          <button className="rounded-lg border border-gray-200 px-4 py-2 text-sm font-medium hover:bg-gray-50">
            Export CSV
          </button>
          {method === 'specific' && selectedLots.size > 0 && (
            <button className="rounded-lg bg-black px-4 py-2 text-sm font-medium text-white hover:bg-gray-900">
              Sell {selectedLots.size} Selected Lots
            </button>
          )}
        </div>
      </div>

      {/* Tax Lots Table */}
      <TaxLotsTable 
        lots={filteredLots} 
        method={method}
        onSelectLot={handleSelectLot}
        selectedLots={selectedLots}
      />

      {/* Tax Optimization Tips */}
      <div className="rounded-xl border border-blue-200 bg-blue-50 p-6">
        <h4 className="font-semibold text-blue-900">Tax Optimization Tips</h4>
        <ul className="mt-3 space-y-2 text-sm text-blue-800">
          <li className="flex items-start gap-2">
            <span className="mt-0.5">•</span>
            <span>HIFO method typically minimizes short-term capital gains</span>
          </li>
          <li className="flex items-start gap-2">
            <span className="mt-0.5">•</span>
            <span>Hold assets for over 1 year to qualify for long-term capital gains rates</span>
          </li>
          <li className="flex items-start gap-2">
            <span className="mt-0.5">•</span>
            <span>Consider tax-loss harvesting to offset gains with losses</span>
          </li>
          <li className="flex items-start gap-2">
            <span className="mt-0.5">•</span>
            <span>Specific ID method gives you the most control but requires detailed record-keeping</span>
          </li>
        </ul>
      </div>
    </div>
  );
}

export default CostBasis;
