/**
 * Migrate Command - Migrate from other payment systems to x402
 * Supports Stripe, PayPal, and other popular payment platforms
 */

import chalk from "chalk";
import ora from "ora";
import fs from "fs-extra";
import path from "path";
import { prompt } from "enquirer";
import { X402Config } from "../../types/config.js";

interface MigrateOptions {
  from?: "stripe" | "paypal" | "razorpay" | "square";
  apiKey?: string;
  dryRun?: boolean;
}

export async function migrateCommand(options: MigrateOptions): Promise<void> {
  console.log(chalk.cyan(`
╔═══════════════════════════════════════════════════════════════╗
║   🔄 Migrate to x402                                          ║
╚═══════════════════════════════════════════════════════════════╝
  `));

  // Determine source platform
  let platform = options.from;
  
  if (!platform) {
    const { source } = await prompt<{ source: string }>([{
      type: "select",
      name: "source",
      message: "Which payment system are you migrating from?",
      choices: [
        { name: "stripe", message: "Stripe - Payment processor" },
        { name: "paypal", message: "PayPal - Payment processor" },
        { name: "razorpay", message: "Razorpay - Payment processor" },
        { name: "square", message: "Square - Payment processor" },
        { name: "custom", message: "Custom / Manual migration" },
      ],
    }]);
    platform = source as typeof platform;
  }

  console.log(chalk.bold(`\n📦 Migrating from ${chalk.cyan(platform || "custom")}...\n`));

  const configPath = path.join(process.cwd(), "x402.config.json");
  const existingConfig = await fs.pathExists(configPath);

  if (existingConfig && !options.dryRun) {
    const { overwrite } = await prompt<{ overwrite: boolean }>([{
      type: "confirm",
      name: "overwrite",
      message: "x402.config.json exists. Merge with migration?",
      initial: true,
    }]);
    
    if (!overwrite) {
      console.log(chalk.yellow("\nMigration cancelled.\n"));
      return;
    }
  }

  let migrationData: Partial<X402Config> | null = null;

  switch (platform) {
    case "stripe":
      migrationData = await migrateFromStripe(options);
      break;
    case "paypal":
      migrationData = await migrateFromPayPal(options);
      break;
    case "razorpay":
      migrationData = await migrateFromRazorpay(options);
      break;
    case "square":
      migrationData = await migrateFromSquare(options);
      break;
    default:
      migrationData = await customMigration();
  }

  if (!migrationData) {
    console.log(chalk.yellow("\nMigration cancelled or failed.\n"));
    return;
  }

  // Display migration summary
  console.log(chalk.bold("\n📋 Migration Summary:\n"));
  displayMigrationSummary(migrationData);

  if (options.dryRun) {
    console.log(chalk.yellow("\n🔍 Dry run mode - no changes made.\n"));
    return;
  }

  // Save configuration
  const spinner = ora("Saving configuration...").start();
  
  if (existingConfig) {
    const existing = await fs.readJSON(configPath);
    const merged = { ...existing, ...migrationData };
    await fs.writeJSON(configPath, merged, { spaces: 2 });
  } else {
    await fs.writeJSON(configPath, migrationData, { spaces: 2 });
  }

  spinner.succeed("Configuration saved");

  // Next steps
  console.log(chalk.bold("\n✅ Migration Complete!\n"));
  console.log(chalk.bold("📝 Next Steps:\n"));
  console.log(`  1. Review your ${chalk.cyan("x402.config.json")}`);
  console.log(`  2. Test locally: ${chalk.cyan("x402-deploy test")}`);
  console.log(`  3. Deploy: ${chalk.cyan("x402-deploy deploy")}`);
  console.log();
}

async function migrateFromStripe(options: MigrateOptions): Promise<Partial<X402Config> | null> {
  console.log(chalk.bold("\n🔍 Analyzing Stripe Configuration...\n"));
  
  console.log(chalk.yellow("Note: Stripe API key is not required for basic migration."));
  console.log(chalk.dim("We'll help you map your Stripe pricing to x402 format.\n"));

  const answers = await prompt<{
    hasProducts: boolean;
    productCount: string;
    avgPrice: string;
    wallet: string;
  }>([
    {
      type: "confirm",
      name: "hasProducts",
      message: "Do you have Stripe Products configured?",
      initial: true,
    },
    {
      type: "input",
      name: "productCount",
      message: "How many products/price points?",
      initial: "3",
      skip: function(this: any) { return !this.state.answers.hasProducts; },
    },
    {
      type: "input",
      name: "avgPrice",
      message: "What's your typical API call price? (in dollars)",
      initial: "0.01",
    },
    {
      type: "input",
      name: "wallet",
      message: "Your Ethereum wallet address:",
      validate: (v: string) => /^0x[a-fA-F0-9]{40}$/.test(v) || "Invalid address",
    },
  ]);

  return {
    name: "migrated-from-stripe",
    type: "express",
    payment: {
      wallet: answers.wallet,
      network: "eip155:8453", // Base mainnet
      token: "USDC",
      facilitator: "https://facilitator.x402.dev",
    },
    pricing: {
      default: `$${answers.avgPrice}`,
      routes: {
        "GET /api/*": `$${answers.avgPrice}`,
        "POST /api/*": `$${parseFloat(answers.avgPrice) * 2}`,
      },
    },
  };
}

