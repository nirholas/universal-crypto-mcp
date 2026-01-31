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
