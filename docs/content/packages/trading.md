# Trading Package

The trading package provides integrations with centralized exchanges (CEXs) for spot and futures trading.

## Installation

```bash
npm install @universal-crypto-mcp/trading-binance
npm install @universal-crypto-mcp/trading-binance-us
```

## Supported Exchanges

| Exchange | Package | Features |
|----------|---------|----------|
| Binance | `trading-binance` | Spot, Futures, Margin |
| Binance US | `trading-binance-us` | Spot |

## Configuration

### Environment Variables

```bash
# Binance
BINANCE_API_KEY=your-api-key
BINANCE_API_SECRET=your-api-secret

# Binance US
BINANCE_US_API_KEY=your-us-api-key
BINANCE_US_API_SECRET=your-us-api-secret
```

### Programmatic Configuration

```typescript
import { createBinanceTrading } from "@universal-crypto-mcp/trading-binance";

const trading = createBinanceTrading({
  apiKey: process.env.BINANCE_API_KEY,
  apiSecret: process.env.BINANCE_API_SECRET,
  sandbox: false,  // Set true for testnet
});
```

## Available Tools

### Account Tools

| Tool | Description |
|------|-------------|
| `binance_account_info` | Get account information |
| `binance_balances` | Get all balances |
| `binance_balance` | Get specific asset balance |
| `binance_deposit_address` | Get deposit address |
| `binance_withdraw` | Withdraw funds |

### Market Data Tools

| Tool | Description |
|------|-------------|
| `binance_ticker` | Get 24h ticker |
| `binance_orderbook` | Get order book |
| `binance_trades` | Get recent trades |
| `binance_klines` | Get candlestick data |
| `binance_exchange_info` | Get exchange info |

### Trading Tools

| Tool | Description |
|------|-------------|
| `binance_place_order` | Place a new order |
| `binance_cancel_order` | Cancel an order |
| `binance_open_orders` | Get open orders |
| `binance_order_status` | Get order status |
| `binance_trade_history` | Get trade history |

### Futures Tools (Binance only)

| Tool | Description |
|------|-------------|
| `binance_futures_position` | Get futures positions |
| `binance_futures_order` | Place futures order |
| `binance_set_leverage` | Set leverage |
| `binance_funding_rate` | Get funding rate |

## Usage Examples

### Get Account Balance

```typescript
import { registerBinanceTools } from "@universal-crypto-mcp/trading-binance";

// Register tools with MCP server
registerBinanceTools(server, {
  apiKey: process.env.BINANCE_API_KEY,
  apiSecret: process.env.BINANCE_API_SECRET,
});

// The AI can now use: "Check my Binance BTC balance"
```

### Place a Spot Order

```typescript
// AI command: "Buy 0.001 BTC at market price"
// Tool called: binance_place_order
// Parameters:
{
  symbol: "BTCUSDT",
  side: "BUY",
  type: "MARKET",
  quantity: 0.001
}
```

### Get Price Data

```typescript
// AI command: "What's the current BTC price on Binance?"
// Tool called: binance_ticker
// Parameters:
{
  symbol: "BTCUSDT"
}

// Response:
{
  symbol: "BTCUSDT",
  priceChange: "1234.56",
  priceChangePercent: "2.34",
  lastPrice: "67890.12",
  highPrice: "68500.00",
  lowPrice: "66000.00",
  volume: "12345.678"
}
```

### Get Candlestick Data

```typescript
// AI command: "Get hourly BTC candles for the last day"
// Tool called: binance_klines
// Parameters:
{
  symbol: "BTCUSDT",
  interval: "1h",
  limit: 24
}
```

## Order Types

### Market Order

```typescript
{
  symbol: "BTCUSDT",
  side: "BUY",
  type: "MARKET",
  quantity: 0.001
}
```

### Limit Order

```typescript
{
  symbol: "BTCUSDT",
  side: "BUY",
  type: "LIMIT",
  quantity: 0.001,
  price: 65000,
  timeInForce: "GTC"
}
```

### Stop Loss

```typescript
{
  symbol: "BTCUSDT",
  side: "SELL",
  type: "STOP_LOSS_LIMIT",
  quantity: 0.001,
  price: 60000,
  stopPrice: 60100
}
```

### OCO Order

```typescript
{
  symbol: "BTCUSDT",
  side: "SELL",
  quantity: 0.001,
  price: 70000,         // Take profit
  stopPrice: 60000,     // Stop loss trigger
  stopLimitPrice: 59900 // Stop loss limit
}
```

## Futures Trading

### Open a Long Position

```typescript
// Set leverage first
{
  symbol: "BTCUSDT",
  leverage: 10
}

// Place futures order
{
  symbol: "BTCUSDT",
  side: "BUY",
  type: "MARKET",
  quantity: 0.01
}
```

### Check Positions

```typescript
// AI command: "Show my open futures positions"
// Tool called: binance_futures_position

// Response:
{
  positions: [
    {
      symbol: "BTCUSDT",
      entryPrice: "67000.00",
      markPrice: "67500.00",
      unrealizedPnl: "50.00",
      leverage: 10,
      positionSide: "LONG"
    }
  ]
}
```

## Error Handling

```typescript
import { TradingError, InsufficientBalanceError } from "@universal-crypto-mcp/trading-binance";

try {
  await placeOrder(params);
} catch (error) {
  if (error instanceof InsufficientBalanceError) {
    console.log("Not enough balance:", error.required);
  } else if (error.code === -2010) {
    console.log("Account has insufficient balance");
  }
}
```

## Security Best Practices

1. **API Key Permissions**: Only enable required permissions
2. **IP Whitelisting**: Restrict API access to specific IPs
3. **Withdrawal Limits**: Set withdrawal address whitelist
4. **Test First**: Use testnet for development
5. **Small Amounts**: Start with small trade amounts

## Rate Limits

The package automatically handles rate limiting:

- Request weight tracking
- Automatic backoff on limit hit
- Order rate limit protection

## Related Packages

- [Market Data Package](market-data.md) - Additional price sources
- [Wallets Package](wallets.md) - On-chain wallet management
- [DeFi Package](defi.md) - DEX trading
