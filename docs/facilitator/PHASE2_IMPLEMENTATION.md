# 🎯 Agent Phase 2 Assignments

> **After completing the Facilitator, each agent moves to their next project.**

This document contains the follow-up prompts for each agent after they complete their facilitator tasks.

---

## Quick Reference

| Agent | Facilitator Task | Phase 2 Project |
|-------|-----------------|-----------------|
| Agent 1 | Core Engine | Featured Listings Contract |
| Agent 2 | Settlement Engine | Credit Purchase System |
| Agent 3 | REST API | Agent Wallet SDK |
| Agent 4 | Monitoring | Analytics Dashboard UI |
| Agent 5 | Deployment | Documentation Site |

---

# 📄 Individual Phase 2 Prompts

Copy the appropriate prompt when an agent finishes their facilitator work.

---

## Agent 1 Phase 2: Featured Listings Contract

```
# 🏆 Agent 1 Phase 2: Featured Listings Contract

## Context
You completed the Facilitator Core Engine. Now build the Featured Listings
smart contract that lets service providers pay to have their services
prominently displayed in the marketplace.

## Mission
Add featured listing functionality to the AIServiceMarketplace contract
and create the TypeScript SDK integration.

## Existing Code
- `/workspaces/universal-crypto-mcp/contracts/marketplace/AIServiceMarketplace.sol`
- `/workspaces/universal-crypto-mcp/packages/marketplace/src/`

## Requirements

### Smart Contract Updates

Add to AIServiceMarketplace.sol:

1. **State Variables:**
   - `mapping(bytes32 => uint256) public featuredUntil` - When featuring expires
   - `mapping(bytes32 => uint8) public featuredTier` - Bronze/Silver/Gold (1/2/3)
   - `uint256[3] public featuredPrices` - Price per tier per week

2. **Functions:**
   - `purchaseFeaturedSpot(bytes32 serviceId, uint8 tier, uint8 weeks)`
   - `renewFeaturedSpot(bytes32 serviceId, uint8 weeks)`
   - `getFeaturedServices()` - Returns array of currently featured
   - `setFeaturedPrices(uint256[3] prices)` - Owner only

3. **Events:**
   - `ServiceFeatured(bytes32 indexed serviceId, uint8 tier, uint256 expiresAt)`
   - `FeaturedRenewed(bytes32 indexed serviceId, uint256 newExpiry)`

4. **Pricing Tiers:**
   - Bronze: $50/week - Highlighted in category
   - Silver: $100/week - Category + Homepage sidebar
   - Gold: $200/week - Top of homepage, all categories

### TypeScript SDK

Create `packages/marketplace/src/featured/`:

1. **FeaturedService.ts:**
   ```typescript
   class FeaturedService {
     async purchaseFeature(serviceId: string, tier: 'bronze' | 'silver' | 'gold', weeks: number)
     async renewFeature(serviceId: string, weeks: number)
     async getFeaturedServices(tier?: string): Promise<FeaturedListing[]>
     async checkFeaturedStatus(serviceId: string): Promise<FeaturedStatus>
   }
   ```

2. **Types:**
   ```typescript
   interface FeaturedListing {
     serviceId: string;
     tier: 'bronze' | 'silver' | 'gold';
     expiresAt: Date;
     service: RegisteredService;
   }
   
   interface FeaturedStatus {
     isFeatured: boolean;
     tier?: string;
     expiresAt?: Date;
     daysRemaining?: number;
   }
   ```

### Revenue Impact
- 50 featured services × average $100/week = $5,000/week = $260,000/year

## Testing Requirements
- Unit tests for contract functions
- Integration tests for SDK
- Test tier upgrades and renewals

## Completion Criteria
- [ ] Contract compiles and passes tests
- [ ] SDK methods work end-to-end
- [ ] Events emit correctly
- [ ] Pricing tiers configurable

## After Completion
Move to: Agent 1 Phase 3 - Tiered Platform Fees
```

---

## Agent 2 Phase 2: Credit Purchase System

