# Agent 17 & 18: Enterprise Features & White-label

> Scale to millions of requests and custom branding

---

## Agent 17: Enterprise Features

**Goal:** Support high-volume, mission-critical deployments

### Task 17.1: Load Balancing & Clustering 🔄

**File:** `src/enterprise/load-balancer.ts`

```typescript
import cluster from 'cluster';
import os from 'os';
import express from 'express';

export interface LoadBalancerConfig {
  workers?: number;
  autoRestart?: boolean;
  gracefulShutdown?: boolean;
}

export class ClusterManager {
  private config: LoadBalancerConfig;
  private workers: Map<number, any> = new Map();

  constructor(config: LoadBalancerConfig = {}) {
    this.config = {
      workers: config.workers || os.cpus().length,
      autoRestart: config.autoRestart !== false,
      gracefulShutdown: config.gracefulShutdown !== false
    };
  }

  start(appFactory: () => express.Application): void {
    if (cluster.isPrimary) {
      this.startPrimary();
    } else {
      this.startWorker(appFactory);
    }
  }

  private startPrimary(): void {
    console.log(`[CLUSTER] Primary ${process.pid} starting...`);
    console.log(`[CLUSTER] Spawning ${this.config.workers} workers`);

    // Spawn workers
    for (let i = 0; i < this.config.workers!; i++) {
      this.spawnWorker();
    }

    // Handle worker exit
    cluster.on('exit', (worker, code, signal) => {
      console.log(`[CLUSTER] Worker ${worker.process.pid} died (${signal || code})`);
      this.workers.delete(worker.id);

      if (this.config.autoRestart) {
        console.log('[CLUSTER] Spawning replacement worker');
        this.spawnWorker();
      }
    });

    // Graceful shutdown
    if (this.config.gracefulShutdown) {
      process.on('SIGTERM', () => this.shutdown());
      process.on('SIGINT', () => this.shutdown());
    }
  }

  private spawnWorker(): void {
    const worker = cluster.fork();
    this.workers.set(worker.id, worker);
  }

  private startWorker(appFactory: () => express.Application): void {
    const app = appFactory();
    const port = process.env.PORT || 3000;

    app.listen(port, () => {
      console.log(`[WORKER ${process.pid}] Listening on port ${port}`);
    });

    // Graceful shutdown
    if (this.config.gracefulShutdown) {
      process.on('SIGTERM', () => {
        console.log(`[WORKER ${process.pid}] Shutting down gracefully...`);
        // Close server, finish existing requests
        process.exit(0);
      });
    }
  }

  private async shutdown(): Promise<void> {
    console.log('[CLUSTER] Shutting down gracefully...');

    // Send SIGTERM to all workers
    for (const worker of this.workers.values()) {
      worker.kill('SIGTERM');
    }

    // Wait for workers to exit
    await new Promise(resolve => setTimeout(resolve, 10000));

    console.log('[CLUSTER] Shutdown complete');
    process.exit(0);
  }
}

// Usage in main app
export function createClusteredApp(
  appFactory: () => express.Application,
  config?: LoadBalancerConfig
): void {
  const manager = new ClusterManager(config);
  manager.start(appFactory);
}
```

---

### Task 17.2: Caching Layer ⚡

**File:** `src/enterprise/cache.ts`

