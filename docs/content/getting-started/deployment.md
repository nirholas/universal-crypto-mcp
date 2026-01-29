# Deployment

This guide covers deploying Universal Crypto MCP to production environments.

## Deployment Options

### Option 1: NPX (Simplest)

For quick testing and development:

```bash
npx @nirholas/universal-crypto-mcp
```

### Option 2: Global Installation

For dedicated servers:

```bash
npm install -g @nirholas/universal-crypto-mcp
universal-crypto-mcp
```

### Option 3: Docker

For containerized deployments:

```bash
docker run -d \
  --name universal-crypto-mcp \
  -p 3000:3000 \
  -e X402_PRIVATE_KEY=$X402_PRIVATE_KEY \
  -e COINGECKO_API_KEY=$COINGECKO_API_KEY \
  nirholas/universal-crypto-mcp:latest
```

### Option 4: Custom Server

For full control, build your own server:

```typescript
import { createServer } from "@nirholas/universal-crypto-mcp";

const server = createServer({
  transport: "http",
  port: 3000,
  modules: ["trading", "market-data", "defi"],
});

server.start();
```

## Docker Deployment

### Dockerfile

```dockerfile
FROM node:20-alpine

WORKDIR /app

# Install the package
RUN npm install -g @nirholas/universal-crypto-mcp

# Expose port for HTTP mode
EXPOSE 3000

# Start in HTTP mode
CMD ["universal-crypto-mcp", "--http", "--port", "3000"]
```

### Docker Compose

```yaml
version: "3.8"

services:
  mcp-server:
    image: nirholas/universal-crypto-mcp:latest
    ports:
      - "3000:3000"
    environment:
      - MCP_TRANSPORT=http
      - MCP_PORT=3000
      - LOG_LEVEL=INFO
      - X402_PRIVATE_KEY=${X402_PRIVATE_KEY}
      - COINGECKO_API_KEY=${COINGECKO_API_KEY}
      - BINANCE_API_KEY=${BINANCE_API_KEY}
      - BINANCE_API_SECRET=${BINANCE_API_SECRET}
    restart: unless-stopped
    healthcheck:
      test: ["CMD", "curl", "-f", "http://localhost:3000/health"]
      interval: 30s
      timeout: 10s
      retries: 3
```

## Cloud Deployments

### AWS EC2

1. Launch an EC2 instance (t3.small or larger)
2. Install Node.js and npm
3. Install Universal Crypto MCP
4. Configure systemd service

```bash
# Install Node.js
curl -fsSL https://deb.nodesource.com/setup_20.x | sudo -E bash -
sudo apt-get install -y nodejs

# Install package
sudo npm install -g @nirholas/universal-crypto-mcp

# Create systemd service
sudo nano /etc/systemd/system/universal-crypto-mcp.service
```

Systemd service file:

```ini
[Unit]
Description=Universal Crypto MCP Server
After=network.target

[Service]
Type=simple
User=ubuntu
Environment=NODE_ENV=production
Environment=MCP_TRANSPORT=http
Environment=MCP_PORT=3000
ExecStart=/usr/bin/universal-crypto-mcp
Restart=always
RestartSec=10

[Install]
WantedBy=multi-user.target
```

```bash
# Enable and start
sudo systemctl daemon-reload
sudo systemctl enable universal-crypto-mcp
sudo systemctl start universal-crypto-mcp
```

### Google Cloud Run

```yaml
# cloudbuild.yaml
steps:
  - name: "gcr.io/cloud-builders/docker"
    args: ["build", "-t", "gcr.io/$PROJECT_ID/universal-crypto-mcp", "."]
  - name: "gcr.io/cloud-builders/docker"
    args: ["push", "gcr.io/$PROJECT_ID/universal-crypto-mcp"]
  - name: "gcr.io/google.com/cloudsdktool/cloud-sdk"
    args:
      - gcloud
      - run
      - deploy
      - universal-crypto-mcp
      - --image=gcr.io/$PROJECT_ID/universal-crypto-mcp
      - --platform=managed
      - --region=us-central1
      - --allow-unauthenticated
```

