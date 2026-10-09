/**
 * PumpSwap leg for pump coins that left their bonding curve.
 *
 * A completed curve migrates to a canonical PumpSwap (pump_amm) pool. Pool
 * state, quotes and swap instructions come from `@pump-fun/pump-swap-sdk`.
 * The pool's `virtualQuoteReserves` is signed and can be negative while the
 * fees of `buy_v2` / `sell_v2` trades wait in the quote vault, so the SDK
 * quote helpers are given the raw vault balance and the signed virtual
 * reserves and price against their signed sum.
 */

import { Connection, PublicKey, type TransactionInstruction } from '@solana/web3.js';
import {
  OnlinePumpAmmSdk,
  PUMP_AMM_SDK,
  buyQuoteInput,
  canonicalPumpPoolPda,
  sellBaseInput,
  type SwapSolanaState,
} from '@pump-fun/pump-swap-sdk';
import BN from 'bn.js';

/** Canonical PumpSwap pool of `mint` paired with `quoteMint`, or null when none exists. */
export async function findPumpSwapPool(
  connection: Connection,
  mint: PublicKey,
  quoteMint: PublicKey
): Promise<PublicKey | null> {
  const pool = canonicalPumpPoolPda(mint, quoteMint);
  const accountInfo = await connection.getAccountInfo(pool);
  return accountInfo ? pool : null;
}

async function swapState(
  connection: Connection,
  pool: PublicKey,
  user: PublicKey
): Promise<SwapSolanaState> {
  return new OnlinePumpAmmSdk(connection).swapSolanaState(pool, user);
}

/**
 * Buy on a PumpSwap pool spending `quoteAmount` (fees included): `buy_v2`
 * where the pool supports it, with WSOL wrapping and ATA creation done by
 * the SDK. `expectedTokens` is the quote before slippage.
 */
export async function buildPumpSwapBuyInstructions(
  connection: Connection,
  pool: PublicKey,
  user: PublicKey,
  quoteAmount: bigint,
  slippageBps: number
): Promise<{ instructions: TransactionInstruction[]; expectedTokens: bigint }> {
  const state = await swapState(connection, pool, user);
  const quote = new BN(quoteAmount.toString());
  const { pool: poolAccount } = state;
  const result = buyQuoteInput({
    quote,
    slippage: 0,
    baseReserve: state.poolBaseAmount,
    quoteReserve: state.poolQuoteAmount,
    virtualQuoteReserves: poolAccount.virtualQuoteReserves,
    globalConfig: state.globalConfig,
    baseMintAccount: state.baseMintAccount,
    baseMint: state.baseMint,
    coinCreator: poolAccount.coinCreator,
    creator: poolAccount.creator,
    feeConfig: state.feeConfig,
    quoteMint: poolAccount.quoteMint,
    isMayhemMode: poolAccount.isMayhemMode,
    creatorFeeBps: poolAccount.creatorFeeBps,
  });
  const instructions = await PUMP_AMM_SDK.buyQuoteInput(state, quote, slippageBps / 100, {
    v2: true,
  });
  return { instructions, expectedTokens: BigInt(result.base.toString()) };
}

/**
 * Sell `tokenAmount` on a PumpSwap pool: `sell_v2` where the pool supports
 * it, unwrapping WSOL proceeds. `expectedQuote` is net of fees, before
 * slippage.
 */
export async function buildPumpSwapSellInstructions(
  connection: Connection,
  pool: PublicKey,
  user: PublicKey,
  tokenAmount: bigint,
  slippageBps: number
): Promise<{ instructions: TransactionInstruction[]; expectedQuote: bigint }> {
  const state = await swapState(connection, pool, user);
  const base = new BN(tokenAmount.toString());
  const { pool: poolAccount } = state;
  const result = sellBaseInput({
    base,
    slippage: 0,
    baseReserve: state.poolBaseAmount,
    quoteReserve: state.poolQuoteAmount,
    virtualQuoteReserves: poolAccount.virtualQuoteReserves,
    feeBucketsTotal: poolAccount.protocolFees.add(poolAccount.creatorFees),
    globalConfig: state.globalConfig,
    baseMintAccount: state.baseMintAccount,
    baseMint: state.baseMint,
    coinCreator: poolAccount.coinCreator,
    creator: poolAccount.creator,
    feeConfig: state.feeConfig,
    quoteMint: poolAccount.quoteMint,
    isMayhemMode: poolAccount.isMayhemMode,
    creatorFeeBps: poolAccount.creatorFeeBps,
  });
  const instructions = await PUMP_AMM_SDK.sellBaseInput(state, base, slippageBps / 100, {
    v2: true,
  });
  return { instructions, expectedQuote: BigInt(result.uiQuote.toString()) };
}
