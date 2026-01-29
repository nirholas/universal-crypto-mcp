# Building a Paid API Service

Learn how to create a monetized API service that accepts cryptocurrency payments using x402-deploy.

---

## Overview

In this tutorial, you'll build a **weather forecast API** that charges $0.001 per request, accepts USDC payments on Base, and is discoverable by AI agents.

**What You'll Learn:**
- Setting up x402-deploy
- Implementing paid API endpoints
- Deploying to production
- Registering in the discovery network
- Monitoring earnings

**Prerequisites:**
- Node.js 18+
- A crypto wallet (MetaMask)
- Basic Express.js knowledge

**Time:** ~30 minutes

---

## Step 1: Create Your API

First, create a basic Express API:

```bash
mkdir weather-api
cd weather-api
npm init -y
npm install express axios dotenv
```

Create `server.js`:

```javascript
const express = require('express');
const axios = require('axios');
require('dotenv').config();

const app = express();

// Free endpoint
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// Weather forecast endpoint (will be paid)
app.get('/api/weather/:city', async (req, res) => {
  const { city } = req.params;
  
  try {
    // Get weather data from OpenWeatherMap
    const response = await axios.get(
      `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${process.env.OPENWEATHER_API_KEY}&units=metric`
    );
    
    const weather = {
      city: response.data.name,
      temperature: response.data.main.temp,
      feelsLike: response.data.main.feels_like,
      description: response.data.weather[0].description,
      humidity: response.data.main.humidity,
      windSpeed: response.data.wind.speed,
      timestamp: new Date().toISOString()
    };
    
    res.json(weather);
  } catch (error) {
    res.status(404).json({ error: 'City not found' });
  }
});

// 7-day forecast endpoint (premium)
app.get('/api/forecast/:city', async (req, res) => {
  const { city } = req.params;
  
  try {
    const response = await axios.get(
      `https://api.openweathermap.org/data/2.5/forecast?q=${city}&appid=${process.env.OPENWEATHER_API_KEY}&units=metric`
    );
    
    const forecast = response.data.list.map(item => ({
      time: item.dt_txt,
      temperature: item.main.temp,
      description: item.weather[0].description
    }));
    
    res.json({ city, forecast });
  } catch (error) {
    res.status(404).json({ error: 'City not found' });
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Weather API running on port ${PORT}`);
});
```

Create `.env`:

```bash
OPENWEATHER_API_KEY=your-openweather-api-key
PORT=3000
```

Test your API:

```bash
node server.js

# In another terminal
curl http://localhost:3000/api/weather/London
```

---

## Step 2: Add x402 Payment Gateway

Install x402-deploy:

```bash
npm install @nirholas/universal-crypto-mcp
```

Create `x402.config.json`:

```json
{
  "name": "weather-api",
  "type": "express",
  "payment": {
    "wallet": "YOUR_WALLET_ADDRESS",
    "network": "eip155:8453",
    "token": "USDC",
    "facilitator": "https://facilitator.x402.dev"
  },
  "pricing": {
    "routes": {
      "GET /api/health": "free",
      "GET /api/weather/*": "$0.001",
      "GET /api/forecast/*": "$0.005"
    }
  },
  "discovery": {
    "enabled": true,
    "instructions": "Weather forecast API providing current conditions and 7-day forecasts for cities worldwide. Use /api/weather/{city} for current weather or /api/forecast/{city} for extended forecast.",
    "categories": ["weather", "data", "forecast"],
    "examples": [
      {
        "prompt": "What's the weather in London?",
        "response": "Temperature: 15°C, Conditions: Partly cloudy"
      },
      {
        "prompt": "Get 7-day forecast for Tokyo",
        "response": "7-day forecast with temperatures and conditions"
      }
    ]
  },
  "rateLimit": {
    "enabled": true,
    "maxRequests": 100,
    "windowSeconds": 3600,
    "perPayer": true
  },
  "analytics": {
    "enabled": true,
    "verbose": false
  }
}
```

Update `server.js` to wrap with x402:

```javascript
const express = require('express');
const axios = require('axios');
const { wrapWithX402 } = require('@nirholas/universal-crypto-mcp/x402');
const config = require('./x402.config.json');
require('dotenv').config();

const app = express();

// Your existing routes...
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

app.get('/api/weather/:city', async (req, res) => {
  const { city } = req.params;
  
  try {
    const response = await axios.get(
      `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${process.env.OPENWEATHER_API_KEY}&units=metric`
    );
    
    const weather = {
      city: response.data.name,
      temperature: response.data.main.temp,
      feelsLike: response.data.main.feels_like,
      description: response.data.weather[0].description,
      humidity: response.data.main.humidity,
      windSpeed: response.data.wind.speed,
      timestamp: new Date().toISOString()
    };
    
    res.json(weather);
  } catch (error) {
    res.status(404).json({ error: 'City not found' });
  }
});

app.get('/api/forecast/:city', async (req, res) => {
  const { city } = req.params;
  
  try {
    const response = await axios.get(
      `https://api.openweathermap.org/data/2.5/forecast?q=${city}&appid=${process.env.OPENWEATHER_API_KEY}&units=metric`
    );
    
    const forecast = response.data.list.map(item => ({
      time: item.dt_txt,
      temperature: item.main.temp,
      description: item.weather[0].description
    }));
    
    res.json({ city, forecast });
  } catch (error) {
    res.status(404).json({ error: 'City not found' });
  }
});

