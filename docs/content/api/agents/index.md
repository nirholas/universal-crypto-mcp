---
title: "Agents API Reference"
description: "API documentation for AI agents and autonomous trading packages"
category: "api"
keywords: ["api", "agents", "ai", "autonomous", "agent-wallet", "cdp"]
order: 6
---

# Agents API Reference

Agent packages enable AI-powered autonomous trading and on-chain operations.

## Packages

| Package | Description |
|---------|-------------|
| `@nirholas/agent-wallet` | CDP-based agent wallets |
| `@nirholas/agents-ai` | AI agent framework |
| `@nirholas/agents-autonomous` | Autonomous trading agents |
| `@nirholas/agents-plugins` | Agent plugin system |

---

## Agent Wallet (CDP)

The Agent Wallet package provides Coinbase Developer Platform (CDP) integration for AI agents.

### Installation

```bash
pnpm add @nirholas/agent-wallet
```

### Configuration

```typescript
import { AgentWallet } from '@nirholas/agent-wallet'

const wallet = new AgentWallet({
  cdpApiKeyName: process.env.CDP_API_KEY_NAME!,
  cdpApiKeyPrivate: process.env.CDP_API_KEY_PRIVATE!,
  network: 'base-mainnet', // or 'base-sepolia' for testnet
})
```

### Wallet Management

#### createWallet

Create a new agent wallet.

```typescript
async function createWallet(options?: CreateWalletOptions): Promise<Wallet>

interface CreateWalletOptions {
  name?: string
  network?: NetworkId
}

interface Wallet {
  id: string
  address: string
  network: NetworkId
  createdAt: Date
}

type NetworkId = 
  | 'base-mainnet'
  | 'base-sepolia'
  | 'ethereum-mainnet'
  | 'ethereum-sepolia'
  | 'polygon-mainnet'
  | 'arbitrum-mainnet'
```

**Example:**

```typescript
const wallet = await agentWallet.createWallet({
  name: 'trading-agent-1',
  network: 'base-mainnet',
})
console.log(`Created wallet: ${wallet.address}`)
```

#### getWallet

Get wallet by ID.

```typescript
async function getWallet(walletId: string): Promise<Wallet>
```

#### listWallets

List all wallets.

```typescript
async function listWallets(): Promise<Wallet[]>
```

#### exportWallet

Export wallet for backup.

```typescript
async function exportWallet(walletId: string): Promise<ExportedWallet>

interface ExportedWallet {
  walletId: string
  seed: string
  networkId: string
}
```

#### importWallet

Import a previously exported wallet.

```typescript
async function importWallet(data: ExportedWallet): Promise<Wallet>
```

---

### Balance & Transfers

#### getBalance

Get wallet balance.

```typescript
async function getBalance(
  walletId: string,
  asset?: string
): Promise<Balance>

interface Balance {
  asset: string
  amount: string
  decimals: number
}
```

#### transfer

Transfer assets between addresses.

```typescript
async function transfer(params: TransferParams): Promise<TransferResult>

interface TransferParams {
  walletId: string
  to: string
  amount: string
  asset: string  // 'eth', 'usdc', or token address
  gasless?: boolean
}

interface TransferResult {
  transactionHash: string
  status: 'pending' | 'confirmed' | 'failed'
  explorerUrl: string
}
```

**Example:**

```typescript
// Send ETH
const tx = await wallet.transfer({
  walletId: wallet.id,
  to: '0x...',
  amount: '0.1',
  asset: 'eth',
})

// Send USDC (gasless)
const usdcTx = await wallet.transfer({
  walletId: wallet.id,
  to: '0x...',
  amount: '100',
  asset: 'usdc',
  gasless: true,
})
```

---

### Trading Operations

#### trade

Execute a token trade.

