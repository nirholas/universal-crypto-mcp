'use client';

/**
 * Portfolio Analytics Dashboard
 * 
 * Main analytics page with portfolio overview, performance charts,
 * asset allocation, P&L tracking, and quick stats.
 */

import React, { useState, useMemo } from 'react';
import { cn } from '@/lib/utils/cn';
import { PerformanceChart } from '@/components/analytics/PerformanceChart';
import { AssetAllocation } from '@/components/analytics/AssetAllocation';
import { PnLCalculator } from '@/components/analytics/PnLCalculator';
import type { 
  Timeframe, 
  CostBasisMethod, 
  PortfolioAsset, 
  HistoricalData,
  AllocationData,
  PnLSummary,
  Transaction 
} from '@/lib/analytics/types';
import { formatCurrency, formatPercentage, formatDate } from '@/lib/analytics/hooks';

// ============================================================================
// Mock Data - Replace with actual API calls
// ============================================================================

const MOCK_PORTFOLIO_VALUE = 125432.87;
const MOCK_24H_CHANGE = 2.34;
const MOCK_7D_CHANGE = -1.23;
const MOCK_30D_CHANGE = 15.67;

const MOCK_ASSETS: PortfolioAsset[] = [
  {
    id: '1',
    symbol: 'ETH',
    name: 'Ethereum',
    chain: 'ethereum',
    category: 'token',
    balance: 12.5,
    decimals: 18,
    price: 3200,
    value: 40000,
    change24h: 3.2,
    change7d: -0.5,
    change30d: 12.3,
    costBasis: 28000,
    unrealizedPnL: 12000,
    realizedPnL: 5000,
    logoUrl: '/tokens/eth.svg',
  },
  {
    id: '2',
    symbol: 'BTC',
    name: 'Bitcoin',
    chain: 'bitcoin',
    category: 'token',
    balance: 0.8,
    decimals: 8,
    price: 62500,
    value: 50000,
    change24h: 1.8,
    change7d: 2.1,
    change30d: 18.5,
    costBasis: 35000,
    unrealizedPnL: 15000,
    realizedPnL: 8000,
    logoUrl: '/tokens/btc.svg',
  },
  {
    id: '3',
    symbol: 'SOL',
    name: 'Solana',
    chain: 'solana',
    category: 'token',
    balance: 150,
    decimals: 9,
    price: 120,
    value: 18000,
    change24h: 5.4,
    change7d: -3.2,
    change30d: 25.1,
    costBasis: 12000,
    unrealizedPnL: 6000,
    realizedPnL: 2000,
    logoUrl: '/tokens/sol.svg',
  },
  {
    id: '4',
    symbol: 'USDC',
    name: 'USD Coin',
    chain: 'ethereum',
    category: 'stablecoin',
    balance: 10000,
    decimals: 6,
    price: 1,
    value: 10000,
    change24h: 0,
    change7d: 0,
    change30d: 0,
    costBasis: 10000,
    unrealizedPnL: 0,
    realizedPnL: 0,
    logoUrl: '/tokens/usdc.svg',
  },
  {
    id: '5',
    symbol: 'AAVE',
    name: 'Aave',
    chain: 'ethereum',
    category: 'defi',
    balance: 25,
    decimals: 18,
    price: 289.32,
    value: 7233,
    change24h: -2.1,
    change7d: 4.5,
    change30d: 8.9,
    costBasis: 5500,
    unrealizedPnL: 1733,
    realizedPnL: 500,
    logoUrl: '/tokens/aave.svg',
  },
];

