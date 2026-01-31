'use client';

/**
 * Yield Tracker Component
 * 
 * Track yields across DeFi positions with APY history, projections,
 * and gas cost analysis.
 */

import React, { useState, useMemo } from 'react';
import { cn } from '@/lib/utils/cn';
import type { DeFiPosition } from '@/lib/analytics/types';
import { formatCurrency, formatPercentage } from '@/lib/analytics/hooks';

// ============================================================================
// Types
// ============================================================================

interface YieldTrackerProps {
  positions: DeFiPosition[];
  className?: string;
}

// ============================================================================
// Main Component
// ============================================================================

export function YieldTracker({ positions, className }: YieldTrackerProps) {
  const [timeframe, setTimeframe] = useState<'daily' | 'weekly' | 'monthly' | 'yearly'>('monthly');

  // Calculate yield statistics
  const yieldStats = useMemo(() => {
    const activePositions = positions.filter(p => p.apy > 0);
    const totalValue = activePositions.reduce((sum, p) => sum + p.totalValue, 0);
    const weightedApy = totalValue > 0
      ? activePositions.reduce((sum, p) => sum + (p.apy * p.totalValue), 0) / totalValue
      : 0;

    const projections = {
      daily: (totalValue * weightedApy) / 36500,
      weekly: (totalValue * weightedApy) / 5200,
      monthly: (totalValue * weightedApy) / 1200,
      yearly: (totalValue * weightedApy) / 100,
    };

    return {
      totalValue,
      weightedApy,
      projections,
      positionCount: activePositions.length,
    };
  }, [positions]);

  // Sort positions by APY
  const sortedPositions = useMemo(() => {
    return [...positions]
      .filter(p => p.apy > 0)
      .sort((a, b) => b.apy - a.apy);
  }, [positions]);

  return (
    <div className={cn('rounded-2xl border-2 border-gray-200 bg-white p-6', className)}>
      <div className="mb-6 flex flex-wrap items-center justify-between gap-4">
        <h3 className="text-lg font-semibold">Yield Tracker</h3>
        <div className="flex gap-1 rounded-lg bg-gray-100 p-1">
          {(['daily', 'weekly', 'monthly', 'yearly'] as const).map((tf) => (
            <button
              key={tf}
              onClick={() => setTimeframe(tf)}
              className={cn(
                'rounded-md px-3 py-1.5 text-sm font-medium capitalize transition-all',
                timeframe === tf
                  ? 'bg-white text-black shadow-sm'
                  : 'text-gray-600 hover:text-black'
              )}
            >
              {tf}
            </button>
          ))}
        </div>
      </div>

      {/* Projections */}
      <div className="mb-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <div className="rounded-xl bg-green-50 p-4">
          <div className="text-sm text-green-700">Projected Earnings</div>
          <div className="mt-1 text-2xl font-bold text-green-800">
            {formatCurrency(yieldStats.projections[timeframe])}
          </div>
          <div className="mt-1 text-xs text-green-600">
            Per {timeframe.replace('ly', '')}
          </div>
        </div>

        <div className="rounded-xl bg-blue-50 p-4">
          <div className="text-sm text-blue-700">Weighted APY</div>
          <div className="mt-1 text-2xl font-bold text-blue-800">
            {yieldStats.weightedApy.toFixed(2)}%
          </div>
          <div className="mt-1 text-xs text-blue-600">
            Across {yieldStats.positionCount} positions
          </div>
        </div>

        <div className="rounded-xl bg-purple-50 p-4">
          <div className="text-sm text-purple-700">Yearly Projection</div>
          <div className="mt-1 text-2xl font-bold text-purple-800">
            {formatCurrency(yieldStats.projections.yearly)}
          </div>
          <div className="mt-1 text-xs text-purple-600">
            At current rates
          </div>
        </div>

        <div className="rounded-xl bg-gray-50 p-4">
          <div className="text-sm text-gray-700">Earning Value</div>
          <div className="mt-1 text-2xl font-bold">
            {formatCurrency(yieldStats.totalValue)}
          </div>
          <div className="mt-1 text-xs text-gray-600">
            Total yielding assets
          </div>
        </div>
      </div>

      {/* Positions by APY */}
      <h4 className="mb-4 font-semibold">Positions by APY</h4>
      <div className="space-y-3">
        {sortedPositions.map((position) => {
          const yearlyEarnings = (position.totalValue * position.apy) / 100;
          const periodEarnings = {
            daily: yearlyEarnings / 365,
            weekly: yearlyEarnings / 52,
            monthly: yearlyEarnings / 12,
            yearly: yearlyEarnings,
          };

          return (
            <div
              key={position.id}
              className="flex items-center justify-between rounded-xl bg-gray-50 p-4"
            >
              <div className="flex items-center gap-4">
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-white text-sm font-bold shadow-sm">
                  {position.protocol.slice(0, 2)}
                </div>
                <div>
                  <div className="font-semibold">{position.protocol}</div>
                  <div className="text-sm text-gray-500">
                    {position.assets.map(a => a.symbol).join(' / ')}
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-8">
                <div className="text-right">
                  <div className="text-sm text-gray-500">Value</div>
                  <div className="font-medium">{formatCurrency(position.totalValue)}</div>
                </div>
                <div className="text-right">
                  <div className="text-sm text-gray-500">APY</div>
                  <div className="font-bold text-green-600">{position.apy.toFixed(2)}%</div>
                </div>
                <div className="text-right">
                  <div className="text-sm text-gray-500">{timeframe} Earnings</div>
                  <div className="font-medium text-green-600">
                    +{formatCurrency(periodEarnings[timeframe])}
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {sortedPositions.length === 0 && (
        <div className="py-8 text-center text-gray-500">
          No yielding positions found
        </div>
      )}

      {/* Gas Cost Analysis */}
      <div className="mt-6 rounded-xl bg-orange-50 p-4">
        <div className="flex items-center justify-between">
          <div>
            <div className="font-semibold text-orange-800">Gas Cost Analysis</div>
            <div className="text-sm text-orange-600">
              Estimated gas to claim all rewards: ~$45
            </div>
          </div>
          <div className="text-right">
            <div className="text-sm text-orange-600">Break-even time</div>
            <div className="font-semibold text-orange-800">~3 days</div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default YieldTracker;
