/**
 * MCP Tool: getNFTs
 * Get NFT holdings for a wallet
 */

import { z } from 'zod';
import { alchemyClient } from '../apis/alchemy';
import { type Chain } from '../lib';

export const getNFTsSchema = z.object({
  address: z.string().regex(/^0x[a-fA-F0-9]{40}$/, 'Invalid Ethereum address'),
  chain: z.enum(['ethereum', 'arbitrum', 'base', 'polygon']).default('ethereum'),
  limit: z.number().min(1).max(100).default(20),
});

export type GetNFTsInput = z.infer<typeof getNFTsSchema>;

export interface NFTItem {
  contractAddress: string;
  tokenId: string;
  name: string;
  description?: string;
  imageUrl?: string;
  collection: string;
}

export interface GetNFTsOutput {
  address: string;
  chain: string;
  nfts: NFTItem[];
  totalCount: number;
  collections: Array<{ name: string; count: number }>;
  lastUpdated: string;
}

export const getNFTsDefinition = {
  name: 'getNFTs',
  description:
    'Get NFT holdings for a wallet address including collection information and images',
  inputSchema: {
    type: 'object' as const,
    properties: {
      address: {
        type: 'string',
        description: 'Wallet address (0x...)',
      },
      chain: {
        type: 'string',
        description: 'Blockchain network',
        default: 'ethereum',
        enum: ['ethereum', 'arbitrum', 'base', 'polygon'],
      },
      limit: {
        type: 'number',
        description: 'Maximum number of NFTs to return',
        default: 20,
      },
    },
    required: ['address'],
  },
};

export async function getNFTs(input: GetNFTsInput): Promise<GetNFTsOutput> {
  const { address, chain, limit } = getNFTsSchema.parse(input);

  const rawNFTs = await alchemyClient.getNFTs(address, chain as Chain);

  const nfts: NFTItem[] = rawNFTs.slice(0, limit).map((nft) => ({
    contractAddress: nft.contract.address,
    tokenId: nft.tokenId,
    name: nft.title || `#${nft.tokenId}`,
    description: nft.description || undefined,
    imageUrl: nft.media?.[0]?.gateway || undefined,
    collection: nft.collection?.name || 'Unknown Collection',
  }));

  // Count by collection
  const collectionCounts = new Map<string, number>();
  for (const nft of nfts) {
    const count = collectionCounts.get(nft.collection) || 0;
    collectionCounts.set(nft.collection, count + 1);
  }

  const collections = Array.from(collectionCounts.entries())
    .map(([name, count]) => ({ name, count }))
    .sort((a, b) => b.count - a.count);

  return {
    address,
    chain,
    nfts,
    totalCount: rawNFTs.length,
    collections,
    lastUpdated: new Date().toISOString(),
  };
}
