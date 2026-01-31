/**
 * Notification Manager
 * 
 * Real-time notification system with alert rules,
 * priority queuing, and delivery tracking
 */

import type {
  Notification,
  NotificationType,
  AlertRule,
} from './types';

export interface NotificationConfig {
  // Maximum notifications per user in queue
  maxQueuePerUser: number;
  // Notification expiry time
  expiryTime: number;
  // Rate limit per minute
  rateLimitPerMinute: number;
  // Enable grouping similar notifications
  enableGrouping: boolean;
  // Grouping window in ms
  groupingWindow: number;
}

export interface NotificationPreferences {
  userId: string;
  enabled: boolean;
  types: NotificationType[];
  channels: Array<'websocket' | 'email' | 'push' | 'sms'>;
  quietHours?: {
    enabled: boolean;
    start: string; // HH:mm
    end: string;
  };
  minPriority: 'low' | 'medium' | 'high' | 'critical';
}

export interface NotificationStats {
  totalSent: number;
  totalRead: number;
  totalExpired: number;
  byType: Record<NotificationType, number>;
  byPriority: Record<string, number>;
}

const DEFAULT_CONFIG: NotificationConfig = {
  maxQueuePerUser: 100,
  expiryTime: 86400000, // 24 hours
  rateLimitPerMinute: 60,
  enableGrouping: true,
  groupingWindow: 60000, // 1 minute
};

export class NotificationManager {
  private config: NotificationConfig;
  private notifications: Map<string, Notification> = new Map();
  private userNotifications: Map<string, Set<string>> = new Map();
  private userPreferences: Map<string, NotificationPreferences> = new Map();
  private alertRules: Map<string, AlertRule> = new Map();
  private userRules: Map<string, Set<string>> = new Map();
  private rateLimitCounters: Map<string, { count: number; resetAt: number }> = new Map();
  private groupingBuffer: Map<string, Notification[]> = new Map();

  // Event handlers
  private onNotification: ((notification: Notification, userId: string) => void) | null = null;
  private onAlertTriggered: ((rule: AlertRule, data: unknown) => void) | null = null;

  // Stats
  private stats: NotificationStats = {
    totalSent: 0,
    totalRead: 0,
    totalExpired: 0,
    byType: {} as Record<NotificationType, number>,
    byPriority: { low: 0, medium: 0, high: 0, critical: 0 },
  };

  constructor(config: Partial<NotificationConfig> = {}) {
    this.config = { ...DEFAULT_CONFIG, ...config };
  }

  // ============================================================================
  // Notification Management
  // ============================================================================

  /**
   * Send a notification
   */
  send(
    userId: string,
    type: NotificationType,
    title: string,
    message: string,
    options: {
      priority?: 'low' | 'medium' | 'high' | 'critical';
      data?: Record<string, unknown>;
      actions?: Array<{ id: string; label: string; action: string }>;
      expiresAt?: number;
      groupKey?: string;
    } = {}
  ): Notification | null {
    // Check rate limit
    if (!this.checkRateLimit(userId)) {
      console.warn(`[Notifications] Rate limit exceeded for user: ${userId}`);
      return null;
    }

    // Check preferences
    const prefs = this.userPreferences.get(userId);
    if (prefs) {
      if (!prefs.enabled) return null;
      if (!prefs.types.includes(type)) return null;

      const priorityOrder = ['low', 'medium', 'high', 'critical'];
      const minIdx = priorityOrder.indexOf(prefs.minPriority);
      const msgIdx = priorityOrder.indexOf(options.priority || 'medium');
      if (msgIdx < minIdx) return null;

      // Check quiet hours
      if (prefs.quietHours?.enabled) {
        const now = new Date();
        const currentTime = `${now.getHours().toString().padStart(2, '0')}:${now.getMinutes().toString().padStart(2, '0')}`;
        if (currentTime >= prefs.quietHours.start && currentTime <= prefs.quietHours.end) {
          // Queue for later instead of dropping
          return null;
        }
      }
    }

    // Handle grouping
    if (this.config.enableGrouping && options.groupKey) {
      return this.handleGrouping(userId, type, title, message, options);
    }

    return this.createAndSendNotification(userId, type, title, message, options);
  }

