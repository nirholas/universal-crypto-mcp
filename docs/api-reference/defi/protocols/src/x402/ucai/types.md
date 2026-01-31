[**Universal Crypto MCP API Reference v1.0.0**](../../../../../index.md)

***

[Universal Crypto MCP API Reference](/docs/api/index.md) / defi/protocols/src/x402/ucai/types

# defi/protocols/src/x402/ucai/types

## Interfaces

### ABIGenerationRequest

Defined in: [defi/protocols/src/x402/ucai/types.ts:406](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/x402/ucai/types.ts#L406)

#### Properties

| Property | Type | Description | Defined in |
| :------ | :------ | :------ | :------ |
| <a id="contractaddress"></a> `contractAddress` | `` `0x${string}` `` | Contract address | [defi/protocols/src/x402/ucai/types.ts:408](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/x402/ucai/types.ts#L408) |
| <a id="detectstandards"></a> `detectStandards?` | `boolean` | Attempt to detect known patterns (ERC20, ERC721, etc.) | [defi/protocols/src/x402/ucai/types.ts:414](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/x402/ucai/types.ts#L414) |
| <a id="includedescriptions"></a> `includeDescriptions?` | `boolean` | Include AI-enhanced descriptions | [defi/protocols/src/x402/ucai/types.ts:412](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/x402/ucai/types.ts#L412) |
| <a id="network"></a> `network` | `string` | Network | [defi/protocols/src/x402/ucai/types.ts:410](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/x402/ucai/types.ts#L410) |

***

### ABIGenerationResult

Defined in: [defi/protocols/src/x402/ucai/types.ts:417](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/x402/ucai/types.ts#L417)

#### Properties

| Property | Type | Description | Defined in |
| :------ | :------ | :------ | :------ |
| <a id="abi"></a> `abi` | [`ABIItem`](/docs/api/defi/protocols/src/x402/ucai/types.md#abiitem)[] | Generated ABI | [defi/protocols/src/x402/ucai/types.ts:419](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/x402/ucai/types.ts#L419) |
| <a id="bytecode"></a> `bytecode` | `` `0x${string}` `` | Contract bytecode | [defi/protocols/src/x402/ucai/types.ts:421](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/x402/ucai/types.ts#L421) |
| <a id="confidence"></a> `confidence` | `number` | Confidence score (0-100) | [defi/protocols/src/x402/ucai/types.ts:429](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/x402/ucai/types.ts#L429) |
| <a id="contracttype"></a> `contractType?` | `string` | Contract type guess | [defi/protocols/src/x402/ucai/types.ts:425](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/x402/ucai/types.ts#L425) |
| <a id="decompiledsource"></a> `decompiledSource?` | `string` | Decompiled source (if possible) | [defi/protocols/src/x402/ucai/types.ts:427](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/x402/ucai/types.ts#L427) |
| <a id="detectedstandards"></a> `detectedStandards` | [`ContractStandard`](/docs/api/defi/protocols/src/x402/ucai/types.md#contractstandard)[] | Detected standards | [defi/protocols/src/x402/ucai/types.ts:423](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/x402/ucai/types.ts#L423) |
| <a id="method"></a> `method` | `"verified"` \| `"decompiled"` \| `"pattern_matching"` \| `"ai_enhanced"` | Generation method used | [defi/protocols/src/x402/ucai/types.ts:431](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/x402/ucai/types.ts#L431) |
| <a id="warnings"></a> `warnings` | `string`[] | Warnings about the generation | [defi/protocols/src/x402/ucai/types.ts:433](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/x402/ucai/types.ts#L433) |

***

### ABIItem

Defined in: [defi/protocols/src/x402/ucai/types.ts:436](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/x402/ucai/types.ts#L436)

#### Properties

| Property | Type | Description | Defined in |
| :------ | :------ | :------ | :------ |
| <a id="anonymous"></a> `anonymous?` | `boolean` | Whether anonymous (for events) | [defi/protocols/src/x402/ucai/types.ts:448](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/x402/ucai/types.ts#L448) |
| <a id="description"></a> `description?` | `string` | AI-generated description | [defi/protocols/src/x402/ucai/types.ts:450](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/x402/ucai/types.ts#L450) |
| <a id="inputs"></a> `inputs?` | [`ABIParameter`](/docs/api/defi/protocols/src/x402/ucai/types.md#abiparameter)[] | Input parameters | [defi/protocols/src/x402/ucai/types.ts:442](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/x402/ucai/types.ts#L442) |
| <a id="name"></a> `name?` | `string` | Name of the function/event | [defi/protocols/src/x402/ucai/types.ts:440](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/x402/ucai/types.ts#L440) |
| <a id="outputs"></a> `outputs?` | [`ABIParameter`](/docs/api/defi/protocols/src/x402/ucai/types.md#abiparameter)[] | Output parameters | [defi/protocols/src/x402/ucai/types.ts:444](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/x402/ucai/types.ts#L444) |
| <a id="statemutability"></a> `stateMutability?` | `"pure"` \| `"view"` \| `"nonpayable"` \| `"payable"` | State mutability | [defi/protocols/src/x402/ucai/types.ts:446](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/x402/ucai/types.ts#L446) |
| <a id="type"></a> `type` | `"function"` \| `"event"` \| `"constructor"` \| `"fallback"` \| `"receive"` | Function/event type | [defi/protocols/src/x402/ucai/types.ts:438](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/x402/ucai/types.ts#L438) |

***

### ABIParameter

Defined in: [defi/protocols/src/x402/ucai/types.ts:453](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/x402/ucai/types.ts#L453)

#### Properties

| Property | Type | Description | Defined in |
| :------ | :------ | :------ | :------ |
| <a id="components"></a> `components?` | [`ABIParameter`](/docs/api/defi/protocols/src/x402/ucai/types.md#abiparameter)[] | Nested components for tuples | [defi/protocols/src/x402/ucai/types.ts:461](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/x402/ucai/types.ts#L461) |
| <a id="description-1"></a> `description?` | `string` | AI-generated description | [defi/protocols/src/x402/ucai/types.ts:463](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/x402/ucai/types.ts#L463) |
| <a id="indexed"></a> `indexed?` | `boolean` | Indexed (for events) | [defi/protocols/src/x402/ucai/types.ts:459](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/x402/ucai/types.ts#L459) |
| <a id="name-1"></a> `name` | `string` | Parameter name | [defi/protocols/src/x402/ucai/types.ts:455](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/x402/ucai/types.ts#L455) |
| <a id="type-1"></a> `type` | `string` | Parameter type | [defi/protocols/src/x402/ucai/types.ts:457](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/x402/ucai/types.ts#L457) |

***

### ContractAnalysisRequest

Defined in: [defi/protocols/src/x402/ucai/types.ts:80](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/x402/ucai/types.ts#L80)

#### Properties

| Property | Type | Description | Defined in |
| :------ | :------ | :------ | :------ |
| <a id="analysistype"></a> `analysisType` | [`AnalysisType`](/docs/api/defi/protocols/src/x402/ucai/types.md#analysistype-1)[] | Type of analysis requested | [defi/protocols/src/x402/ucai/types.ts:86](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/x402/ucai/types.ts#L86) |
| <a id="contractaddress-1"></a> `contractAddress` | `` `0x${string}` `` | Contract address to analyze | [defi/protocols/src/x402/ucai/types.ts:82](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/x402/ucai/types.ts#L82) |
| <a id="network-1"></a> `network` | `string` | Network the contract is on | [defi/protocols/src/x402/ucai/types.ts:84](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/x402/ucai/types.ts#L84) |

***

### GasSponsorConfig

Defined in: [defi/protocols/src/x402/ucai/types.ts:65](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/x402/ucai/types.ts#L65)

#### Properties

| Property | Type | Description | Defined in |
| :------ | :------ | :------ | :------ |
| <a id="entrypointaddresses"></a> `entryPointAddresses` | `Record`\<`string`, `Address`\> | Entry point addresses for account abstraction | [defi/protocols/src/x402/ucai/types.ts:73](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/x402/ucai/types.ts#L73) |
| <a id="maxgaspertx"></a> `maxGasPerTx` | `string` | Maximum gas to sponsor per transaction in USD | [defi/protocols/src/x402/ucai/types.ts:67](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/x402/ucai/types.ts#L67) |
| <a id="paymasteraddresses"></a> `paymasterAddresses` | `Record`\<`string`, `Address`\> | Paymaster contract addresses by network | [defi/protocols/src/x402/ucai/types.ts:71](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/x402/ucai/types.ts#L71) |
| <a id="supportednetworks"></a> `supportedNetworks` | `string`[] | Supported networks for sponsorship | [defi/protocols/src/x402/ucai/types.ts:69](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/x402/ucai/types.ts#L69) |

***

### GasSponsorshipRequest

Defined in: [defi/protocols/src/x402/ucai/types.ts:31](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/x402/ucai/types.ts#L31)

#### Properties

| Property | Type | Description | Defined in |
| :------ | :------ | :------ | :------ |
| <a id="abi-1"></a> `abi` | `unknown`[] | Contract ABI | [defi/protocols/src/x402/ucai/types.ts:41](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/x402/ucai/types.ts#L41) |
| <a id="args"></a> `args` | `unknown`[] | Function arguments | [defi/protocols/src/x402/ucai/types.ts:39](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/x402/ucai/types.ts#L39) |
| <a id="contractaddress-2"></a> `contractAddress` | `` `0x${string}` `` | Target contract address | [defi/protocols/src/x402/ucai/types.ts:35](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/x402/ucai/types.ts#L35) |
| <a id="functionname"></a> `functionName` | `string` | Function to call | [defi/protocols/src/x402/ucai/types.ts:37](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/x402/ucai/types.ts#L37) |
| <a id="maxgasusd"></a> `maxGasUsd?` | `string` | Maximum gas amount in USD willing to sponsor | [defi/protocols/src/x402/ucai/types.ts:45](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/x402/ucai/types.ts#L45) |
| <a id="network-2"></a> `network` | `string` | Network to execute on | [defi/protocols/src/x402/ucai/types.ts:43](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/x402/ucai/types.ts#L43) |
| <a id="useraddress"></a> `userAddress` | `` `0x${string}` `` | User's wallet address that needs gas | [defi/protocols/src/x402/ucai/types.ts:33](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/x402/ucai/types.ts#L33) |

***

### GasSponsorshipResult

Defined in: [defi/protocols/src/x402/ucai/types.ts:48](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/x402/ucai/types.ts#L48)

#### Properties

| Property | Type | Description | Defined in |
| :------ | :------ | :------ | :------ |
| <a id="error"></a> `error?` | `string` | Error message if failed | [defi/protocols/src/x402/ucai/types.ts:62](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/x402/ucai/types.ts#L62) |
| <a id="gascostnative"></a> `gasCostNative?` | `string` | Gas cost in native token | [defi/protocols/src/x402/ucai/types.ts:54](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/x402/ucai/types.ts#L54) |
| <a id="gascostusd"></a> `gasCostUsd?` | `string` | Gas cost in USD | [defi/protocols/src/x402/ucai/types.ts:56](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/x402/ucai/types.ts#L56) |
| <a id="paymentamount"></a> `paymentAmount?` | `string` | x402 payment amount | [defi/protocols/src/x402/ucai/types.ts:58](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/x402/ucai/types.ts#L58) |
| <a id="success"></a> `success` | `boolean` | Whether sponsorship was successful | [defi/protocols/src/x402/ucai/types.ts:50](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/x402/ucai/types.ts#L50) |
| <a id="transactionhash"></a> `transactionHash?` | `` `0x${string}` `` | Transaction hash | [defi/protocols/src/x402/ucai/types.ts:52](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/x402/ucai/types.ts#L52) |
| <a id="userophash"></a> `userOpHash?` | `` `0x${string}` `` | User operation hash (for account abstraction) | [defi/protocols/src/x402/ucai/types.ts:60](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/x402/ucai/types.ts#L60) |

***

### HistoricalDataRequest

Defined in: [defi/protocols/src/x402/ucai/types.ts:290](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/x402/ucai/types.ts#L290)

#### Properties

| Property | Type | Description | Defined in |
| :------ | :------ | :------ | :------ |
| <a id="contractaddress-3"></a> `contractAddress` | `` `0x${string}` `` | Contract address | [defi/protocols/src/x402/ucai/types.ts:292](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/x402/ucai/types.ts#L292) |
| <a id="datatype"></a> `dataType` | [`HistoricalDataType`](/docs/api/defi/protocols/src/x402/ucai/types.md#historicaldatatype) | Type of historical data | [defi/protocols/src/x402/ucai/types.ts:296](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/x402/ucai/types.ts#L296) |
| <a id="eventfilter"></a> `eventFilter?` | \{ `eventName?`: `string`; `topics?`: (`` `0x${string}` `` \| `null`)[]; \} | Event filter (for event logs) | [defi/protocols/src/x402/ucai/types.ts:302](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/x402/ucai/types.ts#L302) |
| `eventFilter.eventName?` | `string` | - | [defi/protocols/src/x402/ucai/types.ts:303](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/x402/ucai/types.ts#L303) |
| `eventFilter.topics?` | (`` `0x${string}` `` \| `null`)[] | - | [defi/protocols/src/x402/ucai/types.ts:304](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/x402/ucai/types.ts#L304) |
| <a id="fromblock"></a> `fromBlock?` | `bigint` \| `"earliest"` | Start block or timestamp | [defi/protocols/src/x402/ucai/types.ts:298](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/x402/ucai/types.ts#L298) |
| <a id="limit"></a> `limit?` | `number` | Maximum number of results | [defi/protocols/src/x402/ucai/types.ts:307](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/x402/ucai/types.ts#L307) |
| <a id="network-3"></a> `network` | `string` | Network | [defi/protocols/src/x402/ucai/types.ts:294](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/x402/ucai/types.ts#L294) |
| <a id="toblock"></a> `toBlock?` | `bigint` \| `"latest"` | End block or timestamp | [defi/protocols/src/x402/ucai/types.ts:300](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/x402/ucai/types.ts#L300) |

***

### HistoricalDataResult

Defined in: [defi/protocols/src/x402/ucai/types.ts:378](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/x402/ucai/types.ts#L378)

#### Properties

| Property | Type | Description | Defined in |
| :------ | :------ | :------ | :------ |
| <a id="blockrange"></a> `blockRange` | \{ `from`: `bigint`; `to`: `bigint`; \} | Block range queried | [defi/protocols/src/x402/ucai/types.ts:386](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/x402/ucai/types.ts#L386) |
| `blockRange.from` | `bigint` | - | [defi/protocols/src/x402/ucai/types.ts:387](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/x402/ucai/types.ts#L387) |
| `blockRange.to` | `bigint` | - | [defi/protocols/src/x402/ucai/types.ts:388](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/x402/ucai/types.ts#L388) |
| <a id="contractaddress-4"></a> `contractAddress` | `` `0x${string}` `` | Contract address | [defi/protocols/src/x402/ucai/types.ts:380](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/x402/ucai/types.ts#L380) |
| <a id="datatype-1"></a> `dataType` | [`HistoricalDataType`](/docs/api/defi/protocols/src/x402/ucai/types.md#historicaldatatype) | Data type | [defi/protocols/src/x402/ucai/types.ts:384](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/x402/ucai/types.ts#L384) |
| <a id="events"></a> `events?` | [`HistoricalEventLog`](/docs/api/defi/protocols/src/x402/ucai/types.md#historicaleventlog)[] | Events if requested | [defi/protocols/src/x402/ucai/types.ts:393](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/x402/ucai/types.ts#L393) |
| <a id="hasmore"></a> `hasMore` | `boolean` | Whether more results exist | [defi/protocols/src/x402/ucai/types.ts:399](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/x402/ucai/types.ts#L399) |
| <a id="network-4"></a> `network` | `string` | Network | [defi/protocols/src/x402/ucai/types.ts:382](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/x402/ucai/types.ts#L382) |
| <a id="statechanges"></a> `stateChanges?` | [`HistoricalStateChange`](/docs/api/defi/protocols/src/x402/ucai/types.md#historicalstatechange)[] | State changes if requested | [defi/protocols/src/x402/ucai/types.ts:395](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/x402/ucai/types.ts#L395) |
| <a id="totalcount"></a> `totalCount` | `number` | Total count | [defi/protocols/src/x402/ucai/types.ts:397](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/x402/ucai/types.ts#L397) |
| <a id="transactions"></a> `transactions?` | [`HistoricalTransaction`](/docs/api/defi/protocols/src/x402/ucai/types.md#historicaltransaction)[] | Transactions if requested | [defi/protocols/src/x402/ucai/types.ts:391](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/x402/ucai/types.ts#L391) |

***

### HistoricalEventLog

Defined in: [defi/protocols/src/x402/ucai/types.ts:340](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/x402/ucai/types.ts#L340)

#### Properties

| Property | Type | Description | Defined in |
| :------ | :------ | :------ | :------ |
| <a id="args-1"></a> `args` | `Record`\<`string`, `unknown`\> | Decoded event data | [defi/protocols/src/x402/ucai/types.ts:354](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/x402/ucai/types.ts#L354) |
| <a id="blocknumber"></a> `blockNumber` | `bigint` | Block number | [defi/protocols/src/x402/ucai/types.ts:344](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/x402/ucai/types.ts#L344) |
| <a id="data"></a> `data` | `` `0x${string}` `` | Raw data | [defi/protocols/src/x402/ucai/types.ts:358](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/x402/ucai/types.ts#L358) |
| <a id="eventname"></a> `eventName` | `string` | Event name | [defi/protocols/src/x402/ucai/types.ts:350](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/x402/ucai/types.ts#L350) |
| <a id="logindex"></a> `logIndex` | `number` | Log index | [defi/protocols/src/x402/ucai/types.ts:346](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/x402/ucai/types.ts#L346) |
| <a id="signature"></a> `signature` | `string` | Event signature | [defi/protocols/src/x402/ucai/types.ts:352](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/x402/ucai/types.ts#L352) |
| <a id="timestamp"></a> `timestamp` | `number` | Timestamp | [defi/protocols/src/x402/ucai/types.ts:348](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/x402/ucai/types.ts#L348) |
| <a id="topics"></a> `topics` | `` `0x${string}` ``[] | Raw topics | [defi/protocols/src/x402/ucai/types.ts:356](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/x402/ucai/types.ts#L356) |
| <a id="transactionhash-1"></a> `transactionHash` | `` `0x${string}` `` | Transaction hash | [defi/protocols/src/x402/ucai/types.ts:342](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/x402/ucai/types.ts#L342) |

***

### HistoricalStateChange

Defined in: [defi/protocols/src/x402/ucai/types.ts:361](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/x402/ucai/types.ts#L361)

#### Properties

| Property | Type | Description | Defined in |
| :------ | :------ | :------ | :------ |
| <a id="blocknumber-1"></a> `blockNumber` | `bigint` | Block number | [defi/protocols/src/x402/ucai/types.ts:363](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/x402/ucai/types.ts#L363) |
| <a id="meaning"></a> `meaning?` | `string` | Decoded meaning if available | [defi/protocols/src/x402/ucai/types.ts:375](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/x402/ucai/types.ts#L375) |
| <a id="newvalue"></a> `newValue` | `` `0x${string}` `` | New value | [defi/protocols/src/x402/ucai/types.ts:373](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/x402/ucai/types.ts#L373) |
| <a id="previousvalue"></a> `previousValue` | `` `0x${string}` `` | Previous value | [defi/protocols/src/x402/ucai/types.ts:371](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/x402/ucai/types.ts#L371) |
| <a id="slot"></a> `slot` | `` `0x${string}` `` | Storage slot | [defi/protocols/src/x402/ucai/types.ts:369](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/x402/ucai/types.ts#L369) |
| <a id="timestamp-1"></a> `timestamp` | `number` | Timestamp | [defi/protocols/src/x402/ucai/types.ts:367](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/x402/ucai/types.ts#L367) |
| <a id="transactionhash-2"></a> `transactionHash` | `` `0x${string}` `` | Transaction hash that caused the change | [defi/protocols/src/x402/ucai/types.ts:365](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/x402/ucai/types.ts#L365) |

***

### HistoricalTransaction

Defined in: [defi/protocols/src/x402/ucai/types.ts:317](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/x402/ucai/types.ts#L317)

#### Properties

| Property | Type | Description | Defined in |
| :------ | :------ | :------ | :------ |
| <a id="args-2"></a> `args?` | `unknown`[] | Function arguments | [defi/protocols/src/x402/ucai/types.ts:333](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/x402/ucai/types.ts#L333) |
| <a id="blocknumber-2"></a> `blockNumber` | `bigint` | Block number | [defi/protocols/src/x402/ucai/types.ts:321](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/x402/ucai/types.ts#L321) |
| <a id="from"></a> `from` | `` `0x${string}` `` | From address | [defi/protocols/src/x402/ucai/types.ts:325](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/x402/ucai/types.ts#L325) |
| <a id="functionname-1"></a> `functionName?` | `string` | Function called | [defi/protocols/src/x402/ucai/types.ts:331](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/x402/ucai/types.ts#L331) |
| <a id="gasused"></a> `gasUsed` | `bigint` | Gas used | [defi/protocols/src/x402/ucai/types.ts:335](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/x402/ucai/types.ts#L335) |
| <a id="hash"></a> `hash` | `` `0x${string}` `` | Transaction hash | [defi/protocols/src/x402/ucai/types.ts:319](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/x402/ucai/types.ts#L319) |
| <a id="status"></a> `status` | `"failed"` \| `"success"` | Transaction status | [defi/protocols/src/x402/ucai/types.ts:337](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/x402/ucai/types.ts#L337) |
| <a id="timestamp-2"></a> `timestamp` | `number` | Timestamp | [defi/protocols/src/x402/ucai/types.ts:323](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/x402/ucai/types.ts#L323) |
| <a id="to"></a> `to` | `` `0x${string}` `` | To address | [defi/protocols/src/x402/ucai/types.ts:327](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/x402/ucai/types.ts#L327) |
| <a id="value"></a> `value` | `bigint` | Value in wei | [defi/protocols/src/x402/ucai/types.ts:329](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/x402/ucai/types.ts#L329) |

***

### NativeTransfer

Defined in: [defi/protocols/src/x402/ucai/types.ts:275](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/x402/ucai/types.ts#L275)

#### Properties

| Property | Type | Description | Defined in |
| :------ | :------ | :------ | :------ |
| <a id="amount"></a> `amount` | `bigint` | Amount in wei | [defi/protocols/src/x402/ucai/types.ts:281](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/x402/ucai/types.ts#L281) |
| <a id="formattedamount"></a> `formattedAmount` | `string` | Human-readable amount | [defi/protocols/src/x402/ucai/types.ts:283](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/x402/ucai/types.ts#L283) |
| <a id="from-1"></a> `from` | `` `0x${string}` `` | Sender | [defi/protocols/src/x402/ucai/types.ts:277](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/x402/ucai/types.ts#L277) |
| <a id="to-1"></a> `to` | `` `0x${string}` `` | Recipient | [defi/protocols/src/x402/ucai/types.ts:279](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/x402/ucai/types.ts#L279) |

***

### OwnershipInfo

Defined in: [defi/protocols/src/x402/ucai/types.ts:132](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/x402/ucai/types.ts#L132)

#### Properties

| Property | Type | Description | Defined in |
| :------ | :------ | :------ | :------ |
| <a id="hasdangerouspermissions"></a> `hasDangerousPermissions` | `boolean` | Whether owner has dangerous permissions | [defi/protocols/src/x402/ucai/types.ts:142](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/x402/ucai/types.ts#L142) |
| <a id="hastimelock"></a> `hasTimelock` | `boolean` | Whether there's a timelock | [defi/protocols/src/x402/ucai/types.ts:138](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/x402/ucai/types.ts#L138) |
| <a id="isrenounced"></a> `isRenounced` | `boolean` | Whether ownership is renounced | [defi/protocols/src/x402/ucai/types.ts:136](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/x402/ucai/types.ts#L136) |
| <a id="owner"></a> `owner` | `` `0x${string}` `` | Owner address | [defi/protocols/src/x402/ucai/types.ts:134](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/x402/ucai/types.ts#L134) |
| <a id="permissions"></a> `permissions` | `string`[] | List of owner permissions | [defi/protocols/src/x402/ucai/types.ts:144](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/x402/ucai/types.ts#L144) |
| <a id="timelockduration"></a> `timelockDuration?` | `number` | Timelock duration in seconds | [defi/protocols/src/x402/ucai/types.ts:140](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/x402/ucai/types.ts#L140) |

***

### RugIndicator

Defined in: [defi/protocols/src/x402/ucai/types.ts:173](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/x402/ucai/types.ts#L173)

#### Properties

| Property | Type | Description | Defined in |
| :------ | :------ | :------ | :------ |
| <a id="description-2"></a> `description` | `string` | Description | [defi/protocols/src/x402/ucai/types.ts:179](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/x402/ucai/types.ts#L179) |
| <a id="evidence"></a> `evidence?` | `string` | Evidence supporting this indicator | [defi/protocols/src/x402/ucai/types.ts:181](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/x402/ucai/types.ts#L181) |
| <a id="risk"></a> `risk` | `"low"` \| `"medium"` \| `"high"` \| `"critical"` | Risk level | [defi/protocols/src/x402/ucai/types.ts:177](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/x402/ucai/types.ts#L177) |
| <a id="type-2"></a> `type` | `string` | Indicator type | [defi/protocols/src/x402/ucai/types.ts:175](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/x402/ucai/types.ts#L175) |

***

### RugPullIndicators

Defined in: [defi/protocols/src/x402/ucai/types.ts:147](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/x402/ucai/types.ts#L147)

#### Properties

| Property | Type | Description | Defined in |
| :------ | :------ | :------ | :------ |
| <a id="buytax"></a> `buyTax?` | `number` | Buy/sell tax percentage | [defi/protocols/src/x402/ucai/types.ts:161](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/x402/ucai/types.ts#L161) |
| <a id="canpausetrading"></a> `canPauseTrading` | `boolean` | Can trading be paused? | [defi/protocols/src/x402/ucai/types.ts:155](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/x402/ucai/types.ts#L155) |
| <a id="contractagedays"></a> `contractAgeDays` | `number` | Contract age in days | [defi/protocols/src/x402/ucai/types.ts:168](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/x402/ucai/types.ts#L168) |
| <a id="hasblacklist"></a> `hasBlacklist` | `boolean` | Are there blacklist functions? | [defi/protocols/src/x402/ucai/types.ts:157](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/x402/ucai/types.ts#L157) |
| <a id="hashiddenowner"></a> `hasHiddenOwner` | `boolean` | Is there a hidden owner? | [defi/protocols/src/x402/ucai/types.ts:159](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/x402/ucai/types.ts#L159) |
| <a id="hasunlimitedmint"></a> `hasUnlimitedMint` | `boolean` | Can owner mint unlimited tokens? | [defi/protocols/src/x402/ucai/types.ts:153](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/x402/ucai/types.ts#L153) |
| <a id="indicators"></a> `indicators` | [`RugIndicator`](/docs/api/defi/protocols/src/x402/ucai/types.md#rugindicator)[] | Detailed indicators | [defi/protocols/src/x402/ucai/types.ts:170](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/x402/ucai/types.ts#L170) |
| <a id="ishoneypot"></a> `isHoneypot` | `boolean` | Is this likely a honeypot? | [defi/protocols/src/x402/ucai/types.ts:151](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/x402/ucai/types.ts#L151) |
| <a id="liquiditylocked"></a> `liquidityLocked` | `boolean` | Is liquidity locked? | [defi/protocols/src/x402/ucai/types.ts:164](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/x402/ucai/types.ts#L164) |
| <a id="lockduration"></a> `lockDuration?` | `number` | Liquidity lock duration | [defi/protocols/src/x402/ucai/types.ts:166](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/x402/ucai/types.ts#L166) |
| <a id="riskscore"></a> `riskScore` | `number` | Overall rug pull risk score (0-100) | [defi/protocols/src/x402/ucai/types.ts:149](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/x402/ucai/types.ts#L149) |
| <a id="selltax"></a> `sellTax?` | `number` | - | [defi/protocols/src/x402/ucai/types.ts:162](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/x402/ucai/types.ts#L162) |

***

### SecurityAuditResult

Defined in: [defi/protocols/src/x402/ucai/types.ts:98](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/x402/ucai/types.ts#L98)

#### Properties

| Property | Type | Description | Defined in |
| :------ | :------ | :------ | :------ |
| <a id="implementationaddress"></a> `implementationAddress?` | `` `0x${string}` `` | Proxy implementation address if applicable | [defi/protocols/src/x402/ucai/types.ts:110](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/x402/ucai/types.ts#L110) |
| <a id="isproxy"></a> `isProxy` | `boolean` | Whether contract is a proxy | [defi/protocols/src/x402/ucai/types.ts:108](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/x402/ucai/types.ts#L108) |
| <a id="ownership"></a> `ownership` | [`OwnershipInfo`](/docs/api/defi/protocols/src/x402/ucai/types.md#ownershipinfo) | Ownership information | [defi/protocols/src/x402/ucai/types.ts:106](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/x402/ucai/types.ts#L106) |
| <a id="recommendations"></a> `recommendations` | `string`[] | Audit recommendations | [defi/protocols/src/x402/ucai/types.ts:114](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/x402/ucai/types.ts#L114) |
| <a id="risklevel"></a> `riskLevel` | `"safe"` \| `"low"` \| `"medium"` \| `"high"` \| `"critical"` | Risk level classification | [defi/protocols/src/x402/ucai/types.ts:102](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/x402/ucai/types.ts#L102) |
| <a id="securityscore"></a> `securityScore` | `number` | Overall security score (0-100) | [defi/protocols/src/x402/ucai/types.ts:100](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/x402/ucai/types.ts#L100) |
| <a id="verified"></a> `verified` | `boolean` | Contract verification status | [defi/protocols/src/x402/ucai/types.ts:112](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/x402/ucai/types.ts#L112) |
| <a id="vulnerabilities"></a> `vulnerabilities` | [`Vulnerability`](/docs/api/defi/protocols/src/x402/ucai/types.md#vulnerability)[] | List of vulnerabilities found | [defi/protocols/src/x402/ucai/types.ts:104](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/x402/ucai/types.ts#L104) |

***

### SimulatedEvent

Defined in: [defi/protocols/src/x402/ucai/types.ts:245](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/x402/ucai/types.ts#L245)

#### Properties

| Property | Type | Description | Defined in |
| :------ | :------ | :------ | :------ |
| <a id="address"></a> `address` | `` `0x${string}` `` | Contract that emits the event | [defi/protocols/src/x402/ucai/types.ts:247](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/x402/ucai/types.ts#L247) |
| <a id="args-3"></a> `args` | `Record`\<`string`, `unknown`\> | Decoded event data | [defi/protocols/src/x402/ucai/types.ts:255](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/x402/ucai/types.ts#L255) |
| <a id="name-2"></a> `name` | `string` | Event name | [defi/protocols/src/x402/ucai/types.ts:249](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/x402/ucai/types.ts#L249) |
| <a id="signature-1"></a> `signature` | `string` | Event signature | [defi/protocols/src/x402/ucai/types.ts:251](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/x402/ucai/types.ts#L251) |
| <a id="topics-1"></a> `topics` | `` `0x${string}` ``[] | Event topics | [defi/protocols/src/x402/ucai/types.ts:253](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/x402/ucai/types.ts#L253) |

***

### SimulationRequest

Defined in: [defi/protocols/src/x402/ucai/types.ts:188](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/x402/ucai/types.ts#L188)

#### Properties

| Property | Type | Description | Defined in |
| :------ | :------ | :------ | :------ |
| <a id="abi-2"></a> `abi` | `unknown`[] | Contract ABI | [defi/protocols/src/x402/ucai/types.ts:196](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/x402/ucai/types.ts#L196) |
| <a id="args-4"></a> `args` | `unknown`[] | Function arguments | [defi/protocols/src/x402/ucai/types.ts:194](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/x402/ucai/types.ts#L194) |
| <a id="contractaddress-5"></a> `contractAddress` | `` `0x${string}` `` | Contract address | [defi/protocols/src/x402/ucai/types.ts:190](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/x402/ucai/types.ts#L190) |
| <a id="from-2"></a> `from` | `` `0x${string}` `` | Sender address | [defi/protocols/src/x402/ucai/types.ts:198](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/x402/ucai/types.ts#L198) |
| <a id="functionname-2"></a> `functionName` | `string` | Function to simulate | [defi/protocols/src/x402/ucai/types.ts:192](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/x402/ucai/types.ts#L192) |
| <a id="network-5"></a> `network` | `string` | Network to simulate on | [defi/protocols/src/x402/ucai/types.ts:202](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/x402/ucai/types.ts#L202) |
| <a id="value-1"></a> `value?` | `bigint` | Value to send (in wei) | [defi/protocols/src/x402/ucai/types.ts:200](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/x402/ucai/types.ts#L200) |

***

### SimulationResult

Defined in: [defi/protocols/src/x402/ucai/types.ts:205](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/x402/ucai/types.ts#L205)

#### Properties

| Property | Type | Description | Defined in |
| :------ | :------ | :------ | :------ |
| <a id="decodedreturn"></a> `decodedReturn?` | `unknown` | Decoded return value | [defi/protocols/src/x402/ucai/types.ts:211](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/x402/ucai/types.ts#L211) |
| <a id="error-1"></a> `error?` | `string` | Error message if simulation fails | [defi/protocols/src/x402/ucai/types.ts:225](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/x402/ucai/types.ts#L225) |
| <a id="events-1"></a> `events` | [`SimulatedEvent`](/docs/api/defi/protocols/src/x402/ucai/types.md#simulatedevent)[] | Events that would be emitted | [defi/protocols/src/x402/ucai/types.ts:219](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/x402/ucai/types.ts#L219) |
| <a id="gaslimit"></a> `gasLimit` | `bigint` | Gas limit recommendation | [defi/protocols/src/x402/ucai/types.ts:215](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/x402/ucai/types.ts#L215) |
| <a id="gasused-1"></a> `gasUsed` | `bigint` | Gas used | [defi/protocols/src/x402/ucai/types.ts:213](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/x402/ucai/types.ts#L213) |
| <a id="nativetransfers"></a> `nativeTransfers` | [`NativeTransfer`](/docs/api/defi/protocols/src/x402/ucai/types.md#nativetransfer)[] | ETH/native transfers | [defi/protocols/src/x402/ucai/types.ts:223](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/x402/ucai/types.ts#L223) |
| <a id="returnvalue"></a> `returnValue?` | `unknown` | Return value from the function | [defi/protocols/src/x402/ucai/types.ts:209](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/x402/ucai/types.ts#L209) |
| <a id="revertreason"></a> `revertReason?` | `string` | Error reason/revert message | [defi/protocols/src/x402/ucai/types.ts:227](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/x402/ucai/types.ts#L227) |
| <a id="statechanges-1"></a> `stateChanges` | [`StateChange`](/docs/api/defi/protocols/src/x402/ucai/types.md#statechange)[] | State changes that would occur | [defi/protocols/src/x402/ucai/types.ts:217](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/x402/ucai/types.ts#L217) |
| <a id="success-1"></a> `success` | `boolean` | Whether the transaction would succeed | [defi/protocols/src/x402/ucai/types.ts:207](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/x402/ucai/types.ts#L207) |
| <a id="tokentransfers"></a> `tokenTransfers` | [`TokenTransfer`](/docs/api/defi/protocols/src/x402/ucai/types.md#tokentransfer)[] | Token transfers that would occur | [defi/protocols/src/x402/ucai/types.ts:221](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/x402/ucai/types.ts#L221) |
| <a id="warnings-1"></a> `warnings` | `string`[] | Warnings about the transaction | [defi/protocols/src/x402/ucai/types.ts:229](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/x402/ucai/types.ts#L229) |

***

### StateChange

Defined in: [defi/protocols/src/x402/ucai/types.ts:232](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/x402/ucai/types.ts#L232)

#### Properties

| Property | Type | Description | Defined in |
| :------ | :------ | :------ | :------ |
| <a id="contract"></a> `contract` | `` `0x${string}` `` | Contract address being modified | [defi/protocols/src/x402/ucai/types.ts:234](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/x402/ucai/types.ts#L234) |
| <a id="description-3"></a> `description?` | `string` | Human-readable description | [defi/protocols/src/x402/ucai/types.ts:242](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/x402/ucai/types.ts#L242) |
| <a id="newvalue-1"></a> `newValue` | `` `0x${string}` `` | New value | [defi/protocols/src/x402/ucai/types.ts:240](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/x402/ucai/types.ts#L240) |
| <a id="previousvalue-1"></a> `previousValue` | `` `0x${string}` `` | Previous value | [defi/protocols/src/x402/ucai/types.ts:238](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/x402/ucai/types.ts#L238) |
| <a id="slot-1"></a> `slot` | `` `0x${string}` `` | Storage slot being modified | [defi/protocols/src/x402/ucai/types.ts:236](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/x402/ucai/types.ts#L236) |

***

### SubscriptionLimits

Defined in: [defi/protocols/src/x402/ucai/types.ts:521](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/x402/ucai/types.ts#L521)

#### Properties

| Property | Type | Description | Defined in |
| :------ | :------ | :------ | :------ |
| <a id="abigenerations"></a> `abiGenerations` | `number` | Max ABI generations per month | [defi/protocols/src/x402/ucai/types.ts:529](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/x402/ucai/types.ts#L529) |
| <a id="contractanalyses"></a> `contractAnalyses` | `number` | Max contract analyses per month | [defi/protocols/src/x402/ucai/types.ts:523](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/x402/ucai/types.ts#L523) |
| <a id="gassponsorshipusd"></a> `gasSponsorshipUsd` | `string` | Max gas sponsorship USD per month | [defi/protocols/src/x402/ucai/types.ts:531](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/x402/ucai/types.ts#L531) |
| <a id="historicalqueries"></a> `historicalQueries` | `number` | Max historical queries per month | [defi/protocols/src/x402/ucai/types.ts:527](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/x402/ucai/types.ts#L527) |
| <a id="simulations"></a> `simulations` | `number` | Max simulations per month | [defi/protocols/src/x402/ucai/types.ts:525](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/x402/ucai/types.ts#L525) |

***

### TokenTransfer

Defined in: [defi/protocols/src/x402/ucai/types.ts:258](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/x402/ucai/types.ts#L258)

#### Properties

| Property | Type | Description | Defined in |
| :------ | :------ | :------ | :------ |
| <a id="amount-1"></a> `amount` | `bigint` | Amount transferred | [defi/protocols/src/x402/ucai/types.ts:270](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/x402/ucai/types.ts#L270) |
| <a id="decimals"></a> `decimals?` | `number` | Token decimals | [defi/protocols/src/x402/ucai/types.ts:264](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/x402/ucai/types.ts#L264) |
| <a id="formattedamount-1"></a> `formattedAmount?` | `string` | Human-readable amount | [defi/protocols/src/x402/ucai/types.ts:272](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/x402/ucai/types.ts#L272) |
| <a id="from-3"></a> `from` | `` `0x${string}` `` | Sender | [defi/protocols/src/x402/ucai/types.ts:266](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/x402/ucai/types.ts#L266) |
| <a id="symbol"></a> `symbol?` | `string` | Token symbol | [defi/protocols/src/x402/ucai/types.ts:262](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/x402/ucai/types.ts#L262) |
| <a id="to-2"></a> `to` | `` `0x${string}` `` | Recipient | [defi/protocols/src/x402/ucai/types.ts:268](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/x402/ucai/types.ts#L268) |
| <a id="token"></a> `token` | `` `0x${string}` `` | Token contract address | [defi/protocols/src/x402/ucai/types.ts:260](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/x402/ucai/types.ts#L260) |

***

### UCAPPaymentConfig

Defined in: [defi/protocols/src/x402/ucai/types.ts:485](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/x402/ucai/types.ts#L485)

#### Properties

| Property | Type | Description | Defined in |
| :------ | :------ | :------ | :------ |
| <a id="acceptedtokens"></a> `acceptedTokens` | `` `0x${string}` ``[] | Accepted tokens for payment | [defi/protocols/src/x402/ucai/types.ts:493](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/x402/ucai/types.ts#L493) |
| <a id="defaulttoken"></a> `defaultToken` | `` `0x${string}` `` | Default token for payments | [defi/protocols/src/x402/ucai/types.ts:495](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/x402/ucai/types.ts#L495) |
| <a id="paymentchanneladdress"></a> `paymentChannelAddress` | `` `0x${string}` `` | X402 payment channel address | [defi/protocols/src/x402/ucai/types.ts:487](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/x402/ucai/types.ts#L487) |
| <a id="paymentnetwork"></a> `paymentNetwork` | `string` | Network for payments | [defi/protocols/src/x402/ucai/types.ts:497](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/x402/ucai/types.ts#L497) |
| <a id="subscriptionaddress"></a> `subscriptionAddress` | `` `0x${string}` `` | X402 subscription contract address | [defi/protocols/src/x402/ucai/types.ts:489](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/x402/ucai/types.ts#L489) |
| <a id="toolregistryaddress"></a> `toolRegistryAddress` | `` `0x${string}` `` | Tool registry address | [defi/protocols/src/x402/ucai/types.ts:491](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/x402/ucai/types.ts#L491) |

***

### UCAPSubscription

Defined in: [defi/protocols/src/x402/ucai/types.ts:500](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/x402/ucai/types.ts#L500)

#### Properties

| Property | Type | Description | Defined in |
| :------ | :------ | :------ | :------ |
| <a id="expiresat"></a> `expiresAt` | `number` | Expiry timestamp | [defi/protocols/src/x402/ucai/types.ts:512](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/x402/ucai/types.ts#L512) |
| <a id="features"></a> `features` | `string`[] | Features included | [defi/protocols/src/x402/ucai/types.ts:514](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/x402/ucai/types.ts#L514) |
| <a id="id"></a> `id` | `string` | Subscription ID | [defi/protocols/src/x402/ucai/types.ts:502](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/x402/ucai/types.ts#L502) |
| <a id="limits"></a> `limits` | [`SubscriptionLimits`](/docs/api/defi/protocols/src/x402/ucai/types.md#subscriptionlimits) | Usage limits | [defi/protocols/src/x402/ucai/types.ts:516](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/x402/ucai/types.ts#L516) |
| <a id="priceusd"></a> `priceUsd` | `string` | Monthly price in USD | [defi/protocols/src/x402/ucai/types.ts:508](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/x402/ucai/types.ts#L508) |
| <a id="startedat"></a> `startedAt` | `number` | Start timestamp | [defi/protocols/src/x402/ucai/types.ts:510](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/x402/ucai/types.ts#L510) |
| <a id="subscriber"></a> `subscriber` | `` `0x${string}` `` | Subscriber address | [defi/protocols/src/x402/ucai/types.ts:504](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/x402/ucai/types.ts#L504) |
| <a id="tier"></a> `tier` | [`SubscriptionTier`](/docs/api/defi/protocols/src/x402/ucai/types.md#subscriptiontier) | Subscription tier | [defi/protocols/src/x402/ucai/types.ts:506](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/x402/ucai/types.ts#L506) |

***

### UCAPTool

Defined in: [defi/protocols/src/x402/ucai/types.ts:569](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/x402/ucai/types.ts#L569)

#### Properties

| Property | Type | Description | Defined in |
| :------ | :------ | :------ | :------ |
| <a id="category"></a> `category` | [`ToolCategory`](/docs/api/defi/protocols/src/x402/ucai/types.md#toolcategory) | Tool category | [defi/protocols/src/x402/ucai/types.ts:583](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/x402/ucai/types.ts#L583) |
| <a id="description-4"></a> `description` | `string` | Tool description | [defi/protocols/src/x402/ucai/types.ts:575](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/x402/ucai/types.ts#L575) |
| <a id="enabled"></a> `enabled` | `boolean` | Whether tool is enabled | [defi/protocols/src/x402/ucai/types.ts:581](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/x402/ucai/types.ts#L581) |
| <a id="id-1"></a> `id` | `string` | Tool ID | [defi/protocols/src/x402/ucai/types.ts:571](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/x402/ucai/types.ts#L571) |
| <a id="name-3"></a> `name` | `string` | Tool name | [defi/protocols/src/x402/ucai/types.ts:573](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/x402/ucai/types.ts#L573) |
| <a id="priceusd-1"></a> `priceUsd` | `string` | Price per use in USD | [defi/protocols/src/x402/ucai/types.ts:577](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/x402/ucai/types.ts#L577) |
| <a id="requiredtier"></a> `requiredTier` | \| [`SubscriptionTier`](/docs/api/defi/protocols/src/x402/ucai/types.md#subscriptiontier) \| `null` | Required subscription tier (null = pay-per-use) | [defi/protocols/src/x402/ucai/types.ts:579](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/x402/ucai/types.ts#L579) |

***

### Vulnerability

Defined in: [defi/protocols/src/x402/ucai/types.ts:117](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/x402/ucai/types.ts#L117)

#### Properties

| Property | Type | Description | Defined in |
| :------ | :------ | :------ | :------ |
| <a id="description-5"></a> `description` | `string` | Description of the vulnerability | [defi/protocols/src/x402/ucai/types.ts:123](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/x402/ucai/types.ts#L123) |
| <a id="impact"></a> `impact` | `string` | Potential impact | [defi/protocols/src/x402/ucai/types.ts:127](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/x402/ucai/types.ts#L127) |
| <a id="location"></a> `location?` | `string` | Affected function or code location | [defi/protocols/src/x402/ucai/types.ts:125](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/x402/ucai/types.ts#L125) |
| <a id="recommendation"></a> `recommendation` | `string` | Recommended fix | [defi/protocols/src/x402/ucai/types.ts:129](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/x402/ucai/types.ts#L129) |
| <a id="severity"></a> `severity` | `"low"` \| `"medium"` \| `"high"` \| `"critical"` \| `"info"` | Severity level | [defi/protocols/src/x402/ucai/types.ts:121](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/x402/ucai/types.ts#L121) |
| <a id="type-3"></a> `type` | `string` | Vulnerability type | [defi/protocols/src/x402/ucai/types.ts:119](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/x402/ucai/types.ts#L119) |

## Type Aliases

### AnalysisType

```ts
type AnalysisType = 
  | "security_audit"
  | "rug_pull_detection"
  | "contract_verification"
  | "ownership_analysis"
  | "proxy_detection"
  | "token_analysis"
  | "full_audit";
```

Defined in: [defi/protocols/src/x402/ucai/types.ts:89](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/x402/ucai/types.ts#L89)

***

### ContractStandard

```ts
type ContractStandard = 
  | "ERC20"
  | "ERC721"
  | "ERC1155"
  | "ERC777"
  | "ERC4626"
  | "Ownable"
  | "Pausable"
  | "AccessControl"
  | "Upgradeable"
  | "Proxy"
  | "Timelock"
  | "Governor"
  | "Unknown";
```

Defined in: [defi/protocols/src/x402/ucai/types.ts:466](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/x402/ucai/types.ts#L466)

***

### HistoricalDataType

```ts
type HistoricalDataType = 
  | "transactions"
  | "event_logs"
  | "state_changes"
  | "balance_history"
  | "function_calls";
```

Defined in: [defi/protocols/src/x402/ucai/types.ts:310](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/x402/ucai/types.ts#L310)

***

### SubscriptionTier

```ts
type SubscriptionTier = "free" | "basic" | "pro" | "enterprise";
```

Defined in: [defi/protocols/src/x402/ucai/types.ts:519](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/x402/ucai/types.ts#L519)

***

### ToolCategory

```ts
type ToolCategory = 
  | "gas_sponsorship"
  | "security_analysis"
  | "simulation"
  | "historical_data"
  | "abi_tools"
  | "contract_interaction";
```

Defined in: [defi/protocols/src/x402/ucai/types.ts:586](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/x402/ucai/types.ts#L586)

## Variables

### SUBSCRIPTION\_TIERS

```ts
const SUBSCRIPTION_TIERS: Record<SubscriptionTier, SubscriptionLimits>;
```

Defined in: [defi/protocols/src/x402/ucai/types.ts:534](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/x402/ucai/types.ts#L534)

***

### UCAI\_PRICING

```ts
const UCAI_PRICING: {
  ABI_GENERATION: "0.10";
  CONTRACT_ANALYSIS: "0.05";
  GAS_SPONSORSHIP_FEE: "0.10";
  HISTORICAL_DATA: "0.02";
  TRANSACTION_SIMULATION: "0.01";
};
```

Defined in: [defi/protocols/src/x402/ucai/types.ts:14](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/x402/ucai/types.ts#L14)

#### Type Declaration

| Name | Type | Default value | Description | Defined in |
| :------ | :------ | :------ | :------ | :------ |
| <a id="abi_generation"></a> `ABI_GENERATION` | `"0.10"` | `"0.10"` | Custom ABI generation from unverified contracts | [defi/protocols/src/x402/ucai/types.ts:22](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/x402/ucai/types.ts#L22) |
| <a id="contract_analysis"></a> `CONTRACT_ANALYSIS` | `"0.05"` | `"0.05"` | Premium contract analysis - security audit, rug pull detection | [defi/protocols/src/x402/ucai/types.ts:16](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/x402/ucai/types.ts#L16) |
| <a id="gas_sponsorship_fee"></a> `GAS_SPONSORSHIP_FEE` | `"0.10"` | `"0.10"` | Gas sponsorship base fee (percentage of gas cost) | [defi/protocols/src/x402/ucai/types.ts:24](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/x402/ucai/types.ts#L24) |
| <a id="historical_data"></a> `HISTORICAL_DATA` | `"0.02"` | `"0.02"` | Historical contract data query | [defi/protocols/src/x402/ucai/types.ts:20](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/x402/ucai/types.ts#L20) |
| <a id="transaction_simulation"></a> `TRANSACTION_SIMULATION` | `"0.01"` | `"0.01"` | Transaction simulation before execution | [defi/protocols/src/x402/ucai/types.ts:18](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/x402/ucai/types.ts#L18) |

***

### UCAP\_TOOLS

```ts
const UCAP_TOOLS: UCAPTool[];
```

Defined in: [defi/protocols/src/x402/ucai/types.ts:594](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/x402/ucai/types.ts#L594)
