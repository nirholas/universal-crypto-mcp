/**
 * x402 Payment Gateway Server
 * 
 * Enterprise-grade API gateway with:
 * - x402 payment verification
 * - Multi-tier rate limiting
 * - Subscription management
 * - Analytics and metrics
 * - Health monitoring
 * 
 * @author nirholas
 * @license Apache-2.0
 */

import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import compression from 'compression';
import { createClient } from 'redis';
import { Pool } from 'pg';

// ═══════════════════════════════════════════════════════════════
// Configuration
// ═══════════════════════════════════════════════════════════════

const config = {
  port: parseInt(process.env.PORT || '3000'),
  ssePort: parseInt(process.env.SSE_PORT || '3001'),
  metricsPort: parseInt(process.env.METRICS_PORT || '3002'),
  
  // x402 Payment Config
  x402: {
    wallet: process.env.X402_WALLET,
    network: process.env.X402_NETWORK || 'eip155:8453', // Base mainnet
    facilitator: process.env.X402_FACILITATOR || 'https://facilitator.x402.org',
    token: process.env.X402_TOKEN || 'USDC',
  },
  
  // Rate Limiting
  rateLimit: {
    enabled: process.env.RATE_LIMIT_ENABLED !== 'false',
    freeRequests: parseInt(process.env.RATE_LIMIT_FREE_REQUESTS || '10'),
    windowSeconds: parseInt(process.env.RATE_LIMIT_WINDOW_SECONDS || '3600'),
  },
  
  // Pricing tiers
  pricing: {
    basic: {
      pricePerRequest: '0.001',    // $0.001 per request
      monthlySubscription: '9.99',  // $9.99/month unlimited
    },
    premium: {
      pricePerRequest: '0.0005',   // $0.0005 per request (volume discount)
      monthlySubscription: '49.99', // $49.99/month with priority
    },
    enterprise: {
      pricePerRequest: '0.0002',   // $0.0002 per request
      monthlySubscription: '199.99', // $199.99/month with SLA
    },
  },
  
  redis: process.env.REDIS_URL || 'redis://localhost:6379',
  postgres: process.env.POSTGRES_URL || 'postgres://localhost:5432/ucm',
};

// ═══════════════════════════════════════════════════════════════
// Database Connections
// ═══════════════════════════════════════════════════════════════

const redis = createClient({ url: config.redis });
const postgres = new Pool({ connectionString: config.postgres });

// ═══════════════════════════════════════════════════════════════
// Route Pricing Configuration
// ═══════════════════════════════════════════════════════════════

const routePricing = {
  // Free endpoints (health, discovery)
  free: [
    'GET /health',
    'GET /api/health',
    'GET /.well-known/x402',
    'GET /api/discovery',
  ],
  
  // Basic tier - simple queries
  basic: [
    'GET /api/price/*',
    'GET /api/balance/*',
    'GET /api/token/*',
    'GET /api/gas/*',
  ],
  
  // Premium tier - DeFi operations
  premium: [
    'GET /api/defi/*',
    'GET /api/yields/*',
    'GET /api/tvl/*',
    'POST /api/swap/quote',
    'GET /api/analytics/*',
  ],
  
  // Enterprise tier - Transactions, automation
  enterprise: [
    'POST /api/swap/execute',
    'POST /api/transfer/*',
    'POST /api/bridge/*',
    'POST /api/automation/*',
    'GET /api/whale/*',
    'POST /api/mcp/*',
  ],
};

// ═══════════════════════════════════════════════════════════════
// Payment Verification
// ═══════════════════════════════════════════════════════════════

async function verifyPayment(paymentHeader, expectedPrice, route) {
  try {
    const payment = JSON.parse(Buffer.from(paymentHeader, 'base64').toString());
    
    // Verify with facilitator
    const response = await fetch(`${config.x402.facilitator}/verify`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        payment,
        expectedPrice,
        expectedPayTo: config.x402.wallet,
        network: config.x402.network,
      }),
    });
    
    if (!response.ok) {
      return { valid: false, error: 'Facilitator verification failed' };
    }
    
    const result = await response.json();
    return {
      valid: result.valid,
      payer: result.payer,
      amount: result.amount,
      txHash: result.txHash,
    };
  } catch (error) {
    return { valid: false, error: error.message };
  }
}

