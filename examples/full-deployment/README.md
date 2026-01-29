# Full Deployment Example

A complete production-ready MCP server with all features.

## Features

### Market Data
- `get_price` - Get cryptocurrency prices
- `get_market_overview` - Market summary

### Trading (Binance)
- `get_balance` - Account balances
- `place_order` - Place trading orders

### Wallet
- `get_wallet_balance` - Multi-chain balances
- `send_transaction` - Send transactions

### DeFi
- `get_swap_quote` - DEX swap quotes
- `get_lending_position` - Aave positions

### Payments (x402)
- `x402_balance` - Payment wallet balance
- `x402_send` - Send payments

## Quick Start

### 1. Install Dependencies

```bash
npm install
```

### 2. Configure Environment

```bash
# Required for basic operation
export MCP_SERVER_NAME="my-crypto-mcp"

# Optional: Trading
export BINANCE_API_KEY=your-key
export BINANCE_API_SECRET=your-secret

# Optional: Wallet
export PRIVATE_KEY=0x...

# Optional: x402 Payments
export X402_PRIVATE_KEY=0x...
export X402_CHAIN=arbitrum

# Optional: Enhanced market data
export COINGECKO_API_KEY=your-key
```

### 3. Run the Server

```bash
# stdio mode (Claude Desktop)
npm run dev

# HTTP mode (ChatGPT, web apps)
npm run start:http

# SSE mode (legacy HTTP clients)
npm run start:sse
```

### 4. Add to Claude Desktop

```json
{
  "mcpServers": {
    "full-crypto": {
      "command": "node",
      "args": ["/path/to/full-deployment/dist/index.js"],
      "env": {
        "BINANCE_API_KEY": "your-key",
        "BINANCE_API_SECRET": "your-secret",
        "PRIVATE_KEY": "0x...",
        "X402_PRIVATE_KEY": "0x..."
      }
    }
  }
}
```

## Transport Modes

### stdio (Default)
For Claude Desktop and other stdio-based clients.

```bash
npm start
```

### HTTP
For ChatGPT, web applications, and REST clients.

```bash
npm run start:http
# Server at http://localhost:3000
```

### SSE
For legacy HTTP clients that support Server-Sent Events.

```bash
npm run start:sse
# Server at http://localhost:3000
```

## Docker Deployment

### Build Image

```bash
docker build -t full-crypto-mcp .
```

### Run Container

```bash
docker run -d \
  --name crypto-mcp \
  -p 3000:3000 \
  -e BINANCE_API_KEY=$BINANCE_API_KEY \
  -e BINANCE_API_SECRET=$BINANCE_API_SECRET \
  -e PRIVATE_KEY=$PRIVATE_KEY \
  -e X402_PRIVATE_KEY=$X402_PRIVATE_KEY \
  full-crypto-mcp --http
```

### Docker Compose

```yaml
version: "3.8"
services:
  mcp:
    build: .
    ports:
      - "3000:3000"
    environment:
      - MCP_TRANSPORT=http
      - BINANCE_API_KEY=${BINANCE_API_KEY}
      - BINANCE_API_SECRET=${BINANCE_API_SECRET}
      - PRIVATE_KEY=${PRIVATE_KEY}
      - X402_PRIVATE_KEY=${X402_PRIVATE_KEY}
```

## Cloud Deployment

### Vercel

```bash
vercel deploy
```

### Railway

```bash
railway up
```

### AWS/GCP/Azure

See [deployment docs](../../docs/content/getting-started/deployment.md) for cloud-specific instructions.

## Configuration

### Environment Variables

| Variable | Description | Required |
|----------|-------------|----------|
| `MCP_SERVER_NAME` | Server name | No |
| `MCP_TRANSPORT` | Transport mode | No |
| `MCP_PORT` | HTTP port | No |
| `BINANCE_API_KEY` | Binance API key | For trading |
| `BINANCE_API_SECRET` | Binance API secret | For trading |
| `PRIVATE_KEY` | EVM private key | For wallet |
| `X402_PRIVATE_KEY` | x402 private key | For payments |
| `X402_CHAIN` | x402 chain | No |
| `COINGECKO_API_KEY` | CoinGecko API key | No |
| `LOG_LEVEL` | Logging level | No |

### x402 Configuration

Edit `x402.config.json` for payment settings:

```json
{
  "payment": {
    "wallet": "${X402_WALLET}",
    "network": "eip155:42161"
  },
  "pricing": {
    "routes": {
      "GET /api/premium/*": "$0.001"
    }
  }
}
```

## Project Structure

```
full-deployment/
├── src/
│   └── index.ts        # Main server
├── x402.config.json    # x402 configuration
├── package.json        # Dependencies
├── Dockerfile          # Docker build
└── README.md           # This file
```

## Security

- Never commit API keys or private keys
- Use environment variables for secrets
- Rotate keys regularly
- Use IP whitelisting where available
- Test on testnets before mainnet

## Next Steps

- Add more tools as needed
- Set up monitoring
- Configure alerts
- See [full documentation](../../docs/content/)
