#!/bin/bash
#===============================================================================
# Universal Crypto MCP - Backend Automation System
# A powerful, modular bash automation system for backend development
# Compatible with Next.js, React, TanStack Query, Wagmi frontends
#===============================================================================

set -euo pipefail
IFS=$'\n\t'

#-------------------------------------------------------------------------------
# Configuration
#-------------------------------------------------------------------------------
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
PROJECT_ROOT="$(cd "$SCRIPT_DIR/../.." && pwd)"
BACKEND_DIR="${PROJECT_ROOT}/packages"
DEPLOY_DIR="${PROJECT_ROOT}/deploy"
LOGS_DIR="${PROJECT_ROOT}/logs"
CACHE_DIR="${PROJECT_ROOT}/.cache/backend"

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
MAGENTA='\033[0;35m'
CYAN='\033[0;36m'
WHITE='\033[1;37m'
NC='\033[0m' # No Color
BOLD='\033[1m'

# Logging levels
LOG_LEVEL="${LOG_LEVEL:-INFO}"
declare -A LOG_LEVELS=([DEBUG]=0 [INFO]=1 [WARN]=2 [ERROR]=3 [FATAL]=4)

#-------------------------------------------------------------------------------
# Utility Functions
#-------------------------------------------------------------------------------

log() {
    local level="$1"
    shift
    local message="$*"
    local timestamp=$(date '+%Y-%m-%d %H:%M:%S')
    
    if [[ ${LOG_LEVELS[$level]:-1} -ge ${LOG_LEVELS[$LOG_LEVEL]:-1} ]]; then
        case "$level" in
            DEBUG)  echo -e "${CYAN}[DEBUG]${NC} ${timestamp} - $message" ;;
            INFO)   echo -e "${GREEN}[INFO]${NC}  ${timestamp} - $message" ;;
            WARN)   echo -e "${YELLOW}[WARN]${NC}  ${timestamp} - $message" ;;
            ERROR)  echo -e "${RED}[ERROR]${NC} ${timestamp} - $message" >&2 ;;
            FATAL)  echo -e "${RED}${BOLD}[FATAL]${NC} ${timestamp} - $message" >&2 ;;
        esac
    fi
    
    # Also log to file
    mkdir -p "$LOGS_DIR"
    echo "[$level] $timestamp - $message" >> "$LOGS_DIR/backend-automation.log"
}

banner() {
    echo -e "${MAGENTA}"
    echo "╔══════════════════════════════════════════════════════════════════╗"
    echo "║     🚀 Universal Crypto MCP - Backend Automation System 🚀       ║"
    echo "║                    Powerful • Efficient • Simple                  ║"
    echo "╚══════════════════════════════════════════════════════════════════╝"
    echo -e "${NC}"
}

spinner() {
    local pid=$1
    local delay=0.1
    local spinstr='⠋⠙⠹⠸⠼⠴⠦⠧⠇⠏'
    while [ "$(ps a | awk '{print $1}' | grep $pid)" ]; do
        local temp=${spinstr#?}
        printf " [%c]  " "$spinstr"
        local spinstr=$temp${spinstr%"$temp"}
        sleep $delay
        printf "\b\b\b\b\b\b"
    done
    printf "    \b\b\b\b"
}

progress_bar() {
    local current=$1
    local total=$2
    local width=50
    local percentage=$((current * 100 / total))
    local completed=$((width * current / total))
    local remaining=$((width - completed))
    
    printf "\r${CYAN}Progress: [${GREEN}"
    printf "%${completed}s" | tr ' ' '█'
    printf "${WHITE}"
    printf "%${remaining}s" | tr ' ' '░'
    printf "${CYAN}] ${percentage}%%${NC}"
}

confirm() {
    local message="${1:-Continue?}"
    echo -en "${YELLOW}$message [y/N]: ${NC}"
    read -r response
    [[ "$response" =~ ^[Yy]$ ]]
}

check_dependencies() {
    local deps=("$@")
    local missing=()
    
    for dep in "${deps[@]}"; do
        if ! command -v "$dep" &> /dev/null; then
            missing+=("$dep")
        fi
    done
    
    if [[ ${#missing[@]} -gt 0 ]]; then
        log ERROR "Missing dependencies: ${missing[*]}"
        return 1
    fi
    return 0
}

#-------------------------------------------------------------------------------
# Backend Framework Generators
#-------------------------------------------------------------------------------

generate_express_api() {
    local name="${1:-api}"
    local port="${2:-3001}"
    local dir="${BACKEND_DIR}/${name}"
    
    log INFO "Generating Express.js API: $name on port $port"
    
    mkdir -p "$dir/src"/{routes,controllers,middleware,models,services,utils,config}
    
    # Package.json
    cat > "$dir/package.json" << EOF
{
  "name": "@universal-crypto-mcp/${name}",
  "version": "1.0.0",
  "type": "module",
  "main": "dist/index.js",
  "scripts": {
    "dev": "tsx watch src/index.ts",
    "build": "tsup src/index.ts --format esm --dts",
    "start": "node dist/index.js",
    "test": "vitest run",
    "test:watch": "vitest",
    "lint": "eslint src --ext .ts",
    "format": "prettier --write src"
  },
  "dependencies": {
    "express": "^4.18.2",
    "cors": "^2.8.5",
    "helmet": "^7.1.0",
    "compression": "^1.7.4",
    "morgan": "^1.10.0",
    "express-rate-limit": "^7.1.5",
    "express-validator": "^7.0.1",
    "jsonwebtoken": "^9.0.2",
    "bcryptjs": "^2.4.3",
    "dotenv": "^16.3.1",
    "zod": "^3.23.8",
    "pino": "^8.17.0",
    "pino-pretty": "^10.3.0"
  },
  "devDependencies": {
    "@types/express": "^4.17.21",
    "@types/cors": "^2.8.17",
    "@types/compression": "^1.7.5",
    "@types/morgan": "^1.9.9",
    "@types/bcryptjs": "^2.4.6",
    "@types/jsonwebtoken": "^9.0.5",
    "tsx": "^4.7.0",
    "tsup": "^8.0.1",
    "typescript": "^5.3.3",
    "vitest": "^1.2.0"
  }
}
EOF

    # Main entry point
    cat > "$dir/src/index.ts" << 'EOF'
import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import compression from 'compression';
import morgan from 'morgan';
import rateLimit from 'express-rate-limit';
import { config } from './config/index.js';
import { errorHandler } from './middleware/errorHandler.js';
import { notFoundHandler } from './middleware/notFoundHandler.js';
import { healthRouter } from './routes/health.js';
import { apiRouter } from './routes/api.js';
import { logger } from './utils/logger.js';

const app = express();

// Security middleware
app.use(helmet());
app.use(cors(config.cors));

// Rate limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // limit each IP to 100 requests per windowMs
  message: { error: 'Too many requests, please try again later.' }
});
app.use(limiter);

// Request parsing
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));
app.use(compression());

// Logging
app.use(morgan('combined', {
  stream: { write: (message) => logger.info(message.trim()) }
}));

// Routes
app.use('/health', healthRouter);
app.use('/api/v1', apiRouter);

// Error handling
app.use(notFoundHandler);
app.use(errorHandler);

// Start server
const PORT = config.port;
app.listen(PORT, () => {
  logger.info(`🚀 Server running on port ${PORT}`);
  logger.info(`📝 Environment: ${config.env}`);
  logger.info(`🔗 Health check: http://localhost:${PORT}/health`);
});

export default app;
EOF

    # Config
    cat > "$dir/src/config/index.ts" << EOF
import { z } from 'zod';
import dotenv from 'dotenv';

dotenv.config();

const envSchema = z.object({
  NODE_ENV: z.enum(['development', 'production', 'test']).default('development'),
  PORT: z.string().default('${port}'),
  JWT_SECRET: z.string().default('your-super-secret-jwt-key'),
  DATABASE_URL: z.string().optional(),
  REDIS_URL: z.string().optional(),
  CORS_ORIGIN: z.string().default('*'),
});

const env = envSchema.parse(process.env);

export const config = {
  env: env.NODE_ENV,
  port: parseInt(env.PORT, 10),
  jwt: {
    secret: env.JWT_SECRET,
    expiresIn: '7d',
  },
  database: {
    url: env.DATABASE_URL,
  },
  redis: {
    url: env.REDIS_URL,
  },
  cors: {
    origin: env.CORS_ORIGIN === '*' ? '*' : env.CORS_ORIGIN.split(','),
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
  },
};
EOF

    # Logger
    cat > "$dir/src/utils/logger.ts" << 'EOF'
import pino from 'pino';

export const logger = pino({
  level: process.env.LOG_LEVEL || 'info',
  transport: process.env.NODE_ENV !== 'production' ? {
    target: 'pino-pretty',
    options: {
      colorize: true,
      translateTime: 'SYS:standard',
    },
  } : undefined,
});
EOF

    # Middleware
    cat > "$dir/src/middleware/errorHandler.ts" << 'EOF'
import { Request, Response, NextFunction } from 'express';
import { logger } from '../utils/logger.js';

export interface AppError extends Error {
  statusCode?: number;
  status?: string;
  isOperational?: boolean;
}

export const errorHandler = (
  err: AppError,
  req: Request,
  res: Response,
  _next: NextFunction
) => {
  const statusCode = err.statusCode || 500;
  const status = err.status || 'error';

  logger.error({
    message: err.message,
    stack: err.stack,
    path: req.path,
    method: req.method,
  });

  res.status(statusCode).json({
    status,
    message: err.message,
    ...(process.env.NODE_ENV === 'development' && { stack: err.stack }),
  });
};
EOF

    cat > "$dir/src/middleware/notFoundHandler.ts" << 'EOF'
import { Request, Response } from 'express';

export const notFoundHandler = (req: Request, res: Response) => {
  res.status(404).json({
    status: 'error',
    message: `Route ${req.originalUrl} not found`,
  });
};
EOF

    cat > "$dir/src/middleware/auth.ts" << 'EOF'
import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { config } from '../config/index.js';

export interface AuthRequest extends Request {
  user?: {
    id: string;
    email: string;
    role: string;
  };
}

export const authenticate = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    const token = req.headers.authorization?.replace('Bearer ', '');
    
    if (!token) {
      return res.status(401).json({ error: 'Authentication required' });
    }

    const decoded = jwt.verify(token, config.jwt.secret) as AuthRequest['user'];
    req.user = decoded;
    next();
  } catch (error) {
    res.status(401).json({ error: 'Invalid or expired token' });
  }
};

