[**Universal Crypto MCP API Reference v1.0.0**](../../../index.md)

***

[Universal Crypto MCP API Reference](/docs/api/index.md) / defi/protocols/src/types

# defi/protocols/src/types

## Interfaces

### ApiResponse

Defined in: [defi/protocols/src/types/index.ts:221](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/types/index.ts#L221)

#### Extended by

- [`PaginatedResponse`](/docs/api/defi/protocols/src/types.md#paginatedresponse)

#### Type Parameters

| Type Parameter |
| :------ |
| `T` |

#### Properties

| Property | Type | Defined in |
| :------ | :------ | :------ |
| <a id="data"></a> `data?` | `T` | [defi/protocols/src/types/index.ts:223](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/types/index.ts#L223) |
| <a id="error"></a> `error?` | `string` | [defi/protocols/src/types/index.ts:224](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/types/index.ts#L224) |
| <a id="success"></a> `success` | `boolean` | [defi/protocols/src/types/index.ts:222](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/types/index.ts#L222) |
| <a id="timestamp"></a> `timestamp` | `number` | [defi/protocols/src/types/index.ts:225](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/types/index.ts#L225) |

***

### BollingerBands

Defined in: [defi/protocols/src/types/index.ts:86](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/types/index.ts#L86)

#### Properties

| Property | Type | Defined in |
| :------ | :------ | :------ |
| <a id="lower"></a> `lower` | `number`[] | [defi/protocols/src/types/index.ts:89](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/types/index.ts#L89) |
| <a id="middle"></a> `middle` | `number`[] | [defi/protocols/src/types/index.ts:88](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/types/index.ts#L88) |
| <a id="upper"></a> `upper` | `number`[] | [defi/protocols/src/types/index.ts:87](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/types/index.ts#L87) |
| <a id="width"></a> `width` | `number`[] | [defi/protocols/src/types/index.ts:90](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/types/index.ts#L90) |

***

### ChainConfig

Defined in: [defi/protocols/src/types/index.ts:251](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/types/index.ts#L251)

#### Properties

| Property | Type | Defined in |
| :------ | :------ | :------ |
| <a id="blockexplorer"></a> `blockExplorer?` | `string` | [defi/protocols/src/types/index.ts:256](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/types/index.ts#L256) |
| <a id="chainid"></a> `chainId` | `number` | [defi/protocols/src/types/index.ts:252](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/types/index.ts#L252) |
| <a id="istestnet"></a> `isTestnet?` | `boolean` | [defi/protocols/src/types/index.ts:262](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/types/index.ts#L262) |
| <a id="name"></a> `name` | `string` | [defi/protocols/src/types/index.ts:253](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/types/index.ts#L253) |
| <a id="nativecurrency"></a> `nativeCurrency` | \{ `decimals`: `number`; `name`: `string`; `symbol`: `string`; \} | [defi/protocols/src/types/index.ts:257](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/types/index.ts#L257) |
| `nativeCurrency.decimals` | `number` | [defi/protocols/src/types/index.ts:260](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/types/index.ts#L260) |
| `nativeCurrency.name` | `string` | [defi/protocols/src/types/index.ts:258](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/types/index.ts#L258) |
| `nativeCurrency.symbol` | `string` | [defi/protocols/src/types/index.ts:259](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/types/index.ts#L259) |
| <a id="rpcurls"></a> `rpcUrls` | `string`[] | [defi/protocols/src/types/index.ts:255](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/types/index.ts#L255) |
| <a id="symbol"></a> `symbol` | `string` | [defi/protocols/src/types/index.ts:254](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/types/index.ts#L254) |

***

### CoinMarketData

Defined in: [defi/protocols/src/types/index.ts:54](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/types/index.ts#L54)

#### Properties

| Property | Type | Defined in |
| :------ | :------ | :------ |
| <a id="ath"></a> `ath` | `number` | [defi/protocols/src/types/index.ts:68](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/types/index.ts#L68) |
| <a id="athchangepercent"></a> `athChangePercent` | `number` | [defi/protocols/src/types/index.ts:69](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/types/index.ts#L69) |
| <a id="athdate"></a> `athDate` | `string` | [defi/protocols/src/types/index.ts:70](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/types/index.ts#L70) |
| <a id="atl"></a> `atl` | `number` | [defi/protocols/src/types/index.ts:71](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/types/index.ts#L71) |
| <a id="atlchangepercent"></a> `atlChangePercent` | `number` | [defi/protocols/src/types/index.ts:72](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/types/index.ts#L72) |
| <a id="atldate"></a> `atlDate` | `string` | [defi/protocols/src/types/index.ts:73](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/types/index.ts#L73) |
| <a id="circulatingsupply"></a> `circulatingSupply` | `number` | [defi/protocols/src/types/index.ts:65](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/types/index.ts#L65) |
| <a id="currentprice"></a> `currentPrice` | `number` | [defi/protocols/src/types/index.ts:58](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/types/index.ts#L58) |
| <a id="high24h"></a> `high24h` | `number` | [defi/protocols/src/types/index.ts:63](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/types/index.ts#L63) |
| <a id="id"></a> `id` | `string` | [defi/protocols/src/types/index.ts:55](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/types/index.ts#L55) |
| <a id="low24h"></a> `low24h` | `number` | [defi/protocols/src/types/index.ts:64](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/types/index.ts#L64) |
| <a id="marketcap"></a> `marketCap` | `number` | [defi/protocols/src/types/index.ts:59](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/types/index.ts#L59) |
| <a id="maxsupply"></a> `maxSupply?` | `number` | [defi/protocols/src/types/index.ts:67](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/types/index.ts#L67) |
| <a id="name-1"></a> `name` | `string` | [defi/protocols/src/types/index.ts:57](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/types/index.ts#L57) |
| <a id="pricechange24h"></a> `priceChange24h` | `number` | [defi/protocols/src/types/index.ts:61](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/types/index.ts#L61) |
| <a id="pricechangepercent24h"></a> `priceChangePercent24h` | `number` | [defi/protocols/src/types/index.ts:62](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/types/index.ts#L62) |
| <a id="symbol-1"></a> `symbol` | `string` | [defi/protocols/src/types/index.ts:56](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/types/index.ts#L56) |
| <a id="totalsupply"></a> `totalSupply?` | `number` | [defi/protocols/src/types/index.ts:66](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/types/index.ts#L66) |
| <a id="volume24h"></a> `volume24h` | `number` | [defi/protocols/src/types/index.ts:60](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/types/index.ts#L60) |

***

### IchimokuCloud

Defined in: [defi/protocols/src/types/index.ts:99](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/types/index.ts#L99)

#### Properties

| Property | Type | Defined in |
| :------ | :------ | :------ |
| <a id="baseline"></a> `baseLine` | `number`[] | [defi/protocols/src/types/index.ts:101](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/types/index.ts#L101) |
| <a id="conversionline"></a> `conversionLine` | `number`[] | [defi/protocols/src/types/index.ts:100](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/types/index.ts#L100) |
| <a id="laggingspan"></a> `laggingSpan` | `number`[] | [defi/protocols/src/types/index.ts:104](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/types/index.ts#L104) |
| <a id="leadingspana"></a> `leadingSpanA` | `number`[] | [defi/protocols/src/types/index.ts:102](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/types/index.ts#L102) |
| <a id="leadingspanb"></a> `leadingSpanB` | `number`[] | [defi/protocols/src/types/index.ts:103](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/types/index.ts#L103) |

***

### IndicatorResult

Defined in: [defi/protocols/src/types/index.ts:80](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/types/index.ts#L80)

#### Properties

| Property | Type | Defined in |
| :------ | :------ | :------ |
| <a id="metadata"></a> `metadata?` | `Record`\<`string`, `unknown`\> | [defi/protocols/src/types/index.ts:83](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/types/index.ts#L83) |
| <a id="signal"></a> `signal?` | [`TradingSignal`](/docs/api/defi/protocols/src/types.md#tradingsignal) | [defi/protocols/src/types/index.ts:82](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/types/index.ts#L82) |
| <a id="values"></a> `values` | `number`[] | [defi/protocols/src/types/index.ts:81](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/types/index.ts#L81) |

***

### LiquidityPool

Defined in: [defi/protocols/src/types/index.ts:167](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/types/index.ts#L167)

#### Properties

| Property | Type | Defined in |
| :------ | :------ | :------ |
| <a id="address"></a> `address` | `string` | [defi/protocols/src/types/index.ts:168](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/types/index.ts#L168) |
| <a id="apr"></a> `apr?` | `number` | [defi/protocols/src/types/index.ts:175](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/types/index.ts#L175) |
| <a id="fee"></a> `fee` | `number` | [defi/protocols/src/types/index.ts:174](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/types/index.ts#L174) |
| <a id="reserve0"></a> `reserve0` | `string` | [defi/protocols/src/types/index.ts:171](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/types/index.ts#L171) |
| <a id="reserve1"></a> `reserve1` | `string` | [defi/protocols/src/types/index.ts:172](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/types/index.ts#L172) |
| <a id="token0"></a> `token0` | [`TokenInfo`](/docs/api/defi/protocols/src/types.md#tokeninfo) | [defi/protocols/src/types/index.ts:169](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/types/index.ts#L169) |
| <a id="token1"></a> `token1` | [`TokenInfo`](/docs/api/defi/protocols/src/types.md#tokeninfo) | [defi/protocols/src/types/index.ts:170](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/types/index.ts#L170) |
| <a id="totalsupply-1"></a> `totalSupply` | `string` | [defi/protocols/src/types/index.ts:173](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/types/index.ts#L173) |

***

### MACDResult

Defined in: [defi/protocols/src/types/index.ts:93](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/types/index.ts#L93)

#### Properties

| Property | Type | Defined in |
| :------ | :------ | :------ |
| <a id="histogram"></a> `histogram` | `number`[] | [defi/protocols/src/types/index.ts:96](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/types/index.ts#L96) |
| <a id="macdline"></a> `macdLine` | `number`[] | [defi/protocols/src/types/index.ts:94](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/types/index.ts#L94) |
| <a id="signalline"></a> `signalLine` | `number`[] | [defi/protocols/src/types/index.ts:95](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/types/index.ts#L95) |

***

### MarketTicker

Defined in: [defi/protocols/src/types/index.ts:30](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/types/index.ts#L30)

#### Properties

| Property | Type | Defined in |
| :------ | :------ | :------ |
| <a id="ask"></a> `ask` | `number` | [defi/protocols/src/types/index.ts:33](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/types/index.ts#L33) |
| <a id="bid"></a> `bid` | `number` | [defi/protocols/src/types/index.ts:32](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/types/index.ts#L32) |
| <a id="change"></a> `change` | `number` | [defi/protocols/src/types/index.ts:38](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/types/index.ts#L38) |
| <a id="changepercent"></a> `changePercent` | `number` | [defi/protocols/src/types/index.ts:39](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/types/index.ts#L39) |
| <a id="high"></a> `high` | `number` | [defi/protocols/src/types/index.ts:35](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/types/index.ts#L35) |
| <a id="last"></a> `last` | `number` | [defi/protocols/src/types/index.ts:34](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/types/index.ts#L34) |
| <a id="low"></a> `low` | `number` | [defi/protocols/src/types/index.ts:36](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/types/index.ts#L36) |
| <a id="symbol-2"></a> `symbol` | `string` | [defi/protocols/src/types/index.ts:31](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/types/index.ts#L31) |
| <a id="timestamp-1"></a> `timestamp` | `number` | [defi/protocols/src/types/index.ts:40](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/types/index.ts#L40) |
| <a id="volume"></a> `volume` | `number` | [defi/protocols/src/types/index.ts:37](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/types/index.ts#L37) |

***

### OhlcvAsset

Defined in: [defi/protocols/src/types/index.ts:21](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/types/index.ts#L21)

#### Properties

| Property | Type | Defined in |
| :------ | :------ | :------ |
| <a id="closings"></a> `closings` | `number`[] | [defi/protocols/src/types/index.ts:26](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/types/index.ts#L26) |
| <a id="dates"></a> `dates` | `Date`[] | [defi/protocols/src/types/index.ts:22](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/types/index.ts#L22) |
| <a id="highs"></a> `highs` | `number`[] | [defi/protocols/src/types/index.ts:24](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/types/index.ts#L24) |
| <a id="lows"></a> `lows` | `number`[] | [defi/protocols/src/types/index.ts:25](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/types/index.ts#L25) |
| <a id="openings"></a> `openings` | `number`[] | [defi/protocols/src/types/index.ts:23](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/types/index.ts#L23) |
| <a id="volumes"></a> `volumes` | `number`[] | [defi/protocols/src/types/index.ts:27](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/types/index.ts#L27) |

***

### OhlcvData

Defined in: [defi/protocols/src/types/index.ts:12](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/types/index.ts#L12)

#### Properties

| Property | Type | Defined in |
| :------ | :------ | :------ |
| <a id="close"></a> `close` | `number` | [defi/protocols/src/types/index.ts:17](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/types/index.ts#L17) |
| <a id="high-1"></a> `high` | `number` | [defi/protocols/src/types/index.ts:15](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/types/index.ts#L15) |
| <a id="low-1"></a> `low` | `number` | [defi/protocols/src/types/index.ts:16](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/types/index.ts#L16) |
| <a id="open"></a> `open` | `number` | [defi/protocols/src/types/index.ts:14](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/types/index.ts#L14) |
| <a id="timestamp-2"></a> `timestamp` | `number` | [defi/protocols/src/types/index.ts:13](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/types/index.ts#L13) |
| <a id="volume-1"></a> `volume` | `number` | [defi/protocols/src/types/index.ts:18](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/types/index.ts#L18) |

***

### Order

Defined in: [defi/protocols/src/types/index.ts:152](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/types/index.ts#L152)

#### Properties

| Property | Type | Defined in |
| :------ | :------ | :------ |
| <a id="amount"></a> `amount` | `number` | [defi/protocols/src/types/index.ts:158](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/types/index.ts#L158) |
| <a id="filled"></a> `filled` | `number` | [defi/protocols/src/types/index.ts:159](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/types/index.ts#L159) |
| <a id="id-1"></a> `id` | `string` | [defi/protocols/src/types/index.ts:153](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/types/index.ts#L153) |
| <a id="price"></a> `price?` | `number` | [defi/protocols/src/types/index.ts:157](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/types/index.ts#L157) |
| <a id="remaining"></a> `remaining` | `number` | [defi/protocols/src/types/index.ts:160](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/types/index.ts#L160) |
| <a id="side"></a> `side` | `"buy"` \| `"sell"` | [defi/protocols/src/types/index.ts:156](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/types/index.ts#L156) |
| <a id="status"></a> `status` | `"canceled"` \| `"open"` \| `"closed"` | [defi/protocols/src/types/index.ts:161](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/types/index.ts#L161) |
| <a id="symbol-3"></a> `symbol` | `string` | [defi/protocols/src/types/index.ts:154](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/types/index.ts#L154) |
| <a id="timestamp-3"></a> `timestamp` | `number` | [defi/protocols/src/types/index.ts:162](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/types/index.ts#L162) |
| <a id="type"></a> `type` | `"limit"` \| `"market"` \| `"stop"` \| `"stop_limit"` | [defi/protocols/src/types/index.ts:155](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/types/index.ts#L155) |

***

### OrderBook

Defined in: [defi/protocols/src/types/index.ts:136](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/types/index.ts#L136)

#### Properties

| Property | Type | Defined in |
| :------ | :------ | :------ |
| <a id="asks"></a> `asks` | \[`number`, `number`\][] | [defi/protocols/src/types/index.ts:139](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/types/index.ts#L139) |
| <a id="bids"></a> `bids` | \[`number`, `number`\][] | [defi/protocols/src/types/index.ts:138](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/types/index.ts#L138) |
| <a id="symbol-4"></a> `symbol` | `string` | [defi/protocols/src/types/index.ts:137](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/types/index.ts#L137) |
| <a id="timestamp-4"></a> `timestamp` | `number` | [defi/protocols/src/types/index.ts:140](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/types/index.ts#L140) |

***

### PaginatedResponse

Defined in: [defi/protocols/src/types/index.ts:228](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/types/index.ts#L228)

#### Extends

- [`ApiResponse`](/docs/api/defi/protocols/src/types.md#apiresponse)\<`T`[]\>

#### Type Parameters

| Type Parameter |
| :------ |
| `T` |

#### Properties

| Property | Type | Inherited from | Defined in |
| :------ | :------ | :------ | :------ |
| <a id="data-1"></a> `data?` | `T`[] | [`ApiResponse`](/docs/api/defi/protocols/src/types.md#apiresponse).[`data`](/docs/api/defi/protocols/src/types.md#data) | [defi/protocols/src/types/index.ts:223](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/types/index.ts#L223) |
| <a id="error-1"></a> `error?` | `string` | [`ApiResponse`](/docs/api/defi/protocols/src/types.md#apiresponse).[`error`](/docs/api/defi/protocols/src/types.md#error) | [defi/protocols/src/types/index.ts:224](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/types/index.ts#L224) |
| <a id="hasmore"></a> `hasMore` | `boolean` | - | [defi/protocols/src/types/index.ts:232](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/types/index.ts#L232) |
| <a id="page"></a> `page` | `number` | - | [defi/protocols/src/types/index.ts:230](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/types/index.ts#L230) |
| <a id="pagesize"></a> `pageSize` | `number` | - | [defi/protocols/src/types/index.ts:231](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/types/index.ts#L231) |
| <a id="success-1"></a> `success` | `boolean` | [`ApiResponse`](/docs/api/defi/protocols/src/types.md#apiresponse).[`success`](/docs/api/defi/protocols/src/types.md#success) | [defi/protocols/src/types/index.ts:222](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/types/index.ts#L222) |
| <a id="timestamp-5"></a> `timestamp` | `number` | [`ApiResponse`](/docs/api/defi/protocols/src/types.md#apiresponse).[`timestamp`](/docs/api/defi/protocols/src/types.md#timestamp) | [defi/protocols/src/types/index.ts:225](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/types/index.ts#L225) |
| <a id="total"></a> `total` | `number` | - | [defi/protocols/src/types/index.ts:229](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/types/index.ts#L229) |

***

### ResearchSection

Defined in: [defi/protocols/src/types/index.ts:211](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/types/index.ts#L211)

#### Properties

| Property | Type | Defined in |
| :------ | :------ | :------ |
| <a id="description"></a> `description` | `string` | [defi/protocols/src/types/index.ts:213](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/types/index.ts#L213) |
| <a id="findings"></a> `findings?` | `string`[] | [defi/protocols/src/types/index.ts:216](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/types/index.ts#L216) |
| <a id="name-2"></a> `name` | `string` | [defi/protocols/src/types/index.ts:212](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/types/index.ts#L212) |
| <a id="sources"></a> `sources` | `string`[] | [defi/protocols/src/types/index.ts:215](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/types/index.ts#L215) |
| <a id="status-1"></a> `status` | `"completed"` \| `"planned"` \| `"in_progress"` | [defi/protocols/src/types/index.ts:214](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/types/index.ts#L214) |

***

### ResearchSource

Defined in: [defi/protocols/src/types/index.ts:203](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/types/index.ts#L203)

#### Properties

| Property | Type | Defined in |
| :------ | :------ | :------ |
| <a id="snippet"></a> `snippet` | `string` | [defi/protocols/src/types/index.ts:206](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/types/index.ts#L206) |
| <a id="source"></a> `source` | `string` | [defi/protocols/src/types/index.ts:207](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/types/index.ts#L207) |
| <a id="timestamp-6"></a> `timestamp?` | `string` | [defi/protocols/src/types/index.ts:208](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/types/index.ts#L208) |
| <a id="title"></a> `title` | `string` | [defi/protocols/src/types/index.ts:204](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/types/index.ts#L204) |
| <a id="url"></a> `url` | `string` | [defi/protocols/src/types/index.ts:205](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/types/index.ts#L205) |

***

### SwapQuote

Defined in: [defi/protocols/src/types/index.ts:178](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/types/index.ts#L178)

#### Properties

| Property | Type | Defined in |
| :------ | :------ | :------ |
| <a id="fee-1"></a> `fee` | `number` | [defi/protocols/src/types/index.ts:185](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/types/index.ts#L185) |
| <a id="gasestimate"></a> `gasEstimate?` | `string` | [defi/protocols/src/types/index.ts:186](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/types/index.ts#L186) |
| <a id="inputamount"></a> `inputAmount` | `string` | [defi/protocols/src/types/index.ts:181](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/types/index.ts#L181) |
| <a id="inputtoken"></a> `inputToken` | [`TokenInfo`](/docs/api/defi/protocols/src/types.md#tokeninfo) | [defi/protocols/src/types/index.ts:179](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/types/index.ts#L179) |
| <a id="outputamount"></a> `outputAmount` | `string` | [defi/protocols/src/types/index.ts:182](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/types/index.ts#L182) |
| <a id="outputtoken"></a> `outputToken` | [`TokenInfo`](/docs/api/defi/protocols/src/types.md#tokeninfo) | [defi/protocols/src/types/index.ts:180](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/types/index.ts#L180) |
| <a id="priceimpact"></a> `priceImpact` | `number` | [defi/protocols/src/types/index.ts:183](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/types/index.ts#L183) |
| <a id="route"></a> `route` | `string`[] | [defi/protocols/src/types/index.ts:184](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/types/index.ts#L184) |

***

### TokenBalance

Defined in: [defi/protocols/src/types/index.ts:129](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/types/index.ts#L129)

#### Extends

- [`WalletBalance`](/docs/api/defi/protocols/src/types.md#walletbalance)

#### Properties

| Property | Type | Inherited from | Defined in |
| :------ | :------ | :------ | :------ |
| <a id="address-1"></a> `address` | `string` | [`WalletBalance`](/docs/api/defi/protocols/src/types.md#walletbalance).[`address`](/docs/api/defi/protocols/src/types.md#address-3) | [defi/protocols/src/types/index.ts:122](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/types/index.ts#L122) |
| <a id="balance"></a> `balance` | `string` | [`WalletBalance`](/docs/api/defi/protocols/src/types.md#walletbalance).[`balance`](/docs/api/defi/protocols/src/types.md#balance-1) | [defi/protocols/src/types/index.ts:123](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/types/index.ts#L123) |
| <a id="decimals"></a> `decimals` | `number` | [`WalletBalance`](/docs/api/defi/protocols/src/types.md#walletbalance).[`decimals`](/docs/api/defi/protocols/src/types.md#decimals-2) | [defi/protocols/src/types/index.ts:125](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/types/index.ts#L125) |
| <a id="symbol-5"></a> `symbol` | `string` | [`WalletBalance`](/docs/api/defi/protocols/src/types.md#walletbalance).[`symbol`](/docs/api/defi/protocols/src/types.md#symbol-8) | [defi/protocols/src/types/index.ts:124](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/types/index.ts#L124) |
| <a id="tokenaddress"></a> `tokenAddress` | `string` | - | [defi/protocols/src/types/index.ts:130](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/types/index.ts#L130) |
| <a id="tokenname"></a> `tokenName` | `string` | - | [defi/protocols/src/types/index.ts:131](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/types/index.ts#L131) |
| <a id="usdvalue"></a> `usdValue?` | `number` | [`WalletBalance`](/docs/api/defi/protocols/src/types.md#walletbalance).[`usdValue`](/docs/api/defi/protocols/src/types.md#usdvalue-1) | [defi/protocols/src/types/index.ts:126](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/types/index.ts#L126) |

***

### TokenInfo

Defined in: [defi/protocols/src/types/index.ts:45](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/types/index.ts#L45)

#### Properties

| Property | Type | Defined in |
| :------ | :------ | :------ |
| <a id="address-2"></a> `address?` | `string` | [defi/protocols/src/types/index.ts:48](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/types/index.ts#L48) |
| <a id="chainid-1"></a> `chainId?` | `number` | [defi/protocols/src/types/index.ts:49](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/types/index.ts#L49) |
| <a id="decimals-1"></a> `decimals?` | `number` | [defi/protocols/src/types/index.ts:50](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/types/index.ts#L50) |
| <a id="logourl"></a> `logoUrl?` | `string` | [defi/protocols/src/types/index.ts:51](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/types/index.ts#L51) |
| <a id="name-3"></a> `name` | `string` | [defi/protocols/src/types/index.ts:46](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/types/index.ts#L46) |
| <a id="symbol-6"></a> `symbol` | `string` | [defi/protocols/src/types/index.ts:47](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/types/index.ts#L47) |

***

### ToolContent

Defined in: [defi/protocols/src/types/index.ts:237](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/types/index.ts#L237)

#### Properties

| Property | Type | Defined in |
| :------ | :------ | :------ |
| <a id="data-2"></a> `data?` | `string` | [defi/protocols/src/types/index.ts:240](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/types/index.ts#L240) |
| <a id="mimetype"></a> `mimeType?` | `string` | [defi/protocols/src/types/index.ts:241](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/types/index.ts#L241) |
| <a id="text"></a> `text?` | `string` | [defi/protocols/src/types/index.ts:239](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/types/index.ts#L239) |
| <a id="type-1"></a> `type` | `"text"` \| `"image"` \| `"resource"` | [defi/protocols/src/types/index.ts:238](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/types/index.ts#L238) |

***

### ToolResponse

Defined in: [defi/protocols/src/types/index.ts:244](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/types/index.ts#L244)

#### Properties

| Property | Type | Defined in |
| :------ | :------ | :------ |
| <a id="content"></a> `content` | [`ToolContent`](/docs/api/defi/protocols/src/types.md#toolcontent)[] | [defi/protocols/src/types/index.ts:245](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/types/index.ts#L245) |
| <a id="iserror"></a> `isError?` | `boolean` | [defi/protocols/src/types/index.ts:246](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/types/index.ts#L246) |

***

### Trade

Defined in: [defi/protocols/src/types/index.ts:143](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/types/index.ts#L143)

#### Properties

| Property | Type | Defined in |
| :------ | :------ | :------ |
| <a id="amount-1"></a> `amount` | `number` | [defi/protocols/src/types/index.ts:148](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/types/index.ts#L148) |
| <a id="id-2"></a> `id` | `string` | [defi/protocols/src/types/index.ts:144](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/types/index.ts#L144) |
| <a id="price-1"></a> `price` | `number` | [defi/protocols/src/types/index.ts:147](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/types/index.ts#L147) |
| <a id="side-1"></a> `side` | `"buy"` \| `"sell"` | [defi/protocols/src/types/index.ts:146](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/types/index.ts#L146) |
| <a id="symbol-7"></a> `symbol` | `string` | [defi/protocols/src/types/index.ts:145](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/types/index.ts#L145) |
| <a id="timestamp-7"></a> `timestamp` | `number` | [defi/protocols/src/types/index.ts:149](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/types/index.ts#L149) |

***

### TransactionInfo

Defined in: [defi/protocols/src/types/index.ts:109](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/types/index.ts#L109)

#### Properties

| Property | Type | Defined in |
| :------ | :------ | :------ |
| <a id="blocknumber"></a> `blockNumber` | `number` | [defi/protocols/src/types/index.ts:116](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/types/index.ts#L116) |
| <a id="from"></a> `from` | `string` | [defi/protocols/src/types/index.ts:111](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/types/index.ts#L111) |
| <a id="gasprice"></a> `gasPrice?` | `string` | [defi/protocols/src/types/index.ts:114](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/types/index.ts#L114) |
| <a id="gasused"></a> `gasUsed?` | `string` | [defi/protocols/src/types/index.ts:115](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/types/index.ts#L115) |
| <a id="hash"></a> `hash` | `string` | [defi/protocols/src/types/index.ts:110](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/types/index.ts#L110) |
| <a id="status-2"></a> `status` | `"pending"` \| `"confirmed"` \| `"failed"` | [defi/protocols/src/types/index.ts:118](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/types/index.ts#L118) |
| <a id="timestamp-8"></a> `timestamp` | `number` | [defi/protocols/src/types/index.ts:117](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/types/index.ts#L117) |
| <a id="to"></a> `to` | `string` | [defi/protocols/src/types/index.ts:112](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/types/index.ts#L112) |
| <a id="value"></a> `value` | `string` | [defi/protocols/src/types/index.ts:113](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/types/index.ts#L113) |

***

### WalletBalance

Defined in: [defi/protocols/src/types/index.ts:121](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/types/index.ts#L121)

#### Extended by

- [`TokenBalance`](/docs/api/defi/protocols/src/types.md#tokenbalance)

#### Properties

| Property | Type | Defined in |
| :------ | :------ | :------ |
| <a id="address-3"></a> `address` | `string` | [defi/protocols/src/types/index.ts:122](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/types/index.ts#L122) |
| <a id="balance-1"></a> `balance` | `string` | [defi/protocols/src/types/index.ts:123](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/types/index.ts#L123) |
| <a id="decimals-2"></a> `decimals` | `number` | [defi/protocols/src/types/index.ts:125](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/types/index.ts#L125) |
| <a id="symbol-8"></a> `symbol` | `string` | [defi/protocols/src/types/index.ts:124](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/types/index.ts#L124) |
| <a id="usdvalue-1"></a> `usdValue?` | `number` | [defi/protocols/src/types/index.ts:126](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/types/index.ts#L126) |

***

### YieldPosition

Defined in: [defi/protocols/src/types/index.ts:189](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/types/index.ts#L189)

#### Properties

| Property | Type | Defined in |
| :------ | :------ | :------ |
| <a id="apy"></a> `apy` | `number` | [defi/protocols/src/types/index.ts:198](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/types/index.ts#L198) |
| <a id="currentvalue"></a> `currentValue` | `string` | [defi/protocols/src/types/index.ts:193](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/types/index.ts#L193) |
| <a id="depositedamount"></a> `depositedAmount` | `string` | [defi/protocols/src/types/index.ts:192](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/types/index.ts#L192) |
| <a id="pool"></a> `pool` | `string` | [defi/protocols/src/types/index.ts:191](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/types/index.ts#L191) |
| <a id="protocol"></a> `protocol` | `string` | [defi/protocols/src/types/index.ts:190](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/types/index.ts#L190) |
| <a id="rewards"></a> `rewards` | \{ `amount`: `string`; `token`: [`TokenInfo`](/docs/api/defi/protocols/src/types.md#tokeninfo); \}[] | [defi/protocols/src/types/index.ts:194](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/types/index.ts#L194) |

## Type Aliases

### TradingSignal

```ts
type TradingSignal = -1 | 0 | 1;
```

Defined in: [defi/protocols/src/types/index.ts:78](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/types/index.ts#L78)
