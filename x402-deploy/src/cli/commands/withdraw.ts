import chalk from "chalk";
import { prompt } from "enquirer";
import ora from "ora";
import fs from "fs-extra";
import path from "path";
import { X402ConfigSchema } from "../../types/config.js";
import { DashboardAPI } from "../../dashboard/api.js";

export async function withdrawCommand(): Promise<void> {
  console.log(chalk.cyan("\n💸 Withdraw Earnings\n"));
  
  const configPath = path.join(process.cwd(), "x402.config.json");
  
  // Check if config exists
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

  // Fetch earnings from dashboard API
  spinner.start("Fetching earnings...");
  let earnings;
  try {
    const dashboardApi = new DashboardAPI();
    const summary = await dashboardApi.getEarnings(config.name, "all");
    const escrowData = await dashboardApi.getPendingEarnings(config.name);
    
    earnings = {
      available: parseFloat(summary.totalRevenue),
      pending: escrowData.pending,
      total: parseFloat(summary.totalRevenue) + escrowData.pending,
      escrowBalance: escrowData.escrowBalance,
      pendingWithdrawals: escrowData.pendingWithdrawals,
    };
    
    spinner.succeed("Earnings fetched");
  } catch (error) {
    spinner.warn("Could not fetch earnings from API");
    console.log(chalk.dim("Using local data if available...\n"));
    earnings = {
      available: 0,
      pending: 0,
      total: 0,
      escrowBalance: "0",
      pendingWithdrawals: [],
    };
  }
  
  console.log(`  Wallet:    ${chalk.cyan(config.payment.wallet.slice(0, 10) + "...")}`);
  console.log(`  Available: ${chalk.green("$" + earnings.available.toFixed(2))}`);
  console.log(`  Pending:   ${chalk.yellow("$" + earnings.pending.toFixed(2))}`);
  console.log(`  Total:     ${chalk.white("$" + earnings.total.toFixed(2))}`);
  console.log();
  
  if (earnings.available < 1) {
    console.log(chalk.dim("Minimum withdrawal is $1.00\n"));
    return;
  }
  
  const { confirm } = await prompt<{ confirm: boolean }>([{
    type: "confirm",
    name: "confirm",
    message: `Withdraw $${earnings.available.toFixed(2)} to ${config.payment.wallet.slice(0, 10)}...?`,
    initial: true,
  }]);
  
  if (confirm) {
    const withdrawSpinner = ora("Processing withdrawal via x402 facilitator...").start();
    
    try {
      // Call facilitator API to initiate withdrawal
      const facilitatorUrl = config.payment.facilitator || "https://facilitator.x402.dev";
      const response = await fetch(`${facilitatorUrl}/withdraw`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          project: config.name,
          wallet: config.payment.wallet,
          amount: earnings.available.toFixed(2),
          network: config.payment.network,
        }),
      });

      if (!response.ok) {
        throw new Error(`Withdrawal failed: ${response.statusText}`);
      }

      const result = await response.json();
      withdrawSpinner.succeed("Withdrawal initiated!");
      
      console.log(chalk.green(`
╔═══════════════════════════════════════════════════════════════╗
║   ✅ Withdrawal Successful!                                   ║
║                                                               ║
║   Amount: $${earnings.available.toFixed(2).padEnd(48)}║
║   To:     ${config.payment.wallet.slice(0, 42).padEnd(48)}║
║   Tx:     ${(result.txHash || "pending").slice(0, 42).padEnd(48)}║
║                                                               ║
║   Transaction will be confirmed on-chain shortly.             ║
╚═══════════════════════════════════════════════════════════════╝
      `));
    } catch (error) {
      withdrawSpinner.fail("Withdrawal failed");
      console.error(chalk.red(`\n${error}\n`));
      process.exit(1);
    }
  } else {
    console.log(chalk.dim("\nWithdrawal cancelled.\n"));
  }
}
