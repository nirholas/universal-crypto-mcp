[**Universal Crypto MCP API Reference v1.0.0**](../../../../../../index.md)

***

[Universal Crypto MCP API Reference](/docs/api/index.md) / defi/protocols/src/modules/tool-marketplace/verification/types

# defi/protocols/src/modules/tool-marketplace/verification/types

## Interfaces

### CORSPolicy

Defined in: [defi/protocols/src/modules/tool-marketplace/verification/types.ts:162](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/modules/tool-marketplace/verification/types.ts#L162)

CORS policy info

#### Properties

| Property | Type | Defined in |
| :------ | :------ | :------ |
| <a id="allowcredentials"></a> `allowCredentials` | `boolean` | [defi/protocols/src/modules/tool-marketplace/verification/types.ts:167](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/modules/tool-marketplace/verification/types.ts#L167) |
| <a id="allowedheaders"></a> `allowedHeaders` | `string`[] | [defi/protocols/src/modules/tool-marketplace/verification/types.ts:165](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/modules/tool-marketplace/verification/types.ts#L165) |
| <a id="allowedmethods"></a> `allowedMethods` | `string`[] | [defi/protocols/src/modules/tool-marketplace/verification/types.ts:164](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/modules/tool-marketplace/verification/types.ts#L164) |
| <a id="allowedorigins"></a> `allowedOrigins` | `string`[] | [defi/protocols/src/modules/tool-marketplace/verification/types.ts:163](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/modules/tool-marketplace/verification/types.ts#L163) |
| <a id="exposeheaders"></a> `exposeHeaders` | `string`[] | [defi/protocols/src/modules/tool-marketplace/verification/types.ts:166](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/modules/tool-marketplace/verification/types.ts#L166) |
| <a id="issues"></a> `issues` | `string`[] | [defi/protocols/src/modules/tool-marketplace/verification/types.ts:169](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/modules/tool-marketplace/verification/types.ts#L169) |
| <a id="maxage"></a> `maxAge` | `number` | [defi/protocols/src/modules/tool-marketplace/verification/types.ts:168](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/modules/tool-marketplace/verification/types.ts#L168) |

***

### DomainInfo

Defined in: [defi/protocols/src/modules/tool-marketplace/verification/types.ts:148](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/modules/tool-marketplace/verification/types.ts#L148)

Domain reputation info

#### Properties

| Property | Type | Defined in |
| :------ | :------ | :------ |
| <a id="blacklisted"></a> `blacklisted` | `boolean` | [defi/protocols/src/modules/tool-marketplace/verification/types.ts:154](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/modules/tool-marketplace/verification/types.ts#L154) |
| <a id="domain"></a> `domain` | `string` | [defi/protocols/src/modules/tool-marketplace/verification/types.ts:149](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/modules/tool-marketplace/verification/types.ts#L149) |
| <a id="malware"></a> `malware` | `boolean` | [defi/protocols/src/modules/tool-marketplace/verification/types.ts:156](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/modules/tool-marketplace/verification/types.ts#L156) |
| <a id="phishing"></a> `phishing` | `boolean` | [defi/protocols/src/modules/tool-marketplace/verification/types.ts:155](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/modules/tool-marketplace/verification/types.ts#L155) |
| <a id="registeredat"></a> `registeredAt?` | `number` | [defi/protocols/src/modules/tool-marketplace/verification/types.ts:150](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/modules/tool-marketplace/verification/types.ts#L150) |
| <a id="registrar"></a> `registrar?` | `string` | [defi/protocols/src/modules/tool-marketplace/verification/types.ts:151](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/modules/tool-marketplace/verification/types.ts#L151) |
| <a id="reputation"></a> `reputation` | `"unknown"` \| `"neutral"` \| `"malicious"` \| `"good"` \| `"suspicious"` | [defi/protocols/src/modules/tool-marketplace/verification/types.ts:152](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/modules/tool-marketplace/verification/types.ts#L152) |
| <a id="trustscore"></a> `trustScore` | `number` | [defi/protocols/src/modules/tool-marketplace/verification/types.ts:153](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/modules/tool-marketplace/verification/types.ts#L153) |

***

### EndpointCheckResult

Defined in: [defi/protocols/src/modules/tool-marketplace/verification/types.ts:40](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/modules/tool-marketplace/verification/types.ts#L40)

Endpoint check result

#### Properties

| Property | Type | Defined in |
| :------ | :------ | :------ |
| <a id="endpoint"></a> `endpoint` | `string` | [defi/protocols/src/modules/tool-marketplace/verification/types.ts:42](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/modules/tool-marketplace/verification/types.ts#L42) |
| <a id="error"></a> `error?` | `string` | [defi/protocols/src/modules/tool-marketplace/verification/types.ts:48](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/modules/tool-marketplace/verification/types.ts#L48) |
| <a id="responsetime"></a> `responseTime` | `number` | [defi/protocols/src/modules/tool-marketplace/verification/types.ts:46](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/modules/tool-marketplace/verification/types.ts#L46) |
| <a id="ssl"></a> `ssl` | \| [`SSLCertificateInfo`](/docs/api/defi/protocols/src/modules/tool-marketplace/verification/types.md#sslcertificateinfo) \| `null` | [defi/protocols/src/modules/tool-marketplace/verification/types.ts:47](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/modules/tool-marketplace/verification/types.ts#L47) |
| <a id="status"></a> `status` | [`EndpointHealthStatus`](/docs/api/defi/protocols/src/modules/tool-marketplace/verification/types.md#endpointhealthstatus) | [defi/protocols/src/modules/tool-marketplace/verification/types.ts:44](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/modules/tool-marketplace/verification/types.ts#L44) |
| <a id="statuscode"></a> `statusCode` | `number` \| `null` | [defi/protocols/src/modules/tool-marketplace/verification/types.ts:45](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/modules/tool-marketplace/verification/types.ts#L45) |
| <a id="timestamp"></a> `timestamp` | `number` | [defi/protocols/src/modules/tool-marketplace/verification/types.ts:43](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/modules/tool-marketplace/verification/types.ts#L43) |
| <a id="toolid"></a> `toolId` | `string` | [defi/protocols/src/modules/tool-marketplace/verification/types.ts:41](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/modules/tool-marketplace/verification/types.ts#L41) |
| <a id="validresponse"></a> `validResponse` | `boolean` | [defi/protocols/src/modules/tool-marketplace/verification/types.ts:49](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/modules/tool-marketplace/verification/types.ts#L49) |

***

### RedirectInfo

Defined in: [defi/protocols/src/modules/tool-marketplace/verification/types.ts:175](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/modules/tool-marketplace/verification/types.ts#L175)

Redirect info

#### Properties

| Property | Type | Defined in |
| :------ | :------ | :------ |
| <a id="from"></a> `from` | `string` | [defi/protocols/src/modules/tool-marketplace/verification/types.ts:176](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/modules/tool-marketplace/verification/types.ts#L176) |
| <a id="reason"></a> `reason?` | `string` | [defi/protocols/src/modules/tool-marketplace/verification/types.ts:180](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/modules/tool-marketplace/verification/types.ts#L180) |
| <a id="statuscode-1"></a> `statusCode` | `number` | [defi/protocols/src/modules/tool-marketplace/verification/types.ts:178](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/modules/tool-marketplace/verification/types.ts#L178) |
| <a id="suspicious"></a> `suspicious` | `boolean` | [defi/protocols/src/modules/tool-marketplace/verification/types.ts:179](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/modules/tool-marketplace/verification/types.ts#L179) |
| <a id="to"></a> `to` | `string` | [defi/protocols/src/modules/tool-marketplace/verification/types.ts:177](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/modules/tool-marketplace/verification/types.ts#L177) |

***

### SchemaError

Defined in: [defi/protocols/src/modules/tool-marketplace/verification/types.ts:83](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/modules/tool-marketplace/verification/types.ts#L83)

Schema error detail

#### Properties

| Property | Type | Defined in |
| :------ | :------ | :------ |
| <a id="actualtype"></a> `actualType?` | `string` | [defi/protocols/src/modules/tool-marketplace/verification/types.ts:88](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/modules/tool-marketplace/verification/types.ts#L88) |
| <a id="expectedtype"></a> `expectedType?` | `string` | [defi/protocols/src/modules/tool-marketplace/verification/types.ts:87](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/modules/tool-marketplace/verification/types.ts#L87) |
| <a id="keyword"></a> `keyword` | `string` | [defi/protocols/src/modules/tool-marketplace/verification/types.ts:86](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/modules/tool-marketplace/verification/types.ts#L86) |
| <a id="message"></a> `message` | `string` | [defi/protocols/src/modules/tool-marketplace/verification/types.ts:85](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/modules/tool-marketplace/verification/types.ts#L85) |
| <a id="path"></a> `path` | `string` | [defi/protocols/src/modules/tool-marketplace/verification/types.ts:84](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/modules/tool-marketplace/verification/types.ts#L84) |

***

### SchemaValidationResult

Defined in: [defi/protocols/src/modules/tool-marketplace/verification/types.ts:70](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/modules/tool-marketplace/verification/types.ts#L70)

Schema validation result

#### Properties

| Property | Type | Defined in |
| :------ | :------ | :------ |
| <a id="errors"></a> `errors` | [`SchemaError`](/docs/api/defi/protocols/src/modules/tool-marketplace/verification/types.md#schemaerror)[] | [defi/protocols/src/modules/tool-marketplace/verification/types.ts:76](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/modules/tool-marketplace/verification/types.ts#L76) |
| <a id="schematype"></a> `schemaType` | `"custom"` \| `"openapi"` \| `"jsonschema"` | [defi/protocols/src/modules/tool-marketplace/verification/types.ts:74](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/modules/tool-marketplace/verification/types.ts#L74) |
| <a id="schemaversion"></a> `schemaVersion?` | `string` | [defi/protocols/src/modules/tool-marketplace/verification/types.ts:75](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/modules/tool-marketplace/verification/types.ts#L75) |
| <a id="timestamp-1"></a> `timestamp` | `number` | [defi/protocols/src/modules/tool-marketplace/verification/types.ts:72](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/modules/tool-marketplace/verification/types.ts#L72) |
| <a id="toolid-1"></a> `toolId` | `string` | [defi/protocols/src/modules/tool-marketplace/verification/types.ts:71](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/modules/tool-marketplace/verification/types.ts#L71) |
| <a id="valid"></a> `valid` | `boolean` | [defi/protocols/src/modules/tool-marketplace/verification/types.ts:73](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/modules/tool-marketplace/verification/types.ts#L73) |
| <a id="warnings"></a> `warnings` | [`SchemaWarning`](/docs/api/defi/protocols/src/modules/tool-marketplace/verification/types.md#schemawarning)[] | [defi/protocols/src/modules/tool-marketplace/verification/types.ts:77](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/modules/tool-marketplace/verification/types.ts#L77) |

***

### SchemaWarning

Defined in: [defi/protocols/src/modules/tool-marketplace/verification/types.ts:94](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/modules/tool-marketplace/verification/types.ts#L94)

Schema warning

#### Properties

| Property | Type | Defined in |
| :------ | :------ | :------ |
| <a id="message-1"></a> `message` | `string` | [defi/protocols/src/modules/tool-marketplace/verification/types.ts:96](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/modules/tool-marketplace/verification/types.ts#L96) |
| <a id="path-1"></a> `path` | `string` | [defi/protocols/src/modules/tool-marketplace/verification/types.ts:95](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/modules/tool-marketplace/verification/types.ts#L95) |
| <a id="suggestion"></a> `suggestion?` | `string` | [defi/protocols/src/modules/tool-marketplace/verification/types.ts:97](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/modules/tool-marketplace/verification/types.ts#L97) |

***

### SecurityFinding

Defined in: [defi/protocols/src/modules/tool-marketplace/verification/types.ts:121](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/modules/tool-marketplace/verification/types.ts#L121)

Security finding

#### Properties

| Property | Type | Defined in |
| :------ | :------ | :------ |
| <a id="category"></a> `category` | `string` | [defi/protocols/src/modules/tool-marketplace/verification/types.ts:124](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/modules/tool-marketplace/verification/types.ts#L124) |
| <a id="cwe"></a> `cwe?` | `string` | [defi/protocols/src/modules/tool-marketplace/verification/types.ts:128](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/modules/tool-marketplace/verification/types.ts#L128) |
| <a id="description"></a> `description` | `string` | [defi/protocols/src/modules/tool-marketplace/verification/types.ts:126](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/modules/tool-marketplace/verification/types.ts#L126) |
| <a id="id"></a> `id` | `string` | [defi/protocols/src/modules/tool-marketplace/verification/types.ts:122](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/modules/tool-marketplace/verification/types.ts#L122) |
| <a id="remediation"></a> `remediation?` | `string` | [defi/protocols/src/modules/tool-marketplace/verification/types.ts:127](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/modules/tool-marketplace/verification/types.ts#L127) |
| <a id="severity"></a> `severity` | [`SecuritySeverity`](/docs/api/defi/protocols/src/modules/tool-marketplace/verification/types.md#securityseverity) | [defi/protocols/src/modules/tool-marketplace/verification/types.ts:123](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/modules/tool-marketplace/verification/types.ts#L123) |
| <a id="title"></a> `title` | `string` | [defi/protocols/src/modules/tool-marketplace/verification/types.ts:125](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/modules/tool-marketplace/verification/types.ts#L125) |

***

### SecurityScanResult

Defined in: [defi/protocols/src/modules/tool-marketplace/verification/types.ts:134](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/modules/tool-marketplace/verification/types.ts#L134)

Security scan result

#### Properties

| Property | Type | Defined in |
| :------ | :------ | :------ |
| <a id="corspolicy-1"></a> `corsPolicy` | \| [`CORSPolicy`](/docs/api/defi/protocols/src/modules/tool-marketplace/verification/types.md#corspolicy) \| `null` | [defi/protocols/src/modules/tool-marketplace/verification/types.ts:141](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/modules/tool-marketplace/verification/types.ts#L141) |
| <a id="domaininfo-1"></a> `domainInfo` | [`DomainInfo`](/docs/api/defi/protocols/src/modules/tool-marketplace/verification/types.md#domaininfo) | [defi/protocols/src/modules/tool-marketplace/verification/types.ts:140](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/modules/tool-marketplace/verification/types.ts#L140) |
| <a id="findings"></a> `findings` | [`SecurityFinding`](/docs/api/defi/protocols/src/modules/tool-marketplace/verification/types.md#securityfinding)[] | [defi/protocols/src/modules/tool-marketplace/verification/types.ts:139](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/modules/tool-marketplace/verification/types.ts#L139) |
| <a id="passed"></a> `passed` | `boolean` | [defi/protocols/src/modules/tool-marketplace/verification/types.ts:137](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/modules/tool-marketplace/verification/types.ts#L137) |
| <a id="redirects"></a> `redirects` | [`RedirectInfo`](/docs/api/defi/protocols/src/modules/tool-marketplace/verification/types.md#redirectinfo)[] | [defi/protocols/src/modules/tool-marketplace/verification/types.ts:142](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/modules/tool-marketplace/verification/types.ts#L142) |
| <a id="score"></a> `score` | `number` | [defi/protocols/src/modules/tool-marketplace/verification/types.ts:138](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/modules/tool-marketplace/verification/types.ts#L138) |
| <a id="timestamp-2"></a> `timestamp` | `number` | [defi/protocols/src/modules/tool-marketplace/verification/types.ts:136](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/modules/tool-marketplace/verification/types.ts#L136) |
| <a id="toolid-2"></a> `toolId` | `string` | [defi/protocols/src/modules/tool-marketplace/verification/types.ts:135](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/modules/tool-marketplace/verification/types.ts#L135) |

***

### SSLCertificateInfo

Defined in: [defi/protocols/src/modules/tool-marketplace/verification/types.ts:28](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/modules/tool-marketplace/verification/types.ts#L28)

SSL certificate info

#### Properties

| Property | Type | Defined in |
| :------ | :------ | :------ |
| <a id="daysuntilexpiry"></a> `daysUntilExpiry` | `number` | [defi/protocols/src/modules/tool-marketplace/verification/types.ts:33](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/modules/tool-marketplace/verification/types.ts#L33) |
| <a id="expiresat"></a> `expiresAt` | `number` | [defi/protocols/src/modules/tool-marketplace/verification/types.ts:32](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/modules/tool-marketplace/verification/types.ts#L32) |
| <a id="grade"></a> `grade?` | `"A"` \| `"B"` \| `"C"` \| `"D"` \| `"F"` | [defi/protocols/src/modules/tool-marketplace/verification/types.ts:34](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/modules/tool-marketplace/verification/types.ts#L34) |
| <a id="issuer"></a> `issuer` | `string` | [defi/protocols/src/modules/tool-marketplace/verification/types.ts:30](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/modules/tool-marketplace/verification/types.ts#L30) |
| <a id="subject"></a> `subject` | `string` | [defi/protocols/src/modules/tool-marketplace/verification/types.ts:31](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/modules/tool-marketplace/verification/types.ts#L31) |
| <a id="valid-1"></a> `valid` | `boolean` | [defi/protocols/src/modules/tool-marketplace/verification/types.ts:29](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/modules/tool-marketplace/verification/types.ts#L29) |

***

### ToolBadges

Defined in: [defi/protocols/src/modules/tool-marketplace/verification/types.ts:229](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/modules/tool-marketplace/verification/types.ts#L229)

Tool badges collection

#### Properties

| Property | Type | Defined in |
| :------ | :------ | :------ |
| <a id="badges"></a> `badges` | [`VerificationBadge`](/docs/api/defi/protocols/src/modules/tool-marketplace/verification/types.md#verificationbadge)[] | [defi/protocols/src/modules/tool-marketplace/verification/types.ts:231](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/modules/tool-marketplace/verification/types.ts#L231) |
| <a id="lastupdated"></a> `lastUpdated` | `number` | [defi/protocols/src/modules/tool-marketplace/verification/types.ts:232](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/modules/tool-marketplace/verification/types.ts#L232) |
| <a id="toolid-3"></a> `toolId` | `string` | [defi/protocols/src/modules/tool-marketplace/verification/types.ts:230](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/modules/tool-marketplace/verification/types.ts#L230) |

***

### ToolSchema

Defined in: [defi/protocols/src/modules/tool-marketplace/verification/types.ts:103](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/modules/tool-marketplace/verification/types.ts#L103)

Tool declared schema

#### Properties

| Property | Type | Defined in |
| :------ | :------ | :------ |
| <a id="declaredat"></a> `declaredAt` | `number` | [defi/protocols/src/modules/tool-marketplace/verification/types.ts:108](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/modules/tool-marketplace/verification/types.ts#L108) |
| <a id="lastvalidated"></a> `lastValidated?` | `number` | [defi/protocols/src/modules/tool-marketplace/verification/types.ts:109](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/modules/tool-marketplace/verification/types.ts#L109) |
| <a id="schema"></a> `schema` | `Record`\<`string`, `unknown`\> | [defi/protocols/src/modules/tool-marketplace/verification/types.ts:107](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/modules/tool-marketplace/verification/types.ts#L107) |
| <a id="toolid-4"></a> `toolId` | `string` | [defi/protocols/src/modules/tool-marketplace/verification/types.ts:104](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/modules/tool-marketplace/verification/types.ts#L104) |
| <a id="type"></a> `type` | `"custom"` \| `"openapi"` \| `"jsonschema"` | [defi/protocols/src/modules/tool-marketplace/verification/types.ts:105](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/modules/tool-marketplace/verification/types.ts#L105) |
| <a id="validationhistory"></a> `validationHistory` | [`SchemaValidationResult`](/docs/api/defi/protocols/src/modules/tool-marketplace/verification/types.md#schemavalidationresult)[] | [defi/protocols/src/modules/tool-marketplace/verification/types.ts:110](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/modules/tool-marketplace/verification/types.ts#L110) |
| <a id="version"></a> `version?` | `string` | [defi/protocols/src/modules/tool-marketplace/verification/types.ts:106](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/modules/tool-marketplace/verification/types.ts#L106) |

***

### UptimeRecord

Defined in: [defi/protocols/src/modules/tool-marketplace/verification/types.ts:55](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/modules/tool-marketplace/verification/types.ts#L55)

Uptime record for a tool

#### Properties

| Property | Type | Defined in |
| :------ | :------ | :------ |
| <a id="avgresponsetime"></a> `avgResponseTime` | `number` | [defi/protocols/src/modules/tool-marketplace/verification/types.ts:61](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/modules/tool-marketplace/verification/types.ts#L61) |
| <a id="lastchecked"></a> `lastChecked` | `number` | [defi/protocols/src/modules/tool-marketplace/verification/types.ts:64](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/modules/tool-marketplace/verification/types.ts#L64) |
| <a id="maxresponsetime"></a> `maxResponseTime` | `number` | [defi/protocols/src/modules/tool-marketplace/verification/types.ts:63](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/modules/tool-marketplace/verification/types.ts#L63) |
| <a id="minresponsetime"></a> `minResponseTime` | `number` | [defi/protocols/src/modules/tool-marketplace/verification/types.ts:62](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/modules/tool-marketplace/verification/types.ts#L62) |
| <a id="period"></a> `period` | `"day"` \| `"week"` \| `"month"` \| `"hour"` | [defi/protocols/src/modules/tool-marketplace/verification/types.ts:57](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/modules/tool-marketplace/verification/types.ts#L57) |
| <a id="successfulchecks"></a> `successfulChecks` | `number` | [defi/protocols/src/modules/tool-marketplace/verification/types.ts:59](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/modules/tool-marketplace/verification/types.ts#L59) |
| <a id="toolid-5"></a> `toolId` | `string` | [defi/protocols/src/modules/tool-marketplace/verification/types.ts:56](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/modules/tool-marketplace/verification/types.ts#L56) |
| <a id="totalchecks"></a> `totalChecks` | `number` | [defi/protocols/src/modules/tool-marketplace/verification/types.ts:58](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/modules/tool-marketplace/verification/types.ts#L58) |
| <a id="uptimepercent"></a> `uptimePercent` | `number` | [defi/protocols/src/modules/tool-marketplace/verification/types.ts:60](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/modules/tool-marketplace/verification/types.ts#L60) |

***

### VerificationBadge

Defined in: [defi/protocols/src/modules/tool-marketplace/verification/types.ts:210](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/modules/tool-marketplace/verification/types.ts#L210)

Verification badge

#### Properties

| Property | Type | Defined in |
| :------ | :------ | :------ |
| <a id="earnedat"></a> `earnedAt` | `number` | [defi/protocols/src/modules/tool-marketplace/verification/types.ts:221](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/modules/tool-marketplace/verification/types.ts#L221) |
| <a id="expiresat-1"></a> `expiresAt?` | `number` | [defi/protocols/src/modules/tool-marketplace/verification/types.ts:222](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/modules/tool-marketplace/verification/types.ts#L222) |
| <a id="icon"></a> `icon` | `string` | [defi/protocols/src/modules/tool-marketplace/verification/types.ts:220](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/modules/tool-marketplace/verification/types.ts#L220) |
| <a id="label"></a> `label` | `string` | [defi/protocols/src/modules/tool-marketplace/verification/types.ts:219](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/modules/tool-marketplace/verification/types.ts#L219) |
| <a id="metadata"></a> `metadata?` | `Record`\<`string`, `unknown`\> | [defi/protocols/src/modules/tool-marketplace/verification/types.ts:223](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/modules/tool-marketplace/verification/types.ts#L223) |
| <a id="type-1"></a> `type` | \| `"premium"` \| `"trending"` \| `"high_volume"` \| `"top_rated"` \| `"new"` \| `"security_audited"` \| `"verified_endpoint"` | [defi/protocols/src/modules/tool-marketplace/verification/types.ts:211](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/modules/tool-marketplace/verification/types.ts#L211) |

***

### VerificationHistoryEntry

Defined in: [defi/protocols/src/modules/tool-marketplace/verification/types.ts:200](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/modules/tool-marketplace/verification/types.ts#L200)

Verification history entry

#### Properties

| Property | Type | Defined in |
| :------ | :------ | :------ |
| <a id="details"></a> `details?` | `string` | [defi/protocols/src/modules/tool-marketplace/verification/types.ts:204](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/modules/tool-marketplace/verification/types.ts#L204) |
| <a id="status-1"></a> `status` | [`VerificationStatus`](/docs/api/defi/protocols/src/modules/tool-marketplace/verification/types.md#verificationstatus) | [defi/protocols/src/modules/tool-marketplace/verification/types.ts:203](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/modules/tool-marketplace/verification/types.ts#L203) |
| <a id="timestamp-3"></a> `timestamp` | `number` | [defi/protocols/src/modules/tool-marketplace/verification/types.ts:201](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/modules/tool-marketplace/verification/types.ts#L201) |
| <a id="type-2"></a> `type` | `"full"` \| `"security"` \| `"endpoint"` \| `"schema"` | [defi/protocols/src/modules/tool-marketplace/verification/types.ts:202](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/modules/tool-marketplace/verification/types.ts#L202) |

***

### VerificationJob

Defined in: [defi/protocols/src/modules/tool-marketplace/verification/types.ts:253](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/modules/tool-marketplace/verification/types.ts#L253)

Verification queue job

#### Properties

| Property | Type | Defined in |
| :------ | :------ | :------ |
| <a id="attempts"></a> `attempts` | `number` | [defi/protocols/src/modules/tool-marketplace/verification/types.ts:259](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/modules/tool-marketplace/verification/types.ts#L259) |
| <a id="jobid"></a> `jobId` | `string` | [defi/protocols/src/modules/tool-marketplace/verification/types.ts:254](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/modules/tool-marketplace/verification/types.ts#L254) |
| <a id="lasterror"></a> `lastError?` | `string` | [defi/protocols/src/modules/tool-marketplace/verification/types.ts:261](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/modules/tool-marketplace/verification/types.ts#L261) |
| <a id="maxattempts"></a> `maxAttempts` | `number` | [defi/protocols/src/modules/tool-marketplace/verification/types.ts:260](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/modules/tool-marketplace/verification/types.ts#L260) |
| <a id="priority"></a> `priority` | `number` | [defi/protocols/src/modules/tool-marketplace/verification/types.ts:257](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/modules/tool-marketplace/verification/types.ts#L257) |
| <a id="scheduledat"></a> `scheduledAt` | `number` | [defi/protocols/src/modules/tool-marketplace/verification/types.ts:258](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/modules/tool-marketplace/verification/types.ts#L258) |
| <a id="toolid-6"></a> `toolId` | `string` | [defi/protocols/src/modules/tool-marketplace/verification/types.ts:255](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/modules/tool-marketplace/verification/types.ts#L255) |
| <a id="type-3"></a> `type` | `"full"` \| `"security"` \| `"endpoint"` \| `"schema"` | [defi/protocols/src/modules/tool-marketplace/verification/types.ts:256](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/modules/tool-marketplace/verification/types.ts#L256) |

***

### VerificationRecord

Defined in: [defi/protocols/src/modules/tool-marketplace/verification/types.ts:186](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/modules/tool-marketplace/verification/types.ts#L186)

Full verification record

#### Properties

| Property | Type | Defined in |
| :------ | :------ | :------ |
| <a id="endpointcheck"></a> `endpointCheck` | \| [`EndpointCheckResult`](/docs/api/defi/protocols/src/modules/tool-marketplace/verification/types.md#endpointcheckresult) \| `null` | [defi/protocols/src/modules/tool-marketplace/verification/types.ts:189](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/modules/tool-marketplace/verification/types.ts#L189) |
| <a id="history"></a> `history` | [`VerificationHistoryEntry`](/docs/api/defi/protocols/src/modules/tool-marketplace/verification/types.md#verificationhistoryentry)[] | [defi/protocols/src/modules/tool-marketplace/verification/types.ts:194](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/modules/tool-marketplace/verification/types.ts#L194) |
| <a id="lastverified"></a> `lastVerified` | `number` | [defi/protocols/src/modules/tool-marketplace/verification/types.ts:192](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/modules/tool-marketplace/verification/types.ts#L192) |
| <a id="nextverification"></a> `nextVerification` | `number` | [defi/protocols/src/modules/tool-marketplace/verification/types.ts:193](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/modules/tool-marketplace/verification/types.ts#L193) |
| <a id="schemavalidation"></a> `schemaValidation` | \| [`SchemaValidationResult`](/docs/api/defi/protocols/src/modules/tool-marketplace/verification/types.md#schemavalidationresult) \| `null` | [defi/protocols/src/modules/tool-marketplace/verification/types.ts:190](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/modules/tool-marketplace/verification/types.ts#L190) |
| <a id="securityscan"></a> `securityScan` | \| [`SecurityScanResult`](/docs/api/defi/protocols/src/modules/tool-marketplace/verification/types.md#securityscanresult) \| `null` | [defi/protocols/src/modules/tool-marketplace/verification/types.ts:191](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/modules/tool-marketplace/verification/types.ts#L191) |
| <a id="status-2"></a> `status` | [`VerificationStatus`](/docs/api/defi/protocols/src/modules/tool-marketplace/verification/types.md#verificationstatus) | [defi/protocols/src/modules/tool-marketplace/verification/types.ts:188](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/modules/tool-marketplace/verification/types.ts#L188) |
| <a id="toolid-7"></a> `toolId` | `string` | [defi/protocols/src/modules/tool-marketplace/verification/types.ts:187](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/modules/tool-marketplace/verification/types.ts#L187) |

***

### VerificationRequest

Defined in: [defi/protocols/src/modules/tool-marketplace/verification/types.ts:238](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/modules/tool-marketplace/verification/types.ts#L238)

Verification request

#### Properties

| Property | Type | Defined in |
| :------ | :------ | :------ |
| <a id="completedat"></a> `completedAt?` | `number` | [defi/protocols/src/modules/tool-marketplace/verification/types.ts:246](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/modules/tool-marketplace/verification/types.ts#L246) |
| <a id="id-1"></a> `id` | `string` | [defi/protocols/src/modules/tool-marketplace/verification/types.ts:239](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/modules/tool-marketplace/verification/types.ts#L239) |
| <a id="priority-1"></a> `priority` | `"low"` \| `"high"` \| `"normal"` | [defi/protocols/src/modules/tool-marketplace/verification/types.ts:244](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/modules/tool-marketplace/verification/types.ts#L244) |
| <a id="requestedat"></a> `requestedAt` | `number` | [defi/protocols/src/modules/tool-marketplace/verification/types.ts:242](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/modules/tool-marketplace/verification/types.ts#L242) |
| <a id="requestedby"></a> `requestedBy` | `` `0x${string}` `` | [defi/protocols/src/modules/tool-marketplace/verification/types.ts:241](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/modules/tool-marketplace/verification/types.ts#L241) |
| <a id="result"></a> `result?` | [`VerificationRecord`](/docs/api/defi/protocols/src/modules/tool-marketplace/verification/types.md#verificationrecord) | [defi/protocols/src/modules/tool-marketplace/verification/types.ts:247](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/modules/tool-marketplace/verification/types.ts#L247) |
| <a id="status-3"></a> `status` | `"failed"` \| `"queued"` \| `"processing"` \| `"completed"` | [defi/protocols/src/modules/tool-marketplace/verification/types.ts:245](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/modules/tool-marketplace/verification/types.ts#L245) |
| <a id="toolid-8"></a> `toolId` | `string` | [defi/protocols/src/modules/tool-marketplace/verification/types.ts:240](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/modules/tool-marketplace/verification/types.ts#L240) |
| <a id="type-4"></a> `type` | `"automatic"` \| `"manual"` | [defi/protocols/src/modules/tool-marketplace/verification/types.ts:243](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/modules/tool-marketplace/verification/types.ts#L243) |

***

### VerificationWebhook

Defined in: [defi/protocols/src/modules/tool-marketplace/verification/types.ts:267](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/modules/tool-marketplace/verification/types.ts#L267)

Webhook notification for verification events

#### Properties

| Property | Type | Defined in |
| :------ | :------ | :------ |
| <a id="active"></a> `active` | `boolean` | [defi/protocols/src/modules/tool-marketplace/verification/types.ts:274](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/modules/tool-marketplace/verification/types.ts#L274) |
| <a id="createdat"></a> `createdAt` | `number` | [defi/protocols/src/modules/tool-marketplace/verification/types.ts:275](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/modules/tool-marketplace/verification/types.ts#L275) |
| <a id="events"></a> `events` | [`VerificationEventType`](/docs/api/defi/protocols/src/modules/tool-marketplace/verification/types.md#verificationeventtype)[] | [defi/protocols/src/modules/tool-marketplace/verification/types.ts:272](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/modules/tool-marketplace/verification/types.ts#L272) |
| <a id="id-2"></a> `id` | `string` | [defi/protocols/src/modules/tool-marketplace/verification/types.ts:268](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/modules/tool-marketplace/verification/types.ts#L268) |
| <a id="owneraddress"></a> `ownerAddress` | `` `0x${string}` `` | [defi/protocols/src/modules/tool-marketplace/verification/types.ts:270](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/modules/tool-marketplace/verification/types.ts#L270) |
| <a id="secret"></a> `secret` | `string` | [defi/protocols/src/modules/tool-marketplace/verification/types.ts:273](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/modules/tool-marketplace/verification/types.ts#L273) |
| <a id="toolid-9"></a> `toolId` | `string` | [defi/protocols/src/modules/tool-marketplace/verification/types.ts:269](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/modules/tool-marketplace/verification/types.ts#L269) |
| <a id="webhookurl"></a> `webhookUrl` | `string` | [defi/protocols/src/modules/tool-marketplace/verification/types.ts:271](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/modules/tool-marketplace/verification/types.ts#L271) |

## Type Aliases

### EndpointHealthStatus

```ts
type EndpointHealthStatus = "healthy" | "degraded" | "down" | "unknown";
```

Defined in: [defi/protocols/src/modules/tool-marketplace/verification/types.ts:23](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/modules/tool-marketplace/verification/types.ts#L23)

Endpoint health status

***

### SecuritySeverity

```ts
type SecuritySeverity = "critical" | "high" | "medium" | "low" | "info";
```

Defined in: [defi/protocols/src/modules/tool-marketplace/verification/types.ts:116](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/modules/tool-marketplace/verification/types.ts#L116)

Security scan severity levels

***

### VerificationEventType

```ts
type VerificationEventType = 
  | "verification.started"
  | "verification.completed"
  | "verification.failed"
  | "endpoint.down"
  | "endpoint.recovered"
  | "schema.violation"
  | "security.issue"
  | "badge.earned"
  | "badge.lost";
```

Defined in: [defi/protocols/src/modules/tool-marketplace/verification/types.ts:281](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/modules/tool-marketplace/verification/types.ts#L281)

Verification event types for webhooks

***

### VerificationStatus

```ts
type VerificationStatus = "pending" | "verified" | "failed" | "expired" | "suspended";
```

Defined in: [defi/protocols/src/modules/tool-marketplace/verification/types.ts:13](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/modules/tool-marketplace/verification/types.ts#L13)

Verification status levels
