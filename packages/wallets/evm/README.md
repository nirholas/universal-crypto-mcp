# @universal-crypto-mcp/wallet-evm

EVM wallet tools for Universal Crypto MCP. Supports Ethereum, Polygon, Arbitrum, Base, Optimism, BSC, and more.

## Installation

```bash
pnpm add @universal-crypto-mcp/wallet-evm
```

## Quick Start

```typescript
import { EVMWallet, registerAllEVMTools } from "@universal-crypto-mcp/wallet-evm";
import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";

// Create wallet
const wallet = new EVMWallet({
  privateKey: process.env.EVM_PRIVATE_KEY as `0x${string}`,
  chainId: "eip155:1", // Ethereum mainnet
});

// Get balance
const balance = await wallet.getBalance();
console.log(`Balance: ${balance.formatted} ${balance.symbol}`);

// Transfer ETH
const recipientAddress = "0x742d35Cc6634C0532925a3b844Bc9e7595f0bEb1"; // Replace with actual recipient
const tx = await wallet.transfer(recipientAddress, "0.1");
console.log(`Transaction: ${tx.hash}`);

// Register with MCP server
const server = new McpServer({ name: "evm-wallet" });
registerAllEVMTools(server, wallet);
```

## Supported Chains

| Chain | CAIP-2 ID |
|-------|-----------|
| Ethereum | `eip155:1` |
| Arbitrum | `eip155:42161` |
| Base | `eip155:8453` |
| Base Sepolia | `eip155:84532` |
| Polygon | `eip155:137` |
| Optimism | `eip155:10` |
| BSC | `eip155:56` |

## API

### EVMWallet

```typescript
class EVMWallet implements WalletProvider {
  constructor(config: EVMWalletConfig);
  
  // Properties
  readonly chain: string;
  readonly address: string;
  
  // Balance
  getBalance(): Promise<Balance>;
  getBalanceOf(address: string): Promise<Balance>;
  getTokenBalance(tokenAddress: string): Promise<Balance>;
  getTokenInfo(tokenAddress: string): Promise<ERC20Token>;
  
  // Transfers
  transfer(to: string, amount: string, options?: TransactionOptions): Promise<TransactionResult>;
  transferToken(tokenAddress: string, to: string, amount: string, options?: TransactionOptions): Promise<TransactionResult>;
  
  // Signing
  signMessage(message: string): Promise<string>;
  signTypedData(data: TypedData): Promise<string>;
  
  // Transactions
  sendTransaction(tx: TransactionRequest, options?: TransactionOptions): Promise<TransactionResult>;
  waitForTransaction(hash: string): Promise<TransactionResult>;
  estimateGas(tx: TransactionRequest): Promise<GasEstimate>;
  
  // Utilities
  getNonce(): Promise<number>;
  getChainId(): number;
  getPublicClient(): PublicClient;
  getWalletClient(): WalletClient;
}
```

## MCP Tools

| Tool | Description |
|------|-------------|
| `evm_get_balance` | Get native token balance |
| `evm_get_token_balance` | Get ERC20 token balance |
| `evm_get_token_info` | Get ERC20 token info |
| `evm_transfer` | Transfer native tokens |
| `evm_transfer_token` | Transfer ERC20 tokens |
| `evm_estimate_transfer` | Estimate transfer gas |
| `evm_sign_message` | Sign message (EIP-191) |
| `evm_sign_typed_data` | Sign typed data (EIP-712) |
| `evm_get_address` | Get wallet address |
| `evm_approve_token` | Approve token spending |
| `evm_token_allowance` | Check allowance |
| `evm_get_nft` | Get NFT info |
| `evm_nft_balance` | Get NFT balance |
| `evm_transfer_nft` | Transfer NFT |

## License

Apache-2.0
