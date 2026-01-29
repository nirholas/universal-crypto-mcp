/**
 * Watch Command - Live monitoring of payments and API activity
 * Real-time dashboard in the terminal
 */

import chalk from "chalk";
import ora from "ora";
import fs from "fs-extra";
import path from "path";
import { X402ConfigSchema, X402Config } from "../../types/config.js";
import { DashboardAPI } from "../../dashboard/api.js";

interface WatchOptions {
  interval?: string;
  compact?: boolean;
  routes?: boolean;
  sound?: boolean;
}

interface PaymentEvent {
  timestamp: Date;
  route: string;
  payer: string;
  amount: string;
  txHash: string;
}

let lastPaymentCount = 0;
let totalRevenue = 0;
let paymentsThisSession = 0;

export async function watchCommand(options: WatchOptions): Promise<void> {
  const configPath = path.join(process.cwd(), "x402.config.json");
  
  if (!await fs.pathExists(configPath)) {
    console.error(chalk.red("No x402.config.json found. Run 'x402-deploy init' first."));
    process.exit(1);
  }

  let config: X402Config;
  try {
    const rawConfig = await fs.readJSON(configPath);
    config = X402ConfigSchema.parse(rawConfig);
  } catch (error) {
    console.error(chalk.red(`Failed to load configuration: ${error}`));
    process.exit(1);
  }

  const interval = parseInt(options.interval || "5000", 10);
  const api = new DashboardAPI();

  // Clear screen and show header
  console.clear();
  displayHeader(config);

  // Start watching
  console.log(chalk.cyan("\n🔴 Live monitoring started...\n"));
  console.log(chalk.dim("Press Ctrl+C to stop\n"));

  let lastUpdate = Date.now();
  let errorCount = 0;

  const watch = async () => {
    try {
      const data = await api.getFullDashboard(config.name);
      
      // Check for new payments
      const currentPaymentCount = data.summary.totalPayments;
      if (currentPaymentCount > lastPaymentCount && lastPaymentCount > 0) {
        const newPayments = currentPaymentCount - lastPaymentCount;
        paymentsThisSession += newPayments;
        
        // Play sound if enabled
        if (options.sound) {
          process.stdout.write('\x07'); // Bell character
        }
        
        // Show notification
        console.log(chalk.green(`\n💰 ${newPayments} new payment(s)! Total this session: ${paymentsThisSession}\n`));
      }
      
      lastPaymentCount = currentPaymentCount;
      totalRevenue = parseFloat(data.summary.totalRevenue);
      
      // Redraw display
      console.clear();
      displayHeader(config);
      displayLiveStats(data, options);
      
      lastUpdate = Date.now();
      errorCount = 0;
    } catch (error) {
      errorCount++;
      if (errorCount > 3) {
        console.log(chalk.yellow(`\n⚠️  Connection issues. Retrying... (${errorCount})\n`));
      }
    }

    // Schedule next update
    setTimeout(watch, interval);
  };

  // Start the watch loop
  watch();

  // Handle graceful shutdown
  process.on('SIGINT', () => {
    console.log(chalk.cyan("\n\n📊 Session Summary:"));
    console.log(`  New payments: ${chalk.green(paymentsThisSession.toString())}`);
    console.log(`  Total revenue: ${chalk.green("$" + totalRevenue.toFixed(4))}`);
    console.log(chalk.dim("\nMonitoring stopped.\n"));
    process.exit(0);
  });
}

function displayHeader(config: X402Config): void {
  const timestamp = new Date().toLocaleTimeString();
  
  console.log(chalk.cyan("╔═══════════════════════════════════════════════════════════════╗"));
  console.log(chalk.cyan("║") + chalk.bold("   📡 x402 Live Monitor".padEnd(62)) + chalk.cyan("║"));
  console.log(chalk.cyan("╠═══════════════════════════════════════════════════════════════╣"));
  console.log(chalk.cyan("║") + `   Project: ${chalk.white(config.name)}`.padEnd(71) + chalk.cyan("║"));
  console.log(chalk.cyan("║") + `   Updated: ${chalk.dim(timestamp)}`.padEnd(71) + chalk.cyan("║"));
  console.log(chalk.cyan("╚═══════════════════════════════════════════════════════════════╝"));
}

function displayLiveStats(data: any, options: WatchOptions): void {
  const { summary, routeStats, topPayers } = data;

  // Summary metrics
  console.log(chalk.bold("\n💰 Revenue Summary\n"));
  console.log(`  Total:        ${chalk.green("$" + parseFloat(summary.totalRevenue).toFixed(4))}`);
  console.log(`  Payments:     ${chalk.cyan(summary.totalPayments.toLocaleString())}`);
  console.log(`  Unique Payers: ${chalk.yellow(summary.uniquePayers.toLocaleString())}`);
  console.log(`  This Session: ${chalk.green(paymentsThisSession.toString() + " new")}`);

  // Route stats
  if (options.routes && routeStats && routeStats.length > 0) {
    console.log(chalk.bold("\n🛣️  Top Routes\n"));
    for (let i = 0; i < Math.min(5, routeStats.length); i++) {
      const route = routeStats[i];
      const bar = createMiniBar(parseFloat(route.percentage), 20);
      console.log(`  ${chalk.dim((i + 1).toString())}. ${chalk.cyan(truncate(route.route, 30))} ${bar} ${chalk.green("$" + parseFloat(route.revenue).toFixed(2))}`);
    }
  }

  // Recent payers
  if (topPayers && topPayers.length > 0 && !options.compact) {
    console.log(chalk.bold("\n👥 Recent Payers\n"));
    for (let i = 0; i < Math.min(3, topPayers.length); i++) {
      const payer = topPayers[i];
      console.log(`  ${chalk.dim(payer.address.slice(0, 8) + "...")} ${chalk.green("$" + parseFloat(payer.totalSpent).toFixed(4))} ${chalk.dim("(" + payer.transactions + " txs)")}`);
    }
  }

  // Activity indicator
  console.log(chalk.bold("\n📊 Activity\n"));
  const activityLevel = summary.totalPayments > 100 ? "High" : summary.totalPayments > 10 ? "Medium" : "Low";
  const activityColor = activityLevel === "High" ? chalk.green : activityLevel === "Medium" ? chalk.yellow : chalk.dim;
  console.log(`  ${activityColor("●")} ${activityLevel} volume`);
  
  // Live indicator
  console.log(chalk.dim("\n⟳ Refreshing..."));
}

function createMiniBar(percentage: number, width: number): string {
  const filled = Math.round((percentage / 100) * width);
  const empty = width - filled;
  return chalk.cyan("█".repeat(filled)) + chalk.dim("░".repeat(empty));
}

function truncate(str: string, maxLen: number): string {
  return str.length > maxLen ? str.slice(0, maxLen - 1) + "…" : str.padEnd(maxLen);
}