```typescript
async function trade(params: TradeParams): Promise<TradeResult>

interface TradeParams {
  walletId: string
  fromAsset: string
  toAsset: string
  amount: string
  slippage?: number  // Default: 0.5%
}

interface TradeResult {
  transactionHash: string
  fromAmount: string
  toAmount: string
  price: string
  fee: string
  explorerUrl: string
}
```

**Example:**

```typescript
// Swap ETH for USDC
const trade = await wallet.trade({
  walletId: wallet.id,
  fromAsset: 'eth',
  toAsset: 'usdc',
  amount: '0.5',
  slippage: 0.01,
})

console.log(`Received ${trade.toAmount} USDC`)
```

---

### Smart Contract Interaction

#### deployContract

Deploy a smart contract.

```typescript
async function deployContract(params: DeployParams): Promise<DeployResult>

interface DeployParams {
  walletId: string
  abi: object[]
  bytecode: string
  constructorArgs?: unknown[]
}

interface DeployResult {
  contractAddress: string
  transactionHash: string
  explorerUrl: string
}
```

#### invokeContract

Call a smart contract method.

```typescript
async function invokeContract(params: InvokeParams): Promise<InvokeResult>

interface InvokeParams {
  walletId: string
  contractAddress: string
  abi: object[]
  method: string
  args?: unknown[]
  value?: string  // ETH to send
}

interface InvokeResult {
  transactionHash: string
  result?: unknown
  explorerUrl: string
}
```

#### readContract

Read data from a smart contract (no transaction).

```typescript
async function readContract(params: ReadParams): Promise<unknown>

interface ReadParams {
  contractAddress: string
  abi: object[]
  method: string
  args?: unknown[]
  network: NetworkId
}
```

---

## AI Agent Framework

### Installation

```bash
pnpm add @nirholas/agents-ai
```

### Creating an Agent

```typescript
import { createAgent, AgentConfig } from '@nirholas/agents-ai'

const config: AgentConfig = {
  name: 'trading-agent',
  model: 'gpt-4o',
  personality: 'You are a professional crypto trader...',
  tools: ['market-data', 'trading', 'portfolio'],
  wallet: agentWallet,
}

const agent = await createAgent(config)
```

### Agent Configuration

```typescript
interface AgentConfig {
  name: string
  model: 'gpt-4o' | 'gpt-4' | 'claude-3-opus' | 'claude-3-sonnet'
  personality: string
  tools: AgentTool[]
  wallet?: AgentWallet
  memory?: MemoryConfig
  maxIterations?: number
  timeout?: number
}

interface MemoryConfig {
  type: 'short-term' | 'long-term' | 'both'
  maxTokens?: number
  persistPath?: string
}

type AgentTool = 
  | 'market-data'
  | 'trading'
  | 'portfolio'
  | 'social'
  | 'news'
  | 'technical-analysis'
  | 'on-chain'
```

### Running the Agent

```typescript
// Execute a single task
const result = await agent.run('Analyze BTC market conditions')

// Stream responses
for await (const chunk of agent.stream('Explain current ETH trends')) {
  process.stdout.write(chunk)
}

// Chat interface
const response = await agent.chat([
  { role: 'user', content: 'Should I buy LINK right now?' }
])
```

### Agent Actions

```typescript
interface AgentAction {
  type: 'trade' | 'analyze' | 'alert' | 'report'
  params: Record<string, unknown>
  reasoning: string
  confidence: number
}

// Listen for actions
agent.on('action', async (action: AgentAction) => {
  if (action.confidence > 0.8) {
    await executeAction(action)
  }
})
```

---

## Autonomous Agents

### Installation

```bash
pnpm add @nirholas/agents-autonomous
```

### Autonomous Trading Agent

