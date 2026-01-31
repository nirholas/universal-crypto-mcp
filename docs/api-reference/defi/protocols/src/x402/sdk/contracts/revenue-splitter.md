[**Universal Crypto MCP API Reference v1.0.0**](../../../../../../index.md)

***

[Universal Crypto MCP API Reference](/docs/api/index.md) / defi/protocols/src/x402/sdk/contracts/revenue-splitter

# defi/protocols/src/x402/sdk/contracts/revenue-splitter

## Classes

### RevenueSplitter

Defined in: [defi/protocols/src/x402/sdk/contracts/revenue-splitter.ts:18](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/x402/sdk/contracts/revenue-splitter.ts#L18)

X402 Revenue Splitter contract interface
Handles automated revenue splitting between developers and platform

#### Constructors

##### Constructor

```ts
new RevenueSplitter(
   contractAddress: `0x${string}`, 
   publicClient: {
}, 
   walletClient?: {
}): RevenueSplitter;
```

Defined in: [defi/protocols/src/x402/sdk/contracts/revenue-splitter.ts:21](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/x402/sdk/contracts/revenue-splitter.ts#L21)

###### Parameters

| Parameter | Type |
| :------ | :------ |
| `contractAddress` | `` `0x${string}` `` |
| `publicClient` | \{ \} |
| `walletClient?` | \{ \} |

###### Returns

[`RevenueSplitter`](/docs/api/defi/protocols/src/x402/sdk/contracts/revenue-splitter.md#revenuesplitter)

#### Methods

##### batchProcessPayments()

```ts
batchProcessPayments(
   toolNames: string[], 
   tokenAddress: `0x${string}`, 
   amounts: string[], 
decimals: number): Promise<`0x${string}`>;
```

Defined in: [defi/protocols/src/x402/sdk/contracts/revenue-splitter.ts:168](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/x402/sdk/contracts/revenue-splitter.ts#L168)

Process multiple payments in batch

###### Parameters

| Parameter | Type | Default value |
| :------ | :------ | :------ |
| `toolNames` | `string`[] | `undefined` |
| `tokenAddress` | `` `0x${string}` `` | `undefined` |
| `amounts` | `string`[] | `undefined` |
| `decimals` | `number` | `18` |

###### Returns

`Promise`\<`` `0x${string}` ``\>

##### calculateSplit()

```ts
calculateSplit(toolName: string, amount: string): Promise<RevenueSplit>;
```

Defined in: [defi/protocols/src/x402/sdk/contracts/revenue-splitter.ts:105](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/x402/sdk/contracts/revenue-splitter.ts#L105)

Calculate revenue split for a payment

###### Parameters

| Parameter | Type |
| :------ | :------ |
| `toolName` | `string` |
| `amount` | `string` |

###### Returns

`Promise`\<[`RevenueSplit`](/docs/api/defi/protocols/src/x402/sdk/types.md#revenuesplit)\>

##### getDefaultPlatformFee()

```ts
getDefaultPlatformFee(): Promise<number>;
```

Defined in: [defi/protocols/src/x402/sdk/contracts/revenue-splitter.ts:91](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/x402/sdk/contracts/revenue-splitter.ts#L91)

Get default platform fee in basis points

###### Returns

`Promise`\<`number`\>

##### getDeveloperEarnings()

```ts
getDeveloperEarnings(developer: `0x${string}`): Promise<string>;
```

Defined in: [defi/protocols/src/x402/sdk/contracts/revenue-splitter.ts:65](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/x402/sdk/contracts/revenue-splitter.ts#L65)

Get developer earnings

###### Parameters

| Parameter | Type |
| :------ | :------ |
| `developer` | `` `0x${string}` `` |

###### Returns

`Promise`\<`string`\>

##### getPlatformWallet()

```ts
getPlatformWallet(): Promise<`0x${string}`>;
```

Defined in: [defi/protocols/src/x402/sdk/contracts/revenue-splitter.ts:79](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/x402/sdk/contracts/revenue-splitter.ts#L79)

Get platform wallet address

###### Returns

`Promise`\<`` `0x${string}` ``\>

##### getToolInfo()

```ts
getToolInfo(toolName: string): Promise<
  | ToolRevenueStats
| null>;
```

Defined in: [defi/protocols/src/x402/sdk/contracts/revenue-splitter.ts:34](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/x402/sdk/contracts/revenue-splitter.ts#L34)

Get tool information

###### Parameters

| Parameter | Type |
| :------ | :------ |
| `toolName` | `string` |

###### Returns

`Promise`\<
  \| [`ToolRevenueStats`](/docs/api/defi/protocols/src/x402/sdk/types.md#toolrevenuestats)
  \| `null`\>

##### processPayment()

```ts
processPayment(
   toolName: string, 
   tokenAddress: `0x${string}`, 
   amount: string, 
decimals: number): Promise<`0x${string}`>;
```

Defined in: [defi/protocols/src/x402/sdk/contracts/revenue-splitter.ts:138](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/x402/sdk/contracts/revenue-splitter.ts#L138)

Process a single payment

###### Parameters

| Parameter | Type | Default value |
| :------ | :------ | :------ |
| `toolName` | `string` | `undefined` |
| `tokenAddress` | `` `0x${string}` `` | `undefined` |
| `amount` | `string` | `undefined` |
| `decimals` | `number` | `18` |

###### Returns

`Promise`\<`` `0x${string}` ``\>

##### registerTool()

```ts
registerTool(registration: ToolRegistration): Promise<`0x${string}`>;
```

Defined in: [defi/protocols/src/x402/sdk/contracts/revenue-splitter.ts:206](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/x402/sdk/contracts/revenue-splitter.ts#L206)

Register a new tool (admin only)

###### Parameters

| Parameter | Type |
| :------ | :------ |
| `registration` | [`ToolRegistration`](/docs/api/defi/protocols/src/x402/sdk/types.md#toolregistration) |

###### Returns

`Promise`\<`` `0x${string}` ``\>
