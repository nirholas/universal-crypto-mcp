/**
 * PumpFun Bonding Curve
 *
 * Reads and prices pump bonding curves through the official
 * `@pump-fun/pump-sdk`: the SDK decoder handles the longer post-upgrade
 * account layout, and the SDK v3 quote helpers price buys the way
 * `buy_exact_quote_in_v3` executes them, including the synthetic migration
 * leg of a buy that empties the curve.
 */

import { Connection, PublicKey, type AccountInfo } from '@solana/web3.js';
import {
  TOKEN_2022_PROGRAM_ID,
  TOKEN_PROGRAM_ID,
  getAssociatedTokenAddressSync,
  unpackAccount,
} from '@solana/spl-token';
import {
  OnlinePumpSdk,
  PUMP_SDK,
  bondingCurveMarketCap,
  bondingCurvePda,
  computeFeesBps,
  getBuyTokenAmountFromSolAmount,
  getBuyV3TokenAmountFromQuoteAmount,
  getSellSolAmountFromTokenAmount,
  isBondingCurveMigrated,
  normalizeQuoteMint,
  type BondingCurve,
  type FeeConfig,
  type Global,
} from '@pump-fun/pump-sdk';
import BN from 'bn.js';
import { MintInfoCache, uiPrice } from './mints.js';
import type {
  BondingCurveState,
  PumpFunTradeQuote,
  TradingEngineConfig,
} from '../types.js';

/** Pump program accounts every quote needs; they change rarely. */
interface PumpProgramState {
  global: Global;
  feeConfig: FeeConfig;
}

/**
 * Everything read from chain for one curve: the decoded state plus the raw
 * SDK objects the instruction builders take.
 */
export interface CurveSnapshot {
  state: BondingCurveState;
  curve: BondingCurve;
  accountInfo: AccountInfo<Buffer>;
  mint: PublicKey;
  tokenProgram: PublicKey;
  /** Normalized quote mint (WSOL for SOL-paired coins) */
  quoteMint: PublicKey;
  quoteTokenProgram: PublicKey;
  curveTokenBalance: BN;
  global: Global;
  feeConfig: FeeConfig;
}

const PROGRAM_STATE_TTL_MS = 60_000;
const BPS = 10_000n;

const toBigInt = (value: BN): bigint => BigInt(value.toString());

/**
 * PumpFun Bonding Curve reader and quoter
 */
export class PumpFunBondingCurve {
  private readonly connection: Connection;
  private readonly sdk: OnlinePumpSdk;
  private readonly mints: MintInfoCache;
  private programState: { value: PumpProgramState; fetchedAt: number } | null = null;

  constructor(config: TradingEngineConfig) {
    this.connection = new Connection(config.rpcEndpoint, 'confirmed');
    this.sdk = new OnlinePumpSdk(this.connection);
    this.mints = new MintInfoCache(this.connection);
  }

  /** The online SDK this reader uses (shared with the client's builders). */
  getSdk(): OnlinePumpSdk {
    return this.sdk;
  }

  /** Mint metadata cache shared with the PumpSwap reader. */
  getMintCache(): MintInfoCache {
    return this.mints;
  }

  /** Pump `Global` and pump-fees `FeeConfig`, cached for a minute. */
  async getProgramState(): Promise<PumpProgramState> {
    if (this.programState && Date.now() - this.programState.fetchedAt < PROGRAM_STATE_TTL_MS) {
      return this.programState.value;
    }
    const [global, feeConfig] = await Promise.all([
      this.sdk.fetchGlobal(),
      this.sdk.fetchFeeConfig(),
    ]);
    const value = { global, feeConfig };
    this.programState = { value, fetchedAt: Date.now() };
    return value;
  }

  /** Bonding curve PDA of a mint. */
  getBondingCurvePDA(mint: string): PublicKey {
    return bondingCurvePda(mint);
  }

