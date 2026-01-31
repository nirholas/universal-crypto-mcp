# Production Deployment Checklist

Quick checklist for deploying the x402 facilitator with fee collection to production.

## Pre-Deployment

- [ ] **Create dedicated wallets**
  - [ ] Facilitator wallet (for gasless settlements)
  - [ ] Fee recipient wallet (treasury for collected fees)
  - [ ] Fund facilitator wallet with gas (~0.1 ETH per network)

- [ ] **Configure RPC endpoints**
  - [ ] Sign up for Alchemy/Infura/QuickNode
  - [ ] Get API keys for all networks
  - [ ] Test RPC connectivity

- [ ] **Security setup**
  - [ ] Generate strong admin key: `openssl rand -hex 32`
  - [ ] Set up secrets manager (AWS Secrets/Vault)
  - [ ] Never commit `.env` to git
  - [ ] Configure multisig for fee recipient (optional)

## Environment Configuration

Create `.env` file with production values:

```bash
# Network Configuration
ENABLED_NETWORKS=eip155:42161,eip155:8453,eip155:10,eip155:137
PORT=3002
NODE_ENV=production

# RPC Endpoints (use private endpoints)
ARBITRUM_RPC_URL=https://arb-mainnet.g.alchemy.com/v2/YOUR_KEY
BASE_RPC_URL=https://base-mainnet.g.alchemy.com/v2/YOUR_KEY
OPTIMISM_RPC_URL=https://opt-mainnet.g.alchemy.com/v2/YOUR_KEY
POLYGON_RPC_URL=https://polygon-mainnet.g.alchemy.com/v2/YOUR_KEY

# Wallet Configuration
PRIVATE_KEY=0xYOUR_FACILITATOR_PRIVATE_KEY
RECIPIENT_ADDRESS=0xYourPaymentRecipient
FEE_RECIPIENT=0xYourTreasuryWallet

# Fee Settlement
SETTLEMENT_MIN_BATCH_SIZE=100.0  # Wait for $100
SETTLEMENT_INTERVAL_MS=21600000  # Every 6 hours
AUTO_SETTLEMENT=true
ADMIN_KEY=YOUR_SECURE_ADMIN_KEY_HERE

# Security
CORS_ORIGINS=https://yourdomain.com,https://api.yourdomain.com
RATE_LIMIT_WINDOW_MS=60000
RATE_LIMIT_MAX_REQUESTS=100

# Monitoring
LOG_LEVEL=info
```

## Build & Test

- [ ] **Install dependencies**
  ```bash
  pnpm install
  ```

- [ ] **Build TypeScript**
  ```bash
  pnpm run build
  ```

- [ ] **Run tests**
  ```bash
  pnpm run test
  ```

- [ ] **Test locally**
  ```bash
  pnpm run dev
  # Test endpoints at http://localhost:3002
  ```

## Deployment

### Option 1: Docker Compose (Recommended)

- [ ] **Review docker-compose.yml**
  ```bash
  cat docker-compose.yml
  ```

- [ ] **Start services**
  ```bash
  docker-compose up -d
  ```

- [ ] **Check logs**
  ```bash
  docker-compose logs -f facilitator
  ```

- [ ] **Verify health**
  ```bash
  curl http://localhost:3002/health
  ```

### Option 2: PM2

- [ ] **Install PM2**
  ```bash
  npm install -g pm2
  ```

- [ ] **Start process**
  ```bash
  pm2 start dist/server.js --name x402-facilitator
  ```

- [ ] **Save configuration**
  ```bash
  pm2 save
  pm2 startup
  ```

### Option 3: systemd

- [ ] **Create service file** `/etc/systemd/system/x402-facilitator.service`
  ```ini
  [Unit]
  Description=x402 Payment Facilitator
  After=network.target

  [Service]
  Type=simple
  User=x402
  WorkingDirectory=/opt/x402-facilitator
  Environment="NODE_ENV=production"
  EnvironmentFile=/opt/x402-facilitator/.env
  ExecStart=/usr/bin/node dist/server.js
  Restart=always

  [Install]
  WantedBy=multi-user.target
  ```

- [ ] **Enable and start**
  ```bash
  sudo systemctl enable x402-facilitator
  sudo systemctl start x402-facilitator
  sudo systemctl status x402-facilitator
  ```

## Post-Deployment Verification

- [ ] **Test health endpoint**
  ```bash
  curl https://your-domain.com/health
  ```
  Expected: `{"status":"healthy",...}`

- [ ] **Test metrics endpoint**
  ```bash
  curl https://your-domain.com/metrics
  ```
  Expected: Prometheus metrics

- [ ] **Test payment verification** (use testnet first)
  ```bash
  curl -X POST https://your-domain.com/verify \
    -H "Content-Type: application/json" \
    -d '{
      "txHash": "0x...",
      "network": "eip155:421614"
    }'
  ```

- [ ] **Check fee stats**
  ```bash
  curl https://your-domain.com/fees/stats
  ```

