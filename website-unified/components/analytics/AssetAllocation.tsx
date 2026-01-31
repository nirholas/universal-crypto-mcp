'use client';

/**
 * Asset Allocation Component
 * 
 * Interactive pie/donut charts showing portfolio allocation by asset, chain,
 * and category with target vs actual comparison and rebalancing suggestions.
 */

import React, { useState, useMemo } from 'react';
import { cn } from '@/lib/utils/cn';
import type { AllocationData, AllocationSegment, RebalanceSuggestion } from '@/lib/analytics/types';
import { formatCurrency, formatPercentage } from '@/lib/analytics/hooks';

// ============================================================================
// Types
// ============================================================================

interface AssetAllocationProps {
  data: AllocationData | null;
  loading?: boolean;
  showTarget?: boolean;
  onRebalance?: (suggestions: RebalanceSuggestion[]) => void;
  className?: string;
}

type ViewMode = 'asset' | 'chain' | 'category';

// ============================================================================
// Chart Colors
// ============================================================================

const CHART_COLORS = [
  '#3B82F6', // blue
  '#8B5CF6', // violet
  '#EC4899', // pink
  '#F59E0B', // amber
  '#10B981', // emerald
  '#06B6D4', // cyan
  '#6366F1', // indigo
  '#EF4444', // red
  '#84CC16', // lime
  '#F97316', // orange
  '#14B8A6', // teal
  '#A855F7', // purple
];

const CATEGORY_COLORS: Record<string, string> = {
  token: '#3B82F6',
  nft: '#8B5CF6',
  defi: '#10B981',
  stablecoin: '#6B7280',
};

const CHAIN_COLORS: Record<string, string> = {
  ethereum: '#627EEA',
  polygon: '#8247E5',
  arbitrum: '#28A0F0',
  optimism: '#FF0420',
  base: '#0052FF',
  avalanche: '#E84142',
  bsc: '#F3BA2F',
  solana: '#9945FF',
};

// ============================================================================
// Donut Chart Component
// ============================================================================

interface DonutChartProps {
  segments: AllocationSegment[];
  size?: number;
  strokeWidth?: number;
  showLabels?: boolean;
  centerLabel?: string;
  centerValue?: string;
  onSegmentHover?: (segment: AllocationSegment | null) => void;
}

function DonutChart({
  segments,
  size = 200,
  strokeWidth = 40,
  centerLabel,
  centerValue,
  onSegmentHover,
}: DonutChartProps) {
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);

  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const center = size / 2;

  // Calculate segment arcs
  const arcs = useMemo(() => {
    let currentAngle = -90; // Start from top
    return segments.map((segment, index) => {
      const angle = (segment.percentage / 100) * 360;
      const startAngle = currentAngle;
      currentAngle += angle;
      
      const strokeDasharray = (segment.percentage / 100) * circumference;
      const strokeDashoffset = -((startAngle + 90) / 360) * circumference;
      
      return {
        ...segment,
        index,
        startAngle,
        angle,
        strokeDasharray: `${strokeDasharray} ${circumference}`,
        strokeDashoffset,
        color: segment.color || CHART_COLORS[index % CHART_COLORS.length],
      };
    });
  }, [segments, circumference]);

  return (
    <div className="relative inline-block">
      <svg width={size} height={size} className="rotate-[-90deg]">
        {/* Background circle */}
        <circle
          cx={center}
          cy={center}
          r={radius}
          fill="none"
          stroke="#F3F4F6"
          strokeWidth={strokeWidth}
        />
        
        {/* Segments */}
        {arcs.map((arc) => (
          <circle
            key={arc.index}
            cx={center}
            cy={center}
            r={radius}
            fill="none"
            stroke={arc.color}
            strokeWidth={hoveredIndex === arc.index ? strokeWidth + 8 : strokeWidth}
            strokeDasharray={arc.strokeDasharray}
            strokeDashoffset={arc.strokeDashoffset}
            className="cursor-pointer transition-all duration-200"
            style={{
              opacity: hoveredIndex !== null && hoveredIndex !== arc.index ? 0.5 : 1,
            }}
            onMouseEnter={() => {
              setHoveredIndex(arc.index);
              onSegmentHover?.(arc);
            }}
            onMouseLeave={() => {
              setHoveredIndex(null);
              onSegmentHover?.(null);
            }}
          />
        ))}
      </svg>
      
      {/* Center content */}
      {(centerLabel || centerValue) && (
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          {centerValue && (
            <div className="text-2xl font-bold">{centerValue}</div>
          )}
          {centerLabel && (
            <div className="text-sm text-gray-500">{centerLabel}</div>
          )}
        </div>
      )}
    </div>
  );
}

