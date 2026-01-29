import {
  Connection,
  PublicKey,
  Keypair,
  Transaction,
  SystemProgram,
  LAMPORTS_PER_SOL,
  sendAndConfirmTransaction,
  ComputeBudgetProgram,
} from '@solana/web3.js';
import {
  getAssociatedTokenAddress,
  createAssociatedTokenAccountInstruction,
  TOKEN_PROGRAM_ID,
  ASSOCIATED_TOKEN_PROGRAM_ID,
  getMint,
  getAccount,
} from '@solana/spl-token';
import bs58 from 'bs58';

export class SolanaClient {
  private connection: Connection;
  private wallet: Keypair;

  constructor(rpcUrl: string, privateKey: string) {
    this.connection = new Connection(rpcUrl, {
      commitment: 'confirmed',
      confirmTransactionInitialTimeout: 60000,
    });
    this.wallet = Keypair.fromSecretKey(bs58.decode(privateKey));
  }

  getConnection(): Connection {
    return this.connection;
  }

  getWallet(): Keypair {
    return this.wallet;
  }

  getPublicKey(): PublicKey {
    return this.wallet.publicKey;
  }

  async getBalance(): Promise<number> {
    const balance = await this.connection.getBalance(this.wallet.publicKey);
    return balance / LAMPORTS_PER_SOL;
  }

  async getTokenBalance(mint: PublicKey): Promise<number> {
    try {
      const tokenAccount = await getAssociatedTokenAddress(
        mint,
        this.wallet.publicKey
      );

      const account = await getAccount(this.connection, tokenAccount);
      const mintInfo = await getMint(this.connection, mint);

      return Number(account.amount) / Math.pow(10, mintInfo.decimals);
    } catch (error) {
      return 0;
    }
  }

  async getOrCreateTokenAccount(mint: PublicKey): Promise<PublicKey> {
    const tokenAccount = await getAssociatedTokenAddress(
      mint,
      this.wallet.publicKey
    );

    const accountInfo = await this.connection.getAccountInfo(tokenAccount);

    if (!accountInfo) {
      const transaction = new Transaction().add(
        createAssociatedTokenAccountInstruction(
          this.wallet.publicKey,
          tokenAccount,
          this.wallet.publicKey,
          mint
        )
      );

      await this.sendTransaction(transaction);
    }

    return tokenAccount;
  }

  async sendTransaction(
    transaction: Transaction,
    options?: { skipPreflight?: boolean; maxRetries?: number }
  ): Promise<string> {
    const { blockhash, lastValidBlockHeight } =
      await this.connection.getLatestBlockhash();

    transaction.recentBlockhash = blockhash;
    transaction.feePayer = this.wallet.publicKey;

    // Add priority fee
    const priorityFee = ComputeBudgetProgram.setComputeUnitPrice({
      microLamports: 50000,
    });
    transaction.add(priorityFee);

    transaction.sign(this.wallet);

    const signature = await this.connection.sendRawTransaction(
      transaction.serialize(),
      {
        skipPreflight: options?.skipPreflight ?? false,
        maxRetries: options?.maxRetries ?? 3,
      }
    );

    await this.connection.confirmTransaction(
      {
        signature,
        blockhash,
        lastValidBlockHeight,
      },
      'confirmed'
    );

    return signature;
  }

  async getTokenInfo(mint: PublicKey) {
    const mintInfo = await getMint(this.connection, mint);
    return {
      decimals: mintInfo.decimals,
      supply: Number(mintInfo.supply) / Math.pow(10, mintInfo.decimals),
      mintAuthority: mintInfo.mintAuthority?.toBase58(),
      freezeAuthority: mintInfo.freezeAuthority?.toBase58(),
    };
  }

  async getRecentPriorityFee(): Promise<number> {
    const recentFees = await this.connection.getRecentPrioritizationFees();
    if (recentFees.length === 0) return 1000;

    const avgFee =
      recentFees.reduce((sum, fee) => sum + fee.prioritizationFee, 0) /
      recentFees.length;

    return Math.ceil(avgFee * 1.5); // 50% higher than average
  }
}
