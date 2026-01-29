# Configuration Guide

The `x402.config.json` file is the heart of your deployment.

## Full Example

```json
{
  "$schema": "https://x402.org/schema/config.json",
  "version": "1.0.0",
  "name": "my-trading-api",
  
  "project": {
    "type": "express",
    "language": "typescript",
    "entryPoint": "src/index.ts",
    "buildCommand": "npm run build",
    "startCommand": "npm start"
  },
  
  "payment": {
    "wallet": "0x742d35Cc6634C0532925a3b844Bc9e7595f0bEb",
    "network": "eip155:8453",
    "token": "USDC",
    "facilitator": "https://x402.org/facilitator"
  },
  
  "pricing": {
    "model": "per-call",
    "default": {
      "price": "$0.01",
      "currency": "USD"
    },
    "routes": {
      "GET /health": "$0",
      "GET /api/*": "$0.001",
      "POST /api/trade": "$0.10"
    }
  },
  
  "deploy": {
    "provider": "railway",
    "region": "us-east-1",
    "port": 3000,
    "environment": {
      "NODE_ENV": "production"
    },
    "scaling": {
      "min": 1,
      "max": 10
    }
  },
  
  "discovery": {
    "enabled": true,
    "autoRegister": true,
    "instructions": "AI trading API",
    "ownershipProofs": []
  },
  
  "dashboard": {
    "enabled": true,
    "webhooks": [
      {
        "url": "https://myapp.com/webhook",
        "events": ["payment.received"],
        "secret": "webhook_secret_123"
      }
    ]
  }
}
```

## Field Reference

### `project`

- **type**: `"mcp-server" | "express" | "fastapi" | "nextjs"`
- **language**: `"typescript" | "javascript" | "python"`
- **entryPoint**: Main file to run
- **buildCommand**: Command to build (optional)
- **startCommand**: Command to start server

### `payment`

- **wallet**: Ethereum address to receive payments
- **network**: Blockchain network (see [Networks](networks.md))
- **token**: Payment token (USDC recommended)
- **facilitator**: x402 payment facilitator URL

### `pricing`

See [Pricing Guide](pricing.md) for advanced patterns.

### `deploy`

- **provider**: `"railway" | "fly" | "vercel" | "docker"`
- **region**: Deployment region
- **port**: Server port
- **scaling**: Auto-scaling configuration

### `discovery`

- **enabled**: List on x402scan.com
- **autoRegister**: Auto-register on deploy
- **instructions**: Description for AI agents

### `dashboard`

- **enabled**: Enable analytics tracking
- **webhooks**: Notify on payments

---

[← Back to Docs](README.md)
