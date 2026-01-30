# 🔄 Marketplace Migration Example

This example demonstrates how to migrate from x402-only payment gates to the AI Service Marketplace, following the steps in [MARKETPLACE-MIGRATION.md](/MARKETPLACE-MIGRATION.md).

## 📁 Files

| File | Description |
|------|-------------|
| [before-migration.ts](src/before-migration.ts) | Original x402-only API |
| [after-migration.ts](src/after-migration.ts) | Migrated to marketplace with manual setup |
| [full-migration.ts](src/full-migration.ts) | Using MigrationHelper for automated migration |

## 🚀 Quick Start

```bash
# Install dependencies
pnpm install

# Run BEFORE migration example (x402 only)
pnpm demo:before

# Run AFTER migration example (x402 + marketplace)
pnpm demo:after

# Run FULL migration example (using MigrationHelper)
pnpm demo:full
```

## 📊 Comparison

### Before Migration (x402 Only)

```
Port: 3001

Features:
❌ No service discovery
❌ No subscriptions
❌ No analytics
❌ No reputation

Test:
curl http://localhost:3001/api/weather
# Returns 402 Payment Required
```

### After Migration (x402 + Marketplace)

```
Port: 3002

Features:
✅ Registered in AI Service Marketplace
✅ Subscription support ($9.99/mo)
✅ Analytics tracking
✅ Discoverable by AI agents

Test with subscription:
curl -H "X-Wallet-Address: 0xDEMO000000000000000000000000000000000001" \
     http://localhost:3002/api/weather?city=NYC

View analytics:
curl http://localhost:3002/api/analytics
```

### Full Migration (Using Helper)

```
Port: 3003

Features:
✅ Automated service registration
✅ Built-in middleware
✅ Generated migration code
✅ Minimal code changes

Same test commands as above, but on port 3003
```

## 🔧 Migration Steps

### Step 1: Install Marketplace Package

```bash
pnpm add @nirholas/universal-crypto-mcp-marketplace
```

### Step 2: Register Your Service

```typescript
import { MarketplaceService } from '@nirholas/universal-crypto-mcp-marketplace';

const marketplace = new MarketplaceService({
  chain: 'arbitrum',
  privateKey: process.env.PRIVATE_KEY
});

const service = await marketplace.registerService({
  name: 'Weather API Pro',
  description: 'Real-time weather data',
  category: 'weather',
  endpoint: 'https://api.example.com',
  pricing: {
    payPerUse: '$0.001',
    subscription: { monthly: '$9.99' }
  },
  walletAddress: '0x...'
});
```

### Step 3: Add Subscription Verification

```typescript
import { SubscriptionManager } from '@nirholas/universal-crypto-mcp-marketplace';

const subscriptions = new SubscriptionManager({
  chain: 'arbitrum',
  contractAddress: process.env.MARKETPLACE_CONTRACT
});

async function verifyAccess(req, res, next) {
  const walletAddress = req.header('X-Wallet-Address');
  
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
```

### Step 4: Enable Analytics

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

## 📈 Benefits After Migration

| Metric | Before | After |
|--------|--------|-------|
| Discovery | ❌ Hidden | ✅ AI agents find you |
| Revenue | Pay-per-use only | + Subscriptions |
| Analytics | None | Full dashboard |
| Trust | Unknown | Reputation + reviews |

## 🔗 Related

- [MARKETPLACE-MIGRATION.md](/MARKETPLACE-MIGRATION.md) - Full migration guide
- [MARKETPLACE.md](/MARKETPLACE.md) - Marketplace overview
- [packages/marketplace](/packages/marketplace) - Marketplace package source
