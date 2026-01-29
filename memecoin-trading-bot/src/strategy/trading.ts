import { TradingSignal, TokenInfo, PriceData, TechnicalIndicators, OHLCVData } from '../types.js';
import { config } from '../config.js';
import { technicalAnalyzer } from '../analysis/technical.js';
import { logger } from '../utils/logger.js';

export class TradingStrategy {
  generateSignal(
    token: TokenInfo,
    priceData: PriceData,
    indicators: TechnicalIndicators | null
  ): TradingSignal {
    const reasons: string[] = [];
    let signalType: 'BUY' | 'SELL' | 'HOLD' = 'HOLD';
    let confidence = 0;

    if (!indicators) {
      return {
        type: 'HOLD',
        token,
        price: priceData.price,
        confidence: 0,
        indicators: this.getDefaultIndicators(),
        reasons: ['Insufficient data for analysis'],
        timestamp: Date.now(),
      };
    }

    // Buy Signal Logic
    const buySignals: { condition: boolean; reason: string; weight: number }[] = [
      {
        condition: indicators.rsi < config.rsiOversold,
        reason: `RSI oversold (${indicators.rsi.toFixed(2)})`,
        weight: 25,
      },
      {
        condition: indicators.emaShort > indicators.emaLong,
        reason: `Bullish EMA crossover (${indicators.emaShort.toFixed(6)} > ${indicators.emaLong.toFixed(6)})`,
        weight: 20,
      },
      {
        condition: indicators.macd.histogram > 0 && indicators.macd.macd > indicators.macd.signal,
        reason: `Bullish MACD (${indicators.macd.histogram.toFixed(6)})`,
        weight: 15,
      },
      {
        condition: priceData.price < indicators.bollingerBands.lower,
        reason: `Price below lower Bollinger Band`,
        weight: 15,
      },
      {
        condition: indicators.volumeSpike,
        reason: `Volume spike detected`,
        weight: 15,
      },
      {
        condition: priceData.priceChange24h > 5 && priceData.priceChange24h < 50,
        reason: `Healthy price momentum (+${priceData.priceChange24h.toFixed(2)}%)`,
        weight: 10,
      },
    ];

    // Sell Signal Logic
    const sellSignals: { condition: boolean; reason: string; weight: number }[] = [
      {
        condition: indicators.rsi > config.rsiOverbought,
        reason: `RSI overbought (${indicators.rsi.toFixed(2)})`,
        weight: 25,
      },
      {
        condition: indicators.emaShort < indicators.emaLong,
        reason: `Bearish EMA crossover`,
        weight: 20,
      },
      {
        condition: indicators.macd.histogram < 0 && indicators.macd.macd < indicators.macd.signal,
        reason: `Bearish MACD`,
        weight: 15,
      },
      {
        condition: priceData.price > indicators.bollingerBands.upper,
        reason: `Price above upper Bollinger Band`,
        weight: 15,
      },
      {
        condition: priceData.priceChange24h < -10,
        reason: `Negative momentum (${priceData.priceChange24h.toFixed(2)}%)`,
        weight: 15,
      },
      {
        condition: !indicators.volumeSpike && priceData.volume24h < indicators.volumeAverage * 0.5,
        reason: `Low volume`,
        weight: 10,
      },
    ];

    // Calculate buy confidence
    const buyConfidence = buySignals
      .filter(s => s.condition)
      .reduce((sum, s) => {
        reasons.push(`✅ ${s.reason}`);
        return sum + s.weight;
      }, 0);

    // Calculate sell confidence
    const sellConfidence = sellSignals
      .filter(s => s.condition)
      .reduce((sum, s) => {
        reasons.push(`❌ ${s.reason}`);
        return sum + s.weight;
      }, 0);

    // Determine signal type and confidence
    if (buyConfidence > 50 && buyConfidence > sellConfidence) {
      signalType = 'BUY';
      confidence = Math.min(100, buyConfidence);
    } else if (sellConfidence > 50 && sellConfidence > buyConfidence) {
      signalType = 'SELL';
      confidence = Math.min(100, sellConfidence);
    } else {
      signalType = 'HOLD';
      confidence = 0;
      reasons.push('No clear signal');
    }

    // Add indicator values to reasons
    reasons.push(`📊 RSI: ${indicators.rsi.toFixed(2)}`);
    reasons.push(`📈 EMA Short/Long: ${indicators.emaShort.toFixed(6)}/${indicators.emaLong.toFixed(6)}`);
    reasons.push(`💹 MACD: ${indicators.macd.macd.toFixed(6)}`);

    return {
      type: signalType,
      token,
      price: priceData.price,
      confidence,
      indicators,
      reasons,
      timestamp: Date.now(),
    };
  }

  shouldEnter(signal: TradingSignal): boolean {
    return signal.type === 'BUY' && signal.confidence >= 60;
  }

  shouldExit(signal: TradingSignal): boolean {
    return signal.type === 'SELL' && signal.confidence >= 50;
  }

  private getDefaultIndicators(): TechnicalIndicators {
    return {
      rsi: 50,
      emaShort: 0,
      emaLong: 0,
      macd: { macd: 0, signal: 0, histogram: 0 },
      bollingerBands: { upper: 0, middle: 0, lower: 0 },
      volumeAverage: 0,
      volumeSpike: false,
    };
  }

  analyzeToken(token: TokenInfo, priceData: PriceData): TradingSignal {
    // Add current price to history
    const ohlcv: OHLCVData = {
      timestamp: Date.now(),
      open: priceData.price,
      high: priceData.price,
      low: priceData.price,
      close: priceData.price,
      volume: priceData.volume24h,
    };

    technicalAnalyzer.addPriceData(token.address, ohlcv);

    // Calculate indicators
    const indicators = technicalAnalyzer.calculateIndicators(token.address);

    // Generate signal
    return this.generateSignal(token, priceData, indicators);
  }
}

export const tradingStrategy = new TradingStrategy();
