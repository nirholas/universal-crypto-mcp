# Agent 1: CLI & User Experience

## Role
You are the **CLI & UX Agent** responsible for building an exceptional command-line experience for x402-deploy. Your goal is to make monetizing APIs as simple as `npx x402-deploy`.

## Repository Context
```
Repository: nirholas/universal-crypto-mcp
Working Directory: /workspaces/universal-crypto-mcp/x402-deploy
Your Files: src/cli/**/*
```

## Current State
The CLI has basic structure with these commands:
- `init` - Initialize config
- `deploy` - Deploy project
- `pricing` - Update pricing
- `dashboard` - View earnings
- `status` - Check health
- `logs` - View logs

## Your Mission
Transform this into a **world-class CLI** that developers love using.

---

## Task 1: Enhanced Init Command

**File: `src/cli/commands/init.ts`**

Create an interactive, intelligent initialization:

```typescript
import { Command } from "commander";
import inquirer from "inquirer";
import chalk from "chalk";
import ora from "ora";
import { detectProject, ProjectType } from "../../utils/detect.js";
import { generateOwnershipProof } from "../../discovery/ownership.js";
import { X402Config } from "../../types/config.js";
import { writeFile, readFile, access } from "fs/promises";
import { join } from "path";

interface InitOptions {
  yes?: boolean;
  wallet?: string;
  network?: string;
  template?: string;
}

export async function initCommand(options: InitOptions) {
  console.log(chalk.cyan("\n🚀 Initializing x402 monetization...\n"));

  // Step 1: Detect project type
  const spinner = ora("Detecting project type...").start();
  const detection = await detectProject(process.cwd());
  spinner.succeed(`Detected: ${chalk.green(detection.type)} project`);

  // Show what was detected
  console.log(chalk.dim(`
  Framework: ${detection.framework || "unknown"}
  Language:  ${detection.language}
  Entry:     ${detection.entryPoint || "not found"}
  `));

  // Step 2: Check for existing config
  const configPath = join(process.cwd(), "x402.config.json");
  let existingConfig: Partial<X402Config> = {};
  
  try {
    await access(configPath);
    const content = await readFile(configPath, "utf-8");
    existingConfig = JSON.parse(content);
    console.log(chalk.yellow("⚠️  Found existing x402.config.json - will merge settings\n"));
  } catch {
    // No existing config
  }

  // Step 3: Interactive prompts (unless --yes)
  let answers: Record<string, any>;
  
  if (options.yes) {
    answers = {
      wallet: options.wallet || existingConfig.payment?.wallet || "",
      network: options.network || "base-sepolia",
      pricingModel: "per-call",
      defaultPrice: "$0.001",
      deployProvider: "railway",
      enableDashboard: true,
      registerX402Scan: true,
    };
  } else {
    answers = await inquirer.prompt([
      {
        type: "input",
        name: "wallet",
        message: "Wallet address to receive payments:",
        default: existingConfig.payment?.wallet || options.wallet,
        validate: (input) => {
          if (!input) return "Wallet address is required";
          if (!/^0x[a-fA-F0-9]{40}$/.test(input)) return "Invalid Ethereum address";
          return true;
        },
      },
      {
        type: "list",
        name: "network",
        message: "Which network for payments?",
        choices: [
          { name: "Base Sepolia (testnet) - Free to test", value: "base-sepolia" },
          { name: "Base Mainnet - Production ready", value: "base" },
          { name: "Arbitrum One - Low fees", value: "arbitrum" },
          { name: "Ethereum Mainnet - Maximum security", value: "ethereum" },
          { name: "Polygon - Ultra low fees", value: "polygon" },
        ],
        default: existingConfig.payment?.network || "base-sepolia",
      },
      {
        type: "list",
        name: "pricingModel",
        message: "How do you want to charge?",
        choices: [
          { name: "Per API call - Charge for each request", value: "per-call" },
          { name: "Tiered - Different prices for different endpoints", value: "tiered" },
          { name: "Subscription - Time-based access passes", value: "subscription" },
          { name: "Hybrid - Mix of per-call and subscriptions", value: "hybrid" },
        ],
        default: "per-call",
      },
      {
        type: "input",
        name: "defaultPrice",
        message: "Default price per API call:",
        default: "$0.001",
        validate: (input) => {
          if (!/^\$?\d+\.?\d*$/.test(input)) return "Enter a valid price (e.g., $0.01)";
          return true;
        },
      },
      {
        type: "list",
        name: "deployProvider",
        message: "Where do you want to deploy?",
        choices: [
          { name: "Railway - Easiest, great free tier", value: "railway" },
          { name: "Fly.io - Global edge deployment", value: "fly" },
          { name: "Vercel - Serverless functions", value: "vercel" },
          { name: "Docker - Self-hosted anywhere", value: "docker" },
          { name: "AWS Lambda - Serverless at scale", value: "aws" },
        ],
        default: "railway",
      },
      {
        type: "confirm",
        name: "enableDashboard",
        message: "Enable earnings dashboard?",
        default: true,
      },
      {
        type: "confirm",
        name: "registerX402Scan",
        message: "Auto-register on x402scan.com for discoverability?",
        default: true,
      },
    ]);
  }

  // Step 4: Generate smart pricing based on project analysis
  const suggestedPricing = await generateSmartPricing(detection, answers.pricingModel);

  if (!options.yes) {
    console.log(chalk.cyan("\n📊 Suggested pricing based on your project:\n"));
    for (const [route, price] of Object.entries(suggestedPricing)) {
      console.log(`  ${chalk.dim(route)}: ${chalk.green(price)}`);
    }
    
    const { acceptPricing } = await inquirer.prompt([
      {
        type: "confirm",
        name: "acceptPricing",
        message: "Accept suggested pricing?",
        default: true,
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
    name: detection.name || "my-api",
    
    project: {
      type: detection.type,
      framework: detection.framework,
      language: detection.language,
      entryPoint: detection.entryPoint,
    },

    payment: {
      wallet: answers.wallet,
      network: networkToChainId(answers.network),
      token: "USDC",
      facilitator: "https://x402.org/facilitator",
    },

    pricing: {
      model: answers.pricingModel,
      default: {
        price: answers.defaultPrice,
        currency: "USD",
      },
      routes: suggestedPricing,
    },

    deploy: {
      provider: answers.deployProvider,
      region: "us-east-1",
      scaling: {
        min: 1,
        max: 10,
        targetCPU: 70,
      },
      environment: {},
    },

    discovery: {
      enabled: answers.registerX402Scan,
      autoRegister: answers.registerX402Scan,
      instructions: `${detection.name || "API"} - Monetized with x402`,
    },

    dashboard: {
      enabled: answers.enableDashboard,
      webhooks: [],
    },
  };

  // Step 6: Write config
  const writeSpinner = ora("Writing configuration...").start();
  await writeFile(configPath, JSON.stringify(config, null, 2));
  writeSpinner.succeed("Created x402.config.json");

  // Step 7: Generate wrapper code if needed
  if (detection.type === "mcp-server" || detection.type === "express" || detection.type === "fastapi") {
    const wrapperSpinner = ora("Generating x402 wrapper...").start();
    await generateWrapperCode(detection, config);
    wrapperSpinner.succeed("Generated x402 wrapper code");
  }

  // Step 8: Success message
  console.log(chalk.green(`
