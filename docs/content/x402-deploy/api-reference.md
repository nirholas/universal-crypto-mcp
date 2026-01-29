# x402-deploy API Reference

Complete API reference for x402-deploy monetization framework.

---

## Core Functions

### `wrapWithX402(app, config)`

Wraps an Express application with x402 payment gateway middleware.

**Parameters:**
- `app` (Express.Application) - Your Express app instance
- `config` (X402Config) - x402 configuration object

**Returns:** `Express.Application` - The wrapped application

**Example:**
```typescript
import express from 'express';
import { wrapWithX402 } from '@nirholas/universal-crypto-mcp/x402';

const app = express();

app.get('/api/data', (req, res) => {
  res.json({ data: 'premium content' });
});

const wrappedApp = wrapWithX402(app, {
  payment: {
    wallet: '0x...',
    network: 'eip155:42161'
  },
  pricing: {
    routes: {
      'GET /api/data': '$0.001'
    }
  }
});

wrappedApp.listen(3000);
```

---

### `createX402Middleware(config)`

Creates Express middleware for x402 payment verification.

**Parameters:**
- `config` (X402Config) - x402 configuration

**Returns:** `RequestHandler` - Express middleware function

**Example:**
```typescript
import express from 'express';
import { createX402Middleware } from '@nirholas/universal-crypto-mcp/x402';

const app = express();
const x402 = createX402Middleware({
  payment: { wallet: '0x...', network: 'eip155:8453' },
  pricing: { routes: { 'GET /api/*': '$0.001' } }
});

app.use(x402);

app.get('/api/data', (req, res) => {
  // Only executes if payment is valid
  res.json({ data: 'content' });
});
```

---

### `createX402McpServer(options)`

Creates an MCP server with x402 payment integration.

**Parameters:**
- `options` (X402McpOptions) - Server configuration
  - `config` (X402Config) - x402 configuration
  - `tools` (Record<string, Tool>) - MCP tool definitions
  - `resources?` (Resource[]) - Optional resources
  - `prompts?` (Prompt[]) - Optional prompts

**Returns:** `McpServer` - Configured MCP server

**Example:**
```typescript
import { createX402McpServer } from '@nirholas/universal-crypto-mcp/x402';

const server = createX402McpServer({
  config: {
    payment: {
      wallet: '0x...',
      network: 'eip155:42161'
    },
    pricing: {
      tools: {
        'analyze_sentiment': '$0.01',
        'get_market_data': '$0.001'
      }
    }
  },
  tools: {
    analyze_sentiment: {
      description: 'Analyze crypto sentiment',
      inputSchema: {
        type: 'object',
        properties: {
          symbol: { type: 'string' }
        }
      },
      handler: async ({ symbol }) => {
        const result = await analyzeSentiment(symbol);
        return result;
      }
    }
  }
});

server.listen();
```

---

### `verifyPayment(options)`

Verifies a payment on-chain.

**Parameters:**
- `options` (VerifyPaymentOptions)
  - `paymentHeader` (string) - Base64-encoded payment proof
  - `expectedPrice` (string) - Expected payment amount (e.g., "$0.001")
  - `expectedPayTo` (string) - Expected recipient wallet address
  - `network` (Network) - Blockchain network identifier
  - `facilitatorUrl?` (string) - Optional facilitator endpoint
  - `testMode?` (boolean) - Skip verification for testing

**Returns:** `Promise<PaymentVerification>`

**Example:**
```typescript
import { verifyPayment } from '@nirholas/universal-crypto-mcp/x402';

const verification = await verifyPayment({
  paymentHeader: req.headers['x-payment'],
  expectedPrice: '$0.001',
  expectedPayTo: '0x...',
  network: 'eip155:42161'
});

if (verification.valid) {
  console.log(`Payment from ${verification.payer}`);
  console.log(`Amount: ${verification.amount}`);
  console.log(`Tx: ${verification.txHash}`);
} else {
  console.error(`Invalid: ${verification.error}`);
}
```

