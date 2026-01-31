[**Universal Crypto MCP API Reference v1.0.0**](../../../../../index.md)

***

[Universal Crypto MCP API Reference](/docs/api/index.md) / defi/protocols/src/x402/server/analytics

# defi/protocols/src/x402/server/analytics

## Classes

### InMemoryAnalyticsStorage

Defined in: [defi/protocols/src/x402/server/analytics.ts:74](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/x402/server/analytics.ts#L74)

Simple in-memory analytics storage
Good for development/testing

#### Implements

- [`AnalyticsStorage`](/docs/api/defi/protocols/src/x402/server/analytics.md#analyticsstorage)

#### Constructors

##### Constructor

```ts
new InMemoryAnalyticsStorage(): InMemoryAnalyticsStorage;
```

###### Returns

[`InMemoryAnalyticsStorage`](/docs/api/defi/protocols/src/x402/server/analytics.md#inmemoryanalyticsstorage)

#### Methods

##### clear()

```ts
clear(): Promise<void>;
```

Defined in: [defi/protocols/src/x402/server/analytics.ts:119](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/x402/server/analytics.ts#L119)

Clear all records

###### Returns

`Promise`\<`void`\>

###### Implementation of

[`AnalyticsStorage`](/docs/api/defi/protocols/src/x402/server/analytics.md#analyticsstorage).[`clear`](/docs/api/defi/protocols/src/x402/server/analytics.md#clear-6)

##### count()

```ts
count(options?: AnalyticsQueryOptions): Promise<number>;
```

Defined in: [defi/protocols/src/x402/server/analytics.ts:114](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/x402/server/analytics.ts#L114)

Get count of records

###### Parameters

| Parameter | Type |
| :------ | :------ |
| `options?` | [`AnalyticsQueryOptions`](/docs/api/defi/protocols/src/x402/server/types.md#analyticsqueryoptions) |

###### Returns

`Promise`\<`number`\>

###### Implementation of

[`AnalyticsStorage`](/docs/api/defi/protocols/src/x402/server/analytics.md#analyticsstorage).[`count`](/docs/api/defi/protocols/src/x402/server/analytics.md#count-4)

##### getAll()

```ts
getAll(): Promise<PaymentRecord[]>;
```

Defined in: [defi/protocols/src/x402/server/analytics.ts:110](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/x402/server/analytics.ts#L110)

Get all records

###### Returns

`Promise`\<[`PaymentRecord`](/docs/api/defi/protocols/src/x402/server/types.md#paymentrecord)[]\>

###### Implementation of

[`AnalyticsStorage`](/docs/api/defi/protocols/src/x402/server/analytics.md#analyticsstorage).[`getAll`](/docs/api/defi/protocols/src/x402/server/analytics.md#getall-4)

##### query()

```ts
query(options: AnalyticsQueryOptions): Promise<PaymentRecord[]>;
```

Defined in: [defi/protocols/src/x402/server/analytics.ts:81](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/x402/server/analytics.ts#L81)

Query payment records

###### Parameters

| Parameter | Type |
| :------ | :------ |
| `options` | [`AnalyticsQueryOptions`](/docs/api/defi/protocols/src/x402/server/types.md#analyticsqueryoptions) |

###### Returns

`Promise`\<[`PaymentRecord`](/docs/api/defi/protocols/src/x402/server/types.md#paymentrecord)[]\>

###### Implementation of

[`AnalyticsStorage`](/docs/api/defi/protocols/src/x402/server/analytics.md#analyticsstorage).[`query`](/docs/api/defi/protocols/src/x402/server/analytics.md#query-4)

##### save()

```ts
save(record: PaymentRecord): Promise<void>;
```

Defined in: [defi/protocols/src/x402/server/analytics.ts:77](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/x402/server/analytics.ts#L77)

Save a payment record

###### Parameters

| Parameter | Type |
| :------ | :------ |
| `record` | [`PaymentRecord`](/docs/api/defi/protocols/src/x402/server/types.md#paymentrecord) |

###### Returns

`Promise`\<`void`\>

###### Implementation of

[`AnalyticsStorage`](/docs/api/defi/protocols/src/x402/server/analytics.md#analyticsstorage).[`save`](/docs/api/defi/protocols/src/x402/server/analytics.md#save-4)

***

### JsonFileAnalyticsStorage

Defined in: [defi/protocols/src/x402/server/analytics.ts:132](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/x402/server/analytics.ts#L132)

JSON file-based analytics storage
Persists data to disk

#### Implements

- [`AnalyticsStorage`](/docs/api/defi/protocols/src/x402/server/analytics.md#analyticsstorage)

#### Constructors

##### Constructor

```ts
new JsonFileAnalyticsStorage(filePath: string): JsonFileAnalyticsStorage;
```

Defined in: [defi/protocols/src/x402/server/analytics.ts:138](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/x402/server/analytics.ts#L138)

###### Parameters

| Parameter | Type |
| :------ | :------ |
| `filePath` | `string` |

###### Returns

[`JsonFileAnalyticsStorage`](/docs/api/defi/protocols/src/x402/server/analytics.md#jsonfileanalyticsstorage)

#### Methods

##### clear()

```ts
clear(): Promise<void>;
```

Defined in: [defi/protocols/src/x402/server/analytics.ts:224](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/x402/server/analytics.ts#L224)

Clear all records

###### Returns

`Promise`\<`void`\>

###### Implementation of

[`AnalyticsStorage`](/docs/api/defi/protocols/src/x402/server/analytics.md#analyticsstorage).[`clear`](/docs/api/defi/protocols/src/x402/server/analytics.md#clear-6)

##### count()

```ts
count(options?: AnalyticsQueryOptions): Promise<number>;
```

Defined in: [defi/protocols/src/x402/server/analytics.ts:218](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/x402/server/analytics.ts#L218)

Get count of records

###### Parameters

| Parameter | Type |
| :------ | :------ |
| `options?` | [`AnalyticsQueryOptions`](/docs/api/defi/protocols/src/x402/server/types.md#analyticsqueryoptions) |

###### Returns

`Promise`\<`number`\>

###### Implementation of

[`AnalyticsStorage`](/docs/api/defi/protocols/src/x402/server/analytics.md#analyticsstorage).[`count`](/docs/api/defi/protocols/src/x402/server/analytics.md#count-4)

##### getAll()

```ts
getAll(): Promise<PaymentRecord[]>;
```

Defined in: [defi/protocols/src/x402/server/analytics.ts:213](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/x402/server/analytics.ts#L213)

Get all records

###### Returns

`Promise`\<[`PaymentRecord`](/docs/api/defi/protocols/src/x402/server/types.md#paymentrecord)[]\>

###### Implementation of

[`AnalyticsStorage`](/docs/api/defi/protocols/src/x402/server/analytics.md#analyticsstorage).[`getAll`](/docs/api/defi/protocols/src/x402/server/analytics.md#getall-4)

##### query()

```ts
query(options: AnalyticsQueryOptions): Promise<PaymentRecord[]>;
```

Defined in: [defi/protocols/src/x402/server/analytics.ts:183](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/x402/server/analytics.ts#L183)

Query payment records

###### Parameters

| Parameter | Type |
| :------ | :------ |
| `options` | [`AnalyticsQueryOptions`](/docs/api/defi/protocols/src/x402/server/types.md#analyticsqueryoptions) |

###### Returns

`Promise`\<[`PaymentRecord`](/docs/api/defi/protocols/src/x402/server/types.md#paymentrecord)[]\>

###### Implementation of

[`AnalyticsStorage`](/docs/api/defi/protocols/src/x402/server/analytics.md#analyticsstorage).[`query`](/docs/api/defi/protocols/src/x402/server/analytics.md#query-4)

##### save()

```ts
save(record: PaymentRecord): Promise<void>;
```

Defined in: [defi/protocols/src/x402/server/analytics.ts:177](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/x402/server/analytics.ts#L177)

Save a payment record

###### Parameters

| Parameter | Type |
| :------ | :------ |
| `record` | [`PaymentRecord`](/docs/api/defi/protocols/src/x402/server/types.md#paymentrecord) |

###### Returns

`Promise`\<`void`\>

###### Implementation of

[`AnalyticsStorage`](/docs/api/defi/protocols/src/x402/server/analytics.md#analyticsstorage).[`save`](/docs/api/defi/protocols/src/x402/server/analytics.md#save-4)

***

### X402Analytics

Defined in: [defi/protocols/src/x402/server/analytics.ts:253](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/x402/server/analytics.ts#L253)

X402 Payment Analytics

Tracks payments, calculates revenue, and exports data

#### Constructors

##### Constructor

```ts
new X402Analytics(config: AnalyticsConfig): X402Analytics;
```

Defined in: [defi/protocols/src/x402/server/analytics.ts:258](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/x402/server/analytics.ts#L258)

###### Parameters

| Parameter | Type |
| :------ | :------ |
| `config` | [`AnalyticsConfig`](/docs/api/defi/protocols/src/x402/server/analytics.md#analyticsconfig) |

###### Returns

[`X402Analytics`](/docs/api/defi/protocols/src/x402/server/analytics.md#x402analytics)

#### Methods

##### clear()

```ts
clear(): Promise<void>;
```

Defined in: [defi/protocols/src/x402/server/analytics.ts:667](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/x402/server/analytics.ts#L667)

Clear all analytics data
WARNING: This is irreversible

###### Returns

`Promise`\<`void`\>

##### export()

```ts
export(options: ExportOptions): Promise<string>;
```

Defined in: [defi/protocols/src/x402/server/analytics.ts:567](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/x402/server/analytics.ts#L567)

Export analytics data

###### Parameters

| Parameter | Type |
| :------ | :------ |
| `options` | [`ExportOptions`](/docs/api/defi/protocols/src/x402/server/types.md#exportoptions) |

###### Returns

`Promise`\<`string`\>

###### Example

```typescript
// Export as JSON
const json = await analytics.export({ format: 'json' });

// Export as CSV
const csv = await analytics.export({ format: 'csv' });

// Export with filters
const filtered = await analytics.export({
  format: 'csv',
  startTime: Date.now() - 7 * 24 * 60 * 60 * 1000,
  resource: '/api/premium'
});
```

##### getPayerHistory()

```ts
getPayerHistory(payer: `0x${string}`, options: Omit<AnalyticsQueryOptions, "payer">): Promise<PaymentRecord[]>;
```

Defined in: [defi/protocols/src/x402/server/analytics.ts:540](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/x402/server/analytics.ts#L540)

Get payment history for a specific payer

###### Parameters

| Parameter | Type |
| :------ | :------ |
| `payer` | `` `0x${string}` `` |
| `options` | `Omit`\<[`AnalyticsQueryOptions`](/docs/api/defi/protocols/src/x402/server/types.md#analyticsqueryoptions), `"payer"`\> |

###### Returns

`Promise`\<[`PaymentRecord`](/docs/api/defi/protocols/src/x402/server/types.md#paymentrecord)[]\>

##### getRecentPayments()

```ts
getRecentPayments(limit: number): Promise<PaymentRecord[]>;
```

Defined in: [defi/protocols/src/x402/server/analytics.ts:652](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/x402/server/analytics.ts#L652)

Get recent payments

###### Parameters

| Parameter | Type | Default value |
| :------ | :------ | :------ |
| `limit` | `number` | `10` |

###### Returns

`Promise`\<[`PaymentRecord`](/docs/api/defi/protocols/src/x402/server/types.md#paymentrecord)[]\>

##### getRevenueByEndpoint()

```ts
getRevenueByEndpoint(options: AnalyticsQueryOptions): Promise<EndpointRevenue[]>;
```

Defined in: [defi/protocols/src/x402/server/analytics.ts:368](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/x402/server/analytics.ts#L368)

Get revenue broken down by endpoint

###### Parameters

| Parameter | Type |
| :------ | :------ |
| `options` | [`AnalyticsQueryOptions`](/docs/api/defi/protocols/src/x402/server/types.md#analyticsqueryoptions) |

###### Returns

`Promise`\<[`EndpointRevenue`](/docs/api/defi/protocols/src/x402/server/types.md#endpointrevenue)[]\>

###### Example

```typescript
const byEndpoint = await analytics.getRevenueByEndpoint();
// [
//   { resource: '/api/joke', total: '10.50', count: 1050, percentage: 70 },
//   { resource: '/api/summary', total: '4.50', count: 45, percentage: 30 }
// ]
```

##### getRevenueOverTime()

```ts
getRevenueOverTime(options: AnalyticsQueryOptions & {
  groupBy?: "day" | "week" | "month" | "hour";
}): Promise<{
  count: number;
  period: string;
  periodEnd: number;
  periodStart: number;
  total: string;
}[]>;
```

Defined in: [defi/protocols/src/x402/server/analytics.ts:412](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/x402/server/analytics.ts#L412)

Get revenue over time (for charts)

###### Parameters

| Parameter | Type |
| :------ | :------ |
| `options` | [`AnalyticsQueryOptions`](/docs/api/defi/protocols/src/x402/server/types.md#analyticsqueryoptions) & \{ `groupBy?`: `"day"` \| `"week"` \| `"month"` \| `"hour"`; \} |

###### Returns

`Promise`\<\{
  `count`: `number`;
  `period`: `string`;
  `periodEnd`: `number`;
  `periodStart`: `number`;
  `total`: `string`;
\}[]\>

###### Example

```typescript
const daily = await analytics.getRevenueOverTime({
  groupBy: 'day',
  startTime: Date.now() - 30 * 24 * 60 * 60 * 1000
});
```

##### getRevenueSummary()

```ts
getRevenueSummary(options: AnalyticsQueryOptions): Promise<RevenueSummary>;
```

Defined in: [defi/protocols/src/x402/server/analytics.ts:336](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/x402/server/analytics.ts#L336)

Get revenue summary

###### Parameters

| Parameter | Type |
| :------ | :------ |
| `options` | [`AnalyticsQueryOptions`](/docs/api/defi/protocols/src/x402/server/types.md#analyticsqueryoptions) |

###### Returns

`Promise`\<[`RevenueSummary`](/docs/api/defi/protocols/src/x402/server/types.md#revenuesummary)\>

###### Example

```typescript
// Total revenue
const total = await analytics.getRevenueSummary();

// Today's revenue
const today = await analytics.getRevenueSummary({
  startTime: new Date().setHours(0, 0, 0, 0)
});

// Revenue for specific endpoint
const jokeRevenue = await analytics.getRevenueSummary({
  resource: '/api/joke'
});
```

##### getStats()

```ts
getStats(): Promise<{
  averagePayment: string;
  firstPayment: number | null;
  lastPayment: number | null;
  totalPayments: number;
  totalRevenue: string;
  uniquePayers: number;
  uniqueResources: number;
}>;
```

Defined in: [defi/protocols/src/x402/server/analytics.ts:675](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/x402/server/analytics.ts#L675)

Get summary statistics

###### Returns

`Promise`\<\{
  `averagePayment`: `string`;
  `firstPayment`: `number` \| `null`;
  `lastPayment`: `number` \| `null`;
  `totalPayments`: `number`;
  `totalRevenue`: `string`;
  `uniquePayers`: `number`;
  `uniqueResources`: `number`;
\}\>

##### getTopPayers()

```ts
getTopPayers(options: AnalyticsQueryOptions): Promise<TopPayer[]>;
```

Defined in: [defi/protocols/src/x402/server/analytics.ts:490](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/x402/server/analytics.ts#L490)

Get top payers

###### Parameters

| Parameter | Type |
| :------ | :------ |
| `options` | [`AnalyticsQueryOptions`](/docs/api/defi/protocols/src/x402/server/types.md#analyticsqueryoptions) |

###### Returns

`Promise`\<[`TopPayer`](/docs/api/defi/protocols/src/x402/server/types.md#toppayer)[]\>

###### Example

```typescript
const topPayers = await analytics.getTopPayers({ limit: 10 });
```

##### getTotalCount()

```ts
getTotalCount(): Promise<number>;
```

Defined in: [defi/protocols/src/x402/server/analytics.ts:659](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/x402/server/analytics.ts#L659)

Get total payment count

###### Returns

`Promise`\<`number`\>

##### recordPayment()

```ts
recordPayment(payment: Omit<PaymentRecord, "id" | "timestamp"> & {
  timestamp?: number;
}): Promise<string>;
```

Defined in: [defi/protocols/src/x402/server/analytics.ts:292](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/x402/server/analytics.ts#L292)

Record a payment

###### Parameters

| Parameter | Type |
| :------ | :------ |
| `payment` | `Omit`\<[`PaymentRecord`](/docs/api/defi/protocols/src/x402/server/types.md#paymentrecord), `"id"` \| `"timestamp"`\> & \{ `timestamp?`: `number`; \} |

###### Returns

`Promise`\<`string`\>

###### Example

```typescript
await analytics.recordPayment({
  txHash: '0xabc...',
  chain: 'arbitrum',
  amount: '0.01',
  token: 'USDs',
  payer: '0x1234...',
  resource: '/api/joke',
  method: 'GET',
  statusCode: 200
});
```

## Interfaces

### AnalyticsConfig

Defined in: [defi/protocols/src/x402/server/analytics.ts:237](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/x402/server/analytics.ts#L237)

Analytics configuration

#### Properties

| Property | Type | Description | Defined in |
| :------ | :------ | :------ | :------ |
| <a id="defaultchain"></a> `defaultChain?` | [`X402Chain`](/docs/api/defi/protocols/src/x402/sdk/types.md#x402chain) | Default chain | [defi/protocols/src/x402/server/analytics.ts:245](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/x402/server/analytics.ts#L245) |
| <a id="defaulttoken"></a> `defaultToken?` | [`X402Token`](/docs/api/defi/protocols/src/x402/sdk/types.md#x402token) | Default token for calculations | [defi/protocols/src/x402/server/analytics.ts:243](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/x402/server/analytics.ts#L243) |
| <a id="storage"></a> `storage?` | [`AnalyticsStorage`](/docs/api/defi/protocols/src/x402/server/analytics.md#analyticsstorage) | Storage backend (default: in-memory) | [defi/protocols/src/x402/server/analytics.ts:239](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/x402/server/analytics.ts#L239) |
| <a id="storagepath"></a> `storagePath?` | `string` | File path for JSON storage | [defi/protocols/src/x402/server/analytics.ts:241](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/x402/server/analytics.ts#L241) |

***

### AnalyticsStorage

Defined in: [defi/protocols/src/x402/server/analytics.ts:53](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/x402/server/analytics.ts#L53)

Analytics storage backend interface

#### Methods

##### clear()

```ts
clear(): Promise<void>;
```

Defined in: [defi/protocols/src/x402/server/analytics.ts:63](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/x402/server/analytics.ts#L63)

Clear all records

###### Returns

`Promise`\<`void`\>

##### count()

```ts
count(options?: AnalyticsQueryOptions): Promise<number>;
```

Defined in: [defi/protocols/src/x402/server/analytics.ts:61](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/x402/server/analytics.ts#L61)

Get count of records

###### Parameters

| Parameter | Type |
| :------ | :------ |
| `options?` | [`AnalyticsQueryOptions`](/docs/api/defi/protocols/src/x402/server/types.md#analyticsqueryoptions) |

###### Returns

`Promise`\<`number`\>

##### getAll()

```ts
getAll(): Promise<PaymentRecord[]>;
```

Defined in: [defi/protocols/src/x402/server/analytics.ts:59](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/x402/server/analytics.ts#L59)

Get all records

###### Returns

`Promise`\<[`PaymentRecord`](/docs/api/defi/protocols/src/x402/server/types.md#paymentrecord)[]\>

##### query()

```ts
query(options: AnalyticsQueryOptions): Promise<PaymentRecord[]>;
```

Defined in: [defi/protocols/src/x402/server/analytics.ts:57](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/x402/server/analytics.ts#L57)

Query payment records

###### Parameters

| Parameter | Type |
| :------ | :------ |
| `options` | [`AnalyticsQueryOptions`](/docs/api/defi/protocols/src/x402/server/types.md#analyticsqueryoptions) |

###### Returns

`Promise`\<[`PaymentRecord`](/docs/api/defi/protocols/src/x402/server/types.md#paymentrecord)[]\>

##### save()

```ts
save(record: PaymentRecord): Promise<void>;
```

Defined in: [defi/protocols/src/x402/server/analytics.ts:55](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/x402/server/analytics.ts#L55)

Save a payment record

###### Parameters

| Parameter | Type |
| :------ | :------ |
| `record` | [`PaymentRecord`](/docs/api/defi/protocols/src/x402/server/types.md#paymentrecord) |

###### Returns

`Promise`\<`void`\>

## Functions

### createFileAnalytics()

```ts
function createFileAnalytics(filePath: string, options: Omit<AnalyticsConfig, "storagePath" | "storage">): X402Analytics;
```

Defined in: [defi/protocols/src/x402/server/analytics.ts:722](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/x402/server/analytics.ts#L722)

Create analytics with file storage

#### Parameters

| Parameter | Type |
| :------ | :------ |
| `filePath` | `string` |
| `options` | `Omit`\<[`AnalyticsConfig`](/docs/api/defi/protocols/src/x402/server/analytics.md#analyticsconfig), `"storagePath"` \| `"storage"`\> |

#### Returns

[`X402Analytics`](/docs/api/defi/protocols/src/x402/server/analytics.md#x402analytics)

***

### createMemoryAnalytics()

```ts
function createMemoryAnalytics(options: Omit<AnalyticsConfig, "storagePath" | "storage">): X402Analytics;
```

Defined in: [defi/protocols/src/x402/server/analytics.ts:729](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/x402/server/analytics.ts#L729)

Create analytics with in-memory storage

#### Parameters

| Parameter | Type |
| :------ | :------ |
| `options` | `Omit`\<[`AnalyticsConfig`](/docs/api/defi/protocols/src/x402/server/analytics.md#analyticsconfig), `"storagePath"` \| `"storage"`\> |

#### Returns

[`X402Analytics`](/docs/api/defi/protocols/src/x402/server/analytics.md#x402analytics)
