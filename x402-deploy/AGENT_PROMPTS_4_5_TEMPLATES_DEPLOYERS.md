# Agent 4 & 5: Templates & Platform Deployers

> Build the infrastructure automation layer that makes 1-click deploy possible

---

## Agent 4: Template Generator

**Goal:** Generate deployment configs and wrapper code for any project type

### Task 4.1: Dockerfile Generator 🐳

**File:** `src/templates/dockerfile.ts`

Generate optimized Dockerfiles based on project type:

```typescript
import { X402Config, ProjectType } from '../types/config.js';
import { detectPackageManager } from '../utils/detect.js';

export interface DockerfileOptions {
  config: X402Config;
  includeGateway?: boolean;
  optimize?: boolean;
}

export async function generateDockerfile(options: DockerfileOptions): Promise<string> {
  const { config, includeGateway = true, optimize = true } = options;
  
  switch (config.project.type) {
    case 'mcp-server':
      return generateMCPDockerfile(config, includeGateway, optimize);
    case 'express':
      return generateExpressDockerfile(config, includeGateway, optimize);
    case 'fastapi':
      return generateFastAPIDockerfile(config, includeGateway, optimize);
    case 'nextjs':
      return generateNextJSDockerfile(config, includeGateway, optimize);
    default:
      return generateGenericNodeDockerfile(config, includeGateway, optimize);
  }
}

function generateMCPDockerfile(
  config: X402Config,
  includeGateway: boolean,
  optimize: boolean
): string {
  const packageManager = detectPackageManager(process.cwd());
  const lockfile = {
    npm: 'package-lock.json',
    yarn: 'yarn.lock',
    pnpm: 'pnpm-lock.yaml',
    bun: 'bun.lockb'
  }[packageManager];

  return `# x402-deploy Generated Dockerfile
# MCP Server with x402 Payment Gateway
# Generated at: ${new Date().toISOString()}

FROM node:20-alpine AS base

# Install dependencies only when needed
FROM base AS deps
RUN apk add --no-cache libc6-compat
WORKDIR /app

# Install dependencies based on the preferred package manager
COPY package.json ${lockfile}* ./
RUN \\
  if [ -f yarn.lock ]; then yarn --frozen-lockfile; \\
  elif [ -f package-lock.json ]; then npm ci; \\
  elif [ -f pnpm-lock.yaml ]; then corepack enable pnpm && pnpm i --frozen-lockfile; \\
  elif [ -f bun.lockb ]; then bun install --frozen-lockfile; \\
  else echo "Lockfile not found." && exit 1; \\
  fi

# Rebuild the source code only when needed
FROM base AS builder
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY . .

# Build the application
ENV NEXT_TELEMETRY_DISABLED 1
RUN \\
  if [ -f yarn.lock ]; then yarn build; \\
  elif [ -f package-lock.json ]; then npm run build; \\
  elif [ -f pnpm-lock.yaml ]; then corepack enable pnpm && pnpm build; \\
  elif [ -f bun.lockb ]; then bun run build; \\
  else npm run build; \\
  fi

# Production image, copy all the files and run
FROM base AS runner
WORKDIR /app

ENV NODE_ENV production
ENV NEXT_TELEMETRY_DISABLED 1

RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 mcpuser

COPY --from=builder /app/dist ./dist
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/package.json ./package.json
${includeGateway ? 'COPY --from=builder /app/x402-gateway.js ./x402-gateway.js' : ''}

USER mcpuser

# Health check
HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \\
  CMD node -e "require('http').get('http://localhost:${config.deploy?.port || 3000}/health', (r) => { process.exit(r.statusCode === 200 ? 0 : 1) })"

EXPOSE ${config.deploy?.port || 3000}

${includeGateway 
  ? `# Start with x402 gateway wrapper
CMD ["node", "x402-gateway.js"]`
  : `# Start original server
CMD ["node", "dist/index.js"]`}
`;
}

function generateFastAPIDockerfile(
  config: X402Config,
  includeGateway: boolean,
  optimize: boolean
): string {
  return `# x402-deploy Generated Dockerfile
# FastAPI with x402 Payment Gateway
# Generated at: ${new Date().toISOString()}

FROM python:3.11-slim AS base

# Prevent Python from writing pyc files and buffering stdout/stderr
ENV PYTHONDONTWRITEBYTECODE=1
ENV PYTHONUNBUFFERED=1

WORKDIR /app

