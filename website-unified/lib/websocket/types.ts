/**
 * WebSocket Types
 * 
 * Type definitions for the real-time WebSocket system
 */

import type { WebSocket as WSWebSocket } from 'ws';

// ============================================================================
// Connection Types
// ============================================================================

export interface Connection {
  id: string;
  socket: WSWebSocket | WebSocket;
  userId?: string;
  channels: Set<string>;
  connectedAt: number;
  lastPing: number;
  quality: ConnectionQuality;
  metadata: Record<string, unknown>;
}

export interface ConnectionQuality {
  latency: number;
  packetLoss: number;
  status: 'excellent' | 'good' | 'fair' | 'poor';
}

export interface WSServerOptions {
  port?: number;
  path?: string;
  heartbeatInterval?: number;
  heartbeatTimeout?: number;
  maxConnections?: number;
  maxMessageSize?: number;
  compression?: boolean;
  authRequired?: boolean;
}

export interface WSClientOptions {
  url: string;
  autoConnect?: boolean;
  autoReconnect?: boolean;
  reconnectMaxAttempts?: number;
  reconnectBaseDelay?: number;
  reconnectMaxDelay?: number;
  heartbeatInterval?: number;
  authToken?: string;
  debug?: boolean;
}

// ============================================================================
// Message Types
// ============================================================================

export interface WSMessage {
  type: string;
  payload?: unknown;
  data?: unknown;
  id?: string;
  timestamp?: number;
  seq?: number;
  success?: boolean;
  error?: {
    code: string;
    message: string;
  };
}

export interface WSRequest extends WSMessage {
  id: string;
  requestId?: string;
}

export interface WSResponse extends WSMessage {
  id: string;
  requestId?: string;
  success: boolean;
  data?: unknown;
  error?: {
    code: string;
    message: string;
  };
}

// MessageHandler uses Connection type defined above
export type MessageHandler = (
  message: WSRequest,
  connection: Connection
) => Promise<unknown> | unknown;

export type WSMiddleware = (
  message: WSRequest,
  connection: Connection,
  next: () => void
) => void | Promise<void>;

// ============================================================================
// Channel Types
// ============================================================================

export type ChannelType =
  | 'prices'
  | 'market'
  | 'wallet'
  | 'transactions'
  | 'notifications'
  | 'alerts'
  | 'system';

export interface ChannelSubscription {
  channel: string;
  socketId: string;
  subscribedAt: number;
  filters?: Record<string, unknown>;
}

// ============================================================================
// Price Types
// ============================================================================

// Simple type alias for price sources
export type PriceSource = 'aggregated' | 'coingecko' | 'binance' | 'coinbase' | 'kraken' | 'custom';

export interface Price {
  symbol: string;
  price: number;
  currency?: string;
  change24h?: number;
  change24hPercent?: number;
  changePercent24h?: number;
  volume24h?: number;
  marketCap?: number;
  high24h?: number;
  low24h?: number;
  timestamp: number;
  source?: PriceSource | string;
}

export interface PriceUpdate {
  symbol: string;
  price: Price;
  previousPrice: number;
  change: number;
  changePercent: number;
  timestamp: number;
}

export interface PriceBatch {
  updates: PriceUpdate[];
  timestamp: number;
  count?: number;
  source?: PriceSource | string;
}

export interface TokenMove {
  symbol: string;
  name: string;
  price: number;
  change: number;
  changePercent: number;
  volume: number;
}

export interface Trade {
  id: string;
  symbol: string;
  price: number;
  amount: number;
  side: 'buy' | 'sell';
  timestamp: number;
}

export interface MarketOverview {
  totalMarketCap: number;
  totalVolume24h?: number;
  totalVolume?: number;
  btcDominance: number;
  ethDominance: number;
  activeCoins?: number;
  gainers?: number;
  losers?: number;
  unchanged?: number;
  topGainers?: TokenMove[];
  topLosers?: TokenMove[];
  recentTrades?: Trade[];
  lastUpdated?: number;
  timestamp?: number;
}

export type PriceCallback = (price: Price) => void;

export interface PriceSourceConfig {
  id: string;
  name: string;
  priority: number;
  enabled: boolean;
  getPrice?(symbol: string): Promise<Price>;
  subscribe?(symbols: string[], callback: PriceCallback): void;
  unsubscribe?(symbols: string[]): void;
}

