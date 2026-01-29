# AI Service Marketplace Tutorial

Build a complete AI service with monetization, discovery, and reputation management using the Universal Crypto MCP marketplace.

## What You'll Build

A production-ready AI weather service that:
- Accepts payments via pay-per-use and subscriptions
- Gets discovered by AI agents automatically
- Earns ratings and builds reputation
- Tracks analytics and revenue
- Handles disputes automatically

**Time to complete:** 30 minutes

## Prerequisites

- Node.js 18+ and pnpm
- A crypto wallet with some ETH (Arbitrum)
- Basic knowledge of Express.js
- API key from weather provider (optional)

## Step 1: Setup

Install the marketplace package:

```bash
pnpm add @nirholas/universal-crypto-mcp-marketplace express
```

Create your project structure:

```bash
mkdir weather-ai-service && cd weather-ai-service
touch index.ts .env
```

## Step 2: Register Your Service

Create `index.ts`:

```typescript
import { MarketplaceService } from '@nirholas/universal-crypto-mcp-marketplace';

const marketplace = new MarketplaceService({
  chain: 'arbitrum',
  privateKey: process.env.PRIVATE_KEY!
});

// Register your service
const service = await marketplace.registerService({
  name: 'Weather AI Pro',
  description: 'High-accuracy weather predictions powered by machine learning',
  category: 'weather',
  endpoint: 'https://your-domain.com/api',
  
  // Flexible pricing options
  pricing: {
    payPerUse: '$0.001',      // $0.001 per API call
    subscription: {
      monthly: '$9.99',
      annually: '$99.99'       // 17% discount
    },
    freeTier: {
      requestsPerDay: 100,
      features: ['Current weather', 'Basic forecast']
    }
  },
  
  // Service metadata
  metadata: {
    responseTime: '< 100ms',
    uptime: '99.9%',
    apiVersion: 'v2.0',
    documentation: 'https://docs.your-domain.com',
    supportEmail: 'support@your-domain.com'
  },
  
  tags: ['weather', 'ai', 'forecasting', 'real-time'],
  walletAddress: process.env.WALLET_ADDRESS!
});

console.log(`✅ Service registered: ${service.id}`);
console.log(`📍 View at: https://marketplace.universal-crypto-mcp.com/services/${service.id}`);
```

## Step 3: Add Payment Verification

Protect your API endpoints:

```typescript
import express from 'express';
import { SubscriptionManager } from '@nirholas/universal-crypto-mcp-marketplace';

const app = express();

// Initialize subscription manager
const subscriptions = new SubscriptionManager({
  contractAddress: process.env.MARKETPLACE_CONTRACT as `0x${string}`,
  tokenAddress: process.env.USDC_ADDRESS as `0x${string}`,
  chain: 'arbitrum'
});

// Payment verification middleware
async function requirePayment(req, res, next) {
  const walletAddress = req.header('X-Wallet-Address');
  const payment = req.header('X-Payment');
  
  // Check subscription
  if (walletAddress) {
    const isActive = await subscriptions.isActive(service.id, walletAddress);
    if (isActive) {
      req.accessType = 'subscription';
      return next();
    }
  }
  
  // Check one-time payment
  if (payment) {
    // Verify payment via x402
    const valid = await verifyPayment(payment);
    if (valid) {
      req.accessType = 'payPerUse';
      return next();
    }
  }
  
  // Free tier
  const dailyUsage = await getDailyUsage(req.ip);
  if (dailyUsage < 100) {
    req.accessType = 'free';
    await incrementUsage(req.ip);
    return next();
  }
  
  // No access
  res.status(402).json({
    error: 'Payment Required',
    pricing: service.pricing,
    subscribeUrl: `https://marketplace.universal-crypto-mcp.com/services/${service.id}/subscribe`
  });
}

// Protected endpoint
app.get('/api/weather/forecast', requirePayment, async (req, res) => {
  const { city, days } = req.query;
  
  // Get weather data
  const forecast = await getWeatherForecast(city, days);
  
  // Premium features for paid users
  if (req.accessType !== 'free') {
    forecast.aiInsights = await generateAIInsights(forecast);
    forecast.hourlyData = await getHourlyData(city);
  }
  
  res.json(forecast);
});
```

## Step 4: Implement Your API

Add your weather logic:

```typescript
// Free endpoint: Current weather
app.get('/api/weather/current', async (req, res) => {
  const { city } = req.query;
  
  const weather = {
    city,
    temperature: 15,
    conditions: 'Partly Cloudy',
    humidity: 65,
    timestamp: new Date()
  };
  
  res.json(weather);
});

// Paid endpoint: Advanced forecast
app.get('/api/weather/forecast', requirePayment, async (req, res) => {
  const { city, days = 7 } = req.query;
  
  const forecast = await getAdvancedForecast(city, days);
  
  res.json({
    city,
    forecast,
    aiPredictions: generatePredictions(forecast),
    confidence: 0.95
  });
});

