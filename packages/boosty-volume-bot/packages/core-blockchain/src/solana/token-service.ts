/**
 * Solana Token Service
 * SPL Token operations
 */

import { Connection, PublicKey, Keypair } from '@solana/web3.js';
import {
  createMint,
  mintTo,
  transfer,
  getOrCreateAssociatedTokenAccount,
} from '@solana/spl-token';

export interface TokenCreateParams {
  decimals: number;
  mintAuthority: string;
  freezeAuthority?: string;
  payer: Keypair;
}

export interface TokenMintParams {
  mint: string;
  destination: string;
  amount: bigint;
  authority: Keypair;
}

export interface TokenTransferParams {
  mint: string;
  source: string;
  destination: string;
  amount: bigint;
  owner: Keypair;
}

export class SolanaTokenService {
  private connection: Connection;

  constructor(connection: Connection) {
    this.connection = connection;
  }

  async createToken(params: TokenCreateParams): Promise<string> {
    const mint = await createMint(
      this.connection,
      params.payer,
      new PublicKey(params.mintAuthority),
      params.freezeAuthority ? new PublicKey(params.freezeAuthority) : null,
      params.decimals
    );
    return mint.toBase58();
  }

  async mintTokens(params: TokenMintParams): Promise<string> {
    const destinationAta = await getOrCreateAssociatedTokenAccount(
      this.connection,
      params.authority,
      new PublicKey(params.mint),
      new PublicKey(params.destination)
    );

    const signature = await mintTo(
      this.connection,
      params.authority,
      new PublicKey(params.mint),
      destinationAta.address,
      params.authority,
      params.amount
    );

    return signature;
  }

  async transferTokens(params: TokenTransferParams): Promise<string> {
    const sourceAta = await getOrCreateAssociatedTokenAccount(
      this.connection,
      params.owner,
      new PublicKey(params.mint),
      new PublicKey(params.source)
    );

    const destAta = await getOrCreateAssociatedTokenAccount(
      this.connection,
      params.owner,
      new PublicKey(params.mint),
      new PublicKey(params.destination)
    );

    const signature = await transfer(
      this.connection,
      params.owner,
      sourceAta.address,
      destAta.address,
      params.owner,
      params.amount
    );

    return signature;
  }
}
