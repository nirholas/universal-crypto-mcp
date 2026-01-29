#!/usr/bin/env node
/**
 * Combined MCP CLI
 * Run the all-in-one DeFi MCP server with optional filters
 */

import { runServer } from './server';

// Parse CLI arguments
const args = process.argv.slice(2);

const options = {
  enablePrices: true,
  enableWallets: true,
  enableYields: true,
};

// Check for selective mode
if (args.includes('--prices-only')) {
  options.enableWallets = false;
  options.enableYields = false;
} else if (args.includes('--wallets-only')) {
  options.enablePrices = false;
  options.enableYields = false;
} else if (args.includes('--yields-only')) {
  options.enablePrices = false;
  options.enableWallets = false;
}

// Check for explicit flags
if (args.includes('--no-prices')) options.enablePrices = false;
if (args.includes('--no-wallets')) options.enableWallets = false;
if (args.includes('--no-yields')) options.enableYields = false;

// Show help
if (args.includes('--help') || args.includes('-h')) {
  console.log(`
boosty MCP DeFi Server

Usage: boosty-mcp [options]

Options:
  --prices-only    Only enable price tools
  --wallets-only   Only enable wallet tools
  --yields-only    Only enable yield tools
  --no-prices      Disable price tools
  --no-wallets     Disable wallet tools
  --no-yields      Disable yield tools
  --help, -h       Show this help message

Environment Variables:
  COINGECKO_API_KEY   API key for CoinGecko
  ALCHEMY_API_KEY     API key for Alchemy
  ETHERSCAN_API_KEY   API key for Etherscan
  ARBISCAN_API_KEY    API key for Arbiscan
  BASESCAN_API_KEY    API key for Basescan

Examples:
  boosty-mcp                    # Run with all tools
  boosty-mcp --prices-only      # Run only price tools
  boosty-mcp --no-yields        # Run without yield tools
`);
  process.exit(0);
}

// Log enabled features
const enabled: string[] = [];
if (options.enablePrices) enabled.push('prices');
if (options.enableWallets) enabled.push('wallets');
if (options.enableYields) enabled.push('yields');

console.error(`Starting boosty MCP DeFi server with: ${enabled.join(', ')}`);

runServer(options).catch((error) => {
  console.error('Failed to start server:', error);
  process.exit(1);
});
