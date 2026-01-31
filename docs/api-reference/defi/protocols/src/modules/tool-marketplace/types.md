[**Universal Crypto MCP API Reference v1.0.0**](../../../../../index.md)

***

[Universal Crypto MCP API Reference](/docs/api/index.md) / defi/protocols/src/modules/tool-marketplace/types

# defi/protocols/src/modules/tool-marketplace/types

## Interfaces

### CreatorAnalytics

Defined in: [defi/protocols/src/modules/tool-marketplace/types.ts:244](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/modules/tool-marketplace/types.ts#L244)

Creator analytics

#### Properties

| Property | Type | Description | Defined in |
| :------ | :------ | :------ | :------ |
| <a id="avgrating"></a> `avgRating` | `number` | Average rating across all tools | [defi/protocols/src/modules/tool-marketplace/types.ts:254](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/modules/tool-marketplace/types.ts#L254) |
| <a id="creatoraddress"></a> `creatorAddress` | `` `0x${string}` `` | Creator address | [defi/protocols/src/modules/tool-marketplace/types.ts:246](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/modules/tool-marketplace/types.ts#L246) |
| <a id="revenuebytool"></a> `revenueByTool` | \{ `calls`: `number`; `revenue`: `string`; `toolId`: `string`; `toolName`: `string`; \}[] | Revenue by tool | [defi/protocols/src/modules/tool-marketplace/types.ts:256](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/modules/tool-marketplace/types.ts#L256) |
| <a id="toolsowned"></a> `toolsOwned` | `number` | Tools owned | [defi/protocols/src/modules/tool-marketplace/types.ts:248](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/modules/tool-marketplace/types.ts#L248) |
| <a id="totalcalls"></a> `totalCalls` | `number` | Total calls across all tools | [defi/protocols/src/modules/tool-marketplace/types.ts:252](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/modules/tool-marketplace/types.ts#L252) |
| <a id="totalrevenue"></a> `totalRevenue` | `string` | Total revenue earned | [defi/protocols/src/modules/tool-marketplace/types.ts:250](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/modules/tool-marketplace/types.ts#L250) |
| <a id="weeklyrevenuehistory"></a> `weeklyRevenueHistory` | \{ `revenue`: `string`; `week`: `string`; \}[] | Weekly revenue history | [defi/protocols/src/modules/tool-marketplace/types.ts:263](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/modules/tool-marketplace/types.ts#L263) |

***

### MarketplaceEvent

Defined in: [defi/protocols/src/modules/tool-marketplace/types.ts:345](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/modules/tool-marketplace/types.ts#L345)

Marketplace event

#### Properties

| Property | Type | Description | Defined in |
| :------ | :------ | :------ | :------ |
| <a id="amount"></a> `amount?` | `string` | Amount (if applicable) | [defi/protocols/src/modules/tool-marketplace/types.ts:355](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/modules/tool-marketplace/types.ts#L355) |
| <a id="data"></a> `data?` | `Record`\<`string`, `unknown`\> | Additional data | [defi/protocols/src/modules/tool-marketplace/types.ts:359](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/modules/tool-marketplace/types.ts#L359) |
| <a id="timestamp"></a> `timestamp` | `number` | Event timestamp | [defi/protocols/src/modules/tool-marketplace/types.ts:349](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/modules/tool-marketplace/types.ts#L349) |
| <a id="toolid"></a> `toolId?` | `string` | Tool ID (if applicable) | [defi/protocols/src/modules/tool-marketplace/types.ts:351](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/modules/tool-marketplace/types.ts#L351) |
| <a id="txhash"></a> `txHash?` | `string` | Transaction hash (if applicable) | [defi/protocols/src/modules/tool-marketplace/types.ts:357](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/modules/tool-marketplace/types.ts#L357) |
| <a id="type"></a> `type` | [`MarketplaceEventType`](/docs/api/defi/protocols/src/modules/tool-marketplace/types.md#marketplaceeventtype-1) | Event type | [defi/protocols/src/modules/tool-marketplace/types.ts:347](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/modules/tool-marketplace/types.ts#L347) |
| <a id="useraddress"></a> `userAddress?` | `` `0x${string}` `` | User address (if applicable) | [defi/protocols/src/modules/tool-marketplace/types.ts:353](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/modules/tool-marketplace/types.ts#L353) |

***

### MarketplaceStats

Defined in: [defi/protocols/src/modules/tool-marketplace/types.ts:300](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/modules/tool-marketplace/types.ts#L300)

Marketplace statistics

#### Properties

| Property | Type | Description | Defined in |
| :------ | :------ | :------ | :------ |
| <a id="activetools"></a> `activeTools` | `number` | Active tools | [defi/protocols/src/modules/tool-marketplace/types.ts:304](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/modules/tool-marketplace/types.ts#L304) |
| <a id="avgtoolprice"></a> `avgToolPrice` | `string` | Average tool price | [defi/protocols/src/modules/tool-marketplace/types.ts:316](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/modules/tool-marketplace/types.ts#L316) |
| <a id="topcategory"></a> `topCategory` | [`ToolCategory`](/docs/api/defi/protocols/src/modules/tool-marketplace/types.md#toolcategory) | Most popular category | [defi/protocols/src/modules/tool-marketplace/types.ts:318](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/modules/tool-marketplace/types.ts#L318) |
| <a id="toptoolsbyrevenue"></a> `topToolsByRevenue` | \{ `name`: `string`; `revenue`: `string`; `toolId`: `string`; \}[] | Top tools by revenue | [defi/protocols/src/modules/tool-marketplace/types.ts:320](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/modules/tool-marketplace/types.ts#L320) |
| <a id="totalcalls-1"></a> `totalCalls` | `number` | Total calls (all time) | [defi/protocols/src/modules/tool-marketplace/types.ts:314](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/modules/tool-marketplace/types.ts#L314) |
| <a id="totalcreators"></a> `totalCreators` | `number` | Total creators | [defi/protocols/src/modules/tool-marketplace/types.ts:306](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/modules/tool-marketplace/types.ts#L306) |
| <a id="totaltools"></a> `totalTools` | `number` | Total tools registered | [defi/protocols/src/modules/tool-marketplace/types.ts:302](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/modules/tool-marketplace/types.ts#L302) |
| <a id="totalvolume"></a> `totalVolume` | `string` | Total volume (all time) | [defi/protocols/src/modules/tool-marketplace/types.ts:308](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/modules/tool-marketplace/types.ts#L308) |
| <a id="volume24h"></a> `volume24h` | `string` | Volume last 24h | [defi/protocols/src/modules/tool-marketplace/types.ts:310](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/modules/tool-marketplace/types.ts#L310) |
| <a id="volume7d"></a> `volume7d` | `string` | Volume last 7 days | [defi/protocols/src/modules/tool-marketplace/types.ts:312](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/modules/tool-marketplace/types.ts#L312) |

***

### PayoutConfig

Defined in: [defi/protocols/src/modules/tool-marketplace/types.ts:365](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/modules/tool-marketplace/types.ts#L365)

Payout configuration

#### Properties

| Property | Type | Description | Defined in |
| :------ | :------ | :------ | :------ |
| <a id="autopayoutenabled"></a> `autoPayoutEnabled` | `boolean` | Auto-payout enabled | [defi/protocols/src/modules/tool-marketplace/types.ts:371](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/modules/tool-marketplace/types.ts#L371) |
| <a id="minpayoutamount"></a> `minPayoutAmount` | `string` | Minimum amount for payout | [defi/protocols/src/modules/tool-marketplace/types.ts:367](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/modules/tool-marketplace/types.ts#L367) |
| <a id="payoutfrequencydays"></a> `payoutFrequencyDays` | `number` | Payout frequency in days | [defi/protocols/src/modules/tool-marketplace/types.ts:369](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/modules/tool-marketplace/types.ts#L369) |
| <a id="payouttoken"></a> `payoutToken` | `"USDC"` \| `"USDs"` | Payout token | [defi/protocols/src/modules/tool-marketplace/types.ts:373](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/modules/tool-marketplace/types.ts#L373) |

***

### RegisteredTool

Defined in: [defi/protocols/src/modules/tool-marketplace/types.ts:153](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/modules/tool-marketplace/types.ts#L153)

Registered tool (full record)

#### Extends

- [`RegisterToolInput`](/docs/api/defi/protocols/src/modules/tool-marketplace/types.md#registertoolinput)

#### Properties

| Property | Type | Description | Inherited from | Defined in |
| :------ | :------ | :------ | :------ | :------ |
| <a id="category"></a> `category` | [`ToolCategory`](/docs/api/defi/protocols/src/modules/tool-marketplace/types.md#toolcategory) | Tool category | [`RegisterToolInput`](/docs/api/defi/protocols/src/modules/tool-marketplace/types.md#registertoolinput).[`category`](/docs/api/defi/protocols/src/modules/tool-marketplace/types.md#category-1) | [defi/protocols/src/modules/tool-marketplace/types.ts:133](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/modules/tool-marketplace/types.ts#L133) |
| <a id="description"></a> `description` | `string` | Tool description | [`RegisterToolInput`](/docs/api/defi/protocols/src/modules/tool-marketplace/types.md#registertoolinput).[`description`](/docs/api/defi/protocols/src/modules/tool-marketplace/types.md#description-1) | [defi/protocols/src/modules/tool-marketplace/types.ts:129](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/modules/tool-marketplace/types.ts#L129) |
| <a id="displayname"></a> `displayName` | `string` | Human-readable display name | [`RegisterToolInput`](/docs/api/defi/protocols/src/modules/tool-marketplace/types.md#registertoolinput).[`displayName`](/docs/api/defi/protocols/src/modules/tool-marketplace/types.md#displayname-1) | [defi/protocols/src/modules/tool-marketplace/types.ts:127](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/modules/tool-marketplace/types.ts#L127) |
| <a id="docsurl"></a> `docsUrl?` | `string` | Documentation URL | [`RegisterToolInput`](/docs/api/defi/protocols/src/modules/tool-marketplace/types.md#registertoolinput).[`docsUrl`](/docs/api/defi/protocols/src/modules/tool-marketplace/types.md#docsurl-1) | [defi/protocols/src/modules/tool-marketplace/types.ts:141](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/modules/tool-marketplace/types.ts#L141) |
| <a id="endpoint"></a> `endpoint` | `string` | API endpoint URL | [`RegisterToolInput`](/docs/api/defi/protocols/src/modules/tool-marketplace/types.md#registertoolinput).[`endpoint`](/docs/api/defi/protocols/src/modules/tool-marketplace/types.md#endpoint-1) | [defi/protocols/src/modules/tool-marketplace/types.ts:131](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/modules/tool-marketplace/types.ts#L131) |
| <a id="iconurl"></a> `iconUrl?` | `string` | Icon URL | [`RegisterToolInput`](/docs/api/defi/protocols/src/modules/tool-marketplace/types.md#registertoolinput).[`iconUrl`](/docs/api/defi/protocols/src/modules/tool-marketplace/types.md#iconurl-1) | [defi/protocols/src/modules/tool-marketplace/types.ts:143](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/modules/tool-marketplace/types.ts#L143) |
| <a id="metadata"></a> `metadata` | [`ToolMetadata`](/docs/api/defi/protocols/src/modules/tool-marketplace/types.md#toolmetadata) | Metadata stats | - | [defi/protocols/src/modules/tool-marketplace/types.ts:161](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/modules/tool-marketplace/types.ts#L161) |
| <a id="name"></a> `name` | `string` | Tool name (unique identifier) | [`RegisterToolInput`](/docs/api/defi/protocols/src/modules/tool-marketplace/types.md#registertoolinput).[`name`](/docs/api/defi/protocols/src/modules/tool-marketplace/types.md#name-1) | [defi/protocols/src/modules/tool-marketplace/types.ts:125](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/modules/tool-marketplace/types.ts#L125) |
| <a id="owner"></a> `owner` | `` `0x${string}` `` | Tool owner address | [`RegisterToolInput`](/docs/api/defi/protocols/src/modules/tool-marketplace/types.md#registertoolinput).[`owner`](/docs/api/defi/protocols/src/modules/tool-marketplace/types.md#owner-1) | [defi/protocols/src/modules/tool-marketplace/types.ts:139](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/modules/tool-marketplace/types.ts#L139) |
| <a id="pricing"></a> `pricing` | [`ToolPricing`](/docs/api/defi/protocols/src/modules/tool-marketplace/types.md#toolpricing) | Pricing configuration | [`RegisterToolInput`](/docs/api/defi/protocols/src/modules/tool-marketplace/types.md#registertoolinput).[`pricing`](/docs/api/defi/protocols/src/modules/tool-marketplace/types.md#pricing-1) | [defi/protocols/src/modules/tool-marketplace/types.ts:135](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/modules/tool-marketplace/types.ts#L135) |
| <a id="registeredat"></a> `registeredAt` | `number` | Registration timestamp | - | [defi/protocols/src/modules/tool-marketplace/types.ts:157](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/modules/tool-marketplace/types.ts#L157) |
| <a id="requiredheaders"></a> `requiredHeaders?` | `string`[] | Required authentication headers | [`RegisterToolInput`](/docs/api/defi/protocols/src/modules/tool-marketplace/types.md#registertoolinput).[`requiredHeaders`](/docs/api/defi/protocols/src/modules/tool-marketplace/types.md#requiredheaders-1) | [defi/protocols/src/modules/tool-marketplace/types.ts:147](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/modules/tool-marketplace/types.ts#L147) |
| <a id="revenuesplit"></a> `revenueSplit` | [`RevenueSplit`](/docs/api/defi/protocols/src/modules/tool-marketplace/types.md#revenuesplit-2)[] | Revenue split configuration | [`RegisterToolInput`](/docs/api/defi/protocols/src/modules/tool-marketplace/types.md#registertoolinput).[`revenueSplit`](/docs/api/defi/protocols/src/modules/tool-marketplace/types.md#revenuesplit-1) | [defi/protocols/src/modules/tool-marketplace/types.ts:137](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/modules/tool-marketplace/types.ts#L137) |
| <a id="status"></a> `status` | [`ToolStatus`](/docs/api/defi/protocols/src/modules/tool-marketplace/types.md#toolstatus) | Current status | - | [defi/protocols/src/modules/tool-marketplace/types.ts:159](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/modules/tool-marketplace/types.ts#L159) |
| <a id="tags"></a> `tags?` | `string`[] | Tags for discovery | [`RegisterToolInput`](/docs/api/defi/protocols/src/modules/tool-marketplace/types.md#registertoolinput).[`tags`](/docs/api/defi/protocols/src/modules/tool-marketplace/types.md#tags-1) | [defi/protocols/src/modules/tool-marketplace/types.ts:145](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/modules/tool-marketplace/types.ts#L145) |
| <a id="toolid-1"></a> `toolId` | `string` | On-chain tool ID | - | [defi/protocols/src/modules/tool-marketplace/types.ts:155](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/modules/tool-marketplace/types.ts#L155) |

***

### RegisterToolInput

Defined in: [defi/protocols/src/modules/tool-marketplace/types.ts:123](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/modules/tool-marketplace/types.ts#L123)

Tool registration input

#### Extended by

- [`RegisteredTool`](/docs/api/defi/protocols/src/modules/tool-marketplace/types.md#registeredtool)

#### Properties

| Property | Type | Description | Defined in |
| :------ | :------ | :------ | :------ |
| <a id="category-1"></a> `category` | [`ToolCategory`](/docs/api/defi/protocols/src/modules/tool-marketplace/types.md#toolcategory) | Tool category | [defi/protocols/src/modules/tool-marketplace/types.ts:133](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/modules/tool-marketplace/types.ts#L133) |
| <a id="description-1"></a> `description` | `string` | Tool description | [defi/protocols/src/modules/tool-marketplace/types.ts:129](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/modules/tool-marketplace/types.ts#L129) |
| <a id="displayname-1"></a> `displayName` | `string` | Human-readable display name | [defi/protocols/src/modules/tool-marketplace/types.ts:127](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/modules/tool-marketplace/types.ts#L127) |
| <a id="docsurl-1"></a> `docsUrl?` | `string` | Documentation URL | [defi/protocols/src/modules/tool-marketplace/types.ts:141](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/modules/tool-marketplace/types.ts#L141) |
| <a id="endpoint-1"></a> `endpoint` | `string` | API endpoint URL | [defi/protocols/src/modules/tool-marketplace/types.ts:131](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/modules/tool-marketplace/types.ts#L131) |
| <a id="iconurl-1"></a> `iconUrl?` | `string` | Icon URL | [defi/protocols/src/modules/tool-marketplace/types.ts:143](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/modules/tool-marketplace/types.ts#L143) |
| <a id="name-1"></a> `name` | `string` | Tool name (unique identifier) | [defi/protocols/src/modules/tool-marketplace/types.ts:125](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/modules/tool-marketplace/types.ts#L125) |
| <a id="owner-1"></a> `owner` | `` `0x${string}` `` | Tool owner address | [defi/protocols/src/modules/tool-marketplace/types.ts:139](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/modules/tool-marketplace/types.ts#L139) |
| <a id="pricing-1"></a> `pricing` | [`ToolPricing`](/docs/api/defi/protocols/src/modules/tool-marketplace/types.md#toolpricing) | Pricing configuration | [defi/protocols/src/modules/tool-marketplace/types.ts:135](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/modules/tool-marketplace/types.ts#L135) |
| <a id="requiredheaders-1"></a> `requiredHeaders?` | `string`[] | Required authentication headers | [defi/protocols/src/modules/tool-marketplace/types.ts:147](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/modules/tool-marketplace/types.ts#L147) |
| <a id="revenuesplit-1"></a> `revenueSplit` | [`RevenueSplit`](/docs/api/defi/protocols/src/modules/tool-marketplace/types.md#revenuesplit-2)[] | Revenue split configuration | [defi/protocols/src/modules/tool-marketplace/types.ts:137](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/modules/tool-marketplace/types.ts#L137) |
| <a id="tags-1"></a> `tags?` | `string`[] | Tags for discovery | [defi/protocols/src/modules/tool-marketplace/types.ts:145](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/modules/tool-marketplace/types.ts#L145) |

***

### RevenueSplit

Defined in: [defi/protocols/src/modules/tool-marketplace/types.ts:13](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/modules/tool-marketplace/types.ts#L13)

Revenue split configuration for a tool

#### Properties

| Property | Type | Description | Defined in |
| :------ | :------ | :------ | :------ |
| <a id="address"></a> `address` | `` `0x${string}` `` | Recipient address | [defi/protocols/src/modules/tool-marketplace/types.ts:15](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/modules/tool-marketplace/types.ts#L15) |
| <a id="label"></a> `label?` | `string` | Optional label (e.g., "creator", "platform", "referrer") | [defi/protocols/src/modules/tool-marketplace/types.ts:19](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/modules/tool-marketplace/types.ts#L19) |
| <a id="percent"></a> `percent` | `number` | Percentage of revenue (0-100) | [defi/protocols/src/modules/tool-marketplace/types.ts:17](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/modules/tool-marketplace/types.ts#L17) |

***

### SubscriptionStatus

Defined in: [defi/protocols/src/modules/tool-marketplace/types.ts:272](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/modules/tool-marketplace/types.ts#L272)

Subscription status

#### Properties

| Property | Type | Description | Defined in |
| :------ | :------ | :------ | :------ |
| <a id="autorenew"></a> `autoRenew` | `boolean` | Auto-renew enabled | [defi/protocols/src/modules/tool-marketplace/types.ts:290](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/modules/tool-marketplace/types.ts#L290) |
| <a id="callsremaining"></a> `callsRemaining` | `number` | Calls remaining | [defi/protocols/src/modules/tool-marketplace/types.ts:288](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/modules/tool-marketplace/types.ts#L288) |
| <a id="callsused"></a> `callsUsed` | `number` | Calls used this period | [defi/protocols/src/modules/tool-marketplace/types.ts:286](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/modules/tool-marketplace/types.ts#L286) |
| <a id="enddate"></a> `endDate` | `number` | End date | [defi/protocols/src/modules/tool-marketplace/types.ts:284](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/modules/tool-marketplace/types.ts#L284) |
| <a id="lastpayment"></a> `lastPayment` | `number` | Last payment timestamp | [defi/protocols/src/modules/tool-marketplace/types.ts:292](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/modules/tool-marketplace/types.ts#L292) |
| <a id="nextpaymentdue"></a> `nextPaymentDue` | `number` | Next payment due | [defi/protocols/src/modules/tool-marketplace/types.ts:294](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/modules/tool-marketplace/types.ts#L294) |
| <a id="startdate"></a> `startDate` | `number` | Start date | [defi/protocols/src/modules/tool-marketplace/types.ts:282](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/modules/tool-marketplace/types.ts#L282) |
| <a id="subscriptionid"></a> `subscriptionId` | `string` | Subscription ID | [defi/protocols/src/modules/tool-marketplace/types.ts:274](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/modules/tool-marketplace/types.ts#L274) |
| <a id="tiername"></a> `tierName` | `string` | Tier name | [defi/protocols/src/modules/tool-marketplace/types.ts:280](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/modules/tool-marketplace/types.ts#L280) |
| <a id="toolid-2"></a> `toolId` | `string` | Tool ID | [defi/protocols/src/modules/tool-marketplace/types.ts:278](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/modules/tool-marketplace/types.ts#L278) |
| <a id="useraddress-1"></a> `userAddress` | `` `0x${string}` `` | User address | [defi/protocols/src/modules/tool-marketplace/types.ts:276](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/modules/tool-marketplace/types.ts#L276) |

***

### SubscriptionTier

Defined in: [defi/protocols/src/modules/tool-marketplace/types.ts:30](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/modules/tool-marketplace/types.ts#L30)

Subscription tier configuration

#### Properties

| Property | Type | Description | Defined in |
| :------ | :------ | :------ | :------ |
| <a id="callsincluded"></a> `callsIncluded` | `number` | Calls included per month | [defi/protocols/src/modules/tool-marketplace/types.ts:36](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/modules/tool-marketplace/types.ts#L36) |
| <a id="features"></a> `features` | `string`[] | Features included in this tier | [defi/protocols/src/modules/tool-marketplace/types.ts:40](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/modules/tool-marketplace/types.ts#L40) |
| <a id="monthlyprice"></a> `monthlyPrice` | `string` | Monthly price in USD | [defi/protocols/src/modules/tool-marketplace/types.ts:34](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/modules/tool-marketplace/types.ts#L34) |
| <a id="name-2"></a> `name` | `string` | Tier name | [defi/protocols/src/modules/tool-marketplace/types.ts:32](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/modules/tool-marketplace/types.ts#L32) |
| <a id="overageprice"></a> `overagePrice?` | `string` | Price per call after limit (optional) | [defi/protocols/src/modules/tool-marketplace/types.ts:38](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/modules/tool-marketplace/types.ts#L38) |

***

### TieredPricing

Defined in: [defi/protocols/src/modules/tool-marketplace/types.ts:46](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/modules/tool-marketplace/types.ts#L46)

Tiered pricing configuration

#### Properties

| Property | Type | Description | Defined in |
| :------ | :------ | :------ | :------ |
| <a id="tiers"></a> `tiers` | \{ `maxCalls`: `number`; `minCalls`: `number`; `pricePerCall`: `string`; \}[] | Usage tiers | [defi/protocols/src/modules/tool-marketplace/types.ts:48](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/modules/tool-marketplace/types.ts#L48) |

***

### ToolDiscoveryFilter

Defined in: [defi/protocols/src/modules/tool-marketplace/types.ts:167](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/modules/tool-marketplace/types.ts#L167)

Tool discovery filters

#### Properties

| Property | Type | Description | Defined in |
| :------ | :------ | :------ | :------ |
| <a id="activeonly"></a> `activeOnly?` | `boolean` | Only active tools | [defi/protocols/src/modules/tool-marketplace/types.ts:181](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/modules/tool-marketplace/types.ts#L181) |
| <a id="category-2"></a> `category?` | [`ToolCategory`](/docs/api/defi/protocols/src/modules/tool-marketplace/types.md#toolcategory) | Category filter | [defi/protocols/src/modules/tool-marketplace/types.ts:171](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/modules/tool-marketplace/types.ts#L171) |
| <a id="chain"></a> `chain?` | `string` | Supported chain | [defi/protocols/src/modules/tool-marketplace/types.ts:183](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/modules/tool-marketplace/types.ts#L183) |
| <a id="limit"></a> `limit?` | `number` | Pagination limit | [defi/protocols/src/modules/tool-marketplace/types.ts:189](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/modules/tool-marketplace/types.ts#L189) |
| <a id="maxprice"></a> `maxPrice?` | `string` | Maximum price per call | [defi/protocols/src/modules/tool-marketplace/types.ts:169](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/modules/tool-marketplace/types.ts#L169) |
| <a id="minrating"></a> `minRating?` | `number` | Minimum rating | [defi/protocols/src/modules/tool-marketplace/types.ts:175](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/modules/tool-marketplace/types.ts#L175) |
| <a id="offset"></a> `offset?` | `number` | Pagination offset | [defi/protocols/src/modules/tool-marketplace/types.ts:191](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/modules/tool-marketplace/types.ts#L191) |
| <a id="pricingmodel"></a> `pricingModel?` | [`PricingModel`](/docs/api/defi/protocols/src/modules/tool-marketplace/types.md#pricingmodel-1) | Pricing model filter | [defi/protocols/src/modules/tool-marketplace/types.ts:173](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/modules/tool-marketplace/types.ts#L173) |
| <a id="query"></a> `query?` | `string` | Search query | [defi/protocols/src/modules/tool-marketplace/types.ts:177](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/modules/tool-marketplace/types.ts#L177) |
| <a id="sortby"></a> `sortBy?` | `"price"` \| `"rating"` \| `"newest"` \| `"popularity"` | Sort by field | [defi/protocols/src/modules/tool-marketplace/types.ts:185](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/modules/tool-marketplace/types.ts#L185) |
| <a id="sortorder"></a> `sortOrder?` | `"asc"` \| `"desc"` | Sort direction | [defi/protocols/src/modules/tool-marketplace/types.ts:187](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/modules/tool-marketplace/types.ts#L187) |
| <a id="tags-2"></a> `tags?` | `string`[] | Tags to match | [defi/protocols/src/modules/tool-marketplace/types.ts:179](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/modules/tool-marketplace/types.ts#L179) |

***

### ToolMetadata

Defined in: [defi/protocols/src/modules/tool-marketplace/types.ts:101](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/modules/tool-marketplace/types.ts#L101)

Tool metadata

#### Properties

| Property | Type | Description | Defined in |
| :------ | :------ | :------ | :------ |
| <a id="avgresponsetime"></a> `avgResponseTime` | `number` | Average response time in ms | [defi/protocols/src/modules/tool-marketplace/types.ts:111](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/modules/tool-marketplace/types.ts#L111) |
| <a id="rating"></a> `rating` | `number` | User rating (1-5) | [defi/protocols/src/modules/tool-marketplace/types.ts:115](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/modules/tool-marketplace/types.ts#L115) |
| <a id="ratingcount"></a> `ratingCount` | `number` | Number of ratings | [defi/protocols/src/modules/tool-marketplace/types.ts:117](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/modules/tool-marketplace/types.ts#L117) |
| <a id="totalcalls-2"></a> `totalCalls` | `number` | Total calls made | [defi/protocols/src/modules/tool-marketplace/types.ts:107](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/modules/tool-marketplace/types.ts#L107) |
| <a id="totalrevenue-1"></a> `totalRevenue` | `string` | Total revenue generated in USD | [defi/protocols/src/modules/tool-marketplace/types.ts:109](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/modules/tool-marketplace/types.ts#L109) |
| <a id="updatedat"></a> `updatedAt` | `number` | Last updated timestamp | [defi/protocols/src/modules/tool-marketplace/types.ts:105](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/modules/tool-marketplace/types.ts#L105) |
| <a id="uptime"></a> `uptime` | `number` | Uptime percentage (0-100) | [defi/protocols/src/modules/tool-marketplace/types.ts:113](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/modules/tool-marketplace/types.ts#L113) |
| <a id="version"></a> `version` | `string` | Tool version | [defi/protocols/src/modules/tool-marketplace/types.ts:103](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/modules/tool-marketplace/types.ts#L103) |

***

### ToolPricing

Defined in: [defi/protocols/src/modules/tool-marketplace/types.ts:61](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/modules/tool-marketplace/types.ts#L61)

Full pricing configuration

#### Properties

| Property | Type | Description | Defined in |
| :------ | :------ | :------ | :------ |
| <a id="acceptedtokens"></a> `acceptedTokens` | (`"USDC"` \| `"USDs"` \| `"ETH"`)[] | Accepted tokens | [defi/protocols/src/modules/tool-marketplace/types.ts:73](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/modules/tool-marketplace/types.ts#L73) |
| <a id="baseprice"></a> `basePrice?` | `string` | Base price per call (for per-call and freemium models) | [defi/protocols/src/modules/tool-marketplace/types.ts:65](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/modules/tool-marketplace/types.ts#L65) |
| <a id="freecallsperday"></a> `freeCallsPerDay?` | `number` | Free calls per day (for freemium model) | [defi/protocols/src/modules/tool-marketplace/types.ts:67](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/modules/tool-marketplace/types.ts#L67) |
| <a id="model"></a> `model` | [`PricingModel`](/docs/api/defi/protocols/src/modules/tool-marketplace/types.md#pricingmodel-1) | Pricing model type | [defi/protocols/src/modules/tool-marketplace/types.ts:63](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/modules/tool-marketplace/types.ts#L63) |
| <a id="subscriptiontiers"></a> `subscriptionTiers?` | [`SubscriptionTier`](/docs/api/defi/protocols/src/modules/tool-marketplace/types.md#subscriptiontier)[] | Subscription tiers (for subscription model) | [defi/protocols/src/modules/tool-marketplace/types.ts:69](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/modules/tool-marketplace/types.ts#L69) |
| <a id="supportedchains"></a> `supportedChains` | `string`[] | Supported chains | [defi/protocols/src/modules/tool-marketplace/types.ts:75](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/modules/tool-marketplace/types.ts#L75) |
| <a id="tieredpricing-1"></a> `tieredPricing?` | [`TieredPricing`](/docs/api/defi/protocols/src/modules/tool-marketplace/types.md#tieredpricing) | Tiered pricing config (for tiered model) | [defi/protocols/src/modules/tool-marketplace/types.ts:71](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/modules/tool-marketplace/types.ts#L71) |

***

### ToolRevenue

Defined in: [defi/protocols/src/modules/tool-marketplace/types.ts:223](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/modules/tool-marketplace/types.ts#L223)

Revenue tracking for a tool

#### Properties

| Property | Type | Description | Defined in |
| :------ | :------ | :------ | :------ |
| <a id="lastpayoutat"></a> `lastPayoutAt?` | `number` | Last payout timestamp | [defi/protocols/src/modules/tool-marketplace/types.ts:238](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/modules/tool-marketplace/types.ts#L238) |
| <a id="monthlyrevenue"></a> `monthlyRevenue` | `string` | Revenue this month | [defi/protocols/src/modules/tool-marketplace/types.ts:231](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/modules/tool-marketplace/types.ts#L231) |
| <a id="pendingpayouts"></a> `pendingPayouts` | \{ `address`: `` `0x${string}` ``; `amount`: `string`; \}[] | Pending payouts by recipient | [defi/protocols/src/modules/tool-marketplace/types.ts:233](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/modules/tool-marketplace/types.ts#L233) |
| <a id="toolid-3"></a> `toolId` | `string` | Tool ID | [defi/protocols/src/modules/tool-marketplace/types.ts:225](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/modules/tool-marketplace/types.ts#L225) |
| <a id="totalrevenue-2"></a> `totalRevenue` | `string` | Total revenue all time | [defi/protocols/src/modules/tool-marketplace/types.ts:227](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/modules/tool-marketplace/types.ts#L227) |
| <a id="weeklyrevenue"></a> `weeklyRevenue` | `string` | Revenue this week | [defi/protocols/src/modules/tool-marketplace/types.ts:229](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/modules/tool-marketplace/types.ts#L229) |

***

### ToolUsageRecord

Defined in: [defi/protocols/src/modules/tool-marketplace/types.ts:197](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/modules/tool-marketplace/types.ts#L197)

Tool usage record

#### Properties

| Property | Type | Description | Defined in |
| :------ | :------ | :------ | :------ |
| <a id="amountpaid"></a> `amountPaid` | `string` | Amount paid | [defi/protocols/src/modules/tool-marketplace/types.ts:207](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/modules/tool-marketplace/types.ts#L207) |
| <a id="error"></a> `error?` | `string` | Error message if failed | [defi/protocols/src/modules/tool-marketplace/types.ts:217](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/modules/tool-marketplace/types.ts#L217) |
| <a id="id"></a> `id` | `string` | Usage ID | [defi/protocols/src/modules/tool-marketplace/types.ts:199](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/modules/tool-marketplace/types.ts#L199) |
| <a id="responsetime"></a> `responseTime` | `number` | Response time in ms | [defi/protocols/src/modules/tool-marketplace/types.ts:213](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/modules/tool-marketplace/types.ts#L213) |
| <a id="success"></a> `success` | `boolean` | Success flag | [defi/protocols/src/modules/tool-marketplace/types.ts:215](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/modules/tool-marketplace/types.ts#L215) |
| <a id="timestamp-1"></a> `timestamp` | `number` | Timestamp | [defi/protocols/src/modules/tool-marketplace/types.ts:205](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/modules/tool-marketplace/types.ts#L205) |
| <a id="token"></a> `token` | `string` | Token used | [defi/protocols/src/modules/tool-marketplace/types.ts:209](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/modules/tool-marketplace/types.ts#L209) |
| <a id="toolid-4"></a> `toolId` | `string` | Tool ID | [defi/protocols/src/modules/tool-marketplace/types.ts:201](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/modules/tool-marketplace/types.ts#L201) |
| <a id="txhash-1"></a> `txHash` | `string` | Transaction hash | [defi/protocols/src/modules/tool-marketplace/types.ts:211](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/modules/tool-marketplace/types.ts#L211) |
| <a id="useraddress-2"></a> `userAddress` | `` `0x${string}` `` | User address | [defi/protocols/src/modules/tool-marketplace/types.ts:203](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/modules/tool-marketplace/types.ts#L203) |

## Type Aliases

### MarketplaceEventType

```ts
type MarketplaceEventType = 
  | "tool-registered"
  | "tool-updated"
  | "tool-paused"
  | "tool-activated"
  | "tool-called"
  | "payment-received"
  | "payout-executed"
  | "subscription-created"
  | "subscription-renewed"
  | "subscription-cancelled";
```

Defined in: [defi/protocols/src/modules/tool-marketplace/types.ts:330](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/modules/tool-marketplace/types.ts#L330)

Event types for marketplace

***

### PricingModel

```ts
type PricingModel = "per-call" | "subscription" | "tiered" | "freemium";
```

Defined in: [defi/protocols/src/modules/tool-marketplace/types.ts:25](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/modules/tool-marketplace/types.ts#L25)

Pricing model for a tool

***

### ToolCategory

```ts
type ToolCategory = 
  | "data"
  | "ai"
  | "defi"
  | "analytics"
  | "social"
  | "utilities"
  | "notifications"
  | "storage"
  | "compute"
  | "other";
```

Defined in: [defi/protocols/src/modules/tool-marketplace/types.ts:81](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/modules/tool-marketplace/types.ts#L81)

Tool category classification

***

### ToolStatus

```ts
type ToolStatus = "active" | "paused" | "deprecated" | "pending-review";
```

Defined in: [defi/protocols/src/modules/tool-marketplace/types.ts:96](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/modules/tool-marketplace/types.ts#L96)

Tool status