async function migrateFromPayPal(options: MigrateOptions): Promise<Partial<X402Config> | null> {
  console.log(chalk.bold("\n🔍 Migrating from PayPal...\n"));
  
  console.log(chalk.dim("PayPal typically charges per transaction."));
  console.log(chalk.dim("x402 enables micropayments without minimum transaction amounts.\n"));

  const answers = await prompt<{
    avgTransaction: string;
    wallet: string;
  }>([
    {
      type: "input",
      name: "avgTransaction",
      message: "What's your average transaction amount?",
      initial: "5.00",
    },
    {
      type: "input",
      name: "wallet",
      message: "Your Ethereum wallet address:",
      validate: (v: string) => /^0x[a-fA-F0-9]{40}$/.test(v) || "Invalid address",
    },
  ]);

  return {
    name: "migrated-from-paypal",
    type: "express",
    payment: {
      wallet: answers.wallet,
      network: "eip155:8453",
      token: "USDC",
      facilitator: "https://facilitator.x402.dev",
    },
    pricing: {
      default: `$${parseFloat(answers.avgTransaction) / 100}`, // Divide by 100 for per-call
      routes: {},
    },
  };
}

async function migrateFromRazorpay(options: MigrateOptions): Promise<Partial<X402Config> | null> {
  console.log(chalk.bold("\n🔍 Migrating from Razorpay...\n"));
  
  const answers = await prompt<{
    avgPrice: string;
    wallet: string;
  }>([
    {
      type: "input",
      name: "avgPrice",
      message: "Average price per API call?",
      initial: "0.01",
    },
    {
      type: "input",
      name: "wallet",
      message: "Your Ethereum wallet address:",
      validate: (v: string) => /^0x[a-fA-F0-9]{40}$/.test(v) || "Invalid address",
    },
  ]);

  return {
    name: "migrated-from-razorpay",
    type: "express",
    payment: {
      wallet: answers.wallet,
      network: "eip155:8453",
      token: "USDC",
    },
    pricing: {
      default: `$${answers.avgPrice}`,
      routes: {},
    },
  };
}

async function migrateFromSquare(options: MigrateOptions): Promise<Partial<X402Config> | null> {
  console.log(chalk.bold("\n🔍 Migrating from Square...\n"));
  
  const answers = await prompt<{
    avgPrice: string;
    wallet: string;
  }>([
    {
      type: "input",
      name: "avgPrice",
      message: "Average price per API call?",
      initial: "0.05",
    },
    {
      type: "input",
      name: "wallet",
      message: "Your Ethereum wallet address:",
      validate: (v: string) => /^0x[a-fA-F0-9]{40}$/.test(v) || "Invalid address",
    },
  ]);

  return {
    name: "migrated-from-square",
    type: "express",
    payment: {
      wallet: answers.wallet,
      network: "eip155:8453",
      token: "USDC",
    },
    pricing: {
      default: `$${answers.avgPrice}`,
      routes: {},
    },
  };
}

async function customMigration(): Promise<Partial<X402Config> | null> {
  console.log(chalk.bold("\n🔧 Custom Migration\n"));
  console.log(chalk.dim("We'll guide you through setting up x402 from scratch.\n"));

  const answers = await prompt<{
    projectName: string;
    wallet: string;
    defaultPrice: string;
  }>([
    {
      type: "input",
      name: "projectName",
      message: "Project name:",
      initial: "my-api",
    },
    {
      type: "input",
      name: "wallet",
      message: "Your Ethereum wallet address:",
      validate: (v: string) => /^0x[a-fA-F0-9]{40}$/.test(v) || "Invalid address",
    },
    {
      type: "input",
      name: "defaultPrice",
      message: "Default price per API call:",
      initial: "$0.001",
    },
  ]);

  return {
    name: answers.projectName,
    type: "express",
    payment: {
      wallet: answers.wallet,
      network: "eip155:8453",
      token: "USDC",
    },
    pricing: {
      default: answers.defaultPrice,
      routes: {},
    },
  };
}

function displayMigrationSummary(config: Partial<X402Config>): void {
  console.log(`  ${chalk.dim("Project:")}     ${chalk.white(config.name || "N/A")}`);
  console.log(`  ${chalk.dim("Wallet:")}      ${chalk.cyan(config.payment?.wallet?.slice(0, 10) + "..." || "N/A")}`);
  console.log(`  ${chalk.dim("Network:")}     ${chalk.green(config.payment?.network || "N/A")}`);
  console.log(`  ${chalk.dim("Default:")}     ${chalk.yellow(config.pricing?.default || "N/A")}`);
  
  const routeCount = Object.keys(config.pricing?.routes || {}).length;
  console.log(`  ${chalk.dim("Routes:")}      ${chalk.white(routeCount.toString())} configured`);
}
