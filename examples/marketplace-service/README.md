# Weather AI Service with Marketplace Integration

Complete example of an AI weather service registered in the Universal Crypto MCP marketplace.

## Features

- Real-time weather data from multiple sources
- AI-powered forecast predictions
- Pay-per-use and subscription pricing
- Automatic payment verification
- Usage analytics
- 99.9% uptime SLA

## Installation

```bash
cd examples/marketplace-service
pnpm install
```

## Setup

1. Copy environment variables:

```bash
cp .env.example .env
```

2. Configure `.env`:

```env
# Your wallet private key
PRIVATE_KEY=0x...

# Marketplace contract (Arbitrum)
MARKETPLACE_CONTRACT=0x...

# Payment token (USDC)
PAYMENT_TOKEN=0xFF970A61A04b1cA14834A43f5dE4533eBDDB5CC8

# Blockchain
CHAIN=arbitrum
RPC_URL=https://arb1.arbitrum.io/rpc

# API Keys
OPENWEATHER_API_KEY=your_key
WEATHERAPI_KEY=your_key

# Service Config
PORT=3000
SERVICE_NAME=Weather AI
```

## Run the Service

```bash
pnpm start
```

The service will:
1. Start Express server on port 3000
2. Register with the marketplace
3. Begin accepting requests

## API Endpoints

### Free Tier

```bash
# Current weather (100 requests/day free)
curl http://localhost:3000/api/weather/current?city=London

# Response:
{
  "city": "London",
  "temperature": 15,
  "conditions": "Partly Cloudy",
  "humidity": 65,
  "wind": "10 mph NW"
}
```

### Paid Tier ($0.001 per request)

```bash
# Advanced forecast with AI predictions
curl http://localhost:3000/api/weather/forecast \
  -H "X-Payment: 0x1234..." \
  ?city=London&days=7

# Response:
{
  "city": "London",
  "forecast": [
    {
      "date": "2025-01-30",
      "high": 16,
      "low": 8,
      "conditions": "Sunny",
      "precipitation": 10,
      "aiPrediction": "Clear skies expected, ideal for outdoor activities"
    },
    ...
  ]
}
```

### Subscription ($9.99/month)

```bash
# Premium AI insights (unlimited requests)
curl http://localhost:3000/api/weather/insights \
  -H "X-Subscription-Id: sub_123..." \
  ?city=London

# Response:
{
  "city": "London",
  "insights": {
    "weekAhead": "Warming trend expected, temperatures 2-3°C above average",
    "bestDays": ["2025-02-01", "2025-02-04"],
    "worstDays": ["2025-02-02"],
    "recommendations": [
      "Plan outdoor activities for Friday",
      "Expect rain Tuesday morning"
    ],
    "alerts": [
      "Potential for heavy rain Wednesday evening"
    ]
  }
}
```

## Service Registration

```typescript
import { MarketplaceService } from '@nirholas/universal-crypto-mcp-marketplace';
import express from 'express';

const app = express();

// Initialize marketplace
const marketplace = new MarketplaceService({
  chain: 'arbitrum',
  privateKey: process.env.PRIVATE_KEY
});

// Register service
const service = await marketplace.registerService({
  name: 'Weather AI',
  description: 'AI-powered weather forecasting with 95% accuracy. Real-time data from multiple sources with machine learning predictions.',
  category: 'weather',
  endpoint: 'https://api.weather-ai.example.com',
  pricing: {
    payPerUse: '$0.001',
    subscription: {
      monthly: '$9.99',
      annually: '$99.99'
    },
    freeTier: {
      requestsPerDay: 100,
      features: ['Current weather', 'Basic forecast']
    }
  },
  metadata: {
    responseTime: '< 100ms',
    uptime: '99.9%',
    apiVersion: 'v2.0',
    documentation: 'https://docs.weather-ai.example.com',
    supportEmail: 'support@weather-ai.example.com',
    supportUrl: 'https://support.weather-ai.example.com',
    terms: 'https://weather-ai.example.com/terms',
    privacy: 'https://weather-ai.example.com/privacy'
  },
  tags: ['weather', 'ai', 'forecasting', 'real-time', 'ml'],
  walletAddress: process.env.WALLET_ADDRESS
});

console.log(`✅ Service registered: ${service.id}`);
```

## Payment Verification Middleware

```typescript
import { SubscriptionManager } from '@nirholas/universal-crypto-mcp-marketplace';

const subscriptionManager = new SubscriptionManager({
  contractAddress: process.env.MARKETPLACE_CONTRACT,
  tokenAddress: process.env.PAYMENT_TOKEN,
  chain: 'arbitrum'
});

// Middleware to verify payment or subscription
async function verifyAccess(req, res, next) {
  const paymentHeader = req.header('X-Payment');
  const subscriptionId = req.header('X-Subscription-Id');
  const walletAddress = req.header('X-Wallet-Address');

  // Check subscription
  if (subscriptionId && walletAddress) {
    const isActive = await subscriptionManager.isActive(
      service.id,
      walletAddress
    );
    
    if (isActive) {
      req.accessType = 'subscription';
      return next();
    }
  }

  // Check pay-per-use payment
  if (paymentHeader) {
    const valid = await verifyPayment(paymentHeader);
    if (valid) {
      req.accessType = 'payPerUse';
      return next();
    }
  }

  // Free tier check
  const dailyUsage = await checkDailyUsage(req.ip);
  if (dailyUsage < 100) {
    req.accessType = 'free';
    await incrementDailyUsage(req.ip);
    return next();
  }

  // No valid access
  res.status(402).json({
    error: 'Payment Required',
    message: 'Subscribe or pay per request to access this endpoint',
    pricing: service.pricing
  });
}

// Protected endpoint
app.get('/api/weather/forecast', verifyAccess, async (req, res) => {
  const { city, days } = req.query;
  
  // Get weather data
  const forecast = await getWeatherForecast(city, days);
  
  // Add AI insights for paid users
  if (req.accessType !== 'free') {
    forecast.aiInsights = await generateAIInsights(forecast);
  }
  
  res.json(forecast);
});
```

