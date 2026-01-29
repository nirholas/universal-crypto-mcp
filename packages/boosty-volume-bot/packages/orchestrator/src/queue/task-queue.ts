/**
 * Task Queue Implementation
 * Redis-based task queue using BullMQ
 */

import { Queue, Worker, Job, QueueEvents, type ConnectionOptions } from 'bullmq';
import { v4 as uuidv4 } from 'uuid';
import type {
  Task,
  TaskStatus,
  TaskResult,
  QueueStats,
  TaskQueueInterface,
  TaskQueueConfig,
  WorkerContext,
  WorkerResult,
} from '../types.js';

/**
 * Priority to BullMQ priority mapping (lower number = higher priority)
 */
const PRIORITY_MAP: Record<string, number> = {
  critical: 1,
  high: 2,
  normal: 3,
  low: 4,
};

/**
 * Default task queue configuration
 */
export const DEFAULT_QUEUE_CONFIG: TaskQueueConfig = {
  redisUrl: 'redis://localhost:6379',
  queuePrefix: 'orchestrator',
  defaultJobOptions: {
    attempts: 3,
    backoff: {
      type: 'exponential',
      delay: 1000,
    },
    removeOnComplete: 1000,
    removeOnFail: 5000,
  },
  concurrency: 50,
};

/**
 * Task processor function type
 */
export type TaskProcessor = (
  task: Task,
  context: WorkerContext
) => Promise<WorkerResult>;

/**
 * TaskQueue - Redis-based task queue implementation
 */
export class TaskQueue implements TaskQueueInterface {
  private queue: Queue;
  private queueEvents: QueueEvents;
  private workers: Map<string, Worker> = new Map();
  private processors: Map<string, TaskProcessor> = new Map();
  private config: TaskQueueConfig;
  private context: WorkerContext;
  private isPaused = false;
  private idempotencyStore: Map<string, string> = new Map(); // In production, use Redis
  private rateLimiters: Map<string, { count: number; resetAt: number }> = new Map();

  constructor(config: Partial<TaskQueueConfig>, context: WorkerContext) {
    this.config = { ...DEFAULT_QUEUE_CONFIG, ...config };
    this.context = context;

    const connection = this.parseRedisUrl(this.config.redisUrl);

    this.queue = new Queue('tasks', {
      connection,
      prefix: this.config.queuePrefix,
      defaultJobOptions: {
        attempts: this.config.defaultJobOptions.attempts,
        backoff: this.config.defaultJobOptions.backoff,
        removeOnComplete: this.config.defaultJobOptions.removeOnComplete,
        removeOnFail: this.config.defaultJobOptions.removeOnFail,
      },
    });

    this.queueEvents = new QueueEvents('tasks', {
      connection,
      prefix: this.config.queuePrefix,
    });
  }

  /**
   * Register a task processor
   */
  registerProcessor(taskType: string, processor: TaskProcessor): void {
    this.processors.set(taskType, processor);
  }

  /**
   * Start processing tasks
   */
  async startProcessing(): Promise<void> {
    const connection = this.parseRedisUrl(this.config.redisUrl);

    const worker = new Worker(
      'tasks',
      async (job: Job) => {
        return this.processJob(job);
      },
      {
        connection,
        prefix: this.config.queuePrefix,
        concurrency: this.config.concurrency,
        limiter: this.config.rateLimiter
          ? {
              max: this.config.rateLimiter.max,
              duration: this.config.rateLimiter.duration,
            }
          : undefined,
      }
    );

    // Set up event handlers
    worker.on('completed', (job, result) => {
      console.log(`Task ${job.id} completed:`, result);
    });

    worker.on('failed', (job, error) => {
      console.error(`Task ${job?.id} failed:`, error.message);
    });

    worker.on('error', (error) => {
      console.error('Worker error:', error);
    });

    this.workers.set('main', worker);
  }

