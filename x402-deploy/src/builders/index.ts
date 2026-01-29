/**
 * Main builder module - Orchestrates the build process
 * Coordinates Node.js and Python builders to generate x402-wrapped projects
 */

import fs from "fs-extra";
import path from "path";
import { X402Config, ProjectType } from "../types/config.js";
import { buildNodeProject, NodeBuildResult } from "./node-builder.js";
import { buildPythonProject, PythonBuildResult } from "./python-builder.js";

/**
 * Build result interface
 */
export interface BuildResult {
  success: boolean;
  outputDir: string;
  files: string[];
  projectType: ProjectType;
  errors?: string[];
  warnings?: string[];
  duration?: number;
}

/**
 * Build options
 */
export interface BuildOptions {
  /** Skip npm/pip install */
  skipInstall?: boolean;
  /** Skip TypeScript/Python compilation */
  skipBuild?: boolean;
  /** Output verbose logs */
  verbose?: boolean;
  /** Clean output directory before build */
  clean?: boolean;
  /** Force rebuild even if up to date */
  force?: boolean;
}

/**
 * Detect project type from project directory
 */
export async function detectProjectType(projectDir: string): Promise<ProjectType> {
  // Check for package.json
  const packageJsonPath = path.join(projectDir, "package.json");
  if (await fs.pathExists(packageJsonPath)) {
    const packageJson = await fs.readJSON(packageJsonPath);

    // Check for Next.js
    if (packageJson.dependencies?.next || packageJson.devDependencies?.next) {
      return "nextjs";
    }

    // Check for MCP server
    if (
      packageJson.dependencies?.["@modelcontextprotocol/sdk"] ||
      packageJson.devDependencies?.["@modelcontextprotocol/sdk"]
    ) {
      return "mcp-server";
    }

    // Check for Hono
    if (packageJson.dependencies?.hono || packageJson.devDependencies?.hono) {
      return "hono-api";
    }

    // Check for Express
    if (packageJson.dependencies?.express || packageJson.devDependencies?.express) {
      return "express-api";
    }

    // Default to Node.js unknown
    return "unknown";
  }

  // Check for Python projects
  const requirementsPath = path.join(projectDir, "requirements.txt");
  const pyprojectPath = path.join(projectDir, "pyproject.toml");

  if ((await fs.pathExists(requirementsPath)) || (await fs.pathExists(pyprojectPath))) {
    // Check for FastAPI
    if (await fs.pathExists(requirementsPath)) {
      const requirements = await fs.readFile(requirementsPath, "utf-8");
      if (requirements.includes("fastapi")) {
        return "fastapi";
      }
    }

    if (await fs.pathExists(pyprojectPath)) {
      const pyproject = await fs.readFile(pyprojectPath, "utf-8");
      if (pyproject.includes("fastapi")) {
        return "fastapi";
      }
    }
  }

  return "unknown";
}

/**
 * Main build function - orchestrates the entire build process
 */
