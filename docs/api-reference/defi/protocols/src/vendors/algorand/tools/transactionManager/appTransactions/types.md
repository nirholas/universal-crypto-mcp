[**Universal Crypto MCP API Reference v1.0.0**](../../../../../../../../index.md)

***

[Universal Crypto MCP API Reference](/docs/api/index.md) / defi/protocols/src/vendors/algorand/tools/transactionManager/appTransactions/types

# defi/protocols/src/vendors/algorand/tools/transactionManager/appTransactions/types

## Interfaces

### AppCallTxnParams

Defined in: [defi/protocols/src/vendors/algorand/tools/transactionManager/appTransactions/types.ts:64](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/vendors/algorand/tools/transactionManager/appTransactions/types.ts#L64)

#### Extends

- [`BaseAppTxnParams`](/docs/api/defi/protocols/src/vendors/algorand/tools/transactionManager/appTransactions/types.md#baseapptxnparams)

#### Properties

| Property | Type | Inherited from | Defined in |
| :------ | :------ | :------ | :------ |
| <a id="accounts"></a> `accounts?` | `string`[] | [`BaseAppTxnParams`](/docs/api/defi/protocols/src/vendors/algorand/tools/transactionManager/appTransactions/types.md#baseapptxnparams).[`accounts`](/docs/api/defi/protocols/src/vendors/algorand/tools/transactionManager/appTransactions/types.md#accounts-7) | [defi/protocols/src/vendors/algorand/tools/transactionManager/appTransactions/types.ts:18](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/vendors/algorand/tools/transactionManager/appTransactions/types.ts#L18) |
| <a id="appargs"></a> `appArgs?` | `Uint8Array`\<`ArrayBufferLike`\>[] | [`BaseAppTxnParams`](/docs/api/defi/protocols/src/vendors/algorand/tools/transactionManager/appTransactions/types.md#baseapptxnparams).[`appArgs`](/docs/api/defi/protocols/src/vendors/algorand/tools/transactionManager/appTransactions/types.md#appargs-7) | [defi/protocols/src/vendors/algorand/tools/transactionManager/appTransactions/types.ts:17](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/vendors/algorand/tools/transactionManager/appTransactions/types.ts#L17) |
| <a id="appindex"></a> `appIndex` | `number` | - | [defi/protocols/src/vendors/algorand/tools/transactionManager/appTransactions/types.ts:65](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/vendors/algorand/tools/transactionManager/appTransactions/types.ts#L65) |
| <a id="boxes"></a> `boxes?` | \{ `appIndex`: `number`; `name`: `Uint8Array`; \}[] | [`BaseAppTxnParams`](/docs/api/defi/protocols/src/vendors/algorand/tools/transactionManager/appTransactions/types.md#baseapptxnparams).[`boxes`](/docs/api/defi/protocols/src/vendors/algorand/tools/transactionManager/appTransactions/types.md#boxes-7) | [defi/protocols/src/vendors/algorand/tools/transactionManager/appTransactions/types.ts:21](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/vendors/algorand/tools/transactionManager/appTransactions/types.ts#L21) |
| <a id="foreignapps"></a> `foreignApps?` | `number`[] | [`BaseAppTxnParams`](/docs/api/defi/protocols/src/vendors/algorand/tools/transactionManager/appTransactions/types.md#baseapptxnparams).[`foreignApps`](/docs/api/defi/protocols/src/vendors/algorand/tools/transactionManager/appTransactions/types.md#foreignapps-7) | [defi/protocols/src/vendors/algorand/tools/transactionManager/appTransactions/types.ts:19](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/vendors/algorand/tools/transactionManager/appTransactions/types.ts#L19) |
| <a id="foreignassets"></a> `foreignAssets?` | `number`[] | [`BaseAppTxnParams`](/docs/api/defi/protocols/src/vendors/algorand/tools/transactionManager/appTransactions/types.md#baseapptxnparams).[`foreignAssets`](/docs/api/defi/protocols/src/vendors/algorand/tools/transactionManager/appTransactions/types.md#foreignassets-7) | [defi/protocols/src/vendors/algorand/tools/transactionManager/appTransactions/types.ts:20](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/vendors/algorand/tools/transactionManager/appTransactions/types.ts#L20) |
| <a id="from"></a> `from` | `string` | [`BaseAppTxnParams`](/docs/api/defi/protocols/src/vendors/algorand/tools/transactionManager/appTransactions/types.md#baseapptxnparams).[`from`](/docs/api/defi/protocols/src/vendors/algorand/tools/transactionManager/appTransactions/types.md#from-7) | [defi/protocols/src/vendors/algorand/tools/transactionManager/appTransactions/types.ts:12](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/vendors/algorand/tools/transactionManager/appTransactions/types.ts#L12) |
| <a id="lease"></a> `lease?` | `Uint8Array`\<`ArrayBufferLike`\> | [`BaseAppTxnParams`](/docs/api/defi/protocols/src/vendors/algorand/tools/transactionManager/appTransactions/types.md#baseapptxnparams).[`lease`](/docs/api/defi/protocols/src/vendors/algorand/tools/transactionManager/appTransactions/types.md#lease-7) | [defi/protocols/src/vendors/algorand/tools/transactionManager/appTransactions/types.ts:15](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/vendors/algorand/tools/transactionManager/appTransactions/types.ts#L15) |
| <a id="note"></a> `note?` | `Uint8Array`\<`ArrayBufferLike`\> | [`BaseAppTxnParams`](/docs/api/defi/protocols/src/vendors/algorand/tools/transactionManager/appTransactions/types.md#baseapptxnparams).[`note`](/docs/api/defi/protocols/src/vendors/algorand/tools/transactionManager/appTransactions/types.md#note-7) | [defi/protocols/src/vendors/algorand/tools/transactionManager/appTransactions/types.ts:14](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/vendors/algorand/tools/transactionManager/appTransactions/types.ts#L14) |
| <a id="oncomplete"></a> `onComplete?` | `any` | [`BaseAppTxnParams`](/docs/api/defi/protocols/src/vendors/algorand/tools/transactionManager/appTransactions/types.md#baseapptxnparams).[`onComplete`](/docs/api/defi/protocols/src/vendors/algorand/tools/transactionManager/appTransactions/types.md#oncomplete-7) | [defi/protocols/src/vendors/algorand/tools/transactionManager/appTransactions/types.ts:22](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/vendors/algorand/tools/transactionManager/appTransactions/types.ts#L22) |
| <a id="rekeyto"></a> `rekeyTo?` | `string` | [`BaseAppTxnParams`](/docs/api/defi/protocols/src/vendors/algorand/tools/transactionManager/appTransactions/types.md#baseapptxnparams).[`rekeyTo`](/docs/api/defi/protocols/src/vendors/algorand/tools/transactionManager/appTransactions/types.md#rekeyto-7) | [defi/protocols/src/vendors/algorand/tools/transactionManager/appTransactions/types.ts:16](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/vendors/algorand/tools/transactionManager/appTransactions/types.ts#L16) |
| <a id="suggestedparams"></a> `suggestedParams` | `SuggestedParams` | [`BaseAppTxnParams`](/docs/api/defi/protocols/src/vendors/algorand/tools/transactionManager/appTransactions/types.md#baseapptxnparams).[`suggestedParams`](/docs/api/defi/protocols/src/vendors/algorand/tools/transactionManager/appTransactions/types.md#suggestedparams-7) | [defi/protocols/src/vendors/algorand/tools/transactionManager/appTransactions/types.ts:13](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/vendors/algorand/tools/transactionManager/appTransactions/types.ts#L13) |

***

### AppClearStateTxnParams

Defined in: [defi/protocols/src/vendors/algorand/tools/transactionManager/appTransactions/types.ts:59](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/vendors/algorand/tools/transactionManager/appTransactions/types.ts#L59)

#### Extends

- [`BaseAppTxnParams`](/docs/api/defi/protocols/src/vendors/algorand/tools/transactionManager/appTransactions/types.md#baseapptxnparams)

#### Properties

| Property | Type | Inherited from | Defined in |
| :------ | :------ | :------ | :------ |
| <a id="accounts-1"></a> `accounts?` | `string`[] | [`BaseAppTxnParams`](/docs/api/defi/protocols/src/vendors/algorand/tools/transactionManager/appTransactions/types.md#baseapptxnparams).[`accounts`](/docs/api/defi/protocols/src/vendors/algorand/tools/transactionManager/appTransactions/types.md#accounts-7) | [defi/protocols/src/vendors/algorand/tools/transactionManager/appTransactions/types.ts:18](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/vendors/algorand/tools/transactionManager/appTransactions/types.ts#L18) |
| <a id="appargs-1"></a> `appArgs?` | `Uint8Array`\<`ArrayBufferLike`\>[] | [`BaseAppTxnParams`](/docs/api/defi/protocols/src/vendors/algorand/tools/transactionManager/appTransactions/types.md#baseapptxnparams).[`appArgs`](/docs/api/defi/protocols/src/vendors/algorand/tools/transactionManager/appTransactions/types.md#appargs-7) | [defi/protocols/src/vendors/algorand/tools/transactionManager/appTransactions/types.ts:17](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/vendors/algorand/tools/transactionManager/appTransactions/types.ts#L17) |
| <a id="appindex-1"></a> `appIndex` | `number` | - | [defi/protocols/src/vendors/algorand/tools/transactionManager/appTransactions/types.ts:60](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/vendors/algorand/tools/transactionManager/appTransactions/types.ts#L60) |
| <a id="boxes-1"></a> `boxes?` | \{ `appIndex`: `number`; `name`: `Uint8Array`; \}[] | [`BaseAppTxnParams`](/docs/api/defi/protocols/src/vendors/algorand/tools/transactionManager/appTransactions/types.md#baseapptxnparams).[`boxes`](/docs/api/defi/protocols/src/vendors/algorand/tools/transactionManager/appTransactions/types.md#boxes-7) | [defi/protocols/src/vendors/algorand/tools/transactionManager/appTransactions/types.ts:21](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/vendors/algorand/tools/transactionManager/appTransactions/types.ts#L21) |
| <a id="foreignapps-1"></a> `foreignApps?` | `number`[] | [`BaseAppTxnParams`](/docs/api/defi/protocols/src/vendors/algorand/tools/transactionManager/appTransactions/types.md#baseapptxnparams).[`foreignApps`](/docs/api/defi/protocols/src/vendors/algorand/tools/transactionManager/appTransactions/types.md#foreignapps-7) | [defi/protocols/src/vendors/algorand/tools/transactionManager/appTransactions/types.ts:19](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/vendors/algorand/tools/transactionManager/appTransactions/types.ts#L19) |
| <a id="foreignassets-1"></a> `foreignAssets?` | `number`[] | [`BaseAppTxnParams`](/docs/api/defi/protocols/src/vendors/algorand/tools/transactionManager/appTransactions/types.md#baseapptxnparams).[`foreignAssets`](/docs/api/defi/protocols/src/vendors/algorand/tools/transactionManager/appTransactions/types.md#foreignassets-7) | [defi/protocols/src/vendors/algorand/tools/transactionManager/appTransactions/types.ts:20](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/vendors/algorand/tools/transactionManager/appTransactions/types.ts#L20) |
| <a id="from-1"></a> `from` | `string` | [`BaseAppTxnParams`](/docs/api/defi/protocols/src/vendors/algorand/tools/transactionManager/appTransactions/types.md#baseapptxnparams).[`from`](/docs/api/defi/protocols/src/vendors/algorand/tools/transactionManager/appTransactions/types.md#from-7) | [defi/protocols/src/vendors/algorand/tools/transactionManager/appTransactions/types.ts:12](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/vendors/algorand/tools/transactionManager/appTransactions/types.ts#L12) |
| <a id="lease-1"></a> `lease?` | `Uint8Array`\<`ArrayBufferLike`\> | [`BaseAppTxnParams`](/docs/api/defi/protocols/src/vendors/algorand/tools/transactionManager/appTransactions/types.md#baseapptxnparams).[`lease`](/docs/api/defi/protocols/src/vendors/algorand/tools/transactionManager/appTransactions/types.md#lease-7) | [defi/protocols/src/vendors/algorand/tools/transactionManager/appTransactions/types.ts:15](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/vendors/algorand/tools/transactionManager/appTransactions/types.ts#L15) |
| <a id="note-1"></a> `note?` | `Uint8Array`\<`ArrayBufferLike`\> | [`BaseAppTxnParams`](/docs/api/defi/protocols/src/vendors/algorand/tools/transactionManager/appTransactions/types.md#baseapptxnparams).[`note`](/docs/api/defi/protocols/src/vendors/algorand/tools/transactionManager/appTransactions/types.md#note-7) | [defi/protocols/src/vendors/algorand/tools/transactionManager/appTransactions/types.ts:14](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/vendors/algorand/tools/transactionManager/appTransactions/types.ts#L14) |
| <a id="oncomplete-1"></a> `onComplete?` | `any` | [`BaseAppTxnParams`](/docs/api/defi/protocols/src/vendors/algorand/tools/transactionManager/appTransactions/types.md#baseapptxnparams).[`onComplete`](/docs/api/defi/protocols/src/vendors/algorand/tools/transactionManager/appTransactions/types.md#oncomplete-7) | [defi/protocols/src/vendors/algorand/tools/transactionManager/appTransactions/types.ts:22](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/vendors/algorand/tools/transactionManager/appTransactions/types.ts#L22) |
| <a id="rekeyto-1"></a> `rekeyTo?` | `string` | [`BaseAppTxnParams`](/docs/api/defi/protocols/src/vendors/algorand/tools/transactionManager/appTransactions/types.md#baseapptxnparams).[`rekeyTo`](/docs/api/defi/protocols/src/vendors/algorand/tools/transactionManager/appTransactions/types.md#rekeyto-7) | [defi/protocols/src/vendors/algorand/tools/transactionManager/appTransactions/types.ts:16](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/vendors/algorand/tools/transactionManager/appTransactions/types.ts#L16) |
| <a id="suggestedparams-1"></a> `suggestedParams` | `SuggestedParams` | [`BaseAppTxnParams`](/docs/api/defi/protocols/src/vendors/algorand/tools/transactionManager/appTransactions/types.md#baseapptxnparams).[`suggestedParams`](/docs/api/defi/protocols/src/vendors/algorand/tools/transactionManager/appTransactions/types.md#suggestedparams-7) | [defi/protocols/src/vendors/algorand/tools/transactionManager/appTransactions/types.ts:13](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/vendors/algorand/tools/transactionManager/appTransactions/types.ts#L13) |

***

### AppCloseOutTxnParams

Defined in: [defi/protocols/src/vendors/algorand/tools/transactionManager/appTransactions/types.ts:54](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/vendors/algorand/tools/transactionManager/appTransactions/types.ts#L54)

#### Extends

- [`BaseAppTxnParams`](/docs/api/defi/protocols/src/vendors/algorand/tools/transactionManager/appTransactions/types.md#baseapptxnparams)

#### Properties

| Property | Type | Inherited from | Defined in |
| :------ | :------ | :------ | :------ |
| <a id="accounts-2"></a> `accounts?` | `string`[] | [`BaseAppTxnParams`](/docs/api/defi/protocols/src/vendors/algorand/tools/transactionManager/appTransactions/types.md#baseapptxnparams).[`accounts`](/docs/api/defi/protocols/src/vendors/algorand/tools/transactionManager/appTransactions/types.md#accounts-7) | [defi/protocols/src/vendors/algorand/tools/transactionManager/appTransactions/types.ts:18](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/vendors/algorand/tools/transactionManager/appTransactions/types.ts#L18) |
| <a id="appargs-2"></a> `appArgs?` | `Uint8Array`\<`ArrayBufferLike`\>[] | [`BaseAppTxnParams`](/docs/api/defi/protocols/src/vendors/algorand/tools/transactionManager/appTransactions/types.md#baseapptxnparams).[`appArgs`](/docs/api/defi/protocols/src/vendors/algorand/tools/transactionManager/appTransactions/types.md#appargs-7) | [defi/protocols/src/vendors/algorand/tools/transactionManager/appTransactions/types.ts:17](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/vendors/algorand/tools/transactionManager/appTransactions/types.ts#L17) |
| <a id="appindex-2"></a> `appIndex` | `number` | - | [defi/protocols/src/vendors/algorand/tools/transactionManager/appTransactions/types.ts:55](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/vendors/algorand/tools/transactionManager/appTransactions/types.ts#L55) |
| <a id="boxes-2"></a> `boxes?` | \{ `appIndex`: `number`; `name`: `Uint8Array`; \}[] | [`BaseAppTxnParams`](/docs/api/defi/protocols/src/vendors/algorand/tools/transactionManager/appTransactions/types.md#baseapptxnparams).[`boxes`](/docs/api/defi/protocols/src/vendors/algorand/tools/transactionManager/appTransactions/types.md#boxes-7) | [defi/protocols/src/vendors/algorand/tools/transactionManager/appTransactions/types.ts:21](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/vendors/algorand/tools/transactionManager/appTransactions/types.ts#L21) |
| <a id="foreignapps-2"></a> `foreignApps?` | `number`[] | [`BaseAppTxnParams`](/docs/api/defi/protocols/src/vendors/algorand/tools/transactionManager/appTransactions/types.md#baseapptxnparams).[`foreignApps`](/docs/api/defi/protocols/src/vendors/algorand/tools/transactionManager/appTransactions/types.md#foreignapps-7) | [defi/protocols/src/vendors/algorand/tools/transactionManager/appTransactions/types.ts:19](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/vendors/algorand/tools/transactionManager/appTransactions/types.ts#L19) |
| <a id="foreignassets-2"></a> `foreignAssets?` | `number`[] | [`BaseAppTxnParams`](/docs/api/defi/protocols/src/vendors/algorand/tools/transactionManager/appTransactions/types.md#baseapptxnparams).[`foreignAssets`](/docs/api/defi/protocols/src/vendors/algorand/tools/transactionManager/appTransactions/types.md#foreignassets-7) | [defi/protocols/src/vendors/algorand/tools/transactionManager/appTransactions/types.ts:20](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/vendors/algorand/tools/transactionManager/appTransactions/types.ts#L20) |
| <a id="from-2"></a> `from` | `string` | [`BaseAppTxnParams`](/docs/api/defi/protocols/src/vendors/algorand/tools/transactionManager/appTransactions/types.md#baseapptxnparams).[`from`](/docs/api/defi/protocols/src/vendors/algorand/tools/transactionManager/appTransactions/types.md#from-7) | [defi/protocols/src/vendors/algorand/tools/transactionManager/appTransactions/types.ts:12](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/vendors/algorand/tools/transactionManager/appTransactions/types.ts#L12) |
| <a id="lease-2"></a> `lease?` | `Uint8Array`\<`ArrayBufferLike`\> | [`BaseAppTxnParams`](/docs/api/defi/protocols/src/vendors/algorand/tools/transactionManager/appTransactions/types.md#baseapptxnparams).[`lease`](/docs/api/defi/protocols/src/vendors/algorand/tools/transactionManager/appTransactions/types.md#lease-7) | [defi/protocols/src/vendors/algorand/tools/transactionManager/appTransactions/types.ts:15](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/vendors/algorand/tools/transactionManager/appTransactions/types.ts#L15) |
| <a id="note-2"></a> `note?` | `Uint8Array`\<`ArrayBufferLike`\> | [`BaseAppTxnParams`](/docs/api/defi/protocols/src/vendors/algorand/tools/transactionManager/appTransactions/types.md#baseapptxnparams).[`note`](/docs/api/defi/protocols/src/vendors/algorand/tools/transactionManager/appTransactions/types.md#note-7) | [defi/protocols/src/vendors/algorand/tools/transactionManager/appTransactions/types.ts:14](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/vendors/algorand/tools/transactionManager/appTransactions/types.ts#L14) |
| <a id="oncomplete-2"></a> `onComplete?` | `any` | [`BaseAppTxnParams`](/docs/api/defi/protocols/src/vendors/algorand/tools/transactionManager/appTransactions/types.md#baseapptxnparams).[`onComplete`](/docs/api/defi/protocols/src/vendors/algorand/tools/transactionManager/appTransactions/types.md#oncomplete-7) | [defi/protocols/src/vendors/algorand/tools/transactionManager/appTransactions/types.ts:22](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/vendors/algorand/tools/transactionManager/appTransactions/types.ts#L22) |
| <a id="rekeyto-2"></a> `rekeyTo?` | `string` | [`BaseAppTxnParams`](/docs/api/defi/protocols/src/vendors/algorand/tools/transactionManager/appTransactions/types.md#baseapptxnparams).[`rekeyTo`](/docs/api/defi/protocols/src/vendors/algorand/tools/transactionManager/appTransactions/types.md#rekeyto-7) | [defi/protocols/src/vendors/algorand/tools/transactionManager/appTransactions/types.ts:16](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/vendors/algorand/tools/transactionManager/appTransactions/types.ts#L16) |
| <a id="suggestedparams-2"></a> `suggestedParams` | `SuggestedParams` | [`BaseAppTxnParams`](/docs/api/defi/protocols/src/vendors/algorand/tools/transactionManager/appTransactions/types.md#baseapptxnparams).[`suggestedParams`](/docs/api/defi/protocols/src/vendors/algorand/tools/transactionManager/appTransactions/types.md#suggestedparams-7) | [defi/protocols/src/vendors/algorand/tools/transactionManager/appTransactions/types.ts:13](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/vendors/algorand/tools/transactionManager/appTransactions/types.ts#L13) |

***

### AppCreateTxnParams

Defined in: [defi/protocols/src/vendors/algorand/tools/transactionManager/appTransactions/types.ts:26](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/vendors/algorand/tools/transactionManager/appTransactions/types.ts#L26)

#### Extends

- [`BaseAppTxnParams`](/docs/api/defi/protocols/src/vendors/algorand/tools/transactionManager/appTransactions/types.md#baseapptxnparams)

#### Properties

| Property | Type | Inherited from | Defined in |
| :------ | :------ | :------ | :------ |
| <a id="accounts-3"></a> `accounts?` | `string`[] | [`BaseAppTxnParams`](/docs/api/defi/protocols/src/vendors/algorand/tools/transactionManager/appTransactions/types.md#baseapptxnparams).[`accounts`](/docs/api/defi/protocols/src/vendors/algorand/tools/transactionManager/appTransactions/types.md#accounts-7) | [defi/protocols/src/vendors/algorand/tools/transactionManager/appTransactions/types.ts:18](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/vendors/algorand/tools/transactionManager/appTransactions/types.ts#L18) |
| <a id="appargs-3"></a> `appArgs?` | `Uint8Array`\<`ArrayBufferLike`\>[] | [`BaseAppTxnParams`](/docs/api/defi/protocols/src/vendors/algorand/tools/transactionManager/appTransactions/types.md#baseapptxnparams).[`appArgs`](/docs/api/defi/protocols/src/vendors/algorand/tools/transactionManager/appTransactions/types.md#appargs-7) | [defi/protocols/src/vendors/algorand/tools/transactionManager/appTransactions/types.ts:17](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/vendors/algorand/tools/transactionManager/appTransactions/types.ts#L17) |
| <a id="approvalprogram"></a> `approvalProgram` | `Uint8Array` | - | [defi/protocols/src/vendors/algorand/tools/transactionManager/appTransactions/types.ts:27](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/vendors/algorand/tools/transactionManager/appTransactions/types.ts#L27) |
| <a id="boxes-3"></a> `boxes?` | \{ `appIndex`: `number`; `name`: `Uint8Array`; \}[] | [`BaseAppTxnParams`](/docs/api/defi/protocols/src/vendors/algorand/tools/transactionManager/appTransactions/types.md#baseapptxnparams).[`boxes`](/docs/api/defi/protocols/src/vendors/algorand/tools/transactionManager/appTransactions/types.md#boxes-7) | [defi/protocols/src/vendors/algorand/tools/transactionManager/appTransactions/types.ts:21](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/vendors/algorand/tools/transactionManager/appTransactions/types.ts#L21) |
| <a id="clearprogram"></a> `clearProgram` | `Uint8Array` | - | [defi/protocols/src/vendors/algorand/tools/transactionManager/appTransactions/types.ts:28](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/vendors/algorand/tools/transactionManager/appTransactions/types.ts#L28) |
| <a id="extrapages"></a> `extraPages?` | `number` | - | [defi/protocols/src/vendors/algorand/tools/transactionManager/appTransactions/types.ts:33](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/vendors/algorand/tools/transactionManager/appTransactions/types.ts#L33) |
| <a id="foreignapps-3"></a> `foreignApps?` | `number`[] | [`BaseAppTxnParams`](/docs/api/defi/protocols/src/vendors/algorand/tools/transactionManager/appTransactions/types.md#baseapptxnparams).[`foreignApps`](/docs/api/defi/protocols/src/vendors/algorand/tools/transactionManager/appTransactions/types.md#foreignapps-7) | [defi/protocols/src/vendors/algorand/tools/transactionManager/appTransactions/types.ts:19](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/vendors/algorand/tools/transactionManager/appTransactions/types.ts#L19) |
| <a id="foreignassets-3"></a> `foreignAssets?` | `number`[] | [`BaseAppTxnParams`](/docs/api/defi/protocols/src/vendors/algorand/tools/transactionManager/appTransactions/types.md#baseapptxnparams).[`foreignAssets`](/docs/api/defi/protocols/src/vendors/algorand/tools/transactionManager/appTransactions/types.md#foreignassets-7) | [defi/protocols/src/vendors/algorand/tools/transactionManager/appTransactions/types.ts:20](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/vendors/algorand/tools/transactionManager/appTransactions/types.ts#L20) |
| <a id="from-3"></a> `from` | `string` | [`BaseAppTxnParams`](/docs/api/defi/protocols/src/vendors/algorand/tools/transactionManager/appTransactions/types.md#baseapptxnparams).[`from`](/docs/api/defi/protocols/src/vendors/algorand/tools/transactionManager/appTransactions/types.md#from-7) | [defi/protocols/src/vendors/algorand/tools/transactionManager/appTransactions/types.ts:12](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/vendors/algorand/tools/transactionManager/appTransactions/types.ts#L12) |
| <a id="lease-3"></a> `lease?` | `Uint8Array`\<`ArrayBufferLike`\> | [`BaseAppTxnParams`](/docs/api/defi/protocols/src/vendors/algorand/tools/transactionManager/appTransactions/types.md#baseapptxnparams).[`lease`](/docs/api/defi/protocols/src/vendors/algorand/tools/transactionManager/appTransactions/types.md#lease-7) | [defi/protocols/src/vendors/algorand/tools/transactionManager/appTransactions/types.ts:15](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/vendors/algorand/tools/transactionManager/appTransactions/types.ts#L15) |
| <a id="note-3"></a> `note?` | `Uint8Array`\<`ArrayBufferLike`\> | [`BaseAppTxnParams`](/docs/api/defi/protocols/src/vendors/algorand/tools/transactionManager/appTransactions/types.md#baseapptxnparams).[`note`](/docs/api/defi/protocols/src/vendors/algorand/tools/transactionManager/appTransactions/types.md#note-7) | [defi/protocols/src/vendors/algorand/tools/transactionManager/appTransactions/types.ts:14](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/vendors/algorand/tools/transactionManager/appTransactions/types.ts#L14) |
| <a id="numglobalbyteslices"></a> `numGlobalByteSlices` | `number` | - | [defi/protocols/src/vendors/algorand/tools/transactionManager/appTransactions/types.ts:29](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/vendors/algorand/tools/transactionManager/appTransactions/types.ts#L29) |
| <a id="numglobalints"></a> `numGlobalInts` | `number` | - | [defi/protocols/src/vendors/algorand/tools/transactionManager/appTransactions/types.ts:30](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/vendors/algorand/tools/transactionManager/appTransactions/types.ts#L30) |
| <a id="numlocalbyteslices"></a> `numLocalByteSlices` | `number` | - | [defi/protocols/src/vendors/algorand/tools/transactionManager/appTransactions/types.ts:31](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/vendors/algorand/tools/transactionManager/appTransactions/types.ts#L31) |
| <a id="numlocalints"></a> `numLocalInts` | `number` | - | [defi/protocols/src/vendors/algorand/tools/transactionManager/appTransactions/types.ts:32](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/vendors/algorand/tools/transactionManager/appTransactions/types.ts#L32) |
| <a id="oncomplete-3"></a> `onComplete?` | `any` | [`BaseAppTxnParams`](/docs/api/defi/protocols/src/vendors/algorand/tools/transactionManager/appTransactions/types.md#baseapptxnparams).[`onComplete`](/docs/api/defi/protocols/src/vendors/algorand/tools/transactionManager/appTransactions/types.md#oncomplete-7) | [defi/protocols/src/vendors/algorand/tools/transactionManager/appTransactions/types.ts:22](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/vendors/algorand/tools/transactionManager/appTransactions/types.ts#L22) |
| <a id="rekeyto-3"></a> `rekeyTo?` | `string` | [`BaseAppTxnParams`](/docs/api/defi/protocols/src/vendors/algorand/tools/transactionManager/appTransactions/types.md#baseapptxnparams).[`rekeyTo`](/docs/api/defi/protocols/src/vendors/algorand/tools/transactionManager/appTransactions/types.md#rekeyto-7) | [defi/protocols/src/vendors/algorand/tools/transactionManager/appTransactions/types.ts:16](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/vendors/algorand/tools/transactionManager/appTransactions/types.ts#L16) |
| <a id="suggestedparams-3"></a> `suggestedParams` | `SuggestedParams` | [`BaseAppTxnParams`](/docs/api/defi/protocols/src/vendors/algorand/tools/transactionManager/appTransactions/types.md#baseapptxnparams).[`suggestedParams`](/docs/api/defi/protocols/src/vendors/algorand/tools/transactionManager/appTransactions/types.md#suggestedparams-7) | [defi/protocols/src/vendors/algorand/tools/transactionManager/appTransactions/types.ts:13](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/vendors/algorand/tools/transactionManager/appTransactions/types.ts#L13) |

***

### AppDeleteTxnParams

Defined in: [defi/protocols/src/vendors/algorand/tools/transactionManager/appTransactions/types.ts:44](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/vendors/algorand/tools/transactionManager/appTransactions/types.ts#L44)

#### Extends

- [`BaseAppTxnParams`](/docs/api/defi/protocols/src/vendors/algorand/tools/transactionManager/appTransactions/types.md#baseapptxnparams)

#### Properties

| Property | Type | Inherited from | Defined in |
| :------ | :------ | :------ | :------ |
| <a id="accounts-4"></a> `accounts?` | `string`[] | [`BaseAppTxnParams`](/docs/api/defi/protocols/src/vendors/algorand/tools/transactionManager/appTransactions/types.md#baseapptxnparams).[`accounts`](/docs/api/defi/protocols/src/vendors/algorand/tools/transactionManager/appTransactions/types.md#accounts-7) | [defi/protocols/src/vendors/algorand/tools/transactionManager/appTransactions/types.ts:18](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/vendors/algorand/tools/transactionManager/appTransactions/types.ts#L18) |
| <a id="appargs-4"></a> `appArgs?` | `Uint8Array`\<`ArrayBufferLike`\>[] | [`BaseAppTxnParams`](/docs/api/defi/protocols/src/vendors/algorand/tools/transactionManager/appTransactions/types.md#baseapptxnparams).[`appArgs`](/docs/api/defi/protocols/src/vendors/algorand/tools/transactionManager/appTransactions/types.md#appargs-7) | [defi/protocols/src/vendors/algorand/tools/transactionManager/appTransactions/types.ts:17](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/vendors/algorand/tools/transactionManager/appTransactions/types.ts#L17) |
| <a id="appindex-3"></a> `appIndex` | `number` | - | [defi/protocols/src/vendors/algorand/tools/transactionManager/appTransactions/types.ts:45](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/vendors/algorand/tools/transactionManager/appTransactions/types.ts#L45) |
| <a id="boxes-4"></a> `boxes?` | \{ `appIndex`: `number`; `name`: `Uint8Array`; \}[] | [`BaseAppTxnParams`](/docs/api/defi/protocols/src/vendors/algorand/tools/transactionManager/appTransactions/types.md#baseapptxnparams).[`boxes`](/docs/api/defi/protocols/src/vendors/algorand/tools/transactionManager/appTransactions/types.md#boxes-7) | [defi/protocols/src/vendors/algorand/tools/transactionManager/appTransactions/types.ts:21](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/vendors/algorand/tools/transactionManager/appTransactions/types.ts#L21) |
| <a id="foreignapps-4"></a> `foreignApps?` | `number`[] | [`BaseAppTxnParams`](/docs/api/defi/protocols/src/vendors/algorand/tools/transactionManager/appTransactions/types.md#baseapptxnparams).[`foreignApps`](/docs/api/defi/protocols/src/vendors/algorand/tools/transactionManager/appTransactions/types.md#foreignapps-7) | [defi/protocols/src/vendors/algorand/tools/transactionManager/appTransactions/types.ts:19](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/vendors/algorand/tools/transactionManager/appTransactions/types.ts#L19) |
| <a id="foreignassets-4"></a> `foreignAssets?` | `number`[] | [`BaseAppTxnParams`](/docs/api/defi/protocols/src/vendors/algorand/tools/transactionManager/appTransactions/types.md#baseapptxnparams).[`foreignAssets`](/docs/api/defi/protocols/src/vendors/algorand/tools/transactionManager/appTransactions/types.md#foreignassets-7) | [defi/protocols/src/vendors/algorand/tools/transactionManager/appTransactions/types.ts:20](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/vendors/algorand/tools/transactionManager/appTransactions/types.ts#L20) |
| <a id="from-4"></a> `from` | `string` | [`BaseAppTxnParams`](/docs/api/defi/protocols/src/vendors/algorand/tools/transactionManager/appTransactions/types.md#baseapptxnparams).[`from`](/docs/api/defi/protocols/src/vendors/algorand/tools/transactionManager/appTransactions/types.md#from-7) | [defi/protocols/src/vendors/algorand/tools/transactionManager/appTransactions/types.ts:12](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/vendors/algorand/tools/transactionManager/appTransactions/types.ts#L12) |
| <a id="lease-4"></a> `lease?` | `Uint8Array`\<`ArrayBufferLike`\> | [`BaseAppTxnParams`](/docs/api/defi/protocols/src/vendors/algorand/tools/transactionManager/appTransactions/types.md#baseapptxnparams).[`lease`](/docs/api/defi/protocols/src/vendors/algorand/tools/transactionManager/appTransactions/types.md#lease-7) | [defi/protocols/src/vendors/algorand/tools/transactionManager/appTransactions/types.ts:15](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/vendors/algorand/tools/transactionManager/appTransactions/types.ts#L15) |
| <a id="note-4"></a> `note?` | `Uint8Array`\<`ArrayBufferLike`\> | [`BaseAppTxnParams`](/docs/api/defi/protocols/src/vendors/algorand/tools/transactionManager/appTransactions/types.md#baseapptxnparams).[`note`](/docs/api/defi/protocols/src/vendors/algorand/tools/transactionManager/appTransactions/types.md#note-7) | [defi/protocols/src/vendors/algorand/tools/transactionManager/appTransactions/types.ts:14](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/vendors/algorand/tools/transactionManager/appTransactions/types.ts#L14) |
| <a id="oncomplete-4"></a> `onComplete?` | `any` | [`BaseAppTxnParams`](/docs/api/defi/protocols/src/vendors/algorand/tools/transactionManager/appTransactions/types.md#baseapptxnparams).[`onComplete`](/docs/api/defi/protocols/src/vendors/algorand/tools/transactionManager/appTransactions/types.md#oncomplete-7) | [defi/protocols/src/vendors/algorand/tools/transactionManager/appTransactions/types.ts:22](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/vendors/algorand/tools/transactionManager/appTransactions/types.ts#L22) |
| <a id="rekeyto-4"></a> `rekeyTo?` | `string` | [`BaseAppTxnParams`](/docs/api/defi/protocols/src/vendors/algorand/tools/transactionManager/appTransactions/types.md#baseapptxnparams).[`rekeyTo`](/docs/api/defi/protocols/src/vendors/algorand/tools/transactionManager/appTransactions/types.md#rekeyto-7) | [defi/protocols/src/vendors/algorand/tools/transactionManager/appTransactions/types.ts:16](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/vendors/algorand/tools/transactionManager/appTransactions/types.ts#L16) |
| <a id="suggestedparams-4"></a> `suggestedParams` | `SuggestedParams` | [`BaseAppTxnParams`](/docs/api/defi/protocols/src/vendors/algorand/tools/transactionManager/appTransactions/types.md#baseapptxnparams).[`suggestedParams`](/docs/api/defi/protocols/src/vendors/algorand/tools/transactionManager/appTransactions/types.md#suggestedparams-7) | [defi/protocols/src/vendors/algorand/tools/transactionManager/appTransactions/types.ts:13](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/vendors/algorand/tools/transactionManager/appTransactions/types.ts#L13) |

***

### AppOptInTxnParams

Defined in: [defi/protocols/src/vendors/algorand/tools/transactionManager/appTransactions/types.ts:49](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/vendors/algorand/tools/transactionManager/appTransactions/types.ts#L49)

#### Extends

- [`BaseAppTxnParams`](/docs/api/defi/protocols/src/vendors/algorand/tools/transactionManager/appTransactions/types.md#baseapptxnparams)

#### Properties

| Property | Type | Inherited from | Defined in |
| :------ | :------ | :------ | :------ |
| <a id="accounts-5"></a> `accounts?` | `string`[] | [`BaseAppTxnParams`](/docs/api/defi/protocols/src/vendors/algorand/tools/transactionManager/appTransactions/types.md#baseapptxnparams).[`accounts`](/docs/api/defi/protocols/src/vendors/algorand/tools/transactionManager/appTransactions/types.md#accounts-7) | [defi/protocols/src/vendors/algorand/tools/transactionManager/appTransactions/types.ts:18](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/vendors/algorand/tools/transactionManager/appTransactions/types.ts#L18) |
| <a id="appargs-5"></a> `appArgs?` | `Uint8Array`\<`ArrayBufferLike`\>[] | [`BaseAppTxnParams`](/docs/api/defi/protocols/src/vendors/algorand/tools/transactionManager/appTransactions/types.md#baseapptxnparams).[`appArgs`](/docs/api/defi/protocols/src/vendors/algorand/tools/transactionManager/appTransactions/types.md#appargs-7) | [defi/protocols/src/vendors/algorand/tools/transactionManager/appTransactions/types.ts:17](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/vendors/algorand/tools/transactionManager/appTransactions/types.ts#L17) |
| <a id="appindex-4"></a> `appIndex` | `number` | - | [defi/protocols/src/vendors/algorand/tools/transactionManager/appTransactions/types.ts:50](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/vendors/algorand/tools/transactionManager/appTransactions/types.ts#L50) |
| <a id="boxes-5"></a> `boxes?` | \{ `appIndex`: `number`; `name`: `Uint8Array`; \}[] | [`BaseAppTxnParams`](/docs/api/defi/protocols/src/vendors/algorand/tools/transactionManager/appTransactions/types.md#baseapptxnparams).[`boxes`](/docs/api/defi/protocols/src/vendors/algorand/tools/transactionManager/appTransactions/types.md#boxes-7) | [defi/protocols/src/vendors/algorand/tools/transactionManager/appTransactions/types.ts:21](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/vendors/algorand/tools/transactionManager/appTransactions/types.ts#L21) |
| <a id="foreignapps-5"></a> `foreignApps?` | `number`[] | [`BaseAppTxnParams`](/docs/api/defi/protocols/src/vendors/algorand/tools/transactionManager/appTransactions/types.md#baseapptxnparams).[`foreignApps`](/docs/api/defi/protocols/src/vendors/algorand/tools/transactionManager/appTransactions/types.md#foreignapps-7) | [defi/protocols/src/vendors/algorand/tools/transactionManager/appTransactions/types.ts:19](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/vendors/algorand/tools/transactionManager/appTransactions/types.ts#L19) |
| <a id="foreignassets-5"></a> `foreignAssets?` | `number`[] | [`BaseAppTxnParams`](/docs/api/defi/protocols/src/vendors/algorand/tools/transactionManager/appTransactions/types.md#baseapptxnparams).[`foreignAssets`](/docs/api/defi/protocols/src/vendors/algorand/tools/transactionManager/appTransactions/types.md#foreignassets-7) | [defi/protocols/src/vendors/algorand/tools/transactionManager/appTransactions/types.ts:20](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/vendors/algorand/tools/transactionManager/appTransactions/types.ts#L20) |
| <a id="from-5"></a> `from` | `string` | [`BaseAppTxnParams`](/docs/api/defi/protocols/src/vendors/algorand/tools/transactionManager/appTransactions/types.md#baseapptxnparams).[`from`](/docs/api/defi/protocols/src/vendors/algorand/tools/transactionManager/appTransactions/types.md#from-7) | [defi/protocols/src/vendors/algorand/tools/transactionManager/appTransactions/types.ts:12](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/vendors/algorand/tools/transactionManager/appTransactions/types.ts#L12) |
| <a id="lease-5"></a> `lease?` | `Uint8Array`\<`ArrayBufferLike`\> | [`BaseAppTxnParams`](/docs/api/defi/protocols/src/vendors/algorand/tools/transactionManager/appTransactions/types.md#baseapptxnparams).[`lease`](/docs/api/defi/protocols/src/vendors/algorand/tools/transactionManager/appTransactions/types.md#lease-7) | [defi/protocols/src/vendors/algorand/tools/transactionManager/appTransactions/types.ts:15](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/vendors/algorand/tools/transactionManager/appTransactions/types.ts#L15) |
| <a id="note-5"></a> `note?` | `Uint8Array`\<`ArrayBufferLike`\> | [`BaseAppTxnParams`](/docs/api/defi/protocols/src/vendors/algorand/tools/transactionManager/appTransactions/types.md#baseapptxnparams).[`note`](/docs/api/defi/protocols/src/vendors/algorand/tools/transactionManager/appTransactions/types.md#note-7) | [defi/protocols/src/vendors/algorand/tools/transactionManager/appTransactions/types.ts:14](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/vendors/algorand/tools/transactionManager/appTransactions/types.ts#L14) |
| <a id="oncomplete-5"></a> `onComplete?` | `any` | [`BaseAppTxnParams`](/docs/api/defi/protocols/src/vendors/algorand/tools/transactionManager/appTransactions/types.md#baseapptxnparams).[`onComplete`](/docs/api/defi/protocols/src/vendors/algorand/tools/transactionManager/appTransactions/types.md#oncomplete-7) | [defi/protocols/src/vendors/algorand/tools/transactionManager/appTransactions/types.ts:22](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/vendors/algorand/tools/transactionManager/appTransactions/types.ts#L22) |
| <a id="rekeyto-5"></a> `rekeyTo?` | `string` | [`BaseAppTxnParams`](/docs/api/defi/protocols/src/vendors/algorand/tools/transactionManager/appTransactions/types.md#baseapptxnparams).[`rekeyTo`](/docs/api/defi/protocols/src/vendors/algorand/tools/transactionManager/appTransactions/types.md#rekeyto-7) | [defi/protocols/src/vendors/algorand/tools/transactionManager/appTransactions/types.ts:16](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/vendors/algorand/tools/transactionManager/appTransactions/types.ts#L16) |
| <a id="suggestedparams-5"></a> `suggestedParams` | `SuggestedParams` | [`BaseAppTxnParams`](/docs/api/defi/protocols/src/vendors/algorand/tools/transactionManager/appTransactions/types.md#baseapptxnparams).[`suggestedParams`](/docs/api/defi/protocols/src/vendors/algorand/tools/transactionManager/appTransactions/types.md#suggestedparams-7) | [defi/protocols/src/vendors/algorand/tools/transactionManager/appTransactions/types.ts:13](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/vendors/algorand/tools/transactionManager/appTransactions/types.ts#L13) |

***

### AppUpdateTxnParams

Defined in: [defi/protocols/src/vendors/algorand/tools/transactionManager/appTransactions/types.ts:37](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/vendors/algorand/tools/transactionManager/appTransactions/types.ts#L37)

#### Extends

- [`BaseAppTxnParams`](/docs/api/defi/protocols/src/vendors/algorand/tools/transactionManager/appTransactions/types.md#baseapptxnparams)

#### Properties

| Property | Type | Inherited from | Defined in |
| :------ | :------ | :------ | :------ |
| <a id="accounts-6"></a> `accounts?` | `string`[] | [`BaseAppTxnParams`](/docs/api/defi/protocols/src/vendors/algorand/tools/transactionManager/appTransactions/types.md#baseapptxnparams).[`accounts`](/docs/api/defi/protocols/src/vendors/algorand/tools/transactionManager/appTransactions/types.md#accounts-7) | [defi/protocols/src/vendors/algorand/tools/transactionManager/appTransactions/types.ts:18](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/vendors/algorand/tools/transactionManager/appTransactions/types.ts#L18) |
| <a id="appargs-6"></a> `appArgs?` | `Uint8Array`\<`ArrayBufferLike`\>[] | [`BaseAppTxnParams`](/docs/api/defi/protocols/src/vendors/algorand/tools/transactionManager/appTransactions/types.md#baseapptxnparams).[`appArgs`](/docs/api/defi/protocols/src/vendors/algorand/tools/transactionManager/appTransactions/types.md#appargs-7) | [defi/protocols/src/vendors/algorand/tools/transactionManager/appTransactions/types.ts:17](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/vendors/algorand/tools/transactionManager/appTransactions/types.ts#L17) |
| <a id="appindex-5"></a> `appIndex` | `number` | - | [defi/protocols/src/vendors/algorand/tools/transactionManager/appTransactions/types.ts:38](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/vendors/algorand/tools/transactionManager/appTransactions/types.ts#L38) |
| <a id="approvalprogram-1"></a> `approvalProgram` | `Uint8Array` | - | [defi/protocols/src/vendors/algorand/tools/transactionManager/appTransactions/types.ts:39](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/vendors/algorand/tools/transactionManager/appTransactions/types.ts#L39) |
| <a id="boxes-6"></a> `boxes?` | \{ `appIndex`: `number`; `name`: `Uint8Array`; \}[] | [`BaseAppTxnParams`](/docs/api/defi/protocols/src/vendors/algorand/tools/transactionManager/appTransactions/types.md#baseapptxnparams).[`boxes`](/docs/api/defi/protocols/src/vendors/algorand/tools/transactionManager/appTransactions/types.md#boxes-7) | [defi/protocols/src/vendors/algorand/tools/transactionManager/appTransactions/types.ts:21](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/vendors/algorand/tools/transactionManager/appTransactions/types.ts#L21) |
| <a id="clearprogram-1"></a> `clearProgram` | `Uint8Array` | - | [defi/protocols/src/vendors/algorand/tools/transactionManager/appTransactions/types.ts:40](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/vendors/algorand/tools/transactionManager/appTransactions/types.ts#L40) |
| <a id="foreignapps-6"></a> `foreignApps?` | `number`[] | [`BaseAppTxnParams`](/docs/api/defi/protocols/src/vendors/algorand/tools/transactionManager/appTransactions/types.md#baseapptxnparams).[`foreignApps`](/docs/api/defi/protocols/src/vendors/algorand/tools/transactionManager/appTransactions/types.md#foreignapps-7) | [defi/protocols/src/vendors/algorand/tools/transactionManager/appTransactions/types.ts:19](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/vendors/algorand/tools/transactionManager/appTransactions/types.ts#L19) |
| <a id="foreignassets-6"></a> `foreignAssets?` | `number`[] | [`BaseAppTxnParams`](/docs/api/defi/protocols/src/vendors/algorand/tools/transactionManager/appTransactions/types.md#baseapptxnparams).[`foreignAssets`](/docs/api/defi/protocols/src/vendors/algorand/tools/transactionManager/appTransactions/types.md#foreignassets-7) | [defi/protocols/src/vendors/algorand/tools/transactionManager/appTransactions/types.ts:20](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/vendors/algorand/tools/transactionManager/appTransactions/types.ts#L20) |
| <a id="from-6"></a> `from` | `string` | [`BaseAppTxnParams`](/docs/api/defi/protocols/src/vendors/algorand/tools/transactionManager/appTransactions/types.md#baseapptxnparams).[`from`](/docs/api/defi/protocols/src/vendors/algorand/tools/transactionManager/appTransactions/types.md#from-7) | [defi/protocols/src/vendors/algorand/tools/transactionManager/appTransactions/types.ts:12](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/vendors/algorand/tools/transactionManager/appTransactions/types.ts#L12) |
| <a id="lease-6"></a> `lease?` | `Uint8Array`\<`ArrayBufferLike`\> | [`BaseAppTxnParams`](/docs/api/defi/protocols/src/vendors/algorand/tools/transactionManager/appTransactions/types.md#baseapptxnparams).[`lease`](/docs/api/defi/protocols/src/vendors/algorand/tools/transactionManager/appTransactions/types.md#lease-7) | [defi/protocols/src/vendors/algorand/tools/transactionManager/appTransactions/types.ts:15](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/vendors/algorand/tools/transactionManager/appTransactions/types.ts#L15) |
| <a id="note-6"></a> `note?` | `Uint8Array`\<`ArrayBufferLike`\> | [`BaseAppTxnParams`](/docs/api/defi/protocols/src/vendors/algorand/tools/transactionManager/appTransactions/types.md#baseapptxnparams).[`note`](/docs/api/defi/protocols/src/vendors/algorand/tools/transactionManager/appTransactions/types.md#note-7) | [defi/protocols/src/vendors/algorand/tools/transactionManager/appTransactions/types.ts:14](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/vendors/algorand/tools/transactionManager/appTransactions/types.ts#L14) |
| <a id="oncomplete-6"></a> `onComplete?` | `any` | [`BaseAppTxnParams`](/docs/api/defi/protocols/src/vendors/algorand/tools/transactionManager/appTransactions/types.md#baseapptxnparams).[`onComplete`](/docs/api/defi/protocols/src/vendors/algorand/tools/transactionManager/appTransactions/types.md#oncomplete-7) | [defi/protocols/src/vendors/algorand/tools/transactionManager/appTransactions/types.ts:22](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/vendors/algorand/tools/transactionManager/appTransactions/types.ts#L22) |
| <a id="rekeyto-6"></a> `rekeyTo?` | `string` | [`BaseAppTxnParams`](/docs/api/defi/protocols/src/vendors/algorand/tools/transactionManager/appTransactions/types.md#baseapptxnparams).[`rekeyTo`](/docs/api/defi/protocols/src/vendors/algorand/tools/transactionManager/appTransactions/types.md#rekeyto-7) | [defi/protocols/src/vendors/algorand/tools/transactionManager/appTransactions/types.ts:16](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/vendors/algorand/tools/transactionManager/appTransactions/types.ts#L16) |
| <a id="suggestedparams-6"></a> `suggestedParams` | `SuggestedParams` | [`BaseAppTxnParams`](/docs/api/defi/protocols/src/vendors/algorand/tools/transactionManager/appTransactions/types.md#baseapptxnparams).[`suggestedParams`](/docs/api/defi/protocols/src/vendors/algorand/tools/transactionManager/appTransactions/types.md#suggestedparams-7) | [defi/protocols/src/vendors/algorand/tools/transactionManager/appTransactions/types.ts:13](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/vendors/algorand/tools/transactionManager/appTransactions/types.ts#L13) |

***

### BaseAppTxnParams

Defined in: [defi/protocols/src/vendors/algorand/tools/transactionManager/appTransactions/types.ts:11](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/vendors/algorand/tools/transactionManager/appTransactions/types.ts#L11)

#### Extended by

- [`AppCreateTxnParams`](/docs/api/defi/protocols/src/vendors/algorand/tools/transactionManager/appTransactions/types.md#appcreatetxnparams)
- [`AppUpdateTxnParams`](/docs/api/defi/protocols/src/vendors/algorand/tools/transactionManager/appTransactions/types.md#appupdatetxnparams)
- [`AppDeleteTxnParams`](/docs/api/defi/protocols/src/vendors/algorand/tools/transactionManager/appTransactions/types.md#appdeletetxnparams)
- [`AppOptInTxnParams`](/docs/api/defi/protocols/src/vendors/algorand/tools/transactionManager/appTransactions/types.md#appoptintxnparams)
- [`AppCloseOutTxnParams`](/docs/api/defi/protocols/src/vendors/algorand/tools/transactionManager/appTransactions/types.md#appcloseouttxnparams)
- [`AppClearStateTxnParams`](/docs/api/defi/protocols/src/vendors/algorand/tools/transactionManager/appTransactions/types.md#appclearstatetxnparams)
- [`AppCallTxnParams`](/docs/api/defi/protocols/src/vendors/algorand/tools/transactionManager/appTransactions/types.md#appcalltxnparams)

#### Properties

| Property | Type | Defined in |
| :------ | :------ | :------ |
| <a id="accounts-7"></a> `accounts?` | `string`[] | [defi/protocols/src/vendors/algorand/tools/transactionManager/appTransactions/types.ts:18](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/vendors/algorand/tools/transactionManager/appTransactions/types.ts#L18) |
| <a id="appargs-7"></a> `appArgs?` | `Uint8Array`\<`ArrayBufferLike`\>[] | [defi/protocols/src/vendors/algorand/tools/transactionManager/appTransactions/types.ts:17](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/vendors/algorand/tools/transactionManager/appTransactions/types.ts#L17) |
| <a id="boxes-7"></a> `boxes?` | \{ `appIndex`: `number`; `name`: `Uint8Array`; \}[] | [defi/protocols/src/vendors/algorand/tools/transactionManager/appTransactions/types.ts:21](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/vendors/algorand/tools/transactionManager/appTransactions/types.ts#L21) |
| <a id="foreignapps-7"></a> `foreignApps?` | `number`[] | [defi/protocols/src/vendors/algorand/tools/transactionManager/appTransactions/types.ts:19](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/vendors/algorand/tools/transactionManager/appTransactions/types.ts#L19) |
| <a id="foreignassets-7"></a> `foreignAssets?` | `number`[] | [defi/protocols/src/vendors/algorand/tools/transactionManager/appTransactions/types.ts:20](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/vendors/algorand/tools/transactionManager/appTransactions/types.ts#L20) |
| <a id="from-7"></a> `from` | `string` | [defi/protocols/src/vendors/algorand/tools/transactionManager/appTransactions/types.ts:12](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/vendors/algorand/tools/transactionManager/appTransactions/types.ts#L12) |
| <a id="lease-7"></a> `lease?` | `Uint8Array`\<`ArrayBufferLike`\> | [defi/protocols/src/vendors/algorand/tools/transactionManager/appTransactions/types.ts:15](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/vendors/algorand/tools/transactionManager/appTransactions/types.ts#L15) |
| <a id="note-7"></a> `note?` | `Uint8Array`\<`ArrayBufferLike`\> | [defi/protocols/src/vendors/algorand/tools/transactionManager/appTransactions/types.ts:14](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/vendors/algorand/tools/transactionManager/appTransactions/types.ts#L14) |
| <a id="oncomplete-7"></a> `onComplete?` | `any` | [defi/protocols/src/vendors/algorand/tools/transactionManager/appTransactions/types.ts:22](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/vendors/algorand/tools/transactionManager/appTransactions/types.ts#L22) |
| <a id="rekeyto-7"></a> `rekeyTo?` | `string` | [defi/protocols/src/vendors/algorand/tools/transactionManager/appTransactions/types.ts:16](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/vendors/algorand/tools/transactionManager/appTransactions/types.ts#L16) |
| <a id="suggestedparams-7"></a> `suggestedParams` | `SuggestedParams` | [defi/protocols/src/vendors/algorand/tools/transactionManager/appTransactions/types.ts:13](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/vendors/algorand/tools/transactionManager/appTransactions/types.ts#L13) |

## Variables

### appTransactionSchemas

```ts
const appTransactionSchemas: {
  makeAppCallTxn: {
     properties: {
        accounts: {
           description: string;
           items: {
              type: string;
           };
           optional: boolean;
           type: string;
        };
        appArgs: {
           description: string;
           items: {
              type: string;
           };
           optional: boolean;
           type: string;
        };
        appIndex: {
           description: string;
           type: string;
        };
        foreignApps: {
           description: string;
           items: {
              type: string;
           };
           optional: boolean;
           type: string;
        };
        foreignAssets: {
           description: string;
           items: {
              type: string;
           };
           optional: boolean;
           type: string;
        };
        from: {
           description: string;
           type: string;
        };
        note: {
           description: string;
           optional: boolean;
           type: string;
        };
     };
     required: string[];
     type: string;
  };
  makeAppClearTxn: {
     properties: {
        accounts: {
           description: string;
           items: {
              type: string;
           };
           optional: boolean;
           type: string;
        };
        appArgs: {
           description: string;
           items: {
              type: string;
           };
           optional: boolean;
           type: string;
        };
        appIndex: {
           description: string;
           type: string;
        };
        foreignApps: {
           description: string;
           items: {
              type: string;
           };
           optional: boolean;
           type: string;
        };
        foreignAssets: {
           description: string;
           items: {
              type: string;
           };
           optional: boolean;
           type: string;
        };
        from: {
           description: string;
           type: string;
        };
        lease: {
           description: string;
           optional: boolean;
           type: string;
        };
        note: {
           description: string;
           optional: boolean;
           type: string;
        };
        onComplete: {
           description: string;
           optional: boolean;
           type: string;
        };
        rekeyTo: {
           description: string;
           optional: boolean;
           type: string;
        };
     };
     required: string[];
     type: string;
  };
  makeAppCloseOutTxn: {
     properties: {
        accounts: {
           description: string;
           items: {
              type: string;
           };
           optional: boolean;
           type: string;
        };
        appArgs: {
           description: string;
           items: {
              type: string;
           };
           optional: boolean;
           type: string;
        };
        appIndex: {
           description: string;
           type: string;
        };
        foreignApps: {
           description: string;
           items: {
              type: string;
           };
           optional: boolean;
           type: string;
        };
        foreignAssets: {
           description: string;
           items: {
              type: string;
           };
           optional: boolean;
           type: string;
        };
        from: {
           description: string;
           type: string;
        };
        lease: {
           description: string;
           optional: boolean;
           type: string;
        };
        note: {
           description: string;
           optional: boolean;
           type: string;
        };
        onComplete: {
           description: string;
           optional: boolean;
           type: string;
        };
        rekeyTo: {
           description: string;
           optional: boolean;
           type: string;
        };
     };
     required: string[];
     type: string;
  };
  makeAppCreateTxn: {
     properties: {
        accounts: {
           description: string;
           items: {
              type: string;
           };
           optional: boolean;
           type: string;
        };
        appArgs: {
           description: string;
           items: {
              type: string;
           };
           optional: boolean;
           type: string;
        };
        approvalProgram: {
           description: string;
           type: string;
        };
        clearProgram: {
           description: string;
           type: string;
        };
        extraPages: {
           description: string;
           optional: boolean;
           type: string;
        };
        foreignApps: {
           description: string;
           items: {
              type: string;
           };
           optional: boolean;
           type: string;
        };
        foreignAssets: {
           description: string;
           items: {
              type: string;
           };
           optional: boolean;
           type: string;
        };
        from: {
           description: string;
           type: string;
        };
        lease: {
           description: string;
           optional: boolean;
           type: string;
        };
        note: {
           description: string;
           optional: boolean;
           type: string;
        };
        numGlobalByteSlices: {
           description: string;
           type: string;
        };
        numGlobalInts: {
           description: string;
           type: string;
        };
        numLocalByteSlices: {
           description: string;
           type: string;
        };
        numLocalInts: {
           description: string;
           type: string;
        };
        rekeyTo: {
           description: string;
           optional: boolean;
           type: string;
        };
     };
     required: string[];
     type: string;
  };
  makeAppDeleteTxn: {
     properties: {
        accounts: {
           description: string;
           items: {
              type: string;
           };
           optional: boolean;
           type: string;
        };
        appArgs: {
           description: string;
           items: {
              type: string;
           };
           optional: boolean;
           type: string;
        };
        appIndex: {
           description: string;
           type: string;
        };
        foreignApps: {
           description: string;
           items: {
              type: string;
           };
           optional: boolean;
           type: string;
        };
        foreignAssets: {
           description: string;
           items: {
              type: string;
           };
           optional: boolean;
           type: string;
        };
        from: {
           description: string;
           type: string;
        };
        lease: {
           description: string;
           optional: boolean;
           type: string;
        };
        note: {
           description: string;
           optional: boolean;
           type: string;
        };
        onComplete: {
           description: string;
           optional: boolean;
           type: string;
        };
        rekeyTo: {
           description: string;
           optional: boolean;
           type: string;
        };
     };
     required: string[];
     type: string;
  };
  makeAppOptInTxn: {
     properties: {
        accounts: {
           description: string;
           items: {
              type: string;
           };
           optional: boolean;
           type: string;
        };
        appArgs: {
           description: string;
           items: {
              type: string;
           };
           optional: boolean;
           type: string;
        };
        appIndex: {
           description: string;
           type: string;
        };
        foreignApps: {
           description: string;
           items: {
              type: string;
           };
           optional: boolean;
           type: string;
        };
        foreignAssets: {
           description: string;
           items: {
              type: string;
           };
           optional: boolean;
           type: string;
        };
        from: {
           description: string;
           type: string;
        };
        lease: {
           description: string;
           optional: boolean;
           type: string;
        };
        note: {
           description: string;
           optional: boolean;
           type: string;
        };
        onComplete: {
           description: string;
           optional: boolean;
           type: string;
        };
        rekeyTo: {
           description: string;
           optional: boolean;
           type: string;
        };
     };
     required: string[];
     type: string;
  };
  makeAppUpdateTxn: {
     properties: {
        accounts: {
           description: string;
           items: {
              type: string;
           };
           optional: boolean;
           type: string;
        };
        appArgs: {
           description: string;
           items: {
              type: string;
           };
           optional: boolean;
           type: string;
        };
        appIndex: {
           description: string;
           type: string;
        };
        approvalProgram: {
           description: string;
           type: string;
        };
        clearProgram: {
           description: string;
           type: string;
        };
        foreignApps: {
           description: string;
           items: {
              type: string;
           };
           optional: boolean;
           type: string;
        };
        foreignAssets: {
           description: string;
           items: {
              type: string;
           };
           optional: boolean;
           type: string;
        };
        from: {
           description: string;
           type: string;
        };
        lease: {
           description: string;
           optional: boolean;
           type: string;
        };
        note: {
           description: string;
           optional: boolean;
           type: string;
        };
        onComplete: {
           description: string;
           optional: boolean;
           type: string;
        };
        rekeyTo: {
           description: string;
           optional: boolean;
           type: string;
        };
     };
     required: string[];
     type: string;
  };
};
```

Defined in: [defi/protocols/src/vendors/algorand/tools/transactionManager/appTransactions/types.ts:69](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/vendors/algorand/tools/transactionManager/appTransactions/types.ts#L69)

#### Type Declaration

| Name | Type | Default value | Defined in |
| :------ | :------ | :------ | :------ |
| <a id="makeappcalltxn"></a> `makeAppCallTxn` | \{ `properties`: \{ `accounts`: \{ `description`: `string`; `items`: \{ `type`: `string`; \}; `optional`: `boolean`; `type`: `string`; \}; `appArgs`: \{ `description`: `string`; `items`: \{ `type`: `string`; \}; `optional`: `boolean`; `type`: `string`; \}; `appIndex`: \{ `description`: `string`; `type`: `string`; \}; `foreignApps`: \{ `description`: `string`; `items`: \{ `type`: `string`; \}; `optional`: `boolean`; `type`: `string`; \}; `foreignAssets`: \{ `description`: `string`; `items`: \{ `type`: `string`; \}; `optional`: `boolean`; `type`: `string`; \}; `from`: \{ `description`: `string`; `type`: `string`; \}; `note`: \{ `description`: `string`; `optional`: `boolean`; `type`: `string`; \}; \}; `required`: `string`[]; `type`: `string`; \} | - | [defi/protocols/src/vendors/algorand/tools/transactionManager/appTransactions/types.ts:293](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/vendors/algorand/tools/transactionManager/appTransactions/types.ts#L293) |
| `makeAppCallTxn.properties` | \{ `accounts`: \{ `description`: `string`; `items`: \{ `type`: `string`; \}; `optional`: `boolean`; `type`: `string`; \}; `appArgs`: \{ `description`: `string`; `items`: \{ `type`: `string`; \}; `optional`: `boolean`; `type`: `string`; \}; `appIndex`: \{ `description`: `string`; `type`: `string`; \}; `foreignApps`: \{ `description`: `string`; `items`: \{ `type`: `string`; \}; `optional`: `boolean`; `type`: `string`; \}; `foreignAssets`: \{ `description`: `string`; `items`: \{ `type`: `string`; \}; `optional`: `boolean`; `type`: `string`; \}; `from`: \{ `description`: `string`; `type`: `string`; \}; `note`: \{ `description`: `string`; `optional`: `boolean`; `type`: `string`; \}; \} | - | [defi/protocols/src/vendors/algorand/tools/transactionManager/appTransactions/types.ts:295](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/vendors/algorand/tools/transactionManager/appTransactions/types.ts#L295) |
| `makeAppCallTxn.properties.accounts` | \{ `description`: `string`; `items`: \{ `type`: `string`; \}; `optional`: `boolean`; `type`: `string`; \} | - | [defi/protocols/src/vendors/algorand/tools/transactionManager/appTransactions/types.ts:304](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/vendors/algorand/tools/transactionManager/appTransactions/types.ts#L304) |
| `makeAppCallTxn.properties.accounts.description` | `string` | `'Accounts whose local state may be accessed (max 4 accounts)'` | [defi/protocols/src/vendors/algorand/tools/transactionManager/appTransactions/types.ts:308](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/vendors/algorand/tools/transactionManager/appTransactions/types.ts#L308) |
| `makeAppCallTxn.properties.accounts.items` | \{ `type`: `string`; \} | - | [defi/protocols/src/vendors/algorand/tools/transactionManager/appTransactions/types.ts:306](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/vendors/algorand/tools/transactionManager/appTransactions/types.ts#L306) |
| `makeAppCallTxn.properties.accounts.items.type` | `string` | `'string'` | [defi/protocols/src/vendors/algorand/tools/transactionManager/appTransactions/types.ts:306](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/vendors/algorand/tools/transactionManager/appTransactions/types.ts#L306) |
| `makeAppCallTxn.properties.accounts.optional` | `boolean` | `true` | [defi/protocols/src/vendors/algorand/tools/transactionManager/appTransactions/types.ts:307](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/vendors/algorand/tools/transactionManager/appTransactions/types.ts#L307) |
| `makeAppCallTxn.properties.accounts.type` | `string` | `'array'` | [defi/protocols/src/vendors/algorand/tools/transactionManager/appTransactions/types.ts:305](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/vendors/algorand/tools/transactionManager/appTransactions/types.ts#L305) |
| `makeAppCallTxn.properties.appArgs` | \{ `description`: `string`; `items`: \{ `type`: `string`; \}; `optional`: `boolean`; `type`: `string`; \} | - | [defi/protocols/src/vendors/algorand/tools/transactionManager/appTransactions/types.ts:298](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/vendors/algorand/tools/transactionManager/appTransactions/types.ts#L298) |
| `makeAppCallTxn.properties.appArgs.description` | `string` | `'Arguments to pass to the application (max 16 arguments)'` | [defi/protocols/src/vendors/algorand/tools/transactionManager/appTransactions/types.ts:302](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/vendors/algorand/tools/transactionManager/appTransactions/types.ts#L302) |
| `makeAppCallTxn.properties.appArgs.items` | \{ `type`: `string`; \} | - | [defi/protocols/src/vendors/algorand/tools/transactionManager/appTransactions/types.ts:300](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/vendors/algorand/tools/transactionManager/appTransactions/types.ts#L300) |
| `makeAppCallTxn.properties.appArgs.items.type` | `string` | `'string'` | [defi/protocols/src/vendors/algorand/tools/transactionManager/appTransactions/types.ts:300](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/vendors/algorand/tools/transactionManager/appTransactions/types.ts#L300) |
| `makeAppCallTxn.properties.appArgs.optional` | `boolean` | `true` | [defi/protocols/src/vendors/algorand/tools/transactionManager/appTransactions/types.ts:301](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/vendors/algorand/tools/transactionManager/appTransactions/types.ts#L301) |
| `makeAppCallTxn.properties.appArgs.type` | `string` | `'array'` | [defi/protocols/src/vendors/algorand/tools/transactionManager/appTransactions/types.ts:299](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/vendors/algorand/tools/transactionManager/appTransactions/types.ts#L299) |
| `makeAppCallTxn.properties.appIndex` | \{ `description`: `string`; `type`: `string`; \} | - | [defi/protocols/src/vendors/algorand/tools/transactionManager/appTransactions/types.ts:297](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/vendors/algorand/tools/transactionManager/appTransactions/types.ts#L297) |
| `makeAppCallTxn.properties.appIndex.description` | `string` | `'ID of the application to call'` | [defi/protocols/src/vendors/algorand/tools/transactionManager/appTransactions/types.ts:297](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/vendors/algorand/tools/transactionManager/appTransactions/types.ts#L297) |
| `makeAppCallTxn.properties.appIndex.type` | `string` | `'integer'` | [defi/protocols/src/vendors/algorand/tools/transactionManager/appTransactions/types.ts:297](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/vendors/algorand/tools/transactionManager/appTransactions/types.ts#L297) |
| `makeAppCallTxn.properties.foreignApps` | \{ `description`: `string`; `items`: \{ `type`: `string`; \}; `optional`: `boolean`; `type`: `string`; \} | - | [defi/protocols/src/vendors/algorand/tools/transactionManager/appTransactions/types.ts:310](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/vendors/algorand/tools/transactionManager/appTransactions/types.ts#L310) |
| `makeAppCallTxn.properties.foreignApps.description` | `string` | `'IDs of apps whose global state may be accessed (max 8 apps)'` | [defi/protocols/src/vendors/algorand/tools/transactionManager/appTransactions/types.ts:314](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/vendors/algorand/tools/transactionManager/appTransactions/types.ts#L314) |
| `makeAppCallTxn.properties.foreignApps.items` | \{ `type`: `string`; \} | - | [defi/protocols/src/vendors/algorand/tools/transactionManager/appTransactions/types.ts:312](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/vendors/algorand/tools/transactionManager/appTransactions/types.ts#L312) |
| `makeAppCallTxn.properties.foreignApps.items.type` | `string` | `'integer'` | [defi/protocols/src/vendors/algorand/tools/transactionManager/appTransactions/types.ts:312](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/vendors/algorand/tools/transactionManager/appTransactions/types.ts#L312) |
| `makeAppCallTxn.properties.foreignApps.optional` | `boolean` | `true` | [defi/protocols/src/vendors/algorand/tools/transactionManager/appTransactions/types.ts:313](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/vendors/algorand/tools/transactionManager/appTransactions/types.ts#L313) |
| `makeAppCallTxn.properties.foreignApps.type` | `string` | `'array'` | [defi/protocols/src/vendors/algorand/tools/transactionManager/appTransactions/types.ts:311](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/vendors/algorand/tools/transactionManager/appTransactions/types.ts#L311) |
| `makeAppCallTxn.properties.foreignAssets` | \{ `description`: `string`; `items`: \{ `type`: `string`; \}; `optional`: `boolean`; `type`: `string`; \} | - | [defi/protocols/src/vendors/algorand/tools/transactionManager/appTransactions/types.ts:316](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/vendors/algorand/tools/transactionManager/appTransactions/types.ts#L316) |
| `makeAppCallTxn.properties.foreignAssets.description` | `string` | `'IDs of assets that may be accessed (max 8 assets)'` | [defi/protocols/src/vendors/algorand/tools/transactionManager/appTransactions/types.ts:320](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/vendors/algorand/tools/transactionManager/appTransactions/types.ts#L320) |
| `makeAppCallTxn.properties.foreignAssets.items` | \{ `type`: `string`; \} | - | [defi/protocols/src/vendors/algorand/tools/transactionManager/appTransactions/types.ts:318](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/vendors/algorand/tools/transactionManager/appTransactions/types.ts#L318) |
| `makeAppCallTxn.properties.foreignAssets.items.type` | `string` | `'integer'` | [defi/protocols/src/vendors/algorand/tools/transactionManager/appTransactions/types.ts:318](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/vendors/algorand/tools/transactionManager/appTransactions/types.ts#L318) |
| `makeAppCallTxn.properties.foreignAssets.optional` | `boolean` | `true` | [defi/protocols/src/vendors/algorand/tools/transactionManager/appTransactions/types.ts:319](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/vendors/algorand/tools/transactionManager/appTransactions/types.ts#L319) |
| `makeAppCallTxn.properties.foreignAssets.type` | `string` | `'array'` | [defi/protocols/src/vendors/algorand/tools/transactionManager/appTransactions/types.ts:317](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/vendors/algorand/tools/transactionManager/appTransactions/types.ts#L317) |
| `makeAppCallTxn.properties.from` | \{ `description`: `string`; `type`: `string`; \} | - | [defi/protocols/src/vendors/algorand/tools/transactionManager/appTransactions/types.ts:296](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/vendors/algorand/tools/transactionManager/appTransactions/types.ts#L296) |
| `makeAppCallTxn.properties.from.description` | `string` | `'Sender address in standard Algorand format (58 characters)'` | [defi/protocols/src/vendors/algorand/tools/transactionManager/appTransactions/types.ts:296](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/vendors/algorand/tools/transactionManager/appTransactions/types.ts#L296) |
| `makeAppCallTxn.properties.from.type` | `string` | `'string'` | [defi/protocols/src/vendors/algorand/tools/transactionManager/appTransactions/types.ts:296](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/vendors/algorand/tools/transactionManager/appTransactions/types.ts#L296) |
| `makeAppCallTxn.properties.note` | \{ `description`: `string`; `optional`: `boolean`; `type`: `string`; \} | - | [defi/protocols/src/vendors/algorand/tools/transactionManager/appTransactions/types.ts:322](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/vendors/algorand/tools/transactionManager/appTransactions/types.ts#L322) |
| `makeAppCallTxn.properties.note.description` | `string` | `'Transaction note field (up to 1000 bytes)'` | [defi/protocols/src/vendors/algorand/tools/transactionManager/appTransactions/types.ts:322](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/vendors/algorand/tools/transactionManager/appTransactions/types.ts#L322) |
| `makeAppCallTxn.properties.note.optional` | `boolean` | `true` | [defi/protocols/src/vendors/algorand/tools/transactionManager/appTransactions/types.ts:322](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/vendors/algorand/tools/transactionManager/appTransactions/types.ts#L322) |
| `makeAppCallTxn.properties.note.type` | `string` | `'string'` | [defi/protocols/src/vendors/algorand/tools/transactionManager/appTransactions/types.ts:322](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/vendors/algorand/tools/transactionManager/appTransactions/types.ts#L322) |
| `makeAppCallTxn.required` | `string`[] | - | [defi/protocols/src/vendors/algorand/tools/transactionManager/appTransactions/types.ts:324](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/vendors/algorand/tools/transactionManager/appTransactions/types.ts#L324) |
| `makeAppCallTxn.type` | `string` | `'object'` | [defi/protocols/src/vendors/algorand/tools/transactionManager/appTransactions/types.ts:294](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/vendors/algorand/tools/transactionManager/appTransactions/types.ts#L294) |
| <a id="makeappcleartxn"></a> `makeAppClearTxn` | \{ `properties`: \{ `accounts`: \{ `description`: `string`; `items`: \{ `type`: `string`; \}; `optional`: `boolean`; `type`: `string`; \}; `appArgs`: \{ `description`: `string`; `items`: \{ `type`: `string`; \}; `optional`: `boolean`; `type`: `string`; \}; `appIndex`: \{ `description`: `string`; `type`: `string`; \}; `foreignApps`: \{ `description`: `string`; `items`: \{ `type`: `string`; \}; `optional`: `boolean`; `type`: `string`; \}; `foreignAssets`: \{ `description`: `string`; `items`: \{ `type`: `string`; \}; `optional`: `boolean`; `type`: `string`; \}; `from`: \{ `description`: `string`; `type`: `string`; \}; `lease`: \{ `description`: `string`; `optional`: `boolean`; `type`: `string`; \}; `note`: \{ `description`: `string`; `optional`: `boolean`; `type`: `string`; \}; `onComplete`: \{ `description`: `string`; `optional`: `boolean`; `type`: `string`; \}; `rekeyTo`: \{ `description`: `string`; `optional`: `boolean`; `type`: `string`; \}; \}; `required`: `string`[]; `type`: `string`; \} | - | [defi/protocols/src/vendors/algorand/tools/transactionManager/appTransactions/types.ts:257](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/vendors/algorand/tools/transactionManager/appTransactions/types.ts#L257) |
| `makeAppClearTxn.properties` | \{ `accounts`: \{ `description`: `string`; `items`: \{ `type`: `string`; \}; `optional`: `boolean`; `type`: `string`; \}; `appArgs`: \{ `description`: `string`; `items`: \{ `type`: `string`; \}; `optional`: `boolean`; `type`: `string`; \}; `appIndex`: \{ `description`: `string`; `type`: `string`; \}; `foreignApps`: \{ `description`: `string`; `items`: \{ `type`: `string`; \}; `optional`: `boolean`; `type`: `string`; \}; `foreignAssets`: \{ `description`: `string`; `items`: \{ `type`: `string`; \}; `optional`: `boolean`; `type`: `string`; \}; `from`: \{ `description`: `string`; `type`: `string`; \}; `lease`: \{ `description`: `string`; `optional`: `boolean`; `type`: `string`; \}; `note`: \{ `description`: `string`; `optional`: `boolean`; `type`: `string`; \}; `onComplete`: \{ `description`: `string`; `optional`: `boolean`; `type`: `string`; \}; `rekeyTo`: \{ `description`: `string`; `optional`: `boolean`; `type`: `string`; \}; \} | - | [defi/protocols/src/vendors/algorand/tools/transactionManager/appTransactions/types.ts:259](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/vendors/algorand/tools/transactionManager/appTransactions/types.ts#L259) |
| `makeAppClearTxn.properties.accounts` | \{ `description`: `string`; `items`: \{ `type`: `string`; \}; `optional`: `boolean`; `type`: `string`; \} | - | [defi/protocols/src/vendors/algorand/tools/transactionManager/appTransactions/types.ts:271](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/vendors/algorand/tools/transactionManager/appTransactions/types.ts#L271) |
| `makeAppClearTxn.properties.accounts.description` | `string` | `'Accounts whose local state may be accessed (max 4 accounts)'` | [defi/protocols/src/vendors/algorand/tools/transactionManager/appTransactions/types.ts:275](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/vendors/algorand/tools/transactionManager/appTransactions/types.ts#L275) |
| `makeAppClearTxn.properties.accounts.items` | \{ `type`: `string`; \} | - | [defi/protocols/src/vendors/algorand/tools/transactionManager/appTransactions/types.ts:273](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/vendors/algorand/tools/transactionManager/appTransactions/types.ts#L273) |
| `makeAppClearTxn.properties.accounts.items.type` | `string` | `'string'` | [defi/protocols/src/vendors/algorand/tools/transactionManager/appTransactions/types.ts:273](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/vendors/algorand/tools/transactionManager/appTransactions/types.ts#L273) |
| `makeAppClearTxn.properties.accounts.optional` | `boolean` | `true` | [defi/protocols/src/vendors/algorand/tools/transactionManager/appTransactions/types.ts:274](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/vendors/algorand/tools/transactionManager/appTransactions/types.ts#L274) |
| `makeAppClearTxn.properties.accounts.type` | `string` | `'array'` | [defi/protocols/src/vendors/algorand/tools/transactionManager/appTransactions/types.ts:272](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/vendors/algorand/tools/transactionManager/appTransactions/types.ts#L272) |
| `makeAppClearTxn.properties.appArgs` | \{ `description`: `string`; `items`: \{ `type`: `string`; \}; `optional`: `boolean`; `type`: `string`; \} | - | [defi/protocols/src/vendors/algorand/tools/transactionManager/appTransactions/types.ts:265](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/vendors/algorand/tools/transactionManager/appTransactions/types.ts#L265) |
| `makeAppClearTxn.properties.appArgs.description` | `string` | `'Arguments to pass to the application (max 16 arguments)'` | [defi/protocols/src/vendors/algorand/tools/transactionManager/appTransactions/types.ts:269](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/vendors/algorand/tools/transactionManager/appTransactions/types.ts#L269) |
| `makeAppClearTxn.properties.appArgs.items` | \{ `type`: `string`; \} | - | [defi/protocols/src/vendors/algorand/tools/transactionManager/appTransactions/types.ts:267](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/vendors/algorand/tools/transactionManager/appTransactions/types.ts#L267) |
| `makeAppClearTxn.properties.appArgs.items.type` | `string` | `'string'` | [defi/protocols/src/vendors/algorand/tools/transactionManager/appTransactions/types.ts:267](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/vendors/algorand/tools/transactionManager/appTransactions/types.ts#L267) |
| `makeAppClearTxn.properties.appArgs.optional` | `boolean` | `true` | [defi/protocols/src/vendors/algorand/tools/transactionManager/appTransactions/types.ts:268](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/vendors/algorand/tools/transactionManager/appTransactions/types.ts#L268) |
| `makeAppClearTxn.properties.appArgs.type` | `string` | `'array'` | [defi/protocols/src/vendors/algorand/tools/transactionManager/appTransactions/types.ts:266](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/vendors/algorand/tools/transactionManager/appTransactions/types.ts#L266) |
| `makeAppClearTxn.properties.appIndex` | \{ `description`: `string`; `type`: `string`; \} | - | [defi/protocols/src/vendors/algorand/tools/transactionManager/appTransactions/types.ts:261](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/vendors/algorand/tools/transactionManager/appTransactions/types.ts#L261) |
| `makeAppClearTxn.properties.appIndex.description` | `string` | `'ID of the application to clear state from'` | [defi/protocols/src/vendors/algorand/tools/transactionManager/appTransactions/types.ts:261](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/vendors/algorand/tools/transactionManager/appTransactions/types.ts#L261) |
| `makeAppClearTxn.properties.appIndex.type` | `string` | `'integer'` | [defi/protocols/src/vendors/algorand/tools/transactionManager/appTransactions/types.ts:261](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/vendors/algorand/tools/transactionManager/appTransactions/types.ts#L261) |
| `makeAppClearTxn.properties.foreignApps` | \{ `description`: `string`; `items`: \{ `type`: `string`; \}; `optional`: `boolean`; `type`: `string`; \} | - | [defi/protocols/src/vendors/algorand/tools/transactionManager/appTransactions/types.ts:277](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/vendors/algorand/tools/transactionManager/appTransactions/types.ts#L277) |
| `makeAppClearTxn.properties.foreignApps.description` | `string` | `'IDs of apps whose global state may be accessed (max 8 apps)'` | [defi/protocols/src/vendors/algorand/tools/transactionManager/appTransactions/types.ts:281](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/vendors/algorand/tools/transactionManager/appTransactions/types.ts#L281) |
| `makeAppClearTxn.properties.foreignApps.items` | \{ `type`: `string`; \} | - | [defi/protocols/src/vendors/algorand/tools/transactionManager/appTransactions/types.ts:279](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/vendors/algorand/tools/transactionManager/appTransactions/types.ts#L279) |
| `makeAppClearTxn.properties.foreignApps.items.type` | `string` | `'integer'` | [defi/protocols/src/vendors/algorand/tools/transactionManager/appTransactions/types.ts:279](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/vendors/algorand/tools/transactionManager/appTransactions/types.ts#L279) |
| `makeAppClearTxn.properties.foreignApps.optional` | `boolean` | `true` | [defi/protocols/src/vendors/algorand/tools/transactionManager/appTransactions/types.ts:280](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/vendors/algorand/tools/transactionManager/appTransactions/types.ts#L280) |
| `makeAppClearTxn.properties.foreignApps.type` | `string` | `'array'` | [defi/protocols/src/vendors/algorand/tools/transactionManager/appTransactions/types.ts:278](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/vendors/algorand/tools/transactionManager/appTransactions/types.ts#L278) |
| `makeAppClearTxn.properties.foreignAssets` | \{ `description`: `string`; `items`: \{ `type`: `string`; \}; `optional`: `boolean`; `type`: `string`; \} | - | [defi/protocols/src/vendors/algorand/tools/transactionManager/appTransactions/types.ts:283](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/vendors/algorand/tools/transactionManager/appTransactions/types.ts#L283) |
| `makeAppClearTxn.properties.foreignAssets.description` | `string` | `'IDs of assets that may be accessed (max 8 assets)'` | [defi/protocols/src/vendors/algorand/tools/transactionManager/appTransactions/types.ts:287](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/vendors/algorand/tools/transactionManager/appTransactions/types.ts#L287) |
| `makeAppClearTxn.properties.foreignAssets.items` | \{ `type`: `string`; \} | - | [defi/protocols/src/vendors/algorand/tools/transactionManager/appTransactions/types.ts:285](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/vendors/algorand/tools/transactionManager/appTransactions/types.ts#L285) |
| `makeAppClearTxn.properties.foreignAssets.items.type` | `string` | `'integer'` | [defi/protocols/src/vendors/algorand/tools/transactionManager/appTransactions/types.ts:285](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/vendors/algorand/tools/transactionManager/appTransactions/types.ts#L285) |
| `makeAppClearTxn.properties.foreignAssets.optional` | `boolean` | `true` | [defi/protocols/src/vendors/algorand/tools/transactionManager/appTransactions/types.ts:286](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/vendors/algorand/tools/transactionManager/appTransactions/types.ts#L286) |
| `makeAppClearTxn.properties.foreignAssets.type` | `string` | `'array'` | [defi/protocols/src/vendors/algorand/tools/transactionManager/appTransactions/types.ts:284](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/vendors/algorand/tools/transactionManager/appTransactions/types.ts#L284) |
| `makeAppClearTxn.properties.from` | \{ `description`: `string`; `type`: `string`; \} | - | [defi/protocols/src/vendors/algorand/tools/transactionManager/appTransactions/types.ts:260](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/vendors/algorand/tools/transactionManager/appTransactions/types.ts#L260) |
| `makeAppClearTxn.properties.from.description` | `string` | `'Sender address in standard Algorand format (58 characters)'` | [defi/protocols/src/vendors/algorand/tools/transactionManager/appTransactions/types.ts:260](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/vendors/algorand/tools/transactionManager/appTransactions/types.ts#L260) |
| `makeAppClearTxn.properties.from.type` | `string` | `'string'` | [defi/protocols/src/vendors/algorand/tools/transactionManager/appTransactions/types.ts:260](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/vendors/algorand/tools/transactionManager/appTransactions/types.ts#L260) |
| `makeAppClearTxn.properties.lease` | \{ `description`: `string`; `optional`: `boolean`; `type`: `string`; \} | - | [defi/protocols/src/vendors/algorand/tools/transactionManager/appTransactions/types.ts:263](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/vendors/algorand/tools/transactionManager/appTransactions/types.ts#L263) |
| `makeAppClearTxn.properties.lease.description` | `string` | `'Lease enforces mutual exclusion of transactions (32 bytes)'` | [defi/protocols/src/vendors/algorand/tools/transactionManager/appTransactions/types.ts:263](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/vendors/algorand/tools/transactionManager/appTransactions/types.ts#L263) |
| `makeAppClearTxn.properties.lease.optional` | `boolean` | `true` | [defi/protocols/src/vendors/algorand/tools/transactionManager/appTransactions/types.ts:263](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/vendors/algorand/tools/transactionManager/appTransactions/types.ts#L263) |
| `makeAppClearTxn.properties.lease.type` | `string` | `'string'` | [defi/protocols/src/vendors/algorand/tools/transactionManager/appTransactions/types.ts:263](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/vendors/algorand/tools/transactionManager/appTransactions/types.ts#L263) |
| `makeAppClearTxn.properties.note` | \{ `description`: `string`; `optional`: `boolean`; `type`: `string`; \} | - | [defi/protocols/src/vendors/algorand/tools/transactionManager/appTransactions/types.ts:262](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/vendors/algorand/tools/transactionManager/appTransactions/types.ts#L262) |
| `makeAppClearTxn.properties.note.description` | `string` | `'Transaction note field (up to 1000 bytes)'` | [defi/protocols/src/vendors/algorand/tools/transactionManager/appTransactions/types.ts:262](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/vendors/algorand/tools/transactionManager/appTransactions/types.ts#L262) |
| `makeAppClearTxn.properties.note.optional` | `boolean` | `true` | [defi/protocols/src/vendors/algorand/tools/transactionManager/appTransactions/types.ts:262](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/vendors/algorand/tools/transactionManager/appTransactions/types.ts#L262) |
| `makeAppClearTxn.properties.note.type` | `string` | `'string'` | [defi/protocols/src/vendors/algorand/tools/transactionManager/appTransactions/types.ts:262](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/vendors/algorand/tools/transactionManager/appTransactions/types.ts#L262) |
| `makeAppClearTxn.properties.onComplete` | \{ `description`: `string`; `optional`: `boolean`; `type`: `string`; \} | - | [defi/protocols/src/vendors/algorand/tools/transactionManager/appTransactions/types.ts:289](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/vendors/algorand/tools/transactionManager/appTransactions/types.ts#L289) |
| `makeAppClearTxn.properties.onComplete.description` | `string` | `'Application call completion behavior (0=NoOp, 1=OptIn, 2=CloseOut, 3=ClearState, 4=UpdateApplication, 5=DeleteApplication)'` | [defi/protocols/src/vendors/algorand/tools/transactionManager/appTransactions/types.ts:289](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/vendors/algorand/tools/transactionManager/appTransactions/types.ts#L289) |
| `makeAppClearTxn.properties.onComplete.optional` | `boolean` | `true` | [defi/protocols/src/vendors/algorand/tools/transactionManager/appTransactions/types.ts:289](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/vendors/algorand/tools/transactionManager/appTransactions/types.ts#L289) |
| `makeAppClearTxn.properties.onComplete.type` | `string` | `'integer'` | [defi/protocols/src/vendors/algorand/tools/transactionManager/appTransactions/types.ts:289](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/vendors/algorand/tools/transactionManager/appTransactions/types.ts#L289) |
| `makeAppClearTxn.properties.rekeyTo` | \{ `description`: `string`; `optional`: `boolean`; `type`: `string`; \} | - | [defi/protocols/src/vendors/algorand/tools/transactionManager/appTransactions/types.ts:264](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/vendors/algorand/tools/transactionManager/appTransactions/types.ts#L264) |
| `makeAppClearTxn.properties.rekeyTo.description` | `string` | `'Address to rekey the sender account to'` | [defi/protocols/src/vendors/algorand/tools/transactionManager/appTransactions/types.ts:264](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/vendors/algorand/tools/transactionManager/appTransactions/types.ts#L264) |
| `makeAppClearTxn.properties.rekeyTo.optional` | `boolean` | `true` | [defi/protocols/src/vendors/algorand/tools/transactionManager/appTransactions/types.ts:264](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/vendors/algorand/tools/transactionManager/appTransactions/types.ts#L264) |
| `makeAppClearTxn.properties.rekeyTo.type` | `string` | `'string'` | [defi/protocols/src/vendors/algorand/tools/transactionManager/appTransactions/types.ts:264](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/vendors/algorand/tools/transactionManager/appTransactions/types.ts#L264) |
| `makeAppClearTxn.required` | `string`[] | - | [defi/protocols/src/vendors/algorand/tools/transactionManager/appTransactions/types.ts:291](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/vendors/algorand/tools/transactionManager/appTransactions/types.ts#L291) |
| `makeAppClearTxn.type` | `string` | `'object'` | [defi/protocols/src/vendors/algorand/tools/transactionManager/appTransactions/types.ts:258](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/vendors/algorand/tools/transactionManager/appTransactions/types.ts#L258) |
| <a id="makeappcloseouttxn"></a> `makeAppCloseOutTxn` | \{ `properties`: \{ `accounts`: \{ `description`: `string`; `items`: \{ `type`: `string`; \}; `optional`: `boolean`; `type`: `string`; \}; `appArgs`: \{ `description`: `string`; `items`: \{ `type`: `string`; \}; `optional`: `boolean`; `type`: `string`; \}; `appIndex`: \{ `description`: `string`; `type`: `string`; \}; `foreignApps`: \{ `description`: `string`; `items`: \{ `type`: `string`; \}; `optional`: `boolean`; `type`: `string`; \}; `foreignAssets`: \{ `description`: `string`; `items`: \{ `type`: `string`; \}; `optional`: `boolean`; `type`: `string`; \}; `from`: \{ `description`: `string`; `type`: `string`; \}; `lease`: \{ `description`: `string`; `optional`: `boolean`; `type`: `string`; \}; `note`: \{ `description`: `string`; `optional`: `boolean`; `type`: `string`; \}; `onComplete`: \{ `description`: `string`; `optional`: `boolean`; `type`: `string`; \}; `rekeyTo`: \{ `description`: `string`; `optional`: `boolean`; `type`: `string`; \}; \}; `required`: `string`[]; `type`: `string`; \} | - | [defi/protocols/src/vendors/algorand/tools/transactionManager/appTransactions/types.ts:221](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/vendors/algorand/tools/transactionManager/appTransactions/types.ts#L221) |
| `makeAppCloseOutTxn.properties` | \{ `accounts`: \{ `description`: `string`; `items`: \{ `type`: `string`; \}; `optional`: `boolean`; `type`: `string`; \}; `appArgs`: \{ `description`: `string`; `items`: \{ `type`: `string`; \}; `optional`: `boolean`; `type`: `string`; \}; `appIndex`: \{ `description`: `string`; `type`: `string`; \}; `foreignApps`: \{ `description`: `string`; `items`: \{ `type`: `string`; \}; `optional`: `boolean`; `type`: `string`; \}; `foreignAssets`: \{ `description`: `string`; `items`: \{ `type`: `string`; \}; `optional`: `boolean`; `type`: `string`; \}; `from`: \{ `description`: `string`; `type`: `string`; \}; `lease`: \{ `description`: `string`; `optional`: `boolean`; `type`: `string`; \}; `note`: \{ `description`: `string`; `optional`: `boolean`; `type`: `string`; \}; `onComplete`: \{ `description`: `string`; `optional`: `boolean`; `type`: `string`; \}; `rekeyTo`: \{ `description`: `string`; `optional`: `boolean`; `type`: `string`; \}; \} | - | [defi/protocols/src/vendors/algorand/tools/transactionManager/appTransactions/types.ts:223](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/vendors/algorand/tools/transactionManager/appTransactions/types.ts#L223) |
| `makeAppCloseOutTxn.properties.accounts` | \{ `description`: `string`; `items`: \{ `type`: `string`; \}; `optional`: `boolean`; `type`: `string`; \} | - | [defi/protocols/src/vendors/algorand/tools/transactionManager/appTransactions/types.ts:235](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/vendors/algorand/tools/transactionManager/appTransactions/types.ts#L235) |
| `makeAppCloseOutTxn.properties.accounts.description` | `string` | `'Accounts whose local state may be accessed (max 4 accounts)'` | [defi/protocols/src/vendors/algorand/tools/transactionManager/appTransactions/types.ts:239](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/vendors/algorand/tools/transactionManager/appTransactions/types.ts#L239) |
| `makeAppCloseOutTxn.properties.accounts.items` | \{ `type`: `string`; \} | - | [defi/protocols/src/vendors/algorand/tools/transactionManager/appTransactions/types.ts:237](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/vendors/algorand/tools/transactionManager/appTransactions/types.ts#L237) |
| `makeAppCloseOutTxn.properties.accounts.items.type` | `string` | `'string'` | [defi/protocols/src/vendors/algorand/tools/transactionManager/appTransactions/types.ts:237](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/vendors/algorand/tools/transactionManager/appTransactions/types.ts#L237) |
| `makeAppCloseOutTxn.properties.accounts.optional` | `boolean` | `true` | [defi/protocols/src/vendors/algorand/tools/transactionManager/appTransactions/types.ts:238](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/vendors/algorand/tools/transactionManager/appTransactions/types.ts#L238) |
| `makeAppCloseOutTxn.properties.accounts.type` | `string` | `'array'` | [defi/protocols/src/vendors/algorand/tools/transactionManager/appTransactions/types.ts:236](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/vendors/algorand/tools/transactionManager/appTransactions/types.ts#L236) |
| `makeAppCloseOutTxn.properties.appArgs` | \{ `description`: `string`; `items`: \{ `type`: `string`; \}; `optional`: `boolean`; `type`: `string`; \} | - | [defi/protocols/src/vendors/algorand/tools/transactionManager/appTransactions/types.ts:229](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/vendors/algorand/tools/transactionManager/appTransactions/types.ts#L229) |
| `makeAppCloseOutTxn.properties.appArgs.description` | `string` | `'Arguments to pass to the application (max 16 arguments)'` | [defi/protocols/src/vendors/algorand/tools/transactionManager/appTransactions/types.ts:233](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/vendors/algorand/tools/transactionManager/appTransactions/types.ts#L233) |
| `makeAppCloseOutTxn.properties.appArgs.items` | \{ `type`: `string`; \} | - | [defi/protocols/src/vendors/algorand/tools/transactionManager/appTransactions/types.ts:231](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/vendors/algorand/tools/transactionManager/appTransactions/types.ts#L231) |
| `makeAppCloseOutTxn.properties.appArgs.items.type` | `string` | `'string'` | [defi/protocols/src/vendors/algorand/tools/transactionManager/appTransactions/types.ts:231](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/vendors/algorand/tools/transactionManager/appTransactions/types.ts#L231) |
| `makeAppCloseOutTxn.properties.appArgs.optional` | `boolean` | `true` | [defi/protocols/src/vendors/algorand/tools/transactionManager/appTransactions/types.ts:232](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/vendors/algorand/tools/transactionManager/appTransactions/types.ts#L232) |
| `makeAppCloseOutTxn.properties.appArgs.type` | `string` | `'array'` | [defi/protocols/src/vendors/algorand/tools/transactionManager/appTransactions/types.ts:230](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/vendors/algorand/tools/transactionManager/appTransactions/types.ts#L230) |
| `makeAppCloseOutTxn.properties.appIndex` | \{ `description`: `string`; `type`: `string`; \} | - | [defi/protocols/src/vendors/algorand/tools/transactionManager/appTransactions/types.ts:225](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/vendors/algorand/tools/transactionManager/appTransactions/types.ts#L225) |
| `makeAppCloseOutTxn.properties.appIndex.description` | `string` | `'ID of the application to close out from'` | [defi/protocols/src/vendors/algorand/tools/transactionManager/appTransactions/types.ts:225](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/vendors/algorand/tools/transactionManager/appTransactions/types.ts#L225) |
| `makeAppCloseOutTxn.properties.appIndex.type` | `string` | `'integer'` | [defi/protocols/src/vendors/algorand/tools/transactionManager/appTransactions/types.ts:225](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/vendors/algorand/tools/transactionManager/appTransactions/types.ts#L225) |
| `makeAppCloseOutTxn.properties.foreignApps` | \{ `description`: `string`; `items`: \{ `type`: `string`; \}; `optional`: `boolean`; `type`: `string`; \} | - | [defi/protocols/src/vendors/algorand/tools/transactionManager/appTransactions/types.ts:241](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/vendors/algorand/tools/transactionManager/appTransactions/types.ts#L241) |
| `makeAppCloseOutTxn.properties.foreignApps.description` | `string` | `'IDs of apps whose global state may be accessed (max 8 apps)'` | [defi/protocols/src/vendors/algorand/tools/transactionManager/appTransactions/types.ts:245](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/vendors/algorand/tools/transactionManager/appTransactions/types.ts#L245) |
| `makeAppCloseOutTxn.properties.foreignApps.items` | \{ `type`: `string`; \} | - | [defi/protocols/src/vendors/algorand/tools/transactionManager/appTransactions/types.ts:243](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/vendors/algorand/tools/transactionManager/appTransactions/types.ts#L243) |
| `makeAppCloseOutTxn.properties.foreignApps.items.type` | `string` | `'integer'` | [defi/protocols/src/vendors/algorand/tools/transactionManager/appTransactions/types.ts:243](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/vendors/algorand/tools/transactionManager/appTransactions/types.ts#L243) |
| `makeAppCloseOutTxn.properties.foreignApps.optional` | `boolean` | `true` | [defi/protocols/src/vendors/algorand/tools/transactionManager/appTransactions/types.ts:244](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/vendors/algorand/tools/transactionManager/appTransactions/types.ts#L244) |
| `makeAppCloseOutTxn.properties.foreignApps.type` | `string` | `'array'` | [defi/protocols/src/vendors/algorand/tools/transactionManager/appTransactions/types.ts:242](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/vendors/algorand/tools/transactionManager/appTransactions/types.ts#L242) |
| `makeAppCloseOutTxn.properties.foreignAssets` | \{ `description`: `string`; `items`: \{ `type`: `string`; \}; `optional`: `boolean`; `type`: `string`; \} | - | [defi/protocols/src/vendors/algorand/tools/transactionManager/appTransactions/types.ts:247](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/vendors/algorand/tools/transactionManager/appTransactions/types.ts#L247) |
| `makeAppCloseOutTxn.properties.foreignAssets.description` | `string` | `'IDs of assets that may be accessed (max 8 assets)'` | [defi/protocols/src/vendors/algorand/tools/transactionManager/appTransactions/types.ts:251](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/vendors/algorand/tools/transactionManager/appTransactions/types.ts#L251) |
| `makeAppCloseOutTxn.properties.foreignAssets.items` | \{ `type`: `string`; \} | - | [defi/protocols/src/vendors/algorand/tools/transactionManager/appTransactions/types.ts:249](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/vendors/algorand/tools/transactionManager/appTransactions/types.ts#L249) |
| `makeAppCloseOutTxn.properties.foreignAssets.items.type` | `string` | `'integer'` | [defi/protocols/src/vendors/algorand/tools/transactionManager/appTransactions/types.ts:249](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/vendors/algorand/tools/transactionManager/appTransactions/types.ts#L249) |
| `makeAppCloseOutTxn.properties.foreignAssets.optional` | `boolean` | `true` | [defi/protocols/src/vendors/algorand/tools/transactionManager/appTransactions/types.ts:250](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/vendors/algorand/tools/transactionManager/appTransactions/types.ts#L250) |
| `makeAppCloseOutTxn.properties.foreignAssets.type` | `string` | `'array'` | [defi/protocols/src/vendors/algorand/tools/transactionManager/appTransactions/types.ts:248](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/vendors/algorand/tools/transactionManager/appTransactions/types.ts#L248) |
| `makeAppCloseOutTxn.properties.from` | \{ `description`: `string`; `type`: `string`; \} | - | [defi/protocols/src/vendors/algorand/tools/transactionManager/appTransactions/types.ts:224](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/vendors/algorand/tools/transactionManager/appTransactions/types.ts#L224) |
| `makeAppCloseOutTxn.properties.from.description` | `string` | `'Sender address in standard Algorand format (58 characters)'` | [defi/protocols/src/vendors/algorand/tools/transactionManager/appTransactions/types.ts:224](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/vendors/algorand/tools/transactionManager/appTransactions/types.ts#L224) |
| `makeAppCloseOutTxn.properties.from.type` | `string` | `'string'` | [defi/protocols/src/vendors/algorand/tools/transactionManager/appTransactions/types.ts:224](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/vendors/algorand/tools/transactionManager/appTransactions/types.ts#L224) |
| `makeAppCloseOutTxn.properties.lease` | \{ `description`: `string`; `optional`: `boolean`; `type`: `string`; \} | - | [defi/protocols/src/vendors/algorand/tools/transactionManager/appTransactions/types.ts:227](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/vendors/algorand/tools/transactionManager/appTransactions/types.ts#L227) |
| `makeAppCloseOutTxn.properties.lease.description` | `string` | `'Lease enforces mutual exclusion of transactions (32 bytes)'` | [defi/protocols/src/vendors/algorand/tools/transactionManager/appTransactions/types.ts:227](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/vendors/algorand/tools/transactionManager/appTransactions/types.ts#L227) |
| `makeAppCloseOutTxn.properties.lease.optional` | `boolean` | `true` | [defi/protocols/src/vendors/algorand/tools/transactionManager/appTransactions/types.ts:227](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/vendors/algorand/tools/transactionManager/appTransactions/types.ts#L227) |
| `makeAppCloseOutTxn.properties.lease.type` | `string` | `'string'` | [defi/protocols/src/vendors/algorand/tools/transactionManager/appTransactions/types.ts:227](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/vendors/algorand/tools/transactionManager/appTransactions/types.ts#L227) |
| `makeAppCloseOutTxn.properties.note` | \{ `description`: `string`; `optional`: `boolean`; `type`: `string`; \} | - | [defi/protocols/src/vendors/algorand/tools/transactionManager/appTransactions/types.ts:226](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/vendors/algorand/tools/transactionManager/appTransactions/types.ts#L226) |
| `makeAppCloseOutTxn.properties.note.description` | `string` | `'Transaction note field (up to 1000 bytes)'` | [defi/protocols/src/vendors/algorand/tools/transactionManager/appTransactions/types.ts:226](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/vendors/algorand/tools/transactionManager/appTransactions/types.ts#L226) |
| `makeAppCloseOutTxn.properties.note.optional` | `boolean` | `true` | [defi/protocols/src/vendors/algorand/tools/transactionManager/appTransactions/types.ts:226](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/vendors/algorand/tools/transactionManager/appTransactions/types.ts#L226) |
| `makeAppCloseOutTxn.properties.note.type` | `string` | `'string'` | [defi/protocols/src/vendors/algorand/tools/transactionManager/appTransactions/types.ts:226](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/vendors/algorand/tools/transactionManager/appTransactions/types.ts#L226) |
| `makeAppCloseOutTxn.properties.onComplete` | \{ `description`: `string`; `optional`: `boolean`; `type`: `string`; \} | - | [defi/protocols/src/vendors/algorand/tools/transactionManager/appTransactions/types.ts:253](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/vendors/algorand/tools/transactionManager/appTransactions/types.ts#L253) |
| `makeAppCloseOutTxn.properties.onComplete.description` | `string` | `'Application call completion behavior (0=NoOp, 1=OptIn, 2=CloseOut, 3=ClearState, 4=UpdateApplication, 5=DeleteApplication)'` | [defi/protocols/src/vendors/algorand/tools/transactionManager/appTransactions/types.ts:253](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/vendors/algorand/tools/transactionManager/appTransactions/types.ts#L253) |
| `makeAppCloseOutTxn.properties.onComplete.optional` | `boolean` | `true` | [defi/protocols/src/vendors/algorand/tools/transactionManager/appTransactions/types.ts:253](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/vendors/algorand/tools/transactionManager/appTransactions/types.ts#L253) |
| `makeAppCloseOutTxn.properties.onComplete.type` | `string` | `'integer'` | [defi/protocols/src/vendors/algorand/tools/transactionManager/appTransactions/types.ts:253](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/vendors/algorand/tools/transactionManager/appTransactions/types.ts#L253) |
| `makeAppCloseOutTxn.properties.rekeyTo` | \{ `description`: `string`; `optional`: `boolean`; `type`: `string`; \} | - | [defi/protocols/src/vendors/algorand/tools/transactionManager/appTransactions/types.ts:228](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/vendors/algorand/tools/transactionManager/appTransactions/types.ts#L228) |
| `makeAppCloseOutTxn.properties.rekeyTo.description` | `string` | `'Address to rekey the sender account to'` | [defi/protocols/src/vendors/algorand/tools/transactionManager/appTransactions/types.ts:228](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/vendors/algorand/tools/transactionManager/appTransactions/types.ts#L228) |
| `makeAppCloseOutTxn.properties.rekeyTo.optional` | `boolean` | `true` | [defi/protocols/src/vendors/algorand/tools/transactionManager/appTransactions/types.ts:228](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/vendors/algorand/tools/transactionManager/appTransactions/types.ts#L228) |
| `makeAppCloseOutTxn.properties.rekeyTo.type` | `string` | `'string'` | [defi/protocols/src/vendors/algorand/tools/transactionManager/appTransactions/types.ts:228](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/vendors/algorand/tools/transactionManager/appTransactions/types.ts#L228) |
| `makeAppCloseOutTxn.required` | `string`[] | - | [defi/protocols/src/vendors/algorand/tools/transactionManager/appTransactions/types.ts:255](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/vendors/algorand/tools/transactionManager/appTransactions/types.ts#L255) |
| `makeAppCloseOutTxn.type` | `string` | `'object'` | [defi/protocols/src/vendors/algorand/tools/transactionManager/appTransactions/types.ts:222](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/vendors/algorand/tools/transactionManager/appTransactions/types.ts#L222) |
| <a id="makeappcreatetxn"></a> `makeAppCreateTxn` | \{ `properties`: \{ `accounts`: \{ `description`: `string`; `items`: \{ `type`: `string`; \}; `optional`: `boolean`; `type`: `string`; \}; `appArgs`: \{ `description`: `string`; `items`: \{ `type`: `string`; \}; `optional`: `boolean`; `type`: `string`; \}; `approvalProgram`: \{ `description`: `string`; `type`: `string`; \}; `clearProgram`: \{ `description`: `string`; `type`: `string`; \}; `extraPages`: \{ `description`: `string`; `optional`: `boolean`; `type`: `string`; \}; `foreignApps`: \{ `description`: `string`; `items`: \{ `type`: `string`; \}; `optional`: `boolean`; `type`: `string`; \}; `foreignAssets`: \{ `description`: `string`; `items`: \{ `type`: `string`; \}; `optional`: `boolean`; `type`: `string`; \}; `from`: \{ `description`: `string`; `type`: `string`; \}; `lease`: \{ `description`: `string`; `optional`: `boolean`; `type`: `string`; \}; `note`: \{ `description`: `string`; `optional`: `boolean`; `type`: `string`; \}; `numGlobalByteSlices`: \{ `description`: `string`; `type`: `string`; \}; `numGlobalInts`: \{ `description`: `string`; `type`: `string`; \}; `numLocalByteSlices`: \{ `description`: `string`; `type`: `string`; \}; `numLocalInts`: \{ `description`: `string`; `type`: `string`; \}; `rekeyTo`: \{ `description`: `string`; `optional`: `boolean`; `type`: `string`; \}; \}; `required`: `string`[]; `type`: `string`; \} | - | [defi/protocols/src/vendors/algorand/tools/transactionManager/appTransactions/types.ts:70](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/vendors/algorand/tools/transactionManager/appTransactions/types.ts#L70) |
| `makeAppCreateTxn.properties` | \{ `accounts`: \{ `description`: `string`; `items`: \{ `type`: `string`; \}; `optional`: `boolean`; `type`: `string`; \}; `appArgs`: \{ `description`: `string`; `items`: \{ `type`: `string`; \}; `optional`: `boolean`; `type`: `string`; \}; `approvalProgram`: \{ `description`: `string`; `type`: `string`; \}; `clearProgram`: \{ `description`: `string`; `type`: `string`; \}; `extraPages`: \{ `description`: `string`; `optional`: `boolean`; `type`: `string`; \}; `foreignApps`: \{ `description`: `string`; `items`: \{ `type`: `string`; \}; `optional`: `boolean`; `type`: `string`; \}; `foreignAssets`: \{ `description`: `string`; `items`: \{ `type`: `string`; \}; `optional`: `boolean`; `type`: `string`; \}; `from`: \{ `description`: `string`; `type`: `string`; \}; `lease`: \{ `description`: `string`; `optional`: `boolean`; `type`: `string`; \}; `note`: \{ `description`: `string`; `optional`: `boolean`; `type`: `string`; \}; `numGlobalByteSlices`: \{ `description`: `string`; `type`: `string`; \}; `numGlobalInts`: \{ `description`: `string`; `type`: `string`; \}; `numLocalByteSlices`: \{ `description`: `string`; `type`: `string`; \}; `numLocalInts`: \{ `description`: `string`; `type`: `string`; \}; `rekeyTo`: \{ `description`: `string`; `optional`: `boolean`; `type`: `string`; \}; \} | - | [defi/protocols/src/vendors/algorand/tools/transactionManager/appTransactions/types.ts:72](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/vendors/algorand/tools/transactionManager/appTransactions/types.ts#L72) |
| `makeAppCreateTxn.properties.accounts` | \{ `description`: `string`; `items`: \{ `type`: `string`; \}; `optional`: `boolean`; `type`: `string`; \} | - | [defi/protocols/src/vendors/algorand/tools/transactionManager/appTransactions/types.ts:90](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/vendors/algorand/tools/transactionManager/appTransactions/types.ts#L90) |
| `makeAppCreateTxn.properties.accounts.description` | `string` | `'Accounts whose local state may be accessed (max 4 accounts)'` | [defi/protocols/src/vendors/algorand/tools/transactionManager/appTransactions/types.ts:94](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/vendors/algorand/tools/transactionManager/appTransactions/types.ts#L94) |
| `makeAppCreateTxn.properties.accounts.items` | \{ `type`: `string`; \} | - | [defi/protocols/src/vendors/algorand/tools/transactionManager/appTransactions/types.ts:92](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/vendors/algorand/tools/transactionManager/appTransactions/types.ts#L92) |
| `makeAppCreateTxn.properties.accounts.items.type` | `string` | `'string'` | [defi/protocols/src/vendors/algorand/tools/transactionManager/appTransactions/types.ts:92](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/vendors/algorand/tools/transactionManager/appTransactions/types.ts#L92) |
| `makeAppCreateTxn.properties.accounts.optional` | `boolean` | `true` | [defi/protocols/src/vendors/algorand/tools/transactionManager/appTransactions/types.ts:93](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/vendors/algorand/tools/transactionManager/appTransactions/types.ts#L93) |
| `makeAppCreateTxn.properties.accounts.type` | `string` | `'array'` | [defi/protocols/src/vendors/algorand/tools/transactionManager/appTransactions/types.ts:91](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/vendors/algorand/tools/transactionManager/appTransactions/types.ts#L91) |
| `makeAppCreateTxn.properties.appArgs` | \{ `description`: `string`; `items`: \{ `type`: `string`; \}; `optional`: `boolean`; `type`: `string`; \} | - | [defi/protocols/src/vendors/algorand/tools/transactionManager/appTransactions/types.ts:84](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/vendors/algorand/tools/transactionManager/appTransactions/types.ts#L84) |
| `makeAppCreateTxn.properties.appArgs.description` | `string` | `'Arguments to pass to the application (max 16 arguments)'` | [defi/protocols/src/vendors/algorand/tools/transactionManager/appTransactions/types.ts:88](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/vendors/algorand/tools/transactionManager/appTransactions/types.ts#L88) |
| `makeAppCreateTxn.properties.appArgs.items` | \{ `type`: `string`; \} | - | [defi/protocols/src/vendors/algorand/tools/transactionManager/appTransactions/types.ts:86](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/vendors/algorand/tools/transactionManager/appTransactions/types.ts#L86) |
| `makeAppCreateTxn.properties.appArgs.items.type` | `string` | `'string'` | [defi/protocols/src/vendors/algorand/tools/transactionManager/appTransactions/types.ts:86](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/vendors/algorand/tools/transactionManager/appTransactions/types.ts#L86) |
| `makeAppCreateTxn.properties.appArgs.optional` | `boolean` | `true` | [defi/protocols/src/vendors/algorand/tools/transactionManager/appTransactions/types.ts:87](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/vendors/algorand/tools/transactionManager/appTransactions/types.ts#L87) |
| `makeAppCreateTxn.properties.appArgs.type` | `string` | `'array'` | [defi/protocols/src/vendors/algorand/tools/transactionManager/appTransactions/types.ts:85](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/vendors/algorand/tools/transactionManager/appTransactions/types.ts#L85) |
| `makeAppCreateTxn.properties.approvalProgram` | \{ `description`: `string`; `type`: `string`; \} | - | [defi/protocols/src/vendors/algorand/tools/transactionManager/appTransactions/types.ts:74](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/vendors/algorand/tools/transactionManager/appTransactions/types.ts#L74) |
| `makeAppCreateTxn.properties.approvalProgram.description` | `string` | `'Logic that executes when the app is called (compiled TEAL as base64)'` | [defi/protocols/src/vendors/algorand/tools/transactionManager/appTransactions/types.ts:74](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/vendors/algorand/tools/transactionManager/appTransactions/types.ts#L74) |
| `makeAppCreateTxn.properties.approvalProgram.type` | `string` | `'string'` | [defi/protocols/src/vendors/algorand/tools/transactionManager/appTransactions/types.ts:74](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/vendors/algorand/tools/transactionManager/appTransactions/types.ts#L74) |
| `makeAppCreateTxn.properties.clearProgram` | \{ `description`: `string`; `type`: `string`; \} | - | [defi/protocols/src/vendors/algorand/tools/transactionManager/appTransactions/types.ts:75](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/vendors/algorand/tools/transactionManager/appTransactions/types.ts#L75) |
| `makeAppCreateTxn.properties.clearProgram.description` | `string` | `'Logic that executes when clear state is called (compiled TEAL as base64)'` | [defi/protocols/src/vendors/algorand/tools/transactionManager/appTransactions/types.ts:75](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/vendors/algorand/tools/transactionManager/appTransactions/types.ts#L75) |
| `makeAppCreateTxn.properties.clearProgram.type` | `string` | `'string'` | [defi/protocols/src/vendors/algorand/tools/transactionManager/appTransactions/types.ts:75](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/vendors/algorand/tools/transactionManager/appTransactions/types.ts#L75) |
| `makeAppCreateTxn.properties.extraPages` | \{ `description`: `string`; `optional`: `boolean`; `type`: `string`; \} | - | [defi/protocols/src/vendors/algorand/tools/transactionManager/appTransactions/types.ts:80](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/vendors/algorand/tools/transactionManager/appTransactions/types.ts#L80) |
| `makeAppCreateTxn.properties.extraPages.description` | `string` | `'Additional program pages for larger programs (0-3)'` | [defi/protocols/src/vendors/algorand/tools/transactionManager/appTransactions/types.ts:80](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/vendors/algorand/tools/transactionManager/appTransactions/types.ts#L80) |
| `makeAppCreateTxn.properties.extraPages.optional` | `boolean` | `true` | [defi/protocols/src/vendors/algorand/tools/transactionManager/appTransactions/types.ts:80](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/vendors/algorand/tools/transactionManager/appTransactions/types.ts#L80) |
| `makeAppCreateTxn.properties.extraPages.type` | `string` | `'integer'` | [defi/protocols/src/vendors/algorand/tools/transactionManager/appTransactions/types.ts:80](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/vendors/algorand/tools/transactionManager/appTransactions/types.ts#L80) |
| `makeAppCreateTxn.properties.foreignApps` | \{ `description`: `string`; `items`: \{ `type`: `string`; \}; `optional`: `boolean`; `type`: `string`; \} | - | [defi/protocols/src/vendors/algorand/tools/transactionManager/appTransactions/types.ts:96](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/vendors/algorand/tools/transactionManager/appTransactions/types.ts#L96) |
| `makeAppCreateTxn.properties.foreignApps.description` | `string` | `'IDs of apps whose global state may be accessed (max 8 apps)'` | [defi/protocols/src/vendors/algorand/tools/transactionManager/appTransactions/types.ts:100](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/vendors/algorand/tools/transactionManager/appTransactions/types.ts#L100) |
| `makeAppCreateTxn.properties.foreignApps.items` | \{ `type`: `string`; \} | - | [defi/protocols/src/vendors/algorand/tools/transactionManager/appTransactions/types.ts:98](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/vendors/algorand/tools/transactionManager/appTransactions/types.ts#L98) |
| `makeAppCreateTxn.properties.foreignApps.items.type` | `string` | `'integer'` | [defi/protocols/src/vendors/algorand/tools/transactionManager/appTransactions/types.ts:98](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/vendors/algorand/tools/transactionManager/appTransactions/types.ts#L98) |
| `makeAppCreateTxn.properties.foreignApps.optional` | `boolean` | `true` | [defi/protocols/src/vendors/algorand/tools/transactionManager/appTransactions/types.ts:99](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/vendors/algorand/tools/transactionManager/appTransactions/types.ts#L99) |
| `makeAppCreateTxn.properties.foreignApps.type` | `string` | `'array'` | [defi/protocols/src/vendors/algorand/tools/transactionManager/appTransactions/types.ts:97](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/vendors/algorand/tools/transactionManager/appTransactions/types.ts#L97) |
| `makeAppCreateTxn.properties.foreignAssets` | \{ `description`: `string`; `items`: \{ `type`: `string`; \}; `optional`: `boolean`; `type`: `string`; \} | - | [defi/protocols/src/vendors/algorand/tools/transactionManager/appTransactions/types.ts:102](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/vendors/algorand/tools/transactionManager/appTransactions/types.ts#L102) |
| `makeAppCreateTxn.properties.foreignAssets.description` | `string` | `'IDs of assets that may be accessed (max 8 assets)'` | [defi/protocols/src/vendors/algorand/tools/transactionManager/appTransactions/types.ts:106](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/vendors/algorand/tools/transactionManager/appTransactions/types.ts#L106) |
| `makeAppCreateTxn.properties.foreignAssets.items` | \{ `type`: `string`; \} | - | [defi/protocols/src/vendors/algorand/tools/transactionManager/appTransactions/types.ts:104](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/vendors/algorand/tools/transactionManager/appTransactions/types.ts#L104) |
| `makeAppCreateTxn.properties.foreignAssets.items.type` | `string` | `'integer'` | [defi/protocols/src/vendors/algorand/tools/transactionManager/appTransactions/types.ts:104](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/vendors/algorand/tools/transactionManager/appTransactions/types.ts#L104) |
| `makeAppCreateTxn.properties.foreignAssets.optional` | `boolean` | `true` | [defi/protocols/src/vendors/algorand/tools/transactionManager/appTransactions/types.ts:105](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/vendors/algorand/tools/transactionManager/appTransactions/types.ts#L105) |
| `makeAppCreateTxn.properties.foreignAssets.type` | `string` | `'array'` | [defi/protocols/src/vendors/algorand/tools/transactionManager/appTransactions/types.ts:103](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/vendors/algorand/tools/transactionManager/appTransactions/types.ts#L103) |
| `makeAppCreateTxn.properties.from` | \{ `description`: `string`; `type`: `string`; \} | - | [defi/protocols/src/vendors/algorand/tools/transactionManager/appTransactions/types.ts:73](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/vendors/algorand/tools/transactionManager/appTransactions/types.ts#L73) |
| `makeAppCreateTxn.properties.from.description` | `string` | `'Sender address in standard Algorand format (58 characters)'` | [defi/protocols/src/vendors/algorand/tools/transactionManager/appTransactions/types.ts:73](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/vendors/algorand/tools/transactionManager/appTransactions/types.ts#L73) |
| `makeAppCreateTxn.properties.from.type` | `string` | `'string'` | [defi/protocols/src/vendors/algorand/tools/transactionManager/appTransactions/types.ts:73](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/vendors/algorand/tools/transactionManager/appTransactions/types.ts#L73) |
| `makeAppCreateTxn.properties.lease` | \{ `description`: `string`; `optional`: `boolean`; `type`: `string`; \} | - | [defi/protocols/src/vendors/algorand/tools/transactionManager/appTransactions/types.ts:82](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/vendors/algorand/tools/transactionManager/appTransactions/types.ts#L82) |
| `makeAppCreateTxn.properties.lease.description` | `string` | `'Lease enforces mutual exclusion of transactions (32 bytes)'` | [defi/protocols/src/vendors/algorand/tools/transactionManager/appTransactions/types.ts:82](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/vendors/algorand/tools/transactionManager/appTransactions/types.ts#L82) |
| `makeAppCreateTxn.properties.lease.optional` | `boolean` | `true` | [defi/protocols/src/vendors/algorand/tools/transactionManager/appTransactions/types.ts:82](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/vendors/algorand/tools/transactionManager/appTransactions/types.ts#L82) |
| `makeAppCreateTxn.properties.lease.type` | `string` | `'string'` | [defi/protocols/src/vendors/algorand/tools/transactionManager/appTransactions/types.ts:82](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/vendors/algorand/tools/transactionManager/appTransactions/types.ts#L82) |
| `makeAppCreateTxn.properties.note` | \{ `description`: `string`; `optional`: `boolean`; `type`: `string`; \} | - | [defi/protocols/src/vendors/algorand/tools/transactionManager/appTransactions/types.ts:81](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/vendors/algorand/tools/transactionManager/appTransactions/types.ts#L81) |
| `makeAppCreateTxn.properties.note.description` | `string` | `'Transaction note field (up to 1000 bytes)'` | [defi/protocols/src/vendors/algorand/tools/transactionManager/appTransactions/types.ts:81](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/vendors/algorand/tools/transactionManager/appTransactions/types.ts#L81) |
| `makeAppCreateTxn.properties.note.optional` | `boolean` | `true` | [defi/protocols/src/vendors/algorand/tools/transactionManager/appTransactions/types.ts:81](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/vendors/algorand/tools/transactionManager/appTransactions/types.ts#L81) |
| `makeAppCreateTxn.properties.note.type` | `string` | `'string'` | [defi/protocols/src/vendors/algorand/tools/transactionManager/appTransactions/types.ts:81](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/vendors/algorand/tools/transactionManager/appTransactions/types.ts#L81) |
| `makeAppCreateTxn.properties.numGlobalByteSlices` | \{ `description`: `string`; `type`: `string`; \} | - | [defi/protocols/src/vendors/algorand/tools/transactionManager/appTransactions/types.ts:76](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/vendors/algorand/tools/transactionManager/appTransactions/types.ts#L76) |
| `makeAppCreateTxn.properties.numGlobalByteSlices.description` | `string` | `'Number of byte array values in global state (0-64)'` | [defi/protocols/src/vendors/algorand/tools/transactionManager/appTransactions/types.ts:76](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/vendors/algorand/tools/transactionManager/appTransactions/types.ts#L76) |
| `makeAppCreateTxn.properties.numGlobalByteSlices.type` | `string` | `'integer'` | [defi/protocols/src/vendors/algorand/tools/transactionManager/appTransactions/types.ts:76](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/vendors/algorand/tools/transactionManager/appTransactions/types.ts#L76) |
| `makeAppCreateTxn.properties.numGlobalInts` | \{ `description`: `string`; `type`: `string`; \} | - | [defi/protocols/src/vendors/algorand/tools/transactionManager/appTransactions/types.ts:77](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/vendors/algorand/tools/transactionManager/appTransactions/types.ts#L77) |
| `makeAppCreateTxn.properties.numGlobalInts.description` | `string` | `'Number of integer values in global state (0-64)'` | [defi/protocols/src/vendors/algorand/tools/transactionManager/appTransactions/types.ts:77](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/vendors/algorand/tools/transactionManager/appTransactions/types.ts#L77) |
| `makeAppCreateTxn.properties.numGlobalInts.type` | `string` | `'integer'` | [defi/protocols/src/vendors/algorand/tools/transactionManager/appTransactions/types.ts:77](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/vendors/algorand/tools/transactionManager/appTransactions/types.ts#L77) |
| `makeAppCreateTxn.properties.numLocalByteSlices` | \{ `description`: `string`; `type`: `string`; \} | - | [defi/protocols/src/vendors/algorand/tools/transactionManager/appTransactions/types.ts:78](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/vendors/algorand/tools/transactionManager/appTransactions/types.ts#L78) |
| `makeAppCreateTxn.properties.numLocalByteSlices.description` | `string` | `'Number of byte array values in local state per account (0-16)'` | [defi/protocols/src/vendors/algorand/tools/transactionManager/appTransactions/types.ts:78](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/vendors/algorand/tools/transactionManager/appTransactions/types.ts#L78) |
| `makeAppCreateTxn.properties.numLocalByteSlices.type` | `string` | `'integer'` | [defi/protocols/src/vendors/algorand/tools/transactionManager/appTransactions/types.ts:78](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/vendors/algorand/tools/transactionManager/appTransactions/types.ts#L78) |
| `makeAppCreateTxn.properties.numLocalInts` | \{ `description`: `string`; `type`: `string`; \} | - | [defi/protocols/src/vendors/algorand/tools/transactionManager/appTransactions/types.ts:79](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/vendors/algorand/tools/transactionManager/appTransactions/types.ts#L79) |
| `makeAppCreateTxn.properties.numLocalInts.description` | `string` | `'Number of integer values in local state per account (0-16)'` | [defi/protocols/src/vendors/algorand/tools/transactionManager/appTransactions/types.ts:79](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/vendors/algorand/tools/transactionManager/appTransactions/types.ts#L79) |
| `makeAppCreateTxn.properties.numLocalInts.type` | `string` | `'integer'` | [defi/protocols/src/vendors/algorand/tools/transactionManager/appTransactions/types.ts:79](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/vendors/algorand/tools/transactionManager/appTransactions/types.ts#L79) |
| `makeAppCreateTxn.properties.rekeyTo` | \{ `description`: `string`; `optional`: `boolean`; `type`: `string`; \} | - | [defi/protocols/src/vendors/algorand/tools/transactionManager/appTransactions/types.ts:83](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/vendors/algorand/tools/transactionManager/appTransactions/types.ts#L83) |
| `makeAppCreateTxn.properties.rekeyTo.description` | `string` | `'Address to rekey the sender account to'` | [defi/protocols/src/vendors/algorand/tools/transactionManager/appTransactions/types.ts:83](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/vendors/algorand/tools/transactionManager/appTransactions/types.ts#L83) |
| `makeAppCreateTxn.properties.rekeyTo.optional` | `boolean` | `true` | [defi/protocols/src/vendors/algorand/tools/transactionManager/appTransactions/types.ts:83](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/vendors/algorand/tools/transactionManager/appTransactions/types.ts#L83) |
| `makeAppCreateTxn.properties.rekeyTo.type` | `string` | `'string'` | [defi/protocols/src/vendors/algorand/tools/transactionManager/appTransactions/types.ts:83](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/vendors/algorand/tools/transactionManager/appTransactions/types.ts#L83) |
| `makeAppCreateTxn.required` | `string`[] | - | [defi/protocols/src/vendors/algorand/tools/transactionManager/appTransactions/types.ts:109](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/vendors/algorand/tools/transactionManager/appTransactions/types.ts#L109) |
| `makeAppCreateTxn.type` | `string` | `'object'` | [defi/protocols/src/vendors/algorand/tools/transactionManager/appTransactions/types.ts:71](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/vendors/algorand/tools/transactionManager/appTransactions/types.ts#L71) |
| <a id="makeappdeletetxn"></a> `makeAppDeleteTxn` | \{ `properties`: \{ `accounts`: \{ `description`: `string`; `items`: \{ `type`: `string`; \}; `optional`: `boolean`; `type`: `string`; \}; `appArgs`: \{ `description`: `string`; `items`: \{ `type`: `string`; \}; `optional`: `boolean`; `type`: `string`; \}; `appIndex`: \{ `description`: `string`; `type`: `string`; \}; `foreignApps`: \{ `description`: `string`; `items`: \{ `type`: `string`; \}; `optional`: `boolean`; `type`: `string`; \}; `foreignAssets`: \{ `description`: `string`; `items`: \{ `type`: `string`; \}; `optional`: `boolean`; `type`: `string`; \}; `from`: \{ `description`: `string`; `type`: `string`; \}; `lease`: \{ `description`: `string`; `optional`: `boolean`; `type`: `string`; \}; `note`: \{ `description`: `string`; `optional`: `boolean`; `type`: `string`; \}; `onComplete`: \{ `description`: `string`; `optional`: `boolean`; `type`: `string`; \}; `rekeyTo`: \{ `description`: `string`; `optional`: `boolean`; `type`: `string`; \}; \}; `required`: `string`[]; `type`: `string`; \} | - | [defi/protocols/src/vendors/algorand/tools/transactionManager/appTransactions/types.ts:149](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/vendors/algorand/tools/transactionManager/appTransactions/types.ts#L149) |
| `makeAppDeleteTxn.properties` | \{ `accounts`: \{ `description`: `string`; `items`: \{ `type`: `string`; \}; `optional`: `boolean`; `type`: `string`; \}; `appArgs`: \{ `description`: `string`; `items`: \{ `type`: `string`; \}; `optional`: `boolean`; `type`: `string`; \}; `appIndex`: \{ `description`: `string`; `type`: `string`; \}; `foreignApps`: \{ `description`: `string`; `items`: \{ `type`: `string`; \}; `optional`: `boolean`; `type`: `string`; \}; `foreignAssets`: \{ `description`: `string`; `items`: \{ `type`: `string`; \}; `optional`: `boolean`; `type`: `string`; \}; `from`: \{ `description`: `string`; `type`: `string`; \}; `lease`: \{ `description`: `string`; `optional`: `boolean`; `type`: `string`; \}; `note`: \{ `description`: `string`; `optional`: `boolean`; `type`: `string`; \}; `onComplete`: \{ `description`: `string`; `optional`: `boolean`; `type`: `string`; \}; `rekeyTo`: \{ `description`: `string`; `optional`: `boolean`; `type`: `string`; \}; \} | - | [defi/protocols/src/vendors/algorand/tools/transactionManager/appTransactions/types.ts:151](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/vendors/algorand/tools/transactionManager/appTransactions/types.ts#L151) |
| `makeAppDeleteTxn.properties.accounts` | \{ `description`: `string`; `items`: \{ `type`: `string`; \}; `optional`: `boolean`; `type`: `string`; \} | - | [defi/protocols/src/vendors/algorand/tools/transactionManager/appTransactions/types.ts:163](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/vendors/algorand/tools/transactionManager/appTransactions/types.ts#L163) |
| `makeAppDeleteTxn.properties.accounts.description` | `string` | `'Accounts whose local state may be accessed (max 4 accounts)'` | [defi/protocols/src/vendors/algorand/tools/transactionManager/appTransactions/types.ts:167](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/vendors/algorand/tools/transactionManager/appTransactions/types.ts#L167) |
| `makeAppDeleteTxn.properties.accounts.items` | \{ `type`: `string`; \} | - | [defi/protocols/src/vendors/algorand/tools/transactionManager/appTransactions/types.ts:165](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/vendors/algorand/tools/transactionManager/appTransactions/types.ts#L165) |
| `makeAppDeleteTxn.properties.accounts.items.type` | `string` | `'string'` | [defi/protocols/src/vendors/algorand/tools/transactionManager/appTransactions/types.ts:165](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/vendors/algorand/tools/transactionManager/appTransactions/types.ts#L165) |
| `makeAppDeleteTxn.properties.accounts.optional` | `boolean` | `true` | [defi/protocols/src/vendors/algorand/tools/transactionManager/appTransactions/types.ts:166](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/vendors/algorand/tools/transactionManager/appTransactions/types.ts#L166) |
| `makeAppDeleteTxn.properties.accounts.type` | `string` | `'array'` | [defi/protocols/src/vendors/algorand/tools/transactionManager/appTransactions/types.ts:164](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/vendors/algorand/tools/transactionManager/appTransactions/types.ts#L164) |
| `makeAppDeleteTxn.properties.appArgs` | \{ `description`: `string`; `items`: \{ `type`: `string`; \}; `optional`: `boolean`; `type`: `string`; \} | - | [defi/protocols/src/vendors/algorand/tools/transactionManager/appTransactions/types.ts:157](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/vendors/algorand/tools/transactionManager/appTransactions/types.ts#L157) |
| `makeAppDeleteTxn.properties.appArgs.description` | `string` | `'Arguments to pass to the application (max 16 arguments)'` | [defi/protocols/src/vendors/algorand/tools/transactionManager/appTransactions/types.ts:161](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/vendors/algorand/tools/transactionManager/appTransactions/types.ts#L161) |
| `makeAppDeleteTxn.properties.appArgs.items` | \{ `type`: `string`; \} | - | [defi/protocols/src/vendors/algorand/tools/transactionManager/appTransactions/types.ts:159](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/vendors/algorand/tools/transactionManager/appTransactions/types.ts#L159) |
| `makeAppDeleteTxn.properties.appArgs.items.type` | `string` | `'string'` | [defi/protocols/src/vendors/algorand/tools/transactionManager/appTransactions/types.ts:159](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/vendors/algorand/tools/transactionManager/appTransactions/types.ts#L159) |
| `makeAppDeleteTxn.properties.appArgs.optional` | `boolean` | `true` | [defi/protocols/src/vendors/algorand/tools/transactionManager/appTransactions/types.ts:160](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/vendors/algorand/tools/transactionManager/appTransactions/types.ts#L160) |
| `makeAppDeleteTxn.properties.appArgs.type` | `string` | `'array'` | [defi/protocols/src/vendors/algorand/tools/transactionManager/appTransactions/types.ts:158](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/vendors/algorand/tools/transactionManager/appTransactions/types.ts#L158) |
| `makeAppDeleteTxn.properties.appIndex` | \{ `description`: `string`; `type`: `string`; \} | - | [defi/protocols/src/vendors/algorand/tools/transactionManager/appTransactions/types.ts:153](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/vendors/algorand/tools/transactionManager/appTransactions/types.ts#L153) |
| `makeAppDeleteTxn.properties.appIndex.description` | `string` | `'ID of the application to delete'` | [defi/protocols/src/vendors/algorand/tools/transactionManager/appTransactions/types.ts:153](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/vendors/algorand/tools/transactionManager/appTransactions/types.ts#L153) |
| `makeAppDeleteTxn.properties.appIndex.type` | `string` | `'integer'` | [defi/protocols/src/vendors/algorand/tools/transactionManager/appTransactions/types.ts:153](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/vendors/algorand/tools/transactionManager/appTransactions/types.ts#L153) |
| `makeAppDeleteTxn.properties.foreignApps` | \{ `description`: `string`; `items`: \{ `type`: `string`; \}; `optional`: `boolean`; `type`: `string`; \} | - | [defi/protocols/src/vendors/algorand/tools/transactionManager/appTransactions/types.ts:169](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/vendors/algorand/tools/transactionManager/appTransactions/types.ts#L169) |
| `makeAppDeleteTxn.properties.foreignApps.description` | `string` | `'IDs of apps whose global state may be accessed (max 8 apps)'` | [defi/protocols/src/vendors/algorand/tools/transactionManager/appTransactions/types.ts:173](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/vendors/algorand/tools/transactionManager/appTransactions/types.ts#L173) |
| `makeAppDeleteTxn.properties.foreignApps.items` | \{ `type`: `string`; \} | - | [defi/protocols/src/vendors/algorand/tools/transactionManager/appTransactions/types.ts:171](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/vendors/algorand/tools/transactionManager/appTransactions/types.ts#L171) |
| `makeAppDeleteTxn.properties.foreignApps.items.type` | `string` | `'integer'` | [defi/protocols/src/vendors/algorand/tools/transactionManager/appTransactions/types.ts:171](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/vendors/algorand/tools/transactionManager/appTransactions/types.ts#L171) |
| `makeAppDeleteTxn.properties.foreignApps.optional` | `boolean` | `true` | [defi/protocols/src/vendors/algorand/tools/transactionManager/appTransactions/types.ts:172](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/vendors/algorand/tools/transactionManager/appTransactions/types.ts#L172) |
| `makeAppDeleteTxn.properties.foreignApps.type` | `string` | `'array'` | [defi/protocols/src/vendors/algorand/tools/transactionManager/appTransactions/types.ts:170](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/vendors/algorand/tools/transactionManager/appTransactions/types.ts#L170) |
| `makeAppDeleteTxn.properties.foreignAssets` | \{ `description`: `string`; `items`: \{ `type`: `string`; \}; `optional`: `boolean`; `type`: `string`; \} | - | [defi/protocols/src/vendors/algorand/tools/transactionManager/appTransactions/types.ts:175](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/vendors/algorand/tools/transactionManager/appTransactions/types.ts#L175) |
| `makeAppDeleteTxn.properties.foreignAssets.description` | `string` | `'IDs of assets that may be accessed (max 8 assets)'` | [defi/protocols/src/vendors/algorand/tools/transactionManager/appTransactions/types.ts:179](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/vendors/algorand/tools/transactionManager/appTransactions/types.ts#L179) |
| `makeAppDeleteTxn.properties.foreignAssets.items` | \{ `type`: `string`; \} | - | [defi/protocols/src/vendors/algorand/tools/transactionManager/appTransactions/types.ts:177](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/vendors/algorand/tools/transactionManager/appTransactions/types.ts#L177) |
| `makeAppDeleteTxn.properties.foreignAssets.items.type` | `string` | `'integer'` | [defi/protocols/src/vendors/algorand/tools/transactionManager/appTransactions/types.ts:177](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/vendors/algorand/tools/transactionManager/appTransactions/types.ts#L177) |
| `makeAppDeleteTxn.properties.foreignAssets.optional` | `boolean` | `true` | [defi/protocols/src/vendors/algorand/tools/transactionManager/appTransactions/types.ts:178](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/vendors/algorand/tools/transactionManager/appTransactions/types.ts#L178) |
| `makeAppDeleteTxn.properties.foreignAssets.type` | `string` | `'array'` | [defi/protocols/src/vendors/algorand/tools/transactionManager/appTransactions/types.ts:176](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/vendors/algorand/tools/transactionManager/appTransactions/types.ts#L176) |
| `makeAppDeleteTxn.properties.from` | \{ `description`: `string`; `type`: `string`; \} | - | [defi/protocols/src/vendors/algorand/tools/transactionManager/appTransactions/types.ts:152](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/vendors/algorand/tools/transactionManager/appTransactions/types.ts#L152) |
| `makeAppDeleteTxn.properties.from.description` | `string` | `'Sender address in standard Algorand format (58 characters)'` | [defi/protocols/src/vendors/algorand/tools/transactionManager/appTransactions/types.ts:152](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/vendors/algorand/tools/transactionManager/appTransactions/types.ts#L152) |
| `makeAppDeleteTxn.properties.from.type` | `string` | `'string'` | [defi/protocols/src/vendors/algorand/tools/transactionManager/appTransactions/types.ts:152](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/vendors/algorand/tools/transactionManager/appTransactions/types.ts#L152) |
| `makeAppDeleteTxn.properties.lease` | \{ `description`: `string`; `optional`: `boolean`; `type`: `string`; \} | - | [defi/protocols/src/vendors/algorand/tools/transactionManager/appTransactions/types.ts:155](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/vendors/algorand/tools/transactionManager/appTransactions/types.ts#L155) |
| `makeAppDeleteTxn.properties.lease.description` | `string` | `'Lease enforces mutual exclusion of transactions (32 bytes)'` | [defi/protocols/src/vendors/algorand/tools/transactionManager/appTransactions/types.ts:155](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/vendors/algorand/tools/transactionManager/appTransactions/types.ts#L155) |
| `makeAppDeleteTxn.properties.lease.optional` | `boolean` | `true` | [defi/protocols/src/vendors/algorand/tools/transactionManager/appTransactions/types.ts:155](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/vendors/algorand/tools/transactionManager/appTransactions/types.ts#L155) |
| `makeAppDeleteTxn.properties.lease.type` | `string` | `'string'` | [defi/protocols/src/vendors/algorand/tools/transactionManager/appTransactions/types.ts:155](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/vendors/algorand/tools/transactionManager/appTransactions/types.ts#L155) |
| `makeAppDeleteTxn.properties.note` | \{ `description`: `string`; `optional`: `boolean`; `type`: `string`; \} | - | [defi/protocols/src/vendors/algorand/tools/transactionManager/appTransactions/types.ts:154](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/vendors/algorand/tools/transactionManager/appTransactions/types.ts#L154) |
| `makeAppDeleteTxn.properties.note.description` | `string` | `'Transaction note field (up to 1000 bytes)'` | [defi/protocols/src/vendors/algorand/tools/transactionManager/appTransactions/types.ts:154](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/vendors/algorand/tools/transactionManager/appTransactions/types.ts#L154) |
| `makeAppDeleteTxn.properties.note.optional` | `boolean` | `true` | [defi/protocols/src/vendors/algorand/tools/transactionManager/appTransactions/types.ts:154](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/vendors/algorand/tools/transactionManager/appTransactions/types.ts#L154) |
| `makeAppDeleteTxn.properties.note.type` | `string` | `'string'` | [defi/protocols/src/vendors/algorand/tools/transactionManager/appTransactions/types.ts:154](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/vendors/algorand/tools/transactionManager/appTransactions/types.ts#L154) |
| `makeAppDeleteTxn.properties.onComplete` | \{ `description`: `string`; `optional`: `boolean`; `type`: `string`; \} | - | [defi/protocols/src/vendors/algorand/tools/transactionManager/appTransactions/types.ts:181](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/vendors/algorand/tools/transactionManager/appTransactions/types.ts#L181) |
| `makeAppDeleteTxn.properties.onComplete.description` | `string` | `'Application call completion behavior (0=NoOp, 1=OptIn, 2=CloseOut, 3=ClearState, 4=UpdateApplication, 5=DeleteApplication)'` | [defi/protocols/src/vendors/algorand/tools/transactionManager/appTransactions/types.ts:181](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/vendors/algorand/tools/transactionManager/appTransactions/types.ts#L181) |
| `makeAppDeleteTxn.properties.onComplete.optional` | `boolean` | `true` | [defi/protocols/src/vendors/algorand/tools/transactionManager/appTransactions/types.ts:181](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/vendors/algorand/tools/transactionManager/appTransactions/types.ts#L181) |
| `makeAppDeleteTxn.properties.onComplete.type` | `string` | `'integer'` | [defi/protocols/src/vendors/algorand/tools/transactionManager/appTransactions/types.ts:181](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/vendors/algorand/tools/transactionManager/appTransactions/types.ts#L181) |
| `makeAppDeleteTxn.properties.rekeyTo` | \{ `description`: `string`; `optional`: `boolean`; `type`: `string`; \} | - | [defi/protocols/src/vendors/algorand/tools/transactionManager/appTransactions/types.ts:156](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/vendors/algorand/tools/transactionManager/appTransactions/types.ts#L156) |
| `makeAppDeleteTxn.properties.rekeyTo.description` | `string` | `'Address to rekey the sender account to'` | [defi/protocols/src/vendors/algorand/tools/transactionManager/appTransactions/types.ts:156](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/vendors/algorand/tools/transactionManager/appTransactions/types.ts#L156) |
| `makeAppDeleteTxn.properties.rekeyTo.optional` | `boolean` | `true` | [defi/protocols/src/vendors/algorand/tools/transactionManager/appTransactions/types.ts:156](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/vendors/algorand/tools/transactionManager/appTransactions/types.ts#L156) |
| `makeAppDeleteTxn.properties.rekeyTo.type` | `string` | `'string'` | [defi/protocols/src/vendors/algorand/tools/transactionManager/appTransactions/types.ts:156](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/vendors/algorand/tools/transactionManager/appTransactions/types.ts#L156) |
| `makeAppDeleteTxn.required` | `string`[] | - | [defi/protocols/src/vendors/algorand/tools/transactionManager/appTransactions/types.ts:183](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/vendors/algorand/tools/transactionManager/appTransactions/types.ts#L183) |
| `makeAppDeleteTxn.type` | `string` | `'object'` | [defi/protocols/src/vendors/algorand/tools/transactionManager/appTransactions/types.ts:150](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/vendors/algorand/tools/transactionManager/appTransactions/types.ts#L150) |
| <a id="makeappoptintxn"></a> `makeAppOptInTxn` | \{ `properties`: \{ `accounts`: \{ `description`: `string`; `items`: \{ `type`: `string`; \}; `optional`: `boolean`; `type`: `string`; \}; `appArgs`: \{ `description`: `string`; `items`: \{ `type`: `string`; \}; `optional`: `boolean`; `type`: `string`; \}; `appIndex`: \{ `description`: `string`; `type`: `string`; \}; `foreignApps`: \{ `description`: `string`; `items`: \{ `type`: `string`; \}; `optional`: `boolean`; `type`: `string`; \}; `foreignAssets`: \{ `description`: `string`; `items`: \{ `type`: `string`; \}; `optional`: `boolean`; `type`: `string`; \}; `from`: \{ `description`: `string`; `type`: `string`; \}; `lease`: \{ `description`: `string`; `optional`: `boolean`; `type`: `string`; \}; `note`: \{ `description`: `string`; `optional`: `boolean`; `type`: `string`; \}; `onComplete`: \{ `description`: `string`; `optional`: `boolean`; `type`: `string`; \}; `rekeyTo`: \{ `description`: `string`; `optional`: `boolean`; `type`: `string`; \}; \}; `required`: `string`[]; `type`: `string`; \} | - | [defi/protocols/src/vendors/algorand/tools/transactionManager/appTransactions/types.ts:185](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/vendors/algorand/tools/transactionManager/appTransactions/types.ts#L185) |
| `makeAppOptInTxn.properties` | \{ `accounts`: \{ `description`: `string`; `items`: \{ `type`: `string`; \}; `optional`: `boolean`; `type`: `string`; \}; `appArgs`: \{ `description`: `string`; `items`: \{ `type`: `string`; \}; `optional`: `boolean`; `type`: `string`; \}; `appIndex`: \{ `description`: `string`; `type`: `string`; \}; `foreignApps`: \{ `description`: `string`; `items`: \{ `type`: `string`; \}; `optional`: `boolean`; `type`: `string`; \}; `foreignAssets`: \{ `description`: `string`; `items`: \{ `type`: `string`; \}; `optional`: `boolean`; `type`: `string`; \}; `from`: \{ `description`: `string`; `type`: `string`; \}; `lease`: \{ `description`: `string`; `optional`: `boolean`; `type`: `string`; \}; `note`: \{ `description`: `string`; `optional`: `boolean`; `type`: `string`; \}; `onComplete`: \{ `description`: `string`; `optional`: `boolean`; `type`: `string`; \}; `rekeyTo`: \{ `description`: `string`; `optional`: `boolean`; `type`: `string`; \}; \} | - | [defi/protocols/src/vendors/algorand/tools/transactionManager/appTransactions/types.ts:187](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/vendors/algorand/tools/transactionManager/appTransactions/types.ts#L187) |
| `makeAppOptInTxn.properties.accounts` | \{ `description`: `string`; `items`: \{ `type`: `string`; \}; `optional`: `boolean`; `type`: `string`; \} | - | [defi/protocols/src/vendors/algorand/tools/transactionManager/appTransactions/types.ts:199](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/vendors/algorand/tools/transactionManager/appTransactions/types.ts#L199) |
| `makeAppOptInTxn.properties.accounts.description` | `string` | `'Accounts whose local state may be accessed (max 4 accounts)'` | [defi/protocols/src/vendors/algorand/tools/transactionManager/appTransactions/types.ts:203](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/vendors/algorand/tools/transactionManager/appTransactions/types.ts#L203) |
| `makeAppOptInTxn.properties.accounts.items` | \{ `type`: `string`; \} | - | [defi/protocols/src/vendors/algorand/tools/transactionManager/appTransactions/types.ts:201](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/vendors/algorand/tools/transactionManager/appTransactions/types.ts#L201) |
| `makeAppOptInTxn.properties.accounts.items.type` | `string` | `'string'` | [defi/protocols/src/vendors/algorand/tools/transactionManager/appTransactions/types.ts:201](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/vendors/algorand/tools/transactionManager/appTransactions/types.ts#L201) |
| `makeAppOptInTxn.properties.accounts.optional` | `boolean` | `true` | [defi/protocols/src/vendors/algorand/tools/transactionManager/appTransactions/types.ts:202](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/vendors/algorand/tools/transactionManager/appTransactions/types.ts#L202) |
| `makeAppOptInTxn.properties.accounts.type` | `string` | `'array'` | [defi/protocols/src/vendors/algorand/tools/transactionManager/appTransactions/types.ts:200](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/vendors/algorand/tools/transactionManager/appTransactions/types.ts#L200) |
| `makeAppOptInTxn.properties.appArgs` | \{ `description`: `string`; `items`: \{ `type`: `string`; \}; `optional`: `boolean`; `type`: `string`; \} | - | [defi/protocols/src/vendors/algorand/tools/transactionManager/appTransactions/types.ts:193](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/vendors/algorand/tools/transactionManager/appTransactions/types.ts#L193) |
| `makeAppOptInTxn.properties.appArgs.description` | `string` | `'Arguments to pass to the application (max 16 arguments)'` | [defi/protocols/src/vendors/algorand/tools/transactionManager/appTransactions/types.ts:197](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/vendors/algorand/tools/transactionManager/appTransactions/types.ts#L197) |
| `makeAppOptInTxn.properties.appArgs.items` | \{ `type`: `string`; \} | - | [defi/protocols/src/vendors/algorand/tools/transactionManager/appTransactions/types.ts:195](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/vendors/algorand/tools/transactionManager/appTransactions/types.ts#L195) |
| `makeAppOptInTxn.properties.appArgs.items.type` | `string` | `'string'` | [defi/protocols/src/vendors/algorand/tools/transactionManager/appTransactions/types.ts:195](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/vendors/algorand/tools/transactionManager/appTransactions/types.ts#L195) |
| `makeAppOptInTxn.properties.appArgs.optional` | `boolean` | `true` | [defi/protocols/src/vendors/algorand/tools/transactionManager/appTransactions/types.ts:196](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/vendors/algorand/tools/transactionManager/appTransactions/types.ts#L196) |
| `makeAppOptInTxn.properties.appArgs.type` | `string` | `'array'` | [defi/protocols/src/vendors/algorand/tools/transactionManager/appTransactions/types.ts:194](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/vendors/algorand/tools/transactionManager/appTransactions/types.ts#L194) |
| `makeAppOptInTxn.properties.appIndex` | \{ `description`: `string`; `type`: `string`; \} | - | [defi/protocols/src/vendors/algorand/tools/transactionManager/appTransactions/types.ts:189](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/vendors/algorand/tools/transactionManager/appTransactions/types.ts#L189) |
| `makeAppOptInTxn.properties.appIndex.description` | `string` | `'ID of the application to opt into'` | [defi/protocols/src/vendors/algorand/tools/transactionManager/appTransactions/types.ts:189](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/vendors/algorand/tools/transactionManager/appTransactions/types.ts#L189) |
| `makeAppOptInTxn.properties.appIndex.type` | `string` | `'integer'` | [defi/protocols/src/vendors/algorand/tools/transactionManager/appTransactions/types.ts:189](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/vendors/algorand/tools/transactionManager/appTransactions/types.ts#L189) |
| `makeAppOptInTxn.properties.foreignApps` | \{ `description`: `string`; `items`: \{ `type`: `string`; \}; `optional`: `boolean`; `type`: `string`; \} | - | [defi/protocols/src/vendors/algorand/tools/transactionManager/appTransactions/types.ts:205](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/vendors/algorand/tools/transactionManager/appTransactions/types.ts#L205) |
| `makeAppOptInTxn.properties.foreignApps.description` | `string` | `'IDs of apps whose global state may be accessed (max 8 apps)'` | [defi/protocols/src/vendors/algorand/tools/transactionManager/appTransactions/types.ts:209](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/vendors/algorand/tools/transactionManager/appTransactions/types.ts#L209) |
| `makeAppOptInTxn.properties.foreignApps.items` | \{ `type`: `string`; \} | - | [defi/protocols/src/vendors/algorand/tools/transactionManager/appTransactions/types.ts:207](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/vendors/algorand/tools/transactionManager/appTransactions/types.ts#L207) |
| `makeAppOptInTxn.properties.foreignApps.items.type` | `string` | `'integer'` | [defi/protocols/src/vendors/algorand/tools/transactionManager/appTransactions/types.ts:207](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/vendors/algorand/tools/transactionManager/appTransactions/types.ts#L207) |
| `makeAppOptInTxn.properties.foreignApps.optional` | `boolean` | `true` | [defi/protocols/src/vendors/algorand/tools/transactionManager/appTransactions/types.ts:208](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/vendors/algorand/tools/transactionManager/appTransactions/types.ts#L208) |
| `makeAppOptInTxn.properties.foreignApps.type` | `string` | `'array'` | [defi/protocols/src/vendors/algorand/tools/transactionManager/appTransactions/types.ts:206](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/vendors/algorand/tools/transactionManager/appTransactions/types.ts#L206) |
| `makeAppOptInTxn.properties.foreignAssets` | \{ `description`: `string`; `items`: \{ `type`: `string`; \}; `optional`: `boolean`; `type`: `string`; \} | - | [defi/protocols/src/vendors/algorand/tools/transactionManager/appTransactions/types.ts:211](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/vendors/algorand/tools/transactionManager/appTransactions/types.ts#L211) |
| `makeAppOptInTxn.properties.foreignAssets.description` | `string` | `'IDs of assets that may be accessed (max 8 assets)'` | [defi/protocols/src/vendors/algorand/tools/transactionManager/appTransactions/types.ts:215](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/vendors/algorand/tools/transactionManager/appTransactions/types.ts#L215) |
| `makeAppOptInTxn.properties.foreignAssets.items` | \{ `type`: `string`; \} | - | [defi/protocols/src/vendors/algorand/tools/transactionManager/appTransactions/types.ts:213](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/vendors/algorand/tools/transactionManager/appTransactions/types.ts#L213) |
| `makeAppOptInTxn.properties.foreignAssets.items.type` | `string` | `'integer'` | [defi/protocols/src/vendors/algorand/tools/transactionManager/appTransactions/types.ts:213](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/vendors/algorand/tools/transactionManager/appTransactions/types.ts#L213) |
| `makeAppOptInTxn.properties.foreignAssets.optional` | `boolean` | `true` | [defi/protocols/src/vendors/algorand/tools/transactionManager/appTransactions/types.ts:214](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/vendors/algorand/tools/transactionManager/appTransactions/types.ts#L214) |
| `makeAppOptInTxn.properties.foreignAssets.type` | `string` | `'array'` | [defi/protocols/src/vendors/algorand/tools/transactionManager/appTransactions/types.ts:212](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/vendors/algorand/tools/transactionManager/appTransactions/types.ts#L212) |
| `makeAppOptInTxn.properties.from` | \{ `description`: `string`; `type`: `string`; \} | - | [defi/protocols/src/vendors/algorand/tools/transactionManager/appTransactions/types.ts:188](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/vendors/algorand/tools/transactionManager/appTransactions/types.ts#L188) |
| `makeAppOptInTxn.properties.from.description` | `string` | `'Sender address in standard Algorand format (58 characters)'` | [defi/protocols/src/vendors/algorand/tools/transactionManager/appTransactions/types.ts:188](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/vendors/algorand/tools/transactionManager/appTransactions/types.ts#L188) |
| `makeAppOptInTxn.properties.from.type` | `string` | `'string'` | [defi/protocols/src/vendors/algorand/tools/transactionManager/appTransactions/types.ts:188](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/vendors/algorand/tools/transactionManager/appTransactions/types.ts#L188) |
| `makeAppOptInTxn.properties.lease` | \{ `description`: `string`; `optional`: `boolean`; `type`: `string`; \} | - | [defi/protocols/src/vendors/algorand/tools/transactionManager/appTransactions/types.ts:191](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/vendors/algorand/tools/transactionManager/appTransactions/types.ts#L191) |
| `makeAppOptInTxn.properties.lease.description` | `string` | `'Lease enforces mutual exclusion of transactions (32 bytes)'` | [defi/protocols/src/vendors/algorand/tools/transactionManager/appTransactions/types.ts:191](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/vendors/algorand/tools/transactionManager/appTransactions/types.ts#L191) |
| `makeAppOptInTxn.properties.lease.optional` | `boolean` | `true` | [defi/protocols/src/vendors/algorand/tools/transactionManager/appTransactions/types.ts:191](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/vendors/algorand/tools/transactionManager/appTransactions/types.ts#L191) |
| `makeAppOptInTxn.properties.lease.type` | `string` | `'string'` | [defi/protocols/src/vendors/algorand/tools/transactionManager/appTransactions/types.ts:191](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/vendors/algorand/tools/transactionManager/appTransactions/types.ts#L191) |
| `makeAppOptInTxn.properties.note` | \{ `description`: `string`; `optional`: `boolean`; `type`: `string`; \} | - | [defi/protocols/src/vendors/algorand/tools/transactionManager/appTransactions/types.ts:190](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/vendors/algorand/tools/transactionManager/appTransactions/types.ts#L190) |
| `makeAppOptInTxn.properties.note.description` | `string` | `'Transaction note field (up to 1000 bytes)'` | [defi/protocols/src/vendors/algorand/tools/transactionManager/appTransactions/types.ts:190](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/vendors/algorand/tools/transactionManager/appTransactions/types.ts#L190) |
| `makeAppOptInTxn.properties.note.optional` | `boolean` | `true` | [defi/protocols/src/vendors/algorand/tools/transactionManager/appTransactions/types.ts:190](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/vendors/algorand/tools/transactionManager/appTransactions/types.ts#L190) |
| `makeAppOptInTxn.properties.note.type` | `string` | `'string'` | [defi/protocols/src/vendors/algorand/tools/transactionManager/appTransactions/types.ts:190](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/vendors/algorand/tools/transactionManager/appTransactions/types.ts#L190) |
| `makeAppOptInTxn.properties.onComplete` | \{ `description`: `string`; `optional`: `boolean`; `type`: `string`; \} | - | [defi/protocols/src/vendors/algorand/tools/transactionManager/appTransactions/types.ts:217](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/vendors/algorand/tools/transactionManager/appTransactions/types.ts#L217) |
| `makeAppOptInTxn.properties.onComplete.description` | `string` | `'Application call completion behavior (0=NoOp, 1=OptIn, 2=CloseOut, 3=ClearState, 4=UpdateApplication, 5=DeleteApplication)'` | [defi/protocols/src/vendors/algorand/tools/transactionManager/appTransactions/types.ts:217](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/vendors/algorand/tools/transactionManager/appTransactions/types.ts#L217) |
| `makeAppOptInTxn.properties.onComplete.optional` | `boolean` | `true` | [defi/protocols/src/vendors/algorand/tools/transactionManager/appTransactions/types.ts:217](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/vendors/algorand/tools/transactionManager/appTransactions/types.ts#L217) |
| `makeAppOptInTxn.properties.onComplete.type` | `string` | `'integer'` | [defi/protocols/src/vendors/algorand/tools/transactionManager/appTransactions/types.ts:217](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/vendors/algorand/tools/transactionManager/appTransactions/types.ts#L217) |
| `makeAppOptInTxn.properties.rekeyTo` | \{ `description`: `string`; `optional`: `boolean`; `type`: `string`; \} | - | [defi/protocols/src/vendors/algorand/tools/transactionManager/appTransactions/types.ts:192](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/vendors/algorand/tools/transactionManager/appTransactions/types.ts#L192) |
| `makeAppOptInTxn.properties.rekeyTo.description` | `string` | `'Address to rekey the sender account to'` | [defi/protocols/src/vendors/algorand/tools/transactionManager/appTransactions/types.ts:192](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/vendors/algorand/tools/transactionManager/appTransactions/types.ts#L192) |
| `makeAppOptInTxn.properties.rekeyTo.optional` | `boolean` | `true` | [defi/protocols/src/vendors/algorand/tools/transactionManager/appTransactions/types.ts:192](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/vendors/algorand/tools/transactionManager/appTransactions/types.ts#L192) |
| `makeAppOptInTxn.properties.rekeyTo.type` | `string` | `'string'` | [defi/protocols/src/vendors/algorand/tools/transactionManager/appTransactions/types.ts:192](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/vendors/algorand/tools/transactionManager/appTransactions/types.ts#L192) |
| `makeAppOptInTxn.required` | `string`[] | - | [defi/protocols/src/vendors/algorand/tools/transactionManager/appTransactions/types.ts:219](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/vendors/algorand/tools/transactionManager/appTransactions/types.ts#L219) |
| `makeAppOptInTxn.type` | `string` | `'object'` | [defi/protocols/src/vendors/algorand/tools/transactionManager/appTransactions/types.ts:186](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/vendors/algorand/tools/transactionManager/appTransactions/types.ts#L186) |
| <a id="makeappupdatetxn"></a> `makeAppUpdateTxn` | \{ `properties`: \{ `accounts`: \{ `description`: `string`; `items`: \{ `type`: `string`; \}; `optional`: `boolean`; `type`: `string`; \}; `appArgs`: \{ `description`: `string`; `items`: \{ `type`: `string`; \}; `optional`: `boolean`; `type`: `string`; \}; `appIndex`: \{ `description`: `string`; `type`: `string`; \}; `approvalProgram`: \{ `description`: `string`; `type`: `string`; \}; `clearProgram`: \{ `description`: `string`; `type`: `string`; \}; `foreignApps`: \{ `description`: `string`; `items`: \{ `type`: `string`; \}; `optional`: `boolean`; `type`: `string`; \}; `foreignAssets`: \{ `description`: `string`; `items`: \{ `type`: `string`; \}; `optional`: `boolean`; `type`: `string`; \}; `from`: \{ `description`: `string`; `type`: `string`; \}; `lease`: \{ `description`: `string`; `optional`: `boolean`; `type`: `string`; \}; `note`: \{ `description`: `string`; `optional`: `boolean`; `type`: `string`; \}; `onComplete`: \{ `description`: `string`; `optional`: `boolean`; `type`: `string`; \}; `rekeyTo`: \{ `description`: `string`; `optional`: `boolean`; `type`: `string`; \}; \}; `required`: `string`[]; `type`: `string`; \} | - | [defi/protocols/src/vendors/algorand/tools/transactionManager/appTransactions/types.ts:111](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/vendors/algorand/tools/transactionManager/appTransactions/types.ts#L111) |
| `makeAppUpdateTxn.properties` | \{ `accounts`: \{ `description`: `string`; `items`: \{ `type`: `string`; \}; `optional`: `boolean`; `type`: `string`; \}; `appArgs`: \{ `description`: `string`; `items`: \{ `type`: `string`; \}; `optional`: `boolean`; `type`: `string`; \}; `appIndex`: \{ `description`: `string`; `type`: `string`; \}; `approvalProgram`: \{ `description`: `string`; `type`: `string`; \}; `clearProgram`: \{ `description`: `string`; `type`: `string`; \}; `foreignApps`: \{ `description`: `string`; `items`: \{ `type`: `string`; \}; `optional`: `boolean`; `type`: `string`; \}; `foreignAssets`: \{ `description`: `string`; `items`: \{ `type`: `string`; \}; `optional`: `boolean`; `type`: `string`; \}; `from`: \{ `description`: `string`; `type`: `string`; \}; `lease`: \{ `description`: `string`; `optional`: `boolean`; `type`: `string`; \}; `note`: \{ `description`: `string`; `optional`: `boolean`; `type`: `string`; \}; `onComplete`: \{ `description`: `string`; `optional`: `boolean`; `type`: `string`; \}; `rekeyTo`: \{ `description`: `string`; `optional`: `boolean`; `type`: `string`; \}; \} | - | [defi/protocols/src/vendors/algorand/tools/transactionManager/appTransactions/types.ts:113](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/vendors/algorand/tools/transactionManager/appTransactions/types.ts#L113) |
| `makeAppUpdateTxn.properties.accounts` | \{ `description`: `string`; `items`: \{ `type`: `string`; \}; `optional`: `boolean`; `type`: `string`; \} | - | [defi/protocols/src/vendors/algorand/tools/transactionManager/appTransactions/types.ts:127](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/vendors/algorand/tools/transactionManager/appTransactions/types.ts#L127) |
| `makeAppUpdateTxn.properties.accounts.description` | `string` | `'Accounts whose local state may be accessed (max 4 accounts)'` | [defi/protocols/src/vendors/algorand/tools/transactionManager/appTransactions/types.ts:131](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/vendors/algorand/tools/transactionManager/appTransactions/types.ts#L131) |
| `makeAppUpdateTxn.properties.accounts.items` | \{ `type`: `string`; \} | - | [defi/protocols/src/vendors/algorand/tools/transactionManager/appTransactions/types.ts:129](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/vendors/algorand/tools/transactionManager/appTransactions/types.ts#L129) |
| `makeAppUpdateTxn.properties.accounts.items.type` | `string` | `'string'` | [defi/protocols/src/vendors/algorand/tools/transactionManager/appTransactions/types.ts:129](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/vendors/algorand/tools/transactionManager/appTransactions/types.ts#L129) |
| `makeAppUpdateTxn.properties.accounts.optional` | `boolean` | `true` | [defi/protocols/src/vendors/algorand/tools/transactionManager/appTransactions/types.ts:130](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/vendors/algorand/tools/transactionManager/appTransactions/types.ts#L130) |
| `makeAppUpdateTxn.properties.accounts.type` | `string` | `'array'` | [defi/protocols/src/vendors/algorand/tools/transactionManager/appTransactions/types.ts:128](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/vendors/algorand/tools/transactionManager/appTransactions/types.ts#L128) |
| `makeAppUpdateTxn.properties.appArgs` | \{ `description`: `string`; `items`: \{ `type`: `string`; \}; `optional`: `boolean`; `type`: `string`; \} | - | [defi/protocols/src/vendors/algorand/tools/transactionManager/appTransactions/types.ts:121](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/vendors/algorand/tools/transactionManager/appTransactions/types.ts#L121) |
| `makeAppUpdateTxn.properties.appArgs.description` | `string` | `'Arguments to pass to the application (max 16 arguments)'` | [defi/protocols/src/vendors/algorand/tools/transactionManager/appTransactions/types.ts:125](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/vendors/algorand/tools/transactionManager/appTransactions/types.ts#L125) |
| `makeAppUpdateTxn.properties.appArgs.items` | \{ `type`: `string`; \} | - | [defi/protocols/src/vendors/algorand/tools/transactionManager/appTransactions/types.ts:123](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/vendors/algorand/tools/transactionManager/appTransactions/types.ts#L123) |
| `makeAppUpdateTxn.properties.appArgs.items.type` | `string` | `'string'` | [defi/protocols/src/vendors/algorand/tools/transactionManager/appTransactions/types.ts:123](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/vendors/algorand/tools/transactionManager/appTransactions/types.ts#L123) |
| `makeAppUpdateTxn.properties.appArgs.optional` | `boolean` | `true` | [defi/protocols/src/vendors/algorand/tools/transactionManager/appTransactions/types.ts:124](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/vendors/algorand/tools/transactionManager/appTransactions/types.ts#L124) |
| `makeAppUpdateTxn.properties.appArgs.type` | `string` | `'array'` | [defi/protocols/src/vendors/algorand/tools/transactionManager/appTransactions/types.ts:122](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/vendors/algorand/tools/transactionManager/appTransactions/types.ts#L122) |
| `makeAppUpdateTxn.properties.appIndex` | \{ `description`: `string`; `type`: `string`; \} | - | [defi/protocols/src/vendors/algorand/tools/transactionManager/appTransactions/types.ts:115](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/vendors/algorand/tools/transactionManager/appTransactions/types.ts#L115) |
| `makeAppUpdateTxn.properties.appIndex.description` | `string` | `'ID of the application to update'` | [defi/protocols/src/vendors/algorand/tools/transactionManager/appTransactions/types.ts:115](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/vendors/algorand/tools/transactionManager/appTransactions/types.ts#L115) |
| `makeAppUpdateTxn.properties.appIndex.type` | `string` | `'integer'` | [defi/protocols/src/vendors/algorand/tools/transactionManager/appTransactions/types.ts:115](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/vendors/algorand/tools/transactionManager/appTransactions/types.ts#L115) |
| `makeAppUpdateTxn.properties.approvalProgram` | \{ `description`: `string`; `type`: `string`; \} | - | [defi/protocols/src/vendors/algorand/tools/transactionManager/appTransactions/types.ts:116](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/vendors/algorand/tools/transactionManager/appTransactions/types.ts#L116) |
| `makeAppUpdateTxn.properties.approvalProgram.description` | `string` | `'New approval program (compiled TEAL as base64)'` | [defi/protocols/src/vendors/algorand/tools/transactionManager/appTransactions/types.ts:116](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/vendors/algorand/tools/transactionManager/appTransactions/types.ts#L116) |
| `makeAppUpdateTxn.properties.approvalProgram.type` | `string` | `'string'` | [defi/protocols/src/vendors/algorand/tools/transactionManager/appTransactions/types.ts:116](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/vendors/algorand/tools/transactionManager/appTransactions/types.ts#L116) |
| `makeAppUpdateTxn.properties.clearProgram` | \{ `description`: `string`; `type`: `string`; \} | - | [defi/protocols/src/vendors/algorand/tools/transactionManager/appTransactions/types.ts:117](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/vendors/algorand/tools/transactionManager/appTransactions/types.ts#L117) |
| `makeAppUpdateTxn.properties.clearProgram.description` | `string` | `'New clear state program (compiled TEAL as base64)'` | [defi/protocols/src/vendors/algorand/tools/transactionManager/appTransactions/types.ts:117](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/vendors/algorand/tools/transactionManager/appTransactions/types.ts#L117) |
| `makeAppUpdateTxn.properties.clearProgram.type` | `string` | `'string'` | [defi/protocols/src/vendors/algorand/tools/transactionManager/appTransactions/types.ts:117](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/vendors/algorand/tools/transactionManager/appTransactions/types.ts#L117) |
| `makeAppUpdateTxn.properties.foreignApps` | \{ `description`: `string`; `items`: \{ `type`: `string`; \}; `optional`: `boolean`; `type`: `string`; \} | - | [defi/protocols/src/vendors/algorand/tools/transactionManager/appTransactions/types.ts:133](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/vendors/algorand/tools/transactionManager/appTransactions/types.ts#L133) |
| `makeAppUpdateTxn.properties.foreignApps.description` | `string` | `'IDs of apps whose global state may be accessed (max 8 apps)'` | [defi/protocols/src/vendors/algorand/tools/transactionManager/appTransactions/types.ts:137](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/vendors/algorand/tools/transactionManager/appTransactions/types.ts#L137) |
| `makeAppUpdateTxn.properties.foreignApps.items` | \{ `type`: `string`; \} | - | [defi/protocols/src/vendors/algorand/tools/transactionManager/appTransactions/types.ts:135](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/vendors/algorand/tools/transactionManager/appTransactions/types.ts#L135) |
| `makeAppUpdateTxn.properties.foreignApps.items.type` | `string` | `'integer'` | [defi/protocols/src/vendors/algorand/tools/transactionManager/appTransactions/types.ts:135](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/vendors/algorand/tools/transactionManager/appTransactions/types.ts#L135) |
| `makeAppUpdateTxn.properties.foreignApps.optional` | `boolean` | `true` | [defi/protocols/src/vendors/algorand/tools/transactionManager/appTransactions/types.ts:136](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/vendors/algorand/tools/transactionManager/appTransactions/types.ts#L136) |
| `makeAppUpdateTxn.properties.foreignApps.type` | `string` | `'array'` | [defi/protocols/src/vendors/algorand/tools/transactionManager/appTransactions/types.ts:134](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/vendors/algorand/tools/transactionManager/appTransactions/types.ts#L134) |
| `makeAppUpdateTxn.properties.foreignAssets` | \{ `description`: `string`; `items`: \{ `type`: `string`; \}; `optional`: `boolean`; `type`: `string`; \} | - | [defi/protocols/src/vendors/algorand/tools/transactionManager/appTransactions/types.ts:139](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/vendors/algorand/tools/transactionManager/appTransactions/types.ts#L139) |
| `makeAppUpdateTxn.properties.foreignAssets.description` | `string` | `'IDs of assets that may be accessed (max 8 assets)'` | [defi/protocols/src/vendors/algorand/tools/transactionManager/appTransactions/types.ts:143](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/vendors/algorand/tools/transactionManager/appTransactions/types.ts#L143) |
| `makeAppUpdateTxn.properties.foreignAssets.items` | \{ `type`: `string`; \} | - | [defi/protocols/src/vendors/algorand/tools/transactionManager/appTransactions/types.ts:141](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/vendors/algorand/tools/transactionManager/appTransactions/types.ts#L141) |
| `makeAppUpdateTxn.properties.foreignAssets.items.type` | `string` | `'integer'` | [defi/protocols/src/vendors/algorand/tools/transactionManager/appTransactions/types.ts:141](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/vendors/algorand/tools/transactionManager/appTransactions/types.ts#L141) |
| `makeAppUpdateTxn.properties.foreignAssets.optional` | `boolean` | `true` | [defi/protocols/src/vendors/algorand/tools/transactionManager/appTransactions/types.ts:142](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/vendors/algorand/tools/transactionManager/appTransactions/types.ts#L142) |
| `makeAppUpdateTxn.properties.foreignAssets.type` | `string` | `'array'` | [defi/protocols/src/vendors/algorand/tools/transactionManager/appTransactions/types.ts:140](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/vendors/algorand/tools/transactionManager/appTransactions/types.ts#L140) |
| `makeAppUpdateTxn.properties.from` | \{ `description`: `string`; `type`: `string`; \} | - | [defi/protocols/src/vendors/algorand/tools/transactionManager/appTransactions/types.ts:114](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/vendors/algorand/tools/transactionManager/appTransactions/types.ts#L114) |
| `makeAppUpdateTxn.properties.from.description` | `string` | `'Sender address in standard Algorand format (58 characters)'` | [defi/protocols/src/vendors/algorand/tools/transactionManager/appTransactions/types.ts:114](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/vendors/algorand/tools/transactionManager/appTransactions/types.ts#L114) |
| `makeAppUpdateTxn.properties.from.type` | `string` | `'string'` | [defi/protocols/src/vendors/algorand/tools/transactionManager/appTransactions/types.ts:114](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/vendors/algorand/tools/transactionManager/appTransactions/types.ts#L114) |
| `makeAppUpdateTxn.properties.lease` | \{ `description`: `string`; `optional`: `boolean`; `type`: `string`; \} | - | [defi/protocols/src/vendors/algorand/tools/transactionManager/appTransactions/types.ts:119](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/vendors/algorand/tools/transactionManager/appTransactions/types.ts#L119) |
| `makeAppUpdateTxn.properties.lease.description` | `string` | `'Lease enforces mutual exclusion of transactions (32 bytes)'` | [defi/protocols/src/vendors/algorand/tools/transactionManager/appTransactions/types.ts:119](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/vendors/algorand/tools/transactionManager/appTransactions/types.ts#L119) |
| `makeAppUpdateTxn.properties.lease.optional` | `boolean` | `true` | [defi/protocols/src/vendors/algorand/tools/transactionManager/appTransactions/types.ts:119](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/vendors/algorand/tools/transactionManager/appTransactions/types.ts#L119) |
| `makeAppUpdateTxn.properties.lease.type` | `string` | `'string'` | [defi/protocols/src/vendors/algorand/tools/transactionManager/appTransactions/types.ts:119](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/vendors/algorand/tools/transactionManager/appTransactions/types.ts#L119) |
| `makeAppUpdateTxn.properties.note` | \{ `description`: `string`; `optional`: `boolean`; `type`: `string`; \} | - | [defi/protocols/src/vendors/algorand/tools/transactionManager/appTransactions/types.ts:118](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/vendors/algorand/tools/transactionManager/appTransactions/types.ts#L118) |
| `makeAppUpdateTxn.properties.note.description` | `string` | `'Transaction note field (up to 1000 bytes)'` | [defi/protocols/src/vendors/algorand/tools/transactionManager/appTransactions/types.ts:118](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/vendors/algorand/tools/transactionManager/appTransactions/types.ts#L118) |
| `makeAppUpdateTxn.properties.note.optional` | `boolean` | `true` | [defi/protocols/src/vendors/algorand/tools/transactionManager/appTransactions/types.ts:118](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/vendors/algorand/tools/transactionManager/appTransactions/types.ts#L118) |
| `makeAppUpdateTxn.properties.note.type` | `string` | `'string'` | [defi/protocols/src/vendors/algorand/tools/transactionManager/appTransactions/types.ts:118](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/vendors/algorand/tools/transactionManager/appTransactions/types.ts#L118) |
| `makeAppUpdateTxn.properties.onComplete` | \{ `description`: `string`; `optional`: `boolean`; `type`: `string`; \} | - | [defi/protocols/src/vendors/algorand/tools/transactionManager/appTransactions/types.ts:145](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/vendors/algorand/tools/transactionManager/appTransactions/types.ts#L145) |
| `makeAppUpdateTxn.properties.onComplete.description` | `string` | `'Application call completion behavior (0=NoOp, 1=OptIn, 2=CloseOut, 3=ClearState, 4=UpdateApplication, 5=DeleteApplication)'` | [defi/protocols/src/vendors/algorand/tools/transactionManager/appTransactions/types.ts:145](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/vendors/algorand/tools/transactionManager/appTransactions/types.ts#L145) |
| `makeAppUpdateTxn.properties.onComplete.optional` | `boolean` | `true` | [defi/protocols/src/vendors/algorand/tools/transactionManager/appTransactions/types.ts:145](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/vendors/algorand/tools/transactionManager/appTransactions/types.ts#L145) |
| `makeAppUpdateTxn.properties.onComplete.type` | `string` | `'integer'` | [defi/protocols/src/vendors/algorand/tools/transactionManager/appTransactions/types.ts:145](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/vendors/algorand/tools/transactionManager/appTransactions/types.ts#L145) |
| `makeAppUpdateTxn.properties.rekeyTo` | \{ `description`: `string`; `optional`: `boolean`; `type`: `string`; \} | - | [defi/protocols/src/vendors/algorand/tools/transactionManager/appTransactions/types.ts:120](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/vendors/algorand/tools/transactionManager/appTransactions/types.ts#L120) |
| `makeAppUpdateTxn.properties.rekeyTo.description` | `string` | `'Address to rekey the sender account to'` | [defi/protocols/src/vendors/algorand/tools/transactionManager/appTransactions/types.ts:120](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/vendors/algorand/tools/transactionManager/appTransactions/types.ts#L120) |
| `makeAppUpdateTxn.properties.rekeyTo.optional` | `boolean` | `true` | [defi/protocols/src/vendors/algorand/tools/transactionManager/appTransactions/types.ts:120](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/vendors/algorand/tools/transactionManager/appTransactions/types.ts#L120) |
| `makeAppUpdateTxn.properties.rekeyTo.type` | `string` | `'string'` | [defi/protocols/src/vendors/algorand/tools/transactionManager/appTransactions/types.ts:120](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/vendors/algorand/tools/transactionManager/appTransactions/types.ts#L120) |
| `makeAppUpdateTxn.required` | `string`[] | - | [defi/protocols/src/vendors/algorand/tools/transactionManager/appTransactions/types.ts:147](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/vendors/algorand/tools/transactionManager/appTransactions/types.ts#L147) |
| `makeAppUpdateTxn.type` | `string` | `'object'` | [defi/protocols/src/vendors/algorand/tools/transactionManager/appTransactions/types.ts:112](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/vendors/algorand/tools/transactionManager/appTransactions/types.ts#L112) |

***

### appTransactionTools

```ts
const appTransactionTools: (
  | {
  description: string;
  inputSchema: {
     properties: {
        accounts: {
           description: string;
           items: {
              type: string;
           };
           optional: boolean;
           type: string;
        };
        appArgs: {
           description: string;
           items: {
              type: string;
           };
           optional: boolean;
           type: string;
        };
        approvalProgram: {
           description: string;
           type: string;
        };
        clearProgram: {
           description: string;
           type: string;
        };
        extraPages: {
           description: string;
           optional: boolean;
           type: string;
        };
        foreignApps: {
           description: string;
           items: {
              type: string;
           };
           optional: boolean;
           type: string;
        };
        foreignAssets: {
           description: string;
           items: {
              type: string;
           };
           optional: boolean;
           type: string;
        };
        from: {
           description: string;
           type: string;
        };
        lease: {
           description: string;
           optional: boolean;
           type: string;
        };
        note: {
           description: string;
           optional: boolean;
           type: string;
        };
        numGlobalByteSlices: {
           description: string;
           type: string;
        };
        numGlobalInts: {
           description: string;
           type: string;
        };
        numLocalByteSlices: {
           description: string;
           type: string;
        };
        numLocalInts: {
           description: string;
           type: string;
        };
        rekeyTo: {
           description: string;
           optional: boolean;
           type: string;
        };
     };
     required: string[];
     type: string;
  };
  name: string;
}
  | {
  description: string;
  inputSchema: {
     properties: {
        accounts: {
           description: string;
           items: {
              type: string;
           };
           optional: boolean;
           type: string;
        };
        appArgs: {
           description: string;
           items: {
              type: string;
           };
           optional: boolean;
           type: string;
        };
        appIndex: {
           description: string;
           type: string;
        };
        foreignApps: {
           description: string;
           items: {
              type: string;
           };
           optional: boolean;
           type: string;
        };
        foreignAssets: {
           description: string;
           items: {
              type: string;
           };
           optional: boolean;
           type: string;
        };
        from: {
           description: string;
           type: string;
        };
        note: {
           description: string;
           optional: boolean;
           type: string;
        };
     };
     required: string[];
     type: string;
  };
  name: string;
})[];
```

Defined in: [defi/protocols/src/vendors/algorand/tools/transactionManager/appTransactions/types.ts:329](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/vendors/algorand/tools/transactionManager/appTransactions/types.ts#L329)
