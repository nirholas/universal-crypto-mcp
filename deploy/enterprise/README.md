# Universal Crypto MCP - Enterprise Deployment

> Production-ready deployment with x402 payment integration, rate limiting, and full observability.

## 🚀 Quick Start

```bash
# 1. Clone and navigate
cd deploy/enterprise

# 2. Configure environment
cp .env.example .env
# Edit .env with your settings

# 3. Deploy
./scripts/deploy.sh
```

## 📋 Prerequisites

- Docker 24.0+
- Docker Compose v2
- 4GB RAM minimum (8GB recommended)
- Domain name (for production SSL)
- Wallet address for receiving payments

## 🏗️ Architecture

```
┌─────────────────────────────────────────────────────────────────┐
│                         NGINX (TLS)                              │
│                     Rate Limiting + Caching                      │
└─────────────────────────┬───────────────────────────────────────┘
                          │
┌─────────────────────────▼───────────────────────────────────────┐
│                     UCM GATEWAY                                  │
│              x402 Payment Verification                           │
│           Subscription & API Key Management                      │
└─────────────────────────┬───────────────────────────────────────┘
                          │
        ┌─────────────────┼─────────────────┐
        │                 │                 │
        ▼                 ▼                 ▼
┌───────────────┐ ┌───────────────┐ ┌───────────────┐
│  MCP Server   │ │  MCP Server   │ │  MCP Server   │
│    (Basic)    │ │  (Premium)    │ │ (Enterprise)  │
└───────────────┘ └───────────────┘ └───────────────┘
        │                 │                 │
        └─────────────────┼─────────────────┘
                          │
        ┌─────────────────┴─────────────────┐
        │                                   │
        ▼                                   ▼
┌───────────────┐                   ┌───────────────┐
│   PostgreSQL  │                   │     Redis     │
│   (Payments)  │                   │  (Rate Limit) │
└───────────────┘                   └───────────────┘
```

## 💰 Payment Tiers

| Tier | Price | Rate Limit | Features |
|------|-------|------------|----------|
| **Free** | $0 | 10 req/min | Health, Discovery |
| **Basic** | $0.001/req | 60 req/min | Core APIs |
| **Premium** | $0.0005/req | 300 req/min | All MCP packages |
| **Enterprise** | $0.0002/req | 1000 req/min | Priority support |

### Subscription Plans

| Plan | Price | Duration | Discount |
|------|-------|----------|----------|
| Monthly | $29-99 | 30 days | - |
| Annual | $290-990 | 365 days | ~17% off |

## 🔧 Configuration

### Required Environment Variables

```env
# Your wallet to receive payments
WALLET_ADDRESS=0x...

# Database credentials
POSTGRES_PASSWORD=your_secure_password

# JWT secret for API keys
JWT_SECRET=your_jwt_secret_at_least_32_chars

# Domain (for SSL)
DOMAIN=api.yourservice.com
```

### Optional Configuration

```env
# Pricing (defaults shown)
BASIC_PRICE_PER_REQUEST=0.001
PREMIUM_PRICE_PER_REQUEST=0.0005
ENTERPRISE_PRICE_PER_REQUEST=0.0002

# Rate limits
BASIC_RATE_LIMIT=60
PREMIUM_RATE_LIMIT=300
ENTERPRISE_RATE_LIMIT=1000

# Supported networks
SUPPORTED_NETWORKS=eip155:8453,eip155:42161,eip155:137
```

## 📊 Monitoring

### Dashboards

| Service | URL | Purpose |
|---------|-----|---------|
| Grafana | http://localhost:3001 | Dashboards & visualization |
| Prometheus | http://localhost:9090 | Metrics & queries |
| AlertManager | http://localhost:9093 | Alert management |

### Pre-built Dashboards

1. **Revenue Dashboard** - Real-time payment tracking
2. **API Usage** - Request rates, latencies, errors
3. **System Health** - Resource usage, uptime

### Alerts

Configured alerts for:
- Payment gateway down
- High failure rates
- Database issues
- Rate limit abuse
- Revenue milestones

## 🔐 SSL/TLS

