/**
 * Docker Deployer
 * Build and run Docker containers for x402-wrapped projects
 * Supports local development, registry push, and docker-compose orchestration
 */

import { exec, spawn, ChildProcess } from "child_process";
import { promisify } from "util";
import path from "path";
import fs from "fs-extra";
import { X402Config } from "../types/config.js";
import { generateDockerfile, generateDockerignore } from "../templates/dockerfile.js";
import { generateDockerCompose, generateEnvExample } from "../templates/docker-compose.js";

const execAsync = promisify(exec);

/**
 * Docker image info
 */
export interface DockerImage {
  id: string;
  repository: string;
  tag: string;
  size: string;
  createdAt: string;
}

/**
 * Docker container info
 */
export interface DockerContainer {
  id: string;
  name: string;
  image: string;
  status: string;
  ports: string[];
  createdAt: string;
}

/**
 * Docker deploy options
 */
export interface DockerDeployOptions {
  /** Image name */
  imageName?: string;
  /** Image tag */
  tag?: string;
  /** Push to registry after build */
  push?: boolean;
  /** Registry URL (e.g., ghcr.io, docker.io) */
  registry?: string;
  /** Use docker-compose instead of docker run */
  compose?: boolean;
  /** Include database in compose */
  includeDatabase?: boolean;
  /** Include Redis in compose */
  includeRedis?: boolean;
  /** Include Prometheus metrics */
  includePrometheus?: boolean;
  /** Build arguments */
  buildArgs?: Record<string, string>;
  /** Environment variables */
  env?: Record<string, string>;
  /** Port mapping */
  port?: number;
  /** Detach container */
  detach?: boolean;
  /** Remove container on exit */
  rm?: boolean;
  /** Verbose output */
  verbose?: boolean;
  /** Dry run - don't actually build/run */
  dryRun?: boolean;
}

/**
 * Docker deploy result
 */
export interface DockerDeployResult {
  success: boolean;
  imageId?: string;
  imageName: string;
  containerId?: string;
  containerName?: string;
  ports: string[];
  url: string;
  status: string;
  logs?: string[];
  error?: string;
}

/**
 * Docker health check result
 */
export interface DockerHealthCheck {
  healthy: boolean;
  status: string;
  responseTime?: number;
  checks: {
    docker: boolean;
    image?: boolean;
    container?: boolean;
    network?: boolean;
  };
}

/**
 * Docker Deployer class
 */
export class DockerDeployer {
  private verbose: boolean;

  constructor(options?: { verbose?: boolean }) {
    this.verbose = options?.verbose ?? false;
  }

  /**
   * Log message if verbose mode is enabled
   */
  private log(message: string): void {
    if (this.verbose) {
      console.log(`[docker] ${message}`);
    }
  }

  /**
   * Execute a docker command
   */
  private async docker(args: string[], options?: { cwd?: string }): Promise<string> {
    const command = `docker ${args.join(" ")}`;
    this.log(`Executing: ${command}`);

    try {
      const { stdout, stderr } = await execAsync(command, {
        cwd: options?.cwd,
        maxBuffer: 50 * 1024 * 1024, // 50MB buffer for large outputs
      });

      if (stderr && !stderr.includes("WARNING")) {
        this.log(`stderr: ${stderr}`);
      }

      return stdout.trim();
    } catch (error: any) {
      if (error.stderr) {
        throw new Error(`Docker error: ${error.stderr}`);
      }
      throw error;
    }
  }

  /**
   * Check if Docker is installed and running
   */
  async checkDocker(): Promise<boolean> {
    try {
      await execAsync("docker version");
      await execAsync("docker ps");
      return true;
    } catch {
      return false;
    }
  }

  /**
   * Check if docker-compose is available
   */
  async checkDockerCompose(): Promise<boolean> {
    try {
      // Try docker compose (v2)
      await execAsync("docker compose version");
      return true;
    } catch {
      try {
        // Try docker-compose (v1)
        await execAsync("docker-compose version");
        return true;
      } catch {
        return false;
      }
    }
  }

  /**
   * Get docker compose command (v1 or v2)
   */
  private async getComposeCommand(): Promise<string> {
    try {
      await execAsync("docker compose version");
      return "docker compose";
    } catch {
      return "docker-compose";
    }
  }

