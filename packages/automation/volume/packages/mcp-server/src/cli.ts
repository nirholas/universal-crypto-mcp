/**
 * CLI Entry Point for DeFi MCP Server
 */

import { Command } from 'commander';
import { DeFiMCPServer } from './server.js';
import { loadConfig, createDevConfig } from './config/index.js';
import { logger } from './utils/logger.js';

const program = new Command();

program
  .name('defi-mcp-server')
  .description('DeFi MCP Server for Solana operations')
  .version('1.0.0');

program
  .command('start')
  .description('Start the MCP server')
  .option('-c, --config <path>', 'Path to configuration file')
  .option('-d, --dev', 'Use development configuration')
  .action(async (options) => {
    try {
      let config;
      
      if (options.dev) {
        logger.info('Using development configuration');
        config = createDevConfig();
      } else if (options.config) {
        logger.info({ configPath: options.config }, 'Loading configuration');
        config = loadConfig({ configPath: options.config });
      } else {
        config = loadConfig();
      }

      const server = new DeFiMCPServer({ config });
      await server.start();
      
      // Keep process running
      process.stdin.resume();
    } catch (error) {
      logger.error({ error }, 'Failed to start server');
      process.exit(1);
    }
  });

program
  .command('db:init')
  .description('Initialize the database')
  .option('-c, --config <path>', 'Path to configuration file')
  .action(async (options) => {
    try {
      const config = loadConfig({ configPath: options.config });
      logger.info({ database: config.database.database }, 'Initializing database');
      
      // Database initialization via drizzle-orm
      const { drizzle } = await import('drizzle-orm/postgres-js');
      const { sql } = await import('drizzle-orm');
      const postgres = (await import('postgres')).default;

      const connectionString = `postgres://${config.database.user}:${config.database.password}@${config.database.host}:${config.database.port}/${config.database.database}`;
      const queryClient = postgres(connectionString);
      const db = drizzle(queryClient);

      // Create tables
      await db.execute(sql`
        CREATE TABLE IF NOT EXISTS campaigns (
          id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
          name TEXT NOT NULL,
          target_token TEXT NOT NULL,
          target_volume_24h TEXT NOT NULL,
          bot_count INTEGER NOT NULL,
          duration INTEGER NOT NULL DEFAULT 24,
          mode TEXT NOT NULL DEFAULT 'moderate',
          wallet_tag TEXT,
          status TEXT NOT NULL DEFAULT 'pending',
          created_at TIMESTAMP DEFAULT NOW() NOT NULL,
          updated_at TIMESTAMP DEFAULT NOW() NOT NULL
        )
      `);

      await db.execute(sql`
        CREATE TABLE IF NOT EXISTS wallets (
          id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
          address TEXT NOT NULL UNIQUE,
          encrypted_key TEXT NOT NULL,
          tag TEXT,
          balance_sol TEXT DEFAULT '0',
          balance_tokens JSONB DEFAULT '{}',
          last_active TIMESTAMP,
          created_at TIMESTAMP DEFAULT NOW() NOT NULL
        )
      `);

      await db.execute(sql`
        CREATE TABLE IF NOT EXISTS trades (
          id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
          campaign_id UUID REFERENCES campaigns(id),
          wallet_address TEXT NOT NULL,
          input_token TEXT NOT NULL,
          output_token TEXT NOT NULL,
          input_amount TEXT NOT NULL,
          output_amount TEXT NOT NULL,
          signature TEXT,
          status TEXT NOT NULL DEFAULT 'pending',
          created_at TIMESTAMP DEFAULT NOW() NOT NULL
        )
      `);

      await db.execute(sql`CREATE INDEX IF NOT EXISTS idx_campaigns_status ON campaigns(status)`);
      await db.execute(sql`CREATE INDEX IF NOT EXISTS idx_wallets_tag ON wallets(tag)`);
      await db.execute(sql`CREATE INDEX IF NOT EXISTS idx_trades_campaign ON trades(campaign_id)`);

      await queryClient.end();
      
      logger.info('Database initialized successfully');
      process.exit(0);
    } catch (error) {
      logger.error({ error }, 'Failed to initialize database');
      process.exit(1);
    }
  });

program
  .command('db:migrate')
  .description('Run database migrations')
  .option('-c, --config <path>', 'Path to configuration file')
  .action(async (options) => {
    try {
      const config = loadConfig({ configPath: options.config });
      logger.info({ database: config.database.database }, 'Running migrations');
      
      // Migrations via drizzle-kit
      const { execSync } = await import('child_process');
      execSync('npx drizzle-kit migrate', {
        stdio: 'inherit',
        env: {
          ...process.env,
          DATABASE_URL: `postgres://${config.database.user}:${config.database.password}@${config.database.host}:${config.database.port}/${config.database.database}`,
        },
      });
      
      logger.info('Migrations completed successfully');
      process.exit(0);
    } catch (error) {
      logger.error({ error }, 'Failed to run migrations');
      process.exit(1);
    }
  });

program
  .command('validate')
  .description('Validate configuration')
  .option('-c, --config <path>', 'Path to configuration file')
  .action(async (options) => {
    try {
      const config = loadConfig({ configPath: options.config });
      logger.info('Configuration is valid');
      console.log(JSON.stringify(config, null, 2));
      process.exit(0);
    } catch (error) {
      logger.error({ error }, 'Invalid configuration');
      process.exit(1);
    }
  });

program.parse();
