# Running 10 Parallel Agents - Quick Reference

## 📋 Overview

This document provides a quick reference for running 10 Claude Opus 4.5 agents in parallel to build out the universal-crypto-mcp repository.

## 🗂️ Prompt Files

- **Section 1**: `AGENT_PROMPTS_SECTION_1.md` - Agents 1-5 (x402-deploy)
- **Section 2**: `AGENT_PROMPTS_SECTION_2.md` - Agents 6-10 (Restructure)

## ⚡ Quick Start

### Step 1: Open 10 VS Code Windows/Tabs

Each agent needs its own Claude chat session.

### Step 2: Copy Agent Prompts

| Agent | File | Section Header |
|-------|------|----------------|
| 1 | Section 1 | `## 🔵 AGENT 1: Core Architect` |
| 2 | Section 1 | `## 🟢 AGENT 2: Gateway (MCP/API Wrapper)` |
| 3 | Section 1 | `## 🟡 AGENT 3: Deploy Templates & Builders` |
| 4 | Section 1 | `## 🟠 AGENT 4: Discovery (x402scan Integration)` |
| 5 | Section 1 | `## 🔴 AGENT 5: Dashboard (Earnings & Analytics)` |
| 6 | Section 2 | `## 🟣 AGENT 6: Restructure` |
| 7 | Section 2 | `## 🟤 AGENT 7: Trading & Market Data` |
| 8 | Section 2 | `## ⚫ AGENT 8: Wallet Packages` |
| 9 | Section 2 | `## ⚪ AGENT 9: DeFi & Payments` |
| 10 | Section 2 | `## 🔘 AGENT 10: Documentation` |

### Step 3: Paste to Each Agent

Copy the **Detailed Instructions** markdown block from each agent's section.

## 🚦 Execution Order

```
┌─────────────────────────────────────────────────────────┐
│                      WAVE 1 (Start Immediately)          │
│                                                         │
│   Agent 1 (Core)    Agent 6 (Restructure)   Agent 10    │
│   ────────────────  ────────────────────   ──────────   │
│   Creates x402-     Creates /packages/     Works on     │
│   deploy base       structure              /docs/       │
└─────────────────────────────────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────┐
│                      WAVE 2 (After directories exist)   │
│                                                         │
│   Agent 2 (Gateway)     Agent 3 (Templates)             │
│   Agent 4 (Discovery)   Agent 5 (Dashboard)             │
│   Agent 7 (Trading)     Agent 8 (Wallets)               │
│   Agent 9 (DeFi)                                        │
└─────────────────────────────────────────────────────────┘
```

## 🎯 Directory Ownership

```
/x402-deploy/
├── src/cli/           → Agent 1
├── src/types/         → Agent 1
├── src/utils/         → Agent 1
├── src/gateway/       → Agent 2
├── src/templates/     → Agent 3
├── src/builders/      → Agent 3
├── src/deployers/     → Agent 3
├── src/discovery/     → Agent 4
└── src/dashboard/     → Agent 5

/packages/
├── core/              → Agent 6
├── shared/            → Agent 6
├── agents/            → Agent 6
├── automation/        → Agent 6
├── generators/        → Agent 6
├── trading/           → Agent 7
├── market-data/       → Agent 7
├── wallets/           → Agent 8
├── defi/              → Agent 9
└── payments/          → Agent 9

/docs/                 → Agent 10
/examples/             → Agent 10
/tests/                → Agent 10
```

## ✅ Post-Execution Checklist

After all agents complete:

```bash
# 1. Install dependencies
pnpm install

# 2. Build all packages
pnpm build

# 3. Run tests
pnpm test

# 4. Check for type errors
pnpm typecheck

# 5. Lint
pnpm lint
```

## 🔄 If Conflicts Occur

1. Stop both conflicting agents
2. Manually resolve the conflict
3. Resume agents with updated context

## 📞 Agent Communication

Agents do NOT communicate with each other. Each agent:
- Works in its designated directories only
- Creates complete, working code
- Follows shared interfaces from core packages
- Uses workspace:* for internal dependencies

## 🎨 Naming Conventions

All packages follow: `@universal-crypto-mcp/[category]-[name]`

Examples:
- `@universal-crypto-mcp/core`
- `@universal-crypto-mcp/trading-binance`
- `@universal-crypto-mcp/wallet-evm`
- `@nirholas/x402-deploy` (separate product)
