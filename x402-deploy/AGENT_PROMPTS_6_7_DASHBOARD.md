# Agent 6 & 7: Dashboard Backend & Frontend

> Build the earnings dashboard that makes x402-deploy addictive

---

## Agent 6: Dashboard Backend API

**Goal:** Build the analytics API that powers the earnings dashboard

### Task 6.1: Analytics Tracker 📊

**File:** `src/dashboard/analytics.ts`

Track every payment and API call:

```typescript
import { createPublicClient, http, parseUnits, formatUnits } from 'viem';
import { base } from 'viem/chains';
import fs from 'fs/promises';
import path from 'path';

export interface PaymentEvent {
  timestamp: Date;
  amount: bigint;
  token: string;
  from: string;
  to: string;
  route: string;
  method: string;
  network: string;
  txHash?: string;
}

export interface CallStats {
  route: string;
  method: string;
  count: number;
  revenue: bigint;
  avgLatency: number;
  errorRate: number;
}

export interface TimeSeriesPoint {
  timestamp: Date;
  calls: number;
  revenue: bigint;
  uniquePayers: number;
}

export class AnalyticsTracker {
  private events: PaymentEvent[] = [];
  private dataDir: string;
  private client: ReturnType<typeof createPublicClient>;

  constructor(dataDir: string = '.x402-analytics') {
    this.dataDir = dataDir;
    this.client = createPublicClient({
      chain: base,
      transport: http()
    });
    this.loadEvents();
  }

  async trackPayment(event: Omit<PaymentEvent, 'timestamp'>): Promise<void> {
    const fullEvent: PaymentEvent = {
      ...event,
      timestamp: new Date()
    };

    this.events.push(fullEvent);
    await this.saveEvents();

    // Trigger webhooks
    await this.triggerWebhooks(fullEvent);
  }

  async getEarningsSummary(period: 'today' | 'week' | 'month' | 'all' = 'all'): Promise<{
    totalRevenue: string;
    totalCalls: number;
    uniquePayers: number;
    topRoutes: Array<{ route: string; revenue: string; calls: number }>;
  }> {
    const filteredEvents = this.filterByPeriod(this.events, period);

    const totalRevenue = filteredEvents.reduce(
      (sum, event) => sum + event.amount,
      0n
    );

    const uniquePayers = new Set(filteredEvents.map(e => e.from)).size;

    // Group by route
    const routeStats = new Map<string, { revenue: bigint; calls: number }>();
    for (const event of filteredEvents) {
      const key = `${event.method} ${event.route}`;
      const existing = routeStats.get(key) || { revenue: 0n, calls: 0 };
      routeStats.set(key, {
        revenue: existing.revenue + event.amount,
        calls: existing.calls + 1
      });
    }

    const topRoutes = Array.from(routeStats.entries())
      .sort((a, b) => Number(b[1].revenue - a[1].revenue))
      .slice(0, 10)
      .map(([route, stats]) => ({
        route,
        revenue: formatUnits(stats.revenue, 6), // USDC has 6 decimals
        calls: stats.calls
      }));

    return {
      totalRevenue: formatUnits(totalRevenue, 6),
      totalCalls: filteredEvents.length,
      uniquePayers,
      topRoutes
    };
  }

  async getTimeSeries(
    period: 'hour' | 'day' | 'week',
    limit: number = 24
  ): Promise<TimeSeriesPoint[]> {
    const now = new Date();
    const points: TimeSeriesPoint[] = [];
    const interval = period === 'hour' ? 3600000 : period === 'day' ? 86400000 : 604800000;

    for (let i = limit - 1; i >= 0; i--) {
      const timestamp = new Date(now.getTime() - i * interval);
      const nextTimestamp = new Date(timestamp.getTime() + interval);

      const eventsInPeriod = this.events.filter(
        e => e.timestamp >= timestamp && e.timestamp < nextTimestamp
      );

      points.push({
        timestamp,
        calls: eventsInPeriod.length,
        revenue: eventsInPeriod.reduce((sum, e) => sum + e.amount, 0n),
        uniquePayers: new Set(eventsInPeriod.map(e => e.from)).size
      });
    }

    return points;
  }

  async getRouteStats(): Promise<CallStats[]> {
    const routeMap = new Map<string, {
      count: number;
      revenue: bigint;
      latencies: number[];
      errors: number;
    }>();

    for (const event of this.events) {
      const key = `${event.method} ${event.route}`;
      const existing = routeMap.get(key) || {
        count: 0,
        revenue: 0n,
        latencies: [],
        errors: 0
      };

      routeMap.set(key, {
        count: existing.count + 1,
        revenue: existing.revenue + event.amount,
        latencies: existing.latencies,
        errors: existing.errors
      });
    }

    return Array.from(routeMap.entries()).map(([key, stats]) => {
      const [method, ...routeParts] = key.split(' ');
      return {
        route: routeParts.join(' '),
        method,
        count: stats.count,
        revenue: stats.revenue,
        avgLatency: stats.latencies.length > 0
          ? stats.latencies.reduce((a, b) => a + b, 0) / stats.latencies.length
          : 0,
        errorRate: stats.count > 0 ? stats.errors / stats.count : 0
      };
    });
  }

  private filterByPeriod(events: PaymentEvent[], period: string): PaymentEvent[] {
    const now = new Date();
    let cutoff: Date;

    switch (period) {
      case 'today':
        cutoff = new Date(now.setHours(0, 0, 0, 0));
        break;
      case 'week':
        cutoff = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
        break;
      case 'month':
        cutoff = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
        break;
      default:
        return events;
    }

    return events.filter(e => e.timestamp >= cutoff);
  }

  private async loadEvents(): Promise<void> {
    try {
      await fs.mkdir(this.dataDir, { recursive: true });
      const data = await fs.readFile(path.join(this.dataDir, 'events.json'), 'utf-8');
      const parsed = JSON.parse(data);
      this.events = parsed.map((e: any) => ({
        ...e,
        timestamp: new Date(e.timestamp),
        amount: BigInt(e.amount)
      }));
    } catch {
      // No events yet
    }
  }

  private async saveEvents(): Promise<void> {
    const serialized = this.events.map(e => ({
      ...e,
      timestamp: e.timestamp.toISOString(),
      amount: e.amount.toString()
    }));
    await fs.writeFile(
      path.join(this.dataDir, 'events.json'),
      JSON.stringify(serialized, null, 2)
    );
  }

  private async triggerWebhooks(event: PaymentEvent): Promise<void> {
    // Load config to get webhook URLs
    const configPath = path.join(process.cwd(), 'x402.config.json');
    try {
      const configData = await fs.readFile(configPath, 'utf-8');
      const config = JSON.parse(configData);
      
      if (config.dashboard?.webhooks) {
        for (const webhook of config.dashboard.webhooks) {
          if (webhook.events.includes('payment.received')) {
            await fetch(webhook.url, {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json',
                'X-x402-Signature': await this.signWebhook(event, webhook.secret)
              },
              body: JSON.stringify({
                event: 'payment.received',
                data: {
                  ...event,
                  timestamp: event.timestamp.toISOString(),
                  amount: event.amount.toString()
                }
              })
            }).catch(console.error);
          }
        }
      }
    } catch {
      // No config or webhooks
    }
  }

  private async signWebhook(payload: any, secret: string): Promise<string> {
    const encoder = new TextEncoder();
    const data = encoder.encode(JSON.stringify(payload) + secret);
    const hashBuffer = await crypto.subtle.digest('SHA-256', data);
    return Array.from(new Uint8Array(hashBuffer))
      .map(b => b.toString(16).padStart(2, '0'))
      .join('');
  }
}
```

