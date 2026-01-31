[**Universal Crypto MCP API Reference v1.0.0**](../../../../../../index.md)

***

[Universal Crypto MCP API Reference](/docs/api/index.md) / defi/protocols/src/vendors/payments/utils/image-utils

# defi/protocols/src/vendors/payments/utils/image-utils

## Interfaces

### ImageProcessingOptions

Defined in: [defi/protocols/src/vendors/payments/utils/image-utils.ts:24](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/vendors/payments/utils/image-utils.ts#L24)

#### Properties

| Property | Type | Defined in |
| :------ | :------ | :------ |
| <a id="currencyimageurl"></a> `currencyImageUrl?` | `string` | [defi/protocols/src/vendors/payments/utils/image-utils.ts:29](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/vendors/payments/utils/image-utils.ts#L29) |
| <a id="currencysymbol"></a> `currencySymbol?` | `string` | [defi/protocols/src/vendors/payments/utils/image-utils.ts:28](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/vendors/payments/utils/image-utils.ts#L28) |
| <a id="includebranding"></a> `includeBranding` | `boolean` | [defi/protocols/src/vendors/payments/utils/image-utils.ts:26](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/vendors/payments/utils/image-utils.ts#L26) |
| <a id="isgatewayurl"></a> `isGatewayUrl?` | `boolean` | [defi/protocols/src/vendors/payments/utils/image-utils.ts:30](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/vendors/payments/utils/image-utils.ts#L30) |
| <a id="size"></a> `size` | `number` | [defi/protocols/src/vendors/payments/utils/image-utils.ts:25](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/vendors/payments/utils/image-utils.ts#L25) |
| <a id="style"></a> `style` | `"basic"` \| `"branded"` | [defi/protocols/src/vendors/payments/utils/image-utils.ts:27](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/vendors/payments/utils/image-utils.ts#L27) |
| <a id="usecache"></a> `useCache?` | `boolean` | [defi/protocols/src/vendors/payments/utils/image-utils.ts:31](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/vendors/payments/utils/image-utils.ts#L31) |

***

### ProcessedQrResult

Defined in: [defi/protocols/src/vendors/payments/utils/image-utils.ts:34](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/vendors/payments/utils/image-utils.ts#L34)

#### Properties

| Property | Type | Defined in |
| :------ | :------ | :------ |
| <a id="buffer"></a> `buffer` | `Buffer` | [defi/protocols/src/vendors/payments/utils/image-utils.ts:35](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/vendors/payments/utils/image-utils.ts#L35) |
| <a id="height"></a> `height` | `number` | [defi/protocols/src/vendors/payments/utils/image-utils.ts:37](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/vendors/payments/utils/image-utils.ts#L37) |
| <a id="width"></a> `width` | `number` | [defi/protocols/src/vendors/payments/utils/image-utils.ts:36](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/vendors/payments/utils/image-utils.ts#L36) |

## Functions

### generateFastQrCode()

```ts
function generateFastQrCode(
   data: string, 
   size: number, 
errorCorrectionLevel: "L" | "M" | "Q" | "H"): Promise<Buffer<ArrayBufferLike>>;
```

Defined in: [defi/protocols/src/vendors/payments/utils/image-utils.ts:466](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/vendors/payments/utils/image-utils.ts#L466)

Generate fast QR code (alias for compatibility) - ~5ms

#### Parameters

| Parameter | Type | Default value |
| :------ | :------ | :------ |
| `data` | `string` | `undefined` |
| `size` | `number` | `undefined` |
| `errorCorrectionLevel` | `"L"` \| `"M"` \| `"Q"` \| `"H"` | `'M'` |

#### Returns

`Promise`\<`Buffer`\<`ArrayBufferLike`\>\>

***

### generateOptimizedQrCode()

```ts
function generateOptimizedQrCode(data: string, options: ImageProcessingOptions): Promise<ProcessedQrResult>;
```

Defined in: [defi/protocols/src/vendors/payments/utils/image-utils.ts:379](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/vendors/payments/utils/image-utils.ts#L379)

Generate optimized QR with logo - ULTRA FAST VERSION (~5.2ms total)

#### Parameters

| Parameter | Type |
| :------ | :------ |
| `data` | `string` |
| `options` | [`ImageProcessingOptions`](/docs/api/defi/protocols/src/vendors/payments/utils/image-utils.md#imageprocessingoptions) |

#### Returns

`Promise`\<[`ProcessedQrResult`](/docs/api/defi/protocols/src/vendors/payments/utils/image-utils.md#processedqrresult)\>

***

### initializeFastImageProcessing()

```ts
function initializeFastImageProcessing(): Promise<void>;
```

Defined in: [defi/protocols/src/vendors/payments/utils/image-utils.ts:477](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/vendors/payments/utils/image-utils.ts#L477)

Initialize fast image processing system

#### Returns

`Promise`\<`void`\>
