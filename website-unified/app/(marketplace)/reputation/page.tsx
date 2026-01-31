'use client';

import * as React from 'react';
import Link from 'next/link';
import { cn } from '@/lib/utils/cn';
import { ReputationBadge, VerificationBadges, TrustIndicators } from '@/components/marketplace/ReputationBadge';

// Mock reputation data
const mockReputationData = {
  overall: 92,
  breakdown: {
    reliability: 95,
    support: 88,
    value: 90,
    quality: 94,
  },
  badges: [
    { id: 'verified', name: 'Verified Provider', icon: '✓', color: 'green', earnedAt: new Date('2023-06-15') },
    { id: 'top-rated', name: 'Top Rated', icon: '⭐', color: 'yellow', earnedAt: new Date('2023-09-01') },
    { id: '100k-calls', name: '100K+ API Calls', icon: '🚀', color: 'blue', earnedAt: new Date('2023-12-01') },
  ],
  history: [
    { date: '2024-01', score: 92 },
    { date: '2023-12', score: 91 },
    { date: '2023-11', score: 90 },
    { date: '2023-10', score: 88 },
    { date: '2023-09', score: 85 },
    { date: '2023-08', score: 82 },
  ],
  recentReviews: 5,
  disputes: {
    total: 2,
    resolved: 2,
    pending: 0,
    wonByProvider: 1,
    wonByConsumer: 1,
  },
  improvements: [
    'Improve response times during peak hours',
    'Add more detailed error messages',
    'Consider offering a free tier for testing',
  ],
};

