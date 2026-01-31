[**Universal Crypto MCP API Reference v1.0.0**](../../../../../../../index.md)

***

[Universal Crypto MCP API Reference](/docs/api/index.md) / defi/protocols/src/vendors/evm-legacy/core/services/utils

# defi/protocols/src/vendors/evm-legacy/core/services/utils

## Variables

### utils

```ts
const utils: {
  formatBigInt: (value: bigint) => string;
  formatEther: (wei: bigint, unit?: "wei" | "gwei") => string;
  formatJson: (obj: unknown) => string;
  formatNumber: (value: string | number) => string;
  hexToNumber: (hex: string) => number;
  numberToHex: (num: number) => string;
  parseEther: (ether: string, unit?: "wei" | "gwei") => bigint;
};
```

Defined in: [defi/protocols/src/vendors/evm-legacy/core/services/utils.ts:21](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/vendors/evm-legacy/core/services/utils.ts#L21)

Utility functions for formatting and parsing values

#### Type Declaration

| Name | Type | Defined in |
| :------ | :------ | :------ |
| <a id="formatbigint"></a> `formatBigInt()` | (`value`: `bigint`) => `string` | [defi/protocols/src/vendors/evm-legacy/core/services/utils.ts:29](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/vendors/evm-legacy/core/services/utils.ts#L29) |
| <a id="formatether"></a> `formatEther()` | (`wei`: `bigint`, `unit?`: `"wei"` \| `"gwei"`) => `string` | [defi/protocols/src/vendors/evm-legacy/core/services/utils.ts:26](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/vendors/evm-legacy/core/services/utils.ts#L26) |
| <a id="formatjson"></a> `formatJson()` | (`obj`: `unknown`) => `string` | [defi/protocols/src/vendors/evm-legacy/core/services/utils.ts:32](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/vendors/evm-legacy/core/services/utils.ts#L32) |
| <a id="formatnumber"></a> `formatNumber()` | (`value`: `string` \| `number`) => `string` | [defi/protocols/src/vendors/evm-legacy/core/services/utils.ts:36](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/vendors/evm-legacy/core/services/utils.ts#L36) |
| <a id="hextonumber"></a> `hexToNumber()` | (`hex`: `string`) => `number` | [defi/protocols/src/vendors/evm-legacy/core/services/utils.ts:41](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/vendors/evm-legacy/core/services/utils.ts#L41) |
| <a id="numbertohex"></a> `numberToHex()` | (`num`: `number`) => `string` | [defi/protocols/src/vendors/evm-legacy/core/services/utils.ts:46](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/vendors/evm-legacy/core/services/utils.ts#L46) |
| <a id="parseether"></a> `parseEther()` | (`ether`: `string`, `unit?`: `"wei"` \| `"gwei"`) => `bigint` | [defi/protocols/src/vendors/evm-legacy/core/services/utils.ts:23](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/vendors/evm-legacy/core/services/utils.ts#L23) |
