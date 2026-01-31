[**Universal Crypto MCP API Reference v1.0.0**](../../index.md)

***

[Universal Crypto MCP API Reference](/docs/api/index.md) / market-data/crypto-indicators/src

# market-data/crypto-indicators/src

## Classes

### CryptoIndicatorsServer

Defined in: [market-data/crypto-indicators/src/index.ts:122](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/market-data/crypto-indicators/src/index.ts#L122)

#### Constructors

##### Constructor

```ts
new CryptoIndicatorsServer(): CryptoIndicatorsServer;
```

Defined in: [market-data/crypto-indicators/src/index.ts:125](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/market-data/crypto-indicators/src/index.ts#L125)

###### Returns

[`CryptoIndicatorsServer`](/docs/api/market-data/crypto-indicators/src.md#cryptoindicatorsserver)

#### Methods

##### registerTools()

```ts
registerTools(server: McpServer): void;
```

Defined in: [market-data/crypto-indicators/src/index.ts:133](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/market-data/crypto-indicators/src/index.ts#L133)

Register MCP tools for crypto indicators
Enhanced by Nich for Universal Crypto MCP compatibility

###### Parameters

| Parameter | Type |
| :------ | :------ |
| `server` | `McpServer` |

###### Returns

`void`

***

### TechnicalIndicators

Defined in: [market-data/crypto-indicators/src/index.ts:20](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/market-data/crypto-indicators/src/index.ts#L20)

#### Constructors

##### Constructor

```ts
new TechnicalIndicators(): TechnicalIndicators;
```

###### Returns

[`TechnicalIndicators`](/docs/api/market-data/crypto-indicators/src.md#technicalindicators)

#### Methods

##### calculateBollingerBands()

```ts
calculateBollingerBands(
   data: number[], 
   period: number, 
   stdDev: number): {
  lower: number[];
  middle: number[];
  upper: number[];
};
```

Defined in: [market-data/crypto-indicators/src/index.ts:99](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/market-data/crypto-indicators/src/index.ts#L99)

Calculate Bollinger Bands

###### Parameters

| Parameter | Type | Default value |
| :------ | :------ | :------ |
| `data` | `number`[] | `undefined` |
| `period` | `number` | `20` |
| `stdDev` | `number` | `2` |

###### Returns

```ts
{
  lower: number[];
  middle: number[];
  upper: number[];
}
```

| Name | Type | Default value | Defined in |
| :------ | :------ | :------ | :------ |
| `lower` | `number`[] | - | [market-data/crypto-indicators/src/index.ts:104](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/market-data/crypto-indicators/src/index.ts#L104) |
| `middle` | `number`[] | `sma` | [market-data/crypto-indicators/src/index.ts:103](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/market-data/crypto-indicators/src/index.ts#L103) |
| `upper` | `number`[] | - | [market-data/crypto-indicators/src/index.ts:102](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/market-data/crypto-indicators/src/index.ts#L102) |

###### Source

Original Kukapay implementation

##### calculateEMA()

```ts
calculateEMA(data: number[], period: number): number[];
```

Defined in: [market-data/crypto-indicators/src/index.ts:38](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/market-data/crypto-indicators/src/index.ts#L38)

Calculate Exponential Moving Average (EMA)

###### Parameters

| Parameter | Type |
| :------ | :------ |
| `data` | `number`[] |
| `period` | `number` |

###### Returns

`number`[]

###### Source

Original Kukapay implementation

##### calculateMACD()

```ts
calculateMACD(
   data: number[], 
   fastPeriod: number, 
   slowPeriod: number, 
   signalPeriod: number): {
  histogram: number[];
  macdLine: number[];
  signalLine: number[];
};
```

Defined in: [market-data/crypto-indicators/src/index.ts:84](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/market-data/crypto-indicators/src/index.ts#L84)

Calculate MACD (Moving Average Convergence Divergence)

###### Parameters

| Parameter | Type | Default value |
| :------ | :------ | :------ |
| `data` | `number`[] | `undefined` |
| `fastPeriod` | `number` | `12` |
| `slowPeriod` | `number` | `26` |
| `signalPeriod` | `number` | `9` |

###### Returns

```ts
{
  histogram: number[];
  macdLine: number[];
  signalLine: number[];
}
```

| Name | Type | Defined in |
| :------ | :------ | :------ |
| `histogram` | `number`[] | [market-data/crypto-indicators/src/index.ts:92](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/market-data/crypto-indicators/src/index.ts#L92) |
| `macdLine` | `number`[] | [market-data/crypto-indicators/src/index.ts:92](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/market-data/crypto-indicators/src/index.ts#L92) |
| `signalLine` | `number`[] | [market-data/crypto-indicators/src/index.ts:92](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/market-data/crypto-indicators/src/index.ts#L92) |

###### Source

Original Kukapay implementation

##### calculateRSI()

```ts
calculateRSI(data: number[], period: number): number[];
```

Defined in: [market-data/crypto-indicators/src/index.ts:58](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/market-data/crypto-indicators/src/index.ts#L58)

Calculate Relative Strength Index (RSI)

###### Parameters

| Parameter | Type | Default value |
| :------ | :------ | :------ |
| `data` | `number`[] | `undefined` |
| `period` | `number` | `14` |

###### Returns

`number`[]

###### Source

Original Kukapay implementation

##### calculateSMA()

```ts
calculateSMA(data: number[], period: number): number[];
```

Defined in: [market-data/crypto-indicators/src/index.ts:25](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/market-data/crypto-indicators/src/index.ts#L25)

Calculate Simple Moving Average (SMA)

###### Parameters

| Parameter | Type |
| :------ | :------ |
| `data` | `number`[] |
| `period` | `number` |

###### Returns

`number`[]

###### Source

Original Kukapay implementation

## Functions

### registerCryptoIndicators()

```ts
function registerCryptoIndicators(server: McpServer): void;
```

Defined in: [market-data/crypto-indicators/src/index.ts:237](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/market-data/crypto-indicators/src/index.ts#L237)

#### Parameters

| Parameter | Type |
| :------ | :------ |
| `server` | `McpServer` |

#### Returns

`void`