// ═══════════════════════════════════════════════════════════════
// Rate Limiting
// ═══════════════════════════════════════════════════════════════

async function checkRateLimit(identifier, route) {
  if (!config.rateLimit.enabled) {
    return { allowed: true, remaining: Infinity };
  }
  
  const key = `ratelimit:${identifier}`;
  const now = Date.now();
  const windowStart = now - (config.rateLimit.windowSeconds * 1000);
  
  // Get current count from Redis
  const multi = redis.multi();
  multi.zRemRangeByScore(key, 0, windowStart);
  multi.zCard(key);
  multi.zAdd(key, { score: now, value: `${now}` });
  multi.expire(key, config.rateLimit.windowSeconds);
  
  const results = await multi.exec();
  const count = results[1];
  
  // Check subscription status
  const subscription = await getSubscription(identifier);
  
  let limit;
  if (subscription?.tier === 'enterprise') {
    limit = Infinity; // Unlimited
  } else if (subscription?.tier === 'premium') {
    limit = 10000; // 10k/hour
  } else if (subscription?.tier === 'basic') {
    limit = 1000; // 1k/hour
  } else {
    limit = config.rateLimit.freeRequests; // Free tier
  }
  
  return {
    allowed: count < limit,
    remaining: Math.max(0, limit - count),
    limit,
    resetAt: now + (config.rateLimit.windowSeconds * 1000),
  };
}

// ═══════════════════════════════════════════════════════════════
// Subscription Management
// ═══════════════════════════════════════════════════════════════

async function getSubscription(walletAddress) {
  const result = await postgres.query(
    `SELECT * FROM subscriptions 
     WHERE wallet_address = $1 
     AND status = 'active' 
     AND expires_at > NOW()
     ORDER BY tier DESC
     LIMIT 1`,
    [walletAddress.toLowerCase()]
  );
  return result.rows[0] || null;
}

async function recordPayment(payment) {
  await postgres.query(
    `INSERT INTO payments (
      payer_address, amount, tx_hash, route, network, created_at
    ) VALUES ($1, $2, $3, $4, $5, NOW())`,
    [payment.payer, payment.amount, payment.txHash, payment.route, config.x402.network]
  );
}

async function updateAnalytics(route, payer, responseTime, statusCode) {
  await postgres.query(
    `INSERT INTO analytics (
      route, payer_address, response_time_ms, status_code, created_at
    ) VALUES ($1, $2, $3, $4, NOW())`,
    [route, payer, responseTime, statusCode]
  );
}

// ═══════════════════════════════════════════════════════════════
// Pricing Engine
// ═══════════════════════════════════════════════════════════════

function getPriceForRoute(route) {
  // Check if free
  for (const pattern of routePricing.free) {
    if (matchRoute(route, pattern)) {
      return null; // Free
    }
  }
  
  // Check tier
  for (const pattern of routePricing.enterprise) {
    if (matchRoute(route, pattern)) {
      return config.pricing.enterprise.pricePerRequest;
    }
  }
  
  for (const pattern of routePricing.premium) {
    if (matchRoute(route, pattern)) {
      return config.pricing.premium.pricePerRequest;
    }
  }
  
  // Default to basic
  return config.pricing.basic.pricePerRequest;
}