  /**
   * Create and send notification
   */
  private createAndSendNotification(
    userId: string,
    type: NotificationType,
    title: string,
    message: string,
    options: {
      priority?: 'low' | 'medium' | 'high' | 'critical';
      data?: Record<string, unknown>;
      actions?: Array<{ id: string; label: string; action: string }>;
      expiresAt?: number;
    }
  ): Notification {
    const notification: Notification = {
      id: this.generateId(),
      type,
      title,
      message,
      priority: options.priority || 'medium',
      timestamp: Date.now(),
      read: false,
      data: options.data,
      actions: options.actions,
      expiresAt: options.expiresAt || Date.now() + this.config.expiryTime,
    };

    // Store notification
    this.notifications.set(notification.id, notification);

    // Index by user
    let userNotifs = this.userNotifications.get(userId);
    if (!userNotifs) {
      userNotifs = new Set();
      this.userNotifications.set(userId, userNotifs);
    }

    // Enforce queue limit
    if (userNotifs.size >= this.config.maxQueuePerUser) {
      const oldest = Array.from(userNotifs)[0];
      userNotifs.delete(oldest);
      this.notifications.delete(oldest);
    }

    userNotifs.add(notification.id);

    // Update stats
    this.stats.totalSent++;
    this.stats.byType[type] = (this.stats.byType[type] || 0) + 1;
    this.stats.byPriority[notification.priority]++;

    // Emit notification
    if (this.onNotification) {
      this.onNotification(notification, userId);
    }

    return notification;
  }

  /**
   * Handle notification grouping
   */
  private handleGrouping(
    userId: string,
    type: NotificationType,
    title: string,
    message: string,
    options: {
      priority?: 'low' | 'medium' | 'high' | 'critical';
      data?: Record<string, unknown>;
      groupKey?: string;
    }
  ): Notification | null {
    const bufferKey = `${userId}:${options.groupKey}`;
    let buffer = this.groupingBuffer.get(bufferKey);

    if (!buffer) {
      buffer = [];
      this.groupingBuffer.set(bufferKey, buffer);

      // Set timer to flush buffer
      setTimeout(() => {
        this.flushGroupingBuffer(bufferKey);
      }, this.config.groupingWindow);
    }

    // Add to buffer
    buffer.push({
      id: this.generateId(),
      type,
      title,
      message,
      priority: options.priority || 'medium',
      timestamp: Date.now(),
      read: false,
      data: options.data,
    });

    // Return null as notification will be sent when buffer flushes
    return null;
  }

  /**
   * Flush grouping buffer
   */
  private flushGroupingBuffer(bufferKey: string): void {
    const buffer = this.groupingBuffer.get(bufferKey);
    if (!buffer || buffer.length === 0) return;

    const [userId] = bufferKey.split(':');
    const first = buffer[0];

    // Create grouped notification
    const grouped: Notification = {
      id: this.generateId(),
      type: first.type,
      title: buffer.length > 1 ? `${first.title} (+${buffer.length - 1} more)` : first.title,
      message: buffer.length > 1
        ? `${buffer.length} notifications grouped`
        : first.message,
      priority: this.getHighestPriority(buffer.map((n) => n.priority)),
      timestamp: Date.now(),
      read: false,
      data: {
        groupedCount: buffer.length,
        items: buffer.map((n) => ({ title: n.title, message: n.message, data: n.data })),
      },
    };

    // Store and emit
    this.notifications.set(grouped.id, grouped);
    
    let userNotifs = this.userNotifications.get(userId);
    if (!userNotifs) {
      userNotifs = new Set();
      this.userNotifications.set(userId, userNotifs);
    }
    userNotifs.add(grouped.id);

    if (this.onNotification) {
      this.onNotification(grouped, userId);
    }

    // Clear buffer
    this.groupingBuffer.delete(bufferKey);
  }

  /**
   * Mark notification as read
   */
  markAsRead(notificationId: string): boolean {
    const notification = this.notifications.get(notificationId);
    if (!notification) return false;

    if (!notification.read) {
      notification.read = true;
      notification.readAt = Date.now();
      this.stats.totalRead++;
    }

    return true;
  }

  /**
   * Mark all notifications as read for a user
   */
  markAllAsRead(userId: string): number {
    const userNotifs = this.userNotifications.get(userId);
    if (!userNotifs) return 0;

    let count = 0;
    for (const id of userNotifs) {
      const notification = this.notifications.get(id);
      if (notification && !notification.read) {
        notification.read = true;
        notification.readAt = Date.now();
        count++;
      }
    }

    this.stats.totalRead += count;
    return count;
  }

