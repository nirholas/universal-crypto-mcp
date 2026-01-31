---
title: "Automation API Reference"
description: "API documentation for automation, scheduling, and workflow packages"
category: "api"
keywords: ["api", "automation", "scheduler", "workflows", "jobs", "cron"]
order: 10
---

# Automation API Reference

Automation packages provide scheduling, workflow management, and job execution capabilities.

## Packages

| Package | Description |
|---------|-------------|
| `@nirholas/automation-core` | Core automation engine |
| `@nirholas/automation-scheduler` | Job scheduling |
| `@nirholas/automation-workflows` | Workflow orchestration |
| `@nirholas/automation-triggers` | Event-based triggers |
| `@nirholas/automation-actions` | Pre-built actions |

---

## Automation Core

### Installation

```bash
pnpm add @nirholas/automation-core
```

### Configuration

```typescript
import { AutomationEngine } from '@nirholas/automation-core'

const engine = new AutomationEngine({
  database: process.env.DATABASE_URL!,
  redis: process.env.REDIS_URL,
  maxConcurrentJobs: 10,
  retryStrategy: {
    maxAttempts: 3,
    backoffMultiplier: 2,
    initialDelay: 1000,
  },
})
```

### Job Management

#### createJob

Create a new automation job.

```typescript
async function createJob(config: JobConfig): Promise<Job>

interface JobConfig {
  name: string
  type: JobType
  schedule?: string           // Cron expression
  trigger?: TriggerConfig
  actions: ActionConfig[]
  enabled?: boolean
  metadata?: Record<string, unknown>
}

interface Job {
  id: string
  name: string
  type: JobType
  status: JobStatus
  schedule?: string
  trigger?: TriggerConfig
  actions: ActionConfig[]
  lastRun?: Date
  nextRun?: Date
  runCount: number
  successCount: number
  failureCount: number
  createdAt: Date
  updatedAt: Date
}

type JobType = 'scheduled' | 'triggered' | 'manual' | 'webhook'
type JobStatus = 'active' | 'paused' | 'disabled' | 'error'
```

**Example:**

```typescript
const job = await engine.createJob({
  name: 'daily-portfolio-rebalance',
  type: 'scheduled',
  schedule: '0 9 * * *', // 9 AM daily
  actions: [
    {
      type: 'fetch-balances',
      params: { wallets: ['wallet-1', 'wallet-2'] },
    },
    {
      type: 'calculate-rebalance',
      params: { targetAllocation: { BTC: 40, ETH: 40, USDC: 20 } },
    },
    {
      type: 'execute-trades',
      params: { slippage: 0.5 },
    },
  ],
  enabled: true,
})
```

#### runJob

Manually execute a job.

```typescript
async function runJob(jobId: string): Promise<JobExecution>

interface JobExecution {
  id: string
  jobId: string
  status: 'pending' | 'running' | 'completed' | 'failed'
  startedAt: Date
  completedAt?: Date
  duration?: number
  results: ActionResult[]
  error?: {
    message: string
    stack?: string
    action?: string
  }
}
```

#### pauseJob / resumeJob

Control job execution.

```typescript
async function pauseJob(jobId: string): Promise<void>
async function resumeJob(jobId: string): Promise<void>
async function deleteJob(jobId: string): Promise<void>
```

#### getJobHistory

Get job execution history.

```typescript
async function getJobHistory(
  jobId: string,
  options?: HistoryOptions
): Promise<JobExecution[]>

interface HistoryOptions {
  limit?: number
  status?: ExecutionStatus
  startDate?: Date
  endDate?: Date
}
```

---

## Scheduler

### Installation

```bash
pnpm add @nirholas/automation-scheduler
```

### Scheduler Configuration

```typescript
import { Scheduler } from '@nirholas/automation-scheduler'

const scheduler = new Scheduler({
  timezone: 'America/New_York',
  maxJobs: 1000,
  persistence: {
    type: 'redis',
    url: process.env.REDIS_URL!,
  },
})
```

### Scheduling Jobs

#### schedule

Schedule a recurring job.

```typescript
function schedule(
  name: string,
  cron: string,
  handler: () => Promise<void>,
  options?: ScheduleOptions
): ScheduledJob

interface ScheduleOptions {
  timezone?: string
  runOnStart?: boolean
  exclusive?: boolean         // Only one instance at a time
  timeout?: number
  retries?: number
}
```

**Examples:**