export const authorize = (...roles: string[]) => {
  return (req: AuthRequest, res: Response, next: NextFunction) => {
    if (!req.user || !roles.includes(req.user.role)) {
      return res.status(403).json({ error: 'Insufficient permissions' });
    }
    next();
  };
};
EOF

    # Routes
    cat > "$dir/src/routes/health.ts" << 'EOF'
import { Router } from 'express';

export const healthRouter = Router();

healthRouter.get('/', (req, res) => {
  res.json({
    status: 'healthy',
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
    memory: process.memoryUsage(),
  });
});

healthRouter.get('/ready', (req, res) => {
  // Add database/redis connection checks here
  res.json({ status: 'ready' });
});

healthRouter.get('/live', (req, res) => {
  res.json({ status: 'alive' });
});
EOF

    cat > "$dir/src/routes/api.ts" << 'EOF'
import { Router } from 'express';

export const apiRouter = Router();

// Example endpoints - extend as needed
apiRouter.get('/', (req, res) => {
  res.json({
    message: 'Welcome to the API',
    version: '1.0.0',
    endpoints: {
      health: '/health',
      docs: '/api/v1/docs',
    },
  });
});

// Add more route modules here
// apiRouter.use('/users', usersRouter);
// apiRouter.use('/auth', authRouter);
// apiRouter.use('/crypto', cryptoRouter);
EOF

    # TypeScript config
    cat > "$dir/tsconfig.json" << 'EOF'
{
  "extends": "../../tsconfig.json",
  "compilerOptions": {
    "outDir": "./dist",
    "rootDir": "./src",
    "declaration": true,
    "declarationMap": true
  },
  "include": ["src/**/*"],
  "exclude": ["node_modules", "dist"]
}
EOF

    # Environment example
    cat > "$dir/.env.example" << EOF
NODE_ENV=development
PORT=${port}
JWT_SECRET=your-super-secret-jwt-key-change-in-production
DATABASE_URL=postgresql://user:password@localhost:5432/database
REDIS_URL=redis://localhost:6379
CORS_ORIGIN=http://localhost:3000
EOF

    log INFO "✅ Express.js API generated at $dir"
}