  /**
   * Build a Docker image
   */
  async buildImage(
    projectDir: string,
    config: X402Config,
    options: DockerDeployOptions = {}
  ): Promise<DockerImage> {
    const {
      imageName = config.name.toLowerCase().replace(/[^a-z0-9-]/g, "-"),
      tag = "latest",
      registry,
      buildArgs = {},
      dryRun = false,
    } = options;

    // Construct full image name
    const fullImageName = registry
      ? `${registry}/${imageName}:${tag}`
      : `${imageName}:${tag}`;

    this.log(`Building image: ${fullImageName}`);

    // Ensure Dockerfile exists
    const dockerfilePath = path.join(projectDir, "Dockerfile");
    if (!(await fs.pathExists(dockerfilePath))) {
      this.log("Generating Dockerfile...");
      const dockerfile = generateDockerfile(config, config.type || "unknown");
      await fs.writeFile(dockerfilePath, dockerfile);
    }

    // Ensure .dockerignore exists
    const dockerignorePath = path.join(projectDir, ".dockerignore");
    if (!(await fs.pathExists(dockerignorePath))) {
      this.log("Generating .dockerignore...");
      const dockerignore = generateDockerignore();
      await fs.writeFile(dockerignorePath, dockerignore);
    }

    if (dryRun) {
      this.log("Dry run - skipping actual build");
      return {
        id: "dry-run",
        repository: imageName,
        tag,
        size: "0B",
        createdAt: new Date().toISOString(),
      };
    }

    // Build arguments
    const buildArgFlags = Object.entries(buildArgs)
      .map(([key, value]) => `--build-arg ${key}=${value}`)
      .join(" ");

    // Build the image
    const buildOutput = await this.docker(
      [
        "build",
        "-t",
        fullImageName,
        buildArgFlags,
        "--progress=plain",
        ".",
      ].filter(Boolean),
      { cwd: projectDir }
    );

    // Get image details
    const imageInfo = await this.docker([
      "inspect",
      fullImageName,
      "--format",
      '{{.Id}}|{{.Size}}|{{.Created}}',
    ]);

    const [id, size, created] = imageInfo.split("|");

    return {
      id: id.replace("sha256:", "").slice(0, 12),
      repository: imageName,
      tag,
      size: this.formatBytes(parseInt(size)),
      createdAt: created,
    };
  }

  /**
   * Push image to registry
   */
  async pushImage(imageName: string, tag: string = "latest"): Promise<void> {
    const fullName = `${imageName}:${tag}`;
    this.log(`Pushing image: ${fullName}`);
    await this.docker(["push", fullName]);
  }

  /**
   * Run a container
   */
  async runContainer(
    config: X402Config,
    options: DockerDeployOptions = {}
  ): Promise<DockerContainer> {
    const {
      imageName = config.name.toLowerCase().replace(/[^a-z0-9-]/g, "-"),
      tag = "latest",
      registry,
      port = 3000,
      env = {},
      detach = true,
      rm = false,
      dryRun = false,
    } = options;

    const fullImageName = registry
      ? `${registry}/${imageName}:${tag}`
      : `${imageName}:${tag}`;

    const containerName = `${imageName}-${Date.now()}`;

    // Build environment variables
    const envVars: Record<string, string> = {
      NODE_ENV: "production",
      PORT: String(port),
      X402_ENABLED: "true",
      X402_WALLET: config.payment.wallet,
      X402_NETWORK: config.payment.network,
      X402_TOKEN: config.payment.token || "USDC",
      X402_PRICING_MODEL: config.pricing.model,
      X402_DEFAULT_PRICE: config.pricing.default || "$0.001",
      ...env,
    };

    if (config.payment.facilitator) {
      envVars.X402_FACILITATOR_URL = config.payment.facilitator;
    }

    const envFlags = Object.entries(envVars)
      .map(([key, value]) => `-e ${key}="${value}"`)
      .join(" ");

    if (dryRun) {
      this.log("Dry run - skipping container run");
      return {
        id: "dry-run",
        name: containerName,
        image: fullImageName,
        status: "dry-run",
        ports: [`${port}:${port}`],
        createdAt: new Date().toISOString(),
      };
    }

    // Run the container
    const containerId = await this.docker([
      "run",
      detach ? "-d" : "",
      rm ? "--rm" : "",
      "--name",
      containerName,
      "-p",
      `${port}:${port}`,
      envFlags,
      "--health-cmd",
      `wget --no-verbose --tries=1 --spider http://localhost:${port}/health || exit 1`,
      "--health-interval",
      "30s",
      "--health-timeout",
      "5s",
      "--health-retries",
      "3",
      "--health-start-period",
      "10s",
      fullImageName,
    ].filter(Boolean));

    return {
      id: containerId.slice(0, 12),
      name: containerName,
      image: fullImageName,
      status: "running",
      ports: [`${port}:${port}`],
      createdAt: new Date().toISOString(),
    };
  }