---

### Task 6.2: Dashboard API Server 🖥️

**File:** `src/dashboard/api.ts`

Express server for dashboard endpoints:

```typescript
import express from 'express';
import { AnalyticsTracker } from './analytics.js';
import { loadConfig } from '../utils/config.js';
import { createPublicClient, http, formatUnits } from 'viem';
import { base } from 'viem/chains';

export interface DashboardAPIOptions {
  port?: number;
  analytics: AnalyticsTracker;
}

export function createDashboardAPI(options: DashboardAPIOptions): express.Application {
  const { port = 3402, analytics } = options;
  const app = express();

  app.use(express.json());

  // CORS for local dashboard
  app.use((req, res, next) => {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');
    next();
  });

  // GET /api/earnings/summary
  app.get('/api/earnings/summary', async (req, res) => {
    try {
      const period = req.query.period as any || 'all';
      const summary = await analytics.getEarningsSummary(period);
      res.json(summary);
    } catch (error) {
      res.status(500).json({ error: String(error) });
    }
  });

  // GET /api/earnings/timeseries
  app.get('/api/earnings/timeseries', async (req, res) => {
    try {
      const period = (req.query.period as any) || 'hour';
      const limit = parseInt(req.query.limit as string) || 24;
      const data = await analytics.getTimeSeries(period, limit);
      
      res.json({
        data: data.map(point => ({
          timestamp: point.timestamp.toISOString(),
          calls: point.calls,
          revenue: formatUnits(point.revenue, 6),
          uniquePayers: point.uniquePayers
        }))
      });
    } catch (error) {
      res.status(500).json({ error: String(error) });
    }
  });

  // GET /api/routes/stats
  app.get('/api/routes/stats', async (req, res) => {
    try {
      const stats = await analytics.getRouteStats();
      res.json({
        routes: stats.map(stat => ({
          route: stat.route,
          method: stat.method,
          count: stat.count,
          revenue: formatUnits(stat.revenue, 6),
          avgLatency: Math.round(stat.avgLatency),
          errorRate: (stat.errorRate * 100).toFixed(2) + '%'
        }))
      });
    } catch (error) {
      res.status(500).json({ error: String(error) });
    }
  });

  // GET /api/wallet/balance
  app.get('/api/wallet/balance', async (req, res) => {
    try {
      const config = loadConfig();
      const client = createPublicClient({
        chain: base,
        transport: http()
      });

      // USDC on Base
      const USDC_ADDRESS = '0x833589fCD6eDb6E08f4c7C32D4f71b54bdA02913';
      
      const balance = await client.readContract({
        address: USDC_ADDRESS,
        abi: [{
          name: 'balanceOf',
          type: 'function',
          stateMutability: 'view',
          inputs: [{ name: 'account', type: 'address' }],
          outputs: [{ name: '', type: 'uint256' }]
        }],
        functionName: 'balanceOf',
        args: [config.payment.wallet as `0x${string}`]
      });

      res.json({
        balance: formatUnits(balance as bigint, 6),
        token: 'USDC',
        network: 'Base'
      });
    } catch (error) {
      res.status(500).json({ error: String(error) });
    }
  });

  // GET /api/status
  app.get('/api/status', async (req, res) => {
    try {
      const config = loadConfig();
      const summary = await analytics.getEarningsSummary('all');

      res.json({
        status: 'running',
        config: {
          name: config.name,
          wallet: config.payment.wallet,
          network: config.payment.network
        },
        stats: summary
      });
    } catch (error) {
      res.status(500).json({ error: String(error) });
    }
  });

  // SSE endpoint for real-time updates
  app.get('/api/events/stream', (req, res) => {
    res.setHeader('Content-Type', 'text/event-stream');
    res.setHeader('Cache-Control', 'no-cache');
    res.setHeader('Connection', 'keep-alive');

    // Send initial data
    analytics.getEarningsSummary('all').then(summary => {
      res.write(`data: ${JSON.stringify({ type: 'summary', data: summary })}\n\n`);
    });

    // Keep connection alive
    const heartbeat = setInterval(() => {
      res.write(`: heartbeat\n\n`);
    }, 30000);

    req.on('close', () => {
      clearInterval(heartbeat);
    });
  });

  return app;
}

export async function startDashboardAPI(options: DashboardAPIOptions): Promise<void> {
  const app = createDashboardAPI(options);
  const { port = 3402 } = options;

  app.listen(port, () => {
    console.log(`Dashboard API running on http://localhost:${port}`);
  });
}
```

---

### Task 6.3: Export/Report Generator 📄

**File:** `src/dashboard/export.ts`

Generate CSV and JSON reports:

```typescript
import { AnalyticsTracker } from './analytics.js';
import fs from 'fs/promises';
import path from 'path';

