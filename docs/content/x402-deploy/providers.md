# x402 Payment Providers

x402-deploy supports multiple payment networks and assets.

## Supported Networks

### EVM Networks

| Network | Chain ID | Identifier | USDC Address |
|---------|----------|------------|--------------|
| Arbitrum One | 42161 | `eip155:42161` | `0xaf88d065e77c8cC2239327C5EDb3A432268e5831` |
| Base | 8453 | `eip155:8453` | `0x833589fCD6eDb6E08f4c7C32D4f71b54bdA02913` |
| Ethereum | 1 | `eip155:1` | `0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48` |
| Polygon | 137 | `eip155:137` | `0x2791Bca1f2de4661ED88A30C99A7a9449Aa84174` |
| Optimism | 10 | `eip155:10` | `0x7F5c764cBc14f9669B88837ca1490cCa17c31607` |

### Recommended Network

**Arbitrum One** is recommended for:
- Low gas fees (~$0.01-0.05)
- Fast finality (~1 second)
- Wide adoption
- USDs availability (auto-yield)

## Supported Assets

### USDC (USD Coin)

The primary payment asset:

```json
{
  "payment": {
    "network": "eip155:42161",
    "assets": ["USDC"]
  }
}
```

### USDs (Sperax USD)

Auto-yield stablecoin (~5% APY):

```json
{
  "payment": {
    "network": "eip155:42161",
    "assets": ["USDs"]
  }
}
```

### Multiple Assets

Accept multiple assets:

```json
{
  "payment": {
    "network": "eip155:42161",
    "assets": ["USDC", "USDs"]
  }
}
```

## Payment Facilitator

The payment facilitator validates and settles payments.

### Public Facilitator

Use the public facilitator (default):

```json
{
  "payment": {
    "facilitator": "https://facilitator.x402.org"
  }
}
```

### Self-Hosted Facilitator

Run your own facilitator:

```bash
npx @nirholas/x402-deploy facilitator
```

Configure:

```json
{
  "payment": {
    "facilitator": "https://your-facilitator.com"
  }
}
```

## Payment Flow

```
┌─────────────────────────────────────────────────────────────┐
│                    Payment Flow                              │
├─────────────────────────────────────────────────────────────┤
│                                                              │
│  ┌──────────┐         ┌──────────┐         ┌──────────┐     │
│  │  Client  │────1───►│  Server  │         │Facilitator│    │
│  │ (Agent)  │         │(Your API)│         │           │    │
│  └──────────┘         └──────────┘         └──────────┘     │
│       │                    │                    │           │
│       │                    │                    │           │
│       │◄───────2──────────┤  402 + Accept Headers          │
│       │                    │                    │           │
│       │                    │                    │           │
│       │                    │                    │           │
│       ├────────────────────┼────────3──────────►│           │
│       │                    │         Create Payment          │
│       │                    │                    │           │
│       │◄───────────────────┼────────4──────────┤           │
│       │                    │         Signed Payment          │
│       │                    │                    │           │
│       │                    │                    │           │
│       ├─────────5─────────►│                    │           │
│       │   Retry + X-PAYMENT header              │           │
│       │                    │                    │           │
│       │                    ├────────6──────────►│           │
│       │                    │         Verify Payment          │
│       │                    │                    │           │
│       │                    │◄───────7──────────┤           │
│       │                    │         Valid ✓                │
│       │                    │                    │           │
│       │◄───────8──────────┤                    │           │
│       │    200 OK + Data   │                    │           │
│       │                    │                    │           │
└─────────────────────────────────────────────────────────────┘
```

### Steps:

1. Client makes initial request
2. Server returns 402 with payment requirements
3. Client creates payment with facilitator
4. Facilitator returns signed payment
5. Client retries with X-PAYMENT header
6. Server verifies payment with facilitator
7. Facilitator confirms validity
8. Server returns data

## 402 Response Format

When payment is required, your API returns:

```json
{
  "x402Version": 2,
  "accepts": [
    {
      "scheme": "exact",
      "network": "eip155:42161",
      "maxAmountRequired": "10000",
      "resource": "/api/price/BTC",
      "description": "Get BTC price",
      "mimeType": "application/json",
      "payTo": "0x...",
      "asset": "0xaf88d065e77c8cC2239327C5EDb3A432268e5831",
      "extra": {
        "name": "USDC",
        "version": "2"
      }
    }
  ],
  "error": null
}
```

### Fields:

| Field | Description |
|-------|-------------|
| `x402Version` | Protocol version (currently 2) |
| `scheme` | Payment scheme (`exact`) |
| `network` | Network identifier |
| `maxAmountRequired` | Amount in smallest units |
| `payTo` | Recipient address |
| `asset` | Token contract address |

## X-PAYMENT Header

Client includes payment in retry:

```
X-PAYMENT: eyJhbGciOiJFUzI1NiIsInR5cCI6IkpXVCJ9...
```

The header contains:
- Payment signature
- Amount
- Recipient
- Nonce
- Expiry

## Settlement

### Instant Settlement

Payments settle instantly on-chain:

1. Facilitator verifies signature
2. Funds transfer atomically
3. Server receives payment

### Gas Sponsorship

For micropayments, the facilitator can sponsor gas:

```json
{
  "payment": {
    "gasless": true
  }
}
```

## Multi-Network Support

Accept payments on multiple networks:

```json
{
  "payment": {
    "networks": [
      {
        "network": "eip155:42161",
        "wallet": "0xArbitrumWallet..."
      },
      {
        "network": "eip155:8453",
        "wallet": "0xBaseWallet..."
      }
    ]
  }
}
```

## Webhooks

Receive payment notifications:

```json
{
  "payment": {
    "webhooks": {
      "onPayment": "https://your-api.com/webhooks/payment"
    }
  }
}
```

Webhook payload:

```json
{
  "event": "payment.received",
  "payment": {
    "id": "pay_abc123",
    "amount": "10000",
    "asset": "USDC",
    "from": "0x...",
    "to": "0x...",
    "txHash": "0x...",
    "timestamp": "2024-01-15T12:00:00Z"
  }
}
```

## Testing

### Testnet Configuration

```json
{
  "payment": {
    "network": "eip155:421614",
    "wallet": "0xTestWallet...",
    "testnet": true
  }
}
```

### Testnet Faucets

| Network | Faucet |
|---------|--------|
| Arbitrum Sepolia | https://faucet.arbitrum.io |
| Base Sepolia | https://www.coinbase.com/faucets/base-sepolia-faucet |

## Next Steps

- [Discovery](discovery.md) - AI agent discovery network
- [Quick Start](quick-start.md) - Get started
