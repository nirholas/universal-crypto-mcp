/**
 * Payment Alerts Component
 * 
 * Real-time notifications for payment events including
 * low balance, payment failures, subscription renewals,
 * unusual activity, and payout notifications
 * 
 * @author Nich (@nichxbt)
 * @license Apache-2.0
 */

'use client';

import React, { useState, useEffect, useCallback, useRef } from 'react';
import {
  AlertTriangle,
  Bell,
  BellOff,
  Check,
  X,
  DollarSign,
  RefreshCw,
  Shield,
  Clock,
  CreditCard,
  Wallet,
  ChevronRight,
  ChevronDown,
  Settings,
  Volume2,
  VolumeX,
  Loader2,
  AlertCircle,
  ExternalLink
} from 'lucide-react';

// ============================================
// Types
// ============================================

type AlertType = 
  | 'low_balance' 
  | 'payment_failed' 
  | 'subscription_renewal' 
  | 'unusual_activity' 
  | 'payout_ready'
  | 'payout_completed'
  | 'subscription_expiring'
  | 'usage_limit'
  | 'security_warning'
  | 'payment_received';

type AlertSeverity = 'info' | 'warning' | 'error' | 'success' | 'critical';

interface PaymentAlert {
  id: string;
  type: AlertType;
  severity: AlertSeverity;
  title: string;
  message: string;
  timestamp: string;
  read: boolean;
  dismissed: boolean;
  actionUrl?: string;
  actionLabel?: string;
  metadata?: Record<string, unknown>;
  expiresAt?: string;
}

interface AlertPreferences {
  email: boolean;
  push: boolean;
  inApp: boolean;
  sound: boolean;
  lowBalanceThreshold: number;
  usageLimitThreshold: number;
  enabledTypes: AlertType[];
}

interface PaymentAlertsProps {
  compact?: boolean;
  maxAlerts?: number;
  autoRefresh?: boolean;
  refreshInterval?: number;
  onAlertAction?: (alertId: string, action: string) => void;
}

// ============================================
// Alert Configuration
// ============================================

const alertConfig: Record<AlertType, { 
  icon: typeof AlertTriangle; 
  color: string; 
  bgColor: string;
}> = {
  low_balance: { 
    icon: Wallet, 
    color: 'text-yellow-400', 
    bgColor: 'bg-yellow-500/10' 
  },
  payment_failed: { 
    icon: X, 
    color: 'text-red-400', 
    bgColor: 'bg-red-500/10' 
  },
  subscription_renewal: { 
    icon: RefreshCw, 
    color: 'text-blue-400', 
    bgColor: 'bg-blue-500/10' 
  },
  unusual_activity: { 
    icon: Shield, 
    color: 'text-orange-400', 
    bgColor: 'bg-orange-500/10' 
  },
  payout_ready: { 
    icon: DollarSign, 
    color: 'text-green-400', 
    bgColor: 'bg-green-500/10' 
  },
  payout_completed: {
    icon: Check,
    color: 'text-green-400',
    bgColor: 'bg-green-500/10'
  },
  subscription_expiring: { 
    icon: Clock, 
    color: 'text-yellow-400', 
    bgColor: 'bg-yellow-500/10' 
  },
  usage_limit: {
    icon: AlertTriangle,
    color: 'text-orange-400',
    bgColor: 'bg-orange-500/10'
  },
  security_warning: {
    icon: Shield,
    color: 'text-red-400',
    bgColor: 'bg-red-500/10'
  },
  payment_received: { 
    icon: CreditCard, 
    color: 'text-green-400', 
    bgColor: 'bg-green-500/10' 
  },
};

// ============================================
// API Service
// ============================================

class AlertService {
  private baseUrl: string;
  private eventSource: EventSource | null = null;

  constructor(baseUrl: string = '/api/alerts') {
    this.baseUrl = baseUrl;
  }