const MOCK_TRANSACTIONS: Transaction[] = [
  {
    id: '1',
    hash: '0x1234...5678',
    chain: 'ethereum',
    type: 'swap',
    status: 'confirmed',
    timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
    from: '0xabc...def',
    to: '0x123...456',
    assets: [
      { symbol: 'ETH', amount: 1.5, value: 4800, direction: 'out' },
      { symbol: 'USDC', amount: 4800, value: 4800, direction: 'in' },
    ],
    fee: 0.002,
    feeToken: 'ETH',
    protocol: 'Uniswap',
  },
  {
    id: '2',
    hash: '0x5678...abcd',
    chain: 'ethereum',
    type: 'receive',
    status: 'confirmed',
    timestamp: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString(),
    from: '0xdef...123',
    to: '0xabc...def',
    assets: [
      { symbol: 'ETH', amount: 2.0, value: 6400, direction: 'in' },
    ],
    fee: 0,
    feeToken: 'ETH',
  },
  {
    id: '3',
    hash: '0xabcd...1234',
    chain: 'solana',
    type: 'stake',
    status: 'confirmed',
    timestamp: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(),
    from: '0xabc...def',
    to: 'Marinade Finance',
    assets: [
      { symbol: 'SOL', amount: 50, value: 6000, direction: 'out' },
      { symbol: 'mSOL', amount: 48.5, value: 6000, direction: 'in' },
    ],
    fee: 0.00001,
    feeToken: 'SOL',
    protocol: 'Marinade',
  },
];

function generateMockHistoricalData(timeframe: Timeframe): HistoricalData {
  const now = Date.now();
  let points: number;
  let interval: number;

  switch (timeframe) {
    case '1D':
      points = 24;
      interval = 60 * 60 * 1000;
      break;
    case '1W':
      points = 7 * 24;
      interval = 60 * 60 * 1000;
      break;
    case '1M':
      points = 30;
      interval = 24 * 60 * 60 * 1000;
      break;
    case '3M':
      points = 90;
      interval = 24 * 60 * 60 * 1000;
      break;
    case '1Y':
      points = 365;
      interval = 24 * 60 * 60 * 1000;
      break;
    case 'ALL':
      points = 730;
      interval = 24 * 60 * 60 * 1000;
      break;
  }

  const baseValue = 100000;
  const timestamps: string[] = [];
  const values: number[] = [];
  const btc: number[] = [];
  const eth: number[] = [];
  const sp500: number[] = [];

  for (let i = 0; i < points; i++) {
    timestamps.push(new Date(now - (points - i) * interval).toISOString());
    
    // Generate somewhat realistic looking data
    const progress = i / points;
    const trend = 0.25 * progress; // 25% overall gain
    const noise = (Math.random() - 0.5) * 0.03;
    const cycle = Math.sin(progress * Math.PI * 4) * 0.05;
    
    values.push(baseValue * (1 + trend + noise + cycle));
    btc.push(baseValue * (1 + trend * 1.2 + (Math.random() - 0.5) * 0.04));
    eth.push(baseValue * (1 + trend * 0.9 + (Math.random() - 0.5) * 0.05));
    sp500.push(baseValue * (1 + trend * 0.3 + (Math.random() - 0.5) * 0.01));
  }

  return { timestamps, values, benchmarks: { btc, eth, sp500 } };
}

const MOCK_ALLOCATION: AllocationData = {
  byAsset: [
    { name: 'BTC', value: 50000, percentage: 39.9, color: '#F7931A' },
    { name: 'ETH', value: 40000, percentage: 31.9, color: '#627EEA' },
    { name: 'SOL', value: 18000, percentage: 14.4, color: '#9945FF' },
    { name: 'USDC', value: 10000, percentage: 8.0, color: '#2775CA' },
    { name: 'AAVE', value: 7233, percentage: 5.8, color: '#B6509E' },
  ],
  byChain: [
    { name: 'Ethereum', value: 57233, percentage: 45.6, color: '#627EEA' },
    { name: 'Bitcoin', value: 50000, percentage: 39.9, color: '#F7931A' },
    { name: 'Solana', value: 18000, percentage: 14.4, color: '#9945FF' },
  ],
  byCategory: [
    { name: 'Token', value: 108000, percentage: 86.1, color: '#3B82F6' },
    { name: 'Stablecoin', value: 10000, percentage: 8.0, color: '#6B7280' },
    { name: 'DeFi', value: 7233, percentage: 5.8, color: '#10B981' },
  ],
  targetAllocation: [
    { name: 'BTC', value: 0, percentage: 40, color: '#F7931A' },
    { name: 'ETH', value: 0, percentage: 35, color: '#627EEA' },
    { name: 'SOL', value: 0, percentage: 10, color: '#9945FF' },
    { name: 'USDC', value: 0, percentage: 10, color: '#2775CA' },
    { name: 'AAVE', value: 0, percentage: 5, color: '#B6509E' },
  ],
};

