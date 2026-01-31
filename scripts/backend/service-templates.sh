#!/bin/bash
#===============================================================================
# Service Templates - Pre-configured backend service templates
#===============================================================================

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
source "$SCRIPT_DIR/backend-automation.sh"

#-------------------------------------------------------------------------------
# WebSocket Service Template
#-------------------------------------------------------------------------------

generate_websocket_service() {
    local name="${1:-websocket-service}"
    local port="${2:-3010}"
    local dir="${BACKEND_DIR}/${name}"
    
    log INFO "Generating WebSocket Service: $name on port $port"
    
    mkdir -p "$dir/src"/{handlers,middleware,utils}
    
    cat > "$dir/package.json" << EOF
{
  "name": "@universal-crypto-mcp/${name}",
  "version": "1.0.0",
  "type": "module",
  "scripts": {
    "dev": "tsx watch src/index.ts",
    "build": "tsup src/index.ts --format esm --dts",
    "start": "node dist/index.js"
  },
  "dependencies": {
    "ws": "^8.16.0",
    "uWebSockets.js": "uNetworking/uWebSockets.js#v20.40.0",
    "zod": "^3.23.8",
    "pino": "^8.17.0"
  },
  "devDependencies": {
    "@types/ws": "^8.5.10",
    "tsx": "^4.7.0",
    "tsup": "^8.0.1",
    "typescript": "^5.3.3"
  }
}
EOF

    cat > "$dir/src/index.ts" << 'EOF'
import { WebSocketServer, WebSocket } from 'ws';
import { createServer } from 'http';
import { z } from 'zod';
import pino from 'pino';

const logger = pino({
  level: 'info',
  transport: process.env.NODE_ENV !== 'production' ? {
    target: 'pino-pretty'
  } : undefined
});

// Message schemas
const subscribeSchema = z.object({
  type: z.literal('subscribe'),
  channel: z.string(),
  symbols: z.array(z.string()).optional(),
});

const unsubscribeSchema = z.object({
  type: z.literal('unsubscribe'),
  channel: z.string(),
});

const messageSchema = z.discriminatedUnion('type', [
  subscribeSchema,
  unsubscribeSchema,
]);

// Connection state
interface Client {
  ws: WebSocket;
  id: string;
  subscriptions: Set<string>;
  lastPing: number;
}

const clients = new Map<string, Client>();
const channels = new Map<string, Set<string>>();

// Create HTTP server for health checks
const server = createServer((req, res) => {
  if (req.url === '/health') {
    res.writeHead(200, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify({
      status: 'healthy',
      connections: clients.size,
      channels: channels.size,
      uptime: process.uptime(),
    }));
  } else {
    res.writeHead(404);
    res.end('Not Found');
  }
});

// Create WebSocket server
const wss = new WebSocketServer({ server });

function generateClientId(): string {
  return `client_${Date.now()}_${Math.random().toString(36).slice(2, 11)}`;
}

function broadcast(channel: string, message: unknown): void {
  const channelClients = channels.get(channel);
  if (!channelClients) return;

  const data = JSON.stringify({ channel, data: message, timestamp: Date.now() });
  
  for (const clientId of channelClients) {
    const client = clients.get(clientId);
    if (client && client.ws.readyState === WebSocket.OPEN) {
      client.ws.send(data);
    }
  }
}

function subscribe(clientId: string, channel: string): void {
  const client = clients.get(clientId);
  if (!client) return;

  client.subscriptions.add(channel);
  
  if (!channels.has(channel)) {
    channels.set(channel, new Set());
  }
  channels.get(channel)!.add(clientId);
  
  logger.info({ clientId, channel }, 'Client subscribed');
}

function unsubscribe(clientId: string, channel: string): void {
  const client = clients.get(clientId);
  if (!client) return;

  client.subscriptions.delete(channel);
  channels.get(channel)?.delete(clientId);
  
  logger.info({ clientId, channel }, 'Client unsubscribed');
}

wss.on('connection', (ws, req) => {
  const clientId = generateClientId();
  const client: Client = {
    ws,
    id: clientId,
    subscriptions: new Set(),
    lastPing: Date.now(),
  };
  
  clients.set(clientId, client);
  logger.info({ clientId, ip: req.socket.remoteAddress }, 'Client connected');

  // Send welcome message
  ws.send(JSON.stringify({
    type: 'connected',
    clientId,
    timestamp: Date.now(),
  }));

  ws.on('message', (data) => {
    try {
      const message = JSON.parse(data.toString());
      const parsed = messageSchema.safeParse(message);
      
      if (!parsed.success) {
        ws.send(JSON.stringify({ type: 'error', message: 'Invalid message format' }));
        return;
      }

      switch (parsed.data.type) {
        case 'subscribe':
          subscribe(clientId, parsed.data.channel);
          ws.send(JSON.stringify({ type: 'subscribed', channel: parsed.data.channel }));
          break;
        case 'unsubscribe':
          unsubscribe(clientId, parsed.data.channel);
          ws.send(JSON.stringify({ type: 'unsubscribed', channel: parsed.data.channel }));
          break;
      }
    } catch (error) {
      logger.error({ clientId, error }, 'Message processing error');
      ws.send(JSON.stringify({ type: 'error', message: 'Failed to process message' }));
    }
  });

  ws.on('close', () => {
    // Cleanup subscriptions
    for (const channel of client.subscriptions) {
      channels.get(channel)?.delete(clientId);
    }
    clients.delete(clientId);
    logger.info({ clientId }, 'Client disconnected');
  });

  ws.on('pong', () => {
    client.lastPing = Date.now();
  });
});

// Heartbeat to detect stale connections
setInterval(() => {
  const now = Date.now();
  for (const [clientId, client] of clients) {
    if (now - client.lastPing > 60000) {
      logger.warn({ clientId }, 'Terminating stale connection');
      client.ws.terminate();
      clients.delete(clientId);
    } else if (client.ws.readyState === WebSocket.OPEN) {
      client.ws.ping();
    }
  }
}, 30000);

// Simulated price updates
setInterval(() => {
  const symbols = ['BTC', 'ETH', 'SOL', 'MATIC', 'AVAX'];
  for (const symbol of symbols) {
    broadcast(`prices:${symbol}`, {
      symbol,
      price: Math.random() * 50000,
      change: (Math.random() - 0.5) * 10,
    });
  }
  
  // Also broadcast to general prices channel
  broadcast('prices', {
    prices: symbols.map(s => ({
      symbol: s,
      price: Math.random() * 50000,
    })),
  });
}, 1000);

const PORT = parseInt(process.env.PORT || '3010', 10);
server.listen(PORT, () => {
  logger.info(`🚀 WebSocket server running on port ${PORT}`);
  logger.info(`📡 WS endpoint: ws://localhost:${PORT}`);
  logger.info(`💊 Health check: http://localhost:${PORT}/health`);
});

export { broadcast, subscribe, unsubscribe, clients, channels };
EOF

    log INFO "✅ WebSocket Service generated at $dir"
}

