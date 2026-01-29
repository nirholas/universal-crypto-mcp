import dotenv from 'dotenv';
import { PrismaClient } from '@prisma/client';
import { startMcpServer } from './mcp/server.js';
import { initializeChains } from './services/chainService.js';
import { logger } from './utils/logger.js';
import { closeAllProviders } from './utils/blockchain.js';

// Load environment variables
dotenv.config();

// Initialize Prisma client
const prisma = new PrismaClient();

// Main function
async function main() {
  try {
    logger.info('Starting MCP Blockchain Server');
    
    // Connect to database
    await prisma.$connect();
    logger.info('Connected to database');
    
    // Initialize chains
    await initializeChains();
    
    // Start MCP server
    const server = await startMcpServer();
    
    // Handle shutdown
    const shutdown = async () => {
      logger.info('Shutting down...');
      
      // Close Prisma connection
      await prisma.$disconnect();
      
      // Close blockchain providers
      closeAllProviders();
      
      logger.info('Graceful shutdown complete');
      process.exit(0);
    };
    
    // Catch termination signals
    process.on('SIGINT', shutdown);
    process.on('SIGTERM', shutdown);
    
    logger.info('MCP Blockchain Server started successfully');
  } catch (error) {
    logger.error('Failed to start server:', error);
    process.exit(1);
  }
}

// Start the application
main();
