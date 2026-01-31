# Agent Coordination Guide

**⚠️ IMPORTANT: Multiple agents working on this codebase simultaneously**

This document prevents duplicate implementations and merge conflicts when multiple AI agents are working in parallel.

## 🎯 Current Status (Last Updated: 2026-01-31)

### ✅ COMPLETED Components

| Component | Location | Status | Owner |
|-----------|----------|--------|-------|
| **Fee Collection** | `src/services/fees.ts` | ✅ Complete | Agent 1 |
| **Fee Settlement** | `src/services/settlement.ts` | ✅ Complete | Agent 1 |
| **Multi-Chain Support** | `src/services/multichain.ts` | ✅ Complete | Agent 1 |
| **Network Config** | `src/services/networks.ts` | ✅ Complete | Agent 1 |
| **Prometheus Metrics** | `src/services/metrics.ts` | ✅ Complete | Agent 1 |
| **Fee Routes** | `src/routes/fees.ts` | ✅ Complete | Agent 1 |
| **Settlement Routes** | `src/routes/settlement.ts` | ✅ Complete | Agent 1 |
| **Verify Route** | `src/routes/verify.ts` | ✅ Complete (w/ fees) | Agent 1 |
| **Settle Route** | `src/routes/settle.ts` | ✅ Complete (w/ fees) | Agent 1 |
| **Server Integration** | `src/server.ts` | ✅ Complete | Agent 1 |
| **Documentation** | `README.md`, `SETTLEMENT_GUIDE.md` | ✅ Complete | Agent 1 |

### 🔨 DO NOT MODIFY These Files

If you're an agent working on this repo, **DO NOT** create or modify these files (already implemented):

```
src/services/fees.ts           # Fee calculation & tracking (350 LOC)
src/services/settlement.ts     # Fee batching & withdrawal (334 LOC)
src/services/multichain.ts     # Multi-chain support (400 LOC)
src/services/networks.ts       # Network configurations (240 LOC)
src/services/metrics.ts        # Prometheus metrics (280 LOC)
src/routes/fees.ts            # Fee API endpoints (180 LOC)
src/routes/settlement.ts      # Settlement admin routes (180 LOC)
```

### 🚧 Available for Implementation

These areas can be worked on **independently** by different agents:

| Area | Priority | Complexity | Assigned To |
|------|----------|-----------|-------------|
| **Database Persistence** | High | Medium | Available |
| **Admin Dashboard UI** | Medium | High | Available |
| **Fee Collection Contract** | High | High | Available |
| **Testing Suite** | High | Medium | Available |
| **CI/CD Pipeline** | Medium | Medium | Available |
| **Grafana Dashboards** | Low | Low | Available |

## 🔐 File Ownership Matrix

### Core Revenue Infrastructure (Agent 1 - DONE)

```
packages/payments/x402/facilitator/
├── src/
│   ├── services/
│   │   ├── fees.ts            ✅ LOCKED - Fee service
│   │   ├── settlement.ts      ✅ LOCKED - Settlement automation
│   │   ├── multichain.ts      ✅ LOCKED - Multi-chain client
│   │   ├── networks.ts        ✅ LOCKED - Network configs
│   │   └── metrics.ts         ✅ LOCKED - Prometheus metrics
│   ├── routes/
│   │   ├── fees.ts           ✅ LOCKED - Fee API
│   │   ├── settlement.ts     ✅ LOCKED - Settlement API
│   │   ├── verify.ts         ✅ LOCKED - Payment verification (w/ fees)
│   │   └── settle.ts         ✅ LOCKED - Gasless settlement (w/ fees)
│   └── server.ts             ✅ LOCKED - Server with all integrations
├── SETTLEMENT_GUIDE.md        ✅ LOCKED - Settlement docs
├── DEPLOYMENT_CHECKLIST.md    ✅ LOCKED - Deployment guide
└── revenue-calculator.js      ✅ LOCKED - Revenue projections
```

### Testing & Quality (Available)

```
packages/payments/x402/facilitator/
├── test/
│   ├── services/
│   │   ├── fees.test.ts       🟢 OPEN - Unit tests for fees
│   │   ├── settlement.test.ts 🟢 OPEN - Unit tests for settlement
│   │   └── multichain.test.ts 🟢 OPEN - Unit tests for multichain
│   ├── routes/
│   │   ├── fees.test.ts       🟢 OPEN - Integration tests for fees API
│   │   └── settlement.test.ts 🟢 OPEN - Integration tests for settlement API
│   └── e2e/
│       └── settlement.e2e.ts  🟢 OPEN - End-to-end settlement flow
```