---

## Payment Verifier

### `PaymentVerifier`

Class for managing payment verification logic.

**Constructor:**
```typescript
new PaymentVerifier(config: PaymentConfig)
```

**Methods:**

#### `verify(payment, route)`

Verifies a payment for a specific route.

```typescript
const verifier = new PaymentVerifier({
  wallet: '0x...',
  network: 'eip155:42161'
});

const result = await verifier.verify(
  paymentProof,
  'GET /api/premium'
);
```

#### `getPendingEscrowBalance(payer)`

Gets pending escrow balance for a payer.

```typescript
const balance = await verifier.getPendingEscrowBalance('0x...');
console.log(`Escrowed: ${balance} USDC`);
```

---

## Pricing Engine

### `PricingEngine`

Dynamic pricing engine with support for flat, tiered, and load-based pricing.

**Constructor:**
```typescript
new PricingEngine(pricing: PricingConfig)
```

**Methods:**

#### `setDynamicPricing(route, config)`

Configure dynamic pricing for a route.

```typescript
const engine = new PricingEngine({
  'GET /api/data': '$0.01'
});

engine.setDynamicPricing('GET /api/data', {
  basePrice: '$0.01',
  tiers: [
    { minRequests: 0, maxRequests: 100, price: '$0.01' },
    { minRequests: 100, maxRequests: 1000, price: '$0.008' },
    { minRequests: 1000, price: '$0.005' }
  ],
  loadMultiplier: 1.5
});
```

#### `calculatePrice(route, payer?)`

Calculate price for a route, optionally considering payer history.

```typescript
const price = engine.calculatePrice('GET /api/data', '0x...');
console.log(`Price: ${price}`);
```

#### `recordPayment(payer, record)`

Record a payment for analytics and volume pricing.

```typescript
engine.recordPayment('0x...', {
  id: 'pay_123',
  payer: '0x...',
  route: 'GET /api/data',
  amount: '1000000',
  asset: 'USDC',
  network: 'eip155:42161',
  timestamp: new Date(),
  settled: true
});
```

#### `getPayerHistory(payer)`

Get payment history for a payer.

```typescript
const history = engine.getPayerHistory('0x...');
console.log(`Total payments: ${history.length}`);
```

---

## Rate Limiter

### `RateLimiter`

Token bucket rate limiting per payer.

**Constructor:**
```typescript
new RateLimiter(config: RateLimitConfig)
```

**Methods:**

#### `checkLimit(payer, route?)`

Check if a payer is within rate limits.

```typescript
const limiter = new RateLimiter({
  maxRequests: 100,
  windowSeconds: 3600,
  perPayer: true
});

const result = await limiter.checkLimit('0x...', 'GET /api/data');

if (result.allowed) {
  // Process request
} else {
  res.status(429).json({
    error: 'rate_limit_exceeded',
    retryAfter: result.retryAfter
  });
}
```

#### `resetLimit(payer)`

Reset rate limit for a payer.

```typescript
await limiter.resetLimit('0x...');
```

---

## Analytics Engine

### `AnalyticsEngine`

Track and analyze payment activity.

**Constructor:**
```typescript
new AnalyticsEngine(config: AnalyticsConfig)
```

**Methods:**

#### `trackRequest(payer, route, amount)`

Track a successful request with payment.

```typescript
const analytics = new AnalyticsEngine({ enabled: true });

await analytics.trackRequest('0x...', 'GET /api/data', '1000000');
```

#### `recordPayment(payment)`

Record a payment in analytics.

```typescript
await analytics.recordPayment({
  id: 'pay_123',
  payer: '0x...',
  route: 'GET /api/data',
  amount: '1000000',
  asset: 'USDC',
  network: 'eip155:42161',
  timestamp: new Date(),
  settled: true
});
```

#### `getAnalytics(period?)`

Get analytics summary.

