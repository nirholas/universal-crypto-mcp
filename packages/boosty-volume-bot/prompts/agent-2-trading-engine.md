# Agent 2: DEX Trading Engine

You are Claude Opus 4.5 building the trading engine for a DeFi MCP server. Create `/packages/trading-engine/`.

## Context
- Depends on `@defi-mcp/solana-core` for transactions
- Real swaps on Solana mainnet, NO MOCKS
- Unlimited API credits available

## Build These Components

### 1. Jupiter Integration (`src/jupiter/`)
```typescript
interface JupiterClient {
  getQuote(input: string, output: string, amount: bigint, slippageBps?: number): Promise<Quote>;
  getSwapTransaction(quote: Quote, userPublicKey: string): Promise<VersionedTransaction>;
  executeSwap(quote: Quote, signer: Keypair): Promise<TransactionResult>;
}
```
- Jupiter V6 API: `https://quote-api.jup.ag/v6`
- Route optimization, fee estimation
- DCA and Limit orders

### 2. Raydium Integration (`src/raydium/`)
```typescript
interface RaydiumClient {
  getPoolInfo(poolId: string): Promise<PoolInfo>;
  getPoolsByToken(mint: string): Promise<PoolInfo[]>;
  swap(params: SwapParams): Promise<TransactionResult>;
  addLiquidity(params: LiquidityParams): Promise<TransactionResult>;
}
```
- AMM V4 + CLMM pools
- Direct pool interaction for speed
- SDK: `@raydium-io/raydium-sdk-v2`

### 3. PumpFun Integration (`src/pumpfun/`)
```typescript
interface PumpFunClient {
  getBondingCurve(mint: string): Promise<BondingCurveState>;
  buy(mint: string, solAmount: bigint, slippageBps: number): Promise<TransactionResult>;
  sell(mint: string, tokenAmount: bigint, slippageBps: number): Promise<TransactionResult>;
  subscribeToNewTokens(cb: (token: NewToken) => void): void;
  detectMigration(mint: string): Promise<MigrationStatus>;
}
```
- Bonding curve math
- Migration detection to Raydium
- Real-time new token monitoring

### 4. Trade Executor (`src/executor/`)
```typescript
interface TradeExecutor {
  executeTrade(params: TradeParams): Promise<TradeResult>;
  executeBatch(trades: TradeParams[]): Promise<TradeResult[]>;
  getOptimalRoute(input: string, output: string, amount: bigint): Promise<Route>;
}
```
- Smart routing (Jupiter vs direct)
- MEV protection via Jito
- Batch execution

## Dependencies
```json
{
  "@raydium-io/raydium-sdk-v2": "^0.1.0",
  "@orca-so/whirlpools-sdk": "^0.13.0"
}
```

## APIs
- Jupiter: `https://quote-api.jup.ag/v6`
- PumpFun: `https://frontend-api.pump.fun` + on-chain
- Token list: `https://token.jup.ag/all`

## Key Requirements
1. All swaps execute on REAL mainnet
2. Default slippage: 100 bps (1%)
3. MEV protection option via Jito bundles
4. Handle insufficient liquidity gracefully
5. Rate limit: 600 req/min to Jupiter

START BUILDING NOW - Complete code only.
