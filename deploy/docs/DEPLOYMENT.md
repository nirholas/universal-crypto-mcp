# Deployment Guide

Production deployment instructions for the Universal Crypto MCP Gateway.

## Prerequisites

- Node.js 20+ (LTS recommended)
- pnpm 8+
- Redis 7+ (optional, recommended for production)
- Docker (for containerized deployment)
- Kubernetes cluster (for K8s deployment)

## Environment Configuration

### Required Variables

```bash
# Server Configuration
PORT=3000
NODE_ENV=production
LOG_LEVEL=info

# x402 Payment Configuration
X402_WALLET_ADDRESS=0xB1314Ed50b273A9c1dA9a43860d853F179868296
X402_NETWORK=base
X402_TOKEN=USDC
X402_FACILITATOR_URL=https://facilitator.x402.ai

# Redis (Production)
REDIS_ENABLED=true
REDIS_HOST=redis.example.com
REDIS_PORT=6379
REDIS_PASSWORD=your-redis-password
REDIS_DB=0

# CORS
CORS_ORIGINS=https://app.example.com,https://dashboard.example.com

# MCP Server API Keys
COINGECKO_API_KEY=cg_xxx
DUNE_API_KEY=dune_xxx
ALCHEMY_API_KEY=alchemy_xxx
INFURA_API_KEY=infura_xxx
OPENSEA_API_KEY=opensea_xxx
```

### Optional Variables

```bash
# API Rate Limiting
RATE_LIMIT_WINDOW_MS=60000
RATE_LIMIT_MAX_FREE=10
RATE_LIMIT_MAX_PAID=10000

# Monitoring
SENTRY_DSN=https://xxx@sentry.io/xxx
PROMETHEUS_PORT=9090

# Advanced
MAX_MCP_SERVERS=20
MCP_SERVER_TIMEOUT=30000
REQUEST_TIMEOUT=60000
```

## Deployment Options

### 1. Docker (Recommended)

#### Build Image

```bash
# From deploy directory
docker build -t ucm-gateway:latest .
```

#### Run Container

```bash
docker run -d \
  --name ucm-gateway \
  -p 3000:3000 \
  -p 9090:9090 \
  --env-file .env \
  --restart unless-stopped \
  ucm-gateway:latest
```

#### Docker Compose

```yaml
# docker-compose.yml
version: '3.8'

services:
  gateway:
    build: .
    ports:
      - "3000:3000"
      - "9090:9090"
    env_file: .env
    depends_on:
      - redis
    restart: unless-stopped
    healthcheck:
      test: ["CMD", "curl", "-f", "http://localhost:3000/health"]
      interval: 30s
      timeout: 10s
      retries: 3

  redis:
    image: redis:7-alpine
    ports:
      - "6379:6379"
    volumes:
      - redis-data:/data
    restart: unless-stopped

volumes:
  redis-data:
```

Run:

```bash
docker-compose up -d
```

### 2. Kubernetes

#### Create Namespace

```bash
kubectl create namespace ucm-gateway
```

#### Create Secret

```bash
kubectl create secret generic ucm-secrets \
  --from-env-file=.env \
  -n ucm-gateway
```

#### Deploy Gateway

```yaml
# k8s/deployment.yaml
apiVersion: apps/v1
kind: Deployment
metadata:
  name: ucm-gateway
  namespace: ucm-gateway
spec:
  replicas: 3
  selector:
    matchLabels:
      app: ucm-gateway
  template:
    metadata:
      labels:
        app: ucm-gateway
    spec:
      containers:
      - name: gateway
        image: ucm-gateway:latest
        ports:
        - containerPort: 3000
          name: http
        - containerPort: 9090
          name: metrics
        envFrom:
        - secretRef:
            name: ucm-secrets
        resources:
          requests:
            memory: "512Mi"
            cpu: "500m"
          limits:
            memory: "2Gi"
            cpu: "2000m"
        livenessProbe:
          httpGet:
            path: /live
            port: 3000
          initialDelaySeconds: 30
          periodSeconds: 10
        readinessProbe:
          httpGet:
            path: /ready
            port: 3000
          initialDelaySeconds: 10
          periodSeconds: 5
```

```yaml
# k8s/service.yaml
apiVersion: v1
kind: Service
metadata:
  name: ucm-gateway
  namespace: ucm-gateway
spec:
  selector:
    app: ucm-gateway
  ports:
  - name: http
    port: 80
    targetPort: 3000
  - name: metrics
    port: 9090
    targetPort: 9090
  type: LoadBalancer
```

