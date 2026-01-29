/**
 * Discovery Document Unit Tests
 *
 * Tests for x402 discovery document generation and ownership proofs
 */

import { describe, it, expect, beforeEach, vi } from "vitest";
import { generateDiscoveryDocument, type DiscoveryDocument } from "../../src/discovery/document.js";
import type { X402Config } from "../../src/types/config.js";

// Test configurations - matches X402Config schema from types/config.ts
const baseConfig: X402Config = {
  name: "test-api",
  version: "1.0.0",
  type: "express-api",
  payment: {
    wallet: "0x742d35Cc6634C0532925a3b844Bc9e7595f0bEb",
    network: "eip155:8453",
    token: "USDC",
    facilitator: "https://facilitator.x402.dev",
  },
  pricing: {
    model: "per-call",
    default: "$0.01",
    routes: {
      "GET /api/data": "$0.001",
      "POST /api/submit": "$0.10",
      "GET /api/premium/*": "$0.05",
    },
  },
};

const minimalConfig: X402Config = {
  name: "minimal-api",
  version: "1.0.0",
  type: "mcp-server",
  payment: {
    wallet: "0x1234567890abcdef1234567890abcdef12345678",
    network: "eip155:8453",
    token: "USDC",
  },
  pricing: {
    model: "per-call",
  },
};

