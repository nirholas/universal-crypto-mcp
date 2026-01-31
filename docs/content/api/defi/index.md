---
title: "DeFi API Reference"
description: "API documentation for DeFi protocol packages"
category: "api"
keywords: ["api", "defi", "uniswap", "aave", "compound", "curve"]
order: 2
---

# DeFi Protocols API Reference

DeFi packages provide integrations with major decentralized finance protocols.

## Packages

| Package | Protocol | Description |
|---------|----------|-------------|
| `@nirholas/uniswap-v3-mcp` | Uniswap V3 | Swaps, liquidity, positions |
| `@nirholas/aave-mcp` | Aave V3 | Lending, borrowing |
| `@nirholas/compound-v3-mcp` | Compound V3 | Supply, borrow |
| `@nirholas/curve-mcp` | Curve | Stablecoin swaps, pools |
| `@nirholas/gmx-v2-mcp` | GMX V2 | Perpetuals trading |
| `@nirholas/lido-mcp` | Lido | Liquid staking |
| `@nirholas/yearn-mcp` | Yearn | Yield optimization |
| `@nirholas/pancakeswap-mcp` | PancakeSwap | BSC DEX |
| `@nirholas/venus-mcp` | Venus | BSC lending |

---

## Uniswap V3 API

### Installation

```bash
pnpm add @nirholas/uniswap-v3-mcp
```

### Core Functions

#### swap

Execute a token swap on Uniswap V3.

```typescript
async function swap(params: SwapParams): Promise<SwapResult>
```

**Parameters:**

| Name | Type | Required | Description |
|------|------|----------|-------------|
| `tokenIn` | `string` | Yes | Input token address |
| `tokenOut` | `string` | Yes | Output token address |
| `amount` | `string` | Yes | Amount to swap (in wei) |
| `slippage` | `number` | No | Max slippage (default: 0.005) |
| `recipient` | `string` | No | Recipient address |
| `deadline` | `number` | No | Transaction deadline |

**Returns:**

```typescript
interface SwapResult {
  transactionHash: string
  amountIn: string
  amountOut: string
  effectivePrice: string
  priceImpact: number
  gasUsed: string
}
```

**Example:**

```typescript
import { swap } from '@nirholas/uniswap-v3-mcp'

const result = await swap({
  tokenIn: '0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48', // USDC
  tokenOut: '0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2', // WETH
  amount: '1000000000', // 1000 USDC
  slippage: 0.01, // 1%
})

console.log(`Swapped for ${result.amountOut} WETH`)
```

---

#### quote

Get a swap quote without executing.

```typescript
async function quote(params: QuoteParams): Promise<QuoteResult>
```

**Parameters:**

| Name | Type | Required | Description |
|------|------|----------|-------------|
| `tokenIn` | `string` | Yes | Input token address |
| `tokenOut` | `string` | Yes | Output token address |
| `amount` | `string` | Yes | Amount to swap (in wei) |
| `chainId` | `number` | No | Chain ID (default: 1) |

**Returns:**

```typescript
interface QuoteResult {
  amountOut: string
  amountOutFormatted: string
  priceImpact: number
  route: PoolInfo[]
  estimatedGas: string
}
```

---

#### addLiquidity

Add liquidity to a Uniswap V3 pool.

```typescript
async function addLiquidity(params: AddLiquidityParams): Promise<AddLiquidityResult>
```

**Parameters:**

```typescript
interface AddLiquidityParams {
  token0: string
  token1: string
  fee: 500 | 3000 | 10000
  amount0: string
  amount1: string
  tickLower: number
  tickUpper: number
  recipient?: string
  deadline?: number
}
```

**Returns:**

```typescript
interface AddLiquidityResult {
  tokenId: string
  liquidity: string
  amount0: string
  amount1: string
  transactionHash: string
}
```

---

### Position Management

#### getPosition

Get details of a liquidity position.

```typescript
async function getPosition(tokenId: string): Promise<Position>
```

#### collectFees

Collect accumulated fees from a position.

```typescript
async function collectFees(tokenId: string): Promise<CollectResult>
```

#### removeLiquidity

Remove liquidity from a position.

```typescript
async function removeLiquidity(params: RemoveLiquidityParams): Promise<RemoveResult>
```

---

## Aave V3 API

### Installation

```bash
pnpm add @nirholas/aave-mcp
```

### Core Functions

#### supply

Supply assets to Aave to earn interest.

```typescript
async function supply(params: SupplyParams): Promise<SupplyResult>
```

**Parameters:**

| Name | Type | Required | Description |
|------|------|----------|-------------|
| `asset` | `string` | Yes | Asset address |
| `amount` | `string` | Yes | Amount to supply (in wei) |
| `onBehalfOf` | `string` | No | Recipient of aTokens |

**Example:**

```typescript
import { supply } from '@nirholas/aave-mcp'

const result = await supply({
  asset: '0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48', // USDC
  amount: '1000000000', // 1000 USDC
})

console.log(`Received ${result.aTokenAmount} aUSDC`)
```

---

#### borrow

Borrow assets from Aave using collateral.

```typescript
async function borrow(params: BorrowParams): Promise<BorrowResult>
```

**Parameters:**

| Name | Type | Required | Description |
|------|------|----------|-------------|
| `asset` | `string` | Yes | Asset to borrow |
| `amount` | `string` | Yes | Amount to borrow |
| `interestRateMode` | `1 \| 2` | Yes | 1 = Stable, 2 = Variable |
| `onBehalfOf` | `string` | No | Address to borrow for |

