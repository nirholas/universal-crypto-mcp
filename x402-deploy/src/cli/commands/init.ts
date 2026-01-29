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
import { detectProjectType } from "../../utils/detect.js";
import { generateOwnershipProof } from "../../utils/crypto.js";

interface InitOptions {
  yes?: boolean;
  wallet?: string;
  network?: string;
}

export async function initCommand(options: InitOptions): Promise<void> {
  const spinner = ora();
  
  console.log(chalk.bold("\n🚀 Initializing x402 Deploy\n"));
  
  // Check if config already exists
  const configPath = path.join(process.cwd(), "x402.config.json");
  if (await fs.pathExists(configPath)) {
    const { overwrite } = await prompt<{ overwrite: boolean }>({
      type: "confirm",
      name: "overwrite",
      message: "x402.config.json already exists. Overwrite?",
      initial: false,
    });
    if (!overwrite) {
      console.log(chalk.yellow("Cancelled."));
      return;
    }
  }
  
  // Detect project type
  spinner.start("Detecting project type...");
  const projectType = await detectProjectType(process.cwd());
  spinner.succeed(`Detected: ${chalk.cyan(projectType)}`);
  
  let config: Partial<X402Config>;
  
  if (options.yes) {
    // Use defaults with provided options
    config = {
      ...DEFAULT_CONFIG,
      name: path.basename(process.cwd()),
      type: projectType,
      payment: {
        wallet: options.wallet || "0x0000000000000000000000000000000000000000",
        network: (options.network as any) || "eip155:42161",
        token: "USDC",
      },
    };
  } else {
    // Interactive prompts
    const answers = await prompt<{
      name: string;
      wallet: string;
      network: string;
      defaultPrice: string;
      enableDiscovery: boolean;
      provider: string;
    }>([
      {
        type: "input",
        name: "name",
        message: "Project name:",
        initial: path.basename(process.cwd()),
      },
      {
        type: "input",
        name: "wallet",
        message: "Wallet address (receives payments):",
        initial: options.wallet || process.env.X402_WALLET,
        validate: (value) => {
          if (!value.match(/^0x[a-fA-F0-9]{40}$/)) {
            return "Invalid Ethereum address";
          }
          return true;
        },
      },
      {
        type: "select",
        name: "network",
        message: "Blockchain network:",
        choices: [
          { name: "eip155:42161", message: "Arbitrum One (recommended - low fees)" },
          { name: "eip155:8453", message: "Base (Coinbase L2)" },
          { name: "eip155:84532", message: "Base Sepolia (testnet)" },
          { name: "eip155:137", message: "Polygon" },
          { name: "eip155:10", message: "Optimism" },
        ],
        initial: 0,
      },
      {
        type: "input",
        name: "defaultPrice",
        message: "Default price per API call:",
        initial: "$0.001",
      },
      {
        type: "confirm",
        name: "enableDiscovery",
        message: "Enable x402scan discovery?",
        initial: true,
      },
      {
        type: "select",
        name: "provider",
        message: "Deployment provider:",
        choices: [
          { name: "railway", message: "Railway (recommended)" },
          { name: "fly", message: "Fly.io" },
          { name: "vercel", message: "Vercel (for Next.js)" },
          { name: "docker", message: "Docker (self-hosted)" },
        ],
        initial: 0,
      },
    ]);
    
    config = {
      ...DEFAULT_CONFIG,
      name: answers.name,
      type: projectType,
      payment: {
        wallet: answers.wallet as `0x${string}`,
        network: answers.network as any,
        token: "USDC",
      },
      pricing: {
        model: "per-call",
        default: answers.defaultPrice,
      },
      discovery: {
        enabled: answers.enableDiscovery,
        autoRegister: answers.enableDiscovery,
      },
      deploy: {
        provider: answers.provider as any,
      },
    };
  }
  
  // Validate configuration
  try {
    X402ConfigSchema.parse(config);
  } catch (error) {
    console.error(chalk.red("Invalid configuration:"), error);
    return;
  }
  
  // Write configuration
  spinner.start("Writing configuration...");
  await fs.writeJSON(configPath, config, { spaces: 2 });
  spinner.succeed("Configuration saved to x402.config.json");
  
  // Generate suggested routes based on project type
  console.log(chalk.bold("\n📋 Suggested next steps:\n"));
  console.log(`  1. Edit ${chalk.cyan("x402.config.json")} to configure pricing per route`);
  console.log(`  2. Run ${chalk.cyan("npx x402-deploy deploy")} to deploy`);
  console.log(`  3. Run ${chalk.cyan("npx x402-deploy dashboard")} to view earnings`);
  
  if (projectType === "mcp-server") {
    console.log(chalk.dim("\n  Example route pricing for MCP servers:"));
    console.log(chalk.dim(`    "POST /mcp/tools/*": "$0.001"`));
    console.log(chalk.dim(`    "POST /mcp/premium/*": "$0.01"`));
  }
  
  console.log();
}
