/**
 * Railway Deployer
 * Deploy x402-wrapped projects to Railway using their GraphQL API
 */

import { X402Config } from "../types/config.js";
import { generateRailwayEnvVars } from "../templates/railway.js";

/**
 * Railway project interface
 */
export interface RailwayProject {
  id: string;
  name: string;
  createdAt: string;
  environments: RailwayEnvironment[];
}

/**
 * Railway environment interface
 */
export interface RailwayEnvironment {
  id: string;
  name: string;
  projectId: string;
}

/**
 * Railway service interface
 */
export interface RailwayService {
  id: string;
  name: string;
  projectId: string;
}

/**
 * Railway deployment interface
 */
export interface RailwayDeployment {
  id: string;
  status: "BUILDING" | "DEPLOYING" | "SUCCESS" | "FAILED" | "CRASHED" | "REMOVED";
  url: string | null;
  staticUrl: string;
  createdAt: string;
}

/**
 * Railway deploy result
 */
export interface RailwayDeployResult {
  projectId: string;
  projectName: string;
  serviceId: string;
  deploymentId: string;
  url: string;
  status: string;
}

/**
 * Railway deployer class
 */
export class RailwayDeployer {
  private apiToken: string;
  private baseUrl = "https://backboard.railway.app/graphql/v2";

  constructor(apiToken?: string) {
    this.apiToken = apiToken || process.env.RAILWAY_TOKEN || "";
    if (!this.apiToken) {
      throw new Error(
        "Railway API token required. Set RAILWAY_TOKEN environment variable or pass token to constructor."
      );
    }
  }

