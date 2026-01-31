[**Universal Crypto MCP API Reference v1.0.0**](../../index.md)

***

[Universal Crypto MCP API Reference](/docs/api/index.md) / trading/bots/src

# trading/bots/src

## Classes

### TradingBotManager

Defined in: [trading/bots/src/index.ts:142](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/trading/bots/src/index.ts#L142)

#### Constructors

##### Constructor

```ts
new TradingBotManager(config: TradingBotConfig): TradingBotManager;
```

Defined in: [trading/bots/src/index.ts:145](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/trading/bots/src/index.ts#L145)

###### Parameters

| Parameter | Type |
| :------ | :------ |
| `config` | [`TradingBotConfig`](/docs/api/trading/bots/src.md#tradingbotconfig) |

###### Returns

[`TradingBotManager`](/docs/api/trading/bots/src.md#tradingbotmanager)

#### Methods

##### executeTrade()

```ts
executeTrade(params: TradeParams): Promise<any>;
```

Defined in: [trading/bots/src/index.ts:189](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/trading/bots/src/index.ts#L189)

Execute a trade using specified bot
Note: This is a wrapper that calls the original bot implementations

###### Parameters

| Parameter | Type |
| :------ | :------ |
| `params` | [`TradeParams`](/docs/api/trading/bots/src.md#tradeparams) |

###### Returns

`Promise`\<`any`\>

##### getAttributionText()

```ts
getAttributionText(botId: string): string;
```

Defined in: [trading/bots/src/index.ts:215](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/trading/bots/src/index.ts#L215)

Get attribution text for UI display

###### Parameters

| Parameter | Type |
| :------ | :------ |
| `botId` | `string` |

###### Returns

`string`

##### getBotInfo()

```ts
getBotInfo(botId: string): BotMetadata | null;
```

Defined in: [trading/bots/src/index.ts:174](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/trading/bots/src/index.ts#L174)

Get information about a specific bot

###### Parameters

| Parameter | Type |
| :------ | :------ |
| `botId` | `string` |

###### Returns

[`BotMetadata`](/docs/api/trading/bots/src.md#botmetadata) \| `null`

##### listBots()

```ts
listBots(): BotMetadata[];
```

Defined in: [trading/bots/src/index.ts:181](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/trading/bots/src/index.ts#L181)

List all available bots

###### Returns

[`BotMetadata`](/docs/api/trading/bots/src.md#botmetadata)[]

## Interfaces

### BotMetadata

Defined in: [trading/bots/src/index.ts:15](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/trading/bots/src/index.ts#L15)

Universal Trading Bot Manager

Integration Layer for Open Source Trading Bots

#### Maintainer

Nicholas (nirholas)

#### Github

https://github.com/nirholas

#### Twitter

https://x.com/nichxbt

This module provides a unified interface to multiple open-source
crypto trading bots while maintaining proper attribution to all
original authors and projects.

#### Properties

| Property | Type | Defined in |
| :------ | :------ | :------ |
| <a id="description"></a> `description` | `string` | [trading/bots/src/index.ts:22](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/trading/bots/src/index.ts#L22) |
| <a id="github"></a> `github` | `string` | [trading/bots/src/index.ts:21](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/trading/bots/src/index.ts#L21) |
| <a id="license"></a> `license` | `"MIT"` | [trading/bots/src/index.ts:20](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/trading/bots/src/index.ts#L20) |
| <a id="name"></a> `name` | `string` | [trading/bots/src/index.ts:16](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/trading/bots/src/index.ts#L16) |
| <a id="originalauthor"></a> `originalAuthor` | `string` | [trading/bots/src/index.ts:18](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/trading/bots/src/index.ts#L18) |
| <a id="originalproject"></a> `originalProject` | `string` | [trading/bots/src/index.ts:17](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/trading/bots/src/index.ts#L17) |
| <a id="stars"></a> `stars` | `number` | [trading/bots/src/index.ts:19](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/trading/bots/src/index.ts#L19) |

***

### MaintainerInfo

Defined in: [trading/bots/src/index.ts:25](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/trading/bots/src/index.ts#L25)

#### Properties

| Property | Type | Defined in |
| :------ | :------ | :------ |
| <a id="github-1"></a> `github` | `string` | [trading/bots/src/index.ts:27](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/trading/bots/src/index.ts#L27) |
| <a id="name-1"></a> `name` | `string` | [trading/bots/src/index.ts:26](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/trading/bots/src/index.ts#L26) |
| <a id="twitter"></a> `twitter` | `string` | [trading/bots/src/index.ts:28](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/trading/bots/src/index.ts#L28) |

***

### TradeParams

Defined in: [trading/bots/src/index.ts:37](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/trading/bots/src/index.ts#L37)

#### Properties

| Property | Type | Defined in |
| :------ | :------ | :------ |
| <a id="amount"></a> `amount?` | `number` | [trading/bots/src/index.ts:41](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/trading/bots/src/index.ts#L41) |
| <a id="bot"></a> `bot` | `string` | [trading/bots/src/index.ts:38](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/trading/bots/src/index.ts#L38) |
| <a id="pair"></a> `pair` | `string` | [trading/bots/src/index.ts:40](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/trading/bots/src/index.ts#L40) |
| <a id="side"></a> `side?` | `"buy"` \| `"sell"` | [trading/bots/src/index.ts:42](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/trading/bots/src/index.ts#L42) |
| <a id="strategy"></a> `strategy` | `string` | [trading/bots/src/index.ts:39](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/trading/bots/src/index.ts#L39) |

***

### TradingBotConfig

Defined in: [trading/bots/src/index.ts:31](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/trading/bots/src/index.ts#L31)

#### Properties

| Property | Type | Defined in |
| :------ | :------ | :------ |
| <a id="activebot"></a> `activeBot?` | `string` | [trading/bots/src/index.ts:33](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/trading/bots/src/index.ts#L33) |
| <a id="apikeys"></a> `apiKeys?` | `Record`\<`string`, `string`\> | [trading/bots/src/index.ts:34](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/trading/bots/src/index.ts#L34) |
| <a id="maintainer"></a> `maintainer` | [`MaintainerInfo`](/docs/api/trading/bots/src.md#maintainerinfo) | [trading/bots/src/index.ts:32](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/trading/bots/src/index.ts#L32) |

## Variables

### AVAILABLE\_BOTS

```ts
const AVAILABLE_BOTS: Record<string, BotMetadata>;
```

Defined in: [trading/bots/src/index.ts:49](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/trading/bots/src/index.ts#L49)

Available Trading Bots
All bots are MIT licensed and properly attributed

## Functions

### createTradingBotManager()

```ts
function createTradingBotManager(config?: Partial<TradingBotConfig>): TradingBotManager;
```

Defined in: [trading/bots/src/index.ts:226](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/trading/bots/src/index.ts#L226)

#### Parameters

| Parameter | Type |
| :------ | :------ |
| `config?` | `Partial`\<[`TradingBotConfig`](/docs/api/trading/bots/src.md#tradingbotconfig)\> |

#### Returns

[`TradingBotManager`](/docs/api/trading/bots/src.md#tradingbotmanager)

## References

### default

Renames and re-exports [TradingBotManager](/docs/api/trading/bots/src.md#tradingbotmanager)
