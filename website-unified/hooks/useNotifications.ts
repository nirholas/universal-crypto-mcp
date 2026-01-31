/**
 * useNotifications Hook
 * 
 * React hook for real-time notifications and alerts via WebSocket
 * 
 * @author Nich (@nichxbt)
 * @license Apache-2.0
 */

'use client';

import { useState, useEffect, useCallback, useRef, useMemo } from 'react';
import { useWebSocketContext } from '../providers/WebSocketProvider';
import type { Notification, AlertRule, NotificationType } from '../lib/websocket/types';

// ============================================================================
// Types
// ============================================================================

export interface UseNotificationsOptions {
  // Enable/disable the subscription
  enabled?: boolean;
  
  // Filter by notification types
  types?: NotificationType[];
  
  // Filter by priority
  minPriority?: 'low' | 'medium' | 'high' | 'critical';
  
  // Max notifications to keep
  maxNotifications?: number;
  
  // Auto-subscribe on mount
  autoSubscribe?: boolean;
  
  // Custom notification handler
  onNotification?: (notification: Notification) => void;
  
  // Error handler
  onError?: (error: Error) => void;
  
  // Play sound for new notifications
  playSound?: boolean;
  
  // Show browser notification
  showBrowserNotification?: boolean;
}

export interface UseNotificationsReturn {
  // All notifications
  notifications: Notification[];
  
  // Unread notifications
  unreadNotifications: Notification[];
  
  // Unread count
  unreadCount: number;
  
  // Loading state
  loading: boolean;
  
  // Error state
  error: Error | null;
  
  // Mark notification as read
  markAsRead: (id: string) => Promise<void>;
  
  // Mark all as read
  markAllRead: () => Promise<void>;
  
  // Dismiss notification
  dismiss: (id: string) => Promise<void>;
  
  // Clear all notifications
  clearAll: () => Promise<void>;
  
  // Subscribe to notifications
  subscribe: () => void;
  
  // Unsubscribe from notifications
  unsubscribe: () => void;
  
  // Connection status
  connected: boolean;
  
  // Subscription status
  subscribed: boolean;
}

// ============================================================================
// Priority Levels
// ============================================================================

const priorityLevels: Record<string, number> = {
  low: 0,
  medium: 1,
  high: 2,
  critical: 3,
};

// ============================================================================
// Hook Implementation
// ============================================================================

