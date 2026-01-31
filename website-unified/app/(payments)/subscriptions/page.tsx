/**
 * Subscriptions Management Page
 * 
 * Manage active subscriptions, billing, and plan changes
 * 
 * @author Nich (@nichxbt)
 * @license Apache-2.0
 */

'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { 
  CreditCard,
  Calendar,
  DollarSign,
  TrendingUp,
  RefreshCw,
  AlertCircle,
  Loader2,
  Plus,
  Settings,
  Pause,
  Play,
  X,
  Check,
  ChevronRight,
  ExternalLink
} from 'lucide-react';

// ============================================
// Types
// ============================================

interface Subscription {
  id: string;
  serviceId: string;
  serviceName: string;
  serviceIcon?: string;
  tierId: string;
  tierName: string;
  status: 'active' | 'paused' | 'cancelled' | 'past_due' | 'trialing';
  amount: number;
  currency: string;
  interval: 'monthly' | 'yearly' | 'weekly';
  currentPeriodStart: string;
  currentPeriodEnd: string;
  cancelAtPeriodEnd: boolean;
  createdAt: string;
  paymentMethod?: {
    type: string;
    last4?: string;
    brand?: string;
  };
  usage?: {
    used: number;
    limit: number;
    unit: string;
  };
}

interface SubscriptionStats {
  activeCount: number;
  totalMonthlySpend: number;
  averagePerSubscription: number;
  nextBillingAmount: number;
  nextBillingDate: string;
}

// ============================================
// Subscriptions API Service
// ============================================

class SubscriptionsService {
  private baseUrl = '/api/subscriptions';

  async fetchSubscriptions(): Promise<{ subscriptions: Subscription[]; stats: SubscriptionStats }> {
    const response = await fetch(this.baseUrl, {
      credentials: 'include',
    });
    if (!response.ok) throw new Error('Failed to fetch subscriptions');
    return response.json();
  }

  async pauseSubscription(id: string): Promise<void> {
    const response = await fetch(`${this.baseUrl}/${id}/pause`, {
      method: 'POST',
      credentials: 'include',
    });
    if (!response.ok) throw new Error('Failed to pause subscription');
  }

  async resumeSubscription(id: string): Promise<void> {
    const response = await fetch(`${this.baseUrl}/${id}/resume`, {
      method: 'POST',
      credentials: 'include',
    });
    if (!response.ok) throw new Error('Failed to resume subscription');
  }

  async cancelSubscription(id: string, immediate: boolean = false): Promise<void> {
    const response = await fetch(`${this.baseUrl}/${id}/cancel`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ immediate }),
      credentials: 'include',
    });
    if (!response.ok) throw new Error('Failed to cancel subscription');
  }

  async updatePaymentMethod(id: string, paymentMethodId: string): Promise<void> {
    const response = await fetch(`${this.baseUrl}/${id}/payment-method`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ paymentMethodId }),
      credentials: 'include',
    });
    if (!response.ok) throw new Error('Failed to update payment method');
  }

  async changePlan(id: string, newTierId: string): Promise<void> {
    const response = await fetch(`${this.baseUrl}/${id}/change-plan`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ tierId: newTierId }),
      credentials: 'include',
    });
    if (!response.ok) throw new Error('Failed to change plan');
  }
}

const subscriptionsService = new SubscriptionsService();

// ============================================
// Component
// ============================================