```
# 💳 Agent 2 Phase 2: Credit Purchase System

## Context
You completed the Settlement Engine. Now build the credit purchase system
that lets users buy credits with fiat (Stripe) and use them for x402 payments.

## Mission
Create a credit system that bridges fiat payments to x402 crypto payments,
making the system accessible to users who don't want to handle crypto directly.

## Architecture

```
User buys credits (Stripe) → Credits stored in DB → 
Credits auto-convert to x402 payments when used
```

## Requirements

### Packages to Create

`packages/credits/`:
```
├── package.json
├── src/
│   ├── index.ts
│   ├── CreditService.ts
│   ├── StripeIntegration.ts
│   ├── CreditWallet.ts
│   ├── ConversionEngine.ts
│   └── types.ts
└── tests/
```

### Core Types

```typescript
interface CreditBalance {
  userId: string;
  balance: number;  // Credits (1 credit = $0.01)
  reserved: number; // Credits reserved for pending payments
  lastTopUp: Date;
}

interface CreditPurchase {
  id: string;
  userId: string;
  amount: number;
  usdPaid: string;
  stripePaymentId: string;
  status: 'pending' | 'completed' | 'failed';
  createdAt: Date;
}

interface CreditUsage {
  id: string;
  userId: string;
  creditsUsed: number;
  paymentId: string;  // Links to x402 payment
  service: string;
  createdAt: Date;
}
```

### CreditService

```typescript
class CreditService {
  // Purchase credits
  async createCheckoutSession(userId: string, creditAmount: number): Promise<string>
  async handleStripeWebhook(event: Stripe.Event): Promise<void>
  
  // Balance management
  async getBalance(userId: string): Promise<CreditBalance>
  async reserveCredits(userId: string, amount: number): Promise<string>
  async confirmUsage(reservationId: string): Promise<void>
  async releaseReservation(reservationId: string): Promise<void>
  
  // Auto-topup
  async setAutoTopUp(userId: string, config: AutoTopUpConfig): Promise<void>
  async checkAndTopUp(userId: string): Promise<boolean>
}

interface AutoTopUpConfig {
  enabled: boolean;
  threshold: number;  // Top up when below this
  amount: number;     // Credits to purchase
  paymentMethodId: string;
}
```

### Stripe Integration

```typescript
class StripeIntegration {
  async createCheckoutSession(params: {
    userId: string;
    credits: number;
    successUrl: string;
    cancelUrl: string;
  }): Promise<Stripe.Checkout.Session>
  
  async createPaymentIntent(params: {
    userId: string;
    amount: number;
    paymentMethodId: string;
  }): Promise<Stripe.PaymentIntent>
  
  async handleWebhook(
    signature: string,
    payload: Buffer
  ): Promise<CreditPurchase>
}
```

### Conversion Engine

Automatically converts credit usage to x402 payments:

```typescript
class ConversionEngine {
  // Wrap an HTTP client to use credits
  wrapWithCredits<T extends AxiosInstance>(
    client: T,
    userId: string
  ): T
  
  // Handle x402 response by paying with credits
  async handlePaymentRequired(
    userId: string,
    requirements: PaymentRequirements
  ): Promise<PaymentProof>
  
  // Convert credits to on-chain payment
  private async convertToPayment(
    credits: number,
    requirements: PaymentRequirements
  ): Promise<PaymentProof>
}
```

### Pricing Strategy

```typescript
const CREDIT_PRICING = {
  // Markup on credits (revenue source)
  100: { price: '$1.00', perCredit: '$0.0100' },    // No discount
  500: { price: '$4.75', perCredit: '$0.0095' },   // 5% discount
  1000: { price: '$9.00', perCredit: '$0.0090' },  // 10% discount
  5000: { price: '$42.50', perCredit: '$0.0085' }, // 15% discount
  10000: { price: '$80.00', perCredit: '$0.0080' }, // 20% discount
};
```

### API Endpoints

Add to facilitator or create separate service:

```typescript
// Buy credits
POST /v1/credits/checkout
{ userId: string, credits: number }
→ { checkoutUrl: string }

// Get balance
GET /v1/credits/balance/:userId
→ { balance: number, reserved: number }

// Get history
GET /v1/credits/history/:userId
→ { purchases: CreditPurchase[], usage: CreditUsage[] }

