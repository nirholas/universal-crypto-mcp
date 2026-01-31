[**Universal Crypto MCP API Reference v1.0.0**](../../../../../../index.md)

***

[Universal Crypto MCP API Reference](/docs/api/index.md) / defi/protocols/src/vendors/payments/tools/list-currencies-catalog

# defi/protocols/src/vendors/payments/tools/list-currencies-catalog

## Classes

### ListCurrenciesCatalogHandler

Defined in: [defi/protocols/src/vendors/payments/tools/list-currencies-catalog.ts:62](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/vendors/payments/tools/list-currencies-catalog.ts#L62)

#### Constructors

##### Constructor

```ts
new ListCurrenciesCatalogHandler(currencyService: CurrencyService): ListCurrenciesCatalogHandler;
```

Defined in: [defi/protocols/src/vendors/payments/tools/list-currencies-catalog.ts:63](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/vendors/payments/tools/list-currencies-catalog.ts#L63)

###### Parameters

| Parameter | Type |
| :------ | :------ |
| `currencyService` | [`CurrencyService`](/docs/api/defi/protocols/src/vendors/payments/services/currency-service.md#currencyservice) |

###### Returns

[`ListCurrenciesCatalogHandler`](/docs/api/defi/protocols/src/vendors/payments/tools/list-currencies-catalog.md#listcurrenciescataloghandler)

#### Methods

##### handle()

```ts
handle(args: unknown): Promise<{
  cache_info: {
     age: number;
     cached: boolean;
     valid: boolean;
  };
  currencies: CurrencyInfo[];
  filter_amount?: number;
  filter_applied: boolean;
  filtered_count: number;
  network_groups?: Record<string, string[]>;
  total_count: number;
}>;
```

Defined in: [defi/protocols/src/vendors/payments/tools/list-currencies-catalog.ts:65](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/vendors/payments/tools/list-currencies-catalog.ts#L65)

###### Parameters

| Parameter | Type |
| :------ | :------ |
| `args` | `unknown` |

###### Returns

`Promise`\<\{
  `cache_info`: \{
     `age`: `number`;
     `cached`: `boolean`;
     `valid`: `boolean`;
  \};
  `currencies`: [`CurrencyInfo`](/docs/api/defi/protocols/src/vendors/payments/tools/list-currencies-catalog.md#currencyinfo)[];
  `filter_amount?`: `number`;
  `filter_applied`: `boolean`;
  `filtered_count`: `number`;
  `network_groups?`: `Record`\<`string`, `string`[]\>;
  `total_count`: `number`;
\}\>

## Interfaces

### CurrencyInfo

Defined in: [defi/protocols/src/vendors/payments/tools/list-currencies-catalog.ts:49](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/vendors/payments/tools/list-currencies-catalog.ts#L49)

#### Properties

| Property | Type | Defined in |
| :------ | :------ | :------ |
| <a id="decimals"></a> `decimals` | `number` | [defi/protocols/src/vendors/payments/tools/list-currencies-catalog.ts:57](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/vendors/payments/tools/list-currencies-catalog.ts#L57) |
| <a id="features"></a> `features` | `string`[] | [defi/protocols/src/vendors/payments/tools/list-currencies-catalog.ts:59](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/vendors/payments/tools/list-currencies-catalog.ts#L59) |
| <a id="image"></a> `image` | `string` | [defi/protocols/src/vendors/payments/tools/list-currencies-catalog.ts:53](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/vendors/payments/tools/list-currencies-catalog.ts#L53) |
| <a id="is_active"></a> `is_active` | `boolean` | [defi/protocols/src/vendors/payments/tools/list-currencies-catalog.ts:58](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/vendors/payments/tools/list-currencies-catalog.ts#L58) |
| <a id="max_amount"></a> `max_amount` | `number` \| `null` | [defi/protocols/src/vendors/payments/tools/list-currencies-catalog.ts:52](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/vendors/payments/tools/list-currencies-catalog.ts#L52) |
| <a id="min_amount"></a> `min_amount` | `number` | [defi/protocols/src/vendors/payments/tools/list-currencies-catalog.ts:51](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/vendors/payments/tools/list-currencies-catalog.ts#L51) |
| <a id="name"></a> `name` | `string` | [defi/protocols/src/vendors/payments/tools/list-currencies-catalog.ts:50](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/vendors/payments/tools/list-currencies-catalog.ts#L50) |
| <a id="original_blockchain"></a> `original_blockchain` | `string` | [defi/protocols/src/vendors/payments/tools/list-currencies-catalog.ts:55](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/vendors/payments/tools/list-currencies-catalog.ts#L55) |
| <a id="original_symbol"></a> `original_symbol` | `string` | [defi/protocols/src/vendors/payments/tools/list-currencies-catalog.ts:54](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/vendors/payments/tools/list-currencies-catalog.ts#L54) |
| <a id="requires_memo"></a> `requires_memo` | `boolean` | [defi/protocols/src/vendors/payments/tools/list-currencies-catalog.ts:56](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/vendors/payments/tools/list-currencies-catalog.ts#L56) |

## Variables

### listCurrenciesCatalogTool

```ts
const listCurrenciesCatalogTool: Tool;
```

Defined in: [defi/protocols/src/vendors/payments/tools/list-currencies-catalog.ts:15](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/vendors/payments/tools/list-currencies-catalog.ts#L15)

## Functions

### listCurrenciesCatalogHandler()

```ts
function listCurrenciesCatalogHandler(currencyService: CurrencyService): ListCurrenciesCatalogHandler;
```

Defined in: [defi/protocols/src/vendors/payments/tools/list-currencies-catalog.ts:276](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/vendors/payments/tools/list-currencies-catalog.ts#L276)

#### Parameters

| Parameter | Type |
| :------ | :------ |
| `currencyService` | [`CurrencyService`](/docs/api/defi/protocols/src/vendors/payments/services/currency-service.md#currencyservice) |

#### Returns

[`ListCurrenciesCatalogHandler`](/docs/api/defi/protocols/src/vendors/payments/tools/list-currencies-catalog.md#listcurrenciescataloghandler)
