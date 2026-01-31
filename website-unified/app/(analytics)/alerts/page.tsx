'use client';

/**
 * Alerts & Notifications Dashboard
 * 
 * Comprehensive alert management with price alerts, portfolio alerts,
 * and multi-channel notification system.
 */

import React, { useState, useCallback } from 'react';
import { cn } from '@/lib/utils/cn';
import { PriceAlerts } from '@/components/analytics/PriceAlerts';
import { PortfolioAlerts } from '@/components/analytics/PortfolioAlerts';
import { NotificationSystem } from '@/components/analytics/NotificationSystem';
import { useAlerts, useNotifications } from '@/lib/analytics/hooks';
import type { Alert, Notification, AlertType, NotificationChannel } from '@/lib/analytics/types';
import { formatCurrency, formatDateTime } from '@/lib/analytics/hooks';

// ============================================================================
// Alert Stats Component
// ============================================================================

interface AlertStatsProps {
  alerts: Alert[];
  notifications: Notification[];
  isLoading: boolean;
}

function AlertStats({ alerts, notifications, isLoading }: AlertStatsProps) {
  if (isLoading) {
    return (
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {[...Array(4)].map((_, i) => (
          <div key={i} className="animate-pulse rounded-2xl bg-gray-200 p-6 h-32" />
        ))}
      </div>
    );
  }

  const activeAlerts = alerts.filter(a => a.enabled).length;
  const triggeredToday = alerts.filter(a => {
    if (!a.lastTriggered) return false;
    const today = new Date().toDateString();
    return new Date(a.lastTriggered).toDateString() === today;
  }).length;
  const unreadNotifications = notifications.filter(n => !n.read).length;
  const totalTriggers = alerts.reduce((sum, a) => sum + a.triggerCount, 0);

  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
      <div className="rounded-2xl bg-gradient-to-br from-blue-600 to-indigo-700 p-6 text-white">
        <div className="text-sm opacity-80">Active Alerts</div>
        <div className="mt-2 text-3xl font-bold">{activeAlerts}</div>
        <div className="mt-2 text-sm opacity-80">
          of {alerts.length} total
        </div>
      </div>

      <div className="rounded-2xl border-2 border-green-200 bg-green-50 p-6">
        <div className="text-sm text-green-700">Triggered Today</div>
        <div className="mt-2 text-3xl font-bold text-green-800">{triggeredToday}</div>
        <div className="mt-2 text-sm text-green-600">
          {totalTriggers} total triggers
        </div>
      </div>

      <div className={cn(
        'rounded-2xl p-6',
        unreadNotifications > 0
          ? 'border-2 border-yellow-200 bg-yellow-50'
          : 'border-2 border-gray-200 bg-white'
      )}>
        <div className={cn(
          'text-sm',
          unreadNotifications > 0 ? 'text-yellow-700' : 'text-gray-500'
        )}>
          Unread Notifications
        </div>
        <div className={cn(
          'mt-2 text-3xl font-bold',
          unreadNotifications > 0 ? 'text-yellow-800' : 'text-gray-800'
        )}>
          {unreadNotifications}
        </div>
        <div className={cn(
          'mt-2 text-sm',
          unreadNotifications > 0 ? 'text-yellow-600' : 'text-gray-500'
        )}>
          {notifications.length} total
        </div>
      </div>

      <div className="rounded-2xl border-2 border-gray-200 bg-white p-6">
        <div className="text-sm text-gray-500">Alert Types</div>
        <div className="mt-2 text-3xl font-bold">
          {new Set(alerts.map(a => a.type)).size}
        </div>
        <div className="mt-2 text-sm text-gray-500">
          Configured types
        </div>
      </div>
    </div>
  );
}

// ============================================================================
// Recent Activity Component
// ============================================================================

interface RecentActivityProps {
  notifications: Notification[];
  onMarkRead: (id: string) => void;
  isLoading: boolean;
}

