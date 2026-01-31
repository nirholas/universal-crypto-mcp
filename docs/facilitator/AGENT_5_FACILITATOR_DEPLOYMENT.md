# 🚀 Agent 5: Deployment & Documentation

## 🎯 Mission

Build the deployment infrastructure, Docker configuration, and documentation for the facilitator. You make it production-ready and easy to deploy.

---

## 📋 Context

You are working on the `universal-crypto-mcp` repository. Agents 1-4 are building the core functionality. You package everything for deployment and write the docs.

**Your Dependencies:**
- All code from Agents 1-4
- Existing Docker patterns in `/workspaces/universal-crypto-mcp/deploy/`

**Key Reference Files:**
- `/workspaces/universal-crypto-mcp/deploy/docker-compose.yml` - Existing deployment
- `/workspaces/universal-crypto-mcp/deploy/Dockerfile` - Existing Docker
- `/workspaces/universal-crypto-mcp/deploy/prometheus.yml` - Monitoring config

---

## 🏗️ Phase 1: Docker Configuration

### Task 1.1: Create Facilitator Dockerfile

Create `deploy/facilitator/Dockerfile`:

```dockerfile
# ═══════════════════════════════════════════════════════════════
# x402 Facilitator - Production Dockerfile
# ═══════════════════════════════════════════════════════════════

# Stage 1: Build
FROM node:20-alpine AS builder

WORKDIR /app

# Install pnpm
RUN corepack enable && corepack prepare pnpm@latest --activate

# Copy package files
COPY package.json pnpm-lock.yaml pnpm-workspace.yaml ./
COPY packages/facilitator/package.json ./packages/facilitator/
COPY packages/shared/package.json ./packages/shared/

# Install dependencies
RUN pnpm install --frozen-lockfile

# Copy source
COPY packages/facilitator ./packages/facilitator
COPY packages/shared ./packages/shared
COPY tsconfig.json ./

# Build
RUN pnpm --filter @nirholas/x402-facilitator build

# Stage 2: Production
FROM node:20-alpine AS production

WORKDIR /app

# Install pnpm
RUN corepack enable && corepack prepare pnpm@latest --activate

# Create non-root user
RUN addgroup -g 1001 -S nodejs && \
    adduser -S facilitator -u 1001

# Copy built files
COPY --from=builder /app/packages/facilitator/dist ./dist
COPY --from=builder /app/packages/facilitator/package.json ./
COPY --from=builder /app/node_modules ./node_modules

# Set ownership
RUN chown -R facilitator:nodejs /app

USER facilitator

# Environment
ENV NODE_ENV=production
ENV PORT=3402

# Health check
HEALTHCHECK --interval=30s --timeout=10s --start-period=5s --retries=3 \
  CMD wget --no-verbose --tries=1 --spider http://localhost:3402/health || exit 1

EXPOSE 3402

CMD ["node", "dist/index.js"]
```

### Task 1.2: Create Docker Compose

Create `deploy/facilitator/docker-compose.yml`:

