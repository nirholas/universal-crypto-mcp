/**
 * Compare Command - Compare pricing and revenue across different configurations
 * Helps optimize your monetization strategy
 */

import chalk from "chalk";
import ora from "ora";
import fs from "fs-extra";
import path from "path";
import { prompt } from "enquirer";
import { X402ConfigSchema, X402Config } from "../../types/config.js";

interface CompareOptions {
  configs?: string[];
  output?: "table" | "json" | "chart";
}

interface ConfigComparison {
  name: string;
  path: string;
  routeCount: number;
  avgPrice: number;
  minPrice: number;
  maxPrice: number;
  network: string;
  estimatedRevenue: number;
}

export async function compareCommand(options: CompareOptions): Promise<void> {
  console.log(chalk.cyan(`
╔═══════════════════════════════════════════════════════════════╗
║   ⚖️  x402 Configuration Compare                              ║
╚═══════════════════════════════════════════════════════════════╝
  `));

  // Get configs to compare
  let configPaths: string[] = options.configs || [];
  
  if (configPaths.length === 0) {
    // Look for configs in common locations
    const possibleConfigs = [
      path.join(process.cwd(), "x402.config.json"),
      path.join(process.cwd(), "x402.config.dev.json"),
      path.join(process.cwd(), "x402.config.prod.json"),
      path.join(process.cwd(), "x402.config.staging.json"),
      path.join(process.cwd(), "config", "x402.config.json"),
    ];

    const existingConfigs: string[] = [];
    for (const configPath of possibleConfigs) {
      if (await fs.pathExists(configPath)) {
        existingConfigs.push(configPath);
      }
    }

    if (existingConfigs.length === 0) {
      console.log(chalk.yellow("\nNo x402 configurations found."));
      console.log(chalk.dim("\nYou can specify configs to compare with:"));
      console.log(chalk.dim("  x402-deploy compare --configs config1.json config2.json\n"));
      return;
    }

    if (existingConfigs.length === 1) {
      console.log(chalk.yellow("\nOnly one configuration found. Add more configs to compare:"));
      console.log(chalk.dim("  x402-deploy compare --configs config1.json config2.json\n"));
      
      // Still show analysis of single config
      const spinner = ora("Analyzing configuration...").start();
      const config = await loadAndAnalyze(existingConfigs[0]);
      spinner.succeed("Analysis complete");
      displaySingleConfigAnalysis(config);
      return;
    }

    // Let user select which configs to compare
    const { selected } = await prompt<{ selected: string[] }>([{
      type: "multiselect",
      name: "selected",
      message: "Select configurations to compare:",
      choices: existingConfigs.map(p => ({
        name: p,
        message: path.basename(p),
      })),
      min: 2,
    }]);
    
    configPaths = selected;
  }

  // Load and analyze configs
  const spinner = ora("Loading configurations...").start();
  const comparisons: ConfigComparison[] = [];

  for (const configPath of configPaths) {
    try {
      const comparison = await loadAndAnalyze(configPath);
      comparisons.push(comparison);
    } catch (error) {
      spinner.warn(`Failed to load ${configPath}: ${error}`);
    }
  }

  if (comparisons.length < 2) {
    spinner.fail("Need at least 2 valid configurations to compare");
    return;
  }

  spinner.succeed(`Loaded ${comparisons.length} configurations`);

  // Display comparison
  console.log(chalk.bold("\n📊 Configuration Comparison:\n"));
  displayComparisonTable(comparisons);

  // Insights
  console.log(chalk.bold("\n💡 Insights:\n"));
  displayInsights(comparisons);

  // Recommendations
  console.log(chalk.bold("\n📈 Recommendations:\n"));
  displayRecommendations(comparisons);

  // Export option
  if (options.output === "json") {
    const outputPath = path.join(process.cwd(), `comparison-${Date.now()}.json`);
    await fs.writeJSON(outputPath, comparisons, { spaces: 2 });
    console.log(chalk.green(`\n✅ Exported to ${outputPath}\n`));
  }
}

async function loadAndAnalyze(configPath: string): Promise<ConfigComparison> {
  const rawConfig = await fs.readJSON(configPath);
  const config = X402ConfigSchema.parse(rawConfig);
  
  const routes = Object.entries(config.pricing?.routes || {});
  const prices = routes.map(([_, pricing]) => {
    const priceStr = typeof pricing === "string" ? pricing : (pricing as any).price;
    return parseFloat(priceStr.replace("$", ""));
  });

  const avgPrice = prices.length > 0 ? prices.reduce((a, b) => a + b, 0) / prices.length : 0;
  const minPrice = prices.length > 0 ? Math.min(...prices) : 0;
  const maxPrice = prices.length > 0 ? Math.max(...prices) : 0;

  // Estimate monthly revenue (assume 10k calls/month per route)
  const estimatedRevenue = prices.reduce((total, price) => total + price * 10000, 0);

  return {
    name: config.name || path.basename(configPath, ".json"),
    path: configPath,
    routeCount: routes.length,
    avgPrice,
    minPrice,
    maxPrice,
    network: config.payment?.network || "unknown",
    estimatedRevenue,
  };
}

