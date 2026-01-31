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
