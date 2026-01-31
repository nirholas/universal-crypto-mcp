[**Universal Crypto MCP API Reference v1.0.0**](../../../../../index.md)

***

[Universal Crypto MCP API Reference](/docs/api/index.md) / defi/protocols/src/vendors/payments/types

# defi/protocols/src/vendors/payments/types

## Interfaces

### ApiError

Defined in: [defi/protocols/src/vendors/payments/types/index.ts:207](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/vendors/payments/types/index.ts#L207)

#### Properties

| Property | Type | Defined in |
| :------ | :------ | :------ |
| <a id="code"></a> `code` | `string` | [defi/protocols/src/vendors/payments/types/index.ts:208](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/vendors/payments/types/index.ts#L208) |
| <a id="details"></a> `details?` | `unknown` | [defi/protocols/src/vendors/payments/types/index.ts:211](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/vendors/payments/types/index.ts#L211) |
| <a id="message"></a> `message` | `string` | [defi/protocols/src/vendors/payments/types/index.ts:209](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/vendors/payments/types/index.ts#L209) |
| <a id="statuscode"></a> `statusCode` | `number` | [defi/protocols/src/vendors/payments/types/index.ts:210](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/vendors/payments/types/index.ts#L210) |

***

### APIError

Defined in: [defi/protocols/src/vendors/payments/types/index.ts:200](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/vendors/payments/types/index.ts#L200)

#### Properties

| Property | Type | Defined in |
| :------ | :------ | :------ |
| <a id="code-1"></a> `code` | `string` | [defi/protocols/src/vendors/payments/types/index.ts:201](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/vendors/payments/types/index.ts#L201) |
| <a id="details-1"></a> `details?` | `Record`\<`string`, `unknown`\> | [defi/protocols/src/vendors/payments/types/index.ts:204](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/vendors/payments/types/index.ts#L204) |
| <a id="httpstatus"></a> `httpStatus` | `number` | [defi/protocols/src/vendors/payments/types/index.ts:203](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/vendors/payments/types/index.ts#L203) |
| <a id="message-1"></a> `message` | `string` | [defi/protocols/src/vendors/payments/types/index.ts:202](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/vendors/payments/types/index.ts#L202) |

***

### BitnovoCurrenciesResponse

Defined in: [defi/protocols/src/vendors/payments/types/index.ts:275](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/vendors/payments/types/index.ts#L275)

#### Properties

| Property | Type | Defined in |
| :------ | :------ | :------ |
| <a id="currencies"></a> `currencies` | [`BitnovoCurrencyResponse`](/docs/api/defi/protocols/src/vendors/payments/types.md#bitnovocurrencyresponse)[] | [defi/protocols/src/vendors/payments/types/index.ts:276](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/vendors/payments/types/index.ts#L276) |

***

### BitnovoCurrencyResponse

Defined in: [defi/protocols/src/vendors/payments/types/index.ts:263](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/vendors/payments/types/index.ts#L263)

#### Properties

| Property | Type | Defined in |
| :------ | :------ | :------ |
| <a id="blockchain"></a> `blockchain` | `string` | [defi/protocols/src/vendors/payments/types/index.ts:269](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/vendors/payments/types/index.ts#L269) |
| <a id="image"></a> `image` | `string` | [defi/protocols/src/vendors/payments/types/index.ts:268](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/vendors/payments/types/index.ts#L268) |
| <a id="max_amount"></a> `max_amount` | `number` \| `null` | [defi/protocols/src/vendors/payments/types/index.ts:267](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/vendors/payments/types/index.ts#L267) |
| <a id="min_amount"></a> `min_amount` | `number` | [defi/protocols/src/vendors/payments/types/index.ts:266](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/vendors/payments/types/index.ts#L266) |
| <a id="name"></a> `name` | `string` | [defi/protocols/src/vendors/payments/types/index.ts:265](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/vendors/payments/types/index.ts#L265) |
| <a id="original_blockchain"></a> `original_blockchain` | `string` | [defi/protocols/src/vendors/payments/types/index.ts:271](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/vendors/payments/types/index.ts#L271) |
| <a id="original_symbol"></a> `original_symbol` | `string` | [defi/protocols/src/vendors/payments/types/index.ts:270](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/vendors/payments/types/index.ts#L270) |
| <a id="symbol"></a> `symbol` | `string` | [defi/protocols/src/vendors/payments/types/index.ts:264](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/vendors/payments/types/index.ts#L264) |

***

### BitnovoStatusResponse

Defined in: [defi/protocols/src/vendors/payments/types/index.ts:254](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/vendors/payments/types/index.ts#L254)

#### Properties

| Property | Type | Defined in |
| :------ | :------ | :------ |
| <a id="confirmed_amount"></a> `confirmed_amount?` | `number` | [defi/protocols/src/vendors/payments/types/index.ts:257](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/vendors/payments/types/index.ts#L257) |
| <a id="crypto_amount"></a> `crypto_amount?` | `number` | [defi/protocols/src/vendors/payments/types/index.ts:259](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/vendors/payments/types/index.ts#L259) |
| <a id="expired_time"></a> `expired_time?` | `string` | [defi/protocols/src/vendors/payments/types/index.ts:260](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/vendors/payments/types/index.ts#L260) |
| <a id="identifier"></a> `identifier` | `string` | [defi/protocols/src/vendors/payments/types/index.ts:255](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/vendors/payments/types/index.ts#L255) |
| <a id="status"></a> `status` | [`PaymentStatusCode`](/docs/api/defi/protocols/src/vendors/payments/types.md#paymentstatuscode) | [defi/protocols/src/vendors/payments/types/index.ts:256](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/vendors/payments/types/index.ts#L256) |
| <a id="unconfirmed_amount"></a> `unconfirmed_amount?` | `number` | [defi/protocols/src/vendors/payments/types/index.ts:258](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/vendors/payments/types/index.ts#L258) |

***

### Configuration

Defined in: [defi/protocols/src/vendors/payments/types/index.ts:215](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/vendors/payments/types/index.ts#L215)

#### Properties

| Property | Type | Defined in |
| :------ | :------ | :------ |
| <a id="apitimeout"></a> `apiTimeout` | `number` | [defi/protocols/src/vendors/payments/types/index.ts:221](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/vendors/payments/types/index.ts#L221) |
| <a id="baseurl"></a> `baseUrl` | `string` | [defi/protocols/src/vendors/payments/types/index.ts:217](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/vendors/payments/types/index.ts#L217) |
| <a id="deviceid"></a> `deviceId` | `string` | [defi/protocols/src/vendors/payments/types/index.ts:216](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/vendors/payments/types/index.ts#L216) |
| <a id="devicesecret"></a> `deviceSecret?` | `string` | [defi/protocols/src/vendors/payments/types/index.ts:218](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/vendors/payments/types/index.ts#L218) |
| <a id="loglevel"></a> `logLevel` | `string` | [defi/protocols/src/vendors/payments/types/index.ts:219](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/vendors/payments/types/index.ts#L219) |
| <a id="maxretries"></a> `maxRetries` | `number` | [defi/protocols/src/vendors/payments/types/index.ts:222](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/vendors/payments/types/index.ts#L222) |
| <a id="ngrokauthtoken"></a> `ngrokAuthToken?` | `string` | [defi/protocols/src/vendors/payments/types/index.ts:233](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/vendors/payments/types/index.ts#L233) |
| <a id="ngrokdomain"></a> `ngrokDomain?` | `string` | [defi/protocols/src/vendors/payments/types/index.ts:234](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/vendors/payments/types/index.ts#L234) |
| <a id="nodeenv"></a> `nodeEnv` | `string` | [defi/protocols/src/vendors/payments/types/index.ts:220](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/vendors/payments/types/index.ts#L220) |
| <a id="retrydelay"></a> `retryDelay` | `number` | [defi/protocols/src/vendors/payments/types/index.ts:223](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/vendors/payments/types/index.ts#L223) |
| <a id="tunnelenabled"></a> `tunnelEnabled?` | `boolean` | [defi/protocols/src/vendors/payments/types/index.ts:230](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/vendors/payments/types/index.ts#L230) |
| <a id="tunnelhealthcheckinterval"></a> `tunnelHealthCheckInterval?` | `number` | [defi/protocols/src/vendors/payments/types/index.ts:237](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/vendors/payments/types/index.ts#L237) |
| <a id="tunnelprovider"></a> `tunnelProvider?` | `"manual"` \| `"ngrok"` \| `"zrok"` | [defi/protocols/src/vendors/payments/types/index.ts:231](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/vendors/payments/types/index.ts#L231) |
| <a id="tunnelpublicurl"></a> `tunnelPublicUrl?` | `string` | [defi/protocols/src/vendors/payments/types/index.ts:232](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/vendors/payments/types/index.ts#L232) |
| <a id="tunnelreconnectbackoffms"></a> `tunnelReconnectBackoffMs?` | `number` | [defi/protocols/src/vendors/payments/types/index.ts:239](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/vendors/payments/types/index.ts#L239) |
| <a id="tunnelreconnectmaxretries"></a> `tunnelReconnectMaxRetries?` | `number` | [defi/protocols/src/vendors/payments/types/index.ts:238](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/vendors/payments/types/index.ts#L238) |
| <a id="webhookenabled"></a> `webhookEnabled?` | `boolean` | [defi/protocols/src/vendors/payments/types/index.ts:225](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/vendors/payments/types/index.ts#L225) |
| <a id="webhookhost"></a> `webhookHost?` | `string` | [defi/protocols/src/vendors/payments/types/index.ts:227](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/vendors/payments/types/index.ts#L227) |
| <a id="webhookpath"></a> `webhookPath?` | `string` | [defi/protocols/src/vendors/payments/types/index.ts:228](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/vendors/payments/types/index.ts#L228) |
| <a id="webhookport"></a> `webhookPort?` | `number` | [defi/protocols/src/vendors/payments/types/index.ts:226](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/vendors/payments/types/index.ts#L226) |
| <a id="zroktoken"></a> `zrokToken?` | `string` | [defi/protocols/src/vendors/payments/types/index.ts:235](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/vendors/payments/types/index.ts#L235) |
| <a id="zrokuniquename"></a> `zrokUniqueName?` | `string` | [defi/protocols/src/vendors/payments/types/index.ts:236](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/vendors/payments/types/index.ts#L236) |

***

### CreatePaymentOnchainInput

Defined in: [defi/protocols/src/vendors/payments/types/index.ts:89](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/vendors/payments/types/index.ts#L89)

#### Properties

| Property | Type | Defined in |
| :------ | :------ | :------ |
| <a id="amount_eur"></a> `amount_eur` | `number` | [defi/protocols/src/vendors/payments/types/index.ts:90](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/vendors/payments/types/index.ts#L90) |
| <a id="fiat"></a> `fiat?` | `string` | [defi/protocols/src/vendors/payments/types/index.ts:92](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/vendors/payments/types/index.ts#L92) |
| <a id="include_qr"></a> `include_qr?` | `boolean` | [defi/protocols/src/vendors/payments/types/index.ts:94](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/vendors/payments/types/index.ts#L94) |
| <a id="input_currency"></a> `input_currency` | `string` | [defi/protocols/src/vendors/payments/types/index.ts:91](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/vendors/payments/types/index.ts#L91) |
| <a id="notes"></a> `notes?` | `string` | [defi/protocols/src/vendors/payments/types/index.ts:93](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/vendors/payments/types/index.ts#L93) |

***

### CreatePaymentOnchainOutput

Defined in: [defi/protocols/src/vendors/payments/types/index.ts:97](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/vendors/payments/types/index.ts#L97)

#### Properties

| Property | Type | Description | Defined in |
| :------ | :------ | :------ | :------ |
| <a id="address"></a> `address?` | `string` | - | [defi/protocols/src/vendors/payments/types/index.ts:100](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/vendors/payments/types/index.ts#L100) |
| <a id="blockchain-1"></a> `blockchain?` | `string` | - | [defi/protocols/src/vendors/payments/types/index.ts:107](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/vendors/payments/types/index.ts#L107) |
| <a id="expected_input_amount"></a> `expected_input_amount?` | `number` | - | [defi/protocols/src/vendors/payments/types/index.ts:102](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/vendors/payments/types/index.ts#L102) |
| <a id="expiration_warning"></a> `expiration_warning?` | `string` | 🚨 CRITICAL - MUST DISPLAY TO USER 🚨 Pre-formatted bilingual expiration warning that MUST be shown to the user. This field contains the exact time remaining and expiration date. LLMs MUST copy this text verbatim into their response to users. Omitting this warning will cause payment failures. | [defi/protocols/src/vendors/payments/types/index.ts:118](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/vendors/payments/types/index.ts#L118) |
| <a id="expires_at"></a> `expires_at?` | `string` | - | [defi/protocols/src/vendors/payments/types/index.ts:109](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/vendors/payments/types/index.ts#L109) |
| <a id="expires_in_minutes"></a> `expires_in_minutes?` | `number` | - | [defi/protocols/src/vendors/payments/types/index.ts:110](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/vendors/payments/types/index.ts#L110) |
| <a id="identifier-1"></a> `identifier` | `string` | - | [defi/protocols/src/vendors/payments/types/index.ts:98](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/vendors/payments/types/index.ts#L98) |
| <a id="input_currency-1"></a> `input_currency` | `string` | - | [defi/protocols/src/vendors/payments/types/index.ts:104](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/vendors/payments/types/index.ts#L104) |
| <a id="original_blockchain-1"></a> `original_blockchain?` | `string` | - | [defi/protocols/src/vendors/payments/types/index.ts:106](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/vendors/payments/types/index.ts#L106) |
| <a id="original_symbol-1"></a> `original_symbol?` | `string` | - | [defi/protocols/src/vendors/payments/types/index.ts:105](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/vendors/payments/types/index.ts#L105) |
| <a id="payment_uri"></a> `payment_uri?` | `string` | - | [defi/protocols/src/vendors/payments/types/index.ts:101](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/vendors/payments/types/index.ts#L101) |
| <a id="qr_address"></a> `qr_address?` | [`QrCodeData`](/docs/api/defi/protocols/src/vendors/payments/types.md#qrcodedata) | - | [defi/protocols/src/vendors/payments/types/index.ts:119](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/vendors/payments/types/index.ts#L119) |
| <a id="qr_payment_uri"></a> `qr_payment_uri?` | [`QrCodeData`](/docs/api/defi/protocols/src/vendors/payments/types.md#qrcodedata) | - | [defi/protocols/src/vendors/payments/types/index.ts:120](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/vendors/payments/types/index.ts#L120) |
| <a id="rate"></a> `rate?` | `number` | - | [defi/protocols/src/vendors/payments/types/index.ts:103](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/vendors/payments/types/index.ts#L103) |
| <a id="tag_memo"></a> `tag_memo?` | `string` | - | [defi/protocols/src/vendors/payments/types/index.ts:108](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/vendors/payments/types/index.ts#L108) |
| <a id="web_url"></a> `web_url?` | `string` | - | [defi/protocols/src/vendors/payments/types/index.ts:99](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/vendors/payments/types/index.ts#L99) |

***

### CreatePaymentRedirectInput

Defined in: [defi/protocols/src/vendors/payments/types/index.ts:123](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/vendors/payments/types/index.ts#L123)

#### Properties

| Property | Type | Defined in |
| :------ | :------ | :------ |
| <a id="amount_eur-1"></a> `amount_eur` | `number` | [defi/protocols/src/vendors/payments/types/index.ts:124](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/vendors/payments/types/index.ts#L124) |
| <a id="fiat-1"></a> `fiat?` | `string` | [defi/protocols/src/vendors/payments/types/index.ts:127](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/vendors/payments/types/index.ts#L127) |
| <a id="include_qr-1"></a> `include_qr?` | `boolean` | [defi/protocols/src/vendors/payments/types/index.ts:129](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/vendors/payments/types/index.ts#L129) |
| <a id="notes-1"></a> `notes?` | `string` | [defi/protocols/src/vendors/payments/types/index.ts:128](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/vendors/payments/types/index.ts#L128) |
| <a id="url_ko"></a> `url_ko?` | `string` | [defi/protocols/src/vendors/payments/types/index.ts:126](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/vendors/payments/types/index.ts#L126) |
| <a id="url_ok"></a> `url_ok?` | `string` | [defi/protocols/src/vendors/payments/types/index.ts:125](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/vendors/payments/types/index.ts#L125) |

***

### CreatePaymentRedirectOutput

Defined in: [defi/protocols/src/vendors/payments/types/index.ts:132](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/vendors/payments/types/index.ts#L132)

#### Properties

| Property | Type | Defined in |
| :------ | :------ | :------ |
| <a id="identifier-2"></a> `identifier` | `string` | [defi/protocols/src/vendors/payments/types/index.ts:133](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/vendors/payments/types/index.ts#L133) |
| <a id="qr_web_url"></a> `qr_web_url?` | [`QrCodeData`](/docs/api/defi/protocols/src/vendors/payments/types.md#qrcodedata) | [defi/protocols/src/vendors/payments/types/index.ts:135](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/vendors/payments/types/index.ts#L135) |
| <a id="web_url-1"></a> `web_url` | `string` | [defi/protocols/src/vendors/payments/types/index.ts:134](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/vendors/payments/types/index.ts#L134) |

***

### Currency

Defined in: [defi/protocols/src/vendors/payments/types/index.ts:40](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/vendors/payments/types/index.ts#L40)

#### Properties

| Property | Type | Defined in |
| :------ | :------ | :------ |
| <a id="blockchain-2"></a> `blockchain` | `string` | [defi/protocols/src/vendors/payments/types/index.ts:46](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/vendors/payments/types/index.ts#L46) |
| <a id="currentrate"></a> `currentRate?` | `number` | [defi/protocols/src/vendors/payments/types/index.ts:52](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/vendors/payments/types/index.ts#L52) |
| <a id="decimals"></a> `decimals` | `number` | [defi/protocols/src/vendors/payments/types/index.ts:50](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/vendors/payments/types/index.ts#L50) |
| <a id="isactive"></a> `isActive` | `boolean` | [defi/protocols/src/vendors/payments/types/index.ts:51](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/vendors/payments/types/index.ts#L51) |
| <a id="maxamount"></a> `maxAmount` | `number` \| `null` | [defi/protocols/src/vendors/payments/types/index.ts:44](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/vendors/payments/types/index.ts#L44) |
| <a id="minamount"></a> `minAmount` | `number` | [defi/protocols/src/vendors/payments/types/index.ts:43](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/vendors/payments/types/index.ts#L43) |
| <a id="name-1"></a> `name` | `string` | [defi/protocols/src/vendors/payments/types/index.ts:42](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/vendors/payments/types/index.ts#L42) |
| <a id="network_image"></a> `network_image` | `string` | [defi/protocols/src/vendors/payments/types/index.ts:45](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/vendors/payments/types/index.ts#L45) |
| <a id="original_blockchain-2"></a> `original_blockchain` | `string` | [defi/protocols/src/vendors/payments/types/index.ts:48](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/vendors/payments/types/index.ts#L48) |
| <a id="original_symbol-2"></a> `original_symbol` | `string` | [defi/protocols/src/vendors/payments/types/index.ts:47](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/vendors/payments/types/index.ts#L47) |
| <a id="requiresmemo"></a> `requiresMemo` | `boolean` | [defi/protocols/src/vendors/payments/types/index.ts:49](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/vendors/payments/types/index.ts#L49) |
| <a id="symbol-1"></a> `symbol` | `string` | [defi/protocols/src/vendors/payments/types/index.ts:41](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/vendors/payments/types/index.ts#L41) |

***

### GeneratePaymentQrInput

Defined in: [defi/protocols/src/vendors/payments/types/index.ts:176](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/vendors/payments/types/index.ts#L176)

#### Properties

| Property | Type | Defined in |
| :------ | :------ | :------ |
| <a id="branding"></a> `branding?` | `boolean` | [defi/protocols/src/vendors/payments/types/index.ts:181](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/vendors/payments/types/index.ts#L181) |
| <a id="gateway_environment"></a> `gateway_environment?` | `"development"` \| `"testing"` \| `"production"` | [defi/protocols/src/vendors/payments/types/index.ts:182](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/vendors/payments/types/index.ts#L182) |
| <a id="identifier-3"></a> `identifier` | `string` | [defi/protocols/src/vendors/payments/types/index.ts:177](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/vendors/payments/types/index.ts#L177) |
| <a id="qr_type"></a> `qr_type?` | `"address"` \| `"payment_uri"` \| `"both"` \| `"gateway_url"` | [defi/protocols/src/vendors/payments/types/index.ts:178](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/vendors/payments/types/index.ts#L178) |
| <a id="size"></a> `size?` | `number` | [defi/protocols/src/vendors/payments/types/index.ts:179](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/vendors/payments/types/index.ts#L179) |
| <a id="style"></a> `style?` | `"basic"` \| `"branded"` | [defi/protocols/src/vendors/payments/types/index.ts:180](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/vendors/payments/types/index.ts#L180) |

***

### GeneratePaymentQrOutput

Defined in: [defi/protocols/src/vendors/payments/types/index.ts:192](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/vendors/payments/types/index.ts#L192)

#### Properties

| Property | Type | Defined in |
| :------ | :------ | :------ |
| <a id="identifier-4"></a> `identifier` | `string` | [defi/protocols/src/vendors/payments/types/index.ts:193](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/vendors/payments/types/index.ts#L193) |
| <a id="qr_address-1"></a> `qr_address?` | [`QrCodeData`](/docs/api/defi/protocols/src/vendors/payments/types.md#qrcodedata) | [defi/protocols/src/vendors/payments/types/index.ts:194](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/vendors/payments/types/index.ts#L194) |
| <a id="qr_gateway_url"></a> `qr_gateway_url?` | [`QrCodeData`](/docs/api/defi/protocols/src/vendors/payments/types.md#qrcodedata) | [defi/protocols/src/vendors/payments/types/index.ts:196](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/vendors/payments/types/index.ts#L196) |
| <a id="qr_payment_uri-1"></a> `qr_payment_uri?` | [`QrCodeData`](/docs/api/defi/protocols/src/vendors/payments/types.md#qrcodedata) | [defi/protocols/src/vendors/payments/types/index.ts:195](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/vendors/payments/types/index.ts#L195) |

***

### GetPaymentStatusInput

Defined in: [defi/protocols/src/vendors/payments/types/index.ts:138](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/vendors/payments/types/index.ts#L138)

#### Properties

| Property | Type | Defined in |
| :------ | :------ | :------ |
| <a id="identifier-5"></a> `identifier` | `string` | [defi/protocols/src/vendors/payments/types/index.ts:139](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/vendors/payments/types/index.ts#L139) |

***

### GetPaymentStatusOutput

Defined in: [defi/protocols/src/vendors/payments/types/index.ts:142](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/vendors/payments/types/index.ts#L142)

#### Properties

| Property | Type | Defined in |
| :------ | :------ | :------ |
| <a id="confirmed_amount-1"></a> `confirmed_amount?` | `number` | [defi/protocols/src/vendors/payments/types/index.ts:146](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/vendors/payments/types/index.ts#L146) |
| <a id="crypto_amount-1"></a> `crypto_amount?` | `number` | [defi/protocols/src/vendors/payments/types/index.ts:148](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/vendors/payments/types/index.ts#L148) |
| <a id="expired_time-1"></a> `expired_time?` | `string` | [defi/protocols/src/vendors/payments/types/index.ts:149](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/vendors/payments/types/index.ts#L149) |
| <a id="identifier-6"></a> `identifier` | `string` | [defi/protocols/src/vendors/payments/types/index.ts:143](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/vendors/payments/types/index.ts#L143) |
| <a id="remaining_amount"></a> `remaining_amount?` | `number` | [defi/protocols/src/vendors/payments/types/index.ts:150](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/vendors/payments/types/index.ts#L150) |
| <a id="status-1"></a> `status` | [`PaymentStatusCode`](/docs/api/defi/protocols/src/vendors/payments/types.md#paymentstatuscode) | [defi/protocols/src/vendors/payments/types/index.ts:144](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/vendors/payments/types/index.ts#L144) |
| <a id="status_description"></a> `status_description` | `string` | [defi/protocols/src/vendors/payments/types/index.ts:145](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/vendors/payments/types/index.ts#L145) |
| <a id="time_remaining"></a> `time_remaining?` | `string` | [defi/protocols/src/vendors/payments/types/index.ts:151](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/vendors/payments/types/index.ts#L151) |
| <a id="unconfirmed_amount-1"></a> `unconfirmed_amount?` | `number` | [defi/protocols/src/vendors/payments/types/index.ts:147](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/vendors/payments/types/index.ts#L147) |

***

### GetTunnelStatusOutput

Defined in: [defi/protocols/src/vendors/payments/types/index.ts:333](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/vendors/payments/types/index.ts#L333)

#### Properties

| Property | Type | Defined in |
| :------ | :------ | :------ |
| <a id="connected_at"></a> `connected_at` | `string` \| `null` | [defi/protocols/src/vendors/payments/types/index.ts:338](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/vendors/payments/types/index.ts#L338) |
| <a id="context_detected"></a> `context_detected?` | \{ `confidence`: `number`; `execution_context`: `string`; `indicators`: `string`[]; `suggested_provider`: `string`; \} | [defi/protocols/src/vendors/payments/types/index.ts:342](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/vendors/payments/types/index.ts#L342) |
| `context_detected.confidence` | `number` | [defi/protocols/src/vendors/payments/types/index.ts:344](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/vendors/payments/types/index.ts#L344) |
| `context_detected.execution_context` | `string` | [defi/protocols/src/vendors/payments/types/index.ts:343](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/vendors/payments/types/index.ts#L343) |
| `context_detected.indicators` | `string`[] | [defi/protocols/src/vendors/payments/types/index.ts:346](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/vendors/payments/types/index.ts#L346) |
| `context_detected.suggested_provider` | `string` | [defi/protocols/src/vendors/payments/types/index.ts:345](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/vendors/payments/types/index.ts#L345) |
| <a id="enabled"></a> `enabled` | `boolean` | [defi/protocols/src/vendors/payments/types/index.ts:334](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/vendors/payments/types/index.ts#L334) |
| <a id="health_check_enabled"></a> `health_check_enabled` | `boolean` | [defi/protocols/src/vendors/payments/types/index.ts:341](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/vendors/payments/types/index.ts#L341) |
| <a id="last_error"></a> `last_error` | `string` \| `null` | [defi/protocols/src/vendors/payments/types/index.ts:339](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/vendors/payments/types/index.ts#L339) |
| <a id="provider"></a> `provider` | `"manual"` \| `"ngrok"` \| `"zrok"` | [defi/protocols/src/vendors/payments/types/index.ts:335](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/vendors/payments/types/index.ts#L335) |
| <a id="public_url"></a> `public_url` | `string` \| `null` | [defi/protocols/src/vendors/payments/types/index.ts:337](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/vendors/payments/types/index.ts#L337) |
| <a id="reconnect_attempts"></a> `reconnect_attempts` | `number` | [defi/protocols/src/vendors/payments/types/index.ts:340](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/vendors/payments/types/index.ts#L340) |
| <a id="status-2"></a> `status` | `"error"` \| `"disconnected"` \| `"connecting"` \| `"connected"` \| `"reconnecting"` | [defi/protocols/src/vendors/payments/types/index.ts:336](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/vendors/payments/types/index.ts#L336) |

***

### GetWebhookEventsInput

Defined in: [defi/protocols/src/vendors/payments/types/index.ts:289](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/vendors/payments/types/index.ts#L289)

#### Properties

| Property | Type | Defined in |
| :------ | :------ | :------ |
| <a id="identifier-7"></a> `identifier?` | `string` | [defi/protocols/src/vendors/payments/types/index.ts:290](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/vendors/payments/types/index.ts#L290) |
| <a id="limit"></a> `limit?` | `number` | [defi/protocols/src/vendors/payments/types/index.ts:291](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/vendors/payments/types/index.ts#L291) |
| <a id="validated_only"></a> `validated_only?` | `boolean` | [defi/protocols/src/vendors/payments/types/index.ts:292](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/vendors/payments/types/index.ts#L292) |

***

### GetWebhookEventsOutput

Defined in: [defi/protocols/src/vendors/payments/types/index.ts:295](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/vendors/payments/types/index.ts#L295)

#### Properties

| Property | Type | Defined in |
| :------ | :------ | :------ |
| <a id="events"></a> `events` | \{ `event_id`: `string`; `identifier`: `string`; `payload`: `Record`\<`string`, `unknown`\>; `received_at`: `string`; `status`: [`PaymentStatusCode`](/docs/api/defi/protocols/src/vendors/payments/types.md#paymentstatuscode); `validated`: `boolean`; \}[] | [defi/protocols/src/vendors/payments/types/index.ts:296](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/vendors/payments/types/index.ts#L296) |
| <a id="total_count"></a> `total_count` | `number` | [defi/protocols/src/vendors/payments/types/index.ts:304](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/vendors/payments/types/index.ts#L304) |

***

### GetWebhookUrlInput

Defined in: [defi/protocols/src/vendors/payments/types/index.ts:322](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/vendors/payments/types/index.ts#L322)

#### Properties

| Property | Type | Defined in |
| :------ | :------ | :------ |
| <a id="validate"></a> `validate?` | `boolean` | [defi/protocols/src/vendors/payments/types/index.ts:323](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/vendors/payments/types/index.ts#L323) |

***

### GetWebhookUrlOutput

Defined in: [defi/protocols/src/vendors/payments/types/index.ts:326](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/vendors/payments/types/index.ts#L326)

#### Properties

| Property | Type | Defined in |
| :------ | :------ | :------ |
| <a id="instructions"></a> `instructions?` | `string` | [defi/protocols/src/vendors/payments/types/index.ts:330](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/vendors/payments/types/index.ts#L330) |
| <a id="provider-1"></a> `provider` | `"manual"` \| `"ngrok"` \| `"zrok"` | [defi/protocols/src/vendors/payments/types/index.ts:328](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/vendors/payments/types/index.ts#L328) |
| <a id="validated"></a> `validated` | `boolean` | [defi/protocols/src/vendors/payments/types/index.ts:329](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/vendors/payments/types/index.ts#L329) |
| <a id="webhook_url"></a> `webhook_url` | `string` | [defi/protocols/src/vendors/payments/types/index.ts:327](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/vendors/payments/types/index.ts#L327) |

***

### ListCurrenciesCatalogInput

Defined in: [defi/protocols/src/vendors/payments/types/index.ts:154](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/vendors/payments/types/index.ts#L154)

#### Properties

| Property | Type | Defined in |
| :------ | :------ | :------ |
| <a id="filter_by_amount"></a> `filter_by_amount?` | `number` | [defi/protocols/src/vendors/payments/types/index.ts:155](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/vendors/payments/types/index.ts#L155) |

***

### ListCurrenciesCatalogOutput

Defined in: [defi/protocols/src/vendors/payments/types/index.ts:158](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/vendors/payments/types/index.ts#L158)

#### Properties

| Property | Type | Defined in |
| :------ | :------ | :------ |
| <a id="currencies-1"></a> `currencies` | \{ `blockchain`: `string`; `current_rate?`: `number`; `decimals`: `number`; `image`: `string`; `max_amount`: `number` \| `null`; `min_amount`: `number`; `name`: `string`; `original_blockchain`: `string`; `original_symbol`: `string`; `requires_memo`: `boolean`; `symbol`: `string`; \}[] | [defi/protocols/src/vendors/payments/types/index.ts:159](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/vendors/payments/types/index.ts#L159) |
| <a id="filtered_count"></a> `filtered_count?` | `number` | [defi/protocols/src/vendors/payments/types/index.ts:173](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/vendors/payments/types/index.ts#L173) |
| <a id="total_count-1"></a> `total_count` | `number` | [defi/protocols/src/vendors/payments/types/index.ts:172](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/vendors/payments/types/index.ts#L172) |

***

### Payment

Defined in: [defi/protocols/src/vendors/payments/types/index.ts:22](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/vendors/payments/types/index.ts#L22)

#### Properties

| Property | Type | Defined in |
| :------ | :------ | :------ |
| <a id="address-1"></a> `address?` | `string` | [defi/protocols/src/vendors/payments/types/index.ts:29](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/vendors/payments/types/index.ts#L29) |
| <a id="amount"></a> `amount` | `number` | [defi/protocols/src/vendors/payments/types/index.ts:24](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/vendors/payments/types/index.ts#L24) |
| <a id="createdat"></a> `createdAt` | `Date` | [defi/protocols/src/vendors/payments/types/index.ts:36](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/vendors/payments/types/index.ts#L36) |
| <a id="currency-1"></a> `currency?` | `string` | [defi/protocols/src/vendors/payments/types/index.ts:25](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/vendors/payments/types/index.ts#L25) |
| <a id="expectedinputamount"></a> `expectedInputAmount?` | `number` | [defi/protocols/src/vendors/payments/types/index.ts:32](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/vendors/payments/types/index.ts#L32) |
| <a id="expiresat"></a> `expiresAt?` | `Date` | [defi/protocols/src/vendors/payments/types/index.ts:37](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/vendors/payments/types/index.ts#L37) |
| <a id="fiat-2"></a> `fiat?` | `string` | [defi/protocols/src/vendors/payments/types/index.ts:26](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/vendors/payments/types/index.ts#L26) |
| <a id="identifier-8"></a> `identifier` | `string` | [defi/protocols/src/vendors/payments/types/index.ts:23](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/vendors/payments/types/index.ts#L23) |
| <a id="merchanturlko"></a> `merchantUrlKo?` | `string` | [defi/protocols/src/vendors/payments/types/index.ts:35](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/vendors/payments/types/index.ts#L35) |
| <a id="merchanturlok"></a> `merchantUrlOk?` | `string` | [defi/protocols/src/vendors/payments/types/index.ts:34](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/vendors/payments/types/index.ts#L34) |
| <a id="notes-2"></a> `notes?` | `string` | [defi/protocols/src/vendors/payments/types/index.ts:27](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/vendors/payments/types/index.ts#L27) |
| <a id="paymenttype"></a> `paymentType` | [`PaymentType`](/docs/api/defi/protocols/src/vendors/payments/types.md#paymenttype-1) | [defi/protocols/src/vendors/payments/types/index.ts:28](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/vendors/payments/types/index.ts#L28) |
| <a id="paymenturi"></a> `paymentUri?` | `string` | [defi/protocols/src/vendors/payments/types/index.ts:30](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/vendors/payments/types/index.ts#L30) |
| <a id="rate-1"></a> `rate?` | `number` | [defi/protocols/src/vendors/payments/types/index.ts:33](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/vendors/payments/types/index.ts#L33) |
| <a id="weburl"></a> `webUrl?` | `string` | [defi/protocols/src/vendors/payments/types/index.ts:31](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/vendors/payments/types/index.ts#L31) |

***

### PaymentStatus

Defined in: [defi/protocols/src/vendors/payments/types/index.ts:55](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/vendors/payments/types/index.ts#L55)

#### Properties

| Property | Type | Defined in |
| :------ | :------ | :------ |
| <a id="confirmedamount"></a> `confirmedAmount?` | `number` | [defi/protocols/src/vendors/payments/types/index.ts:59](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/vendors/payments/types/index.ts#L59) |
| <a id="cryptoamount"></a> `cryptoAmount?` | `number` | [defi/protocols/src/vendors/payments/types/index.ts:61](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/vendors/payments/types/index.ts#L61) |
| <a id="exchangerate"></a> `exchangeRate?` | `number` | [defi/protocols/src/vendors/payments/types/index.ts:64](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/vendors/payments/types/index.ts#L64) |
| <a id="expiredtime"></a> `expiredTime?` | `string` | [defi/protocols/src/vendors/payments/types/index.ts:62](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/vendors/payments/types/index.ts#L62) |
| <a id="identifier-9"></a> `identifier` | `string` | [defi/protocols/src/vendors/payments/types/index.ts:56](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/vendors/payments/types/index.ts#L56) |
| <a id="iscompleted"></a> `isCompleted?` | `boolean` | [defi/protocols/src/vendors/payments/types/index.ts:69](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/vendors/payments/types/index.ts#L69) |
| <a id="isexpired"></a> `isExpired?` | `boolean` | [defi/protocols/src/vendors/payments/types/index.ts:68](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/vendors/payments/types/index.ts#L68) |
| <a id="isfailed"></a> `isFailed?` | `boolean` | [defi/protocols/src/vendors/payments/types/index.ts:70](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/vendors/payments/types/index.ts#L70) |
| <a id="isinsufficient"></a> `isInsufficient?` | `boolean` | [defi/protocols/src/vendors/payments/types/index.ts:72](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/vendors/payments/types/index.ts#L72) |
| <a id="ispending"></a> `isPending?` | `boolean` | [defi/protocols/src/vendors/payments/types/index.ts:71](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/vendors/payments/types/index.ts#L71) |
| <a id="networkfee"></a> `networkFee?` | `number` | [defi/protocols/src/vendors/payments/types/index.ts:63](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/vendors/payments/types/index.ts#L63) |
| <a id="remainingamount"></a> `remainingAmount?` | `number` | [defi/protocols/src/vendors/payments/types/index.ts:65](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/vendors/payments/types/index.ts#L65) |
| <a id="requiresaction"></a> `requiresAction?` | `boolean` | [defi/protocols/src/vendors/payments/types/index.ts:67](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/vendors/payments/types/index.ts#L67) |
| <a id="status-3"></a> `status` | [`PaymentStatusCode`](/docs/api/defi/protocols/src/vendors/payments/types.md#paymentstatuscode) | [defi/protocols/src/vendors/payments/types/index.ts:57](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/vendors/payments/types/index.ts#L57) |
| <a id="statusdescription"></a> `statusDescription?` | `string` | [defi/protocols/src/vendors/payments/types/index.ts:58](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/vendors/payments/types/index.ts#L58) |
| <a id="timeremaining"></a> `timeRemaining?` | `string` | [defi/protocols/src/vendors/payments/types/index.ts:66](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/vendors/payments/types/index.ts#L66) |
| <a id="unconfirmedamount"></a> `unconfirmedAmount?` | `number` | [defi/protocols/src/vendors/payments/types/index.ts:60](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/vendors/payments/types/index.ts#L60) |

***

### QrCodeData

Defined in: [defi/protocols/src/vendors/payments/types/index.ts:185](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/vendors/payments/types/index.ts#L185)

#### Properties

| Property | Type | Defined in |
| :------ | :------ | :------ |
| <a id="data"></a> `data` | `string` | [defi/protocols/src/vendors/payments/types/index.ts:186](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/vendors/payments/types/index.ts#L186) |
| <a id="dimensions"></a> `dimensions?` | `string` | [defi/protocols/src/vendors/payments/types/index.ts:189](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/vendors/payments/types/index.ts#L189) |
| <a id="format"></a> `format` | `"png"` | [defi/protocols/src/vendors/payments/types/index.ts:187](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/vendors/payments/types/index.ts#L187) |
| <a id="style-1"></a> `style?` | `"basic"` \| `"branded"` | [defi/protocols/src/vendors/payments/types/index.ts:188](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/vendors/payments/types/index.ts#L188) |

***

### TunnelConfiguration

Defined in: [defi/protocols/src/vendors/payments/types/index.ts:308](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/vendors/payments/types/index.ts#L308)

#### Properties

| Property | Type | Defined in |
| :------ | :------ | :------ |
| <a id="enabled-1"></a> `enabled` | `boolean` | [defi/protocols/src/vendors/payments/types/index.ts:309](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/vendors/payments/types/index.ts#L309) |
| <a id="healthcheckinterval"></a> `healthCheckInterval` | `number` | [defi/protocols/src/vendors/payments/types/index.ts:317](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/vendors/payments/types/index.ts#L317) |
| <a id="localport"></a> `localPort` | `number` | [defi/protocols/src/vendors/payments/types/index.ts:311](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/vendors/payments/types/index.ts#L311) |
| <a id="ngrokauthtoken-1"></a> `ngrokAuthToken?` | `string` | [defi/protocols/src/vendors/payments/types/index.ts:313](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/vendors/payments/types/index.ts#L313) |
| <a id="ngrokdomain-1"></a> `ngrokDomain?` | `string` | [defi/protocols/src/vendors/payments/types/index.ts:314](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/vendors/payments/types/index.ts#L314) |
| <a id="provider-2"></a> `provider` | `"manual"` \| `"ngrok"` \| `"zrok"` | [defi/protocols/src/vendors/payments/types/index.ts:310](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/vendors/payments/types/index.ts#L310) |
| <a id="publicurl"></a> `publicUrl?` | `string` | [defi/protocols/src/vendors/payments/types/index.ts:312](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/vendors/payments/types/index.ts#L312) |
| <a id="reconnectbackoffms"></a> `reconnectBackoffMs` | `number` | [defi/protocols/src/vendors/payments/types/index.ts:319](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/vendors/payments/types/index.ts#L319) |
| <a id="reconnectmaxretries"></a> `reconnectMaxRetries` | `number` | [defi/protocols/src/vendors/payments/types/index.ts:318](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/vendors/payments/types/index.ts#L318) |
| <a id="zroktoken-1"></a> `zrokToken?` | `string` | [defi/protocols/src/vendors/payments/types/index.ts:315](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/vendors/payments/types/index.ts#L315) |
| <a id="zrokuniquename-1"></a> `zrokUniqueName?` | `string` | [defi/protocols/src/vendors/payments/types/index.ts:316](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/vendors/payments/types/index.ts#L316) |

***

### UniversalCryptomentResponse

Defined in: [defi/protocols/src/vendors/payments/types/index.ts:243](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/vendors/payments/types/index.ts#L243)

#### Properties

| Property | Type | Defined in |
| :------ | :------ | :------ |
| <a id="address-2"></a> `address?` | `string` | [defi/protocols/src/vendors/payments/types/index.ts:245](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/vendors/payments/types/index.ts#L245) |
| <a id="expected_input_amount-1"></a> `expected_input_amount?` | `number` | [defi/protocols/src/vendors/payments/types/index.ts:247](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/vendors/payments/types/index.ts#L247) |
| <a id="identifier-10"></a> `identifier` | `string` | [defi/protocols/src/vendors/payments/types/index.ts:244](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/vendors/payments/types/index.ts#L244) |
| <a id="input_currency-2"></a> `input_currency?` | `string` | [defi/protocols/src/vendors/payments/types/index.ts:249](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/vendors/payments/types/index.ts#L249) |
| <a id="payment_uri-1"></a> `payment_uri?` | `string` | [defi/protocols/src/vendors/payments/types/index.ts:246](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/vendors/payments/types/index.ts#L246) |
| <a id="rate-2"></a> `rate?` | `number` | [defi/protocols/src/vendors/payments/types/index.ts:248](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/vendors/payments/types/index.ts#L248) |
| <a id="tag_memo-1"></a> `tag_memo?` | `string` | [defi/protocols/src/vendors/payments/types/index.ts:251](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/vendors/payments/types/index.ts#L251) |
| <a id="web_url-2"></a> `web_url?` | `string` | [defi/protocols/src/vendors/payments/types/index.ts:250](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/vendors/payments/types/index.ts#L250) |

***

### WebhookConfiguration

Defined in: [defi/protocols/src/vendors/payments/types/index.ts:280](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/vendors/payments/types/index.ts#L280)

#### Properties

| Property | Type | Defined in |
| :------ | :------ | :------ |
| <a id="enabled-2"></a> `enabled` | `boolean` | [defi/protocols/src/vendors/payments/types/index.ts:281](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/vendors/payments/types/index.ts#L281) |
| <a id="eventttlms"></a> `eventTtlMs` | `number` | [defi/protocols/src/vendors/payments/types/index.ts:286](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/vendors/payments/types/index.ts#L286) |
| <a id="host"></a> `host` | `string` | [defi/protocols/src/vendors/payments/types/index.ts:283](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/vendors/payments/types/index.ts#L283) |
| <a id="maxevents"></a> `maxEvents` | `number` | [defi/protocols/src/vendors/payments/types/index.ts:285](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/vendors/payments/types/index.ts#L285) |
| <a id="path"></a> `path` | `string` | [defi/protocols/src/vendors/payments/types/index.ts:284](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/vendors/payments/types/index.ts#L284) |
| <a id="port"></a> `port` | `number` | [defi/protocols/src/vendors/payments/types/index.ts:282](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/vendors/payments/types/index.ts#L282) |

***

### WebhookEvent

Defined in: [defi/protocols/src/vendors/payments/types/index.ts:75](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/vendors/payments/types/index.ts#L75)

#### Properties

| Property | Type | Defined in |
| :------ | :------ | :------ |
| <a id="confirmedamount-1"></a> `confirmedAmount?` | `number` | [defi/protocols/src/vendors/payments/types/index.ts:78](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/vendors/payments/types/index.ts#L78) |
| <a id="cryptoamount-1"></a> `cryptoAmount?` | `number` | [defi/protocols/src/vendors/payments/types/index.ts:80](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/vendors/payments/types/index.ts#L80) |
| <a id="expiredtime-1"></a> `expiredTime?` | `string` | [defi/protocols/src/vendors/payments/types/index.ts:81](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/vendors/payments/types/index.ts#L81) |
| <a id="identifier-11"></a> `identifier` | `string` | [defi/protocols/src/vendors/payments/types/index.ts:76](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/vendors/payments/types/index.ts#L76) |
| <a id="isverified"></a> `isVerified` | `boolean` | [defi/protocols/src/vendors/payments/types/index.ts:85](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/vendors/payments/types/index.ts#L85) |
| <a id="nonce"></a> `nonce` | `string` | [defi/protocols/src/vendors/payments/types/index.ts:83](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/vendors/payments/types/index.ts#L83) |
| <a id="signature"></a> `signature` | `string` | [defi/protocols/src/vendors/payments/types/index.ts:82](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/vendors/payments/types/index.ts#L82) |
| <a id="status-4"></a> `status` | [`PaymentStatusCode`](/docs/api/defi/protocols/src/vendors/payments/types.md#paymentstatuscode) | [defi/protocols/src/vendors/payments/types/index.ts:77](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/vendors/payments/types/index.ts#L77) |
| <a id="timestamp"></a> `timestamp` | `Date` | [defi/protocols/src/vendors/payments/types/index.ts:84](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/vendors/payments/types/index.ts#L84) |
| <a id="unconfirmedamount-1"></a> `unconfirmedAmount?` | `number` | [defi/protocols/src/vendors/payments/types/index.ts:79](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/vendors/payments/types/index.ts#L79) |

## Type Aliases

### PaymentStatusCode

```ts
type PaymentStatusCode = "NR" | "PE" | "AC" | "IA" | "OC" | "CO" | "CA" | "EX" | "FA";
```

Defined in: [defi/protocols/src/vendors/payments/types/index.ts:11](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/vendors/payments/types/index.ts#L11)

***

### PaymentType

```ts
type PaymentType = "onchain" | "redirect";
```

Defined in: [defi/protocols/src/vendors/payments/types/index.ts:9](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/vendors/payments/types/index.ts#L9)
