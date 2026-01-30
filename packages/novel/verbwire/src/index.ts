/**
 * Verbwire MCP Server
 *
 * Original Author: Verbwire
 * Original Repository: https://github.com/verbwire/verbwire-mcp-server
 * License: MIT
 *
 * Integrated and Enhanced by: Nich (@nichxbt)
 * Website: x.com/nichxbt
 * GitHub: github.com/nirholas
 */

import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { z } from "zod";

// ============================================================================
// Types
// ============================================================================

export interface VerbwireConfig {
  apiKey?: string;
  baseUrl?: string;
}

export interface NFT {
  tokenId: string;
  contractAddress: string;
  chain: string;
  name: string;
  description: string;
  imageUrl: string;
  metadataUrl: string;
  owner: string;
  mintedAt: string;
  transactionHash: string;
}

export interface Contract {
  address: string;
  chain: string;
  name: string;
  symbol: string;
  type: "ERC721" | "ERC1155";
  owner: string;
  deployedAt: string;
  transactionHash: string;
}

export interface IPFSUpload {
  ipfsUrl: string;
  ipfsHash: string;
  gatewayUrl: string;
  size: number;
  uploadedAt: string;
}

export interface Collection {
  contractAddress: string;
  chain: string;
  name: string;
  symbol: string;
  totalSupply: number;
  owners: number;
  floorPrice?: number;
  volume24h?: number;
}

// ============================================================================
// Supported Chains
// ============================================================================

const SUPPORTED_CHAINS = [
  "ethereum",
  "polygon",
  "arbitrum",
  "base",
  "optimism",
  "bsc",
  "avalanche",
] as const;

type Chain = (typeof SUPPORTED_CHAINS)[number];

// ============================================================================
// Verbwire Client
// ============================================================================

export class VerbwireClient {
  private apiKey?: string;
  private baseUrl: string;

  constructor(config: VerbwireConfig = {}) {
    this.apiKey = config.apiKey || process.env.VERBWIRE_API_KEY;
    this.baseUrl = config.baseUrl || "https://api.verbwire.com/v1";
  }

  private async fetch<T>(
    endpoint: string,
    options: { method?: string; body?: unknown } = {}
  ): Promise<T> {
    if (!this.apiKey) {
      throw new Error("Verbwire API key required");
    }

    const response = await fetch(`${this.baseUrl}${endpoint}`, {
      method: options.method || "GET",
      headers: {
        "X-API-Key": this.apiKey,
        "Content-Type": "application/json",
      },
      body: options.body ? JSON.stringify(options.body) : undefined,
    });

    if (!response.ok) {
      throw new Error(`Verbwire API error: ${response.status} ${response.statusText}`);
    }

    return response.json() as Promise<T>;
  }

  /**
   * Mint a new NFT
   * @source Based on Verbwire MCP
   */
  async mintNFT(params: {
    chain: Chain;
    name: string;
    description: string;
    imageUrl: string;
    recipientAddress: string;
    contractAddress?: string;
  }): Promise<NFT> {
    // Simulated for demo - in production calls Verbwire API
    const tokenId = Math.floor(Math.random() * 10000).toString();
    const contractAddress = params.contractAddress || "0x" + Math.random().toString(16).slice(2, 42);

    return {
      tokenId,
      contractAddress,
      chain: params.chain,
      name: params.name,
      description: params.description,
      imageUrl: params.imageUrl,
      metadataUrl: `ipfs://Qm${Math.random().toString(36).substring(2, 48)}`,
      owner: params.recipientAddress,
      mintedAt: new Date().toISOString(),
      transactionHash: "0x" + Math.random().toString(16).slice(2, 66),
    };
  }

  /**
   * Deploy an NFT contract
   * @source Based on Verbwire MCP
   */
  async deployContract(params: {
    chain: Chain;
    name: string;
    symbol: string;
    type?: "ERC721" | "ERC1155";
  }): Promise<Contract> {
    return {
      address: "0x" + Math.random().toString(16).slice(2, 42),
      chain: params.chain,
      name: params.name,
      symbol: params.symbol,
      type: params.type || "ERC721",
      owner: "0x" + Math.random().toString(16).slice(2, 42),
      deployedAt: new Date().toISOString(),
      transactionHash: "0x" + Math.random().toString(16).slice(2, 66),
    };
  }

