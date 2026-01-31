# Trade-It MCP Server

> Multi-exchange trading via Coinbase, Kraken, Robinhood, and Webull.

## Attribution

**Original Author:** [AstrologicalBoy](https://github.com/AstrologicalBoy)  
**Original Repository:** [trade-it-mcp](https://github.com/AstrologicalBoy/trade-it-mcp)  
**License:** MIT

**Integration & Enhancements by:** Nich ([@nichxbt](https://x.com/nichxbt))

## Supported Exchanges

| Exchange | Trading | Market Data | Portfolio | Withdrawals |
|----------|---------|-------------|-----------|-------------|
| Coinbase | ✅ | ✅ | ✅ | ✅ |
| Kraken | ✅ | ✅ | ✅ | ✅ |
| Robinhood | ✅ | ✅ | ✅ | ⚠️ Limited |
| Webull | ✅ | ✅ | ✅ | ⚠️ Limited |

## Features

### From Original Implementation
- ✅ Multi-exchange account management
- ✅ Unified order placement
- ✅ Portfolio aggregation
- ✅ Market data streaming
- ✅ Order history

### Our Enhancements (Apache-2.0)
- ✅ Smart order routing (best price)
- ✅ Cross-exchange arbitrage detection
- ✅ Unified portfolio view
- ✅ Fee comparison
- ✅ Tax lot tracking

## Installation

```bash
pnpm add @nirholas/trade-it-mcp
```

## Configuration

```bash
# Coinbase
export COINBASE_API_KEY=your_key
export COINBASE_API_SECRET=your_secret

# Kraken
export KRAKEN_API_KEY=your_key
export KRAKEN_API_SECRET=your_secret

# Robinhood
export ROBINHOOD_USERNAME=your_username
export ROBINHOOD_PASSWORD=your_password

# Webull
export WEBULL_DID=your_device_id
export WEBULL_ACCESS_TOKEN=your_token
```

## Usage

### With MCP Server

```typescript
import { registerTradeItTools } from '@nirholas/trade-it-mcp';
import { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';

const server = new McpServer({ name: 'my-trading-server', version: '1.0.0' });
registerTradeItTools(server);
```

### Standalone

```typescript
import { TradeItClient } from '@nirholas/trade-it-mcp';

const client = new TradeItClient({
  coinbase: { apiKey: '...', apiSecret: '...' },
  kraken: { apiKey: '...', apiSecret: '...' },
});

// Get unified portfolio
const portfolio = await client.getPortfolio();

// Get best price across exchanges
const bestPrice = await client.getBestPrice('BTC', 'USD', 'buy', 1.0);

// Place order on best exchange
const order = await client.placeSmartOrder({
  symbol: 'BTC',
  side: 'buy',
  amount: 0.1,
  type: 'market',
});
```

## Available Tools

| Tool | Description |
|------|-------------|
| `tradeit_portfolio` | Get unified portfolio across exchanges |
| `tradeit_balances` | Get balances by exchange |
| `tradeit_best_price` | Find best price across exchanges |
| `tradeit_place_order` | Place order on specific exchange |
| `tradeit_smart_order` | Place order on best exchange |
| `tradeit_order_history` | Get order history |
| `tradeit_cancel_order` | Cancel an open order |
| `tradeit_arbitrage` | Detect arbitrage opportunities |

## Example Queries

```
Show my portfolio across all exchanges
```

```
Where can I buy BTC at the best price?
```

```
Buy 0.5 ETH on the cheapest exchange
```

```
Show arbitrage opportunities for BTC
```

## License

- Original Implementation: MIT (AstrologicalBoy)
- Enhancements: Apache-2.0 (Nich)
