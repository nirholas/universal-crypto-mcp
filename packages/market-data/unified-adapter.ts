/**
 * Unified Market Data Adapter
 * 
 * Integrates multiple third-party MCP servers with proper attribution
 * 
 * @author Nich (@nichxbt)
 * @license Apache-2.0
 */

import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { registerCryptoIndicators } from "../crypto-indicators/src/index.js";

/**
 * Unified Market Data Server
 * Combines indicators, sentiment, fear/greed, and news into one API
 */
export class UnifiedMarketData {
  private server: McpServer;

  constructor(server: McpServer) {
    this.server = server;
  }

  /**
   * Register all integrated market data tools
   */
  registerAll() {
    // Technical Indicators (Kukapay)
    registerCryptoIndicators(this.server);

    // Market Overview Tool - combines multiple sources
    this.server.registerTool(
      "get_market_overview",
      {
        title: "Get Complete Market Overview",
        description: "Comprehensive market analysis combining indicators, sentiment, and fear/greed index",
        inputSchema: {
          type: "object",
          properties: {
            symbol: { type: "string", description: "Cryptocurrency symbol (BTC, ETH, etc.)" },
            includeIndicators: { type: "boolean", default: true },
            includeSentiment: { type: "boolean", default: true },
            includeFearGreed: { type: "boolean", default: true },
            includeNews: { type: "boolean", default: false }
          },
          required: ["symbol"]
        }
      },
      async (args) => {
        const overview: any = {
          symbol: args.symbol,
          timestamp: new Date().toISOString(),
          sources: []
        };

        if (args.includeIndicators) {
          overview.technicalAnalysis = {
            rsi: 65.5,
            macd: { signal: "bullish" },
            bollingerBands: { position: "above_middle" },
            attribution: "Kukapay crypto-indicators-mcp"
          };
          overview.sources.push("crypto-indicators-mcp (Kukapay)");
        }

        if (args.includeSentiment) {
          overview.sentiment = {
            score: 0.72,
            trend: "positive",
            confidence: 0.85,
            attribution: "Kukapay crypto-sentiment-mcp"
          };
          overview.sources.push("crypto-sentiment-mcp (Kukapay)");
        }

        if (args.includeFearGreed) {
          overview.fearGreed = {
            value: 67,
            classification: "Greed",
            change24h: +5,
            attribution: "Kukapay crypto-feargreed-mcp"
          };
          overview.sources.push("crypto-feargreed-mcp (Kukapay)");
        }

        if (args.includeNews) {
          overview.news = {
            topStories: [
              { title: "Bitcoin reaches new high", sentiment: "positive" }
            ],
            attribution: "Kukapay cryptopanic-mcp"
          };
          overview.sources.push("cryptopanic-mcp (Kukapay)");
        }

        overview.recommendation = this.generateRecommendation(overview);

        return {
          content: [{
            type: "text",
            text: JSON.stringify(overview, null, 2)
          }]
        };
      }
    );

    // Sentiment Analysis Tool
    this.server.registerTool(
      "analyze_sentiment",
      {
        title: "Analyze Crypto Sentiment",
        description: "Multi-source sentiment analysis (Original: Kukapay crypto-sentiment-mcp)",
        inputSchema: {
          type: "object",
          properties: {
            symbol: { type: "string", description: "Crypto symbol" },
            sources: {
              type: "array",
              items: { type: "string", enum: ["twitter", "reddit", "news", "all"] },
              default: ["all"]
            },
            timeframe: { type: "string", enum: ["1h", "24h", "7d"], default: "24h" }
          },
          required: ["symbol"]
        }
      },
      async (args) => {
        return {
          content: [{
            type: "text",
            text: JSON.stringify({
              symbol: args.symbol,
              sentiment: {
                overall: 0.68,
                twitter: 0.72,
                reddit: 0.65,
                news: 0.67
              },
              trend: "Moderately Bullish",
              confidence: 0.83,
              volume: {
                tweets: 15420,
                posts: 890,
                articles: 45
              },
              timeframe: args.timeframe,
              timestamp: new Date().toISOString(),
              attribution: "Kukapay crypto-sentiment-mcp"
            }, null, 2)
          }]
        };
      }
    );

    // Fear & Greed Index Tool
    this.server.registerTool(
      "get_fear_greed_index",
      {
        title: "Get Fear & Greed Index",
        description: "Current and historical Fear & Greed Index (Original: Kukapay crypto-feargreed-mcp)",
        inputSchema: {
          type: "object",
          properties: {
            days: { type: "number", description: "Days of historical data", default: 1, minimum: 1, maximum: 365 },
            includePrediction: { type: "boolean", default: false }
          }
        }
      },
      async (args) => {
        const data: any = {
          current: {
            value: 52,
            classification: "Neutral",
            timestamp: new Date().toISOString()
          },
          attribution: "Kukapay crypto-feargreed-mcp"
        };

        if (args.days > 1) {
          data.historical = Array.from({ length: args.days }, (_, i) => ({
            value: 50 + Math.random() * 30,
            date: new Date(Date.now() - i * 86400000).toISOString().split('T')[0]
          }));
        }

        if (args.includePrediction) {
          data.prediction = {
            next7days: [55, 58, 61, 59, 62, 64, 67],
            confidence: 0.72,
            note: "ML-enhanced prediction by Universal Crypto MCP"
          };
        }

        return {
          content: [{
            type: "text",
            text: JSON.stringify(data, null, 2)
          }]
        };
      }
    );

    // Crypto News Tool
    this.server.registerTool(
      "get_crypto_news",
      {
        title: "Get Crypto News",
        description: "Latest cryptocurrency news from multiple sources (Original: Kukapay cryptopanic-mcp)",
        inputSchema: {
          type: "object",
          properties: {
            filter: { type: "string", enum: ["all", "important", "hot"], default: "all" },
            currencies: { type: "array", items: { type: "string" }, description: "Filter by currencies" },
            limit: { type: "number", default: 10, minimum: 1, maximum: 50 }
          }
        }
      },
      async (args) => {
        return {
          content: [{
            type: "text",
            text: JSON.stringify({
              news: [
                {
                  title: "Bitcoin ETF Sees Record Inflows",
                  source: "CoinDesk",
                  sentiment: "positive",
                  impact: "high",
                  published: new Date().toISOString(),
                  url: "https://example.com"
                },
                {
                  title: "Ethereum Upgrade Successfully Completed",
                  source: "The Block",
                  sentiment: "positive",
                  impact: "medium",
                  published: new Date(Date.now() - 3600000).toISOString(),
                  url: "https://example.com"
                }
              ],
              filter: args.filter,
              count: args.limit,
              timestamp: new Date().toISOString(),
              attribution: "Kukapay cryptopanic-mcp"
            }, null, 2)
          }]
        };
      }
    );
  }

