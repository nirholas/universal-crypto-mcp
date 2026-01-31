---
title: "Chain Support Overview"
description: "60+ blockchain networks supported by Universal Crypto MCP"
category: "chains"
keywords: ["chains", "networks", "evm", "solana", "multichain"]
order: 1
---

# Supported Chains

Universal Crypto MCP supports 60+ blockchain networks, including EVM chains, Solana, and other major ecosystems.

## Network Summary

| Category | Networks | Status |
|----------|----------|--------|
| **EVM Mainnets** | 40+ | ✅ Production |
| **EVM Testnets** | 15+ | ✅ Available |
| **Solana** | Mainnet, Devnet | ✅ Production |
| **Other L1s** | Aptos, Sui, Near, Cosmos | 🔄 Coming |

## EVM Networks

### Layer 1

| Network | Chain ID | CAIP-2 | Native Token | Explorer |
|---------|----------|--------|--------------|----------|
| Ethereum | 1 | `eip155:1` | ETH | [etherscan.io](https://etherscan.io) |
| BNB Chain | 56 | `eip155:56` | BNB | [bscscan.com](https://bscscan.com) |
| Avalanche C-Chain | 43114 | `eip155:43114` | AVAX | [snowtrace.io](https://snowtrace.io) |
| Fantom | 250 | `eip155:250` | FTM | [ftmscan.com](https://ftmscan.com) |
| Gnosis | 100 | `eip155:100` | xDAI | [gnosisscan.io](https://gnosisscan.io) |

### Layer 2 - Optimistic Rollups

| Network | Chain ID | CAIP-2 | Native Token | Explorer |
|---------|----------|--------|--------------|----------|
| Arbitrum One | 42161 | `eip155:42161` | ETH | [arbiscan.io](https://arbiscan.io) |
| Optimism | 10 | `eip155:10` | ETH | [optimistic.etherscan.io](https://optimistic.etherscan.io) |
| Base | 8453 | `eip155:8453` | ETH | [basescan.org](https://basescan.org) |
| Mantle | 5000 | `eip155:5000` | MNT | [explorer.mantle.xyz](https://explorer.mantle.xyz) |
| Mode | 34443 | `eip155:34443` | ETH | [explorer.mode.network](https://explorer.mode.network) |
| Blast | 81457 | `eip155:81457` | ETH | [blastscan.io](https://blastscan.io) |

### Layer 2 - ZK Rollups

| Network | Chain ID | CAIP-2 | Native Token | Explorer |
|---------|----------|--------|--------------|----------|
| zkSync Era | 324 | `eip155:324` | ETH | [explorer.zksync.io](https://explorer.zksync.io) |
| Polygon zkEVM | 1101 | `eip155:1101` | ETH | [zkevm.polygonscan.com](https://zkevm.polygonscan.com) |
| Linea | 59144 | `eip155:59144` | ETH | [lineascan.build](https://lineascan.build) |
| Scroll | 534352 | `eip155:534352` | ETH | [scrollscan.com](https://scrollscan.com) |

### Other EVM Chains

| Network | Chain ID | CAIP-2 | Native Token | Explorer |
|---------|----------|--------|--------------|----------|
| Polygon | 137 | `eip155:137` | MATIC | [polygonscan.com](https://polygonscan.com) |
| Celo | 42220 | `eip155:42220` | CELO | [celoscan.io](https://celoscan.io) |
| Moonbeam | 1284 | `eip155:1284` | GLMR | [moonscan.io](https://moonscan.io) |
| opBNB | 204 | `eip155:204` | BNB | [opbnbscan.com](https://opbnbscan.com) |

## Non-EVM Networks

### Solana

| Network | CAIP-2 | Status |
|---------|--------|--------|
| Mainnet | `solana:5eykt4UsFv8P8NJdTREpY1vzqKqZKvdp` | ✅ Production |
| Devnet | `solana:EtWTRABZaYq6iMfeYKouRu166VU2xqa1` | ✅ Available |

### Coming Soon

| Network | Status | ETA |
|---------|--------|-----|
| Aptos | 🔄 In Progress | Q2 2026 |
| Sui | 🔄 In Progress | Q2 2026 |
| Near | 📋 Planned | Q3 2026 |
| Cosmos | 📋 Planned | Q3 2026 |

## Quick Start

### Configure RPC Endpoints

```bash
# .env
ETHEREUM_RPC_URL=https://eth-mainnet.g.alchemy.com/v2/YOUR_KEY
ARBITRUM_RPC_URL=https://arb-mainnet.g.alchemy.com/v2/YOUR_KEY
BASE_RPC_URL=https://base-mainnet.g.alchemy.com/v2/YOUR_KEY
OPTIMISM_RPC_URL=https://opt-mainnet.g.alchemy.com/v2/YOUR_KEY
POLYGON_RPC_URL=https://polygon-mainnet.g.alchemy.com/v2/YOUR_KEY
```

### Using Chains in Code

```typescript
import { getChain, getAllChains } from '@universal-crypto-mcp/core';

// Get a specific chain
const ethereum = getChain('ethereum');
console.log(ethereum.chainId); // 1
console.log(ethereum.rpcUrls); // [...]

// Get all supported chains
const chains = getAllChains();
console.log(`${chains.length} chains supported`);

// Filter by type
const l2Chains = chains.filter(c => c.layer === 2);
const evmChains = chains.filter(c => c.type === 'evm');
```

### CAIP-2 Identifiers

We use [CAIP-2](https://github.com/ChainAgnostic/CAIPs/blob/master/CAIPs/caip-2.md) for cross-chain compatibility:

```typescript
// EVM chains use eip155 namespace
const ethereumId = 'eip155:1';
const baseId = 'eip155:8453';

// Solana uses solana namespace
const solanaMainnet = 'solana:5eykt4UsFv8P8NJdTREpY1vzqKqZKvdp';
```

## Chain Selection Guide

### For Low Fees

1. **Base** - ~$0.001 per transaction
2. **Arbitrum** - ~$0.01 per transaction
3. **Polygon** - ~$0.01 per transaction

### For Fast Finality

1. **Solana** - 400ms
2. **Arbitrum** - ~250ms (soft confirmation)
3. **Base** - ~2s

### For DeFi Liquidity

1. **Ethereum** - Highest TVL
2. **Arbitrum** - Growing DeFi ecosystem
3. **Base** - Coinbase ecosystem

### For Gaming/NFTs

1. **Polygon** - Low fees, gaming focus
2. **Base** - NFT marketplace support
3. **Solana** - Fast, low fees

## Gas Estimation

```typescript
import { estimateGas } from '@universal-crypto-mcp/core';

const estimate = await estimateGas({
  chain: 'base',
  transaction: {
    to: '0x...',
    data: '0x...',
    value: 0n,
  },
});

console.log(`Gas: ${estimate.gasLimit}`);
console.log(`Gas Price: ${estimate.gasPrice} gwei`);
console.log(`Cost: ${estimate.costUSD} USD`);
```

## See Also

- [Ethereum](./evm/ethereum.md) - Ethereum mainnet details
- [Base](./evm/base.md) - Base L2 details
- [Solana](./non-evm/solana.md) - Solana details
- [Chain Comparison](./comparison.md) - Side-by-side comparison
