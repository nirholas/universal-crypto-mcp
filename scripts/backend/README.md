# Backend Automation System

A powerful, modular bash script automation system for backend development, designed to work seamlessly with Next.js, React, TanStack Query, and Wagmi frontends.

## 🚀 Quick Start

```bash
# Initialize the automation system
./backend-automation.sh init

# Create a new Express.js API
./backend-automation.sh create express my-api 3001

# Start development
./backend-automation.sh dev my-api
```

## 📋 Available Commands

### Main Commands

| Command | Description |
|---------|-------------|
| `init` | Initialize the automation system |
| `create <framework> <name> [port]` | Create a new backend service |
| `dev <name>` | Start development server |
| `build <name>` | Build the service |
| `test <name>` | Run tests |
| `deploy <name> <env>` | Deploy to environment |
| `status` | Show status of all services |

### Generator Commands

| Command | Description |
|---------|-------------|
| `generate:docker` | Generate Docker Compose configuration |
| `generate:k8s` | Generate Kubernetes manifests |
| `generate:prisma` | Generate Prisma ORM schema |
| `generate:drizzle` | Generate Drizzle ORM schema |
| `generate:tests` | Generate test setup |

## 🔧 Supported Frameworks

### 1. Express.js (Port 3001)
Classic, robust Node.js framework with extensive middleware ecosystem.

```bash
./backend-automation.sh create express express-api 3001
```

**Features:**
- Full middleware stack (helmet, cors, compression, morgan)
- Rate limiting
- JWT authentication
- Zod validation
- Structured logging with Pino

### 2. Fastify (Port 3002)
Fast, low-overhead framework with built-in schema validation.

```bash
./backend-automation.sh create fastify fastify-api 3002
```

**Features:**
- ~2x faster than Express
- Built-in Swagger/OpenAPI
- WebSocket support
- Schema-based validation
- JWT plugin

### 3. Hono (Port 3003)
Ultra-fast, edge-ready framework for serverless deployments.

```bash
./backend-automation.sh create hono hono-api 3003
```

**Features:**
- ~3x faster than Express
- Cloudflare Workers / Vercel Edge compatible
- Tiny bundle size
- Built-in middleware
- TypeScript-first

### 4. tRPC (Port 3004)
End-to-end type-safe APIs with TanStack Query integration.

```bash
./backend-automation.sh create trpc trpc-api 3004
```

**Features:**
- Full type safety from backend to frontend
- Works with TanStack Query (React Query)
- SuperJSON for serialization
- Protected procedures
- Automatic client generation

### 5. GraphQL (Port 3005)
Apollo Server with full query/mutation/subscription support.

```bash
./backend-automation.sh create graphql graphql-api 3005
```

**Features:**
- Apollo Server 4
- GraphQL Scalars (DateTime, BigInt)
- DataLoader for batching
- Relay-style pagination
- Subscription support

## 🛠 Service Templates

Additional service templates for microservices architecture:

```bash
# Source the templates
source ./service-templates.sh

# Or run directly
./service-templates.sh websocket ws-service 3010
./service-templates.sh queue queue-worker
./service-templates.sh scheduler scheduler-service
./service-templates.sh gateway api-gateway 3000
```

### WebSocket Service (Port 3010)
Real-time bidirectional communication.

- Channel-based subscriptions
- Heartbeat & connection management
- Broadcast support
- Health monitoring

### Queue Worker
Background job processing with BullMQ.

- Transaction queue
- Notification queue
- Price update queue
- Retry & backoff strategies

### Scheduler Service (Port 3020)
Cron-based task scheduling.

- Price sync (every minute)
- Session cleanup (hourly)
- Daily reports
- Database backups
- Job management API

### API Gateway (Port 3000)
Request routing and authentication.

- Service discovery
- Rate limiting per service
- JWT authentication
- Request proxying
- Health aggregation

## 💾 Database Setup

### Prisma ORM

```bash
./backend-automation.sh generate:prisma database

# Run migrations
cd packages/database
pnpm prisma migrate dev

# Seed database
pnpm prisma db seed

# Open Prisma Studio
pnpm prisma studio
```

### Drizzle ORM

```bash
./backend-automation.sh generate:drizzle database

# Generate migrations
cd packages/database
pnpm drizzle-kit generate:pg

# Push schema
pnpm drizzle-kit push:pg
```

## 🐳 Docker & Kubernetes

### Docker Compose

```bash
# Generate development compose file
./backend-automation.sh generate:docker dev

# Start services
docker compose -f deploy/docker-compose.dev.yml up -d

# Start with monitoring
docker compose -f deploy/docker-compose.dev.yml --profile monitoring up -d
```

**Included Services:**
- PostgreSQL 16
- Redis 7
- RabbitMQ (message queue)
- Prometheus (metrics)
- Grafana (dashboards)
- Alertmanager

