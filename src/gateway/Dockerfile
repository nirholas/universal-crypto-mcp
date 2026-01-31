FROM node:20-alpine AS builder

WORKDIR /app

# Install pnpm
RUN npm install -g pnpm

# Copy package files
COPY package.json pnpm-lock.yaml pnpm-workspace.yaml ./
COPY tsconfig.json tsup.config.ts ./

# Copy source
COPY src/ ./src/
COPY packages/ ./packages/

# Install dependencies and build
RUN pnpm install --frozen-lockfile
RUN pnpm run build

# Production image
FROM node:20-alpine AS production

WORKDIR /app

# Install pnpm
RUN npm install -g pnpm

# Copy built files
COPY --from=builder /app/dist ./dist
COPY --from=builder /app/package.json ./
COPY --from=builder /app/pnpm-lock.yaml ./

# Install production dependencies only
RUN pnpm install --prod --frozen-lockfile

# Environment
ENV NODE_ENV=production
ENV PORT=3402
ENV REDIS_URL=redis://redis:6379

# Health check
HEALTHCHECK --interval=30s --timeout=10s --start-period=5s --retries=3 \
  CMD wget --no-verbose --tries=1 --spider http://localhost:3402/health || exit 1

EXPOSE 3402

CMD ["node", "dist/gateway/x402-server.js"]