```yaml
# ═══════════════════════════════════════════════════════════════
# x402 Facilitator - Docker Compose
# ═══════════════════════════════════════════════════════════════

version: '3.8'

services:
  # ─────────────────────────────────────────────────────────────
  # Facilitator Server
  # ─────────────────────────────────────────────────────────────
  facilitator:
    build:
      context: ../..
      dockerfile: deploy/facilitator/Dockerfile
    container_name: x402-facilitator
    restart: unless-stopped
    ports:
      - "3402:3402"
    environment:
      - NODE_ENV=production
      - PORT=3402
      - LOG_LEVEL=info
      # Blockchain
      - EVM_PRIVATE_KEY=${EVM_PRIVATE_KEY}
      - SOLANA_PRIVATE_KEY=${SOLANA_PRIVATE_KEY}
      # Database
      - DATABASE_URL=postgresql://facilitator:${DB_PASSWORD}@postgres:5432/facilitator
      - REDIS_URL=redis://redis:6379
      # Fees
      - FEE_RATE_BPS=10
      - FEE_RECIPIENT=${FEE_RECIPIENT}
      - MIN_FEE=0.001
      - MAX_FEE=100
      # Networks
      - NETWORKS=base,arbitrum,optimism
      - BASE_RPC_URL=${BASE_RPC_URL:-https://mainnet.base.org}
      - ARBITRUM_RPC_URL=${ARBITRUM_RPC_URL:-https://arb1.arbitrum.io/rpc}
      - OPTIMISM_RPC_URL=${OPTIMISM_RPC_URL:-https://mainnet.optimism.io}
    depends_on:
      postgres:
        condition: service_healthy
      redis:
        condition: service_healthy
    networks:
      - facilitator-network
    labels:
      - "traefik.enable=true"
      - "traefik.http.routers.facilitator.rule=Host(`facilitator.yourdomain.com`)"
      - "traefik.http.routers.facilitator.tls=true"
      - "traefik.http.routers.facilitator.tls.certresolver=letsencrypt"

  # ─────────────────────────────────────────────────────────────
  # PostgreSQL Database
  # ─────────────────────────────────────────────────────────────
  postgres:
    image: postgres:16-alpine
    container_name: facilitator-postgres
    restart: unless-stopped
    environment:
      - POSTGRES_USER=facilitator
      - POSTGRES_PASSWORD=${DB_PASSWORD}
      - POSTGRES_DB=facilitator
    volumes:
      - postgres-data:/var/lib/postgresql/data
      - ./init.sql:/docker-entrypoint-initdb.d/init.sql
    healthcheck:
      test: ["CMD-SHELL", "pg_isready -U facilitator"]
      interval: 10s
      timeout: 5s
      retries: 5
    networks:
      - facilitator-network

  # ─────────────────────────────────────────────────────────────
  # Redis Cache
  # ─────────────────────────────────────────────────────────────
  redis:
    image: redis:7-alpine
    container_name: facilitator-redis
    restart: unless-stopped
    command: redis-server --appendonly yes
    volumes:
      - redis-data:/data
    healthcheck:
      test: ["CMD", "redis-cli", "ping"]
      interval: 10s
      timeout: 5s
      retries: 5
    networks:
      - facilitator-network

  # ─────────────────────────────────────────────────────────────
  # Prometheus Monitoring
  # ─────────────────────────────────────────────────────────────
  prometheus:
    image: prom/prometheus:v2.48.0
    container_name: facilitator-prometheus
    restart: unless-stopped
    ports:
      - "9090:9090"
    volumes:
      - ./prometheus.yml:/etc/prometheus/prometheus.yml
      - ./alerts.yml:/etc/prometheus/alerts.yml
      - prometheus-data:/prometheus
    command:
      - '--config.file=/etc/prometheus/prometheus.yml'
      - '--storage.tsdb.path=/prometheus'
      - '--storage.tsdb.retention.time=30d'
      - '--web.enable-lifecycle'
    networks:
      - facilitator-network

  # ─────────────────────────────────────────────────────────────
  # Grafana Dashboard
  # ─────────────────────────────────────────────────────────────
  grafana:
    image: grafana/grafana:10.2.0
    container_name: facilitator-grafana
    restart: unless-stopped
    ports:
      - "3000:3000"
    environment:
      - GF_SECURITY_ADMIN_USER=admin
      - GF_SECURITY_ADMIN_PASSWORD=${GRAFANA_PASSWORD}
      - GF_USERS_ALLOW_SIGN_UP=false
    volumes:
      - grafana-data:/var/lib/grafana
      - ./grafana/provisioning:/etc/grafana/provisioning
      - ./grafana/dashboards:/var/lib/grafana/dashboards
    depends_on:
      - prometheus
    networks:
      - facilitator-network

  # ─────────────────────────────────────────────────────────────
  # Alertmanager
  # ─────────────────────────────────────────────────────────────
  alertmanager:
    image: prom/alertmanager:v0.26.0
    container_name: facilitator-alertmanager
    restart: unless-stopped
    ports:
      - "9093:9093"
    volumes:
      - ./alertmanager.yml:/etc/alertmanager/alertmanager.yml
    command:
      - '--config.file=/etc/alertmanager/alertmanager.yml'
    networks:
      - facilitator-network

networks:
  facilitator-network:
    driver: bridge

volumes:
  postgres-data:
  redis-data:
  prometheus-data:
  grafana-data:
```

### Task 1.3: Create Prometheus Config

Create `deploy/facilitator/prometheus.yml`:

