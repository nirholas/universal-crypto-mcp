import express from 'express';
import { MarketplaceService, SubscriptionManager } from '@nirholas/universal-crypto-mcp-marketplace';

// Configuration
const config = {
  port: process.env.PORT || 3000,
  privateKey: process.env.PRIVATE_KEY!,
  marketplaceContract: process.env.MARKETPLACE_CONTRACT!,
  paymentToken: process.env.PAYMENT_TOKEN!,
  chain: 'arbitrum',
  walletAddress: process.env.WALLET_ADDRESS!
};

// Initialize services
const marketplace = new MarketplaceService({
  chain: config.chain,
  privateKey: config.privateKey
});

const subscriptionManager = new SubscriptionManager({
  contractAddress: config.marketplaceContract as `0x${string}`,
  tokenAddress: config.paymentToken as `0x${string}`,
  chain: config.chain as any,
  privateKey: config.privateKey
});

// Create Express app
const app = express();
app.use(express.json());

// In-memory usage tracking (use Redis in production)
const dailyUsage = new Map<string, number>();

// Register service on startup
let serviceId: string;

async function registerService() {
  const service = await marketplace.registerService({
    name: 'Weather AI',
    description: 'AI-powered weather forecasting with 95% accuracy. Real-time data from multiple sources with machine learning predictions.',
    category: 'weather',
    endpoint: `http://localhost:${config.port}`,
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
      supportEmail: 'support@weather-ai.example.com'
    },
    tags: ['weather', 'ai', 'forecasting', 'real-time', 'ml'],
    walletAddress: config.walletAddress as `0x${string}`
  });

  serviceId = service.id;
  console.log(`✅ Service registered: ${serviceId}`);
  return service;
}

// Payment verification middleware
async function verifyAccess(req: any, res: any, next: any) {
  const paymentHeader = req.header('X-Payment');
  const subscriptionId = req.header('X-Subscription-Id');
  const walletAddress = req.header('X-Wallet-Address') as `0x${string}`;

  // Check subscription
  if (subscriptionId && walletAddress) {
    try {
      const isActive = await subscriptionManager.isActive(serviceId, walletAddress);
      if (isActive) {
        req.accessType = 'subscription';
        return next();
      }
    } catch (error) {
      console.error('Subscription check failed:', error);
    }
  }

  // Check pay-per-use payment (simplified - use x402 in production)
  if (paymentHeader) {
    req.accessType = 'payPerUse';
    return next();
  }

  // Free tier check
  const key = req.ip;
  const usage = dailyUsage.get(key) || 0;
  
  if (usage < 100) {
    dailyUsage.set(key, usage + 1);
    req.accessType = 'free';
    return next();
  }

  // No valid access
  return res.status(402).json({
    error: 'Payment Required',
    message: 'Subscribe or pay per request to access this endpoint',
    pricing: {
      payPerUse: '$0.001',
      subscription: {
        monthly: '$9.99',
        annually: '$99.99'
      }
    },
    subscribeUrl: `https://marketplace.example.com/services/${serviceId}`
  });
}

// Mock weather data (replace with real API)
function getCurrentWeather(city: string) {
  return {
    city,
    temperature: 15,
    conditions: 'Partly Cloudy',
    humidity: 65,
    wind: '10 mph NW',
    timestamp: new Date().toISOString()
  };
}

function getForecast(city: string, days: number) {
  return Array.from({ length: days }, (_, i) => ({
    date: new Date(Date.now() + i * 86400000).toISOString().split('T')[0],
    high: 15 + Math.random() * 10,
    low: 8 + Math.random() * 5,
    conditions: ['Sunny', 'Cloudy', 'Rainy'][Math.floor(Math.random() * 3)],
    precipitation: Math.floor(Math.random() * 100)
  }));
}

function generateAIInsights(forecast: any[]) {
  return {
    weekAhead: 'Warming trend expected, temperatures 2-3°C above average',
    bestDays: [forecast[0].date, forecast[3].date],
    worstDays: [forecast[1].date],
    recommendations: [
      'Plan outdoor activities for Friday',
      'Expect rain Tuesday morning'
    ],
    alerts: ['Potential for heavy rain Wednesday evening']
  };
}

// ==================== API Endpoints ====================

// Free tier: Current weather
app.get('/api/weather/current', async (req, res) => {
  const { city } = req.query;
  
  if (!city) {
    return res.status(400).json({ error: 'City parameter required' });
  }

  const weather = getCurrentWeather(city as string);
  res.json(weather);
});

// Paid tier: Advanced forecast
app.get('/api/weather/forecast', verifyAccess, async (req, res) => {
  const { city, days = 7 } = req.query;
  
  if (!city) {
    return res.status(400).json({ error: 'City parameter required' });
  }

  const forecast = getForecast(city as string, parseInt(days as string));
  
  // Add AI predictions for paid users
  if (req.accessType !== 'free') {
    const aiPredictions = forecast.map(day => ({
      ...day,
      aiPrediction: `Weather analysis: ${day.conditions} with ${day.precipitation}% chance of rain`
    }));
    
    return res.json({
      city,
      forecast: aiPredictions,
      accessType: req.accessType
    });
  }

  res.json({ city, forecast });
});

// Premium tier: AI insights (subscription only)
app.get('/api/weather/insights', verifyAccess, async (req, res) => {
  const { city } = req.query;
  
  if (req.accessType !== 'subscription') {
    return res.status(403).json({
      error: 'Subscription required',
      message: 'This endpoint requires an active subscription'
    });
  }
  
  if (!city) {
    return res.status(400).json({ error: 'City parameter required' });
  }

  const forecast = getForecast(city as string, 7);
  const insights = generateAIInsights(forecast);

  res.json({
    city,
    insights,
    forecast
  });
});

// Health check
app.get('/health', (req, res) => {
  res.json({
    status: 'ok',
    service: 'Weather AI',
    uptime: process.uptime(),
    timestamp: new Date().toISOString()
  });
});

// Analytics endpoint (owner only)
app.get('/api/admin/analytics', async (req, res) => {
  try {
    const analytics = await marketplace.getAnalytics(serviceId, 'month');
    res.json(analytics);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

// Start server
async function start() {
  try {
    await registerService();
    
    app.listen(config.port, () => {
      console.log(`🚀 Weather AI Service running on http://localhost:${config.port}`);
      console.log(`📊 Analytics: http://localhost:${config.port}/api/admin/analytics`);
      console.log(`❤️  Health: http://localhost:${config.port}/health`);
      console.log();
      console.log('API Endpoints:');
      console.log(`  GET /api/weather/current?city=London (Free)`);
      console.log(`  GET /api/weather/forecast?city=London&days=7 (Paid)`);
      console.log(`  GET /api/weather/insights?city=London (Subscription)`);
    });

    // Reset daily usage at midnight
    setInterval(() => {
      const now = new Date();
      if (now.getHours() === 0 && now.getMinutes() === 0) {
        dailyUsage.clear();
        console.log('🔄 Daily usage counters reset');
      }
    }, 60000);

  } catch (error) {
    console.error('Failed to start service:', error);
    process.exit(1);
  }
}

start();
