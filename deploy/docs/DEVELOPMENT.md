# Development Guide

Local development setup and contribution guidelines for the Universal Crypto MCP Gateway.

## Prerequisites

- **Node.js** 20+ (LTS)
- **pnpm** 8+
- **Git**
- **Redis** (optional, for rate limiting testing)
- **Docker** (optional, for containerized development)

## Initial Setup

### 1. Clone Repository

```bash
git clone https://github.com/nirholas/universal-crypto-mcp.git
cd universal-crypto-mcp/deploy
```

### 2. Install Dependencies

```bash
pnpm install
```

### 3. Environment Configuration

```bash
# Copy example environment file
cp .env.example .env

# Edit with your values
nano .env
```

**Minimal .env for development:**

```bash
NODE_ENV=development
PORT=3000
LOG_LEVEL=debug

# x402 (use test wallet for development)
X402_WALLET_ADDRESS=0xYourTestWallet
X402_NETWORK=base
X402_TOKEN=USDC

# Redis (optional)
REDIS_ENABLED=false

# API Keys (get free tier keys)
COINGECKO_API_KEY=demo-key
```

### 4. Build MCP Servers

```bash
# Build all MCP servers
cd ..
pnpm build:servers

# Or build individual servers
cd packages/market-data/coingecko-pro-mcp
pnpm build
```

## Running the Gateway

### Development Mode (Hot Reload)

```bash
pnpm dev
```

This uses `tsx watch` for automatic reloading on file changes.

### Production Mode (Local)

```bash
# Build
pnpm build

# Start
pnpm start
```

### Docker Development

```bash
# Build image
docker build -t ucm-gateway:dev -f Dockerfile.dev .

# Run with hot reload
docker-compose -f docker-compose.dev.yml up
```

## Project Structure

```
deploy/
├── src/
│   ├── gateway/              # Main gateway code
│   │   ├── index.ts         # Gateway entry point
│   │   ├── config.ts        # Configuration loader
│   │   ├── endpoints.ts     # Route registry
│   │   ├── mcp-manager.ts   # MCP server manager
│   │   ├── mcp-servers.config.ts  # Server configs
│   │   ├── x402-gateway.ts  # Payment verification
│   │   ├── rate-limiter.ts  # Rate limiting
│   │   ├── metrics.ts       # Prometheus metrics
│   │   ├── health.ts        # Health checks
│   │   ├── logger.ts        # Logging utilities
│   │   └── logging.ts       # Request/error logging
│   ├── server.ts            # Legacy server (deprecated)
│   └── tools/               # Tool utilities
├── docs/                    # Documentation
├── k8s/                     # Kubernetes manifests
├── tests/                   # Test files
├── package.json
├── tsconfig.json
├── Dockerfile
└── README.md
```

## Development Workflow

### 1. Create Feature Branch

```bash
git checkout -b feature/your-feature-name
```

### 2. Make Changes

Edit files in `src/gateway/` or add new MCP server integrations.

### 3. Test Locally

```bash
# Start gateway
pnpm dev

# In another terminal, test endpoints
curl http://localhost:3000/health
curl http://localhost:3000/api
curl http://localhost:3000/api/v1/prices/BTC
```

### 4. Run Tests

```bash
# Unit tests
pnpm test

# E2E tests
pnpm test:e2e

# Coverage
pnpm test:coverage
```

### 5. Lint & Format

```bash
# Lint
pnpm lint

# Fix lint issues
pnpm lint:fix

# Format
pnpm format

# Check formatting
pnpm format:check
```

### 6. Commit Changes

```bash
git add .
git commit -m "feat: add new feature"
```

**Commit Convention:**
- `feat:` New feature
- `fix:` Bug fix
- `docs:` Documentation
- `refactor:` Code refactoring
- `test:` Tests
- `chore:` Build/tooling

### 7. Push & Create PR

```bash
git push origin feature/your-feature-name
```

Then create a Pull Request on GitHub.

## Adding a New MCP Server

### 1. Create Server Config

Edit `src/gateway/mcp-servers.config.ts`:

