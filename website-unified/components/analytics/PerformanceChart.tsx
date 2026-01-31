'use client';

/**
 * Performance Chart Component
 * 
 * Interactive line chart with zoom, multiple timeframes, benchmark comparison,
 * drawdown visualization, and volume overlay.
 */

import React, { useState, useMemo, useCallback } from 'react';
import { cn } from '@/lib/utils/cn';
import type { Timeframe, HistoricalData, ChartDataPoint, DrawdownData } from '@/lib/analytics/types';
import { formatCurrency, formatPercentage, formatDate } from '@/lib/analytics/hooks';

// ============================================================================
// Types
// ============================================================================

interface PerformanceChartProps {
  data: HistoricalData | null;
  loading?: boolean;
  timeframe: Timeframe;
  onTimeframeChange: (timeframe: Timeframe) => void;
  showBenchmarks?: boolean;
  showVolume?: boolean;
  showDrawdown?: boolean;
  benchmarks?: ('btc' | 'eth' | 'sp500')[];
  className?: string;
}

interface TooltipData {
  x: number;
  y: number;
  timestamp: string;
  value: number;
  benchmarks?: { btc?: number; eth?: number; sp500?: number };
  drawdown?: number;
}

// ============================================================================
// Constants
// ============================================================================

const TIMEFRAMES: { value: Timeframe; label: string }[] = [
  { value: '1D', label: '1D' },
  { value: '1W', label: '1W' },
  { value: '1M', label: '1M' },
  { value: '3M', label: '3M' },
  { value: '1Y', label: '1Y' },
  { value: 'ALL', label: 'ALL' },
];

const BENCHMARK_COLORS = {
  btc: '#F7931A',
  eth: '#627EEA',
  sp500: '#22C55E',
};

const BENCHMARK_LABELS = {
  btc: 'Bitcoin',
  eth: 'Ethereum',
  sp500: 'S&P 500',
};

// ============================================================================
// Chart Utilities
// ============================================================================

function normalizeData(values: number[]): number[] {
  if (values.length === 0) return [];
  const firstValue = values[0];
  if (firstValue === 0) return values.map(() => 0);
  return values.map((v) => ((v - firstValue) / firstValue) * 100);
}

function getMinMax(data: number[]): { min: number; max: number } {
  if (data.length === 0) return { min: 0, max: 0 };
  return {
    min: Math.min(...data),
    max: Math.max(...data),
  };
}

function createPath(
  points: { x: number; y: number }[],
  smooth: boolean = true
): string {
  if (points.length < 2) return '';
  
  if (!smooth) {
    return points.map((p, i) => `${i === 0 ? 'M' : 'L'} ${p.x} ${p.y}`).join(' ');
  }
  
  // Create smooth bezier curve
  let path = `M ${points[0].x} ${points[0].y}`;
  
  for (let i = 1; i < points.length; i++) {
    const prev = points[i - 1];
    const curr = points[i];
    const cpx = (prev.x + curr.x) / 2;
    path += ` C ${cpx} ${prev.y}, ${cpx} ${curr.y}, ${curr.x} ${curr.y}`;
  }
  
  return path;
}

// ============================================================================
// Sub-components
// ============================================================================

function TimeframeSelector({
  value,
  onChange,
}: {
  value: Timeframe;
  onChange: (t: Timeframe) => void;
}) {
  return (
    <div className="flex gap-1 rounded-lg bg-gray-100 p-1">
      {TIMEFRAMES.map((tf) => (
        <button
          key={tf.value}
          onClick={() => onChange(tf.value)}
          className={cn(
            'rounded-md px-3 py-1.5 text-sm font-medium transition-all',
            value === tf.value
              ? 'bg-white text-black shadow-sm'
              : 'text-gray-600 hover:text-black'
          )}
        >
          {tf.label}
        </button>
      ))}
    </div>
  );
}

