# CoinGecko MCP Server

MCP server providing access to CoinGecko cryptocurrency market data API.

## Author

**nirholas**
- GitHub: [github.com/nirholas](https://github.com/nirholas)
- X/Twitter: [x.com/nichxbt](https://x.com/nichxbt)

## Features

- Real-time cryptocurrency prices
- Market data and statistics
- Trending coins
- Historical data
- OHLC/candlestick data
- Global market statistics

## Installation

```bash
npm install
npm run build
```

## Usage

### With Claude Desktop

Add to `claude_desktop_config.json`:

```json
{
  "mcpServers": {
    "coingecko": {
      "command": "node",
      "args": ["/path/to/dist/index.js"],
      "env": {
        "COINGECKO_API_KEY": "your-api-key-optional"
      }
    }
  }
}
```

### Available Tools

- `get_coin_price` - Get current cryptocurrency prices
- `get_coin_market_data` - Get detailed market data
- `get_trending_coins` - Get trending cryptocurrencies
- `get_top_coins` - Get top coins by market cap
- `search_coins` - Search for cryptocurrencies
- `get_global_market_data` - Get global market statistics
- `get_coin_history` - Get historical data for specific date
- `get_coin_ohlc` - Get OHLC candlestick data

## License

MIT License - Copyright (c) 2024-2026 nirholas
