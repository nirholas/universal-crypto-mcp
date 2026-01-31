'use client';

/**
 * Market Overview Page
 * 
 * Comprehensive market research dashboard with global stats, trending tokens,
 * fear & greed index, and market heatmap.
 */

import React, { useState, useMemo } from 'react';
import { cn } from '@/lib/utils/cn';
import type { MarketOverview, TokenData, TrendingToken } from '@/lib/analytics/types';
import { formatCurrency, formatNumber, formatPercentage } from '@/lib/analytics/hooks';

// ============================================================================
// Mock Data
// ============================================================================

const MOCK_MARKET_OVERVIEW: MarketOverview = {
  totalMarketCap: 2450000000000,
  totalVolume24h: 98500000000,
  btcDominance: 52.3,
  ethDominance: 17.8,
  marketCapChange24h: 2.1,
  fearGreedIndex: 67,
  fearGreedLabel: 'Greed',
};

const MOCK_TOP_TOKENS: TokenData[] = [
  { id: 'bitcoin', symbol: 'BTC', name: 'Bitcoin', price: 62500, marketCap: 1220000000000, volume24h: 28500000000, change1h: 0.2, change24h: 1.8, change7d: 5.2, change30d: 12.5, ath: 69000, athDate: '2021-11-10', atl: 67.81, atlDate: '2013-07-06', circulatingSupply: 19500000, totalSupply: 19500000, maxSupply: 21000000, rank: 1, logoUrl: '/tokens/btc.svg', sparkline: [] },
  { id: 'ethereum', symbol: 'ETH', name: 'Ethereum', price: 3200, marketCap: 385000000000, volume24h: 15200000000, change1h: 0.5, change24h: 3.2, change7d: -0.8, change30d: 8.9, ath: 4878, athDate: '2021-11-10', atl: 0.43, atlDate: '2015-10-20', circulatingSupply: 120000000, totalSupply: 120000000, maxSupply: null, rank: 2, logoUrl: '/tokens/eth.svg', sparkline: [] },
  { id: 'tether', symbol: 'USDT', name: 'Tether', price: 1.0, marketCap: 95000000000, volume24h: 52000000000, change1h: 0.01, change24h: 0.02, change7d: 0.01, change30d: 0.0, ath: 1.32, athDate: '2018-07-24', atl: 0.57, atlDate: '2015-03-02', circulatingSupply: 95000000000, totalSupply: 95000000000, maxSupply: null, rank: 3, logoUrl: '/tokens/usdt.svg', sparkline: [] },
  { id: 'solana', symbol: 'SOL', name: 'Solana', price: 120, marketCap: 52000000000, volume24h: 2800000000, change1h: 1.2, change24h: 5.4, change7d: -3.2, change30d: 25.1, ath: 260, athDate: '2021-11-06', atl: 0.5, atlDate: '2020-05-11', circulatingSupply: 433000000, totalSupply: 571000000, maxSupply: null, rank: 4, logoUrl: '/tokens/sol.svg', sparkline: [] },
  { id: 'ripple', symbol: 'XRP', name: 'XRP', price: 0.52, marketCap: 28000000000, volume24h: 1200000000, change1h: -0.3, change24h: -1.2, change7d: 2.8, change30d: 15.3, ath: 3.4, athDate: '2018-01-07', atl: 0.0028, atlDate: '2014-05-22', circulatingSupply: 54000000000, totalSupply: 100000000000, maxSupply: 100000000000, rank: 5, logoUrl: '/tokens/xrp.svg', sparkline: [] },
  { id: 'cardano', symbol: 'ADA', name: 'Cardano', price: 0.45, marketCap: 16000000000, volume24h: 450000000, change1h: 0.8, change24h: 2.1, change7d: -1.5, change30d: 8.2, ath: 3.09, athDate: '2021-09-02', atl: 0.017, atlDate: '2020-03-13', circulatingSupply: 35000000000, totalSupply: 45000000000, maxSupply: 45000000000, rank: 6, logoUrl: '/tokens/ada.svg', sparkline: [] },
  { id: 'avalanche', symbol: 'AVAX', name: 'Avalanche', price: 35.5, marketCap: 13500000000, volume24h: 520000000, change1h: 0.6, change24h: 4.2, change7d: 8.5, change30d: 22.1, ath: 146, athDate: '2021-11-21', atl: 2.8, atlDate: '2020-12-31', circulatingSupply: 380000000, totalSupply: 720000000, maxSupply: 720000000, rank: 7, logoUrl: '/tokens/avax.svg', sparkline: [] },
  { id: 'polkadot', symbol: 'DOT', name: 'Polkadot', price: 7.2, marketCap: 9500000000, volume24h: 280000000, change1h: -0.1, change24h: 1.5, change7d: -2.1, change30d: 5.8, ath: 55, athDate: '2021-11-04', atl: 2.69, atlDate: '2020-08-20', circulatingSupply: 1320000000, totalSupply: 1420000000, maxSupply: null, rank: 8, logoUrl: '/tokens/dot.svg', sparkline: [] },
];

