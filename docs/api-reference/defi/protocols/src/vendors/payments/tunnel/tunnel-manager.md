[**Universal Crypto MCP API Reference v1.0.0**](../../../../../../index.md)

***

[Universal Crypto MCP API Reference](/docs/api/index.md) / defi/protocols/src/vendors/payments/tunnel/tunnel-manager

# defi/protocols/src/vendors/payments/tunnel/tunnel-manager

## Enumerations

### TunnelProvider

Defined in: [defi/protocols/src/vendors/payments/tunnel/tunnel-manager.ts:15](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/vendors/payments/tunnel/tunnel-manager.ts#L15)

#### Enumeration Members

| Enumeration Member | Value | Defined in |
| :------ | :------ | :------ |
| <a id="manual"></a> `MANUAL` | `"manual"` | [defi/protocols/src/vendors/payments/tunnel/tunnel-manager.ts:18](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/vendors/payments/tunnel/tunnel-manager.ts#L18) |
| <a id="ngrok"></a> `NGROK` | `"ngrok"` | [defi/protocols/src/vendors/payments/tunnel/tunnel-manager.ts:16](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/vendors/payments/tunnel/tunnel-manager.ts#L16) |
| <a id="zrok"></a> `ZROK` | `"zrok"` | [defi/protocols/src/vendors/payments/tunnel/tunnel-manager.ts:17](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/vendors/payments/tunnel/tunnel-manager.ts#L17) |

***

### TunnelStatus

Defined in: [defi/protocols/src/vendors/payments/tunnel/tunnel-manager.ts:21](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/vendors/payments/tunnel/tunnel-manager.ts#L21)

#### Enumeration Members

| Enumeration Member | Value | Defined in |
| :------ | :------ | :------ |
| <a id="connected"></a> `CONNECTED` | `"connected"` | [defi/protocols/src/vendors/payments/tunnel/tunnel-manager.ts:24](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/vendors/payments/tunnel/tunnel-manager.ts#L24) |
| <a id="connecting"></a> `CONNECTING` | `"connecting"` | [defi/protocols/src/vendors/payments/tunnel/tunnel-manager.ts:23](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/vendors/payments/tunnel/tunnel-manager.ts#L23) |
| <a id="disconnected"></a> `DISCONNECTED` | `"disconnected"` | [defi/protocols/src/vendors/payments/tunnel/tunnel-manager.ts:22](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/vendors/payments/tunnel/tunnel-manager.ts#L22) |
| <a id="error"></a> `ERROR` | `"error"` | [defi/protocols/src/vendors/payments/tunnel/tunnel-manager.ts:26](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/vendors/payments/tunnel/tunnel-manager.ts#L26) |
| <a id="reconnecting"></a> `RECONNECTING` | `"reconnecting"` | [defi/protocols/src/vendors/payments/tunnel/tunnel-manager.ts:25](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/vendors/payments/tunnel/tunnel-manager.ts#L25) |

## Classes

### TunnelManager

Defined in: [defi/protocols/src/vendors/payments/tunnel/tunnel-manager.ts:453](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/vendors/payments/tunnel/tunnel-manager.ts#L453)

Tunnel Manager - Factory and lifecycle management

#### Constructors

##### Constructor

```ts
new TunnelManager(config: TunnelConfiguration): TunnelManager;
```

Defined in: [defi/protocols/src/vendors/payments/tunnel/tunnel-manager.ts:457](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/vendors/payments/tunnel/tunnel-manager.ts#L457)

###### Parameters

| Parameter | Type |
| :------ | :------ |
| `config` | [`TunnelConfiguration`](/docs/api/defi/protocols/src/vendors/payments/tunnel/tunnel-manager.md#tunnelconfiguration) |

###### Returns

[`TunnelManager`](/docs/api/defi/protocols/src/vendors/payments/tunnel/tunnel-manager.md#tunnelmanager)

#### Methods

##### getInfo()

```ts
getInfo(): 
  | TunnelInfo
  | null;
```

Defined in: [defi/protocols/src/vendors/payments/tunnel/tunnel-manager.ts:515](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/vendors/payments/tunnel/tunnel-manager.ts#L515)

###### Returns

  \| [`TunnelInfo`](/docs/api/defi/protocols/src/vendors/payments/tunnel/tunnel-manager.md#tunnelinfo)
  \| `null`

##### getPublicUrl()

```ts
getPublicUrl(): string | null;
```

Defined in: [defi/protocols/src/vendors/payments/tunnel/tunnel-manager.ts:529](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/vendors/payments/tunnel/tunnel-manager.ts#L529)

###### Returns

`string` \| `null`

##### isConnected()

```ts
isConnected(): boolean;
```

Defined in: [defi/protocols/src/vendors/payments/tunnel/tunnel-manager.ts:522](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/vendors/payments/tunnel/tunnel-manager.ts#L522)

###### Returns

`boolean`

##### start()

```ts
start(): Promise<string>;
```

Defined in: [defi/protocols/src/vendors/payments/tunnel/tunnel-manager.ts:473](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/vendors/payments/tunnel/tunnel-manager.ts#L473)

###### Returns

`Promise`\<`string`\>

##### stop()

```ts
stop(): Promise<void>;
```

Defined in: [defi/protocols/src/vendors/payments/tunnel/tunnel-manager.ts:505](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/vendors/payments/tunnel/tunnel-manager.ts#L505)

###### Returns

`Promise`\<`void`\>

## Interfaces

### TunnelConfiguration

Defined in: [defi/protocols/src/vendors/payments/tunnel/tunnel-manager.ts:29](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/vendors/payments/tunnel/tunnel-manager.ts#L29)

#### Properties

| Property | Type | Defined in |
| :------ | :------ | :------ |
| <a id="enabled"></a> `enabled` | `boolean` | [defi/protocols/src/vendors/payments/tunnel/tunnel-manager.ts:30](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/vendors/payments/tunnel/tunnel-manager.ts#L30) |
| <a id="healthcheckinterval"></a> `healthCheckInterval` | `number` | [defi/protocols/src/vendors/payments/tunnel/tunnel-manager.ts:44](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/vendors/payments/tunnel/tunnel-manager.ts#L44) |
| <a id="localport"></a> `localPort` | `number` | [defi/protocols/src/vendors/payments/tunnel/tunnel-manager.ts:32](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/vendors/payments/tunnel/tunnel-manager.ts#L32) |
| <a id="ngrokauthtoken"></a> `ngrokAuthToken?` | `string` | [defi/protocols/src/vendors/payments/tunnel/tunnel-manager.ts:36](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/vendors/payments/tunnel/tunnel-manager.ts#L36) |
| <a id="ngrokdomain"></a> `ngrokDomain?` | `string` | [defi/protocols/src/vendors/payments/tunnel/tunnel-manager.ts:37](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/vendors/payments/tunnel/tunnel-manager.ts#L37) |
| <a id="provider"></a> `provider` | [`TunnelProvider`](/docs/api/defi/protocols/src/vendors/payments/tunnel/tunnel-manager.md#tunnelprovider) | [defi/protocols/src/vendors/payments/tunnel/tunnel-manager.ts:31](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/vendors/payments/tunnel/tunnel-manager.ts#L31) |
| <a id="publicurl"></a> `publicUrl?` | `string` | [defi/protocols/src/vendors/payments/tunnel/tunnel-manager.ts:33](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/vendors/payments/tunnel/tunnel-manager.ts#L33) |
| <a id="reconnectbackoffms"></a> `reconnectBackoffMs` | `number` | [defi/protocols/src/vendors/payments/tunnel/tunnel-manager.ts:46](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/vendors/payments/tunnel/tunnel-manager.ts#L46) |
| <a id="reconnectmaxretries"></a> `reconnectMaxRetries` | `number` | [defi/protocols/src/vendors/payments/tunnel/tunnel-manager.ts:45](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/vendors/payments/tunnel/tunnel-manager.ts#L45) |
| <a id="zroktoken"></a> `zrokToken?` | `string` | [defi/protocols/src/vendors/payments/tunnel/tunnel-manager.ts:40](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/vendors/payments/tunnel/tunnel-manager.ts#L40) |
| <a id="zrokuniquename"></a> `zrokUniqueName?` | `string` | [defi/protocols/src/vendors/payments/tunnel/tunnel-manager.ts:41](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/vendors/payments/tunnel/tunnel-manager.ts#L41) |

***

### TunnelInfo

Defined in: [defi/protocols/src/vendors/payments/tunnel/tunnel-manager.ts:49](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/vendors/payments/tunnel/tunnel-manager.ts#L49)

#### Properties

| Property | Type | Defined in |
| :------ | :------ | :------ |
| <a id="connectedat"></a> `connectedAt` | `Date` \| `null` | [defi/protocols/src/vendors/payments/tunnel/tunnel-manager.ts:53](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/vendors/payments/tunnel/tunnel-manager.ts#L53) |
| <a id="healthcheckenabled"></a> `healthCheckEnabled` | `boolean` | [defi/protocols/src/vendors/payments/tunnel/tunnel-manager.ts:56](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/vendors/payments/tunnel/tunnel-manager.ts#L56) |
| <a id="lasterror"></a> `lastError` | `string` \| `null` | [defi/protocols/src/vendors/payments/tunnel/tunnel-manager.ts:54](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/vendors/payments/tunnel/tunnel-manager.ts#L54) |
| <a id="provider-1"></a> `provider` | [`TunnelProvider`](/docs/api/defi/protocols/src/vendors/payments/tunnel/tunnel-manager.md#tunnelprovider) | [defi/protocols/src/vendors/payments/tunnel/tunnel-manager.ts:50](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/vendors/payments/tunnel/tunnel-manager.ts#L50) |
| <a id="publicurl-1"></a> `publicUrl` | `string` \| `null` | [defi/protocols/src/vendors/payments/tunnel/tunnel-manager.ts:52](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/vendors/payments/tunnel/tunnel-manager.ts#L52) |
| <a id="reconnectattempts"></a> `reconnectAttempts` | `number` | [defi/protocols/src/vendors/payments/tunnel/tunnel-manager.ts:55](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/vendors/payments/tunnel/tunnel-manager.ts#L55) |
| <a id="status"></a> `status` | [`TunnelStatus`](/docs/api/defi/protocols/src/vendors/payments/tunnel/tunnel-manager.md#tunnelstatus) | [defi/protocols/src/vendors/payments/tunnel/tunnel-manager.ts:51](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/vendors/payments/tunnel/tunnel-manager.ts#L51) |

## References

### default

Renames and re-exports [TunnelManager](/docs/api/defi/protocols/src/vendors/payments/tunnel/tunnel-manager.md#tunnelmanager)