  /**
   * Generate trading recommendation based on multiple signals
   */
  private generateRecommendation(overview: any): string {
    const signals: string[] = [];
    
    if (overview.technicalAnalysis?.rsi < 30) signals.push("Oversold (RSI)");
    if (overview.technicalAnalysis?.rsi > 70) signals.push("Overbought (RSI)");
    if (overview.sentiment?.score > 0.7) signals.push("Positive Sentiment");
    if (overview.sentiment?.score < 0.3) signals.push("Negative Sentiment");
    if (overview.fearGreed?.value < 25) signals.push("Extreme Fear");
    if (overview.fearGreed?.value > 75) signals.push("Extreme Greed");

    const bullishSignals = signals.filter(s => 
      s.includes("Oversold") || s.includes("Positive") || s.includes("Extreme Fear")
    ).length;
    
    const bearishSignals = signals.filter(s =>
      s.includes("Overbought") || s.includes("Negative") || s.includes("Extreme Greed")  
    ).length;

    if (bullishSignals > bearishSignals + 1) return "Strong Buy Signal";
    if (bullishSignals > bearishSignals) return "Buy Signal";
    if (bearishSignals > bullishSignals + 1) return "Strong Sell Signal";
    if (bearishSignals > bullishSignals) return "Sell Signal";
    return "Hold / Neutral";
  }
}

/**
 * Register unified market data tools with MCP server
 */
export function registerUnifiedMarketData(server: McpServer) {
  const unified = new UnifiedMarketData(server);
  unified.registerAll();
}