```typescript
export const MCP_SERVERS: MCPServerConfig[] = [
  // ... existing servers
  {
    id: 'my-new-server',
    name: 'My New Server',
    category: 'market-data',
    command: 'node',
    args: ['dist/index.js'],
    cwd: path.join(WORKSPACE_ROOT, 'packages/market-data/my-new-server-mcp'),
    autoRestart: true,
  },
];
```

### 2. Create MCP Server Package

```bash
cd ../packages/market-data
mkdir my-new-server-mcp
cd my-new-server-mcp

# Initialize package
pnpm init
```

**package.json:**

```json
{
  "name": "@universal-crypto-mcp/my-new-server-mcp",
  "version": "1.0.0",
  "type": "module",
  "main": "dist/index.js",
  "scripts": {
    "build": "tsc",
    "dev": "tsx watch src/index.ts"
  },
  "dependencies": {
    "@modelcontextprotocol/sdk": "^1.0.4"
  },
  "devDependencies": {
    "typescript": "^5.7.2",
    "tsx": "^4.21.0"
  }
}
```

**src/index.ts:**

```typescript
#!/usr/bin/env node
import { Server } from '@modelcontextprotocol/sdk/server/index.js';
import { StdioServerTransport } from '@modelcontextprotocol/sdk/server/stdio.js';

const server = new Server({
  name: 'my-new-server',
  version: '1.0.0',
}, {
  capabilities: {
    tools: {},
  },
});

// Register tools
server.setRequestHandler('tools/list', async () => {
  return {
    tools: [
      {
        name: 'getData',
        description: 'Get data from API',
        inputSchema: {
          type: 'object',
          properties: {
            symbol: { type: 'string' }
          },
          required: ['symbol']
        }
      }
    ]
  };
});

server.setRequestHandler('tools/call', async (request) => {
  const { name, arguments: args } = request.params;
  
  if (name === 'getData') {
    const data = await fetchData(args.symbol);
    return {
      content: [{ type: 'text', text: JSON.stringify(data) }]
    };
  }
  
  throw new Error(`Unknown tool: ${name}`);
});

async function fetchData(symbol: string) {
  // Implement API call
  return { symbol, price: 100 };
}

// Start server
async function main() {
  const transport = new StdioServerTransport();
  await server.connect(transport);
  console.error('My New Server MCP running on stdio');
}

main();
```

### 3. Add Endpoint

Edit `src/gateway/endpoints.ts`:

```typescript
this.register({
  id: 'my-new-server.getData',
  name: 'Get Data',
  description: 'Get data from my new server',
  category: 'market-data',
  path: '/api/v1/my-server/data/:symbol',
  methods: ['GET'],
  pricing: { free: false, priceUsd: '0.001', token: 'USDC', network: 'base' },
  rateLimit: { free: 5, paid: 1000 },
});
```

### 4. Test

```bash
# Build server
cd packages/market-data/my-new-server-mcp
pnpm build

# Start gateway
cd ../../../deploy
pnpm dev

# Test endpoint
curl http://localhost:3000/api/v1/my-server/data/BTC
```

## Testing

### Unit Tests

```typescript
// tests/mcp-manager.test.ts
import { describe, it, expect } from 'vitest';
import { MCPManager } from '../src/gateway/mcp-manager';

describe('MCPManager', () => {
  it('should register servers', () => {
    const manager = new MCPManager(logger);
    manager.registerServer({
      id: 'test',
      name: 'Test Server',
      category: 'test',
      command: 'node',
      args: ['test.js'],
    });
    
    expect(manager.getServerInfo('test')).toBeDefined();
  });
});
```

Run:

```bash
pnpm test
```

### E2E Tests

```typescript
// tests/e2e/api.test.ts
import { describe, it, expect, beforeAll, afterAll } from 'vitest';
import fetch from 'node-fetch';

let serverProcess;

beforeAll(async () => {
  // Start server
  serverProcess = spawn('pnpm', ['start']);
  await new Promise(resolve => setTimeout(resolve, 5000));
});

afterAll(async () => {
  serverProcess.kill();
});

describe('API Endpoints', () => {
  it('should return health status', async () => {
    const res = await fetch('http://localhost:3000/health');
    expect(res.status).toBe(200);
    
    const data = await res.json();
    expect(data.status).toBe('healthy');
  });

  it('should return price data', async () => {
    const res = await fetch('http://localhost:3000/api/v1/prices/BTC');
    expect(res.status).toBe(200);
    
    const data = await res.json();
    expect(data.data.symbol).toBe('BTC');
  });
});
```

