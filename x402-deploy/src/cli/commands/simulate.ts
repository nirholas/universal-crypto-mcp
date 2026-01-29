/**
 * Simulate Command - Simulate payment flows and test your pricing configuration
 * Perfect for testing before going live
 */

import chalk from "chalk";
import ora from "ora";
import fs from "fs-extra";
import path from "path";
import { prompt } from "enquirer";
import { X402ConfigSchema, X402Config } from "../../types/config.js";
import { getPriceForRoute } from "../../gateway/helpers.js";

interface SimulateOptions {
  route?: string;
  calls?: string;
  payers?: string;
}

interface SimulationResult {
  route: string;
  price: string;
  calls: number;
  totalRevenue: number;
  uniquePayers: number;
  avgRevenuePerPayer: number;
  projectedMonthly: number;
  projectedYearly: number;
}

export async function simulateCommand(options: SimulateOptions): Promise<void> {
  console.log(chalk.cyan(`
╔═══════════════════════════════════════════════════════════════╗
║   🎮 x402 Payment Simulator                                   ║
╚═══════════════════════════════════════════════════════════════╝
  `));

  const configPath = path.join(process.cwd(), "x402.config.json");
  
  if (!await fs.pathExists(configPath)) {
    console.error(chalk.red("No x402.config.json found. Run 'x402-deploy init' first."));
    process.exit(1);
  }

  const spinner = ora("Loading configuration...").start();
  let config: X402Config;
  try {
    const rawConfig = await fs.readJSON(configPath);
    config = X402ConfigSchema.parse(rawConfig);
    spinner.succeed("Configuration loaded");
  } catch (error) {
    spinner.fail("Failed to load configuration");
    console.error(chalk.red(`\n${error}\n`));
    process.exit(1);
  }

  // Get routes from config
  const routes = config.pricing?.routes || {};
  const routeList = Object.keys(routes);

  if (routeList.length === 0) {
    console.log(chalk.yellow("\nNo pricing routes configured. Add routes with:"));
    console.log(chalk.dim("  x402-deploy pricing --route 'POST /api/*' --price '$0.01'\n"));
    return;
  }

  console.log(chalk.bold("\n📋 Configured Routes:\n"));
  for (const [route, pricing] of Object.entries(routes)) {
    const priceStr = typeof pricing === "string" ? pricing : (pricing as any).price;
    console.log(`  ${chalk.cyan(route)}: ${chalk.green(priceStr)}`);
  }

  // Get simulation parameters
  let selectedRoute: string;
  let callCount: number;
  let payerCount: number;

  if (options.route && options.calls) {
    selectedRoute = options.route;
    callCount = parseInt(options.calls, 10);
    payerCount = parseInt(options.payers || "10", 10);
  } else {
    const answers = await prompt<{ route: string; calls: string; payers: string }>([
      {
        type: "select",
        name: "route",
        message: "Select route to simulate:",
        choices: routeList.map(r => ({
          name: r,
          message: `${r} (${typeof routes[r] === "string" ? routes[r] : (routes[r] as any).price})`,
        })),
      },
      {
        type: "input",
        name: "calls",
        message: "Number of API calls to simulate:",
        initial: "1000",
        validate: (v: string) => /^\d+$/.test(v) || "Enter a valid number",
      },
      {
        type: "input",
        name: "payers",
        message: "Number of unique payers:",
        initial: "50",
        validate: (v: string) => /^\d+$/.test(v) || "Enter a valid number",
      },
    ]);

    selectedRoute = answers.route;
    callCount = parseInt(answers.calls, 10);
    payerCount = parseInt(answers.payers, 10);
  }

  // Run simulation
  console.log(chalk.bold("\n🎲 Running Simulation...\n"));
  
  const simulationSpinner = ora("Calculating revenue projections...").start();
  
  // Get price for route
  const pricing = getPriceForRoute(selectedRoute, config);
  const priceStr = pricing?.price || config.pricing?.default || "$0.001";
  const priceValue = parseFloat(priceStr.replace("$", ""));

  // Calculate results
  const result: SimulationResult = {
    route: selectedRoute,
    price: priceStr,
    calls: callCount,
    totalRevenue: priceValue * callCount,
    uniquePayers: payerCount,
    avgRevenuePerPayer: (priceValue * callCount) / payerCount,
    projectedMonthly: priceValue * callCount * 30,
    projectedYearly: priceValue * callCount * 365,
  };

  simulationSpinner.succeed("Simulation complete");

  // Display results
  displaySimulationResults(result);

  // Show payment flow visualization
  console.log(chalk.bold("\n🔄 Payment Flow Visualization:\n"));
  displayPaymentFlow(result, config);

  // Ask about running more simulations
  const { runAnother } = await prompt<{ runAnother: boolean }>([{
    type: "confirm",
    name: "runAnother",
    message: "Run another simulation?",
    initial: false,
  }]);

  if (runAnother) {
    await simulateCommand({});
  }
}

