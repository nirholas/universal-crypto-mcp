/**
 * Node.js project builder
 * Generates x402 wrapper, Dockerfile, and deployment configs for Node.js projects
 */

import fs from "fs-extra";
import path from "path";
import { X402Config, ProjectType } from "../types/config.js";
import {
  generateDockerfile,
  generateDockerignore,
} from "../templates/dockerfile.js";
import {
  generateNodeWrapper,
  generateMcpWrapper,
  generateWrapperPackageAdditions,
} from "../templates/wrapper-code.js";
import {
  generateRailwayJson,
  generateProcfile,
} from "../templates/railway.js";
import { generateFlyToml } from "../templates/fly.js";
import { generateVercelJson, generateNextMiddleware } from "../templates/vercel.js";
import { generateDockerCompose, generateEnvExample } from "../templates/docker-compose.js";

/**
 * Node.js build result
 */
export interface NodeBuildResult {
  outputDir: string;
  files: string[];
  warnings?: string[];
}

/**
 * Node.js build options
 */
export interface NodeBuildOptions {
  skipInstall?: boolean;
  skipBuild?: boolean;
  verbose?: boolean;
  projectType?: ProjectType;
  generateDeployConfigs?: boolean;
}

/**
 * Build a Node.js project with x402 wrapper
 */
export async function buildNodeProject(
  config: X402Config,
  projectDir: string,
  options: NodeBuildOptions = {}
): Promise<NodeBuildResult> {
  const warnings: string[] = [];
  const generatedFiles: string[] = [];

  const x402Dir = path.join(projectDir, ".x402");
  await fs.ensureDir(x402Dir);

  const projectType = options.projectType || config.type || "unknown";
  const deployProvider = config.deploy?.provider || "railway";

  if (options.verbose) {
    console.log(`[node-builder] Building ${projectType} project...`);
  }

  // 1. Generate wrapper code
  const wrapperCode = projectType === "mcp-server"
    ? generateMcpWrapper(config)
    : generateNodeWrapper(config);

  await fs.writeFile(path.join(x402Dir, "wrapper.js"), wrapperCode);
  generatedFiles.push("wrapper.js");

  if (options.verbose) {
    console.log(`[node-builder] Generated wrapper.js`);
  }

  // 2. Generate Dockerfile
  const dockerfile = generateDockerfile(config, projectType);
  await fs.writeFile(path.join(projectDir, "Dockerfile"), dockerfile);
  generatedFiles.push("../Dockerfile");

  // 3. Generate .dockerignore
  const dockerignore = generateDockerignore();
  const dockerignorePath = path.join(projectDir, ".dockerignore");
  if (!(await fs.pathExists(dockerignorePath))) {
    await fs.writeFile(dockerignorePath, dockerignore);
    generatedFiles.push("../.dockerignore");
  }

  // 4. Generate deployment-specific configs
  if (options.generateDeployConfigs !== false) {
    await generateDeploymentConfigs(
      config,
      projectDir,
      x402Dir,
      projectType,
      deployProvider,
      generatedFiles,
      options.verbose
    );
  }

  // 5. Generate discovery document
  const discoveryDoc = generateDiscoveryDocument(config, projectType);
  await fs.writeJSON(path.join(x402Dir, "discovery.json"), discoveryDoc, { spaces: 2 });
  generatedFiles.push("discovery.json");

  // 6. Save config for reference
  await fs.writeJSON(path.join(x402Dir, "config.json"), config, { spaces: 2 });
  generatedFiles.push("config.json");

  // 7. Save build info
  const buildInfo = {
    timestamp: new Date().toISOString(),
    projectType,
    deployProvider,
    version: config.version,
  };
  await fs.writeJSON(path.join(x402Dir, "build-info.json"), buildInfo, { spaces: 2 });
  generatedFiles.push("build-info.json");

  // 8. Check for potential issues
  await checkProjectHealth(projectDir, config, warnings);

  return {
    outputDir: x402Dir,
    files: generatedFiles,
    warnings: warnings.length > 0 ? warnings : undefined,
  };
}

/**
 * Generate deployment-specific configuration files
 */
