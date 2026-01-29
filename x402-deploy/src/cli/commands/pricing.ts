import fs from "fs-extra";
import path from "path";
import chalk from "chalk";
import ora from "ora";
import { prompt } from "enquirer";
import { X402Config, X402ConfigSchema } from "../../types/config.js";

interface PricingOptions {
  route?: string;
  price?: string;
  list?: boolean;
  remove?: string;
  interactive?: boolean;
}

export async function pricingCommand(options: PricingOptions): Promise<void> {
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
    console.error(chalk.red("Invalid configuration:"), error);
    process.exit(1);
  }
  
  // List pricing
  if (options.list || (!options.route && !options.price && !options.remove && !options.interactive)) {
    displayPricing(config);
    return;
  }
  
  // Remove route
  if (options.remove) {
    if (config.pricing?.routes?.[options.remove]) {
      delete config.pricing.routes[options.remove];
      await fs.writeJSON(configPath, config, { spaces: 2 });
      console.log(chalk.green(`✓ Removed pricing for: ${options.remove}`));
    } else {
      console.log(chalk.yellow(`Route not found: ${options.remove}`));
    }
    return;
  }
  
  // Set route pricing
  if (options.route && options.price) {
    config.pricing = config.pricing || { model: "per-call" };
    config.pricing.routes = config.pricing.routes || {};
    config.pricing.routes[options.route] = options.price;
    
    await fs.writeJSON(configPath, config, { spaces: 2 });
    console.log(chalk.green(`✓ Set ${options.route} = ${options.price}`));
    return;
  }
  
  // Interactive mode
  if (options.interactive || (!options.route && !options.price)) {
    await interactivePricing(config, configPath);
    return;
  }
  
  // Show usage
  console.log(chalk.yellow("\nUsage:"));
  console.log("  x402-deploy pricing --list");
  console.log("  x402-deploy pricing --route 'GET /api/*' --price '$0.01'");
  console.log("  x402-deploy pricing --remove 'GET /api/old'");
  console.log("  x402-deploy pricing --interactive");
}

function displayPricing(config: X402Config): void {
  console.log(chalk.bold("\n💰 Pricing Configuration\n"));
  
  console.log(chalk.cyan("  Model:   ") + chalk.white(config.pricing?.model || "per-call"));
  console.log(chalk.cyan("  Default: ") + chalk.white(config.pricing?.default || "not set"));
  console.log();
  
  const routes = config.pricing?.routes || {};
  const routeCount = Object.keys(routes).length;
  
  if (routeCount === 0) {
    console.log(chalk.dim("  No route-specific pricing configured."));
    console.log(chalk.dim("\n  Add pricing with:"));
    console.log(chalk.dim("    x402-deploy pricing --route 'POST /api/*' --price '$0.01'"));
  } else {
    console.log(chalk.bold(`  Route Pricing (${routeCount} routes):\n`));
    
    // Calculate max route length for alignment
    const maxRouteLen = Math.max(...Object.keys(routes).map(r => r.length));
    
    // Group by method
    const getRoutes: [string, any][] = [];
    const postRoutes: [string, any][] = [];
    const otherRoutes: [string, any][] = [];
    
    for (const [route, pricing] of Object.entries(routes)) {
      if (route.startsWith("GET")) {
        getRoutes.push([route, pricing]);
      } else if (route.startsWith("POST") || route.startsWith("PUT") || route.startsWith("DELETE")) {
        postRoutes.push([route, pricing]);
      } else {
        otherRoutes.push([route, pricing]);
      }
    }
    
    const allRoutes = [...getRoutes, ...postRoutes, ...otherRoutes];
    
    for (const [route, pricing] of allRoutes) {
      const price = typeof pricing === "string" ? pricing : pricing.price;
      const description = typeof pricing === "object" && pricing.description ? chalk.dim(` - ${pricing.description}`) : "";
      const rateLimit = typeof pricing === "object" && pricing.rateLimit ? chalk.dim(` (${pricing.rateLimit}/min)`) : "";
      
      console.log(`    ${chalk.white(route.padEnd(maxRouteLen + 2))} ${chalk.green(price)}${rateLimit}${description}`);
    }
  }
  
  // Show estimated revenue
  console.log(chalk.cyan("\n  💡 Revenue Estimate:\n"));
  console.log(chalk.dim("    100 calls/day  →  ~$3/month"));
  console.log(chalk.dim("    1K calls/day   →  ~$30/month"));
  console.log(chalk.dim("    10K calls/day  →  ~$300/month"));
  
  console.log();
}