  /**
   * Enqueue a single task
   */
  async enqueue(task: Task): Promise<string> {
    if (this.isPaused) {
      throw new Error('Queue is paused');
    }

    // Check idempotency
    if (task.idempotencyKey) {
      const existingId = this.idempotencyStore.get(task.idempotencyKey);
      if (existingId) {
        return existingId;
      }
    }

    // Check rate limiting for wallet
    if (task.walletId && !this.checkRateLimit(task.walletId)) {
      throw new Error(`Rate limit exceeded for wallet ${task.walletId}`);
    }

    const taskId = task.id ?? uuidv4();
    const priority = PRIORITY_MAP[task.priority] ?? 3;

    const job = await this.queue.add(
      task.type,
      {
        ...task,
        id: taskId,
      },
      {
        jobId: taskId,
        priority,
        delay: 0,
        attempts: task.maxRetries,
      }
    );

    // Store idempotency key
    if (task.idempotencyKey) {
      this.idempotencyStore.set(task.idempotencyKey, taskId);
      // Clean up after 1 hour
      setTimeout(() => {
        this.idempotencyStore.delete(task.idempotencyKey!);
      }, 3600000);
    }

    return job.id ?? taskId;
  }

  /**
   * Enqueue multiple tasks
   */
  async enqueueBatch(tasks: Task[]): Promise<string[]> {
    const ids: string[] = [];

    // Use bulk add for efficiency
    const jobsData = tasks.map((task) => {
      const taskId = task.id ?? uuidv4();
      ids.push(taskId);

      return {
        name: task.type,
        data: { ...task, id: taskId },
        opts: {
          jobId: taskId,
          priority: PRIORITY_MAP[task.priority] ?? 3,
          attempts: task.maxRetries,
          timeout: task.timeout,
        },
      };
    });

    await this.queue.addBulk(jobsData);

    return ids;
  }

  /**
   * Dequeue a task (for manual processing)
   */
  async dequeue(): Promise<Task | null> {
    // BullMQ handles dequeuing automatically via workers
    // This method is for manual/alternative processing
    const jobs = await this.queue.getJobs(['waiting'], 0, 0);
    if (jobs.length === 0) return null;

    const job = jobs[0];
    if (!job) return null;
    return job.data as Task;
  }

  /**
   * Schedule a task for future execution
   */
  async scheduleTask(task: Task, executeAt: Date): Promise<string> {
    const taskId = task.id ?? uuidv4();
    const delay = Math.max(0, executeAt.getTime() - Date.now());

    await this.queue.add(
      task.type,
      { ...task, id: taskId },
      {
        jobId: taskId,
        priority: PRIORITY_MAP[task.priority] ?? 3,
        delay,
        attempts: task.maxRetries,
      }
    );

    return taskId;
  }

  /**
   * Schedule a recurring task
   */
  async scheduleRecurring(task: Task, cronExpression: string): Promise<string> {
    const taskId = task.id ?? uuidv4();

    await this.queue.add(
      task.type,
      { ...task, id: taskId },
      {
        jobId: taskId,
        repeat: {
          pattern: cronExpression,
        },
        attempts: task.maxRetries,
      }
    );

    return taskId;
  }

  /**
   * Cancel a task
   */
  async cancelTask(taskId: string): Promise<boolean> {
    const job = await this.queue.getJob(taskId);
    if (!job) return false;

    const state = await job.getState();
    if (state === 'completed' || state === 'failed') {
      return false;
    }

    await job.remove();
    return true;
  }

  /**
   * Get task status
   */
  async getTaskStatus(taskId: string): Promise<TaskStatus> {
    const job = await this.queue.getJob(taskId);
    if (!job) {
      return 'pending'; // Or throw error
    }

    const state = await job.getState();

    const stateMap: Record<string, TaskStatus> = {
      waiting: 'pending',
      delayed: 'scheduled',
      active: 'active',
      completed: 'completed',
      failed: 'failed',
    };

    return stateMap[state] ?? 'pending';
  }

  /**
   * Get queue statistics
   */
  async getQueueStats(): Promise<QueueStats> {
    const [waiting, active, completed, failed, delayed] = await Promise.all([
      this.queue.getWaitingCount(),
      this.queue.getActiveCount(),
      this.queue.getCompletedCount(),
      this.queue.getFailedCount(),
      this.queue.getDelayedCount(),
    ]);

    // Calculate throughput (would need historical tracking in production)
    const throughput = {
      perMinute: 0,
      perHour: 0,
    };

    return {
      pending: waiting,
      active,
      completed,
      failed,
      delayed,
      paused: this.isPaused,
      throughput,
      avgProcessingTime: 0, // Would need to track this
      errorRate: failed > 0 ? failed / (completed + failed) : 0,
    };
  }

  /**
   * Pause the queue
   */
  async pause(): Promise<void> {
    this.isPaused = true;
    await this.queue.pause();
  }

  /**
   * Resume the queue
   */
  async resume(): Promise<void> {
    this.isPaused = false;
    await this.queue.resume();
  }

