'use client';

/**
 * Protocol Analytics Component
 * 
 * Compare DeFi protocols by TVL, revenue, users, and risk metrics.
 */

import React, { useState, useMemo } from 'react';
import { cn } from '@/lib/utils/cn';
import type { ProtocolData } from '@/lib/analytics/types';
import { formatCurrency, formatNumber, formatPercentage } from '@/lib/analytics/hooks';

// ============================================================================
// Types
// ============================================================================

interface ProtocolAnalyticsProps {
  className?: string;
}

// ============================================================================
// Mock Data
// ============================================================================

const MOCK_PROTOCOLS: ProtocolData[] = [
  {
    id: 'aave',
    name: 'Aave',
    logo: '/protocols/aave.svg',
    tvl: 12500000000,
    tvlChange24h: 2.3,
    tvlChange7d: 5.8,
    revenue24h: 850000,
    fees24h: 1200000,
    users24h: 15000,
    chains: ['Ethereum', 'Polygon', 'Arbitrum', 'Optimism', 'Avalanche'],
    category: 'Lending',
    auditStatus: 'audited',
    governanceToken: 'AAVE',
    tokenPrice: 92.50,
    tokenChange24h: 3.2,
  },
  {
    id: 'uniswap',
    name: 'Uniswap',
    logo: '/protocols/uniswap.svg',
    tvl: 5800000000,
    tvlChange24h: -1.2,
    tvlChange7d: 3.5,
    revenue24h: 2100000,
    fees24h: 2800000,
    users24h: 45000,
    chains: ['Ethereum', 'Polygon', 'Arbitrum', 'Optimism', 'Base'],
    category: 'DEX',
    auditStatus: 'audited',
    governanceToken: 'UNI',
    tokenPrice: 7.85,
    tokenChange24h: 1.8,
  },
  {
    id: 'lido',
    name: 'Lido',
    logo: '/protocols/lido.svg',
    tvl: 28500000000,
    tvlChange24h: 0.8,
    tvlChange7d: 2.1,
    revenue24h: 450000,
    fees24h: 450000,
    users24h: 2500,
    chains: ['Ethereum', 'Polygon', 'Solana'],
    category: 'Liquid Staking',
    auditStatus: 'audited',
    governanceToken: 'LDO',
    tokenPrice: 2.15,
    tokenChange24h: -0.5,
  },
  {
    id: 'curve',
    name: 'Curve',
    logo: '/protocols/curve.svg',
    tvl: 2100000000,
    tvlChange24h: 1.5,
    tvlChange7d: -2.3,
    revenue24h: 320000,
    fees24h: 420000,
    users24h: 8500,
    chains: ['Ethereum', 'Polygon', 'Arbitrum', 'Avalanche', 'Fantom'],
    category: 'DEX',
    auditStatus: 'audited',
    governanceToken: 'CRV',
    tokenPrice: 0.62,
    tokenChange24h: 2.1,
  },
  {
    id: 'compound',
    name: 'Compound',
    logo: '/protocols/compound.svg',
    tvl: 2800000000,
    tvlChange24h: 0.5,
    tvlChange7d: 1.8,
    revenue24h: 180000,
    fees24h: 240000,
    users24h: 4200,
    chains: ['Ethereum', 'Arbitrum', 'Base'],
    category: 'Lending',
    auditStatus: 'audited',
    governanceToken: 'COMP',
    tokenPrice: 58.20,
    tokenChange24h: 0.8,
  },
];

// ============================================================================
// Main Component
// ============================================================================