async function interactivePricing(config: X402Config, configPath: string): Promise<void> {
  console.log(chalk.bold("\n💰 Interactive Pricing Editor\n"));
  
  while (true) {
    const routes = config.pricing?.routes || {};
    const routeList = Object.entries(routes);
    
    const choices = [
      { name: "add", message: "➕ Add new route pricing" },
      { name: "edit", message: "✏️  Edit existing route" },
      { name: "remove", message: "🗑️  Remove route pricing" },
      { name: "default", message: "⚙️  Set default price" },
      { name: "model", message: "📊 Change pricing model" },
      { name: "done", message: "✓ Done" },
    ];
    
    const { action } = await prompt<{ action: string }>({
      type: "select",
      name: "action",
      message: "What would you like to do?",
      choices,
    });
    
    if (action === "done") {
      break;
    }
    
    if (action === "add") {
      const { route, price, description } = await prompt<{ route: string; price: string; description?: string }>([
        {
          type: "input",
          name: "route",
          message: "Route pattern (e.g., 'POST /api/*'):",
          validate: (v) => v.length > 0 || "Route is required",
        },
        {
          type: "input",
          name: "price",
          message: "Price (e.g., '$0.01'):",
          initial: "$0.001",
          validate: (v) => /^\$?\d+\.?\d*$/.test(v) || "Invalid price format",
        },
        {
          type: "input",
          name: "description",
          message: "Description (optional):",
        },
      ]);
      
      config.pricing = config.pricing || { model: "per-call" };
      config.pricing.routes = config.pricing.routes || {};
      
      if (description) {
        config.pricing.routes[route] = { price, description };
      } else {
        config.pricing.routes[route] = price;
      }
      
      await fs.writeJSON(configPath, config, { spaces: 2 });
      console.log(chalk.green(`\n✓ Added: ${route} = ${price}\n`));
    }
    
    if (action === "edit" && routeList.length > 0) {
      const { routeToEdit } = await prompt<{ routeToEdit: string }>({
        type: "select",
        name: "routeToEdit",
        message: "Select route to edit:",
        choices: routeList.map(([route, pricing]) => ({
          name: route,
          message: `${route} (${typeof pricing === "string" ? pricing : pricing.price})`,
        })),
      });
      
      const currentPrice = typeof routes[routeToEdit] === "string" 
        ? routes[routeToEdit] 
        : (routes[routeToEdit] as any).price;
      
      const { newPrice } = await prompt<{ newPrice: string }>({
        type: "input",
        name: "newPrice",
        message: `New price for ${routeToEdit}:`,
        initial: currentPrice,
        validate: (v) => /^\$?\d+\.?\d*$/.test(v) || "Invalid price format",
      });
      
      config.pricing!.routes![routeToEdit] = newPrice;
      await fs.writeJSON(configPath, config, { spaces: 2 });
      console.log(chalk.green(`\n✓ Updated: ${routeToEdit} = ${newPrice}\n`));
    }
    
    if (action === "remove" && routeList.length > 0) {
      const { routeToRemove } = await prompt<{ routeToRemove: string }>({
        type: "select",
        name: "routeToRemove",
        message: "Select route to remove:",
        choices: routeList.map(([route, pricing]) => ({
          name: route,
          message: `${route} (${typeof pricing === "string" ? pricing : pricing.price})`,
        })),
      });
      
      delete config.pricing!.routes![routeToRemove];
      await fs.writeJSON(configPath, config, { spaces: 2 });
      console.log(chalk.green(`\n✓ Removed: ${routeToRemove}\n`));
    }
    
    if (action === "default") {
      const { defaultPrice } = await prompt<{ defaultPrice: string }>({
        type: "input",
        name: "defaultPrice",
        message: "Default price for unlisted routes:",
        initial: config.pricing?.default || "$0.001",
        validate: (v) => /^\$?\d+\.?\d*$/.test(v) || "Invalid price format",
      });
      
      config.pricing = config.pricing || { model: "per-call" };
      config.pricing.default = defaultPrice;
      await fs.writeJSON(configPath, config, { spaces: 2 });
      console.log(chalk.green(`\n✓ Default price set to: ${defaultPrice}\n`));
    }
    
    if (action === "model") {
      const { pricingModel } = await prompt<{ pricingModel: string }>({
        type: "select",
        name: "pricingModel",
        message: "Select pricing model:",
        choices: [
          { name: "per-call", message: "Per Call - Charge for each request" },
          { name: "tiered", message: "Tiered - Volume-based pricing" },
          { name: "subscription", message: "Subscription - Time-based access" },
          { name: "dynamic", message: "Dynamic - Adjust based on demand" },
        ],
        initial: config.pricing?.model === "per-call" ? 0 : 
                 config.pricing?.model === "tiered" ? 1 :
                 config.pricing?.model === "subscription" ? 2 : 3,
      });
      
      config.pricing = config.pricing || { model: "per-call" };
      config.pricing.model = pricingModel as any;
      await fs.writeJSON(configPath, config, { spaces: 2 });
      console.log(chalk.green(`\n✓ Pricing model set to: ${pricingModel}\n`));
    }
  }
  
  console.log(chalk.green("✓ Pricing configuration saved!\n"));
  displayPricing(config);
}
