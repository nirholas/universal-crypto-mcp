# AI Service Marketplace

The **AI Service Marketplace** is a comprehensive platform for discovering, monetizing, and managing AI services with built-in reputation management, subscriptions, and payment infrastructure.

## Features

### 🔍 Service Discovery
- Search and filter services by category, price, rating
- Sort by popularity, rating, or newest
- Tag-based organization
- Real-time service health monitoring

### ⭐ Reputation System
- On-chain ratings (1-5 stars)
- Verified reviews from paying customers
- Weighted rating calculation
- Review helpfulness voting
- Spam/abuse reporting

### 💳 Flexible Pricing
- **Pay-per-use**: Single API call payments
- **Subscriptions**: Daily, weekly, monthly, annual plans
- **Free tiers**: Limited free requests
- **Multi-token support**: USDC, DAI, USDT

### 🔒 Security & Trust
- On-chain escrow for payments
- Dispute resolution system
- Automatic refunds for violations
- Service health monitoring
- Uptime guarantees

### 📊 Analytics
- Real-time usage metrics
- Revenue tracking
- Customer analytics
- Performance monitoring
- Churn analysis

## Quick Start

### Installation

```bash
pnpm add @nirholas/universal-crypto-mcp-marketplace
```

### Register Your Service

```typescript
import { MarketplaceService } from '@nirholas/universal-crypto-mcp-marketplace';

const marketplace = new MarketplaceService({
  chain: 'arbitrum',
  privateKey: process.env.PRIVATE_KEY
});

// Register your AI service
const service = await marketplace.registerService({
  name: 'Advanced Weather Predictions',
  description: 'AI-powered weather forecasting with 95% accuracy',
  category: 'weather',
  endpoint: 'https://api.weather-ai.com',
  pricing: {
    payPerUse: '$0.001', // $0.001 per API call
    subscription: {
      monthly: '$9.99',
      annually: '$99.99'
    },
    freeTier: {
      requestsPerDay: 100,
      features: ['Basic forecasts', 'Hourly data']
    }
  },
  metadata: {
    responseTime: '< 100ms',
    uptime: '99.9%',
    apiVersion: 'v2',
    documentation: 'https://docs.weather-ai.com',
    supportEmail: 'support@weather-ai.com'
  },
  tags: ['weather', 'ai', 'forecasting', 'real-time'],
  walletAddress: '0x...' // Your payment wallet
});

console.log(`Service registered with ID: ${service.id}`);
```

### Discover and Use Services

```typescript
// Find the best weather API
const services = await marketplace.discoverServices({
  category: 'weather',
  maxPrice: '$0.01',
  minRating: 4.5,
  sortBy: 'rating',
  limit: 5
});

console.log(`Found ${services.length} weather services`);

// Subscribe to the best one
const bestService = services[0];
const subscription = await marketplace.subscribe({
  serviceId: bestService.id,
  plan: 'monthly',
  paymentToken: 'USDC',
  autoRenew: true
});

console.log(`Subscribed until ${subscription.expiresAt}`);

// Use the service
const response = await fetch(bestService.endpoint, {
  headers: {
    'X-Subscription-Id': subscription.id
  }
});
```

### Rate a Service

```typescript
// Leave a review after using
await marketplace.rateService({
  serviceId: bestService.id,
  rating: 5,
  review: 'Incredibly accurate! Best weather API I\'ve used.',
  tags: ['accurate', 'fast', 'reliable']
});
```

## API Reference

### MarketplaceService

#### Constructor

```typescript
new MarketplaceService(config: MarketplaceConfig)
```

**Config Options:**
- `chain`: Blockchain network ('ethereum' | 'arbitrum' | 'base')
- `privateKey`: Your wallet private key
- `contractAddress?`: Custom marketplace contract
- `rpcUrl?`: Custom RPC endpoint
- `facilitatorUrl?`: x402 facilitator URL

#### registerService()

Register a new AI service in the marketplace.

```typescript
await marketplace.registerService(registration: ServiceRegistration): Promise<Service>
```