function displayComparisonTable(comparisons: ConfigComparison[]): void {
  const headers = ["Config", "Routes", "Avg Price", "Min", "Max", "Network", "Est. Monthly"];
  const colWidths = [15, 8, 12, 10, 10, 18, 15];

  // Header
  console.log(
    "  " + headers.map((h, i) => chalk.bold(h.padEnd(colWidths[i]))).join("")
  );
  console.log(chalk.dim("  " + "─".repeat(colWidths.reduce((a, b) => a + b, 0))));

  // Rows
  for (const comp of comparisons) {
    const networkShort = comp.network.length > 15 ? comp.network.slice(0, 15) + "…" : comp.network;
    
    console.log(
      "  " +
      chalk.cyan(comp.name.slice(0, 13).padEnd(colWidths[0])) +
      chalk.white(comp.routeCount.toString().padEnd(colWidths[1])) +
      chalk.green(("$" + comp.avgPrice.toFixed(4)).padEnd(colWidths[2])) +
      chalk.dim(("$" + comp.minPrice.toFixed(4)).padEnd(colWidths[3])) +
      chalk.dim(("$" + comp.maxPrice.toFixed(4)).padEnd(colWidths[4])) +
      chalk.dim(networkShort.padEnd(colWidths[5])) +
      chalk.green(("$" + comp.estimatedRevenue.toFixed(2)).padEnd(colWidths[6]))
    );
  }
}

function displayInsights(comparisons: ConfigComparison[]): void {
  // Find highest and lowest revenue potential
  const sorted = [...comparisons].sort((a, b) => b.estimatedRevenue - a.estimatedRevenue);
  const highest = sorted[0];
  const lowest = sorted[sorted.length - 1];

  if (highest.estimatedRevenue > lowest.estimatedRevenue) {
    const diff = highest.estimatedRevenue - lowest.estimatedRevenue;
    const pct = ((diff / lowest.estimatedRevenue) * 100).toFixed(0);
    console.log(`  📈 ${chalk.cyan(highest.name)} has ${chalk.green(pct + "%")} higher revenue potential than ${chalk.cyan(lowest.name)}`);
  }

  // Network comparison
  const networks = new Set(comparisons.map(c => c.network));
  if (networks.size > 1) {
    console.log(`  🌐 Configurations use ${chalk.cyan(networks.size)} different networks`);
    
    const hasTestnet = comparisons.some(c => c.network.includes("84532"));
    const hasMainnet = comparisons.some(c => !c.network.includes("84532"));
    
    if (hasTestnet && hasMainnet) {
      console.log(`  ⚠️  ${chalk.yellow("Warning:")} Mix of testnet and mainnet configurations detected`);
    }
  }

  // Price variance
  const allPrices = comparisons.flatMap(c => [c.minPrice, c.maxPrice]);
  const priceRange = Math.max(...allPrices) - Math.min(...allPrices);
  if (priceRange > 0.1) {
    console.log(`  💰 Price range varies significantly: ${chalk.green("$" + Math.min(...allPrices).toFixed(4))} to ${chalk.green("$" + Math.max(...allPrices).toFixed(4))}`);
  }

  // Route coverage
  const totalRoutes = comparisons.reduce((sum, c) => sum + c.routeCount, 0);
  const avgRoutes = totalRoutes / comparisons.length;
  console.log(`  🛣️  Average routes per config: ${chalk.cyan(avgRoutes.toFixed(1))}`);
}

function displayRecommendations(comparisons: ConfigComparison[]): void {
  const recommendations: string[] = [];

  // Check for testnet in production
  const testnetConfigs = comparisons.filter(c => c.network.includes("84532"));
  if (testnetConfigs.length > 0) {
    recommendations.push(`Consider switching ${chalk.cyan(testnetConfigs.map(c => c.name).join(", "))} to mainnet for production`);
  }

  // Check for low prices
  const lowPriceConfigs = comparisons.filter(c => c.avgPrice < 0.001);
  if (lowPriceConfigs.length > 0) {
    recommendations.push(`Review pricing for ${chalk.cyan(lowPriceConfigs.map(c => c.name).join(", "))} - prices may be too low`);
  }

  // Check for missing routes
  const noRouteConfigs = comparisons.filter(c => c.routeCount === 0);
  if (noRouteConfigs.length > 0) {
    recommendations.push(`Add route pricing to ${chalk.cyan(noRouteConfigs.map(c => c.name).join(", "))}`);
  }

  // Check price consistency
  const sorted = [...comparisons].sort((a, b) => a.avgPrice - b.avgPrice);
  if (sorted.length >= 2) {
    const priceRatio = sorted[sorted.length - 1].avgPrice / (sorted[0].avgPrice || 0.0001);
    if (priceRatio > 10) {
      recommendations.push(`Large price variance detected - consider standardizing across configurations`);
    }
  }

  if (recommendations.length === 0) {
    console.log("  ✅ No immediate recommendations - configurations look good!");
  } else {
    for (const rec of recommendations) {
      console.log(`  • ${rec}`);
    }
  }
  console.log();
}

function displaySingleConfigAnalysis(config: ConfigComparison): void {
  console.log(chalk.bold("\n📋 Configuration Analysis:\n"));
  
  console.log(`  ${chalk.dim("Name:")}           ${config.name}`);
  console.log(`  ${chalk.dim("Routes:")}         ${config.routeCount}`);
  console.log(`  ${chalk.dim("Average Price:")}  ${chalk.green("$" + config.avgPrice.toFixed(4))}`);
  console.log(`  ${chalk.dim("Price Range:")}    ${chalk.dim("$" + config.minPrice.toFixed(4))} - ${chalk.dim("$" + config.maxPrice.toFixed(4))}`);
  console.log(`  ${chalk.dim("Network:")}        ${config.network}`);
  console.log(`  ${chalk.dim("Est. Monthly:")}   ${chalk.green("$" + config.estimatedRevenue.toFixed(2))}`);

  console.log(chalk.bold("\n💡 To compare configurations:\n"));
  console.log(chalk.dim("  Create additional configs like x402.config.prod.json"));
  console.log(chalk.dim("  Then run: x402-deploy compare\n"));
}
