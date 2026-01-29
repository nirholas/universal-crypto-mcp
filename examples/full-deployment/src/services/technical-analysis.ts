/**
 * Technical Analysis Service
 * 
 * Real implementations for technical indicators and trading signals.
 * Calculates RSI, MACD, Bollinger Bands, Moving Averages, and more.
 * 
 * @author Universal Crypto MCP
 * @license Apache-2.0
 */

import { getOHLCV } from "./market-data.js";

export interface Candle {
  timestamp: string;
  open: number;
  high: number;
  low: number;
  close: number;
}

export interface RSIResult {
  current: number;
  signal: "oversold" | "neutral" | "overbought";
  history: Array<{ timestamp: string; value: number }>;
}

export interface MACDResult {
  macd: number;
  signal: number;
  histogram: number;
  trend: "bullish" | "bearish" | "neutral";
  history: Array<{
    timestamp: string;
    macd: number;
    signal: number;
    histogram: number;
  }>;
}

export interface BollingerResult {
  upper: number;
  middle: number;
  lower: number;
  width: number;
  percentB: number;
  signal: "overbought" | "neutral" | "oversold";
}

export interface MAResult {
  sma20: number;
  sma50: number;
  sma200: number;
  ema12: number;
  ema26: number;
  priceVsSma200: "above" | "below";
  goldenCross: boolean;
  deathCross: boolean;
}

export interface TradingSignal {
  symbol: string;
  signal: "strong_buy" | "buy" | "neutral" | "sell" | "strong_sell";
  score: number;
  confidence: number;
  indicators: {
    rsi: RSIResult;
    macd: MACDResult;
    bollinger: BollingerResult;
    movingAverages: MAResult;
  };
  analysis: string;
  timestamp: string;
}

/**
 * Calculate Simple Moving Average
 */
export function calculateSMA(prices: number[], period: number): number[] {
  const result: number[] = [];
  
  for (let i = 0; i < prices.length; i++) {
    if (i < period - 1) {
      result.push(NaN);
    } else {
      const sum = prices.slice(i - period + 1, i + 1).reduce((a, b) => a + b, 0);
      result.push(sum / period);
    }
  }
  
  return result;
}

/**
 * Calculate Exponential Moving Average
 */
export function calculateEMA(prices: number[], period: number): number[] {
  const result: number[] = [];
  const multiplier = 2 / (period + 1);
  
  // First EMA is SMA
  let ema = prices.slice(0, period).reduce((a, b) => a + b, 0) / period;
  
  for (let i = 0; i < prices.length; i++) {
    if (i < period - 1) {
      result.push(NaN);
    } else if (i === period - 1) {
      result.push(ema);
    } else {
      ema = (prices[i] - ema) * multiplier + ema;
      result.push(ema);
    }
  }
  
  return result;
}

/**
 * Calculate RSI (Relative Strength Index)
 */
export function calculateRSI(prices: number[], period: number = 14): RSIResult {
  const gains: number[] = [];
  const losses: number[] = [];
  
  for (let i = 1; i < prices.length; i++) {
    const change = prices[i] - prices[i - 1];
    gains.push(change > 0 ? change : 0);
    losses.push(change < 0 ? Math.abs(change) : 0);
  }
  
  const rsiValues: Array<{ timestamp: string; value: number }> = [];
  
  let avgGain = gains.slice(0, period).reduce((a, b) => a + b, 0) / period;
  let avgLoss = losses.slice(0, period).reduce((a, b) => a + b, 0) / period;
  
  for (let i = period; i < gains.length; i++) {
    avgGain = (avgGain * (period - 1) + gains[i]) / period;
    avgLoss = (avgLoss * (period - 1) + losses[i]) / period;
    
    const rs = avgLoss === 0 ? 100 : avgGain / avgLoss;
    const rsi = 100 - (100 / (1 + rs));
    
    rsiValues.push({
      timestamp: new Date(Date.now() - (gains.length - i) * 3600000).toISOString(),
      value: parseFloat(rsi.toFixed(2)),
    });
  }
  
  const current = rsiValues[rsiValues.length - 1]?.value || 50;
  
  return {
    current,
    signal: current < 30 ? "oversold" : current > 70 ? "overbought" : "neutral",
    history: rsiValues.slice(-20),
  };
}

/**
 * Calculate MACD
 */
