#!/usr/bin/env node
/**
 * CLI entry point for Wallets MCP Server
 */

import { createWalletsServer } from './server';

async function main(): Promise<void> {
  // Validate required environment variables
  const requiredEnvVars = ['ALCHEMY_API_KEY'];
  const missingVars = requiredEnvVars.filter((v) => !process.env[v]);

  if (missingVars.length > 0) {
    console.error(`Missing required environment variables: ${missingVars.join(', ')}`);
    console.error('Please set the following environment variables:');
    console.error('  ALCHEMY_API_KEY - Your Alchemy API key');
    console.error('Optional environment variables:');
    console.error('  DEBANK_API_KEY - DeBank API key for DeFi positions');
    console.error('  ETHERSCAN_API_KEY - Etherscan API key for approvals');
    console.error('  COVALENT_API_KEY - Covalent API key (alternative data source)');
    process.exit(1);
  }

  const server = createWalletsServer();

  // Handle graceful shutdown
  process.on('SIGINT', async () => {
    console.error('\nReceived SIGINT, shutting down...');
    await server.stop();
    process.exit(0);
  });

  process.on('SIGTERM', async () => {
    console.error('\nReceived SIGTERM, shutting down...');
    await server.stop();
    process.exit(0);
  });

  // Handle uncaught errors
  process.on('uncaughtException', (error) => {
    console.error('Uncaught exception:', error);
    process.exit(1);
  });

  process.on('unhandledRejection', (reason) => {
    console.error('Unhandled rejection:', reason);
    process.exit(1);
  });

  // Start the server
  try {
    await server.start();
  } catch (error) {
    console.error('Failed to start server:', error);
    process.exit(1);
  }
}

main();