## Analytics Tracking

```typescript
// Track usage for analytics
async function trackRequest(serviceId, endpoint, accessType) {
  await marketplace.trackUsage({
    serviceId,
    endpoint,
    accessType,
    timestamp: new Date(),
    responseTime: Date.now() - req.startTime
  });
}

// Get analytics dashboard
app.get('/api/admin/analytics', async (req, res) => {
  const analytics = await marketplace.getAnalytics(service.id, 'month');
  
  res.json({
    requests: analytics.requests,
    revenue: analytics.revenue,
    subscribers: analytics.activeSubscribers,
    rating: analytics.rating / 100,
    responseTime: `${analytics.averageResponseTime}ms`,
    uptime: `${((1 - analytics.errorRate) * 100).toFixed(2)}%`
  });
});
```

## Handling Ratings

```typescript
// Webhook for new ratings
app.post('/api/webhooks/rating', async (req, res) => {
  const { rating, review, reviewer } = req.body;
  
  console.log(`New ${rating}⭐ rating from ${reviewer}`);
  console.log(`Review: ${review}`);
  
  // Send thank you email
  if (rating >= 4) {
    await sendThankYouEmail(reviewer);
  }
  
  // Flag for follow-up if low rating
  if (rating <= 2) {
    await notifySupport(reviewer, review);
  }
  
  res.json({ received: true });
});
```

## Testing

```bash
# Run tests
pnpm test

# Test free tier
curl http://localhost:3000/api/weather/current?city=London

# Test payment
curl http://localhost:3000/api/weather/forecast?city=London \
  -H "X-Payment: 0x..."

# Test subscription
curl http://localhost:3000/api/weather/insights?city=London \
  -H "X-Subscription-Id: sub_123" \
  -H "X-Wallet-Address: 0x..."
```

## Deployment

```bash
# Build for production
pnpm build

# Deploy to cloud
vercel --prod

# Or use Docker
docker build -t weather-ai .
docker run -p 3000:3000 weather-ai
```

## Monitoring

```typescript
// Health check endpoint
app.get('/health', async (req, res) => {
  const checks = {
    server: 'ok',
    database: await checkDatabase(),
    externalAPI: await checkWeatherAPI(),
    blockchain: await checkBlockchainConnection(),
    marketplace: await checkMarketplaceConnection()
  };
  
  const allOk = Object.values(checks).every(v => v === 'ok');
  
  res.status(allOk ? 200 : 503).json(checks);
});

// Uptime monitoring
setInterval(async () => {
  const health = await fetch('http://localhost:3000/health');
  if (!health.ok) {
    await notifyAdmin('Service unhealthy');
  }
}, 60000); // Check every minute
```

## Customer Support

```typescript
// Support webhook for new disputes
app.post('/api/webhooks/dispute', async (req, res) => {
  const { disputeId, customer, reason } = req.body;
  
  // Alert support team
  await sendSlackAlert(`
    🚨 New dispute filed
    Customer: ${customer}
    Reason: ${reason}
    Link: https://dashboard.example.com/disputes/${disputeId}
  `);
  
  // Auto-respond to customer
  await sendEmail(customer, {
    subject: 'We received your dispute',
    body: `We're investigating your issue and will respond within 24 hours.`
  });
  
  res.json({ received: true });
});
```

## Performance Tips

1. **Cache weather data** (5-15 minute TTL)
2. **Use Redis** for rate limiting
3. **Load balance** across multiple instances
4. **CDN** for static assets
5. **Database indexing** for fast lookups
6. **Async processing** for analytics
7. **Connection pooling** for RPC calls

## Revenue Optimization

```typescript
// A/B test pricing
const experiments = {
  monthly_price: ['$9.99', '$14.99', '$7.99'],
  annual_discount: ['17%', '20%', '25%']
};

// Track conversion rates
async function trackConversion(visitorId, pricing, converted) {
  await analytics.track({
    visitorId,
    experiment: 'monthly_price',
    variant: pricing,
    converted,
    timestamp: new Date()
  });
}

// Analyze results
const results = await analytics.getExperiment('monthly_price');
console.log(`Best pricing: ${results.winner} (${results.conversionRate}% CVR)`);
```

## Complete Code

See [weather-ai-service.ts](./weather-ai-service.ts) for the complete implementation.

## License

Apache-2.0
