# X402 Payment Facilitator Server

**Multi-chain payment facilitator with 0.1% fee collection** for the X402 protocol. Supports Arbitrum, Base, Optimism, and Polygon with built-in revenue tracking and Prometheus metrics.

## 🚀 Features

### Core Payment Features
- ✅ **Payment Verification** - Verify on-chain token transfers across multiple chains
- 💸 **Gasless Settlements** - Execute EIP-3009 `transferWithAuthorization` for USDs
- 💰 **Quote Generation** - Return HTTP 402 Payment Required with pricing
- 🌐 **Multi-Chain Support** - Arbitrum, Base, Optimism, Polygon (production + testnets)

### Revenue & Analytics
- 💵 **Automated Fee Collection** - 0.1% platform fee on all payments (volume-based tiers)
- 📊 **Prometheus Metrics** - Real-time payment volume, fees, success rates
- 📈 **Fee Tier System** - Lower fees for high-volume users (0.04%-0.10%)
- 🎯 **Revenue Tracking** - Detailed fee records with settlement status

### Infrastructure
- ⚡ **Rate Limiting** - Configurable per-endpoint rate limits
- 🔒 **Security** - Helmet, CORS, and production hardening
- 📊 **Logging** - Structured JSON logging with Winston
- 💾 **Caching** - LRU cache with TTL for payment status
- 🐳 **Docker** - Production-ready containerization with docker-compose
- 📉 **Grafana** - Pre-configured dashboards for monitoring

## 💰 Fee Structure

| Tier | Monthly Volume | Fee Rate | Savings |
|------|---------------|----------|---------|
| Standard | < $10,000 | 0.10% | - |
| Silver | $10,000 - $100,000 | 0.08% | 20% |
| Gold | $100,000 - $1,000,000 | 0.06% | 40% |
| Platinum | > $1,000,000 | 0.04% | 60% |

*Minimum fee: $0.001 per transaction*

## 🌐 Supported Networks

### Production
- **Arbitrum One** (`eip155:42161`) - USDC, USDT, DAI, USDs
- **Base** (`eip155:8453`) - USDC, DAI
- **Optimism** (`eip155:10`) - USDC, USDT, DAI
- **Polygon** (`eip155:137`) - USDC, USDT, DAI

### Testnets
- **Arbitrum Sepolia** (`eip155:421614`)
- **Base Sepolia** (`eip155:84532`)
- **Optimism Sepolia** (`eip155:11155420`)

## Quick Start

### Prerequisites

- Node.js 18+
- pnpm (recommended) or npm
- (Optional) Private key for settlement execution
- (Optional) Docker & Docker Compose

### Installation

```bash
cd facilitator

# Install dependencies
pnpm install

# Copy environment configuration
cp .env.example .env

# Edit .env with your configuration
nano .env
```

### Configuration

Key environment variables:

```bash
# Networks (comma-separated CAIP-2 IDs)
ENABLED_NETWORKS=eip155:42161,eip155:8453,eip155:10

# Wallet (for gasless settlements)
PRIVATE_KEY=0x...

# Fee recipient (where 0.1% fees are sent)
FEE_RECIPIENT=0x742d35Cc6634C0532925a3b844Bc9e7595f0bEb0

# RPC endpoints (optional - uses public defaults)
ARBITRUM_RPC_URL=https://arb1.arbitrum.io/rpc
BASE_RPC_URL=https://mainnet.base.org
```

### Development

```bash
# Run in development mode with hot reload
pnpm run dev
```

### Production

```bash
# Build TypeScript
pnpm run build

# Start production server
pnpm start
```

### Docker Deployment

```bash
# Start all services (facilitator + Prometheus + Grafana)
docker-compose up -d

# View logs
docker-compose logs -f facilitator

# Access services
# - Facilitator: http://localhost:3002
# - Prometheus: http://localhost:9090
# - Grafana: http://localhost:3000
```

## API Endpoints

### Payment Operations

### POST /verify

Verify an on-chain payment transaction.