```typescript
import { AutonomousTrader } from '@nirholas/agents-autonomous'

const trader = new AutonomousTrader({
  wallet: agentWallet,
  strategy: 'momentum',
  riskProfile: 'moderate',
  maxTradeSize: '1000',      // USDC
  maxDailyTrades: 10,
  allowedTokens: ['WETH', 'WBTC', 'LINK', 'UNI'],
  excludedTokens: ['SHIB', 'DOGE'],
})

// Start autonomous trading
await trader.start()

// Monitor performance
trader.on('trade', (trade) => {
  console.log(`Executed: ${trade.side} ${trade.amount} ${trade.token}`)
})

trader.on('decision', (decision) => {
  console.log(`Decision: ${decision.action} - ${decision.reasoning}`)
})

// Get stats
const stats = trader.getStats()
console.log(`Win rate: ${stats.winRate}%`)
console.log(`Total PnL: $${stats.totalPnL}`)

// Stop trading
await trader.stop()
```

### Strategy Configuration

```typescript
interface StrategyConfig {
  type: 'momentum' | 'mean-reversion' | 'arbitrage' | 'sentiment' | 'custom'
  timeframe: '1m' | '5m' | '15m' | '1h' | '4h' | '1d'
  indicators: IndicatorConfig[]
  entryConditions: Condition[]
  exitConditions: Condition[]
  positionSizing: 'fixed' | 'kelly' | 'volatility-adjusted'
}

interface IndicatorConfig {
  name: string
  params: Record<string, number>
  weight?: number
}

interface Condition {
  indicator: string
  operator: '>' | '<' | '>=' | '<=' | '==' | 'crosses_above' | 'crosses_below'
  value: number | string
}
```

---

## Agent Plugins

### Installation

```bash
pnpm add @nirholas/agents-plugins
```

### Available Plugins

```typescript
import {
  MarketDataPlugin,
  TechnicalAnalysisPlugin,
  NewsPlugin,
  SocialSentimentPlugin,
  OnChainDataPlugin,
  PortfolioPlugin,
} from '@nirholas/agents-plugins'

// Add plugins to agent
agent.use(MarketDataPlugin({ providers: ['coingecko', 'dexscreener'] }))
agent.use(TechnicalAnalysisPlugin())
agent.use(NewsPlugin({ sources: ['coindesk', 'cointelegraph'] }))
agent.use(SocialSentimentPlugin({ platforms: ['twitter', 'reddit'] }))
agent.use(OnChainDataPlugin({ chains: ['ethereum', 'base'] }))
agent.use(PortfolioPlugin())
```

### Creating Custom Plugins

```typescript
import { AgentPlugin, PluginContext } from '@nirholas/agents-plugins'

const myPlugin: AgentPlugin = {
  name: 'my-plugin',
  version: '1.0.0',
  
  tools: [
    {
      name: 'my_custom_tool',
      description: 'Does something useful',
      parameters: {
        type: 'object',
        properties: {
          input: { type: 'string', description: 'Input value' }
        },
        required: ['input']
      },
      handler: async (params, context: PluginContext) => {
        // Plugin implementation
        return { result: `Processed: ${params.input}` }
      }
    }
  ],
  
  onLoad: async (context) => {
    console.log('Plugin loaded')
  },
  
  onUnload: async (context) => {
    console.log('Plugin unloaded')
  }
}

agent.use(myPlugin)
```

---

## Error Types

```typescript
class AgentError extends Error {
  code: string
}

// Wallet errors
class WalletNotFoundError extends AgentError {}
class InsufficientFundsError extends AgentError {}
class TransactionFailedError extends AgentError {}
class NetworkError extends AgentError {}

// Agent errors
class AgentConfigError extends AgentError {}
class ToolExecutionError extends AgentError {}
class ModelError extends AgentError {}
class MemoryError extends AgentError {}

// Plugin errors
class PluginLoadError extends AgentError {}
class PluginNotFoundError extends AgentError {}
```

---

## Type Exports

```typescript
// Re-export all types
export type {
  AgentConfig,
  AgentAction,
  AgentPlugin,
  PluginContext,
  Wallet,
  Balance,
  TransferParams,
  TransferResult,
  TradeParams,
  TradeResult,
  StrategyConfig,
  IndicatorConfig,
  NetworkId,
}
```
