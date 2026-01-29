# x402 Payment Gateway

Production-ready payment gateway middleware for monetizing APIs and MCP servers with x402 protocol.

## Features

- ✅ **HTTP 402 Payment Required** flow implementation
- ✅ **Payment verification** via facilitator or on-chain
- ✅ **Route-based pricing** with wildcard support
- ✅ **Rate limiting** per payer and route
- ✅ **Analytics tracking** with webhook notifications
- ✅ **MCP server wrapper** for Model Context Protocol
- ✅ **Express API wrapper** for REST APIs

## Quick Start

### Wrap an Express API

```typescript
import express from "express";
import { wrapExpressApp } from "@nirholas/x402-deploy/gateway";
import type { X402Config } from "@nirholas/x402-deploy";

const app = express();

// Define your routes
app.get("/api/data", (req, res) => {
  res.json({ data: "premium content" });
});

// Configure x402
const config: X402Config = {
  name: "My API",
  version: "1.0.0",
  payment: {
    wallet: "0x742d35Cc6634C0532925a3b844Bc9e7595f0bEb1",
    network: "eip155:8453", // Base
    token: "USDC",
  },
  pricing: {
    model: "per-call",
    routes: {
      "GET /api/data": "$0.01",
      "POST /api/compute": "$0.10",
      "* /api/premium/*": "$0.05", // Wildcard pattern
    },
  },
};

// Wrap with x402
const wrappedApp = wrapExpressApp({
  config,
  app,
  freeRoutes: ["/health", "/docs"], // Optional free routes
  testMode: process.env.NODE_ENV === "development",
});

wrappedApp.listen(3000, () => {
  console.log("x402-enabled API running on port 3000");
});
```

### Wrap an MCP Server

```typescript
import { Server } from "@modelcontextprotocol/sdk/server/index.js";
import { wrapMcpServer } from "@nirholas/x402-deploy/gateway";

const mcpServer = new Server({
  name: "my-mcp-server",
  version: "1.0.0",
});

// Add your tools
mcpServer.setRequestHandler("tools/call", async (request) => {
  // Your tool implementation
  return { result: "success" };
});

// Wrap with x402
const app = wrapMcpServer({
  config: {
    name: "My MCP Server",
    version: "1.0.0",
    payment: {
      wallet: "0x742d35Cc6634C0532925a3b844Bc9e7595f0bEb1",
      network: "eip155:8453",
      token: "USDC",
    },
    pricing: {
      model: "per-call",
      default: "$0.001",
      routes: {
        "POST /mcp": "$0.01", // Per MCP request
      },
    },
  },
  server: mcpServer,
  testMode: false,
});

app.listen(3000);
```

### Use Middleware Directly

```typescript
import express from "express";
import { x402Middleware } from "@nirholas/x402-deploy/gateway";

const app = express();

app.use(
  x402Middleware({
    config: {
      /* your config */
    },
    testMode: false,
    onPaymentVerified: (payment) => {
      console.log(`Payment received from ${payment.payer}`);
    },
    onPaymentFailed: (error, req) => {
      console.error(`Payment failed: ${error.message}`);
    },
  })
);
```

## Configuration

### Pricing Models

```typescript
// Simple string pricing
pricing: {
  routes: {
    "GET /api/data": "$0.01"
  }
}

// Advanced pricing with rate limits
pricing: {
  routes: {
    "GET /api/data": {
      price: "$0.01",
      currency: "USD",
      description: "Get data endpoint",
      rateLimit: {
        requests: 100,
        window: "1h"
      }
    }
  }
}

// Wildcard patterns
pricing: {
  routes: {
    "* /api/premium/*": "$0.05", // Any method, any path under /api/premium
    "GET /api/*": "$0.01", // GET requests to any /api path
    "POST /*": "$0.10" // All POST requests
  }
}
```

### Network Support

```typescript
// Base (recommended)
network: "eip155:8453"

// Base Sepolia (testnet)
network: "eip155:84532"

// Ethereum Mainnet
network: "eip155:1"

// Arbitrum One
network: "eip155:42161"

// Polygon
network: "eip155:137"
```

### Analytics & Webhooks

```typescript
dashboard: {
  enabled: true,
  webhooks: [
    {
      url: "https://your-server.com/webhooks/x402",
      secret: "your-webhook-secret",
      events: ["payment.received"]
    }
  ]
}
```

Webhook payload:

```json
{
  "event": "payment.received",
  "data": {
    "route": "GET /api/data",
    "payer": "0x...",
    "amount": "$0.01",
    "timestamp": 1234567890
  }
}
```

## Payment Flow