  /**
   * Read a curve, its mint and the curve's token account in one RPC call.
   * Throws when the mint has no bonding curve.
   */
  async getSnapshot(mint: string): Promise<CurveSnapshot> {
    const mintKey = new PublicKey(mint);
    const curveAddress = bondingCurvePda(mintKey);
    const legacyAta = getAssociatedTokenAddressSync(mintKey, curveAddress, true, TOKEN_PROGRAM_ID);
    const token2022Ata = getAssociatedTokenAddressSync(
      mintKey,
      curveAddress,
      true,
      TOKEN_2022_PROGRAM_ID
    );

    const [curveInfo, mintInfo, legacyAtaInfo, token2022AtaInfo] =
      await this.connection.getMultipleAccountsInfo([
        curveAddress,
        mintKey,
        legacyAta,
        token2022Ata,
      ]);

    if (!curveInfo) {
      throw new Error(`Bonding curve not found for mint ${mint}`);
    }
    if (!mintInfo) {
      throw new Error(`Mint account not found: ${mint}`);
    }

    const curve = PUMP_SDK.decodeBondingCurve(curveInfo);
    const tokenMint = this.mints.fromAccount(mintKey, mintInfo);
    const tokenProgram = tokenMint.programId;
    const curveAtaInfo = tokenProgram.equals(TOKEN_2022_PROGRAM_ID) ? token2022AtaInfo : legacyAtaInfo;
    const curveAta = tokenProgram.equals(TOKEN_2022_PROGRAM_ID) ? token2022Ata : legacyAta;
    const curveTokenBalance = curveAtaInfo
      ? new BN(unpackAccount(curveAta, curveAtaInfo, tokenProgram).amount.toString())
      : new BN(0);

    const quoteMint = normalizeQuoteMint(curve.quoteMint);
    const [quoteInfo, programState] = await Promise.all([
      this.mints.get(quoteMint),
      this.getProgramState(),
    ]);

    const state: BondingCurveState = {
      address: curveAddress.toBase58(),
      mint,
      tokenProgram: tokenProgram.toBase58(),
      quoteMint: quoteMint.toBase58(),
      quoteTokenProgram: quoteInfo.programId.toBase58(),
      tokenDecimals: tokenMint.decimals,
      quoteDecimals: quoteInfo.decimals,
      creator: curve.creator.toBase58(),
      virtualQuoteReserves: toBigInt(curve.virtualQuoteReserves),
      virtualTokenReserves: toBigInt(curve.virtualTokenReserves),
      realQuoteReserves: toBigInt(curve.realQuoteReserves),
      realTokenReserves: toBigInt(curve.realTokenReserves),
      tokenTotalSupply: toBigInt(curve.tokenTotalSupply),
      curveTokenBalance: toBigInt(curveTokenBalance),
      complete: curve.complete,
      migrated: isBondingCurveMigrated(curve),
      isMayhemMode: curve.isMayhemMode,
      isCashbackCoin: curve.isCashbackCoin,
      migrationProgress: migrationProgress(curve, programState.global),
      feeBps: curveFeeBps(curve, programState),
    };

    return {
      state,
      curve,
      accountInfo: curveInfo,
      mint: mintKey,
      tokenProgram,
      quoteMint,
      quoteTokenProgram: quoteInfo.programId,
      curveTokenBalance,
      global: programState.global,
      feeConfig: programState.feeConfig,
    };
  }

  /**
   * Decoded bonding curve state of a mint
   */
  async getBondingCurveState(mint: string): Promise<BondingCurveState> {
    return (await this.getSnapshot(mint)).state;
  }

  /**
   * Quote a buy spending `quoteAmount` (fees included) on the curve.
   *
   * Non-cashback coins are priced like `buy_exact_quote_in_v3`, so a budget
   * larger than what is left on the curve includes the post-completion leg
   * bought at the future pool's price. Cashback coins can only trade through
   * `buy_v2` and are priced with the v2 helper.
   */
  quoteBuy(snapshot: CurveSnapshot, quoteAmount: bigint): PumpFunTradeQuote {
    assertTradable(snapshot.state);
    const { curve, global, feeConfig } = snapshot;
    const amount = new BN(quoteAmount.toString());
    const mintSupply = curve.tokenTotalSupply;

    const tokens = curve.isCashbackCoin
      ? getBuyTokenAmountFromSolAmount({
          global,
          feeConfig,
          mintSupply,
          bondingCurve: curve,
          amount,
          quoteMint: snapshot.quoteMint,
        })
      : getBuyV3TokenAmountFromQuoteAmount({
          global,
          feeConfig,
          mintSupply,
          bondingCurve: curve,
          amount,
          curveBaseTokenBalance: snapshot.curveTokenBalance,
        });

    const feeBps = this.feeBps(snapshot);
    const fee = quoteAmount - (quoteAmount * BPS) / (BPS + BigInt(feeBps));
    const { state } = snapshot;
    const spot = this.getCurrentPrice(state);
    const curveTokens = minBigInt(toBigInt(tokens), state.realTokenReserves);
    const tokensAfter = state.virtualTokenReserves - curveTokens;
    const quoteAfter =
      tokensAfter > 0n
        ? ceilDiv(state.virtualQuoteReserves * state.virtualTokenReserves, tokensAfter)
        : state.virtualQuoteReserves;
    const newPrice = uiPrice(quoteAfter, tokensAfter, state.quoteDecimals, state.tokenDecimals);

    return {
      venue: 'curve',
      marketAddress: state.address,
      amountOut: toBigInt(tokens),
      fee,
      feeBps,
      newPrice,
      priceImpact: spot > 0 ? (newPrice / spot - 1) * 100 : 0,
    };
  }

  /**
   * Quote selling `tokenAmount` on the curve; `amountOut` is net of fees.
   */
  quoteSell(snapshot: CurveSnapshot, tokenAmount: bigint): PumpFunTradeQuote {
    assertTradable(snapshot.state);
    const { curve, global, feeConfig, state } = snapshot;
    const net = toBigInt(
      getSellSolAmountFromTokenAmount({
        global,
        feeConfig,
        mintSupply: curve.tokenTotalSupply,
        bondingCurve: curve,
        amount: new BN(tokenAmount.toString()),
      })
    );
    const gross =
      (state.virtualQuoteReserves * tokenAmount) / (state.virtualTokenReserves + tokenAmount);
    const spot = this.getCurrentPrice(state);
    const newPrice = uiPrice(
      state.virtualQuoteReserves - gross,
      state.virtualTokenReserves + tokenAmount,
      state.quoteDecimals,
      state.tokenDecimals
    );

    return {
      venue: 'curve',
      marketAddress: state.address,
      amountOut: net,
      fee: gross - net,
      feeBps: this.feeBps(snapshot),
      newPrice,
      priceImpact: spot > 0 ? (1 - newPrice / spot) * 100 : 0,
    };
  }