// ============================================================================
// Legend Component
// ============================================================================

interface LegendProps {
  segments: AllocationSegment[];
  showValues?: boolean;
}

function Legend({ segments, showValues = true }: LegendProps) {
  return (
    <div className="space-y-2">
      {segments.map((segment, index) => (
        <div
          key={segment.name}
          className="flex items-center justify-between gap-4 text-sm"
        >
          <div className="flex items-center gap-2">
            <div
              className="h-3 w-3 rounded-full"
              style={{
                backgroundColor: segment.color || CHART_COLORS[index % CHART_COLORS.length],
              }}
            />
            <span className="font-medium">{segment.name}</span>
          </div>
          {showValues && (
            <div className="flex items-center gap-2 text-right">
              <span className="text-gray-600">{segment.percentage.toFixed(1)}%</span>
              <span className="text-gray-400">{formatCurrency(segment.value)}</span>
            </div>
          )}
        </div>
      ))}
    </div>
  );
}

// ============================================================================
// Comparison Chart Component
// ============================================================================

interface ComparisonChartProps {
  actual: AllocationSegment[];
  target: AllocationSegment[];
}

function ComparisonChart({ actual, target }: ComparisonChartProps) {
  const comparison = useMemo(() => {
    const targetMap = new Map(target.map((t) => [t.name, t.percentage]));
    return actual.map((a, index) => ({
      name: a.name,
      actual: a.percentage,
      target: targetMap.get(a.name) || 0,
      diff: a.percentage - (targetMap.get(a.name) || 0),
      color: a.color || CHART_COLORS[index % CHART_COLORS.length],
    }));
  }, [actual, target]);

  const maxPercentage = Math.max(
    ...comparison.map((c) => Math.max(c.actual, c.target))
  );

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-4 text-xs">
        <div className="flex items-center gap-2">
          <div className="h-2 w-4 rounded bg-black" />
          <span>Actual</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="h-2 w-4 rounded border-2 border-dashed border-gray-400 bg-transparent" />
          <span>Target</span>
        </div>
      </div>
      
      {comparison.map((item) => (
        <div key={item.name} className="space-y-1">
          <div className="flex items-center justify-between text-sm">
            <span className="font-medium">{item.name}</span>
            <span
              className={cn(
                'text-xs',
                item.diff > 2
                  ? 'text-red-600'
                  : item.diff < -2
                    ? 'text-green-600'
                    : 'text-gray-500'
              )}
            >
              {item.diff > 0 ? '+' : ''}
              {item.diff.toFixed(1)}%
            </span>
          </div>
          <div className="relative h-6 rounded-full bg-gray-100">
            {/* Actual bar */}
            <div
              className="absolute inset-y-0 left-0 rounded-full transition-all"
              style={{
                width: `${(item.actual / maxPercentage) * 100}%`,
                backgroundColor: item.color,
              }}
            />
            {/* Target marker */}
            <div
              className="absolute inset-y-0 w-1 bg-gray-800"
              style={{
                left: `${(item.target / maxPercentage) * 100}%`,
              }}
            />
          </div>
          <div className="flex justify-between text-xs text-gray-500">
            <span>{item.actual.toFixed(1)}% actual</span>
            <span>{item.target.toFixed(1)}% target</span>
          </div>
        </div>
      ))}
    </div>
  );
}

