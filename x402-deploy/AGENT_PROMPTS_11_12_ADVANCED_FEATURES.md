# Agent 11 & 12: Advanced Features & Multi-Chain Support

> Take x402-deploy from MVP to killer product

---

## Agent 11: Multi-Chain & Advanced Payments

**Goal:** Support multiple chains, tokens, and payment models

### Task 11.1: Multi-Chain Payment Support 🌐

**File:** `src/gateway/multi-chain.ts`

Support payments across Base, Arbitrum, Polygon, Ethereum:

```typescript
import { createPublicClient, http, Chain } from 'viem';
import { base, baseSepolia, arbitrum, polygon, mainnet } from 'viem/chains';

export interface ChainConfig {
  chain: Chain;
  rpcUrl?: string;
  tokens: {
    USDC: `0x${string}`;
    USDT?: `0x${string}`;
    DAI?: `0x${string}`;
  };
}

export const SUPPORTED_CHAINS: Record<string, ChainConfig> = {
  'eip155:8453': {
    chain: base,
    tokens: {
      USDC: '0x833589fCD6eDb6E08f4c7C32D4f71b54bdA02913'
    }
  },
  'eip155:84532': {
    chain: baseSepolia,
    tokens: {
      USDC: '0x036CbD53842c5426634e7929541eC2318f3dCF7e'
    }
  },
  'eip155:42161': {
    chain: arbitrum,
    tokens: {
      USDC: '0xaf88d065e77c8cC2239327C5EDb3A432268e5831',
      USDT: '0xFd086bC7CD5C481DCC9C85ebE478A1C0b69FCbb9'
    }
  },
  'eip155:137': {
    chain: polygon,
    tokens: {
      USDC: '0x3c499c542cEF5E3811e1192ce70d8cC03d5c3359',
      USDT: '0xc2132D05D31c914a87C6611C10748AEb04B58e8F'
    }
  },
  'eip155:1': {
    chain: mainnet,
    tokens: {
      USDC: '0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48',
      USDT: '0xdAC17F958D2ee523a2206206994597C13D831ec7',
      DAI: '0x6B175474E89094C44Da98b954EedeAC495271d0F'
    }
  }
};

export class MultiChainPaymentVerifier {
  private clients: Map<string, ReturnType<typeof createPublicClient>>;

  constructor() {
    this.clients = new Map();
    
    // Initialize clients for each chain
    for (const [caip2, config] of Object.entries(SUPPORTED_CHAINS)) {
      this.clients.set(
        caip2,
        createPublicClient({
          chain: config.chain,
          transport: http(config.rpcUrl)
        })
      );
    }
  }

  async verifyPayment(
    network: string,
    token: string,
    txHash: `0x${string}`,
    expectedAmount: bigint,
    expectedRecipient: `0x${string}`
  ): Promise<boolean> {
    const client = this.clients.get(network);
    if (!client) {
      throw new Error(`Unsupported network: ${network}`);
    }

    const chainConfig = SUPPORTED_CHAINS[network];
    const tokenAddress = chainConfig.tokens[token as keyof typeof chainConfig.tokens];
    
    if (!tokenAddress) {
      throw new Error(`Token ${token} not supported on ${network}`);
    }

    // Get transaction receipt
    const receipt = await client.getTransactionReceipt({ hash: txHash });
    if (!receipt || receipt.status !== 'success') {
      return false;
    }

    // Parse transfer logs
    const transferLog = receipt.logs.find(log => 
      log.address.toLowerCase() === tokenAddress.toLowerCase() &&
      log.topics[0] === '0xddf252ad1be2c89b69c2b068fc378daa952ba7f163c4a11628f55a4df523b3ef' // Transfer event
    );

    if (!transferLog) return false;

    // Decode transfer event: Transfer(address indexed from, address indexed to, uint256 value)
    const to = `0x${transferLog.topics[2]?.slice(-40)}` as `0x${string}`;
    const amount = BigInt(transferLog.data);

    return (
      to.toLowerCase() === expectedRecipient.toLowerCase() &&
      amount >= expectedAmount
    );
  }

  async getBalance(
    network: string,
    token: string,
    address: `0x${string}`
  ): Promise<bigint> {
    const client = this.clients.get(network);
    if (!client) {
      throw new Error(`Unsupported network: ${network}`);
    }

    const chainConfig = SUPPORTED_CHAINS[network];
    const tokenAddress = chainConfig.tokens[token as keyof typeof chainConfig.tokens];
    
    if (!tokenAddress) {
      throw new Error(`Token ${token} not supported on ${network}`);
    }

    const balance = await client.readContract({
      address: tokenAddress,
      abi: [{
        name: 'balanceOf',
        type: 'function',
        stateMutability: 'view',
        inputs: [{ name: 'account', type: 'address' }],
        outputs: [{ name: '', type: 'uint256' }]
      }],
      functionName: 'balanceOf',
      args: [address]
    });

    return balance as bigint;
  }
}
```

