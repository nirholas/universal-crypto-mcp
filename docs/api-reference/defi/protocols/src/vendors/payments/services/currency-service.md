[**Universal Crypto MCP API Reference v1.0.0**](../../../../../../index.md)

***

[Universal Crypto MCP API Reference](/docs/api/index.md) / defi/protocols/src/vendors/payments/services/currency-service

# defi/protocols/src/vendors/payments/services/currency-service

## Classes

### CurrencyService

Defined in: [defi/protocols/src/vendors/payments/services/currency-service.ts:55](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/vendors/payments/services/currency-service.ts#L55)

#### Constructors

##### Constructor

```ts
new CurrencyService(apiClient: BitnovoApiClient, config: Configuration): CurrencyService;
```

Defined in: [defi/protocols/src/vendors/payments/services/currency-service.ts:60](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/vendors/payments/services/currency-service.ts#L60)

###### Parameters

| Parameter | Type |
| :------ | :------ |
| `apiClient` | [`BitnovoApiClient`](/docs/api/defi/protocols/src/vendors/payments/api/bitnovo-client.md#bitnovoapiclient) |
| `config` | [`Configuration`](/docs/api/defi/protocols/src/vendors/payments/types.md#configuration) |

###### Returns

[`CurrencyService`](/docs/api/defi/protocols/src/vendors/payments/services/currency-service.md#currencyservice)

#### Methods

##### clearCache()

```ts
clearCache(): void;
```

Defined in: [defi/protocols/src/vendors/payments/services/currency-service.ts:348](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/vendors/payments/services/currency-service.ts#L348)

Clear currency cache (useful for testing or forced refresh)

###### Returns

`void`

##### findCurrency()

```ts
findCurrency(symbol: string): Promise<
  | Currency
| null>;
```

Defined in: [defi/protocols/src/vendors/payments/services/currency-service.ts:198](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/vendors/payments/services/currency-service.ts#L198)

Find a specific currency by symbol

###### Parameters

| Parameter | Type |
| :------ | :------ |
| `symbol` | `string` |

###### Returns

`Promise`\<
  \| [`Currency`](/docs/api/defi/protocols/src/vendors/payments/types.md#currency)
  \| `null`\>

##### getCacheStats()

```ts
getCacheStats(): {
  age: number;
  cached: boolean;
  count: number;
  maxAge: number;
  valid: boolean;
};
```

Defined in: [defi/protocols/src/vendors/payments/services/currency-service.ts:357](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/vendors/payments/services/currency-service.ts#L357)

Get cache statistics

###### Returns

```ts
{
  age: number;
  cached: boolean;
  count: number;
  maxAge: number;
  valid: boolean;
}
```

| Name | Type | Defined in |
| :------ | :------ | :------ |
| `age` | `number` | [defi/protocols/src/vendors/payments/services/currency-service.ts:359](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/vendors/payments/services/currency-service.ts#L359) |
| `cached` | `boolean` | [defi/protocols/src/vendors/payments/services/currency-service.ts:358](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/vendors/payments/services/currency-service.ts#L358) |
| `count` | `number` | [defi/protocols/src/vendors/payments/services/currency-service.ts:361](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/vendors/payments/services/currency-service.ts#L361) |
| `maxAge` | `number` | [defi/protocols/src/vendors/payments/services/currency-service.ts:360](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/vendors/payments/services/currency-service.ts#L360) |
| `valid` | `boolean` | [defi/protocols/src/vendors/payments/services/currency-service.ts:362](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/vendors/payments/services/currency-service.ts#L362) |

##### getCurrencies()

```ts
getCurrencies(): Promise<Currency[]>;
```

Defined in: [defi/protocols/src/vendors/payments/services/currency-service.ts:150](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/vendors/payments/services/currency-service.ts#L150)

Get all currencies with caching

###### Returns

`Promise`\<[`Currency`](/docs/api/defi/protocols/src/vendors/payments/types.md#currency)[]\>

##### getCurrenciesCatalog()

```ts
getCurrenciesCatalog(input: unknown): Promise<CurrencyCatalogResult>;
```

Defined in: [defi/protocols/src/vendors/payments/services/currency-service.ts:68](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/vendors/payments/services/currency-service.ts#L68)

Get currencies catalog with optional filtering

###### Parameters

| Parameter | Type |
| :------ | :------ |
| `input` | `unknown` |

###### Returns

`Promise`\<[`CurrencyCatalogResult`](/docs/api/defi/protocols/src/vendors/payments/services/currency-service.md#currencycatalogresult)\>

##### getCurrenciesForAmount()

```ts
getCurrenciesForAmount(amount: number): Promise<Currency[]>;
```

Defined in: [defi/protocols/src/vendors/payments/services/currency-service.ts:232](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/vendors/payments/services/currency-service.ts#L232)

Get currencies that support a specific amount

###### Parameters

| Parameter | Type |
| :------ | :------ |
| `amount` | `number` |

###### Returns

`Promise`\<[`Currency`](/docs/api/defi/protocols/src/vendors/payments/types.md#currency)[]\>

##### getCurrencyDisplayInfo()

```ts
getCurrencyDisplayInfo(currency: Currency): {
  amountRange: string;
  displayName: string;
  features: string[];
  shortName: string;
};
```

Defined in: [defi/protocols/src/vendors/payments/services/currency-service.ts:384](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/vendors/payments/services/currency-service.ts#L384)

Get currency display information
Uses original_symbol and original_blockchain for user-friendly display

###### Parameters

| Parameter | Type |
| :------ | :------ |
| `currency` | [`Currency`](/docs/api/defi/protocols/src/vendors/payments/types.md#currency) |

###### Returns

```ts
{
  amountRange: string;
  displayName: string;
  features: string[];
  shortName: string;
}
```

| Name | Type | Defined in |
| :------ | :------ | :------ |
| `amountRange` | `string` | [defi/protocols/src/vendors/payments/services/currency-service.ts:387](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/vendors/payments/services/currency-service.ts#L387) |
| `displayName` | `string` | [defi/protocols/src/vendors/payments/services/currency-service.ts:385](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/vendors/payments/services/currency-service.ts#L385) |
| `features` | `string`[] | [defi/protocols/src/vendors/payments/services/currency-service.ts:388](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/vendors/payments/services/currency-service.ts#L388) |
| `shortName` | `string` | [defi/protocols/src/vendors/payments/services/currency-service.ts:386](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/vendors/payments/services/currency-service.ts#L386) |

##### isCurrencyValidForAmount()

```ts
isCurrencyValidForAmount(symbol: string, amount: number): Promise<boolean>;
```

Defined in: [defi/protocols/src/vendors/payments/services/currency-service.ts:209](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/vendors/payments/services/currency-service.ts#L209)

Check if a currency is valid for a specific amount

###### Parameters

| Parameter | Type |
| :------ | :------ |
| `symbol` | `string` |
| `amount` | `number` |

###### Returns

`Promise`\<`boolean`\>

##### validateServiceAvailability()

```ts
validateServiceAvailability(): Promise<{
  available: boolean;
  error?: string;
}>;
```

Defined in: [defi/protocols/src/vendors/payments/services/currency-service.ts:416](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/vendors/payments/services/currency-service.ts#L416)

Validate if currencies are available for service

###### Returns

`Promise`\<\{
  `available`: `boolean`;
  `error?`: `string`;
\}\>

***

### CurrencyServiceError

Defined in: [defi/protocols/src/vendors/payments/services/currency-service.ts:20](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/vendors/payments/services/currency-service.ts#L20)

#### Extends

- `Error`

#### Implements

- [`ApiError`](/docs/api/defi/protocols/src/vendors/payments/types.md#apierror)

#### Constructors

##### Constructor

```ts
new CurrencyServiceError(
   message: string, 
   statusCode: number, 
   code: string, 
   details?: unknown): CurrencyServiceError;
```

Defined in: [defi/protocols/src/vendors/payments/services/currency-service.ts:25](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/vendors/payments/services/currency-service.ts#L25)

###### Parameters

| Parameter | Type |
| :------ | :------ |
| `message` | `string` |
| `statusCode` | `number` |
| `code` | `string` |
| `details?` | `unknown` |

###### Returns

[`CurrencyServiceError`](/docs/api/defi/protocols/src/vendors/payments/services/currency-service.md#currencyserviceerror)

###### Overrides

```ts
Error.constructor
```

#### Properties

| Property | Modifier | Type | Defined in |
| :------ | :------ | :------ | :------ |
| <a id="code"></a> `code` | `readonly` | `string` | [defi/protocols/src/vendors/payments/services/currency-service.ts:22](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/vendors/payments/services/currency-service.ts#L22) |
| <a id="details"></a> `details?` | `readonly` | `unknown` | [defi/protocols/src/vendors/payments/services/currency-service.ts:23](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/vendors/payments/services/currency-service.ts#L23) |
| <a id="statuscode"></a> `statusCode` | `readonly` | `number` | [defi/protocols/src/vendors/payments/services/currency-service.ts:21](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/vendors/payments/services/currency-service.ts#L21) |

## Interfaces

### CurrencyCatalogResult

Defined in: [defi/protocols/src/vendors/payments/services/currency-service.ts:48](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/vendors/payments/services/currency-service.ts#L48)

#### Properties

| Property | Type | Defined in |
| :------ | :------ | :------ |
| <a id="appliedfilters"></a> `appliedFilters` | [`CurrencyFilter`](/docs/api/defi/protocols/src/vendors/payments/services/currency-service.md#currencyfilter) | [defi/protocols/src/vendors/payments/services/currency-service.ts:52](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/vendors/payments/services/currency-service.ts#L52) |
| <a id="currencies"></a> `currencies` | [`Currency`](/docs/api/defi/protocols/src/vendors/payments/types.md#currency)[] | [defi/protocols/src/vendors/payments/services/currency-service.ts:49](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/vendors/payments/services/currency-service.ts#L49) |
| <a id="filteredcount"></a> `filteredCount` | `number` | [defi/protocols/src/vendors/payments/services/currency-service.ts:51](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/vendors/payments/services/currency-service.ts#L51) |
| <a id="totalcount"></a> `totalCount` | `number` | [defi/protocols/src/vendors/payments/services/currency-service.ts:50](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/vendors/payments/services/currency-service.ts#L50) |

***

### CurrencyFilter

Defined in: [defi/protocols/src/vendors/payments/services/currency-service.ts:39](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/vendors/payments/services/currency-service.ts#L39)

#### Properties

| Property | Type | Defined in |
| :------ | :------ | :------ |
| <a id="blockchain"></a> `blockchain?` | `string` | [defi/protocols/src/vendors/payments/services/currency-service.ts:44](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/vendors/payments/services/currency-service.ts#L44) |
| <a id="filterbyamount"></a> `filterByAmount?` | `number` | [defi/protocols/src/vendors/payments/services/currency-service.ts:42](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/vendors/payments/services/currency-service.ts#L42) |
| <a id="includeinactive"></a> `includeInactive?` | `boolean` | [defi/protocols/src/vendors/payments/services/currency-service.ts:43](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/vendors/payments/services/currency-service.ts#L43) |
| <a id="maxamount"></a> `maxAmount?` | `number` | [defi/protocols/src/vendors/payments/services/currency-service.ts:41](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/vendors/payments/services/currency-service.ts#L41) |
| <a id="minamount"></a> `minAmount?` | `number` | [defi/protocols/src/vendors/payments/services/currency-service.ts:40](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/vendors/payments/services/currency-service.ts#L40) |
| <a id="requiresmemo"></a> `requiresMemo?` | `boolean` | [defi/protocols/src/vendors/payments/services/currency-service.ts:45](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/vendors/payments/services/currency-service.ts#L45) |
