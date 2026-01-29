import { Server } from "@modelcontextprotocol/sdk/server/index.js";
import { StreamableHTTPServerTransport } from "@modelcontextprotocol/sdk/server/streamableHttp.js";
import express from "express";
import { x402Middleware } from "./middleware.js";
import type { X402Config } from "../types/config.js";

export interface WrapMcpOptions {
  config: X402Config;
  server: Server;
  testMode?: boolean;
  generateDiscoveryDocument?: (origin: string, config: X402Config) => any;
}

// Session tracking for cleanup
interface SessionInfo {
  transport: StreamableHTTPServerTransport;
  lastActivity: number;
  createdAt: number;
}

/**
 * Wrap an MCP server with x402 payment gateway
 */
export function wrapMcpServer(options: WrapMcpOptions): express.Application {
  const { config, server, testMode, generateDiscoveryDocument } = options;
  const app = express();

  // Parse JSON bodies
  app.use(express.json());

  // Health check endpoint (always free)
  app.get("/health", (req, res) => {
    res.json({ status: "ok", version: config.version });
  });

  // Discovery document (always free)
  app.get("/.well-known/x402", (req, res) => {
    const origin = `${req.protocol}://${req.get("host")}`;
    if (generateDiscoveryDocument) {
      res.json(generateDiscoveryDocument(origin, config));
    } else {
      res.json({
        name: config.name,
        version: config.version,
        description: config.description,
        payment: config.payment,
        pricing: config.pricing,
      });
    }
  });

  // OpenAPI spec (always free)
  app.get("/openapi.json", (req, res) => {
    res.json(generateOpenApiSpec(config));
  });

  // Apply x402 middleware to /mcp endpoint
  app.use("/mcp", x402Middleware({ config, testMode }));

  // MCP protocol handler
  const sessions = new Map<string, SessionInfo>();

  app.all("/mcp", async (req, res) => {
    try {
      const sessionId = req.headers["mcp-session-id"] as string;
      let sessionInfo = sessions.get(sessionId);

      if (!sessionInfo) {
        const transport = new StreamableHTTPServerTransport({
          sessionIdGenerator: () => crypto.randomUUID(),
        });
        await server.connect(transport);
        sessionInfo = {
          transport,
          lastActivity: Date.now(),
          createdAt: Date.now(),
        };
        sessions.set(transport.sessionId, sessionInfo);
      } else {
        // Update last activity timestamp
        sessionInfo.lastActivity = Date.now();
      }

      await sessionInfo.transport.handleRequest(req, res);
    } catch (error) {
      console.error("MCP handler error:", error);
      res.status(500).json({ error: "MCP protocol error" });
    }
  });

  // Cleanup stale sessions periodically
  const cleanupInterval = setInterval(() => {
    const maxAge = 30 * 60 * 1000; // 30 minutes
    const now = Date.now();
    
    for (const [sessionId, sessionInfo] of sessions.entries()) {
      const timeSinceActivity = now - sessionInfo.lastActivity;
      if (timeSinceActivity > maxAge) {
        console.log(`[x402-mcp] Cleaning up stale session: ${sessionId} (inactive for ${Math.round(timeSinceActivity / 1000 / 60)} minutes)`);
        sessions.delete(sessionId);
      }
    }
  }, 60 * 1000);

  // Prevent the interval from keeping the process alive
  cleanupInterval.unref?.();

  return app;
}

/**
 * Generate OpenAPI spec for the wrapped MCP server
 */
function generateOpenApiSpec(config: X402Config) {
  return {
    openapi: "3.0.0",
    info: {
      title: config.name,
      version: config.version,
      description: `${config.name} - Monetized with x402`,
    },
    servers: [
      {
        url: "/",
        description: "x402-enabled API",
      },
    ],
    paths: {
      "/mcp": {
        post: {
          summary: "MCP Protocol Endpoint",
          description: "Model Context Protocol endpoint (requires x402 payment)",
          requestBody: {
            content: {
              "application/json": {
                schema: {
                  type: "object",
                },
              },
            },
          },
          responses: {
            "200": {
              description: "Successful response",
            },
            "402": {
              description: "Payment required",
              content: {
                "application/json": {
                  schema: {
                    $ref: "#/components/schemas/PaymentRequired",
                  },
                },
              },
            },
          },
        },
      },
      "/health": {
        get: {
          summary: "Health Check",
          responses: {
            "200": {
              description: "Server is healthy",
            },
          },
        },
      },
      "/.well-known/x402": {
        get: {
          summary: "x402 Discovery Document",
          responses: {
            "200": {
              description: "Discovery document",
            },
          },
        },
      },
    },
    components: {
      schemas: {
        PaymentRequired: {
          type: "object",
          properties: {
            error: { type: "string" },
            message: { type: "string" },
            accepts: {
              type: "object",
              properties: {
                scheme: { type: "string" },
                network: { type: "string" },
                maxAmountRequired: { type: "string" },
                payTo: { type: "string" },
              },
            },
          },
        },
      },
    },
  };
}

export interface MCPWrapperOptions {
  config: X402Config;
  mcpServerUrl: string;
}

/**
 * Create an MCP wrapper with x402 payment support
 * @param options Configuration options
 * @deprecated Use wrapMcpServer instead
 */
export function createMCPWrapper(options: MCPWrapperOptions) {
  throw new Error("createMCPWrapper is deprecated - use wrapMcpServer instead");
}
