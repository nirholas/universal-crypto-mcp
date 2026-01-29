# Agent 2: Volume Bot Orchestrator

You are Claude Opus 4.5, an expert in algorithmic trading systems and bot orchestration. Your task is to build the `packages/volume-bots` package for the Orbitt MCP system - the core volume generation engine.

## Your Mission

Create a sophisticated volume bot system that:
1. Generates organic-looking trading volume
2. Supports thousands of concurrent bots
3. Provides real-time control and monitoring
4. Implements Orbitt 2.0 features (merge, split, pause, speed control)

## Package: `packages/volume-bots`

### Core Bot Architecture

#### Bot Types
```typescript
type BotSize = 'micro' | 'small' | 'medium' | 'large' | 'whale';

interface BotSizeConfig {
  micro:  { minSol: 0.2, maxSol: 0.5 };
  small:  { minSol: 0.3, maxSol: 1.5 };
  medium: { minSol: 1.0, maxSol: 3.0 };
  large:  { minSol: 2.0, maxSol: 5.0 };
  whale:  { minSol: 5.0, maxSol: 15.0 };
}

interface Bot {
  id: string;
  walletId: string;
  walletAddress: string;
  targetToken: string;
  poolId: string;
  dex: 'raydium' | 'pumpfun' | 'meteora';
  
  // Configuration
  config: BotConfig;
  
  // State
  status: 'idle' | 'running' | 'paused' | 'stopped' | 'error';
  
  // Statistics
  stats: BotStats;
  
  // Timing
  createdAt: Date;
  startedAt?: Date;
  lastTradeAt?: Date;
  nextTradeAt?: Date;
}

interface BotConfig {
  // Swap settings
  minSwapSol: string;        // e.g., "0.3"
  maxSwapSol: string;        // e.g., "1.5"
  
  // Timing (Orbitt 2.0 speed control)
  minIntervalMs: number;     // Minimum time between swaps
  maxIntervalMs: number;     // Maximum time between swaps
  additionalDelayMs: number; // User-configurable delay (0 = fastest)
  
  // Behavior
  buyProbability: number;    // 0.5 = equal buy/sell
  useNewWalletPerBuy: boolean;
  
  // Limits
  maxDailyTrades: number;
  maxDailyVolume: string;
}

interface BotStats {
  totalTrades: number;
  buyCount: number;
  sellCount: number;
  totalVolumeSol: string;
  totalVolumeUsd: number;
  feesSpent: string;
  profitLoss: string;
  successRate: number;
  averageTradeSize: string;
  lastError?: string;
}
```

#### Volume Campaign System
```typescript
interface VolumeCampaign {
  id: string;
  name: string;
  targetToken: string;
  poolId: string;
  dex: string;
  
  // Configuration
  config: CampaignConfig;
  
  // State
  status: 'draft' | 'active' | 'paused' | 'completed' | 'failed';
  
  // Bots
  bots: Bot[];
  
  // Metrics
  metrics: CampaignMetrics;
  
  // Timing
  createdAt: Date;
  startedAt?: Date;
  endsAt?: Date;
}

interface CampaignConfig {
  // Targets
  targetVolume24h: string;     // Target volume in SOL
  targetTransactions24h: number;
  
  // Bot configuration
  botCount: number;
  botSize: BotSize;
  
  // Timing
  durationHours: number;
  
  // Mode (affects behavior patterns)
  mode: 'aggressive' | 'moderate' | 'stealth';
}

interface CampaignMetrics {
  totalVolume: string;
  totalVolumeUsd: number;
  transactionCount: number;
  uniqueWallets: number;
  buyVolume: string;
  sellVolume: string;
  netBuySell: string;
  averageTradeSize: string;
  tradesPerMinute: number;
  successRate: number;
  totalFees: string;
  elapsedHours: number;
  remainingHours: number;
  progressPercent: number;
  estimatedCompletion: Date;
  
  // Per-hour breakdown
  hourlyVolume: Array<{
    hour: number;
    volume: string;
    trades: number;
  }>;
}
```

### Orbitt 2.0 Bot Controls

#### Speed Control
```typescript
interface SpeedControlParams {
  botIds: string[];
  additionalDelayMs: number;  // 0 = fastest, 30000 = 30s delay
}

// Speed modes
const SPEED_MODES = {
  turbo: 0,           // No additional delay
  fast: 5000,         // 5 second delay
  normal: 15000,      // 15 second delay
  slow: 30000,        // 30 second delay
  stealth: 60000,     // 1 minute delay
};
```

#### Max Swap Size Control
```typescript
interface SwapSizeParams {
  botIds: string[];
  minSwapSol: string;
  maxSwapSol: string;
}
```

#### Bot Merge
```typescript
interface MergeBotParams {
  sourceBotIds: string[];  // Bots to merge (min 2)
}

interface MergeBotResult {
  newBotId: string;
  mergedCount: number;
  totalFunds: string;
  consolidationSignatures: string[];
}
```

#### Bot Split
```typescript
interface SplitBotParams {
  botId: string;
  splitCount: number;  // 2 = split into 2 bots (50/50)
}

interface SplitBotResult {
  newBotIds: string[];
  fundsPerBot: string;
  distributionSignatures: string[];
}
```

#### Pause/Resume
```typescript
interface PauseBotParams {
  botIds: string[];
}

interface ResumeBotParams {
  botIds: string[];
}
```

#### Stop & Withdraw
```typescript
interface StopBotParams {
  botIds: string[];
  withdrawTo: string;  // Wallet ID to receive funds
}

interface StopBotResult {
  stoppedCount: number;
  totalWithdrawn: string;
  withdrawSignature: string;
}
```

