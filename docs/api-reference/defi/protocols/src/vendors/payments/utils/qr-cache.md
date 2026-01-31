[**Universal Crypto MCP API Reference v1.0.0**](../../../../../../index.md)

***

[Universal Crypto MCP API Reference](/docs/api/index.md) / defi/protocols/src/vendors/payments/utils/qr-cache

# defi/protocols/src/vendors/payments/utils/qr-cache

## Classes

### QrCache

Defined in: [defi/protocols/src/vendors/payments/utils/qr-cache.ts:27](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/vendors/payments/utils/qr-cache.ts#L27)

#### Constructors

##### Constructor

```ts
new QrCache(options: Partial<QrCacheOptions>): QrCache;
```

Defined in: [defi/protocols/src/vendors/payments/utils/qr-cache.ts:33](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/vendors/payments/utils/qr-cache.ts#L33)

###### Parameters

| Parameter | Type |
| :------ | :------ |
| `options` | `Partial`\<[`QrCacheOptions`](/docs/api/defi/protocols/src/vendors/payments/utils/qr-cache.md#qrcacheoptions)\> |

###### Returns

[`QrCache`](/docs/api/defi/protocols/src/vendors/payments/utils/qr-cache.md#qrcache)

#### Methods

##### clear()

```ts
clear(): void;
```

Defined in: [defi/protocols/src/vendors/payments/utils/qr-cache.ts:255](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/vendors/payments/utils/qr-cache.ts#L255)

Clear all entries

###### Returns

`void`

##### get()

```ts
get(
   identifier: string, 
   qrType: string, 
   size: number, 
   style: string, 
   branding: boolean): 
  | QrCodeData
  | null;
```

Defined in: [defi/protocols/src/vendors/payments/utils/qr-cache.ts:65](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/vendors/payments/utils/qr-cache.ts#L65)

Get QR from cache

###### Parameters

| Parameter | Type |
| :------ | :------ |
| `identifier` | `string` |
| `qrType` | `string` |
| `size` | `number` |
| `style` | `string` |
| `branding` | `boolean` |

###### Returns

  \| [`QrCodeData`](/docs/api/defi/protocols/src/vendors/payments/types.md#qrcodedata)
  \| `null`

##### getStats()

```ts
getStats(): {
  hitRate: number;
  maxSize: number;
  memoryUsage: number;
  oldestEntryAge: number;
  size: number;
};
```

Defined in: [defi/protocols/src/vendors/payments/utils/qr-cache.ts:219](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/vendors/payments/utils/qr-cache.ts#L219)

Get cache statistics

###### Returns

```ts
{
  hitRate: number;
  maxSize: number;
  memoryUsage: number;
  oldestEntryAge: number;
  size: number;
}
```

| Name | Type | Defined in |
| :------ | :------ | :------ |
| `hitRate` | `number` | [defi/protocols/src/vendors/payments/utils/qr-cache.ts:222](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/vendors/payments/utils/qr-cache.ts#L222) |
| `maxSize` | `number` | [defi/protocols/src/vendors/payments/utils/qr-cache.ts:221](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/vendors/payments/utils/qr-cache.ts#L221) |
| `memoryUsage` | `number` | [defi/protocols/src/vendors/payments/utils/qr-cache.ts:224](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/vendors/payments/utils/qr-cache.ts#L224) |
| `oldestEntryAge` | `number` | [defi/protocols/src/vendors/payments/utils/qr-cache.ts:223](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/vendors/payments/utils/qr-cache.ts#L223) |
| `size` | `number` | [defi/protocols/src/vendors/payments/utils/qr-cache.ts:220](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/vendors/payments/utils/qr-cache.ts#L220) |

##### has()

```ts
has(
   identifier: string, 
   qrType: string, 
   size: number, 
   style: string, 
   branding: boolean): boolean;
```

Defined in: [defi/protocols/src/vendors/payments/utils/qr-cache.ts:276](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/vendors/payments/utils/qr-cache.ts#L276)

Check if cache contains a specific QR

###### Parameters

| Parameter | Type |
| :------ | :------ |
| `identifier` | `string` |
| `qrType` | `string` |
| `size` | `number` |
| `style` | `string` |
| `branding` | `boolean` |

###### Returns

`boolean`

##### preload()

```ts
preload(commonScenarios: {
  branding: boolean;
  identifier: string;
  qrData: QrCodeData;
  qrType: string;
  size: number;
  style: string;
}[]): Promise<void>;
```

Defined in: [defi/protocols/src/vendors/payments/utils/qr-cache.ts:302](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/vendors/payments/utils/qr-cache.ts#L302)

Preload QR codes for common scenarios

###### Parameters

| Parameter | Type |
| :------ | :------ |
| `commonScenarios` | \{ `branding`: `boolean`; `identifier`: `string`; `qrData`: [`QrCodeData`](/docs/api/defi/protocols/src/vendors/payments/types.md#qrcodedata); `qrType`: `string`; `size`: `number`; `style`: `string`; \}[] |

###### Returns

`Promise`\<`void`\>

##### set()

```ts
set(
   identifier: string, 
   qrType: string, 
   size: number, 
   style: string, 
   branding: boolean, 
   qrData: QrCodeData): void;
```

Defined in: [defi/protocols/src/vendors/payments/utils/qr-cache.ts:111](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/vendors/payments/utils/qr-cache.ts#L111)

Store QR in cache

###### Parameters

| Parameter | Type |
| :------ | :------ |
| `identifier` | `string` |
| `qrType` | `string` |
| `size` | `number` |
| `style` | `string` |
| `branding` | `boolean` |
| `qrData` | [`QrCodeData`](/docs/api/defi/protocols/src/vendors/payments/types.md#qrcodedata) |

###### Returns

`void`

##### shutdown()

```ts
shutdown(): void;
```

Defined in: [defi/protocols/src/vendors/payments/utils/qr-cache.ts:264](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/vendors/payments/utils/qr-cache.ts#L264)

Gracefully shutdown cache

###### Returns

`void`

## Interfaces

### QrCacheEntry

Defined in: [defi/protocols/src/vendors/payments/utils/qr-cache.ts:14](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/vendors/payments/utils/qr-cache.ts#L14)

#### Properties

| Property | Type | Defined in |
| :------ | :------ | :------ |
| <a id="accesscount"></a> `accessCount` | `number` | [defi/protocols/src/vendors/payments/utils/qr-cache.ts:17](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/vendors/payments/utils/qr-cache.ts#L17) |
| <a id="data"></a> `data` | [`QrCodeData`](/docs/api/defi/protocols/src/vendors/payments/types.md#qrcodedata) | [defi/protocols/src/vendors/payments/utils/qr-cache.ts:15](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/vendors/payments/utils/qr-cache.ts#L15) |
| <a id="lastaccessed"></a> `lastAccessed` | `number` | [defi/protocols/src/vendors/payments/utils/qr-cache.ts:18](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/vendors/payments/utils/qr-cache.ts#L18) |
| <a id="timestamp"></a> `timestamp` | `number` | [defi/protocols/src/vendors/payments/utils/qr-cache.ts:16](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/vendors/payments/utils/qr-cache.ts#L16) |

***

### QrCacheOptions

Defined in: [defi/protocols/src/vendors/payments/utils/qr-cache.ts:21](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/vendors/payments/utils/qr-cache.ts#L21)

#### Properties

| Property | Type | Defined in |
| :------ | :------ | :------ |
| <a id="cleanupintervalms"></a> `cleanupIntervalMs` | `number` | [defi/protocols/src/vendors/payments/utils/qr-cache.ts:24](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/vendors/payments/utils/qr-cache.ts#L24) |
| <a id="maxentries"></a> `maxEntries` | `number` | [defi/protocols/src/vendors/payments/utils/qr-cache.ts:22](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/vendors/payments/utils/qr-cache.ts#L22) |
| <a id="ttlms"></a> `ttlMs` | `number` | [defi/protocols/src/vendors/payments/utils/qr-cache.ts:23](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/vendors/payments/utils/qr-cache.ts#L23) |

## Functions

### getQrCache()

```ts
function getQrCache(): QrCache;
```

Defined in: [defi/protocols/src/vendors/payments/utils/qr-cache.ts:336](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/vendors/payments/utils/qr-cache.ts#L336)

Get or create global QR cache instance

#### Returns

[`QrCache`](/docs/api/defi/protocols/src/vendors/payments/utils/qr-cache.md#qrcache)

***

### initializeQrCache()

```ts
function initializeQrCache(options: Partial<QrCacheOptions>): QrCache;
```

Defined in: [defi/protocols/src/vendors/payments/utils/qr-cache.ts:346](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/vendors/payments/utils/qr-cache.ts#L346)

Initialize QR cache with custom options

#### Parameters

| Parameter | Type |
| :------ | :------ |
| `options` | `Partial`\<[`QrCacheOptions`](/docs/api/defi/protocols/src/vendors/payments/utils/qr-cache.md#qrcacheoptions)\> |

#### Returns

[`QrCache`](/docs/api/defi/protocols/src/vendors/payments/utils/qr-cache.md#qrcache)

***

### shutdownQrCache()

```ts
function shutdownQrCache(): void;
```

Defined in: [defi/protocols/src/vendors/payments/utils/qr-cache.ts:359](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/vendors/payments/utils/qr-cache.ts#L359)

Shutdown global QR cache

#### Returns

`void`