const MOCK_TRENDING: TrendingToken[] = [
  { id: 'pepe', symbol: 'PEPE', name: 'Pepe', price: 0.0000085, change24h: 45.2, volume24h: 890000000, volumeChange24h: 250, rank: 1, logoUrl: '/tokens/pepe.svg' },
  { id: 'bonk', symbol: 'BONK', name: 'Bonk', price: 0.000012, change24h: 28.5, volume24h: 320000000, volumeChange24h: 180, rank: 2, logoUrl: '/tokens/bonk.svg' },
  { id: 'wif', symbol: 'WIF', name: 'dogwifhat', price: 2.35, change24h: 18.3, volume24h: 450000000, volumeChange24h: 120, rank: 3, logoUrl: '/tokens/wif.svg' },
  { id: 'render', symbol: 'RNDR', name: 'Render', price: 8.5, change24h: 12.8, volume24h: 180000000, volumeChange24h: 85, rank: 4, logoUrl: '/tokens/rndr.svg' },
  { id: 'injective', symbol: 'INJ', name: 'Injective', price: 28.5, change24h: 9.2, volume24h: 95000000, volumeChange24h: 65, rank: 5, logoUrl: '/tokens/inj.svg' },
];

// ============================================================================
// Global Stats Component
// ============================================================================

interface GlobalStatsProps {
  data: MarketOverview;
}

function GlobalStats({ data }: GlobalStatsProps) {
  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
      {/* Total Market Cap */}
      <div className="rounded-2xl bg-gradient-to-br from-blue-600 to-blue-700 p-6 text-white">
        <div className="text-sm opacity-80">Total Market Cap</div>
        <div className="mt-2 text-2xl font-bold">${formatNumber(data.totalMarketCap)}</div>
        <div className={cn(
          'mt-1 text-sm',
          data.marketCapChange24h >= 0 ? 'text-green-300' : 'text-red-300'
        )}>
          {formatPercentage(data.marketCapChange24h)} (24h)
        </div>
      </div>

      {/* 24h Volume */}
      <div className="rounded-2xl border-2 border-gray-200 bg-white p-6">
        <div className="text-sm text-gray-500">24h Trading Volume</div>
        <div className="mt-2 text-2xl font-bold">${formatNumber(data.totalVolume24h)}</div>
        <div className="mt-1 text-sm text-gray-500">
          Across all exchanges
        </div>
      </div>

      {/* BTC Dominance */}
      <div className="rounded-2xl border-2 border-gray-200 bg-white p-6">
        <div className="text-sm text-gray-500">BTC Dominance</div>
        <div className="mt-2 flex items-baseline gap-2">
          <span className="text-2xl font-bold">{data.btcDominance}%</span>
          <span className="text-sm text-gray-500">ETH: {data.ethDominance}%</span>
        </div>
        <div className="mt-2">
          <div className="h-2 overflow-hidden rounded-full bg-gray-200">
            <div
              className="h-full bg-orange-500"
              style={{ width: `${data.btcDominance}%` }}
            />
          </div>
        </div>
      </div>

      {/* Fear & Greed */}
      <FearGreedGauge value={data.fearGreedIndex} label={data.fearGreedLabel} />
    </div>
  );
}

// ============================================================================
// Fear & Greed Gauge Component
// ============================================================================

interface FearGreedGaugeProps {
  value: number;
  label: string;
}

function FearGreedGauge({ value, label }: FearGreedGaugeProps) {
  const getColor = (v: number) => {
    if (v <= 25) return 'text-red-600';
    if (v <= 45) return 'text-orange-500';
    if (v <= 55) return 'text-yellow-500';
    if (v <= 75) return 'text-green-500';
    return 'text-green-600';
  };

  const getBgColor = (v: number) => {
    if (v <= 25) return 'from-red-500 to-red-600';
    if (v <= 45) return 'from-orange-400 to-orange-500';
    if (v <= 55) return 'from-yellow-400 to-yellow-500';
    if (v <= 75) return 'from-green-400 to-green-500';
    return 'from-green-500 to-green-600';
  };

  return (
    <div className={cn(
      'rounded-2xl bg-gradient-to-br p-6 text-white',
      getBgColor(value)
    )}>
      <div className="text-sm opacity-80">Fear & Greed Index</div>
      <div className="mt-2 flex items-baseline gap-2">
        <span className="text-3xl font-bold">{value}</span>
        <span className="text-lg font-medium">{label}</span>
      </div>
      <div className="mt-3">
        <div className="relative h-2 overflow-hidden rounded-full bg-white/30">
          <div
            className="absolute inset-y-0 left-0 rounded-full bg-white transition-all"
            style={{ width: `${value}%` }}
          />
        </div>
        <div className="mt-1 flex justify-between text-xs opacity-80">
          <span>Extreme Fear</span>
          <span>Extreme Greed</span>
        </div>
      </div>
    </div>
  );
}

