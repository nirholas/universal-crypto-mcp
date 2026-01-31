[**Universal Crypto MCP API Reference v1.0.0**](../../index.md)

***

[Universal Crypto MCP API Reference](/docs/api/index.md) / market-data/coinstats/src

# market-data/coinstats/src

## Classes

### CoinStatsClient

Defined in: [market-data/coinstats/src/index.ts:76](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/market-data/coinstats/src/index.ts#L76)

#### Constructors

##### Constructor

```ts
new CoinStatsClient(config: CoinStatsConfig): CoinStatsClient;
```

Defined in: [market-data/coinstats/src/index.ts:82](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/market-data/coinstats/src/index.ts#L82)

###### Parameters

| Parameter | Type |
| :------ | :------ |
| `config` | [`CoinStatsConfig`](/docs/api/market-data/coinstats/src.md#coinstatsconfig) |

###### Returns

[`CoinStatsClient`](/docs/api/market-data/coinstats/src.md#coinstatsclient)

#### Methods

##### getCoin()

```ts
getCoin(coinId: string): Promise<Coin>;
```

Defined in: [market-data/coinstats/src/index.ts:139](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/market-data/coinstats/src/index.ts#L139)

Get coin details

###### Parameters

| Parameter | Type |
| :------ | :------ |
| `coinId` | `string` |

###### Returns

`Promise`\<[`Coin`](/docs/api/market-data/coinstats/src.md#coin)\>

###### Source

Based on CoinStats API

##### getMarkets()

```ts
getMarkets(options: {
  currency?: string;
  limit?: number;
  skip?: number;
}): Promise<Coin[]>;
```

Defined in: [market-data/coinstats/src/index.ts:123](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/market-data/coinstats/src/index.ts#L123)

Get market data for coins

###### Parameters

| Parameter | Type |
| :------ | :------ |
| `options` | \{ `currency?`: `string`; `limit?`: `number`; `skip?`: `number`; \} |
| `options.currency?` | `string` |
| `options.limit?` | `number` |
| `options.skip?` | `number` |

###### Returns

`Promise`\<[`Coin`](/docs/api/market-data/coinstats/src.md#coin)[]\>

###### Source

Based on CoinStats API

##### getNews()

```ts
getNews(options: {
  limit?: number;
  skip?: number;
}): Promise<NewsItem[]>;
```

Defined in: [market-data/coinstats/src/index.ts:148](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/market-data/coinstats/src/index.ts#L148)

Get crypto news

###### Parameters

| Parameter | Type |
| :------ | :------ |
| `options` | \{ `limit?`: `number`; `skip?`: `number`; \} |
| `options.limit?` | `number` |
| `options.skip?` | `number` |

###### Returns

`Promise`\<[`NewsItem`](/docs/api/market-data/coinstats/src.md#newsitem)[]\>

###### Source

Based on CoinStats API

##### getPortfolio()

```ts
getPortfolio(): Promise<Portfolio>;
```

Defined in: [market-data/coinstats/src/index.ts:163](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/market-data/coinstats/src/index.ts#L163)

Get portfolio (simulated for demo)

###### Returns

`Promise`\<[`Portfolio`](/docs/api/market-data/coinstats/src.md#portfolio)\>

###### Enhancement

Portfolio tracking

##### getPortfolioPnL()

```ts
getPortfolioPnL(timeframe: "24h" | "7d" | "30d" | "1y"): Promise<{
  endValue: number;
  pnl: number;
  pnlPercent: number;
  startValue: number;
  timeframe: string;
}>;
```

Defined in: [market-data/coinstats/src/index.ts:220](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/market-data/coinstats/src/index.ts#L220)

Calculate portfolio PnL

###### Parameters

| Parameter | Type | Default value |
| :------ | :------ | :------ |
| `timeframe` | `"24h"` \| `"7d"` \| `"30d"` \| `"1y"` | `"24h"` |

###### Returns

`Promise`\<\{
  `endValue`: `number`;
  `pnl`: `number`;
  `pnlPercent`: `number`;
  `startValue`: `number`;
  `timeframe`: `string`;
\}\>

###### Enhancement

PnL analytics

## Interfaces

### Coin

Defined in: [market-data/coinstats/src/index.ts:25](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/market-data/coinstats/src/index.ts#L25)

#### Properties

| Property | Type | Defined in |
| :------ | :------ | :------ |
| <a id="availablesupply"></a> `availableSupply` | `number` | [market-data/coinstats/src/index.ts:34](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/market-data/coinstats/src/index.ts#L34) |
| <a id="icon"></a> `icon` | `string` | [market-data/coinstats/src/index.ts:36](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/market-data/coinstats/src/index.ts#L36) |
| <a id="id"></a> `id` | `string` | [market-data/coinstats/src/index.ts:26](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/market-data/coinstats/src/index.ts#L26) |
| <a id="marketcap"></a> `marketCap` | `number` | [market-data/coinstats/src/index.ts:32](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/market-data/coinstats/src/index.ts#L32) |
| <a id="name"></a> `name` | `string` | [market-data/coinstats/src/index.ts:28](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/market-data/coinstats/src/index.ts#L28) |
| <a id="price"></a> `price` | `number` | [market-data/coinstats/src/index.ts:30](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/market-data/coinstats/src/index.ts#L30) |
| <a id="pricechange24h"></a> `priceChange24h` | `number` | [market-data/coinstats/src/index.ts:31](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/market-data/coinstats/src/index.ts#L31) |
| <a id="rank"></a> `rank` | `number` | [market-data/coinstats/src/index.ts:29](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/market-data/coinstats/src/index.ts#L29) |
| <a id="symbol"></a> `symbol` | `string` | [market-data/coinstats/src/index.ts:27](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/market-data/coinstats/src/index.ts#L27) |
| <a id="totalsupply"></a> `totalSupply` | `number` | [market-data/coinstats/src/index.ts:35](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/market-data/coinstats/src/index.ts#L35) |
| <a id="volume24h"></a> `volume24h` | `number` | [market-data/coinstats/src/index.ts:33](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/market-data/coinstats/src/index.ts#L33) |

***

### CoinStatsConfig

Defined in: [market-data/coinstats/src/index.ts:20](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/market-data/coinstats/src/index.ts#L20)

#### Properties

| Property | Type | Defined in |
| :------ | :------ | :------ |
| <a id="apikey"></a> `apiKey?` | `string` | [market-data/coinstats/src/index.ts:21](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/market-data/coinstats/src/index.ts#L21) |
| <a id="baseurl"></a> `baseUrl?` | `string` | [market-data/coinstats/src/index.ts:22](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/market-data/coinstats/src/index.ts#L22) |

***

### NewsItem

Defined in: [market-data/coinstats/src/index.ts:60](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/market-data/coinstats/src/index.ts#L60)

#### Properties

| Property | Type | Defined in |
| :------ | :------ | :------ |
| <a id="coins"></a> `coins` | `string`[] | [market-data/coinstats/src/index.ts:68](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/market-data/coinstats/src/index.ts#L68) |
| <a id="description"></a> `description` | `string` | [market-data/coinstats/src/index.ts:63](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/market-data/coinstats/src/index.ts#L63) |
| <a id="id-1"></a> `id` | `string` | [market-data/coinstats/src/index.ts:61](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/market-data/coinstats/src/index.ts#L61) |
| <a id="imgurl"></a> `imgUrl` | `string` | [market-data/coinstats/src/index.ts:66](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/market-data/coinstats/src/index.ts#L66) |
| <a id="publishedat"></a> `publishedAt` | `string` | [market-data/coinstats/src/index.ts:67](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/market-data/coinstats/src/index.ts#L67) |
| <a id="sentiment"></a> `sentiment?` | `"neutral"` \| `"positive"` \| `"negative"` | [market-data/coinstats/src/index.ts:69](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/market-data/coinstats/src/index.ts#L69) |
| <a id="source"></a> `source` | `string` | [market-data/coinstats/src/index.ts:64](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/market-data/coinstats/src/index.ts#L64) |
| <a id="title"></a> `title` | `string` | [market-data/coinstats/src/index.ts:62](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/market-data/coinstats/src/index.ts#L62) |
| <a id="url"></a> `url` | `string` | [market-data/coinstats/src/index.ts:65](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/market-data/coinstats/src/index.ts#L65) |

***

### Portfolio

Defined in: [market-data/coinstats/src/index.ts:52](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/market-data/coinstats/src/index.ts#L52)

#### Properties

| Property | Type | Defined in |
| :------ | :------ | :------ |
| <a id="holdings"></a> `holdings` | [`PortfolioHolding`](/docs/api/market-data/coinstats/src.md#portfolioholding)[] | [market-data/coinstats/src/index.ts:56](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/market-data/coinstats/src/index.ts#L56) |
| <a id="lastupdated"></a> `lastUpdated` | `string` | [market-data/coinstats/src/index.ts:57](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/market-data/coinstats/src/index.ts#L57) |
| <a id="totalpnl"></a> `totalPnl` | `number` | [market-data/coinstats/src/index.ts:54](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/market-data/coinstats/src/index.ts#L54) |
| <a id="totalpnlpercent"></a> `totalPnlPercent` | `number` | [market-data/coinstats/src/index.ts:55](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/market-data/coinstats/src/index.ts#L55) |
| <a id="totalvalue"></a> `totalValue` | `number` | [market-data/coinstats/src/index.ts:53](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/market-data/coinstats/src/index.ts#L53) |

***

### PortfolioHolding

Defined in: [market-data/coinstats/src/index.ts:39](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/market-data/coinstats/src/index.ts#L39)

#### Properties

| Property | Type | Defined in |
| :------ | :------ | :------ |
| <a id="allocation"></a> `allocation` | `number` | [market-data/coinstats/src/index.ts:47](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/market-data/coinstats/src/index.ts#L47) |
| <a id="amount"></a> `amount` | `number` | [market-data/coinstats/src/index.ts:43](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/market-data/coinstats/src/index.ts#L43) |
| <a id="coinid-1"></a> `coinId` | `string` | [market-data/coinstats/src/index.ts:40](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/market-data/coinstats/src/index.ts#L40) |
| <a id="name-1"></a> `name` | `string` | [market-data/coinstats/src/index.ts:42](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/market-data/coinstats/src/index.ts#L42) |
| <a id="pnl"></a> `pnl` | `number` | [market-data/coinstats/src/index.ts:48](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/market-data/coinstats/src/index.ts#L48) |
| <a id="pnlpercent"></a> `pnlPercent` | `number` | [market-data/coinstats/src/index.ts:49](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/market-data/coinstats/src/index.ts#L49) |
| <a id="price-1"></a> `price` | `number` | [market-data/coinstats/src/index.ts:45](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/market-data/coinstats/src/index.ts#L45) |
| <a id="pricechange24h-1"></a> `priceChange24h` | `number` | [market-data/coinstats/src/index.ts:46](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/market-data/coinstats/src/index.ts#L46) |
| <a id="symbol-1"></a> `symbol` | `string` | [market-data/coinstats/src/index.ts:41](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/market-data/coinstats/src/index.ts#L41) |
| <a id="value"></a> `value` | `number` | [market-data/coinstats/src/index.ts:44](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/market-data/coinstats/src/index.ts#L44) |

## Functions

### registerCoinStatsTools()

```ts
function registerCoinStatsTools(server: McpServer, config: CoinStatsConfig): void;
```

Defined in: [market-data/coinstats/src/index.ts:253](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/market-data/coinstats/src/index.ts#L253)

#### Parameters

| Parameter | Type |
| :------ | :------ |
| `server` | `McpServer` |
| `config` | [`CoinStatsConfig`](/docs/api/market-data/coinstats/src.md#coinstatsconfig) |

#### Returns

`void`

## References

### default

Renames and re-exports [CoinStatsClient](/docs/api/market-data/coinstats/src.md#coinstatsclient)
