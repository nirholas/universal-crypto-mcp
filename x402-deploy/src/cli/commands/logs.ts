import chalk from "chalk";
import ora from "ora";
import fs from "fs-extra";
import path from "path";
import { X402ConfigSchema } from "../../types/config.js";

interface LogsOptions {
  follow?: boolean;
  lines?: string;
}

interface LogEntry {
  timestamp: string;
  level: "info" | "warn" | "error" | "debug";
  message: string;
  route?: string;
  payer?: string;
  amount?: string;
}

export async function logsCommand(options: LogsOptions): Promise<void> {
  console.log(chalk.bold("\n📝 Deployment Logs\n"));

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

  const lineCount = parseInt(options.lines || "100", 10);
  const deploymentUrl = process.env.X402_DEPLOYMENT_URL || config.deploy?.domain;
  
  if (!deploymentUrl) {
    // Check for local logs
    const logsDir = path.join(process.cwd(), ".x402", "logs");
    if (await fs.pathExists(logsDir)) {
      await displayLocalLogs(logsDir, lineCount);
    } else {
      console.log(chalk.yellow("\n⚠️  No deployment URL configured and no local logs found.\n"));
      console.log(chalk.dim("Deploy your project first with: npx x402-deploy deploy"));
      console.log(chalk.dim("Or run locally with: npx x402-deploy test\n"));
    }
    return;
  }

  // Fetch logs from deployment
  spinner.start(`Fetching logs from ${config.name}...`);

  try {
    const logsUrl = `${deploymentUrl}/.x402/logs?limit=${lineCount}`;
    const response = await fetch(logsUrl, {
      headers: {
        "Authorization": `Bearer ${process.env.X402_API_KEY || ""}`,
      },
      signal: AbortSignal.timeout(10000),
    });

    if (!response.ok) {
      throw new Error(`Failed to fetch logs: ${response.statusText}`);
    }

    const logs: LogEntry[] = await response.json();
    spinner.succeed(`Fetched ${logs.length} log entries`);

    displayLogs(logs);

    if (options.follow) {
      console.log(chalk.dim("\n--- Following logs (Ctrl+C to stop) ---\n"));
      await followLogs(deploymentUrl, config.name);
    }
  } catch (error) {
    spinner.fail("Failed to fetch logs");
    
    // Fall back to local logs if available
    const logsDir = path.join(process.cwd(), ".x402", "logs");
    if (await fs.pathExists(logsDir)) {
      console.log(chalk.yellow("\nFalling back to local logs...\n"));
      await displayLocalLogs(logsDir, lineCount);
    } else {
      console.error(chalk.red(`\n${error}\n`));
      console.log(chalk.dim("Tip: Set X402_API_KEY for authenticated log access."));
    }
  }
}

function displayLogs(logs: LogEntry[]): void {
  if (logs.length === 0) {
    console.log(chalk.dim("\nNo logs found.\n"));
    return;
  }

  console.log();
  for (const log of logs) {
    const time = chalk.dim(new Date(log.timestamp).toLocaleTimeString());
    const level = formatLevel(log.level);
    let message = log.message;

    // Enhance payment-related logs
    if (log.payer && log.amount) {
      message += chalk.cyan(` [${log.payer.slice(0, 8)}... → ${log.amount}]`);
    }
    if (log.route) {
      message += chalk.dim(` (${log.route})`);
    }

    console.log(`${time} ${level} ${message}`);
  }
  console.log();
}

function formatLevel(level: string): string {
  switch (level) {
    case "error":
      return chalk.red("[ERR]");
    case "warn":
      return chalk.yellow("[WRN]");
    case "info":
      return chalk.blue("[INF]");
    case "debug":
      return chalk.dim("[DBG]");
    default:
      return chalk.white(`[${level.toUpperCase().slice(0, 3)}]`);
  }
}

async function displayLocalLogs(logsDir: string, lineCount: number): Promise<void> {
  const logFile = path.join(logsDir, "app.log");
  
  if (!await fs.pathExists(logFile)) {
    console.log(chalk.dim("\nNo local logs found.\n"));
    return;
  }

  const content = await fs.readFile(logFile, "utf-8");
  const lines = content.trim().split("\n").slice(-lineCount);
  
  console.log(chalk.cyan(`\n📄 Local logs (${lines.length} lines):\n`));
  
  for (const line of lines) {
    try {
      const log: LogEntry = JSON.parse(line);
      const time = chalk.dim(new Date(log.timestamp).toLocaleTimeString());
      const level = formatLevel(log.level);
      console.log(`${time} ${level} ${log.message}`);
    } catch {
      // Plain text log line
      console.log(chalk.dim(line));
    }
  }
  console.log();
}

async function followLogs(deploymentUrl: string, projectName: string): Promise<void> {
  // Set up SSE connection for real-time logs
  const logsUrl = `${deploymentUrl}/.x402/logs/stream`;
  
  try {
    const response = await fetch(logsUrl, {
      headers: {
        "Authorization": `Bearer ${process.env.X402_API_KEY || ""}`,
        "Accept": "text/event-stream",
      },
    });

    if (!response.ok) {
      throw new Error(`Stream connection failed: ${response.statusText}`);
    }

    const reader = response.body?.getReader();
    if (!reader) {
      throw new Error("No response body");
    }

    const decoder = new TextDecoder();
    
    while (true) {
      const { done, value } = await reader.read();
      if (done) break;
      
      const text = decoder.decode(value);
      const lines = text.split("\n").filter(l => l.startsWith("data:"));
      
      for (const line of lines) {
        try {
          const log: LogEntry = JSON.parse(line.slice(5));
          const time = chalk.dim(new Date(log.timestamp).toLocaleTimeString());
          const level = formatLevel(log.level);
          console.log(`${time} ${level} ${log.message}`);
        } catch {
          // Ignore parse errors
        }
      }
    }
  } catch (error) {
    console.log(chalk.yellow("\nStream disconnected. Retrying in 5s...\n"));
    await new Promise(resolve => setTimeout(resolve, 5000));
    return followLogs(deploymentUrl, projectName);
  }
}