```typescript
import { createClient, RedisClientType } from 'redis';
import { LRUCache } from 'lru-cache';

export interface CacheConfig {
  type: 'memory' | 'redis';
  redis?: {
    url: string;
    ttl?: number;
  };
  memory?: {
    maxSize: number;
    ttl?: number;
  };
}

export interface Cache {
  get<T>(key: string): Promise<T | null>;
  set<T>(key: string, value: T, ttl?: number): Promise<void>;
  del(key: string): Promise<void>;
  clear(): Promise<void>;
}

export class MemoryCache implements Cache {
  private cache: LRUCache<string, any>;
  private defaultTTL: number;

  constructor(config: CacheConfig['memory'] = { maxSize: 1000 }) {
    this.cache = new LRUCache({
      max: config.maxSize,
      ttl: config.ttl || 300000 // 5 minutes default
    });
    this.defaultTTL = config.ttl || 300000;
  }

  async get<T>(key: string): Promise<T | null> {
    return this.cache.get(key) || null;
  }

  async set<T>(key: string, value: T, ttl?: number): Promise<void> {
    this.cache.set(key, value, { ttl: ttl || this.defaultTTL });
  }

  async del(key: string): Promise<void> {
    this.cache.delete(key);
  }

  async clear(): Promise<void> {
    this.cache.clear();
  }
}

export class RedisCache implements Cache {
  private client: RedisClientType;
  private defaultTTL: number;

  constructor(config: CacheConfig['redis']) {
    this.client = createClient({ url: config?.url });
    this.defaultTTL = config?.ttl || 300; // 5 minutes default
  }

  async connect(): Promise<void> {
    await this.client.connect();
  }

  async get<T>(key: string): Promise<T | null> {
    const value = await this.client.get(key);
    return value ? JSON.parse(value) : null;
  }

  async set<T>(key: string, value: T, ttl?: number): Promise<void> {
    await this.client.setEx(
      key,
      ttl || this.defaultTTL,
      JSON.stringify(value)
    );
  }

  async del(key: string): Promise<void> {
    await this.client.del(key);
  }

  async clear(): Promise<void> {
    await this.client.flushAll();
  }
}

// Factory
export async function createCache(config: CacheConfig): Promise<Cache> {
  if (config.type === 'redis') {
    const cache = new RedisCache(config.redis);
    await cache.connect();
    return cache;
  }
  
  return new MemoryCache(config.memory);
}

// Middleware for response caching
export function cacheMiddleware(cache: Cache, ttl = 300) {
  return async (req: any, res: any, next: any) => {
    // Only cache GET requests
    if (req.method !== 'GET') {
      return next();
    }

    const key = `cache:${req.path}:${JSON.stringify(req.query)}`;
    
    // Check cache
    const cached = await cache.get(key);
    if (cached) {
      res.setHeader('X-Cache', 'HIT');
      return res.json(cached);
    }

    // Intercept response
    const originalJson = res.json.bind(res);
    res.json = async (body: any) => {
      await cache.set(key, body, ttl);
      res.setHeader('X-Cache', 'MISS');
      return originalJson(body);
    };

    next();
  };
}
```

---

### Task 17.3: Rate Limiting (Advanced) 🚦

**File:** `src/enterprise/rate-limiter.ts`

```typescript
import { Cache } from './cache.js';

export interface RateLimitConfig {
  window: number; // seconds
  max: number; // requests per window
  skipSuccessfulRequests?: boolean;
  keyGenerator?: (req: any) => string;
}

export interface RateLimitTier {
  name: string;
  limits: RateLimitConfig;
  condition: (req: any) => boolean;
}

export class AdvancedRateLimiter {
  private cache: Cache;
  private tiers: RateLimitTier[];

  constructor(cache: Cache, tiers: RateLimitTier[]) {
    this.cache = cache;
    this.tiers = tiers.sort((a, b) => b.limits.max - a.limits.max); // Highest limits first
  }

  async checkLimit(req: any): Promise<{
    allowed: boolean;
    limit: number;
    remaining: number;
    reset: number;
    tier?: string;
  }> {
    // Find matching tier
    const tier = this.tiers.find(t => t.condition(req)) || this.tiers[this.tiers.length - 1];
    const config = tier.limits;

    // Generate key
    const key = config.keyGenerator 
      ? config.keyGenerator(req)
      : `ratelimit:${req.ip}:${Math.floor(Date.now() / 1000 / config.window)}`;

    // Get current count
    const current = await this.cache.get<number>(key) || 0;

    // Calculate reset time
    const reset = Math.floor(Date.now() / 1000 / config.window) * config.window + config.window;

    if (current >= config.max) {
      return {
        allowed: false,
        limit: config.max,
        remaining: 0,
        reset,
        tier: tier.name
      };
    }

    // Increment counter
    await this.cache.set(key, current + 1, config.window);

    return {
      allowed: true,
      limit: config.max,
      remaining: config.max - current - 1,
      reset,
      tier: tier.name
    };
  }

  middleware() {
    return async (req: any, res: any, next: any) => {
      const result = await this.checkLimit(req);

      res.setHeader('X-RateLimit-Limit', result.limit);
      res.setHeader('X-RateLimit-Remaining', result.remaining);
      res.setHeader('X-RateLimit-Reset', result.reset);
      if (result.tier) {
        res.setHeader('X-RateLimit-Tier', result.tier);
      }

      if (!result.allowed) {
        return res.status(429).json({
          error: 'Too many requests',
          limit: result.limit,
          reset: result.reset
        });
      }

      next();
    };
  }
}

// Example tier configuration
export const DEFAULT_TIERS: RateLimitTier[] = [
  {
    name: 'premium',
    limits: { window: 60, max: 1000 },
    condition: (req) => req.headers['x-tier'] === 'premium'
  },
  {
    name: 'standard',
    limits: { window: 60, max: 100 },
    condition: (req) => req.headers['x-tier'] === 'standard'
  },
  {
    name: 'free',
    limits: { window: 60, max: 10 },
    condition: () => true // Default
  }
];
```

