/**
 * Vercel Deployer
 * Deploy x402-wrapped Next.js projects to Vercel using their API
 */

import fs from "fs-extra";
import path from "path";
import { X402Config } from "../types/config.js";
import { generateVercelJson, generateVercelEnvs } from "../templates/vercel.js";

/**
 * Vercel project interface
 */
export interface VercelProject {
  id: string;
  name: string;
  accountId: string;
  framework: string | null;
  createdAt: number;
  updatedAt: number;
}

/**
 * Vercel deployment interface
 */
export interface VercelDeployment {
  id: string;
  uid: string;
  name: string;
  url: string;
  state: "READY" | "ERROR" | "BUILDING" | "QUEUED" | "INITIALIZING" | "CANCELED";
  readyState: string;
  createdAt: number;
  buildingAt?: number;
  ready?: number;
  alias?: string[];
}

/**
 * Vercel deploy result
 */
export interface VercelDeployResult {
  projectId: string;
  projectName: string;
  deploymentId: string;
  url: string;
  productionUrl: string;
  status: string;
  aliases: string[];
}

/**
 * Vercel deployer options
 */
export interface VercelDeployerOptions {
  teamId?: string;
  scope?: string;
}

/**
 * Vercel deployer class
 */
export class VercelDeployer {
  private apiToken: string;
  private baseUrl = "https://api.vercel.com";
  private teamId?: string;

  constructor(apiToken?: string, options?: VercelDeployerOptions) {
    this.apiToken = apiToken || process.env.VERCEL_TOKEN || "";
    this.teamId = options?.teamId || process.env.VERCEL_TEAM_ID;

    if (!this.apiToken) {
      throw new Error(
        "Vercel API token required. Set VERCEL_TOKEN environment variable or pass token to constructor."
      );
    }
  }

  /**
   * Execute an API request against Vercel API
   */
  private async api<T>(
    method: string,
    endpoint: string,
    body?: unknown,
    isUpload: boolean = false
  ): Promise<T> {
    const url = new URL(`${this.baseUrl}${endpoint}`);

    // Add team ID if present
    if (this.teamId) {
      url.searchParams.set("teamId", this.teamId);
    }

    const headers: Record<string, string> = {
      Authorization: `Bearer ${this.apiToken}`,
    };

    if (!isUpload) {
      headers["Content-Type"] = "application/json";
    }

    const response = await fetch(url.toString(), {
      method,
      headers,
      body: body ? (isUpload ? (body as BodyInit) : JSON.stringify(body)) : undefined,
    });

    if (!response.ok) {
      const error = await response.text();
      throw new Error(`Vercel API error: ${response.status} - ${error}`);
    }

    return response.json();
  }

  /**
   * Create a new Vercel project
   */
  async createProject(
    name: string,
    options?: {
      framework?: string;
      buildCommand?: string;
      outputDirectory?: string;
      installCommand?: string;
      rootDirectory?: string;
    }
  ): Promise<VercelProject> {
    return this.api<VercelProject>("POST", "/v9/projects", {
      name,
      framework: options?.framework || "nextjs",
      buildCommand: options?.buildCommand,
      outputDirectory: options?.outputDirectory,
      installCommand: options?.installCommand,
      rootDirectory: options?.rootDirectory,
    });
  }

  /**
   * Get an existing project
   */
  async getProject(nameOrId: string): Promise<VercelProject | null> {
    try {
      return await this.api<VercelProject>("GET", `/v9/projects/${nameOrId}`);
    } catch {
      return null;
    }
  }

  /**
   * List all projects
   */
  async listProjects(): Promise<VercelProject[]> {
    const data = await this.api<{ projects: VercelProject[] }>("GET", "/v9/projects");
    return data.projects || [];
  }

  /**
   * Set environment variables for a project
   */
  async setEnvVars(
    projectId: string,
    envVars: Array<{
      key: string;
      value: string;
      target: ("production" | "preview" | "development")[];
    }>
  ): Promise<void> {
    for (const envVar of envVars) {
      await this.api("POST", `/v10/projects/${projectId}/env`, {
        key: envVar.key,
        value: envVar.value,
        target: envVar.target,
        type: "plain",
      });
    }
  }

