[**Universal Crypto MCP API Reference v1.0.0**](../../../index.md)

***

[Universal Crypto MCP API Reference](/docs/api/index.md) / agents/agenti/src/agent

# agents/agenti/src/agent

## Example

```typescript
import { Agent, AgentConfig } from '@universal-crypto-mcp/agenti';

const config: AgentConfig = {
  name: 'trading-agent',
  description: 'Automated trading agent with guardrails',
  enableMetrics: true,
};

const agent = new Agent(config);

// Execute an action with guardrails
const result = await agent.executeAction(
  { type: 'swap', context: 'Token swap on Uniswap' },
  async () => performSwap(params)
);
```

## Classes

### Agents

#### Agent

Defined in: [agents/agenti/src/agent.ts:123](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/agents/agenti/src/agent.ts#L123)

Base AI Agent class with built-in guardrails, observability, and HITL support.

The Agent class provides a foundation for building AI-powered crypto agents
with enterprise-grade safety features:

- **Guardrails**: Validate actions before execution
- **HITL**: Human-in-the-loop approval for sensitive operations  
- **Metrics**: Prometheus-compatible observability
- **Logging**: Structured logging for debugging

 Agent

##### Example

```typescript
const agent = new Agent({
  name: 'trading-bot',
  enableMetrics: true,
});

// Execute with automatic guardrail checking
const result = await agent.executeAction(
  { type: 'transfer', context: 'Send 1 ETH' },
  async () => wallet.sendTransaction(tx)
);
```

##### Constructors

###### Constructor

```ts
new Agent(config: AgentConfig): Agent;
```

Defined in: [agents/agenti/src/agent.ts:132](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/agents/agenti/src/agent.ts#L132)

###### Parameters

| Parameter | Type |
| :------ | :------ |
| `config` | [`AgentConfig`](/docs/api/agents/agenti/src/agent.md#agentconfig) |

###### Returns

[`Agent`](/docs/api/agents/agenti/src/agent.md#agent)

##### Methods

###### executeAction()

```ts
executeAction<T>(action: AgentAction, executor: () => Promise<T>): Promise<T>;
```

Defined in: [agents/agenti/src/agent.ts:217](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/agents/agenti/src/agent.ts#L217)

Execute an action through guardrails with optional HITL approval.

This method provides the core execution pathway that:
1. Validates the action against guardrails
2. Optionally requests human approval (HITL)
3. Executes the action and records metrics

###### Type Parameters

| Type Parameter | Description |
| :------ | :------ |
| `T` | The return type of the action executor |

###### Parameters

| Parameter | Type | Description |
| :------ | :------ | :------ |
| `action` | `AgentAction` | The action to execute with type and context |
| `executor` | () => `Promise`\<`T`\> | Async function that performs the actual action |

###### Returns

`Promise`\<`T`\>

Promise resolving to the action result

###### Throws

Error if guardrails block the action or execution fails

###### Example

```typescript
const result = await agent.executeAction(
  { type: 'swap', context: 'Swap 100 USDC for ETH' },
  async () => uniswap.swap({ tokenIn: 'USDC', tokenOut: 'ETH', amount: 100 })
);
```

###### getCoreVersion()

```ts
getCoreVersion(): string;
```

Defined in: [agents/agenti/src/agent.ts:183](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/agents/agenti/src/agent.ts#L183)

Gets the core library version the agent is using.

###### Returns

`string`

Semantic version string

###### getDescription()

```ts
getDescription(): string;
```

Defined in: [agents/agenti/src/agent.ts:175](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/agents/agenti/src/agent.ts#L175)

Gets the agent's human-readable description.

###### Returns

`string`

The description or default fallback

###### getGuardrails()

```ts
getGuardrails(): AgentGuardrails;
```

Defined in: [agents/agenti/src/agent.ts:191](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/agents/agenti/src/agent.ts#L191)

Gets the guardrails instance used by this agent.

###### Returns

`AgentGuardrails`

The AgentGuardrails instance

###### getMetrics()

```ts
getMetrics(): string;
```

Defined in: [agents/agenti/src/agent.ts:286](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/agents/agenti/src/agent.ts#L286)

Get metrics in Prometheus format

###### Returns

`string`

###### getName()

```ts
getName(): string;
```

Defined in: [agents/agenti/src/agent.ts:167](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/agents/agenti/src/agent.ts#L167)

Gets the agent's unique name identifier.

###### Returns

`string`

The agent name string

###### shutdown()

```ts
shutdown(): Promise<void>;
```

Defined in: [agents/agenti/src/agent.ts:293](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/agents/agenti/src/agent.ts#L293)

Shutdown the agent gracefully

###### Returns

`Promise`\<`void`\>

## Interfaces

### Agents

#### AgentConfig

Defined in: [agents/agenti/src/agent.ts:63](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/agents/agenti/src/agent.ts#L63)

Configuration options for creating an Agent instance.

 AgentConfig

##### Example

```typescript
const config: AgentConfig = {
  name: 'my-agent',
  description: 'DeFi trading agent',
  enableMetrics: true,
};
```

##### Properties

| Property | Type | Description | Defined in |
| :------ | :------ | :------ | :------ |
| <a id="description"></a> `description?` | `string` | Human-readable description of the agent's purpose | [agents/agenti/src/agent.ts:67](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/agents/agenti/src/agent.ts#L67) |
| <a id="enablemetrics"></a> `enableMetrics?` | `boolean` | Enable Prometheus-compatible metrics collection | [agents/agenti/src/agent.ts:75](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/agents/agenti/src/agent.ts#L75) |
| <a id="guardrails"></a> `guardrails?` | `any` | Custom guardrails for action validation | [agents/agenti/src/agent.ts:69](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/agents/agenti/src/agent.ts#L69) |
| <a id="hitl"></a> `hitl?` | `any` | Human-in-the-loop manager for approval workflows | [agents/agenti/src/agent.ts:71](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/agents/agenti/src/agent.ts#L71) |
| <a id="logger"></a> `logger?` | `any` | Custom logger instance | [agents/agenti/src/agent.ts:73](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/agents/agenti/src/agent.ts#L73) |
| <a id="name"></a> `name` | `string` | Unique name identifier for the agent | [agents/agenti/src/agent.ts:65](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/agents/agenti/src/agent.ts#L65) |

***

#### AgentMetrics

Defined in: [agents/agenti/src/agent.ts:84](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/agents/agenti/src/agent.ts#L84)

Prometheus-compatible metrics for agent observability.

 AgentMetrics

##### Properties

| Property | Type | Description | Defined in |
| :------ | :------ | :------ | :------ |
| <a id="actionduration"></a> `actionDuration` | `Histogram` | Histogram tracking action execution duration | [agents/agenti/src/agent.ts:90](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/agents/agenti/src/agent.ts#L90) |
| <a id="actionsblocked"></a> `actionsBlocked` | `Counter` | Counter for actions blocked by guardrails | [agents/agenti/src/agent.ts:88](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/agents/agenti/src/agent.ts#L88) |
| <a id="actionsexecuted"></a> `actionsExecuted` | `Counter` | Counter for total actions executed by the agent | [agents/agenti/src/agent.ts:86](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/agents/agenti/src/agent.ts#L86) |
| <a id="activeoperations"></a> `activeOperations` | `Gauge` | Gauge tracking currently active operations | [agents/agenti/src/agent.ts:92](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/agents/agenti/src/agent.ts#L92) |

## Functions

### createAgent()

```ts
function createAgent(config: AgentConfig): Agent;
```

Defined in: [agents/agenti/src/agent.ts:303](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/agents/agenti/src/agent.ts#L303)

#### Parameters

| Parameter | Type |
| :------ | :------ |
| `config` | [`AgentConfig`](/docs/api/agents/agenti/src/agent.md#agentconfig) |

#### Returns

[`Agent`](/docs/api/agents/agenti/src/agent.md#agent)

***

### createDevAgent()

```ts
function createDevAgent(config: Omit<AgentConfig, "hitl">): Agent;
```

Defined in: [agents/agenti/src/agent.ts:310](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/agents/agenti/src/agent.ts#L310)

Create an agent with console HITL for development

#### Parameters

| Parameter | Type |
| :------ | :------ |
| `config` | `Omit`\<[`AgentConfig`](/docs/api/agents/agenti/src/agent.md#agentconfig), `"hitl"`\> |

#### Returns

[`Agent`](/docs/api/agents/agenti/src/agent.md#agent)

