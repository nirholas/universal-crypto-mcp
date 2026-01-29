

## 🔵 AGENT 5: Dashboard (Earnings UI & API)

### Context
You are building the earnings dashboard that shows developers their revenue from x402 payments. This includes both a Next.js UI and the supporting API.

### Your Workspace
```
/workspaces/universal-crypto-mcp/x402-deploy/src/dashboard/
```

### Detailed Instructions

```markdown
## AGENT 5: Earnings Dashboard Implementation

You are responsible for the dashboard module at `/x402-deploy/src/dashboard/`.

### YOUR RESPONSIBILITIES:
1. Dashboard API for earnings data
2. React/Next.js UI components (for embedded dashboard)
3. CLI dashboard output formatting
4. Webhook integration for real-time updates
5. Revenue analytics and projections

### DO NOT TOUCH:
- Other directories in /x402-deploy/src/
- /packages/ directory

### FILES TO CREATE:

1. `/x402-deploy/src/dashboard/index.ts` - Main exports
2. `/x402-deploy/src/dashboard/api.ts` - Dashboard API client
3. `/x402-deploy/src/dashboard/analytics.ts` - Analytics calculations
4. `/x402-deploy/src/dashboard/webhooks.ts` - Webhook handlers
5. `/x402-deploy/src/dashboard/formatters.ts` - CLI output formatters
6. `/x402-deploy/src/dashboard/types.ts` - Dashboard types

### IMPLEMENTATION DETAILS:

#### types.ts
```typescript
export interface PaymentRecord {
  id: string;
  timestamp: Date;
  payer: string;
  route: string;
  amount: string;
  token: string;
  network: string;
  transactionHash: string;
}

export interface EarningsSummary {
  totalRevenue: string;
  totalPayments: number;
  uniquePayers: number;
  period: "day" | "week" | "month" | "all";
}

export interface RouteStats {
  route: string;
  revenue: string;
  calls: number;
  avgPayment: string;
  percentage: number;
}

export interface DashboardData {
  summary: EarningsSummary;
  recentPayments: PaymentRecord[];
  topRoutes: RouteStats[];
  payerStats: {
    totalUnique: number;
    topPayers: { address: string; totalPaid: string; calls: number }[];
  };
  trends: {
    daily: { date: string; revenue: string; calls: number }[];
  };
}

export interface WebhookEvent {
  type: "payment.received" | "payment.settled" | "payment.failed";
  data: PaymentRecord;
  timestamp: Date;
}
```

#### api.ts
```typescript
import { DashboardData, EarningsSummary, PaymentRecord } from "./types.js";

export class DashboardAPI {
  private baseUrl: string;
  private apiKey?: string;
  
  constructor(config: { baseUrl?: string; apiKey?: string } = {}) {
    this.baseUrl = config.baseUrl || "https://api.x402.host/dashboard";
    this.apiKey = config.apiKey || process.env.X402_API_KEY;
  }
  
  async getEarnings(
    projectName: string,
    period: "day" | "week" | "month" | "all" = "week"
  ): Promise<EarningsSummary> {
    const response = await fetch(
      `${this.baseUrl}/projects/${projectName}/earnings?period=${period}`,
      {
        headers: this.getHeaders(),
      }
    );
    
    if (!response.ok) {
      throw new Error(`Failed to fetch earnings: ${response.statusText}`);
    }
    
    return response.json();
  }
  
  async getFullDashboard(projectName: string): Promise<DashboardData> {
    const response = await fetch(
      `${this.baseUrl}/projects/${projectName}/dashboard`,
      {
        headers: this.getHeaders(),
      }
    );
    
    if (!response.ok) {
      throw new Error(`Failed to fetch dashboard: ${response.statusText}`);
    }
    
    return response.json();
  }
  
  async getRecentPayments(
    projectName: string,
    limit: number = 10
  ): Promise<PaymentRecord[]> {
    const response = await fetch(
      `${this.baseUrl}/projects/${projectName}/payments?limit=${limit}`,
      {
        headers: this.getHeaders(),
      }
    );
    
    if (!response.ok) {
      throw new Error(`Failed to fetch payments: ${response.statusText}`);
    }
    
    return response.json();
  }
  
  private getHeaders(): HeadersInit {
    const headers: HeadersInit = {
      "Content-Type": "application/json",
    };
    
    if (this.apiKey) {
      headers["Authorization"] = `Bearer ${this.apiKey}`;
    }
    
    return headers;
  }
}
```

#### analytics.ts
```typescript
import { PaymentRecord, EarningsSummary, RouteStats } from "./types.js";

export function calculateSummary(
  payments: PaymentRecord[],
  period: "day" | "week" | "month" | "all"
): EarningsSummary {
  const now = new Date();
  const cutoff = getCutoffDate(now, period);
  
  const filtered = payments.filter(p => new Date(p.timestamp) >= cutoff);
  
  const totalRevenue = filtered.reduce(
    (sum, p) => sum + parseFloat(p.amount),
    0
  );
  
  const uniquePayers = new Set(filtered.map(p => p.payer)).size;
  
  return {
    totalRevenue: totalRevenue.toFixed(6),
    totalPayments: filtered.length,
    uniquePayers,
    period,
  };
}

