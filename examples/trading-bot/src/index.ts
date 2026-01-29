/**
 * Trading Bot Example
 *
 * A simple automated trading bot demonstrating the trading package.
 *
 * ⚠️ WARNING: This is for educational purposes only!
 * Do NOT use this in production with real funds without proper testing.
 *
 * @author Universal Crypto MCP
 * @license Apache-2.0
 */

// Configuration
const CONFIG = {
  // Trading pair
  symbol: "BTCUSDT",

  // Strategy parameters
  strategy: {
    // RSI thresholds
    rsiOversold: 30,
    rsiOverbought: 70,

    // Moving average periods
    shortMaPeriod: 9,
    longMaPeriod: 21,

    // Position sizing (as percentage of balance)
    positionSize: 0.1, // 10%

    // Risk management
    stopLossPercent: 0.02, // 2%
    takeProfitPercent: 0.04, // 4%
  },

  // Timing
  checkIntervalMs: 60000, // 1 minute

  // Mode
  dryRun: true, // Set to false for live trading
};

// Types
interface MarketData {
  symbol: string;
  price: number;
  rsi: number;
  shortMa: number;
  longMa: number;
  volume: number;
  timestamp: number;
}

interface Position {
  symbol: string;
  side: "long" | "short";
  entryPrice: number;
  quantity: number;
  stopLoss: number;
  takeProfit: number;
  openedAt: number;
}

interface TradeSignal {
  action: "buy" | "sell" | "hold";
  reason: string;
  confidence: number;
}

// State
let currentPosition: Position | null = null;
let balance = 10000; // Starting balance in USDT

// =============================================================================
// Market Data Functions
// =============================================================================

async function getMarketData(symbol: string): Promise<MarketData> {
  try {
    // Fetch current price
    const coinId = symbol === "BTCUSDT" ? "bitcoin" : "ethereum";
    const priceResponse = await fetch(
      `https://api.coingecko.com/api/v3/simple/price?ids=${coinId}&vs_currencies=usd&include_24hr_vol=true`
    );
    
    if (!priceResponse.ok) {
      throw new Error("Failed to fetch price data");
    }
    
    const priceData = await priceResponse.json();
    const price = priceData[coinId].usd;
    const volume = priceData[coinId].usd_24h_vol;

    // Fetch OHLCV data for MA calculation
    const ohlcvResponse = await fetch(
      `https://api.coingecko.com/api/v3/coins/${coinId}/ohlc?vs_currency=usd&days=30`
    );
    
    if (!ohlcvResponse.ok) {
      throw new Error("Failed to fetch OHLCV data");
    }
    
    const ohlcvData = await ohlcvResponse.json();
    const closePrices = ohlcvData.map((candle: number[]) => candle[4]);
    
    // Calculate RSI
    const rsi = calculateRSI(closePrices, 14);
    
    // Calculate Moving Averages
    const shortMa = calculateMA(closePrices, 7);
    const longMa = calculateMA(closePrices, 25);

    return {
      symbol,
      price,
      rsi,
      shortMa,
      longMa,
      volume,
      timestamp: Date.now(),
    };
  } catch (error) {
    console.error("Error fetching market data:", error);
    throw error;
  }
}

// Calculate RSI (Relative Strength Index)
function calculateRSI(prices: number[], period: number = 14): number {
  if (prices.length < period + 1) return 50;
  
  let gains = 0;
  let losses = 0;
  
  for (let i = prices.length - period; i < prices.length; i++) {
    const change = prices[i] - prices[i - 1];
    if (change > 0) {
      gains += change;
    } else {
      losses += Math.abs(change);
    }
  }
  
  const avgGain = gains / period;
  const avgLoss = losses / period;
  
  if (avgLoss === 0) return 100;
  
  const rs = avgGain / avgLoss;
  return 100 - (100 / (1 + rs));
}

// Calculate Moving Average
function calculateMA(prices: number[], period: number): number {
  if (prices.length < period) return prices[prices.length - 1];
  
  const recentPrices = prices.slice(-period);
  const sum = recentPrices.reduce((a, b) => a + b, 0);
  return sum / period;
}

// =============================================================================
// Trading Functions
// =============================================================================

