# AGENT 11: WEBSOCKET REAL-TIME SYSTEM
## 5-Phase Implementation Prompts

---

## PROMPT 1: WEBSOCKET SERVER INFRASTRUCTURE

**Context:** Build WebSocket infrastructure for real-time updates across the platform.

**Objective:** Create scalable WebSocket server with connection management and message routing.

**Requirements:**
1. **WebSocket Server** (`website-unified/lib/websocket/server.ts`)
   ```typescript
   class WebSocketServer {
     constructor(options: WSServerOptions);
     
     // Connection management
     handleConnection(socket: WebSocket, request: Request): void;
     handleDisconnection(socketId: string): void;
     
     // Message handling
     handleMessage(socketId: string, message: WSMessage): void;
     broadcast(channel: string, data: unknown): void;
     sendToUser(userId: string, data: unknown): void;
     
     // Channel management
     subscribe(socketId: string, channel: string): void;
     unsubscribe(socketId: string, channel: string): void;
   }
   ```

2. **Connection Manager** (`website-unified/lib/websocket/connectionManager.ts`)
   ```typescript
   class ConnectionManager {
     // Track active connections
     connections: Map<string, Connection>;
     userConnections: Map<string, Set<string>>;
     channelSubscriptions: Map<string, Set<string>>;
     
     // Connection lifecycle
     addConnection(socket: WebSocket, userId?: string): string;
     removeConnection(socketId: string): void;
     getConnection(socketId: string): Connection | undefined;
     
     // User mapping
     associateUser(socketId: string, userId: string): void;
     getUserConnections(userId: string): Connection[];
   }
   ```

3. **Message Router** (`website-unified/lib/websocket/messageRouter.ts`)
   ```typescript
   class MessageRouter {
     // Route definitions
     routes: Map<string, MessageHandler>;
     
     // Register handlers
     register(type: string, handler: MessageHandler): void;
     
     // Route message
     route(socketId: string, message: WSMessage): Promise<void>;
     
     // Middleware
     use(middleware: WSMiddleware): void;
   }
   ```

4. **Heartbeat & Health** (`website-unified/lib/websocket/heartbeat.ts`)
   - Ping/pong mechanism
   - Connection timeout detection
   - Automatic reconnection prompt
   - Health status reporting
   - Connection quality metrics

**Technical Stack:**
- ws or Socket.io
- Redis for pub/sub scaling
- Authentication middleware
- TypeScript strict mode
- Compression support

**Deliverables:**
- WebSocket server implementation
- Connection management system
- Message routing framework
- Health monitoring

---

## PROMPT 2: REAL-TIME PRICE FEEDS

**Context:** Implement real-time price streaming for tokens and market data.

**Objective:** Build price feed system with WebSocket distribution.

**Requirements:**
1. **Price Feed Aggregator** (`website-unified/lib/websocket/feeds/priceAggregator.ts`)
   ```typescript
   class PriceAggregator {
     // Data sources
     sources: PriceSource[];
     
     // Start aggregation
     start(): void;
     
     // Get latest price
     getPrice(symbol: string): Price;
     
     // Subscribe to updates
     onPrice(symbol: string, callback: PriceCallback): void;
     
     // Source management
     addSource(source: PriceSource): void;
     removeSource(sourceId: string): void;
   }
   ```

2. **Price Channels** (`website-unified/lib/websocket/channels/priceChannel.ts`)
   ```typescript
   // Channel: prices:{symbol}
   // Message format:
   interface PriceUpdate {
     symbol: string;
     price: number;
     change24h: number;
     volume24h: number;
     timestamp: number;
     source: string;
   }
   
   // Batch updates for efficiency
   interface PriceBatch {
     updates: PriceUpdate[];
     timestamp: number;
   }
   ```

3. **Market Overview Channel** (`website-unified/lib/websocket/channels/marketChannel.ts`)
   ```typescript
   // Channel: market:overview
   interface MarketOverview {
     totalMarketCap: number;
     totalVolume: number;
     btcDominance: number;
     topMovers: TokenMove[];
     recentTrades: Trade[];
   }
   ```

