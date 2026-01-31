/**
 * Revenue Analytics Component
 * 
 * Enterprise-grade revenue analytics with real-time data
 * Supports multiple visualization types, export, and forecasting
 * 
 * @author Nich (@nichxbt)
 * @license Apache-2.0
 */

'use client';

import React, { useState, useMemo, useEffect, useCallback } from 'react';
import { 
  TrendingUp, 
  TrendingDown, 
  Download, 
  BarChart3,
  LineChart,
  RefreshCw,
  Loader2,
  AlertCircle
} from 'lucide-react';
import type { RevenueData } from '@/lib/payments/types';

// ============================================
// Types
// ============================================

interface RevenueAnalyticsProps {
  dateRange: '7d' | '30d' | '90d' | '1y';
  compact?: boolean;
  onDataLoad?: (data: RevenueData[]) => void;
  refreshInterval?: number; // Auto-refresh interval in ms
}

type ChartType = 'line' | 'bar' | 'area';

interface ServiceRevenue {
  name: string;
  revenue: string;
  percentage: number;
  transactionCount: number;
}

interface TierRevenue {
  name: string;
  revenue: string;
  percentage: number;
  color: string;
  subscriberCount: number;
}

interface GrowthMetrics {
  newSubscriptions: number;
  churnedSubscriptions: number;
  netGrowth: number;
  churnRate: number;
  expansionRevenue: string;
  contractionRevenue: string;
}

interface AnalyticsSummary {
  totalRevenue: string;
  totalPayments: number;
  mrr: string;
  arr: string;
  growth: string;
  avgDailyRevenue: string;
  avgTransactionValue: string;
  projectedRevenue: string;
}

// ============================================
// API Service
// ============================================

class RevenueAnalyticsService {
  private baseUrl: string;

  constructor(baseUrl: string = '/api/analytics') {
    this.baseUrl = baseUrl;
  }

  async fetchRevenueData(dateRange: string): Promise<RevenueData[]> {
    const response = await fetch(`${this.baseUrl}/revenue?range=${dateRange}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
      credentials: 'include',
    });

    if (!response.ok) {
      throw new Error(`Failed to fetch revenue data: ${response.statusText}`);
    }

    const result = await response.json();
    return result.data;
  }

  async fetchServiceRevenue(dateRange: string): Promise<ServiceRevenue[]> {
    const response = await fetch(`${this.baseUrl}/revenue/by-service?range=${dateRange}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
      credentials: 'include',
    });

    if (!response.ok) {
      throw new Error(`Failed to fetch service revenue: ${response.statusText}`);
    }

    const result = await response.json();
    return result.data;
  }

  async fetchTierRevenue(dateRange: string): Promise<TierRevenue[]> {
    const response = await fetch(`${this.baseUrl}/revenue/by-tier?range=${dateRange}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
      credentials: 'include',
    });

    if (!response.ok) {
      throw new Error(`Failed to fetch tier revenue: ${response.statusText}`);
    }

    const result = await response.json();
    return result.data;
  }

  async fetchGrowthMetrics(dateRange: string): Promise<GrowthMetrics> {
    const response = await fetch(`${this.baseUrl}/growth?range=${dateRange}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
      credentials: 'include',
    });

    if (!response.ok) {
      throw new Error(`Failed to fetch growth metrics: ${response.statusText}`);
    }

    const result = await response.json();
    return result.data;
  }

  async exportRevenueReport(dateRange: string, format: 'csv' | 'json' | 'pdf'): Promise<Blob> {
    const response = await fetch(`${this.baseUrl}/revenue/export?range=${dateRange}&format=${format}`, {
      method: 'GET',
      credentials: 'include',
    });

    if (!response.ok) {
      throw new Error(`Failed to export revenue report: ${response.statusText}`);
    }

    return response.blob();
  }
}

const analyticsService = new RevenueAnalyticsService();

// ============================================
// Utility Functions
// ============================================