#-------------------------------------------------------------------------------
# Queue Worker Service Template
#-------------------------------------------------------------------------------

generate_queue_worker() {
    local name="${1:-queue-worker}"
    local dir="${BACKEND_DIR}/${name}"
    
    log INFO "Generating Queue Worker Service: $name"
    
    mkdir -p "$dir/src"/{jobs,processors,utils}
    
    cat > "$dir/package.json" << EOF
{
  "name": "@universal-crypto-mcp/${name}",
  "version": "1.0.0",
  "type": "module",
  "scripts": {
    "dev": "tsx watch src/index.ts",
    "build": "tsup src/index.ts --format esm --dts",
    "start": "node dist/index.js",
    "worker": "node dist/worker.js"
  },
  "dependencies": {
    "bullmq": "^5.1.0",
    "ioredis": "^5.3.2",
    "zod": "^3.23.8",
    "pino": "^8.17.0"
  },
  "devDependencies": {
    "@types/node": "^20.10.0",
    "tsx": "^4.7.0",
    "tsup": "^8.0.1",
    "typescript": "^5.3.3"
  }
}
EOF

    cat > "$dir/src/index.ts" << 'EOF'
import { Queue, Worker, Job } from 'bullmq';
import IORedis from 'ioredis';
import pino from 'pino';

const logger = pino({
  level: process.env.LOG_LEVEL || 'info',
  transport: process.env.NODE_ENV !== 'production' ? {
    target: 'pino-pretty'
  } : undefined
});

// Redis connection
const connection = new IORedis(process.env.REDIS_URL || 'redis://localhost:6379', {
  maxRetriesPerRequest: null,
});

// Define queues
export const transactionQueue = new Queue('transactions', { connection });
export const notificationQueue = new Queue('notifications', { connection });
export const priceUpdateQueue = new Queue('price-updates', { connection });

// Job types
interface TransactionJob {
  type: 'send' | 'swap' | 'bridge';
  from: string;
  to: string;
  amount: string;
  network: string;
}

interface NotificationJob {
  userId: string;
  type: 'email' | 'push' | 'webhook';
  payload: Record<string, unknown>;
}

interface PriceUpdateJob {
  symbol: string;
  source: string;
}

// Transaction worker
const transactionWorker = new Worker<TransactionJob>(
  'transactions',
  async (job: Job<TransactionJob>) => {
    logger.info({ jobId: job.id, data: job.data }, 'Processing transaction');
    
    // Simulate transaction processing
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    // Add notification for completed transaction
    await notificationQueue.add('tx-complete', {
      userId: job.data.from,
      type: 'push',
      payload: {
        title: 'Transaction Complete',
        body: `Your ${job.data.type} transaction was successful`,
        txHash: `0x${Math.random().toString(16).slice(2)}`,
      },
    });
    
    return { success: true, processedAt: new Date().toISOString() };
  },
  {
    connection,
    concurrency: 5,
    limiter: {
      max: 10,
      duration: 1000,
    },
  }
);

// Notification worker
const notificationWorker = new Worker<NotificationJob>(
  'notifications',
  async (job: Job<NotificationJob>) => {
    logger.info({ jobId: job.id, type: job.data.type }, 'Sending notification');
    
    switch (job.data.type) {
      case 'email':
        // Send email
        break;
      case 'push':
        // Send push notification
        break;
      case 'webhook':
        // Call webhook
        break;
    }
    
    return { sent: true, sentAt: new Date().toISOString() };
  },
  {
    connection,
    concurrency: 10,
  }
);

// Price update worker
const priceUpdateWorker = new Worker<PriceUpdateJob>(
  'price-updates',
  async (job: Job<PriceUpdateJob>) => {
    logger.info({ symbol: job.data.symbol }, 'Updating price');
    
    // Fetch and update price
    const price = Math.random() * 50000;
    
    return { symbol: job.data.symbol, price, updatedAt: new Date().toISOString() };
  },
  {
    connection,
    concurrency: 20,
  }
);

// Event handlers
for (const worker of [transactionWorker, notificationWorker, priceUpdateWorker]) {
  worker.on('completed', (job) => {
    logger.info({ jobId: job.id, queue: job.queueName }, 'Job completed');
  });
  
  worker.on('failed', (job, err) => {
    logger.error({ jobId: job?.id, error: err.message }, 'Job failed');
  });
  
  worker.on('stalled', (jobId) => {
    logger.warn({ jobId }, 'Job stalled');
  });
}

// API to add jobs (can be called from other services)
export async function addTransactionJob(data: TransactionJob, options = {}) {
  return transactionQueue.add('transaction', data, {
    attempts: 3,
    backoff: { type: 'exponential', delay: 1000 },
    removeOnComplete: { age: 3600 },
    removeOnFail: { age: 86400 },
    ...options,
  });
}

export async function addNotificationJob(data: NotificationJob, options = {}) {
  return notificationQueue.add('notification', data, {
    attempts: 3,
    ...options,
  });
}

export async function schedulePriceUpdate(symbol: string, cron: string) {
  return priceUpdateQueue.add(
    'price-update',
    { symbol, source: 'api' },
    {
      repeat: { pattern: cron },
      jobId: `price-${symbol}`,
    }
  );
}

// Graceful shutdown
async function shutdown() {
  logger.info('Shutting down workers...');
  await transactionWorker.close();
  await notificationWorker.close();
  await priceUpdateWorker.close();
  await connection.quit();
  logger.info('Workers shut down gracefully');
  process.exit(0);
}

process.on('SIGTERM', shutdown);
process.on('SIGINT', shutdown);

logger.info('🚀 Queue workers started');
logger.info('📋 Queues: transactions, notifications, price-updates');

// Schedule recurring price updates
const symbols = ['BTC', 'ETH', 'SOL'];
for (const symbol of symbols) {
  schedulePriceUpdate(symbol, '*/5 * * * *'); // Every 5 minutes
}
EOF

    log INFO "✅ Queue Worker Service generated at $dir"
}

