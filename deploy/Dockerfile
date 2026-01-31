# Universal Crypto MCP - Enterprise Production Dockerfile
# Multi-stage build for optimal production image

# ==============================================================================
# Stage 1: Dependencies
# ==============================================================================
FROM node:20-alpine AS deps

RUN apk add --no-cache libc6-compat python3 make g++
WORKDIR /app

# Install pnpm
RUN corepack enable && corepack prepare pnpm@latest --activate

# Copy all package files (monorepo structure)
COPY package.json pnpm-lock.yaml pnpm-workspace.yaml ./
COPY packages ./packages
COPY deploy/package.json ./deploy/
COPY x402-deploy ./x402-deploy

# Install dependencies
RUN pnpm install --frozen-lockfile || pnpm install

# ==============================================================================
# Stage 2: Builder
# ==============================================================================
FROM node:20-alpine AS builder

RUN apk add --no-cache libc6-compat
WORKDIR /app

RUN corepack enable && corepack prepare pnpm@latest --activate

# Copy dependencies
COPY --from=deps /app/node_modules ./node_modules

# Copy source
COPY . .

# Build all packages
RUN pnpm build

# ==============================================================================
# Stage 3: Production Runner
# ==============================================================================
FROM node:20-alpine AS runner

RUN apk add --no-cache dumb-init curl

WORKDIR /app

# Create non-root user
RUN addgroup --system --gid 1001 nodejs && \
    adduser --system --uid 1001 gateway

# Copy built application
COPY --from=builder --chown=gateway:nodejs /app/dist ./dist
COPY --from=builder --chown=gateway:nodejs /app/node_modules ./node_modules
COPY --from=builder --chown=gateway:nodejs /app/package.json ./

# Environment configuration
ENV NODE_ENV=production
ENV PORT=3000
ENV LOG_LEVEL=info

# Health check
HEALTHCHECK --interval=30s --timeout=10s --start-period=5s --retries=3 \
  CMD curl -f http://localhost:3000/health || exit 1

# Expose port
EXPOSE 3000

# Switch to non-root user
USER gateway

# Start with dumb-init for proper signal handling
ENTRYPOINT ["dumb-init", "--"]
CMD ["node", "dist/deploy/src/gateway/index.js"]
