[**Universal Crypto MCP API Reference v1.0.0**](../../../../../../index.md)

***

[Universal Crypto MCP API Reference](/docs/api/index.md) / defi/protocols/src/modules/tool-marketplace/analytics/timeseries

# defi/protocols/src/modules/tool-marketplace/analytics/timeseries

## Classes

### TimeSeriesDB

Defined in: [defi/protocols/src/modules/tool-marketplace/analytics/timeseries.ts:246](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/modules/tool-marketplace/analytics/timeseries.ts#L246)

Time Series Database
Provides efficient storage and querying of time-stamped metrics

#### Constructors

##### Constructor

```ts
new TimeSeriesDB(retentionPolicies?: RetentionPolicy[]): TimeSeriesDB;
```

Defined in: [defi/protocols/src/modules/tool-marketplace/analytics/timeseries.ts:251](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/modules/tool-marketplace/analytics/timeseries.ts#L251)

###### Parameters

| Parameter | Type |
| :------ | :------ |
| `retentionPolicies?` | [`RetentionPolicy`](/docs/api/defi/protocols/src/modules/tool-marketplace/analytics/timeseries.md#retentionpolicy)[] |

###### Returns

[`TimeSeriesDB`](/docs/api/defi/protocols/src/modules/tool-marketplace/analytics/timeseries.md#timeseriesdb)

#### Methods

##### applyRetention()

```ts
applyRetention(): void;
```

Defined in: [defi/protocols/src/modules/tool-marketplace/analytics/timeseries.ts:550](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/modules/tool-marketplace/analytics/timeseries.ts#L550)

Apply retention policies and clean up old data

###### Returns

`void`

##### clearMetric()

```ts
clearMetric(metricName: string): void;
```

Defined in: [defi/protocols/src/modules/tool-marketplace/analytics/timeseries.ts:614](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/modules/tool-marketplace/analytics/timeseries.ts#L614)

Clear all data for a metric

###### Parameters

| Parameter | Type |
| :------ | :------ |
| `metricName` | `string` |

###### Returns

`void`

##### export()

```ts
export(): Record<string, {
  data: {
     granularity: Granularity;
     points: AggregatedDataPoint[];
  }[];
  definition: MetricDefinition;
}>;
```

Defined in: [defi/protocols/src/modules/tool-marketplace/analytics/timeseries.ts:628](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/modules/tool-marketplace/analytics/timeseries.ts#L628)

Export all data as JSON

###### Returns

`Record`\<`string`, \{
  `data`: \{
     `granularity`: [`Granularity`](/docs/api/defi/protocols/src/modules/tool-marketplace/analytics/timeseries.md#granularity-2);
     `points`: [`AggregatedDataPoint`](/docs/api/defi/protocols/src/modules/tool-marketplace/analytics/timeseries.md#aggregateddatapoint)[];
  \}[];
  `definition`: [`MetricDefinition`](/docs/api/defi/protocols/src/modules/tool-marketplace/analytics/timeseries.md#metricdefinition);
\}\>

##### getLatest()

```ts
getLatest(metricName: string): 
  | DataPoint
  | null;
```

Defined in: [defi/protocols/src/modules/tool-marketplace/analytics/timeseries.ts:417](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/modules/tool-marketplace/analytics/timeseries.ts#L417)

Get the latest value for a metric

###### Parameters

| Parameter | Type |
| :------ | :------ |
| `metricName` | `string` |

###### Returns

  \| [`DataPoint`](/docs/api/defi/protocols/src/modules/tool-marketplace/analytics/timeseries.md#datapoint)
  \| `null`

##### getMetrics()

```ts
getMetrics(): MetricDefinition[];
```

Defined in: [defi/protocols/src/modules/tool-marketplace/analytics/timeseries.ts:572](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/modules/tool-marketplace/analytics/timeseries.ts#L572)

Get all registered metrics

###### Returns

[`MetricDefinition`](/docs/api/defi/protocols/src/modules/tool-marketplace/analytics/timeseries.md#metricdefinition)[]

##### getStats()

```ts
getStats(): {
  storageByGranularity: Record<Granularity, number>;
  totalDataPoints: number;
  totalMetrics: number;
};
```

Defined in: [defi/protocols/src/modules/tool-marketplace/analytics/timeseries.ts:579](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/modules/tool-marketplace/analytics/timeseries.ts#L579)

Get storage statistics

###### Returns

```ts
{
  storageByGranularity: Record<Granularity, number>;
  totalDataPoints: number;
  totalMetrics: number;
}
```

| Name | Type | Defined in |
| :------ | :------ | :------ |
| `storageByGranularity` | `Record`\<[`Granularity`](/docs/api/defi/protocols/src/modules/tool-marketplace/analytics/timeseries.md#granularity-2), `number`\> | [defi/protocols/src/modules/tool-marketplace/analytics/timeseries.ts:582](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/modules/tool-marketplace/analytics/timeseries.ts#L582) |
| `totalDataPoints` | `number` | [defi/protocols/src/modules/tool-marketplace/analytics/timeseries.ts:581](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/modules/tool-marketplace/analytics/timeseries.ts#L581) |
| `totalMetrics` | `number` | [defi/protocols/src/modules/tool-marketplace/analytics/timeseries.ts:580](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/modules/tool-marketplace/analytics/timeseries.ts#L580) |

##### getSummary()

```ts
getSummary(
   metricName: string, 
   startTime: number, 
   endTime: number): AggregatedDataPoint;
```

Defined in: [defi/protocols/src/modules/tool-marketplace/analytics/timeseries.ts:434](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/modules/tool-marketplace/analytics/timeseries.ts#L434)

Get aggregated summary for a time range

###### Parameters

| Parameter | Type |
| :------ | :------ |
| `metricName` | `string` |
| `startTime` | `number` |
| `endTime` | `number` |

###### Returns

[`AggregatedDataPoint`](/docs/api/defi/protocols/src/modules/tool-marketplace/analytics/timeseries.md#aggregateddatapoint)

##### query()

```ts
query(metricName: string, options: TimeSeriesQueryOptions): AggregatedDataPoint[];
```

Defined in: [defi/protocols/src/modules/tool-marketplace/analytics/timeseries.ts:354](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/modules/tool-marketplace/analytics/timeseries.ts#L354)

Query time series data

###### Parameters

| Parameter | Type |
| :------ | :------ |
| `metricName` | `string` |
| `options` | [`TimeSeriesQueryOptions`](/docs/api/defi/protocols/src/modules/tool-marketplace/analytics/timeseries.md#timeseriesqueryoptions) |

###### Returns

[`AggregatedDataPoint`](/docs/api/defi/protocols/src/modules/tool-marketplace/analytics/timeseries.md#aggregateddatapoint)[]

##### record()

```ts
record(
   metricName: string, 
   value: number, 
   metadata?: Record<string, unknown>): void;
```

Defined in: [defi/protocols/src/modules/tool-marketplace/analytics/timeseries.ts:303](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/modules/tool-marketplace/analytics/timeseries.ts#L303)

Record a data point

###### Parameters

| Parameter | Type |
| :------ | :------ |
| `metricName` | `string` |
| `value` | `number` |
| `metadata?` | `Record`\<`string`, `unknown`\> |

###### Returns

`void`

##### recordBatch()

```ts
recordBatch(metricName: string, points: {
  metadata?: Record<string, unknown>;
  timestamp?: number;
  value: number;
}[]): void;
```

Defined in: [defi/protocols/src/modules/tool-marketplace/analytics/timeseries.ts:324](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/modules/tool-marketplace/analytics/timeseries.ts#L324)

Record multiple data points

###### Parameters

| Parameter | Type |
| :------ | :------ |
| `metricName` | `string` |
| `points` | \{ `metadata?`: `Record`\<`string`, `unknown`\>; `timestamp?`: `number`; `value`: `number`; \}[] |

###### Returns

`void`

##### registerMetric()

```ts
registerMetric(definition: MetricDefinition): void;
```

Defined in: [defi/protocols/src/modules/tool-marketplace/analytics/timeseries.ts:283](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/modules/tool-marketplace/analytics/timeseries.ts#L283)

Register a new metric

###### Parameters

| Parameter | Type |
| :------ | :------ |
| `definition` | [`MetricDefinition`](/docs/api/defi/protocols/src/modules/tool-marketplace/analytics/timeseries.md#metricdefinition) |

###### Returns

`void`

##### runRollup()

```ts
runRollup(): void;
```

Defined in: [defi/protocols/src/modules/tool-marketplace/analytics/timeseries.ts:457](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/modules/tool-marketplace/analytics/timeseries.ts#L457)

Run rollup from raw data to aggregated buckets

###### Returns

`void`

##### startRollup()

```ts
startRollup(intervalMs: number): void;
```

Defined in: [defi/protocols/src/modules/tool-marketplace/analytics/timeseries.ts:258](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/modules/tool-marketplace/analytics/timeseries.ts#L258)

Start automatic rollup and cleanup

###### Parameters

| Parameter | Type | Default value |
| :------ | :------ | :------ |
| `intervalMs` | `number` | `60000` |

###### Returns

`void`

##### stopRollup()

```ts
stopRollup(): void;
```

Defined in: [defi/protocols/src/modules/tool-marketplace/analytics/timeseries.ts:272](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/modules/tool-marketplace/analytics/timeseries.ts#L272)

Stop automatic rollup

###### Returns

`void`

## Interfaces

### AggregatedDataPoint

Defined in: [defi/protocols/src/modules/tool-marketplace/analytics/timeseries.ts:40](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/modules/tool-marketplace/analytics/timeseries.ts#L40)

Aggregated data point with statistics

#### Properties

| Property | Type | Description | Defined in |
| :------ | :------ | :------ | :------ |
| <a id="avg"></a> `avg` | `number` | Average value | [defi/protocols/src/modules/tool-marketplace/analytics/timeseries.ts:50](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/modules/tool-marketplace/analytics/timeseries.ts#L50) |
| <a id="count"></a> `count` | `number` | Number of data points | [defi/protocols/src/modules/tool-marketplace/analytics/timeseries.ts:46](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/modules/tool-marketplace/analytics/timeseries.ts#L46) |
| <a id="endtimestamp"></a> `endTimestamp` | `number` | End of time bucket (Unix ms) | [defi/protocols/src/modules/tool-marketplace/analytics/timeseries.ts:44](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/modules/tool-marketplace/analytics/timeseries.ts#L44) |
| <a id="max"></a> `max` | `number` | Maximum value | [defi/protocols/src/modules/tool-marketplace/analytics/timeseries.ts:54](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/modules/tool-marketplace/analytics/timeseries.ts#L54) |
| <a id="min"></a> `min` | `number` | Minimum value | [defi/protocols/src/modules/tool-marketplace/analytics/timeseries.ts:52](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/modules/tool-marketplace/analytics/timeseries.ts#L52) |
| <a id="percentiles"></a> `percentiles` | \{ `p50`: `number`; `p95`: `number`; `p99`: `number`; \} | Percentile values (p50, p95, p99) | [defi/protocols/src/modules/tool-marketplace/analytics/timeseries.ts:58](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/modules/tool-marketplace/analytics/timeseries.ts#L58) |
| `percentiles.p50` | `number` | - | [defi/protocols/src/modules/tool-marketplace/analytics/timeseries.ts:59](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/modules/tool-marketplace/analytics/timeseries.ts#L59) |
| `percentiles.p95` | `number` | - | [defi/protocols/src/modules/tool-marketplace/analytics/timeseries.ts:60](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/modules/tool-marketplace/analytics/timeseries.ts#L60) |
| `percentiles.p99` | `number` | - | [defi/protocols/src/modules/tool-marketplace/analytics/timeseries.ts:61](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/modules/tool-marketplace/analytics/timeseries.ts#L61) |
| <a id="stddev"></a> `stddev` | `number` | Standard deviation | [defi/protocols/src/modules/tool-marketplace/analytics/timeseries.ts:56](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/modules/tool-marketplace/analytics/timeseries.ts#L56) |
| <a id="sum"></a> `sum` | `number` | Sum of values | [defi/protocols/src/modules/tool-marketplace/analytics/timeseries.ts:48](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/modules/tool-marketplace/analytics/timeseries.ts#L48) |
| <a id="timestamp"></a> `timestamp` | `number` | Start of time bucket (Unix ms) | [defi/protocols/src/modules/tool-marketplace/analytics/timeseries.ts:42](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/modules/tool-marketplace/analytics/timeseries.ts#L42) |

***

### DataPoint

Defined in: [defi/protocols/src/modules/tool-marketplace/analytics/timeseries.ts:28](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/modules/tool-marketplace/analytics/timeseries.ts#L28)

Time series data point

#### Properties

| Property | Type | Description | Defined in |
| :------ | :------ | :------ | :------ |
| <a id="metadata"></a> `metadata?` | `Record`\<`string`, `unknown`\> | Optional metadata | [defi/protocols/src/modules/tool-marketplace/analytics/timeseries.ts:34](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/modules/tool-marketplace/analytics/timeseries.ts#L34) |
| <a id="timestamp-1"></a> `timestamp` | `number` | Timestamp (Unix ms) | [defi/protocols/src/modules/tool-marketplace/analytics/timeseries.ts:30](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/modules/tool-marketplace/analytics/timeseries.ts#L30) |
| <a id="value"></a> `value` | `number` | Metric value | [defi/protocols/src/modules/tool-marketplace/analytics/timeseries.ts:32](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/modules/tool-marketplace/analytics/timeseries.ts#L32) |

***

### MetricDefinition

Defined in: [defi/protocols/src/modules/tool-marketplace/analytics/timeseries.ts:84](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/modules/tool-marketplace/analytics/timeseries.ts#L84)

Metric definition

#### Properties

| Property | Type | Description | Defined in |
| :------ | :------ | :------ | :------ |
| <a id="description"></a> `description` | `string` | Description | [defi/protocols/src/modules/tool-marketplace/analytics/timeseries.ts:88](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/modules/tool-marketplace/analytics/timeseries.ts#L88) |
| <a id="name"></a> `name` | `string` | Metric name | [defi/protocols/src/modules/tool-marketplace/analytics/timeseries.ts:86](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/modules/tool-marketplace/analytics/timeseries.ts#L86) |
| <a id="tags"></a> `tags?` | `Record`\<`string`, `string`\> | Tags for filtering | [defi/protocols/src/modules/tool-marketplace/analytics/timeseries.ts:92](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/modules/tool-marketplace/analytics/timeseries.ts#L92) |
| <a id="unit"></a> `unit` | `string` | Unit of measurement | [defi/protocols/src/modules/tool-marketplace/analytics/timeseries.ts:90](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/modules/tool-marketplace/analytics/timeseries.ts#L90) |

***

### RetentionPolicy

Defined in: [defi/protocols/src/modules/tool-marketplace/analytics/timeseries.ts:18](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/modules/tool-marketplace/analytics/timeseries.ts#L18)

Retention policy configuration

#### Properties

| Property | Type | Description | Defined in |
| :------ | :------ | :------ | :------ |
| <a id="granularity"></a> `granularity` | [`Granularity`](/docs/api/defi/protocols/src/modules/tool-marketplace/analytics/timeseries.md#granularity-2) | Granularity level | [defi/protocols/src/modules/tool-marketplace/analytics/timeseries.ts:20](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/modules/tool-marketplace/analytics/timeseries.ts#L20) |
| <a id="retentionms"></a> `retentionMs` | `number` | Retention duration in milliseconds | [defi/protocols/src/modules/tool-marketplace/analytics/timeseries.ts:22](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/modules/tool-marketplace/analytics/timeseries.ts#L22) |

***

### TimeSeriesQueryOptions

Defined in: [defi/protocols/src/modules/tool-marketplace/analytics/timeseries.ts:68](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/modules/tool-marketplace/analytics/timeseries.ts#L68)

Time series query options

#### Properties

| Property | Type | Description | Defined in |
| :------ | :------ | :------ | :------ |
| <a id="endtime"></a> `endTime` | `number` | End time (Unix ms) | [defi/protocols/src/modules/tool-marketplace/analytics/timeseries.ts:72](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/modules/tool-marketplace/analytics/timeseries.ts#L72) |
| <a id="granularity-1"></a> `granularity?` | [`Granularity`](/docs/api/defi/protocols/src/modules/tool-marketplace/analytics/timeseries.md#granularity-2) | Desired granularity | [defi/protocols/src/modules/tool-marketplace/analytics/timeseries.ts:74](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/modules/tool-marketplace/analytics/timeseries.ts#L74) |
| <a id="metricname"></a> `metricName?` | `string` | Metric name filter | [defi/protocols/src/modules/tool-marketplace/analytics/timeseries.ts:76](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/modules/tool-marketplace/analytics/timeseries.ts#L76) |
| <a id="starttime"></a> `startTime` | `number` | Start time (Unix ms) | [defi/protocols/src/modules/tool-marketplace/analytics/timeseries.ts:70](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/modules/tool-marketplace/analytics/timeseries.ts#L70) |
| <a id="tags-1"></a> `tags?` | `Record`\<`string`, `string`\> | Tags filter | [defi/protocols/src/modules/tool-marketplace/analytics/timeseries.ts:78](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/modules/tool-marketplace/analytics/timeseries.ts#L78) |

## Type Aliases

### Granularity

```ts
type Granularity = "minute" | "hour" | "day" | "week" | "month";
```

Defined in: [defi/protocols/src/modules/tool-marketplace/analytics/timeseries.ts:13](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/modules/tool-marketplace/analytics/timeseries.ts#L13)

Granularity levels for time series data

## Variables

### timeseriesDB

```ts
const timeseriesDB: TimeSeriesDB;
```

Defined in: [defi/protocols/src/modules/tool-marketplace/analytics/timeseries.ts:654](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/modules/tool-marketplace/analytics/timeseries.ts#L654)
