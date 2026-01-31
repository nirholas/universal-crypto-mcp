'use client';

import * as React from 'react';
import Link from 'next/link';
import { cn } from '@/lib/utils/cn';
import { PlatformAnalytics } from '@/components/marketplace/PlatformAnalytics';
import { usePlatformStats } from '@/lib/marketplace/hooks';

// Mock data for admin dashboard
const mockPendingVerifications = [
  { id: 'svc-1', name: 'DeFi Yield Optimizer', provider: 'YieldMax', submittedAt: '2024-01-15', status: 'pending' },
  { id: 'svc-2', name: 'Cross-Chain Bridge API', provider: 'BridgeProtocol', submittedAt: '2024-01-14', status: 'pending' },
  { id: 'svc-3', name: 'MEV Protection Service', provider: 'FlashGuard', submittedAt: '2024-01-13', status: 'review' },
];

const mockActiveDisputes = [
  { id: 'dsp-1', service: 'Trading Signals AI', consumer: 'User-456', amount: 299, status: 'escalated', daysOpen: 3 },
  { id: 'dsp-2', service: 'Crypto Oracle Feed', consumer: 'User-789', amount: 149, status: 'pending', daysOpen: 1 },
];

const mockRecentActivity = [
  { id: 1, type: 'verification', message: 'New service "AI Image Gen" awaiting verification', time: '2 hours ago' },
  { id: 2, type: 'dispute', message: 'Dispute #DSP-456 escalated to mediation', time: '4 hours ago' },
  { id: 3, type: 'payout', message: 'Batch payout of $45,230 processed', time: '6 hours ago' },
  { id: 4, type: 'alert', message: 'Service "NFT API" uptime dropped below 99%', time: '8 hours ago' },
  { id: 5, type: 'user', message: 'New provider "DataLabs" registered', time: '12 hours ago' },
];

