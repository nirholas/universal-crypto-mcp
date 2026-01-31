# 🚀 Agent Phase 3 Assignments

> **Continue building revenue infrastructure after Phase 2**

---

## Phase 3 Project Matrix

| Agent | Phase 3 Project | Revenue Impact |
|-------|-----------------|----------------|
| Agent 1 | Tiered Platform Fees | $65K/year |
| Agent 2 | Subscription Bridge | $30K/year |
| Agent 3 | Multi-Tenant API Gateway | $100K/year |
| Agent 4 | Public Analytics GraphQL API | $20K/year |
| Agent 5 | Video Tutorials & Demos | Conversion ↑ 40% |

---

# 📄 Phase 3 Individual Prompts

---

## Agent 1 Phase 3: Tiered Platform Fees

```
# 💎 Agent 1 Phase 3: Tiered Platform Fees

## Context
You completed Featured Listings. Now implement tiered platform fees where
high-volume service providers pay lower fees.

## Current State
The marketplace currently charges a flat 2.5% fee on all transactions.

## Goal
Implement volume-based fee tiers:
- Standard: 2.5% (< $10K/month)
- Silver: 2.0% ($10K-50K/month)
- Gold: 1.5% ($50K-200K/month)
- Platinum: 1.0% (> $200K/month)

## Contract Changes

Update `AIServiceMarketplace.sol`:

```solidity
struct FeeTier {
    uint256 threshold;  // Monthly volume threshold
    uint16 feeBps;      // Fee in basis points
}

FeeTier[] public feeTiers;

mapping(bytes32 => uint256) public monthlyVolume;
mapping(bytes32 => uint256) public lastVolumeReset;

function getEffectiveFee(bytes32 serviceId) public view returns (uint16) {
    uint256 volume = monthlyVolume[serviceId];
    
    // Find applicable tier (descending thresholds)
    for (uint i = feeTiers.length; i > 0; i--) {
        if (volume >= feeTiers[i-1].threshold) {
            return feeTiers[i-1].feeBps;
        }
    }
    
    return defaultFeeBps; // 2.5%
}

function recordTransaction(bytes32 serviceId, uint256 amount) internal {
    // Reset if new month
    if (block.timestamp > lastVolumeReset[serviceId] + 30 days) {
        monthlyVolume[serviceId] = 0;
        lastVolumeReset[serviceId] = block.timestamp;
    }
    
    monthlyVolume[serviceId] += amount;
}
```

## SDK Updates

```typescript
interface FeeTier {
  name: string;
  threshold: string;
  feePercent: number;
}

class TieredFeeService {
  async getFeeTiers(): Promise<FeeTier[]>
  async getServiceTier(serviceId: string): Promise<FeeTier>
  async getMonthlyVolume(serviceId: string): Promise<string>
  async getVolumeToNextTier(serviceId: string): Promise<{
    currentTier: string;
    nextTier: string;
    volumeNeeded: string;
    savingsAtNextTier: string;
  }>
}
```

## Dashboard Widget

Show service providers their tier status and savings.

## Completion Criteria
- [ ] Fee tiers in contract
- [ ] Automatic tier calculation
- [ ] Monthly volume tracking
- [ ] SDK methods work
- [ ] Dashboard shows tier info

## After Completion
Move to: Agent 1 Phase 4 - Service Staking Rewards
```

---

## Agent 2 Phase 3: Subscription Bridge

```
# 🔄 Agent 2 Phase 3: Subscription Bridge

## Context
You completed Credit Purchase. Now build a subscription system that
gives users monthly credit allowances.

## Goal
Let users subscribe to credit plans instead of one-time purchases.

## Subscription Tiers

| Plan | Monthly Price | Credits | Per-Credit | Savings |
|------|--------------|---------|------------|---------|
| Starter | $9.99 | 1,000 | $0.00999 | 0% |
| Pro | $24.99 | 3,000 | $0.00833 | 17% |
| Business | $99.99 | 15,000 | $0.00666 | 33% |
| Enterprise | $499.99 | 100,000 | $0.00500 | 50% |

## Implementation

### Stripe Products

```typescript
async function createSubscriptionProducts() {
  const products = [
    { name: 'Starter', price: 999, credits: 1000 },
    { name: 'Pro', price: 2499, credits: 3000 },
    { name: 'Business', price: 9999, credits: 15000 },
    { name: 'Enterprise', price: 49999, credits: 100000 },
  ];
  
  for (const p of products) {
    const product = await stripe.products.create({
      name: `x402 Credits - ${p.name}`,
      metadata: { credits: p.credits.toString() },
    });
    
    await stripe.prices.create({
      product: product.id,
      unit_amount: p.price,
      currency: 'usd',
      recurring: { interval: 'month' },
    });
  }
}
```

### SubscriptionService

```typescript
class SubscriptionService {
  async createSubscription(userId: string, planId: string): Promise<string>
  async cancelSubscription(userId: string): Promise<void>
  async upgradeSubscription(userId: string, newPlanId: string): Promise<void>
  async handleRenewal(subscriptionId: string): Promise<void>
  async getAllocateCredits(userId: string): Promise<void>
  
