/**
 * Analytics Dashboard Types
 * 
 * Core type definitions for portfolio analytics, market data, and DeFi tracking
 */

// ============================================================================
// Portfolio Types
// ============================================================================

export interface PortfolioAsset {
  id: string;
  symbol: string;
  name: string;
  chain: string;
  category: 'token' | 'nft' | 'defi' | 'stablecoin';
  balance: number;
  decimals: number;
  price: number;
  value: number;
  change24h: number;
  change7d: number;
  change30d: number;
  costBasis: number;
  unrealizedPnL: number;
  realizedPnL: number;
  logoUrl?: string;
}

export interface Portfolio {
  id: string;
  name: string;
  wallets: string[];
  assets: PortfolioAsset[];
  totalValue: number;
  totalCostBasis: number;
  totalPnL: number;
  change24h: number;
  change7d: number;
  change30d: number;
  lastUpdated: string;
}

export interface PortfolioSnapshot {
  timestamp: string;
  totalValue: number;
  assets: { symbol: string; value: number }[];
}

export interface HistoricalData {
  timestamps: string[];
  values: number[];
  benchmarks?: {
    btc: number[];
    eth: number[];
    sp500: number[];
  };
}

export type Timeframe = '1D' | '1W' | '1M' | '3M' | '1Y' | 'ALL';

// ============================================================================
// Asset Allocation Types
// ============================================================================

export interface AllocationSegment {
  name: string;
  value: number;
  percentage: number;
  color: string;
}

export interface AllocationData {
  byAsset: AllocationSegment[];
  byChain: AllocationSegment[];
  byCategory: AllocationSegment[];
  targetAllocation?: AllocationSegment[];
}

export interface RebalanceSuggestion {
  asset: string;
  currentPercentage: number;
  targetPercentage: number;
  action: 'buy' | 'sell';
  amount: number;
  amountUsd: number;
}

// ============================================================================
// PnL Types
// ============================================================================

export type CostBasisMethod = 'FIFO' | 'LIFO' | 'HIFO' | 'ACB';

export interface TaxLot {
  id: string;
  asset: string;
  acquiredDate: string;
  quantity: number;
  costBasis: number;
  currentValue: number;
  unrealizedGain: number;
  holdingPeriod: 'short' | 'long';
}

export interface PnLSummary {
  totalRealizedGains: number;
  totalUnrealizedGains: number;
  shortTermGains: number;
  longTermGains: number;
  totalCostBasis: number;
  currentValue: number;
  taxLots: TaxLot[];
}

export interface PnLByAsset {
  symbol: string;
  name: string;
  realizedPnL: number;
  unrealizedPnL: number;
  costBasis: number;
  currentValue: number;
  transactions: number;
}

// ============================================================================
// Market Data Types
// ============================================================================

export interface MarketOverview {
  totalMarketCap: number;
  totalVolume24h: number;
  btcDominance: number;
  ethDominance: number;
  marketCapChange24h: number;
  fearGreedIndex: number;
  fearGreedLabel: string;
}

export interface TokenData {
  id: string;
  symbol: string;
  name: string;
  price: number;
  marketCap: number;
  volume24h: number;
  change1h: number;
  change24h: number;
  change7d: number;
  change30d: number;
  ath: number;
  athDate: string;
  atl: number;
  atlDate: string;
  circulatingSupply: number;
  totalSupply: number;
  maxSupply: number | null;
  rank: number;
  logoUrl: string;
  sparkline?: number[];
}

export interface TokenDetails extends TokenData {
  description: string;
  website: string;
  whitepaper?: string;
  twitter?: string;
  discord?: string;
  telegram?: string;
  github?: string;
  exchanges: string[];
  categories: string[];
  contractAddresses: { chain: string; address: string }[];
  onChainMetrics?: {
    holders: number;
    transactions24h: number;
    activeAddresses24h: number;
  };
}

export interface TrendingToken {
  id: string;
  symbol: string;
  name: string;
  price: number;
  change24h: number;
  volume24h: number;
  volumeChange24h: number;
  rank: number;
  logoUrl: string;
}

// ============================================================================
// Watchlist Types
// ============================================================================

export interface Watchlist {
  id: string;
  name: string;
  tokens: string[];
  createdAt: string;
  updatedAt: string;
  isPublic: boolean;
}

export interface WatchlistColumn {
  id: string;
  label: string;
  accessor: keyof TokenData;
  sortable: boolean;
  visible: boolean;
}

export interface PriceAlert {
  id: string;
  tokenId: string;
  tokenSymbol: string;
  type: 'above' | 'below' | 'change_percent';
  threshold: number;
  enabled: boolean;
  triggered: boolean;
  triggeredAt?: string;
  createdAt: string;
}

// ============================================================================
// Market Screener Types
// ============================================================================

export interface ScreenerFilter {
  field: keyof TokenData;
  operator: 'gt' | 'lt' | 'eq' | 'between';
  value: number | [number, number];
}

export interface ScreenerPreset {
  id: string;
  name: string;
  filters: ScreenerFilter[];
  createdAt: string;
}

// ============================================================================
// DeFi Types
// ============================================================================