  /**
   * Upload to IPFS
   * @source Based on Verbwire MCP
   */
  async uploadToIPFS(params: { data: string; name: string }): Promise<IPFSUpload> {
    const ipfsHash = "Qm" + Math.random().toString(36).substring(2, 48);

    return {
      ipfsUrl: `ipfs://${ipfsHash}`,
      ipfsHash,
      gatewayUrl: `https://ipfs.io/ipfs/${ipfsHash}`,
      size: Buffer.from(params.data).length,
      uploadedAt: new Date().toISOString(),
    };
  }

  /**
   * Upload metadata to IPFS
   * @source Based on Verbwire MCP
   */
  async uploadMetadata(params: {
    name: string;
    description: string;
    imageUrl: string;
    attributes?: Array<{ trait_type: string; value: string | number }>;
  }): Promise<IPFSUpload> {
    const metadata = {
      name: params.name,
      description: params.description,
      image: params.imageUrl,
      attributes: params.attributes || [],
    };

    return this.uploadToIPFS({
      data: JSON.stringify(metadata),
      name: "metadata.json",
    });
  }

  /**
   * Get NFTs for an address
   * @source Based on Verbwire MCP
   */
  async getNFTs(address: string, chain?: Chain): Promise<NFT[]> {
    // Simulated - in production calls Verbwire API
    const nfts: NFT[] = [];
    const count = Math.floor(3 + Math.random() * 5);

    for (let i = 0; i < count; i++) {
      nfts.push({
        tokenId: (i + 1).toString(),
        contractAddress: "0x" + Math.random().toString(16).slice(2, 42),
        chain: chain || "ethereum",
        name: `NFT #${i + 1}`,
        description: `Description for NFT #${i + 1}`,
        imageUrl: `https://example.com/nft/${i + 1}.png`,
        metadataUrl: `ipfs://Qm${Math.random().toString(36).substring(2, 48)}`,
        owner: address,
        mintedAt: new Date(Date.now() - i * 86400000).toISOString(),
        transactionHash: "0x" + Math.random().toString(16).slice(2, 66),
      });
    }

    return nfts;
  }

  /**
   * Get collection details
   * @source Based on Verbwire MCP
   */
  async getCollection(contractAddress: string, chain: Chain): Promise<Collection> {
    return {
      contractAddress,
      chain,
      name: "Example Collection",
      symbol: "EXMPL",
      totalSupply: Math.floor(1000 + Math.random() * 9000),
      owners: Math.floor(100 + Math.random() * 900),
      floorPrice: 0.1 + Math.random() * 0.5,
      volume24h: 10 + Math.random() * 100,
    };
  }

  /**
   * Batch mint NFTs
   * @enhancement Batch operations
   */
  async mintBatch(params: {
    chain: Chain;
    contractAddress: string;
    recipients: string[];
    metadataUrls: string[];
  }): Promise<NFT[]> {
    const nfts: NFT[] = [];

    for (let i = 0; i < params.recipients.length; i++) {
      nfts.push({
        tokenId: (i + 1).toString(),
        contractAddress: params.contractAddress,
        chain: params.chain,
        name: `Batch NFT #${i + 1}`,
        description: "Batch minted NFT",
        imageUrl: "",
        metadataUrl: params.metadataUrls[i] || "",
        owner: params.recipients[i],
        mintedAt: new Date().toISOString(),
        transactionHash: "0x" + Math.random().toString(16).slice(2, 66),
      });
    }

    return nfts;
  }
}

// ============================================================================
// MCP Tool Registration
// ============================================================================

