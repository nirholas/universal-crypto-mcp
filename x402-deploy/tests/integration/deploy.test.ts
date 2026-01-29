/**
 * Deployment Integration Tests
 *
 * Tests for the deployment flow including Docker, Railway, Vercel, and Fly.io
 */

import { describe, it, expect, beforeAll, afterAll, vi, beforeEach } from "vitest";
import { mkdtemp, rm, writeFile, mkdir, readFile } from "fs/promises";
import { existsSync } from "fs";
import { join } from "path";
import { tmpdir } from "os";

// Import modules to test
import { generateDockerfile } from "../../src/templates/dockerfile.js";
import { RailwayDeployer } from "../../src/deployers/railway.js";
import type { X402Config, ProjectType } from "../../src/types/config.js";

describe("Deployment Integration", () => {
  let tempDir: string;

  beforeAll(async () => {
    tempDir = await mkdtemp(join(tmpdir(), "x402-deploy-test-"));
  });

  afterAll(async () => {
    await rm(tempDir, { recursive: true, force: true });
  });

  describe("Dockerfile Generation", () => {
    // Config matches X402Config schema from types/config.ts
    const baseConfig: X402Config = {
      name: "test-api",
      version: "1.0.0",
      type: "express-api",
      description: "Test API for deployment",
      payment: {
        wallet: "0x742d35Cc6634C0532925a3b844Bc9e7595f0bEb",
        network: "eip155:8453",
        token: "USDC",
        facilitator: "https://facilitator.x402.dev",
      },
      pricing: {
        model: "per-call",
        default: "$0.01",
      },
      deploy: {
        provider: "railway",
        region: "us-west1",
      },
    };

    it("generates valid Dockerfile for Node.js projects", () => {
      const dockerfile = generateDockerfile(baseConfig, "express-api");

      expect(dockerfile).toContain("FROM node:20-alpine");
      expect(dockerfile).toContain("WORKDIR /app");
      expect(dockerfile).toContain("COPY package*.json");
    });

    it("generates multi-stage build Dockerfile", () => {
      const dockerfile = generateDockerfile(baseConfig, "express-api");

      // Should have build and production stages
      expect(dockerfile).toContain("AS builder");
      expect(dockerfile).toContain("AS production");
    });

    it("includes x402 labels in Dockerfile", () => {
      const dockerfile = generateDockerfile(baseConfig, "express-api");

      expect(dockerfile).toContain('x402.enabled="true"');
      expect(dockerfile).toContain(`x402.version="${baseConfig.version}"`);
    });

    it("generates correct Dockerfile for MCP servers", () => {
      const mcpConfig: X402Config = {
        ...baseConfig,
        name: "mcp-server",
        type: "mcp-server",
      };

      const dockerfile = generateDockerfile(mcpConfig, "mcp-server");

      expect(dockerfile).toContain("FROM node:20-alpine");
      expect(dockerfile).toContain("mcp-server");
    });

    it("generates correct Dockerfile for FastAPI projects", () => {
      const fastapiConfig: X402Config = {
        ...baseConfig,
        name: "fastapi-service",
        type: "fastapi",
      };

      const dockerfile = generateDockerfile(fastapiConfig, "fastapi");

      expect(dockerfile).toContain("FROM python:");
      expect(dockerfile).toContain("pip");
    });

    it("generates correct Dockerfile for Next.js projects", () => {
      const nextConfig: X402Config = {
        ...baseConfig,
        name: "nextjs-app",
        type: "nextjs",
      };

      const dockerfile = generateDockerfile(nextConfig, "nextjs");

      expect(dockerfile).toContain("FROM node:20-alpine");
      expect(dockerfile).toContain("next");
    });

    it("includes security best practices", () => {
      const dockerfile = generateDockerfile(baseConfig, "express-api");

      // Should create non-root user
      expect(dockerfile).toContain("adduser");
      expect(dockerfile).toContain("nodejs");
    });

    it("handles different package managers", () => {
      const dockerfile = generateDockerfile(baseConfig, "express-api");

      // Should handle pnpm, yarn, and npm
      expect(dockerfile).toContain("pnpm-lock.yaml");
      expect(dockerfile).toContain("yarn.lock");
      expect(dockerfile).toContain("npm ci");
    });
  });

  describe("Railway Deployer", () => {
    let deployer: RailwayDeployer;

    beforeEach(() => {
      // Create deployer with mock token
      vi.stubEnv("RAILWAY_TOKEN", "test-token");
      deployer = new RailwayDeployer("mock-token");
    });

    it("throws error when no API token provided", () => {
      vi.stubEnv("RAILWAY_TOKEN", "");

      expect(() => new RailwayDeployer("")).toThrow("Railway API token required");
    });

    it("initializes with provided token", () => {
      const deployer = new RailwayDeployer("my-test-token");
      expect(deployer).toBeDefined();
    });

    it("initializes with environment token", () => {
      vi.stubEnv("RAILWAY_TOKEN", "env-token");
      const deployer = new RailwayDeployer();
      expect(deployer).toBeDefined();
    });
  });

  describe("Project Setup", () => {
    it("creates project directory structure", async () => {
      const projectDir = join(tempDir, "test-project");
      await mkdir(projectDir, { recursive: true });

      // Create basic project files
      await writeFile(
        join(projectDir, "package.json"),
        JSON.stringify({
          name: "test-project",
          version: "1.0.0",
          dependencies: {
            express: "^4.18.0",
          },
        })
      );

      await writeFile(
        join(projectDir, "x402.json"),
        JSON.stringify({
          name: "test-api",
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
        })
      );

      // Verify files exist
      expect(existsSync(join(projectDir, "package.json"))).toBe(true);
      expect(existsSync(join(projectDir, "x402.json"))).toBe(true);
    });

    it("reads and validates x402 config", async () => {
      const projectDir = join(tempDir, "config-test");
      await mkdir(projectDir, { recursive: true });

      const config: X402Config = {
        name: "validated-api",
        version: "1.0.0",
        type: "express-api",
        payment: {
          wallet: "0x742d35Cc6634C0532925a3b844Bc9e7595f0bEb",
          network: "eip155:8453",
          token: "USDC",
        },
        pricing: {
          model: "per-call",
          routes: {
            "GET /api/data": "$0.001",
          },
        },
      };

      await writeFile(join(projectDir, "x402.json"), JSON.stringify(config, null, 2));

      const content = await readFile(join(projectDir, "x402.json"), "utf-8");
      const parsed = JSON.parse(content) as X402Config;

      expect(parsed.name).toBe("validated-api");
      expect(parsed.payment.wallet).toBe("0x742d35Cc6634C0532925a3b844Bc9e7595f0bEb");
      expect(parsed.payment.network).toBe("eip155:8453");
    });
  });

  describe("Template Generation", () => {
    it("generates Docker Compose template", async () => {
      const config: X402Config = {
        name: "compose-test",
        version: "1.0.0",
        type: "express-api",
        payment: {
          wallet: "0x742d35Cc6634C0532925a3b844Bc9e7595f0bEb",
          network: "eip155:8453",
          token: "USDC",
        },
        pricing: {
          model: "per-call",
          default: "$0.01",
        },
        deploy: {
          provider: "docker",
        },
      };

      // Import dynamically to avoid issues
      const { generateDockerCompose } = await import(
        "../../src/templates/docker-compose.js"
      );

      const compose = generateDockerCompose(config);

      expect(compose).toContain("version:");
      expect(compose).toContain("services:");
      expect(compose).toContain("3000");
    });

    it("generates Railway config template", async () => {
      const config: X402Config = {
        name: "railway-test",
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

      const { generateRailwayJson } = await import(
        "../../src/templates/railway.js"
      );

      const railwayConfig = generateRailwayJson(config);

      expect(railwayConfig).toBeDefined();
    });

    it("generates Vercel config template", async () => {
      const config: X402Config = {
        name: "vercel-test",
        version: "1.0.0",
        type: "nextjs",
        payment: {
          wallet: "0x742d35Cc6634C0532925a3b844Bc9e7595f0bEb",
          network: "eip155:8453",
          token: "USDC",
        },
        pricing: {
          model: "per-call",
        },
      };

      const { generateVercelJson } = await import(
        "../../src/templates/vercel.js"
      );

      const vercelConfig = generateVercelJson(config);

      expect(vercelConfig).toBeDefined();
    });

    it("generates Fly.io config template", async () => {
      const config: X402Config = {
        name: "fly-test",
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
        deploy: {
          provider: "fly",
          region: "ord",
        },
      };

      const { generateFlyToml } = await import("../../src/templates/fly.js");

      const flyConfig = generateFlyToml(config);

      expect(flyConfig).toContain("app =");
      expect(flyConfig).toContain("internal_port = 3000");
    });
  });

  describe("Wrapper Code Generation", () => {
    it("generates Express wrapper code", async () => {
      const config: X402Config = {
        name: "express-wrapper-test",
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
        },
      };

      const { generateNodeWrapper } = await import(
        "../../src/templates/wrapper-code.js"
      );

      const wrapper = generateNodeWrapper(config);

      expect(wrapper).toContain("x402Middleware");
      expect(wrapper).toContain("express");
      expect(wrapper).toContain(config.payment.wallet);
    });

    it("generates MCP wrapper code", async () => {
      const config: X402Config = {
        name: "mcp-wrapper-test",
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

      const { generateMcpWrapper } = await import(
        "../../src/templates/wrapper-code.js"
      );

      const wrapper = generateMcpWrapper(config);

      expect(wrapper).toContain("MCP");
    });
  });

  describe("Environment Variable Generation", () => {
    it("generates correct environment variables for deployment", async () => {
      const config: X402Config = {
        name: "env-test",
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
        },
        deploy: {
          provider: "railway",
        },
      };

      const { generateRailwayEnvVars } = await import(
        "../../src/templates/railway.js"
      );

      const envVars = generateRailwayEnvVars(config);

      expect(envVars.X402_WALLET).toBe("0x742d35Cc6634C0532925a3b844Bc9e7595f0bEb");
      expect(envVars.X402_NETWORK).toBe("eip155:8453");
      expect(envVars.X402_FACILITATOR).toBe("https://facilitator.x402.dev");
    });
  });
});