  /**
   * Deploy using docker-compose
   */
  async deployCompose(
    projectDir: string,
    config: X402Config,
    options: DockerDeployOptions = {}
  ): Promise<DockerDeployResult> {
    const {
      includeDatabase = false,
      includeRedis = false,
      includePrometheus = false,
      port = 3000,
      dryRun = false,
    } = options;

    this.log("Deploying with docker-compose...");

    // Generate docker-compose.yml if it doesn't exist
    const composePath = path.join(projectDir, "docker-compose.yml");
    if (!(await fs.pathExists(composePath))) {
      this.log("Generating docker-compose.yml...");
      const compose = generateDockerCompose(config);
      await fs.writeFile(composePath, compose);
    }

    // Generate .env.example
    const envExamplePath = path.join(projectDir, ".env.example");
    if (!(await fs.pathExists(envExamplePath))) {
      this.log("Generating .env.example...");
      const envExample = generateEnvExample(config);
      await fs.writeFile(envExamplePath, envExample);
    }

    // Create .env from example if it doesn't exist
    const envPath = path.join(projectDir, ".env");
    if (!(await fs.pathExists(envPath))) {
      await fs.copy(envExamplePath, envPath);
    }

    if (dryRun) {
      this.log("Dry run - skipping compose up");
      return {
        success: true,
        imageName: config.name,
        ports: [`${port}:${port}`],
        url: `http://localhost:${port}`,
        status: "dry-run",
        logs: ["Dry run completed successfully"],
      };
    }

    const composeCmd = await this.getComposeCommand();

    // Build and start services
    await execAsync(`${composeCmd} build`, { cwd: projectDir });
    await execAsync(`${composeCmd} up -d`, { cwd: projectDir });

    // Get container info
    const { stdout: psOutput } = await execAsync(`${composeCmd} ps --format json`, {
      cwd: projectDir,
    });

    let containers: any[] = [];
    try {
      containers = JSON.parse(`[${psOutput.split("\n").filter(Boolean).join(",")}]`);
    } catch {
      // Fallback for older compose versions
      containers = [{ Name: config.name, State: "running" }];
    }

    const appContainer = containers.find(
      (c: any) => c.Name?.includes("app") || c.Service === "app"
    );

    return {
      success: true,
      imageName: config.name,
      containerId: appContainer?.ID?.slice(0, 12),
      containerName: appContainer?.Name,
      ports: [`${port}:${port}`],
      url: `http://localhost:${port}`,
      status: "running",
      logs: [`Started ${containers.length} service(s)`],
    };
  }

  /**
   * Full deployment flow
   */
  async deploy(
    config: X402Config,
    projectDir: string,
    options: DockerDeployOptions = {}
  ): Promise<DockerDeployResult> {
    const {
      compose = false,
      push = false,
      registry,
      port = 3000,
      dryRun = false,
    } = options;

    this.verbose = options.verbose ?? this.verbose;

    try {
      // Check Docker is available
      if (!(await this.checkDocker())) {
        throw new Error(
          "Docker is not installed or not running. Install from: https://www.docker.com/get-started"
        );
      }

      // Use docker-compose if requested
      if (compose) {
        if (!(await this.checkDockerCompose())) {
          throw new Error(
            "docker-compose is not available. Install Docker Desktop or docker-compose."
          );
        }
        return this.deployCompose(projectDir, config, options);
      }

      // Build the image
      const image = await this.buildImage(projectDir, config, options);
      this.log(`Built image: ${image.id} (${image.size})`);

      // Push to registry if requested
      const fullImageName = registry
        ? `${registry}/${image.repository}:${image.tag}`
        : `${image.repository}:${image.tag}`;

      if (push && registry) {
        await this.pushImage(fullImageName);
        this.log(`Pushed to registry: ${registry}`);
      }

      // Run the container
      const container = await this.runContainer(config, {
        ...options,
        imageName: image.repository,
        tag: image.tag,
      });

      this.log(`Container started: ${container.id}`);

      // Wait for health check
      if (!dryRun) {
        await this.waitForHealthy(container.id, port);
      }

      return {
        success: true,
        imageId: image.id,
        imageName: fullImageName,
        containerId: container.id,
        containerName: container.name,
        ports: container.ports,
        url: `http://localhost:${port}`,
        status: "running",
      };
    } catch (error: any) {
      return {
        success: false,
        imageName: options.imageName || config.name,
        ports: [],
        url: "",
        status: "failed",
        error: error.message,
      };
    }
  }

