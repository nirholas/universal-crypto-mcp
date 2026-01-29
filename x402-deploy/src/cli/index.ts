#!/usr/bin/env node
import { Command } from "commander";
import chalk from "chalk";
import { initCommand } from "./commands/init.js";
import { deployCommand } from "./commands/deploy.js";
import { pricingCommand } from "./commands/pricing.js";
import { dashboardCommand } from "./commands/dashboard.js";
import { statusCommand } from "./commands/status.js";
import { logsCommand } from "./commands/logs.js";

const program = new Command();

console.log(chalk.cyan(`
╔═══════════════════════════════════════════════════════════╗
║                                                           ║
║   ${chalk.bold("x402 Deploy")} - Monetize Any API in Minutes            ║
║   ${chalk.dim("The Stripe for AI Tools, but on-chain")}                  ║
║                                                           ║
╚═══════════════════════════════════════════════════════════╝
`));

program
  .name("x402-deploy")
  .description("1-click deployment and monetization for MCP servers and APIs")
  .version("0.1.0");

program
  .command("init")
  .description("Initialize x402 configuration in the current project")
  .option("-y, --yes", "Skip prompts and use defaults")
  .option("--wallet <address>", "Wallet address to receive payments")
  .option("--network <network>", "Blockchain network (e.g., eip155:42161)")
  .action(initCommand);

program
  .command("deploy")
  .description("Deploy your project with x402 payments enabled")
  .option("-p, --provider <provider>", "Deployment provider (railway, fly, vercel, docker)")
  .option("--dry-run", "Show what would be deployed without deploying")
  .option("--no-discovery", "Skip x402scan registration")
  .action(deployCommand);

program
  .command("pricing")
  .description("Update pricing configuration")
  .option("--route <route>", "Route pattern (e.g., 'GET /api/*')")
  .option("--price <price>", "Price (e.g., '$0.01')")
  .option("--list", "List current pricing")
  .action(pricingCommand);

program
  .command("dashboard")
  .description("Open the earnings dashboard")
  .option("--json", "Output earnings as JSON")
  .option("--days <days>", "Number of days to show", "7")
  .action(dashboardCommand);

program
  .command("status")
  .description("Check deployment status and health")
  .action(statusCommand);

program
  .command("logs")
  .description("View deployment logs")
  .option("-f, --follow", "Follow log output")
  .option("-n, --lines <lines>", "Number of lines to show", "100")
  .action(logsCommand);

program.parse();
