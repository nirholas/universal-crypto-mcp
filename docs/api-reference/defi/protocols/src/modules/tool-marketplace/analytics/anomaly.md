[**Universal Crypto MCP API Reference v1.0.0**](../../../../../../index.md)

***

[Universal Crypto MCP API Reference](/docs/api/index.md) / defi/protocols/src/modules/tool-marketplace/analytics/anomaly

# defi/protocols/src/modules/tool-marketplace/analytics/anomaly

## Classes

### AnomalyDetectorService

Defined in: [defi/protocols/src/modules/tool-marketplace/analytics/anomaly.ts:188](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/modules/tool-marketplace/analytics/anomaly.ts#L188)

Anomaly Detector Service
Monitors marketplace activity for unusual patterns

#### Constructors

##### Constructor

```ts
new AnomalyDetectorService(thresholds?: Partial<DetectionThresholds>): AnomalyDetectorService;
```

Defined in: [defi/protocols/src/modules/tool-marketplace/analytics/anomaly.ts:192](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/modules/tool-marketplace/analytics/anomaly.ts#L192)

###### Parameters

| Parameter | Type |
| :------ | :------ |
| `thresholds?` | `Partial`\<`DetectionThresholds`\> |

###### Returns

[`AnomalyDetectorService`](/docs/api/defi/protocols/src/modules/tool-marketplace/analytics/anomaly.md#anomalydetectorservice)

#### Methods

##### acknowledgeAnomaly()

```ts
acknowledgeAnomaly(anomalyId: string): void;
```

Defined in: [defi/protocols/src/modules/tool-marketplace/analytics/anomaly.ts:677](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/modules/tool-marketplace/analytics/anomaly.ts#L677)

Acknowledge an anomaly

###### Parameters

| Parameter | Type |
| :------ | :------ |
| `anomalyId` | `string` |

###### Returns

`void`

##### configureAlerts()

```ts
configureAlerts(config: AlertConfig): void;
```

Defined in: [defi/protocols/src/modules/tool-marketplace/analytics/anomaly.ts:699](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/modules/tool-marketplace/analytics/anomaly.ts#L699)

Configure alerts

###### Parameters

| Parameter | Type |
| :------ | :------ |
| `config` | [`AlertConfig`](/docs/api/defi/protocols/src/modules/tool-marketplace/analytics/anomaly.md#alertconfig) |

###### Returns

`void`

##### detectAbusePattern()

```ts
detectAbusePattern(
   userAddress: `0x${string}`, 
   toolId: string, 
   recentPayments: {
  amount: string;
  timestamp: number;
}[]): AbusePatternResult;
```

Defined in: [defi/protocols/src/modules/tool-marketplace/analytics/anomaly.ts:589](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/modules/tool-marketplace/analytics/anomaly.ts#L589)

Detect potential abuse patterns

###### Parameters

| Parameter | Type |
| :------ | :------ |
| `userAddress` | `` `0x${string}` `` |
| `toolId` | `string` |
| `recentPayments` | \{ `amount`: `string`; `timestamp`: `number`; \}[] |

###### Returns

[`AbusePatternResult`](/docs/api/defi/protocols/src/modules/tool-marketplace/analytics/anomaly.md#abusepatternresult)

##### detectBot()

```ts
detectBot(userAddress: `0x${string}`): BotDetectionResult;
```

Defined in: [defi/protocols/src/modules/tool-marketplace/analytics/anomaly.ts:519](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/modules/tool-marketplace/analytics/anomaly.ts#L519)

Detect if user is likely a bot

###### Parameters

| Parameter | Type |
| :------ | :------ |
| `userAddress` | `` `0x${string}` `` |

###### Returns

[`BotDetectionResult`](/docs/api/defi/protocols/src/modules/tool-marketplace/analytics/anomaly.md#botdetectionresult)

##### getActiveAnomalies()

```ts
getActiveAnomalies(): Anomaly[];
```

Defined in: [defi/protocols/src/modules/tool-marketplace/analytics/anomaly.ts:659](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/modules/tool-marketplace/analytics/anomaly.ts#L659)

Get all active anomalies

###### Returns

[`Anomaly`](/docs/api/defi/protocols/src/modules/tool-marketplace/analytics/anomaly.md#anomaly)[]

##### getAnomaliesBySeverity()

```ts
getAnomaliesBySeverity(severity: AnomalySeverity): Anomaly[];
```

Defined in: [defi/protocols/src/modules/tool-marketplace/analytics/anomaly.ts:668](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/modules/tool-marketplace/analytics/anomaly.ts#L668)

Get anomalies by severity

###### Parameters

| Parameter | Type |
| :------ | :------ |
| `severity` | [`AnomalySeverity`](/docs/api/defi/protocols/src/modules/tool-marketplace/analytics/anomaly.md#anomalyseverity-1) |

###### Returns

[`Anomaly`](/docs/api/defi/protocols/src/modules/tool-marketplace/analytics/anomaly.md#anomaly)[]

##### getStats()

```ts
getStats(): {
  acknowledged: number;
  active: number;
  bySeverity: Record<AnomalySeverity, number>;
  byType: Record<string, number>;
  resolved: number;
  total: number;
};
```

Defined in: [defi/protocols/src/modules/tool-marketplace/analytics/anomaly.ts:744](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/modules/tool-marketplace/analytics/anomaly.ts#L744)

Get anomaly statistics

###### Returns

```ts
{
  acknowledged: number;
  active: number;
  bySeverity: Record<AnomalySeverity, number>;
  byType: Record<string, number>;
  resolved: number;
  total: number;
}
```

| Name | Type | Defined in |
| :------ | :------ | :------ |
| `acknowledged` | `number` | [defi/protocols/src/modules/tool-marketplace/analytics/anomaly.ts:747](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/modules/tool-marketplace/analytics/anomaly.ts#L747) |
| `active` | `number` | [defi/protocols/src/modules/tool-marketplace/analytics/anomaly.ts:746](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/modules/tool-marketplace/analytics/anomaly.ts#L746) |
| `bySeverity` | `Record`\<[`AnomalySeverity`](/docs/api/defi/protocols/src/modules/tool-marketplace/analytics/anomaly.md#anomalyseverity-1), `number`\> | [defi/protocols/src/modules/tool-marketplace/analytics/anomaly.ts:749](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/modules/tool-marketplace/analytics/anomaly.ts#L749) |
| `byType` | `Record`\<`string`, `number`\> | [defi/protocols/src/modules/tool-marketplace/analytics/anomaly.ts:750](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/modules/tool-marketplace/analytics/anomaly.ts#L750) |
| `resolved` | `number` | [defi/protocols/src/modules/tool-marketplace/analytics/anomaly.ts:748](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/modules/tool-marketplace/analytics/anomaly.ts#L748) |
| `total` | `number` | [defi/protocols/src/modules/tool-marketplace/analytics/anomaly.ts:745](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/modules/tool-marketplace/analytics/anomaly.ts#L745) |

##### recordUserRequest()

```ts
recordUserRequest(userAddress: `0x${string}`, endpoint: string): void;
```

Defined in: [defi/protocols/src/modules/tool-marketplace/analytics/anomaly.ts:488](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/modules/tool-marketplace/analytics/anomaly.ts#L488)

Record user request for bot detection

###### Parameters

| Parameter | Type |
| :------ | :------ |
| `userAddress` | `` `0x${string}` `` |
| `endpoint` | `string` |

###### Returns

`void`

##### resolveAnomaly()

```ts
resolveAnomaly(anomalyId: string): void;
```

Defined in: [defi/protocols/src/modules/tool-marketplace/analytics/anomaly.ts:688](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/modules/tool-marketplace/analytics/anomaly.ts#L688)

Resolve an anomaly

###### Parameters

| Parameter | Type |
| :------ | :------ |
| `anomalyId` | `string` |

###### Returns

`void`

##### runDetection()

```ts
runDetection(): Promise<Anomaly[]>;
```

Defined in: [defi/protocols/src/modules/tool-marketplace/analytics/anomaly.ts:223](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/modules/tool-marketplace/analytics/anomaly.ts#L223)

Run full anomaly detection

###### Returns

`Promise`\<[`Anomaly`](/docs/api/defi/protocols/src/modules/tool-marketplace/analytics/anomaly.md#anomaly)[]\>

##### startDetection()

```ts
startDetection(intervalMs: number): void;
```

Defined in: [defi/protocols/src/modules/tool-marketplace/analytics/anomaly.ts:199](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/modules/tool-marketplace/analytics/anomaly.ts#L199)

Start automatic anomaly detection

###### Parameters

| Parameter | Type | Default value |
| :------ | :------ | :------ |
| `intervalMs` | `number` | `300000` |

###### Returns

`void`

##### stopDetection()

```ts
stopDetection(): void;
```

Defined in: [defi/protocols/src/modules/tool-marketplace/analytics/anomaly.ts:212](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/modules/tool-marketplace/analytics/anomaly.ts#L212)

Stop automatic detection

###### Returns

`void`

## Interfaces

### AbusePatternResult

Defined in: [defi/protocols/src/modules/tool-marketplace/analytics/anomaly.ts:101](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/modules/tool-marketplace/analytics/anomaly.ts#L101)

Abuse pattern detection result

#### Properties

| Property | Type | Description | Defined in |
| :------ | :------ | :------ | :------ |
| <a id="abusedetected"></a> `abuseDetected` | `boolean` | Whether abuse is detected | [defi/protocols/src/modules/tool-marketplace/analytics/anomaly.ts:103](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/modules/tool-marketplace/analytics/anomaly.ts#L103) |
| <a id="abusetype"></a> `abuseType?` | `"rate_abuse"` \| `"payment_fraud"` \| `"credential_stuffing"` \| `"scraping"` | Type of abuse | [defi/protocols/src/modules/tool-marketplace/analytics/anomaly.ts:105](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/modules/tool-marketplace/analytics/anomaly.ts#L105) |
| <a id="confidence"></a> `confidence` | `number` | Confidence score (0-100) | [defi/protocols/src/modules/tool-marketplace/analytics/anomaly.ts:107](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/modules/tool-marketplace/analytics/anomaly.ts#L107) |
| <a id="evidence"></a> `evidence` | `string`[] | Evidence of abuse | [defi/protocols/src/modules/tool-marketplace/analytics/anomaly.ts:109](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/modules/tool-marketplace/analytics/anomaly.ts#L109) |
| <a id="recommendedactions"></a> `recommendedActions` | `string`[] | Recommended actions | [defi/protocols/src/modules/tool-marketplace/analytics/anomaly.ts:111](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/modules/tool-marketplace/analytics/anomaly.ts#L111) |

***

### AlertConfig

Defined in: [defi/protocols/src/modules/tool-marketplace/analytics/anomaly.ts:68](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/modules/tool-marketplace/analytics/anomaly.ts#L68)

Alert configuration

#### Properties

| Property | Type | Description | Defined in |
| :------ | :------ | :------ | :------ |
| <a id="emails"></a> `emails?` | `string`[] | Email addresses for notifications | [defi/protocols/src/modules/tool-marketplace/analytics/anomaly.ts:76](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/modules/tool-marketplace/analytics/anomaly.ts#L76) |
| <a id="minseverity"></a> `minSeverity` | [`AnomalySeverity`](/docs/api/defi/protocols/src/modules/tool-marketplace/analytics/anomaly.md#anomalyseverity-1) | Minimum severity to alert | [defi/protocols/src/modules/tool-marketplace/analytics/anomaly.ts:72](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/modules/tool-marketplace/analytics/anomaly.ts#L72) |
| <a id="types"></a> `types` | [`AnomalyType`](/docs/api/defi/protocols/src/modules/tool-marketplace/analytics/anomaly.md#anomalytype-1)[] | Anomaly types to alert on | [defi/protocols/src/modules/tool-marketplace/analytics/anomaly.ts:70](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/modules/tool-marketplace/analytics/anomaly.ts#L70) |
| <a id="webhookurl"></a> `webhookUrl?` | `string` | Webhook URL for notifications | [defi/protocols/src/modules/tool-marketplace/analytics/anomaly.ts:74](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/modules/tool-marketplace/analytics/anomaly.ts#L74) |

***

### Anomaly

Defined in: [defi/protocols/src/modules/tool-marketplace/analytics/anomaly.ts:36](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/modules/tool-marketplace/analytics/anomaly.ts#L36)

Detected anomaly

#### Properties

| Property | Type | Description | Defined in |
| :------ | :------ | :------ | :------ |
| <a id="acknowledged"></a> `acknowledged` | `boolean` | Whether the anomaly has been acknowledged | [defi/protocols/src/modules/tool-marketplace/analytics/anomaly.ts:60](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/modules/tool-marketplace/analytics/anomaly.ts#L60) |
| <a id="currentvalue"></a> `currentValue` | `number` | Current value that triggered anomaly | [defi/protocols/src/modules/tool-marketplace/analytics/anomaly.ts:52](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/modules/tool-marketplace/analytics/anomaly.ts#L52) |
| <a id="description"></a> `description` | `string` | Description of the anomaly | [defi/protocols/src/modules/tool-marketplace/analytics/anomaly.ts:50](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/modules/tool-marketplace/analytics/anomaly.ts#L50) |
| <a id="detectedat"></a> `detectedAt` | `number` | Detection timestamp | [defi/protocols/src/modules/tool-marketplace/analytics/anomaly.ts:44](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/modules/tool-marketplace/analytics/anomaly.ts#L44) |
| <a id="deviationpercent"></a> `deviationPercent` | `number` | Deviation percentage | [defi/protocols/src/modules/tool-marketplace/analytics/anomaly.ts:56](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/modules/tool-marketplace/analytics/anomaly.ts#L56) |
| <a id="expectedvalue"></a> `expectedValue` | `number` | Expected/baseline value | [defi/protocols/src/modules/tool-marketplace/analytics/anomaly.ts:54](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/modules/tool-marketplace/analytics/anomaly.ts#L54) |
| <a id="id"></a> `id` | `string` | Unique anomaly ID | [defi/protocols/src/modules/tool-marketplace/analytics/anomaly.ts:38](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/modules/tool-marketplace/analytics/anomaly.ts#L38) |
| <a id="recommendation"></a> `recommendation` | `string` | Recommended action | [defi/protocols/src/modules/tool-marketplace/analytics/anomaly.ts:58](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/modules/tool-marketplace/analytics/anomaly.ts#L58) |
| <a id="resolvedat"></a> `resolvedAt?` | `number` | Resolution timestamp (if resolved) | [defi/protocols/src/modules/tool-marketplace/analytics/anomaly.ts:62](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/modules/tool-marketplace/analytics/anomaly.ts#L62) |
| <a id="severity"></a> `severity` | [`AnomalySeverity`](/docs/api/defi/protocols/src/modules/tool-marketplace/analytics/anomaly.md#anomalyseverity-1) | Severity level | [defi/protocols/src/modules/tool-marketplace/analytics/anomaly.ts:42](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/modules/tool-marketplace/analytics/anomaly.ts#L42) |
| <a id="toolid"></a> `toolId?` | `string` | Affected tool ID (if applicable) | [defi/protocols/src/modules/tool-marketplace/analytics/anomaly.ts:46](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/modules/tool-marketplace/analytics/anomaly.ts#L46) |
| <a id="type"></a> `type` | [`AnomalyType`](/docs/api/defi/protocols/src/modules/tool-marketplace/analytics/anomaly.md#anomalytype-1) | Type of anomaly | [defi/protocols/src/modules/tool-marketplace/analytics/anomaly.ts:40](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/modules/tool-marketplace/analytics/anomaly.ts#L40) |
| <a id="useraddress"></a> `userAddress?` | `` `0x${string}` `` | Affected user address (if applicable) | [defi/protocols/src/modules/tool-marketplace/analytics/anomaly.ts:48](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/modules/tool-marketplace/analytics/anomaly.ts#L48) |

***

### BotDetectionResult

Defined in: [defi/protocols/src/modules/tool-marketplace/analytics/anomaly.ts:82](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/modules/tool-marketplace/analytics/anomaly.ts#L82)

Bot detection result

#### Properties

| Property | Type | Description | Defined in |
| :------ | :------ | :------ | :------ |
| <a id="confidence-1"></a> `confidence` | `number` | Confidence score (0-100) | [defi/protocols/src/modules/tool-marketplace/analytics/anomaly.ts:86](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/modules/tool-marketplace/analytics/anomaly.ts#L86) |
| <a id="isbot"></a> `isBot` | `boolean` | Whether bot traffic is suspected | [defi/protocols/src/modules/tool-marketplace/analytics/anomaly.ts:84](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/modules/tool-marketplace/analytics/anomaly.ts#L84) |
| <a id="metrics"></a> `metrics` | \{ `avgResponseConsumption`: `number`; `patternScore`: `number`; `requestsPerMinute`: `number`; `uniqueEndpoints`: `number`; \} | User behavior metrics | [defi/protocols/src/modules/tool-marketplace/analytics/anomaly.ts:90](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/modules/tool-marketplace/analytics/anomaly.ts#L90) |
| `metrics.avgResponseConsumption` | `number` | - | [defi/protocols/src/modules/tool-marketplace/analytics/anomaly.ts:93](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/modules/tool-marketplace/analytics/anomaly.ts#L93) |
| `metrics.patternScore` | `number` | - | [defi/protocols/src/modules/tool-marketplace/analytics/anomaly.ts:94](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/modules/tool-marketplace/analytics/anomaly.ts#L94) |
| `metrics.requestsPerMinute` | `number` | - | [defi/protocols/src/modules/tool-marketplace/analytics/anomaly.ts:91](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/modules/tool-marketplace/analytics/anomaly.ts#L91) |
| `metrics.uniqueEndpoints` | `number` | - | [defi/protocols/src/modules/tool-marketplace/analytics/anomaly.ts:92](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/modules/tool-marketplace/analytics/anomaly.ts#L92) |
| <a id="reasons"></a> `reasons` | `string`[] | Reasons for classification | [defi/protocols/src/modules/tool-marketplace/analytics/anomaly.ts:88](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/modules/tool-marketplace/analytics/anomaly.ts#L88) |

## Type Aliases

### AnomalySeverity

```ts
type AnomalySeverity = "low" | "medium" | "high" | "critical";
```

Defined in: [defi/protocols/src/modules/tool-marketplace/analytics/anomaly.ts:16](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/modules/tool-marketplace/analytics/anomaly.ts#L16)

Anomaly severity levels

***

### AnomalyType

```ts
type AnomalyType = 
  | "usage_spike"
  | "usage_drop"
  | "revenue_spike"
  | "revenue_drop"
  | "error_spike"
  | "latency_spike"
  | "potential_abuse"
  | "bot_traffic"
  | "rate_limit_abuse"
  | "suspicious_pattern";
```

Defined in: [defi/protocols/src/modules/tool-marketplace/analytics/anomaly.ts:21](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/modules/tool-marketplace/analytics/anomaly.ts#L21)

Anomaly types

## Variables

### anomalyDetector

```ts
const anomalyDetector: AnomalyDetectorService;
```

Defined in: [defi/protocols/src/modules/tool-marketplace/analytics/anomaly.ts:790](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/modules/tool-marketplace/analytics/anomaly.ts#L790)
