/**
 * Fly.io Deployer
 * Deploy x402-wrapped projects to Fly.io using their API and flyctl
 */

import { exec } from "child_process";
import { promisify } from "util";
import path from "path";
import fs from "fs-extra";
import { X402Config } from "../types/config.js";
import { generateFlyToml, generateFlySecrets } from "../templates/fly.js";

const execAsync = promisify(exec);

/**
 * Fly.io app interface
 */
export interface FlyApp {
  name: string;
  status: string;
  organization: {
    slug: string;
  };
  deployed: boolean;
  hostname: string;
}

/**
 * Fly.io machine interface
 */
export interface FlyMachine {
  id: string;
  name: string;
  state: "created" | "starting" | "started" | "stopping" | "stopped" | "destroying" | "destroyed";
  region: string;
  created_at: string;
}

/**
 * Fly.io deployment interface
 */
export interface FlyDeployment {
  id: string;
  appId: string;
  status: "pending" | "running" | "successful" | "failed" | "cancelled";
  createdAt: string;
}

/**
 * Fly.io deploy result
 */
export interface FlyDeployResult {
  appName: string;
  appUrl: string;
  status: string;
  machines: FlyMachine[];
  regions: string[];
}

/**
 * Fly.io deployer class
 */
export class FlyDeployer {
  private apiToken: string;
  private baseUrl = "https://api.machines.dev/v1";
  private organization: string;

  constructor(apiToken?: string, organization?: string) {
    this.apiToken = apiToken || process.env.FLY_API_TOKEN || "";
    this.organization = organization || process.env.FLY_ORG || "personal";

    if (!this.apiToken) {
      throw new Error(
        "Fly.io API token required. Set FLY_API_TOKEN environment variable or pass token to constructor."
      );
    }
  }

