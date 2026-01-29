# Build stage
FROM node:20-alpine AS builder

WORKDIR /app

# Install pnpm
RUN corepack enable && corepack prepare pnpm@8.15.0 --activate

# Copy package files
COPY package.json pnpm-lock.yaml pnpm-workspace.yaml ./
COPY packages/shared/package.json ./packages/shared/
COPY packages/solana-core/package.json ./packages/solana-core/
COPY packages/wallet-manager/package.json ./packages/wallet-manager/
COPY packages/trading-engine/package.json ./packages/trading-engine/
COPY packages/orchestrator/package.json ./packages/orchestrator/
COPY packages/mcp-server/package.json ./packages/mcp-server/

# Install dependencies
RUN pnpm install --frozen-lockfile

# Copy source code
COPY tsconfig.base.json tsconfig.json ./
COPY packages/ ./packages/

# Build all packages
RUN pnpm build

# Production base
FROM node:20-alpine AS production-base

WORKDIR /app

RUN corepack enable && corepack prepare pnpm@8.15.0 --activate

# Copy built packages
COPY --from=builder /app/package.json /app/pnpm-lock.yaml /app/pnpm-workspace.yaml ./
COPY --from=builder /app/packages/shared/package.json /app/packages/shared/dist ./packages/shared/
COPY --from=builder /app/packages/solana-core/package.json /app/packages/solana-core/dist ./packages/solana-core/
COPY --from=builder /app/packages/wallet-manager/package.json /app/packages/wallet-manager/dist ./packages/wallet-manager/
COPY --from=builder /app/packages/trading-engine/package.json /app/packages/trading-engine/dist ./packages/trading-engine/
COPY --from=builder /app/packages/orchestrator/package.json /app/packages/orchestrator/dist ./packages/orchestrator/
COPY --from=builder /app/packages/mcp-server/package.json /app/packages/mcp-server/dist ./packages/mcp-server/

# Install production dependencies only
RUN pnpm install --prod --frozen-lockfile

# MCP Server target
FROM production-base AS mcp-server

ENV NODE_ENV=production

EXPOSE 3000

CMD ["node", "packages/mcp-server/dist/cli.js", "start"]

# Orchestrator Worker target
FROM production-base AS orchestrator

ENV NODE_ENV=production
ENV WORKER_MODE=true

CMD ["node", "packages/orchestrator/dist/worker.js"]
