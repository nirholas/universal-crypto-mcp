import type {
  TradingSignal,
  TokenInfo,
  RugAnalysis,
  SocialMetrics,
  TradeConfig,
} from './types';

export class TradingStrategy {
  private config: TradeConfig;

  constructor(config: TradeConfig) {
    this.config = config;
  }

  analyze(
    token: TokenInfo,
    rugAnalysis: RugAnalysis,
    social: SocialMetrics,
    rsi?: number,
    volatility?: number
  ): TradingSignal {
    let score = 0;
    let confidence = 0;
    const reasons: string[] = [];

    // Rug risk check (CRITICAL)
    if (rugAnalysis.riskScore > this.config.maxRugRisk) {
      return {
        action: 'HOLD',
        token: token.mint,
        confidence: 0,
        reason: `High rug risk: ${rugAnalysis.riskScore}/100`,
        timestamp: Date.now(),
        indicators: { rugRisk: rugAnalysis.riskScore },
      };
    }

    // Liquidity check
    if (token.liquidity < this.config.minLiquidity) {
      return {
        action: 'HOLD',
        token: token.mint,
        confidence: 0,
        reason: `Low liquidity: $${token.liquidity}`,
        timestamp: Date.now(),
        indicators: { liquidityScore: token.liquidity },
      };
    }

    // Volume analysis
    const volumeScore = this.analyzeVolume(token);
    score += volumeScore * 0.25;
    if (volumeScore > 70) {
      reasons.push(`High volume: $${token.volume24h.toLocaleString()}`);
    }

    // Price momentum
    if (token.priceChange24h > 20) {
      score += 20;
      reasons.push(`Strong momentum: +${token.priceChange24h.toFixed(2)}%`);
    } else if (token.priceChange24h < -30) {
      score -= 30;
      reasons.push(`Downtrend: ${token.priceChange24h.toFixed(2)}%`);
    }

    // Social metrics
    const socialScore = this.analyzeSocial(social);
    score += socialScore * 0.2;
    if (socialScore > 60) {
      reasons.push('Strong social presence');
    }

    // RSI analysis
    if (rsi) {
      if (rsi < 30) {
        score += 15;
        reasons.push(`Oversold RSI: ${rsi.toFixed(2)}`);
      } else if (rsi > 70) {
        score -= 15;
        reasons.push(`Overbought RSI: ${rsi.toFixed(2)}`);
      }
    }

    // Volatility (high volatility = high risk but high reward for memecoins)
    if (volatility && volatility > 50) {
      score += 10; // Memecoins thrive on volatility
      reasons.push(`High volatility: ${volatility.toFixed(2)}%`);
    }

    // Holder distribution
    if (rugAnalysis.topHoldersPercentage < 30) {
      score += 15;
      reasons.push('Good holder distribution');
    }

    // Market cap sweet spot for memecoins
    if (token.marketCap > 100000 && token.marketCap < 10000000) {
      score += 10;
      reasons.push('Ideal market cap range');
    }

    // Calculate confidence
    confidence = Math.min(Math.max(score, 0), 100);

    // Determine action
    let action: 'BUY' | 'SELL' | 'HOLD' = 'HOLD';
    if (confidence >= 70) {
      action = 'BUY';
    } else if (confidence <= 30) {
      action = 'SELL';
    }

    return {
      action,
      token: token.mint,
      confidence,
      reason: reasons.join(', '),
      timestamp: Date.now(),
      indicators: {
        rsi,
        volumeSpike: volumeScore > 70,
        liquidityScore: token.liquidity,
        socialScore,
        rugRisk: rugAnalysis.riskScore,
      },
    };
  }

  analyzeSnipe(
    token: TokenInfo,
    rugAnalysis: RugAnalysis
  ): { shouldSnipe: boolean; reason: string } {
    if (!this.config.enableSniping) {
      return { shouldSnipe: false, reason: 'Sniping disabled' };
    }

    // Only snipe if:
    // 1. Very low rug risk
    if (rugAnalysis.riskScore > 20) {
      return { shouldSnipe: false, reason: 'Rug risk too high for sniping' };
    }

    // 2. Token just launched (< 5 minutes)
    const age = Date.now() - token.createdAt;
    if (age > 300000) {
      return { shouldSnipe: false, reason: 'Token not fresh enough' };
    }

    // 3. Mint authority revoked
    if (rugAnalysis.suspiciousActivity.includes('Mint authority not revoked')) {
      return { shouldSnipe: false, reason: 'Mint authority not revoked' };
    }

    // 4. Has minimum liquidity
    if (token.liquidity < this.config.minLiquidity / 2) {
      return { shouldSnipe: false, reason: 'Insufficient initial liquidity' };
    }

    return { shouldSnipe: true, reason: 'All snipe criteria met' };
  }

  private analyzeVolume(token: TokenInfo): number {
    const volumeToLiquidityRatio = token.volume24h / (token.liquidity || 1);
    
    if (volumeToLiquidityRatio > 5) return 100;
    if (volumeToLiquidityRatio > 3) return 80;
    if (volumeToLiquidityRatio > 2) return 60;
    if (volumeToLiquidityRatio > 1) return 40;
    return 20;
  }

  private analyzeSocial(social: SocialMetrics): number {
    let score = 0;

    if (social.trending) score += 40;
    if (social.mentions24h > 100) score += 30;
    if (social.sentiment > 0.5) score += 20;
    if (social.telegramMembers && social.telegramMembers > 1000) score += 10;

    return Math.min(score, 100);
  }

  shouldTakeProfit(entryPrice: number, currentPrice: number): boolean {
    const profit = ((currentPrice - entryPrice) / entryPrice) * 100;
    return profit >= this.config.takeProfit;
  }

  shouldStopLoss(entryPrice: number, currentPrice: number): boolean {
    const loss = ((currentPrice - entryPrice) / entryPrice) * 100;
    return loss <= -this.config.stopLoss;
  }
}
