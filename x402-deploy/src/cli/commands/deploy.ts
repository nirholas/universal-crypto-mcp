import fs from "fs-extra";
import path from "path";
import chalk from "chalk";
import ora from "ora";
import { X402Config, X402ConfigSchema } from "../../types/config.js";
import { buildProject } from "../../builders/index.js";
import { deployToProvider } from "../../deployers/index.js";
import { registerWithX402Scan } from "../../discovery/register.js";

interface DeployOptions {
  provider?: string;
  dryRun?: boolean;
  discovery?: boolean;
}

export async function deployCommand(options: DeployOptions): Promise<void> {
  const spinner = ora();
  
  console.log(chalk.bold("\n🚀 Deploying with x402\n"));
  
  // Load configuration
  const configPath = path.join(process.cwd(), "x402.config.json");
  if (!await fs.pathExists(configPath)) {
    console.error(chalk.red("No x402.config.json found. Run 'x402-deploy init' first."));
    return;
  }
  
  spinner.start("Loading configuration...");
  const rawConfig = await fs.readJSON(configPath);
  
  let config: X402Config;
  try {
    config = X402ConfigSchema.parse(rawConfig);
  } catch (error) {
    spinner.fail("Invalid configuration");
    console.error(error);
    return;
  }
  spinner.succeed("Configuration loaded");
  
  // Override provider if specified
  if (options.provider) {
    config.deploy = { ...config.deploy, provider: options.provider as any };
  }
  
  // Build phase
  spinner.start("Building project...");
  try {
    const buildResult = await buildProject(config, process.cwd());
    spinner.succeed(`Built: ${buildResult.outputDir}`);
  } catch (error) {
    spinner.fail("Build failed");
    console.error(error);
    return;
  }
  
  if (options.dryRun) {
    console.log(chalk.yellow("\n🔍 Dry run - showing what would be deployed:\n"));
    console.log(`  Provider: ${config.deploy?.provider}`);
    console.log(`  Network:  ${config.payment.network}`);
    console.log(`  Wallet:   ${config.payment.wallet}`);
    console.log(`  Routes:   ${Object.keys(config.pricing?.routes || {}).length}`);
    return;
  }
  
  // Deploy phase
  spinner.start(`Deploying to ${config.deploy?.provider}...`);
  try {
    const deployResult = await deployToProvider(config, process.cwd());
    spinner.succeed(`Deployed to: ${chalk.cyan(deployResult.url)}`);
    
    // Register with x402scan if discovery is enabled
    if (options.discovery !== false && config.discovery?.enabled) {
      spinner.start("Registering with x402scan...");
      try {
        await registerWithX402Scan(config, deployResult.url);
        spinner.succeed("Registered on x402scan");
      } catch (error) {
        spinner.warn("x402scan registration failed (non-fatal)");
      }
    }
    
    // Success message
    console.log(chalk.bold.green("\n✅ Deployment Complete!\n"));
    console.log(`  🌐 URL:       ${chalk.cyan(deployResult.url)}`);
    console.log(`  💰 Wallet:    ${chalk.cyan(config.payment.wallet)}`);
    console.log(`  📊 Dashboard: ${chalk.cyan(`https://dash.x402.host/${config.name}`)}`);
    
    if (config.type === "mcp-server") {
      console.log(chalk.bold("\n📋 Add to Claude Desktop:\n"));
      console.log(chalk.dim(JSON.stringify({
        mcpServers: {
          [config.name]: {
            url: `${deployResult.url}/mcp`,
          },
        },
      }, null, 2)));
    }
    
  } catch (error) {
    spinner.fail("Deployment failed");
    console.error(error);
  }
}