  // Check if credits should roll over
  async handleMonthEnd(userId: string): Promise<{
    expired: number;
    rolledOver: number;
  }>
}
```

### Database Schema

```sql
CREATE TABLE subscriptions (
  id UUID PRIMARY KEY,
  user_id VARCHAR(255) NOT NULL,
  stripe_subscription_id VARCHAR(255),
  plan_id VARCHAR(50) NOT NULL,
  status VARCHAR(20) NOT NULL,
  monthly_credits INTEGER NOT NULL,
  current_period_start TIMESTAMP,
  current_period_end TIMESTAMP,
  created_at TIMESTAMP DEFAULT NOW()
);

CREATE TABLE credit_allocations (
  id UUID PRIMARY KEY,
  subscription_id UUID REFERENCES subscriptions(id),
  credits_allocated INTEGER NOT NULL,
  credits_remaining INTEGER NOT NULL,
  period_start TIMESTAMP NOT NULL,
  period_end TIMESTAMP NOT NULL,
  rollover_allowed BOOLEAN DEFAULT false
);
```

### Webhook Handling

```typescript
async function handleSubscriptionWebhook(event: Stripe.Event) {
  switch (event.type) {
    case 'invoice.paid':
      // Allocate credits for new period
      await allocateMonthlyCredits(event.data.object);
      break;
      
    case 'customer.subscription.updated':
      // Handle upgrades/downgrades
      await handlePlanChange(event.data.object);
      break;
      
    case 'customer.subscription.deleted':
      // Expire remaining credits
      await expireSubscriptionCredits(event.data.object);
      break;
  }
}
```

## Revenue Model
- 500 subscribers × average $30/month = $15,000/month = $180,000/year
- Margin: ~40% (after credit costs) = $72K/year profit

## Completion Criteria
- [ ] Stripe products created
- [ ] Subscription flow works
- [ ] Credits auto-allocate
- [ ] Upgrade/downgrade works
- [ ] Cancellation works

## After Completion
Move to: Agent 2 Phase 4 - Usage-Based Billing
```

---

## Agent 3 Phase 3: Multi-Tenant API Gateway

```
# 🌐 Agent 3 Phase 3: Multi-Tenant API Gateway

## Context
You completed Agent Wallet. Now build a multi-tenant API gateway that
lets service providers onboard their APIs with automatic x402 integration.

## Goal
Service providers can register their APIs and we handle all payment
processing, giving them a cut and keeping a platform fee.

## How It Works

```
User → Our Gateway → x402 Payment → Service Provider API
                ↓
         We take 10% of fees
```

## Gateway Architecture

```
packages/gateway/
├── src/
│   ├── GatewayServer.ts
│   ├── TenantManager.ts
│   ├── ProxyHandler.ts
│   ├── PricingEngine.ts
│   └── RevenueShare.ts
```

## TenantManager

```typescript
interface Tenant {
  id: string;
  name: string;
  apiKey: string;
  upstreamUrl: string;      // Their actual API
  revenueShare: number;     // 90% to them, 10% to us
  pricing: EndpointPricing[];
  status: 'active' | 'pending' | 'suspended';
}

interface EndpointPricing {
  path: string;             // /api/data/*
  method: string;           // GET, POST, *
  price: string;            // $0.001
  network: string;          // base
}

