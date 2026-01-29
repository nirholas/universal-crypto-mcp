import fs from "fs-extra";
import path from "path";
import { ProjectType, X402Config } from "../types/config.js";

const CONFIG_FILE_NAMES = [
  "x402.config.json",
  "x402.json",
  ".x402.json",
  "x402-deploy.json",
];

export interface ProjectDetection {
  type: ProjectType;
  name: string;
  framework?: string;
  language: string;
  entryPoint?: string;
  routes?: string[];
}

/**
 * Detect the project type based on files in the directory
 */
export async function detectProjectType(dir: string): Promise<ProjectType> {
  const packageJsonPath = path.join(dir, "package.json");
  const requirementsTxtPath = path.join(dir, "requirements.txt");
  
  // Check for Python project
  if (await fs.pathExists(requirementsTxtPath)) {
    const content = await fs.readFile(requirementsTxtPath, "utf-8");
    if (content.includes("fastapi")) {
      return "fastapi";
    }
  }
  
  // Check for Node.js project
  if (await fs.pathExists(packageJsonPath)) {
    const pkg = await fs.readJSON(packageJsonPath);
    const deps = { ...pkg.dependencies, ...pkg.devDependencies };
    
    // Check for MCP server
    if (deps["@modelcontextprotocol/sdk"]) {
      return "mcp-server";
    }
    
    // Check for Next.js
    if (deps["next"]) {
      return "nextjs";
    }
    
    // Check for Hono
    if (deps["hono"]) {
      return "hono-api";
    }
    
    // Check for Express
    if (deps["express"]) {
      return "express-api";
    }
  }
  
  return "unknown";
}

/**
 * Detect project details including routes
 */
export async function detectProject(dir: string): Promise<ProjectDetection> {
  const type = await detectProjectType(dir);
  const packageJsonPath = path.join(dir, "package.json");
  
  let name = path.basename(dir);
  let language = "typescript";
  let framework: string | undefined;
  let entryPoint: string | undefined;
  let routes: string[] = [];

  if (await fs.pathExists(packageJsonPath)) {
    const pkg = await fs.readJSON(packageJsonPath);
    name = pkg.name || name;
    
    // Detect language
    const deps = { ...pkg.dependencies, ...pkg.devDependencies };
    if (!deps["typescript"] && !deps["@types/node"]) {
      language = "javascript";
    }
  }

  // Detect framework
  if (type === "express-api") {
    framework = "express";
  } else if (type === "hono-api") {
    framework = "hono";
  } else if (type === "fastapi") {
    framework = "fastapi";
    language = "python";
  } else if (type === "nextjs") {
    framework = "next.js";
  } else if (type === "mcp-server") {
    framework = "mcp";
  }

  // Find entry point
  entryPoint = await findEntrypoint(dir, type);

  // Detect routes if possible
  if (entryPoint) {
    routes = await detectRoutes(path.join(dir, entryPoint), type);
  }

  return {
    type,
    name,
    framework,
    language,
    entryPoint,
    routes,
  };
}

/**
 * Find the entrypoint file for a project
 */
export async function findEntrypoint(dir: string, projectType: ProjectType): Promise<string | null> {
  const candidates: Record<ProjectType, string[]> = {
    "mcp-server": ["src/index.ts", "src/server.ts", "index.ts"],
    "express-api": ["src/index.ts", "src/app.ts", "src/server.ts", "index.ts"],
    "hono-api": ["src/index.ts", "src/app.ts", "index.ts"],
    "fastapi": ["main.py", "app/main.py", "src/main.py"],
    "nextjs": ["pages/_app.tsx", "app/layout.tsx", "src/app/layout.tsx"],
    "unknown": ["index.ts", "index.js", "main.py"],
  };
  
  for (const candidate of candidates[projectType] || []) {
    if (await fs.pathExists(path.join(dir, candidate))) {
      return candidate;
    }
  }
  
  return null;
}

/**
 * Detect routes from source code (basic pattern matching)
 */
async function detectRoutes(filePath: string, projectType: ProjectType): Promise<string[]> {
  try {
    const content = await fs.readFile(filePath, "utf-8");
    const routes: string[] = [];

    if (projectType === "mcp-server") {
      // Detect MCP tools
      const toolMatches = content.matchAll(/server\.setRequestHandler\(ListToolsRequestSchema,|addTool\(\s*{?\s*name:\s*["']([^"']+)["']/g);
      for (const match of toolMatches) {
        if (match[1]) {
          routes.push(`tools/${match[1]}`);
        }
      }
    } else if (projectType === "express-api") {
      // Detect Express routes
      const routeMatches = content.matchAll(/\.(get|post|put|delete|patch)\s*\(\s*["']([^"']+)["']/gi);
      for (const match of routeMatches) {
        const method = match[1].toUpperCase();
        const path = match[2];
        routes.push(`${method} ${path}`);
      }
    } else if (projectType === "hono-api") {
      // Detect Hono routes
      const routeMatches = content.matchAll(/\.(get|post|put|delete|patch)\s*\(\s*["']([^"']+)["']/gi);
      for (const match of routeMatches) {
        const method = match[1].toUpperCase();
        const path = match[2];
        routes.push(`${method} ${path}`);
      }
    } else if (projectType === "fastapi") {
      // Detect FastAPI routes
      const routeMatches = content.matchAll(/@app\.(get|post|put|delete|patch)\s*\(\s*["']([^"']+)["']/gi);
      for (const match of routeMatches) {
        const method = match[1].toUpperCase();
        const path = match[2];
        routes.push(`${method} ${path}`);
      }
    }

    return [...new Set(routes)]; // Remove duplicates
  } catch (error) {
    return [];
  }
}

/**
 * Load x402 configuration from the project directory
 */
export async function loadConfig(dir: string): Promise<X402Config | null> {
  for (const fileName of CONFIG_FILE_NAMES) {
    const configPath = path.join(dir, fileName);
    if (await fs.pathExists(configPath)) {
      try {
        const config = await fs.readJSON(configPath);
        return config as X402Config;
      } catch {
        // Invalid JSON, try next file
      }
    }
  }

  // Also check package.json for x402 field
  const packageJsonPath = path.join(dir, "package.json");
  if (await fs.pathExists(packageJsonPath)) {
    try {
      const pkg = await fs.readJSON(packageJsonPath);
      if (pkg.x402) {
        return pkg.x402 as X402Config;
      }
    } catch {
      // Invalid package.json
    }
  }

  return null;
}

/**
 * Save x402 configuration to the project directory
 */
export async function saveConfig(dir: string, config: X402Config): Promise<string> {
  const configPath = path.join(dir, "x402.config.json");
  await fs.writeJSON(configPath, config, { spaces: 2 });
  return configPath;
}
