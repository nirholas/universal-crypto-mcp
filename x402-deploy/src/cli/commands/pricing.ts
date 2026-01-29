import fs from "fs-extra";
import path from "path";
import chalk from "chalk";
import { X402Config } from "../../types/config.js";

interface PricingOptions {
  route?: string;
  price?: string;
  list?: boolean;
}

export async function pricingCommand(options: PricingOptions): Promise<void> {
  const configPath = path.join(process.cwd(), "x402.config.json");
  
  if (!await fs.pathExists(configPath)) {
    console.error(chalk.red("No x402.config.json found. Run 'x402-deploy init' first."));
    return;
  }
  
  const config: X402Config = await fs.readJSON(configPath);
  
  if (options.list) {
    console.log(chalk.bold("\n💰 Current Pricing:\n"));
    console.log(`  Default: ${chalk.cyan(config.pricing?.default || "not set")}`);
    console.log();
    
    const routes = config.pricing?.routes || {};
    if (Object.keys(routes).length === 0) {
      console.log(chalk.dim("  No route-specific pricing configured."));
    } else {
      console.log(chalk.bold("  Route-specific pricing:"));
      for (const [route, pricing] of Object.entries(routes)) {
        const price = typeof pricing === "string" ? pricing : pricing.price;
        console.log(`    ${route}: ${chalk.cyan(price)}`);
      }
    }
    console.log();
    return;
  }
  
  if (options.route && options.price) {
    config.pricing = config.pricing || { model: "per-call" };
    config.pricing.routes = config.pricing.routes || {};
    config.pricing.routes[options.route] = options.price;
    
    await fs.writeJSON(configPath, config, { spaces: 2 });
    console.log(chalk.green(`✓ Set ${options.route} = ${options.price}`));
    return;
  }
  
  console.log(chalk.yellow("Usage:"));
  console.log("  x402-deploy pricing --list");
  console.log("  x402-deploy pricing --route 'GET /api/*' --price '$0.01'");
}
