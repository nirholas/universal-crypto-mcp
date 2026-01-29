#  Boosty MCP DeFi Platform

<p align="center">
  <img src="https://img.shields.io/badge/Solana-Production-green?style=for-the-badge&logo=solana" alt="Solana">
  <img src="https://img.shields.io/badge/EVM-Supported-blue?style=for-the-badge&logo=ethereum" alt="EVM">
  <img src="https://img.shields.io/badge/MCP-Compatible-purple?style=for-the-badge" alt="MCP">
  <img src="https://img.shields.io/badge/License-MIT-yellow?style=for-the-badge" alt="License">
</p>

<p align="center">
  <strong>Enterprise-Grade DeFi Infrastructure for Model Context Protocol</strong>
</p>

<p align="center">
  Production-ready MCP server platform for real DeFi operations on Solana and EVM chains.<br>
  Volume generation, trading automation, wallet management, and market making — all accessible via Claude Desktop.
</p>

---

## 📋 Table of Contents

1. [Overview](#-overview)
2. [What is Boosty?](#-what-is-boosty)
3. [Architecture](#-architecture)
4. [Core Features](#-core-features)
5. [Packages](#-packages)
6. [Quick Start](#-quick-start)
7. [Installation](#-installation)
8. [Configuration](#-configuration)
9. [MCP Tools Reference](#-mcp-tools-reference)
10. [Trading Engine](#-trading-engine)
11. [Volume Orchestration](#-volume-orchestration)
12. [Wallet Management](#-wallet-management)
13. [Security](#-security)
14. [Deployment](#-deployment)
15. [API Reference](#-api-reference)
16. [Examples](#-examples)
17. [Troubleshooting](#-troubleshooting)
18. [Contributing](#-contributing)
19. [License](#-license)

---

## 🌟 Overview

Boosty is a **production-grade Model Context Protocol (MCP) server platform** designed for real DeFi operations. Unlike simulation tools, Boosty executes actual transactions on Solana mainnet and EVM chains, providing:

- **Real Trading**: Execute swaps via Jupiter, Raydium, Orca, and PumpFun
- **Volume Generation**: Coordinate thousands of wallets for organic-looking market activity
- **Wallet Management**: HD wallet derivation with military-grade encryption
- **Market Making**: Automated liquidity provision and spread management
- **Price Analytics**: Real-time price feeds, gas prices, and market sentiment

### Why Boosty?

| Feature | Traditional Bots | Boosty MCP |
|---------|-----------------|------------|
| Interface | Telegram/Discord | Claude Desktop (AI-native) |
| Setup | Complex configuration | Natural language commands |
| Flexibility | Fixed commands | Conversational AI |
| Integration | Standalone | Full MCP ecosystem |
| Extensibility | Limited | Plugin architecture |
| Learning Curve | Steep | Intuitive |
| Customization | Code changes required | Voice/text commands |

### Key Differentiators

1. **AI-Native Interface**: No command memorization — just describe what you want
2. **Real Blockchain Operations**: Not a simulator — actual mainnet transactions
3. **Enterprise Architecture**: Built for scale with PostgreSQL, Redis, and Docker
4. **Open Source**: Fully auditable code with MIT license
5. **Multi-Chain**: Solana-first with EVM support (Ethereum, Base, Arbitrum)

---

## 🎯 What is Boosty?

Boosty transforms Claude Desktop into a powerful DeFi control center. Through the Model Context Protocol, you can:

### Natural Language DeFi Operations

```
You: "Buy $500 worth of BONK using Jupiter, split across 3 transactions over the next hour"

Boosty: ✅ Created campaign with 3 scheduled buys
        - Trade 1: $166.67 at 2:00 PM (completed)
        - Trade 2: $166.67 at 2:20 PM (pending)
        - Trade 3: $166.66 at 2:40 PM (pending)
```

### Volume Generation Campaigns

```
You: "Start a volume campaign for my token at address Abc123... 
      Generate $50k daily volume with organic patterns, 
      use 200 wallets, vary transaction sizes between $50-500"

Boosty: 📊 Volume Campaign Started
        - Token: ABC/SOL
        - Daily Target: $50,000
        - Active Wallets: 200
        - Pattern: Organic (gaussian distribution)
        - Duration: 7 days
        - Estimated Cost: 2.3 SOL (fees + rent)
```

### Portfolio Management

```
You: "Show me all my positions across all wallets"

Boosty: 💼 Portfolio Summary (47 wallets)
        Total Value: $234,567.89
        
        Top Holdings:
        - SOL: $89,234 (38.0%)
        - USDC: $45,678 (19.5%)
        - BONK: $23,456 (10.0%)
        
        DeFi Positions:
        - Raydium USDC/SOL LP: $34,567
        - Marinade stSOL: $12,345
```

---

## 🏗️ Architecture

Boosty follows a modular monorepo architecture designed for enterprise scalability:

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                              CLAUDE DESKTOP                                  │
│                         (Model Context Protocol)                             │
└─────────────────────────────────────────────────────────────────────────────┘
                                     │
                                     ▼
┌─────────────────────────────────────────────────────────────────────────────┐
│                            @boosty/mcp-server                                │
│  ┌──────────────┐ ┌──────────────┐ ┌──────────────┐ ┌──────────────────┐   │
│  │  Resources   │ │    Tools     │ │   Prompts    │ │  Subscriptions   │   │
│  └──────────────┘ └──────────────┘ └──────────────┘ └──────────────────┘   │
└─────────────────────────────────────────────────────────────────────────────┘
                                     │
          ┌──────────────────────────┼──────────────────────────┐
          ▼                          ▼                          ▼
┌──────────────────┐    ┌──────────────────────┐    ┌──────────────────────┐
│ @boosty/prices   │    │ @boosty/orchestrator │    │ @boosty/wallets      │
│                  │    │                      │    │                      │
│ • Token Prices   │    │ • Campaign Manager   │    │ • Portfolio View     │
│ • Gas Prices     │    │ • Task Queue         │    │ • Balance Tracking   │
│ • Market Data    │    │ • Bot Coordinator    │    │ • NFT Holdings       │
│ • Fear/Greed     │    │ • Pattern Generator  │    │ • DeFi Positions     │
└────────┬─────────┘    └──────────┬───────────┘    └──────────┬───────────┘
         │                         │                           │
         ▼                         ▼                           ▼
┌──────────────────┐    ┌──────────────────────┐    ┌──────────────────────┐
│  CoinGecko API   │    │ @boosty/trading      │    │   Alchemy API        │
│  DefiLlama API   │    │                      │    │   DeBank API         │
│  Alternative.me  │    │ • Jupiter V6         │    │   Helius API         │
└──────────────────┘    │ • Raydium V2         │    └──────────────────────┘
                        │ • Orca Whirlpools    │
                        │ • PumpFun            │
                        └──────────┬───────────┘
                                   │
                                   ▼
                        ┌──────────────────────┐
                        │ @boosty/solana-core  │
                        │                      │
                        │ • RPC Connection     │
                        │ • Transaction Build  │
                        │ • Jito Bundles       │
                        │ • Priority Fees      │
                        └──────────┬───────────┘
                                   │
                                   ▼
                        ┌──────────────────────┐
                        │@boosty/wallet-manager│
                        │                      │
                        │ • HD Derivation      │
                        │ • Key Encryption     │
                        │ • Fund Distribution  │
                        └──────────────────────┘
                                   │
          ┌────────────────────────┼────────────────────────┐
          ▼                        ▼                        ▼
┌──────────────────┐    ┌──────────────────┐    ┌──────────────────────┐
│   PostgreSQL     │    │      Redis       │    │   Solana Mainnet     │
│                  │    │                  │    │                      │
│ • Wallets        │    │ • Task Queue     │    │ • Transactions       │
│ • Campaigns      │    │ • Rate Limits    │    │ • Token Accounts     │
│ • Trade History  │    │ • Session Cache  │    │ • Program Calls      │
│ • Positions      │    │ • Pub/Sub        │    │                      │
└──────────────────┘    └──────────────────┘    └──────────────────────┘
```

### Data Flow

1. **User Request** → Claude Desktop sends natural language command
2. **MCP Server** → Parses intent, validates parameters, routes to appropriate service
3. **Orchestrator** → Breaks down complex operations into tasks
4. **Trading Engine** → Builds and optimizes transactions
5. **Solana Core** → Signs, sends, and confirms transactions
6. **Response** → Results returned through MCP to Claude Desktop

---

## ✨ Core Features

### 🔄 Real Trading Execution

Execute actual swaps on Solana DEXs with intelligent routing:

| DEX | Features | Best For |
|-----|----------|----------|
| **Jupiter V6** | Aggregator, limit orders, DCA | Best price discovery |
| **Raydium V2** | AMM, CLMM, concentrated liquidity | High liquidity pairs |
| **Orca Whirlpools** | Concentrated liquidity positions | Capital efficiency |
| **PumpFun** | Bonding curves, new launches | Meme tokens |

**Transaction Features:**
- ✅ Priority fee optimization (auto-detect network congestion)
- ✅ Jito bundle submission (MEV protection)
- ✅ Compute unit estimation
- ✅ Slippage protection
- ✅ Retry with exponential backoff
- ✅ Transaction simulation before send

### 📊 Volume Generation

Create organic-looking market activity for tokens:

**Pattern Types:**
```typescript
enum VolumePattern {
  ORGANIC = 'organic',      // Natural market behavior simulation
  AGGRESSIVE = 'aggressive', // High frequency, visible volume
  STEALTH = 'stealth',      // Below detection thresholds
  CUSTOM = 'custom'         // User-defined parameters
}
```

**Organic Pattern Features:**
- Gaussian distribution for transaction sizes
- Time-weighted randomization (more activity during market hours)
- Wallet age simulation (older wallets used for larger trades)
- Human-like intervals (not perfectly timed)
- Buy/sell ratio management
- Price impact awareness

### 👛 Enterprise Wallet Management

Manage thousands of wallets with military-grade security:

**HD Wallet Derivation:**
```
Master Seed (BIP39)
    └── Purpose (44')
        └── Coin Type (501' for Solana)
            └── Account Index
                └── Change
                    └── Address Index
```

**Security Features:**
- AES-256-GCM encryption at rest
- scrypt key derivation (N=2^20)
- HSM support (optional)
- Multi-sig integration
- Key rotation policies
- Audit logging

### 📈 Price & Market Data

Real-time market intelligence:

| Data Type | Source | Update Frequency |
|-----------|--------|------------------|
| Token Prices | CoinGecko Pro | 10s |
| Gas Prices | RPC + Jito | Per-block |
| Fear & Greed | Alternative.me | 1 hour |
| DeFi TVL | DefiLlama | 5 minutes |
| Pool Data | On-chain | Real-time |

### 🌾 Yield Discovery

Find and compare yield opportunities:

- Top yields by chain/protocol
- Risk-adjusted returns (IL calculation)
- TVL tracking
- APY/APR breakdown
- Stablecoin-specific strategies
- Auto-compound analysis

---

## 📦 Packages

### Current Packages (v1.0)

| Package | Status | Description |
|---------|--------|-------------|
| `@boosty/mcp-shared` | ✅ Production | Core utilities, caching, rate limiting |
| `@boosty/mcp-prices` | ✅ Production | CoinGecko integration, market data |
| `@boosty/mcp-wallets` | ✅ Production | Portfolio analytics, balance tracking |
| `@boosty/mcp-yields` | ✅ Production | DefiLlama yields, pool analysis |
| `@boosty/mcp-defi` | ✅ Production | Combined MCP server |

### New Packages (v2.0 - In Development)

| Package | Status | Description |
|---------|--------|-------------|
| `@boosty/solana-core` | 🚧 Development | Solana RPC, transactions, tokens |
| `@boosty/trading-engine` | 🚧 Development | Jupiter, Raydium, PumpFun |
| `@boosty/wallet-manager` | 🚧 Development | HD wallets, encryption |
| `@boosty/orchestrator` | 🚧 Development | Campaign coordination |
| `@boosty/mcp-server` | 🚧 Development | Full MCP protocol server |

### Package Dependency Graph

```
@boosty/mcp-server
    ├── @boosty/orchestrator
    │   ├── @boosty/trading-engine
    │   │   ├── @boosty/solana-core
    │   │   └── @boosty/mcp-shared
    │   ├── @boosty/wallet-manager
    │   │   ├── @boosty/solana-core
    │   │   └── @boosty/mcp-shared
    │   └── @boosty/mcp-shared
    ├── @boosty/mcp-prices
    │   └── @boosty/mcp-shared
    ├── @boosty/mcp-wallets
    │   └── @boosty/mcp-shared
    └── @boosty/mcp-yields
        └── @boosty/mcp-shared
```

---

## 🚀 Quick Start

### Prerequisites

- **Node.js** >= 20.0.0 (LTS recommended)
- **pnpm** >= 8.0.0 (required for workspace)
- **PostgreSQL** >= 16 (for wallet/campaign storage)
- **Redis** >= 7 (for task queue)
- **Docker** (optional, for containerized deployment)

### 5-Minute Setup

```bash
# 1. Clone the repository
git clone https://github.com/nirholas/boosty-mcp-servers.git
cd boosty-mcp-servers

# 2. Install dependencies
pnpm install

# 3. Set up environment
cp .env.example .env
# Edit .env with your API keys

# 4. Start infrastructure (Docker)
docker-compose up -d postgres redis

# 5. Run database migrations
pnpm db:migrate

# 6. Build all packages
pnpm build

# 7. Start the MCP server
pnpm start
```

### Claude Desktop Configuration

Add to `~/Library/Application Support/Claude/claude_desktop_config.json` (macOS) or `%APPDATA%\Claude\claude_desktop_config.json` (Windows):

```json
{
  "mcpServers": {
    "boosty": {
      "command": "node",
      "args": ["/path/to/boosty-mcp-servers/packages/combined/dist/cli.js"],
      "env": {
        "SOLANA_RPC_URL": "https://api.mainnet-beta.solana.com",
        "ALCHEMY_API_KEY": "your-key-here",
        "COINGECKO_API_KEY": "your-key-here",
        "DATABASE_URL": "postgresql://localhost:5432/boosty",
        "REDIS_URL": "redis://localhost:6379"
      }
    }
  }
}
```

### Verify Installation

In Claude Desktop, try:

```
"What's the current price of SOL?"
"Show me the top 10 yield opportunities on Solana"
"Get gas prices for Ethereum and Arbitrum"
```

---

## 📥 Installation

### From npm (Recommended)

```bash
# Install the combined server globally
npm install -g @boosty/mcp-defi

# Or use individual packages
npm install -g @boosty/mcp-prices
npm install -g @boosty/mcp-wallets
npm install -g @boosty/mcp-yields
```

### From Source

```bash
# Clone with full history
git clone https://github.com/nirholas/boosty-mcp-servers.git
cd boosty-mcp-servers

# Install pnpm if needed
npm install -g pnpm

# Install all dependencies
pnpm install

# Build all packages in correct order
pnpm build

# Link for local development
pnpm link --global
```

### Docker Installation

```bash
# Pull the official image
docker pull boosty/mcp-defi:latest

# Run with environment variables
docker run -d \
  --name boosty-mcp \
  -e SOLANA_RPC_URL=https://api.mainnet-beta.solana.com \
  -e ALCHEMY_API_KEY=your-key \
  -e DATABASE_URL=postgresql://host:5432/boosty \
  -e REDIS_URL=redis://host:6379 \
  boosty/mcp-defi:latest
```

### Development Setup

```bash
# Install in development mode
pnpm install

# Start in watch mode (rebuilds on changes)
pnpm dev

# Run specific package in dev mode
pnpm --filter @boosty/mcp-prices dev
pnpm --filter @boosty/mcp-wallets dev
pnpm --filter @boosty/mcp-yields dev

# Run tests
pnpm test

# Run tests with coverage
pnpm test:coverage

# Type checking
pnpm typecheck

# Linting
pnpm lint
pnpm lint:fix
```

---

## ⚙️ Configuration

### Environment Variables

Create a `.env` file in the project root:

```bash
# ============================================
# BLOCKCHAIN CONFIGURATION
# ============================================

# Solana RPC endpoints (required for trading)
SOLANA_RPC_URL=https://api.mainnet-beta.solana.com
SOLANA_RPC_WS_URL=wss://api.mainnet-beta.solana.com

# Dedicated RPC providers (recommended for production)
HELIUS_API_KEY=your-helius-key
QUICKNODE_ENDPOINT=https://your-endpoint.solana-mainnet.quiknode.pro

# Jito for MEV protection (optional but recommended)
JITO_BLOCK_ENGINE_URL=https://mainnet.block-engine.jito.wtf
JITO_AUTH_KEYPAIR=/path/to/jito-auth-keypair.json

# ============================================
# API KEYS
# ============================================

# CoinGecko (required for price data)
COINGECKO_API_KEY=your-coingecko-key

# Alchemy (required for EVM wallet data)
ALCHEMY_API_KEY=your-alchemy-key

# Block explorers (optional, improves data quality)
ETHERSCAN_API_KEY=your-etherscan-key
ARBISCAN_API_KEY=your-arbiscan-key
BASESCAN_API_KEY=your-basescan-key
SOLSCAN_API_KEY=your-solscan-key

# DeBank (optional, for DeFi positions)
DEBANK_API_KEY=your-debank-key

# ============================================
# DATABASE CONFIGURATION
# ============================================

# PostgreSQL connection
DATABASE_URL=postgresql://user:password@localhost:5432/boosty
DATABASE_POOL_SIZE=20
DATABASE_SSL=false

# Redis connection
REDIS_URL=redis://localhost:6379
REDIS_PASSWORD=
REDIS_DB=0

# ============================================
# SECURITY CONFIGURATION
# ============================================

# Master encryption key (generate with: openssl rand -hex 32)
MASTER_ENCRYPTION_KEY=your-256-bit-hex-key

# JWT secret for API auth (if using HTTP server)
JWT_SECRET=your-jwt-secret

# ============================================
# OPERATIONAL SETTINGS
# ============================================

# Logging
LOG_LEVEL=info  # debug, info, warn, error
LOG_FORMAT=json # json, pretty

# Rate limiting
RATE_LIMIT_REQUESTS_PER_MINUTE=60
RATE_LIMIT_BURST_SIZE=10

# Cache settings
CACHE_TTL_SECONDS=300
CACHE_MAX_SIZE=1000

# ============================================
# TRADING SETTINGS
# ============================================

# Default slippage (in basis points, 100 = 1%)
DEFAULT_SLIPPAGE_BPS=100

# Priority fee settings
PRIORITY_FEE_PERCENTILE=75
MAX_PRIORITY_FEE_LAMPORTS=1000000

# Transaction retry settings
TX_MAX_RETRIES=3
TX_RETRY_DELAY_MS=1000
TX_CONFIRMATION_TIMEOUT_MS=60000
```

### Configuration File

For advanced configuration, create `boosty.config.ts`:

```typescript
import { defineConfig } from '@boosty/mcp-server';

export default defineConfig({
  // Server settings
  server: {
    name: 'boosty-mcp',
    version: '2.0.0',
    transport: 'stdio', // or 'http'
  },

  // Chain configurations
  chains: {
    solana: {
      rpcUrl: process.env.SOLANA_RPC_URL,
      wsUrl: process.env.SOLANA_RPC_WS_URL,
      commitment: 'confirmed',
      priorityFee: {
        percentile: 75,
        maxLamports: 1_000_000,
      },
    },
    ethereum: {
      rpcUrl: process.env.ETHEREUM_RPC_URL,
      chainId: 1,
    },
    arbitrum: {
      rpcUrl: process.env.ARBITRUM_RPC_URL,
      chainId: 42161,
    },
  },

  // DEX configurations
  dexes: {
    jupiter: {
      enabled: true,
      apiUrl: 'https://quote-api.jup.ag/v6',
      maxAccounts: 64,
    },
    raydium: {
      enabled: true,
      ammProgramId: '675kPX9MHTjS2zt1qfr1NYHuzeLXfQM9H24wFSUt1Mp8',
      clmmProgramId: 'CAMMCzo5YL8w4VFF8KVHrK22GGUsp5VTaW7grrKgrWqK',
    },
    orca: {
      enabled: true,
      whirlpoolProgramId: 'whirLbMiicVdio4qvUfM5KAg6Ct8VwpYzGff3uctyCc',
    },
    pumpfun: {
      enabled: true,
      programId: '6EF8rrecthR5Dkzon8Nwu78hRvfCKubJ14M5uBEwF6P',
    },
  },

  // Volume generation defaults
  volume: {
    defaultPattern: 'organic',
    minTransactionSize: 0.01, // SOL
    maxTransactionSize: 10,   // SOL
    defaultInterval: {
      min: 30,  // seconds
      max: 300, // seconds
    },
  },

  // Wallet management
  wallets: {
    derivationPath: "m/44'/501'/0'/0'",
    encryption: {
      algorithm: 'aes-256-gcm',
      keyDerivation: 'scrypt',
      scryptParams: {
        N: 2 ** 20,
        r: 8,
        p: 1,
      },
    },
  },

  // Monitoring
  monitoring: {
    prometheus: {
      enabled: true,
      port: 9090,
    },
    healthCheck: {
      enabled: true,
      port: 8080,
      path: '/health',
    },
  },
});
```

---

## 🔧 MCP Tools Reference

### Price Tools

#### `getTokenPrice`

Get current price and market data for a token.

```typescript
// Input
{
  symbol: string;     // Token symbol (e.g., "SOL", "BTC")
  currency?: string;  // Quote currency (default: "usd")
}

// Output
{
  symbol: string;
  name: string;
  price: number;
  change24h: number;
  marketCap: number;
  volume24h: number;
  circulatingSupply: number;
  totalSupply: number;
  ath: number;
  athDate: string;
  lastUpdated: string;
}
```

#### `getGasPrices`

Get current gas prices for a blockchain.

```typescript
// Input
{
  chain: "ethereum" | "arbitrum" | "base" | "polygon" | "solana";
}

// Output (EVM)
{
  chain: string;
  baseFee: number;
  priorityFee: {
    slow: number;
    standard: number;
    fast: number;
  };
  estimatedCosts: {
    transfer: string;
    swap: string;
  };
}

// Output (Solana)
{
  chain: "solana";
  baseFee: number;        // lamports
  priorityFee: {
    min: number;
    median: number;
    p75: number;
    p90: number;
  };
  recentBlockhash: string;
}
```

#### `getTopMovers`

Get top gaining and losing tokens.

```typescript
// Input
{
  limit?: number;    // Number of results (default: 10)
  sortBy?: "gainers" | "losers" | "volume";
}

// Output
{
  gainers: TokenChange[];
  losers: TokenChange[];
  timestamp: string;
}
```

#### `getFearGreedIndex`

Get the crypto Fear & Greed Index.

```typescript
// Input: none

// Output
{
  value: number;           // 0-100
  classification: string;  // "Extreme Fear" | "Fear" | "Neutral" | "Greed" | "Extreme Greed"
  timestamp: string;
  previousClose: number;
  weekAgo: number;
  monthAgo: number;
}
```

#### `comparePrices`

Compare multiple tokens side by side.

```typescript
// Input
{
  symbols: string[];  // Array of token symbols
}

// Output
{
  tokens: TokenComparison[];
  bestPerformer: string;
  worstPerformer: string;
  timestamp: string;
}
```

### Wallet Tools

#### `getWalletPortfolio`

Get complete portfolio overview.

```typescript
// Input
{
  address: string;
  chain?: string;  // Optional, defaults to all chains
}

// Output
{
  address: string;
  totalValue: number;
  chains: {
    [chain: string]: {
      nativeBalance: number;
      tokenValue: number;
      nftValue: number;
      defiValue: number;
    };
  };
  topHoldings: TokenHolding[];
  lastUpdated: string;
}
```

#### `getTokenBalances`

Get token balances for a wallet.

```typescript
// Input
{
  address: string;
  chain: string;
  includeSpam?: boolean;
}

// Output
{
  address: string;
  chain: string;
  tokens: {
    address: string;
    symbol: string;
    name: string;
    balance: string;
    decimals: number;
    price: number;
    value: number;
    change24h: number;
  }[];
  totalValue: number;
}
```

#### `getDeFiPositions`

Get DeFi protocol positions.

```typescript
// Input
{
  address: string;
}

// Output
{
  address: string;
  totalValue: number;
  positions: {
    protocol: string;
    chain: string;
    type: "lending" | "liquidity" | "staking" | "farming";
    assets: Asset[];
    value: number;
    apy: number;
    rewards: Reward[];
  }[];
}
```

### Yield Tools

#### `getTopYields`

Get highest yield opportunities.

```typescript
// Input
{
  chain?: string;
  minTvl?: number;
  maxApy?: number;
  limit?: number;
  stablecoinOnly?: boolean;
}

// Output
{
  pools: {
    id: string;
    protocol: string;
    chain: string;
    symbol: string;
    tvl: number;
    apy: number;
    apyBase: number;
    apyReward: number;
    ilRisk: "none" | "low" | "medium" | "high";
  }[];
  timestamp: string;
}
```

#### `getRiskAssessment`

Get risk analysis for a pool.

```typescript
// Input
{
  poolId: string;
}

// Output
{
  poolId: string;
  overallRisk: "low" | "medium" | "high" | "critical";
  factors: {
    smartContractRisk: number;  // 1-10
    impermanentLoss: number;
    liquidity: number;
    protocolRisk: number;
    tokenRisk: number;
  };
  recommendations: string[];
  auditStatus: string;
}
```

---

## 💹 Trading Engine

### Jupiter V6 Integration

Jupiter provides the best swap rates through aggregation:

```typescript
import { JupiterClient } from '@boosty/trading-engine';

const jupiter = new JupiterClient({
  apiUrl: 'https://quote-api.jup.ag/v6',
  maxAccounts: 64,
});

// Get quote
const quote = await jupiter.getQuote({
  inputMint: 'So11111111111111111111111111111111111111112', // SOL
  outputMint: 'EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v', // USDC
  amount: 1_000_000_000, // 1 SOL in lamports
  slippageBps: 50,
});

// Execute swap
const result = await jupiter.executeSwap({
  quote,
  userPublicKey: wallet.publicKey,
  priorityFee: 'auto',
});
```

### Raydium Integration

Direct AMM and CLMM access:

```typescript
import { RaydiumClient } from '@boosty/trading-engine';

const raydium = new RaydiumClient({
  connection,
  ammProgramId: '675kPX9MHTjS2zt1qfr1NYHuzeLXfQM9H24wFSUt1Mp8',
});

// Swap on AMM
const tx = await raydium.swap({
  poolId: 'pool-address',
  amountIn: 1_000_000_000,
  minimumAmountOut: 0,
  direction: 'baseToQuote',
});

// Add liquidity
const addLiqTx = await raydium.addLiquidity({
  poolId: 'pool-address',
  baseAmount: 1_000_000_000,
  quoteAmount: 50_000_000,
  slippage: 0.01,
});
```

### PumpFun Bonding Curves

Trade on bonding curve tokens:

```typescript
import { PumpFunClient } from '@boosty/trading-engine';

const pumpfun = new PumpFunClient({
  connection,
  programId: '6EF8rrecthR5Dkzon8Nwu78hRvfCKubJ14M5uBEwF6P',
});

// Buy on bonding curve
const buyTx = await pumpfun.buy({
  tokenMint: 'token-address',
  solAmount: 0.1, // SOL to spend
  slippageBps: 500, // 5% slippage for volatile curves
});

// Sell on bonding curve
const sellTx = await pumpfun.sell({
  tokenMint: 'token-address',
  tokenAmount: 1_000_000,
  minSolOutput: 0.08,
});

// Get bonding curve state
const curve = await pumpfun.getCurveState('token-address');
console.log({
  virtualSolReserves: curve.virtualSolReserves,
  virtualTokenReserves: curve.virtualTokenReserves,
  realSolReserves: curve.realSolReserves,
  realTokenReserves: curve.realTokenReserves,
  tokenTotalSupply: curve.tokenTotalSupply,
  complete: curve.complete,
});
```

### MEV Protection with Jito

Protect transactions from front-running:

```typescript
import { JitoClient } from '@boosty/solana-core';

const jito = new JitoClient({
  blockEngineUrl: 'https://mainnet.block-engine.jito.wtf',
  authKeypair: loadKeypair('/path/to/auth-keypair.json'),
});

// Submit bundle
const bundleId = await jito.sendBundle({
  transactions: [tx1, tx2, tx3],
  tipLamports: 10_000, // Tip to validator
});

// Wait for confirmation
const status = await jito.getBundleStatus(bundleId);
```

---

## 🔄 Volume Orchestration

### Campaign System

Create and manage volume generation campaigns:

```typescript
import { Orchestrator } from '@boosty/orchestrator';

const orchestrator = new Orchestrator({
  database: pgPool,
  redis: redisClient,
  tradingEngine,
  walletManager,
});

// Create campaign
const campaign = await orchestrator.createCampaign({
  name: 'ABC Token Launch',
  type: 'volume_generation',
  token: {
    mint: 'ABC-token-address',
    symbol: 'ABC',
  },
  target: {
    dailyVolume: 50_000, // USD
    duration: 7 * 24 * 60 * 60, // 7 days in seconds
  },
  pattern: {
    type: 'organic',
    buyRatio: 0.52, // Slight buy pressure
    sizeDistribution: {
      min: 50,
      max: 500,
      mean: 150,
      stdDev: 100,
    },
    intervalDistribution: {
      min: 30,
      max: 600,
      mean: 180,
    },
  },
  wallets: {
    count: 200,
    ageRequirement: 7 * 24 * 60 * 60, // 7 days old minimum
    fundingSource: 'treasury',
  },
});

// Start campaign
await orchestrator.startCampaign(campaign.id);

// Monitor progress
const stats = await orchestrator.getCampaignStats(campaign.id);
console.log({
  volumeGenerated: stats.totalVolume,
  transactionsExecuted: stats.transactionCount,
  uniqueWallets: stats.uniqueWallets,
  averageTransactionSize: stats.avgTxSize,
  successRate: stats.successRate,
});
```

### Pattern Types

#### Organic Pattern

Simulates natural market behavior:

```typescript
const organicPattern = {
  type: 'organic',
  
  // Time-based activity weighting
  timeWeights: {
    '00-04': 0.3,  // Low activity late night
    '04-08': 0.5,  // Building up
    '08-12': 1.0,  // Peak morning
    '12-16': 0.9,  // Afternoon
    '16-20': 1.0,  // Peak evening
    '20-24': 0.6,  // Winding down
  },
  
  // Transaction clustering (organic bursts)
  clustering: {
    enabled: true,
    burstProbability: 0.15,
    burstSize: { min: 3, max: 8 },
    burstInterval: { min: 5, max: 30 }, // seconds
  },
  
  // Whale transactions
  whaleTransactions: {
    enabled: true,
    probability: 0.02,
    sizeMultiplier: { min: 5, max: 20 },
  },
};
```

#### Stealth Pattern

Stay below detection thresholds:

```typescript
const stealthPattern = {
  type: 'stealth',
  
  // Keep individual transactions small
  maxTransactionPercent: 0.1, // Max 0.1% of daily volume per tx
  
  // Spread across many wallets
  minWallets: 500,
  maxTransactionsPerWallet: 5,
  
  // Long intervals
  interval: {
    min: 300,  // 5 minutes
    max: 1800, // 30 minutes
  },
  
  // Avoid patterns
  antiPattern: {
    varyTimezone: true,
    varyDayOfWeek: true,
    noRoundNumbers: true,
    randomizeWalletSelection: true,
  },
};
```

### Task Queue System

BullMQ-powered task processing:

```typescript
import { Queue, Worker } from 'bullmq';

// Task types
enum TaskType {
  EXECUTE_TRADE = 'execute_trade',
  FUND_WALLET = 'fund_wallet',
  COLLECT_FUNDS = 'collect_funds',
  CHECK_BALANCE = 'check_balance',
  UPDATE_STATS = 'update_stats',
}

// Create worker
const worker = new Worker('boosty-tasks', async (job) => {
  switch (job.name) {
    case TaskType.EXECUTE_TRADE:
      return await executeTrade(job.data);
    case TaskType.FUND_WALLET:
      return await fundWallet(job.data);
    // ...
  }
}, {
  connection: redis,
  concurrency: 10,
  limiter: {
    max: 100,
    duration: 1000, // 100 jobs per second max
  },
});
```

---

## 👛 Wallet Management

### HD Wallet Derivation

Generate thousands of wallets from a single seed:

```typescript
import { WalletManager } from '@boosty/wallet-manager';

const walletManager = new WalletManager({
  database: pgPool,
  encryptionKey: process.env.MASTER_ENCRYPTION_KEY,
});

// Create wallet group from mnemonic
const group = await walletManager.createWalletGroup({
  name: 'Volume Bot Wallets',
  mnemonic: 'your 24 word mnemonic phrase...',
  count: 1000,
  derivationPath: "m/44'/501'/0'/0'",
});

// Get wallet by index
const wallet = await walletManager.getWallet(group.id, 42);

// Sign transaction
const signature = await walletManager.signTransaction(
  group.id,
  42, // wallet index
  transaction
);
```

### Encryption Architecture

Military-grade key protection:

```typescript
// Key derivation
const derivedKey = await scrypt(
  masterPassword,
  salt,
  {
    N: 2 ** 20,  // CPU/memory cost
    r: 8,        // Block size
    p: 1,        // Parallelization
    dkLen: 32,   // Key length
  }
);

// Encryption
const encrypted = await crypto.subtle.encrypt(
  {
    name: 'AES-GCM',
    iv: randomIV,
    tagLength: 128,
  },
  derivedKey,
  privateKeyBytes
);

// Storage format
{
  version: 1,
  algorithm: 'aes-256-gcm',
  kdf: 'scrypt',
  kdfParams: { N: 1048576, r: 8, p: 1 },
  salt: base64Salt,
  iv: base64IV,
  ciphertext: base64Ciphertext,
  tag: base64Tag,
}
```

### Fund Distribution

Efficiently distribute SOL to worker wallets:

```typescript
// Distribute funds to all campaign wallets
await walletManager.distributeFunds({
  sourceWallet: treasuryWallet,
  targetGroup: campaignGroup.id,
  totalAmount: 100, // SOL
  distribution: 'proportional', // or 'equal'
  
  // Batching for efficiency
  batchSize: 20,
  useVersionedTransactions: true,
  
  // Account for rent
  minRentExempt: 0.002, // SOL
});

// Collect funds back to treasury
await walletManager.collectFunds({
  targetWallet: treasuryWallet,
  sourceGroup: campaignGroup.id,
  leaveMinimum: 0.001, // Leave rent-exempt amount
});
```

---

## � x402 Payments Integration

Boosty supports monetization via the [x402 Protocol](https://x402.org) - an HTTP 402 micropayment standard for pay-per-use APIs.

### Overview

When enabled, certain tool calls require USDC micropayments before execution. This enables:
- **API Monetization**: Charge per tool call
- **Pay-Per-Use Access**: No subscriptions, pay only for what you use
- **Multi-Network Support**: Accept payments on Base, Ethereum, or Solana

### Quick Setup

```bash
# Set your payment receiving address
X402_PAY_TO_ADDRESS=0xYourBaseAddress

# Optional: Choose network (default: base-mainnet)
X402_NETWORK=base-mainnet

# Optional: Custom facilitator
X402_FACILITATOR_URL=https://x402.org/facilitator
```

### Pricing Tiers

| Category | Price | Examples |
|----------|-------|----------|
| **Swaps** | $0.01 | execute_swap, buy_token, sell_token |
| **Wallet Ops** | $0.001 | create_wallet_swarm, distribute_funds |
| **Campaigns** | $0.05-$0.10 | create_volume_campaign, start_campaign |
| **Bots** | $0.02-$0.05 | create_bot, start_bot |
| **Analysis** | $0.005 | analyze_liquidity, get_top_holders |
| **Queries** | FREE | get_swap_quote, list_wallets, get_payment_pricing |

### Payment Tools

```typescript
// Get all pricing
await client.callTool('get_payment_pricing', {});

// Get specific tool price
await client.callTool('get_tool_price', { tool_name: 'execute_swap' });

// Get supported networks
await client.callTool('get_payment_networks', {});
```

### Supported Networks

| Network | USDC Address |
|---------|--------------|
| Base Mainnet | 0x833589fCD6eDb6E08f4c7C32D4f71b54bdA02913 |
| Base Sepolia | 0x036CbD53842c5426634e7929541eC2318f3dCF7e |
| Ethereum | 0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48 |
| Solana Mainnet | EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v |

### Disabling Payments

Simply don't set `X402_PAY_TO_ADDRESS` - all tools will be free.

📖 **Full Documentation**: [docs/X402_PAYMENTS.md](docs/X402_PAYMENTS.md)

---

## �🔒 Security

### Threat Model

| Threat | Mitigation |
|--------|------------|
| Key extraction | AES-256-GCM encryption, scrypt KDF |
| Memory dumps | Secure memory wiping, no key logging |
| Database breach | Encrypted private keys, hashed identifiers |
| RPC interception | HTTPS only, certificate pinning |
| MEV attacks | Jito bundles, private mempools |
| Replay attacks | Transaction expiry, nonce management |
| Social engineering | No sensitive data in logs/errors |

### Best Practices

1. **Never commit secrets** - Use environment variables
2. **Rotate keys regularly** - Automated key rotation support
3. **Audit logging** - All sensitive operations logged
4. **Least privilege** - Wallets only get needed permissions
5. **Network isolation** - Database not exposed publicly
6. **Regular updates** - Automated dependency scanning

### Audit Checklist

```
[ ] All private keys encrypted at rest
[ ] No secrets in version control
[ ] Database connections use SSL
[ ] RPC endpoints use HTTPS
[ ] Rate limiting enabled
[ ] Input validation on all endpoints
[ ] Error messages don't leak information
[ ] Logging excludes sensitive data
[ ] Dependencies scanned for vulnerabilities
[ ] Access controls enforced
```

---

## 🚢 Deployment

### Docker Compose (Development)

```yaml
version: '3.8'

services:
  boosty-mcp:
    build: .
    environment:
      - SOLANA_RPC_URL=${SOLANA_RPC_URL}
      - DATABASE_URL=postgresql://boosty:password@postgres:5432/boosty
      - REDIS_URL=redis://redis:6379
    depends_on:
      - postgres
      - redis
    ports:
      - "3000:3000"

  postgres:
    image: postgres:16
    environment:
      POSTGRES_USER: boosty
      POSTGRES_PASSWORD: password
      POSTGRES_DB: boosty
    volumes:
      - postgres_data:/var/lib/postgresql/data
      - ./docker/init-db.sql:/docker-entrypoint-initdb.d/init.sql

  redis:
    image: redis:7-alpine
    command: redis-server --appendonly yes
    volumes:
      - redis_data:/data

  prometheus:
    image: prom/prometheus
    volumes:
      - ./docker/prometheus.yml:/etc/prometheus/prometheus.yml
    ports:
      - "9090:9090"

  grafana:
    image: grafana/grafana
    environment:
      - GF_SECURITY_ADMIN_PASSWORD=admin
    ports:
      - "3001:3000"
    volumes:
      - grafana_data:/var/lib/grafana

volumes:
  postgres_data:
  redis_data:
  grafana_data:
```

### Kubernetes (Production)

```yaml
apiVersion: apps/v1
kind: Deployment
metadata:
  name: boosty-mcp
spec:
  replicas: 3
  selector:
    matchLabels:
      app: boosty-mcp
  template:
    metadata:
      labels:
        app: boosty-mcp
    spec:
      containers:
        - name: boosty-mcp
          image: boosty/mcp-defi:latest
          resources:
            requests:
              memory: "512Mi"
              cpu: "500m"
            limits:
              memory: "2Gi"
              cpu: "2000m"
          envFrom:
            - secretRef:
                name: boosty-secrets
          livenessProbe:
            httpGet:
              path: /health
              port: 8080
            initialDelaySeconds: 30
            periodSeconds: 10
          readinessProbe:
            httpGet:
              path: /ready
              port: 8080
            initialDelaySeconds: 5
            periodSeconds: 5
```

---

## 📚 API Reference

See [docs/API_REFERENCE.md](docs/API_REFERENCE.md) for complete API documentation.

---

## 💡 Examples

### Example 1: Simple Token Swap

```typescript
// In Claude Desktop:
// "Swap 1 SOL for USDC"

// Behind the scenes:
const result = await boosty.tools.executeSwap({
  inputToken: 'SOL',
  outputToken: 'USDC',
  amount: 1,
  slippageBps: 50,
});
```

### Example 2: Volume Campaign

```typescript
// In Claude Desktop:
// "Start a volume campaign for token ABC with $10k daily volume for 3 days"

// Behind the scenes:
const campaign = await boosty.tools.createVolumeCampaign({
  token: 'ABC',
  dailyVolume: 10000,
  duration: 3 * 24 * 60 * 60,
  pattern: 'organic',
});
```

### Example 3: Portfolio Rebalancing

```typescript
// In Claude Desktop:
// "Rebalance my portfolio to 50% SOL, 30% USDC, 20% ETH"

// Behind the scenes:
const result = await boosty.tools.rebalancePortfolio({
  targetAllocations: {
    SOL: 0.5,
    USDC: 0.3,
    ETH: 0.2,
  },
  slippageBps: 100,
});
```

---

## 🔧 Troubleshooting

### Common Issues

#### "Transaction simulation failed"

```bash
# Check SOL balance for fees
solana balance <wallet-address>

# Verify token account exists
spl-token accounts --owner <wallet-address>
```

#### "Rate limited by RPC"

```bash
# Use dedicated RPC provider
SOLANA_RPC_URL=https://your-helius-endpoint.com
```

#### "Encryption key mismatch"

```bash
# Ensure same key is used
echo $MASTER_ENCRYPTION_KEY | wc -c  # Should be 64 (32 bytes hex)
```

#### "Connection refused to database"

```bash
# Check if PostgreSQL is running
docker ps | grep postgres

# Start if needed
docker-compose up -d postgres

# Verify connection
psql $DATABASE_URL -c "SELECT 1"
```

#### "Redis connection failed"

```bash
# Check if Redis is running
docker ps | grep redis

# Test connection
redis-cli -u $REDIS_URL ping
```

#### "Jupiter quote failed"

```bash
# Check if token is valid
curl "https://quote-api.jup.ag/v6/quote?inputMint=So11111111111111111111111111111111111111112&outputMint=YOUR_TOKEN&amount=1000000000"

# Verify the mint address is correct and has liquidity
```

#### "Insufficient balance for transaction"

```bash
# Check wallet balance
solana balance <WALLET_ADDRESS> --url mainnet-beta

# Check token balance
spl-token balance <TOKEN_MINT> --owner <WALLET_ADDRESS>
```

---

## 📊 Monitoring & Observability

### Prometheus Metrics

Boosty exposes Prometheus metrics for monitoring:

```typescript
// Available metrics
boosty_transactions_total{status="success|failed", dex="jupiter|raydium|pumpfun"}
boosty_transaction_duration_seconds{dex="jupiter|raydium|pumpfun"}
boosty_wallet_balance_sol{wallet_group="main|campaign"}
boosty_campaign_volume_usd{campaign_id="..."}
boosty_rpc_requests_total{endpoint="getBalance|sendTransaction"}
boosty_rpc_latency_seconds{endpoint="getBalance|sendTransaction"}
boosty_task_queue_length{queue="trades|funding|collection"}
boosty_active_campaigns_total{}
```

### Grafana Dashboard

Import the provided dashboard for visualization:

```bash
# Dashboard available at
./docker/grafana/dashboards/boosty-overview.json
```

**Dashboard Panels:**
- Transaction throughput (TPS)
- Success/failure rates
- Average transaction latency
- Campaign progress
- Wallet balances
- RPC health
- Queue depths

### Alerting Rules

```yaml
# docker/prometheus/alerts.yml
groups:
  - name: boosty-alerts
    rules:
      - alert: HighTransactionFailureRate
        expr: rate(boosty_transactions_total{status="failed"}[5m]) / rate(boosty_transactions_total[5m]) > 0.1
        for: 5m
        labels:
          severity: critical
        annotations:
          summary: "High transaction failure rate"
          
      - alert: LowWalletBalance
        expr: boosty_wallet_balance_sol{wallet_group="treasury"} < 1
        for: 1m
        labels:
          severity: warning
        annotations:
          summary: "Treasury balance below 1 SOL"
          
      - alert: CampaignStalled
        expr: increase(boosty_campaign_volume_usd[1h]) == 0
        for: 1h
        labels:
          severity: warning
        annotations:
          summary: "Campaign not generating volume"
```

### Health Checks

```typescript
// GET /health
{
  "status": "healthy",
  "timestamp": "2024-01-15T10:30:00Z",
  "checks": {
    "database": { "status": "up", "latency_ms": 5 },
    "redis": { "status": "up", "latency_ms": 2 },
    "solana_rpc": { "status": "up", "latency_ms": 150 },
    "jupiter_api": { "status": "up", "latency_ms": 200 }
  },
  "version": "2.0.0",
  "uptime_seconds": 86400
}

// GET /ready
{
  "ready": true,
  "campaigns_active": 3,
  "queue_depth": 45,
  "wallets_funded": 500
}
```

---

## 🔌 Integration Examples

### Integration with External Systems

#### Webhook Notifications

```typescript
// Configure webhooks for trade events
const webhookConfig = {
  url: 'https://your-server.com/webhook',
  events: ['trade.completed', 'trade.failed', 'campaign.started', 'campaign.completed'],
  secret: 'your-webhook-secret',
};

// Webhook payload
{
  "event": "trade.completed",
  "timestamp": "2024-01-15T10:30:00Z",
  "data": {
    "campaignId": "abc123",
    "txSignature": "5K3...",
    "inputToken": "SOL",
    "outputToken": "USDC",
    "inputAmount": 1.5,
    "outputAmount": 150.25,
    "priceImpact": 0.05,
    "walletIndex": 42
  }
}
```

#### REST API (Optional HTTP Mode)

```typescript
// Start in HTTP mode
boosty-mcp --transport http --port 3000

// Endpoints
POST /api/v1/swap
POST /api/v1/campaign
GET  /api/v1/campaign/:id
GET  /api/v1/portfolio
GET  /api/v1/prices/:symbol
```

#### WebSocket Streaming

```typescript
// Connect to real-time updates
const ws = new WebSocket('wss://your-server.com/ws');

ws.onmessage = (event) => {
  const data = JSON.parse(event.data);
  switch (data.type) {
    case 'trade':
      console.log('Trade executed:', data.trade);
      break;
    case 'price':
      console.log('Price update:', data.price);
      break;
    case 'campaign':
      console.log('Campaign update:', data.campaign);
      break;
  }
};
```

---

## 🧪 Testing

### Unit Tests

```bash
# Run all unit tests
pnpm test

# Run tests for specific package
pnpm --filter @boosty/trading-engine test

# Run with coverage
pnpm test:coverage

# Watch mode for development
pnpm test:watch
```

### Integration Tests

```bash
# Requires running database and Redis
docker-compose up -d postgres redis

# Run integration tests
pnpm test:integration

# Run against devnet
SOLANA_RPC_URL=https://api.devnet.solana.com pnpm test:integration
```

### E2E Tests

```bash
# Full end-to-end testing (uses devnet)
pnpm test:e2e

# Smoke tests only
pnpm test:e2e:smoke
```

### Test Coverage Requirements

| Package | Minimum Coverage |
|---------|-----------------|
| `@boosty/mcp-shared` | 90% |
| `@boosty/solana-core` | 85% |
| `@boosty/trading-engine` | 80% |
| `@boosty/wallet-manager` | 90% |
| `@boosty/orchestrator` | 75% |
| `@boosty/mcp-server` | 70% |

---

## 📈 Performance

### Benchmarks

| Operation | Average Latency | Throughput |
|-----------|-----------------|------------|
| Token Price Query | 50ms | 100 req/s |
| Jupiter Quote | 200ms | 20 req/s |
| Transaction Submit | 500ms | 10 TPS |
| Transaction Confirm | 15s | - |
| Portfolio Query | 300ms | 30 req/s |
| Wallet Derivation | 5ms | 200/s |

### Optimization Tips

1. **Use dedicated RPC** - Shared endpoints are rate-limited
2. **Enable caching** - Reduces API calls significantly
3. **Batch operations** - Use versioned transactions for multiple transfers
4. **Parallel execution** - Orchestrator handles concurrency
5. **Connection pooling** - Reuse database connections

### Resource Requirements

| Deployment | CPU | Memory | Disk |
|------------|-----|--------|------|
| Development | 2 cores | 4GB | 20GB |
| Production (single) | 4 cores | 8GB | 50GB |
| Production (HA) | 8+ cores | 16GB | 100GB |

---

## 🗺️ Roadmap

### Version 2.0 (Current)
- [x] Solana core integration
- [x] Jupiter V6 support
- [x] HD wallet management
- [x] Volume orchestration
- [ ] PumpFun bonding curves
- [ ] Raydium CLMM
- [ ] Orca Whirlpools

### Version 2.1 (Q2 2024)
- [ ] EVM chain support (Ethereum, Base, Arbitrum)
- [ ] Uniswap V3 integration
- [ ] Cross-chain bridging
- [ ] Advanced analytics dashboard

### Version 2.2 (Q3 2024)
- [ ] Multi-signature support
- [ ] Governance integration
- [ ] Mobile companion app
- [ ] Advanced ML-based patterns

### Version 3.0 (Q4 2024)
- [ ] AI-powered strategy optimization
- [ ] Decentralized orchestration
- [ ] Custom DEX deployment
- [ ] Enterprise SSO

---

## ❓ FAQ

### General Questions

**Q: Is this legal to use?**
A: Boosty is a tool for executing trades on decentralized exchanges. Users are responsible for complying with local regulations. Volume generation activities may be restricted in some jurisdictions.

**Q: Does this work on mainnet?**
A: Yes, Boosty executes real transactions on Solana mainnet. Always test on devnet first.

**Q: What are the costs?**
A: Costs include Solana transaction fees (~0.000005 SOL/tx), priority fees (variable), and RPC provider costs if using dedicated endpoints.

**Q: How many wallets can I manage?**
A: Technically unlimited. We've tested with 10,000+ wallets in a single campaign.

### Technical Questions

**Q: Why use MCP instead of a REST API?**
A: MCP integrates directly with Claude Desktop, enabling natural language interaction. No need to memorize commands or read documentation.

**Q: Can I use this without Claude Desktop?**
A: Yes, the individual packages can be used programmatically via their TypeScript APIs.

**Q: Is my private key safe?**
A: Private keys are encrypted with AES-256-GCM and never leave your infrastructure. Keys are decrypted only when signing transactions, then immediately cleared from memory.

**Q: How do you handle failed transactions?**
A: Automatic retry with exponential backoff, priority fee bumping, and detailed failure logging. Failed transactions are recorded for analysis.

### Integration Questions

**Q: Can I integrate with my existing trading bot?**
A: Yes, all packages expose TypeScript APIs that can be imported into your codebase.

**Q: Do you support other AI assistants?**
A: Currently optimized for Claude Desktop, but the MCP protocol is an open standard.

**Q: Can I run multiple campaigns simultaneously?**
A: Yes, the orchestrator manages multiple campaigns concurrently with resource isolation.

---

## 🤝 Contributing

We welcome contributions! See [CONTRIBUTING.md](CONTRIBUTING.md) for guidelines.

### Development Workflow

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Make your changes
4. Add tests for new functionality
5. Run the test suite (`pnpm test`)
6. Commit your changes (`git commit -m 'feat: add amazing feature'`)
7. Push to the branch (`git push origin feature/amazing-feature`)
8. Open a Pull Request

### Commit Convention

We use [Conventional Commits](https://www.conventionalcommits.org/):

```
feat: add new feature
fix: fix a bug
docs: documentation changes
style: formatting, no code change
refactor: code restructuring
test: adding tests
chore: maintenance tasks
```

### Code Style

- TypeScript strict mode
- ESLint with Prettier
- 100% type coverage for public APIs
- JSDoc comments for exported functions
- Meaningful variable names

### Pull Request Checklist

- [ ] Tests pass (`pnpm test`)
- [ ] Linting passes (`pnpm lint`)
- [ ] Type checking passes (`pnpm typecheck`)
- [ ] Documentation updated if needed
- [ ] CHANGELOG.md updated for notable changes
- [ ] PR description explains the change

---

## 🙏 Acknowledgments

Built with these amazing open-source projects:

- [Solana Web3.js](https://github.com/solana-labs/solana-web3.js) - Solana JavaScript SDK
- [Jupiter](https://jup.ag/) - Best swap aggregator on Solana
- [Model Context Protocol](https://modelcontextprotocol.io/) - AI integration standard
- [BullMQ](https://bullmq.io/) - Redis-based queue system
- [Drizzle ORM](https://orm.drizzle.team/) - TypeScript ORM
- [Zod](https://zod.dev/) - TypeScript schema validation
- [Vitest](https://vitest.dev/) - Fast unit test framework

---

## 📄 License

MIT License - see [LICENSE](LICENSE) for details.

```
MIT License

Copyright (c) 2024 Boosty

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.
```

---

<p align="center">
  <img src="https://img.shields.io/badge/Made%20with-TypeScript-blue?style=flat-square&logo=typescript" alt="TypeScript">
  <img src="https://img.shields.io/badge/Built%20for-Claude%20Desktop-purple?style=flat-square" alt="Claude Desktop">
  <img src="https://img.shields.io/badge/Powered%20by-Solana-green?style=flat-square&logo=solana" alt="Solana">
</p>

<p align="center">
  <strong>Built with ❤️ by the Boosty Team</strong>
</p>

<p align="center">
  <a href="https://twitter.com/boostyfi">Twitter</a> •
  <a href="https://discord.gg/boosty">Discord</a> •
  <a href="https://docs.boosty.fi">Documentation</a>
</p>

---

## 📚 Appendix

### A. Supported Token List

Boosty supports any SPL token on Solana. Here are commonly traded tokens:

| Symbol | Name | Mint Address |
|--------|------|--------------|
| SOL | Solana | So11111111111111111111111111111111111111112 |
| USDC | USD Coin | EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v |
| USDT | Tether | Es9vMFrzaCERmJfrF4H2FYD4KCoNkY11McCe8BenwNYB |
| BONK | Bonk | DezXAZ8z7PnrnRJjz3wXBoRgixCa6xjnB7YaB1pPB263 |
| WIF | dogwifhat | EKpQGSJtjMFqKZ9KQanSqYXRcF8fBopzLHYxdM65zcjm |
| JUP | Jupiter | JUPyiwrYJFskUPiHa7hkeR8VUtAeFoSYbKedZNsDvCN |
| RAY | Raydium | 4k3Dyjzvzp8eMZWUXbBCjEvwSkkk59S5iCNLY3QrkX6R |
| ORCA | Orca | orcaEKTdK7LKz57vaAYr9QeNsVEPfiu6QeMU1kektZE |

### B. Error Codes Reference

| Code | Description | Resolution |
|------|-------------|------------|
| `E001` | Insufficient SOL balance | Fund wallet with SOL |
| `E002` | Insufficient token balance | Check token balance |
| `E003` | Transaction simulation failed | Check token accounts exist |
| `E004` | RPC rate limited | Use dedicated RPC |
| `E005` | Slippage exceeded | Increase slippage or retry |
| `E006` | Transaction expired | Retry with fresh blockhash |
| `E007` | Invalid token mint | Verify mint address |
| `E008` | Pool not found | Token may not have liquidity |
| `E009` | Encryption key invalid | Check MASTER_ENCRYPTION_KEY |
| `E010` | Database connection failed | Check DATABASE_URL |

### C. Network Endpoints

| Network | RPC URL | WebSocket URL |
|---------|---------|---------------|
| Mainnet | https://api.mainnet-beta.solana.com | wss://api.mainnet-beta.solana.com |
| Devnet | https://api.devnet.solana.com | wss://api.devnet.solana.com |
| Helius (mainnet) | https://mainnet.helius-rpc.com/?api-key=YOUR_KEY | wss://mainnet.helius-rpc.com/?api-key=YOUR_KEY |
| QuickNode | Your endpoint URL | Your WebSocket URL |

### D. Configuration Templates

#### Minimal Configuration

```bash
# .env.minimal
SOLANA_RPC_URL=https://api.mainnet-beta.solana.com
MASTER_ENCRYPTION_KEY=your-32-byte-hex-key
```

#### Production Configuration

```bash
# .env.production
SOLANA_RPC_URL=https://mainnet.helius-rpc.com/?api-key=YOUR_KEY
SOLANA_RPC_WS_URL=wss://mainnet.helius-rpc.com/?api-key=YOUR_KEY
JITO_BLOCK_ENGINE_URL=https://mainnet.block-engine.jito.wtf
DATABASE_URL=postgresql://user:pass@db.example.com:5432/boosty?ssl=true
REDIS_URL=redis://user:pass@redis.example.com:6379
MASTER_ENCRYPTION_KEY=your-production-key
COINGECKO_API_KEY=your-pro-key
LOG_LEVEL=info
LOG_FORMAT=json
```

### E. Glossary

| Term | Definition |
|------|------------|
| **AMM** | Automated Market Maker - DEX mechanism using liquidity pools |
| **CLMM** | Concentrated Liquidity Market Maker - Capital-efficient AMM |
| **DEX** | Decentralized Exchange |
| **HD Wallet** | Hierarchical Deterministic Wallet - derive many keys from one seed |
| **Jito** | MEV protection service for Solana |
| **Jupiter** | Solana's leading swap aggregator |
| **Lamports** | Smallest unit of SOL (1 SOL = 1 billion lamports) |
| **MCP** | Model Context Protocol - AI integration standard |
| **MEV** | Maximal Extractable Value - front-running/sandwich attacks |
| **PumpFun** | Bonding curve platform for new tokens |
| **RPC** | Remote Procedure Call - blockchain API endpoint |
| **SPL Token** | Solana Program Library Token - Solana's token standard |
| **TVL** | Total Value Locked - liquidity in a protocol |
