# Agent 3: Trading Engine Specialist

You are Claude Opus 4.5, an expert in DEX integrations and swap execution on Solana. Your task is to build the `packages/trading-engine` package for the Orbitt MCP system.

## Your Mission

Create a high-performance trading engine that:
1. Executes swaps via Jupiter aggregator
2. Supports direct DEX interactions (Raydium, PumpFun, Meteora)
3. Implements MEV protection via Jito
4. Handles batch operations efficiently

## Package: `packages/trading-engine`

### Core Swap Interface

```typescript
interface SwapParams {
  walletId: string;
  inputToken: string;      // Mint address or "SOL"
  outputToken: string;     // Mint address or "SOL"
  amount: string;          // In smallest units
  amountType: 'exactIn' | 'exactOut';
  slippageBps: number;     // 50 = 0.5%
  
  // Routing options
  router: 'jupiter' | 'direct';
  preferredDex?: 'raydium' | 'pumpfun' | 'meteora' | 'orca';
  
  // MEV protection
  useJito: boolean;
  jitoTipLamports?: string;
  
  // Transaction options
  priorityFee: 'auto' | 'low' | 'medium' | 'high' | number;
  skipPreflight: boolean;
  maxRetries: number;
}

interface SwapResult {
  success: boolean;
  signature?: string;
  inputAmount: string;
  outputAmount: string;
  priceImpactPct: number;
  fee: string;
  route: RouteStep[];
  slot?: number;
  error?: string;
  retryCount: number;
  executionTimeMs: number;
}

interface RouteStep {
  dex: string;
  poolId: string;
  inputMint: string;
  outputMint: string;
  inAmount: string;
  outAmount: string;
  feeAmount: string;
  feeMint: string;
}
```

### Quote System

```typescript
interface QuoteParams {
  inputToken: string;
  outputToken: string;
  amount: string;
  amountType: 'exactIn' | 'exactOut';
  slippageBps: number;
  router: 'jupiter' | 'direct';
  onlyDirectRoutes?: boolean;
}

interface Quote {
  inputMint: string;
  outputMint: string;
  inputAmount: string;
  outputAmount: string;
  otherAmountThreshold: string;  // Min out or max in
  priceImpactPct: number;
  route: RouteStep[];
  
  // Pricing
  price: number;           // Output per input
  inversePrice: number;    // Input per output
  
  // Fees
  totalFees: string;
  platformFee: string;
  networkFee: string;
  
  // Validity
  expiresAt: Date;
  quotedAt: Date;
}
```

### Batch Trading

```typescript
interface BatchSwapParams {
  swaps: SwapParams[];
  
  // Execution mode
  mode: 'parallel' | 'sequential' | 'atomic';
  
  // For atomic mode (Jito bundle)
  bundleOptions?: {
    tipLamports: string;
    maxBundleSize: number;  // Max 5 for Jito
  };
  
  // Error handling
  continueOnError: boolean;
  maxConcurrent: number;   // For parallel mode
}

interface BatchSwapResult {
  total: number;
  successful: number;
  failed: number;
  results: SwapResult[];
  totalInputAmount: string;
  totalOutputAmount: string;
  totalFees: string;
  executionTimeMs: number;
}
```

### DEX-Specific Handlers

#### Jupiter Aggregator
```typescript
class JupiterRouter {
  // Get quote from Jupiter
  async getQuote(params: QuoteParams): Promise<Quote>;
  
  // Execute swap via Jupiter
  async executeSwap(params: SwapParams, quote: Quote): Promise<SwapResult>;
  
  // Get all available routes
  async getRoutes(inputMint: string, outputMint: string): Promise<Route[]>;
}
```

#### Raydium Direct
```typescript
class RaydiumHandler {
  // Get pool by token pair
  async findPool(tokenA: string, tokenB: string): Promise<PoolInfo | null>;
  
  // Calculate swap output
  async calculateSwap(pool: PoolInfo, amountIn: string, aToB: boolean): Promise<SwapCalculation>;
  
  // Execute direct swap
  async swap(params: DirectSwapParams): Promise<SwapResult>;
  
  // AMM vs CPMM detection
  async getPoolType(poolId: string): Promise<'amm' | 'cpmm' | 'clmm'>;
}
```