// Configure auto-topup
POST /v1/credits/auto-topup
{ userId: string, config: AutoTopUpConfig }

// Stripe webhook
POST /v1/credits/webhook
```

### Revenue Model

- Credits sold at 10% markup over face value
- $100 in credits = $110 purchase price
- At $250K credit sales/year = $25K revenue

## Database Schema

```sql
CREATE TABLE credit_balances (
  user_id VARCHAR(255) PRIMARY KEY,
  balance DECIMAL(18, 2) NOT NULL DEFAULT 0,
  reserved DECIMAL(18, 2) NOT NULL DEFAULT 0,
  total_purchased DECIMAL(18, 2) NOT NULL DEFAULT 0,
  total_used DECIMAL(18, 2) NOT NULL DEFAULT 0,
  updated_at TIMESTAMP DEFAULT NOW()
);

CREATE TABLE credit_purchases (
  id UUID PRIMARY KEY,
  user_id VARCHAR(255) NOT NULL,
  credits DECIMAL(18, 2) NOT NULL,
  usd_amount DECIMAL(18, 2) NOT NULL,
  stripe_payment_id VARCHAR(255),
  status VARCHAR(20) NOT NULL,
  created_at TIMESTAMP DEFAULT NOW()
);

CREATE TABLE credit_usage (
  id UUID PRIMARY KEY,
  user_id VARCHAR(255) NOT NULL,
  credits_used DECIMAL(18, 2) NOT NULL,
  payment_id VARCHAR(255),
  service_id VARCHAR(255),
  created_at TIMESTAMP DEFAULT NOW()
);
```

## Testing Requirements
- Stripe webhook handling
- Credit reservation/confirmation flow
- Auto-topup triggers
- Conversion accuracy

## Completion Criteria
- [ ] Stripe checkout works
- [ ] Credits tracked accurately
- [ ] x402 conversion works
- [ ] Auto-topup functional

## After Completion
Move to: Agent 2 Phase 3 - Subscription Bridge (monthly subscriptions → credit allowances)
```

---

## Agent 3 Phase 2: Agent Wallet SDK

```
# 🤖 Agent 3 Phase 2: Agent Wallet SDK

## Context
You completed the Facilitator REST API. Now build the Agent Wallet SDK that
lets AI agents have their own funded wallets with spending controls.

## Mission
Create a wallet system specifically designed for AI agents, with spending
limits, service allowlists, and automatic top-up functionality.

## Use Case

AI agents (Claude, GPT, etc.) need to pay for services autonomously.
They need:
- Pre-funded wallets
- Spending limits (per day, per service)
- Allowlists (only certain services)
- Owner oversight and control
- Automatic refill when low

## Package Structure

`packages/agent-wallet/`:
```
├── package.json
├── src/
│   ├── index.ts
│   ├── AgentWallet.ts
│   ├── WalletManager.ts
│   ├── SpendingPolicy.ts
│   ├── AllowlistManager.ts
│   ├── x402Client.ts
│   └── types.ts
└── tests/
```

## Core Types

```typescript
interface AgentWallet {
  id: string;
  name: string;
  owner: string;              // User who controls the wallet
  address: string;            // On-chain address
  network: string;            // Default network
  balance: string;            // Current USDC balance
  spendingPolicy: SpendingPolicy;
  allowlist: ServiceAllowlist;
  status: 'active' | 'paused' | 'depleted';
  createdAt: Date;
}

interface SpendingPolicy {
  dailyLimit: string;         // Max per day
  perTransactionLimit: string; // Max per transaction
  monthlyLimit: string;       // Max per month
  cooldownSeconds?: number;   // Min time between transactions
  currentDaySpent: string;
  currentMonthSpent: string;
  lastReset: Date;
}

interface ServiceAllowlist {
  mode: 'allowlist' | 'blocklist' | 'all';
  services: string[];         // Service IDs or patterns
  categories?: string[];      // Allowed categories
}

interface AutoTopUp {
  enabled: boolean;
  threshold: string;          // Top up when below
  amount: string;             // Amount to add
  source: 'owner_wallet' | 'credits' | 'stripe';
  maxPerMonth: string;        // Safety cap
  currentMonthTopUps: string;
}