async function placeBuyOrder(
  symbol: string,
  quantity: number,
  price: number
): Promise<{ orderId: string; filled: boolean }> {
  console.log(`📈 BUY ORDER: ${quantity} ${symbol} @ $${price.toFixed(2)}`);

  if (CONFIG.dryRun) {
    console.log("   [DRY RUN - No actual order placed]");
    return {
      orderId: `dry_run_${Date.now()}`,
      filled: true,
    };
  }

  // Production implementation:
  // import { placeOrder } from "@universal-crypto-mcp/trading-binance";
  // const result = await placeOrder({
  //   symbol,
  //   side: "BUY",
  //   type: "MARKET",
  //   quantity
  // });
  // return { orderId: result.orderId, filled: result.status === "FILLED" };

  throw new Error("Live trading not implemented. Set dryRun: true in CONFIG");
}

async function placeSellOrder(
  symbol: string,
  quantity: number,
  price: number
): Promise<{ orderId: string; filled: boolean }> {
  console.log(`📉 SELL ORDER: ${quantity} ${symbol} @ $${price.toFixed(2)}`);

  if (CONFIG.dryRun) {
    console.log("   [DRY RUN - No actual order placed]");
    return {
      orderId: `dry_run_${Date.now()}`,
      filled: true,
    };
  }

  // Production implementation:
  // import { placeOrder } from "@universal-crypto-mcp/trading-binance";
  // const result = await placeOrder({
  //   symbol,
  //   side: "SELL",
  //   type: "MARKET",
  //   quantity
  // });
  // return { orderId: result.orderId, filled: result.status === "FILLED" };

  throw new Error("Live trading not implemented. Set dryRun: true in CONFIG");
}

// =============================================================================
// Strategy Functions
// =============================================================================

function analyzeMarket(data: MarketData): TradeSignal {
  const { rsi, shortMa, longMa, price } = data;
  const { rsiOversold, rsiOverbought } = CONFIG.strategy;

  // Strategy: RSI + MA Crossover
  const isOversold = rsi < rsiOversold;
  const isOverbought = rsi > rsiOverbought;
  const isBullishCross = shortMa > longMa;
  const isBearishCross = shortMa < longMa;

  // Buy conditions
  if (isOversold && isBullishCross) {
    return {
      action: "buy",
      reason: `RSI oversold (${rsi.toFixed(1)}) + Bullish MA crossover`,
      confidence: 0.75,
    };
  }

  if (isOversold && !isBearishCross) {
    return {
      action: "buy",
      reason: `RSI oversold (${rsi.toFixed(1)})`,
      confidence: 0.6,
    };
  }

  // Sell conditions
  if (isOverbought && isBearishCross) {
    return {
      action: "sell",
      reason: `RSI overbought (${rsi.toFixed(1)}) + Bearish MA crossover`,
      confidence: 0.75,
    };
  }

  if (isOverbought && !isBullishCross) {
    return {
      action: "sell",
      reason: `RSI overbought (${rsi.toFixed(1)})`,
      confidence: 0.6,
    };
  }

  // Hold
  return {
    action: "hold",
    reason: `No clear signal (RSI: ${rsi.toFixed(1)}, MA trend: ${isBullishCross ? "bullish" : "bearish"})`,
    confidence: 0.5,
  };
}

function checkPositionLimits(data: MarketData): "stop_loss" | "take_profit" | null {
  if (!currentPosition) return null;

  const { price } = data;
  const { entryPrice, side, stopLoss, takeProfit } = currentPosition;

  if (side === "long") {
    if (price <= stopLoss) return "stop_loss";
    if (price >= takeProfit) return "take_profit";
  } else {
    if (price >= stopLoss) return "stop_loss";
    if (price <= takeProfit) return "take_profit";
  }

  return null;
}

// =============================================================================
// Trading Logic
// =============================================================================