1. **Client makes request** without payment header
2. **Server returns 402** with payment requirements
3. **Client obtains payment** (via facilitator or direct)
4. **Client retries** with `x-payment` header
5. **Server verifies payment** and grants access

### Example: 402 Response

```json
{
  "error": "payment_required",
  "message": "This endpoint requires payment",
  "accepts": {
    "scheme": "exact",
    "network": "eip155:8453",
    "maxAmountRequired": "$0.01",
    "resource": "GET /api/data",
    "payTo": "0x742d35Cc6634C0532925a3b844Bc9e7595f0bEb1",
    "asset": "eip155:8453/erc20:0x833589fCD6eDb6E08f4c7C32D4f71b54bdA02913"
  }
}
```

## Advanced Features

### Free Routes

```typescript
import { x402WithFreeRoutes } from "@nirholas/x402-deploy/gateway";

const middleware = x402WithFreeRoutes(
  { config, testMode: false },
  [
    "/health",
    "/docs",
    "GET /public/*", // Wildcard patterns work
  ]
);

app.use(middleware);
```

### Custom Payment Verification

```typescript
import { verifyPaymentOnChain } from "@nirholas/x402-deploy/gateway";

// Verify directly on-chain (without facilitator)
const result = await verifyPaymentOnChain({
  paymentHeader: req.headers["x-payment"],
  expectedPrice: "$0.01",
  expectedPayTo: "0x...",
  network: "eip155:8453",
});
```

### Dynamic Pricing

```typescript
import { calculateDynamicPrice } from "@nirholas/x402-deploy/gateway";

const price = calculateDynamicPrice("$0.01", {
  demandMultiplier: 1.5, // Surge pricing
  timeOfDay: new Date().getHours(), // Off-peak discounts
  userTier: "premium", // User-based pricing
});
```

## Testing

### Test Mode

```typescript
wrapExpressApp({
  config,
  app,
  testMode: true, // Accepts any payment header
});
```

### Mock Payment Header

```typescript
const mockPayment = {
  payer: "0x1234...",
  amount: "0.01",
  txHash: "0xabc...",
};

const header = Buffer.from(JSON.stringify(mockPayment)).toString("base64");

// Use in requests
fetch("http://localhost:3000/api/data", {
  headers: {
    "x-payment": header,
  },
});
```

## API Reference

### `x402Middleware(options)`

Core middleware for x402 payment verification.

**Options:**

- `config: X402Config` - Configuration object
- `facilitatorUrl?: string` - Override facilitator URL
- `testMode?: boolean` - Enable test mode
- `onPaymentVerified?: (payment) => void` - Success callback
- `onPaymentFailed?: (error, req) => void` - Error callback

### `wrapMcpServer(options)`

Wrap an MCP server with x402 payments.

**Options:**

- `config: X402Config` - Configuration object
- `server: Server` - MCP server instance
- `testMode?: boolean` - Enable test mode
- `generateDiscoveryDocument?: (origin, config) => any` - Custom discovery doc

**Returns:** `express.Application`

### `wrapExpressApp(options)`

Wrap an Express app with x402 payments.

**Options:**

- `config: X402Config` - Configuration object
- `app: Express` - Express application
- `testMode?: boolean` - Enable test mode
- `freeRoutes?: string[]` - Routes that don't require payment
- `onPaymentVerified?: (payment) => void` - Success callback
- `onPaymentFailed?: (error, req) => void` - Error callback

**Returns:** `Express`

### `verifyPayment(options)`

Verify a payment header via facilitator.

**Options:**

- `paymentHeader: string` - Base64-encoded payment data
- `expectedPrice: string` - Expected price (e.g., "$0.01")
- `expectedPayTo: string` - Expected recipient address
- `network: string` - Network identifier
- `facilitatorUrl: string` - Facilitator service URL
- `testMode?: boolean` - Enable test mode

**Returns:** `Promise<PaymentVerification>`

## Environment Variables

```bash
# Required
X402_WALLET=0x742d35Cc6634C0532925a3b844Bc9e7595f0bEb1
X402_NETWORK=eip155:8453

# Optional
X402_FACILITATOR_URL=https://facilitator.x402.dev
X402_TEST_MODE=true
X402_WEBHOOK_URL=https://your-server.com/webhooks
X402_WEBHOOK_SECRET=your-secret
```

## Examples

See the [examples directory](../examples) for complete examples:

- `examples/basic-mcp-server/` - Basic MCP server with x402
- `examples/express-api/` - Express REST API with x402
- `examples/paid-api/` - Advanced paid API with tiers

## License

Apache-2.0
