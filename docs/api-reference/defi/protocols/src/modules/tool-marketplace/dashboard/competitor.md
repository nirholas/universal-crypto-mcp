[**Universal Crypto MCP API Reference v1.0.0**](../../../../../../index.md)

***

[Universal Crypto MCP API Reference](/docs/api/index.md) / defi/protocols/src/modules/tool-marketplace/dashboard/competitor

# defi/protocols/src/modules/tool-marketplace/dashboard/competitor

## Classes

### CompetitorAnalysisService

Defined in: [defi/protocols/src/modules/tool-marketplace/dashboard/competitor.ts:213](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/modules/tool-marketplace/dashboard/competitor.ts#L213)

Competitor Analysis Service

#### Constructors

##### Constructor

```ts
new CompetitorAnalysisService(): CompetitorAnalysisService;
```

###### Returns

[`CompetitorAnalysisService`](/docs/api/defi/protocols/src/modules/tool-marketplace/dashboard/competitor.md#competitoranalysisservice)

#### Methods

##### analyzeCompetitors()

```ts
analyzeCompetitors(toolId: string): Promise<CompetitorAnalysisReport>;
```

Defined in: [defi/protocols/src/modules/tool-marketplace/dashboard/competitor.ts:217](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/modules/tool-marketplace/dashboard/competitor.ts#L217)

Get full competitor analysis

###### Parameters

| Parameter | Type |
| :------ | :------ |
| `toolId` | `string` |

###### Returns

`Promise`\<[`CompetitorAnalysisReport`](/docs/api/defi/protocols/src/modules/tool-marketplace/dashboard/competitor.md#competitoranalysisreport)\>

##### compareToCompetitor()

```ts
compareToCompetitor(yourToolId: string, competitorToolId: string): Promise<{
  comparison: Record<string, {
     theirs: string | number;
     winner: "you" | "them" | "tie";
     yours: string | number;
  }>;
  summary: string;
}>;
```

Defined in: [defi/protocols/src/modules/tool-marketplace/dashboard/competitor.ts:678](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/modules/tool-marketplace/dashboard/competitor.ts#L678)

Quick comparison to a specific competitor

###### Parameters

| Parameter | Type |
| :------ | :------ |
| `yourToolId` | `string` |
| `competitorToolId` | `string` |

###### Returns

`Promise`\<\{
  `comparison`: `Record`\<`string`, \{
     `theirs`: `string` \| `number`;
     `winner`: `"you"` \| `"them"` \| `"tie"`;
     `yours`: `string` \| `number`;
  \}\>;
  `summary`: `string`;
\}\>

## Interfaces

### CompetitorAnalysisReport

Defined in: [defi/protocols/src/modules/tool-marketplace/dashboard/competitor.ts:111](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/modules/tool-marketplace/dashboard/competitor.ts#L111)

Full competitor analysis report

#### Properties

| Property | Type | Description | Defined in |
| :------ | :------ | :------ | :------ |
| <a id="analyzedat"></a> `analyzedAt` | `number` | Analysis timestamp | [defi/protocols/src/modules/tool-marketplace/dashboard/competitor.ts:117](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/modules/tool-marketplace/dashboard/competitor.ts#L117) |
| <a id="category"></a> `category` | `string` | Category analyzed | [defi/protocols/src/modules/tool-marketplace/dashboard/competitor.ts:119](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/modules/tool-marketplace/dashboard/competitor.ts#L119) |
| <a id="competitorcount"></a> `competitorCount` | `number` | Number of competitors | [defi/protocols/src/modules/tool-marketplace/dashboard/competitor.ts:121](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/modules/tool-marketplace/dashboard/competitor.ts#L121) |
| <a id="featurecomparison"></a> `featureComparison` | [`FeatureComparison`](/docs/api/defi/protocols/src/modules/tool-marketplace/dashboard/competitor.md#featurecomparison-1)[] | Feature comparison | [defi/protocols/src/modules/tool-marketplace/dashboard/competitor.ts:129](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/modules/tool-marketplace/dashboard/competitor.ts#L129) |
| <a id="featuregaps"></a> `featureGaps` | [`FeatureGap`](/docs/api/defi/protocols/src/modules/tool-marketplace/dashboard/competitor.md#featuregap)[] | Feature gaps | [defi/protocols/src/modules/tool-marketplace/dashboard/competitor.ts:131](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/modules/tool-marketplace/dashboard/competitor.ts#L131) |
| <a id="marketshare"></a> `marketShare` | [`MarketShare`](/docs/api/defi/protocols/src/modules/tool-marketplace/dashboard/competitor.md#marketshare-1) | Market share | [defi/protocols/src/modules/tool-marketplace/dashboard/competitor.ts:125](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/modules/tool-marketplace/dashboard/competitor.ts#L125) |
| <a id="performanceranking"></a> `performanceRanking` | \{ `categoryAvg`: `number`; `metric`: `string`; `rank`: `number`; `totalInCategory`: `number`; `yourValue`: `number`; \}[] | Performance comparison | [defi/protocols/src/modules/tool-marketplace/dashboard/competitor.ts:133](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/modules/tool-marketplace/dashboard/competitor.ts#L133) |
| <a id="pricebenchmark"></a> `priceBenchmark` | [`PriceBenchmark`](/docs/api/defi/protocols/src/modules/tool-marketplace/dashboard/competitor.md#pricebenchmark-1) | Price benchmarking | [defi/protocols/src/modules/tool-marketplace/dashboard/competitor.ts:123](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/modules/tool-marketplace/dashboard/competitor.ts#L123) |
| <a id="recommendations"></a> `recommendations` | `string`[] | Strategic recommendations | [defi/protocols/src/modules/tool-marketplace/dashboard/competitor.ts:141](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/modules/tool-marketplace/dashboard/competitor.ts#L141) |
| <a id="topcompetitors"></a> `topCompetitors` | [`CompetitorSummary`](/docs/api/defi/protocols/src/modules/tool-marketplace/dashboard/competitor.md#competitorsummary)[] | Top competitors | [defi/protocols/src/modules/tool-marketplace/dashboard/competitor.ts:127](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/modules/tool-marketplace/dashboard/competitor.ts#L127) |
| <a id="yourtoolid"></a> `yourToolId` | `string` | Your tool ID | [defi/protocols/src/modules/tool-marketplace/dashboard/competitor.ts:113](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/modules/tool-marketplace/dashboard/competitor.ts#L113) |
| <a id="yourtoolname"></a> `yourToolName` | `string` | Your tool name | [defi/protocols/src/modules/tool-marketplace/dashboard/competitor.ts:115](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/modules/tool-marketplace/dashboard/competitor.ts#L115) |

***

### CompetitorSummary

Defined in: [defi/protocols/src/modules/tool-marketplace/dashboard/competitor.ts:51](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/modules/tool-marketplace/dashboard/competitor.ts#L51)

Competitor tool summary

#### Properties

| Property | Type | Description | Defined in |
| :------ | :------ | :------ | :------ |
| <a id="avgresponsetime"></a> `avgResponseTime` | `number` | Response time | [defi/protocols/src/modules/tool-marketplace/dashboard/competitor.ts:65](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/modules/tool-marketplace/dashboard/competitor.ts#L65) |
| <a id="displayname"></a> `displayName` | `string` | Display name | [defi/protocols/src/modules/tool-marketplace/dashboard/competitor.ts:57](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/modules/tool-marketplace/dashboard/competitor.ts#L57) |
| <a id="marketsharepercent"></a> `marketSharePercent` | `number` | Market share estimate | [defi/protocols/src/modules/tool-marketplace/dashboard/competitor.ts:71](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/modules/tool-marketplace/dashboard/competitor.ts#L71) |
| <a id="name"></a> `name` | `string` | Tool name | [defi/protocols/src/modules/tool-marketplace/dashboard/competitor.ts:55](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/modules/tool-marketplace/dashboard/competitor.ts#L55) |
| <a id="price"></a> `price` | `string` | Price per call | [defi/protocols/src/modules/tool-marketplace/dashboard/competitor.ts:59](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/modules/tool-marketplace/dashboard/competitor.ts#L59) |
| <a id="rating"></a> `rating` | `number` | User rating | [defi/protocols/src/modules/tool-marketplace/dashboard/competitor.ts:61](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/modules/tool-marketplace/dashboard/competitor.ts#L61) |
| <a id="strengths"></a> `strengths` | `string`[] | Strengths relative to your tool | [defi/protocols/src/modules/tool-marketplace/dashboard/competitor.ts:67](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/modules/tool-marketplace/dashboard/competitor.ts#L67) |
| <a id="toolid"></a> `toolId` | `string` | Tool ID | [defi/protocols/src/modules/tool-marketplace/dashboard/competitor.ts:53](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/modules/tool-marketplace/dashboard/competitor.ts#L53) |
| <a id="totalcalls"></a> `totalCalls` | `number` | Total calls | [defi/protocols/src/modules/tool-marketplace/dashboard/competitor.ts:63](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/modules/tool-marketplace/dashboard/competitor.ts#L63) |
| <a id="weaknesses"></a> `weaknesses` | `string`[] | Weaknesses relative to your tool | [defi/protocols/src/modules/tool-marketplace/dashboard/competitor.ts:69](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/modules/tool-marketplace/dashboard/competitor.ts#L69) |

***

### FeatureComparison

Defined in: [defi/protocols/src/modules/tool-marketplace/dashboard/competitor.ts:37](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/modules/tool-marketplace/dashboard/competitor.ts#L37)

Feature comparison

#### Properties

| Property | Type | Description | Defined in |
| :------ | :------ | :------ | :------ |
| <a id="competitorpercent"></a> `competitorPercent` | `number` | Percentage of competitors with this feature | [defi/protocols/src/modules/tool-marketplace/dashboard/competitor.ts:43](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/modules/tool-marketplace/dashboard/competitor.ts#L43) |
| <a id="feature"></a> `feature` | `string` | Feature name | [defi/protocols/src/modules/tool-marketplace/dashboard/competitor.ts:39](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/modules/tool-marketplace/dashboard/competitor.ts#L39) |
| <a id="importance"></a> `importance` | `number` | Importance score (1-5) | [defi/protocols/src/modules/tool-marketplace/dashboard/competitor.ts:45](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/modules/tool-marketplace/dashboard/competitor.ts#L45) |
| <a id="yourtool"></a> `yourTool` | `boolean` | Your tool has this feature | [defi/protocols/src/modules/tool-marketplace/dashboard/competitor.ts:41](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/modules/tool-marketplace/dashboard/competitor.ts#L41) |

***

### FeatureGap

Defined in: [defi/protocols/src/modules/tool-marketplace/dashboard/competitor.ts:97](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/modules/tool-marketplace/dashboard/competitor.ts#L97)

Feature gap analysis result

#### Properties

| Property | Type | Description | Defined in |
| :------ | :------ | :------ | :------ |
| <a id="competitorcount-1"></a> `competitorCount` | `number` | How many competitors have it | [defi/protocols/src/modules/tool-marketplace/dashboard/competitor.ts:101](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/modules/tool-marketplace/dashboard/competitor.ts#L101) |
| <a id="estimatedimpact"></a> `estimatedImpact` | `"low"` \| `"medium"` \| `"high"` | Estimated impact | [defi/protocols/src/modules/tool-marketplace/dashboard/competitor.ts:103](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/modules/tool-marketplace/dashboard/competitor.ts#L103) |
| <a id="feature-1"></a> `feature` | `string` | Missing feature | [defi/protocols/src/modules/tool-marketplace/dashboard/competitor.ts:99](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/modules/tool-marketplace/dashboard/competitor.ts#L99) |
| <a id="priority"></a> `priority` | `number` | Suggested priority | [defi/protocols/src/modules/tool-marketplace/dashboard/competitor.ts:105](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/modules/tool-marketplace/dashboard/competitor.ts#L105) |

***

### MarketShare

Defined in: [defi/protocols/src/modules/tool-marketplace/dashboard/competitor.ts:77](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/modules/tool-marketplace/dashboard/competitor.ts#L77)

Market share estimation

#### Properties

| Property | Type | Description | Defined in |
| :------ | :------ | :------ | :------ |
| <a id="competitors"></a> `competitors` | \{ `calls`: `number`; `name`: `string`; `revenue`: `string`; `sharePercent`: `number`; `toolId`: `string`; \}[] | Competitors' shares | [defi/protocols/src/modules/tool-marketplace/dashboard/competitor.ts:85](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/modules/tool-marketplace/dashboard/competitor.ts#L85) |
| <a id="totalmarketcalls"></a> `totalMarketCalls` | `number` | Total market size (calls) | [defi/protocols/src/modules/tool-marketplace/dashboard/competitor.ts:81](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/modules/tool-marketplace/dashboard/competitor.ts#L81) |
| <a id="totalmarketrevenue"></a> `totalMarketRevenue` | `string` | Total market revenue | [defi/protocols/src/modules/tool-marketplace/dashboard/competitor.ts:83](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/modules/tool-marketplace/dashboard/competitor.ts#L83) |
| <a id="yourshare"></a> `yourShare` | `number` | Your tool's market share | [defi/protocols/src/modules/tool-marketplace/dashboard/competitor.ts:79](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/modules/tool-marketplace/dashboard/competitor.ts#L79) |

***

### PriceBenchmark

Defined in: [defi/protocols/src/modules/tool-marketplace/dashboard/competitor.ts:17](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/modules/tool-marketplace/dashboard/competitor.ts#L17)

Price benchmark data

#### Properties

| Property | Type | Description | Defined in |
| :------ | :------ | :------ | :------ |
| <a id="categoryavg"></a> `categoryAvg` | `string` | Category average price | [defi/protocols/src/modules/tool-marketplace/dashboard/competitor.ts:21](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/modules/tool-marketplace/dashboard/competitor.ts#L21) |
| <a id="categorymax"></a> `categoryMax` | `string` | Maximum in category | [defi/protocols/src/modules/tool-marketplace/dashboard/competitor.ts:27](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/modules/tool-marketplace/dashboard/competitor.ts#L27) |
| <a id="categorymedian"></a> `categoryMedian` | `string` | Category median price | [defi/protocols/src/modules/tool-marketplace/dashboard/competitor.ts:23](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/modules/tool-marketplace/dashboard/competitor.ts#L23) |
| <a id="categorymin"></a> `categoryMin` | `string` | Minimum in category | [defi/protocols/src/modules/tool-marketplace/dashboard/competitor.ts:25](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/modules/tool-marketplace/dashboard/competitor.ts#L25) |
| <a id="percentile"></a> `percentile` | `number` | Percentile your price is at | [defi/protocols/src/modules/tool-marketplace/dashboard/competitor.ts:29](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/modules/tool-marketplace/dashboard/competitor.ts#L29) |
| <a id="recommendation"></a> `recommendation` | `"premium"` \| `"lower"` \| `"competitive"` \| `"expensive"` | Recommendation | [defi/protocols/src/modules/tool-marketplace/dashboard/competitor.ts:31](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/modules/tool-marketplace/dashboard/competitor.ts#L31) |
| <a id="yourprice"></a> `yourPrice` | `string` | Your tool's price | [defi/protocols/src/modules/tool-marketplace/dashboard/competitor.ts:19](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/modules/tool-marketplace/dashboard/competitor.ts#L19) |

## Variables

### competitorAnalysis

```ts
const competitorAnalysis: CompetitorAnalysisService;
```

Defined in: [defi/protocols/src/modules/tool-marketplace/dashboard/competitor.ts:760](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/modules/tool-marketplace/dashboard/competitor.ts#L760)