4. **Client Price Subscription** (`website-unified/hooks/usePriceStream.ts`)
   ```typescript
   function usePriceStream(symbols: string[]): {
     prices: Map<string, Price>;
     loading: boolean;
     error: Error | null;
     subscribe: (symbol: string) => void;
     unsubscribe: (symbol: string) => void;
   }
   ```

**Technical Requirements:**
- Multiple price source integration
- Price averaging/TWAP
- Stale price detection
- Efficient batch updates
- Client-side throttling

**Deliverables:**
- Price aggregation system
- Real-time price channels
- Client subscription hooks
- Market overview streaming

---

## PROMPT 3: TRANSACTION & WALLET UPDATES

**Context:** Stream real-time transaction and wallet state updates.

**Objective:** Build notification system for wallet activities and transaction confirmations.

**Requirements:**
1. **Transaction Monitor** (`website-unified/lib/websocket/feeds/transactionMonitor.ts`)
   ```typescript
   class TransactionMonitor {
     // Watch pending transaction
     watch(txHash: string, chain: number): void;
     
     // Stop watching
     unwatch(txHash: string): void;
     
     // Get status
     getStatus(txHash: string): TransactionStatus;
     
     // Events
     onConfirmation(callback: ConfirmationCallback): void;
     onFailure(callback: FailureCallback): void;
   }
   ```

2. **Wallet Update Channel** (`website-unified/lib/websocket/channels/walletChannel.ts`)
   ```typescript
   // Channel: wallet:{address}
   interface WalletUpdate {
     type: 'balance' | 'transaction' | 'approval' | 'nft';
     address: string;
     chain: number;
     data: BalanceChange | Transaction | Approval | NFTTransfer;
     timestamp: number;
   }
   ```

3. **Block Listener** (`website-unified/lib/websocket/feeds/blockListener.ts`)
   ```typescript
   class BlockListener {
     // Listen to new blocks
     subscribeBlocks(chain: number): void;
     
     // Listen to specific events
     subscribeEvents(chain: number, filter: EventFilter): void;
     
     // Get latest block
     getLatestBlock(chain: number): Block;
   }
   ```

4. **Client Wallet Hook** (`website-unified/hooks/useWalletUpdates.ts`)
   ```typescript
   function useWalletUpdates(address: string): {
     pendingTxs: Transaction[];
     recentActivity: Activity[];
     balanceChanges: BalanceChange[];
     subscribe: () => void;
     unsubscribe: () => void;
   }
   ```

**Technical Requirements:**
- Multi-chain block subscriptions
- Transaction confirmation tracking
- Event log parsing
- Balance change detection
- NFT transfer monitoring

**Deliverables:**
- Transaction monitoring system
- Wallet update streaming
- Block listener
- Client-side hooks

---

## PROMPT 4: NOTIFICATION & ALERT SYSTEM

**Context:** Build real-time notification delivery for alerts and system events.

**Objective:** Create comprehensive notification system with multiple delivery channels.

**Requirements:**
1. **Notification Hub** (`website-unified/lib/websocket/notifications/hub.ts`)
   ```typescript
   class NotificationHub {
     // Send notification
     send(userId: string, notification: Notification): Promise<void>;
     
     // Broadcast to all
     broadcast(notification: Notification): Promise<void>;
     
     // Send to channel subscribers
     sendToChannel(channel: string, notification: Notification): Promise<void>;
     
     // Mark as read
     markRead(userId: string, notificationId: string): Promise<void>;
     
     // Get unread count
     getUnreadCount(userId: string): Promise<number>;
   }
   ```

2. **Alert Engine** (`website-unified/lib/websocket/notifications/alertEngine.ts`)
   ```typescript
   class AlertEngine {
     // Register alert rule
     registerAlert(userId: string, rule: AlertRule): string;
     
     // Evaluate alerts
     evaluate(data: PriceData | PortfolioData): void;
     
     // Trigger alert
     triggerAlert(alertId: string, data: unknown): Promise<void>;
     
     // Manage alerts
     getAlerts(userId: string): AlertRule[];
     deleteAlert(alertId: string): void;
   }
   ```

