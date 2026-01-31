---
title: "Security Overview"
description: "Security best practices for Universal Crypto MCP and blockchain interactions"
category: "security"
keywords: ["security", "best practices", "mev", "rugpull", "audit"]
order: 1
---

# Security Overview

Security is critical when working with blockchain applications. This guide covers best practices for using Universal Crypto MCP safely.

## ⚠️ Critical Security Rules

1. **Never share private keys** - Store keys in environment variables or secure vaults
2. **Verify addresses** - Always verify contract addresses before transactions
3. **Test on testnets** - Always test on testnets before mainnet
4. **Use limited approvals** - Approve only necessary amounts
5. **Monitor transactions** - Set up alerts for unusual activity

## Key Management

### Environment Variables

```bash
# ❌ BAD - Never commit keys to code
const PRIVATE_KEY = "0xac0974bec39a17e36ba4a6b4d238ff944bacb478cbed5efcae784d7bf4f2ff80";

# ✅ GOOD - Use environment variables
PRIVATE_KEY=0xac0974bec...
```

### Secure Storage Options

| Method | Security | Best For |
|--------|----------|----------|
| Environment variables | ⭐⭐ | Development |
| Secrets manager (AWS, GCP) | ⭐⭐⭐⭐ | Production |
| Hardware wallet | ⭐⭐⭐⭐⭐ | High-value accounts |
| Multi-sig (Safe) | ⭐⭐⭐⭐⭐ | Organization wallets |

### Using Hardware Wallets

```typescript
import { createWalletClient, custom } from 'viem';
import { ledger } from '@viem/ledger';

const client = createWalletClient({
  transport: custom(await ledger()),
});
```

### Using Multi-Sig (Safe)

```typescript
import { Safe } from '@universal-crypto-mcp/wallets-safe';

const safe = new Safe({
  safeAddress: '0xYourSafeAddress',
  signers: [signer1, signer2, signer3],
  threshold: 2, // 2 of 3 required
});

// Propose transaction
const proposal = await safe.proposeTransaction({
  to: '0xRecipient',
  value: '1000000000000000000',
  data: '0x',
});

// Other signers approve
await safe.approveTransaction(proposal.safeTxHash);

// Execute when threshold met
await safe.executeTransaction(proposal.safeTxHash);
```

## Token Approvals

### Limited Approvals

```typescript
// ❌ BAD - Unlimited approval
await token.approve(spender, ethers.MaxUint256);

// ✅ GOOD - Limited approval
await token.approve(spender, parseUnits('1000', 6)); // Only 1000 USDC
```

### Checking Approvals

```typescript
import { checkApprovals } from '@universal-crypto-mcp/security';

const approvals = await checkApprovals({
  address: '0xYourAddress',
  chainId: 1,
});

for (const approval of approvals) {
  if (approval.amount === 'unlimited') {
    console.warn(`⚠️ Unlimited approval to ${approval.spender}`);
  }
}
```

### Revoking Approvals

```typescript
// Revoke approval
await token.approve(spender, 0);

// Or use the security package
import { revokeApproval } from '@universal-crypto-mcp/security';

await revokeApproval({
  token: '0xUSDC',
  spender: '0xUntrustedContract',
});
```

## MEV Protection

MEV (Maximal Extractable Value) attacks can front-run your transactions.

### Using Private Mempools

```typescript
import { flashbotsProvider } from '@universal-crypto-mcp/security';

// Send transaction through Flashbots
const result = await flashbotsProvider.sendPrivateTransaction({
  signedTransaction: signedTx,
  maxBlockNumber: currentBlock + 5,
});
```

### Slippage Protection

```typescript
// Always set slippage limits
const swap = await uniswap.swap({
  tokenIn: 'ETH',
  tokenOut: 'USDC',
  amount: '1.0',
  slippage: 0.5, // 0.5% max slippage
  deadline: Date.now() + 300000, // 5 minute deadline
});
```

### Using MEV Protection Services

| Service | Protection Level | Networks |
|---------|-----------------|----------|
| Flashbots Protect | ⭐⭐⭐⭐ | Ethereum |
| MEV Blocker | ⭐⭐⭐⭐ | Ethereum |
| Arbitrum Sequencer | Built-in | Arbitrum |

