/**
 * Template Generator Tests
 * Tests for all x402-deploy template generators
 */

import { describe, it, expect, beforeEach } from "vitest";
import { X402Config } from "../../src/types/config.js";
import {
  generateDockerfile,
  generateDockerignore,
  generateNodeDockerfile,
  generatePythonDockerfile,
  generateNextjsDockerfile,
} from "../../src/templates/dockerfile.js";
import {
  generateDockerCompose,
  generateEnvExample,
} from "../../src/templates/docker-compose.js";
import {
  generateRailwayJson,
  generateRailwayToml,
  generateRailwayEnvVars,
} from "../../src/templates/railway.js";
import {
  generateFlyToml,
  generateFlySecrets,
} from "../../src/templates/fly.js";
import {
  generateVercelJson,
  generateVercelEnvs,
} from "../../src/templates/vercel.js";
import {
  generateNodeWrapper,
} from "../../src/templates/wrapper-code.js";

// Test fixture
const baseConfig: X402Config = {
  version: "1.0.0",
  name: "test-api",
  description: "Test API with x402 payments",
  type: "express-api",
  payment: {
    wallet: "0x1234567890123456789012345678901234567890",
    network: "base",
    token: "USDC",
    facilitator: "https://facilitator.x402.dev",
  },
  pricing: {
    model: "per-request",
    default: "$0.001",
    endpoints: {
      "/api/premium": "$0.01",
      "/api/basic": "$0.001",
    },
  },
  deploy: {
    provider: "docker",
    region: "us-east-1",
    instances: 1,
    resources: {
      memory: "512Mi",
      cpu: "0.5",
    },
  },
};

describe("Dockerfile Generator", () => {
  it("should generate a valid Dockerfile for Node.js projects", () => {
    const dockerfile = generateDockerfile(baseConfig, "mcp-server");

    expect(dockerfile).toContain("FROM node:");
    expect(dockerfile).toContain("WORKDIR /app");
    expect(dockerfile).toContain("COPY package*.json");
    expect(dockerfile).toContain("npm ci");
    expect(dockerfile).toContain("EXPOSE");
    expect(dockerfile).toContain("CMD");
  });

  it("should generate a valid Dockerfile for Python projects", () => {
    const pythonConfig: X402Config = {
      ...baseConfig,
      type: "fastapi",
    };

    const dockerfile = generateDockerfile(pythonConfig, "fastapi");

    expect(dockerfile).toContain("FROM python:");
    expect(dockerfile).toContain("WORKDIR /app");
    expect(dockerfile).toContain("requirements.txt");
    expect(dockerfile).toContain("pip install");
  });

  it("should generate a valid Dockerfile for Next.js projects", () => {
    const nextjsConfig: X402Config = {
      ...baseConfig,
      type: "nextjs",
    };

    const dockerfile = generateDockerfile(nextjsConfig, "nextjs");

    expect(dockerfile).toContain("FROM node:");
    expect(dockerfile).toContain("next");
  });

  it("should generate a .dockerignore file", () => {
    const dockerignore = generateDockerignore();

    expect(dockerignore).toContain("node_modules");
    expect(dockerignore).toContain(".git");
    expect(dockerignore).toContain(".env");
    expect(dockerignore).toContain("*.log");
  });

  it("should include health check in Dockerfile", () => {
    const dockerfile = generateNodeDockerfile(baseConfig);

    expect(dockerfile).toContain("HEALTHCHECK");
  });

  it("should set proper environment variables", () => {
    const dockerfile = generateDockerfile(baseConfig, "mcp-server");

    expect(dockerfile).toContain("ENV NODE_ENV=production");
    expect(dockerfile).toContain("PORT");
  });
});

