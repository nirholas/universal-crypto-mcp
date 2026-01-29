import { X402Config } from "../types/config.js";

export interface DeployResult {
  url: string;
  provider: string;
  deploymentId: string;
}

export async function deployToProvider(config: X402Config, projectDir: string): Promise<DeployResult> {
  // Placeholder - implemented by Agent 3
  throw new Error("Not implemented");
}