```typescript
// Every minute
scheduler.schedule('check-prices', '* * * * *', async () => {
  const prices = await fetchPrices(['BTC', 'ETH'])
  await checkAlerts(prices)
})

// Every day at midnight
scheduler.schedule('daily-report', '0 0 * * *', async () => {
  const report = await generateDailyReport()
  await sendEmail(report)
})

// Every Monday at 9 AM
scheduler.schedule('weekly-rebalance', '0 9 * * 1', async () => {
  await rebalancePortfolio()
}, { timezone: 'America/New_York', exclusive: true })

// Every 5 minutes during market hours
scheduler.schedule('market-scan', '*/5 9-16 * * 1-5', async () => {
  await scanMarketOpportunities()
})
```

#### scheduleOnce

Schedule a one-time job.

```typescript
function scheduleOnce(
  name: string,
  date: Date,
  handler: () => Promise<void>
): ScheduledJob
```

#### scheduleIn

Schedule a job to run after a delay.

```typescript
function scheduleIn(
  name: string,
  delay: number | string,     // ms or '5m', '1h', '2d'
  handler: () => Promise<void>
): ScheduledJob
```

---

### Cron Expressions

```typescript
// Cron format: second minute hour day month weekday

// Common patterns
const patterns = {
  everyMinute: '* * * * *',
  every5Minutes: '*/5 * * * *',
  everyHour: '0 * * * *',
  daily: '0 0 * * *',
  weekly: '0 0 * * 0',
  monthly: '0 0 1 * *',
  weekdays: '0 9 * * 1-5',
  weekends: '0 10 * * 0,6',
}

// Helper function
import { parseCron, nextRun } from '@nirholas/automation-scheduler'

const next = nextRun('0 9 * * 1-5') // Next weekday at 9 AM
console.log(`Next run: ${next}`)
```

---

## Workflows

### Installation

```bash
pnpm add @nirholas/automation-workflows
```

### Workflow Builder

```typescript
import { WorkflowBuilder } from '@nirholas/automation-workflows'

const workflow = new WorkflowBuilder('trading-workflow')
  .trigger('price-alert', {
    type: 'price-threshold',
    asset: 'BTC',
    condition: 'below',
    threshold: 60000,
  })
  .step('fetch-balance', {
    action: 'get-balance',
    params: { wallet: 'main-wallet' },
  })
  .step('calculate-buy', {
    action: 'calculate-order',
    params: { 
      percentage: 10,
      balance: '{{steps.fetch-balance.result.usdc}}',
    },
  })
  .condition('has-funds', {
    check: '{{steps.calculate-buy.result.amount}} > 100',
    onFalse: 'notify-low-funds',
  })
  .step('execute-buy', {
    action: 'market-buy',
    params: {
      asset: 'BTC',
      amount: '{{steps.calculate-buy.result.amount}}',
    },
  })
  .step('notify', {
    action: 'send-notification',
    params: {
      channel: 'telegram',
      message: 'Bought {{steps.execute-buy.result.quantity}} BTC',
    },
  })
  .onError('handle-error', {
    action: 'send-notification',
    params: {
      channel: 'telegram',
      message: 'Workflow failed: {{error.message}}',
    },
  })
  .build()
```

### Workflow Execution

```typescript
interface Workflow {
  id: string
  name: string
  trigger: TriggerConfig
  steps: WorkflowStep[]
  conditions: WorkflowCondition[]
  errorHandler?: WorkflowStep
  status: 'active' | 'paused' | 'disabled'
}

interface WorkflowStep {
  id: string
  name: string
  action: string
  params: Record<string, unknown>
  timeout?: number
  retries?: number
  dependsOn?: string[]
}

interface WorkflowCondition {
  id: string
  name: string
  check: string              // Expression
  onTrue?: string            // Step to run if true
  onFalse?: string           // Step to run if false
}
```

#### runWorkflow

Execute a workflow.

```typescript
async function runWorkflow(
  workflowId: string,
  context?: Record<string, unknown>
): Promise<WorkflowExecution>

interface WorkflowExecution {
  id: string
  workflowId: string
  status: 'running' | 'completed' | 'failed' | 'cancelled'
  startedAt: Date
  completedAt?: Date
  steps: StepExecution[]
  context: Record<string, unknown>
  error?: Error
}
```

---

## Triggers

### Installation

```bash
pnpm add @nirholas/automation-triggers
```

### Trigger Types

