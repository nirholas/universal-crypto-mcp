/**
 * Gateway Configuration
 * 
 * @author nirholas (Nich)
 * @license Apache-2.0
 */

import { z } from 'zod';
import dotenv from 'dotenv';

dotenv.config();

// ============================================================================
// Schema
// ============================================================================

const GatewayConfigSchema = z.object({
  // Server
  port: z.number().default(3000),
  env: z.enum(['development', 'staging', 'production']).default('production'),
  host: z.string().default('0.0.0.0'),

  // x402 Configuration
  x402: z.object({
    network: z.enum(['base', 'arbitrum', 'ethereum', 'polygon', 'base-sepolia']).default('base'),
    walletAddress: z.string().min(1, 'Wallet address is required'),
    privateKey: z.string().optional(),
    facilitatorUrl: z.string().url().default('https://x402.org/facilitator'),
    defaultToken: z.enum(['USDC', 'USDT', 'USDs', 'ETH']).default('USDC'),
    minPayment: z.string().default('0.0001'),
    maxPayment: z.string().default('100.00'),
  }),

  // Redis Configuration
  redis: z.object({
    enabled: z.boolean().default(false),
    host: z.string().default('localhost'),
    port: z.number().default(6379),
    password: z.string().optional(),
    db: z.number().default(0),
    tls: z.boolean().default(false),
    keyPrefix: z.string().default('ucmcp:'),
  }),

  // Database Configuration
  database: z.object({
    enabled: z.boolean().default(false),
    url: z.string().optional(),
    type: z.enum(['postgres', 'mysql', 'sqlite']).default('postgres'),
  }),

  // CORS Configuration
  cors: z.object({
    origins: z.array(z.string()).default(['*']),
    credentials: z.boolean().default(true),
  }),

  // Security
  security: z.object({
    trustProxy: z.boolean().default(true),
    rateLimitBypass: z.array(z.string()).default([]), // IPs that bypass rate limiting
    apiKeyRequired: z.boolean().default(false),
    jwtSecret: z.string().optional(),
  }),

  // Logging
  logging: z.object({
    level: z.enum(['error', 'warn', 'info', 'debug']).default('info'),
    format: z.enum(['json', 'pretty']).default('json'),
    includeRequest: z.boolean().default(true),
    includeResponse: z.boolean().default(false),
  }),

  // Metrics
  metrics: z.object({
    enabled: z.boolean().default(true),
    path: z.string().default('/metrics'),
    includeDefaultMetrics: z.boolean().default(true),
  }),

  // Health checks
  health: z.object({
    enabled: z.boolean().default(true),
    path: z.string().default('/health'),
    detailed: z.boolean().default(false),
  }),

  // RPC URLs for blockchain queries
  rpc: z.object({
    ethereum: z.string().default('https://eth.llamarpc.com'),
    base: z.string().default('https://mainnet.base.org'),
    arbitrum: z.string().default('https://arb1.arbitrum.io/rpc'),
    polygon: z.string().default('https://polygon-rpc.com'),
    solana: z.string().default('https://api.mainnet-beta.solana.com'),
    baseSepolia: z.string().default('https://sepolia.base.org'),
  }),

  // Upstream MCP servers
  upstream: z.object({
    mcpServerUrl: z.string().default('http://localhost:3001'),
    timeout: z.number().default(30000),
    retries: z.number().default(3),
  }),
});

export type GatewayConfig = z.infer<typeof GatewayConfigSchema>;

// ============================================================================
// Load Configuration
// ============================================================================

