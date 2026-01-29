/**
 * Doctor Command - Diagnose and fix common issues with x402 configuration
 * Comprehensive health check and auto-repair functionality
 */

import chalk from "chalk";
import ora from "ora";
import fs from "fs-extra";
import path from "path";
import { prompt } from "enquirer";
import { X402ConfigSchema, X402Config, ProjectType } from "../../types/config.js";
import { detectProject } from "../../utils/detect.js";

interface DoctorOptions {
  fix?: boolean;
  verbose?: boolean;
}

interface DiagnosticResult {
  name: string;
  status: "pass" | "warn" | "fail";
  message: string;
  fix?: () => Promise<void>;
  fixDescription?: string;
}

export async function doctorCommand(options: DoctorOptions): Promise<void> {
  console.log(chalk.cyan(`
╔═══════════════════════════════════════════════════════════════╗
║   🩺 x402 Doctor - Diagnose & Fix Issues                      ║
╚═══════════════════════════════════════════════════════════════╝
  `));

  const spinner = ora("Running diagnostics...").start();
  const results: DiagnosticResult[] = [];

  const configPath = path.join(process.cwd(), "x402.config.json");

  // 1. Check if config exists
  const configExists = await fs.pathExists(configPath);
  if (!configExists) {
    spinner.fail("Configuration not found");
    console.log(chalk.red("\n❌ No x402.config.json found."));
    console.log(chalk.yellow("\nRun 'x402-deploy init' to create one.\n"));
    return;
  }

  // Load config
  let config: X402Config;
  let configValid = true;
  try {
    const rawConfig = await fs.readJSON(configPath);
    config = X402ConfigSchema.parse(rawConfig);
  } catch (error) {
    spinner.fail("Configuration invalid");
    results.push({
      name: "Configuration Schema",
      status: "fail",
      message: `Invalid config: ${error}`,
    });
    configValid = false;
    config = {} as X402Config;
  }

  if (configValid) {
    results.push({
      name: "Configuration Schema",
      status: "pass",
      message: "x402.config.json is valid",
    });
  }

  // 2. Check wallet address
  if (config.payment?.wallet) {
    if (/^0x[a-fA-F0-9]{40}$/.test(config.payment.wallet)) {
      if (config.payment.wallet === "0x0000000000000000000000000000000000000000") {
        results.push({
          name: "Wallet Address",
          status: "warn",
          message: "Wallet is zero address - payments won't work",
          fixDescription: "Set a valid wallet address",
        });
      } else {
        results.push({
          name: "Wallet Address",
          status: "pass",
          message: `Valid: ${config.payment.wallet.slice(0, 10)}...`,
        });
      }
    } else {
      results.push({
        name: "Wallet Address",
        status: "fail",
        message: "Invalid Ethereum address format",
      });
    }
  } else {
    results.push({
      name: "Wallet Address",
      status: "fail",
      message: "No wallet address configured",
    });
  }

  // 3. Check network
  const validNetworks = ["eip155:1", "eip155:42161", "eip155:8453", "eip155:84532", "eip155:137", "eip155:10"];
  if (config.payment?.network) {
    if (validNetworks.includes(config.payment.network)) {
      const isTestnet = config.payment.network.includes("84532");
      results.push({
        name: "Network Configuration",
        status: isTestnet ? "warn" : "pass",
        message: isTestnet 
          ? `Testnet configured (${config.payment.network}) - switch to mainnet for production`
          : `Production network: ${config.payment.network}`,
      });
    } else {
      results.push({
        name: "Network Configuration",
        status: "warn",
        message: `Unknown network: ${config.payment.network}`,
      });
    }
  } else {
    results.push({
      name: "Network Configuration",
      status: "fail",
      message: "No network configured",
    });
  }

  // 4. Check pricing
  const routes = Object.keys(config.pricing?.routes || {});
  if (routes.length > 0) {
    results.push({
      name: "Pricing Configuration",
      status: "pass",
      message: `${routes.length} route(s) configured`,
    });
    
    // Validate each price
    let invalidPrices = 0;
    for (const [route, pricing] of Object.entries(config.pricing?.routes || {})) {
      const priceStr = typeof pricing === "string" ? pricing : (pricing as any).price;
      if (!/^\$?\d+\.?\d*$/.test(priceStr)) {
        invalidPrices++;
      }
    }
    
    if (invalidPrices > 0) {
      results.push({
        name: "Price Formats",
        status: "warn",
        message: `${invalidPrices} route(s) have invalid price format`,
      });
    }
  } else {
    results.push({
      name: "Pricing Configuration",
      status: "warn",
      message: "No routes configured - all endpoints will be free",
      fixDescription: "Add pricing with: x402-deploy pricing --interactive",
    });
  }

  // 5. Check facilitator
  if (config.payment?.facilitator) {
    results.push({
      name: "Facilitator URL",
      status: "pass",
      message: config.payment.facilitator,
    });
    
    // Test facilitator connectivity
    try {
      const response = await fetch(`${config.payment.facilitator}/health`, {
        signal: AbortSignal.timeout(5000),
      });
      if (response.ok) {
        results.push({
          name: "Facilitator Connection",
          status: "pass",
          message: "Facilitator is reachable",
        });
      } else {
        results.push({
          name: "Facilitator Connection",
          status: "warn",
          message: `Facilitator returned status ${response.status}`,
        });
      }
    } catch {
      results.push({
        name: "Facilitator Connection",
        status: "warn",
        message: "Could not reach facilitator (may be offline or blocked)",
      });
    }
  } else {
    results.push({
      name: "Facilitator URL",
      status: "warn",
      message: "No facilitator configured - using default",
      fix: async () => {
        config.payment.facilitator = "https://facilitator.x402.dev";
        await fs.writeJSON(configPath, config, { spaces: 2 });
      },
      fixDescription: "Add default facilitator URL",
    });
  }

  // 6. Check project type detection
  const detection = await detectProject(process.cwd());
  if (config.type && config.type !== detection.type && detection.type !== "unknown") {
    results.push({
      name: "Project Type",
      status: "warn",
      message: `Config says ${config.type}, detected ${detection.type}`,
      fix: async () => {
        config.type = detection.type;
        await fs.writeJSON(configPath, config, { spaces: 2 });
      },
      fixDescription: `Update project type to ${detection.type}`,
    });
  } else if (detection.type !== "unknown") {
    results.push({
      name: "Project Type",
      status: "pass",
      message: `Detected: ${detection.type}`,
    });
  }

  // 7. Check for .gitignore
  const gitignorePath = path.join(process.cwd(), ".gitignore");
  if (await fs.pathExists(gitignorePath)) {
    const gitignoreContent = await fs.readFile(gitignorePath, "utf-8");
    if (!gitignoreContent.includes(".x402")) {
      results.push({
        name: "Git Ignore",
        status: "warn",
        message: ".x402 directory not in .gitignore",
        fix: async () => {
          await fs.appendFile(gitignorePath, "\n# x402 local data\n.x402/\n");
        },
        fixDescription: "Add .x402/ to .gitignore",
      });
    } else {
      results.push({
        name: "Git Ignore",
        status: "pass",
        message: ".x402 directory is ignored",
      });
    }
  }

  // 8. Check for package.json dependencies (if Node.js project)
  const packageJsonPath = path.join(process.cwd(), "package.json");
  if (await fs.pathExists(packageJsonPath)) {
    const pkg = await fs.readJSON(packageJsonPath);
    const deps = { ...pkg.dependencies, ...pkg.devDependencies };
    
    if (!deps["@x402/server"] && !deps["@x402/express"] && !deps["@x402/hono"]) {
      results.push({
        name: "x402 SDK",
        status: "warn",
        message: "No x402 SDK package found in dependencies",
        fixDescription: "Install with: npm install @x402/express",
      });
    } else {
      results.push({
        name: "x402 SDK",
        status: "pass",
        message: "x402 SDK installed",
      });
    }
  }

  // 9. Check schema reference
  if (!config.$schema) {
    results.push({
      name: "JSON Schema",
      status: "warn",
      message: "No $schema reference for editor support",
      fix: async () => {
        config.$schema = "https://x402.org/schema/config.json";
        await fs.writeJSON(configPath, config, { spaces: 2 });
      },
      fixDescription: "Add schema reference for IDE support",
    });
  } else {
    results.push({
      name: "JSON Schema",
      status: "pass",
      message: "Schema reference present",
    });
  }

  // 10. Check for discovery configuration
  if (config.discovery?.enabled && !config.discovery?.instructions) {
    results.push({
      name: "Discovery Config",
      status: "warn",
      message: "Discovery enabled but no instructions set",
      fix: async () => {
        config.discovery!.instructions = `${config.name} API - Monetized with x402`;
        await fs.writeJSON(configPath, config, { spaces: 2 });
      },
      fixDescription: "Add discovery instructions",
    });
  }

  spinner.succeed("Diagnostics complete");

  // Display results
  console.log(chalk.bold("\n📋 Diagnostic Results:\n"));

  const passCount = results.filter(r => r.status === "pass").length;
  const warnCount = results.filter(r => r.status === "warn").length;
  const failCount = results.filter(r => r.status === "fail").length;

  for (const result of results) {
    const icon = result.status === "pass" ? chalk.green("✓") 
               : result.status === "warn" ? chalk.yellow("⚠")
               : chalk.red("✗");
    
    const color = result.status === "pass" ? chalk.green 
                : result.status === "warn" ? chalk.yellow 
                : chalk.red;

    console.log(`  ${icon} ${chalk.white(result.name.padEnd(25))} ${color(result.message)}`);
    
    if (options.verbose && result.fixDescription) {
      console.log(chalk.dim(`    └─ Fix: ${result.fixDescription}`));
    }
  }

  // Summary
  console.log(chalk.bold("\n📊 Summary:\n"));
  console.log(`  ${chalk.green("✓ " + passCount + " passed")}  ${chalk.yellow("⚠ " + warnCount + " warnings")}  ${chalk.red("✗ " + failCount + " failed")}`);

  // Auto-fix option
  const fixableIssues = results.filter(r => r.fix && (r.status === "warn" || r.status === "fail"));
  
  if (fixableIssues.length > 0 && (options.fix || !options.fix)) {
    console.log(chalk.bold(`\n🔧 ${fixableIssues.length} issue(s) can be auto-fixed:\n`));
    
    for (const issue of fixableIssues) {
      console.log(`  • ${issue.name}: ${issue.fixDescription}`);
    }

    if (options.fix) {
      console.log(chalk.cyan("\nApplying fixes..."));
      for (const issue of fixableIssues) {
        if (issue.fix) {
          try {
            await issue.fix();
            console.log(chalk.green(`  ✓ Fixed: ${issue.name}`));
          } catch (error) {
            console.log(chalk.red(`  ✗ Failed to fix: ${issue.name}`));
          }
        }
      }
      console.log(chalk.green("\n✅ Fixes applied!\n"));
    } else {
      const { applyFixes } = await prompt<{ applyFixes: boolean }>([{
        type: "confirm",
        name: "applyFixes",
        message: "Apply auto-fixes?",
        initial: true,
      }]);

      if (applyFixes) {
        console.log(chalk.cyan("\nApplying fixes..."));
        for (const issue of fixableIssues) {
          if (issue.fix) {
            try {
              await issue.fix();
              console.log(chalk.green(`  ✓ Fixed: ${issue.name}`));
            } catch (error) {
              console.log(chalk.red(`  ✗ Failed to fix: ${issue.name}`));
            }
          }
        }
        console.log(chalk.green("\n✅ Fixes applied!\n"));
      }
    }
  }

  // Final status
  if (failCount === 0 && warnCount === 0) {
    console.log(chalk.green("\n🎉 All checks passed! Your x402 configuration is healthy.\n"));
  } else if (failCount === 0) {
    console.log(chalk.yellow("\n⚠️  Configuration is valid but has some warnings.\n"));
  } else {
    console.log(chalk.red("\n❌ Configuration has critical issues that need to be fixed.\n"));
  }
}
