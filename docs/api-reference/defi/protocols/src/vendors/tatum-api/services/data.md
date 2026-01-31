[**Universal Crypto MCP API Reference v1.0.0**](../../../../../../index.md)

***

[Universal Crypto MCP API Reference](/docs/api/index.md) / defi/protocols/src/vendors/tatum-api/services/data

# defi/protocols/src/vendors/tatum-api/services/data

## Classes

### DataService

Defined in: [defi/protocols/src/vendors/tatum-api/services/data.ts:316](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/vendors/tatum-api/services/data.ts#L316)

#### Constructors

##### Constructor

```ts
new DataService(apiClient: TatumApiClient): DataService;
```

Defined in: [defi/protocols/src/vendors/tatum-api/services/data.ts:317](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/vendors/tatum-api/services/data.ts#L317)

###### Parameters

| Parameter | Type |
| :------ | :------ |
| `apiClient` | [`TatumApiClient`](/docs/api/defi/protocols/src/vendors/tatum-api/api-client.md#tatumapiclient) |

###### Returns

[`DataService`](/docs/api/defi/protocols/src/vendors/tatum-api/services/data.md#dataservice)

#### Methods

##### checkMaliciousAddress()

```ts
checkMaliciousAddress(args: any): Promise<any>;
```

Defined in: [defi/protocols/src/vendors/tatum-api/services/data.ts:423](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/vendors/tatum-api/services/data.ts#L423)

###### Parameters

| Parameter | Type |
| :------ | :------ |
| `args` | `any` |

###### Returns

`Promise`\<`any`\>

##### checkOwner()

```ts
checkOwner(args: any): Promise<any>;
```

Defined in: [defi/protocols/src/vendors/tatum-api/services/data.ts:369](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/vendors/tatum-api/services/data.ts#L369)

###### Parameters

| Parameter | Type |
| :------ | :------ |
| `args` | `any` |

###### Returns

`Promise`\<`any`\>

##### getBlockByTime()

```ts
getBlockByTime(args: any): Promise<any>;
```

Defined in: [defi/protocols/src/vendors/tatum-api/services/data.ts:401](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/vendors/tatum-api/services/data.ts#L401)

###### Parameters

| Parameter | Type |
| :------ | :------ |
| `args` | `any` |

###### Returns

`Promise`\<`any`\>

##### getExchangeRate()

```ts
getExchangeRate(args: any): Promise<any>;
```

Defined in: [defi/protocols/src/vendors/tatum-api/services/data.ts:432](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/vendors/tatum-api/services/data.ts#L432)

###### Parameters

| Parameter | Type |
| :------ | :------ |
| `args` | `any` |

###### Returns

`Promise`\<`any`\>

##### getMetadata()

```ts
getMetadata(args: any): Promise<any>;
```

Defined in: [defi/protocols/src/vendors/tatum-api/services/data.ts:319](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/vendors/tatum-api/services/data.ts#L319)

###### Parameters

| Parameter | Type |
| :------ | :------ |
| `args` | `any` |

###### Returns

`Promise`\<`any`\>

##### getOwners()

```ts
getOwners(args: any): Promise<any>;
```

Defined in: [defi/protocols/src/vendors/tatum-api/services/data.ts:356](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/vendors/tatum-api/services/data.ts#L356)

###### Parameters

| Parameter | Type |
| :------ | :------ |
| `args` | `any` |

###### Returns

`Promise`\<`any`\>

##### getTokens()

```ts
getTokens(args: any): Promise<any>;
```

Defined in: [defi/protocols/src/vendors/tatum-api/services/data.ts:412](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/vendors/tatum-api/services/data.ts#L412)

###### Parameters

| Parameter | Type |
| :------ | :------ |
| `args` | `any` |

###### Returns

`Promise`\<`any`\>

##### getTransactionHistory()

```ts
getTransactionHistory(args: any): Promise<any>;
```

Defined in: [defi/protocols/src/vendors/tatum-api/services/data.ts:381](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/vendors/tatum-api/services/data.ts#L381)

###### Parameters

| Parameter | Type |
| :------ | :------ |
| `args` | `any` |

###### Returns

`Promise`\<`any`\>

##### getWalletBalanceByTime()

```ts
getWalletBalanceByTime(args: any): Promise<any>;
```

Defined in: [defi/protocols/src/vendors/tatum-api/services/data.ts:329](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/vendors/tatum-api/services/data.ts#L329)

###### Parameters

| Parameter | Type |
| :------ | :------ |
| `args` | `any` |

###### Returns

`Promise`\<`any`\>

##### getWalletPortfolio()

```ts
getWalletPortfolio(args: any): Promise<any>;
```

Defined in: [defi/protocols/src/vendors/tatum-api/services/data.ts:342](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/vendors/tatum-api/services/data.ts#L342)

###### Parameters

| Parameter | Type |
| :------ | :------ |
| `args` | `any` |

###### Returns

`Promise`\<`any`\>

## Variables

### DATA\_TOOLS

```ts
const DATA_TOOLS: (
  | {
  description: string;
  inputSchema: {
     properties: {
        address?: undefined;
        addresses?: undefined;
        basePair?: undefined;
        blockFrom?: undefined;
        blockNumber?: undefined;
        blockTo?: undefined;
        chain: {
           description: string;
           example: string;
           type: string;
        };
        cursor?: undefined;
        excludeMetadata?: undefined;
        offset?: undefined;
        pageSize?: undefined;
        sort?: undefined;
        symbol?: undefined;
        time?: undefined;
        tokenAddress: {
           description: string;
           example: string;
           type: string;
        };
        tokenId?: undefined;
        tokenIds: {
           description: string;
           type: string;
        };
        tokenTypes?: undefined;
        transactionSubtype?: undefined;
        transactionTypes?: undefined;
        unix?: undefined;
     };
     required: string[];
     type: string;
  };
  name: string;
}
  | {
  description: string;
  inputSchema: {
     properties: {
        address?: undefined;
        addresses: {
           description: string;
           type: string;
        };
        basePair?: undefined;
        blockFrom?: undefined;
        blockNumber: {
           description: string;
           type: string;
        };
        blockTo?: undefined;
        chain: {
           description: string;
           example: string;
           type: string;
        };
        cursor?: undefined;
        excludeMetadata?: undefined;
        offset?: undefined;
        pageSize?: undefined;
        sort?: undefined;
        symbol?: undefined;
        time: {
           description: string;
           type: string;
        };
        tokenAddress?: undefined;
        tokenId?: undefined;
        tokenIds?: undefined;
        tokenTypes?: undefined;
        transactionSubtype?: undefined;
        transactionTypes?: undefined;
        unix: {
           description: string;
           type: string;
        };
     };
     required: string[];
     type: string;
  };
  name: string;
}
  | {
  description: string;
  inputSchema: {
     properties: {
        address?: undefined;
        addresses: {
           description: string;
           type: string;
        };
        basePair?: undefined;
        blockFrom?: undefined;
        blockNumber?: undefined;
        blockTo?: undefined;
        chain: {
           description: string;
           example: string;
           type: string;
        };
        cursor?: undefined;
        excludeMetadata: {
           description: string;
           type: string;
        };
        offset: {
           description: string;
           example: string;
           type: string;
        };
        pageSize: {
           description: string;
           example: string;
           type: string;
        };
        sort?: undefined;
        symbol?: undefined;
        time?: undefined;
        tokenAddress?: undefined;
        tokenId?: undefined;
        tokenIds?: undefined;
        tokenTypes: {
           description: string;
           enum: string[];
           type: string;
        };
        transactionSubtype?: undefined;
        transactionTypes?: undefined;
        unix?: undefined;
     };
     required: string[];
     type: string;
  };
  name: string;
}
  | {
  description: string;
  inputSchema: {
     properties: {
        address?: undefined;
        addresses?: undefined;
        basePair?: undefined;
        blockFrom?: undefined;
        blockNumber?: undefined;
        blockTo?: undefined;
        chain: {
           description: string;
           example: string;
           type: string;
        };
        cursor?: undefined;
        excludeMetadata?: undefined;
        offset: {
           description: string;
           example: string;
           type: string;
        };
        pageSize: {
           description: string;
           example: string;
           type: string;
        };
        sort?: undefined;
        symbol?: undefined;
        time?: undefined;
        tokenAddress: {
           description: string;
           example: string;
           type: string;
        };
        tokenId: {
           description: string;
           type: string;
        };
        tokenIds?: undefined;
        tokenTypes?: undefined;
        transactionSubtype?: undefined;
        transactionTypes?: undefined;
        unix?: undefined;
     };
     required: string[];
     type: string;
  };
  name: string;
}
  | {
  description: string;
  inputSchema: {
     properties: {
        address: {
           description: string;
           example: string;
           type: string;
        };
        addresses?: undefined;
        basePair?: undefined;
        blockFrom?: undefined;
        blockNumber?: undefined;
        blockTo?: undefined;
        chain: {
           description: string;
           example: string;
           type: string;
        };
        cursor?: undefined;
        excludeMetadata?: undefined;
        offset?: undefined;
        pageSize?: undefined;
        sort?: undefined;
        symbol?: undefined;
        time?: undefined;
        tokenAddress: {
           description: string;
           example: string;
           type: string;
        };
        tokenId: {
           description: string;
           type: string;
        };
        tokenIds?: undefined;
        tokenTypes?: undefined;
        transactionSubtype?: undefined;
        transactionTypes?: undefined;
        unix?: undefined;
     };
     required: string[];
     type: string;
  };
  name: string;
}
  | {
  description: string;
  inputSchema: {
     properties: {
        address?: undefined;
        addresses: {
           description: string;
           type: string;
        };
        basePair?: undefined;
        blockFrom: {
           description: string;
           type: string;
        };
        blockNumber?: undefined;
        blockTo: {
           description: string;
           type: string;
        };
        chain: {
           description: string;
           example: string;
           type: string;
        };
        cursor: {
           description: string;
           type: string;
        };
        excludeMetadata?: undefined;
        offset: {
           description: string;
           example: string;
           type: string;
        };
        pageSize: {
           description: string;
           example: string;
           type: string;
        };
        sort: {
           description: string;
           enum: string[];
           type: string;
        };
        symbol?: undefined;
        time?: undefined;
        tokenAddress: {
           description: string;
           example: string;
           type: string;
        };
        tokenId: {
           description: string;
           type: string;
        };
        tokenIds?: undefined;
        tokenTypes?: undefined;
        transactionSubtype: {
           description: string;
           enum: string[];
           type: string;
        };
        transactionTypes: {
           description: string;
           enum: string[];
           type: string;
        };
        unix?: undefined;
     };
     required: string[];
     type: string;
  };
  name: string;
}
  | {
  description: string;
  inputSchema: {
     properties: {
        address?: undefined;
        addresses?: undefined;
        basePair?: undefined;
        blockFrom?: undefined;
        blockNumber?: undefined;
        blockTo?: undefined;
        chain: {
           description: string;
           example: string;
           type: string;
        };
        cursor?: undefined;
        excludeMetadata?: undefined;
        offset?: undefined;
        pageSize?: undefined;
        sort?: undefined;
        symbol?: undefined;
        time: {
           description: string;
           type: string;
        };
        tokenAddress?: undefined;
        tokenId?: undefined;
        tokenIds?: undefined;
        tokenTypes?: undefined;
        transactionSubtype?: undefined;
        transactionTypes?: undefined;
        unix: {
           description: string;
           type: string;
        };
     };
     required: string[];
     type: string;
  };
  name: string;
}
  | {
  description: string;
  inputSchema: {
     properties: {
        address?: undefined;
        addresses?: undefined;
        basePair?: undefined;
        blockFrom?: undefined;
        blockNumber?: undefined;
        blockTo?: undefined;
        chain: {
           description: string;
           example: string;
           type: string;
        };
        cursor?: undefined;
        excludeMetadata?: undefined;
        offset?: undefined;
        pageSize?: undefined;
        sort?: undefined;
        symbol?: undefined;
        time?: undefined;
        tokenAddress: {
           description: string;
           example: string;
           type: string;
        };
        tokenId: {
           description: string;
           type: string;
        };
        tokenIds?: undefined;
        tokenTypes?: undefined;
        transactionSubtype?: undefined;
        transactionTypes?: undefined;
        unix?: undefined;
     };
     required: string[];
     type: string;
  };
  name: string;
}
  | {
  description: string;
  inputSchema: {
     properties: {
        address: {
           description: string;
           example: string;
           type: string;
        };
        addresses?: undefined;
        basePair?: undefined;
        blockFrom?: undefined;
        blockNumber?: undefined;
        blockTo?: undefined;
        chain?: undefined;
        cursor?: undefined;
        excludeMetadata?: undefined;
        offset?: undefined;
        pageSize?: undefined;
        sort?: undefined;
        symbol?: undefined;
        time?: undefined;
        tokenAddress?: undefined;
        tokenId?: undefined;
        tokenIds?: undefined;
        tokenTypes?: undefined;
        transactionSubtype?: undefined;
        transactionTypes?: undefined;
        unix?: undefined;
     };
     required: string[];
     type: string;
  };
  name: string;
}
  | {
  description: string;
  inputSchema: {
     properties: {
        address?: undefined;
        addresses?: undefined;
        basePair: {
           description: string;
           example: string;
           type: string;
        };
        blockFrom?: undefined;
        blockNumber?: undefined;
        blockTo?: undefined;
        chain?: undefined;
        cursor?: undefined;
        excludeMetadata?: undefined;
        offset?: undefined;
        pageSize?: undefined;
        sort?: undefined;
        symbol: {
           description: string;
           example: string;
           type: string;
        };
        time?: undefined;
        tokenAddress?: undefined;
        tokenId?: undefined;
        tokenIds?: undefined;
        tokenTypes?: undefined;
        transactionSubtype?: undefined;
        transactionTypes?: undefined;
        unix?: undefined;
     };
     required: string[];
     type: string;
  };
  name: string;
})[];
```

Defined in: [defi/protocols/src/vendors/tatum-api/services/data.ts:10](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/vendors/tatum-api/services/data.ts#L10)
