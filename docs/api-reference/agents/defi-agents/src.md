[**Universal Crypto MCP API Reference v1.0.0**](../../index.md)

***

[Universal Crypto MCP API Reference](/docs/api/index.md) / agents/defi-agents/src

# agents/defi-agents/src

## Classes

### DeFiAgent

Defined in: [agents/defi-agents/src/index.ts:122](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/agents/defi-agents/src/index.ts#L122)

#### Constructors

##### Constructor

```ts
new DeFiAgent(config: DeFiAgentConfig): DeFiAgent;
```

Defined in: [agents/defi-agents/src/index.ts:129](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/agents/defi-agents/src/index.ts#L129)

###### Parameters

| Parameter | Type |
| :------ | :------ |
| `config` | [`DeFiAgentConfig`](/docs/api/agents/defi-agents/src.md#defiagentconfig) |

###### Returns

[`DeFiAgent`](/docs/api/agents/defi-agents/src.md#defiagent)

#### Methods

##### approveAction()

```ts
approveAction(
   approvalId: string, 
   reviewer: string, 
notes?: string): Promise<boolean>;
```

Defined in: [agents/defi-agents/src/index.ts:307](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/agents/defi-agents/src/index.ts#L307)

Approve a pending action

###### Parameters

| Parameter | Type |
| :------ | :------ |
| `approvalId` | `string` |
| `reviewer` | `string` |
| `notes?` | `string` |

###### Returns

`Promise`\<`boolean`\>

##### emergencyStop()

```ts
emergencyStop(): void;
```

Defined in: [agents/defi-agents/src/index.ts:277](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/agents/defi-agents/src/index.ts#L277)

Emergency stop - activates kill switch

###### Returns

`void`

##### executeAction()

```ts
executeAction(action: AgentAction): Promise<ExecutionResult>;
```

Defined in: [agents/defi-agents/src/index.ts:191](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/agents/defi-agents/src/index.ts#L191)

Execute an action with guardrails

###### Parameters

| Parameter | Type |
| :------ | :------ |
| `action` | `AgentAction` |

###### Returns

`Promise`\<[`ExecutionResult`](/docs/api/agents/defi-agents/src.md#executionresult)\>

##### getCapabilities()

```ts
getCapabilities(): DeFiCapability[];
```

Defined in: [agents/defi-agents/src/index.ts:176](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/agents/defi-agents/src/index.ts#L176)

###### Returns

[`DeFiCapability`](/docs/api/agents/defi-agents/src.md#deficapability)[]

##### getChains()

```ts
getChains(): string[];
```

Defined in: [agents/defi-agents/src/index.ts:168](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/agents/defi-agents/src/index.ts#L168)

###### Returns

`string`[]

##### getCoreVersion()

```ts
getCoreVersion(): string;
```

Defined in: [agents/defi-agents/src/index.ts:184](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/agents/defi-agents/src/index.ts#L184)

###### Returns

`string`

##### getExecutionHistory()

```ts
getExecutionHistory(): ExecutionResult[];
```

Defined in: [agents/defi-agents/src/index.ts:293](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/agents/defi-agents/src/index.ts#L293)

Get execution history

###### Returns

[`ExecutionResult`](/docs/api/agents/defi-agents/src.md#executionresult)[]

##### getName()

```ts
getName(): string;
```

Defined in: [agents/defi-agents/src/index.ts:164](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/agents/defi-agents/src/index.ts#L164)

###### Returns

`string`

##### getPendingApprovals()

```ts
getPendingApprovals(): Promise<any>;
```

Defined in: [agents/defi-agents/src/index.ts:300](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/agents/defi-agents/src/index.ts#L300)

Get pending approvals

###### Returns

`Promise`\<`any`\>

##### getProtocols()

```ts
getProtocols(): string[];
```

Defined in: [agents/defi-agents/src/index.ts:172](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/agents/defi-agents/src/index.ts#L172)

###### Returns

`string`[]

##### hasCapability()

```ts
hasCapability(capability: DeFiCapability): boolean;
```

Defined in: [agents/defi-agents/src/index.ts:180](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/agents/defi-agents/src/index.ts#L180)

###### Parameters

| Parameter | Type |
| :------ | :------ |
| `capability` | [`DeFiCapability`](/docs/api/agents/defi-agents/src.md#deficapability) |

###### Returns

`boolean`

##### rejectAction()

```ts
rejectAction(
   approvalId: string, 
   reviewer: string, 
notes?: string): Promise<boolean>;
```

Defined in: [agents/defi-agents/src/index.ts:314](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/agents/defi-agents/src/index.ts#L314)

Reject a pending action

###### Parameters

| Parameter | Type |
| :------ | :------ |
| `approvalId` | `string` |
| `reviewer` | `string` |
| `notes?` | `string` |

###### Returns

`Promise`\<`boolean`\>

##### resume()

```ts
resume(): void;
```

Defined in: [agents/defi-agents/src/index.ts:285](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/agents/defi-agents/src/index.ts#L285)

Resume after emergency stop

###### Returns

`void`

## Interfaces

### DeFiAgentConfig

Defined in: [agents/defi-agents/src/index.ts:32](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/agents/defi-agents/src/index.ts#L32)

#### Properties

| Property | Type | Description | Defined in |
| :------ | :------ | :------ | :------ |
| <a id="capabilities"></a> `capabilities?` | [`DeFiCapability`](/docs/api/agents/defi-agents/src.md#deficapability)[] | - | [agents/defi-agents/src/index.ts:36](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/agents/defi-agents/src/index.ts#L36) |
| <a id="chains"></a> `chains` | `string`[] | - | [agents/defi-agents/src/index.ts:34](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/agents/defi-agents/src/index.ts#L34) |
| <a id="dryrun"></a> `dryRun?` | `boolean` | Enable dry run mode (log but don't execute) | [agents/defi-agents/src/index.ts:42](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/agents/defi-agents/src/index.ts#L42) |
| <a id="guardrails"></a> `guardrails?` | `any` | Guardrails configuration | [agents/defi-agents/src/index.ts:38](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/agents/defi-agents/src/index.ts#L38) |
| <a id="hitl"></a> `hitl?` | `any` | Human-in-the-loop configuration | [agents/defi-agents/src/index.ts:40](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/agents/defi-agents/src/index.ts#L40) |
| <a id="name"></a> `name` | `string` | - | [agents/defi-agents/src/index.ts:33](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/agents/defi-agents/src/index.ts#L33) |
| <a id="protocols"></a> `protocols?` | `string`[] | - | [agents/defi-agents/src/index.ts:35](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/agents/defi-agents/src/index.ts#L35) |

***

### ExecutionResult

Defined in: [agents/defi-agents/src/index.ts:55](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/agents/defi-agents/src/index.ts#L55)

#### Properties

| Property | Type | Defined in |
| :------ | :------ | :------ |
| <a id="action"></a> `action` | `AgentAction` | [agents/defi-agents/src/index.ts:57](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/agents/defi-agents/src/index.ts#L57) |
| <a id="approvalid"></a> `approvalId?` | `string` | [agents/defi-agents/src/index.ts:61](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/agents/defi-agents/src/index.ts#L61) |
| <a id="error"></a> `error?` | `Error` | [agents/defi-agents/src/index.ts:59](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/agents/defi-agents/src/index.ts#L59) |
| <a id="requiresapproval"></a> `requiresApproval?` | `boolean` | [agents/defi-agents/src/index.ts:60](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/agents/defi-agents/src/index.ts#L60) |
| <a id="success"></a> `success` | `boolean` | [agents/defi-agents/src/index.ts:56](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/agents/defi-agents/src/index.ts#L56) |
| <a id="transactionhash"></a> `transactionHash?` | `string` | [agents/defi-agents/src/index.ts:58](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/agents/defi-agents/src/index.ts#L58) |

## Type Aliases

### AgentAction

```ts
type AgentAction = any;
```

***

### DeFiCapability

```ts
type DeFiCapability = 
  | "swap"
  | "bridge"
  | "lend"
  | "borrow"
  | "stake"
  | "yield"
  | "portfolio"
  | "analytics";
```

Defined in: [agents/defi-agents/src/index.ts:45](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/agents/defi-agents/src/index.ts#L45)

## Variables

### PACKAGE\_NAME

```ts
const PACKAGE_NAME: "@universal-crypto-mcp/agent-defi" = '@universal-crypto-mcp/agent-defi';
```

Defined in: [agents/defi-agents/src/index.ts:371](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/agents/defi-agents/src/index.ts#L371)

***

### PACKAGE\_VERSION

```ts
const PACKAGE_VERSION: "1.0.0" = '1.0.0';
```

Defined in: [agents/defi-agents/src/index.ts:370](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/agents/defi-agents/src/index.ts#L370)

## Functions

### createDeFiAgent()

```ts
function createDeFiAgent(config: DeFiAgentConfig): DeFiAgent;
```

Defined in: [agents/defi-agents/src/index.ts:338](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/agents/defi-agents/src/index.ts#L338)

#### Parameters

| Parameter | Type |
| :------ | :------ |
| `config` | [`DeFiAgentConfig`](/docs/api/agents/defi-agents/src.md#defiagentconfig) |

#### Returns

[`DeFiAgent`](/docs/api/agents/defi-agents/src.md#defiagent)

***

### createPortfolioAgent()

```ts
function createPortfolioAgent(
   name: string, 
   chains: string[], 
   options?: Partial<DeFiAgentConfig>): DeFiAgent;
```

Defined in: [agents/defi-agents/src/index.ts:360](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/agents/defi-agents/src/index.ts#L360)

#### Parameters

| Parameter | Type |
| :------ | :------ |
| `name` | `string` |
| `chains` | `string`[] |
| `options?` | `Partial`\<[`DeFiAgentConfig`](/docs/api/agents/defi-agents/src.md#defiagentconfig)\> |

#### Returns

[`DeFiAgent`](/docs/api/agents/defi-agents/src.md#defiagent)

***

### createTradingAgent()

```ts
function createTradingAgent(
   name: string, 
   chains: string[], 
   options?: Partial<DeFiAgentConfig>): DeFiAgent;
```

Defined in: [agents/defi-agents/src/index.ts:351](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/agents/defi-agents/src/index.ts#L351)

#### Parameters

| Parameter | Type |
| :------ | :------ |
| `name` | `string` |
| `chains` | `string`[] |
| `options?` | `Partial`\<[`DeFiAgentConfig`](/docs/api/agents/defi-agents/src.md#defiagentconfig)\> |

#### Returns

[`DeFiAgent`](/docs/api/agents/defi-agents/src.md#defiagent)

***

### createYieldAgent()

```ts
function createYieldAgent(
   name: string, 
   chains: string[], 
   options?: Partial<DeFiAgentConfig>): DeFiAgent;
```

Defined in: [agents/defi-agents/src/index.ts:342](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/agents/defi-agents/src/index.ts#L342)

#### Parameters

| Parameter | Type |
| :------ | :------ |
| `name` | `string` |
| `chains` | `string`[] |
| `options?` | `Partial`\<[`DeFiAgentConfig`](/docs/api/agents/defi-agents/src.md#defiagentconfig)\> |

#### Returns

[`DeFiAgent`](/docs/api/agents/defi-agents/src.md#defiagent)

## References

### ApprovalRule

Renames and re-exports [AgentAction](/docs/api/agents/defi-agents/src.md#agentaction)

***

### SpendingLimit

Renames and re-exports [AgentAction](/docs/api/agents/defi-agents/src.md#agentaction)