#-------------------------------------------------------------------------------
# Cron/Scheduler Service Template
#-------------------------------------------------------------------------------

generate_scheduler_service() {
    local name="${1:-scheduler}"
    local dir="${BACKEND_DIR}/${name}"
    
    log INFO "Generating Scheduler Service: $name"
    
    mkdir -p "$dir/src"/{jobs,utils}
    
    cat > "$dir/package.json" << EOF
{
  "name": "@universal-crypto-mcp/${name}",
  "version": "1.0.0",
  "type": "module",
  "scripts": {
    "dev": "tsx watch src/index.ts",
    "build": "tsup src/index.ts --format esm --dts",
    "start": "node dist/index.js"
  },
  "dependencies": {
    "node-cron": "^3.0.3",
    "croner": "^8.0.0",
    "pino": "^8.17.0",
    "zod": "^3.23.8"
  },
  "devDependencies": {
    "@types/node-cron": "^3.0.11",
    "tsx": "^4.7.0",
    "tsup": "^8.0.1",
    "typescript": "^5.3.3"
  }
}
EOF

    cat > "$dir/src/index.ts" << 'EOF'
import { Cron } from 'croner';
import pino from 'pino';

const logger = pino({
  level: 'info',
  transport: process.env.NODE_ENV !== 'production' ? {
    target: 'pino-pretty'
  } : undefined
});

interface ScheduledJob {
  name: string;
  cron: Cron;
  description: string;
  lastRun?: Date;
  nextRun?: Date;
  runCount: number;
}

const jobs = new Map<string, ScheduledJob>();

// Job registry
function registerJob(
  name: string,
  pattern: string,
  handler: () => Promise<void>,
  description: string = ''
): Cron {
  const cron = new Cron(pattern, { protect: true }, async () => {
    const job = jobs.get(name);
    if (job) {
      job.lastRun = new Date();
      job.runCount++;
    }
    
    logger.info({ job: name }, `Starting scheduled job`);
    const start = Date.now();
    
    try {
      await handler();
      logger.info({ job: name, duration: Date.now() - start }, 'Job completed');
    } catch (error) {
      logger.error({ job: name, error }, 'Job failed');
    }
  });
  
  jobs.set(name, {
    name,
    cron,
    description,
    nextRun: cron.nextRun(),
    runCount: 0,
  });
  
  logger.info({ job: name, pattern, nextRun: cron.nextRun() }, 'Job registered');
  return cron;
}

// Define scheduled jobs
registerJob(
  'price-sync',
  '*/1 * * * *', // Every minute
  async () => {
    const symbols = ['BTC', 'ETH', 'SOL', 'MATIC'];
    for (const symbol of symbols) {
      // Fetch and store price
      logger.debug({ symbol }, 'Syncing price');
    }
  },
  'Sync cryptocurrency prices from exchanges'
);

registerJob(
  'cleanup-old-sessions',
  '0 * * * *', // Every hour
  async () => {
    // Clean up expired sessions from database
    logger.info('Cleaning up old sessions');
  },
  'Remove expired user sessions'
);

registerJob(
  'daily-report',
  '0 9 * * *', // Every day at 9 AM
  async () => {
    // Generate and send daily report
    logger.info('Generating daily report');
  },
  'Generate and send daily analytics report'
);

registerJob(
  'backup-database',
  '0 2 * * *', // Every day at 2 AM
  async () => {
    // Trigger database backup
    logger.info('Initiating database backup');
  },
  'Create database backup'
);

registerJob(
  'health-check',
  '*/5 * * * *', // Every 5 minutes
  async () => {
    // Check health of dependent services
    const services = ['api', 'database', 'redis', 'queue'];
    for (const service of services) {
      logger.debug({ service }, 'Health check');
    }
  },
  'Check health of all dependent services'
);

// API to get job status
export function getJobStatus(): Record<string, unknown>[] {
  return Array.from(jobs.values()).map(job => ({
    name: job.name,
    description: job.description,
    pattern: job.cron.getPattern(),
    lastRun: job.lastRun?.toISOString(),
    nextRun: job.cron.nextRun()?.toISOString(),
    runCount: job.runCount,
    isRunning: job.cron.isBusy(),
  }));
}

// API to trigger job manually
export async function triggerJob(name: string): Promise<boolean> {
  const job = jobs.get(name);
  if (!job) return false;
  
  job.cron.trigger();
  return true;
}

// API to pause/resume jobs
export function pauseJob(name: string): boolean {
  const job = jobs.get(name);
  if (!job) return false;
  job.cron.pause();
  logger.info({ job: name }, 'Job paused');
  return true;
}

export function resumeJob(name: string): boolean {
  const job = jobs.get(name);
  if (!job) return false;
  job.cron.resume();
  logger.info({ job: name }, 'Job resumed');
  return true;
}

// HTTP server for health and management
import { createServer } from 'http';

const server = createServer((req, res) => {
  const url = new URL(req.url!, `http://${req.headers.host}`);
  
  if (req.method === 'GET' && url.pathname === '/health') {
    res.writeHead(200, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify({ status: 'healthy', jobs: jobs.size }));
  } else if (req.method === 'GET' && url.pathname === '/jobs') {
    res.writeHead(200, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify(getJobStatus()));
  } else if (req.method === 'POST' && url.pathname.startsWith('/jobs/')) {
    const jobName = url.pathname.split('/')[2];
    const action = url.pathname.split('/')[3];
    
    let success = false;
    if (action === 'trigger') success = Boolean(triggerJob(jobName));
    else if (action === 'pause') success = pauseJob(jobName);
    else if (action === 'resume') success = resumeJob(jobName);
    
    res.writeHead(success ? 200 : 404, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify({ success }));
  } else {
    res.writeHead(404);
    res.end('Not Found');
  }
});

const PORT = parseInt(process.env.PORT || '3020', 10);
server.listen(PORT, () => {
  logger.info(`🚀 Scheduler service running on port ${PORT}`);
  logger.info(`📋 Registered ${jobs.size} jobs`);
  logger.info(`🔗 Endpoints: /health, /jobs, /jobs/:name/trigger`);
});

// Graceful shutdown
process.on('SIGTERM', () => {
  logger.info('Shutting down scheduler...');
  for (const job of jobs.values()) {
    job.cron.stop();
  }
  server.close();
  process.exit(0);
});

export { registerJob, jobs };
EOF

    log INFO "✅ Scheduler Service generated at $dir"
}

