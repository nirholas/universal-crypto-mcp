import fs from "fs-extra";
import path from "path";
import chalk from "chalk";
import ora from "ora";
import { prompt } from "enquirer";
import { 
  X402Config, 
  X402ConfigSchema, 
  DEFAULT_CONFIG,
  ProjectType 
} from "../../types/config.js";
import { detectProject, detectProjectType } from "../../utils/detect.js";

interface InitOptions {
  yes?: boolean;
  wallet?: string;
  network?: string;
  template?: string;
}

export async function initCommand(options: InitOptions): Promise<void> {
  console.log(chalk.cyan("\n🚀 Initializing x402 monetization...\n"));

  // Step 1: Detect project details
  const spinner = ora("Detecting project type...").start();
  const detection = await detectProject(process.cwd());
  spinner.succeed(`Detected: ${chalk.green(detection.type)} project`);

  // Show what was detected
  console.log(chalk.dim(`
  Name:      ${detection.name}
  Type:      ${detection.type}
  Framework: ${detection.framework || "unknown"}
  Language:  ${detection.language}
  Routes:    ${detection.routes?.length || 0} detected
  `));

  // Step 2: Check for existing config
  const configPath = path.join(process.cwd(), "x402.config.json");
  let existingConfig: Partial<X402Config> = {};
  
  if (await fs.pathExists(configPath)) {
    const content = await fs.readJSON(configPath);
    existingConfig = content;
    console.log(chalk.yellow("⚠️  Found existing x402.config.json - will merge settings\n"));
  }

  // Step 3: Interactive prompts (unless --yes)
  let answers: any;
  
  if (options.yes) {
    answers = {
      name: path.basename(process.cwd()),
      wallet: options.wallet || existingConfig.payment?.wallet || "",
      network: options.network || "eip155:84532",
      pricingModel: "per-call",
      defaultPrice: "$0.001",
      deployProvider: "railway",
      enableDashboard: true,
      registerX402Scan: true,
    };
  } else {
    answers = await prompt<any>([
      {
        type: "input",
        name: "wallet",
        message: "Wallet address to receive payments:",
        initial: existingConfig.payment?.wallet || options.wallet,
        validate: (input: string) => {
          if (!input) return "Wallet address is required";
          if (!/^0x[a-fA-F0-9]{40}$/.test(input)) return "Invalid Ethereum address";
          return true;
        },
      },
      {
        type: "select",
        name: "network",
        message: "Which network for payments?",
        choices: [
          { name: "eip155:84532", message: "Base Sepolia (testnet) - Free to test" },
          { name: "eip155:8453", message: "Base Mainnet - Production ready" },
          { name: "eip155:42161", message: "Arbitrum One - Low fees" },
          { name: "eip155:1", message: "Ethereum Mainnet - Maximum security" },
          { name: "eip155:137", message: "Polygon - Ultra low fees" },
        ],
        initial: 0,
      },
      {
        type: "select",
        name: "pricingModel",
        message: "How do you want to charge?",
        choices: [
          { name: "per-call", message: "Per API call - Charge for each request" },
          { name: "tiered", message: "Tiered - Different prices for different endpoints" },
          { name: "subscription", message: "Subscription - Time-based access passes" },
          { name: "dynamic", message: "Dynamic - Mix of per-call and subscriptions" },
        ],
        initial: 0,
      },
      {
        type: "input",
        name: "defaultPrice",
        message: "Default price per API call:",
        initial: "$0.001",
        validate: (input: string) => {
          if (!/^\$?\d+\.?\d*$/.test(input)) return "Enter a valid price (e.g., $0.01)";
          return true;
        },
      },
      {
        type: "select",
        name: "deployProvider",
        message: "Where do you want to deploy?",
        choices: [
          { name: "railway", message: "Railway - Easiest, great free tier" },
          { name: "fly", message: "Fly.io - Global edge deployment" },
          { name: "vercel", message: "Vercel - Serverless functions" },
          { name: "docker", message: "Docker - Self-hosted anywhere" },
        ],
        initial: 0,
      },
      {
        type: "confirm",
        name: "enableDashboard",
        message: "Enable earnings dashboard?",
        initial: true,
      },
      {
        type: "confirm",
        name: "registerX402Scan",
        message: "Auto-register on x402scan.com for discoverability?",
        initial: true,
      },
    ]);
  }

  // Step 4: Generate smart pricing based on project analysis
  const suggestedPricing = await generateSmartPricing(detection.type, answers.pricingModel, detection.routes);

  if (!options.yes && Object.keys(suggestedPricing).length > 0) {
    console.log(chalk.cyan("\n📊 Suggested pricing based on your project:\n"));
    for (const [route, price] of Object.entries(suggestedPricing)) {
      console.log(`  ${chalk.dim(route)}: ${chalk.green(price)}`);
    }
    
    const { acceptPricing } = await prompt<{ acceptPricing: boolean }>([
      {
        type: "confirm",
        name: "acceptPricing",
        message: "Accept suggested pricing?",
        initial: true,
      },
    ]);

    if (!acceptPricing) {
      console.log(chalk.dim("\nYou can edit pricing in x402.config.json after initialization.\n"));
    }
  }

  // Step 5: Build config
  const config: X402Config = {
    $schema: "https://x402.org/schema/config.json",
    version: "1.0.0",
    name: detection.name || answers.name || path.basename(process.cwd()),
    type: detection.type,
    entrypoint: detection.entryPoint,
    
    payment: {
      wallet: answers.wallet as `0x${string}`,
      network: answers.network as any,
      token: "USDC",
      facilitator: "https://facilitator.x402.dev",
    },

    pricing: {
      model: answers.pricingModel,
      default: answers.defaultPrice,
      routes: suggestedPricing,
    },

    deploy: {
      provider: answers.deployProvider as any,
      region: "us-east-1",
      scaling: {
        min: 1,
        max: 10,
        targetCPU: 70,
      },
      env: {},
    },

    discovery: {
      enabled: answers.registerX402Scan,
      autoRegister: answers.registerX402Scan,
      instructions: `${detection.name || answers.name || path.basename(process.cwd())} - Monetized with x402`,
    },

    dashboard: {
      enabled: answers.enableDashboard,
    },
  };

  // Step 6: Write config
  const writeSpinner = ora("Writing configuration...").start();
  await fs.writeJSON(configPath, config, { spaces: 2 });
  writeSpinner.succeed("Created x402.config.json");

  // Step 7: Success message
  console.log(chalk.green(`
╔═══════════════════════════════════════════════════════════════╗
║                                                               ║
║   ✅ x402 initialized successfully!                          ║
║                                                               ║
║   Next steps:                                                 ║
║   ${chalk.cyan("1.")} Review x402.config.json                              ║
║   ${chalk.cyan("2.")} Run ${chalk.yellow("npx x402-deploy deploy")} to deploy               ║
║   ${chalk.cyan("3.")} Start earning! 💰                                    ║
║                                                               ║
╚═══════════════════════════════════════════════════════════════╝
  `));

  // Show estimated earnings
  await showEarningsProjection(config);
}

