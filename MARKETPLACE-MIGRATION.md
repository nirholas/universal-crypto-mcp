# 🔄 Migrating to AI Service Marketplace

**Guide for upgrading existing x402 integrations to the new marketplace**

---

## 🎯 Overview

The **AI Service Marketplace** extends the x402 payment protocol with:
- 🔍 Service discovery
- ⭐ Reputation system
- 📊 Analytics dashboard
- 💳 Subscription management
- ⚖️ Dispute resolution

**Migration time:** 15-30 minutes

---

## 🚀 Migration Steps

### Step 1: Install Marketplace Package

```bash
# Add marketplace package
pnpm add @nirholas/universal-crypto-mcp-marketplace
```

### Step 2: Register Your Service

**Before (x402 only):**
```typescript
import { wrapWithX402 } from '@nirholas/universal-crypto-mcp/x402';

app.get('/api/premium', handler);

wrapWithX402(app, {
  pricing: { 'GET /api/premium': '$0.001' },
  wallet: '0x...'
});
```

**After (with marketplace):**
```typescript
import { MarketplaceService } from '@nirholas/universal-crypto-mcp-marketplace';
import { wrapWithX402 } from '@nirholas/universal-crypto-mcp/x402';

// Register in marketplace
const marketplace = new MarketplaceService({
  chain: 'arbitrum',
  privateKey: process.env.PRIVATE_KEY
});

const service = await marketplace.registerService({
  name: 'Premium API',
  description: 'High-quality data API',
  category: 'data',
  endpoint: 'https://api.example.com',
  pricing: {
    payPerUse: '$0.001'
  },
  walletAddress: '0x...'
});

// Keep existing x402 wrapper
wrapWithX402(app, {
  pricing: { 'GET /api/premium': '$0.001' },
  wallet: '0x...',
  serviceId: service.id // Link to marketplace
});
```

### Step 3: Add Subscription Support (Optional)

**Add subscription pricing:**
```typescript
await marketplace.registerService({
  name: 'Premium API',
  // ... other fields
  pricing: {
    payPerUse: '$0.001',
    subscription: {
      monthly: '$9.99',
      annually: '$99.99'
    }
  }
});
```

**Add subscription verification:**
```typescript
import { SubscriptionManager } from '@nirholas/universal-crypto-mcp-marketplace';

const subscriptions = new SubscriptionManager({
  contractAddress: process.env.MARKETPLACE_CONTRACT,
  tokenAddress: process.env.USDC_ADDRESS,
  chain: 'arbitrum'
});

// Middleware
async function verifyAccess(req, res, next) {
  const walletAddress = req.header('X-Wallet-Address');
  
  // Check subscription
  if (walletAddress) {
    const isActive = await subscriptions.isActive(service.id, walletAddress);
    if (isActive) {
      req.accessType = 'subscription';
      return next();
    }
  }
  
  // Fall back to x402 payment
  next();
}

app.get('/api/premium', verifyAccess, handler);
```

### Step 4: Enable Analytics

**Track usage:**
```typescript
app.use((req, res, next) => {
  const start = Date.now();
  
  res.on('finish', async () => {
    await marketplace.trackUsage({
      serviceId: service.id,
      endpoint: req.path,
      accessType: req.accessType,
      responseTime: Date.now() - start,
      statusCode: res.statusCode
    });
  });
  
  next();
});
```

**View analytics:**
```typescript
const analytics = await marketplace.getAnalytics(service.id, 'month');
console.log(`
  Requests: ${analytics.requests}
  Revenue: $${analytics.revenue}
  Avg Response: ${analytics.averageResponseTime}ms
`);
```

---

## 📊 Feature Comparison

| Feature | x402 Only | + Marketplace |
|---------|-----------|---------------|
| Payment Protocol | ✅ | ✅ |
| Pay-per-use | ✅ | ✅ |
| Subscriptions | ❌ | ✅ |
| Service Discovery | ❌ | ✅ |
| Ratings & Reviews | ❌ | ✅ |
| Analytics Dashboard | ❌ | ✅ |
| Dispute Resolution | ❌ | ✅ |
| Revenue Tracking | Basic | Advanced |

---

## 🎓 Common Migration Patterns

### Pattern 1: Add Discovery (No Code Changes)

Simply register your service:

```typescript
await marketplace.registerService({
  name: 'My API',
  endpoint: 'https://existing-api.com',
  pricing: { payPerUse: '$0.001' }
  // ... other fields
});
```

**Benefit:** AI agents can now discover your service  
**Effort:** 5 minutes

### Pattern 2: Add Subscriptions

Add subscription pricing and verification:

```typescript
// 1. Register with subscriptions
await marketplace.registerService({
  pricing: {
    payPerUse: '$0.001',
    subscription: { monthly: '$9.99' }
  }
});

// 2. Verify subscriptions
const isActive = await subscriptions.isActive(serviceId, wallet);
```

**Benefit:** Recurring revenue, reduced transaction costs  
**Effort:** 15 minutes

### Pattern 3: Full Migration

Move all payment logic to marketplace:

