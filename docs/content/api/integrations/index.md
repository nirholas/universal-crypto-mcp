---
title: "Integrations API Reference"
description: "API documentation for third-party integrations and chain connectors"
category: "api"
keywords: ["api", "integrations", "chains", "ethereum", "solana", "ton"]
order: 13
---

# Integrations API Reference

Integration packages provide connectors for various blockchains, protocols, and third-party services.

## Packages

| Package | Description |
|---------|-------------|
| `@nirholas/integrations-ethereum` | Ethereum/EVM chains |
| `@nirholas/integrations-solana` | Solana network |
| `@nirholas/integrations-ton` | TON blockchain |
| `@nirholas/integrations-bitcoin` | Bitcoin network |
| `@nirholas/integrations-cosmos` | Cosmos ecosystem |

---

## Ethereum Integration

### Installation

```bash
pnpm add @nirholas/integrations-ethereum
```

### Configuration

```typescript
import { EthereumClient } from '@nirholas/integrations-ethereum'

const ethereum = new EthereumClient({
  rpcUrl: process.env.ETH_RPC_URL!,
  chainId: 1,
  privateKey: process.env.PRIVATE_KEY, // Optional
})
```

### Provider Functions

#### getBlock

Get block information.

```typescript
async function getBlock(
  blockNumber: number | 'latest'
): Promise<Block>

interface Block {
  number: number
  hash: string
  timestamp: number
  transactions: string[]
  gasUsed: bigint
  gasLimit: bigint
  baseFeePerGas?: bigint
  miner: string
}
```

#### getTransaction

Get transaction details.

```typescript
async function getTransaction(hash: string): Promise<Transaction>

interface Transaction {
  hash: string
  from: string
  to: string
  value: bigint
  gasLimit: bigint
  gasPrice?: bigint
  maxFeePerGas?: bigint
  maxPriorityFeePerGas?: bigint
  nonce: number
  data: string
  blockNumber: number
  blockHash: string
  status: 'pending' | 'success' | 'failed'
}
```

#### getBalance

Get ETH balance.

```typescript
async function getBalance(address: string): Promise<bigint>
```

#### call

Execute a contract call (read-only).

```typescript
async function call(params: CallParams): Promise<string>

interface CallParams {
  to: string
  data: string
  from?: string
  blockTag?: number | 'latest'
}
```

#### sendTransaction

Send a signed transaction.

```typescript
async function sendTransaction(tx: TransactionRequest): Promise<TransactionReceipt>

interface TransactionRequest {
  to: string
  value?: bigint
  data?: string
  gasLimit?: bigint
  maxFeePerGas?: bigint
  maxPriorityFeePerGas?: bigint
  nonce?: number
}

interface TransactionReceipt {
  transactionHash: string
  blockNumber: number
  gasUsed: bigint
  effectiveGasPrice: bigint
  status: 'success' | 'failed'
  logs: Log[]
}
```

---

### Contract Interaction

```typescript
// Create contract instance
const contract = ethereum.contract({
  address: '0x...',
  abi: [...],
})

// Read functions
const balance = await contract.read.balanceOf(['0xAddress'])
const name = await contract.read.name()

// Write functions
const tx = await contract.write.transfer(['0xRecipient', BigInt(1000)])

// Events
contract.on('Transfer', (from, to, value) => {
  console.log(`Transfer: ${from} -> ${to}: ${value}`)
})

// Get past events
const events = await contract.getPastEvents('Transfer', {
  fromBlock: 'latest' - 1000,
  toBlock: 'latest',
})
```

---

### Multi-chain Support

```typescript
import { 
  createEthereumClient,
  createPolygonClient,
  createArbitrumClient,
  createBaseClient,
  createOptimismClient,
} from '@nirholas/integrations-ethereum'

const chains = {
  ethereum: createEthereumClient({ rpcUrl: process.env.ETH_RPC! }),
  polygon: createPolygonClient({ rpcUrl: process.env.POLYGON_RPC! }),
  arbitrum: createArbitrumClient({ rpcUrl: process.env.ARB_RPC! }),
  base: createBaseClient({ rpcUrl: process.env.BASE_RPC! }),
  optimism: createOptimismClient({ rpcUrl: process.env.OP_RPC! }),
}

// Use any chain
const ethBalance = await chains.ethereum.getBalance(address)
const arbBalance = await chains.arbitrum.getBalance(address)
```