╔═══════════════════════════════════════════════════════════════╗
║                                                               ║
║   ✅ x402 initialized successfully!                          ║
║                                                               ║
║   Next steps:                                                 ║
║   ${chalk.cyan("1.")} Review x402.config.json                              ║
║   ${chalk.cyan("2.")} Run ${chalk.yellow("npx x402-deploy")} to deploy                       ║
║   ${chalk.cyan("3.")} Start earning! 💰                                    ║
║                                                               ║
╚═══════════════════════════════════════════════════════════════╝
  `));

  // Show estimated earnings
  await showEarningsProjection(config);
}

async function generateSmartPricing(
  detection: ProjectType,
  model: string
): Promise<Record<string, string>> {
  const pricing: Record<string, string> = {};

  // Analyze routes/tools from the project
  if (detection.routes) {
    for (const route of detection.routes) {
      // Price based on route complexity
      if (route.includes("write") || route.includes("send") || route.includes("execute")) {
        pricing[route] = "$0.05";
      } else if (route.includes("sign") || route.includes("trade")) {
        pricing[route] = "$0.01";
      } else if (route.includes("get") || route.includes("read") || route.includes("list")) {
        pricing[route] = "$0.0001";
      } else {
        pricing[route] = "$0.001";
      }
    }
  }

  // Add defaults based on project type
  if (detection.type === "mcp-server") {
    pricing["tools/*"] = "$0.001";
    pricing["resources/*"] = "$0.0001";
    pricing["prompts/*"] = "$0.01";
  } else if (detection.type === "express" || detection.type === "fastapi") {
    pricing["GET /*"] = "$0.0001";
    pricing["POST /*"] = "$0.001";
    pricing["PUT /*"] = "$0.001";
    pricing["DELETE /*"] = "$0.005";
  }

  return pricing;
}

function networkToChainId(network: string): string {
  const chains: Record<string, string> = {
    "base-sepolia": "eip155:84532",
    "base": "eip155:8453",
    "arbitrum": "eip155:42161",
    "ethereum": "eip155:1",
    "polygon": "eip155:137",
  };
  return chains[network] || "eip155:84532";
}

async function generateWrapperCode(detection: ProjectType, config: X402Config) {
  // This will be implemented by Agent 3 (Templates)
  // For now, create a placeholder
}

async function showEarningsProjection(config: X402Config) {
  console.log(chalk.dim(`
