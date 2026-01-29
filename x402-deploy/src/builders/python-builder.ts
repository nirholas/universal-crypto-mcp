/**
 * Python project builder
 * Generates x402 wrapper, Dockerfile, and deployment configs for Python/FastAPI projects
 */

import fs from "fs-extra";
import path from "path";
import { X402Config, ProjectType } from "../types/config.js";
import { generateDockerfile, generateDockerignore } from "../templates/dockerfile.js";
import { generatePythonWrapper } from "../templates/wrapper-code.js";
import { generateRailwayJson, generateProcfile } from "../templates/railway.js";
import { generateFlyToml } from "../templates/fly.js";
import { generateDockerCompose, generateEnvExample } from "../templates/docker-compose.js";

/**
 * Python build result
 */
export interface PythonBuildResult {
  outputDir: string;
  files: string[];
  warnings?: string[];
}

/**
 * Python build options
 */
export interface PythonBuildOptions {
  skipInstall?: boolean;
  skipBuild?: boolean;
  verbose?: boolean;
  projectType?: ProjectType;
  generateDeployConfigs?: boolean;
}

/**
 * Build a Python project with x402 wrapper
 */
export async function buildPythonProject(
  config: X402Config,
  projectDir: string,
  options: PythonBuildOptions = {}
): Promise<PythonBuildResult> {
  const warnings: string[] = [];
  const generatedFiles: string[] = [];

  const x402Dir = path.join(projectDir, ".x402");
  await fs.ensureDir(x402Dir);

  const projectType = options.projectType || config.type || "fastapi";
  const deployProvider = config.deploy?.provider || "railway";

  if (options.verbose) {
    console.log(`[python-builder] Building ${projectType} project...`);
  }

  // 1. Generate Python wrapper
  const wrapperCode = generatePythonWrapper(config);
  await fs.writeFile(path.join(x402Dir, "wrapper.py"), wrapperCode);
  generatedFiles.push("wrapper.py");

  if (options.verbose) {
    console.log(`[python-builder] Generated wrapper.py`);
  }

  // 2. Generate x402 requirements
  const x402Requirements = generateX402Requirements();
  await fs.writeFile(path.join(x402Dir, "requirements.txt"), x402Requirements);
  generatedFiles.push("requirements.txt");

  // 3. Generate Dockerfile
  const dockerfile = generateDockerfile(config, projectType);
  await fs.writeFile(path.join(projectDir, "Dockerfile"), dockerfile);
  generatedFiles.push("../Dockerfile");

  // 4. Generate .dockerignore
  const dockerignore = generateDockerignore();
  const dockerignorePath = path.join(projectDir, ".dockerignore");
  if (!(await fs.pathExists(dockerignorePath))) {
    await fs.writeFile(dockerignorePath, dockerignore);
    generatedFiles.push("../.dockerignore");
  }

  // 5. Generate deployment-specific configs
  if (options.generateDeployConfigs !== false) {
    await generatePythonDeploymentConfigs(
      config,
      projectDir,
      x402Dir,
      deployProvider,
      generatedFiles,
      options.verbose
    );
  }

  // 6. Generate discovery document
  const discoveryDoc = generatePythonDiscoveryDocument(config, projectType);
  await fs.writeJSON(path.join(x402Dir, "discovery.json"), discoveryDoc, { spaces: 2 });
  generatedFiles.push("discovery.json");

  // 7. Save config for reference
  await fs.writeJSON(path.join(x402Dir, "config.json"), config, { spaces: 2 });
  generatedFiles.push("config.json");

  // 8. Save build info
  const buildInfo = {
    timestamp: new Date().toISOString(),
    projectType,
    deployProvider,
    version: config.version,
    runtime: "python",
  };
  await fs.writeJSON(path.join(x402Dir, "build-info.json"), buildInfo, { spaces: 2 });
  generatedFiles.push("build-info.json");

  // 9. Generate __init__.py for proper imports
  await fs.writeFile(path.join(x402Dir, "__init__.py"), "# x402-deploy generated\n");
  generatedFiles.push("__init__.py");

  // 10. Check for potential issues
  await checkPythonProjectHealth(projectDir, config, warnings);

  return {
    outputDir: x402Dir,
    files: generatedFiles,
    warnings: warnings.length > 0 ? warnings : undefined,
  };
}

/**
 * Generate x402-specific Python requirements
 */
function generateX402Requirements(): string {
  return `# x402-deploy requirements
# Add these to your main requirements.txt or install separately

fastapi>=0.104.0
uvicorn>=0.24.0
httpx>=0.25.0
pydantic>=2.5.0
`;
}

/**
 * Generate deployment-specific configuration files for Python
 */
