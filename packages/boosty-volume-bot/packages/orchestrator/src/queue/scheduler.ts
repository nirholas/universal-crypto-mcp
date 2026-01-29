/**
 * Task Scheduler
 * Handles scheduled and recurring tasks using node-cron
 */

import cron from 'node-cron';
import { v4 as uuidv4 } from 'uuid';
import type { Task, ScheduledTask, SchedulerConfig } from '../types.js';
import { TaskQueue } from './task-queue.js';

/**
 * Default scheduler configuration
 */
export const DEFAULT_SCHEDULER_CONFIG: SchedulerConfig = {
  timezone: 'UTC',
  maxConcurrentScheduled: 100,
};

/**
 * Scheduler - Manages scheduled and recurring tasks
 */
export class Scheduler {
  private config: SchedulerConfig;
  private taskQueue: TaskQueue;
  private scheduledTasks: Map<string, ScheduledTask> = new Map();
  private cronJobs: Map<string, cron.ScheduledTask> = new Map();
  private timers: Map<string, NodeJS.Timeout> = new Map();
  private isRunning = false;

  constructor(taskQueue: TaskQueue, config: Partial<SchedulerConfig> = {}) {
    this.taskQueue = taskQueue;
    this.config = { ...DEFAULT_SCHEDULER_CONFIG, ...config };
  }

  /**
   * Start the scheduler
   */
  start(): void {
    if (this.isRunning) return;
    this.isRunning = true;

    // Resume any paused recurring tasks
    for (const [id, task] of this.scheduledTasks) {
      if (task.isRecurring && task.enabled && task.cronExpression) {
        this.startCronJob(id, task);
      }
    }
  }

  /**
   * Stop the scheduler
   */
  stop(): void {
    this.isRunning = false;

    // Stop all cron jobs
    for (const job of this.cronJobs.values()) {
      job.stop();
    }
    this.cronJobs.clear();

    // Clear all timers
    for (const timer of this.timers.values()) {
      clearTimeout(timer);
    }
    this.timers.clear();
  }

  /**
   * Schedule a one-time task
   */
  scheduleOnce(task: Task, executeAt: Date): string {
    const id = task.id ?? uuidv4();
    const now = Date.now();
    const delay = executeAt.getTime() - now;

    if (delay <= 0) {
      // Execute immediately
      this.executeTask(task);
      return id;
    }

    const scheduledTask: ScheduledTask = {
      id,
      task: { ...task, id },
      executeAt,
      isRecurring: false,
      nextExecuteAt: executeAt,
      enabled: true,
    };

    this.scheduledTasks.set(id, scheduledTask);

    // Set timer
    const timer = setTimeout(() => {
      this.executeTask(scheduledTask.task);
      this.timers.delete(id);
      this.scheduledTasks.delete(id);
    }, delay);

    this.timers.set(id, timer);

    return id;
  }

  /**
   * Schedule a recurring task
   */
  scheduleRecurring(task: Task, cronExpression: string): string {
    // Validate cron expression
    if (!cron.validate(cronExpression)) {
      throw new Error(`Invalid cron expression: ${cronExpression}`);
    }

    const id = task.id ?? uuidv4();

    const scheduledTask: ScheduledTask = {
      id,
      task: { ...task, id },
      cronExpression,
      isRecurring: true,
      enabled: true,
    };

    this.scheduledTasks.set(id, scheduledTask);

    if (this.isRunning) {
      this.startCronJob(id, scheduledTask);
    }

    return id;
  }

  /**
   * Cancel a scheduled task
   */
  cancel(taskId: string): boolean {
    const task = this.scheduledTasks.get(taskId);
    if (!task) return false;

    // Stop cron job if recurring
    const cronJob = this.cronJobs.get(taskId);
    if (cronJob) {
      cronJob.stop();
      this.cronJobs.delete(taskId);
    }

    // Clear timer if one-time
    const timer = this.timers.get(taskId);
    if (timer) {
      clearTimeout(timer);
      this.timers.delete(taskId);
    }

    this.scheduledTasks.delete(taskId);
    return true;
  }

  /**
   * Pause a recurring task
   */
  pause(taskId: string): boolean {
    const task = this.scheduledTasks.get(taskId);
    if (!task || !task.isRecurring) return false;

    const cronJob = this.cronJobs.get(taskId);
    if (cronJob) {
      cronJob.stop();
    }

    task.enabled = false;
    return true;
  }

