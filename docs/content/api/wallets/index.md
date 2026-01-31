---
title: "Wallets API Reference"
description: "API documentation for wallet and identity packages"
category: "api"
keywords: ["api", "wallets", "evm", "solana", "safe", "ens"]
order: 3
---

# Wallets & Identity API Reference

Wallet packages provide multi-chain wallet functionality for managing keys, signing transactions, and interacting with various blockchain networks.

## Packages

| Package | Description |
|---------|-------------|
| `@nirholas/wallets-evm` | EVM chain wallet management |
| `@nirholas/wallets-solana` | Solana wallet management |
| `@nirholas/wallets-multisig` | Safe/Gnosis multi-sig support |
| `@nirholas/wallets-domain-names` | ENS and domain resolution |
| `@nirholas/wallets-armor` | Wallet security utilities |
| `@nirholas/wallet-protocol` | WalletConnect integration |
| `@nirholas/wallets-shared` | Shared wallet utilities |

---

## EVM Wallets

### Installation

```bash
pnpm add @nirholas/wallets-evm
```

### Wallet Creation

#### createWallet

Create a new HD wallet.

```typescript
function createWallet(): Wallet

interface Wallet {
  address: string
  privateKey: string
  mnemonic: string
  publicKey: string
}
```

**Example:**

```typescript
import { createWallet } from '@nirholas/wallets-evm'

const wallet = createWallet()
console.log('Address:', wallet.address)
console.log('Mnemonic:', wallet.mnemonic) // Store securely!
```

#### fromMnemonic

Restore wallet from mnemonic phrase.

```typescript
function fromMnemonic(mnemonic: string, index?: number): Wallet
```

#### fromPrivateKey

Create wallet from private key.

```typescript
function fromPrivateKey(privateKey: string): Wallet
```

---

### Balance & Token Operations

#### getBalance

Get native token balance.

```typescript
async function getBalance(params: BalanceParams): Promise<BalanceResult>

interface BalanceParams {
  address: string
  chainId: number
}

interface BalanceResult {
  balance: string        // Raw wei value
  formatted: string      // Human readable
  symbol: string         // e.g., "ETH"
  usdValue?: string      // USD value if price available
}
```

**Example:**

```typescript
import { getBalance } from '@nirholas/wallets-evm'

const balance = await getBalance({
  address: '0x742d35Cc6634C0532925a3b844Bc9e7595f4eCeA',
  chainId: 1,
})

console.log(`Balance: ${balance.formatted} ${balance.symbol}`)
// Output: "Balance: 1.5 ETH"
```

#### getTokenBalance

Get ERC-20 token balance.

```typescript
async function getTokenBalance(params: TokenBalanceParams): Promise<TokenBalance>

interface TokenBalanceParams {
  address: string
  token: string
  chainId: number
}

interface TokenBalance {
  balance: string
  formatted: string
  decimals: number
  symbol: string
  usdValue?: string
}
```

#### getTokenBalances

Get all token balances for an address.

```typescript
async function getTokenBalances(
  address: string, 
  chainId: number
): Promise<TokenBalance[]>
```

---

### Transaction Signing

#### signMessage

Sign a message with the wallet.

```typescript
async function signMessage(params: SignParams): Promise<string>

interface SignParams {
  message: string
  privateKey: string
}
```

#### signTypedData

Sign EIP-712 typed data.

```typescript
async function signTypedData(params: TypedDataParams): Promise<string>

interface TypedDataParams {
  domain: TypedDataDomain
  types: Record<string, TypedDataField[]>
  value: Record<string, unknown>
  privateKey: string
}
```

#### sendTransaction

Send a transaction.

```typescript
async function sendTransaction(params: TxParams): Promise<TxResult>

interface TxParams {
  to: string
  value?: string
  data?: string
  chainId: number
  privateKey: string
  gasLimit?: string
  maxFeePerGas?: string
  maxPriorityFeePerGas?: string
  nonce?: number
}
```

---

### Token Transfers

#### transferNative

Transfer native tokens (ETH, MATIC, etc.).

```typescript
async function transferNative(params: TransferParams): Promise<TxResult>

interface TransferParams {
  to: string
  amount: string
  chainId: number
  privateKey: string
}
```

#### transferToken

Transfer ERC-20 tokens.

```typescript
async function transferToken(params: TokenTransferParams): Promise<TxResult>

interface TokenTransferParams {
  token: string
  to: string
  amount: string
  chainId: number
  privateKey: string
}
```

---

## Solana Wallets

### Installation

```bash
pnpm add @nirholas/wallets-solana
```

### Wallet Operations

#### createSolanaWallet

Create a new Solana wallet.

```typescript
function createSolanaWallet(): SolanaWallet

interface SolanaWallet {
  publicKey: string
  secretKey: Uint8Array
}
```

#### getSolBalance

Get SOL balance.

```typescript
async function getSolBalance(publicKey: string): Promise<SolBalance>

interface SolBalance {
  lamports: number
  sol: number
  usdValue?: number
}
```

#### getSplTokenBalance

Get SPL token balance.

```typescript
async function getSplTokenBalance(
  publicKey: string,
  mint: string
): Promise<SplTokenBalance>
```

#### transferSol

Transfer SOL.

```typescript
async function transferSol(params: SolTransferParams): Promise<string>

interface SolTransferParams {
  from: Keypair
  to: string
  amount: number  // In SOL
}
```