```yaml
# ═══════════════════════════════════════════════════════════════
# Prometheus Configuration for x402 Facilitator
# ═══════════════════════════════════════════════════════════════

global:
  scrape_interval: 15s
  evaluation_interval: 15s
  external_labels:
    monitor: 'x402-facilitator'

# Alerting configuration
alerting:
  alertmanagers:
    - static_configs:
        - targets: ['alertmanager:9093']

# Rule files
rule_files:
  - /etc/prometheus/alerts.yml

# Scrape configurations
scrape_configs:
  # Facilitator metrics
  - job_name: 'facilitator'
    static_configs:
      - targets: ['facilitator:3402']
    metrics_path: '/metrics'
    scrape_interval: 10s

  # Prometheus self-monitoring
  - job_name: 'prometheus'
    static_configs:
      - targets: ['localhost:9090']

  # Node exporter (if deployed)
  - job_name: 'node'
    static_configs:
      - targets: ['node-exporter:9100']
```

### Task 1.4: Create Alert Rules

Create `deploy/facilitator/alerts.yml`:

```yaml
# ═══════════════════════════════════════════════════════════════
# Alert Rules for x402 Facilitator
# ═══════════════════════════════════════════════════════════════

groups:
  - name: facilitator_alerts
    rules:
      # High error rate
      - alert: HighPaymentErrorRate
        expr: |
          (
            sum(rate(facilitator_payments_total{status="failed"}[5m])) /
            sum(rate(facilitator_payments_total[5m]))
          ) > 0.05
        for: 5m
        labels:
          severity: critical
        annotations:
          summary: "High payment error rate"
          description: "Payment error rate is {{ $value | humanizePercentage }} over the last 5 minutes"

      # Slow settlements
      - alert: SlowSettlements
        expr: |
          histogram_quantile(0.95, 
            sum(rate(facilitator_settlement_duration_seconds_bucket[5m])) by (le, network)
          ) > 30
        for: 10m
        labels:
          severity: warning
        annotations:
          summary: "Slow payment settlements on {{ $labels.network }}"
          description: "95th percentile settlement time is {{ $value }}s"

      # Low wallet balance
      - alert: LowWalletBalance
        expr: facilitator_wallet_balance_native < 0.1
        for: 5m
        labels:
          severity: warning
        annotations:
          summary: "Low native token balance"
          description: "Wallet balance is {{ $value }} - may not be able to pay gas"

      # High pending payments
      - alert: HighPendingPayments
        expr: facilitator_pending_payments > 100
        for: 5m
        labels:
          severity: warning
        annotations:
          summary: "High number of pending payments"
          description: "{{ $value }} payments pending settlement"

      # Service down
      - alert: FacilitatorDown
        expr: up{job="facilitator"} == 0
        for: 1m
        labels:
          severity: critical
        annotations:
          summary: "Facilitator service is down"
          description: "The facilitator service has been down for more than 1 minute"

      # No payments processed
      - alert: NoPaymentsProcessed
        expr: |
          sum(increase(facilitator_payments_total[1h])) == 0
        for: 1h
        labels:
          severity: warning
        annotations:
          summary: "No payments processed"
          description: "No payments have been processed in the last hour"

  - name: revenue_alerts
    rules:
      # Daily revenue drop
      - alert: RevenueDrop
        expr: |
          sum(increase(facilitator_fees_usd[24h])) < 
          (sum(increase(facilitator_fees_usd[24h] offset 1d)) * 0.5)
        for: 1h
        labels:
          severity: warning
        annotations:
          summary: "Significant revenue drop"
          description: "Daily revenue has dropped by more than 50%"
```

### Task 1.5: Create Alertmanager Config

Create `deploy/facilitator/alertmanager.yml`:

```yaml
# ═══════════════════════════════════════════════════════════════
# Alertmanager Configuration
# ═══════════════════════════════════════════════════════════════

global:
  resolve_timeout: 5m

route:
  group_by: ['alertname', 'severity']
  group_wait: 10s
  group_interval: 10s
  repeat_interval: 1h
  receiver: 'default-receiver'
  routes:
    - match:
        severity: critical
      receiver: 'critical-receiver'
      repeat_interval: 15m

receivers:
  - name: 'default-receiver'
    webhook_configs:
      - url: 'http://your-webhook-url/alerts'
        send_resolved: true

  - name: 'critical-receiver'
    webhook_configs:
      - url: 'http://your-webhook-url/alerts/critical'
        send_resolved: true
    # Add PagerDuty, Slack, etc. for critical alerts
    # slack_configs:
    #   - api_url: 'https://hooks.slack.com/services/xxx'
    #     channel: '#alerts'

inhibit_rules:
  - source_match:
      severity: 'critical'
    target_match:
      severity: 'warning'
    equal: ['alertname']
```

