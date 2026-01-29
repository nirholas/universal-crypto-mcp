/**
 * Token Metadata (Metaplex)
 * Fetch and parse token metadata from on-chain
 */

import { Connection, PublicKey } from '@solana/web3.js';
import { TokenMetadata } from '../types.js';
import { logger } from '../utils/logger.js';

// Metaplex Token Metadata Program ID
const TOKEN_METADATA_PROGRAM_ID = new PublicKey('metaqbxxUerdq28cj1RbAWkYQm3ybzjb6a8bt518x1s');

// Metadata account discriminator
const METADATA_PREFIX = 'metadata';

/**
 * Derive metadata PDA for a mint
 */
export function getMetadataPDA(mint: PublicKey): PublicKey {
  const [pda] = PublicKey.findProgramAddressSync(
    [
      Buffer.from(METADATA_PREFIX),
      TOKEN_METADATA_PROGRAM_ID.toBuffer(),
      mint.toBuffer(),
    ],
    TOKEN_METADATA_PROGRAM_ID
  );
  return pda;
}

/**
 * Derive master edition PDA
 */
export function getMasterEditionPDA(mint: PublicKey): PublicKey {
  const [pda] = PublicKey.findProgramAddressSync(
    [
      Buffer.from(METADATA_PREFIX),
      TOKEN_METADATA_PROGRAM_ID.toBuffer(),
      mint.toBuffer(),
      Buffer.from('edition'),
    ],
    TOKEN_METADATA_PROGRAM_ID
  );
  return pda;
}

/**
 * Parse metadata from account data
 */
function parseMetadata(data: Buffer, mint: PublicKey): Omit<TokenMetadata, 'image' | 'description' | 'attributes'> | null {
  try {
    // Skip discriminator (1 byte) and update authority (32 bytes)
    let offset = 1 + 32;
    
    // Read mint (32 bytes)
    offset += 32;
    
    // Read name
    const nameLength = data.readUInt32LE(offset);
    offset += 4;
    const name = data.slice(offset, offset + nameLength).toString('utf8').replace(/\0/g, '').trim();
    offset += nameLength;
    
    // Read symbol
    const symbolLength = data.readUInt32LE(offset);
    offset += 4;
    const symbol = data.slice(offset, offset + symbolLength).toString('utf8').replace(/\0/g, '').trim();
    offset += symbolLength;
    
    // Read URI
    const uriLength = data.readUInt32LE(offset);
    offset += 4;
    const uri = data.slice(offset, offset + uriLength).toString('utf8').replace(/\0/g, '').trim();
    
    return {
      mint,
      name,
      symbol,
      uri,
      decimals: 0, // Will be filled in by caller if needed
    };
  } catch (error) {
    logger.debug('Failed to parse metadata', { error: (error as Error).message });
    return null;
  }
}

/**
 * Fetch token metadata from on-chain
 */
export async function getTokenMetadata(
  connection: Connection,
  mint: PublicKey
): Promise<TokenMetadata | null> {
  try {
    const metadataPDA = getMetadataPDA(mint);
    const accountInfo = await connection.getAccountInfo(metadataPDA);
    
    if (!accountInfo) {
      logger.debug('No metadata account found', { mint: mint.toBase58() });
      return null;
    }
    
    const metadata = parseMetadata(accountInfo.data, mint);
    if (!metadata) {
      return null;
    }
    
    // Try to fetch off-chain metadata from URI
    if (metadata.uri) {
      try {
        const offChainMetadata = await fetchOffChainMetadata(metadata.uri);
        return {
          ...metadata,
          image: offChainMetadata?.image,
          description: offChainMetadata?.description,
          attributes: offChainMetadata?.attributes,
        };
      } catch (error) {
        logger.debug('Failed to fetch off-chain metadata', { uri: metadata.uri });
      }
    }
    
    return metadata;
  } catch (error) {
    logger.debug('Failed to get token metadata', { 
      mint: mint.toBase58(), 
      error: (error as Error).message 
    });
    return null;
  }
}

/**
 * Fetch multiple token metadata in parallel
 */
export async function getMultipleTokenMetadata(
  connection: Connection,
  mints: PublicKey[]
): Promise<Map<string, TokenMetadata | null>> {
  const results = new Map<string, TokenMetadata | null>();
  
  // Get all metadata PDAs
  const metadataPDAs = mints.map(mint => ({
    mint,
    pda: getMetadataPDA(mint),
  }));
  
  // Fetch all accounts in batches
  const batchSize = 100;
  for (let i = 0; i < metadataPDAs.length; i += batchSize) {
    const batch = metadataPDAs.slice(i, i + batchSize);
    const pdas = batch.map(b => b.pda);
    
    const accounts = await connection.getMultipleAccountsInfo(pdas);
    
    for (let j = 0; j < batch.length; j++) {
      const batchItem = batch[j];
      if (!batchItem) continue;
      
      const { mint } = batchItem;
      const accountInfo = accounts[j];
      
      if (accountInfo) {
        const metadata = parseMetadata(accountInfo.data, mint);
        results.set(mint.toBase58(), metadata);
      } else {
        results.set(mint.toBase58(), null);
      }
    }
  }
  
  return results;
}