  /**
   * Resume a paused recurring task
   */
  resume(taskId: string): boolean {
    const task = this.scheduledTasks.get(taskId);
    if (!task || !task.isRecurring || !task.cronExpression) return false;

    task.enabled = true;

    if (this.isRunning) {
      this.startCronJob(taskId, task);
    }

    return true;
  }

  /**
   * Get a scheduled task
   */
  getTask(taskId: string): ScheduledTask | undefined {
    return this.scheduledTasks.get(taskId);
  }

  /**
   * Get all scheduled tasks
   */
  getAllTasks(): ScheduledTask[] {
    return Array.from(this.scheduledTasks.values());
  }

  /**
   * Get scheduled tasks by type
   */
  getTasksByType(type: string): ScheduledTask[] {
    return Array.from(this.scheduledTasks.values()).filter(
      (task) => task.task.type === type
    );
  }

  /**
   * Update a scheduled task's configuration
   */
  updateTask(taskId: string, updates: Partial<Task>): boolean {
    const scheduledTask = this.scheduledTasks.get(taskId);
    if (!scheduledTask) return false;

    scheduledTask.task = {
      ...scheduledTask.task,
      ...updates,
    };

    return true;
  }

  /**
   * Update cron expression for recurring task
   */
  updateCronExpression(taskId: string, cronExpression: string): boolean {
    if (!cron.validate(cronExpression)) {
      throw new Error(`Invalid cron expression: ${cronExpression}`);
    }

    const task = this.scheduledTasks.get(taskId);
    if (!task || !task.isRecurring) return false;

    // Stop existing job
    const existingJob = this.cronJobs.get(taskId);
    if (existingJob) {
      existingJob.stop();
      this.cronJobs.delete(taskId);
    }

    // Update and restart
    task.cronExpression = cronExpression;
    
    if (this.isRunning && task.enabled) {
      this.startCronJob(taskId, task);
    }

    return true;
  }

  /**
   * Get count of scheduled tasks
   */
  getScheduledCount(): number {
    return this.scheduledTasks.size;
  }

  /**
   * Get count of active recurring tasks
   */
  getActiveRecurringCount(): number {
    return Array.from(this.scheduledTasks.values()).filter(
      (t) => t.isRecurring && t.enabled
    ).length;
  }

  /**
   * Clear all scheduled tasks
   */
  clearAll(): void {
    this.stop();
    this.scheduledTasks.clear();
  }

  /**
   * Execute a task by enqueueing it
   */
  private async executeTask(task: Task): Promise<void> {
    try {
      await this.taskQueue.enqueue(task);
    } catch (error) {
      console.error(`Failed to enqueue scheduled task ${task.id}:`, error);
    }
  }

  /**
   * Start a cron job for a recurring task
   */
  private startCronJob(id: string, task: ScheduledTask): void {
    if (!task.cronExpression) return;

    // Check concurrent limit
    if (this.cronJobs.size >= this.config.maxConcurrentScheduled) {
      console.warn(
        `Maximum concurrent scheduled tasks (${this.config.maxConcurrentScheduled}) reached`
      );
      return;
    }

    const job = cron.schedule(
      task.cronExpression,
      () => {
        task.lastExecutedAt = new Date();
        this.executeTask(task.task);
      },
      {
        timezone: this.config.timezone,
        scheduled: true,
      }
    );

    this.cronJobs.set(id, job);
  }

  /**
   * Create common schedule patterns
   */
  static createSchedule = {
    /** Every N minutes */
    everyMinutes: (n: number): string => `*/${n} * * * *`,

    /** Every N hours */
    everyHours: (n: number): string => `0 */${n} * * *`,

    /** Daily at specific hour (24h format) */
    dailyAt: (hour: number, minute: number = 0): string =>
      `${minute} ${hour} * * *`,

    /** Weekly on specific day and time */
    weeklyAt: (
      dayOfWeek: number,
      hour: number,
      minute: number = 0
    ): string => `${minute} ${hour} * * ${dayOfWeek}`,

    /** Monthly on specific day and time */
    monthlyAt: (
      dayOfMonth: number,
      hour: number,
      minute: number = 0
    ): string => `${minute} ${hour} ${dayOfMonth} * *`,

    /** Every N seconds (using * pattern) */
    everySeconds: (n: number): string => `*/${Math.ceil(n / 60)} * * * *`,

    /** Workdays only at specific time */
    workdaysAt: (hour: number, minute: number = 0): string =>
      `${minute} ${hour} * * 1-5`,

    /** Weekends only at specific time */
    weekendsAt: (hour: number, minute: number = 0): string =>
      `${minute} ${hour} * * 0,6`,
  };
}
