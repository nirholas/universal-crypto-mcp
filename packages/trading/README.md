# 📊 Crypto Trading MCP Servers

> CEX (Centralized Exchange) integrations for AI agents

## Overview

This package provides Model Context Protocol (MCP) servers for trading on centralized exchanges. AI agents can execute trades, check balances, analyze markets, and manage portfolios programmatically.

## Available Servers

### 🟡 Binance MCP Server
Full Binance integration with:
- Spot trading (market, limit, stop-limit orders)
- Futures trading
- Account management
- Real-time market data
- Historical data (klines, trades)
- Portfolio analysis

### 🔵 Binance US MCP Server
Binance US integration with:
- US-compliant spot trading
- Market data access
- Account management

## Installation

```bash
# From workspace root
pnpm install

# Build trading packages
pnpm --filter "@nirholas/crypto-trading" build
```

## Configuration

Set your API credentials in environment variables:

```bash
# Binance
BINANCE_API_KEY=your_api_key
BINANCE_API_SECRET=your_api_secret

# Binance US
BINANCE_US_API_KEY=your_api_key
BINANCE_US_API_SECRET=your_api_secret
```

## Usage

### Claude Desktop Configuration

```json
{
  "mcpServers": {
    "binance": {
      "command": "node",
      "args": ["packages/trading/binance/dist/index.js"],
      "env": {
        "BINANCE_API_KEY": "your_key",
        "BINANCE_API_SECRET": "your_secret"
      }
    }
  }
}
```

## Available Tools

### Binance Tools
| Tool | Description |
|------|-------------|
| `get_account_balance` | Get account balances |
| `get_ticker_price` | Get current price for a symbol |
| `place_market_order` | Place a market order |
| `place_limit_order` | Place a limit order |
| `cancel_order` | Cancel an open order |
| `get_open_orders` | Get all open orders |
| `get_trade_history` | Get trade history |
| `get_klines` | Get candlestick/kline data |

## Security Notice

⚠️ **Never commit API keys to version control**

- Use environment variables or secure credential management
- Consider using IP whitelisting on exchange API settings
- Enable 2FA on your exchange account
- Use read-only keys when full trading access isn't needed

## License

Apache-2.0

---

## 👤 Author

**nich** - Building the most extensive crypto MCP repository

- 🐙 GitHub: [@nirholas](https://github.com/nirholas)
- 🐦 Twitter: [@nichxbt](https://x.com/nichxbt)
- 📦 NPM: [@nirholas](https://www.npmjs.com/~nirholas)

## 🤝 Contributing

Contributions welcome! See [CONTRIBUTING.md](../../CONTRIBUTING.md)

## 📄 License

Apache-2.0 - see [LICENSE](../../LICENSE)