// ============================================================================
// Rebalancing Suggestions Component
// ============================================================================

interface RebalancingSuggestionsProps {
  actual: AllocationSegment[];
  target: AllocationSegment[];
  totalValue: number;
  onExecute?: (suggestions: RebalanceSuggestion[]) => void;
}

function RebalancingSuggestions({
  actual,
  target,
  totalValue,
  onExecute,
}: RebalancingSuggestionsProps) {
  const suggestions = useMemo(() => {
    const targetMap = new Map(target.map((t) => [t.name, t.percentage]));
    
    return actual
      .map((a) => {
        const targetPct = targetMap.get(a.name) || 0;
        const diff = a.percentage - targetPct;
        const amountDiff = (diff / 100) * totalValue;
        
        if (Math.abs(diff) < 1) return null; // Skip small differences
        
        return {
          asset: a.name,
          currentPercentage: a.percentage,
          targetPercentage: targetPct,
          action: diff > 0 ? 'sell' : 'buy',
          amount: Math.abs((diff / 100) * (a.value / (a.percentage / 100))),
          amountUsd: Math.abs(amountDiff),
        } as RebalanceSuggestion;
      })
      .filter((s): s is RebalanceSuggestion => s !== null)
      .sort((a, b) => b.amountUsd - a.amountUsd);
  }, [actual, target, totalValue]);

  if (suggestions.length === 0) {
    return (
      <div className="rounded-xl bg-green-50 p-4 text-center text-green-700">
        <div className="text-lg font-semibold">✓ Portfolio Balanced</div>
        <div className="text-sm">Your allocation matches your targets</div>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      <h4 className="font-semibold">Rebalancing Suggestions</h4>
      {suggestions.map((suggestion) => (
        <div
          key={suggestion.asset}
          className={cn(
            'flex items-center justify-between rounded-xl p-3',
            suggestion.action === 'buy' ? 'bg-green-50' : 'bg-red-50'
          )}
        >
          <div>
            <div className="flex items-center gap-2">
              <span
                className={cn(
                  'rounded-md px-2 py-0.5 text-xs font-medium uppercase',
                  suggestion.action === 'buy'
                    ? 'bg-green-100 text-green-700'
                    : 'bg-red-100 text-red-700'
                )}
              >
                {suggestion.action}
              </span>
              <span className="font-medium">{suggestion.asset}</span>
            </div>
            <div className="mt-1 text-sm text-gray-600">
              {suggestion.currentPercentage.toFixed(1)}% → {suggestion.targetPercentage.toFixed(1)}%
            </div>
          </div>
          <div className="text-right">
            <div className="font-semibold">{formatCurrency(suggestion.amountUsd)}</div>
          </div>
        </div>
      ))}
      
      {onExecute && (
        <button
          onClick={() => onExecute(suggestions)}
          className="mt-4 w-full rounded-xl bg-black py-3 font-semibold text-white transition-colors hover:bg-gray-900"
        >
          Execute Rebalance
        </button>
      )}
    </div>
  );
}

// ============================================================================
// Loading Skeleton
// ============================================================================

function LoadingSkeleton() {
  return (
    <div className="flex items-center justify-center gap-8">
      <div className="h-48 w-48 animate-pulse rounded-full bg-gray-200" />
      <div className="flex-1 space-y-3">
        {[1, 2, 3, 4].map((i) => (
          <div key={i} className="flex items-center gap-3">
            <div className="h-3 w-3 animate-pulse rounded-full bg-gray-200" />
            <div className="h-4 flex-1 animate-pulse rounded bg-gray-200" />
          </div>
        ))}
      </div>
    </div>
  );
}

// ============================================================================
// Main Component
// ============================================================================

export function AssetAllocation({
  data,
  loading = false,
  showTarget = false,
  onRebalance,
  className,
}: AssetAllocationProps) {
  const [viewMode, setViewMode] = useState<ViewMode>('asset');
  const [hoveredSegment, setHoveredSegment] = useState<AllocationSegment | null>(null);

  // Get current segments based on view mode
  const currentSegments = useMemo(() => {
    if (!data) return [];
    
    switch (viewMode) {
      case 'asset':
        return data.byAsset.map((s, i) => ({
          ...s,
          color: s.color || CHART_COLORS[i % CHART_COLORS.length],
        }));
      case 'chain':
        return data.byChain.map((s) => ({
          ...s,
          color: CHAIN_COLORS[s.name.toLowerCase()] || s.color,
        }));
      case 'category':
        return data.byCategory.map((s) => ({
          ...s,
          color: CATEGORY_COLORS[s.name.toLowerCase()] || s.color,
        }));
      default:
        return [];
    }
  }, [data, viewMode]);

  // Calculate total value
  const totalValue = useMemo(() => {
    return currentSegments.reduce((sum, s) => sum + s.value, 0);
  }, [currentSegments]);

  if (loading) {
    return (
      <div className={cn('rounded-2xl border-2 border-gray-200 bg-white p-6', className)}>
        <h3 className="mb-6 text-lg font-semibold">Asset Allocation</h3>
        <LoadingSkeleton />
      </div>
    );
  }

  if (!data || currentSegments.length === 0) {
    return (
      <div className={cn('rounded-2xl border-2 border-gray-200 bg-white p-6', className)}>
        <h3 className="mb-6 text-lg font-semibold">Asset Allocation</h3>
        <div className="flex h-48 items-center justify-center text-gray-500">
          No allocation data available
        </div>
      </div>
    );
  }

  return (
    <div className={cn('rounded-2xl border-2 border-gray-200 bg-white p-6', className)}>
      {/* Header */}
      <div className="mb-6 flex flex-wrap items-center justify-between gap-4">
        <h3 className="text-lg font-semibold">Asset Allocation</h3>
        <div className="flex gap-1 rounded-lg bg-gray-100 p-1">
          {(['asset', 'chain', 'category'] as const).map((mode) => (
            <button
              key={mode}
              onClick={() => setViewMode(mode)}
              className={cn(
                'rounded-md px-3 py-1.5 text-sm font-medium capitalize transition-all',
                viewMode === mode
                  ? 'bg-white text-black shadow-sm'
                  : 'text-gray-600 hover:text-black'
              )}
            >
              {mode}
            </button>
          ))}
        </div>
      </div>

      {/* Chart and Legend */}
      <div className="flex flex-col items-center gap-8 lg:flex-row">
        <div className="flex-shrink-0">
          <DonutChart
            segments={currentSegments}
            size={220}
            strokeWidth={45}
            centerLabel={hoveredSegment ? hoveredSegment.name : 'Total Value'}
            centerValue={
              hoveredSegment
                ? formatCurrency(hoveredSegment.value)
                : formatCurrency(totalValue)
            }
            onSegmentHover={setHoveredSegment}
          />
        </div>
        
        <div className="w-full flex-1">
          <Legend segments={currentSegments} showValues />
        </div>
      </div>

      {/* Target vs Actual Comparison */}
      {showTarget && data.targetAllocation && viewMode === 'asset' && (
        <div className="mt-8 border-t border-gray-100 pt-6">
          <h4 className="mb-4 font-semibold">Target vs Actual</h4>
          <ComparisonChart actual={data.byAsset} target={data.targetAllocation} />
        </div>
      )}

      {/* Rebalancing Suggestions */}
      {showTarget && data.targetAllocation && viewMode === 'asset' && (
        <div className="mt-6 border-t border-gray-100 pt-6">
          <RebalancingSuggestions
            actual={data.byAsset}
            target={data.targetAllocation}
            totalValue={totalValue}
            onExecute={onRebalance}
          />
        </div>
      )}
    </div>
  );
}

export default AssetAllocation;
