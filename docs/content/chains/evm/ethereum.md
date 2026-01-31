---
title: "Ethereum"
description: "Ethereum mainnet configuration and details"
category: "chains/evm"
keywords: ["ethereum", "eth", "mainnet", "evm"]
order: 1
---

# Ethereum

Ethereum is the original smart contract platform and the largest DeFi ecosystem.

## Network Details

| Property | Value |
|----------|-------|
| **Chain ID** | 1 |
| **CAIP-2** | `eip155:1` |
| **Native Token** | ETH |
| **Block Time** | ~12 seconds |
| **Finality** | ~15 minutes (32 epochs) |
| **Consensus** | Proof of Stake |

## RPC Endpoints

### Public RPCs (Rate Limited)

```bash
https://eth.llamarpc.com
https://rpc.ankr.com/eth
https://ethereum.publicnode.com
```

### Provider RPCs (Recommended)

```bash
# Alchemy
https://eth-mainnet.g.alchemy.com/v2/YOUR_KEY

# Infura
https://mainnet.infura.io/v3/YOUR_KEY

# QuickNode
https://YOUR_SUBDOMAIN.quiknode.pro/YOUR_KEY/
```

## Configuration

```typescript
import { createPublicClient, http } from 'viem';
import { mainnet } from 'viem/chains';

const client = createPublicClient({
  chain: mainnet,
  transport: http(process.env.ETHEREUM_RPC_URL),
});
```

## Common Contract Addresses

### Tokens

| Token | Address |
|-------|---------|
| WETH | `0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2` |
| USDC | `0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48` |
| USDT | `0xdAC17F958D2ee523a2206206994597C13D831ec7` |
| DAI | `0x6B175474E89094C44Da98b954EescdeCB5BE3830` |
| WBTC | `0x2260FAC5E5542a773Aa44fBCfeDf7C193bc2C599` |

### DeFi Protocols

| Protocol | Contract |
|----------|----------|
| Uniswap V3 Router | `0xE592427A0AEce92De3Edee1F18E0157C05861564` |
| Aave V3 Pool | `0x87870Bca3F3fD6335C3F4ce8392D69350B4fA4E2` |
| Compound V3 USDC | `0xc3d688B66703497DAA19211EEdff47f25384cdc3` |
| Lido stETH | `0xae7ab96520DE3A18E5e111B5EaAb095312D7fE84` |

### Other

| Contract | Address |
|----------|---------|
| ENS Registry | `0x00000000000C2E074eC69A0dFb2997BA6C7d2e1e` |
| Multicall3 | `0xcA11bde05977b3631167028862bE2a173976CA11` |

## Gas Estimation

Current gas prices vary significantly. Use priority fees for faster inclusion:

```typescript
const gasPrice = await client.getGasPrice();
const maxPriorityFee = await client.estimateMaxPriorityFeePerGas();

// For time-sensitive transactions
const fastGas = {
  maxFeePerGas: gasPrice + maxPriorityFee * 2n,
  maxPriorityFeePerGas: maxPriorityFee * 2n,
};
```

## Block Explorers

- **Etherscan**: [etherscan.io](https://etherscan.io)
- **Blockscout**: [eth.blockscout.com](https://eth.blockscout.com)

## See Also

- [Chain Overview](../overview.md)
- [Arbitrum](./arbitrum.md) - L2 with lower fees
- [Base](./base.md) - L2 with Coinbase ecosystem