// Wrap with x402 payment gateway
const wrappedApp = wrapWithX402(app, config);

const PORT = process.env.PORT || 3000;
wrappedApp.listen(PORT, () => {
  console.log(`Weather API with x402 payments running on port ${PORT}`);
  console.log(`Accepting payments at wallet: ${config.payment.wallet}`);
});
```

---

## Step 3: Test Payment Flow

Start your server:

```bash
node server.js
```

### Test Free Endpoint

```bash
curl http://localhost:3000/api/health
# Returns: {"status":"ok","timestamp":"2026-01-29T..."}
```

### Test Paid Endpoint Without Payment

```bash
curl http://localhost:3000/api/weather/London
```

**Response (402 Payment Required):**
```json
{
  "error": "payment_required",
  "message": "Payment required to access this resource",
  "payment": {
    "price": "$0.001",
    "wallet": "0x...",
    "network": "eip155:8453",
    "token": "USDC",
    "instructions": "Send payment and include transaction hash in x-payment header"
  }
}
```

### Test with Payment

```bash
# First, make a payment on Base:
# - Send 0.001 USDC to the wallet address
# - Get the transaction hash

# Then make request with payment proof
curl -X GET http://localhost:3000/api/weather/London \
  -H "x-payment: $(echo '{
    "txHash": "0x...",
    "payer": "0x...",
    "amount": "1000",
    "network": "eip155:8453"
  }' | base64)"
```

**Response (200 OK):**
```json
{
  "city": "London",
  "temperature": 15.2,
  "feelsLike": 14.8,
  "description": "partly cloudy",
  "humidity": 72,
  "windSpeed": 4.5,
  "timestamp": "2026-01-29T12:00:00.000Z"
}
```

---

## Step 4: Deploy to Production

### Option A: Deploy to Vercel

```bash
# Install Vercel CLI
npm install -g vercel

# Deploy
vercel

# Set environment variables
vercel env add OPENWEATHER_API_KEY production
vercel env add X402_WALLET_ADDRESS production
```

### Option B: Deploy with x402-deploy CLI

```bash
# Install x402-deploy CLI
npm install -g @nirholas/universal-crypto-mcp

# Deploy (auto-detects best platform)
x402-deploy deploy --provider vercel

# Or deploy to Railway
x402-deploy deploy --provider railway
```

### Option C: Docker Deployment

Create `Dockerfile`:

```dockerfile
FROM node:18-alpine

WORKDIR /app

COPY package*.json ./
RUN npm ci --production

COPY . .

EXPOSE 3000

CMD ["node", "server.js"]
```

Build and run:

```bash
docker build -t weather-api .
docker run -p 3000:3000 \
  -e OPENWEATHER_API_KEY=your-key \
  -e X402_WALLET_ADDRESS=0x... \
  weather-api
