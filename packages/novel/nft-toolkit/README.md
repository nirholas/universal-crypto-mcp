# Verbwire MCP Server

> Smart contract deployment, NFT minting, and IPFS storage via Verbwire.

## Attribution

**Original Author:** [Verbwire](https://github.com/verbwire)  
**Original Repository:** [verbwire-mcp-server](https://github.com/verbwire/verbwire-mcp-server)  
**License:** MIT

**Integration & Enhancements by:** Nich ([@nichxbt](https://x.com/nichxbt))

## Supported Chains

| Chain | NFT Minting | Contract Deploy | IPFS |
|-------|-------------|-----------------|------|
| Ethereum | ✅ | ✅ | ✅ |
| Polygon | ✅ | ✅ | ✅ |
| Arbitrum | ✅ | ✅ | ✅ |
| Base | ✅ | ✅ | ✅ |
| Optimism | ✅ | ✅ | ✅ |
| BSC | ✅ | ✅ | ✅ |
| Avalanche | ✅ | ✅ | ✅ |

## Features

### From Original Implementation
- ✅ NFT minting (ERC-721, ERC-1155)
- ✅ Smart contract deployment
- ✅ IPFS file storage
- ✅ Metadata management
- ✅ Collection management
- ✅ Multi-chain support

### Our Enhancements (Apache-2.0)
- ✅ Unified API compatibility
- ✅ Batch minting operations
- ✅ Collection analytics
- ✅ Royalty management
- ✅ Airdrop tools

## Installation

```bash
pnpm add @nirholas/verbwire-mcp
```

## Configuration

```bash
export VERBWIRE_API_KEY=your_api_key
```

Get your API key at [Verbwire](https://verbwire.com)

## Usage

### With MCP Server

```typescript
import { registerVerbwireTools } from '@nirholas/verbwire-mcp';
import { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';

const server = new McpServer({ name: 'my-nft-server', version: '1.0.0' });
registerVerbwireTools(server);
```

### Standalone

```typescript
import { VerbwireClient } from '@nirholas/verbwire-mcp';

const client = new VerbwireClient({ apiKey: process.env.VERBWIRE_API_KEY });

// Mint an NFT
const nft = await client.mintNFT({
  chain: 'polygon',
  name: 'My NFT',
  description: 'An amazing NFT',
  imageUrl: 'https://...',
  recipientAddress: '0x...',
});

// Upload to IPFS
const ipfs = await client.uploadToIPFS({
  file: Buffer.from('...'),
  name: 'metadata.json',
});

// Deploy contract
const contract = await client.deployContract({
  chain: 'ethereum',
  name: 'MyCollection',
  symbol: 'MYCOL',
});
```

## Available Tools

| Tool | Description |
|------|-------------|
| `verbwire_mint_nft` | Mint a new NFT |
| `verbwire_mint_batch` | Mint multiple NFTs |
| `verbwire_deploy_contract` | Deploy an NFT contract |
| `verbwire_upload_ipfs` | Upload file to IPFS |
| `verbwire_upload_metadata` | Upload NFT metadata |
| `verbwire_get_nfts` | Get NFTs for an address |
| `verbwire_get_collection` | Get collection details |
| `verbwire_transfer_nft` | Transfer an NFT |

## Example Queries

```
Mint an NFT with this image on Polygon
```

```
Deploy a new NFT collection called "My Art"
```

```
Upload this image to IPFS
```

## License

- Original Implementation: MIT (Verbwire)
- Enhancements: Apache-2.0 (Nich)