export interface DeFiPosition {
  id: string;
  protocol: string;
  protocolLogo: string;
  chain: string;
  type: 'lending' | 'borrowing' | 'liquidity' | 'staking' | 'farming';
  assets: { symbol: string; amount: number; value: number }[];
  totalValue: number;
  apy: number;
  rewards: { symbol: string; amount: number; value: number; claimable: boolean }[];
  healthFactor?: number;
  impermanentLoss?: number;
  entryDate: string;
}

export interface DeFiSummary {
  totalValueLocked: number;
  totalRewardsUnclaimed: number;
  averageApy: number;
  positionCount: number;
  protocols: string[];
  chains: string[];
  diversityScore: number;
}

export interface YieldOpportunity {
  protocol: string;
  chain: string;
  pool: string;
  assets: string[];
  apy: number;
  tvl: number;
  riskLevel: 'low' | 'medium' | 'high';
  audited: boolean;
}

export interface ProtocolData {
  id: string;
  name: string;
  logo: string;
  tvl: number;
  tvlChange24h: number;
  tvlChange7d: number;
  revenue24h: number;
  fees24h: number;
  users24h: number;
  chains: string[];
  category: string;
  auditStatus: 'audited' | 'unaudited' | 'pending';
  governanceToken?: string;
  tokenPrice?: number;
  tokenChange24h?: number;
}

export interface ILCalculation {
  initialInvestment: number;
  currentValue: number;
  holdValue: number;
  impermanentLoss: number;
  impermanentLossPercent: number;
  feesEarned: number;
  netReturn: number;
  breakEvenApy: number;
}

// ============================================================================
// Transaction Types
// ============================================================================

export interface Transaction {
  id: string;
  hash: string;
  chain: string;
  type: 'send' | 'receive' | 'swap' | 'approve' | 'stake' | 'unstake' | 'claim' | 'mint' | 'burn' | 'bridge' | 'unknown';
  status: 'confirmed' | 'pending' | 'failed';
  timestamp: string;
  from: string;
  to: string;
  assets: {
    symbol: string;
    amount: number;
    value: number;
    direction: 'in' | 'out';
  }[];
  fee: number;
  feeToken: string;
  protocol?: string;
}

export interface TransactionSummary {
  totalTransactions: number;
  totalVolume: number;
  totalFeesPaid: number;
  successRate: number;
  mostUsedProtocol: string;
  transactionsByType: { type: string; count: number }[];
  transactionsByChain: { chain: string; count: number }[];
}

// ============================================================================
// Tax Types
// ============================================================================

export interface TaxReport {
  year: number;
  jurisdiction: string;
  shortTermGains: number;
  longTermGains: number;
  totalGains: number;
  income: {
    staking: number;
    airdrops: number;
    mining: number;
    other: number;
  };
  transactions: TaxTransaction[];
  generatedAt: string;
}

export interface TaxTransaction {
  date: string;
  type: 'sale' | 'trade' | 'income';
  asset: string;
  amount: number;
  proceeds: number;
  costBasis: number;
  gain: number;
  holdingPeriod: 'short' | 'long';
}

export interface LossHarvestingOpportunity {
  asset: string;
  unrealizedLoss: number;
  currentPrice: number;
  costBasis: number;
  holdingPeriod: 'short' | 'long';
  suggestedAction: string;
}

// ============================================================================
// Alert Types
// ============================================================================

export type AlertType = 
  | 'price_above'
  | 'price_below'
  | 'price_change'
  | 'volume_spike'
  | 'portfolio_value'
  | 'allocation_drift'
  | 'health_factor'
  | 'liquidation_warning'
  | 'reward_claimable';

export interface Alert {
  id: string;
  type: AlertType;
  name: string;
  description: string;
  conditions: AlertCondition[];
  enabled: boolean;
  channels: NotificationChannel[];
  createdAt: string;
  lastTriggered?: string;
  triggerCount: number;
}

export interface AlertCondition {
  field: string;
  operator: 'gt' | 'lt' | 'eq' | 'change_pct';
  value: number;
  asset?: string;
}

export type NotificationChannel = 
  | { type: 'app'; enabled: boolean }
  | { type: 'email'; address: string; enabled: boolean }
  | { type: 'telegram'; chatId: string; enabled: boolean }
  | { type: 'discord'; webhookUrl: string; enabled: boolean }
  | { type: 'sms'; phone: string; enabled: boolean };

export interface Notification {
  id: string;
  alertId: string;
  alertName: string;
  type: AlertType;
  message: string;
  timestamp: string;
  read: boolean;
  data?: Record<string, unknown>;
}

export interface NotificationPreferences {
  quietHoursEnabled: boolean;
  quietHoursStart: string;
  quietHoursEnd: string;
  defaultChannels: NotificationChannel[];
  rateLimitPerHour: number;
}

// ============================================================================
// Chart Types
// ============================================================================

export interface ChartDataPoint {
  timestamp: number;
  value: number;
  volume?: number;
}

export interface ChartConfig {
  timeframe: Timeframe;
  showVolume: boolean;
  showBenchmarks: boolean;
  showDrawdown: boolean;
  benchmarks: ('btc' | 'eth' | 'sp500')[];
}

export interface DrawdownData {
  timestamp: number;
  drawdown: number;
  peak: number;
  current: number;
}
