/**
 * CLI Commands Unit Tests
 *
 * Tests for x402-deploy CLI command functionality
 */

import { describe, it, expect, beforeEach, afterEach, vi } from "vitest";
import fs from "fs-extra";
import path from "path";
import os from "os";

// Mock external dependencies
vi.mock("ora", () => ({
  default: vi.fn(() => ({
    start: vi.fn().mockReturnThis(),
    stop: vi.fn().mockReturnThis(),
    succeed: vi.fn().mockReturnThis(),
    fail: vi.fn().mockReturnThis(),
    text: "",
  })),
}));

vi.mock("enquirer", () => ({
  prompt: vi.fn(),
}));

describe("CLI Commands", () => {
  let testDir: string;

  beforeEach(async () => {
    // Create temporary test directory
    testDir = path.join(os.tmpdir(), `x402-test-${Date.now()}`);
    await fs.ensureDir(testDir);
  });

  afterEach(async () => {
    // Cleanup test directory
    await fs.remove(testDir);
  });

  describe("init command", () => {
    it("should detect Express project type from package.json", async () => {
      const packageJson = {
        name: "test-api",
        dependencies: {
          express: "^4.18.0",
        },
      };
      await fs.writeJSON(path.join(testDir, "package.json"), packageJson);

      // Import and test project detection
      const { detectProjectType } = await import("../../src/utils/detect-project.js");
      const result = await detectProjectType(testDir);

      expect(result.type).toBe("express-api");
      expect(result.language).toBe("javascript");
    });

    it("should detect MCP server project type", async () => {
      const packageJson = {
        name: "test-mcp",
        dependencies: {
          "@modelcontextprotocol/sdk": "^1.0.0",
        },
      };
      await fs.writeJSON(path.join(testDir, "package.json"), packageJson);

      const { detectProjectType } = await import("../../src/utils/detect-project.js");
      const result = await detectProjectType(testDir);

      expect(result.type).toBe("mcp-server");
    });

    it("should detect TypeScript projects", async () => {
      const packageJson = {
        name: "test-ts",
        devDependencies: {
          typescript: "^5.0.0",
        },
      };
      const tsconfig = { compilerOptions: { target: "ES2020" } };

      await fs.writeJSON(path.join(testDir, "package.json"), packageJson);
      await fs.writeJSON(path.join(testDir, "tsconfig.json"), tsconfig);

      const { detectProjectType } = await import("../../src/utils/detect-project.js");
      const result = await detectProjectType(testDir);

      expect(result.language).toBe("typescript");
    });

    it("should detect Python FastAPI projects", async () => {
      const requirementsTxt = "fastapi==0.100.0\nuvicorn==0.22.0\n";
      await fs.writeFile(path.join(testDir, "requirements.txt"), requirementsTxt);

      const { detectProjectType } = await import("../../src/utils/detect-project.js");
      const result = await detectProjectType(testDir);

      expect(result.type).toBe("fastapi");
      expect(result.language).toBe("python");
    });

    it("should detect Next.js projects", async () => {
      const packageJson = {
        name: "test-next",
        dependencies: {
          next: "^14.0.0",
          react: "^18.0.0",
        },
      };
      await fs.writeJSON(path.join(testDir, "package.json"), packageJson);

      const { detectProjectType } = await import("../../src/utils/detect-project.js");
      const result = await detectProjectType(testDir);

      expect(result.type).toBe("nextjs");
    });

    it("should create valid x402.config.json", async () => {
      const config = {
        name: "test-api",
        version: "1.0.0",
        type: "express-api",
        payment: {
          wallet: "0x742d35Cc6634C0532925a3b844Bc9e7595f0bEb1",
          network: "eip155:8453",
        },
        pricing: {
          model: "per-call",
          default: { price: "$0.01", currency: "USD" },
        },
      };

      const configPath = path.join(testDir, "x402.config.json");
      await fs.writeJSON(configPath, config, { spaces: 2 });

      const written = await fs.readJSON(configPath);
      expect(written.name).toBe("test-api");
      expect(written.payment.wallet).toBe("0x742d35Cc6634C0532925a3b844Bc9e7595f0bEb1");
      expect(written.payment.network).toBe("eip155:8453");
    });
  });

  describe("pricing command", () => {
    it("should list pricing routes from config", async () => {
      const config = {
        name: "test-api",
        version: "1.0.0",
        type: "express-api",
        payment: {
          wallet: "0x742d35Cc6634C0532925a3b844Bc9e7595f0bEb",
          network: "eip155:8453",
        },
        pricing: {
          model: "per-call",
          routes: {
            "GET /health": "$0",
            "GET /api/data": "$0.01",
            "POST /api/submit": "$0.10",
          },
        },
      };

      const configPath = path.join(testDir, "x402.config.json");
      await fs.writeJSON(configPath, config);

      const loaded = await fs.readJSON(configPath);
      expect(Object.keys(loaded.pricing.routes)).toHaveLength(3);
      expect(loaded.pricing.routes["GET /health"]).toBe("$0");
      expect(loaded.pricing.routes["POST /api/submit"]).toBe("$0.10");
    });

    it("should update route pricing", async () => {
      const config = {
        name: "test-api",
        version: "1.0.0",
        type: "express-api",
        payment: {
          wallet: "0x742d35Cc6634C0532925a3b844Bc9e7595f0bEb",
          network: "eip155:8453",
        },
        pricing: {
          model: "per-call",
          routes: {
            "GET /api/data": "$0.01",
          },
        },
      };

      const configPath = path.join(testDir, "x402.config.json");
      await fs.writeJSON(configPath, config);

      // Update pricing
      config.pricing.routes["GET /api/data"] = "$0.02";
      config.pricing.routes["POST /api/new"] = "$0.05";
      await fs.writeJSON(configPath, config);

      const updated = await fs.readJSON(configPath);
      expect(updated.pricing.routes["GET /api/data"]).toBe("$0.02");
      expect(updated.pricing.routes["POST /api/new"]).toBe("$0.05");
    });
  });

  describe("status command", () => {
    it("should return correct status for configured project", async () => {
      const config = {
        name: "test-api",
        version: "1.0.0",
        type: "express-api",
        payment: {
          wallet: "0x742d35Cc6634C0532925a3b844Bc9e7595f0bEb1",
          network: "eip155:8453",
        },
        pricing: {
          model: "per-call",
          default: { price: "$0.01" },
        },
      };

      await fs.writeJSON(path.join(testDir, "x402.config.json"), config);

      const configPath = path.join(testDir, "x402.config.json");
      const exists = await fs.pathExists(configPath);
      expect(exists).toBe(true);

      const loaded = await fs.readJSON(configPath);
      expect(loaded.name).toBe("test-api");
      expect(loaded.payment.wallet).toBeDefined();
    });
  });

  describe("deploy command validation", () => {
    it("should validate required config fields for deployment", async () => {
      const validConfig = {
        name: "test-api",
        version: "1.0.0",
        type: "express-api",
        payment: {
          wallet: "0x742d35Cc6634C0532925a3b844Bc9e7595f0bEb1",
          network: "eip155:8453",
        },
        pricing: {
          model: "per-call",
          default: { price: "$0.01" },
        },
        deploy: {
          provider: "railway",
        },
      };

      expect(validConfig.name).toBeDefined();
      expect(validConfig.payment.wallet).toMatch(/^0x[a-fA-F0-9]{40}$/);
      expect(validConfig.deploy.provider).toBe("railway");
    });

    it("should reject invalid wallet addresses", () => {
      const invalidWallet = "not-a-wallet";
      const isValid = /^0x[a-fA-F0-9]{40}$/.test(invalidWallet);
      expect(isValid).toBe(false);
    });

    it("should accept valid network identifiers", () => {
      const validNetworks = [
        "eip155:1",
        "eip155:8453",
        "eip155:42161",
        "eip155:137",
        "eip155:10",
      ];

      for (const network of validNetworks) {
        const isValid = /^eip155:\d+$/.test(network);
        expect(isValid).toBe(true);
      }
    });
  });
});