export interface ExportOptions {
  format: 'csv' | 'json';
  period?: 'today' | 'week' | 'month' | 'all';
  outputPath?: string;
}

export async function exportEarnings(
  analytics: AnalyticsTracker,
  options: ExportOptions
): Promise<string> {
  const { format, period = 'all', outputPath } = options;

  const summary = await analytics.getEarningsSummary(period);
  const routeStats = await analytics.getRouteStats();
  const timeSeries = await analytics.getTimeSeries('day', 30);

  let content: string;
  let filename: string;

  if (format === 'csv') {
    filename = outputPath || `x402-earnings-${period}-${Date.now()}.csv`;
    content = generateCSV(summary, routeStats, timeSeries);
  } else {
    filename = outputPath || `x402-earnings-${period}-${Date.now()}.json`;
    content = JSON.stringify({
      generated: new Date().toISOString(),
      period,
      summary,
      routeStats,
      timeSeries
    }, null, 2);
  }

  await fs.writeFile(filename, content);
  return filename;
}

function generateCSV(summary: any, routeStats: any[], timeSeries: any[]): string {
  let csv = 'x402 Earnings Report\n\n';
  
  // Summary
  csv += 'Summary\n';
  csv += 'Total Revenue,Total Calls,Unique Payers\n';
  csv += `$${summary.totalRevenue},${summary.totalCalls},${summary.uniquePayers}\n\n`;

  // Route stats
  csv += 'Route Statistics\n';
  csv += 'Route,Method,Calls,Revenue,Avg Latency,Error Rate\n';
  for (const stat of routeStats) {
    csv += `${stat.route},${stat.method},${stat.count},$${stat.revenue},${stat.avgLatency}ms,${stat.errorRate}\n`;
  }

  csv += '\n';

  // Time series
  csv += 'Daily Statistics\n';
  csv += 'Date,Calls,Revenue,Unique Payers\n';
  for (const point of timeSeries) {
    const date = new Date(point.timestamp).toISOString().split('T')[0];
    csv += `${date},${point.calls},$${point.revenue},${point.uniquePayers}\n`;
  }

  return csv;
}
```

---

## Agent 7: Dashboard Frontend (CLI)

**Goal:** Build a beautiful terminal dashboard with real-time updates

### Task 7.1: Terminal Dashboard UI 🎨

**File:** `src/cli/commands/dashboard.ts`

Beautiful terminal dashboard with live updates:

```typescript
import blessed from 'blessed';
import contrib from 'blessed-contrib';
import chalk from 'chalk';
import gradient from 'gradient-string';
import { AnalyticsTracker } from '../../dashboard/analytics.js';
import { loadConfig } from '../../utils/config.js';
import { formatUnits } from 'viem';