  /**
   * Close the queue and workers
   */
  async close(): Promise<void> {
    // Close all workers
    for (const worker of this.workers.values()) {
      await worker.close();
    }
    this.workers.clear();

    // Close queue events
    await this.queueEvents.close();

    // Close queue
    await this.queue.close();
  }

  /**
   * Get failed jobs (dead letter queue)
   */
  async getFailedJobs(count: number = 100): Promise<Task[]> {
    const jobs = await this.queue.getJobs(['failed'], 0, count - 1);
    return jobs.map((job) => job.data as Task);
  }

  /**
   * Retry a failed job
   */
  async retryJob(taskId: string): Promise<boolean> {
    const job = await this.queue.getJob(taskId);
    if (!job) return false;

    const state = await job.getState();
    if (state !== 'failed') return false;

    await job.retry();
    return true;
  }

  /**
   * Retry all failed jobs
   */
  async retryAllFailed(): Promise<number> {
    const jobs = await this.queue.getJobs(['failed']);
    let retried = 0;

    for (const job of jobs) {
      try {
        await job.retry();
        retried++;
      } catch {
        // Skip jobs that can't be retried
      }
    }

    return retried;
  }

  /**
   * Clean old jobs
   */
  async clean(grace: number, limit: number, type: 'completed' | 'failed' | 'delayed' | 'wait'): Promise<string[]> {
    const jobs = await this.queue.clean(grace, limit, type);
    return jobs.map((j) => j.toString());
  }

  /**
   * Process a job
   */
  private async processJob(job: Job): Promise<WorkerResult> {
    const task = job.data as Task;

    // Find processor for task type
    const processor = this.processors.get(task.type);
    if (!processor) {
      throw new Error(`No processor registered for task type: ${task.type}`);
    }

    try {
      const result = await processor(task, this.context);
      return result;
    } catch (error) {
      const err = error instanceof Error ? error : new Error(String(error));
      
      // Record error in metrics
      this.context.metricsCollector.recordError({
        id: uuidv4(),
        taskId: task.id,
        botId: task.botId,
        walletId: task.walletId,
        campaignId: task.campaignId,
        errorType: err.name,
        errorMessage: err.message,
        stack: err.stack,
        context: { task },
        timestamp: new Date(),
        resolved: false,
      });

      throw error;
    }
  }

  /**
   * Check rate limit for wallet
   */
  private checkRateLimit(walletId: string): boolean {
    if (!this.config.rateLimiter) return true;

    const now = Date.now();
    const limiter = this.rateLimiters.get(walletId);

    if (!limiter || limiter.resetAt < now) {
      this.rateLimiters.set(walletId, {
        count: 1,
        resetAt: now + this.config.rateLimiter.duration,
      });
      return true;
    }

    if (limiter.count >= this.config.rateLimiter.max) {
      return false;
    }

    limiter.count++;
    return true;
  }

  /**
   * Parse Redis URL to connection options
   */
  private parseRedisUrl(url: string): ConnectionOptions {
    try {
      const parsed = new URL(url);
      return {
        host: parsed.hostname,
        port: parseInt(parsed.port) || 6379,
        password: parsed.password || undefined,
        username: parsed.username || undefined,
        db: parsed.pathname ? parseInt(parsed.pathname.slice(1)) : 0,
      };
    } catch {
      return { host: 'localhost', port: 6379 };
    }
  }

  /**
   * Wait for a specific task to complete
   */
  async waitForTask(taskId: string, timeout: number = 60000): Promise<TaskResult> {
    return new Promise((resolve, reject) => {
      const timeoutId = setTimeout(() => {
        reject(new Error(`Task ${taskId} timed out after ${timeout}ms`));
      }, timeout);

      this.queueEvents.on('completed', ({ jobId, returnvalue }) => {
        if (jobId === taskId) {
          clearTimeout(timeoutId);
          resolve({
            taskId,
            status: 'success',
            result: returnvalue,
            executionTime: 0,
            retryCount: 0,
            completedAt: new Date(),
          });
        }
      });

      this.queueEvents.on('failed', ({ jobId, failedReason }) => {
        if (jobId === taskId) {
          clearTimeout(timeoutId);
          resolve({
            taskId,
            status: 'failure',
            error: failedReason,
            executionTime: 0,
            retryCount: 0,
            completedAt: new Date(),
          });
        }
      });
    });
  }
}