describe("Dry Run Deployments", () => {
  let tempDir: string;

  beforeAll(async () => {
    tempDir = await mkdtemp(join(tmpdir(), "x402-dryrun-"));
  });

  afterAll(async () => {
    await rm(tempDir, { recursive: true, force: true });
  });

  it("validates configuration without deploying", async () => {
    const config: X402Config = {
      name: "dryrun-test",
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

    // Write config file
    await writeFile(join(tempDir, "x402.json"), JSON.stringify(config, null, 2));

    // Read and validate
    const content = await readFile(join(tempDir, "x402.json"), "utf-8");
    const parsed = JSON.parse(content);

    // Validation checks
    expect(parsed.name).toBeTruthy();
    expect(parsed.payment.wallet).toMatch(/^0x[a-fA-F0-9]+$/);
    expect(parsed.payment.network).toMatch(/^eip155:\d+$/);
  });

  it("generates deployment artifacts without executing", async () => {
    const projectDir = join(tempDir, "artifacts-test");
    await mkdir(projectDir, { recursive: true });

    const config: X402Config = {
      name: "artifacts-api",
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
      deploy: {
        provider: "docker",
      },
    };

    // Generate Dockerfile
    const dockerfile = generateDockerfile(config, "express-api");
    await writeFile(join(projectDir, "Dockerfile"), dockerfile);

    // Verify artifact was created
    expect(existsSync(join(projectDir, "Dockerfile"))).toBe(true);

    const content = await readFile(join(projectDir, "Dockerfile"), "utf-8");
    expect(content).toContain("FROM node:20-alpine");
  });
});

describe("Error Handling", () => {
  it("handles invalid wallet address", () => {
    // Use 'as any' to test error handling with invalid data
    const config = {
      name: "invalid-wallet",
      version: "1.0.0",
      type: "express-api",
      payment: {
        wallet: "invalid-address",
        network: "eip155:8453",
        token: "USDC",
      },
      pricing: {
        model: "per-call",
      },
    } as X402Config;

    // Should still generate Dockerfile (validation happens elsewhere)
    const dockerfile = generateDockerfile(config, "express-api");
    expect(dockerfile).toBeDefined();
  });

  it("handles unknown project type gracefully", () => {
    const config = {
      name: "unknown-type",
      version: "1.0.0",
      type: "unknown",
      payment: {
        wallet: "0x742d35Cc6634C0532925a3b844Bc9e7595f0bEb",
        network: "eip155:8453",
        token: "USDC",
      },
      pricing: {
        model: "per-call",
      },
    } as X402Config;

    // Should fall back to default Node.js template
    const dockerfile = generateDockerfile(config, "unknown");
    expect(dockerfile).toContain("FROM node:20-alpine");
  });

  it("handles missing optional fields", () => {
    const minimalConfig: X402Config = {
      name: "minimal",
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

    const dockerfile = generateDockerfile(minimalConfig, "express-api");
    expect(dockerfile).toBeDefined();
    expect(dockerfile).toContain("minimal");
  });
});