function calculateSummary(data: RevenueData[]): AnalyticsSummary {
  if (data.length === 0) {
    return {
      totalRevenue: '0.00',
      totalPayments: 0,
      mrr: '0.00',
      arr: '0.00',
      growth: '0.0',
      avgDailyRevenue: '0.00',
      avgTransactionValue: '0.00',
      projectedRevenue: '0.00',
    };
  }

  const totalRevenue = data.reduce((sum, d) => sum + parseFloat(d.revenue), 0);
  const totalPayments = data.reduce((sum, d) => sum + d.payments, 0);
  const latestMrr = parseFloat(data[data.length - 1]?.mrr || '0');
  const latestArr = parseFloat(data[data.length - 1]?.arr || '0');
  
  // Calculate period-over-period growth
  const midpoint = Math.floor(data.length / 2);
  const firstHalf = data.slice(0, midpoint);
  const secondHalf = data.slice(midpoint);
  
  const firstHalfRevenue = firstHalf.reduce((sum, d) => sum + parseFloat(d.revenue), 0);
  const secondHalfRevenue = secondHalf.reduce((sum, d) => sum + parseFloat(d.revenue), 0);
  const growth = firstHalfRevenue > 0 
    ? ((secondHalfRevenue - firstHalfRevenue) / firstHalfRevenue) * 100 
    : 0;

  // Calculate projection based on trend
  const avgDailyRevenue = totalRevenue / data.length;
  const avgTransactionValue = totalPayments > 0 ? totalRevenue / totalPayments : 0;
  const projectedRevenue = avgDailyRevenue * 30; // 30-day projection

  return {
    totalRevenue: totalRevenue.toFixed(2),
    totalPayments,
    mrr: latestMrr.toFixed(2),
    arr: latestArr.toFixed(2),
    growth: growth.toFixed(1),
    avgDailyRevenue: avgDailyRevenue.toFixed(2),
    avgTransactionValue: avgTransactionValue.toFixed(2),
    projectedRevenue: projectedRevenue.toFixed(2),
  };
}

// ============================================
// Component
// ============================================