---

### Task 17.4: Database Integration 🗄️

**File:** `src/enterprise/database.ts`

```typescript
import { Pool } from 'pg';
import { Sequelize, Model, DataTypes } from 'sequelize';

// Payment record model
export class PaymentRecord extends Model {
  declare id: string;
  declare payer: string;
  declare amount: string;
  declare network: string;
  declare txHash: string;
  declare route: string;
  declare timestamp: Date;
}

export async function initDatabase(config: {
  type: 'postgres' | 'sqlite';
  url?: string;
}): Promise<Sequelize> {
  const sequelize = config.type === 'postgres'
    ? new Sequelize(config.url!, {
        dialect: 'postgres',
        logging: false
      })
    : new Sequelize({
        dialect: 'sqlite',
        storage: './x402-data.db',
        logging: false
      });

  // Define models
  PaymentRecord.init({
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true
    },
    payer: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        is: /^0x[a-fA-F0-9]{40}$/
      }
    },
    amount: {
      type: DataTypes.STRING,
      allowNull: false
    },
    network: {
      type: DataTypes.STRING,
      allowNull: false
    },
    txHash: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true
    },
    route: {
      type: DataTypes.STRING,
      allowNull: false
    },
    timestamp: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW
    }
  }, {
    sequelize,
    modelName: 'PaymentRecord'
  });

  // Sync database
  await sequelize.sync();

  return sequelize;
}

// Analytics queries
export class DatabaseAnalytics {
  private sequelize: Sequelize;

  constructor(sequelize: Sequelize) {
    this.sequelize = sequelize;
  }

  async getTotalRevenue(): Promise<number> {
    const result = await PaymentRecord.sum('amount');
    return result || 0;
  }

  async getRevenueByPeriod(period: 'day' | 'week' | 'month'): Promise<any[]> {
    const interval = period === 'day' ? '1 day' : period === 'week' ? '7 days' : '30 days';
    
    const [results] = await this.sequelize.query(`
      SELECT 
        DATE(timestamp) as date,
        SUM(amount) as revenue,
        COUNT(*) as count
      FROM PaymentRecords
      WHERE timestamp > NOW() - INTERVAL '${interval}'
      GROUP BY DATE(timestamp)
      ORDER BY date DESC
    `);

    return results as any[];
  }

  async getTopPayers(limit = 10): Promise<any[]> {
    const results = await PaymentRecord.findAll({
      attributes: [
        'payer',
        [this.sequelize.fn('SUM', this.sequelize.col('amount')), 'total'],
        [this.sequelize.fn('COUNT', this.sequelize.col('id')), 'count']
      ],
      group: ['payer'],
      order: [[this.sequelize.fn('SUM', this.sequelize.col('amount')), 'DESC']],
      limit
    });

    return results.map(r => r.toJSON());
  }

  async getRouteStats(): Promise<any[]> {
    const results = await PaymentRecord.findAll({
      attributes: [
        'route',
        [this.sequelize.fn('COUNT', this.sequelize.col('id')), 'count'],
        [this.sequelize.fn('SUM', this.sequelize.col('amount')), 'revenue']
      ],
      group: ['route'],
      order: [[this.sequelize.fn('COUNT', this.sequelize.col('id')), 'DESC']]
    });

    return results.map(r => r.toJSON());
  }
}
```

---

## Agent 18: White-label & Customization

**Goal:** Allow businesses to rebrand x402-deploy as their own

### Task 18.1: Custom Branding 🎨

**File:** `src/whitelabel/branding.ts`

