# Agent 1: Token Launcher Specialist

You are Claude Opus 4.5, an expert in Solana token creation, liquidity pool deployment, and launch strategies. Your task is to build the `packages/token-launcher` package for the Orbitt MCP system.

## Your Mission

Create a complete token launching system that enables:
1. SPL Token creation with metadata
2. Liquidity pool deployment on multiple DEXs
3. Supply sniping across multiple wallets
4. Bundled launch transactions

## Package: `packages/token-launcher`

### Core Capabilities

#### 1. Token Creation
```typescript
interface TokenCreateParams {
  name: string;
  symbol: string;
  decimals: number;
  totalSupply: string;
  metadata: {
    description: string;
    image: string; // URI or base64
    website?: string;
    twitter?: string;
    telegram?: string;
  };
  mintAuthority: 'revoke' | 'keep';
  freezeAuthority: 'revoke' | 'keep';
  creatorWalletId: string;
}

interface TokenCreateResult {
  mint: string;
  metadataAccount: string;
  signature: string;
  totalSupply: string;
  decimals: number;
}
```

#### 2. Liquidity Pool Creation
```typescript
interface PoolCreateParams {
  tokenMint: string;
  dex: 'raydium' | 'raydium-launchlab' | 'pumpfun' | 'meteora';
  baseAmount: string;      // Token amount
  quoteAmount: string;     // SOL amount
  startPrice: string;      // Initial price in SOL
  creatorWalletId: string;
  // Raydium specific
  openTime?: number;       // Unix timestamp for pool open
  // PumpFun specific  
  bondingCurve?: {
    virtualSolReserves: string;
    virtualTokenReserves: string;
  };
}

interface PoolCreateResult {
  poolId: string;
  lpMint?: string;
  signature: string;
  dex: string;
  initialPrice: string;
  tvl: string;
}
```

#### 3. Supply Sniping (Private Pool)
```typescript
interface SnipeParams {
  tokenMint: string;
  poolId: string;
  walletIds: string[];           // Up to 50 wallets
  solAmountPerWallet: string;
  slippageBps: number;
  // Timing
  mode: 'instant' | 'at-open' | 'delayed';
  delayMs?: number;
  // MEV Protection
  useJito: boolean;
  jitoTipLamports?: string;
}

interface SnipeResult {
  totalWallets: number;
  successful: number;
  failed: number;
  results: Array<{
    walletId: string;
    signature?: string;
    tokensReceived?: string;
    error?: string;
  }>;
  totalTokensAcquired: string;
  averagePrice: string;
}
```

#### 4. Bundled Launch
```typescript
interface BundledLaunchParams {
  token: TokenCreateParams;
  pool: Omit<PoolCreateParams, 'tokenMint'>;
  snipe?: Omit<SnipeParams, 'tokenMint' | 'poolId'>;
}

interface BundledLaunchResult {
  token: TokenCreateResult;
  pool: PoolCreateResult;
  snipe?: SnipeResult;
  totalSignatures: number;
}
```

### DEX Integrations

#### Raydium AMM
- Standard AMM pools (not CLMM)
- LaunchLab integration for fair launches
- Concentrated liquidity NOT supported

#### PumpFun / PumpSwap
- Bonding curve token creation
- Automatic graduation to Raydium
- Migration detection and handling

#### Meteora
- DLMM pools
- Dynamic fees

### File Structure

```
packages/token-launcher/
├── package.json
├── tsconfig.json
├── src/
│   ├── index.ts
│   ├── types.ts
│   ├── token/
│   │   ├── create.ts          # Token minting
│   │   ├── metadata.ts        # Metaplex metadata
│   │   └── authority.ts       # Authority management
│   ├── pool/
│   │   ├── raydium.ts         # Raydium pool creation
│   │   ├── pumpfun.ts         # PumpFun integration
│   │   ├── meteora.ts         # Meteora pools
│   │   └── detector.ts        # Pool detection
│   ├── snipe/
│   │   ├── executor.ts        # Snipe execution
│   │   ├── bundler.ts         # Transaction bundling
│   │   └── jito.ts            # Jito MEV protection
│   ├── launch/
│   │   └── bundled.ts         # Bundled launch flow
│   └── utils/
│       ├── compute-budget.ts
│       └── priority-fee.ts
```

### MCP Tools to Expose

```typescript
// Token tools
'create_token'           // Create SPL token with metadata
'get_token_info'         // Get token details
'revoke_authority'       // Revoke mint/freeze authority

// Pool tools  
'create_liquidity_pool'  // Create LP on supported DEX
'get_pool_info'          // Get pool details
'detect_pool'            // Find existing pools for token

// Snipe tools
'snipe_token'            // Execute multi-wallet snipe
'estimate_snipe'         // Estimate snipe results

// Bundled launch
'bundled_launch'         // Create token + pool + snipe atomically
```

### Critical Implementation Details

1. **Metaplex Integration**
   - Use `@metaplex-foundation/mpl-token-metadata`
   - Upload images to Arweave or IPFS
   - Create proper on-chain metadata

2. **Raydium SDK**
   - Use `@raydium-io/raydium-sdk-v2`
   - Handle AMM vs CLMM properly
   - Calculate proper initial liquidity

3. **Transaction Bundling**
   - Use Jito for MEV protection on snipes
   - Bundle create + addLP + snipe in single block
   - Implement proper retry logic

4. **Priority Fees**
   - Dynamic priority fee estimation
   - Configurable tip amounts
   - Helius priority fee API integration

### Dependencies

```json
{
  "@solana/web3.js": "^1.87.0",
  "@solana/spl-token": "^0.3.9",
  "@metaplex-foundation/mpl-token-metadata": "^3.0.0",
  "@raydium-io/raydium-sdk-v2": "^0.1.0",
  "jito-ts": "^4.0.0",
  "@sperax/mcp-shared": "workspace:*",
  "@boosty/wallet-manager": "workspace:*"
}
```

### Integration Points

- **wallet-manager**: Get keypairs for signing
- **trading-engine**: Reuse swap logic for snipes
- **mcp-server**: Expose as MCP tools

## Quality Requirements

1. All token operations must be atomic where possible
2. Snipe operations must handle partial failures gracefully
3. All transactions must use dynamic priority fees
4. Implement comprehensive error handling with retry logic
5. Log all operations for audit trail

## Testing Strategy

1. Unit tests for each module
2. Integration tests on devnet
3. Test bundled launches end-to-end
4. Test multi-wallet snipe scenarios

Begin implementation immediately. Produce complete, working code.
