/**
 * @universal-crypto-mcp/wallets-shared
 * 
 * Common wallet interfaces for cross-chain wallet implementations
 * 
 * @author nich
 * @license Apache-2.0
 * @see https://github.com/nirholas/universal-crypto-mcp
 */

/**
 * Represents a token/currency balance
 */
export interface Balance {
  /** Raw balance in smallest unit (wei, lamports, etc.) */
  raw: string;
  /** Human-readable formatted balance */
  formatted: string;
  /** Number of decimal places */
  decimals: number;
  /** Token symbol (ETH, SOL, USDC, etc.) */
  symbol: string;
}

/**
 * Result of a transaction
 */
export interface TransactionResult {
  /** Transaction hash/signature */
  hash: string;
  /** Current status of the transaction */
  status: "pending" | "confirmed" | "failed";
  /** Block number where transaction was included */
  blockNumber?: number;
  /** Amount of gas/compute units used */
  gasUsed?: string;
  /** Error message if transaction failed */
  error?: string;
}

/**
 * Generic transaction request
 */
export interface TransactionRequest {
  /** Recipient address */
  to: string;
  /** Native token value to send */
  value?: string;
  /** Transaction data (for contract calls) */
  data?: string;
  /** Gas limit / compute unit limit */
  gasLimit?: string;
}

/**
 * EIP-712 typed data structure
 */
export interface TypedData {
  /** Domain separator */
  domain: Record<string, unknown>;
  /** Type definitions */
  types: Record<string, Array<{ name: string; type: string }>>;
  /** Primary type name */
  primaryType: string;
  /** Message data */
  message: Record<string, unknown>;
}

/**
 * Common interface for wallet providers across chains
 */
export interface WalletProvider {
  /** Chain identifier (e.g., "eip155:1", "solana:mainnet") */
  readonly chain: string;
  /** Wallet address */
  readonly address: string;
  
  // ========================================================================
  // Balance Operations
  // ========================================================================
  
  /**
   * Get native token balance
   */
  getBalance(): Promise<Balance>;
  
  /**
   * Get balance of a specific token
   * @param token - Token address/mint
   */
  getTokenBalance(token: string): Promise<Balance>;
  
  // ========================================================================
  // Transfer Operations
  // ========================================================================
  
  /**
   * Transfer native tokens
   * @param to - Recipient address
   * @param amount - Amount in human-readable format
   */
  transfer(to: string, amount: string): Promise<TransactionResult>;
  
  /**
   * Transfer tokens (ERC20, SPL, etc.)
   * @param token - Token address/mint
   * @param to - Recipient address
   * @param amount - Amount in human-readable format
   */
  transferToken(token: string, to: string, amount: string): Promise<TransactionResult>;
  
  // ========================================================================
  // Signing Operations
  // ========================================================================
  
  /**
   * Sign a message
   * @param message - Message to sign
   */
  signMessage(message: string): Promise<string>;
  
  /**
   * Sign typed data (EIP-712 or equivalent)
   * @param data - Typed data to sign
   */
  signTypedData(data: TypedData): Promise<string>;
  
  // ========================================================================
  // Transaction Operations
  // ========================================================================
  
  /**
   * Send a raw transaction
   * @param tx - Transaction request
   */
  sendTransaction(tx: TransactionRequest): Promise<TransactionResult>;
}

/**
 * Configuration options for wallet initialization
 */
export interface WalletConfig {
  /** Private key (hex for EVM, base58 for Solana) */
  privateKey: string;
  /** Chain identifier */
  chainId: string;
  /** Custom RPC URL */
  rpcUrl?: string;
}

/**
 * Interface for wallet factories
 */
export interface WalletFactory {
  /**
   * Create a wallet instance
   * @param config - Wallet configuration
   */
  create(config: WalletConfig): Promise<WalletProvider>;
  
  /**
   * Check if a chain is supported by this factory
   * @param chainId - Chain identifier
   */
  supportsChain(chainId: string): boolean;
}

/**
 * Token metadata
 */
export interface TokenMetadata {
  /** Token address/mint */
  address: string;
  /** Token symbol */
  symbol: string;
  /** Token name */
  name: string;
  /** Decimal places */
  decimals: number;
  /** Logo URI */
  logoUri?: string;
}

/**
 * NFT metadata
 */
export interface NFTMetadata {
  /** Token ID */
  tokenId: string;
  /** Contract/Collection address */
  collection: string;
  /** NFT name */
  name?: string;
  /** NFT description */
  description?: string;
  /** Image URI */
  imageUri?: string;
  /** Metadata URI */
  metadataUri?: string;
  /** Additional attributes */
  attributes?: Record<string, unknown>;
}
