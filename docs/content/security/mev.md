---
title: "MEV Protection"
description: "Protect your transactions from MEV attacks"
category: "security"
keywords: ["mev", "frontrunning", "sandwich", "flashbots"]
order: 2
---

# MEV Protection

MEV (Maximal Extractable Value) refers to the profit that can be extracted from blockchain users by reordering, inserting, or censoring transactions.

## Types of MEV Attacks

### Frontrunning

An attacker sees your pending transaction and submits a similar transaction with higher gas to execute first.

**Example**: You submit a large swap on Uniswap. A bot sees this, buys the token before you (raising the price), then sells after your trade.

### Sandwich Attack

Your transaction gets "sandwiched" between two attacker transactions.

```
1. Attacker buys token (price goes up)
2. Your swap executes at worse price
3. Attacker sells token (profits from price difference)
```

### Backrunning

Attacker executes immediately after your transaction to capitalize on price changes.

## Protection Strategies

### 1. Private Mempools

Send transactions directly to block builders, bypassing the public mempool.

```typescript
import { sendPrivateTransaction } from '@universal-crypto-mcp/security';

const result = await sendPrivateTransaction({
  chainId: 1,
  signedTransaction: signedTx,
  provider: 'flashbots', // or 'mevblocker'
});

console.log(`Included in block: ${result.blockNumber}`);
```

### 2. Flashbots Protect RPC

Use Flashbots Protect as your RPC endpoint:

```bash
# Replace your Ethereum RPC with Flashbots Protect
ETHEREUM_RPC_URL=https://rpc.flashbots.net
```

Or configure in code:

```typescript
import { createWalletClient, http } from 'viem';
import { mainnet } from 'viem/chains';

const client = createWalletClient({
  chain: mainnet,
  transport: http('https://rpc.flashbots.net'),
});
```

### 3. Slippage Protection

Set appropriate slippage limits:

```typescript
// Calculate minimum output
const minOutput = expectedOutput * (1 - slippage / 100);

const swap = await uniswap.swap({
  tokenIn: 'ETH',
  tokenOut: 'USDC',
  amount: '10.0',
  slippage: 0.5, // 0.5% max slippage
  minOutput, // Explicitly set minimum
});
```

### 4. Deadlines

Set transaction deadlines to prevent stale transactions:

```typescript
const deadline = Math.floor(Date.now() / 1000) + 300; // 5 minutes

const swap = await uniswap.swap({
  // ... other params
  deadline,
});
```

### 5. Commit-Reveal Schemes

For high-value trades, use commit-reveal:

```typescript
// Step 1: Commit (hash of your intent)
const commitment = keccak256(encodePacked(
  ['address', 'uint256', 'bytes32'],
  [recipient, amount, secret]
));
await contract.commit(commitment);

// Step 2: Wait for commitment to be included
await waitForBlocks(1);

// Step 3: Reveal and execute
await contract.reveal(recipient, amount, secret);
```

## MEV on Different Chains

| Chain | MEV Risk | Protection |
|-------|----------|------------|
| Ethereum | 🔴 High | Flashbots, MEV Blocker |
| Arbitrum | 🟡 Medium | Sequencer ordering |
| Base | 🟡 Medium | Sequencer ordering |
| Optimism | 🟡 Medium | Sequencer ordering |
| Polygon | 🟡 Medium | FastLane |
| Solana | 🟢 Low | Jito bundles |

## Detecting MEV Attacks

### Analyze Past Transactions

```typescript
import { analyzeMEV } from '@universal-crypto-mcp/security';

const analysis = await analyzeMEV({
  txHash: '0x...',
  chainId: 1,
});

if (analysis.wasAttacked) {
  console.log(`Attack type: ${analysis.attackType}`);
  console.log(`Loss: $${analysis.estimatedLoss}`);
  console.log(`Attacker: ${analysis.attackerAddress}`);
}
```

### Monitor for Suspicious Activity

```typescript
import { monitorMEV } from '@universal-crypto-mcp/security';

const monitor = await monitorMEV({
  address: '0xYourAddress',
  onAttack: (attack) => {
    console.log(`MEV attack detected: ${attack.type}`);
    // Send alert
  },
});
```

## Best Practices

1. **Use private transaction submission** for large trades
2. **Set tight slippage limits** (0.5% or less for stablecoins)
3. **Use L2s** for smaller trades (sequencer ordering reduces MEV)
4. **Split large orders** into smaller trades
5. **Use limit orders** instead of market orders when possible
6. **Time transactions** during low-activity periods

## Tools & Resources

- [Flashbots Protect](https://protect.flashbots.net/)
- [MEV Blocker](https://mevblocker.io/)
- [EigenPhi](https://eigenphi.io/) - MEV analysis
- [Flashbots Dashboard](https://explore.flashbots.net/)

## See Also

- [Security Overview](./overview.md)
- [Transaction Simulation](./simulation.md)
- [Best Practices](./best-practices.md)
