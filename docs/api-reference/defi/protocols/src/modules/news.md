[**Universal Crypto MCP API Reference v1.0.0**](../../../../index.md)

***

[Universal Crypto MCP API Reference](/docs/api/index.md) / defi/protocols/src/modules/news

# defi/protocols/src/modules/news

## Functions

### registerFreeNewsOnly()

```ts
function registerFreeNewsOnly(server: McpServer): void;
```

Defined in: [defi/protocols/src/modules/news/index.ts:82](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/modules/news/index.ts#L82)

Register only free news features (no x402 dependency)

#### Parameters

| Parameter | Type |
| :------ | :------ |
| `server` | `McpServer` |

#### Returns

`void`

***

### registerNews()

```ts
function registerNews(server: McpServer): void;
```

Defined in: [defi/protocols/src/modules/news/index.ts:69](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/modules/news/index.ts#L69)

Register all news features (free + premium) with MCP server

#### Parameters

| Parameter | Type |
| :------ | :------ |
| `server` | `McpServer` |

#### Returns

`void`

## References

### AlertConfig

Re-exports [AlertConfig](/docs/api/defi/protocols/src/modules/news/client.md#alertconfig)

***

### AlertSubscription

Re-exports [AlertSubscription](/docs/api/defi/protocols/src/modules/news/client.md#alertsubscription)

***

### ArticleSummary

Re-exports [ArticleSummary](/docs/api/defi/protocols/src/modules/news/client.md#articlesummary)

***

### BazaarExtension

Re-exports [BazaarExtension](/docs/api/defi/protocols/src/modules/news/x402-discovery.md#bazaarextension)

***

### createNewsClient

Re-exports [createNewsClient](/docs/api/defi/protocols/src/modules/news/client.md#createnewsclient)

***

### createX402DiscoveryHandler

Re-exports [createX402DiscoveryHandler](/docs/api/defi/protocols/src/modules/news/x402-discovery.md#createx402discoveryhandler)

***

### CustomFeed

Re-exports [CustomFeed](/docs/api/defi/protocols/src/modules/news/client.md#customfeed)

***

### CustomFeedConfig

Re-exports [CustomFeedConfig](/docs/api/defi/protocols/src/modules/news/client.md#customfeedconfig-1)

***

### FirehoseSubscription

Re-exports [FirehoseSubscription](/docs/api/defi/protocols/src/modules/news/client.md#firehosesubscription)

***

### generateDiscoveryDocument

Re-exports [generateDiscoveryDocument](/docs/api/defi/protocols/src/modules/news/x402-discovery.md#generatediscoverydocument)

***

### getDiscoveryDocumentJSON

Re-exports [getDiscoveryDocumentJSON](/docs/api/defi/protocols/src/modules/news/x402-discovery.md#getdiscoverydocumentjson)

***

### HistoricalSearchOptions

Re-exports [HistoricalSearchOptions](/docs/api/defi/protocols/src/modules/news/client.md#historicalsearchoptions)

***

### HistoricalSearchResult

Re-exports [HistoricalSearchResult](/docs/api/defi/protocols/src/modules/news/client.md#historicalsearchresult)

***

### NewsArticle

Re-exports [NewsArticle](/docs/api/defi/protocols/src/modules/news/client.md#newsarticle)

***

### NewsClient

Re-exports [NewsClient](/docs/api/defi/protocols/src/modules/news/client.md#newsclient)

***

### NewsClientConfig

Re-exports [NewsClientConfig](/docs/api/defi/protocols/src/modules/news/client.md#newsclientconfig)

***

### NewsResponse

Re-exports [NewsResponse](/docs/api/defi/protocols/src/modules/news/client.md#newsresponse)

***

### PREMIUM\_NEWS\_RESOURCES

Re-exports [PREMIUM_NEWS_RESOURCES](/docs/api/defi/protocols/src/modules/news/x402-discovery.md#premium_news_resources)

***

### PREMIUM\_PRICING

Re-exports [PREMIUM_PRICING](/docs/api/defi/protocols/src/modules/news/premium-tools.md#premium_pricing)

***

### PremiumStatus

Re-exports [PremiumStatus](/docs/api/defi/protocols/src/modules/news/client.md#premiumstatus)

***

### REVENUE\_SPLIT

Re-exports [REVENUE_SPLIT](/docs/api/defi/protocols/src/modules/news/premium-tools.md#revenue_split)

***

### validateDiscoveryDocument

Re-exports [validateDiscoveryDocument](/docs/api/defi/protocols/src/modules/news/x402-discovery.md#validatediscoverydocument)

***

### validateResource

Re-exports [validateResource](/docs/api/defi/protocols/src/modules/news/x402-discovery.md#validateresource)

***

### X402Accepts

Re-exports [X402Accepts](/docs/api/defi/protocols/src/modules/news/x402-discovery.md#x402accepts)

***

### X402DiscoveryDocument

Re-exports [X402DiscoveryDocument](/docs/api/defi/protocols/src/modules/news/x402-discovery.md#x402discoverydocument)

***

### x402DiscoveryMiddleware

Re-exports [x402DiscoveryMiddleware](/docs/api/defi/protocols/src/modules/news/x402-discovery.md#x402discoverymiddleware)

***

### X402Resource

Re-exports [X402Resource](/docs/api/defi/protocols/src/modules/news/x402-discovery.md#x402resource)

***

### X402Response

Re-exports [X402Response](/docs/api/defi/protocols/src/modules/news/x402-discovery.md#x402response)
