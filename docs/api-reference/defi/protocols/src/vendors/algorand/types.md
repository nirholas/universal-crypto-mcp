[**Universal Crypto MCP API Reference v1.0.0**](../../../../../index.md)

***

[Universal Crypto MCP API Reference](/docs/api/index.md) / defi/protocols/src/vendors/algorand/types

# defi/protocols/src/vendors/algorand/types

## Interfaces

### AccountDetails

Defined in: [defi/protocols/src/vendors/algorand/types.ts:22](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/vendors/algorand/types.ts#L22)

#### Properties

| Property | Type | Defined in |
| :------ | :------ | :------ |
| <a id="address"></a> `address` | `string` | [defi/protocols/src/vendors/algorand/types.ts:23](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/vendors/algorand/types.ts#L23) |
| <a id="amount"></a> `amount` | `number` | [defi/protocols/src/vendors/algorand/types.ts:24](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/vendors/algorand/types.ts#L24) |
| <a id="assets"></a> `assets` | \{ `amount`: `number`; `assetId`: `number`; \}[] | [defi/protocols/src/vendors/algorand/types.ts:25](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/vendors/algorand/types.ts#L25) |
| <a id="authaddress"></a> `authAddress?` | `string` | [defi/protocols/src/vendors/algorand/types.ts:29](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/vendors/algorand/types.ts#L29) |

***

### ApplicationState

Defined in: [defi/protocols/src/vendors/algorand/types.ts:49](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/vendors/algorand/types.ts#L49)

#### Properties

| Property | Type | Defined in |
| :------ | :------ | :------ |
| <a id="appid"></a> `appId` | `number` | [defi/protocols/src/vendors/algorand/types.ts:50](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/vendors/algorand/types.ts#L50) |
| <a id="globalstate"></a> `globalState` | `Record`\<`string`, `any`\> | [defi/protocols/src/vendors/algorand/types.ts:51](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/vendors/algorand/types.ts#L51) |
| <a id="localstate"></a> `localState?` | `Record`\<`string`, `any`\> | [defi/protocols/src/vendors/algorand/types.ts:52](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/vendors/algorand/types.ts#L52) |

***

### AssetHolding

Defined in: [defi/protocols/src/vendors/algorand/types.ts:42](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/vendors/algorand/types.ts#L42)

#### Properties

| Property | Type | Defined in |
| :------ | :------ | :------ |
| <a id="amount-1"></a> `amount` | `number` | [defi/protocols/src/vendors/algorand/types.ts:44](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/vendors/algorand/types.ts#L44) |
| <a id="assetid"></a> `assetId` | `number` | [defi/protocols/src/vendors/algorand/types.ts:43](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/vendors/algorand/types.ts#L43) |
| <a id="creator"></a> `creator` | `string` | [defi/protocols/src/vendors/algorand/types.ts:45](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/vendors/algorand/types.ts#L45) |
| <a id="frozen"></a> `frozen` | `boolean` | [defi/protocols/src/vendors/algorand/types.ts:46](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/vendors/algorand/types.ts#L46) |

***

### CreateAccountResult

Defined in: [defi/protocols/src/vendors/algorand/types.ts:7](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/vendors/algorand/types.ts#L7)

#### Properties

| Property | Type | Defined in |
| :------ | :------ | :------ |
| <a id="address-1"></a> `address` | `string` | [defi/protocols/src/vendors/algorand/types.ts:8](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/vendors/algorand/types.ts#L8) |
| <a id="privatekey"></a> `privateKey` | `string` | [defi/protocols/src/vendors/algorand/types.ts:9](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/vendors/algorand/types.ts#L9) |

***

### RekeyAccountParams

Defined in: [defi/protocols/src/vendors/algorand/types.ts:12](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/vendors/algorand/types.ts#L12)

#### Properties

| Property | Type | Defined in |
| :------ | :------ | :------ |
| <a id="sourceaddress"></a> `sourceAddress` | `string` | [defi/protocols/src/vendors/algorand/types.ts:13](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/vendors/algorand/types.ts#L13) |
| <a id="targetaddress"></a> `targetAddress` | `string` | [defi/protocols/src/vendors/algorand/types.ts:14](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/vendors/algorand/types.ts#L14) |

***

### RekeyAccountResult

Defined in: [defi/protocols/src/vendors/algorand/types.ts:17](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/vendors/algorand/types.ts#L17)

#### Properties

| Property | Type | Defined in |
| :------ | :------ | :------ |
| <a id="signedtxn"></a> `signedTxn` | `string` | [defi/protocols/src/vendors/algorand/types.ts:19](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/vendors/algorand/types.ts#L19) |
| <a id="txid"></a> `txId` | `string` | [defi/protocols/src/vendors/algorand/types.ts:18](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/vendors/algorand/types.ts#L18) |

***

### TransactionInfo

Defined in: [defi/protocols/src/vendors/algorand/types.ts:32](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/vendors/algorand/types.ts#L32)

#### Properties

| Property | Type | Defined in |
| :------ | :------ | :------ |
| <a id="amount-2"></a> `amount?` | `number` | [defi/protocols/src/vendors/algorand/types.ts:37](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/vendors/algorand/types.ts#L37) |
| <a id="assetid-1"></a> `assetId?` | `number` | [defi/protocols/src/vendors/algorand/types.ts:38](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/vendors/algorand/types.ts#L38) |
| <a id="id"></a> `id` | `string` | [defi/protocols/src/vendors/algorand/types.ts:33](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/vendors/algorand/types.ts#L33) |
| <a id="receiver"></a> `receiver?` | `string` | [defi/protocols/src/vendors/algorand/types.ts:36](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/vendors/algorand/types.ts#L36) |
| <a id="sender"></a> `sender` | `string` | [defi/protocols/src/vendors/algorand/types.ts:35](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/vendors/algorand/types.ts#L35) |
| <a id="timestamp"></a> `timestamp` | `string` | [defi/protocols/src/vendors/algorand/types.ts:39](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/vendors/algorand/types.ts#L39) |
| <a id="type"></a> `type` | `string` | [defi/protocols/src/vendors/algorand/types.ts:34](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/vendors/algorand/types.ts#L34) |
