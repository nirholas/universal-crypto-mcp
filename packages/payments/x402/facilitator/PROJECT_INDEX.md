# X402 Facilitator - Project Index

**Complete navigation guide for the x402 payment facilitator with automated fee collection.**

---

## 📁 Project Structure

```
packages/payments/x402/facilitator/
├── 📄 README.md                      # Main documentation & API reference
├── 📄 AGENT_COORDINATION.md          # Multi-agent coordination guide
├── 📄 SETTLEMENT_GUIDE.md            # Fee settlement & withdrawal guide
├── 📄 DEPLOYMENT_CHECKLIST.md        # Production deployment steps
├── 📄 PROJECT_INDEX.md               # This file
├── 🔧 revenue-calculator.js          # Revenue projection tool
├── 🔧 check-conflicts.sh            # Conflict detection script
├── 📦 package.json                   # Dependencies & scripts
├── ⚙️  tsconfig.json                 # TypeScript configuration
├── ⚙️  .env.example                  # Environment template
├── 🐳 docker-compose.yml             # Docker deployment
├── 🐳 Dockerfile                     # Container image
│
├── src/                              # Source code
│   ├── server.ts                     # Main Express server
│   ├── types.ts                      # TypeScript type definitions
│   │
│   ├── services/                     # Core business logic
│   │   ├── fees.ts                   # Fee calculation & tracking (350 LOC)
│   │   ├── settlement.ts             # Fee settlement automation (334 LOC)
│   │   ├── multichain.ts             # Multi-chain blockchain client (400 LOC)
│   │   ├── networks.ts               # Network configurations (240 LOC)
│   │   ├── metrics.ts                # Prometheus metrics (280 LOC)
│   │   ├── cache.ts                  # Payment caching
│   │   ├── arbitrum.ts               # Arbitrum client (legacy)
│   │   └── usds.ts                   # USDs token service
│   │
│   ├── routes/                       # API endpoints
│   │   ├── fees.ts                   # Fee management API (180 LOC)
│   │   ├── settlement.ts             # Settlement admin API (180 LOC)
│   │   ├── verify.ts                 # Payment verification (w/ fees)
│   │   ├── settle.ts                 # Gasless settlement (w/ fees)
│   │   ├── quote.ts                  # Payment quote generation
│   │   └── payments.ts               # Payment status queries
│   │
│   └── middleware/                   # Express middleware
│       ├── logger.ts                 # Request/error logging
│       ├── rateLimit.ts              # Rate limiting
│       └── validator.ts              # Request validation
│
├── test/                             # Tests (TO BE IMPLEMENTED)
│   ├── services/                     # Service unit tests
│   ├── routes/                       # API integration tests
│   └── e2e/                          # End-to-end tests
│
└── dist/                             # Compiled JavaScript (generated)
```

---

## 📚 Documentation Guide

### For First-Time Users

1. **Start here**: [README.md](README.md)
   - Overview of the facilitator
   - Fee structure (0.1% with volume tiers)
   - Supported networks (8 total)
   - API endpoints reference
   - Quick start guide

2. **Setup & Deploy**: [DEPLOYMENT_CHECKLIST.md](DEPLOYMENT_CHECKLIST.md)
   - Pre-deployment checklist
   - Environment configuration
   - Docker deployment steps
   - Monitoring setup
   - Security hardening

3. **Managing Fees**: [SETTLEMENT_GUIDE.md](SETTLEMENT_GUIDE.md)
   - How settlement works
   - Automatic vs manual settlement
   - Admin API usage
   - Production setup
   - Troubleshooting

### For Developers

1. **Multi-Agent Work**: [AGENT_COORDINATION.md](AGENT_COORDINATION.md)
   - File ownership matrix
   - What's locked vs available
   - Conflict prevention rules
   - Integration points
   - Recommended work distribution

2. **Calculate Revenue**: Run `node revenue-calculator.js`
   - Interactive mode or CLI
   - Volume-based projections
   - Fee tier breakdown

3. **Check for Conflicts**: Run `bash check-conflicts.sh`
   - Detects duplicate implementations
   - Validates single initialization
   - Pre-commit safety check

