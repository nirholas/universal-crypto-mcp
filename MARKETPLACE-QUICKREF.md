# 🏪 AI Service Marketplace - Quick Reference

## 🚀 Quick Start

### Register a Service (30 seconds)

```typescript
import { MarketplaceService } from '@nirholas/universal-crypto-mcp-marketplace';

const marketplace = new MarketplaceService({
  chain: 'arbitrum',
  privateKey: process.env.PRIVATE_KEY
});

const service = await marketplace.registerService({
  name: 'Weather AI',
  description: 'AI-powered weather forecasting',
  category: 'weather',
  endpoint: 'https://api.example.com',
  pricing: {
    payPerUse: '$0.001',
    subscription: { monthly: '$9.99' }
  },
  walletAddress: '0x...'
});
```

### Discover Services (10 seconds)

```typescript
const services = await marketplace.discoverServices({
  category: 'weather',
  maxPrice: '$0.01',
  minRating: 4.5
});
```

### Subscribe (20 seconds)

```typescript
await marketplace.subscribe({
  serviceId: services[0].id,
  plan: 'monthly',
  paymentToken: 'USDC',
  autoRenew: true
});
```

---

## 📊 Key Features

| Feature | Description | Benefit |
|---------|-------------|---------|
| 🔍 Discovery | Find services by category, price, rating | AI agents find best services |
| ⭐ Reputation | On-chain ratings (1-5 stars) | Build trust, grow revenue |
| 💳 Payments | Pay-per-use + subscriptions | Flexible monetization |
| 📊 Analytics | Track usage, revenue, performance | Data-driven optimization |
| 🔒 Escrow | Secure payment holding | Protect buyers & sellers |
| ⚖️ Disputes | Platform mediation | Fair conflict resolution |

---

## 💰 Pricing Models

### Pay-Per-Use
```typescript
pricing: { payPerUse: '$0.001' }
```
**Best for:** APIs, data queries, one-time services  
**Example:** $0.001 × 10,000 requests = **$10/day**

### Subscription
```typescript
pricing: {
  subscription: {
    monthly: '$9.99',
    annually: '$99.99'
  }
}
```
**Best for:** Regular usage, predictable revenue  
**Example:** 100 subscribers × $9.99 = **$999/month**

### Freemium
```typescript
pricing: {
  freeTier: { requestsPerDay: 100 },
  subscription: { monthly: '$9.99' }
}
```
**Best for:** User acquisition, growth  
**Example:** 5% conversion = **$50/month** from 100 free users

---

## 🎯 Use Cases

### 1. Weather API
- **Pricing:** $0.001 per request
- **Volume:** 10,000 requests/day
- **Revenue:** **$300/month**

### 2. Trading Signals
- **Pricing:** $49.99/month subscription
- **Subscribers:** 100
- **Revenue:** **$5,000/month**

### 3. AI Images
- **Pricing:** $0.05 per image
- **Volume:** 1,000 images/day
- **Revenue:** **$1,500/month**

### 4. Data Analytics
- **Pricing:** $99.99/month (pro plan)
- **Subscribers:** 50
- **Revenue:** **$5,000/month**

---

## 🔧 Common Operations

### Update Service
```typescript
await marketplace.updateService(serviceId, {
  pricing: { payPerUse: '$0.002' }
});
```

### Pause Service
```typescript
await marketplace.setServiceStatus(serviceId, 'paused');
```

### Get Analytics
```typescript
const analytics = await marketplace.getAnalytics(serviceId, 'month');
console.log(`Revenue: $${analytics.revenue}`);
```

### Submit Rating
```typescript
await marketplace.rateService({
  serviceId,
  rating: 5,
  review: 'Excellent!'
});
```

### File Dispute
```typescript
await marketplace.fileDispute(
  serviceId,
  'Service did not respond',
  ['https://proof.png']
);
```

---

## 📈 Revenue Calculator

| Monthly Requests | Price/Request | Revenue |
|-----------------|---------------|---------|
| 1,000 | $0.001 | $1 |
| 10,000 | $0.001 | $10 |
| 100,000 | $0.001 | $100 |
| 1,000,000 | $0.001 | $1,000 |

| Subscribers | Price/Month | Revenue |
|------------|-------------|---------|
| 10 | $9.99 | $99.90 |
| 50 | $9.99 | $499.50 |
| 100 | $9.99 | $999 |
| 500 | $9.99 | $4,995 |

---

## 🔐 Security Features

✅ **Payment Escrow** - Funds held until service delivered  
✅ **Dispute Resolution** - Platform mediates conflicts  
✅ **Automatic Refunds** - Violations trigger refunds  
✅ **Spam Detection** - Filters fake reviews  
✅ **Health Monitoring** - Tracks uptime & performance  

---

## 📚 Documentation Links

- **[Full Documentation](docs/content/packages/marketplace.md)**
- **[Tutorial](docs/content/tutorials/marketplace-service.md)**
- **[Example Code](examples/marketplace-service/)**
- **[Smart Contract](contracts/marketplace/AIServiceMarketplace.sol)**
- **[Feature Overview](MARKETPLACE.md)**

---

## 🆘 Common Issues

### "Service already exists"
**Solution:** Use a unique service name or update existing service

### "Payment Required"
**Solution:** Ensure wallet has sufficient USDC balance

### "Subscription expired"
**Solution:** Renew subscription or enable auto-renewal

### "Invalid rating"
**Solution:** Rating must be 1-5 stars

---

## 📞 Support

- **Issues:** [GitHub](https://github.com/nirholas/universal-crypto-mcp/issues)
- **Email:** support@universal-crypto-mcp.com
- **Discord:** Coming soon

---

## 🎓 Learn More

1. **[Read the tutorial](docs/content/tutorials/marketplace-service.md)** (30 min)
2. **[Browse examples](examples/marketplace-service/)** (10 min)
3. **[Review API docs](docs/content/packages/marketplace.md)** (reference)
4. **[Deploy your service](MARKETPLACE.md#deployment)** (1 hour)

---

<div align="center">

**Start earning today!** 💰

[Register Service →](https://marketplace.universal-crypto-mcp.com)

</div>