export function calculateMACD(
  prices: number[],
  fastPeriod: number = 12,
  slowPeriod: number = 26,
  signalPeriod: number = 9
): MACDResult {
  const emaFast = calculateEMA(prices, fastPeriod);
  const emaSlow = calculateEMA(prices, slowPeriod);
  
  const macdLine: number[] = [];
  for (let i = 0; i < prices.length; i++) {
    if (isNaN(emaFast[i]) || isNaN(emaSlow[i])) {
      macdLine.push(NaN);
    } else {
      macdLine.push(emaFast[i] - emaSlow[i]);
    }
  }
  
  const validMacd = macdLine.filter((v) => !isNaN(v));
  const signalLine = calculateEMA(validMacd, signalPeriod);
  
  const history: Array<{
    timestamp: string;
    macd: number;
    signal: number;
    histogram: number;
  }> = [];
  
  const startIdx = macdLine.findIndex((v) => !isNaN(v)) + signalPeriod - 1;
  
  for (let i = 0; i < signalLine.length; i++) {
    if (!isNaN(signalLine[i])) {
      const macd = validMacd[i];
      const signal = signalLine[i];
      history.push({
        timestamp: new Date(Date.now() - (signalLine.length - i) * 3600000).toISOString(),
        macd: parseFloat(macd.toFixed(4)),
        signal: parseFloat(signal.toFixed(4)),
        histogram: parseFloat((macd - signal).toFixed(4)),
      });
    }
  }
  
  const latest = history[history.length - 1] || { macd: 0, signal: 0, histogram: 0 };
  
  return {
    macd: latest.macd,
    signal: latest.signal,
    histogram: latest.histogram,
    trend: latest.histogram > 0 ? "bullish" : latest.histogram < 0 ? "bearish" : "neutral",
    history: history.slice(-20),
  };
}

/**
 * Calculate Bollinger Bands
 */
export function calculateBollingerBands(
  prices: number[],
  period: number = 20,
  stdDev: number = 2
): BollingerResult {
  const sma = calculateSMA(prices, period);
  const currentSma = sma[sma.length - 1];
  const currentPrice = prices[prices.length - 1];
  
  // Calculate standard deviation
  const recentPrices = prices.slice(-period);
  const mean = recentPrices.reduce((a, b) => a + b, 0) / period;
  const variance = recentPrices.reduce((acc, p) => acc + Math.pow(p - mean, 2), 0) / period;
  const std = Math.sqrt(variance);
  
  const upper = currentSma + stdDev * std;
  const lower = currentSma - stdDev * std;
  const width = (upper - lower) / currentSma;
  const percentB = (currentPrice - lower) / (upper - lower);
  
  return {
    upper: parseFloat(upper.toFixed(2)),
    middle: parseFloat(currentSma.toFixed(2)),
    lower: parseFloat(lower.toFixed(2)),
    width: parseFloat(width.toFixed(4)),
    percentB: parseFloat(percentB.toFixed(4)),
    signal: percentB > 1 ? "overbought" : percentB < 0 ? "oversold" : "neutral",
  };
}

/**
 * Calculate all moving averages
 */
export function calculateMovingAverages(prices: number[]): MAResult {
  const sma20 = calculateSMA(prices, 20);
  const sma50 = calculateSMA(prices, 50);
  const sma200 = calculateSMA(prices, Math.min(200, prices.length));
  const ema12 = calculateEMA(prices, 12);
  const ema26 = calculateEMA(prices, 26);
  
  const currentPrice = prices[prices.length - 1];
  const currentSma200 = sma200[sma200.length - 1];
  const currentSma50 = sma50[sma50.length - 1];
  
  // Check for golden/death cross (SMA50 vs SMA200)
  const prevSma50 = sma50[sma50.length - 2];
  const prevSma200 = sma200[sma200.length - 2];
  
  const goldenCross = prevSma50 < prevSma200 && currentSma50 > currentSma200;
  const deathCross = prevSma50 > prevSma200 && currentSma50 < currentSma200;
  
  return {
    sma20: parseFloat(sma20[sma20.length - 1].toFixed(2)),
    sma50: parseFloat(currentSma50.toFixed(2)),
    sma200: parseFloat(currentSma200.toFixed(2)),
    ema12: parseFloat(ema12[ema12.length - 1].toFixed(2)),
    ema26: parseFloat(ema26[ema26.length - 1].toFixed(2)),
    priceVsSma200: currentPrice > currentSma200 ? "above" : "below",
    goldenCross,
    deathCross,
  };
}

/**
 * Generate comprehensive trading signal
 */