async function generatePythonDeploymentConfigs(
  config: X402Config,
  projectDir: string,
  x402Dir: string,
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
      console.log(`[python-builder] Generated Railway config`);
    }
  }

  // Fly.io config
  if (deployProvider === "fly" || deployProvider === "docker") {
    const flyToml = generateFlyToml(config);
    await fs.writeFile(path.join(projectDir, "fly.toml"), flyToml);
    generatedFiles.push("../fly.toml");

    if (verbose) {
      console.log(`[python-builder] Generated Fly.io config`);
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
      console.log(`[python-builder] Generated Docker Compose config`);
    }
  }

  // Generate runtime.txt for some platforms
  await fs.writeFile(path.join(projectDir, "runtime.txt"), "python-3.11.0\n");
  generatedFiles.push("../runtime.txt");
}

/**
 * Generate x402 discovery document for Python projects
 */
function generatePythonDiscoveryDocument(
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
      runtime: "python",
      framework: "fastapi",
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
      docs: "/docs", // FastAPI auto-docs
      openapi: "/openapi.json",
    },
    metadata: {
      generatedAt: new Date().toISOString(),
      generator: "@nirholas/x402-deploy",
    },
  };
}

/**
 * Check Python project health and collect warnings
 */
async function checkPythonProjectHealth(
  projectDir: string,
  config: X402Config,
  warnings: string[]
): Promise<void> {
  // Check for requirements.txt
  const requirementsPath = path.join(projectDir, "requirements.txt");
  if (!(await fs.pathExists(requirementsPath))) {
    // Check for pyproject.toml
    const pyprojectPath = path.join(projectDir, "pyproject.toml");
    if (!(await fs.pathExists(pyprojectPath))) {
      warnings.push("No requirements.txt or pyproject.toml found. Dependencies may be missing.");
    }
  } else {
    // Check if FastAPI is in requirements
    const requirements = await fs.readFile(requirementsPath, "utf-8");
    if (!requirements.toLowerCase().includes("fastapi")) {
      warnings.push("FastAPI not found in requirements.txt. x402 wrapper requires FastAPI.");
    }
    if (!requirements.toLowerCase().includes("uvicorn")) {
      warnings.push("Uvicorn not found in requirements.txt. Adding to x402 requirements.");
    }
  }

  // Check for main.py or app.py
  const mainPath = path.join(projectDir, "main.py");
  const appPath = path.join(projectDir, "app.py");
  if (!(await fs.pathExists(mainPath)) && !(await fs.pathExists(appPath))) {
    warnings.push("No main.py or app.py found. Wrapper may not find app entry.");
  }

  // Check wallet address
  if (!config.payment.wallet.match(/^0x[a-fA-F0-9]{40}$/)) {
    warnings.push("Invalid wallet address format.");
  }

  // Check for .python-version
  const pythonVersionPath = path.join(projectDir, ".python-version");
  if (await fs.pathExists(pythonVersionPath)) {
    const version = await fs.readFile(pythonVersionPath, "utf-8");
    if (!version.trim().startsWith("3.11")) {
      warnings.push(`Project uses Python ${version.trim()}. Docker image uses Python 3.11.`);
    }
  }
}

/**
 * Generate pyproject.toml additions for x402
 */
export function generatePyprojectAdditions(config: X402Config): string {
  return `
# x402-deploy additions
[tool.x402]
enabled = true
wallet = "${config.payment.wallet}"
network = "${config.payment.network}"

[project.scripts]
x402-start = "python .x402/wrapper.py"
`;
}

/**
 * Generate setup.cfg for older Python projects
 */
export function generateSetupCfg(config: X402Config): string {
  return `# x402-deploy generated
[metadata]
name = ${config.name}
version = ${config.version}

[options]
python_requires = >=3.11
install_requires =
    fastapi>=0.104.0
    uvicorn>=0.24.0
    httpx>=0.25.0

[options.entry_points]
console_scripts =
    x402-start = .x402.wrapper:main
`;
}

/**
 * Update requirements.txt with x402 dependencies
 */
export async function updateRequirements(projectDir: string): Promise<void> {
  const requirementsPath = path.join(projectDir, "requirements.txt");
  const x402RequirementsPath = path.join(projectDir, ".x402", "requirements.txt");

  if (!(await fs.pathExists(requirementsPath))) {
    // Create requirements.txt from x402 requirements
    if (await fs.pathExists(x402RequirementsPath)) {
      await fs.copy(x402RequirementsPath, requirementsPath);
    }
    return;
  }

  // Read existing requirements
  const requirements = await fs.readFile(requirementsPath, "utf-8");
  const lines: string[] = requirements.split("\n").map((l: string) => l.trim().toLowerCase());

  const additions: string[] = [];

  // Check for required packages
  const required = ["fastapi", "uvicorn", "httpx"];
  for (const pkg of required) {
    if (!lines.some((l: string) => l.startsWith(pkg))) {
      additions.push(pkg);
    }
  }

  if (additions.length > 0) {
    const updatedRequirements = requirements.trim() + "\n\n# x402-deploy requirements\n" + additions.map((p) => `${p}>=0.0.0`).join("\n") + "\n";
    await fs.writeFile(requirementsPath, updatedRequirements);
  }
}
