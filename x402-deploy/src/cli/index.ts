#!/usr/bin/env node
import { Command } from "commander";
import chalk from "chalk";
import { initCommand } from "./commands/init.js";
import { deployCommand } from "./commands/deploy.js";
import { pricingCommand } from "./commands/pricing.js";
import { dashboardCommand } from "./commands/dashboard.js";
import { statusCommand } from "./commands/status.js";
import { logsCommand } from "./commands/logs.js";
import { testCommand } from "./commands/test.js";
import { upgradeCommand } from "./commands/upgrade.js";
import { withdrawCommand } from "./commands/withdraw.js";
import {
  marketplaceListCommand,
  marketplaceViewCommand,
  marketplaceSearchCommand,
  marketplacePublishCommand,
  marketplaceCategoriesCommand,
  marketplaceReviewCommand,
} from "./commands/marketplace.js";

const program = new Command();

// Beautiful ASCII banner
console.log(chalk.cyan(`
    ██╗  ██╗██╗  ██╗ ██████╗ ██████╗ 
    ╚██╗██╔╝██║  ██║██╔═████╗╚════██╗
     ╚███╔╝ ███████║██║██╔██║ █████╔╝
     ██╔██╗ ╚════██║████╔╝██║██╔═══╝ 
    ██╔╝ ██╗     ██║╚██████╔╝███████╗
    ╚═╝  ╚═╝     ╚═╝ ╚═════╝ ╚══════╝
                                      
    ${chalk.dim("1-Click API Monetization")}
`));

program
  .name("x402-deploy")
  .description("Monetize any API or MCP server in minutes")
  .version("0.1.0");

// Core commands
program
  .command("init")
  .description("Initialize x402 in your project")
  .option("-y, --yes", "Skip prompts and use defaults")
  .option("--wallet <address>", "Wallet address to receive payments")
  .option("--network <network>", "Blockchain network (e.g., eip155:42161)")
  .option("--template <template>", "Use a template")
  .action(initCommand);

program
  .command("deploy")
  .description("Deploy with payments enabled")
  .option("-p, --provider <provider>", "Deployment provider (railway, fly, vercel, docker)")
  .option("--dry-run", "Show what would be deployed without deploying")
  .option("--no-discovery", "Skip x402scan registration")
  .option("--env <env>", "Environment name")
  .action(deployCommand);

program
  .command("test")
  .description("Test monetization locally")
  .option("--port <port>", "Local server port", "3402")
  .action(testCommand);

// Management commands  
program
  .command("pricing")
  .description("Configure pricing")
  .option("--route <route>", "Route pattern (e.g., 'GET /api/*')")
  .option("--price <price>", "Price (e.g., '$0.01')")
  .option("--list", "List current pricing")
  .option("--remove <route>", "Remove pricing for a route")
  .option("-i, --interactive", "Interactive pricing editor")
  .action(pricingCommand);

program
  .command("dashboard [project]")
  .description("View earnings dashboard")
  .option("--json", "Output earnings as JSON")
  .option("--period <period>", "Time period: day, week, month, all", "week")
  .option("--compact", "Show compact one-line summary")
  .option("--trends", "Show revenue trends chart")
  .action(dashboardCommand);

program
  .command("status")
  .description("Check deployment health")
  .action(statusCommand);

program
  .command("logs")
  .description("View deployment logs")
  .option("-f, --follow", "Follow log output")
  .option("-n, --lines <lines>", "Number of lines to show", "100")
  .action(logsCommand);

// Advanced commands
program
  .command("upgrade")
  .description("Upgrade x402 configuration")
  .action(upgradeCommand);

program
  .command("withdraw")
  .description("Withdraw earnings")
  .action(withdrawCommand);

// Quick aliases
program
  .command("d")
  .description("Alias for deploy")
  .action(deployCommand);

program
  .command("s")
  .description("Alias for status")
  .action(statusCommand);

// Marketplace commands
const marketplace = program
  .command("marketplace")
  .description("Browse and publish to the x402 API marketplace");

marketplace
  .command("list")
  .description("List APIs in the marketplace")
  .option("-c, --category <category>", "Filter by category")
  .option("-v, --verified", "Show only verified APIs")
  .option("--json", "Output as JSON")
  .action(marketplaceListCommand);

marketplace
  .command("view <api-id>")
  .description("View details of a specific API")
  .action(marketplaceViewCommand);

marketplace
  .command("search <query>")
  .description("Search for APIs")
  .option("--json", "Output as JSON")
  .action(marketplaceSearchCommand);

marketplace
  .command("publish")
  .description("Publish your API to the marketplace")
  .action(marketplacePublishCommand);

marketplace
  .command("categories")
  .description("List marketplace categories")
  .action(marketplaceCategoriesCommand);

marketplace
  .command("review <api-id>")
  .description("Submit a review for an API")
  .action(marketplaceReviewCommand);

// Marketplace alias
program
  .command("mp")
  .description("Alias for marketplace list")
  .option("-c, --category <category>", "Filter by category")
  .option("-v, --verified", "Show only verified APIs")
  .option("--json", "Output as JSON")
  .action(marketplaceListCommand);

program.parse();