function RecentActivity({ notifications, onMarkRead, isLoading }: RecentActivityProps) {
  if (isLoading) {
    return (
      <div className="rounded-2xl border-2 border-gray-200 bg-white p-6">
        <div className="animate-pulse space-y-4">
          <div className="h-6 w-32 bg-gray-200 rounded" />
          {[...Array(3)].map((_, i) => (
            <div key={i} className="h-16 bg-gray-100 rounded-xl" />
          ))}
        </div>
      </div>
    );
  }

  const recentNotifications = notifications.slice(0, 5);

  const getTypeIcon = (type: AlertType) => {
    switch (type) {
      case 'price_above':
      case 'price_below':
        return '📈';
      case 'price_change':
        return '📊';
      case 'volume_spike':
        return '📢';
      case 'portfolio_value':
        return '💼';
      case 'allocation_drift':
        return '⚖️';
      case 'health_factor':
        return '🏥';
      case 'liquidation_warning':
        return '⚠️';
      case 'reward_claimable':
        return '🎁';
      default:
        return '🔔';
    }
  };

  return (
    <div className="rounded-2xl border-2 border-gray-200 bg-white p-6">
      <h3 className="mb-4 text-lg font-semibold">Recent Activity</h3>

      {recentNotifications.length === 0 ? (
        <div className="py-8 text-center text-gray-500">
          <div className="text-4xl">🔔</div>
          <div className="mt-2">No recent notifications</div>
        </div>
      ) : (
        <div className="space-y-3">
          {recentNotifications.map((notification) => (
            <div
              key={notification.id}
              className={cn(
                'flex items-start gap-3 rounded-xl p-4 transition-colors',
                notification.read ? 'bg-gray-50' : 'bg-blue-50'
              )}
            >
              <div className="text-2xl">
                {getTypeIcon(notification.type)}
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2">
                  <span className="font-semibold truncate">{notification.alertName}</span>
                  {!notification.read && (
                    <span className="h-2 w-2 rounded-full bg-blue-500" />
                  )}
                </div>
                <div className="text-sm text-gray-600 line-clamp-2">
                  {notification.message}
                </div>
                <div className="mt-1 text-xs text-gray-400">
                  {formatDateTime(notification.timestamp)}
                </div>
              </div>
              {!notification.read && (
                <button
                  onClick={() => onMarkRead(notification.id)}
                  className="rounded-lg px-2 py-1 text-xs text-blue-600 hover:bg-blue-100"
                >
                  Mark read
                </button>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

// ============================================================================
// Quick Create Alert Component
// ============================================================================

interface QuickCreateAlertProps {
  onCreateAlert: (alert: Partial<Alert>) => void;
}

function QuickCreateAlert({ onCreateAlert }: QuickCreateAlertProps) {
  const [symbol, setSymbol] = useState('');
  const [alertType, setAlertType] = useState<'price_above' | 'price_below'>('price_above');
  const [threshold, setThreshold] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!symbol || !threshold) return;

    onCreateAlert({
      type: alertType,
      name: `${symbol.toUpperCase()} ${alertType === 'price_above' ? '>' : '<'} $${threshold}`,
      description: `Alert when ${symbol.toUpperCase()} ${alertType === 'price_above' ? 'goes above' : 'drops below'} $${threshold}`,
      conditions: [
        {
          field: 'price',
          operator: alertType === 'price_above' ? 'gt' : 'lt',
          value: parseFloat(threshold),
          asset: symbol.toUpperCase(),
        },
      ],
      enabled: true,
      channels: [{ type: 'app', enabled: true }],
    });

    setSymbol('');
    setThreshold('');
  };

  return (
    <div className="rounded-2xl border-2 border-gray-200 bg-white p-6">
      <h3 className="mb-4 text-lg font-semibold">Quick Create Alert</h3>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="grid gap-4 sm:grid-cols-3">
          <div>
            <label className="mb-1 block text-sm font-medium">Symbol</label>
            <input
              type="text"
              value={symbol}
              onChange={(e) => setSymbol(e.target.value)}
              placeholder="BTC, ETH, SOL..."
              className="w-full rounded-lg border border-gray-200 px-3 py-2"
            />
          </div>
          <div>
            <label className="mb-1 block text-sm font-medium">Condition</label>
            <select
              value={alertType}
              onChange={(e) => setAlertType(e.target.value as typeof alertType)}
              className="w-full rounded-lg border border-gray-200 px-3 py-2"
            >
              <option value="price_above">Price Above</option>
              <option value="price_below">Price Below</option>
            </select>
          </div>
          <div>
            <label className="mb-1 block text-sm font-medium">Price ($)</label>
            <input
              type="number"
              value={threshold}
              onChange={(e) => setThreshold(e.target.value)}
              placeholder="0.00"
              step="any"
              className="w-full rounded-lg border border-gray-200 px-3 py-2"
            />
          </div>
        </div>
        <button
          type="submit"
          disabled={!symbol || !threshold}
          className="w-full rounded-xl bg-black py-3 font-medium text-white hover:bg-gray-900 disabled:bg-gray-300 disabled:cursor-not-allowed"
        >
          Create Alert
        </button>
      </form>
    </div>
  );
}

// ============================================================================
// Main Page Component
// ============================================================================

export default function AlertsPage() {
  const [activeTab, setActiveTab] = useState<'price' | 'portfolio' | 'notifications' | 'settings'>('price');
  
  const {
    alerts,
    isLoading: alertsLoading,
    error: alertsError,
    createAlert,
    updateAlert,
    deleteAlert,
    refetch: refetchAlerts,
  } = useAlerts();

  const {
    notifications,
    isLoading: notificationsLoading,
    error: notificationsError,
    markAsRead,
    markAllAsRead,
    refetch: refetchNotifications,
  } = useNotifications();

  const handleCreateAlert = useCallback(async (alertData: Partial<Alert>) => {
    try {
      await createAlert(alertData as Omit<Alert, 'id' | 'createdAt' | 'triggerCount'>);
      refetchAlerts();
    } catch (error) {
      console.error('Failed to create alert:', error);
    }
  }, [createAlert, refetchAlerts]);

  const handleUpdateAlert = useCallback(async (id: string, updates: Partial<Alert>) => {
    try {
      await updateAlert(id, updates);
      refetchAlerts();
    } catch (error) {
      console.error('Failed to update alert:', error);
    }
  }, [updateAlert, refetchAlerts]);

  const handleDeleteAlert = useCallback(async (id: string) => {
    try {
      await deleteAlert(id);
      refetchAlerts();
    } catch (error) {
      console.error('Failed to delete alert:', error);
    }
  }, [deleteAlert, refetchAlerts]);

  const handleMarkRead = useCallback(async (id: string) => {
    try {
      await markAsRead(id);
      refetchNotifications();
    } catch (error) {
      console.error('Failed to mark notification as read:', error);
    }
  }, [markAsRead, refetchNotifications]);

  const priceAlerts = alerts.filter(a => 
    ['price_above', 'price_below', 'price_change', 'volume_spike'].includes(a.type)
  );
  
  const portfolioAlerts = alerts.filter(a => 
    ['portfolio_value', 'allocation_drift', 'health_factor', 'liquidation_warning', 'reward_claimable'].includes(a.type)
  );

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold">Alerts & Notifications</h1>
        <p className="mt-2 text-gray-600">
          Stay informed with custom price alerts, portfolio monitoring, and real-time notifications.
        </p>
      </div>

      {/* Stats */}
      <div className="mb-8">
        <AlertStats
          alerts={alerts}
          notifications={notifications}
          isLoading={alertsLoading || notificationsLoading}
        />
      </div>

      {/* Error States */}
      {(alertsError || notificationsError) && (
        <div className="mb-8 rounded-xl bg-red-50 border border-red-200 p-4">
          <div className="font-medium text-red-800">Error loading data</div>
          <div className="text-sm text-red-600">
            {alertsError?.message || notificationsError?.message}
          </div>
          <button
            onClick={() => {
              refetchAlerts();
              refetchNotifications();
            }}
            className="mt-2 text-sm font-medium text-red-700 hover:underline"
          >
            Try again
          </button>
        </div>
      )}

      {/* Quick Create */}
      <div className="mb-8">
        <QuickCreateAlert onCreateAlert={handleCreateAlert} />
      </div>

      {/* Main Content */}
      <div className="grid gap-8 lg:grid-cols-3">
        {/* Alerts Panel - 2 columns */}
        <div className="lg:col-span-2 space-y-6">
          {/* Tabs */}
          <div className="flex gap-1 rounded-lg bg-gray-100 p-1">
            {([
              { id: 'price', label: 'Price Alerts' },
              { id: 'portfolio', label: 'Portfolio Alerts' },
              { id: 'notifications', label: 'Notifications' },
              { id: 'settings', label: 'Settings' },
            ] as const).map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={cn(
                  'flex-1 rounded-md px-4 py-2.5 text-sm font-medium transition-all',
                  activeTab === tab.id
                    ? 'bg-white text-black shadow-sm'
                    : 'text-gray-600 hover:text-black'
                )}
              >
                {tab.label}
              </button>
            ))}
          </div>

          {/* Tab Content */}
          {activeTab === 'price' && (
            <PriceAlerts
              alerts={priceAlerts}
              isLoading={alertsLoading}
              onUpdate={handleUpdateAlert}
              onDelete={handleDeleteAlert}
              onCreate={handleCreateAlert}
            />
          )}

          {activeTab === 'portfolio' && (
            <PortfolioAlerts
              alerts={portfolioAlerts}
              isLoading={alertsLoading}
              onUpdate={handleUpdateAlert}
              onDelete={handleDeleteAlert}
              onCreate={handleCreateAlert}
            />
          )}

          {activeTab === 'notifications' && (
            <NotificationSystem
              notifications={notifications}
              isLoading={notificationsLoading}
              onMarkRead={handleMarkRead}
              onMarkAllRead={markAllAsRead}
            />
          )}

          {activeTab === 'settings' && (
            <NotificationSettings />
          )}
        </div>

        {/* Sidebar */}
        <div>
          <RecentActivity
            notifications={notifications}
            onMarkRead={handleMarkRead}
            isLoading={notificationsLoading}
          />
        </div>
      </div>
    </div>
  );
}

// ============================================================================
// Notification Settings Component
// ============================================================================

function NotificationSettings() {
  const [preferences, setPreferences] = useState({
    quietHoursEnabled: false,
    quietHoursStart: '22:00',
    quietHoursEnd: '08:00',
    rateLimitPerHour: 10,
    channels: {
      app: true,
      email: false,
      telegram: false,
      discord: false,
      sms: false,
    },
    emailAddress: '',
    telegramChatId: '',
    discordWebhook: '',
    smsPhone: '',
  });

  const handleSave = async () => {
    // Save preferences to API
    console.log('Saving preferences:', preferences);
  };

  return (
    <div className="space-y-6">
      {/* Notification Channels */}
      <div className="rounded-2xl border-2 border-gray-200 bg-white p-6">
        <h3 className="mb-4 text-lg font-semibold">Notification Channels</h3>
        <div className="space-y-4">
          {/* App Notifications */}
          <div className="flex items-center justify-between">
            <div>
              <div className="font-medium">In-App Notifications</div>
              <div className="text-sm text-gray-500">Receive notifications in the app</div>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                checked={preferences.channels.app}
                onChange={(e) => setPreferences({
                  ...preferences,
                  channels: { ...preferences.channels, app: e.target.checked }
                })}
                className="sr-only peer"
              />
              <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
            </label>
          </div>

          {/* Email */}
          <div className="border-t border-gray-100 pt-4">
            <div className="flex items-center justify-between mb-2">
              <div>
                <div className="font-medium">Email Notifications</div>
                <div className="text-sm text-gray-500">Receive alerts via email</div>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  checked={preferences.channels.email}
                  onChange={(e) => setPreferences({
                    ...preferences,
                    channels: { ...preferences.channels, email: e.target.checked }
                  })}
                  className="sr-only peer"
                />
                <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
              </label>
            </div>
            {preferences.channels.email && (
              <input
                type="email"
                value={preferences.emailAddress}
                onChange={(e) => setPreferences({ ...preferences, emailAddress: e.target.value })}
                placeholder="your@email.com"
                className="w-full rounded-lg border border-gray-200 px-3 py-2 text-sm"
              />
            )}
          </div>

          {/* Telegram */}
          <div className="border-t border-gray-100 pt-4">
            <div className="flex items-center justify-between mb-2">
              <div>
                <div className="font-medium">Telegram</div>
                <div className="text-sm text-gray-500">Receive alerts via Telegram bot</div>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  checked={preferences.channels.telegram}
                  onChange={(e) => setPreferences({
                    ...preferences,
                    channels: { ...preferences.channels, telegram: e.target.checked }
                  })}
                  className="sr-only peer"
                />
                <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
              </label>
            </div>
            {preferences.channels.telegram && (
              <input
                type="text"
                value={preferences.telegramChatId}
                onChange={(e) => setPreferences({ ...preferences, telegramChatId: e.target.value })}
                placeholder="Chat ID"
                className="w-full rounded-lg border border-gray-200 px-3 py-2 text-sm"
              />
            )}
          </div>

          {/* Discord */}
          <div className="border-t border-gray-100 pt-4">
            <div className="flex items-center justify-between mb-2">
              <div>
                <div className="font-medium">Discord</div>
                <div className="text-sm text-gray-500">Receive alerts via Discord webhook</div>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  checked={preferences.channels.discord}
                  onChange={(e) => setPreferences({
                    ...preferences,
                    channels: { ...preferences.channels, discord: e.target.checked }
                  })}
                  className="sr-only peer"
                />
                <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
              </label>
            </div>
            {preferences.channels.discord && (
              <input
                type="text"
                value={preferences.discordWebhook}
                onChange={(e) => setPreferences({ ...preferences, discordWebhook: e.target.value })}
                placeholder="Webhook URL"
                className="w-full rounded-lg border border-gray-200 px-3 py-2 text-sm"
              />
            )}
          </div>
        </div>
      </div>

      {/* Quiet Hours */}
      <div className="rounded-2xl border-2 border-gray-200 bg-white p-6">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h3 className="text-lg font-semibold">Quiet Hours</h3>
            <p className="text-sm text-gray-500">Pause notifications during specific hours</p>
          </div>
          <label className="relative inline-flex items-center cursor-pointer">
            <input
              type="checkbox"
              checked={preferences.quietHoursEnabled}
              onChange={(e) => setPreferences({ ...preferences, quietHoursEnabled: e.target.checked })}
              className="sr-only peer"
            />
            <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
          </label>
        </div>

        {preferences.quietHoursEnabled && (
          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <label className="mb-1 block text-sm font-medium">Start Time</label>
              <input
                type="time"
                value={preferences.quietHoursStart}
                onChange={(e) => setPreferences({ ...preferences, quietHoursStart: e.target.value })}
                className="w-full rounded-lg border border-gray-200 px-3 py-2"
              />
            </div>
            <div>
              <label className="mb-1 block text-sm font-medium">End Time</label>
              <input
                type="time"
                value={preferences.quietHoursEnd}
                onChange={(e) => setPreferences({ ...preferences, quietHoursEnd: e.target.value })}
                className="w-full rounded-lg border border-gray-200 px-3 py-2"
              />
            </div>
          </div>
        )}
      </div>

      {/* Rate Limiting */}
      <div className="rounded-2xl border-2 border-gray-200 bg-white p-6">
        <h3 className="mb-4 text-lg font-semibold">Rate Limiting</h3>
        <div>
          <label className="mb-1 block text-sm font-medium">
            Max notifications per hour: {preferences.rateLimitPerHour}
          </label>
          <input
            type="range"
            min="1"
            max="50"
            value={preferences.rateLimitPerHour}
            onChange={(e) => setPreferences({ ...preferences, rateLimitPerHour: parseInt(e.target.value) })}
            className="w-full"
          />
          <div className="flex justify-between text-xs text-gray-500">
            <span>1</span>
            <span>50</span>
          </div>
        </div>
      </div>

      {/* Save Button */}
      <button
        onClick={handleSave}
        className="w-full rounded-xl bg-black py-3 font-medium text-white hover:bg-gray-900"
      >
        Save Settings
      </button>
    </div>
  );
}
