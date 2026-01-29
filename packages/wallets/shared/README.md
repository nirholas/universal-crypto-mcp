# @universal-crypto-mcp/wallets-shared

Shared interfaces, types, and utilities for wallet packages in Universal Crypto MCP.

## Installation

```bash
pnpm add @universal-crypto-mcp/wallets-shared
```

## Usage

### Interfaces

```typescript
import type { 
  WalletProvider, 
  Balance, 
  TransactionResult,
  TransactionRequest,
  TypedData,
} from "@universal-crypto-mcp/wallets-shared";

// Implement the WalletProvider interface
class MyWallet implements WalletProvider {
  readonly chain: string;
  readonly address: string;
  
  async getBalance(): Promise<Balance> {
    // Implementation
  }
  
  // ... other methods
}
```

### Zod Schemas

```typescript
import { 
  BalanceRequestSchema,
  TransferRequestSchema,
  SignMessageRequestSchema,
} from "@universal-crypto-mcp/wallets-shared";

// Validate input
const result = TransferRequestSchema.safeParse(input);
if (result.success) {
  const { to, amount, token } = result.data;
}
```

### Utilities

```typescript
import {
  formatBalance,
  parseAmount,
  weiToEther,
  etherToWei,
  lamportsToSol,
  solToLamports,
  truncateAddress,
  isValidEVMAddress,
  isValidSolanaAddress,
  getChainType,
} from "@universal-crypto-mcp/wallets-shared";

// Format balance
const formatted = formatBalance(1000000000000000000n, 18); // "1"

// Parse amount
const raw = parseAmount("1.5", 18); // 1500000000000000000n

// Truncate address
const short = truncateAddress("0x1234567890abcdef1234567890abcdef12345678");
// "0x1234...5678"

// Validate addresses
isValidEVMAddress("0x..."); // true/false
isValidSolanaAddress("..."); // true/false

// Get chain type
getChainType("eip155:1"); // "evm"
getChainType("solana:mainnet"); // "solana"
```

## Exports

### Interfaces

- `WalletProvider` - Common wallet interface
- `Balance` - Token balance
- `TransactionResult` - Transaction result
- `TransactionRequest` - Transaction request
- `TypedData` - EIP-712 typed data
- `WalletConfig` - Wallet configuration
- `WalletFactory` - Wallet factory
- `TokenMetadata` - Token metadata
- `NFTMetadata` - NFT metadata

### Schemas

- `BalanceRequestSchema`
- `TransferRequestSchema`
- `SignMessageRequestSchema`
- `SignTypedDataRequestSchema`
- `SendTransactionRequestSchema`
- `TokenInfoRequestSchema`
- `ListTokensRequestSchema`
- `NFTInfoRequestSchema`
- `TransferNFTRequestSchema`
- `ListNFTsRequestSchema`
- `WalletConfigSchema`
- `EVMAddressSchema`
- `SolanaAddressSchema`

### Utilities

- `formatBalance` - Format raw balance
- `parseAmount` - Parse amount string
- `weiToEther` / `etherToWei` - ETH conversions
- `lamportsToSol` / `solToLamports` - SOL conversions
- `truncateAddress` - Shorten address
- `isValidEVMAddress` - Validate EVM address
- `isValidSolanaAddress` - Validate Solana address
- `getChainType` - Get chain type from ID
- `isHexString` - Check hex string
- `ensureHex` - Ensure 0x prefix
- `sleep` - Async delay
- `retry` - Retry with backoff

## License

Apache-2.0
