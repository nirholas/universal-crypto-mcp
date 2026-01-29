# Supported Networks

x402-deploy supports multiple blockchain networks for receiving payments.

---

## Quick Reference

| Network | Chain ID (CAIP-2) | Status | Gas Cost | Speed |
|---------|-------------------|--------|----------|-------|
| **Base** | `eip155:8453` | ✅ Recommended | ~$0.001 | ~2s |
| **Arbitrum One** | `eip155:42161` | ✅ Production | ~$0.01 | ~1s |
| **Optimism** | `eip155:10` | ✅ Production | ~$0.001 | ~2s |
| **Polygon** | `eip155:137` | ✅ Production | ~$0.01 | ~2s |
| **Ethereum** | `eip155:1` | ✅ Production | ~$5-50 | ~12s |
| **Base Sepolia** | `eip155:84532` | ✅ Testnet | Free | ~2s |
| **Arbitrum Sepolia** | `eip155:421614` | ✅ Testnet | Free | ~1s |

---

## Recommended: Base

Base is the recommended network for x402 payments due to:

- **Low gas costs**: ~$0.001 per transaction
- **Fast confirmations**: ~2 seconds
- **Coinbase backing**: Strong ecosystem support
- **Native USDC**: Official Circle USDC deployment

### Configuration

```json
{
  "payment": {
    "network": "eip155:8453",
    "token": "USDC"
  }
}
```

### USDC Contract on Base

```
Address: 0x833589fCD6eDb6E08f4c7C32D4f71b54bdA02913
Decimals: 6
```

---

## Network Details

### Base (eip155:8453)

**L2 Rollup on Ethereum**