---

## 🔑 Key Components

### Core Services (src/services/)

| File | Purpose | Status | LOC | Owner |
|------|---------|--------|-----|-------|
| `fees.ts` | Fee calculation & tracking | ✅ Complete | 350 | Agent 1 |
| `settlement.ts` | Automated fee batching & withdrawal | ✅ Complete | 334 | Agent 1 |
| `multichain.ts` | Multi-chain blockchain client | ✅ Complete | 400 | Agent 1 |
| `networks.ts` | 8 network configurations (CAIP-2) | ✅ Complete | 240 | Agent 1 |
| `metrics.ts` | 15+ Prometheus metrics | ✅ Complete | 280 | Agent 1 |

### API Routes (src/routes/)

| Endpoint | File | Purpose | Auth | Status |
|----------|------|---------|------|--------|
| `POST /verify` | verify.ts | Verify payment transaction | None | ✅ w/ fees |
| `POST /settle` | settle.ts | Execute gasless settlement | None | ✅ w/ fees |
| `POST /quote` | quote.ts | Generate payment quote (402) | None | ✅ |
| `GET /payments/:tx` | payments.ts | Query payment status | None | ✅ |
| `GET /fees/stats` | fees.ts | Fee & revenue statistics | None | ✅ |
| `GET /fees/tier/:address` | fees.ts | Fee tier for payer | None | ✅ |
| `POST /settlement/settle-all` | settlement.ts | Settle all fees | Admin | ✅ |
| `GET /settlement/pending` | settlement.ts | View pending fees | None | ✅ |
| `GET /metrics` | server.ts | Prometheus metrics | None | ✅ |
| `GET /networks` | server.ts | Supported networks | None | ✅ |

---

## 🎯 Quick Reference

### Fee Structure

| Tier | Monthly Volume | Fee Rate | Example on $1000 |
|------|----------------|----------|------------------|
| Standard | $0+ | 0.10% | $1.00 |
| Silver | $10K+ | 0.08% | $0.80 |
| Gold | $100K+ | 0.06% | $0.60 |
| Platinum | $1M+ | 0.04% | $0.40 |

### Supported Networks

| Network | Chain ID | RPC | Tokens |
|---------|----------|-----|--------|
| Arbitrum One | eip155:42161 | arb1.arbitrum.io | USDC, USDT, DAI, USDs |
| Base | eip155:8453 | mainnet.base.org | USDC, DAI |
| Optimism | eip155:10 | mainnet.optimism.io | USDC, USDT, DAI |
| Polygon | eip155:137 | polygon-rpc.com | USDC, USDT, DAI |
| *+ 4 testnets* | | | |

### Environment Variables

| Variable | Required | Default | Purpose |
|----------|----------|---------|---------|
| `PORT` | No | 3002 | Server port |
| `ENABLED_NETWORKS` | No | 4 mainnets | Comma-separated CAIP-2 IDs |
| `PRIVATE_KEY` | Yes | - | Facilitator wallet |
| `FEE_RECIPIENT` | Yes | - | Treasury wallet |
| `ADMIN_KEY` | Yes | - | Settlement admin key |
| `AUTO_SETTLEMENT` | No | true | Enable auto-settlement |
| `SETTLEMENT_MIN_BATCH_SIZE` | No | 10.0 | Min USD to settle |
| `SETTLEMENT_INTERVAL_MS` | No | 3600000 | Check interval (1h) |

### Common Commands

```bash
# Install dependencies
pnpm install

# Build TypeScript
pnpm run build

# Run in development
pnpm run dev

# Start production server
pnpm start

# Run tests
pnpm run test

# Check for conflicts
bash check-conflicts.sh

# Calculate revenue
node revenue-calculator.js

# Deploy with Docker
docker-compose up -d

# View logs
docker-compose logs -f facilitator
```

---

## 🔍 Finding What You Need

### "I want to..."

**...understand how fees work**
→ Read [SETTLEMENT_GUIDE.md](SETTLEMENT_GUIDE.md) sections 1-2

