/**
 * CLI output formatters for dashboard data
 */

import chalk from "chalk";
import type { DashboardData, EarningsSummary, PaymentRecord, RouteStats } from "./types.js";

/**
 * Format full dashboard data for CLI display
 */
export function formatDashboardCLI(data: DashboardData): string {
  const lines: string[] = [];

  lines.push(chalk.bold("\n📊 Earnings Dashboard\n"));
  lines.push("═".repeat(50));

  // Summary section
  lines.push(chalk.bold("\n💰 Revenue Summary\n"));
  lines.push(`  Total:      ${chalk.green("$" + data.summary.totalRevenue)}`);
  lines.push(`  Payments:   ${data.summary.totalPayments}`);
  lines.push(`  Payers:     ${data.summary.uniquePayers}`);
  lines.push(`  Period:     ${data.summary.period}`);

  // Top routes section
  if (data.topRoutes.length > 0) {
    lines.push(chalk.bold("\n📈 Top Routes\n"));
    for (const route of data.topRoutes.slice(0, 5)) {
      const bar = "█".repeat(Math.ceil(route.percentage / 5));
      lines.push(
        `  ${route.route.padEnd(30)} ${chalk.cyan("$" + route.revenue)} (${route.calls} calls)`
      );
      lines.push(`  ${chalk.dim(bar)} ${route.percentage.toFixed(1)}%`);
    }
  }

  // Recent payments section
  if (data.recentPayments.length > 0) {
    lines.push(chalk.bold("\n🔔 Recent Payments\n"));
    for (const payment of data.recentPayments.slice(0, 5)) {
      const time = new Date(payment.timestamp).toLocaleTimeString();
      const shortenedPayer = payment.payer.slice(0, 10);
      lines.push(
        `  ${chalk.dim(time)} ${chalk.cyan("$" + payment.amount)} from ${chalk.yellow(shortenedPayer)}...`
      );
    }
  }

  // Top payers section
  if (data.payerStats.topPayers.length > 0) {
    lines.push(chalk.bold("\n👥 Top Payers\n"));
    for (const payer of data.payerStats.topPayers.slice(0, 5)) {
      const shortenedAddress = `${payer.address.slice(0, 6)}...${payer.address.slice(-4)}`;
      lines.push(
        `  ${chalk.yellow(shortenedAddress)} ${chalk.green("$" + payer.totalPaid)} (${payer.calls} calls)`
      );
    }
  }

  lines.push("\n" + "═".repeat(50));
  lines.push("");
  return lines.join("\n");
}

/**
 * Format dashboard data as JSON
 */
export function formatEarningsJSON(data: DashboardData): string {
  return JSON.stringify(data, null, 2);
}

/**
 * Format a compact one-line summary
 */
export function formatCompactSummary(summary: EarningsSummary): string {
  return [
    chalk.bold("📊 Quick Stats"),
    `Revenue: ${chalk.green("$" + summary.totalRevenue)}`,
    `Payments: ${summary.totalPayments}`,
    `Payers: ${summary.uniquePayers}`,
  ].join(" | ");
}

/**
 * Format a single payment record
 */
export function formatPayment(payment: PaymentRecord): string {
  const time = new Date(payment.timestamp).toLocaleString();
  const shortenedPayer = `${payment.payer.slice(0, 6)}...${payment.payer.slice(-4)}`;
  const shortenedTx = `${payment.transactionHash.slice(0, 10)}...`;

  return [
    chalk.dim(`[${time}]`),
    chalk.green(`$${payment.amount}`),
    chalk.cyan(payment.token),
    `on ${chalk.blue(payment.network)}`,
    `from ${chalk.yellow(shortenedPayer)}`,
    `route: ${chalk.magenta(payment.route)}`,
    chalk.dim(`tx: ${shortenedTx}`),
  ].join(" ");
}

/**
 * Format route statistics as a table
 */
export function formatRouteTable(routes: RouteStats[]): string {
  const lines: string[] = [];

  lines.push(chalk.bold("\n📊 Route Statistics\n"));

  // Header
  const header = [
    "Route".padEnd(30),
    "Revenue".padEnd(15),
    "Calls".padEnd(10),
    "Avg".padEnd(12),
    "Share",
  ].join(" ");
  lines.push(chalk.dim(header));
  lines.push(chalk.dim("─".repeat(75)));

  // Rows
  for (const route of routes) {
    const row = [
      route.route.padEnd(30),
      chalk.green(("$" + route.revenue).padEnd(15)),
      route.calls.toString().padEnd(10),
      ("$" + route.avgPayment).padEnd(12),
      `${route.percentage.toFixed(1)}%`,
    ].join(" ");
    lines.push(row);
  }

  lines.push("");
  return lines.join("\n");
}

/**
 * Format trends for CLI display (mini chart)
 */
export function formatTrendsChart(
  trends: { date: string; revenue: string; calls: number }[]
): string {
  const lines: string[] = [];

  lines.push(chalk.bold("\n📈 Revenue Trends (Last 7 Days)\n"));

  // Get last 7 days
  const recent = trends.slice(-7);

  // Find max for scaling
  const maxRevenue = Math.max(...recent.map((t) => parseFloat(t.revenue)));
  const maxBarLength = 30;

  for (const day of recent) {
    const revenue = parseFloat(day.revenue);
    const barLength =
      maxRevenue > 0 ? Math.round((revenue / maxRevenue) * maxBarLength) : 0;
    const bar = "█".repeat(barLength);
    const dayLabel = day.date.slice(5); // MM-DD

    lines.push(
      `  ${chalk.dim(dayLabel)} ${chalk.cyan(bar.padEnd(maxBarLength))} ${chalk.green("$" + day.revenue)} (${day.calls})`
    );
  }

  lines.push("");
  return lines.join("\n");
}

/**
 * Format a loading/waiting message
 */
export function formatLoading(message: string): string {
  return chalk.dim(`⏳ ${message}...`);
}

/**
 * Format an error message
 */
export function formatError(error: string): string {
  return chalk.red(`❌ Error: ${error}`);
}

/**
 * Format a success message
 */
export function formatSuccess(message: string): string {
  return chalk.green(`✅ ${message}`);
}

/**
 * Format no data message
 */
export function formatNoData(): string {
  return chalk.yellow("📭 No payment data available yet.");
}