#### transferSplToken

Transfer SPL tokens.

```typescript
async function transferSplToken(params: SplTransferParams): Promise<string>

interface SplTransferParams {
  from: Keypair
  to: string
  mint: string
  amount: number
}
```

---

## Multi-Sig (Safe/Gnosis)

### Installation

```bash
pnpm add @nirholas/wallets-multisig
```

### Safe Operations

#### getSafeInfo

Get Safe wallet information.

```typescript
async function getSafeInfo(safeAddress: string): Promise<SafeInfo>

interface SafeInfo {
  address: string
  nonce: number
  threshold: number
  owners: string[]
  modules: string[]
  fallbackHandler: string
  guard: string
  version: string
}
```

#### createSafeTransaction

Create a new Safe transaction (requires signatures).

```typescript
async function createSafeTransaction(
  params: SafeTxParams
): Promise<SafeTransaction>

interface SafeTxParams {
  safeAddress: string
  to: string
  value: string
  data: string
  operation?: 0 | 1  // 0 = Call, 1 = DelegateCall
}
```

#### signTransaction

Sign a Safe transaction.

```typescript
async function signTransaction(
  safeTx: SafeTransaction,
  signer: string
): Promise<SafeSignature>
```

#### executeTransaction

Execute a fully-signed Safe transaction.

```typescript
async function executeTransaction(
  safeTx: SafeTransaction,
  signatures: SafeSignature[]
): Promise<TxResult>
```

#### proposeTransaction

Propose a transaction to Safe Transaction Service.

```typescript
async function proposeTransaction(
  safeTx: SafeTransaction,
  signature: SafeSignature
): Promise<void>
```

---

## Domain Names (ENS)

### Installation

```bash
pnpm add @nirholas/wallets-domain-names
```

### ENS Resolution

#### resolveName

Resolve ENS name to address.

```typescript
async function resolveName(name: string): Promise<string | null>
```

**Example:**

```typescript
import { resolveName } from '@nirholas/wallets-domain-names'

const address = await resolveName('vitalik.eth')
console.log(address) // "0xd8dA6BF26964aF9D7eEd9e03E53415D37aA96045"
```

#### lookupAddress

Reverse lookup: get ENS name for an address.

```typescript
async function lookupAddress(address: string): Promise<string | null>
```

#### getEnsText

Get ENS text records.

```typescript
async function getEnsText(name: string, key: string): Promise<string | null>

// Common keys: 'email', 'url', 'avatar', 'description', 
// 'com.github', 'com.twitter'
```

#### getEnsAvatar

Get ENS avatar URL.

```typescript
async function getEnsAvatar(name: string): Promise<string | null>
```

---

## Wallet Security (Armor)

### Installation

```bash
pnpm add @nirholas/wallets-armor
```

### Security Utilities

#### encryptPrivateKey

Encrypt a private key with a password.

```typescript
async function encryptPrivateKey(
  privateKey: string,
  password: string
): Promise<EncryptedKey>

interface EncryptedKey {
  ciphertext: string
  iv: string
  salt: string
  algorithm: string
}
```

#### decryptPrivateKey

Decrypt an encrypted private key.

```typescript
async function decryptPrivateKey(
  encrypted: EncryptedKey,
  password: string
): Promise<string>
```

#### validateMnemonic

Validate a mnemonic phrase.

```typescript
function validateMnemonic(mnemonic: string): boolean
```

#### generateSecurePassword

Generate a cryptographically secure password.

```typescript
function generateSecurePassword(length?: number): string
```

---

## WalletConnect Integration

### Installation

```bash
pnpm add @nirholas/wallet-protocol
```

### WalletConnect V2

#### initWalletConnect

Initialize WalletConnect.

```typescript
async function initWalletConnect(
  projectId: string
): Promise<WalletConnectClient>
```

#### connect

Connect to a dApp.

```typescript
async function connect(uri: string): Promise<Session>
```

#### approveSession

Approve a session request.

```typescript
async function approveSession(
  proposal: SessionProposal,
  accounts: string[]
): Promise<Session>
```

#### handleRequest

Handle a dApp request (sign, sendTransaction, etc.).

```typescript
async function handleRequest(
  request: SessionRequest,
  handler: RequestHandler
): Promise<unknown>
```

---

## Common Types

### Wallet Interfaces

```typescript
interface BaseWallet {
  address: string
  getBalance(): Promise<string>
  signMessage(message: string): Promise<string>
  sendTransaction(tx: TransactionRequest): Promise<string>
}

interface HDWallet extends BaseWallet {
  mnemonic: string
  derivePath(path: string): Wallet
  getAccount(index: number): Wallet
}

interface MultiSigWallet extends BaseWallet {
  owners: string[]
  threshold: number
  proposeTransaction(tx: TransactionRequest): Promise<string>
  approveTransaction(txId: string): Promise<void>
  executeTransaction(txId: string): Promise<string>
}
```

### Error Types

```typescript
class WalletError extends Error {
  code: string
}

class InvalidAddressError extends WalletError {}
class InvalidMnemonicError extends WalletError {}
class InsufficientFundsError extends WalletError {}
class SignatureError extends WalletError {}
class ConnectionError extends WalletError {}
class ThresholdNotMetError extends WalletError {}
```