  /**
   * Get notifications for a user
   */
  getNotifications(
    userId: string,
    options: {
      unreadOnly?: boolean;
      type?: NotificationType;
      limit?: number;
      offset?: number;
    } = {}
  ): Notification[] {
    const userNotifs = this.userNotifications.get(userId);
    if (!userNotifs) return [];

    let notifications = Array.from(userNotifs)
      .map((id) => this.notifications.get(id))
      .filter((n): n is Notification => n !== undefined);

    // Filter expired
    const now = Date.now();
    notifications = notifications.filter(
      (n) => !n.expiresAt || n.expiresAt > now
    );

    // Apply filters
    if (options.unreadOnly) {
      notifications = notifications.filter((n) => !n.read);
    }
    if (options.type) {
      notifications = notifications.filter((n) => n.type === options.type);
    }

    // Sort by timestamp desc
    notifications.sort((a, b) => b.timestamp - a.timestamp);

    // Apply pagination
    const offset = options.offset || 0;
    const limit = options.limit || 50;
    return notifications.slice(offset, offset + limit);
  }

  /**
   * Get unread count
   */
  getUnreadCount(userId: string): number {
    const userNotifs = this.userNotifications.get(userId);
    if (!userNotifs) return 0;

    let count = 0;
    const now = Date.now();

    for (const id of userNotifs) {
      const notification = this.notifications.get(id);
      if (notification && !notification.read) {
        if (!notification.expiresAt || notification.expiresAt > now) {
          count++;
        }
      }
    }

    return count;
  }

  /**
   * Delete notification
   */
  delete(notificationId: string, userId?: string): boolean {
    const notification = this.notifications.get(notificationId);
    if (!notification) return false;

    this.notifications.delete(notificationId);

    // Remove from user index
    if (userId) {
      const userNotifs = this.userNotifications.get(userId);
      if (userNotifs) {
        userNotifs.delete(notificationId);
      }
    }

    return true;
  }

  // ============================================================================
  // Alert Rules
  // ============================================================================

  /**
   * Create an alert rule
   */
  createAlertRule(
    userId: string,
    rule: Omit<AlertRule, 'id' | 'createdAt' | 'lastTriggered'>
  ): AlertRule {
    const alertRule: AlertRule = {
      ...rule,
      id: this.generateId(),
      createdAt: Date.now(),
    };

    this.alertRules.set(alertRule.id, alertRule);

    // Index by user
    let userRules = this.userRules.get(userId);
    if (!userRules) {
      userRules = new Set();
      this.userRules.set(userId, userRules);
    }
    userRules.add(alertRule.id);

    console.log(`[Notifications] Created alert rule: ${alertRule.name}`);
    return alertRule;
  }

  /**
   * Update alert rule
   */
  updateAlertRule(
    ruleId: string,
    updates: Partial<Omit<AlertRule, 'id' | 'createdAt'>>
  ): AlertRule | null {
    const rule = this.alertRules.get(ruleId);
    if (!rule) return null;

    Object.assign(rule, updates);
    return rule;
  }

  /**
   * Delete alert rule
   */
  deleteAlertRule(ruleId: string, userId?: string): boolean {
    const rule = this.alertRules.get(ruleId);
    if (!rule) return false;

    this.alertRules.delete(ruleId);

    if (userId) {
      const userRules = this.userRules.get(userId);
      if (userRules) {
        userRules.delete(ruleId);
      }
    }

    return true;
  }

  /**
   * Get alert rules for user
   */
  getAlertRules(userId: string): AlertRule[] {
    const userRules = this.userRules.get(userId);
    if (!userRules) return [];

    return Array.from(userRules)
      .map((id) => this.alertRules.get(id))
      .filter((r): r is AlertRule => r !== undefined);
  }

  /**
   * Evaluate alert rules against data
   */
  evaluateRules(type: string, data: Record<string, unknown>): AlertRule[] {
    const triggeredRules: AlertRule[] = [];

    for (const rule of this.alertRules.values()) {
      if (!rule.enabled) continue;
      if (rule.type !== type) continue;

      const triggered = this.evaluateConditions(rule.conditions, data);
      if (triggered) {
        rule.lastTriggered = Date.now();
        rule.triggerCount = (rule.triggerCount || 0) + 1;
        triggeredRules.push(rule);

        if (this.onAlertTriggered) {
          this.onAlertTriggered(rule, data);
        }
      }
    }

    return triggeredRules;
  }

