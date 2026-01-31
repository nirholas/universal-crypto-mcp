[**Universal Crypto MCP API Reference v1.0.0**](../../../../index.md)

***

[Universal Crypto MCP API Reference](/docs/api/index.md) / defi/protocols/src/hosting/types

# defi/protocols/src/hosting/types

## Interfaces

### HostedMCPPrompt

Defined in: [defi/protocols/src/hosting/types.ts:77](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/hosting/types.ts#L77)

#### Properties

| Property | Type | Defined in |
| :------ | :------ | :------ |
| <a id="arguments"></a> `arguments` | \{ `description`: `string`; `name`: `string`; `required`: `boolean`; \}[] | [defi/protocols/src/hosting/types.ts:82](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/hosting/types.ts#L82) |
| <a id="description"></a> `description` | `string` | [defi/protocols/src/hosting/types.ts:80](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/hosting/types.ts#L80) |
| <a id="enabled"></a> `enabled` | `boolean` | [defi/protocols/src/hosting/types.ts:88](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/hosting/types.ts#L88) |
| <a id="id"></a> `id` | `string` | [defi/protocols/src/hosting/types.ts:78](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/hosting/types.ts#L78) |
| <a id="name"></a> `name` | `string` | [defi/protocols/src/hosting/types.ts:79](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/hosting/types.ts#L79) |
| <a id="price"></a> `price` | `number` | [defi/protocols/src/hosting/types.ts:87](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/hosting/types.ts#L87) |
| <a id="template"></a> `template` | `string` | [defi/protocols/src/hosting/types.ts:81](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/hosting/types.ts#L81) |

***

### HostedMCPResource

Defined in: [defi/protocols/src/hosting/types.ts:91](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/hosting/types.ts#L91)

#### Properties

| Property | Type | Defined in |
| :------ | :------ | :------ |
| <a id="content"></a> `content?` | `string` | [defi/protocols/src/hosting/types.ts:100](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/hosting/types.ts#L100) |
| <a id="description-1"></a> `description` | `string` | [defi/protocols/src/hosting/types.ts:95](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/hosting/types.ts#L95) |
| <a id="enabled-1"></a> `enabled` | `boolean` | [defi/protocols/src/hosting/types.ts:104](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/hosting/types.ts#L104) |
| <a id="endpoint"></a> `endpoint?` | `string` | [defi/protocols/src/hosting/types.ts:101](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/hosting/types.ts#L101) |
| <a id="id-1"></a> `id` | `string` | [defi/protocols/src/hosting/types.ts:92](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/hosting/types.ts#L92) |
| <a id="mimetype"></a> `mimeType` | `string` | [defi/protocols/src/hosting/types.ts:96](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/hosting/types.ts#L96) |
| <a id="name-1"></a> `name` | `string` | [defi/protocols/src/hosting/types.ts:94](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/hosting/types.ts#L94) |
| <a id="price-1"></a> `price` | `number` | [defi/protocols/src/hosting/types.ts:103](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/hosting/types.ts#L103) |
| <a id="type"></a> `type` | `"proxy"` \| `"static"` \| `"dynamic"` | [defi/protocols/src/hosting/types.ts:99](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/hosting/types.ts#L99) |
| <a id="uri"></a> `uri` | `string` | [defi/protocols/src/hosting/types.ts:93](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/hosting/types.ts#L93) |

***

### HostedMCPServer

Defined in: [defi/protocols/src/hosting/types.ts:27](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/hosting/types.ts#L27)

#### Properties

| Property | Type | Defined in |
| :------ | :------ | :------ |
| <a id="callsthismonth"></a> `callsThisMonth` | `number` | [defi/protocols/src/hosting/types.ts:47](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/hosting/types.ts#L47) |
| <a id="createdat"></a> `createdAt` | `Date` | [defi/protocols/src/hosting/types.ts:49](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/hosting/types.ts#L49) |
| <a id="customdomain"></a> `customDomain?` | `string` | [defi/protocols/src/hosting/types.ts:33](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/hosting/types.ts#L33) |
| <a id="description-2"></a> `description` | `string` | [defi/protocols/src/hosting/types.ts:31](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/hosting/types.ts#L31) |
| <a id="id-2"></a> `id` | `string` | [defi/protocols/src/hosting/types.ts:28](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/hosting/types.ts#L28) |
| <a id="name-2"></a> `name` | `string` | [defi/protocols/src/hosting/types.ts:30](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/hosting/types.ts#L30) |
| <a id="pricing"></a> `pricing` | [`MCPPricingConfig`](/docs/api/defi/protocols/src/hosting/types.md#mcppricingconfig) | [defi/protocols/src/hosting/types.ts:42](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/hosting/types.ts#L42) |
| <a id="prompts"></a> `prompts` | [`HostedMCPPrompt`](/docs/api/defi/protocols/src/hosting/types.md#hostedmcpprompt)[] | [defi/protocols/src/hosting/types.ts:38](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/hosting/types.ts#L38) |
| <a id="resources"></a> `resources` | [`HostedMCPResource`](/docs/api/defi/protocols/src/hosting/types.md#hostedmcpresource)[] | [defi/protocols/src/hosting/types.ts:39](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/hosting/types.ts#L39) |
| <a id="status"></a> `status` | `"active"` \| `"paused"` \| `"suspended"` | [defi/protocols/src/hosting/types.ts:34](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/hosting/types.ts#L34) |
| <a id="subdomain"></a> `subdomain` | `string` | [defi/protocols/src/hosting/types.ts:32](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/hosting/types.ts#L32) |
| <a id="tools"></a> `tools` | [`HostedMCPTool`](/docs/api/defi/protocols/src/hosting/types.md#hostedmcptool)[] | [defi/protocols/src/hosting/types.ts:37](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/hosting/types.ts#L37) |
| <a id="totalcalls"></a> `totalCalls` | `number` | [defi/protocols/src/hosting/types.ts:45](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/hosting/types.ts#L45) |
| <a id="totalrevenue"></a> `totalRevenue` | `number` | [defi/protocols/src/hosting/types.ts:46](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/hosting/types.ts#L46) |
| <a id="updatedat"></a> `updatedAt` | `Date` | [defi/protocols/src/hosting/types.ts:50](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/hosting/types.ts#L50) |
| <a id="userid"></a> `userId` | `string` | [defi/protocols/src/hosting/types.ts:29](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/hosting/types.ts#L29) |

***

### HostedMCPTool

Defined in: [defi/protocols/src/hosting/types.ts:53](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/hosting/types.ts#L53)

#### Properties

| Property | Type | Defined in |
| :------ | :------ | :------ |
| <a id="code"></a> `code?` | `string` | [defi/protocols/src/hosting/types.ts:62](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/hosting/types.ts#L62) |
| <a id="description-3"></a> `description` | `string` | [defi/protocols/src/hosting/types.ts:56](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/hosting/types.ts#L56) |
| <a id="enabled-2"></a> `enabled` | `boolean` | [defi/protocols/src/hosting/types.ts:74](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/hosting/types.ts#L74) |
| <a id="endpoint-1"></a> `endpoint?` | `string` | [defi/protocols/src/hosting/types.ts:61](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/hosting/types.ts#L61) |
| <a id="id-3"></a> `id` | `string` | [defi/protocols/src/hosting/types.ts:54](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/hosting/types.ts#L54) |
| <a id="inputschema"></a> `inputSchema` | `Record`\<`string`, `unknown`\> | [defi/protocols/src/hosting/types.ts:57](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/hosting/types.ts#L57) |
| <a id="name-3"></a> `name` | `string` | [defi/protocols/src/hosting/types.ts:55](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/hosting/types.ts#L55) |
| <a id="price-2"></a> `price` | `number` | [defi/protocols/src/hosting/types.ts:66](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/hosting/types.ts#L66) |
| <a id="proxytarget"></a> `proxyTarget?` | `string` | [defi/protocols/src/hosting/types.ts:63](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/hosting/types.ts#L63) |
| <a id="ratelimit"></a> `rateLimit?` | \{ `requests`: `number`; `window`: `number`; \} | [defi/protocols/src/hosting/types.ts:69](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/hosting/types.ts#L69) |
| `rateLimit.requests` | `number` | [defi/protocols/src/hosting/types.ts:70](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/hosting/types.ts#L70) |
| `rateLimit.window` | `number` | [defi/protocols/src/hosting/types.ts:71](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/hosting/types.ts#L71) |
| <a id="type-1"></a> `type` | `"code"` \| `"http"` \| `"proxy"` | [defi/protocols/src/hosting/types.ts:60](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/hosting/types.ts#L60) |

***

### MCPHostingUser

Defined in: [defi/protocols/src/hosting/types.ts:17](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/hosting/types.ts#L17)

MCP Hosting Platform - "Shopify of MCP"

#### Description

Allow users to create and host their own MCP servers under agenti.cash subdomains

#### Author

nirholas

Business Model:
- Free tier: 1 MCP server, 1000 calls/month, agenti branding
- Pro tier ($29/mo): 5 servers, 50K calls/month, custom branding
- Business tier ($99/mo): Unlimited servers, 500K calls/month, custom domain
- Enterprise: Custom pricing, SLA, dedicated support

Revenue split on x402 payments:
- Creator gets 85%
- Platform gets 15%

#### Properties

| Property | Type | Defined in |
| :------ | :------ | :------ |
| <a id="createdat-1"></a> `createdAt` | `Date` | [defi/protocols/src/hosting/types.ts:22](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/hosting/types.ts#L22) |
| <a id="email"></a> `email` | `string` | [defi/protocols/src/hosting/types.ts:19](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/hosting/types.ts#L19) |
| <a id="id-4"></a> `id` | `string` | [defi/protocols/src/hosting/types.ts:18](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/hosting/types.ts#L18) |
| <a id="stripecustomerid"></a> `stripeCustomerId?` | `string` | [defi/protocols/src/hosting/types.ts:23](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/hosting/types.ts#L23) |
| <a id="stripesubscriptionid"></a> `stripeSubscriptionId?` | `string` | [defi/protocols/src/hosting/types.ts:24](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/hosting/types.ts#L24) |
| <a id="tier"></a> `tier` | `"free"` \| `"pro"` \| `"business"` \| `"enterprise"` | [defi/protocols/src/hosting/types.ts:21](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/hosting/types.ts#L21) |
| <a id="username"></a> `username` | `string` | [defi/protocols/src/hosting/types.ts:20](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/hosting/types.ts#L20) |

***

### MCPPricingConfig

Defined in: [defi/protocols/src/hosting/types.ts:107](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/hosting/types.ts#L107)

#### Properties

| Property | Type | Defined in |
| :------ | :------ | :------ |
| <a id="acceptedpayments"></a> `acceptedPayments` | (`"x402"` \| `"stripe"` \| `"crypto"`)[] | [defi/protocols/src/hosting/types.ts:115](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/hosting/types.ts#L115) |
| <a id="creatorshare"></a> `creatorShare` | `number` | [defi/protocols/src/hosting/types.ts:112](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/hosting/types.ts#L112) |
| <a id="defaulttoolprice"></a> `defaultToolPrice` | `number` | [defi/protocols/src/hosting/types.ts:109](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/hosting/types.ts#L109) |
| <a id="payoutaddress"></a> `payoutAddress?` | `string` | [defi/protocols/src/hosting/types.ts:118](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/hosting/types.ts#L118) |

## Variables

### default

```ts
default: {
  calculatePayout: (toolPrice: number, creatorShare: number) => {
     creatorAmount: number;
     platformAmount: number;
  };
  getServerUrl: (subdomain: string, customDomain?: string) => string;
  isSubdomainAvailable: (subdomain: string) => boolean;
  isValidSubdomain: (subdomain: string) => boolean;
  PLATFORM_FEE_PERCENTAGE: number;
  RESERVED_SUBDOMAINS: string[];
  TIER_LIMITS: {
     business: {
        analytics: string;
        customBranding: boolean;
        customDomain: boolean;
        maxCallsPerMonth: number;
        maxServers: number;
        maxToolsPerServer: number;
        support: string;
     };
     enterprise: {
        analytics: string;
        customBranding: boolean;
        customDomain: boolean;
        maxCallsPerMonth: number;
        maxServers: number;
        maxToolsPerServer: number;
        support: string;
     };
     free: {
        analytics: string;
        customBranding: boolean;
        customDomain: boolean;
        maxCallsPerMonth: number;
        maxServers: number;
        maxToolsPerServer: number;
        support: string;
     };
     pro: {
        analytics: string;
        customBranding: boolean;
        customDomain: boolean;
        maxCallsPerMonth: number;
        maxServers: number;
        maxToolsPerServer: number;
        support: string;
     };
  };
  TIER_PRICING: {
     business: number;
     enterprise: null;
     free: number;
     pro: number;
  };
};
```

Defined in: [defi/protocols/src/hosting/types.ts:226](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/hosting/types.ts#L226)

#### Type Declaration

| Name | Type | Default value | Description | Defined in |
| :------ | :------ | :------ | :------ | :------ |
| <a id="calculatepayout-3"></a> `calculatePayout()` | (`toolPrice`: `number`, `creatorShare`: `number`) => \{ `creatorAmount`: `number`; `platformAmount`: `number`; \} | - | Calculate payout for a tool call | [defi/protocols/src/hosting/types.ts:230](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/hosting/types.ts#L230) |
| <a id="getserverurl-3"></a> `getServerUrl()` | (`subdomain`: `string`, `customDomain?`: `string`) => `string` | - | Generate subdomain URL | [defi/protocols/src/hosting/types.ts:231](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/hosting/types.ts#L231) |
| <a id="issubdomainavailable-3"></a> `isSubdomainAvailable()` | (`subdomain`: `string`) => `boolean` | - | - | [defi/protocols/src/hosting/types.ts:233](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/hosting/types.ts#L233) |
| <a id="isvalidsubdomain-3"></a> `isValidSubdomain()` | (`subdomain`: `string`) => `boolean` | - | Validate subdomain | [defi/protocols/src/hosting/types.ts:232](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/hosting/types.ts#L232) |
| <a id="platform_fee_percentage"></a> `PLATFORM_FEE_PERCENTAGE` | `number` | - | - | [defi/protocols/src/hosting/types.ts:229](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/hosting/types.ts#L229) |
| <a id="reserved_subdomains"></a> `RESERVED_SUBDOMAINS` | `string`[] | - | Reserved subdomains that can't be used | [defi/protocols/src/hosting/types.ts:234](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/hosting/types.ts#L234) |
| <a id="tier_limits"></a> `TIER_LIMITS` | \{ `business`: \{ `analytics`: `string`; `customBranding`: `boolean`; `customDomain`: `boolean`; `maxCallsPerMonth`: `number`; `maxServers`: `number`; `maxToolsPerServer`: `number`; `support`: `string`; \}; `enterprise`: \{ `analytics`: `string`; `customBranding`: `boolean`; `customDomain`: `boolean`; `maxCallsPerMonth`: `number`; `maxServers`: `number`; `maxToolsPerServer`: `number`; `support`: `string`; \}; `free`: \{ `analytics`: `string`; `customBranding`: `boolean`; `customDomain`: `boolean`; `maxCallsPerMonth`: `number`; `maxServers`: `number`; `maxToolsPerServer`: `number`; `support`: `string`; \}; `pro`: \{ `analytics`: `string`; `customBranding`: `boolean`; `customDomain`: `boolean`; `maxCallsPerMonth`: `number`; `maxServers`: `number`; `maxToolsPerServer`: `number`; `support`: `string`; \}; \} | - | - | [defi/protocols/src/hosting/types.ts:227](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/hosting/types.ts#L227) |
| `TIER_LIMITS.business` | \{ `analytics`: `string`; `customBranding`: `boolean`; `customDomain`: `boolean`; `maxCallsPerMonth`: `number`; `maxServers`: `number`; `maxToolsPerServer`: `number`; `support`: `string`; \} | - | - | [defi/protocols/src/hosting/types.ts:141](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/hosting/types.ts#L141) |
| `TIER_LIMITS.business.analytics` | `string` | `'full'` | - | [defi/protocols/src/hosting/types.ts:147](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/hosting/types.ts#L147) |
| `TIER_LIMITS.business.customBranding` | `boolean` | `true` | - | [defi/protocols/src/hosting/types.ts:146](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/hosting/types.ts#L146) |
| `TIER_LIMITS.business.customDomain` | `boolean` | `true` | - | [defi/protocols/src/hosting/types.ts:145](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/hosting/types.ts#L145) |
| `TIER_LIMITS.business.maxCallsPerMonth` | `number` | `500000` | - | [defi/protocols/src/hosting/types.ts:144](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/hosting/types.ts#L144) |
| `TIER_LIMITS.business.maxServers` | `number` | `-1` | - | [defi/protocols/src/hosting/types.ts:142](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/hosting/types.ts#L142) |
| `TIER_LIMITS.business.maxToolsPerServer` | `number` | `-1` | - | [defi/protocols/src/hosting/types.ts:143](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/hosting/types.ts#L143) |
| `TIER_LIMITS.business.support` | `string` | `'priority'` | - | [defi/protocols/src/hosting/types.ts:148](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/hosting/types.ts#L148) |
| `TIER_LIMITS.enterprise` | \{ `analytics`: `string`; `customBranding`: `boolean`; `customDomain`: `boolean`; `maxCallsPerMonth`: `number`; `maxServers`: `number`; `maxToolsPerServer`: `number`; `support`: `string`; \} | - | - | [defi/protocols/src/hosting/types.ts:150](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/hosting/types.ts#L150) |
| `TIER_LIMITS.enterprise.analytics` | `string` | `'full'` | - | [defi/protocols/src/hosting/types.ts:156](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/hosting/types.ts#L156) |
| `TIER_LIMITS.enterprise.customBranding` | `boolean` | `true` | - | [defi/protocols/src/hosting/types.ts:155](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/hosting/types.ts#L155) |
| `TIER_LIMITS.enterprise.customDomain` | `boolean` | `true` | - | [defi/protocols/src/hosting/types.ts:154](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/hosting/types.ts#L154) |
| `TIER_LIMITS.enterprise.maxCallsPerMonth` | `number` | `-1` | - | [defi/protocols/src/hosting/types.ts:153](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/hosting/types.ts#L153) |
| `TIER_LIMITS.enterprise.maxServers` | `number` | `-1` | - | [defi/protocols/src/hosting/types.ts:151](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/hosting/types.ts#L151) |
| `TIER_LIMITS.enterprise.maxToolsPerServer` | `number` | `-1` | - | [defi/protocols/src/hosting/types.ts:152](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/hosting/types.ts#L152) |
| `TIER_LIMITS.enterprise.support` | `string` | `'dedicated'` | - | [defi/protocols/src/hosting/types.ts:157](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/hosting/types.ts#L157) |
| `TIER_LIMITS.free` | \{ `analytics`: `string`; `customBranding`: `boolean`; `customDomain`: `boolean`; `maxCallsPerMonth`: `number`; `maxServers`: `number`; `maxToolsPerServer`: `number`; `support`: `string`; \} | - | - | [defi/protocols/src/hosting/types.ts:123](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/hosting/types.ts#L123) |
| `TIER_LIMITS.free.analytics` | `string` | `'basic'` | - | [defi/protocols/src/hosting/types.ts:129](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/hosting/types.ts#L129) |
| `TIER_LIMITS.free.customBranding` | `boolean` | `false` | - | [defi/protocols/src/hosting/types.ts:128](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/hosting/types.ts#L128) |
| `TIER_LIMITS.free.customDomain` | `boolean` | `false` | - | [defi/protocols/src/hosting/types.ts:127](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/hosting/types.ts#L127) |
| `TIER_LIMITS.free.maxCallsPerMonth` | `number` | `1000` | - | [defi/protocols/src/hosting/types.ts:126](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/hosting/types.ts#L126) |
| `TIER_LIMITS.free.maxServers` | `number` | `1` | - | [defi/protocols/src/hosting/types.ts:124](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/hosting/types.ts#L124) |
| `TIER_LIMITS.free.maxToolsPerServer` | `number` | `10` | - | [defi/protocols/src/hosting/types.ts:125](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/hosting/types.ts#L125) |
| `TIER_LIMITS.free.support` | `string` | `'community'` | - | [defi/protocols/src/hosting/types.ts:130](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/hosting/types.ts#L130) |
| `TIER_LIMITS.pro` | \{ `analytics`: `string`; `customBranding`: `boolean`; `customDomain`: `boolean`; `maxCallsPerMonth`: `number`; `maxServers`: `number`; `maxToolsPerServer`: `number`; `support`: `string`; \} | - | - | [defi/protocols/src/hosting/types.ts:132](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/hosting/types.ts#L132) |
| `TIER_LIMITS.pro.analytics` | `string` | `'advanced'` | - | [defi/protocols/src/hosting/types.ts:138](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/hosting/types.ts#L138) |
| `TIER_LIMITS.pro.customBranding` | `boolean` | `true` | - | [defi/protocols/src/hosting/types.ts:137](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/hosting/types.ts#L137) |
| `TIER_LIMITS.pro.customDomain` | `boolean` | `false` | - | [defi/protocols/src/hosting/types.ts:136](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/hosting/types.ts#L136) |
| `TIER_LIMITS.pro.maxCallsPerMonth` | `number` | `50000` | - | [defi/protocols/src/hosting/types.ts:135](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/hosting/types.ts#L135) |
| `TIER_LIMITS.pro.maxServers` | `number` | `5` | - | [defi/protocols/src/hosting/types.ts:133](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/hosting/types.ts#L133) |
| `TIER_LIMITS.pro.maxToolsPerServer` | `number` | `50` | - | [defi/protocols/src/hosting/types.ts:134](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/hosting/types.ts#L134) |
| `TIER_LIMITS.pro.support` | `string` | `'email'` | - | [defi/protocols/src/hosting/types.ts:139](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/hosting/types.ts#L139) |
| <a id="tier_pricing"></a> `TIER_PRICING` | \{ `business`: `number`; `enterprise`: `null`; `free`: `number`; `pro`: `number`; \} | - | - | [defi/protocols/src/hosting/types.ts:228](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/hosting/types.ts#L228) |
| `TIER_PRICING.business` | `number` | `99` | - | [defi/protocols/src/hosting/types.ts:165](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/hosting/types.ts#L165) |
| `TIER_PRICING.enterprise` | `null` | `null` | - | [defi/protocols/src/hosting/types.ts:166](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/hosting/types.ts#L166) |
| `TIER_PRICING.free` | `number` | `0` | - | [defi/protocols/src/hosting/types.ts:163](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/hosting/types.ts#L163) |
| `TIER_PRICING.pro` | `number` | `29` | - | [defi/protocols/src/hosting/types.ts:164](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/hosting/types.ts#L164) |

***

### PLATFORM\_FEE\_PERCENTAGE

```ts
const PLATFORM_FEE_PERCENTAGE: 15 = 15;
```

Defined in: [defi/protocols/src/hosting/types.ts:170](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/hosting/types.ts#L170)

***

### RESERVED\_SUBDOMAINS

```ts
const RESERVED_SUBDOMAINS: string[];
```

Defined in: [defi/protocols/src/hosting/types.ts:210](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/hosting/types.ts#L210)

Reserved subdomains that can't be used

***

### TIER\_LIMITS

```ts
const TIER_LIMITS: {
  business: {
     analytics: string;
     customBranding: boolean;
     customDomain: boolean;
     maxCallsPerMonth: number;
     maxServers: number;
     maxToolsPerServer: number;
     support: string;
  };
  enterprise: {
     analytics: string;
     customBranding: boolean;
     customDomain: boolean;
     maxCallsPerMonth: number;
     maxServers: number;
     maxToolsPerServer: number;
     support: string;
  };
  free: {
     analytics: string;
     customBranding: boolean;
     customDomain: boolean;
     maxCallsPerMonth: number;
     maxServers: number;
     maxToolsPerServer: number;
     support: string;
  };
  pro: {
     analytics: string;
     customBranding: boolean;
     customDomain: boolean;
     maxCallsPerMonth: number;
     maxServers: number;
     maxToolsPerServer: number;
     support: string;
  };
};
```

Defined in: [defi/protocols/src/hosting/types.ts:122](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/hosting/types.ts#L122)

#### Type Declaration

| Name | Type | Default value | Defined in |
| :------ | :------ | :------ | :------ |
| <a id="business"></a> `business` | \{ `analytics`: `string`; `customBranding`: `boolean`; `customDomain`: `boolean`; `maxCallsPerMonth`: `number`; `maxServers`: `number`; `maxToolsPerServer`: `number`; `support`: `string`; \} | - | [defi/protocols/src/hosting/types.ts:141](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/hosting/types.ts#L141) |
| `business.analytics` | `string` | `'full'` | [defi/protocols/src/hosting/types.ts:147](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/hosting/types.ts#L147) |
| `business.customBranding` | `boolean` | `true` | [defi/protocols/src/hosting/types.ts:146](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/hosting/types.ts#L146) |
| `business.customDomain` | `boolean` | `true` | [defi/protocols/src/hosting/types.ts:145](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/hosting/types.ts#L145) |
| `business.maxCallsPerMonth` | `number` | `500000` | [defi/protocols/src/hosting/types.ts:144](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/hosting/types.ts#L144) |
| `business.maxServers` | `number` | `-1` | [defi/protocols/src/hosting/types.ts:142](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/hosting/types.ts#L142) |
| `business.maxToolsPerServer` | `number` | `-1` | [defi/protocols/src/hosting/types.ts:143](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/hosting/types.ts#L143) |
| `business.support` | `string` | `'priority'` | [defi/protocols/src/hosting/types.ts:148](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/hosting/types.ts#L148) |
| <a id="enterprise"></a> `enterprise` | \{ `analytics`: `string`; `customBranding`: `boolean`; `customDomain`: `boolean`; `maxCallsPerMonth`: `number`; `maxServers`: `number`; `maxToolsPerServer`: `number`; `support`: `string`; \} | - | [defi/protocols/src/hosting/types.ts:150](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/hosting/types.ts#L150) |
| `enterprise.analytics` | `string` | `'full'` | [defi/protocols/src/hosting/types.ts:156](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/hosting/types.ts#L156) |
| `enterprise.customBranding` | `boolean` | `true` | [defi/protocols/src/hosting/types.ts:155](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/hosting/types.ts#L155) |
| `enterprise.customDomain` | `boolean` | `true` | [defi/protocols/src/hosting/types.ts:154](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/hosting/types.ts#L154) |
| `enterprise.maxCallsPerMonth` | `number` | `-1` | [defi/protocols/src/hosting/types.ts:153](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/hosting/types.ts#L153) |
| `enterprise.maxServers` | `number` | `-1` | [defi/protocols/src/hosting/types.ts:151](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/hosting/types.ts#L151) |
| `enterprise.maxToolsPerServer` | `number` | `-1` | [defi/protocols/src/hosting/types.ts:152](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/hosting/types.ts#L152) |
| `enterprise.support` | `string` | `'dedicated'` | [defi/protocols/src/hosting/types.ts:157](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/hosting/types.ts#L157) |
| <a id="free"></a> `free` | \{ `analytics`: `string`; `customBranding`: `boolean`; `customDomain`: `boolean`; `maxCallsPerMonth`: `number`; `maxServers`: `number`; `maxToolsPerServer`: `number`; `support`: `string`; \} | - | [defi/protocols/src/hosting/types.ts:123](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/hosting/types.ts#L123) |
| `free.analytics` | `string` | `'basic'` | [defi/protocols/src/hosting/types.ts:129](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/hosting/types.ts#L129) |
| `free.customBranding` | `boolean` | `false` | [defi/protocols/src/hosting/types.ts:128](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/hosting/types.ts#L128) |
| `free.customDomain` | `boolean` | `false` | [defi/protocols/src/hosting/types.ts:127](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/hosting/types.ts#L127) |
| `free.maxCallsPerMonth` | `number` | `1000` | [defi/protocols/src/hosting/types.ts:126](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/hosting/types.ts#L126) |
| `free.maxServers` | `number` | `1` | [defi/protocols/src/hosting/types.ts:124](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/hosting/types.ts#L124) |
| `free.maxToolsPerServer` | `number` | `10` | [defi/protocols/src/hosting/types.ts:125](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/hosting/types.ts#L125) |
| `free.support` | `string` | `'community'` | [defi/protocols/src/hosting/types.ts:130](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/hosting/types.ts#L130) |
| <a id="pro"></a> `pro` | \{ `analytics`: `string`; `customBranding`: `boolean`; `customDomain`: `boolean`; `maxCallsPerMonth`: `number`; `maxServers`: `number`; `maxToolsPerServer`: `number`; `support`: `string`; \} | - | [defi/protocols/src/hosting/types.ts:132](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/hosting/types.ts#L132) |
| `pro.analytics` | `string` | `'advanced'` | [defi/protocols/src/hosting/types.ts:138](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/hosting/types.ts#L138) |
| `pro.customBranding` | `boolean` | `true` | [defi/protocols/src/hosting/types.ts:137](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/hosting/types.ts#L137) |
| `pro.customDomain` | `boolean` | `false` | [defi/protocols/src/hosting/types.ts:136](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/hosting/types.ts#L136) |
| `pro.maxCallsPerMonth` | `number` | `50000` | [defi/protocols/src/hosting/types.ts:135](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/hosting/types.ts#L135) |
| `pro.maxServers` | `number` | `5` | [defi/protocols/src/hosting/types.ts:133](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/hosting/types.ts#L133) |
| `pro.maxToolsPerServer` | `number` | `50` | [defi/protocols/src/hosting/types.ts:134](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/hosting/types.ts#L134) |
| `pro.support` | `string` | `'email'` | [defi/protocols/src/hosting/types.ts:139](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/hosting/types.ts#L139) |

***

### TIER\_PRICING

```ts
const TIER_PRICING: {
  business: number;
  enterprise: null;
  free: number;
  pro: number;
};
```

Defined in: [defi/protocols/src/hosting/types.ts:162](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/hosting/types.ts#L162)

#### Type Declaration

| Name | Type | Default value | Defined in |
| :------ | :------ | :------ | :------ |
| <a id="business-1"></a> `business` | `number` | `99` | [defi/protocols/src/hosting/types.ts:165](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/hosting/types.ts#L165) |
| <a id="enterprise-1"></a> `enterprise` | `null` | `null` | [defi/protocols/src/hosting/types.ts:166](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/hosting/types.ts#L166) |
| <a id="free-1"></a> `free` | `number` | `0` | [defi/protocols/src/hosting/types.ts:163](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/hosting/types.ts#L163) |
| <a id="pro-1"></a> `pro` | `number` | `29` | [defi/protocols/src/hosting/types.ts:164](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/hosting/types.ts#L164) |

## Functions

### calculatePayout()

```ts
function calculatePayout(toolPrice: number, creatorShare: number): {
  creatorAmount: number;
  platformAmount: number;
};
```

Defined in: [defi/protocols/src/hosting/types.ts:175](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/hosting/types.ts#L175)

Calculate payout for a tool call

#### Parameters

| Parameter | Type | Default value |
| :------ | :------ | :------ |
| `toolPrice` | `number` | `undefined` |
| `creatorShare` | `number` | `85` |

#### Returns

```ts
{
  creatorAmount: number;
  platformAmount: number;
}
```

| Name | Type | Defined in |
| :------ | :------ | :------ |
| `creatorAmount` | `number` | [defi/protocols/src/hosting/types.ts:178](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/hosting/types.ts#L178) |
| `platformAmount` | `number` | [defi/protocols/src/hosting/types.ts:178](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/hosting/types.ts#L178) |

***

### getServerUrl()

```ts
function getServerUrl(subdomain: string, customDomain?: string): string;
```

Defined in: [defi/protocols/src/hosting/types.ts:191](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/hosting/types.ts#L191)

Generate subdomain URL

#### Parameters

| Parameter | Type |
| :------ | :------ |
| `subdomain` | `string` |
| `customDomain?` | `string` |

#### Returns

`string`

***

### isSubdomainAvailable()

```ts
function isSubdomainAvailable(subdomain: string): boolean;
```

Defined in: [defi/protocols/src/hosting/types.ts:219](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/hosting/types.ts#L219)

#### Parameters

| Parameter | Type |
| :------ | :------ |
| `subdomain` | `string` |

#### Returns

`boolean`

***

### isValidSubdomain()

```ts
function isValidSubdomain(subdomain: string): boolean;
```

Defined in: [defi/protocols/src/hosting/types.ts:201](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/hosting/types.ts#L201)

Validate subdomain

#### Parameters

| Parameter | Type |
| :------ | :------ |
| `subdomain` | `string` |

#### Returns

`boolean`
