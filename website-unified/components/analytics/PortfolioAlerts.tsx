'use client';

/**
 * Portfolio Alerts Component
 * 
 * Monitor portfolio value, allocation drift, health factors,
 * liquidation risks, and claimable rewards.
 */

import React, { useState, useMemo } from 'react';
import { cn } from '@/lib/utils/cn';
import type { Alert, AlertType, NotificationChannel } from '@/lib/analytics/types';
import { formatCurrency, formatDateTime, formatPercentage } from '@/lib/analytics/hooks';

// ============================================================================
// Types
// ============================================================================

interface PortfolioAlertsProps {
  alerts: Alert[];
  isLoading: boolean;
  onUpdate: (id: string, updates: Partial<Alert>) => Promise<void>;
  onDelete: (id: string) => Promise<void>;
  onCreate: (alert: Partial<Alert>) => Promise<void>;
  className?: string;
}

// ============================================================================
// Alert Templates
// ============================================================================

interface AlertTemplate {
  type: AlertType;
  name: string;
  description: string;
  icon: string;
  color: string;
  defaultConditions: {
    field: string;
    operator: 'gt' | 'lt' | 'eq' | 'change_pct';
    value: number;
  }[];
  inputLabel: string;
  inputType: 'currency' | 'percentage' | 'number';
  inputDefault: number;
}

const ALERT_TEMPLATES: AlertTemplate[] = [
  {
    type: 'portfolio_value',
    name: 'Portfolio Value Alert',
    description: 'Get notified when your portfolio reaches a target value',
    icon: '💰',
    color: 'bg-green-100 text-green-700',
    defaultConditions: [{ field: 'totalValue', operator: 'gt', value: 0 }],
    inputLabel: 'Target Value ($)',
    inputType: 'currency',
    inputDefault: 100000,
  },
  {
    type: 'allocation_drift',
    name: 'Allocation Drift Alert',
    description: 'Alert when asset allocation drifts from target',
    icon: '⚖️',
    color: 'bg-blue-100 text-blue-700',
    defaultConditions: [{ field: 'allocationDrift', operator: 'gt', value: 5 }],
    inputLabel: 'Drift Threshold (%)',
    inputType: 'percentage',
    inputDefault: 5,
  },
  {
    type: 'health_factor',
    name: 'Health Factor Alert',
    description: 'Monitor DeFi position health factors',
    icon: '🏥',
    color: 'bg-yellow-100 text-yellow-700',
    defaultConditions: [{ field: 'healthFactor', operator: 'lt', value: 1.5 }],
    inputLabel: 'Minimum Health Factor',
    inputType: 'number',
    inputDefault: 1.5,
  },
  {
    type: 'liquidation_warning',
    name: 'Liquidation Warning',
    description: 'Urgent alert for imminent liquidation risk',
    icon: '⚠️',
    color: 'bg-red-100 text-red-700',
    defaultConditions: [{ field: 'healthFactor', operator: 'lt', value: 1.1 }],
    inputLabel: 'Warning Threshold',
    inputType: 'number',
    inputDefault: 1.1,
  },
  {
    type: 'reward_claimable',
    name: 'Claimable Rewards Alert',
    description: 'Notify when rewards reach claimable threshold',
    icon: '🎁',
    color: 'bg-purple-100 text-purple-700',
    defaultConditions: [{ field: 'unclaimedRewards', operator: 'gt', value: 100 }],
    inputLabel: 'Minimum Reward Value ($)',
    inputType: 'currency',
    inputDefault: 100,
  },
];

// ============================================================================
// Create Alert Form Component
// ============================================================================

interface CreateAlertFormProps {
  template: AlertTemplate;
  onCreate: (alert: Partial<Alert>) => void;
  onCancel: () => void;
}

