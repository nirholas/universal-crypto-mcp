[**Universal Crypto MCP API Reference v1.0.0**](../../../../../index.md)

***

[Universal Crypto MCP API Reference](/docs/api/index.md) / defi/protocols/src/x402/server/types

# defi/protocols/src/x402/server/types

## Interfaces

### AnalyticsQueryOptions

Defined in: [defi/protocols/src/x402/server/types.ts:401](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/x402/server/types.ts#L401)

Analytics query options

#### Extended by

- [`ExportOptions`](/docs/api/defi/protocols/src/x402/server/types.md#exportoptions)

#### Properties

| Property | Type | Description | Defined in |
| :------ | :------ | :------ | :------ |
| <a id="chain"></a> `chain?` | [`X402Chain`](/docs/api/defi/protocols/src/x402/sdk/types.md#x402chain) | Filter by chain | [defi/protocols/src/x402/server/types.ts:413](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/x402/server/types.ts#L413) |
| <a id="endtime"></a> `endTime?` | `number` | End timestamp | [defi/protocols/src/x402/server/types.ts:405](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/x402/server/types.ts#L405) |
| <a id="groupby"></a> `groupBy?` | `"day"` \| `"week"` \| `"month"` \| `"hour"` | Group by period (hour, day, week, month) | [defi/protocols/src/x402/server/types.ts:407](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/x402/server/types.ts#L407) |
| <a id="limit"></a> `limit?` | `number` | Maximum results | [defi/protocols/src/x402/server/types.ts:415](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/x402/server/types.ts#L415) |
| <a id="payer"></a> `payer?` | `` `0x${string}` `` | Filter by payer | [defi/protocols/src/x402/server/types.ts:411](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/x402/server/types.ts#L411) |
| <a id="resource"></a> `resource?` | `string` | Filter by resource | [defi/protocols/src/x402/server/types.ts:409](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/x402/server/types.ts#L409) |
| <a id="starttime"></a> `startTime?` | `number` | Start timestamp | [defi/protocols/src/x402/server/types.ts:403](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/x402/server/types.ts#L403) |

***

### DynamicPricingOptions

Defined in: [defi/protocols/src/x402/server/types.ts:257](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/x402/server/types.ts#L257)

Dynamic pricing options

#### Properties

| Property | Type | Description | Defined in |
| :------ | :------ | :------ | :------ |
| <a id="base"></a> `base` | `string` | Base price per request | [defi/protocols/src/x402/server/types.ts:259](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/x402/server/types.ts#L259) |
| <a id="discount"></a> `discount?` | (`ctx`: [`PricingContext`](/docs/api/defi/protocols/src/x402/server/types.md#pricingcontext)) => `number` \| `Promise`\<`number`\> | Discount function (returns multiplier 0-1) | [defi/protocols/src/x402/server/types.ts:269](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/x402/server/types.ts#L269) |
| <a id="maxprice"></a> `maxPrice?` | `string` | Maximum price | [defi/protocols/src/x402/server/types.ts:273](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/x402/server/types.ts#L273) |
| <a id="minprice"></a> `minPrice?` | `string` | Minimum price | [defi/protocols/src/x402/server/types.ts:271](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/x402/server/types.ts#L271) |
| <a id="network"></a> `network` | [`X402Chain`](/docs/api/defi/protocols/src/x402/sdk/types.md#x402chain) | Network | [defi/protocols/src/x402/server/types.ts:277](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/x402/server/types.ts#L277) |
| <a id="perkb"></a> `perKB?` | `string` | Additional price per KB of response | [defi/protocols/src/x402/server/types.ts:263](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/x402/server/types.ts#L263) |
| <a id="persecond"></a> `perSecond?` | `string` | Additional price per second of compute | [defi/protocols/src/x402/server/types.ts:265](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/x402/server/types.ts#L265) |
| <a id="pertoken"></a> `perToken?` | `string` | Additional price per token (for AI endpoints) | [defi/protocols/src/x402/server/types.ts:261](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/x402/server/types.ts#L261) |
| <a id="surge"></a> `surge?` | (`ctx`: [`PricingContext`](/docs/api/defi/protocols/src/x402/server/types.md#pricingcontext)) => `number` \| `Promise`\<`number`\> | Surge pricing multiplier function | [defi/protocols/src/x402/server/types.ts:267](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/x402/server/types.ts#L267) |
| <a id="token"></a> `token` | [`X402Token`](/docs/api/defi/protocols/src/x402/sdk/types.md#x402token) | Token for pricing | [defi/protocols/src/x402/server/types.ts:275](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/x402/server/types.ts#L275) |

***

### EarningsInfo

Defined in: [defi/protocols/src/x402/server/types.ts:482](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/x402/server/types.ts#L482)

Earnings info

#### Properties

| Property | Type | Description | Defined in |
| :------ | :------ | :------ | :------ |
| <a id="available"></a> `available` | `string` | Available for withdrawal | [defi/protocols/src/x402/server/types.ts:494](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/x402/server/types.ts#L494) |
| <a id="chain-1"></a> `chain` | [`X402Chain`](/docs/api/defi/protocols/src/x402/sdk/types.md#x402chain) | Chain | [defi/protocols/src/x402/server/types.ts:498](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/x402/server/types.ts#L498) |
| <a id="pending"></a> `pending` | `string` | Pending settlements | [defi/protocols/src/x402/server/types.ts:492](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/x402/server/types.ts#L492) |
| <a id="thismonth"></a> `thisMonth` | `string` | This month's earnings | [defi/protocols/src/x402/server/types.ts:490](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/x402/server/types.ts#L490) |
| <a id="thisweek"></a> `thisWeek` | `string` | This week's earnings | [defi/protocols/src/x402/server/types.ts:488](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/x402/server/types.ts#L488) |
| <a id="today"></a> `today` | `string` | Today's earnings | [defi/protocols/src/x402/server/types.ts:486](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/x402/server/types.ts#L486) |
| <a id="token-1"></a> `token` | [`X402Token`](/docs/api/defi/protocols/src/x402/sdk/types.md#x402token) | Token | [defi/protocols/src/x402/server/types.ts:496](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/x402/server/types.ts#L496) |
| <a id="total"></a> `total` | `string` | Total earnings | [defi/protocols/src/x402/server/types.ts:484](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/x402/server/types.ts#L484) |

***

### EndpointRevenue

Defined in: [defi/protocols/src/x402/server/types.ts:371](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/x402/server/types.ts#L371)

Revenue by endpoint

#### Properties

| Property | Type | Description | Defined in |
| :------ | :------ | :------ | :------ |
| <a id="count"></a> `count` | `number` | Number of payments | [defi/protocols/src/x402/server/types.ts:377](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/x402/server/types.ts#L377) |
| <a id="percentage"></a> `percentage` | `number` | Percentage of total revenue | [defi/protocols/src/x402/server/types.ts:379](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/x402/server/types.ts#L379) |
| <a id="resource-1"></a> `resource` | `string` | Resource/endpoint path | [defi/protocols/src/x402/server/types.ts:373](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/x402/server/types.ts#L373) |
| <a id="total-1"></a> `total` | `string` | Total revenue | [defi/protocols/src/x402/server/types.ts:375](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/x402/server/types.ts#L375) |

***

### ExportOptions

Defined in: [defi/protocols/src/x402/server/types.ts:426](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/x402/server/types.ts#L426)

Analytics export options

#### Extends

- [`AnalyticsQueryOptions`](/docs/api/defi/protocols/src/x402/server/types.md#analyticsqueryoptions)

#### Properties

| Property | Type | Description | Inherited from | Defined in |
| :------ | :------ | :------ | :------ | :------ |
| <a id="chain-2"></a> `chain?` | [`X402Chain`](/docs/api/defi/protocols/src/x402/sdk/types.md#x402chain) | Filter by chain | [`AnalyticsQueryOptions`](/docs/api/defi/protocols/src/x402/server/types.md#analyticsqueryoptions).[`chain`](/docs/api/defi/protocols/src/x402/server/types.md#chain) | [defi/protocols/src/x402/server/types.ts:413](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/x402/server/types.ts#L413) |
| <a id="endtime-1"></a> `endTime?` | `number` | End timestamp | [`AnalyticsQueryOptions`](/docs/api/defi/protocols/src/x402/server/types.md#analyticsqueryoptions).[`endTime`](/docs/api/defi/protocols/src/x402/server/types.md#endtime) | [defi/protocols/src/x402/server/types.ts:405](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/x402/server/types.ts#L405) |
| <a id="format"></a> `format` | [`ExportFormat`](/docs/api/defi/protocols/src/x402/server/types.md#exportformat) | Export format | - | [defi/protocols/src/x402/server/types.ts:428](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/x402/server/types.ts#L428) |
| <a id="groupby-1"></a> `groupBy?` | `"day"` \| `"week"` \| `"month"` \| `"hour"` | Group by period (hour, day, week, month) | [`AnalyticsQueryOptions`](/docs/api/defi/protocols/src/x402/server/types.md#analyticsqueryoptions).[`groupBy`](/docs/api/defi/protocols/src/x402/server/types.md#groupby) | [defi/protocols/src/x402/server/types.ts:407](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/x402/server/types.ts#L407) |
| <a id="includemetadata"></a> `includeMetadata?` | `boolean` | Include metadata columns | - | [defi/protocols/src/x402/server/types.ts:430](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/x402/server/types.ts#L430) |
| <a id="limit-1"></a> `limit?` | `number` | Maximum results | [`AnalyticsQueryOptions`](/docs/api/defi/protocols/src/x402/server/types.md#analyticsqueryoptions).[`limit`](/docs/api/defi/protocols/src/x402/server/types.md#limit) | [defi/protocols/src/x402/server/types.ts:415](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/x402/server/types.ts#L415) |
| <a id="payer-1"></a> `payer?` | `` `0x${string}` `` | Filter by payer | [`AnalyticsQueryOptions`](/docs/api/defi/protocols/src/x402/server/types.md#analyticsqueryoptions).[`payer`](/docs/api/defi/protocols/src/x402/server/types.md#payer) | [defi/protocols/src/x402/server/types.ts:411](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/x402/server/types.ts#L411) |
| <a id="resource-2"></a> `resource?` | `string` | Filter by resource | [`AnalyticsQueryOptions`](/docs/api/defi/protocols/src/x402/server/types.md#analyticsqueryoptions).[`resource`](/docs/api/defi/protocols/src/x402/server/types.md#resource) | [defi/protocols/src/x402/server/types.ts:409](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/x402/server/types.ts#L409) |
| <a id="starttime-1"></a> `startTime?` | `number` | Start timestamp | [`AnalyticsQueryOptions`](/docs/api/defi/protocols/src/x402/server/types.md#analyticsqueryoptions).[`startTime`](/docs/api/defi/protocols/src/x402/server/types.md#starttime) | [defi/protocols/src/x402/server/types.ts:403](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/x402/server/types.ts#L403) |

***

### FacilitatorBalance

Defined in: [defi/protocols/src/x402/server/types.ts:169](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/x402/server/types.ts#L169)

Facilitator balance info

#### Properties

| Property | Type | Description | Defined in |
| :------ | :------ | :------ | :------ |
| <a id="available-1"></a> `available` | `string` | Available balance (can withdraw) | [defi/protocols/src/x402/server/types.ts:171](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/x402/server/types.ts#L171) |
| <a id="chain-3"></a> `chain` | [`X402Chain`](/docs/api/defi/protocols/src/x402/sdk/types.md#x402chain) | Chain | [defi/protocols/src/x402/server/types.ts:179](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/x402/server/types.ts#L179) |
| <a id="pending-1"></a> `pending` | `string` | Pending balance (settling) | [defi/protocols/src/x402/server/types.ts:173](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/x402/server/types.ts#L173) |
| <a id="token-2"></a> `token` | [`X402Token`](/docs/api/defi/protocols/src/x402/sdk/types.md#x402token) | Token symbol | [defi/protocols/src/x402/server/types.ts:177](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/x402/server/types.ts#L177) |
| <a id="totalearned"></a> `totalEarned` | `string` | Total earned all time | [defi/protocols/src/x402/server/types.ts:175](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/x402/server/types.ts#L175) |

***

### FacilitatorConfig

Defined in: [defi/protocols/src/x402/server/types.ts:87](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/x402/server/types.ts#L87)

Facilitator configuration

#### Properties

| Property | Type | Description | Defined in |
| :------ | :------ | :------ | :------ |
| <a id="apikey"></a> `apiKey?` | `string` | API key for authentication | [defi/protocols/src/x402/server/types.ts:93](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/x402/server/types.ts#L93) |
| <a id="apisecret"></a> `apiSecret?` | `string` | API secret for authentication | [defi/protocols/src/x402/server/types.ts:95](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/x402/server/types.ts#L95) |
| <a id="headers"></a> `headers?` | `Record`\<`string`, `string`\> | Custom headers to include | [defi/protocols/src/x402/server/types.ts:99](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/x402/server/types.ts#L99) |
| <a id="timeout"></a> `timeout?` | `number` | Request timeout in ms | [defi/protocols/src/x402/server/types.ts:101](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/x402/server/types.ts#L101) |
| <a id="type"></a> `type` | [`FacilitatorType`](/docs/api/defi/protocols/src/x402/server/types.md#facilitatortype) | Facilitator type | [defi/protocols/src/x402/server/types.ts:89](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/x402/server/types.ts#L89) |
| <a id="url"></a> `url` | `string` | Facilitator API URL | [defi/protocols/src/x402/server/types.ts:91](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/x402/server/types.ts#L91) |
| <a id="webhooksecret"></a> `webhookSecret?` | `string` | Webhook secret for verification | [defi/protocols/src/x402/server/types.ts:97](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/x402/server/types.ts#L97) |

***

### GenericRequest

Defined in: [defi/protocols/src/x402/server/types.ts:18](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/x402/server/types.ts#L18)

Generic request interface for framework-agnostic middleware

#### Properties

| Property | Type | Defined in |
| :------ | :------ | :------ |
| <a id="body"></a> `body?` | `unknown` | [defi/protocols/src/x402/server/types.ts:24](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/x402/server/types.ts#L24) |
| <a id="headers-1"></a> `headers` | `Record`\<`string`, `string` \| `string`[] \| `undefined`\> | [defi/protocols/src/x402/server/types.ts:19](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/x402/server/types.ts#L19) |
| <a id="method"></a> `method?` | `string` | [defi/protocols/src/x402/server/types.ts:23](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/x402/server/types.ts#L23) |
| <a id="originalurl"></a> `originalUrl?` | `string` | [defi/protocols/src/x402/server/types.ts:22](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/x402/server/types.ts#L22) |
| <a id="path"></a> `path?` | `string` | [defi/protocols/src/x402/server/types.ts:20](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/x402/server/types.ts#L20) |
| <a id="query"></a> `query?` | `Record`\<`string`, `string` \| `string`[] \| `undefined`\> | [defi/protocols/src/x402/server/types.ts:25](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/x402/server/types.ts#L25) |
| <a id="url-1"></a> `url?` | `string` | [defi/protocols/src/x402/server/types.ts:21](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/x402/server/types.ts#L21) |

***

### GenericResponse

Defined in: [defi/protocols/src/x402/server/types.ts:31](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/x402/server/types.ts#L31)

Generic response interface for framework-agnostic middleware

#### Methods

##### json()

```ts
json(body: unknown): void;
```

Defined in: [defi/protocols/src/x402/server/types.ts:35](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/x402/server/types.ts#L35)

###### Parameters

| Parameter | Type |
| :------ | :------ |
| `body` | `unknown` |

###### Returns

`void`

##### send()?

```ts
optional send(body: unknown): void;
```

Defined in: [defi/protocols/src/x402/server/types.ts:36](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/x402/server/types.ts#L36)

###### Parameters

| Parameter | Type |
| :------ | :------ |
| `body` | `unknown` |

###### Returns

`void`

##### set()

```ts
set(headers: Record<string, string>): GenericResponse;
```

Defined in: [defi/protocols/src/x402/server/types.ts:33](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/x402/server/types.ts#L33)

###### Parameters

| Parameter | Type |
| :------ | :------ |
| `headers` | `Record`\<`string`, `string`\> |

###### Returns

[`GenericResponse`](/docs/api/defi/protocols/src/x402/server/types.md#genericresponse)

##### setHeader()?

```ts
optional setHeader(name: string, value: string): GenericResponse;
```

Defined in: [defi/protocols/src/x402/server/types.ts:34](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/x402/server/types.ts#L34)

###### Parameters

| Parameter | Type |
| :------ | :------ |
| `name` | `string` |
| `value` | `string` |

###### Returns

[`GenericResponse`](/docs/api/defi/protocols/src/x402/server/types.md#genericresponse)

##### status()

```ts
status(code: number): GenericResponse;
```

Defined in: [defi/protocols/src/x402/server/types.ts:32](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/x402/server/types.ts#L32)

###### Parameters

| Parameter | Type |
| :------ | :------ |
| `code` | `number` |

###### Returns

[`GenericResponse`](/docs/api/defi/protocols/src/x402/server/types.md#genericresponse)

***

### NonceStore

Defined in: [defi/protocols/src/x402/server/types.ts:225](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/x402/server/types.ts#L225)

Nonce storage interface for replay protection

#### Methods

##### add()

```ts
add(nonce: string, ttl?: number): Promise<void>;
```

Defined in: [defi/protocols/src/x402/server/types.ts:229](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/x402/server/types.ts#L229)

Mark nonce as used

###### Parameters

| Parameter | Type |
| :------ | :------ |
| `nonce` | `string` |
| `ttl?` | `number` |

###### Returns

`Promise`\<`void`\>

##### cleanup()?

```ts
optional cleanup(): Promise<void>;
```

Defined in: [defi/protocols/src/x402/server/types.ts:231](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/x402/server/types.ts#L231)

Remove expired nonces

###### Returns

`Promise`\<`void`\>

##### has()

```ts
has(nonce: string): Promise<boolean>;
```

Defined in: [defi/protocols/src/x402/server/types.ts:227](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/x402/server/types.ts#L227)

Check if nonce has been used

###### Parameters

| Parameter | Type |
| :------ | :------ |
| `nonce` | `string` |

###### Returns

`Promise`\<`boolean`\>

***

### PaymentQueryOptions

Defined in: [defi/protocols/src/x402/server/types.ts:149](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/x402/server/types.ts#L149)

Payment query options

#### Properties

| Property | Type | Description | Defined in |
| :------ | :------ | :------ | :------ |
| <a id="endtime-2"></a> `endTime?` | `number` | Filter by end timestamp | [defi/protocols/src/x402/server/types.ts:155](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/x402/server/types.ts#L155) |
| <a id="limit-2"></a> `limit?` | `number` | Maximum results to return | [defi/protocols/src/x402/server/types.ts:161](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/x402/server/types.ts#L161) |
| <a id="offset"></a> `offset?` | `number` | Pagination offset | [defi/protocols/src/x402/server/types.ts:163](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/x402/server/types.ts#L163) |
| <a id="payer-2"></a> `payer?` | `` `0x${string}` `` | Filter by payer address | [defi/protocols/src/x402/server/types.ts:151](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/x402/server/types.ts#L151) |
| <a id="resource-3"></a> `resource?` | `string` | Filter by resource | [defi/protocols/src/x402/server/types.ts:157](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/x402/server/types.ts#L157) |
| <a id="starttime-2"></a> `startTime?` | `number` | Filter by start timestamp | [defi/protocols/src/x402/server/types.ts:153](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/x402/server/types.ts#L153) |
| <a id="status-2"></a> `status?` | `"pending"` \| `"confirmed"` \| `"failed"` \| `"settled"` | Filter by status | [defi/protocols/src/x402/server/types.ts:159](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/x402/server/types.ts#L159) |

***

### PaymentRecord

Defined in: [defi/protocols/src/x402/server/types.ts:323](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/x402/server/types.ts#L323)

Payment record for analytics

#### Properties

| Property | Type | Description | Defined in |
| :------ | :------ | :------ | :------ |
| <a id="amount"></a> `amount` | `string` | Amount paid | [defi/protocols/src/x402/server/types.ts:331](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/x402/server/types.ts#L331) |
| <a id="chain-4"></a> `chain` | [`X402Chain`](/docs/api/defi/protocols/src/x402/sdk/types.md#x402chain) | Chain | [defi/protocols/src/x402/server/types.ts:329](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/x402/server/types.ts#L329) |
| <a id="id"></a> `id` | `string` | Unique payment ID | [defi/protocols/src/x402/server/types.ts:325](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/x402/server/types.ts#L325) |
| <a id="metadata"></a> `metadata?` | `Record`\<`string`, `unknown`\> | Request metadata | [defi/protocols/src/x402/server/types.ts:345](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/x402/server/types.ts#L345) |
| <a id="method-1"></a> `method?` | `string` | HTTP method used | [defi/protocols/src/x402/server/types.ts:339](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/x402/server/types.ts#L339) |
| <a id="payer-3"></a> `payer` | `` `0x${string}` `` | Payer address | [defi/protocols/src/x402/server/types.ts:335](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/x402/server/types.ts#L335) |
| <a id="resource-4"></a> `resource` | `string` | Resource accessed | [defi/protocols/src/x402/server/types.ts:337](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/x402/server/types.ts#L337) |
| <a id="statuscode"></a> `statusCode?` | `number` | Response status code | [defi/protocols/src/x402/server/types.ts:341](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/x402/server/types.ts#L341) |
| <a id="timestamp"></a> `timestamp` | `number` | Timestamp | [defi/protocols/src/x402/server/types.ts:343](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/x402/server/types.ts#L343) |
| <a id="token-3"></a> `token` | [`X402Token`](/docs/api/defi/protocols/src/x402/sdk/types.md#x402token) | Token | [defi/protocols/src/x402/server/types.ts:333](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/x402/server/types.ts#L333) |
| <a id="txhash"></a> `txHash` | `` `0x${string}` `` | Transaction hash | [defi/protocols/src/x402/server/types.ts:327](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/x402/server/types.ts#L327) |

***

### PaywallOptions

Defined in: [defi/protocols/src/x402/server/types.ts:56](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/x402/server/types.ts#L56)

Paywall configuration options

#### Properties

| Property | Type | Description | Defined in |
| :------ | :------ | :------ | :------ |
| <a id="customverifier"></a> `customVerifier?` | (`proof`: `string`, `request`: [`PaymentRequest`](/docs/api/defi/protocols/src/x402/sdk/types.md#paymentrequest-1)) => `Promise`\<`boolean`\> | Custom verification function | [defi/protocols/src/x402/server/types.ts:72](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/x402/server/types.ts#L72) |
| <a id="description"></a> `description?` | `string` | Human-readable description | [defi/protocols/src/x402/server/types.ts:64](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/x402/server/types.ts#L64) |
| <a id="network-1"></a> `network` | [`X402Chain`](/docs/api/defi/protocols/src/x402/sdk/types.md#x402chain) | Blockchain network | [defi/protocols/src/x402/server/types.ts:62](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/x402/server/types.ts#L62) |
| <a id="price"></a> `price` | `string` | Price in token units (e.g., "0.001" for $0.001) | [defi/protocols/src/x402/server/types.ts:58](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/x402/server/types.ts#L58) |
| <a id="recipient"></a> `recipient?` | `` `0x${string}` `` | Recipient address (defaults to configured server wallet) | [defi/protocols/src/x402/server/types.ts:66](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/x402/server/types.ts#L66) |
| <a id="resource-5"></a> `resource?` | `string` | Custom resource identifier (defaults to request path) | [defi/protocols/src/x402/server/types.ts:68](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/x402/server/types.ts#L68) |
| <a id="token-4"></a> `token` | [`X402Token`](/docs/api/defi/protocols/src/x402/sdk/types.md#x402token) | Payment token (default: USDs) | [defi/protocols/src/x402/server/types.ts:60](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/x402/server/types.ts#L60) |
| <a id="validityseconds"></a> `validitySeconds?` | `number` | Payment validity period in seconds (default: 300) | [defi/protocols/src/x402/server/types.ts:70](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/x402/server/types.ts#L70) |

***

### PriceCalculator

Defined in: [defi/protocols/src/x402/server/types.ts:309](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/x402/server/types.ts#L309)

Price calculator interface

#### Methods

##### calculate()

```ts
calculate(ctx: PricingContext): Promise<PriceResult>;
```

Defined in: [defi/protocols/src/x402/server/types.ts:311](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/x402/server/types.ts#L311)

Calculate price for a request

###### Parameters

| Parameter | Type |
| :------ | :------ |
| `ctx` | [`PricingContext`](/docs/api/defi/protocols/src/x402/server/types.md#pricingcontext) |

###### Returns

`Promise`\<[`PriceResult`](/docs/api/defi/protocols/src/x402/server/types.md#priceresult)\>

##### getConfig()

```ts
getConfig(): DynamicPricingOptions;
```

Defined in: [defi/protocols/src/x402/server/types.ts:313](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/x402/server/types.ts#L313)

Get base configuration

###### Returns

[`DynamicPricingOptions`](/docs/api/defi/protocols/src/x402/server/types.md#dynamicpricingoptions)

***

### PriceResult

Defined in: [defi/protocols/src/x402/server/types.ts:283](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/x402/server/types.ts#L283)

Price calculation result

#### Properties

| Property | Type | Description | Defined in |
| :------ | :------ | :------ | :------ |
| <a id="baseprice"></a> `basePrice` | `string` | Base price component | [defi/protocols/src/x402/server/types.ts:287](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/x402/server/types.ts#L287) |
| <a id="breakdown"></a> `breakdown` | `string` | Breakdown for transparency | [defi/protocols/src/x402/server/types.ts:303](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/x402/server/types.ts#L303) |
| <a id="computeprice"></a> `computePrice?` | `string` | Compute-based price component | [defi/protocols/src/x402/server/types.ts:293](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/x402/server/types.ts#L293) |
| <a id="discountmultiplier"></a> `discountMultiplier?` | `number` | Discount multiplier applied | [defi/protocols/src/x402/server/types.ts:297](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/x402/server/types.ts#L297) |
| <a id="network-2"></a> `network` | [`X402Chain`](/docs/api/defi/protocols/src/x402/sdk/types.md#x402chain) | Network | [defi/protocols/src/x402/server/types.ts:301](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/x402/server/types.ts#L301) |
| <a id="price-1"></a> `price` | `string` | Final price | [defi/protocols/src/x402/server/types.ts:285](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/x402/server/types.ts#L285) |
| <a id="sizeprice"></a> `sizePrice?` | `string` | Size-based price component | [defi/protocols/src/x402/server/types.ts:291](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/x402/server/types.ts#L291) |
| <a id="surgemultiplier"></a> `surgeMultiplier?` | `number` | Surge multiplier applied | [defi/protocols/src/x402/server/types.ts:295](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/x402/server/types.ts#L295) |
| <a id="token-5"></a> `token` | [`X402Token`](/docs/api/defi/protocols/src/x402/sdk/types.md#x402token) | Token symbol | [defi/protocols/src/x402/server/types.ts:299](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/x402/server/types.ts#L299) |
| <a id="tokenprice"></a> `tokenPrice?` | `string` | Token-based price component | [defi/protocols/src/x402/server/types.ts:289](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/x402/server/types.ts#L289) |

***

### PricingContext

Defined in: [defi/protocols/src/x402/server/types.ts:241](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/x402/server/types.ts#L241)

Price calculation context

#### Properties

| Property | Type | Description | Defined in |
| :------ | :------ | :------ | :------ |
| <a id="clientaddress"></a> `clientAddress?` | `` `0x${string}` `` | Client wallet address | [defi/protocols/src/x402/server/types.ts:249](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/x402/server/types.ts#L249) |
| <a id="clientip"></a> `clientIp?` | `string` | Client IP address | [defi/protocols/src/x402/server/types.ts:247](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/x402/server/types.ts#L247) |
| <a id="metadata-1"></a> `metadata?` | `Record`\<`string`, `unknown`\> | Custom context data | [defi/protocols/src/x402/server/types.ts:251](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/x402/server/types.ts#L251) |
| <a id="request"></a> `request` | [`GenericRequest`](/docs/api/defi/protocols/src/x402/server/types.md#genericrequest) | Request being priced | [defi/protocols/src/x402/server/types.ts:243](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/x402/server/types.ts#L243) |
| <a id="resource-6"></a> `resource` | `string` | Resource being accessed | [defi/protocols/src/x402/server/types.ts:245](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/x402/server/types.ts#L245) |

***

### ProtectedEndpoint

Defined in: [defi/protocols/src/x402/server/types.ts:464](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/x402/server/types.ts#L464)

Protected endpoint configuration

#### Properties

| Property | Type | Description | Defined in |
| :------ | :------ | :------ | :------ |
| <a id="description-1"></a> `description?` | `string` | Custom description | [defi/protocols/src/x402/server/types.ts:472](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/x402/server/types.ts#L472) |
| <a id="enabled"></a> `enabled?` | `boolean` | Is endpoint enabled | [defi/protocols/src/x402/server/types.ts:474](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/x402/server/types.ts#L474) |
| <a id="methods"></a> `methods?` | `string`[] | HTTP methods (default: all) | [defi/protocols/src/x402/server/types.ts:468](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/x402/server/types.ts#L468) |
| <a id="path-1"></a> `path` | `string` | Endpoint path pattern | [defi/protocols/src/x402/server/types.ts:466](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/x402/server/types.ts#L466) |
| <a id="pricing"></a> `pricing` | \| [`PaywallOptions`](/docs/api/defi/protocols/src/x402/server/types.md#paywalloptions) \| [`DynamicPricingOptions`](/docs/api/defi/protocols/src/x402/server/types.md#dynamicpricingoptions) | Pricing configuration | [defi/protocols/src/x402/server/types.ts:470](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/x402/server/types.ts#L470) |
| <a id="ratelimit"></a> `rateLimit?` | `number` | Rate limit per payer per hour | [defi/protocols/src/x402/server/types.ts:476](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/x402/server/types.ts#L476) |

***

### RevenueSummary

Defined in: [defi/protocols/src/x402/server/types.ts:351](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/x402/server/types.ts#L351)

Revenue summary

#### Properties

| Property | Type | Description | Defined in |
| :------ | :------ | :------ | :------ |
| <a id="average"></a> `average` | `string` | Average payment | [defi/protocols/src/x402/server/types.ts:357](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/x402/server/types.ts#L357) |
| <a id="count-1"></a> `count` | `number` | Number of payments | [defi/protocols/src/x402/server/types.ts:355](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/x402/server/types.ts#L355) |
| <a id="periodend"></a> `periodEnd` | `number` | Period end | [defi/protocols/src/x402/server/types.ts:365](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/x402/server/types.ts#L365) |
| <a id="periodstart"></a> `periodStart` | `number` | Period start | [defi/protocols/src/x402/server/types.ts:363](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/x402/server/types.ts#L363) |
| <a id="token-6"></a> `token` | [`X402Token`](/docs/api/defi/protocols/src/x402/sdk/types.md#x402token) | Token | [defi/protocols/src/x402/server/types.ts:361](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/x402/server/types.ts#L361) |
| <a id="total-2"></a> `total` | `string` | Total revenue in period | [defi/protocols/src/x402/server/types.ts:353](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/x402/server/types.ts#L353) |
| <a id="uniquepayers"></a> `uniquePayers` | `number` | Unique payers | [defi/protocols/src/x402/server/types.ts:359](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/x402/server/types.ts#L359) |

***

### SettlementRequest

Defined in: [defi/protocols/src/x402/server/types.ts:107](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/x402/server/types.ts#L107)

Payment settlement request

#### Properties

| Property | Type | Description | Defined in |
| :------ | :------ | :------ | :------ |
| <a id="amount-1"></a> `amount` | `string` | Payment amount | [defi/protocols/src/x402/server/types.ts:113](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/x402/server/types.ts#L113) |
| <a id="chain-5"></a> `chain` | [`X402Chain`](/docs/api/defi/protocols/src/x402/sdk/types.md#x402chain) | Chain the payment was made on | [defi/protocols/src/x402/server/types.ts:111](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/x402/server/types.ts#L111) |
| <a id="payer-4"></a> `payer` | `` `0x${string}` `` | Payer address | [defi/protocols/src/x402/server/types.ts:117](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/x402/server/types.ts#L117) |
| <a id="recipient-1"></a> `recipient` | `` `0x${string}` `` | Recipient address | [defi/protocols/src/x402/server/types.ts:119](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/x402/server/types.ts#L119) |
| <a id="reference"></a> `reference?` | `string` | Original payment request reference | [defi/protocols/src/x402/server/types.ts:123](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/x402/server/types.ts#L123) |
| <a id="resource-7"></a> `resource?` | `string` | Resource paid for | [defi/protocols/src/x402/server/types.ts:121](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/x402/server/types.ts#L121) |
| <a id="token-7"></a> `token` | [`X402Token`](/docs/api/defi/protocols/src/x402/sdk/types.md#x402token) | Payment token | [defi/protocols/src/x402/server/types.ts:115](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/x402/server/types.ts#L115) |
| <a id="txhash-1"></a> `txHash` | `` `0x${string}` `` | Transaction hash of the payment | [defi/protocols/src/x402/server/types.ts:109](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/x402/server/types.ts#L109) |

***

### SettlementResult

Defined in: [defi/protocols/src/x402/server/types.ts:129](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/x402/server/types.ts#L129)

Settlement result from facilitator

#### Properties

| Property | Type | Description | Defined in |
| :------ | :------ | :------ | :------ |
| <a id="error"></a> `error?` | `string` | Error message if failed | [defi/protocols/src/x402/server/types.ts:141](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/x402/server/types.ts#L141) |
| <a id="fee"></a> `fee?` | `string` | Fee charged | [defi/protocols/src/x402/server/types.ts:137](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/x402/server/types.ts#L137) |
| <a id="netamount"></a> `netAmount?` | `string` | Net amount after fees | [defi/protocols/src/x402/server/types.ts:135](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/x402/server/types.ts#L135) |
| <a id="settlementid"></a> `settlementId?` | `string` | Settlement ID | [defi/protocols/src/x402/server/types.ts:133](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/x402/server/types.ts#L133) |
| <a id="status-3"></a> `status` | `"pending"` \| `"confirmed"` \| `"failed"` \| `"settled"` | Settlement status | [defi/protocols/src/x402/server/types.ts:139](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/x402/server/types.ts#L139) |
| <a id="success"></a> `success` | `boolean` | Settlement was successful | [defi/protocols/src/x402/server/types.ts:131](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/x402/server/types.ts#L131) |
| <a id="timestamp-1"></a> `timestamp` | `number` | Timestamp of settlement | [defi/protocols/src/x402/server/types.ts:143](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/x402/server/types.ts#L143) |

***

### TopPayer

Defined in: [defi/protocols/src/x402/server/types.ts:385](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/x402/server/types.ts#L385)

Top payer info

#### Properties

| Property | Type | Description | Defined in |
| :------ | :------ | :------ | :------ |
| <a id="address"></a> `address` | `` `0x${string}` `` | Payer address | [defi/protocols/src/x402/server/types.ts:387](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/x402/server/types.ts#L387) |
| <a id="count-2"></a> `count` | `number` | Number of payments | [defi/protocols/src/x402/server/types.ts:391](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/x402/server/types.ts#L391) |
| <a id="firstpayment"></a> `firstPayment` | `number` | First payment timestamp | [defi/protocols/src/x402/server/types.ts:393](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/x402/server/types.ts#L393) |
| <a id="lastpayment"></a> `lastPayment` | `number` | Last payment timestamp | [defi/protocols/src/x402/server/types.ts:395](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/x402/server/types.ts#L395) |
| <a id="total-3"></a> `total` | `string` | Total paid | [defi/protocols/src/x402/server/types.ts:389](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/x402/server/types.ts#L389) |

***

### VerificationRequest

Defined in: [defi/protocols/src/x402/server/types.ts:189](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/x402/server/types.ts#L189)

Payment verification request

#### Properties

| Property | Type | Description | Defined in |
| :------ | :------ | :------ | :------ |
| <a id="allowreplay"></a> `allowReplay?` | `boolean` | Allow replay (same proof used before)? | [defi/protocols/src/x402/server/types.ts:195](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/x402/server/types.ts#L195) |
| <a id="expected"></a> `expected` | [`PaymentRequest`](/docs/api/defi/protocols/src/x402/sdk/types.md#paymentrequest-1) | Expected payment details | [defi/protocols/src/x402/server/types.ts:193](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/x402/server/types.ts#L193) |
| <a id="proof"></a> `proof` | `string` | Payment proof (tx hash or signature) | [defi/protocols/src/x402/server/types.ts:191](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/x402/server/types.ts#L191) |

***

### VerificationResult

Defined in: [defi/protocols/src/x402/server/types.ts:201](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/x402/server/types.ts#L201)

Payment verification result

#### Properties

| Property | Type | Description | Defined in |
| :------ | :------ | :------ | :------ |
| <a id="blocknumber"></a> `blockNumber?` | `number` | Block number (if confirmed) | [defi/protocols/src/x402/server/types.ts:213](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/x402/server/types.ts#L213) |
| <a id="error-1"></a> `error?` | `string` | Error if invalid | [defi/protocols/src/x402/server/types.ts:217](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/x402/server/types.ts#L217) |
| <a id="isreplay"></a> `isReplay?` | `boolean` | Is this a replay of a previous payment? | [defi/protocols/src/x402/server/types.ts:219](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/x402/server/types.ts#L219) |
| <a id="method-2"></a> `method` | `"signature"` \| `"on-chain"` \| `"facilitator"` \| `"cached"` | Verification method used | [defi/protocols/src/x402/server/types.ts:205](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/x402/server/types.ts#L205) |
| <a id="paidamount"></a> `paidAmount?` | `string` | Actual amount paid (may be more than requested) | [defi/protocols/src/x402/server/types.ts:207](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/x402/server/types.ts#L207) |
| <a id="payer-5"></a> `payer?` | `` `0x${string}` `` | Actual payer address | [defi/protocols/src/x402/server/types.ts:209](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/x402/server/types.ts#L209) |
| <a id="timestamp-2"></a> `timestamp?` | `number` | Timestamp of payment | [defi/protocols/src/x402/server/types.ts:215](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/x402/server/types.ts#L215) |
| <a id="txhash-2"></a> `txHash?` | `` `0x${string}` `` | Transaction hash | [defi/protocols/src/x402/server/types.ts:211](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/x402/server/types.ts#L211) |
| <a id="valid"></a> `valid` | `boolean` | Payment is valid | [defi/protocols/src/x402/server/types.ts:203](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/x402/server/types.ts#L203) |

***

### X402ServerConfig

Defined in: [defi/protocols/src/x402/server/types.ts:440](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/x402/server/types.ts#L440)

X402 Server configuration

#### Properties

| Property | Type | Description | Defined in |
| :------ | :------ | :------ | :------ |
| <a id="analyticspath"></a> `analyticsPath?` | `string` | Analytics storage path | [defi/protocols/src/x402/server/types.ts:456](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/x402/server/types.ts#L456) |
| <a id="debug"></a> `debug?` | `boolean` | Enable debug logging | [defi/protocols/src/x402/server/types.ts:458](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/x402/server/types.ts#L458) |
| <a id="defaultchain"></a> `defaultChain` | [`X402Chain`](/docs/api/defi/protocols/src/x402/sdk/types.md#x402chain) | Default chain for payments | [defi/protocols/src/x402/server/types.ts:446](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/x402/server/types.ts#L446) |
| <a id="defaulttoken"></a> `defaultToken` | [`X402Token`](/docs/api/defi/protocols/src/x402/sdk/types.md#x402token) | Default token for payments | [defi/protocols/src/x402/server/types.ts:448](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/x402/server/types.ts#L448) |
| <a id="enableanalytics"></a> `enableAnalytics?` | `boolean` | Enable analytics tracking | [defi/protocols/src/x402/server/types.ts:454](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/x402/server/types.ts#L454) |
| <a id="facilitator"></a> `facilitator?` | [`FacilitatorConfig`](/docs/api/defi/protocols/src/x402/server/types.md#facilitatorconfig) | Facilitator configuration | [defi/protocols/src/x402/server/types.ts:450](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/x402/server/types.ts#L450) |
| <a id="privatekey"></a> `privateKey?` | `` `0x${string}` `` | Server private key (for signing, optional) | [defi/protocols/src/x402/server/types.ts:444](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/x402/server/types.ts#L444) |
| <a id="rpcurls"></a> `rpcUrls?` | `Partial`\<`Record`\<[`X402Chain`](/docs/api/defi/protocols/src/x402/sdk/types.md#x402chain), `string`\>\> | Custom RPC URLs | [defi/protocols/src/x402/server/types.ts:452](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/x402/server/types.ts#L452) |
| <a id="walletaddress"></a> `walletAddress` | `` `0x${string}` `` | Server wallet address for receiving payments | [defi/protocols/src/x402/server/types.ts:442](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/x402/server/types.ts#L442) |

## Type Aliases

### ExportFormat

```ts
type ExportFormat = "json" | "csv" | "xlsx";
```

Defined in: [defi/protocols/src/x402/server/types.ts:421](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/x402/server/types.ts#L421)

Export format options

***

### FacilitatorType

```ts
type FacilitatorType = "coinbase" | "self-hosted" | "custom";
```

Defined in: [defi/protocols/src/x402/server/types.ts:82](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/x402/server/types.ts#L82)

Facilitator types supported

***

### MiddlewareHandler()

```ts
type MiddlewareHandler = (req: GenericRequest, res: GenericResponse, next: NextFunction) => void | Promise<void>;
```

Defined in: [defi/protocols/src/x402/server/types.ts:47](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/x402/server/types.ts#L47)

Generic middleware handler type

#### Parameters

| Parameter | Type |
| :------ | :------ |
| `req` | [`GenericRequest`](/docs/api/defi/protocols/src/x402/server/types.md#genericrequest) |
| `res` | [`GenericResponse`](/docs/api/defi/protocols/src/x402/server/types.md#genericresponse) |
| `next` | [`NextFunction`](/docs/api/defi/protocols/src/x402/server/types.md#nextfunction) |

#### Returns

`void` \| `Promise`\<`void`\>

***

### NextFunction()

```ts
type NextFunction = (error?: unknown) => void;
```

Defined in: [defi/protocols/src/x402/server/types.ts:42](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/x402/server/types.ts#L42)

Next function for middleware chaining

#### Parameters

| Parameter | Type |
| :------ | :------ |
| `error?` | `unknown` |

#### Returns

`void`