📈 Earnings Projection (based on similar APIs):

   Daily calls    Monthly Revenue
   ──────────────────────────────
   100 calls      ${chalk.green("$3")}
   1,000 calls    ${chalk.green("$30")}
   10,000 calls   ${chalk.green("$300")}
   100,000 calls  ${chalk.green("$3,000")}

   Track real earnings: ${chalk.cyan("npx x402-deploy dashboard")}
  `));
}
```

---

## Task 2: Interactive Deploy Command

**File: `src/cli/commands/deploy.ts`**

```typescript
import { Command } from "commander";
import inquirer from "inquirer";
import chalk from "chalk";
import ora from "ora";
import { loadConfig } from "../../utils/config.js";
import { buildProject } from "../../builders/index.js";
import { deployToProvider } from "../../deployers/index.js";
import { registerWithX402Scan } from "../../discovery/register.js";
import { generateOwnershipProof } from "../../discovery/ownership.js";

interface DeployOptions {
  provider?: string;
  dryRun?: boolean;
  discovery?: boolean;
  env?: string;
}

export async function deployCommand(options: DeployOptions) {
  console.log(chalk.cyan("\n🚀 Starting deployment...\n"));

  // Step 1: Load and validate config
  const configSpinner = ora("Loading configuration...").start();
  let config;
  try {
    config = await loadConfig();
    configSpinner.succeed("Configuration loaded");
  } catch (error) {
    configSpinner.fail("No x402.config.json found");
    console.log(chalk.yellow("\nRun 'x402-deploy init' first to set up your project.\n"));
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
  const { confirm } = await inquirer.prompt([
    {
      type: "confirm",
      name: "confirm",
      message: "Proceed with deployment?",
      default: true,
    },
  ]);

  if (!confirm) {
    console.log(chalk.dim("\nDeployment cancelled.\n"));
    return;
  }

  // Step 5: Build project
  const buildSpinner = ora("Building project...").start();
  try {
    const buildResult = await buildProject(config);
    buildSpinner.succeed(`Built successfully (${buildResult.duration}ms)`);
  } catch (error) {
    buildSpinner.fail("Build failed");
    console.error(chalk.red(`\n${error}\n`));
    process.exit(1);
  }

  // Step 6: Deploy
  const deploySpinner = ora(`Deploying to ${provider}...`).start();
  let deployResult;
  try {
    deployResult = await deployToProvider(provider, config);
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
      // Generate ownership proof
      const ownershipProof = await generateOwnershipProof(
        deployResult.url,
        config.payment.wallet
      );
      
      await registerWithX402Scan({
        url: deployResult.url,
        resources: Object.keys(config.pricing?.routes || {}),
        ownershipProof,
        instructions: config.discovery.instructions,
      });
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

async function showDryRunPlan(config: any, provider: string) {
  console.log(chalk.dim("Would perform the following actions:\n"));
  console.log(`  1. Build ${config.project?.type || "project"} with x402 wrapper`);
  console.log(`  2. Generate Dockerfile and deployment config`);
  console.log(`  3. Deploy to ${provider}`);
  console.log(`  4. Configure custom domain (if available)`);
  console.log(`  5. Generate /.well-known/x402 discovery document`);
  if (config.discovery?.enabled) {
    console.log(`  6. Register ${Object.keys(config.pricing?.routes || {}).length} endpoints on x402scan`);
  }
  console.log();
}
```

---

## Task 3: New Commands to Add

Create these additional commands:

### `src/cli/commands/test.ts` - Test monetization locally
```typescript
import chalk from "chalk";
import ora from "ora";
import { loadConfig } from "../../utils/config.js";
import { createLocalServer } from "../../gateway/index.js";

export async function testCommand(options: { port?: number }) {
  const port = options.port || 3402;
  
  console.log(chalk.cyan("\n🧪 Starting local test server...\n"));
  
  const config = await loadConfig();
  const server = await createLocalServer(config, { testMode: true });
  
  server.listen(port, () => {
    console.log(chalk.green(`