**Request:**
```json
{
  "txHash": "0x...",
  "paymentRequest": {
    "price": "0.001",
    "token": "USDs",
    "chain": "arbitrum",
    "recipient": "0x..."
  }
}
```

**Response:**
```json
{
  "verified": true,
  "txHash": "0x...",
  "timestamp": 1705000000000,
  "blockNumber": 12345678,
  "confirmations": 5
}
```

### POST /settle

Execute a gasless EIP-3009 settlement for USDs.

**Request:**
```json
{
  "authorization": {
    "from": "0x...",
    "to": "0x...",
    "value": "1000000000000000000",
    "validAfter": 1705000000,
    "validBefore": 1705000300,
    "nonce": "0x...",
    "v": 27,
    "r": "0x...",
    "s": "0x..."
  },
  "paymentRequest": {
    "price": "1.0",
    "token": "USDs",
    "chain": "arbitrum",
    "recipient": "0x..."
  }
}
```

**Response:**
```json
{
  "success": true,
  "txHash": "0x...",
  "timestamp": 1705000000000,
  "gasUsed": "50000",
  "effectiveGasPrice": "1000000000"
}
```

### POST /quote

Generate a payment quote (returns HTTP 402).

**Request:**
```json
{
  "service": "gpt-4",
  "params": {
    "maxTokens": 2000
  }
}
```

**Response (HTTP 402):**
```json
{
  "price": "0.002",
  "token": "USDs",
  "chain": "arbitrum",
  "recipient": "0x...",
  "deadline": 1705000300,
  "description": "gpt-4 API call",
  "facilitatorUrl": "http://localhost:3002",
  "x402Version": 1
}
```

### GET /payments/:txHash

Get payment status by transaction hash.

**Response:**
```json
{
  "txHash": "0x...",
  "verified": true,
  "settled": true,
  "amount": "1.0",
  "token": "USDs",
  "timestamp": 1705000000000,
  "blockNumber": 12345678,
  "age": 60000,
  "cached": true
}
```

### GET /health

Health check endpoint.

**Response:**
```json
{
  "status": "healthy",
  "uptime": 3600,
  "version": "1.1.0",
  "network": "arbitrum",
  "paymentsProcessed": 100,
  "cacheSize": 50,
  "blockNumber": 12345678,
  "timestamp": 1705000000000
}
```

### Fee Management

### GET /fees/stats

Get overall fee statistics and revenue metrics.

**Response:**
```json
{
  "success": true,
  "data": {
    "totalFeesCollected": "125.50",
    "totalVolumeProcessed": "125500.00",
    "feeRecordCount": 1523,
    "unsettledCount": 42,
    "averageFeePercent": 0.0875,
    "volumeByNetwork": {
      "eip155:42161": "75000.00",
      "eip155:8453": "50500.00"
    },
    "volumeByToken": {
      "USDC": "100000.00",
      "USDs": "25500.00"
    }
  }
}
```

### GET /fees/tier/:address

Get fee tier information for a payer address.

**Response:**
```json
{
  "success": true,
  "data": {
    "address": "0x...",
    "currentTier": "silver",
    "feePercent": 0.08,
    "monthlyVolume": "15000.00",
    "nextTier": "gold",
    "volumeToNextTier": "85000.00",
    "nextTierFeePercent": 0.06
  }
}
```

### GET /fees/recent?limit=100

Get recent fee records.

**Response:**
```json
{
  "success": true,
  "data": [
    {
      "id": "fee_1705...",
      "paymentId": "0x...",
      "payer": "0x...",
      "payee": "0x...",
      "grossAmount": "100.00",
      "feeAmount": "0.08",
      "netAmount": "99.92",
      "feePercent": 0.08,
      "network": "eip155:42161",
      "token": "USDC",
      "timestamp": 1705000000000,
      "settled": false
    }
  ],
  "count": 100
}
```

### GET /metrics

Prometheus metrics endpoint for monitoring.

