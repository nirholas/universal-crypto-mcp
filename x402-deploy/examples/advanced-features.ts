/**
 * Advanced Features Example
 * Demonstrates multi-chain payments, subscriptions, credits, and monitoring
 */

import express from "express";
import {
  X402Gateway,
  MultiChainPaymentVerifier,
  SubscriptionManager,
  CreditSystem,
  MetricsCollector,
  HealthChecker,
  AlertManager,
  metricsMiddleware,
  subscriptionMiddleware,
  creditMiddleware,
  healthEndpoint,
} from "@nirholas/x402-deploy";

const app = express();

// 1. Initialize multi-chain payment verifier
const paymentVerifier = new MultiChainPaymentVerifier();

// 2. Initialize subscription manager
const subscriptionManager = new SubscriptionManager();

// 3. Initialize credit system
const creditSystem = new CreditSystem({
  packages: [
    { credits: 100, price: "10", discount: 0 },
    { credits: 1000, price: "80", discount: 20 },
    { credits: 10000, price: "500", discount: 50 },
  ],
  pricePerCredit: "0.001", // $0.001 per credit base price
});

// 4. Initialize metrics collector
const metrics = new MetricsCollector();

// 5. Initialize health checker
const healthChecker = new HealthChecker({
  paymentVerifier,
  version: "1.0.0",
});

// 6. Initialize alert manager
const alertManager = new AlertManager({
  slack: process.env.SLACK_WEBHOOK_URL,
  discord: process.env.DISCORD_WEBHOOK_URL,
});

// 7. Apply global monitoring middleware
app.use(metricsMiddleware(metrics));

// 8. Health and metrics endpoints
app.get("/health", healthEndpoint(healthChecker));
app.get("/metrics", metrics.createMetricsEndpoint());

// 9. Protected API with subscription support
app.use(subscriptionMiddleware(subscriptionManager));

// 10. Protected API with credit support
app.use(creditMiddleware(creditSystem));

// 11. Main x402 gateway with multi-chain support
const gateway = new X402Gateway({
  providers: [
    {
      name: "my-api",
      endpoint: "/api",
      price: "0.01", // $0.01 per call
      acceptedTokens: ["USDC", "USDT"],
      networks: ["eip155:8453", "eip155:42161", "eip155:137"], // Base, Arbitrum, Polygon
    },
  ],
  paymentVerifier, // Use multi-chain verifier
});

app.use(gateway.middleware());

// Your API routes
app.get("/api/data", (req, res) => {
  res.json({ message: "Premium data access!" });
});

app.post("/api/subscription", async (req, res) => {
  try {
    const { payer, plan, txHash } = req.body;

    // Verify payment for subscription
    const subscription = await subscriptionManager.createSubscription(
      payer as `0x${string}`,
      plan,
      txHash as `0x${string}`
    );

    // Track metric
    metrics.trackPayment(
      "eip155:8453",
      "USDC",
      plan === "monthly" ? 10 : 100
    );

    // Send alert
    await alertManager.sendAlert({
      level: "info",
      title: "New Subscription",
      message: `User ${payer.slice(0, 8)} subscribed to ${plan} plan`,
      timestamp: new Date(),
    });

    res.json({ success: true, subscription });
  } catch (error) {
    metrics.trackError("subscription", "500");
    await alertManager.alertPaymentFailed(String(error));
    res.status(500).json({ error: String(error) });
  }
});

app.post("/api/credits/purchase", async (req, res) => {
  try {
    const { buyer, amount, txHash, network } = req.body;

    // Purchase credits
    await creditSystem.purchaseCredits(
      buyer as `0x${string}`,
      amount,
      txHash as `0x${string}`,
      { network }
    );

    // Track metric
    const balance = creditSystem.getBalance(buyer);
    metrics.setCreditsBalance(balance);

    // Send alert
    await alertManager.sendAlert({
      level: "info",
      title: "Credits Purchased",
      message: `User ${buyer.slice(0, 8)} purchased ${amount} credits`,
      timestamp: new Date(),
    });

    res.json({
      success: true,
      balance,
    });
  } catch (error) {
    metrics.trackError("credits", "500");
    res.status(500).json({ error: String(error) });
  }
});

// Error handler
app.use(
  (
    err: any,
    req: express.Request,
    res: express.Response,
    next: express.NextFunction
  ) => {
    metrics.trackError(err.name || "unknown", err.status || 500);
    alertManager.alertPaymentFailed(err.message);
    res.status(err.status || 500).json({ error: err.message });
  }
);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
  console.log(`📊 Metrics: http://localhost:${PORT}/metrics`);
  console.log(`🏥 Health: http://localhost:${PORT}/health`);

  alertManager.alertDeploymentSuccess(`http://localhost:${PORT}`);
});

// Graceful shutdown
process.on("SIGTERM", () => {
  console.log("SIGTERM received, shutting down gracefully");
  process.exit(0);
});