---

#### repay

Repay borrowed assets.

```typescript
async function repay(params: RepayParams): Promise<RepayResult>
```

---

#### withdraw

Withdraw supplied assets.

```typescript
async function withdraw(params: WithdrawParams): Promise<WithdrawResult>
```

---

### Position Queries

#### getUserAccountData

Get user's complete position data.

```typescript
async function getUserAccountData(user: string): Promise<AccountData>
```

**Returns:**

```typescript
interface AccountData {
  totalCollateralBase: string
  totalDebtBase: string
  availableBorrowsBase: string
  currentLiquidationThreshold: number
  ltv: number
  healthFactor: string
}
```

#### getUserReserveData

Get user data for a specific reserve.

```typescript
async function getUserReserveData(
  user: string, 
  asset: string
): Promise<UserReserveData>
```

---

## Compound V3 API

### Installation

```bash
pnpm add @nirholas/compound-v3-mcp
```

### Core Functions

#### supplyCollateral

Supply collateral to a Compound market.

```typescript
async function supplyCollateral(params: SupplyCollateralParams): Promise<SupplyResult>
```

#### borrowBase

Borrow the base asset (USDC) from Compound.

```typescript
async function borrowBase(amount: string): Promise<BorrowResult>
```

#### repayBase

Repay borrowed base asset.

```typescript
async function repayBase(amount: string): Promise<RepayResult>
```

#### withdrawCollateral

Withdraw supplied collateral.

```typescript
async function withdrawCollateral(params: WithdrawParams): Promise<WithdrawResult>
```

---

## Curve API

### Installation

```bash
pnpm add @nirholas/curve-mcp
```

### Core Functions

#### exchangeStable

Swap stablecoins with minimal slippage.

```typescript
async function exchangeStable(params: ExchangeParams): Promise<ExchangeResult>
```

**Example:**

```typescript
import { exchangeStable } from '@nirholas/curve-mcp'

// Swap USDC to DAI with minimal slippage
const result = await exchangeStable({
  pool: '3pool',
  tokenIn: 'USDC',
  tokenOut: 'DAI',
  amount: '10000000000', // 10,000 USDC
})
```

#### addLiquidityCurve

Add liquidity to a Curve pool.

```typescript
async function addLiquidityCurve(params: AddLiquidityParams): Promise<AddLiquidityResult>
```

---

## GMX V2 API

### Installation

```bash
pnpm add @nirholas/gmx-v2-mcp
```

### Core Functions

#### openPosition

Open a leveraged position.

```typescript
async function openPosition(params: OpenPositionParams): Promise<PositionResult>
```

**Parameters:**

```typescript
interface OpenPositionParams {
  market: string        // Market address
  isLong: boolean       // Long or short
  collateralToken: string
  collateralAmount: string
  sizeDelta: string     // Position size increase
  leverage?: number     // Target leverage (calculated from size/collateral)
  acceptablePrice: string
  triggerPrice?: string
}
```

#### closePosition

Close an existing position.

```typescript
async function closePosition(params: ClosePositionParams): Promise<CloseResult>
```

#### getPosition

Get position details.

```typescript
async function getPosition(
  account: string, 
  market: string, 
  isLong: boolean
): Promise<Position>
```

---

## Lido API

### Installation

```bash
pnpm add @nirholas/lido-mcp
```

### Core Functions

#### stakeEth

Stake ETH and receive stETH.

```typescript
async function stakeEth(amount: string): Promise<StakeResult>
```

**Example:**

```typescript
import { stakeEth } from '@nirholas/lido-mcp'

const result = await stakeEth('1000000000000000000') // 1 ETH
console.log(`Received ${result.stEthAmount} stETH`)
```

#### wrapStEth

Wrap stETH to wstETH (for DeFi compatibility).

```typescript
async function wrapStEth(amount: string): Promise<WrapResult>
```

#### unwrapWstEth

Unwrap wstETH back to stETH.

```typescript
async function unwrapWstEth(amount: string): Promise<UnwrapResult>
```

---

## Yearn API

### Installation

```bash
pnpm add @nirholas/yearn-mcp
```

### Core Functions

#### deposit

Deposit assets into a Yearn vault.

```typescript
async function deposit(params: DepositParams): Promise<DepositResult>
```

#### withdraw

Withdraw assets from a Yearn vault.

```typescript
async function withdraw(params: WithdrawParams): Promise<WithdrawResult>
```

#### getVaults

Get all available vaults with APY data.

```typescript
async function getVaults(chainId?: number): Promise<Vault[]>
```

**Returns:**

```typescript
interface Vault {
  address: string
  name: string
  symbol: string
  token: Token
  apy: number
  tvl: string
  strategies: Strategy[]
}
```

---

## Cross-Protocol Types

### Common Interfaces

```typescript
// Transaction result
interface TxResult {
  transactionHash: string
  blockNumber: number
  gasUsed: string
  status: 'success' | 'failed'
}

// Token approval
interface ApprovalParams {
  token: string
  spender: string
  amount: string // Use MaxUint256 for unlimited
}

// Price oracle
interface PriceData {
  price: string
  decimals: number
  timestamp: number
  source: string
}
```

### Error Types

```typescript
// DeFi-specific errors
class InsufficientLiquidityError extends Error {}
class SlippageExceededError extends Error {}
class PositionNotFoundError extends Error {}
class InsufficientCollateralError extends Error {}
class HealthFactorTooLowError extends Error {}
```