class TenantManager {
  async createTenant(params: CreateTenantParams): Promise<Tenant>
  async getTenant(tenantId: string): Promise<Tenant>
  async updatePricing(tenantId: string, pricing: EndpointPricing[]): Promise<void>
  async getTenantByApiKey(apiKey: string): Promise<Tenant>
  async generateSubdomain(tenantId: string): Promise<string>
}
```

## ProxyHandler

```typescript
class ProxyHandler {
  async handleRequest(req: Request, tenant: Tenant): Promise<Response> {
    // 1. Check if payment is required
    const pricing = this.matchEndpoint(req, tenant.pricing);
    
    if (pricing) {
      // 2. Verify x402 payment header
      const paymentHeader = req.headers.get('X-Payment');
      if (!paymentHeader) {
        return this.return402(pricing, tenant);
      }
      
      const verified = await this.verifyPayment(paymentHeader, pricing);
      if (!verified) {
        return new Response('Payment invalid', { status: 402 });
      }
      
      // 3. Record payment and split revenue
      await this.recordPayment(tenant, pricing, paymentHeader);
    }
    
    // 4. Proxy to upstream
    return this.proxyToUpstream(req, tenant);
  }
  
  private return402(pricing: EndpointPricing, tenant: Tenant): Response {
    return new Response(JSON.stringify({
      x402Version: 1,
      accepts: [{
        scheme: 'exact',
        network: pricing.network,
        maxAmountRequired: pricing.price,
        resource: `${tenant.id}:${pricing.path}`,
        payTo: tenant.payoutAddress,
        extra: { tenantId: tenant.id },
      }],
    }), {
      status: 402,
      headers: { 'Content-Type': 'application/json' },
    });
  }
}
```

## Revenue Share

```typescript
class RevenueShareService {
  async splitPayment(
    tenant: Tenant,
    payment: VerifiedPayment
  ): Promise<void> {
    const platformFee = payment.amount * (1 - tenant.revenueShare);
    const tenantShare = payment.amount * tenant.revenueShare;
    
    // Record for later payout
    await this.recordRevenue(tenant.id, tenantShare);
    await this.recordPlatformFee(platformFee);
  }
  
  async processPayout(tenantId: string): Promise<string> {
    const pending = await this.getPendingRevenue(tenantId);
    if (pending < MINIMUM_PAYOUT) {
      throw new Error('Below minimum payout threshold');
    }
    
    const txHash = await this.transferToTenant(tenantId, pending);
    return txHash;
  }
}
```

## Tenant Dashboard

Each tenant gets:
- API key management
- Endpoint pricing configuration
- Revenue analytics
- Payout history

## Subdomain Routing

```typescript
// gateway.example.com/v1/api/...  → Shared
// tenant-id.gateway.example.com/... → Tenant-specific

async function routeRequest(req: Request): Promise<Response> {
  const host = req.headers.get('host');
  
  if (host.includes('.gateway.')) {
    const tenantId = host.split('.')[0];
    const tenant = await tenantManager.getTenant(tenantId);
    return proxyHandler.handleRequest(req, tenant);
  }
  
  // Shared API
  return handleSharedApi(req);
}
```

## Revenue Model
- 100 tenants × $1,000/month in API calls × 10% = $10,000/month
- Scale to 1000 tenants = $100,000/month

## Completion Criteria
- [ ] Tenant registration works
- [ ] Subdomain routing works
- [ ] x402 payment flow works
- [ ] Revenue splitting accurate
- [ ] Tenant dashboard functional

## After Completion
Move to: Agent 3 Phase 4 - Rate Limiting & Quotas
```

---

## Agent 4 Phase 3: Public Analytics GraphQL API

```
# 📈 Agent 4 Phase 3: Public Analytics GraphQL API

## Context
You completed the Dashboard UI. Now expose analytics via a public
GraphQL API that developers can query.

## Goal
Developers can query our analytics to build their own dashboards,
integrations, or monitoring systems.

## Tech Stack
- GraphQL Yoga or Apollo Server
- DataLoader for batching
- Redis for caching

## Schema

```graphql
type Query {
  # Network-level stats
  network(chainId: String!): NetworkStats
  networks: [NetworkStats!]!
  
  # Payment analytics
  payments(
    filter: PaymentFilter
    pagination: Pagination
  ): PaymentConnection!
  
  payment(id: ID!): Payment
  
  # Service analytics
  service(id: ID!): ServiceStats
  services(category: String): [ServiceStats!]!
  
  # Aggregations
  volumeByNetwork(window: TimeWindow!): [VolumePoint!]!
  feesByNetwork(window: TimeWindow!): [FeePoint!]!
  topServices(limit: Int, window: TimeWindow): [ServiceRanking!]!
  topPayers(limit: Int, window: TimeWindow): [PayerRanking!]!
}

