import { z } from 'zod';
import dotenv from 'dotenv';

dotenv.config();

const configSchema = z.object({
  // Environment
  nodeEnv: z.enum(['development', 'production', 'test']).default('production'),
  network: z.enum(['ethereum', 'bsc', 'solana']).default('bsc'),

  // RPC Configuration
  ethRpcUrl: z.string().url().optional(),
  solanaRpcUrl: z.string().url().optional(),
  privateKey: z.string().optional(),
  solanaPrivateKey: z.string().optional(),

  // Trading Parameters
  initialCapital: z.number().positive().default(1000),
  maxPositionSizePercent: z.number().min(1).max(50).default(10),
  stopLossPercent: z.number().min(1).max(50).default(5),
  takeProfitPercent: z.number().min(1).max(200).default(20),
  maxSlippagePercent: z.number().min(0.1).max(10).default(2),

  // Risk Management
  maxDailyLossPercent: z.number().min(1).max(50).default(15),
  maxConcurrentPositions: z.number().int().min(1).max(20).default(5),
  minLiquidityUsd: z.number().positive().default(50000),

  // Technical Analysis
  rsiPeriod: z.number().int().min(5).max(50).default(14),
  rsiOversold: z.number().min(10).max(40).default(30),
  rsiOverbought: z.number().min(60).max(90).default(70),
  emaShortPeriod: z.number().int().min(3).max(50).default(9),
  emaLongPeriod: z.number().int().min(10).max(100).default(21),
  volumeSpikeMultiplier: z.number().min(1.5).max(10).default(3),

  // DEX Settings
  uniswapRouter: z.string().optional(),
  pancakeswapRouter: z.string().optional(),

  // API Keys
  dexscreenerApiKey: z.string().optional(),
  birdeyeApiKey: z.string().optional(),

  // Monitoring
  scanIntervalMs: z.number().int().min(1000).max(60000).default(5000),
  logLevel: z.enum(['error', 'warn', 'info', 'debug']).default('info'),
  telegramBotToken: z.string().optional(),
  telegramChatId: z.string().optional(),
});

export type Config = z.infer<typeof configSchema>;

export const config: Config = configSchema.parse({
  nodeEnv: process.env.NODE_ENV,
  network: process.env.NETWORK,
  ethRpcUrl: process.env.ETH_RPC_URL,
  solanaRpcUrl: process.env.SOLANA_RPC_URL,
  privateKey: process.env.PRIVATE_KEY,
  solanaPrivateKey: process.env.SOLANA_PRIVATE_KEY,
  initialCapital: Number(process.env.INITIAL_CAPITAL),
  maxPositionSizePercent: Number(process.env.MAX_POSITION_SIZE_PERCENT),
  stopLossPercent: Number(process.env.STOP_LOSS_PERCENT),
  takeProfitPercent: Number(process.env.TAKE_PROFIT_PERCENT),
  maxSlippagePercent: Number(process.env.MAX_SLIPPAGE_PERCENT),
  maxDailyLossPercent: Number(process.env.MAX_DAILY_LOSS_PERCENT),
  maxConcurrentPositions: Number(process.env.MAX_CONCURRENT_POSITIONS),
  minLiquidityUsd: Number(process.env.MIN_LIQUIDITY_USD),
  rsiPeriod: Number(process.env.RSI_PERIOD),
  rsiOversold: Number(process.env.RSI_OVERSOLD),
  rsiOverbought: Number(process.env.RSI_OVERBOUGHT),
  emaShortPeriod: Number(process.env.EMA_SHORT_PERIOD),
  emaLongPeriod: Number(process.env.EMA_LONG_PERIOD),
  volumeSpikeMultiplier: Number(process.env.VOLUME_SPIKE_MULTIPLIER),
  uniswapRouter: process.env.UNISWAP_ROUTER,
  pancakeswapRouter: process.env.PANCAKESWAP_ROUTER,
  dexscreenerApiKey: process.env.DEXSCREENER_API_KEY,
  birdeyeApiKey: process.env.BIRDEYE_API_KEY,
  scanIntervalMs: Number(process.env.SCAN_INTERVAL_MS),
  logLevel: process.env.LOG_LEVEL as any,
  telegramBotToken: process.env.TELEGRAM_BOT_TOKEN,
  telegramChatId: process.env.TELEGRAM_CHAT_ID,
});
