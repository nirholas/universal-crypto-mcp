# Architecture Overview

Visual guide to the x402 facilitator codebase structure and data flows.

## 🏗️ System Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                         Client                              │
│               (Agent, User, Integration)                    │
└────────────────┬────────────────────────────────────────────┘
                 │ HTTP Request
                 ▼
┌─────────────────────────────────────────────────────────────┐
│                      Express Server                         │
│                     (src/server.ts)                         │
├─────────────────────────────────────────────────────────────┤
│  Middleware:                                                │
│  • Helmet (security)                                        │
│  • CORS (cross-origin)                                      │
│  • Rate limiting                                            │
│  • Request logging                                          │
└────────┬────────────────────────────────────┬───────────────┘
         │                                    │
         ▼                                    ▼
┌──────────────────┐              ┌──────────────────────────┐
│  Public Routes   │              │    Admin Routes          │
│  (No Auth)       │              │    (API Key Required)    │
├──────────────────┤              ├──────────────────────────┤
│ • /quote         │              │ • /settlement/settle-all │
│ • /verify        │              │ • /settlement/settle-net │
│ • /settle        │              └──────────────────────────┘
│ • /fees/stats    │
│ • /fees/tier     │
│ • /settlement/   │
│   pending        │
└────────┬─────────┘
         │
         ▼
┌─────────────────────────────────────────────────────────────┐
│                      Service Layer                          │
├─────────────────────────────────────────────────────────────┤
│                                                             │
│  ┌─────────────────┐  ┌──────────────────┐  ┌───────────┐ │
│  │  FeeService     │  │ SettlementService│  │ MultiChain│ │
│  │  (fees.ts)      │  │ (settlement.ts)  │  │ Client    │ │
│  │                 │  │                  │  │ (multi    │ │
│  │ • Calculate fee │  │ • Get pending    │  │  chain.ts)│ │
│  │ • Record fee    │  │ • Settle all     │  │           │ │
│  │ • Track volume  │  │ • Settle network │  │ • RPC     │ │
│  │ • Get tier      │  │ • Auto-schedule  │  │ • Balance │ │
│  └────────┬────────┘  └────────┬─────────┘  │ • Receipt │ │
│           │                    │             └─────┬─────┘ │
│           │                    │                   │       │
│  ┌────────┴────────────────────┴───────────────────┴─────┐ │
│  │              Metrics Service (metrics.ts)            │ │
│  │                                                       │ │
│  │  • Payment counters      • Fee gauges                │ │
│  │  • Settlement histograms • Error rates               │ │
│  └───────────────────────────────────────────────────────┘ │
└─────────────────────────────────────────────────────────────┘
         │                    │                    │
         ▼                    ▼                    ▼
┌──────────────┐   ┌──────────────────┐   ┌──────────────────┐
│  In-Memory   │   │   Blockchain     │   │   Prometheus     │
│  Storage     │   │   Networks       │   │   Exporter       │
│              │   │                  │   │                  │
│ • Fee records│   │ • Arbitrum       │   │ /metrics endpoint│
│ • Settlements│   │ • Base           │   │                  │
│ • Volume     │   │ • Optimism       │   └──────────────────┘
│   tracking   │   │ • Polygon        │
└──────────────┘   │ • 4 testnets     │
                   └──────────────────┘
```

## 📂 Directory Structure

```
packages/payments/x402/facilitator/
├── src/
│   ├── server.ts              # Main application entry point
│   ├── middleware/
│   │   └── adminAuth.ts       # Admin API key authentication
│   ├── routes/
│   │   ├── quote.ts           # GET /quote - Generate payment quote
│   │   ├── verify.ts          # POST /verify - Verify payment
│   │   ├── settle.ts          # POST /settle - Gasless settlement
│   │   ├── fees.ts            # GET /fees/* - Fee statistics
│   │   └── settlement.ts      # POST /settlement/* - Settlement admin
│   └── services/
│       ├── fees.ts            # Fee calculation & tracking
│       ├── settlement.ts      # Automated fee settlement
│       ├── multichain.ts      # Multi-chain RPC client
│       ├── networks.ts        # Network configurations
│       ├── metrics.ts         # Prometheus metrics
│       ├── cache.ts           # Payment status cache
│       ├── arbitrum.ts        # Arbitrum-specific logic
│       └── usds.ts            # USDs token interactions
├── docs/
│   ├── START_HERE.md          # Entry point
│   ├── PROJECT_INDEX.md       # Complete navigation
│   ├── SETTLEMENT_GUIDE.md    # Operator guide
│   ├── DEPLOYMENT_CHECKLIST.md # DevOps guide
│   ├── AGENT_COORDINATION.md  # Developer coordination
│   └── ARCHITECTURE.md        # This file
├── tools/
│   ├── check-conflicts.sh     # Conflict detection
│   └── revenue-calculator.js  # Revenue projections
├── grafana/
│   └── dashboards/
│       └── payment-overview.json
├── .github/
│   └── DOCUMENTATION.md       # Documentation standards
├── docker-compose.yml
├── Dockerfile
├── prometheus.yml
└── package.json
```

## 🔄 Payment Verification Flow

```
Client Request
    │
    ▼