3. **Notification Types** (`website-unified/lib/websocket/notifications/types.ts`)
   ```typescript
   type NotificationType =
     | 'price_alert'
     | 'transaction_confirmed'
     | 'transaction_failed'
     | 'subscription_renewal'
     | 'payment_received'
     | 'security_warning'
     | 'system_announcement'
     | 'marketplace_update';
   
   interface Notification {
     id: string;
     type: NotificationType;
     title: string;
     body: string;
     data: unknown;
     priority: 'low' | 'medium' | 'high' | 'urgent';
     timestamp: number;
     read: boolean;
   }
   ```

4. **Client Notification Hook** (`website-unified/hooks/useNotifications.ts`)
   ```typescript
   function useNotifications(): {
     notifications: Notification[];
     unreadCount: number;
     markAsRead: (id: string) => void;
     markAllRead: () => void;
     dismiss: (id: string) => void;
   }
   ```

**Technical Requirements:**
- Real-time delivery
- Notification persistence
- Read/unread tracking
- Priority handling
- Batch notifications

**Deliverables:**
- Notification hub
- Alert evaluation engine
- Notification types
- Client hooks

---

## PROMPT 5: WEBSOCKET CLIENT & RECONNECTION

**Context:** Build robust WebSocket client with automatic reconnection and state sync.

**Objective:** Create resilient client-side WebSocket management.

**Requirements:**
1. **WebSocket Client** (`website-unified/lib/websocket/client.ts`)
   ```typescript
   class WebSocketClient {
     constructor(url: string, options: WSClientOptions);
     
     // Connection
     connect(): Promise<void>;
     disconnect(): void;
     
     // Messaging
     send(type: string, data: unknown): void;
     subscribe(channel: string): void;
     unsubscribe(channel: string): void;
     
     // Event handlers
     on(event: string, handler: EventHandler): void;
     off(event: string, handler: EventHandler): void;
   }
   ```

2. **Reconnection Manager** (`website-unified/lib/websocket/reconnection.ts`)
   ```typescript
   class ReconnectionManager {
     // Exponential backoff
     backoff: ExponentialBackoff;
     
     // Attempt reconnection
     reconnect(): Promise<void>;
     
     // State recovery
     recoverState(): Promise<void>;
     
     // Connection quality
     getQuality(): ConnectionQuality;
   }
   ```

3. **State Synchronization** (`website-unified/lib/websocket/stateSync.ts`)
   ```typescript
   class StateSync {
     // Sync on reconnect
     syncState(): Promise<void>;
     
     // Track missed messages
     getMissedMessages(lastSeq: number): Message[];
     
     // Optimistic updates
     applyOptimistic(update: Update): void;
     confirmUpdate(updateId: string): void;
     rollbackUpdate(updateId: string): void;
   }
   ```

4. **WebSocket Provider** (`website-unified/providers/WebSocketProvider.tsx`)
   ```typescript
   function WebSocketProvider({ children }: PropsWithChildren) {
     // Connection state
     const [connected, setConnected] = useState(false);
     const [connecting, setConnecting] = useState(false);
     
     // Auto-connect on mount
     // Auto-reconnect on disconnect
     // Provide context to children
   }
   ```

**Technical Requirements:**
- Automatic reconnection
- Exponential backoff
- State recovery
- Message queuing when disconnected
- Connection status UI

**Deliverables:**
- WebSocket client library
- Reconnection handling
- State synchronization
- React context provider

---

**Integration Notes:**
- Integrate with API routes (Agent 9)
- Use for payment status (Agent 10)
- Power analytics updates (Agent 5)
- Wallet updates integration (Agent 4)
- Auth token refresh (Agent 12)

**Success Criteria:**
- < 100ms message delivery
- 99.9% uptime
- Automatic reconnection < 5s
- State recovery on reconnect
- Efficient bandwidth usage
- Mobile battery friendly
- Horizontal scaling support