interface WalletActivity {
  id: string;
  walletId: string;
  type: 'payment' | 'topup' | 'refund' | 'policy_change';
  amount: string;
  service?: string;
  paymentId?: string;
  timestamp: Date;
}
```

## WalletManager

```typescript
class WalletManager {
  /**
   * Create a new agent wallet
   */
  async createWallet(params: {
    name: string;
    owner: string;
    network: string;
    initialBalance: string;
    spendingPolicy: SpendingPolicy;
    allowlist?: ServiceAllowlist;
    autoTopUp?: AutoTopUp;
  }): Promise<AgentWallet>

  /**
   * Get wallet by ID
   */
  async getWallet(walletId: string): Promise<AgentWallet>

  /**
   * List wallets for an owner
   */
  async listWallets(owner: string): Promise<AgentWallet[]>

  /**
   * Update spending policy
   */
  async updatePolicy(
    walletId: string,
    policy: Partial<SpendingPolicy>
  ): Promise<void>

  /**
   * Update allowlist
   */
  async updateAllowlist(
    walletId: string,
    allowlist: ServiceAllowlist
  ): Promise<void>

  /**
   * Pause/resume wallet
   */
  async setWalletStatus(
    walletId: string,
    status: 'active' | 'paused'
  ): Promise<void>

  /**
   * Add funds to wallet
   */
  async topUp(
    walletId: string,
    amount: string,
    source: string
  ): Promise<void>

  /**
   * Get wallet activity
   */
  async getActivity(
    walletId: string,
    options?: { limit?: number; offset?: number }
  ): Promise<WalletActivity[]>
}
```

## AgentWallet Client

For use by AI agents:

```typescript
class AgentWalletClient {
  constructor(config: {
    walletId: string;
    apiKey: string;
    facilitatorUrl: string;
  })

  /**
   * Create x402 client that uses this wallet
   */
  createX402Client(): x402Client

  /**
   * Wrap axios to auto-pay with wallet
   */
  wrapAxios<T extends AxiosInstance>(client: T): T

  /**
   * Check if payment is allowed
   */
  async canPay(amount: string, serviceId?: string): Promise<{
    allowed: boolean;
    reason?: string;
  }>

  /**
   * Get remaining budget
   */
  async getBudget(): Promise<{
    dailyRemaining: string;
    monthlyRemaining: string;
    balance: string;
  }>

  /**
   * Request payment authorization
   */
  async authorizePayment(
    requirements: PaymentRequirements
  ): Promise<PaymentProof>
}
```

## MCP Integration

For Claude and other MCP-compatible agents:

```typescript
// In MCP server setup
import { AgentWalletClient } from '@nirholas/agent-wallet';

const wallet = new AgentWalletClient({
  walletId: process.env.AGENT_WALLET_ID,
  apiKey: process.env.AGENT_WALLET_API_KEY,
  facilitatorUrl: 'https://facilitator.yourdomain.com',
});

// Wrap API client
const api = wallet.wrapAxios(axios.create({
  baseURL: 'https://api.example.com'
}));

// Now API calls auto-pay when 402 is returned
const data = await api.get('/paid-endpoint');
```

## Claude Desktop Config

```json
{
  "mcpServers": {
    "my-agent": {
      "command": "npx",
      "args": ["@nirholas/my-mcp-server"],
      "env": {
        "AGENT_WALLET_ID": "wallet_abc123",
        "AGENT_WALLET_API_KEY": "ak_xyz789"
      }
    }
  }
}
```

## Spending Policy Enforcement

```typescript
class SpendingPolicy {
  /**
   * Check if a payment is allowed
   */
  async checkPayment(
    wallet: AgentWallet,
    amount: string,
    serviceId?: string
  ): Promise<PolicyCheckResult>

  /**
   * Record a payment
   */
  async recordPayment(
    wallet: AgentWallet,
    amount: string
  ): Promise<void>

  /**
   * Reset daily/monthly counters
   */
  async resetCounters(wallet: AgentWallet): Promise<void>
}