---

## 🏗️ Phase 2: Database Schema

### Task 2.1: Create Database Init Script

Create `deploy/facilitator/init.sql`:

```sql
-- ═══════════════════════════════════════════════════════════════
-- x402 Facilitator Database Schema
-- ═══════════════════════════════════════════════════════════════

-- Extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pg_trgm";

-- Payments table
CREATE TABLE IF NOT EXISTS payments (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    payment_id VARCHAR(255) UNIQUE NOT NULL,
    payer VARCHAR(255) NOT NULL,
    payee VARCHAR(255) NOT NULL,
    amount DECIMAL(36, 18) NOT NULL,
    fee DECIMAL(36, 18) NOT NULL,
    network VARCHAR(50) NOT NULL,
    status VARCHAR(20) NOT NULL DEFAULT 'pending',
    proof JSONB NOT NULL,
    transaction_hash VARCHAR(255),
    block_number BIGINT,
    gas_used DECIMAL(36, 0),
    gas_price DECIMAL(36, 0),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    verified_at TIMESTAMP WITH TIME ZONE,
    settled_at TIMESTAMP WITH TIME ZONE,
    failed_at TIMESTAMP WITH TIME ZONE,
    error TEXT,
    metadata JSONB DEFAULT '{}'::jsonb
);

-- Indexes
CREATE INDEX idx_payments_status ON payments(status);
CREATE INDEX idx_payments_network ON payments(network);
CREATE INDEX idx_payments_payer ON payments(payer);
CREATE INDEX idx_payments_payee ON payments(payee);
CREATE INDEX idx_payments_created_at ON payments(created_at);
CREATE INDEX idx_payments_settled_at ON payments(settled_at);

-- Batches table
CREATE TABLE IF NOT EXISTS batches (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    batch_id VARCHAR(255) UNIQUE NOT NULL,
    network VARCHAR(50) NOT NULL,
    payment_count INTEGER NOT NULL,
    total_amount DECIMAL(36, 18) NOT NULL,
    total_fees DECIMAL(36, 18) NOT NULL,
    status VARCHAR(20) NOT NULL DEFAULT 'pending',
    transaction_hash VARCHAR(255),
    gas_used DECIMAL(36, 0),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    settled_at TIMESTAMP WITH TIME ZONE,
    metadata JSONB DEFAULT '{}'::jsonb
);

CREATE INDEX idx_batches_status ON batches(status);
CREATE INDEX idx_batches_network ON batches(network);

-- Daily stats (materialized view alternative)
CREATE TABLE IF NOT EXISTS daily_stats (
    date DATE PRIMARY KEY,
    total_payments INTEGER NOT NULL DEFAULT 0,
    successful_payments INTEGER NOT NULL DEFAULT 0,
    failed_payments INTEGER NOT NULL DEFAULT 0,
    total_volume DECIMAL(36, 18) NOT NULL DEFAULT 0,
    total_fees DECIMAL(36, 18) NOT NULL DEFAULT 0,
    unique_payers INTEGER NOT NULL DEFAULT 0,
    unique_payees INTEGER NOT NULL DEFAULT 0,
    network_stats JSONB DEFAULT '{}'::jsonb,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Network stats
CREATE TABLE IF NOT EXISTS network_stats (
    network VARCHAR(50) PRIMARY KEY,
    total_payments BIGINT NOT NULL DEFAULT 0,
    total_volume DECIMAL(36, 18) NOT NULL DEFAULT 0,
    total_fees DECIMAL(36, 18) NOT NULL DEFAULT 0,
    total_gas_spent DECIMAL(36, 18) NOT NULL DEFAULT 0,
    avg_settlement_time INTEGER NOT NULL DEFAULT 0,
    last_payment_at TIMESTAMP WITH TIME ZONE,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- API keys table
CREATE TABLE IF NOT EXISTS api_keys (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    key_hash VARCHAR(255) UNIQUE NOT NULL,
    name VARCHAR(255) NOT NULL,
    owner VARCHAR(255) NOT NULL,
    permissions JSONB NOT NULL DEFAULT '["read"]'::jsonb,
    rate_limit INTEGER NOT NULL DEFAULT 1000,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    last_used_at TIMESTAMP WITH TIME ZONE,
    expires_at TIMESTAMP WITH TIME ZONE,
    revoked_at TIMESTAMP WITH TIME ZONE,
    metadata JSONB DEFAULT '{}'::jsonb
);

CREATE INDEX idx_api_keys_owner ON api_keys(owner);

-- Nonces table (for replay protection)
CREATE TABLE IF NOT EXISTS nonces (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    payer VARCHAR(255) NOT NULL,
    nonce VARCHAR(255) NOT NULL,
    network VARCHAR(50) NOT NULL,
    used_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    payment_id VARCHAR(255) REFERENCES payments(payment_id),
    UNIQUE(payer, nonce, network)
);

CREATE INDEX idx_nonces_payer ON nonces(payer, network);

-- Function to update daily stats
CREATE OR REPLACE FUNCTION update_daily_stats()
RETURNS TRIGGER AS $$
BEGIN
    INSERT INTO daily_stats (date, total_payments, successful_payments, total_volume, total_fees)
    VALUES (
        DATE(NEW.settled_at),
        1,
        CASE WHEN NEW.status = 'settled' THEN 1 ELSE 0 END,
        NEW.amount,
        NEW.fee
    )
    ON CONFLICT (date) DO UPDATE SET
        total_payments = daily_stats.total_payments + 1,
        successful_payments = daily_stats.successful_payments + 
            CASE WHEN NEW.status = 'settled' THEN 1 ELSE 0 END,
        total_volume = daily_stats.total_volume + NEW.amount,
        total_fees = daily_stats.total_fees + NEW.fee,
        updated_at = NOW();
    
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger for daily stats
CREATE TRIGGER trigger_update_daily_stats
AFTER INSERT OR UPDATE ON payments
FOR EACH ROW
WHEN (NEW.status IN ('settled', 'failed'))
EXECUTE FUNCTION update_daily_stats();
```

