import Fastify from 'fastify';
import cors from '@fastify/cors';
import helmet from '@fastify/helmet';
import rateLimit from '@fastify/rate-limit';
import jwt from '@fastify/jwt';
import swagger from '@fastify/swagger';
import swaggerUi from '@fastify/swagger-ui';
import websocket from '@fastify/websocket';

const fastify = Fastify({
  logger: {
    level: process.env.LOG_LEVEL || 'info',
    transport: process.env.NODE_ENV !== 'production' ? {
      target: 'pino-pretty',
      options: { colorize: true }
    } : undefined
  }
});

// Register plugins
await fastify.register(cors, {
  origin: process.env.CORS_ORIGIN || '*',
  credentials: true
});

await fastify.register(helmet);

await fastify.register(rateLimit, {
  max: 100,
  timeWindow: '1 minute'
});

await fastify.register(jwt, {
  secret: process.env.JWT_SECRET || 'your-secret-key'
});

await fastify.register(websocket);

await fastify.register(swagger, {
  openapi: {
    info: {
      title: 'Universal Crypto MCP API',
      version: '1.0.0',
      description: 'Powerful crypto API backend'
    },
    servers: [{ url: 'http://localhost:3002' }]
  }
});

await fastify.register(swaggerUi, {
  routePrefix: '/docs'
});

// Health check
fastify.get('/health', async () => ({
  status: 'healthy',
  timestamp: new Date().toISOString(),
  uptime: process.uptime()
}));

// WebSocket endpoint
fastify.get('/ws', { websocket: true }, (socket, req) => {
  socket.on('message', (message) => {
    const data = JSON.parse(message.toString());
    socket.send(JSON.stringify({ echo: data, timestamp: Date.now() }));
  });
});

// API routes
fastify.get('/api/v1', async () => ({
  message: 'Welcome to Fastify API',
  version: '1.0.0',
  docs: '/docs'
}));

// Start server
const PORT = parseInt(process.env.PORT || '3002', 10);
try {
  await fastify.listen({ port: PORT, host: '0.0.0.0' });
  console.log(`🚀 Fastify server running on port ${PORT}`);
} catch (err) {
  fastify.log.error(err);
  process.exit(1);
}