type NetworkStats {
  chainId: String!
  chainName: String!
  totalVolume: String!
  totalPayments: Int!
  totalFees: String!
  successRate: Float!
  averageConfirmationTime: Float!
  last24hVolume: String!
  last24hPayments: Int!
}

type Payment {
  id: ID!
  payer: String!
  payee: String!
  amount: String!
  fee: String!
  network: String!
  status: PaymentStatus!
  createdAt: DateTime!
  settledAt: DateTime
  txHash: String
}

type PaymentConnection {
  edges: [PaymentEdge!]!
  pageInfo: PageInfo!
  totalCount: Int!
}

type ServiceStats {
  id: ID!
  name: String!
  category: String!
  totalRevenue: String!
  totalPayments: Int!
  uniquePayers: Int!
  averagePayment: String!
  rating: Float!
}

input PaymentFilter {
  network: String
  status: PaymentStatus
  minAmount: String
  maxAmount: String
  payer: String
  payee: String
  fromDate: DateTime
  toDate: DateTime
}

enum TimeWindow {
  HOUR
  DAY
  WEEK
  MONTH
}
```

## Resolvers

```typescript
const resolvers = {
  Query: {
    network: async (_, { chainId }, { dataSources }) => {
      return dataSources.analytics.getNetworkStats(chainId);
    },
    
    payments: async (_, { filter, pagination }, { dataSources }) => {
      return dataSources.analytics.getPayments(filter, pagination);
    },
    
    volumeByNetwork: async (_, { window }, { dataSources }) => {
      return dataSources.analytics.getVolumeTimeSeries(window);
    },
  },
  
  Payment: {
    // DataLoader for batching
    service: async (payment, _, { loaders }) => {
      return loaders.service.load(payment.serviceId);
    },
  },
};
```

## Rate Limiting

```typescript
const rateLimitPlugin = {
  async requestDidStart({ context }) {
    const key = context.apiKey || context.ip;
    const limit = context.apiKey ? 1000 : 100; // per hour
    
    const current = await redis.incr(`ratelimit:${key}`);
    if (current === 1) {
      await redis.expire(`ratelimit:${key}`, 3600);
    }
    
    if (current > limit) {
      throw new GraphQLError('Rate limit exceeded', {
        extensions: { code: 'RATE_LIMITED' },
      });
    }
  },
};
```

## API Key Tiers

```typescript
const API_TIERS = {
  free: {
    requestsPerHour: 100,
    maxComplexity: 50,
    features: ['basic_queries'],
  },
  developer: {
    price: '$19/month',
    requestsPerHour: 5000,
    maxComplexity: 200,
    features: ['basic_queries', 'historical_data', 'webhooks'],
  },
  enterprise: {
    price: '$199/month',
    requestsPerHour: 50000,
    maxComplexity: 1000,
    features: ['all'],
  },
};
```

## Caching

```typescript
const cachePlugin = {
  async responseForOperation({ request, document }) {
    // Cache based on query complexity and data freshness needs
    const cacheKey = createCacheKey(request);
    const cached = await redis.get(cacheKey);
    
    if (cached) {
      return JSON.parse(cached);
    }
    
    return null;
  },
  
  async willSendResponse({ request, response }) {
    const cacheKey = createCacheKey(request);
    const ttl = getCacheTTL(request); // 60s for real-time, 300s for historical
    
    await redis.setex(cacheKey, ttl, JSON.stringify(response));
  },
};
```

## Revenue Model
- Free tier: lead generation
- Developer: $19/month × 200 users = $3,800/month
- Enterprise: $199/month × 20 users = $3,980/month
- Total: ~$8K/month = $96K/year

## Completion Criteria
- [ ] GraphQL schema defined
- [ ] Resolvers implemented
- [ ] Rate limiting works
- [ ] Caching works
- [ ] API key tiers functional

## After Completion
Move to: Agent 4 Phase 4 - Webhook Events System
```

---

## Agent 5 Phase 3: Video Tutorials & Demos

