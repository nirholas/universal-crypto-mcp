/**
 * Import Command - Import x402 configuration from various sources
 * Supports migrations from other payment systems
 */

import chalk from "chalk";
import ora from "ora";
import fs from "fs-extra";
import path from "path";
import { prompt } from "enquirer";
import { X402ConfigSchema, X402Config } from "../../types/config.js";

interface ImportOptions {
  source?: string;
  force?: boolean;
  merge?: boolean;
}

export async function importCommand(options: ImportOptions): Promise<void> {
  console.log(chalk.cyan(`
╔═══════════════════════════════════════════════════════════════╗
║   📥 x402 Import                                              ║
╚═══════════════════════════════════════════════════════════════╝
  `));

  const configPath = path.join(process.cwd(), "x402.config.json");
  const configExists = await fs.pathExists(configPath);

  if (configExists && !options.force && !options.merge) {
    const { action } = await prompt<{ action: string }>([{
      type: "select",
      name: "action",
      message: "x402.config.json already exists. What would you like to do?",
      choices: [
        { name: "merge", message: "Merge with existing config" },
        { name: "replace", message: "Replace existing config" },
        { name: "cancel", message: "Cancel import" },
      ],
    }]);

    if (action === "cancel") {
      console.log(chalk.yellow("\nImport cancelled.\n"));
      return;
    }
    options.merge = action === "merge";
    options.force = action === "replace";
  }

  // Determine source
  let sourcePath = options.source;
  
  if (!sourcePath) {
    const { sourceType } = await prompt<{ sourceType: string }>([{
      type: "select",
      name: "sourceType",
      message: "Select import source:",
      choices: [
        { name: "file", message: "JSON/YAML file" },
        { name: "env", message: "Environment variables" },
        { name: "stripe", message: "Migrate from Stripe (coming soon)" },
        { name: "url", message: "Remote URL" },
      ],
    }]);

    if (sourceType === "stripe") {
      console.log(chalk.yellow("\n⚠️  Stripe migration coming soon!\n"));
      console.log(chalk.dim("For now, you can manually create pricing based on your Stripe products."));
      console.log(chalk.dim("Run 'x402-deploy init' to get started.\n"));
      return;
    }

    if (sourceType === "env") {
      await importFromEnv(configPath, options);
      return;
    }

    if (sourceType === "url") {
      const { url } = await prompt<{ url: string }>([{
        type: "input",
        name: "url",
        message: "Enter URL:",
        validate: (v: string) => v.startsWith("http") || "Enter a valid URL",
      }]);
      sourcePath = url;
    } else {
      const { filePath } = await prompt<{ filePath: string }>([{
        type: "input",
        name: "filePath",
        message: "Enter file path:",
        initial: "./x402.config.json",
      }]);
      sourcePath = filePath;
    }
  }

  // Ensure sourcePath is defined
  if (!sourcePath) {
    console.error(chalk.red("\n❌ No source path specified\n"));
    process.exit(1);
  }

  // Load source
  const spinner = ora("Loading source...").start();
  
  let importedConfig: Partial<X402Config>;
  
  try {
    if (sourcePath.startsWith("http")) {
      const response = await fetch(sourcePath);
      if (!response.ok) {
        throw new Error(`HTTP ${response.status}`);
      }
      const text = await response.text();
      importedConfig = parseConfig(text, sourcePath);
    } else {
      const resolvedPath = path.resolve(sourcePath);
      if (!await fs.pathExists(resolvedPath)) {
        throw new Error(`File not found: ${resolvedPath}`);
      }
      const content = await fs.readFile(resolvedPath, "utf-8");
      importedConfig = parseConfig(content, sourcePath);
    }
    spinner.succeed("Source loaded");
  } catch (error) {
    spinner.fail("Failed to load source");
    console.error(chalk.red(`\n${error}\n`));
    process.exit(1);
  }

  // Merge or replace
  let finalConfig: X402Config;
  
  if (options.merge && configExists) {
    spinner.start("Merging configurations...");
    const existingConfig = await fs.readJSON(configPath);
    finalConfig = deepMerge(existingConfig, importedConfig) as X402Config;
    spinner.succeed("Configurations merged");
  } else {
    finalConfig = importedConfig as X402Config;
  }

  // Validate
  spinner.start("Validating configuration...");
  try {
    X402ConfigSchema.parse(finalConfig);
    spinner.succeed("Configuration valid");
  } catch (error: any) {
    spinner.warn("Configuration has issues");
    console.log(chalk.yellow(`\n⚠️  Validation warnings:\n${error.message}\n`));
    
    const { proceed } = await prompt<{ proceed: boolean }>([{
      type: "confirm",
      name: "proceed",
      message: "Save anyway?",
      initial: false,
    }]);
    
    if (!proceed) {
      console.log(chalk.yellow("\nImport cancelled.\n"));
      return;
    }
  }

  // Save
  spinner.start("Saving configuration...");
  await fs.writeJSON(configPath, finalConfig, { spaces: 2 });
  spinner.succeed("Configuration saved");

  console.log(chalk.green("\n✅ Configuration imported successfully!\n"));

  // Show summary
  console.log(chalk.bold("📋 Import Summary:\n"));
  console.log(`  ${chalk.dim("Name:")}    ${finalConfig.name || "Not set"}`);
  console.log(`  ${chalk.dim("Type:")}    ${finalConfig.type || "Not set"}`);
  console.log(`  ${chalk.dim("Wallet:")}  ${finalConfig.payment?.wallet?.slice(0, 10) || "Not set"}...`);
  console.log(`  ${chalk.dim("Network:")} ${finalConfig.payment?.network || "Not set"}`);
  
  const routeCount = Object.keys(finalConfig.pricing?.routes || {}).length;
  console.log(`  ${chalk.dim("Routes:")}  ${routeCount} configured`);
  console.log();
}

