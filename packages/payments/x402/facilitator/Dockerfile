# X402 Payment Facilitator Docker Image
# Multi-stage build for production deployment with multi-chain support

# ============================================
# Stage 1: Base with pnpm
# ============================================
FROM node:20-alpine AS base
RUN apk add --no-cache libc6-compat
WORKDIR /app
RUN corepack enable && corepack prepare pnpm@latest --activate

# ============================================
# Stage 2: Dependencies
# ============================================
FROM base AS deps
COPY package.json pnpm-lock.yaml* ./
RUN pnpm install --frozen-lockfile --prod

# ============================================
# Stage 3: Build
# ============================================
FROM base AS builder
COPY package.json pnpm-lock.yaml* ./
RUN pnpm install --frozen-lockfile
COPY tsconfig.json ./
COPY src/ ./src/
RUN pnpm run build

# ============================================
# Stage 4: Production
# ============================================
FROM node:20-alpine AS production

# Add labels
LABEL org.opencontainers.image.title="X402 Payment Facilitator"
LABEL org.opencontainers.image.description="Multi-chain payment facilitator with 0.1% fee collection"
LABEL org.opencontainers.image.version="1.1.0"
LABEL org.opencontainers.image.source="https://github.com/nirholas/universal-crypto-mcp"

# Create non-root user
RUN addgroup -g 1001 -S nodejs && \
    adduser -S facilitator -u 1001

WORKDIR /app

ENV NODE_ENV=production

# Copy production files
COPY --from=deps --chown=facilitator:nodejs /app/node_modules ./node_modules
COPY --from=builder --chown=facilitator:nodejs /app/dist ./dist
COPY --from=builder --chown=facilitator:nodejs /app/package.json ./

# Create logs directory
RUN mkdir -p logs && chown facilitator:nodejs logs

# Switch to non-root user
USER facilitator

# Environment variables with defaults
ENV NODE_ENV=production
ENV PORT=3002
ENV HOST=0.0.0.0
ENV NETWORK=arbitrum-sepolia
ENV LOG_LEVEL=info

# Health check
HEALTHCHECK --interval=30s --timeout=10s --start-period=5s --retries=3 \
  CMD wget --no-verbose --tries=1 --spider http://localhost:${PORT}/health || exit 1

# Expose port
EXPOSE 3002

# Start server
CMD ["node", "dist/server.js"]