  /**
   * Wait for container to be healthy
   */
  async waitForHealthy(
    containerId: string,
    port: number,
    maxAttempts: number = 30
  ): Promise<boolean> {
    this.log(`Waiting for container ${containerId} to be healthy...`);

    for (let i = 0; i < maxAttempts; i++) {
      try {
        const health = await this.docker([
          "inspect",
          containerId,
          "--format",
          "{{.State.Health.Status}}",
        ]);

        if (health === "healthy") {
          this.log("Container is healthy!");
          return true;
        }

        if (health === "unhealthy") {
          throw new Error("Container health check failed");
        }
      } catch (error: any) {
        // Ignore errors during startup
      }

      await new Promise((resolve) => setTimeout(resolve, 2000));
    }

    throw new Error("Container health check timed out");
  }

  /**
   * Stop a container
   */
  async stopContainer(containerId: string): Promise<void> {
    this.log(`Stopping container: ${containerId}`);
    await this.docker(["stop", containerId]);
  }

  /**
   * Remove a container
   */
  async removeContainer(containerId: string, force: boolean = false): Promise<void> {
    this.log(`Removing container: ${containerId}`);
    await this.docker(["rm", force ? "-f" : "", containerId].filter(Boolean));
  }

  /**
   * Get container logs
   */
  async getLogs(containerId: string, lines: number = 100): Promise<string> {
    return this.docker(["logs", "--tail", String(lines), containerId]);
  }

  /**
   * Stream container logs
   */
  streamLogs(containerId: string): ChildProcess {
    return spawn("docker", ["logs", "-f", containerId], {
      stdio: ["ignore", "pipe", "pipe"],
    });
  }

  /**
   * List running containers
   */
  async listContainers(): Promise<DockerContainer[]> {
    const output = await this.docker([
      "ps",
      "--format",
      '{{.ID}}|{{.Names}}|{{.Image}}|{{.Status}}|{{.Ports}}|{{.CreatedAt}}',
    ]);

    if (!output) return [];

    return output.split("\n").map((line) => {
      const [id, name, image, status, ports, createdAt] = line.split("|");
      return {
        id,
        name,
        image,
        status,
        ports: ports ? ports.split(",").map((p) => p.trim()) : [],
        createdAt,
      };
    });
  }

  /**
   * Clean up unused Docker resources
   */
  async cleanup(): Promise<{ removed: string[] }> {
    const removed: string[] = [];

    // Remove stopped containers
    try {
      const output = await this.docker(["container", "prune", "-f"]);
      if (output.includes("Deleted")) {
        removed.push("Stopped containers");
      }
    } catch {
      // Ignore errors
    }

    // Remove dangling images
    try {
      const output = await this.docker(["image", "prune", "-f"]);
      if (output.includes("Deleted")) {
        removed.push("Dangling images");
      }
    } catch {
      // Ignore errors
    }

    return { removed };
  }

  /**
   * Format bytes to human readable
   */
  private formatBytes(bytes: number): string {
    const sizes = ["B", "KB", "MB", "GB", "TB"];
    if (bytes === 0) return "0 B";
    const i = Math.floor(Math.log(bytes) / Math.log(1024));
    return `${(bytes / Math.pow(1024, i)).toFixed(1)} ${sizes[i]}`;
  }
}

/**
 * Create a Docker deployer instance
 */
export function createDockerDeployer(options?: { verbose?: boolean }): DockerDeployer {
  return new DockerDeployer(options);
}

/**
 * Quick deploy function
 */
export async function deployWithDocker(
  config: X402Config,
  projectDir: string,
  options: DockerDeployOptions = {}
): Promise<DockerDeployResult> {
  const deployer = new DockerDeployer({ verbose: options.verbose });
  return deployer.deploy(config, projectDir, options);
}