- [ ] **Check pending settlements**
  ```bash
  curl https://your-domain.com/settlement/pending
  ```

## Monitoring Setup

### Prometheus

- [ ] **Configure scrape target** in `prometheus.yml`
  ```yaml
  scrape_configs:
    - job_name: 'x402-facilitator'
      static_configs:
        - targets: ['facilitator:3002']
  ```

- [ ] **Verify metrics collection**
  ```bash
  curl http://localhost:9090/api/v1/targets
  ```

### Grafana

- [ ] **Add Prometheus data source**
  - URL: `http://prometheus:9090`
  - Save & Test

- [ ] **Import dashboard**
  - Create new dashboard
  - Add panels for:
    - Total fees collected
    - Payment volume
    - Settlement success rate
    - Fee tier distribution

- [ ] **Set up alerts**
  - Failed settlements > 0
  - Unsettled fees > $1000
  - Response time > 1s

### Log Monitoring

- [ ] **Configure log aggregation**
  - CloudWatch Logs (AWS)
  - Google Cloud Logging (GCP)
  - Datadog / New Relic
  - Self-hosted: Loki + Grafana

- [ ] **Set up log alerts**
  - Error rate spikes
  - Settlement failures
  - Unauthorized admin access attempts

## Security Hardening

- [ ] **Enable HTTPS**
  - [ ] Get SSL certificate (Let's Encrypt)
  - [ ] Configure nginx/Caddy reverse proxy
  - [ ] Force HTTPS redirects

- [ ] **Firewall configuration**
  ```bash
  sudo ufw allow 80/tcp
  sudo ufw allow 443/tcp
  sudo ufw enable
  ```

- [ ] **Rate limiting**
  - [ ] Configure nginx rate limits
  - [ ] Or use Cloudflare
  - [ ] Block abusive IPs

- [ ] **Security headers**
  - Already configured via helmet middleware
  - Verify with: https://securityheaders.com

## Operational Procedures

### Daily

- [ ] Check settlement stats
  ```bash
  curl https://your-domain.com/settlement/stats
  ```

- [ ] Review logs for errors
  ```bash
  docker-compose logs --tail=100 facilitator
  ```

### Weekly

- [ ] Review fee collection metrics
- [ ] Verify settlement success rate (should be >99%)
- [ ] Check facilitator wallet balance (needs gas)
- [ ] Review treasury wallet (accumulated fees)

### Monthly

- [ ] Generate revenue report
  ```bash
  curl https://your-domain.com/fees/stats > monthly-report-$(date +%Y-%m).json
  ```

- [ ] Rotate admin key (optional)
- [ ] Review and optimize settlement batch size
- [ ] Update dependencies: `pnpm update`

## Scaling Checklist

When volume exceeds $1M/month:

- [ ] **Database persistence**
  - Move from in-memory to PostgreSQL/MongoDB
  - Store fee records permanently
  - Index by payer, network, timestamp

- [ ] **Horizontal scaling**
  - Deploy multiple facilitator instances
  - Add load balancer
  - Use Redis for shared cache

- [ ] **Dedicated RPC**
  - Alchemy Growth plan
  - Or run own archive nodes

- [ ] **Advanced settlement**
  - Implement on-chain fee collection contract
  - Use multicall for gas optimization
  - Dynamic gas price monitoring

## Rollback Plan

If something goes wrong:

1. **Stop the service**
   ```bash
   docker-compose down
   # Or: systemctl stop x402-facilitator
   ```

2. **Revert to previous version**
   ```bash
   git checkout <previous-tag>
   pnpm install
   pnpm run build
   ```

3. **Restart**
   ```bash
   docker-compose up -d
   ```

4. **Verify**
   ```bash
   curl http://localhost:3002/health
   ```

## Emergency Contacts

Document who to contact:

- **DevOps Lead**: [Name] - [Email/Phone]
- **Security Lead**: [Name] - [Email/Phone]
- **On-Call Engineer**: [PagerDuty/etc]
- **RPC Provider Support**: [Alchemy/Infura ticket system]

## Success Metrics

Track these KPIs:

- **Uptime**: Target 99.9%
- **Response time**: <500ms p99
- **Settlement success rate**: >99%
- **Fee collection rate**: 0.1% of volume
- **Monthly revenue**: Track growth

## Completion

Once all items are checked:

✅ Facilitator is production-ready
✅ Monitoring is configured
✅ Security hardening complete
✅ Operational procedures documented
✅ Team is trained

---

**Resources:**
- [Settlement Guide](./SETTLEMENT_GUIDE.md) - Fee management
- [README](./README.md) - API reference
- [docker-compose.yml](./docker-compose.yml) - Deployment config
- [x402 Protocol](https://github.com/nirholas/x402) - Payment standard

**Support:**
- Issues: https://github.com/nirholas/universal-crypto-mcp/issues
- Docs: https://docs.x402.org