```typescript
export interface BrandingConfig {
  name: string;
  logo?: string;
  colors?: {
    primary: string;
    secondary: string;
    accent: string;
  };
  urls?: {
    homepage?: string;
    docs?: string;
    support?: string;
  };
  customDomain?: string;
}

export function generateBrandedDashboard(config: BrandingConfig): string {
  return `
<!DOCTYPE html>
<html>
<head>
  <title>${config.name} Dashboard</title>
  <style>
    :root {
      --primary: ${config.colors?.primary || '#0066ff'};
      --secondary: ${config.colors?.secondary || '#00ccff'};
      --accent: ${config.colors?.accent || '#ff6600'};
    }
    body {
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
      margin: 0;
      padding: 0;
      background: #f5f5f5;
    }
    .header {
      background: var(--primary);
      color: white;
      padding: 20px;
      box-shadow: 0 2px 4px rgba(0,0,0,0.1);
    }
    .logo {
      font-size: 24px;
      font-weight: bold;
    }
    .container {
      max-width: 1200px;
      margin: 40px auto;
      padding: 0 20px;
    }
    .card {
      background: white;
      border-radius: 8px;
      padding: 20px;
      margin-bottom: 20px;
      box-shadow: 0 2px 4px rgba(0,0,0,0.1);
    }
    .stat {
      display: flex;
      justify-content: space-between;
      padding: 15px 0;
      border-bottom: 1px solid #eee;
    }
    .stat:last-child {
      border-bottom: none;
    }
    .value {
      font-size: 24px;
      font-weight: bold;
      color: var(--primary);
    }
  </style>
</head>
<body>
  <div class="header">
    <div class="logo">
      ${config.logo ? `<img src="${config.logo}" alt="${config.name}" style="height: 40px;">` : config.name}
    </div>
  </div>
  
  <div class="container">
    <div class="card">
      <h2>API Analytics</h2>
      <div id="stats"></div>
    </div>
    
    <div class="card">
      <h2>Revenue</h2>
      <canvas id="chart"></canvas>
    </div>
  </div>

  <script>
    // Load real-time data
    async function loadDashboard() {
      const response = await fetch('/api/dashboard/stats');
      const stats = await response.json();
      
      document.getElementById('stats').innerHTML = \`
        <div class="stat">
          <span>Total Revenue</span>
          <span class="value">$\${stats.totalRevenue}</span>
        </div>
        <div class="stat">
          <span>Total Requests</span>
          <span class="value">\${stats.totalRequests.toLocaleString()}</span>
        </div>
        <div class="stat">
          <span>Active Users</span>
          <span class="value">\${stats.activeUsers}</span>
        </div>
      \`;
    }
    
    loadDashboard();
    setInterval(loadDashboard, 10000);
  </script>
</body>
</html>
  `.trim();
}

export function generateBrandedCLI(config: BrandingConfig): string {
  return `
#!/usr/bin/env node

import chalk from 'chalk';
import { Command } from 'commander';

const program = new Command();

program
  .name('${config.name.toLowerCase().replace(/\s+/g, '-')}')
  .description('${config.name} - API Monetization Platform')
  .version('1.0.0');

program
  .command('deploy')
  .description('Deploy your API')
  .action(async () => {
    console.log(chalk.hex('${config.colors?.primary}')(\`
╔═══════════════════════════════════════╗
║                                       ║
║         ${config.name}                ║
║                                       ║
╚═══════════════════════════════════════╝
    \`));
    
    // ... deploy logic
  });

program.parse();
  `.trim();
}
```

---

### Task 18.2: Multi-tenant Architecture 🏢

**File:** `src/whitelabel/multi-tenant.ts`

```typescript
import { Request, Response, NextFunction } from 'express';

export interface Tenant {
  id: string;
  name: string;
  domain: string;
  branding: BrandingConfig;
  config: any;
  active: boolean;
}

export class MultiTenantManager {
  private tenants: Map<string, Tenant> = new Map();

  async createTenant(data: Omit<Tenant, 'id'>): Promise<Tenant> {
    const tenant: Tenant = {
      id: `tenant_${Date.now()}_${Math.random().toString(36).slice(2, 9)}`,
      ...data
    };

    this.tenants.set(tenant.domain, tenant);
    return tenant;
  }

  getTenantByDomain(domain: string): Tenant | undefined {
    return this.tenants.get(domain);
  }

  getTenantById(id: string): Tenant | undefined {
    return Array.from(this.tenants.values()).find(t => t.id === id);
  }

