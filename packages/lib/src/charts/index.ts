/**
 * Charts Layer
 * 
 * Unified charting interface wrapping Recharts and Nivo.
 * 
 * Reference: /vendor/charts/
 */

// ============================================================
// Types
// ============================================================

export interface ChartData {
  name: string;
  value: number;
  [key: string]: unknown;
}

export interface TimeSeriesData {
  timestamp: number;
  value: number;
  [key: string]: unknown;
}

export interface ChartConfig {
  width?: number;
  height?: number;
  margin?: { top: number; right: number; bottom: number; left: number };
  colors?: string[];
}

// ============================================================
// Chart Utilities
// ============================================================

export const DEFAULT_COLORS = [
  '#8884d8', '#82ca9d', '#ffc658', '#ff7300', '#00C49F',
  '#FFBB28', '#FF8042', '#0088FE', '#00C49F', '#FFBB28',
];

export function formatCurrency(value: number, currency = 'USD'): string {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency,
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(value);
}

export function formatPercentage(value: number): string {
  return `${value >= 0 ? '+' : ''}${value.toFixed(2)}%`;
}

export function formatCompactNumber(value: number): string {
  return new Intl.NumberFormat('en-US', {
    notation: 'compact',
    maximumFractionDigits: 1,
  }).format(value);
}

// ============================================================
// Time Utilities
// ============================================================

export type TimeFrame = '1H' | '1D' | '1W' | '1M' | '3M' | '1Y' | 'ALL';

export function getTimeFrameMs(timeFrame: TimeFrame): number {
  const hour = 60 * 60 * 1000;
  const day = 24 * hour;
  
  switch (timeFrame) {
    case '1H': return hour;
    case '1D': return day;
    case '1W': return 7 * day;
    case '1M': return 30 * day;
    case '3M': return 90 * day;
    case '1Y': return 365 * day;
    case 'ALL': return Infinity;
  }
}