export async function generateTradingSignal(symbol: string): Promise<TradingSignal> {
  // Fetch OHLCV data
  const ohlcv = await getOHLCV(symbol, 90);
  const prices = ohlcv.data.map((c) => c.close);
  
  if (prices.length < 30) {
    throw new Error("Insufficient data for technical analysis");
  }
  
  // Calculate all indicators
  const rsi = calculateRSI(prices);
  const macd = calculateMACD(prices);
  const bollinger = calculateBollingerBands(prices);
  const movingAverages = calculateMovingAverages(prices);
  
  // Calculate signal score (-100 to +100)
  let score = 0;
  let signals = 0;
  
  // RSI contribution
  if (rsi.current < 30) {
    score += 25;
  } else if (rsi.current < 40) {
    score += 10;
  } else if (rsi.current > 70) {
    score -= 25;
  } else if (rsi.current > 60) {
    score -= 10;
  }
  signals++;
  
  // MACD contribution
  if (macd.histogram > 0 && macd.macd > macd.signal) {
    score += 20;
  } else if (macd.histogram < 0 && macd.macd < macd.signal) {
    score -= 20;
  }
  signals++;
  
  // Bollinger contribution
  if (bollinger.percentB < 0) {
    score += 15;
  } else if (bollinger.percentB > 1) {
    score -= 15;
  }
  signals++;
  
  // Moving averages contribution
  if (movingAverages.priceVsSma200 === "above") {
    score += 15;
  } else {
    score -= 15;
  }
  
  if (movingAverages.goldenCross) {
    score += 30;
  } else if (movingAverages.deathCross) {
    score -= 30;
  }
  signals++;
  
  // Normalize score
  const normalizedScore = Math.max(-100, Math.min(100, score));
  
  // Determine signal
  let signal: TradingSignal["signal"];
  if (normalizedScore >= 40) {
    signal = "strong_buy";
  } else if (normalizedScore >= 15) {
    signal = "buy";
  } else if (normalizedScore <= -40) {
    signal = "strong_sell";
  } else if (normalizedScore <= -15) {
    signal = "sell";
  } else {
    signal = "neutral";
  }
  
  // Calculate confidence (0-1)
  const confidence = Math.min(1, Math.abs(normalizedScore) / 80);
  
  // Generate analysis text
  const analyses: string[] = [];
  
  if (rsi.signal === "oversold") {
    analyses.push("RSI indicates oversold conditions");
  } else if (rsi.signal === "overbought") {
    analyses.push("RSI indicates overbought conditions");
  }
  
  if (macd.trend === "bullish") {
    analyses.push("MACD shows bullish momentum");
  } else if (macd.trend === "bearish") {
    analyses.push("MACD shows bearish momentum");
  }
  
  if (movingAverages.goldenCross) {
    analyses.push("Golden cross detected - bullish signal");
  } else if (movingAverages.deathCross) {
    analyses.push("Death cross detected - bearish signal");
  }
  
  analyses.push(`Price is ${movingAverages.priceVsSma200} the 200-day SMA`);
  
  return {
    symbol: symbol.toUpperCase(),
    signal,
    score: normalizedScore,
    confidence: parseFloat(confidence.toFixed(2)),
    indicators: {
      rsi,
      macd,
      bollinger,
      movingAverages,
    },
    analysis: analyses.join(". ") + ".",
    timestamp: new Date().toISOString(),
  };
}

/**
 * Calculate support and resistance levels
 */
export function calculateSupportResistance(
  candles: Candle[]
): {
  supports: number[];
  resistances: number[];
  pivotPoint: number;
  r1: number;
  r2: number;
  r3: number;
  s1: number;
  s2: number;
  s3: number;
} {
  const highs = candles.map((c) => c.high);
  const lows = candles.map((c) => c.low);
  const closes = candles.map((c) => c.close);
  
  const latestHigh = highs[highs.length - 1];
  const latestLow = lows[lows.length - 1];
  const latestClose = closes[closes.length - 1];
  
  // Calculate pivot point
  const pivotPoint = (latestHigh + latestLow + latestClose) / 3;
  
  // Calculate resistance and support levels
  const r1 = 2 * pivotPoint - latestLow;
  const s1 = 2 * pivotPoint - latestHigh;
  const r2 = pivotPoint + (latestHigh - latestLow);
  const s2 = pivotPoint - (latestHigh - latestLow);
  const r3 = latestHigh + 2 * (pivotPoint - latestLow);
  const s3 = latestLow - 2 * (latestHigh - pivotPoint);
  
  // Find historical support/resistance from price clusters
  const allPrices = [...highs, ...lows, ...closes].sort((a, b) => a - b);
  const clusters: number[] = [];
  let currentCluster: number[] = [allPrices[0]];
  
  for (let i = 1; i < allPrices.length; i++) {
    if (allPrices[i] - allPrices[i - 1] < latestClose * 0.01) {
      currentCluster.push(allPrices[i]);
    } else {
      if (currentCluster.length >= 3) {
        clusters.push(currentCluster.reduce((a, b) => a + b, 0) / currentCluster.length);
      }
      currentCluster = [allPrices[i]];
    }
  }
  
  const currentPrice = closes[closes.length - 1];
  const supports = clusters.filter((c) => c < currentPrice).slice(-3);
  const resistances = clusters.filter((c) => c > currentPrice).slice(0, 3);
  
  return {
    supports: supports.map((s) => parseFloat(s.toFixed(2))),
    resistances: resistances.map((r) => parseFloat(r.toFixed(2))),
    pivotPoint: parseFloat(pivotPoint.toFixed(2)),
    r1: parseFloat(r1.toFixed(2)),
    r2: parseFloat(r2.toFixed(2)),
    r3: parseFloat(r3.toFixed(2)),
    s1: parseFloat(s1.toFixed(2)),
    s2: parseFloat(s2.toFixed(2)),
    s3: parseFloat(s3.toFixed(2)),
  };
}