describe("Discovery Document Generator", () => {
  describe("Basic Document Generation", () => {
    it("generates valid x402 discovery document", () => {
      const doc = generateDiscoveryDocument(baseConfig, "https://api.example.com");

      expect(doc).toBeDefined();
      expect(doc.version).toBe(1);
      expect(doc.resources).toBeDefined();
      expect(Array.isArray(doc.resources)).toBe(true);
    });

    it("includes all pricing routes as resources", () => {
      const doc = generateDiscoveryDocument(baseConfig, "https://api.example.com");

      expect(doc.resources.length).toBeGreaterThan(0);
      // Should have resources for each pricing route
      expect(doc.resources).toEqual(
        expect.arrayContaining([
          expect.stringContaining("/api/data"),
          expect.stringContaining("/api/submit"),
        ])
      );
    });

    it("normalizes base URL (removes trailing slash)", () => {
      const doc1 = generateDiscoveryDocument(baseConfig, "https://api.example.com/");
      const doc2 = generateDiscoveryDocument(baseConfig, "https://api.example.com");

      // Both should produce the same resources (no double slashes)
      expect(doc1.resources).toEqual(doc2.resources);
      doc1.resources.forEach((resource) => {
        expect(resource).not.toContain("//api");
      });
    });

    it("handles minimal config without pricing routes", () => {
      const doc = generateDiscoveryDocument(minimalConfig, "https://api.example.com");

      expect(doc).toBeDefined();
      expect(doc.version).toBe(1);
      // Should provide default resources based on project type
      expect(doc.resources).toBeDefined();
    });
  });

  describe("Document Options", () => {
    it("includes metadata when requested", () => {
      const configWithMeta = {
        ...baseConfig,
        description: "Test API for x402 payments",
      };

      const doc = generateDiscoveryDocument(
        configWithMeta,
        "https://api.example.com",
        { includeMetadata: true }
      );

      expect(doc.metadata).toBeDefined();
      expect(doc.metadata?.name).toBe("test-api");
    });

    it("includes additional resources when provided", () => {
      const doc = generateDiscoveryDocument(
        baseConfig,
        "https://api.example.com",
        {
          additionalResources: [
            "https://api.example.com/api/custom",
            "https://api.example.com/api/extra",
          ],
        }
      );

      expect(doc.resources).toContain("https://api.example.com/api/custom");
      expect(doc.resources).toContain("https://api.example.com/api/extra");
    });

    it("includes custom ownership proofs when provided", () => {
      const customProof = "0x1234567890abcdef";
      const doc = generateDiscoveryDocument(
        baseConfig,
        "https://api.example.com",
        { ownershipProofs: [customProof] }
      );

      expect(doc.ownershipProofs).toContain(customProof);
    });

    it("includes custom instructions when provided", () => {
      const instructions = "Use x-payment header with Base network";
      const doc = generateDiscoveryDocument(
        baseConfig,
        "https://api.example.com",
        { instructions }
      );

      expect(doc.instructions).toBe(instructions);
    });
  });

  describe("Resource URL Generation", () => {
    it("handles routes with HTTP methods", () => {
      const configWithMethods = {
        ...minimalConfig,
        pricing: {
          model: "per-call" as const,
          routes: {
            "GET /api/read": "$0.001",
            "POST /api/write": "$0.01",
            "DELETE /api/remove": "$0.005",
          },
        },
      };

      const doc = generateDiscoveryDocument(
        configWithMethods,
        "https://api.example.com"
      );

      // Resources should be full URLs
      doc.resources.forEach((resource) => {
        expect(resource).toMatch(/^https:\/\/api\.example\.com\//);
      });
    });

    it("handles wildcard routes", () => {
      const configWithWildcard = {
        ...minimalConfig,
        pricing: {
          model: "per-call" as const,
          routes: {
            "GET /api/*": "$0.001",
            "GET /api/users/*/profile": "$0.01",
          },
        },
      };

      const doc = generateDiscoveryDocument(
        configWithWildcard,
        "https://api.example.com"
      );

      expect(doc.resources.length).toBeGreaterThan(0);
    });

    it("handles routes without methods", () => {
      const configNoMethods = {
        ...minimalConfig,
        pricing: {
          model: "per-call" as const,
          routes: {
            "/api/endpoint": "$0.001",
            "/data/resource": "$0.01",
          },
        },
      };

      const doc = generateDiscoveryDocument(
        configNoMethods,
        "https://api.example.com"
      );

      expect(doc.resources).toContain("https://api.example.com/api/endpoint");
      expect(doc.resources).toContain("https://api.example.com/data/resource");
    });
  });

  describe("Default Resources by Project Type", () => {
    it("generates MCP server default resources", () => {
      const mcpConfig: X402Config = {
        name: "mcp-test",
        version: "1.0.0",
        type: "mcp-server",
        payment: {
          wallet: "0x742d35Cc6634C0532925a3b844Bc9e7595f0bEb",
          network: "eip155:8453",
          token: "USDC",
        },
        pricing: {
          model: "per-call",
        },
      };

      const doc = generateDiscoveryDocument(mcpConfig, "https://mcp.example.com");

      // MCP servers should have default resources
      expect(doc.resources.length).toBeGreaterThan(0);
    });

    it("generates Express API default resources", () => {
      const expressConfig: X402Config = {
        name: "express-test",
        version: "1.0.0",
        type: "express-api",
        payment: {
          wallet: "0x742d35Cc6634C0532925a3b844Bc9e7595f0bEb",
          network: "eip155:8453",
          token: "USDC",
        },
        pricing: {
          model: "per-call",
        },
      };

      const doc = generateDiscoveryDocument(expressConfig, "https://api.example.com");

      expect(doc.resources.length).toBeGreaterThan(0);
    });
  });

  describe("Metadata Generation", () => {
    it("includes service metadata", () => {
      const configWithDetails = {
        ...baseConfig,
        description: "Premium API service",
        contact: "support@example.com",
        termsUrl: "https://example.com/terms",
        docsUrl: "https://docs.example.com",
      };

      const doc = generateDiscoveryDocument(
        configWithDetails,
        "https://api.example.com",
        { includeMetadata: true }
      );

      expect(doc.metadata).toBeDefined();
      expect(doc.metadata?.name).toBe("test-api");
      expect(doc.metadata?.version).toBe("1.0.0");
    });

    it("includes supported networks", () => {
      const doc = generateDiscoveryDocument(
        baseConfig,
        "https://api.example.com",
        { includeMetadata: true }
      );

      expect(doc.metadata?.supportedNetworks).toContain("eip155:8453");
    });

    it("includes supported tokens", () => {
      const configWithTokens = {
        ...baseConfig,
        payment: {
          ...baseConfig.payment,
          acceptedTokens: ["USDC", "USDT", "DAI"],
        },
      };

      const doc = generateDiscoveryDocument(
        configWithTokens,
        "https://api.example.com",
        { includeMetadata: true }
      );

      // Default token should be USDC for Base network
      expect(doc.metadata?.supportedTokens).toBeDefined();
    });
  });
});

describe("Document Validation", () => {
  it("produced document is JSON serializable", () => {
    const doc = generateDiscoveryDocument(
      baseConfig,
      "https://api.example.com",
      { includeMetadata: true }
    );

    const serialized = JSON.stringify(doc);
    const parsed = JSON.parse(serialized);

    expect(parsed.version).toBe(1);
    expect(parsed.resources).toEqual(doc.resources);
  });

  it("document has no undefined values", () => {
    const doc = generateDiscoveryDocument(baseConfig, "https://api.example.com");

    const hasUndefined = (obj: any): boolean => {
      for (const key in obj) {
        if (obj[key] === undefined) return true;
        if (typeof obj[key] === "object" && obj[key] !== null) {
          if (hasUndefined(obj[key])) return true;
        }
      }
      return false;
    };

    expect(hasUndefined(doc)).toBe(false);
  });

  it("resources are unique", () => {
    const doc = generateDiscoveryDocument(
      baseConfig,
      "https://api.example.com",
      {
        additionalResources: [
          "https://api.example.com/api/data", // duplicate
        ],
      }
    );

    const uniqueResources = [...new Set(doc.resources)];
    expect(doc.resources.length).toBe(uniqueResources.length);
  });
});

describe("Edge Cases", () => {
  it("handles empty pricing routes", () => {
    const emptyConfig: X402Config = {
      name: "empty-api",
      version: "1.0.0",
      type: "express-api",
      payment: {
        wallet: "0x742d35Cc6634C0532925a3b844Bc9e7595f0bEb",
        network: "eip155:8453",
        token: "USDC",
      },
      pricing: {
        model: "per-call",
        routes: {},
      },
    };

    const doc = generateDiscoveryDocument(emptyConfig, "https://api.example.com");

    expect(doc).toBeDefined();
    expect(doc.version).toBe(1);
  });

  it("handles special characters in service name", () => {
    const specialConfig: X402Config = {
      name: "test-api_v2.0@beta",
      version: "1.0.0",
      type: "express-api",
      payment: {
        wallet: "0x742d35Cc6634C0532925a3b844Bc9e7595f0bEb",
        network: "eip155:8453",
        token: "USDC",
      },
      pricing: {
        model: "per-call",
      },
    };

    const doc = generateDiscoveryDocument(
      specialConfig,
      "https://api.example.com",
      { includeMetadata: true }
    );

    expect(doc.metadata?.name).toBe("test-api_v2.0@beta");
  });

  it("handles very long URLs", () => {
    const longPath = "/api/" + "a".repeat(200);
    const configWithLongRoute: X402Config = {
      ...minimalConfig,
      pricing: {
        model: "per-call",
        routes: {
          [`GET ${longPath}`]: "$0.001",
        },
      },
    };

    const doc = generateDiscoveryDocument(
      configWithLongRoute,
      "https://api.example.com"
    );

    expect(doc.resources.length).toBeGreaterThan(0);
  });
});