---

### Task 11.2: Subscription Model 📅

**File:** `src/gateway/subscriptions.ts`

Support monthly/yearly subscriptions:

```typescript
import { createPublicClient, http, parseUnits } from 'viem';
import { base } from 'viem/chains';

export interface Subscription {
  id: string;
  payer: `0x${string}`;
  plan: 'monthly' | 'yearly';
  price: bigint;
  startDate: Date;
  endDate: Date;
  active: boolean;
  txHash?: `0x${string}`;
}

export class SubscriptionManager {
  private subscriptions: Map<string, Subscription> = new Map();

  async createSubscription(
    payer: `0x${string}`,
    plan: 'monthly' | 'yearly',
    txHash: `0x${string}`
  ): Promise<Subscription> {
    const now = new Date();
    const endDate = new Date(now);
    
    if (plan === 'monthly') {
      endDate.setMonth(endDate.getMonth() + 1);
    } else {
      endDate.setFullYear(endDate.getFullYear() + 1);
    }

    const subscription: Subscription = {
      id: `sub_${Date.now()}_${payer.slice(2, 8)}`,
      payer,
      plan,
      price: plan === 'monthly' ? parseUnits('10', 6) : parseUnits('100', 6), // $10/mo or $100/yr
      startDate: now,
      endDate,
      active: true,
      txHash
    };

    this.subscriptions.set(subscription.id, subscription);
    return subscription;
  }

  isSubscriptionActive(payer: `0x${string}`): boolean {
    const now = new Date();
    
    for (const sub of this.subscriptions.values()) {
      if (
        sub.payer.toLowerCase() === payer.toLowerCase() &&
        sub.active &&
        sub.endDate > now
      ) {
        return true;
      }
    }
    
    return false;
  }

  async verifySubscriptionPayment(
    payer: `0x${string}`,
    req: any
  ): Promise<boolean> {
    // Check if user has active subscription
    if (this.isSubscriptionActive(payer)) {
      return true;
    }

    // Otherwise, require per-call payment
    return false;
  }
}

// Middleware integration
export function subscriptionMiddleware(manager: SubscriptionManager) {
  return async (req: any, res: any, next: any) => {
    const payer = req.headers['x-payer-address'] as `0x${string}`;
    
    if (payer && manager.isSubscriptionActive(payer)) {
      // Subscription valid, skip per-call payment
      req.subscription = true;
      return next();
    }

    // No active subscription, continue to per-call payment
    next();
  };
}
```

---

### Task 11.3: Usage Credits System 🎟️

**File:** `src/gateway/credits.ts`

Prepaid credit system (buy 1000 calls upfront):

```typescript
export interface CreditBalance {
  address: `0x${string}`;
  credits: number;
  purchaseHistory: CreditPurchase[];
}

export interface CreditPurchase {
  amount: number;
  price: bigint;
  timestamp: Date;
  txHash: `0x${string}`;
}

export class CreditSystem {
  private balances: Map<string, CreditBalance> = new Map();

  async purchaseCredits(
    buyer: `0x${string}`,
    amount: number,
    txHash: `0x${string}`
  ): Promise<void> {
    const existing = this.balances.get(buyer.toLowerCase()) || {
      address: buyer,
      credits: 0,
      purchaseHistory: []
    };

    const purchase: CreditPurchase = {
      amount,
      price: BigInt(amount) * parseUnits('0.001', 6), // $0.001 per credit
      timestamp: new Date(),
      txHash
    };

    existing.credits += amount;
    existing.purchaseHistory.push(purchase);
    
    this.balances.set(buyer.toLowerCase(), existing);
  }

  useCredit(user: `0x${string}`): boolean {
    const balance = this.balances.get(user.toLowerCase());
    
    if (!balance || balance.credits <= 0) {
      return false;
    }

    balance.credits--;
    return true;
  }

  getBalance(user: `0x${string}`): number {
    return this.balances.get(user.toLowerCase())?.credits || 0;
  }
}

// Express middleware
export function creditMiddleware(credits: CreditSystem) {
  return async (req: any, res: any, next: any) => {
    const user = req.headers['x-payer-address'] as `0x${string}`;
    
    if (!user) {
      return res.status(400).json({ error: 'Missing x-payer-address header' });
    }

    const balance = credits.getBalance(user);
    
    if (balance > 0) {
      const used = credits.useCredit(user);
      if (used) {
        res.setHeader('X-Credits-Remaining', credits.getBalance(user).toString());
        return next();
      }
    }

    // No credits, require payment
    return res.status(402).json({
      error: 'Insufficient credits',
      balance,
      message: 'Purchase credits or provide payment'
    });
  };
}
```

