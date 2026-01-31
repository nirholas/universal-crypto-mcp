[**Universal Crypto MCP API Reference v1.0.0**](../../../../../index.md)

***

[Universal Crypto MCP API Reference](/docs/api/index.md) / defi/protocols/src/modules/news/client

# defi/protocols/src/modules/news/client

## Classes

### NewsClient

Defined in: [defi/protocols/src/modules/news/client.ts:202](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/modules/news/client.ts#L202)

Unified crypto news client with free and premium features

#### Constructors

##### Constructor

```ts
new NewsClient(config: NewsClientConfig): NewsClient;
```

Defined in: [defi/protocols/src/modules/news/client.ts:208](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/modules/news/client.ts#L208)

###### Parameters

| Parameter | Type |
| :------ | :------ |
| `config` | [`NewsClientConfig`](/docs/api/defi/protocols/src/modules/news/client.md#newsclientconfig) |

###### Returns

[`NewsClient`](/docs/api/defi/protocols/src/modules/news/client.md#newsclient)

#### Accessors

##### isPremiumEnabled

###### Get Signature

```ts
get isPremiumEnabled(): boolean;
```

Defined in: [defi/protocols/src/modules/news/client.ts:371](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/modules/news/client.ts#L371)

Check if premium features are enabled

###### Returns

`boolean`

#### Methods

##### analyzeImpact()

```ts
analyzeImpact(articleIdOrUrl: string, targetCoins?: string[]): Promise<{
  article: {
     source: string;
     title: string;
  };
  impactAnalysis: {
     affectedCoins: {
        impact: "neutral" | "positive" | "negative";
        magnitude: number;
        reasoning: string;
        symbol: string;
     }[];
     confidence: number;
     marketFactors: string[];
     overallImpact: "low" | "medium" | "high";
     riskFactors: string[];
     sentiment: "bullish" | "bearish" | "neutral";
     timeframe: string;
  };
}>;
```

Defined in: [defi/protocols/src/modules/news/client.ts:559](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/modules/news/client.ts#L559)

Analyze news impact on prices ($0.001/request)

###### Parameters

| Parameter | Type | Description |
| :------ | :------ | :------ |
| `articleIdOrUrl` | `string` | Article ID or URL |
| `targetCoins?` | `string`[] | Optional specific coins to analyze |

###### Returns

`Promise`\<\{
  `article`: \{
     `source`: `string`;
     `title`: `string`;
  \};
  `impactAnalysis`: \{
     `affectedCoins`: \{
        `impact`: `"neutral"` \| `"positive"` \| `"negative"`;
        `magnitude`: `number`;
        `reasoning`: `string`;
        `symbol`: `string`;
     \}[];
     `confidence`: `number`;
     `marketFactors`: `string`[];
     `overallImpact`: `"low"` \| `"medium"` \| `"high"`;
     `riskFactors`: `string`[];
     `sentiment`: `"bullish"` \| `"bearish"` \| `"neutral"`;
     `timeframe`: `string`;
  \};
\}\>

##### batchSummarize()

```ts
batchSummarize(articleIds: string[]): Promise<{
  summaries: ArticleSummary[];
}>;
```

Defined in: [defi/protocols/src/modules/news/client.ts:422](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/modules/news/client.ts#L422)

Batch summarize multiple articles ($0.001/article)

###### Parameters

| Parameter | Type | Description |
| :------ | :------ | :------ |
| `articleIds` | `string`[] | Array of article IDs |

###### Returns

`Promise`\<\{
  `summaries`: [`ArticleSummary`](/docs/api/defi/protocols/src/modules/news/client.md#articlesummary)[];
\}\>

##### configureAlerts()

```ts
configureAlerts(config: AlertConfig, duration: "1day" | "7days" | "30days"): Promise<AlertSubscription>;
```

Defined in: [defi/protocols/src/modules/news/client.ts:438](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/modules/news/client.ts#L438)

Configure breaking news alerts ($0.05/day)

###### Parameters

| Parameter | Type | Default value | Description |
| :------ | :------ | :------ | :------ |
| `config` | [`AlertConfig`](/docs/api/defi/protocols/src/modules/news/client.md#alertconfig) | `undefined` | Alert configuration |
| `duration` | `"1day"` \| `"7days"` \| `"30days"` | `"1day"` | Alert duration |

###### Returns

`Promise`\<[`AlertSubscription`](/docs/api/defi/protocols/src/modules/news/client.md#alertsubscription)\>

##### createCustomFeed()

```ts
createCustomFeed(config: CustomFeedConfig): Promise<CustomFeed>;
```

Defined in: [defi/protocols/src/modules/news/client.ts:509](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/modules/news/client.ts#L509)

Create a custom feed ($0.50/month)

###### Parameters

| Parameter | Type | Description |
| :------ | :------ | :------ |
| `config` | [`CustomFeedConfig`](/docs/api/defi/protocols/src/modules/news/client.md#customfeedconfig-1) | Feed configuration |

###### Returns

`Promise`\<[`CustomFeed`](/docs/api/defi/protocols/src/modules/news/client.md#customfeed)\>

##### export()

```ts
export(options: {
  endDate: string;
  format: "csv" | "json";
  keywords?: string;
  maxRecords?: number;
  sources?: string[];
  startDate: string;
}): Promise<{
  downloadUrl: string;
  expiresAt: string;
  recordCount: number;
}>;
```

Defined in: [defi/protocols/src/modules/news/client.ts:483](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/modules/news/client.ts#L483)

Export news data ($0.02/request)

###### Parameters

| Parameter | Type | Description |
| :------ | :------ | :------ |
| `options` | \{ `endDate`: `string`; `format`: `"csv"` \| `"json"`; `keywords?`: `string`; `maxRecords?`: `number`; `sources?`: `string`[]; `startDate`: `string`; \} | Export options |
| `options.endDate` | `string` | - |
| `options.format` | `"csv"` \| `"json"` | - |
| `options.keywords?` | `string` | - |
| `options.maxRecords?` | `number` | - |
| `options.sources?` | `string`[] | - |
| `options.startDate` | `string` | - |

###### Returns

`Promise`\<\{
  `downloadUrl`: `string`;
  `expiresAt`: `string`;
  `recordCount`: `number`;
\}\>

##### getBitcoinNews()

```ts
getBitcoinNews(limit: number): Promise<NewsResponse>;
```

Defined in: [defi/protocols/src/modules/news/client.ts:338](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/modules/news/client.ts#L338)

Get Bitcoin-specific news (FREE)

###### Parameters

| Parameter | Type | Default value |
| :------ | :------ | :------ |
| `limit` | `number` | `10` |

###### Returns

`Promise`\<[`NewsResponse`](/docs/api/defi/protocols/src/modules/news/client.md#newsresponse)\>

##### getBreaking()

```ts
getBreaking(limit: number): Promise<NewsResponse>;
```

Defined in: [defi/protocols/src/modules/news/client.ts:345](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/modules/news/client.ts#L345)

Get breaking news from last 2 hours (FREE)

###### Parameters

| Parameter | Type | Default value |
| :------ | :------ | :------ |
| `limit` | `number` | `5` |

###### Returns

`Promise`\<[`NewsResponse`](/docs/api/defi/protocols/src/modules/news/client.md#newsresponse)\>

##### getDeFiNews()

```ts
getDeFiNews(limit: number): Promise<NewsResponse>;
```

Defined in: [defi/protocols/src/modules/news/client.ts:331](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/modules/news/client.ts#L331)

Get DeFi-specific news (FREE)

###### Parameters

| Parameter | Type | Default value |
| :------ | :------ | :------ |
| `limit` | `number` | `10` |

###### Returns

`Promise`\<[`NewsResponse`](/docs/api/defi/protocols/src/modules/news/client.md#newsresponse)\>

##### getLatest()

```ts
getLatest(options: {
  limit?: number;
  source?: string;
}): Promise<NewsResponse>;
```

Defined in: [defi/protocols/src/modules/news/client.ts:305](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/modules/news/client.ts#L305)

Get latest crypto news (FREE)

###### Parameters

| Parameter | Type | Description |
| :------ | :------ | :------ |
| `options` | \{ `limit?`: `number`; `source?`: `string`; \} | Filter options |
| `options.limit?` | `number` | - |
| `options.source?` | `string` | - |

###### Returns

`Promise`\<[`NewsResponse`](/docs/api/defi/protocols/src/modules/news/client.md#newsresponse)\>

##### getSources()

```ts
getSources(): Promise<{
  sources: {
     category: string;
     key: string;
     name: string;
     status: "active" | "unavailable";
     url: string;
  }[];
}>;
```

Defined in: [defi/protocols/src/modules/news/client.ts:352](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/modules/news/client.ts#L352)

Get list of news sources (FREE)

###### Returns

`Promise`\<\{
  `sources`: \{
     `category`: `string`;
     `key`: `string`;
     `name`: `string`;
     `status`: `"active"` \| `"unavailable"`;
     `url`: `string`;
  \}[];
\}\>

##### getStatus()

```ts
getStatus(): Promise<PremiumStatus>;
```

Defined in: [defi/protocols/src/modules/news/client.ts:523](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/modules/news/client.ts#L523)

Get premium status and active subscriptions

###### Returns

`Promise`\<[`PremiumStatus`](/docs/api/defi/protocols/src/modules/news/client.md#premiumstatus)\>

##### search()

```ts
search(keywords: string, limit: number): Promise<NewsResponse>;
```

Defined in: [defi/protocols/src/modules/news/client.ts:324](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/modules/news/client.ts#L324)

Search news by keywords (FREE)

###### Parameters

| Parameter | Type | Default value | Description |
| :------ | :------ | :------ | :------ |
| `keywords` | `string` | `undefined` | Search keywords (comma-separated) |
| `limit` | `number` | `10` | Max results |

###### Returns

`Promise`\<[`NewsResponse`](/docs/api/defi/protocols/src/modules/news/client.md#newsresponse)\>

##### searchHistorical()

```ts
searchHistorical(options: HistoricalSearchOptions): Promise<HistoricalSearchResult>;
```

Defined in: [defi/protocols/src/modules/news/client.ts:458](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/modules/news/client.ts#L458)

Search historical news archive ($0.01/query)

###### Parameters

| Parameter | Type | Description |
| :------ | :------ | :------ |
| `options` | [`HistoricalSearchOptions`](/docs/api/defi/protocols/src/modules/news/client.md#historicalsearchoptions) | Search options |

###### Returns

`Promise`\<[`HistoricalSearchResult`](/docs/api/defi/protocols/src/modules/news/client.md#historicalsearchresult)\>

##### subscribe()

```ts
subscribe(type: "firehose", options: {
  duration?: "1day" | "7days" | "30days";
  sources?: string[];
}): Promise<FirehoseSubscription>;
```

Defined in: [defi/protocols/src/modules/news/client.ts:379](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/modules/news/client.ts#L379)

Subscribe to real-time news firehose ($0.10/day)

###### Parameters

| Parameter | Type | Description |
| :------ | :------ | :------ |
| `type` | `"firehose"` | - |
| `options` | \{ `duration?`: `"1day"` \| `"7days"` \| `"30days"`; `sources?`: `string`[]; \} | Subscription options |
| `options.duration?` | `"1day"` \| `"7days"` \| `"30days"` | - |
| `options.sources?` | `string`[] | - |

###### Returns

`Promise`\<[`FirehoseSubscription`](/docs/api/defi/protocols/src/modules/news/client.md#firehosesubscription)\>

##### summarize()

```ts
summarize(articleIdOrUrl: string): Promise<ArticleSummary>;
```

Defined in: [defi/protocols/src/modules/news/client.ts:406](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/modules/news/client.ts#L406)

Get AI summary of an article ($0.001/request)

###### Parameters

| Parameter | Type | Description |
| :------ | :------ | :------ |
| `articleIdOrUrl` | `string` | Article ID or URL |

###### Returns

`Promise`\<[`ArticleSummary`](/docs/api/defi/protocols/src/modules/news/client.md#articlesummary)\>

## Interfaces

### AlertConfig

Defined in: [defi/protocols/src/modules/news/client.ts:109](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/modules/news/client.ts#L109)

Alert configuration

#### Properties

| Property | Type | Defined in |
| :------ | :------ | :------ |
| <a id="channels"></a> `channels` | \{ `discord?`: `string`; `sms?`: `string`; `telegram?`: `string`; `webhook?`: `string`; \} | [defi/protocols/src/modules/news/client.ts:113](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/modules/news/client.ts#L113) |
| `channels.discord?` | `string` | [defi/protocols/src/modules/news/client.ts:114](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/modules/news/client.ts#L114) |
| `channels.sms?` | `string` | [defi/protocols/src/modules/news/client.ts:116](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/modules/news/client.ts#L116) |
| `channels.telegram?` | `string` | [defi/protocols/src/modules/news/client.ts:115](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/modules/news/client.ts#L115) |
| `channels.webhook?` | `string` | [defi/protocols/src/modules/news/client.ts:117](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/modules/news/client.ts#L117) |
| <a id="coins"></a> `coins?` | `string`[] | [defi/protocols/src/modules/news/client.ts:111](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/modules/news/client.ts#L111) |
| <a id="keywords"></a> `keywords?` | `string`[] | [defi/protocols/src/modules/news/client.ts:110](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/modules/news/client.ts#L110) |
| <a id="sources"></a> `sources?` | `string`[] | [defi/protocols/src/modules/news/client.ts:112](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/modules/news/client.ts#L112) |

***

### AlertSubscription

Defined in: [defi/protocols/src/modules/news/client.ts:122](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/modules/news/client.ts#L122)

Alert subscription

#### Properties

| Property | Type | Defined in |
| :------ | :------ | :------ |
| <a id="alertid"></a> `alertId` | `string` | [defi/protocols/src/modules/news/client.ts:123](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/modules/news/client.ts#L123) |
| <a id="config"></a> `config` | [`AlertConfig`](/docs/api/defi/protocols/src/modules/news/client.md#alertconfig) | [defi/protocols/src/modules/news/client.ts:126](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/modules/news/client.ts#L126) |
| <a id="expiresat"></a> `expiresAt` | `string` | [defi/protocols/src/modules/news/client.ts:125](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/modules/news/client.ts#L125) |
| <a id="status"></a> `status` | `"active"` \| `"paused"` | [defi/protocols/src/modules/news/client.ts:124](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/modules/news/client.ts#L124) |

***

### ArticleSummary

Defined in: [defi/protocols/src/modules/news/client.ts:79](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/modules/news/client.ts#L79)

AI-generated article summary

#### Properties

| Property | Type | Defined in |
| :------ | :------ | :------ |
| <a id="articleid"></a> `articleId` | `string` | [defi/protocols/src/modules/news/client.ts:80](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/modules/news/client.ts#L80) |
| <a id="entities"></a> `entities` | \{ `coins`: `string`[]; `companies`: `string`[]; `people`: `string`[]; \} | [defi/protocols/src/modules/news/client.ts:90](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/modules/news/client.ts#L90) |
| `entities.coins` | `string`[] | [defi/protocols/src/modules/news/client.ts:91](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/modules/news/client.ts#L91) |
| `entities.companies` | `string`[] | [defi/protocols/src/modules/news/client.ts:92](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/modules/news/client.ts#L92) |
| `entities.people` | `string`[] | [defi/protocols/src/modules/news/client.ts:93](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/modules/news/client.ts#L93) |
| <a id="generatedat"></a> `generatedAt` | `string` | [defi/protocols/src/modules/news/client.ts:96](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/modules/news/client.ts#L96) |
| <a id="keypoints"></a> `keyPoints` | `string`[] | [defi/protocols/src/modules/news/client.ts:83](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/modules/news/client.ts#L83) |
| <a id="readingtime"></a> `readingTime` | `string` | [defi/protocols/src/modules/news/client.ts:95](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/modules/news/client.ts#L95) |
| <a id="sentiment"></a> `sentiment` | \{ `confidence`: `number`; `label`: `"bullish"` \| `"bearish"` \| `"neutral"`; `score`: `number`; \} | [defi/protocols/src/modules/news/client.ts:84](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/modules/news/client.ts#L84) |
| `sentiment.confidence` | `number` | [defi/protocols/src/modules/news/client.ts:87](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/modules/news/client.ts#L87) |
| `sentiment.label` | `"bullish"` \| `"bearish"` \| `"neutral"` | [defi/protocols/src/modules/news/client.ts:86](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/modules/news/client.ts#L86) |
| `sentiment.score` | `number` | [defi/protocols/src/modules/news/client.ts:85](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/modules/news/client.ts#L85) |
| <a id="summary"></a> `summary` | `string` | [defi/protocols/src/modules/news/client.ts:82](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/modules/news/client.ts#L82) |
| <a id="title"></a> `title` | `string` | [defi/protocols/src/modules/news/client.ts:81](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/modules/news/client.ts#L81) |
| <a id="topics"></a> `topics` | `string`[] | [defi/protocols/src/modules/news/client.ts:89](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/modules/news/client.ts#L89) |

***

### CustomFeed

Defined in: [defi/protocols/src/modules/news/client.ts:141](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/modules/news/client.ts#L141)

Custom feed response

#### Properties

| Property | Type | Defined in |
| :------ | :------ | :------ |
| <a id="atomurl"></a> `atomUrl` | `string` | [defi/protocols/src/modules/news/client.ts:145](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/modules/news/client.ts#L145) |
| <a id="config-1"></a> `config` | [`CustomFeedConfig`](/docs/api/defi/protocols/src/modules/news/client.md#customfeedconfig-1) | [defi/protocols/src/modules/news/client.ts:148](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/modules/news/client.ts#L148) |
| <a id="endpoint"></a> `endpoint` | `string` | [defi/protocols/src/modules/news/client.ts:143](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/modules/news/client.ts#L143) |
| <a id="expiresat-1"></a> `expiresAt` | `string` | [defi/protocols/src/modules/news/client.ts:147](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/modules/news/client.ts#L147) |
| <a id="feedid"></a> `feedId` | `string` | [defi/protocols/src/modules/news/client.ts:142](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/modules/news/client.ts#L142) |
| <a id="jsonurl"></a> `jsonUrl` | `string` | [defi/protocols/src/modules/news/client.ts:146](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/modules/news/client.ts#L146) |
| <a id="rssurl"></a> `rssUrl` | `string` | [defi/protocols/src/modules/news/client.ts:144](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/modules/news/client.ts#L144) |

***

### CustomFeedConfig

Defined in: [defi/protocols/src/modules/news/client.ts:130](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/modules/news/client.ts#L130)

Custom feed configuration

#### Indexable

```ts
[key: string]: unknown
```

#### Properties

| Property | Type | Defined in |
| :------ | :------ | :------ |
| <a id="deduplicate"></a> `deduplicate?` | `boolean` | [defi/protocols/src/modules/news/client.ts:136](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/modules/news/client.ts#L136) |
| <a id="excludekeywords"></a> `excludeKeywords?` | `string`[] | [defi/protocols/src/modules/news/client.ts:134](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/modules/news/client.ts#L134) |
| <a id="keywords-1"></a> `keywords` | `string`[] | [defi/protocols/src/modules/news/client.ts:132](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/modules/news/client.ts#L132) |
| <a id="minrelevancescore"></a> `minRelevanceScore?` | `number` | [defi/protocols/src/modules/news/client.ts:135](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/modules/news/client.ts#L135) |
| <a id="name"></a> `name` | `string` | [defi/protocols/src/modules/news/client.ts:131](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/modules/news/client.ts#L131) |
| <a id="sources-1"></a> `sources?` | `string`[] | [defi/protocols/src/modules/news/client.ts:133](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/modules/news/client.ts#L133) |

***

### FirehoseSubscription

Defined in: [defi/protocols/src/modules/news/client.ts:100](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/modules/news/client.ts#L100)

Firehose subscription details

#### Properties

| Property | Type | Defined in |
| :------ | :------ | :------ |
| <a id="expiresat-2"></a> `expiresAt` | `string` | [defi/protocols/src/modules/news/client.ts:104](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/modules/news/client.ts#L104) |
| <a id="sources-2"></a> `sources` | `string`[] | [defi/protocols/src/modules/news/client.ts:105](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/modules/news/client.ts#L105) |
| <a id="status-1"></a> `status` | `"pending"` \| `"expired"` \| `"active"` | [defi/protocols/src/modules/news/client.ts:102](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/modules/news/client.ts#L102) |
| <a id="subscriptionid"></a> `subscriptionId` | `string` | [defi/protocols/src/modules/news/client.ts:101](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/modules/news/client.ts#L101) |
| <a id="websocketurl"></a> `websocketUrl` | `string` | [defi/protocols/src/modules/news/client.ts:103](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/modules/news/client.ts#L103) |

***

### HistoricalSearchOptions

Defined in: [defi/protocols/src/modules/news/client.ts:152](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/modules/news/client.ts#L152)

Historical search options

#### Properties

| Property | Type | Defined in |
| :------ | :------ | :------ |
| <a id="coins-1"></a> `coins?` | `string`[] | [defi/protocols/src/modules/news/client.ts:157](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/modules/news/client.ts#L157) |
| <a id="enddate"></a> `endDate?` | `string` | [defi/protocols/src/modules/news/client.ts:155](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/modules/news/client.ts#L155) |
| <a id="keywords-2"></a> `keywords?` | `string` | [defi/protocols/src/modules/news/client.ts:153](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/modules/news/client.ts#L153) |
| <a id="page"></a> `page?` | `number` | [defi/protocols/src/modules/news/client.ts:160](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/modules/news/client.ts#L160) |
| <a id="perpage"></a> `perPage?` | `number` | [defi/protocols/src/modules/news/client.ts:161](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/modules/news/client.ts#L161) |
| <a id="sentiment-1"></a> `sentiment?` | `"all"` \| `"bullish"` \| `"bearish"` \| `"neutral"` | [defi/protocols/src/modules/news/client.ts:158](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/modules/news/client.ts#L158) |
| <a id="sortby"></a> `sortBy?` | `"relevance"` \| `"date_desc"` \| `"date_asc"` \| `"sentiment"` | [defi/protocols/src/modules/news/client.ts:159](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/modules/news/client.ts#L159) |
| <a id="sources-3"></a> `sources?` | `string`[] | [defi/protocols/src/modules/news/client.ts:156](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/modules/news/client.ts#L156) |
| <a id="startdate"></a> `startDate?` | `string` | [defi/protocols/src/modules/news/client.ts:154](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/modules/news/client.ts#L154) |

***

### HistoricalSearchResult

Defined in: [defi/protocols/src/modules/news/client.ts:165](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/modules/news/client.ts#L165)

Historical search result

#### Properties

| Property | Type | Defined in |
| :------ | :------ | :------ |
| <a id="articles"></a> `articles` | \{ `description`: `string`; `id`: `string`; `pubDate`: `string`; `sentiment?`: `number`; `source`: `string`; `title`: `string`; `url`: `string`; \}[] | [defi/protocols/src/modules/news/client.ts:166](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/modules/news/client.ts#L166) |
| <a id="pagination"></a> `pagination` | \{ `page`: `number`; `perPage`: `number`; `totalPages`: `number`; \} | [defi/protocols/src/modules/news/client.ts:176](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/modules/news/client.ts#L176) |
| `pagination.page` | `number` | [defi/protocols/src/modules/news/client.ts:177](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/modules/news/client.ts#L177) |
| `pagination.perPage` | `number` | [defi/protocols/src/modules/news/client.ts:178](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/modules/news/client.ts#L178) |
| `pagination.totalPages` | `number` | [defi/protocols/src/modules/news/client.ts:179](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/modules/news/client.ts#L179) |
| <a id="totalcount"></a> `totalCount` | `number` | [defi/protocols/src/modules/news/client.ts:175](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/modules/news/client.ts#L175) |

***

### NewsArticle

Defined in: [defi/protocols/src/modules/news/client.ts:58](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/modules/news/client.ts#L58)

News article from the API

#### Properties

| Property | Type | Defined in |
| :------ | :------ | :------ |
| <a id="category"></a> `category` | `string` | [defi/protocols/src/modules/news/client.ts:66](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/modules/news/client.ts#L66) |
| <a id="description"></a> `description?` | `string` | [defi/protocols/src/modules/news/client.ts:62](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/modules/news/client.ts#L62) |
| <a id="id"></a> `id` | `string` | [defi/protocols/src/modules/news/client.ts:59](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/modules/news/client.ts#L59) |
| <a id="link"></a> `link` | `string` | [defi/protocols/src/modules/news/client.ts:61](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/modules/news/client.ts#L61) |
| <a id="pubdate"></a> `pubDate` | `string` | [defi/protocols/src/modules/news/client.ts:63](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/modules/news/client.ts#L63) |
| <a id="source"></a> `source` | `string` | [defi/protocols/src/modules/news/client.ts:64](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/modules/news/client.ts#L64) |
| <a id="sourcekey"></a> `sourceKey` | `string` | [defi/protocols/src/modules/news/client.ts:65](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/modules/news/client.ts#L65) |
| <a id="timeago"></a> `timeAgo` | `string` | [defi/protocols/src/modules/news/client.ts:67](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/modules/news/client.ts#L67) |
| <a id="title-1"></a> `title` | `string` | [defi/protocols/src/modules/news/client.ts:60](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/modules/news/client.ts#L60) |

***

### NewsClientConfig

Defined in: [defi/protocols/src/modules/news/client.ts:36](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/modules/news/client.ts#L36)

Client configuration options

#### Properties

| Property | Type | Description | Defined in |
| :------ | :------ | :------ | :------ |
| <a id="apiurl"></a> `apiUrl?` | `string` | API base URL (defaults to free-crypto-news.vercel.app) | [defi/protocols/src/modules/news/client.ts:38](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/modules/news/client.ts#L38) |
| <a id="chain"></a> `chain?` | `any` | Chain for payments (defaults to base-sepolia for safety) | [defi/protocols/src/modules/news/client.ts:42](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/modules/news/client.ts#L42) |
| <a id="enablegasless"></a> `enableGasless?` | `boolean` | Enable gasless payments via EIP-3009 | [defi/protocols/src/modules/news/client.ts:48](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/modules/news/client.ts#L48) |
| <a id="maxpaymentperrequest"></a> `maxPaymentPerRequest?` | `string` | Maximum payment per request in USD | [defi/protocols/src/modules/news/client.ts:46](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/modules/news/client.ts#L46) |
| <a id="privatekey"></a> `privateKey?` | `` `0x${string}` `` | EVM private key for x402 payments (enables premium features) | [defi/protocols/src/modules/news/client.ts:40](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/modules/news/client.ts#L40) |
| <a id="rpcurl"></a> `rpcUrl?` | `string` | RPC URL override | [defi/protocols/src/modules/news/client.ts:44](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/modules/news/client.ts#L44) |
| <a id="timeout"></a> `timeout?` | `number` | Request timeout in milliseconds | [defi/protocols/src/modules/news/client.ts:50](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/modules/news/client.ts#L50) |

***

### NewsResponse

Defined in: [defi/protocols/src/modules/news/client.ts:71](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/modules/news/client.ts#L71)

News response structure

#### Properties

| Property | Type | Defined in |
| :------ | :------ | :------ |
| <a id="articles-1"></a> `articles` | [`NewsArticle`](/docs/api/defi/protocols/src/modules/news/client.md#newsarticle)[] | [defi/protocols/src/modules/news/client.ts:72](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/modules/news/client.ts#L72) |
| <a id="fetchedat"></a> `fetchedAt` | `string` | [defi/protocols/src/modules/news/client.ts:75](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/modules/news/client.ts#L75) |
| <a id="sources-4"></a> `sources` | `string`[] | [defi/protocols/src/modules/news/client.ts:74](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/modules/news/client.ts#L74) |
| <a id="totalcount-1"></a> `totalCount` | `number` | [defi/protocols/src/modules/news/client.ts:73](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/modules/news/client.ts#L73) |

***

### PremiumStatus

Defined in: [defi/protocols/src/modules/news/client.ts:184](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/modules/news/client.ts#L184)

Premium status

#### Properties

| Property | Type | Defined in |
| :------ | :------ | :------ |
| <a id="activesubscriptions"></a> `activeSubscriptions` | \{ `expiresAt`: `string`; `type`: `string`; `usage?`: `number`; \}[] | [defi/protocols/src/modules/news/client.ts:186](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/modules/news/client.ts#L186) |
| <a id="ispremium"></a> `isPremium` | `boolean` | [defi/protocols/src/modules/news/client.ts:185](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/modules/news/client.ts#L185) |
| <a id="totalspent"></a> `totalSpent?` | `string` | [defi/protocols/src/modules/news/client.ts:192](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/modules/news/client.ts#L192) |
| <a id="walletbalance"></a> `walletBalance?` | `string` | [defi/protocols/src/modules/news/client.ts:191](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/modules/news/client.ts#L191) |

## Variables

### DEFAULT\_API\_BASE

```ts
const DEFAULT_API_BASE: "https://free-crypto-news.vercel.app" = "https://free-crypto-news.vercel.app";
```

Defined in: [defi/protocols/src/modules/news/client.ts:33](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/modules/news/client.ts#L33)

Default API base URL

## Functions

### createNewsClient()

```ts
function createNewsClient(config?: NewsClientConfig): NewsClient;
```

Defined in: [defi/protocols/src/modules/news/client.ts:627](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/modules/news/client.ts#L627)

Create a news client instance

#### Parameters

| Parameter | Type |
| :------ | :------ |
| `config?` | [`NewsClientConfig`](/docs/api/defi/protocols/src/modules/news/client.md#newsclientconfig) |

#### Returns

[`NewsClient`](/docs/api/defi/protocols/src/modules/news/client.md#newsclient)

#### Example

```typescript
// Free usage
const news = createNewsClient()
const latest = await news.getLatest()

// Premium usage (auto-pays with x402)
const premiumNews = createNewsClient({
  privateKey: process.env.EVM_PRIVATE_KEY as `0x${string}`,
  chain: "base", // Use mainnet
})
const summary = await premiumNews.summarize(articleId) // $0.001
```