function CreateAlertForm({ template, onCreate, onCancel }: CreateAlertFormProps) {
  const [value, setValue] = useState(template.inputDefault.toString());
  const [channels, setChannels] = useState({
    app: true,
    email: false,
    telegram: false,
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    const numValue = parseFloat(value);
    if (isNaN(numValue)) return;

    const notificationChannels: NotificationChannel[] = [];
    if (channels.app) notificationChannels.push({ type: 'app', enabled: true });
    if (channels.email) notificationChannels.push({ type: 'email', address: '', enabled: true });
    if (channels.telegram) notificationChannels.push({ type: 'telegram', chatId: '', enabled: true });

    onCreate({
      type: template.type,
      name: template.name,
      description: `${template.description} (${
        template.inputType === 'currency' ? formatCurrency(numValue) :
        template.inputType === 'percentage' ? `${numValue}%` :
        numValue
      })`,
      conditions: template.defaultConditions.map(c => ({
        ...c,
        value: numValue,
      })),
      enabled: true,
      channels: notificationChannels,
    });
  };

  return (
    <form onSubmit={handleSubmit} className="rounded-xl border-2 border-gray-200 bg-white p-4 space-y-4">
      <div className="flex items-center gap-3">
        <div className={cn('flex h-10 w-10 items-center justify-center rounded-lg text-lg', template.color)}>
          {template.icon}
        </div>
        <div>
          <div className="font-semibold">{template.name}</div>
          <div className="text-sm text-gray-500">{template.description}</div>
        </div>
      </div>

      <div>
        <label className="mb-1 block text-sm font-medium">{template.inputLabel}</label>
        <div className="relative">
          {template.inputType === 'currency' && (
            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500">$</span>
          )}
          <input
            type="number"
            value={value}
            onChange={(e) => setValue(e.target.value)}
            step={template.inputType === 'number' ? '0.1' : '1'}
            className={cn(
              'w-full rounded-lg border border-gray-200 py-2 pr-4',
              template.inputType === 'currency' ? 'pl-8' : 'pl-4'
            )}
          />
          {template.inputType === 'percentage' && (
            <span className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500">%</span>
          )}
        </div>
      </div>

      <div>
        <label className="mb-1 block text-sm font-medium">Notify via</label>
        <div className="flex gap-2">
          {Object.entries(channels).map(([channel, enabled]) => (
            <button
              key={channel}
              type="button"
              onClick={() => setChannels({ ...channels, [channel]: !enabled })}
              className={cn(
                'rounded-full px-3 py-1 text-sm font-medium capitalize transition-all',
                enabled ? 'bg-black text-white' : 'bg-gray-100 text-gray-600'
              )}
            >
              {channel}
            </button>
          ))}
        </div>
      </div>

      <div className="flex gap-2">
        <button
          type="button"
          onClick={onCancel}
          className="flex-1 rounded-lg border border-gray-200 py-2 font-medium hover:bg-gray-50"
        >
          Cancel
        </button>
        <button
          type="submit"
          className="flex-1 rounded-lg bg-black py-2 font-medium text-white hover:bg-gray-900"
        >
          Create Alert
        </button>
      </div>
    </form>
  );
}

// ============================================================================
// Alert Card Component
// ============================================================================

interface AlertCardProps {
  alert: Alert;
  template: AlertTemplate | undefined;
  onToggle: (enabled: boolean) => void;
  onDelete: () => void;
}

function AlertCard({ alert, template, onToggle, onDelete }: AlertCardProps) {
  return (
    <div className={cn(
      'rounded-xl border-2 p-4 transition-all',
      alert.enabled ? 'border-gray-200 bg-white' : 'border-gray-100 bg-gray-50 opacity-60'
    )}>
      <div className="flex items-start justify-between gap-4">
        <div className="flex items-start gap-3 flex-1 min-w-0">
          <div className={cn(
            'flex h-10 w-10 items-center justify-center rounded-lg text-lg',
            template?.color || 'bg-gray-100 text-gray-700'
          )}>
            {template?.icon || '🔔'}
          </div>
          <div className="flex-1 min-w-0">
            <div className="font-semibold truncate">{alert.name}</div>
            <div className="text-sm text-gray-500 line-clamp-2">{alert.description}</div>
            <div className="mt-2 flex flex-wrap items-center gap-2">
              {alert.conditions.map((condition, i) => (
                <span key={i} className="rounded-full bg-gray-100 px-2 py-0.5 text-xs">
                  {condition.field} {condition.operator} {condition.value}
                </span>
              ))}
              {alert.lastTriggered && (
                <span className="text-xs text-gray-400">
                  Triggered: {formatDateTime(alert.lastTriggered)}
                </span>
              )}
            </div>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <label className="relative inline-flex items-center cursor-pointer">
            <input
              type="checkbox"
              checked={alert.enabled}
              onChange={(e) => onToggle(e.target.checked)}
              className="sr-only peer"
            />
            <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-green-500"></div>
          </label>
          <button
            onClick={onDelete}
            className="rounded-lg p-2 text-gray-400 hover:bg-red-50 hover:text-red-600"
          >
            <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
            </svg>
          </button>
        </div>
      </div>
    </div>
  );
}

// ============================================================================
// Main Component
// ============================================================================

export function PortfolioAlerts({
  alerts,
  isLoading,
  onUpdate,
  onDelete,
  onCreate,
  className,
}: PortfolioAlertsProps) {
  const [selectedTemplate, setSelectedTemplate] = useState<AlertTemplate | null>(null);

  const getTemplateForAlert = (alert: Alert) => {
    return ALERT_TEMPLATES.find(t => t.type === alert.type);
  };

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
    <div className={cn('space-y-6', className)}>
      {/* Alert Templates */}
      <div className="rounded-2xl border-2 border-gray-200 bg-white p-6">
        <h3 className="mb-4 text-lg font-semibold">Portfolio Alert Types</h3>
        <div className="grid gap-3 sm:grid-cols-2">
          {ALERT_TEMPLATES.map((template) => {
            const existingAlert = alerts.find(a => a.type === template.type);
            
            return (
              <button
                key={template.type}
                onClick={() => !existingAlert && setSelectedTemplate(template)}
                disabled={!!existingAlert}
                className={cn(
                  'flex items-center gap-3 rounded-xl border-2 p-4 text-left transition-all',
                  existingAlert
                    ? 'border-green-200 bg-green-50 cursor-default'
                    : 'border-gray-200 hover:border-gray-300 hover:bg-gray-50'
                )}
              >
                <div className={cn('flex h-10 w-10 items-center justify-center rounded-lg text-lg', template.color)}>
                  {template.icon}
                </div>
                <div className="flex-1">
                  <div className="font-medium">{template.name}</div>
                  <div className="text-xs text-gray-500">{template.description}</div>
                </div>
                {existingAlert ? (
                  <span className="rounded-full bg-green-200 px-2 py-0.5 text-xs font-medium text-green-700">
                    Active
                  </span>
                ) : (
                  <span className="text-gray-400">+</span>
                )}
              </button>
            );
          })}
        </div>
      </div>

      {/* Create Form */}
      {selectedTemplate && (
        <CreateAlertForm
          template={selectedTemplate}
          onCreate={(alert) => {
            onCreate(alert);
            setSelectedTemplate(null);
          }}
          onCancel={() => setSelectedTemplate(null)}
        />
      )}

      {/* Active Alerts */}
      {alerts.length > 0 && (
        <div className="space-y-4">
          <h3 className="text-lg font-semibold">Active Portfolio Alerts</h3>
          {alerts.map((alert) => (
            <AlertCard
              key={alert.id}
              alert={alert}
              template={getTemplateForAlert(alert)}
              onToggle={(enabled) => onUpdate(alert.id, { enabled })}
              onDelete={() => onDelete(alert.id)}
            />
          ))}
        </div>
      )}

      {alerts.length === 0 && !selectedTemplate && (
        <div className="rounded-2xl border-2 border-dashed border-gray-200 py-8 text-center">
          <div className="text-4xl">💼</div>
          <div className="mt-2 font-medium">No portfolio alerts configured</div>
          <div className="mt-1 text-sm text-gray-500">
            Select an alert type above to get started
          </div>
        </div>
      )}
    </div>
  );
}

export default PortfolioAlerts;
