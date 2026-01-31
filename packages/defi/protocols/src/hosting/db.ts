/**
 * Database Client for MCP Hosting Platform
 * @description PostgreSQL with Drizzle ORM
 * @author nirholas
 */

import { drizzle } from 'drizzle-orm/postgres-js';
import { pgTable, text, timestamp, integer, boolean, uuid, jsonb, decimal } from 'drizzle-orm/pg-core';
import { eq, and, sql } from 'drizzle-orm';
import postgres from 'postgres';

// ============================================================================
// Database Schema
// ============================================================================

export const users = pgTable('mcp_hosting_users', {
  id: uuid('id').primaryKey().defaultRandom(),
  email: text('email').notNull().unique(),
  username: text('username').notNull().unique(),
  passwordHash: text('password_hash').notNull(),
  tier: text('tier').notNull().default('free'), // free, pro, business, enterprise
  stripeCustomerId: text('stripe_customer_id'),
  stripeSubscriptionId: text('stripe_subscription_id'),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
});

export const hostedServers = pgTable('mcp_hosted_servers', {
  id: uuid('id').primaryKey().defaultRandom(),
  ownerId: uuid('owner_id').references(() => users.id).notNull(),
  name: text('name').notNull(),
  subdomain: text('subdomain').notNull().unique(),
  description: text('description'),
  sourceType: text('source_type').notNull(), // github, upload, registry
  sourceUrl: text('source_url'),
  sourceConfig: jsonb('source_config'),
  isActive: boolean('is_active').default(true).notNull(),
  isPublic: boolean('is_public').default(false).notNull(),
  totalCalls: integer('total_calls').default(0).notNull(),
  callsThisMonth: integer('calls_this_month').default(0).notNull(),
  revenueTotal: decimal('revenue_total', { precision: 20, scale: 6 }).default('0'),
  revenueThisMonth: decimal('revenue_this_month', { precision: 20, scale: 6 }).default('0'),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
});

export const hostedTools = pgTable('mcp_hosted_tools', {
  id: uuid('id').primaryKey().defaultRandom(),
  serverId: uuid('server_id').references(() => hostedServers.id).notNull(),
  name: text('name').notNull(),
  description: text('description'),
  inputSchema: jsonb('input_schema'),
  price: decimal('price', { precision: 20, scale: 6 }).default('0'),
  isPaid: boolean('is_paid').default(false).notNull(),
  toolType: text('tool_type').notNull().default('http'), // http, proxy, code
  endpoint: text('endpoint'),
  proxyTarget: text('proxy_target'),
  code: text('code'),
  callCount: integer('call_count').default(0).notNull(),
  createdAt: timestamp('created_at').defaultNow().notNull(),
});

export const usageLogs = pgTable('mcp_usage_logs', {
  id: uuid('id').primaryKey().defaultRandom(),
  serverId: uuid('server_id').references(() => hostedServers.id).notNull(),
  toolName: text('tool_name').notNull(),
  userId: uuid('user_id'),
  callerAddress: text('caller_address'),
  paymentAmount: decimal('payment_amount', { precision: 20, scale: 6 }),
  paymentTxHash: text('payment_tx_hash'),
  success: boolean('success').default(true).notNull(),
  errorMessage: text('error_message'),
  durationMs: integer('duration_ms'),
  timestamp: timestamp('timestamp').defaultNow().notNull(),
});

export const apiKeys = pgTable('mcp_api_keys', {
  id: uuid('id').primaryKey().defaultRandom(),
  userId: uuid('user_id').references(() => users.id).notNull(),
  name: text('name').notNull(),
  keyHash: text('key_hash').notNull(),
  keyPrefix: text('key_prefix').notNull(), // First 8 chars for identification
  lastUsed: timestamp('last_used'),
  expiresAt: timestamp('expires_at'),
  isActive: boolean('is_active').default(true).notNull(),
  createdAt: timestamp('created_at').defaultNow().notNull(),
});

// ============================================================================
// Database Connection
// ============================================================================

const DATABASE_URL = process.env.DATABASE_URL || 'postgres://localhost:5432/mcp_hosting';

