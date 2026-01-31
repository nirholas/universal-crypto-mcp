# AGENT 17: DEVOPS & DEPLOYMENT
## 5-Phase Implementation Prompts

---

## PROMPT 1: DOCKER CONTAINERIZATION

**Context:** Create Docker configuration for development and production environments.

**Objective:** Build containerized deployment for all platform components.

**Requirements:**
1. **Application Dockerfile** (`website-unified/Dockerfile`)
   ```dockerfile
   # Build stage
   FROM node:20-alpine AS builder
   
   WORKDIR /app
   
   # Install pnpm
   RUN corepack enable && corepack prepare pnpm@latest --activate
   
   # Copy package files
   COPY package.json pnpm-lock.yaml ./
   COPY prisma ./prisma/
   
   # Install dependencies
   RUN pnpm install --frozen-lockfile
   
   # Copy source
   COPY . .
   
   # Build
   ENV NEXT_TELEMETRY_DISABLED=1
   RUN pnpm build
   
   # Production stage
   FROM node:20-alpine AS runner
   
   WORKDIR /app
   
   ENV NODE_ENV=production
   ENV NEXT_TELEMETRY_DISABLED=1
   
   RUN addgroup --system --gid 1001 nodejs
   RUN adduser --system --uid 1001 nextjs
   
   COPY --from=builder /app/public ./public
   COPY --from=builder /app/.next/standalone ./
   COPY --from=builder /app/.next/static ./.next/static
   COPY --from=builder /app/prisma ./prisma
   
   USER nextjs
   
   EXPOSE 3000
   
   ENV PORT=3000
   ENV HOSTNAME="0.0.0.0"
   
   CMD ["node", "server.js"]
   ```

2. **Docker Compose Development** (`website-unified/docker-compose.dev.yml`)
   ```yaml
   version: '3.8'
   
   services:
     app:
       build:
         context: .
         dockerfile: Dockerfile.dev
       volumes:
         - .:/app
         - /app/node_modules
       ports:
         - "3000:3000"
       environment:
         - DATABASE_URL=postgresql://postgres:postgres@db:5432/app
         - REDIS_URL=redis://redis:6379
       depends_on:
         - db
         - redis
   
     db:
       image: postgres:15-alpine
       volumes:
         - postgres_data:/var/lib/postgresql/data
       environment:
         - POSTGRES_USER=postgres
         - POSTGRES_PASSWORD=postgres
         - POSTGRES_DB=app
       ports:
         - "5432:5432"
   
     redis:
       image: redis:7-alpine
       volumes:
         - redis_data:/data
       ports:
         - "6379:6379"
   
     adminer:
       image: adminer
       ports:
         - "8080:8080"
   
   volumes:
     postgres_data:
     redis_data:
   ```

3. **Docker Compose Production** (`website-unified/docker-compose.prod.yml`)
   ```yaml
   version: '3.8'
   
   services:
     app:
       image: ${DOCKER_REGISTRY}/ucm-website:${VERSION:-latest}
       deploy:
         replicas: 3
         update_config:
           parallelism: 1
           delay: 10s
         restart_policy:
           condition: on-failure
       environment:
         - NODE_ENV=production
         - DATABASE_URL=${DATABASE_URL}
         - REDIS_URL=${REDIS_URL}
       healthcheck:
         test: ["CMD", "curl", "-f", "http://localhost:3000/api/health"]
         interval: 30s
         timeout: 10s
         retries: 3
   
     nginx:
       image: nginx:alpine
       volumes:
         - ./nginx.conf:/etc/nginx/nginx.conf:ro
       ports:
         - "80:80"
         - "443:443"
       depends_on:
         - app
   
     redis:
       image: redis:7-alpine
       command: redis-server --appendonly yes
       volumes:
         - redis_data:/data
       deploy:
         replicas: 1
   
   volumes:
     redis_data:
   ```

