# Advanced Features Guide

This guide covers the enterprise-ready features in x402-deploy: multi-chain payments, subscriptions, credits, and production monitoring.

## 📋 Table of Contents

- [Multi-Chain Payment Support](#multi-chain-payment-support)
- [Subscription Model](#subscription-model)
- [Credits System](#credits-system)
- [Prometheus Metrics](#prometheus-metrics)
- [Health Checks](#health-checks)
- [Alerting System](#alerting-system)
- [Complete Example](#complete-example)

## 🌐 Multi-Chain Payment Support

Support payments across Base, Arbitrum, Polygon, and Ethereum mainnet.

### Supported Networks

| Network | CAIP-2 ID | Tokens |
|---------|-----------|--------|
| Base | `eip155:8453` | USDC |
| Base Sepolia | `eip155:84532` | USDC |
| Arbitrum | `eip155:42161` | USDC, USDT |
| Polygon | `eip155:137` | USDC, USDT |
| Ethereum | `eip155:1` | USDC, USDT, DAI |

### Usage

```typescript
import { MultiChainPaymentVerifier } from "@nirholas/x402-deploy";

const verifier = new MultiChainPaymentVerifier();

// Verify payment on Base
const isValid = await verifier.verifyPayment(
  "eip155:8453", // Base
  "USDC",
  "0x123...", // transaction hash
  BigInt("1000000"), // 1 USDC (6 decimals)
  "0xYourAddress..." // recipient
);

// Check balance
const balance = await verifier.getBalance(
  "eip155:8453",
  "USDC",
  "0xUserAddress..."
);
```

## 📅 Subscription Model

Monthly or yearly subscriptions for unlimited API access.

### Pricing

- **Monthly**: $10/month
- **Yearly**: $100/year (save 17%)

### Usage

```typescript
import { SubscriptionManager, subscriptionMiddleware } from "@nirholas/x402-deploy";

const manager = new SubscriptionManager();

// Create subscription after payment
const sub = await manager.createSubscription(
  "0xUserAddress..." as `0x${string}`,
  "monthly",
  "0xTxHash..." as `0x${string}`
);

// Use middleware to skip per-call payments for subscribers
app.use(subscriptionMiddleware(manager));
```

### API Endpoints

```bash
# Create subscription
POST /api/subscription
{
  "payer": "0x...",
  "plan": "monthly",
  "txHash": "0x..."
}

# Check subscription status
GET /api/subscription/:address
```

## 🎟️ Credits System

Prepaid credits for bulk API access at discounted rates.

### Credit Packages

| Package | Price | Per-Credit Cost | Discount |
|---------|-------|-----------------|----------|
| 100 credits | $10 | $0.10 | 0% |
| 1,000 credits | $80 | $0.08 | 20% |
| 10,000 credits | $500 | $0.05 | 50% |

### Usage

```typescript
import { CreditSystem, creditMiddleware } from "@nirholas/x402-deploy";

const credits = new CreditSystem({
  packages: [
    { credits: 100, price: "10", discount: 0 },
    { credits: 1000, price: "80", discount: 20 },
    { credits: 10000, price: "500", discount: 50 },
  ],
});

// Purchase credits
await credits.purchaseCredits(
  "0xBuyerAddress..." as `0x${string}`,
  1000, // amount
  "0xTxHash..." as `0x${string}`
);

// Use middleware to deduct credits automatically
app.use(creditMiddleware(credits));

// Check balance
const balance = credits.getBalance("0xUserAddress..." as `0x${string}`);
```

## 📊 Prometheus Metrics

Production-grade metrics collection for monitoring and alerting.

### Available Metrics

#### Counters
- `x402_requests_total` - Total API requests
- `x402_payments_total` - Total payments received
- `x402_revenue_total` - Total revenue in USD
- `x402_errors_total` - Total errors

#### Gauges
- `x402_active_connections` - Active connections
- `x402_credits_balance` - Total credits balance

#### Histograms
- `x402_request_duration_seconds` - Request latency
- `x402_payment_verification_duration_seconds` - Payment verification time

### Usage

```typescript
import { MetricsCollector, metricsMiddleware } from "@nirholas/x402-deploy";

const metrics = new MetricsCollector();

// Auto-track all requests
app.use(metricsMiddleware(metrics));

// Track custom events
metrics.trackPayment("eip155:8453", "USDC", 10);
metrics.trackError("validation", "400");
metrics.setActiveConnections(42);

// Expose metrics endpoint
app.get("/metrics", metrics.createMetricsEndpoint());
```

### Grafana Dashboard

Import the included Grafana dashboard:

```bash
# Import dashboard
grafana-cli dashboard import examples/grafana-dashboard.json
```

The dashboard includes:
- Request rate and latency
- Payment success rate
- Revenue by network
- Error rate
- Resource usage (CPU, memory)

## 🏥 Health Checks

Kubernetes-ready health and readiness checks.

### Health Status

- **healthy** - All systems operational
- **degraded** - Some non-critical issues
- **unhealthy** - Critical failures

### Usage

```typescript
import { HealthChecker, healthEndpoint } from "@nirholas/x402-deploy";

const health = new HealthChecker({
  paymentVerifier,
  version: "1.0.0",
});

app.get("/health", healthEndpoint(health));
app.get("/health/live", healthEndpoint(health)); // Liveness probe
app.get("/health/ready", healthEndpoint(health)); // Readiness probe
```

### Response Format

```json
{
  "status": "healthy",
  "timestamp": "2024-01-29T12:00:00Z",
  "uptime": 3600000,
  "version": "1.0.0",
  "checks": {
    "database": { "status": "pass", "duration": 5 },
    "rpc": { "status": "pass", "duration": 120 },
    "memory": { "status": "pass", "message": "Memory usage at 45.2%" },
    "disk": { "status": "pass", "message": "Disk usage at 62%" }
  }
}
```

### Kubernetes Integration

```yaml
livenessProbe:
  httpGet:
    path: /health/live
    port: 3000
  initialDelaySeconds: 30
  periodSeconds: 10

readinessProbe:
  httpGet:
    path: /health/ready
    port: 3000
  initialDelaySeconds: 5
  periodSeconds: 5
```

## 🚨 Alerting System

Send alerts to Slack, Discord, PagerDuty, or custom webhooks.

### Configuration

```typescript
import { AlertManager } from "@nirholas/x402-deploy";

const alerts = new AlertManager({
  slack: process.env.SLACK_WEBHOOK_URL,
  discord: process.env.DISCORD_WEBHOOK_URL,
  webhook: process.env.CUSTOM_WEBHOOK_URL,
});
```

### Alert Levels

- **info** - Informational events
- **warning** - Non-critical issues
- **critical** - Requires immediate attention

### Usage

```typescript
// Custom alert
await alerts.sendAlert({
  level: "critical",
  title: "Payment Processing Failed",
  message: "Unable to verify payment on Base",
  timestamp: new Date(),
  metadata: { network: "eip155:8453", txHash: "0x..." }
});

// Pre-configured alerts
await alerts.alertPaymentFailed("Transaction not found");
await alerts.alertHighErrorRate(15.5);
await alerts.alertLowDiskSpace(92);
await alerts.alertDeploymentSuccess("https://api.example.com");
```

### Alert Throttling

Alerts are automatically throttled to prevent spam:
- Same alert within 5 minutes: suppressed
- Keeps history of last 100 alerts

## 🚀 Complete Example

See [`examples/advanced-features.ts`](./examples/advanced-features.ts) for a complete integration example.

### Quick Start

```typescript
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

// Initialize services
const paymentVerifier = new MultiChainPaymentVerifier();
const subscriptions = new SubscriptionManager();
const credits = new CreditSystem();
const metrics = new MetricsCollector();
const health = new HealthChecker({ paymentVerifier });
const alerts = new AlertManager({ slack: process.env.SLACK_WEBHOOK });

// Apply middleware
app.use(metricsMiddleware(metrics));
app.use(subscriptionMiddleware(subscriptions));
app.use(creditMiddleware(credits));

// Endpoints
app.get("/health", healthEndpoint(health));
app.get("/metrics", metrics.createMetricsEndpoint());

// Gateway
const gateway = new X402Gateway({
  providers: [{
    name: "my-api",
    endpoint: "/api",
    price: "0.01",
    networks: ["eip155:8453", "eip155:42161"],
  }],
  paymentVerifier,
});

app.use(gateway.middleware());

app.listen(3000);
```

## 📈 Monitoring Stack

### Recommended Setup

1. **Prometheus** - Metrics collection
2. **Grafana** - Visualization
3. **AlertManager** - Alert routing
4. **Loki** (optional) - Log aggregation

### Docker Compose

```yaml
version: "3.8"
services:
  app:
    build: .
    ports:
      - "3000:3000"
    environment:
      - SLACK_WEBHOOK_URL=${SLACK_WEBHOOK}
      
  prometheus:
    image: prom/prometheus
    volumes:
      - ./prometheus.yml:/etc/prometheus/prometheus.yml
    ports:
      - "9090:9090"
      
  grafana:
    image: grafana/grafana
    ports:
      - "3001:3000"
    environment:
      - GF_SECURITY_ADMIN_PASSWORD=admin
```

### Prometheus Configuration

```yaml
# prometheus.yml
global:
  scrape_interval: 15s

scrape_configs:
  - job_name: 'x402-deploy'
    static_configs:
      - targets: ['app:3000']
    metrics_path: '/metrics'
```

## 🔒 Security Best Practices

1. **Rate Limiting** - Protect endpoints from abuse
2. **Input Validation** - Validate all payment data
3. **Secure Storage** - Encrypt sensitive credentials
4. **Audit Logs** - Track all payment events
5. **Network Security** - Use HTTPS in production

## 📚 Additional Resources

- [x402 Protocol Spec](https://github.com/nirholas/x402)
- [Prometheus Documentation](https://prometheus.io/docs/)
- [Grafana Tutorials](https://grafana.com/tutorials/)
- [CAIP-2 Network IDs](https://github.com/ChainAgnostic/CAIPs/blob/master/CAIPs/caip-2.md)

## 💬 Support

- GitHub Issues: [nirholas/x402-deploy](https://github.com/nirholas/x402-deploy/issues)
- Discord: [Join our community](#)
- Email: support@x402.dev
