---
title: "Base"
description: "Base L2 network configuration and details"
category: "chains/evm"
keywords: ["base", "l2", "coinbase", "optimism"]
order: 2
---

# Base

Base is a secure, low-cost, developer-friendly Ethereum L2 built on the OP Stack by Coinbase.

## Network Details

| Property | Value |
|----------|-------|
| **Chain ID** | 8453 |
| **CAIP-2** | `eip155:8453` |
| **Native Token** | ETH |
| **Block Time** | ~2 seconds |
| **Finality** | ~15 minutes (L1 confirmation) |
| **Stack** | OP Stack (Optimistic Rollup) |

## Why Base?

- **Low fees**: ~$0.001 per transaction
- **Fast**: 2-second block times
- **Coinbase ecosystem**: Direct fiat on/off ramps
- **EVM compatible**: Deploy Ethereum contracts unchanged
- **Growing DeFi**: Uniswap, Aave, and more

## RPC Endpoints

### Public RPCs

```bash
https://mainnet.base.org
https://base.llamarpc.com
https://base.publicnode.com
```

### Provider RPCs (Recommended)

```bash
# Alchemy
https://base-mainnet.g.alchemy.com/v2/YOUR_KEY

# Infura
https://base-mainnet.infura.io/v3/YOUR_KEY

# QuickNode
https://YOUR_SUBDOMAIN.base-mainnet.quiknode.pro/YOUR_KEY/
```

## Configuration

```typescript
import { createPublicClient, http } from 'viem';
import { base } from 'viem/chains';

const client = createPublicClient({
  chain: base,
  transport: http(process.env.BASE_RPC_URL),
});
```

## Common Contract Addresses

### Tokens

| Token | Address |
|-------|---------|
| WETH | `0x4200000000000000000000000000000000000006` |
| USDC | `0x833589fCD6eDb6E08f4c7C32D4f71b54bdA02913` |
| USDbC (Bridged) | `0xd9aAEc86B65D86f6A7B5B1b0c42FFA531710b6CA` |
| DAI | `0x50c5725949A6F0c72E6C4a641F24049A917DB0Cb` |
| cbETH | `0x2Ae3F1Ec7F1F5012CFEab0185bfc7aa3cf0DEc22` |

### DeFi Protocols

| Protocol | Contract |
|----------|----------|
| Uniswap V3 Router | `0x2626664c2603336E57B271c5C0b26F421741e481` |
| Aave V3 Pool | `0xA238Dd80C259a72e81d7e4664a9801593F98d1c5` |
| Compound V3 USDC | `0xb125E6687d4313864e53df431d5425969c15Eb2F` |

### Bridge & Infrastructure

| Contract | Address |
|----------|---------|
| L1 Standard Bridge | `0x3154Cf16ccdb4C6d922629664174b904d80F2C35` |
| L2 Standard Bridge | `0x4200000000000000000000000000000000000010` |
| Multicall3 | `0xcA11bde05977b3631167028862bE2a173976CA11` |

## Bridging

### Official Bridge

Use the official Base Bridge for ETH and supported tokens:

```typescript
import { baseBridge } from '@universal-crypto-mcp/core';

// Bridge ETH from Ethereum to Base
await baseBridge.deposit({
  amount: '0.1', // ETH
  recipient: '0xYourAddress',
});

// Bridge back to Ethereum (7-day withdrawal)
await baseBridge.withdraw({
  amount: '0.1',
  recipient: '0xYourAddress',
});
```

### Third-Party Bridges

For faster withdrawals, use these bridges:
- **Hop Protocol**: ~minutes
- **Across**: ~minutes
- **Stargate**: ~minutes

## Gas Optimization

Base has very low gas costs. Typical transaction costs:

| Operation | Gas | Cost (approx) |
|-----------|-----|---------------|
| ETH Transfer | 21,000 | $0.001 |
| ERC20 Transfer | 65,000 | $0.003 |
| Uniswap Swap | 150,000 | $0.007 |
| NFT Mint | 100,000 | $0.005 |

## x402 on Base

Base is the recommended network for x402 payments due to low fees:

```typescript
const routes = {
  'GET /api/data': {
    accepts: {
      scheme: 'exact',
      network: 'eip155:8453', // Base
      payTo: '0xYourAddress',
      price: '$0.01',
    },
  },
};
```

## Block Explorers

- **BaseScan**: [basescan.org](https://basescan.org)
- **Blockscout**: [base.blockscout.com](https://base.blockscout.com)

## Testnet (Base Sepolia)

| Property | Value |
|----------|-------|
| **Chain ID** | 84532 |
| **CAIP-2** | `eip155:84532` |
| **RPC** | `https://sepolia.base.org` |
| **Faucet** | [faucet.quicknode.com/base/sepolia](https://faucet.quicknode.com/base/sepolia) |

## See Also

- [Chain Overview](../overview.md)
- [Ethereum](./ethereum.md) - L1 network
- [Arbitrum](./arbitrum.md) - Alternative L2