```typescript
// Before: x402 only
wrapWithX402(app, { pricing, wallet });

// After: marketplace + x402
const service = await marketplace.registerService({ ... });
wrapWithX402(app, { 
  pricing, 
  wallet,
  serviceId: service.id 
});
```

**Benefit:** Full feature set (discovery, subscriptions, analytics)  
**Effort:** 30 minutes

---

## 🔄 Backward Compatibility

The marketplace is **100% compatible** with existing x402 integrations:

### ✅ What Still Works

- All x402 payment flows
- Existing payment endpoints
- HTTP 402 status codes
- x-payment headers
- Transaction verification

### 🆕 What's New

- Service registration
- Discovery by AI agents
- Subscription support
- On-chain reputation
- Analytics tracking
- Dispute system

### 📝 No Breaking Changes

Your existing code continues to work:

```typescript
// This still works
wrapWithX402(app, {
  pricing: { 'GET /api/data': '$0.001' },
  wallet: '0x...'
});

// Just add marketplace features when ready
```

---

## 💡 Migration Examples

### Example 1: Weather API

**Before:**
```typescript
import { wrapWithX402 } from '@nirholas/universal-crypto-mcp/x402';

app.get('/api/weather', handler);
wrapWithX402(app, {
  pricing: { 'GET /api/weather': '$0.001' },
  wallet: '0x...'
});
```

**After:**
```typescript
import { MarketplaceService } from '@nirholas/universal-crypto-mcp-marketplace';
import { wrapWithX402 } from '@nirholas/universal-crypto-mcp/x402';

const marketplace = new MarketplaceService({ ... });

// Register in marketplace
const service = await marketplace.registerService({
  name: 'Weather API Pro',
  category: 'weather',
  pricing: {
    payPerUse: '$0.001',
    subscription: { monthly: '$9.99' }
  }
});

// Keep x402 wrapper
wrapWithX402(app, {
  pricing: { 'GET /api/weather': '$0.001' },
  wallet: '0x...',
  serviceId: service.id
});
```

**Benefits:**
- ✅ Discoverable by AI agents
- ✅ Subscription revenue
- ✅ Reputation building
- ✅ Analytics tracking

### Example 2: Trading Signals

**Before:**
```typescript
app.get('/api/signals', verifyPayment, handler);
```

**After:**
```typescript
// Register service
await marketplace.registerService({
  name: 'Alpha Trading Signals',
  category: 'finance',
  pricing: { subscription: { monthly: '$49.99' } }
});

// Add subscription check
app.get('/api/signals', async (req, res) => {
  const isActive = await subscriptions.isActive(
    service.id, 
    req.header('X-Wallet-Address')
  );
  
  if (isActive) {
    return handler(req, res);
  }
  
  res.status(402).json({ 
    error: 'Subscription required',
    subscribeUrl: `https://marketplace.../services/${service.id}`
  });
});
```

**Benefits:**
- ✅ Recurring revenue
- ✅ Lower tx costs
- ✅ Better UX
- ✅ Churn tracking

---

## 📈 ROI Analysis

### Time Investment

| Task | Time | Benefit |
|------|------|---------|
| Register service | 5 min | Discovery |
| Add subscriptions | 15 min | Recurring revenue |
| Integrate analytics | 10 min | Data insights |
| **Total** | **30 min** | **Full feature set** |

### Revenue Impact

**Pay-per-use only:**
- 10,000 requests × $0.001 = **$10/day**

**With subscriptions:**
- 50 subscribers × $9.99 = **$499.50/month**
- Pay-per-use: **$10/day**
- **Total: ~$800/month** (8x increase)

**With discovery:**
- 2x more users (better visibility)
- **Total: ~$1,600/month** (16x increase)

---

## 🛠️ Migration Checklist

### Pre-Migration
- [ ] Backup existing code
- [ ] Test current x402 integration
- [ ] Note current revenue/metrics
- [ ] Read marketplace docs

### Migration
- [ ] Install marketplace package
- [ ] Register service
- [ ] Test pay-per-use (existing)
- [ ] Add subscription support
- [ ] Add analytics tracking
- [ ] Test end-to-end

### Post-Migration
- [ ] Monitor analytics
- [ ] Collect ratings
- [ ] Optimize pricing
- [ ] Market your service

---

## 🆘 Troubleshooting

### "Service registration failed"
**Solution:** Check wallet has gas for transaction

### "Can't find my service"
**Solution:** Verify registration completed, check service status

### "Subscriptions not working"
**Solution:** Ensure contract addresses are correct

### "Analytics showing zero"
**Solution:** Make sure tracking middleware is added

---

## 📞 Support

Need help migrating?

- **Documentation:** [Full Guide](docs/content/packages/marketplace.md)
- **Issues:** [GitHub](https://github.com/nirholas/universal-crypto-mcp/issues)
- **Email:** support@universal-crypto-mcp.com

---

## 🎯 Next Steps

1. ✅ **Register your service** (5 min)
2. ✅ **Add subscriptions** (15 min)
3. ✅ **Track analytics** (10 min)
4. ✅ **Optimize pricing** (ongoing)
5. ✅ **Grow revenue** 📈

---

<div align="center">

**Migrate today, earn more tomorrow!** 💰

[Start Migration →](docs/content/tutorials/marketplace-service.md)

</div>
