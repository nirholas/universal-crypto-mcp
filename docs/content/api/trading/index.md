---
title: "Trading API Reference"
description: "API documentation for trading and CEX integration packages"
category: "api"
keywords: ["api", "trading", "binance", "cex", "bots", "exchange"]
order: 4
---

# Trading & CEX API Reference

Trading packages provide integrations with centralized exchanges and automated trading capabilities.

## Packages

| Package | Description |
|---------|-------------|
| `@nirholas/trading-spot-exchange` | Binance spot trading |
| `@nirholas/trading-spot-exchange-us` | Binance US integration |
| `@nirholas/trading-futures-exchange` | Futures trading |
| `@nirholas/trading-memecoin-bot` | Memecoin trading bot |
| `@nirholas/trading-bsc-meme-bot` | BSC meme trading |
| `@nirholas/trading-bots` | Trading bot framework |

---

## Binance Spot Trading

### Installation

```bash
pnpm add @nirholas/trading-spot-exchange
```

### Configuration

```typescript
import { BinanceClient } from '@nirholas/trading-spot-exchange'

const client = new BinanceClient({
  apiKey: process.env.BINANCE_API_KEY!,
  apiSecret: process.env.BINANCE_API_SECRET!,
  testnet: false, // Use true for testnet
})
```

### Market Data

#### getPrice

Get current price for a symbol.

```typescript
async function getPrice(symbol: string): Promise<PriceResult>

interface PriceResult {
  symbol: string
  price: string
  timestamp: number
}
```

**Example:**

```typescript
const price = await client.getPrice('BTCUSDT')
console.log(`BTC Price: $${price.price}`)
```

#### getOrderBook

Get order book depth.

```typescript
async function getOrderBook(
  symbol: string, 
  limit?: number
): Promise<OrderBook>

interface OrderBook {
  bids: [string, string][]  // [price, quantity]
  asks: [string, string][]
  lastUpdateId: number
}
```

#### getTicker24h

Get 24-hour ticker statistics.

```typescript
async function getTicker24h(symbol: string): Promise<Ticker24h>

interface Ticker24h {
  symbol: string
  priceChange: string
  priceChangePercent: string
  weightedAvgPrice: string
  lastPrice: string
  lastQty: string
  openPrice: string
  highPrice: string
  lowPrice: string
  volume: string
  quoteVolume: string
  openTime: number
  closeTime: number
  count: number
}
```

#### getKlines

Get candlestick/kline data.

```typescript
async function getKlines(params: KlineParams): Promise<Kline[]>

interface KlineParams {
  symbol: string
  interval: '1m' | '5m' | '15m' | '1h' | '4h' | '1d' | '1w'
  limit?: number
  startTime?: number
  endTime?: number
}

interface Kline {
  openTime: number
  open: string
  high: string
  low: string
  close: string
  volume: string
  closeTime: number
  quoteVolume: string
  trades: number
  takerBuyBaseVolume: string
  takerBuyQuoteVolume: string
}
```

---

### Order Management

#### createOrder

Place a new order.

```typescript
async function createOrder(params: OrderParams): Promise<Order>

interface OrderParams {
  symbol: string
  side: 'BUY' | 'SELL'
  type: 'LIMIT' | 'MARKET' | 'STOP_LOSS_LIMIT' | 'TAKE_PROFIT_LIMIT'
  quantity: string
  price?: string          // Required for LIMIT orders
  stopPrice?: string      // For stop orders
  timeInForce?: 'GTC' | 'IOC' | 'FOK'
}
```

**Examples:**

```typescript
// Market buy
const marketOrder = await client.createOrder({
  symbol: 'BTCUSDT',
  side: 'BUY',
  type: 'MARKET',
  quantity: '0.001',
})

// Limit sell
const limitOrder = await client.createOrder({
  symbol: 'BTCUSDT',
  side: 'SELL',
  type: 'LIMIT',
  quantity: '0.001',
  price: '50000',
  timeInForce: 'GTC',
})

// Stop-loss
const stopLoss = await client.createOrder({
  symbol: 'BTCUSDT',
  side: 'SELL',
  type: 'STOP_LOSS_LIMIT',
  quantity: '0.001',
  price: '44000',
  stopPrice: '45000',
  timeInForce: 'GTC',
})
```

#### cancelOrder

Cancel an existing order.

```typescript
async function cancelOrder(
  symbol: string, 
  orderId: number
): Promise<CancelResult>
```

