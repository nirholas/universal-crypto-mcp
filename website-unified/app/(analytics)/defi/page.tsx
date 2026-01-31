'use client';

/**
 * DeFi Positions Dashboard
 * 
 * Comprehensive view of all DeFi positions across protocols including
 * lending, borrowing, liquidity provision, staking, and farming.
 */

import React, { useState, useMemo } from 'react';
import { cn } from '@/lib/utils/cn';
import { YieldTracker } from '@/components/analytics/YieldTracker';
import { ProtocolAnalytics } from '@/components/analytics/ProtocolAnalytics';
import { ILCalculator } from '@/components/analytics/ILCalculator';
import type { DeFiPosition, DeFiSummary, YieldOpportunity } from '@/lib/analytics/types';
import { formatCurrency, formatNumber, formatPercentage } from '@/lib/analytics/hooks';

// ============================================================================
// Mock Data
// ============================================================================

const MOCK_DEFI_SUMMARY: DeFiSummary = {
  totalValueLocked: 45230.50,
  totalRewardsUnclaimed: 1250.75,
  averageApy: 8.5,
  positionCount: 6,
  protocols: ['Aave', 'Uniswap', 'Lido', 'Curve', 'Compound'],
  chains: ['Ethereum', 'Arbitrum', 'Polygon'],
  diversityScore: 85,
};

const MOCK_POSITIONS: DeFiPosition[] = [
  {
    id: '1',
    protocol: 'Aave',
    protocolLogo: '/protocols/aave.svg',
    chain: 'Ethereum',
    type: 'lending',
    assets: [{ symbol: 'ETH', amount: 5.0, value: 16000 }],
    totalValue: 16000,
    apy: 3.2,
    rewards: [],
    healthFactor: 2.5,
    entryDate: '2025-06-15',
  },
  {
    id: '2',
    protocol: 'Aave',
    protocolLogo: '/protocols/aave.svg',
    chain: 'Ethereum',
    type: 'borrowing',
    assets: [{ symbol: 'USDC', amount: 5000, value: 5000 }],
    totalValue: -5000,
    apy: -4.5,
    rewards: [],
    healthFactor: 2.5,
    entryDate: '2025-06-15',
  },
  {
    id: '3',
    protocol: 'Uniswap',
    protocolLogo: '/protocols/uniswap.svg',
    chain: 'Ethereum',
    type: 'liquidity',
    assets: [
      { symbol: 'ETH', amount: 2.5, value: 8000 },
      { symbol: 'USDC', amount: 8000, value: 8000 },
    ],
    totalValue: 16000,
    apy: 12.5,
    rewards: [{ symbol: 'UNI', amount: 25, value: 175, claimable: true }],
    impermanentLoss: 2.3,
    entryDate: '2025-08-01',
  },
  {
    id: '4',
    protocol: 'Lido',
    protocolLogo: '/protocols/lido.svg',
    chain: 'Ethereum',
    type: 'staking',
    assets: [{ symbol: 'stETH', amount: 3.0, value: 9600 }],
    totalValue: 9600,
    apy: 4.8,
    rewards: [{ symbol: 'stETH', amount: 0.05, value: 160, claimable: false }],
    entryDate: '2025-03-20',
  },
  {
    id: '5',
    protocol: 'Curve',
    protocolLogo: '/protocols/curve.svg',
    chain: 'Ethereum',
    type: 'farming',
    assets: [
      { symbol: 'USDC', amount: 5000, value: 5000 },
      { symbol: 'USDT', amount: 5000, value: 5000 },
    ],
    totalValue: 10000,
    apy: 6.2,
    rewards: [
      { symbol: 'CRV', amount: 150, value: 90, claimable: true },
      { symbol: 'CVX', amount: 45, value: 135, claimable: true },
    ],
    impermanentLoss: 0.1,
    entryDate: '2025-09-10',
  },
  {
    id: '6',
    protocol: 'Compound',
    protocolLogo: '/protocols/compound.svg',
    chain: 'Arbitrum',
    type: 'lending',
    assets: [{ symbol: 'USDC', amount: 3000, value: 3000 }],
    totalValue: 3000,
    apy: 5.1,
    rewards: [{ symbol: 'COMP', amount: 0.8, value: 48, claimable: true }],
    entryDate: '2025-10-05',
  },
];