/**
 * Fetch off-chain metadata from URI
 */
async function fetchOffChainMetadata(uri: string): Promise<{
  image?: string;
  description?: string;
  attributes?: Array<{ trait_type: string; value: string }>;
} | null> {
  try {
    // Handle IPFS URIs
    let fetchUri = uri;
    if (uri.startsWith('ipfs://')) {
      fetchUri = `https://ipfs.io/ipfs/${uri.slice(7)}`;
    }
    
    // Handle Arweave URIs
    if (uri.startsWith('ar://')) {
      fetchUri = `https://arweave.net/${uri.slice(5)}`;
    }
    
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 5000);
    
    const response = await fetch(fetchUri, {
      signal: controller.signal,
      headers: { 'Accept': 'application/json' },
    });
    
    clearTimeout(timeoutId);
    
    if (!response.ok) {
      return null;
    }
    
    const data = await response.json() as {
      image?: string;
      description?: string;
      attributes?: Array<{ trait_type: string; value: string }>;
    };
    
    return {
      image: data.image,
      description: data.description,
      attributes: data.attributes,
    };
  } catch (error) {
    return null;
  }
}

/**
 * Check if a token has metadata
 */
export async function hasMetadata(
  connection: Connection,
  mint: PublicKey
): Promise<boolean> {
  const metadataPDA = getMetadataPDA(mint);
  const accountInfo = await connection.getAccountInfo(metadataPDA);
  return accountInfo !== null;
}

/**
 * Well-known tokens with hardcoded metadata (for faster lookups)
 */
const WELL_KNOWN_TOKENS: Record<string, Omit<TokenMetadata, 'mint'>> = {
  'So11111111111111111111111111111111111111112': {
    name: 'Wrapped SOL',
    symbol: 'SOL',
    uri: '',
    decimals: 9,
    image: 'https://raw.githubusercontent.com/solana-labs/token-list/main/assets/mainnet/So11111111111111111111111111111111111111112/logo.png',
  },
  'EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v': {
    name: 'USD Coin',
    symbol: 'USDC',
    uri: '',
    decimals: 6,
    image: 'https://raw.githubusercontent.com/solana-labs/token-list/main/assets/mainnet/EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v/logo.png',
  },
  'Es9vMFrzaCERmJfrF4H2FYD4KCoNkY11McCe8BenwNYB': {
    name: 'USDT',
    symbol: 'USDT',
    uri: '',
    decimals: 6,
    image: 'https://raw.githubusercontent.com/solana-labs/token-list/main/assets/mainnet/Es9vMFrzaCERmJfrF4H2FYD4KCoNkY11McCe8BenwNYB/logo.png',
  },
  'mSoLzYCxHdYgdzU16g5QSh3i5K3z3KZK7ytfqcJm7So': {
    name: 'Marinade staked SOL',
    symbol: 'mSOL',
    uri: '',
    decimals: 9,
    image: 'https://raw.githubusercontent.com/solana-labs/token-list/main/assets/mainnet/mSoLzYCxHdYgdzU16g5QSh3i5K3z3KZK7ytfqcJm7So/logo.png',
  },
  'DezXAZ8z7PnrnRJjz3wXBoRgixCa6xjnB7YaB1pPB263': {
    name: 'Bonk',
    symbol: 'BONK',
    uri: '',
    decimals: 5,
    image: 'https://arweave.net/hQiPZOsRZXGXBJd_82PhVdlM_hACsT_q6wqwf5cSY7I',
  },
  'JUPyiwrYJFskUPiHa7hkeR8VUtAeFoSYbKedZNsDvCN': {
    name: 'Jupiter',
    symbol: 'JUP',
    uri: '',
    decimals: 6,
    image: 'https://static.jup.ag/jup/icon.png',
  },
};

/**
 * Get token metadata with well-known fallback
 */
export async function getTokenMetadataWithFallback(
  connection: Connection,
  mint: PublicKey
): Promise<TokenMetadata | null> {
  const mintStr = mint.toBase58();
  
  // Check well-known tokens first
  if (WELL_KNOWN_TOKENS[mintStr]) {
    return {
      mint,
      ...WELL_KNOWN_TOKENS[mintStr],
    };
  }
  
  // Fetch from chain
  return getTokenMetadata(connection, mint);
}
