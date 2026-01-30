# Solana Agent Kit MCP

> **Part of [Universal Crypto MCP](https://github.com/nirholas/universal-crypto-mcp)**  
> By [nich](https://x.com/nichxbt)

AI-powered Solana blockchain toolkit for Claude and other LLM agents.

## Features

- 🔑 **Wallet Management** - Balance, tokens, staking info
- 💱 **Token Swaps** - Jupiter aggregator integration
- 📤 **Transfers** - SOL and SPL token transfers
- 🥩 **Staking** - Stake SOL with validators
- 📊 **Token Info** - Metadata and analytics

## Tools

| Tool | Description |
|------|-------------|
| `solana_get_wallet` | Get wallet balance and token holdings |
| `solana_swap_quote` | Get swap quote from Jupiter |
| `solana_transfer` | Transfer SOL or SPL tokens |
| `solana_stake` | Stake SOL with a validator |
| `solana_token_metadata` | Get token metadata |

## Usage

```typescript
import { registerSolanaAgentKit } from '@nirholas/solana-agent-kit';

registerSolanaAgentKit(server);
```

## Example Prompts

- "What's the SOL balance of wallet ABC123...?"
- "Get a swap quote for 10 SOL to USDC"
- "Show me the top Solana validators"

## License

MIT - See [LICENSE](./LICENSE)

---
**Author**: nich (@nichxbt) | [x.com/nichxbt](https://x.com/nichxbt)
