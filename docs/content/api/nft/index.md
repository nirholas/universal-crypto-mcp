---
title: "NFT API Reference"
description: "API documentation for NFT minting, trading, and marketplace packages"
category: "api"
keywords: ["api", "nft", "minting", "marketplace", "opensea", "erc721", "erc1155"]
order: 8
---

# NFT API Reference

NFT packages provide minting, trading, and marketplace integration capabilities.

## Packages

| Package | Description |
|---------|-------------|
| `@nirholas/nft-minting` | NFT creation and minting |
| `@nirholas/nft-trading` | NFT trading operations |
| `@nirholas/nft-marketplace` | Marketplace integrations |
| `@nirholas/nft-metadata` | Metadata handling |
| `@nirholas/nft-ipfs` | IPFS integration |

---

## NFT Minting

### Installation

```bash
pnpm add @nirholas/nft-minting
```

### Configuration

```typescript
import { NFTMinter } from '@nirholas/nft-minting'

const minter = new NFTMinter({
  network: 'ethereum', // or 'polygon', 'base', 'arbitrum'
  privateKey: process.env.PRIVATE_KEY!,
  rpcUrl: process.env.RPC_URL!,
  ipfsGateway: 'https://gateway.pinata.cloud',
  pinataApiKey: process.env.PINATA_API_KEY,
  pinataSecretKey: process.env.PINATA_SECRET_KEY,
})
```

### ERC-721 Minting

#### deployERC721

Deploy a new ERC-721 collection.

```typescript
async function deployERC721(config: ERC721Config): Promise<DeployResult>

interface ERC721Config {
  name: string
  symbol: string
  baseUri?: string
  maxSupply?: number
  royaltyBps?: number          // Basis points (250 = 2.5%)
  royaltyReceiver?: string
  ownerMintAllowed?: boolean
  publicMintAllowed?: boolean
  mintPrice?: string           // ETH
}

interface DeployResult {
  contractAddress: string
  transactionHash: string
  explorerUrl: string
}
```

**Example:**

```typescript
const collection = await minter.deployERC721({
  name: 'My NFT Collection',
  symbol: 'MYNFT',
  maxSupply: 10000,
  royaltyBps: 500, // 5%
  royaltyReceiver: '0x...',
  mintPrice: '0.05',
})

console.log(`Collection deployed: ${collection.contractAddress}`)
```

#### mint

Mint a single NFT.

```typescript
async function mint(params: MintParams): Promise<MintResult>

interface MintParams {
  contractAddress: string
  to: string
  tokenUri?: string
  metadata?: NFTMetadata
}

interface MintResult {
  tokenId: string
  transactionHash: string
  tokenUri: string
  explorerUrl: string
}
```

#### batchMint

Mint multiple NFTs in one transaction.

```typescript
async function batchMint(params: BatchMintParams): Promise<BatchMintResult>

interface BatchMintParams {
  contractAddress: string
  to: string
  count: number
  baseUri?: string
  metadata?: NFTMetadata[]
}
```

---

### ERC-1155 Minting

#### deployERC1155

Deploy a new ERC-1155 collection.

```typescript
async function deployERC1155(config: ERC1155Config): Promise<DeployResult>

interface ERC1155Config {
  uri: string                  // Metadata URI template
  name?: string
  royaltyBps?: number
  royaltyReceiver?: string
}
```

#### mintERC1155

Mint ERC-1155 tokens.

```typescript
async function mintERC1155(params: ERC1155MintParams): Promise<MintResult>

interface ERC1155MintParams {
  contractAddress: string
  to: string
  tokenId: string
  amount: number
  data?: string
}
```

---

### Metadata Handling

```typescript
interface NFTMetadata {
  name: string
  description: string
  image: string                // IPFS URI or URL
  external_url?: string
  animation_url?: string       // For video/audio NFTs
  background_color?: string    // Hex color without #
  attributes?: NFTAttribute[]
  properties?: Record<string, unknown>
}

interface NFTAttribute {
  trait_type: string
  value: string | number
  display_type?: 'number' | 'date' | 'boost_number' | 'boost_percentage'
  max_value?: number
}
```

#### uploadMetadata

Upload metadata to IPFS.

