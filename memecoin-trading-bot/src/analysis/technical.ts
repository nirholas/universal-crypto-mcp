import { OHLCVData, TechnicalIndicators } from '../types.js';
import { RSI, EMA, MACD, BollingerBands } from 'technicalindicators';
import { config } from '../config.js';
import { logger } from '../utils/logger.js';

export class TechnicalAnalyzer {
  private priceHistory: Map<string, OHLCVData[]> = new Map();
  private readonly MAX_HISTORY = 200;

  addPriceData(tokenAddress: string, data: OHLCVData): void {
    if (!this.priceHistory.has(tokenAddress)) {
      this.priceHistory.set(tokenAddress, []);
    }

    const history = this.priceHistory.get(tokenAddress)!;
    history.push(data);

    // Keep only MAX_HISTORY entries
    if (history.length > this.MAX_HISTORY) {
      history.shift();
    }

    this.priceHistory.set(tokenAddress, history);
  }

  getPriceHistory(tokenAddress: string, periods: number = 100): OHLCVData[] {
    const history = this.priceHistory.get(tokenAddress) || [];
    return history.slice(-periods);
  }

  calculateIndicators(tokenAddress: string): TechnicalIndicators | null {
    const history = this.getPriceHistory(tokenAddress);
    
    if (history.length < config.emaLongPeriod + 10) {
      logger.debug(`Insufficient data for ${tokenAddress}: ${history.length} candles`);
      return null;
    }

    try {
      const closes = history.map(h => h.close);
      const highs = history.map(h => h.high);
      const lows = history.map(h => h.low);
      const volumes = history.map(h => h.volume);

      // Calculate RSI
      const rsiValues = RSI.calculate({
        values: closes,
        period: config.rsiPeriod,
      });
      const rsi = rsiValues[rsiValues.length - 1] || 50;

      // Calculate EMAs
      const emaShortValues = EMA.calculate({
        values: closes,
        period: config.emaShortPeriod,
      });
      const emaLongValues = EMA.calculate({
        values: closes,
        period: config.emaLongPeriod,
      });
      
      const emaShort = emaShortValues[emaShortValues.length - 1] || closes[closes.length - 1];
      const emaLong = emaLongValues[emaLongValues.length - 1] || closes[closes.length - 1];

      // Calculate MACD
      const macdValues = MACD.calculate({
        values: closes,
        fastPeriod: 12,
        slowPeriod: 26,
        signalPeriod: 9,
        SimpleMAOscillator: false,
        SimpleMASignal: false,
      });
      
      const latestMacd = macdValues[macdValues.length - 1] || { MACD: 0, signal: 0, histogram: 0 };

      // Calculate Bollinger Bands
      const bbValues = BollingerBands.calculate({
        values: closes,
        period: 20,
        stdDev: 2,
      });
      
      const latestBB = bbValues[bbValues.length - 1] || { 
        upper: closes[closes.length - 1] * 1.02, 
        middle: closes[closes.length - 1], 
        lower: closes[closes.length - 1] * 0.98 
      };

      // Calculate volume metrics
      const volumeAverage = volumes.slice(-20).reduce((a, b) => a + b, 0) / Math.min(20, volumes.length);
      const currentVolume = volumes[volumes.length - 1];
      const volumeSpike = currentVolume > volumeAverage * config.volumeSpikeMultiplier;

      return {
        rsi,
        emaShort,
        emaLong,
        macd: {
          macd: latestMacd.MACD || 0,
          signal: latestMacd.signal || 0,
          histogram: latestMacd.histogram || 0,
        },
        bollingerBands: {
          upper: latestBB.upper,
          middle: latestBB.middle,
          lower: latestBB.lower,
        },
        volumeAverage,
        volumeSpike,
      };
    } catch (error) {
      logger.error(`Error calculating indicators for ${tokenAddress}:`, error);
      return null;
    }
  }

  clearHistory(tokenAddress: string): void {
    this.priceHistory.delete(tokenAddress);
  }

  clearAllHistory(): void {
    this.priceHistory.clear();
  }
}

export const technicalAnalyzer = new TechnicalAnalyzer();
