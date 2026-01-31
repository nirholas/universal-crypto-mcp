[**Universal Crypto MCP API Reference v1.0.0**](../../../../../index.md)

***

[Universal Crypto MCP API Reference](/docs/api/index.md) / defi/protocols/src/vendors/algorand/algorand-client

# defi/protocols/src/vendors/algorand/algorand-client

## Variables

### algodClient

```ts
const algodClient: any;
```

Defined in: [defi/protocols/src/vendors/algorand/algorand-client.ts:48](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/vendors/algorand/algorand-client.ts#L48)

***

### API\_URIS

```ts
const API_URIS: {
  ACCOUNT_DETAILS: string;
  APPLICATION_BOX: string;
  APPLICATION_BOXES: string;
  APPLICATION_INFO: string;
  APPLICATION_STATE: string;
  ASSET_BALANCES: string;
  ASSET_BALANCES_BY_ID: string;
  ASSET_DETAILS: string;
  ASSET_HOLDINGS: string;
  ASSET_INFO: string;
  ASSET_TRANSACTIONS: string;
  ASSET_TRANSACTIONS_BY_ID: string;
  NODE_STATUS: string;
  NODE_STATUS_AFTER_BLOCK: string;
  PENDING_TRANSACTION: string;
  PENDING_TRANSACTIONS: string;
  PENDING_TRANSACTIONS_BY_ADDRESS: string;
  TRANSACTION_DETAILS: string;
  TRANSACTION_HISTORY: string;
  TRANSACTION_PARAMS: string;
  TRANSACTION_SEARCH: string;
};
```

Defined in: [defi/protocols/src/vendors/algorand/algorand-client.ts:20](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/vendors/algorand/algorand-client.ts#L20)

#### Type Declaration

| Name | Type | Defined in |
| :------ | :------ | :------ |
| <a id="account_details"></a> `ACCOUNT_DETAILS` | `string` | [defi/protocols/src/vendors/algorand/algorand-client.ts:22](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/vendors/algorand/algorand-client.ts#L22) |
| <a id="application_box"></a> `APPLICATION_BOX` | `string` | [defi/protocols/src/vendors/algorand/algorand-client.ts:27](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/vendors/algorand/algorand-client.ts#L27) |
| <a id="application_boxes"></a> `APPLICATION_BOXES` | `string` | [defi/protocols/src/vendors/algorand/algorand-client.ts:28](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/vendors/algorand/algorand-client.ts#L28) |
| <a id="application_info"></a> `APPLICATION_INFO` | `string` | [defi/protocols/src/vendors/algorand/algorand-client.ts:26](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/vendors/algorand/algorand-client.ts#L26) |
| <a id="application_state"></a> `APPLICATION_STATE` | `string` | [defi/protocols/src/vendors/algorand/algorand-client.ts:24](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/vendors/algorand/algorand-client.ts#L24) |
| <a id="asset_balances"></a> `ASSET_BALANCES` | `string` | [defi/protocols/src/vendors/algorand/algorand-client.ts:39](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/vendors/algorand/algorand-client.ts#L39) |
| <a id="asset_balances_by_id"></a> `ASSET_BALANCES_BY_ID` | `string` | [defi/protocols/src/vendors/algorand/algorand-client.ts:41](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/vendors/algorand/algorand-client.ts#L41) |
| <a id="asset_details"></a> `ASSET_DETAILS` | `string` | [defi/protocols/src/vendors/algorand/algorand-client.ts:38](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/vendors/algorand/algorand-client.ts#L38) |
| <a id="asset_holdings"></a> `ASSET_HOLDINGS` | `string` | [defi/protocols/src/vendors/algorand/algorand-client.ts:23](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/vendors/algorand/algorand-client.ts#L23) |
| <a id="asset_info"></a> `ASSET_INFO` | `string` | [defi/protocols/src/vendors/algorand/algorand-client.ts:25](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/vendors/algorand/algorand-client.ts#L25) |
| <a id="asset_transactions"></a> `ASSET_TRANSACTIONS` | `string` | [defi/protocols/src/vendors/algorand/algorand-client.ts:40](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/vendors/algorand/algorand-client.ts#L40) |
| <a id="asset_transactions_by_id"></a> `ASSET_TRANSACTIONS_BY_ID` | `string` | [defi/protocols/src/vendors/algorand/algorand-client.ts:42](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/vendors/algorand/algorand-client.ts#L42) |
| <a id="node_status"></a> `NODE_STATUS` | `string` | [defi/protocols/src/vendors/algorand/algorand-client.ts:33](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/vendors/algorand/algorand-client.ts#L33) |
| <a id="node_status_after_block"></a> `NODE_STATUS_AFTER_BLOCK` | `string` | [defi/protocols/src/vendors/algorand/algorand-client.ts:34](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/vendors/algorand/algorand-client.ts#L34) |
| <a id="pending_transaction"></a> `PENDING_TRANSACTION` | `string` | [defi/protocols/src/vendors/algorand/algorand-client.ts:29](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/vendors/algorand/algorand-client.ts#L29) |
| <a id="pending_transactions"></a> `PENDING_TRANSACTIONS` | `string` | [defi/protocols/src/vendors/algorand/algorand-client.ts:31](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/vendors/algorand/algorand-client.ts#L31) |
| <a id="pending_transactions_by_address"></a> `PENDING_TRANSACTIONS_BY_ADDRESS` | `string` | [defi/protocols/src/vendors/algorand/algorand-client.ts:30](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/vendors/algorand/algorand-client.ts#L30) |
| <a id="transaction_details"></a> `TRANSACTION_DETAILS` | `string` | [defi/protocols/src/vendors/algorand/algorand-client.ts:43](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/vendors/algorand/algorand-client.ts#L43) |
| <a id="transaction_history"></a> `TRANSACTION_HISTORY` | `string` | [defi/protocols/src/vendors/algorand/algorand-client.ts:37](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/vendors/algorand/algorand-client.ts#L37) |
| <a id="transaction_params"></a> `TRANSACTION_PARAMS` | `string` | [defi/protocols/src/vendors/algorand/algorand-client.ts:32](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/vendors/algorand/algorand-client.ts#L32) |
| <a id="transaction_search"></a> `TRANSACTION_SEARCH` | `string` | [defi/protocols/src/vendors/algorand/algorand-client.ts:44](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/vendors/algorand/algorand-client.ts#L44) |

***

### indexerClient

```ts
const indexerClient: any;
```

Defined in: [defi/protocols/src/vendors/algorand/algorand-client.ts:55](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/vendors/algorand/algorand-client.ts#L55)

## References

### indexer

Renames and re-exports [indexerClient](/docs/api/defi/protocols/src/vendors/algorand/algorand-client.md#indexerclient)