**Response:** Prometheus text format with metrics:
- `facilitator_payment_verify_total` - Total verifications
- `facilitator_payment_settle_total` - Total settlements
- `facilitator_payment_volume_total` - Payment volume in USD
- `facilitator_fees_collected_total` - Fees collected in USD
- `facilitator_verify_duration_seconds` - Verification latency
- `facilitator_settle_duration_seconds` - Settlement latency
- `facilitator_errors_total` - Error counts

### GET /networks

Get information about enabled networks.

**Response:**
```json
{
  "success": true,
  "data": [
    {
      "id": "eip155:42161",
      "name": "arbitrum",
      "displayName": "Arbitrum One",
      "isTestnet": false,
      "tokens": ["USDC", "USDT", "DAI", "USDs"]
    },
    {
      "id": "eip155:8453",
      "name": "base",
      "displayName": "Base",
      "isTestnet": false,
      "tokens": ["USDC", "DAI"]
    }
  ]
}
```

## Configuration

| Variable | Description | Default |
|----------|-------------|---------|
| `PORT` | Server port | `3002` |
| `HOST` | Server host | `0.0.0.0` |
| `ENABLED_NETWORKS` | Comma-separated CAIP-2 network IDs | `eip155:42161,eip155:8453,eip155:10` |
| `NETWORK` | Legacy network name | `arbitrum` |
| `RPC_URL` | RPC endpoint URL (legacy) | Public RPC |
| `ARBITRUM_RPC_URL` | Arbitrum RPC override | `https://arb1.arbitrum.io/rpc` |
| `BASE_RPC_URL` | Base RPC override | `https://mainnet.base.org` |
| `OPTIMISM_RPC_URL` | Optimism RPC override | `https://mainnet.optimism.io` |
| `PRIVATE_KEY` | Wallet private key for settlements | - |
| `RECIPIENT_ADDRESS` | Default payment recipient | - |
| `FEE_RECIPIENT` | Platform fee recipient (0.1%) | Same as `RECIPIENT_ADDRESS` |
| `CORS_ORIGINS` | Allowed CORS origins | `*` |
| `RATE_LIMIT_WINDOW_MS` | Rate limit window | `60000` |
| `RATE_LIMIT_MAX_REQUESTS` | Max requests per window | `100` |
| `PAYMENT_CACHE_TTL_MS` | Cache TTL | `86400000` |
| `LOG_LEVEL` | Winston log level | `info` |

## USDs Token Details

**Sperax USD ($USDs)** is an auto-yield stablecoin on Arbitrum.

- **Address:** `0xD74f5255D557944cf7Dd0E45FF521520002D5748`
- **Decimals:** 18
- **Features:**
  - Auto-rebasing yield
  - EIP-3009 `transferWithAuthorization` for gasless transfers
  - EIP-2612 `permit` for gasless approvals

## Architecture

```
facilitator/
├── src/
│   ├── server.ts           # Main Express server
│   ├── types.ts            # TypeScript types
│   ├── routes/
│   │   ├── verify.ts       # Payment verification
│   │   ├── settle.ts       # Gasless settlement
│   │   ├── quote.ts        # Quote generation
│   │   └── payments.ts     # Payment status
│   ├── services/
│   │   ├── arbitrum.ts     # Blockchain client
│   │   ├── usds.ts         # USDs contract interactions
│   │   └── cache.ts        # Payment caching
│   └── middleware/
│       ├── logger.ts       # Request logging
│       └── rateLimit.ts    # Rate limiting
├── package.json
├── tsconfig.json
├── Dockerfile
└── .env.example
```

## Security Considerations

1. **Private Key**: Never commit your private key. Use environment variables or secrets management.

2. **Rate Limiting**: Adjust rate limits based on your expected traffic.

3. **CORS**: In production, restrict `CORS_ORIGINS` to your frontend domains.

4. **RPC URL**: Use a private RPC endpoint for production (Alchemy, Infura, etc.).

5. **Read-Only Mode**: If `PRIVATE_KEY` is not set, settlements will fail but verification works.

## License

MIT