  async fetchAlerts(filters?: { 
    unreadOnly?: boolean; 
    types?: AlertType[];
    limit?: number;
  }): Promise<PaymentAlert[]> {
    const params = new URLSearchParams();
    if (filters?.unreadOnly) params.append('unreadOnly', 'true');
    if (filters?.types) params.append('types', filters.types.join(','));
    if (filters?.limit) params.append('limit', filters.limit.toString());

    const response = await fetch(`${this.baseUrl}?${params}`, {
      method: 'GET',
      headers: { 'Content-Type': 'application/json' },
      credentials: 'include',
    });

    if (!response.ok) {
      throw new Error(`Failed to fetch alerts: ${response.statusText}`);
    }

    return (await response.json()).data;
  }

  async markAsRead(alertId: string): Promise<void> {
    const response = await fetch(`${this.baseUrl}/${alertId}/read`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      credentials: 'include',
    });

    if (!response.ok) {
      throw new Error(`Failed to mark alert as read: ${response.statusText}`);
    }
  }

  async markAllAsRead(): Promise<void> {
    const response = await fetch(`${this.baseUrl}/read-all`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      credentials: 'include',
    });

    if (!response.ok) {
      throw new Error(`Failed to mark all alerts as read: ${response.statusText}`);
    }
  }

  async dismissAlert(alertId: string): Promise<void> {
    const response = await fetch(`${this.baseUrl}/${alertId}/dismiss`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      credentials: 'include',
    });

    if (!response.ok) {
      throw new Error(`Failed to dismiss alert: ${response.statusText}`);
    }
  }

  async clearAll(): Promise<void> {
    const response = await fetch(`${this.baseUrl}/clear-all`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      credentials: 'include',
    });

    if (!response.ok) {
      throw new Error(`Failed to clear alerts: ${response.statusText}`);
    }
  }

  async getPreferences(): Promise<AlertPreferences> {
    const response = await fetch(`${this.baseUrl}/preferences`, {
      method: 'GET',
      headers: { 'Content-Type': 'application/json' },
      credentials: 'include',
    });

    if (!response.ok) {
      throw new Error(`Failed to fetch preferences: ${response.statusText}`);
    }

    return (await response.json()).data;
  }

  async updatePreferences(preferences: Partial<AlertPreferences>): Promise<AlertPreferences> {
    const response = await fetch(`${this.baseUrl}/preferences`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      credentials: 'include',
      body: JSON.stringify(preferences),
    });

    if (!response.ok) {
      throw new Error(`Failed to update preferences: ${response.statusText}`);
    }

    return (await response.json()).data;
  }

  subscribeToRealtime(onAlert: (alert: PaymentAlert) => void): () => void {
    if (typeof window === 'undefined') return () => {};

    this.eventSource = new EventSource(`${this.baseUrl}/stream`, {
      withCredentials: true,
    });

    this.eventSource.onmessage = (event) => {
      try {
        const alert = JSON.parse(event.data) as PaymentAlert;
        onAlert(alert);
      } catch (err) {
        console.error('Failed to parse alert:', err);
      }
    };

    this.eventSource.onerror = () => {
      this.eventSource?.close();
    };

    return () => {
      this.eventSource?.close();
      this.eventSource = null;
    };
  }
}

const alertService = new AlertService();

// ============================================
// Helper Functions
// ============================================

function formatTimestamp(timestamp: string): string {
  const date = new Date(timestamp);
  const now = new Date();
  const diff = now.getTime() - date.getTime();
  
  const minutes = Math.floor(diff / (1000 * 60));
  const hours = Math.floor(diff / (1000 * 60 * 60));
  const days = Math.floor(diff / (1000 * 60 * 60 * 24));

  if (minutes < 1) return 'Just now';
  if (minutes < 60) return `${minutes}m ago`;
  if (hours < 24) return `${hours}h ago`;
  if (days < 7) return `${days}d ago`;
  
  return date.toLocaleDateString();
}

// ============================================
// Preferences Modal Component
// ============================================

