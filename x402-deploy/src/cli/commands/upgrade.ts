import chalk from "chalk";
import { prompt } from "enquirer";
import ora from "ora";
import fs from "fs-extra";
import path from "path";
import { detectProject, detectProjectType } from "../../utils/detect.js";
import { X402Config, X402ConfigSchema } from "../../types/config.js";

export async function upgradeCommand(): Promise<void> {
  console.log(chalk.cyan("\n⬆️  Upgrading x402 configuration...\n"));
  
  const configPath = path.join(process.cwd(), "x402.config.json");
  
  // Check if config exists
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

  let configChanged = false;
  
  // Detect current project
  const detectionSpinner = ora("Analyzing project...").start();
  const detection = await detectProject(process.cwd());
  detectionSpinner.succeed(`Project type: ${detection.type}`);
  
  // Display current configuration
  console.log(chalk.cyan("\n📋 Current Configuration:\n"));
  console.log(`  Name:      ${chalk.white(config.name)}`);
  console.log(`  Type:      ${chalk.white(config.type || detection.type)}`);
  console.log(`  Network:   ${chalk.white(config.payment.network)}`);
  console.log(`  Wallet:    ${chalk.white(config.payment.wallet.slice(0, 10) + "...")}`);

  // Update project type if changed
  if (config.type !== detection.type && detection.type !== "unknown") {
    console.log(chalk.yellow(`\n⚠️  Detected project type changed: ${config.type} → ${detection.type}`));
    const { updateType } = await prompt<{ updateType: boolean }>([{
      type: "confirm",
      name: "updateType",
      message: "Update project type?",
      initial: true,
    }]);
    
    if (updateType) {
      config.type = detection.type;
      configChanged = true;
      console.log(chalk.green("✅ Project type updated"));
    }
  }

  // Check for new routes detected in source code
  const currentRoutes = Object.keys(config.pricing?.routes || {});
  const detectedRoutes = detection.routes || [];
  
  const newRoutes = detectedRoutes.filter(route => 
    !currentRoutes.some(cr => cr === route || cr.includes("*"))
  );

  console.log(chalk.cyan(`\n🔍 Route Analysis:\n`));
  console.log(`  Current pricing routes: ${currentRoutes.length}`);
  console.log(`  Detected routes:        ${detectedRoutes.length}`);
  console.log(`  New routes found:       ${newRoutes.length}`);
  
  if (newRoutes.length > 0) {
    console.log(chalk.yellow(`\nNew routes detected in source code:\n`));
    for (const route of newRoutes) {
      console.log(`  ${chalk.dim("+")} ${route}`);
    }
    
    const { addRoutes } = await prompt<{ addRoutes: boolean }>([{
      type: "confirm",
      name: "addRoutes",
      message: "Add pricing for new routes?",
      initial: true,
    }]);
    
    if (addRoutes) {
      config.pricing = config.pricing || { model: "per-call" };
      config.pricing.routes = config.pricing.routes || {};
      
      // Generate smart pricing for each route
      for (const route of newRoutes) {
        const price = suggestPrice(route);
        config.pricing.routes[route] = price;
        console.log(`  ${chalk.green("✓")} ${route}: ${chalk.cyan(price)}`);
      }
      
      configChanged = true;
    }
  } else if (currentRoutes.length === 0) {
    console.log(chalk.yellow("\nNo pricing routes configured yet."));
    
    const { addDefaultRoutes } = await prompt<{ addDefaultRoutes: boolean }>([{
      type: "confirm",
      name: "addDefaultRoutes",
      message: "Add default pricing routes for your project type?",
      initial: true,
    }]);
    
    if (addDefaultRoutes) {
      config.pricing = config.pricing || { model: "per-call" };
      config.pricing.routes = getDefaultRoutes(detection.type);
      configChanged = true;
      console.log(chalk.green(`✅ Added ${Object.keys(config.pricing.routes).length} default pricing routes`));
    }
  } else {
    console.log(chalk.dim("\nCurrent routes:"));
    for (const [route, price] of Object.entries(config.pricing?.routes || {})) {
      const priceStr = typeof price === "string" ? price : (price as any).price;
      console.log(`  ${chalk.dim(route)}: ${chalk.green(priceStr)}`);
    }
  }

  // Check for schema updates
  if (!config.$schema) {
    console.log(chalk.yellow("\n⚠️  Missing JSON schema reference"));
    const { addSchema } = await prompt<{ addSchema: boolean }>([{
      type: "confirm",
      name: "addSchema",
      message: "Add schema for better editor support?",
      initial: true,
    }]);
    
    if (addSchema) {
      config.$schema = "https://x402.org/schema/config.json";
      configChanged = true;
      console.log(chalk.green("✅ Schema reference added"));
    }
  }

  // Check for version update
  if (!config.version || config.version === "1.0.0") {
    const { updateVersion } = await prompt<{ updateVersion: boolean }>([{
      type: "confirm",
      name: "updateVersion",
      message: "Update config version to 1.1.0?",
      initial: false,
    }]);
    
    if (updateVersion) {
      config.version = "1.1.0";
      configChanged = true;
    }
  }

  // Check for facilitator URL
  if (!config.payment.facilitator) {
    console.log(chalk.yellow("\n⚠️  No facilitator URL configured"));
    const { addFacilitator } = await prompt<{ addFacilitator: boolean }>([{
      type: "confirm",
      name: "addFacilitator",
      message: "Add default x402 facilitator URL?",
      initial: true,
    }]);
    
    if (addFacilitator) {
      config.payment.facilitator = "https://facilitator.x402.dev";
      configChanged = true;
      console.log(chalk.green("✅ Facilitator URL added"));
    }
  }

  // Save changes
  if (configChanged) {
    const saveSpinner = ora("Saving configuration...").start();
    await fs.writeJSON(configPath, config, { spaces: 2 });
    saveSpinner.succeed("Configuration saved");
  }

  console.log(chalk.green("\n✅ Upgrade complete!\n"));
}

function suggestPrice(route: string): string {
  const routeLower = route.toLowerCase();
  
  // High-cost operations
  if (routeLower.includes("write") || routeLower.includes("send") || routeLower.includes("execute") || routeLower.includes("deploy")) {
    return "$0.05";
  }
  
  // Medium-cost operations
  if (routeLower.includes("sign") || routeLower.includes("trade") || routeLower.includes("swap") || routeLower.includes("create")) {
    return "$0.01";
  }
  
  // Read operations
  if (routeLower.includes("get") || routeLower.includes("read") || routeLower.includes("list") || routeLower.includes("query")) {
    return "$0.0001";
  }
  
  // POST/PUT defaults
  if (routeLower.startsWith("post") || routeLower.startsWith("put")) {
    return "$0.001";
  }
  
  // DELETE operations
  if (routeLower.startsWith("delete")) {
    return "$0.005";
  }
  
  // Default
  return "$0.001";
}

function getDefaultRoutes(projectType: string): Record<string, string> {
  switch (projectType) {
    case "mcp-server":
      return {
        "tools/*": "$0.001",
        "resources/*": "$0.0001",
        "prompts/*": "$0.01",
      };
    case "express-api":
    case "hono-api":
    case "fastapi":
      return {
        "GET /*": "$0.0001",
        "POST /*": "$0.001",
        "PUT /*": "$0.001",
        "DELETE /*": "$0.005",
      };
    case "nextjs":
      return {
        "GET /api/*": "$0.0001",
        "POST /api/*": "$0.001",
      };
    default:
      return {
        "/*": "$0.001",
      };
  }
}