  async updateTenant(id: string, updates: Partial<Tenant>): Promise<void> {
    const tenant = this.getTenantById(id);
    if (tenant) {
      Object.assign(tenant, updates);
    }
  }

  middleware() {
    return (req: Request, res: Response, next: NextFunction) => {
      const host = req.hostname;
      const tenant = this.getTenantByDomain(host);

      if (!tenant || !tenant.active) {
        return res.status(404).json({ error: 'Tenant not found' });
      }

      // Attach tenant to request
      (req as any).tenant = tenant;
      
      // Apply tenant-specific config
      (req as any).config = tenant.config;
      
      next();
    };
  }
}

// Branded response middleware
export function brandedResponseMiddleware() {
  return (req: Request, res: Response, next: NextFunction) => {
    const tenant = (req as any).tenant as Tenant;
    
    if (tenant?.branding) {
      res.setHeader('X-Powered-By', tenant.branding.name);
      
      if (tenant.branding.urls?.docs) {
        res.setHeader('X-Documentation', tenant.branding.urls.docs);
      }
    }

    next();
  };
}
```

---

### Task 18.3: Custom Deployment Templates 📋

**File:** `src/whitelabel/custom-templates.ts`

```typescript
export interface CustomTemplate {
  id: string;
  name: string;
  description: string;
  language: string;
  framework: string;
  files: Record<string, string>;
  config: any;
}

export class TemplateManager {
  private templates: Map<string, CustomTemplate> = new Map();

  registerTemplate(template: CustomTemplate): void {
    this.templates.set(template.id, template);
  }

  getTemplate(id: string): CustomTemplate | undefined {
    return this.templates.get(id);
  }

  listTemplates(filters?: {
    language?: string;
    framework?: string;
  }): CustomTemplate[] {
    let templates = Array.from(this.templates.values());

    if (filters) {
      if (filters.language) {
        templates = templates.filter(t => t.language === filters.language);
      }
      if (filters.framework) {
        templates = templates.filter(t => t.framework === filters.framework);
      }
    }

    return templates;
  }

  async generateFromTemplate(
    templateId: string,
    customizations: Record<string, string>
  ): Promise<Record<string, string>> {
    const template = this.getTemplate(templateId);
    if (!template) {
      throw new Error(`Template ${templateId} not found`);
    }

    const files: Record<string, string> = {};

    for (const [filename, content] of Object.entries(template.files)) {
      let processedContent = content;

      // Replace placeholders
      for (const [key, value] of Object.entries(customizations)) {
        processedContent = processedContent.replace(
          new RegExp(`{{${key}}}`, 'g'),
          value
        );
      }

      files[filename] = processedContent;
    }

    return files;
  }
}

// Example custom template
export const ENTERPRISE_API_TEMPLATE: CustomTemplate = {
  id: 'enterprise-api',
  name: 'Enterprise API',
  description: 'Production-ready API with clustering, caching, and monitoring',
  language: 'typescript',
  framework: 'express',
  files: {
    'src/index.ts': `
import { createClusteredApp } from './enterprise/cluster';
import { createCache } from './enterprise/cache';
import { createApp } from './app';

const cache = await createCache({
  type: 'redis',
  redis: { url: process.env.REDIS_URL }
});

createClusteredApp(() => createApp(cache), {
  workers: parseInt(process.env.WORKERS || '4'),
  autoRestart: true,
  gracefulShutdown: true
});
    `,
    'docker-compose.yml': `
version: '3.8'
services:
  api:
    build: .
    ports:
      - "3000:3000"
    environment:
      - REDIS_URL=redis://redis:6379
      - WORKERS=4
    depends_on:
      - redis
  
  redis:
    image: redis:alpine
    ports:
      - "6379:6379"
    `
  },
  config: {
    requiresRedis: true,
    clustering: true
  }
};
```

---

## Success Criteria

**Agent 17 Complete When:**
- ✅ Clustering with auto-restart working
- ✅ Redis caching integration
- ✅ Tiered rate limiting
- ✅ PostgreSQL database integration
- ✅ Analytics queries optimized

**Agent 18 Complete When:**
- ✅ Custom branding for dashboard and CLI
- ✅ Multi-tenant architecture
- ✅ Custom deployment templates
- ✅ White-label documentation generator

---

**These features make x402-deploy enterprise-ready and customizable! 🏢**
