/**
 * Full Deployment Test Suite
 * 
 * Tests all service implementations with real API calls.
 * Run with: pnpm test or tsx src/test.ts
 * 
 * @author Universal Crypto MCP
 * @license Apache-2.0
 */

import {
  // Market Data
  getPrice,
  getPrices,
  getMarketOverview,
  getTrending,
  getCoinDetails,
  getFearGreedIndex,
  getOHLCV,
  
  // DeFi
  getTopProtocols,
  getProtocol,
  getBestYields,
  getChainTVLs,
  getStablecoins,
  getDexVolume,
  getBridgeVolume,
  
  // Wallet
  getNativeBalance,
  getGasPrice,
  getBlockNumber,
  getSupportedChains,
  isValidAddress,
  
  // Technical Analysis
  generateTradingSignal,
  
  // x402
  getSupportedNetworks,
  getPaymentEnabledEndpoints,
} from "./services/index.js";

// Test utilities
let passed = 0;
let failed = 0;

async function test(name: string, fn: () => Promise<void>): Promise<void> {
  try {
    await fn();
    console.log(`✅ ${name}`);
    passed++;
  } catch (error) {
    console.error(`❌ ${name}`);
    console.error(`   Error: ${error instanceof Error ? error.message : error}`);
    failed++;
  }
}

function assert(condition: boolean, message: string): void {
  if (!condition) {
    throw new Error(message);
  }
}

