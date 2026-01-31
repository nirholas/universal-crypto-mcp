'use client';

import * as React from 'react';
import { cn } from '@/lib/utils/cn';
import type { ProviderStats } from '@/lib/marketplace/types';

interface ProviderAnalyticsProps {
  stats: ProviderStats;
  period?: '7d' | '30d' | '90d' | '1y';
  onPeriodChange?: (period: '7d' | '30d' | '90d' | '1y') => void;
}

export function ProviderAnalytics({ stats, period = '30d', onPeriodChange }: ProviderAnalyticsProps) {
  const [activeChart, setActiveChart] = React.useState<'revenue' | 'calls' | 'subscribers'>('revenue');

  // Mock chart data based on period
  const chartData = React.useMemo(() => {
    const points = period === '7d' ? 7 : period === '30d' ? 30 : period === '90d' ? 90 : 365;
    const data = [];
    for (let i = points; i >= 0; i--) {
      const date = new Date();
      date.setDate(date.getDate() - i);
      data.push({
        date: date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
        revenue: Math.random() * 500 + 200,
        calls: Math.floor(Math.random() * 10000 + 5000),
        subscribers: Math.floor(Math.random() * 20 + 40),
      });
    }
    return data;
  }, [period]);

  // Calculate growth
  const growth = {
    revenue: 23.5,
    subscribers: 12.3,
    apiCalls: 45.2,
    avgRating: 0.2,
  };

  return (
    <div className="space-y-6">
      {/* Period Selector */}
      <div className="flex items-center justify-between">
        <h3 className="font-semibold text-gray-900">Analytics Overview</h3>
        <div className="flex gap-1 rounded-lg bg-gray-100 p-1">
          {(['7d', '30d', '90d', '1y'] as const).map((p) => (
            <button
              key={p}
              type="button"
              onClick={() => onPeriodChange?.(p)}
              className={cn(
                'rounded-md px-3 py-1 text-sm font-medium transition-colors',
                period === p ? 'bg-white text-black shadow-sm' : 'text-gray-600 hover:text-black'
              )}
            >
              {p}
            </button>
          ))}
        </div>
      </div>

      {/* Key Metrics */}
      <div className="grid gap-4 md:grid-cols-4">
        <div className="rounded-2xl border-2 border-gray-200 bg-white p-6">
          <p className="text-sm text-gray-500">Total Revenue</p>
          <p className="mt-1 text-3xl font-bold text-gray-900">
            ${stats.totalRevenue.toLocaleString()}
          </p>
          <div className="mt-2 flex items-center gap-1 text-sm">
            <span className="text-green-600">↑ {growth.revenue}%</span>
            <span className="text-gray-400">vs last period</span>
          </div>
        </div>
        <div className="rounded-2xl border-2 border-gray-200 bg-white p-6">
          <p className="text-sm text-gray-500">Active Subscribers</p>
          <p className="mt-1 text-3xl font-bold text-gray-900">
            {stats.totalSubscribers.toLocaleString()}
          </p>
          <div className="mt-2 flex items-center gap-1 text-sm">
            <span className="text-green-600">↑ {growth.subscribers}%</span>
            <span className="text-gray-400">vs last period</span>
          </div>
        </div>
        <div className="rounded-2xl border-2 border-gray-200 bg-white p-6">
          <p className="text-sm text-gray-500">API Calls</p>
          <p className="mt-1 text-3xl font-bold text-gray-900">
            {(stats.totalApiCalls / 1000000).toFixed(2)}M
          </p>
          <div className="mt-2 flex items-center gap-1 text-sm">
            <span className="text-green-600">↑ {growth.apiCalls}%</span>
            <span className="text-gray-400">vs last period</span>
          </div>
        </div>
        <div className="rounded-2xl border-2 border-gray-200 bg-white p-6">
          <p className="text-sm text-gray-500">Average Rating</p>
          <p className="mt-1 text-3xl font-bold text-gray-900">
            {stats.averageRating.toFixed(1)} ★
          </p>
          <div className="mt-2 flex items-center gap-1 text-sm">
            <span className="text-green-600">↑ {growth.avgRating}</span>
            <span className="text-gray-400">vs last period</span>
          </div>
        </div>
      </div>

      {/* Chart */}
      <div className="rounded-2xl border-2 border-gray-200 bg-white p-6">
        <div className="mb-4 flex items-center justify-between">
          <div className="flex gap-2">
            {(['revenue', 'calls', 'subscribers'] as const).map((chart) => (
              <button
                key={chart}
                type="button"
                onClick={() => setActiveChart(chart)}
                className={cn(
                  'rounded-lg px-3 py-1.5 text-sm font-medium capitalize transition-colors',
                  activeChart === chart
                    ? 'bg-black text-white'
                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                )}
              >
                {chart === 'calls' ? 'API Calls' : chart}
              </button>
            ))}
          </div>
        </div>

        {/* Simple Bar Chart */}
        <div className="h-64">
          <div className="flex h-full items-end gap-1">
            {chartData.slice(-30).map((point, index) => {
              const maxValue = Math.max(...chartData.map((d) => d[activeChart] as number));
              const height = ((point[activeChart] as number) / maxValue) * 100;
              return (
                <div
                  key={index}
                  className="group relative flex-1"
                  title={`${point.date}: ${point[activeChart]}`}
                >
                  <div
                    className={cn(
                      'w-full rounded-t transition-all',
                      activeChart === 'revenue' && 'bg-green-500 hover:bg-green-600',
                      activeChart === 'calls' && 'bg-blue-500 hover:bg-blue-600',
                      activeChart === 'subscribers' && 'bg-purple-500 hover:bg-purple-600'
                    )}
                    style={{ height: `${height}%` }}
                  />
                  <div className="absolute bottom-full left-1/2 mb-2 hidden -translate-x-1/2 rounded bg-gray-900 px-2 py-1 text-xs text-white group-hover:block">
                    {activeChart === 'revenue' && `$${(point.revenue as number).toFixed(0)}`}
                    {activeChart === 'calls' && `${(point.calls as number).toLocaleString()}`}
                    {activeChart === 'subscribers' && `${point.subscribers}`}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Service Performance */}
      <div className="rounded-2xl border-2 border-gray-200 bg-white p-6">
        <h3 className="mb-4 font-semibold text-gray-900">Service Performance</h3>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-200 text-left text-sm text-gray-500">
                <th className="pb-3">Service</th>
                <th className="pb-3">Revenue</th>
                <th className="pb-3">Subscribers</th>
                <th className="pb-3">API Calls</th>
                <th className="pb-3">Uptime</th>
                <th className="pb-3">Trend</th>
              </tr>
            </thead>
            <tbody className="text-sm">
              {stats.services.map((service) => (
                <tr key={service.id} className="border-b border-gray-100">
                  <td className="py-3">
                    <div className="flex items-center gap-2">
                      <span
                        className={cn(
                          'h-2 w-2 rounded-full',
                          service.status === 'active' ? 'bg-green-500' : 'bg-gray-400'
                        )}
                      />
                      <span className="font-medium text-gray-900">{service.name}</span>
                    </div>
                  </td>
                  <td className="py-3 text-gray-900">${service.revenue.toLocaleString()}</td>
                  <td className="py-3 text-gray-900">{service.subscribers}</td>
                  <td className="py-3 text-gray-900">{(service.apiCalls / 1000).toFixed(1)}K</td>
                  <td className="py-3">
                    <span
                      className={cn(
                        'font-medium',
                        service.uptime >= 99.9 ? 'text-green-600' : 'text-yellow-600'
                      )}
                    >
                      {service.uptime.toFixed(2)}%
                    </span>
                  </td>
                  <td className="py-3">
                    <span className="text-green-600">↑ 12%</span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Geographic Distribution */}
      <div className="grid gap-6 md:grid-cols-2">
        <div className="rounded-2xl border-2 border-gray-200 bg-white p-6">
          <h3 className="mb-4 font-semibold text-gray-900">Top Countries</h3>
          <div className="space-y-3">
            {[
              { country: 'United States', percentage: 42, flag: '🇺🇸' },
              { country: 'Germany', percentage: 18, flag: '🇩🇪' },
              { country: 'United Kingdom', percentage: 12, flag: '🇬🇧' },
              { country: 'Japan', percentage: 9, flag: '🇯🇵' },
              { country: 'Other', percentage: 19, flag: '🌍' },
            ].map((item) => (
              <div key={item.country} className="flex items-center gap-3">
                <span className="text-xl">{item.flag}</span>
                <div className="flex-1">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-gray-700">{item.country}</span>
                    <span className="font-medium text-gray-900">{item.percentage}%</span>
                  </div>
                  <div className="mt-1 h-1.5 overflow-hidden rounded-full bg-gray-200">
                    <div
                      className="h-full rounded-full bg-blue-500"
                      style={{ width: `${item.percentage}%` }}
                    />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="rounded-2xl border-2 border-gray-200 bg-white p-6">
          <h3 className="mb-4 font-semibold text-gray-900">Traffic Sources</h3>
          <div className="space-y-3">
            {[
              { source: 'Marketplace Search', percentage: 35, icon: '🔍' },
              { source: 'Direct Link', percentage: 28, icon: '🔗' },
              { source: 'Referral', percentage: 20, icon: '👥' },
              { source: 'API Directory', percentage: 12, icon: '📚' },
              { source: 'Other', percentage: 5, icon: '•' },
            ].map((item) => (
              <div key={item.source} className="flex items-center gap-3">
                <span className="text-xl">{item.icon}</span>
                <div className="flex-1">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-gray-700">{item.source}</span>
                    <span className="font-medium text-gray-900">{item.percentage}%</span>
                  </div>
                  <div className="mt-1 h-1.5 overflow-hidden rounded-full bg-gray-200">
                    <div
                      className="h-full rounded-full bg-purple-500"
                      style={{ width: `${item.percentage}%` }}
                    />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
