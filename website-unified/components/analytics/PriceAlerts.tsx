'use client';

/**
 * Price Alerts Component
 * 
 * Create and manage price-based alerts for cryptocurrencies
 * with real-time price monitoring.
 */

import React, { useState, useMemo, useCallback } from 'react';
import { cn } from '@/lib/utils/cn';
import type { Alert, AlertType, NotificationChannel } from '@/lib/analytics/types';
import { formatCurrency, formatDateTime } from '@/lib/analytics/hooks';
import { searchTokens } from '@/lib/analytics/api';

// ============================================================================
// Types
// ============================================================================

interface PriceAlertsProps {
  alerts: Alert[];
  isLoading: boolean;
  onUpdate: (id: string, updates: Partial<Alert>) => Promise<void>;
  onDelete: (id: string) => Promise<void>;
  onCreate: (alert: Partial<Alert>) => Promise<void>;
  className?: string;
}

interface CreateAlertModalProps {
  isOpen: boolean;
  onClose: () => void;
  onCreate: (alert: Partial<Alert>) => void;
}

// ============================================================================
// Create Alert Modal Component
// ============================================================================

function CreateAlertModal({ isOpen, onClose, onCreate }: CreateAlertModalProps) {
  const [step, setStep] = useState(1);
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState<{ id: string; symbol: string; name: string; price: number }[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [selectedToken, setSelectedToken] = useState<{ id: string; symbol: string; name: string; price: number } | null>(null);
  const [alertType, setAlertType] = useState<'price_above' | 'price_below' | 'price_change' | 'volume_spike'>('price_above');
  const [threshold, setThreshold] = useState('');
  const [channels, setChannels] = useState({
    app: true,
    email: false,
    telegram: false,
    discord: false,
  });

  const handleSearch = useCallback(async (query: string) => {
    setSearchQuery(query);
    if (query.length < 2) {
      setSearchResults([]);
      return;
    }

    setIsSearching(true);
    try {
      const results = await searchTokens(query);
      setSearchResults(results.slice(0, 10).map(t => ({
        id: t.id,
        symbol: t.symbol,
        name: t.name,
        price: t.price,
      })));
    } catch (error) {
      console.error('Search failed:', error);
      setSearchResults([]);
    } finally {
      setIsSearching(false);
    }
  }, []);

  const handleSelectToken = (token: typeof selectedToken) => {
    setSelectedToken(token);
    if (token) {
      // Set default threshold based on current price
      setThreshold(token.price.toString());
    }
    setStep(2);
  };

  const handleCreate = () => {
    if (!selectedToken || !threshold) return;

    const notificationChannels: NotificationChannel[] = [];
    if (channels.app) notificationChannels.push({ type: 'app', enabled: true });
    if (channels.email) notificationChannels.push({ type: 'email', address: '', enabled: true });
    if (channels.telegram) notificationChannels.push({ type: 'telegram', chatId: '', enabled: true });
    if (channels.discord) notificationChannels.push({ type: 'discord', webhookUrl: '', enabled: true });

    const alertDescription = 
      alertType === 'price_above' ? `Alert when ${selectedToken.symbol} goes above $${threshold}` :
      alertType === 'price_below' ? `Alert when ${selectedToken.symbol} drops below $${threshold}` :
      alertType === 'price_change' ? `Alert when ${selectedToken.symbol} changes by ${threshold}%` :
      `Alert when ${selectedToken.symbol} volume spikes by ${threshold}%`;

    onCreate({
      type: alertType,
      name: `${selectedToken.symbol} ${
        alertType === 'price_above' ? '↑' : 
        alertType === 'price_below' ? '↓' : 
        alertType === 'price_change' ? '±' : '📊'
      } ${alertType.includes('price') ? '$' : ''}${threshold}${!alertType.includes('price') || alertType === 'price_change' ? '%' : ''}`,
      description: alertDescription,
      conditions: [{
        field: alertType.includes('volume') ? 'volume24h' : 'price',
        operator: alertType === 'price_above' || alertType === 'volume_spike' ? 'gt' : 
                  alertType === 'price_below' ? 'lt' : 'change_pct',
        value: parseFloat(threshold),
        asset: selectedToken.symbol,
      }],
      enabled: true,
      channels: notificationChannels,
    });

    // Reset and close
    setStep(1);
    setSearchQuery('');
    setSelectedToken(null);
    setThreshold('');
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
      <div className="w-full max-w-lg rounded-2xl bg-white shadow-xl">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-gray-200 p-6">
          <h3 className="text-lg font-semibold">Create Price Alert</h3>
          <button
            onClick={onClose}
            className="rounded-lg p-2 hover:bg-gray-100"
          >
            <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Content */}
        <div className="p-6">
          {step === 1 && (
            <div className="space-y-4">
              <div>
                <label className="mb-2 block text-sm font-medium">Search Token</label>
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => handleSearch(e.target.value)}
                  placeholder="Search by name or symbol..."
                  className="w-full rounded-lg border border-gray-200 px-4 py-3"
                  autoFocus
                />
              </div>

              {isSearching && (
                <div className="py-4 text-center text-gray-500">
                  Searching...
                </div>
              )}

              {searchResults.length > 0 && (
                <div className="max-h-64 overflow-y-auto rounded-lg border border-gray-200">
                  {searchResults.map((token) => (
                    <button
                      key={token.id}
                      onClick={() => handleSelectToken(token)}
                      className="flex w-full items-center justify-between p-3 hover:bg-gray-50"
                    >
                      <div className="flex items-center gap-3">
                        <div className="flex h-8 w-8 items-center justify-center rounded-full bg-gray-100 text-xs font-bold">
                          {token.symbol.slice(0, 2)}
                        </div>
                        <div className="text-left">
                          <div className="font-medium">{token.symbol}</div>
                          <div className="text-sm text-gray-500">{token.name}</div>
                        </div>
                      </div>
                      <div className="font-medium">{formatCurrency(token.price)}</div>
                    </button>
                  ))}
                </div>
              )}
            </div>
          )}

          {step === 2 && selectedToken && (
            <div className="space-y-6">
              {/* Selected Token */}
              <div className="flex items-center gap-4 rounded-xl bg-gray-50 p-4">
                <div className="flex h-12 w-12 items-center justify-center rounded-full bg-gray-200 font-bold">
                  {selectedToken.symbol.slice(0, 2)}
                </div>
                <div>
                  <div className="font-semibold">{selectedToken.symbol}</div>
                  <div className="text-sm text-gray-500">{selectedToken.name}</div>
                </div>
                <div className="ml-auto text-right">
                  <div className="font-bold">{formatCurrency(selectedToken.price)}</div>
                  <div className="text-xs text-gray-500">Current Price</div>
                </div>
              </div>

              {/* Alert Type */}
              <div>
                <label className="mb-2 block text-sm font-medium">Alert Type</label>
                <div className="grid grid-cols-2 gap-2">
                  {[
                    { id: 'price_above', label: 'Price Above', icon: '↑' },
                    { id: 'price_below', label: 'Price Below', icon: '↓' },
                    { id: 'price_change', label: 'Price Change %', icon: '±' },
                    { id: 'volume_spike', label: 'Volume Spike', icon: '📊' },
                  ].map((type) => (
                    <button
                      key={type.id}
                      onClick={() => setAlertType(type.id as typeof alertType)}
                      className={cn(
                        'rounded-lg border-2 p-3 text-left transition-all',
                        alertType === type.id
                          ? 'border-black bg-gray-50'
                          : 'border-gray-200 hover:border-gray-300'
                      )}
                    >
                      <div className="flex items-center gap-2">
                        <span className="text-lg">{type.icon}</span>
                        <span className="font-medium">{type.label}</span>
                      </div>
                    </button>
                  ))}
                </div>
              </div>

              {/* Threshold */}
              <div>
                <label className="mb-2 block text-sm font-medium">
                  {alertType === 'price_change' || alertType === 'volume_spike' ? 'Percentage (%)' : 'Price ($)'}
                </label>
                <div className="relative">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500">
                    {alertType === 'price_change' || alertType === 'volume_spike' ? '%' : '$'}
                  </span>
                  <input
                    type="number"
                    value={threshold}
                    onChange={(e) => setThreshold(e.target.value)}
                    step="any"
                    className="w-full rounded-lg border border-gray-200 py-3 pl-8 pr-4"
                    placeholder="Enter value..."
                  />
                </div>
              </div>

              {/* Notification Channels */}
              <div>
                <label className="mb-2 block text-sm font-medium">Notify via</label>
                <div className="flex flex-wrap gap-2">
                  {Object.entries(channels).map(([channel, enabled]) => (
                    <button
                      key={channel}
                      onClick={() => setChannels({ ...channels, [channel]: !enabled })}
                      className={cn(
                        'rounded-full px-4 py-2 text-sm font-medium capitalize transition-all',
                        enabled
                          ? 'bg-black text-white'
                          : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                      )}
                    >
                      {channel}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="flex gap-3 border-t border-gray-200 p-6">
          {step === 2 && (
            <button
              onClick={() => setStep(1)}
              className="flex-1 rounded-xl border-2 border-gray-200 py-3 font-medium hover:bg-gray-50"
            >
              Back
            </button>
          )}
          <button
            onClick={step === 1 ? onClose : handleCreate}
            disabled={step === 2 && (!threshold || !selectedToken)}
            className={cn(
              'flex-1 rounded-xl py-3 font-medium transition-all',
              step === 2
                ? 'bg-black text-white hover:bg-gray-900 disabled:bg-gray-300 disabled:cursor-not-allowed'
                : 'border-2 border-gray-200 hover:bg-gray-50'
            )}
          >
            {step === 1 ? 'Cancel' : 'Create Alert'}
          </button>
        </div>
      </div>
    </div>
  );
}

// ============================================================================
// Alert Card Component
// ============================================================================

interface AlertCardProps {
  alert: Alert;
  onToggle: (enabled: boolean) => void;
  onDelete: () => void;
  onEdit: () => void;
}

function AlertCard({ alert, onToggle, onDelete, onEdit }: AlertCardProps) {
  const getTypeIcon = (type: AlertType) => {
    switch (type) {
      case 'price_above': return '↑';
      case 'price_below': return '↓';
      case 'price_change': return '±';
      case 'volume_spike': return '📊';
      default: return '🔔';
    }
  };

  const getTypeColor = (type: AlertType) => {
    switch (type) {
      case 'price_above': return 'bg-green-100 text-green-700';
      case 'price_below': return 'bg-red-100 text-red-700';
      case 'price_change': return 'bg-blue-100 text-blue-700';
      case 'volume_spike': return 'bg-purple-100 text-purple-700';
      default: return 'bg-gray-100 text-gray-700';
    }
  };

  return (
    <div className={cn(
      'rounded-xl border-2 p-4 transition-all',
      alert.enabled ? 'border-gray-200 bg-white' : 'border-gray-100 bg-gray-50 opacity-60'
    )}>
      <div className="flex items-start justify-between gap-4">
        <div className="flex items-start gap-3 flex-1 min-w-0">
          <div className={cn(
            'flex h-10 w-10 items-center justify-center rounded-lg text-lg',
            getTypeColor(alert.type)
          )}>
            {getTypeIcon(alert.type)}
          </div>
          <div className="flex-1 min-w-0">
            <div className="font-semibold truncate">{alert.name}</div>
            <div className="text-sm text-gray-500 line-clamp-1">{alert.description}</div>
            <div className="mt-2 flex flex-wrap items-center gap-2">
              <span className={cn(
                'rounded-full px-2 py-0.5 text-xs font-medium',
                getTypeColor(alert.type)
              )}>
                {alert.type.replace(/_/g, ' ')}
              </span>
              {alert.lastTriggered && (
                <span className="text-xs text-gray-400">
                  Last triggered: {formatDateTime(alert.lastTriggered)}
                </span>
              )}
              {alert.triggerCount > 0 && (
                <span className="text-xs text-gray-400">
                  {alert.triggerCount} triggers
                </span>
              )}
            </div>
          </div>
        </div>

        <div className="flex items-center gap-2">
          {/* Toggle */}
          <label className="relative inline-flex items-center cursor-pointer">
            <input
              type="checkbox"
              checked={alert.enabled}
              onChange={(e) => onToggle(e.target.checked)}
              className="sr-only peer"
            />
            <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-green-500"></div>
          </label>

          {/* Menu */}
          <div className="relative group">
            <button className="rounded-lg p-2 hover:bg-gray-100">
              <svg className="h-5 w-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 5v.01M12 12v.01M12 19v.01M12 6a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2z" />
              </svg>
            </button>
            <div className="invisible group-hover:visible absolute right-0 top-full z-10 mt-1 w-32 rounded-lg bg-white py-1 shadow-lg border border-gray-200">
              <button
                onClick={onEdit}
                className="block w-full px-4 py-2 text-left text-sm hover:bg-gray-50"
              >
                Edit
              </button>
              <button
                onClick={onDelete}
                className="block w-full px-4 py-2 text-left text-sm text-red-600 hover:bg-red-50"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// ============================================================================
// Main Component
// ============================================================================

export function PriceAlerts({
  alerts,
  isLoading,
  onUpdate,
  onDelete,
  onCreate,
  className,
}: PriceAlertsProps) {
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [filter, setFilter] = useState<'all' | 'active' | 'triggered'>('all');

  const filteredAlerts = useMemo(() => {
    switch (filter) {
      case 'active':
        return alerts.filter(a => a.enabled);
      case 'triggered':
        return alerts.filter(a => a.triggerCount > 0);
      default:
        return alerts;
    }
  }, [alerts, filter]);

  if (isLoading) {
    return (
      <div className={cn('space-y-4', className)}>
        {[...Array(3)].map((_, i) => (
          <div key={i} className="animate-pulse rounded-xl bg-gray-200 h-24" />
        ))}
      </div>
    );
  }

  return (
    <div className={cn('space-y-4', className)}>
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex gap-1 rounded-lg bg-gray-100 p-1">
          {(['all', 'active', 'triggered'] as const).map((f) => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={cn(
                'rounded-md px-3 py-1.5 text-sm font-medium capitalize transition-all',
                filter === f
                  ? 'bg-white text-black shadow-sm'
                  : 'text-gray-600 hover:text-black'
              )}
            >
              {f}
            </button>
          ))}
        </div>
        <button
          onClick={() => setIsCreateModalOpen(true)}
          className="rounded-lg bg-black px-4 py-2 text-sm font-medium text-white hover:bg-gray-900"
        >
          + New Alert
        </button>
      </div>

      {/* Alerts List */}
      {filteredAlerts.length === 0 ? (
        <div className="rounded-2xl border-2 border-dashed border-gray-200 py-12 text-center">
          <div className="text-4xl">📈</div>
          <div className="mt-2 font-medium">No price alerts</div>
          <div className="mt-1 text-sm text-gray-500">
            Create your first alert to get notified of price changes
          </div>
          <button
            onClick={() => setIsCreateModalOpen(true)}
            className="mt-4 rounded-lg bg-black px-4 py-2 text-sm font-medium text-white hover:bg-gray-900"
          >
            Create Alert
          </button>
        </div>
      ) : (
        <div className="space-y-3">
          {filteredAlerts.map((alert) => (
            <AlertCard
              key={alert.id}
              alert={alert}
              onToggle={(enabled) => onUpdate(alert.id, { enabled })}
              onDelete={() => onDelete(alert.id)}
              onEdit={() => {/* TODO: Implement edit modal */}}
            />
          ))}
        </div>
      )}

      {/* Create Modal */}
      <CreateAlertModal
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
        onCreate={onCreate}
      />
    </div>
  );
}

export default PriceAlerts;