// ============================================================================
// Trending Tokens Component
// ============================================================================

interface TrendingTokensProps {
  tokens: TrendingToken[];
}

function TrendingTokens({ tokens }: TrendingTokensProps) {
  return (
    <div className="rounded-2xl border-2 border-gray-200 bg-white p-6">
      <div className="mb-4 flex items-center justify-between">
        <h3 className="text-lg font-semibold">🔥 Trending</h3>
        <span className="text-sm text-gray-500">Last 24h</span>
      </div>

      <div className="space-y-3">
        {tokens.map((token) => (
          <a
            key={token.id}
            href={`/analytics/token/${token.symbol.toLowerCase()}`}
            className="flex items-center justify-between rounded-xl bg-gray-50 p-4 transition-colors hover:bg-gray-100"
          >
            <div className="flex items-center gap-3">
              <div className="flex h-8 w-8 items-center justify-center rounded-full bg-gradient-to-br from-orange-400 to-pink-500 text-xs font-bold text-white">
                #{token.rank}
              </div>
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-gray-200 text-sm font-bold">
                {token.symbol.slice(0, 2)}
              </div>
              <div>
                <div className="font-semibold">{token.symbol}</div>
                <div className="text-xs text-gray-500">{token.name}</div>
              </div>
            </div>
            <div className="text-right">
              <div className="font-medium">
                ${token.price < 0.01 ? token.price.toExponential(2) : token.price.toFixed(2)}
              </div>
              <div className={cn(
                'text-sm font-medium',
                token.change24h >= 0 ? 'text-green-600' : 'text-red-600'
              )}>
                {formatPercentage(token.change24h)}
              </div>
            </div>
          </a>
        ))}
      </div>
    </div>
  );
}

// ============================================================================
// Market Heatmap Component
// ============================================================================

interface MarketHeatmapProps {
  tokens: TokenData[];
}

function MarketHeatmap({ tokens }: MarketHeatmapProps) {
  // Calculate sizes based on market cap
  const totalMarketCap = tokens.reduce((sum, t) => sum + t.marketCap, 0);

  const getColorClass = (change: number) => {
    if (change > 5) return 'bg-green-500';
    if (change > 2) return 'bg-green-400';
    if (change > 0) return 'bg-green-300';
    if (change > -2) return 'bg-red-300';
    if (change > -5) return 'bg-red-400';
    return 'bg-red-500';
  };

  return (
    <div className="rounded-2xl border-2 border-gray-200 bg-white p-6">
      <div className="mb-4 flex items-center justify-between">
        <h3 className="text-lg font-semibold">Market Heatmap</h3>
        <div className="flex items-center gap-2 text-xs">
          <span className="text-red-500">-5%</span>
          <div className="flex h-3 w-24 overflow-hidden rounded">
            <div className="flex-1 bg-red-500" />
            <div className="flex-1 bg-red-400" />
            <div className="flex-1 bg-red-300" />
            <div className="flex-1 bg-green-300" />
            <div className="flex-1 bg-green-400" />
            <div className="flex-1 bg-green-500" />
          </div>
          <span className="text-green-500">+5%</span>
        </div>
      </div>

      <div className="flex flex-wrap gap-1">
        {tokens.map((token) => {
          const size = Math.max(60, Math.sqrt(token.marketCap / totalMarketCap) * 400);
          
          return (
            <a
              key={token.id}
              href={`/analytics/token/${token.symbol.toLowerCase()}`}
              className={cn(
                'flex flex-col items-center justify-center rounded-lg p-2 text-white transition-transform hover:scale-105',
                getColorClass(token.change24h)
              )}
              style={{
                width: size,
                height: size,
                minWidth: 60,
                minHeight: 60,
              }}
            >
              <div className="text-sm font-bold">{token.symbol}</div>
              <div className="text-xs">{formatPercentage(token.change24h)}</div>
            </a>
          );
        })}
      </div>
    </div>
  );
}

// ============================================================================
// Token List Table Component
// ============================================================================

interface TokenListTableProps {
  tokens: TokenData[];
}

