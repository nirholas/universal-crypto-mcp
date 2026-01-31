'use client';

import * as React from 'react';
import Link from 'next/link';
import { useProviderStats, useProviderAnalytics } from '@/lib/marketplace/hooks';
import { cn } from '@/lib/utils/cn';

export default function ProviderDashboardPage() {
  const { stats, loading } = useProviderStats();
  const [period, setPeriod] = React.useState<'day' | 'week' | 'month' | 'year'>('week');
  const { analytics } = useProviderAnalytics(period);

  if (loading) {
    return (
      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        <div className="animate-pulse space-y-8">
          <div className="h-8 w-64 rounded bg-gray-200" />
          <div className="grid gap-6 md:grid-cols-4">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="h-32 rounded-2xl bg-gray-200" />
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
      {/* Header */}
      <div className="mb-8 flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Provider Dashboard</h1>
          <p className="mt-1 text-gray-600">Manage your services and track performance</p>
        </div>
        <Link
          href="/marketplace/provider/register"
          className="rounded-xl bg-black px-6 py-3 font-medium text-white transition-colors hover:bg-gray-800"
        >
          + Register New Service
        </Link>
      </div>

      {/* Stats Cards */}
      <div className="mb-8 grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        <StatCard
          title="Total Services"
          value={stats?.totalServices || 0}
          subtitle={`${stats?.activeServices || 0} active`}
          icon="📦"
          trend="+2 this month"
        />
        <StatCard
          title="Active Subscribers"
          value={stats?.totalSubscribers.toLocaleString() || '0'}
          subtitle="Total subscribers"
          icon="👥"
          trend="+12% vs last month"
          trendUp
        />
        <StatCard
          title="API Calls Today"
          value={formatNumber(stats?.totalApiCalls || 0)}
          subtitle="Total requests"
          icon="⚡"
          trend="+8% vs yesterday"
          trendUp
        />
        <StatCard
          title="Revenue This Month"
          value={`$${stats?.revenueThisMonth.toLocaleString() || '0'}`}
          subtitle={`$${stats?.revenueAllTime.toLocaleString() || '0'} all-time`}
          icon="💰"
          trend="+15% vs last month"
          trendUp
        />
      </div>

      {/* Period Selector */}
      <div className="mb-6 flex gap-2">
        {(['day', 'week', 'month', 'year'] as const).map((p) => (
          <button
            key={p}
            type="button"
            onClick={() => setPeriod(p)}
            className={cn(
              'rounded-lg px-4 py-2 text-sm font-medium transition-colors',
              period === p ? 'bg-black text-white' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            )}
          >
            {p.charAt(0).toUpperCase() + p.slice(1)}
          </button>
        ))}
      </div>

      {/* Charts Row */}
      <div className="mb-8 grid gap-6 lg:grid-cols-2">
        {/* Revenue Chart */}
        <div className="rounded-2xl border-2 border-gray-200 bg-white p-6">
          <h3 className="mb-4 font-semibold text-gray-900">Revenue Over Time</h3>
          <div className="h-64">
            <SimpleChart data={analytics?.revenue || []} dataKey="amount" color="#10B981" />
          </div>
        </div>

        {/* API Calls Chart */}
        <div className="rounded-2xl border-2 border-gray-200 bg-white p-6">
          <h3 className="mb-4 font-semibold text-gray-900">API Calls Over Time</h3>
          <div className="h-64">
            <SimpleChart data={analytics?.apiCalls || []} dataKey="count" color="#3B82F6" />
          </div>
        </div>
      </div>

      {/* Quick Actions & Activity */}
      <div className="grid gap-6 lg:grid-cols-3">
        {/* Quick Actions */}
        <div className="rounded-2xl border-2 border-gray-200 bg-white p-6">
          <h3 className="mb-4 font-semibold text-gray-900">Quick Actions</h3>
          <div className="space-y-3">
            <QuickActionButton href="/marketplace/provider/services" icon="📋" label="Manage Services" />
            <QuickActionButton href="/marketplace/provider/analytics" icon="📊" label="View Analytics" />
            <QuickActionButton href="/marketplace/provider/earnings" icon="💵" label="Earnings & Payouts" />
            <QuickActionButton href="/marketplace/provider/api-keys" icon="🔑" label="API Key Management" />
            <QuickActionButton href="/marketplace/provider/settings" icon="⚙️" label="Account Settings" />
          </div>
        </div>

        {/* Top Consumers */}
        <div className="rounded-2xl border-2 border-gray-200 bg-white p-6">
          <h3 className="mb-4 font-semibold text-gray-900">Top Consumers</h3>
          <div className="space-y-4">
            {analytics?.topConsumers.map((consumer, index) => (
              <div key={consumer.wallet} className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <span className="flex h-8 w-8 items-center justify-center rounded-full bg-gray-100 text-sm font-medium">
                    #{index + 1}
                  </span>
                  <div>
                    <p className="font-mono text-sm text-gray-900">{consumer.wallet}</p>
                    <p className="text-xs text-gray-500">{consumer.calls.toLocaleString()} calls</p>
                  </div>
                </div>
                <span className="font-medium text-green-600">${consumer.revenue}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Recent Activity */}
        <div className="rounded-2xl border-2 border-gray-200 bg-white p-6">
          <h3 className="mb-4 font-semibold text-gray-900">Recent Activity</h3>
          <div className="space-y-4">
            <ActivityItem
              icon="✅"
              title="New subscription"
              description="GPT-4 API - Professional plan"
              time="2 minutes ago"
            />
            <ActivityItem
              icon="⭐"
              title="New review"
              description="5-star rating on Crypto Oracle"
              time="1 hour ago"
            />
            <ActivityItem
              icon="💰"
              title="Payment received"
              description="$299.00 from 0x1234...5678"
              time="3 hours ago"
            />
            <ActivityItem
              icon="📈"
              title="Usage milestone"
              description="1M API calls reached"
              time="Yesterday"
            />
          </div>
        </div>
      </div>

      {/* Service Health */}
      <div className="mt-8 rounded-2xl border-2 border-gray-200 bg-white p-6">
        <h3 className="mb-4 font-semibold text-gray-900">Service Health</h3>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-200 text-left text-sm text-gray-500">
                <th className="pb-3 font-medium">Service</th>
                <th className="pb-3 font-medium">Status</th>
                <th className="pb-3 font-medium">Uptime</th>
                <th className="pb-3 font-medium">Avg Response</th>
                <th className="pb-3 font-medium">Calls (24h)</th>
                <th className="pb-3 font-medium">Errors (24h)</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              <ServiceHealthRow
                name="GPT-4 Turbo API"
                status="online"
                uptime={99.95}
                responseTime={245}
                calls={125000}
                errors={12}
              />
              <ServiceHealthRow
                name="Crypto Price Oracle"
                status="online"
                uptime={99.99}
                responseTime={45}
                calls={890000}
                errors={3}
              />
              <ServiceHealthRow
                name="Sentiment Analysis"
                status="degraded"
                uptime={98.5}
                responseTime={320}
                calls={45000}
                errors={156}
              />
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

function StatCard({
  title,
  value,
  subtitle,
  icon,
  trend,
  trendUp,
}: {
  title: string;
  value: string | number;
  subtitle: string;
  icon: string;
  trend?: string;
  trendUp?: boolean;
}) {
  return (
    <div className="rounded-2xl border-2 border-gray-200 bg-white p-6 transition-all hover:border-gray-300 hover:shadow-md">
      <div className="flex items-start justify-between">
        <div>
          <p className="text-sm text-gray-500">{title}</p>
          <p className="mt-1 text-3xl font-bold text-gray-900">{value}</p>
          <p className="mt-1 text-sm text-gray-500">{subtitle}</p>
        </div>
        <span className="text-3xl">{icon}</span>
      </div>
      {trend && (
        <p className={cn('mt-3 text-sm', trendUp ? 'text-green-600' : 'text-gray-500')}>
          {trend}
        </p>
      )}
    </div>
  );
}

function QuickActionButton({ href, icon, label }: { href: string; icon: string; label: string }) {
  return (
    <Link
      href={href}
      className="flex items-center gap-3 rounded-xl p-3 transition-colors hover:bg-gray-50"
    >
      <span className="text-xl">{icon}</span>
      <span className="font-medium text-gray-700">{label}</span>
    </Link>
  );
}

function ActivityItem({
  icon,
  title,
  description,
  time,
}: {
  icon: string;
  title: string;
  description: string;
  time: string;
}) {
  return (
    <div className="flex gap-3">
      <span className="text-lg">{icon}</span>
      <div className="flex-1">
        <p className="font-medium text-gray-900">{title}</p>
        <p className="text-sm text-gray-500">{description}</p>
        <p className="mt-1 text-xs text-gray-400">{time}</p>
      </div>
    </div>
  );
}

function ServiceHealthRow({
  name,
  status,
  uptime,
  responseTime,
  calls,
  errors,
}: {
  name: string;
  status: 'online' | 'degraded' | 'offline';
  uptime: number;
  responseTime: number;
  calls: number;
  errors: number;
}) {
  const statusColors = {
    online: 'bg-green-100 text-green-700',
    degraded: 'bg-yellow-100 text-yellow-700',
    offline: 'bg-red-100 text-red-700',
  };

  return (
    <tr>
      <td className="py-3 font-medium text-gray-900">{name}</td>
      <td className="py-3">
        <span className={cn('rounded-full px-2 py-1 text-xs font-medium', statusColors[status])}>
          {status.charAt(0).toUpperCase() + status.slice(1)}
        </span>
      </td>
      <td className="py-3 text-gray-700">{uptime}%</td>
      <td className="py-3 text-gray-700">{responseTime}ms</td>
      <td className="py-3 text-gray-700">{calls.toLocaleString()}</td>
      <td className="py-3">
        <span className={errors > 100 ? 'text-red-600' : 'text-gray-700'}>{errors}</span>
      </td>
    </tr>
  );
}

function SimpleChart({
  data,
  dataKey,
  color,
}: {
  data: Array<{ date: string; [key: string]: unknown }>;
  dataKey: string;
  color: string;
}) {
  if (data.length === 0) return <div className="flex h-full items-center justify-center text-gray-400">No data</div>;

  const values = data.map((d) => Number(d[dataKey]) || 0);
  const max = Math.max(...values);
  const min = Math.min(...values);
  const range = max - min || 1;

  return (
    <div className="flex h-full items-end gap-1">
      {data.map((d, i) => (
        <div
          key={d.date}
          className="flex-1 rounded-t transition-all hover:opacity-80"
          style={{
            backgroundColor: color,
            height: `${((Number(d[dataKey]) - min) / range) * 80 + 20}%`,
          }}
          title={`${d.date}: ${Number(d[dataKey]).toLocaleString()}`}
        />
      ))}
    </div>
  );
}

function formatNumber(num: number): string {
  if (num >= 1000000) return `${(num / 1000000).toFixed(1)}M`;
  if (num >= 1000) return `${(num / 1000).toFixed(0)}K`;
  return num.toString();
}
