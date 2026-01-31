# ChainAware MCP Server

> AI-powered wallet behavior prediction, fraud detection, and rug pull prediction.

## Attribution

**Original Author:** [ChainAware](https://github.com/ChainAware)  
**Original Repository:** [behavioral-prediction-mcp](https://github.com/ChainAware/behavioral-prediction-mcp)  
**License:** MIT

**Integration & Enhancements by:** Nich ([@nichxbt](https://x.com/nichxbt))

## Features

### From Original Implementation
- ✅ Wallet behavior prediction
- ✅ Fraud detection
- ✅ Rug pull prediction
- ✅ Transaction pattern analysis
- ✅ Risk scoring

### Our Enhancements (Apache-2.0)
- ✅ Unified API integration
- ✅ Batch wallet analysis
- ✅ Historical risk tracking
- ✅ Token contract analysis
- ✅ DEX interaction scoring
- ✅ Alert system for high-risk activities

## Supported Chains

| Chain | Status |
|-------|--------|
| Ethereum | ✅ Full support |
| BSC | ✅ Full support |
| Polygon | ✅ Full support |
| Arbitrum | ✅ Full support |
| Base | ✅ Full support |
| Solana | 🔜 Coming soon |

## Installation

```bash
pnpm add @nirholas/chainaware-mcp
```

## Usage

### With MCP Server

```typescript
import { registerChainAwareTools } from '@nirholas/chainaware-mcp';
import { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';

const server = new McpServer({ name: 'my-security-server', version: '1.0.0' });
registerChainAwareTools(server);
```

### Standalone

```typescript
import { ChainAwareClient } from '@nirholas/chainaware-mcp';

const client = new ChainAwareClient();

// Analyze wallet risk
const risk = await client.analyzeWallet('0x...');

// Check for rug pull indicators
const rugCheck = await client.checkRugPull('0x...token');

// Predict wallet behavior
const prediction = await client.predictBehavior('0x...');
```

## Available Tools

| Tool | Description |
|------|-------------|
| `chainaware_wallet_risk` | Get risk score for a wallet address |
| `chainaware_rug_check` | Check token for rug pull indicators |
| `chainaware_fraud_detection` | Detect fraudulent patterns |
| `chainaware_behavior_prediction` | Predict wallet future behavior |
| `chainaware_contract_audit` | Quick smart contract risk analysis |
| `chainaware_batch_analysis` | Analyze multiple addresses at once |

## Risk Score Interpretation

| Score | Risk Level | Description |
|-------|------------|-------------|
| 0-20 | 🟢 Low | Trusted address with clean history |
| 21-40 | 🟡 Medium-Low | Minor flags, generally safe |
| 41-60 | 🟠 Medium | Some concerning patterns |
| 61-80 | 🔴 High | Significant risk indicators |
| 81-100 | ⚫ Critical | Known bad actor or high scam probability |

## Example Queries

```
Is this wallet address safe to interact with: 0x...?
```

```
Check if this token might be a rug pull: 0x...
```

```
Analyze the behavior patterns of this trader
```

## License

- Original Implementation: MIT (ChainAware)
- Enhancements: Apache-2.0 (Nich)