```typescript
import { 
  PriceTrigger,
  BlockTrigger,
  EventTrigger,
  TimeTrigger,
  WebhookTrigger,
  BalanceTrigger,
} from '@nirholas/automation-triggers'

// Price trigger
const priceTrigger = new PriceTrigger({
  asset: 'ETH',
  condition: 'crosses_above',
  threshold: 4000,
  source: 'coingecko',
})

// Block trigger
const blockTrigger = new BlockTrigger({
  network: 'ethereum',
  interval: 10, // Every 10 blocks
})

// Event trigger (on-chain)
const eventTrigger = new EventTrigger({
  network: 'ethereum',
  address: '0x...',
  event: 'Transfer',
  filter: {
    to: '0xYourAddress',
  },
})

// Balance trigger
const balanceTrigger = new BalanceTrigger({
  wallet: '0x...',
  asset: 'ETH',
  condition: 'below',
  threshold: '1.0',
})

// Webhook trigger
const webhookTrigger = new WebhookTrigger({
  path: '/webhooks/trading',
  method: 'POST',
  auth: 'bearer',
})
```

### Trigger Configuration

```typescript
interface TriggerConfig {
  type: TriggerType
  conditions: TriggerCondition[]
  debounce?: number          // Minimum time between triggers
  maxTriggers?: number       // Max triggers per period
  period?: number            // Period for maxTriggers (seconds)
  enabled?: boolean
}

type TriggerType =
  | 'price'
  | 'block'
  | 'event'
  | 'time'
  | 'webhook'
  | 'balance'
  | 'gas'
  | 'custom'

interface TriggerCondition {
  field: string
  operator: 'eq' | 'ne' | 'gt' | 'gte' | 'lt' | 'lte' | 'contains' | 'matches'
  value: unknown
}
```

---

## Pre-built Actions

### Installation

```bash
pnpm add @nirholas/automation-actions
```

### Available Actions

```typescript
import {
  // Trading actions
  MarketBuyAction,
  MarketSellAction,
  LimitOrderAction,
  CancelOrderAction,
  
  // DeFi actions
  SwapAction,
  AddLiquidityAction,
  RemoveLiquidityAction,
  StakeAction,
  UnstakeAction,
  ClaimRewardsAction,
  
  // Wallet actions
  TransferAction,
  ApproveAction,
  
  // Notification actions
  TelegramAction,
  DiscordAction,
  SlackAction,
  EmailAction,
  
  // Data actions
  FetchPriceAction,
  FetchBalanceAction,
  FetchPortfolioAction,
  
  // Utility actions
  WaitAction,
  ConditionAction,
  LogAction,
} from '@nirholas/automation-actions'
```

### Action Interface

```typescript
interface ActionConfig {
  type: string
  params: Record<string, unknown>
  timeout?: number
  retries?: number
  onError?: 'fail' | 'continue' | 'retry'
}

interface ActionResult {
  success: boolean
  data?: unknown
  error?: Error
  duration: number
}

// Creating custom actions
import { Action, ActionContext } from '@nirholas/automation-actions'

const myAction: Action = {
  name: 'my-custom-action',
  description: 'Does something custom',
  
  schema: {
    type: 'object',
    properties: {
      input: { type: 'string' },
    },
    required: ['input'],
  },
  
  async execute(
    params: { input: string },
    context: ActionContext
  ): Promise<ActionResult> {
    // Action implementation
    const result = await doSomething(params.input)
    
    return {
      success: true,
      data: result,
      duration: Date.now() - context.startTime,
    }
  },
}

// Register action
engine.registerAction(myAction)
```

---

## Error Types

```typescript
class AutomationError extends Error {
  code: string
}

// Job errors
class JobNotFoundError extends AutomationError {}
class JobExecutionError extends AutomationError {}
class JobTimeoutError extends AutomationError {}
class MaxRetriesError extends AutomationError {}

// Scheduler errors
class InvalidCronError extends AutomationError {}
class ScheduleConflictError extends AutomationError {}

// Workflow errors
class WorkflowNotFoundError extends AutomationError {}
class StepExecutionError extends AutomationError {}
class ConditionError extends AutomationError {}
class CircularDependencyError extends AutomationError {}

// Trigger errors
class TriggerConfigError extends AutomationError {}
class TriggerTimeoutError extends AutomationError {}

// Action errors
class ActionNotFoundError extends AutomationError {}
class ActionValidationError extends AutomationError {}
class ActionExecutionError extends AutomationError {}
```

---

## Type Exports

```typescript
export type {
  Job,
  JobConfig,
  JobExecution,
  JobStatus,
  JobType,
  Workflow,
  WorkflowStep,
  WorkflowCondition,
  WorkflowExecution,
  TriggerConfig,
  TriggerType,
  ActionConfig,
  ActionResult,
  ScheduleOptions,
}
```
