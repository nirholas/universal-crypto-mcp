# Deployment Platforms

Deploy your monetized API to any major cloud platform with a single command.

---

## Quick Comparison

| Platform | Best For | Deploy Time | Free Tier | Auto-Scale |
|----------|----------|-------------|-----------|------------|
| **Railway** | General APIs | ~2 min | $5/month credit | ✅ |
| **Fly.io** | Edge/Global | ~3 min | Yes | ✅ |
| **Vercel** | Next.js/Serverless | ~1 min | Yes | ✅ |
| **Docker** | Self-hosted | ~30 sec | N/A | Manual |

---

## Railway Deployment

Railway is the recommended platform for most use cases.

### Prerequisites

1. Create account at [railway.app](https://railway.app)
2. Generate API token: [railway.app/account/tokens](https://railway.app/account/tokens)
3. Set environment variable:

```bash
export RAILWAY_TOKEN=your_token_here
```

### Deploy to Railway

```bash
# Basic deployment
x402-deploy deploy --provider railway

# With specific region
x402-deploy deploy --provider railway --region us-east-1

# Preview without deploying
x402-deploy deploy --provider railway --dry-run
```

### Railway Configuration

In your `x402.config.json`:

```json
{
  "deploy": {
    "provider": "railway",
    "region": "us-east-1",
    "environment": {
      "NODE_ENV": "production"
    },
    "scaling": {
      "min": 1,
      "max": 10
    },
    "healthCheck": {
      "path": "/health",
      "interval": 30
    }
  }
}
```

### Railway Regions

| Region | Code | Location |
|--------|------|----------|
| US East | `us-east-1` | Virginia |
| US West | `us-west-1` | Oregon |
| EU West | `eu-west-1` | Amsterdam |
| Asia | `asia-southeast-1` | Singapore |

---

## Fly.io Deployment

Best for global edge deployment with low latency.

### Prerequisites

1. Install flyctl:

```bash
# macOS/Linux
curl -L https://fly.io/install.sh | sh

# Windows
powershell -Command "iwr https://fly.io/install.ps1 -useb | iex"
```

2. Authenticate:

```bash
fly auth login
```

### Deploy to Fly.io

```bash
# Basic deployment
x402-deploy deploy --provider fly

# Multi-region deployment
x402-deploy deploy --provider fly --region iad,lhr,sin

# With specific app name
x402-deploy deploy --provider fly --name my-api
```

### Fly.io Configuration

In your `x402.config.json`:

```json
{
  "deploy": {
    "provider": "fly",
    "regions": ["iad", "lhr", "sin"],
    "environment": {
      "NODE_ENV": "production"
    },
    "scaling": {
      "min": 1,
      "max": 10,
      "memory": "512mb",
      "cpuKind": "shared"
    }
  }
}
```

### Fly.io Regions

| Code | Location |
|------|----------|
| `iad` | Washington, D.C. |
| `lhr` | London |
| `cdg` | Paris |
| `fra` | Frankfurt |
| `sin` | Singapore |
| `hkg` | Hong Kong |
| `nrt` | Tokyo |
| `syd` | Sydney |
| `gru` | São Paulo |

---

## Vercel Deployment

Ideal for Next.js applications and serverless functions.

### Prerequisites

1. Create account at [vercel.com](https://vercel.com)
2. Generate token: [vercel.com/account/tokens](https://vercel.com/account/tokens)
3. Set environment variable:

```bash
export VERCEL_TOKEN=your_token_here
```

### Deploy to Vercel

```bash
# Basic deployment
x402-deploy deploy --provider vercel

# Production deployment
x402-deploy deploy --provider vercel --prod

# Preview deployment
x402-deploy deploy --provider vercel --preview
```

### Vercel Configuration

In your `x402.config.json`:

```json
{
  "deploy": {
    "provider": "vercel",
    "region": "iad1",
    "framework": "nextjs",
    "environment": {
      "NODE_ENV": "production"
    },
    "functions": {
      "maxDuration": 30,
      "memory": 1024
    }
  }
}
```

### Vercel Regions

| Code | Location |
|------|----------|
| `iad1` | Washington, D.C. |
| `sfo1` | San Francisco |
| `dub1` | Dublin |
| `hnd1` | Tokyo |
| `syd1` | Sydney |
| `gru1` | São Paulo |

---

## Docker Deployment

For self-hosted or custom infrastructure.

### Generate Docker Files

```bash
# Generate Dockerfile and docker-compose.yml
x402-deploy deploy --provider docker

# Build and run locally
docker-compose up -d
```

### Generated Files

**Dockerfile:**

```dockerfile
FROM node:20-alpine

WORKDIR /app
COPY package*.json ./
RUN npm ci --production
COPY . .
RUN npm run build

EXPOSE 3000
ENV NODE_ENV=production

CMD ["npm", "start"]
```

**docker-compose.yml:**

```yaml
version: '3.8'
services:
  api:
    build: .
    ports:
      - "3000:3000"
    environment:
      - NODE_ENV=production
      - X402_WALLET=${X402_WALLET}
    healthcheck:
      test: ["CMD", "curl", "-f", "http://localhost:3000/health"]
      interval: 30s
      timeout: 10s
      retries: 3
```

### Docker Configuration

In your `x402.config.json`:

```json
{
  "deploy": {
    "provider": "docker",
    "port": 3000,
    "environment": {
      "NODE_ENV": "production"
    },
    "compose": {
      "version": "3.8",
      "volumes": ["./data:/app/data"],
      "networks": ["x402-network"]
    }
  }
}
```

### Running Docker

```bash
# Build image
docker build -t my-x402-api .

# Run container
docker run -d \
  -p 3000:3000 \
  -e X402_WALLET=0x... \
  -e X402_NETWORK=eip155:8453 \
  my-x402-api

# With docker-compose
docker-compose up -d
docker-compose logs -f
docker-compose down
```

---

## Kubernetes Deployment

For enterprise-scale deployments.

```bash
# Generate Kubernetes manifests
x402-deploy deploy --provider kubernetes
```

### Generated Manifests

**deployment.yaml:**

```yaml
apiVersion: apps/v1
kind: Deployment
metadata:
  name: x402-api
spec:
  replicas: 3
  selector:
    matchLabels:
      app: x402-api
  template:
    metadata:
      labels:
        app: x402-api
    spec:
      containers:
      - name: api
        image: my-x402-api:latest
        ports:
        - containerPort: 3000
        env:
        - name: X402_WALLET
          valueFrom:
            secretKeyRef:
              name: x402-secrets
              key: wallet
        resources:
          requests:
            memory: "256Mi"
            cpu: "250m"
          limits:
            memory: "512Mi"
            cpu: "500m"
        livenessProbe:
          httpGet:
            path: /health
            port: 3000
          initialDelaySeconds: 30
          periodSeconds: 10
---
apiVersion: v1
kind: Service
metadata:
  name: x402-api
spec:
  selector:
    app: x402-api
  ports:
  - port: 80
    targetPort: 3000
  type: LoadBalancer
```

---

## Deployment Commands Reference

```bash
# Deploy to default provider
x402-deploy deploy

# Specify provider
x402-deploy deploy --provider railway
x402-deploy deploy --provider fly
x402-deploy deploy --provider vercel
x402-deploy deploy --provider docker

# Dry run (preview without deploying)
x402-deploy deploy --dry-run

# Force rebuild
x402-deploy deploy --force

# Deploy specific environment
x402-deploy deploy --env production
x402-deploy deploy --env staging

# View deployment status
x402-deploy status

# View logs
x402-deploy logs
x402-deploy logs -f  # Follow logs

# Rollback
x402-deploy rollback
x402-deploy rollback --version v1.2.3
```

---

## Custom Domain Setup

### Railway

```bash
# Add custom domain
railway domain add api.mysite.com
```

### Fly.io

```bash
# Add certificate
fly certs add api.mysite.com
```

### Vercel

Custom domains are managed in the Vercel dashboard or via:

```bash
vercel domains add api.mysite.com
```

---

## Environment Variables

Set sensitive values as environment variables on your platform:

| Variable | Description |
|----------|-------------|
| `X402_WALLET` | Ethereum wallet address |
| `X402_PRIVATE_KEY` | Wallet private key (for signing) |
| `X402_FACILITATOR` | Payment facilitator URL |
| `X402_NETWORK` | Blockchain network |

---

## Monitoring & Health Checks

All deployments include automatic health checks:

```bash
# Check status
x402-deploy status

# View health endpoint
curl https://your-api.railway.app/health
```

Response:

```json
{
  "status": "healthy",
  "version": "1.0.0",
  "uptime": 3600,
  "x402": {
    "enabled": true,
    "network": "eip155:8453",
    "wallet": "0x742d..."
  }
}
```

---

## Next Steps

- [Pricing Strategies](pricing.md) - Configure your pricing
- [Dashboard Guide](dashboard.md) - Monitor earnings
- [API Reference](api.md) - Programmatic usage

---

[← Back to Docs](../README.md)