function ChartLegend({
  showBenchmarks,
  benchmarks,
}: {
  showBenchmarks: boolean;
  benchmarks: ('btc' | 'eth' | 'sp500')[];
}) {
  return (
    <div className="flex flex-wrap gap-4 text-sm">
      <div className="flex items-center gap-2">
        <div className="h-3 w-3 rounded-full bg-black" />
        <span>Portfolio</span>
      </div>
      {showBenchmarks &&
        benchmarks.map((b) => (
          <div key={b} className="flex items-center gap-2">
            <div
              className="h-3 w-3 rounded-full"
              style={{ backgroundColor: BENCHMARK_COLORS[b] }}
            />
            <span>{BENCHMARK_LABELS[b]}</span>
          </div>
        ))}
    </div>
  );
}

function ChartTooltip({ data }: { data: TooltipData | null }) {
  if (!data) return null;

  return (
    <div
      className="pointer-events-none absolute z-50 rounded-lg border border-gray-200 bg-white p-3 shadow-lg"
      style={{
        left: data.x,
        top: data.y,
        transform: 'translate(-50%, -120%)',
      }}
    >
      <div className="text-xs text-gray-500">{formatDate(data.timestamp)}</div>
      <div className="mt-1 font-semibold">{formatCurrency(data.value)}</div>
      {data.benchmarks && (
        <div className="mt-2 space-y-1 border-t border-gray-100 pt-2">
          {data.benchmarks.btc !== undefined && (
            <div className="flex items-center justify-between gap-4 text-xs">
              <span style={{ color: BENCHMARK_COLORS.btc }}>BTC</span>
              <span>{formatPercentage(data.benchmarks.btc)}</span>
            </div>
          )}
          {data.benchmarks.eth !== undefined && (
            <div className="flex items-center justify-between gap-4 text-xs">
              <span style={{ color: BENCHMARK_COLORS.eth }}>ETH</span>
              <span>{formatPercentage(data.benchmarks.eth)}</span>
            </div>
          )}
          {data.benchmarks.sp500 !== undefined && (
            <div className="flex items-center justify-between gap-4 text-xs">
              <span style={{ color: BENCHMARK_COLORS.sp500 }}>S&P 500</span>
              <span>{formatPercentage(data.benchmarks.sp500)}</span>
            </div>
          )}
        </div>
      )}
      {data.drawdown !== undefined && data.drawdown > 0 && (
        <div className="mt-2 border-t border-gray-100 pt-2 text-xs text-red-600">
          Drawdown: -{data.drawdown.toFixed(2)}%
        </div>
      )}
    </div>
  );
}

function LoadingSkeleton() {
  return (
    <div className="flex h-[400px] items-center justify-center">
      <div className="flex flex-col items-center gap-3">
        <div className="h-8 w-8 animate-spin rounded-full border-2 border-gray-200 border-t-black" />
        <span className="text-sm text-gray-500">Loading chart data...</span>
      </div>
    </div>
  );
}

// ============================================================================
// Main Component
// ============================================================================