// Premium endpoint: Deep insights
app.get('/api/weather/insights', requirePayment, async (req, res) => {
  // Subscription only
  if (req.accessType !== 'subscription') {
    return res.status(403).json({
      error: 'Subscription required',
      upgradeUrl: `https://marketplace.universal-crypto-mcp.com/services/${service.id}/subscribe`
    });
  }
  
  const { city } = req.query;
  const insights = await generateDeepInsights(city);
  
  res.json(insights);
});
```

## Step 5: Add Analytics Tracking

Track usage and revenue:

```typescript
// Track every request
app.use((req, res, next) => {
  const start = Date.now();
  
  res.on('finish', async () => {
    const duration = Date.now() - start;
    
    await marketplace.trackUsage({
      serviceId: service.id,
      endpoint: req.path,
      accessType: req.accessType,
      responseTime: duration,
      statusCode: res.statusCode,
      timestamp: new Date()
    });
  });
  
  next();
});

// Analytics dashboard endpoint
app.get('/api/admin/analytics', async (req, res) => {
  const period = req.query.period || 'month';
  const analytics = await marketplace.getAnalytics(service.id, period);
  
  res.json({
    requests: analytics.requests,
    revenue: analytics.revenue,
    subscribers: analytics.activeSubscribers,
    rating: analytics.rating / 100,
    uptime: ((1 - analytics.errorRate) * 100).toFixed(2) + '%',
    avgResponseTime: analytics.averageResponseTime + 'ms'
  });
});
```

## Step 6: Handle Ratings

Encourage and respond to reviews:

```typescript
// Webhook for new ratings
app.post('/api/webhooks/rating', async (req, res) => {
  const { rating, review, reviewer } = req.body;
  
  console.log(`📝 New ${rating}⭐ rating from ${reviewer}`);
  
  // Send thank you for positive reviews
  if (rating >= 4) {
    await sendThankYouEmail(reviewer);
  }
  
  // Flag for support follow-up
  if (rating <= 2) {
    await notifySupport({ reviewer, review, rating });
  }
  
  res.json({ received: true });
});

// Get your ratings
const ratings = await marketplace.getRatings(service.id, 10);
console.log(`Average rating: ${calculateAverage(ratings)}⭐`);
```

## Step 7: Deploy

Deploy to production:

```bash
# Build
pnpm build

# Deploy to Vercel
vercel --prod

# Or use Docker
docker build -t weather-ai .
docker run -p 3000:3000 weather-ai
```

Update your service with production URL:

```typescript
await marketplace.updateService(service.id, {
  endpoint: 'https://weather-ai.your-domain.com/api'
});
```

## Step 8: Monitor & Optimize

Track your service performance:

```typescript
// Daily analytics check
const analytics = await marketplace.getAnalytics(service.id, 'day');

console.log(`
📊 Daily Summary:
  Requests: ${analytics.requests}
  Revenue: $${analytics.revenue}
  New Subscribers: ${analytics.newSubscribers}
  Avg Response: ${analytics.averageResponseTime}ms
  Error Rate: ${(analytics.errorRate * 100).toFixed(2)}%
  Rating: ${(analytics.rating / 100).toFixed(1)}⭐
`);

// Alert on issues
if (analytics.errorRate > 0.05) {
  await alertTeam('High error rate detected');
}

if (analytics.averageResponseTime > 200) {
  await alertTeam('Slow response times');
}
```

## Testing Your Service

### From Command Line

```bash
# Test free tier
curl "http://localhost:3000/api/weather/current?city=London"

# Test with payment
curl "http://localhost:3000/api/weather/forecast?city=London" \
  -H "X-Payment: 0x1234..."

# Test with subscription
curl "http://localhost:3000/api/weather/insights?city=London" \
  -H "X-Wallet-Address: 0x..." \
  -H "X-Subscription-Id: sub_123"
```

### From AI Agent

Your service is automatically discoverable:

```typescript
// AI agents can find your service
import { MarketplaceService } from '@nirholas/universal-crypto-mcp-marketplace';

const marketplace = new MarketplaceService({ chain: 'arbitrum' });

// Discover weather services
const services = await marketplace.discoverServices({
  category: 'weather',
  maxPrice: '$0.01',
  minRating: 4.5,
  sortBy: 'rating'
});

// Your service appears in results!
const weatherAI = services[0];
console.log(`Found: ${weatherAI.name} - ${weatherAI.rating}⭐`);

