/**
 * @boosty/mcp-defi
 * All-in-one DeFi MCP server combining prices, wallets, and yields
 */

// Re-export everything from sub-packages
export * from '@boosty/mcp-prices';
export * from '@boosty/mcp-wallets';
export * from '@boosty/mcp-yields';

// Combined server
export { createCombinedServer, CombinedServerOptions } from './server';
