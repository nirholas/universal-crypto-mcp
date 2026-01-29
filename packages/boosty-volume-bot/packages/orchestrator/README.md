# @boosty/mcp-orchestrator

Volume generation and bot coordination package for DeFi MCP servers. This package provides a comprehensive system for managing trading bots, executing volume campaigns, and monitoring pool migrations on Solana.

## Features

### 🤖 Bot Coordinator
- Manage thousands of virtual trading bots
- Each bot tied to a unique wallet with independent operation
- Configurable behavior profiles for realistic trading patterns
- Anti-correlation measures to avoid detection

### 📋 Task Queue System (Redis-based)
- Job scheduling with priorities using BullMQ
- Retry logic with exponential backoff
- Dead letter queue for failed jobs
- Rate limiting per wallet/bot
- Concurrent execution limits

### 🎲 Randomization Engine
- Natural-looking trade timing (Poisson, Gaussian, Uniform distributions)
- Trade size randomization with configurable distributions
- Buy/sell ratio management
- Anti-pattern detection avoidance
- Wallet fingerprinting for behavior variance

### 📊 Volume Campaign Manager
- Define volume targets and timeframes
- Track progress toward goals
- Auto-adjust bot behavior to meet targets
- Pause/resume campaigns

### 🔄 Pool Migration Detector
- Monitor for pool migrations (PumpFun → Raydium)
- Auto-redirect bots to new pools
- Real-time migration event notifications

### 📈 Metrics & Monitoring
- Real-time volume tracking
- Bot performance metrics
- Error rate monitoring
- Cost analysis (fees spent)
- Prometheus metrics export

## Installation

```bash
pnpm add @boosty/mcp-orchestrator
```

## Quick Start

```typescript
import { Orchestrator } from '@boosty/mcp-orchestrator';

// Create orchestrator instance
const orchestrator = new Orchestrator({
  redis: {
    url: 'redis://localhost:6379',
    prefix: 'my-app',
    enablePersistence: true,
  },
  bots: {
    maxConcurrent: 1000,
  },
});

// Initialize
await orchestrator.initialize();

// Create a volume campaign
const campaign = await orchestrator.createCampaign({
  name: 'Token Launch Volume',
  targetToken: 'TokenMintAddress...',
  targetVolume24h: 1000000000000n, // 1000 SOL
  targetTransactionCount24h: 5000,
  duration: 24, // hours
  botCount: 100,
  walletFundingAmount: 100000000n, // 0.1 SOL per wallet
  mode: 'moderate',
});

// Start the campaign
await orchestrator.startCampaign(campaign.id);

// Monitor progress
const status = await orchestrator.getCampaignStatus(campaign.id);
console.log(`Progress: ${status.progress.volumeProgress}%`);

// Graceful shutdown
await orchestrator.shutdown();
```

## Bot Configuration

```typescript
interface BotConfig {
  walletId: string;
  targetToken: string;
  mode: 'volume' | 'market-make' | 'accumulate' | 'distribute';
  minTradeSize: bigint;
  maxTradeSize: bigint;
  minInterval: number; // ms
  maxInterval: number; // ms
  buyProbability: number; // 0-1
  maxDailyTrades: number;
  maxDailyVolume: bigint;
  enabled: boolean;
}
```

## Behavior Profiles

Built-in profiles for varied trading patterns:

- **default** - Balanced trading with moderate activity
- **aggressive** - High frequency, variable sizes
- **conservative** - Low frequency, steady sizes
- **whale** - Large but infrequent trades
- **retail** - Small frequent trades like typical retail
- **stealth** - Low visibility with high variance
- **market-maker** - Balanced buy/sell activity
- **accumulator** - Buying bias
- **distributor** - Selling bias
- **night-owl** - Active during off-hours

## Campaign Modes

- **aggressive** - Maximum volume generation, higher detection risk
- **moderate** - Balanced approach, sustainable over time
- **stealth** - Minimum detection footprint, lower volume

## API Reference

### Orchestrator

Main entry point for the orchestration system.

```typescript
// Bot Management
orchestrator.createBot(config: BotConfig): Promise<string>
orchestrator.createBotSwarm(count: number, baseConfig: BotConfig): Promise<string[]>
orchestrator.startBot(botId: string): Promise<void>
orchestrator.stopBot(botId: string): Promise<void>
orchestrator.getBotStatus(botId: string): Promise<BotStatus>

// Campaign Management
orchestrator.createCampaign(config: CampaignConfig): Promise<Campaign>
orchestrator.startCampaign(campaignId: string): Promise<void>
orchestrator.pauseCampaign(campaignId: string): Promise<void>
orchestrator.getCampaignStatus(campaignId: string): Promise<CampaignStatus>
orchestrator.getCampaignMetrics(campaignId: string): Promise<CampaignMetrics>

// Task Queue
orchestrator.enqueueTask(task: Task): Promise<string>
orchestrator.getQueueStats(): Promise<QueueStats>

// Metrics
orchestrator.getSystemMetrics(): Promise<SystemMetrics>
orchestrator.exportMetrics(format: 'json' | 'prometheus'): Promise<string>

// Pool Monitoring
orchestrator.startPoolMonitoring(): Promise<void>
orchestrator.addMonitoredToken(tokenMint: string): void
```

## Requirements

- Node.js 18+
- Redis 6+ (with persistence enabled for production)
- TypeScript 5+

## Dependencies

- **bullmq** - Redis-based queue
- **ioredis** - Redis client
- **node-cron** - Scheduling
- **prom-client** - Prometheus metrics
- **eventemitter3** - Event handling

## Critical Requirements for Production

1. **Redis Persistence**: Configure Redis with RDB + AOF for durability
2. **Scaling**: Supports 10,000+ concurrent bots
3. **Graceful Shutdown**: Complete in-flight tasks before stopping
4. **Idempotency**: Prevent duplicate task execution
5. **Anti-Detection**: Vary patterns, avoid wallet reuse detection

## License

MIT
