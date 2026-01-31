/**
 * Enterprise Gateway Configuration
 */

import { z } from "zod";
import dotenv from "dotenv";

dotenv.config();

const configSchema = z.object({
  server: z.object({
    name: z.string().default("Universal Crypto MCP"),
    version: z.string().default("1.0.0"),
    description: z.string().default("Enterprise-grade crypto MCP servers with x402 payments"),
    port: z.number().default(3000),
    corsOrigins: z.array(z.string()).default(["*"]),
    testMode: z.boolean().default(false),
  }),

  payment: z.object({
    wallet: z.string().min(1, "Payment wallet address required"),
    network: z.string().default("eip155:8453"), // Base mainnet
    token: z.string().default("USDC"),
    facilitator: z.string().default("https://facilitator.x402.org"),
  }),

  pricing: z.object({
    default: z.object({
      price: z.string().default("0.001"), // $0.001 per request
      description: z.string().default("Per API request"),
    }),
    tiers: z.array(z.object({
      route: z.string(),
      price: z.string(),
      description: z.string().optional(),
    })).default([
      { route: "POST /mcp", price: "0.001", description: "MCP tool call" },
      { route: "trading_*", price: "0.005", description: "Trading operations" },
      { route: "defi_*", price: "0.003", description: "DeFi operations" },
      { route: "market_*", price: "0.001", description: "Market data" },
    ]),
    subscriptions: z.array(z.object({
      id: z.string(),
      name: z.string(),
      price: z.string(),
      period: z.string(),
      requests: z.number(),
    })).default([
      { id: "starter", name: "Starter", price: "9.99", period: "month", requests: 10000 },
      { id: "pro", name: "Pro", price: "49.99", period: "month", requests: 100000 },
      { id: "enterprise", name: "Enterprise", price: "199.99", period: "month", requests: 1000000 },
    ]),
  }),

  rateLimit: z.object({
    enabled: z.boolean().default(true),
    maxRequests: z.number().default(100),
    windowSeconds: z.number().default(60),
    perPayer: z.boolean().default(true),
    redisUrl: z.string().optional(),
  }),

  database: z.object({
    url: z.string().optional(),
    type: z.enum(["sqlite", "postgres", "mysql"]).default("sqlite"),
  }),

  monitoring: z.object({
    prometheusEnabled: z.boolean().default(true),
    alertsEnabled: z.boolean().default(true),
    slackWebhook: z.string().optional(),
    pagerdutyKey: z.string().optional(),
  }),

  security: z.object({
    jwtSecret: z.string().optional(),
    apiKeyEnabled: z.boolean().default(false),
    ipWhitelist: z.array(z.string()).default([]),
  }),
});

export type Config = z.infer<typeof configSchema>;

function loadConfig(): Config {
  return configSchema.parse({
    server: {
      name: process.env.SERVER_NAME || "Universal Crypto MCP",
      version: process.env.SERVER_VERSION || "1.0.0",
      description: process.env.SERVER_DESCRIPTION || "Enterprise-grade crypto MCP servers with x402 payments",
      port: parseInt(process.env.PORT || "3000", 10),
      corsOrigins: process.env.CORS_ORIGINS?.split(",") || ["*"],
      testMode: process.env.TEST_MODE === "true",
    },
    payment: {
      wallet: process.env.PAYMENT_WALLET || "",
      network: process.env.PAYMENT_NETWORK || "eip155:8453",
      token: process.env.PAYMENT_TOKEN || "USDC",
      facilitator: process.env.X402_FACILITATOR || "https://facilitator.x402.org",
    },
    pricing: {
      default: {
        price: process.env.DEFAULT_PRICE || "0.001",
        description: "Per API request",
      },
      tiers: JSON.parse(process.env.PRICING_TIERS || "[]").length > 0 
        ? JSON.parse(process.env.PRICING_TIERS || "[]")
        : undefined,
      subscriptions: JSON.parse(process.env.SUBSCRIPTIONS || "[]").length > 0
        ? JSON.parse(process.env.SUBSCRIPTIONS || "[]")
        : undefined,
    },
    rateLimit: {
      enabled: process.env.RATE_LIMIT_ENABLED !== "false",
      maxRequests: parseInt(process.env.RATE_LIMIT_MAX || "100", 10),
      windowSeconds: parseInt(process.env.RATE_LIMIT_WINDOW || "60", 10),
      perPayer: process.env.RATE_LIMIT_PER_PAYER !== "false",
      redisUrl: process.env.REDIS_URL,
    },
    database: {
      url: process.env.DATABASE_URL,
      type: (process.env.DATABASE_TYPE as any) || "sqlite",
    },
    monitoring: {
      prometheusEnabled: process.env.PROMETHEUS_ENABLED !== "false",
      alertsEnabled: process.env.ALERTS_ENABLED !== "false",
      slackWebhook: process.env.SLACK_WEBHOOK,
      pagerdutyKey: process.env.PAGERDUTY_KEY,
    },
    security: {
      jwtSecret: process.env.JWT_SECRET,
      apiKeyEnabled: process.env.API_KEY_ENABLED === "true",
      ipWhitelist: process.env.IP_WHITELIST?.split(",") || [],
    },
  });
}

export const config = loadConfig();