---

## Agent 12: Monitoring & Observability

**Goal:** Production-grade monitoring and alerting

### Task 12.1: Prometheus Metrics 📊

**File:** `src/monitoring/prometheus.ts`

```typescript
import client from 'prom-client';
import express from 'express';

export class MetricsCollector {
  private registry: client.Registry;
  
  // Counters
  private requestsTotal: client.Counter;
  private paymentsTotal: client.Counter;
  private revenueTotal: client.Counter;
  private errorsTotal: client.Counter;
  
  // Gauges
  private activeConnections: client.Gauge;
  private creditsBalance: client.Gauge;
  
  // Histograms
  private requestDuration: client.Histogram;
  private paymentVerificationDuration: client.Histogram;

  constructor() {
    this.registry = new client.Registry();
    
    // Default metrics (CPU, memory, etc.)
    client.collectDefaultMetrics({ register: this.registry });

    // Custom metrics
    this.requestsTotal = new client.Counter({
      name: 'x402_requests_total',
      help: 'Total number of API requests',
      labelNames: ['method', 'route', 'status'],
      registers: [this.registry]
    });

    this.paymentsTotal = new client.Counter({
      name: 'x402_payments_total',
      help: 'Total number of payments received',
      labelNames: ['network', 'token'],
      registers: [this.registry]
    });

    this.revenueTotal = new client.Counter({
      name: 'x402_revenue_total',
      help: 'Total revenue in USD',
      labelNames: ['network', 'token'],
      registers: [this.registry]
    });

    this.errorsTotal = new client.Counter({
      name: 'x402_errors_total',
      help: 'Total number of errors',
      labelNames: ['type', 'code'],
      registers: [this.registry]
    });

    this.activeConnections = new client.Gauge({
      name: 'x402_active_connections',
      help: 'Number of active connections',
      registers: [this.registry]
    });

    this.creditsBalance = new client.Gauge({
      name: 'x402_credits_balance',
      help: 'Total credits balance across all users',
      registers: [this.registry]
    });

    this.requestDuration = new client.Histogram({
      name: 'x402_request_duration_seconds',
      help: 'Request duration in seconds',
      labelNames: ['method', 'route'],
      buckets: [0.01, 0.05, 0.1, 0.5, 1, 2, 5],
      registers: [this.registry]
    });

    this.paymentVerificationDuration = new client.Histogram({
      name: 'x402_payment_verification_duration_seconds',
      help: 'Payment verification duration in seconds',
      labelNames: ['network'],
      buckets: [0.05, 0.1, 0.2, 0.5, 1, 2],
      registers: [this.registry]
    });
  }

  trackRequest(method: string, route: string, status: number, duration: number) {
    this.requestsTotal.inc({ method, route, status });
    this.requestDuration.observe({ method, route }, duration / 1000);
  }

  trackPayment(network: string, token: string, amount: number) {
    this.paymentsTotal.inc({ network, token });
    this.revenueTotal.inc({ network, token }, amount);
  }

  trackError(type: string, code: string) {
    this.errorsTotal.inc({ type, code });
  }

  setActiveConnections(count: number) {
    this.activeConnections.set(count);
  }

  setCreditsBalance(balance: number) {
    this.creditsBalance.set(balance);
  }

  trackPaymentVerification(network: string, duration: number) {
    this.paymentVerificationDuration.observe({ network }, duration / 1000);
  }

  getMetrics(): Promise<string> {
    return this.registry.metrics();
  }

  createMetricsEndpoint(): express.RequestHandler {
    return async (req, res) => {
      res.setHeader('Content-Type', this.registry.contentType);
      res.send(await this.getMetrics());
    };
  }
}

// Express middleware to track all requests
export function metricsMiddleware(collector: MetricsCollector) {
  return (req: express.Request, res: express.Response, next: express.NextFunction) => {
    const start = Date.now();

    res.on('finish', () => {
      const duration = Date.now() - start;
      collector.trackRequest(req.method, req.path, res.statusCode, duration);
    });

    next();
  };
}
```

---

### Task 12.2: Health Checks 🏥