```typescript
const data = await analytics.getAnalytics('30d');

console.log(`Revenue: ${data.totalRevenue}`);
console.log(`Payments: ${data.totalPayments}`);
console.log(`Unique payers: ${data.uniquePayers.size}`);
```

---

## Discovery Protocol

### `registerService(metadata)`

Register your service in the x402 discovery network.

**Parameters:**
- `metadata` (ServiceMetadata)
  - `name` (string) - Service name
  - `description` (string) - Service description
  - `pricing` (PricingConfig) - Pricing configuration
  - `categories` (string[]) - Service categories
  - `examples?` (Example[]) - Usage examples
  - `endpoint` (string) - Service URL

**Returns:** `Promise<Registration>`

**Example:**
```typescript
import { registerService } from '@nirholas/universal-crypto-mcp/x402';

const registration = await registerService({
  name: 'crypto-sentiment-analyzer',
  description: 'Real-time crypto sentiment analysis from social media',
  pricing: {
    'analyze': '$0.01',
    'batch_analyze': '$0.05'
  },
  categories: ['analytics', 'sentiment', 'crypto'],
  examples: [
    {
      prompt: 'Analyze sentiment for BTC',
      response: 'Sentiment: Bullish (85% confidence)'
    }
  ],
  endpoint: 'https://my-service.vercel.app'
});

console.log(`Registered: ${registration.id}`);
```

---

### `discoverServices(filters)`

Search for services in the discovery network.

**Parameters:**
- `filters` (DiscoveryFilters)
  - `category?` (string) - Filter by category
  - `maxPrice?` (string) - Maximum price
  - `minRating?` (number) - Minimum rating (0-5)
  - `query?` (string) - Search query
  - `limit?` (number) - Max results

**Returns:** `Promise<Service[]>`

**Example:**
```typescript
import { discoverServices } from '@nirholas/universal-crypto-mcp/x402';

const services = await discoverServices({
  category: 'weather',
  maxPrice: '$0.01',
  minRating: 4.0,
  limit: 10
});

for (const service of services) {
  console.log(`${service.name} - ${service.pricing}`);
  console.log(`  ${service.description}`);
  console.log(`  Rating: ${service.rating}/5`);
}
```

---

## Types

### `X402Config`

Main configuration object for x402-deploy.

```typescript
interface X402Config {
  name: string;
  type?: 'express' | 'next' | 'mcp' | 'fastapi';
  payment: PaymentConfig;
  pricing: {
    default?: string;
    routes?: Record<string, string>;
    tools?: Record<string, string>;
  };
  discovery?: DiscoveryConfig;
  rateLimit?: RateLimitConfig;
  analytics?: AnalyticsConfig;
}
```

### `PaymentConfig`

Payment configuration.

```typescript
interface PaymentConfig {
  wallet: `0x${string}`;
  network: Network;
  token?: string;
  facilitator?: string;
  acceptedAssets?: string[];
  escrow?: EscrowConfig;
}
```

### `Network`

Blockchain network identifier.

```typescript
type Network = 
  | 'eip155:1'      // Ethereum
  | 'eip155:42161'  // Arbitrum
  | 'eip155:8453'   // Base
  | 'eip155:137'    // Polygon
  | 'eip155:10'     // Optimism
  | 'eip155:84532'  // Base Sepolia
  | string;
```

### `PaymentVerification`

Result of payment verification.

```typescript
interface PaymentVerification {
  valid: boolean;
  payer: string;
  amount: string;
  txHash?: string;
  error?: string;
}
```

### `PricingTier`

Volume-based pricing tier.

```typescript
interface PricingTier {
  minRequests: number;
  maxRequests?: number;
  price: string;
}
```

### `DynamicPricing`

Dynamic pricing configuration.

```typescript
interface DynamicPricing {
  basePrice: string;
  tiers?: PricingTier[];
  loadMultiplier?: number;
  timePricing?: TimePricing;
}
```

### `PaymentRecord`

