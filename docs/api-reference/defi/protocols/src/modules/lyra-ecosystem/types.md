[**Universal Crypto MCP API Reference v1.0.0**](../../../../../index.md)

***

[Universal Crypto MCP API Reference](/docs/api/index.md) / defi/protocols/src/modules/lyra-ecosystem/types

# defi/protocols/src/modules/lyra-ecosystem/types

## Interfaces

### AuditIssue

Defined in: [defi/protocols/src/modules/lyra-ecosystem/types.ts:92](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/modules/lyra-ecosystem/types.ts#L92)

#### Properties

| Property | Type | Defined in |
| :------ | :------ | :------ |
| <a id="category"></a> `category` | `"security"` \| `"quality"` \| `"performance"` \| `"maintainability"` | [defi/protocols/src/modules/lyra-ecosystem/types.ts:93](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/modules/lyra-ecosystem/types.ts#L93) |
| <a id="file"></a> `file?` | `string` | [defi/protocols/src/modules/lyra-ecosystem/types.ts:96](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/modules/lyra-ecosystem/types.ts#L96) |
| <a id="line"></a> `line?` | `number` | [defi/protocols/src/modules/lyra-ecosystem/types.ts:97](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/modules/lyra-ecosystem/types.ts#L97) |
| <a id="message"></a> `message` | `string` | [defi/protocols/src/modules/lyra-ecosystem/types.ts:95](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/modules/lyra-ecosystem/types.ts#L95) |
| <a id="rule"></a> `rule?` | `string` | [defi/protocols/src/modules/lyra-ecosystem/types.ts:98](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/modules/lyra-ecosystem/types.ts#L98) |
| <a id="severity"></a> `severity` | `"critical"` \| `"info"` \| `"error"` \| `"warning"` | [defi/protocols/src/modules/lyra-ecosystem/types.ts:94](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/modules/lyra-ecosystem/types.ts#L94) |

***

### ChangelogEntry

Defined in: [defi/protocols/src/modules/lyra-ecosystem/types.ts:190](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/modules/lyra-ecosystem/types.ts#L190)

#### Properties

| Property | Type | Defined in |
| :------ | :------ | :------ |
| <a id="changes"></a> `changes` | `string`[] | [defi/protocols/src/modules/lyra-ecosystem/types.ts:193](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/modules/lyra-ecosystem/types.ts#L193) |
| <a id="date"></a> `date` | `string` | [defi/protocols/src/modules/lyra-ecosystem/types.ts:192](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/modules/lyra-ecosystem/types.ts#L192) |
| <a id="version"></a> `version` | `string` | [defi/protocols/src/modules/lyra-ecosystem/types.ts:191](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/modules/lyra-ecosystem/types.ts#L191) |

***

### CodeSnippet

Defined in: [defi/protocols/src/modules/lyra-ecosystem/types.ts:329](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/modules/lyra-ecosystem/types.ts#L329)

#### Properties

| Property | Type | Defined in |
| :------ | :------ | :------ |
| <a id="code"></a> `code` | `string` | [defi/protocols/src/modules/lyra-ecosystem/types.ts:332](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/modules/lyra-ecosystem/types.ts#L332) |
| <a id="description"></a> `description` | `string` | [defi/protocols/src/modules/lyra-ecosystem/types.ts:333](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/modules/lyra-ecosystem/types.ts#L333) |
| <a id="language"></a> `language` | `string` | [defi/protocols/src/modules/lyra-ecosystem/types.ts:331](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/modules/lyra-ecosystem/types.ts#L331) |
| <a id="title"></a> `title` | `string` | [defi/protocols/src/modules/lyra-ecosystem/types.ts:330](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/modules/lyra-ecosystem/types.ts#L330) |

***

### CompatibilityAnalysis

Defined in: [defi/protocols/src/modules/lyra-ecosystem/types.ts:258](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/modules/lyra-ecosystem/types.ts#L258)

#### Properties

| Property | Type | Defined in |
| :------ | :------ | :------ |
| <a id="apiurl"></a> `apiUrl` | `string` | [defi/protocols/src/modules/lyra-ecosystem/types.ts:259](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/modules/lyra-ecosystem/types.ts#L259) |
| <a id="compatibilityscore"></a> `compatibilityScore` | `number` | [defi/protocols/src/modules/lyra-ecosystem/types.ts:261](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/modules/lyra-ecosystem/types.ts#L261) |
| <a id="estimatedeffort"></a> `estimatedEffort` | `"low"` \| `"medium"` \| `"high"` | [defi/protocols/src/modules/lyra-ecosystem/types.ts:264](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/modules/lyra-ecosystem/types.ts#L264) |
| <a id="issues"></a> `issues` | [`CompatibilityIssue`](/docs/api/defi/protocols/src/modules/lyra-ecosystem/types.md#compatibilityissue)[] | [defi/protocols/src/modules/lyra-ecosystem/types.ts:262](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/modules/lyra-ecosystem/types.ts#L262) |
| <a id="mcpcompatible"></a> `mcpCompatible` | `boolean` | [defi/protocols/src/modules/lyra-ecosystem/types.ts:260](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/modules/lyra-ecosystem/types.ts#L260) |
| <a id="suggestions"></a> `suggestions` | [`CompatibilitySuggestion`](/docs/api/defi/protocols/src/modules/lyra-ecosystem/types.md#compatibilitysuggestion)[] | [defi/protocols/src/modules/lyra-ecosystem/types.ts:263](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/modules/lyra-ecosystem/types.ts#L263) |

***

### CompatibilityInfo

Defined in: [defi/protocols/src/modules/lyra-ecosystem/types.ts:196](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/modules/lyra-ecosystem/types.ts#L196)

#### Properties

| Property | Type | Defined in |
| :------ | :------ | :------ |
| <a id="mcpversions"></a> `mcpVersions` | `string`[] | [defi/protocols/src/modules/lyra-ecosystem/types.ts:198](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/modules/lyra-ecosystem/types.ts#L198) |
| <a id="nodeversions"></a> `nodeVersions` | `string`[] | [defi/protocols/src/modules/lyra-ecosystem/types.ts:197](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/modules/lyra-ecosystem/types.ts#L197) |
| <a id="platforms"></a> `platforms` | `string`[] | [defi/protocols/src/modules/lyra-ecosystem/types.ts:199](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/modules/lyra-ecosystem/types.ts#L199) |

***

### CompatibilityIssue

Defined in: [defi/protocols/src/modules/lyra-ecosystem/types.ts:267](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/modules/lyra-ecosystem/types.ts#L267)

#### Properties

| Property | Type | Defined in |
| :------ | :------ | :------ |
| <a id="endpoint"></a> `endpoint?` | `string` | [defi/protocols/src/modules/lyra-ecosystem/types.ts:270](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/modules/lyra-ecosystem/types.ts#L270) |
| <a id="message-1"></a> `message` | `string` | [defi/protocols/src/modules/lyra-ecosystem/types.ts:269](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/modules/lyra-ecosystem/types.ts#L269) |
| <a id="type"></a> `type` | `"info"` \| `"warning"` \| `"breaking"` | [defi/protocols/src/modules/lyra-ecosystem/types.ts:268](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/modules/lyra-ecosystem/types.ts#L268) |

***

### CompatibilitySuggestion

Defined in: [defi/protocols/src/modules/lyra-ecosystem/types.ts:273](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/modules/lyra-ecosystem/types.ts#L273)

#### Properties

| Property | Type | Defined in |
| :------ | :------ | :------ |
| <a id="description-1"></a> `description` | `string` | [defi/protocols/src/modules/lyra-ecosystem/types.ts:275](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/modules/lyra-ecosystem/types.ts#L275) |
| <a id="implementationhint"></a> `implementationHint?` | `string` | [defi/protocols/src/modules/lyra-ecosystem/types.ts:276](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/modules/lyra-ecosystem/types.ts#L276) |
| <a id="priority"></a> `priority` | `"low"` \| `"medium"` \| `"high"` | [defi/protocols/src/modules/lyra-ecosystem/types.ts:274](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/modules/lyra-ecosystem/types.ts#L274) |

***

### ConfigOption

Defined in: [defi/protocols/src/modules/lyra-ecosystem/types.ts:170](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/modules/lyra-ecosystem/types.ts#L170)

#### Properties

| Property | Type | Defined in |
| :------ | :------ | :------ |
| <a id="default"></a> `default?` | `string` \| `number` \| `boolean` | [defi/protocols/src/modules/lyra-ecosystem/types.ts:174](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/modules/lyra-ecosystem/types.ts#L174) |
| <a id="description-2"></a> `description` | `string` | [defi/protocols/src/modules/lyra-ecosystem/types.ts:173](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/modules/lyra-ecosystem/types.ts#L173) |
| <a id="name"></a> `name` | `string` | [defi/protocols/src/modules/lyra-ecosystem/types.ts:171](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/modules/lyra-ecosystem/types.ts#L171) |
| <a id="type-1"></a> `type` | `string` | [defi/protocols/src/modules/lyra-ecosystem/types.ts:172](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/modules/lyra-ecosystem/types.ts#L172) |

***

### DetailedToolInfo

Defined in: [defi/protocols/src/modules/lyra-ecosystem/types.ts:147](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/modules/lyra-ecosystem/types.ts#L147)

#### Extends

- [`ToolInfo`](/docs/api/defi/protocols/src/modules/lyra-ecosystem/types.md#toolinfo)

#### Properties

| Property | Type | Inherited from | Defined in |
| :------ | :------ | :------ | :------ |
| <a id="author"></a> `author` | `string` | [`ToolInfo`](/docs/api/defi/protocols/src/modules/lyra-ecosystem/types.md#toolinfo).[`author`](/docs/api/defi/protocols/src/modules/lyra-ecosystem/types.md#author-1) | [defi/protocols/src/modules/lyra-ecosystem/types.ts:136](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/modules/lyra-ecosystem/types.ts#L136) |
| <a id="category-1"></a> `category` | `string` | [`ToolInfo`](/docs/api/defi/protocols/src/modules/lyra-ecosystem/types.md#toolinfo).[`category`](/docs/api/defi/protocols/src/modules/lyra-ecosystem/types.md#category-3) | [defi/protocols/src/modules/lyra-ecosystem/types.ts:138](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/modules/lyra-ecosystem/types.ts#L138) |
| <a id="changelog"></a> `changelog` | [`ChangelogEntry`](/docs/api/defi/protocols/src/modules/lyra-ecosystem/types.md#changelogentry)[] | - | [defi/protocols/src/modules/lyra-ecosystem/types.ts:152](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/modules/lyra-ecosystem/types.ts#L152) |
| <a id="compatibility"></a> `compatibility` | [`CompatibilityInfo`](/docs/api/defi/protocols/src/modules/lyra-ecosystem/types.md#compatibilityinfo) | - | [defi/protocols/src/modules/lyra-ecosystem/types.ts:153](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/modules/lyra-ecosystem/types.ts#L153) |
| <a id="configuration"></a> `configuration` | [`ToolConfiguration`](/docs/api/defi/protocols/src/modules/lyra-ecosystem/types.md#toolconfiguration) | - | [defi/protocols/src/modules/lyra-ecosystem/types.ts:150](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/modules/lyra-ecosystem/types.ts#L150) |
| <a id="dependencies"></a> `dependencies` | [`ToolDependency`](/docs/api/defi/protocols/src/modules/lyra-ecosystem/types.md#tooldependency)[] | - | [defi/protocols/src/modules/lyra-ecosystem/types.ts:151](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/modules/lyra-ecosystem/types.ts#L151) |
| <a id="description-3"></a> `description` | `string` | [`ToolInfo`](/docs/api/defi/protocols/src/modules/lyra-ecosystem/types.md#toolinfo).[`description`](/docs/api/defi/protocols/src/modules/lyra-ecosystem/types.md#description-14) | [defi/protocols/src/modules/lyra-ecosystem/types.ts:135](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/modules/lyra-ecosystem/types.ts#L135) |
| <a id="downloads"></a> `downloads` | `number` | [`ToolInfo`](/docs/api/defi/protocols/src/modules/lyra-ecosystem/types.md#toolinfo).[`downloads`](/docs/api/defi/protocols/src/modules/lyra-ecosystem/types.md#downloads-1) | [defi/protocols/src/modules/lyra-ecosystem/types.ts:141](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/modules/lyra-ecosystem/types.ts#L141) |
| <a id="examples"></a> `examples` | [`ToolExample`](/docs/api/defi/protocols/src/modules/lyra-ecosystem/types.md#toolexample)[] | - | [defi/protocols/src/modules/lyra-ecosystem/types.ts:149](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/modules/lyra-ecosystem/types.ts#L149) |
| <a id="homepage"></a> `homepage?` | `string` | [`ToolInfo`](/docs/api/defi/protocols/src/modules/lyra-ecosystem/types.md#toolinfo).[`homepage`](/docs/api/defi/protocols/src/modules/lyra-ecosystem/types.md#homepage-1) | [defi/protocols/src/modules/lyra-ecosystem/types.ts:143](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/modules/lyra-ecosystem/types.ts#L143) |
| <a id="id"></a> `id` | `string` | [`ToolInfo`](/docs/api/defi/protocols/src/modules/lyra-ecosystem/types.md#toolinfo).[`id`](/docs/api/defi/protocols/src/modules/lyra-ecosystem/types.md#id-1) | [defi/protocols/src/modules/lyra-ecosystem/types.ts:133](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/modules/lyra-ecosystem/types.ts#L133) |
| <a id="lastupdated"></a> `lastUpdated` | `string` | [`ToolInfo`](/docs/api/defi/protocols/src/modules/lyra-ecosystem/types.md#toolinfo).[`lastUpdated`](/docs/api/defi/protocols/src/modules/lyra-ecosystem/types.md#lastupdated-1) | [defi/protocols/src/modules/lyra-ecosystem/types.ts:142](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/modules/lyra-ecosystem/types.ts#L142) |
| <a id="name-1"></a> `name` | `string` | [`ToolInfo`](/docs/api/defi/protocols/src/modules/lyra-ecosystem/types.md#toolinfo).[`name`](/docs/api/defi/protocols/src/modules/lyra-ecosystem/types.md#name-11) | [defi/protocols/src/modules/lyra-ecosystem/types.ts:134](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/modules/lyra-ecosystem/types.ts#L134) |
| <a id="pricing"></a> `pricing?` | [`ToolPricing`](/docs/api/defi/protocols/src/modules/lyra-ecosystem/types.md#toolpricing) | - | [defi/protocols/src/modules/lyra-ecosystem/types.ts:154](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/modules/lyra-ecosystem/types.ts#L154) |
| <a id="readme"></a> `readme` | `string` | - | [defi/protocols/src/modules/lyra-ecosystem/types.ts:148](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/modules/lyra-ecosystem/types.ts#L148) |
| <a id="repository"></a> `repository?` | `string` | [`ToolInfo`](/docs/api/defi/protocols/src/modules/lyra-ecosystem/types.md#toolinfo).[`repository`](/docs/api/defi/protocols/src/modules/lyra-ecosystem/types.md#repository-3) | [defi/protocols/src/modules/lyra-ecosystem/types.ts:144](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/modules/lyra-ecosystem/types.ts#L144) |
| <a id="stars"></a> `stars` | `number` | [`ToolInfo`](/docs/api/defi/protocols/src/modules/lyra-ecosystem/types.md#toolinfo).[`stars`](/docs/api/defi/protocols/src/modules/lyra-ecosystem/types.md#stars-1) | [defi/protocols/src/modules/lyra-ecosystem/types.ts:140](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/modules/lyra-ecosystem/types.ts#L140) |
| <a id="tags"></a> `tags` | `string`[] | [`ToolInfo`](/docs/api/defi/protocols/src/modules/lyra-ecosystem/types.md#toolinfo).[`tags`](/docs/api/defi/protocols/src/modules/lyra-ecosystem/types.md#tags-2) | [defi/protocols/src/modules/lyra-ecosystem/types.ts:139](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/modules/lyra-ecosystem/types.ts#L139) |
| <a id="version-1"></a> `version` | `string` | [`ToolInfo`](/docs/api/defi/protocols/src/modules/lyra-ecosystem/types.md#toolinfo).[`version`](/docs/api/defi/protocols/src/modules/lyra-ecosystem/types.md#version-5) | [defi/protocols/src/modules/lyra-ecosystem/types.ts:137](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/modules/lyra-ecosystem/types.ts#L137) |

***

### DiscoveredTool

Defined in: [defi/protocols/src/modules/lyra-ecosystem/types.ts:243](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/modules/lyra-ecosystem/types.ts#L243)

#### Properties

| Property | Type | Defined in |
| :------ | :------ | :------ |
| <a id="description-4"></a> `description?` | `string` | [defi/protocols/src/modules/lyra-ecosystem/types.ts:247](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/modules/lyra-ecosystem/types.ts#L247) |
| <a id="endpoint-1"></a> `endpoint` | `string` | [defi/protocols/src/modules/lyra-ecosystem/types.ts:245](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/modules/lyra-ecosystem/types.ts#L245) |
| <a id="method"></a> `method` | `"GET"` \| `"POST"` \| `"PUT"` \| `"DELETE"` \| `"PATCH"` | [defi/protocols/src/modules/lyra-ecosystem/types.ts:246](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/modules/lyra-ecosystem/types.ts#L246) |
| <a id="name-2"></a> `name` | `string` | [defi/protocols/src/modules/lyra-ecosystem/types.ts:244](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/modules/lyra-ecosystem/types.ts#L244) |
| <a id="parameters"></a> `parameters?` | [`ToolParameter`](/docs/api/defi/protocols/src/modules/lyra-ecosystem/types.md#toolparameter)[] | [defi/protocols/src/modules/lyra-ecosystem/types.ts:248](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/modules/lyra-ecosystem/types.ts#L248) |

***

### DiscoveryResult

Defined in: [defi/protocols/src/modules/lyra-ecosystem/types.ts:235](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/modules/lyra-ecosystem/types.ts#L235)

#### Properties

| Property | Type | Defined in |
| :------ | :------ | :------ |
| <a id="apiurl-1"></a> `apiUrl` | `string` | [defi/protocols/src/modules/lyra-ecosystem/types.ts:236](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/modules/lyra-ecosystem/types.ts#L236) |
| <a id="detected"></a> `detected` | `boolean` | [defi/protocols/src/modules/lyra-ecosystem/types.ts:237](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/modules/lyra-ecosystem/types.ts#L237) |
| <a id="protocol"></a> `protocol` | `"unknown"` \| `"mcp"` \| `"openapi"` \| `"graphql"` \| `"grpc"` | [defi/protocols/src/modules/lyra-ecosystem/types.ts:238](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/modules/lyra-ecosystem/types.ts#L238) |
| <a id="timestamp"></a> `timestamp` | `number` | [defi/protocols/src/modules/lyra-ecosystem/types.ts:240](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/modules/lyra-ecosystem/types.ts#L240) |
| <a id="tools"></a> `tools` | [`DiscoveredTool`](/docs/api/defi/protocols/src/modules/lyra-ecosystem/types.md#discoveredtool)[] | [defi/protocols/src/modules/lyra-ecosystem/types.ts:239](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/modules/lyra-ecosystem/types.ts#L239) |

***

### EnterpriseAnalysisResult

Defined in: [defi/protocols/src/modules/lyra-ecosystem/types.ts:111](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/modules/lyra-ecosystem/types.ts#L111)

#### Extends

- [`RepoAuditResult`](/docs/api/defi/protocols/src/modules/lyra-ecosystem/types.md#repoauditresult)

#### Properties

| Property | Type | Inherited from | Defined in |
| :------ | :------ | :------ | :------ |
| <a id="analyzedfiles"></a> `analyzedFiles` | `number` | [`RepoAuditResult`](/docs/api/defi/protocols/src/modules/lyra-ecosystem/types.md#repoauditresult).[`analyzedFiles`](/docs/api/defi/protocols/src/modules/lyra-ecosystem/types.md#analyzedfiles-1) | [defi/protocols/src/modules/lyra-ecosystem/types.ts:82](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/modules/lyra-ecosystem/types.ts#L82) |
| <a id="architecturerecommendations"></a> `architectureRecommendations` | `string`[] | - | [defi/protocols/src/modules/lyra-ecosystem/types.ts:120](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/modules/lyra-ecosystem/types.ts#L120) |
| <a id="buildoptimizations"></a> `buildOptimizations` | `string`[] | - | [defi/protocols/src/modules/lyra-ecosystem/types.ts:119](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/modules/lyra-ecosystem/types.ts#L119) |
| <a id="codequalityscore"></a> `codeQualityScore` | `number` | [`RepoAuditResult`](/docs/api/defi/protocols/src/modules/lyra-ecosystem/types.md#repoauditresult).[`codeQualityScore`](/docs/api/defi/protocols/src/modules/lyra-ecosystem/types.md#codequalityscore-1) | [defi/protocols/src/modules/lyra-ecosystem/types.ts:84](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/modules/lyra-ecosystem/types.ts#L84) |
| <a id="crosspackageissues"></a> `crossPackageIssues` | [`AuditIssue`](/docs/api/defi/protocols/src/modules/lyra-ecosystem/types.md#auditissue)[] | - | [defi/protocols/src/modules/lyra-ecosystem/types.ts:117](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/modules/lyra-ecosystem/types.ts#L117) |
| <a id="dependencygraph"></a> `dependencyGraph` | `Record`\<`string`, `string`[]\> | - | [defi/protocols/src/modules/lyra-ecosystem/types.ts:118](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/modules/lyra-ecosystem/types.ts#L118) |
| <a id="issues-1"></a> `issues` | [`AuditIssue`](/docs/api/defi/protocols/src/modules/lyra-ecosystem/types.md#auditissue)[] | [`RepoAuditResult`](/docs/api/defi/protocols/src/modules/lyra-ecosystem/types.md#repoauditresult).[`issues`](/docs/api/defi/protocols/src/modules/lyra-ecosystem/types.md#issues-2) | [defi/protocols/src/modules/lyra-ecosystem/types.ts:87](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/modules/lyra-ecosystem/types.ts#L87) |
| <a id="maintainabilityscore"></a> `maintainabilityScore` | `number` | [`RepoAuditResult`](/docs/api/defi/protocols/src/modules/lyra-ecosystem/types.md#repoauditresult).[`maintainabilityScore`](/docs/api/defi/protocols/src/modules/lyra-ecosystem/types.md#maintainabilityscore-1) | [defi/protocols/src/modules/lyra-ecosystem/types.ts:85](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/modules/lyra-ecosystem/types.ts#L85) |
| <a id="metrics"></a> `metrics` | [`RepoMetrics`](/docs/api/defi/protocols/src/modules/lyra-ecosystem/types.md#repometrics) | [`RepoAuditResult`](/docs/api/defi/protocols/src/modules/lyra-ecosystem/types.md#repoauditresult).[`metrics`](/docs/api/defi/protocols/src/modules/lyra-ecosystem/types.md#metrics-1) | [defi/protocols/src/modules/lyra-ecosystem/types.ts:89](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/modules/lyra-ecosystem/types.ts#L89) |
| <a id="monorepoinfo"></a> `monorepoInfo` | \{ `circularDependencies`: `string`[][]; `packages`: `number`; `sharedDependencies`: `string`[]; \} | - | [defi/protocols/src/modules/lyra-ecosystem/types.ts:112](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/modules/lyra-ecosystem/types.ts#L112) |
| `monorepoInfo.circularDependencies` | `string`[][] | - | [defi/protocols/src/modules/lyra-ecosystem/types.ts:115](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/modules/lyra-ecosystem/types.ts#L115) |
| `monorepoInfo.packages` | `number` | - | [defi/protocols/src/modules/lyra-ecosystem/types.ts:113](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/modules/lyra-ecosystem/types.ts#L113) |
| `monorepoInfo.sharedDependencies` | `string`[] | - | [defi/protocols/src/modules/lyra-ecosystem/types.ts:114](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/modules/lyra-ecosystem/types.ts#L114) |
| <a id="overallscore"></a> `overallScore` | `number` | [`RepoAuditResult`](/docs/api/defi/protocols/src/modules/lyra-ecosystem/types.md#repoauditresult).[`overallScore`](/docs/api/defi/protocols/src/modules/lyra-ecosystem/types.md#overallscore-1) | [defi/protocols/src/modules/lyra-ecosystem/types.ts:86](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/modules/lyra-ecosystem/types.ts#L86) |
| <a id="recommendations"></a> `recommendations` | `string`[] | [`RepoAuditResult`](/docs/api/defi/protocols/src/modules/lyra-ecosystem/types.md#repoauditresult).[`recommendations`](/docs/api/defi/protocols/src/modules/lyra-ecosystem/types.md#recommendations-1) | [defi/protocols/src/modules/lyra-ecosystem/types.ts:88](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/modules/lyra-ecosystem/types.ts#L88) |
| <a id="repository-1"></a> `repository` | `string` | [`RepoAuditResult`](/docs/api/defi/protocols/src/modules/lyra-ecosystem/types.md#repoauditresult).[`repository`](/docs/api/defi/protocols/src/modules/lyra-ecosystem/types.md#repository-2) | [defi/protocols/src/modules/lyra-ecosystem/types.ts:80](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/modules/lyra-ecosystem/types.ts#L80) |
| <a id="securityscore"></a> `securityScore` | `number` | [`RepoAuditResult`](/docs/api/defi/protocols/src/modules/lyra-ecosystem/types.md#repoauditresult).[`securityScore`](/docs/api/defi/protocols/src/modules/lyra-ecosystem/types.md#securityscore-1) | [defi/protocols/src/modules/lyra-ecosystem/types.ts:83](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/modules/lyra-ecosystem/types.ts#L83) |
| <a id="totalfiles"></a> `totalFiles` | `number` | [`RepoAuditResult`](/docs/api/defi/protocols/src/modules/lyra-ecosystem/types.md#repoauditresult).[`totalFiles`](/docs/api/defi/protocols/src/modules/lyra-ecosystem/types.md#totalfiles-1) | [defi/protocols/src/modules/lyra-ecosystem/types.ts:81](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/modules/lyra-ecosystem/types.ts#L81) |

***

### EnvVarConfig

Defined in: [defi/protocols/src/modules/lyra-ecosystem/types.ts:177](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/modules/lyra-ecosystem/types.ts#L177)

#### Properties

| Property | Type | Defined in |
| :------ | :------ | :------ |
| <a id="description-5"></a> `description` | `string` | [defi/protocols/src/modules/lyra-ecosystem/types.ts:179](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/modules/lyra-ecosystem/types.ts#L179) |
| <a id="example"></a> `example?` | `string` | [defi/protocols/src/modules/lyra-ecosystem/types.ts:181](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/modules/lyra-ecosystem/types.ts#L181) |
| <a id="name-3"></a> `name` | `string` | [defi/protocols/src/modules/lyra-ecosystem/types.ts:178](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/modules/lyra-ecosystem/types.ts#L178) |
| <a id="required"></a> `required` | `boolean` | [defi/protocols/src/modules/lyra-ecosystem/types.ts:180](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/modules/lyra-ecosystem/types.ts#L180) |

***

### FeaturedListingRequest

Defined in: [defi/protocols/src/modules/lyra-ecosystem/types.ts:219](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/modules/lyra-ecosystem/types.ts#L219)

#### Properties

| Property | Type | Defined in |
| :------ | :------ | :------ |
| <a id="customdescription"></a> `customDescription?` | `string` | [defi/protocols/src/modules/lyra-ecosystem/types.ts:223](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/modules/lyra-ecosystem/types.ts#L223) |
| <a id="featureduntil"></a> `featuredUntil` | `Date` | [defi/protocols/src/modules/lyra-ecosystem/types.ts:221](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/modules/lyra-ecosystem/types.ts#L221) |
| <a id="tier"></a> `tier` | `"basic"` \| `"premium"` \| `"spotlight"` | [defi/protocols/src/modules/lyra-ecosystem/types.ts:222](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/modules/lyra-ecosystem/types.ts#L222) |
| <a id="toolid"></a> `toolId` | `string` | [defi/protocols/src/modules/lyra-ecosystem/types.ts:220](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/modules/lyra-ecosystem/types.ts#L220) |

***

### FileAnalysisResult

Defined in: [defi/protocols/src/modules/lyra-ecosystem/types.ts:47](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/modules/lyra-ecosystem/types.ts#L47)

#### Properties

| Property | Type | Defined in |
| :------ | :------ | :------ |
| <a id="classes"></a> `classes` | `number` | [defi/protocols/src/modules/lyra-ecosystem/types.ts:53](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/modules/lyra-ecosystem/types.ts#L53) |
| <a id="complexity"></a> `complexity` | `number` | [defi/protocols/src/modules/lyra-ecosystem/types.ts:50](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/modules/lyra-ecosystem/types.ts#L50) |
| <a id="filename"></a> `filename` | `string` | [defi/protocols/src/modules/lyra-ecosystem/types.ts:48](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/modules/lyra-ecosystem/types.ts#L48) |
| <a id="functions"></a> `functions` | `number` | [defi/protocols/src/modules/lyra-ecosystem/types.ts:52](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/modules/lyra-ecosystem/types.ts#L52) |
| <a id="language-1"></a> `language` | `string` | [defi/protocols/src/modules/lyra-ecosystem/types.ts:49](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/modules/lyra-ecosystem/types.ts#L49) |
| <a id="linesofcode"></a> `linesOfCode` | `number` | [defi/protocols/src/modules/lyra-ecosystem/types.ts:51](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/modules/lyra-ecosystem/types.ts#L51) |
| <a id="suggestions-1"></a> `suggestions` | `string`[] | [defi/protocols/src/modules/lyra-ecosystem/types.ts:54](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/modules/lyra-ecosystem/types.ts#L54) |

***

### IntegrationAssistance

Defined in: [defi/protocols/src/modules/lyra-ecosystem/types.ts:319](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/modules/lyra-ecosystem/types.ts#L319)

#### Properties

| Property | Type | Defined in |
| :------ | :------ | :------ |
| <a id="apiurl-2"></a> `apiUrl` | `string` | [defi/protocols/src/modules/lyra-ecosystem/types.ts:320](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/modules/lyra-ecosystem/types.ts#L320) |
| <a id="codesnippets"></a> `codeSnippets` | [`CodeSnippet`](/docs/api/defi/protocols/src/modules/lyra-ecosystem/types.md#codesnippet)[] | [defi/protocols/src/modules/lyra-ecosystem/types.ts:323](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/modules/lyra-ecosystem/types.ts#L323) |
| <a id="documentation"></a> `documentation` | `string` | [defi/protocols/src/modules/lyra-ecosystem/types.ts:325](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/modules/lyra-ecosystem/types.ts#L325) |
| <a id="fullanalysis"></a> `fullAnalysis` | [`CompatibilityAnalysis`](/docs/api/defi/protocols/src/modules/lyra-ecosystem/types.md#compatibilityanalysis) | [defi/protocols/src/modules/lyra-ecosystem/types.ts:321](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/modules/lyra-ecosystem/types.ts#L321) |
| <a id="generatedconfig"></a> `generatedConfig` | [`McpConfigResult`](/docs/api/defi/protocols/src/modules/lyra-ecosystem/types.md#mcpconfigresult) | [defi/protocols/src/modules/lyra-ecosystem/types.ts:322](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/modules/lyra-ecosystem/types.ts#L322) |
| <a id="supportcontact"></a> `supportContact?` | `string` | [defi/protocols/src/modules/lyra-ecosystem/types.ts:326](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/modules/lyra-ecosystem/types.ts#L326) |
| <a id="testcases"></a> `testCases` | [`TestCase`](/docs/api/defi/protocols/src/modules/lyra-ecosystem/types.md#testcase)[] | [defi/protocols/src/modules/lyra-ecosystem/types.ts:324](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/modules/lyra-ecosystem/types.ts#L324) |

***

### LyraChainPreference

Defined in: [defi/protocols/src/modules/lyra-ecosystem/types.ts:362](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/modules/lyra-ecosystem/types.ts#L362)

Chain preference configuration

#### Properties

| Property | Type | Description | Defined in |
| :------ | :------ | :------ | :------ |
| <a id="fallbacks"></a> `fallbacks?` | `string`[] | Fallback chains if primary fails | [defi/protocols/src/modules/lyra-ecosystem/types.ts:366](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/modules/lyra-ecosystem/types.ts#L366) |
| <a id="preferlowfees"></a> `preferLowFees?` | `boolean` | Prefer chains with lowest fees | [defi/protocols/src/modules/lyra-ecosystem/types.ts:368](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/modules/lyra-ecosystem/types.ts#L368) |
| <a id="primary"></a> `primary` | `string` | Primary chain for payments | [defi/protocols/src/modules/lyra-ecosystem/types.ts:364](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/modules/lyra-ecosystem/types.ts#L364) |
| <a id="testnetonly"></a> `testnetOnly?` | `boolean` | Only use testnet chains | [defi/protocols/src/modules/lyra-ecosystem/types.ts:370](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/modules/lyra-ecosystem/types.ts#L370) |

***

### LyraClientConfig

Defined in: [defi/protocols/src/modules/lyra-ecosystem/types.ts:373](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/modules/lyra-ecosystem/types.ts#L373)

#### Properties

| Property | Type | Description | Defined in |
| :------ | :------ | :------ | :------ |
| <a id="autopayenabled"></a> `autoPayEnabled?` | `boolean` | Automatically pay for services | [defi/protocols/src/modules/lyra-ecosystem/types.ts:387](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/modules/lyra-ecosystem/types.ts#L387) |
| <a id="chainpreference"></a> `chainPreference?` | [`LyraChainPreference`](/docs/api/defi/protocols/src/modules/lyra-ecosystem/types.md#lyrachainpreference) | Chain preference settings | [defi/protocols/src/modules/lyra-ecosystem/types.ts:383](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/modules/lyra-ecosystem/types.ts#L383) |
| <a id="discovery"></a> `discovery?` | [`LyraDiscoveryConfig`](/docs/api/defi/protocols/src/modules/lyra-ecosystem/types.md#lyradiscoveryconfig) | Discovery service config | [defi/protocols/src/modules/lyra-ecosystem/types.ts:395](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/modules/lyra-ecosystem/types.ts#L395) |
| <a id="intel"></a> `intel?` | [`LyraIntelConfig`](/docs/api/defi/protocols/src/modules/lyra-ecosystem/types.md#lyraintelconfig) | Intel service config | [defi/protocols/src/modules/lyra-ecosystem/types.ts:391](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/modules/lyra-ecosystem/types.ts#L391) |
| <a id="maxdailyspend"></a> `maxDailySpend?` | `string` | Maximum daily spend in USD | [defi/protocols/src/modules/lyra-ecosystem/types.ts:385](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/modules/lyra-ecosystem/types.ts#L385) |
| <a id="network"></a> `network?` | `string` | Primary payment network (e.g., "base", "arbitrum", "bsc", "solana-mainnet") | [defi/protocols/src/modules/lyra-ecosystem/types.ts:381](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/modules/lyra-ecosystem/types.ts#L381) |
| <a id="preferredtoken"></a> `preferredToken?` | `"USDC"` \| `"USDs"` \| `"USDT"` | Preferred stablecoin ("USDC" | "USDT" | "USDs") | [defi/protocols/src/modules/lyra-ecosystem/types.ts:389](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/modules/lyra-ecosystem/types.ts#L389) |
| <a id="registry"></a> `registry?` | [`LyraRegistryConfig`](/docs/api/defi/protocols/src/modules/lyra-ecosystem/types.md#lyraregistryconfig) | Registry service config | [defi/protocols/src/modules/lyra-ecosystem/types.ts:393](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/modules/lyra-ecosystem/types.ts#L393) |
| <a id="wallets"></a> `wallets?` | [`LyraWalletConfig`](/docs/api/defi/protocols/src/modules/lyra-ecosystem/types.md#lyrawalletconfig) | Multi-chain wallet configuration | [defi/protocols/src/modules/lyra-ecosystem/types.ts:379](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/modules/lyra-ecosystem/types.ts#L379) |
| <a id="x402privatekey"></a> ~~`x402PrivateKey?`~~ | `string` | **Deprecated** Use wallets.evmPrivateKey instead | [defi/protocols/src/modules/lyra-ecosystem/types.ts:377](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/modules/lyra-ecosystem/types.ts#L377) |
| <a id="x402wallet"></a> ~~`x402Wallet?`~~ | `string` | **Deprecated** Use wallets.evmPrivateKey instead | [defi/protocols/src/modules/lyra-ecosystem/types.ts:375](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/modules/lyra-ecosystem/types.ts#L375) |

***

### LyraDiscoveryConfig

Defined in: [defi/protocols/src/modules/lyra-ecosystem/types.ts:230](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/modules/lyra-ecosystem/types.ts#L230)

#### Properties

| Property | Type | Defined in |
| :------ | :------ | :------ |
| <a id="baseurl"></a> `baseUrl?` | `string` | [defi/protocols/src/modules/lyra-ecosystem/types.ts:231](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/modules/lyra-ecosystem/types.ts#L231) |
| <a id="enableautodiscovery"></a> `enableAutoDiscovery?` | `boolean` | [defi/protocols/src/modules/lyra-ecosystem/types.ts:232](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/modules/lyra-ecosystem/types.ts#L232) |

***

### LyraIntelConfig

Defined in: [defi/protocols/src/modules/lyra-ecosystem/types.ts:41](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/modules/lyra-ecosystem/types.ts#L41)

#### Properties

| Property | Type | Defined in |
| :------ | :------ | :------ |
| <a id="baseurl-1"></a> `baseUrl?` | `string` | [defi/protocols/src/modules/lyra-ecosystem/types.ts:42](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/modules/lyra-ecosystem/types.ts#L42) |
| <a id="cachettlms"></a> `cacheTtlMs?` | `number` | [defi/protocols/src/modules/lyra-ecosystem/types.ts:44](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/modules/lyra-ecosystem/types.ts#L44) |
| <a id="enablecaching"></a> `enableCaching?` | `boolean` | [defi/protocols/src/modules/lyra-ecosystem/types.ts:43](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/modules/lyra-ecosystem/types.ts#L43) |

***

### LyraPaymentResult

Defined in: [defi/protocols/src/modules/lyra-ecosystem/types.ts:14](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/modules/lyra-ecosystem/types.ts#L14)

#### Properties

| Property | Type | Defined in |
| :------ | :------ | :------ |
| <a id="amount"></a> `amount` | `string` | [defi/protocols/src/modules/lyra-ecosystem/types.ts:17](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/modules/lyra-ecosystem/types.ts#L17) |
| <a id="network-1"></a> `network` | `string` | [defi/protocols/src/modules/lyra-ecosystem/types.ts:21](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/modules/lyra-ecosystem/types.ts#L21) |
| <a id="operation"></a> `operation` | `string` | [defi/protocols/src/modules/lyra-ecosystem/types.ts:19](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/modules/lyra-ecosystem/types.ts#L19) |
| <a id="service"></a> `service` | [`LyraServiceName`](/docs/api/defi/protocols/src/modules/lyra-ecosystem/types.md#lyraservicename) | [defi/protocols/src/modules/lyra-ecosystem/types.ts:18](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/modules/lyra-ecosystem/types.ts#L18) |
| <a id="success"></a> `success` | `boolean` | [defi/protocols/src/modules/lyra-ecosystem/types.ts:15](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/modules/lyra-ecosystem/types.ts#L15) |
| <a id="timestamp-1"></a> `timestamp` | `number` | [defi/protocols/src/modules/lyra-ecosystem/types.ts:20](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/modules/lyra-ecosystem/types.ts#L20) |
| <a id="transactionhash"></a> `transactionHash?` | `string` | [defi/protocols/src/modules/lyra-ecosystem/types.ts:16](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/modules/lyra-ecosystem/types.ts#L16) |

***

### LyraPricingTier

Defined in: [defi/protocols/src/modules/lyra-ecosystem/types.ts:398](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/modules/lyra-ecosystem/types.ts#L398)

#### Properties

| Property | Type | Defined in |
| :------ | :------ | :------ |
| <a id="description-6"></a> `description` | `string` | [defi/protocols/src/modules/lyra-ecosystem/types.ts:402](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/modules/lyra-ecosystem/types.ts#L402) |
| <a id="operation-1"></a> `operation` | `string` | [defi/protocols/src/modules/lyra-ecosystem/types.ts:400](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/modules/lyra-ecosystem/types.ts#L400) |
| <a id="price"></a> `price` | `string` | [defi/protocols/src/modules/lyra-ecosystem/types.ts:401](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/modules/lyra-ecosystem/types.ts#L401) |
| <a id="ratelimit"></a> `rateLimit?` | `number` | [defi/protocols/src/modules/lyra-ecosystem/types.ts:403](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/modules/lyra-ecosystem/types.ts#L403) |
| <a id="service-1"></a> `service` | [`LyraServiceName`](/docs/api/defi/protocols/src/modules/lyra-ecosystem/types.md#lyraservicename) | [defi/protocols/src/modules/lyra-ecosystem/types.ts:399](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/modules/lyra-ecosystem/types.ts#L399) |

***

### LyraRegistryConfig

Defined in: [defi/protocols/src/modules/lyra-ecosystem/types.ts:127](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/modules/lyra-ecosystem/types.ts#L127)

#### Properties

| Property | Type | Defined in |
| :------ | :------ | :------ |
| <a id="apikey"></a> `apiKey?` | `string` | [defi/protocols/src/modules/lyra-ecosystem/types.ts:129](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/modules/lyra-ecosystem/types.ts#L129) |
| <a id="baseurl-2"></a> `baseUrl?` | `string` | [defi/protocols/src/modules/lyra-ecosystem/types.ts:128](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/modules/lyra-ecosystem/types.ts#L128) |

***

### LyraUsageStats

Defined in: [defi/protocols/src/modules/lyra-ecosystem/types.ts:24](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/modules/lyra-ecosystem/types.ts#L24)

#### Properties

| Property | Type | Defined in |
| :------ | :------ | :------ |
| <a id="byservice"></a> `byService` | `Record`\<[`LyraServiceName`](/docs/api/defi/protocols/src/modules/lyra-ecosystem/types.md#lyraservicename), [`ServiceUsage`](/docs/api/defi/protocols/src/modules/lyra-ecosystem/types.md#serviceusage)\> | [defi/protocols/src/modules/lyra-ecosystem/types.ts:27](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/modules/lyra-ecosystem/types.ts#L27) |
| <a id="period"></a> `period` | `"day"` \| `"week"` \| `"month"` \| `"all"` | [defi/protocols/src/modules/lyra-ecosystem/types.ts:28](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/modules/lyra-ecosystem/types.ts#L28) |
| <a id="requestcount"></a> `requestCount` | `number` | [defi/protocols/src/modules/lyra-ecosystem/types.ts:26](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/modules/lyra-ecosystem/types.ts#L26) |
| <a id="totalspent"></a> `totalSpent` | `string` | [defi/protocols/src/modules/lyra-ecosystem/types.ts:25](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/modules/lyra-ecosystem/types.ts#L25) |

***

### LyraWalletConfig

Defined in: [defi/protocols/src/modules/lyra-ecosystem/types.ts:350](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/modules/lyra-ecosystem/types.ts#L350)

Multi-chain wallet configuration

#### Properties

| Property | Type | Description | Defined in |
| :------ | :------ | :------ | :------ |
| <a id="evmprivatekey"></a> `evmPrivateKey?` | `` `0x${string}` `` | EVM private key (hex with 0x prefix) - works for Base, Arbitrum, BSC, Ethereum, Polygon, Optimism | [defi/protocols/src/modules/lyra-ecosystem/types.ts:352](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/modules/lyra-ecosystem/types.ts#L352) |
| <a id="privatekey"></a> `privateKey?` | `string` | Legacy: Single wallet key (EVM format, use evmPrivateKey instead) | [defi/protocols/src/modules/lyra-ecosystem/types.ts:356](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/modules/lyra-ecosystem/types.ts#L356) |
| <a id="svmprivatekey"></a> `svmPrivateKey?` | `string` | Solana private key (base58 encoded) | [defi/protocols/src/modules/lyra-ecosystem/types.ts:354](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/modules/lyra-ecosystem/types.ts#L354) |

***

### McpConfigResult

Defined in: [defi/protocols/src/modules/lyra-ecosystem/types.ts:279](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/modules/lyra-ecosystem/types.ts#L279)

#### Properties

| Property | Type | Defined in |
| :------ | :------ | :------ |
| <a id="config"></a> `config` | [`McpServerConfig`](/docs/api/defi/protocols/src/modules/lyra-ecosystem/types.md#mcpserverconfig) | [defi/protocols/src/modules/lyra-ecosystem/types.ts:281](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/modules/lyra-ecosystem/types.ts#L281) |
| <a id="generated"></a> `generated` | `boolean` | [defi/protocols/src/modules/lyra-ecosystem/types.ts:280](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/modules/lyra-ecosystem/types.ts#L280) |
| <a id="setupinstructions"></a> `setupInstructions` | `string`[] | [defi/protocols/src/modules/lyra-ecosystem/types.ts:283](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/modules/lyra-ecosystem/types.ts#L283) |
| <a id="warnings"></a> `warnings` | `string`[] | [defi/protocols/src/modules/lyra-ecosystem/types.ts:282](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/modules/lyra-ecosystem/types.ts#L282) |

***

### McpPromptConfig

Defined in: [defi/protocols/src/modules/lyra-ecosystem/types.ts:309](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/modules/lyra-ecosystem/types.ts#L309)

#### Properties

| Property | Type | Defined in |
| :------ | :------ | :------ |
| <a id="arguments"></a> `arguments` | \{ `description`: `string`; `name`: `string`; `required`: `boolean`; \}[] | [defi/protocols/src/modules/lyra-ecosystem/types.ts:312](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/modules/lyra-ecosystem/types.ts#L312) |
| <a id="description-7"></a> `description` | `string` | [defi/protocols/src/modules/lyra-ecosystem/types.ts:311](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/modules/lyra-ecosystem/types.ts#L311) |
| <a id="name-4"></a> `name` | `string` | [defi/protocols/src/modules/lyra-ecosystem/types.ts:310](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/modules/lyra-ecosystem/types.ts#L310) |

***

### McpResourceConfig

Defined in: [defi/protocols/src/modules/lyra-ecosystem/types.ts:302](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/modules/lyra-ecosystem/types.ts#L302)

#### Properties

| Property | Type | Defined in |
| :------ | :------ | :------ |
| <a id="description-8"></a> `description` | `string` | [defi/protocols/src/modules/lyra-ecosystem/types.ts:305](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/modules/lyra-ecosystem/types.ts#L305) |
| <a id="mimetype"></a> `mimeType?` | `string` | [defi/protocols/src/modules/lyra-ecosystem/types.ts:306](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/modules/lyra-ecosystem/types.ts#L306) |
| <a id="name-5"></a> `name` | `string` | [defi/protocols/src/modules/lyra-ecosystem/types.ts:304](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/modules/lyra-ecosystem/types.ts#L304) |
| <a id="uri"></a> `uri` | `string` | [defi/protocols/src/modules/lyra-ecosystem/types.ts:303](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/modules/lyra-ecosystem/types.ts#L303) |

***

### McpServerConfig

Defined in: [defi/protocols/src/modules/lyra-ecosystem/types.ts:286](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/modules/lyra-ecosystem/types.ts#L286)

#### Properties

| Property | Type | Defined in |
| :------ | :------ | :------ |
| <a id="description-9"></a> `description` | `string` | [defi/protocols/src/modules/lyra-ecosystem/types.ts:289](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/modules/lyra-ecosystem/types.ts#L289) |
| <a id="name-6"></a> `name` | `string` | [defi/protocols/src/modules/lyra-ecosystem/types.ts:287](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/modules/lyra-ecosystem/types.ts#L287) |
| <a id="prompts"></a> `prompts?` | [`McpPromptConfig`](/docs/api/defi/protocols/src/modules/lyra-ecosystem/types.md#mcppromptconfig)[] | [defi/protocols/src/modules/lyra-ecosystem/types.ts:292](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/modules/lyra-ecosystem/types.ts#L292) |
| <a id="resources"></a> `resources?` | [`McpResourceConfig`](/docs/api/defi/protocols/src/modules/lyra-ecosystem/types.md#mcpresourceconfig)[] | [defi/protocols/src/modules/lyra-ecosystem/types.ts:291](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/modules/lyra-ecosystem/types.ts#L291) |
| <a id="tools-1"></a> `tools` | [`McpToolConfig`](/docs/api/defi/protocols/src/modules/lyra-ecosystem/types.md#mcptoolconfig)[] | [defi/protocols/src/modules/lyra-ecosystem/types.ts:290](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/modules/lyra-ecosystem/types.ts#L290) |
| <a id="version-2"></a> `version` | `string` | [defi/protocols/src/modules/lyra-ecosystem/types.ts:288](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/modules/lyra-ecosystem/types.ts#L288) |

***

### McpToolConfig

Defined in: [defi/protocols/src/modules/lyra-ecosystem/types.ts:295](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/modules/lyra-ecosystem/types.ts#L295)

#### Properties

| Property | Type | Defined in |
| :------ | :------ | :------ |
| <a id="description-10"></a> `description` | `string` | [defi/protocols/src/modules/lyra-ecosystem/types.ts:297](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/modules/lyra-ecosystem/types.ts#L297) |
| <a id="handler"></a> `handler` | `string` | [defi/protocols/src/modules/lyra-ecosystem/types.ts:299](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/modules/lyra-ecosystem/types.ts#L299) |
| <a id="inputschema"></a> `inputSchema` | `Record`\<`string`, `unknown`\> | [defi/protocols/src/modules/lyra-ecosystem/types.ts:298](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/modules/lyra-ecosystem/types.ts#L298) |
| <a id="name-7"></a> `name` | `string` | [defi/protocols/src/modules/lyra-ecosystem/types.ts:296](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/modules/lyra-ecosystem/types.ts#L296) |

***

### PrivateToolRegistration

Defined in: [defi/protocols/src/modules/lyra-ecosystem/types.ts:208](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/modules/lyra-ecosystem/types.ts#L208)

#### Properties

| Property | Type | Defined in |
| :------ | :------ | :------ |
| <a id="category-2"></a> `category` | `string` | [defi/protocols/src/modules/lyra-ecosystem/types.ts:213](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/modules/lyra-ecosystem/types.ts#L213) |
| <a id="description-11"></a> `description` | `string` | [defi/protocols/src/modules/lyra-ecosystem/types.ts:210](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/modules/lyra-ecosystem/types.ts#L210) |
| <a id="endpoint-2"></a> `endpoint` | `string` | [defi/protocols/src/modules/lyra-ecosystem/types.ts:212](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/modules/lyra-ecosystem/types.ts#L212) |
| <a id="name-8"></a> `name` | `string` | [defi/protocols/src/modules/lyra-ecosystem/types.ts:209](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/modules/lyra-ecosystem/types.ts#L209) |
| <a id="pricing-1"></a> `pricing?` | [`ToolPricing`](/docs/api/defi/protocols/src/modules/lyra-ecosystem/types.md#toolpricing) | [defi/protocols/src/modules/lyra-ecosystem/types.ts:215](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/modules/lyra-ecosystem/types.ts#L215) |
| <a id="tags-1"></a> `tags?` | `string`[] | [defi/protocols/src/modules/lyra-ecosystem/types.ts:214](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/modules/lyra-ecosystem/types.ts#L214) |
| <a id="version-3"></a> `version` | `string` | [defi/protocols/src/modules/lyra-ecosystem/types.ts:211](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/modules/lyra-ecosystem/types.ts#L211) |
| <a id="visibility"></a> `visibility` | `"private"` \| `"organization"` \| `"public"` | [defi/protocols/src/modules/lyra-ecosystem/types.ts:216](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/modules/lyra-ecosystem/types.ts#L216) |

***

### RepoAuditResult

Defined in: [defi/protocols/src/modules/lyra-ecosystem/types.ts:79](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/modules/lyra-ecosystem/types.ts#L79)

#### Extended by

- [`EnterpriseAnalysisResult`](/docs/api/defi/protocols/src/modules/lyra-ecosystem/types.md#enterpriseanalysisresult)

#### Properties

| Property | Type | Defined in |
| :------ | :------ | :------ |
| <a id="analyzedfiles-1"></a> `analyzedFiles` | `number` | [defi/protocols/src/modules/lyra-ecosystem/types.ts:82](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/modules/lyra-ecosystem/types.ts#L82) |
| <a id="codequalityscore-1"></a> `codeQualityScore` | `number` | [defi/protocols/src/modules/lyra-ecosystem/types.ts:84](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/modules/lyra-ecosystem/types.ts#L84) |
| <a id="issues-2"></a> `issues` | [`AuditIssue`](/docs/api/defi/protocols/src/modules/lyra-ecosystem/types.md#auditissue)[] | [defi/protocols/src/modules/lyra-ecosystem/types.ts:87](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/modules/lyra-ecosystem/types.ts#L87) |
| <a id="maintainabilityscore-1"></a> `maintainabilityScore` | `number` | [defi/protocols/src/modules/lyra-ecosystem/types.ts:85](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/modules/lyra-ecosystem/types.ts#L85) |
| <a id="metrics-1"></a> `metrics` | [`RepoMetrics`](/docs/api/defi/protocols/src/modules/lyra-ecosystem/types.md#repometrics) | [defi/protocols/src/modules/lyra-ecosystem/types.ts:89](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/modules/lyra-ecosystem/types.ts#L89) |
| <a id="overallscore-1"></a> `overallScore` | `number` | [defi/protocols/src/modules/lyra-ecosystem/types.ts:86](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/modules/lyra-ecosystem/types.ts#L86) |
| <a id="recommendations-1"></a> `recommendations` | `string`[] | [defi/protocols/src/modules/lyra-ecosystem/types.ts:88](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/modules/lyra-ecosystem/types.ts#L88) |
| <a id="repository-2"></a> `repository` | `string` | [defi/protocols/src/modules/lyra-ecosystem/types.ts:80](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/modules/lyra-ecosystem/types.ts#L80) |
| <a id="securityscore-1"></a> `securityScore` | `number` | [defi/protocols/src/modules/lyra-ecosystem/types.ts:83](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/modules/lyra-ecosystem/types.ts#L83) |
| <a id="totalfiles-1"></a> `totalFiles` | `number` | [defi/protocols/src/modules/lyra-ecosystem/types.ts:81](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/modules/lyra-ecosystem/types.ts#L81) |

***

### RepoMetrics

Defined in: [defi/protocols/src/modules/lyra-ecosystem/types.ts:101](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/modules/lyra-ecosystem/types.ts#L101)

#### Properties

| Property | Type | Defined in |
| :------ | :------ | :------ |
| <a id="blanklines"></a> `blankLines` | `number` | [defi/protocols/src/modules/lyra-ecosystem/types.ts:105](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/modules/lyra-ecosystem/types.ts#L105) |
| <a id="codelines"></a> `codeLines` | `number` | [defi/protocols/src/modules/lyra-ecosystem/types.ts:103](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/modules/lyra-ecosystem/types.ts#L103) |
| <a id="commentlines"></a> `commentLines` | `number` | [defi/protocols/src/modules/lyra-ecosystem/types.ts:104](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/modules/lyra-ecosystem/types.ts#L104) |
| <a id="duplicatecode"></a> `duplicateCode?` | `number` | [defi/protocols/src/modules/lyra-ecosystem/types.ts:108](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/modules/lyra-ecosystem/types.ts#L108) |
| <a id="technicaldebt"></a> `technicalDebt?` | `string` | [defi/protocols/src/modules/lyra-ecosystem/types.ts:107](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/modules/lyra-ecosystem/types.ts#L107) |
| <a id="testcoverage"></a> `testCoverage?` | `number` | [defi/protocols/src/modules/lyra-ecosystem/types.ts:106](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/modules/lyra-ecosystem/types.ts#L106) |
| <a id="totallines"></a> `totalLines` | `number` | [defi/protocols/src/modules/lyra-ecosystem/types.ts:102](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/modules/lyra-ecosystem/types.ts#L102) |

***

### SecurityScanResult

Defined in: [defi/protocols/src/modules/lyra-ecosystem/types.ts:57](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/modules/lyra-ecosystem/types.ts#L57)

#### Properties

| Property | Type | Defined in |
| :------ | :------ | :------ |
| <a id="recommendations-2"></a> `recommendations` | `string`[] | [defi/protocols/src/modules/lyra-ecosystem/types.ts:62](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/modules/lyra-ecosystem/types.ts#L62) |
| <a id="score"></a> `score` | `number` | [defi/protocols/src/modules/lyra-ecosystem/types.ts:60](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/modules/lyra-ecosystem/types.ts#L60) |
| <a id="severity-1"></a> `severity` | `"low"` \| `"medium"` \| `"high"` \| `"critical"` | [defi/protocols/src/modules/lyra-ecosystem/types.ts:58](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/modules/lyra-ecosystem/types.ts#L58) |
| <a id="summary"></a> `summary` | `string` | [defi/protocols/src/modules/lyra-ecosystem/types.ts:61](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/modules/lyra-ecosystem/types.ts#L61) |
| <a id="vulnerabilities"></a> `vulnerabilities` | [`Vulnerability`](/docs/api/defi/protocols/src/modules/lyra-ecosystem/types.md#vulnerability)[] | [defi/protocols/src/modules/lyra-ecosystem/types.ts:59](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/modules/lyra-ecosystem/types.ts#L59) |

***

### ServiceUsage

Defined in: [defi/protocols/src/modules/lyra-ecosystem/types.ts:31](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/modules/lyra-ecosystem/types.ts#L31)

#### Properties

| Property | Type | Defined in |
| :------ | :------ | :------ |
| <a id="lastused"></a> `lastUsed?` | `number` | [defi/protocols/src/modules/lyra-ecosystem/types.ts:34](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/modules/lyra-ecosystem/types.ts#L34) |
| <a id="requests"></a> `requests` | `number` | [defi/protocols/src/modules/lyra-ecosystem/types.ts:33](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/modules/lyra-ecosystem/types.ts#L33) |
| <a id="spent"></a> `spent` | `string` | [defi/protocols/src/modules/lyra-ecosystem/types.ts:32](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/modules/lyra-ecosystem/types.ts#L32) |

***

### TestCase

Defined in: [defi/protocols/src/modules/lyra-ecosystem/types.ts:336](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/modules/lyra-ecosystem/types.ts#L336)

#### Properties

| Property | Type | Defined in |
| :------ | :------ | :------ |
| <a id="description-12"></a> `description` | `string` | [defi/protocols/src/modules/lyra-ecosystem/types.ts:338](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/modules/lyra-ecosystem/types.ts#L338) |
| <a id="expectedoutput"></a> `expectedOutput` | `Record`\<`string`, `unknown`\> | [defi/protocols/src/modules/lyra-ecosystem/types.ts:340](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/modules/lyra-ecosystem/types.ts#L340) |
| <a id="input"></a> `input` | `Record`\<`string`, `unknown`\> | [defi/protocols/src/modules/lyra-ecosystem/types.ts:339](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/modules/lyra-ecosystem/types.ts#L339) |
| <a id="name-9"></a> `name` | `string` | [defi/protocols/src/modules/lyra-ecosystem/types.ts:337](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/modules/lyra-ecosystem/types.ts#L337) |

***

### ToolConfiguration

Defined in: [defi/protocols/src/modules/lyra-ecosystem/types.ts:164](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/modules/lyra-ecosystem/types.ts#L164)

#### Properties

| Property | Type | Defined in |
| :------ | :------ | :------ |
| <a id="envvars"></a> `envVars` | [`EnvVarConfig`](/docs/api/defi/protocols/src/modules/lyra-ecosystem/types.md#envvarconfig)[] | [defi/protocols/src/modules/lyra-ecosystem/types.ts:167](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/modules/lyra-ecosystem/types.ts#L167) |
| <a id="optional"></a> `optional` | [`ConfigOption`](/docs/api/defi/protocols/src/modules/lyra-ecosystem/types.md#configoption)[] | [defi/protocols/src/modules/lyra-ecosystem/types.ts:166](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/modules/lyra-ecosystem/types.ts#L166) |
| <a id="required-1"></a> `required` | [`ConfigOption`](/docs/api/defi/protocols/src/modules/lyra-ecosystem/types.md#configoption)[] | [defi/protocols/src/modules/lyra-ecosystem/types.ts:165](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/modules/lyra-ecosystem/types.ts#L165) |

***

### ToolDependency

Defined in: [defi/protocols/src/modules/lyra-ecosystem/types.ts:184](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/modules/lyra-ecosystem/types.ts#L184)

#### Properties

| Property | Type | Defined in |
| :------ | :------ | :------ |
| <a id="name-10"></a> `name` | `string` | [defi/protocols/src/modules/lyra-ecosystem/types.ts:185](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/modules/lyra-ecosystem/types.ts#L185) |
| <a id="type-2"></a> `type` | `"runtime"` \| `"dev"` \| `"peer"` | [defi/protocols/src/modules/lyra-ecosystem/types.ts:187](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/modules/lyra-ecosystem/types.ts#L187) |
| <a id="version-4"></a> `version` | `string` | [defi/protocols/src/modules/lyra-ecosystem/types.ts:186](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/modules/lyra-ecosystem/types.ts#L186) |

***

### ToolExample

Defined in: [defi/protocols/src/modules/lyra-ecosystem/types.ts:157](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/modules/lyra-ecosystem/types.ts#L157)

#### Properties

| Property | Type | Defined in |
| :------ | :------ | :------ |
| <a id="code-1"></a> `code` | `string` | [defi/protocols/src/modules/lyra-ecosystem/types.ts:160](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/modules/lyra-ecosystem/types.ts#L160) |
| <a id="description-13"></a> `description` | `string` | [defi/protocols/src/modules/lyra-ecosystem/types.ts:159](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/modules/lyra-ecosystem/types.ts#L159) |
| <a id="language-2"></a> `language` | `string` | [defi/protocols/src/modules/lyra-ecosystem/types.ts:161](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/modules/lyra-ecosystem/types.ts#L161) |
| <a id="title-1"></a> `title` | `string` | [defi/protocols/src/modules/lyra-ecosystem/types.ts:158](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/modules/lyra-ecosystem/types.ts#L158) |

***

### ToolInfo

Defined in: [defi/protocols/src/modules/lyra-ecosystem/types.ts:132](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/modules/lyra-ecosystem/types.ts#L132)

#### Extended by

- [`DetailedToolInfo`](/docs/api/defi/protocols/src/modules/lyra-ecosystem/types.md#detailedtoolinfo)

#### Properties

| Property | Type | Defined in |
| :------ | :------ | :------ |
| <a id="author-1"></a> `author` | `string` | [defi/protocols/src/modules/lyra-ecosystem/types.ts:136](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/modules/lyra-ecosystem/types.ts#L136) |
| <a id="category-3"></a> `category` | `string` | [defi/protocols/src/modules/lyra-ecosystem/types.ts:138](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/modules/lyra-ecosystem/types.ts#L138) |
| <a id="description-14"></a> `description` | `string` | [defi/protocols/src/modules/lyra-ecosystem/types.ts:135](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/modules/lyra-ecosystem/types.ts#L135) |
| <a id="downloads-1"></a> `downloads` | `number` | [defi/protocols/src/modules/lyra-ecosystem/types.ts:141](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/modules/lyra-ecosystem/types.ts#L141) |
| <a id="homepage-1"></a> `homepage?` | `string` | [defi/protocols/src/modules/lyra-ecosystem/types.ts:143](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/modules/lyra-ecosystem/types.ts#L143) |
| <a id="id-1"></a> `id` | `string` | [defi/protocols/src/modules/lyra-ecosystem/types.ts:133](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/modules/lyra-ecosystem/types.ts#L133) |
| <a id="lastupdated-1"></a> `lastUpdated` | `string` | [defi/protocols/src/modules/lyra-ecosystem/types.ts:142](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/modules/lyra-ecosystem/types.ts#L142) |
| <a id="name-11"></a> `name` | `string` | [defi/protocols/src/modules/lyra-ecosystem/types.ts:134](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/modules/lyra-ecosystem/types.ts#L134) |
| <a id="repository-3"></a> `repository?` | `string` | [defi/protocols/src/modules/lyra-ecosystem/types.ts:144](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/modules/lyra-ecosystem/types.ts#L144) |
| <a id="stars-1"></a> `stars` | `number` | [defi/protocols/src/modules/lyra-ecosystem/types.ts:140](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/modules/lyra-ecosystem/types.ts#L140) |
| <a id="tags-2"></a> `tags` | `string`[] | [defi/protocols/src/modules/lyra-ecosystem/types.ts:139](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/modules/lyra-ecosystem/types.ts#L139) |
| <a id="version-5"></a> `version` | `string` | [defi/protocols/src/modules/lyra-ecosystem/types.ts:137](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/modules/lyra-ecosystem/types.ts#L137) |

***

### ToolParameter

Defined in: [defi/protocols/src/modules/lyra-ecosystem/types.ts:251](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/modules/lyra-ecosystem/types.ts#L251)

#### Properties

| Property | Type | Defined in |
| :------ | :------ | :------ |
| <a id="description-15"></a> `description?` | `string` | [defi/protocols/src/modules/lyra-ecosystem/types.ts:255](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/modules/lyra-ecosystem/types.ts#L255) |
| <a id="name-12"></a> `name` | `string` | [defi/protocols/src/modules/lyra-ecosystem/types.ts:252](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/modules/lyra-ecosystem/types.ts#L252) |
| <a id="required-2"></a> `required` | `boolean` | [defi/protocols/src/modules/lyra-ecosystem/types.ts:254](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/modules/lyra-ecosystem/types.ts#L254) |
| <a id="type-3"></a> `type` | `string` | [defi/protocols/src/modules/lyra-ecosystem/types.ts:253](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/modules/lyra-ecosystem/types.ts#L253) |

***

### ToolPricing

Defined in: [defi/protocols/src/modules/lyra-ecosystem/types.ts:202](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/modules/lyra-ecosystem/types.ts#L202)

#### Properties

| Property | Type | Defined in |
| :------ | :------ | :------ |
| <a id="price-1"></a> `price?` | `string` | [defi/protocols/src/modules/lyra-ecosystem/types.ts:204](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/modules/lyra-ecosystem/types.ts#L204) |
| <a id="subscriptionprice"></a> `subscriptionPrice?` | `string` | [defi/protocols/src/modules/lyra-ecosystem/types.ts:205](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/modules/lyra-ecosystem/types.ts#L205) |
| <a id="type-4"></a> `type` | `"free"` \| `"freemium"` \| `"paid"` \| `"subscription"` | [defi/protocols/src/modules/lyra-ecosystem/types.ts:203](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/modules/lyra-ecosystem/types.ts#L203) |

***

### Vulnerability

Defined in: [defi/protocols/src/modules/lyra-ecosystem/types.ts:65](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/modules/lyra-ecosystem/types.ts#L65)

#### Properties

| Property | Type | Defined in |
| :------ | :------ | :------ |
| <a id="cweid"></a> `cweId?` | `string` | [defi/protocols/src/modules/lyra-ecosystem/types.ts:76](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/modules/lyra-ecosystem/types.ts#L76) |
| <a id="description-16"></a> `description` | `string` | [defi/protocols/src/modules/lyra-ecosystem/types.ts:74](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/modules/lyra-ecosystem/types.ts#L74) |
| <a id="id-2"></a> `id` | `string` | [defi/protocols/src/modules/lyra-ecosystem/types.ts:66](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/modules/lyra-ecosystem/types.ts#L66) |
| <a id="location"></a> `location` | \{ `column?`: `number`; `file`: `string`; `line?`: `number`; \} | [defi/protocols/src/modules/lyra-ecosystem/types.ts:69](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/modules/lyra-ecosystem/types.ts#L69) |
| `location.column?` | `number` | [defi/protocols/src/modules/lyra-ecosystem/types.ts:72](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/modules/lyra-ecosystem/types.ts#L72) |
| `location.file` | `string` | [defi/protocols/src/modules/lyra-ecosystem/types.ts:70](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/modules/lyra-ecosystem/types.ts#L70) |
| `location.line?` | `number` | [defi/protocols/src/modules/lyra-ecosystem/types.ts:71](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/modules/lyra-ecosystem/types.ts#L71) |
| <a id="recommendation"></a> `recommendation` | `string` | [defi/protocols/src/modules/lyra-ecosystem/types.ts:75](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/modules/lyra-ecosystem/types.ts#L75) |
| <a id="severity-2"></a> `severity` | `"low"` \| `"medium"` \| `"high"` \| `"critical"` | [defi/protocols/src/modules/lyra-ecosystem/types.ts:68](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/modules/lyra-ecosystem/types.ts#L68) |
| <a id="type-5"></a> `type` | `string` | [defi/protocols/src/modules/lyra-ecosystem/types.ts:67](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/modules/lyra-ecosystem/types.ts#L67) |

## Type Aliases

### LyraServiceName

```ts
type LyraServiceName = "intel" | "registry" | "discovery";
```

Defined in: [defi/protocols/src/modules/lyra-ecosystem/types.ts:12](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/modules/lyra-ecosystem/types.ts#L12)

## Variables

### LYRA\_PRICING

```ts
const LYRA_PRICING: Record<string, LyraPricingTier[]>;
```

Defined in: [defi/protocols/src/modules/lyra-ecosystem/types.ts:407](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/modules/lyra-ecosystem/types.ts#L407)