export default function SubscriptionsPage() {
  const [subscriptions, setSubscriptions] = useState<Subscription[]>([]);
  const [stats, setStats] = useState<SubscriptionStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [actionLoading, setActionLoading] = useState<string | null>(null);

  const fetchData = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await subscriptionsService.fetchSubscriptions();
      setSubscriptions(data.subscriptions);
      setStats(data.stats);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load subscriptions');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const handlePause = async (id: string) => {
    setActionLoading(id);
    try {
      await subscriptionsService.pauseSubscription(id);
      await fetchData();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to pause subscription');
    } finally {
      setActionLoading(null);
    }
  };

  const handleResume = async (id: string) => {
    setActionLoading(id);
    try {
      await subscriptionsService.resumeSubscription(id);
      await fetchData();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to resume subscription');
    } finally {
      setActionLoading(null);
    }
  };

  const handleCancel = async (id: string) => {
    if (!confirm('Are you sure you want to cancel this subscription?')) return;
    setActionLoading(id);
    try {
      await subscriptionsService.cancelSubscription(id);
      await fetchData();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to cancel subscription');
    } finally {
      setActionLoading(null);
    }
  };

  const getStatusBadge = (status: Subscription['status']) => {
    const styles = {
      active: 'bg-green-500/20 text-green-400',
      paused: 'bg-yellow-500/20 text-yellow-400',
      cancelled: 'bg-red-500/20 text-red-400',
      past_due: 'bg-orange-500/20 text-orange-400',
      trialing: 'bg-blue-500/20 text-blue-400',
    };
    return (
      <span className={`px-2 py-1 rounded-full text-xs font-medium ${styles[status]}`}>
        {status.replace('_', ' ')}
      </span>
    );
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    });
  };

  const formatInterval = (interval: Subscription['interval']) => {
    const labels = { monthly: '/mo', yearly: '/yr', weekly: '/wk' };
    return labels[interval];
  };

  return (
    <div className="min-h-screen bg-gray-950 text-white">
      {/* Header */}
      <header className="border-b border-gray-800 bg-gray-900/50 backdrop-blur-sm sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 py-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold">Subscriptions</h1>
              <p className="text-gray-400 text-sm">Manage your active subscriptions and billing</p>
            </div>
            <div className="flex items-center gap-3">
              <button
                onClick={fetchData}
                disabled={loading}
                className="p-2 bg-gray-800 text-gray-400 hover:text-white rounded-lg transition-colors disabled:opacity-50"
              >
                <RefreshCw className={`w-5 h-5 ${loading ? 'animate-spin' : ''}`} />
              </button>
              <a
                href="/marketplace"
                className="flex items-center gap-2 px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-lg transition-colors"
              >
                <Plus className="w-4 h-4" />
                Browse Services
              </a>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 py-8">
        {/* Error State */}
        {error && (
          <div className="mb-6 bg-red-500/10 border border-red-500/30 rounded-lg p-4 flex items-center gap-3">
            <AlertCircle className="w-5 h-5 text-red-500" />
            <span className="text-red-400">{error}</span>
            <button onClick={fetchData} className="ml-auto text-red-400 hover:text-red-300">
              Retry
            </button>
          </div>
        )}

        {/* Stats Cards */}
        {stats && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
            <div className="bg-gray-900 rounded-xl border border-gray-800 p-5">
              <div className="flex items-center gap-3 mb-3">
                <div className="w-10 h-10 bg-blue-500/20 rounded-lg flex items-center justify-center">
                  <CreditCard className="w-5 h-5 text-blue-400" />
                </div>
                <span className="text-gray-400 text-sm">Active Subscriptions</span>
              </div>
              <div className="text-2xl font-bold">{stats.activeCount}</div>
            </div>
            <div className="bg-gray-900 rounded-xl border border-gray-800 p-5">
              <div className="flex items-center gap-3 mb-3">
                <div className="w-10 h-10 bg-green-500/20 rounded-lg flex items-center justify-center">
                  <DollarSign className="w-5 h-5 text-green-400" />
                </div>
                <span className="text-gray-400 text-sm">Monthly Spend</span>
              </div>
              <div className="text-2xl font-bold">${stats.totalMonthlySpend.toLocaleString()}</div>
            </div>
            <div className="bg-gray-900 rounded-xl border border-gray-800 p-5">
              <div className="flex items-center gap-3 mb-3">
                <div className="w-10 h-10 bg-purple-500/20 rounded-lg flex items-center justify-center">
                  <TrendingUp className="w-5 h-5 text-purple-400" />
                </div>
                <span className="text-gray-400 text-sm">Avg. Per Subscription</span>
              </div>
              <div className="text-2xl font-bold">${stats.averagePerSubscription.toFixed(2)}</div>
            </div>
            <div className="bg-gray-900 rounded-xl border border-gray-800 p-5">
              <div className="flex items-center gap-3 mb-3">
                <div className="w-10 h-10 bg-yellow-500/20 rounded-lg flex items-center justify-center">
                  <Calendar className="w-5 h-5 text-yellow-400" />
                </div>
                <span className="text-gray-400 text-sm">Next Billing</span>
              </div>
              <div className="text-2xl font-bold">${stats.nextBillingAmount.toLocaleString()}</div>
              <div className="text-gray-500 text-sm">{formatDate(stats.nextBillingDate)}</div>
            </div>
          </div>
        )}

        {/* Loading State */}
        {loading && !subscriptions.length && (
          <div className="flex items-center justify-center py-20">
            <Loader2 className="w-8 h-8 animate-spin text-blue-500" />
          </div>
        )}

        {/* Empty State */}
        {!loading && subscriptions.length === 0 && (
          <div className="bg-gray-900 rounded-xl border border-gray-800 p-12 text-center">
            <CreditCard className="w-16 h-16 text-gray-600 mx-auto mb-4" />
            <h3 className="text-xl font-semibold mb-2">No Active Subscriptions</h3>
            <p className="text-gray-400 mb-6">Browse our marketplace to find services to subscribe to.</p>
            <a
              href="/marketplace"
              className="inline-flex items-center gap-2 px-6 py-3 bg-blue-500 hover:bg-blue-600 text-white rounded-lg transition-colors"
            >
              <Plus className="w-4 h-4" />
              Browse Marketplace
            </a>
          </div>
        )}

        {/* Subscriptions List */}
        {subscriptions.length > 0 && (
          <div className="space-y-4">
            {subscriptions.map((subscription) => (
              <div
                key={subscription.id}
                className="bg-gray-900 rounded-xl border border-gray-800 p-6"
              >
                <div className="flex items-start justify-between gap-4">
                  <div className="flex items-start gap-4">
                    {/* Service Icon */}
                    <div className="w-12 h-12 bg-gray-800 rounded-lg flex items-center justify-center flex-shrink-0">
                      {subscription.serviceIcon ? (
                        <img
                          src={subscription.serviceIcon}
                          alt={subscription.serviceName}
                          className="w-8 h-8 rounded"
                        />
                      ) : (
                        <CreditCard className="w-6 h-6 text-gray-400" />
                      )}
                    </div>

                    {/* Service Info */}
                    <div>
                      <div className="flex items-center gap-3 mb-1">
                        <h3 className="font-semibold text-white">{subscription.serviceName}</h3>
                        {getStatusBadge(subscription.status)}
                        {subscription.cancelAtPeriodEnd && (
                          <span className="text-orange-400 text-xs">Cancels at period end</span>
                        )}
                      </div>
                      <div className="text-gray-400 text-sm mb-2">{subscription.tierName}</div>
                      <div className="flex items-center gap-4 text-sm">
                        <span className="text-white font-medium">
                          ${subscription.amount}{formatInterval(subscription.interval)}
                        </span>
                        <span className="text-gray-500">
                          Renews {formatDate(subscription.currentPeriodEnd)}
                        </span>
                        {subscription.paymentMethod && (
                          <span className="text-gray-500">
                            {subscription.paymentMethod.brand} ••••{subscription.paymentMethod.last4}
                          </span>
                        )}
                      </div>

                      {/* Usage Bar */}
                      {subscription.usage && (
                        <div className="mt-4">
                          <div className="flex justify-between text-sm mb-1">
                            <span className="text-gray-400">Usage</span>
                            <span className="text-gray-300">
                              {subscription.usage.used.toLocaleString()} / {subscription.usage.limit.toLocaleString()} {subscription.usage.unit}
                            </span>
                          </div>
                          <div className="h-2 bg-gray-800 rounded-full overflow-hidden">
                            <div
                              className={`h-full rounded-full transition-all ${
                                subscription.usage.used / subscription.usage.limit > 0.9
                                  ? 'bg-red-500'
                                  : subscription.usage.used / subscription.usage.limit > 0.7
                                  ? 'bg-yellow-500'
                                  : 'bg-blue-500'
                              }`}
                              style={{ width: `${Math.min((subscription.usage.used / subscription.usage.limit) * 100, 100)}%` }}
                            />
                          </div>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex items-center gap-2">
                    {subscription.status === 'active' && (
                      <button
                        onClick={() => handlePause(subscription.id)}
                        disabled={actionLoading === subscription.id}
                        className="p-2 bg-gray-800 text-gray-400 hover:text-yellow-400 rounded-lg transition-colors disabled:opacity-50"
                        title="Pause subscription"
                      >
                        {actionLoading === subscription.id ? (
                          <Loader2 className="w-4 h-4 animate-spin" />
                        ) : (
                          <Pause className="w-4 h-4" />
                        )}
                      </button>
                    )}
                    {subscription.status === 'paused' && (
                      <button
                        onClick={() => handleResume(subscription.id)}
                        disabled={actionLoading === subscription.id}
                        className="p-2 bg-gray-800 text-gray-400 hover:text-green-400 rounded-lg transition-colors disabled:opacity-50"
                        title="Resume subscription"
                      >
                        {actionLoading === subscription.id ? (
                          <Loader2 className="w-4 h-4 animate-spin" />
                        ) : (
                          <Play className="w-4 h-4" />
                        )}
                      </button>
                    )}
                    <a
                      href={`/subscriptions/${subscription.id}`}
                      className="p-2 bg-gray-800 text-gray-400 hover:text-white rounded-lg transition-colors"
                      title="Settings"
                    >
                      <Settings className="w-4 h-4" />
                    </a>
                    {subscription.status !== 'cancelled' && !subscription.cancelAtPeriodEnd && (
                      <button
                        onClick={() => handleCancel(subscription.id)}
                        disabled={actionLoading === subscription.id}
                        className="p-2 bg-gray-800 text-gray-400 hover:text-red-400 rounded-lg transition-colors disabled:opacity-50"
                        title="Cancel subscription"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </main>
    </div>
  );
}
