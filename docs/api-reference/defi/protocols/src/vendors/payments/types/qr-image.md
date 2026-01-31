[**Universal Crypto MCP API Reference v1.0.0**](../../../../../../index.md)

***

[Universal Crypto MCP API Reference](/docs/api/index.md) / defi/protocols/src/vendors/payments/types/qr-image

# defi/protocols/src/vendors/payments/types/qr-image

## Interfaces

### QrImageOptions

Defined in: [defi/chain-tools/src/vendors/payments/types/qr-image.d.ts:10](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/chain-tools/src/vendors/payments/types/qr-image.d.ts#L10)

#### Properties

| Property | Type | Defined in |
| :------ | :------ | :------ |
| <a id="customize"></a> `customize?` | (`qr`: `any`) => `void` | [defi/chain-tools/src/vendors/payments/types/qr-image.d.ts:15](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/chain-tools/src/vendors/payments/types/qr-image.d.ts#L15) |
| <a id="ec_level"></a> `ec_level?` | `"L"` \| `"M"` \| `"Q"` \| `"H"` | [defi/chain-tools/src/vendors/payments/types/qr-image.d.ts:11](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/chain-tools/src/vendors/payments/types/qr-image.d.ts#L11) |
| <a id="margin"></a> `margin?` | `number` | [defi/chain-tools/src/vendors/payments/types/qr-image.d.ts:14](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/chain-tools/src/vendors/payments/types/qr-image.d.ts#L14) |
| <a id="size"></a> `size?` | `number` | [defi/chain-tools/src/vendors/payments/types/qr-image.d.ts:13](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/chain-tools/src/vendors/payments/types/qr-image.d.ts#L13) |
| <a id="type"></a> `type?` | `"pdf"` \| `"eps"` \| `"png"` \| `"svg"` | [defi/chain-tools/src/vendors/payments/types/qr-image.d.ts:12](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/chain-tools/src/vendors/payments/types/qr-image.d.ts#L12) |

## Functions

### image()

#### Call Signature

```ts
function image(text: string, options?: QrImageOptions): ReadableStream;
```

Defined in: [defi/chain-tools/src/vendors/payments/types/qr-image.d.ts:18](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/chain-tools/src/vendors/payments/types/qr-image.d.ts#L18)

##### Parameters

| Parameter | Type |
| :------ | :------ |
| `text` | `string` |
| `options?` | [`QrImageOptions`](/docs/api/defi/protocols/src/vendors/payments/types/qr-image.md#qrimageoptions) |

##### Returns

`ReadableStream`

#### Call Signature

```ts
function image(text: string, options?: QrImageOptions): ReadableStream;
```

Defined in: [defi/protocols/src/vendors/payments/types/qr-image.d.ts:18](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/vendors/payments/types/qr-image.d.ts#L18)

##### Parameters

| Parameter | Type |
| :------ | :------ |
| `text` | `string` |
| `options?` | [`QrImageOptions`](/docs/api/defi/protocols/src/vendors/payments/types/qr-image.md#qrimageoptions) |

##### Returns

`ReadableStream`

***

### imageSync()

#### Call Signature

```ts
function imageSync(text: string, options?: QrImageOptions): Buffer;
```

Defined in: [defi/chain-tools/src/vendors/payments/types/qr-image.d.ts:22](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/chain-tools/src/vendors/payments/types/qr-image.d.ts#L22)

##### Parameters

| Parameter | Type |
| :------ | :------ |
| `text` | `string` |
| `options?` | [`QrImageOptions`](/docs/api/defi/protocols/src/vendors/payments/types/qr-image.md#qrimageoptions) |

##### Returns

`Buffer`

#### Call Signature

```ts
function imageSync(text: string, options?: QrImageOptions): Buffer;
```

Defined in: [defi/protocols/src/vendors/payments/types/qr-image.d.ts:22](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/vendors/payments/types/qr-image.d.ts#L22)

##### Parameters

| Parameter | Type |
| :------ | :------ |
| `text` | `string` |
| `options?` | [`QrImageOptions`](/docs/api/defi/protocols/src/vendors/payments/types/qr-image.md#qrimageoptions) |

##### Returns

`Buffer`

***

### svgObject()

#### Call Signature

```ts
function svgObject(text: string, options?: QrImageOptions): any;
```

Defined in: [defi/chain-tools/src/vendors/payments/types/qr-image.d.ts:23](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/chain-tools/src/vendors/payments/types/qr-image.d.ts#L23)

##### Parameters

| Parameter | Type |
| :------ | :------ |
| `text` | `string` |
| `options?` | [`QrImageOptions`](/docs/api/defi/protocols/src/vendors/payments/types/qr-image.md#qrimageoptions) |

##### Returns

`any`

#### Call Signature

```ts
function svgObject(text: string, options?: QrImageOptions): any;
```

Defined in: [defi/protocols/src/vendors/payments/types/qr-image.d.ts:23](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/vendors/payments/types/qr-image.d.ts#L23)

##### Parameters

| Parameter | Type |
| :------ | :------ |
| `text` | `string` |
| `options?` | [`QrImageOptions`](/docs/api/defi/protocols/src/vendors/payments/types/qr-image.md#qrimageoptions) |

##### Returns

`any`