  /**
   * Create a deployment
   */
  async createDeployment(
    projectId: string,
    files: Array<{ file: string; data: string }>,
    options?: {
      name?: string;
      target?: "production" | "preview";
      gitSource?: {
        type: "github" | "gitlab" | "bitbucket";
        repoId: string | number;
        ref: string;
      };
    }
  ): Promise<VercelDeployment> {
    // Convert files to Vercel format
    const vercelFiles = files.map((f) => ({
      file: f.file,
      data: Buffer.from(f.data).toString("base64"),
      encoding: "base64" as const,
    }));

    return this.api<VercelDeployment>("POST", "/v13/deployments", {
      name: options?.name || projectId,
      project: projectId,
      target: options?.target || "production",
      files: vercelFiles,
      projectSettings: {
        framework: "nextjs",
      },
      gitSource: options?.gitSource,
    });
  }

  /**
   * Get deployment status
   */
  async getDeployment(deploymentId: string): Promise<VercelDeployment> {
    return this.api<VercelDeployment>("GET", `/v13/deployments/${deploymentId}`);
  }

  /**
   * Wait for deployment to complete
   */
  async waitForDeployment(
    deploymentId: string,
    timeoutMs: number = 600000
  ): Promise<VercelDeployment> {
    const startTime = Date.now();
    const pollInterval = 5000;

    while (Date.now() - startTime < timeoutMs) {
      const deployment = await this.getDeployment(deploymentId);

      if (deployment.state === "READY") {
        return deployment;
      }

      if (deployment.state === "ERROR" || deployment.state === "CANCELED") {
        throw new Error(`Deployment failed with state: ${deployment.state}`);
      }

      await new Promise((resolve) => setTimeout(resolve, pollInterval));
    }

    throw new Error("Deployment timed out");
  }

  /**
   * Add a custom domain
   */
  async addDomain(projectId: string, domain: string): Promise<void> {
    await this.api("POST", `/v9/projects/${projectId}/domains`, {
      name: domain,
    });
  }

  /**
   * List deployments for a project
   */
  async listDeployments(projectId: string, limit: number = 10): Promise<VercelDeployment[]> {
    const data = await this.api<{ deployments: VercelDeployment[] }>(
      "GET",
      `/v6/deployments?projectId=${projectId}&limit=${limit}`
    );
    return data.deployments || [];
  }

  /**
   * Main deploy function
   */
  async deploy(config: X402Config, projectDir: string): Promise<VercelDeployResult> {
    const projectName = config.name
      .toLowerCase()
      .replace(/[^a-z0-9-]/g, "-")
      .replace(/-+/g, "-");

    console.log(`[vercel] Starting deployment for ${projectName}...`);

    // 1. Generate vercel.json if it doesn't exist
    const vercelJsonPath = path.join(projectDir, "vercel.json");
    if (!(await fs.pathExists(vercelJsonPath))) {
      const vercelJson = generateVercelJson(config);
      await fs.writeFile(vercelJsonPath, vercelJson);
      console.log(`[vercel] Generated vercel.json`);
    }

    // 2. Create or get project
    let project = await this.getProject(projectName);
    if (!project) {
      console.log(`[vercel] Creating new project: ${projectName}`);
      project = await this.createProject(projectName, {
        framework: "nextjs",
      });
    } else {
      console.log(`[vercel] Using existing project: ${project.id}`);
    }

    // 3. Set environment variables
    const envVars = generateVercelEnvs(config);
    console.log(`[vercel] Setting ${envVars.length} environment variables`);
    await this.setEnvVars(project.id, envVars);

    // 4. Collect files for deployment
    console.log(`[vercel] Collecting files for deployment...`);
    const files = await this.collectFiles(projectDir);

    // 5. Create deployment
    console.log(`[vercel] Creating deployment...`);
    const deployment = await this.createDeployment(project.id, files, {
      name: projectName,
      target: "production",
    });

    // 6. Wait for deployment to complete
    console.log(`[vercel] Waiting for deployment to complete...`);
    const finalDeployment = await this.waitForDeployment(deployment.id);

    const productionUrl = `https://${projectName}.vercel.app`;
    console.log(`[vercel] Deployment complete: ${productionUrl}`);

    return {
      projectId: project.id,
      projectName: project.name,
      deploymentId: finalDeployment.id,
      url: `https://${finalDeployment.url}`,
      productionUrl,
      status: finalDeployment.state,
      aliases: finalDeployment.alias || [],
    };
  }

