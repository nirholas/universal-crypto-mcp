[**Universal Crypto MCP API Reference v1.0.0**](../../../../index.md)

***

[Universal Crypto MCP API Reference](/docs/api/index.md) / defi/protocols/src/hosting/revenue

# defi/protocols/src/hosting/revenue

## Interfaces

### PaymentRecord

Defined in: [defi/protocols/src/hosting/revenue.ts:23](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/hosting/revenue.ts#L23)

#### Properties

| Property | Type | Defined in |
| :------ | :------ | :------ |
| <a id="amount"></a> `amount` | `string` | [defi/protocols/src/hosting/revenue.ts:29](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/hosting/revenue.ts#L29) |
| <a id="amountusd"></a> `amountUSD` | `number` | [defi/protocols/src/hosting/revenue.ts:30](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/hosting/revenue.ts#L30) |
| <a id="chain"></a> `chain` | `SupportedChainId` | [defi/protocols/src/hosting/revenue.ts:33](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/hosting/revenue.ts#L33) |
| <a id="chainname"></a> `chainName` | `string` | [defi/protocols/src/hosting/revenue.ts:34](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/hosting/revenue.ts#L34) |
| <a id="confirmedat"></a> `confirmedAt?` | `Date` | [defi/protocols/src/hosting/revenue.ts:39](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/hosting/revenue.ts#L39) |
| <a id="createdat"></a> `createdAt` | `Date` | [defi/protocols/src/hosting/revenue.ts:38](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/hosting/revenue.ts#L38) |
| <a id="creatoramount"></a> `creatorAmount` | `number` | [defi/protocols/src/hosting/revenue.ts:31](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/hosting/revenue.ts#L31) |
| <a id="id"></a> `id` | `string` | [defi/protocols/src/hosting/revenue.ts:24](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/hosting/revenue.ts#L24) |
| <a id="paidoutat"></a> `paidOutAt?` | `Date` | [defi/protocols/src/hosting/revenue.ts:40](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/hosting/revenue.ts#L40) |
| <a id="platformamount"></a> `platformAmount` | `number` | [defi/protocols/src/hosting/revenue.ts:32](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/hosting/revenue.ts#L32) |
| <a id="recipient"></a> `recipient` | `string` | [defi/protocols/src/hosting/revenue.ts:36](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/hosting/revenue.ts#L36) |
| <a id="sender"></a> `sender` | `string` | [defi/protocols/src/hosting/revenue.ts:35](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/hosting/revenue.ts#L35) |
| <a id="serverid"></a> `serverId` | `string` | [defi/protocols/src/hosting/revenue.ts:25](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/hosting/revenue.ts#L25) |
| <a id="status"></a> `status` | `"pending"` \| `"confirmed"` \| `"paid_out"` | [defi/protocols/src/hosting/revenue.ts:37](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/hosting/revenue.ts#L37) |
| <a id="toolid"></a> `toolId` | `string` | [defi/protocols/src/hosting/revenue.ts:26](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/hosting/revenue.ts#L26) |
| <a id="toolname"></a> `toolName` | `string` | [defi/protocols/src/hosting/revenue.ts:27](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/hosting/revenue.ts#L27) |
| <a id="txhash"></a> `txHash` | `string` | [defi/protocols/src/hosting/revenue.ts:28](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/hosting/revenue.ts#L28) |

***

### PayoutResult

Defined in: [defi/protocols/src/hosting/revenue.ts:94](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/hosting/revenue.ts#L94)

#### Properties

| Property | Type | Defined in |
| :------ | :------ | :------ |
| <a id="amount-1"></a> `amount` | `number` | [defi/protocols/src/hosting/revenue.ts:96](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/hosting/revenue.ts#L96) |
| <a id="chain-1"></a> `chain` | `SupportedChainId` | [defi/protocols/src/hosting/revenue.ts:98](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/hosting/revenue.ts#L98) |
| <a id="error"></a> `error?` | `string` | [defi/protocols/src/hosting/revenue.ts:100](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/hosting/revenue.ts#L100) |
| <a id="status-1"></a> `status` | `"failed"` \| `"success"` | [defi/protocols/src/hosting/revenue.ts:99](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/hosting/revenue.ts#L99) |
| <a id="txhash-1"></a> `txHash` | `string` | [defi/protocols/src/hosting/revenue.ts:97](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/hosting/revenue.ts#L97) |
| <a id="userid"></a> `userId` | `string` | [defi/protocols/src/hosting/revenue.ts:95](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/hosting/revenue.ts#L95) |

***

### PendingPayout

Defined in: [defi/protocols/src/hosting/revenue.ts:83](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/hosting/revenue.ts#L83)

#### Properties

| Property | Type | Defined in |
| :------ | :------ | :------ |
| <a id="canrequestpayout"></a> `canRequestPayout` | `boolean` | [defi/protocols/src/hosting/revenue.ts:90](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/hosting/revenue.ts#L90) |
| <a id="email"></a> `email` | `string` | [defi/protocols/src/hosting/revenue.ts:85](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/hosting/revenue.ts#L85) |
| <a id="minimumthreshold"></a> `minimumThreshold` | `number` | [defi/protocols/src/hosting/revenue.ts:91](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/hosting/revenue.ts#L91) |
| <a id="oldestpaymentdate"></a> `oldestPaymentDate` | `Date` | [defi/protocols/src/hosting/revenue.ts:89](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/hosting/revenue.ts#L89) |
| <a id="paymentcount"></a> `paymentCount` | `number` | [defi/protocols/src/hosting/revenue.ts:88](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/hosting/revenue.ts#L88) |
| <a id="payoutaddress"></a> `payoutAddress` | `string` | [defi/protocols/src/hosting/revenue.ts:86](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/hosting/revenue.ts#L86) |
| <a id="pendingamount"></a> `pendingAmount` | `number` | [defi/protocols/src/hosting/revenue.ts:87](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/hosting/revenue.ts#L87) |
| <a id="userid-1"></a> `userId` | `string` | [defi/protocols/src/hosting/revenue.ts:84](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/hosting/revenue.ts#L84) |

***

### PlatformRevenue

Defined in: [defi/protocols/src/hosting/revenue.ts:73](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/hosting/revenue.ts#L73)

#### Extends

- [`RevenueStats`](/docs/api/defi/protocols/src/hosting/revenue.md#revenuestats)

#### Properties

| Property | Type | Inherited from | Defined in |
| :------ | :------ | :------ | :------ |
| <a id="activeservers"></a> `activeServers` | `number` | - | [defi/protocols/src/hosting/revenue.ts:74](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/hosting/revenue.ts#L74) |
| <a id="activeusers"></a> `activeUsers` | `number` | - | [defi/protocols/src/hosting/revenue.ts:75](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/hosting/revenue.ts#L75) |
| <a id="creatorearnings"></a> `creatorEarnings` | `number` | [`RevenueStats`](/docs/api/defi/protocols/src/hosting/revenue.md#revenuestats).[`creatorEarnings`](/docs/api/defi/protocols/src/hosting/revenue.md#creatorearnings-1) | [defi/protocols/src/hosting/revenue.ts:45](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/hosting/revenue.ts#L45) |
| <a id="pendingpayout-1"></a> `pendingPayout` | `number` | [`RevenueStats`](/docs/api/defi/protocols/src/hosting/revenue.md#revenuestats).[`pendingPayout`](/docs/api/defi/protocols/src/hosting/revenue.md#pendingpayout-2) | [defi/protocols/src/hosting/revenue.ts:47](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/hosting/revenue.ts#L47) |
| <a id="period"></a> `period` | [`RevenuePeriod`](/docs/api/defi/protocols/src/hosting/revenue.md#revenueperiod) | [`RevenueStats`](/docs/api/defi/protocols/src/hosting/revenue.md#revenuestats).[`period`](/docs/api/defi/protocols/src/hosting/revenue.md#period-1) | [defi/protocols/src/hosting/revenue.ts:49](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/hosting/revenue.ts#L49) |
| <a id="periodend"></a> `periodEnd` | `Date` | [`RevenueStats`](/docs/api/defi/protocols/src/hosting/revenue.md#revenuestats).[`periodEnd`](/docs/api/defi/protocols/src/hosting/revenue.md#periodend-1) | [defi/protocols/src/hosting/revenue.ts:51](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/hosting/revenue.ts#L51) |
| <a id="periodstart"></a> `periodStart` | `Date` | [`RevenueStats`](/docs/api/defi/protocols/src/hosting/revenue.md#revenuestats).[`periodStart`](/docs/api/defi/protocols/src/hosting/revenue.md#periodstart-1) | [defi/protocols/src/hosting/revenue.ts:50](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/hosting/revenue.ts#L50) |
| <a id="platformearnings"></a> `platformEarnings` | `number` | [`RevenueStats`](/docs/api/defi/protocols/src/hosting/revenue.md#revenuestats).[`platformEarnings`](/docs/api/defi/protocols/src/hosting/revenue.md#platformearnings-1) | [defi/protocols/src/hosting/revenue.ts:46](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/hosting/revenue.ts#L46) |
| <a id="topservers"></a> `topServers` | \{ `earnings`: `number`; `serverId`: `string`; `serverName`: `string`; \}[] | - | [defi/protocols/src/hosting/revenue.ts:76](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/hosting/revenue.ts#L76) |
| <a id="totalearnings"></a> `totalEarnings` | `number` | [`RevenueStats`](/docs/api/defi/protocols/src/hosting/revenue.md#revenuestats).[`totalEarnings`](/docs/api/defi/protocols/src/hosting/revenue.md#totalearnings-1) | [defi/protocols/src/hosting/revenue.ts:44](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/hosting/revenue.ts#L44) |
| <a id="transactioncount"></a> `transactionCount` | `number` | [`RevenueStats`](/docs/api/defi/protocols/src/hosting/revenue.md#revenuestats).[`transactionCount`](/docs/api/defi/protocols/src/hosting/revenue.md#transactioncount-1) | [defi/protocols/src/hosting/revenue.ts:48](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/hosting/revenue.ts#L48) |

***

### RevenueStats

Defined in: [defi/protocols/src/hosting/revenue.ts:43](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/hosting/revenue.ts#L43)

#### Extended by

- [`UserRevenue`](/docs/api/defi/protocols/src/hosting/revenue.md#userrevenue)
- [`PlatformRevenue`](/docs/api/defi/protocols/src/hosting/revenue.md#platformrevenue)

#### Properties

| Property | Type | Defined in |
| :------ | :------ | :------ |
| <a id="creatorearnings-1"></a> `creatorEarnings` | `number` | [defi/protocols/src/hosting/revenue.ts:45](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/hosting/revenue.ts#L45) |
| <a id="pendingpayout-2"></a> `pendingPayout` | `number` | [defi/protocols/src/hosting/revenue.ts:47](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/hosting/revenue.ts#L47) |
| <a id="period-1"></a> `period` | [`RevenuePeriod`](/docs/api/defi/protocols/src/hosting/revenue.md#revenueperiod) | [defi/protocols/src/hosting/revenue.ts:49](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/hosting/revenue.ts#L49) |
| <a id="periodend-1"></a> `periodEnd` | `Date` | [defi/protocols/src/hosting/revenue.ts:51](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/hosting/revenue.ts#L51) |
| <a id="periodstart-1"></a> `periodStart` | `Date` | [defi/protocols/src/hosting/revenue.ts:50](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/hosting/revenue.ts#L50) |
| <a id="platformearnings-1"></a> `platformEarnings` | `number` | [defi/protocols/src/hosting/revenue.ts:46](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/hosting/revenue.ts#L46) |
| <a id="totalearnings-1"></a> `totalEarnings` | `number` | [defi/protocols/src/hosting/revenue.ts:44](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/hosting/revenue.ts#L44) |
| <a id="transactioncount-1"></a> `transactionCount` | `number` | [defi/protocols/src/hosting/revenue.ts:48](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/hosting/revenue.ts#L48) |

***

### ServerRevenue

Defined in: [defi/protocols/src/hosting/revenue.ts:54](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/hosting/revenue.ts#L54)

#### Properties

| Property | Type | Defined in |
| :------ | :------ | :------ |
| <a id="creatorearnings-2"></a> `creatorEarnings` | `number` | [defi/protocols/src/hosting/revenue.ts:58](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/hosting/revenue.ts#L58) |
| <a id="serverid-1"></a> `serverId` | `string` | [defi/protocols/src/hosting/revenue.ts:55](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/hosting/revenue.ts#L55) |
| <a id="servername"></a> `serverName` | `string` | [defi/protocols/src/hosting/revenue.ts:56](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/hosting/revenue.ts#L56) |
| <a id="toptools"></a> `topTools` | \{ `callCount`: `number`; `earnings`: `number`; `toolId`: `string`; `toolName`: `string`; \}[] | [defi/protocols/src/hosting/revenue.ts:60](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/hosting/revenue.ts#L60) |
| <a id="totalearnings-2"></a> `totalEarnings` | `number` | [defi/protocols/src/hosting/revenue.ts:57](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/hosting/revenue.ts#L57) |
| <a id="transactioncount-2"></a> `transactionCount` | `number` | [defi/protocols/src/hosting/revenue.ts:59](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/hosting/revenue.ts#L59) |

***

### TransactionHistoryOptions

Defined in: [defi/protocols/src/hosting/revenue.ts:574](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/hosting/revenue.ts#L574)

#### Properties

| Property | Type | Defined in |
| :------ | :------ | :------ |
| <a id="page"></a> `page?` | `number` | [defi/protocols/src/hosting/revenue.ts:580](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/hosting/revenue.ts#L580) |
| <a id="pagesize"></a> `pageSize?` | `number` | [defi/protocols/src/hosting/revenue.ts:581](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/hosting/revenue.ts#L581) |
| <a id="period-2"></a> `period?` | [`RevenuePeriod`](/docs/api/defi/protocols/src/hosting/revenue.md#revenueperiod) | [defi/protocols/src/hosting/revenue.ts:578](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/hosting/revenue.ts#L578) |
| <a id="serverid-2"></a> `serverId?` | `string` | [defi/protocols/src/hosting/revenue.ts:576](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/hosting/revenue.ts#L576) |
| <a id="status-2"></a> `status?` | `"pending"` \| `"confirmed"` \| `"paid_out"` | [defi/protocols/src/hosting/revenue.ts:579](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/hosting/revenue.ts#L579) |
| <a id="toolid-1"></a> `toolId?` | `string` | [defi/protocols/src/hosting/revenue.ts:577](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/hosting/revenue.ts#L577) |
| <a id="userid-2"></a> `userId?` | `string` | [defi/protocols/src/hosting/revenue.ts:575](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/hosting/revenue.ts#L575) |

***

### TransactionHistoryResult

Defined in: [defi/protocols/src/hosting/revenue.ts:584](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/hosting/revenue.ts#L584)

#### Properties

| Property | Type | Defined in |
| :------ | :------ | :------ |
| <a id="hasmore"></a> `hasMore` | `boolean` | [defi/protocols/src/hosting/revenue.ts:589](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/hosting/revenue.ts#L589) |
| <a id="page-1"></a> `page` | `number` | [defi/protocols/src/hosting/revenue.ts:587](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/hosting/revenue.ts#L587) |
| <a id="pagesize-1"></a> `pageSize` | `number` | [defi/protocols/src/hosting/revenue.ts:588](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/hosting/revenue.ts#L588) |
| <a id="total"></a> `total` | `number` | [defi/protocols/src/hosting/revenue.ts:586](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/hosting/revenue.ts#L586) |
| <a id="transactions"></a> `transactions` | [`PaymentRecord`](/docs/api/defi/protocols/src/hosting/revenue.md#paymentrecord)[] | [defi/protocols/src/hosting/revenue.ts:585](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/hosting/revenue.ts#L585) |

***

### UserRevenue

Defined in: [defi/protocols/src/hosting/revenue.ts:68](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/hosting/revenue.ts#L68)

#### Extends

- [`RevenueStats`](/docs/api/defi/protocols/src/hosting/revenue.md#revenuestats)

#### Properties

| Property | Type | Inherited from | Defined in |
| :------ | :------ | :------ | :------ |
| <a id="creatorearnings-3"></a> `creatorEarnings` | `number` | [`RevenueStats`](/docs/api/defi/protocols/src/hosting/revenue.md#revenuestats).[`creatorEarnings`](/docs/api/defi/protocols/src/hosting/revenue.md#creatorearnings-1) | [defi/protocols/src/hosting/revenue.ts:45](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/hosting/revenue.ts#L45) |
| <a id="pendingpayout-3"></a> `pendingPayout` | `number` | [`RevenueStats`](/docs/api/defi/protocols/src/hosting/revenue.md#revenuestats).[`pendingPayout`](/docs/api/defi/protocols/src/hosting/revenue.md#pendingpayout-2) | [defi/protocols/src/hosting/revenue.ts:47](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/hosting/revenue.ts#L47) |
| <a id="period-3"></a> `period` | [`RevenuePeriod`](/docs/api/defi/protocols/src/hosting/revenue.md#revenueperiod) | [`RevenueStats`](/docs/api/defi/protocols/src/hosting/revenue.md#revenuestats).[`period`](/docs/api/defi/protocols/src/hosting/revenue.md#period-1) | [defi/protocols/src/hosting/revenue.ts:49](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/hosting/revenue.ts#L49) |
| <a id="periodend-2"></a> `periodEnd` | `Date` | [`RevenueStats`](/docs/api/defi/protocols/src/hosting/revenue.md#revenuestats).[`periodEnd`](/docs/api/defi/protocols/src/hosting/revenue.md#periodend-1) | [defi/protocols/src/hosting/revenue.ts:51](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/hosting/revenue.ts#L51) |
| <a id="periodstart-2"></a> `periodStart` | `Date` | [`RevenueStats`](/docs/api/defi/protocols/src/hosting/revenue.md#revenuestats).[`periodStart`](/docs/api/defi/protocols/src/hosting/revenue.md#periodstart-1) | [defi/protocols/src/hosting/revenue.ts:50](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/hosting/revenue.ts#L50) |
| <a id="platformearnings-2"></a> `platformEarnings` | `number` | [`RevenueStats`](/docs/api/defi/protocols/src/hosting/revenue.md#revenuestats).[`platformEarnings`](/docs/api/defi/protocols/src/hosting/revenue.md#platformearnings-1) | [defi/protocols/src/hosting/revenue.ts:46](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/hosting/revenue.ts#L46) |
| <a id="servers"></a> `servers` | [`ServerRevenue`](/docs/api/defi/protocols/src/hosting/revenue.md#serverrevenue)[] | - | [defi/protocols/src/hosting/revenue.ts:70](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/hosting/revenue.ts#L70) |
| <a id="totalearnings-3"></a> `totalEarnings` | `number` | [`RevenueStats`](/docs/api/defi/protocols/src/hosting/revenue.md#revenuestats).[`totalEarnings`](/docs/api/defi/protocols/src/hosting/revenue.md#totalearnings-1) | [defi/protocols/src/hosting/revenue.ts:44](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/hosting/revenue.ts#L44) |
| <a id="transactioncount-3"></a> `transactionCount` | `number` | [`RevenueStats`](/docs/api/defi/protocols/src/hosting/revenue.md#revenuestats).[`transactionCount`](/docs/api/defi/protocols/src/hosting/revenue.md#transactioncount-1) | [defi/protocols/src/hosting/revenue.ts:48](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/hosting/revenue.ts#L48) |
| <a id="userid-3"></a> `userId` | `string` | - | [defi/protocols/src/hosting/revenue.ts:69](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/hosting/revenue.ts#L69) |

## Type Aliases

### RevenuePeriod

```ts
type RevenuePeriod = "day" | "week" | "month" | "all";
```

Defined in: [defi/protocols/src/hosting/revenue.ts:21](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/hosting/revenue.ts#L21)

## Variables

### default

```ts
default: {
  getPendingPayouts: () => Promise<PendingPayout[]>;
  getPlatformRevenue: (period: RevenuePeriod) => Promise<PlatformRevenue>;
  getRevenueStats: () => Promise<{
     pendingPayouts: number;
     totalPayments: number;
     totalPlatformFees: number;
     totalVolume: number;
  }>;
  getServerRevenue: (serverId: string, period: RevenuePeriod) => Promise<ServerRevenue>;
  getTransactionHistory: (options: TransactionHistoryOptions) => Promise<TransactionHistoryResult>;
  getUserRevenue: (userId: string, period: RevenuePeriod) => Promise<UserRevenue>;
  MINIMUM_PAYOUT_THRESHOLD: number;
  PLATFORM_FEE_PERCENTAGE: number;
  processPayouts: (userIds?: string[], chain: SupportedChainId) => Promise<PayoutResult[]>;
  recordPayment: (serverId: string, toolId: string, toolName: string, txHash: string, amount: string, chain: SupportedChainId, sender: string, recipient: string) => Promise<PaymentRecord>;
  registerServer: (serverId: string, name: string, userId: string) => void;
  registerUser: (userId: string, email: string, payoutAddress: string) => void;
  updatePayoutAddress: (userId: string, payoutAddress: string) => void;
};
```

Defined in: [defi/protocols/src/hosting/revenue.ts:721](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/hosting/revenue.ts#L721)

#### Type Declaration

| Name | Type | Description | Defined in |
| :------ | :------ | :------ | :------ |
| <a id="getpendingpayouts-3"></a> `getPendingPayouts()` | () => `Promise`\<[`PendingPayout`](/docs/api/defi/protocols/src/hosting/revenue.md#pendingpayout)[]\> | Get list of pending payouts for all creators | [defi/protocols/src/hosting/revenue.ts:726](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/hosting/revenue.ts#L726) |
| <a id="getplatformrevenue-3"></a> `getPlatformRevenue()` | (`period`: [`RevenuePeriod`](/docs/api/defi/protocols/src/hosting/revenue.md#revenueperiod)) => `Promise`\<[`PlatformRevenue`](/docs/api/defi/protocols/src/hosting/revenue.md#platformrevenue)\> | Get platform-wide revenue statistics (admin only) | [defi/protocols/src/hosting/revenue.ts:725](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/hosting/revenue.ts#L725) |
| <a id="getrevenuestats-3"></a> `getRevenueStats()` | () => `Promise`\<\{ `pendingPayouts`: `number`; `totalPayments`: `number`; `totalPlatformFees`: `number`; `totalVolume`: `number`; \}\> | Get revenue statistics summary | [defi/protocols/src/hosting/revenue.ts:732](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/hosting/revenue.ts#L732) |
| <a id="getserverrevenue-3"></a> `getServerRevenue()` | (`serverId`: `string`, `period`: [`RevenuePeriod`](/docs/api/defi/protocols/src/hosting/revenue.md#revenueperiod)) => `Promise`\<[`ServerRevenue`](/docs/api/defi/protocols/src/hosting/revenue.md#serverrevenue)\> | Get revenue statistics for a specific server | [defi/protocols/src/hosting/revenue.ts:723](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/hosting/revenue.ts#L723) |
| <a id="gettransactionhistory-3"></a> `getTransactionHistory()` | (`options`: [`TransactionHistoryOptions`](/docs/api/defi/protocols/src/hosting/revenue.md#transactionhistoryoptions)) => `Promise`\<[`TransactionHistoryResult`](/docs/api/defi/protocols/src/hosting/revenue.md#transactionhistoryresult)\> | Get transaction history with filtering and pagination | [defi/protocols/src/hosting/revenue.ts:728](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/hosting/revenue.ts#L728) |
| <a id="getuserrevenue-3"></a> `getUserRevenue()` | (`userId`: `string`, `period`: [`RevenuePeriod`](/docs/api/defi/protocols/src/hosting/revenue.md#revenueperiod)) => `Promise`\<[`UserRevenue`](/docs/api/defi/protocols/src/hosting/revenue.md#userrevenue)\> | Get revenue statistics for a user across all their servers | [defi/protocols/src/hosting/revenue.ts:724](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/hosting/revenue.ts#L724) |
| <a id="minimum_payout_threshold"></a> `MINIMUM_PAYOUT_THRESHOLD` | `number` | Minimum payout threshold in USD | [defi/protocols/src/hosting/revenue.ts:733](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/hosting/revenue.ts#L733) |
| <a id="platform_fee_percentage"></a> `PLATFORM_FEE_PERCENTAGE` | `number` | - | [defi/protocols/src/hosting/revenue.ts:734](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/hosting/revenue.ts#L734) |
| <a id="processpayouts-3"></a> `processPayouts()` | (`userIds?`: `string`[], `chain`: `SupportedChainId`) => `Promise`\<[`PayoutResult`](/docs/api/defi/protocols/src/hosting/revenue.md#payoutresult)[]\> | Process payouts for creators (batch send to creators) Note: This is a placeholder - actual implementation would use a wallet/signer | [defi/protocols/src/hosting/revenue.ts:727](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/hosting/revenue.ts#L727) |
| <a id="recordpayment-3"></a> `recordPayment()` | (`serverId`: `string`, `toolId`: `string`, `toolName`: `string`, `txHash`: `string`, `amount`: `string`, `chain`: `SupportedChainId`, `sender`: `string`, `recipient`: `string`) => `Promise`\<[`PaymentRecord`](/docs/api/defi/protocols/src/hosting/revenue.md#paymentrecord)\> | Record a payment for a tool call | [defi/protocols/src/hosting/revenue.ts:722](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/hosting/revenue.ts#L722) |
| <a id="registerserver-3"></a> `registerServer()` | (`serverId`: `string`, `name`: `string`, `userId`: `string`) => `void` | Register a server with its metadata | [defi/protocols/src/hosting/revenue.ts:729](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/hosting/revenue.ts#L729) |
| <a id="registeruser-3"></a> `registerUser()` | (`userId`: `string`, `email`: `string`, `payoutAddress`: `string`) => `void` | Register a user with their metadata | [defi/protocols/src/hosting/revenue.ts:730](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/hosting/revenue.ts#L730) |
| <a id="updatepayoutaddress-3"></a> `updatePayoutAddress()` | (`userId`: `string`, `payoutAddress`: `string`) => `void` | Update user payout address | [defi/protocols/src/hosting/revenue.ts:731](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/hosting/revenue.ts#L731) |

***

### MINIMUM\_PAYOUT\_THRESHOLD

```ts
const MINIMUM_PAYOUT_THRESHOLD: 10 = 10;
```

Defined in: [defi/protocols/src/hosting/revenue.ts:110](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/hosting/revenue.ts#L110)

Minimum payout threshold in USD

## Functions

### getPendingPayouts()

```ts
function getPendingPayouts(): Promise<PendingPayout[]>;
```

Defined in: [defi/protocols/src/hosting/revenue.ts:415](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/hosting/revenue.ts#L415)

Get list of pending payouts for all creators

#### Returns

`Promise`\<[`PendingPayout`](/docs/api/defi/protocols/src/hosting/revenue.md#pendingpayout)[]\>

***

### getPlatformRevenue()

```ts
function getPlatformRevenue(period: RevenuePeriod): Promise<PlatformRevenue>;
```

Defined in: [defi/protocols/src/hosting/revenue.ts:347](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/hosting/revenue.ts#L347)

Get platform-wide revenue statistics (admin only)

#### Parameters

| Parameter | Type | Default value |
| :------ | :------ | :------ |
| `period` | [`RevenuePeriod`](/docs/api/defi/protocols/src/hosting/revenue.md#revenueperiod) | `"month"` |

#### Returns

`Promise`\<[`PlatformRevenue`](/docs/api/defi/protocols/src/hosting/revenue.md#platformrevenue)\>

***

### getRevenueStats()

```ts
function getRevenueStats(): Promise<{
  pendingPayouts: number;
  totalPayments: number;
  totalPlatformFees: number;
  totalVolume: number;
}>;
```

Defined in: [defi/protocols/src/hosting/revenue.ts:690](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/hosting/revenue.ts#L690)

Get revenue statistics summary

#### Returns

`Promise`\<\{
  `pendingPayouts`: `number`;
  `totalPayments`: `number`;
  `totalPlatformFees`: `number`;
  `totalVolume`: `number`;
\}\>

***

### getServerRevenue()

```ts
function getServerRevenue(serverId: string, period: RevenuePeriod): Promise<ServerRevenue>;
```

Defined in: [defi/protocols/src/hosting/revenue.ts:237](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/hosting/revenue.ts#L237)

Get revenue statistics for a specific server

#### Parameters

| Parameter | Type | Default value |
| :------ | :------ | :------ |
| `serverId` | `string` | `undefined` |
| `period` | [`RevenuePeriod`](/docs/api/defi/protocols/src/hosting/revenue.md#revenueperiod) | `"month"` |

#### Returns

`Promise`\<[`ServerRevenue`](/docs/api/defi/protocols/src/hosting/revenue.md#serverrevenue)\>

***

### getTransactionHistory()

```ts
function getTransactionHistory(options: TransactionHistoryOptions): Promise<TransactionHistoryResult>;
```

Defined in: [defi/protocols/src/hosting/revenue.ts:595](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/hosting/revenue.ts#L595)

Get transaction history with filtering and pagination

#### Parameters

| Parameter | Type |
| :------ | :------ |
| `options` | [`TransactionHistoryOptions`](/docs/api/defi/protocols/src/hosting/revenue.md#transactionhistoryoptions) |

#### Returns

`Promise`\<[`TransactionHistoryResult`](/docs/api/defi/protocols/src/hosting/revenue.md#transactionhistoryresult)\>

***

### getUserRevenue()

```ts
function getUserRevenue(userId: string, period: RevenuePeriod): Promise<UserRevenue>;
```

Defined in: [defi/protocols/src/hosting/revenue.ts:292](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/hosting/revenue.ts#L292)

Get revenue statistics for a user across all their servers

#### Parameters

| Parameter | Type | Default value |
| :------ | :------ | :------ |
| `userId` | `string` | `undefined` |
| `period` | [`RevenuePeriod`](/docs/api/defi/protocols/src/hosting/revenue.md#revenueperiod) | `"month"` |

#### Returns

`Promise`\<[`UserRevenue`](/docs/api/defi/protocols/src/hosting/revenue.md#userrevenue)\>

***

### processPayouts()

```ts
function processPayouts(userIds?: string[], chain?: SupportedChainId): Promise<PayoutResult[]>;
```

Defined in: [defi/protocols/src/hosting/revenue.ts:478](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/hosting/revenue.ts#L478)

Process payouts for creators (batch send to creators)
Note: This is a placeholder - actual implementation would use a wallet/signer

#### Parameters

| Parameter | Type | Default value |
| :------ | :------ | :------ |
| `userIds?` | `string`[] | `undefined` |
| `chain?` | `SupportedChainId` | `8453` |

#### Returns

`Promise`\<[`PayoutResult`](/docs/api/defi/protocols/src/hosting/revenue.md#payoutresult)[]\>

***

### recordPayment()

```ts
function recordPayment(
   serverId: string, 
   toolId: string, 
   toolName: string, 
   txHash: string, 
   amount: string, 
   chain: SupportedChainId, 
   sender: string, 
recipient: string): Promise<PaymentRecord>;
```

Defined in: [defi/protocols/src/hosting/revenue.ts:192](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/hosting/revenue.ts#L192)

Record a payment for a tool call

#### Parameters

| Parameter | Type |
| :------ | :------ |
| `serverId` | `string` |
| `toolId` | `string` |
| `toolName` | `string` |
| `txHash` | `string` |
| `amount` | `string` |
| `chain` | `SupportedChainId` |
| `sender` | `string` |
| `recipient` | `string` |

#### Returns

`Promise`\<[`PaymentRecord`](/docs/api/defi/protocols/src/hosting/revenue.md#paymentrecord)\>

***

### registerServer()

```ts
function registerServer(
   serverId: string, 
   name: string, 
   userId: string): void;
```

Defined in: [defi/protocols/src/hosting/revenue.ts:651](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/hosting/revenue.ts#L651)

Register a server with its metadata

#### Parameters

| Parameter | Type |
| :------ | :------ |
| `serverId` | `string` |
| `name` | `string` |
| `userId` | `string` |

#### Returns

`void`

***

### registerUser()

```ts
function registerUser(
   userId: string, 
   email: string, 
   payoutAddress: string): void;
```

Defined in: [defi/protocols/src/hosting/revenue.ts:662](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/hosting/revenue.ts#L662)

Register a user with their metadata

#### Parameters

| Parameter | Type |
| :------ | :------ |
| `userId` | `string` |
| `email` | `string` |
| `payoutAddress` | `string` |

#### Returns

`void`

***

### updatePayoutAddress()

```ts
function updatePayoutAddress(userId: string, payoutAddress: string): void;
```

Defined in: [defi/protocols/src/hosting/revenue.ts:673](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/hosting/revenue.ts#L673)

Update user payout address

#### Parameters

| Parameter | Type |
| :------ | :------ |
| `userId` | `string` |
| `payoutAddress` | `string` |

#### Returns

`void`
