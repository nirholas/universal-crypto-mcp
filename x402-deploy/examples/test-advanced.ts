/**
 * Quick Test: Advanced Features
 * Run this to verify everything works
 */

import {
  MultiChainPaymentVerifier,
  SubscriptionManager,
  CreditSystem,
  MetricsCollector,
  HealthChecker,
  AlertManager,
} from "../src/index.js";

async function testAdvancedFeatures() {
  console.log("🧪 Testing Advanced Features...\n");

  // Test 1: Multi-Chain Payment Verifier
  console.log("1️⃣  Testing Multi-Chain Payment Verifier...");
  try {
    const verifier = new MultiChainPaymentVerifier();
    console.log("   ✅ Multi-chain verifier initialized");
    console.log(
      "   ✅ Supports:",
      Object.keys((verifier as any).clients).join(", ")
    );
  } catch (error) {
    console.log("   ❌ Failed:", error);
  }

  // Test 2: Subscription Manager
  console.log("\n2️⃣  Testing Subscription Manager...");
  try {
    const manager = new SubscriptionManager();
    const sub = await manager.createSubscription(
      "0x1234567890123456789012345678901234567890" as `0x${string}`,
      "monthly",
      "0xabcdef1234567890abcdef1234567890abcdef1234567890abcdef1234567890" as `0x${string}`
    );
    console.log("   ✅ Subscription created:", sub.id);
    console.log("   ✅ Plan:", sub.plan);
    console.log("   ✅ Active:", sub.active);
  } catch (error) {
    console.log("   ❌ Failed:", error);
  }

  // Test 3: Credit System
  console.log("\n3️⃣  Testing Credit System...");
  try {
    const credits = new CreditSystem({
      packages: [
        { credits: 100, price: "10", discount: 0 },
        { credits: 1000, price: "80", discount: 20 },
      ],
    });

    await credits.purchaseCredits(
      "0x1234567890123456789012345678901234567890" as `0x${string}`,
      100,
      "0xabcdef1234567890abcdef1234567890abcdef1234567890abcdef1234567890" as `0x${string}`
    );

    const balance = credits.getBalance(
      "0x1234567890123456789012345678901234567890" as `0x${string}`
    );
    console.log("   ✅ Credits purchased");
    console.log("   ✅ Balance:", balance);

    const used = credits.useCredit(
      "0x1234567890123456789012345678901234567890" as `0x${string}`
    );
    console.log("   ✅ Credit used:", used);
    console.log(
      "   ✅ New balance:",
      credits.getBalance(
        "0x1234567890123456789012345678901234567890" as `0x${string}`
      )
    );
  } catch (error) {
    console.log("   ❌ Failed:", error);
  }

  // Test 4: Metrics Collector
  console.log("\n4️⃣  Testing Metrics Collector...");
  try {
    const metrics = new MetricsCollector();
    metrics.trackRequest("GET", "/api/test", 200, 150);
    metrics.trackPayment("eip155:8453", "USDC", 10);
    metrics.trackError("validation", "400");
    metrics.setActiveConnections(5);
    metrics.setCreditsBalance(1000);
    console.log("   ✅ Metrics tracked successfully");

    const metricsOutput = await metrics.getMetrics();
    console.log("   ✅ Metrics output length:", metricsOutput.length, "chars");
  } catch (error) {
    console.log("   ❌ Failed:", error);
  }

  // Test 5: Health Checker
  console.log("\n5️⃣  Testing Health Checker...");
  try {
    const health = new HealthChecker({ version: "1.0.0" });
    const status = await health.check();
    console.log("   ✅ Health check completed");
    console.log("   ✅ Status:", status.status);
    console.log("   ✅ Uptime:", status.uptime, "ms");
    console.log(
      "   ✅ Checks:",
      Object.keys(status.checks).length,
      "performed"
    );
  } catch (error) {
    console.log("   ❌ Failed:", error);
  }

  // Test 6: Alert Manager
  console.log("\n6️⃣  Testing Alert Manager...");
  try {
    const alerts = new AlertManager({
      webhook: "https://example.com/webhook",
    });

    await alerts.sendAlert({
      level: "info",
      title: "Test Alert",
      message: "This is a test alert",
      timestamp: new Date(),
    });

    console.log("   ✅ Alert sent successfully");
    console.log("   ✅ Alert history length:", (alerts as any).recentAlerts.length);
  } catch (error) {
    console.log("   ❌ Failed:", error);
  }

  console.log("\n✨ All tests completed!\n");
}

// Run tests
testAdvancedFeatures().catch(console.error);
