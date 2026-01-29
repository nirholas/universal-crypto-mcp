/**
 * Type Definitions for Memecoin Trading Bot
 * Author: nich (@nirholas) - x.com/nichxbt
 */

import { PublicKey } from '@solana/web3.js'

export interface TokenInfo {
  address: string
  symbol: string
  name: string
  decimals: number
  supply: string
  mintAuthority: string | null
  freezeAuthority: string | null
  createdAt: Date
}

export interface LiquidityPool {
  address: string
  tokenA: string
  tokenB: string
  reserveA: string
  reserveB: string
  liquidity: number // in USD
  volume24h: number
  priceUsd: number
  priceChange24h: number
  dex: string
  createdAt: Date
}

export interface Trade {
  id: string
  tokenAddress: string
  type: 'buy' | 'sell'
  amountIn: string
  amountOut: string
  price: number
  timestamp: Date
  txSignature: string
  status: 'pending' | 'success' | 'failed'
  error?: string
}

export interface Position {
  id: string
  tokenAddress: string
  symbol: string
  entryPrice: number
  currentPrice: number
  amount: string
  costBasis: number // in SOL
  currentValue: number // in SOL
  pnl: number
  pnlPercent: number
  stopLoss: number
  takeProfit: number
  trailingStop: number
  highestPrice: number
  openedAt: Date
  updatedAt: Date
  status: 'open' | 'closed'
}

export interface TokenMetrics {
  address: string
  holders: number
  marketCap: number
  liquidity: number
  volume24h: number
  priceChange24h: number
  priceChange1h: number
  buys24h: number
  sells24h: number
  uniqueBuyers24h: number
  uniqueSellers24h: number
  rugPullScore: number // 0-100
  honeypotRisk: number // 0-100
  timestamp: Date
}

export interface TradingSignal {
  tokenAddress: string
  action: 'buy' | 'sell' | 'hold'
  confidence: number // 0-100
  reasons: string[]
  metrics: TokenMetrics
  timestamp: Date
}

export interface RaydiumPoolInfo {
  id: PublicKey
  baseMint: PublicKey
  quoteMint: PublicKey
  lpMint: PublicKey
  baseDecimals: number
  quoteDecimals: number
  lpDecimals: number
  version: number
  programId: PublicKey
  authority: PublicKey
  openOrders: PublicKey
  targetOrders: PublicKey
  baseVault: PublicKey
  quoteVault: PublicKey
  withdrawQueue: PublicKey
  lpVault: PublicKey
  marketVersion: number
  marketProgramId: PublicKey
  marketId: PublicKey
  marketAuthority: PublicKey
}

export interface SwapParams {
  tokenIn: string
  tokenOut: string
  amountIn: string
  slippage: number
  priorityFee?: number
}

export interface SwapResult {
  signature: string
  tokenIn: string
  tokenOut: string
  amountIn: string
  amountOut: string
  price: number
  success: boolean
  error?: string
}

export interface TokenSafetyCheck {
  isSafe: boolean
  issues: string[]
  warnings: string[]
  score: number
  checks: {
    mintAuthorityRenounced: boolean
    freezeAuthorityRenounced: boolean
    liquidityLocked: boolean
    ownershipRenounced: boolean
    topHolderCheck: boolean
    rugPullRisk: boolean
  }
}

export interface BotStats {
  totalTrades: number
  successfulTrades: number
  failedTrades: number
  totalVolume: number
  totalPnl: number
  winRate: number
  averageProfit: number
  averageLoss: number
  largestWin: number
  largestLoss: number
  activePositions: number
  dailyPnl: number
  startTime: Date
  runtime: number // in seconds
}
