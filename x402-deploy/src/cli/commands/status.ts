import chalk from "chalk";
import ora from "ora";
import fs from "fs-extra";
import path from "path";
import { X402ConfigSchema } from "../../types/config.js";

interface HealthCheck {
  name: string;
  status: "ok" | "warning" | "error";
  message: string;
  latency?: number;
}

export async function statusCommand(): Promise<void> {
  console.log(chalk.bold("\n📡 Deployment Status\n"));

  const configPath = path.join(process.cwd(), "x402.config.json");
  
  // Check if config exists
  if (!await fs.pathExists(configPath)) {
    console.error(chalk.red("No x402.config.json found. Run 'x402-deploy init' first."));
    process.exit(1);
  }

  const spinner = ora("Loading configuration...").start();
  let config;
  try {
    const rawConfig = await fs.readJSON(configPath);
    config = X402ConfigSchema.parse(rawConfig);
    spinner.succeed("Configuration loaded");
  } catch (error) {
    spinner.fail("Invalid configuration");
    console.error(chalk.red(`\n${error}\n`));
    process.exit(1);
  }

  console.log(chalk.cyan("\n📋 Project Info:\n"));
  console.log(`  Name:     ${chalk.white(config.name)}`);
  console.log(`  Type:     ${chalk.white(config.type || "unknown")}`);
  console.log(`  Network:  ${chalk.white(config.payment.network)}`);
  console.log(`  Wallet:   ${chalk.white(config.payment.wallet.slice(0, 10) + "...")}`);

  const checks: HealthCheck[] = [];

  // Check 1: Configuration validity
  checks.push({
    name: "Configuration",
    status: "ok",
    message: "Valid x402.config.json",
  });

  // Check 2: Wallet address
  if (config.payment.wallet && /^0x[a-fA-F0-9]{40}$/.test(config.payment.wallet)) {
    checks.push({
      name: "Wallet",
      status: "ok",
      message: `Configured: ${config.payment.wallet.slice(0, 10)}...`,
    });
  } else {
    checks.push({
      name: "Wallet",
      status: "error",
      message: "Invalid wallet address",
    });
  }

  // Check 3: Pricing configured
  const routeCount = Object.keys(config.pricing?.routes || {}).length;
  if (routeCount > 0) {
    checks.push({
      name: "Pricing",
      status: "ok",
      message: `${routeCount} routes configured`,
    });
  } else {
    checks.push({
      name: "Pricing",
      status: "warning",
      message: "No route pricing configured",
    });
  }

  // Check 4: Deployment endpoint (if deployed)
  const deploymentUrl = process.env.X402_DEPLOYMENT_URL || config.deploy?.domain;
  if (deploymentUrl) {
    const healthSpinner = ora("Checking deployment health...").start();
    try {
      const start = Date.now();
      const response = await fetch(`${deploymentUrl}/health`, {
        signal: AbortSignal.timeout(5000),
      });
      const latency = Date.now() - start;

      if (response.ok) {
        healthSpinner.succeed("Deployment health check passed");
        checks.push({
          name: "Deployment",
          status: "ok",
          message: `Live at ${deploymentUrl}`,
          latency,
        });
      } else {
        healthSpinner.warn("Deployment returned non-200 status");
        checks.push({
          name: "Deployment",
          status: "warning",
          message: `Status ${response.status}`,
          latency,
        });
      }
    } catch (error) {
      healthSpinner.fail("Could not reach deployment");
      checks.push({
        name: "Deployment",
        status: "error",
        message: "Unreachable",
      });
    }
  } else {
    checks.push({
      name: "Deployment",
      status: "warning",
      message: "Not deployed yet",
    });
  }

  // Check 5: Facilitator connectivity
  const facilitatorUrl = config.payment.facilitator || "https://facilitator.x402.dev";
  const facilitatorSpinner = ora("Checking facilitator...").start();
  try {
    const start = Date.now();
    const response = await fetch(`${facilitatorUrl}/health`, {
      signal: AbortSignal.timeout(5000),
    });
    const latency = Date.now() - start;

    if (response.ok) {
      facilitatorSpinner.succeed("Facilitator online");
      checks.push({
        name: "Facilitator",
        status: "ok",
        message: "Connected",
        latency,
      });
    } else {
      facilitatorSpinner.warn("Facilitator returned error");
      checks.push({
        name: "Facilitator",
        status: "warning",
        message: `Status ${response.status}`,
      });
    }
  } catch (error) {
    facilitatorSpinner.warn("Facilitator unreachable");
    checks.push({
      name: "Facilitator",
      status: "warning",
      message: "Could not connect",
    });
  }

  // Display results
  console.log(chalk.cyan("\n🔍 Health Checks:\n"));
  
  for (const check of checks) {
    const icon = check.status === "ok" ? chalk.green("✓") 
               : check.status === "warning" ? chalk.yellow("⚠")
               : chalk.red("✗");
    const latencyStr = check.latency ? chalk.dim(` (${check.latency}ms)`) : "";
    console.log(`  ${icon} ${chalk.white(check.name.padEnd(15))} ${check.message}${latencyStr}`);
  }

  // Summary
  const errorCount = checks.filter(c => c.status === "error").length;
  const warningCount = checks.filter(c => c.status === "warning").length;

  console.log();
  if (errorCount > 0) {
    console.log(chalk.red(`❌ ${errorCount} error(s) found. Fix before deploying.`));
  } else if (warningCount > 0) {
    console.log(chalk.yellow(`⚠️  ${warningCount} warning(s). Consider addressing before production.`));
  } else {
    console.log(chalk.green("✅ All checks passed! Ready for deployment."));
  }
  console.log();
}