  /**
   * Execute an API request against Fly.io Machines API
   */
  private async api<T>(
    method: string,
    endpoint: string,
    body?: unknown,
    appName?: string
  ): Promise<T> {
    const url = appName
      ? `${this.baseUrl}/apps/${appName}${endpoint}`
      : `${this.baseUrl}${endpoint}`;

    const response = await fetch(url, {
      method,
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${this.apiToken}`,
      },
      body: body ? JSON.stringify(body) : undefined,
    });

    if (!response.ok) {
      const error = await response.text();
      throw new Error(`Fly.io API error: ${response.status} - ${error}`);
    }

    if (response.status === 204) {
      return {} as T;
    }

    return response.json();
  }

  /**
   * Execute flyctl command
   */
  private async flyctl(args: string[], cwd?: string): Promise<string> {
    try {
      const { stdout, stderr } = await execAsync(`flyctl ${args.join(" ")}`, {
        cwd,
        env: {
          ...process.env,
          FLY_API_TOKEN: this.apiToken,
        },
      });

      if (stderr && !stderr.includes("Warning")) {
        console.warn(`[fly] flyctl stderr: ${stderr}`);
      }

      return stdout.trim();
    } catch (error: any) {
      if (error.stderr) {
        throw new Error(`flyctl error: ${error.stderr}`);
      }
      throw error;
    }
  }

  /**
   * Check if flyctl is installed
   */
  async checkFlyctl(): Promise<boolean> {
    try {
      await execAsync("flyctl version");
      return true;
    } catch {
      return false;
    }
  }

  /**
   * Create a new Fly.io app
   */
  async createApp(name: string, organization?: string): Promise<FlyApp> {
    const org = organization || this.organization;

    return this.api<FlyApp>("POST", "/apps", {
      app_name: name,
      org_slug: org,
    });
  }

  /**
   * Get an existing app
   */
  async getApp(name: string): Promise<FlyApp | null> {
    try {
      return await this.api<FlyApp>("GET", "", undefined, name);
    } catch {
      return null;
    }
  }

  /**
   * List all apps
   */
  async listApps(): Promise<FlyApp[]> {
    const data = await this.api<{ apps: FlyApp[] }>("GET", `/apps?org_slug=${this.organization}`);
    return data.apps || [];
  }

  /**
   * Create a machine
   */
  async createMachine(
    appName: string,
    config: {
      name?: string;
      region: string;
      image: string;
      env?: Record<string, string>;
      services?: Array<{
        ports: Array<{ port: number; handlers: string[] }>;
        protocol: string;
        internal_port: number;
      }>;
      size?: string;
      memory?: number;
    }
  ): Promise<FlyMachine> {
    return this.api<FlyMachine>("POST", "/machines", {
      name: config.name,
      region: config.region,
      config: {
        image: config.image,
        env: config.env,
        services: config.services,
        guest: {
          cpu_kind: "shared",
          cpus: 1,
          memory_mb: config.memory || 256,
        },
      },
    }, appName);
  }

  /**
   * List machines for an app
   */
  async listMachines(appName: string): Promise<FlyMachine[]> {
    return this.api<FlyMachine[]>("GET", "/machines", undefined, appName);
  }

  /**
   * Start a machine
   */
  async startMachine(appName: string, machineId: string): Promise<void> {
    await this.api("POST", `/machines/${machineId}/start`, undefined, appName);
  }

  /**
   * Stop a machine
   */
  async stopMachine(appName: string, machineId: string): Promise<void> {
    await this.api("POST", `/machines/${machineId}/stop`, undefined, appName);
  }

  /**
   * Delete a machine
   */
  async deleteMachine(appName: string, machineId: string): Promise<void> {
    await this.api("DELETE", `/machines/${machineId}`, undefined, appName);
  }

  /**
   * Set secrets for an app
   */
  async setSecrets(appName: string, secrets: Record<string, string>): Promise<void> {
    const secretArgs = Object.entries(secrets)
      .map(([key, value]) => `${key}="${value}"`)
      .join(" ");

    await this.flyctl(["secrets", "set", secretArgs, "-a", appName]);
  }

  /**
   * Deploy using flyctl
   */
  async deployWithFlyctl(appName: string, projectDir: string): Promise<FlyDeployResult> {
    // Check if flyctl is available
    const hasFlyctl = await this.checkFlyctl();
    if (!hasFlyctl) {
      throw new Error(
        "flyctl is not installed. Install it with: curl -L https://fly.io/install.sh | sh"
      );
    }

    console.log(`[fly] Deploying ${appName} using flyctl...`);

    // Run flyctl deploy
    const output = await this.flyctl(["deploy", "--now"], projectDir);
    console.log(output);

    // Get app info
    const app = await this.getApp(appName);
    const machines = await this.listMachines(appName);

    const regions = [...new Set(machines.map((m) => m.region))];

    return {
      appName,
      appUrl: `https://${appName}.fly.dev`,
      status: app?.status || "deployed",
      machines,
      regions,
    };
  }

  /**
   * Main deploy function
   */
  async deploy(config: X402Config, projectDir: string): Promise<FlyDeployResult> {
    const appName = config.name
      .toLowerCase()
      .replace(/[^a-z0-9-]/g, "-")
      .replace(/-+/g, "-")
      .substring(0, 63);

    console.log(`[fly] Starting deployment for ${appName}...`);

    // 1. Generate fly.toml if it doesn't exist
    const flyTomlPath = path.join(projectDir, "fly.toml");
    if (!(await fs.pathExists(flyTomlPath))) {
      const flyToml = generateFlyToml(config);
      await fs.writeFile(flyTomlPath, flyToml);
      console.log(`[fly] Generated fly.toml`);
    }

    // 2. Create or get app
    let app = await this.getApp(appName);
    if (!app) {
      console.log(`[fly] Creating new app: ${appName}`);
      app = await this.createApp(appName);
    } else {
      console.log(`[fly] Using existing app: ${appName}`);
    }

    // 3. Set secrets
    const secretCommands = generateFlySecrets(config);
    if (secretCommands.length > 0) {
      console.log(`[fly] Setting secrets...`);
      for (const cmd of secretCommands) {
        // Extract key=value from command
        const match = cmd.match(/fly secrets set (\S+)="([^"]+)"/);
        if (match) {
          await this.setSecrets(appName, { [match[1]]: match[2] });
        }
      }
    }

    // 4. Deploy using flyctl
    const result = await this.deployWithFlyctl(appName, projectDir);

    console.log(`[fly] Deployment complete: ${result.appUrl}`);
    console.log(`[fly] Regions: ${result.regions.join(", ")}`);

    return result;
  }

  /**
   * Scale the app to multiple regions
   */
  async scaleToRegions(appName: string, regions: string[], count: number = 1): Promise<void> {
    for (const region of regions) {
      console.log(`[fly] Scaling to ${count} machines in ${region}`);
      await this.flyctl(["scale", "count", String(count), "--region", region, "-a", appName]);
    }
  }

  /**
   * Get app logs
   */
  async getLogs(appName: string, lines: number = 100): Promise<string> {
    return this.flyctl(["logs", "-n", String(lines), "-a", appName]);
  }

  /**
   * Delete an app
   */
  async deleteApp(appName: string): Promise<void> {
    await this.flyctl(["apps", "destroy", appName, "-y"]);
  }

  /**
   * Get app status
   */
  async getStatus(appName: string): Promise<string> {
    return this.flyctl(["status", "-a", appName]);
  }
}

/**
 * Create a Fly.io deployer instance
 */
export function createFlyDeployer(apiToken?: string, organization?: string): FlyDeployer {
  return new FlyDeployer(apiToken, organization);
}