function TokenListTable({ tokens }: TokenListTableProps) {
  const [sortField, setSortField] = useState<keyof TokenData>('rank');
  const [sortDir, setSortDir] = useState<'asc' | 'desc'>('asc');

  const sortedTokens = useMemo(() => {
    return [...tokens].sort((a, b) => {
      const aVal = a[sortField];
      const bVal = b[sortField];
      if (typeof aVal === 'number' && typeof bVal === 'number') {
        return sortDir === 'asc' ? aVal - bVal : bVal - aVal;
      }
      return 0;
    });
  }, [tokens, sortField, sortDir]);

  const handleSort = (field: keyof TokenData) => {
    if (sortField === field) {
      setSortDir(sortDir === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortDir('desc');
    }
  };

  const SortHeader = ({ field, children }: { field: keyof TokenData; children: React.ReactNode }) => (
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
    <div className="rounded-2xl border-2 border-gray-200 bg-white">
      <div className="border-b border-gray-200 p-6">
        <h3 className="text-lg font-semibold">Top Cryptocurrencies by Market Cap</h3>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-gray-50">
            <tr>
              <SortHeader field="rank">#</SortHeader>
              <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">Name</th>
              <SortHeader field="price">Price</SortHeader>
              <SortHeader field="change1h">1h %</SortHeader>
              <SortHeader field="change24h">24h %</SortHeader>
              <SortHeader field="change7d">7d %</SortHeader>
              <SortHeader field="marketCap">Market Cap</SortHeader>
              <SortHeader field="volume24h">Volume (24h)</SortHeader>
              <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">Supply</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {sortedTokens.map((token) => (
              <tr key={token.id} className="hover:bg-gray-50">
                <td className="px-4 py-4 text-sm font-medium text-gray-500">
                  {token.rank}
                </td>
                <td className="px-4 py-4">
                  <a
                    href={`/analytics/token/${token.symbol.toLowerCase()}`}
                    className="flex items-center gap-3 hover:underline"
                  >
                    <div className="flex h-8 w-8 items-center justify-center rounded-full bg-gray-100 text-xs font-bold">
                      {token.symbol.slice(0, 2)}
                    </div>
                    <div>
                      <div className="font-semibold">{token.name}</div>
                      <div className="text-xs text-gray-500">{token.symbol}</div>
                    </div>
                  </a>
                </td>
                <td className="px-4 py-4 font-medium">
                  {formatCurrency(token.price)}
                </td>
                <td className={cn(
                  'px-4 py-4 text-sm font-medium',
                  token.change1h >= 0 ? 'text-green-600' : 'text-red-600'
                )}>
                  {formatPercentage(token.change1h)}
                </td>
                <td className={cn(
                  'px-4 py-4 text-sm font-medium',
                  token.change24h >= 0 ? 'text-green-600' : 'text-red-600'
                )}>
                  {formatPercentage(token.change24h)}
                </td>
                <td className={cn(
                  'px-4 py-4 text-sm font-medium',
                  token.change7d >= 0 ? 'text-green-600' : 'text-red-600'
                )}>
                  {formatPercentage(token.change7d)}
                </td>
                <td className="px-4 py-4 font-medium">
                  ${formatNumber(token.marketCap)}
                </td>
                <td className="px-4 py-4 text-sm text-gray-600">
                  ${formatNumber(token.volume24h)}
                </td>
                <td className="px-4 py-4 text-sm text-gray-600">
                  <div>{formatNumber(token.circulatingSupply)}</div>
                  {token.maxSupply && (
                    <div className="mt-1">
                      <div className="h-1.5 w-16 overflow-hidden rounded-full bg-gray-200">
                        <div
                          className="h-full bg-blue-500"
                          style={{
                            width: `${(token.circulatingSupply / token.maxSupply) * 100}%`,
                          }}
                        />
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

// ============================================================================
// Main Page Component
// ============================================================================

export default function MarketPage() {
  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold">Market Overview</h1>
        <p className="mt-2 text-gray-600">
          Real-time cryptocurrency market data, trends, and analytics.
        </p>
      </div>

      {/* Global Stats */}
      <div className="mb-8">
        <GlobalStats data={MOCK_MARKET_OVERVIEW} />
      </div>

      {/* Two Column Layout */}
      <div className="mb-8 grid gap-8 lg:grid-cols-3">
        {/* Trending */}
        <TrendingTokens tokens={MOCK_TRENDING} />

        {/* Heatmap */}
        <div className="lg:col-span-2">
          <MarketHeatmap tokens={MOCK_TOP_TOKENS} />
        </div>
      </div>

      {/* Token List */}
      <TokenListTable tokens={MOCK_TOP_TOKENS} />
    </div>
  );
}
