# Integration Guide

This guide explains how to integrate the boosty MCP DeFi servers with various platforms.

## Table of Contents

- [boostyOS Integration](#boostyos-integration)
- [Claude Desktop Integration](#claude-desktop-integration)
- [Custom Integration](#custom-integration)
- [MCP Manifest Format](#mcp-manifest-format)
- [Configuration Options](#configuration-options)

## boostyOS Integration

### Basic Setup

1. Install the package globally or in your project:

```bash
npm install -g @boosty/mcp-defi
# or
pnpm add @boosty/mcp-defi
```

2. Add to your boostyOS MCP configuration:

```json
{
  "mcpServers": {
    "boosty-defi": {
      "command": "boosty-mcp",
      "env": {
        "ALCHEMY_API_KEY": "${ALCHEMY_API_KEY}",
        "COINGECKO_API_KEY": "${COINGECKO_API_KEY}"
      }
    }
  }
}
```

### Running Specific Tool Categories

You can run only specific tool categories to reduce complexity:

```json
{
  "mcpServers": {
    "boosty-prices": {
      "command": "boosty-mcp",
      "args": ["--prices-only"],
      "env": {
        "COINGECKO_API_KEY": "${COINGECKO_API_KEY}"
      }
    },
    "boosty-wallets": {
      "command": "boosty-mcp",
      "args": ["--wallets-only"],
      "env": {
        "ALCHEMY_API_KEY": "${ALCHEMY_API_KEY}"
      }
    }
  }
}
```

## Claude Desktop Integration

### macOS

1. Locate the Claude Desktop config file:
   - `~/Library/Application Support/Claude/claude_desktop_config.json`

2. Add the MCP server configuration:

```json
{
  "mcpServers": {
    "boosty-defi": {
      "command": "node",
      "args": ["/path/to/node_modules/@boosty/mcp-defi/dist/cli.js"],
      "env": {
        "ALCHEMY_API_KEY": "your-alchemy-api-key"
      }
    }
  }
}
```

### Windows

1. Locate the config file:
   - `%APPDATA%\Claude\claude_desktop_config.json`

2. Use the same configuration format as macOS, adjusting paths as needed.

## Custom Integration

### Using the Server Programmatically

```typescript
import { createCombinedServer } from '@boosty/mcp-defi';

// Create server with all tools
const server = createCombinedServer();

// Or create server with specific tools
const pricesOnly = createCombinedServer({
  enablePrices: true,
  enableWallets: false,
  enableYields: false,
});
```

### Direct Tool Usage

You can also use tools directly without the MCP server:

```typescript
import {
  getTokenPrice,
  getWalletPortfolio,
  getTopYields,
} from '@boosty/mcp-defi';

// Get token price
const price = await getTokenPrice({ symbol: 'ETH', currency: 'usd' });

// Get wallet portfolio
const portfolio = await getWalletPortfolio({
  address: '0x...',
  chain: 'ethereum',
});

// Get top yields
const yields = await getTopYields({
  chain: 'arbitrum',
  minTvl: 1000000,
  limit: 10,
});
```

## MCP Manifest Format

The MCP manifest file (`mcp-manifest.json`) describes all available tools:

```json
{
  "name": "boosty-mcp-defi",
  "version": "0.1.0",
  "description": "All-in-one DeFi MCP server",
  "tools": [
    {
      "name": "getTokenPrice",
      "description": "Get current price and market data for a token",
      "category": "prices"
    }
  ],
  "configuration": {
    "environment": {
      "ALCHEMY_API_KEY": {
        "description": "API key for Alchemy",
        "required": true
      }
    }
  }
}
```

## Configuration Options

### Environment Variables

| Variable | Description | Required |
|----------|-------------|----------|
| `ALCHEMY_API_KEY` | Alchemy API key for blockchain data | Yes (for wallet tools) |
| `COINGECKO_API_KEY` | CoinGecko API key for price data | No (improves rate limits) |
| `ETHERSCAN_API_KEY` | Etherscan API key | No |
| `ARBISCAN_API_KEY` | Arbiscan API key | No |
| `BASESCAN_API_KEY` | Basescan API key | No |

### CLI Arguments

| Argument | Description |
|----------|-------------|
| `--prices-only` | Enable only price tools |
| `--wallets-only` | Enable only wallet tools |
| `--yields-only` | Enable only yield tools |
| `--no-prices` | Disable price tools |
| `--no-wallets` | Disable wallet tools |
| `--no-yields` | Disable yield tools |
| `--help` | Show help message |

### Server Options

When creating the server programmatically:

```typescript
interface CombinedServerOptions {
  enablePrices?: boolean;  // Default: true
  enableWallets?: boolean; // Default: true
  enableYields?: boolean;  // Default: true
}
```

## Troubleshooting

### Common Issues

1. **"Unknown tool" errors**: Make sure the tool category is enabled
2. **Rate limiting**: Add API keys to improve rate limits
3. **Connection issues**: Check that the server is running and reachable

### Debugging

Enable debug logging:

```bash
DEBUG=boosty:* boosty-mcp
```

### Getting Help

- Open an issue on GitHub
- Check the [API Reference](./API_REFERENCE.md) for detailed documentation
