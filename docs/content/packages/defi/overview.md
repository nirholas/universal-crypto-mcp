---
title: "DeFi Packages Overview"
description: "Comprehensive DeFi tools for AI agents - DEXs, lending, bridges across 60+ networks"
category: "packages"
keywords: ["defi", "uniswap", "aave", "compound", "curve", "gmx", "lido", "yearn"]
order: 1
---

# DeFi Packages

The DeFi packages provide comprehensive tools for AI agents to interact with decentralized finance protocols across 60+ blockchain networks.

## Overview

| Metric | Value |
|--------|-------|
| **Protocols** | 15+ major DeFi protocols |
| **Networks** | 60+ EVM chains |
| **Tools** | 100+ MCP tools |
| **Categories** | DEXs, Lending, Staking, Bridges |

## Package Structure

```
packages/defi/
├── protocols/         # Major DeFi protocols
│   ├── uniswap-v3-mcp/
│   ├── aave-mcp/
│   ├── compound-v3-mcp/
│   ├── curve-mcp/
│   ├── gmx-v2-mcp/
│   ├── lido-mcp/
│   └── yearn-mcp/
├── layer2/           # L2-specific integrations
├── smart-chain/      # BNB Chain ecosystem
├── stablecoin-protocol/  # Sperax USDs
├── shared/           # Shared utilities
└── agents/           # DeFi automation agents
```

## Quick Start

### Installation

```bash
pnpm add @universal-crypto-mcp/defi
```

### Using the Unified Adapter

```typescript
import { DeFiAdapter } from '@universal-crypto-mcp/defi';

const defi = new DeFiAdapter({
  rpcUrl: process.env.ETHEREUM_RPC_URL,
  privateKey: process.env.PRIVATE_KEY,
});

// Swap tokens via Uniswap
const swap = await defi.swap({
  protocol: 'uniswap-v3',
  tokenIn: 'ETH',
  tokenOut: 'USDC',
  amount: '1.0',
  slippage: 0.5,
});

// Get lending position from Aave
const position = await defi.getLendingPosition({
  protocol: 'aave-v3',
  address: '0xYourAddress',
});
```

## Supported Protocols

### DEXs (Decentralized Exchanges)

| Protocol | Networks | Features |
|----------|----------|----------|
| [Uniswap V3](./uniswap-v3.md) | Ethereum, Arbitrum, Optimism, Base, Polygon | Swaps, Liquidity, Positions |
| [Curve](./curve.md) | Ethereum, Arbitrum, Optimism, Polygon | Stablecoin Swaps, Gauges |
| [PancakeSwap](./pancakeswap.md) | BNB Chain, Ethereum, Arbitrum | Swaps, Farms, V3 |

### Lending Protocols

| Protocol | Networks | Features |
|----------|----------|----------|
| [Aave V3](./aave.md) | Ethereum, Arbitrum, Optimism, Polygon, Avalanche | Lending, Borrowing, Flash Loans |
| [Compound V3](./compound-v3.md) | Ethereum, Arbitrum, Base, Polygon | Supply, Borrow, Collateral |
| [Venus](./venus.md) | BNB Chain | Lending, Borrowing, VAI |

### Derivatives & Perpetuals

| Protocol | Networks | Features |
|----------|----------|----------|
| [GMX V2](./gmx-v2.md) | Arbitrum, Avalanche | Perpetuals, Positions, Orders |

### Staking & Yield

| Protocol | Networks | Features |
|----------|----------|----------|
| [Lido](./lido.md) | Ethereum | ETH Staking, stETH, wstETH |
| [Yearn](./yearn.md) | Ethereum, Arbitrum, Optimism | Vaults, Strategies, APY |
| [Sperax](./sperax.md) | Arbitrum | USDs Stablecoin, Yield |

## Multi-Chain Architecture

The DeFi packages use a unified interface across all supported networks:

```typescript
import { createDeFiClient } from '@universal-crypto-mcp/defi';

// Create clients for different networks
const ethereumDefi = createDeFiClient({ network: 'ethereum' });
const arbitrumDefi = createDeFiClient({ network: 'arbitrum' });
const baseDefi = createDeFiClient({ network: 'base' });

// Same API across all networks
const quote = await ethereumDefi.getSwapQuote({
  protocol: 'uniswap-v3',
  tokenIn: 'ETH',
  tokenOut: 'USDC',
  amount: '1.0',
});
```

## MCP Tools

### Swap Tools

| Tool | Description |
|------|-------------|
| `defi_swap` | Execute a token swap |
| `defi_quote` | Get swap quote without executing |
| `defi_routes` | Find best swap routes |
| `defi_slippage` | Calculate slippage tolerance |

### Lending Tools

| Tool | Description |
|------|-------------|
| `defi_supply` | Supply assets to lending protocol |
| `defi_borrow` | Borrow assets |
| `defi_repay` | Repay borrowed assets |
| `defi_withdraw` | Withdraw supplied assets |
| `defi_position` | Get lending position details |
| `defi_rates` | Get current interest rates |

### Staking Tools

| Tool | Description |
|------|-------------|
| `defi_stake` | Stake tokens |
| `defi_unstake` | Unstake tokens |
| `defi_rewards` | Check staking rewards |
| `defi_apr` | Get current APR/APY |

### Liquidity Tools

| Tool | Description |
|------|-------------|
| `defi_add_liquidity` | Add liquidity to pool |
| `defi_remove_liquidity` | Remove liquidity |
| `defi_positions` | Get LP positions |
| `defi_pool_info` | Get pool details |

## Configuration

### Environment Variables

```bash
# RPC Endpoints
ETHEREUM_RPC_URL=https://eth-mainnet.g.alchemy.com/v2/YOUR_KEY
ARBITRUM_RPC_URL=https://arb-mainnet.g.alchemy.com/v2/YOUR_KEY
BASE_RPC_URL=https://base-mainnet.g.alchemy.com/v2/YOUR_KEY

# Optional: Private key for transactions
PRIVATE_KEY=0x...

# Optional: Protocol-specific API keys
ALCHEMY_API_KEY=...
INFURA_API_KEY=...
```

### Programmatic Configuration

```typescript
import { DeFiConfig } from '@universal-crypto-mcp/defi';

const config: DeFiConfig = {
  networks: {
    ethereum: {
      rpcUrl: process.env.ETHEREUM_RPC_URL,
      chainId: 1,
    },
    arbitrum: {
      rpcUrl: process.env.ARBITRUM_RPC_URL,
      chainId: 42161,
    },
  },
  defaultSlippage: 0.5, // 0.5%
  gasMultiplier: 1.2,
};
```

## Protocol Comparison

| Feature | Uniswap V3 | Aave V3 | Curve | GMX V2 |
|---------|------------|---------|-------|--------|
| **Type** | DEX | Lending | DEX | Perps |
| **Networks** | 8+ | 7+ | 5+ | 2 |
| **Gas Efficiency** | ⭐⭐⭐ | ⭐⭐⭐⭐ | ⭐⭐ | ⭐⭐⭐ |
| **Slippage** | Variable | N/A | Low (stables) | Low |
| **Best For** | Token swaps | Earning yield | Stable swaps | Leverage |

## Security Considerations

⚠️ **Important security practices for DeFi interactions:**

1. **Verify addresses** - Always verify contract addresses before transactions
2. **Slippage protection** - Set appropriate slippage limits
3. **Gas estimation** - Check gas costs before executing
4. **Approval limits** - Use limited token approvals
5. **Test networks** - Test on testnets before mainnet

```typescript
// Safe approval pattern
await defi.approve({
  token: 'USDC',
  spender: uniswapRouterAddress,
  amount: '1000', // Limited approval, not unlimited
});
```

## See Also

- [Uniswap V3](./uniswap-v3.md) - DEX swaps and liquidity
- [Aave V3](./aave.md) - Lending and borrowing
- [Chain Documentation](../chains/overview.md) - Supported networks
- [Security](../security/overview.md) - Best practices