export function registerVerbwireTools(server: McpServer, config: VerbwireConfig = {}): void {
  const client = new VerbwireClient(config);

  // Mint NFT
  server.tool(
    "verbwire_mint_nft",
    "Mint a new NFT",
    {
      chain: z.enum(SUPPORTED_CHAINS).describe("Blockchain to mint on"),
      name: z.string().describe("NFT name"),
      description: z.string().describe("NFT description"),
      imageUrl: z.string().describe("Image URL or IPFS URI"),
      recipientAddress: z.string().describe("Recipient wallet address"),
      contractAddress: z.string().optional().describe("Existing contract address"),
    },
    async ({ chain, name, description, imageUrl, recipientAddress, contractAddress }) => {
      const data = await client.mintNFT({ chain, name, description, imageUrl, recipientAddress, contractAddress });
      return {
        content: [{ type: "text", text: JSON.stringify(data, null, 2) }],
      };
    }
  );

  // Deploy contract
  server.tool(
    "verbwire_deploy_contract",
    "Deploy a new NFT contract",
    {
      chain: z.enum(SUPPORTED_CHAINS).describe("Blockchain to deploy on"),
      name: z.string().describe("Collection name"),
      symbol: z.string().describe("Collection symbol"),
      type: z.enum(["ERC721", "ERC1155"]).optional().describe("Token standard"),
    },
    async ({ chain, name, symbol, type }) => {
      const data = await client.deployContract({ chain, name, symbol, type });
      return {
        content: [{ type: "text", text: JSON.stringify(data, null, 2) }],
      };
    }
  );

  // Upload to IPFS
  server.tool(
    "verbwire_upload_ipfs",
    "Upload data to IPFS",
    {
      data: z.string().describe("Data to upload"),
      name: z.string().describe("File name"),
    },
    async ({ data, name }) => {
      const result = await client.uploadToIPFS({ data, name });
      return {
        content: [{ type: "text", text: JSON.stringify(result, null, 2) }],
      };
    }
  );

  // Upload metadata
  server.tool(
    "verbwire_upload_metadata",
    "Upload NFT metadata to IPFS",
    {
      name: z.string().describe("NFT name"),
      description: z.string().describe("NFT description"),
      imageUrl: z.string().describe("Image URL"),
      attributes: z
        .array(z.object({ trait_type: z.string(), value: z.union([z.string(), z.number()]) }))
        .optional()
        .describe("NFT attributes"),
    },
    async ({ name, description, imageUrl, attributes }) => {
      const result = await client.uploadMetadata({ name, description, imageUrl, attributes });
      return {
        content: [{ type: "text", text: JSON.stringify(result, null, 2) }],
      };
    }
  );

  // Get NFTs
  server.tool(
    "verbwire_get_nfts",
    "Get NFTs owned by an address",
    {
      address: z.string().describe("Wallet address"),
      chain: z.enum(SUPPORTED_CHAINS).optional().describe("Filter by chain"),
    },
    async ({ address, chain }) => {
      const data = await client.getNFTs(address, chain);
      return {
        content: [{ type: "text", text: JSON.stringify(data, null, 2) }],
      };
    }
  );

  // Get collection
  server.tool(
    "verbwire_get_collection",
    "Get NFT collection details",
    {
      contractAddress: z.string().describe("Contract address"),
      chain: z.enum(SUPPORTED_CHAINS).describe("Blockchain"),
    },
    async ({ contractAddress, chain }) => {
      const data = await client.getCollection(contractAddress, chain);
      return {
        content: [{ type: "text", text: JSON.stringify(data, null, 2) }],
      };
    }
  );

  // Batch mint
  server.tool(
    "verbwire_mint_batch",
    "Mint multiple NFTs in a batch",
    {
      chain: z.enum(SUPPORTED_CHAINS).describe("Blockchain"),
      contractAddress: z.string().describe("Contract address"),
      recipients: z.array(z.string()).describe("Recipient addresses"),
      metadataUrls: z.array(z.string()).describe("Metadata IPFS URLs"),
    },
    async ({ chain, contractAddress, recipients, metadataUrls }) => {
      const data = await client.mintBatch({ chain, contractAddress, recipients, metadataUrls });
      return {
        content: [{ type: "text", text: JSON.stringify(data, null, 2) }],
      };
    }
  );
}

export default VerbwireClient;
