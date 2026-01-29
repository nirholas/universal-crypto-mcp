# @boosty/mcp-wallets

MCP server for wallet analytics, portfolio tracking, and balance data.

## Features

- **getWalletPortfolio** - Complete portfolio overview across multiple chains
- **getTokenBalances** - ERC20 token balances for a specific chain
- **getNFTs** - NFT holdings with collection info and floor prices
- **getDeFiPositions** - DeFi positions (lending, staking, LP, farming)
- **getWalletHistory** - Transaction history
- **getApprovals** - Token approvals for security auditing
- **resolveENS** - ENS name resolution and reverse lookup

## Installation

```bash
pnpm install
pnpm build
```

## Configuration

Required environment variables:
- `ALCHEMY_API_KEY` - Alchemy API key for blockchain data

Optional environment variables:
- `DEBANK_API_KEY` - DeBank API key for DeFi positions
- `ETHERSCAN_API_KEY` - Etherscan API key for approvals data
- `COVALENT_API_KEY` - Covalent API key (alternative data source)

## Usage

### As MCP Server

```bash
# Start the MCP server
pnpm start

# Or run directly
npx boosty-mcp-wallets
```

### MCP Client Configuration

Add to your MCP client configuration:

```json
{
  "mcpServers": {
    "wallets": {
      "command": "npx",
      "args": ["boosty-mcp-wallets"],
      "env": {
        "ALCHEMY_API_KEY": "your-api-key"
      }
    }
  }
}
```

### Programmatic Usage

```typescript
import { 
  getWalletPortfolio,
  getTokenBalances,
  resolveENS 
} from '@boosty/mcp-wallets';

// Get portfolio
const portfolio = await getWalletPortfolio({
  address: '0xd8dA6BF26964aF9D7eEd9e03E53415D37aA96045',
  chains: ['ethereum', 'arbitrum'],
});

// Get token balances
const balances = await getTokenBalances({
  address: '0xd8dA6BF26964aF9D7eEd9e03E53415D37aA96045',
  chain: 'ethereum',
});

// Resolve ENS
const ens = await resolveENS({ name: 'vitalik.eth' });
```

## Tools Reference

### getWalletPortfolio

Get complete portfolio overview for a wallet.

**Input:**
- `address` (required): Wallet address or ENS name
- `chains` (optional): Array of chain identifiers

**Output:**
```json
{
  "address": "0x...",
  "totalValue": 12345.67,
  "tokens": [
    { "symbol": "ETH", "balance": "1.5", "value": 3000, "chain": "ethereum" }
  ],
  "lastUpdated": "2024-01-01T00:00:00Z"
}
```

### getTokenBalances

Get token balances for a specific chain.

**Input:**
- `address` (required): Wallet address
- `chain` (required): Chain identifier (ethereum, arbitrum, polygon, etc.)

**Output:**
```json
{
  "address": "0x...",
  "chain": "ethereum",
  "tokens": [
    { "token": "0x...", "symbol": "USDC", "balance": "1000", "decimals": 6, "value": 1000 }
  ]
}
```

### getNFTs

Get NFTs owned by a wallet.

**Input:**
- `address` (required): Wallet address
- `chain` (optional): Chain filter

**Output:**
```json
{
  "nfts": [
    {
      "collection": "Bored Ape Yacht Club",
      "tokenId": "1234",
      "name": "BAYC #1234",
      "imageUrl": "https://...",
      "floorPrice": 30.5
    }
  ]
}
```

### getDeFiPositions

Get DeFi positions for a wallet.

**Input:**
- `address` (required): Wallet address
- `chains` (optional): Array of chain identifiers

**Output:**
```json
{
  "positions": [
    {
      "protocol": "Aave V3",
      "type": "lending",
      "tokens": [{ "symbol": "USDC", "balance": "1000", "value": 1000 }],
      "value": 1000,
      "apy": 3.5
    }
  ]
}
```

### getWalletHistory

Get transaction history for a wallet.

**Input:**
- `address` (required): Wallet address
- `chain` (required): Chain identifier
- `limit` (optional): Max transactions (default: 50)

**Output:**
```json
{
  "transactions": [
    {
      "hash": "0x...",
      "type": "transfer",
      "from": "0x...",
      "to": "0x...",
      "value": "1.0",
      "timestamp": 1704067200,
      "status": "success"
    }
  ]
}
```

### getApprovals

Get token approvals for security auditing.

**Input:**
- `address` (required): Wallet address
- `chain` (required): Chain identifier

**Output:**
```json
{
  "approvals": [
    {
      "token": "USDC",
      "spender": "0x...",
      "spenderName": "Uniswap V3",
      "allowance": "unlimited",
      "isUnlimited": true
    }
  ]
}
```

### resolveENS

Resolve ENS name to address or reverse lookup.

**Input:**
- `name` (optional): ENS name to resolve
- `address` (optional): Address for reverse lookup

**Output:**
```json
{
  "name": "vitalik.eth",
  "address": "0xd8dA6BF26964aF9D7eEd9e03E53415D37aA96045",
  "avatar": "https://..."
}
```

## Development

```bash
# Run tests
pnpm test

# Run tests with coverage
pnpm test:coverage

# Build
pnpm build

# Development mode
pnpm dev
```

## License

MIT
