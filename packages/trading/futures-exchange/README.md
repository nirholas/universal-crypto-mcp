# Binance MCP Server

> Complete Binance exchange integration for trading, market data, and account management.

## Attribution

**Original Author:** [ethancod1ng](https://github.com/ethancod1ng)  
**Original Repository:** [binance-mcp-server](https://github.com/ethancod1ng/binance-mcp-server)  
**License:** MIT

**Integration & Enhancements by:** Nich ([@nichxbt](https://x.com/nichxbt))

## Features

### From Original Implementation
- ✅ Market data (prices, tickers, order books)
- ✅ Kline/candlestick data
- ✅ Account balances
- ✅ Order placement (market, limit)
- ✅ Order cancellation
- ✅ Order history
- ✅ Trade history

### Our Enhancements (Apache-2.0)
- ✅ Unified API compatibility
- ✅ Smart order routing
- ✅ Position management
- ✅ PnL tracking
- ✅ Risk management tools
- ✅ Multi-account support

## Supported Markets

| Market | Status |
|--------|--------|
| Spot | ✅ Full support |
| Futures (USDT-M) | ✅ Full support |
| Futures (COIN-M) | ✅ Full support |
| Margin | ✅ Full support |

## Installation

```bash
pnpm add @nirholas/binance-mcp
```

## Configuration

Set your API credentials:

```bash
export BINANCE_API_KEY=your_api_key
export BINANCE_API_SECRET=your_api_secret
```

## Usage

### With MCP Server

```typescript
import { registerBinanceTools } from '@nirholas/binance-mcp';
import { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';

const server = new McpServer({ name: 'my-trading-server', version: '1.0.0' });
registerBinanceTools(server);
```

### Standalone

```typescript
import { BinanceClient } from '@nirholas/binance-mcp';

const client = new BinanceClient({
  apiKey: process.env.BINANCE_API_KEY,
  apiSecret: process.env.BINANCE_API_SECRET,
});

// Get Bitcoin price
const btcPrice = await client.getPrice('BTCUSDT');

// Place a market order
const order = await client.placeOrder({
  symbol: 'BTCUSDT',
  side: 'BUY',
  type: 'MARKET',
  quantity: 0.001,
});

// Get account balance
const balance = await client.getBalance();
```

## Available Tools

| Tool | Description |
|------|-------------|
| `binance_price` | Get current price for a symbol |
| `binance_ticker_24h` | Get 24h ticker statistics |
| `binance_order_book` | Get order book depth |
| `binance_klines` | Get candlestick/kline data |
| `binance_balance` | Get account balances |
| `binance_place_order` | Place a new order |
| `binance_cancel_order` | Cancel an existing order |
| `binance_open_orders` | Get open orders |
| `binance_order_history` | Get order history |
| `binance_trades` | Get trade history |

## ⚠️ Security Notice

- Never share your API keys
- Use IP restrictions on your API keys
- Enable only required permissions
- Consider using testnet for development

## Example Queries

```
What's the current price of BTC on Binance?
```

```
Place a limit buy order for 0.1 ETH at $3000
```

```
Show my open orders on Binance
```

## License

- Original Implementation: MIT (ethancod1ng)
- Enhancements: Apache-2.0 (Nich)
