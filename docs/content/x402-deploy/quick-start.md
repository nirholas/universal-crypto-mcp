# x402-deploy Quick Start

Get your paid API running in under 5 minutes.

## Prerequisites

- Node.js 18+
- An EVM wallet address (to receive payments)
- An existing API (Express, Next.js, etc.)

## Step 1: Install

```bash
npm install @nirholas/x402-deploy
```

## Step 2: Create Configuration

Create `x402.config.json` in your project root:

```json
{
  "name": "my-paid-api",
  "description": "Premium data API for crypto prices",
  "payment": {
    "wallet": "0xYourWalletAddress",
    "network": "eip155:42161"
  },
  "pricing": {
    "routes": {
      "GET /api/free/*": "free",
      "GET /api/price/:symbol": "$0.0001",
      "GET /api/premium/*": "$0.01"
    }
  },
  "discovery": {
    "enabled": true,
    "categories": ["crypto", "market-data"],
    "instructions": "Get real-time crypto prices and premium analytics"
  }
}
```

## Step 3: Wrap Your API

### Express

```typescript
import express from "express";
import { wrapExpressWithX402 } from "@nirholas/x402-deploy/express";

const app = express();

// Free endpoint
app.get("/api/free/health", (req, res) => {
  res.json({ status: "ok" });
});

// Paid endpoint ($0.0001)
app.get("/api/price/:symbol", (req, res) => {
  res.json({
    symbol: req.params.symbol,
    price: 67890.12,
    timestamp: Date.now(),
  });
});

// Premium endpoint ($0.01)
app.get("/api/premium/analysis/:symbol", (req, res) => {
  res.json({
    symbol: req.params.symbol,
    analysis: {
      trend: "bullish",
      support: 65000,
      resistance: 70000,
      recommendation: "hold",
    },
  });
});

// Wrap with x402
const wrappedApp = wrapExpressWithX402(app);

wrappedApp.listen(3000, () => {
  console.log("Paid API running on http://localhost:3000");
});
```

### Next.js

```typescript
// middleware.ts
import { createX402Middleware } from "@nirholas/x402-deploy/next";
import config from "./x402.config.json";

export const middleware = createX402Middleware(config);

export const config = {
  matcher: "/api/:path*",
};
```

### Fastify

```typescript
import Fastify from "fastify";
import { x402Plugin } from "@nirholas/x402-deploy/fastify";

const fastify = Fastify();

fastify.register(x402Plugin, {
  config: require("./x402.config.json"),
});

fastify.get("/api/price/:symbol", async (request, reply) => {
  return { symbol: request.params.symbol, price: 67890.12 };
});

fastify.listen({ port: 3000 });
```

## Step 4: Test Locally

```bash
# Start your server
npm run dev

# Test free endpoint
curl http://localhost:3000/api/free/health
# {"status":"ok"}

# Test paid endpoint (will return 402)
curl -i http://localhost:3000/api/price/BTC
# HTTP/1.1 402 Payment Required
# {
#   "x402Version": 2,
#   "accepts": [{...}]
# }
```

## Step 5: Deploy

### Vercel

```bash
# Install Vercel CLI
npm i -g vercel

# Deploy
vercel

# Set environment variables
vercel env add X402_WALLET
```

### Railway

```bash
# Install Railway CLI
npm i -g @railway/cli

# Login and deploy
railway login
railway init
railway up
```

### Docker

```dockerfile
FROM node:20-alpine
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
EXPOSE 3000
CMD ["npm", "start"]
```

```bash
docker build -t my-paid-api .
docker run -p 3000:3000 -e X402_WALLET=0x... my-paid-api
```

## Step 6: Register in Discovery

Once deployed, register your API for AI agent discovery:

```bash
npx @nirholas/x402-deploy register --url https://your-api.com
```

Your API is now discoverable by AI agents!

## Test with an AI Agent

Configure Claude Desktop to use the x402 payment tools:

```json
{
  "mcpServers": {
    "universal-crypto": {
      "command": "npx",
      "args": ["@nirholas/universal-crypto-mcp"],
      "env": {
        "X402_PRIVATE_KEY": "0xYourPrivateKey",
        "X402_CHAIN": "arbitrum"
      }
    }
  }
}
```

Now ask Claude:

> "Get the BTC price from https://your-api.com/api/price/BTC"

Claude will:
1. Make the request
2. Receive 402 Payment Required
3. Check with you about the $0.0001 cost
4. Make the payment
5. Return the data

## Monitoring

View your dashboard:

```bash
npx @nirholas/x402-deploy dashboard
```

Or visit: `https://your-api.com/x402/dashboard`

## Next Steps

- [Configuration](configuration.md) - Advanced configuration options
- [Providers](providers.md) - Payment providers and networks
- [Discovery](discovery.md) - AI agent discovery network