4. **Multi-stage Build Scripts** (`website-unified/scripts/docker/`)
   ```bash
   #!/bin/bash
   # build.sh
   
   set -e
   
   VERSION=${VERSION:-$(git rev-parse --short HEAD)}
   REGISTRY=${DOCKER_REGISTRY:-ghcr.io/nirholas}
   
   echo "Building version: $VERSION"
   
   # Build application
   docker build \
     --build-arg VERSION=$VERSION \
     --build-arg BUILD_DATE=$(date -u +"%Y-%m-%dT%H:%M:%SZ") \
     -t $REGISTRY/ucm-website:$VERSION \
     -t $REGISTRY/ucm-website:latest \
     .
   
   # Push to registry
   docker push $REGISTRY/ucm-website:$VERSION
   docker push $REGISTRY/ucm-website:latest
   
   echo "Build complete: $REGISTRY/ucm-website:$VERSION"
   ```

**Technical Stack:**
- Docker multi-stage builds
- Docker Compose
- Alpine base images
- Health checks
- Volume management

**Deliverables:**
- Production Dockerfile
- Development docker-compose
- Production docker-compose
- Build scripts

---

## PROMPT 2: KUBERNETES DEPLOYMENT

**Context:** Create Kubernetes manifests for scalable cloud deployment.

**Objective:** Build K8s configuration for production deployment.

**Requirements:**
1. **Deployment Manifest** (`website-unified/k8s/deployment.yaml`)
   ```yaml
   apiVersion: apps/v1
   kind: Deployment
   metadata:
     name: ucm-website
     labels:
       app: ucm-website
   spec:
     replicas: 3
     selector:
       matchLabels:
         app: ucm-website
     template:
       metadata:
         labels:
           app: ucm-website
       spec:
         containers:
           - name: app
             image: ghcr.io/nirholas/ucm-website:latest
             ports:
               - containerPort: 3000
             env:
               - name: DATABASE_URL
                 valueFrom:
                   secretKeyRef:
                     name: ucm-secrets
                     key: database-url
               - name: REDIS_URL
                 valueFrom:
                   configMapKeyRef:
                     name: ucm-config
                     key: redis-url
             resources:
               requests:
                 memory: "256Mi"
                 cpu: "250m"
               limits:
                 memory: "512Mi"
                 cpu: "500m"
             livenessProbe:
               httpGet:
                 path: /api/health
                 port: 3000
               initialDelaySeconds: 30
               periodSeconds: 10
             readinessProbe:
               httpGet:
                 path: /api/health
                 port: 3000
               initialDelaySeconds: 5
               periodSeconds: 5
   ---
   apiVersion: v1
   kind: Service
   metadata:
     name: ucm-website
   spec:
     selector:
       app: ucm-website
     ports:
       - port: 80
         targetPort: 3000
     type: ClusterIP
   ```

2. **Ingress Configuration** (`website-unified/k8s/ingress.yaml`)
   ```yaml
   apiVersion: networking.k8s.io/v1
   kind: Ingress
   metadata:
     name: ucm-website
     annotations:
       kubernetes.io/ingress.class: nginx
       cert-manager.io/cluster-issuer: letsencrypt-prod
       nginx.ingress.kubernetes.io/rate-limit: "100"
       nginx.ingress.kubernetes.io/rate-limit-window: "1m"
   spec:
     tls:
       - hosts:
           - app.universalcrypto.dev
         secretName: ucm-tls
     rules:
       - host: app.universalcrypto.dev
         http:
           paths:
             - path: /
               pathType: Prefix
               backend:
                 service:
                   name: ucm-website
                   port:
                     number: 80
   ```

3. **Horizontal Pod Autoscaler** (`website-unified/k8s/hpa.yaml`)
   ```yaml
   apiVersion: autoscaling/v2
   kind: HorizontalPodAutoscaler
   metadata:
     name: ucm-website
   spec:
     scaleTargetRef:
       apiVersion: apps/v1
       kind: Deployment
       name: ucm-website
     minReplicas: 3
     maxReplicas: 20
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
     behavior:
       scaleDown:
         stabilizationWindowSeconds: 300
         policies:
           - type: Percent
             value: 10
             periodSeconds: 60
       scaleUp:
         stabilizationWindowSeconds: 0
         policies:
           - type: Percent
             value: 100
             periodSeconds: 15
   ```

4. **ConfigMap & Secrets** (`website-unified/k8s/config.yaml`)
   ```yaml
   apiVersion: v1
   kind: ConfigMap
   metadata:
     name: ucm-config
   data:
     redis-url: "redis://redis-master:6379"
     log-level: "info"
     node-env: "production"
   ---
   apiVersion: v1
   kind: Secret
   metadata:
     name: ucm-secrets
   type: Opaque
   stringData:
     database-url: ${DATABASE_URL}
     session-secret: ${SESSION_SECRET}
     api-keys: ${API_KEYS}
   ```