**File:** `src/monitoring/health.ts`

```typescript
import { MultiChainPaymentVerifier } from '../gateway/multi-chain.js';
import { AnalyticsTracker } from '../dashboard/analytics.js';

export interface HealthStatus {
  status: 'healthy' | 'degraded' | 'unhealthy';
  timestamp: string;
  uptime: number;
  checks: {
    [key: string]: {
      status: 'pass' | 'warn' | 'fail';
      message?: string;
      duration?: number;
    };
  };
}

export class HealthChecker {
  private startTime: number;
  private paymentVerifier?: MultiChainPaymentVerifier;
  private analytics?: AnalyticsTracker;

  constructor(options?: {
    paymentVerifier?: MultiChainPaymentVerifier;
    analytics?: AnalyticsTracker;
  }) {
    this.startTime = Date.now();
    this.paymentVerifier = options?.paymentVerifier;
    this.analytics = options?.analytics;
  }

  async check(): Promise<HealthStatus> {
    const checks: HealthStatus['checks'] = {};

    // Check database connection
    const dbStart = Date.now();
    checks.database = await this.checkDatabase();
    checks.database.duration = Date.now() - dbStart;

    // Check RPC connections
    const rpcStart = Date.now();
    checks.rpc = await this.checkRPC();
    checks.rpc.duration = Date.now() - rpcStart;

    // Check analytics
    const analyticsStart = Date.now();
    checks.analytics = await this.checkAnalytics();
    checks.analytics.duration = Date.now() - analyticsStart;

    // Check disk space
    checks.disk = await this.checkDiskSpace();

    // Check memory
    checks.memory = this.checkMemory();

    // Determine overall status
    const hasFailures = Object.values(checks).some(c => c.status === 'fail');
    const hasWarnings = Object.values(checks).some(c => c.status === 'warn');

    return {
      status: hasFailures ? 'unhealthy' : hasWarnings ? 'degraded' : 'healthy',
      timestamp: new Date().toISOString(),
      uptime: Date.now() - this.startTime,
      checks
    };
  }

  private async checkDatabase(): Promise<{ status: 'pass' | 'warn' | 'fail'; message?: string }> {
    try {
      // Test database read/write
      // This is a placeholder - implement based on your DB
      return { status: 'pass' };
    } catch (error) {
      return { status: 'fail', message: String(error) };
    }
  }

  private async checkRPC(): Promise<{ status: 'pass' | 'warn' | 'fail'; message?: string }> {
    if (!this.paymentVerifier) {
      return { status: 'warn', message: 'Payment verifier not configured' };
    }

    try {
      // Try to get block number from Base
      const client = (this.paymentVerifier as any).clients.get('eip155:8453');
      const blockNumber = await client.getBlockNumber();
      
      if (blockNumber > 0) {
        return { status: 'pass' };
      }
      
      return { status: 'fail', message: 'Invalid block number' };
    } catch (error) {
      return { status: 'fail', message: String(error) };
    }
  }

  private async checkAnalytics(): Promise<{ status: 'pass' | 'warn' | 'fail'; message?: string }> {
    if (!this.analytics) {
      return { status: 'warn', message: 'Analytics not configured' };
    }

    try {
      await this.analytics.getEarningsSummary();
      return { status: 'pass' };
    } catch (error) {
      return { status: 'fail', message: String(error) };
    }
  }

  private async checkDiskSpace(): Promise<{ status: 'pass' | 'warn' | 'fail'; message?: string }> {
    try {
      const { execSync } = await import('child_process');
      const output = execSync('df -h /').toString();
      const lines = output.split('\n')[1];
      const usage = parseInt(lines?.match(/(\d+)%/)?.[1] || '0');

      if (usage > 90) {
        return { status: 'fail', message: `Disk usage at ${usage}%` };
      } else if (usage > 80) {
        return { status: 'warn', message: `Disk usage at ${usage}%` };
      }

      return { status: 'pass', message: `Disk usage at ${usage}%` };
    } catch (error) {
      return { status: 'warn', message: 'Could not check disk space' };
    }
  }

  private checkMemory(): { status: 'pass' | 'warn' | 'fail'; message?: string } {
    const used = process.memoryUsage();
    const heapUsedMB = used.heapUsed / 1024 / 1024;
    const heapTotalMB = used.heapTotal / 1024 / 1024;
    const usagePercent = (heapUsedMB / heapTotalMB) * 100;

    if (usagePercent > 90) {
      return { status: 'fail', message: `Memory usage at ${usagePercent.toFixed(1)}%` };
    } else if (usagePercent > 80) {
      return { status: 'warn', message: `Memory usage at ${usagePercent.toFixed(1)}%` };
    }

    return { status: 'pass', message: `Memory usage at ${usagePercent.toFixed(1)}%` };
  }
}

// Express endpoint
export function healthEndpoint(checker: HealthChecker) {
  return async (req: express.Request, res: express.Response) => {
    const health = await checker.check();
    
    const statusCode = 
      health.status === 'healthy' ? 200 :
      health.status === 'degraded' ? 200 :
      503;

    res.status(statusCode).json(health);
  };
}
```