```typescript
async function uploadMetadata(metadata: NFTMetadata): Promise<string>

const tokenUri = await minter.uploadMetadata({
  name: 'Cool NFT #1',
  description: 'A very cool NFT',
  image: 'ipfs://QmXxx...',
  attributes: [
    { trait_type: 'Rarity', value: 'Legendary' },
    { trait_type: 'Power', value: 100, display_type: 'number' },
  ],
})
```

#### uploadImage

Upload an image to IPFS.

```typescript
async function uploadImage(
  file: Buffer | ReadableStream,
  filename: string
): Promise<string>

const imageUri = await minter.uploadImage(
  fs.readFileSync('./image.png'),
  'nft-image.png'
)
```

---

## NFT Trading

### Installation

```bash
pnpm add @nirholas/nft-trading
```

### Configuration

```typescript
import { NFTTrader } from '@nirholas/nft-trading'

const trader = new NFTTrader({
  network: 'ethereum',
  privateKey: process.env.PRIVATE_KEY!,
  rpcUrl: process.env.RPC_URL!,
})
```

### Transfer Operations

#### transfer

Transfer an NFT to another address.

```typescript
async function transfer(params: TransferParams): Promise<TransferResult>

interface TransferParams {
  contractAddress: string
  tokenId: string
  to: string
  tokenType?: 'ERC721' | 'ERC1155'
  amount?: number              // For ERC1155
}
```

#### safeTransfer

Transfer with receiver validation.

```typescript
async function safeTransfer(params: TransferParams): Promise<TransferResult>
```

---

### Approval Management

#### approve

Approve an address to transfer a specific token.

```typescript
async function approve(params: ApproveParams): Promise<ApproveResult>

interface ApproveParams {
  contractAddress: string
  tokenId: string
  operator: string
}
```

#### setApprovalForAll

Approve an operator for all tokens.

```typescript
async function setApprovalForAll(params: ApprovalForAllParams): Promise<void>

interface ApprovalForAllParams {
  contractAddress: string
  operator: string
  approved: boolean
}
```

#### isApprovedForAll

Check if an operator is approved.

```typescript
async function isApprovedForAll(
  contractAddress: string,
  owner: string,
  operator: string
): Promise<boolean>
```

---

### Query Functions

#### getOwner

Get the owner of an NFT.

```typescript
async function getOwner(
  contractAddress: string,
  tokenId: string
): Promise<string>
```

#### getBalance

Get NFT balance for an address.

```typescript
async function getBalance(
  contractAddress: string,
  owner: string,
  tokenId?: string            // Required for ERC1155
): Promise<number>
```

#### getTokenUri

Get the token URI.

```typescript
async function getTokenUri(
  contractAddress: string,
  tokenId: string
): Promise<string>
```

#### getMetadata

Fetch and parse token metadata.

```typescript
async function getMetadata(
  contractAddress: string,
  tokenId: string
): Promise<NFTMetadata>
```

---

## Marketplace Integration

### Installation

```bash
pnpm add @nirholas/nft-marketplace
```

### OpenSea Integration

```typescript
import { OpenSeaClient } from '@nirholas/nft-marketplace'

const opensea = new OpenSeaClient({
  apiKey: process.env.OPENSEA_API_KEY!,
  network: 'ethereum', // or 'polygon'
})
```

#### listForSale

List an NFT for sale.

```typescript
async function listForSale(params: ListingParams): Promise<Listing>

interface ListingParams {
  contractAddress: string
  tokenId: string
  price: string               // In ETH/MATIC
  expirationTime?: number     // Unix timestamp
  currency?: string           // Default: native token
}

interface Listing {
  orderId: string
  orderHash: string
  price: string
  expirationTime: number
  makerAddress: string
}
```

#### cancelListing

Cancel an existing listing.

```typescript
async function cancelListing(orderId: string): Promise<void>
```

#### buyNFT

Purchase an NFT.

```typescript
async function buyNFT(params: BuyParams): Promise<PurchaseResult>

interface BuyParams {
  orderId: string
  // Or
  contractAddress: string
  tokenId: string
}

interface PurchaseResult {
  transactionHash: string
  tokenId: string
  price: string
  explorerUrl: string
}
```

#### makeOffer

Make an offer on an NFT.

```typescript
async function makeOffer(params: OfferParams): Promise<Offer>

interface OfferParams {
  contractAddress: string
  tokenId: string
  price: string
  currency?: string          // WETH by default
  expirationTime?: number
}
```

#### acceptOffer

Accept an offer on your NFT.

```typescript
async function acceptOffer(offerId: string): Promise<PurchaseResult>
```

