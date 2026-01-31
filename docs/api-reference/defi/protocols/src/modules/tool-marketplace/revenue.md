[**Universal Crypto MCP API Reference v1.0.0**](../../../../../index.md)

***

[Universal Crypto MCP API Reference](/docs/api/index.md) / defi/protocols/src/modules/tool-marketplace/revenue

# defi/protocols/src/modules/tool-marketplace/revenue

## Classes

### RevenueSplitterService

Defined in: [defi/protocols/src/modules/tool-marketplace/revenue.ts:60](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/modules/tool-marketplace/revenue.ts#L60)

Revenue Splitter Service
Calculates and executes revenue distribution for tool creators

#### Constructors

##### Constructor

```ts
new RevenueSplitterService(options?: {
  minPayoutAmount?: string;
  payoutToken?: "USDC" | "USDs";
  platformAddress?: `0x${string}`;
}): RevenueSplitterService;
```

Defined in: [defi/protocols/src/modules/tool-marketplace/revenue.ts:65](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/modules/tool-marketplace/revenue.ts#L65)

###### Parameters

| Parameter | Type |
| :------ | :------ |
| `options?` | \{ `minPayoutAmount?`: `string`; `payoutToken?`: `"USDC"` \| `"USDs"`; `platformAddress?`: `` `0x${string}` ``; \} |
| `options.minPayoutAmount?` | `string` |
| `options.payoutToken?` | `"USDC"` \| `"USDs"` |
| `options.platformAddress?` | `` `0x${string}` `` |

###### Returns

[`RevenueSplitterService`](/docs/api/defi/protocols/src/modules/tool-marketplace/revenue.md#revenuesplitterservice)

#### Methods

##### calculateCreatorPayouts()

```ts
calculateCreatorPayouts(creatorAddress: `0x${string}`): Promise<{
  byTool: {
     amount: string;
     toolId: string;
     toolName: string;
  }[];
  totalPending: string;
}>;
```

Defined in: [defi/protocols/src/modules/tool-marketplace/revenue.ts:121](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/modules/tool-marketplace/revenue.ts#L121)

Calculate pending payouts for a creator across all tools

###### Parameters

| Parameter | Type |
| :------ | :------ |
| `creatorAddress` | `` `0x${string}` `` |

###### Returns

`Promise`\<\{
  `byTool`: \{
     `amount`: `string`;
     `toolId`: `string`;
     `toolName`: `string`;
  \}[];
  `totalPending`: `string`;
\}\>

##### calculatePendingPayouts()

```ts
calculatePendingPayouts(toolId: string): Promise<RevenueDistribution>;
```

Defined in: [defi/protocols/src/modules/tool-marketplace/revenue.ts:78](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/modules/tool-marketplace/revenue.ts#L78)

Calculate pending payouts for a tool

###### Parameters

| Parameter | Type |
| :------ | :------ |
| `toolId` | `string` |

###### Returns

`Promise`\<[`RevenueDistribution`](/docs/api/defi/protocols/src/modules/tool-marketplace/revenue.md#revenuedistribution)\>

##### getPayoutHistory()

```ts
getPayoutHistory(toolId: string): Promise<PayoutRecord[]>;
```

Defined in: [defi/protocols/src/modules/tool-marketplace/revenue.ts:236](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/modules/tool-marketplace/revenue.ts#L236)

Get payout history for a tool

###### Parameters

| Parameter | Type |
| :------ | :------ |
| `toolId` | `string` |

###### Returns

`Promise`\<[`PayoutRecord`](/docs/api/defi/protocols/src/modules/tool-marketplace/revenue.md#payoutrecord)[]\>

##### getRecipientPayouts()

```ts
getRecipientPayouts(recipientAddress: `0x${string}`): Promise<PayoutRecord[]>;
```

Defined in: [defi/protocols/src/modules/tool-marketplace/revenue.ts:243](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/modules/tool-marketplace/revenue.ts#L243)

Get all payouts for a recipient

###### Parameters

| Parameter | Type |
| :------ | :------ |
| `recipientAddress` | `` `0x${string}` `` |

###### Returns

`Promise`\<[`PayoutRecord`](/docs/api/defi/protocols/src/modules/tool-marketplace/revenue.md#payoutrecord)[]\>

##### getWeeklyPayoutSummary()

```ts
getWeeklyPayoutSummary(): Promise<{
  byTool: {
     amount: string;
     toolId: string;
  }[];
  payoutCount: number;
  totalPaid: string;
  uniqueRecipients: number;
}>;
```

Defined in: [defi/protocols/src/modules/tool-marketplace/revenue.ts:260](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/modules/tool-marketplace/revenue.ts#L260)

Get weekly payout summary

###### Returns

`Promise`\<\{
  `byTool`: \{
     `amount`: `string`;
     `toolId`: `string`;
  \}[];
  `payoutCount`: `number`;
  `totalPaid`: `string`;
  `uniqueRecipients`: `number`;
\}\>

##### preparePayouts()

```ts
preparePayouts(toolId: string, options?: {
  forceAll?: boolean;
}): Promise<{
  amount: string;
  label?: string;
  recipient: `0x${string}`;
}[]>;
```

Defined in: [defi/protocols/src/modules/tool-marketplace/revenue.ts:162](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/modules/tool-marketplace/revenue.ts#L162)

Execute payouts for a tool
Returns the payment operations to execute

###### Parameters

| Parameter | Type |
| :------ | :------ |
| `toolId` | `string` |
| `options?` | \{ `forceAll?`: `boolean`; \} |
| `options.forceAll?` | `boolean` |

###### Returns

`Promise`\<\{
  `amount`: `string`;
  `label?`: `string`;
  `recipient`: `` `0x${string}` ``;
\}[]\>

##### recordPayout()

```ts
recordPayout(
   toolId: string, 
   recipient: `0x${string}`, 
   amount: string, 
   txHash: string, 
   periodStart: number, 
periodEnd: number): Promise<PayoutRecord>;
```

Defined in: [defi/protocols/src/modules/tool-marketplace/revenue.ts:203](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/modules/tool-marketplace/revenue.ts#L203)

Record a completed payout

###### Parameters

| Parameter | Type |
| :------ | :------ |
| `toolId` | `string` |
| `recipient` | `` `0x${string}` `` |
| `amount` | `string` |
| `txHash` | `string` |
| `periodStart` | `number` |
| `periodEnd` | `number` |

###### Returns

`Promise`\<[`PayoutRecord`](/docs/api/defi/protocols/src/modules/tool-marketplace/revenue.md#payoutrecord)\>

## Interfaces

### PayoutRecord

Defined in: [defi/protocols/src/modules/tool-marketplace/revenue.ts:16](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/modules/tool-marketplace/revenue.ts#L16)

Payout record

#### Properties

| Property | Type | Defined in |
| :------ | :------ | :------ |
| <a id="amount"></a> `amount` | `string` | [defi/protocols/src/modules/tool-marketplace/revenue.ts:20](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/modules/tool-marketplace/revenue.ts#L20) |
| <a id="id"></a> `id` | `string` | [defi/protocols/src/modules/tool-marketplace/revenue.ts:17](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/modules/tool-marketplace/revenue.ts#L17) |
| <a id="period"></a> `period` | \{ `end`: `number`; `start`: `number`; \} | [defi/protocols/src/modules/tool-marketplace/revenue.ts:24](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/modules/tool-marketplace/revenue.ts#L24) |
| `period.end` | `number` | [defi/protocols/src/modules/tool-marketplace/revenue.ts:26](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/modules/tool-marketplace/revenue.ts#L26) |
| `period.start` | `number` | [defi/protocols/src/modules/tool-marketplace/revenue.ts:25](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/modules/tool-marketplace/revenue.ts#L25) |
| <a id="recipient"></a> `recipient` | `` `0x${string}` `` | [defi/protocols/src/modules/tool-marketplace/revenue.ts:19](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/modules/tool-marketplace/revenue.ts#L19) |
| <a id="timestamp"></a> `timestamp` | `number` | [defi/protocols/src/modules/tool-marketplace/revenue.ts:23](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/modules/tool-marketplace/revenue.ts#L23) |
| <a id="token"></a> `token` | `string` | [defi/protocols/src/modules/tool-marketplace/revenue.ts:21](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/modules/tool-marketplace/revenue.ts#L21) |
| <a id="toolid"></a> `toolId` | `string` | [defi/protocols/src/modules/tool-marketplace/revenue.ts:18](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/modules/tool-marketplace/revenue.ts#L18) |
| <a id="txhash"></a> `txHash` | `string` | [defi/protocols/src/modules/tool-marketplace/revenue.ts:22](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/modules/tool-marketplace/revenue.ts#L22) |

***

### PendingPayout

Defined in: [defi/protocols/src/modules/tool-marketplace/revenue.ts:33](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/modules/tool-marketplace/revenue.ts#L33)

Pending payout calculation

#### Properties

| Property | Type | Defined in |
| :------ | :------ | :------ |
| <a id="amount-1"></a> `amount` | `string` | [defi/protocols/src/modules/tool-marketplace/revenue.ts:36](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/modules/tool-marketplace/revenue.ts#L36) |
| <a id="label"></a> `label?` | `string` | [defi/protocols/src/modules/tool-marketplace/revenue.ts:35](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/modules/tool-marketplace/revenue.ts#L35) |
| <a id="percentage"></a> `percentage` | `number` | [defi/protocols/src/modules/tool-marketplace/revenue.ts:37](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/modules/tool-marketplace/revenue.ts#L37) |
| <a id="recipient-1"></a> `recipient` | `` `0x${string}` `` | [defi/protocols/src/modules/tool-marketplace/revenue.ts:34](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/modules/tool-marketplace/revenue.ts#L34) |

***

### RevenueDistribution

Defined in: [defi/protocols/src/modules/tool-marketplace/revenue.ts:43](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/modules/tool-marketplace/revenue.ts#L43)

Revenue distribution for a tool

#### Properties

| Property | Type | Defined in |
| :------ | :------ | :------ |
| <a id="distribution"></a> `distribution` | [`PendingPayout`](/docs/api/defi/protocols/src/modules/tool-marketplace/revenue.md#pendingpayout)[] | [defi/protocols/src/modules/tool-marketplace/revenue.ts:48](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/modules/tool-marketplace/revenue.ts#L48) |
| <a id="periodrevenue"></a> `periodRevenue` | `string` | [defi/protocols/src/modules/tool-marketplace/revenue.ts:47](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/modules/tool-marketplace/revenue.ts#L47) |
| <a id="platformfee"></a> `platformFee` | `string` | [defi/protocols/src/modules/tool-marketplace/revenue.ts:49](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/modules/tool-marketplace/revenue.ts#L49) |
| <a id="toolid-1"></a> `toolId` | `string` | [defi/protocols/src/modules/tool-marketplace/revenue.ts:44](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/modules/tool-marketplace/revenue.ts#L44) |
| <a id="toolname"></a> `toolName` | `string` | [defi/protocols/src/modules/tool-marketplace/revenue.ts:45](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/modules/tool-marketplace/revenue.ts#L45) |
| <a id="totalrevenue"></a> `totalRevenue` | `string` | [defi/protocols/src/modules/tool-marketplace/revenue.ts:46](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/modules/tool-marketplace/revenue.ts#L46) |

## Variables

### revenueSplitter

```ts
const revenueSplitter: RevenueSplitterService;
```

Defined in: [defi/protocols/src/modules/tool-marketplace/revenue.ts:299](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/modules/tool-marketplace/revenue.ts#L299)
