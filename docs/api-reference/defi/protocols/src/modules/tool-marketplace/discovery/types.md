[**Universal Crypto MCP API Reference v1.0.0**](../../../../../../index.md)

***

[Universal Crypto MCP API Reference](/docs/api/index.md) / defi/protocols/src/modules/tool-marketplace/discovery/types

# defi/protocols/src/modules/tool-marketplace/discovery/types

## Interfaces

### AdvancedFilterOptions

Defined in: [defi/protocols/src/modules/tool-marketplace/discovery/types.ts:145](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/modules/tool-marketplace/discovery/types.ts#L145)

Advanced filter options

#### Properties

| Property | Type | Description | Defined in |
| :------ | :------ | :------ | :------ |
| <a id="categories"></a> `categories?` | [`ToolCategory`](/docs/api/defi/protocols/src/modules/tool-marketplace/types.md#toolcategory)[] | Categories to include | [defi/protocols/src/modules/tool-marketplace/discovery/types.ts:149](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/modules/tool-marketplace/discovery/types.ts#L149) |
| <a id="chains"></a> `chains?` | `string`[] | Supported chains | [defi/protocols/src/modules/tool-marketplace/discovery/types.ts:155](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/modules/tool-marketplace/discovery/types.ts#L155) |
| <a id="customfilter"></a> `customFilter?` | [`CombinedFilter`](/docs/api/defi/protocols/src/modules/tool-marketplace/discovery/types.md#combinedfilter) | Combined filter logic | [defi/protocols/src/modules/tool-marketplace/discovery/types.ts:176](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/modules/tool-marketplace/discovery/types.ts#L176) |
| <a id="maxrating"></a> `maxRating?` | `number` | Maximum rating | [defi/protocols/src/modules/tool-marketplace/discovery/types.ts:153](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/modules/tool-marketplace/discovery/types.ts#L153) |
| <a id="maxresponsetime"></a> `maxResponseTime?` | `number` | Maximum response time in ms | [defi/protocols/src/modules/tool-marketplace/discovery/types.ts:161](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/modules/tool-marketplace/discovery/types.ts#L161) |
| <a id="minrating"></a> `minRating?` | `number` | Minimum rating | [defi/protocols/src/modules/tool-marketplace/discovery/types.ts:151](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/modules/tool-marketplace/discovery/types.ts#L151) |
| <a id="minuptime"></a> `minUptime?` | `number` | Minimum uptime percentage | [defi/protocols/src/modules/tool-marketplace/discovery/types.ts:163](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/modules/tool-marketplace/discovery/types.ts#L163) |
| <a id="owner"></a> `owner?` | `` `0x${string}` `` | Owner address | [defi/protocols/src/modules/tool-marketplace/discovery/types.ts:171](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/modules/tool-marketplace/discovery/types.ts#L171) |
| <a id="pricerange"></a> `priceRange?` | [`PriceRangeFilter`](/docs/api/defi/protocols/src/modules/tool-marketplace/discovery/types.md#pricerangefilter) | Price range | [defi/protocols/src/modules/tool-marketplace/discovery/types.ts:147](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/modules/tool-marketplace/discovery/types.ts#L147) |
| <a id="pricingmodels"></a> `pricingModels?` | `string`[] | Pricing models | [defi/protocols/src/modules/tool-marketplace/discovery/types.ts:169](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/modules/tool-marketplace/discovery/types.ts#L169) |
| <a id="registeredafter"></a> `registeredAfter?` | `number` | Registration date range | [defi/protocols/src/modules/tool-marketplace/discovery/types.ts:173](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/modules/tool-marketplace/discovery/types.ts#L173) |
| <a id="registeredbefore"></a> `registeredBefore?` | `number` | - | [defi/protocols/src/modules/tool-marketplace/discovery/types.ts:174](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/modules/tool-marketplace/discovery/types.ts#L174) |
| <a id="status"></a> `status?` | [`ToolStatus`](/docs/api/defi/protocols/src/modules/tool-marketplace/types.md#toolstatus)[] | Tool status | [defi/protocols/src/modules/tool-marketplace/discovery/types.ts:159](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/modules/tool-marketplace/discovery/types.ts#L159) |
| <a id="tagmatchmode"></a> `tagMatchMode?` | `"all"` \| `"any"` | Tag match mode | [defi/protocols/src/modules/tool-marketplace/discovery/types.ts:167](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/modules/tool-marketplace/discovery/types.ts#L167) |
| <a id="tags"></a> `tags?` | `string`[] | Tags to match | [defi/protocols/src/modules/tool-marketplace/discovery/types.ts:165](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/modules/tool-marketplace/discovery/types.ts#L165) |
| <a id="verified"></a> `verified?` | `boolean` | Verification status | [defi/protocols/src/modules/tool-marketplace/discovery/types.ts:157](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/modules/tool-marketplace/discovery/types.ts#L157) |

***

### BundleSubscription

Defined in: [defi/protocols/src/modules/tool-marketplace/discovery/types.ts:395](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/modules/tool-marketplace/discovery/types.ts#L395)

Bundle subscription

#### Properties

| Property | Type | Description | Defined in |
| :------ | :------ | :------ | :------ |
| <a id="autorenew"></a> `autoRenew` | `boolean` | Auto-renew enabled | [defi/protocols/src/modules/tool-marketplace/discovery/types.ts:409](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/modules/tool-marketplace/discovery/types.ts#L409) |
| <a id="bundleid"></a> `bundleId` | `string` | Bundle ID | [defi/protocols/src/modules/tool-marketplace/discovery/types.ts:399](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/modules/tool-marketplace/discovery/types.ts#L399) |
| <a id="enddate"></a> `endDate` | `number` | End date | [defi/protocols/src/modules/tool-marketplace/discovery/types.ts:405](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/modules/tool-marketplace/discovery/types.ts#L405) |
| <a id="monthlyprice"></a> `monthlyPrice` | `string` | Monthly price | [defi/protocols/src/modules/tool-marketplace/discovery/types.ts:407](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/modules/tool-marketplace/discovery/types.ts#L407) |
| <a id="startdate"></a> `startDate` | `number` | Start date | [defi/protocols/src/modules/tool-marketplace/discovery/types.ts:403](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/modules/tool-marketplace/discovery/types.ts#L403) |
| <a id="status-1"></a> `status` | `"expired"` \| `"cancelled"` \| `"active"` | Status | [defi/protocols/src/modules/tool-marketplace/discovery/types.ts:411](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/modules/tool-marketplace/discovery/types.ts#L411) |
| <a id="subscriptionid"></a> `subscriptionId` | `string` | Subscription ID | [defi/protocols/src/modules/tool-marketplace/discovery/types.ts:397](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/modules/tool-marketplace/discovery/types.ts#L397) |
| <a id="useraddress"></a> `userAddress` | `` `0x${string}` `` | User address | [defi/protocols/src/modules/tool-marketplace/discovery/types.ts:401](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/modules/tool-marketplace/discovery/types.ts#L401) |

***

### ClickRecord

Defined in: [defi/protocols/src/modules/tool-marketplace/discovery/types.ts:465](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/modules/tool-marketplace/discovery/types.ts#L465)

Click record

#### Properties

| Property | Type | Description | Defined in |
| :------ | :------ | :------ | :------ |
| <a id="clickid"></a> `clickId` | `string` | Click ID | [defi/protocols/src/modules/tool-marketplace/discovery/types.ts:467](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/modules/tool-marketplace/discovery/types.ts#L467) |
| <a id="position"></a> `position` | `number` | Position in results | [defi/protocols/src/modules/tool-marketplace/discovery/types.ts:473](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/modules/tool-marketplace/discovery/types.ts#L473) |
| <a id="queryid"></a> `queryId` | `string` | Query ID that led to this click | [defi/protocols/src/modules/tool-marketplace/discovery/types.ts:469](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/modules/tool-marketplace/discovery/types.ts#L469) |
| <a id="timestamp"></a> `timestamp` | `number` | Timestamp | [defi/protocols/src/modules/tool-marketplace/discovery/types.ts:475](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/modules/tool-marketplace/discovery/types.ts#L475) |
| <a id="toolid"></a> `toolId` | `string` | Tool ID clicked | [defi/protocols/src/modules/tool-marketplace/discovery/types.ts:471](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/modules/tool-marketplace/discovery/types.ts#L471) |

***

### CombinedFilter

Defined in: [defi/protocols/src/modules/tool-marketplace/discovery/types.ts:133](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/modules/tool-marketplace/discovery/types.ts#L133)

Combined filter configuration

#### Properties

| Property | Type | Description | Defined in |
| :------ | :------ | :------ | :------ |
| <a id="conditions"></a> `conditions` | [`FilterCondition`](/docs/api/defi/protocols/src/modules/tool-marketplace/discovery/types.md#filtercondition)[] | Individual filter conditions | [defi/protocols/src/modules/tool-marketplace/discovery/types.ts:137](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/modules/tool-marketplace/discovery/types.ts#L137) |
| <a id="groups"></a> `groups?` | [`CombinedFilter`](/docs/api/defi/protocols/src/modules/tool-marketplace/discovery/types.md#combinedfilter)[] | Nested filter groups | [defi/protocols/src/modules/tool-marketplace/discovery/types.ts:139](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/modules/tool-marketplace/discovery/types.ts#L139) |
| <a id="operator"></a> `operator` | [`FilterOperator`](/docs/api/defi/protocols/src/modules/tool-marketplace/discovery/types.md#filteroperator) | Logical operator for combining conditions | [defi/protocols/src/modules/tool-marketplace/discovery/types.ts:135](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/modules/tool-marketplace/discovery/types.ts#L135) |

***

### ContentSimilarity

Defined in: [defi/protocols/src/modules/tool-marketplace/discovery/types.ts:238](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/modules/tool-marketplace/discovery/types.ts#L238)

Content similarity data

#### Properties

| Property | Type | Description | Defined in |
| :------ | :------ | :------ | :------ |
| <a id="descriptionsimilarity"></a> `descriptionSimilarity` | `number` | Description similarity (0-1) | [defi/protocols/src/modules/tool-marketplace/discovery/types.ts:244](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/modules/tool-marketplace/discovery/types.ts#L244) |
| <a id="overallsimilarity"></a> `overallSimilarity` | `number` | Overall similarity score | [defi/protocols/src/modules/tool-marketplace/discovery/types.ts:252](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/modules/tool-marketplace/discovery/types.ts#L252) |
| <a id="samecategory"></a> `sameCategory` | `boolean` | Category match | [defi/protocols/src/modules/tool-marketplace/discovery/types.ts:248](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/modules/tool-marketplace/discovery/types.ts#L248) |
| <a id="samepricetier"></a> `samePriceTier` | `boolean` | Price tier match | [defi/protocols/src/modules/tool-marketplace/discovery/types.ts:250](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/modules/tool-marketplace/discovery/types.ts#L250) |
| <a id="tagoverlap"></a> `tagOverlap` | `number` | Tag overlap percentage | [defi/protocols/src/modules/tool-marketplace/discovery/types.ts:246](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/modules/tool-marketplace/discovery/types.ts#L246) |
| <a id="toolida"></a> `toolIdA` | `string` | Tool ID A | [defi/protocols/src/modules/tool-marketplace/discovery/types.ts:240](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/modules/tool-marketplace/discovery/types.ts#L240) |
| <a id="toolidb"></a> `toolIdB` | `string` | Tool ID B | [defi/protocols/src/modules/tool-marketplace/discovery/types.ts:242](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/modules/tool-marketplace/discovery/types.ts#L242) |

***

### ConversionRecord

Defined in: [defi/protocols/src/modules/tool-marketplace/discovery/types.ts:481](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/modules/tool-marketplace/discovery/types.ts#L481)

Conversion record (search -> tool usage)

#### Properties

| Property | Type | Description | Defined in |
| :------ | :------ | :------ | :------ |
| <a id="amountspent"></a> `amountSpent` | `string` | Amount spent | [defi/protocols/src/modules/tool-marketplace/discovery/types.ts:493](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/modules/tool-marketplace/discovery/types.ts#L493) |
| <a id="clickid-1"></a> `clickId` | `string` | Click ID | [defi/protocols/src/modules/tool-marketplace/discovery/types.ts:487](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/modules/tool-marketplace/discovery/types.ts#L487) |
| <a id="conversionid"></a> `conversionId` | `string` | Conversion ID | [defi/protocols/src/modules/tool-marketplace/discovery/types.ts:483](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/modules/tool-marketplace/discovery/types.ts#L483) |
| <a id="queryid-1"></a> `queryId` | `string` | Query ID | [defi/protocols/src/modules/tool-marketplace/discovery/types.ts:485](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/modules/tool-marketplace/discovery/types.ts#L485) |
| <a id="timestamp-1"></a> `timestamp` | `number` | Timestamp | [defi/protocols/src/modules/tool-marketplace/discovery/types.ts:491](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/modules/tool-marketplace/discovery/types.ts#L491) |
| <a id="toolid-1"></a> `toolId` | `string` | Tool ID | [defi/protocols/src/modules/tool-marketplace/discovery/types.ts:489](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/modules/tool-marketplace/discovery/types.ts#L489) |

***

### CoUsagePattern

Defined in: [defi/protocols/src/modules/tool-marketplace/discovery/types.ts:222](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/modules/tool-marketplace/discovery/types.ts#L222)

Co-usage pattern for collaborative filtering

#### Properties

| Property | Type | Description | Defined in |
| :------ | :------ | :------ | :------ |
| <a id="confidence"></a> `confidence` | `number` | Confidence score | [defi/protocols/src/modules/tool-marketplace/discovery/types.ts:232](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/modules/tool-marketplace/discovery/types.ts#L232) |
| <a id="cousagecount"></a> `coUsageCount` | `number` | Number of users who used both | [defi/protocols/src/modules/tool-marketplace/discovery/types.ts:228](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/modules/tool-marketplace/discovery/types.ts#L228) |
| <a id="recencyscore"></a> `recencyScore` | `number` | Recency-weighted score | [defi/protocols/src/modules/tool-marketplace/discovery/types.ts:230](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/modules/tool-marketplace/discovery/types.ts#L230) |
| <a id="toolida-1"></a> `toolIdA` | `string` | Tool ID A | [defi/protocols/src/modules/tool-marketplace/discovery/types.ts:224](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/modules/tool-marketplace/discovery/types.ts#L224) |
| <a id="toolidb-1"></a> `toolIdB` | `string` | Tool ID B | [defi/protocols/src/modules/tool-marketplace/discovery/types.ts:226](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/modules/tool-marketplace/discovery/types.ts#L226) |

***

### CreateBundleInput

Defined in: [defi/protocols/src/modules/tool-marketplace/discovery/types.ts:417](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/modules/tool-marketplace/discovery/types.ts#L417)

Bundle creation input

#### Properties

| Property | Type | Description | Defined in |
| :------ | :------ | :------ | :------ |
| <a id="category"></a> `category` | `string` | Category | [defi/protocols/src/modules/tool-marketplace/discovery/types.ts:423](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/modules/tool-marketplace/discovery/types.ts#L423) |
| <a id="creatoraddress"></a> `creatorAddress` | `` `0x${string}` `` | Creator address | [defi/protocols/src/modules/tool-marketplace/discovery/types.ts:429](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/modules/tool-marketplace/discovery/types.ts#L429) |
| <a id="description"></a> `description` | `string` | Bundle description | [defi/protocols/src/modules/tool-marketplace/discovery/types.ts:421](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/modules/tool-marketplace/discovery/types.ts#L421) |
| <a id="discountpercent"></a> `discountPercent` | `number` | Discount percentage | [defi/protocols/src/modules/tool-marketplace/discovery/types.ts:427](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/modules/tool-marketplace/discovery/types.ts#L427) |
| <a id="name"></a> `name` | `string` | Bundle name | [defi/protocols/src/modules/tool-marketplace/discovery/types.ts:419](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/modules/tool-marketplace/discovery/types.ts#L419) |
| <a id="tags-1"></a> `tags?` | `string`[] | Tags | [defi/protocols/src/modules/tool-marketplace/discovery/types.ts:431](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/modules/tool-marketplace/discovery/types.ts#L431) |
| <a id="toolids"></a> `toolIds` | `string`[] | Tool IDs to include | [defi/protocols/src/modules/tool-marketplace/discovery/types.ts:425](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/modules/tool-marketplace/discovery/types.ts#L425) |

***

### FeaturedTool

Defined in: [defi/protocols/src/modules/tool-marketplace/discovery/types.ts:335](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/modules/tool-marketplace/discovery/types.ts#L335)

Featured tool (curated by platform)

#### Properties

| Property | Type | Description | Defined in |
| :------ | :------ | :------ | :------ |
| <a id="editorspick"></a> `editorsPick?` | `boolean` | Editor's pick | [defi/protocols/src/modules/tool-marketplace/discovery/types.ts:347](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/modules/tool-marketplace/discovery/types.ts#L347) |
| <a id="featuredfrom"></a> `featuredFrom` | `number` | Featured period start | [defi/protocols/src/modules/tool-marketplace/discovery/types.ts:341](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/modules/tool-marketplace/discovery/types.ts#L341) |
| <a id="featureduntil"></a> `featuredUntil` | `number` | Featured period end | [defi/protocols/src/modules/tool-marketplace/discovery/types.ts:343](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/modules/tool-marketplace/discovery/types.ts#L343) |
| <a id="reason"></a> `reason` | `string` | Featured reason | [defi/protocols/src/modules/tool-marketplace/discovery/types.ts:339](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/modules/tool-marketplace/discovery/types.ts#L339) |
| <a id="stakeamount"></a> `stakeAmount?` | `string` | Stake amount (if staked for featuring) | [defi/protocols/src/modules/tool-marketplace/discovery/types.ts:345](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/modules/tool-marketplace/discovery/types.ts#L345) |
| <a id="tool"></a> `tool` | [`RegisteredTool`](/docs/api/defi/protocols/src/modules/tool-marketplace/types.md#registeredtool) | The tool | [defi/protocols/src/modules/tool-marketplace/discovery/types.ts:337](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/modules/tool-marketplace/discovery/types.ts#L337) |

***

### FilterCondition

Defined in: [defi/protocols/src/modules/tool-marketplace/discovery/types.ts:121](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/modules/tool-marketplace/discovery/types.ts#L121)

Filter condition

#### Properties

| Property | Type | Description | Defined in |
| :------ | :------ | :------ | :------ |
| <a id="field"></a> `field` | `string` | Field to filter on | [defi/protocols/src/modules/tool-marketplace/discovery/types.ts:123](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/modules/tool-marketplace/discovery/types.ts#L123) |
| <a id="operator-1"></a> `operator` | `"eq"` \| `"ne"` \| `"gt"` \| `"gte"` \| `"lt"` \| `"lte"` \| `"in"` \| `"contains"` | Operator | [defi/protocols/src/modules/tool-marketplace/discovery/types.ts:125](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/modules/tool-marketplace/discovery/types.ts#L125) |
| <a id="value"></a> `value` | `unknown` | Value to compare | [defi/protocols/src/modules/tool-marketplace/discovery/types.ts:127](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/modules/tool-marketplace/discovery/types.ts#L127) |

***

### FullTextSearchOptions

Defined in: [defi/protocols/src/modules/tool-marketplace/discovery/types.ts:35](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/modules/tool-marketplace/discovery/types.ts#L35)

Full-text search options

#### Properties

| Property | Type | Description | Defined in |
| :------ | :------ | :------ | :------ |
| <a id="boosts"></a> `boosts?` | \{ `description?`: `number`; `displayName?`: `number`; `name?`: `number`; `tags?`: `number`; \} | Field boosts | [defi/protocols/src/modules/tool-marketplace/discovery/types.ts:47](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/modules/tool-marketplace/discovery/types.ts#L47) |
| `boosts.description?` | `number` | - | [defi/protocols/src/modules/tool-marketplace/discovery/types.ts:50](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/modules/tool-marketplace/discovery/types.ts#L50) |
| `boosts.displayName?` | `number` | - | [defi/protocols/src/modules/tool-marketplace/discovery/types.ts:49](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/modules/tool-marketplace/discovery/types.ts#L49) |
| `boosts.name?` | `number` | - | [defi/protocols/src/modules/tool-marketplace/discovery/types.ts:48](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/modules/tool-marketplace/discovery/types.ts#L48) |
| `boosts.tags?` | `number` | - | [defi/protocols/src/modules/tool-marketplace/discovery/types.ts:51](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/modules/tool-marketplace/discovery/types.ts#L51) |
| <a id="fields"></a> `fields?` | (`"name"` \| `"description"` \| `"tags"` \| `"displayName"`)[] | Fields to search | [defi/protocols/src/modules/tool-marketplace/discovery/types.ts:45](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/modules/tool-marketplace/discovery/types.ts#L45) |
| <a id="fuzzy"></a> `fuzzy?` | `boolean` | Enable fuzzy matching | [defi/protocols/src/modules/tool-marketplace/discovery/types.ts:39](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/modules/tool-marketplace/discovery/types.ts#L39) |
| <a id="fuzzydistance"></a> `fuzzyDistance?` | `number` | Fuzzy distance (default: 2) | [defi/protocols/src/modules/tool-marketplace/discovery/types.ts:41](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/modules/tool-marketplace/discovery/types.ts#L41) |
| <a id="limit"></a> `limit?` | `number` | Maximum results | [defi/protocols/src/modules/tool-marketplace/discovery/types.ts:54](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/modules/tool-marketplace/discovery/types.ts#L54) |
| <a id="offset"></a> `offset?` | `number` | Offset for pagination | [defi/protocols/src/modules/tool-marketplace/discovery/types.ts:56](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/modules/tool-marketplace/discovery/types.ts#L56) |
| <a id="query"></a> `query` | `string` | Search query | [defi/protocols/src/modules/tool-marketplace/discovery/types.ts:37](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/modules/tool-marketplace/discovery/types.ts#L37) |
| <a id="stemming"></a> `stemming?` | `boolean` | Enable stemming | [defi/protocols/src/modules/tool-marketplace/discovery/types.ts:43](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/modules/tool-marketplace/discovery/types.ts#L43) |

***

### HotTool

Defined in: [defi/protocols/src/modules/tool-marketplace/discovery/types.ts:287](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/modules/tool-marketplace/discovery/types.ts#L287)

Hot tool (most active in short period)

#### Properties

| Property | Type | Description | Defined in |
| :------ | :------ | :------ | :------ |
| <a id="activeusers24h"></a> `activeUsers24h` | `number` | Active users in last 24 hours | [defi/protocols/src/modules/tool-marketplace/discovery/types.ts:293](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/modules/tool-marketplace/discovery/types.ts#L293) |
| <a id="calls24h"></a> `calls24h` | `number` | Calls in last 24 hours | [defi/protocols/src/modules/tool-marketplace/discovery/types.ts:291](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/modules/tool-marketplace/discovery/types.ts#L291) |
| <a id="hotnessscore"></a> `hotnessScore` | `number` | Hotness score | [defi/protocols/src/modules/tool-marketplace/discovery/types.ts:295](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/modules/tool-marketplace/discovery/types.ts#L295) |
| <a id="tool-1"></a> `tool` | [`RegisteredTool`](/docs/api/defi/protocols/src/modules/tool-marketplace/types.md#registeredtool) | The tool | [defi/protocols/src/modules/tool-marketplace/discovery/types.ts:289](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/modules/tool-marketplace/discovery/types.ts#L289) |

***

### NewTool

Defined in: [defi/protocols/src/modules/tool-marketplace/discovery/types.ts:301](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/modules/tool-marketplace/discovery/types.ts#L301)

New tool (recently registered)

#### Properties

| Property | Type | Description | Defined in |
| :------ | :------ | :------ | :------ |
| <a id="initialcalls"></a> `initialCalls` | `number` | Initial traction metrics | [defi/protocols/src/modules/tool-marketplace/discovery/types.ts:309](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/modules/tool-marketplace/discovery/types.ts#L309) |
| <a id="initialrating"></a> `initialRating` | `number` | Initial rating | [defi/protocols/src/modules/tool-marketplace/discovery/types.ts:311](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/modules/tool-marketplace/discovery/types.ts#L311) |
| <a id="isverified"></a> `isVerified` | `boolean` | Is verified | [defi/protocols/src/modules/tool-marketplace/discovery/types.ts:307](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/modules/tool-marketplace/discovery/types.ts#L307) |
| <a id="registeredat"></a> `registeredAt` | `number` | Registration date | [defi/protocols/src/modules/tool-marketplace/discovery/types.ts:305](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/modules/tool-marketplace/discovery/types.ts#L305) |
| <a id="tool-2"></a> `tool` | [`RegisteredTool`](/docs/api/defi/protocols/src/modules/tool-marketplace/types.md#registeredtool) | The tool | [defi/protocols/src/modules/tool-marketplace/discovery/types.ts:303](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/modules/tool-marketplace/discovery/types.ts#L303) |

***

### PriceRangeFilter

Defined in: [defi/protocols/src/modules/tool-marketplace/discovery/types.ts:106](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/modules/tool-marketplace/discovery/types.ts#L106)

Price range filter

#### Properties

| Property | Type | Description | Defined in |
| :------ | :------ | :------ | :------ |
| <a id="max"></a> `max?` | `string` | Maximum price | [defi/protocols/src/modules/tool-marketplace/discovery/types.ts:110](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/modules/tool-marketplace/discovery/types.ts#L110) |
| <a id="min"></a> `min?` | `string` | Minimum price | [defi/protocols/src/modules/tool-marketplace/discovery/types.ts:108](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/modules/tool-marketplace/discovery/types.ts#L108) |

***

### RecommendedTool

Defined in: [defi/protocols/src/modules/tool-marketplace/discovery/types.ts:208](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/modules/tool-marketplace/discovery/types.ts#L208)

Recommended tool with recommendation metadata

#### Properties

| Property | Type | Description | Defined in |
| :------ | :------ | :------ | :------ |
| <a id="reasons"></a> `reasons` | `string`[] | Recommendation reasons | [defi/protocols/src/modules/tool-marketplace/discovery/types.ts:214](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/modules/tool-marketplace/discovery/types.ts#L214) |
| <a id="score"></a> `score` | `number` | Recommendation score (0-1) | [defi/protocols/src/modules/tool-marketplace/discovery/types.ts:212](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/modules/tool-marketplace/discovery/types.ts#L212) |
| <a id="tool-3"></a> `tool` | [`RegisteredTool`](/docs/api/defi/protocols/src/modules/tool-marketplace/types.md#registeredtool) | The recommended tool | [defi/protocols/src/modules/tool-marketplace/discovery/types.ts:210](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/modules/tool-marketplace/discovery/types.ts#L210) |
| <a id="type"></a> `type` | \| `"collaborative"` \| `"content-based"` \| `"personalized"` \| `"trending"` \| `"featured"` | Recommendation type | [defi/protocols/src/modules/tool-marketplace/discovery/types.ts:216](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/modules/tool-marketplace/discovery/types.ts#L216) |

***

### RisingStarTool

Defined in: [defi/protocols/src/modules/tool-marketplace/discovery/types.ts:317](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/modules/tool-marketplace/discovery/types.ts#L317)

Rising star (underrated high-quality tools)

#### Properties

| Property | Type | Description | Defined in |
| :------ | :------ | :------ | :------ |
| <a id="potentialscore"></a> `potentialScore` | `number` | Potential score | [defi/protocols/src/modules/tool-marketplace/discovery/types.ts:327](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/modules/tool-marketplace/discovery/types.ts#L327) |
| <a id="rating"></a> `rating` | `number` | Rating | [defi/protocols/src/modules/tool-marketplace/discovery/types.ts:321](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/modules/tool-marketplace/discovery/types.ts#L321) |
| <a id="ratingcount"></a> `ratingCount` | `number` | Rating count | [defi/protocols/src/modules/tool-marketplace/discovery/types.ts:323](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/modules/tool-marketplace/discovery/types.ts#L323) |
| <a id="reasons-1"></a> `reasons` | `string`[] | Why it's a rising star | [defi/protocols/src/modules/tool-marketplace/discovery/types.ts:329](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/modules/tool-marketplace/discovery/types.ts#L329) |
| <a id="tool-4"></a> `tool` | [`RegisteredTool`](/docs/api/defi/protocols/src/modules/tool-marketplace/types.md#registeredtool) | The tool | [defi/protocols/src/modules/tool-marketplace/discovery/types.ts:319](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/modules/tool-marketplace/discovery/types.ts#L319) |
| <a id="totalcalls"></a> `totalCalls` | `number` | Total calls (relatively low) | [defi/protocols/src/modules/tool-marketplace/discovery/types.ts:325](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/modules/tool-marketplace/discovery/types.ts#L325) |

***

### SearchAnalyticsSummary

Defined in: [defi/protocols/src/modules/tool-marketplace/discovery/types.ts:515](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/modules/tool-marketplace/discovery/types.ts#L515)

Search analytics summary

#### Properties

| Property | Type | Description | Defined in |
| :------ | :------ | :------ | :------ |
| <a id="avgresultspersearch"></a> `avgResultsPerSearch` | `number` | Average results per search | [defi/protocols/src/modules/tool-marketplace/discovery/types.ts:525](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/modules/tool-marketplace/discovery/types.ts#L525) |
| <a id="avgsearchtimems"></a> `avgSearchTimeMs` | `number` | Average search time | [defi/protocols/src/modules/tool-marketplace/discovery/types.ts:537](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/modules/tool-marketplace/discovery/types.ts#L537) |
| <a id="clickthroughrate"></a> `clickThroughRate` | `number` | Click-through rate | [defi/protocols/src/modules/tool-marketplace/discovery/types.ts:527](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/modules/tool-marketplace/discovery/types.ts#L527) |
| <a id="conversionrate"></a> `conversionRate` | `number` | Conversion rate | [defi/protocols/src/modules/tool-marketplace/discovery/types.ts:529](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/modules/tool-marketplace/discovery/types.ts#L529) |
| <a id="period"></a> `period` | `"1h"` \| `"24h"` \| `"7d"` \| `"30d"` | Time period | [defi/protocols/src/modules/tool-marketplace/discovery/types.ts:517](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/modules/tool-marketplace/discovery/types.ts#L517) |
| <a id="popularcategories"></a> `popularCategories` | \{ `category`: `string`; `count`: `number`; \}[] | Popular categories searched | [defi/protocols/src/modules/tool-marketplace/discovery/types.ts:535](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/modules/tool-marketplace/discovery/types.ts#L535) |
| <a id="topqueries"></a> `topQueries` | \{ `count`: `number`; `query`: `string`; \}[] | Top queries | [defi/protocols/src/modules/tool-marketplace/discovery/types.ts:531](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/modules/tool-marketplace/discovery/types.ts#L531) |
| <a id="topzeroresultqueries"></a> `topZeroResultQueries` | [`ZeroResultQuery`](/docs/api/defi/protocols/src/modules/tool-marketplace/discovery/types.md#zeroresultquery)[] | Top zero-result queries | [defi/protocols/src/modules/tool-marketplace/discovery/types.ts:533](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/modules/tool-marketplace/discovery/types.ts#L533) |
| <a id="totalsearches"></a> `totalSearches` | `number` | Total searches | [defi/protocols/src/modules/tool-marketplace/discovery/types.ts:519](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/modules/tool-marketplace/discovery/types.ts#L519) |
| <a id="uniquequeries"></a> `uniqueQueries` | `number` | Unique queries | [defi/protocols/src/modules/tool-marketplace/discovery/types.ts:521](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/modules/tool-marketplace/discovery/types.ts#L521) |
| <a id="zeroresultrate"></a> `zeroResultRate` | `number` | Zero result rate | [defi/protocols/src/modules/tool-marketplace/discovery/types.ts:523](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/modules/tool-marketplace/discovery/types.ts#L523) |

***

### SearchConfig

Defined in: [defi/protocols/src/modules/tool-marketplace/discovery/types.ts:575](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/modules/tool-marketplace/discovery/types.ts#L575)

Search configuration

#### Properties

| Property | Type | Description | Defined in |
| :------ | :------ | :------ | :------ |
| <a id="defaultboosts"></a> `defaultBoosts` | \{ `description`: `number`; `displayName`: `number`; `name`: `number`; `tags`: `number`; \} | Default field boosts | [defi/protocols/src/modules/tool-marketplace/discovery/types.ts:583](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/modules/tool-marketplace/discovery/types.ts#L583) |
| `defaultBoosts.description` | `number` | - | [defi/protocols/src/modules/tool-marketplace/discovery/types.ts:586](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/modules/tool-marketplace/discovery/types.ts#L586) |
| `defaultBoosts.displayName` | `number` | - | [defi/protocols/src/modules/tool-marketplace/discovery/types.ts:585](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/modules/tool-marketplace/discovery/types.ts#L585) |
| `defaultBoosts.name` | `number` | - | [defi/protocols/src/modules/tool-marketplace/discovery/types.ts:584](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/modules/tool-marketplace/discovery/types.ts#L584) |
| `defaultBoosts.tags` | `number` | - | [defi/protocols/src/modules/tool-marketplace/discovery/types.ts:587](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/modules/tool-marketplace/discovery/types.ts#L587) |
| <a id="defaultfuzzy"></a> `defaultFuzzy` | `boolean` | Enable fuzzy matching by default | [defi/protocols/src/modules/tool-marketplace/discovery/types.ts:577](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/modules/tool-marketplace/discovery/types.ts#L577) |
| <a id="defaultfuzzydistance"></a> `defaultFuzzyDistance` | `number` | Default fuzzy distance | [defi/protocols/src/modules/tool-marketplace/discovery/types.ts:579](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/modules/tool-marketplace/discovery/types.ts#L579) |
| <a id="defaultstemming"></a> `defaultStemming` | `boolean` | Enable stemming by default | [defi/protocols/src/modules/tool-marketplace/discovery/types.ts:581](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/modules/tool-marketplace/discovery/types.ts#L581) |
| <a id="embeddingmodel"></a> `embeddingModel` | `string` | Embedding model to use | [defi/protocols/src/modules/tool-marketplace/discovery/types.ts:598](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/modules/tool-marketplace/discovery/types.ts#L598) |
| <a id="maxresults"></a> `maxResults` | `number` | Maximum results | [defi/protocols/src/modules/tool-marketplace/discovery/types.ts:596](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/modules/tool-marketplace/discovery/types.ts#L596) |
| <a id="minquerylength"></a> `minQueryLength` | `number` | Minimum query length | [defi/protocols/src/modules/tool-marketplace/discovery/types.ts:594](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/modules/tool-marketplace/discovery/types.ts#L594) |
| <a id="minsemanticsimilarity"></a> `minSemanticSimilarity` | `number` | Minimum semantic similarity | [defi/protocols/src/modules/tool-marketplace/discovery/types.ts:600](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/modules/tool-marketplace/discovery/types.ts#L600) |
| <a id="stopwords"></a> `stopWords` | `string`[] | Stop words to ignore | [defi/protocols/src/modules/tool-marketplace/discovery/types.ts:592](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/modules/tool-marketplace/discovery/types.ts#L592) |
| <a id="synonyms"></a> `synonyms` | [`SynonymMap`](/docs/api/defi/protocols/src/modules/tool-marketplace/discovery/types.md#synonymmap)[] | Synonym mappings | [defi/protocols/src/modules/tool-marketplace/discovery/types.ts:590](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/modules/tool-marketplace/discovery/types.ts#L590) |

***

### SearchQueryRecord

Defined in: [defi/protocols/src/modules/tool-marketplace/discovery/types.ts:441](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/modules/tool-marketplace/discovery/types.ts#L441)

Search query record

#### Properties

| Property | Type | Description | Defined in |
| :------ | :------ | :------ | :------ |
| <a id="filtersapplied"></a> `filtersApplied` | `string`[] | Filters applied | [defi/protocols/src/modules/tool-marketplace/discovery/types.ts:457](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/modules/tool-marketplace/discovery/types.ts#L457) |
| <a id="query-1"></a> `query` | `string` | Search query | [defi/protocols/src/modules/tool-marketplace/discovery/types.ts:445](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/modules/tool-marketplace/discovery/types.ts#L445) |
| <a id="queryhash"></a> `queryHash` | `string` | Query hash (for anonymization) | [defi/protocols/src/modules/tool-marketplace/discovery/types.ts:447](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/modules/tool-marketplace/discovery/types.ts#L447) |
| <a id="queryid-2"></a> `queryId` | `string` | Query ID | [defi/protocols/src/modules/tool-marketplace/discovery/types.ts:443](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/modules/tool-marketplace/discovery/types.ts#L443) |
| <a id="resultscount"></a> `resultsCount` | `number` | Results count | [defi/protocols/src/modules/tool-marketplace/discovery/types.ts:453](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/modules/tool-marketplace/discovery/types.ts#L453) |
| <a id="searchtimems"></a> `searchTimeMs` | `number` | Search time in ms | [defi/protocols/src/modules/tool-marketplace/discovery/types.ts:459](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/modules/tool-marketplace/discovery/types.ts#L459) |
| <a id="searchtype"></a> `searchType` | `"fulltext"` \| `"semantic"` \| `"hybrid"` | Search type | [defi/protocols/src/modules/tool-marketplace/discovery/types.ts:455](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/modules/tool-marketplace/discovery/types.ts#L455) |
| <a id="timestamp-2"></a> `timestamp` | `number` | Timestamp | [defi/protocols/src/modules/tool-marketplace/discovery/types.ts:449](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/modules/tool-marketplace/discovery/types.ts#L449) |
| <a id="userhash"></a> `userHash?` | `string` | User address hash (anonymized) | [defi/protocols/src/modules/tool-marketplace/discovery/types.ts:451](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/modules/tool-marketplace/discovery/types.ts#L451) |

***

### SearchResponse

Defined in: [defi/protocols/src/modules/tool-marketplace/discovery/types.ts:78](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/modules/tool-marketplace/discovery/types.ts#L78)

Combined search response

#### Properties

| Property | Type | Description | Defined in |
| :------ | :------ | :------ | :------ |
| <a id="page"></a> `page` | `number` | Current page | [defi/protocols/src/modules/tool-marketplace/discovery/types.ts:86](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/modules/tool-marketplace/discovery/types.ts#L86) |
| <a id="pagesize"></a> `pageSize` | `number` | Page size | [defi/protocols/src/modules/tool-marketplace/discovery/types.ts:88](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/modules/tool-marketplace/discovery/types.ts#L88) |
| <a id="query-2"></a> `query` | `string` | Original query | [defi/protocols/src/modules/tool-marketplace/discovery/types.ts:80](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/modules/tool-marketplace/discovery/types.ts#L80) |
| <a id="relatedcategories"></a> `relatedCategories` | [`ToolCategory`](/docs/api/defi/protocols/src/modules/tool-marketplace/types.md#toolcategory)[] | Related categories | [defi/protocols/src/modules/tool-marketplace/discovery/types.ts:92](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/modules/tool-marketplace/discovery/types.ts#L92) |
| <a id="results"></a> `results` | [`SearchResult`](/docs/api/defi/protocols/src/modules/tool-marketplace/discovery/types.md#searchresult)[] | Search results | [defi/protocols/src/modules/tool-marketplace/discovery/types.ts:82](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/modules/tool-marketplace/discovery/types.ts#L82) |
| <a id="searchtimems-1"></a> `searchTimeMs` | `number` | Search took (ms) | [defi/protocols/src/modules/tool-marketplace/discovery/types.ts:94](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/modules/tool-marketplace/discovery/types.ts#L94) |
| <a id="searchtype-1"></a> `searchType` | `"fulltext"` \| `"semantic"` \| `"hybrid"` | Search type used | [defi/protocols/src/modules/tool-marketplace/discovery/types.ts:96](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/modules/tool-marketplace/discovery/types.ts#L96) |
| <a id="suggestions"></a> `suggestions` | `string`[] | Search suggestions | [defi/protocols/src/modules/tool-marketplace/discovery/types.ts:90](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/modules/tool-marketplace/discovery/types.ts#L90) |
| <a id="totalresults"></a> `totalResults` | `number` | Total matching results (before pagination) | [defi/protocols/src/modules/tool-marketplace/discovery/types.ts:84](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/modules/tool-marketplace/discovery/types.ts#L84) |

***

### SearchResult

Defined in: [defi/protocols/src/modules/tool-marketplace/discovery/types.ts:18](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/modules/tool-marketplace/discovery/types.ts#L18)

Search result item with match metadata

#### Properties

| Property | Type | Description | Defined in |
| :------ | :------ | :------ | :------ |
| <a id="highlights"></a> `highlights?` | \{ `field`: `string`; `snippet`: `string`; \}[] | Highlighted snippets | [defi/protocols/src/modules/tool-marketplace/discovery/types.ts:26](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/modules/tool-marketplace/discovery/types.ts#L26) |
| <a id="matchreasons"></a> `matchReasons` | `string`[] | Reasons for the match | [defi/protocols/src/modules/tool-marketplace/discovery/types.ts:24](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/modules/tool-marketplace/discovery/types.ts#L24) |
| <a id="score-1"></a> `score` | `number` | Match score (0-1) | [defi/protocols/src/modules/tool-marketplace/discovery/types.ts:22](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/modules/tool-marketplace/discovery/types.ts#L22) |
| <a id="tool-5"></a> `tool` | [`RegisteredTool`](/docs/api/defi/protocols/src/modules/tool-marketplace/types.md#registeredtool) | The matched tool | [defi/protocols/src/modules/tool-marketplace/discovery/types.ts:20](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/modules/tool-marketplace/discovery/types.ts#L20) |

***

### SemanticSearchOptions

Defined in: [defi/protocols/src/modules/tool-marketplace/discovery/types.ts:62](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/modules/tool-marketplace/discovery/types.ts#L62)

Semantic search options

#### Properties

| Property | Type | Description | Defined in |
| :------ | :------ | :------ | :------ |
| <a id="limit-1"></a> `limit?` | `number` | Maximum results | [defi/protocols/src/modules/tool-marketplace/discovery/types.ts:70](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/modules/tool-marketplace/discovery/types.ts#L70) |
| <a id="minsimilarity"></a> `minSimilarity?` | `number` | Minimum similarity score (0-1) | [defi/protocols/src/modules/tool-marketplace/discovery/types.ts:68](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/modules/tool-marketplace/discovery/types.ts#L68) |
| <a id="offset-1"></a> `offset?` | `number` | Offset for pagination | [defi/protocols/src/modules/tool-marketplace/discovery/types.ts:72](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/modules/tool-marketplace/discovery/types.ts#L72) |
| <a id="query-3"></a> `query` | `string` | Natural language query | [defi/protocols/src/modules/tool-marketplace/discovery/types.ts:64](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/modules/tool-marketplace/discovery/types.ts#L64) |
| <a id="similarto"></a> `similarTo?` | `string` | Find tools similar to this tool ID | [defi/protocols/src/modules/tool-marketplace/discovery/types.ts:66](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/modules/tool-marketplace/discovery/types.ts#L66) |

***

### SynonymMap

Defined in: [defi/protocols/src/modules/tool-marketplace/discovery/types.ts:565](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/modules/tool-marketplace/discovery/types.ts#L565)

Synonym mapping

#### Properties

| Property | Type | Description | Defined in |
| :------ | :------ | :------ | :------ |
| <a id="synonyms-1"></a> `synonyms` | `string`[] | Synonyms | [defi/protocols/src/modules/tool-marketplace/discovery/types.ts:569](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/modules/tool-marketplace/discovery/types.ts#L569) |
| <a id="term"></a> `term` | `string` | Primary term | [defi/protocols/src/modules/tool-marketplace/discovery/types.ts:567](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/modules/tool-marketplace/discovery/types.ts#L567) |

***

### ToolAlternative

Defined in: [defi/protocols/src/modules/tool-marketplace/discovery/types.ts:630](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/modules/tool-marketplace/discovery/types.ts#L630)

Tool alternative

#### Properties

| Property | Type | Description | Defined in |
| :------ | :------ | :------ | :------ |
| <a id="comparison"></a> `comparison` | \{ `featureOverlap`: `number`; `priceDifference`: `string`; `priceDifferencePercent`: `number`; `ratingDifference`: `number`; \} | Comparison to original | [defi/protocols/src/modules/tool-marketplace/discovery/types.ts:634](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/modules/tool-marketplace/discovery/types.ts#L634) |
| `comparison.featureOverlap` | `number` | - | [defi/protocols/src/modules/tool-marketplace/discovery/types.ts:638](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/modules/tool-marketplace/discovery/types.ts#L638) |
| `comparison.priceDifference` | `string` | - | [defi/protocols/src/modules/tool-marketplace/discovery/types.ts:635](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/modules/tool-marketplace/discovery/types.ts#L635) |
| `comparison.priceDifferencePercent` | `number` | - | [defi/protocols/src/modules/tool-marketplace/discovery/types.ts:636](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/modules/tool-marketplace/discovery/types.ts#L636) |
| `comparison.ratingDifference` | `number` | - | [defi/protocols/src/modules/tool-marketplace/discovery/types.ts:637](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/modules/tool-marketplace/discovery/types.ts#L637) |
| <a id="reasons-2"></a> `reasons` | `string`[] | Why it's an alternative | [defi/protocols/src/modules/tool-marketplace/discovery/types.ts:641](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/modules/tool-marketplace/discovery/types.ts#L641) |
| <a id="tool-6"></a> `tool` | [`RegisteredTool`](/docs/api/defi/protocols/src/modules/tool-marketplace/types.md#registeredtool) | Alternative tool | [defi/protocols/src/modules/tool-marketplace/discovery/types.ts:632](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/modules/tool-marketplace/discovery/types.ts#L632) |
| <a id="type-1"></a> `type` | `"cheaper"` \| `"better-rated"` \| `"more-features"` \| `"similar"` | Alternative type | [defi/protocols/src/modules/tool-marketplace/discovery/types.ts:643](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/modules/tool-marketplace/discovery/types.ts#L643) |

***

### ToolBundle

Defined in: [defi/protocols/src/modules/tool-marketplace/discovery/types.ts:357](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/modules/tool-marketplace/discovery/types.ts#L357)

Tool bundle

#### Properties

| Property | Type | Description | Defined in |
| :------ | :------ | :------ | :------ |
| <a id="bundleid-1"></a> `bundleId` | `string` | Bundle ID | [defi/protocols/src/modules/tool-marketplace/discovery/types.ts:359](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/modules/tool-marketplace/discovery/types.ts#L359) |
| <a id="bundleprice"></a> `bundlePrice` | `string` | Bundle price | [defi/protocols/src/modules/tool-marketplace/discovery/types.ts:373](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/modules/tool-marketplace/discovery/types.ts#L373) |
| <a id="category-1"></a> `category` | `string` | Bundle category | [defi/protocols/src/modules/tool-marketplace/discovery/types.ts:365](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/modules/tool-marketplace/discovery/types.ts#L365) |
| <a id="createdat"></a> `createdAt` | `number` | Created timestamp | [defi/protocols/src/modules/tool-marketplace/discovery/types.ts:389](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/modules/tool-marketplace/discovery/types.ts#L389) |
| <a id="creatoraddress-1"></a> `creatorAddress` | `` `0x${string}` `` | Bundle creator address | [defi/protocols/src/modules/tool-marketplace/discovery/types.ts:379](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/modules/tool-marketplace/discovery/types.ts#L379) |
| <a id="description-1"></a> `description` | `string` | Bundle description | [defi/protocols/src/modules/tool-marketplace/discovery/types.ts:363](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/modules/tool-marketplace/discovery/types.ts#L363) |
| <a id="discountpercent-1"></a> `discountPercent` | `number` | Discount percentage | [defi/protocols/src/modules/tool-marketplace/discovery/types.ts:375](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/modules/tool-marketplace/discovery/types.ts#L375) |
| <a id="individualpricetotal"></a> `individualPriceTotal` | `string` | Individual prices total | [defi/protocols/src/modules/tool-marketplace/discovery/types.ts:371](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/modules/tool-marketplace/discovery/types.ts#L371) |
| <a id="iscurated"></a> `isCurated` | `boolean` | Is curated by platform | [defi/protocols/src/modules/tool-marketplace/discovery/types.ts:381](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/modules/tool-marketplace/discovery/types.ts#L381) |
| <a id="name-1"></a> `name` | `string` | Bundle name | [defi/protocols/src/modules/tool-marketplace/discovery/types.ts:361](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/modules/tool-marketplace/discovery/types.ts#L361) |
| <a id="rating-1"></a> `rating` | `number` | Average bundle rating | [defi/protocols/src/modules/tool-marketplace/discovery/types.ts:387](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/modules/tool-marketplace/discovery/types.ts#L387) |
| <a id="savings"></a> `savings` | `string` | Savings amount | [defi/protocols/src/modules/tool-marketplace/discovery/types.ts:377](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/modules/tool-marketplace/discovery/types.ts#L377) |
| <a id="subscribers"></a> `subscribers` | `number` | Total subscribers | [defi/protocols/src/modules/tool-marketplace/discovery/types.ts:385](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/modules/tool-marketplace/discovery/types.ts#L385) |
| <a id="tags-2"></a> `tags` | `string`[] | Bundle tags | [defi/protocols/src/modules/tool-marketplace/discovery/types.ts:383](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/modules/tool-marketplace/discovery/types.ts#L383) |
| <a id="toolids-1"></a> `toolIds` | `string`[] | Tool IDs in the bundle | [defi/protocols/src/modules/tool-marketplace/discovery/types.ts:369](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/modules/tool-marketplace/discovery/types.ts#L369) |
| <a id="tools"></a> `tools` | [`RegisteredTool`](/docs/api/defi/protocols/src/modules/tool-marketplace/types.md#registeredtool)[] | Tools in the bundle | [defi/protocols/src/modules/tool-marketplace/discovery/types.ts:367](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/modules/tool-marketplace/discovery/types.ts#L367) |

***

### ToolComparison

Defined in: [defi/protocols/src/modules/tool-marketplace/discovery/types.ts:610](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/modules/tool-marketplace/discovery/types.ts#L610)

Tool comparison result

#### Properties

| Property | Type | Description | Defined in |
| :------ | :------ | :------ | :------ |
| <a id="metrics"></a> `metrics` | \{ `category`: `string`; `values`: `Record`\<`string`, `string` \| `number` \| `boolean`\>; \}[] | Comparison metrics | [defi/protocols/src/modules/tool-marketplace/discovery/types.ts:614](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/modules/tool-marketplace/discovery/types.ts#L614) |
| <a id="recommendation"></a> `recommendation?` | \{ `reason`: `string`; `toolId`: `string`; \} | Overall recommendation | [defi/protocols/src/modules/tool-marketplace/discovery/types.ts:621](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/modules/tool-marketplace/discovery/types.ts#L621) |
| `recommendation.reason` | `string` | - | [defi/protocols/src/modules/tool-marketplace/discovery/types.ts:623](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/modules/tool-marketplace/discovery/types.ts#L623) |
| `recommendation.toolId` | `string` | - | [defi/protocols/src/modules/tool-marketplace/discovery/types.ts:622](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/modules/tool-marketplace/discovery/types.ts#L622) |
| <a id="tools-1"></a> `tools` | [`RegisteredTool`](/docs/api/defi/protocols/src/modules/tool-marketplace/types.md#registeredtool)[] | Tools being compared | [defi/protocols/src/modules/tool-marketplace/discovery/types.ts:612](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/modules/tool-marketplace/discovery/types.ts#L612) |
| <a id="winners"></a> `winners` | `Record`\<`string`, `string`\> | Winner by metric | [defi/protocols/src/modules/tool-marketplace/discovery/types.ts:619](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/modules/tool-marketplace/discovery/types.ts#L619) |

***

### ToolEmbedding

Defined in: [defi/protocols/src/modules/tool-marketplace/discovery/types.ts:547](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/modules/tool-marketplace/discovery/types.ts#L547)

Tool embedding for semantic search

#### Properties

| Property | Type | Description | Defined in |
| :------ | :------ | :------ | :------ |
| <a id="createdat-1"></a> `createdAt` | `number` | Created timestamp | [defi/protocols/src/modules/tool-marketplace/discovery/types.ts:557](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/modules/tool-marketplace/discovery/types.ts#L557) |
| <a id="embeddedtext"></a> `embeddedText` | `string` | Text that was embedded | [defi/protocols/src/modules/tool-marketplace/discovery/types.ts:553](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/modules/tool-marketplace/discovery/types.ts#L553) |
| <a id="embedding"></a> `embedding` | `number`[] | Embedding vector | [defi/protocols/src/modules/tool-marketplace/discovery/types.ts:551](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/modules/tool-marketplace/discovery/types.ts#L551) |
| <a id="model"></a> `model` | `string` | Embedding model used | [defi/protocols/src/modules/tool-marketplace/discovery/types.ts:555](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/modules/tool-marketplace/discovery/types.ts#L555) |
| <a id="toolid-2"></a> `toolId` | `string` | Tool ID | [defi/protocols/src/modules/tool-marketplace/discovery/types.ts:549](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/modules/tool-marketplace/discovery/types.ts#L549) |
| <a id="updatedat"></a> `updatedAt` | `number` | Last updated timestamp | [defi/protocols/src/modules/tool-marketplace/discovery/types.ts:559](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/modules/tool-marketplace/discovery/types.ts#L559) |

***

### TrendingTool

Defined in: [defi/protocols/src/modules/tool-marketplace/discovery/types.ts:267](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/modules/tool-marketplace/discovery/types.ts#L267)

Trending tool data

#### Properties

| Property | Type | Description | Defined in |
| :------ | :------ | :------ | :------ |
| <a id="callsinperiod"></a> `callsInPeriod` | `number` | Calls in the period | [defi/protocols/src/modules/tool-marketplace/discovery/types.ts:275](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/modules/tool-marketplace/discovery/types.ts#L275) |
| <a id="growthpercent"></a> `growthPercent` | `number` | Growth percentage | [defi/protocols/src/modules/tool-marketplace/discovery/types.ts:273](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/modules/tool-marketplace/discovery/types.ts#L273) |
| <a id="rank"></a> `rank` | `number` | Rank in trending list | [defi/protocols/src/modules/tool-marketplace/discovery/types.ts:281](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/modules/tool-marketplace/discovery/types.ts#L281) |
| <a id="revenueinperiod"></a> `revenueInPeriod` | `string` | Revenue in the period | [defi/protocols/src/modules/tool-marketplace/discovery/types.ts:277](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/modules/tool-marketplace/discovery/types.ts#L277) |
| <a id="score-2"></a> `score` | `number` | Trending score | [defi/protocols/src/modules/tool-marketplace/discovery/types.ts:271](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/modules/tool-marketplace/discovery/types.ts#L271) |
| <a id="tool-7"></a> `tool` | [`RegisteredTool`](/docs/api/defi/protocols/src/modules/tool-marketplace/types.md#registeredtool) | The tool | [defi/protocols/src/modules/tool-marketplace/discovery/types.ts:269](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/modules/tool-marketplace/discovery/types.ts#L269) |
| <a id="trend"></a> `trend` | `"stable"` \| `"up"` \| `"down"` | Trend direction | [defi/protocols/src/modules/tool-marketplace/discovery/types.ts:279](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/modules/tool-marketplace/discovery/types.ts#L279) |

***

### UserProfile

Defined in: [defi/protocols/src/modules/tool-marketplace/discovery/types.ts:186](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/modules/tool-marketplace/discovery/types.ts#L186)

User profile for personalized recommendations

#### Properties

| Property | Type | Description | Defined in |
| :------ | :------ | :------ | :------ |
| <a id="address"></a> `address` | `` `0x${string}` `` | User wallet address | [defi/protocols/src/modules/tool-marketplace/discovery/types.ts:188](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/modules/tool-marketplace/discovery/types.ts#L188) |
| <a id="avgspendpercall"></a> `avgSpendPerCall` | `string` | Average spend per call in USD | [defi/protocols/src/modules/tool-marketplace/discovery/types.ts:194](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/modules/tool-marketplace/discovery/types.ts#L194) |
| <a id="categories-1"></a> `categories` | `Record`\<`string`, `number`\> | Category preferences (category -> usage count) | [defi/protocols/src/modules/tool-marketplace/discovery/types.ts:192](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/modules/tool-marketplace/discovery/types.ts#L192) |
| <a id="lastactiveat"></a> `lastActiveAt?` | `number` | Last active timestamp | [defi/protocols/src/modules/tool-marketplace/discovery/types.ts:202](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/modules/tool-marketplace/discovery/types.ts#L202) |
| <a id="preferredchains"></a> `preferredChains` | `string`[] | Preferred blockchain networks | [defi/protocols/src/modules/tool-marketplace/discovery/types.ts:196](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/modules/tool-marketplace/discovery/types.ts#L196) |
| <a id="preferredtags"></a> `preferredTags?` | `string`[] | Tags the user frequently interacts with | [defi/protocols/src/modules/tool-marketplace/discovery/types.ts:198](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/modules/tool-marketplace/discovery/types.ts#L198) |
| <a id="pricesensitivity"></a> `priceSensitivity?` | `number` | Price sensitivity (0-1, 1 = very price sensitive) | [defi/protocols/src/modules/tool-marketplace/discovery/types.ts:200](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/modules/tool-marketplace/discovery/types.ts#L200) |
| <a id="usedtools"></a> `usedTools` | `string`[] | Previously used tool IDs | [defi/protocols/src/modules/tool-marketplace/discovery/types.ts:190](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/modules/tool-marketplace/discovery/types.ts#L190) |

***

### ZeroResultQuery

Defined in: [defi/protocols/src/modules/tool-marketplace/discovery/types.ts:499](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/modules/tool-marketplace/discovery/types.ts#L499)

Zero result query

#### Properties

| Property | Type | Description | Defined in |
| :------ | :------ | :------ | :------ |
| <a id="count"></a> `count` | `number` | Count of times searched | [defi/protocols/src/modules/tool-marketplace/discovery/types.ts:503](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/modules/tool-marketplace/discovery/types.ts#L503) |
| <a id="firstsearchedat"></a> `firstSearchedAt` | `number` | First searched | [defi/protocols/src/modules/tool-marketplace/discovery/types.ts:505](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/modules/tool-marketplace/discovery/types.ts#L505) |
| <a id="lastsearchedat"></a> `lastSearchedAt` | `number` | Last searched | [defi/protocols/src/modules/tool-marketplace/discovery/types.ts:507](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/modules/tool-marketplace/discovery/types.ts#L507) |
| <a id="query-4"></a> `query` | `string` | Query | [defi/protocols/src/modules/tool-marketplace/discovery/types.ts:501](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/modules/tool-marketplace/discovery/types.ts#L501) |
| <a id="suggestedalternatives"></a> `suggestedAlternatives?` | `string`[] | Suggested alternatives | [defi/protocols/src/modules/tool-marketplace/discovery/types.ts:509](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/modules/tool-marketplace/discovery/types.ts#L509) |

## Type Aliases

### FilterOperator

```ts
type FilterOperator = "AND" | "OR";
```

Defined in: [defi/protocols/src/modules/tool-marketplace/discovery/types.ts:116](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/modules/tool-marketplace/discovery/types.ts#L116)

Filter operators for combining conditions

***

### TrendingPeriod

```ts
type TrendingPeriod = "1h" | "24h" | "7d" | "30d";
```

Defined in: [defi/protocols/src/modules/tool-marketplace/discovery/types.ts:262](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/modules/tool-marketplace/discovery/types.ts#L262)

Trending period
