/**
 * Analytics Command - Deep analytics and insights for your monetized API
 * Provides detailed breakdowns of revenue, usage patterns, and growth metrics
 */

import chalk from "chalk";
import ora from "ora";
import fs from "fs-extra";
import path from "path";
import { X402ConfigSchema } from "../../types/config.js";
import { DashboardAPI } from "../../dashboard/api.js";

interface AnalyticsOptions {
  period?: "day" | "week" | "month" | "all";
  route?: string;
  export?: "json" | "csv";
  top?: string;
}

interface RouteMetrics {
  route: string;
  calls: number;
  revenue: number;
  avgLatency: number;
  successRate: number;
  uniquePayers: number;
}

interface TimeSeriesPoint {
  timestamp: string;
  calls: number;
  revenue: number;
}

export async function analyticsCommand(options: AnalyticsOptions): Promise<void> {
  console.log(chalk.cyan(`
╔═══════════════════════════════════════════════════════════════╗
║   📊 x402 Analytics Dashboard                                 ║
╚═══════════════════════════════════════════════════════════════╝
  `));

  const configPath = path.join(process.cwd(), "x402.config.json");
  
  if (!await fs.pathExists(configPath)) {
    console.error(chalk.red("No x402.config.json found. Run 'x402-deploy init' first."));
    process.exit(1);
  }

  const spinner = ora("Loading configuration...").start();
  let config;
  try {
    const rawConfig = await fs.readJSON(configPath);
    config = X402ConfigSchema.parse(rawConfig);
    spinner.succeed("Configuration loaded");
  } catch (error) {
    spinner.fail("Failed to load configuration");
    console.error(chalk.red(`\n${error}\n`));
    process.exit(1);
  }

  const period = options.period || "week";
  const topCount = parseInt(options.top || "10", 10);

  // Fetch analytics data
  spinner.start("Fetching analytics data...");
  
  try {
    const api = new DashboardAPI();
    const dashboardData = await api.getFullDashboard(config.name);
    spinner.succeed("Analytics data loaded");

    // Display summary metrics
    console.log(chalk.bold("\n📈 Summary Metrics\n"));
    
    const summary = dashboardData.summary;
    const box = createMetricsBox([
      { label: "Total Revenue", value: `$${parseFloat(summary.totalRevenue).toFixed(2)}`, color: "green" },
      { label: "Total Payments", value: summary.totalPayments.toLocaleString(), color: "cyan" },
      { label: "Unique Payers", value: summary.uniquePayers.toLocaleString(), color: "yellow" },
      { label: "Avg Payment", value: `$${(parseFloat(summary.totalRevenue) / (summary.totalPayments || 1)).toFixed(4)}`, color: "magenta" },
    ]);
    console.log(box);

    // Display route breakdown
    if (dashboardData.topRoutes && dashboardData.topRoutes.length > 0) {
      console.log(chalk.bold("\n🛣️  Top Routes by Revenue\n"));
      displayRouteTable(dashboardData.topRoutes.slice(0, topCount));
    }

    // Display time series chart
    if (dashboardData.trends?.daily && dashboardData.trends.daily.length > 0) {
      console.log(chalk.bold("\n📉 Revenue Trend (Last 7 Days)\n"));
      displaySparklineChart(dashboardData.trends.daily);
    }

    // Display payer insights
    if (dashboardData.payerStats?.topPayers && dashboardData.payerStats.topPayers.length > 0) {
      console.log(chalk.bold("\n👥 Top Payers\n"));
      displayPayerTable(dashboardData.payerStats.topPayers.slice(0, 5));
    }

    // Export if requested
    if (options.export === "json") {
      const exportPath = path.join(process.cwd(), `analytics-${Date.now()}.json`);
      await fs.writeJSON(exportPath, dashboardData, { spaces: 2 });
      console.log(chalk.green(`\n✅ Exported to ${exportPath}\n`));
    } else if (options.export === "csv") {
      const exportPath = path.join(process.cwd(), `analytics-${Date.now()}.csv`);
      const csv = convertToCSV(dashboardData.topRoutes || []);
      await fs.writeFile(exportPath, csv);
      console.log(chalk.green(`\n✅ Exported to ${exportPath}\n`));
    }

    // Growth insights
    console.log(chalk.bold("\n💡 Insights\n"));
    displayInsights(dashboardData);

  } catch (error) {
    spinner.fail("Failed to fetch analytics");
    console.log(chalk.yellow("\nCould not fetch live analytics. Showing local data...\n"));
    
    // Fall back to local analytics
    await displayLocalAnalytics(config.name);
  }
}

function createMetricsBox(metrics: Array<{ label: string; value: string; color: string }>): string {
  const colWidth = 20;
  const lines: string[] = [];
  
  // Top border
  lines.push("┌" + metrics.map(() => "─".repeat(colWidth)).join("┬") + "┐");
  
  // Labels
  lines.push("│" + metrics.map(m => 
    chalk.dim(m.label.padEnd(colWidth - 1)) + "│"
  ).join(""));
  
  // Values
  lines.push("│" + metrics.map(m => {
    const colorFn = (chalk as any)[m.color] || chalk.white;
    return colorFn(m.value.padEnd(colWidth - 1)) + "│";
  }).join(""));
  
  // Bottom border
  lines.push("└" + metrics.map(() => "─".repeat(colWidth)).join("┴") + "┘");
  
  return lines.join("\n");
}