**Technical Requirements:**
- Kubernetes 1.28+
- Nginx Ingress
- Cert-manager for TLS
- HPA for autoscaling
- Secret management

**Deliverables:**
- Deployment manifests
- Service configuration
- Ingress with TLS
- Autoscaling setup

---

## PROMPT 3: CI/CD PIPELINE

**Context:** Build complete CI/CD pipeline for automated deployments.

**Objective:** Create GitHub Actions workflows for testing, building, and deploying.

**Requirements:**
1. **Main CI/CD Workflow** (`.github/workflows/deploy.yml`)
   ```yaml
   name: Deploy
   
   on:
     push:
       branches: [main]
     release:
       types: [published]
   
   env:
     REGISTRY: ghcr.io
     IMAGE_NAME: ${{ github.repository }}
   
   jobs:
     test:
       runs-on: ubuntu-latest
       steps:
         - uses: actions/checkout@v4
         - uses: pnpm/action-setup@v2
         - uses: actions/setup-node@v4
           with:
             node-version: '20'
             cache: 'pnpm'
         - run: pnpm install
         - run: pnpm test:all
         - run: pnpm lint
   
     build:
       needs: test
       runs-on: ubuntu-latest
       permissions:
         contents: read
         packages: write
       outputs:
         version: ${{ steps.meta.outputs.version }}
       steps:
         - uses: actions/checkout@v4
         
         - name: Set up Docker Buildx
           uses: docker/setup-buildx-action@v3
         
         - name: Login to Registry
           uses: docker/login-action@v3
           with:
             registry: ${{ env.REGISTRY }}
             username: ${{ github.actor }}
             password: ${{ secrets.GITHUB_TOKEN }}
         
         - name: Extract metadata
           id: meta
           uses: docker/metadata-action@v5
           with:
             images: ${{ env.REGISTRY }}/${{ env.IMAGE_NAME }}
             tags: |
               type=sha,prefix=
               type=ref,event=branch
               type=semver,pattern={{version}}
         
         - name: Build and push
           uses: docker/build-push-action@v5
           with:
             context: ./website-unified
             push: true
             tags: ${{ steps.meta.outputs.tags }}
             labels: ${{ steps.meta.outputs.labels }}
             cache-from: type=gha
             cache-to: type=gha,mode=max
   
     deploy-staging:
       needs: build
       runs-on: ubuntu-latest
       if: github.ref == 'refs/heads/main'
       environment: staging
       steps:
         - uses: actions/checkout@v4
         
         - name: Deploy to staging
           uses: azure/k8s-deploy@v4
           with:
             manifests: |
               website-unified/k8s/deployment.yaml
               website-unified/k8s/service.yaml
             images: |
               ${{ env.REGISTRY }}/${{ env.IMAGE_NAME }}:${{ needs.build.outputs.version }}
             namespace: staging
   
     deploy-production:
       needs: [build, deploy-staging]
       runs-on: ubuntu-latest
       if: github.event_name == 'release'
       environment: production
       steps:
         - uses: actions/checkout@v4
         
         - name: Deploy to production
           uses: azure/k8s-deploy@v4
           with:
             manifests: |
               website-unified/k8s/deployment.yaml
               website-unified/k8s/service.yaml
               website-unified/k8s/hpa.yaml
             images: |
               ${{ env.REGISTRY }}/${{ env.IMAGE_NAME }}:${{ needs.build.outputs.version }}
             namespace: production
         
         - name: Notify Slack
           uses: slackapi/slack-github-action@v1
           with:
             payload: |
               {
                 "text": "🚀 Deployed ${{ github.repository }}:${{ needs.build.outputs.version }} to production"
               }
   ```