### Database Layer (Available)

```
packages/payments/x402/facilitator/
├── src/
│   ├── db/
│   │   ├── schema.ts          🟢 OPEN - Prisma/Drizzle schema for fees
│   │   ├── migrations/        🟢 OPEN - Database migrations
│   │   └── client.ts          🟢 OPEN - Database client
│   └── services/
│       └── fees-db.ts         🟢 OPEN - Database-backed fee service
```

### Smart Contracts (Available)

```
contracts/
├── FeeCollector.sol           🟢 OPEN - On-chain fee collection
├── FeeDistributor.sol         🟢 OPEN - Fee distribution to treasury
└── test/
    └── FeeCollector.test.ts   🟢 OPEN - Contract tests
```

### Admin Dashboard (Available)

```
dashboard/
├── src/
│   ├── components/
│   │   ├── FeesChart.tsx      🟢 OPEN - Revenue visualization
│   │   ├── SettlementTable.tsx 🟢 OPEN - Settlement history
│   │   └── MetricsCards.tsx   🟢 OPEN - KPI cards
│   └── pages/
│       └── admin.tsx          🟢 OPEN - Admin dashboard page
```

### Monitoring (Available)

```
monitoring/
├── grafana/
│   ├── dashboards/
│   │   ├── revenue.json       🟢 OPEN - Revenue dashboard
│   │   └── settlement.json    🟢 OPEN - Settlement monitoring
│   └── alerts/
│       └── fees.yaml          🟢 OPEN - Alert rules for fees
```

## 🚨 Conflict Prevention Rules

### Rule 1: Check Before You Code

**BEFORE creating or modifying ANY file:**

```bash
# Check if file exists and is locked
grep "✅ LOCKED" AGENT_COORDINATION.md | grep <filename>

# If locked, DO NOT TOUCH IT
# If open (🟢 OPEN), claim it by updating this file
```

### Rule 2: Claim Your Work

When starting work on an available area:

1. **Update this file** with your agent ID:
   ```markdown
   | **Testing Suite** | High | Medium | Agent 2 (Started: 2026-01-31) |
   ```

2. **Lock the files** you're working on:
   ```markdown
   ├── test/services/fees.test.ts  🔒 Agent 2 - In Progress
   ```

3. **Commit your claim** immediately:
   ```bash
   git add AGENT_COORDINATION.md
   git commit -m "Agent 2: Claim testing suite"
   git push
   ```

### Rule 3: Integration Points

If you MUST integrate with existing code:

1. **Read the existing code first** - Don't assume how it works
2. **Import, don't duplicate** - Use existing functions/classes
3. **Extend, don't replace** - Add new methods to interfaces, don't rewrite
4. **Test compatibility** - Ensure your code works with existing services

### Rule 4: Communication Protocol

When you need to coordinate:

1. **Document in this file** under "Coordination Notes" below
2. **Reference specific line numbers** for integration points
3. **Provide interface contracts** if creating new services
4. **Update this file** when done (mark ✅ COMPLETE)

## 📋 Integration Points

### For Database Implementation

```typescript
// Use existing FeeService as interface
import { FeeService, FeeRecord } from './services/fees.js';

// Extend, don't replace
class DatabaseFeeService extends FeeService {
  // Add database persistence
  async persistFee(record: FeeRecord): Promise<void> {
    // Save to DB
  }
  
  // Override to load from DB
  getUnsettledFees(): FeeRecord[] {
    return this.loadFromDatabase();
  }
}
```

### For Contract Implementation

```solidity
// Smart contract should match existing fee structure
interface IFeeCollector {
  // Match FeeService.calculateFee() parameters
  function calculateFee(
    uint256 amount,
    address payer
  ) external view returns (uint256 fee);
  
  // Match settlement.ts batching
  function settleBatch(
    address[] calldata payers,
    uint256[] calldata amounts
  ) external;
}
```

### For Testing

```typescript
// Import existing services for testing
import { createFeeService } from '../src/services/fees.js';
import { createFeeSettlementService } from '../src/services/settlement.js';

// Test against actual implementations
describe('Fee Settlement Integration', () => {
  it('should settle accumulated fees', async () => {
    const feeService = createFeeService({ feeRecipient: '0x...' });
    const settlementService = createFeeSettlementService(/*...*/);
    // Test actual flow
  });
});
```

## 📝 Coordination Notes