# Install system dependencies
RUN apt-get update && apt-get install -y \\
    gcc \\
    && rm -rf /var/lib/apt/lists/*

# Install Python dependencies
COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

${includeGateway ? `# Install x402 gateway
RUN pip install --no-cache-dir x402-gateway
` : ''}

# Copy application code
COPY . .

# Create non-root user
RUN useradd -m -u 1001 apiuser && chown -R apiuser:apiuser /app
USER apiuser

# Health check
HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \\
  CMD python -c "import requests; requests.get('http://localhost:${config.deploy?.port || 8000}/health', timeout=3)"

EXPOSE ${config.deploy?.port || 8000}

${includeGateway
  ? `# Start with x402 gateway
CMD ["x402-gateway", "--app", "${config.project.entryPoint}", "--port", "${config.deploy?.port || 8000}"]`
  : `# Start uvicorn directly
CMD ["uvicorn", "app.main:app", "--host", "0.0.0.0", "--port", "${config.deploy?.port || 8000}"]`}
`;
}

function generateExpressDockerfile(
  config: X402Config,
  includeGateway: boolean,
  optimize: boolean
): string {
  // Similar to MCP but simpler
  return generateMCPDockerfile(config, includeGateway, optimize)
    .replace('MCP Server', 'Express API');
}

function generateNextJSDockerfile(
  config: X402Config,
  includeGateway: boolean,
  optimize: boolean
): string {
  return `# x402-deploy Generated Dockerfile
# Next.js with x402 Payment Gateway
# Generated at: ${new Date().toISOString()}

FROM node:20-alpine AS base

FROM base AS deps
RUN apk add --no-cache libc6-compat
WORKDIR /app

COPY package.json package-lock.json* pnpm-lock.yaml* yarn.lock* bun.lockb* ./
RUN \\
  if [ -f yarn.lock ]; then yarn --frozen-lockfile; \\
  elif [ -f package-lock.json ]; then npm ci; \\
  elif [ -f pnpm-lock.yaml ]; then corepack enable pnpm && pnpm i --frozen-lockfile; \\
  elif [ -f bun.lockb ]; then bun install --frozen-lockfile; \\
  else echo "Lockfile not found." && exit 1; \\
  fi

FROM base AS builder
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY . .

ENV NEXT_TELEMETRY_DISABLED 1
RUN \\
  if [ -f yarn.lock ]; then SKIP_ENV_VALIDATION=1 yarn build; \\
  elif [ -f package-lock.json ]; then SKIP_ENV_VALIDATION=1 npm run build; \\
  elif [ -f pnpm-lock.yaml ]; then corepack enable pnpm && SKIP_ENV_VALIDATION=1 pnpm build; \\
  elif [ -f bun.lockb ]; then SKIP_ENV_VALIDATION=1 bun run build; \\
  else SKIP_ENV_VALIDATION=1 npm run build; \\
  fi

FROM base AS runner
WORKDIR /app

ENV NODE_ENV production
ENV NEXT_TELEMETRY_DISABLED 1

RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nextjs

COPY --from=builder /app/public ./public
COPY --from=builder --chown=nextjs:nodejs /app/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /app/.next/static ./.next/static

USER nextjs

EXPOSE ${config.deploy?.port || 3000}

ENV PORT ${config.deploy?.port || 3000}
ENV HOSTNAME "0.0.0.0"

CMD ["node", "server.js"]
`;
}

function generateGenericNodeDockerfile(
  config: X402Config,
  includeGateway: boolean,
  optimize: boolean
): string {
  return generateMCPDockerfile(config, includeGateway, optimize)
    .replace('MCP Server', 'Node.js Application');
}
```

---

### Task 4.2: Docker Compose Generator 🐙

**File:** `src/templates/docker-compose.ts`

```typescript
import { X402Config } from '../types/config.js';
import YAML from 'yaml';

export interface DockerComposeOptions {
  config: X402Config;
  includeDatabase?: boolean;
  includeRedis?: boolean;
  includePrometheus?: boolean;
}

export async function generateDockerCompose(
  options: DockerComposeOptions
): Promise<string> {
  const { config, includeDatabase, includeRedis, includePrometheus } = options;

  const compose = {
    version: '3.8',
    services: {
      app: {
        build: {
          context: '.',
          dockerfile: 'Dockerfile'
        },
        ports: [`${config.deploy?.port || 3000}:${config.deploy?.port || 3000}`],
        environment: {
          NODE_ENV: 'production',
          X402_WALLET: config.payment.wallet,
          X402_NETWORK: config.payment.network,
          X402_FACILITATOR: config.payment.facilitator,
          ...(config.deploy?.environment || {})
        },
        restart: 'unless-stopped',
        healthcheck: {
          test: ['CMD', 'curl', '-f', `http://localhost:${config.deploy?.port || 3000}/health`],
          interval: '30s',
          timeout: '3s',
          retries: 3,
          start_period: '5s'
        }
      }
    },
    networks: {
      x402_network: {
        driver: 'bridge'
      }
    }
  };

  // Add database if requested
  if (includeDatabase) {
    compose.services.postgres = {
      image: 'postgres:16-alpine',
      environment: {
        POSTGRES_USER: 'x402',
        POSTGRES_PASSWORD: 'changeme',
        POSTGRES_DB: 'x402_analytics'
      },
      volumes: ['postgres_data:/var/lib/postgresql/data'],
      restart: 'unless-stopped',
      healthcheck: {
        test: ['CMD-SHELL', 'pg_isready -U x402'],
        interval: '10s',
        timeout: '5s',
        retries: 5
      }
    };
    compose.services.app.depends_on = { postgres: { condition: 'service_healthy' } };
    compose.services.app.environment.DATABASE_URL = 
      'postgresql://x402:changeme@postgres:5432/x402_analytics';
    compose.volumes = { postgres_data: {} };
  }

  // Add Redis for rate limiting
  if (includeRedis) {
    compose.services.redis = {
      image: 'redis:7-alpine',
      restart: 'unless-stopped',
      healthcheck: {
        test: ['CMD', 'redis-cli', 'ping'],
        interval: '10s',
        timeout: '3s',
        retries: 3
      }
    };
    if (!compose.services.app.depends_on) compose.services.app.depends_on = {};
    compose.services.app.depends_on.redis = { condition: 'service_healthy' };
    compose.services.app.environment.REDIS_URL = 'redis://redis:6379';
  }

  // Add Prometheus for metrics
  if (includePrometheus) {
    compose.services.prometheus = {
      image: 'prom/prometheus:latest',
      ports: ['9090:9090'],
      volumes: [
        './prometheus.yml:/etc/prometheus/prometheus.yml',
        'prometheus_data:/prometheus'
      ],
      restart: 'unless-stopped'
    };
    if (!compose.volumes) compose.volumes = {};
    compose.volumes.prometheus_data = {};
  }

  // Add all services to network
  Object.keys(compose.services).forEach(service => {
    compose.services[service].networks = ['x402_network'];
  });

  return YAML.stringify(compose);
}
```

---

### Task 4.3: Railway Config Generator 🚂

**File:** `src/templates/railway.ts`

```typescript
import { X402Config } from '../types/config.js';

export interface RailwayConfig {
  $schema: string;
  build: {
    builder: string;
    buildCommand?: string;
  };
  deploy: {
    startCommand: string;
    restartPolicyType: string;
    restartPolicyMaxRetries?: number;
  };
  envs: Record<string, { default?: string; description?: string }>;
  healthcheck?: {
    path: string;
    timeout: number;
    interval: number;
  };
}

export function generateRailwayConfig(config: X402Config): RailwayConfig {
  return {
    $schema: 'https://railway.app/railway.schema.json',
    build: {
      builder: 'DOCKERFILE'
    },
    deploy: {
      startCommand: config.project.type === 'fastapi' 
        ? `uvicorn ${config.project.entryPoint.replace('.py', '')}:app --host 0.0.0.0 --port $PORT`
        : 'node dist/index.js',
      restartPolicyType: 'ON_FAILURE',
      restartPolicyMaxRetries: 10
    },
    envs: {
      NODE_ENV: {
        default: 'production'
      },
      X402_WALLET: {
        description: 'Ethereum wallet address for receiving payments'
      },
      X402_NETWORK: {
        default: config.payment.network,
        description: 'Blockchain network (e.g., eip155:8453 for Base)'
      },
      X402_FACILITATOR: {
        default: config.payment.facilitator,
        description: 'x402 payment facilitator URL'
      },
      PORT: {
        default: String(config.deploy?.port || 3000),
        description: 'Port to run the server on'
      }
    },
    healthcheck: {
      path: '/health',
      timeout: 3,
      interval: 30
    }
  };
}

export async function generateRailwayJSON(config: X402Config): Promise<string> {
  const railwayConfig = generateRailwayConfig(config);
  return JSON.stringify(railwayConfig, null, 2);
}
```

---

### Task 4.4: Fly.io Config Generator 🪰

**File:** `src/templates/fly.ts`

```typescript
import { X402Config } from '../types/config.js';
import TOML from '@iarna/toml';

export interface FlyConfig {
  app: string;
  primary_region: string;
  build: {
    dockerfile: string;
  };
  env: Record<string, string>;
  http_service: {
    internal_port: number;
    force_https: boolean;
    auto_stop_machines: boolean;
    auto_start_machines: boolean;
    min_machines_running: number;
  };
  services?: Array<{
    protocol: string;
    internal_port: number;
    processes: string[];
    ports: Array<{
      port: number;
      handlers: string[];
    }>;
  }>;
  checks?: Record<string, {
    type: string;
    port: number;
    interval: string;
    timeout: string;
    grace_period: string;
    method: string;
    path: string;
  }>;
  vm?: {
    size: string;
    memory: string;
  };
}

export function generateFlyConfig(config: X402Config, appName: string): FlyConfig {
  return {
    app: appName,
    primary_region: config.deploy?.region || 'iad', // Dulles, VA
    build: {
      dockerfile: 'Dockerfile'
    },
    env: {
      NODE_ENV: 'production',
      X402_NETWORK: config.payment.network,
      X402_FACILITATOR: config.payment.facilitator
    },
    http_service: {
      internal_port: config.deploy?.port || 3000,
      force_https: true,
      auto_stop_machines: true,
      auto_start_machines: true,
      min_machines_running: config.deploy?.scaling?.min || 1
    },
    checks: {
      health: {
        type: 'http',
        port: config.deploy?.port || 3000,
        interval: '30s',
        timeout: '2s',
        grace_period: '5s',
        method: 'GET',
        path: '/health'
      }
    },
    vm: {
      size: 'shared-cpu-1x',
      memory: '256mb'
    }
  };
}

export async function generateFlyTOML(config: X402Config, appName: string): Promise<string> {
  const flyConfig = generateFlyConfig(config, appName);
  return TOML.stringify(flyConfig as any);
}
```

---

### Task 4.5: Vercel Config Generator ▲

**File:** `src/templates/vercel.ts`

```typescript
import { X402Config } from '../types/config.js';

export interface VercelConfig {
  version: 2;
  name: string;
  builds: Array<{
    src: string;
    use: string;
    config?: Record<string, any>;
  }>;
  routes: Array<{
    src: string;
    dest: string;
    methods?: string[];
    headers?: Record<string, string>;
  }>;
  env: Record<string, string>;
  regions?: string[];
}

export function generateVercelConfig(config: X402Config): VercelConfig {
  const isNextJS = config.project.type === 'nextjs';
  const isFastAPI = config.project.type === 'fastapi';

  if (isNextJS) {
    return {
      version: 2,
      name: config.name,
      builds: [
        {
          src: 'package.json',
          use: '@vercel/next'
        }
      ],
      routes: [
        {
          src: '/(.*)',
          dest: '/'
        }
      ],
      env: {
        NODE_ENV: 'production',
        X402_WALLET: config.payment.wallet,
        X402_NETWORK: config.payment.network,
        X402_FACILITATOR: config.payment.facilitator
      }
    };
  }

  if (isFastAPI) {
    return {
      version: 2,
      name: config.name,
      builds: [
        {
          src: config.project.entryPoint || 'app/main.py',
          use: '@vercel/python',
          config: {
            runtime: 'python3.11'
          }
        }
      ],
      routes: [
        {
          src: '/(.*)',
          dest: config.project.entryPoint || 'app/main.py'
        }
      ],
      env: {
        X402_WALLET: config.payment.wallet,
        X402_NETWORK: config.payment.network,
        X402_FACILITATOR: config.payment.facilitator
      }
    };
  }

  // Express/MCP server
  return {
    version: 2,
    name: config.name,
    builds: [
      {
        src: 'dist/index.js',
        use: '@vercel/node'
      }
    ],
    routes: [
      {
        src: '/(.*)',
        dest: 'dist/index.js'
      }
    ],
    env: {
      NODE_ENV: 'production',
      X402_WALLET: config.payment.wallet,
      X402_NETWORK: config.payment.network,
      X402_FACILITATOR: config.payment.facilitator
    }
  };
}

export async function generateVercelJSON(config: X402Config): Promise<string> {
  const vercelConfig = generateVercelConfig(config);
  return JSON.stringify(vercelConfig, null, 2);
}
```

---

### Task 4.6: Wrapper Code Generator 🎁

**File:** `src/templates/wrapper-code.ts`

Generate x402 gateway wrapper code for different frameworks:

```typescript
import { X402Config } from '../types/config.js';

export async function generateWrapperCode(config: X402Config): Promise<string> {
  switch (config.project.type) {
    case 'mcp-server':
      return generateMCPWrapper(config);
    case 'express':
      return generateExpressWrapper(config);
    case 'fastapi':
      return generateFastAPIWrapper(config);
    default:
      throw new Error(`Unsupported project type: ${config.project.type}`);
  }
}

function generateMCPWrapper(config: X402Config): string {
  return `// x402 Gateway Wrapper for MCP Server
// Auto-generated by x402-deploy
// DO NOT EDIT MANUALLY

import { Server } from '@modelcontextprotocol/sdk/server/index.js';
import { StdioServerTransport } from '@modelcontextprotocol/sdk/server/stdio.js';
import { x402Gateway } from '@nirholas/x402-deploy/gateway';
import { loadConfig } from '@nirholas/x402-deploy';

// Load x402 configuration
const config = loadConfig();

// Create x402 gateway
const gateway = x402Gateway({
  wallet: process.env.X402_WALLET || config.payment.wallet,
  network: config.payment.network,
  facilitator: config.payment.facilitator,
  pricing: config.pricing,
  analytics: config.dashboard?.enabled ? {
    enabled: true,
    webhooks: config.dashboard.webhooks || []
  } : undefined
});

// Import original MCP server
const originalServer = await import('./${config.project.entryPoint}');

// Wrap server with payment middleware
const wrappedServer = gateway.wrapMCPServer(originalServer.server);

// Start server
const transport = new StdioServerTransport();
await wrappedServer.connect(transport);

console.log('x402-enabled MCP server running');
console.log('Wallet:', config.payment.wallet);
console.log('Network:', config.payment.network);
`;
}

function generateExpressWrapper(config: X402Config): string {
  return `// x402 Gateway Wrapper for Express API
// Auto-generated by x402-deploy
// DO NOT EDIT MANUALLY

import express from 'express';
import { x402Gateway } from '@nirholas/x402-deploy/gateway';
import { loadConfig } from '@nirholas/x402-deploy';

// Load x402 configuration
const config = loadConfig();

// Create Express app
const app = express();

// Add x402 middleware BEFORE your routes
const gateway = x402Gateway({
  wallet: process.env.X402_WALLET || config.payment.wallet,
  network: config.payment.network,
  facilitator: config.payment.facilitator,
  pricing: config.pricing,
  analytics: config.dashboard?.enabled ? {
    enabled: true,
    webhooks: config.dashboard.webhooks || []
  } : undefined
});

app.use(gateway.expressMiddleware());

// Health check (free endpoint)
app.get('/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// Import and mount original routes
const originalApp = await import('./${config.project.entryPoint}');
app.use(originalApp.default || originalApp.app);

// Start server
const PORT = process.env.PORT || ${config.deploy?.port || 3000};
app.listen(PORT, () => {
  console.log(\`x402-enabled API running on port \${PORT}\`);
  console.log('Wallet:', config.payment.wallet);
  console.log('Network:', config.payment.network);
});

export default app;
`;
}

function generateFastAPIWrapper(config: X402Config): string {
  return `"""
x402 Gateway Wrapper for FastAPI
Auto-generated by x402-deploy
DO NOT EDIT MANUALLY
"""

from fastapi import FastAPI, Request, HTTPException
from fastapi.responses import JSONResponse
import uvicorn
import os
from x402_gateway import X402Gateway, X402Config

# Load x402 configuration
config = X402Config(
    wallet=os.getenv('X402_WALLET', '${config.payment.wallet}'),
    network='${config.payment.network}',
    facilitator='${config.payment.facilitator}',
    pricing=${JSON.stringify(config.pricing, null, 4)}
)

# Create x402 gateway
gateway = X402Gateway(config)

# Import original FastAPI app
from ${config.project.entryPoint.replace('.py', '')} import app as original_app

# Create wrapper app
app = FastAPI(title="${config.name} (x402-enabled)")

# Add x402 middleware
@app.middleware("http")
async def x402_middleware(request: Request, call_next):
    # Skip payment for health check
    if request.url.path == "/health":
        return await call_next(request)
    
    # Verify payment
    payment_valid = await gateway.verify_payment(request)
    if not payment_valid:
        return JSONResponse(
            status_code=402,
            content={
                "error": "Payment Required",
                "wallet": config.wallet,
                "network": config.network,
                "facilitator": config.facilitator
            },
            headers={
                "WWW-Authenticate": f'x402 wallet="{config.wallet}" network="{config.network}"'
            }
        )
    
    # Track analytics
    response = await call_next(request)
    await gateway.track_call(request, response)
    
    return response

# Health check (free)
@app.get("/health")
async def health_check():
    return {"status": "ok", "timestamp": "now"}

# Mount original app
app.mount("/", original_app)

if __name__ == "__main__":
    port = int(os.getenv('PORT', ${config.deploy?.port || 8000}))
    print(f"x402-enabled API running on port {port}")
    print(f"Wallet: {config.wallet}")
    print(f"Network: {config.network}")
    uvicorn.run(app, host="0.0.0.0", port=port)
`;
}
```

---

## Agent 5: Platform Deployers

**Goal:** Implement actual deployment logic for each platform

### Task 5.1: Railway Deployer 🚂

**File:** `src/deployers/railway.ts`

```typescript
import { execa } from 'execa';
import ora from 'ora';
import chalk from 'chalk';
import { X402Config } from '../types/config.js';
import { generateRailwayJSON } from '../templates/railway.js';
import { generateDockerfile } from '../templates/dockerfile.js';
import fs from 'fs/promises';
import path from 'path';

export interface RailwayDeployOptions {
  config: X402Config;
  projectDir: string;
  environment?: 'production' | 'staging';
  dryRun?: boolean;
}

export interface RailwayDeployResult {
  success: boolean;
  url?: string;
  serviceId?: string;
  deploymentId?: string;
  logs?: string[];
  error?: string;
}

export async function deployToRailway(
  options: RailwayDeployOptions
): Promise<RailwayDeployResult> {
  const { config, projectDir, environment = 'production', dryRun = false } = options;
  
  const spinner = ora('Preparing Railway deployment...').start();

  try {
    // 1. Check if Railway CLI is installed
    spinner.text = 'Checking Railway CLI...';
    try {
      await execa('railway', ['--version']);
    } catch {
      spinner.fail('Railway CLI not found');
      throw new Error(
        'Railway CLI is not installed. Install with: npm install -g @railway/cli'
      );
    }

    // 2. Check if logged in
    spinner.text = 'Checking Railway authentication...';
    try {
      await execa('railway', ['whoami']);
    } catch {
      spinner.fail('Not logged in to Railway');
      throw new Error('Please run: railway login');
    }

    // 3. Generate Railway config
    spinner.text = 'Generating Railway configuration...';
    const railwayJSON = await generateRailwayJSON(config);
    await fs.writeFile(
      path.join(projectDir, 'railway.json'),
      railwayJSON
    );

    // 4. Generate Dockerfile if not exists
    const dockerfilePath = path.join(projectDir, 'Dockerfile');
    try {
      await fs.access(dockerfilePath);
      spinner.text = 'Using existing Dockerfile';
    } catch {
      spinner.text = 'Generating Dockerfile...';
      const dockerfile = await generateDockerfile({ config });
      await fs.writeFile(dockerfilePath, dockerfile);
    }

    // 5. Check if project exists, otherwise create
    spinner.text = 'Checking Railway project...';
    let projectCreated = false;
    try {
      await execa('railway', ['status']);
    } catch {
      if (dryRun) {
        spinner.info('Would create new Railway project');
      } else {
        spinner.text = 'Creating Railway project...';
        await execa('railway', ['init', '--name', config.name]);
        projectCreated = true;
      }
    }

    // 6. Set environment variables
    spinner.text = 'Setting environment variables...';
    const envVars = {
      NODE_ENV: environment,
      X402_WALLET: config.payment.wallet,
      X402_NETWORK: config.payment.network,
      X402_FACILITATOR: config.payment.facilitator,
      ...config.deploy?.environment
    };

    if (!dryRun) {
      for (const [key, value] of Object.entries(envVars)) {
        await execa('railway', ['variables', 'set', `${key}=${value}`]);
      }
    } else {
      spinner.info(`Would set ${Object.keys(envVars).length} environment variables`);
    }

    // 7. Deploy!
    if (dryRun) {
      spinner.succeed('Dry run complete - ready to deploy');
      return {
        success: true,
        logs: [
          '✓ Railway CLI installed',
          '✓ Authenticated',
          '✓ Configuration generated',
          `✓ Would deploy ${config.name} to Railway`,
          `✓ Would set ${Object.keys(envVars).length} environment variables`
        ]
      };
    }

    spinner.text = 'Deploying to Railway... (this may take a few minutes)';
    const { stdout } = await execa('railway', ['up', '--detach'], {
      cwd: projectDir
    });

    // 8. Get deployment URL
    spinner.text = 'Getting deployment URL...';
    const { stdout: domainOutput } = await execa('railway', ['domain']);
    const url = domainOutput.trim();

    // 9. Wait for deployment to be ready
    spinner.text = 'Waiting for deployment...';
    await waitForDeployment(url);

    spinner.succeed(chalk.green(`Deployed to Railway: ${url}`));

    return {
      success: true,
      url,
      logs: stdout.split('\n')
    };

  } catch (error) {
    spinner.fail('Railway deployment failed');
    return {
      success: false,
      error: error instanceof Error ? error.message : String(error)
    };
  }
}

async function waitForDeployment(url: string, maxAttempts = 30): Promise<void> {
  for (let i = 0; i < maxAttempts; i++) {
    try {
      const response = await fetch(`${url}/health`, {
        signal: AbortSignal.timeout(5000)
      });
      if (response.ok) return;
    } catch {
      // Still deploying
    }
    await new Promise(resolve => setTimeout(resolve, 2000));
  }
  throw new Error('Deployment health check timed out');
}
```

---

### Task 5.2: Fly.io Deployer 🪰

**File:** `src/deployers/fly.ts`

```typescript
import { execa } from 'execa';
import ora from 'ora';
import chalk from 'chalk';
import { X402Config } from '../types/config.js';
import { generateFlyTOML } from '../templates/fly.js';
import { generateDockerfile } from '../templates/dockerfile.js';
import fs from 'fs/promises';
import path from 'path';

export interface FlyDeployOptions {
  config: X402Config;
  projectDir: string;
  appName?: string;
  region?: string;
  dryRun?: boolean;
}

export interface FlyDeployResult {
  success: boolean;
  url?: string;
  appName?: string;
  region?: string;
  ipAddress?: string;
  error?: string;
}

export async function deployToFly(options: FlyDeployOptions): Promise<FlyDeployResult> {
  const { config, projectDir, appName, region, dryRun = false } = options;
  
  const spinner = ora('Preparing Fly.io deployment...').start();

  try {
    // 1. Check if Fly CLI is installed
    spinner.text = 'Checking Fly CLI...';
    try {
      await execa('flyctl', ['version']);
    } catch {
      spinner.fail('Fly CLI not found');
      throw new Error(
        'Fly CLI is not installed. Install from: https://fly.io/docs/hands-on/install-flyctl/'
      );
    }

    // 2. Check if logged in
    spinner.text = 'Checking Fly authentication...';
    try {
      await execa('flyctl', ['auth', 'whoami']);
    } catch {
      spinner.fail('Not logged in to Fly.io');
      throw new Error('Please run: flyctl auth login');
    }

    // 3. Generate app name if not provided
    const finalAppName = appName || `${config.name}-${Date.now()}`.toLowerCase().replace(/[^a-z0-9-]/g, '-');

    // 4. Generate fly.toml
    spinner.text = 'Generating fly.toml...';
    const flyTOML = await generateFlyTOML(config, finalAppName);
    await fs.writeFile(
      path.join(projectDir, 'fly.toml'),
      flyTOML
    );

    // 5. Generate Dockerfile
    const dockerfilePath = path.join(projectDir, 'Dockerfile');
    try {
      await fs.access(dockerfilePath);
      spinner.text = 'Using existing Dockerfile';
    } catch {
      spinner.text = 'Generating Dockerfile...';
      const dockerfile = await generateDockerfile({ config });
      await fs.writeFile(dockerfilePath, dockerfile);
    }

    // 6. Create app if doesn't exist
    spinner.text = `Creating Fly app: ${finalAppName}...`;
    if (!dryRun) {
      try {
        await execa('flyctl', ['apps', 'create', finalAppName, '--org', 'personal']);
      } catch (error) {
        // App might already exist, that's okay
        if (!String(error).includes('already')) {
          throw error;
        }
      }
    }

    // 7. Set secrets (environment variables)
    spinner.text = 'Setting secrets...';
    const secrets = {
      X402_WALLET: config.payment.wallet,
      X402_NETWORK: config.payment.network,
      X402_FACILITATOR: config.payment.facilitator,
      ...config.deploy?.environment
    };

    if (!dryRun) {
      const secretsArgs = Object.entries(secrets)
        .map(([key, value]) => `${key}=${value}`)
        .join(' ');
      await execa('flyctl', ['secrets', 'set', ...secretsArgs.split(' '), '--app', finalAppName]);
    }

    // 8. Deploy!
    if (dryRun) {
      spinner.succeed('Dry run complete - ready to deploy to Fly.io');
      return {
        success: true,
        appName: finalAppName,
        region: region || config.deploy?.region || 'iad'
      };
    }

    spinner.text = 'Deploying to Fly.io... (building and deploying)';
    await execa('flyctl', ['deploy', '--app', finalAppName, '--remote-only'], {
      cwd: projectDir,
      stdio: 'inherit'
    });

    // 9. Get app info
    spinner.text = 'Getting deployment info...';
    const { stdout: infoOutput } = await execa('flyctl', ['info', '--app', finalAppName, '--json']);
    const info = JSON.parse(infoOutput);

    const url = `https://${info.hostname}`;
    const ipAddress = info.ipAddresses?.v4;

    spinner.succeed(chalk.green(`Deployed to Fly.io: ${url}`));

    return {
      success: true,
      url,
      appName: finalAppName,
      region: info.region,
      ipAddress
    };

  } catch (error) {
    spinner.fail('Fly.io deployment failed');
    return {
      success: false,
      error: error instanceof Error ? error.message : String(error)
    };
  }
}
```

---

### Task 5.3: Vercel Deployer ▲

**File:** `src/deployers/vercel.ts`

```typescript
import { execa } from 'execa';
import ora from 'ora';
import chalk from 'chalk';
import { X402Config } from '../types/config.js';
import { generateVercelJSON } from '../templates/vercel.js';
import fs from 'fs/promises';
import path from 'path';

export interface VercelDeployOptions {
  config: X402Config;
  projectDir: string;
  production?: boolean;
  dryRun?: boolean;
}

export interface VercelDeployResult {
  success: boolean;
  url?: string;
  inspectorUrl?: string;
  error?: string;
}

export async function deployToVercel(
  options: VercelDeployOptions
): Promise<VercelDeployResult> {
  const { config, projectDir, production = true, dryRun = false } = options;
  
  const spinner = ora('Preparing Vercel deployment...').start();

  try {
    // 1. Check if Vercel CLI is installed
    spinner.text = 'Checking Vercel CLI...';
    try {
      await execa('vercel', ['--version']);
    } catch {
      spinner.fail('Vercel CLI not found');
      throw new Error(
        'Vercel CLI is not installed. Install with: npm install -g vercel'
      );
    }

    // 2. Check if logged in
    spinner.text = 'Checking Vercel authentication...';
    try {
      await execa('vercel', ['whoami']);
    } catch {
      spinner.fail('Not logged in to Vercel');
      throw new Error('Please run: vercel login');
    }

    // 3. Generate vercel.json
    spinner.text = 'Generating vercel.json...';
    const vercelJSON = await generateVercelJSON(config);
    await fs.writeFile(
      path.join(projectDir, 'vercel.json'),
      vercelJSON
    );

    // 4. Set environment variables
    spinner.text = 'Setting environment variables...';
    const envVars = {
      X402_WALLET: config.payment.wallet,
      X402_NETWORK: config.payment.network,
      X402_FACILITATOR: config.payment.facilitator,
      ...config.deploy?.environment
    };

    if (!dryRun) {
      for (const [key, value] of Object.entries(envVars)) {
        await execa('vercel', ['env', 'add', key, production ? 'production' : 'preview'], {
          cwd: projectDir,
          input: value
        });
      }
    }

    // 5. Deploy!
    if (dryRun) {
      spinner.succeed('Dry run complete - ready to deploy to Vercel');
      return { success: true };
    }

    spinner.text = `Deploying to Vercel ${production ? '(production)' : '(preview)'}...`;
    const deployArgs = ['--yes'];
    if (production) deployArgs.push('--prod');

    const { stdout } = await execa('vercel', deployArgs, {
      cwd: projectDir
    });

    // Parse URL from output
    const urlMatch = stdout.match(/https:\/\/[^\s]+/);
    const url = urlMatch ? urlMatch[0] : undefined;

    // Get inspector URL
    const inspectorMatch = stdout.match(/Inspect: (https:\/\/[^\s]+)/);
    const inspectorUrl = inspectorMatch ? inspectorMatch[1] : undefined;

    spinner.succeed(chalk.green(`Deployed to Vercel: ${url}`));

    return {
      success: true,
      url,
      inspectorUrl
    };

  } catch (error) {
    spinner.fail('Vercel deployment failed');
    return {
      success: false,
      error: error instanceof Error ? error.message : String(error)
    };
  }
}
```

---

### Task 5.4: Docker Deployer 🐳

**File:** `src/deployers/docker.ts`

```typescript
import { execa } from 'execa';
import ora from 'ora';
import chalk from 'chalk';
import { X402Config } from '../types/config.js';
import { generateDockerfile } from '../templates/dockerfile.js';
import { generateDockerCompose } from '../templates/docker-compose.js';
import fs from 'fs/promises';
import path from 'path';

export interface DockerDeployOptions {
  config: X402Config;
  projectDir: string;
  imageName?: string;
  tag?: string;
  push?: boolean;
  registry?: string;
  compose?: boolean;
  dryRun?: boolean;
}

export interface DockerDeployResult {
  success: boolean;
  imageId?: string;
  imageName?: string;
  containerId?: string;
  ports?: string[];
  error?: string;
}

export async function deployWithDocker(
  options: DockerDeployOptions
): Promise<DockerDeployResult> {
  const {
    config,
    projectDir,
    imageName = config.name,
    tag = 'latest',
    push = false,
    registry,
    compose = false,
    dryRun = false
  } = options;
  
  const spinner = ora('Preparing Docker deployment...').start();

  try {
    // 1. Check if Docker is installed and running
    spinner.text = 'Checking Docker...';
    try {
      await execa('docker', ['version']);
      await execa('docker', ['ps']); // Check if daemon is running
    } catch {
      spinner.fail('Docker not found or not running');
      throw new Error(
        'Docker is not installed or not running. Install from: https://www.docker.com/get-started'
      );
    }

    const fullImageName = registry ? `${registry}/${imageName}:${tag}` : `${imageName}:${tag}`;

    // 2. Generate Dockerfile
    const dockerfilePath = path.join(projectDir, 'Dockerfile');
    spinner.text = 'Generating Dockerfile...';
    const dockerfile = await generateDockerfile({ config });
    await fs.writeFile(dockerfilePath, dockerfile);

    // 3. Generate docker-compose.yml if requested
    if (compose) {
      spinner.text = 'Generating docker-compose.yml...';
      const dockerCompose = await generateDockerCompose({
        config,
        includeDatabase: true,
        includeRedis: true
      });
      await fs.writeFile(
        path.join(projectDir, 'docker-compose.yml'),
        dockerCompose
      );
    }

    if (dryRun) {
      spinner.succeed('Dry run complete - ready to build Docker image');
      return {
        success: true,
        imageName: fullImageName
      };
    }

    // 4. Build image
    spinner.text = `Building Docker image: ${fullImageName}...`;
    const { stdout: buildOutput } = await execa(
      'docker',
      ['build', '-t', fullImageName, '.'],
      { cwd: projectDir }
    );

    // Extract image ID
    const imageIdMatch = buildOutput.match(/Successfully built ([a-f0-9]+)/);
    const imageId = imageIdMatch ? imageIdMatch[1] : undefined;

    spinner.text = `Built image: ${fullImageName} (${imageId})`;

    // 5. Push to registry if requested
    if (push && registry) {
      spinner.text = `Pushing to ${registry}...`;
      await execa('docker', ['push', fullImageName]);
      spinner.text = `Pushed to ${registry}`;
    }

    // 6. Run container (or docker-compose)
    if (compose) {
      spinner.text = 'Starting services with docker-compose...';
      await execa('docker-compose', ['up', '-d'], { cwd: projectDir });
      
      const { stdout: psOutput } = await execa('docker-compose', ['ps', '--format', 'json'], {
        cwd: projectDir
      });
      
      spinner.succeed(chalk.green('Docker Compose services started'));
      return {
        success: true,
        imageId,
        imageName: fullImageName
      };
    } else {
      spinner.text = 'Starting container...';
      const { stdout: runOutput } = await execa('docker', [
        'run',
        '-d',
        '-p', `${config.deploy?.port || 3000}:${config.deploy?.port || 3000}`,
        '-e', `X402_WALLET=${config.payment.wallet}`,
        '-e', `X402_NETWORK=${config.payment.network}`,
        '-e', `X402_FACILITATOR=${config.payment.facilitator}`,
        '--name', `${imageName}-${tag}`,
        fullImageName
      ]);

      const containerId = runOutput.trim();

      spinner.succeed(chalk.green(`Container started: ${containerId.slice(0, 12)}`));
      
      return {
        success: true,
        imageId,
        imageName: fullImageName,
        containerId,
        ports: [`${config.deploy?.port || 3000}:${config.deploy?.port || 3000}`]
      };
    }

  } catch (error) {
    spinner.fail('Docker deployment failed');
    return {
      success: false,
      error: error instanceof Error ? error.message : String(error)
    };
  }
}
```

---

### Task 5.5: Deployment Manager

**File:** `src/deployers/index.ts`

Main entry point that routes to the correct deployer:

```typescript
import { X402Config } from '../types/config.js';
import { deployToRailway, RailwayDeployResult } from './railway.js';
import { deployToFly, FlyDeployResult } from './fly.js';
import { deployToVercel, VercelDeployResult } from './vercel.js';
import { deployWithDocker, DockerDeployResult } from './docker.js';

export type DeployProvider = 'railway' | 'fly' | 'vercel' | 'docker';

export type DeployResult = 
  | RailwayDeployResult 
  | FlyDeployResult 
  | VercelDeployResult 
  | DockerDeployResult;

export interface DeployOptions {
  config: X402Config;
  projectDir: string;
  provider?: DeployProvider;
  dryRun?: boolean;
  [key: string]: any;
}

export async function deploy(options: DeployOptions): Promise<DeployResult> {
  const { config, provider = config.deploy?.provider || 'railway' } = options;

  switch (provider) {
    case 'railway':
      return deployToRailway(options);
    case 'fly':
      return deployToFly(options);
    case 'vercel':
      return deployToVercel(options);
    case 'docker':
      return deployWithDocker(options);
    default:
      throw new Error(`Unsupported deployment provider: ${provider}`);
  }
}

export * from './railway.js';
export * from './fly.js';
export * from './vercel.js';
export * from './docker.js';
```

---

## Integration

Update the CLI deploy command to use these deployers:

**File:** `src/cli/commands/deploy.ts` (add at the top)

```typescript
import { deploy } from '../../deployers/index.js';
```

**And replace the deployment logic with:**

```typescript
const result = await deploy({
  config,
  projectDir: process.cwd(),
  provider: options.provider,
  dryRun: options.dryRun
});

if (result.success) {
  console.log(chalk.green('\n🎉 Deployment successful!\n'));
  if (result.url) {
    console.log(`🌍 URL: ${chalk.cyan(result.url)}`);
  }
} else {
  console.log(chalk.red('\n❌ Deployment failed\n'));
  console.log(result.error);
  process.exit(1);
}
```

---

## Testing

Create comprehensive tests for templates and deployers:

```typescript
// tests/templates.test.ts
import { describe, it, expect } from 'vitest';
import { generateDockerfile } from '../src/templates/dockerfile.js';
import { generateDockerCompose } from '../src/templates/docker-compose.js';
import { generateRailwayJSON } from '../src/templates/railway.js';

describe('Template Generation', () => {
  const mockConfig = {
    name: 'test-api',
    project: { type: 'mcp-server', entryPoint: 'src/index.ts' },
    payment: {
      wallet: '0x123',
      network: 'eip155:8453',
      facilitator: 'https://x402.org/facilitator'
    },
    deploy: { port: 3000 }
  } as any;

  it('generates MCP Dockerfile', async () => {
    const dockerfile = await generateDockerfile({ config: mockConfig });
    expect(dockerfile).toContain('FROM node:20-alpine');
    expect(dockerfile).toContain('x402-gateway');
    expect(dockerfile).toContain('EXPOSE 3000');
  });

  it('generates docker-compose with postgres', async () => {
    const compose = await generateDockerCompose({
      config: mockConfig,
      includeDatabase: true
    });
    expect(compose).toContain('postgres:16-alpine');
    expect(compose).toContain('DATABASE_URL');
  });

  it('generates Railway config', async () => {
    const railway = await generateRailwayJSON(mockConfig);
    const config = JSON.parse(railway);
    expect(config.envs.X402_WALLET).toBeDefined();
    expect(config.healthcheck.path).toBe('/health');
  });
});

// tests/deployers.test.ts
describe('Deployers', () => {
  it('Railway dry-run succeeds', async () => {
    const result = await deployToRailway({ 
      config: mockConfig, 
      projectDir: '/tmp/test', 
      dryRun: true 
    });
    expect(result.success).toBe(true);
  });

  it('Fly dry-run succeeds', async () => {
    const result = await deployToFly({ 
      config: mockConfig, 
      projectDir: '/tmp/test', 
      dryRun: true 
    });
    expect(result.success).toBe(true);
  });
});
```

---

## Success Criteria

**Agent 4 (Templates) Complete When:**
- ✅ Dockerfiles generate for all project types
- ✅ Docker Compose includes postgres, redis, prometheus
- ✅ Railway/Fly/Vercel configs are valid
- ✅ Wrapper code runs original apps unchanged
- ✅ All templates include x402 gateway integration

**Agent 5 (Deployers) Complete When:**
- ✅ Railway deployer works end-to-end
- ✅ Fly.io deployer works end-to-end
- ✅ Vercel deployer works end-to-end
- ✅ Docker deployer builds and runs containers
- ✅ All deployers handle errors gracefully
- ✅ Dry-run mode works for all platforms
- ✅ Health checks validate deployments

---

## Notes for Agents

- **Use spinners** (ora) for long operations
- **Beautiful error messages** with actionable fixes
- **Dry-run mode** for everything - let users preview
- **Health checks** - ensure deployments actually work
- **Graceful degradation** - missing Dockerfile? Generate it
- **CLI installation checks** - helpful error messages with install commands

Done! 🚀