```

---

## Step 5: Register in Discovery Network

Your service is automatically registered when you start it with discovery enabled. To manually register or update:

```bash
x402-deploy marketplace register
```

Verify registration:

```bash
x402-deploy marketplace search --query "weather"
```

Your API should appear in search results, making it discoverable by AI agents!

---

## Step 6: Monitor Earnings

### CLI Dashboard

```bash
x402-deploy dashboard
```

Output:
```
╔═══════════════════════════════════════════════════════════╗
║                  x402 Analytics Dashboard                  ║
╚═══════════════════════════════════════════════════════════╝

📊 Earnings Summary
  Total Revenue:        $12.50
  Total Payments:       1,245
  Unique Payers:        87
  Average Payment:      $0.010

💰 Top Routes
  GET /api/weather/*    $8.32   (832 requests)
  GET /api/forecast/*   $4.18   (836 requests)

👥 Top Payers
  0x742d...        $2.45   (245 requests)
  0x8b5f...        $1.89   (189 requests)
  0x3c2a...        $1.23   (123 requests)
```

### Web Dashboard

```bash
x402-deploy dashboard --web --port 8080
```

Then open http://localhost:8080

### Export Data

```bash
# Export to CSV
x402-deploy analytics --export earnings.csv --format csv

# Export to JSON
x402-deploy analytics --export earnings.json --format json --period 30
```

---

## Step 7: Add Webhooks (Optional)

Receive real-time payment notifications.

Create webhook endpoint in `server.js`:

```javascript
app.post('/webhooks/payment', express.json(), (req, res) => {
  const { event, data, signature } = req.body;
  
  // Verify webhook signature
  const crypto = require('crypto');
  const secret = process.env.WEBHOOK_SECRET;
  const expectedSignature = crypto
    .createHmac('sha256', secret)
    .update(JSON.stringify({ event, data }))
    .digest('hex');
  
  if (`sha256=${expectedSignature}` !== signature) {
    return res.status(401).json({ error: 'Invalid signature' });
  }
  
  // Handle payment event
  if (event === 'payment.received') {
    console.log(`💰 Payment received: ${data.amount} from ${data.payer}`);
    console.log(`   Route: ${data.route}`);
    console.log(`   Tx: ${data.txHash}`);
    
    // Send notification, update database, etc.
  }
  
  res.json({ received: true });
});
```

Update `x402.config.json`:

```json
{
  "analytics": {
    "enabled": true,
    "webhookUrl": "https://your-api.vercel.app/webhooks/payment",
    "webhookSecret": "your-secret-key"
  }
}
```

---

## Advanced Features

### Dynamic Pricing

Offer volume discounts:

```javascript
const { PricingEngine } = require('@nirholas/universal-crypto-mcp/x402');

const engine = new PricingEngine({
  'GET /api/weather/*': '$0.001',
  'GET /api/forecast/*': '$0.005'
});

// Volume-based tiers
engine.setDynamicPricing('GET /api/weather/*', {
  basePrice: '$0.001',
  tiers: [
    { minRequests: 0, maxRequests: 100, price: '$0.001' },
    { minRequests: 100, maxRequests: 1000, price: '$0.0008' },
    { minRequests: 1000, price: '$0.0005' }
  ]
});

// Use custom pricing engine
const wrappedApp = wrapWithX402(app, {
  ...config,
  pricingEngine: engine
});
```

### Custom Authentication

Add additional authentication:

```javascript
const authenticateUser = async (req, res, next) => {
  const apiKey = req.headers['x-api-key'];
  
  if (!apiKey) {
    return res.status(401).json({ error: 'API key required' });
  }
  
  // Verify API key
  const valid = await verifyApiKey(apiKey);
  if (!valid) {
    return res.status(401).json({ error: 'Invalid API key' });
  }
  
  next();
};

// Apply before x402 middleware
app.use(authenticateUser);
const wrappedApp = wrapWithX402(app, config);
```

### Response Caching

Cache expensive API responses:

```javascript
const NodeCache = require('node-cache');
const cache = new NodeCache({ stdTTL: 600 }); // 10 minutes

app.get('/api/weather/:city', async (req, res) => {
  const { city } = req.params;
  
  // Check cache
  const cacheKey = `weather:${city.toLowerCase()}`;
  const cached = cache.get(cacheKey);
  if (cached) {
    return res.json(cached);
  }
  
  // Fetch fresh data
  const weather = await getWeatherData(city);
  
  // Store in cache
  cache.set(cacheKey, weather);
  
  res.json(weather);
});
```

---

## Testing

### Unit Tests

```javascript
const request = require('supertest');
const app = require('./server');

describe('Weather API', () => {
  it('health check should be free', async () => {
    const res = await request(app).get('/api/health');
    expect(res.status).toBe(200);
    expect(res.body).toHaveProperty('status', 'ok');
  });
  
  it('weather endpoint requires payment', async () => {
    const res = await request(app).get('/api/weather/London');
    expect(res.status).toBe(402);
    expect(res.body).toHaveProperty('error', 'payment_required');
  });
  
  it('accepts valid payment', async () => {
    const paymentProof = createMockPayment('0x...', '1000');
    const res = await request(app)
      .get('/api/weather/London')
      .set('x-payment', paymentProof);
    
    expect(res.status).toBe(200);
    expect(res.body).toHaveProperty('city');
  });
});
```

### Integration Tests

```javascript
describe('Payment Flow', () => {
  it('full payment flow', async () => {
    // 1. Request without payment
    let res = await request(app).get('/api/weather/London');
    expect(res.status).toBe(402);
    
    const { payment } = res.body;
    
    // 2. Make payment on blockchain
    const txHash = await sendPayment(payment.wallet, payment.price);
    
    // 3. Request with payment proof
    const proof = createPaymentProof(txHash);
    res = await request(app)
      .get('/api/weather/London')
      .set('x-payment', proof);
    
    expect(res.status).toBe(200);
  });
});
```

---

## Best Practices

### 1. Error Handling

```javascript
app.get('/api/weather/:city', async (req, res) => {
  try {
    const weather = await getWeatherData(req.params.city);
    res.json(weather);
  } catch (error) {
    if (error.code === 'CITY_NOT_FOUND') {
      res.status(404).json({ error: 'City not found' });
    } else {
      console.error('Weather API error:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  }
});
```

### 2. Input Validation

```javascript
const { param, validationResult } = require('express-validator');

app.get('/api/weather/:city',
  param('city').isAlpha().isLength({ min: 2, max: 50 }),
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    
    // Process request...
  }
);
```

### 3. Rate Limiting

```json
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

```javascript
const { AnalyticsEngine } = require('@nirholas/universal-crypto-mcp/x402');

const analytics = new AnalyticsEngine({ enabled: true });

app.use((req, res, next) => {
  const start = Date.now();
  
  res.on('finish', () => {
    const duration = Date.now() - start;
    analytics.trackRequest(req.path, duration, res.statusCode);
  });
  
  next();
});
```

---

## Troubleshooting

### Payment Not Verified

**Problem:** Requests return 402 even after payment

**Solutions:**
1. Check transaction is confirmed on blockchain
2. Verify correct network (Base = eip155:8453)
3. Ensure payment amount matches price
4. Confirm wallet address is correct

```bash
# Debug payment verification
DEBUG=x402:payment node server.js
```

### Rate Limit Errors

**Problem:** Getting 429 errors

**Solutions:**
1. Increase rate limit in config
2. Check if testing with same address
3. Implement per-payer tracking

### Discovery Not Working

**Problem:** Service not appearing in searches

**Solutions:**
1. Verify `discovery.enabled` is true
2. Check categories are valid
3. Wait 5 minutes for propagation
4. Verify service is publicly accessible

---

## Next Steps

1. **Add More Features**
   - Historical weather data
   - Weather alerts
   - Climate statistics

2. **Optimize Performance**
   - Add caching
   - Use CDN for static assets
   - Implement connection pooling

3. **Scale Your Service**
   - Deploy to multiple regions
   - Add load balancing
   - Implement Redis for distributed cache

4. **Build a Client**
   - Create SDK for easy integration
   - Build example integrations
   - Write comprehensive docs

---

## Complete Example

Find the complete code at:
- **GitHub**: [examples/paid-api](https://github.com/nirholas/universal-crypto-mcp/tree/main/examples/paid-api)
- **Live Demo**: https://weather-api-x402.vercel.app

---

## Resources

- **[x402-deploy Documentation](./overview.md)**
- **[API Reference](./api-reference.md)**
- **[Configuration Guide](./configuration.md)**
- **[Deployment Guide](./deployment.md)**

---

<div align="center">

**Ready to build your paid API?**

[Get Started →](./quick-start.md)

</div>