---

## 🏗️ Phase 3: Deployment Scripts

### Task 3.1: Create Start Script

Create `deploy/facilitator/scripts/start.sh`:

```bash
#!/bin/bash
# ═══════════════════════════════════════════════════════════════
# x402 Facilitator - Start Script
# ═══════════════════════════════════════════════════════════════

set -e

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
DEPLOY_DIR="$(dirname "$SCRIPT_DIR")"

# Colors
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

log_info() {
    echo -e "${GREEN}[INFO]${NC} $1"
}

log_warn() {
    echo -e "${YELLOW}[WARN]${NC} $1"
}

log_error() {
    echo -e "${RED}[ERROR]${NC} $1"
}

# Check required environment variables
check_env() {
    local required_vars=(
        "EVM_PRIVATE_KEY"
        "FEE_RECIPIENT"
        "DB_PASSWORD"
    )
    
    local missing=()
    for var in "${required_vars[@]}"; do
        if [ -z "${!var}" ]; then
            missing+=("$var")
        fi
    done
    
    if [ ${#missing[@]} -ne 0 ]; then
        log_error "Missing required environment variables:"
        for var in "${missing[@]}"; do
            echo "  - $var"
        done
        exit 1
    fi
}

# Load environment from .env file
load_env() {
    if [ -f "$DEPLOY_DIR/.env" ]; then
        log_info "Loading environment from .env"
        export $(grep -v '^#' "$DEPLOY_DIR/.env" | xargs)
    else
        log_warn "No .env file found. Using existing environment variables."
    fi
}

# Start services
start() {
    cd "$DEPLOY_DIR"
    
    log_info "Starting x402 Facilitator..."
    
    # Pull latest images
    docker-compose pull
    
    # Build if needed
    docker-compose build
    
    # Start services
    docker-compose up -d
    
    log_info "Waiting for services to be healthy..."
    sleep 10
    
    # Check health
    if curl -sf http://localhost:3402/health > /dev/null; then
        log_info "Facilitator is healthy!"
    else
        log_error "Facilitator health check failed"
        docker-compose logs facilitator
        exit 1
    fi
    
    log_info "Services started successfully!"
    echo ""
    echo "  Facilitator: http://localhost:3402"
    echo "  Prometheus:  http://localhost:9090"
    echo "  Grafana:     http://localhost:3000"
    echo ""
}

# Stop services
stop() {
    cd "$DEPLOY_DIR"
    log_info "Stopping services..."
    docker-compose down
    log_info "Services stopped"
}

# Show logs
logs() {
    cd "$DEPLOY_DIR"
    docker-compose logs -f "${1:-facilitator}"
}

# Show status
status() {
    cd "$DEPLOY_DIR"
    docker-compose ps
}

# Main
case "${1:-start}" in
    start)
        load_env
        check_env
        start
        ;;
    stop)
        stop
        ;;
    restart)
        stop
        load_env
        check_env
        start
        ;;
    logs)
        logs "$2"
        ;;
    status)
        status
        ;;
    *)
        echo "Usage: $0 {start|stop|restart|logs|status}"
        exit 1
        ;;
esac
```