#-------------------------------------------------------------------------------
# API Gateway Template
#-------------------------------------------------------------------------------

generate_api_gateway() {
    local name="${1:-api-gateway}"
    local port="${2:-3000}"
    local dir="${BACKEND_DIR}/${name}"
    
    log INFO "Generating API Gateway: $name on port $port"
    
    mkdir -p "$dir/src"/{routes,middleware,services,config}
    
    cat > "$dir/package.json" << EOF
{
  "name": "@universal-crypto-mcp/${name}",
  "version": "1.0.0",
  "type": "module",
  "scripts": {
    "dev": "tsx watch src/index.ts",
    "build": "tsup src/index.ts --format esm --dts",
    "start": "node dist/index.js"
  },
  "dependencies": {
    "express": "^4.18.2",
    "http-proxy-middleware": "^2.0.6",
    "express-rate-limit": "^7.1.5",
    "helmet": "^7.1.0",
    "cors": "^2.8.5",
    "jsonwebtoken": "^9.0.2",
    "pino": "^8.17.0",
    "pino-http": "^9.0.0",
    "zod": "^3.23.8",
    "ioredis": "^5.3.2"
  },
  "devDependencies": {
    "@types/express": "^4.17.21",
    "@types/cors": "^2.8.17",
    "@types/jsonwebtoken": "^9.0.5",
    "tsx": "^4.7.0",
    "tsup": "^8.0.1",
    "typescript": "^5.3.3"
  }
}
EOF

    cat > "$dir/src/index.ts" << 'EOF'
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
EOF

    log INFO "✅ API Gateway generated at $dir"
}

#-------------------------------------------------------------------------------
# Export all generators
#-------------------------------------------------------------------------------

export -f generate_websocket_service
export -f generate_queue_worker
export -f generate_scheduler_service
export -f generate_api_gateway

# If called directly
if [[ "${BASH_SOURCE[0]}" == "${0}" ]]; then
    case "${1:-help}" in
        websocket)
            generate_websocket_service "${@:2}"
            ;;
        queue)
            generate_queue_worker "${@:2}"
            ;;
        scheduler)
            generate_scheduler_service "${@:2}"
            ;;
        gateway)
            generate_api_gateway "${@:2}"
            ;;
        all)
            generate_api_gateway "api-gateway" 3000
            generate_websocket_service "websocket-service" 3010
            generate_queue_worker "queue-worker"
            generate_scheduler_service "scheduler"
            ;;
        *)
            echo "Usage: $0 <template> [name] [port]"
            echo
            echo "Templates:"
            echo "  websocket  - WebSocket server for real-time data"
            echo "  queue      - BullMQ job queue workers"
            echo "  scheduler  - Cron-based task scheduler"
            echo "  gateway    - API Gateway with routing & auth"
            echo "  all        - Generate all service templates"
            ;;
    esac
fi
