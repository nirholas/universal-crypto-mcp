/**
 * Orchestrator Types
 * Comprehensive type definitions for the volume orchestration system
 */

// ============================================================================
// Bot Types
// ============================================================================

export type BotMode = 'volume' | 'market-make' | 'accumulate' | 'distribute';

export type BotState = 'idle' | 'running' | 'paused' | 'stopped' | 'error';

export interface BotConfig {
  /** Unique wallet identifier linked to this bot */
  walletId: string;
  /** Target token mint address */
  targetToken: string;
  /** Trading mode */
  mode: BotMode;
  /** Minimum trade size in lamports/smallest unit */
  minTradeSize: bigint;
  /** Maximum trade size in lamports/smallest unit */
  maxTradeSize: bigint;
  /** Minimum interval between trades in milliseconds */
  minInterval: number;
  /** Maximum interval between trades in milliseconds */
  maxInterval: number;
  /** Probability of executing a buy vs sell (0-1) */
  buyProbability: number;
  /** Maximum number of trades per day */
  maxDailyTrades: number;
  /** Maximum daily volume in lamports/smallest unit */
  maxDailyVolume: bigint;
  /** Whether the bot is enabled */
  enabled: boolean;
  /** Optional behavior profile name */
  behaviorProfile?: string;
  /** Optional slippage tolerance (basis points) */
  slippageBps?: number;
  /** Priority fee in lamports */
  priorityFee?: bigint;
}