2. **Preview Deployments** (`.github/workflows/preview.yml`)
   ```yaml
   name: Preview
   
   on:
     pull_request:
       types: [opened, synchronize]
   
   jobs:
     preview:
       runs-on: ubuntu-latest
       steps:
         - uses: actions/checkout@v4
         
         - name: Deploy Preview
           uses: amondnet/vercel-action@v25
           with:
             vercel-token: ${{ secrets.VERCEL_TOKEN }}
             vercel-org-id: ${{ secrets.VERCEL_ORG_ID }}
             vercel-project-id: ${{ secrets.VERCEL_PROJECT_ID }}
             github-token: ${{ secrets.GITHUB_TOKEN }}
             scope: ${{ secrets.VERCEL_ORG_ID }}
         
         - name: Comment PR
           uses: actions/github-script@v7
           with:
             script: |
               github.rest.issues.createComment({
                 issue_number: context.issue.number,
                 owner: context.repo.owner,
                 repo: context.repo.repo,
                 body: '🔗 Preview: ${{ steps.deploy.outputs.preview-url }}'
               })
   ```

3. **Database Migrations** (`.github/workflows/migrate.yml`)
   ```yaml
   name: Database Migrations
   
   on:
     workflow_dispatch:
       inputs:
         environment:
           type: choice
           options:
             - staging
             - production
   
   jobs:
     migrate:
       runs-on: ubuntu-latest
       environment: ${{ inputs.environment }}
       steps:
         - uses: actions/checkout@v4
         - uses: pnpm/action-setup@v2
         - uses: actions/setup-node@v4
         
         - run: pnpm install
         
         - name: Run migrations
           env:
             DATABASE_URL: ${{ secrets.DATABASE_URL }}
           run: pnpm prisma migrate deploy
         
         - name: Verify migrations
           run: pnpm prisma migrate status
   ```

4. **Rollback Workflow** (`.github/workflows/rollback.yml`)
   ```yaml
   name: Rollback
   
   on:
     workflow_dispatch:
       inputs:
         version:
           description: 'Version to rollback to'
           required: true
         environment:
           type: choice
           options:
             - staging
             - production
   
   jobs:
     rollback:
       runs-on: ubuntu-latest
       environment: ${{ inputs.environment }}
       steps:
         - uses: actions/checkout@v4
         
         - name: Rollback deployment
           uses: azure/k8s-deploy@v4
           with:
             manifests: website-unified/k8s/deployment.yaml
             images: |
               ${{ env.REGISTRY }}/${{ env.IMAGE_NAME }}:${{ inputs.version }}
             namespace: ${{ inputs.environment }}
         
         - name: Notify team
           uses: slackapi/slack-github-action@v1
           with:
             payload: |
               {
                 "text": "⚠️ Rolled back ${{ inputs.environment }} to ${{ inputs.version }}"
               }
   ```

**Technical Requirements:**
- GitHub Actions
- Docker builds
- Kubernetes deployment
- Preview environments
- Rollback capability

**Deliverables:**
- Main deploy workflow
- Preview deployments
- Migration workflow
- Rollback workflow

---

## PROMPT 4: MONITORING & OBSERVABILITY

**Context:** Set up comprehensive monitoring and alerting for the platform.

**Objective:** Build observability stack with metrics, logging, and tracing.

**Requirements:**
1. **Prometheus Configuration** (`website-unified/deploy/prometheus.yml`)
   ```yaml
   global:
     scrape_interval: 15s
     evaluation_interval: 15s
   
   alerting:
     alertmanagers:
       - static_configs:
           - targets:
               - alertmanager:9093
   
   rule_files:
     - /etc/prometheus/alerts/*.yml
   
   scrape_configs:
     - job_name: 'ucm-website'
       kubernetes_sd_configs:
         - role: pod
       relabel_configs:
         - source_labels: [__meta_kubernetes_pod_label_app]
           action: keep
           regex: ucm-website
         - source_labels: [__meta_kubernetes_pod_annotation_prometheus_io_scrape]
           action: keep
           regex: true
   
     - job_name: 'node-exporter'
       static_configs:
         - targets: ['node-exporter:9100']
   
     - job_name: 'redis'
       static_configs:
         - targets: ['redis-exporter:9121']
   
     - job_name: 'postgres'
       static_configs:
         - targets: ['postgres-exporter:9187']
   ```

