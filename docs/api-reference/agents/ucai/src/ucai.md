[**Universal Crypto MCP API Reference v1.0.0**](../../../index.md)

***

[Universal Crypto MCP API Reference](/docs/api/index.md) / agents/ucai/src/ucai

# agents/ucai/src/ucai

## Classes

### UCAIAgent

Defined in: [agents/ucai/src/ucai.ts:51](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/agents/ucai/src/ucai.ts#L51)

#### Constructors

##### Constructor

```ts
new UCAIAgent(config: UCAIConfig): UCAIAgent;
```

Defined in: [agents/ucai/src/ucai.ts:62](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/agents/ucai/src/ucai.ts#L62)

###### Parameters

| Parameter | Type |
| :------ | :------ |
| `config` | [`UCAIConfig`](/docs/api/agents/ucai/src/ucai.md#ucaiconfig) |

###### Returns

[`UCAIAgent`](/docs/api/agents/ucai/src/ucai.md#ucaiagent)

#### Methods

##### emergencyStop()

```ts
emergencyStop(): Promise<void>;
```

Defined in: [agents/ucai/src/ucai.ts:282](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/agents/ucai/src/ucai.ts#L282)

Emergency kill switch - stops all operations

###### Returns

`Promise`\<`void`\>

##### executeChainOperation()

```ts
executeChainOperation<T>(
   chain: string, 
   action: AgentAction, 
executor: () => Promise<T>): Promise<T>;
```

Defined in: [agents/ucai/src/ucai.ts:150](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/agents/ucai/src/ucai.ts#L150)

Execute a chain operation with full safety features

###### Type Parameters

| Type Parameter |
| :------ |
| `T` |

###### Parameters

| Parameter | Type |
| :------ | :------ |
| `chain` | `string` |
| `action` | `AgentAction` |
| `executor` | () => `Promise`\<`T`\> |

###### Returns

`Promise`\<`T`\>

##### getCapabilities()

```ts
getCapabilities(): string[];
```

Defined in: [agents/ucai/src/ucai.ts:139](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/agents/ucai/src/ucai.ts#L139)

###### Returns

`string`[]

##### getChains()

```ts
getChains(): string[];
```

Defined in: [agents/ucai/src/ucai.ts:135](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/agents/ucai/src/ucai.ts#L135)

###### Returns

`string`[]

##### getCircuitBreakerStatus()

```ts
getCircuitBreakerStatus(): Record<string, string>;
```

Defined in: [agents/ucai/src/ucai.ts:269](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/agents/ucai/src/ucai.ts#L269)

Check circuit breaker status for all chains

###### Returns

`Record`\<`string`, `string`\>

##### getCoreVersion()

```ts
getCoreVersion(): string;
```

Defined in: [agents/ucai/src/ucai.ts:143](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/agents/ucai/src/ucai.ts#L143)

###### Returns

`string`

##### getMetrics()

```ts
getMetrics(): string;
```

Defined in: [agents/ucai/src/ucai.ts:262](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/agents/ucai/src/ucai.ts#L262)

Get metrics in Prometheus format

###### Returns

`string`

##### getName()

```ts
getName(): string;
```

Defined in: [agents/ucai/src/ucai.ts:131](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/agents/ucai/src/ucai.ts#L131)

###### Returns

`string`

##### getSpendingStatus()

```ts
getSpendingStatus(): Record<string, {
  limit: number;
  used: number;
}>;
```

Defined in: [agents/ucai/src/ucai.ts:243](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/agents/ucai/src/ucai.ts#L243)

Get current spending status

###### Returns

`Record`\<`string`, \{
  `limit`: `number`;
  `used`: `number`;
\}\>

##### shutdown()

```ts
shutdown(): Promise<void>;
```

Defined in: [agents/ucai/src/ucai.ts:291](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/agents/ucai/src/ucai.ts#L291)

Graceful shutdown

###### Returns

`Promise`\<`void`\>

## Interfaces

### ChainMetrics

Defined in: [agents/ucai/src/ucai.ts:45](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/agents/ucai/src/ucai.ts#L45)

#### Properties

| Property | Type | Defined in |
| :------ | :------ | :------ |
| <a id="errors"></a> `errors` | `Counter` | [agents/ucai/src/ucai.ts:47](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/agents/ucai/src/ucai.ts#L47) |
| <a id="latency"></a> `latency` | `Histogram` | [agents/ucai/src/ucai.ts:48](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/agents/ucai/src/ucai.ts#L48) |
| <a id="transactions"></a> `transactions` | `Counter` | [agents/ucai/src/ucai.ts:46](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/agents/ucai/src/ucai.ts#L46) |

***

### UCAIConfig

Defined in: [agents/ucai/src/ucai.ts:27](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/agents/ucai/src/ucai.ts#L27)

#### Properties

| Property | Type | Description | Defined in |
| :------ | :------ | :------ | :------ |
| <a id="capabilities"></a> `capabilities?` | `string`[] | - | [agents/ucai/src/ucai.ts:30](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/agents/ucai/src/ucai.ts#L30) |
| <a id="chains"></a> `chains` | `string`[] | - | [agents/ucai/src/ucai.ts:29](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/agents/ucai/src/ucai.ts#L29) |
| <a id="hitlenabled"></a> `hitlEnabled?` | `boolean` | HITL configuration for high-value operations | [agents/ucai/src/ucai.ts:36](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/agents/ucai/src/ucai.ts#L36) |
| <a id="hitlwebhookurl"></a> `hitlWebhookUrl?` | `string` | - | [agents/ucai/src/ucai.ts:37](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/agents/ucai/src/ucai.ts#L37) |
| <a id="name"></a> `name` | `string` | - | [agents/ucai/src/ucai.ts:28](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/agents/ucai/src/ucai.ts#L28) |
| <a id="ratelimit"></a> `rateLimit?` | \{ `maxRequests`: `number`; `windowMs`: `number`; \} | Rate limits for chain operations | [agents/ucai/src/ucai.ts:39](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/agents/ucai/src/ucai.ts#L39) |
| `rateLimit.maxRequests` | `number` | - | [agents/ucai/src/ucai.ts:40](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/agents/ucai/src/ucai.ts#L40) |
| `rateLimit.windowMs` | `number` | - | [agents/ucai/src/ucai.ts:41](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/agents/ucai/src/ucai.ts#L41) |
| <a id="spendinglimits"></a> `spendingLimits?` | `Record`\<`string`, `SpendingLimit`\> | Custom spending limits per chain | [agents/ucai/src/ucai.ts:34](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/agents/ucai/src/ucai.ts#L34) |
| <a id="strictmode"></a> `strictMode?` | `boolean` | Enable strict guardrails (recommended for production) | [agents/ucai/src/ucai.ts:32](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/agents/ucai/src/ucai.ts#L32) |

## Functions

### createProductionUCAI()

```ts
function createProductionUCAI(config: Omit<UCAIConfig, "strictMode" | "hitlEnabled">): UCAIAgent;
```

Defined in: [agents/ucai/src/ucai.ts:308](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/agents/ucai/src/ucai.ts#L308)

Create a production-ready UCAI agent with strict settings

#### Parameters

| Parameter | Type |
| :------ | :------ |
| `config` | `Omit`\<[`UCAIConfig`](/docs/api/agents/ucai/src/ucai.md#ucaiconfig), `"strictMode"` \| `"hitlEnabled"`\> |

#### Returns

[`UCAIAgent`](/docs/api/agents/ucai/src/ucai.md#ucaiagent)

***

### createUCAI()

```ts
function createUCAI(config: UCAIConfig): UCAIAgent;
```

Defined in: [agents/ucai/src/ucai.ts:301](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/agents/ucai/src/ucai.ts#L301)

#### Parameters

| Parameter | Type |
| :------ | :------ |
| `config` | [`UCAIConfig`](/docs/api/agents/ucai/src/ucai.md#ucaiconfig) |

#### Returns

[`UCAIAgent`](/docs/api/agents/ucai/src/ucai.md#ucaiagent)