export async function dashboardCommand(): Promise<void> {
  const analytics = new AnalyticsTracker();
  const config = loadConfig();

  // Create screen
  const screen = blessed.screen({
    smartCSR: true,
    title: 'x402 Dashboard'
  });

  // Create grid layout
  const grid = new contrib.grid({ rows: 12, cols: 12, screen });

  // Header
  const header = grid.set(0, 0, 1, 12, blessed.box, {
    content: gradient.pastel.multiline('━'.repeat(process.stdout.columns)),
    tags: true
  });

  // Earnings summary box
  const summaryBox = grid.set(1, 0, 3, 6, blessed.box, {
    label: ' 💰 Earnings Summary ',
    border: { type: 'line', fg: 'cyan' },
    style: {
      border: { fg: 'cyan' }
    }
  });

  // Wallet balance box
  const walletBox = grid.set(1, 6, 3, 6, blessed.box, {
    label: ' 👛 Wallet ',
    border: { type: 'line', fg: 'green' },
    style: {
      border: { fg: 'green' }
    }
  });

  // Revenue chart
  const revenueChart = grid.set(4, 0, 4, 12, contrib.line, {
    label: ' 📈 Revenue (Last 24h) ',
    style: {
      line: 'yellow',
      text: 'green',
      baseline: 'white'
    },
    showLegend: true,
    legend: { width: 12 }
  });

  // Top routes table
  const routesTable = grid.set(8, 0, 4, 6, contrib.table, {
    label: ' 🔥 Top Routes ',
    keys: true,
    fg: 'white',
    selectedFg: 'white',
    selectedBg: 'blue',
    interactive: false,
    columnSpacing: 3,
    columnWidth: [30, 12, 10]
  });

  // Activity log
  const activityLog = grid.set(8, 6, 4, 6, contrib.log, {
    label: ' 📋 Recent Activity ',
    fg: 'green',
    selectedFg: 'green'
  });

  // Update data function
  async function updateDashboard() {
    try {
      // Get earnings summary
      const todaySummary = await analytics.getEarningsSummary('today');
      const weekSummary = await analytics.getEarningsSummary('week');
      const allTimeSummary = await analytics.getEarningsSummary('all');

      // Update summary box
      summaryBox.setContent(`
  ${chalk.bold('Today:')}     ${chalk.green('$' + todaySummary.totalRevenue)} (${todaySummary.totalCalls} calls)
  ${chalk.bold('This Week:')} ${chalk.green('$' + weekSummary.totalRevenue)} (${weekSummary.totalCalls} calls)
  ${chalk.bold('All Time:')}  ${chalk.green('$' + allTimeSummary.totalRevenue)} (${allTimeSummary.totalCalls} calls)
  
  ${chalk.bold('Unique Payers:')} ${todaySummary.uniquePayers} today, ${allTimeSummary.uniquePayers} total
      `);

      // Update wallet box
      walletBox.setContent(`
  ${chalk.bold('Address:')}
  ${chalk.cyan(config.payment.wallet.slice(0, 20) + '...')}
  
  ${chalk.bold('Network:')} ${config.payment.network}
  ${chalk.bold('Status:')} ${chalk.green('● Online')}
      `);

      // Update revenue chart
      const timeSeries = await analytics.getTimeSeries('hour', 24);
      const chartData = {
        title: 'Revenue',
        x: timeSeries.map((_, i) => `${i}h`),
        y: timeSeries.map(point => parseFloat(formatUnits(point.revenue, 6)))
      };
      revenueChart.setData([chartData]);

      // Update routes table
      const routeStats = await analytics.getRouteStats();
      const topRoutes = routeStats
        .sort((a, b) => Number(b.revenue - a.revenue))
        .slice(0, 10);
      
      routesTable.setData({
        headers: ['Route', 'Calls', 'Revenue'],
        data: topRoutes.map(stat => [
          `${stat.method} ${stat.route}`.slice(0, 28),
          stat.count.toString(),
          '$' + formatUnits(stat.revenue, 6)
        ])
      });

      screen.render();
    } catch (error) {
      activityLog.log(chalk.red('Error updating dashboard: ' + error));
    }
  }

  // Initial update
  await updateDashboard();
  activityLog.log(chalk.green('Dashboard started'));
  activityLog.log(`Watching wallet: ${config.payment.wallet.slice(0, 10)}...`);

  // Update every 5 seconds
  const interval = setInterval(updateDashboard, 5000);

  // Key bindings
  screen.key(['escape', 'q', 'C-c'], () => {
    clearInterval(interval);
    process.exit(0);
  });

  screen.key(['r'], () => {
    activityLog.log(chalk.blue('Refreshing...'));
    updateDashboard();
  });

  screen.key(['e'], async () => {
    activityLog.log(chalk.blue('Exporting to CSV...'));
    const { exportEarnings } = await import('../../dashboard/export.js');
    const filename = await exportEarnings(analytics, { format: 'csv' });
    activityLog.log(chalk.green(`Exported to: ${filename}`));
  });

  // Help text at bottom
  const helpBar = blessed.box({
    parent: screen,
    bottom: 0,
    left: 0,
    width: '100%',
    height: 1,
    content: chalk.dim(' [q] Quit  [r] Refresh  [e] Export  '),
    style: {
      bg: 'blue',
      fg: 'white'
    }
  });

  screen.render();
}
```

---

### Task 7.2: Simple CLI Dashboard Alternative 📊

**File:** `src/cli/commands/dashboard-simple.ts`

For environments without full terminal support:

```typescript
import chalk from 'chalk';
import boxen from 'boxen';
import Table from 'cli-table3';
import ora from 'ora';
import { AnalyticsTracker } from '../../dashboard/analytics.js';
import { loadConfig } from '../../utils/config.js';
import { formatUnits } from 'viem';

