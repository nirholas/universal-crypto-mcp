# Payments Package

The payments package provides payment infrastructure for AI agents using the x402 protocol.

## Installation

```bash
npm install @universal-crypto-mcp/payments-x402
```

## What is x402?

x402 implements HTTP 402 Payment Required, enabling AI agents to:

- **Pay for APIs** automatically with crypto
- **Receive payments** for their own services
- **Trade peer-to-peer** with other agents
- **Earn yield** on idle funds (~5% APY with USDs)

## Configuration

### Environment Variables

```bash
# Required
X402_PRIVATE_KEY=0x...  # EVM private key

# Optional
X402_CHAIN=arbitrum     # Default chain (arbitrum, base, ethereum, polygon)
X402_MAX_AMOUNT=1.0     # Maximum payment amount per request
X402_AUTO_PAY=false     # Enable automatic payments
```

## Available Tools

### Payment Tools

| Tool | Description |
|------|-------------|
| `x402_pay_request` | Make HTTP request with 402 payment |
| `x402_send` | Send direct payment |
| `x402_batch_send` | Send multiple payments |
| `x402_gasless_send` | Send without paying gas |
| `x402_estimate` | Estimate payment cost |

### Balance Tools

| Tool | Description |
|------|-------------|
| `x402_balance` | Check wallet balance |
| `x402_address` | Get wallet address |
| `x402_networks` | List supported networks |

### Yield Tools

| Tool | Description |
|------|-------------|
| `x402_yield` | Check USDs yield earnings |
| `x402_apy` | Get current APY rate |
| `x402_yield_estimate` | Project future yield |

### Transaction Tools

| Tool | Description |
|------|-------------|
| `x402_tx_status` | Check transaction status |
| `x402_approve` | Approve token spending |
| `x402_config` | View current configuration |

## Usage Examples

### Check Balance

```typescript
// AI command: "What's my x402 balance?"
// Tool called: x402_balance
// Response:
{
  address: "0x1234...5678",
  chain: "arbitrum",
  balances: {
    native: {
      symbol: "ETH",
      balance: "0.5",
      valueUsd: 1728.39
    },
    usdc: {
      symbol: "USDC",
      balance: "500.00",
      valueUsd: 500.00
    },
    usds: {
      symbol: "USDs",
      balance: "1000.00",
      valueUsd: 1000.00,
      pendingYield: "0.42"
    }
  },
  totalValueUsd: 3228.39
}
```

### Pay for API Access

```typescript
// AI command: "Get premium weather data for Tokyo"
// Tool called: x402_pay_request
// Parameters:
{
  url: "https://api.weatherpremium.com/v1/forecast/tokyo",
  method: "GET"
}

// Response:
{
  status: 200,
  paymentMade: true,
  paymentAmount: "$0.01",
  data: {
    city: "Tokyo",
    forecast: [
      { day: "Monday", temp: 22, condition: "Sunny" },
      { day: "Tuesday", temp: 20, condition: "Cloudy" },
      // ...
    ]
  }
}
```

### Send Payment

```typescript
// AI command: "Send $5 to 0xabc..."
// Tool called: x402_send
// Parameters:
{
  to: "0xabc...",
  amount: "5.00",
  currency: "USDC"
}

// Response:
{
  hash: "0xdef...",
  status: "confirmed",
  from: "0x1234...5678",
  to: "0xabc...",
  amount: "5.00 USDC",
  gasCost: "$0.01"
}
```

### Batch Payments

```typescript
// AI command: "Pay $10 each to Alice, Bob, and Charlie"
// Tool called: x402_batch_send
// Parameters:
{
  payments: [
    { to: "0xalice...", amount: "10.00" },
    { to: "0xbob...", amount: "10.00" },
    { to: "0xcharlie...", amount: "10.00" }
  ],
  currency: "USDC"
}

// Response:
{
  hash: "0xghi...",
  status: "confirmed",
  totalAmount: "30.00 USDC",
  recipients: 3,
  gasCost: "$0.02"  // Cheaper than 3 separate txs
}
```

### Check Yield

```typescript
// AI command: "How much yield have I earned?"
// Tool called: x402_yield
// Response:
{
  balance: "1000.00 USDs",
  accruedYield: "4.23 USDs",
  currentApy: "5.12%",
  projectedAnnual: "51.20 USDs"
}
```

### Estimate Future Yield

```typescript
// AI command: "How much will I earn on $10,000 in a year?"
// Tool called: x402_yield_estimate
// Parameters:
{
  amount: "10000",
  period: "1y"
}

// Response:
{
  principal: "10000.00 USDs",
  projectedYield: "512.00 USDs",
  apy: "5.12%",
  finalBalance: "10512.00 USDs"
}
```

## x402 Protocol Flow

```
┌─────────────────────────────────────────────────────────────┐
│                    x402 Payment Flow                         │
├─────────────────────────────────────────────────────────────┤
│                                                              │
│  1. AI Agent makes request to paid API                       │
│     GET https://api.example.com/premium-data                 │
│                                                              │
│  2. Server responds with 402 Payment Required                │
│     {                                                        │
│       "x402Version": 2,                                      │
│       "accepts": [{                                          │
│         "scheme": "exact",                                   │
│         "network": "eip155:42161",                           │
│         "maxAmountRequired": "10000",                        │
│         "payTo": "0x...",                                    │
│         "asset": "0x..."                                     │
│       }]                                                     │
│     }                                                        │
│                                                              │
│  3. Agent wallet signs payment                               │
│                                                              │
│  4. Agent retries request with X-PAYMENT header              │
│     X-PAYMENT: <signed payment data>                         │
│                                                              │
│  5. Server verifies payment and returns data                 │
│     HTTP 200 OK                                              │
│     { "premium": "data" }                                    │
│                                                              │
└─────────────────────────────────────────────────────────────┘
```

## Supported Networks

| Network | Chain ID | USDC Address | Status |
|---------|----------|--------------|--------|
| Arbitrum One | 42161 | 0xaf88... | ✅ Primary |
| Base | 8453 | 0x833... | ✅ Supported |
| Ethereum | 1 | 0xA0b8... | ✅ Supported |
| Polygon | 137 | 0x2791... | ✅ Supported |
| Optimism | 10 | 0x7F5c... | ✅ Supported |

## Security Features

### Spending Limits

```typescript
// Set maximum payment per request
X402_MAX_AMOUNT=1.0  // Max $1 per request
```

### Manual Approval Mode

```typescript
// Disable auto-pay for manual approval
X402_AUTO_PAY=false

// Agent will ask for confirmation before paying
"This API costs $0.01. Do you want to proceed? (yes/no)"
```

### Trusted Domains

Configure trusted domains that can receive payments:

```json
{
  "x402": {
    "trustedDomains": [
      "api.openai.com",
      "api.anthropic.com",
      "api.coingecko.com"
    ]
  }
}
```

## Creating Paid APIs

See [x402-deploy](../x402-deploy/overview.md) for creating your own paid APIs.

## Related Packages

- [x402-deploy](../x402-deploy/overview.md) - Deploy paid APIs
- [Wallets Package](wallets.md) - Wallet management
- [Core Package](core.md) - Shared utilities