```yaml
# k8s/hpa.yaml
apiVersion: autoscaling/v2
kind: HorizontalPodAutoscaler
metadata:
  name: ucm-gateway
  namespace: ucm-gateway
spec:
  scaleTargetRef:
    apiVersion: apps/v1
    kind: Deployment
    name: ucm-gateway
  minReplicas: 3
  maxReplicas: 10
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
```

Apply:

```bash
kubectl apply -f k8s/
```

### 3. Vercel Serverless

#### Create Vercel Config

```json
{
  "version": 2,
  "builds": [
    {
      "src": "dist/gateway/index.js",
      "use": "@vercel/node"
    }
  ],
  "routes": [
    {
      "src": "/(.*)",
      "dest": "/dist/gateway/index.js"
    }
  ],
  "env": {
    "NODE_ENV": "production"
  }
}
```

#### Deploy

```bash
pnpm build
vercel --prod
```

**Note:** For Vercel, MCP servers should be deployed separately as they require long-running processes.

### 4. AWS ECS/Fargate

#### Task Definition

```json
{
  "family": "ucm-gateway",
  "networkMode": "awsvpc",
  "requiresCompatibilities": ["FARGATE"],
  "cpu": "1024",
  "memory": "2048",
  "containerDefinitions": [
    {
      "name": "gateway",
      "image": "your-ecr-repo/ucm-gateway:latest",
      "portMappings": [
        {
          "containerPort": 3000,
          "protocol": "tcp"
        }
      ],
      "environment": [
        {
          "name": "NODE_ENV",
          "value": "production"
        }
      ],
      "secrets": [
        {
          "name": "X402_WALLET_ADDRESS",
          "valueFrom": "arn:aws:secretsmanager:..."
        }
      ],
      "healthCheck": {
        "command": ["CMD-SHELL", "curl -f http://localhost:3000/health || exit 1"],
        "interval": 30,
        "timeout": 5,
        "retries": 3
      },
      "logConfiguration": {
        "logDriver": "awslogs",
        "options": {
          "awslogs-group": "/ecs/ucm-gateway",
          "awslogs-region": "us-east-1",
          "awslogs-stream-prefix": "ecs"
        }
      }
    }
  ]
}
```

#### Service Definition

```json
{
  "serviceName": "ucm-gateway",
  "cluster": "production",
  "taskDefinition": "ucm-gateway",
  "desiredCount": 3,
  "launchType": "FARGATE",
  "networkConfiguration": {
    "awsvpcConfiguration": {
      "subnets": ["subnet-xxx", "subnet-yyy"],
      "securityGroups": ["sg-xxx"],
      "assignPublicIp": "ENABLED"
    }
  },
  "loadBalancers": [
    {
      "targetGroupArn": "arn:aws:elasticloadbalancing:...",
      "containerName": "gateway",
      "containerPort": 3000
    }
  ],
  "healthCheckGracePeriodSeconds": 60
}
```

### 5. DigitalOcean App Platform

```yaml
# .do/app.yaml
name: ucm-gateway
services:
- name: api
  dockerfile_path: Dockerfile
  source_dir: /
  github:
    repo: your-org/universal-crypto-mcp
    branch: main
    deploy_on_push: true
  http_port: 3000
  instance_count: 3
  instance_size_slug: professional-s
  health_check:
    http_path: /health
  envs:
  - key: NODE_ENV
    value: production
  - key: X402_WALLET_ADDRESS
    value: ${X402_WALLET_ADDRESS}
    type: SECRET
  - key: REDIS_HOST
    value: ${redis.HOSTNAME}
    
databases:
- name: redis
  engine: REDIS
  version: "7"
  size: db-s-1vcpu-1gb
```

## Reverse Proxy Configuration

### Nginx

```nginx
upstream ucm_gateway {
    least_conn;
    server 10.0.1.10:3000;
    server 10.0.1.11:3000;
    server 10.0.1.12:3000;
}

server {
    listen 80;
    server_name api.universalcrypto.io;
    return 301 https://$server_name$request_uri;
}

server {
    listen 443 ssl http2;
    server_name api.universalcrypto.io;

    ssl_certificate /etc/nginx/ssl/cert.pem;
    ssl_certificate_key /etc/nginx/ssl/key.pem;
    ssl_protocols TLSv1.2 TLSv1.3;
    ssl_ciphers HIGH:!aNULL:!MD5;

    # Rate limiting
    limit_req_zone $binary_remote_addr zone=api_limit:10m rate=100r/s;
    limit_req zone=api_limit burst=200 nodelay;

    # CORS
    add_header 'Access-Control-Allow-Origin' '*' always;
    add_header 'Access-Control-Allow-Methods' 'GET, POST, OPTIONS' always;

    location / {
        proxy_pass http://ucm_gateway;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_cache_bypass $http_upgrade;
        
        # Timeouts
        proxy_connect_timeout 60s;
        proxy_send_timeout 60s;
        proxy_read_timeout 60s;
    }

    location /metrics {
        deny all;
        # Or whitelist specific IPs
        # allow 10.0.0.0/8;
        # deny all;
    }
}
```