**Parameters:**
- `name`: Service name (3-100 chars)
- `description`: Detailed description (10-1000 chars)
- `category`: Service category
- `endpoint`: API endpoint URL
- `pricing`: Pricing configuration
- `metadata?`: Additional service info
- `tags?`: Search tags
- `walletAddress`: Payment destination

**Returns:** Registered service with ID

#### discoverServices()

Find services matching criteria.

```typescript
await marketplace.discoverServices(filter?: ServiceFilter): Promise<Service[]>
```

**Filter Options:**
- `category?`: Filter by category
- `minRating?`: Minimum rating (0-5)
- `maxPrice?`: Maximum price (e.g., "$0.01")
- `tags?`: Filter by tags
- `sortBy?`: Sort order ('rating' | 'price' | 'popularity' | 'newest')
- `limit?`: Max results (1-100)
- `offset?`: Pagination offset

**Returns:** Array of matching services

#### subscribe()

Subscribe to a service.

```typescript
await marketplace.subscribe(subscription: Subscription): Promise<SubscriptionRecord>
```

**Parameters:**
- `serviceId`: Service to subscribe to
- `plan`: Subscription plan ('daily' | 'weekly' | 'monthly' | 'annually')
- `paymentToken`: Payment token symbol
- `autoRenew?`: Enable auto-renewal

**Returns:** Subscription details

#### rateService()

Submit a rating and review.

```typescript
await marketplace.rateService(rating: Rating): Promise<RatingRecord>
```

**Parameters:**
- `serviceId`: Service to rate
- `rating`: Rating (1-5 stars)
- `review?`: Text review (max 1000 chars)
- `tags?`: Review tags

**Returns:** Rating record

#### getAnalytics()

Get service analytics (owner only).

```typescript
await marketplace.getAnalytics(
  serviceId: string,
  period?: 'day' | 'week' | 'month' | 'year'
): Promise<ServiceAnalytics>
```

**Returns:** Analytics data including:
- Request count
- Revenue
- Subscriber metrics
- Performance stats
- Rating trends

### SubscriptionManager

Manages on-chain subscriptions.

```typescript
import { SubscriptionManager } from '@nirholas/universal-crypto-mcp-marketplace';

const manager = new SubscriptionManager({
  contractAddress: '0x...',
  tokenAddress: '0x...', // USDC address
  chain: 'arbitrum',
  privateKey: process.env.PRIVATE_KEY
});
```

#### subscribe()

Create on-chain subscription.

```typescript
await manager.subscribe(
  serviceId: string,
  autoRenew: boolean,
  price: string
): Promise<string>
```

#### isActive()

Check if subscription is active.

```typescript
await manager.isActive(serviceId: string, subscriber?: Address): Promise<boolean>
```

#### cancelSubscription()

Cancel subscription.

```typescript
await manager.cancelSubscription(serviceId: string): Promise<string>
```

## Service Categories

- `ai-ml` - AI & Machine Learning
- `data` - Data Services
- `weather` - Weather & Climate
- `finance` - Financial Data
- `social` - Social Media
- `gaming` - Gaming Services
- `media` - Media Processing
- `analytics` - Analytics & Insights
- `security` - Security Services
- `other` - Other Services

## Pricing Examples

### Pay-Per-Use

```typescript
pricing: {
  payPerUse: '$0.001' // $0.001 per request
}
```

### Subscription Plans

```typescript
pricing: {
  subscription: {
    daily: '$0.99',
    weekly: '$4.99',
    monthly: '$9.99',
    annually: '$99.99'
  }
}
```

### Free Tier + Paid

```typescript
pricing: {
  payPerUse: '$0.01',
  freeTier: {
    requestsPerDay: 100,
    features: ['Basic API', 'Standard support']
  }
}
```

## Smart Contract

The marketplace uses an on-chain smart contract for:

- Service registry
- Payment escrow
- Reputation scores
- Subscription management
- Dispute resolution

**Contract Address (Arbitrum):** `0x...` (TBD)

**Key Functions:**
- `registerService()` - Register new service
- `payForRequest()` - Pay for single request
- `subscribe()` - Create subscription
- `rateService()` - Submit rating
- `fileDispute()` - File dispute
- `withdrawEarnings()` - Withdraw revenue

