import fs from "fs-extra";
import path from "path";
import chalk from "chalk";
import ora from "ora";
import { prompt } from "enquirer";
import { X402Config, X402ConfigSchema } from "../../types/config.js";
import { buildProject } from "../../builders/index.js";
import { deployToProvider } from "../../deployers/index.js";
import { registerWithX402Scan } from "../../discovery/register.js";

interface DeployOptions {
  provider?: string;
  dryRun?: boolean;
  discovery?: boolean;
  env?: string;
}

export async function deployCommand(options: DeployOptions): Promise<void> {
  console.log(chalk.cyan("\n🚀 Starting deployment...\n"));

  // Step 1: Load and validate config
  const configSpinner = ora("Loading configuration...").start();
  const configPath = path.join(process.cwd(), "x402.config.json");
  
  let config: X402Config;
  try {
    if (!await fs.pathExists(configPath)) {
      configSpinner.fail("No x402.config.json found");
      console.log(chalk.yellow("\nRun 'x402-deploy init' first to set up your project.\n"));
      process.exit(1);
    }
    
    const rawConfig = await fs.readJSON(configPath);
    config = X402ConfigSchema.parse(rawConfig);
    configSpinner.succeed("Configuration loaded");
  } catch (error) {
    configSpinner.fail("Invalid configuration");
    console.error(chalk.red(`\n${error}\n`));
    process.exit(1);
  }

  // Step 2: Validate wallet
  if (!config.payment?.wallet) {
    console.log(chalk.red("\n❌ No wallet configured. Run 'x402-deploy init' to set up payments.\n"));
    process.exit(1);
  }

  // Step 3: Show deployment plan
  const provider = options.provider || config.deploy?.provider || "railway";
  
  console.log(chalk.cyan("\n📋 Deployment Plan:\n"));
  console.log(`  Project:    ${chalk.white(config.name)}`);
  console.log(`  Provider:   ${chalk.white(provider)}`);
  console.log(`  Network:    ${chalk.white(config.payment.network)}`);
  console.log(`  Wallet:     ${chalk.white(config.payment.wallet.slice(0, 10) + "...")}`);
  console.log(`  Pricing:    ${chalk.white(Object.keys(config.pricing?.routes || {}).length + " routes configured")}`);
  console.log();

  if (options.dryRun) {
    console.log(chalk.yellow("🔍 Dry run mode - no actual deployment will occur\n"));
    await showDryRunPlan(config, provider);
    return;
  }

  // Step 4: Confirm deployment
  const { confirm } = await prompt<{ confirm: boolean }>([
    {
      type: "confirm",
      name: "confirm",
      message: "Proceed with deployment?",
      initial: true,
    },
  ]);

  if (!confirm) {
    console.log(chalk.dim("\nDeployment cancelled.\n"));
    return;
  }

  // Step 5: Build project
  const buildSpinner = ora("Building project...").start();
  try {
    const buildResult = await buildProject(config, process.cwd());
    buildSpinner.succeed(`Built successfully (${buildResult.duration || 0}ms)`);
  } catch (error) {
    buildSpinner.fail("Build failed");
    console.error(chalk.red(`\n${error}\n`));
    process.exit(1);
  }

  // Step 6: Deploy
  const deploySpinner = ora(`Deploying to ${provider}...`).start();
  let deployResult: any;
  try {
    deployResult = await deployToProvider(config, process.cwd());
    deploySpinner.succeed(`Deployed to ${provider}`);
  } catch (error) {
    deploySpinner.fail("Deployment failed");
    console.error(chalk.red(`\n${error}\n`));
    process.exit(1);
  }

  // Step 7: Register with x402scan (if enabled)
  if (options.discovery !== false && config.discovery?.enabled) {
    const registerSpinner = ora("Registering with x402scan...").start();
    try {
      await registerWithX402Scan(config, deployResult.url);
      registerSpinner.succeed("Registered on x402scan.com");
    } catch (error) {
      registerSpinner.warn("x402scan registration failed (non-critical)");
    }
  }

  // Step 8: Success!
  console.log(chalk.green(`
╔═══════════════════════════════════════════════════════════════╗
║                                                               ║
║   🎉 Deployment Successful!                                   ║
║                                                               ║
║   Your API is now LIVE and EARNING:                          ║
║                                                               ║
║   🌐 URL:        ${chalk.cyan(deployResult.url.padEnd(40))}║
║   💰 Wallet:     ${chalk.dim(config.payment.wallet.slice(0, 10) + "...").padEnd(40)}║
║   📊 Dashboard:  ${chalk.cyan("npx x402-deploy dashboard").padEnd(40)}║
║   🔍 x402scan:   ${chalk.cyan("https://x402scan.com").padEnd(40)}║
║                                                               ║
╚═══════════════════════════════════════════════════════════════╝

  ${chalk.dim("Add to Claude Desktop:")}
  
  ${chalk.yellow(`{
    "mcpServers": {
      "${config.name}": {
        "url": "${deployResult.url}/mcp"
      }
    }
  }`)}
  `));
}

async function showDryRunPlan(config: X402Config, provider: string) {
  console.log(chalk.dim("Would perform the following actions:\n"));
  console.log(`  1. Build ${config.type || "project"} with x402 wrapper`);
  console.log(`  2. Generate Dockerfile and deployment config`);
  console.log(`  3. Deploy to ${provider}`);
  console.log(`  4. Configure custom domain (if available)`);
  console.log(`  5. Generate /.well-known/x402 discovery document`);
  if (config.discovery?.enabled) {
    console.log(`  6. Register ${Object.keys(config.pricing?.routes || {}).length} endpoints on x402scan`);
  }
  console.log();
}