### Agent 1 Notes (2026-01-31)

**What's Implemented:**
- Complete fee collection (0.1% with volume tiers)
- Automatic settlement every hour when ≥$10 accumulated
- Multi-chain support (8 networks: 4 prod + 4 testnet)
- Admin API for manual settlement (requires ADMIN_KEY)
- Prometheus metrics for monitoring
- Full documentation (README, SETTLEMENT_GUIDE, DEPLOYMENT_CHECKLIST)

**Key Design Decisions:**
1. **In-memory storage** - Fee records stored in-memory arrays (needs DB for production scale)
2. **Simulated settlement** - Marks fees as settled but doesn't execute on-chain (needs contract)
3. **Volume tiers** - Monthly volume resets calculated by `getMonthStart()`
4. **Fee calculation** - `grossAmount - feeAmount = netAmount`
5. **Settlement batching** - Groups by network + token for gas efficiency

**Integration Points:**
- FeeService exposes: `calculateFee()`, `recordFee()`, `getUnsettledFees()`, `markSettled()`
- Settlement exposes: `getPendingFees()`, `settleAll()`, `settleNetwork()`
- Server wires everything at lines 115-136 in `server.ts`

**What Needs Work:**
1. Database persistence (replace in-memory arrays)
2. On-chain fee collection contract
3. Gas optimization for large batches
4. Admin dashboard UI
5. Comprehensive test coverage

### Agent 2 Notes (Add yours here)

```markdown
**Agent ID:** Agent 2
**Started:** YYYY-MM-DD
**Working On:** [Component name]

**Changes:**
- List your changes here

**Dependencies:**
- What you need from other agents
```

### Agent 3 Notes (Add yours here)

```markdown
**Agent ID:** Agent 3
**Started:** YYYY-MM-DD
**Working On:** [Component name]

**Changes:**
- List your changes here

**Dependencies:**
- What you need from other agents
```

## 🎯 Recommended Work Distribution

### Optimal Parallelization

**Agent 2: Testing & Quality**
- Write comprehensive test suite
- Set up CI/CD pipeline
- Integration tests for fee collection
- E2E tests for settlement flow
- **No conflicts** with core implementation

**Agent 3: Database Layer**
- Design schema for fee persistence
- Implement database-backed FeeService
- Migration scripts
- Database indexes for performance
- **Minimal conflicts** - extends existing service

**Agent 4: Smart Contracts**
- FeeCollector.sol on-chain implementation
- Batch settlement optimization
- Gas cost analysis
- Security audit preparation
- **No conflicts** - separate layer

**Agent 5: Admin Dashboard**
- React/Next.js admin interface
- Revenue charts and metrics
- Settlement history table
- Manual settlement controls
- **No conflicts** - separate frontend

## 🔍 How to Verify You're Not Duplicating Work

### Before Starting

```bash
# 1. Check this coordination file
cat AGENT_COORDINATION.md

# 2. Search for existing implementations
grep -r "class FeeService" src/
grep -r "settlement" src/

# 3. List all services
ls -la src/services/

# 4. Check what's imported in server.ts
grep "import" src/server.ts | grep -E "(Fee|Settlement)"
```

### If You Find Duplicates

1. **STOP immediately**
2. **Read the existing implementation**
3. **Update AGENT_COORDINATION.md** with what you found
4. **Choose different task** from Available list
5. **Document the conflict** in Coordination Notes

## 📞 Emergency Coordination

If you encounter a **blocking conflict**:

1. **Do not force push** or overwrite
2. **Document the conflict** in this file
3. **Mark your branch** with descriptive name: `agent-2-testing-suite`
4. **Create integration branch** if needed: `integration-agent1-agent2`
5. **Coordinate merge** by updating this file

## ✅ Completion Checklist

When your work is done:

- [ ] Update AGENT_COORDINATION.md (mark ✅ COMPLETE)
- [ ] Update main README.md if needed
- [ ] Add your component to server.ts if needed
- [ ] Document integration points
- [ ] Run `pnpm run build` - ensure no errors
- [ ] Run `pnpm run test` - ensure tests pass
- [ ] Update deployment docs if needed
- [ ] Mark files as 🔒 LOCKED if others shouldn't modify

---

**Last Updated:** 2026-01-31  
**Active Agents:** 1  
**Locked Files:** 12  
**Available Tasks:** 6  

**Status:** ✅ Core revenue infrastructure complete. Database, testing, contracts, and dashboard available for parallel development.