interface PreferencesModalProps {
  isOpen: boolean;
  onClose: () => void;
  preferences: AlertPreferences;
  onUpdate: (preferences: Partial<AlertPreferences>) => Promise<void>;
}

function PreferencesModal({ isOpen, onClose, preferences, onUpdate }: PreferencesModalProps) {
  const [localPrefs, setLocalPrefs] = useState(preferences);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    setLocalPrefs(preferences);
  }, [preferences]);

  const handleSave = async () => {
    setSaving(true);
    try {
      await onUpdate(localPrefs);
      onClose();
    } finally {
      setSaving(false);
    }
  };

  if (!isOpen) return null;

  const alertTypes: { type: AlertType; label: string }[] = [
    { type: 'low_balance', label: 'Low Balance' },
    { type: 'payment_failed', label: 'Payment Failed' },
    { type: 'subscription_renewal', label: 'Subscription Renewal' },
    { type: 'unusual_activity', label: 'Unusual Activity' },
    { type: 'payout_ready', label: 'Payout Ready' },
    { type: 'subscription_expiring', label: 'Subscription Expiring' },
    { type: 'usage_limit', label: 'Usage Limit' },
    { type: 'security_warning', label: 'Security Warning' },
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/60" onClick={onClose} />
      <div className="relative bg-gray-900 rounded-xl border border-gray-800 w-full max-w-md max-h-[90vh] overflow-y-auto">
        <div className="sticky top-0 bg-gray-900 px-6 py-4 border-b border-gray-800 flex items-center justify-between">
          <h2 className="text-lg font-semibold text-white">Alert Preferences</h2>
          <button onClick={onClose} className="text-gray-400 hover:text-white">
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-6 space-y-6">
          {/* Notification Channels */}
          <div>
            <h3 className="text-sm font-medium text-gray-400 mb-3">Notification Channels</h3>
            <div className="space-y-3">
              {[
                { key: 'email' as const, label: 'Email Notifications' },
                { key: 'push' as const, label: 'Push Notifications' },
                { key: 'inApp' as const, label: 'In-App Notifications' },
                { key: 'sound' as const, label: 'Sound Alerts' },
              ].map(({ key, label }) => (
                <label key={key} className="flex items-center justify-between">
                  <span className="text-white">{label}</span>
                  <button
                    onClick={() => setLocalPrefs({ ...localPrefs, [key]: !localPrefs[key] })}
                    className={`relative w-11 h-6 rounded-full transition-colors ${
                      localPrefs[key] ? 'bg-blue-500' : 'bg-gray-700'
                    }`}
                  >
                    <span
                      className={`absolute top-1 w-4 h-4 rounded-full bg-white transition-transform ${
                        localPrefs[key] ? 'left-6' : 'left-1'
                      }`}
                    />
                  </button>
                </label>
              ))}
            </div>
          </div>

          {/* Thresholds */}
          <div>
            <h3 className="text-sm font-medium text-gray-400 mb-3">Thresholds</h3>
            <div className="space-y-4">
              <div>
                <label className="block text-sm text-gray-300 mb-1">Low Balance Alert ($)</label>
                <input
                  type="number"
                  value={localPrefs.lowBalanceThreshold}
                  onChange={(e) => setLocalPrefs({ 
                    ...localPrefs, 
                    lowBalanceThreshold: parseFloat(e.target.value) || 0 
                  })}
                  className="w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white focus:outline-none focus:border-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm text-gray-300 mb-1">Usage Limit Alert (%)</label>
                <input
                  type="number"
                  min="0"
                  max="100"
                  value={localPrefs.usageLimitThreshold}
                  onChange={(e) => setLocalPrefs({ 
                    ...localPrefs, 
                    usageLimitThreshold: Math.min(100, Math.max(0, parseInt(e.target.value) || 0))
                  })}
                  className="w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white focus:outline-none focus:border-blue-500"
                />
              </div>
            </div>
          </div>

          {/* Alert Types */}
          <div>
            <h3 className="text-sm font-medium text-gray-400 mb-3">Alert Types</h3>
            <div className="space-y-2">
              {alertTypes.map(({ type, label }) => (
                <label key={type} className="flex items-center justify-between py-2">
                  <span className="text-white">{label}</span>
                  <button
                    onClick={() => {
                      const enabled = localPrefs.enabledTypes.includes(type);
                      setLocalPrefs({
                        ...localPrefs,
                        enabledTypes: enabled
                          ? localPrefs.enabledTypes.filter(t => t !== type)
                          : [...localPrefs.enabledTypes, type],
                      });
                    }}
                    className={`relative w-11 h-6 rounded-full transition-colors ${
                      localPrefs.enabledTypes.includes(type) ? 'bg-blue-500' : 'bg-gray-700'
                    }`}
                  >
                    <span
                      className={`absolute top-1 w-4 h-4 rounded-full bg-white transition-transform ${
                        localPrefs.enabledTypes.includes(type) ? 'left-6' : 'left-1'
                      }`}
                    />
                  </button>
                </label>
              ))}
            </div>
          </div>
        </div>

        <div className="sticky bottom-0 bg-gray-900 px-6 py-4 border-t border-gray-800 flex justify-end gap-3">
          <button
            onClick={onClose}
            className="px-4 py-2 text-gray-400 hover:text-white transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={handleSave}
            disabled={saving}
            className="px-4 py-2 bg-blue-500 hover:bg-blue-600 disabled:bg-blue-500/50 text-white rounded-lg transition-colors"
          >
            {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : 'Save Preferences'}
          </button>
        </div>
      </div>
    </div>
  );
}