// Subscribe
await marketplace.subscribe({
  serviceId: weatherAI.id,
  plan: 'monthly',
  paymentToken: 'USDC',
  autoRenew: true
});
```

## Advanced Features

### Subscription Tiers

Offer multiple subscription levels:

```typescript
pricing: {
  subscription: {
    basic: {
      monthly: '$4.99',
      features: ['1000 requests/month', 'Basic support']
    },
    pro: {
      monthly: '$19.99',
      features: ['10000 requests/month', 'Priority support', 'Webhooks']
    },
    enterprise: {
      monthly: '$99.99',
      features: ['Unlimited requests', '24/7 support', 'Custom integrations']
    }
  }
}
```

### Geographic Pricing

Adjust pricing by region:

```typescript
const pricing = {
  US: '$9.99',
  EU: '€8.99',
  APAC: '$7.99'
};

const userRegion = detectRegion(req.ip);
const price = pricing[userRegion] || pricing.US;
```

### Usage-Based Billing

Charge based on actual usage:

```typescript
// Track API calls
let callCount = 0;

app.use((req, res, next) => {
  if (req.accessType === 'payPerUse') {
    callCount++;
    
    // Charge every 100 calls
    if (callCount % 100 === 0) {
      await chargeUser(req.wallet, '$0.10');
    }
  }
  next();
});
```

## Best Practices

### 1. Accurate Service Description

Be clear about what your service does:

```typescript
description: `
  Weather AI Pro provides:
  - 95% accuracy in 7-day forecasts
  - Real-time data from 50+ sources
  - ML-powered predictions
  - Hourly updates
  - Historical data access
`
```

### 2. Transparent Pricing

Show pricing clearly:

```typescript
pricing: {
  payPerUse: '$0.001',  // Clear per-request price
  subscription: {
    monthly: '$9.99',   // ~$0.00033 per request @ 1000 calls
    annually: '$99.99'  // Save $20 per year
  }
}
```

### 3. Fast Response Times

Optimize for speed:

```typescript
// Cache weather data
const cache = new Map();

app.get('/api/weather/current', async (req, res) => {
  const { city } = req.query;
  const cached = cache.get(city);
  
  // Return cached data if < 5 minutes old
  if (cached && Date.now() - cached.timestamp < 300000) {
    return res.json(cached.data);
  }
  
  const data = await fetchWeather(city);
  cache.set(city, { data, timestamp: Date.now() });
  
  res.json(data);
});
```

### 4. Error Handling

Handle errors gracefully:

```typescript
app.use((error, req, res, next) => {
  console.error('API Error:', error);
  
  // Track error
  await marketplace.trackError({
    serviceId: service.id,
    error: error.message,
    endpoint: req.path
  });
  
  res.status(500).json({
    error: 'Service temporarily unavailable',
    support: 'support@your-domain.com',
    status: 'https://status.your-domain.com'
  });
});
```

### 5. Rate Limiting

Protect your service:

```typescript
import rateLimit from 'express-rate-limit';

// Free tier: 100 requests/day
const freeTierLimiter = rateLimit({
  windowMs: 24 * 60 * 60 * 1000,
  max: 100,
  message: 'Free tier limit reached. Please subscribe for unlimited access.'
});

app.get('/api/weather/current', freeTierLimiter, handler);
```

## Monetization Tips

### 1. Competitive Pricing

Research competitors:

```typescript
const competitors = await marketplace.discoverServices({
  category: 'weather',
  sortBy: 'popularity'
});

const avgPrice = calculateAveragePrice(competitors);
console.log(`Market average: ${avgPrice}`);

// Price 10-20% below average for faster growth
const yourPrice = avgPrice * 0.85;
```

### 2. Free Trial

Offer a risk-free trial:

```typescript
pricing: {
  subscription: {
    monthly: '$9.99',
    trial: {
      duration: '7 days',
      features: 'Full access'
    }
  }
}
```

### 3. Referral Rewards

Grow through referrals:

```typescript
// Give 1 month free for each referral
app.post('/api/referral', async (req, res) => {
  const { referrer, referred } = req.body;
  
  // Credit referrer
  await marketplace.addCredit(referrer, '$9.99');
  
  // Discount for referred user
  await marketplace.addDiscount(referred, '50%');
  
  res.json({ success: true });
});
```

## Next Steps

- ✅ Service registered and live
- 📈 Monitor analytics daily
- 💬 Respond to reviews quickly
- 🔧 Optimize based on metrics
- 📣 Market your service
- 🚀 Scale as you grow

## Resources

- [Complete Example Code](../../examples/marketplace-service/)
- [Marketplace API Reference](../packages/marketplace.md)
- [x402 Payment Protocol](../x402-deploy/overview.md)
- [Smart Contract Source](https://github.com/nirholas/universal-crypto-mcp/blob/main/contracts/marketplace/AIServiceMarketplace.sol)

## Support

Questions? Need help?

- **Discord**: [Join our community](https://discord.gg/universal-crypto-mcp)
- **GitHub**: [Open an issue](https://github.com/nirholas/universal-crypto-mcp/issues)
- **Email**: support@universal-crypto-mcp.com

---

**Congratulations!** 🎉 You've built a production-ready AI service with built-in monetization and discovery. Watch the revenue roll in!
