#!/usr/bin/env node
/**
 * CLI entry point for the Yields MCP server
 */

import { createYieldsServer } from './server';

async function main(): Promise<void> {
  const server = createYieldsServer();
  await server.run();
}

main().catch((error) => {
  console.error('Fatal error:', error);
  process.exit(1);
});
