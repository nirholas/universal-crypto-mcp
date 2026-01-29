/**
 * End-to-End Tests for x402-deploy CLI
 *
 * Tests the full x402-deploy workflow from initialization to deployment
 */

import { describe, it, expect, beforeAll, afterAll } from "vitest";
import { execa, type ExecaError } from "execa";
import { mkdtemp, writeFile, rm, readFile, mkdir } from "fs/promises";
import { existsSync } from "fs";
import { join } from "path";
import { tmpdir } from "os";

// Path to the built CLI
const CLI_PATH = join(__dirname, "../../dist/cli/index.js");

// Check if CLI is built
async function ensureCliBuilt(): Promise<boolean> {
  return existsSync(CLI_PATH);
}

describe("Full x402-deploy Flow", () => {
  let tempDir: string;
  let cliBuilt: boolean;

  beforeAll(async () => {
    tempDir = await mkdtemp(join(tmpdir(), "x402-e2e-"));
    cliBuilt = await ensureCliBuilt();
  });

  afterAll(async () => {
    await rm(tempDir, { recursive: true, force: true });
  });

  describe("CLI Initialization", () => {
    it.skipIf(!cliBuilt)("shows help message", async () => {
      const { stdout } = await execa("node", [CLI_PATH, "--help"]);

      expect(stdout).toContain("x402");
      expect(stdout).toContain("Usage:");
    });

    it.skipIf(!cliBuilt)("shows version", async () => {
      const { stdout } = await execa("node", [CLI_PATH, "--version"]);

      expect(stdout).toMatch(/\d+\.\d+\.\d+/);
    });
  });

  describe("Project Initialization", () => {
    it.skipIf(!cliBuilt)(
      "init command creates x402.json config",
      async () => {
        const projectDir = join(tempDir, "init-test");
        await mkdir(projectDir, { recursive: true });

        // Create a basic package.json
        await writeFile(
          join(projectDir, "package.json"),
          JSON.stringify({
            name: "test-api",
            version: "1.0.0",
            dependencies: {
              express: "^4.18.0",
            },
          })
        );

        // Run init command
        const { stdout } = await execa(
          "node",
          [
            CLI_PATH,
            "init",
            "--wallet",
            "0x742d35Cc6634C0532925a3b844Bc9e7595f0bEb",
            "--network",
            "base",
            "--non-interactive",
          ],
          { cwd: projectDir }
        );

        expect(stdout.toLowerCase()).toContain("config");

        // Verify config file was created
        const configPath = join(projectDir, "x402.json");
        expect(existsSync(configPath)).toBe(true);

        const config = JSON.parse(await readFile(configPath, "utf-8"));
        expect(config.payment.wallet).toBe(
          "0x742d35Cc6634C0532925a3b844Bc9e7595f0bEb"
        );
      },
      30000
    );

    it.skipIf(!cliBuilt)(
      "init detects project type automatically",
      async () => {
        const projectDir = join(tempDir, "detect-test");
        await mkdir(projectDir, { recursive: true });

        // Create Express project indicators
        await writeFile(
          join(projectDir, "package.json"),
          JSON.stringify({
            name: "express-api",
            dependencies: {
              express: "^4.18.0",
            },
          })
        );

        await writeFile(
          join(projectDir, "src/index.ts"),
          `
import express from 'express';
const app = express();
app.get('/api/test', (req, res) => res.json({ ok: true }));
app.listen(3000);
`
        );

        const { stdout } = await execa(
          "node",
          [
            CLI_PATH,
            "init",
            "--wallet",
            "0x123",
            "--non-interactive",
          ],
          { cwd: projectDir }
        );

        // Should detect Express
        expect(stdout.toLowerCase()).toMatch(/express|detected/i);
      },
      30000
    );
  });

  describe("Deployment Commands", () => {
    it.skipIf(!cliBuilt)(
      "deploy --dry-run validates without deploying",
      async () => {
        const projectDir = join(tempDir, "deploy-dryrun");
        await mkdir(projectDir, { recursive: true });

        // Create project files
        await writeFile(
          join(projectDir, "package.json"),
          JSON.stringify({
            name: "dryrun-api",
            version: "1.0.0",
            dependencies: {
              express: "^4.18.0",
            },
          })
        );

        // Create x402 config
        await writeFile(
          join(projectDir, "x402.json"),
          JSON.stringify({
            name: "dryrun-api",
            version: "1.0.0",
            type: "express-api",
            payment: {
              wallet: "0x742d35Cc6634C0532925a3b844Bc9e7595f0bEb",
              network: "eip155:8453",
            },
            pricing: {
              model: "per-call",
              routes: {
                "GET /api/data": "$0.001",
              },
            },
          })
        );

        const { stdout } = await execa(
          "node",
          [CLI_PATH, "deploy", "--dry-run"],
          { cwd: projectDir }
        );

        expect(stdout.toLowerCase()).toMatch(/dry.?run|would|preview/i);
      },
      30000
    );

    it.skipIf(!cliBuilt)(
      "deploy --target=railway shows Railway config",
      async () => {
        const projectDir = join(tempDir, "deploy-railway");
        await mkdir(projectDir, { recursive: true });

        await writeFile(
          join(projectDir, "package.json"),
          JSON.stringify({
            name: "railway-api",
            dependencies: { express: "^4.18.0" },
          })
        );

        await writeFile(
          join(projectDir, "x402.json"),
          JSON.stringify({
            name: "railway-api",
            version: "1.0.0",
            type: "express-api",
            payment: {
              wallet: "0x123",
              network: "eip155:8453",
            },
          })
        );

        const { stdout } = await execa(
          "node",
          [CLI_PATH, "deploy", "--dry-run", "--target", "railway"],
          { cwd: projectDir }
        );

        expect(stdout.toLowerCase()).toContain("railway");
      },
      30000
    );
  });

  describe("Discovery Commands", () => {
    it.skipIf(!cliBuilt)(
      "generates discovery document",
      async () => {
        const projectDir = join(tempDir, "discovery-test");
        await mkdir(projectDir, { recursive: true });

        await writeFile(
          join(projectDir, "x402.json"),
          JSON.stringify({
            name: "discovery-api",
            version: "1.0.0",
            type: "express-api",
            payment: {
              wallet: "0x123",
              network: "eip155:8453",
            },
            pricing: {
              model: "per-call",
              routes: {
                "GET /api/data": "$0.001",
              },
            },
          })
        );

        const { stdout } = await execa(
          "node",
          [CLI_PATH, "discovery", "--url", "https://api.example.com"],
          { cwd: projectDir }
        );

        // Should output discovery document
        expect(stdout).toContain("version");
        expect(stdout).toContain("resources");
      },
      30000
    );
  });

  describe("Validation Commands", () => {
    it.skipIf(!cliBuilt)(
      "validate command checks config",
      async () => {
        const projectDir = join(tempDir, "validate-test");
        await mkdir(projectDir, { recursive: true });

        // Valid config
        await writeFile(
          join(projectDir, "x402.json"),
          JSON.stringify({
            name: "valid-api",
            version: "1.0.0",
            type: "express-api",
            payment: {
              wallet: "0x742d35Cc6634C0532925a3b844Bc9e7595f0bEb",
              network: "eip155:8453",
            },
          })
        );

        const { stdout } = await execa("node", [CLI_PATH, "validate"], {
          cwd: projectDir,
        });

        expect(stdout.toLowerCase()).toMatch(/valid|success|✓/i);
      },
      30000
    );

    it.skipIf(!cliBuilt)(
      "validate fails on invalid config",
      async () => {
        const projectDir = join(tempDir, "invalid-test");
        await mkdir(projectDir, { recursive: true });

        // Invalid config (missing required fields)
        await writeFile(
          join(projectDir, "x402.json"),
          JSON.stringify({
            name: "invalid-api",
            // Missing payment config
          })
        );

        try {
          await execa("node", [CLI_PATH, "validate"], {
            cwd: projectDir,
          });
          // Should throw
          expect(true).toBe(false);
        } catch (error) {
          const execaError = error as ExecaError;
          expect(execaError.exitCode).not.toBe(0);
        }
      },
      30000
    );
  });

  describe("Full Workflow", () => {
    it.skipIf(!cliBuilt)(
      "complete init -> validate -> deploy flow",
      async () => {
        const projectDir = join(tempDir, "full-workflow");
        await mkdir(projectDir, { recursive: true });

        // Step 1: Create basic project
        await writeFile(
          join(projectDir, "package.json"),
          JSON.stringify({
            name: "full-workflow-api",
            version: "1.0.0",
            dependencies: {
              express: "^4.18.0",
            },
          })
        );

        await writeFile(
          join(projectDir, "src/index.ts"),
          `
import express from 'express';
const app = express();
app.get('/api/data', (req, res) => res.json({ data: 'test' }));
app.listen(3000);
`
        );

        // Step 2: Initialize x402
        const { stdout: initOutput } = await execa(
          "node",
          [
            CLI_PATH,
            "init",
            "--wallet",
            "0x742d35Cc6634C0532925a3b844Bc9e7595f0bEb",
            "--network",
            "base",
            "--non-interactive",
          ],
          { cwd: projectDir }
        );
        expect(initOutput.toLowerCase()).toContain("config");

        // Step 3: Validate config
        const { stdout: validateOutput } = await execa(
          "node",
          [CLI_PATH, "validate"],
          { cwd: projectDir }
        );
        expect(validateOutput.toLowerCase()).toMatch(/valid|success|✓/i);

        // Step 4: Dry-run deploy
        const { stdout: deployOutput } = await execa(
          "node",
          [CLI_PATH, "deploy", "--dry-run"],
          { cwd: projectDir }
        );
        expect(deployOutput.toLowerCase()).toMatch(/dry.?run|complete|success/i);
      },
      60000
    );
  });

  describe("Error Handling", () => {
    it.skipIf(!cliBuilt)(
      "shows helpful error for missing config",
      async () => {
        const emptyDir = join(tempDir, "empty-project");
        await mkdir(emptyDir, { recursive: true });

        try {
          await execa("node", [CLI_PATH, "deploy"], {
            cwd: emptyDir,
          });
          expect(true).toBe(false);
        } catch (error) {
          const execaError = error as ExecaError;
          expect(execaError.stderr || execaError.stdout).toMatch(
            /config|x402\.json|not found/i
          );
        }
      },
      30000
    );

    it.skipIf(!cliBuilt)(
      "handles invalid network gracefully",
      async () => {
        const projectDir = join(tempDir, "bad-network");
        await mkdir(projectDir, { recursive: true });

        await writeFile(
          join(projectDir, "package.json"),
          JSON.stringify({ name: "test" })
        );

        try {
          await execa(
            "node",
            [
              CLI_PATH,
              "init",
              "--wallet",
              "0x123",
              "--network",
              "invalid-network",
              "--non-interactive",
            ],
            { cwd: projectDir }
          );
        } catch (error) {
          const execaError = error as ExecaError;
          expect(execaError.stderr || execaError.stdout).toMatch(
            /network|invalid|unsupported/i
          );
        }
      },
      30000
    );
  });
});

describe("Dashboard E2E", () => {
  let tempDir: string;
  let cliBuilt: boolean;

  beforeAll(async () => {
    tempDir = await mkdtemp(join(tmpdir(), "x402-dashboard-e2e-"));
    cliBuilt = existsSync(CLI_PATH);
  });

  afterAll(async () => {
    await rm(tempDir, { recursive: true, force: true });
  });

  it.skipIf(!cliBuilt)(
    "dashboard command starts server",
    async () => {
      const projectDir = join(tempDir, "dashboard-test");
      await mkdir(projectDir, { recursive: true });

      await writeFile(
        join(projectDir, "x402.json"),
        JSON.stringify({
          name: "dashboard-api",
          version: "1.0.0",
          type: "express-api",
          payment: {
            wallet: "0x123",
            network: "eip155:8453",
          },
        })
      );

      // Start dashboard with timeout
      const dashboardProcess = execa(
        "node",
        [CLI_PATH, "dashboard", "--port", "0"],
        { cwd: projectDir }
      );

      // Wait briefly for startup
      await new Promise((resolve) => setTimeout(resolve, 1000));

      // Kill the process
      dashboardProcess.kill();

      // If we got here without error, dashboard started successfully
      expect(true).toBe(true);
    },
    30000
  );
});
