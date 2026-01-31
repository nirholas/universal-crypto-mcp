---
title: "Aave V3"
description: "Aave V3 MCP integration - lending, borrowing, and flash loans"
category: "packages/defi"
keywords: ["aave", "lending", "borrowing", "defi", "flash loans"]
order: 3
---

# Aave V3

Aave is the largest decentralized lending protocol. This package provides complete integration with Aave V3 for lending, borrowing, and flash loans.

## Installation

```bash
pnpm add @universal-crypto-mcp/defi-aave
```

## Supported Networks

| Network | Pool Address | Status |
|---------|-------------|--------|
| Ethereum | `0x87870Bca3F3fD6335C3F4ce8392D69350B4fA4E2` | ✅ |
| Arbitrum | `0x794a61358D6845594F94dc1DB02A252b5b4814aD` | ✅ |
| Optimism | `0x794a61358D6845594F94dc1DB02A252b5b4814aD` | ✅ |
| Polygon | `0x794a61358D6845594F94dc1DB02A252b5b4814aD` | ✅ |
| Avalanche | `0x794a61358D6845594F94dc1DB02A252b5b4814aD` | ✅ |
| Base | `0xA238Dd80C259a72e81d7e4664a9801593F98d1c5` | ✅ |

## Quick Start

```typescript
import { AaveV3 } from '@universal-crypto-mcp/defi-aave';

const aave = new AaveV3({
  rpcUrl: process.env.ETHEREUM_RPC_URL,
  chainId: 1,
});

// Check user's position
const position = await aave.getPosition('0xYourAddress');
console.log(`Health Factor: ${position.healthFactor}`);
console.log(`Total Collateral: $${position.totalCollateralUSD}`);
console.log(`Total Debt: $${position.totalDebtUSD}`);
```

## MCP Tools

### `aave_supply`

Supply assets to earn interest.

```typescript
const result = await aave.supply({
  asset: 'USDC',
  amount: '1000',
  onBehalfOf: '0xYourAddress', // Optional
});

console.log(`Supplied 1000 USDC`);
console.log(`Received aUSDC: ${result.aTokenAmount}`);
```

**Parameters:**

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `asset` | `string` | Yes | Asset to supply (symbol or address) |
| `amount` | `string` | Yes | Amount to supply |
| `onBehalfOf` | `string` | No | Address to receive aTokens |

### `aave_withdraw`

Withdraw supplied assets.

```typescript
const result = await aave.withdraw({
  asset: 'USDC',
  amount: '500', // or 'max' for full withdrawal
  to: '0xYourAddress',
});
```

### `aave_borrow`

Borrow assets against collateral.

```typescript
const result = await aave.borrow({
  asset: 'USDC',
  amount: '500',
  interestRateMode: 'variable', // or 'stable'
  onBehalfOf: '0xYourAddress',
});

console.log(`Borrowed 500 USDC at ${result.borrowRate}% APR`);
```

### `aave_repay`

Repay borrowed assets.

```typescript
const result = await aave.repay({
  asset: 'USDC',
  amount: '500', // or 'max' to repay full debt
  interestRateMode: 'variable',
  onBehalfOf: '0xYourAddress',
});
```

### `aave_position`

Get detailed position information.

```typescript
const position = await aave.getPosition('0xYourAddress');

console.log('=== Aave Position ===');
console.log(`Health Factor: ${position.healthFactor}`);
console.log(`Net Worth: $${position.netWorthUSD}`);
console.log('');
console.log('Supplied:');
for (const supply of position.supplies) {
  console.log(`  ${supply.symbol}: ${supply.amount} ($${supply.valueUSD})`);
  console.log(`    APY: ${supply.supplyAPY}%`);
}
console.log('');
console.log('Borrowed:');
for (const borrow of position.borrows) {
  console.log(`  ${borrow.symbol}: ${borrow.amount} ($${borrow.valueUSD})`);
  console.log(`    APR: ${borrow.borrowAPR}%`);
}
```

### `aave_rates`

Get current interest rates.

```typescript
const rates = await aave.getRates('USDC');

console.log(`USDC Rates:`);
console.log(`  Supply APY: ${rates.supplyAPY}%`);
console.log(`  Variable Borrow APR: ${rates.variableBorrowAPR}%`);
console.log(`  Stable Borrow APR: ${rates.stableBorrowAPR}%`);
console.log(`  Utilization: ${rates.utilization}%`);
```

### `aave_reserves`

Get reserve data for all assets.

```typescript
const reserves = await aave.getReserves();

for (const reserve of reserves) {
  console.log(`${reserve.symbol}:`);
  console.log(`  Total Supply: $${reserve.totalSupplyUSD}`);
  console.log(`  Total Borrow: $${reserve.totalBorrowUSD}`);
  console.log(`  LTV: ${reserve.ltv}%`);
  console.log(`  Liquidation Threshold: ${reserve.liquidationThreshold}%`);
}
```

## Flash Loans

Execute flash loans for arbitrage, liquidations, or collateral swaps.

```typescript
const result = await aave.flashLoan({
  assets: ['USDC', 'DAI'],
  amounts: ['1000000', '1000000'], // 1M each
  // Your callback contract that will receive the loan
  receiverAddress: '0xYourFlashLoanContract',
  params: '0x...', // Encoded params for your callback
});
```

### Flash Loan Callback

Your receiver contract must implement:

```solidity
interface IFlashLoanReceiver {
    function executeOperation(
        address[] calldata assets,
        uint256[] calldata amounts,
        uint256[] calldata premiums,
        address initiator,
        bytes calldata params
    ) external returns (bool);
}
```

## Collateral Management

### Enable as Collateral

```typescript
await aave.setUserUseReserveAsCollateral({
  asset: 'ETH',
  useAsCollateral: true,
});
```

### E-Mode (Efficiency Mode)

```typescript
// Enable stablecoin E-Mode for higher LTV
await aave.setUserEMode({
  categoryId: 1, // Stablecoin category
});

// Check current E-Mode
const eMode = await aave.getUserEMode('0xYourAddress');
console.log(`E-Mode: ${eMode.categoryId} (${eMode.label})`);
```

## Risk Parameters

| Asset | LTV | Liquidation Threshold | Liquidation Penalty |
|-------|-----|----------------------|---------------------|
| ETH | 80% | 82.5% | 5% |
| WBTC | 70% | 75% | 6.25% |
| USDC | 80% | 85% | 4.5% |
| DAI | 75% | 80% | 4.5% |

## Health Factor

The health factor determines liquidation risk:

- **> 1.0**: Safe
- **1.0 - 1.1**: At risk
- **< 1.0**: Liquidatable

```typescript
// Monitor health factor
const position = await aave.getPosition('0xYourAddress');

if (position.healthFactor < 1.1) {
  console.warn('⚠️ Health factor low! Consider repaying debt or adding collateral.');
}
```

## Error Handling

```typescript
import {
  InsufficientCollateralError,
  BorrowCapExceededError,
  HealthFactorTooLowError,
} from '@universal-crypto-mcp/defi-aave';

try {
  await aave.borrow({ asset: 'USDC', amount: '10000' });
} catch (error) {
  if (error instanceof InsufficientCollateralError) {
    console.error('Need more collateral to borrow this amount');
  } else if (error instanceof HealthFactorTooLowError) {
    console.error('This would make health factor too low');
  }
}
```

## See Also

- [Compound V3](./compound-v3.md) - Alternative lending protocol
- [DeFi Overview](./overview.md) - All DeFi protocols
- [Security](../security/overview.md) - DeFi security best practices