async function openPosition(data: MarketData, signal: TradeSignal): Promise<void> {
  const { price, symbol } = data;
  const { positionSize, stopLossPercent, takeProfitPercent } = CONFIG.strategy;

  // Calculate position size
  const positionValue = balance * positionSize;
  const quantity = positionValue / price;

  // Calculate stop loss and take profit
  const stopLoss = price * (1 - stopLossPercent);
  const takeProfit = price * (1 + takeProfitPercent);

  // Place order
  const order = await placeBuyOrder(symbol, quantity, price);

  if (order.filled) {
    currentPosition = {
      symbol,
      side: "long",
      entryPrice: price,
      quantity,
      stopLoss,
      takeProfit,
      openedAt: Date.now(),
    };

    console.log(`✅ Position opened:`);
    console.log(`   Entry: $${price.toFixed(2)}`);
    console.log(`   Size: ${quantity.toFixed(6)} ${symbol}`);
    console.log(`   Stop Loss: $${stopLoss.toFixed(2)}`);
    console.log(`   Take Profit: $${takeProfit.toFixed(2)}`);
    console.log(`   Reason: ${signal.reason}`);
  }
}

async function closePosition(data: MarketData, reason: string): Promise<void> {
  if (!currentPosition) return;

  const { price, symbol } = data;
  const { entryPrice, quantity } = currentPosition;

  // Place sell order
  await placeSellOrder(symbol, quantity, price);

  // Calculate P&L
  const pnl = (price - entryPrice) * quantity;
  const pnlPercent = ((price - entryPrice) / entryPrice) * 100;

  // Update balance
  balance += pnl;

  console.log(`🔒 Position closed:`);
  console.log(`   Exit: $${price.toFixed(2)}`);
  console.log(`   P&L: $${pnl.toFixed(2)} (${pnlPercent >= 0 ? "+" : ""}${pnlPercent.toFixed(2)}%)`);
  console.log(`   Reason: ${reason}`);
  console.log(`   New Balance: $${balance.toFixed(2)}`);

  currentPosition = null;
}

// =============================================================================
// Main Loop
// =============================================================================

async function tradingLoop(): Promise<void> {
  console.log("=".repeat(60));
  console.log(`📊 Checking ${CONFIG.symbol}...`);

  try {
    // Get market data
    const data = await getMarketData(CONFIG.symbol);
    console.log(`   Price: $${data.price.toFixed(2)}`);
    console.log(`   RSI: ${data.rsi.toFixed(1)}`);
    console.log(`   MA: ${data.shortMa.toFixed(2)} / ${data.longMa.toFixed(2)}`);

    // Check position limits
    if (currentPosition) {
      const limitHit = checkPositionLimits(data);
      if (limitHit) {
        await closePosition(
          data,
          limitHit === "stop_loss" ? "Stop Loss triggered" : "Take Profit triggered"
        );
        return;
      }
    }

    // Analyze market
    const signal = analyzeMarket(data);
    console.log(`   Signal: ${signal.action.toUpperCase()} (${(signal.confidence * 100).toFixed(0)}%)`);
    console.log(`   Reason: ${signal.reason}`);

    // Execute based on signal
    if (!currentPosition && signal.action === "buy" && signal.confidence >= 0.6) {
      await openPosition(data, signal);
    } else if (currentPosition && signal.action === "sell" && signal.confidence >= 0.7) {
      await closePosition(data, signal.reason);
    } else {
      console.log(`   Action: Holding...`);
    }
  } catch (error) {
    console.error("❌ Error in trading loop:", error);
  }
}

// =============================================================================
// Main
// =============================================================================

async function main(): Promise<void> {
  console.log("🤖 Trading Bot Started");
  console.log("=".repeat(60));
  console.log(`Symbol: ${CONFIG.symbol}`);
  console.log(`Mode: ${CONFIG.dryRun ? "DRY RUN (no real trades)" : "LIVE TRADING ⚠️"}`);
  console.log(`Starting Balance: $${balance.toFixed(2)}`);
  console.log(`Check Interval: ${CONFIG.checkIntervalMs / 1000}s`);
  console.log("=".repeat(60));

  if (!CONFIG.dryRun) {
    console.log("");
    console.log("⚠️  WARNING: LIVE TRADING MODE");
    console.log("⚠️  Real orders will be placed!");
    console.log("⚠️  Press Ctrl+C to stop");
    console.log("");
  }

  // Run immediately, then on interval
  await tradingLoop();
  setInterval(tradingLoop, CONFIG.checkIntervalMs);
}

main().catch(console.error);
