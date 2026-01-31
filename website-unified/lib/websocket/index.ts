/**
 * WebSocket Module
 * 
 * Real-time WebSocket system for cryptocurrency data streaming
 * 
 * @author Nich (@nichxbt)
 * @license Apache-2.0
 */

// ============================================================================
// Types
// ============================================================================

export type {
  // Connection types
  Connection,
  ConnectionQuality,
  WSServerOptions,
  WSClientOptions,
  
  // Message types
  WSMessage,
  WSRequest,
  WSResponse,
  MessageHandler,
  WSMiddleware,
  
  // Channel types
  ChannelType,
  ChannelSubscription,
  
  // Price types
  Price,
  PriceUpdate,
  PriceBatch,
  TokenMove,
  Trade,
  MarketOverview,
  PriceCallback,
  PriceSource,
  
  // Transaction types
  TransactionStatusType,
  TransactionStatus,
  BalanceChange,
  Approval,
  NFTTransfer,
  WalletUpdate,
  Block,
  EventFilter,
  ConfirmationCallback,
  FailureCallback,
  
  // Notification types
  NotificationType,
  NotificationPriority,
  Notification,
  AlertCondition,
  AlertRule,
  
  // Event types
  WSEventType,
  EventHandler,
  
  // State types
  SyncState,
  Update,
} from './types';

// ============================================================================
// Server Components
// ============================================================================

// Connection Manager
export {
  ConnectionManager,
  connectionManager,
} from './connectionManager';

// Message Router
export {
  MessageRouter,
  messageRouter,
  loggingMiddleware,
  rateLimitMiddleware,
  authMiddleware,
  validationMiddleware,
  type RouteDefinition,
  type RouteContext,
} from './messageRouter';

// Heartbeat
export {
  HeartbeatManager,
  createHeartbeatManager,
  type HeartbeatConfig,
  type HeartbeatStats,
} from './heartbeat';

// WebSocket Server
export {
  WebSocketServerInstance,
  createWebSocketServer,
  wsServer,
  type WSServerConfig,
} from './server';

// ============================================================================
// Price Feed Components
// ============================================================================

export {
  PriceFeedManager,
  priceFeedManager,
  createPriceFeedManager,
  type PriceFeedConfig,
  type PriceSubscription,
} from './priceFeed';

export {
  PriceFeedService,
  priceFeedService,
  createPriceFeedService,
  type PriceSourceConfig,
  type PriceFeedServiceConfig,
} from './priceFeedService';

// ============================================================================
// Transaction Components
// ============================================================================

export {
  TransactionMonitor,
  transactionMonitor,
  createTransactionMonitor,
  type TransactionMonitorConfig,
  type TrackedTransaction,
  type WalletSubscription,
} from './transactionMonitor';

export {
  TransactionService,
  transactionService,
  createTransactionService,
  type TransactionServiceConfig,
} from './transactionService';

// ============================================================================
// Notification Components
// ============================================================================

export {
  NotificationManager,
  notificationManager,
  createNotificationManager,
  type NotificationConfig,
  type NotificationPreferences,
  type NotificationStats,
} from './notificationManager';

export {
  NotificationService,
  notificationService,
  createNotificationService,
  type NotificationServiceConfig,
} from './notificationService';

// ============================================================================
// Client Components
// ============================================================================

export {
  WebSocketClient,
  createWebSocketClient,
  getDefaultClient,
  type PendingRequest,
  type ClientStats,
} from './client';

export {
  ReconnectionManager,
  createReconnectionManager,
  calculateBackoffDelay,
  addJitter,
  delay,
  retryWithBackoff,
  type ReconnectionConfig,
  type ReconnectionState,
} from './reconnection';

export {
  StateSync,
  createStateSync,
  type StateSyncConfig,
  type OptimisticUpdate,
} from './stateSync';

// ============================================================================
// React Hooks
// ============================================================================

export {
  useWebSocket,
  usePriceSubscription,
  useWalletSubscription,
  useNotifications,
  useConnectionQuality,
  useMessage,
  useSubscription,
  type UseWebSocketOptions,
  type UseWebSocketReturn,
  type UsePriceSubscriptionOptions,
  type UsePriceSubscriptionReturn,
  type UseWalletSubscriptionOptions,
  type UseWalletSubscriptionReturn,
  type UseNotificationsOptions,
  type UseNotificationsReturn,
  type UseConnectionQualityReturn,
} from './hooks';

// ============================================================================
// Convenience Factory
// ============================================================================

import { WebSocketServerInstance, createWebSocketServer } from './server';
import { PriceFeedService, createPriceFeedService } from './priceFeedService';
import { TransactionService, createTransactionService } from './transactionService';
import { NotificationService, createNotificationService } from './notificationService';

export interface WebSocketSystemConfig {
  server?: {
    port?: number;
    path?: string;
  };
  prices?: {
    enabled?: boolean;
  };
  transactions?: {
    enabled?: boolean;
  };
  notifications?: {
    enabled?: boolean;
  };
}

export interface WebSocketSystem {
  server: WebSocketServerInstance;
  prices: PriceFeedService;
  transactions: TransactionService;
  notifications: NotificationService;
  start: () => Promise<void>;
  stop: () => Promise<void>;
}

/**
 * Create a complete WebSocket system with all services
 */
export function createWebSocketSystem(
  config: WebSocketSystemConfig = {}
): WebSocketSystem {
  const server = createWebSocketServer(config.server);
  const prices = createPriceFeedService();
  const transactions = createTransactionService();
  const notifications = createNotificationService();

  return {
    server,
    prices,
    transactions,
    notifications,

    async start() {
      await server.start();
      
      if (config.prices?.enabled !== false) {
        prices.initialize(server);
        prices.start();
      }
      
      if (config.transactions?.enabled !== false) {
        transactions.initialize(server);
        transactions.start();
      }
      
      if (config.notifications?.enabled !== false) {
        notifications.initialize(server);
        notifications.start();
      }
      
      console.log('[WebSocketSystem] All services started');
    },

    async stop() {
      prices.cleanup();
      transactions.cleanup();
      notifications.cleanup();
      await server.stop();
      console.log('[WebSocketSystem] All services stopped');
    },
  };
}