async function importFromEnv(configPath: string, options: ImportOptions): Promise<void> {
  const spinner = ora("Reading environment variables...").start();
  
  const config: Partial<X402Config> = {
    name: process.env.X402_PROJECT_NAME || "api",
    type: (process.env.X402_PROJECT_TYPE || "express") as any,
    payment: {
      wallet: process.env.X402_WALLET || "",
      network: process.env.X402_NETWORK || "eip155:8453",
      token: process.env.X402_TOKEN || "USDC",
      facilitator: process.env.X402_FACILITATOR || "https://facilitator.x402.dev",
    },
    pricing: {
      default: process.env.X402_DEFAULT_PRICE || "$0.001",
      routes: {},
    },
  };

  // Read route environment variables
  let i = 0;
  while (process.env[`X402_ROUTE_${i}_PATTERN`]) {
    const pattern = process.env[`X402_ROUTE_${i}_PATTERN`]!;
    const price = process.env[`X402_ROUTE_${i}_PRICE`] || "$0.001";
    config.pricing!.routes![pattern] = price;
    i++;
  }

  if (process.env.X402_DISCOVERY_ENABLED === "true") {
    config.discovery = {
      enabled: true,
      instructions: process.env.X402_DISCOVERY_INSTRUCTIONS || "",
    };
  }

  spinner.succeed(`Found ${Object.keys(config.pricing?.routes || {}).length} routes from environment`);

  // Handle merge
  if (options.merge && await fs.pathExists(configPath)) {
    const existing = await fs.readJSON(configPath);
    const merged = deepMerge(existing, config);
    await fs.writeJSON(configPath, merged, { spaces: 2 });
  } else {
    await fs.writeJSON(configPath, config, { spaces: 2 });
  }

  console.log(chalk.green("\n✅ Configuration imported from environment variables!\n"));
}

function parseConfig(content: string, source: string): Partial<X402Config> {
  // Try JSON first
  try {
    return JSON.parse(content);
  } catch {
    // Try YAML-like parsing
  }

  // Simple YAML parsing
  if (source.endsWith(".yaml") || source.endsWith(".yml")) {
    const config: any = {};
    const lines = content.split("\n");
    let currentPath: string[] = [];
    
    for (const line of lines) {
      if (line.trim().startsWith("#") || !line.trim()) continue;
      
      const match = line.match(/^(\s*)(\w+):\s*(.*)$/);
      if (match) {
        const indent = match[1].length / 2;
        const key = match[2];
        const value = match[3].trim();
        
        currentPath = currentPath.slice(0, indent);
        currentPath.push(key);
        
        if (value && !value.includes(":")) {
          setNestedValue(config, currentPath, parseYAMLValue(value));
        }
      }
    }
    
    return config;
  }

  throw new Error("Unable to parse configuration format");
}

function parseYAMLValue(value: string): any {
  if (value === "true") return true;
  if (value === "false") return false;
  if (value === "null") return null;
  if (/^\d+$/.test(value)) return parseInt(value, 10);
  if (/^\d+\.\d+$/.test(value)) return parseFloat(value);
  return value.replace(/^["']|["']$/g, "");
}

function setNestedValue(obj: any, path: string[], value: any): void {
  let current = obj;
  for (let i = 0; i < path.length - 1; i++) {
    if (!current[path[i]]) current[path[i]] = {};
    current = current[path[i]];
  }
  current[path[path.length - 1]] = value;
}

function deepMerge(target: any, source: any): any {
  const result = { ...target };
  
  for (const key of Object.keys(source)) {
    if (source[key] && typeof source[key] === "object" && !Array.isArray(source[key])) {
      result[key] = deepMerge(target[key] || {}, source[key]);
    } else if (source[key] !== undefined) {
      result[key] = source[key];
    }
  }
  
  return result;
}