export async function dashboardSimpleCommand(): Promise<void> {
  const spinner = ora('Loading dashboard...').start();
  
  const analytics = new AnalyticsTracker();
  const config = loadConfig();

  try {
    // Get data
    const todaySummary = await analytics.getEarningsSummary('today');
    const weekSummary = await analytics.getEarningsSummary('week');
    const allTimeSummary = await analytics.getEarningsSummary('all');
    const routeStats = await analytics.getRouteStats();

    spinner.stop();

    // Header
    console.log('\n');
    console.log(boxen(
      chalk.bold.cyan('💰 x402 Earnings Dashboard'),
      { padding: 1, margin: 1, borderStyle: 'round', borderColor: 'cyan' }
    ));

    // Summary section
    const summaryTable = new Table({
      head: ['Period', 'Revenue', 'Calls', 'Payers'],
      colWidths: [15, 15, 10, 10],
      style: {
        head: ['cyan'],
        border: ['gray']
      }
    });

    summaryTable.push(
      ['Today', chalk.green(`$${todaySummary.totalRevenue}`), todaySummary.totalCalls, todaySummary.uniquePayers],
      ['This Week', chalk.green(`$${weekSummary.totalRevenue}`), weekSummary.totalCalls, weekSummary.uniquePayers],
      ['All Time', chalk.bold.green(`$${allTimeSummary.totalRevenue}`), allTimeSummary.totalCalls, allTimeSummary.uniquePayers]
    );

    console.log(summaryTable.toString());
    console.log('\n');

    // Top routes
    if (routeStats.length > 0) {
      const routesTable = new Table({
        head: ['Route', 'Method', 'Calls', 'Revenue', 'Avg Latency'],
        colWidths: [30, 10, 10, 15, 15],
        style: {
          head: ['yellow'],
          border: ['gray']
        }
      });

      const topRoutes = routeStats
        .sort((a, b) => Number(b.revenue - a.revenue))
        .slice(0, 10);

      for (const stat of topRoutes) {
        routesTable.push([
          stat.route,
          chalk.cyan(stat.method),
          stat.count,
          chalk.green(`$${formatUnits(stat.revenue, 6)}`),
          `${Math.round(stat.avgLatency)}ms`
        ]);
      }

      console.log(chalk.bold('🔥 Top Routes\n'));
      console.log(routesTable.toString());
      console.log('\n');
    }

    // Wallet info
    console.log(boxen(
      `${chalk.bold('Wallet:')} ${chalk.cyan(config.payment.wallet)}\n` +
      `${chalk.bold('Network:')} ${config.payment.network}\n` +
      `${chalk.bold('Status:')} ${chalk.green('● Online')}`,
      { padding: 1, borderStyle: 'round', borderColor: 'green', title: '👛 Wallet Info' }
    ));

    console.log('\n');
    console.log(chalk.dim('💡 Tip: Use "x402-deploy dashboard" for live updates'));
    console.log(chalk.dim('📊 Export data: "x402-deploy export --format csv"'));
    console.log('\n');

  } catch (error) {
    spinner.fail('Failed to load dashboard');
    console.error(chalk.red('Error:'), error);
    process.exit(1);
  }
}
```

---

### Task 7.3: Web Dashboard (Optional) 🌐

**File:** `src/dashboard/web/index.html`

Simple HTML dashboard for web browsers:

```html
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>x402 Dashboard</title>
  <script src="https://cdn.jsdelivr.net/npm/chart.js@4.4.0/dist/chart.umd.js"></script>
  <style>
    * { margin: 0; padding: 0; box-sizing: border-box; }
    body {
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
      color: #fff;
      padding: 20px;
    }
    .container { max-width: 1200px; margin: 0 auto; }
    .header {
      text-align: center;
      margin-bottom: 40px;
    }
    .header h1 {
      font-size: 48px;
      margin-bottom: 10px;
    }
    .stats {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
      gap: 20px;
      margin-bottom: 40px;
    }
    .stat-card {
      background: rgba(255, 255, 255, 0.1);
      backdrop-filter: blur(10px);
      border-radius: 20px;
      padding: 30px;
      box-shadow: 0 8px 32px rgba(0, 0, 0, 0.1);
    }
    .stat-card h3 {
      font-size: 14px;
      text-transform: uppercase;
      letter-spacing: 2px;
      opacity: 0.8;
      margin-bottom: 10px;
    }
    .stat-card .value {
      font-size: 36px;
      font-weight: bold;
      margin-bottom: 5px;
    }
    .stat-card .subtitle {
      font-size: 14px;
      opacity: 0.7;
    }
    .chart-container {
      background: rgba(255, 255, 255, 0.1);
      backdrop-filter: blur(10px);
      border-radius: 20px;
      padding: 30px;
      margin-bottom: 20px;
    }
    .pulse {
      animation: pulse 2s infinite;
    }
    @keyframes pulse {
      0%, 100% { opacity: 1; }
      50% { opacity: 0.5; }
    }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <h1>💰 x402 Dashboard</h1>
      <p class="pulse">● Live</p>
    </div>

    <div class="stats">
      <div class="stat-card">
        <h3>Today</h3>
        <div class="value" id="today-revenue">$0</div>
        <div class="subtitle" id="today-calls">0 calls</div>
      </div>
      <div class="stat-card">
        <h3>This Week</h3>
        <div class="value" id="week-revenue">$0</div>
        <div class="subtitle" id="week-calls">0 calls</div>
      </div>
      <div class="stat-card">
        <h3>All Time</h3>
        <div class="value" id="total-revenue">$0</div>
        <div class="subtitle" id="total-calls">0 calls</div>
      </div>
      <div class="stat-card">
        <h3>Unique Payers</h3>
        <div class="value" id="unique-payers">0</div>
        <div class="subtitle">Total customers</div>
      </div>
    </div>

    <div class="chart-container">
      <canvas id="revenueChart"></canvas>
    </div>
  </div>

  <script>
    const API_URL = 'http://localhost:3402/api';

    // Fetch and update data
    async function updateDashboard() {
      try {
        // Fetch today's data
        const todayRes = await fetch(`${API_URL}/earnings/summary?period=today`);
        const today = await todayRes.json();
        document.getElementById('today-revenue').textContent = `$${today.totalRevenue}`;
        document.getElementById('today-calls').textContent = `${today.totalCalls} calls`;

        // Fetch week's data
        const weekRes = await fetch(`${API_URL}/earnings/summary?period=week`);
        const week = await weekRes.json();
        document.getElementById('week-revenue').textContent = `$${week.totalRevenue}`;
        document.getElementById('week-calls').textContent = `${week.totalCalls} calls`;

        // Fetch all-time data
        const allRes = await fetch(`${API_URL}/earnings/summary?period=all`);
        const all = await allRes.json();
        document.getElementById('total-revenue').textContent = `$${all.totalRevenue}`;
        document.getElementById('total-calls').textContent = `${all.totalCalls} calls`;
        document.getElementById('unique-payers').textContent = all.uniquePayers;

        // Fetch time series for chart
        const chartRes = await fetch(`${API_URL}/earnings/timeseries?period=hour&limit=24`);
        const chartData = await chartRes.json();
        
        updateChart(chartData.data);
      } catch (error) {
        console.error('Error updating dashboard:', error);
      }
    }

    // Initialize chart
    const ctx = document.getElementById('revenueChart').getContext('2d');
    let chart = new Chart(ctx, {
      type: 'line',
      data: {
        labels: [],
        datasets: [{
          label: 'Revenue ($)',
          data: [],
          borderColor: 'rgba(255, 206, 86, 1)',
          backgroundColor: 'rgba(255, 206, 86, 0.2)',
          tension: 0.4,
          fill: true
        }]
      },
      options: {
        responsive: true,
        plugins: {
          legend: { labels: { color: '#fff' } },
          title: {
            display: true,
            text: 'Revenue (Last 24 Hours)',
            color: '#fff',
            font: { size: 18 }
          }
        },
        scales: {
          y: {
            ticks: { color: '#fff' },
            grid: { color: 'rgba(255, 255, 255, 0.1)' }
          },
          x: {
            ticks: { color: '#fff' },
            grid: { color: 'rgba(255, 255, 255, 0.1)' }
          }
        }
      }
    });

    function updateChart(data) {
      chart.data.labels = data.map((d, i) => `${i}h ago`);
      chart.data.datasets[0].data = data.map(d => parseFloat(d.revenue));
      chart.update();
    }

    // Initial load and auto-refresh every 5 seconds
    updateDashboard();
    setInterval(updateDashboard, 5000);
  </script>
