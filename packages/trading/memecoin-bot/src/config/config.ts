/**
 * Memecoin Trading Bot Configuration
 * Author: nich (@nirholas) - x.com/nichxbt
 */

import * as dotenv from 'dotenv'
import { PublicKey } from '@solana/web3.js'

dotenv.config()

export interface TradingConfig {
  // Network
  rpcUrl: string
  wsUrl: string
  
  // Wallet
  privateKey: string
  walletAddress: string
  
  // Trading Parameters
  maxPositionSize: number // in SOL
  minPositionSize: number // in SOL
  maxSlippage: number // percentage
  buyAmount: number // SOL per trade
  
  // Risk Management
  stopLoss: number // percentage
  takeProfit: number // percentage
  trailingStop: number // percentage
  maxDailyLoss: number // in SOL
  
  // Filters
  minLiquidity: number // in USD
  maxMarketCap: number // in USD
  minVolume24h: number // in USD
  minHolders: number
  maxTokenAge: number // in hours
  
  // Detection
  newPairCheckInterval: number // in ms
  priceUpdateInterval: number // in ms
  
  // DEX
  dexes: string[]
  priorityFee: number // in lamports
  
  // Database
  dbPath: string
  
  // API Keys
  birdeyeApiKey?: string
  dexscreenerApiKey?: string
  heliusApiKey?: string
}

export const config: TradingConfig = {
  // Network
  rpcUrl: process.env.SOLANA_RPC_URL || 'https://api.mainnet-beta.solana.com',
  wsUrl: process.env.SOLANA_WS_URL || 'wss://api.mainnet-beta.solana.com',
  
  // Wallet
  privateKey: process.env.WALLET_PRIVATE_KEY || '',
  walletAddress: process.env.WALLET_ADDRESS || '',
  
  // Trading Parameters
  maxPositionSize: parseFloat(process.env.MAX_POSITION_SIZE || '2'),
  minPositionSize: parseFloat(process.env.MIN_POSITION_SIZE || '0.1'),
  maxSlippage: parseFloat(process.env.MAX_SLIPPAGE || '5'),
  buyAmount: parseFloat(process.env.BUY_AMOUNT || '0.5'),
  
  // Risk Management
  stopLoss: parseFloat(process.env.STOP_LOSS || '20'),
  takeProfit: parseFloat(process.env.TAKE_PROFIT || '100'),
  trailingStop: parseFloat(process.env.TRAILING_STOP || '15'),
  maxDailyLoss: parseFloat(process.env.MAX_DAILY_LOSS || '5'),
  
  // Filters
  minLiquidity: parseFloat(process.env.MIN_LIQUIDITY || '10000'),
  maxMarketCap: parseFloat(process.env.MAX_MARKET_CAP || '1000000'),
  minVolume24h: parseFloat(process.env.MIN_VOLUME_24H || '5000'),
  minHolders: parseInt(process.env.MIN_HOLDERS || '50'),
  maxTokenAge: parseInt(process.env.MAX_TOKEN_AGE || '24'),
  
  // Detection
  newPairCheckInterval: parseInt(process.env.NEW_PAIR_CHECK_INTERVAL || '5000'),
  priceUpdateInterval: parseInt(process.env.PRICE_UPDATE_INTERVAL || '1000'),
  
  // DEX
  dexes: (process.env.DEXES || 'raydium,jupiter').split(','),
  priorityFee: parseInt(process.env.PRIORITY_FEE || '10000'),
  
  // Database
  dbPath: process.env.DB_PATH || './data/trading.db',
  
  // API Keys
  birdeyeApiKey: process.env.BIRDEYE_API_KEY,
  dexscreenerApiKey: process.env.DEXSCREENER_API_KEY,
  heliusApiKey: process.env.HELIUS_API_KEY,
}

// Raydium Program IDs
export const RAYDIUM_LIQUIDITY_POOL_V4 = new PublicKey('675kPX9MHTjS2zt1qfr1NYHuzeLXfQM9H24wFSUt1Mp8')
export const RAYDIUM_AMM_AUTHORITY = new PublicKey('5Q544fKrFoe6tsEbD7S8EmxGTJYAKtTVhAW5Q5pge4j1')

// Token addresses
export const WSOL = new PublicKey('So11111111111111111111111111111111111111112')
export const USDC = new PublicKey('EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v')

export function validateConfig(): void {
  if (!config.privateKey) {
    throw new Error('WALLET_PRIVATE_KEY is required in .env')
  }
  
  if (!config.rpcUrl) {
    throw new Error('SOLANA_RPC_URL is required in .env')
  }
  
  if (config.buyAmount < config.minPositionSize) {
    throw new Error('BUY_AMOUNT must be >= MIN_POSITION_SIZE')
  }
  
  if (config.buyAmount > config.maxPositionSize) {
    throw new Error('BUY_AMOUNT must be <= MAX_POSITION_SIZE')
  }
}
