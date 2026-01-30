# BNB Chain MCP Server

> Official BNB Chain integration for BSC, opBNB, and Greenfield blockchain interactions.

## Attribution

**Original Author:** [BNB Chain](https://github.com/bnb-chain)  
**Original Repository:** [bnbchain-mcp](https://github.com/bnb-chain/bnbchain-mcp)  
**License:** MIT

**Integration & Enhancements by:** Nich ([@nichxbt](https://x.com/nichxbt))

## Supported Networks

| Network | Chain ID | Description |
|---------|----------|-------------|
| BSC Mainnet | 56 | BNB Smart Chain |
| BSC Testnet | 97 | BNB Smart Chain Testnet |
| opBNB Mainnet | 204 | Layer 2 solution |
| opBNB Testnet | 5611 | opBNB Testnet |
| Greenfield | - | Decentralized storage |

## Features

### From Original Implementation
- ✅ Wallet balance queries
- ✅ Transaction sending
- ✅ Token transfers (BEP-20)
- ✅ Contract interactions
- ✅ Gas estimation
- ✅ Block/transaction queries
- ✅ Greenfield storage operations

### Our Enhancements (Apache-2.0)
- ✅ Unified API compatibility
- ✅ Multi-network switching
- ✅ PancakeSwap integration
- ✅ Venus protocol integration
- ✅ Cross-chain bridge support
- ✅ Gas optimization

## Installation

```bash
pnpm add @nirholas/bnbchain-mcp
```

## Configuration

```bash
export BSC_RPC_URL=https://bsc-dataseed.binance.org
export PRIVATE_KEY=your_private_key  # Optional, for transactions
```

## Usage

### With MCP Server

```typescript
import { registerBNBChainTools } from '@nirholas/bnbchain-mcp';
import { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';

const server = new McpServer({ name: 'my-bsc-server', version: '1.0.0' });
registerBNBChainTools(server);
```

### Standalone

```typescript
import { BNBChainClient } from '@nirholas/bnbchain-mcp';

const client = new BNBChainClient({ network: 'mainnet' });

// Get BNB balance
const balance = await client.getBalance('0x...');

// Send BNB
const tx = await client.sendBNB('0x...to', '0.1');

// Interact with contract
const result = await client.callContract('0x...contract', 'balanceOf', ['0x...address']);
```

## Available Tools

| Tool | Description |
|------|-------------|
| `bnb_balance` | Get BNB balance for an address |
| `bnb_token_balance` | Get BEP-20 token balance |
| `bnb_send` | Send BNB to an address |
| `bnb_send_token` | Send BEP-20 tokens |
| `bnb_gas_price` | Get current gas price |
| `bnb_block` | Get block information |
| `bnb_transaction` | Get transaction details |
| `bnb_contract_call` | Call a smart contract |
| `bnb_pancakeswap_quote` | Get PancakeSwap swap quote |
| `greenfield_upload` | Upload file to Greenfield |
| `greenfield_download` | Download file from Greenfield |

## Example Queries

```
What's the BNB balance of 0x...?
```

```
Send 0.1 BNB to 0x...
```

```
Get a swap quote for 1 BNB to CAKE on PancakeSwap
```

## License

- Original Implementation: MIT (BNB Chain)
- Enhancements: Apache-2.0 (Nich)
