/**
 * Paid API Example
 *
 * A cryptocurrency data API that accepts x402 payments.
 *
 * @author Universal Crypto MCP
 * @license Apache-2.0
 */

import express, { Request, Response } from "express";

// In production, import from @nirholas/x402-deploy
// import { wrapExpressWithX402 } from "@nirholas/x402-deploy/express";

const app = express();
app.use(express.json());

// =============================================================================
// Free Endpoints
// =============================================================================

app.get("/api/health", (_req: Request, res: Response) => {
  res.json({
    status: "healthy",
    version: "1.0.0",
    timestamp: new Date().toISOString(),
  });
});

// =============================================================================
// Basic Paid Endpoints ($0.0001 each)
// =============================================================================

app.get("/api/v1/price/:symbol", async (req: Request, res: Response) => {
  try {
    const symbol = req.params.symbol.toLowerCase();
    const response = await fetch(
      `https://api.coingecko.com/api/v3/simple/price?ids=${symbol}&vs_currencies=usd&include_24hr_change=true&include_market_cap=true&include_24h_vol=true`
    );

    if (!response.ok) {
      res.status(502).json({ error: "Failed to fetch price data" });
      return;
    }

    const data = await response.json();

    if (!data[symbol]) {
      res.status(404).json({ error: `Symbol ${symbol} not found. Use CoinGecko IDs (bitcoin, ethereum, solana, etc.)` });
      return;
    }

    res.json({
      symbol: symbol.toUpperCase(),
      price: data[symbol].usd,
      change24h: data[symbol].usd_24h_change || 0,
      marketCap: data[symbol].usd_market_cap || 0,
      volume24h: data[symbol].usd_24h_vol || 0,
      timestamp: Date.now(),
    });
  } catch (error) {
    res.status(500).json({ error: "Internal server error" });
  }
});

app.get("/api/v1/prices", async (_req: Request, res: Response) => {
  try {
    const coins = "bitcoin,ethereum,solana,arbitrum,polygon";
    const response = await fetch(
      `https://api.coingecko.com/api/v3/simple/price?ids=${coins}&vs_currencies=usd&include_24hr_change=true`
    );

    if (!response.ok) {
      res.status(502).json({ error: "Failed to fetch price data" });
      return;
    }

    const data = await response.json();
    const prices = Object.entries(data).map(([id, info]: [string, any]) => ({
      symbol: id.toUpperCase(),
      price: info.usd,
      change24h: info.usd_24h_change || 0,
    }));

    res.json({
      prices,
      timestamp: Date.now(),
    });
  } catch (error) {
    res.status(500).json({ error: "Internal server error" });
  }
});

app.get("/api/v1/trending", async (_req: Request, res: Response) => {
  try {
    const response = await fetch("https://api.coingecko.com/api/v3/search/trending");

    if (!response.ok) {
      res.status(502).json({ error: "Failed to fetch trending data" });
      return;
    }

    const data = await response.json();
    const trending = data.coins.slice(0, 10).map((item: any, index: number) => {
      const coin = item.item;
      return {
        rank: index + 1,
        symbol: coin.symbol,
        name: coin.name,
        change24h: coin.data?.price_change_percentage_24h?.usd || 0,
        marketCapRank: coin.market_cap_rank,
      };
    });

    res.json({
      trending,
      timestamp: Date.now(),
    });
  } catch (error) {
    res.status(500).json({ error: "Internal server error" });
  }
});

// =============================================================================
// Premium Endpoints ($0.01+ each)
// =============================================================================

app.get("/api/v1/premium/analysis/:symbol", async (req: Request, res: Response) => {
  try {
    const symbol = req.params.symbol.toLowerCase();
    
    // Fetch current price and market data
    const priceResponse = await fetch(
      `https://api.coingecko.com/api/v3/coins/${symbol}?localization=false&tickers=false&community_data=true&developer_data=false`
    );

    if (!priceResponse.ok) {
      res.status(404).json({ error: `Symbol ${symbol} not found` });
      return;
    }

    const coinData = await priceResponse.json();
    const marketData = coinData.market_data;
    const currentPrice = marketData.current_price.usd;
    
    // Calculate technical indicators from real data
    const high24h = marketData.high_24h.usd;
    const low24h = marketData.low_24h.usd;
    const change24h = marketData.price_change_percentage_24h;
    const change7d = marketData.price_change_percentage_7d;
    const change30d = marketData.price_change_percentage_30d;
    
    // Determine trend based on real price movements
    const trend = (change7d > 0 && change30d > 0) ? "bullish" : 
                  (change7d < 0 && change30d < 0) ? "bearish" : "neutral";
    
    // Calculate support and resistance from real data
    const support = [
      low24h * 0.98,
      marketData.atl.usd * 1.1,
      currentPrice * 0.95,
    ].sort((a, b) => b - a);
    
    const resistance = [
      high24h * 1.02,
      marketData.ath.usd * 0.9,
      currentPrice * 1.05,
    ].sort((a, b) => a - b);

    const analysis = {
      symbol: symbol.toUpperCase(),
      name: coinData.name,
      timestamp: Date.now(),

      technical: {
        trend,
        currentPrice,
        high24h,
        low24h,
        support: support.map(p => parseFloat(p.toFixed(2))),
        resistance: resistance.map(p => parseFloat(p.toFixed(2))),
        priceChange24h: change24h,
        priceChange7d: change7d,
        priceChange30d: change30d,
      },

      sentiment: {
        overall: coinData.sentiment_votes_up_percentage > 60 ? "bullish" : 
                 coinData.sentiment_votes_up_percentage < 40 ? "bearish" : "neutral",
        bullishVotes: coinData.sentiment_votes_up_percentage,
        bearishVotes: coinData.sentiment_votes_down_percentage,
        communityScore: marketData.community_score,
        developerScore: marketData.developer_score,
      },

      market: {
        marketCap: marketData.market_cap.usd,
        marketCapRank: coinData.market_cap_rank,
        volume24h: marketData.total_volume.usd,
        circulatingSupply: marketData.circulating_supply,
        totalSupply: marketData.total_supply,
        athPrice: marketData.ath.usd,
        athDate: marketData.ath_date.usd,
        atlPrice: marketData.atl.usd,
        atlDate: marketData.atl_date.usd,
      },

      recommendation: {
        action: trend === "bullish" ? "buy" : trend === "bearish" ? "sell" : "hold",
        confidence: Math.abs(change7d) > 10 ? 0.8 : 0.5,
        reason: `${trend} trend detected. 7d change: ${change7d.toFixed(2)}%, 30d change: ${change30d.toFixed(2)}%`,
      },
    };

    res.json(analysis);
  } catch (error) {
    res.status(500).json({ error: "Internal server error" });
  }
});

