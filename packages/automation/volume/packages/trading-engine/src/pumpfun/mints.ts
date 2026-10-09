/**
 * Mint metadata shared by the Pump curve and PumpSwap readers.
 *
 * Decimals and the owning token program never change after a mint is
 * created, so lookups are cached for the life of the process.
 */

import { Connection, PublicKey, type AccountInfo } from '@solana/web3.js';
import { NATIVE_MINT, TOKEN_PROGRAM_ID, unpackMint } from '@solana/spl-token';

export interface MintInfo {
  /** Token program that owns the mint (SPL Token or Token-2022) */
  programId: PublicKey;
  /** Mint decimals */
  decimals: number;
}

const NATIVE_MINT_INFO: MintInfo = { programId: TOKEN_PROGRAM_ID, decimals: 9 };

export class MintInfoCache {
  private readonly cache = new Map<string, MintInfo>();

  constructor(private readonly connection: Connection) {}

  /** Decode a mint account already fetched, and remember it. */
  fromAccount(mint: PublicKey, accountInfo: AccountInfo<Buffer>): MintInfo {
    const known = this.cache.get(mint.toBase58());
    if (known) return known;
    const decoded = unpackMint(mint, accountInfo, accountInfo.owner);
    const info = { programId: accountInfo.owner, decimals: decoded.decimals };
    this.cache.set(mint.toBase58(), info);
    return info;
  }

  /** Decimals and token program of `mint`; WSOL resolves without an RPC call. */
  async get(mint: PublicKey): Promise<MintInfo> {
    if (mint.equals(NATIVE_MINT)) return NATIVE_MINT_INFO;
    const known = this.cache.get(mint.toBase58());
    if (known) return known;
    const accountInfo = await this.connection.getAccountInfo(mint);
    if (!accountInfo) {
      throw new Error(`Mint account not found: ${mint.toBase58()}`);
    }
    return this.fromAccount(mint, accountInfo);
  }
}

/** Price in quote units per whole token from raw reserves. */
export function uiPrice(
  quoteReserves: bigint,
  tokenReserves: bigint,
  quoteDecimals: number,
  tokenDecimals: number
): number {
  if (tokenReserves <= 0n) return 0;
  return (
    (Number(quoteReserves) / Number(tokenReserves)) *
    Math.pow(10, tokenDecimals - quoteDecimals)
  );
}
