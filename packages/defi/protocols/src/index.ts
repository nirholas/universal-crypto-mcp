/**
 * Universal Crypto MCP
 * The most extensive crypto MCP repository
 * 
 * @author nich
 * @license Apache-2.0
 * @see https://github.com/nirholas/universal-crypto-mcp
 * @see https://x.com/nichxbt
 */

import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import startServer from "./server/server.js";

// Start the server
async function main() {
  try {
    const server = await startServer();
    const transport = new StdioServerTransport();
    await server.connect(transport);
    console.error("EVM MCP Server running on stdio");
  } catch (error) {
    console.error("Error starting MCP server:", error);
    process.exit(1);
  }
}

main().catch((error) => {
  console.error("Fatal error in main():", error);
  process.exit(1);
}); 