interface PolicyCheckResult {
  allowed: boolean;
  reason?: 
    | 'insufficient_balance'
    | 'daily_limit_exceeded'
    | 'monthly_limit_exceeded'
    | 'transaction_too_large'
    | 'service_not_allowed'
    | 'wallet_paused'
    | 'cooldown_active';
  remainingDaily?: string;
  remainingMonthly?: string;
}
```

## Auto Top-Up Flow

```typescript
class AutoTopUpService {
  /**
   * Check and execute auto top-up if needed
   */
  async checkAndTopUp(walletId: string): Promise<{
    topped: boolean;
    amount?: string;
    newBalance?: string;
  }>

  /**
   * Execute top-up from source
   */
  private async executeTopUp(
    wallet: AgentWallet,
    amount: string,
    source: AutoTopUp['source']
  ): Promise<void>
}
```

## API Endpoints

```typescript
// Wallet management
POST   /v1/wallets              - Create wallet
GET    /v1/wallets              - List wallets
GET    /v1/wallets/:id          - Get wallet
PATCH  /v1/wallets/:id          - Update wallet
DELETE /v1/wallets/:id          - Delete wallet

// Spending policy
GET    /v1/wallets/:id/policy   - Get policy
PATCH  /v1/wallets/:id/policy   - Update policy

// Allowlist
GET    /v1/wallets/:id/allowlist
PUT    /v1/wallets/:id/allowlist

// Activity
GET    /v1/wallets/:id/activity
GET    /v1/wallets/:id/activity/summary

// Agent endpoints (API key auth)
GET    /v1/agent/budget         - Check remaining budget
POST   /v1/agent/authorize      - Request payment auth
```

## Revenue Model

- Wallet creation fee: $0 (free to create)
- Monthly fee per wallet: $1.50
- Top-up fee: 1% of amount
- 1000 wallets × $1.50/month = $1,500/month
- $100K in top-ups × 1% = $1,000/month

## Testing Requirements
- Policy enforcement accuracy
- Concurrent payment handling
- Auto top-up triggers correctly
- MCP integration works

## Completion Criteria
- [ ] Wallet creation/management works
- [ ] Spending policies enforced
- [ ] Auto top-up functional
- [ ] MCP integration tested

## After Completion
Move to: Agent 3 Phase 3 - Multi-Tenant API Gateway
```

---

## Agent 4 Phase 2: Analytics Dashboard UI

```
# 📊 Agent 4 Phase 2: Analytics Dashboard UI

## Context
You completed the Monitoring & Analytics backend. Now build the frontend
dashboard to visualize all that data.

## Mission
Create a React-based dashboard that displays real-time analytics, revenue
tracking, and system health for the facilitator.

## Tech Stack
- React 18 + TypeScript
- Tailwind CSS
- Recharts for visualizations
- TanStack Query for data fetching
- WebSocket for real-time updates

## Package Structure

`packages/dashboard/`:
```
├── package.json
├── vite.config.ts
├── tailwind.config.js
├── src/
│   ├── main.tsx
│   ├── App.tsx
│   ├── components/
│   │   ├── layout/
│   │   │   ├── Sidebar.tsx
│   │   │   ├── Header.tsx
│   │   │   └── Layout.tsx
│   │   ├── charts/
│   │   │   ├── RevenueChart.tsx
│   │   │   ├── PaymentChart.tsx
│   │   │   ├── NetworkDistribution.tsx
│   │   │   └── HealthIndicator.tsx
│   │   ├── cards/
│   │   │   ├── StatCard.tsx
│   │   │   ├── RevenueCard.tsx
│   │   │   └── NetworkCard.tsx
│   │   └── tables/
│   │       ├── PaymentsTable.tsx
│   │       ├── TopPayersTable.tsx
│   │       └── TopPayeesTable.tsx
│   ├── pages/
│   │   ├── Dashboard.tsx
│   │   ├── Payments.tsx
│   │   ├── Revenue.tsx
│   │   ├── Networks.tsx
│   │   └── Settings.tsx
│   ├── hooks/
│   │   ├── useAnalytics.ts
│   │   ├── useWebSocket.ts
│   │   └── useRealTimeStats.ts
│   ├── services/
│   │   ├── api.ts
│   │   └── websocket.ts
│   └── types/
│       └── analytics.ts
└── tests/
```

## Key Components

### Dashboard Page

Main overview with:
- Total revenue (today, this week, this month)
- Total payments processed
- Success rate gauge
- Revenue over time chart
- Payments per hour chart
- Network distribution pie chart
- Recent payments table
- System health status

### Revenue Chart

```tsx
interface RevenueChartProps {
  data: { timestamp: number; value: number }[];
  window: '24h' | '7d' | '30d';
  onWindowChange: (window: string) => void;
}