```
# 🎬 Agent 5 Phase 3: Video Tutorials & Demos

## Context
You completed the Documentation Site. Now create video tutorials and
interactive demos.

## Goal
Create video content and interactive demos that help developers
understand and adopt the platform.

## Deliverables

### Video Scripts

1. **Getting Started (5 min)**
   - What is Universal Crypto MCP
   - Installing and configuring
   - First API call

2. **Building a Paid API (10 min)**
   - Setting up x402 middleware
   - Configuring pricing
   - Testing payments

3. **Agent Wallet Setup (8 min)**
   - Creating a wallet
   - Spending policies
   - MCP integration

4. **Marketplace Deep Dive (12 min)**
   - Registering services
   - Discovery and ratings
   - Featured listings

### Interactive Demos

```typescript
// packages/demos/
├── src/
│   ├── Demo.tsx
│   ├── demos/
│   │   ├── PaymentFlow.tsx
│   │   ├── WalletCreation.tsx
│   │   ├── ServiceDiscovery.tsx
│   │   └── LiveCoding.tsx
```

### PaymentFlow Demo

```tsx
function PaymentFlowDemo() {
  const [step, setStep] = useState(0);
  const [response, setResponse] = useState(null);
  
  const steps = [
    {
      title: 'Send Request',
      code: `const response = await fetch('/api/premium-data');`,
      action: () => simulateRequest(),
    },
    {
      title: 'Receive 402',
      code: `// Response: 402 Payment Required
{
  "x402Version": 1,
  "accepts": [...]
}`,
      auto: true,
    },
    {
      title: 'Create Payment',
      code: `const proof = await wallet.createPayment(requirements);`,
      action: () => simulatePayment(),
    },
    {
      title: 'Retry with Payment',
      code: `const data = await fetch('/api/premium-data', {
  headers: { 'X-Payment': proof }
});`,
      action: () => simulateSuccess(),
    },
  ];
  
  return (
    <div className="demo-container">
      <StepIndicator steps={steps} current={step} />
      <CodePanel code={steps[step].code} />
      <ResponsePanel response={response} />
      <ActionButton onClick={() => advanceStep()} />
    </div>
  );
}
```

### Terminal Demos

Use `asciinema` to record terminal demos:

```bash
# demos/terminal/
├── install.cast      # Installation
├── first-api.cast    # First API call
├── wallet.cast       # Wallet creation
├── deploy.cast       # Deployment
```

### Embed in Docs

```mdx
// docs/getting-started/quick-start.md

# Quick Start

Watch the 5-minute walkthrough:

<VideoEmbed src="/videos/getting-started.mp4" />

Or try the interactive demo:

<Demo name="payment-flow" />
```

### Landing Page Integration

```tsx
// website/src/components/DemoSection.tsx
function DemoSection() {
  return (
    <section className="py-20 bg-gray-900">
      <div className="container mx-auto">
        <h2 className="text-3xl font-bold text-white mb-8">
          See It In Action
        </h2>
        
        <div className="grid grid-cols-2 gap-8">
          <div>
            <h3>Payment Flow</h3>
            <PaymentFlowDemo />
          </div>
          
          <div>
            <h3>Live Code</h3>
            <LiveCodingDemo />
          </div>
        </div>
      </div>
    </section>
  );
}
```

### Video Production Checklist

For each video:
- [ ] Script written
- [ ] Screen recording done
- [ ] Voiceover recorded
- [ ] Edited and polished
- [ ] Captions added
- [ ] Uploaded to hosting
- [ ] Embedded in docs

### Hosting

- Videos: YouTube or Mux
- Demos: Embedded in docs/landing page
- Terminal: asciinema.org embeds

## Completion Criteria
- [ ] 4 video scripts written
- [ ] 2 videos recorded
- [ ] 3 interactive demos working
- [ ] Terminal demos recorded
- [ ] Embedded in documentation

## After Completion
Move to: Agent 5 Phase 4 - Developer Workshop Materials
```

---

# 🔄 Phase 4 Preview

After Phase 3:

| Agent | Phase 4 Project |
|-------|-----------------|
| Agent 1 | Service Staking Rewards |
| Agent 2 | Usage-Based Billing |
| Agent 3 | Rate Limiting & Quotas |
| Agent 4 | Webhook Events System |
| Agent 5 | Developer Workshop Materials |

---

# 📊 Cumulative Revenue Projections

| Phase | New Revenue | Running Total |
|-------|-------------|---------------|
| Phase 1 (Facilitator) | $100K/year | $100K |
| Phase 2 (Listings + Credits + Wallets + Dashboard + Docs) | $90K/year | $190K |
| Phase 3 (Fees + Subscriptions + Gateway + API) | $200K/year | $390K |
| Phase 4 (Staking + Billing + Webhooks) | $110K/year | $500K |

**Target: $500K ARR by end of Phase 4**
