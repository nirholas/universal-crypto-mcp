#!/usr/bin/env node

/**
 * boosty MCP Prices Server CLI
 * 
 * Command-line interface for running the prices MCP server.
 * Designed for use with Claude Desktop and other MCP clients.
 */

import { PricesServer } from './server.js';

// ============================================================================
// CLI Configuration
// ============================================================================

const VERSION = '0.1.0';
const NAME = 'boosty-mcp-prices';

const HELP_TEXT = `
${NAME} v${VERSION}

Real-time DeFi price data server using Model Context Protocol.

USAGE:
  ${NAME} [OPTIONS]

OPTIONS:
  -h, --help      Show this help message
  -v, --version   Show version number

AVAILABLE TOOLS:
  getTokenPrice        Get current price and market data for a token
  getTokenPriceHistory Get historical price data (up to 365 days)
  getGasPrices         Get gas prices for EVM chains
  getTopMovers         Get top gaining/losing tokens
  getFearGreedIndex    Get Crypto Fear & Greed Index
  comparePrices        Compare multiple tokens side-by-side

SUPPORTED CHAINS (for gas prices):
  ethereum, arbitrum, base, polygon, optimism, avalanche

ENVIRONMENT VARIABLES:
  COINGECKO_API_KEY     CoinGecko API key (optional, for higher rate limits)
  ETHERSCAN_API_KEY     Etherscan API key (optional)
  ARBISCAN_API_KEY      Arbiscan API key (optional)
  BASESCAN_API_KEY      Basescan API key (optional)
  POLYGONSCAN_API_KEY   Polygonscan API key (optional)
  OPTIMISM_API_KEY      Optimism Etherscan API key (optional)
  SNOWTRACE_API_KEY     Snowtrace API key (optional)

CLAUDE DESKTOP CONFIGURATION:
  Add to your claude_desktop_config.json:

  {
    "mcpServers": {
      "prices": {
        "command": "npx",
        "args": ["${NAME}"]
      }
    }
  }

EXAMPLES:
  # Run as MCP server (stdio transport)
  ${NAME}

  # Use with environment variables
  COINGECKO_API_KEY=your_key ${NAME}

For more information, visit:
https://github.com/nirholas/defi-mcp-servers
`;

// ============================================================================
// CLI Implementation
// ============================================================================

interface CliArgs {
  help: boolean;
  version: boolean;
}

function parseArgs(args: string[]): CliArgs {
  const result: CliArgs = {
    help: false,
    version: false,
  };

  for (const arg of args) {
    switch (arg) {
      case '-h':
      case '--help':
        result.help = true;
        break;
      case '-v':
      case '--version':
        result.version = true;
        break;
      default:
        if (arg.startsWith('-')) {
          console.error(`Unknown option: ${arg}`);
          console.error(`Run '${NAME} --help' for usage information.`);
          process.exit(1);
        }
    }
  }

  return result;
}

async function main(): Promise<void> {
  const args = parseArgs(process.argv.slice(2));

  if (args.help) {
    console.log(HELP_TEXT);
    process.exit(0);
  }

  if (args.version) {
    console.log(`${NAME} v${VERSION}`);
    process.exit(0);
  }

  // Start the MCP server
  const server = new PricesServer({
    name: NAME,
    version: VERSION,
  });

  try {
    await server.start();
  } catch (error) {
    console.error('Failed to start server:', error);
    process.exit(1);
  }
}

// Run CLI
main().catch((error) => {
  console.error('Fatal error:', error);
  process.exit(1);
});