export function useNotifications(
  userId: string,
  options: UseNotificationsOptions = {}
): UseNotificationsReturn {
  const {
    enabled = true,
    types,
    minPriority = 'low',
    maxNotifications = 100,
    autoSubscribe = true,
    onNotification,
    onError,
    playSound = false,
    showBrowserNotification = false,
  } = options;

  // Get WebSocket context
  const { connected, client, subscribe: wsSubscribe, unsubscribe: wsUnsubscribe, onMessage } = useWebSocketContext();
  
  // State
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);
  const [subscribed, setSubscribed] = useState(false);
  
  // Refs
  const onNotificationRef = useRef(onNotification);
  const onErrorRef = useRef(onError);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  
  // Keep refs updated
  useEffect(() => {
    onNotificationRef.current = onNotification;
    onErrorRef.current = onError;
  }, [onNotification, onError]);
  
  // Initialize audio for notification sound
  useEffect(() => {
    if (playSound && typeof window !== 'undefined') {
      audioRef.current = new Audio('/sounds/notification.mp3');
    }
  }, [playSound]);
  
  // Filter notification based on options
  const shouldInclude = useCallback((notification: Notification): boolean => {
    // Check type filter
    if (types && types.length > 0 && !types.includes(notification.type)) {
      return false;
    }
    
    // Check priority filter
    const notifPriority = priorityLevels[notification.priority] ?? 0;
    const minPriorityLevel = priorityLevels[minPriority] ?? 0;
    
    if (notifPriority < minPriorityLevel) {
      return false;
    }
    
    return true;
  }, [types, minPriority]);
  
  // Show browser notification
  const showBrowserNotif = useCallback(async (notification: Notification) => {
    if (!showBrowserNotification || typeof window === 'undefined') return;
    
    try {
      if (Notification.permission === 'granted') {
        new window.Notification(notification.title, {
          body: notification.message || notification.body,
          icon: '/icon-192.png',
          tag: notification.id,
        });
      } else if (Notification.permission !== 'denied') {
        const permission = await Notification.requestPermission();
        if (permission === 'granted') {
          new window.Notification(notification.title, {
            body: notification.message || notification.body,
            icon: '/icon-192.png',
            tag: notification.id,
          });
        }
      }
    } catch {
      // Browser doesn't support notifications
    }
  }, [showBrowserNotification]);
  
  // Handle incoming notifications
  useEffect(() => {
    if (!connected || !enabled) return;
    
    const handleNotification = (data: unknown) => {
      try {
        const notification = data as Notification;
        
        // Check filters
        if (!shouldInclude(notification)) return;
        
        // Add to state
        setNotifications(prev => {
          const next = [notification, ...prev];
          return next.slice(0, maxNotifications);
        });
        
        // Call handler
        onNotificationRef.current?.(notification);
        
        // Play sound
        if (playSound && audioRef.current) {
          audioRef.current.play().catch(() => {});
        }
        
        // Show browser notification
        if (!notification.read) {
          showBrowserNotif(notification);
        }
      } catch (err) {
        const error = err instanceof Error ? err : new Error(String(err));
        setError(error);
        onErrorRef.current?.(error);
      }
    };
    
    const unsubscribe = onMessage<Notification>('notification', handleNotification);
    
    return () => unsubscribe();
  }, [connected, enabled, shouldInclude, maxNotifications, playSound, showBrowserNotif, onMessage]);
  
  // Subscribe to notifications
  const subscribe = useCallback(async () => {
    if (!client || !connected || !userId) return;
    if (subscribed) return;
    
    try {
      setLoading(true);
      
      await wsSubscribe(`notifications:${userId}`);
      setSubscribed(true);
      
      // Request existing notifications
      const response = await client.request<{
        notifications: Notification[];
        unreadCount: number;
      }>('notifications:list', { userId, limit: maxNotifications });
      
      if (response.notifications) {
        setNotifications(response.notifications.filter(shouldInclude));
      }
      
      setLoading(false);
    } catch (err) {
      const error = err instanceof Error ? err : new Error(String(err));
      setError(error);
      setLoading(false);
      onErrorRef.current?.(error);
    }
  }, [client, connected, userId, subscribed, maxNotifications, shouldInclude, wsSubscribe]);
  
  // Unsubscribe from notifications
  const unsubscribe = useCallback(async () => {
    if (!connected || !userId) return;
    if (!subscribed) return;
    
    try {
      await wsUnsubscribe(`notifications:${userId}`);
      setSubscribed(false);
    } catch (err) {
      // Ignore unsubscribe errors
    }
  }, [connected, userId, subscribed, wsUnsubscribe]);
  
  // Mark notification as read
  const markAsRead = useCallback(async (id: string) => {
    if (!client || !connected) return;
    
    try {
      await client.request('notifications:markRead', { id });
      
      setNotifications(prev =>
        prev.map(n => n.id === id ? { ...n, read: true, readAt: Date.now() } : n)
      );
    } catch (err) {
      const error = err instanceof Error ? err : new Error(String(err));
      setError(error);
      onErrorRef.current?.(error);
    }
  }, [client, connected]);
  
  // Mark all as read
  const markAllRead = useCallback(async () => {
    if (!client || !connected) return;
    
    try {
      await client.request('notifications:markAllRead', { userId });
      
      setNotifications(prev =>
        prev.map(n => ({ ...n, read: true, readAt: Date.now() }))
      );
    } catch (err) {
      const error = err instanceof Error ? err : new Error(String(err));
      setError(error);
      onErrorRef.current?.(error);
    }
  }, [client, connected, userId]);
  
  // Dismiss notification
  const dismiss = useCallback(async (id: string) => {
    if (!client || !connected) return;
    
    try {
      await client.request('notifications:dismiss', { id });
      
      setNotifications(prev => prev.filter(n => n.id !== id));
    } catch (err) {
      const error = err instanceof Error ? err : new Error(String(err));
      setError(error);
      onErrorRef.current?.(error);
    }
  }, [client, connected]);
  
  // Clear all notifications
  const clearAll = useCallback(async () => {
    if (!client || !connected) return;
    
    try {
      await client.request('notifications:clearAll', { userId });
      
      setNotifications([]);
    } catch (err) {
      const error = err instanceof Error ? err : new Error(String(err));
      setError(error);
      onErrorRef.current?.(error);
    }
  }, [client, connected, userId]);
  
  // Auto-subscribe
  useEffect(() => {
    if (!connected || !enabled || !autoSubscribe || !userId) {
      setLoading(false);
      return;
    }
    
    subscribe();
    
    return () => {
      unsubscribe();
    };
  }, [connected, enabled, autoSubscribe, userId, subscribe, unsubscribe]);
  
  // Computed values
  const unreadNotifications = useMemo(() => {
    return notifications.filter(n => !n.read);
  }, [notifications]);
  
  const unreadCount = useMemo(() => {
    return unreadNotifications.length;
  }, [unreadNotifications]);
  
  return {
    notifications,
    unreadNotifications,
    unreadCount,
    loading,
    error,
    markAsRead,
    markAllRead,
    dismiss,
    clearAll,
    subscribe,
    unsubscribe,
    connected,
    subscribed,
  };
}