---

### Task 12.3: Alerting System 🚨

**File:** `src/monitoring/alerts.ts`

```typescript
export interface AlertConfig {
  webhook?: string;
  email?: string;
  slack?: string;
  discord?: string;
}

export interface Alert {
  level: 'info' | 'warning' | 'critical';
  title: string;
  message: string;
  timestamp: Date;
  metadata?: any;
}

export class AlertManager {
  private config: AlertConfig;
  private recentAlerts: Alert[] = [];

  constructor(config: AlertConfig) {
    this.config = config;
  }

  async sendAlert(alert: Alert): Promise<void> {
    this.recentAlerts.push(alert);
    
    // Keep only last 100 alerts
    if (this.recentAlerts.length > 100) {
      this.recentAlerts.shift();
    }

    // Send to configured channels
    const promises: Promise<void>[] = [];

    if (this.config.webhook) {
      promises.push(this.sendWebhook(alert));
    }

    if (this.config.slack) {
      promises.push(this.sendSlack(alert));
    }

    if (this.config.discord) {
      promises.push(this.sendDiscord(alert));
    }

    await Promise.allSettled(promises);
  }

  private async sendWebhook(alert: Alert): Promise<void> {
    try {
      await fetch(this.config.webhook!, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(alert)
      });
    } catch (error) {
      console.error('Failed to send webhook alert:', error);
    }
  }

  private async sendSlack(alert: Alert): Promise<void> {
    const color = {
      info: '#36a64f',
      warning: '#ff9800',
      critical: '#ff0000'
    }[alert.level];

    try {
      await fetch(this.config.slack!, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          attachments: [{
            color,
            title: alert.title,
            text: alert.message,
            footer: 'x402-deploy',
            ts: Math.floor(alert.timestamp.getTime() / 1000)
          }]
        })
      });
    } catch (error) {
      console.error('Failed to send Slack alert:', error);
    }
  }

  private async sendDiscord(alert: Alert): Promise<void> {
    const color = {
      info: 0x36a64f,
      warning: 0xff9800,
      critical: 0xff0000
    }[alert.level];

    try {
      await fetch(this.config.discord!, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          embeds: [{
            title: alert.title,
            description: alert.message,
            color,
            timestamp: alert.timestamp.toISOString()
          }]
        })
      });
    } catch (error) {
      console.error('Failed to send Discord alert:', error);
    }
  }

  // Pre-configured alert types
  async alertPaymentFailed(error: string): Promise<void> {
    await this.sendAlert({
      level: 'warning',
      title: 'Payment Verification Failed',
      message: `Payment verification failed: ${error}`,
      timestamp: new Date()
    });
  }

  async alertHighErrorRate(rate: number): Promise<void> {
    await this.sendAlert({
      level: 'critical',
      title: 'High Error Rate Detected',
      message: `Error rate is at ${rate.toFixed(1)}%`,
      timestamp: new Date()
    });
  }

  async alertLowDiskSpace(percent: number): Promise<void> {
    await this.sendAlert({
      level: 'warning',
      title: 'Low Disk Space',
      message: `Disk usage at ${percent}%`,
      timestamp: new Date()
    });
  }

  async alertDeploymentSuccess(url: string): Promise<void> {
    await this.sendAlert({
      level: 'info',
      title: 'Deployment Successful',
      message: `Successfully deployed to ${url}`,
      timestamp: new Date()
    });
  }
}
```

---

## Success Criteria

**Agent 11 Complete When:**
- ✅ Multi-chain support for Base, Arbitrum, Polygon, Ethereum
- ✅ Subscription model working (monthly/yearly)
- ✅ Credits system functional
- ✅ All payment types integrated with existing middleware

**Agent 12 Complete When:**
- ✅ Prometheus metrics exported on `/metrics`
- ✅ Health checks on `/health` with all checks
- ✅ Alerts sent to Slack/Discord/webhooks
- ✅ Grafana dashboard template included

---

**These features would make x402-deploy enterprise-ready! 🚀**