---

## Solana Integration

### Installation

```bash
pnpm add @nirholas/integrations-solana
```

### Configuration

```typescript
import { SolanaClient } from '@nirholas/integrations-solana'

const solana = new SolanaClient({
  rpcUrl: process.env.SOLANA_RPC_URL!,
  commitment: 'confirmed',
  keypair: process.env.SOLANA_KEYPAIR, // Optional
})
```

### Account Functions

#### getBalance

Get SOL balance.

```typescript
async function getBalance(address: string): Promise<number>

const balance = await solana.getBalance('SoLaNaAdDrEsS...')
console.log(`Balance: ${balance} SOL`)
```

#### getTokenBalance

Get SPL token balance.

```typescript
async function getTokenBalance(
  owner: string,
  mint: string
): Promise<TokenBalance>

interface TokenBalance {
  amount: string
  decimals: number
  uiAmount: number
}
```

#### getAccountInfo

Get account information.

```typescript
async function getAccountInfo(address: string): Promise<AccountInfo>

interface AccountInfo {
  lamports: number
  owner: string
  executable: boolean
  data: Buffer
  rentEpoch: number
}
```

### Transaction Functions

#### sendTransaction

Send a transaction.

```typescript
async function sendTransaction(
  instructions: TransactionInstruction[],
  options?: TransactionOptions
): Promise<string> // Returns signature

interface TransactionOptions {
  signers?: Keypair[]
  commitment?: Commitment
  skipPreflight?: boolean
  maxRetries?: number
}
```

#### getTransaction

Get transaction details.

```typescript
async function getTransaction(
  signature: string
): Promise<TransactionResponse>
```

### Token Operations

```typescript
// Create token
const mint = await solana.createToken({
  decimals: 9,
  name: 'My Token',
  symbol: 'MTK',
})

// Mint tokens
await solana.mintTokens({
  mint: mint.address,
  destination: walletAddress,
  amount: 1000000000, // 1 token with 9 decimals
})

// Transfer tokens
await solana.transferTokens({
  mint: tokenMint,
  from: sourceWallet,
  to: destinationAddress,
  amount: 1000000,
})
```

---

## TON Integration

### Installation

```bash
pnpm add @nirholas/integrations-ton
```

### Configuration

```typescript
import { TonClient } from '@nirholas/integrations-ton'

const ton = new TonClient({
  endpoint: process.env.TON_ENDPOINT!,
  apiKey: process.env.TON_API_KEY,
})
```

### Wallet Operations

```typescript
// Create wallet
const wallet = await ton.createWallet()
console.log(wallet.address)

// Get balance
const balance = await ton.getBalance(address)

// Send TON
const tx = await ton.sendTon({
  to: recipientAddress,
  amount: '1.5', // TON
  comment: 'Payment for services',
})

// Get transactions
const transactions = await ton.getTransactions(address, { limit: 10 })
```

### Jettons (TON Tokens)

```typescript
// Get Jetton balance
const balance = await ton.getJettonBalance(ownerAddress, jettonMaster)

// Transfer Jettons
await ton.transferJetton({
  jettonMaster,
  to: recipientAddress,
  amount: '100',
})

// Get Jetton info
const info = await ton.getJettonInfo(jettonMaster)
console.log(info.name, info.symbol, info.totalSupply)
```

### NFTs

```typescript
// Get NFT items
const items = await ton.getNFTItems(collectionAddress)

// Transfer NFT
await ton.transferNFT({
  itemAddress: nftAddress,
  to: newOwnerAddress,
})

// Get NFT metadata
const metadata = await ton.getNFTMetadata(itemAddress)
```

---

## Bitcoin Integration

### Installation

```bash
pnpm add @nirholas/integrations-bitcoin
```

### Configuration

```typescript
import { BitcoinClient } from '@nirholas/integrations-bitcoin'

const bitcoin = new BitcoinClient({
  network: 'mainnet', // or 'testnet'
  rpcUrl: process.env.BTC_RPC_URL,
  apiKey: process.env.BLOCKSTREAM_API_KEY,
})
```

### Address Functions

