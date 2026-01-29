/**
 * @universal-crypto-mcp/wallet-solana
 * 
 * Solana Wallet implementation
 * 
 * @author nich
 * @license Apache-2.0
 */

import {
  Connection,
  Keypair,
  PublicKey,
  SystemProgram,
  Transaction,
  LAMPORTS_PER_SOL,
  sendAndConfirmTransaction,
  type TransactionSignature,
} from "@solana/web3.js";
import {
  getAssociatedTokenAddress,
  getAccount,
  createTransferInstruction,
  getMint,
  TOKEN_PROGRAM_ID,
} from "@solana/spl-token";
import bs58 from "bs58";
import type {
  WalletProvider,
  Balance,
  TransactionResult,
  TransactionRequest,
  TypedData,
} from "@universal-crypto-mcp/wallets-shared";
import { lamportsToSol, solToLamports, formatBalance, parseAmount } from "@universal-crypto-mcp/wallets-shared";
import type {
  SolanaWalletConfig,
  SolanaNetwork,
  SPLToken,
  SolanaTransactionOptions,
} from "./types.js";
import { SOLANA_CHAIN_IDS, SOLANA_RPC_URLS } from "./types.js";

/**
 * Solana Wallet implementation
 */
export class SolanaWallet implements WalletProvider {
  readonly chain: string;
  readonly address: string;

  private connection: Connection;
  private keypair: Keypair;
  private network: SolanaNetwork;

  constructor(config: SolanaWalletConfig) {
    this.network = config.network;
    this.chain = SOLANA_CHAIN_IDS[config.network];

    // Parse private key
    if (typeof config.privateKey === "string") {
      // Assume base58 encoded
      const decoded = bs58.decode(config.privateKey);
      this.keypair = Keypair.fromSecretKey(decoded);
    } else {
      this.keypair = Keypair.fromSecretKey(config.privateKey);
    }

    this.address = this.keypair.publicKey.toBase58();

    // Set up connection
    const rpcUrl = config.rpcUrl ?? SOLANA_RPC_URLS[config.network];
    this.connection = new Connection(rpcUrl, "confirmed");
  }

  // ==========================================================================
  // Balance Operations
  // ==========================================================================

  async getBalance(): Promise<Balance> {
    const lamports = await this.connection.getBalance(this.keypair.publicKey);

    return {
      raw: lamports.toString(),
      formatted: lamportsToSol(BigInt(lamports)),
      decimals: 9,
      symbol: "SOL",
    };
  }

  async getBalanceOf(address: string): Promise<Balance> {
    const pubkey = new PublicKey(address);
    const lamports = await this.connection.getBalance(pubkey);

    return {
      raw: lamports.toString(),
      formatted: lamportsToSol(BigInt(lamports)),
      decimals: 9,
      symbol: "SOL",
    };
  }

  async getTokenBalance(mintAddress: string): Promise<Balance> {
    const mint = new PublicKey(mintAddress);
    const tokenAccount = await getAssociatedTokenAddress(
      mint,
      this.keypair.publicKey
    );

    try {
      const account = await getAccount(this.connection, tokenAccount);
      const mintInfo = await getMint(this.connection, mint);

      return {
        raw: account.amount.toString(),
        formatted: formatBalance(account.amount, mintInfo.decimals),
        decimals: mintInfo.decimals,
        symbol: mintAddress.slice(0, 4) + "...",
      };
    } catch {
      // Token account doesn't exist
      const mintInfo = await getMint(this.connection, mint);
      return {
        raw: "0",
        formatted: "0",
        decimals: mintInfo.decimals,
        symbol: mintAddress.slice(0, 4) + "...",
      };
    }
  }

  async getTokenInfo(mintAddress: string): Promise<SPLToken> {
    const mint = new PublicKey(mintAddress);
    const mintInfo = await getMint(this.connection, mint);

    let tokenAccount: string | undefined;
    try {
      const ata = await getAssociatedTokenAddress(mint, this.keypair.publicKey);
      await getAccount(this.connection, ata);
      tokenAccount = ata.toBase58();
    } catch {
      // Token account doesn't exist
    }

    return {
      mint: mintAddress,
      tokenAccount,
      decimals: mintInfo.decimals,
    };
  }

  // ==========================================================================
  // Transfer Operations
  // ==========================================================================

  async transfer(
    to: string,
    amount: string,
    options?: SolanaTransactionOptions
  ): Promise<TransactionResult> {
    const lamports = solToLamports(amount);
    const toPubkey = new PublicKey(to);

    const transaction = new Transaction().add(
      SystemProgram.transfer({
        fromPubkey: this.keypair.publicKey,
        toPubkey,
        lamports: Number(lamports),
      })
    );

    const signature = await sendAndConfirmTransaction(
      this.connection,
      transaction,
      [this.keypair],
      {
        skipPreflight: options?.skipPreflight ?? false,
        commitment: options?.commitment ?? "confirmed",
      }
    );

    return {
      hash: signature,
      status: "confirmed",
    };
  }