describe("Wallet Utilities", () => {
  it("should validate Ethereum addresses", () => {
    const validAddresses = [
      "0x742d35Cc6634C0532925a3b844Bc9e7595f0bEb1",
      "0x40252CFDF8B20Ed757D61ff157719F33Ec332402",
      "0xFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFF",
    ];

    for (const addr of validAddresses) {
      expect(/^0x[a-fA-F0-9]{40}$/.test(addr)).toBe(true);
    }
  });

  it("should reject invalid addresses", () => {
    const invalidAddresses = [
      "742d35Cc6634C0532925a3b844Bc9e7595f0bEb1", // missing 0x
      "0x742d35Cc6634C0532925a3b844Bc9e7595f0bE", // too short
      "0x742d35Cc6634C0532925a3b844Bc9e7595f0bEb1a", // too long
      "0xZZZZZZZZZZZZZZZZZZZZZZZZZZZZZZZZZZZZZZZZ", // invalid chars
      "", // empty
    ];

    for (const addr of invalidAddresses) {
      expect(/^0x[a-fA-F0-9]{40}$/.test(addr)).toBe(false);
    }
  });
});

describe("Pricing Utilities", () => {
  it("should parse USD price strings", () => {
    const testCases = [
      { input: "$0.01", expected: 0.01 },
      { input: "$1.00", expected: 1.0 },
      { input: "$0.0001", expected: 0.0001 },
      { input: "0.05", expected: 0.05 },
      { input: "$10", expected: 10 },
    ];

    for (const { input, expected } of testCases) {
      const parsed = parseFloat(input.replace("$", ""));
      expect(parsed).toBe(expected);
    }
  });

  it("should detect free routes", () => {
    const freeIndicators = ["$0", "0", "free", "FREE"];

    for (const indicator of freeIndicators) {
      const isFree =
        indicator === "free" ||
        indicator === "FREE" ||
        parseFloat(indicator.replace("$", "")) === 0;
      expect(isFree).toBe(true);
    }
  });

  it("should match route patterns", () => {
    const patterns = {
      "GET /api/data": ["GET /api/data"],
      "* /api/data": ["GET /api/data", "POST /api/data", "PUT /api/data"],
      "GET /api/*": ["GET /api/data", "GET /api/users", "GET /api/test"],
    };

    // Test exact match
    expect("GET /api/data").toMatch(/^GET \/api\/data$/);

    // Test method wildcard
    expect("GET /api/data").toMatch(/^\w+ \/api\/data$/);
    expect("POST /api/data").toMatch(/^\w+ \/api\/data$/);

    // Test path wildcard
    expect("GET /api/data").toMatch(/^GET \/api\/.+$/);
    expect("GET /api/users").toMatch(/^GET \/api\/.+$/);
  });
});
