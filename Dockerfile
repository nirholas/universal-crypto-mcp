# Universal Crypto MCP Server
FROM node:25-alpine AS builder

WORKDIR /app

# Enable pnpm (this is a pnpm workspace; npm cannot install it)
RUN corepack enable

# Copy source (workspace installs need every package manifest)
COPY . .

# Install dependencies
RUN pnpm install --frozen-lockfile

# Build
RUN pnpm run build

# Drop dev dependencies so the production stage can copy a lean node_modules
RUN pnpm prune --prod

# Production image
FROM node:25-alpine AS production

WORKDIR /app

# Install curl for healthcheck
RUN apk add --no-cache curl

# Copy package manifest and pruned production dependencies
COPY --from=builder /app/package.json ./package.json
COPY --from=builder /app/node_modules ./node_modules

# Copy built files
COPY --from=builder /app/dist ./dist

# Create non-root user
RUN addgroup -g 1001 -S nodejs && \
    adduser -S nodejs -u 1001

# Create data directories
RUN mkdir -p /app/data /app/logs && \
    chown -R nodejs:nodejs /app

USER nodejs

# Environment
ENV NODE_ENV=production
ENV PORT=3000

EXPOSE 3000 3001

# Health check
HEALTHCHECK --interval=30s --timeout=10s --start-period=10s --retries=3 \
  CMD curl -f http://localhost:3000/health || exit 1

# Start server
CMD ["node", "dist/index.js"]
