# Universal Crypto MCP - Enterprise Deployment

Production-ready deployment for all MCP Servers and APIs with x402 payment processing.

## 🏗️ Architecture

```
                    ┌──────────────────┐
                    │   Cloudflare     │
                    │   (CDN/DDoS)     │
                    └────────┬─────────┘
                             │
                    ┌────────▼─────────┐
                    │  NGINX Ingress   │
                    │  (TLS/Rate Limit)│
                    └────────┬─────────┘
                             │
              ┌──────────────┼──────────────┐
              │              │              │
       ┌──────▼──────┐ ┌─────▼──────┐ ┌─────▼──────┐
       │  Gateway    │ │  Gateway   │ │  Gateway   │
       │  Pod #1     │ │  Pod #2    │ │  Pod #3    │
       └──────┬──────┘ └─────┬──────┘ └─────┬──────┘
              │              │              │
              └──────────────┼──────────────┘
                             │
         ┌───────────────────┼───────────────────┐
         │                   │                   │
    ┌────▼────┐       ┌──────▼──────┐     ┌──────▼──────┐
    │  Redis  │       │  Prometheus │     │  PostgreSQL │
    │  Cache  │       │  Metrics    │     │  (Optional) │
    └─────────┘       └─────────────┘     └─────────────┘
```

## 💰 x402 Payment Flow

```
Client ──► Request ──► x402 Gateway ──► Payment Check
                                              │
                    ┌─────────────────────────┤
                    │                         │
               [No Payment]              [Has Payment]
                    │                         │
                    ▼                         ▼
            402 Payment Required         Verify Signature
                    │                         │
                    │                    ┌────┴────┐
                    │                    │         │
                    │              [Invalid]   [Valid]
                    │                    │         │
                    │                    ▼         ▼
                    │               401 Error   Process Request
                    │                              │
                    └──────────────────────────────┘
                                                   │
                                              Track Usage
                                                   │
                                              Return Response
```

## 🚀 Quick Start

### Docker Compose (Development/Staging)

```bash
# Copy environment template
cp .env.example .env

# Edit with your configuration
nano .env

# Start all services
docker-compose up -d

# View logs
docker-compose logs -f gateway

# Check health
curl http://localhost:3000/health
```

### Kubernetes (Production)

```bash
# Apply all manifests
kubectl apply -f k8s/

# Or step by step:
kubectl apply -f k8s/00-namespace.yaml
kubectl apply -f k8s/01-secrets.yaml
kubectl apply -f k8s/02-deployment.yaml
kubectl apply -f k8s/03-service.yaml
kubectl apply -f k8s/04-ingress.yaml
kubectl apply -f k8s/05-hpa.yaml
kubectl apply -f k8s/06-redis.yaml

# Check status
kubectl -n ucm get pods
kubectl -n ucm get svc
kubectl -n ucm get ingress

# View logs
kubectl -n ucm logs -f deployment/ucm-gateway
```

## ⚙️ Configuration

### Environment Variables

| Variable | Description | Default |
|----------|-------------|---------|
| `NODE_ENV` | Environment mode | `production` |
| `PORT` | Server port | `3000` |
| `PAYMENT_WALLET` | Wallet to receive payments | Required |
| `REDIS_URL` | Redis connection URL | `redis://localhost:6379` |
| `DATABASE_URL` | PostgreSQL connection URL | Optional |
| `RATE_LIMIT_WINDOW` | Rate limit window (seconds) | `60` |
| `RATE_LIMIT_MAX_REQUESTS` | Max requests per window | `100` |
| `LOG_LEVEL` | Logging level | `info` |

### x402 Configuration

| Variable | Description | Default |
|----------|-------------|---------|
| `X402_NETWORK` | Blockchain network | `eip155:8453` (Base) |
| `X402_FACILITATOR_URL` | Payment facilitator | `https://x402.org` |
| `X402_RESOURCE` | Resource identifier | `universal-crypto-mcp` |

### Pricing Tiers

Edit pricing in the gateway configuration:

```typescript
const pricingTiers = {
  free: { requestsPerHour: 10, price: 0 },
  basic: { requestsPerHour: 1000, price: 0.001 },    // $0.001/request
  pro: { requestsPerHour: 10000, price: 0.0001 },    // $0.0001/request
  enterprise: { requestsPerHour: Infinity, price: 0.00001 }
};
```

## 📊 Monitoring

### Endpoints

| Endpoint | Description |
|----------|-------------|
| `/health` | Full health check |
| `/health/live` | Kubernetes liveness probe |
| `/health/ready` | Kubernetes readiness probe |
| `/metrics` | Prometheus metrics |

### Grafana Dashboards

Access Grafana at `http://localhost:3001` (default credentials: admin/admin)

Pre-configured dashboards:
- **x402 Payments** - Revenue, payment success rate, top payers
- **Request Metrics** - RPS, latency percentiles, error rates
- **Resource Usage** - CPU, memory, connections

### Prometheus Alerts