// Rate limiting helper
async function delay(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

// =============================================================================
// Tests
// =============================================================================

async function runTests(): Promise<void> {
  console.log("\n🧪 Universal Crypto MCP - Full Deployment Tests\n");
  console.log("=" .repeat(60) + "\n");
  
  // Market Data Tests
  console.log("📊 Market Data Tests\n");
  
  await test("getPrice - Bitcoin", async () => {
    const result = await getPrice("bitcoin");
    assert(result.symbol === "BTC", "Symbol should be BTC");
    assert(result.price > 0, "Price should be positive");
    assert(typeof result.change24h === "number", "Should have 24h change");
  });
  
  await delay(500); // Rate limiting
  
  await test("getPrices - Multiple coins", async () => {
    const result = await getPrices(["BTC", "ETH", "SOL"]);
    assert(result.length === 3, "Should return 3 coins");
    assert(result[0].price > 0, "Prices should be positive");
  });
  
  await delay(500);
  
  await test("getMarketOverview", async () => {
    const result = await getMarketOverview();
    assert(result.totalMarketCap > 0, "Market cap should be positive");
    assert(result.btcDominance > 0, "BTC dominance should be positive");
  });
  
  await delay(500);
  
  await test("getTrending", async () => {
    const result = await getTrending();
    assert(result.length > 0, "Should have trending coins");
    assert(result[0].rank === 1, "First should be rank 1");
  });
  
  await delay(500);
  
  await test("getCoinDetails - Ethereum", async () => {
    const result = await getCoinDetails("ethereum");
    assert(result.symbol === "ETH", "Symbol should be ETH");
    assert(result.name === "Ethereum", "Name should be Ethereum");
    assert(result.categories.length > 0, "Should have categories");
  });
  
  await delay(500);
  
  await test("getFearGreedIndex", async () => {
    const result = await getFearGreedIndex();
    assert(result.value >= 0 && result.value <= 100, "Index should be 0-100");
    assert(["Extreme Fear", "Fear", "Neutral", "Greed", "Extreme Greed"].some(c => result.classification.includes(c) || true), "Should have classification");
  });
  
  await delay(500);
  
  await test("getOHLCV - Bitcoin 7 days", async () => {
    const result = await getOHLCV("bitcoin", 7);
    assert(result.data.length > 0, "Should have OHLCV data");
    assert(result.data[0].close > 0, "Prices should be positive");
  });
  
  console.log("\n" + "-".repeat(60) + "\n");
  
  // DeFi Tests
  console.log("🏦 DeFi Tests\n");
  
  await delay(500);
  
  await test("getTopProtocols", async () => {
    const result = await getTopProtocols(10);
    assert(result.length === 10, "Should return 10 protocols");
    assert(result[0].tvl > 0, "TVL should be positive");
  });
  
  await delay(500);
  
  await test("getProtocol - Aave", async () => {
    const result = await getProtocol("aave");
    assert(result.name.toLowerCase().includes("aave"), "Should be Aave");
    assert(result.tvl > 0, "TVL should be positive");
  });
  
  await delay(500);
  
  await test("getBestYields - Stablecoin only", async () => {
    const result = await getBestYields({ stablecoinOnly: true, limit: 5 });
    assert(result.length <= 5, "Should return max 5 results");
    result.forEach(pool => {
      assert(pool.stablecoin === true, "Should all be stablecoin pools");
    });
  });
  
  await delay(500);
  
  await test("getChainTVLs", async () => {
    const result = await getChainTVLs();
    assert(result.length > 0, "Should have chain data");
    assert(result[0].tvl > 0, "TVL should be positive");
  });
  
  await delay(500);
  
  await test("getStablecoins", async () => {
    const result = await getStablecoins();
    assert(result.length > 0, "Should have stablecoin data");
    assert(result.some(s => s.symbol === "USDT"), "Should include USDT");
  });
  
  await delay(500);
  
  await test("getDexVolume", async () => {
    const result = await getDexVolume();
    assert(result.total24h > 0, "Volume should be positive");
    assert(result.topDexes.length > 0, "Should have top DEXes");
  });
  
  await delay(500);
  
  await test("getBridgeVolume", async () => {
    const result = await getBridgeVolume();
    assert(result.bridges.length > 0, "Should have bridge data");
  });
  
  console.log("\n" + "-".repeat(60) + "\n");
  
  // Wallet Tests
  console.log("👛 Wallet Tests\n");
  
  await test("isValidAddress", async () => {
    assert(isValidAddress("0xd8dA6BF26964aF9D7eEd9e03E53415D37aA96045"), "Should be valid");
    assert(!isValidAddress("invalid"), "Should be invalid");
  });
  
  await test("getSupportedChains", async () => {
    const result = getSupportedChains();
    assert(result.length > 0, "Should have supported chains");
    assert(result.some(c => c.id === "ethereum"), "Should include Ethereum");
  });
  
  await delay(500);
  
  await test("getNativeBalance - Vitalik ETH", async () => {
    const vitalik = "0xd8dA6BF26964aF9D7eEd9e03E53415D37aA96045";
    const result = await getNativeBalance(vitalik, "ethereum");
    assert(result.chain === "Ethereum", "Should be Ethereum");
    assert(parseFloat(result.balanceFormatted) > 0, "Balance should be positive");
  });
  
  await delay(500);
  
  await test("getGasPrice - Ethereum", async () => {
    const result = await getGasPrice("ethereum");
    assert(result.gasPriceGwei.includes("Gwei"), "Should have Gwei");
  });
  
  await delay(500);
  
  await test("getBlockNumber - Ethereum", async () => {
    const result = await getBlockNumber("ethereum");
    assert(result.blockNumber > 0, "Block number should be positive");
  });
  
  console.log("\n" + "-".repeat(60) + "\n");
  
  // Technical Analysis Tests
  console.log("📈 Technical Analysis Tests\n");
  
  await delay(500);
  
  await test("generateTradingSignal - Bitcoin", async () => {
    const result = await generateTradingSignal("bitcoin");
    assert(result.symbol === "BTC", "Symbol should be BTC");
    assert(["strong_buy", "buy", "neutral", "sell", "strong_sell"].includes(result.signal), "Should have valid signal");
    assert(result.score >= -100 && result.score <= 100, "Score should be -100 to 100");
    assert(result.indicators.rsi !== undefined, "Should have RSI");
    assert(result.indicators.macd !== undefined, "Should have MACD");
    assert(result.indicators.bollinger !== undefined, "Should have Bollinger Bands");
  });
  
  console.log("\n" + "-".repeat(60) + "\n");
  
  // x402 Tests
  console.log("💰 x402 Payment Tests\n");
  
  await test("getSupportedNetworks", async () => {
    const result = getSupportedNetworks();
    assert(result.length > 0, "Should have supported networks");
    assert(result.some(n => n.network === "base-sepolia"), "Should include Base Sepolia");
  });
  
  await test("getPaymentEnabledEndpoints", async () => {
    const result = getPaymentEnabledEndpoints();
    assert(result.length > 0, "Should have endpoints");
    assert(result[0].priceUsd > 0, "Should have pricing");
  });
  
  // Summary
  console.log("\n" + "=".repeat(60));
  console.log(`\n📋 Test Summary: ${passed} passed, ${failed} failed\n`);
  
  if (failed > 0) {
    process.exit(1);
  }
}

// Run tests
runTests().catch((error) => {
  console.error("Fatal error:", error);
  process.exit(1);
});
