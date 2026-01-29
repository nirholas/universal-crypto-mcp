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
      
      // TODO: Implement database initialization
      logger.info('Database initialization not yet implemented');
      logger.info('Run the SQL scripts in docker/init-db.sql manually');
      
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
      
      // TODO: Implement migrations
      logger.info('Database migrations not yet implemented');
      
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
