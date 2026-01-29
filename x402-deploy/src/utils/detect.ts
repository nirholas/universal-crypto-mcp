import fs from "fs-extra";
import path from "path";
import { ProjectType } from "../types/config.js";

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
