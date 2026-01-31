[**Universal Crypto MCP API Reference v1.0.0**](../../../../../../../index.md)

***

[Universal Crypto MCP API Reference](/docs/api/index.md) / defi/protocols/src/vendors/bnb/evm/services/blocks

# defi/protocols/src/vendors/bnb/evm/services/blocks

## Functions

### getBlockByHash()

```ts
function getBlockByHash(blockHash: `0x${string}`, network: string): Promise<Block>;
```

Defined in: [defi/protocols/src/vendors/bnb/evm/services/blocks.ts:33](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/vendors/bnb/evm/services/blocks.ts#L33)

Get a block by hash for a specific network

#### Parameters

| Parameter | Type | Default value |
| :------ | :------ | :------ |
| `blockHash` | `` `0x${string}` `` | `undefined` |
| `network` | `string` | `"ethereum"` |

#### Returns

`Promise`\<`Block`\>

***

### getBlockByNumber()

```ts
function getBlockByNumber(blockNumber: number, network: string): Promise<Block>;
```

Defined in: [defi/protocols/src/vendors/bnb/evm/services/blocks.ts:22](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/vendors/bnb/evm/services/blocks.ts#L22)

Get a block by number for a specific network

#### Parameters

| Parameter | Type | Default value |
| :------ | :------ | :------ |
| `blockNumber` | `number` | `undefined` |
| `network` | `string` | `"ethereum"` |

#### Returns

`Promise`\<`Block`\>

***

### getBlockNumber()

```ts
function getBlockNumber(network: string): Promise<bigint>;
```

Defined in: [defi/protocols/src/vendors/bnb/evm/services/blocks.ts:14](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/vendors/bnb/evm/services/blocks.ts#L14)

Get the current block number for a specific network

#### Parameters

| Parameter | Type | Default value |
| :------ | :------ | :------ |
| `network` | `string` | `"ethereum"` |

#### Returns

`Promise`\<`bigint`\>

***

### getLatestBlock()

```ts
function getLatestBlock(network: string): Promise<Block>;
```

Defined in: [defi/protocols/src/vendors/bnb/evm/services/blocks.ts:44](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/vendors/bnb/evm/services/blocks.ts#L44)

Get the latest block for a specific network

#### Parameters

| Parameter | Type | Default value |
| :------ | :------ | :------ |
| `network` | `string` | `"ethereum"` |

#### Returns

`Promise`\<`Block`\>
