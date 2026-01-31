[**Universal Crypto MCP API Reference v1.0.0**](../../../../../../../../index.md)

***

[Universal Crypto MCP API Reference](/docs/api/index.md) / defi/protocols/src/vendors/algorand/tools/apiManager/indexer/application

# defi/protocols/src/vendors/algorand/tools/apiManager/indexer/application

## Variables

### applicationTools

```ts
const applicationTools: (
  | {
  description: string;
  inputSchema: {
     properties: {
        appId: {
           description: string;
           type: string;
        };
        boxName?: undefined;
        creator?: undefined;
        limit?: undefined;
        maxBoxes?: undefined;
        maxRound?: undefined;
        minRound?: undefined;
        nextToken?: undefined;
        sender?: undefined;
        txid?: undefined;
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
        appId: {
           description: string;
           type: string;
        };
        boxName?: undefined;
        creator?: undefined;
        limit: {
           description: string;
           type: string;
        };
        maxBoxes?: undefined;
        maxRound: {
           description: string;
           type: string;
        };
        minRound: {
           description: string;
           type: string;
        };
        nextToken: {
           description: string;
           type: string;
        };
        sender: {
           description: string;
           type: string;
        };
        txid: {
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
        appId?: undefined;
        boxName?: undefined;
        creator: {
           description: string;
           type: string;
        };
        limit: {
           description: string;
           type: string;
        };
        maxBoxes?: undefined;
        maxRound?: undefined;
        minRound?: undefined;
        nextToken: {
           description: string;
           type: string;
        };
        sender?: undefined;
        txid?: undefined;
     };
     required?: undefined;
     type: string;
  };
  name: string;
}
  | {
  description: string;
  inputSchema: {
     properties: {
        appId: {
           description: string;
           type: string;
        };
        boxName: {
           description: string;
           type: string;
        };
        creator?: undefined;
        limit?: undefined;
        maxBoxes?: undefined;
        maxRound?: undefined;
        minRound?: undefined;
        nextToken?: undefined;
        sender?: undefined;
        txid?: undefined;
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
        appId: {
           description: string;
           type: string;
        };
        boxName?: undefined;
        creator?: undefined;
        limit?: undefined;
        maxBoxes: {
           description: string;
           type: string;
        };
        maxRound?: undefined;
        minRound?: undefined;
        nextToken?: undefined;
        sender?: undefined;
        txid?: undefined;
     };
     required: string[];
     type: string;
  };
  name: string;
})[];
```

Defined in: [defi/protocols/src/vendors/algorand/tools/apiManager/indexer/application.ts:18](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/vendors/algorand/tools/apiManager/indexer/application.ts#L18)

***

### handleApplicationTools()

```ts
const handleApplicationTools: (args: any) => Promise<any>;
```

Defined in: [defi/protocols/src/vendors/algorand/tools/apiManager/indexer/application.ts:291](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/vendors/algorand/tools/apiManager/indexer/application.ts#L291)

#### Parameters

| Parameter | Type |
| :------ | :------ |
| `args` | `any` |

#### Returns

`Promise`\<`any`\>

## Functions

### lookupApplicationBoxByIDandName()

```ts
function lookupApplicationBoxByIDandName(appId: number, boxName: string): Promise<Box>;
```

Defined in: [defi/protocols/src/vendors/algorand/tools/apiManager/indexer/application.ts:228](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/vendors/algorand/tools/apiManager/indexer/application.ts#L228)

#### Parameters

| Parameter | Type |
| :------ | :------ |
| `appId` | `number` |
| `boxName` | `string` |

#### Returns

`Promise`\<`Box`\>

***

### lookupApplicationLogs()

```ts
function lookupApplicationLogs(appId: number, params?: {
  limit?: number;
  maxRound?: number;
  minRound?: number;
  nextToken?: string;
  sender?: string;
  txid?: string;
}): Promise<ApplicationLogsResponse>;
```

Defined in: [defi/protocols/src/vendors/algorand/tools/apiManager/indexer/application.ts:148](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/vendors/algorand/tools/apiManager/indexer/application.ts#L148)

#### Parameters

| Parameter | Type |
| :------ | :------ |
| `appId` | `number` |
| `params?` | \{ `limit?`: `number`; `maxRound?`: `number`; `minRound?`: `number`; `nextToken?`: `string`; `sender?`: `string`; `txid?`: `string`; \} |
| `params.limit?` | `number` |
| `params.maxRound?` | `number` |
| `params.minRound?` | `number` |
| `params.nextToken?` | `string` |
| `params.sender?` | `string` |
| `params.txid?` | `string` |

#### Returns

`Promise`\<`ApplicationLogsResponse`\>

***

### lookupApplications()

```ts
function lookupApplications(appId: number): Promise<ApplicationResponse>;
```

Defined in: [defi/protocols/src/vendors/algorand/tools/apiManager/indexer/application.ts:130](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/vendors/algorand/tools/apiManager/indexer/application.ts#L130)

#### Parameters

| Parameter | Type |
| :------ | :------ |
| `appId` | `number` |

#### Returns

`Promise`\<`ApplicationResponse`\>

***

### searchForApplicationBoxes()

```ts
function searchForApplicationBoxes(appId: number, maxBoxes?: number): Promise<any>;
```

Defined in: [defi/protocols/src/vendors/algorand/tools/apiManager/indexer/application.ts:269](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/vendors/algorand/tools/apiManager/indexer/application.ts#L269)

#### Parameters

| Parameter | Type |
| :------ | :------ |
| `appId` | `number` |
| `maxBoxes?` | `number` |

#### Returns

`Promise`\<`any`\>

***

### searchForApplications()

```ts
function searchForApplications(params?: {
  creator?: string;
  limit?: number;
  nextToken?: string;
}): Promise<ApplicationsResponse>;
```

Defined in: [defi/protocols/src/vendors/algorand/tools/apiManager/indexer/application.ts:194](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/vendors/algorand/tools/apiManager/indexer/application.ts#L194)

#### Parameters

| Parameter | Type |
| :------ | :------ |
| `params?` | \{ `creator?`: `string`; `limit?`: `number`; `nextToken?`: `string`; \} |
| `params.creator?` | `string` |
| `params.limit?` | `number` |
| `params.nextToken?` | `string` |

#### Returns

`Promise`\<`ApplicationsResponse`\>