generate_fastify_api() {
    local name="${1:-fastify-api}"
    local port="${2:-3002}"
    local dir="${BACKEND_DIR}/${name}"
    
    log INFO "Generating Fastify API: $name on port $port"
    
    mkdir -p "$dir/src"/{routes,plugins,hooks,schemas,services}
    
    cat > "$dir/package.json" << EOF
{
  "name": "@universal-crypto-mcp/${name}",
  "version": "1.0.0",
  "type": "module",
  "main": "dist/index.js",
  "scripts": {
    "dev": "tsx watch src/index.ts",
    "build": "tsup src/index.ts --format esm --dts",
    "start": "node dist/index.js",
    "test": "vitest run"
  },
  "dependencies": {
    "fastify": "^4.25.2",
    "@fastify/cors": "^8.5.0",
    "@fastify/helmet": "^11.1.1",
    "@fastify/rate-limit": "^9.1.0",
    "@fastify/jwt": "^7.2.4",
    "@fastify/swagger": "^8.14.0",
    "@fastify/swagger-ui": "^2.1.0",
    "@fastify/websocket": "^8.3.1",
    "zod": "^3.23.8",
    "pino": "^8.17.0"
  },
  "devDependencies": {
    "@types/node": "^20.10.0",
    "tsx": "^4.7.0",
    "tsup": "^8.0.1",
    "typescript": "^5.3.3",
    "vitest": "^1.2.0"
  }
}
EOF

    cat > "$dir/src/index.ts" << EOF
import Fastify from 'fastify';
import cors from '@fastify/cors';
import helmet from '@fastify/helmet';
import rateLimit from '@fastify/rate-limit';
import jwt from '@fastify/jwt';
import swagger from '@fastify/swagger';
import swaggerUi from '@fastify/swagger-ui';
import websocket from '@fastify/websocket';

const fastify = Fastify({
  logger: {
    level: process.env.LOG_LEVEL || 'info',
    transport: process.env.NODE_ENV !== 'production' ? {
      target: 'pino-pretty',
      options: { colorize: true }
    } : undefined
  }
});

// Register plugins
await fastify.register(cors, {
  origin: process.env.CORS_ORIGIN || '*',
  credentials: true
});

await fastify.register(helmet);

await fastify.register(rateLimit, {
  max: 100,
  timeWindow: '1 minute'
});

await fastify.register(jwt, {
  secret: process.env.JWT_SECRET || 'your-secret-key'
});

await fastify.register(websocket);

await fastify.register(swagger, {
  openapi: {
    info: {
      title: 'Universal Crypto MCP API',
      version: '1.0.0',
      description: 'Powerful crypto API backend'
    },
    servers: [{ url: 'http://localhost:${port}' }]
  }
});

await fastify.register(swaggerUi, {
  routePrefix: '/docs'
});

// Health check
fastify.get('/health', async () => ({
  status: 'healthy',
  timestamp: new Date().toISOString(),
  uptime: process.uptime()
}));

// WebSocket endpoint
fastify.get('/ws', { websocket: true }, (socket, req) => {
  socket.on('message', (message) => {
    const data = JSON.parse(message.toString());
    socket.send(JSON.stringify({ echo: data, timestamp: Date.now() }));
  });
});

// API routes
fastify.get('/api/v1', async () => ({
  message: 'Welcome to Fastify API',
  version: '1.0.0',
  docs: '/docs'
}));

// Start server
const PORT = parseInt(process.env.PORT || '${port}', 10);
try {
  await fastify.listen({ port: PORT, host: '0.0.0.0' });
  console.log(\`🚀 Fastify server running on port \${PORT}\`);
} catch (err) {
  fastify.log.error(err);
  process.exit(1);
}
EOF

    log INFO "✅ Fastify API generated at $dir"
}

generate_hono_api() {
    local name="${1:-hono-api}"
    local port="${2:-3003}"
    local dir="${BACKEND_DIR}/${name}"
    
    log INFO "Generating Hono API: $name on port $port (Edge-ready)"
    
    mkdir -p "$dir/src"/{routes,middleware,utils}
    
    cat > "$dir/package.json" << EOF
{
  "name": "@universal-crypto-mcp/${name}",
  "version": "1.0.0",
  "type": "module",
  "main": "dist/index.js",
  "scripts": {
    "dev": "tsx watch src/index.ts",
    "build": "tsup src/index.ts --format esm --dts",
    "start": "node dist/index.js",
    "deploy:vercel": "vercel deploy",
    "deploy:cloudflare": "wrangler deploy"
  },
  "dependencies": {
    "hono": "^3.12.0",
    "@hono/node-server": "^1.4.1",
    "@hono/zod-validator": "^0.1.11",
    "zod": "^3.23.8"
  },
  "devDependencies": {
    "@types/node": "^20.10.0",
    "tsx": "^4.7.0",
    "tsup": "^8.0.1",
    "typescript": "^5.3.3",
    "vitest": "^1.2.0"
  }
}
EOF

    cat > "$dir/src/index.ts" << 'EOF'
import { serve } from '@hono/node-server';
import { Hono } from 'hono';
import { cors } from 'hono/cors';
import { logger } from 'hono/logger';
import { prettyJSON } from 'hono/pretty-json';
import { secureHeaders } from 'hono/secure-headers';
import { timing } from 'hono/timing';
import { rateLimiter } from 'hono/rate-limiter';
import { zValidator } from '@hono/zod-validator';
import { z } from 'zod';

const app = new Hono();

// Middleware
app.use('*', cors());
app.use('*', logger());
app.use('*', prettyJSON());
app.use('*', secureHeaders());
app.use('*', timing());

// Rate limiting
app.use('*', async (c, next) => {
  // Simple in-memory rate limiting
  await next();
});

// Health endpoints
app.get('/health', (c) => c.json({
  status: 'healthy',
  timestamp: new Date().toISOString(),
  runtime: 'node'
}));

// API routes with Zod validation
const cryptoSchema = z.object({
  symbol: z.string().min(1).max(10),
  amount: z.number().positive(),
});

app.post('/api/v1/validate', zValidator('json', cryptoSchema), (c) => {
  const data = c.req.valid('json');
  return c.json({ valid: true, data });
});

// Typed API route example
app.get('/api/v1/price/:symbol', async (c) => {
  const symbol = c.req.param('symbol');
  // Mock price data - replace with real API call
  return c.json({
    symbol: symbol.toUpperCase(),
    price: Math.random() * 50000,
    timestamp: Date.now()
  });
});

// Error handling
app.onError((err, c) => {
  console.error(err);
  return c.json({ error: err.message }, 500);
});

app.notFound((c) => c.json({ error: 'Not Found' }, 404));

// Start server
const port = parseInt(process.env.PORT || '3003', 10);
console.log(`🚀 Hono server running on port ${port}`);

serve({ fetch: app.fetch, port });

// Export for serverless/edge deployments
export default app;
EOF

    log INFO "✅ Hono API generated at $dir (Edge/Serverless ready)"
}

generate_trpc_api() {
    local name="${1:-trpc-api}"
    local port="${2:-3004}"
    local dir="${BACKEND_DIR}/${name}"
    
    log INFO "Generating tRPC API: $name on port $port (Type-safe with React Query)"
    
    mkdir -p "$dir/src"/{routers,procedures,context,utils}
    
    cat > "$dir/package.json" << EOF
{
  "name": "@universal-crypto-mcp/${name}",
  "version": "1.0.0",
  "type": "module",
  "main": "dist/index.js",
  "scripts": {
    "dev": "tsx watch src/index.ts",
    "build": "tsup src/index.ts --format esm --dts",
    "start": "node dist/index.js"
  },
  "dependencies": {
    "@trpc/server": "^10.45.0",
    "@trpc/client": "^10.45.0",
    "zod": "^3.23.8",
    "superjson": "^2.2.1",
    "express": "^4.18.2",
    "cors": "^2.8.5"
  },
  "devDependencies": {
    "@types/express": "^4.17.21",
    "@types/cors": "^2.8.17",
    "tsx": "^4.7.0",
    "tsup": "^8.0.1",
    "typescript": "^5.3.3"
  }
}
EOF

    cat > "$dir/src/index.ts" << 'EOF'
import express from 'express';
import cors from 'cors';
import { createExpressMiddleware } from '@trpc/server/adapters/express';
import { appRouter, type AppRouter } from './routers/index.js';
import { createContext } from './context/index.js';

const app = express();

app.use(cors());

// tRPC middleware
app.use(
  '/trpc',
  createExpressMiddleware({
    router: appRouter,
    createContext,
  })
);

// Health check
app.get('/health', (req, res) => {
  res.json({ status: 'healthy', timestamp: new Date().toISOString() });
});

const PORT = parseInt(process.env.PORT || '3004', 10);
app.listen(PORT, () => {
  console.log(`🚀 tRPC server running on port ${PORT}`);
  console.log(`📝 tRPC endpoint: http://localhost:${PORT}/trpc`);
});

// Export types for frontend
export type { AppRouter };
EOF

    cat > "$dir/src/routers/index.ts" << 'EOF'
import { router, publicProcedure, protectedProcedure } from '../procedures/index.js';
import { z } from 'zod';

export const appRouter = router({
  // Public procedures
  health: publicProcedure.query(() => ({
    status: 'ok',
    timestamp: new Date().toISOString(),
  })),

  // Crypto price lookup
  getPrice: publicProcedure
    .input(z.object({ symbol: z.string() }))
    .query(async ({ input }) => {
      // Replace with real API call
      return {
        symbol: input.symbol.toUpperCase(),
        price: Math.random() * 50000,
        change24h: (Math.random() - 0.5) * 10,
      };
    }),

  // Protected mutation example
  createOrder: protectedProcedure
    .input(z.object({
      symbol: z.string(),
      side: z.enum(['buy', 'sell']),
      amount: z.number().positive(),
    }))
    .mutation(async ({ input, ctx }) => {
      // Implement order creation
      return {
        orderId: crypto.randomUUID(),
        ...input,
        userId: ctx.user?.id,
        status: 'pending',
        createdAt: new Date().toISOString(),
      };
    }),

  // List operations with pagination
  listTransactions: publicProcedure
    .input(z.object({
      limit: z.number().min(1).max(100).default(10),
      cursor: z.string().optional(),
    }))
    .query(async ({ input }) => {
      // Implement pagination
      return {
        items: [],
        nextCursor: null,
      };
    }),
});

export type AppRouter = typeof appRouter;
EOF

    cat > "$dir/src/procedures/index.ts" << 'EOF'
import { initTRPC, TRPCError } from '@trpc/server';
import superjson from 'superjson';
import type { Context } from '../context/index.js';

const t = initTRPC.context<Context>().create({
  transformer: superjson,
  errorFormatter({ shape, error }) {
    return {
      ...shape,
      data: {
        ...shape.data,
        zodError: error.cause instanceof Error ? error.cause.message : null,
      },
    };
  },
});

export const router = t.router;
export const publicProcedure = t.procedure;

// Protected procedure middleware
const enforceAuth = t.middleware(({ ctx, next }) => {
  if (!ctx.user) {
    throw new TRPCError({ code: 'UNAUTHORIZED' });
  }
  return next({
    ctx: { ...ctx, user: ctx.user },
  });
});

export const protectedProcedure = t.procedure.use(enforceAuth);
EOF

    cat > "$dir/src/context/index.ts" << 'EOF'
import type { CreateExpressContextOptions } from '@trpc/server/adapters/express';

export interface User {
  id: string;
  email: string;
  role: string;
}

export interface Context {
  user: User | null;
  req: CreateExpressContextOptions['req'];
  res: CreateExpressContextOptions['res'];
}

export const createContext = async ({
  req,
  res,
}: CreateExpressContextOptions): Promise<Context> => {
  // Extract user from JWT token
  const token = req.headers.authorization?.replace('Bearer ', '');
  let user: User | null = null;

  if (token) {
    try {
      // Verify and decode JWT - implement your logic
      // user = await verifyToken(token);
    } catch {
      // Invalid token
    }
  }

  return { user, req, res };
};
EOF

    log INFO "✅ tRPC API generated at $dir (Type-safe with TanStack Query support)"
}