export function loadGatewayConfig(): GatewayConfig {
  const config = GatewayConfigSchema.parse({
    port: parseInt(process.env.PORT || '3000'),
    env: process.env.NODE_ENV || 'production',
    host: process.env.HOST || '0.0.0.0',

    x402: {
      network: process.env.X402_NETWORK || 'base',
      walletAddress: process.env.X402_WALLET_ADDRESS || process.env.X402_SERVER_WALLET,
      privateKey: process.env.X402_PRIVATE_KEY,
      facilitatorUrl: process.env.X402_FACILITATOR_URL || 'https://x402.org/facilitator',
      defaultToken: process.env.X402_DEFAULT_TOKEN || 'USDC',
      minPayment: process.env.X402_MIN_PAYMENT || '0.0001',
      maxPayment: process.env.X402_MAX_PAYMENT || '100.00',
    },

    redis: {
      enabled: process.env.REDIS_ENABLED === 'true',
      host: process.env.REDIS_HOST || 'localhost',
      port: parseInt(process.env.REDIS_PORT || '6379'),
      password: process.env.REDIS_PASSWORD,
      db: parseInt(process.env.REDIS_DB || '0'),
      tls: process.env.REDIS_TLS === 'true',
      keyPrefix: process.env.REDIS_KEY_PREFIX || 'ucmcp:',
    },

    database: {
      enabled: process.env.DATABASE_ENABLED === 'true',
      url: process.env.DATABASE_URL,
      type: (process.env.DATABASE_TYPE as 'postgres' | 'mysql' | 'sqlite') || 'postgres',
    },

    cors: {
      origins: process.env.CORS_ORIGINS?.split(',') || ['*'],
      credentials: process.env.CORS_CREDENTIALS !== 'false',
    },

    security: {
      trustProxy: process.env.TRUST_PROXY !== 'false',
      rateLimitBypass: process.env.RATE_LIMIT_BYPASS?.split(',') || [],
      apiKeyRequired: process.env.API_KEY_REQUIRED === 'true',
      jwtSecret: process.env.JWT_SECRET,
    },

    logging: {
      level: (process.env.LOG_LEVEL as 'error' | 'warn' | 'info' | 'debug') || 'info',
      format: (process.env.LOG_FORMAT as 'json' | 'pretty') || 'json',
      includeRequest: process.env.LOG_INCLUDE_REQUEST !== 'false',
      includeResponse: process.env.LOG_INCLUDE_RESPONSE === 'true',
    },

    metrics: {
      enabled: process.env.METRICS_ENABLED !== 'false',
      path: process.env.METRICS_PATH || '/metrics',
      includeDefaultMetrics: process.env.METRICS_DEFAULT !== 'false',
    },

    health: {
      enabled: process.env.HEALTH_ENABLED !== 'false',
      path: process.env.HEALTH_PATH || '/health',
      detailed: process.env.HEALTH_DETAILED === 'true',
    },

    rpc: {
      ethereum: process.env.ETHEREUM_RPC_URL || 'https://eth.llamarpc.com',
      base: process.env.BASE_RPC_URL || 'https://mainnet.base.org',
      arbitrum: process.env.ARBITRUM_RPC_URL || 'https://arb1.arbitrum.io/rpc',
      polygon: process.env.POLYGON_RPC_URL || 'https://polygon-rpc.com',
      solana: process.env.SOLANA_RPC_URL || 'https://api.mainnet-beta.solana.com',
      baseSepolia: process.env.BASE_SEPOLIA_RPC_URL || 'https://sepolia.base.org',
    },

    upstream: {
      mcpServerUrl: process.env.MCP_SERVER_URL || 'http://localhost:3001',
      timeout: parseInt(process.env.UPSTREAM_TIMEOUT || '30000'),
      retries: parseInt(process.env.UPSTREAM_RETRIES || '3'),
    },
  });

  return config;
}

// ============================================================================
// Pricing Tiers
// ============================================================================

export const PRICING_TIERS = {
  // Market Data
  'market-data': {
    'price-simple': { price: '0.0005', description: 'Simple price lookup' },
    'price-full': { price: '0.001', description: 'Full market data' },
    'ohlcv': { price: '0.002', description: 'OHLCV historical data' },
    'trending': { price: '0.001', description: 'Trending coins' },
  },
  
  // DeFi
  'defi': {
    'protocol-rates': { price: '0.005', description: 'Lending/borrowing rates' },
    'pool-analysis': { price: '0.01', description: 'Liquidity pool analysis' },
    'yield-optimizer': { price: '0.02', description: 'Yield optimization recommendations' },
    'health-factor': { price: '0.005', description: 'Position health factor' },
  },

  // Trading
  'trading': {
    'signals': { price: '0.01', description: 'Trading signals' },
    'execute-trade': { price: '0.10', description: 'Execute trade' },
    'backtest': { price: '0.05', description: 'Strategy backtest' },
    'paper-trade': { price: '0.02', description: 'Paper trade execution' },
  },

  // Wallets
  'wallets': {
    'balance': { price: '0.001', description: 'Wallet balance' },
    'analysis': { price: '0.02', description: 'Wallet analysis' },
    'portfolio': { price: '0.01', description: 'Portfolio summary' },
    'transaction-history': { price: '0.005', description: 'Transaction history' },
  },

  // Security
  'security': {
    'contract-audit': { price: '1.00', description: 'Smart contract audit' },
    'token-analysis': { price: '0.05', description: 'Token security analysis' },
    'rug-check': { price: '0.01', description: 'Rug pull risk check' },
  },

  // MEV
  'mev': {
    'opportunity-scan': { price: '0.05', description: 'MEV opportunity scan' },
    'arbitrage-analysis': { price: '0.10', description: 'Arbitrage analysis' },
    'sandwich-detect': { price: '0.02', description: 'Sandwich attack detection' },
  },

  // AI/LLM Features
  'ai': {
    'market-analysis': { price: '0.05', description: 'AI market analysis' },
    'sentiment': { price: '0.02', description: 'Sentiment analysis' },
    'prediction': { price: '0.10', description: 'Price prediction' },
    'chat': { price: '0.001', perToken: '0.00001', description: 'AI chat (per token)' },
  },
};

export default loadGatewayConfig;