app.get("/api/v1/premium/signals", async (_req: Request, res: Response) => {
  try {
    // Fetch real market data for top coins
    const coins = ["bitcoin", "ethereum", "solana"];
    const response = await fetch(
      `https://api.coingecko.com/api/v3/coins/markets?vs_currency=usd&ids=${coins.join(",")}&order=market_cap_desc&sparkline=false&price_change_percentage=24h,7d`
    );

    if (!response.ok) {
      res.status(502).json({ error: "Failed to fetch market data" });
      return;
    }

    const data = await response.json();
    
    // Generate signals based on real price movements
    const signals = data.map((coin: any) => {
      const change24h = coin.price_change_percentage_24h || 0;
      const change7d = coin.price_change_percentage_7d_in_currency || 0;
      const currentPrice = coin.current_price;
      const high24h = coin.high_24h;
      const low24h = coin.low_24h;
      
      // Determine signal type based on real momentum
      let type: "buy" | "sell" | "hold";
      let reason: string;
      let confidence: number;
      
      if (change24h > 5 && change7d > 10) {
        type = "buy";
        reason = `Strong upward momentum: +${change24h.toFixed(1)}% (24h), +${change7d.toFixed(1)}% (7d)`;
        confidence = Math.min(0.85, 0.5 + change24h / 20);
      } else if (change24h < -5 && change7d < -10) {
        type = "sell";
        reason = `Downward pressure: ${change24h.toFixed(1)}% (24h), ${change7d.toFixed(1)}% (7d)`;
        confidence = Math.min(0.85, 0.5 + Math.abs(change24h) / 20);
      } else {
        type = "hold";
        reason = `Consolidating: ${change24h >= 0 ? "+" : ""}${change24h.toFixed(1)}% (24h). Waiting for clear direction.`;
        confidence = 0.5;
      }
      
      // Calculate technical levels from real data
      const range = high24h - low24h;
      const stopLoss = type === "sell" ? high24h * 1.02 : low24h * 0.95;
      const target = type === "buy" ? currentPrice * 1.1 : currentPrice * 0.9;
      
      return {
        symbol: coin.symbol.toUpperCase(),
        name: coin.name,
        type,
        currentPrice,
        entry: type === "hold" ? null : currentPrice,
        target: parseFloat(target.toFixed(2)),
        stopLoss: parseFloat(stopLoss.toFixed(2)),
        confidence: parseFloat(confidence.toFixed(2)),
        timeframe: "4h",
        reason,
        priceChange24h: change24h,
        priceChange7d: change7d,
        high24h,
        low24h,
        marketCap: coin.market_cap,
        volume24h: coin.total_volume,
      };
    });

    res.json({
      signals,
      generatedAt: Date.now(),
      validFor: "4 hours",
      disclaimer: "This is algorithmic analysis based on price momentum. Not financial advice. Always do your own research.",
    });
  } catch (error) {
    res.status(500).json({ error: "Internal server error" });
  }
});

// =============================================================================
// Start Server
// =============================================================================

const PORT = process.env.PORT || 3000;

// In production, wrap with x402:
// import config from "./x402.config.json";
// const wrappedApp = wrapExpressWithX402(app, config);
// wrappedApp.listen(PORT, ...);

// For demo, run without x402 wrapper
app.listen(PORT, () => {
  console.log(`✅ Paid API running on http://localhost:${PORT}`);
  console.log("");
  console.log("📍 Endpoints:");
  console.log("  FREE:    GET /api/health");
  console.log("  $0.0001: GET /api/v1/price/:symbol");
  console.log("  $0.0005: GET /api/v1/prices");
  console.log("  $0.0001: GET /api/v1/trending");
  console.log("  $0.01:   GET /api/v1/premium/analysis/:symbol");
  console.log("  $0.05:   GET /api/v1/premium/signals");
  console.log("");
  console.log("💡 To enable x402 payments, uncomment the wrapExpressWithX402 code");
});
