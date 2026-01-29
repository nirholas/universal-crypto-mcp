/**
 * Export Command - Export your x402 configuration and analytics for backup or migration
 * Supports multiple formats for different use cases
 */

import chalk from "chalk";
import ora from "ora";
import fs from "fs-extra";
import path from "path";
import { prompt } from "enquirer";
import { X402ConfigSchema } from "../../types/config.js";

interface ExportOptions {
  format?: "json" | "yaml" | "env" | "docker";
  output?: string;
  include?: string;
}

export async function exportCommand(options: ExportOptions): Promise<void> {
  console.log(chalk.cyan(`
╔═══════════════════════════════════════════════════════════════╗
║   📦 x402 Export                                              ║
╚═══════════════════════════════════════════════════════════════╝
  `));

  const configPath = path.join(process.cwd(), "x402.config.json");
  
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
    spinner.fail("Failed to load configuration");
    console.error(chalk.red(`\n${error}\n`));
    process.exit(1);
  }

  // Determine format
  let format = options.format;
  if (!format) {
    const answer = await prompt<{ format: string }>([{
      type: "select",
      name: "format",
      message: "Select export format:",
      choices: [
        { name: "json", message: "JSON - Portable configuration" },
        { name: "yaml", message: "YAML - Human-readable configuration" },
        { name: "env", message: "ENV - Environment variables" },
        { name: "docker", message: "Docker - docker-compose.yml snippet" },
      ],
    }]);
    format = answer.format as typeof format;
  }

  // Generate export content
  let content: string;
  let filename: string;

  switch (format) {
    case "json":
      content = JSON.stringify(config, null, 2);
      filename = `x402-export-${Date.now()}.json`;
      break;

    case "yaml":
      content = convertToYAML(config);
      filename = `x402-export-${Date.now()}.yaml`;
      break;

    case "env":
      content = convertToEnv(config);
      filename = `x402.env`;
      break;

    case "docker":
      content = convertToDocker(config);
      filename = `docker-compose.x402.yml`;
      break;

    default:
      content = JSON.stringify(config, null, 2);
      filename = `x402-export-${Date.now()}.json`;
  }

  // Write file
  const outputPath = options.output 
    ? path.resolve(options.output) 
    : path.join(process.cwd(), filename);

  await fs.writeFile(outputPath, content);

  console.log(chalk.green(`\n✅ Exported to: ${outputPath}\n`));

  // Show preview
  console.log(chalk.dim("Preview:"));
  console.log(chalk.dim("─".repeat(60)));
  const preview = content.split("\n").slice(0, 15).join("\n");
  console.log(preview);
  if (content.split("\n").length > 15) {
    console.log(chalk.dim(`\n... and ${content.split("\n").length - 15} more lines`));
  }
  console.log(chalk.dim("─".repeat(60)));
  console.log();
}

function convertToYAML(config: any): string {
  const lines: string[] = [];
  
  const writeValue = (value: any, indent: number): void => {
    const prefix = "  ".repeat(indent);
    
    if (value === null || value === undefined) {
      return;
    }
    
    if (typeof value === "object" && !Array.isArray(value)) {
      for (const [key, val] of Object.entries(value)) {
        if (typeof val === "object" && !Array.isArray(val)) {
          lines.push(`${prefix}${key}:`);
          writeValue(val, indent + 1);
        } else if (Array.isArray(val)) {
          lines.push(`${prefix}${key}:`);
          for (const item of val) {
            if (typeof item === "object") {
              lines.push(`${prefix}  -`);
              for (const [k, v] of Object.entries(item)) {
                lines.push(`${prefix}    ${k}: ${formatYAMLValue(v)}`);
              }
            } else {
              lines.push(`${prefix}  - ${formatYAMLValue(item)}`);
            }
          }
        } else {
          lines.push(`${prefix}${key}: ${formatYAMLValue(val)}`);
        }
      }
    }
  };

  lines.push("# x402 Configuration");
  lines.push("# Generated at " + new Date().toISOString());
  lines.push("");
  writeValue(config, 0);
  
  return lines.join("\n");
}

function formatYAMLValue(value: any): string {
  if (typeof value === "string") {
    if (value.includes(":") || value.includes("#") || value.includes("'")) {
      return `"${value.replace(/"/g, '\\"')}"`;
    }
    return value;
  }
  if (typeof value === "boolean") return value ? "true" : "false";
  if (typeof value === "number") return String(value);
  return String(value);
}

function convertToEnv(config: any): string {
  const lines: string[] = [
    "# x402 Configuration - Environment Variables",
    "# Generated at " + new Date().toISOString(),
    "",
    "# Project",
    `X402_PROJECT_NAME="${config.name || ""}"`,
    `X402_PROJECT_TYPE="${config.type || ""}"`,
    "",
    "# Payment",
    `X402_WALLET="${config.payment?.wallet || ""}"`,
    `X402_NETWORK="${config.payment?.network || ""}"`,
    `X402_TOKEN="${config.payment?.token || "USDC"}"`,
    `X402_FACILITATOR="${config.payment?.facilitator || "https://facilitator.x402.dev"}"`,
    "",
    "# Pricing",
    `X402_DEFAULT_PRICE="${config.pricing?.default || "$0.001"}"`,
    "",
  ];

  // Add route prices
  if (config.pricing?.routes) {
    lines.push("# Route Pricing");
    let i = 0;
    for (const [route, pricing] of Object.entries(config.pricing.routes)) {
      const priceStr = typeof pricing === "string" ? pricing : (pricing as any).price;
      lines.push(`X402_ROUTE_${i}_PATTERN="${route}"`);
      lines.push(`X402_ROUTE_${i}_PRICE="${priceStr}"`);
      i++;
    }
    lines.push("");
  }

  // Discovery
  if (config.discovery?.enabled) {
    lines.push("# Discovery");
    lines.push(`X402_DISCOVERY_ENABLED="true"`);
    lines.push(`X402_DISCOVERY_INSTRUCTIONS="${config.discovery.instructions || ""}"`);
    lines.push("");
  }

  return lines.join("\n");
}

function convertToDocker(config: any): string {
  const envVars = [
    `      - X402_PROJECT_NAME=${config.name || "api"}`,
    `      - X402_WALLET=${config.payment?.wallet || ""}`,
    `      - X402_NETWORK=${config.payment?.network || "eip155:8453"}`,
    `      - X402_TOKEN=${config.payment?.token || "USDC"}`,
    `      - X402_FACILITATOR=${config.payment?.facilitator || "https://facilitator.x402.dev"}`,
    `      - X402_DEFAULT_PRICE=${config.pricing?.default || "$0.001"}`,
  ];

  return `# x402 Docker Compose Configuration
# Generated at ${new Date().toISOString()}
# 
# Add this to your docker-compose.yml or use as a reference

version: '3.8'

services:
  api:
    # Your API service with x402 payments
    build:
      context: .
      dockerfile: Dockerfile
    ports:
      - "3000:3000"
    environment:
${envVars.join("\n")}
    healthcheck:
      test: ["CMD", "curl", "-f", "http://localhost:3000/.well-known/x402"]
      interval: 30s
      timeout: 10s
      retries: 3

# Optional: Add Prometheus for monitoring
#  prometheus:
#    image: prom/prometheus
#    ports:
#      - "9090:9090"
#    volumes:
#      - ./prometheus.yml:/etc/prometheus/prometheus.yml
`;
}
