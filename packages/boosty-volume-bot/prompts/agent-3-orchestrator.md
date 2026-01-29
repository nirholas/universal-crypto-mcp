# Agent 3: Volume Orchestration System

You are Claude Opus 4.5 building the bot orchestration layer for a DeFi MCP server. Create `/packages/orchestrator/`.

## Context
- Depends on `@defi-mcp/trading-engine` and `@defi-mcp/wallet-manager`
- Redis for task queuing (BullMQ)
- Support 10,000+ concurrent bots

## Build These Components

### 1. Bot Coordinator (`src/bots/`)
```typescript
interface BotCoordinator {
  createBot(config: BotConfig): Promise<Bot>;
  createSwarm(count: number, config: BotConfig): Promise<Bot[]>;
  startBot(id: string): Promise<void>;
  stopBot(id: string): Promise<void>;
  startAll(): Promise<void>;
  stopAll(): Promise<void>;
  getBotStatus(id: string): Promise<BotStatus>;
}

interface BotConfig {
  walletId: string;
  targetToken: string;
  mode: 'volume' | 'market-make' | 'accumulate' | 'distribute';
  minTradeSize: bigint;
  maxTradeSize: bigint;
  minIntervalMs: number;
  maxIntervalMs: number;
  buyProbability: number; // 0-1
  maxDailyTrades: number;
}
```

### 2. Task Queue (`src/queue/`)
```typescript
interface TaskQueue {
  enqueue(task: Task): Promise<string>;
  enqueueBatch(tasks: Task[]): Promise<string[]>;
  schedule(task: Task, executeAt: Date): Promise<string>;
  scheduleRecurring(task: Task, cron: string): Promise<string>;
  pause(): Promise<void>;
  resume(): Promise<void>;
}
```
- BullMQ with Redis
- Priority levels: low, normal, high, critical
- Retry with exponential backoff
- Dead letter queue

### 3. Randomization Engine (`src/randomization/`)
```typescript
interface RandomEngine {
  getNextInterval(min: number, max: number, dist?: 'uniform' | 'poisson'): number;
  getTradeSize(min: bigint, max: bigint): bigint;
  shouldBuy(probability: number): boolean;
  addJitter(value: number, percent: number): number;
}
```
- Poisson distribution for timing
- Anti-pattern detection avoidance
- Natural-looking trade sizes

### 4. Campaign Manager (`src/campaigns/`)
```typescript
interface CampaignManager {
  create(config: CampaignConfig): Promise<Campaign>;
  start(id: string): Promise<void>;
  pause(id: string): Promise<void>;
  stop(id: string): Promise<void>;
  getMetrics(id: string): Promise<CampaignMetrics>;
}

interface CampaignConfig {
  name: string;
  targetToken: string;
  targetVolume24h: bigint; // in lamports
  botCount: number;
  durationHours: number;
  mode: 'aggressive' | 'moderate' | 'stealth';
}
```

### 5. Pool Monitor (`src/monitoring/`)
- Real-time pool state via WebSocket
- Migration detection (PumpFun → Raydium)
- Auto-redirect bots on migration

### 6. Metrics Collector (`src/metrics/`)
```typescript
interface MetricsCollector {
  recordTrade(trade: TradeRecord): void;
  getVolume(token: string, period: '1h' | '24h'): Promise<VolumeMetrics>;
  getBotMetrics(botId: string): Promise<BotMetrics>;
  exportPrometheus(): string;
}
```

## Dependencies
```json
{
  "bullmq": "^5.0.0",
  "ioredis": "^5.3.0",
  "node-cron": "^3.0.0",
  "prom-client": "^15.0.0"
}
```

## Key Requirements
1. Support 10,000 concurrent bots
2. Graceful shutdown (complete in-flight tasks)
3. Idempotent task execution
4. Anti-detection: vary patterns, randomize behavior
5. Redis persistence: RDB + AOF

## Anti-Detection Strategies
- Random intervals (Poisson distribution)
- Varied trade sizes
- No wallet reuse patterns
- Geographic distribution simulation
- Time-of-day variation

START BUILDING NOW - Complete code only.