</body>
</html>
```

---

## Integration

Update main CLI to support dashboard commands:

**File:** `src/cli/index.ts`

```typescript
import { Command } from 'commander';
import { dashboardCommand } from './commands/dashboard.js';
import { dashboardSimpleCommand } from './commands/dashboard-simple.js';

const program = new Command();

program
  .command('dashboard')
  .description('Open live earnings dashboard')
  .option('--simple', 'Use simple text-based dashboard')
  .option('--web', 'Start web dashboard server')
  .option('--port <port>', 'Port for web dashboard', '3402')
  .action(async (options) => {
    if (options.web) {
      const { startDashboardAPI } = await import('../dashboard/api.js');
      const { AnalyticsTracker } = await import('../dashboard/analytics.js');
      const analytics = new AnalyticsTracker();
      await startDashboardAPI({ port: parseInt(options.port), analytics });
      console.log(`Web dashboard: http://localhost:${options.port}`);
    } else if (options.simple) {
      await dashboardSimpleCommand();
    } else {
      await dashboardCommand();
    }
  });
```

---

## Testing

```typescript
// tests/dashboard.test.ts
import { describe, it, expect, beforeEach } from 'vitest';
import { AnalyticsTracker } from '../src/dashboard/analytics.js';
import { mkdtemp } from 'fs/promises';
import { tmpdir } from 'os';
import { join } from 'path';

