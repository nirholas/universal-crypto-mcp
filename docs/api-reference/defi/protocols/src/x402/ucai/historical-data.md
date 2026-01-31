[**Universal Crypto MCP API Reference v1.0.0**](../../../../../index.md)

***

[Universal Crypto MCP API Reference](/docs/api/index.md) / defi/protocols/src/x402/ucai/historical-data

# defi/protocols/src/x402/ucai/historical-data

## Classes

### HistoricalDataService

Defined in: [defi/protocols/src/x402/ucai/historical-data.ts:82](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/x402/ucai/historical-data.ts#L82)

Historical Contract Data Service

Queries historical data for smart contracts including
transactions, events, and state changes.

#### Constructors

##### Constructor

```ts
new HistoricalDataService(apiKeys?: Record<string, string>): HistoricalDataService;
```

Defined in: [defi/protocols/src/x402/ucai/historical-data.ts:85](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/x402/ucai/historical-data.ts#L85)

###### Parameters

| Parameter | Type |
| :------ | :------ |
| `apiKeys?` | `Record`\<`string`, `string`\> |

###### Returns

[`HistoricalDataService`](/docs/api/defi/protocols/src/x402/ucai/historical-data.md#historicaldataservice)

#### Methods

##### getContractStats()

```ts
getContractStats(contractAddress: `0x${string}`, network: string): Promise<{
  firstTransaction?: HistoricalTransaction;
  lastTransaction?: HistoricalTransaction;
  totalTransactions: number;
  totalValueTransferred: string;
  uniqueUsers: number;
}>;
```

Defined in: [defi/protocols/src/x402/ucai/historical-data.ts:492](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/x402/ucai/historical-data.ts#L492)

Get aggregate statistics for a contract

###### Parameters

| Parameter | Type |
| :------ | :------ |
| `contractAddress` | `` `0x${string}` `` |
| `network` | `string` |

###### Returns

`Promise`\<\{
  `firstTransaction?`: [`HistoricalTransaction`](/docs/api/defi/protocols/src/x402/ucai/types.md#historicaltransaction);
  `lastTransaction?`: [`HistoricalTransaction`](/docs/api/defi/protocols/src/x402/ucai/types.md#historicaltransaction);
  `totalTransactions`: `number`;
  `totalValueTransferred`: `string`;
  `uniqueUsers`: `number`;
\}\>

##### getPricing()

```ts
getPricing(): string;
```

Defined in: [defi/protocols/src/x402/ucai/historical-data.ts:580](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/x402/ucai/historical-data.ts#L580)

Get pricing for historical data queries

###### Returns

`string`

##### queryHistoricalData()

```ts
queryHistoricalData(request: HistoricalDataRequest): Promise<HistoricalDataResult>;
```

Defined in: [defi/protocols/src/x402/ucai/historical-data.ts:102](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/x402/ucai/historical-data.ts#L102)

Query historical data for a contract

###### Parameters

| Parameter | Type | Description |
| :------ | :------ | :------ |
| `request` | [`HistoricalDataRequest`](/docs/api/defi/protocols/src/x402/ucai/types.md#historicaldatarequest) | Historical data request |

###### Returns

`Promise`\<[`HistoricalDataResult`](/docs/api/defi/protocols/src/x402/ucai/types.md#historicaldataresult)\>

Historical data result

## Functions

### getHistoricalDataService()

```ts
function getHistoricalDataService(): HistoricalDataService;
```

Defined in: [defi/protocols/src/x402/ucai/historical-data.ts:591](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/x402/ucai/historical-data.ts#L591)

Get or create historical data service

#### Returns

[`HistoricalDataService`](/docs/api/defi/protocols/src/x402/ucai/historical-data.md#historicaldataservice)

## References

### default

Renames and re-exports [HistoricalDataService](/docs/api/defi/protocols/src/x402/ucai/historical-data.md#historicaldataservice)