2. **Application Metrics** (`website-unified/lib/monitoring/metrics.ts`)
   ```typescript
   import { Registry, Counter, Histogram, Gauge } from 'prom-client';
   
   export const registry = new Registry();
   
   // HTTP metrics
   export const httpRequestsTotal = new Counter({
     name: 'http_requests_total',
     help: 'Total number of HTTP requests',
     labelNames: ['method', 'path', 'status'],
     registers: [registry],
   });
   
   export const httpRequestDuration = new Histogram({
     name: 'http_request_duration_seconds',
     help: 'HTTP request duration in seconds',
     labelNames: ['method', 'path'],
     buckets: [0.01, 0.05, 0.1, 0.5, 1, 2, 5],
     registers: [registry],
   });
   
   // Business metrics
   export const activeUsers = new Gauge({
     name: 'active_users_total',
     help: 'Number of active users',
     registers: [registry],
   });
   
   export const toolExecutions = new Counter({
     name: 'tool_executions_total',
     help: 'Total tool executions',
     labelNames: ['tool', 'status'],
     registers: [registry],
   });
   
   export const paymentVolume = new Counter({
     name: 'payment_volume_usd',
     help: 'Total payment volume in USD',
     labelNames: ['type'],
     registers: [registry],
   });
   
   // WebSocket metrics
   export const wsConnections = new Gauge({
     name: 'websocket_connections',
     help: 'Active WebSocket connections',
     registers: [registry],
   });
   ```

3. **Alert Rules** (`website-unified/deploy/alerts/platform.yml`)
   ```yaml
   groups:
     - name: platform
       rules:
         - alert: HighErrorRate
           expr: rate(http_requests_total{status=~"5.."}[5m]) > 0.1
           for: 5m
           labels:
             severity: critical
           annotations:
             summary: High error rate detected
             description: Error rate is {{ $value | humanizePercentage }}
   
         - alert: SlowResponses
           expr: histogram_quantile(0.95, rate(http_request_duration_seconds_bucket[5m])) > 2
           for: 10m
           labels:
             severity: warning
           annotations:
             summary: Slow API responses
             description: P95 latency is {{ $value }}s
   
         - alert: HighMemoryUsage
           expr: container_memory_usage_bytes / container_memory_limit_bytes > 0.9
           for: 5m
           labels:
             severity: warning
           annotations:
             summary: High memory usage
   
         - alert: DatabaseConnectionsHigh
           expr: pg_stat_activity_count > 90
           for: 5m
           labels:
             severity: warning
           annotations:
             summary: High database connections
   
         - alert: PaymentFailures
           expr: rate(payment_failures_total[5m]) > 0.05
           for: 5m
           labels:
             severity: critical
           annotations:
             summary: High payment failure rate
   ```

4. **Grafana Dashboards** (`website-unified/deploy/grafana/dashboards/`)
   ```json
   {
     "title": "UCM Platform Overview",
     "panels": [
       {
         "title": "Request Rate",
         "type": "graph",
         "targets": [
           {
             "expr": "sum(rate(http_requests_total[5m])) by (path)"
           }
         ]
       },
       {
         "title": "Error Rate",
         "type": "singlestat",
         "targets": [
           {
             "expr": "sum(rate(http_requests_total{status=~\"5..\"}[5m])) / sum(rate(http_requests_total[5m]))"
           }
         ]
       },
       {
         "title": "Active Users",
         "type": "gauge",
         "targets": [
           {
             "expr": "active_users_total"
           }
         ]
       },
       {
         "title": "Tool Executions",
         "type": "graph",
         "targets": [
           {
             "expr": "sum(rate(tool_executions_total[5m])) by (tool)"
           }
         ]
       }
     ]
   }
   ```

**Technical Requirements:**
- Prometheus metrics
- Grafana dashboards
- AlertManager
- Structured logging
- Distributed tracing

**Deliverables:**
- Prometheus configuration
- Application metrics
- Alert rules
- Grafana dashboards

---

## PROMPT 5: INFRASTRUCTURE AS CODE

**Context:** Define infrastructure using Terraform for cloud resources.

**Objective:** Create IaC for all cloud infrastructure components.

**Requirements:**
1. **Main Terraform Configuration** (`website-unified/terraform/main.tf`)
   ```hcl
   terraform {
     required_version = ">= 1.5.0"
     
     backend "s3" {
       bucket = "ucm-terraform-state"
       key    = "website/terraform.tfstate"
       region = "us-east-1"
     }
     
     required_providers {
       aws = {
         source  = "hashicorp/aws"
         version = "~> 5.0"
       }
       kubernetes = {
         source  = "hashicorp/kubernetes"
         version = "~> 2.23"
       }
     }
   }
   
   provider "aws" {
     region = var.aws_region
   }
   
   provider "kubernetes" {
     host                   = module.eks.cluster_endpoint
     cluster_ca_certificate = base64decode(module.eks.cluster_ca_certificate)
     token                  = data.aws_eks_cluster_auth.cluster.token
   }
   ```

