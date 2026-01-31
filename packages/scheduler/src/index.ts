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
