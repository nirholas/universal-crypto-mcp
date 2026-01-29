# Orbitt MCP - Agent Coordination System

## Overview

This document defines 5 specialized Claude Opus 4.5 agents that will collaboratively build the complete Orbitt MCP system - a volume boosting and token management platform for Solana, exposed via Model Context Protocol for Claude Desktop.

## Architecture

```
┌─────────────────────────────────────────────────────────────────┐
│                     Claude Desktop (MCP Client)                  │
└─────────────────────────────────┬───────────────────────────────┘
                                  │
┌─────────────────────────────────▼───────────────────────────────┐
│                        MCP Server (Agent 5)                      │
│   Tools | Resources | Prompts | Auth | Rate Limiting            │
└──────┬─────────┬─────────┬─────────┬─────────┬──────────────────┘
       │         │         │         │         │
┌──────▼───┐ ┌───▼───┐ ┌───▼───┐ ┌───▼───┐ ┌───▼───┐
│ Token    │ │Volume │ │Trading│ │Wallet │ │Market │
│ Launcher │ │Bots   │ │Engine │ │Manager│ │Data   │
│(Agent 1) │ │(Agt 2)│ │(Agt 3)│ │(Agt 4)│ │(Agt 5)│
└──────┬───┘ └───┬───┘ └───┬───┘ └───┬───┘ └───┬───┘
       │         │         │         │         │
┌──────▼─────────▼─────────▼─────────▼─────────▼──────┐
│                 Solana Blockchain                    │
│     Raydium | PumpFun | Meteora | Jupiter | SPL     │
└─────────────────────────────────────────────────────┘
```

## Build Order (CRITICAL)

**Execute agents in this order to resolve dependencies:**

1. **Agent 4**: Wallet Manager (foundation - no dependencies)
   - Prompt: `agent-4-wallet-manager.md`
   - Package: `packages/wallet-manager`
   
2. **Agent 1**: Token Launcher (depends on wallet-manager)
   - Prompt: `agent-1-token-launcher.md`
   - Package: `packages/token-launcher`
   
3. **Agent 3**: Trading Engine (depends on wallet-manager)
   - Prompt: `agent-3-trading-engine.md`
   - Package: `packages/trading-engine`
   
4. **Agent 2**: Volume Bots (depends on wallet-manager, trading-engine)
   - Prompt: `agent-2-volume-bots.md`
   - Package: `packages/volume-bots`
   
5. **Agent 5**: MCP Server (integrates all packages)
   - Prompt: `agent-5-mcp-integration.md`
   - Package: `packages/mcp-server` (already scaffolded)

## Agent Prompts

| Agent | File | Package | Dependencies |
|-------|------|---------|--------------|
| 1 - Token Launcher | `agent-1-token-launcher.md` | token-launcher | wallet-manager |
| 2 - Volume Bots | `agent-2-volume-bots.md` | volume-bots | wallet-manager, trading-engine |
| 3 - Trading Engine | `agent-3-trading-engine.md` | trading-engine | wallet-manager |
| 4 - Wallet Manager | `agent-4-wallet-manager.md` | wallet-manager | none |
| 5 - MCP Integration | `agent-5-mcp-integration.md` | mcp-server | all |

## Shared Dependencies

All agents use:
- `@solana/web3.js` ^1.87.0 - Solana SDK
- `@solana/spl-token` ^0.3.9 - SPL Token operations
- `zod` ^3.22.0 - Input validation
- `pino` ^8.17.0 - Logging
- TypeScript 5.x - Language

## Environment Variables

```bash
# Required
SOLANA_RPC_URL=https://mainnet.helius-rpc.com/?api-key=YOUR_KEY
MASTER_PASSWORD=your-32-char-encryption-key-here
DATABASE_URL=postgresql://user:pass@localhost:5432/orbitt

# Optional
REDIS_URL=redis://localhost:6379
JITO_API_KEY=your-jito-key
JUPITER_API_KEY=your-jupiter-key
LOG_LEVEL=info
```

## Package Structure (Final)

```
packages/
├── wallet-manager/      # Agent 4 - Wallet CRUD, swarms, encryption
├── token-launcher/      # Agent 1 - Token creation, LP deployment
├── trading-engine/      # Agent 3 - Swap execution, Jupiter/DEX
├── volume-bots/         # Agent 2 - Bot orchestration, campaigns
└── mcp-server/          # Agent 5 - MCP protocol, tool exposure
```

## Feature Mapping (Orbitt → MCP Tools)

| Orbitt Feature | MCP Tool | Package |
|---------------|----------|---------|
| Create Wallets | `create_wallet_swarm` | wallet-manager |
| Fund Wallets | `distribute_funds` | wallet-manager |
| Collect Funds | `consolidate_funds` | wallet-manager |
| Create Token | `create_token` | token-launcher |
| Launch on PumpFun | `create_pumpfun_token` | token-launcher |
| Add Raydium LP | `create_raydium_pool` | token-launcher |
| Snipe Launch | `snipe_launch` | token-launcher |
| Buy Token | `buy_token` | trading-engine |
| Sell Token | `sell_token` | trading-engine |
| Start Volume | `start_campaign` | volume-bots |
| Pause Volume | `pause_campaign` | volume-bots |
| Merge Bots | `merge_bots` | volume-bots |
| Split Bots | `split_bots` | volume-bots |
| Speed Control | `set_campaign_speed` | volume-bots |
| DexScreener Reactions | `add_dexscreener_reactions` | volume-bots |

## Tool Count by Package

- **wallet-manager**: 10 tools
- **token-launcher**: 8 tools
- **trading-engine**: 12 tools
- **volume-bots**: 15 tools
- **analysis**: 5 tools
- **Total**: 50 MCP tools
