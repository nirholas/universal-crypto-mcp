// Main exports for programmatic usage
export * from "./types/config.js";
export * from "./gateway/index.js";
export * from "./utils/detect.js";
export * from "./utils/crypto.js";

// Re-export builder and deployer factories
export { buildProject } from "./builders/index.js";
export { deployToProvider } from "./deployers/index.js";
export { registerWithX402Scan } from "./discovery/register.js";
