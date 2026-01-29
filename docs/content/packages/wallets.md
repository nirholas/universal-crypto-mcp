# Wallets Package

The wallets package provides wallet management for EVM chains and Solana.

## Installation

```bash
npm install @universal-crypto-mcp/wallet-evm
npm install @universal-crypto-mcp/wallet-solana
```

## Supported Networks

### EVM Chains

| Chain | Chain ID | Status |
|-------|----------|--------|
| Ethereum | 1 | ✅ Full support |
| BNB Smart Chain | 56 | ✅ Full support |
| Polygon | 137 | ✅ Full support |
| Arbitrum One | 42161 | ✅ Full support |
| Base | 8453 | ✅ Full support |
| Optimism | 10 | ✅ Full support |
| Avalanche C-Chain | 43114 | ✅ Full support |
| Fantom | 250 | ✅ Full support |
| zkSync Era | 324 | ✅ Full support |
| Linea | 59144 | ✅ Full support |
| Scroll | 534352 | ✅ Full support |
| Blast | 81457 | ✅ Full support |

### Solana

- Mainnet Beta
- Devnet
- Testnet

## Configuration

### Environment Variables

```bash
# EVM Wallet
PRIVATE_KEY=0x...        # Private key
MNEMONIC="word1 word2..."  # Or mnemonic phrase

# Solana Wallet
SOLANA_PRIVATE_KEY=...   # Base58 encoded private key
```

## Available Tools

### Balance Tools

| Tool | Description |
|------|-------------|
| `get_balance` | Get native token balance |
| `get_token_balance` | Get ERC20/SPL token balance |
| `get_portfolio` | Get multi-chain portfolio |
| `get_nfts` | Get NFT holdings |

### Transaction Tools

| Tool | Description |
|------|-------------|
| `send_transaction` | Send native tokens |
| `send_token` | Send ERC20/SPL tokens |
| `get_transaction` | Get transaction details |
| `get_history` | Get transaction history |
| `estimate_gas` | Estimate gas cost |

### Signing Tools

| Tool | Description |
|------|-------------|
| `sign_message` | Sign a message |
| `verify_signature` | Verify a signature |
| `sign_typed_data` | Sign EIP-712 typed data |

### Account Tools

| Tool | Description |
|------|-------------|
| `get_address` | Get wallet address |
| `get_nonce` | Get account nonce |
| `check_allowance` | Check token allowance |
| `approve_token` | Approve token spending |

## Usage Examples

### Create Wallet Instance

```typescript
import { EVMWallet } from "@universal-crypto-mcp/wallet-evm";

const wallet = new EVMWallet({
  privateKey: process.env.PRIVATE_KEY,
  defaultChain: "ethereum",
});

console.log("Address:", wallet.address);
```

### Check Balance

```typescript
// AI command: "What's my ETH balance?"
// Tool called: get_balance
// Parameters:
{
  chain: "ethereum"
}

// Response:
{
  address: "0x1234...5678",
  balance: {
    raw: "1500000000000000000",
    formatted: "1.5",
    symbol: "ETH",
    decimals: 18
  },
  usdValue: 5185.17
}
```

### Get Multi-Chain Portfolio

```typescript
// AI command: "Show my portfolio across all chains"
// Tool called: get_portfolio
// Response:
{
  address: "0x1234...5678",
  totalValueUsd: 12500.00,
  chains: {
    ethereum: {
      native: { symbol: "ETH", balance: "0.5", valueUsd: 1728.39 },
      tokens: [
        { symbol: "USDC", balance: "1000.0", valueUsd: 1000.00 },
        { symbol: "LINK", balance: "50.0", valueUsd: 750.00 }
      ]
    },
    arbitrum: {
      native: { symbol: "ETH", balance: "0.2", valueUsd: 691.36 },
      tokens: [
        { symbol: "ARB", balance: "500.0", valueUsd: 850.00 }
      ]
    }
  }
}
```

### Send Transaction

```typescript
// AI command: "Send 0.1 ETH to 0xabc..."
// Tool called: send_transaction
// Parameters:
{
  to: "0xabc...",
  amount: "0.1",
  chain: "ethereum"
}

// Response:
{
  hash: "0xdef...",
  from: "0x1234...5678",
  to: "0xabc...",
  value: "0.1",
  status: "pending",
  gasUsed: "21000",
  gasPrice: "25000000000"
}
```

### Send ERC20 Token

```typescript
// AI command: "Send 100 USDC to 0xabc..."
// Tool called: send_token
// Parameters:
{
  to: "0xabc...",
  token: "0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48",  // USDC
  amount: "100",
  chain: "ethereum"
}
```

### Sign Message

```typescript
// AI command: "Sign the message 'Hello World'"
// Tool called: sign_message
// Parameters:
{
  message: "Hello World"
}

// Response:
{
  message: "Hello World",
  signature: "0x...",
  address: "0x1234...5678"
}
```

### Approve Token

```typescript
// AI command: "Approve USDC spending on Uniswap"
// Tool called: approve_token
// Parameters:
{
  token: "0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48",
  spender: "0x68b3465833fb72A70ecDF485E0e4C7bD8665Fc45",  // Uniswap Router
  amount: "1000000000000"  // Max approval
}
```

## Solana Wallet

### Create Solana Wallet

```typescript
import { SolanaWallet } from "@universal-crypto-mcp/wallet-solana";

const wallet = new SolanaWallet({
  privateKey: process.env.SOLANA_PRIVATE_KEY,
  network: "mainnet-beta",
});

console.log("Address:", wallet.publicKey.toString());
```

### Solana Balance

```typescript
// AI command: "What's my SOL balance?"
// Tool called: get_balance
// Parameters:
{
  chain: "solana"
}

// Response:
{
  address: "ABC...XYZ",
  balance: {
    raw: "5000000000",
    formatted: "5.0",
    symbol: "SOL",
    decimals: 9
  },
  usdValue: 620.00
}
```

## HD Wallet Support

### Create HD Wallet

```typescript
import { HDWallet } from "@universal-crypto-mcp/wallet-evm";

const hdWallet = new HDWallet({
  mnemonic: process.env.MNEMONIC,
  path: "m/44'/60'/0'/0",
});

// Derive addresses
const address0 = hdWallet.getAddress(0);
const address1 = hdWallet.getAddress(1);
```

## Gas Management

### Estimate Gas

```typescript
// AI command: "How much will it cost to send 1 ETH?"
// Tool called: estimate_gas
// Parameters:
{
  to: "0xabc...",
  value: "1000000000000000000",
  chain: "ethereum"
}

// Response:
{
  gasLimit: 21000,
  gasPrice: {
    slow: "20000000000",    // 20 gwei
    standard: "25000000000", // 25 gwei
    fast: "35000000000"     // 35 gwei
  },
  estimatedCost: {
    slow: "0.00042 ETH ($1.45)",
    standard: "0.000525 ETH ($1.81)",
    fast: "0.000735 ETH ($2.54)"
  }
}
```

## Security Best Practices

1. **Never share private keys**: Store securely using environment variables
2. **Use hardware wallets**: For production deployments
3. **Test on testnets**: Verify transactions before mainnet
4. **Set spending limits**: Limit transaction amounts
5. **Verify addresses**: Always double-check recipient addresses

## Related Packages

- [DeFi Package](defi.md) - DeFi protocol interactions
- [Payments Package](payments.md) - Payment infrastructure
- [Core Package](core.md) - Shared utilities
