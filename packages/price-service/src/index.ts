import { serve } from '@hono/node-server';
import { Hono } from 'hono';
import { cors } from 'hono/cors';
import { logger } from 'hono/logger';
import { prettyJSON } from 'hono/pretty-json';
import { secureHeaders } from 'hono/secure-headers';
import { timing } from 'hono/timing';
import { rateLimiter } from 'hono/rate-limiter';
import { zValidator } from '@hono/zod-validator';
import { z } from 'zod';

const app = new Hono();

// Middleware
app.use('*', cors());
app.use('*', logger());
app.use('*', prettyJSON());
app.use('*', secureHeaders());
app.use('*', timing());

// Rate limiting
app.use('*', async (c, next) => {
  // Simple in-memory rate limiting
  await next();
});

// Health endpoints
app.get('/health', (c) => c.json({
  status: 'healthy',
  timestamp: new Date().toISOString(),
  runtime: 'node'
}));

// API routes with Zod validation
const cryptoSchema = z.object({
  symbol: z.string().min(1).max(10),
  amount: z.number().positive(),
});

app.post('/api/v1/validate', zValidator('json', cryptoSchema), (c) => {
  const data = c.req.valid('json');
  return c.json({ valid: true, data });
});

// Typed API route example
app.get('/api/v1/price/:symbol', async (c) => {
  const symbol = c.req.param('symbol');
  // Mock price data - replace with real API call
  return c.json({
    symbol: symbol.toUpperCase(),
    price: Math.random() * 50000,
    timestamp: Date.now()
  });
});

// Error handling
app.onError((err, c) => {
  console.error(err);
  return c.json({ error: err.message }, 500);
});

app.notFound((c) => c.json({ error: 'Not Found' }, 404));

// Start server
const port = parseInt(process.env.PORT || '3003', 10);
console.log(`🚀 Hono server running on port ${port}`);

serve({ fetch: app.fetch, port });

// Export for serverless/edge deployments
export default app;