const MOCK_YIELD_OPPORTUNITIES: YieldOpportunity[] = [
  { protocol: 'Pendle', chain: 'Ethereum', pool: 'stETH Pool', assets: ['stETH'], apy: 18.5, tvl: 450000000, riskLevel: 'medium', audited: true },
  { protocol: 'GMX', chain: 'Arbitrum', pool: 'GLP', assets: ['ETH', 'BTC', 'USDC'], apy: 22.3, tvl: 380000000, riskLevel: 'medium', audited: true },
  { protocol: 'Aura', chain: 'Ethereum', pool: 'auraBAL', assets: ['BAL', 'WETH'], apy: 15.2, tvl: 120000000, riskLevel: 'low', audited: true },
  { protocol: 'Convex', chain: 'Ethereum', pool: 'cvxCRV', assets: ['CRV'], apy: 12.8, tvl: 850000000, riskLevel: 'low', audited: true },
  { protocol: 'Rocket Pool', chain: 'Ethereum', pool: 'rETH', assets: ['ETH'], apy: 4.2, tvl: 2100000000, riskLevel: 'low', audited: true },
];

// ============================================================================
// Summary Cards Component
// ============================================================================

interface SummaryCardsProps {
  summary: DeFiSummary;
}

function SummaryCards({ summary }: SummaryCardsProps) {
  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
      {/* Total Value Locked */}
      <div className="rounded-2xl bg-gradient-to-br from-purple-600 to-indigo-700 p-6 text-white">
        <div className="text-sm opacity-80">Total Value Locked</div>
        <div className="mt-2 text-3xl font-bold">{formatCurrency(summary.totalValueLocked)}</div>
        <div className="mt-2 text-sm opacity-80">
          {summary.positionCount} active positions
        </div>
      </div>

      {/* Unclaimed Rewards */}
      <div className="rounded-2xl border-2 border-yellow-200 bg-yellow-50 p-6">
        <div className="text-sm text-yellow-700">Unclaimed Rewards</div>
        <div className="mt-2 text-3xl font-bold text-yellow-800">
          {formatCurrency(summary.totalRewardsUnclaimed)}
        </div>
        <button className="mt-2 text-sm font-medium text-yellow-700 hover:underline">
          Claim All →
        </button>
      </div>

      {/* Average APY */}
      <div className="rounded-2xl border-2 border-green-200 bg-green-50 p-6">
        <div className="text-sm text-green-700">Average APY</div>
        <div className="mt-2 text-3xl font-bold text-green-800">
          {summary.averageApy.toFixed(1)}%
        </div>
        <div className="mt-2 text-sm text-green-600">
          Weighted by position size
        </div>
      </div>

      {/* Diversity Score */}
      <div className="rounded-2xl border-2 border-gray-200 bg-white p-6">
        <div className="text-sm text-gray-500">Diversity Score</div>
        <div className="mt-2 text-3xl font-bold">{summary.diversityScore}/100</div>
        <div className="mt-2">
          <div className="h-2 overflow-hidden rounded-full bg-gray-200">
            <div
              className="h-full bg-blue-500"
              style={{ width: `${summary.diversityScore}%` }}
            />
          </div>
        </div>
      </div>
    </div>
  );
}

// ============================================================================
// Positions List Component
// ============================================================================

interface PositionsListProps {
  positions: DeFiPosition[];
  onClaimRewards?: (positionId: string) => void;
}