### Task 3.2: Create Health Check Script

Create `deploy/facilitator/scripts/health-check.sh`:

```bash
#!/bin/bash
# ═══════════════════════════════════════════════════════════════
# x402 Facilitator - Health Check Script
# ═══════════════════════════════════════════════════════════════

FACILITATOR_URL="${FACILITATOR_URL:-http://localhost:3402}"

# Check facilitator health
check_facilitator() {
    response=$(curl -sf "${FACILITATOR_URL}/health" 2>/dev/null)
    if [ $? -eq 0 ]; then
        status=$(echo "$response" | jq -r '.status')
        if [ "$status" = "healthy" ]; then
            echo "✅ Facilitator: Healthy"
            return 0
        else
            echo "⚠️  Facilitator: $status"
            return 1
        fi
    else
        echo "❌ Facilitator: Unreachable"
        return 1
    fi
}

# Check database
check_database() {
    if docker exec facilitator-postgres pg_isready -U facilitator > /dev/null 2>&1; then
        echo "✅ Database: Connected"
        return 0
    else
        echo "❌ Database: Disconnected"
        return 1
    fi
}

# Check Redis
check_redis() {
    if docker exec facilitator-redis redis-cli ping > /dev/null 2>&1; then
        echo "✅ Redis: Connected"
        return 0
    else
        echo "❌ Redis: Disconnected"
        return 1
    fi
}

# Check metrics
check_metrics() {
    if curl -sf "${FACILITATOR_URL}/metrics" > /dev/null 2>&1; then
        echo "✅ Metrics: Available"
        return 0
    else
        echo "❌ Metrics: Unavailable"
        return 1
    fi
}

# Run all checks
echo "═══════════════════════════════════════"
echo "  x402 Facilitator Health Check"
echo "═══════════════════════════════════════"
echo ""

errors=0

check_facilitator || ((errors++))
check_database || ((errors++))
check_redis || ((errors++))
check_metrics || ((errors++))

echo ""
if [ $errors -eq 0 ]; then
    echo "All systems operational! ✨"
    exit 0
else
    echo "⚠️  $errors issue(s) detected"
    exit 1
fi
```

---

## 🏗️ Phase 4: Documentation

### Task 4.1: Create Main README

Create `packages/facilitator/README.md`:

```markdown
# 🌐 x402 Facilitator

> **Earn fees on every x402 payment processed through your infrastructure.**

The x402 Facilitator is a production-ready payment processing server that verifies and settles x402 payments across multiple blockchain networks.

## ✨ Features

- **Multi-Chain Support**: Base, Arbitrum, Optimism, Polygon, Solana
- **Automatic Fee Collection**: 0.1% fee on every transaction
- **High Performance**: <100ms verification, batch settlements
- **Real-time Monitoring**: Prometheus metrics, Grafana dashboards
- **Production Ready**: Docker deployment, health checks, alerts

## 🚀 Quick Start

### Installation

```bash
npm install @nirholas/x402-facilitator
# or
pnpm add @nirholas/x402-facilitator
```

### Basic Usage

```typescript
import { FacilitatorServer, FacilitatorAPI } from '@nirholas/x402-facilitator';

// Create facilitator
const facilitator = new FacilitatorServer({
  feeRateBps: 10,  // 0.1%
  minFee: '0.001',
  maxFee: '100',
  feeRecipient: '0xYourAddress',
  networks: [
    {
      chainId: 'eip155:8453',
      name: 'Base',
      rpcUrl: 'https://mainnet.base.org',
      usdcAddress: '0x833589fCD6eDb6E08f4c7C32D4f71b54bdA02913',
    },
  ],
  batchSize: 10,
  batchDelayMs: 5000,
});

