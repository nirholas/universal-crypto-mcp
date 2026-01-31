[**Universal Crypto MCP API Reference v1.0.0**](../../../../../../index.md)

***

[Universal Crypto MCP API Reference](/docs/api/index.md) / defi/protocols/src/vendors/bnb/gnfd/util

# defi/protocols/src/vendors/bnb/gnfd/util

## Type Aliases

### ApiResponse

```ts
type ApiResponse<T> = {
  data?: T;
  message?: string;
  status: "success" | "error";
};
```

Defined in: [defi/protocols/src/vendors/bnb/gnfd/util.ts:26](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/vendors/bnb/gnfd/util.ts#L26)

Standard response type for GNFD operations

#### Type Parameters

| Type Parameter | Default type |
| :------ | :------ |
| `T` | `unknown` |

#### Properties

##### data?

```ts
optional data: T;
```

Defined in: [defi/protocols/src/vendors/bnb/gnfd/util.ts:29](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/vendors/bnb/gnfd/util.ts#L29)

##### message?

```ts
optional message: string;
```

Defined in: [defi/protocols/src/vendors/bnb/gnfd/util.ts:28](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/vendors/bnb/gnfd/util.ts#L28)

##### status

```ts
status: "success" | "error";
```

Defined in: [defi/protocols/src/vendors/bnb/gnfd/util.ts:27](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/vendors/bnb/gnfd/util.ts#L27)

## Variables

### response

```ts
const response: {
  fail: <T>(message: string) => ApiResponse<T>;
  success: <T>(dataOrMessage?: string | T, data?: T) => ApiResponse<T>;
};
```

Defined in: [defi/protocols/src/vendors/bnb/gnfd/util.ts:35](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/vendors/bnb/gnfd/util.ts#L35)

Response utility for standardizing API responses

#### Type Declaration

| Name | Type | Description | Defined in |
| :------ | :------ | :------ | :------ |
| <a id="fail"></a> `fail()` | \<`T`\>(`message`: `string`) => [`ApiResponse`](/docs/api/defi/protocols/src/vendors/bnb/gnfd/util.md#apiresponse)\<`T`\> | Create an error response | [defi/protocols/src/vendors/bnb/gnfd/util.ts:62](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/vendors/bnb/gnfd/util.ts#L62) |
| <a id="success"></a> `success()` | \<`T`\>(`dataOrMessage?`: `string` \| `T`, `data?`: `T`) => [`ApiResponse`](/docs/api/defi/protocols/src/vendors/bnb/gnfd/util.md#apiresponse)\<`T`\> | Create a success response | [defi/protocols/src/vendors/bnb/gnfd/util.ts:41](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/vendors/bnb/gnfd/util.ts#L41) |

## Functions

### generateString()

```ts
function generateString(length: number): string;
```

Defined in: [defi/protocols/src/vendors/bnb/gnfd/util.ts:11](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/vendors/bnb/gnfd/util.ts#L11)

#### Parameters

| Parameter | Type |
| :------ | :------ |
| `length` | `number` |

#### Returns

`string`

***

### getMimeType()

```ts
function getMimeType(path: string): string | null;
```

Defined in: [defi/protocols/src/vendors/bnb/gnfd/util.ts:78](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/vendors/bnb/gnfd/util.ts#L78)

#### Parameters

| Parameter | Type |
| :------ | :------ |
| `path` | `string` |

#### Returns

`string` \| `null`
