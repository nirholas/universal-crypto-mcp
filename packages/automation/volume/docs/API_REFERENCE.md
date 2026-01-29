# API Reference

Complete documentation for all boosty MCP DeFi tools.

## Table of Contents

- [Price Tools](#price-tools)
- [Wallet Tools](#wallet-tools)
- [Yield Tools](#yield-tools)

---

## Price Tools

### getTokenPrice

Get current price and market data for a cryptocurrency token.

**Input Schema:**

```typescript
{
  symbol: string;     // Token symbol (e.g., "ETH", "BTC", "ARB")
  currency?: string;  // Currency for price (default: "usd")
}
```

**Output Schema:**

```typescript
{
  symbol: string;
  price: number;
  change24h: number;      // 24-hour price change percentage
  marketCap: number;
  volume24h: number;
  currency: string;
  lastUpdated: string;    // ISO 8601 timestamp
}
```

**Example Request:**

```json
{
  "symbol": "ETH",
  "currency": "usd"
}
```

**Example Response:**

```json
{
  "symbol": "ETH",
  "price": 2534.82,
  "change24h": 2.45,
  "marketCap": 304567890123,
  "volume24h": 15234567890,
  "currency": "USD",
  "lastUpdated": "2026-01-26T12:00:00.000Z"
}
```

---

### getGasPrices

Get current gas prices for a blockchain network.

**Input Schema:**

```typescript
{
  chain?: string;  // Chain name (default: "ethereum")
}
```

**Output Schema:**

```typescript
{
  chain: string;
  slow: { gwei: number; estimatedTime: string };
  standard: { gwei: number; estimatedTime: string };
  fast: { gwei: number; estimatedTime: string };
  baseFee?: number;
  lastUpdated: string;
}
```

**Example Request:**

```json
{
  "chain": "ethereum"
}
```

**Example Response:**

```json
{
  "chain": "ethereum",
  "slow": { "gwei": 18, "estimatedTime": "5-10 min" },
  "standard": { "gwei": 22, "estimatedTime": "1-3 min" },
  "fast": { "gwei": 30, "estimatedTime": "< 30 sec" },
  "baseFee": 15.5,
  "lastUpdated": "2026-01-26T12:00:00.000Z"
}
```

---

### getTopMovers

Get top gaining and losing tokens in the last 24 hours.

**Input Schema:**

```typescript
{
  limit?: number;    // Number of results (default: 10)
  sortBy?: string;   // "gainers" | "losers" | "both" (default: "both")
}
```

**Output Schema:**

```typescript
{
  gainers: Array<{
    symbol: string;
    name: string;
    price: number;
    change24h: number;
    volume24h: number;
  }>;
  losers: Array<{
    symbol: string;
    name: string;
    price: number;
    change24h: number;
    volume24h: number;
  }>;
  lastUpdated: string;
}
```

---

### getFearGreedIndex

Get the current crypto Fear & Greed Index.

**Input Schema:**

```typescript
{} // No inputs required
```

**Output Schema:**

```typescript
{
  value: number;           // 0-100
  classification: string;  // "Extreme Fear" | "Fear" | "Neutral" | "Greed" | "Extreme Greed"
  previousValue: number;
  previousClassification: string;
  lastUpdated: string;
}
```

**Example Response:**

```json
{
  "value": 65,
  "classification": "Greed",
  "previousValue": 58,
  "previousClassification": "Neutral",
  "lastUpdated": "2026-01-26T00:00:00.000Z"
}
```

---

### comparePrices

Compare prices of multiple tokens side by side.

**Input Schema:**

```typescript
{
  symbols: string[];     // Array of token symbols
  currency?: string;     // Currency (default: "usd")
}
```

**Output Schema:**

```typescript
{
  tokens: Array<{
    symbol: string;
    price: number;
    change24h: number;
    marketCap: number;
    rank: number;
  }>;
  lastUpdated: string;
}
```

---

## Wallet Tools

### getWalletPortfolio

Get complete portfolio overview for a wallet address.

**Input Schema:**

```typescript
{
  address: string;    // Wallet address (0x...)
  chain?: string;     // Blockchain (default: "ethereum")
}
```

**Output Schema:**

```typescript
{
  address: string;
  chain: string;
  totalValueUsd: number;
  tokens: Array<{
    symbol: string;
    name: string;
    balance: string;
    valueUsd: number;
    percentage: number;
  }>;
  nftCount: number;
  defiPositionsCount: number;
  lastUpdated: string;
}
```

**Example Request:**

```json
{
  "address": "0x742d35Cc6634C0532925a3b844Bc9e7595f...",
  "chain": "ethereum"
}
```

---

### getTokenBalances

Get detailed ERC20 token balances for a wallet.

**Input Schema:**

```typescript
{
  address: string;
  chain?: string;
  includeSpam?: boolean;  // Include spam tokens (default: false)
}
```

**Output Schema:**

```typescript
{
  address: string;
  chain: string;
  nativeBalance: {
    symbol: string;
    balance: string;
  };
  tokens: Array<{
    contractAddress: string;
    symbol: string;
    name: string;
    decimals: number;
    balance: string;
    rawBalance: string;
    logoUrl?: string;
  }>;
  totalTokens: number;
  lastUpdated: string;
}
```

---

### getNFTs

Get NFT holdings for a wallet address.

**Input Schema:**

```typescript
{
  address: string;
  chain?: string;
  limit?: number;  // Max NFTs to return (default: 20)
}
```

**Output Schema:**

```typescript
{
  address: string;
  chain: string;
  nfts: Array<{
    contractAddress: string;
    tokenId: string;
    name: string;
    description?: string;
    imageUrl?: string;
    collection: string;
  }>;
  totalCount: number;
  collections: Array<{ name: string; count: number }>;
  lastUpdated: string;
}
```

---

### getDeFiPositions

Get DeFi protocol positions for a wallet.

**Input Schema:**

```typescript
{
  address: string;
}
```

**Output Schema:**

```typescript
{
  address: string;
  totalValueUsd: number;
  totalDebtUsd: number;
  netValueUsd: number;
  positions: Array<{
    protocol: string;
    category: string;
    chain: string;
    type: "lending" | "borrowing" | "liquidity" | "staking" | "farming" | "other";
    valueUsd: number;
    rewardUsd?: number;
    debtUsd?: number;
    healthFactor?: number;
  }>;
  protocolCount: number;
  lastUpdated: string;
}
```

---

### getApprovals

Get token approvals (allowances) for a wallet.

**Input Schema:**

```typescript
{
  address: string;
  chain?: string;
}
```

**Output Schema:**

```typescript
{
  address: string;
  chain: string;
  approvals: Array<{
    token: { address: string; symbol: string; name: string };
    spender: string;
    spenderName?: string;
    allowance: string;
    isUnlimited: boolean;
    riskLevel: "low" | "medium" | "high";
  }>;
  totalApprovals: number;
  highRiskCount: number;
  unlimitedCount: number;
  recommendations: string[];
  lastUpdated: string;
}
```

---

## Yield Tools

### getTopYields

Get top yield farming opportunities across DeFi.

**Input Schema:**

```typescript
{
  chain?: string;           // Filter by chain
  minTvl?: number;          // Minimum TVL in USD (default: 1000000)
  minApy?: number;          // Minimum APY
  maxApy?: number;          // Maximum APY (default: 100)
  stablecoinOnly?: boolean; // Only stablecoin pools
  limit?: number;           // Number of results (default: 10)
}
```

**Output Schema:**

```typescript
{
  opportunities: Array<{
    poolId: string;
    protocol: string;
    chain: string;
    symbol: string;
    apy: number;
    apyBase?: number;
    apyReward?: number;
    tvlUsd: number;
    stablecoin: boolean;
    ilRisk: string;
  }>;
  totalCount: number;
  filters: { chain?: string; minTvl: number; maxApy: number };
  lastUpdated: string;
}
```

---

### getPoolDetails

Get detailed information about a specific yield pool.

**Input Schema:**

```typescript
{
  poolId: string;  // Pool ID from DefiLlama
}
```

**Output Schema:**

```typescript
{
  pool: {
    id: string;
    protocol: string;
    chain: string;
    symbol: string;
    tvlUsd: number;
    apy: number;
    apyBase?: number;
    apyReward?: number;
    stablecoin: boolean;
    ilRisk: string;
    rewardTokens?: string[];
    underlyingTokens?: string[];
  };
  risk: {
    overallScore: number;
    riskLevel: "low" | "medium" | "high" | "critical";
    warnings: string[];
    recommendations: string[];
  };
  history?: Array<{ timestamp: string; apy: number; tvlUsd: number }>;
  lastUpdated: string;
}
```

---

### compareYields

Compare multiple yield pools side by side.

**Input Schema:**

```typescript
{
  poolIds: string[];  // 2-5 pool IDs to compare
}
```

**Output Schema:**

```typescript
{
  pools: Array<{
    poolId: string;
    protocol: string;
    chain: string;
    symbol: string;
    apy: number;
    tvlUsd: number;
    riskLevel: string;
    riskScore: number;
    stablecoin: boolean;
  }>;
  recommendation: {
    bestApy: string;
    bestRiskAdjusted: string;
    lowestRisk: string;
    reasoning: string;
  };
  lastUpdated: string;
}
```

---

### getStablecoinYields

Get best stablecoin yield opportunities.

**Input Schema:**

```typescript
{
  chain?: string;
  minTvl?: number;   // Default: 5000000
  minApy?: number;
  limit?: number;    // Default: 15
}
```

**Output Schema:**

```typescript
{
  yields: Array<{
    poolId: string;
    protocol: string;
    chain: string;
    symbol: string;
    apy: number;
    tvlUsd: number;
    riskLevel: string;
  }>;
  summary: {
    averageApy: number;
    medianApy: number;
    topProtocol: string;
    totalTvl: number;
  };
  lastUpdated: string;
}
```

---

### getRiskAssessment

Get detailed risk assessment for a yield pool.

**Input Schema:**

```typescript
{
  poolId: string;
}
```

**Output Schema:**

```typescript
{
  poolId: string;
  protocol: string;
  chain: string;
  symbol: string;
  overallRisk: "low" | "medium" | "high" | "critical";
  riskScore: number;  // 0-100
  riskFactors: {
    tvlRisk: { score: number; description: string };
    apyRisk: { score: number; description: string };
    ilRisk: { score: number; description: string };
    protocolRisk: { score: number; description: string };
    chainRisk: { score: number; description: string };
  };
  warnings: string[];
  recommendations: string[];
  poolMetrics: { tvlUsd: number; apy: number; stablecoin: boolean };
  lastUpdated: string;
}
```

---

## Error Handling

All tools return errors in a consistent format:

```typescript
{
  error: string;  // Error message
  code?: string;  // Error code (optional)
}
```

Common error codes:
- `INVALID_INPUT`: Invalid input parameters
- `NOT_FOUND`: Resource not found
- `RATE_LIMITED`: Rate limit exceeded
- `API_ERROR`: External API error
- `NETWORK_ERROR`: Network connectivity issue
