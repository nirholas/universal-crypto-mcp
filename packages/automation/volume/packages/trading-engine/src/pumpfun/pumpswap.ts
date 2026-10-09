/**
 * PumpSwap market for migrated pump coins.
 *
 * A pump coin that completes its bonding curve migrates to a canonical
 * PumpSwap (pump_amm) pool. Pool state, quotes and swap instructions all come
 * from the official `@pump-fun/pump-swap-sdk`.
 *
 * The pool's `virtualQuoteReserves` is a signed value. It goes negative while
 * fees of `buy_v2` / `sell_v2` trades wait in the quote vault for a sweep, so
 * the pool prices against `effective = vault balance + virtualQuoteReserves`
 * (a signed add), never against the raw vault balance.
 */

import { Connection, PublicKey, type TransactionInstruction } from '@solana/web3.js';
import {
  OnlinePumpAmmSdk,
  PUMP_AMM_SDK,
  buyQuoteInput,
  canonicalPumpPoolPda,
  computeFeesBps,
  poolMarketCap,
  sellBaseInput,
  type SwapSolanaState,
} from '@pump-fun/pump-swap-sdk';
import BN from 'bn.js';
import { MintInfoCache, uiPrice } from './mints.js';
import type { PumpFunTradeQuote, PumpSwapPoolState } from '../types.js';

/** A pool's SDK swap state plus its decoded, signed-reserve view. */
export interface PoolSnapshot {
  swap: SwapSolanaState;
  state: PumpSwapPoolState;
}

const toBigInt = (value: BN): bigint => BigInt(value.toString());

/** Slippage in basis points to the percent the SDK builders take. */
const slippagePercent = (slippageBps: number): number => slippageBps / 100;

export class PumpSwapMarket {
  private readonly sdk: OnlinePumpAmmSdk;

  constructor(
    connection: Connection,
    private readonly mints: MintInfoCache
  ) {
    this.sdk = new OnlinePumpAmmSdk(connection);
  }

  /** Canonical pool of a pump coin paired with `quoteMint`. */
  poolAddress(mint: PublicKey, quoteMint: PublicKey): PublicKey {
    return canonicalPumpPoolPda(mint, quoteMint);
  }

  /**
   * Read a pool for `user`. Quotes do not depend on the user, so callers that
   * only price pass the default key.
   */
  async getSnapshot(
    mint: PublicKey,
    quoteMint: PublicKey,
    user: PublicKey = PublicKey.default
  ): Promise<PoolSnapshot> {
    const poolKey = this.poolAddress(mint, quoteMint);
    const swap = await this.sdk.swapSolanaState(poolKey, user);
    return { swap, state: await this.toPoolState(swap) };
  }

  private async toPoolState(swap: SwapSolanaState): Promise<PumpSwapPoolState> {
    const { pool } = swap;
    const quoteInfo = await this.mints.get(pool.quoteMint);
    const quoteVaultBalance = toBigInt(swap.poolQuoteAmount);
    const virtualQuoteReserves = toBigInt(pool.virtualQuoteReserves);
    return {
      address: swap.poolKey.toBase58(),
      baseMint: pool.baseMint.toBase58(),
      quoteMint: pool.quoteMint.toBase58(),
      baseReserves: toBigInt(swap.poolBaseAmount),
      quoteVaultBalance,
      virtualQuoteReserves,
      effectiveQuoteReserves: quoteVaultBalance + virtualQuoteReserves,
      protocolFees: toBigInt(pool.protocolFees),
      creatorFees: toBigInt(pool.creatorFees),
      baseDecimals: swap.baseMintAccount.decimals,
      quoteDecimals: quoteInfo.decimals,
      baseMintSupply: swap.baseMintAccount.supply,
      isMayhemMode: pool.isMayhemMode,
      isCashbackCoin: pool.isCashbackCoin,
    };
  }

  /**
   * Price in quote mint units per whole token, from the effective reserves.
   */
  getCurrentPrice(state: PumpSwapPoolState): number {
    return uiPrice(
      state.effectiveQuoteReserves,
      state.baseReserves,
      state.quoteDecimals,
      state.baseDecimals
    );
  }

  /**
   * Market cap in quote mint units, from the effective reserves.
   */
  getMarketCapQuote(state: PumpSwapPoolState): number {
    if (state.baseReserves === 0n) return 0;
    const marketCap = poolMarketCap({
      baseMintSupply: new BN(state.baseMintSupply.toString()),
      baseReserve: new BN(state.baseReserves.toString()),
      quoteReserve: new BN(state.effectiveQuoteReserves.toString()),
      isMayhemMode: state.isMayhemMode,
    });
    return Number(marketCap.toString()) / Math.pow(10, state.quoteDecimals);
  }