#### PumpFun / PumpSwap
```typescript
class PumpFunHandler {
  // Check if token is on bonding curve
  async isBondingCurve(mint: string): Promise<boolean>;
  
  // Get bonding curve state
  async getBondingCurve(mint: string): Promise<BondingCurveState>;
  
  // Buy on bonding curve
  async buy(params: PumpFunBuyParams): Promise<SwapResult>;
  
  // Sell on bonding curve
  async sell(params: PumpFunSellParams): Promise<SwapResult>;
  
  // Check if graduated
  async isGraduated(mint: string): Promise<boolean>;
  
  // Get Raydium pool after graduation
  async getGraduatedPool(mint: string): Promise<string | null>;
}

interface BondingCurveState {
  mint: string;
  virtualSolReserves: string;
  virtualTokenReserves: string;
  realSolReserves: string;
  realTokenReserves: string;
  tokenTotalSupply: string;
  complete: boolean;
  associatedPoolKeys?: string;  // Raydium pool if graduated
}
```

#### Meteora
```typescript
class MeteoraHandler {
  // Find DLMM pool
  async findDLMMPool(tokenA: string, tokenB: string): Promise<DLMMPool | null>;
  
  // Get current bin
  async getCurrentBin(pool: DLMMPool): Promise<BinInfo>;
  
  // Execute swap
  async swap(params: MeteoraSwapParams): Promise<SwapResult>;
}
```

### MEV Protection (Jito)

```typescript
class JitoClient {
  // Send single transaction with tip
  async sendTransaction(
    tx: VersionedTransaction,
    tipLamports: string
  ): Promise<string>;
  
  // Send bundle of transactions
  async sendBundle(
    transactions: VersionedTransaction[],
    tipLamports: string
  ): Promise<BundleResult>;
  
  // Get tip accounts
  async getTipAccounts(): Promise<string[]>;
  
  // Get bundle status
  async getBundleStatus(bundleId: string): Promise<BundleStatus>;
}

interface BundleResult {
  bundleId: string;
  status: 'pending' | 'landed' | 'failed';
  slot?: number;
  signatures: string[];
}
```

### Priority Fee Management

```typescript
class PriorityFeeManager {
  // Get current priority fee estimates
  async getEstimates(): Promise<PriorityFeeEstimates>;
  
  // Get fee for specific accounts
  async getFeeForAccounts(accounts: string[]): Promise<number>;
  
  // Calculate compute budget
  calculateComputeBudget(
    estimatedCU: number,
    priorityFee: number
  ): ComputeBudgetInstruction[];
}

interface PriorityFeeEstimates {
  low: number;      // 25th percentile
  medium: number;   // 50th percentile
  high: number;     // 75th percentile
  veryHigh: number; // 95th percentile
}
```

### Transaction Building

```typescript
class TransactionBuilder {
  // Build swap transaction
  buildSwapTransaction(params: SwapBuildParams): Promise<VersionedTransaction>;
  
  // Add compute budget
  addComputeBudget(tx: VersionedTransaction, units: number, microLamports: number): VersionedTransaction;
  
  // Add Jito tip
  addJitoTip(tx: VersionedTransaction, tipLamports: string): VersionedTransaction;
  
  // Sign transaction
  signTransaction(tx: VersionedTransaction, signer: Keypair): VersionedTransaction;
}
```

### File Structure

```
packages/trading-engine/
├── package.json
├── tsconfig.json
├── src/
│   ├── index.ts
│   ├── types.ts
│   ├── swap/
│   │   ├── executor.ts         # Main swap executor
│   │   ├── quote.ts            # Quote fetching
│   │   └── batch.ts            # Batch operations
│   ├── routers/
│   │   ├── jupiter.ts          # Jupiter aggregator
│   │   ├── raydium.ts          # Raydium direct
│   │   ├── pumpfun.ts          # PumpFun/PumpSwap
│   │   └── meteora.ts          # Meteora DLMM
│   ├── mev/
│   │   ├── jito.ts             # Jito client
│   │   └── bundle.ts           # Bundle building
│   ├── fees/
│   │   ├── priority.ts         # Priority fee manager
│   │   └── compute.ts          # Compute budget
│   ├── tx/
│   │   ├── builder.ts          # Transaction builder
│   │   └── sender.ts           # Transaction sender
│   └── utils/
│       ├── tokens.ts           # Token utilities
│       └── amounts.ts          # Amount conversions
```

