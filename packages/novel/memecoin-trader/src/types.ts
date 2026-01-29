import type { PublicKey, Transaction } from '@solana/web3.js';

export interface TokenInfo {
  mint: string;
  symbol: string;
  name: string;
  decimals: number;
  totalSupply: number;
  price: number;
  priceChange24h: number;
  volume24h: number;
  liquidity: number;
  marketCap: number;
  holders: number;
  createdAt: number;
}

export interface TradingSignal {
  action: 'BUY' | 'SELL' | 'HOLD';
  token: string;
  confidence: number; // 0-100
  reason: string;
  timestamp: number;
  indicators: {
    rsi?: number;
    macd?: number;
    volumeSpike?: boolean;
    liquidityScore?: number;
    socialScore?: number;
    rugRisk?: number;
  };
}

export interface TradeConfig {
  maxSlippage: number; // percentage
  buyAmount: number; // SOL
  takeProfit: number; // percentage
  stopLoss: number; // percentage
  maxPositionSize: number; // SOL
  minLiquidity: number; // USD
  maxRugRisk: number; // 0-100
  enableSniping: boolean;
  snipeAmount: number; // SOL
}

export interface Position {
  token: string;
  mint: PublicKey;
  entryPrice: number;
  currentPrice: number;
  amount: number;
  value: number;
  pnl: number;
  pnlPercent: number;
  entryTime: number;
}

export interface PumpFunToken {
  mint: string;
  name: string;
  symbol: string;
  description: string;
  image: string;
  twitter?: string;
  telegram?: string;
  website?: string;
  createdAt: number;
  creator: string;
  bondingCurve: string;
  associatedBondingCurve: string;
  complete: boolean;
  raydiumPool?: string;
}

export interface SocialMetrics {
  twitterFollowers?: number;
  twitterEngagement?: number;
  telegramMembers?: number;
  mentions24h: number;
  sentiment: number; // -1 to 1
  trending: boolean;
}

export interface RugAnalysis {
  riskScore: number; // 0-100
  liquidityLocked: boolean;
  lpBurnPercentage: number;
  topHoldersPercentage: number;
  creatorBalance: number;
  contractVerified: boolean;
  suspiciousActivity: string[];
}