┌───────────────────────────────────────┐
│ POST /verify                          │
│ Body: {                               │
│   paymentTxHash,                      │
│   payer, receiver, amount, tokenId    │
│ }                                     │
└───────────────┬───────────────────────┘
                │
                ▼
        ┌───────────────┐
        │ Validate Input│
        └───────┬───────┘
                │
                ▼
    ┌─────────────────────────┐
    │ MultiChainClient        │
    │ • getTransactionReceipt │
    │ • Parse logs            │
    │ • Match token transfer  │
    └────────┬────────────────┘
             │
             ▼
        ┌────────────┐
        │ Match?     │
        └─┬────────┬─┘
          │ Yes    │ No
          ▼        ▼
    ┌─────────┐  ┌──────────┐
    │Calculate│  │Return 400│
    │Fee 0.1% │  │Invalid   │
    └────┬────┘  └──────────┘
         │
         ▼
    ┌──────────────┐
    │ FeeService   │
    │ • recordFee()│
    │ • Track volume
    └───────┬──────┘
            │
            ▼
    ┌──────────────┐
    │ Metrics      │
    │ • Increment  │
    │   counters   │
    └───────┬──────┘
            │
            ▼
    ┌──────────────┐
    │ Return 200   │
    │ {verified:   │
    │  true,       │
    │  feeAmount}  │
    └──────────────┘
```

## 💰 Fee Settlement Flow

```
┌─────────────────────────────────────┐
│  Automatic (Hourly)                 │
│  OR                                 │
│  Manual (Admin API)                 │
└─────────────────┬───────────────────┘
                  │
                  ▼
      ┌───────────────────────┐
      │ SettlementService     │
      │ • getPendingFees()    │
      └───────────┬───────────┘
                  │
                  ▼
          ┌───────────────┐
          │ Pending >= $10│
          └───┬───────┬───┘
              │ Yes   │ No
              ▼       ▼
      ┌─────────────┐ ┌──────────┐
      │ Group by    │ │ Skip     │
      │ network     │ └──────────┘
      └──────┬──────┘
             │
             ▼
     ┌───────────────────┐
     │ For each network: │
     │ • Sum total fees  │
     │ • Simulate settle │ (Future: actual on-chain)
     └─────────┬─────────┘
               │
               ▼
       ┌───────────────┐
       │ Mark as       │
       │ 'settled'     │
       └───────┬───────┘
               │
               ▼
       ┌───────────────┐
       │ Emit metrics  │
       │ • Total settled
       │ • Settlement  │
       │   duration    │
       └───────┬───────┘
               │
               ▼
       ┌───────────────┐
       │ Return summary│
       │ {settled: $X, │
       │  networks: N} │
       └───────────────┘
```

## 🎯 Fee Tier Calculation

```
Payment Received
    │
    ▼
┌─────────────────────────┐
│ Extract payer address   │
└───────────┬─────────────┘
            │
            ▼
┌─────────────────────────┐
│ FeeService              │
│ • Get payer's monthly   │
│   volume                │
└───────────┬─────────────┘
            │
            ▼
┌─────────────────────────┐
│ Determine tier:         │
│ ├─ <$100K   → 0.10%     │
│ ├─ $100K-1M → 0.08%     │
│ ├─ $1M-10M  → 0.06%     │
│ └─ >$10M    → 0.04%     │
└───────────┬─────────────┘
            │
            ▼
┌─────────────────────────┐
│ Calculate fee:          │
│ feeAmount =             │
│   amount * tier.rate    │
└───────────┬─────────────┘
            │
            ▼
┌─────────────────────────┐
│ Record fee:             │
│ • Payer, receiver       │
│ • Amount, feeAmount     │
│ • Network, timestamp    │
│ • Status: 'pending'     │
└───────────┬─────────────┘
            │
            ▼
┌─────────────────────────┐
│ Update payer's monthly  │
│ volume                  │
└─────────────────────────┘
```

## 📊 Metrics Collection

```
Every Request
    │
    ▼
┌────────────────────────────────┐
│ Record latency                 │
│ • metricsService.recordLatency │
│   (endpoint, duration)         │
└────────────────────────────────┘
    │
    ▼