// Start server
await facilitator.start();

// Create API
const api = new FacilitatorAPI(facilitator, {
  port: 3402,
  host: '0.0.0.0',
});

await api.start();
```

## 📡 API Endpoints

### Verify Payment

```bash
POST /v1/verify
Content-Type: application/json

{
  "proof": {
    "scheme": "exact",
    "network": "eip155:8453",
    "signature": "0x...",
    "payload": {
      "amount": "1.00",
      "asset": "USDC",
      "from": "0xPayer",
      "to": "0xPayee",
      "nonce": "abc123",
      "deadline": 1735689600
    }
  },
  "requirements": {
    "scheme": "exact",
    "network": "eip155:8453",
    "amount": "1.00",
    "asset": "USDC",
    "payTo": "0xPayee"
  }
}
```

### Response

```json
{
  "success": true,
  "paymentId": "550e8400-e29b-41d4-a716-446655440000",
  "status": "verified",
  "fee": "0.001"
}
```

### Settle Payment

```bash
POST /v1/settle
Content-Type: application/json

{
  "paymentId": "550e8400-e29b-41d4-a716-446655440000"
}
```

### Get Status

```bash
GET /v1/status/550e8400-e29b-41d4-a716-446655440000
```

### Health Check

```bash
GET /health
```

### Metrics (Prometheus)

```bash
GET /metrics
```

## 🐳 Docker Deployment

```bash
# Clone and configure
git clone https://github.com/nirholas/universal-crypto-mcp
cd deploy/facilitator
cp .env.example .env
# Edit .env with your configuration

# Start
./scripts/start.sh

# Check status
./scripts/health-check.sh

# View logs
./scripts/start.sh logs
```

## 📊 Monitoring

### Grafana Dashboard

Access at `http://localhost:3000` (default: admin/admin)

Pre-configured dashboards:
- Payment Overview
- Revenue Tracking
- Network Health
- Error Analysis

### Prometheus Metrics

Key metrics:
- `facilitator_payments_total` - Total payments by status
- `facilitator_volume_usd` - Total volume processed
- `facilitator_fees_usd` - Total fees collected
- `facilitator_settlement_duration_seconds` - Settlement latency

## 🔧 Configuration

| Variable | Description | Default |
|----------|-------------|---------|
| `FEE_RATE_BPS` | Fee in basis points | `10` (0.1%) |
| `MIN_FEE` | Minimum fee in USDC | `0.001` |
| `MAX_FEE` | Maximum fee in USDC | `100` |
| `FEE_RECIPIENT` | Address to receive fees | Required |
| `NETWORKS` | Comma-separated networks | `base,arbitrum` |
| `BATCH_SIZE` | Max payments per batch | `10` |
| `BATCH_DELAY_MS` | Batch wait time | `5000` |

## 🔐 Security

- All private keys stored in environment variables
- API key authentication for protected endpoints
- Rate limiting (configurable)
- Nonce tracking prevents replay attacks

## 📈 Revenue Projections

| Monthly Volume | Fee Rate | Monthly Revenue |
|----------------|----------|-----------------|
| $100,000 | 0.1% | $100 |
| $1,000,000 | 0.1% | $1,000 |
| $10,000,000 | 0.1% | $10,000 |

## 🤝 Contributing

See [CONTRIBUTING.md](../../CONTRIBUTING.md) for guidelines.

## 📄 License

Apache 2.0 - See [LICENSE](../../LICENSE)
```

### Task 4.2: Create API Documentation

Create `packages/facilitator/docs/API.md`:

```markdown
# x402 Facilitator API Reference

## Base URL

```
https://facilitator.yourdomain.com/v1
```

## Authentication

All protected endpoints require an API key:

```bash
curl -H "X-API-Key: your-api-key" https://facilitator.yourdomain.com/v1/...
```

Or use x402 payments for pay-per-use access.

---

## Endpoints

### POST /verify

Verify a payment proof and queue for settlement.

**Request Body:**