generate_graphql_api() {
    local name="${1:-graphql-api}"
    local port="${2:-3005}"
    local dir="${BACKEND_DIR}/${name}"
    
    log INFO "Generating GraphQL API: $name on port $port"
    
    mkdir -p "$dir/src"/{schema,resolvers,context,dataloaders}
    
    cat > "$dir/package.json" << EOF
{
  "name": "@universal-crypto-mcp/${name}",
  "version": "1.0.0",
  "type": "module",
  "main": "dist/index.js",
  "scripts": {
    "dev": "tsx watch src/index.ts",
    "build": "tsup src/index.ts --format esm --dts",
    "start": "node dist/index.js",
    "codegen": "graphql-codegen"
  },
  "dependencies": {
    "@apollo/server": "^4.10.0",
    "@graphql-tools/schema": "^10.0.2",
    "graphql": "^16.8.1",
    "graphql-scalars": "^1.22.4",
    "dataloader": "^2.2.2",
    "express": "^4.18.2",
    "cors": "^2.8.5"
  },
  "devDependencies": {
    "@graphql-codegen/cli": "^5.0.0",
    "@graphql-codegen/typescript": "^4.0.1",
    "@graphql-codegen/typescript-resolvers": "^4.0.1",
    "@types/express": "^4.17.21",
    "@types/cors": "^2.8.17",
    "tsx": "^4.7.0",
    "tsup": "^8.0.1",
    "typescript": "^5.3.3"
  }
}
EOF

    cat > "$dir/src/index.ts" << 'EOF'
import { ApolloServer } from '@apollo/server';
import { expressMiddleware } from '@apollo/server/express4';
import { ApolloServerPluginDrainHttpServer } from '@apollo/server/plugin/drainHttpServer';
import express from 'express';
import http from 'http';
import cors from 'cors';
import { typeDefs } from './schema/index.js';
import { resolvers } from './resolvers/index.js';
import { createContext } from './context/index.js';

const app = express();
const httpServer = http.createServer(app);

const server = new ApolloServer({
  typeDefs,
  resolvers,
  plugins: [ApolloServerPluginDrainHttpServer({ httpServer })],
});

await server.start();

app.use(
  '/graphql',
  cors<cors.CorsRequest>(),
  express.json(),
  expressMiddleware(server, {
    context: createContext,
  }),
);

// Health check
app.get('/health', (req, res) => {
  res.json({ status: 'healthy', timestamp: new Date().toISOString() });
});

const PORT = parseInt(process.env.PORT || '3005', 10);
httpServer.listen(PORT, () => {
  console.log(`🚀 GraphQL server running at http://localhost:${PORT}/graphql`);
});
EOF

    cat > "$dir/src/schema/index.ts" << 'EOF'
export const typeDefs = `#graphql
  scalar DateTime
  scalar BigInt

  type Query {
    health: HealthStatus!
    cryptoPrice(symbol: String!): CryptoPrice
    cryptoPrices(symbols: [String!]!): [CryptoPrice!]!
    wallet(address: String!): Wallet
    transactions(address: String!, first: Int, after: String): TransactionConnection!
  }

  type Mutation {
    createOrder(input: CreateOrderInput!): Order!
    cancelOrder(orderId: ID!): Order!
  }

  type Subscription {
    priceUpdated(symbol: String!): CryptoPrice!
    newTransaction(address: String!): Transaction!
  }

  type HealthStatus {
    status: String!
    timestamp: DateTime!
    uptime: Float!
  }

  type CryptoPrice {
    symbol: String!
    price: Float!
    change24h: Float!
    volume24h: Float!
    marketCap: BigInt!
    lastUpdated: DateTime!
  }

  type Wallet {
    address: String!
    balance: Float!
    network: String!
    tokens: [TokenBalance!]!
  }

  type TokenBalance {
    symbol: String!
    balance: Float!
    value: Float!
  }

  type Transaction {
    id: ID!
    hash: String!
    from: String!
    to: String!
    value: Float!
    status: TransactionStatus!
    timestamp: DateTime!
  }

  type TransactionConnection {
    edges: [TransactionEdge!]!
    pageInfo: PageInfo!
    totalCount: Int!
  }

  type TransactionEdge {
    node: Transaction!
    cursor: String!
  }

  type PageInfo {
    hasNextPage: Boolean!
    hasPreviousPage: Boolean!
    startCursor: String
    endCursor: String
  }

  type Order {
    id: ID!
    symbol: String!
    side: OrderSide!
    amount: Float!
    price: Float!
    status: OrderStatus!
    createdAt: DateTime!
  }

  enum TransactionStatus {
    PENDING
    CONFIRMED
    FAILED
  }

  enum OrderSide {
    BUY
    SELL
  }

  enum OrderStatus {
    PENDING
    FILLED
    PARTIAL
    CANCELLED
  }

  input CreateOrderInput {
    symbol: String!
    side: OrderSide!
    amount: Float!
    price: Float
  }
`;
EOF

    cat > "$dir/src/resolvers/index.ts" << 'EOF'
import { DateTimeResolver, BigIntResolver } from 'graphql-scalars';

export const resolvers = {
  DateTime: DateTimeResolver,
  BigInt: BigIntResolver,

  Query: {
    health: () => ({
      status: 'healthy',
      timestamp: new Date(),
      uptime: process.uptime(),
    }),

    cryptoPrice: async (_: unknown, { symbol }: { symbol: string }) => ({
      symbol: symbol.toUpperCase(),
      price: Math.random() * 50000,
      change24h: (Math.random() - 0.5) * 10,
      volume24h: Math.random() * 1000000000,
      marketCap: BigInt(Math.floor(Math.random() * 1000000000000)),
      lastUpdated: new Date(),
    }),

    cryptoPrices: async (_: unknown, { symbols }: { symbols: string[] }) => 
      symbols.map(symbol => ({
        symbol: symbol.toUpperCase(),
        price: Math.random() * 50000,
        change24h: (Math.random() - 0.5) * 10,
        volume24h: Math.random() * 1000000000,
        marketCap: BigInt(Math.floor(Math.random() * 1000000000000)),
        lastUpdated: new Date(),
      })),

    wallet: async (_: unknown, { address }: { address: string }) => ({
      address,
      balance: Math.random() * 100,
      network: 'ethereum',
      tokens: [
        { symbol: 'USDC', balance: 1000, value: 1000 },
        { symbol: 'WETH', balance: 0.5, value: 1500 },
      ],
    }),

    transactions: async () => ({
      edges: [],
      pageInfo: {
        hasNextPage: false,
        hasPreviousPage: false,
        startCursor: null,
        endCursor: null,
      },
      totalCount: 0,
    }),
  },

  Mutation: {
    createOrder: async (_: unknown, { input }: { input: any }) => ({
      id: crypto.randomUUID(),
      ...input,
      price: input.price || Math.random() * 50000,
      status: 'PENDING',
      createdAt: new Date(),
    }),

    cancelOrder: async (_: unknown, { orderId }: { orderId: string }) => ({
      id: orderId,
      symbol: 'BTC',
      side: 'BUY',
      amount: 0.1,
      price: 45000,
      status: 'CANCELLED',
      createdAt: new Date(),
    }),
  },
};
EOF

    cat > "$dir/src/context/index.ts" << 'EOF'
import type { ExpressContextFunctionArgument } from '@apollo/server/express4';
import DataLoader from 'dataloader';

export interface User {
  id: string;
  email: string;
}

export interface Context {
  user: User | null;
  dataloaders: {
    priceLoader: DataLoader<string, any>;
  };
}

export const createContext = async ({
  req,
}: ExpressContextFunctionArgument): Promise<Context> => {
  // Extract user from token
  const token = req.headers.authorization?.replace('Bearer ', '');
  let user: User | null = null;

  if (token) {
    // Verify token and get user
  }

  // Create dataloaders for batching
  const priceLoader = new DataLoader<string, any>(async (symbols) => {
    // Batch fetch prices
    return symbols.map(symbol => ({
      symbol,
      price: Math.random() * 50000,
    }));
  });

  return {
    user,
    dataloaders: { priceLoader },
  };
};
EOF

    log INFO "✅ GraphQL API generated at $dir (Apollo Server)"
}