### Vercel (Serverless)

For HTTP endpoints only:

```javascript
// api/mcp.js
import { createHandler } from "@nirholas/universal-crypto-mcp/serverless";

export default createHandler({
  modules: ["market-data"],
});
```

## Nginx Reverse Proxy

```nginx
upstream mcp_backend {
    server 127.0.0.1:3000;
}

server {
    listen 80;
    server_name mcp.yourdomain.com;
    return 301 https://$server_name$request_uri;
}

server {
    listen 443 ssl http2;
    server_name mcp.yourdomain.com;

    ssl_certificate /etc/letsencrypt/live/mcp.yourdomain.com/fullchain.pem;
    ssl_certificate_key /etc/letsencrypt/live/mcp.yourdomain.com/privkey.pem;

    location / {
        proxy_pass http://mcp_backend;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection "upgrade";
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }
}
```

## Environment Configuration

### Production Checklist

- [ ] Set `NODE_ENV=production`
- [ ] Configure proper logging (`LOG_LEVEL=INFO`)
- [ ] Set up health checks
- [ ] Configure rate limiting
- [ ] Enable HTTPS
- [ ] Set up monitoring

### Secrets Management

Use environment variables for sensitive data:

```bash
# Use a secrets manager
export X402_PRIVATE_KEY=$(aws secretsmanager get-secret-value --secret-id x402-key --query SecretString --output text)
```

### Health Checks

The server exposes a health endpoint:

```bash
curl http://localhost:3000/health
# {"status":"healthy","version":"1.0.0","uptime":12345}
```

## Monitoring

### Prometheus Metrics

Enable metrics collection:

```bash
MCP_METRICS=true universal-crypto-mcp --http
```

Metrics endpoint: `http://localhost:3000/metrics`

### Logging

Configure structured logging:

```json
{
  "logging": {
    "level": "INFO",
    "format": "json",
    "output": "stdout"
  }
}
```

### Alerting

Set up alerts for:
- High error rate
- Slow response times
- Memory usage
- Failed health checks

## Security Considerations

### Network Security

- Use HTTPS in production
- Configure firewall rules
- Use VPC for cloud deployments

### API Key Rotation

Rotate API keys regularly:

```bash
# Update secrets without downtime
kubectl set env deployment/mcp-server COINGECKO_API_KEY=new-key
```

### Rate Limiting

Configure rate limiting in nginx or at the application level:

```nginx
limit_req_zone $binary_remote_addr zone=mcp:10m rate=10r/s;

location / {
    limit_req zone=mcp burst=20 nodelay;
    proxy_pass http://mcp_backend;
}
```

## Scaling

### Horizontal Scaling

Run multiple instances behind a load balancer:

```yaml
# kubernetes deployment
apiVersion: apps/v1
kind: Deployment
metadata:
  name: universal-crypto-mcp
spec:
  replicas: 3
  selector:
    matchLabels:
      app: universal-crypto-mcp
  template:
    spec:
      containers:
        - name: mcp
          image: nirholas/universal-crypto-mcp:latest
          ports:
            - containerPort: 3000
          resources:
            requests:
              memory: "256Mi"
              cpu: "100m"
            limits:
              memory: "512Mi"
              cpu: "500m"
```

### Vertical Scaling

For memory-intensive operations:

```yaml
resources:
  requests:
    memory: "512Mi"
    cpu: "250m"
  limits:
    memory: "2Gi"
    cpu: "2000m"
```

## Next Steps

- [Package Overview](../packages/overview.md) - Explore all packages
- [x402 Payments](../x402-deploy/overview.md) - Set up AI payments
- [API Reference](../api-reference/index.md) - Full API documentation