### Cloudflare

1. Add DNS record pointing to your server
2. Enable Cloudflare proxy (orange cloud)
3. Configure SSL/TLS to "Full (strict)"
4. Enable "Always Use HTTPS"
5. Set up Page Rules for caching:
   - `api.universalcrypto.io/api/v1/prices/*` → Cache Everything, Edge TTL: 1 minute

## Monitoring Setup

### Prometheus

```yaml
# prometheus.yml
global:
  scrape_interval: 15s
  evaluation_interval: 15s

scrape_configs:
  - job_name: 'ucm-gateway'
    static_configs:
      - targets: ['gateway:9090']
    metrics_path: '/metrics'
```

### Grafana Dashboard

Import dashboard ID: `14282` (Node.js Application Dashboard)

Custom queries:
```promql
# Request rate
rate(http_requests_total[5m])

# Error rate
rate(http_requests_total{status=~"5.."}[5m])

# Latency p95
histogram_quantile(0.95, rate(http_request_duration_seconds_bucket[5m]))

# Active MCP servers
mcp_servers_active

# Payment success rate
rate(x402_payments_total{status="success"}[5m])
```

### Logging

Use structured JSON logging:

```bash
# Ship logs to Elasticsearch
docker run -d \
  --name filebeat \
  --volume="$(pwd)/filebeat.yml:/usr/share/filebeat/filebeat.yml:ro" \
  --volume="/var/lib/docker/containers:/var/lib/docker/containers:ro" \
  docker.elastic.co/beats/filebeat:8.0.0
```

## Production Checklist

### Security
- [ ] HTTPS enabled with valid certificate
- [ ] Environment variables secured (not in code)
- [ ] API keys rotated regularly
- [ ] Rate limiting configured
- [ ] CORS properly configured
- [ ] Security headers enabled (Helmet)
- [ ] DDoS protection active

### Performance
- [ ] Redis cache configured
- [ ] CDN enabled for static content
- [ ] Gzip compression enabled
- [ ] Connection pooling configured
- [ ] Load balancer health checks working

### Monitoring
- [ ] Prometheus metrics exposed
- [ ] Grafana dashboards created
- [ ] Log aggregation configured
- [ ] Alerts configured (PagerDuty/Opsgenie)
- [ ] Uptime monitoring (Pingdom/UptimeRobot)

### Reliability
- [ ] Auto-scaling configured
- [ ] Health checks passing
- [ ] Graceful shutdown tested
- [ ] Database backups scheduled
- [ ] Disaster recovery plan documented

### Operations
- [ ] CI/CD pipeline configured
- [ ] Blue-green deployment strategy
- [ ] Rollback procedure documented
- [ ] On-call rotation established
- [ ] Runbooks created

## Scaling Guidelines

### Vertical Scaling

```yaml
resources:
  requests:
    memory: "1Gi"    # Start
    cpu: "1000m"
  limits:
    memory: "4Gi"    # Scale up
    cpu: "4000m"
```

### Horizontal Scaling

```bash
# Kubernetes
kubectl scale deployment ucm-gateway --replicas=10

# Docker Swarm
docker service scale ucm-gateway=10
```

### Performance Tuning

```bash
# Node.js
NODE_OPTIONS="--max-old-space-size=4096"

# Process count
UV_THREADPOOL_SIZE=128
```

## Troubleshooting

### High Memory Usage
1. Check MCP server count
2. Monitor heap usage
3. Increase limits or scale horizontally

### Slow Response Times
1. Check MCP server health
2. Review Redis connection pool
3. Enable response caching

### Payment Failures
1. Verify x402 facilitator connectivity
2. Check wallet balance
3. Review signature validation logs

## Support

- Documentation: https://docs.universal-crypto-mcp.com
- Discord: https://discord.gg/universal-crypto
- Email: support@universal-crypto-mcp.com

