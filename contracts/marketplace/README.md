# 🔗 Tool Marketplace Smart Contracts

> Decentralized on-chain registry for AI tools with automated revenue splitting

**Author:** nirholas | nichxbt  
**Repository:** universal-crypto-mcp  
**Version:** 1.0.0

---

## 📋 Overview

The Tool Marketplace contracts provide trustless, permissionless infrastructure for:

- **Tool Registration** - Register AI tools with metadata stored on IPFS
- **Revenue Routing** - Automatic payment splitting to multiple recipients
- **Staking** - Spam prevention via USDs staking requirements
- **Governance** - Slashing proposals for malicious tools

## 🏗️ Architecture

```
┌─────────────────┐     ┌──────────────────┐     ┌─────────────────┐
│   ToolRegistry  │────▶│  RevenueRouter   │────▶│   ToolStaking   │
│                 │     │                  │     │                 │
│ • registerTool  │     │ • processPayment │     │ • stake         │
│ • updateTool    │     │ • claimPayout    │     │ • requestUnstake│
│ • pauseTool     │     │ • batchPayout    │     │ • slash         │
│ • verifyTool    │     │ • EIP-3009       │     │ • governance    │
└─────────────────┘     └──────────────────┘     └─────────────────┘
         │                       │                        │
         └───────────────────────┴────────────────────────┘
                                 │
                         ┌───────▼───────┐
                         │   USDs Token  │
                         │   (ERC-20)    │
                         └───────────────┘
```

## 📜 Contracts

### ToolRegistry.sol

The main registry for tool registration and management.

**Key Features:**
- UUPS upgradeable proxy pattern
- Role-based access control (Admin, Verifier, Revenue Router)
- Tool metadata stored as IPFS hash (off-chain)
- On-chain: pricing, ownership, stats

**Functions:**
```solidity
function registerTool(
    string name,
    string endpoint,
    string metadataURI,
    uint256 pricePerCall,
    address[] revenueRecipients,
    uint256[] revenueShares // basis points, must sum to 10000
) external returns (bytes32 toolId);

function updateTool(bytes32 toolId, string metadataURI, uint256 newPrice);
function pauseTool(bytes32 toolId);
function activateTool(bytes32 toolId);
function transferOwnership(bytes32 toolId, address newOwner);
function verifyTool(bytes32 toolId); // Admin only
```

### RevenueRouter.sol

Handles payments and automatic revenue distribution.

**Key Features:**
- Supports standard ERC-20 transfers
- EIP-3009 gasless deposits (receiveWithAuthorization)
- Configurable platform fee (max 10%)
- Minimum payout thresholds for gas efficiency
- Batch payout operations

**Payment Flow:**
1. User calls `processPayment(toolId, amount)` or uses EIP-3009
2. Platform fee deducted (e.g., 2.5%)
3. Remaining amount split according to tool's revenue configuration
4. Amounts credited to pending balances
5. Recipients claim when balance >= minimum threshold

### ToolStaking.sol

Spam prevention and quality signaling through staking.

**Key Features:**
- Minimum stake required to register tools
- Higher stake = better discovery ranking (future)
- 7-day unstaking delay
- Governance-based slashing for violations

**Staking Flow:**
```
stake(amount) → [7 days] → requestUnstake(amount) → [7 days] → unstake()
```

**Slashing Process:**
1. Slasher creates proposal with tool ID and percentage
2. Governance votes for/against
3. After voting period + quorum reached → execute slash
4. Slashed funds go to treasury

## 🚀 Deployment

### Prerequisites

```bash
# Install Foundry
curl -L https://foundry.paradigm.xyz | bash
foundryup

# Install OpenZeppelin
forge install OpenZeppelin/openzeppelin-contracts-upgradeable
```

### Deploy to Testnet

```bash
# Set environment variables
export DEPLOYER_PRIVATE_KEY=0x...
export ARBITRUM_SEPOLIA_RPC=https://sepolia-rollup.arbitrum.io/rpc
export ARBISCAN_API_KEY=...

# Deploy
npx ts-node scripts/deploy/deploy-marketplace.ts
```

### Verify Contracts

```bash
forge verify-contract <ADDRESS> contracts/marketplace/ToolRegistry.sol:ToolRegistry \
  --chain-id 421614 \
  --etherscan-api-key $ARBISCAN_API_KEY
```

## 🧪 Testing

```bash
# Run all tests
forge test

# Run with verbosity
forge test -vvv

# Run specific test
forge test --match-test test_RegisterTool -vvv

# Gas report
forge test --gas-report

# Coverage
forge coverage
```

## 📦 TypeScript SDK

```typescript
import { createOnChainRegistry } from '@/modules/tool-marketplace';

// Read-only client
const registry = createOnChainRegistry(421614); // Arbitrum Sepolia

// Get tool info
const tool = await registry.getTool(toolId);
console.log(`${tool.name}: ${tool.pricePerCallFormatted} USDs/call`);

// With wallet for writes
import { createWalletClient, http } from 'viem';
import { privateKeyToAccount } from 'viem/accounts';

const walletClient = createWalletClient({
  account: privateKeyToAccount(privateKey),
  chain: arbitrumSepolia,
  transport: http(),
});

const registry = createOnChainRegistry(421614, undefined, walletClient);

// Register a tool
const { hash, toolId } = await registry.registerTool({
  name: 'my-ai-tool',
  endpoint: 'https://api.universal-crypto-mcp.com/tool',
  metadataURI: 'ipfs://QmXxx...',
  pricePerCall: '0.01', // 0.01 USDs
  revenueSplits: [
    { recipient: '0x...', sharePercentage: 80 },
    { recipient: '0x...', sharePercentage: 20 },
  ],
});

// Stake tokens
await registry.stake('100'); // 100 USDs

// Claim earnings
await registry.claimPayout();
```

## 🔐 Security Considerations

1. **Upgradability**: Contracts use UUPS pattern. Only admin can upgrade.
2. **Reentrancy**: All state changes before external calls.
3. **Access Control**: Role-based with OpenZeppelin AccessControl.
4. **Slashing**: Requires governance vote, max 50% slash.
5. **Emergency**: Admin can pause all operations.

## 📊 Gas Estimates

| Operation | Gas (approx) |
|-----------|-------------|
| registerTool | ~250,000 |
| updateTool | ~50,000 |
| processPayment | ~100,000 |
| claimPayout | ~60,000 |
| stake | ~80,000 |
| unstake | ~60,000 |

## 🗺️ Roadmap

- [ ] Deploy to Arbitrum Sepolia
- [ ] Audit by security firm
- [ ] Deploy to Arbitrum mainnet
- [ ] Add ENS support for endpoints
- [ ] Implement discovery ranking algorithm
- [ ] Add subscription/prepay models
- [ ] Cross-chain tool mirroring

## 📄 License

MIT License - See [LICENSE](../../LICENSE)

---

**Built with ❤️ by nirholas | nichxbt**

<!-- EOF: universal-crypto-mcp | ucm:n1ch-0las-4e49-4348 -->
