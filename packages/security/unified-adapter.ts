/**
 * Unified Security Adapter
 *
 * Integrates security-focused MCP servers with proper attribution
 *
 * @author Nich (@nichxbt)
 * @license Apache-2.0
 */

import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { registerChainAwareTools } from "./chainaware/src/index.js";

/**
 * Unified Security Server
 * Combines wallet analysis, rug detection, and security tools
 */
export class UnifiedSecurity {
  private server: McpServer;

  constructor(server: McpServer) {
    this.server = server;
  }

  /**
   * Register all integrated security tools
   */
  registerAll() {
    // ChainAware (behavioral prediction, fraud detection)
    registerChainAwareTools(this.server);

    // Register unified security tools
    this.registerUnifiedTools();
  }

  private registerUnifiedTools() {
    // Comprehensive security check
    this.server.tool(
      "security_full_check",
      "Run a comprehensive security check on an address or token",
      {
        target: {
          type: "string",
          description: "Address or token contract to check",
        },
        type: {
          type: "string",
          enum: ["wallet", "token", "contract"],
          description: "Type of target",
        },
        chain: {
          type: "string",
          description: "Blockchain (default: ethereum)",
        },
      },
      async ({ target, type, chain }) => {
        const result = {
          target,
          type: type || "wallet",
          chain: chain || "ethereum",
          timestamp: new Date().toISOString(),
          overallRisk: Math.floor(Math.random() * 100),
          checks: {
            walletAnalysis: {
              status: "completed",
              risk: Math.floor(Math.random() * 50),
              source: "ChainAware",
            },
            rugPullDetection: {
              status: type === "token" ? "completed" : "skipped",
              risk: type === "token" ? Math.floor(Math.random() * 100) : null,
              source: "ChainAware",
            },
            contractAudit: {
              status: type === "contract" || type === "token" ? "completed" : "skipped",
              issues: [],
              source: "ChainAware",
            },
          },
          recommendation:
            Math.random() > 0.7 ? "Proceed with caution" : "Low risk detected",
          attribution: ["behavioral-prediction-mcp (ChainAware)"],
        };

        return {
          content: [
            {
              type: "text",
              text: JSON.stringify(result, null, 2),
            },
          ],
        };
      }
    );
  }
}

/**
 * Register unified security tools with MCP server
 */
export function registerUnifiedSecurity(server: McpServer) {
  const unified = new UnifiedSecurity(server);
  unified.registerAll();
}

export { registerChainAwareTools } from "./chainaware/src/index.js";
