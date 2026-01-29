# x402-deploy Overview

x402-deploy is a deployment toolkit for creating paid APIs that accept cryptocurrency payments.

## What is x402-deploy?

x402-deploy enables you to:

- **Create paid APIs** with simple configuration
- **Accept crypto payments** automatically (USDC, USDs)
- **Deploy anywhere** (Vercel, AWS, Docker, etc.)
- **Register in the AI agent discovery network**

## Key Features

### 🚀 One-Command Deploy

```bash
npx @nirholas/x402-deploy
```

### 💰 Flexible Pricing

```json
{
  "pricing": {
    "routes": {
      "GET /api/free/*": "free",
      "GET /api/basic/*": "$0.001",
      "GET /api/premium/*": "$0.01"
    }
  }
}
```

### 🔍 AI Agent Discovery

Your API is automatically discoverable by AI agents:

```typescript
// AI agents can find your API
const apis = await discover({
  category: "weather",
  maxPrice: "$0.01"
});
```

### 📊 Built-in Dashboard

Monitor revenue, usage, and analytics in real-time.

## Quick Start

### 1. Create Config File

Create `x402.config.json`:

```json
{
  "name": "my-paid-api",
  "payment": {
    "wallet": "0xYourWalletAddress",
    "network": "eip155:42161"
  },
  "pricing": {
    "routes": {
      "GET /api/*": "$0.001"
    }
  }
}
```

### 2. Wrap Your API

```typescript
import express from "express";
import { wrapWithX402 } from "@nirholas/x402-deploy/gateway";

const app = express();

app.get("/api/data", (req, res) => {
  res.json({ data: "premium content" });
});

// Add x402 payment layer
const wrappedApp = wrapWithX402(app);

wrappedApp.listen(3000);
```

### 3. Deploy

```bash
npx @nirholas/x402-deploy deploy
```

## Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                     x402-deploy Stack                        │
├─────────────────────────────────────────────────────────────┤
│                                                              │
│  ┌──────────────────┐    ┌──────────────────┐               │
│  │   Your API       │    │   x402 Gateway   │               │
│  │   (Express,      │◄───│   - Payment      │               │
│  │    Fastify,      │    │     Verification │               │
│  │    Next.js)      │    │   - Rate Limiting│               │
│  └──────────────────┘    │   - Logging      │               │
│                          └────────┬─────────┘               │
│                                   │                         │
│                          ┌────────▼─────────┐               │
│                          │   Discovery      │               │
│                          │   - Registration │               │
│                          │   - Searchable   │               │
│                          │   - Categories   │               │
│                          └────────┬─────────┘               │
│                                   │                         │
│                          ┌────────▼─────────┐               │
│                          │   Dashboard      │               │
│                          │   - Revenue      │               │
│                          │   - Analytics    │               │
│                          │   - Settings     │               │
│                          └──────────────────┘               │
│                                                              │
└─────────────────────────────────────────────────────────────┘
```

## Use Cases

### Paid Data APIs

```json
{
  "pricing": {
    "routes": {
      "GET /api/price/:symbol": "$0.0001",
      "GET /api/forecast/:symbol": "$0.01"
    }
  }
}
```

### Compute APIs

```json
{
  "pricing": {
    "routes": {
      "POST /api/analyze": "$0.05",
      "POST /api/generate": "$0.10"
    }
  }
}
```

### Premium Content

```json
{
  "pricing": {
    "routes": {
      "GET /api/articles/:id": "$0.001",
      "GET /api/reports/:id": "$0.50"
    }
  }
}
```

## Supported Frameworks

| Framework | Package |
|-----------|---------|
| Express | `@nirholas/x402-deploy/express` |
| Fastify | `@nirholas/x402-deploy/fastify` |
| Next.js | `@nirholas/x402-deploy/next` |
| Hono | `@nirholas/x402-deploy/hono` |
| Gin (Go) | `x402/gin-gonic` |
| Python | `x402/python` |
| Java | `x402/java` |

## Deployment Targets

- **Vercel** - Serverless functions
- **AWS Lambda** - Serverless
- **Docker** - Containers
- **Railway** - One-click deploy
- **Fly.io** - Edge deployment
- **Self-hosted** - Any Node.js server

## Documentation

- [Quick Start](quick-start.md) - Get started in 5 minutes
- [Configuration](configuration.md) - Full configuration reference
- [Providers](providers.md) - Payment providers and networks
- [Discovery](discovery.md) - AI agent discovery network

## Related

- [Payments Package](../packages/payments.md) - x402 client for paying APIs
- [Examples](../../examples/paid-api/README.md) - Working examples