// Create postgres client
const queryClient = postgres(DATABASE_URL, {
  max: 20,
  idle_timeout: 20,
  connect_timeout: 10,
});

// Create drizzle instance
export const db = drizzle(queryClient);

// ============================================================================
// User Repository
// ============================================================================

export const UserRepository = {
  async findByEmail(email: string) {
    const result = await db.select().from(users).where(eq(users.email, email.toLowerCase())).limit(1);
    return result[0] || null;
  },

  async findById(id: string) {
    const result = await db.select().from(users).where(eq(users.id, id)).limit(1);
    return result[0] || null;
  },

  async findByUsername(username: string) {
    const result = await db.select().from(users).where(eq(users.username, username.toLowerCase())).limit(1);
    return result[0] || null;
  },

  async create(data: {
    email: string;
    username: string;
    passwordHash: string;
    tier?: string;
  }) {
    const result = await db.insert(users).values({
      email: data.email.toLowerCase(),
      username: data.username.toLowerCase(),
      passwordHash: data.passwordHash,
      tier: data.tier || 'free',
    }).returning();
    return result[0];
  },

  async updateStripeInfo(userId: string, customerId: string, subscriptionId?: string) {
    await db.update(users)
      .set({
        stripeCustomerId: customerId,
        stripeSubscriptionId: subscriptionId,
        updatedAt: new Date(),
      })
      .where(eq(users.id, userId));
  },

  async updateTier(userId: string, tier: string) {
    await db.update(users)
      .set({ tier, updatedAt: new Date() })
      .where(eq(users.id, userId));
  },
};

// ============================================================================
// Server Repository
// ============================================================================

export const ServerRepository = {
  async findBySubdomain(subdomain: string) {
    const result = await db.select()
      .from(hostedServers)
      .where(eq(hostedServers.subdomain, subdomain.toLowerCase()))
      .limit(1);
    return result[0] || null;
  },

  async findById(id: string) {
    const result = await db.select().from(hostedServers).where(eq(hostedServers.id, id)).limit(1);
    return result[0] || null;
  },

  async findByOwner(ownerId: string) {
    return db.select().from(hostedServers).where(eq(hostedServers.ownerId, ownerId));
  },

  async create(data: {
    ownerId: string;
    name: string;
    subdomain: string;
    description?: string;
    sourceType: string;
    sourceUrl?: string;
    sourceConfig?: unknown;
  }) {
    const result = await db.insert(hostedServers).values({
      ownerId: data.ownerId,
      name: data.name,
      subdomain: data.subdomain.toLowerCase(),
      description: data.description,
      sourceType: data.sourceType,
      sourceUrl: data.sourceUrl,
      sourceConfig: data.sourceConfig,
    }).returning();
    return result[0];
  },

  async incrementCallCount(serverId: string) {
    await db.update(hostedServers)
      .set({
        totalCalls: sql`${hostedServers.totalCalls} + 1`,
        callsThisMonth: sql`${hostedServers.callsThisMonth} + 1`,
        updatedAt: new Date(),
      })
      .where(eq(hostedServers.id, serverId));
  },

  async addRevenue(serverId: string, amount: string) {
    await db.update(hostedServers)
      .set({
        revenueTotal: sql`${hostedServers.revenueTotal} + ${amount}`,
        revenueThisMonth: sql`${hostedServers.revenueThisMonth} + ${amount}`,
        updatedAt: new Date(),
      })
      .where(eq(hostedServers.id, serverId));
  },

  async resetMonthlyStats() {
    await db.update(hostedServers)
      .set({
        callsThisMonth: 0,
        revenueThisMonth: '0',
        updatedAt: new Date(),
      });
  },

  async subdomainExists(subdomain: string): Promise<boolean> {
    const result = await db.select({ id: hostedServers.id })
      .from(hostedServers)
      .where(eq(hostedServers.subdomain, subdomain.toLowerCase()))
      .limit(1);
    return result.length > 0;
  },
};

// ============================================================================
// Tool Repository
// ============================================================================

