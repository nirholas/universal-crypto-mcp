---
title: "Rugpull Detection"
description: "Detect and avoid scam tokens and rugpulls"
category: "security"
keywords: ["rugpull", "scam", "honeypot", "token analysis"]
order: 3
---

# Rugpull Detection

This guide helps you identify and avoid scam tokens and rugpull schemes.

## What is a Rugpull?

A rugpull occurs when developers abandon a project and run away with investor funds. Common methods include:

1. **Liquidity removal** - Developers remove liquidity from DEX
2. **Minting** - Developers mint unlimited tokens and sell
3. **Honeypot** - Token can be bought but not sold
4. **Hidden functions** - Contract has malicious backdoors

## Token Analysis

### Quick Check

```typescript
import { analyzeToken } from '@universal-crypto-mcp/security';

const result = await analyzeToken({
  address: '0xTokenAddress',
  chainId: 1,
});

console.log('=== Token Analysis ===');
console.log(`Name: ${result.name} (${result.symbol})`);
console.log(`Verified: ${result.isVerified ? '✅' : '❌'}`);
console.log(`Honeypot: ${result.isHoneypot ? '🚨 YES' : '✅ No'}`);
console.log(`Risk Score: ${result.riskScore}/100`);
```

### Detailed Analysis

```typescript
const analysis = await analyzeToken({
  address: '0xTokenAddress',
  chainId: 1,
  detailed: true,
});

// Contract Analysis
console.log('Contract:');
console.log(`  Verified: ${analysis.contract.isVerified}`);
console.log(`  Proxy: ${analysis.contract.isProxy}`);
console.log(`  Age: ${analysis.contract.ageDays} days`);

// Ownership Analysis
console.log('Ownership:');
console.log(`  Renounced: ${analysis.ownership.renounced}`);
console.log(`  Owner balance: ${analysis.ownership.ownerBalance}%`);
console.log(`  Top 10 holders: ${analysis.ownership.top10Percentage}%`);

// Function Analysis
console.log('Functions:');
console.log(`  Can mint: ${analysis.functions.canMint}`);
console.log(`  Can pause: ${analysis.functions.canPause}`);
console.log(`  Can blacklist: ${analysis.functions.canBlacklist}`);
console.log(`  Hidden owner: ${analysis.functions.hiddenOwner}`);

// Trading Analysis
console.log('Trading:');
console.log(`  Buy tax: ${analysis.trading.buyTax}%`);
console.log(`  Sell tax: ${analysis.trading.sellTax}%`);
console.log(`  Max transaction: ${analysis.trading.maxTransaction}`);
console.log(`  Honeypot: ${analysis.trading.isHoneypot}`);

// Liquidity Analysis
console.log('Liquidity:');
console.log(`  Total: $${analysis.liquidity.totalUSD}`);
console.log(`  Locked: ${analysis.liquidity.lockedPercentage}%`);
console.log(`  Lock duration: ${analysis.liquidity.lockDays} days`);
```

## Risk Factors

### 🔴 Critical (Don't Trade)

| Factor | Description |
|--------|-------------|
| Honeypot | Cannot sell tokens |
| Unverified contract | Source code not public |
| Hidden mint function | Owner can create infinite tokens |
| 100% tax on sell | All proceeds go to owner |

### 🟠 High Risk

| Factor | Description |
|--------|-------------|
| Unlocked liquidity | Can rugpull at any time |
| Owner not renounced | Owner has control |
| Can blacklist addresses | Owner can prevent selling |
| Can pause trading | Owner can freeze token |

### 🟡 Medium Risk

| Factor | Description |
|--------|-------------|
| High tax (>10%) | Significant trading fee |
| Low liquidity (<$10k) | High slippage, easy to manipulate |
| New contract (<7 days) | Limited track record |
| Top holder >20% | Concentrated ownership |

### 🟢 Good Signs

| Factor | Description |
|--------|-------------|
| Verified contract | Code is public and audited |
| Ownership renounced | No centralized control |
| Liquidity locked (>1 year) | Cannot remove liquidity |
| Fair distribution | No whale dominance |
| Established (>30 days) | Track record exists |

## Automated Checks

### Before Trading

```typescript
import { shouldTrade } from '@universal-crypto-mcp/security';

const decision = await shouldTrade({
  token: '0xTokenAddress',
  chainId: 1,
  maxRiskScore: 50, // Don't trade if risk > 50
});

if (!decision.safe) {
  console.error('⚠️ Token failed safety checks:');
  for (const reason of decision.reasons) {
    console.error(`  - ${reason}`);
  }
  return;
}

// Safe to trade
await swap({ ... });
```

### Continuous Monitoring

```typescript
import { monitorToken } from '@universal-crypto-mcp/security';

const monitor = monitorToken({
  address: '0xTokenAddress',
  chainId: 1,
  onRiskChange: (newRisk, oldRisk, reason) => {
    if (newRisk > oldRisk) {
      console.warn(`⚠️ Risk increased: ${reason}`);
      // Consider selling
    }
  },
  onLiquidityChange: (change) => {
    if (change.type === 'removal' && change.percentage > 10) {
      console.error('🚨 Large liquidity removal detected!');
      // Emergency sell
    }
  },
});
```

## Common Scam Patterns

### 1. Fake Token Copies

Scammers create tokens with similar names to popular projects.

```typescript
// Check if token is legitimate
const isOfficial = await verifyOfficialToken({
  address: '0xTokenAddress',
  expectedName: 'Shiba Inu',
  expectedSymbol: 'SHIB',
});

if (!isOfficial) {
  console.error('⚠️ This is not the official token!');
}
```

### 2. Airdrop Scams

Free tokens that steal approvals when you try to sell.

```typescript
// Never approve or interact with unknown airdropped tokens
const airdrops = await getUnknownTokens('0xYourAddress');

for (const token of airdrops) {
  console.warn(`⚠️ Unknown token: ${token.symbol}`);
  console.warn('  Do NOT approve or try to sell this token');
}
```

### 3. Fake LP Lock

Scammers show "locked liquidity" but retain unlock keys.

```typescript
const lockInfo = await verifyLiquidityLock({
  lpToken: '0xLPAddress',
  locker: '0xLockerContract',
});

if (!lockInfo.verified) {
  console.error('⚠️ Liquidity lock not verified');
  console.error(`  Reason: ${lockInfo.issue}`);
}
```

## Data Sources

We aggregate data from multiple sources:

- **Contract verification**: Etherscan, Sourcify
- **Token analysis**: GoPlus, Honeypot.is, TokenSniffer
- **Liquidity locks**: Unicrypt, Team.Finance, PinkSale
- **On-chain data**: Direct contract analysis

## See Also

- [Security Overview](./overview.md)
- [Token Approval Safety](./approvals.md)
- [MEV Protection](./mev.md)
