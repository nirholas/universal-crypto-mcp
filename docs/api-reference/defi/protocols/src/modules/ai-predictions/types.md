[**Universal Crypto MCP API Reference v1.0.0**](../../../../../index.md)

***

[Universal Crypto MCP API Reference](/docs/api/index.md) / defi/protocols/src/modules/ai-predictions/types

# defi/protocols/src/modules/ai-predictions/types

## Interfaces

### BacktestRequest

Defined in: [defi/protocols/src/modules/ai-predictions/types.ts:172](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/modules/ai-predictions/types.ts#L172)

Backtesting request parameters

#### Properties

| Property | Type | Description | Defined in |
| :------ | :------ | :------ | :------ |
| <a id="asset"></a> `asset` | \| `"BTC"` \| `"ETH"` \| `"SOL"` \| `"ARB"` \| `"AVAX"` \| `"MATIC"` \| `"LINK"` \| `"UNI"` \| `"AAVE"` \| `"OP"` | Asset to backtest | [defi/protocols/src/modules/ai-predictions/types.ts:174](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/modules/ai-predictions/types.ts#L174) |
| <a id="end_date"></a> `end_date` | `string` | End date (ISO format) | [defi/protocols/src/modules/ai-predictions/types.ts:178](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/modules/ai-predictions/types.ts#L178) |
| <a id="parameters"></a> `parameters?` | `Record`\<`string`, `number`\> | Custom strategy parameters | [defi/protocols/src/modules/ai-predictions/types.ts:182](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/modules/ai-predictions/types.ts#L182) |
| <a id="start_date"></a> `start_date` | `string` | Start date (ISO format) | [defi/protocols/src/modules/ai-predictions/types.ts:176](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/modules/ai-predictions/types.ts#L176) |
| <a id="strategy"></a> `strategy` | `"custom"` \| `"momentum"` \| `"mean_reversion"` \| `"trend_following"` | Strategy type | [defi/protocols/src/modules/ai-predictions/types.ts:180](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/modules/ai-predictions/types.ts#L180) |

***

### BacktestResult

Defined in: [defi/protocols/src/modules/ai-predictions/types.ts:188](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/modules/ai-predictions/types.ts#L188)

Backtesting response

#### Properties

| Property | Type | Defined in |
| :------ | :------ | :------ |
| <a id="asset-1"></a> `asset` | \| `"BTC"` \| `"ETH"` \| `"SOL"` \| `"ARB"` \| `"AVAX"` \| `"MATIC"` \| `"LINK"` \| `"UNI"` \| `"AAVE"` \| `"OP"` | [defi/protocols/src/modules/ai-predictions/types.ts:189](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/modules/ai-predictions/types.ts#L189) |
| <a id="comparison"></a> `comparison` | \{ `vs_benchmark`: `number`; `vs_buy_hold`: `number`; \} | [defi/protocols/src/modules/ai-predictions/types.ts:219](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/modules/ai-predictions/types.ts#L219) |
| `comparison.vs_benchmark` | `number` | [defi/protocols/src/modules/ai-predictions/types.ts:221](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/modules/ai-predictions/types.ts#L221) |
| `comparison.vs_buy_hold` | `number` | [defi/protocols/src/modules/ai-predictions/types.ts:220](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/modules/ai-predictions/types.ts#L220) |
| <a id="performance"></a> `performance` | \{ `annualized_return_pct`: `number`; `max_drawdown_pct`: `number`; `profit_factor`: `number`; `sharpe_ratio`: `number`; `sortino_ratio`: `number`; `total_return_pct`: `number`; `win_rate_pct`: `number`; \} | [defi/protocols/src/modules/ai-predictions/types.ts:196](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/modules/ai-predictions/types.ts#L196) |
| `performance.annualized_return_pct` | `number` | [defi/protocols/src/modules/ai-predictions/types.ts:198](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/modules/ai-predictions/types.ts#L198) |
| `performance.max_drawdown_pct` | `number` | [defi/protocols/src/modules/ai-predictions/types.ts:201](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/modules/ai-predictions/types.ts#L201) |
| `performance.profit_factor` | `number` | [defi/protocols/src/modules/ai-predictions/types.ts:203](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/modules/ai-predictions/types.ts#L203) |
| `performance.sharpe_ratio` | `number` | [defi/protocols/src/modules/ai-predictions/types.ts:199](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/modules/ai-predictions/types.ts#L199) |
| `performance.sortino_ratio` | `number` | [defi/protocols/src/modules/ai-predictions/types.ts:200](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/modules/ai-predictions/types.ts#L200) |
| `performance.total_return_pct` | `number` | [defi/protocols/src/modules/ai-predictions/types.ts:197](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/modules/ai-predictions/types.ts#L197) |
| `performance.win_rate_pct` | `number` | [defi/protocols/src/modules/ai-predictions/types.ts:202](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/modules/ai-predictions/types.ts#L202) |
| <a id="period"></a> `period` | \{ `days`: `number`; `end`: `string`; `start`: `string`; \} | [defi/protocols/src/modules/ai-predictions/types.ts:191](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/modules/ai-predictions/types.ts#L191) |
| `period.days` | `number` | [defi/protocols/src/modules/ai-predictions/types.ts:194](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/modules/ai-predictions/types.ts#L194) |
| `period.end` | `string` | [defi/protocols/src/modules/ai-predictions/types.ts:193](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/modules/ai-predictions/types.ts#L193) |
| `period.start` | `string` | [defi/protocols/src/modules/ai-predictions/types.ts:192](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/modules/ai-predictions/types.ts#L192) |
| <a id="risk_metrics"></a> `risk_metrics` | \{ `alpha`: `number`; `beta`: `number`; `cvar_95`: `number`; `var_95`: `number`; `volatility_annual`: `number`; \} | [defi/protocols/src/modules/ai-predictions/types.ts:212](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/modules/ai-predictions/types.ts#L212) |
| `risk_metrics.alpha` | `number` | [defi/protocols/src/modules/ai-predictions/types.ts:217](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/modules/ai-predictions/types.ts#L217) |
| `risk_metrics.beta` | `number` | [defi/protocols/src/modules/ai-predictions/types.ts:216](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/modules/ai-predictions/types.ts#L216) |
| `risk_metrics.cvar_95` | `number` | [defi/protocols/src/modules/ai-predictions/types.ts:215](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/modules/ai-predictions/types.ts#L215) |
| `risk_metrics.var_95` | `number` | [defi/protocols/src/modules/ai-predictions/types.ts:214](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/modules/ai-predictions/types.ts#L214) |
| `risk_metrics.volatility_annual` | `number` | [defi/protocols/src/modules/ai-predictions/types.ts:213](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/modules/ai-predictions/types.ts#L213) |
| <a id="strategy-1"></a> `strategy` | `string` | [defi/protocols/src/modules/ai-predictions/types.ts:190](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/modules/ai-predictions/types.ts#L190) |
| <a id="timestamp"></a> `timestamp` | `string` | [defi/protocols/src/modules/ai-predictions/types.ts:223](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/modules/ai-predictions/types.ts#L223) |
| <a id="trades"></a> `trades` | \{ `average_loss_pct`: `number`; `average_win_pct`: `number`; `losing`: `number`; `total`: `number`; `winning`: `number`; \} | [defi/protocols/src/modules/ai-predictions/types.ts:205](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/modules/ai-predictions/types.ts#L205) |
| `trades.average_loss_pct` | `number` | [defi/protocols/src/modules/ai-predictions/types.ts:210](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/modules/ai-predictions/types.ts#L210) |
| `trades.average_win_pct` | `number` | [defi/protocols/src/modules/ai-predictions/types.ts:209](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/modules/ai-predictions/types.ts#L209) |
| `trades.losing` | `number` | [defi/protocols/src/modules/ai-predictions/types.ts:208](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/modules/ai-predictions/types.ts#L208) |
| `trades.total` | `number` | [defi/protocols/src/modules/ai-predictions/types.ts:206](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/modules/ai-predictions/types.ts#L206) |
| `trades.winning` | `number` | [defi/protocols/src/modules/ai-predictions/types.ts:207](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/modules/ai-predictions/types.ts#L207) |

***

### BulkPredictionRequest

Defined in: [defi/protocols/src/modules/ai-predictions/types.ts:229](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/modules/ai-predictions/types.ts#L229)

Multi-asset prediction request

#### Properties

| Property | Type | Description | Defined in |
| :------ | :------ | :------ | :------ |
| <a id="assets"></a> `assets` | ( \| `"BTC"` \| `"ETH"` \| `"SOL"` \| `"ARB"` \| `"AVAX"` \| `"MATIC"` \| `"LINK"` \| `"UNI"` \| `"AAVE"` \| `"OP"`)[] | Assets to predict | [defi/protocols/src/modules/ai-predictions/types.ts:231](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/modules/ai-predictions/types.ts#L231) |
| <a id="timeframe"></a> `timeframe` | `"1h"` \| `"4h"` \| `"1d"` \| `"1w"` | Prediction timeframe | [defi/protocols/src/modules/ai-predictions/types.ts:233](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/modules/ai-predictions/types.ts#L233) |
| <a id="type"></a> `type` | `"full"` \| `"direction"` \| `"target"` \| `"confidence"` \| `"bulk_per_asset"` | Type of prediction | [defi/protocols/src/modules/ai-predictions/types.ts:235](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/modules/ai-predictions/types.ts#L235) |

***

### BulkPredictionResponse

Defined in: [defi/protocols/src/modules/ai-predictions/types.ts:241](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/modules/ai-predictions/types.ts#L241)

Multi-asset prediction response

#### Properties

| Property | Type | Defined in |
| :------ | :------ | :------ |
| <a id="predictions"></a> `predictions` | `Record`\<[`SupportedAsset`](/docs/api/defi/protocols/src/modules/ai-predictions/types.md#supportedasset), [`PredictionResponse`](/docs/api/defi/protocols/src/modules/ai-predictions/types.md#predictionresponse)\> | [defi/protocols/src/modules/ai-predictions/types.ts:242](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/modules/ai-predictions/types.ts#L242) |
| <a id="timestamp-1"></a> `timestamp` | `string` | [defi/protocols/src/modules/ai-predictions/types.ts:244](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/modules/ai-predictions/types.ts#L244) |
| <a id="total_cost"></a> `total_cost` | `number` | [defi/protocols/src/modules/ai-predictions/types.ts:243](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/modules/ai-predictions/types.ts#L243) |

***

### ConfidencePrediction

Defined in: [defi/protocols/src/modules/ai-predictions/types.ts:109](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/modules/ai-predictions/types.ts#L109)

Confidence score response

#### Properties

| Property | Type | Defined in |
| :------ | :------ | :------ |
| <a id="asset-2"></a> `asset` | \| `"BTC"` \| `"ETH"` \| `"SOL"` \| `"ARB"` \| `"AVAX"` \| `"MATIC"` \| `"LINK"` \| `"UNI"` \| `"AAVE"` \| `"OP"` | [defi/protocols/src/modules/ai-predictions/types.ts:111](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/modules/ai-predictions/types.ts#L111) |
| <a id="confidence"></a> `confidence` | `number` | [defi/protocols/src/modules/ai-predictions/types.ts:113](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/modules/ai-predictions/types.ts#L113) |
| <a id="confidence_breakdown"></a> `confidence_breakdown` | \{ `momentum`: `number`; `technical`: `number`; `volatility`: `number`; `volume`: `number`; \} | [defi/protocols/src/modules/ai-predictions/types.ts:114](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/modules/ai-predictions/types.ts#L114) |
| `confidence_breakdown.momentum` | `number` | [defi/protocols/src/modules/ai-predictions/types.ts:116](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/modules/ai-predictions/types.ts#L116) |
| `confidence_breakdown.technical` | `number` | [defi/protocols/src/modules/ai-predictions/types.ts:115](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/modules/ai-predictions/types.ts#L115) |
| `confidence_breakdown.volatility` | `number` | [defi/protocols/src/modules/ai-predictions/types.ts:117](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/modules/ai-predictions/types.ts#L117) |
| `confidence_breakdown.volume` | `number` | [defi/protocols/src/modules/ai-predictions/types.ts:118](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/modules/ai-predictions/types.ts#L118) |
| <a id="model_version"></a> `model_version` | `string` | [defi/protocols/src/modules/ai-predictions/types.ts:121](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/modules/ai-predictions/types.ts#L121) |
| <a id="timeframe-1"></a> `timeframe` | `"1h"` \| `"4h"` \| `"1d"` \| `"1w"` | [defi/protocols/src/modules/ai-predictions/types.ts:112](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/modules/ai-predictions/types.ts#L112) |
| <a id="timestamp-2"></a> `timestamp` | `string` | [defi/protocols/src/modules/ai-predictions/types.ts:120](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/modules/ai-predictions/types.ts#L120) |
| <a id="type-1"></a> `type` | `"confidence"` | [defi/protocols/src/modules/ai-predictions/types.ts:110](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/modules/ai-predictions/types.ts#L110) |

***

### DirectionPrediction

Defined in: [defi/protocols/src/modules/ai-predictions/types.ts:81](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/modules/ai-predictions/types.ts#L81)

Direction prediction response

#### Properties

| Property | Type | Defined in |
| :------ | :------ | :------ |
| <a id="asset-3"></a> `asset` | \| `"BTC"` \| `"ETH"` \| `"SOL"` \| `"ARB"` \| `"AVAX"` \| `"MATIC"` \| `"LINK"` \| `"UNI"` \| `"AAVE"` \| `"OP"` | [defi/protocols/src/modules/ai-predictions/types.ts:83](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/modules/ai-predictions/types.ts#L83) |
| <a id="direction"></a> `direction` | [`PriceDirection`](/docs/api/defi/protocols/src/modules/ai-predictions/types.md#pricedirection) | [defi/protocols/src/modules/ai-predictions/types.ts:85](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/modules/ai-predictions/types.ts#L85) |
| <a id="model_version-1"></a> `model_version` | `string` | [defi/protocols/src/modules/ai-predictions/types.ts:87](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/modules/ai-predictions/types.ts#L87) |
| <a id="timeframe-2"></a> `timeframe` | `"1h"` \| `"4h"` \| `"1d"` \| `"1w"` | [defi/protocols/src/modules/ai-predictions/types.ts:84](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/modules/ai-predictions/types.ts#L84) |
| <a id="timestamp-3"></a> `timestamp` | `string` | [defi/protocols/src/modules/ai-predictions/types.ts:86](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/modules/ai-predictions/types.ts#L86) |
| <a id="type-2"></a> `type` | `"direction"` | [defi/protocols/src/modules/ai-predictions/types.ts:82](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/modules/ai-predictions/types.ts#L82) |

***

### FullPrediction

Defined in: [defi/protocols/src/modules/ai-predictions/types.ts:127](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/modules/ai-predictions/types.ts#L127)

Full prediction report

#### Properties

| Property | Type | Defined in |
| :------ | :------ | :------ |
| <a id="analysis"></a> `analysis` | \{ `indicators`: \{ `ema_trend`: `"bullish"` \| `"bearish"` \| `"neutral"`; `macd`: \{ `histogram`: `number`; `signal`: `number`; `value`: `number`; \}; `rsi`: `number`; \}; `key_levels`: \{ `pivot`: `number`; `resistance`: `number`[]; `support`: `number`[]; \}; `risk_reward`: \{ `ratio`: `number`; `stop_loss`: `number`; `take_profit`: `number`; \}; `summary`: `string`; \} | [defi/protocols/src/modules/ai-predictions/types.ts:134](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/modules/ai-predictions/types.ts#L134) |
| `analysis.indicators` | \{ `ema_trend`: `"bullish"` \| `"bearish"` \| `"neutral"`; `macd`: \{ `histogram`: `number`; `signal`: `number`; `value`: `number`; \}; `rsi`: `number`; \} | [defi/protocols/src/modules/ai-predictions/types.ts:141](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/modules/ai-predictions/types.ts#L141) |
| `analysis.indicators.ema_trend` | `"bullish"` \| `"bearish"` \| `"neutral"` | [defi/protocols/src/modules/ai-predictions/types.ts:148](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/modules/ai-predictions/types.ts#L148) |
| `analysis.indicators.macd` | \{ `histogram`: `number`; `signal`: `number`; `value`: `number`; \} | [defi/protocols/src/modules/ai-predictions/types.ts:143](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/modules/ai-predictions/types.ts#L143) |
| `analysis.indicators.macd.histogram` | `number` | [defi/protocols/src/modules/ai-predictions/types.ts:146](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/modules/ai-predictions/types.ts#L146) |
| `analysis.indicators.macd.signal` | `number` | [defi/protocols/src/modules/ai-predictions/types.ts:145](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/modules/ai-predictions/types.ts#L145) |
| `analysis.indicators.macd.value` | `number` | [defi/protocols/src/modules/ai-predictions/types.ts:144](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/modules/ai-predictions/types.ts#L144) |
| `analysis.indicators.rsi` | `number` | [defi/protocols/src/modules/ai-predictions/types.ts:142](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/modules/ai-predictions/types.ts#L142) |
| `analysis.key_levels` | \{ `pivot`: `number`; `resistance`: `number`[]; `support`: `number`[]; \} | [defi/protocols/src/modules/ai-predictions/types.ts:136](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/modules/ai-predictions/types.ts#L136) |
| `analysis.key_levels.pivot` | `number` | [defi/protocols/src/modules/ai-predictions/types.ts:139](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/modules/ai-predictions/types.ts#L139) |
| `analysis.key_levels.resistance` | `number`[] | [defi/protocols/src/modules/ai-predictions/types.ts:138](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/modules/ai-predictions/types.ts#L138) |
| `analysis.key_levels.support` | `number`[] | [defi/protocols/src/modules/ai-predictions/types.ts:137](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/modules/ai-predictions/types.ts#L137) |
| `analysis.risk_reward` | \{ `ratio`: `number`; `stop_loss`: `number`; `take_profit`: `number`; \} | [defi/protocols/src/modules/ai-predictions/types.ts:150](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/modules/ai-predictions/types.ts#L150) |
| `analysis.risk_reward.ratio` | `number` | [defi/protocols/src/modules/ai-predictions/types.ts:153](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/modules/ai-predictions/types.ts#L153) |
| `analysis.risk_reward.stop_loss` | `number` | [defi/protocols/src/modules/ai-predictions/types.ts:151](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/modules/ai-predictions/types.ts#L151) |
| `analysis.risk_reward.take_profit` | `number` | [defi/protocols/src/modules/ai-predictions/types.ts:152](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/modules/ai-predictions/types.ts#L152) |
| `analysis.summary` | `string` | [defi/protocols/src/modules/ai-predictions/types.ts:135](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/modules/ai-predictions/types.ts#L135) |
| <a id="asset-4"></a> `asset` | \| `"BTC"` \| `"ETH"` \| `"SOL"` \| `"ARB"` \| `"AVAX"` \| `"MATIC"` \| `"LINK"` \| `"UNI"` \| `"AAVE"` \| `"OP"` | [defi/protocols/src/modules/ai-predictions/types.ts:129](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/modules/ai-predictions/types.ts#L129) |
| <a id="confidence-1"></a> `confidence` | [`ConfidencePrediction`](/docs/api/defi/protocols/src/modules/ai-predictions/types.md#confidenceprediction) | [defi/protocols/src/modules/ai-predictions/types.ts:133](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/modules/ai-predictions/types.ts#L133) |
| <a id="direction-1"></a> `direction` | [`DirectionPrediction`](/docs/api/defi/protocols/src/modules/ai-predictions/types.md#directionprediction) | [defi/protocols/src/modules/ai-predictions/types.ts:131](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/modules/ai-predictions/types.ts#L131) |
| <a id="model_version-2"></a> `model_version` | `string` | [defi/protocols/src/modules/ai-predictions/types.ts:157](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/modules/ai-predictions/types.ts#L157) |
| <a id="target"></a> `target` | [`TargetPrediction`](/docs/api/defi/protocols/src/modules/ai-predictions/types.md#targetprediction) | [defi/protocols/src/modules/ai-predictions/types.ts:132](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/modules/ai-predictions/types.ts#L132) |
| <a id="timeframe-3"></a> `timeframe` | `"1h"` \| `"4h"` \| `"1d"` \| `"1w"` | [defi/protocols/src/modules/ai-predictions/types.ts:130](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/modules/ai-predictions/types.ts#L130) |
| <a id="timestamp-4"></a> `timestamp` | `string` | [defi/protocols/src/modules/ai-predictions/types.ts:156](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/modules/ai-predictions/types.ts#L156) |
| <a id="type-3"></a> `type` | `"full"` | [defi/protocols/src/modules/ai-predictions/types.ts:128](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/modules/ai-predictions/types.ts#L128) |

***

### MaaSSubscription

Defined in: [defi/protocols/src/modules/ai-predictions/types.ts:250](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/modules/ai-predictions/types.ts#L250)

Model-as-a-Service subscription

#### Properties

| Property | Type | Defined in |
| :------ | :------ | :------ |
| <a id="api_key"></a> `api_key` | `string` | [defi/protocols/src/modules/ai-predictions/types.ts:264](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/modules/ai-predictions/types.ts#L264) |
| <a id="created_at"></a> `created_at` | `string` | [defi/protocols/src/modules/ai-predictions/types.ts:255](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/modules/ai-predictions/types.ts#L255) |
| <a id="endpoint"></a> `endpoint` | `string` | [defi/protocols/src/modules/ai-predictions/types.ts:265](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/modules/ai-predictions/types.ts#L265) |
| <a id="expires_at"></a> `expires_at` | `string` | [defi/protocols/src/modules/ai-predictions/types.ts:256](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/modules/ai-predictions/types.ts#L256) |
| <a id="features"></a> `features` | \{ `api_access`: `boolean`; `custom_assets`: `number`; `custom_training`: `boolean`; `priority_inference`: `boolean`; `private_instance`: `boolean`; \} | [defi/protocols/src/modules/ai-predictions/types.ts:257](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/modules/ai-predictions/types.ts#L257) |
| `features.api_access` | `boolean` | [defi/protocols/src/modules/ai-predictions/types.ts:260](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/modules/ai-predictions/types.ts#L260) |
| `features.custom_assets` | `number` | [defi/protocols/src/modules/ai-predictions/types.ts:262](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/modules/ai-predictions/types.ts#L262) |
| `features.custom_training` | `boolean` | [defi/protocols/src/modules/ai-predictions/types.ts:258](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/modules/ai-predictions/types.ts#L258) |
| `features.priority_inference` | `boolean` | [defi/protocols/src/modules/ai-predictions/types.ts:261](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/modules/ai-predictions/types.ts#L261) |
| `features.private_instance` | `boolean` | [defi/protocols/src/modules/ai-predictions/types.ts:259](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/modules/ai-predictions/types.ts#L259) |
| <a id="model_id"></a> `model_id` | `string` | [defi/protocols/src/modules/ai-predictions/types.ts:254](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/modules/ai-predictions/types.ts#L254) |
| <a id="status"></a> `status` | `"pending"` \| `"expired"` \| `"cancelled"` \| `"active"` | [defi/protocols/src/modules/ai-predictions/types.ts:253](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/modules/ai-predictions/types.ts#L253) |
| <a id="subscription_id"></a> `subscription_id` | `string` | [defi/protocols/src/modules/ai-predictions/types.ts:251](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/modules/ai-predictions/types.ts#L251) |
| <a id="user_id"></a> `user_id` | `string` | [defi/protocols/src/modules/ai-predictions/types.ts:252](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/modules/ai-predictions/types.ts#L252) |

***

### PaymentReceipt

Defined in: [defi/protocols/src/modules/ai-predictions/types.ts:271](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/modules/ai-predictions/types.ts#L271)

Payment receipt for predictions

#### Properties

| Property | Type | Defined in |
| :------ | :------ | :------ |
| <a id="amount"></a> `amount` | `string` | [defi/protocols/src/modules/ai-predictions/types.ts:273](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/modules/ai-predictions/types.ts#L273) |
| <a id="asset-5"></a> `asset?` | \| `"BTC"` \| `"ETH"` \| `"SOL"` \| `"ARB"` \| `"AVAX"` \| `"MATIC"` \| `"LINK"` \| `"UNI"` \| `"AAVE"` \| `"OP"` | [defi/protocols/src/modules/ai-predictions/types.ts:278](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/modules/ai-predictions/types.ts#L278) |
| <a id="network"></a> `network` | `string` | [defi/protocols/src/modules/ai-predictions/types.ts:275](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/modules/ai-predictions/types.ts#L275) |
| <a id="prediction_type"></a> `prediction_type` | \| `"full"` \| `"direction"` \| `"target"` \| `"confidence"` \| `"backtest"` \| `"bulk_per_asset"` \| `"maas_monthly"` | [defi/protocols/src/modules/ai-predictions/types.ts:277](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/modules/ai-predictions/types.ts#L277) |
| <a id="timestamp-5"></a> `timestamp` | `string` | [defi/protocols/src/modules/ai-predictions/types.ts:276](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/modules/ai-predictions/types.ts#L276) |
| <a id="token"></a> `token` | `string` | [defi/protocols/src/modules/ai-predictions/types.ts:274](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/modules/ai-predictions/types.ts#L274) |
| <a id="transaction_hash"></a> `transaction_hash` | `string` | [defi/protocols/src/modules/ai-predictions/types.ts:272](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/modules/ai-predictions/types.ts#L272) |

***

### PredictionRequest

Defined in: [defi/protocols/src/modules/ai-predictions/types.ts:69](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/modules/ai-predictions/types.ts#L69)

Prediction request parameters

#### Properties

| Property | Type | Description | Defined in |
| :------ | :------ | :------ | :------ |
| <a id="asset-6"></a> `asset` | \| `"BTC"` \| `"ETH"` \| `"SOL"` \| `"ARB"` \| `"AVAX"` \| `"MATIC"` \| `"LINK"` \| `"UNI"` \| `"AAVE"` \| `"OP"` | Asset to predict | [defi/protocols/src/modules/ai-predictions/types.ts:71](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/modules/ai-predictions/types.ts#L71) |
| <a id="timeframe-4"></a> `timeframe` | `"1h"` \| `"4h"` \| `"1d"` \| `"1w"` | Prediction timeframe | [defi/protocols/src/modules/ai-predictions/types.ts:73](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/modules/ai-predictions/types.ts#L73) |
| <a id="type-4"></a> `type` | \| `"full"` \| `"direction"` \| `"target"` \| `"confidence"` \| `"backtest"` \| `"bulk_per_asset"` \| `"maas_monthly"` | Type of prediction | [defi/protocols/src/modules/ai-predictions/types.ts:75](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/modules/ai-predictions/types.ts#L75) |

***

### TargetPrediction

Defined in: [defi/protocols/src/modules/ai-predictions/types.ts:93](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/modules/ai-predictions/types.ts#L93)

Price target prediction response

#### Properties

| Property | Type | Defined in |
| :------ | :------ | :------ |
| <a id="asset-7"></a> `asset` | \| `"BTC"` \| `"ETH"` \| `"SOL"` \| `"ARB"` \| `"AVAX"` \| `"MATIC"` \| `"LINK"` \| `"UNI"` \| `"AAVE"` \| `"OP"` | [defi/protocols/src/modules/ai-predictions/types.ts:95](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/modules/ai-predictions/types.ts#L95) |
| <a id="current_price"></a> `current_price` | `number` | [defi/protocols/src/modules/ai-predictions/types.ts:97](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/modules/ai-predictions/types.ts#L97) |
| <a id="model_version-3"></a> `model_version` | `string` | [defi/protocols/src/modules/ai-predictions/types.ts:103](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/modules/ai-predictions/types.ts#L103) |
| <a id="predicted_price"></a> `predicted_price` | `number` | [defi/protocols/src/modules/ai-predictions/types.ts:98](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/modules/ai-predictions/types.ts#L98) |
| <a id="price_change_pct"></a> `price_change_pct` | `number` | [defi/protocols/src/modules/ai-predictions/types.ts:99](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/modules/ai-predictions/types.ts#L99) |
| <a id="resistance_levels"></a> `resistance_levels` | `number`[] | [defi/protocols/src/modules/ai-predictions/types.ts:101](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/modules/ai-predictions/types.ts#L101) |
| <a id="support_levels"></a> `support_levels` | `number`[] | [defi/protocols/src/modules/ai-predictions/types.ts:100](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/modules/ai-predictions/types.ts#L100) |
| <a id="timeframe-5"></a> `timeframe` | `"1h"` \| `"4h"` \| `"1d"` \| `"1w"` | [defi/protocols/src/modules/ai-predictions/types.ts:96](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/modules/ai-predictions/types.ts#L96) |
| <a id="timestamp-6"></a> `timestamp` | `string` | [defi/protocols/src/modules/ai-predictions/types.ts:102](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/modules/ai-predictions/types.ts#L102) |
| <a id="type-5"></a> `type` | `"target"` | [defi/protocols/src/modules/ai-predictions/types.ts:94](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/modules/ai-predictions/types.ts#L94) |

## Type Aliases

### PredictionResponse

```ts
type PredictionResponse = 
  | DirectionPrediction
  | TargetPrediction
  | ConfidencePrediction
  | FullPrediction;
```

Defined in: [defi/protocols/src/modules/ai-predictions/types.ts:163](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/modules/ai-predictions/types.ts#L163)

Union type for all prediction responses

***

### PredictionType

```ts
type PredictionType = keyof typeof PREDICTION_PRICING;
```

Defined in: [defi/protocols/src/modules/ai-predictions/types.ts:57](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/modules/ai-predictions/types.ts#L57)

***

### PriceDirection

```ts
type PriceDirection = "bullish" | "bearish" | "sideways";
```

Defined in: [defi/protocols/src/modules/ai-predictions/types.ts:64](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/modules/ai-predictions/types.ts#L64)

Direction prediction result

***

### SupportedAsset

```ts
type SupportedAsset = typeof SUPPORTED_ASSETS[number];
```

Defined in: [defi/protocols/src/modules/ai-predictions/types.ts:58](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/modules/ai-predictions/types.ts#L58)

***

### Timeframe

```ts
type Timeframe = typeof TIMEFRAMES[number];
```

Defined in: [defi/protocols/src/modules/ai-predictions/types.ts:59](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/modules/ai-predictions/types.ts#L59)

## Variables

### PREDICTION\_PRICING

```ts
const PREDICTION_PRICING: {
  backtest: 0.5;
  bulk_per_asset: 0.01;
  confidence: 0.02;
  direction: 0.01;
  full: 0.1;
  maas_monthly: 10;
  target: 0.05;
};
```

Defined in: [defi/protocols/src/modules/ai-predictions/types.ts:15](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/modules/ai-predictions/types.ts#L15)

Prediction product pricing in USD

#### Type Declaration

| Name | Type | Default value | Description | Defined in |
| :------ | :------ | :------ | :------ | :------ |
| <a id="backtest"></a> `backtest` | `0.5` | `0.50` | Backtesting service | [defi/protocols/src/modules/ai-predictions/types.ts:25](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/modules/ai-predictions/types.ts#L25) |
| <a id="bulk_per_asset"></a> `bulk_per_asset` | `0.01` | `0.01` | Multi-asset bulk (per asset) | [defi/protocols/src/modules/ai-predictions/types.ts:27](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/modules/ai-predictions/types.ts#L27) |
| <a id="confidence-2"></a> `confidence` | `0.02` | `0.02` | Model confidence score | [defi/protocols/src/modules/ai-predictions/types.ts:21](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/modules/ai-predictions/types.ts#L21) |
| <a id="direction-2"></a> `direction` | `0.01` | `0.01` | Up/Down/Sideways prediction | [defi/protocols/src/modules/ai-predictions/types.ts:17](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/modules/ai-predictions/types.ts#L17) |
| <a id="full"></a> `full` | `0.1` | `0.10` | Full report with analysis | [defi/protocols/src/modules/ai-predictions/types.ts:23](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/modules/ai-predictions/types.ts#L23) |
| <a id="maas_monthly"></a> `maas_monthly` | `10` | `10.00` | Model-as-a-Service monthly | [defi/protocols/src/modules/ai-predictions/types.ts:29](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/modules/ai-predictions/types.ts#L29) |
| <a id="target-1"></a> `target` | `0.05` | `0.05` | Specific price target | [defi/protocols/src/modules/ai-predictions/types.ts:19](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/modules/ai-predictions/types.ts#L19) |

***

### SUPPORTED\_ASSETS

```ts
const SUPPORTED_ASSETS: readonly ["BTC", "ETH", "SOL", "ARB", "AVAX", "MATIC", "LINK", "UNI", "AAVE", "OP"];
```

Defined in: [defi/protocols/src/modules/ai-predictions/types.ts:35](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/modules/ai-predictions/types.ts#L35)

Supported cryptocurrency assets

***

### TIMEFRAMES

```ts
const TIMEFRAMES: readonly ["1h", "4h", "1d", "1w"];
```

Defined in: [defi/protocols/src/modules/ai-predictions/types.ts:51](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/modules/ai-predictions/types.ts#L51)

Prediction timeframes
