# API Reference

## Gateway Middleware

### `x402Gateway(options)`

Creates an x402 payment gateway.

```typescript
import { x402Gateway } from '@nirholas/x402-deploy/gateway';

const gateway = x402Gateway({
  wallet: '0x...',
  network: 'eip155:8453',
  facilitator: 'https://x402.org/facilitator',
  pricing: {
    model: 'per-call',
    default: { price: '$0.01' }
  }
});
```

### Express Middleware

```typescript
app.use(gateway.expressMiddleware());
```

### MCP Server Wrapper

```typescript
const wrappedServer = gateway.wrapMCPServer(originalServer);
```

---

## Analytics Tracker

### `trackPayment(event)`

Track a payment event.

```typescript
await analytics.trackPayment({
  amount: 1000000n, // 1 USDC
  token: 'USDC',
  from: '0xabc',
  to: '0xdef',
  route: '/api/trade',
  method: 'POST',
  network: 'eip155:8453'
});
```

### `getEarningsSummary(period)`

Get earnings summary.

```typescript
const summary = await analytics.getEarningsSummary('today');
// { totalRevenue: "12.45", totalCalls: 1245, uniquePayers: 42 }
```

---

[Full API Docs →](https://x402-deploy.dev/api)