async function generateDeploymentConfigs(
  config: X402Config,
  projectDir: string,
  x402Dir: string,
  projectType: ProjectType,
  deployProvider: string,
  generatedFiles: string[],
  verbose?: boolean
): Promise<void> {
  // Railway config
  if (deployProvider === "railway" || deployProvider === "docker") {
    const railwayJson = generateRailwayJson(config);
    await fs.writeFile(path.join(projectDir, "railway.json"), railwayJson);
    generatedFiles.push("../railway.json");

    const procfile = generateProcfile(config);
    await fs.writeFile(path.join(projectDir, "Procfile"), procfile);
    generatedFiles.push("../Procfile");

    if (verbose) {
      console.log(`[node-builder] Generated Railway config`);
    }
  }

  // Fly.io config
  if (deployProvider === "fly" || deployProvider === "docker") {
    const flyToml = generateFlyToml(config);
    await fs.writeFile(path.join(projectDir, "fly.toml"), flyToml);
    generatedFiles.push("../fly.toml");

    if (verbose) {
      console.log(`[node-builder] Generated Fly.io config`);
    }
  }

  // Vercel config (for Next.js)
  if (deployProvider === "vercel" || projectType === "nextjs") {
    const vercelJson = generateVercelJson(config);
    await fs.writeFile(path.join(projectDir, "vercel.json"), vercelJson);
    generatedFiles.push("../vercel.json");

    // Generate Next.js middleware
    if (projectType === "nextjs") {
      const middleware = generateNextMiddleware(config);
      await fs.writeFile(path.join(x402Dir, "middleware.ts"), middleware);
      generatedFiles.push("middleware.ts");
    }

    if (verbose) {
      console.log(`[node-builder] Generated Vercel config`);
    }
  }

  // Docker Compose for self-hosted
  if (deployProvider === "self-hosted" || deployProvider === "docker") {
    const dockerCompose = generateDockerCompose(config);
    await fs.writeFile(path.join(projectDir, "docker-compose.yml"), dockerCompose);
    generatedFiles.push("../docker-compose.yml");

    const envExample = generateEnvExample(config);
    await fs.writeFile(path.join(projectDir, ".env.example"), envExample);
    generatedFiles.push("../.env.example");

    if (verbose) {
      console.log(`[node-builder] Generated Docker Compose config`);
    }
  }
}

/**
 * Generate x402 discovery document
 */
function generateDiscoveryDocument(
  config: X402Config,
  projectType: ProjectType
): Record<string, unknown> {
  return {
    $schema: "https://x402.org/schemas/discovery-1.0.json",
    version: "1.0",
    service: {
      name: config.name,
      description: config.description,
      version: config.version,
      type: projectType,
    },
    payment: {
      wallet: config.payment.wallet,
      network: config.payment.network,
      token: config.payment.token || "USDC",
      facilitator: config.payment.facilitator,
    },
    pricing: {
      model: config.pricing.model,
      default: config.pricing.default,
      routes: config.pricing.routes,
    },
    discovery: {
      enabled: config.discovery?.enabled !== false,
      autoRegister: config.discovery?.autoRegister !== false,
      instructions: config.discovery?.instructions,
    },
    endpoints: {
      health: "/health",
      config: "/.well-known/x402/config",
      metrics: "/.well-known/x402/metrics",
    },
    metadata: {
      generatedAt: new Date().toISOString(),
      generator: "@nirholas/x402-deploy",
    },
  };
}

/**
 * Check project health and collect warnings
 */
async function checkProjectHealth(
  projectDir: string,
  config: X402Config,
  warnings: string[]
): Promise<void> {
  const packageJsonPath = path.join(projectDir, "package.json");

  // Check package.json exists
  if (!(await fs.pathExists(packageJsonPath))) {
    warnings.push("No package.json found. Build may fail.");
    return;
  }

  const packageJson = await fs.readJSON(packageJsonPath);

  // Check for build script
  if (!packageJson.scripts?.build) {
    warnings.push("No 'build' script in package.json. TypeScript compilation may be skipped.");
  }

  // Check for start script
  if (!packageJson.scripts?.start) {
    warnings.push("No 'start' script in package.json. Using x402 wrapper as entrypoint.");
  }

  // Check for main/module entry
  if (!packageJson.main && !packageJson.module) {
    warnings.push("No 'main' or 'module' field in package.json. Wrapper may not find app entry.");
  }

  // Check node version
  if (packageJson.engines?.node) {
    const requiredNode = packageJson.engines.node;
    if (!requiredNode.includes("18") && !requiredNode.includes("20")) {
      warnings.push(`Project requires Node ${requiredNode}. Docker image uses Node 20.`);
    }
  }

  // Check for TypeScript
  const tsconfigPath = path.join(projectDir, "tsconfig.json");
  if (await fs.pathExists(tsconfigPath)) {
    const distPath = path.join(projectDir, "dist");
    if (!(await fs.pathExists(distPath))) {
      warnings.push("TypeScript project without dist folder. Run 'npm run build' first.");
    }
  }

  // Check wallet address
  if (!config.payment.wallet.match(/^0x[a-fA-F0-9]{40}$/)) {
    warnings.push("Invalid wallet address format.");
  }
}

/**
 * Generate tsconfig for x402 wrapper (if needed)
 */
export function generateWrapperTsconfig(): string {
  return JSON.stringify(
    {
      compilerOptions: {
        target: "ES2022",
        module: "ESNext",
        moduleResolution: "bundler",
        esModuleInterop: true,
        strict: true,
        skipLibCheck: true,
        outDir: "./dist",
        declaration: true,
      },
      include: ["wrapper.ts"],
    },
    null,
    2
  );
}

/**
 * Update package.json with x402 scripts
 */
export async function updatePackageJson(
  projectDir: string,
  config: X402Config
): Promise<void> {
  const packageJsonPath = path.join(projectDir, "package.json");

  if (!(await fs.pathExists(packageJsonPath))) {
    return;
  }

  const packageJson = await fs.readJSON(packageJsonPath);
  const additions = generateWrapperPackageAdditions(config);

  // Merge scripts
  packageJson.scripts = {
    ...packageJson.scripts,
    ...(additions.scripts as Record<string, string>),
  };

  await fs.writeJSON(packageJsonPath, packageJson, { spaces: 2 });
}
