/**
 * WebSocket Hooks - Main Export
 * 
 * Exports all WebSocket-related React hooks for convenient imports
 * 
 * @author Nich (@nichxbt)
 * @license Apache-2.0
 */

// Price streaming
export {
  usePriceStream,
  usePrice,
  useTopMovers,
  type UsePriceStreamOptions,
  type UsePriceStreamReturn,
} from './usePriceStream';

// Wallet updates
export {
  useWalletUpdates,
  useTransactionStatus,
  useBlocks,
  type Activity,
  type UseWalletUpdatesOptions,
  type UseWalletUpdatesReturn,
} from './useWalletUpdates';

// Notifications
export {
  useNotifications,
  useAlerts,
  type UseNotificationsOptions,
  type UseNotificationsReturn,
  type UseAlertsOptions,
  type UseAlertsReturn,
} from './useNotifications';

// Re-export from providers
export {
  WebSocketProvider,
  useWebSocketContext,
  WhenConnected,
  WhenDisconnected,
  ConnectionStatus,
  type WebSocketContextValue,
  type WebSocketProviderProps,
} from '../providers/WebSocketProvider';

// Re-export core hooks from lib
export {
  useWebSocket,
  usePriceSubscription,
  useWalletSubscription,
  useNotifications as useNotificationsInternal,
  useConnectionQuality,
  useMessage,
  useSubscription,
  type UseWebSocketOptions,
  type UseWebSocketReturn,
} from '../lib/websocket/hooks';