  /**
   * Evaluate conditions
   */
  private evaluateConditions(
    conditions: AlertRule['conditions'],
    data: Record<string, unknown>
  ): boolean {
    if (!conditions) return false;
    for (const condition of conditions) {
      const value = data[condition.field];
      if (value === undefined) continue;

      let matches = false;

      switch (condition.operator) {
        case 'gt':
          matches = Number(value) > Number(condition.value);
          break;
        case 'lt':
          matches = Number(value) < Number(condition.value);
          break;
        case 'gte':
          matches = Number(value) >= Number(condition.value);
          break;
        case 'lte':
          matches = Number(value) <= Number(condition.value);
          break;
        case 'eq':
          matches = value === condition.value;
          break;
        case 'neq':
          matches = value !== condition.value;
          break;
        case 'contains':
          matches = String(value).includes(String(condition.value));
          break;
        case 'between':
          if (Array.isArray(condition.value) && condition.value.length === 2) {
            const num = Number(value);
            matches = num >= condition.value[0] && num <= condition.value[1];
          }
          break;
      }

      if (!matches) return false;
    }

    return true;
  }

  // ============================================================================
  // Preferences
  // ============================================================================

  /**
   * Set user preferences
   */
  setPreferences(userId: string, prefs: Partial<NotificationPreferences>): void {
    const existing = this.userPreferences.get(userId) || {
      userId,
      enabled: true,
      types: ['price_alert', 'transaction', 'system'] as NotificationType[],
      channels: ['websocket'] as const,
      minPriority: 'low' as const,
    };

    this.userPreferences.set(userId, { ...existing, ...prefs, userId });
  }

  /**
   * Get user preferences
   */
  getPreferences(userId: string): NotificationPreferences | undefined {
    return this.userPreferences.get(userId);
  }

  // ============================================================================
  // Utilities
  // ============================================================================

  /**
   * Check rate limit
   */
  private checkRateLimit(userId: string): boolean {
    const now = Date.now();
    let counter = this.rateLimitCounters.get(userId);

    if (!counter || now > counter.resetAt) {
      counter = { count: 0, resetAt: now + 60000 };
      this.rateLimitCounters.set(userId, counter);
    }

    counter.count++;
    return counter.count <= this.config.rateLimitPerMinute;
  }

  /**
   * Generate unique ID
   */
  private generateId(): string {
    return `notif_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`;
  }

  /**
   * Get highest priority from list
   */
  private getHighestPriority(priorities: string[]): 'low' | 'medium' | 'high' | 'critical' {
    const order = ['low', 'medium', 'high', 'critical'];
    let highest = 0;

    for (const p of priorities) {
      const idx = order.indexOf(p);
      if (idx > highest) highest = idx;
    }

    return order[highest] as 'low' | 'medium' | 'high' | 'critical';
  }

  /**
   * Set notification handler
   */
  onNotificationHandler(
    handler: (notification: Notification, userId: string) => void
  ): void {
    this.onNotification = handler;
  }

  /**
   * Set alert triggered handler
   */
  onAlertTriggeredHandler(
    handler: (rule: AlertRule, data: unknown) => void
  ): void {
    this.onAlertTriggered = handler;
  }

  /**
   * Get stats
   */
  getStats(): NotificationStats & { totalPending: number; activeRules: number } {
    return {
      ...this.stats,
      totalPending: this.notifications.size,
      activeRules: Array.from(this.alertRules.values()).filter((r) => r.enabled).length,
    };
  }

  /**
   * Cleanup expired notifications
   */
  cleanupExpired(): number {
    const now = Date.now();
    let removed = 0;

    for (const [id, notification] of this.notifications) {
      if (notification.expiresAt && notification.expiresAt < now) {
        this.notifications.delete(id);
        removed++;
        this.stats.totalExpired++;
      }
    }

    return removed;
  }

  /**
   * Full cleanup
   */
  cleanup(): void {
    this.notifications.clear();
    this.userNotifications.clear();
    this.userPreferences.clear();
    this.alertRules.clear();
    this.userRules.clear();
    this.rateLimitCounters.clear();
    this.groupingBuffer.clear();
  }
}

// Export singleton
export const notificationManager = new NotificationManager();

// Export factory
export function createNotificationManager(
  config?: Partial<NotificationConfig>
): NotificationManager {
  return new NotificationManager(config);
}