export interface BotStatus {
  botId: string;
  walletId: string;
  state: BotState;
  currentConfig: BotConfig;
  stats: BotStats;
  lastTradeAt?: Date;
  nextTradeAt?: Date;
  errorMessage?: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface BotStats {
  totalTrades: number;
  totalVolume: bigint;
  buyCount: number;
  sellCount: number;
  successRate: number;
  dailyTrades: number;
  dailyVolume: bigint;
  averageTradeSize: bigint;
  totalFeesSpent: bigint;
  lastResetAt: Date;
}

export interface Bot {
  id: string;
  config: BotConfig;
  status: BotStatus;
  start(): Promise<void>;
  stop(): Promise<void>;
  pause(): Promise<void>;
  resume(): Promise<void>;
  updateConfig(config: Partial<BotConfig>): void;
  getStatus(): BotStatus;
  getStats(): BotStats;
}

// ============================================================================
// Behavior Profile Types
// ============================================================================

export interface BehaviorProfile {
  name: string;
  description: string;
  /** Trade timing distribution */
  timingDistribution: 'uniform' | 'poisson' | 'gaussian';
  /** Trade size distribution */
  sizeDistribution: 'uniform' | 'skewed-low' | 'skewed-high';
  /** Activity hours (24-hour format) */
  activeHours: { start: number; end: number };
  /** Days of week active (0 = Sunday) */
  activeDays: number[];
  /** Burst probability (0-1) */
  burstProbability: number;
  /** Burst trade count range */
  burstTradeRange: { min: number; max: number };
  /** Cool-down period after burst (ms) */
  burstCooldown: number;
  /** Variance factor for randomization */
  varianceFactor: number;
}

// ============================================================================
// Task Queue Types
// ============================================================================

export type TaskType = 'swap' | 'transfer' | 'check-balance' | 'migrate-pool' | 'bot-action' | 'campaign-action';

export type TaskPriority = 'low' | 'normal' | 'high' | 'critical';

export type TaskStatus = 'pending' | 'scheduled' | 'active' | 'completed' | 'failed' | 'retrying' | 'dead';

export interface Task {
  /** Task ID (auto-generated if not provided) */
  id?: string;
  /** Type of task */
  type: TaskType;
  /** Task payload data */
  payload: Record<string, unknown>;
  /** Task priority level */
  priority: TaskPriority;
  /** Maximum retry attempts */
  maxRetries: number;
  /** Timeout in milliseconds */
  timeout: number;
  /** Associated wallet ID for rate limiting */
  walletId?: string;
  /** Associated bot ID */
  botId?: string;
  /** Associated campaign ID */
  campaignId?: string;
  /** Idempotency key to prevent duplicates */
  idempotencyKey?: string;
  /** Parent task ID for task chains */
  parentTaskId?: string;
  /** Metadata for tracking */
  metadata?: Record<string, unknown>;
}

export interface TaskResult {
  taskId: string;
  status: 'success' | 'failure';
  result?: unknown;
  error?: string;
  executionTime: number;
  retryCount: number;
  completedAt: Date;
}

export interface QueueStats {
  pending: number;
  active: number;
  completed: number;
  failed: number;
  delayed: number;
  paused: boolean;
  throughput: {
    perMinute: number;
    perHour: number;
  };
  avgProcessingTime: number;
  errorRate: number;
}

export interface TaskQueueConfig {
  /** Redis connection URL */
  redisUrl: string;
  /** Queue name prefix */
  queuePrefix: string;
  /** Default job options */
  defaultJobOptions: {
    attempts: number;
    backoff: {
      type: 'exponential' | 'fixed';
      delay: number;
    };
    removeOnComplete: number;
    removeOnFail: number;
  };
  /** Rate limiting config */
  rateLimiter?: {
    max: number;
    duration: number;
  };
  /** Concurrency limit */
  concurrency: number;
}

// ============================================================================
// Scheduler Types
// ============================================================================

export interface ScheduledTask {
  id: string;
  task: Task;
  cronExpression?: string;
  executeAt?: Date;
  isRecurring: boolean;
  lastExecutedAt?: Date;
  nextExecuteAt?: Date;
  enabled: boolean;
}

export interface SchedulerConfig {
  timezone: string;
  maxConcurrentScheduled: number;
}

// ============================================================================
// Campaign Types
// ============================================================================

export type CampaignMode = 'aggressive' | 'moderate' | 'stealth';

export type CampaignState = 'draft' | 'active' | 'paused' | 'completed' | 'cancelled';

export interface CampaignConfig {
  /** Campaign name */
  name: string;
  /** Target token mint address */
  targetToken: string;
  /** Target 24h volume */
  targetVolume24h: bigint;
  /** Target transaction count per 24h */
  targetTransactionCount24h: number;
  /** Campaign duration in hours */
  duration: number;
  /** Number of bots to use */
  botCount: number;
  /** Amount to fund each wallet */
  walletFundingAmount: bigint;
  /** Campaign aggressiveness mode */
  mode: CampaignMode;
  /** Optional start time (defaults to now) */
  startAt?: Date;
  /** Auto-stop when targets reached */
  autoStopOnTarget?: boolean;
  /** Budget limit in SOL */
  budgetLimit?: bigint;
}

export interface Campaign {
  id: string;
  config: CampaignConfig;
  state: CampaignState;
  botIds: string[];
  metrics: CampaignMetrics;
  createdAt: Date;
  startedAt?: Date;
  pausedAt?: Date;
  completedAt?: Date;
}

export interface CampaignStatus {
  campaignId: string;
  state: CampaignState;
  progress: {
    volumeProgress: number; // 0-100
    transactionProgress: number; // 0-100
    timeProgress: number; // 0-100
  };
  activeBots: number;
  totalBots: number;
  errorCount: number;
  estimatedCompletion?: Date;
}

export interface CampaignMetrics {
  totalVolume: bigint;
  totalTransactions: number;
  buyVolume: bigint;
  sellVolume: bigint;
  buyCount: number;
  sellCount: number;
  uniqueWallets: number;
  avgTransactionSize: bigint;
  totalFeesSpent: bigint;
  successRate: number;
  hourlyVolume: Map<number, bigint>;
  startedAt?: Date;
  lastUpdatedAt: Date;
}

// ============================================================================
// Randomization Types
// ============================================================================

export type TimingDistribution = 'uniform' | 'poisson' | 'gaussian';

export type SizeDistribution = 'uniform' | 'skewed-low' | 'skewed-high';

export interface RandomizationConfig {
  /** Base seed for reproducibility (optional) */
  seed?: number;
  /** Default timing distribution */
  defaultTimingDistribution: TimingDistribution;
  /** Default size distribution */
  defaultSizeDistribution: SizeDistribution;
  /** Jitter percentage for timing (0-100) */
  timingJitterPercent: number;
  /** Jitter percentage for size (0-100) */
  sizeJitterPercent: number;
}

// ============================================================================
// Pool Migration Types
// ============================================================================

export type PoolType = 'pumpfun' | 'raydium' | 'orca' | 'meteora' | 'unknown';

export interface PoolInfo {
  address: string;
  type: PoolType;
  tokenMint: string;
  baseMint: string;
  quoteMint: string;
  liquidity: bigint;
  volume24h: bigint;
  createdAt: Date;
  isActive: boolean;
}

export interface PoolMigrationEvent {
  tokenMint: string;
  fromPool: PoolInfo;
  toPool: PoolInfo;
  detectedAt: Date;
  migrationTx?: string;
}

export interface PoolMonitorConfig {
  /** Tokens to monitor */
  tokenMints: string[];
  /** Polling interval in ms */
  pollingInterval: number;
  /** Minimum liquidity to consider a pool active */
  minLiquidity: bigint;
  /** Auto-redirect bots on migration */
  autoRedirect: boolean;
}

// ============================================================================
// Metrics Types
// ============================================================================

export interface TradeRecord {
  id: string;
  botId: string;
  walletId: string;
  campaignId?: string;
  tokenMint: string;
  type: 'buy' | 'sell';
  amount: bigint;
  price: number;
  fees: bigint;
  signature: string;
  timestamp: Date;
  success: boolean;
  errorMessage?: string;
}

export interface ErrorRecord {
  id: string;
  botId?: string;
  walletId?: string;
  campaignId?: string;
  taskId?: string;
  errorType: string;
  errorMessage: string;
  stack?: string;
  context?: Record<string, unknown>;
  timestamp: Date;
  resolved: boolean;
}

export interface VolumeMetrics {
  tokenMint: string;
  period: '1h' | '24h' | '7d';
  totalVolume: bigint;
  buyVolume: bigint;
  sellVolume: bigint;
  transactionCount: number;
  uniqueWallets: number;
  avgTransactionSize: bigint;
  peakHour?: number;
  volumeByHour: Map<number, bigint>;
}

export interface BotMetrics {
  botId: string;
  uptime: number;
  totalTrades: number;
  successfulTrades: number;
  failedTrades: number;
  totalVolume: bigint;
  totalFeesSpent: bigint;
  avgTradeSize: bigint;
  avgTradeInterval: number;
  lastTradeAt?: Date;
  errorCount: number;
  lastError?: string;
}

export interface SystemMetrics {
  activeBots: number;
  totalBots: number;
  activeCampaigns: number;
  queueSize: number;
  queueProcessingRate: number;
  totalVolume24h: bigint;
  totalTransactions24h: number;
  totalFeesSpent24h: bigint;
  errorRate: number;
  uptime: number;
  memoryUsage: {
    heapUsed: number;
    heapTotal: number;
    external: number;
    rss: number;
  };
  redisConnected: boolean;
  lastUpdatedAt: Date;
}

// ============================================================================
// Event Types
// ============================================================================

export type OrchestratorEvent = 
  | 'bot:created'
  | 'bot:started'
  | 'bot:stopped'
  | 'bot:paused'
  | 'bot:error'
  | 'bot:trade'
  | 'campaign:created'
  | 'campaign:started'
  | 'campaign:paused'
  | 'campaign:completed'
  | 'campaign:target-reached'
  | 'task:enqueued'
  | 'task:completed'
  | 'task:failed'
  | 'pool:migration-detected'
  | 'system:error'
  | 'system:shutdown';

export interface OrchestratorEventData {
  event: OrchestratorEvent;
  timestamp: Date;
  data: Record<string, unknown>;
}

// ============================================================================
// Configuration Types
// ============================================================================

export interface OrchestratorConfig {
  /** Redis configuration */
  redis: {
    url: string;
    prefix: string;
    enablePersistence: boolean;
  };
  /** Bot coordinator settings */
  bots: {
    maxConcurrent: number;
    defaultConfig: Partial<BotConfig>;
  };
  /** Task queue settings */
  queue: TaskQueueConfig;
  /** Scheduler settings */
  scheduler: SchedulerConfig;
  /** Randomization settings */
  randomization: RandomizationConfig;
  /** Pool monitoring settings */
  poolMonitor: PoolMonitorConfig;
  /** Metrics settings */
  metrics: {
    enabled: boolean;
    exportInterval: number;
    retentionPeriod: number;
  };
  /** Graceful shutdown timeout */
  shutdownTimeout: number;
}

// ============================================================================
// Worker Types
// ============================================================================

export interface WorkerContext {
  redis: unknown; // Redis client
  tradingEngine?: unknown; // Trading engine instance
  walletManager?: unknown; // Wallet manager instance
  metricsCollector: MetricsCollectorInterface;
}

export interface WorkerResult {
  success: boolean;
  data?: unknown;
  error?: string;
}

// ============================================================================
// Interface Definitions (for implementation contracts)
// ============================================================================

export interface BotCoordinatorInterface {
  createBot(config: BotConfig): Promise<Bot>;
  createBotSwarm(count: number, baseConfig: BotConfig): Promise<Bot[]>;
  startBot(botId: string): Promise<void>;
  stopBot(botId: string): Promise<void>;
  startAllBots(): Promise<void>;
  stopAllBots(): Promise<void>;
  getBotStatus(botId: string): Promise<BotStatus>;
  getAllBotStatuses(): Promise<Map<string, BotStatus>>;
  updateBotConfig(botId: string, config: Partial<BotConfig>): void;
}

export interface TaskQueueInterface {
  enqueue(task: Task): Promise<string>;
  enqueueBatch(tasks: Task[]): Promise<string[]>;
  dequeue(): Promise<Task | null>;
  scheduleTask(task: Task, executeAt: Date): Promise<string>;
  scheduleRecurring(task: Task, cronExpression: string): Promise<string>;
  cancelTask(taskId: string): Promise<boolean>;
  getTaskStatus(taskId: string): Promise<TaskStatus>;
  getQueueStats(): Promise<QueueStats>;
  pause(): Promise<void>;
  resume(): Promise<void>;
  close(): Promise<void>;
}

export interface RandomizationEngineInterface {
  getNextInterval(minMs: number, maxMs: number, distribution?: TimingDistribution): number;
  getTradeSize(min: bigint, max: bigint, distribution?: SizeDistribution): bigint;
  shouldBuy(probability: number): boolean;
  shuffleWallets(wallets: string[]): string[];
  addJitter(value: number, jitterPercent: number): number;
}

export interface CampaignManagerInterface {
  createCampaign(config: CampaignConfig): Promise<Campaign>;
  startCampaign(campaignId: string): Promise<void>;
  pauseCampaign(campaignId: string): Promise<void>;
  stopCampaign(campaignId: string): Promise<void>;
  getCampaignStatus(campaignId: string): Promise<CampaignStatus>;
  getCampaignMetrics(campaignId: string): Promise<CampaignMetrics>;
  adjustCampaignParams(campaignId: string, params: Partial<CampaignConfig>): Promise<void>;
}

export interface MetricsCollectorInterface {
  recordTrade(trade: TradeRecord): void;
  recordError(error: ErrorRecord): void;
  getVolumeMetrics(tokenMint: string, period: '1h' | '24h' | '7d'): Promise<VolumeMetrics>;
  getBotMetrics(botId: string): Promise<BotMetrics>;
  getCampaignMetrics(campaignId: string): Promise<CampaignMetrics>;
  getSystemMetrics(): Promise<SystemMetrics>;
  exportMetrics(format: 'json' | 'prometheus'): Promise<string>;
}

export interface PoolMigrationDetectorInterface {
  startMonitoring(): Promise<void>;
  stopMonitoring(): Promise<void>;
  addToken(tokenMint: string): void;
  removeToken(tokenMint: string): void;
  getPoolInfo(tokenMint: string): Promise<PoolInfo | null>;
  onMigration(callback: (event: PoolMigrationEvent) => void): void;
}
