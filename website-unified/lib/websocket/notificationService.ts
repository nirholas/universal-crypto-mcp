/**
 * Notification Service
 * 
 * Integrates notification manager with WebSocket server
 * for real-time notification delivery
 */

import type { Notification, NotificationType, AlertRule } from './types';
import { NotificationManager, createNotificationManager, type NotificationPreferences } from './notificationManager';
import { WebSocketServerInstance } from './server';

export interface NotificationServiceConfig {
  // Enable cleanup of expired notifications
  enableCleanup: boolean;
  // Cleanup interval
  cleanupInterval: number;
}

const DEFAULT_CONFIG: NotificationServiceConfig = {
  enableCleanup: true,
  cleanupInterval: 3600000, // 1 hour
};

export class NotificationService {
  private config: NotificationServiceConfig;
  private manager: NotificationManager;
  private wsServer: WebSocketServerInstance | null = null;
  private cleanupTimer: NodeJS.Timeout | null = null;
  private isRunning = false;

  constructor(config: Partial<NotificationServiceConfig> = {}) {
    this.config = { ...DEFAULT_CONFIG, ...config };
    this.manager = createNotificationManager();

    // Set up handlers
    this.setupHandlers();
  }

  // ============================================================================
  // Lifecycle
  // ============================================================================

  /**
   * Initialize with WebSocket server
   */
  initialize(wsServer: WebSocketServerInstance): void {
    this.wsServer = wsServer;

    // Register notification-related handlers
    const router = wsServer.getRouter();

    // Get notifications
    router.register('notifications:list', async (message, connection) => {
      if (!connection.userId) {
        throw new Error('Authentication required');
      }

      const { unreadOnly, type, limit, offset } = message.payload as {
        unreadOnly?: boolean;
        type?: NotificationType;
        limit?: number;
        offset?: number;
      };

      return {
        notifications: this.manager.getNotifications(connection.userId, {
          unreadOnly,
          type,
          limit,
          offset,
        }),
        unreadCount: this.manager.getUnreadCount(connection.userId),
      };
    });

    // Mark as read
    router.register('notifications:read', async (message, connection) => {
      if (!connection.userId) {
        throw new Error('Authentication required');
      }

      const { notificationId, all } = message.payload as {
        notificationId?: string;
        all?: boolean;
      };

      if (all) {
        const count = this.manager.markAllAsRead(connection.userId);
        return { marked: count };
      }

      if (notificationId) {
        const success = this.manager.markAsRead(notificationId);
        return { success };
      }

      throw new Error('notificationId or all=true required');
    });

    // Delete notification
    router.register('notifications:delete', async (message, connection) => {
      if (!connection.userId) {
        throw new Error('Authentication required');
      }

      const { notificationId } = message.payload as { notificationId: string };

      const success = this.manager.delete(notificationId, connection.userId);
      return { success };
    });

    // Get/set preferences
    router.register('notifications:preferences', async (message, connection) => {
      if (!connection.userId) {
        throw new Error('Authentication required');
      }

      const { preferences } = message.payload as {
        preferences?: Partial<NotificationPreferences>;
      };

      if (preferences) {
        this.manager.setPreferences(connection.userId, preferences);
      }

      return this.manager.getPreferences(connection.userId);
    });

    // Create alert rule
    router.register('alerts:create', async (message, connection) => {
      if (!connection.userId) {
        throw new Error('Authentication required');
      }

      const rule = message.payload as Omit<AlertRule, 'id' | 'createdAt' | 'lastTriggered'>;
      return this.manager.createAlertRule(connection.userId, rule);
    });

    // List alert rules
    router.register('alerts:list', async (_message, connection) => {
      if (!connection.userId) {
        throw new Error('Authentication required');
      }

      return this.manager.getAlertRules(connection.userId);
    });

    // Update alert rule
    router.register('alerts:update', async (message, connection) => {
      if (!connection.userId) {
        throw new Error('Authentication required');
      }

      const { ruleId, updates } = message.payload as {
        ruleId: string;
        updates: Partial<AlertRule>;
      };

      const rule = this.manager.updateAlertRule(ruleId, updates);
      if (!rule) {
        throw new Error('Alert rule not found');
      }

      return rule;
    });

    // Delete alert rule
    router.register('alerts:delete', async (message, connection) => {
      if (!connection.userId) {
        throw new Error('Authentication required');
      }

      const { ruleId } = message.payload as { ruleId: string };
      const success = this.manager.deleteAlertRule(ruleId, connection.userId);
      return { success };
    });

    // Subscribe to notifications channel
    router.register('notifications:subscribe', async (_message, connection) => {
      if (!connection.userId) {
        throw new Error('Authentication required');
      }

      wsServer.subscribe(connection.id, `notifications:${connection.userId}`);
      
      return {
        subscribed: true,
        unreadCount: this.manager.getUnreadCount(connection.userId),
      };
    });

    console.log('[NotificationService] Initialized with WebSocket server');
  }