// ============================================================================
// Alert Management Hook
// ============================================================================

export interface UseAlertsOptions {
  enabled?: boolean;
  onAlert?: (alert: AlertRule, data: unknown) => void;
  onError?: (error: Error) => void;
}

export interface UseAlertsReturn {
  // User's alert rules
  alerts: AlertRule[];
  
  // Loading state
  loading: boolean;
  
  // Error state
  error: Error | null;
  
  // Create alert rule
  createAlert: (rule: Omit<AlertRule, 'id' | 'createdAt' | 'lastTriggered'>) => Promise<string>;
  
  // Update alert rule
  updateAlert: (id: string, updates: Partial<AlertRule>) => Promise<void>;
  
  // Delete alert rule
  deleteAlert: (id: string) => Promise<void>;
  
  // Enable/disable alert
  toggleAlert: (id: string, enabled: boolean) => Promise<void>;
  
  // Refresh alerts
  refreshAlerts: () => Promise<void>;
}

export function useAlerts(
  userId: string,
  options: UseAlertsOptions = {}
): UseAlertsReturn {
  const { enabled = true, onAlert, onError } = options;
  
  const { connected, client, onMessage } = useWebSocketContext();
  
  const [alerts, setAlerts] = useState<AlertRule[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);
  
  const onAlertRef = useRef(onAlert);
  const onErrorRef = useRef(onError);
  
  useEffect(() => {
    onAlertRef.current = onAlert;
    onErrorRef.current = onError;
  }, [onAlert, onError]);
  
  // Fetch alerts
  const refreshAlerts = useCallback(async () => {
    if (!client || !connected || !userId) return;
    
    try {
      setLoading(true);
      const response = await client.request<{ alerts: AlertRule[] }>(
        'alerts:list',
        { userId }
      );
      
      if (response.alerts) {
        setAlerts(response.alerts);
      }
      setLoading(false);
    } catch (err) {
      const error = err instanceof Error ? err : new Error(String(err));
      setError(error);
      setLoading(false);
      onErrorRef.current?.(error);
    }
  }, [client, connected, userId]);
  
  // Create alert
  const createAlert = useCallback(async (
    rule: Omit<AlertRule, 'id' | 'createdAt' | 'lastTriggered'>
  ): Promise<string> => {
    if (!client || !connected) {
      throw new Error('Not connected');
    }
    
    const response = await client.request<{ id: string }>('alerts:create', {
      userId,
      rule,
    });
    
    await refreshAlerts();
    
    return response.id;
  }, [client, connected, userId, refreshAlerts]);
  
  // Update alert
  const updateAlert = useCallback(async (id: string, updates: Partial<AlertRule>) => {
    if (!client || !connected) return;
    
    await client.request('alerts:update', { ruleId: id, updates });
    
    setAlerts(prev =>
      prev.map(a => a.id === id ? { ...a, ...updates } : a)
    );
  }, [client, connected]);
  
  // Delete alert
  const deleteAlert = useCallback(async (id: string) => {
    if (!client || !connected) return;
    
    await client.request('alerts:delete', { ruleId: id });
    
    setAlerts(prev => prev.filter(a => a.id !== id));
  }, [client, connected]);
  
  // Toggle alert enabled state
  const toggleAlert = useCallback(async (id: string, alertEnabled: boolean) => {
    await updateAlert(id, { enabled: alertEnabled });
  }, [updateAlert]);
  
  // Listen for triggered alerts
  useEffect(() => {
    if (!connected || !enabled) return;
    
    const handleAlertTriggered = (data: unknown) => {
      const { rule, triggerData } = data as { rule: AlertRule; triggerData: unknown };
      onAlertRef.current?.(rule, triggerData);
    };
    
    const unsubscribe = onMessage<{ rule: AlertRule; triggerData: unknown }>(
      'alert:triggered',
      handleAlertTriggered
    );
    
    return () => unsubscribe();
  }, [connected, enabled, onMessage]);
  
  // Initial fetch
  useEffect(() => {
    if (!connected || !enabled || !userId) {
      setLoading(false);
      return;
    }
    
    refreshAlerts();
  }, [connected, enabled, userId, refreshAlerts]);
  
  return {
    alerts,
    loading,
    error,
    createAlert,
    updateAlert,
    deleteAlert,
    toggleAlert,
    refreshAlerts,
  };
}

// ============================================================================
// Export
// ============================================================================

export default useNotifications;