---

### Collection Queries

#### getCollection

Get collection details.

```typescript
async function getCollection(slug: string): Promise<Collection>

interface Collection {
  slug: string
  name: string
  description: string
  imageUrl: string
  bannerImageUrl: string
  externalUrl: string
  twitterUsername: string
  discordUrl: string
  stats: CollectionStats
  paymentTokens: PaymentToken[]
  royalty: {
    bps: number
    recipient: string
  }
}

interface CollectionStats {
  totalSupply: number
  totalSales: number
  totalVolume: number
  floorPrice: number
  averagePrice: number
  numOwners: number
  marketCap: number
}
```

#### getCollectionNFTs

Get NFTs in a collection.

```typescript
async function getCollectionNFTs(params: CollectionNFTsParams): Promise<NFT[]>

interface CollectionNFTsParams {
  slug: string
  limit?: number
  cursor?: string
  sortBy?: 'price' | 'rarity' | 'tokenId'
  sortDirection?: 'asc' | 'desc'
}

interface NFT {
  tokenId: string
  name: string
  description: string
  imageUrl: string
  animationUrl?: string
  traits: NFTAttribute[]
  rarity?: {
    rank: number
    score: number
  }
  lastSale?: {
    price: string
    currency: string
    timestamp: number
  }
  currentPrice?: string
}
```

#### getFloorPrice

Get collection floor price.

```typescript
async function getFloorPrice(slug: string): Promise<FloorPrice>

interface FloorPrice {
  price: string
  currency: string
  listing: Listing
}
```

---

### User Queries

#### getUserNFTs

Get NFTs owned by a user.

```typescript
async function getUserNFTs(
  address: string,
  options?: UserNFTsOptions
): Promise<NFT[]>

interface UserNFTsOptions {
  collection?: string
  limit?: number
  cursor?: string
}
```

#### getUserListings

Get active listings by a user.

```typescript
async function getUserListings(address: string): Promise<Listing[]>
```

#### getUserOffers

Get offers made by a user.

```typescript
async function getUserOffers(address: string): Promise<Offer[]>
```

---

## IPFS Integration

### Installation

```bash
pnpm add @nirholas/nft-ipfs
```

### IPFS Client

```typescript
import { IPFSClient } from '@nirholas/nft-ipfs'

const ipfs = new IPFSClient({
  provider: 'pinata', // or 'infura', 'nft.storage', 'web3.storage'
  apiKey: process.env.IPFS_API_KEY!,
  apiSecret: process.env.IPFS_API_SECRET,
})
```

#### upload

Upload a file to IPFS.

```typescript
async function upload(
  content: Buffer | ReadableStream | string,
  options?: UploadOptions
): Promise<IPFSResult>

interface UploadOptions {
  filename?: string
  contentType?: string
  pin?: boolean
}

interface IPFSResult {
  cid: string
  uri: string          // ipfs://...
  httpUrl: string      // https://gateway.../ipfs/...
  size: number
}
```

#### uploadDirectory

Upload a directory to IPFS.

```typescript
async function uploadDirectory(
  files: FileEntry[],
  options?: DirectoryOptions
): Promise<IPFSResult>

interface FileEntry {
  path: string
  content: Buffer | string
}
```

#### fetch

Fetch content from IPFS.

```typescript
async function fetch(cid: string): Promise<Buffer>
async function fetchJSON<T>(cid: string): Promise<T>
```

#### pin / unpin

Manage pinned content.

```typescript
async function pin(cid: string): Promise<void>
async function unpin(cid: string): Promise<void>
async function getPins(): Promise<PinInfo[]>
```

---

## Error Types

```typescript
class NFTError extends Error {
  code: string
}

// Minting errors
class DeploymentError extends NFTError {}
class MintError extends NFTError {}
class MaxSupplyReachedError extends NFTError {}
class InsufficientFundsError extends NFTError {}

// Trading errors
class NotOwnerError extends NFTError {}
class NotApprovedError extends NFTError {}
class TransferError extends NFTError {}

// Marketplace errors
class ListingNotFoundError extends NFTError {}
class OfferExpiredError extends NFTError {}
class InsufficientBalanceError extends NFTError {}
class MarketplaceAPIError extends NFTError {}

// IPFS errors
class IPFSUploadError extends NFTError {}
class IPFSFetchError extends NFTError {}
class PinningError extends NFTError {}
```
