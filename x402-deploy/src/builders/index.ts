import { X402Config } from "../types/config.js";

export interface BuildResult {
  outputDir: string;
  files: string[];
}

export async function buildProject(config: X402Config, projectDir: string): Promise<BuildResult> {
  // Placeholder - implemented by Agent 3
  return {
    outputDir: `${projectDir}/dist`,
    files: [],
  };
}
