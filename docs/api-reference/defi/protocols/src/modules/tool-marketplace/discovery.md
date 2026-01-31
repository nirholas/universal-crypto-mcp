[**Universal Crypto MCP API Reference v1.0.0**](../../../../../index.md)

***

[Universal Crypto MCP API Reference](/docs/api/index.md) / defi/protocols/src/modules/tool-marketplace/discovery

# defi/protocols/src/modules/tool-marketplace/discovery

## Interfaces

### DiscoveryConfig

Defined in: [defi/protocols/src/modules/tool-marketplace/discovery/index.ts:61](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/modules/tool-marketplace/discovery/index.ts#L61)

Discovery module configuration

#### Properties

| Property | Type | Description | Defined in |
| :------ | :------ | :------ | :------ |
| <a id="analyticsconfig"></a> `analyticsConfig?` | \{ `maxRecords?`: `number`; `retentionDays?`: `number`; \} | Analytics configuration | [defi/protocols/src/modules/tool-marketplace/discovery/index.ts:73](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/modules/tool-marketplace/discovery/index.ts#L73) |
| `analyticsConfig.maxRecords?` | `number` | - | [defi/protocols/src/modules/tool-marketplace/discovery/index.ts:74](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/modules/tool-marketplace/discovery/index.ts#L74) |
| `analyticsConfig.retentionDays?` | `number` | - | [defi/protocols/src/modules/tool-marketplace/discovery/index.ts:75](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/modules/tool-marketplace/discovery/index.ts#L75) |
| <a id="enablesemantic"></a> `enableSemantic?` | `boolean` | Enable semantic search | [defi/protocols/src/modules/tool-marketplace/discovery/index.ts:65](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/modules/tool-marketplace/discovery/index.ts#L65) |
| <a id="openaiapikey"></a> `openaiApiKey?` | `string` | OpenAI API key for semantic search | [defi/protocols/src/modules/tool-marketplace/discovery/index.ts:63](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/modules/tool-marketplace/discovery/index.ts#L63) |
| <a id="searchconfig"></a> `searchConfig?` | \{ `fuzzy?`: `boolean`; `fuzzyDistance?`: `number`; `stemming?`: `boolean`; \} | Full-text search configuration | [defi/protocols/src/modules/tool-marketplace/discovery/index.ts:67](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/modules/tool-marketplace/discovery/index.ts#L67) |
| `searchConfig.fuzzy?` | `boolean` | - | [defi/protocols/src/modules/tool-marketplace/discovery/index.ts:68](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/modules/tool-marketplace/discovery/index.ts#L68) |
| `searchConfig.fuzzyDistance?` | `number` | - | [defi/protocols/src/modules/tool-marketplace/discovery/index.ts:69](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/modules/tool-marketplace/discovery/index.ts#L69) |
| `searchConfig.stemming?` | `boolean` | - | [defi/protocols/src/modules/tool-marketplace/discovery/index.ts:70](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/modules/tool-marketplace/discovery/index.ts#L70) |

## Functions

### configureDiscovery()

```ts
function configureDiscovery(config: DiscoveryConfig): void;
```

Defined in: [defi/protocols/src/modules/tool-marketplace/discovery/index.ts:82](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/modules/tool-marketplace/discovery/index.ts#L82)

Configure discovery module

#### Parameters

| Parameter | Type |
| :------ | :------ |
| `config` | [`DiscoveryConfig`](/docs/api/defi/protocols/src/modules/tool-marketplace/discovery.md#discoveryconfig) |

#### Returns

`void`

***

### initializeDiscovery()

```ts
function initializeDiscovery(tools: RegisteredTool[]): Promise<void>;
```

Defined in: [defi/protocols/src/modules/tool-marketplace/discovery/index.ts:39](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/modules/tool-marketplace/discovery/index.ts#L39)

Initialize all discovery engines with tools

#### Parameters

| Parameter | Type |
| :------ | :------ |
| `tools` | [`RegisteredTool`](/docs/api/defi/protocols/src/modules/tool-marketplace/types.md#registeredtool)[] |

#### Returns

`Promise`\<`void`\>

## References

### AdvancedFilterOptions

Re-exports [AdvancedFilterOptions](/docs/api/defi/protocols/src/modules/tool-marketplace/discovery/types.md#advancedfilteroptions)

***

### BUNDLE\_TEMPLATES

Re-exports [BUNDLE_TEMPLATES](/docs/api/defi/protocols/src/modules/tool-marketplace/discovery/bundles.md#bundle_templates)

***

### bundleManager

Re-exports [bundleManager](/docs/api/defi/protocols/src/modules/tool-marketplace/discovery/bundles.md#bundlemanager-1)

***

### BundleManager

Re-exports [BundleManager](/docs/api/defi/protocols/src/modules/tool-marketplace/discovery/bundles.md#bundlemanager)

***

### BundleSubscription

Re-exports [BundleSubscription](/docs/api/defi/protocols/src/modules/tool-marketplace/discovery/types.md#bundlesubscription)

***

### ClickRecord

Re-exports [ClickRecord](/docs/api/defi/protocols/src/modules/tool-marketplace/discovery/types.md#clickrecord)

***

### CombinedFilter

Re-exports [CombinedFilter](/docs/api/defi/protocols/src/modules/tool-marketplace/discovery/types.md#combinedfilter)

***

### ContentSimilarity

Re-exports [ContentSimilarity](/docs/api/defi/protocols/src/modules/tool-marketplace/discovery/types.md#contentsimilarity)

***

### ConversionRecord

Re-exports [ConversionRecord](/docs/api/defi/protocols/src/modules/tool-marketplace/discovery/types.md#conversionrecord)

***

### CoUsagePattern

Re-exports [CoUsagePattern](/docs/api/defi/protocols/src/modules/tool-marketplace/discovery/types.md#cousagepattern)

***

### CreateBundleInput

Re-exports [CreateBundleInput](/docs/api/defi/protocols/src/modules/tool-marketplace/discovery/types.md#createbundleinput)

***

### FeaturedTool

Re-exports [FeaturedTool](/docs/api/defi/protocols/src/modules/tool-marketplace/discovery/types.md#featuredtool)

***

### FilterCondition

Re-exports [FilterCondition](/docs/api/defi/protocols/src/modules/tool-marketplace/discovery/types.md#filtercondition)

***

### filterEngine

Re-exports [filterEngine](/docs/api/defi/protocols/src/modules/tool-marketplace/discovery/filters.md#filterengine-1)

***

### FilterEngine

Re-exports [FilterEngine](/docs/api/defi/protocols/src/modules/tool-marketplace/discovery/filters.md#filterengine)

***

### FilterOperator

Re-exports [FilterOperator](/docs/api/defi/protocols/src/modules/tool-marketplace/discovery/types.md#filteroperator)

***

### formatComparison

Re-exports [formatComparison](/docs/api/defi/protocols/src/modules/tool-marketplace/discovery/ui.md#formatcomparison-2)

***

### formatSearchResults

Re-exports [formatSearchResults](/docs/api/defi/protocols/src/modules/tool-marketplace/discovery/ui.md#formatsearchresults-2)

***

### formatToolCard

Re-exports [formatToolCard](/docs/api/defi/protocols/src/modules/tool-marketplace/discovery/ui.md#formattoolcard-2)

***

### fullTextSearch

Re-exports [fullTextSearch](/docs/api/defi/protocols/src/modules/tool-marketplace/discovery/search.md#fulltextsearch)

***

### FullTextSearchEngine

Re-exports [FullTextSearchEngine](/docs/api/defi/protocols/src/modules/tool-marketplace/discovery/search.md#fulltextsearchengine)

***

### FullTextSearchOptions

Re-exports [FullTextSearchOptions](/docs/api/defi/protocols/src/modules/tool-marketplace/discovery/types.md#fulltextsearchoptions)

***

### HotTool

Re-exports [HotTool](/docs/api/defi/protocols/src/modules/tool-marketplace/discovery/types.md#hottool)

***

### NewTool

Re-exports [NewTool](/docs/api/defi/protocols/src/modules/tool-marketplace/discovery/types.md#newtool)

***

### PriceRangeFilter

Re-exports [PriceRangeFilter](/docs/api/defi/protocols/src/modules/tool-marketplace/discovery/types.md#pricerangefilter)

***

### recommendationEngine

Re-exports [recommendationEngine](/docs/api/defi/protocols/src/modules/tool-marketplace/discovery/recommendations.md#recommendationengine-1)

***

### RecommendationEngine

Re-exports [RecommendationEngine](/docs/api/defi/protocols/src/modules/tool-marketplace/discovery/recommendations.md#recommendationengine)

***

### RecommendedTool

Re-exports [RecommendedTool](/docs/api/defi/protocols/src/modules/tool-marketplace/discovery/types.md#recommendedtool)

***

### registerDiscoveryTools

Re-exports [registerDiscoveryTools](/docs/api/defi/protocols/src/modules/tool-marketplace/discovery/tools.md#registerdiscoverytools)

***

### RisingStarTool

Re-exports [RisingStarTool](/docs/api/defi/protocols/src/modules/tool-marketplace/discovery/types.md#risingstartool)

***

### searchAnalytics

Re-exports [searchAnalytics](/docs/api/defi/protocols/src/modules/tool-marketplace/discovery/analytics.md#searchanalytics-1)

***

### SearchAnalytics

Re-exports [SearchAnalytics](/docs/api/defi/protocols/src/modules/tool-marketplace/discovery/analytics.md#searchanalytics)

***

### SearchAnalyticsSummary

Re-exports [SearchAnalyticsSummary](/docs/api/defi/protocols/src/modules/tool-marketplace/discovery/types.md#searchanalyticssummary)

***

### SearchConfig

Re-exports [SearchConfig](/docs/api/defi/protocols/src/modules/tool-marketplace/discovery/types.md#searchconfig)

***

### SearchQueryRecord

Re-exports [SearchQueryRecord](/docs/api/defi/protocols/src/modules/tool-marketplace/discovery/types.md#searchqueryrecord)

***

### SearchResponse

Re-exports [SearchResponse](/docs/api/defi/protocols/src/modules/tool-marketplace/discovery/types.md#searchresponse)

***

### SearchResult

Re-exports [SearchResult](/docs/api/defi/protocols/src/modules/tool-marketplace/discovery/types.md#searchresult)

***

### semanticSearch

Re-exports [semanticSearch](/docs/api/defi/protocols/src/modules/tool-marketplace/discovery/semantic.md#semanticsearch)

***

### SemanticSearchEngine

Re-exports [SemanticSearchEngine](/docs/api/defi/protocols/src/modules/tool-marketplace/discovery/semantic.md#semanticsearchengine)

***

### SemanticSearchOptions

Re-exports [SemanticSearchOptions](/docs/api/defi/protocols/src/modules/tool-marketplace/discovery/types.md#semanticsearchoptions)

***

### SynonymMap

Re-exports [SynonymMap](/docs/api/defi/protocols/src/modules/tool-marketplace/discovery/types.md#synonymmap)

***

### ToolAlternative

Re-exports [ToolAlternative](/docs/api/defi/protocols/src/modules/tool-marketplace/discovery/types.md#toolalternative)

***

### ToolBundle

Re-exports [ToolBundle](/docs/api/defi/protocols/src/modules/tool-marketplace/discovery/types.md#toolbundle)

***

### ToolComparison

Re-exports [ToolComparison](/docs/api/defi/protocols/src/modules/tool-marketplace/discovery/types.md#toolcomparison)

***

### ToolEmbedding

Re-exports [ToolEmbedding](/docs/api/defi/protocols/src/modules/tool-marketplace/discovery/types.md#toolembedding)

***

### trendingEngine

Re-exports [trendingEngine](/docs/api/defi/protocols/src/modules/tool-marketplace/discovery/trending.md#trendingengine-1)

***

### TrendingEngine

Re-exports [TrendingEngine](/docs/api/defi/protocols/src/modules/tool-marketplace/discovery/trending.md#trendingengine)

***

### TrendingPeriod

Re-exports [TrendingPeriod](/docs/api/defi/protocols/src/modules/tool-marketplace/discovery/types.md#trendingperiod)

***

### TrendingTool

Re-exports [TrendingTool](/docs/api/defi/protocols/src/modules/tool-marketplace/discovery/types.md#trendingtool)

***

### UIFormatter

Re-exports [UIFormatter](/docs/api/defi/protocols/src/modules/tool-marketplace/discovery/ui.md#uiformatter)

***

### UserProfile

Re-exports [UserProfile](/docs/api/defi/protocols/src/modules/tool-marketplace/discovery/types.md#userprofile)

***

### ZeroResultQuery

Re-exports [ZeroResultQuery](/docs/api/defi/protocols/src/modules/tool-marketplace/discovery/types.md#zeroresultquery)