  /**
   * Collect files from project directory for deployment
   */
  private async collectFiles(
    projectDir: string,
    baseDir: string = ""
  ): Promise<Array<{ file: string; data: string }>> {
    const files: Array<{ file: string; data: string }> = [];
    const currentDir = path.join(projectDir, baseDir);

    // Directories to skip
    const skipDirs = ["node_modules", ".git", ".next", "dist", ".x402"];

    const entries = await fs.readdir(currentDir, { withFileTypes: true });

    for (const entry of entries) {
      const relativePath = baseDir ? `${baseDir}/${entry.name}` : entry.name;

      if (entry.isDirectory()) {
        if (!skipDirs.includes(entry.name)) {
          const subFiles = await this.collectFiles(projectDir, relativePath);
          files.push(...subFiles);
        }
      } else {
        // Skip large files and binaries
        const stats = await fs.stat(path.join(currentDir, entry.name));
        if (stats.size < 1024 * 1024) {
          // < 1MB
          const content = await fs.readFile(path.join(currentDir, entry.name), "utf-8");
          files.push({
            file: relativePath,
            data: content,
          });
        }
      }
    }

    return files;
  }

  /**
   * Deploy from GitHub
   */
  async deployFromGitHub(
    config: X402Config,
    repo: string,
    branch: string = "main"
  ): Promise<VercelDeployResult> {
    const projectName = config.name
      .toLowerCase()
      .replace(/[^a-z0-9-]/g, "-")
      .replace(/-+/g, "-");

    console.log(`[vercel] Deploying from GitHub: ${repo}@${branch}`);

    // 1. Create or get project
    let project = await this.getProject(projectName);
    if (!project) {
      project = await this.createProject(projectName);
    }

    // 2. Set environment variables
    const envVars = generateVercelEnvs(config);
    await this.setEnvVars(project.id, envVars);

    // 3. Link to GitHub repository
    try {
      // Parse repo format: owner/repo
      const [owner, repoName] = repo.split("/");
      if (!owner || !repoName) {
        throw new Error("Invalid repo format. Expected 'owner/repo'");
      }

      // Connect Git repository to Vercel project
      const gitResponse = await this.api<{ id: string }>(
        "POST",
        `/v9/projects/${project.id}/link`,
        {
          type: "github",
          repo: repoName,
          org: owner,
          gitCredentialId: "", // Uses default credential
          productionBranch: branch,
        }
      );
      
      console.log(`[vercel] Connected to GitHub: ${repo}`);

      // Trigger a deployment from the branch
      const deployResponse = await this.api<{
        id: string;
        url: string;
        readyState: string;
      }>(
        "POST",
        `/v13/deployments`,
        {
          name: projectName,
          project: project.id,
          target: "production",
          gitSource: {
            type: "github",
            org: owner,
            repo: repoName,
            ref: branch,
          },
        }
      );

      return {
        projectId: project.id,
        projectName: project.name,
        deploymentId: deployResponse.id,
        url: `https://${deployResponse.url}`,
        productionUrl: `https://${projectName}.vercel.app`,
        status: deployResponse.readyState as any,
        aliases: [],
      };
    } catch (error: any) {
      console.log(`[vercel] GitHub integration via API failed: ${error.message}`);
      console.log(`[vercel] Please connect GitHub manually in the Vercel dashboard:`);
      console.log(`[vercel]   https://vercel.com/${projectName}/settings/git`);

      return {
        projectId: project.id,
        projectName: project.name,
        deploymentId: "",
        url: "",
        productionUrl: `https://${projectName}.vercel.app`,
        status: "pending",
        aliases: [],
      };
    }
  }

  /**
   * Get deployment logs
   */
  async getLogs(deploymentId: string): Promise<string[]> {
    const data = await this.api<{ logs: { id: string; text: string }[] }>(
      "GET",
      `/v2/deployments/${deploymentId}/events`
    );
    return data.logs?.map((log) => log.text) || [];
  }

  /**
   * Delete a project
   */
  async deleteProject(projectId: string): Promise<void> {
    await this.api("DELETE", `/v9/projects/${projectId}`);
  }

  /**
   * Rollback to a previous deployment
   */
  async rollback(projectId: string, deploymentId: string): Promise<VercelDeployment> {
    return this.api<VercelDeployment>("POST", `/v9/projects/${projectId}/rollback`, {
      deploymentId,
    });
  }
}

/**
 * Create a Vercel deployer instance
 */
export function createVercelDeployer(
  apiToken?: string,
  options?: VercelDeployerOptions
): VercelDeployer {
  return new VercelDeployer(apiToken, options);
}
