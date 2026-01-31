[**Universal Crypto MCP API Reference v1.0.0**](../../../../../../index.md)

***

[Universal Crypto MCP API Reference](/docs/api/index.md) / defi/protocols/src/modules/tool-marketplace/verification/endpoint-verifier

# defi/protocols/src/modules/tool-marketplace/verification/endpoint-verifier

## Classes

### EndpointVerifier

Defined in: [defi/protocols/src/modules/tool-marketplace/verification/endpoint-verifier.ts:65](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/modules/tool-marketplace/verification/endpoint-verifier.ts#L65)

Endpoint Verifier Service
Monitors tool endpoints for availability, response time, and SSL certificate validity

#### Constructors

##### Constructor

```ts
new EndpointVerifier(config: Partial<EndpointVerifierConfig>): EndpointVerifier;
```

Defined in: [defi/protocols/src/modules/tool-marketplace/verification/endpoint-verifier.ts:69](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/modules/tool-marketplace/verification/endpoint-verifier.ts#L69)

###### Parameters

| Parameter | Type |
| :------ | :------ |
| `config` | `Partial`\<[`EndpointVerifierConfig`](/docs/api/defi/protocols/src/modules/tool-marketplace/verification/endpoint-verifier.md#endpointverifierconfig)\> |

###### Returns

[`EndpointVerifier`](/docs/api/defi/protocols/src/modules/tool-marketplace/verification/endpoint-verifier.md#endpointverifier)

#### Methods

##### cancelPeriodicCheck()

```ts
cancelPeriodicCheck(toolId: string): void;
```

Defined in: [defi/protocols/src/modules/tool-marketplace/verification/endpoint-verifier.ts:352](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/modules/tool-marketplace/verification/endpoint-verifier.ts#L352)

Cancel periodic checks for a tool

###### Parameters

| Parameter | Type |
| :------ | :------ |
| `toolId` | `string` |

###### Returns

`void`

##### checkEndpoint()

```ts
checkEndpoint(toolId: string, endpoint: string): Promise<EndpointCheckResult>;
```

Defined in: [defi/protocols/src/modules/tool-marketplace/verification/endpoint-verifier.ts:76](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/modules/tool-marketplace/verification/endpoint-verifier.ts#L76)

Check a single endpoint

###### Parameters

| Parameter | Type |
| :------ | :------ |
| `toolId` | `string` |
| `endpoint` | `string` |

###### Returns

`Promise`\<[`EndpointCheckResult`](/docs/api/defi/protocols/src/modules/tool-marketplace/verification/types.md#endpointcheckresult)\>

##### checkEndpointWithRetry()

```ts
checkEndpointWithRetry(toolId: string, endpoint: string): Promise<EndpointCheckResult>;
```

Defined in: [defi/protocols/src/modules/tool-marketplace/verification/endpoint-verifier.ts:364](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/modules/tool-marketplace/verification/endpoint-verifier.ts#L364)

Check endpoint with retries

###### Parameters

| Parameter | Type |
| :------ | :------ |
| `toolId` | `string` |
| `endpoint` | `string` |

###### Returns

`Promise`\<[`EndpointCheckResult`](/docs/api/defi/protocols/src/modules/tool-marketplace/verification/types.md#endpointcheckresult)\>

##### checkSSLCertificate()

```ts
checkSSLCertificate(endpoint: string): Promise<
  | SSLCertificateInfo
| null>;
```

Defined in: [defi/protocols/src/modules/tool-marketplace/verification/endpoint-verifier.ts:181](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/modules/tool-marketplace/verification/endpoint-verifier.ts#L181)

Check SSL certificate for an endpoint

###### Parameters

| Parameter | Type |
| :------ | :------ |
| `endpoint` | `string` |

###### Returns

`Promise`\<
  \| [`SSLCertificateInfo`](/docs/api/defi/protocols/src/modules/tool-marketplace/verification/types.md#sslcertificateinfo)
  \| `null`\>

##### getAllUptimeRecords()

```ts
getAllUptimeRecords(toolId: string): UptimeRecord[];
```

Defined in: [defi/protocols/src/modules/tool-marketplace/verification/endpoint-verifier.ts:315](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/modules/tool-marketplace/verification/endpoint-verifier.ts#L315)

Get all uptime records for a tool

###### Parameters

| Parameter | Type |
| :------ | :------ |
| `toolId` | `string` |

###### Returns

[`UptimeRecord`](/docs/api/defi/protocols/src/modules/tool-marketplace/verification/types.md#uptimerecord)[]

##### getCheckHistory()

```ts
getCheckHistory(toolId: string, limit: number): EndpointCheckResult[];
```

Defined in: [defi/protocols/src/modules/tool-marketplace/verification/endpoint-verifier.ts:292](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/modules/tool-marketplace/verification/endpoint-verifier.ts#L292)

Get check history for a tool

###### Parameters

| Parameter | Type | Default value |
| :------ | :------ | :------ |
| `toolId` | `string` | `undefined` |
| `limit` | `number` | `100` |

###### Returns

[`EndpointCheckResult`](/docs/api/defi/protocols/src/modules/tool-marketplace/verification/types.md#endpointcheckresult)[]

##### getOverallHealth()

```ts
getOverallHealth(toolId: string): {
  avgResponseTime: number;
  lastCheck:   | EndpointCheckResult
     | null;
  status: EndpointHealthStatus;
  uptime24h: number;
};
```

Defined in: [defi/protocols/src/modules/tool-marketplace/verification/endpoint-verifier.ts:444](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/modules/tool-marketplace/verification/endpoint-verifier.ts#L444)

Get overall health status for a tool

###### Parameters

| Parameter | Type |
| :------ | :------ |
| `toolId` | `string` |

###### Returns

```ts
{
  avgResponseTime: number;
  lastCheck:   | EndpointCheckResult
     | null;
  status: EndpointHealthStatus;
  uptime24h: number;
}
```

| Name | Type | Defined in |
| :------ | :------ | :------ |
| `avgResponseTime` | `number` | [defi/protocols/src/modules/tool-marketplace/verification/endpoint-verifier.ts:447](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/modules/tool-marketplace/verification/endpoint-verifier.ts#L447) |
| `lastCheck` | \| [`EndpointCheckResult`](/docs/api/defi/protocols/src/modules/tool-marketplace/verification/types.md#endpointcheckresult) \| `null` | [defi/protocols/src/modules/tool-marketplace/verification/endpoint-verifier.ts:448](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/modules/tool-marketplace/verification/endpoint-verifier.ts#L448) |
| `status` | [`EndpointHealthStatus`](/docs/api/defi/protocols/src/modules/tool-marketplace/verification/types.md#endpointhealthstatus) | [defi/protocols/src/modules/tool-marketplace/verification/endpoint-verifier.ts:445](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/modules/tool-marketplace/verification/endpoint-verifier.ts#L445) |
| `uptime24h` | `number` | [defi/protocols/src/modules/tool-marketplace/verification/endpoint-verifier.ts:446](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/modules/tool-marketplace/verification/endpoint-verifier.ts#L446) |

##### getUptimeRecord()

```ts
getUptimeRecord(toolId: string, period: "day" | "week" | "month" | "hour"): 
  | UptimeRecord
  | null;
```

Defined in: [defi/protocols/src/modules/tool-marketplace/verification/endpoint-verifier.ts:303](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/modules/tool-marketplace/verification/endpoint-verifier.ts#L303)

Get uptime record for a tool and period

###### Parameters

| Parameter | Type |
| :------ | :------ |
| `toolId` | `string` |
| `period` | `"day"` \| `"week"` \| `"month"` \| `"hour"` |

###### Returns

  \| [`UptimeRecord`](/docs/api/defi/protocols/src/modules/tool-marketplace/verification/types.md#uptimerecord)
  \| `null`

##### schedulePeriodicCheck()

```ts
schedulePeriodicCheck(toolId: string, endpoint: string): void;
```

Defined in: [defi/protocols/src/modules/tool-marketplace/verification/endpoint-verifier.ts:332](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/modules/tool-marketplace/verification/endpoint-verifier.ts#L332)

Schedule periodic checks for a tool

###### Parameters

| Parameter | Type |
| :------ | :------ |
| `toolId` | `string` |
| `endpoint` | `string` |

###### Returns

`void`

##### start()

```ts
start(): void;
```

Defined in: [defi/protocols/src/modules/tool-marketplace/verification/endpoint-verifier.ts:486](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/modules/tool-marketplace/verification/endpoint-verifier.ts#L486)

Start the verification service

###### Returns

`void`

##### stop()

```ts
stop(): void;
```

Defined in: [defi/protocols/src/modules/tool-marketplace/verification/endpoint-verifier.ts:498](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/modules/tool-marketplace/verification/endpoint-verifier.ts#L498)

Stop the verification service

###### Returns

`void`

##### verifyEndpointResponse()

```ts
verifyEndpointResponse(
   toolId: string, 
   endpoint: string, 
   expectedFields?: string[]): Promise<{
  errors: string[];
  valid: boolean;
}>;
```

Defined in: [defi/protocols/src/modules/tool-marketplace/verification/endpoint-verifier.ts:391](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/modules/tool-marketplace/verification/endpoint-verifier.ts#L391)

Verify endpoint returns valid data

###### Parameters

| Parameter | Type |
| :------ | :------ |
| `toolId` | `string` |
| `endpoint` | `string` |
| `expectedFields?` | `string`[] |

###### Returns

`Promise`\<\{
  `errors`: `string`[];
  `valid`: `boolean`;
\}\>

## Interfaces

### EndpointVerifierConfig

Defined in: [defi/protocols/src/modules/tool-marketplace/verification/endpoint-verifier.ts:20](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/modules/tool-marketplace/verification/endpoint-verifier.ts#L20)

Configuration for endpoint verification

#### Properties

| Property | Type | Description | Defined in |
| :------ | :------ | :------ | :------ |
| <a id="alertthreshold"></a> `alertThreshold` | `number` | Response time threshold for alerts (ms) | [defi/protocols/src/modules/tool-marketplace/verification/endpoint-verifier.ts:32](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/modules/tool-marketplace/verification/endpoint-verifier.ts#L32) |
| <a id="checkinterval"></a> `checkInterval` | `number` | Check interval in milliseconds (default: 5 minutes) | [defi/protocols/src/modules/tool-marketplace/verification/endpoint-verifier.ts:22](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/modules/tool-marketplace/verification/endpoint-verifier.ts#L22) |
| <a id="degradedthreshold"></a> `degradedThreshold` | `number` | Response time threshold for "degraded" status (ms) | [defi/protocols/src/modules/tool-marketplace/verification/endpoint-verifier.ts:30](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/modules/tool-marketplace/verification/endpoint-verifier.ts#L30) |
| <a id="requesttimeout"></a> `requestTimeout` | `number` | Timeout for endpoint requests in milliseconds | [defi/protocols/src/modules/tool-marketplace/verification/endpoint-verifier.ts:24](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/modules/tool-marketplace/verification/endpoint-verifier.ts#L24) |
| <a id="retryattempts"></a> `retryAttempts` | `number` | Number of retries before marking as down | [defi/protocols/src/modules/tool-marketplace/verification/endpoint-verifier.ts:26](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/modules/tool-marketplace/verification/endpoint-verifier.ts#L26) |
| <a id="retrydelay"></a> `retryDelay` | `number` | Delay between retries in milliseconds | [defi/protocols/src/modules/tool-marketplace/verification/endpoint-verifier.ts:28](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/modules/tool-marketplace/verification/endpoint-verifier.ts#L28) |

## Variables

### endpointVerifier

```ts
const endpointVerifier: EndpointVerifier;
```

Defined in: [defi/protocols/src/modules/tool-marketplace/verification/endpoint-verifier.ts:516](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/modules/tool-marketplace/verification/endpoint-verifier.ts#L516)

Singleton instance