export const ToolRepository = {
  async findByServer(serverId: string) {
    return db.select().from(hostedTools).where(eq(hostedTools.serverId, serverId));
  },

  async findByName(serverId: string, name: string) {
    const result = await db.select()
      .from(hostedTools)
      .where(and(eq(hostedTools.serverId, serverId), eq(hostedTools.name, name)))
      .limit(1);
    return result[0] || null;
  },

  async create(data: {
    serverId: string;
    name: string;
    description?: string;
    inputSchema?: unknown;
    price?: string;
    isPaid?: boolean;
    toolType: string;
    endpoint?: string;
    proxyTarget?: string;
    code?: string;
  }) {
    const result = await db.insert(hostedTools).values(data).returning();
    return result[0];
  },

  async incrementCallCount(toolId: string) {
    await db.update(hostedTools)
      .set({ callCount: sql`${hostedTools.callCount} + 1` })
      .where(eq(hostedTools.id, toolId));
  },
};

// ============================================================================
// Usage Log Repository
// ============================================================================

export const UsageLogRepository = {
  async create(data: {
    serverId: string;
    toolName: string;
    userId?: string;
    callerAddress?: string;
    paymentAmount?: string;
    paymentTxHash?: string;
    success: boolean;
    errorMessage?: string;
    durationMs?: number;
  }) {
    const result = await db.insert(usageLogs).values(data).returning();
    return result[0];
  },

  async findByServer(serverId: string, limit = 100) {
    return db.select()
      .from(usageLogs)
      .where(eq(usageLogs.serverId, serverId))
      .orderBy(sql`${usageLogs.timestamp} DESC`)
      .limit(limit);
  },

  async getStats(serverId: string, days = 30) {
    const since = new Date();
    since.setDate(since.getDate() - days);

    const result = await db.select({
      totalCalls: sql<number>`count(*)`,
      successfulCalls: sql<number>`count(*) filter (where ${usageLogs.success} = true)`,
      totalRevenue: sql<string>`coalesce(sum(${usageLogs.paymentAmount}), 0)`,
      avgDuration: sql<number>`avg(${usageLogs.durationMs})`,
    })
      .from(usageLogs)
      .where(and(
        eq(usageLogs.serverId, serverId),
        sql`${usageLogs.timestamp} >= ${since}`
      ));

    return result[0];
  },
};

// ============================================================================
// API Key Repository
// ============================================================================

export const ApiKeyRepository = {
  async findByKeyHash(keyHash: string) {
    const result = await db.select()
      .from(apiKeys)
      .where(and(eq(apiKeys.keyHash, keyHash), eq(apiKeys.isActive, true)))
      .limit(1);
    return result[0] || null;
  },

  async findByUser(userId: string) {
    return db.select().from(apiKeys).where(eq(apiKeys.userId, userId));
  },

  async create(data: {
    userId: string;
    name: string;
    keyHash: string;
    keyPrefix: string;
    expiresAt?: Date;
  }) {
    const result = await db.insert(apiKeys).values(data).returning();
    return result[0];
  },

  async updateLastUsed(keyId: string) {
    await db.update(apiKeys)
      .set({ lastUsed: new Date() })
      .where(eq(apiKeys.id, keyId));
  },

  async deactivate(keyId: string) {
    await db.update(apiKeys)
      .set({ isActive: false })
      .where(eq(apiKeys.id, keyId));
  },
};

// ============================================================================
// Database Health Check
// ============================================================================

export async function checkDatabaseHealth(): Promise<boolean> {
  try {
    await db.execute(sql`SELECT 1`);
    return true;
  } catch (error) {
    console.error('Database health check failed:', error);
    return false;
  }
}

// ============================================================================
// Migrations
// ============================================================================

