'use client';

/**
 * Notification System Component
 * 
 * Display and manage notifications with filtering, grouping,
 * and batch actions.
 */

import React, { useState, useMemo, useCallback } from 'react';
import { cn } from '@/lib/utils/cn';
import type { Notification, AlertType } from '@/lib/analytics/types';
import { formatDateTime } from '@/lib/analytics/hooks';

// ============================================================================
// Types
// ============================================================================

interface NotificationSystemProps {
  notifications: Notification[];
  isLoading: boolean;
  onMarkRead: (id: string) => Promise<void>;
  onMarkAllRead: () => Promise<void>;
  className?: string;
}

// ============================================================================
// Notification Item Component
// ============================================================================

interface NotificationItemProps {
  notification: Notification;
  onMarkRead: () => void;
  isSelected: boolean;
  onSelect: (selected: boolean) => void;
}

function NotificationItem({ notification, onMarkRead, isSelected, onSelect }: NotificationItemProps) {
  const getTypeIcon = (type: AlertType) => {
    const icons: Record<AlertType, string> = {
      price_above: '📈',
      price_below: '📉',
      price_change: '📊',
      volume_spike: '📢',
      portfolio_value: '💰',
      allocation_drift: '⚖️',
      health_factor: '🏥',
      liquidation_warning: '⚠️',
      reward_claimable: '🎁',
    };
    return icons[type] || '🔔';
  };

  const getTypeColor = (type: AlertType) => {
    switch (type) {
      case 'price_above':
      case 'reward_claimable':
        return 'bg-green-100 text-green-700 border-green-200';
      case 'price_below':
      case 'liquidation_warning':
        return 'bg-red-100 text-red-700 border-red-200';
      case 'health_factor':
        return 'bg-yellow-100 text-yellow-700 border-yellow-200';
      default:
        return 'bg-blue-100 text-blue-700 border-blue-200';
    }
  };

  const timeSince = (timestamp: string) => {
    const seconds = Math.floor((Date.now() - new Date(timestamp).getTime()) / 1000);
    
    const intervals = [
      { label: 'y', seconds: 31536000 },
      { label: 'mo', seconds: 2592000 },
      { label: 'd', seconds: 86400 },
      { label: 'h', seconds: 3600 },
      { label: 'm', seconds: 60 },
      { label: 's', seconds: 1 },
    ];

    for (const interval of intervals) {
      const count = Math.floor(seconds / interval.seconds);
      if (count >= 1) {
        return `${count}${interval.label} ago`;
      }
    }
    return 'just now';
  };

  return (
    <div
      className={cn(
        'flex items-start gap-3 p-4 transition-colors border-b border-gray-100 last:border-0',
        notification.read ? 'bg-white' : 'bg-blue-50',
        isSelected && 'bg-gray-100'
      )}
    >
      {/* Checkbox */}
      <input
        type="checkbox"
        checked={isSelected}
        onChange={(e) => onSelect(e.target.checked)}
        className="mt-1 h-4 w-4 rounded border-gray-300"
      />

      {/* Icon */}
      <div className={cn(
        'flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-lg border text-lg',
        getTypeColor(notification.type)
      )}>
        {getTypeIcon(notification.type)}
      </div>

      {/* Content */}
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2">
          <span className={cn(
            'font-semibold truncate',
            !notification.read && 'text-blue-900'
          )}>
            {notification.alertName}
          </span>
          {!notification.read && (
            <span className="h-2 w-2 rounded-full bg-blue-500 flex-shrink-0" />
          )}
        </div>
        <p className={cn(
          'mt-1 text-sm line-clamp-2',
          notification.read ? 'text-gray-600' : 'text-gray-800'
        )}>
          {notification.message}
        </p>
        <div className="mt-2 flex items-center gap-3">
          <span className="text-xs text-gray-400">
            {timeSince(notification.timestamp)}
          </span>
          <span className={cn(
            'rounded-full px-2 py-0.5 text-xs font-medium',
            getTypeColor(notification.type)
          )}>
            {notification.type.replace(/_/g, ' ')}
          </span>
        </div>
      </div>

      {/* Actions */}
      {!notification.read && (
        <button
          onClick={onMarkRead}
          className="rounded-lg px-3 py-1 text-xs font-medium text-blue-600 hover:bg-blue-100 flex-shrink-0"
        >
          Mark read
        </button>
      )}
    </div>
  );
}