Run:

```bash
pnpm test:e2e
```

## Debugging

### VS Code Launch Configuration

Create `.vscode/launch.json`:

```json
{
  "version": "0.2.0",
  "configurations": [
    {
      "type": "node",
      "request": "launch",
      "name": "Debug Gateway",
      "runtimeExecutable": "pnpm",
      "runtimeArgs": ["dev"],
      "cwd": "${workspaceFolder}/deploy",
      "console": "integratedTerminal",
      "env": {
        "NODE_ENV": "development",
        "LOG_LEVEL": "debug"
      }
    }
  ]
}
```

### Logging

```typescript
// Enable debug logging
import { logger } from './logger';

logger.debug('Debug message', { key: 'value' });
logger.info('Info message');
logger.warn('Warning message');
logger.error('Error message', error);
```

### Inspecting MCP Communication

```bash
# Enable MCP debug logging
DEBUG=mcp:* pnpm dev
```

## Performance Profiling

### CPU Profiling

```bash
node --prof dist/gateway/index.js
node --prof-process isolate-*.log > processed.txt
```

### Memory Profiling

```bash
node --inspect dist/gateway/index.js
```

Then open Chrome DevTools at `chrome://inspect`.

### Load Testing

```bash
# Install k6
brew install k6  # macOS
# or
sudo apt install k6  # Ubuntu

# Run load test
k6 run tests/load/api.js
```

**tests/load/api.js:**

```javascript
import http from 'k6/http';
import { check } from 'k6';

export let options = {
  vus: 100,
  duration: '30s',
};

export default function() {
  let res = http.get('http://localhost:3000/api/v1/prices/BTC');
  check(res, {
    'status is 200': (r) => r.status === 200,
    'response time < 500ms': (r) => r.timings.duration < 500,
  });
}
```

## Common Issues

### MCP Server Won't Start

**Problem:** Server fails to spawn

**Solution:**
1. Check if dist folder exists: `ls packages/xxx/dist`
2. Build server: `pnpm build`
3. Check permissions: `chmod +x dist/index.js`
4. Review logs: `tail -f logs/gateway.log`

### Port Already in Use

**Problem:** `Error: listen EADDRINUSE: address already in use :::3000`

**Solution:**
```bash
# Find process using port 3000
lsof -i :3000

# Kill process
kill -9 <PID>

# Or use different port
PORT=3001 pnpm dev
```

### Redis Connection Failed

**Problem:** `Error: Redis connection failed`

**Solution:**
```bash
# Disable Redis in development
REDIS_ENABLED=false pnpm dev

# Or start Redis
docker run -d -p 6379:6379 redis:7-alpine
```

## Code Style

### TypeScript Guidelines

- Use strict mode
- Prefer `const` over `let`
- Use async/await over callbacks
- Type everything (avoid `any`)
- Use interfaces for objects

### Naming Conventions

- **Files:** kebab-case (`mcp-manager.ts`)
- **Classes:** PascalCase (`MCPManager`)
- **Functions:** camelCase (`startServer`)
- **Constants:** UPPER_SNAKE_CASE (`MAX_RETRIES`)

### Example

```typescript
// Good
export class MCPManager {
  private servers: Map<string, MCPServerInstance>;
  
  async startServer(id: string): Promise<void> {
    const server = this.servers.get(id);
    if (!server) {
      throw new Error(`Server ${id} not found`);
    }
    await server.start();
  }
}

// Bad
export class mcpmanager {
  servers: any;
  
  startServer(id) {
    var server = this.servers.get(id);
    if (server == null) return;
    server.start();
  }
}
```

## Resources

- [MCP Documentation](https://modelcontextprotocol.io)
- [x402 Protocol](https://x402.ai)
- [TypeScript Handbook](https://www.typescriptlang.org/docs/)
- [Express.js Guide](https://expressjs.com/)
- [Vitest Docs](https://vitest.dev/)

## Getting Help

- **Discord:** https://discord.gg/universal-crypto
- **GitHub Issues:** https://github.com/nirholas/universal-crypto-mcp/issues
- **Email:** dev@universal-crypto-mcp.com