2. **EKS Cluster** (`website-unified/terraform/eks.tf`)
   ```hcl
   module "eks" {
     source  = "terraform-aws-modules/eks/aws"
     version = "~> 19.0"
   
     cluster_name    = "ucm-cluster"
     cluster_version = "1.28"
   
     vpc_id     = module.vpc.vpc_id
     subnet_ids = module.vpc.private_subnets
   
     eks_managed_node_groups = {
       default = {
         min_size     = 2
         max_size     = 10
         desired_size = 3
   
         instance_types = ["t3.medium"]
         capacity_type  = "ON_DEMAND"
       }
     }
   
     cluster_addons = {
       coredns = {
         most_recent = true
       }
       kube-proxy = {
         most_recent = true
       }
       vpc-cni = {
         most_recent = true
       }
     }
   }
   ```

3. **Database Resources** (`website-unified/terraform/database.tf`)
   ```hcl
   module "rds" {
     source  = "terraform-aws-modules/rds/aws"
     version = "~> 6.0"
   
     identifier = "ucm-database"
   
     engine               = "postgres"
     engine_version       = "15.4"
     family               = "postgres15"
     major_engine_version = "15"
     instance_class       = "db.t3.medium"
   
     allocated_storage     = 20
     max_allocated_storage = 100
   
     db_name  = "ucm"
     username = "ucm_admin"
     port     = 5432
   
     multi_az               = true
     db_subnet_group_name   = module.vpc.database_subnet_group_name
     vpc_security_group_ids = [module.security_group.security_group_id]
   
     backup_retention_period = 7
     deletion_protection     = true
   
     performance_insights_enabled = true
   }
   
   module "elasticache" {
     source  = "terraform-aws-modules/elasticache/aws"
     version = "~> 1.0"
   
     cluster_id           = "ucm-redis"
     engine               = "redis"
     engine_version       = "7.0"
     node_type            = "cache.t3.medium"
     num_cache_nodes      = 2
     parameter_group_name = "default.redis7"
   
     subnet_group_name  = module.vpc.elasticache_subnet_group_name
     security_group_ids = [module.security_group.security_group_id]
   }
   ```

4. **CDN & Storage** (`website-unified/terraform/cdn.tf`)
   ```hcl
   resource "aws_s3_bucket" "static_assets" {
     bucket = "ucm-static-assets"
   }
   
   resource "aws_cloudfront_distribution" "cdn" {
     enabled             = true
     default_root_object = "index.html"
   
     origin {
       domain_name = aws_s3_bucket.static_assets.bucket_regional_domain_name
       origin_id   = "S3-static-assets"
   
       s3_origin_config {
         origin_access_identity = aws_cloudfront_origin_access_identity.oai.cloudfront_access_identity_path
       }
     }
   
     default_cache_behavior {
       allowed_methods  = ["GET", "HEAD"]
       cached_methods   = ["GET", "HEAD"]
       target_origin_id = "S3-static-assets"
   
       forwarded_values {
         query_string = false
         cookies {
           forward = "none"
         }
       }
   
       viewer_protocol_policy = "redirect-to-https"
       min_ttl                = 0
       default_ttl            = 3600
       max_ttl                = 86400
     }
   
     restrictions {
       geo_restriction {
         restriction_type = "none"
       }
     }
   
     viewer_certificate {
       acm_certificate_arn = aws_acm_certificate.cert.arn
       ssl_support_method  = "sni-only"
     }
   }
   ```

**Technical Requirements:**
- Terraform 1.5+
- AWS provider
- State management
- Module reuse
- Environment separation

**Deliverables:**
- Terraform configurations
- EKS cluster setup
- Database infrastructure
- CDN configuration

---

**Integration Notes:**
- CI/CD triggers Terraform
- Secrets in AWS Secrets Manager
- Monitoring integrated
- Backup automation
- Cost management

**Success Criteria:**
- One-click deployments
- < 5 min deployment time
- Zero-downtime updates
- Automated rollbacks
- Complete observability
- Infrastructure as Code
- Disaster recovery ready
