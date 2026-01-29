// Main exports for programmatic usage
export * from "./types/config.js";
export * from "./gateway/index.js";
export * from "./utils/detect.js";
export * from "./utils/crypto.js";

// Builder exports
export {
  build,
  buildProject,
  detectProjectType,
  validateBuild,
  cleanBuild,
  getBuildInfo,
  buildNodeProject,
  buildPythonProject,
  type BuildResult,
  type BuildOptions,
} from "./builders/index.js";

// Deployer exports
export {
  deployToProvider,
  checkDeploymentStatus,
  getDeploymentLogs,
  deleteDeployment,
  createRailwayDeployer,
  createFlyDeployer,
  createVercelDeployer,
  type DeployResult,
  type DeployOptions,
} from "./deployers/index.js";

// Template exports
export {
  // Dockerfile
  generateDockerfile,
  generateDockerignore,
  // Railway
  generateRailwayJson,
  generateRailwayToml,
  generateRailwayEnvVars,
  generateProcfile,
  // Fly.io
  generateFlyToml,
  generateFlySecrets,
  generateFlyMachinesConfig,
  FLY_REGIONS,
  // Vercel
  generateVercelJson,
  generateNextMiddleware,
  generateNextApiWrapper,
  VERCEL_REGIONS,
  // Docker Compose
  generateDockerCompose,
  generateFullStackCompose,
  generateEnvExample,
  generatePrometheusConfig,
  // Wrapper code
  generateNodeWrapper,
  generatePythonWrapper,
  generateMcpWrapper,
} from "./templates/index.js";

// Discovery exports - Full module
export * from "./discovery/index.js";

// Marketplace exports - Full module
export * from "./marketplace/index.js";

// Dashboard exports
export * from "./dashboard/index.js";

// Monitoring exports
export * from "./monitoring/index.js";
