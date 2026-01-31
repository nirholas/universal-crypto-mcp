[**Universal Crypto MCP API Reference v1.0.0**](../../../../index.md)

***

[Universal Crypto MCP API Reference](/docs/api/index.md) / defi/protocols/src/modules/tool-marketplace

# defi/protocols/src/modules/tool-marketplace

## Functions

### registerToolMarketplace()

```ts
function registerToolMarketplace(server: McpServer): void;
```

Defined in: [defi/protocols/src/modules/tool-marketplace/index.ts:497](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/modules/tool-marketplace/index.ts#L497)

Register tool marketplace module with the MCP server
Provides tools for discovering, registering, and using paid AI tools

#### Parameters

| Parameter | Type |
| :------ | :------ |
| `server` | `McpServer` |

#### Returns

`void`

***

### startVerificationWorkers()

```ts
function startVerificationWorkers(): void;
```

Defined in: [defi/protocols/src/modules/tool-marketplace/index.ts:510](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/modules/tool-marketplace/index.ts#L510)

Start the trust & verification background workers
Should be called once when the server starts

#### Returns

`void`

***

### stopVerificationWorkers()

```ts
function stopVerificationWorkers(): void;
```

Defined in: [defi/protocols/src/modules/tool-marketplace/index.ts:519](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/modules/tool-marketplace/index.ts#L519)

Stop the trust & verification background workers
Should be called when the server shuts down

#### Returns

`void`

## References

### AbusePatternResult

Re-exports [AbusePatternResult](/docs/api/defi/protocols/src/modules/tool-marketplace/analytics/anomaly.md#abusepatternresult)

***

### accessListManager

Re-exports [accessListManager](/docs/api/defi/protocols/src/modules/tool-marketplace/access/lists.md#accesslistmanager-1)

***

### AccessListManager

Re-exports [AccessListManager](/docs/api/defi/protocols/src/modules/tool-marketplace/access/lists.md#accesslistmanager)

***

### AccessStorageAdapter

Re-exports [AccessStorageAdapter](/docs/api/defi/protocols/src/modules/tool-marketplace/access/types.md#accessstorageadapter)

***

### AccessTier

Re-exports [AccessTier](/docs/api/defi/protocols/src/modules/tool-marketplace/access/types.md#accesstier)

***

### AccessTierName

Re-exports [AccessTierName](/docs/api/defi/protocols/src/modules/tool-marketplace/access/types.md#accesstiername-1)

***

### AdvancedFilterOptions

Re-exports [AdvancedFilterOptions](/docs/api/defi/protocols/src/modules/tool-marketplace/discovery/types.md#advancedfilteroptions)

***

### AggregatedDataPoint

Re-exports [AggregatedDataPoint](/docs/api/defi/protocols/src/modules/tool-marketplace/analytics/timeseries.md#aggregateddatapoint)

***

### AlertConfig

Re-exports [AlertConfig](/docs/api/defi/protocols/src/modules/tool-marketplace/analytics/anomaly.md#alertconfig)

***

### AllowlistEntry

Re-exports [AllowlistEntry](/docs/api/defi/protocols/src/modules/tool-marketplace/access/types.md#allowlistentry)

***

### Anomaly

Re-exports [Anomaly](/docs/api/defi/protocols/src/modules/tool-marketplace/analytics/anomaly.md#anomaly)

***

### anomalyDetector

Re-exports [anomalyDetector](/docs/api/defi/protocols/src/modules/tool-marketplace/analytics/anomaly.md#anomalydetector)

***

### AnomalyDetectorService

Re-exports [AnomalyDetectorService](/docs/api/defi/protocols/src/modules/tool-marketplace/analytics/anomaly.md#anomalydetectorservice)

***

### AnomalySeverity

Re-exports [AnomalySeverity](/docs/api/defi/protocols/src/modules/tool-marketplace/analytics/anomaly.md#anomalyseverity-1)

***

### AnomalyType

Re-exports [AnomalyType](/docs/api/defi/protocols/src/modules/tool-marketplace/analytics/anomaly.md#anomalytype-1)

***

### APIKey

Re-exports [APIKey](/docs/api/defi/protocols/src/modules/tool-marketplace/access/types.md#apikey)

***

### APIKeyWithSecret

Re-exports [APIKeyWithSecret](/docs/api/defi/protocols/src/modules/tool-marketplace/access/types.md#apikeywithsecret)

***

### ArbitrationCase

Re-exports [ArbitrationCase](/docs/api/defi/protocols/src/modules/tool-marketplace/disputes/types.md#arbitrationcase)

***

### ArbitrationConfig

Re-exports [ArbitrationConfig](/docs/api/defi/protocols/src/modules/tool-marketplace/disputes/arbitration.md#arbitrationconfig)

***

### arbitrationDAO

Re-exports [arbitrationDAO](/docs/api/defi/protocols/src/modules/tool-marketplace/disputes/arbitration.md#arbitrationdao-1)

***

### ArbitrationDAO

Re-exports [ArbitrationDAO](/docs/api/defi/protocols/src/modules/tool-marketplace/disputes/arbitration.md#arbitrationdao)

***

### ArbitrationVote

Re-exports [ArbitrationVote](/docs/api/defi/protocols/src/modules/tool-marketplace/disputes/types.md#arbitrationvote)

***

### Arbitrator

Re-exports [Arbitrator](/docs/api/defi/protocols/src/modules/tool-marketplace/disputes/types.md#arbitrator)

***

### authenticateRequest

Re-exports [authenticateRequest](/docs/api/defi/protocols/src/modules/tool-marketplace/middleware/auth.md#authenticaterequest)

***

### AuthError

Re-exports [AuthError](/docs/api/defi/protocols/src/modules/tool-marketplace/middleware/auth.md#autherror)

***

### AuthResult

Re-exports [AuthResult](/docs/api/defi/protocols/src/modules/tool-marketplace/middleware/auth.md#authresult)

***

### AutoResolutionRule

Re-exports [AutoResolutionRule](/docs/api/defi/protocols/src/modules/tool-marketplace/disputes/types.md#autoresolutionrule)

***

### autoResolver

Re-exports [autoResolver](/docs/api/defi/protocols/src/modules/tool-marketplace/disputes/auto-resolver.md#autoresolver-1)

***

### AutoResolver

Re-exports [AutoResolver](/docs/api/defi/protocols/src/modules/tool-marketplace/disputes/auto-resolver.md#autoresolver)

***

### AutoResolverConfig

Re-exports [AutoResolverConfig](/docs/api/defi/protocols/src/modules/tool-marketplace/disputes/auto-resolver.md#autoresolverconfig)

***

### BadgeType

Re-exports [BadgeType](/docs/api/defi/protocols/src/modules/tool-marketplace/reputation/types.md#badgetype)

***

### BlocklistEntry

Re-exports [BlocklistEntry](/docs/api/defi/protocols/src/modules/tool-marketplace/access/types.md#blocklistentry)

***

### BotDetectionResult

Re-exports [BotDetectionResult](/docs/api/defi/protocols/src/modules/tool-marketplace/analytics/anomaly.md#botdetectionresult)

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

### CallMetrics

Re-exports [CallMetrics](/docs/api/defi/protocols/src/modules/tool-marketplace/analytics/collector.md#callmetrics)

***

### CallToolOptions

Re-exports [CallToolOptions](/docs/api/defi/protocols/src/modules/tool-marketplace/client.md#calltooloptions)

***

### CallToolResult

Re-exports [CallToolResult](/docs/api/defi/protocols/src/modules/tool-marketplace/client.md#calltoolresult)

***

### CategoryRevenue

Re-exports [CategoryRevenue](/docs/api/defi/protocols/src/modules/tool-marketplace/analytics/platform.md#categoryrevenue)

***

### ChainId

Re-exports [ChainId](/docs/api/defi/protocols/src/modules/tool-marketplace/contracts/addresses.md#chainid)

***

### ChurnPrediction

Re-exports [ChurnPrediction](/docs/api/defi/protocols/src/modules/tool-marketplace/analytics/predictions.md#churnprediction)

***

### ClickRecord

Re-exports [ClickRecord](/docs/api/defi/protocols/src/modules/tool-marketplace/discovery/types.md#clickrecord)

***

### CombinedFilter

Re-exports [CombinedFilter](/docs/api/defi/protocols/src/modules/tool-marketplace/discovery/types.md#combinedfilter)

***

### competitorAnalysis

Re-exports [competitorAnalysis](/docs/api/defi/protocols/src/modules/tool-marketplace/dashboard/competitor.md#competitoranalysis)

***

### CompetitorAnalysisReport

Re-exports [CompetitorAnalysisReport](/docs/api/defi/protocols/src/modules/tool-marketplace/dashboard/competitor.md#competitoranalysisreport)

***

### CompetitorAnalysisService

Re-exports [CompetitorAnalysisService](/docs/api/defi/protocols/src/modules/tool-marketplace/dashboard/competitor.md#competitoranalysisservice)

***

### CompetitorSummary

Re-exports [CompetitorSummary](/docs/api/defi/protocols/src/modules/tool-marketplace/dashboard/competitor.md#competitorsummary)

***

### configureDiscovery

Re-exports [configureDiscovery](/docs/api/defi/protocols/src/modules/tool-marketplace/discovery.md#configurediscovery)

***

### ContentSimilarity

Re-exports [ContentSimilarity](/docs/api/defi/protocols/src/modules/tool-marketplace/discovery/types.md#contentsimilarity)

***

### ContractAddresses

Re-exports [ContractAddresses](/docs/api/defi/protocols/src/modules/tool-marketplace/contracts/addresses.md#contractaddresses)

***

### ConversionFunnel

Re-exports [ConversionFunnel](/docs/api/defi/protocols/src/modules/tool-marketplace/analytics/platform.md#conversionfunnel)

***

### ConversionRecord

Re-exports [ConversionRecord](/docs/api/defi/protocols/src/modules/tool-marketplace/discovery/types.md#conversionrecord)

***

### CORSPolicy

Re-exports [CORSPolicy](/docs/api/defi/protocols/src/modules/tool-marketplace/verification/types.md#corspolicy)

***

### CoUsagePattern

Re-exports [CoUsagePattern](/docs/api/defi/protocols/src/modules/tool-marketplace/discovery/types.md#cousagepattern)

***

### CreateBundleInput

Re-exports [CreateBundleInput](/docs/api/defi/protocols/src/modules/tool-marketplace/discovery/types.md#createbundleinput)

***

### CreateDisputeInput

Re-exports [CreateDisputeInput](/docs/api/defi/protocols/src/modules/tool-marketplace/disputes/types.md#createdisputeinput)

***

### createExpressMiddleware

Re-exports [createExpressMiddleware](/docs/api/defi/protocols/src/modules/tool-marketplace/middleware/auth.md#createexpressmiddleware)

***

### createKeyValidator

Re-exports [createKeyValidator](/docs/api/defi/protocols/src/modules/tool-marketplace/middleware/auth.md#createkeyvalidator)

***

### createMarketplaceClient

Re-exports [createMarketplaceClient](/docs/api/defi/protocols/src/modules/tool-marketplace/client.md#createmarketplaceclient)

***

### createOnChainRegistry

Re-exports [createOnChainRegistry](/docs/api/defi/protocols/src/modules/tool-marketplace/contracts/OnChainRegistry.md#createonchainregistry)

***

### CreatorAnalytics

Re-exports [CreatorAnalytics](/docs/api/defi/protocols/src/modules/tool-marketplace/types.md#creatoranalytics)

***

### CreatorDashboard

Re-exports [CreatorDashboard](/docs/api/defi/protocols/src/modules/tool-marketplace/dashboard/creator.md#creatordashboard)

***

### creatorInsights

Re-exports [creatorInsights](/docs/api/defi/protocols/src/modules/tool-marketplace/dashboard/creator.md#creatorinsights)

***

### CreatorInsightsService

Re-exports [CreatorInsightsService](/docs/api/defi/protocols/src/modules/tool-marketplace/dashboard/creator.md#creatorinsightsservice)

***

### DataPoint

Re-exports [DataPoint](/docs/api/defi/protocols/src/modules/tool-marketplace/analytics/timeseries.md#datapoint)

***

### DEFAULT\_QUOTA\_CONFIG

Re-exports [DEFAULT_QUOTA_CONFIG](/docs/api/defi/protocols/src/modules/tool-marketplace/access/quotas.md#default_quota_config)

***

### DEFAULT\_TIERS

Re-exports [DEFAULT_TIERS](/docs/api/defi/protocols/src/modules/tool-marketplace/access/tiers.md#default_tiers)

***

### defaultStorage

Re-exports [defaultStorage](/docs/api/defi/protocols/src/modules/tool-marketplace/access/storage.md#defaultstorage)

***

### DemandPrediction

Re-exports [DemandPrediction](/docs/api/defi/protocols/src/modules/tool-marketplace/analytics/predictions.md#demandprediction)

***

### Dispute

Re-exports [Dispute](/docs/api/defi/protocols/src/modules/tool-marketplace/disputes/types.md#dispute)

***

### DisputeEvidence

Re-exports [DisputeEvidence](/docs/api/defi/protocols/src/modules/tool-marketplace/disputes/types.md#disputeevidence-1)

***

### DisputeFilter

Re-exports [DisputeFilter](/docs/api/defi/protocols/src/modules/tool-marketplace/disputes/types.md#disputefilter)

***

### disputeManager

Re-exports [disputeManager](/docs/api/defi/protocols/src/modules/tool-marketplace/disputes/manager.md#disputemanager-1)

***

### DisputeManager

Re-exports [DisputeManager](/docs/api/defi/protocols/src/modules/tool-marketplace/disputes/manager.md#disputemanager)

***

### DisputeManagerConfig

Re-exports [DisputeManagerConfig](/docs/api/defi/protocols/src/modules/tool-marketplace/disputes/manager.md#disputemanagerconfig)

***

### DisputeOutcome

Re-exports [DisputeOutcome](/docs/api/defi/protocols/src/modules/tool-marketplace/disputes/types.md#disputeoutcome-1)

***

### DisputeReason

Re-exports [DisputeReason](/docs/api/defi/protocols/src/modules/tool-marketplace/disputes/types.md#disputereason-1)

***

### DisputeState

Re-exports [DisputeState](/docs/api/defi/protocols/src/modules/tool-marketplace/disputes/types.md#disputestate-1)

***

### DisputeStats

Re-exports [DisputeStats](/docs/api/defi/protocols/src/modules/tool-marketplace/disputes/types.md#disputestats)

***

### DomainInfo

Re-exports [DomainInfo](/docs/api/defi/protocols/src/modules/tool-marketplace/verification/types.md#domaininfo)

***

### EndpointCheckResult

Re-exports [EndpointCheckResult](/docs/api/defi/protocols/src/modules/tool-marketplace/verification/types.md#endpointcheckresult)

***

### EndpointHealthStatus

Re-exports [EndpointHealthStatus](/docs/api/defi/protocols/src/modules/tool-marketplace/verification/types.md#endpointhealthstatus)

***

### endpointVerifier

Re-exports [endpointVerifier](/docs/api/defi/protocols/src/modules/tool-marketplace/verification/endpoint-verifier.md#endpointverifier-1)

***

### EndpointVerifier

Re-exports [EndpointVerifier](/docs/api/defi/protocols/src/modules/tool-marketplace/verification/endpoint-verifier.md#endpointverifier)

***

### EndpointVerifierConfig

Re-exports [EndpointVerifierConfig](/docs/api/defi/protocols/src/modules/tool-marketplace/verification/endpoint-verifier.md#endpointverifierconfig)

***

### EscalationDetails

Re-exports [EscalationDetails](/docs/api/defi/protocols/src/modules/tool-marketplace/disputes/types.md#escalationdetails)

***

### EvidenceType

Re-exports [EvidenceType](/docs/api/defi/protocols/src/modules/tool-marketplace/disputes/types.md#evidencetype)

***

### ExportFormat

Re-exports [ExportFormat](/docs/api/defi/protocols/src/modules/tool-marketplace/analytics/exports.md#exportformat)

***

### exportReporting

Re-exports [exportReporting](/docs/api/defi/protocols/src/modules/tool-marketplace/analytics/exports.md#exportreporting)

***

### ExportReportingService

Re-exports [ExportReportingService](/docs/api/defi/protocols/src/modules/tool-marketplace/analytics/exports.md#exportreportingservice)

***

### extractApiKey

Re-exports [extractApiKey](/docs/api/defi/protocols/src/modules/tool-marketplace/middleware/auth.md#extractapikey)

***

### fastifyMarketplaceAuth

Re-exports [fastifyMarketplaceAuth](/docs/api/defi/protocols/src/modules/tool-marketplace/middleware/auth.md#fastifymarketplaceauth)

***

### FeatureComparison

Re-exports [FeatureComparison](/docs/api/defi/protocols/src/modules/tool-marketplace/dashboard/competitor.md#featurecomparison-1)

***

### FeaturedTool

Re-exports [FeaturedTool](/docs/api/defi/protocols/src/modules/tool-marketplace/discovery/types.md#featuredtool)

***

### FeatureGap

Re-exports [FeatureGap](/docs/api/defi/protocols/src/modules/tool-marketplace/dashboard/competitor.md#featuregap)

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

### GeoData

Re-exports [GeoData](/docs/api/defi/protocols/src/modules/tool-marketplace/analytics/collector.md#geodata)

***

### GeoDistribution

Re-exports [GeoDistribution](/docs/api/defi/protocols/src/modules/tool-marketplace/analytics/collector.md#geodistribution)

***

### GeoRestriction

Re-exports [GeoRestriction](/docs/api/defi/protocols/src/modules/tool-marketplace/access/types.md#georestriction)

***

### getAllTiers

Re-exports [getAllTiers](/docs/api/defi/protocols/src/modules/tool-marketplace/access/tiers.md#getalltiers)

***

### getChainName

Re-exports [getChainName](/docs/api/defi/protocols/src/modules/tool-marketplace/contracts/addresses.md#getchainname)

***

### getContractAddresses

Re-exports [getContractAddresses](/docs/api/defi/protocols/src/modules/tool-marketplace/contracts/addresses.md#getcontractaddresses)

***

### getTier

Re-exports [getTier](/docs/api/defi/protocols/src/modules/tool-marketplace/access/tiers.md#gettier)

***

### GLOBAL\_RATE\_LIMITS

Re-exports [GLOBAL_RATE_LIMITS](/docs/api/defi/protocols/src/modules/tool-marketplace/access/rate-limiter.md#global_rate_limits)

***

### Granularity

Re-exports [Granularity](/docs/api/defi/protocols/src/modules/tool-marketplace/analytics/timeseries.md#granularity-2)

***

### GrowthMetrics

Re-exports [GrowthMetrics](/docs/api/defi/protocols/src/modules/tool-marketplace/analytics/platform.md#growthmetrics)

***

### HotTool

Re-exports [HotTool](/docs/api/defi/protocols/src/modules/tool-marketplace/discovery/types.md#hottool)

***

### initializeDiscovery

Re-exports [initializeDiscovery](/docs/api/defi/protocols/src/modules/tool-marketplace/discovery.md#initializediscovery)

***

### InMemoryStorageAdapter

Re-exports [InMemoryStorageAdapter](/docs/api/defi/protocols/src/modules/tool-marketplace/access/storage.md#inmemorystorageadapter)

***

### isTestnet

Re-exports [isTestnet](/docs/api/defi/protocols/src/modules/tool-marketplace/contracts/addresses.md#istestnet)

***

### isValidTierName

Re-exports [isValidTierName](/docs/api/defi/protocols/src/modules/tool-marketplace/access/tiers.md#isvalidtiername)

***

### keyManager

Re-exports [keyManager](/docs/api/defi/protocols/src/modules/tool-marketplace/access/key-manager.md#keymanager-1)

***

### KeyManager

Re-exports [KeyManager](/docs/api/defi/protocols/src/modules/tool-marketplace/access/key-manager.md#keymanager)

***

### KeyValidationResult

Re-exports [KeyValidationResult](/docs/api/defi/protocols/src/modules/tool-marketplace/access/types.md#keyvalidationresult)

***

### LeaderboardEntry

Re-exports [LeaderboardEntry](/docs/api/defi/protocols/src/modules/tool-marketplace/reputation/types.md#leaderboardentry)

***

### MarketplaceAuthOptions

Re-exports [MarketplaceAuthOptions](/docs/api/defi/protocols/src/modules/tool-marketplace/middleware/auth.md#marketplaceauthoptions)

***

### MarketplaceClient

Re-exports [MarketplaceClient](/docs/api/defi/protocols/src/modules/tool-marketplace/client.md#marketplaceclient)

***

### MarketplaceEvent

Re-exports [MarketplaceEvent](/docs/api/defi/protocols/src/modules/tool-marketplace/types.md#marketplaceevent)

***

### MarketplaceEventType

Re-exports [MarketplaceEventType](/docs/api/defi/protocols/src/modules/tool-marketplace/types.md#marketplaceeventtype-1)

***

### MarketplaceRequest

Re-exports [MarketplaceRequest](/docs/api/defi/protocols/src/modules/tool-marketplace/middleware/auth.md#marketplacerequest)

***

### MarketplaceStats

Re-exports [MarketplaceStats](/docs/api/defi/protocols/src/modules/tool-marketplace/types.md#marketplacestats)

***

### MarketShare

Re-exports [MarketShare](/docs/api/defi/protocols/src/modules/tool-marketplace/dashboard/competitor.md#marketshare-1)

***

### METRIC\_NAMES

Re-exports [METRIC_NAMES](/docs/api/defi/protocols/src/modules/tool-marketplace/analytics/collector.md#metric_names)

***

### MetricDefinition

Re-exports [MetricDefinition](/docs/api/defi/protocols/src/modules/tool-marketplace/analytics/timeseries.md#metricdefinition)

***

### metricsCollector

Re-exports [metricsCollector](/docs/api/defi/protocols/src/modules/tool-marketplace/analytics/collector.md#metricscollector)

***

### MetricsCollectorService

Re-exports [MetricsCollectorService](/docs/api/defi/protocols/src/modules/tool-marketplace/analytics/collector.md#metricscollectorservice)

***

### MiddlewareResult

Re-exports [MiddlewareResult](/docs/api/defi/protocols/src/modules/tool-marketplace/middleware/auth.md#middlewareresult)

***

### NewTool

Re-exports [NewTool](/docs/api/defi/protocols/src/modules/tool-marketplace/discovery/types.md#newtool)

***

### OnChainRegistry

Re-exports [OnChainRegistry](/docs/api/defi/protocols/src/modules/tool-marketplace/contracts/OnChainRegistry.md#onchainregistry)

***

### OnChainRevenueSplit

Renames and re-exports [RevenueSplit](/docs/api/defi/protocols/src/modules/tool-marketplace/contracts/OnChainRegistry.md#revenuesplit)

***

### OnChainTool

Re-exports [OnChainTool](/docs/api/defi/protocols/src/modules/tool-marketplace/contracts/OnChainRegistry.md#onchaintool)

***

### PayoutConfig

Re-exports [PayoutConfig](/docs/api/defi/protocols/src/modules/tool-marketplace/types.md#payoutconfig)

***

### PayoutRecord

Re-exports [PayoutRecord](/docs/api/defi/protocols/src/modules/tool-marketplace/revenue.md#payoutrecord)

***

### PendingPayout

Re-exports [PendingPayout](/docs/api/defi/protocols/src/modules/tool-marketplace/revenue.md#pendingpayout)

***

### Permission

Re-exports [Permission](/docs/api/defi/protocols/src/modules/tool-marketplace/access/types.md#permission)

***

### PermissionScope

Re-exports [PermissionScope](/docs/api/defi/protocols/src/modules/tool-marketplace/access/types.md#permissionscope-1)

***

### platformAnalytics

Re-exports [platformAnalytics](/docs/api/defi/protocols/src/modules/tool-marketplace/analytics/platform.md#platformanalytics)

***

### PlatformAnalyticsOverview

Re-exports [PlatformAnalyticsOverview](/docs/api/defi/protocols/src/modules/tool-marketplace/analytics/platform.md#platformanalyticsoverview)

***

### PlatformAnalyticsService

Re-exports [PlatformAnalyticsService](/docs/api/defi/protocols/src/modules/tool-marketplace/analytics/platform.md#platformanalyticsservice)

***

### PlatformHealth

Re-exports [PlatformHealth](/docs/api/defi/protocols/src/modules/tool-marketplace/analytics/platform.md#platformhealth)

***

### predictiveAnalytics

Re-exports [predictiveAnalytics](/docs/api/defi/protocols/src/modules/tool-marketplace/analytics/predictions.md#predictiveanalytics)

***

### PredictiveAnalyticsService

Re-exports [PredictiveAnalyticsService](/docs/api/defi/protocols/src/modules/tool-marketplace/analytics/predictions.md#predictiveanalyticsservice)

***

### PriceBenchmark

Re-exports [PriceBenchmark](/docs/api/defi/protocols/src/modules/tool-marketplace/dashboard/competitor.md#pricebenchmark-1)

***

### PriceRangeFilter

Re-exports [PriceRangeFilter](/docs/api/defi/protocols/src/modules/tool-marketplace/discovery/types.md#pricerangefilter)

***

### PricingModel

Re-exports [PricingModel](/docs/api/defi/protocols/src/modules/tool-marketplace/types.md#pricingmodel-1)

***

### PricingOptimization

Re-exports [PricingOptimization](/docs/api/defi/protocols/src/modules/tool-marketplace/analytics/predictions.md#pricingoptimization)

***

### QuotaConfig

Re-exports [QuotaConfig](/docs/api/defi/protocols/src/modules/tool-marketplace/access/types.md#quotaconfig)

***

### quotaManager

Re-exports [quotaManager](/docs/api/defi/protocols/src/modules/tool-marketplace/access/quotas.md#quotamanager-1)

***

### QuotaManager

Re-exports [QuotaManager](/docs/api/defi/protocols/src/modules/tool-marketplace/access/quotas.md#quotamanager)

***

### QuotaStatus

Re-exports [QuotaStatus](/docs/api/defi/protocols/src/modules/tool-marketplace/access/types.md#quotastatus)

***

### RateLimit

Re-exports [RateLimit](/docs/api/defi/protocols/src/modules/tool-marketplace/access/types.md#ratelimit-4)

***

### rateLimiter

Re-exports [rateLimiter](/docs/api/defi/protocols/src/modules/tool-marketplace/access/rate-limiter.md#ratelimiter-1)

***

### RateLimiter

Re-exports [RateLimiter](/docs/api/defi/protocols/src/modules/tool-marketplace/access/rate-limiter.md#ratelimiter)

***

### RateLimitStatus

Re-exports [RateLimitStatus](/docs/api/defi/protocols/src/modules/tool-marketplace/access/types.md#ratelimitstatus-1)

***

### RatePeriod

Re-exports [RatePeriod](/docs/api/defi/protocols/src/modules/tool-marketplace/access/types.md#rateperiod)

***

### Rating

Re-exports [Rating](/docs/api/defi/protocols/src/modules/tool-marketplace/reputation/types.md#rating)

***

### RatingRateLimit

Re-exports [RatingRateLimit](/docs/api/defi/protocols/src/modules/tool-marketplace/reputation/types.md#ratingratelimit)

***

### RatingReport

Re-exports [RatingReport](/docs/api/defi/protocols/src/modules/tool-marketplace/reputation/types.md#ratingreport)

***

### ratingService

Re-exports [ratingService](/docs/api/defi/protocols/src/modules/tool-marketplace/reputation/rating.md#ratingservice-1)

***

### RatingService

Re-exports [RatingService](/docs/api/defi/protocols/src/modules/tool-marketplace/reputation/rating.md#ratingservice)

***

### RatingServiceConfig

Re-exports [RatingServiceConfig](/docs/api/defi/protocols/src/modules/tool-marketplace/reputation/rating.md#ratingserviceconfig)

***

### RatingSummary

Re-exports [RatingSummary](/docs/api/defi/protocols/src/modules/tool-marketplace/reputation/types.md#ratingsummary)

***

### RatingValue

Re-exports [RatingValue](/docs/api/defi/protocols/src/modules/tool-marketplace/reputation/types.md#ratingvalue-1)

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

### RedirectInfo

Re-exports [RedirectInfo](/docs/api/defi/protocols/src/modules/tool-marketplace/verification/types.md#redirectinfo)

***

### registerAccessControlTools

Re-exports [registerAccessControlTools](/docs/api/defi/protocols/src/modules/tool-marketplace/access/tools.md#registeraccesscontroltools)

***

### registerAnalyticsMCPTools

Re-exports [registerAnalyticsMCPTools](/docs/api/defi/protocols/src/modules/tool-marketplace/analytics/tools.md#registeranalyticsmcptools)

***

### registerDiscoveryTools

Re-exports [registerDiscoveryTools](/docs/api/defi/protocols/src/modules/tool-marketplace/discovery/tools.md#registerdiscoverytools)

***

### RegisteredTool

Re-exports [RegisteredTool](/docs/api/defi/protocols/src/modules/tool-marketplace/types.md#registeredtool)

***

### RegisterToolInput

Re-exports [RegisterToolInput](/docs/api/defi/protocols/src/modules/tool-marketplace/types.md#registertoolinput)

***

### RegisterToolParams

Re-exports [RegisterToolParams](/docs/api/defi/protocols/src/modules/tool-marketplace/contracts/OnChainRegistry.md#registertoolparams)

***

### ReputationBadge

Re-exports [ReputationBadge](/docs/api/defi/protocols/src/modules/tool-marketplace/reputation/types.md#reputationbadge)

***

### ReputationHistoryEntry

Re-exports [ReputationHistoryEntry](/docs/api/defi/protocols/src/modules/tool-marketplace/reputation/types.md#reputationhistoryentry)

***

### ReputationScore

Re-exports [ReputationScore](/docs/api/defi/protocols/src/modules/tool-marketplace/reputation/types.md#reputationscore)

***

### ReputationScoreBreakdown

Re-exports [ReputationScoreBreakdown](/docs/api/defi/protocols/src/modules/tool-marketplace/reputation/types.md#reputationscorebreakdown-1)

***

### reputationScorer

Re-exports [reputationScorer](/docs/api/defi/protocols/src/modules/tool-marketplace/reputation/score.md#reputationscorer-1)

***

### ReputationScorer

Re-exports [ReputationScorer](/docs/api/defi/protocols/src/modules/tool-marketplace/reputation/score.md#reputationscorer)

***

### ReputationScorerConfig

Re-exports [ReputationScorerConfig](/docs/api/defi/protocols/src/modules/tool-marketplace/reputation/score.md#reputationscorerconfig)

***

### ResponseTimeMetrics

Re-exports [ResponseTimeMetrics](/docs/api/defi/protocols/src/modules/tool-marketplace/analytics/collector.md#responsetimemetrics)

***

### RetentionPolicy

Re-exports [RetentionPolicy](/docs/api/defi/protocols/src/modules/tool-marketplace/analytics/timeseries.md#retentionpolicy)

***

### REVENUE\_ROUTER\_ABI

Re-exports [REVENUE_ROUTER_ABI](/docs/api/defi/protocols/src/modules/tool-marketplace/contracts/abis.md#revenue_router_abi)

***

### RevenueDistribution

Re-exports [RevenueDistribution](/docs/api/defi/protocols/src/modules/tool-marketplace/revenue.md#revenuedistribution)

***

### RevenueForecast

Re-exports [RevenueForecast](/docs/api/defi/protocols/src/modules/tool-marketplace/analytics/predictions.md#revenueforecast)

***

### RevenueMetrics

Re-exports [RevenueMetrics](/docs/api/defi/protocols/src/modules/tool-marketplace/analytics/collector.md#revenuemetrics)

***

### RevenueSplit

Re-exports [RevenueSplit](/docs/api/defi/protocols/src/modules/tool-marketplace/types.md#revenuesplit-2)

***

### revenueSplitter

Re-exports [revenueSplitter](/docs/api/defi/protocols/src/modules/tool-marketplace/revenue.md#revenuesplitter)

***

### RevenueSplitterService

Re-exports [RevenueSplitterService](/docs/api/defi/protocols/src/modules/tool-marketplace/revenue.md#revenuesplitterservice)

***

### RisingStarTool

Re-exports [RisingStarTool](/docs/api/defi/protocols/src/modules/tool-marketplace/discovery/types.md#risingstartool)

***

### ScheduledReportConfig

Re-exports [ScheduledReportConfig](/docs/api/defi/protocols/src/modules/tool-marketplace/analytics/exports.md#scheduledreportconfig)

***

### SchemaError

Re-exports [SchemaError](/docs/api/defi/protocols/src/modules/tool-marketplace/verification/types.md#schemaerror)

***

### SchemaValidationResult

Re-exports [SchemaValidationResult](/docs/api/defi/protocols/src/modules/tool-marketplace/verification/types.md#schemavalidationresult)

***

### schemaValidator

Re-exports [schemaValidator](/docs/api/defi/protocols/src/modules/tool-marketplace/verification/schema-validator.md#schemavalidator-1)

***

### SchemaValidator

Re-exports [SchemaValidator](/docs/api/defi/protocols/src/modules/tool-marketplace/verification/schema-validator.md#schemavalidator)

***

### SchemaWarning

Re-exports [SchemaWarning](/docs/api/defi/protocols/src/modules/tool-marketplace/verification/types.md#schemawarning)

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

### SecurityFinding

Re-exports [SecurityFinding](/docs/api/defi/protocols/src/modules/tool-marketplace/verification/types.md#securityfinding)

***

### securityScanner

Re-exports [securityScanner](/docs/api/defi/protocols/src/modules/tool-marketplace/verification/security-scanner.md#securityscanner-1)

***

### SecurityScanner

Re-exports [SecurityScanner](/docs/api/defi/protocols/src/modules/tool-marketplace/verification/security-scanner.md#securityscanner)

***

### SecurityScannerConfig

Re-exports [SecurityScannerConfig](/docs/api/defi/protocols/src/modules/tool-marketplace/verification/security-scanner.md#securityscannerconfig)

***

### SecurityScanResult

Re-exports [SecurityScanResult](/docs/api/defi/protocols/src/modules/tool-marketplace/verification/types.md#securityscanresult)

***

### SecuritySeverity

Re-exports [SecuritySeverity](/docs/api/defi/protocols/src/modules/tool-marketplace/verification/types.md#securityseverity)

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

### SSLCertificateInfo

Re-exports [SSLCertificateInfo](/docs/api/defi/protocols/src/modules/tool-marketplace/verification/types.md#sslcertificateinfo)

***

### StakeInfo

Re-exports [StakeInfo](/docs/api/defi/protocols/src/modules/tool-marketplace/contracts/OnChainRegistry.md#stakeinfo)

***

### strikeManager

Re-exports [strikeManager](/docs/api/defi/protocols/src/modules/tool-marketplace/access/lists.md#strikemanager-1)

***

### StrikeManager

Re-exports [StrikeManager](/docs/api/defi/protocols/src/modules/tool-marketplace/access/lists.md#strikemanager)

***

### Subscription

Re-exports [Subscription](/docs/api/defi/protocols/src/modules/tool-marketplace/access/types.md#subscription)

***

### subscriptionManager

Re-exports [subscriptionManager](/docs/api/defi/protocols/src/modules/tool-marketplace/access/subscriptions.md#subscriptionmanager-1)

***

### SubscriptionManager

Re-exports [SubscriptionManager](/docs/api/defi/protocols/src/modules/tool-marketplace/access/subscriptions.md#subscriptionmanager)

***

### SubscriptionRenewalScheduler

Re-exports [SubscriptionRenewalScheduler](/docs/api/defi/protocols/src/modules/tool-marketplace/access/subscriptions.md#subscriptionrenewalscheduler)

***

### SubscriptionState

Re-exports [SubscriptionState](/docs/api/defi/protocols/src/modules/tool-marketplace/access/types.md#subscriptionstate-1)

***

### SubscriptionStatus

Re-exports [SubscriptionStatus](/docs/api/defi/protocols/src/modules/tool-marketplace/types.md#subscriptionstatus)

***

### SubscriptionTier

Re-exports [SubscriptionTier](/docs/api/defi/protocols/src/modules/tool-marketplace/types.md#subscriptiontier)

***

### SynonymMap

Re-exports [SynonymMap](/docs/api/defi/protocols/src/modules/tool-marketplace/discovery/types.md#synonymmap)

***

### TieredPricing

Re-exports [TieredPricing](/docs/api/defi/protocols/src/modules/tool-marketplace/types.md#tieredpricing)

***

### timeseriesDB

Re-exports [timeseriesDB](/docs/api/defi/protocols/src/modules/tool-marketplace/analytics/timeseries.md#timeseriesdb-1)

***

### TimeSeriesDB

Re-exports [TimeSeriesDB](/docs/api/defi/protocols/src/modules/tool-marketplace/analytics/timeseries.md#timeseriesdb)

***

### TimeSeriesQueryOptions

Re-exports [TimeSeriesQueryOptions](/docs/api/defi/protocols/src/modules/tool-marketplace/analytics/timeseries.md#timeseriesqueryoptions)

***

### TOOL\_REGISTRY\_ABI

Re-exports [TOOL_REGISTRY_ABI](/docs/api/defi/protocols/src/modules/tool-marketplace/contracts/abis.md#tool_registry_abi)

***

### TOOL\_STAKING\_ABI

Re-exports [TOOL_STAKING_ABI](/docs/api/defi/protocols/src/modules/tool-marketplace/contracts/abis.md#tool_staking_abi)

***

### ToolAlternative

Re-exports [ToolAlternative](/docs/api/defi/protocols/src/modules/tool-marketplace/discovery/types.md#toolalternative)

***

### ToolBadges

Re-exports [ToolBadges](/docs/api/defi/protocols/src/modules/tool-marketplace/verification/types.md#toolbadges)

***

### ToolBundle

Re-exports [ToolBundle](/docs/api/defi/protocols/src/modules/tool-marketplace/discovery/types.md#toolbundle)

***

### ToolCategory

Re-exports [ToolCategory](/docs/api/defi/protocols/src/modules/tool-marketplace/types.md#toolcategory)

***

### ToolComparison

Re-exports [ToolComparison](/docs/api/defi/protocols/src/modules/tool-marketplace/discovery/types.md#toolcomparison)

***

### ToolDiscoveryFilter

Re-exports [ToolDiscoveryFilter](/docs/api/defi/protocols/src/modules/tool-marketplace/types.md#tooldiscoveryfilter)

***

### ToolEmbedding

Re-exports [ToolEmbedding](/docs/api/defi/protocols/src/modules/tool-marketplace/discovery/types.md#toolembedding)

***

### ToolInsights

Re-exports [ToolInsights](/docs/api/defi/protocols/src/modules/tool-marketplace/dashboard/creator.md#toolinsights)

***

### ToolMetadata

Re-exports [ToolMetadata](/docs/api/defi/protocols/src/modules/tool-marketplace/types.md#toolmetadata)

***

### ToolPricing

Re-exports [ToolPricing](/docs/api/defi/protocols/src/modules/tool-marketplace/types.md#toolpricing)

***

### toolRegistry

Re-exports [toolRegistry](/docs/api/defi/protocols/src/modules/tool-marketplace/registry.md#toolregistry)

***

### ToolRegistryEvents

Re-exports [ToolRegistryEvents](/docs/api/defi/protocols/src/modules/tool-marketplace/contracts/OnChainRegistry.md#toolregistryevents)

***

### ToolRegistryService

Re-exports [ToolRegistryService](/docs/api/defi/protocols/src/modules/tool-marketplace/registry.md#toolregistryservice)

***

### ToolReport

Re-exports [ToolReport](/docs/api/defi/protocols/src/modules/tool-marketplace/reputation/types.md#toolreport)

***

### ToolRevenue

Re-exports [ToolRevenue](/docs/api/defi/protocols/src/modules/tool-marketplace/types.md#toolrevenue)

***

### ToolSchema

Re-exports [ToolSchema](/docs/api/defi/protocols/src/modules/tool-marketplace/verification/types.md#toolschema)

***

### ToolStatus

Re-exports [ToolStatus](/docs/api/defi/protocols/src/modules/tool-marketplace/types.md#toolstatus)

***

### ToolUsageRecord

Re-exports [ToolUsageRecord](/docs/api/defi/protocols/src/modules/tool-marketplace/types.md#toolusagerecord)

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

### TrustTier

Re-exports [TrustTier](/docs/api/defi/protocols/src/modules/tool-marketplace/reputation/types.md#trusttier)

***

### UIFormatter

Re-exports [UIFormatter](/docs/api/defi/protocols/src/modules/tool-marketplace/discovery/ui.md#uiformatter)

***

### UptimeRecord

Re-exports [UptimeRecord](/docs/api/defi/protocols/src/modules/tool-marketplace/verification/types.md#uptimerecord)

***

### UsageHeatmap

Re-exports [UsageHeatmap](/docs/api/defi/protocols/src/modules/tool-marketplace/dashboard/creator.md#usageheatmap)

***

### UserDisputeLimits

Re-exports [UserDisputeLimits](/docs/api/defi/protocols/src/modules/tool-marketplace/disputes/types.md#userdisputelimits)

***

### UserMetrics

Re-exports [UserMetrics](/docs/api/defi/protocols/src/modules/tool-marketplace/analytics/collector.md#usermetrics)

***

### UserProfile

Re-exports [UserProfile](/docs/api/defi/protocols/src/modules/tool-marketplace/discovery/types.md#userprofile)

***

### VerificationBadge

Re-exports [VerificationBadge](/docs/api/defi/protocols/src/modules/tool-marketplace/verification/types.md#verificationbadge)

***

### VerificationEventType

Re-exports [VerificationEventType](/docs/api/defi/protocols/src/modules/tool-marketplace/verification/types.md#verificationeventtype)

***

### VerificationHistoryEntry

Re-exports [VerificationHistoryEntry](/docs/api/defi/protocols/src/modules/tool-marketplace/verification/types.md#verificationhistoryentry)

***

### VerificationJob

Re-exports [VerificationJob](/docs/api/defi/protocols/src/modules/tool-marketplace/verification/types.md#verificationjob)

***

### VerificationRecord

Re-exports [VerificationRecord](/docs/api/defi/protocols/src/modules/tool-marketplace/verification/types.md#verificationrecord)

***

### VerificationRequest

Re-exports [VerificationRequest](/docs/api/defi/protocols/src/modules/tool-marketplace/verification/types.md#verificationrequest)

***

### VerificationStatus

Re-exports [VerificationStatus](/docs/api/defi/protocols/src/modules/tool-marketplace/verification/types.md#verificationstatus)

***

### VerificationWebhook

Re-exports [VerificationWebhook](/docs/api/defi/protocols/src/modules/tool-marketplace/verification/types.md#verificationwebhook)

***

### VerificationWorkerManager

Re-exports [VerificationWorkerManager](/docs/api/defi/protocols/src/modules/tool-marketplace/workers.md#verificationworkermanager)

***

### WebhookConfig

Re-exports [WebhookConfig](/docs/api/defi/protocols/src/modules/tool-marketplace/analytics/exports.md#webhookconfig)

***

### WebhookEvent

Re-exports [WebhookEvent](/docs/api/defi/protocols/src/modules/tool-marketplace/analytics/exports.md#webhookevent)

***

### WebhookEventType

Re-exports [WebhookEventType](/docs/api/defi/protocols/src/modules/tool-marketplace/analytics/exports.md#webhookeventtype-1)

***

### WorkerConfig

Re-exports [WorkerConfig](/docs/api/defi/protocols/src/modules/tool-marketplace/workers.md#workerconfig)

***

### workerManager

Re-exports [workerManager](/docs/api/defi/protocols/src/modules/tool-marketplace/workers.md#workermanager)

***

### ZeroResultQuery

Re-exports [ZeroResultQuery](/docs/api/defi/protocols/src/modules/tool-marketplace/discovery/types.md#zeroresultquery)