**...deploy to production**
→ Follow [DEPLOYMENT_CHECKLIST.md](DEPLOYMENT_CHECKLIST.md)

**...add a new network**
→ Edit [src/services/networks.ts](src/services/networks.ts) and add config

**...change the fee percentage**
→ Edit `DEFAULT_FEE_TIERS` in [src/services/fees.ts](src/services/fees.ts)

**...trigger manual settlement**
→ POST to `/settlement/settle-all` with admin key (see [SETTLEMENT_GUIDE.md](SETTLEMENT_GUIDE.md#manual-settlement))

**...see revenue metrics**
→ GET `/fees/stats` or view Prometheus at `/metrics`

**...work without conflicts**
→ Read [AGENT_COORDINATION.md](AGENT_COORDINATION.md) first

**...add database persistence**
→ Extend `FeeService` class (see [AGENT_COORDINATION.md](AGENT_COORDINATION.md#for-database-implementation))

**...build smart contracts**
→ Create contracts/FeeCollector.sol (see [AGENT_COORDINATION.md](AGENT_COORDINATION.md#for-contract-implementation))

**...add tests**
→ Create test/ directory following structure (see [AGENT_COORDINATION.md](AGENT_COORDINATION.md#testing--quality-available))

---

## 📊 Revenue Projections

Quick reference (run calculator for detailed breakdown):

| Monthly Volume | Annual Revenue (Net) |
|----------------|---------------------|
| $100K | ~$1,000 |
| $500K | ~$2,000 |
| $1M | ~$3,000 |
| $10M | ~$46,000 |
| $100M | ~$478,000 |

*Assumes 3 networks, automated settlement every 6 hours*

---

## 🚀 Implementation Status

### ✅ Completed (Production Ready)

- [x] Fee calculation with volume-based tiers
- [x] Fee recording and tracking
- [x] Automatic settlement (hourly)
- [x] Manual settlement (admin API)
- [x] Multi-chain support (8 networks)
- [x] Prometheus metrics (15+ metrics)
- [x] API endpoints (10 endpoints)
- [x] Docker deployment
- [x] Comprehensive documentation
- [x] Revenue calculator
- [x] Conflict detection

### 🚧 Needs Implementation

- [ ] Database persistence (PostgreSQL/MongoDB)
- [ ] On-chain fee collection contract
- [ ] Comprehensive test suite
- [ ] Admin dashboard UI
- [ ] Grafana dashboards
- [ ] CI/CD pipeline
- [ ] Load testing
- [ ] Security audit

### 🔒 File Ownership

**Locked (Do Not Modify):**
- All files in `src/services/` (except for extensions)
- All files in `src/routes/` (except new routes)
- `src/server.ts` (except for new integrations)
- All documentation files (except updates)

**Available for Implementation:**
- `test/**/*` - All tests
- `src/db/**/*` - Database layer
- `contracts/**/*` - Smart contracts
- `dashboard/**/*` - Admin UI
- `monitoring/**/*` - Grafana configs

---

## 🆘 Troubleshooting

**Error: "Settlement endpoints not configured"**
→ Set `ADMIN_KEY` in .env

**Error: "Server eip155:42161 not found"**
→ Add network to `ENABLED_NETWORKS`

**Fees not settling automatically**
→ Check `AUTO_SETTLEMENT=true` and accumulated fees ≥ `SETTLEMENT_MIN_BATCH_SIZE`

**TypeScript errors after changes**
→ Run `pnpm run build` to check, see [AGENT_COORDINATION.md](AGENT_COORDINATION.md) for integration points

**Duplicate implementations found**
→ Run `bash check-conflicts.sh` and review [AGENT_COORDINATION.md](AGENT_COORDINATION.md)

---

## 📞 Support & Resources

- **Issues**: https://github.com/nirholas/universal-crypto-mcp/issues
- **x402 Protocol**: https://github.com/nirholas/x402
- **Docs**: https://docs.x402.org (if available)

---

**Last Updated**: 2026-01-31  
**Version**: 1.1.0  
**Status**: Production Ready (needs database + contracts for scale)
