/**
 * Payment Settings Page
 * 
 * Manage payment methods, payout settings, and billing preferences
 * 
 * @author Nich (@nichxbt)
 * @license Apache-2.0
 */

'use client';

import React, { useState, useEffect, useCallback } from 'react';
import {
  CreditCard,
  Wallet,
  Building2,
  Shield,
  Bell,
  Globe,
  RefreshCw,
  AlertCircle,
  Loader2,
  Plus,
  Trash2,
  Check,
  Star,
  ExternalLink,
  Copy,
  Eye,
  EyeOff
} from 'lucide-react';

// ============================================
// Types
// ============================================

interface PaymentMethod {
  id: string;
  type: 'card' | 'crypto_wallet' | 'bank_account';
  isDefault: boolean;
  createdAt: string;
  // Card-specific
  brand?: string;
  last4?: string;
  expiryMonth?: number;
  expiryYear?: number;
  // Crypto-specific
  walletAddress?: string;
  chainId?: number;
  // Bank-specific
  bankName?: string;
  accountLast4?: string;
}

interface PayoutSettings {
  method: 'bank_transfer' | 'crypto' | 'paypal';
  schedule: 'daily' | 'weekly' | 'monthly' | 'manual';
  minimumAmount: number;
  currency: string;
  destination?: string;
  bankDetails?: {
    bankName: string;
    accountLast4: string;
    routingNumber: string;
  };
  cryptoDetails?: {
    address: string;
    chainId: number;
  };
}

interface BillingPreferences {
  currency: string;
  timezone: string;
  invoiceEmails: string[];
  autoPayEnabled: boolean;
  receiptEnabled: boolean;
  taxId?: string;
  billingAddress?: {
    line1: string;
    line2?: string;
    city: string;
    state: string;
    postalCode: string;
    country: string;
  };
}

interface NotificationSettings {
  emailNotifications: boolean;
  pushNotifications: boolean;
  paymentReceived: boolean;
  paymentFailed: boolean;
  subscriptionRenewal: boolean;
  lowBalance: boolean;
  payoutReady: boolean;
  securityAlerts: boolean;
}

// ============================================
// Settings API Service
// ============================================

class SettingsService {
  private baseUrl = '/api/settings';

  async fetchPaymentMethods(): Promise<PaymentMethod[]> {
    const response = await fetch(`${this.baseUrl}/payment-methods`, {
      credentials: 'include',
    });
    if (!response.ok) throw new Error('Failed to fetch payment methods');
    return response.json();
  }

  async addPaymentMethod(data: Partial<PaymentMethod>): Promise<PaymentMethod> {
    const response = await fetch(`${this.baseUrl}/payment-methods`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
      credentials: 'include',
    });
    if (!response.ok) throw new Error('Failed to add payment method');
    return response.json();
  }

  async removePaymentMethod(id: string): Promise<void> {
    const response = await fetch(`${this.baseUrl}/payment-methods/${id}`, {
      method: 'DELETE',
      credentials: 'include',
    });
    if (!response.ok) throw new Error('Failed to remove payment method');
  }

  async setDefaultPaymentMethod(id: string): Promise<void> {
    const response = await fetch(`${this.baseUrl}/payment-methods/${id}/default`, {
      method: 'POST',
      credentials: 'include',
    });
    if (!response.ok) throw new Error('Failed to set default payment method');
  }

  async fetchPayoutSettings(): Promise<PayoutSettings> {
    const response = await fetch(`${this.baseUrl}/payout`, {
      credentials: 'include',
    });
    if (!response.ok) throw new Error('Failed to fetch payout settings');
    return response.json();
  }

  async updatePayoutSettings(settings: Partial<PayoutSettings>): Promise<PayoutSettings> {
    const response = await fetch(`${this.baseUrl}/payout`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(settings),
      credentials: 'include',
    });
    if (!response.ok) throw new Error('Failed to update payout settings');
    return response.json();
  }

  async fetchBillingPreferences(): Promise<BillingPreferences> {
    const response = await fetch(`${this.baseUrl}/billing`, {
      credentials: 'include',
    });
    if (!response.ok) throw new Error('Failed to fetch billing preferences');
    return response.json();
  }

  async updateBillingPreferences(prefs: Partial<BillingPreferences>): Promise<BillingPreferences> {
    const response = await fetch(`${this.baseUrl}/billing`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(prefs),
      credentials: 'include',
    });
    if (!response.ok) throw new Error('Failed to update billing preferences');
    return response.json();
  }

  async fetchNotificationSettings(): Promise<NotificationSettings> {
    const response = await fetch(`${this.baseUrl}/notifications`, {
      credentials: 'include',
    });
    if (!response.ok) throw new Error('Failed to fetch notification settings');
    return response.json();
  }

  async updateNotificationSettings(settings: Partial<NotificationSettings>): Promise<NotificationSettings> {
    const response = await fetch(`${this.baseUrl}/notifications`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(settings),
      credentials: 'include',
    });
    if (!response.ok) throw new Error('Failed to update notification settings');
    return response.json();
  }
}