export async function runMigrations() {
  console.log('Running database migrations...');
  
  // Create tables if they don't exist
  await db.execute(sql`
    CREATE TABLE IF NOT EXISTS mcp_hosting_users (
      id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
      email TEXT NOT NULL UNIQUE,
      username TEXT NOT NULL UNIQUE,
      password_hash TEXT NOT NULL,
      tier TEXT NOT NULL DEFAULT 'free',
      stripe_customer_id TEXT,
      stripe_subscription_id TEXT,
      created_at TIMESTAMP DEFAULT NOW() NOT NULL,
      updated_at TIMESTAMP DEFAULT NOW() NOT NULL
    )
  `);

  await db.execute(sql`
    CREATE TABLE IF NOT EXISTS mcp_hosted_servers (
      id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
      owner_id UUID NOT NULL REFERENCES mcp_hosting_users(id),
      name TEXT NOT NULL,
      subdomain TEXT NOT NULL UNIQUE,
      description TEXT,
      source_type TEXT NOT NULL,
      source_url TEXT,
      source_config JSONB,
      is_active BOOLEAN DEFAULT true NOT NULL,
      is_public BOOLEAN DEFAULT false NOT NULL,
      total_calls INTEGER DEFAULT 0 NOT NULL,
      calls_this_month INTEGER DEFAULT 0 NOT NULL,
      revenue_total DECIMAL(20, 6) DEFAULT 0,
      revenue_this_month DECIMAL(20, 6) DEFAULT 0,
      created_at TIMESTAMP DEFAULT NOW() NOT NULL,
      updated_at TIMESTAMP DEFAULT NOW() NOT NULL
    )
  `);

  await db.execute(sql`
    CREATE TABLE IF NOT EXISTS mcp_hosted_tools (
      id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
      server_id UUID NOT NULL REFERENCES mcp_hosted_servers(id),
      name TEXT NOT NULL,
      description TEXT,
      input_schema JSONB,
      price DECIMAL(20, 6) DEFAULT 0,
      is_paid BOOLEAN DEFAULT false NOT NULL,
      tool_type TEXT NOT NULL DEFAULT 'http',
      endpoint TEXT,
      proxy_target TEXT,
      code TEXT,
      call_count INTEGER DEFAULT 0 NOT NULL,
      created_at TIMESTAMP DEFAULT NOW() NOT NULL
    )
  `);

  await db.execute(sql`
    CREATE TABLE IF NOT EXISTS mcp_usage_logs (
      id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
      server_id UUID NOT NULL REFERENCES mcp_hosted_servers(id),
      tool_name TEXT NOT NULL,
      user_id UUID,
      caller_address TEXT,
      payment_amount DECIMAL(20, 6),
      payment_tx_hash TEXT,
      success BOOLEAN DEFAULT true NOT NULL,
      error_message TEXT,
      duration_ms INTEGER,
      timestamp TIMESTAMP DEFAULT NOW() NOT NULL
    )
  `);

  await db.execute(sql`
    CREATE TABLE IF NOT EXISTS mcp_api_keys (
      id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
      user_id UUID NOT NULL REFERENCES mcp_hosting_users(id),
      name TEXT NOT NULL,
      key_hash TEXT NOT NULL,
      key_prefix TEXT NOT NULL,
      last_used TIMESTAMP,
      expires_at TIMESTAMP,
      is_active BOOLEAN DEFAULT true NOT NULL,
      created_at TIMESTAMP DEFAULT NOW() NOT NULL
    )
  `);

  // Create indexes
  await db.execute(sql`CREATE INDEX IF NOT EXISTS idx_servers_subdomain ON mcp_hosted_servers(subdomain)`);
  await db.execute(sql`CREATE INDEX IF NOT EXISTS idx_servers_owner ON mcp_hosted_servers(owner_id)`);
  await db.execute(sql`CREATE INDEX IF NOT EXISTS idx_tools_server ON mcp_hosted_tools(server_id)`);
  await db.execute(sql`CREATE INDEX IF NOT EXISTS idx_usage_server ON mcp_usage_logs(server_id)`);
  await db.execute(sql`CREATE INDEX IF NOT EXISTS idx_usage_timestamp ON mcp_usage_logs(timestamp)`);
  await db.execute(sql`CREATE INDEX IF NOT EXISTS idx_api_keys_user ON mcp_api_keys(user_id)`);

  console.log('Migrations complete.');
}