```typescript
interface VerifyRequest {
  proof: {
    scheme: 'exact' | 'upto' | 'stream';
    network: string;  // CAIP-2 format
    signature: string;
    payload: {
      amount: string;
      asset: string;
      from: string;
      to: string;
      nonce: string;
      deadline: number;
      validAfter?: number;
      validBefore?: number;
    };
  };
  requirements: {
    scheme: 'exact' | 'upto' | 'stream';
    network: string;
    amount: string;
    asset: string;
    payTo: string;
    maxAge?: number;
    description?: string;
  };
}
```

**Response:**

```typescript
interface VerifyResponse {
  success: boolean;
  paymentId?: string;
  status?: 'pending' | 'verified' | 'settling' | 'settled' | 'failed';
  fee?: string;
  error?: string;
}
```

**Status Codes:**
- `200` - Payment verified
- `400` - Invalid proof
- `402` - Insufficient amount
- `410` - Proof expired
- `501` - Unsupported network

---

### POST /settle

Trigger settlement of a verified payment.

**Request Body:**

```typescript
interface SettleRequest {
  paymentId: string;
}
```

**Response:**

```typescript
interface SettleResponse {
  success: boolean;
  paymentId: string;
  status: string;
  transaction?: string;
  error?: string;
}
```

---

### GET /status/:paymentId

Get the status of a payment.

**Response:**

```typescript
interface StatusResponse {
  found: boolean;
  payment?: {
    paymentId: string;
    status: string;
    payer: string;
    payee: string;
    amount: string;
    network: string;
    transaction?: string;
    settledAt?: number;
  };
}
```

---

### GET /analytics/overview

Get overall facilitator statistics.

**Response:**

```typescript
interface AnalyticsOverview {
  totalVolume: string;
  totalFees: string;
  totalPayments: number;
  averageSettlementTime: number;
  uptime: number;
}
```

---

### WebSocket /ws

Real-time payment events.

**Subscribe:**

```json
{
  "type": "subscribe",
  "channels": ["payments", "stats"],
  "filter": {
    "network": "eip155:8453"
  }
}
```

**Events:**

```json
{
  "type": "payment:settled",
  "data": {
    "paymentId": "...",
    "transaction": "0x...",
    "fee": "0.001"
  },
  "timestamp": 1706745600000
}
```

---

## Error Codes

| Code | Description |
|------|-------------|
| `INVALID_PROOF` | Malformed payment proof |
| `INVALID_SIGNATURE` | Signature verification failed |
| `EXPIRED_PROOF` | Payment proof has expired |
| `INSUFFICIENT_AMOUNT` | Amount less than required |
| `UNSUPPORTED_NETWORK` | Network not configured |
| `REQUIREMENTS_NOT_MET` | Proof doesn't meet requirements |

---

## Rate Limits

- Default: 1000 requests/minute per API key
- Burst: 100 requests/second
- WebSocket: 10 connections per API key

Rate limit headers:
```
X-RateLimit-Limit: 1000
X-RateLimit-Remaining: 999
X-RateLimit-Reset: 1706745660
```
```

---

## 📋 Phase Completion Checklists

### Phase 1 Checklist
- [ ] Dockerfile builds correctly
- [ ] docker-compose starts all services
- [ ] Prometheus scrapes metrics
- [ ] Alerts configured

### Phase 2 Checklist
- [ ] Database schema created
- [ ] Migrations work
- [ ] Indexes optimized

### Phase 3 Checklist
- [ ] Start script works
- [ ] Health check passes
- [ ] Logs accessible

### Phase 4 Checklist
- [ ] README complete
- [ ] API docs complete
- [ ] Deployment guide written

---

## ⏭️ After Deployment Completion

### Your Next Project: Documentation Site

Build a proper documentation website:

**See:** `AGENT_5_PHASE2_DOCS_SITE.md`

Key components:
1. Docusaurus or MkDocs site
2. API reference auto-generation
3. Tutorials and guides
4. Search functionality

---

## 🔗 Files You'll Create

```
deploy/facilitator/
├── Dockerfile
├── docker-compose.yml
├── .env.example
├── init.sql
├── prometheus.yml
├── alerts.yml
├── alertmanager.yml
├── nginx.conf
├── grafana/
│   ├── provisioning/
│   │   ├── dashboards/
│   │   └── datasources/
│   └── dashboards/
│       └── facilitator.json
└── scripts/
    ├── start.sh
    ├── health-check.sh
    └── backup.sh

packages/facilitator/
├── README.md
└── docs/
    ├── API.md
    ├── DEPLOYMENT.md
    └── TROUBLESHOOTING.md
```
