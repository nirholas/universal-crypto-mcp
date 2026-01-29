# @universal-crypto-mcp/wallet-solana

Solana wallet tools for Universal Crypto MCP. Supports SOL transfers, SPL tokens, and NFTs.

## Installation

```bash
pnpm add @universal-crypto-mcp/wallet-solana
```

## Quick Start

```typescript
import { SolanaWallet, registerAllSolanaTools, generateSolanaKeypair } from "@universal-crypto-mcp/wallet-solana";
import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";

// Generate new keypair
const keypair = generateSolanaKeypair();
console.log(`Public Key: ${keypair.publicKey}`);

// Create wallet
const wallet = new SolanaWallet({
  privateKey: keypair.privateKey,
  network: "devnet",
});

// Get balance
const balance = await wallet.getBalance();
console.log(`Balance: ${balance.formatted} ${balance.symbol}`);

// Request airdrop (devnet only)
await wallet.requestAirdrop(1);

// Transfer SOL
const recipientPubkey = "DYw8jCTfwHNRJhhmFcbXvVDTqWMEVFBX6ZKUmG5CNSKK"; // Replace with actual recipient
const tx = await wallet.transfer(recipientPubkey, "0.5");
console.log(`Transaction: ${tx.hash}`);

// Register with MCP server
const server = new McpServer({ name: "solana-wallet" });
registerAllSolanaTools(server, wallet);
```

## Supported Networks

| Network | Chain ID |
|---------|----------|
| Mainnet | `solana:mainnet` |
| Devnet | `solana:devnet` |
| Testnet | `solana:testnet` |
| Localnet | `solana:localnet` |

## API

### SolanaWallet

```typescript
class SolanaWallet implements WalletProvider {
  constructor(config: SolanaWalletConfig);
  
  // Properties
  readonly chain: string;
  readonly address: string;
  
  // Balance
  getBalance(): Promise<Balance>;
  getBalanceOf(address: string): Promise<Balance>;
  getTokenBalance(mintAddress: string): Promise<Balance>;
  getTokenInfo(mintAddress: string): Promise<SPLToken>;
  
  // Transfers
  transfer(to: string, amount: string, options?: SolanaTransactionOptions): Promise<TransactionResult>;
  transferToken(mintAddress: string, to: string, amount: string, options?: SolanaTransactionOptions): Promise<TransactionResult>;
  
  // Signing
  signMessage(message: string): Promise<string>;
  
  // Transactions
  sendTransaction(tx: TransactionRequest, options?: SolanaTransactionOptions): Promise<TransactionResult>;
  getTransactionStatus(signature: string): Promise<TransactionResult>;
  
  // Utilities
  getConnection(): Connection;
  getKeypair(): Keypair;
  getPublicKey(): PublicKey;
  getNetwork(): SolanaNetwork;
  requestAirdrop(amount?: number): Promise<TransactionResult>;
  getRecentBlockhash(): Promise<string>;
}
```

### Helper Functions

```typescript
// Generate new keypair
function generateSolanaKeypair(): { publicKey: string; privateKey: string };

// Create wallet from private key
function createSolanaWallet(
  privateKey: string | Uint8Array,
  network?: SolanaNetwork,
  rpcUrl?: string
): SolanaWallet;
```

## MCP Tools

| Tool | Description |
|------|-------------|
| `solana_get_balance` | Get SOL balance |
| `solana_get_token_balance` | Get SPL token balance |
| `solana_get_token_info` | Get SPL token info |
| `solana_transfer` | Transfer SOL |
| `solana_transfer_token` | Transfer SPL tokens |
| `solana_sign_message` | Sign message |
| `solana_get_address` | Get wallet address |
| `solana_get_public_key` | Get public key |
| `solana_get_token_account` | Get ATA address |
| `solana_create_token_account` | Create ATA |
| `solana_get_nft` | Get NFT info |
| `solana_transfer_nft` | Transfer NFT |
| `solana_request_airdrop` | Request airdrop |

## License

Apache-2.0