## Rugpull Detection

### Checking Token Safety

```typescript
import { analyzeToken } from '@universal-crypto-mcp/security';

const analysis = await analyzeToken('0xTokenAddress');

console.log(`Contract verified: ${analysis.isVerified}`);
console.log(`Honeypot: ${analysis.isHoneypot}`);
console.log(`Owner can mint: ${analysis.ownerCanMint}`);
console.log(`Owner can pause: ${analysis.ownerCanPause}`);
console.log(`Max tax: ${analysis.maxTax}%`);
console.log(`Liquidity locked: ${analysis.liquidityLocked}`);
console.log(`Risk score: ${analysis.riskScore}/100`);

if (analysis.riskScore > 70) {
  console.error('⚠️ HIGH RISK TOKEN - DO NOT TRADE');
}
```

### Red Flags

| Red Flag | Risk Level | Description |
|----------|------------|-------------|
| Unverified contract | 🔴 High | Can't verify code |
| Owner can mint | 🔴 High | Unlimited supply |
| Honeypot | 🔴 Critical | Can't sell tokens |
| High tax (>10%) | 🟡 Medium | Significant fee on trades |
| Unlocked liquidity | 🟡 Medium | Can rug at any time |
| New contract (<7 days) | 🟡 Medium | Limited track record |

## Smart Contract Verification

### Verifying Contracts

```typescript
import { verifyContract } from '@universal-crypto-mcp/security';

const isVerified = await verifyContract({
  address: '0xContractAddress',
  chainId: 1,
});

if (!isVerified) {
  console.warn('⚠️ Contract is not verified - proceed with caution');
}
```

### Common Scam Patterns

1. **Fake token contracts** - Mimicking popular tokens
2. **Upgrade proxies** - Admin can change contract logic
3. **Hidden functions** - Malicious code in verified contracts
4. **Reentrancy** - Drain funds through callbacks

## Transaction Simulation

Before executing, simulate transactions:

```typescript
import { simulateTransaction } from '@universal-crypto-mcp/security';

const simulation = await simulateTransaction({
  to: '0xContract',
  data: calldata,
  value: 0n,
  from: '0xYourAddress',
});

console.log(`Will succeed: ${simulation.success}`);
console.log(`Gas used: ${simulation.gasUsed}`);
console.log(`State changes:`, simulation.stateChanges);
console.log(`Token transfers:`, simulation.tokenTransfers);

// Check for unexpected transfers
for (const transfer of simulation.tokenTransfers) {
  if (transfer.from === '0xYourAddress' && !expectedTransfers.includes(transfer)) {
    console.error('⚠️ Unexpected token transfer detected!');
  }
}
```

## Security Checklist

### Before Deployment

- [ ] All private keys in environment variables
- [ ] Contract addresses verified on block explorer
- [ ] Token approvals are limited
- [ ] Slippage protection enabled
- [ ] Tested on testnet
- [ ] Code reviewed for security issues

### Before Large Transactions

- [ ] Simulate transaction first
- [ ] Verify recipient address
- [ ] Check gas price is reasonable
- [ ] Use MEV protection if needed
- [ ] Set appropriate deadline

### Ongoing Monitoring

- [ ] Set up wallet alerts
- [ ] Monitor approval changes
- [ ] Review transaction history regularly
- [ ] Keep dependencies updated

## Incident Response

### If Keys Are Compromised

1. **Immediately transfer funds** to a new wallet
2. **Revoke all approvals** from compromised address
3. **Rotate API keys** and secrets
4. **Document the incident** for post-mortem

### Emergency Contacts

- **Report scams**: [etherscan.io/contactus](https://etherscan.io/contactus)
- **Security disclosures**: security@universal-crypto-mcp.com

## See Also

- [MEV Protection](./mev.md) - Detailed MEV guide
- [Rugpull Detection](./rugpull.md) - Token analysis
- [Audit Reports](./audits.md) - Security audits
- [Best Practices](./best-practices.md) - Comprehensive guide