### MCP Tools to Expose

```typescript
// Quotes
'get_swap_quote'           // Get quote without executing
'compare_routes'           // Compare routes across DEXs

// Swaps
'execute_swap'             // Single swap
'execute_batch_swaps'      // Multiple swaps
'buy_token'                // Convenience: SOL -> Token
'sell_token'               // Convenience: Token -> SOL

// DEX-specific
'swap_on_raydium'          // Direct Raydium swap
'swap_on_pumpfun'          // PumpFun buy/sell
'swap_on_meteora'          // Meteora swap

// Pool info
'get_pool_info'            // Get pool details
'find_best_pool'           // Find best pool for pair
'check_pool_migration'     // Check PumpFun graduation

// Utilities
'estimate_price_impact'    // Estimate impact for size
'get_token_price'          // Current token price
```

### Constants

```typescript
// Native SOL
const SOL_MINT = 'So11111111111111111111111111111111111111112';
const WSOL_MINT = 'So11111111111111111111111111111111111111112';

// Common tokens
const USDC_MINT = 'EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v';
const USDT_MINT = 'Es9vMFrzaCERmJfrF4H2FYD4KCoNkY11McCe8BenwNYB';

// DEX Programs
const JUPITER_PROGRAM = 'JUP6LkbZbjS1jKKwapdHNy74zcZ3tLUZoi5QNyVTaV4';
const RAYDIUM_AMM_PROGRAM = '675kPX9MHTjS2zt1qfr1NYHuzeLXfQM9H24wFSUt1Mp8';
const PUMPFUN_PROGRAM = '6EF8rrecthR5Dkzon8Nwu78hRvfCKubJ14M5uBEwF6P';
const METEORA_DLMM_PROGRAM = 'LBUZKhRxPF3XUpBCjp4YzTKgLccjZhTSDM9YuVaPwxo';
```

### Error Handling

```typescript
class SwapError extends Error {
  constructor(
    message: string,
    public code: SwapErrorCode,
    public details?: Record<string, unknown>
  ) {
    super(message);
  }
}

enum SwapErrorCode {
  INSUFFICIENT_BALANCE = 'INSUFFICIENT_BALANCE',
  SLIPPAGE_EXCEEDED = 'SLIPPAGE_EXCEEDED',
  POOL_NOT_FOUND = 'POOL_NOT_FOUND',
  ROUTE_NOT_FOUND = 'ROUTE_NOT_FOUND',
  TRANSACTION_FAILED = 'TRANSACTION_FAILED',
  RPC_ERROR = 'RPC_ERROR',
  TIMEOUT = 'TIMEOUT',
  INSUFFICIENT_LIQUIDITY = 'INSUFFICIENT_LIQUIDITY',
}
```

### Dependencies

```json
{
  "@solana/web3.js": "^1.87.0",
  "@solana/spl-token": "^0.3.9",
  "@jup-ag/api": "^6.0.0",
  "@raydium-io/raydium-sdk-v2": "^0.1.0",
  "jito-ts": "^4.0.0",
  "@boosty/wallet-manager": "workspace:*",
  "@sperax/mcp-shared": "workspace:*"
}
```

## Quality Requirements

1. Sub-500ms quote fetching
2. Auto-retry failed transactions up to 3 times
3. Dynamic priority fee adjustment
4. Comprehensive slippage protection
5. Full audit logging of all trades

## Testing Strategy

1. Unit tests for each router
2. Integration tests on devnet
3. Mainnet tests with small amounts
4. Load testing for batch operations

Begin implementation immediately. Produce complete, working code.
