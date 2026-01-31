[**Universal Crypto MCP API Reference v1.0.0**](../../../../../../../index.md)

***

[Universal Crypto MCP API Reference](/docs/api/index.md) / defi/protocols/src/vendors/bnb/gnfd/services/bucket

# defi/protocols/src/vendors/bnb/gnfd/services/bucket

## Functions

### createBucket()

```ts
function createBucket(network: "testnet" | "mainnet", __namedParameters: {
  bucketName?: string;
  privateKey: `0x${string}`;
}): Promise<ApiResponse<BucketData>>;
```

Defined in: [defi/protocols/src/vendors/bnb/gnfd/services/bucket.ts:100](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/vendors/bnb/gnfd/services/bucket.ts#L100)

Create a bucket in Greenfield

#### Parameters

| Parameter | Type |
| :------ | :------ |
| `network` | `"testnet"` \| `"mainnet"` |
| `__namedParameters` | \{ `bucketName?`: `string`; `privateKey`: `` `0x${string}` ``; \} |
| `__namedParameters.bucketName?` | `string` |
| `__namedParameters.privateKey` | `` `0x${string}` `` |

#### Returns

`Promise`\<[`ApiResponse`](/docs/api/defi/protocols/src/vendors/bnb/gnfd/util.md#apiresponse)\<`BucketData`\>\>

***

### deleteBucket()

```ts
function deleteBucket(network: "testnet" | "mainnet", __namedParameters: {
  bucketName: string;
  privateKey: `0x${string}`;
}): Promise<ApiResponse<void>>;
```

Defined in: [defi/protocols/src/vendors/bnb/gnfd/services/bucket.ts:159](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/vendors/bnb/gnfd/services/bucket.ts#L159)

Delete a bucket in Greenfield

#### Parameters

| Parameter | Type |
| :------ | :------ |
| `network` | `"testnet"` \| `"mainnet"` |
| `__namedParameters` | \{ `bucketName`: `string`; `privateKey`: `` `0x${string}` ``; \} |
| `__namedParameters.bucketName` | `string` |
| `__namedParameters.privateKey` | `` `0x${string}` `` |

#### Returns

`Promise`\<[`ApiResponse`](/docs/api/defi/protocols/src/vendors/bnb/gnfd/util.md#apiresponse)\<`void`\>\>

***

### getBucketFullInfo()

```ts
function getBucketFullInfo(
   network: "testnet" | "mainnet", 
   bucketName: string, 
privateKey: `0x${string}`): Promise<ApiResponse<any>>;
```

Defined in: [defi/protocols/src/vendors/bnb/gnfd/services/bucket.ts:40](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/vendors/bnb/gnfd/services/bucket.ts#L40)

Get a bucket's full info in Greenfield

#### Parameters

| Parameter | Type |
| :------ | :------ |
| `network` | `"testnet"` \| `"mainnet"` |
| `bucketName` | `string` |
| `privateKey` | `` `0x${string}` `` |

#### Returns

`Promise`\<[`ApiResponse`](/docs/api/defi/protocols/src/vendors/bnb/gnfd/util.md#apiresponse)\<`any`\>\>

***

### getBucketInfo()

```ts
function getBucketInfo(network: "testnet" | "mainnet", bucketName: string): Promise<ApiResponse<BucketInfo>>;
```

Defined in: [defi/protocols/src/vendors/bnb/gnfd/services/bucket.ts:23](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/vendors/bnb/gnfd/services/bucket.ts#L23)

#### Parameters

| Parameter | Type |
| :------ | :------ |
| `network` | `"testnet"` \| `"mainnet"` |
| `bucketName` | `string` |

#### Returns

`Promise`\<[`ApiResponse`](/docs/api/defi/protocols/src/vendors/bnb/gnfd/util.md#apiresponse)\<`BucketInfo`\>\>

***

### listBuckets()

```ts
function listBuckets(network: "testnet" | "mainnet", address: {
  address?: string;
  privateKey?: `0x${string}`;
}): Promise<ApiResponse<{
  buckets: {
     bucketName: string;
     createAt: number;
  }[];
}>>;
```

Defined in: [defi/protocols/src/vendors/bnb/gnfd/services/bucket.ts:210](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/vendors/bnb/gnfd/services/bucket.ts#L210)

List buckets for an account in Greenfield

#### Parameters

| Parameter | Type | Description |
| :------ | :------ | :------ |
| `network` | `"testnet"` \| `"mainnet"` | Greenfield network (testnet or mainnet) |
| `address` | \{ `address?`: `string`; `privateKey?`: `` `0x${string}` ``; \} | User address to list buckets for |
| `address.address?` | `string` | - |
| `address.privateKey?` | `` `0x${string}` `` | - |

#### Returns

`Promise`\<[`ApiResponse`](/docs/api/defi/protocols/src/vendors/bnb/gnfd/util.md#apiresponse)\<\{
  `buckets`: \{
     `bucketName`: `string`;
     `createAt`: `number`;
  \}[];
\}\>\>

List of buckets