// ============================================
// Component
// ============================================

export function PaymentAlerts({ 
  compact = false, 
  maxAlerts = 5,
  autoRefresh = true,
  refreshInterval = 30000,
  onAlertAction
}: PaymentAlertsProps) {
  const [alerts, setAlerts] = useState<PaymentAlert[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showAll, setShowAll] = useState(false);
  const [notificationsEnabled, setNotificationsEnabled] = useState(true);
  const [soundEnabled, setSoundEnabled] = useState(true);
  const [preferences, setPreferences] = useState<AlertPreferences | null>(null);
  const [showPreferences, setShowPreferences] = useState(false);
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  // Fetch alerts
  const fetchAlerts = useCallback(async () => {
    try {
      setError(null);
      const data = await alertService.fetchAlerts({ limit: maxAlerts * 2 });
      setAlerts(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load alerts');
    } finally {
      setLoading(false);
    }
  }, [maxAlerts]);

  // Fetch preferences
  const fetchPreferences = useCallback(async () => {
    try {
      const prefs = await alertService.getPreferences();
      setPreferences(prefs);
      setSoundEnabled(prefs.sound);
      setNotificationsEnabled(prefs.inApp);
    } catch (err) {
      console.error('Failed to fetch preferences:', err);
    }
  }, []);

  // Initial fetch
  useEffect(() => {
    fetchAlerts();
    fetchPreferences();
  }, [fetchAlerts, fetchPreferences]);

  // Auto-refresh
  useEffect(() => {
    if (!autoRefresh) return;

    const interval = setInterval(fetchAlerts, refreshInterval);
    return () => clearInterval(interval);
  }, [autoRefresh, refreshInterval, fetchAlerts]);

  // Real-time subscription
  useEffect(() => {
    const unsubscribe = alertService.subscribeToRealtime((newAlert) => {
      setAlerts(prev => [newAlert, ...prev].slice(0, maxAlerts * 2));
      
      // Play sound for critical/warning alerts
      if (soundEnabled && (newAlert.severity === 'critical' || newAlert.severity === 'error')) {
        audioRef.current?.play().catch(() => {});
      }
    });

    return unsubscribe;
  }, [maxAlerts, soundEnabled]);

  const unreadCount = alerts.filter(a => !a.read).length;
  const displayedAlerts = showAll ? alerts : alerts.slice(0, maxAlerts);

  // Mark alert as read
  const markAsRead = async (alertId: string) => {
    try {
      await alertService.markAsRead(alertId);
      setAlerts(prev => 
        prev.map(a => a.id === alertId ? { ...a, read: true } : a)
      );
    } catch (err) {
      console.error('Failed to mark as read:', err);
    }
  };

  // Mark all as read
  const markAllAsRead = async () => {
    try {
      await alertService.markAllAsRead();
      setAlerts(prev => prev.map(a => ({ ...a, read: true })));
    } catch (err) {
      console.error('Failed to mark all as read:', err);
    }
  };

  // Dismiss alert
  const dismissAlert = async (alertId: string) => {
    try {
      await alertService.dismissAlert(alertId);
      setAlerts(prev => prev.filter(a => a.id !== alertId));
    } catch (err) {
      console.error('Failed to dismiss:', err);
    }
  };

  // Clear all
  const clearAll = async () => {
    try {
      await alertService.clearAll();
      setAlerts([]);
    } catch (err) {
      console.error('Failed to clear all:', err);
    }
  };

  // Update preferences
  const handleUpdatePreferences = async (newPrefs: Partial<AlertPreferences>) => {
    try {
      const updated = await alertService.updatePreferences(newPrefs);
      setPreferences(updated);
      setSoundEnabled(updated.sound);
      setNotificationsEnabled(updated.inApp);
    } catch (err) {
      console.error('Failed to update preferences:', err);
    }
  };

  // Compact view for dashboard widget
  if (compact) {
    if (loading) {
      return (
        <div className="bg-gray-900 rounded-xl border border-gray-800 p-6">
          <div className="flex items-center justify-center py-8">
            <Loader2 className="w-6 h-6 animate-spin text-blue-500" />
          </div>
        </div>
      );
    }

    const recentAlerts = alerts.filter(a => !a.read).slice(0, 3);

    if (recentAlerts.length === 0) {
      return (
        <div className="bg-gray-900 rounded-xl border border-gray-800 p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-white flex items-center gap-2">
              <Bell className="w-5 h-5 text-gray-400" />
              Alerts
            </h3>
          </div>
          <div className="text-center py-8">
            <Check className="w-12 h-12 text-green-500 mx-auto mb-3" />
            <p className="text-gray-400">All caught up!</p>
            <p className="text-gray-500 text-sm">No new alerts</p>
          </div>
        </div>
      );
    }

    return (
      <div className="bg-gray-900 rounded-xl border border-gray-800 p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-white flex items-center gap-2">
            <Bell className="w-5 h-5 text-gray-400" />
            Alerts
            {unreadCount > 0 && (
              <span className="px-2 py-0.5 bg-red-500 text-white text-xs rounded-full">
                {unreadCount}
              </span>
            )}
          </h3>
          <button 
            onClick={markAllAsRead}
            className="text-blue-400 hover:text-blue-300 text-sm transition-colors"
          >
            Mark all read
          </button>
        </div>

        <div className="space-y-3">
          {recentAlerts.map((alert) => {
            const config = alertConfig[alert.type];
            const Icon = config.icon;

            return (
              <div
                key={alert.id}
                className={`flex items-start gap-3 p-3 rounded-lg ${config.bgColor} cursor-pointer`}
                onClick={() => {
                  markAsRead(alert.id);
                  if (alert.actionUrl) {
                    onAlertAction?.(alert.id, 'navigate');
                  }
                }}
              >
                <Icon className={`w-5 h-5 ${config.color} flex-shrink-0 mt-0.5`} />
                <div className="flex-1 min-w-0">
                  <div className="text-white font-medium text-sm">{alert.title}</div>
                  <div className="text-gray-400 text-xs truncate">{alert.message}</div>
                </div>
                <span className="text-gray-500 text-xs flex-shrink-0">
                  {formatTimestamp(alert.timestamp)}
                </span>
              </div>
            );
          })}
        </div>

        {alerts.length > 3 && (
          <button className="w-full mt-4 text-center text-blue-400 hover:text-blue-300 text-sm transition-colors flex items-center justify-center gap-1">
            View all alerts
            <ChevronRight className="w-4 h-4" />
          </button>
        )}
      </div>
    );
  }

  // Full view
  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-semibold text-white flex items-center gap-3">
          <Bell className="w-6 h-6 text-gray-400" />
          Payment Alerts
          {unreadCount > 0 && (
            <span className="px-2.5 py-0.5 bg-red-500 text-white text-sm rounded-full">
              {unreadCount} new
            </span>
          )}
        </h2>
        <div className="flex items-center gap-3">
          <button
            onClick={() => setSoundEnabled(!soundEnabled)}
            className={`p-2 rounded-lg transition-colors ${
              soundEnabled 
                ? 'bg-blue-500/20 text-blue-400' 
                : 'bg-gray-800 text-gray-400'
            }`}
            title={soundEnabled ? 'Sound enabled' : 'Sound disabled'}
          >
            {soundEnabled ? <Volume2 className="w-5 h-5" /> : <VolumeX className="w-5 h-5" />}
          </button>
          <button
            onClick={() => setNotificationsEnabled(!notificationsEnabled)}
            className={`p-2 rounded-lg transition-colors ${
              notificationsEnabled 
                ? 'bg-blue-500/20 text-blue-400' 
                : 'bg-gray-800 text-gray-400'
            }`}
            title={notificationsEnabled ? 'Notifications enabled' : 'Notifications disabled'}
          >
            {notificationsEnabled ? <Bell className="w-5 h-5" /> : <BellOff className="w-5 h-5" />}
          </button>
          <button 
            onClick={() => setShowPreferences(true)}
            className="p-2 bg-gray-800 text-gray-400 hover:text-white rounded-lg transition-colors"
          >
            <Settings className="w-5 h-5" />
          </button>
          <button
            onClick={fetchAlerts}
            disabled={loading}
            className="p-2 bg-gray-800 text-gray-400 hover:text-white rounded-lg transition-colors disabled:opacity-50"
          >
            <RefreshCw className={`w-5 h-5 ${loading ? 'animate-spin' : ''}`} />
          </button>
        </div>
      </div>

      {/* Error state */}
      {error && (
        <div className="bg-red-500/10 border border-red-500/30 rounded-lg p-4 flex items-center gap-3">
          <AlertCircle className="w-5 h-5 text-red-500" />
          <span className="text-red-400">{error}</span>
          <button 
            onClick={fetchAlerts}
            className="ml-auto text-red-400 hover:text-red-300"
          >
            Retry
          </button>
        </div>
      )}

      {/* Actions Bar */}
      {alerts.length > 0 && (
        <div className="flex items-center justify-between">
          <div className="text-gray-400 text-sm">
            {alerts.length} alert{alerts.length !== 1 ? 's' : ''} · {unreadCount} unread
          </div>
          <div className="flex items-center gap-4">
            {unreadCount > 0 && (
              <button
                onClick={markAllAsRead}
                className="text-blue-400 hover:text-blue-300 text-sm transition-colors"
              >
                Mark all as read
              </button>
            )}
            <button
              onClick={clearAll}
              className="text-gray-400 hover:text-red-400 text-sm transition-colors"
            >
              Clear all
            </button>
          </div>
        </div>
      )}

      {/* Loading state */}
      {loading ? (
        <div className="bg-gray-900 rounded-xl border border-gray-800 p-12 text-center">
          <Loader2 className="w-8 h-8 animate-spin text-blue-500 mx-auto" />
        </div>
      ) : alerts.length === 0 ? (
        <div className="bg-gray-900 rounded-xl border border-gray-800 p-12 text-center">
          <Check className="w-16 h-16 text-green-500 mx-auto mb-4" />
          <h3 className="text-xl font-semibold text-white mb-2">All caught up!</h3>
          <p className="text-gray-400">You have no payment alerts at this time.</p>
        </div>
      ) : (
        <div className="space-y-3">
          {displayedAlerts.map((alert) => {
            const config = alertConfig[alert.type];
            const Icon = config.icon;
            const isExpanded = expandedId === alert.id;

            return (
              <div
                key={alert.id}
                className={`bg-gray-900 rounded-xl border ${
                  alert.read ? 'border-gray-800' : 'border-gray-700'
                } overflow-hidden transition-all hover:border-gray-600`}
              >
                <button
                  onClick={() => {
                    if (!alert.read) markAsRead(alert.id);
                    setExpandedId(isExpanded ? null : alert.id);
                  }}
                  className="w-full p-4 flex items-start gap-4 text-left"
                >
                  {/* Icon */}
                  <div className={`p-2 rounded-lg ${config.bgColor} flex-shrink-0`}>
                    <Icon className={`w-5 h-5 ${config.color}`} />
                  </div>

                  {/* Content */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-4">
                      <div>
                        <h4 className={`font-medium ${alert.read ? 'text-gray-300' : 'text-white'}`}>
                          {alert.title}
                          {!alert.read && (
                            <span className="ml-2 inline-block w-2 h-2 bg-blue-500 rounded-full" />
                          )}
                        </h4>
                        <p className="text-gray-400 text-sm mt-1 line-clamp-2">{alert.message}</p>
                      </div>
                      <div className="flex items-center gap-2 flex-shrink-0">
                        <span className="text-gray-500 text-sm">
                          {formatTimestamp(alert.timestamp)}
                        </span>
                        {isExpanded ? (
                          <ChevronDown className="w-4 h-4 text-gray-400" />
                        ) : (
                          <ChevronRight className="w-4 h-4 text-gray-400" />
                        )}
                      </div>
                    </div>
                  </div>
                </button>

                {/* Expanded content */}
                {isExpanded && (
                  <div className="px-4 pb-4 pt-2 border-t border-gray-800">
                    {alert.metadata && (
                      <div className="text-sm text-gray-400 mb-3 space-y-1">
                        {Object.entries(alert.metadata).map(([key, value]) => (
                          <div key={key} className="flex items-center justify-between">
                            <span className="capitalize">{key.replace(/_/g, ' ')}</span>
                            <span className="text-white">{String(value)}</span>
                          </div>
                        ))}
                      </div>
                    )}
                    <div className="flex items-center gap-4">
                      {alert.actionUrl && (
                        <a
                          href={alert.actionUrl}
                          onClick={() => onAlertAction?.(alert.id, 'navigate')}
                          className="text-blue-400 hover:text-blue-300 text-sm transition-colors flex items-center gap-1"
                        >
                          {alert.actionLabel || 'View'}
                          <ExternalLink className="w-3 h-3" />
                        </a>
                      )}
                      {!alert.read && (
                        <button
                          onClick={() => markAsRead(alert.id)}
                          className="text-gray-400 hover:text-white text-sm transition-colors"
                        >
                          Mark as read
                        </button>
                      )}
                      <button
                        onClick={() => dismissAlert(alert.id)}
                        className="text-gray-400 hover:text-red-400 text-sm transition-colors"
                      >
                        Dismiss
                      </button>
                    </div>
                  </div>
                )}
              </div>
            );
          })}

          {/* Show More */}
          {!showAll && alerts.length > maxAlerts && (
            <button
              onClick={() => setShowAll(true)}
              className="w-full py-3 text-center text-blue-400 hover:text-blue-300 transition-colors"
            >
              Show {alerts.length - maxAlerts} more alerts
            </button>
          )}
        </div>
      )}

      {/* Preferences Modal */}
      {preferences && (
        <PreferencesModal
          isOpen={showPreferences}
          onClose={() => setShowPreferences(false)}
          preferences={preferences}
          onUpdate={handleUpdatePreferences}
        />
      )}

      {/* Audio element for notifications */}
      <audio ref={audioRef} preload="auto">
        <source src="/sounds/notification.mp3" type="audio/mpeg" />
      </audio>
    </div>
  );
}

export default PaymentAlerts;