describe("Docker Compose Generator", () => {
  it("should generate a valid docker-compose.yml", () => {
    const compose = generateDockerCompose(baseConfig);

    expect(compose).toContain("version:");
    expect(compose).toContain("services:");
    expect(compose).toContain("app:");
    expect(compose).toContain("build:");
    expect(compose).toContain("ports:");
  });

  it("should include environment variables", () => {
    const compose = generateDockerCompose(baseConfig);

    expect(compose).toContain("environment:");
    expect(compose).toContain("NODE_ENV");
    expect(compose).toContain("PORT");
  });

  it("should include health check configuration", () => {
    const compose = generateDockerCompose(baseConfig);

    expect(compose).toContain("healthcheck:");
  });

  it("should generate .env.example with all required variables", () => {
    const envExample = generateEnvExample(baseConfig);

    expect(envExample).toContain("X402_WALLET");
    expect(envExample).toContain("X402_NETWORK");
    expect(envExample).toContain("X402_TOKEN");
    expect(envExample).toContain("PORT");
  });

  it("should include resource limits", () => {
    const compose = generateDockerCompose(baseConfig);

    // Should have deploy or resources section
    expect(compose).toMatch(/deploy:|resources:|memory|cpus/);
  });
});

describe("Railway Template Generator", () => {
  it("should generate a valid railway.json", () => {
    const railwayJson = generateRailwayJson(baseConfig);

    expect(railwayJson).toContain('"$schema"');
    expect(railwayJson).toContain('"build"');
    expect(railwayJson).toContain('"deploy"');
  });

  it("should include environment variables", () => {
    const railwayJson = generateRailwayJson(baseConfig);
    const parsed = JSON.parse(railwayJson);

    expect(parsed.deploy).toBeDefined();
    expect(railwayJson).toContain("healthcheck");
  });

  it("should generate railway.toml with proper format", () => {
    const railwayToml = generateRailwayToml(baseConfig);

    expect(railwayToml).toContain("[build]");
    expect(railwayToml).toContain("[deploy]");
  });

  it("should generate environment variable configuration", () => {
    const envVars = generateRailwayEnvVars(baseConfig);

    expect(envVars).toHaveProperty("X402_WALLET");
    expect(envVars).toHaveProperty("X402_NETWORK");
    expect(envVars).toHaveProperty("NODE_ENV");
  });
});

describe("Fly.io Template Generator", () => {
  it("should generate a valid fly.toml", () => {
    const flyToml = generateFlyToml(baseConfig);

    expect(flyToml).toContain("app =");
    expect(flyToml).toContain("[build]");
    expect(flyToml).toContain("[http_service]");
  });

  it("should include health check configuration", () => {
    const flyToml = generateFlyToml(baseConfig);

    expect(flyToml).toContain("[checks]");
    expect(flyToml).toContain("type =");
    expect(flyToml).toContain("interval =");
  });

  it("should configure proper machine resources", () => {
    const flyToml = generateFlyToml(baseConfig);

    expect(flyToml).toContain("[vm]");
    expect(flyToml).toContain("memory");
  });

  it("should generate secrets configuration", () => {
    const secrets = generateFlySecrets(baseConfig);

    expect(secrets).toHaveProperty("X402_WALLET");
    expect(secrets).toHaveProperty("X402_NETWORK");
    expect(typeof secrets.X402_WALLET).toBe("string");
  });

  it("should configure auto-scaling", () => {
    const flyToml = generateFlyToml(baseConfig);

    expect(flyToml).toMatch(/min|max|auto_stop|auto_start/);
  });
});

describe("Vercel Template Generator", () => {
  it("should generate a valid vercel.json", () => {
    const vercelJson = generateVercelJson(baseConfig);

    expect(vercelJson).toContain('"version"');
    expect(vercelJson).toContain('"name"');
  });

  it("should include proper build configuration", () => {
    const vercelJson = generateVercelJson(baseConfig);
    const parsed = JSON.parse(vercelJson);

    expect(parsed.version).toBeDefined();
    expect(parsed.name).toBe(baseConfig.name);
  });

  it("should configure environment variables", () => {
    const envs = generateVercelEnvs(baseConfig);

    expect(envs).toHaveProperty("X402_WALLET");
    expect(envs).toHaveProperty("X402_NETWORK");
    expect(envs).toHaveProperty("X402_TOKEN");
  });

  it("should include API routes configuration", () => {
    const vercelJson = generateVercelJson(baseConfig);

    expect(vercelJson).toMatch(/routes|rewrites|functions/);
  });

  it("should set proper headers for CORS", () => {
    const vercelJson = generateVercelJson(baseConfig);

    // Should have headers or function configuration
    expect(vercelJson).toMatch(/headers|Access-Control/i);
  });
});