function displaySimulationResults(result: SimulationResult): void {
  console.log(chalk.bold("\n📊 Simulation Results:\n"));

  console.log(`  ${chalk.dim("Route:")}          ${chalk.cyan(result.route)}`);
  console.log(`  ${chalk.dim("Price per call:")} ${chalk.green(result.price)}`);
  console.log(`  ${chalk.dim("Total calls:")}    ${chalk.white(result.calls.toLocaleString())}`);
  console.log(`  ${chalk.dim("Unique payers:")}  ${chalk.white(result.uniquePayers.toLocaleString())}`);

  console.log(chalk.bold("\n💰 Revenue Projections:\n"));

  const box = `
┌────────────────────────────────────────────────────────────┐
│                                                            │
│   📈 One-Time Revenue:    ${chalk.green(("$" + result.totalRevenue.toFixed(2)).padEnd(30))}│
│                                                            │
│   📅 Monthly (daily avg):  ${chalk.green(("$" + result.projectedMonthly.toFixed(2)).padEnd(29))}│
│                                                            │
│   📆 Yearly (daily avg):   ${chalk.green(("$" + result.projectedYearly.toFixed(2)).padEnd(29))}│
│                                                            │
│   👤 Avg per payer:        ${chalk.cyan(("$" + result.avgRevenuePerPayer.toFixed(4)).padEnd(29))}│
│                                                            │
└────────────────────────────────────────────────────────────┘`;

  console.log(box);

  // Growth scenarios
  console.log(chalk.bold("\n🚀 Growth Scenarios:\n"));
  
  const scenarios = [
    { name: "Current", multiplier: 1 },
    { name: "2x Growth", multiplier: 2 },
    { name: "5x Growth", multiplier: 5 },
    { name: "10x Growth", multiplier: 10 },
  ];

  console.log("  " + chalk.dim("Scenario".padEnd(15)) + chalk.dim("Monthly".padEnd(15)) + chalk.dim("Yearly"));
  console.log("  " + chalk.dim("─".repeat(45)));

  for (const scenario of scenarios) {
    const monthly = result.projectedMonthly * scenario.multiplier;
    const yearly = result.projectedYearly * scenario.multiplier;
    
    console.log(
      "  " +
      chalk.white(scenario.name.padEnd(15)) +
      chalk.green(("$" + monthly.toFixed(2)).padEnd(15)) +
      chalk.green("$" + yearly.toFixed(2))
    );
  }
}

function displayPaymentFlow(result: SimulationResult, config: X402Config): void {
  const network = config.payment.network;
  const wallet = config.payment.wallet;
  const token = config.payment.token || "USDC";

  console.log(`
  ┌─────────────┐      ┌─────────────┐      ┌─────────────┐
  │             │      │             │      │             │
  │   ${chalk.cyan("Client")}    │─────▶│  ${chalk.yellow("x402")}       │─────▶│   ${chalk.green("You")}       │
  │             │      │  Gateway    │      │             │
  └─────────────┘      └─────────────┘      └─────────────┘
        │                    │                    │
        │  ${chalk.dim("1. Request")}        │  ${chalk.dim("2. Verify")}        │
        │  ${chalk.dim("+ Payment")}         │  ${chalk.dim("Payment")}         │
        │                    │                    │
        └────────────────────┴────────────────────┘
                             │
                    ┌────────┴────────┐
                    │  ${chalk.magenta("Blockchain")}     │
                    │  ${chalk.dim(network.slice(0, 15))}  │
                    │  ${chalk.dim(token + " → " + wallet.slice(0, 8) + "...")} │
                    └─────────────────┘
  `);
}