export function PerformanceChart({
  data,
  loading = false,
  timeframe,
  onTimeframeChange,
  showBenchmarks = false,
  showVolume = false,
  showDrawdown = false,
  benchmarks = ['btc', 'eth'],
  className,
}: PerformanceChartProps) {
  const [tooltip, setTooltip] = useState<TooltipData | null>(null);
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);

  // Chart dimensions
  const width = 800;
  const height = 400;
  const padding = { top: 20, right: 20, bottom: 40, left: 60 };
  const chartWidth = width - padding.left - padding.right;
  const chartHeight = height - padding.top - padding.bottom - (showDrawdown ? 80 : 0);
  const drawdownHeight = showDrawdown ? 60 : 0;

  // Process data
  const chartData = useMemo(() => {
    if (!data || data.values.length === 0) return null;

    const normalizedPortfolio = normalizeData(data.values);
    const normalizedBtc = data.benchmarks?.btc ? normalizeData(data.benchmarks.btc) : [];
    const normalizedEth = data.benchmarks?.eth ? normalizeData(data.benchmarks.eth) : [];
    const normalizedSp500 = data.benchmarks?.sp500 ? normalizeData(data.benchmarks.sp500) : [];

    // Calculate drawdown
    let peak = 0;
    const drawdowns = data.values.map((v) => {
      peak = Math.max(peak, v);
      return peak > 0 ? ((peak - v) / peak) * 100 : 0;
    });

    // Find y-axis range
    let allValues = [...normalizedPortfolio];
    if (showBenchmarks) {
      if (benchmarks.includes('btc')) allValues = [...allValues, ...normalizedBtc];
      if (benchmarks.includes('eth')) allValues = [...allValues, ...normalizedEth];
      if (benchmarks.includes('sp500')) allValues = [...allValues, ...normalizedSp500];
    }
    const { min, max } = getMinMax(allValues);
    const yPadding = (max - min) * 0.1 || 10;
    const yMin = min - yPadding;
    const yMax = max + yPadding;

    // Create points
    const xScale = (i: number) => padding.left + (i / (data.values.length - 1)) * chartWidth;
    const yScale = (v: number) =>
      padding.top + chartHeight - ((v - yMin) / (yMax - yMin)) * chartHeight;
    const drawdownScale = (d: number) => {
      const maxDrawdown = Math.max(...drawdowns, 10);
      return (d / maxDrawdown) * drawdownHeight;
    };

    const portfolioPoints = normalizedPortfolio.map((v, i) => ({
      x: xScale(i),
      y: yScale(v),
    }));

    const btcPoints = normalizedBtc.map((v, i) => ({ x: xScale(i), y: yScale(v) }));
    const ethPoints = normalizedEth.map((v, i) => ({ x: xScale(i), y: yScale(v) }));
    const sp500Points = normalizedSp500.map((v, i) => ({ x: xScale(i), y: yScale(v) }));

    // Y-axis labels
    const yLabels = [];
    const steps = 5;
    for (let i = 0; i <= steps; i++) {
      const value = yMin + ((yMax - yMin) / steps) * i;
      yLabels.push({
        value: value.toFixed(1) + '%',
        y: padding.top + chartHeight - (i / steps) * chartHeight,
      });
    }

    // X-axis labels
    const xLabels = [];
    const labelCount = Math.min(6, data.timestamps.length);
    for (let i = 0; i < labelCount; i++) {
      const index = Math.floor((i / (labelCount - 1)) * (data.timestamps.length - 1));
      xLabels.push({
        label: formatDate(data.timestamps[index]),
        x: xScale(index),
      });
    }

    return {
      portfolioPoints,
      btcPoints,
      ethPoints,
      sp500Points,
      drawdowns,
      yLabels,
      xLabels,
      yMin,
      yMax,
      xScale,
      yScale,
      drawdownScale,
      normalizedBtc,
      normalizedEth,
      normalizedSp500,
    };
  }, [data, showBenchmarks, benchmarks, chartWidth, chartHeight, showDrawdown]);

  // Mouse handlers
  const handleMouseMove = useCallback(
    (e: React.MouseEvent<SVGSVGElement>) => {
      if (!data || !chartData) return;

      const rect = e.currentTarget.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const relativeX = x - padding.left;
      const index = Math.round((relativeX / chartWidth) * (data.values.length - 1));

      if (index >= 0 && index < data.values.length) {
        setHoveredIndex(index);
        setTooltip({
          x: chartData.xScale(index),
          y: chartData.portfolioPoints[index].y,
          timestamp: data.timestamps[index],
          value: data.values[index],
          benchmarks: showBenchmarks
            ? {
                btc: chartData.normalizedBtc[index],
                eth: chartData.normalizedEth[index],
                sp500: chartData.normalizedSp500[index],
              }
            : undefined,
          drawdown: showDrawdown ? chartData.drawdowns[index] : undefined,
        });
      }
    },
    [data, chartData, chartWidth, showBenchmarks, showDrawdown]
  );

  const handleMouseLeave = useCallback(() => {
    setTooltip(null);
    setHoveredIndex(null);
  }, []);

  // Calculate performance stats
  const stats = useMemo(() => {
    if (!data || data.values.length < 2) return null;

    const startValue = data.values[0];
    const endValue = data.values[data.values.length - 1];
    const change = endValue - startValue;
    const changePercent = (change / startValue) * 100;
    const maxValue = Math.max(...data.values);
    const minValue = Math.min(...data.values);
    const maxDrawdown = data.values.reduce(
      (max, v, i, arr) => {
        const peak = Math.max(...arr.slice(0, i + 1));
        const dd = ((peak - v) / peak) * 100;
        return dd > max ? dd : max;
      },
      0
    );

    return {
      change,
      changePercent,
      maxValue,
      minValue,
      maxDrawdown,
      isPositive: change >= 0,
    };
  }, [data]);

  if (loading) {
    return (
      <div className={cn('rounded-2xl border-2 border-gray-200 bg-white p-6', className)}>
        <div className="mb-4 flex items-center justify-between">
          <h3 className="text-lg font-semibold">Performance</h3>
          <TimeframeSelector value={timeframe} onChange={onTimeframeChange} />
        </div>
        <LoadingSkeleton />
      </div>
    );
  }

  if (!data || !chartData) {
    return (
      <div className={cn('rounded-2xl border-2 border-gray-200 bg-white p-6', className)}>
        <div className="mb-4 flex items-center justify-between">
          <h3 className="text-lg font-semibold">Performance</h3>
          <TimeframeSelector value={timeframe} onChange={onTimeframeChange} />
        </div>
        <div className="flex h-[400px] items-center justify-center text-gray-500">
          No data available
        </div>
      </div>
    );
  }

  const totalHeight = height + (showDrawdown ? 80 : 0);

  return (
    <div className={cn('rounded-2xl border-2 border-gray-200 bg-white p-6', className)}>
      {/* Header */}
      <div className="mb-4 flex flex-wrap items-center justify-between gap-4">
        <div>
          <h3 className="text-lg font-semibold">Performance</h3>
          {stats && (
            <div className="mt-1 flex items-baseline gap-2">
              <span
                className={cn(
                  'text-2xl font-bold',
                  stats.isPositive ? 'text-green-600' : 'text-red-600'
                )}
              >
                {formatPercentage(stats.changePercent)}
              </span>
              <span className="text-sm text-gray-500">
                ({formatCurrency(stats.change)})
              </span>
            </div>
          )}
        </div>
        <TimeframeSelector value={timeframe} onChange={onTimeframeChange} />
      </div>

      {/* Chart Legend */}
      {showBenchmarks && (
        <div className="mb-4">
          <ChartLegend showBenchmarks={showBenchmarks} benchmarks={benchmarks} />
        </div>
      )}

      {/* Chart */}
      <div className="relative touch-none">
        <ChartTooltip data={tooltip} />
        <svg
          width="100%"
          viewBox={`0 0 ${width} ${totalHeight}`}
          className="overflow-visible"
          onMouseMove={handleMouseMove}
          onMouseLeave={handleMouseLeave}
        >
          {/* Grid lines */}
          <g className="text-gray-200">
            {chartData.yLabels.map((label, i) => (
              <line
                key={i}
                x1={padding.left}
                y1={label.y}
                x2={width - padding.right}
                y2={label.y}
                stroke="currentColor"
                strokeDasharray="4 4"
              />
            ))}
          </g>

          {/* Zero line */}
          <line
            x1={padding.left}
            y1={chartData.yScale(0)}
            x2={width - padding.right}
            y2={chartData.yScale(0)}
            stroke="#9CA3AF"
            strokeWidth={1}
          />

          {/* Benchmark lines */}
          {showBenchmarks && benchmarks.includes('btc') && chartData.btcPoints.length > 0 && (
            <path
              d={createPath(chartData.btcPoints)}
              fill="none"
              stroke={BENCHMARK_COLORS.btc}
              strokeWidth={1.5}
              strokeOpacity={0.6}
            />
          )}
          {showBenchmarks && benchmarks.includes('eth') && chartData.ethPoints.length > 0 && (
            <path
              d={createPath(chartData.ethPoints)}
              fill="none"
              stroke={BENCHMARK_COLORS.eth}
              strokeWidth={1.5}
              strokeOpacity={0.6}
            />
          )}
          {showBenchmarks && benchmarks.includes('sp500') && chartData.sp500Points.length > 0 && (
            <path
              d={createPath(chartData.sp500Points)}
              fill="none"
              stroke={BENCHMARK_COLORS.sp500}
              strokeWidth={1.5}
              strokeOpacity={0.6}
            />
          )}

          {/* Portfolio area fill */}
          <defs>
            <linearGradient id="portfolioGradient" x1="0" x2="0" y1="0" y2="1">
              <stop
                offset="0%"
                stopColor={stats?.isPositive ? '#22C55E' : '#EF4444'}
                stopOpacity={0.3}
              />
              <stop
                offset="100%"
                stopColor={stats?.isPositive ? '#22C55E' : '#EF4444'}
                stopOpacity={0}
              />
            </linearGradient>
          </defs>
          <path
            d={`${createPath(chartData.portfolioPoints)} L ${chartData.portfolioPoints[chartData.portfolioPoints.length - 1].x} ${padding.top + chartHeight} L ${chartData.portfolioPoints[0].x} ${padding.top + chartHeight} Z`}
            fill="url(#portfolioGradient)"
          />

          {/* Portfolio line */}
          <path
            d={createPath(chartData.portfolioPoints)}
            fill="none"
            stroke={stats?.isPositive ? '#22C55E' : '#EF4444'}
            strokeWidth={2.5}
          />

          {/* Hover indicator */}
          {hoveredIndex !== null && (
            <>
              <line
                x1={chartData.portfolioPoints[hoveredIndex].x}
                y1={padding.top}
                x2={chartData.portfolioPoints[hoveredIndex].x}
                y2={padding.top + chartHeight}
                stroke="#9CA3AF"
                strokeWidth={1}
                strokeDasharray="4 4"
              />
              <circle
                cx={chartData.portfolioPoints[hoveredIndex].x}
                cy={chartData.portfolioPoints[hoveredIndex].y}
                r={6}
                fill="white"
                stroke={stats?.isPositive ? '#22C55E' : '#EF4444'}
                strokeWidth={2}
              />
            </>
          )}

          {/* Y-axis labels */}
          {chartData.yLabels.map((label, i) => (
            <text
              key={i}
              x={padding.left - 10}
              y={label.y}
              textAnchor="end"
              alignmentBaseline="middle"
              className="fill-gray-500 text-xs"
            >
              {label.value}
            </text>
          ))}

          {/* X-axis labels */}
          {chartData.xLabels.map((label, i) => (
            <text
              key={i}
              x={label.x}
              y={padding.top + chartHeight + 20}
              textAnchor="middle"
              className="fill-gray-500 text-xs"
            >
              {label.label}
            </text>
          ))}

          {/* Drawdown chart */}
          {showDrawdown && (
            <g transform={`translate(0, ${height - 20})`}>
              <text
                x={padding.left - 10}
                y={10}
                textAnchor="end"
                className="fill-gray-400 text-xs"
              >
                DD
              </text>
              {chartData.drawdowns.map((dd, i) => (
                <rect
                  key={i}
                  x={chartData.portfolioPoints[i].x - 1}
                  y={0}
                  width={2}
                  height={chartData.drawdownScale(dd)}
                  fill="#EF4444"
                  opacity={0.5}
                />
              ))}
            </g>
          )}
        </svg>
      </div>

      {/* Stats Summary */}
      {stats && (
        <div className="mt-4 grid grid-cols-2 gap-4 border-t border-gray-100 pt-4 sm:grid-cols-4">
          <div>
            <div className="text-xs text-gray-500">High</div>
            <div className="font-medium">{formatCurrency(stats.maxValue)}</div>
          </div>
          <div>
            <div className="text-xs text-gray-500">Low</div>
            <div className="font-medium">{formatCurrency(stats.minValue)}</div>
          </div>
          <div>
            <div className="text-xs text-gray-500">Max Drawdown</div>
            <div className="font-medium text-red-600">-{stats.maxDrawdown.toFixed(2)}%</div>
          </div>
          <div>
            <div className="text-xs text-gray-500">Period</div>
            <div className="font-medium">{timeframe}</div>
          </div>
        </div>
      )}
    </div>
  );
}

export default PerformanceChart;