export function calculateRouteStats(payments: PaymentRecord[]): RouteStats[] {
  const routeMap = new Map<string, { revenue: number; calls: number }>();
  
  for (const payment of payments) {
    const existing = routeMap.get(payment.route) || { revenue: 0, calls: 0 };
    routeMap.set(payment.route, {
      revenue: existing.revenue + parseFloat(payment.amount),
      calls: existing.calls + 1,
    });
  }
  
  const totalRevenue = Array.from(routeMap.values()).reduce(
    (sum, r) => sum + r.revenue,
    0
  );
  
  return Array.from(routeMap.entries())
    .map(([route, stats]) => ({
      route,
      revenue: stats.revenue.toFixed(6),
      calls: stats.calls,
      avgPayment: (stats.revenue / stats.calls).toFixed(6),
      percentage: (stats.revenue / totalRevenue) * 100,
    }))
    .sort((a, b) => parseFloat(b.revenue) - parseFloat(a.revenue));
}

function getCutoffDate(now: Date, period: string): Date {
  const cutoff = new Date(now);
  
  switch (period) {
    case "day":
      cutoff.setDate(cutoff.getDate() - 1);
      break;
    case "week":
      cutoff.setDate(cutoff.getDate() - 7);
      break;
    case "month":
      cutoff.setMonth(cutoff.getMonth() - 1);
      break;
    default:
      return new Date(0); // All time
  }
  
  return cutoff;
}

export function projectRevenue(
  currentRevenue: number,
  days: number,
  projectionDays: number
): number {
  const dailyAverage = currentRevenue / days;
  return dailyAverage * projectionDays;
}
```

#### formatters.ts
```typescript
import chalk from "chalk";
import { DashboardData, EarningsSummary, PaymentRecord } from "./types.js";

export function formatDashboardCLI(data: DashboardData): string {
  const lines: string[] = [];
  
  lines.push(chalk.bold("\n📊 Earnings Dashboard\n"));
  lines.push("═".repeat(50));
  
  // Summary
  lines.push(chalk.bold("\n💰 Revenue Summary\n"));
  lines.push(`  Today:      ${chalk.green("$" + data.summary.totalRevenue)}`);
  lines.push(`  Payments:   ${data.summary.totalPayments}`);
  lines.push(`  Payers:     ${data.summary.uniquePayers}`);
  
  // Top routes
  lines.push(chalk.bold("\n📈 Top Routes\n"));
  for (const route of data.topRoutes.slice(0, 5)) {
    const bar = "█".repeat(Math.ceil(route.percentage / 5));
    lines.push(
      `  ${route.route.padEnd(30)} ${chalk.cyan("$" + route.revenue)} (${route.calls} calls)`
    );
    lines.push(`  ${chalk.dim(bar)} ${route.percentage.toFixed(1)}%`);
  }
  
  // Recent payments
  lines.push(chalk.bold("\n🔔 Recent Payments\n"));
  for (const payment of data.recentPayments.slice(0, 5)) {
    const time = new Date(payment.timestamp).toLocaleTimeString();
    lines.push(
      `  ${chalk.dim(time)} ${chalk.cyan("$" + payment.amount)} from ${chalk.yellow(payment.payer.slice(0, 10))}...`
    );
  }
  
  lines.push("");
  return lines.join("\n");
}

export function formatEarningsJSON(data: DashboardData): string {
  return JSON.stringify(data, null, 2);
}

export function formatCompactSummary(summary: EarningsSummary): string {
  return [
    chalk.bold("📊 Quick Stats"),
    `Revenue: ${chalk.green("$" + summary.totalRevenue)}`,
    `Payments: ${summary.totalPayments}`,
    `Payers: ${summary.uniquePayers}`,
  ].join(" | ");
}
```

#### webhooks.ts
```typescript
import { WebhookEvent, PaymentRecord } from "./types.js";

export interface WebhookConfig {
  url: string;
  secret?: string;
  events?: ("payment.received" | "payment.settled" | "payment.failed")[];
}

export async function sendWebhook(
  config: WebhookConfig,
  event: WebhookEvent
): Promise<boolean> {
  try {
    const payload = JSON.stringify(event);
    
    const headers: HeadersInit = {
      "Content-Type": "application/json",
    };
    
    if (config.secret) {
      const signature = await signPayload(payload, config.secret);
      headers["X-Webhook-Signature"] = signature;
    }
    
    const response = await fetch(config.url, {
      method: "POST",
      headers,
      body: payload,
    });
    
    return response.ok;
  } catch (error) {
    console.error("Webhook delivery failed:", error);
    return false;
  }
}

async function signPayload(payload: string, secret: string): Promise<string> {
  const encoder = new TextEncoder();
  const key = await crypto.subtle.importKey(
    "raw",
    encoder.encode(secret),
    { name: "HMAC", hash: "SHA-256" },
    false,
    ["sign"]
  );
  
  const signature = await crypto.subtle.sign(
    "HMAC",
    key,
    encoder.encode(payload)
  );
  
  return Buffer.from(signature).toString("hex");
}

export function createPaymentEvent(
  type: WebhookEvent["type"],
  payment: PaymentRecord
): WebhookEvent {
  return {
    type,
    data: payment,
    timestamp: new Date(),
  };
}
```

### FINAL DELIVERABLES:
- Complete dashboard API client
- Analytics calculations
- CLI formatters with chalk styling
- Webhook integration
- Type definitions for all dashboard data
```

---

*Continued in Section 2...*