const MOCK_PNL: PnLSummary = {
  totalRealizedGains: 15500,
  totalUnrealizedGains: 34733,
  shortTermGains: 8000,
  longTermGains: 7500,
  totalCostBasis: 90500,
  currentValue: 125233,
  taxLots: [
    {
      id: '1',
      asset: 'BTC',
      acquiredDate: '2024-06-15',
      quantity: 0.5,
      costBasis: 20000,
      currentValue: 31250,
      unrealizedGain: 11250,
      holdingPeriod: 'long',
    },
    {
      id: '2',
      asset: 'BTC',
      acquiredDate: '2025-09-01',
      quantity: 0.3,
      costBasis: 15000,
      currentValue: 18750,
      unrealizedGain: 3750,
      holdingPeriod: 'short',
    },
    {
      id: '3',
      asset: 'ETH',
      acquiredDate: '2024-03-20',
      quantity: 10,
      costBasis: 22000,
      currentValue: 32000,
      unrealizedGain: 10000,
      holdingPeriod: 'long',
    },
    {
      id: '4',
      asset: 'ETH',
      acquiredDate: '2025-11-15',
      quantity: 2.5,
      costBasis: 6000,
      currentValue: 8000,
      unrealizedGain: 2000,
      holdingPeriod: 'short',
    },
    {
      id: '5',
      asset: 'SOL',
      acquiredDate: '2025-08-10',
      quantity: 150,
      costBasis: 12000,
      currentValue: 18000,
      unrealizedGain: 6000,
      holdingPeriod: 'short',
    },
    {
      id: '6',
      asset: 'AAVE',
      acquiredDate: '2025-05-25',
      quantity: 25,
      costBasis: 5500,
      currentValue: 7233,
      unrealizedGain: 1733,
      holdingPeriod: 'short',
    },
  ],
};

// ============================================================================
// Quick Stats Cards Component
// ============================================================================

interface QuickStatsProps {
  portfolioValue: number;
  change24h: number;
  change7d: number;
  change30d: number;
  bestPerformer: PortfolioAsset;
  worstPerformer: PortfolioAsset;
}

function QuickStats({
  portfolioValue,
  change24h,
  change7d,
  change30d,
  bestPerformer,
  worstPerformer,
}: QuickStatsProps) {
  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
      {/* Portfolio Value */}
      <div className="rounded-2xl bg-gradient-to-br from-gray-900 to-gray-800 p-6 text-white">
        <div className="text-sm opacity-80">Portfolio Value</div>
        <div className="mt-2 text-3xl font-bold">{formatCurrency(portfolioValue)}</div>
        <div className="mt-2 flex gap-4 text-sm">
          <span className={cn(change24h >= 0 ? 'text-green-400' : 'text-red-400')}>
            24h: {formatPercentage(change24h)}
          </span>
          <span className={cn(change7d >= 0 ? 'text-green-400' : 'text-red-400')}>
            7d: {formatPercentage(change7d)}
          </span>
        </div>
      </div>

      {/* 30 Day Change */}
      <div className="rounded-2xl border-2 border-gray-200 bg-white p-6">
        <div className="text-sm text-gray-500">30 Day Return</div>
        <div className={cn(
          'mt-2 text-3xl font-bold',
          change30d >= 0 ? 'text-green-600' : 'text-red-600'
        )}>
          {formatPercentage(change30d)}
        </div>
        <div className="mt-2 text-sm text-gray-600">
          {formatCurrency(portfolioValue * (change30d / 100))} gain
        </div>
      </div>

      {/* Best Performer */}
      <div className="rounded-2xl border-2 border-green-200 bg-green-50 p-6">
        <div className="text-sm text-green-700">Best Performer (24h)</div>
        <div className="mt-2 flex items-center gap-2">
          <span className="text-2xl font-bold text-green-800">{bestPerformer.symbol}</span>
          <span className="text-lg font-semibold text-green-600">
            {formatPercentage(bestPerformer.change24h)}
          </span>
        </div>
        <div className="mt-2 text-sm text-green-700">
          {formatCurrency(bestPerformer.value)}
        </div>
      </div>

      {/* Worst Performer */}
      <div className="rounded-2xl border-2 border-red-200 bg-red-50 p-6">
        <div className="text-sm text-red-700">Worst Performer (24h)</div>
        <div className="mt-2 flex items-center gap-2">
          <span className="text-2xl font-bold text-red-800">{worstPerformer.symbol}</span>
          <span className="text-lg font-semibold text-red-600">
            {formatPercentage(worstPerformer.change24h)}
          </span>
        </div>
        <div className="mt-2 text-sm text-red-700">
          {formatCurrency(worstPerformer.value)}
        </div>
      </div>
    </div>
  );
}