export function RevenueAnalytics({ 
  dateRange, 
  compact = false,
  onDataLoad,
  refreshInterval 
}: RevenueAnalyticsProps) {
  const [chartType, setChartType] = useState<ChartType>('area');
  const [showProjection, setShowProjection] = useState(false);
  const [data, setData] = useState<RevenueData[]>([]);
  const [serviceRevenue, setServiceRevenue] = useState<ServiceRevenue[]>([]);
  const [tierRevenue, setTierRevenue] = useState<TierRevenue[]>([]);
  const [growthMetrics, setGrowthMetrics] = useState<GrowthMetrics | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [lastUpdated, setLastUpdated] = useState<Date | null>(null);

  // Fetch all analytics data
  const fetchData = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      const [revenueData, services, tiers, growth] = await Promise.all([
        analyticsService.fetchRevenueData(dateRange),
        analyticsService.fetchServiceRevenue(dateRange),
        analyticsService.fetchTierRevenue(dateRange),
        analyticsService.fetchGrowthMetrics(dateRange),
      ]);

      setData(revenueData);
      setServiceRevenue(services);
      setTierRevenue(tiers);
      setGrowthMetrics(growth);
      setLastUpdated(new Date());

      if (onDataLoad) {
        onDataLoad(revenueData);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load analytics data');
    } finally {
      setLoading(false);
    }
  }, [dateRange, onDataLoad]);

  // Initial fetch and refresh interval
  useEffect(() => {
    fetchData();

    if (refreshInterval && refreshInterval > 0) {
      const interval = setInterval(fetchData, refreshInterval);
      return () => clearInterval(interval);
    }
  }, [fetchData, refreshInterval]);

  // Calculate summary from fetched data
  const summary = useMemo(() => calculateSummary(data), [data]);

  // Calculate max value for chart scaling
  const maxRevenue = Math.max(...data.map(d => parseFloat(d.revenue)));

  // Export data
  const exportData = () => {
    const csv = [
      ['Date', 'Revenue', 'Payments', 'Subscriptions', 'MRR', 'ARR'].join(','),
      ...data.map(d => [
        d.period,
        d.revenue,
        d.payments,
        d.subscriptions,
        d.mrr,
        d.arr,
      ].join(',')),
    ].join('\n');

    const blob = new Blob([csv], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `revenue-analytics-${dateRange}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  };

  // Compact view
  if (compact) {
    return (
      <div className="bg-gray-900 rounded-xl border border-gray-800 p-6">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-lg font-semibold text-white">Revenue Overview</h3>
          <div className="flex items-center gap-2 text-sm">
            <span className={`flex items-center gap-1 ${parseFloat(summary.growth) >= 0 ? 'text-green-400' : 'text-red-400'}`}>
              {parseFloat(summary.growth) >= 0 ? <TrendingUp className="w-4 h-4" /> : <TrendingDown className="w-4 h-4" />}
              {Math.abs(parseFloat(summary.growth))}%
            </span>
          </div>
        </div>

        {/* Simple Chart */}
        <div className="h-40 flex items-end gap-1">
          {data.slice(-14).map((d, i) => (
            <div key={i} className="flex-1 flex flex-col items-center gap-1">
              <div 
                className="w-full bg-gradient-to-t from-blue-600 to-blue-400 rounded-t transition-all hover:from-blue-500 hover:to-blue-300"
                style={{ height: `${(parseFloat(d.revenue) / maxRevenue) * 100}%` }}
                title={`${d.period}: $${d.revenue}`}
              />
            </div>
          ))}
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-2 gap-4 mt-6 pt-6 border-t border-gray-800">
          <div>
            <div className="text-gray-400 text-sm">Total Revenue</div>
            <div className="text-xl font-bold text-white">${summary.totalRevenue}</div>
          </div>
          <div>
            <div className="text-gray-400 text-sm">MRR</div>
            <div className="text-xl font-bold text-white">${summary.mrr}</div>
          </div>
        </div>
      </div>
    );
  }

  // Full view
  return (
    <div className="space-y-6">
      {/* Summary Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-gray-900 rounded-xl border border-gray-800 p-4">
          <div className="text-gray-400 text-sm mb-1">Total Revenue</div>
          <div className="text-2xl font-bold text-white">${summary.totalRevenue}</div>
          <div className="text-sm text-gray-500">Last {dateRange}</div>
        </div>
        <div className="bg-gray-900 rounded-xl border border-gray-800 p-4">
          <div className="text-gray-400 text-sm mb-1">MRR</div>
          <div className="text-2xl font-bold text-white">${summary.mrr}</div>
          <div className="text-sm text-gray-500">Monthly recurring</div>
        </div>
        <div className="bg-gray-900 rounded-xl border border-gray-800 p-4">
          <div className="text-gray-400 text-sm mb-1">ARR</div>
          <div className="text-2xl font-bold text-white">${summary.arr}</div>
          <div className="text-sm text-gray-500">Annual recurring</div>
        </div>
        <div className="bg-gray-900 rounded-xl border border-gray-800 p-4">
          <div className="text-gray-400 text-sm mb-1">Avg. Daily Revenue</div>
          <div className="text-2xl font-bold text-white">${summary.avgDailyRevenue}</div>
          <div className={`text-sm flex items-center gap-1 ${parseFloat(summary.growth) >= 0 ? 'text-green-400' : 'text-red-400'}`}>
            {parseFloat(summary.growth) >= 0 ? <TrendingUp className="w-3 h-3" /> : <TrendingDown className="w-3 h-3" />}
            {Math.abs(parseFloat(summary.growth))}% growth
          </div>
        </div>
      </div>

      {/* Main Chart */}
      <div className="bg-gray-900 rounded-xl border border-gray-800 p-6">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-lg font-semibold text-white">Revenue Trend</h3>
          <div className="flex items-center gap-2">
            {/* Chart Type Selector */}
            <div className="flex bg-gray-800 rounded-lg p-1">
              {[
                { type: 'area' as ChartType, icon: LineChart },
                { type: 'bar' as ChartType, icon: BarChart3 },
              ].map(({ type, icon: Icon }) => (
                <button
                  key={type}
                  onClick={() => setChartType(type)}
                  className={`p-2 rounded transition-colors ${
                    chartType === type ? 'bg-gray-700 text-white' : 'text-gray-400 hover:text-white'
                  }`}
                >
                  <Icon className="w-4 h-4" />
                </button>
              ))}
            </div>
            
            <button
              onClick={() => setShowProjection(!showProjection)}
              className={`px-3 py-2 text-sm rounded-lg transition-colors ${
                showProjection ? 'bg-blue-500/20 text-blue-400' : 'bg-gray-800 text-gray-400 hover:text-white'
              }`}
            >
              Projection
            </button>

            <button
              onClick={exportData}
              className="p-2 bg-gray-800 text-gray-400 hover:text-white rounded-lg transition-colors"
              title="Export CSV"
            >
              <Download className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Chart */}
        <div className="h-64 flex items-end gap-1">
          {data.map((d, i) => {
            const height = (parseFloat(d.revenue) / maxRevenue) * 100;
            const isProjected = showProjection && i >= data.length - 7;
            
            return (
              <div 
                key={i} 
                className="flex-1 group relative"
              >
                {chartType === 'bar' ? (
                  <div 
                    className={`w-full rounded-t transition-all ${
                      isProjected 
                        ? 'bg-blue-500/30 border-2 border-dashed border-blue-500' 
                        : 'bg-gradient-to-t from-blue-600 to-blue-400'
                    }`}
                    style={{ height: `${height}%` }}
                  />
                ) : (
                  <div 
                    className={`w-full transition-all ${
                      isProjected 
                        ? 'bg-blue-500/20' 
                        : 'bg-gradient-to-t from-blue-600/50 to-blue-400/20'
                    }`}
                    style={{ height: `${height}%` }}
                  />
                )}
                
                {/* Tooltip */}
                <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 hidden group-hover:block z-10">
                  <div className="bg-gray-800 text-white text-xs rounded px-2 py-1 whitespace-nowrap">
                    <div className="font-medium">{d.period}</div>
                    <div>Revenue: ${d.revenue}</div>
                    <div>Payments: {d.payments}</div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* X-axis labels */}
        <div className="flex justify-between mt-2 text-xs text-gray-500">
          <span>{data[0]?.period}</span>
          <span>{data[Math.floor(data.length / 2)]?.period}</span>
          <span>{data[data.length - 1]?.period}</span>
        </div>
      </div>

      {/* Revenue by Service */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-gray-900 rounded-xl border border-gray-800 p-6">
          <h3 className="text-lg font-semibold text-white mb-6">Revenue by Service</h3>
          {serviceRevenue.length === 0 ? (
            <div className="text-center py-8 text-gray-400">
              No service revenue data available
            </div>
          ) : (
            <div className="space-y-4">
              {serviceRevenue.map((service) => (
                <div key={service.name}>
                  <div className="flex justify-between text-sm mb-1">
                    <span className="text-gray-300">{service.name}</span>
                    <span className="text-white font-medium">${service.revenue}</span>
                  </div>
                  <div className="h-2 bg-gray-800 rounded-full overflow-hidden">
                    <div 
                      className="h-full bg-gradient-to-r from-blue-500 to-purple-500 rounded-full"
                      style={{ width: `${service.percentage}%` }}
                    />
                  </div>
                  <div className="text-xs text-gray-500 mt-1">
                    {service.transactionCount} transactions
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="bg-gray-900 rounded-xl border border-gray-800 p-6">
          <h3 className="text-lg font-semibold text-white mb-6">Revenue by Tier</h3>
          {tierRevenue.length === 0 ? (
            <div className="text-center py-8 text-gray-400">
              No tier revenue data available
            </div>
          ) : (
            <div className="space-y-4">
              {tierRevenue.map((tier) => (
                <div key={tier.name}>
                  <div className="flex justify-between text-sm mb-1">
                    <span className="text-gray-300">{tier.name}</span>
                    <span className="text-white font-medium">${tier.revenue}</span>
                  </div>
                  <div className="h-2 bg-gray-800 rounded-full overflow-hidden">
                    <div 
                      className="h-full rounded-full"
                      style={{ width: `${tier.percentage}%`, backgroundColor: tier.color }}
                    />
                  </div>
                  <div className="text-xs text-gray-500 mt-1">
                    {tier.subscriberCount} subscribers
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Growth Metrics */}
      <div className="bg-gray-900 rounded-xl border border-gray-800 p-6">
        <h3 className="text-lg font-semibold text-white mb-6">Growth Metrics</h3>
        {growthMetrics ? (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            <div>
              <div className="text-gray-400 text-sm mb-1">New Subscriptions</div>
              <div className="text-2xl font-bold text-green-400">+{growthMetrics.newSubscriptions}</div>
            </div>
            <div>
              <div className="text-gray-400 text-sm mb-1">Churned</div>
              <div className="text-2xl font-bold text-red-400">-{growthMetrics.churnedSubscriptions}</div>
            </div>
            <div>
              <div className="text-gray-400 text-sm mb-1">Net Growth</div>
              <div className="text-2xl font-bold text-blue-400">
                {growthMetrics.netGrowth >= 0 ? '+' : ''}{growthMetrics.netGrowth}
              </div>
            </div>
            <div>
              <div className="text-gray-400 text-sm mb-1">Churn Rate</div>
              <div className="text-2xl font-bold text-white">{growthMetrics.churnRate.toFixed(1)}%</div>
            </div>
          </div>
        ) : (
          <div className="text-center py-8 text-gray-400">
            Loading growth metrics...
          </div>
        )}

        {/* Expansion/Contraction Revenue */}
        {growthMetrics && (
          <div className="grid grid-cols-2 gap-6 mt-6 pt-6 border-t border-gray-800">
            <div>
              <div className="text-gray-400 text-sm mb-1">Expansion Revenue</div>
              <div className="text-xl font-bold text-green-400">+${growthMetrics.expansionRevenue}</div>
              <div className="text-xs text-gray-500">From upgrades and add-ons</div>
            </div>
            <div>
              <div className="text-gray-400 text-sm mb-1">Contraction Revenue</div>
              <div className="text-xl font-bold text-red-400">-${growthMetrics.contractionRevenue}</div>
              <div className="text-xs text-gray-500">From downgrades</div>
            </div>
          </div>
        )}
      </div>

      {/* Last Updated */}
      {lastUpdated && (
        <div className="text-center text-xs text-gray-500">
          Last updated: {lastUpdated.toLocaleString()}
        </div>
      )}
    </div>
  );
}

export default RevenueAnalytics;