export function ProtocolAnalytics({ className }: ProtocolAnalyticsProps) {
  const [sortField, setSortField] = useState<keyof ProtocolData>('tvl');
  const [sortDir, setSortDir] = useState<'asc' | 'desc'>('desc');
  const [categoryFilter, setCategoryFilter] = useState<string>('all');
  const [compareMode, setCompareMode] = useState(false);
  const [selectedProtocols, setSelectedProtocols] = useState<string[]>([]);

  const categories = useMemo(() => {
    return ['all', ...new Set(MOCK_PROTOCOLS.map(p => p.category))];
  }, []);

  const filteredProtocols = useMemo(() => {
    let result = [...MOCK_PROTOCOLS];
    
    if (categoryFilter !== 'all') {
      result = result.filter(p => p.category === categoryFilter);
    }

    return result.sort((a, b) => {
      const aVal = a[sortField];
      const bVal = b[sortField];
      
      if (typeof aVal === 'number' && typeof bVal === 'number') {
        return sortDir === 'asc' ? aVal - bVal : bVal - aVal;
      }
      return 0;
    });
  }, [categoryFilter, sortField, sortDir]);

  const handleSort = (field: keyof ProtocolData) => {
    if (sortField === field) {
      setSortDir(sortDir === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortDir('desc');
    }
  };

  const toggleProtocolSelection = (id: string) => {
    setSelectedProtocols(prev => 
      prev.includes(id) 
        ? prev.filter(p => p !== id)
        : [...prev, id].slice(-3) // Max 3 for comparison
    );
  };

  const getAuditStatusColor = (status: ProtocolData['auditStatus']) => {
    switch (status) {
      case 'audited': return 'bg-green-100 text-green-700';
      case 'pending': return 'bg-yellow-100 text-yellow-700';
      case 'unaudited': return 'bg-red-100 text-red-700';
    }
  };

  const SortHeader = ({ 
    field, 
    children 
  }: { 
    field: keyof ProtocolData; 
    children: React.ReactNode 
  }) => (
    <th
      className="cursor-pointer px-4 py-3 text-left text-sm font-semibold text-gray-700 hover:bg-gray-50"
      onClick={() => handleSort(field)}
    >
      <div className="flex items-center gap-1">
        {children}
        {sortField === field && (
          <span className="text-xs">{sortDir === 'asc' ? '↑' : '↓'}</span>
        )}
      </div>
    </th>
  );

  return (
    <div className={cn('rounded-2xl border-2 border-gray-200 bg-white', className)}>
      {/* Header */}
      <div className="border-b border-gray-200 p-6">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <h3 className="text-lg font-semibold">Protocol Analytics</h3>
          
          <div className="flex items-center gap-4">
            {/* Category Filter */}
            <div className="flex gap-1 rounded-lg bg-gray-100 p-1">
              {categories.map((cat) => (
                <button
                  key={cat}
                  onClick={() => setCategoryFilter(cat)}
                  className={cn(
                    'rounded-md px-3 py-1.5 text-sm font-medium capitalize transition-all',
                    categoryFilter === cat
                      ? 'bg-white text-black shadow-sm'
                      : 'text-gray-600 hover:text-black'
                  )}
                >
                  {cat}
                </button>
              ))}
            </div>

            {/* Compare Mode Toggle */}
            <button
              onClick={() => {
                setCompareMode(!compareMode);
                if (compareMode) setSelectedProtocols([]);
              }}
              className={cn(
                'rounded-lg px-4 py-2 text-sm font-medium transition-all',
                compareMode
                  ? 'bg-black text-white'
                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              )}
            >
              Compare
            </button>
          </div>
        </div>

        {compareMode && selectedProtocols.length > 0 && (
          <div className="mt-4 flex items-center gap-2">
            <span className="text-sm text-gray-500">Comparing:</span>
            {selectedProtocols.map((id) => {
              const protocol = MOCK_PROTOCOLS.find(p => p.id === id);
              return protocol && (
                <span
                  key={id}
                  className="inline-flex items-center gap-1 rounded-lg bg-blue-100 px-2 py-1 text-sm font-medium text-blue-700"
                >
                  {protocol.name}
                  <button
                    onClick={() => toggleProtocolSelection(id)}
                    className="ml-1 hover:text-blue-900"
                  >
                    ✕
                  </button>
                </span>
              );
            })}
          </div>
        )}
      </div>

      {/* Comparison View */}
      {compareMode && selectedProtocols.length >= 2 && (
        <div className="border-b border-gray-200 bg-gray-50 p-6">
          <h4 className="mb-4 font-semibold">Side-by-Side Comparison</h4>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr>
                  <th className="px-4 py-2 text-left text-sm font-medium text-gray-500">Metric</th>
                  {selectedProtocols.map((id) => {
                    const protocol = MOCK_PROTOCOLS.find(p => p.id === id);
                    return (
                      <th key={id} className="px-4 py-2 text-left text-sm font-semibold">
                        {protocol?.name}
                      </th>
                    );
                  })}
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                <tr>
                  <td className="px-4 py-3 text-sm text-gray-500">TVL</td>
                  {selectedProtocols.map((id) => {
                    const protocol = MOCK_PROTOCOLS.find(p => p.id === id);
                    return (
                      <td key={id} className="px-4 py-3 font-medium">
                        ${formatNumber(protocol?.tvl || 0)}
                      </td>
                    );
                  })}
                </tr>
                <tr>
                  <td className="px-4 py-3 text-sm text-gray-500">24h Revenue</td>
                  {selectedProtocols.map((id) => {
                    const protocol = MOCK_PROTOCOLS.find(p => p.id === id);
                    return (
                      <td key={id} className="px-4 py-3 font-medium">
                        ${formatNumber(protocol?.revenue24h || 0)}
                      </td>
                    );
                  })}
                </tr>
                <tr>
                  <td className="px-4 py-3 text-sm text-gray-500">24h Users</td>
                  {selectedProtocols.map((id) => {
                    const protocol = MOCK_PROTOCOLS.find(p => p.id === id);
                    return (
                      <td key={id} className="px-4 py-3 font-medium">
                        {formatNumber(protocol?.users24h || 0)}
                      </td>
                    );
                  })}
                </tr>
                <tr>
                  <td className="px-4 py-3 text-sm text-gray-500">Chains</td>
                  {selectedProtocols.map((id) => {
                    const protocol = MOCK_PROTOCOLS.find(p => p.id === id);
                    return (
                      <td key={id} className="px-4 py-3 font-medium">
                        {protocol?.chains.length}
                      </td>
                    );
                  })}
                </tr>
                <tr>
                  <td className="px-4 py-3 text-sm text-gray-500">Token Price</td>
                  {selectedProtocols.map((id) => {
                    const protocol = MOCK_PROTOCOLS.find(p => p.id === id);
                    return (
                      <td key={id} className="px-4 py-3 font-medium">
                        ${protocol?.tokenPrice?.toFixed(2) || 'N/A'}
                      </td>
                    );
                  })}
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Protocols Table */}
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-gray-50">
            <tr>
              {compareMode && <th className="w-10 px-4 py-3" />}
              <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">Protocol</th>
              <SortHeader field="tvl">TVL</SortHeader>
              <SortHeader field="tvlChange24h">24h Change</SortHeader>
              <SortHeader field="revenue24h">24h Revenue</SortHeader>
              <SortHeader field="users24h">24h Users</SortHeader>
              <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">Chains</th>
              <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">Status</th>
              <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">Token</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {filteredProtocols.map((protocol) => (
              <tr
                key={protocol.id}
                className={cn(
                  'hover:bg-gray-50',
                  compareMode && selectedProtocols.includes(protocol.id) && 'bg-blue-50'
                )}
              >
                {compareMode && (
                  <td className="px-4 py-4">
                    <input
                      type="checkbox"
                      checked={selectedProtocols.includes(protocol.id)}
                      onChange={() => toggleProtocolSelection(protocol.id)}
                      className="h-4 w-4 rounded border-gray-300"
                    />
                  </td>
                )}
                <td className="px-4 py-4">
                  <div className="flex items-center gap-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-gray-100 text-sm font-bold">
                      {protocol.name.slice(0, 2)}
                    </div>
                    <div>
                      <div className="font-semibold">{protocol.name}</div>
                      <div className="text-xs text-gray-500">{protocol.category}</div>
                    </div>
                  </div>
                </td>
                <td className="px-4 py-4 font-medium">${formatNumber(protocol.tvl)}</td>
                <td className={cn(
                  'px-4 py-4 font-medium',
                  protocol.tvlChange24h >= 0 ? 'text-green-600' : 'text-red-600'
                )}>
                  {formatPercentage(protocol.tvlChange24h)}
                </td>
                <td className="px-4 py-4">${formatNumber(protocol.revenue24h)}</td>
                <td className="px-4 py-4">{formatNumber(protocol.users24h)}</td>
                <td className="px-4 py-4">
                  <div className="flex flex-wrap gap-1">
                    {protocol.chains.slice(0, 3).map((chain) => (
                      <span
                        key={chain}
                        className="rounded bg-gray-100 px-1.5 py-0.5 text-xs text-gray-600"
                      >
                        {chain}
                      </span>
                    ))}
                    {protocol.chains.length > 3 && (
                      <span className="rounded bg-gray-100 px-1.5 py-0.5 text-xs text-gray-600">
                        +{protocol.chains.length - 3}
                      </span>
                    )}
                  </div>
                </td>
                <td className="px-4 py-4">
                  <span className={cn(
                    'rounded-full px-2 py-0.5 text-xs font-medium capitalize',
                    getAuditStatusColor(protocol.auditStatus)
                  )}>
                    {protocol.auditStatus}
                  </span>
                </td>
                <td className="px-4 py-4">
                  {protocol.governanceToken && protocol.tokenPrice && (
                    <div>
                      <div className="font-medium">{protocol.governanceToken}</div>
                      <div className="flex items-center gap-1 text-sm">
                        <span>${protocol.tokenPrice.toFixed(2)}</span>
                        <span className={cn(
                          'text-xs',
                          (protocol.tokenChange24h || 0) >= 0 ? 'text-green-600' : 'text-red-600'
                        )}>
                          {formatPercentage(protocol.tokenChange24h || 0)}
                        </span>
                      </div>
                    </div>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default ProtocolAnalytics;