describe("Wrapper Code Generator", () => {
  it("should generate Node.js x402 middleware", () => {
    const wrapper = generateNodeWrapper(baseConfig);

    expect(wrapper).toContain("x402Middleware");
    expect(wrapper).toContain("verifyPayment");
    expect(wrapper).toContain("402");
  });

  it("should include payment verification logic", () => {
    const wrapper = generateNodeWrapper(baseConfig);

    expect(wrapper).toContain("Payment-Required");
    expect(wrapper).toContain("X-Payment");
  });

  it("should handle pricing configuration", () => {
    const wrapper = generateNodeWrapper(baseConfig);

    expect(wrapper).toContain(baseConfig.payment.wallet);
    expect(wrapper).toContain(baseConfig.payment.network);
  });

  it("should export proper middleware functions", () => {
    const wrapper = generateNodeWrapper(baseConfig);

    expect(wrapper).toContain("export");
    expect(wrapper).toMatch(/middleware|handler/i);
  });

  it("should include discovery endpoint", () => {
    const wrapper = generateNodeWrapper(baseConfig);

    expect(wrapper).toMatch(/discovery|\.well-known|x402/i);
  });
});

describe("Template Integration", () => {
  it("should generate consistent naming across templates", () => {
    const dockerfile = generateDockerfile(baseConfig, "mcp-server");
    const compose = generateDockerCompose(baseConfig);
    const flyToml = generateFlyToml(baseConfig);
    const vercelJson = generateVercelJson(baseConfig);

    // All should reference the same project name
    expect(compose).toContain(baseConfig.name);
    expect(flyToml).toContain(baseConfig.name.replace(/[^a-z0-9-]/gi, "-").toLowerCase());
    expect(vercelJson).toContain(baseConfig.name);
  });

  it("should use consistent port configuration", () => {
    const dockerfile = generateDockerfile(baseConfig, "mcp-server");
    const compose = generateDockerCompose(baseConfig);

    // Both should reference the same port
    expect(dockerfile).toContain("3000");
    expect(compose).toContain("3000");
  });

  it("should include proper x402 configuration in all templates", () => {
    const compose = generateDockerCompose(baseConfig);
    const railwayEnv = generateRailwayEnvVars(baseConfig);
    const flySecrets = generateFlySecrets(baseConfig);
    const vercelEnv = generateVercelEnvs(baseConfig);

    // All should include x402 wallet
    expect(compose).toContain("X402");
    expect(railwayEnv.X402_WALLET).toBe(baseConfig.payment.wallet);
    expect(flySecrets.X402_WALLET).toBe(baseConfig.payment.wallet);
    expect(vercelEnv.X402_WALLET).toBe(baseConfig.payment.wallet);
  });
});

describe("Edge Cases", () => {
  it("should handle config without optional fields", () => {
    const minimalConfig: X402Config = {
      version: "1.0.0",
      name: "minimal-api",
      type: "mcp-server",
      payment: {
        wallet: "0x1234567890123456789012345678901234567890",
        network: "base",
      },
      pricing: {
        model: "per-request",
        default: "$0.001",
      },
    };

    const dockerfile = generateDockerfile(minimalConfig, "mcp-server");
    const compose = generateDockerCompose(minimalConfig);

    expect(dockerfile).toBeDefined();
    expect(compose).toBeDefined();
  });

  it("should sanitize special characters in names", () => {
    const specialConfig: X402Config = {
      ...baseConfig,
      name: "My API & Service!",
    };

    const flyToml = generateFlyToml(specialConfig);

    // Should sanitize the name
    expect(flyToml).not.toContain("&");
    expect(flyToml).not.toContain("!");
  });

  it("should handle unknown project types gracefully", () => {
    const unknownConfig: X402Config = {
      ...baseConfig,
      type: "unknown",
    };

    const dockerfile = generateDockerfile(unknownConfig, "unknown");

    // Should still generate a valid Dockerfile
    expect(dockerfile).toContain("FROM");
    expect(dockerfile).toContain("WORKDIR");
  });
});
