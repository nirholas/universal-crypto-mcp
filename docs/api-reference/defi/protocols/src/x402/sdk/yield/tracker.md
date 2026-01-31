[**Universal Crypto MCP API Reference v1.0.0**](../../../../../../index.md)

***

[Universal Crypto MCP API Reference](/docs/api/index.md) / defi/protocols/src/x402/sdk/yield/tracker

# defi/protocols/src/x402/sdk/yield/tracker

## Classes

### YieldTracker

Defined in: [defi/protocols/src/x402/sdk/yield/tracker.ts:17](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/x402/sdk/yield/tracker.ts#L17)

USDs yield tracking utilities
Tracks auto-yield earnings from Sperax USD

#### Constructors

##### Constructor

```ts
new YieldTracker(publicClient: {
}, chain: X402Chain): YieldTracker;
```

Defined in: [defi/protocols/src/x402/sdk/yield/tracker.ts:21](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/x402/sdk/yield/tracker.ts#L21)

###### Parameters

| Parameter | Type |
| :------ | :------ |
| `publicClient` | \{ \} |
| `chain` | [`X402Chain`](/docs/api/defi/protocols/src/x402/sdk/types.md#x402chain) |

###### Returns

[`YieldTracker`](/docs/api/defi/protocols/src/x402/sdk/yield/tracker.md#yieldtracker)

#### Accessors

##### chain

###### Get Signature

```ts
get chain(): X402Chain;
```

Defined in: [defi/protocols/src/x402/sdk/yield/tracker.ts:39](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/x402/sdk/yield/tracker.ts#L39)

Get the chain this tracker is configured for

###### Returns

[`X402Chain`](/docs/api/defi/protocols/src/x402/sdk/types.md#x402chain)

#### Methods

##### calculateYieldEarned()

```ts
calculateYieldEarned(
   startBalance: string, 
   endBalance: string, 
   netDeposits: string): string;
```

Defined in: [defi/protocols/src/x402/sdk/yield/tracker.ts:225](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/x402/sdk/yield/tracker.ts#L225)

Calculate yield earned between two balances
Accounts for deposits/withdrawals

###### Parameters

| Parameter | Type |
| :------ | :------ |
| `startBalance` | `string` |
| `endBalance` | `string` |
| `netDeposits` | `string` |

###### Returns

`string`

##### calculateYieldEstimate()

```ts
calculateYieldEstimate(balance: number, apy: number): YieldEstimate;
```

Defined in: [defi/protocols/src/x402/sdk/yield/tracker.ts:118](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/x402/sdk/yield/tracker.ts#L118)

Calculate yield estimates for a given balance and APY

###### Parameters

| Parameter | Type |
| :------ | :------ |
| `balance` | `number` |
| `apy` | `number` |

###### Returns

[`YieldEstimate`](/docs/api/defi/protocols/src/x402/sdk/types.md#yieldestimate)

##### estimateTimeToTarget()

```ts
estimateTimeToTarget(
   currentBalance: number, 
   targetBalance: number, 
   apy: number): 
  | {
  days: number;
  months: number;
  years: number;
}
  | null;
```

Defined in: [defi/protocols/src/x402/sdk/yield/tracker.ts:242](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/x402/sdk/yield/tracker.ts#L242)

Estimate time to reach target balance through yield

###### Parameters

| Parameter | Type |
| :------ | :------ |
| `currentBalance` | `number` |
| `targetBalance` | `number` |
| `apy` | `number` |

###### Returns

  \| \{
  `days`: `number`;
  `months`: `number`;
  `years`: `number`;
\}
  \| `null`

##### estimateYield()

```ts
estimateYield(address: `0x${string}`, apy?: number): Promise<YieldEstimate>;
```

Defined in: [defi/protocols/src/x402/sdk/yield/tracker.ts:98](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/x402/sdk/yield/tracker.ts#L98)

Estimate yield over time based on current balance and APY

###### Parameters

| Parameter | Type |
| :------ | :------ |
| `address` | `` `0x${string}` `` |
| `apy?` | `number` |

###### Returns

`Promise`\<[`YieldEstimate`](/docs/api/defi/protocols/src/x402/sdk/types.md#yieldestimate)\>

##### getBalance()

```ts
getBalance(address: `0x${string}`): Promise<{
  formatted: string;
  raw: bigint;
}>;
```

Defined in: [defi/protocols/src/x402/sdk/yield/tracker.ts:146](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/x402/sdk/yield/tracker.ts#L146)

Get USDs balance for an address

###### Parameters

| Parameter | Type |
| :------ | :------ |
| `address` | `` `0x${string}` `` |

###### Returns

`Promise`\<\{
  `formatted`: `string`;
  `raw`: `bigint`;
\}\>

##### getCurrentAPY()

```ts
getCurrentAPY(): Promise<number>;
```

Defined in: [defi/protocols/src/x402/sdk/yield/tracker.ts:89](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/x402/sdk/yield/tracker.ts#L89)

Get current APY estimate
In production, this would query on-chain or off-chain data sources

###### Returns

`Promise`\<`number`\>

##### getRebasingCreditsPerToken()

```ts
getRebasingCreditsPerToken(): Promise<bigint>;
```

Defined in: [defi/protocols/src/x402/sdk/yield/tracker.ts:180](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/x402/sdk/yield/tracker.ts#L180)

Get rebase credits per token (for yield calculation)

###### Returns

`Promise`\<`bigint`\>

##### getYieldHistory()

```ts
getYieldHistory(
   address: `0x${string}`, 
   _fromBlock?: number, 
_toBlock?: number): Promise<YieldHistoryEntry[]>;
```

Defined in: [defi/protocols/src/x402/sdk/yield/tracker.ts:197](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/x402/sdk/yield/tracker.ts#L197)

Get yield history (requires indexer/subgraph in production)
This is a placeholder implementation

###### Parameters

| Parameter | Type |
| :------ | :------ |
| `address` | `` `0x${string}` `` |
| `_fromBlock?` | `number` |
| `_toBlock?` | `number` |

###### Returns

`Promise`\<[`YieldHistoryEntry`](/docs/api/defi/protocols/src/x402/sdk/types.md#yieldhistoryentry)[]\>

##### getYieldInfo()

```ts
getYieldInfo(address: `0x${string}`): Promise<YieldInfo>;
```

Defined in: [defi/protocols/src/x402/sdk/yield/tracker.ts:46](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/x402/sdk/yield/tracker.ts#L46)

Get comprehensive yield information for an address

###### Parameters

| Parameter | Type |
| :------ | :------ |
| `address` | `` `0x${string}` `` |

###### Returns

`Promise`\<[`YieldInfo`](/docs/api/defi/protocols/src/x402/sdk/types.md#yieldinfo)\>

##### isRebasingEnabled()

```ts
isRebasingEnabled(address: `0x${string}`): Promise<boolean>;
```

Defined in: [defi/protocols/src/x402/sdk/yield/tracker.ts:163](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/x402/sdk/yield/tracker.ts#L163)

Check if rebasing is enabled for an address

###### Parameters

| Parameter | Type |
| :------ | :------ |
| `address` | `` `0x${string}` `` |

###### Returns

`Promise`\<`boolean`\>
