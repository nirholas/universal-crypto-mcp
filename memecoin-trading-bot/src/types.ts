export interface TokenInfo {
  address: string;
  symbol: string;
  name: string;
  decimals: number;
  chain: string;
}

export interface PriceData {
  price: number;
  volume24h: number;
  liquidity: number;
  priceChange24h: number;
  timestamp: number;
}

export interface OHLCVData {
  timestamp: number;
  open: number;
  high: number;
  low: number;
  close: number;
  volume: number;
}

export interface TechnicalIndicators {
  rsi: number;
  emaShort: number;
  emaLong: number;
  macd: {
    macd: number;
    signal: number;
    histogram: number;
  };
  bollingerBands: {
    upper: number;
    middle: number;
    lower: number;
  };
  volumeAverage: number;
  volumeSpike: boolean;
}

export interface Position {
  id: string;
  token: TokenInfo;
  entryPrice: number;
  currentPrice: number;
  amount: number;
  value: number;
  pnl: number;
  pnlPercent: number;
  entryTime: number;
  stopLoss: number;
  takeProfit: number;
}

export interface Trade {
  id: string;
  type: 'BUY' | 'SELL';
  token: TokenInfo;
  price: number;
  amount: number;
  value: number;
  fee: number;
  txHash: string;
  timestamp: number;
  reason: string;
}

export interface TradingSignal {
  type: 'BUY' | 'SELL' | 'HOLD';
  token: TokenInfo;
  price: number;
  confidence: number;
  indicators: TechnicalIndicators;
  reasons: string[];
  timestamp: number;
}

export interface Portfolio {
  totalValue: number;
  availableBalance: number;
  positions: Position[];
  dailyPnl: number;
  totalPnl: number;
}

export interface RiskAssessment {
  allowed: boolean;
  reasons: string[];
  positionSize: number;
  confidence: number;
}