  async transferToken(
    mintAddress: string,
    to: string,
    amount: string,
    options?: SolanaTransactionOptions
  ): Promise<TransactionResult> {
    const mint = new PublicKey(mintAddress);
    const mintInfo = await getMint(this.connection, mint);
    const rawAmount = parseAmount(amount, mintInfo.decimals);

    const fromTokenAccount = await getAssociatedTokenAddress(
      mint,
      this.keypair.publicKey
    );
    const toTokenAccount = await getAssociatedTokenAddress(
      mint,
      new PublicKey(to)
    );

    const transaction = new Transaction().add(
      createTransferInstruction(
        fromTokenAccount,
        toTokenAccount,
        this.keypair.publicKey,
        Number(rawAmount)
      )
    );

    const signature = await sendAndConfirmTransaction(
      this.connection,
      transaction,
      [this.keypair],
      {
        skipPreflight: options?.skipPreflight ?? false,
        commitment: options?.commitment ?? "confirmed",
      }
    );

    return {
      hash: signature,
      status: "confirmed",
    };
  }

  // ==========================================================================
  // Signing Operations
  // ==========================================================================

  async signMessage(message: string): Promise<string> {
    const messageBytes = new TextEncoder().encode(message);
    const signature = await this.keypair.sign(messageBytes);
    return bs58.encode(signature);
  }

  async signTypedData(_data: TypedData): Promise<string> {
    // Solana doesn't have EIP-712 equivalent, but we can sign the JSON
    const message = JSON.stringify(_data);
    return this.signMessage(message);
  }

  // ==========================================================================
  // Transaction Operations
  // ==========================================================================

  async sendTransaction(
    tx: TransactionRequest,
    options?: SolanaTransactionOptions
  ): Promise<TransactionResult> {
    // For Solana, we need to handle this differently
    // This is a simplified implementation for basic transfers
    return this.transfer(tx.to, tx.value ?? "0", options);
  }

  async getTransactionStatus(signature: string): Promise<TransactionResult> {
    const status = await this.connection.getSignatureStatus(signature);

    let txStatus: "pending" | "confirmed" | "failed" = "pending";
    if (status.value?.err) {
      txStatus = "failed";
    } else if (status.value?.confirmationStatus === "finalized" ||
               status.value?.confirmationStatus === "confirmed") {
      txStatus = "confirmed";
    }

    return {
      hash: signature,
      status: txStatus,
      blockNumber: status.value?.slot,
    };
  }

  // ==========================================================================
  // Utility Methods
  // ==========================================================================

  /**
   * Get the connection object for advanced operations
   */
  getConnection(): Connection {
    return this.connection;
  }

  /**
   * Get the keypair for advanced operations (use with caution!)
   */
  getKeypair(): Keypair {
    return this.keypair;
  }

  /**
   * Get the public key
   */
  getPublicKey(): PublicKey {
    return this.keypair.publicKey;
  }

  /**
   * Get the current network
   */
  getNetwork(): SolanaNetwork {
    return this.network;
  }

  /**
   * Request airdrop (devnet/testnet only)
   */
  async requestAirdrop(amount: number = 1): Promise<TransactionResult> {
    if (this.network === "mainnet") {
      throw new Error("Airdrop not available on mainnet");
    }

    const signature = await this.connection.requestAirdrop(
      this.keypair.publicKey,
      amount * LAMPORTS_PER_SOL
    );

    await this.connection.confirmTransaction(signature, "confirmed");

    return {
      hash: signature,
      status: "confirmed",
    };
  }

  /**
   * Get recent blockhash
   */
  async getRecentBlockhash(): Promise<string> {
    const { blockhash } = await this.connection.getLatestBlockhash();
    return blockhash;
  }
}

/**
 * Create a Solana wallet from a private key
 */
export function createSolanaWallet(
  privateKey: string | Uint8Array,
  network: SolanaNetwork = "mainnet",
  rpcUrl?: string
): SolanaWallet {
  return new SolanaWallet({
    privateKey,
    network,
    rpcUrl,
  });
}

/**
 * Generate a new Solana keypair
 */
export function generateSolanaKeypair(): {
  publicKey: string;
  privateKey: string;
} {
  const keypair = Keypair.generate();
  return {
    publicKey: keypair.publicKey.toBase58(),
    privateKey: bs58.encode(keypair.secretKey),
  };
}
