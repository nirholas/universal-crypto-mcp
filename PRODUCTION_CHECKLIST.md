# Production Checklist

Before deploying to production, verify all items below:

## 🔒 Security

- [ ] All secrets are in environment variables (not hardcoded)
- [ ] Rate limiting is enabled and configured appropriately
- [ ] Security headers middleware is applied (Helmet-style)
- [ ] Input validation on all endpoints
- [ ] CORS configured properly (not using wildcard `*` in production)
- [ ] HTTPS enabled with valid SSL certificate
- [ ] API keys and tokens rotated from development values
- [ ] Private keys stored securely (never in code or logs)
- [ ] SQL injection prevention (parameterized queries)
- [ ] XSS prevention (input sanitization)
- [ ] CSRF protection enabled
- [ ] Request body size limits configured
- [ ] Authentication/authorization properly implemented
- [ ] Sensitive data encrypted at rest

## ⚡ Performance

- [ ] Payment cache enabled and sized appropriately
- [ ] Database connection pooling configured
- [ ] Gzip/Brotli compression enabled
- [ ] Static assets cached with proper headers
- [ ] Health check endpoint responsive (<100ms)
- [ ] Database indexes optimized
- [ ] N+1 query issues resolved
- [ ] Memory leaks checked and fixed
- [ ] Connection timeouts configured
- [ ] Graceful shutdown implemented

## 📊 Monitoring

- [ ] Structured logging configured (JSON format for production)
- [ ] Log levels appropriate (INFO/WARN/ERROR, not DEBUG)
- [ ] Error tracking service integrated (Sentry, etc.)
- [ ] Analytics tracking working
- [ ] Webhooks tested and verified
- [ ] Dashboard accessible and functional
- [ ] Uptime monitoring configured (e.g., Uptime Robot)
- [ ] Alerts set up for:
  - [ ] High error rate
  - [ ] High latency
  - [ ] Low disk space
  - [ ] High memory usage
  - [ ] Service downtime
- [ ] Metrics collection enabled (Prometheus, etc.)
- [ ] Log retention policy configured

## ✅ Testing

- [ ] All unit tests passing
- [ ] Integration tests passing
- [ ] E2E tests passing
- [ ] Manual smoke test completed
- [ ] Load testing done (if expecting high traffic)
  - [ ] Target RPS achieved
  - [ ] Latency P99 < acceptable threshold
  - [ ] No memory leaks under load
- [ ] Security audit/penetration testing (if applicable)
- [ ] Chaos engineering tested (if applicable)
- [ ] Rollback tested and verified

## 📚 Documentation

- [ ] README complete with setup instructions
- [ ] API documentation published
- [ ] Configuration examples provided
- [ ] Troubleshooting guide written
- [ ] Architecture documentation
- [ ] Runbook for common operations
- [ ] Incident response playbook
- [ ] Changelog up to date

## 🚀 Deployment

- [ ] Environment variables set correctly:
  - [ ] `NODE_ENV=production`
  - [ ] `LOG_LEVEL=info`
  - [ ] All required API keys
  - [ ] Database connection strings
  - [ ] Cache configuration
- [ ] Database migrations run successfully
- [ ] Backup strategy in place and tested
- [ ] Rollback plan documented and tested
- [ ] DNS configured and propagated
- [ ] SSL certificate valid (not expiring soon)
- [ ] CDN configured (if applicable)
- [ ] Auto-scaling configured (if applicable)
- [ ] Blue-green or canary deployment ready
- [ ] Health checks configured for load balancer

## 🔄 CI/CD

- [ ] Build pipeline passing
- [ ] Automated tests in CI
- [ ] Security scanning enabled
- [ ] Dependency vulnerability scanning
- [ ] Docker images scanned
- [ ] Deployment automation working
- [ ] Environment promotion process defined

## ⚖️ Legal

- [ ] Terms of Service published
- [ ] Privacy Policy published
- [ ] License file included (Apache-2.0)
- [ ] GDPR compliance (if applicable)
  - [ ] Data processing agreement
  - [ ] Right to deletion implemented
  - [ ] Data export capability
- [ ] Cookie consent (if applicable)
- [ ] Age verification (if applicable)
- [ ] Regulatory compliance (varies by jurisdiction)

## 💰 Payments (x402 specific)

- [ ] Payment verification working on mainnet
- [ ] Correct wallet addresses configured
- [ ] Payment amounts verified (correct decimals)
- [ ] Refund process documented
- [ ] Revenue sharing configured correctly
- [ ] Payment analytics tracking
- [ ] Facilitator URL set to production
- [ ] Test mode disabled

## 🎯 Launch Preparation

- [ ] Staging environment mirrors production
- [ ] Load balancer configured
- [ ] Rate limits adjusted for expected traffic
- [ ] Feature flags ready for quick disable
- [ ] Communication channels ready:
  - [ ] Status page configured
  - [ ] Support email/chat ready
  - [ ] Social media accounts ready
- [ ] Launch announcement prepared
- [ ] Team availability during launch

---

## 🚀 Launch Checklist

### Pre-Launch (T-1 day)
- [ ] Final code freeze
- [ ] All tests passing
- [ ] Staging sign-off complete
- [ ] Team briefed on launch plan

### Launch Day
- [ ] Deploy to production
- [ ] Verify health checks
- [ ] Run smoke tests
- [ ] Monitor error rates
- [ ] Announce launch

### Post-Launch (T+1 day)
- [ ] Review error logs
- [ ] Check analytics
- [ ] Respond to user feedback
- [ ] Document any issues
- [ ] Celebrate! 🎉

---

## Quick Commands

```bash
# Run all tests
pnpm test

# Run E2E tests
pnpm test:e2e

# Check for TypeScript errors
pnpm lint:tsc

# Run linter
pnpm lint

# Build for production
pnpm build

# Run benchmarks
pnpm tsx scripts/benchmark.ts http://localhost:3402/api/status

# Check dependencies for vulnerabilities
pnpm audit
```

---

## Environment Variables Template

```env
# Required
NODE_ENV=production
LOG_LEVEL=info
PORT=3402

# Database
DATABASE_URL=postgresql://user:pass@host:5432/db

# x402 Payments
X402_PRIVATE_KEY=0x...
X402_WALLET_ADDRESS=0x...
X402_FACILITATOR_URL=https://facilitator.x402.org
X402_NETWORK=base

# Optional
SENTRY_DSN=https://...
ANALYTICS_KEY=...
WEBHOOK_SECRET=...
```

---

**Last Updated:** January 2026
**Version:** 1.0.0