function displayRouteTable(routes: any[]): void {
  const headers = ["Route", "Calls", "Revenue", "Avg", "%"];
  const colWidths = [30, 10, 12, 10, 8];
  
  // Header
  console.log(
    chalk.dim("  ") +
    headers.map((h, i) => chalk.bold(h.padEnd(colWidths[i]))).join("")
  );
  console.log(chalk.dim("  " + "─".repeat(colWidths.reduce((a, b) => a + b, 0))));
  
  // Rows
  for (const route of routes) {
    const percentage = parseFloat(route.percentage || 0).toFixed(1);
    const bar = createProgressBar(parseFloat(percentage), 6);
    
    console.log(
      "  " +
      chalk.white(truncate(route.route, colWidths[0] - 2).padEnd(colWidths[0])) +
      chalk.cyan(route.calls.toString().padEnd(colWidths[1])) +
      chalk.green(("$" + parseFloat(route.revenue).toFixed(2)).padEnd(colWidths[2])) +
      chalk.dim(("$" + parseFloat(route.avgPayment).toFixed(4)).padEnd(colWidths[3])) +
      bar
    );
  }
}

function displaySparklineChart(data: any[]): void {
  const bars = ["▁", "▂", "▃", "▄", "▅", "▆", "▇", "█"];
  const revenues = data.map(d => parseFloat(d.revenue || 0));
  const max = Math.max(...revenues, 0.001);
  
  const chart = revenues.map(r => {
    const index = Math.floor((r / max) * (bars.length - 1));
    return chalk.cyan(bars[index]);
  }).join("");
  
  console.log("  " + chart);
  console.log(chalk.dim("  " + data.map(d => {
    const date = new Date(d.date);
    return date.toLocaleDateString("en-US", { weekday: "short" }).slice(0, 2);
  }).join(" ")));
  
  const total = revenues.reduce((a, b) => a + b, 0);
  console.log(chalk.dim(`\n  Total: ${chalk.green("$" + total.toFixed(2))} over ${data.length} days`));
}

function displayPayerTable(payers: any[]): void {
  for (let i = 0; i < payers.length; i++) {
    const payer = payers[i];
    const medal = i === 0 ? "🥇" : i === 1 ? "🥈" : i === 2 ? "🥉" : "  ";
    console.log(
      `  ${medal} ${chalk.cyan(payer.address.slice(0, 10) + "...")} ` +
      chalk.green(`$${parseFloat(payer.totalSpent).toFixed(2)}`) +
      chalk.dim(` (${payer.transactions} txs)`)
    );
  }
}

function displayInsights(data: any): void {
  const insights: string[] = [];
  
  // Revenue trend
  if (data.trends?.daily && data.trends.daily.length >= 2) {
    const recent = data.trends.daily.slice(-2);
    const growth = ((parseFloat(recent[1]?.revenue || 0) - parseFloat(recent[0]?.revenue || 0)) / 
                   (parseFloat(recent[0]?.revenue || 1))) * 100;
    
    if (growth > 10) {
      insights.push(`📈 Revenue is ${chalk.green("up " + growth.toFixed(0) + "%")} compared to yesterday`);
    } else if (growth < -10) {
      insights.push(`📉 Revenue is ${chalk.red("down " + Math.abs(growth).toFixed(0) + "%")} compared to yesterday`);
    } else {
      insights.push(`📊 Revenue is ${chalk.yellow("stable")} compared to yesterday`);
    }
  }
  
  // Top route insight
  if (data.routeStats && data.routeStats.length > 0) {
    const topRoute = data.routeStats[0];
    insights.push(`🌟 Top performer: ${chalk.cyan(topRoute.route)} with ${chalk.green("$" + parseFloat(topRoute.revenue).toFixed(2))}`);
  }
  
  // Payer diversity
  if (data.summary?.uniquePayers > 10) {
    insights.push(`👥 Strong payer diversity: ${chalk.cyan(data.summary.uniquePayers)} unique addresses`);
  }
  
  if (insights.length === 0) {
    insights.push("Start receiving payments to see insights!");
  }
  
  for (const insight of insights) {
    console.log("  " + insight);
  }
  console.log();
}

function createProgressBar(percentage: number, width: number): string {
  const filled = Math.round((percentage / 100) * width);
  const empty = width - filled;
  return chalk.cyan("█".repeat(filled)) + chalk.dim("░".repeat(empty)) + chalk.dim(` ${percentage}%`);
}

function truncate(str: string, len: number): string {
  return str.length > len ? str.slice(0, len - 1) + "…" : str;
}

function convertToCSV(routes: any[]): string {
  const headers = ["route", "calls", "revenue", "avgPayment", "percentage"];
  const rows = routes.map(r => 
    [r.route, r.calls, r.revenue, r.avgPayment, r.percentage].join(",")
  );
  return [headers.join(","), ...rows].join("\n");
}

async function displayLocalAnalytics(projectName: string): Promise<void> {
  const analyticsDir = path.join(process.cwd(), ".x402", "analytics");
  
  if (!await fs.pathExists(analyticsDir)) {
    console.log(chalk.dim("No local analytics data found."));
    console.log(chalk.dim("Run your server and process payments to generate analytics.\n"));
    return;
  }
  
  // Read local analytics files
  const files = await fs.readdir(analyticsDir);
  const jsonFiles = files.filter(f => f.endsWith(".json"));
  
  if (jsonFiles.length === 0) {
    console.log(chalk.dim("No analytics data files found.\n"));
    return;
  }
  
  console.log(chalk.cyan(`Found ${jsonFiles.length} analytics file(s)\n`));
  
  for (const file of jsonFiles.slice(-5)) {
    const data = await fs.readJSON(path.join(analyticsDir, file));
    console.log(chalk.dim(`  ${file}: ${data.payments || 0} payments, $${(data.revenue || 0).toFixed(2)}`));
  }
  console.log();
}