## Dispute Resolution

If a service fails to deliver:

```typescript
// File a dispute
const dispute = await marketplace.fileDispute(
  serviceId,
  'Service did not respond within SLA',
  ['https://proof-screenshot.png']
);

// Platform reviews dispute
// Automatic refund if service violated terms
```

**Dispute Process:**
1. Customer files dispute with evidence
2. Platform investigates (24-48 hours)
3. Service owner responds
4. Resolution: refund, partial refund, or rejection
5. On-chain record of all disputes

## Analytics Dashboard

Track your service performance:

```typescript
const analytics = await marketplace.getAnalytics(serviceId, 'month');

console.log(`
  Requests: ${analytics.requests}
  Revenue: ${analytics.revenue}
  New Subscribers: ${analytics.newSubscribers}
  Churn Rate: ${(analytics.churnedSubscribers / analytics.newSubscribers * 100).toFixed(1)}%
  Avg Response Time: ${analytics.averageResponseTime}ms
  Error Rate: ${(analytics.errorRate * 100).toFixed(2)}%
  Rating: ${(analytics.rating / 100).toFixed(1)}⭐
`);
```

## REST API Server

Run a marketplace API server:

```typescript
import { startMarketplaceAPI } from '@nirholas/universal-crypto-mcp-marketplace';

await startMarketplaceAPI({
  port: 3000,
  chain: 'arbitrum',
  privateKey: process.env.PRIVATE_KEY,
  contractAddress: '0x...',
  tokenAddress: '0x...', // USDC
  cors: true
});
```

**Endpoints:**
- `POST /api/services` - Register service
- `GET /api/services` - Discover services
- `GET /api/services/:id` - Get service details
- `PATCH /api/services/:id` - Update service
- `POST /api/ratings` - Submit rating
- `GET /api/services/:id/ratings` - Get ratings
- `POST /api/subscriptions` - Create subscription
- `POST /api/subscriptions/:id/cancel` - Cancel subscription
- `GET /api/services/:id/analytics` - Get analytics
- `POST /api/disputes` - File dispute

## Examples

See the [examples directory](../../examples/marketplace-service/) for:

- **Weather API Service** - Complete weather service with marketplace integration
- **Trading Signals** - Paid trading signal service
- **AI Image Generation** - Subscription-based image API
- **Data Analytics** - Pay-per-query analytics service

## Best Practices

### For Service Providers

1. **Accurate Pricing**: Set fair, competitive prices
2. **Clear Documentation**: Provide comprehensive API docs
3. **Reliable Service**: Maintain high uptime (>99%)
4. **Fast Response**: Keep latency low (<200ms)
5. **Good Support**: Respond to issues quickly
6. **Transparent Limits**: Clearly state rate limits
7. **Security**: Use HTTPS, validate inputs
8. **Monitoring**: Track errors and performance

### For Service Consumers

1. **Check Ratings**: Look for 4+ star services
2. **Read Reviews**: Read actual user experiences
3. **Test First**: Use free tier before subscribing
4. **Monitor Usage**: Track API call costs
5. **Report Issues**: File disputes if service fails
6. **Leave Reviews**: Help others with honest feedback

## Security

- All payments go through on-chain escrow
- Private keys never exposed to marketplace
- Service endpoints verified via DNS
- Rate limiting prevents abuse
- Dispute system protects consumers
- Spam detection for fake reviews

## Roadmap

- [ ] Multi-chain deployment (Ethereum, Base, Polygon)
- [ ] Service bundling (package multiple services)
- [ ] Referral rewards
- [ ] API key management
- [ ] Usage webhooks
- [ ] Custom analytics
- [ ] White-label marketplace
- [ ] Mobile SDKs

## Support

- **Documentation**: [docs.universal-crypto-mcp.com](https://docs.universal-crypto-mcp.com)
- **Issues**: [GitHub Issues](https://github.com/nirholas/universal-crypto-mcp/issues)
- **Discord**: Coming soon

## License

Apache-2.0
