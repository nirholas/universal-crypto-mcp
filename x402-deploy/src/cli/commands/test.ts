import chalk from "chalk";
import ora from "ora";
import fs from "fs-extra";
import path from "path";
import express, { Request, Response, NextFunction } from "express";
import { X402Config, X402ConfigSchema } from "../../types/config.js";
import { x402Middleware } from "../../gateway/middleware.js";
import { getPriceForRoute } from "../../gateway/helpers.js";

interface TestOptions {
  port?: number;
}

export async function testCommand(options: TestOptions): Promise<void> {
  const port = options.port || 3402;
  
  console.log(chalk.cyan("\n🧪 Starting local test server...\n"));
  
  // Load config
  const configPath = path.join(process.cwd(), "x402.config.json");
  if (!await fs.pathExists(configPath)) {
    console.error(chalk.red("No x402.config.json found. Run 'x402-deploy init' first."));
    process.exit(1);
  }
  
  const spinner = ora("Loading configuration...").start();
  let config: X402Config;
  try {
    const rawConfig = await fs.readJSON(configPath);
    config = X402ConfigSchema.parse(rawConfig);
    spinner.succeed("Configuration loaded");
  } catch (error) {
    spinner.fail("Failed to load configuration");
    console.error(chalk.red(`\n${error}\n`));
    process.exit(1);
  }

  // Create test server with x402 middleware
  const app = express();
  
  // Parse JSON bodies
  app.use(express.json());
  
  // Request logging middleware
  app.use((req: Request, _res: Response, next: NextFunction) => {
    const pricing = getPriceForRoute(`${req.method} ${req.path}`, config);
    const priceStr = pricing ? chalk.cyan(`(${pricing.price})`) : chalk.dim("(free)");
    console.log(chalk.dim(`[${new Date().toLocaleTimeString()}]`) + ` ${req.method} ${req.path} ${priceStr}`);
    next();
  });
  
  // Health check endpoint (no payment required)
  app.get("/health", (_req: Request, res: Response) => {
    res.json({ 
      status: "ok", 
      testMode: true,
      project: config.name,
      network: config.payment.network,
    });
  });
  
  // /.well-known/x402 discovery endpoint
  app.get("/.well-known/x402", (_req: Request, res: Response) => {
    res.json({
      version: "1.0.0",
      payTo: config.payment.wallet,
      network: config.payment.network,
      token: config.payment.token || "USDC",
      facilitator: config.payment.facilitator,
      pricing: config.pricing?.routes || {},
      testMode: true,
    });
  });

  // Apply x402 payment middleware to protected routes
  app.use("/api", x402Middleware({
    config,
    testMode: true,
    onPaymentVerified: (payment) => {
      console.log(chalk.green(`✓ Payment verified: ${payment.payer.slice(0, 10)}... paid ${payment.amount}`));
    },
    onPaymentFailed: (error) => {
      console.log(chalk.yellow(`⚠ Payment failed: ${error.message}`));
    },
  }));

  // Test API routes (protected by x402)
  app.get("/api/test", (_req: Request, res: Response) => {
    res.json({ 
      message: "Test endpoint - payment verified!", 
      timestamp: new Date().toISOString(),
      testMode: true,
    });
  });

  app.post("/api/test", (req: Request, res: Response) => {
    res.json({ 
      message: "POST test endpoint - payment verified!", 
      receivedData: req.body,
      timestamp: new Date().toISOString(),
    });
  });
  
  // Echo endpoint for testing
  app.all("/api/echo", (req: Request, res: Response) => {
    res.json({
      method: req.method,
      path: req.path,
      query: req.query,
      headers: req.headers,
      body: req.body,
    });
  });

  // Start server
  const server = app.listen(port, () => {
    console.log(chalk.green(`
╔═══════════════════════════════════════════════════════════════╗
║   🧪 Test Server Running                                      ║
║                                                               ║
║   URL: ${chalk.cyan(`http://localhost:${port}`.padEnd(47))}║
║                                                               ║
║   Endpoints:                                                  ║
║   ${chalk.dim(`GET  /health`.padEnd(56))}║
║   ${chalk.dim(`GET  /.well-known/x402`.padEnd(56))}║
║   ${chalk.dim(`GET  /api/test (protected)`.padEnd(56))}║
║   ${chalk.dim(`POST /api/test (protected)`.padEnd(56))}║
║   ${chalk.dim(`ALL  /api/echo (protected)`.padEnd(56))}║
║                                                               ║
║   ${chalk.yellow("Test mode:")} No real transactions                        ║
║                                                               ║
║   Press Ctrl+C to stop                                        ║
╚═══════════════════════════════════════════════════════════════╝
    `));
    
    console.log(chalk.cyan("\nConfiguration:"));
    console.log(`  Project: ${config.name}`);
    console.log(`  Network: ${config.payment.network}`);
    console.log(`  Wallet:  ${config.payment.wallet}`);
    console.log(`  Routes:  ${Object.keys(config.pricing?.routes || {}).length} configured`);
    console.log(chalk.dim("\nTest commands:"));
    console.log(chalk.dim(`  curl http://localhost:${port}/health`));
    console.log(chalk.dim(`  curl http://localhost:${port}/.well-known/x402`));
    console.log(chalk.dim(`  curl http://localhost:${port}/api/test`));
    console.log();
  });

  // Handle shutdown gracefully
  process.on("SIGINT", () => {
    console.log(chalk.yellow("\n\nShutting down test server..."));
    server.close(() => {
      console.log(chalk.green("Server stopped"));
      process.exit(0);
    });
  });
}