### Development (Self-signed)

```bash
./scripts/ssl-setup.sh --self-signed
```

### Production (Let's Encrypt)

```bash
./scripts/ssl-setup.sh --letsencrypt --domain api.yourservice.com
```

Auto-renewal is configured via cron job.

## 💾 Backups

### Create Backup

```bash
./scripts/backup.sh backup
```

### Restore Backup

```bash
./scripts/backup.sh restore --file ucm_backup_20240101_120000.sql.gz
```

### List Backups

```bash
./scripts/backup.sh list
```

### S3 Upload

```bash
S3_BUCKET=your-bucket ./scripts/backup.sh backup --s3
```

## 🔌 API Endpoints

### Public (Free)

| Endpoint | Method | Description |
|----------|--------|-------------|
| `/health` | GET | Health check |
| `/api/x402/routes` | GET | Discover paid routes |

### Paid Routes

| Endpoint | Tier | Description |
|----------|------|-------------|
| `/api/v1/market/*` | Basic | Market data APIs |
| `/api/v1/defi/*` | Premium | DeFi operations |
| `/api/v1/trading/*` | Premium | Trading APIs |
| `/api/v1/enterprise/*` | Enterprise | Full access |

## 🎯 Making Requests

### Pay-per-Request (x402)

```bash
# 1. First request returns 402 with payment requirements
curl https://api.yourservice.com/api/v1/market/price \
  -H "Content-Type: application/json"

# Response: 402 Payment Required
# X-Payment-Required: true
# X-Payment-Amount: 0.001
# X-Payment-Asset: USDC

# 2. Pay via x402 client and retry with proof
```

### With API Key (Subscription)

```bash
curl https://api.yourservice.com/api/v1/market/price \
  -H "X-API-Key: your_api_key"
```

## 🛠️ Management

### View Logs

```bash
docker compose -f docker-compose.enterprise.yml logs -f gateway
```

### Restart Services

```bash
docker compose -f docker-compose.enterprise.yml restart
```

### Scale MCP Servers

```bash
docker compose -f docker-compose.enterprise.yml up -d --scale mcp-server-1=3
```

### Stop Everything

```bash
docker compose -f docker-compose.enterprise.yml down
```

### Full Reset

```bash
docker compose -f docker-compose.enterprise.yml down -v
./scripts/deploy.sh
```

## 🔍 Troubleshooting

### Gateway Not Starting

```bash
docker compose -f docker-compose.enterprise.yml logs gateway
```

### Database Connection Issues

```bash
docker compose -f docker-compose.enterprise.yml exec postgres pg_isready
```

### Payment Verification Failing

Check facilitator connection:
```bash
curl https://facilitator.x402.org/health
```

### Rate Limits Not Working

Check Redis:
```bash
docker compose -f docker-compose.enterprise.yml exec redis redis-cli PING
```

## 📁 Directory Structure

```
deploy/enterprise/
├── docker-compose.enterprise.yml    # Main orchestration
├── Dockerfile.gateway               # Payment gateway image
├── .env.example                     # Environment template
├── init-db.sql                      # Database schema
├── gateway/
│   └── server.js                    # Gateway server
├── nginx/
│   └── nginx.conf                   # Reverse proxy config
├── monitoring/
│   ├── prometheus.yml               # Metrics collection
│   ├── alertmanager.yml             # Alert routing
│   ├── loki.yml                     # Log aggregation
│   ├── promtail.yml                 # Log collection
│   ├── alerts/
│   │   └── payment-alerts.yml       # Alert rules
│   └── grafana/
│       ├── dashboards/              # Dashboard JSON
│       └── provisioning/            # Auto-configuration
├── scripts/
│   ├── deploy.sh                    # Main deployment
│   ├── ssl-setup.sh                 # SSL management
│   └── backup.sh                    # Database backups
└── README.md                        # This file
```

## 🤝 Support

- **Documentation**: [docs/](../../docs/)
- **Issues**: GitHub Issues
- **Enterprise Support**: Contact via website

## 📄 License

Apache-2.0 - See [LICENSE](../../LICENSE)

