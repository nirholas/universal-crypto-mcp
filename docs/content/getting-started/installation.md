# Installation

This guide covers installing Universal Crypto MCP for both end-users and developers.

## Prerequisites

Before installing, ensure you have:

- **Node.js** 18+ (LTS recommended)
- **pnpm** (recommended) or npm/yarn
- **Git** (for development)

## Quick Install

### For Claude Desktop Users

The fastest way to get started is using npx:

```bash
npx @nirholas/universal-crypto-mcp
```

Or install globally:

```bash
npm install -g @nirholas/universal-crypto-mcp
```

### Individual Packages

Install only the packages you need:

```bash
# Trading packages
npm install @universal-crypto-mcp/trading-binance
npm install @universal-crypto-mcp/trading-binance-us

# Market data
npm install @universal-crypto-mcp/market-data-aggregator
npm install @universal-crypto-mcp/market-data-coingecko

# Wallet management
npm install @universal-crypto-mcp/wallet-evm
npm install @universal-crypto-mcp/wallet-solana

# DeFi protocols
npm install @universal-crypto-mcp/defi-aave
npm install @universal-crypto-mcp/defi-uniswap

# Payments
npm install @universal-crypto-mcp/payments-x402
```

## For Development

Clone and set up the full monorepo:

```bash
# Clone the repository
git clone https://github.com/nirholas/universal-crypto-mcp.git
cd universal-crypto-mcp

# Install dependencies (pnpm recommended)
pnpm install

# Build all packages
pnpm build

# Run tests
pnpm test
```

## Add to Claude Desktop

Configure Claude Desktop to use Universal Crypto MCP by editing your `claude_desktop_config.json`:

### macOS

```bash
# Open the config file
open ~/Library/Application\ Support/Claude/claude_desktop_config.json
```

### Windows

```bash
# Open the config file
notepad %APPDATA%\Claude\claude_desktop_config.json
```

### Linux

```bash
# Open the config file
nano ~/.config/Claude/claude_desktop_config.json
```

### Configuration

Add the following to your config file:

```json
{
  "mcpServers": {
    "universal-crypto": {
      "command": "npx",
      "args": ["@nirholas/universal-crypto-mcp"]
    }
  }
}
```

### With Environment Variables

For features requiring API keys:

```json
{
  "mcpServers": {
    "universal-crypto": {
      "command": "npx",
      "args": ["@nirholas/universal-crypto-mcp"],
      "env": {
        "COINGECKO_API_KEY": "your-api-key",
        "X402_PRIVATE_KEY": "your-private-key"
      }
    }
  }
}
```

## Add to Cursor

Configure Cursor to use Universal Crypto MCP in your `.cursor/mcp.json`:

```json
{
  "mcpServers": {
    "universal-crypto": {
      "command": "npx",
      "args": ["@nirholas/universal-crypto-mcp"]
    }
  }
}
```

## Add to ChatGPT

For ChatGPT, use HTTP mode:

```bash
# Start the server in HTTP mode
npx @nirholas/universal-crypto-mcp --http --port 3000
```

Then configure ChatGPT to connect to `http://localhost:3000`.

## Verify Installation

Test that the server is working:

```bash
# Run in stdio mode (default)
npx @nirholas/universal-crypto-mcp

# Or test with a simple command
echo '{"jsonrpc": "2.0", "method": "tools/list", "id": 1}' | npx @nirholas/universal-crypto-mcp
```

## Next Steps

- [Configuration](configuration.md) - Configure API keys and settings
- [First Tool](first-tool.md) - Use your first crypto tool
- [Deployment](deployment.md) - Deploy to production