### Kubernetes

```bash
# Generate K8s manifests
./backend-automation.sh generate:k8s crypto-mcp

# Deploy to staging
kubectl apply -k deploy/k8s/overlays/staging

# Deploy to production
./backend-automation.sh deploy api production
```

## 🧪 Testing

```bash
# Generate test setup
./backend-automation.sh generate:tests my-api

# Run tests
./backend-automation.sh test my-api

# Or use quick commands
source ./quick-commands.sh
test-all  # Test all services
```

## ⚡ Quick Commands

Source the quick commands for shortcuts:

```bash
source ./quick-commands.sh

# Create services
create-express my-api
create-fastify fast-api
create-trpc type-safe-api

# Manage services
start-all
stop-all
build-all
test-all

# Docker shortcuts
docker-up dev
docker-down
docker-logs

# Database shortcuts
db-migrate
db-seed
db-studio

# Monitoring
health-check
benchmark http://localhost:3001/health
```

## 🔌 Frontend Integration

### With Next.js + tRPC + TanStack Query

```typescript
// packages/trpc-api/src/client.ts
import { createTRPCProxyClient, httpBatchLink } from '@trpc/client';
import type { AppRouter } from './routers';

export const trpc = createTRPCProxyClient<AppRouter>({
  links: [
    httpBatchLink({
      url: 'http://localhost:3004/trpc',
    }),
  ],
});
```

```typescript
// In your Next.js app
import { trpc } from '@/lib/trpc';

// Type-safe API calls
const price = await trpc.getPrice.query({ symbol: 'BTC' });
```

### With TanStack Query

```typescript
// Using tRPC with React Query
import { useQuery, useMutation } from '@tanstack/react-query';
import { trpc } from '@/lib/trpc';

function CryptoPrice({ symbol }: { symbol: string }) {
  const { data, isLoading } = useQuery({
    queryKey: ['price', symbol],
    queryFn: () => trpc.getPrice.query({ symbol }),
    refetchInterval: 5000,
  });

  if (isLoading) return <div>Loading...</div>;
  return <div>{data?.symbol}: ${data?.price}</div>;
}
```

### With Wagmi

```typescript
// Combining Wagmi wallet with backend API
import { useAccount } from 'wagmi';
import { useQuery } from '@tanstack/react-query';

function WalletBalance() {
  const { address } = useAccount();
  
  const { data } = useQuery({
    queryKey: ['wallet', address],
    queryFn: () => fetch(`/api/v1/wallet/${address}`).then(r => r.json()),
    enabled: !!address,
  });

  return <div>Portfolio: ${data?.totalValue}</div>;
}
```

## 📊 Monitoring

### Prometheus Metrics

All services expose metrics at `/metrics`:

```yaml
# prometheus.yml
scrape_configs:
  - job_name: 'api'
    static_configs:
      - targets: ['api:3001']
```

### Health Checks

```bash
# Check all services
./quick-commands.sh health-check

# Or via API Gateway
curl http://localhost:3000/health
```

### Logging

```bash
# View logs
./quick-commands.sh show-logs

# Or use Docker
docker compose logs -f api
```

## 🏗 Project Structure

```
packages/
├── api-gateway/          # API Gateway (port 3000)
├── express-api/          # Express.js API (port 3001)
├── fastify-api/          # Fastify API (port 3002)
├── hono-api/             # Hono API (port 3003)
├── trpc-api/             # tRPC API (port 3004)
├── graphql-api/          # GraphQL API (port 3005)
├── websocket-service/    # WebSocket server (port 3010)
├── scheduler/            # Scheduler service (port 3020)
├── queue-worker/         # Background job workers
└── database/             # Database schemas & migrations
```

## 🔐 Environment Variables

```bash
# Copy example env
cp .env.example .env

# Required variables
NODE_ENV=development
PORT=3001
DATABASE_URL=postgresql://postgres:postgres@localhost:5432/crypto_mcp
REDIS_URL=redis://localhost:6379
JWT_SECRET=your-super-secret-key

# Optional
CORS_ORIGIN=http://localhost:3000
LOG_LEVEL=info
```

## 📚 Best Practices

1. **Use tRPC** for type-safe API when using React/Next.js frontend
2. **Use Hono** for edge deployments (Vercel Edge, Cloudflare Workers)
3. **Use GraphQL** for complex queries with multiple data sources
4. **Use Express/Fastify** for traditional REST APIs
5. **Always run migrations** before deploying
6. **Use the API Gateway** for production microservices

## 🆘 Troubleshooting

```bash
# Check service status
./backend-automation.sh status

# Check ports
lsof -i :3001

# View logs
tail -f logs/backend-automation.log

# Clean and rebuild
./quick-commands.sh clean-all
./quick-commands.sh build-all
```

## 📄 License

MIT