export default function ReputationPage() {
  const [activeTab, setActiveTab] = React.useState<'overview' | 'badges' | 'history' | 'disputes'>('overview');

  return (
    <div className="mx-auto max-w-5xl px-4 py-8 sm:px-6 lg:px-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">My Reputation</h1>
        <p className="mt-1 text-gray-600">Track and improve your provider reputation</p>
      </div>

      {/* Main Stats */}
      <div className="mb-8 grid gap-6 md:grid-cols-4">
        <div className="rounded-2xl border-2 border-gray-200 bg-white p-6 text-center">
          <ReputationBadge score={mockReputationData.overall} size="lg" className="justify-center" />
          <p className="mt-2 text-sm font-medium text-gray-700">Overall Score</p>
          <p className="text-xs text-green-600">+3 from last month</p>
        </div>
        <div className="rounded-2xl border-2 border-gray-200 bg-white p-6">
          <p className="text-sm text-gray-500">Badges Earned</p>
          <p className="mt-1 text-3xl font-bold text-gray-900">{mockReputationData.badges.length}</p>
          <div className="mt-2 flex gap-1">
            {mockReputationData.badges.map((b) => (
              <span key={b.id} className="text-lg">{b.icon}</span>
            ))}
          </div>
        </div>
        <div className="rounded-2xl border-2 border-gray-200 bg-white p-6">
          <p className="text-sm text-gray-500">Reviews (30 days)</p>
          <p className="mt-1 text-3xl font-bold text-gray-900">{mockReputationData.recentReviews}</p>
          <p className="mt-2 text-xs text-gray-500">Avg rating: 4.7 ★</p>
        </div>
        <div className="rounded-2xl border-2 border-gray-200 bg-white p-6">
          <p className="text-sm text-gray-500">Dispute Resolution</p>
          <p className="mt-1 text-3xl font-bold text-gray-900">
            {mockReputationData.disputes.resolved}/{mockReputationData.disputes.total}
          </p>
          <p className="mt-2 text-xs text-green-600">All disputes resolved</p>
        </div>
      </div>

      {/* Tabs */}
      <div className="mb-6 flex gap-1 rounded-xl bg-gray-100 p-1">
        {(['overview', 'badges', 'history', 'disputes'] as const).map((tab) => (
          <button
            key={tab}
            type="button"
            onClick={() => setActiveTab(tab)}
            className={cn(
              'flex-1 rounded-lg py-2 text-sm font-medium capitalize transition-colors',
              activeTab === tab ? 'bg-white text-black shadow-sm' : 'text-gray-600 hover:text-black'
            )}
          >
            {tab}
          </button>
        ))}
      </div>

      {/* Tab Content */}
      {activeTab === 'overview' && (
        <div className="grid gap-6 lg:grid-cols-2">
          {/* Score Breakdown */}
          <div className="rounded-2xl border-2 border-gray-200 bg-white p-6">
            <h3 className="mb-4 font-semibold text-gray-900">Score Breakdown</h3>
            <div className="space-y-4">
              {Object.entries(mockReputationData.breakdown).map(([key, value]) => (
                <div key={key}>
                  <div className="mb-1 flex items-center justify-between text-sm">
                    <span className="capitalize text-gray-600">{key}</span>
                    <span className="font-medium text-gray-900">{value}</span>
                  </div>
                  <div className="h-2 overflow-hidden rounded-full bg-gray-200">
                    <div
                      className={cn(
                        'h-full rounded-full',
                        value >= 90 ? 'bg-green-500' : value >= 70 ? 'bg-blue-500' : 'bg-yellow-500'
                      )}
                      style={{ width: `${value}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Improvements */}
          <div className="rounded-2xl border-2 border-gray-200 bg-white p-6">
            <h3 className="mb-4 font-semibold text-gray-900">Suggested Improvements</h3>
            <div className="space-y-3">
              {mockReputationData.improvements.map((improvement, index) => (
                <div key={index} className="flex items-start gap-3 rounded-lg bg-yellow-50 p-3">
                  <span className="text-yellow-500">💡</span>
                  <p className="text-sm text-yellow-800">{improvement}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Performance Metrics */}
          <div className="rounded-2xl border-2 border-gray-200 bg-white p-6 lg:col-span-2">
            <h3 className="mb-4 font-semibold text-gray-900">Performance Metrics</h3>
            <TrustIndicators uptime={99.95} responseTime={245} successRate={99.2} />
          </div>
        </div>
      )}

      {activeTab === 'badges' && (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {mockReputationData.badges.map((badge) => (
            <div key={badge.id} className="rounded-2xl border-2 border-gray-200 bg-white p-6">
              <div className="mb-4 text-4xl">{badge.icon}</div>
              <h4 className="font-semibold text-gray-900">{badge.name}</h4>
              <p className="mt-1 text-sm text-gray-500">
                Earned on {new Date(badge.earnedAt).toLocaleDateString()}
              </p>
              <span
                className={cn(
                  'mt-3 inline-block rounded-full px-2 py-0.5 text-xs font-medium',
                  badge.color === 'green' && 'bg-green-100 text-green-700',
                  badge.color === 'yellow' && 'bg-yellow-100 text-yellow-700',
                  badge.color === 'blue' && 'bg-blue-100 text-blue-700'
                )}
              >
                Active
              </span>
            </div>
          ))}

          {/* Locked badges */}
          {[
            { name: '1M API Calls', icon: '🏆', requirement: 'Reach 1 million API calls' },
            { name: 'Premium Support', icon: '💎', requirement: 'Maintain 95%+ support rating' },
            { name: 'Long-term Partner', icon: '🤝', requirement: 'Active for 12+ months' },
          ].map((badge) => (
            <div key={badge.name} className="rounded-2xl border-2 border-dashed border-gray-200 bg-gray-50 p-6">
              <div className="mb-4 text-4xl opacity-30">{badge.icon}</div>
              <h4 className="font-semibold text-gray-400">{badge.name}</h4>
              <p className="mt-1 text-sm text-gray-400">{badge.requirement}</p>
              <span className="mt-3 inline-block rounded-full bg-gray-200 px-2 py-0.5 text-xs font-medium text-gray-500">
                Locked
              </span>
            </div>
          ))}
        </div>
      )}

      {activeTab === 'history' && (
        <div className="rounded-2xl border-2 border-gray-200 bg-white p-6">
          <h3 className="mb-6 font-semibold text-gray-900">Reputation History</h3>
          
          {/* Chart */}
          <div className="mb-8 h-64">
            <div className="flex h-full items-end gap-4">
              {mockReputationData.history.reverse().map((point) => (
                <div key={point.date} className="flex flex-1 flex-col items-center">
                  <div
                    className="w-full rounded-t bg-blue-500 transition-all hover:bg-blue-600"
                    style={{ height: `${((point.score - 70) / 30) * 100}%` }}
                    title={`${point.date}: ${point.score}`}
                  />
                  <p className="mt-2 text-xs text-gray-500">{point.date}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Timeline */}
          <h4 className="mb-4 font-medium text-gray-900">Recent Changes</h4>
          <div className="space-y-4">
            {[
              { date: 'Jan 2024', event: 'Score increased to 92', type: 'positive' },
              { date: 'Dec 2023', event: 'Earned "100K+ API Calls" badge', type: 'badge' },
              { date: 'Nov 2023', event: 'Resolved dispute #DSP-123', type: 'neutral' },
              { date: 'Oct 2023', event: 'Score increased to 88', type: 'positive' },
            ].map((item, index) => (
              <div key={index} className="flex items-center gap-4">
                <div
                  className={cn(
                    'flex h-8 w-8 items-center justify-center rounded-full text-sm',
                    item.type === 'positive' && 'bg-green-100 text-green-600',
                    item.type === 'badge' && 'bg-yellow-100 text-yellow-600',
                    item.type === 'neutral' && 'bg-gray-100 text-gray-600'
                  )}
                >
                  {item.type === 'positive' ? '↑' : item.type === 'badge' ? '🏅' : '•'}
                </div>
                <div className="flex-1">
                  <p className="text-sm text-gray-900">{item.event}</p>
                  <p className="text-xs text-gray-500">{item.date}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {activeTab === 'disputes' && (
        <div className="space-y-6">
          {/* Stats */}
          <div className="grid gap-4 md:grid-cols-4">
            <div className="rounded-xl bg-gray-100 p-4 text-center">
              <p className="text-2xl font-bold text-gray-900">{mockReputationData.disputes.total}</p>
              <p className="text-sm text-gray-500">Total Disputes</p>
            </div>
            <div className="rounded-xl bg-green-100 p-4 text-center">
              <p className="text-2xl font-bold text-green-700">{mockReputationData.disputes.resolved}</p>
              <p className="text-sm text-green-600">Resolved</p>
            </div>
            <div className="rounded-xl bg-blue-100 p-4 text-center">
              <p className="text-2xl font-bold text-blue-700">{mockReputationData.disputes.wonByProvider}</p>
              <p className="text-sm text-blue-600">Won by You</p>
            </div>
            <div className="rounded-xl bg-yellow-100 p-4 text-center">
              <p className="text-2xl font-bold text-yellow-700">{mockReputationData.disputes.pending}</p>
              <p className="text-sm text-yellow-600">Pending</p>
            </div>
          </div>

          {/* Dispute List */}
          <div className="rounded-2xl border-2 border-gray-200 bg-white p-6">
            <h3 className="mb-4 font-semibold text-gray-900">Dispute History</h3>
            <div className="space-y-4">
              <div className="flex items-center justify-between rounded-xl bg-gray-50 p-4">
                <div>
                  <p className="font-medium text-gray-900">DSP-456: Service downtime complaint</p>
                  <p className="text-sm text-gray-500">Resolved • Dec 15, 2023</p>
                </div>
                <span className="rounded-full bg-green-100 px-3 py-1 text-xs font-medium text-green-700">
                  Resolved in Your Favor
                </span>
              </div>
              <div className="flex items-center justify-between rounded-xl bg-gray-50 p-4">
                <div>
                  <p className="font-medium text-gray-900">DSP-123: Billing discrepancy</p>
                  <p className="text-sm text-gray-500">Resolved • Nov 8, 2023</p>
                </div>
                <span className="rounded-full bg-yellow-100 px-3 py-1 text-xs font-medium text-yellow-700">
                  Partial Refund Issued
                </span>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