// ============================================================================
// Notification Group Component
// ============================================================================

interface NotificationGroupProps {
  title: string;
  notifications: Notification[];
  selectedIds: Set<string>;
  onMarkRead: (id: string) => void;
  onSelect: (id: string, selected: boolean) => void;
}

function NotificationGroup({ 
  title, 
  notifications, 
  selectedIds, 
  onMarkRead, 
  onSelect 
}: NotificationGroupProps) {
  if (notifications.length === 0) return null;

  return (
    <div className="rounded-xl border border-gray-200 overflow-hidden">
      <div className="bg-gray-50 px-4 py-2 border-b border-gray-200">
        <span className="text-sm font-medium text-gray-700">{title}</span>
        <span className="ml-2 rounded-full bg-gray-200 px-2 py-0.5 text-xs">
          {notifications.length}
        </span>
      </div>
      <div>
        {notifications.map((notification) => (
          <NotificationItem
            key={notification.id}
            notification={notification}
            onMarkRead={() => onMarkRead(notification.id)}
            isSelected={selectedIds.has(notification.id)}
            onSelect={(selected) => onSelect(notification.id, selected)}
          />
        ))}
      </div>
    </div>
  );
}

// ============================================================================
// Main Component
// ============================================================================

export function NotificationSystem({
  notifications,
  isLoading,
  onMarkRead,
  onMarkAllRead,
  className,
}: NotificationSystemProps) {
  const [filter, setFilter] = useState<'all' | 'unread' | 'price' | 'portfolio'>('all');
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());

  const filteredNotifications = useMemo(() => {
    switch (filter) {
      case 'unread':
        return notifications.filter(n => !n.read);
      case 'price':
        return notifications.filter(n => 
          ['price_above', 'price_below', 'price_change', 'volume_spike'].includes(n.type)
        );
      case 'portfolio':
        return notifications.filter(n => 
          ['portfolio_value', 'allocation_drift', 'health_factor', 'liquidation_warning', 'reward_claimable'].includes(n.type)
        );
      default:
        return notifications;
    }
  }, [notifications, filter]);

  const groupedNotifications = useMemo(() => {
    const today = new Date().toDateString();
    const yesterday = new Date(Date.now() - 86400000).toDateString();
    
    const groups = {
      today: [] as Notification[],
      yesterday: [] as Notification[],
      older: [] as Notification[],
    };

    filteredNotifications.forEach(n => {
      const date = new Date(n.timestamp).toDateString();
      if (date === today) {
        groups.today.push(n);
      } else if (date === yesterday) {
        groups.yesterday.push(n);
      } else {
        groups.older.push(n);
      }
    });

    return groups;
  }, [filteredNotifications]);

  const unreadCount = notifications.filter(n => !n.read).length;

  const handleSelect = useCallback((id: string, selected: boolean) => {
    setSelectedIds(prev => {
      const next = new Set(prev);
      if (selected) {
        next.add(id);
      } else {
        next.delete(id);
      }
      return next;
    });
  }, []);

  const handleSelectAll = useCallback(() => {
    if (selectedIds.size === filteredNotifications.length) {
      setSelectedIds(new Set());
    } else {
      setSelectedIds(new Set(filteredNotifications.map(n => n.id)));
    }
  }, [selectedIds.size, filteredNotifications]);

  const handleMarkSelectedRead = useCallback(async () => {
    const unreadSelected = filteredNotifications
      .filter(n => selectedIds.has(n.id) && !n.read)
      .map(n => n.id);
    
    await Promise.all(unreadSelected.map(id => onMarkRead(id)));
    setSelectedIds(new Set());
  }, [selectedIds, filteredNotifications, onMarkRead]);

  if (isLoading) {
    return (
      <div className={cn('space-y-4', className)}>
        {[...Array(5)].map((_, i) => (
          <div key={i} className="animate-pulse rounded-xl bg-gray-200 h-20" />
        ))}
      </div>
    );
  }

  return (
    <div className={cn('space-y-4', className)}>
      {/* Header */}
      <div className="flex items-center justify-between flex-wrap gap-4">
        <div className="flex gap-1 rounded-lg bg-gray-100 p-1">
          {([
            { id: 'all', label: 'All' },
            { id: 'unread', label: `Unread (${unreadCount})` },
            { id: 'price', label: 'Price' },
            { id: 'portfolio', label: 'Portfolio' },
          ] as const).map((f) => (
            <button
              key={f.id}
              onClick={() => setFilter(f.id)}
              className={cn(
                'rounded-md px-3 py-1.5 text-sm font-medium transition-all',
                filter === f.id
                  ? 'bg-white text-black shadow-sm'
                  : 'text-gray-600 hover:text-black'
              )}
            >
              {f.label}
            </button>
          ))}
        </div>

        {unreadCount > 0 && (
          <button
            onClick={onMarkAllRead}
            className="text-sm font-medium text-blue-600 hover:text-blue-700"
          >
            Mark all as read
          </button>
        )}
      </div>

      {/* Bulk Actions */}
      {selectedIds.size > 0 && (
        <div className="flex items-center gap-4 rounded-lg bg-gray-100 p-3">
          <span className="text-sm font-medium">
            {selectedIds.size} selected
          </span>
          <button
            onClick={handleMarkSelectedRead}
            className="text-sm font-medium text-blue-600 hover:text-blue-700"
          >
            Mark selected as read
          </button>
          <button
            onClick={() => setSelectedIds(new Set())}
            className="text-sm font-medium text-gray-600 hover:text-gray-700"
          >
            Clear selection
          </button>
        </div>
      )}

      {/* Select All */}
      {filteredNotifications.length > 0 && (
        <div className="flex items-center gap-2">
          <input
            type="checkbox"
            checked={selectedIds.size === filteredNotifications.length && filteredNotifications.length > 0}
            onChange={handleSelectAll}
            className="h-4 w-4 rounded border-gray-300"
          />
          <span className="text-sm text-gray-500">Select all</span>
        </div>
      )}

      {/* Notification Groups */}
      {filteredNotifications.length === 0 ? (
        <div className="rounded-2xl border-2 border-dashed border-gray-200 py-12 text-center">
          <div className="text-4xl">🔔</div>
          <div className="mt-2 font-medium">No notifications</div>
          <div className="mt-1 text-sm text-gray-500">
            {filter === 'unread' 
              ? "You're all caught up!" 
              : 'Notifications will appear here when alerts are triggered'}
          </div>
        </div>
      ) : (
        <div className="space-y-4">
          <NotificationGroup
            title="Today"
            notifications={groupedNotifications.today}
            selectedIds={selectedIds}
            onMarkRead={onMarkRead}
            onSelect={handleSelect}
          />
          <NotificationGroup
            title="Yesterday"
            notifications={groupedNotifications.yesterday}
            selectedIds={selectedIds}
            onMarkRead={onMarkRead}
            onSelect={handleSelect}
          />
          <NotificationGroup
            title="Earlier"
            notifications={groupedNotifications.older}
            selectedIds={selectedIds}
            onMarkRead={onMarkRead}
            onSelect={handleSelect}
          />
        </div>
      )}
    </div>
  );
}

export default NotificationSystem;
