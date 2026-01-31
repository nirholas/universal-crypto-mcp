'use client';

import * as React from 'react';
import { cn } from '@/lib/utils/cn';
import type { PlatformStats, ServiceCategory } from '@/lib/marketplace/types';

interface PlatformAnalyticsProps {
  stats: PlatformStats;
  period?: '7d' | '30d' | '90d' | '1y';
  onPeriodChange?: (period: '7d' | '30d' | '90d' | '1y') => void;
}

export function PlatformAnalytics({ stats, period = '30d', onPeriodChange }: PlatformAnalyticsProps) {
  const [activeMetric, setActiveMetric] = React.useState<'gmv' | 'transactions' | 'users'>('gmv');

  // Category breakdown with mock growth data
  const categoryData: { category: ServiceCategory; services: number; revenue: number; growth: number }[] = [
    { category: 'ai-models', services: 45, revenue: 125000, growth: 34 },
    { category: 'trading', services: 32, revenue: 98000, growth: 28 },
    { category: 'market-data', services: 28, revenue: 76000, growth: 22 },
    { category: 'analytics', services: 25, revenue: 65000, growth: 18 },
    { category: 'smart-contracts', services: 18, revenue: 42000, growth: 15 },
  ];

  return (
    <div className="space-y-6">
      {/* Period Selector */}
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold text-gray-900">Platform Analytics</h3>
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

      {/* Top Stats */}
      <div className="grid gap-4 md:grid-cols-4">
        <div className="rounded-2xl bg-gradient-to-br from-green-500 to-green-600 p-6 text-white">
          <p className="text-sm opacity-80">Total GMV</p>
          <p className="mt-1 text-3xl font-bold">
            ${(stats.totalVolume / 1000000).toFixed(2)}M
          </p>
          <div className="mt-2 flex items-center gap-1 text-sm">
            <span className="font-medium">↑ 42%</span>
            <span className="opacity-80">this period</span>
          </div>
        </div>
        <div className="rounded-2xl bg-gradient-to-br from-blue-500 to-blue-600 p-6 text-white">
          <p className="text-sm opacity-80">Active Services</p>
          <p className="mt-1 text-3xl font-bold">{stats.totalServices.toLocaleString()}</p>
          <div className="mt-2 flex items-center gap-1 text-sm">
            <span className="font-medium">+48</span>
            <span className="opacity-80">new this month</span>
          </div>
        </div>
        <div className="rounded-2xl bg-gradient-to-br from-purple-500 to-purple-600 p-6 text-white">
          <p className="text-sm opacity-80">Active Providers</p>
          <p className="mt-1 text-3xl font-bold">{stats.totalProviders.toLocaleString()}</p>
          <div className="mt-2 flex items-center gap-1 text-sm">
            <span className="font-medium">+12</span>
            <span className="opacity-80">new this month</span>
          </div>
        </div>
        <div className="rounded-2xl bg-gradient-to-br from-orange-500 to-orange-600 p-6 text-white">
          <p className="text-sm opacity-80">Total Users</p>
          <p className="mt-1 text-3xl font-bold">{(stats.totalUsers / 1000).toFixed(1)}K</p>
          <div className="mt-2 flex items-center gap-1 text-sm">
            <span className="font-medium">↑ 28%</span>
            <span className="opacity-80">this period</span>
          </div>
        </div>
      </div>

      {/* Chart Area */}
      <div className="rounded-2xl border-2 border-gray-200 bg-white p-6">
        <div className="mb-4 flex items-center gap-2">
          {(['gmv', 'transactions', 'users'] as const).map((metric) => (
            <button
              key={metric}
              type="button"
              onClick={() => setActiveMetric(metric)}
              className={cn(
                'rounded-lg px-3 py-1.5 text-sm font-medium uppercase transition-colors',
                activeMetric === metric
                  ? 'bg-black text-white'
                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              )}
            >
              {metric}
            </button>
          ))}
        </div>

        {/* Simple Area Chart Representation */}
        <div className="relative h-64">
          <div className="absolute inset-0 flex items-end">
            {Array.from({ length: 24 }).map((_, i) => {
              const baseHeight = 40 + Math.sin(i / 3) * 20 + (i / 24) * 30;
              const height = Math.max(20, Math.min(90, baseHeight + Math.random() * 10));
              return (
                <div
                  key={i}
                  className={cn(
                    'flex-1 transition-all',
                    activeMetric === 'gmv' && 'bg-green-500/20',
                    activeMetric === 'transactions' && 'bg-blue-500/20',
                    activeMetric === 'users' && 'bg-purple-500/20'
                  )}
                  style={{ height: `${height}%` }}
                />
              );
            })}
          </div>
          {/* Grid lines */}
          <div className="absolute inset-0 flex flex-col justify-between">
            {[100, 75, 50, 25, 0].map((val) => (
              <div key={val} className="flex items-center gap-2">
                <span className="text-xs text-gray-400">{val}%</span>
                <div className="h-px flex-1 bg-gray-100" />
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Category Breakdown */}
      <div className="grid gap-6 md:grid-cols-2">
        <div className="rounded-2xl border-2 border-gray-200 bg-white p-6">
          <h3 className="mb-4 font-semibold text-gray-900">Category Performance</h3>
          <div className="space-y-4">
            {categoryData.map((cat) => (
              <div key={cat.category} className="flex items-center gap-4">
                <div className="flex-1">
                  <div className="flex items-center justify-between text-sm">
                    <span className="font-medium capitalize text-gray-900">
                      {cat.category.replace(/-/g, ' ')}
                    </span>
                    <span className="text-gray-500">{cat.services} services</span>
                  </div>
                  <div className="mt-1 flex items-center gap-2">
                    <div className="h-2 flex-1 overflow-hidden rounded-full bg-gray-200">
                      <div
                        className="h-full rounded-full bg-blue-500"
                        style={{ width: `${(cat.revenue / 150000) * 100}%` }}
                      />
                    </div>
                    <span className="text-sm font-medium text-green-600">+{cat.growth}%</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="rounded-2xl border-2 border-gray-200 bg-white p-6">
          <h3 className="mb-4 font-semibold text-gray-900">Top Performing Services</h3>
          <div className="space-y-3">
            {[
              { name: 'GPT-4 API Gateway', revenue: 45000, subscribers: 1250 },
              { name: 'Crypto Oracle Feed', revenue: 38000, subscribers: 890 },
              { name: 'DeFi Analytics Pro', revenue: 32000, subscribers: 720 },
              { name: 'Trading Signals AI', revenue: 28000, subscribers: 650 },
              { name: 'NFT Valuation API', revenue: 22000, subscribers: 480 },
            ].map((service, index) => (
              <div key={service.name} className="flex items-center gap-3">
                <span className="flex h-6 w-6 items-center justify-center rounded-full bg-gray-100 text-xs font-medium">
                  {index + 1}
                </span>
                <div className="flex-1">
                  <p className="text-sm font-medium text-gray-900">{service.name}</p>
                  <p className="text-xs text-gray-500">{service.subscribers} subscribers</p>
                </div>
                <span className="font-medium text-gray-900">
                  ${(service.revenue / 1000).toFixed(1)}K
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Health Metrics */}
      <div className="rounded-2xl border-2 border-gray-200 bg-white p-6">
        <h3 className="mb-4 font-semibold text-gray-900">Platform Health</h3>
        <div className="grid gap-6 md:grid-cols-4">
          <div className="text-center">
            <div className="relative mx-auto h-24 w-24">
              <svg className="h-24 w-24 -rotate-90" viewBox="0 0 36 36">
                <path
                  d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                  fill="none"
                  stroke="#E5E7EB"
                  strokeWidth="3"
                />
                <path
                  d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                  fill="none"
                  stroke="#10B981"
                  strokeWidth="3"
                  strokeDasharray={`${stats.averageUptime}, 100`}
                />
              </svg>
              <div className="absolute inset-0 flex items-center justify-center">
                <span className="text-lg font-bold text-gray-900">{stats.averageUptime}%</span>
              </div>
            </div>
            <p className="mt-2 text-sm text-gray-500">Avg Uptime</p>
          </div>
          <div className="text-center">
            <div className="relative mx-auto h-24 w-24">
              <svg className="h-24 w-24 -rotate-90" viewBox="0 0 36 36">
                <path
                  d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                  fill="none"
                  stroke="#E5E7EB"
                  strokeWidth="3"
                />
                <path
                  d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                  fill="none"
                  stroke="#3B82F6"
                  strokeWidth="3"
                  strokeDasharray={`${stats.disputeResolutionRate}, 100`}
                />
              </svg>
              <div className="absolute inset-0 flex items-center justify-center">
                <span className="text-lg font-bold text-gray-900">{stats.disputeResolutionRate}%</span>
              </div>
            </div>
            <p className="mt-2 text-sm text-gray-500">Dispute Resolution</p>
          </div>
          <div className="text-center">
            <div className="relative mx-auto h-24 w-24">
              <svg className="h-24 w-24 -rotate-90" viewBox="0 0 36 36">
                <path
                  d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                  fill="none"
                  stroke="#E5E7EB"
                  strokeWidth="3"
                />
                <path
                  d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                  fill="none"
                  stroke="#8B5CF6"
                  strokeWidth="3"
                  strokeDasharray="94, 100"
                />
              </svg>
              <div className="absolute inset-0 flex items-center justify-center">
                <span className="text-lg font-bold text-gray-900">94%</span>
              </div>
            </div>
            <p className="mt-2 text-sm text-gray-500">Success Rate</p>
          </div>
          <div className="text-center">
            <div className="relative mx-auto h-24 w-24">
              <svg className="h-24 w-24 -rotate-90" viewBox="0 0 36 36">
                <path
                  d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                  fill="none"
                  stroke="#E5E7EB"
                  strokeWidth="3"
                />
                <path
                  d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                  fill="none"
                  stroke="#F59E0B"
                  strokeWidth="3"
                  strokeDasharray={`${(stats.averageRating / 5) * 100}, 100`}
                />
              </svg>
              <div className="absolute inset-0 flex items-center justify-center">
                <span className="text-lg font-bold text-gray-900">{stats.averageRating}</span>
              </div>
            </div>
            <p className="mt-2 text-sm text-gray-500">Avg Rating</p>
          </div>
        </div>
      </div>
    </div>
  );
}