export default function AdminDashboardPage() {
  const { stats, loading: isLoading } = usePlatformStats();
  const [period, setPeriod] = React.useState<'7d' | '30d' | '90d' | '1y'>('30d');

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
      {/* Header */}
      <div className="mb-8 flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Admin Dashboard</h1>
          <p className="mt-1 text-gray-600">Platform overview and management</p>
        </div>
        <div className="flex gap-2">
          <Link
            href="/admin/verify"
            className="flex items-center gap-2 rounded-xl border-2 border-gray-200 px-4 py-2 font-medium text-gray-700 hover:border-black"
          >
            <span>🔍</span>
            Verifications
            <span className="rounded-full bg-red-500 px-2 py-0.5 text-xs text-white">
              {mockPendingVerifications.length}
            </span>
          </Link>
          <Link
            href="/admin/disputes"
            className="flex items-center gap-2 rounded-xl border-2 border-gray-200 px-4 py-2 font-medium text-gray-700 hover:border-black"
          >
            <span>⚖️</span>
            Disputes
            <span className="rounded-full bg-yellow-500 px-2 py-0.5 text-xs text-white">
              {mockActiveDisputes.length}
            </span>
          </Link>
        </div>
      </div>

      {/* Quick Stats */}
      <div className="mb-8 grid gap-4 md:grid-cols-6">
        <div className="rounded-xl border-2 border-gray-200 bg-white p-4">
          <p className="text-sm text-gray-500">Today's GMV</p>
          <p className="mt-1 text-2xl font-bold text-gray-900">$12.4K</p>
          <p className="mt-1 text-xs text-green-600">↑ 18% vs yesterday</p>
        </div>
        <div className="rounded-xl border-2 border-gray-200 bg-white p-4">
          <p className="text-sm text-gray-500">Active Users</p>
          <p className="mt-1 text-2xl font-bold text-gray-900">2,847</p>
          <p className="mt-1 text-xs text-green-600">↑ 12% vs yesterday</p>
        </div>
        <div className="rounded-xl border-2 border-gray-200 bg-white p-4">
          <p className="text-sm text-gray-500">API Calls/min</p>
          <p className="mt-1 text-2xl font-bold text-gray-900">45.2K</p>
          <p className="mt-1 text-xs text-gray-500">Normal load</p>
        </div>
        <div className="rounded-xl border-2 border-gray-200 bg-white p-4">
          <p className="text-sm text-gray-500">Pending Payouts</p>
          <p className="mt-1 text-2xl font-bold text-gray-900">$78.5K</p>
          <p className="mt-1 text-xs text-gray-500">Next batch: 2h</p>
        </div>
        <div className="rounded-xl border-2 border-gray-200 bg-white p-4">
          <p className="text-sm text-gray-500">Platform Fee</p>
          <p className="mt-1 text-2xl font-bold text-gray-900">$4.2K</p>
          <p className="mt-1 text-xs text-gray-500">Today's earnings</p>
        </div>
        <div className="rounded-xl border-2 border-gray-200 bg-white p-4">
          <p className="text-sm text-gray-500">New Signups</p>
          <p className="mt-1 text-2xl font-bold text-gray-900">127</p>
          <p className="mt-1 text-xs text-green-600">↑ 34% vs yesterday</p>
        </div>
      </div>

      {/* Analytics */}
      {!isLoading && stats && (
        <div className="mb-8">
          <PlatformAnalytics stats={stats} period={period} onPeriodChange={setPeriod} />
        </div>
      )}

      {/* Two Column Layout */}
      <div className="grid gap-6 lg:grid-cols-3">
        {/* Pending Verifications */}
        <div className="rounded-2xl border-2 border-gray-200 bg-white p-6">
          <div className="mb-4 flex items-center justify-between">
            <h3 className="font-semibold text-gray-900">Pending Verifications</h3>
            <Link href="/admin/verify" className="text-sm text-blue-600 hover:underline">
              View all →
            </Link>
          </div>
          <div className="space-y-3">
            {mockPendingVerifications.map((item) => (
              <div
                key={item.id}
                className="flex items-center justify-between rounded-xl bg-gray-50 p-4"
              >
                <div>
                  <p className="font-medium text-gray-900">{item.name}</p>
                  <p className="text-sm text-gray-500">{item.provider} • {item.submittedAt}</p>
                </div>
                <span
                  className={cn(
                    'rounded-full px-2 py-1 text-xs font-medium',
                    item.status === 'pending' && 'bg-yellow-100 text-yellow-700',
                    item.status === 'review' && 'bg-blue-100 text-blue-700'
                  )}
                >
                  {item.status}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Active Disputes */}
        <div className="rounded-2xl border-2 border-gray-200 bg-white p-6">
          <div className="mb-4 flex items-center justify-between">
            <h3 className="font-semibold text-gray-900">Active Disputes</h3>
            <Link href="/admin/disputes" className="text-sm text-blue-600 hover:underline">
              View all →
            </Link>
          </div>
          <div className="space-y-3">
            {mockActiveDisputes.map((dispute) => (
              <div
                key={dispute.id}
                className="rounded-xl bg-gray-50 p-4"
              >
                <div className="flex items-center justify-between">
                  <p className="font-medium text-gray-900">{dispute.service}</p>
                  <span
                    className={cn(
                      'rounded-full px-2 py-1 text-xs font-medium',
                      dispute.status === 'escalated' && 'bg-red-100 text-red-700',
                      dispute.status === 'pending' && 'bg-yellow-100 text-yellow-700'
                    )}
                  >
                    {dispute.status}
                  </span>
                </div>
                <div className="mt-2 flex items-center justify-between text-sm text-gray-500">
                  <span>Amount: ${dispute.amount}</span>
                  <span>{dispute.daysOpen} days open</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Recent Activity */}
        <div className="rounded-2xl border-2 border-gray-200 bg-white p-6">
          <h3 className="mb-4 font-semibold text-gray-900">Recent Activity</h3>
          <div className="space-y-4">
            {mockRecentActivity.map((activity) => (
              <div key={activity.id} className="flex items-start gap-3">
                <span
                  className={cn(
                    'flex h-8 w-8 items-center justify-center rounded-full text-sm',
                    activity.type === 'verification' && 'bg-blue-100',
                    activity.type === 'dispute' && 'bg-red-100',
                    activity.type === 'payout' && 'bg-green-100',
                    activity.type === 'alert' && 'bg-yellow-100',
                    activity.type === 'user' && 'bg-purple-100'
                  )}
                >
                  {activity.type === 'verification' && '🔍'}
                  {activity.type === 'dispute' && '⚖️'}
                  {activity.type === 'payout' && '💰'}
                  {activity.type === 'alert' && '⚠️'}
                  {activity.type === 'user' && '👤'}
                </span>
                <div className="flex-1">
                  <p className="text-sm text-gray-900">{activity.message}</p>
                  <p className="text-xs text-gray-500">{activity.time}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* System Health */}
      <div className="mt-6 rounded-2xl border-2 border-gray-200 bg-white p-6">
        <h3 className="mb-4 font-semibold text-gray-900">System Health</h3>
        <div className="grid gap-4 md:grid-cols-4">
          <div className="flex items-center gap-3 rounded-xl bg-green-50 p-4">
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-green-500">
              <span className="text-white">✓</span>
            </div>
            <div>
              <p className="font-medium text-green-800">API Gateway</p>
              <p className="text-sm text-green-600">Operational</p>
            </div>
          </div>
          <div className="flex items-center gap-3 rounded-xl bg-green-50 p-4">
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-green-500">
              <span className="text-white">✓</span>
            </div>
            <div>
              <p className="font-medium text-green-800">Payment Processing</p>
              <p className="text-sm text-green-600">Operational</p>
            </div>
          </div>
          <div className="flex items-center gap-3 rounded-xl bg-green-50 p-4">
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-green-500">
              <span className="text-white">✓</span>
            </div>
            <div>
              <p className="font-medium text-green-800">Database</p>
              <p className="text-sm text-green-600">Operational</p>
            </div>
          </div>
          <div className="flex items-center gap-3 rounded-xl bg-yellow-50 p-4">
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-yellow-500">
              <span className="text-white">!</span>
            </div>
            <div>
              <p className="font-medium text-yellow-800">CDN</p>
              <p className="text-sm text-yellow-600">Degraded Performance</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
