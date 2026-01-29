# DeFi Package

The DeFi package provides integrations with decentralized finance protocols for lending, trading, staking, and more.

## Installation

```bash
npm install @universal-crypto-mcp/defi-protocols
npm install @universal-crypto-mcp/defi-aave
npm install @universal-crypto-mcp/defi-uniswap
```

## Supported Protocols

### Lending

| Protocol | Chains | Package |
|----------|--------|---------|
| Aave V3 | Ethereum, Polygon, Arbitrum, Optimism, Avalanche | `defi-aave` |
| Compound V3 | Ethereum, Polygon, Arbitrum, Base | `defi-protocols` |

### DEX

| Protocol | Chains | Package |
|----------|--------|---------|
| Uniswap V3 | Ethereum, Polygon, Arbitrum, Optimism, Base | `defi-uniswap` |
| 1inch | All EVM | `defi-protocols` |
| 0x | All EVM | `defi-protocols` |
| ParaSwap | All EVM | `defi-protocols` |

### Liquid Staking

| Protocol | Chains | Package |
|----------|--------|---------|
| Lido | Ethereum | `defi-protocols` |
| Rocket Pool | Ethereum | `defi-protocols` |

### Bridges

| Protocol | Chains | Package |
|----------|--------|---------|
| LayerZero | Multi-chain | `defi-protocols` |
| Stargate | Multi-chain | `defi-protocols` |
| Wormhole | Multi-chain | `defi-protocols` |

## Available Tools

### Swap Tools

| Tool | Description |
|------|-------------|
| `get_swap_quote` | Get best swap quote |
| `execute_swap` | Execute a swap |
| `get_swap_routes` | Get all available routes |
| `get_slippage` | Calculate slippage |

### Lending Tools

| Tool | Description |
|------|-------------|
| `get_lending_markets` | List lending markets |
| `get_lending_position` | Get user position |
| `deposit_lending` | Supply assets |
| `withdraw_lending` | Withdraw assets |
| `borrow` | Borrow assets |
| `repay` | Repay borrowed assets |
| `get_health_factor` | Check health factor |

### Staking Tools

| Tool | Description |
|------|-------------|
| `stake_eth` | Stake ETH for stETH |
| `get_staking_apy` | Get staking APY |
| `get_staking_position` | Get staking position |
| `unstake` | Unstake tokens |

### Bridge Tools

| Tool | Description |
|------|-------------|
| `get_bridge_quote` | Get bridge quote |
| `execute_bridge` | Execute bridge transfer |
| `get_bridge_status` | Check bridge status |

## Usage Examples

### Get Swap Quote

```typescript
// AI command: "Get a quote to swap 1 ETH for USDC on Arbitrum"
// Tool called: get_swap_quote
// Parameters:
{
  fromToken: "ETH",
  toToken: "USDC",
  amount: "1",
  chain: "arbitrum"
}

// Response:
{
  fromToken: { symbol: "ETH", amount: "1.0" },
  toToken: { symbol: "USDC", amount: "3456.78" },
  rate: 3456.78,
  priceImpact: "0.05%",
  sources: [
    { name: "Uniswap V3", percentage: 100 }
  ],
  estimatedGas: "150000",
  gasCostUsd: "$0.15"
}
```

### Execute Swap

```typescript
// AI command: "Swap 1 ETH for USDC on Arbitrum"
// Tool called: execute_swap
// Parameters:
{
  fromToken: "ETH",
  toToken: "USDC",
  amount: "1",
  chain: "arbitrum",
  slippage: 0.5  // 0.5%
}

// Response:
{
  hash: "0xabc...",
  status: "pending",
  fromToken: { symbol: "ETH", amount: "1.0" },
  toToken: { symbol: "USDC", amount: "3445.12" },  // After slippage
  gasCost: "0.0001 ETH"
}
```

### Check Lending Position

```typescript
// AI command: "What's my Aave position on Ethereum?"
// Tool called: get_lending_position
// Parameters:
{
  protocol: "aave",
  chain: "ethereum"
}

// Response:
{
  protocol: "Aave V3",
  chain: "ethereum",
  healthFactor: 1.85,
  netWorthUsd: 5000.00,
  supplies: [
    {
      asset: "ETH",
      balance: "1.5",
      valueUsd: 5185.17,
      apy: "2.1%"
    }
  ],
  borrows: [
    {
      asset: "USDC",
      balance: "1000",
      valueUsd: 1000.00,
      apy: "-3.5%"
    }
  ],
  availableToBorrow: {
    USDC: "2500.00"
  }
}
```

### Deposit to Lending

```typescript
// AI command: "Supply 0.5 ETH to Aave"
// Tool called: deposit_lending
// Parameters:
{
  protocol: "aave",
  asset: "ETH",
  amount: "0.5",
  chain: "ethereum"
}

// Response:
{
  hash: "0xdef...",
  status: "confirmed",
  protocol: "Aave V3",
  action: "supply",
  asset: "ETH",
  amount: "0.5",
  newPosition: {
    balance: "2.0 ETH",
    valueUsd: 6913.56
  }
}
```

### Bridge Assets

```typescript
// AI command: "Bridge 1000 USDC from Ethereum to Arbitrum"
// Tool called: get_bridge_quote
// Parameters:
{
  fromChain: "ethereum",
  toChain: "arbitrum",
  token: "USDC",
  amount: "1000"
}

// Response:
{
  route: "Stargate",
  fromChain: "ethereum",
  toChain: "arbitrum",
  sendAmount: "1000.00 USDC",
  receiveAmount: "999.50 USDC",  // After fees
  fee: "$0.50",
  estimatedTime: "~2 minutes",
  gasCostUsd: "$5.00"
}
```

### Stake ETH

```typescript
// AI command: "Stake 1 ETH with Lido"
// Tool called: stake_eth
// Parameters:
{
  amount: "1",
  protocol: "lido"
}

// Response:
{
  hash: "0xghi...",
  status: "confirmed",
  stakedAmount: "1.0 ETH",
  receivedAmount: "0.9997 stETH",  // Slight variance
  currentApy: "3.8%"
}
```

## Protocol Aggregation

The DeFi protocols package aggregates multiple DEX sources:

```typescript
import { DeFiAggregator } from "@universal-crypto-mcp/defi-protocols";

const aggregator = new DeFiAggregator({
  providers: ["1inch", "0x", "paraswap"],
});

// Get best quote across all DEXs
const quote = await aggregator.getBestQuote({
  fromToken: "ETH",
  toToken: "USDC",
  amount: "1",
  chain: "ethereum",
});

console.log(`Best rate: ${quote.rate} (via ${quote.source})`);
```

## Security Features

### Slippage Protection

```typescript
// Default slippage tolerance
{
  slippage: 0.5,  // 0.5%
  deadline: 300   // 5 minutes
}
```

### Health Factor Warnings

```typescript
// Before any borrow operation
if (healthFactor < 1.2) {
  console.warn("Low health factor! Risk of liquidation.");
}
```

### Contract Verification

All protocol contracts are verified before interaction.

## Related Packages

- [Wallets Package](wallets.md) - Wallet management
- [Payments Package](payments.md) - Payment infrastructure
- [Market Data Package](market-data.md) - Price data
