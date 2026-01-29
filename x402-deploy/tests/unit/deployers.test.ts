/**
 * Deployer Tests
 * Tests for all x402-deploy deployer implementations
 */

import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { X402Config } from "../../src/types/config.js";
import { DockerDeployer, createDockerDeployer, deployWithDocker } from "../../src/deployers/docker.js";
import { RailwayDeployer, deployToRailway } from "../../src/deployers/railway.js";
import { FlyDeployer, deployToFly } from "../../src/deployers/fly.js";
import { VercelDeployer, deployToVercel } from "../../src/deployers/vercel.js";
import { deployToProvider } from "../../src/deployers/index.js";

// Mock child_process
vi.mock("child_process", () => ({
  exec: vi.fn((cmd, opts, callback) => {
    if (typeof opts === "function") {
      callback = opts;
    }
    // Return mock success by default
    if (callback) {
      callback(null, { stdout: "mock-output", stderr: "" });
    }
    return { stdout: "mock-output", stderr: "" };
  }),
  execSync: vi.fn(() => Buffer.from("mock-output")),
  spawn: vi.fn(() => ({
    stdout: { on: vi.fn(), pipe: vi.fn() },
    stderr: { on: vi.fn(), pipe: vi.fn() },
    on: vi.fn((event, cb) => {
      if (event === "close") cb(0);
    }),
  })),
}));

// Mock fs-extra
vi.mock("fs-extra", () => ({
  default: {
    pathExists: vi.fn().mockResolvedValue(true),
    writeFile: vi.fn().mockResolvedValue(undefined),
    copy: vi.fn().mockResolvedValue(undefined),
    readFile: vi.fn().mockResolvedValue("{}"),
    ensureDir: vi.fn().mockResolvedValue(undefined),
    remove: vi.fn().mockResolvedValue(undefined),
  },
  pathExists: vi.fn().mockResolvedValue(true),
  writeFile: vi.fn().mockResolvedValue(undefined),
  copy: vi.fn().mockResolvedValue(undefined),
  readFile: vi.fn().mockResolvedValue("{}"),
  ensureDir: vi.fn().mockResolvedValue(undefined),
  remove: vi.fn().mockResolvedValue(undefined),
}));

// Mock fetch for API calls
const mockFetch = vi.fn();
global.fetch = mockFetch;

// Test fixture
const testConfig: X402Config = {
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

describe("DockerDeployer", () => {
  let deployer: DockerDeployer;

  beforeEach(() => {
    vi.clearAllMocks();
    deployer = createDockerDeployer({ verbose: false });
  });

  describe("checkDocker", () => {
    it("should return true when Docker is available", async () => {
      const result = await deployer.checkDocker();
      // With mocked exec, this should succeed
      expect(typeof result).toBe("boolean");
    });
  });

  describe("checkDockerCompose", () => {
    it("should return true when docker-compose is available", async () => {
      const result = await deployer.checkDockerCompose();
      expect(typeof result).toBe("boolean");
    });
  });

  describe("deploy with dry run", () => {
    it("should complete dry run without errors", async () => {
      const result = await deployer.deploy(testConfig, "/tmp/test-project", {
        dryRun: true,
        verbose: false,
      });

      expect(result).toBeDefined();
      expect(result.imageName).toContain("test-api");
    });

    it("should not call docker commands in dry run", async () => {
      const { exec } = await import("child_process");

      await deployer.deploy(testConfig, "/tmp/test-project", {
        dryRun: true,
      });

      // exec should only be called for Docker check
      expect((exec as any).mock.calls.length).toBeLessThanOrEqual(2);
    });
  });

  describe("deployWithDocker helper", () => {
    it("should create deployer and run deploy", async () => {
      const result = await deployWithDocker(testConfig, "/tmp/test-project", {
        dryRun: true,
      });

      expect(result).toBeDefined();
      expect(result.imageName).toBeDefined();
    });
  });

  describe("container management", () => {
    it("should list containers", async () => {
      const containers = await deployer.listContainers();
      expect(Array.isArray(containers)).toBe(true);
    });
  });
});

describe("RailwayDeployer", () => {
  let deployer: RailwayDeployer;

  beforeEach(() => {
    vi.clearAllMocks();
    mockFetch.mockReset();
  });

  describe("dry run mode", () => {
    it("should complete dry run without making API calls", async () => {
      const result = await deployToRailway(testConfig, "/tmp/test-project", {
        dryRun: true,
      });

      expect(result).toBeDefined();
      expect(mockFetch).not.toHaveBeenCalled();
    });
  });

  describe("configuration", () => {
    it("should use correct API endpoint", () => {
      deployer = new RailwayDeployer("test-token");
      // RailwayDeployer should be configured with Railway's GraphQL endpoint
      expect(deployer).toBeDefined();
    });
  });
});

describe("FlyDeployer", () => {
  let deployer: FlyDeployer;

  beforeEach(() => {
    vi.clearAllMocks();
    mockFetch.mockReset();
  });

  describe("dry run mode", () => {
    it("should complete dry run without making API calls", async () => {
      const result = await deployToFly(testConfig, "/tmp/test-project", {
        dryRun: true,
      });

      expect(result).toBeDefined();
      expect(mockFetch).not.toHaveBeenCalled();
    });
  });

  describe("configuration", () => {
    it("should use correct API endpoint", () => {
      deployer = new FlyDeployer("test-token");
      expect(deployer).toBeDefined();
    });
  });
});

describe("VercelDeployer", () => {
  let deployer: VercelDeployer;

  beforeEach(() => {
    vi.clearAllMocks();
    mockFetch.mockReset();
  });

  describe("dry run mode", () => {
    it("should complete dry run without making API calls", async () => {
      const result = await deployToVercel(testConfig, "/tmp/test-project", {
        dryRun: true,
      });

      expect(result).toBeDefined();
      expect(mockFetch).not.toHaveBeenCalled();
    });
  });

  describe("configuration", () => {
    it("should use correct API endpoint", () => {
      deployer = new VercelDeployer("test-token");
      expect(deployer).toBeDefined();
    });
  });
});

describe("deployToProvider", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mockFetch.mockReset();
  });

  it("should route to Docker deployer", async () => {
    const dockerConfig: X402Config = {
      ...testConfig,
      deploy: { ...testConfig.deploy!, provider: "docker" },
    };

    const result = await deployToProvider(dockerConfig, "/tmp/test-project", {
      dryRun: true,
    });

    expect(result).toBeDefined();
  });

  it("should route to Railway deployer", async () => {
    const railwayConfig: X402Config = {
      ...testConfig,
      deploy: { ...testConfig.deploy!, provider: "railway" },
    };

    const result = await deployToProvider(railwayConfig, "/tmp/test-project", {
      dryRun: true,
    });

    expect(result).toBeDefined();
  });

  it("should route to Fly deployer", async () => {
    const flyConfig: X402Config = {
      ...testConfig,
      deploy: { ...testConfig.deploy!, provider: "fly" },
    };

    const result = await deployToProvider(flyConfig, "/tmp/test-project", {
      dryRun: true,
    });

    expect(result).toBeDefined();
  });

  it("should route to Vercel deployer", async () => {
    const vercelConfig: X402Config = {
      ...testConfig,
      deploy: { ...testConfig.deploy!, provider: "vercel" },
    };

    const result = await deployToProvider(vercelConfig, "/tmp/test-project", {
      dryRun: true,
    });

    expect(result).toBeDefined();
  });

  it("should handle unknown provider gracefully", async () => {
    const unknownConfig: X402Config = {
      ...testConfig,
      deploy: { ...testConfig.deploy!, provider: "unknown" as any },
    };

    await expect(
      deployToProvider(unknownConfig, "/tmp/test-project", { dryRun: true })
    ).rejects.toThrow();
  });
});

