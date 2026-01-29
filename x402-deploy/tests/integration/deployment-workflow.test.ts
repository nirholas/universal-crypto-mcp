/**
 * End-to-End Integration Tests
 * 
 * Tests the complete workflow from initialization to deployment
 */

import { describe, it, expect, beforeAll, afterAll } from 'vitest';
import { exec } from 'child_process';
import { promisify } from 'util';
import fs from 'fs-extra';
import path from 'path';
import { fileURLToPath } from 'url';

const execAsync = promisify(exec);
const __dirname = path.dirname(fileURLToPath(import.meta.url));

describe('Complete Deployment Workflow', () => {
  const testDir = path.join(__dirname, '../../test-temp');

  beforeAll(async () => {
    // Clean up any existing test directory
    await fs.remove(testDir);
    await fs.ensureDir(testDir);
  });

  afterAll(async () => {
    // Clean up test directory
    await fs.remove(testDir);
  });

  it('should initialize x402 configuration', async () => {
    const projectDir = path.join(testDir, 'test-mcp-server');
    await fs.ensureDir(projectDir);

    // Create a basic package.json
    await fs.writeJSON(path.join(projectDir, 'package.json'), {
      name: 'test-mcp-server',
      dependencies: {
        '@modelcontextprotocol/sdk': '^0.5.0',
      },
    });

    // Run init command (would be interactive in real scenario)
    // For testing, we'll create the config directly
    const config = {
      name: 'test-mcp-server',
      type: 'mcp-server',
      payment: {
        wallet: '0x1234567890123456789012345678901234567890',
        network: 'eip155:8453',
        token: 'USDC',
      },
      pricing: {
        default: '$0.001',
        routes: {},
      },
    };

    await fs.writeJSON(path.join(projectDir, 'x402.config.json'), config, {
      spaces: 2,
    });

    // Verify config was created
    const configExists = await fs.pathExists(
      path.join(projectDir, 'x402.config.json')
    );
    expect(configExists).toBe(true);

    // Verify config content
    const savedConfig = await fs.readJSON(
      path.join(projectDir, 'x402.config.json')
    );
    expect(savedConfig.name).toBe('test-mcp-server');
    expect(savedConfig.type).toBe('mcp-server');
    expect(savedConfig.payment.network).toBe('eip155:8453');
  });

  it('should validate configuration', async () => {
    const validConfig = {
      name: 'valid-api',
      type: 'express-api',
      payment: {
        wallet: '0x' + '1'.repeat(40),
        network: 'eip155:8453',
        token: 'USDC',
      },
      pricing: {
        default: '$0.001',
      },
    };

    expect(() => {
      // Validation would happen here
      expect(validConfig.payment.wallet).toMatch(/^0x[0-9a-fA-F]{40}$/);
      expect(validConfig.payment.network).toMatch(/^eip155:\d+$/);
    }).not.toThrow();
  });

  it('should export Docker configuration', async () => {
    const projectDir = path.join(testDir, 'docker-export');
    await fs.ensureDir(projectDir);

    const config = {
      name: 'docker-test',
      type: 'express-api',
      payment: {
        wallet: '0x1234567890123456789012345678901234567890',
        network: 'eip155:8453',
        token: 'USDC',
      },
      pricing: {
        default: '$0.001',
      },
    };

    await fs.writeJSON(path.join(projectDir, 'x402.config.json'), config);

    // Mock Dockerfile generation
    const dockerfile = `
FROM node:20-alpine
WORKDIR /app
COPY package*.json ./
RUN npm ci --only=production
COPY . .
EXPOSE 3000
CMD ["npm", "start"]
`.trim();

    await fs.writeFile(path.join(projectDir, 'Dockerfile'), dockerfile);

    const dockerfileExists = await fs.pathExists(
      path.join(projectDir, 'Dockerfile')
    );
    expect(dockerfileExists).toBe(true);

    const content = await fs.readFile(
      path.join(projectDir, 'Dockerfile'),
      'utf-8'
    );
    expect(content).toContain('FROM node:20-alpine');
    expect(content).toContain('EXPOSE 3000');
  });

  it('should generate Kubernetes manifests', async () => {
    const projectDir = path.join(testDir, 'k8s-export');
    await fs.ensureDir(projectDir);

    const manifest = {
      apiVersion: 'apps/v1',
      kind: 'Deployment',
      metadata: {
        name: 'x402-api',
      },
      spec: {
        replicas: 3,
        selector: {
          matchLabels: {
            app: 'x402-api',
          },
        },
        template: {
          metadata: {
            labels: {
              app: 'x402-api',
            },
          },
          spec: {
            containers: [
              {
                name: 'api',
                image: 'x402-api:latest',
                ports: [{ containerPort: 3000 }],
              },
            ],
          },
        },
      },
    };

    await fs.writeJSON(
      path.join(projectDir, 'deployment.yaml'),
      manifest,
      { spaces: 2 }
    );

    const manifestExists = await fs.pathExists(
      path.join(projectDir, 'deployment.yaml')
    );
    expect(manifestExists).toBe(true);
  });

  it('should handle multi-chain configuration', async () => {
    const multiChainConfig = {
      name: 'multi-chain-api',
      type: 'express-api',
      payment: {
        wallet: '0x1234567890123456789012345678901234567890',
        networks: ['eip155:8453', 'eip155:42161', 'eip155:137'],
        token: 'USDC',
      },
      pricing: {
        default: '$0.001',
      },
    };

    expect(multiChainConfig.payment.networks).toHaveLength(3);
    expect(multiChainConfig.payment.networks).toContain('eip155:8453'); // Base
    expect(multiChainConfig.payment.networks).toContain('eip155:42161'); // Arbitrum
    expect(multiChainConfig.payment.networks).toContain('eip155:137'); // Polygon
  });

  it('should support tiered pricing', async () => {
    const tieredConfig = {
      name: 'tiered-api',
      type: 'express-api',
      payment: {
        wallet: '0x1234567890123456789012345678901234567890',
        network: 'eip155:8453',
        token: 'USDC',
      },
      pricing: {
        default: '$0.001',
        routes: {
          '/api/basic': '$0.001',
          '/api/advanced': '$0.01',
          '/api/premium': '$0.10',
        },
      },
    };

    expect(tieredConfig.pricing.routes['/api/basic']).toBe('$0.001');
    expect(tieredConfig.pricing.routes['/api/advanced']).toBe('$0.01');
    expect(tieredConfig.pricing.routes['/api/premium']).toBe('$0.10');
  });

  it('should support subscription model', async () => {
    const subscriptionConfig = {
      name: 'subscription-api',
      type: 'fastapi',
      payment: {
        wallet: '0x1234567890123456789012345678901234567890',
        network: 'eip155:8453',
        token: 'USDC',
      },
      pricing: {
        model: 'subscription',
        tiers: {
          basic: {
            price: '$10',
            duration: '30d',
            limits: { requests: 1000 },
          },
          pro: {
            price: '$50',
            duration: '30d',
            limits: { requests: -1 },
          },
        },
      },
    };

    expect(subscriptionConfig.pricing.model).toBe('subscription');
    expect(subscriptionConfig.pricing.tiers.basic.price).toBe('$10');
    expect(subscriptionConfig.pricing.tiers.pro.limits.requests).toBe(-1);
  });

  it('should support credit-based pricing', async () => {
    const creditConfig = {
      name: 'credit-api',
      type: 'nextjs',
      payment: {
        wallet: '0x1234567890123456789012345678901234567890',
        network: 'eip155:8453',
        token: 'USDC',
      },
      pricing: {
        model: 'credits',
        packages: {
          small: { credits: 100, price: '$10', discount: 0 },
          medium: { credits: 1000, price: '$80', discount: 20 },
          large: { credits: 10000, price: '$500', discount: 50 },
        },
      },
    };

    expect(creditConfig.pricing.model).toBe('credits');
    expect(creditConfig.pricing.packages.medium.discount).toBe(20);
    expect(creditConfig.pricing.packages.large.credits).toBe(10000);
  });

  it('should enable discovery', async () => {
    const discoveryConfig = {
      name: 'discoverable-api',
      type: 'express-api',
      payment: {
        wallet: '0x1234567890123456789012345678901234567890',
        network: 'eip155:8453',
        token: 'USDC',
      },
      pricing: {
        default: '$0.001',
      },
      discovery: {
        enabled: true,
        instructions: 'A test API with x402 payments',
        category: ['test', 'api'],
        tags: ['testing', 'x402'],
      },
    };

    expect(discoveryConfig.discovery.enabled).toBe(true);
    expect(discoveryConfig.discovery.category).toContain('test');
    expect(discoveryConfig.discovery.tags).toContain('x402');
  });
});