#### cancelAllOrders

Cancel all open orders for a symbol.

```typescript
async function cancelAllOrders(symbol: string): Promise<CancelResult[]>
```

#### getOrder

Get order details.

```typescript
async function getOrder(
  symbol: string, 
  orderId: number
): Promise<Order>

interface Order {
  symbol: string
  orderId: number
  clientOrderId: string
  price: string
  origQty: string
  executedQty: string
  status: OrderStatus
  type: string
  side: string
  time: number
  updateTime: number
}

type OrderStatus = 
  | 'NEW'
  | 'PARTIALLY_FILLED'
  | 'FILLED'
  | 'CANCELED'
  | 'REJECTED'
  | 'EXPIRED'
```

#### getOpenOrders

Get all open orders.

```typescript
async function getOpenOrders(symbol?: string): Promise<Order[]>
```

#### getOrderHistory

Get historical orders.

```typescript
async function getOrderHistory(params: HistoryParams): Promise<Order[]>

interface HistoryParams {
  symbol: string
  startTime?: number
  endTime?: number
  limit?: number
}
```

---

### Account & Portfolio

#### getAccountInfo

Get account information including balances.

```typescript
async function getAccountInfo(): Promise<AccountInfo>

interface AccountInfo {
  makerCommission: number
  takerCommission: number
  buyerCommission: number
  sellerCommission: number
  canTrade: boolean
  canWithdraw: boolean
  canDeposit: boolean
  updateTime: number
  accountType: string
  balances: Balance[]
}

interface Balance {
  asset: string
  free: string
  locked: string
}
```

#### getBalance

Get balance for a specific asset.

```typescript
async function getBalance(asset: string): Promise<Balance>
```

#### getTrades

Get recent trades for a symbol.

```typescript
async function getTrades(params: TradeParams): Promise<Trade[]>

interface Trade {
  symbol: string
  id: number
  orderId: number
  price: string
  qty: string
  quoteQty: string
  commission: string
  commissionAsset: string
  time: number
  isBuyer: boolean
  isMaker: boolean
}
```

---

### WebSocket Streams

#### subscribeToTicker

Subscribe to real-time ticker updates.

```typescript
function subscribeToTicker(
  symbol: string,
  callback: (ticker: TickerUpdate) => void
): () => void  // Returns unsubscribe function
```

#### subscribeToTrades

Subscribe to real-time trade updates.

```typescript
function subscribeToTrades(
  symbol: string,
  callback: (trade: TradeUpdate) => void
): () => void
```

#### subscribeToKlines

Subscribe to real-time candlestick updates.

```typescript
function subscribeToKlines(
  symbol: string,
  interval: string,
  callback: (kline: KlineUpdate) => void
): () => void
```

#### subscribeToDepth

Subscribe to order book updates.

```typescript
function subscribeToDepth(
  symbol: string,
  callback: (depth: DepthUpdate) => void
): () => void
```

**Example:**

```typescript
// Subscribe to BTC price updates
const unsubscribe = client.subscribeToTicker('BTCUSDT', (ticker) => {
  console.log(`BTC: $${ticker.lastPrice} (${ticker.priceChangePercent}%)`)
})

// Later: unsubscribe
unsubscribe()
```

---

## Futures Trading

### Installation

```bash
pnpm add @nirholas/trading-futures-exchange
```

### Configuration

```typescript
import { FuturesClient } from '@nirholas/trading-futures-exchange'

const futures = new FuturesClient({
  apiKey: process.env.BINANCE_API_KEY!,
  apiSecret: process.env.BINANCE_API_SECRET!,
  testnet: true, // Recommended for testing
})
```

### Position Management

#### openPosition

Open a futures position.

```typescript
async function openPosition(params: FuturesOrderParams): Promise<FuturesOrder>

interface FuturesOrderParams {
  symbol: string
  side: 'BUY' | 'SELL'
  type: 'LIMIT' | 'MARKET' | 'STOP' | 'TAKE_PROFIT'
  quantity: string
  price?: string
  stopPrice?: string
  reduceOnly?: boolean
  closePosition?: boolean
}
```

#### closePosition

Close a futures position.

```typescript
async function closePosition(
  symbol: string, 
  side: 'BUY' | 'SELL'
): Promise<FuturesOrder>
```

#### getPosition

Get current position for a symbol.