Configured alerts:
- High error rate (>5% for 5 minutes)
- High latency (p99 >2s for 5 minutes)
- Low payment success rate (<95% for 10 minutes)
- Gateway down (0 healthy pods for 1 minute)
- High memory usage (>80% for 10 minutes)
- Rate limit exceeded (>1000 429s in 5 minutes)

## 🔒 Security

### TLS/SSL

```bash
# Generate self-signed cert (development)
openssl req -x509 -nodes -days 365 -newkey rsa:2048 \
  -keyout tls.key -out tls.crt \
  -subj "/CN=api.universal-crypto.io"

# Create Kubernetes secret
kubectl -n ucm create secret tls ucm-tls \
  --cert=tls.crt --key=tls.key
```

### Production TLS with cert-manager

```bash
# Install cert-manager
kubectl apply -f https://github.com/cert-manager/cert-manager/releases/download/v1.13.0/cert-manager.yaml

# Create ClusterIssuer
kubectl apply -f - <<EOF
apiVersion: cert-manager.io/v1
kind: ClusterIssuer
metadata:
  name: letsencrypt-prod
spec:
  acme:
    server: https://acme-v02.api.letsencrypt.org/directory
    email: your-email@example.com
    privateKeySecretRef:
      name: letsencrypt-prod
    solvers:
      - http01:
          ingress:
            class: nginx
EOF
```

### Secrets Management

For production, use external secrets management:

```bash
# AWS Secrets Manager
kubectl apply -f https://raw.githubusercontent.com/aws/secrets-store-csi-driver-provider-aws/main/deployment/aws-provider-installer.yaml

# HashiCorp Vault
helm install vault hashicorp/vault
```

## 🔧 Operations

### Scaling

```bash
# Manual scaling
kubectl -n ucm scale deployment ucm-gateway --replicas=5

# Check HPA status
kubectl -n ucm get hpa

# View scaling events
kubectl -n ucm describe hpa ucm-gateway-hpa
```

### Rolling Updates

```bash
# Update image
kubectl -n ucm set image deployment/ucm-gateway gateway=ucm-gateway:v2.0.0

# Check rollout status
kubectl -n ucm rollout status deployment/ucm-gateway

# Rollback if needed
kubectl -n ucm rollout undo deployment/ucm-gateway
```

### Backup Redis

```bash
# Trigger backup
kubectl -n ucm exec redis-0 -- redis-cli BGSAVE

# Copy backup
kubectl -n ucm cp redis-0:/data/dump.rdb ./redis-backup.rdb
```

## 📈 Performance Tuning

### Node.js

```yaml
env:
  - name: NODE_OPTIONS
    value: "--max-old-space-size=512 --max-semi-space-size=16"
  - name: UV_THREADPOOL_SIZE
    value: "8"
```

### Redis

```yaml
command:
  - redis-server
  - --maxmemory 512mb
  - --maxmemory-policy allkeys-lru
  - --tcp-keepalive 300
  - --timeout 0
```

### Connection Pooling

Set appropriate pool sizes based on your replica count:

```bash
# Total connections = replicas * pool_size
# For 3 replicas with pool_size=10: 30 total connections
REDIS_POOL_SIZE=10
```

## 🧪 Testing

### Load Testing

```bash
# Install k6
brew install k6

# Run load test
k6 run - <<EOF
import http from 'k6/http';
import { check, sleep } from 'k6';

export const options = {
  vus: 100,
  duration: '5m',
};

export default function () {
  const res = http.get('https://api.universal-crypto.io/health');
  check(res, { 'status was 200': (r) => r.status == 200 });
  sleep(1);
}
EOF
```

### Payment Flow Test

```bash
# Test without payment (should return 402)
curl -v https://api.universal-crypto.io/mcp/defi/swap

# Test with payment header
curl -v -H "X-Payment: <payment-token>" \
  https://api.universal-crypto.io/mcp/defi/swap
```

## 📋 Troubleshooting

### Gateway Not Starting

```bash
# Check logs
kubectl -n ucm logs deployment/ucm-gateway

# Check events
kubectl -n ucm get events --sort-by='.lastTimestamp'

# Describe pod
kubectl -n ucm describe pod -l app=ucm-gateway
```

### Payment Verification Failing

1. Check facilitator connectivity:
```bash
curl https://x402.org/health
```

2. Verify wallet configuration:
```bash
kubectl -n ucm get secret ucm-secrets -o jsonpath='{.data.PAYMENT_WALLET}' | base64 -d
```

3. Check payment logs:
```bash
kubectl -n ucm logs deployment/ucm-gateway | grep -i payment
```

### High Latency

1. Check Redis connection:
```bash
kubectl -n ucm exec -it deployment/ucm-gateway -- redis-cli -h redis ping
```

2. Check network policies:
```bash
kubectl -n ucm get networkpolicy
```

3. Review HPA scaling:
```bash
kubectl -n ucm describe hpa ucm-gateway-hpa
```

## 📞 Support

- **Documentation**: https://universal-crypto.io/docs
- **Issues**: https://github.com/nirholas/universal-crypto-mcp/issues
- **Discord**: https://discord.gg/universal-crypto

## 📄 License

MIT License - see [LICENSE](../LICENSE)