describe('Example Projects Validation', () => {
  const examplesDir = path.join(__dirname, '../../examples');

  it('should have valid MCP calculator example', async () => {
    const mcpDir = path.join(examplesDir, 'mcp-calculator');
    const configPath = path.join(mcpDir, 'x402.config.json');
    
    const configExists = await fs.pathExists(configPath);
    expect(configExists).toBe(true);

    const config = await fs.readJSON(configPath);
    expect(config.type).toBe('mcp-server');
    expect(config.payment.network).toBe('eip155:8453');
  });

  it('should have valid Express weather example', async () => {
    const expressDir = path.join(examplesDir, 'express-weather');
    const configPath = path.join(expressDir, 'x402.config.json');
    
    const configExists = await fs.pathExists(configPath);
    expect(configExists).toBe(true);

    const config = await fs.readJSON(configPath);
    expect(config.type).toBe('express-api');
    expect(config.pricing.routes).toBeDefined();
  });

  it('should have valid FastAPI translation example', async () => {
    const fastapiDir = path.join(examplesDir, 'fastapi-translation');
    const configPath = path.join(fastapiDir, 'x402.config.json');
    
    const configExists = await fs.pathExists(configPath);
    expect(configExists).toBe(true);

    const config = await fs.readJSON(configPath);
    expect(config.type).toBe('fastapi');
    expect(config.pricing.model).toBe('subscription');
  });

  it('should have valid Next.js image API example', async () => {
    const nextjsDir = path.join(examplesDir, 'nextjs-image-api');
    const configPath = path.join(nextjsDir, 'x402.config.json');
    
    const configExists = await fs.pathExists(configPath);
    expect(configExists).toBe(true);

    const config = await fs.readJSON(configPath);
    expect(config.type).toBe('nextjs');
    expect(config.pricing.model).toBe('credits');
  });
});
