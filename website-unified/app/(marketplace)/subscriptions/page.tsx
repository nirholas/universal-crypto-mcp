'use client';

import * as React from 'react';
import Link from 'next/link';
import { cn } from '@/lib/utils/cn';
import { useSubscriptions } from '@/lib/marketplace/hooks';
import type { Subscription } from '@/lib/marketplace/types';

export default function SubscriptionsPage() {
  const { subscriptions, loading, cancelSubscription } = useSubscriptions();
  const [filter, setFilter] = React.useState<'all' | 'active' | 'cancelled' | 'expired'>('all');
  const [copiedKey, setCopiedKey] = React.useState<string | null>(null);

  const filteredSubscriptions = subscriptions.filter((s: { status: string }) => {
    if (filter === 'all') return true;
    return s.status === filter;
  });

  const copyApiKey = (key: string) => {
    navigator.clipboard.writeText(key);
    setCopiedKey(key);
    setTimeout(() => setCopiedKey(null), 2000);
  };

  if (loading) {
    return (
      <div className="mx-auto max-w-5xl px-4 py-8 sm:px-6 lg:px-8">
        <div className="animate-pulse space-y-6">
          <div className="h-8 w-48 rounded bg-gray-200" />
          <div className="space-y-4">
            {[1, 2, 3].map((i) => (
              <div key={i} className="h-40 rounded-2xl bg-gray-200" />
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-5xl px-4 py-8 sm:px-6 lg:px-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">My Subscriptions</h1>
        <p className="mt-1 text-gray-600">Manage your active service subscriptions</p>
      </div>

      {/* Stats */}
      <div className="mb-8 grid gap-4 md:grid-cols-4">
        <div className="rounded-2xl border-2 border-gray-200 bg-white p-4">
          <p className="text-sm text-gray-500">Active Subscriptions</p>
          <p className="mt-1 text-2xl font-bold text-gray-900">
            {subscriptions.filter((s: { status: string }) => s.status === 'active').length}
          </p>
        </div>
        <div className="rounded-2xl border-2 border-gray-200 bg-white p-4">
          <p className="text-sm text-gray-500">Monthly Spend</p>
          <p className="mt-1 text-2xl font-bold text-gray-900">
            ${subscriptions
              .filter((s: { status: string }) => s.status === 'active')
              .reduce((sum: number, s: { plan: { price: number } }) => sum + s.plan.price, 0)
              .toFixed(2)}
          </p>
        </div>
        <div className="rounded-2xl border-2 border-gray-200 bg-white p-4">
          <p className="text-sm text-gray-500">API Calls This Month</p>
          <p className="mt-1 text-2xl font-bold text-gray-900">
            {subscriptions.reduce((sum: number, s: { usageThisMonth: number }) => sum + s.usageThisMonth, 0).toLocaleString()}
          </p>
        </div>
        <div className="rounded-2xl border-2 border-gray-200 bg-white p-4">
          <p className="text-sm text-gray-500">Next Billing</p>
          <p className="mt-1 text-2xl font-bold text-gray-900">
            {subscriptions.length > 0
              ? new Date(subscriptions[0].endDate).toLocaleDateString()
              : 'N/A'}
          </p>
        </div>
      </div>

      {/* Filter Tabs */}
      <div className="mb-6 flex gap-2">
        {(['all', 'active', 'cancelled', 'expired'] as const).map((f) => (
          <button
            key={f}
            type="button"
            onClick={() => setFilter(f)}
            className={cn(
              'rounded-lg px-4 py-2 text-sm font-medium capitalize transition-colors',
              filter === f ? 'bg-black text-white' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            )}
          >
            {f}
          </button>
        ))}
      </div>

      {/* Subscriptions List */}
      <div className="space-y-4">
        {filteredSubscriptions.map((subscription: Subscription) => (
          <div
            key={subscription.id}
            className="rounded-2xl border-2 border-gray-200 bg-white p-6 transition-all hover:border-gray-300"
          >
            <div className="flex flex-wrap items-start justify-between gap-4">
              {/* Service Info */}
              <div>
                <div className="flex items-center gap-2">
                  <Link
                    href={`/marketplace/service/${subscription.serviceId}`}
                    className="font-semibold text-gray-900 hover:underline"
                  >
                    {subscription.serviceName}
                  </Link>
                  <span
                    className={cn(
                      'rounded-full px-2 py-0.5 text-xs font-medium capitalize',
                      subscription.status === 'active' && 'bg-green-100 text-green-700',
                      subscription.status === 'cancelled' && 'bg-yellow-100 text-yellow-700',
                      subscription.status === 'expired' && 'bg-red-100 text-red-700'
                    )}
                  >
                    {subscription.status}
                  </span>
                </div>
                <p className="mt-1 text-sm capitalize text-gray-500">
                  {subscription.plan.name} Plan • ${subscription.plan.price}/{subscription.plan.billingPeriod}
                </p>
              </div>

              {/* Usage */}
              <div className="text-right">
                <p className="text-sm text-gray-500">Usage This Month</p>
                <p className="font-semibold text-gray-900">
                  {subscription.usageThisMonth.toLocaleString()} / {subscription.plan.requestsIncluded.toLocaleString()}
                </p>
                <div className="mt-2 h-2 w-32 overflow-hidden rounded-full bg-gray-200">
                  <div
                    className={cn(
                      'h-full rounded-full transition-all',
                      subscription.usageThisMonth / subscription.plan.requestsIncluded > 0.9
                        ? 'bg-red-500'
                        : subscription.usageThisMonth / subscription.plan.requestsIncluded > 0.7
                          ? 'bg-yellow-500'
                          : 'bg-green-500'
                    )}
                    style={{
                      width: `${Math.min(100, (subscription.usageThisMonth / subscription.plan.requestsIncluded) * 100)}%`,
                    }}
                  />
                </div>
              </div>
            </div>

            {/* API Key */}
            <div className="mt-4 rounded-xl bg-gray-50 p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-700">API Key</p>
                  <code className="font-mono text-sm text-gray-900">
                    {subscription.apiKey.slice(0, 20)}...
                  </code>
                </div>
                <button
                  type="button"
                  onClick={() => copyApiKey(subscription.apiKey)}
                  className="rounded-lg bg-gray-200 px-3 py-1.5 text-sm font-medium text-gray-700 hover:bg-gray-300"
                >
                  {copiedKey === subscription.apiKey ? '✓ Copied' : 'Copy'}
                </button>
              </div>
            </div>

            {/* Billing Info */}
            <div className="mt-4 flex flex-wrap items-center justify-between gap-4 border-t border-gray-100 pt-4">
              <div className="flex gap-6 text-sm text-gray-500">
                <span>Started: {new Date(subscription.startDate).toLocaleDateString()}</span>
                <span>Renews: {new Date(subscription.endDate).toLocaleDateString()}</span>
                <span>Auto-renew: {subscription.autoRenew ? 'Yes' : 'No'}</span>
              </div>

              <div className="flex gap-2">
                <Link
                  href={`/marketplace/service/${subscription.serviceId}`}
                  className="rounded-lg bg-gray-100 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-200"
                >
                  View Service
                </Link>
                {subscription.status === 'active' && (
                  <>
                    <button
                      type="button"
                      className="rounded-lg bg-blue-100 px-4 py-2 text-sm font-medium text-blue-700 hover:bg-blue-200"
                    >
                      Upgrade
                    </button>
                    <button
                      type="button"
                      onClick={() => cancelSubscription(subscription.id)}
                      className="rounded-lg bg-red-100 px-4 py-2 text-sm font-medium text-red-700 hover:bg-red-200"
                    >
                      Cancel
                    </button>
                  </>
                )}
              </div>
            </div>
          </div>
        ))}

        {filteredSubscriptions.length === 0 && (
          <div className="py-16 text-center">
            <p className="text-4xl">📭</p>
            <h3 className="mt-4 text-lg font-semibold text-gray-900">No subscriptions found</h3>
            <p className="mt-1 text-gray-600">
              {filter === 'all'
                ? "You haven't subscribed to any services yet."
                : `No ${filter} subscriptions.`}
            </p>
            <Link
              href="/marketplace/discover"
              className="mt-4 inline-block rounded-xl bg-black px-6 py-3 font-medium text-white hover:bg-gray-800"
            >
              Discover Services
            </Link>
          </div>
        )}
      </div>

      {/* Billing History */}
      {subscriptions.length > 0 && (
        <div className="mt-8 rounded-2xl border-2 border-gray-200 bg-white p-6">
          <h2 className="mb-4 font-semibold text-gray-900">Billing History</h2>
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-200 text-left text-sm text-gray-500">
                <th className="pb-3 font-medium">Date</th>
                <th className="pb-3 font-medium">Description</th>
                <th className="pb-3 font-medium">Amount</th>
                <th className="pb-3 font-medium">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 text-sm">
              <tr>
                <td className="py-3 text-gray-600">Jan 15, 2026</td>
                <td className="py-3 text-gray-900">Crypto Price Oracle - Professional</td>
                <td className="py-3 text-gray-900">$99.00</td>
                <td className="py-3">
                  <span className="rounded-full bg-green-100 px-2 py-0.5 text-xs font-medium text-green-700">
                    Paid
                  </span>
                </td>
              </tr>
              <tr>
                <td className="py-3 text-gray-600">Jan 10, 2026</td>
                <td className="py-3 text-gray-900">Trading Signals Pro - Professional</td>
                <td className="py-3 text-gray-900">$199.00</td>
                <td className="py-3">
                  <span className="rounded-full bg-green-100 px-2 py-0.5 text-xs font-medium text-green-700">
                    Paid
                  </span>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