┌────────────────────────────────┐
│ On Payment Success             │
│ • paymentCounter.inc()         │
│ • paymentVolumeGauge.set()     │
│ • feesCollectedGauge.set()     │
└────────────────────────────────┘
    │
    ▼
┌────────────────────────────────┐
│ On Settlement                  │
│ • settlementCounter.inc()      │
│ • settlementVolumeGauge.set()  │
│ • settlementDuration.observe() │
└────────────────────────────────┘
    │
    ▼
┌────────────────────────────────┐
│ /metrics endpoint              │
│ • Prometheus scrapes every 15s │
│ • Exports all counters/gauges  │
└────────────────────────────────┘
```

## 🌐 Network Configuration

```
networks.ts → NETWORKS constant
    │
    ├─ arbitrum (chainId: 42161)
    │  ├─ RPC: https://arb1.arbitrum.io/rpc
    │  ├─ USDC: 0xaf88d065e77c8cc2239327c5edb3a432268e5831
    │  ├─ USDT: 0xfd086bc7cd5c481dcc9c85ebe478a1c0b69fcbb9
    │  └─ USDs: 0x820c137fa70c8691f0e44dc420a5e53c168921dc
    │
    ├─ base (chainId: 8453)
    │  └─ RPC: https://mainnet.base.org
    │
    ├─ optimism (chainId: 10)
    │  └─ RPC: https://mainnet.optimism.io
    │
    ├─ polygon (chainId: 137)
    │  └─ RPC: https://polygon-rpc.com
    │
    └─ 4 testnets (Sepolia variants)
```

## 🔒 Security Layers

```
┌─────────────────────────────────────┐
│ Layer 1: Express Middleware         │
│ • Helmet (CSP, HSTS, etc.)          │
│ • CORS (configurable origins)       │
│ • Rate limiting (per endpoint)      │
└─────────────────┬───────────────────┘
                  │
                  ▼
┌─────────────────────────────────────┐
│ Layer 2: Authentication             │
│ • Admin routes: X-Admin-Key header  │
│ • Public routes: No auth            │
└─────────────────┬───────────────────┘
                  │
                  ▼
┌─────────────────────────────────────┐
│ Layer 3: Input Validation           │
│ • Address format (0x...)            │
│ • Amount validation (positive)      │
│ • Transaction hash format           │
└─────────────────┬───────────────────┘
                  │
                  ▼
┌─────────────────────────────────────┐
│ Layer 4: Blockchain Verification    │
│ • Actual on-chain transaction       │
│ • Transfer event matching           │
│ • Amount/recipient confirmation     │
└─────────────────────────────────────┘
```

## 🚦 Error Handling

```
Error Occurs
    │
    ▼
┌─────────────────────────────────────┐
│ Express Error Middleware            │
│ • Catches all errors                │
│ • Logs with Winston                 │
└─────────────────┬───────────────────┘
                  │
                  ▼
        ┌─────────────────┐
        │ Error Type?     │
        └─┬───────┬───────┘
          │       │
  ValidationError │ UnknownError
          │       │
          ▼       ▼
    ┌─────────┐ ┌─────────┐
    │Return   │ │Return   │
    │400 Bad  │ │500 Int. │
    │Request  │ │Error    │
    └─────────┘ └─────────┘
          │       │
          └───┬───┘
              │
              ▼
      ┌───────────────┐
      │ Increment     │
      │ error counter │
      └───────────────┘
```

## 📈 Scaling Considerations

### Current (Single Instance)
- In-memory storage for fees
- Single Express server
- Direct RPC calls to networks

### Future (Multi-Instance)
- [ ] PostgreSQL for fee persistence
- [ ] Redis for distributed caching
- [ ] Message queue for async settlements
- [ ] Load balancer (NGINX)
- [ ] RPC pooling/proxying

## 🔗 Integration Points

### For Other Agents/Services

**Database Layer** (🟢 Available):
```typescript
// Extend FeeService to use database
class DatabaseFeeService extends FeeService {
  async recordFee(...) {
    await db.fees.insert(...)
  }
}
```

**Settlement Contract** (🟢 Available):
```solidity
// On-chain fee collector
contract FeeCollector {
  function withdrawFees(address token, uint256 amount) external onlyAdmin {
    // Actual withdrawal logic
  }
}
```

**Frontend Dashboard** (🟢 Available):
```typescript
// React dashboard consuming APIs
fetch('/fees/stats').then(data => renderCharts(data))
fetch('/settlement/pending').then(data => renderTable(data))
```

**Testing Suite** (🟢 Available):
```typescript
// Integration tests
describe('Fee Collection', () => {
  it('should calculate 0.1% fee correctly', ...)
})
```

---

**Architecture Version**: 1.0  
**Last Updated**: 2026-01-31  
**Maintained by**: Development team