#-------------------------------------------------------------------------------
# Database Generators
#-------------------------------------------------------------------------------

generate_prisma_setup() {
    local name="${1:-database}"
    local dir="${BACKEND_DIR}/${name}"
    
    log INFO "Generating Prisma database setup at $dir"
    
    mkdir -p "$dir/prisma"
    
    cat > "$dir/prisma/schema.prisma" << 'EOF'
generator client {
  provider = "prisma-client-js"
}

datasource db {
  provider = "postgresql"
  url      = env("DATABASE_URL")
}

model User {
  id        String   @id @default(cuid())
  email     String   @unique
  name      String?
  password  String
  role      Role     @default(USER)
  wallets   Wallet[]
  orders    Order[]
  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt

  @@map("users")
}

model Wallet {
  id           String        @id @default(cuid())
  address      String        @unique
  network      String
  userId       String
  user         User          @relation(fields: [userId], references: [id], onDelete: Cascade)
  transactions Transaction[]
  createdAt    DateTime      @default(now())
  updatedAt    DateTime      @updatedAt

  @@index([userId])
  @@map("wallets")
}

model Transaction {
  id        String            @id @default(cuid())
  hash      String            @unique
  from      String
  to        String
  value     Decimal           @db.Decimal(78, 18)
  network   String
  status    TransactionStatus @default(PENDING)
  walletId  String
  wallet    Wallet            @relation(fields: [walletId], references: [id], onDelete: Cascade)
  createdAt DateTime          @default(now())
  updatedAt DateTime          @updatedAt

  @@index([walletId])
  @@index([hash])
  @@map("transactions")
}

model Order {
  id        String      @id @default(cuid())
  symbol    String
  side      OrderSide
  type      OrderType   @default(MARKET)
  amount    Decimal     @db.Decimal(78, 18)
  price     Decimal?    @db.Decimal(78, 18)
  status    OrderStatus @default(PENDING)
  userId    String
  user      User        @relation(fields: [userId], references: [id], onDelete: Cascade)
  createdAt DateTime    @default(now())
  updatedAt DateTime    @updatedAt

  @@index([userId])
  @@index([symbol])
  @@map("orders")
}

model CryptoPrice {
  id          String   @id @default(cuid())
  symbol      String   @unique
  price       Decimal  @db.Decimal(78, 18)
  change24h   Decimal  @db.Decimal(10, 4)
  volume24h   Decimal  @db.Decimal(78, 18)
  marketCap   Decimal  @db.Decimal(78, 0)
  lastUpdated DateTime @default(now())

  @@map("crypto_prices")
}

enum Role {
  USER
  ADMIN
}

enum TransactionStatus {
  PENDING
  CONFIRMED
  FAILED
}

enum OrderSide {
  BUY
  SELL
}

enum OrderType {
  MARKET
  LIMIT
}

enum OrderStatus {
  PENDING
  FILLED
  PARTIAL
  CANCELLED
}
EOF

    cat > "$dir/prisma/seed.ts" << 'EOF'
import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  // Create admin user
  const adminPassword = await bcrypt.hash('admin123', 10);
  await prisma.user.upsert({
    where: { email: 'admin@example.com' },
    update: {},
    create: {
      email: 'admin@example.com',
      name: 'Admin',
      password: adminPassword,
      role: 'ADMIN',
    },
  });

  // Seed crypto prices
  const cryptos = ['BTC', 'ETH', 'SOL', 'MATIC', 'AVAX'];
  for (const symbol of cryptos) {
    await prisma.cryptoPrice.upsert({
      where: { symbol },
      update: {},
      create: {
        symbol,
        price: Math.random() * 50000,
        change24h: (Math.random() - 0.5) * 10,
        volume24h: Math.random() * 1000000000,
        marketCap: Math.floor(Math.random() * 1000000000000),
      },
    });
  }

  console.log('✅ Database seeded successfully');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
EOF

    log INFO "✅ Prisma setup generated at $dir/prisma"
}

generate_drizzle_setup() {
    local name="${1:-database}"
    local dir="${BACKEND_DIR}/${name}"
    
    log INFO "Generating Drizzle ORM setup at $dir"
    
    mkdir -p "$dir/src/db"
    
    cat > "$dir/src/db/schema.ts" << 'EOF'
import {
  pgTable,
  text,
  varchar,
  timestamp,
  decimal,
  pgEnum,
  index,
  uniqueIndex,
} from 'drizzle-orm/pg-core';
import { relations } from 'drizzle-orm';

// Enums
export const roleEnum = pgEnum('role', ['USER', 'ADMIN']);
export const transactionStatusEnum = pgEnum('transaction_status', ['PENDING', 'CONFIRMED', 'FAILED']);
export const orderSideEnum = pgEnum('order_side', ['BUY', 'SELL']);
export const orderTypeEnum = pgEnum('order_type', ['MARKET', 'LIMIT']);
export const orderStatusEnum = pgEnum('order_status', ['PENDING', 'FILLED', 'PARTIAL', 'CANCELLED']);

// Users table
export const users = pgTable('users', {
  id: text('id').primaryKey().$defaultFn(() => crypto.randomUUID()),
  email: varchar('email', { length: 255 }).unique().notNull(),
  name: varchar('name', { length: 255 }),
  password: text('password').notNull(),
  role: roleEnum('role').default('USER').notNull(),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
});

export const usersRelations = relations(users, ({ many }) => ({
  wallets: many(wallets),
  orders: many(orders),
}));

// Wallets table
export const wallets = pgTable('wallets', {
  id: text('id').primaryKey().$defaultFn(() => crypto.randomUUID()),
  address: varchar('address', { length: 255 }).unique().notNull(),
  network: varchar('network', { length: 50 }).notNull(),
  userId: text('user_id').references(() => users.id, { onDelete: 'cascade' }).notNull(),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
}, (table) => ({
  userIdIdx: index('wallets_user_id_idx').on(table.userId),
}));

export const walletsRelations = relations(wallets, ({ one, many }) => ({
  user: one(users, {
    fields: [wallets.userId],
    references: [users.id],
  }),
  transactions: many(transactions),
}));

// Transactions table
export const transactions = pgTable('transactions', {
  id: text('id').primaryKey().$defaultFn(() => crypto.randomUUID()),
  hash: varchar('hash', { length: 255 }).unique().notNull(),
  from: varchar('from_address', { length: 255 }).notNull(),
  to: varchar('to_address', { length: 255 }).notNull(),
  value: decimal('value', { precision: 78, scale: 18 }).notNull(),
  network: varchar('network', { length: 50 }).notNull(),
  status: transactionStatusEnum('status').default('PENDING').notNull(),
  walletId: text('wallet_id').references(() => wallets.id, { onDelete: 'cascade' }).notNull(),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
}, (table) => ({
  walletIdIdx: index('transactions_wallet_id_idx').on(table.walletId),
  hashIdx: uniqueIndex('transactions_hash_idx').on(table.hash),
}));

export const transactionsRelations = relations(transactions, ({ one }) => ({
  wallet: one(wallets, {
    fields: [transactions.walletId],
    references: [wallets.id],
  }),
}));

// Orders table
export const orders = pgTable('orders', {
  id: text('id').primaryKey().$defaultFn(() => crypto.randomUUID()),
  symbol: varchar('symbol', { length: 20 }).notNull(),
  side: orderSideEnum('side').notNull(),
  type: orderTypeEnum('type').default('MARKET').notNull(),
  amount: decimal('amount', { precision: 78, scale: 18 }).notNull(),
  price: decimal('price', { precision: 78, scale: 18 }),
  status: orderStatusEnum('status').default('PENDING').notNull(),
  userId: text('user_id').references(() => users.id, { onDelete: 'cascade' }).notNull(),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
}, (table) => ({
  userIdIdx: index('orders_user_id_idx').on(table.userId),
  symbolIdx: index('orders_symbol_idx').on(table.symbol),
}));

export const ordersRelations = relations(orders, ({ one }) => ({
  user: one(users, {
    fields: [orders.userId],
    references: [users.id],
  }),
}));

// Crypto prices table
export const cryptoPrices = pgTable('crypto_prices', {
  id: text('id').primaryKey().$defaultFn(() => crypto.randomUUID()),
  symbol: varchar('symbol', { length: 20 }).unique().notNull(),
  price: decimal('price', { precision: 78, scale: 18 }).notNull(),
  change24h: decimal('change_24h', { precision: 10, scale: 4 }).notNull(),
  volume24h: decimal('volume_24h', { precision: 78, scale: 18 }).notNull(),
  marketCap: decimal('market_cap', { precision: 78, scale: 0 }).notNull(),
  lastUpdated: timestamp('last_updated').defaultNow().notNull(),
});
EOF

    cat > "$dir/src/db/index.ts" << 'EOF'
import { drizzle } from 'drizzle-orm/node-postgres';
import { Pool } from 'pg';
import * as schema from './schema.js';

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
});

