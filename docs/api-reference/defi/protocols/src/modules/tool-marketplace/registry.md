[**Universal Crypto MCP API Reference v1.0.0**](../../../../../index.md)

***

[Universal Crypto MCP API Reference](/docs/api/index.md) / defi/protocols/src/modules/tool-marketplace/registry

# defi/protocols/src/modules/tool-marketplace/registry

## Classes

### ToolRegistryService

Defined in: [defi/protocols/src/modules/tool-marketplace/registry.ts:81](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/modules/tool-marketplace/registry.ts#L81)

Tool Registry Service
Manages registration, discovery, and usage tracking of paid AI tools

#### Constructors

##### Constructor

```ts
new ToolRegistryService(platformAddress?: `0x${string}`): ToolRegistryService;
```

Defined in: [defi/protocols/src/modules/tool-marketplace/registry.ts:85](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/modules/tool-marketplace/registry.ts#L85)

###### Parameters

| Parameter | Type |
| :------ | :------ |
| `platformAddress?` | `` `0x${string}` `` |

###### Returns

[`ToolRegistryService`](/docs/api/defi/protocols/src/modules/tool-marketplace/registry.md#toolregistryservice)

#### Methods

##### activateTool()

```ts
activateTool(toolId: string, callerAddress: `0x${string}`): Promise<void>;
```

Defined in: [defi/protocols/src/modules/tool-marketplace/registry.ts:212](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/modules/tool-marketplace/registry.ts#L212)

Activate a paused tool

###### Parameters

| Parameter | Type |
| :------ | :------ |
| `toolId` | `string` |
| `callerAddress` | `` `0x${string}` `` |

###### Returns

`Promise`\<`void`\>

##### clearStorage()

```ts
clearStorage(): Promise<void>;
```

Defined in: [defi/protocols/src/modules/tool-marketplace/registry.ts:770](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/modules/tool-marketplace/registry.ts#L770)

Clear all storage (for testing)

###### Returns

`Promise`\<`void`\>

##### createSubscription()

```ts
createSubscription(
   toolId: string, 
   userAddress: `0x${string}`, 
   tierName: string, 
txHash: string): Promise<SubscriptionStatus>;
```

Defined in: [defi/protocols/src/modules/tool-marketplace/registry.ts:554](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/modules/tool-marketplace/registry.ts#L554)

Create a subscription for a tool

###### Parameters

| Parameter | Type |
| :------ | :------ |
| `toolId` | `string` |
| `userAddress` | `` `0x${string}` `` |
| `tierName` | `string` |
| `txHash` | `string` |

###### Returns

`Promise`\<[`SubscriptionStatus`](/docs/api/defi/protocols/src/modules/tool-marketplace/types.md#subscriptionstatus)\>

##### discoverTools()

```ts
discoverTools(filters: ToolDiscoveryFilter): Promise<RegisteredTool[]>;
```

Defined in: [defi/protocols/src/modules/tool-marketplace/registry.ts:242](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/modules/tool-marketplace/registry.ts#L242)

Discover tools with filters

###### Parameters

| Parameter | Type |
| :------ | :------ |
| `filters` | [`ToolDiscoveryFilter`](/docs/api/defi/protocols/src/modules/tool-marketplace/types.md#tooldiscoveryfilter) |

###### Returns

`Promise`\<[`RegisteredTool`](/docs/api/defi/protocols/src/modules/tool-marketplace/types.md#registeredtool)[]\>

##### getCreatorAnalytics()

```ts
getCreatorAnalytics(creatorAddress: `0x${string}`): Promise<CreatorAnalytics>;
```

Defined in: [defi/protocols/src/modules/tool-marketplace/registry.ts:491](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/modules/tool-marketplace/registry.ts#L491)

Get analytics for a creator

###### Parameters

| Parameter | Type |
| :------ | :------ |
| `creatorAddress` | `` `0x${string}` `` |

###### Returns

`Promise`\<[`CreatorAnalytics`](/docs/api/defi/protocols/src/modules/tool-marketplace/types.md#creatoranalytics)\>

##### getMarketplaceStats()

```ts
getMarketplaceStats(): Promise<MarketplaceStats>;
```

Defined in: [defi/protocols/src/modules/tool-marketplace/registry.ts:657](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/modules/tool-marketplace/registry.ts#L657)

Get overall marketplace statistics

###### Returns

`Promise`\<[`MarketplaceStats`](/docs/api/defi/protocols/src/modules/tool-marketplace/types.md#marketplacestats)\>

##### getRecentEvents()

```ts
getRecentEvents(limit: number): Promise<MarketplaceEvent[]>;
```

Defined in: [defi/protocols/src/modules/tool-marketplace/registry.ts:763](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/modules/tool-marketplace/registry.ts#L763)

Get recent events

###### Parameters

| Parameter | Type | Default value |
| :------ | :------ | :------ |
| `limit` | `number` | `100` |

###### Returns

`Promise`\<[`MarketplaceEvent`](/docs/api/defi/protocols/src/modules/tool-marketplace/types.md#marketplaceevent)[]\>

##### getSubscription()

```ts
getSubscription(toolId: string, userAddress: `0x${string}`): Promise<
  | SubscriptionStatus
| null>;
```

Defined in: [defi/protocols/src/modules/tool-marketplace/registry.ts:610](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/modules/tool-marketplace/registry.ts#L610)

Get active subscription for a user and tool

###### Parameters

| Parameter | Type |
| :------ | :------ |
| `toolId` | `string` |
| `userAddress` | `` `0x${string}` `` |

###### Returns

`Promise`\<
  \| [`SubscriptionStatus`](/docs/api/defi/protocols/src/modules/tool-marketplace/types.md#subscriptionstatus)
  \| `null`\>

##### getTool()

```ts
getTool(toolId: string): Promise<
  | RegisteredTool
| null>;
```

Defined in: [defi/protocols/src/modules/tool-marketplace/registry.ts:321](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/modules/tool-marketplace/registry.ts#L321)

Get a specific tool by ID

###### Parameters

| Parameter | Type |
| :------ | :------ |
| `toolId` | `string` |

###### Returns

`Promise`\<
  \| [`RegisteredTool`](/docs/api/defi/protocols/src/modules/tool-marketplace/types.md#registeredtool)
  \| `null`\>

##### getToolByName()

```ts
getToolByName(name: string): Promise<
  | RegisteredTool
| null>;
```

Defined in: [defi/protocols/src/modules/tool-marketplace/registry.ts:328](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/modules/tool-marketplace/registry.ts#L328)

Get a tool by name

###### Parameters

| Parameter | Type |
| :------ | :------ |
| `name` | `string` |

###### Returns

`Promise`\<
  \| [`RegisteredTool`](/docs/api/defi/protocols/src/modules/tool-marketplace/types.md#registeredtool)
  \| `null`\>

##### getToolRevenue()

```ts
getToolRevenue(toolId: string): Promise<ToolRevenue>;
```

Defined in: [defi/protocols/src/modules/tool-marketplace/registry.ts:450](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/modules/tool-marketplace/registry.ts#L450)

Get revenue info for a tool

###### Parameters

| Parameter | Type |
| :------ | :------ |
| `toolId` | `string` |

###### Returns

`Promise`\<[`ToolRevenue`](/docs/api/defi/protocols/src/modules/tool-marketplace/types.md#toolrevenue)\>

##### getToolsByOwner()

```ts
getToolsByOwner(ownerAddress: `0x${string}`): Promise<RegisteredTool[]>;
```

Defined in: [defi/protocols/src/modules/tool-marketplace/registry.ts:340](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/modules/tool-marketplace/registry.ts#L340)

Get all tools by owner

###### Parameters

| Parameter | Type |
| :------ | :------ |
| `ownerAddress` | `` `0x${string}` `` |

###### Returns

`Promise`\<[`RegisteredTool`](/docs/api/defi/protocols/src/modules/tool-marketplace/types.md#registeredtool)[]\>

##### getUsageHistory()

```ts
getUsageHistory(
   toolId: string, 
   limit: number, 
offset: number): Promise<ToolUsageRecord[]>;
```

Defined in: [defi/protocols/src/modules/tool-marketplace/registry.ts:414](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/modules/tool-marketplace/registry.ts#L414)

Get usage history for a tool

###### Parameters

| Parameter | Type | Default value |
| :------ | :------ | :------ |
| `toolId` | `string` | `undefined` |
| `limit` | `number` | `100` |
| `offset` | `number` | `0` |

###### Returns

`Promise`\<[`ToolUsageRecord`](/docs/api/defi/protocols/src/modules/tool-marketplace/types.md#toolusagerecord)[]\>

##### getUserUsageHistory()

```ts
getUserUsageHistory(userAddress: `0x${string}`, limit: number): Promise<ToolUsageRecord[]>;
```

Defined in: [defi/protocols/src/modules/tool-marketplace/registry.ts:428](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/modules/tool-marketplace/registry.ts#L428)

Get usage history for a user

###### Parameters

| Parameter | Type | Default value |
| :------ | :------ | :------ |
| `userAddress` | `` `0x${string}` `` | `undefined` |
| `limit` | `number` | `100` |

###### Returns

`Promise`\<[`ToolUsageRecord`](/docs/api/defi/protocols/src/modules/tool-marketplace/types.md#toolusagerecord)[]\>

##### pauseTool()

```ts
pauseTool(toolId: string, callerAddress: `0x${string}`): Promise<void>;
```

Defined in: [defi/protocols/src/modules/tool-marketplace/registry.ts:186](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/modules/tool-marketplace/registry.ts#L186)

Pause a tool (stop accepting payments)

###### Parameters

| Parameter | Type |
| :------ | :------ |
| `toolId` | `string` |
| `callerAddress` | `` `0x${string}` `` |

###### Returns

`Promise`\<`void`\>

##### recordUsage()

```ts
recordUsage(
   toolId: string, 
   userAddress: `0x${string}`, 
   amountPaid: string, 
   token: string, 
   txHash: string, 
   responseTime: number, 
   success: boolean, 
error?: string): Promise<ToolUsageRecord>;
```

Defined in: [defi/protocols/src/modules/tool-marketplace/registry.ts:353](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/modules/tool-marketplace/registry.ts#L353)

Record a tool usage (called after successful payment)

###### Parameters

| Parameter | Type |
| :------ | :------ |
| `toolId` | `string` |
| `userAddress` | `` `0x${string}` `` |
| `amountPaid` | `string` |
| `token` | `string` |
| `txHash` | `string` |
| `responseTime` | `number` |
| `success` | `boolean` |
| `error?` | `string` |

###### Returns

`Promise`\<[`ToolUsageRecord`](/docs/api/defi/protocols/src/modules/tool-marketplace/types.md#toolusagerecord)\>

##### registerTool()

```ts
registerTool(input: RegisterToolInput): Promise<RegisteredTool>;
```

Defined in: [defi/protocols/src/modules/tool-marketplace/registry.ts:96](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/modules/tool-marketplace/registry.ts#L96)

Register a new tool in the marketplace

###### Parameters

| Parameter | Type |
| :------ | :------ |
| `input` | [`RegisterToolInput`](/docs/api/defi/protocols/src/modules/tool-marketplace/types.md#registertoolinput) |

###### Returns

`Promise`\<[`RegisteredTool`](/docs/api/defi/protocols/src/modules/tool-marketplace/types.md#registeredtool)\>

##### updateTool()

```ts
updateTool(
   toolId: string, 
   updates: Partial<Omit<RegisterToolInput, "owner" | "name">>, 
callerAddress: `0x${string}`): Promise<RegisteredTool>;
```

Defined in: [defi/protocols/src/modules/tool-marketplace/registry.ts:144](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/modules/tool-marketplace/registry.ts#L144)

Update an existing tool

###### Parameters

| Parameter | Type |
| :------ | :------ |
| `toolId` | `string` |
| `updates` | `Partial`\<`Omit`\<[`RegisterToolInput`](/docs/api/defi/protocols/src/modules/tool-marketplace/types.md#registertoolinput), `"owner"` \| `"name"`\>\> |
| `callerAddress` | `` `0x${string}` `` |

###### Returns

`Promise`\<[`RegisteredTool`](/docs/api/defi/protocols/src/modules/tool-marketplace/types.md#registeredtool)\>

##### useSubscriptionCall()

```ts
useSubscriptionCall(subscriptionId: string): Promise<boolean>;
```

Defined in: [defi/protocols/src/modules/tool-marketplace/registry.ts:629](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/modules/tool-marketplace/registry.ts#L629)

Use a subscription call

###### Parameters

| Parameter | Type |
| :------ | :------ |
| `subscriptionId` | `string` |

###### Returns

`Promise`\<`boolean`\>

## Variables

### toolRegistry

```ts
const toolRegistry: ToolRegistryService;
```

Defined in: [defi/protocols/src/modules/tool-marketplace/registry.ts:780](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/modules/tool-marketplace/registry.ts#L780)