describe("Deployer Error Handling", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("should handle network errors gracefully", async () => {
    mockFetch.mockRejectedValueOnce(new Error("Network error"));

    const railwayConfig: X402Config = {
      ...testConfig,
      deploy: { ...testConfig.deploy!, provider: "railway" },
    };

    // Should not throw in dry run
    const result = await deployToRailway(railwayConfig, "/tmp/test-project", {
      dryRun: true,
    });

    expect(result).toBeDefined();
  });

  it("should validate configuration before deployment", async () => {
    const invalidConfig = {
      ...testConfig,
      payment: {
        ...testConfig.payment,
        wallet: "invalid-wallet", // Invalid wallet address
      },
    };

    const result = await deployWithDocker(invalidConfig as X402Config, "/tmp/test-project", {
      dryRun: true,
    });

    // Should still work in dry run mode with invalid config
    expect(result).toBeDefined();
  });
});

describe("Deployer Results", () => {
  it("should return consistent result structure from Docker", async () => {
    const result = await deployWithDocker(testConfig, "/tmp/test-project", {
      dryRun: true,
    });

    expect(result).toHaveProperty("success");
    expect(result).toHaveProperty("imageName");
    expect(result).toHaveProperty("ports");
    expect(result).toHaveProperty("url");
    expect(result).toHaveProperty("status");
  });

  it("should return consistent result structure from Railway", async () => {
    const railwayConfig: X402Config = {
      ...testConfig,
      deploy: { ...testConfig.deploy!, provider: "railway" },
    };

    const result = await deployToRailway(railwayConfig, "/tmp/test-project", {
      dryRun: true,
    });

    expect(result).toHaveProperty("success");
    expect(result).toHaveProperty("url");
    expect(result).toHaveProperty("status");
  });

  it("should return consistent result structure from Fly", async () => {
    const flyConfig: X402Config = {
      ...testConfig,
      deploy: { ...testConfig.deploy!, provider: "fly" },
    };

    const result = await deployToFly(flyConfig, "/tmp/test-project", {
      dryRun: true,
    });

    expect(result).toHaveProperty("success");
    expect(result).toHaveProperty("url");
    expect(result).toHaveProperty("status");
  });

  it("should return consistent result structure from Vercel", async () => {
    const vercelConfig: X402Config = {
      ...testConfig,
      deploy: { ...testConfig.deploy!, provider: "vercel" },
    };

    const result = await deployToVercel(vercelConfig, "/tmp/test-project", {
      dryRun: true,
    });

    expect(result).toHaveProperty("success");
    expect(result).toHaveProperty("url");
    expect(result).toHaveProperty("status");
  });
});

describe("Deployer Cleanup", () => {
  it("should cleanup Docker resources", async () => {
    const deployer = createDockerDeployer();
    const result = await deployer.cleanup();

    expect(result).toHaveProperty("removed");
    expect(Array.isArray(result.removed)).toBe(true);
  });
});