// ============================================================================
// Transaction Types
// ============================================================================

export type TransactionStatusType =
  | 'pending'
  | 'confirming'
  | 'confirmed'
  | 'failed'
  | 'dropped';

export interface TransactionStatus {
  hash: string;
  chain: number | string;
  status: TransactionStatusType;
  confirmations: number;
  requiredConfirmations: number;
  gasUsed?: string | bigint;
  effectiveGasPrice?: string | bigint;
  blockNumber?: number;
  timestamp?: number;
  error?: string;
}

export interface BalanceChange {
  address: string;
  chain: number | string;
  token: string;
  tokenAddress?: string;
  previousBalance: string;
  newBalance: string;
  change: string;
  timestamp: number;
}

export interface Approval {
  token: string;
  tokenAddress: string;
  spender: string;
  amount: string;
  chain: number;
  timestamp: number;
}

export interface NFTTransfer {
  contractAddress: string;
  tokenId: string;
  from: string;
  to: string;
  chain: number;
  timestamp: number;
}

export interface WalletUpdate {
  type: 'balance' | 'transaction' | 'approval' | 'nft';
  address: string;
  chain: number | string;
  data: Record<string, unknown> | BalanceChange | TransactionStatus | Approval | NFTTransfer;
  timestamp: number;
}

export interface Block {
  number: number;
  hash: string;
  chain: string;
  timestamp: number;
  transactionCount: number;
  gasUsed?: string | bigint;
  gasLimit?: string | bigint;
}

export interface EventFilter {
  address?: string;
  topics?: (string | null)[];
  fromBlock?: number;
}

export type ConfirmationCallback = (tx: TransactionStatus) => void;
export type FailureCallback = (tx: TransactionStatus, error: Error) => void;

// ============================================================================
// Notification Types
// ============================================================================

export type NotificationType =
  | 'price_alert'
  | 'transaction_confirmed'
  | 'transaction_failed'
  | 'subscription_renewal'
  | 'payment_received'
  | 'security_warning'
  | 'system_announcement'
  | 'marketplace_update'
  | 'wallet_connected'
  | 'wallet_disconnected';

export type NotificationPriority = 'low' | 'medium' | 'high' | 'urgent';

export interface Notification {
  id: string;
  type: NotificationType;
  title: string;
  message: string;
  body?: string;
  data?: Record<string, unknown>;
  priority: NotificationPriority | 'low' | 'medium' | 'high' | 'critical';
  timestamp: number;
  read: boolean;
  readAt?: number;
  dismissedAt?: number;
  expiresAt?: number;
  actions?: Array<{ id: string; label: string; action: string }>;
  actionUrl?: string;
  actionLabel?: string;
}

export type AlertCondition =
  | 'price_above'
  | 'price_below'
  | 'change_percent_above'
  | 'change_percent_below'
  | 'volume_above'
  | 'portfolio_change'
  | 'gt'
  | 'lt'
  | 'gte'
  | 'lte'
  | 'eq'
  | 'neq'
  | 'contains'
  | 'between';

export interface AlertRule {
  id: string;
  userId?: string;
  name: string;
  type?: string;
  message?: string;
  condition?: AlertCondition;
  conditions?: Array<{
    field: string;
    operator: AlertCondition;
    value: unknown;
  }>;
  symbol?: string;
  threshold?: number;
  enabled: boolean;
  triggered?: boolean;
  triggerCount?: number;
  lastTriggered?: number;
  lastTriggeredAt?: number;
  cooldownMinutes?: number;
  createdAt: number;
}

// ============================================================================
// Event Types
// ============================================================================

export type WSEventType =
  | 'connect'
  | 'disconnect'
  | 'reconnect'
  | 'reconnecting'
  | 'error'
  | 'message'
  | 'subscribe'
  | 'unsubscribe';

export type EventHandler = (data: unknown) => void;

// ============================================================================
// State Sync Types
// ============================================================================

export interface SyncState {
  lastSeq: number;
  subscriptions: string[];
  pendingMessages: WSMessage[];
  optimisticUpdates: Map<string, unknown>;
}

export interface Update {
  id: string;
  type: string;
  data: unknown;
  timestamp: number;
}