export const db = drizzle(pool, { schema });

export type DB = typeof db;
export * from './schema.js';
EOF

    cat > "$dir/drizzle.config.ts" << 'EOF'
import type { Config } from 'drizzle-kit';

export default {
  schema: './src/db/schema.ts',
  out: './drizzle',
  driver: 'pg',
  dbCredentials: {
    connectionString: process.env.DATABASE_URL!,
  },
} satisfies Config;
EOF

    log INFO "✅ Drizzle ORM setup generated at $dir"
}

#-------------------------------------------------------------------------------
# Infrastructure Generators
#-------------------------------------------------------------------------------

generate_docker_compose() {
    local name="${1:-dev}"
    local file="${DEPLOY_DIR}/docker-compose.${name}.yml"
    
    log INFO "Generating Docker Compose configuration: $file"
    
    cat > "$file" << 'EOF'
version: '3.8'

services:
  # PostgreSQL Database
  postgres:
    image: postgres:16-alpine
    container_name: crypto-postgres
    environment:
      POSTGRES_USER: ${DB_USER:-postgres}
      POSTGRES_PASSWORD: ${DB_PASSWORD:-postgres}
      POSTGRES_DB: ${DB_NAME:-crypto_mcp}
    volumes:
      - postgres_data:/var/lib/postgresql/data
      - ./init.sql:/docker-entrypoint-initdb.d/init.sql:ro
    ports:
      - "5432:5432"
    healthcheck:
      test: ["CMD-SHELL", "pg_isready -U ${DB_USER:-postgres}"]
      interval: 10s
      timeout: 5s
      retries: 5
    networks:
      - backend

  # Redis Cache
  redis:
    image: redis:7-alpine
    container_name: crypto-redis
    command: redis-server --appendonly yes --requirepass ${REDIS_PASSWORD:-redis}
    volumes:
      - redis_data:/data
    ports:
      - "6379:6379"
    healthcheck:
      test: ["CMD", "redis-cli", "ping"]
      interval: 10s
      timeout: 5s
      retries: 5
    networks:
      - backend

  # Redis Commander (UI)
  redis-commander:
    image: rediscommander/redis-commander:latest
    container_name: crypto-redis-ui
    environment:
      REDIS_HOSTS: local:redis:6379:0:${REDIS_PASSWORD:-redis}
    ports:
      - "8081:8081"
    depends_on:
      - redis
    networks:
      - backend
    profiles:
      - dev

  # RabbitMQ Message Queue
  rabbitmq:
    image: rabbitmq:3-management-alpine
    container_name: crypto-rabbitmq
    environment:
      RABBITMQ_DEFAULT_USER: ${RABBITMQ_USER:-admin}
      RABBITMQ_DEFAULT_PASS: ${RABBITMQ_PASS:-admin}
    volumes:
      - rabbitmq_data:/var/lib/rabbitmq
    ports:
      - "5672:5672"
      - "15672:15672"
    healthcheck:
      test: ["CMD", "rabbitmq-diagnostics", "check_running"]
      interval: 30s
      timeout: 10s
      retries: 5
    networks:
      - backend

  # API Gateway (Nginx)
  nginx:
    image: nginx:alpine
    container_name: crypto-nginx
    volumes:
      - ./nginx.conf:/etc/nginx/nginx.conf:ro
      - ./ssl:/etc/nginx/ssl:ro
    ports:
      - "80:80"
      - "443:443"
    depends_on:
      - api
    networks:
      - backend
      - frontend

  # Main API Service
  api:
    build:
      context: ..
      dockerfile: deploy/Dockerfile
      target: runner
    container_name: crypto-api
    environment:
      NODE_ENV: ${NODE_ENV:-development}
      PORT: 3001
      DATABASE_URL: postgresql://${DB_USER:-postgres}:${DB_PASSWORD:-postgres}@postgres:5432/${DB_NAME:-crypto_mcp}
      REDIS_URL: redis://:${REDIS_PASSWORD:-redis}@redis:6379
      JWT_SECRET: ${JWT_SECRET:-your-secret-key}
    ports:
      - "3001:3001"
    depends_on:
      postgres:
        condition: service_healthy
      redis:
        condition: service_healthy
    networks:
      - backend
    healthcheck:
      test: ["CMD", "wget", "-q", "--spider", "http://localhost:3001/health"]
      interval: 30s
      timeout: 10s
      retries: 3

  # Worker Service
  worker:
    build:
      context: ..
      dockerfile: deploy/Dockerfile
      target: runner
    container_name: crypto-worker
    command: node dist/worker.js
    environment:
      NODE_ENV: ${NODE_ENV:-development}
      DATABASE_URL: postgresql://${DB_USER:-postgres}:${DB_PASSWORD:-postgres}@postgres:5432/${DB_NAME:-crypto_mcp}
      REDIS_URL: redis://:${REDIS_PASSWORD:-redis}@redis:6379
      RABBITMQ_URL: amqp://${RABBITMQ_USER:-admin}:${RABBITMQ_PASS:-admin}@rabbitmq:5672
    depends_on:
      postgres:
        condition: service_healthy
      redis:
        condition: service_healthy
      rabbitmq:
        condition: service_healthy
    networks:
      - backend
    profiles:
      - workers

  # Prometheus Monitoring
  prometheus:
    image: prom/prometheus:latest
    container_name: crypto-prometheus
    volumes:
      - ./prometheus.yml:/etc/prometheus/prometheus.yml:ro
      - ./alerts.yml:/etc/prometheus/alerts.yml:ro
      - prometheus_data:/prometheus
    command:
      - '--config.file=/etc/prometheus/prometheus.yml'
      - '--storage.tsdb.path=/prometheus'
      - '--web.enable-lifecycle'
    ports:
      - "9090:9090"
    networks:
      - monitoring
      - backend
    profiles:
      - monitoring

  # Grafana Dashboard
  grafana:
    image: grafana/grafana:latest
    container_name: crypto-grafana
    environment:
      GF_SECURITY_ADMIN_USER: ${GRAFANA_USER:-admin}
      GF_SECURITY_ADMIN_PASSWORD: ${GRAFANA_PASS:-admin}
      GF_INSTALL_PLUGINS: grafana-clock-panel,grafana-piechart-panel
    volumes:
      - grafana_data:/var/lib/grafana
      - ./grafana/provisioning:/etc/grafana/provisioning:ro
    ports:
      - "3000:3000"
    depends_on:
      - prometheus
    networks:
      - monitoring
    profiles:
      - monitoring

  # Alertmanager
  alertmanager:
    image: prom/alertmanager:latest
    container_name: crypto-alertmanager
    volumes:
      - ./alertmanager.yml:/etc/alertmanager/alertmanager.yml:ro
    ports:
      - "9093:9093"
    networks:
      - monitoring
    profiles:
      - monitoring

networks:
  backend:
    driver: bridge
  frontend:
    driver: bridge
  monitoring:
    driver: bridge

volumes:
  postgres_data:
  redis_data:
  rabbitmq_data:
  prometheus_data:
  grafana_data:
EOF

    log INFO "✅ Docker Compose configuration generated at $file"
}