describe('Analytics Tracker', () => {
  let tracker: AnalyticsTracker;
  let tempDir: string;

  beforeEach(async () => {
    tempDir = await mkdtemp(join(tmpdir(), 'x402-test-'));
    tracker = new AnalyticsTracker(tempDir);
  });

  it('tracks payments', async () => {
    await tracker.trackPayment({
      amount: 1000000n, // 1 USDC
      token: 'USDC',
      from: '0xabc',
      to: '0xdef',
      route: '/api/trade',
      method: 'POST',
      network: 'eip155:8453'
    });

    const summary = await tracker.getEarningsSummary();
    expect(summary.totalCalls).toBe(1);
    expect(summary.totalRevenue).toBe('1.0');
  });

  it('calculates time series', async () => {
    const series = await tracker.getTimeSeries('hour', 24);
    expect(series).toHaveLength(24);
  });
});
```

---

## Success Criteria

**Agent 6 (Backend) Complete When:**
- ✅ Analytics tracker stores all payment events
- ✅ API returns earnings summary (today/week/all)
- ✅ Time series data for charts
- ✅ Route statistics with revenue breakdown
- ✅ SSE endpoint for real-time updates
- ✅ Webhook system triggers on payments
- ✅ Export to CSV/JSON works

**Agent 7 (Frontend) Complete When:**
- ✅ Blessed terminal dashboard renders beautifully
- ✅ Live updates every 5 seconds
- ✅ Charts show revenue over time
- ✅ Tables show top routes
- ✅ Simple CLI dashboard works everywhere
- ✅ Web dashboard loads in browser
- ✅ Keyboard shortcuts (q, r, e) work

Done! 💎
