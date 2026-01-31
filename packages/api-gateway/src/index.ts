import express from 'express';
import { createProxyMiddleware, Options } from 'http-proxy-middleware';
import cors from 'cors';
import helmet from 'helmet';
import rateLimit from 'express-rate-limit';
import pinoHttp from 'pino-http';
import pino from 'pino';
import IORedis from 'ioredis';
import jwt from 'jsonwebtoken';

const logger = pino({
  level: 'info',
  transport: process.env.NODE_ENV !== 'production' ? {
    target: 'pino-pretty'
  } : undefined
});

const app = express();

// Redis for distributed rate limiting and caching
const redis = new IORedis(process.env.REDIS_URL || 'redis://localhost:6379');

// Service registry
interface ServiceConfig {
  target: string;
  pathRewrite?: Record<string, string>;
  auth?: boolean;
  rateLimit?: { max: number; window: string };
}

const services: Record<string, ServiceConfig> = {
  '/api/v1/users': {
    target: 'http://localhost:3001',
    auth: true,
  },
  '/api/v1/crypto': {
    target: 'http://localhost:3002',
    auth: false,
    rateLimit: { max: 100, window: '1m' },
  },
  '/api/v1/trading': {
    target: 'http://localhost:3003',
    auth: true,
    rateLimit: { max: 50, window: '1m' },
  },
  '/api/v1/defi': {
    target: 'http://localhost:3004',
    auth: true,
  },
  '/graphql': {
    target: 'http://localhost:3005',
    auth: false,
  },
  '/ws': {
    target: 'ws://localhost:3010',
    pathRewrite: { '^/ws': '' },
  },
};

// Middleware
app.use(helmet());
app.use(cors({
  origin: process.env.CORS_ORIGIN || '*',
  credentials: true,
}));
app.use(pinoHttp({ logger }));
app.use(express.json());

// Global rate limiting
const globalLimiter = rateLimit({
  windowMs: 60 * 1000,
  max: 1000,
  standardHeaders: true,
  legacyHeaders: false,
  message: { error: 'Too many requests' },
});
app.use(globalLimiter);

// Auth middleware
interface AuthRequest extends express.Request {
  user?: { id: string; email: string; role: string };
}

const authenticate = (req: AuthRequest, res: express.Response, next: express.NextFunction) => {
  const token = req.headers.authorization?.replace('Bearer ', '');
  
  if (!token) {
    return res.status(401).json({ error: 'Authentication required' });
  }
  
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'secret') as AuthRequest['user'];
    req.user = decoded;
    next();
  } catch {
    return res.status(401).json({ error: 'Invalid token' });
  }
};

// Health check
app.get('/health', async (req, res) => {
  const serviceHealth: Record<string, string> = {};
  
  for (const [path, config] of Object.entries(services)) {
    try {
      const response = await fetch(`${config.target}/health`, {
        signal: AbortSignal.timeout(5000),
      });
      serviceHealth[path] = response.ok ? 'healthy' : 'unhealthy';
    } catch {
      serviceHealth[path] = 'unreachable';
    }
  }
  
  res.json({
    status: 'healthy',
    uptime: process.uptime(),
    services: serviceHealth,
    timestamp: new Date().toISOString(),
  });
});

// Service discovery endpoint
app.get('/services', (req, res) => {
  res.json(Object.keys(services).map(path => ({
    path,
    target: services[path].target,
    auth: services[path].auth || false,
  })));
});

// Setup proxies for each service
for (const [path, config] of Object.entries(services)) {
  const middleware: express.RequestHandler[] = [];
  
  // Add auth if required
  if (config.auth) {
    middleware.push(authenticate as express.RequestHandler);
  }
  
  // Add rate limiting if specified
  if (config.rateLimit) {
    middleware.push(rateLimit({
      windowMs: parseInt(config.rateLimit.window) * 1000,
      max: config.rateLimit.max,
      message: { error: 'Rate limit exceeded' },
    }));
  }
  
  // Create proxy
  const proxyOptions: Options = {
    target: config.target,
    changeOrigin: true,
    pathRewrite: config.pathRewrite,
    ws: path.includes('ws'),
    on: {
      error: (err, req, res) => {
        logger.error({ path, error: err.message }, 'Proxy error');
        if ('writeHead' in res) {
          res.writeHead(502, { 'Content-Type': 'application/json' });
          res.end(JSON.stringify({ error: 'Service unavailable' }));
        }
      },
      proxyReq: (proxyReq, req) => {
        // Forward user info to backend services
        const authReq = req as AuthRequest;
        if (authReq.user) {
          proxyReq.setHeader('X-User-Id', authReq.user.id);
          proxyReq.setHeader('X-User-Email', authReq.user.email);
          proxyReq.setHeader('X-User-Role', authReq.user.role);
        }
        proxyReq.setHeader('X-Request-Id', `${Date.now()}-${Math.random().toString(36).slice(2)}`);
      },
    },
  };
  
  app.use(path, ...middleware, createProxyMiddleware(proxyOptions));
  logger.info({ path, target: config.target }, 'Proxy configured');
}

// 404 handler
app.use((req, res) => {
  res.status(404).json({ error: 'Route not found' });
});

// Error handler
app.use((err: Error, req: express.Request, res: express.Response, next: express.NextFunction) => {
  logger.error({ error: err.message, stack: err.stack }, 'Unhandled error');
  res.status(500).json({ error: 'Internal server error' });
});

const PORT = parseInt(process.env.PORT || '3000', 10);
app.listen(PORT, () => {
  logger.info(`🚀 API Gateway running on port ${PORT}`);
  logger.info(`📋 Configured ${Object.keys(services).length} service routes`);
});

export default app;