function matchRoute(route, pattern) {
  const regexPattern = pattern
    .replace(/\*/g, '.*')
    .replace(/\//g, '\\/');
  return new RegExp(`^${regexPattern}$`).test(route);
}

// ═══════════════════════════════════════════════════════════════
// Main Gateway Application
// ═══════════════════════════════════════════════════════════════

const app = express();

// Security middleware
app.use(helmet({
  contentSecurityPolicy: false, // Disable for API
}));
app.use(cors({
  origin: process.env.CORS_ORIGINS?.split(',') || '*',
  credentials: true,
}));
app.use(compression());
app.use(express.json({ limit: '10mb' }));

// Request logging
app.use((req, res, next) => {
  req.startTime = Date.now();
  res.on('finish', () => {
    const duration = Date.now() - req.startTime;
    console.log(`${req.method} ${req.path} ${res.statusCode} ${duration}ms`);
  });
  next();
});

// ═══════════════════════════════════════════════════════════════
// x402 Payment Middleware
// ═══════════════════════════════════════════════════════════════

app.use(async (req, res, next) => {
  const route = `${req.method} ${req.path}`;
  const price = getPriceForRoute(route);
  
  // Free endpoint
  if (price === null) {
    return next();
  }
  
  // Check for payment header
  const paymentHeader = req.headers['x-payment'];
  
  // Check for API key (subscription)
  const apiKey = req.headers['x-api-key'];
  if (apiKey) {
    const keyData = await redis.get(`apikey:${apiKey}`);
    if (keyData) {
      const { wallet, tier } = JSON.parse(keyData);
      req.x402 = { payer: wallet, tier, subscription: true };
      
      // Check rate limit for subscription
      const rateLimit = await checkRateLimit(wallet, route);
      if (!rateLimit.allowed) {
        return res.status(429).json({
          error: 'rate_limit_exceeded',
          message: `Rate limit: ${rateLimit.limit} requests per hour`,
          remaining: rateLimit.remaining,
          resetAt: new Date(rateLimit.resetAt).toISOString(),
        });
      }
      
      return next();
    }
  }
  
  // No payment header - return 402
  if (!paymentHeader) {
    return res.status(402).json({
      error: 'payment_required',
      message: 'This endpoint requires payment',
      accepts: {
        scheme: 'exact',
        network: config.x402.network,
        maxAmountRequired: price,
        resource: req.path,
        description: `API access: $${price} USD`,
        payTo: config.x402.wallet,
        maxTimeoutSeconds: 60,
        asset: getAssetUri(config.x402.network, config.x402.token),
      },
      subscriptions: {
        basic: {
          price: config.pricing.basic.monthlySubscription,
          description: '1,000 requests/hour',
          url: `${process.env.DASHBOARD_URL}/subscribe/basic`,
        },
        premium: {
          price: config.pricing.premium.monthlySubscription,
          description: '10,000 requests/hour + priority',
          url: `${process.env.DASHBOARD_URL}/subscribe/premium`,
        },
        enterprise: {
          price: config.pricing.enterprise.monthlySubscription,
          description: 'Unlimited + SLA',
          url: `${process.env.DASHBOARD_URL}/subscribe/enterprise`,
        },
      },
      x402Version: 1,
    });
  }
  
  // Verify payment
  const verification = await verifyPayment(paymentHeader, price, route);
  
  if (!verification.valid) {
    return res.status(402).json({
      error: 'payment_invalid',
      message: verification.error,
    });
  }
  
  // Check rate limit for payer
  const rateLimit = await checkRateLimit(verification.payer, route);
  if (!rateLimit.allowed) {
    return res.status(429).json({
      error: 'rate_limit_exceeded',
      remaining: rateLimit.remaining,
      resetAt: new Date(rateLimit.resetAt).toISOString(),
    });
  }
  
  // Record payment
  await recordPayment({
    ...verification,
    route,
  });
  
  // Attach payment info to request
  req.x402 = {
    payer: verification.payer,
    amount: verification.amount,
    txHash: verification.txHash,
  };
  
  // Add response header
  res.setHeader('x-payment-response', JSON.stringify({
    status: 'accepted',
    txHash: verification.txHash,
  }));
  
  next();
});

// ═══════════════════════════════════════════════════════════════
// API Routes - Proxy to MCP servers
// ═══════════════════════════════════════════════════════════════

// Health check (free)
app.get('/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

app.get('/api/health', (req, res) => {
  res.json({ 
    status: 'ok', 
    version: process.env.npm_package_version || '1.0.0',
    uptime: process.uptime(),
  });
});

// x402 discovery endpoint
app.get('/.well-known/x402', (req, res) => {
  res.json({
    version: 1,
    facilitator: config.x402.facilitator,
    network: config.x402.network,
    payTo: config.x402.wallet,
    token: config.x402.token,
    pricing: routePricing,
    subscriptions: config.pricing,
  });
});

// Proxy all API requests to MCP servers
app.use('/api', async (req, res) => {
  const startTime = Date.now();
  
  try {
    // Round-robin to MCP servers
    const servers = ['mcp-server-1:4000', 'mcp-server-2:4000'];
    const server = servers[Math.floor(Math.random() * servers.length)];
    
    const response = await fetch(`http://${server}${req.path}`, {
      method: req.method,
      headers: {
        'Content-Type': 'application/json',
        'X-Payer': req.x402?.payer || 'anonymous',
        'X-Request-ID': req.headers['x-request-id'] || crypto.randomUUID(),
      },
      body: ['POST', 'PUT', 'PATCH'].includes(req.method) 
        ? JSON.stringify(req.body) 
        : undefined,
    });
    
    const data = await response.json();
    
    // Record analytics
    const duration = Date.now() - startTime;
    await updateAnalytics(
      `${req.method} ${req.path}`,
      req.x402?.payer || 'anonymous',
      duration,
      response.status
    );
    
    res.status(response.status).json(data);
  } catch (error) {
    console.error('Proxy error:', error);
    res.status(502).json({
      error: 'upstream_error',
      message: 'Failed to reach upstream server',
    });
  }
});

// ═══════════════════════════════════════════════════════════════
// Metrics Server
// ═══════════════════════════════════════════════════════════════

const metricsApp = express();

metricsApp.get('/health', (req, res) => {
  res.json({ status: 'ok' });
});

metricsApp.get('/metrics', async (req, res) => {
  // Prometheus format metrics
  const metrics = [];
  
  // Get stats from Redis/Postgres
  const [totalPayments, totalRevenue, activeSubscriptions] = await Promise.all([
    postgres.query('SELECT COUNT(*) FROM payments'),
    postgres.query('SELECT SUM(amount::numeric) FROM payments'),
    postgres.query("SELECT COUNT(*) FROM subscriptions WHERE status = 'active'"),
  ]);
  
  metrics.push(`# HELP ucm_payments_total Total number of payments processed`);
  metrics.push(`# TYPE ucm_payments_total counter`);
  metrics.push(`ucm_payments_total ${totalPayments.rows[0].count}`);
  
  metrics.push(`# HELP ucm_revenue_total Total revenue in USD`);
  metrics.push(`# TYPE ucm_revenue_total counter`);
  metrics.push(`ucm_revenue_total ${totalRevenue.rows[0].sum || 0}`);
  
  metrics.push(`# HELP ucm_subscriptions_active Active subscriptions`);
  metrics.push(`# TYPE ucm_subscriptions_active gauge`);
  metrics.push(`ucm_subscriptions_active ${activeSubscriptions.rows[0].count}`);
  
  res.set('Content-Type', 'text/plain');
  res.send(metrics.join('\n'));
});

// ═══════════════════════════════════════════════════════════════
// Utilities
// ═══════════════════════════════════════════════════════════════

function getAssetUri(network, token) {
  const addresses = {
    'eip155:1': '0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48',
    'eip155:8453': '0x833589fCD6eDb6E08f4c7C32D4f71b54bdA02913',
    'eip155:84532': '0x036CbD53842c5426634e7929541eC2318f3dCF7e',
    'eip155:42161': '0xaf88d065e77c8cC2239327C5EDb3A432268e5831',
    'eip155:137': '0x3c499c542cEF5E3811e1192ce70d8cC03d5c3359',
  };
  return `${network}/erc20:${addresses[network]}`;
}

// ═══════════════════════════════════════════════════════════════
// Startup
// ═══════════════════════════════════════════════════════════════

async function start() {
  console.log('═══════════════════════════════════════════════════════════════');
  console.log('   Universal Crypto MCP - x402 Payment Gateway');
  console.log('   @author nirholas | @nichxbt');
  console.log('═══════════════════════════════════════════════════════════════');
  
  // Connect to Redis
  await redis.connect();
  console.log('✅ Connected to Redis');
  
  // Connect to Postgres
  await postgres.connect();
  console.log('✅ Connected to PostgreSQL');
  
  // Start servers
  app.listen(config.port, () => {
    console.log(`✅ Gateway server running on port ${config.port}`);
  });
  
  metricsApp.listen(config.metricsPort, () => {
    console.log(`✅ Metrics server running on port ${config.metricsPort}`);
  });
  
  console.log('');
  console.log(`💰 Payments go to: ${config.x402.wallet}`);
  console.log(`🔗 Network: ${config.x402.network}`);
  console.log(`📊 Dashboard: ${process.env.DASHBOARD_URL || 'http://localhost:3080'}`);
}

start().catch(console.error);

export { app, config };