Individual payment record.

```typescript
interface PaymentRecord {
  id: string;
  payer: string;
  route: string;
  amount: string;
  asset: string;
  network: Network;
  txHash?: string;
  timestamp: Date;
  settled: boolean;
}
```

---

## Utilities

### `parsePrice(price)`

Parse a price string to normalized format.

```typescript
import { parsePrice } from '@nirholas/universal-crypto-mcp/x402';

const { value, currency } = parsePrice('$0.001');
// { value: 0.001, currency: 'USD' }

const { value, currency } = parsePrice('1000000 USDC');
// { value: 1000000, currency: 'USDC' }
```

### `formatPrice(value, currency)`

Format a price value to string.

```typescript
import { formatPrice } from '@nirholas/universal-crypto-mcp/x402';

const price = formatPrice(0.001, 'USD');
// '$0.001000'

const price = formatPrice(1000000, 'USDC');
// '1000000 USDC'
```

### `priceToX402Format(price, decimals)`

Convert price to x402 payment format.

```typescript
import { priceToX402Format } from '@nirholas/universal-crypto-mcp/x402';

const formatted = priceToX402Format('$0.01', 6);
// { asset: 'USDC', amount: '10000' }
```

---

## Next.js Integration

### `createX402Middleware(config)`

Create Next.js middleware for x402 payments.

**Example:**
```typescript
// middleware.ts
import { createX402Middleware } from '@nirholas/universal-crypto-mcp/x402/next';
import config from './x402.config.json';

export const middleware = createX402Middleware(config);

export const config = {
  matcher: '/api/:path*'
};
```

---

## Error Handling

### Common Errors

**PaymentRequiredError**
```typescript
{
  status: 402,
  error: 'payment_required',
  message: 'Payment required to access this resource',
  payment: {
    price: '$0.001',
    wallet: '0x...',
    network: 'eip155:42161',
    token: 'USDC'
  }
}
```

**PaymentInvalidError**
```typescript
{
  status: 402,
  error: 'payment_invalid',
  message: 'Payment verification failed',
  reason: 'insufficient_amount' | 'wrong_recipient' | 'transaction_not_found'
}
```

**RateLimitError**
```typescript
{
  status: 429,
  error: 'rate_limit_exceeded',
  message: 'Rate limit exceeded',
  retryAfter: 3600,
  limit: 100,
  window: 3600
}
```

---

## Best Practices

### 1. Error Handling

Always handle payment errors gracefully:

```typescript
app.get('/api/data', async (req, res) => {
  try {
    const data = await getData();
    res.json(data);
  } catch (error) {
    if (error.status === 402) {
      res.status(402).json({
        error: 'payment_required',
        payment: error.payment
      });
    } else {
      res.status(500).json({ error: 'internal_error' });
    }
  }
});
```

### 2. Caching

Cache expensive operations:

```typescript
import NodeCache from 'node-cache';

const cache = new NodeCache({ stdTTL: 600 });

app.get('/api/data', async (req, res) => {
  const cached = cache.get('data');
  if (cached) return res.json(cached);
  
  const data = await expensiveOperation();
  cache.set('data', data);
  res.json(data);
});
```

### 3. Rate Limiting

Implement rate limiting per payer:

```typescript
{
  "rateLimit": {
    "enabled": true,
    "maxRequests": 100,
    "windowSeconds": 3600,
    "perPayer": true
  }
}
```

### 4. Monitoring

Enable analytics and webhooks:

```typescript
{
  "analytics": {
    "enabled": true,
    "webhookUrl": "https://myapp.com/webhooks/payment",
    "webhookSecret": "secret",
    "verbose": true
  }
}
```

---

## See Also

- **[Configuration Guide](./configuration.md)** - Complete configuration reference
- **[Deployment Guide](./deployment.md)** - Production deployment
- **[Quick Start](./quick-start.md)** - Get started in 5 minutes
- **[Examples](../../examples/)** - Code examples