// ============================================================================
// Top Gainers/Losers Component
// ============================================================================

interface TopMoversProps {
  assets: PortfolioAsset[];
}

function TopMovers({ assets }: TopMoversProps) {
  const sortedAssets = [...assets].sort((a, b) => b.change24h - a.change24h);
  const gainers = sortedAssets.filter((a) => a.change24h > 0);
  const losers = sortedAssets.filter((a) => a.change24h < 0).reverse();

  return (
    <div className="rounded-2xl border-2 border-gray-200 bg-white p-6">
      <h3 className="mb-4 text-lg font-semibold">Top Movers (24h)</h3>
      
      <div className="grid gap-6 md:grid-cols-2">
        {/* Gainers */}
        <div>
          <h4 className="mb-3 text-sm font-medium text-green-600">Gainers</h4>
          <div className="space-y-2">
            {gainers.length === 0 ? (
              <div className="text-sm text-gray-500">No gainers today</div>
            ) : (
              gainers.slice(0, 5).map((asset) => (
                <div
                  key={asset.id}
                  className="flex items-center justify-between rounded-xl bg-green-50 p-3"
                >
                  <div className="flex items-center gap-3">
                    <div className="flex h-8 w-8 items-center justify-center rounded-full bg-green-100 text-sm font-bold text-green-700">
                      {asset.symbol.slice(0, 2)}
                    </div>
                    <div>
                      <div className="font-medium">{asset.symbol}</div>
                      <div className="text-xs text-gray-500">{formatCurrency(asset.value)}</div>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="font-semibold text-green-600">
                      {formatPercentage(asset.change24h)}
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Losers */}
        <div>
          <h4 className="mb-3 text-sm font-medium text-red-600">Losers</h4>
          <div className="space-y-2">
            {losers.length === 0 ? (
              <div className="text-sm text-gray-500">No losers today</div>
            ) : (
              losers.slice(0, 5).map((asset) => (
                <div
                  key={asset.id}
                  className="flex items-center justify-between rounded-xl bg-red-50 p-3"
                >
                  <div className="flex items-center gap-3">
                    <div className="flex h-8 w-8 items-center justify-center rounded-full bg-red-100 text-sm font-bold text-red-700">
                      {asset.symbol.slice(0, 2)}
                    </div>
                    <div>
                      <div className="font-medium">{asset.symbol}</div>
                      <div className="text-xs text-gray-500">{formatCurrency(asset.value)}</div>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="font-semibold text-red-600">
                      {formatPercentage(asset.change24h)}
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

// ============================================================================
// Recent Transactions Component
// ============================================================================

interface RecentTransactionsProps {
  transactions: Transaction[];
}

function RecentTransactions({ transactions }: RecentTransactionsProps) {
  const getTypeIcon = (type: Transaction['type']) => {
    switch (type) {
      case 'send':
        return '↑';
      case 'receive':
        return '↓';
      case 'swap':
        return '⇄';
      case 'stake':
        return '🔒';
      case 'unstake':
        return '🔓';
      case 'claim':
        return '🎁';
      default:
        return '•';
    }
  };

  const getTypeColor = (type: Transaction['type']) => {
    switch (type) {
      case 'send':
        return 'text-red-600 bg-red-100';
      case 'receive':
        return 'text-green-600 bg-green-100';
      case 'swap':
        return 'text-blue-600 bg-blue-100';
      case 'stake':
      case 'unstake':
        return 'text-purple-600 bg-purple-100';
      case 'claim':
        return 'text-amber-600 bg-amber-100';
      default:
        return 'text-gray-600 bg-gray-100';
    }
  };

  return (
    <div className="rounded-2xl border-2 border-gray-200 bg-white p-6">
      <div className="mb-4 flex items-center justify-between">
        <h3 className="text-lg font-semibold">Recent Transactions</h3>
        <a
          href="/analytics/transactions"
          className="text-sm font-medium text-gray-600 hover:text-black"
        >
          View All →
        </a>
      </div>

      <div className="space-y-3">
        {transactions.slice(0, 5).map((tx) => (
          <div
            key={tx.id}
            className="flex items-center justify-between rounded-xl bg-gray-50 p-4"
          >
            <div className="flex items-center gap-3">
              <div className={cn(
                'flex h-10 w-10 items-center justify-center rounded-full text-lg',
                getTypeColor(tx.type)
              )}>
                {getTypeIcon(tx.type)}
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <span className="font-medium capitalize">{tx.type}</span>
                  {tx.protocol && (
                    <span className="rounded bg-gray-200 px-1.5 py-0.5 text-xs text-gray-600">
                      {tx.protocol}
                    </span>
                  )}
                </div>
                <div className="text-xs text-gray-500">
                  {formatDate(tx.timestamp)} • {tx.chain}
                </div>
              </div>
            </div>
            <div className="text-right">
              {tx.assets.map((asset, i) => (
                <div
                  key={i}
                  className={cn(
                    'text-sm font-medium',
                    asset.direction === 'in' ? 'text-green-600' : 'text-red-600'
                  )}
                >
                  {asset.direction === 'in' ? '+' : '-'}
                  {asset.amount.toFixed(4)} {asset.symbol}
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

// ============================================================================
// Holdings Table Component
// ============================================================================

interface HoldingsTableProps {
  assets: PortfolioAsset[];
}

function HoldingsTable({ assets }: HoldingsTableProps) {
  const sortedAssets = [...assets].sort((a, b) => b.value - a.value);

  return (
    <div className="rounded-2xl border-2 border-gray-200 bg-white p-6">
      <h3 className="mb-4 text-lg font-semibold">Holdings</h3>

      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="border-b border-gray-100 text-left text-sm text-gray-500">
              <th className="pb-3 font-medium">Asset</th>
              <th className="pb-3 font-medium">Balance</th>
              <th className="pb-3 font-medium">Price</th>
              <th className="pb-3 font-medium">Value</th>
              <th className="pb-3 font-medium">24h</th>
              <th className="pb-3 font-medium">P&L</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-50">
            {sortedAssets.map((asset) => (
              <tr key={asset.id} className="hover:bg-gray-50">
                <td className="py-4">
                  <div className="flex items-center gap-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded-full bg-gray-100 text-sm font-bold">
                      {asset.symbol.slice(0, 2)}
                    </div>
                    <div>
                      <div className="font-semibold">{asset.symbol}</div>
                      <div className="text-xs text-gray-500">{asset.name}</div>
                    </div>
                  </div>
                </td>
                <td className="py-4">
                  <div className="font-medium">{asset.balance.toFixed(4)}</div>
                </td>
                <td className="py-4">
                  <div className="font-medium">{formatCurrency(asset.price)}</div>
                </td>
                <td className="py-4">
                  <div className="font-semibold">{formatCurrency(asset.value)}</div>
                </td>
                <td className={cn(
                  'py-4 font-medium',
                  asset.change24h >= 0 ? 'text-green-600' : 'text-red-600'
                )}>
                  {formatPercentage(asset.change24h)}
                </td>
                <td className={cn(
                  'py-4 font-semibold',
                  asset.unrealizedPnL >= 0 ? 'text-green-600' : 'text-red-600'
                )}>
                  {formatCurrency(asset.unrealizedPnL)}
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
// Main Dashboard Component
// ============================================================================

export default function AnalyticsDashboard() {
  const [timeframe, setTimeframe] = useState<Timeframe>('1M');
  const [costBasisMethod, setCostBasisMethod] = useState<CostBasisMethod>('FIFO');
  const [showBenchmarks, setShowBenchmarks] = useState(false);
  const [showDrawdown, setShowDrawdown] = useState(false);

  // Generate historical data based on timeframe
  const historicalData = useMemo(() => {
    return generateMockHistoricalData(timeframe);
  }, [timeframe]);

  // Find best and worst performers
  const { bestPerformer, worstPerformer } = useMemo(() => {
    const sorted = [...MOCK_ASSETS].sort((a, b) => b.change24h - a.change24h);
    return {
      bestPerformer: sorted[0],
      worstPerformer: sorted[sorted.length - 1],
    };
  }, []);

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold">Portfolio Analytics</h1>
        <p className="mt-2 text-gray-600">
          Track your portfolio performance, allocation, and gains across all chains.
        </p>
      </div>

      {/* Quick Stats */}
      <div className="mb-8">
        <QuickStats
          portfolioValue={MOCK_PORTFOLIO_VALUE}
          change24h={MOCK_24H_CHANGE}
          change7d={MOCK_7D_CHANGE}
          change30d={MOCK_30D_CHANGE}
          bestPerformer={bestPerformer}
          worstPerformer={worstPerformer}
        />
      </div>

      {/* Chart Controls */}
      <div className="mb-4 flex flex-wrap items-center gap-4">
        <label className="flex items-center gap-2 text-sm">
          <input
            type="checkbox"
            checked={showBenchmarks}
            onChange={(e) => setShowBenchmarks(e.target.checked)}
            className="rounded border-gray-300"
          />
          Compare to benchmarks
        </label>
        <label className="flex items-center gap-2 text-sm">
          <input
            type="checkbox"
            checked={showDrawdown}
            onChange={(e) => setShowDrawdown(e.target.checked)}
            className="rounded border-gray-300"
          />
          Show drawdown
        </label>
      </div>

      {/* Performance Chart */}
      <div className="mb-8">
        <PerformanceChart
          data={historicalData}
          timeframe={timeframe}
          onTimeframeChange={setTimeframe}
          showBenchmarks={showBenchmarks}
          showDrawdown={showDrawdown}
          benchmarks={['btc', 'eth', 'sp500']}
        />
      </div>

      {/* Two Column Layout */}
      <div className="mb-8 grid gap-8 lg:grid-cols-2">
        {/* Asset Allocation */}
        <AssetAllocation
          data={MOCK_ALLOCATION}
          showTarget
        />

        {/* Top Movers */}
        <TopMovers assets={MOCK_ASSETS} />
      </div>

      {/* P&L Calculator */}
      <div className="mb-8">
        <PnLCalculator
          data={MOCK_PNL}
          currentMethod={costBasisMethod}
          onMethodChange={setCostBasisMethod}
          onExport={(format) => console.log('Export:', format)}
        />
      </div>

      {/* Holdings Table */}
      <div className="mb-8">
        <HoldingsTable assets={MOCK_ASSETS} />
      </div>

      {/* Recent Transactions */}
      <div>
        <RecentTransactions transactions={MOCK_TRANSACTIONS} />
      </div>
    </div>
  );
}