### Quick Order Packages (Orbitt Classic)

```typescript
const QUICK_PACKAGES = {
  'starter': {
    name: 'Starter Booster',
    cost: '4.5',  // SOL
    botCount: 3,
    botSize: 'small',
    duration: 24,
  },
  'growth': {
    name: 'Growth Accelerator', 
    cost: '9',
    botCount: 6,
    botSize: 'small',
    duration: 24,
  },
  'alpha': {
    name: 'Alpha Dominance',
    cost: '18',
    botCount: 12,
    botSize: 'medium',
    duration: 24,
  },
  'ecosystem': {
    name: 'Ecosystem Pioneer',
    cost: '30',
    botCount: 20,
    botSize: 'medium',
    duration: 24,
  },
  'whale': {
    name: 'Whale Package',
    cost: '60',
    botCount: 30,
    botSize: 'large',
    duration: 24,
  },
};

// Micro bots (0.2 - 2.5 SOL each)
const MICRO_PACKAGES = [0.2, 0.3, 0.4, 0.5, 1, 1.2, 1.5, 2, 2.5];
```

### Volume Estimation

```typescript
interface VolumeEstimate {
  packageCost: string;
  estimatedVolume24h: string;
  estimatedTransactions24h: number;
  tradesPerMinute: number;
  assumptions: {
    tokenPrice: 'stable';
    swapFee: '0.25%';  // Raydium
  };
  warning: string;
}

function estimateVolume(
  botCount: number,
  botSize: BotSize,
  durationHours: number
): VolumeEstimate;
```

### Bot Execution Engine

```typescript
class BotExecutionEngine {
  // Core execution loop
  async runBot(bot: Bot): Promise<void>;
  
  // Trade execution
  async executeTrade(bot: Bot): Promise<TradeResult>;
  
  // Wallet rotation (new wallet per buy)
  async rotateWallet(bot: Bot): Promise<string>;
  
  // Pool migration detection
  async detectPoolMigration(bot: Bot): Promise<string | null>;
  
  // Error recovery
  async handleError(bot: Bot, error: Error): Promise<void>;
}
```

### File Structure

```
packages/volume-bots/
├── package.json
├── tsconfig.json
├── src/
│   ├── index.ts
│   ├── types.ts
│   ├── bot/
│   │   ├── bot.ts              # Bot class
│   │   ├── config.ts           # Bot configuration
│   │   ├── executor.ts         # Trade execution
│   │   └── scheduler.ts        # Trade scheduling
│   ├── campaign/
│   │   ├── campaign.ts         # Campaign class
│   │   ├── manager.ts          # Campaign lifecycle
│   │   ├── metrics.ts          # Metrics calculation
│   │   └── packages.ts         # Quick packages
│   ├── controls/
│   │   ├── speed.ts            # Speed control
│   │   ├── merge.ts            # Bot merging
│   │   ├── split.ts            # Bot splitting
│   │   ├── pause.ts            # Pause/resume
│   │   └── withdraw.ts         # Stop & withdraw
│   ├── estimation/
│   │   └── volume-calculator.ts
│   ├── migration/
│   │   └── pool-detector.ts    # Auto-migrate to new pool
│   └── utils/
│       ├── random.ts           # Randomization utils
│       └── timing.ts           # Delay calculations
```

### MCP Tools to Expose

```typescript
// Campaign management
'create_volume_campaign'    // Create new campaign
'start_campaign'            // Start campaign
'pause_campaign'            // Pause all bots
'resume_campaign'           // Resume all bots
'stop_campaign'             // Stop & withdraw

// Bot management
'add_bots'                  // Add bots to campaign
'remove_bots'               // Remove specific bots
'configure_bots'            // Update bot config

// Orbitt 2.0 controls
'set_bot_speed'             // Adjust delay
'set_bot_swap_size'         // Adjust swap range
'merge_bots'                // Merge multiple bots
'split_bot'                 // Split bot into multiple

// Monitoring
'get_campaign_status'       // Campaign overview
'get_campaign_metrics'      // Detailed metrics
'get_bot_status'            // Individual bot status
'list_active_bots'          // All active bots

// Quick order
'quick_order'               // Pre-configured packages
'estimate_volume'           // Volume estimation
```

### Critical Implementation Details

1. **Organic Pattern Generation**
   - Randomize trade timing within intervals
   - Vary trade sizes randomly within range
   - Mix buy/sell patterns naturally
   - Use different wallets for buys

2. **Pool Migration**
   - Detect when PumpFun graduates to Raydium
   - Auto-migrate bots to new pool
   - Handle Meteora pool changes

3. **Error Resilience**
   - Auto-retry failed transactions
   - Handle RPC rate limits
   - Graceful degradation on errors
   - Alert on critical failures

4. **Resource Management**
   - Efficient wallet allocation
   - Memory-efficient bot state
   - Connection pooling for RPC

### Fee Structure

```typescript
const FEES = {
  volumeBoost: 0.002,  // 0.2% per swap
  premium: {
    monthly: 500,  // $500/month for premium features
    features: ['pause', 'merge', 'split', 'speed-control'],
  },
};
```

### Dependencies

```json
{
  "@solana/web3.js": "^1.87.0",
  "@boosty/wallet-manager": "workspace:*",
  "@boosty/trading-engine": "workspace:*",
  "@sperax/mcp-shared": "workspace:*",
  "bullmq": "^5.0.0",
  "ioredis": "^5.3.0"
}
```

## Quality Requirements

1. Support 10,000+ concurrent bots
2. Sub-second trade execution
3. 99.9% uptime for running bots
4. Real-time metrics updates
5. Graceful handling of all edge cases

Begin implementation immediately. Produce complete, working code.