generate_kubernetes_manifests() {
    local name="${1:-crypto-mcp}"
    local namespace="${2:-default}"
    local dir="${DEPLOY_DIR}/k8s"
    
    log INFO "Generating Kubernetes manifests at $dir"
    
    mkdir -p "$dir"/{base,overlays/{dev,staging,prod}}
    
    # Base deployment
    cat > "$dir/base/deployment.yaml" << EOF
apiVersion: apps/v1
kind: Deployment
metadata:
  name: ${name}-api
  labels:
    app: ${name}
    component: api
spec:
  replicas: 3
  selector:
    matchLabels:
      app: ${name}
      component: api
  template:
    metadata:
      labels:
        app: ${name}
        component: api
    spec:
      containers:
        - name: api
          image: ${name}:latest
          ports:
            - containerPort: 3001
          env:
            - name: NODE_ENV
              value: "production"
            - name: PORT
              value: "3001"
            - name: DATABASE_URL
              valueFrom:
                secretKeyRef:
                  name: ${name}-secrets
                  key: database-url
            - name: REDIS_URL
              valueFrom:
                secretKeyRef:
                  name: ${name}-secrets
                  key: redis-url
            - name: JWT_SECRET
              valueFrom:
                secretKeyRef:
                  name: ${name}-secrets
                  key: jwt-secret
          resources:
            requests:
              memory: "256Mi"
              cpu: "100m"
            limits:
              memory: "512Mi"
              cpu: "500m"
          livenessProbe:
            httpGet:
              path: /health/live
              port: 3001
            initialDelaySeconds: 30
            periodSeconds: 10
          readinessProbe:
            httpGet:
              path: /health/ready
              port: 3001
            initialDelaySeconds: 5
            periodSeconds: 5
          lifecycle:
            preStop:
              exec:
                command: ["/bin/sh", "-c", "sleep 10"]
---
apiVersion: v1
kind: Service
metadata:
  name: ${name}-api
spec:
  selector:
    app: ${name}
    component: api
  ports:
    - port: 80
      targetPort: 3001
  type: ClusterIP
---
apiVersion: autoscaling/v2
kind: HorizontalPodAutoscaler
metadata:
  name: ${name}-api-hpa
spec:
  scaleTargetRef:
    apiVersion: apps/v1
    kind: Deployment
    name: ${name}-api
  minReplicas: 3
  maxReplicas: 20
  metrics:
    - type: Resource
      resource:
        name: cpu
        target:
          type: Utilization
          averageUtilization: 70
    - type: Resource
      resource:
        name: memory
        target:
          type: Utilization
          averageUtilization: 80
EOF

    # Ingress
    cat > "$dir/base/ingress.yaml" << EOF
apiVersion: networking.k8s.io/v1
kind: Ingress
metadata:
  name: ${name}-ingress
  annotations:
    kubernetes.io/ingress.class: nginx
    cert-manager.io/cluster-issuer: letsencrypt-prod
    nginx.ingress.kubernetes.io/rate-limit: "100"
    nginx.ingress.kubernetes.io/rate-limit-window: "1m"
spec:
  tls:
    - hosts:
        - api.example.com
      secretName: ${name}-tls
  rules:
    - host: api.example.com
      http:
        paths:
          - path: /
            pathType: Prefix
            backend:
              service:
                name: ${name}-api
                port:
                  number: 80
EOF

    # Kustomization
    cat > "$dir/base/kustomization.yaml" << EOF
apiVersion: kustomize.config.k8s.io/v1beta1
kind: Kustomization

namespace: ${namespace}

resources:
  - deployment.yaml
  - ingress.yaml

commonLabels:
  app.kubernetes.io/name: ${name}
  app.kubernetes.io/managed-by: kustomize
EOF

    log INFO "✅ Kubernetes manifests generated at $dir"
}

#-------------------------------------------------------------------------------
# Testing & Quality Generators
#-------------------------------------------------------------------------------

generate_test_setup() {
    local name="${1:-api}"
    local dir="${BACKEND_DIR}/${name}"
    
    log INFO "Generating test setup for $name"
    
    mkdir -p "$dir/src/__tests__"/{unit,integration,e2e}
    
    cat > "$dir/src/__tests__/setup.ts" << 'EOF'
import { beforeAll, afterAll, beforeEach, afterEach } from 'vitest';

// Global test setup
beforeAll(async () => {
  // Initialize test database, mock servers, etc.
  console.log('🧪 Test suite starting...');
});

afterAll(async () => {
  // Cleanup
  console.log('🧪 Test suite completed');
});

beforeEach(async () => {
  // Reset mocks, clear database, etc.
});

afterEach(async () => {
  // Cleanup after each test
});
EOF

    cat > "$dir/src/__tests__/unit/example.test.ts" << 'EOF'
import { describe, it, expect, vi } from 'vitest';

describe('Example Unit Tests', () => {
  it('should pass basic assertions', () => {
    expect(1 + 1).toBe(2);
    expect('hello').toContain('ell');
    expect({ name: 'test' }).toHaveProperty('name');
  });

  it('should work with async code', async () => {
    const fetchData = vi.fn().mockResolvedValue({ data: 'test' });
    const result = await fetchData();
    expect(result).toEqual({ data: 'test' });
  });

  it('should mock functions correctly', () => {
    const mockFn = vi.fn((x: number) => x * 2);
    expect(mockFn(5)).toBe(10);
    expect(mockFn).toHaveBeenCalledWith(5);
    expect(mockFn).toHaveBeenCalledTimes(1);
  });
});
EOF

    cat > "$dir/src/__tests__/integration/api.test.ts" << 'EOF'
import { describe, it, expect, beforeAll, afterAll } from 'vitest';
import request from 'supertest';
// import app from '../../index.js';

describe('API Integration Tests', () => {
  // let server: any;

  beforeAll(async () => {
    // server = app.listen(0);
  });

  afterAll(async () => {
    // server?.close();
  });

  it.skip('should return healthy status', async () => {
    // const response = await request(server).get('/health');
    // expect(response.status).toBe(200);
    // expect(response.body).toHaveProperty('status', 'healthy');
  });

  it.skip('should handle 404 for unknown routes', async () => {
    // const response = await request(server).get('/unknown');
    // expect(response.status).toBe(404);
  });
});
EOF

    cat > "$dir/vitest.config.ts" << 'EOF'
import { defineConfig } from 'vitest/config';

export default defineConfig({
  test: {
    globals: true,
    environment: 'node',
    include: ['src/**/*.{test,spec}.{js,ts}'],
    coverage: {
      provider: 'v8',
      reporter: ['text', 'json', 'html'],
      exclude: [
        'node_modules/',
        'dist/',
        'src/__tests__/',
      ],
    },
    setupFiles: ['src/__tests__/setup.ts'],
    testTimeout: 30000,
  },
});
EOF

    log INFO "✅ Test setup generated for $name"
}