function PositionsList({ positions, onClaimRewards }: PositionsListProps) {
  const [filter, setFilter] = useState<DeFiPosition['type'] | 'all'>('all');

  const filteredPositions = useMemo(() => {
    if (filter === 'all') return positions;
    return positions.filter((p) => p.type === filter);
  }, [positions, filter]);

  const getTypeColor = (type: DeFiPosition['type']) => {
    switch (type) {
      case 'lending': return 'bg-blue-100 text-blue-700';
      case 'borrowing': return 'bg-red-100 text-red-700';
      case 'liquidity': return 'bg-purple-100 text-purple-700';
      case 'staking': return 'bg-green-100 text-green-700';
      case 'farming': return 'bg-yellow-100 text-yellow-700';
    }
  };

  return (
    <div className="rounded-2xl border-2 border-gray-200 bg-white">
      <div className="border-b border-gray-200 p-6">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <h3 className="text-lg font-semibold">Your Positions</h3>
          <div className="flex gap-2">
            {(['all', 'lending', 'borrowing', 'liquidity', 'staking', 'farming'] as const).map((t) => (
              <button
                key={t}
                onClick={() => setFilter(t)}
                className={cn(
                  'rounded-lg px-3 py-1.5 text-sm font-medium capitalize transition-all',
                  filter === t
                    ? 'bg-black text-white'
                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                )}
              >
                {t}
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="divide-y divide-gray-100">
        {filteredPositions.map((position) => (
          <div key={position.id} className="p-6 hover:bg-gray-50">
            <div className="flex flex-wrap items-start justify-between gap-4">
              {/* Left: Protocol & Assets */}
              <div className="flex items-start gap-4">
                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-gray-100 text-lg font-bold">
                  {position.protocol.slice(0, 2)}
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-semibold">{position.protocol}</span>
                    <span className={cn(
                      'rounded-md px-2 py-0.5 text-xs font-medium capitalize',
                      getTypeColor(position.type)
                    )}>
                      {position.type}
                    </span>
                    <span className="rounded-md bg-gray-100 px-2 py-0.5 text-xs text-gray-600">
                      {position.chain}
                    </span>
                  </div>
                  <div className="mt-2 flex flex-wrap gap-2">
                    {position.assets.map((asset) => (
                      <div
                        key={asset.symbol}
                        className="flex items-center gap-1 rounded-lg bg-gray-50 px-2 py-1 text-sm"
                      >
                        <span className="font-medium">{asset.amount.toFixed(4)}</span>
                        <span className="text-gray-500">{asset.symbol}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Right: Value & APY */}
              <div className="text-right">
                <div className={cn(
                  'text-xl font-bold',
                  position.totalValue < 0 ? 'text-red-600' : ''
                )}>
                  {formatCurrency(position.totalValue)}
                </div>
                <div className={cn(
                  'text-sm font-medium',
                  position.apy >= 0 ? 'text-green-600' : 'text-red-600'
                )}>
                  {position.apy >= 0 ? '+' : ''}{position.apy.toFixed(2)}% APY
                </div>
              </div>
            </div>

            {/* Health Factor & IL */}
            <div className="mt-4 flex flex-wrap gap-4">
              {position.healthFactor !== undefined && (
                <div className={cn(
                  'rounded-lg px-3 py-1.5 text-sm',
                  position.healthFactor >= 2 ? 'bg-green-50 text-green-700' :
                  position.healthFactor >= 1.5 ? 'bg-yellow-50 text-yellow-700' :
                  'bg-red-50 text-red-700'
                )}>
                  Health Factor: {position.healthFactor.toFixed(2)}
                </div>
              )}
              {position.impermanentLoss !== undefined && position.impermanentLoss > 0 && (
                <div className="rounded-lg bg-orange-50 px-3 py-1.5 text-sm text-orange-700">
                  IL: -{position.impermanentLoss.toFixed(2)}%
                </div>
              )}
            </div>

            {/* Rewards */}
            {position.rewards.length > 0 && (
              <div className="mt-4 flex flex-wrap items-center gap-4">
                <div className="text-sm text-gray-500">Rewards:</div>
                {position.rewards.map((reward) => (
                  <div
                    key={reward.symbol}
                    className="flex items-center gap-2 rounded-lg bg-yellow-50 px-3 py-1.5"
                  >
                    <span className="text-sm font-medium text-yellow-800">
                      {reward.amount.toFixed(4)} {reward.symbol}
                    </span>
                    <span className="text-xs text-yellow-600">
                      ({formatCurrency(reward.value)})
                    </span>
                    {reward.claimable && (
                      <button
                        onClick={() => onClaimRewards?.(position.id)}
                        className="ml-2 rounded bg-yellow-500 px-2 py-0.5 text-xs font-medium text-white hover:bg-yellow-600"
                      >
                        Claim
                      </button>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        ))}
      </div>

      {filteredPositions.length === 0 && (
        <div className="py-12 text-center text-gray-500">
          No positions found
        </div>
      )}
    </div>
  );
}

// ============================================================================
// Yield Opportunities Component
// ============================================================================

interface YieldOpportunitiesProps {
  opportunities: YieldOpportunity[];
}

function YieldOpportunities({ opportunities }: YieldOpportunitiesProps) {
  const getRiskColor = (risk: YieldOpportunity['riskLevel']) => {
    switch (risk) {
      case 'low': return 'bg-green-100 text-green-700';
      case 'medium': return 'bg-yellow-100 text-yellow-700';
      case 'high': return 'bg-red-100 text-red-700';
    }
  };

  return (
    <div className="rounded-2xl border-2 border-gray-200 bg-white p-6">
      <h3 className="mb-4 text-lg font-semibold">Top Yield Opportunities</h3>

      <div className="space-y-4">
        {opportunities.slice(0, 5).map((opp, index) => (
          <div
            key={index}
            className="flex items-center justify-between rounded-xl bg-gray-50 p-4"
          >
            <div className="flex items-center gap-4">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-white text-sm font-bold shadow-sm">
                {opp.protocol.slice(0, 2)}
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <span className="font-semibold">{opp.protocol}</span>
                  <span className="text-sm text-gray-500">{opp.pool}</span>
                </div>
                <div className="mt-1 flex items-center gap-2">
                  <span className="text-xs text-gray-500">{opp.chain}</span>
                  <span className={cn(
                    'rounded px-1.5 py-0.5 text-xs font-medium capitalize',
                    getRiskColor(opp.riskLevel)
                  )}>
                    {opp.riskLevel} risk
                  </span>
                  {opp.audited && (
                    <span className="rounded bg-blue-100 px-1.5 py-0.5 text-xs font-medium text-blue-700">
                      ✓ Audited
                    </span>
                  )}
                </div>
              </div>
            </div>

            <div className="text-right">
              <div className="text-xl font-bold text-green-600">
                {opp.apy.toFixed(1)}% APY
              </div>
              <div className="text-xs text-gray-500">
                TVL: ${formatNumber(opp.tvl)}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

// ============================================================================
// Main Page Component
// ============================================================================

export default function DeFiPage() {
  const [showILCalculator, setShowILCalculator] = useState(false);

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
      {/* Header */}
      <div className="mb-8 flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold">DeFi Dashboard</h1>
          <p className="mt-2 text-gray-600">
            Track your DeFi positions, yields, and rewards across all protocols.
          </p>
        </div>
        <button
          onClick={() => setShowILCalculator(!showILCalculator)}
          className="rounded-xl bg-black px-4 py-2 font-medium text-white hover:bg-gray-900"
        >
          IL Calculator
        </button>
      </div>

      {/* Summary Cards */}
      <div className="mb-8">
        <SummaryCards summary={MOCK_DEFI_SUMMARY} />
      </div>

      {/* IL Calculator Modal */}
      {showILCalculator && (
        <div className="mb-8">
          <ILCalculator onClose={() => setShowILCalculator(false)} />
        </div>
      )}

      {/* Main Content */}
      <div className="grid gap-8 lg:grid-cols-3">
        {/* Positions - 2 columns */}
        <div className="lg:col-span-2">
          <PositionsList positions={MOCK_POSITIONS} />
        </div>

        {/* Sidebar */}
        <div className="space-y-8">
          {/* Yield Opportunities */}
          <YieldOpportunities opportunities={MOCK_YIELD_OPPORTUNITIES} />

          {/* Chain Distribution */}
          <div className="rounded-2xl border-2 border-gray-200 bg-white p-6">
            <h3 className="mb-4 text-lg font-semibold">By Chain</h3>
            <div className="space-y-3">
              {MOCK_DEFI_SUMMARY.chains.map((chain) => {
                const chainPositions = MOCK_POSITIONS.filter(p => p.chain === chain);
                const chainValue = chainPositions.reduce((sum, p) => sum + Math.abs(p.totalValue), 0);
                const percentage = (chainValue / MOCK_DEFI_SUMMARY.totalValueLocked) * 100;

                return (
                  <div key={chain}>
                    <div className="flex justify-between text-sm">
                      <span className="font-medium">{chain}</span>
                      <span className="text-gray-600">{formatCurrency(chainValue)}</span>
                    </div>
                    <div className="mt-1 h-2 overflow-hidden rounded-full bg-gray-100">
                      <div
                        className="h-full bg-blue-500"
                        style={{ width: `${percentage}%` }}
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>

      {/* Yield Tracker */}
      <div className="mt-8">
        <YieldTracker positions={MOCK_POSITIONS} />
      </div>

      {/* Protocol Analytics */}
      <div className="mt-8">
        <ProtocolAnalytics />
      </div>
    </div>
  );
}