async function generateSmartPricing(
  projectType: ProjectType,
  model: string,
  detectedRoutes?: string[]
): Promise<Record<string, string>> {
  const pricing: Record<string, string> = {};

  // First, add pricing for detected routes
  if (detectedRoutes && detectedRoutes.length > 0) {
    for (const route of detectedRoutes) {
      const routeLower = route.toLowerCase();
      
      // High-cost operations
      if (routeLower.includes("write") || routeLower.includes("send") || routeLower.includes("execute") || routeLower.includes("deploy")) {
        pricing[route] = "$0.05";
      }
      // Medium-cost operations  
      else if (routeLower.includes("sign") || routeLower.includes("trade") || routeLower.includes("swap") || routeLower.includes("create")) {
        pricing[route] = "$0.01";
      }
      // Read operations
      else if (routeLower.includes("get") || routeLower.includes("read") || routeLower.includes("list") || routeLower.includes("query")) {
        pricing[route] = "$0.0001";
      }
      // POST/PUT defaults
      else if (routeLower.startsWith("post") || routeLower.startsWith("put")) {
        pricing[route] = "$0.001";
      }
      // DELETE operations
      else if (routeLower.startsWith("delete")) {
        pricing[route] = "$0.005";
      }
      // Default
      else {
        pricing[route] = "$0.001";
      }
    }
  }

  // Add wildcard defaults based on project type if no routes detected
  if (Object.keys(pricing).length === 0) {
    if (projectType === "mcp-server") {
      pricing["tools/*"] = "$0.001";
      pricing["resources/*"] = "$0.0001";
      pricing["prompts/*"] = "$0.01";
    } else if (projectType === "express-api" || projectType === "fastapi" || projectType === "hono-api") {
      pricing["GET /*"] = "$0.0001";
      pricing["POST /*"] = "$0.001";
      pricing["PUT /*"] = "$0.001";
      pricing["DELETE /*"] = "$0.005";
    } else if (projectType === "nextjs") {
      pricing["GET /api/*"] = "$0.0001";
      pricing["POST /api/*"] = "$0.001";
    }
  }

  return pricing;
}

async function showEarningsProjection(config: X402Config) {
  // Calculate estimated revenue based on pricing
  const routes = config.pricing?.routes || {};
  const avgPrice = calculateAveragePrice(routes);
  
  console.log(chalk.dim(`
📈 Earnings Projection (based on similar APIs):

   Daily calls    Monthly Revenue
   ──────────────────────────────
   100 calls      ${chalk.green("$" + (100 * 30 * avgPrice).toFixed(0))}
   1,000 calls    ${chalk.green("$" + (1000 * 30 * avgPrice).toFixed(0))}
   10,000 calls   ${chalk.green("$" + (10000 * 30 * avgPrice).toFixed(0))}
   100,000 calls  ${chalk.green("$" + (100000 * 30 * avgPrice).toFixed(0))}

   Track real earnings: ${chalk.cyan("npx x402-deploy dashboard")}
  `));
}

function calculateAveragePrice(routes: Record<string, any>): number {
  const prices = Object.values(routes).map(p => {
    const priceStr = typeof p === "string" ? p : p.price;
    return parseFloat(priceStr.replace("$", "")) || 0.001;
  });
  
  if (prices.length === 0) return 0.001;
  return prices.reduce((a, b) => a + b, 0) / prices.length;
}