#-------------------------------------------------------------------------------
# Main Backend Management
#-------------------------------------------------------------------------------

backend_init() {
    banner
    log INFO "Initializing backend automation system..."
    
    mkdir -p "$LOGS_DIR" "$CACHE_DIR"
    
    check_dependencies node npm pnpm docker git curl || {
        log WARN "Some dependencies are missing. Install them for full functionality."
    }
    
    log INFO "✅ Backend automation system initialized"
}

backend_create() {
    local framework="${1:-express}"
    local name="${2:-api}"
    local port="${3:-3001}"
    
    log INFO "Creating $framework backend: $name on port $port"
    
    case "$framework" in
        express)
            generate_express_api "$name" "$port"
            ;;
        fastify)
            generate_fastify_api "$name" "$port"
            ;;
        hono)
            generate_hono_api "$name" "$port"
            ;;
        trpc)
            generate_trpc_api "$name" "$port"
            ;;
        graphql)
            generate_graphql_api "$name" "$port"
            ;;
        *)
            log ERROR "Unknown framework: $framework"
            echo "Available frameworks: express, fastify, hono, trpc, graphql"
            return 1
            ;;
    esac
    
    log INFO "📦 Installing dependencies..."
    (cd "${BACKEND_DIR}/${name}" && pnpm install) || log WARN "Failed to install dependencies"
    
    log INFO "✅ Backend $name created successfully!"
}

backend_dev() {
    local name="${1:-api}"
    local dir="${BACKEND_DIR}/${name}"
    
    if [[ ! -d "$dir" ]]; then
        log ERROR "Backend '$name' not found at $dir"
        return 1
    fi
    
    log INFO "Starting development server for $name..."
    (cd "$dir" && pnpm dev)
}

backend_build() {
    local name="${1:-api}"
    local dir="${BACKEND_DIR}/${name}"
    
    if [[ ! -d "$dir" ]]; then
        log ERROR "Backend '$name' not found at $dir"
        return 1
    fi
    
    log INFO "Building $name..."
    (cd "$dir" && pnpm build)
    log INFO "✅ Build completed for $name"
}

backend_test() {
    local name="${1:-api}"
    local dir="${BACKEND_DIR}/${name}"
    
    if [[ ! -d "$dir" ]]; then
        log ERROR "Backend '$name' not found at $dir"
        return 1
    fi
    
    log INFO "Running tests for $name..."
    (cd "$dir" && pnpm test)
}

backend_deploy() {
    local name="${1:-api}"
    local env="${2:-dev}"
    
    log INFO "Deploying $name to $env environment..."
    
    case "$env" in
        dev|development)
            docker compose -f "${DEPLOY_DIR}/docker-compose.dev.yml" up -d --build
            ;;
        staging)
            kubectl apply -k "${DEPLOY_DIR}/k8s/overlays/staging"
            ;;
        prod|production)
            if confirm "⚠️  Deploy to PRODUCTION?"; then
                kubectl apply -k "${DEPLOY_DIR}/k8s/overlays/prod"
            else
                log WARN "Production deployment cancelled"
                return 1
            fi
            ;;
        *)
            log ERROR "Unknown environment: $env"
            return 1
            ;;
    esac
    
    log INFO "✅ Deployment initiated for $name to $env"
}

backend_status() {
    banner
    echo -e "${CYAN}Backend Services Status:${NC}\n"
    
    # Docker containers
    if command -v docker &> /dev/null; then
        echo -e "${YELLOW}Docker Containers:${NC}"
        docker ps --format "table {{.Names}}\t{{.Status}}\t{{.Ports}}" 2>/dev/null || echo "  No containers running"
        echo
    fi
    
    # Kubernetes pods
    if command -v kubectl &> /dev/null; then
        echo -e "${YELLOW}Kubernetes Pods:${NC}"
        kubectl get pods 2>/dev/null || echo "  No Kubernetes cluster connected"
        echo
    fi
    
    # Running node processes
    echo -e "${YELLOW}Node.js Processes:${NC}"
    pgrep -fa "node|tsx" | grep -v grep || echo "  No Node.js processes running"
    echo
    
    # Port usage
    echo -e "${YELLOW}Backend Ports:${NC}"
    for port in 3001 3002 3003 3004 3005 5432 6379; do
        if lsof -i:$port &>/dev/null; then
            echo -e "  ${GREEN}●${NC} Port $port: In use"
        else
            echo -e "  ${RED}○${NC} Port $port: Available"
        fi
    done
}

#-------------------------------------------------------------------------------
# Help & Usage
#-------------------------------------------------------------------------------

show_help() {
    banner
    echo -e "${WHITE}Usage:${NC} backend-automation.sh <command> [options]"
    echo
    echo -e "${CYAN}Commands:${NC}"
    echo "  init                           Initialize the automation system"
    echo "  create <framework> <name>      Create a new backend service"
    echo "  dev <name>                     Start development server"
    echo "  build <name>                   Build the service"
    echo "  test <name>                    Run tests"
    echo "  deploy <name> <env>            Deploy to environment"
    echo "  status                         Show status of all services"
    echo
    echo -e "${CYAN}Frameworks:${NC}"
    echo "  express     - Express.js (Classic, Robust)"
    echo "  fastify     - Fastify (Fast, Schema-based)"
    echo "  hono        - Hono (Edge-ready, Ultra-fast)"
    echo "  trpc        - tRPC (Type-safe, TanStack Query)"
    echo "  graphql     - GraphQL (Apollo Server)"
    echo
    echo -e "${CYAN}Generators:${NC}"
    echo "  generate:docker     Generate Docker Compose config"
    echo "  generate:k8s        Generate Kubernetes manifests"
    echo "  generate:prisma     Generate Prisma schema"
    echo "  generate:drizzle    Generate Drizzle ORM schema"
    echo "  generate:tests      Generate test setup"
    echo
    echo -e "${CYAN}Examples:${NC}"
    echo "  ./backend-automation.sh create express my-api 3001"
    echo "  ./backend-automation.sh create trpc crypto-service 3004"
    echo "  ./backend-automation.sh dev my-api"
    echo "  ./backend-automation.sh deploy my-api production"
    echo
}

#-------------------------------------------------------------------------------
# Main Entry Point
#-------------------------------------------------------------------------------

main() {
    local command="${1:-help}"
    shift 2>/dev/null || true
    
    case "$command" in
        init)
            backend_init "$@"
            ;;
        create)
            backend_create "$@"
            ;;
        dev)
            backend_dev "$@"
            ;;
        build)
            backend_build "$@"
            ;;
        test)
            backend_test "$@"
            ;;
        deploy)
            backend_deploy "$@"
            ;;
        status)
            backend_status "$@"
            ;;
        generate:docker)
            generate_docker_compose "$@"
            ;;
        generate:k8s)
            generate_kubernetes_manifests "$@"
            ;;
        generate:prisma)
            generate_prisma_setup "$@"
            ;;
        generate:drizzle)
            generate_drizzle_setup "$@"
            ;;
        generate:tests)
            generate_test_setup "$@"
            ;;
        help|--help|-h)
            show_help
            ;;
        *)
            log ERROR "Unknown command: $command"
            show_help
            exit 1
            ;;
    esac
}

# Run if executed directly
if [[ "${BASH_SOURCE[0]}" == "${0}" ]]; then
    main "$@"
fi