function RevenueChart({ data, window, onWindowChange }: RevenueChartProps) {
  return (
    <div className="bg-white rounded-lg shadow p-6">
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-lg font-semibold">Revenue</h3>
        <WindowSelector value={window} onChange={onWindowChange} />
      </div>
      <ResponsiveContainer width="100%" height={300}>
        <AreaChart data={data}>
          <defs>
            <linearGradient id="revenueGradient" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#10B981" stopOpacity={0.3}/>
              <stop offset="95%" stopColor="#10B981" stopOpacity={0}/>
            </linearGradient>
          </defs>
          <XAxis dataKey="timestamp" tickFormatter={formatTime} />
          <YAxis tickFormatter={formatCurrency} />
          <Tooltip content={<CustomTooltip />} />
          <Area
            type="monotone"
            dataKey="value"
            stroke="#10B981"
            fill="url(#revenueGradient)"
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
}
```

### Real-Time Stats

```tsx
function useRealTimeStats() {
  const [stats, setStats] = useState<RealTimeStats | null>(null);
  
  useWebSocket('wss://facilitator.example.com/ws', {
    onMessage: (event) => {
      if (event.type === 'stats:update') {
        setStats(event.data);
      }
    },
    channels: ['stats'],
  });
  
  return stats;
}

function LiveStats() {
  const stats = useRealTimeStats();
  
  return (
    <div className="grid grid-cols-4 gap-4">
      <StatCard
        title="Payments/min"
        value={stats?.paymentsPerMinute || 0}
        trend={stats?.trend}
        icon={<ArrowUpIcon />}
      />
      <StatCard
        title="Revenue/hour"
        value={formatCurrency(stats?.revenuePerHour || '0')}
        icon={<CurrencyIcon />}
      />
      <StatCard
        title="Pending"
        value={stats?.pendingSettlements || 0}
        status={stats?.pendingSettlements > 50 ? 'warning' : 'normal'}
      />
      <StatCard
        title="Connections"
        value={stats?.activeConnections || 0}
        icon={<UsersIcon />}
      />
    </div>
  );
}
```

### Network Health

```tsx
function NetworkHealth() {
  const { data: networks } = useQuery(['networks'], fetchNetworkMetrics);
  
  return (
    <div className="grid grid-cols-3 gap-4">
      {networks?.map((network) => (
        <NetworkCard
          key={network.chainId}
          name={network.chainName}
          volume={network.totalVolume}
          payments={network.totalPayments}
          successRate={network.successRate}
          avgSettlement={network.averageConfirmationTime}
          status={getNetworkStatus(network)}
        />
      ))}
    </div>
  );
}
```

### Payments Table

```tsx
function PaymentsTable() {
  const { data, isLoading } = useQuery(['payments'], fetchRecentPayments);
  
  return (
    <table className="min-w-full divide-y divide-gray-200">
      <thead>
        <tr>
          <th>Payment ID</th>
          <th>From</th>
          <th>To</th>
          <th>Amount</th>
          <th>Network</th>
          <th>Status</th>
          <th>Time</th>
        </tr>
      </thead>
      <tbody>
        {data?.map((payment) => (
          <tr key={payment.paymentId}>
            <td className="font-mono text-sm">
              {truncate(payment.paymentId, 8)}
            </td>
            <td>
              <AddressLink address={payment.payer} />
            </td>
            <td>
              <AddressLink address={payment.payee} />
            </td>
            <td>{formatCurrency(payment.amount)}</td>
            <td>
              <NetworkBadge network={payment.network} />
            </td>
            <td>
              <StatusBadge status={payment.status} />
            </td>
            <td>{formatRelativeTime(payment.settledAt)}</td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}
```

## WebSocket Hook

```tsx
function useWebSocket(url: string, options: WebSocketOptions) {
  const [isConnected, setIsConnected] = useState(false);
  const wsRef = useRef<WebSocket | null>(null);
  
  useEffect(() => {
    const ws = new WebSocket(url);
    
    ws.onopen = () => {
      setIsConnected(true);
      ws.send(JSON.stringify({
        type: 'subscribe',
        channels: options.channels,
      }));
    };
    
    ws.onmessage = (event) => {
      const data = JSON.parse(event.data);
      options.onMessage?.(data);
    };
    
    ws.onclose = () => setIsConnected(false);
    
    wsRef.current = ws;
    
    return () => ws.close();
  }, [url]);
  
  return { isConnected, ws: wsRef.current };
}
```

## Build & Deploy

```json
{
  "scripts": {
    "dev": "vite",
    "build": "vite build",
    "preview": "vite preview"
  }
}
```

Deploy to:
- Vercel (recommended)
- Cloudflare Pages
- Self-hosted with nginx

## Testing Requirements
- Component unit tests
- Chart rendering tests
- WebSocket connection handling
- Responsive design tests

## Completion Criteria
- [ ] Dashboard renders all metrics
- [ ] Real-time updates work
- [ ] Charts are interactive
- [ ] Responsive on mobile
- [ ] Dark mode support

## After Completion
Move to: Agent 4 Phase 3 - Public Analytics API (GraphQL)
```

---

## Agent 5 Phase 2: Documentation Site

```
# 📚 Agent 5 Phase 2: Documentation Site

## Context
You completed the Deployment infrastructure. Now build a proper
documentation website for the entire project.

## Mission
Create a Docusaurus-based documentation site with API references,
tutorials, and guides.

## Tech Stack
- Docusaurus 3
- MDX for interactive docs
- OpenAPI/Swagger for API docs
- Algolia for search
- Vercel for hosting

## Site Structure

```
docs/
├── docusaurus.config.js
├── sidebars.js
├── src/
│   ├── pages/
│   │   └── index.tsx        # Landing page
│   ├── components/
│   │   ├── HomepageFeatures.tsx
│   │   ├── CodeExample.tsx
│   │   └── NetworkBadge.tsx
│   └── css/
│       └── custom.css
├── docs/
│   ├── intro.md
│   ├── getting-started/
│   │   ├── installation.md
│   │   ├── quick-start.md
│   │   └── configuration.md
│   ├── facilitator/
│   │   ├── overview.md
│   │   ├── api-reference.md
│   │   ├── deployment.md
│   │   └── monitoring.md
│   ├── marketplace/
│   │   ├── overview.md
│   │   ├── registering-services.md
│   │   ├── subscriptions.md
│   │   └── reputation.md
│   ├── payments/
│   │   ├── x402-protocol.md
│   │   ├── supported-networks.md
│   │   └── fee-structure.md
│   ├── agent-wallet/
│   │   ├── overview.md
│   │   ├── creating-wallets.md
│   │   ├── spending-policies.md
│   │   └── mcp-integration.md
│   ├── credits/
│   │   ├── overview.md
│   │   ├── purchasing.md
│   │   └── auto-topup.md
│   ├── tutorials/
│   │   ├── build-paid-api.md
│   │   ├── integrate-marketplace.md
│   │   └── setup-agent-wallet.md
│   └── api/
│       ├── facilitator.md
│       ├── marketplace.md
│       └── wallets.md
├── static/
│   ├── img/
│   └── openapi/
│       └── facilitator.yaml
└── blog/
    └── 2026-01-31-launch.md
```

## Landing Page

```tsx
// src/pages/index.tsx
export default function Home() {
  return (
    <Layout>
      <Hero
        title="Universal Crypto MCP"
        subtitle="The largest MCP server for crypto tools"
        cta={{ text: "Get Started", link: "/docs/intro" }}
      />
      
      <Features
        items={[
          {
            title: "150+ Tools",
            description: "DeFi, NFTs, payments, and more",
            icon: <ToolsIcon />,
          },
          {
            title: "x402 Payments",
            description: "Built-in payment rails for AI agents",
            icon: <PaymentIcon />,
          },
          {
            title: "Multi-Chain",
            description: "Ethereum, Base, Arbitrum, Solana",
            icon: <ChainIcon />,
          },
        ]}
      />
      
      <CodeShowcase />
      
      <NetworkLogos />
      
      <CTA
        title="Start Building"
        description="Get your AI agent paying for services in minutes"
        button={{ text: "Read the Docs", link: "/docs/getting-started" }}
      />
    </Layout>
  );
}
```

## API Documentation

Use Docusaurus OpenAPI plugin:

```yaml
# static/openapi/facilitator.yaml
openapi: 3.0.3
info:
  title: x402 Facilitator API
  version: 1.0.0
  description: Payment processing for x402 protocol

paths:
  /v1/verify:
    post:
      summary: Verify a payment proof
      requestBody:
        required: true
        content:
          application/json:
            schema:
              $ref: '#/components/schemas/VerifyRequest'
      responses:
        '200':
          description: Payment verified
          content:
            application/json:
              schema:
                $ref: '#/components/schemas/VerifyResponse'
```

## Interactive Examples

```mdx
// docs/tutorials/build-paid-api.md
import CodeBlock from '@theme/CodeBlock';
import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';

# Build a Paid API

<Tabs>
  <TabItem value="ts" label="TypeScript">
    <CodeBlock language="typescript">
{`import { paymentMiddleware } from '@x402/express';

app.use(paymentMiddleware({
  "GET /api/data": {
    price: "$0.001",
    network: "eip155:8453",
    payTo: "0x...",
  },
}));`}
    </CodeBlock>
  </TabItem>
  <TabItem value="py" label="Python">
    <CodeBlock language="python">
{`from x402 import payment_required

@payment_required(price="$0.001", network="base")
def get_data():
    return {"data": "premium content"}`}
    </CodeBlock>
  </TabItem>
</Tabs>

## Try It Live

<APIPlayground
  endpoint="/v1/verify"
  method="POST"
  body={{
    proof: { /* ... */ },
    requirements: { /* ... */ },
  }}
/>
```

## Search Integration

```js
// docusaurus.config.js
module.exports = {
  themeConfig: {
    algolia: {
      appId: 'YOUR_APP_ID',
      apiKey: 'YOUR_SEARCH_API_KEY',
      indexName: 'universal-crypto-mcp',
    },
  },
};
```

## Versioning

Support multiple versions:
```
docs/
├── versioned_docs/
│   ├── version-1.0/
│   └── version-2.0/
└── versions.json
```

## Deployment

```yaml
# .github/workflows/docs.yml
name: Deploy Docs

on:
  push:
    branches: [main]
    paths:
      - 'docs/**'

jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
      - run: cd docs && npm install && npm run build
      - uses: peaceiris/actions-gh-pages@v3
        with:
          github_token: ${{ secrets.GITHUB_TOKEN }}
          publish_dir: ./docs/build
```

## SEO Optimization

```js
// docusaurus.config.js
module.exports = {
  title: 'Universal Crypto MCP',
  tagline: 'The largest MCP server for crypto tools',
  url: 'https://docs.nirholas.com',
  
  head: [
    ['meta', { name: 'twitter:card', content: 'summary_large_image' }],
    ['meta', { property: 'og:image', content: '/img/og-image.png' }],
  ],
};
```

## Completion Criteria
- [ ] All major features documented
- [ ] API reference generated
- [ ] Search works
- [ ] Mobile responsive
- [ ] Deployed to production

## After Completion
Move to: Agent 5 Phase 3 - Video Tutorials & Demos
```

---

# 🔄 Continuous Improvement Cycle

After all agents complete Phase 2, regroup and assign Phase 3:

| Agent | Phase 3 Project |
|-------|-----------------|
| Agent 1 | Tiered Platform Fees |
| Agent 2 | Subscription Bridge |
| Agent 3 | Multi-Tenant API Gateway |
| Agent 4 | Public Analytics GraphQL API |
| Agent 5 | Video Tutorials & Demos |

Then Phase 4, 5, etc. until all revenue streams are implemented.