╔═══════════════════════════════════════════════════════════════╗
║   🧪 Test Server Running                                      ║
║                                                               ║
║   URL: ${chalk.cyan(`http://localhost:${port}`.padEnd(47))}║
║                                                               ║
║   Test payment flow:                                          ║
║   ${chalk.dim(`curl http://localhost:${port}/api/test`.padEnd(55))}║
║                                                               ║
║   Press Ctrl+C to stop                                        ║
╚═══════════════════════════════════════════════════════════════╝
    `));
  });
}
```

### `src/cli/commands/upgrade.ts` - Upgrade existing projects
```typescript
import chalk from "chalk";
import inquirer from "inquirer";
import ora from "ora";
import { detectProject } from "../../utils/detect.js";
import { loadConfig } from "../../utils/config.js";

export async function upgradeCommand() {
  console.log(chalk.cyan("\n⬆️  Upgrading x402 configuration...\n"));
  
  const config = await loadConfig();
  const detection = await detectProject(process.cwd());
  
  // Check for new routes/tools
  const newRoutes = detection.routes?.filter(
    route => !config.pricing?.routes?.[route]
  ) || [];
  
  if (newRoutes.length > 0) {
    console.log(chalk.yellow(`Found ${newRoutes.length} new routes:\n`));
    for (const route of newRoutes) {
      console.log(`  ${chalk.dim("+")} ${route}`);
    }
    
    const { addRoutes } = await inquirer.prompt([{
      type: "confirm",
      name: "addRoutes",
      message: "Add pricing for new routes?",
      default: true,
    }]);
    
    if (addRoutes) {
      // Add new routes with default pricing
      // Implementation continues...
    }
  }
}
```

### `src/cli/commands/withdraw.ts` - Withdraw earnings
```typescript
import chalk from "chalk";
import inquirer from "inquirer";
import ora from "ora";
import { loadConfig } from "../../utils/config.js";
import { getEarnings } from "../../dashboard/analytics.js";

export async function withdrawCommand() {
  console.log(chalk.cyan("\n💸 Withdraw Earnings\n"));
  
  const config = await loadConfig();
  const earnings = await getEarnings(config.payment.wallet);
  
  console.log(`  Available: ${chalk.green("$" + earnings.available.toFixed(2))}`);
  console.log(`  Pending:   ${chalk.yellow("$" + earnings.pending.toFixed(2))}`);
  console.log();
  
  if (earnings.available < 1) {
    console.log(chalk.dim("Minimum withdrawal is $1.00\n"));
    return;
  }
  
  const { confirm } = await inquirer.prompt([{
    type: "confirm",
    name: "confirm",
    message: `Withdraw $${earnings.available.toFixed(2)} to ${config.payment.wallet.slice(0, 10)}...?`,
    default: true,
  }]);
  
  if (confirm) {
    const spinner = ora("Processing withdrawal...").start();
    // Withdrawal logic
    spinner.succeed("Withdrawal initiated!");
  }
}
```

---

## Task 4: Update CLI Index

**File: `src/cli/index.ts`** - Add all new commands:

```typescript
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
  .version("1.0.0");

// Core commands
program.command("init").description("Initialize x402 in your project").action(initCommand);
program.command("deploy").description("Deploy with payments enabled").action(deployCommand);
program.command("test").description("Test monetization locally").action(testCommand);

// Management commands  
program.command("pricing").description("Configure pricing").action(pricingCommand);
program.command("dashboard").description("View earnings").action(dashboardCommand);
program.command("status").description("Check deployment health").action(statusCommand);
program.command("logs").description("View logs").action(logsCommand);

// Advanced commands
program.command("upgrade").description("Upgrade x402 configuration").action(upgradeCommand);
program.command("withdraw").description("Withdraw earnings").action(withdrawCommand);

// Quick aliases
program.command("d").description("Alias for deploy").action(deployCommand);
program.command("s").description("Alias for status").action(statusCommand);

program.parse();
```

---

## Deliverables Checklist

- [ ] Enhanced `init` command with smart detection
- [ ] Interactive `deploy` command with dry-run
- [ ] New `test` command for local testing
- [ ] New `upgrade` command for existing projects
- [ ] New `withdraw` command for earnings
- [ ] Beautiful CLI output with ASCII art
- [ ] Proper error handling throughout
- [ ] Help text for all commands

## Dependencies to Add
```json
{
  "dependencies": {
    "commander": "^12.0.0",
    "inquirer": "^9.0.0",
    "chalk": "^5.0.0",
    "ora": "^8.0.0",
    "boxen": "^7.0.0",
    "gradient-string": "^2.0.0"
  }
}
```