const settingsService = new SettingsService();

// ============================================
// Component
// ============================================

export default function PaymentSettingsPage() {
  const [activeTab, setActiveTab] = useState<'methods' | 'payout' | 'billing' | 'notifications'>('methods');
  const [paymentMethods, setPaymentMethods] = useState<PaymentMethod[]>([]);
  const [payoutSettings, setPayoutSettings] = useState<PayoutSettings | null>(null);
  const [billingPrefs, setBillingPrefs] = useState<BillingPreferences | null>(null);
  const [notificationSettings, setNotificationSettings] = useState<NotificationSettings | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);

  const fetchData = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const [methods, payout, billing, notifications] = await Promise.all([
        settingsService.fetchPaymentMethods(),
        settingsService.fetchPayoutSettings(),
        settingsService.fetchBillingPreferences(),
        settingsService.fetchNotificationSettings(),
      ]);
      setPaymentMethods(methods);
      setPayoutSettings(payout);
      setBillingPrefs(billing);
      setNotificationSettings(notifications);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load settings');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const handleRemoveMethod = async (id: string) => {
    if (!confirm('Are you sure you want to remove this payment method?')) return;
    try {
      await settingsService.removePaymentMethod(id);
      setPaymentMethods(methods => methods.filter(m => m.id !== id));
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to remove payment method');
    }
  };

  const handleSetDefault = async (id: string) => {
    try {
      await settingsService.setDefaultPaymentMethod(id);
      setPaymentMethods(methods =>
        methods.map(m => ({ ...m, isDefault: m.id === id }))
      );
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to set default');
    }
  };

  const handleUpdateNotifications = async (key: keyof NotificationSettings, value: boolean) => {
    if (!notificationSettings) return;
    setSaving(true);
    try {
      const updated = await settingsService.updateNotificationSettings({ [key]: value });
      setNotificationSettings(updated);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to update settings');
    } finally {
      setSaving(false);
    }
  };

  const tabs = [
    { id: 'methods', label: 'Payment Methods', icon: CreditCard },
    { id: 'payout', label: 'Payout Settings', icon: Building2 },
    { id: 'billing', label: 'Billing', icon: Globe },
    { id: 'notifications', label: 'Notifications', icon: Bell },
  ] as const;

  const getMethodIcon = (type: PaymentMethod['type']) => {
    switch (type) {
      case 'card':
        return CreditCard;
      case 'crypto_wallet':
        return Wallet;
      case 'bank_account':
        return Building2;
    }
  };

  return (
    <div className="min-h-screen bg-gray-950 text-white">
      {/* Header */}
      <header className="border-b border-gray-800 bg-gray-900/50 backdrop-blur-sm sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 py-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold">Payment Settings</h1>
              <p className="text-gray-400 text-sm">Manage your payment methods and preferences</p>
            </div>
            <button
              onClick={fetchData}
              disabled={loading}
              className="p-2 bg-gray-800 text-gray-400 hover:text-white rounded-lg transition-colors disabled:opacity-50"
            >
              <RefreshCw className={`w-5 h-5 ${loading ? 'animate-spin' : ''}`} />
            </button>
          </div>

          {/* Tab Navigation */}
          <nav className="flex gap-1 mt-6">
            {tabs.map((tab) => {
              const Icon = tab.icon;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex items-center gap-2 px-4 py-3 text-sm font-medium transition-colors border-b-2 ${
                    activeTab === tab.id
                      ? 'text-blue-400 border-blue-400'
                      : 'text-gray-400 border-transparent hover:text-white'
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  {tab.label}
                </button>
              );
            })}
          </nav>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 py-8">
        {/* Error State */}
        {error && (
          <div className="mb-6 bg-red-500/10 border border-red-500/30 rounded-lg p-4 flex items-center gap-3">
            <AlertCircle className="w-5 h-5 text-red-500" />
            <span className="text-red-400">{error}</span>
            <button onClick={() => setError(null)} className="ml-auto text-red-400 hover:text-red-300">
              Dismiss
            </button>
          </div>
        )}

        {/* Loading State */}
        {loading && (
          <div className="flex items-center justify-center py-20">
            <Loader2 className="w-8 h-8 animate-spin text-blue-500" />
          </div>
        )}

        {/* Payment Methods Tab */}
        {!loading && activeTab === 'methods' && (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-semibold">Your Payment Methods</h2>
              <button className="flex items-center gap-2 px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-lg transition-colors">
                <Plus className="w-4 h-4" />
                Add Method
              </button>
            </div>

            {paymentMethods.length === 0 ? (
              <div className="bg-gray-900 rounded-xl border border-gray-800 p-12 text-center">
                <CreditCard className="w-16 h-16 text-gray-600 mx-auto mb-4" />
                <h3 className="text-xl font-semibold mb-2">No Payment Methods</h3>
                <p className="text-gray-400 mb-6">Add a payment method to start making payments.</p>
                <button className="inline-flex items-center gap-2 px-6 py-3 bg-blue-500 hover:bg-blue-600 text-white rounded-lg transition-colors">
                  <Plus className="w-4 h-4" />
                  Add Payment Method
                </button>
              </div>
            ) : (
              <div className="space-y-4">
                {paymentMethods.map((method) => {
                  const Icon = getMethodIcon(method.type);
                  return (
                    <div
                      key={method.id}
                      className="bg-gray-900 rounded-xl border border-gray-800 p-5 flex items-center justify-between"
                    >
                      <div className="flex items-center gap-4">
                        <div className="w-12 h-12 bg-gray-800 rounded-lg flex items-center justify-center">
                          <Icon className="w-6 h-6 text-gray-400" />
                        </div>
                        <div>
                          {method.type === 'card' && (
                            <>
                              <div className="flex items-center gap-2">
                                <span className="font-medium text-white capitalize">
                                  {method.brand} •••• {method.last4}
                                </span>
                                {method.isDefault && (
                                  <span className="px-2 py-0.5 bg-blue-500/20 text-blue-400 text-xs rounded-full">
                                    Default
                                  </span>
                                )}
                              </div>
                              <div className="text-gray-500 text-sm">
                                Expires {method.expiryMonth}/{method.expiryYear}
                              </div>
                            </>
                          )}
                          {method.type === 'crypto_wallet' && (
                            <>
                              <div className="flex items-center gap-2">
                                <span className="font-medium text-white font-mono">
                                  {method.walletAddress?.slice(0, 6)}...{method.walletAddress?.slice(-4)}
                                </span>
                                {method.isDefault && (
                                  <span className="px-2 py-0.5 bg-blue-500/20 text-blue-400 text-xs rounded-full">
                                    Default
                                  </span>
                                )}
                              </div>
                              <div className="text-gray-500 text-sm">Crypto Wallet</div>
                            </>
                          )}
                          {method.type === 'bank_account' && (
                            <>
                              <div className="flex items-center gap-2">
                                <span className="font-medium text-white">
                                  {method.bankName} •••• {method.accountLast4}
                                </span>
                                {method.isDefault && (
                                  <span className="px-2 py-0.5 bg-blue-500/20 text-blue-400 text-xs rounded-full">
                                    Default
                                  </span>
                                )}
                              </div>
                              <div className="text-gray-500 text-sm">Bank Account</div>
                            </>
                          )}
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        {!method.isDefault && (
                          <button
                            onClick={() => handleSetDefault(method.id)}
                            className="p-2 bg-gray-800 text-gray-400 hover:text-blue-400 rounded-lg transition-colors"
                            title="Set as default"
                          >
                            <Star className="w-4 h-4" />
                          </button>
                        )}
                        <button
                          onClick={() => handleRemoveMethod(method.id)}
                          className="p-2 bg-gray-800 text-gray-400 hover:text-red-400 rounded-lg transition-colors"
                          title="Remove"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        )}

        {/* Payout Settings Tab */}
        {!loading && activeTab === 'payout' && payoutSettings && (
          <div className="space-y-6">
            <div className="bg-gray-900 rounded-xl border border-gray-800 p-6">
              <h3 className="text-lg font-semibold mb-6">Payout Method</h3>
              <div className="grid grid-cols-3 gap-4">
                {['bank_transfer', 'crypto', 'paypal'].map((method) => (
                  <button
                    key={method}
                    className={`p-4 rounded-lg border transition-colors ${
                      payoutSettings.method === method
                        ? 'border-blue-500 bg-blue-500/10'
                        : 'border-gray-700 bg-gray-800 hover:border-gray-600'
                    }`}
                  >
                    <div className="flex items-center justify-center mb-2">
                      {method === 'bank_transfer' && <Building2 className="w-6 h-6" />}
                      {method === 'crypto' && <Wallet className="w-6 h-6" />}
                      {method === 'paypal' && <CreditCard className="w-6 h-6" />}
                    </div>
                    <div className="text-sm capitalize">{method.replace('_', ' ')}</div>
                  </button>
                ))}
              </div>
            </div>

            <div className="bg-gray-900 rounded-xl border border-gray-800 p-6">
              <h3 className="text-lg font-semibold mb-6">Payout Schedule</h3>
              <div className="grid grid-cols-4 gap-4">
                {['daily', 'weekly', 'monthly', 'manual'].map((schedule) => (
                  <button
                    key={schedule}
                    className={`p-4 rounded-lg border transition-colors ${
                      payoutSettings.schedule === schedule
                        ? 'border-blue-500 bg-blue-500/10'
                        : 'border-gray-700 bg-gray-800 hover:border-gray-600'
                    }`}
                  >
                    <div className="text-sm capitalize">{schedule}</div>
                  </button>
                ))}
              </div>

              <div className="mt-6">
                <label className="block text-sm text-gray-400 mb-2">Minimum Payout Amount</label>
                <div className="flex items-center gap-2">
                  <span className="text-gray-500">$</span>
                  <input
                    type="number"
                    value={payoutSettings.minimumAmount}
                    className="bg-gray-800 border border-gray-700 rounded-lg px-4 py-2 text-white w-32"
                  />
                  <span className="text-gray-500">{payoutSettings.currency}</span>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Billing Tab */}
        {!loading && activeTab === 'billing' && billingPrefs && (
          <div className="space-y-6">
            <div className="bg-gray-900 rounded-xl border border-gray-800 p-6">
              <h3 className="text-lg font-semibold mb-6">Billing Preferences</h3>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm text-gray-400 mb-2">Currency</label>
                  <select className="bg-gray-800 border border-gray-700 rounded-lg px-4 py-2 text-white w-full">
                    <option value="USD">USD - US Dollar</option>
                    <option value="EUR">EUR - Euro</option>
                    <option value="GBP">GBP - British Pound</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm text-gray-400 mb-2">Timezone</label>
                  <select className="bg-gray-800 border border-gray-700 rounded-lg px-4 py-2 text-white w-full">
                    <option value="UTC">UTC</option>
                    <option value="America/New_York">Eastern Time</option>
                    <option value="America/Los_Angeles">Pacific Time</option>
                  </select>
                </div>
                <div className="flex items-center justify-between py-3">
                  <div>
                    <div className="text-white">Auto-pay enabled</div>
                    <div className="text-gray-500 text-sm">Automatically pay invoices when due</div>
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input
                      type="checkbox"
                      checked={billingPrefs.autoPayEnabled}
                      className="sr-only peer"
                    />
                    <div className="w-11 h-6 bg-gray-700 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-500"></div>
                  </label>
                </div>
              </div>
            </div>

            <div className="bg-gray-900 rounded-xl border border-gray-800 p-6">
              <h3 className="text-lg font-semibold mb-6">Billing Address</h3>
              <div className="grid grid-cols-2 gap-4">
                <div className="col-span-2">
                  <label className="block text-sm text-gray-400 mb-2">Address Line 1</label>
                  <input
                    type="text"
                    value={billingPrefs.billingAddress?.line1 || ''}
                    className="bg-gray-800 border border-gray-700 rounded-lg px-4 py-2 text-white w-full"
                    placeholder="Street address"
                  />
                </div>
                <div>
                  <label className="block text-sm text-gray-400 mb-2">City</label>
                  <input
                    type="text"
                    value={billingPrefs.billingAddress?.city || ''}
                    className="bg-gray-800 border border-gray-700 rounded-lg px-4 py-2 text-white w-full"
                  />
                </div>
                <div>
                  <label className="block text-sm text-gray-400 mb-2">State</label>
                  <input
                    type="text"
                    value={billingPrefs.billingAddress?.state || ''}
                    className="bg-gray-800 border border-gray-700 rounded-lg px-4 py-2 text-white w-full"
                  />
                </div>
                <div>
                  <label className="block text-sm text-gray-400 mb-2">Postal Code</label>
                  <input
                    type="text"
                    value={billingPrefs.billingAddress?.postalCode || ''}
                    className="bg-gray-800 border border-gray-700 rounded-lg px-4 py-2 text-white w-full"
                  />
                </div>
                <div>
                  <label className="block text-sm text-gray-400 mb-2">Country</label>
                  <input
                    type="text"
                    value={billingPrefs.billingAddress?.country || ''}
                    className="bg-gray-800 border border-gray-700 rounded-lg px-4 py-2 text-white w-full"
                  />
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Notifications Tab */}
        {!loading && activeTab === 'notifications' && notificationSettings && (
          <div className="bg-gray-900 rounded-xl border border-gray-800 p-6">
            <h3 className="text-lg font-semibold mb-6">Notification Preferences</h3>
            <div className="space-y-4">
              {[
                { key: 'emailNotifications', label: 'Email Notifications', desc: 'Receive notifications via email' },
                { key: 'pushNotifications', label: 'Push Notifications', desc: 'Receive browser push notifications' },
                { key: 'paymentReceived', label: 'Payment Received', desc: 'When you receive a payment' },
                { key: 'paymentFailed', label: 'Payment Failed', desc: 'When a payment fails' },
                { key: 'subscriptionRenewal', label: 'Subscription Renewal', desc: 'When subscriptions renew' },
                { key: 'lowBalance', label: 'Low Balance', desc: 'When wallet balance is low' },
                { key: 'payoutReady', label: 'Payout Ready', desc: 'When payouts are ready for withdrawal' },
                { key: 'securityAlerts', label: 'Security Alerts', desc: 'Important security notifications' },
              ].map((setting) => (
                <div key={setting.key} className="flex items-center justify-between py-3 border-b border-gray-800 last:border-0">
                  <div>
                    <div className="text-white">{setting.label}</div>
                    <div className="text-gray-500 text-sm">{setting.desc}</div>
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input
                      type="checkbox"
                      checked={notificationSettings[setting.key as keyof NotificationSettings] as boolean}
                      onChange={(e) => handleUpdateNotifications(setting.key as keyof NotificationSettings, e.target.checked)}
                      disabled={saving}
                      className="sr-only peer"
                    />
                    <div className="w-11 h-6 bg-gray-700 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-500"></div>
                  </label>
                </div>
              ))}
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
