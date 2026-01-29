# Paid API Example

A cryptocurrency data API that accepts x402 payments.

## Features

### Free Endpoints
- `GET /api/health` - Health check

### Basic Paid Endpoints ($0.0001 - $0.0005)
- `GET /api/v1/price/:symbol` - Get current price
- `GET /api/v1/prices` - Get all prices
- `GET /api/v1/trending` - Get trending coins

### Premium Endpoints ($0.01 - $0.05)
- `GET /api/v1/premium/analysis/:symbol` - Detailed technical analysis
- `GET /api/v1/premium/signals` - Trading signals

## Quick Start

### 1. Install Dependencies

```bash
npm install
```

### 2. Configure Environment

```bash
export X402_WALLET=0xYourWalletAddress
```

### 3. Run the Server

```bash
# Development mode (without x402)
npm run dev

# Production mode (with x402)
npm run build
npm start
```

### 4. Test Endpoints

```bash
# Free endpoint
curl http://localhost:3000/api/health

# Paid endpoint (will return 402 when x402 is enabled)
curl http://localhost:3000/api/v1/price/BTC
```

## Enabling x402 Payments

Uncomment the x402 wrapper in `src/index.ts`:

```typescript
import { wrapExpressWithX402 } from "@nirholas/x402-deploy/express";
import config from "./x402.config.json";

// ... your routes ...

const wrappedApp = wrapExpressWithX402(app, config);
wrappedApp.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
```

## Configuration

Edit `x402.config.json` to customize:

- **Wallet address**: Where payments go
- **Network**: Which blockchain (Arbitrum, Base, etc.)
- **Pricing**: Cost per endpoint
- **Discovery**: How AI agents find your API

## How It Works

1. Client requests a paid endpoint
2. Server returns `402 Payment Required` with payment details
3. Client makes payment via x402 protocol
4. Client retries with `X-PAYMENT` header
5. Server verifies payment and returns data

## Testing with AI Agents

Configure Claude Desktop with x402 support:

```json
{
  "mcpServers": {
    "universal-crypto": {
      "command": "npx",
      "args": ["@nirholas/universal-crypto-mcp"],
      "env": {
        "X402_PRIVATE_KEY": "0xYourPrivateKey"
      }
    }
  }
}
```

Then ask Claude:
> "Get the BTC analysis from http://localhost:3000/api/v1/premium/analysis/BTC"

Claude will:
1. Make the request
2. See the $0.01 cost
3. Ask for confirmation
4. Make the payment
5. Return the analysis

## Project Structure

```
paid-api/
├── src/
│   └── index.ts        # API server
├── x402.config.json    # x402 configuration
├── package.json        # Dependencies
└── README.md           # This file
```

## Next Steps

- Deploy to Vercel/Railway
- Add more premium endpoints
- Set up analytics dashboard
- See [x402-deploy docs](../../docs/content/x402-deploy/overview.md)