  /**
   * Execute a GraphQL query against Railway API
   */
  private async graphql<T>(query: string, variables?: Record<string, unknown>): Promise<T> {
    const response = await fetch(this.baseUrl, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${this.apiToken}`,
      },
      body: JSON.stringify({ query, variables }),
    });

    if (!response.ok) {
      const error = await response.text();
      throw new Error(`Railway API error: ${response.status} - ${error}`);
    }

    const result = await response.json();

    if (result.errors) {
      throw new Error(`Railway GraphQL error: ${JSON.stringify(result.errors)}`);
    }

    return result.data;
  }

  /**
   * Create a new Railway project
   */
  async createProject(name: string): Promise<RailwayProject> {
    const query = `
      mutation ProjectCreate($input: ProjectCreateInput!) {
        projectCreate(input: $input) {
          id
          name
          createdAt
          environments {
            edges {
              node {
                id
                name
              }
            }
          }
        }
      }
    `;

    const data = await this.graphql<{ projectCreate: RailwayProject }>(query, {
      input: { name },
    });

    return data.projectCreate;
  }

  /**
   * Get an existing project by ID
   */
  async getProject(projectId: string): Promise<RailwayProject | null> {
    const query = `
      query GetProject($id: String!) {
        project(id: $id) {
          id
          name
          createdAt
          environments {
            edges {
              node {
                id
                name
              }
            }
          }
        }
      }
    `;

    try {
      const data = await this.graphql<{ project: RailwayProject }>(query, {
        id: projectId,
      });
      return data.project;
    } catch {
      return null;
    }
  }

  /**
   * Find a project by name
   */
  async findProject(name: string): Promise<RailwayProject | null> {
    const query = `
      query GetProjects {
        projects {
          edges {
            node {
              id
              name
              createdAt
              environments {
                edges {
                  node {
                    id
                    name
                  }
                }
              }
            }
          }
        }
      }
    `;

    const data = await this.graphql<{
      projects: { edges: { node: RailwayProject }[] };
    }>(query);

    const project = data.projects.edges.find(
      (edge) => edge.node.name.toLowerCase() === name.toLowerCase()
    );

    return project?.node || null;
  }

  /**
   * Create a service in a project
   */
  async createService(projectId: string, environmentId: string, name: string): Promise<RailwayService> {
    const query = `
      mutation ServiceCreate($input: ServiceCreateInput!) {
        serviceCreate(input: $input) {
          id
          name
          projectId
        }
      }
    `;

    const data = await this.graphql<{ serviceCreate: RailwayService }>(query, {
      input: {
        projectId,
        name,
      },
    });

    return data.serviceCreate;
  }

  /**
   * Set environment variables for a service
   */
  async setVariables(
    projectId: string,
    environmentId: string,
    serviceId: string,
    variables: Record<string, string>
  ): Promise<void> {
    const query = `
      mutation VariablesSetFromObject($input: VariableCollectionUpsertInput!) {
        variableCollectionUpsert(input: $input)
      }
    `;

    await this.graphql(query, {
      input: {
        projectId,
        environmentId,
        serviceId,
        variables,
      },
    });
  }

  /**
   * Deploy from a GitHub repository
   */
  async deployFromRepo(
    projectId: string,
    environmentId: string,
    serviceId: string,
    repoUrl: string,
    branch: string = "main"
  ): Promise<RailwayDeployment> {
    const query = `
      mutation ServiceConnect($input: ServiceConnectInput!) {
        serviceConnect(input: $input) {
          id
          name
        }
      }
    `;

    await this.graphql(query, {
      input: {
        id: serviceId,
        repo: repoUrl,
        branch,
      },
    });

    // Trigger deployment
    return this.triggerDeploy(projectId, environmentId, serviceId);
  }

  /**
   * Trigger a new deployment
   */
  async triggerDeploy(
    projectId: string,
    environmentId: string,
    serviceId: string
  ): Promise<RailwayDeployment> {
    const query = `
      mutation ServiceInstanceRedeploy($serviceId: String!, $environmentId: String!) {
        serviceInstanceRedeploy(serviceId: $serviceId, environmentId: $environmentId)
      }
    `;

    await this.graphql(query, {
      serviceId,
      environmentId,
    });

    // Get latest deployment
    return this.getLatestDeployment(serviceId, environmentId);
  }

  /**
   * Get the latest deployment for a service
   */
  async getLatestDeployment(serviceId: string, environmentId: string): Promise<RailwayDeployment> {
    const query = `
      query GetDeployments($serviceId: String!, $environmentId: String!) {
        deployments(
          first: 1
          input: { serviceId: $serviceId, environmentId: $environmentId }
        ) {
          edges {
            node {
              id
              status
              staticUrl
              createdAt
            }
          }
        }
      }
    `;

    const data = await this.graphql<{
      deployments: { edges: { node: RailwayDeployment }[] };
    }>(query, { serviceId, environmentId });

    if (data.deployments.edges.length === 0) {
      throw new Error("No deployments found");
    }

    return data.deployments.edges[0].node;
  }

  /**
   * Wait for deployment to complete
   */
  async waitForDeployment(
    serviceId: string,
    environmentId: string,
    timeoutMs: number = 300000
  ): Promise<RailwayDeployment> {
    const startTime = Date.now();
    const pollInterval = 5000;

    while (Date.now() - startTime < timeoutMs) {
      const deployment = await this.getLatestDeployment(serviceId, environmentId);

      if (deployment.status === "SUCCESS") {
        return deployment;
      }

      if (deployment.status === "FAILED" || deployment.status === "CRASHED") {
        throw new Error(`Deployment failed with status: ${deployment.status}`);
      }

      await new Promise((resolve) => setTimeout(resolve, pollInterval));
    }

    throw new Error("Deployment timed out");
  }

  /**
   * Generate a custom domain for a service
   */
  async generateDomain(serviceId: string, environmentId: string): Promise<string> {
    const query = `
      mutation ServiceDomainCreate($input: ServiceDomainCreateInput!) {
        serviceDomainCreate(input: $input) {
          domain
        }
      }
    `;

    const data = await this.graphql<{ serviceDomainCreate: { domain: string } }>(query, {
      input: {
        serviceId,
        environmentId,
      },
    });

    return data.serviceDomainCreate.domain;
  }

  /**
   * Main deploy function
   */
  async deploy(config: X402Config, projectDir: string): Promise<RailwayDeployResult> {
    const projectName = config.name
      .toLowerCase()
      .replace(/[^a-z0-9-]/g, "-")
      .replace(/-+/g, "-");

    console.log(`[railway] Starting deployment for ${projectName}...`);

    // 1. Create or get project
    let project = await this.findProject(projectName);
    if (!project) {
      console.log(`[railway] Creating new project: ${projectName}`);
      project = await this.createProject(projectName);
    } else {
      console.log(`[railway] Using existing project: ${project.id}`);
    }

    // Get production environment
    const environments = (project as any).environments?.edges || [];
    let environmentId: string;

    if (environments.length > 0) {
      environmentId = environments[0].node.id;
    } else {
      throw new Error("No environments found in project");
    }

    // 2. Create service
    const serviceName = `${projectName}-api`;
    console.log(`[railway] Creating service: ${serviceName}`);
    const service = await this.createService(project.id, environmentId, serviceName);

    // 3. Set environment variables
    const envVars = generateRailwayEnvVars(config);
    console.log(`[railway] Setting ${Object.keys(envVars).length} environment variables`);
    await this.setVariables(project.id, environmentId, service.id, envVars);

    // 4. Generate domain
    console.log(`[railway] Generating domain...`);
    const domain = await this.generateDomain(service.id, environmentId);

    // 5. Trigger deployment (assuming code is already pushed)
    console.log(`[railway] Triggering deployment...`);
    const deployment = await this.triggerDeploy(project.id, environmentId, service.id);

    // 6. Wait for deployment to complete
    console.log(`[railway] Waiting for deployment to complete...`);
    const finalDeployment = await this.waitForDeployment(service.id, environmentId);

    const url = `https://${domain}`;
    console.log(`[railway] Deployment complete: ${url}`);

    return {
      projectId: project.id,
      projectName: project.name,
      serviceId: service.id,
      deploymentId: finalDeployment.id,
      url,
      status: finalDeployment.status,
    };
  }

  /**
   * Get deployment logs
   */
  async getLogs(deploymentId: string): Promise<string[]> {
    const query = `
      query GetBuildLogs($deploymentId: String!) {
        buildLogs(deploymentId: $deploymentId) {
          message
          timestamp
        }
      }
    `;

    const data = await this.graphql<{
      buildLogs: { message: string; timestamp: string }[];
    }>(query, { deploymentId });

    return data.buildLogs.map((log) => `[${log.timestamp}] ${log.message}`);
  }

  /**
   * Delete a project
   */
  async deleteProject(projectId: string): Promise<void> {
    const query = `
      mutation ProjectDelete($id: String!) {
        projectDelete(id: $id)
      }
    `;

    await this.graphql(query, { id: projectId });
  }
}

/**
 * Create a Railway deployer instance
 */
export function createRailwayDeployer(apiToken?: string): RailwayDeployer {
  return new RailwayDeployer(apiToken);
}