  /**
   * Total fee rate (LP, protocol and creator) a swap on this pool pays now.
   */
  feeBps(snapshot: PoolSnapshot): number {
    const { swap } = snapshot;
    const { pool } = swap;
    const { lpFeeBps, protocolFeeBps, creatorFeeBps } = computeFeesBps({
      globalConfig: swap.globalConfig,
      feeConfig: swap.feeConfig,
      creator: pool.creator,
      baseMintSupply: new BN(swap.baseMintAccount.supply.toString()),
      baseMint: swap.baseMint,
      baseReserve: swap.poolBaseAmount,
      quoteReserve: swap.poolQuoteAmount.add(pool.virtualQuoteReserves),
      quoteMint: pool.quoteMint,
      isMayhemMode: pool.isMayhemMode,
      creatorFeeBps: pool.creatorFeeBps,
    });
    const creator = pool.coinCreator.equals(PublicKey.default) ? 0 : creatorFeeBps.toNumber();
    return lpFeeBps.toNumber() + protocolFeeBps.toNumber() + creator;
  }

  /**
   * Quote a buy spending `quoteAmount` (fees included).
   */
  quoteBuy(snapshot: PoolSnapshot, quoteAmount: bigint): PumpFunTradeQuote {
    const { swap, state } = snapshot;
    const { pool } = swap;
    const quote = new BN(quoteAmount.toString());
    const result = buyQuoteInput({
      quote,
      slippage: 0,
      baseReserve: swap.poolBaseAmount,
      quoteReserve: swap.poolQuoteAmount,
      virtualQuoteReserves: pool.virtualQuoteReserves,
      globalConfig: swap.globalConfig,
      baseMintAccount: swap.baseMintAccount,
      baseMint: swap.baseMint,
      coinCreator: pool.coinCreator,
      creator: pool.creator,
      feeConfig: swap.feeConfig,
      quoteMint: pool.quoteMint,
      isMayhemMode: pool.isMayhemMode,
      creatorFeeBps: pool.creatorFeeBps,
    });
    const baseOut = toBigInt(result.base);
    const quoteIn = toBigInt(result.internalQuoteWithoutFees);
    const spot = this.getCurrentPrice(state);
    const newPrice = uiPrice(
      state.effectiveQuoteReserves + quoteIn,
      state.baseReserves - baseOut,
      state.quoteDecimals,
      state.baseDecimals
    );

    return {
      venue: 'pumpswap',
      marketAddress: state.address,
      amountOut: baseOut,
      fee: quoteAmount - quoteIn,
      feeBps: this.feeBps(snapshot),
      newPrice,
      priceImpact: spot > 0 ? (newPrice / spot - 1) * 100 : 0,
    };
  }

  /**
   * Quote selling `baseAmount` tokens; `amountOut` is net of fees.
   */
  quoteSell(snapshot: PoolSnapshot, baseAmount: bigint): PumpFunTradeQuote {
    const { swap, state } = snapshot;
    const { pool } = swap;
    const result = sellBaseInput({
      base: new BN(baseAmount.toString()),
      slippage: 0,
      baseReserve: swap.poolBaseAmount,
      quoteReserve: swap.poolQuoteAmount,
      virtualQuoteReserves: pool.virtualQuoteReserves,
      feeBucketsTotal: pool.protocolFees.add(pool.creatorFees),
      globalConfig: swap.globalConfig,
      baseMintAccount: swap.baseMintAccount,
      baseMint: swap.baseMint,
      coinCreator: pool.coinCreator,
      creator: pool.creator,
      feeConfig: swap.feeConfig,
      quoteMint: pool.quoteMint,
      isMayhemMode: pool.isMayhemMode,
      creatorFeeBps: pool.creatorFeeBps,
    });
    const net = toBigInt(result.uiQuote);
    const gross = toBigInt(result.internalQuoteAmountOut);
    const spot = this.getCurrentPrice(state);
    const newPrice = uiPrice(
      state.effectiveQuoteReserves - gross,
      state.baseReserves + baseAmount,
      state.quoteDecimals,
      state.baseDecimals
    );

    return {
      venue: 'pumpswap',
      marketAddress: state.address,
      amountOut: net,
      fee: gross - net,
      feeBps: this.feeBps(snapshot),
      newPrice,
      priceImpact: spot > 0 ? (1 - newPrice / spot) * 100 : 0,
    };
  }

  /**
   * Buy instructions spending `quoteAmount`: `buy_v2` where the pool supports
   * it (every non-cashback pool), with WSOL wrapping and ATA creation handled
   * by the SDK.
   */
  buyInstructions(
    snapshot: PoolSnapshot,
    quoteAmount: bigint,
    slippageBps: number
  ): Promise<TransactionInstruction[]> {
    return PUMP_AMM_SDK.buyQuoteInput(
      snapshot.swap,
      new BN(quoteAmount.toString()),
      slippagePercent(slippageBps),
      { v2: true }
    );
  }

  /**
   * Sell instructions for `baseAmount` tokens: `sell_v2` where the pool
   * supports it, unwrapping WSOL proceeds.
   */
  sellInstructions(
    snapshot: PoolSnapshot,
    baseAmount: bigint,
    slippageBps: number
  ): Promise<TransactionInstruction[]> {
    return PUMP_AMM_SDK.sellBaseInput(
      snapshot.swap,
      new BN(baseAmount.toString()),
      slippagePercent(slippageBps),
      { v2: true }
    );
  }
}
