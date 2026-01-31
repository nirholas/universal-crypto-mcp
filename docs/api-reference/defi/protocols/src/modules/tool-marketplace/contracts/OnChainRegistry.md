[**Universal Crypto MCP API Reference v1.0.0**](../../../../../../index.md)

***

[Universal Crypto MCP API Reference](/docs/api/index.md) / defi/protocols/src/modules/tool-marketplace/contracts/OnChainRegistry

# defi/protocols/src/modules/tool-marketplace/contracts/OnChainRegistry

## Classes

### OnChainRegistry

Defined in: [defi/protocols/src/modules/tool-marketplace/contracts/OnChainRegistry.ts:103](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/modules/tool-marketplace/contracts/OnChainRegistry.ts#L103)

TypeScript SDK for interacting with the on-chain tool registry

#### Author

nirholas

#### Constructors

##### Constructor

```ts
new OnChainRegistry(
   chainId: ChainId, 
   rpcUrl?: string, 
   walletClient?: {
}): OnChainRegistry;
```

Defined in: [defi/protocols/src/modules/tool-marketplace/contracts/OnChainRegistry.ts:129](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/modules/tool-marketplace/contracts/OnChainRegistry.ts#L129)

###### Parameters

| Parameter | Type |
| :------ | :------ |
| `chainId` | [`ChainId`](/docs/api/defi/protocols/src/modules/tool-marketplace/contracts/addresses.md#chainid) |
| `rpcUrl?` | `string` |
| `walletClient?` | \{ \} |

###### Returns

[`OnChainRegistry`](/docs/api/defi/protocols/src/modules/tool-marketplace/contracts/OnChainRegistry.md#onchainregistry)

#### Methods

##### activateTool()

```ts
activateTool(toolId: `0x${string}`): Promise<`0x${string}`>;
```

Defined in: [defi/protocols/src/modules/tool-marketplace/contracts/OnChainRegistry.ts:268](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/modules/tool-marketplace/contracts/OnChainRegistry.ts#L268)

Activate a paused tool

###### Parameters

| Parameter | Type |
| :------ | :------ |
| `toolId` | `` `0x${string}` `` |

###### Returns

`Promise`\<`` `0x${string}` ``\>

##### canClaim()

```ts
canClaim(account: `0x${string}`): Promise<boolean>;
```

Defined in: [defi/protocols/src/modules/tool-marketplace/contracts/OnChainRegistry.ts:452](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/modules/tool-marketplace/contracts/OnChainRegistry.ts#L452)

Check if an account can claim their balance

###### Parameters

| Parameter | Type |
| :------ | :------ |
| `account` | `` `0x${string}` `` |

###### Returns

`Promise`\<`boolean`\>

##### claimPayout()

```ts
claimPayout(): Promise<`0x${string}`>;
```

Defined in: [defi/protocols/src/modules/tool-marketplace/contracts/OnChainRegistry.ts:464](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/modules/tool-marketplace/contracts/OnChainRegistry.ts#L464)

Claim pending payout

###### Returns

`Promise`\<`` `0x${string}` ``\>

##### computeToolId()

```ts
computeToolId(name: string, owner: `0x${string}`): `0x${string}`;
```

Defined in: [defi/protocols/src/modules/tool-marketplace/contracts/OnChainRegistry.ts:419](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/modules/tool-marketplace/contracts/OnChainRegistry.ts#L419)

Compute tool ID from name and owner

###### Parameters

| Parameter | Type |
| :------ | :------ |
| `name` | `string` |
| `owner` | `` `0x${string}` `` |

###### Returns

`` `0x${string}` ``

##### getAddresses()

```ts
getAddresses(): ContractAddresses;
```

Defined in: [defi/protocols/src/modules/tool-marketplace/contracts/OnChainRegistry.ts:781](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/modules/tool-marketplace/contracts/OnChainRegistry.ts#L781)

Get contract addresses

###### Returns

[`ContractAddresses`](/docs/api/defi/protocols/src/modules/tool-marketplace/contracts/addresses.md#contractaddresses)

##### getAllTools()

```ts
getAllTools(offset: number, limit: number): Promise<OnChainTool[]>;
```

Defined in: [defi/protocols/src/modules/tool-marketplace/contracts/OnChainRegistry.ts:386](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/modules/tool-marketplace/contracts/OnChainRegistry.ts#L386)

Get all tools (paginated)

###### Parameters

| Parameter | Type | Default value |
| :------ | :------ | :------ |
| `offset` | `number` | `0` |
| `limit` | `number` | `50` |

###### Returns

`Promise`\<[`OnChainTool`](/docs/api/defi/protocols/src/modules/tool-marketplace/contracts/OnChainRegistry.md#onchaintool)[]\>

##### getCachedTools()

```ts
getCachedTools(): OnChainTool[];
```

Defined in: [defi/protocols/src/modules/tool-marketplace/contracts/OnChainRegistry.ts:719](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/modules/tool-marketplace/contracts/OnChainRegistry.ts#L719)

Get cached tools

###### Returns

[`OnChainTool`](/docs/api/defi/protocols/src/modules/tool-marketplace/contracts/OnChainRegistry.md#onchaintool)[]

##### getChainId()

```ts
getChainId(): ChainId;
```

Defined in: [defi/protocols/src/modules/tool-marketplace/contracts/OnChainRegistry.ts:788](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/modules/tool-marketplace/contracts/OnChainRegistry.ts#L788)

Get chain ID

###### Returns

[`ChainId`](/docs/api/defi/protocols/src/modules/tool-marketplace/contracts/addresses.md#chainid)

##### getLastCacheUpdate()

```ts
getLastCacheUpdate(): Date | null;
```

Defined in: [defi/protocols/src/modules/tool-marketplace/contracts/OnChainRegistry.ts:726](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/modules/tool-marketplace/contracts/OnChainRegistry.ts#L726)

Get last cache update time

###### Returns

`Date` \| `null`

##### getMinimumStake()

```ts
getMinimumStake(): Promise<{
  amount: bigint;
  formatted: string;
}>;
```

Defined in: [defi/protocols/src/modules/tool-marketplace/contracts/OnChainRegistry.ts:616](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/modules/tool-marketplace/contracts/OnChainRegistry.ts#L616)

Get minimum stake requirement

###### Returns

`Promise`\<\{
  `amount`: `bigint`;
  `formatted`: `string`;
\}\>

##### getPendingBalance()

```ts
getPendingBalance(account: `0x${string}`): Promise<{
  amount: bigint;
  formatted: string;
}>;
```

Defined in: [defi/protocols/src/modules/tool-marketplace/contracts/OnChainRegistry.ts:435](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/modules/tool-marketplace/contracts/OnChainRegistry.ts#L435)

Get pending balance for an address

###### Parameters

| Parameter | Type |
| :------ | :------ |
| `account` | `` `0x${string}` `` |

###### Returns

`Promise`\<\{
  `amount`: `bigint`;
  `formatted`: `string`;
\}\>

##### getPlatformFee()

```ts
getPlatformFee(): Promise<number>;
```

Defined in: [defi/protocols/src/modules/tool-marketplace/contracts/OnChainRegistry.ts:484](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/modules/tool-marketplace/contracts/OnChainRegistry.ts#L484)

Get platform fee percentage

###### Returns

`Promise`\<`number`\>

##### getRevenueSplit()

```ts
getRevenueSplit(toolId: `0x${string}`): Promise<RevenueSplit[]>;
```

Defined in: [defi/protocols/src/modules/tool-marketplace/contracts/OnChainRegistry.ts:336](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/modules/tool-marketplace/contracts/OnChainRegistry.ts#L336)

Get revenue split configuration for a tool

###### Parameters

| Parameter | Type |
| :------ | :------ |
| `toolId` | `` `0x${string}` `` |

###### Returns

`Promise`\<[`RevenueSplit`](/docs/api/defi/protocols/src/modules/tool-marketplace/contracts/OnChainRegistry.md#revenuesplit)[]\>

##### getStakeInfo()

```ts
getStakeInfo(account: `0x${string}`): Promise<StakeInfo>;
```

Defined in: [defi/protocols/src/modules/tool-marketplace/contracts/OnChainRegistry.ts:581](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/modules/tool-marketplace/contracts/OnChainRegistry.ts#L581)

Get stake info for an address

###### Parameters

| Parameter | Type |
| :------ | :------ |
| `account` | `` `0x${string}` `` |

###### Returns

`Promise`\<[`StakeInfo`](/docs/api/defi/protocols/src/modules/tool-marketplace/contracts/OnChainRegistry.md#stakeinfo)\>

##### getTool()

```ts
getTool(toolId: `0x${string}`): Promise<
  | OnChainTool
| null>;
```

Defined in: [defi/protocols/src/modules/tool-marketplace/contracts/OnChainRegistry.ts:312](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/modules/tool-marketplace/contracts/OnChainRegistry.ts#L312)

Get tool by ID

###### Parameters

| Parameter | Type |
| :------ | :------ |
| `toolId` | `` `0x${string}` `` |

###### Returns

`Promise`\<
  \| [`OnChainTool`](/docs/api/defi/protocols/src/modules/tool-marketplace/contracts/OnChainRegistry.md#onchaintool)
  \| `null`\>

##### getToolsByOwner()

```ts
getToolsByOwner(owner: `0x${string}`): Promise<OnChainTool[]>;
```

Defined in: [defi/protocols/src/modules/tool-marketplace/contracts/OnChainRegistry.ts:353](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/modules/tool-marketplace/contracts/OnChainRegistry.ts#L353)

Get all tools owned by an address

###### Parameters

| Parameter | Type |
| :------ | :------ |
| `owner` | `` `0x${string}` `` |

###### Returns

`Promise`\<[`OnChainTool`](/docs/api/defi/protocols/src/modules/tool-marketplace/contracts/OnChainRegistry.md#onchaintool)[]\>

##### getTotalRevenueProcessed()

```ts
getTotalRevenueProcessed(): Promise<{
  amount: bigint;
  formatted: string;
}>;
```

Defined in: [defi/protocols/src/modules/tool-marketplace/contracts/OnChainRegistry.ts:496](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/modules/tool-marketplace/contracts/OnChainRegistry.ts#L496)

Get total revenue processed

###### Returns

`Promise`\<\{
  `amount`: `bigint`;
  `formatted`: `string`;
\}\>

##### getTotalTools()

```ts
getTotalTools(): Promise<number>;
```

Defined in: [defi/protocols/src/modules/tool-marketplace/contracts/OnChainRegistry.ts:374](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/modules/tool-marketplace/contracts/OnChainRegistry.ts#L374)

Get total number of registered tools

###### Returns

`Promise`\<`number`\>

##### meetsMinimumStake()

```ts
meetsMinimumStake(account: `0x${string}`): Promise<boolean>;
```

Defined in: [defi/protocols/src/modules/tool-marketplace/contracts/OnChainRegistry.ts:604](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/modules/tool-marketplace/contracts/OnChainRegistry.ts#L604)

Check if user meets minimum stake requirement

###### Parameters

| Parameter | Type |
| :------ | :------ |
| `account` | `` `0x${string}` `` |

###### Returns

`Promise`\<`boolean`\>

##### pauseTool()

```ts
pauseTool(toolId: `0x${string}`): Promise<`0x${string}`>;
```

Defined in: [defi/protocols/src/modules/tool-marketplace/contracts/OnChainRegistry.ts:248](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/modules/tool-marketplace/contracts/OnChainRegistry.ts#L248)

Pause a tool

###### Parameters

| Parameter | Type |
| :------ | :------ |
| `toolId` | `` `0x${string}` `` |

###### Returns

`Promise`\<`` `0x${string}` ``\>

##### registerTool()

```ts
registerTool(params: RegisterToolParams): Promise<{
  hash: `0x${string}`;
  toolId: `0x${string}`;
}>;
```

Defined in: [defi/protocols/src/modules/tool-marketplace/contracts/OnChainRegistry.ts:158](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/modules/tool-marketplace/contracts/OnChainRegistry.ts#L158)

Register a new tool on-chain

###### Parameters

| Parameter | Type | Description |
| :------ | :------ | :------ |
| `params` | [`RegisterToolParams`](/docs/api/defi/protocols/src/modules/tool-marketplace/contracts/OnChainRegistry.md#registertoolparams) | Tool registration parameters |

###### Returns

`Promise`\<\{
  `hash`: `` `0x${string}` ``;
  `toolId`: `` `0x${string}` ``;
\}\>

Transaction hash and tool ID

##### requestUnstake()

```ts
requestUnstake(amount: string): Promise<`0x${string}`>;
```

Defined in: [defi/protocols/src/modules/tool-marketplace/contracts/OnChainRegistry.ts:540](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/modules/tool-marketplace/contracts/OnChainRegistry.ts#L540)

Request unstake (starts 7-day delay)

###### Parameters

| Parameter | Type |
| :------ | :------ |
| `amount` | `string` |

###### Returns

`Promise`\<`` `0x${string}` ``\>

##### stake()

```ts
stake(amount: string): Promise<`0x${string}`>;
```

Defined in: [defi/protocols/src/modules/tool-marketplace/contracts/OnChainRegistry.ts:516](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/modules/tool-marketplace/contracts/OnChainRegistry.ts#L516)

Stake USDs tokens

###### Parameters

| Parameter | Type |
| :------ | :------ |
| `amount` | `string` |

###### Returns

`Promise`\<`` `0x${string}` ``\>

##### subscribeToEvents()

```ts
subscribeToEvents(callbacks: ToolRegistryEvents): void;
```

Defined in: [defi/protocols/src/modules/tool-marketplace/contracts/OnChainRegistry.ts:636](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/modules/tool-marketplace/contracts/OnChainRegistry.ts#L636)

Subscribe to registry events

###### Parameters

| Parameter | Type |
| :------ | :------ |
| `callbacks` | [`ToolRegistryEvents`](/docs/api/defi/protocols/src/modules/tool-marketplace/contracts/OnChainRegistry.md#toolregistryevents) |

###### Returns

`void`

##### syncCache()

```ts
syncCache(): Promise<void>;
```

Defined in: [defi/protocols/src/modules/tool-marketplace/contracts/OnChainRegistry.ts:700](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/modules/tool-marketplace/contracts/OnChainRegistry.ts#L700)

Sync all tools from chain to local cache

###### Returns

`Promise`\<`void`\>

##### toolExists()

```ts
toolExists(toolId: `0x${string}`): Promise<boolean>;
```

Defined in: [defi/protocols/src/modules/tool-marketplace/contracts/OnChainRegistry.ts:407](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/modules/tool-marketplace/contracts/OnChainRegistry.ts#L407)

Check if a tool exists

###### Parameters

| Parameter | Type |
| :------ | :------ |
| `toolId` | `` `0x${string}` `` |

###### Returns

`Promise`\<`boolean`\>

##### transferToolOwnership()

```ts
transferToolOwnership(toolId: `0x${string}`, newOwner: `0x${string}`): Promise<`0x${string}`>;
```

Defined in: [defi/protocols/src/modules/tool-marketplace/contracts/OnChainRegistry.ts:288](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/modules/tool-marketplace/contracts/OnChainRegistry.ts#L288)

Transfer tool ownership

###### Parameters

| Parameter | Type |
| :------ | :------ |
| `toolId` | `` `0x${string}` `` |
| `newOwner` | `` `0x${string}` `` |

###### Returns

`Promise`\<`` `0x${string}` ``\>

##### unstake()

```ts
unstake(): Promise<`0x${string}`>;
```

Defined in: [defi/protocols/src/modules/tool-marketplace/contracts/OnChainRegistry.ts:561](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/modules/tool-marketplace/contracts/OnChainRegistry.ts#L561)

Complete unstake after delay

###### Returns

`Promise`\<`` `0x${string}` ``\>

##### unsubscribeAll()

```ts
unsubscribeAll(): void;
```

Defined in: [defi/protocols/src/modules/tool-marketplace/contracts/OnChainRegistry.ts:686](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/modules/tool-marketplace/contracts/OnChainRegistry.ts#L686)

Unsubscribe from all events

###### Returns

`void`

##### updateEndpoint()

```ts
updateEndpoint(toolId: `0x${string}`, newEndpoint: string): Promise<`0x${string}`>;
```

Defined in: [defi/protocols/src/modules/tool-marketplace/contracts/OnChainRegistry.ts:228](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/modules/tool-marketplace/contracts/OnChainRegistry.ts#L228)

Update tool endpoint

###### Parameters

| Parameter | Type |
| :------ | :------ |
| `toolId` | `` `0x${string}` `` |
| `newEndpoint` | `string` |

###### Returns

`Promise`\<`` `0x${string}` ``\>

##### updateTool()

```ts
updateTool(
   toolId: `0x${string}`, 
   metadataURI?: string, 
pricePerCall?: string): Promise<`0x${string}`>;
```

Defined in: [defi/protocols/src/modules/tool-marketplace/contracts/OnChainRegistry.ts:203](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/modules/tool-marketplace/contracts/OnChainRegistry.ts#L203)

Update tool metadata and pricing

###### Parameters

| Parameter | Type |
| :------ | :------ |
| `toolId` | `` `0x${string}` `` |
| `metadataURI?` | `string` |
| `pricePerCall?` | `string` |

###### Returns

`Promise`\<`` `0x${string}` ``\>

## Interfaces

### OnChainTool

Defined in: [defi/protocols/src/modules/tool-marketplace/contracts/OnChainRegistry.ts:35](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/modules/tool-marketplace/contracts/OnChainRegistry.ts#L35)

#### Properties

| Property | Type | Defined in |
| :------ | :------ | :------ |
| <a id="active"></a> `active` | `boolean` | [defi/protocols/src/modules/tool-marketplace/contracts/OnChainRegistry.ts:43](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/modules/tool-marketplace/contracts/OnChainRegistry.ts#L43) |
| <a id="createdat"></a> `createdAt` | `Date` | [defi/protocols/src/modules/tool-marketplace/contracts/OnChainRegistry.ts:48](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/modules/tool-marketplace/contracts/OnChainRegistry.ts#L48) |
| <a id="endpoint"></a> `endpoint` | `string` | [defi/protocols/src/modules/tool-marketplace/contracts/OnChainRegistry.ts:39](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/modules/tool-marketplace/contracts/OnChainRegistry.ts#L39) |
| <a id="metadatauri"></a> `metadataURI` | `string` | [defi/protocols/src/modules/tool-marketplace/contracts/OnChainRegistry.ts:40](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/modules/tool-marketplace/contracts/OnChainRegistry.ts#L40) |
| <a id="name"></a> `name` | `string` | [defi/protocols/src/modules/tool-marketplace/contracts/OnChainRegistry.ts:38](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/modules/tool-marketplace/contracts/OnChainRegistry.ts#L38) |
| <a id="owner"></a> `owner` | `` `0x${string}` `` | [defi/protocols/src/modules/tool-marketplace/contracts/OnChainRegistry.ts:37](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/modules/tool-marketplace/contracts/OnChainRegistry.ts#L37) |
| <a id="pricepercall"></a> `pricePerCall` | `bigint` | [defi/protocols/src/modules/tool-marketplace/contracts/OnChainRegistry.ts:41](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/modules/tool-marketplace/contracts/OnChainRegistry.ts#L41) |
| <a id="pricepercallformatted"></a> `pricePerCallFormatted` | `string` | [defi/protocols/src/modules/tool-marketplace/contracts/OnChainRegistry.ts:42](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/modules/tool-marketplace/contracts/OnChainRegistry.ts#L42) |
| <a id="toolid"></a> `toolId` | `` `0x${string}` `` | [defi/protocols/src/modules/tool-marketplace/contracts/OnChainRegistry.ts:36](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/modules/tool-marketplace/contracts/OnChainRegistry.ts#L36) |
| <a id="totalcalls"></a> `totalCalls` | `bigint` | [defi/protocols/src/modules/tool-marketplace/contracts/OnChainRegistry.ts:45](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/modules/tool-marketplace/contracts/OnChainRegistry.ts#L45) |
| <a id="totalrevenue"></a> `totalRevenue` | `bigint` | [defi/protocols/src/modules/tool-marketplace/contracts/OnChainRegistry.ts:46](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/modules/tool-marketplace/contracts/OnChainRegistry.ts#L46) |
| <a id="totalrevenueformatted"></a> `totalRevenueFormatted` | `string` | [defi/protocols/src/modules/tool-marketplace/contracts/OnChainRegistry.ts:47](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/modules/tool-marketplace/contracts/OnChainRegistry.ts#L47) |
| <a id="updatedat"></a> `updatedAt` | `Date` | [defi/protocols/src/modules/tool-marketplace/contracts/OnChainRegistry.ts:49](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/modules/tool-marketplace/contracts/OnChainRegistry.ts#L49) |
| <a id="verified"></a> `verified` | `boolean` | [defi/protocols/src/modules/tool-marketplace/contracts/OnChainRegistry.ts:44](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/modules/tool-marketplace/contracts/OnChainRegistry.ts#L44) |

***

### RegisterToolParams

Defined in: [defi/protocols/src/modules/tool-marketplace/contracts/OnChainRegistry.ts:66](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/modules/tool-marketplace/contracts/OnChainRegistry.ts#L66)

#### Properties

| Property | Type | Defined in |
| :------ | :------ | :------ |
| <a id="endpoint-1"></a> `endpoint` | `string` | [defi/protocols/src/modules/tool-marketplace/contracts/OnChainRegistry.ts:68](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/modules/tool-marketplace/contracts/OnChainRegistry.ts#L68) |
| <a id="metadatauri-1"></a> `metadataURI` | `string` | [defi/protocols/src/modules/tool-marketplace/contracts/OnChainRegistry.ts:69](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/modules/tool-marketplace/contracts/OnChainRegistry.ts#L69) |
| <a id="name-1"></a> `name` | `string` | [defi/protocols/src/modules/tool-marketplace/contracts/OnChainRegistry.ts:67](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/modules/tool-marketplace/contracts/OnChainRegistry.ts#L67) |
| <a id="pricepercall-1"></a> `pricePerCall` | `string` | [defi/protocols/src/modules/tool-marketplace/contracts/OnChainRegistry.ts:70](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/modules/tool-marketplace/contracts/OnChainRegistry.ts#L70) |
| <a id="revenuesplits"></a> `revenueSplits` | [`RevenueSplit`](/docs/api/defi/protocols/src/modules/tool-marketplace/contracts/OnChainRegistry.md#revenuesplit)[] | [defi/protocols/src/modules/tool-marketplace/contracts/OnChainRegistry.ts:71](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/modules/tool-marketplace/contracts/OnChainRegistry.ts#L71) |

***

### RevenueSplit

Defined in: [defi/protocols/src/modules/tool-marketplace/contracts/OnChainRegistry.ts:52](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/modules/tool-marketplace/contracts/OnChainRegistry.ts#L52)

#### Properties

| Property | Type | Defined in |
| :------ | :------ | :------ |
| <a id="recipient"></a> `recipient` | `` `0x${string}` `` | [defi/protocols/src/modules/tool-marketplace/contracts/OnChainRegistry.ts:53](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/modules/tool-marketplace/contracts/OnChainRegistry.ts#L53) |
| <a id="sharepercentage"></a> `sharePercentage` | `number` | [defi/protocols/src/modules/tool-marketplace/contracts/OnChainRegistry.ts:54](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/modules/tool-marketplace/contracts/OnChainRegistry.ts#L54) |

***

### StakeInfo

Defined in: [defi/protocols/src/modules/tool-marketplace/contracts/OnChainRegistry.ts:57](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/modules/tool-marketplace/contracts/OnChainRegistry.ts#L57)

#### Properties

| Property | Type | Defined in |
| :------ | :------ | :------ |
| <a id="amount"></a> `amount` | `bigint` | [defi/protocols/src/modules/tool-marketplace/contracts/OnChainRegistry.ts:58](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/modules/tool-marketplace/contracts/OnChainRegistry.ts#L58) |
| <a id="amountformatted"></a> `amountFormatted` | `string` | [defi/protocols/src/modules/tool-marketplace/contracts/OnChainRegistry.ts:59](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/modules/tool-marketplace/contracts/OnChainRegistry.ts#L59) |
| <a id="hasactiveunstake"></a> `hasActiveUnstake` | `boolean` | [defi/protocols/src/modules/tool-marketplace/contracts/OnChainRegistry.ts:63](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/modules/tool-marketplace/contracts/OnChainRegistry.ts#L63) |
| <a id="lockeduntil"></a> `lockedUntil` | `Date` \| `null` | [defi/protocols/src/modules/tool-marketplace/contracts/OnChainRegistry.ts:60](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/modules/tool-marketplace/contracts/OnChainRegistry.ts#L60) |
| <a id="pendingunstake"></a> `pendingUnstake` | `bigint` | [defi/protocols/src/modules/tool-marketplace/contracts/OnChainRegistry.ts:61](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/modules/tool-marketplace/contracts/OnChainRegistry.ts#L61) |
| <a id="unstakerequesttime"></a> `unstakeRequestTime` | `Date` \| `null` | [defi/protocols/src/modules/tool-marketplace/contracts/OnChainRegistry.ts:62](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/modules/tool-marketplace/contracts/OnChainRegistry.ts#L62) |

***

### ToolRegistryEvents

Defined in: [defi/protocols/src/modules/tool-marketplace/contracts/OnChainRegistry.ts:74](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/modules/tool-marketplace/contracts/OnChainRegistry.ts#L74)

#### Properties

| Property | Type | Defined in |
| :------ | :------ | :------ |
| <a id="ontoolactivated"></a> `onToolActivated?` | (`toolId`: `` `0x${string}` ``) => `void` | [defi/protocols/src/modules/tool-marketplace/contracts/OnChainRegistry.ts:78](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/modules/tool-marketplace/contracts/OnChainRegistry.ts#L78) |
| <a id="ontoolpaused"></a> `onToolPaused?` | (`toolId`: `` `0x${string}` ``) => `void` | [defi/protocols/src/modules/tool-marketplace/contracts/OnChainRegistry.ts:77](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/modules/tool-marketplace/contracts/OnChainRegistry.ts#L77) |
| <a id="ontoolregistered"></a> `onToolRegistered?` | (`toolId`: `` `0x${string}` ``, `owner`: `` `0x${string}` ``, `name`: `string`) => `void` | [defi/protocols/src/modules/tool-marketplace/contracts/OnChainRegistry.ts:75](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/modules/tool-marketplace/contracts/OnChainRegistry.ts#L75) |
| <a id="ontoolupdated"></a> `onToolUpdated?` | (`toolId`: `` `0x${string}` ``) => `void` | [defi/protocols/src/modules/tool-marketplace/contracts/OnChainRegistry.ts:76](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/modules/tool-marketplace/contracts/OnChainRegistry.ts#L76) |
| <a id="onusagerecorded"></a> `onUsageRecorded?` | (`toolId`: `` `0x${string}` ``, `payer`: `` `0x${string}` ``, `amount`: `bigint`) => `void` | [defi/protocols/src/modules/tool-marketplace/contracts/OnChainRegistry.ts:79](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/modules/tool-marketplace/contracts/OnChainRegistry.ts#L79) |

## Functions

### createOnChainRegistry()

```ts
function createOnChainRegistry(
   chainId: ChainId, 
   rpcUrl?: string, 
   walletClient?: {
}): OnChainRegistry;
```

Defined in: [defi/protocols/src/modules/tool-marketplace/contracts/OnChainRegistry.ts:794](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/modules/tool-marketplace/contracts/OnChainRegistry.ts#L794)

#### Parameters

| Parameter | Type |
| :------ | :------ |
| `chainId` | [`ChainId`](/docs/api/defi/protocols/src/modules/tool-marketplace/contracts/addresses.md#chainid) |
| `rpcUrl?` | `string` |
| `walletClient?` | \{ \} |

#### Returns

[`OnChainRegistry`](/docs/api/defi/protocols/src/modules/tool-marketplace/contracts/OnChainRegistry.md#onchainregistry)