export async function build(
  config: X402Config,
  projectDir: string,
  options: BuildOptions = {}
): Promise<BuildResult> {
  const startTime = Date.now();
  const errors: string[] = [];
  const warnings: string[] = [];

  // Resolve project directory
  const resolvedDir = path.resolve(projectDir);

  // Verify project directory exists
  if (!(await fs.pathExists(resolvedDir))) {
    return {
      success: false,
      outputDir: "",
      files: [],
      projectType: "unknown",
      errors: [`Project directory not found: ${resolvedDir}`],
    };
  }

  // Detect or use configured project type
  const projectType = config.type || (await detectProjectType(resolvedDir));

  if (options.verbose) {
    console.log(`[x402-build] Detected project type: ${projectType}`);
    console.log(`[x402-build] Project directory: ${resolvedDir}`);
  }

  // Create .x402 output directory
  const x402Dir = path.join(resolvedDir, ".x402");

  if (options.clean && (await fs.pathExists(x402Dir))) {
    if (options.verbose) {
      console.log(`[x402-build] Cleaning .x402 directory`);
    }
    await fs.remove(x402Dir);
  }

  await fs.ensureDir(x402Dir);

  try {
    let result: NodeBuildResult | PythonBuildResult;

    // Route to appropriate builder
    if (projectType === "fastapi") {
      result = await buildPythonProject(config, resolvedDir, {
        ...options,
        projectType,
      });
    } else {
      result = await buildNodeProject(config, resolvedDir, {
        ...options,
        projectType,
      });
    }

    // Collect any warnings from the build
    if (result.warnings) {
      warnings.push(...result.warnings);
    }

    const duration = Date.now() - startTime;

    if (options.verbose) {
      console.log(`[x402-build] Build completed in ${duration}ms`);
      console.log(`[x402-build] Generated files: ${result.files.join(", ")}`);
    }

    return {
      success: true,
      outputDir: result.outputDir,
      files: result.files,
      projectType,
      warnings: warnings.length > 0 ? warnings : undefined,
      duration,
    };
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : String(error);
    errors.push(errorMessage);

    return {
      success: false,
      outputDir: x402Dir,
      files: [],
      projectType,
      errors,
      duration: Date.now() - startTime,
    };
  }
}

/**
 * Validate build output
 */
export async function validateBuild(
  projectDir: string,
  expectedFiles: string[]
): Promise<{ valid: boolean; missing: string[] }> {
  const x402Dir = path.join(projectDir, ".x402");
  const missing: string[] = [];

  for (const file of expectedFiles) {
    const filePath = path.join(x402Dir, file);
    if (!(await fs.pathExists(filePath))) {
      missing.push(file);
    }
  }

  return {
    valid: missing.length === 0,
    missing,
  };
}

/**
 * Clean build artifacts
 */
export async function cleanBuild(projectDir: string): Promise<void> {
  const x402Dir = path.join(projectDir, ".x402");
  const dockerfilePath = path.join(projectDir, "Dockerfile");

  // Remove .x402 directory
  if (await fs.pathExists(x402Dir)) {
    await fs.remove(x402Dir);
  }

  // Remove generated Dockerfile (if it's ours)
  if (await fs.pathExists(dockerfilePath)) {
    const content = await fs.readFile(dockerfilePath, "utf-8");
    if (content.includes("Auto-generated by x402-deploy")) {
      await fs.remove(dockerfilePath);
    }
  }
}

/**
 * Get build info for a project
 */
export async function getBuildInfo(projectDir: string): Promise<{
  hasBuild: boolean;
  lastBuild?: Date;
  files?: string[];
  config?: X402Config;
}> {
  const x402Dir = path.join(projectDir, ".x402");

  if (!(await fs.pathExists(x402Dir))) {
    return { hasBuild: false };
  }

  const buildInfoPath = path.join(x402Dir, "build-info.json");
  const configPath = path.join(x402Dir, "config.json");

  let lastBuild: Date | undefined;
  let config: X402Config | undefined;

  if (await fs.pathExists(buildInfoPath)) {
    const buildInfo = await fs.readJSON(buildInfoPath);
    lastBuild = new Date(buildInfo.timestamp);
  }

  if (await fs.pathExists(configPath)) {
    config = await fs.readJSON(configPath);
  }

  const files = await fs.readdir(x402Dir);

  return {
    hasBuild: true,
    lastBuild,
    files,
    config,
  };
}

/**
 * Legacy buildProject function for backwards compatibility
 */
export async function buildProject(
  config: X402Config,
  projectDir: string
): Promise<{ outputDir: string; files: string[] }> {
  const result = await build(config, projectDir);
  return {
    outputDir: result.outputDir,
    files: result.files,
  };
}

// Re-export builders
export { buildNodeProject, NodeBuildResult } from "./node-builder.js";
export { buildPythonProject, PythonBuildResult } from "./python-builder.js";