| Property | Value |
|----------|-------|
| Chain ID | 8453 |
| CAIP-2 | `eip155:8453` |
| Native Token | ETH |
| Block Time | ~2 seconds |
| Explorer | [basescan.org](https://basescan.org) |

**Token Addresses:**
```
USDC: 0x833589fCD6eDb6E08f4c7C32D4f71b54bdA02913
WETH: 0x4200000000000000000000000000000000000006
DAI:  0x50c5725949A6F0c72E6C4a641F24049A917DB0Cb
```

### Arbitrum One (eip155:42161)

**L2 Rollup on Ethereum**

| Property | Value |
|----------|-------|
| Chain ID | 42161 |
| CAIP-2 | `eip155:42161` |
| Native Token | ETH |
| Block Time | ~1 second |
| Explorer | [arbiscan.io](https://arbiscan.io) |

**Token Addresses:**
```
USDC:   0xaf88d065e77c8cC2239327C5EDb3A432268e5831 (Native)
USDC.e: 0xFF970A61A04b1cA14834A43f5dE4533eBDDB5CC8 (Bridged)
USDT:   0xFd086bC7CD5C481DCC9C85ebE478A1C0b69FCbb9
DAI:    0xDA10009cBd5D07dd0CeCc66161FC93D7c9000da1
```

### Optimism (eip155:10)

**L2 Rollup on Ethereum**

| Property | Value |
|----------|-------|
| Chain ID | 10 |
| CAIP-2 | `eip155:10` |
| Native Token | ETH |
| Block Time | ~2 seconds |
| Explorer | [optimistic.etherscan.io](https://optimistic.etherscan.io) |

**Token Addresses:**
```
USDC:   0x0b2C639c533813f4Aa9D7837CAf62653d097Ff85 (Native)
USDC.e: 0x7F5c764cBc14f9669B88837ca1490cCa17c31607 (Bridged)
USDT:   0x94b008aA00579c1307B0EF2c499aD98a8ce58e58
DAI:    0xDA10009cBd5D07dd0CeCc66161FC93D7c9000da1
```

### Polygon (eip155:137)

**Sidechain**

| Property | Value |
|----------|-------|
| Chain ID | 137 |
| CAIP-2 | `eip155:137` |
| Native Token | MATIC |
| Block Time | ~2 seconds |
| Explorer | [polygonscan.com](https://polygonscan.com) |

**Token Addresses:**
```
USDC:   0x3c499c542cEF5E3811e1192ce70d8cC03d5c3359 (Native)
USDC.e: 0x2791Bca1f2de4661ED88A30C99A7a9449Aa84174 (Bridged)
USDT:   0xc2132D05D31c914a87C6611C10748AEb04B58e8F
DAI:    0x8f3Cf7ad23Cd3CaDbD9735AFf958023239c6A063
```

### Ethereum Mainnet (eip155:1)

**L1 - High gas costs, use for high-value transactions only**

| Property | Value |
|----------|-------|
| Chain ID | 1 |
| CAIP-2 | `eip155:1` |
| Native Token | ETH |
| Block Time | ~12 seconds |
| Explorer | [etherscan.io](https://etherscan.io) |

**Token Addresses:**
```
USDC: 0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48
USDT: 0xdAC17F958D2ee523a2206206994597C13D831ec7
DAI:  0x6B175474E89094C44Da98b954EeseedF85b6F3Ee
```

---

## Testnet Networks

For development and testing, use testnet networks with free tokens.

### Base Sepolia (eip155:84532)

```json
{
  "payment": {
    "network": "eip155:84532",
    "token": "USDC"
  }
}
```

**Faucets:**
- [Base Sepolia Faucet](https://www.coinbase.com/faucets/base-ethereum-goerli-faucet)
- ETH for gas: [Alchemy Faucet](https://sepoliafaucet.com/)

**Token Addresses:**
```
USDC (Test): 0x036CbD53842c5426634e7929541eC2318f3dCF7e
```

### Arbitrum Sepolia (eip155:421614)

```json
{
  "payment": {
    "network": "eip155:421614",
    "token": "USDC"
  }
}
```

**Faucets:**
- [Arbitrum Faucet](https://faucet.arbitrum.io/)

---

## Multi-Network Configuration

Accept payments on multiple networks:

```json
{
  "payment": {
    "networks": [
      {
        "network": "eip155:8453",
        "token": "USDC",
        "priority": 1
      },
      {
        "network": "eip155:42161",
        "token": "USDC",
        "priority": 2
      },
      {
        "network": "eip155:137",
        "token": "USDC",
        "priority": 3
      }
    ],
    "wallet": "0x742d35Cc6634C0532925a3b844Bc9e7595f0bEb1"
  }
}
```

The same wallet address works across all EVM networks.

---

## RPC Endpoints

### Public RPC Endpoints

| Network | RPC URL |
|---------|---------|
| Base | `https://mainnet.base.org` |
| Arbitrum | `https://arb1.arbitrum.io/rpc` |
| Optimism | `https://mainnet.optimism.io` |
| Polygon | `https://polygon-rpc.com` |
| Ethereum | `https://eth.llamarpc.com` |

### Custom RPC Configuration

```json
{
  "payment": {
    "network": "eip155:8453",
    "rpc": "https://your-custom-rpc.com"
  }
}
```

### Using Alchemy/Infura

```json
{
  "payment": {
    "network": "eip155:8453",
    "rpc": "https://base-mainnet.g.alchemy.com/v2/YOUR_API_KEY"
  }
}
```

---

## Gas Estimation

Typical gas costs for x402 payment verification:

| Network | Typical Gas | Cost (USD) |
|---------|-------------|------------|
| Base | ~50,000 | $0.001 |
| Arbitrum | ~100,000 | $0.01 |
| Optimism | ~50,000 | $0.001 |
| Polygon | ~50,000 | $0.01 |
| Ethereum | ~50,000 | $5-50 |

---

## Bridging Assets

Need to move funds between networks?

### Recommended Bridges

| Bridge | Networks | URL |
|--------|----------|-----|
| **Across** | All L2s | [across.to](https://across.to) |
| **Base Bridge** | ETH ↔ Base | [bridge.base.org](https://bridge.base.org) |
| **Arbitrum Bridge** | ETH ↔ Arbitrum | [bridge.arbitrum.io](https://bridge.arbitrum.io) |
| **Hop** | All L2s | [hop.exchange](https://hop.exchange) |

### USDC Bridge (Circle CCTP)

Circle's official USDC bridge:
- [circle.com/en/cross-chain-transfer-protocol](https://www.circle.com/en/cross-chain-transfer-protocol)

```bash
# No wrapping needed - native USDC on all supported chains
```

---

## Network Selection Guide

### For Startups/Indie Developers

**Use Base**
- Lowest fees
- Fast confirmations
- Growing ecosystem

### For Enterprise

**Use Arbitrum**
- Most liquidity
- DeFi integrations
- Battle-tested security

### For Global Users

**Use Polygon**
- Familiar to web3 users
- Wide wallet support
- Established ecosystem

### For High-Value APIs

**Consider Ethereum Mainnet**
- Maximum security
- Suitable for $100+ transactions
- Most trusted

---

## Coming Soon

| Network | Status | ETA |
|---------|--------|-----|
| Solana | 🔜 | Q2 2024 |
| Avalanche | 🔜 | Q2 2024 |
| zkSync | 🔜 | Q3 2024 |
| Scroll | 🔜 | Q3 2024 |

---

## Next Steps

- [Configuration Guide](configuration.md) - Full config reference
- [Pricing Strategies](pricing.md) - Set up pricing
- [Deployment](deployment.md) - Deploy your API

---

[← Back to Docs](../README.md)