  /**
   * Setup event handlers
   */
  private setupHandlers(): void {
    // Notification created
    this.manager.onNotificationHandler((notification, userId) => {
      this.deliverNotification(notification, userId);
    });

    // Alert triggered
    this.manager.onAlertTriggeredHandler((rule, data) => {
      this.handleAlertTriggered(rule, data);
    });
  }

  /**
   * Start the service
   */
  start(): void {
    if (this.isRunning) return;

    // Start cleanup timer
    if (this.config.enableCleanup) {
      this.cleanupTimer = setInterval(() => {
        const removed = this.manager.cleanupExpired();
        if (removed > 0) {
          console.log(`[NotificationService] Cleaned up ${removed} expired notifications`);
        }
      }, this.config.cleanupInterval);
    }

    this.isRunning = true;
    console.log('[NotificationService] Started');
  }

  /**
   * Stop the service
   */
  stop(): void {
    if (!this.isRunning) return;

    if (this.cleanupTimer) {
      clearInterval(this.cleanupTimer);
      this.cleanupTimer = null;
    }

    this.isRunning = false;
    console.log('[NotificationService] Stopped');
  }

  // ============================================================================
  // Notification Delivery
  // ============================================================================

  /**
   * Deliver notification via WebSocket
   */
  private deliverNotification(notification: Notification, userId: string): void {
    if (!this.wsServer) return;

    const message = {
      type: 'notification',
      success: true,
      data: notification,
      timestamp: Date.now(),
    };

    // Send to user's notification channel
    this.wsServer.broadcastToChannel(`notifications:${userId}`, message);

    // Also try direct send to user
    this.wsServer.sendToUser(userId, message);
  }

  /**
   * Handle triggered alert
   */
  private handleAlertTriggered(rule: AlertRule, data: unknown): void {
    // Find user for this rule
    let userId: string | undefined;
    for (const [uid, rules] of this.manager['userRules']) {
      if (rules.has(rule.id)) {
        userId = uid;
        break;
      }
    }

    if (!userId) return;

    // Send notification for the alert
    this.manager.send(userId, 'price_alert', `Alert: ${rule.name}`, rule.message || '', {
      priority: 'high',
      data: {
        ruleId: rule.id,
        ruleName: rule.name,
        triggeredData: data,
      },
    });
  }

  // ============================================================================
  // Public API
  // ============================================================================

  /**
   * Send notification programmatically
   */
  sendNotification(
    userId: string,
    type: NotificationType,
    title: string,
    message: string,
    options?: {
      priority?: 'low' | 'medium' | 'high' | 'critical';
      data?: Record<string, unknown>;
      actions?: Array<{ id: string; label: string; action: string }>;
    }
  ): Notification | null {
    return this.manager.send(userId, type, title, message, options);
  }

  /**
   * Send to multiple users
   */
  sendToUsers(
    userIds: string[],
    type: NotificationType,
    title: string,
    message: string,
    options?: {
      priority?: 'low' | 'medium' | 'high' | 'critical';
      data?: Record<string, unknown>;
    }
  ): number {
    let sent = 0;
    for (const userId of userIds) {
      const notification = this.manager.send(userId, type, title, message, options);
      if (notification) sent++;
    }
    return sent;
  }

  /**
   * Broadcast notification to all connected users
   */
  broadcast(
    type: NotificationType,
    title: string,
    message: string,
    options?: {
      priority?: 'low' | 'medium' | 'high' | 'critical';
      data?: Record<string, unknown>;
    }
  ): void {
    if (!this.wsServer) return;

    const notification: Notification = {
      id: `broadcast_${Date.now()}`,
      type,
      title,
      message,
      priority: options?.priority || 'medium',
      timestamp: Date.now(),
      read: false,
      data: options?.data,
    };

    this.wsServer.broadcast({
      type: 'notification',
      success: true,
      data: notification,
      timestamp: Date.now(),
    });
  }

  /**
   * Evaluate alert rules
   */
  evaluateAlertRules(type: string, data: Record<string, unknown>): AlertRule[] {
    return this.manager.evaluateRules(type, data);
  }

  /**
   * Get notification manager
   */
  getManager(): NotificationManager {
    return this.manager;
  }

  /**
   * Get stats
   */
  getStats() {
    return {
      service: {
        isRunning: this.isRunning,
      },
      notifications: this.manager.getStats(),
    };
  }

  /**
   * Cleanup
   */
  cleanup(): void {
    this.stop();
    this.manager.cleanup();
  }
}

// Export singleton
export const notificationService = new NotificationService();

// Export factory
export function createNotificationService(
  config?: Partial<NotificationServiceConfig>
): NotificationService {
  return new NotificationService(config);
}