```typescript
async function getPosition(symbol: string): Promise<FuturesPosition>

interface FuturesPosition {
  symbol: string
  positionAmt: string
  entryPrice: string
  markPrice: string
  unRealizedProfit: string
  liquidationPrice: string
  leverage: string
  marginType: 'isolated' | 'cross'
  positionSide: 'BOTH' | 'LONG' | 'SHORT'
}
```

#### setLeverage

Set leverage for a symbol.

```typescript
async function setLeverage(
  symbol: string, 
  leverage: number
): Promise<void>
```

#### setMarginType

Set margin type (isolated/cross).

```typescript
async function setMarginType(
  symbol: string,
  marginType: 'ISOLATED' | 'CROSSED'
): Promise<void>
```

---

## Trading Bots

### Installation

```bash
pnpm add @nirholas/trading-bots
```

### Bot Framework

#### createBot

Create a trading bot instance.

```typescript
function createBot(config: BotConfig): TradingBot

interface BotConfig {
  name: string
  exchange: 'binance' | 'binance_us'
  symbols: string[]
  strategy: Strategy
  riskManagement: RiskConfig
  notifications?: NotificationConfig
}

interface RiskConfig {
  maxPositionSize: string      // % of portfolio
  maxDailyLoss: string         // % of portfolio
  stopLossPercent: number
  takeProfitPercent: number
  maxOpenPositions: number
}
```

#### Built-in Strategies

```typescript
// Grid trading
const gridStrategy = createGridStrategy({
  lowerPrice: '40000',
  upperPrice: '50000',
  gridLevels: 10,
  orderSize: '0.001',
})

// DCA (Dollar Cost Averaging)
const dcaStrategy = createDCAStrategy({
  interval: '1h',
  amount: '100',
  symbol: 'BTCUSDT',
})

// Mean reversion
const meanReversionStrategy = createMeanReversionStrategy({
  period: 20,
  stdDevThreshold: 2,
  orderSize: '0.001',
})
```

#### Bot Lifecycle

```typescript
const bot = createBot(config)

// Start the bot
await bot.start()

// Get bot status
const status = bot.getStatus()
console.log(status.isRunning, status.openPositions, status.pnl)

// Stop the bot
await bot.stop()

// Get performance metrics
const metrics = bot.getPerformance()
console.log(metrics.totalTrades, metrics.winRate, metrics.sharpeRatio)
```

---

## Memecoin Trading Bot

### Installation

```bash
pnpm add @nirholas/trading-memecoin-bot
```

### Quick Start

```typescript
import { MemecoinBot } from '@nirholas/trading-memecoin-bot'

const bot = new MemecoinBot({
  chain: 'ethereum', // or 'bsc', 'base', 'arbitrum'
  privateKey: process.env.PRIVATE_KEY!,
  maxBuyAmount: '0.1', // ETH
  slippage: 0.15,      // 15%
  gasMultiplier: 1.5,
})

// Monitor for new tokens
bot.on('newToken', async (token) => {
  // Check token safety
  const analysis = await bot.analyzeToken(token.address)
  
  if (analysis.isHoneypot) {
    console.log('Honeypot detected, skipping')
    return
  }
  
  if (analysis.buyTax > 10 || analysis.sellTax > 10) {
    console.log('High tax token, skipping')
    return
  }
  
  // Buy if safe
  await bot.buy(token.address, '0.05')
})

// Start monitoring
await bot.start()
```

### Safety Analysis

```typescript
interface TokenAnalysis {
  address: string
  name: string
  symbol: string
  isHoneypot: boolean
  buyTax: number
  sellTax: number
  isRenounced: boolean
  isLiquidityLocked: boolean
  lpLockDuration?: number
  holderCount: number
  top10HolderPercent: number
  creatorBalance: number
  riskScore: number  // 0-100, lower is better
}
```

---

## Error Types

```typescript
class TradingError extends Error {
  code: string
}

// Order errors
class InsufficientBalanceError extends TradingError {}
class InvalidOrderError extends TradingError {}
class OrderNotFoundError extends TradingError {}
class OrderRejectedError extends TradingError {}

// Position errors
class PositionNotFoundError extends TradingError {}
class MarginInsufficientError extends TradingError {}
class LiquidationRiskError extends TradingError {}

// Connection errors
class RateLimitError extends TradingError {}
class APIError extends TradingError {}
class WebSocketError extends TradingError {}
```