```typescript
// Get balance
const balance = await bitcoin.getBalance(address)
console.log(`Balance: ${balance.confirmed} sats`)

// Get UTXOs
const utxos = await bitcoin.getUTXOs(address)

// Get address transactions
const txs = await bitcoin.getAddressTransactions(address, { limit: 10 })
```

### Transaction Functions

```typescript
// Create transaction
const psbt = await bitcoin.createTransaction({
  inputs: utxos,
  outputs: [
    { address: recipientAddress, value: 100000 }, // sats
  ],
  changeAddress: myAddress,
  feeRate: 10, // sats/vB
})

// Sign and broadcast
const signedPsbt = await bitcoin.signTransaction(psbt, privateKey)
const txid = await bitcoin.broadcastTransaction(signedPsbt)

// Get transaction
const tx = await bitcoin.getTransaction(txid)
```

---

## Cosmos Integration

### Installation

```bash
pnpm add @nirholas/integrations-cosmos
```

### Configuration

```typescript
import { CosmosClient } from '@nirholas/integrations-cosmos'

const cosmos = new CosmosClient({
  rpcUrl: process.env.COSMOS_RPC_URL!,
  chainId: 'cosmoshub-4',
  prefix: 'cosmos',
})
```

### Account Functions

```typescript
// Get balance
const balances = await cosmos.getBalances(address)

// Get account info
const account = await cosmos.getAccount(address)

// Get delegations
const delegations = await cosmos.getDelegations(address)

// Get rewards
const rewards = await cosmos.getRewards(address)
```

### Transaction Functions

```typescript
// Send tokens
const tx = await cosmos.send({
  to: recipientAddress,
  amount: [{ denom: 'uatom', amount: '1000000' }],
  memo: 'Payment',
})

// Delegate
await cosmos.delegate({
  validator: validatorAddress,
  amount: { denom: 'uatom', amount: '1000000' },
})

// Undelegate
await cosmos.undelegate({
  validator: validatorAddress,
  amount: { denom: 'uatom', amount: '1000000' },
})

// Claim rewards
await cosmos.claimRewards(validatorAddress)
```

### IBC Transfers

```typescript
// IBC transfer
await cosmos.ibcTransfer({
  sourceChannel: 'channel-0',
  token: { denom: 'uatom', amount: '1000000' },
  receiver: osmosisAddress,
  timeoutHeight: { revisionNumber: 1, revisionHeight: 5000000 },
})
```

---

## Multi-Chain Utilities

### Installation

```bash
pnpm add @nirholas/integrations-core
```

### Universal Interface

```typescript
import { UniversalClient } from '@nirholas/integrations-core'

const client = new UniversalClient({
  chains: {
    ethereum: { rpcUrl: process.env.ETH_RPC! },
    solana: { rpcUrl: process.env.SOL_RPC! },
    ton: { endpoint: process.env.TON_RPC! },
  },
})

// Use unified interface
const ethBalance = await client.getBalance('ethereum', ethAddress)
const solBalance = await client.getBalance('solana', solAddress)
const tonBalance = await client.getBalance('ton', tonAddress)

// Send across chains
await client.send('ethereum', {
  to: recipient,
  amount: '0.1',
  asset: 'ETH',
})
```

---

## Error Types

```typescript
class IntegrationError extends Error {
  code: string
  chain: string
}

// Connection errors
class RPCError extends IntegrationError {}
class TimeoutError extends IntegrationError {}
class RateLimitError extends IntegrationError {}

// Transaction errors
class TransactionError extends IntegrationError {}
class InsufficientFundsError extends IntegrationError {}
class InvalidAddressError extends IntegrationError {}
class NonceError extends IntegrationError {}

// Contract errors
class ContractError extends IntegrationError {}
class RevertError extends IntegrationError {}

// Chain-specific errors
class GasEstimationError extends IntegrationError {}
class SimulationError extends IntegrationError {}
```

---

## Type Exports

```typescript
export type {
  // Ethereum
  Block,
  Transaction,
  TransactionReceipt,
  Log,
  
  // Solana
  AccountInfo,
  TokenBalance,
  TransactionInstruction,
  
  // TON
  JettonInfo,
  NFTItem,
  
  // Bitcoin
  UTXO,
  PSBT,
  
  // Cosmos
  Coin,
  Delegation,
  
  // Universal
  ChainConfig,
  UniversalBalance,
}
```