  /**
   * Total fee rate (protocol plus creator) a trade on this curve pays now.
   * A curve whose creator is the zero key pays no creator fee.
   */
  feeBps(snapshot: CurveSnapshot): number {
    return snapshot.state.feeBps;
  }

  /**
   * Current price in quote mint units per whole token
   */
  getCurrentPrice(state: BondingCurveState): number {
    return uiPrice(
      state.virtualQuoteReserves,
      state.virtualTokenReserves,
      state.quoteDecimals,
      state.tokenDecimals
    );
  }

  /**
   * Market cap in quote mint units
   */
  getMarketCapQuote(state: BondingCurveState): number {
    if (state.virtualTokenReserves === 0n) return 0;
    const marketCap = bondingCurveMarketCap({
      mintSupply: new BN(state.tokenTotalSupply.toString()),
      virtualQuoteReserves: new BN(state.virtualQuoteReserves.toString()),
      virtualTokenReserves: new BN(state.virtualTokenReserves.toString()),
    });
    return Number(marketCap.toString()) / Math.pow(10, state.quoteDecimals);
  }

  /**
   * Share of the curve's sellable supply already bought (0-100)
   */
  getMigrationProgress(state: BondingCurveState): number {
    return state.migrationProgress;
  }

  /**
   * Curve completed: it accepts no more trades
   */
  isComplete(state: BondingCurveState): boolean {
    return state.complete;
  }

  /**
   * Human-readable bonding curve statistics
   */
  async getStatistics(mint: string): Promise<{
    currentPrice: number;
    marketCapQuote: number;
    quoteMint: string;
    virtualQuoteReserves: string;
    virtualTokenReserves: string;
    realQuoteReserves: string;
    realTokenReserves: string;
    migrationProgress: number;
    isComplete: boolean;
    isMigrated: boolean;
    totalSupply: string;
  }> {
    const state = await this.getBondingCurveState(mint);
    const quoteUnits = Math.pow(10, state.quoteDecimals);
    const tokenUnits = Math.pow(10, state.tokenDecimals);

    return {
      currentPrice: this.getCurrentPrice(state),
      marketCapQuote: this.getMarketCapQuote(state),
      quoteMint: state.quoteMint,
      virtualQuoteReserves: (Number(state.virtualQuoteReserves) / quoteUnits).toFixed(4),
      virtualTokenReserves: (Number(state.virtualTokenReserves) / tokenUnits).toFixed(0),
      realQuoteReserves: (Number(state.realQuoteReserves) / quoteUnits).toFixed(4),
      realTokenReserves: (Number(state.realTokenReserves) / tokenUnits).toFixed(0),
      migrationProgress: state.migrationProgress,
      isComplete: state.complete,
      isMigrated: state.migrated,
      totalSupply: (Number(state.tokenTotalSupply) / tokenUnits).toFixed(0),
    };
  }
}

function curveFeeBps(curve: BondingCurve, { global, feeConfig }: PumpProgramState): number {
  if (isBondingCurveMigrated(curve)) return 0;
  const { protocolFeeBps, creatorFeeBps } = computeFeesBps({
    global,
    feeConfig,
    mintSupply: curve.tokenTotalSupply,
    virtualQuoteReserves: curve.virtualQuoteReserves,
    virtualTokenReserves: curve.virtualTokenReserves,
    quoteMint: curve.quoteMint,
    creatorFeeBps: curve.creatorFeeBps,
  });
  const creator = curve.creator.equals(PublicKey.default) ? 0 : creatorFeeBps.toNumber();
  return protocolFeeBps.toNumber() + creator;
}

function migrationProgress(curve: BondingCurve, global: Global): number {
  if (curve.complete) return 100;
  const initial = toBigInt(global.initialRealTokenReserves);
  if (initial === 0n) return 0;
  const sold = initial - toBigInt(curve.realTokenReserves);
  const progress = (Number(sold) / Number(initial)) * 100;
  return Math.min(100, Math.max(0, progress));
}

function assertTradable(state: BondingCurveState): void {
  if (state.migrated) {
    throw new Error(`${state.mint} migrated to PumpSwap; trade it on its pool`);
  }
  if (state.complete) {
    throw new Error(
      `${state.mint} bonding curve is complete and awaiting migration; no trades until its PumpSwap pool opens`
    );
  }
}

function minBigInt(a: bigint, b: bigint): bigint {
  return a < b ? a : b;
}

function ceilDiv(numerator: bigint, denominator: bigint): bigint {
  return (numerator + denominator - 1n) / denominator;
}
