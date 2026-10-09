/**
 * PumpFun Client
 *
 * Trades pump coins wherever they live: on the bonding curve while it is
 * live, and on the coin's canonical PumpSwap pool once it migrated. Every
 * instruction is built by the official SDKs (`@pump-fun/pump-sdk` for the
 * curve and multi-hop routes, `@pump-fun/pump-swap-sdk` for pools):
 *
 * - curve buys use `buy_exact_quote_in_v3` and sells `sell_v3`; cashback
 *   coins, which the v3 instructions reject (6094), use `buy_v2` / `sell_v2`;
 * - migrated coins trade through PumpSwap `buy_v2` / `sell_v2`, priced
 *   against the signed effective quote reserves;
 * - `multiHopSwapWithSigner` routes one `multi_hop_swap` through several
 *   curves or pools (SOL to coin A to coin B) without intermediate accounts.
 *
 * Coins may be quoted in SOL, USDC or another pump coin; the quote mint is
 * read from the coin's bonding curve.
 */

import {
  ComputeBudgetProgram,
  Connection,
  Keypair,
  PublicKey,
  TransactionMessage,
  VersionedTransaction,
  type TransactionInstruction,
} from '@solana/web3.js';
import { getAssociatedTokenAddressSync } from '@solana/spl-token';
import {
  PUMP_SDK,
  bondingCurvePda,
  canonicalPumpPoolPdaWithQuote,
  normalizeQuoteMint,
} from '@pump-fun/pump-sdk';
import BN from 'bn.js';
import { PumpFunBondingCurve, type CurveSnapshot } from './bonding-curve.js';
import { PumpFunMonitor } from './monitor.js';
import { PumpSwapMarket, type PoolSnapshot } from './pumpswap.js';
import type {
  PumpFunTokenInfo,
  BondingCurveState,
  PumpFunBuyParams,
  PumpFunSellParams,
  PumpFunMultiHopParams,
  PumpFunSigner,
  PumpFunTradeQuote,
  PumpFunVenue,
  NewPumpFunToken,
  TransactionResult,
  TradingEngineConfig,
  IPumpFunClient,
} from '../types.js';

/** pump.fun coin metadata endpoint (per-coin `/coins/:mint` was retired). */
const PUMP_FUN_COIN_API = 'https://frontend-api-v3.pump.fun/coins-v2';

/** Fields read from the pump.fun coin endpoint. */
interface PumpFunAPICoin {
  mint: string;
  name: string;
  symbol: string;
  description?: string;
  image_uri?: string;
  creator: string;
  created_timestamp: number;
  reply_count?: number;
  holder_count?: number;
  /** Market cap in SOL (the quote of every pre-PumpSwap coin) */
  market_cap?: number;
}

/** Where a coin trades, with the state read to decide it. */
export type PumpFunMarket =
  | { venue: 'curve'; curve: CurveSnapshot }
  | { venue: 'completed'; curve: CurveSnapshot }
  | { venue: 'pumpswap'; curve: CurveSnapshot; pool: PoolSnapshot }
  | { venue: 'raydium'; curve: CurveSnapshot };

export type TradableMarket = Extract<PumpFunMarket, { venue: 'curve' | 'pumpswap' }>;

/** A pump trade direction resolved from an input and output mint. */
export interface PumpFunPair {
  side: 'buy' | 'sell';
  /** The pump coin */
  mint: string;
  /** The coin's quote mint (WSOL for SOL-paired coins) */
  quoteMint: string;
}

const DEFAULT_SLIPPAGE_BPS = 100;
const SINGLE_TRADE_COMPUTE_UNITS = 300_000;
const MULTI_HOP_COMPUTE_UNITS = 1_400_000;
/** Hops that fit a transaction without an address lookup table. */
const MAX_MULTI_HOP_HOPS = 3;
const TOKEN_INFO_TTL_MS = 60_000;

/**
 * PumpFun Client - bonding curve, PumpSwap and multi-hop trading
 */
export class PumpFunClient implements IPumpFunClient {
  private readonly connection: Connection;
  private readonly bondingCurve: PumpFunBondingCurve;
  private readonly pumpSwap: PumpSwapMarket;
  private readonly monitor: PumpFunMonitor;

  private readonly tokenCache = new Map<string, { info: PumpFunTokenInfo; fetchedAt: number }>();
  /** Quote mint per coin (null: not a pump coin). Both never change. */
  private readonly quoteMintCache = new Map<string, string | null>();

  constructor(config: TradingEngineConfig) {
    this.connection = new Connection(config.rpcEndpoint, 'confirmed');
    this.bondingCurve = new PumpFunBondingCurve(config);
    this.pumpSwap = new PumpSwapMarket(this.connection, this.bondingCurve.getMintCache());
    this.monitor = new PumpFunMonitor(config, this.bondingCurve.getMintCache());
  }

  /**
   * Token metadata from pump.fun plus live on-chain price and venue
   */
  async getTokenInfo(mint: string): Promise<PumpFunTokenInfo> {
    const cached = this.tokenCache.get(mint);
    if (cached && Date.now() - cached.fetchedAt < TOKEN_INFO_TTL_MS) {
      return cached.info;
    }

    const [data, market] = await Promise.all([fetchCoin(mint), this.getMarket(mint)]);
    const { priceInQuote, marketCapQuote } =
      market.venue === 'raydium' ? apiPricing(data, market.curve.state) : this.marketPricing(market);
    const curveState = market.curve.state;

    const info: PumpFunTokenInfo = {
      mint: data.mint,
      name: data.name,
      symbol: data.symbol,
      description: data.description,
      imageUri: data.image_uri,
      creator: data.creator,
      createdAt: data.created_timestamp,
      isMigrated: market.venue === 'pumpswap' || market.venue === 'raydium',
      venue: market.venue,
      pumpSwapPoolId:
        market.venue === 'raydium'
          ? null
          : canonicalPumpPoolPdaWithQuote(market.curve.mint, market.curve.quoteMint).toBase58(),
      quoteMint: curveState.quoteMint,
      marketCapQuote,
      priceInQuote,
      holderCount: data.holder_count,
      replyCount: data.reply_count,
    };

    this.tokenCache.set(mint, { info, fetchedAt: Date.now() });
    return info;
  }

  /**
   * Decoded bonding curve state
   */
  async getBondingCurveState(mint: string): Promise<BondingCurveState> {
    return this.bondingCurve.getBondingCurveState(mint);
  }

  /**
   * Read where a coin trades: its live curve, a completed curve waiting for
   * migration, or its PumpSwap pool.
   */
  async getMarket(mint: string): Promise<PumpFunMarket> {
    const curve = await this.bondingCurve.getSnapshot(mint);
    const venue = venueOf(curve.state);
    if (venue !== 'pumpswap') {
      return { venue, curve };
    }
    const poolAddress = this.pumpSwap.poolAddress(curve.mint, curve.quoteMint);
    if (!(await this.connection.getAccountInfo(poolAddress))) {
      return { venue: 'raydium', curve };
    }
    const pool = await this.pumpSwap.getSnapshot(curve.mint, curve.quoteMint);
    return { venue, curve, pool };
  }

  /**
   * True once the coin migrated to its PumpSwap pool
   */
  async isMigrated(mint: string): Promise<boolean> {
    return (await this.bondingCurve.getBondingCurveState(mint)).migrated;
  }

  /**
   * The coin's quote mint, or null when `mint` is not a pump coin.
   */
  async getQuoteMint(mint: string): Promise<string | null> {
    if (this.quoteMintCache.has(mint)) {
      return this.quoteMintCache.get(mint) ?? null;
    }
    let mintKey: PublicKey;
    try {
      mintKey = new PublicKey(mint);
    } catch {
      return null;
    }
    const accountInfo = await this.connection.getAccountInfo(bondingCurvePda(mintKey));
    const quoteMint = accountInfo
      ? normalizeQuoteMint(PUMP_SDK.decodeBondingCurve(accountInfo).quoteMint).toBase58()
      : null;
    this.quoteMintCache.set(mint, quoteMint);
    return quoteMint;
  }

  /**
   * Resolve a swap of `inputMint` for `outputMint` to a pump trade: a buy
   * when the output is a pump coin quoted in the input, a sell when the
   * input is a pump coin quoted in the output. Null for any other pair.
   */
  async resolvePair(inputMint: string, outputMint: string): Promise<PumpFunPair | null> {
    const outputQuote = await this.getQuoteMint(outputMint);
    if (outputQuote === inputMint) {
      return { side: 'buy', mint: outputMint, quoteMint: outputQuote };
    }
    const inputQuote = await this.getQuoteMint(inputMint);
    if (inputQuote === outputMint) {
      return { side: 'sell', mint: inputMint, quoteMint: inputQuote };
    }
    return null;
  }

  /**
   * Quote spending `quoteAmount` (fees included) on the coin's current venue
   */
  async calculateBuyOutput(mint: string, quoteAmount: bigint): Promise<PumpFunTradeQuote> {
    const market = await this.getTradableMarket(mint);
    return market.venue === 'pumpswap'
      ? this.pumpSwap.quoteBuy(market.pool, quoteAmount)
      : this.bondingCurve.quoteBuy(market.curve, quoteAmount);
  }

  /**
   * Quote selling `tokenAmount` on the coin's current venue
   */
  async calculateSellOutput(mint: string, tokenAmount: bigint): Promise<PumpFunTradeQuote> {
    const market = await this.getTradableMarket(mint);
    return market.venue === 'pumpswap'
      ? this.pumpSwap.quoteSell(market.pool, tokenAmount)
      : this.bondingCurve.quoteSell(market.curve, tokenAmount);
  }

  /**
   * Buy a coin spending `quoteAmount` of its quote mint
   */
  async buyWithSigner(
    params: PumpFunBuyParams,
    signer: PumpFunSigner
  ): Promise<TransactionResult> {
    const user = new PublicKey(params.userPublicKey);
    const slippageBps = params.slippageBps ?? DEFAULT_SLIPPAGE_BPS;
    const market = await this.getTradableMarket(params.mint);

    const instructions =
      market.venue === 'pumpswap'
        ? await this.pumpSwap.buyInstructions(
            await this.pumpSwap.getSnapshot(market.curve.mint, market.curve.quoteMint, user),
            params.quoteAmount,
            slippageBps
          )
        : await this.curveBuyInstructions(market.curve, user, params.quoteAmount, slippageBps);

    return this.sendInstructions(instructions, user, signer, SINGLE_TRADE_COMPUTE_UNITS);
  }

  /**
   * Sell `tokenAmount` of a coin for its quote mint
   */
  async sellWithSigner(
    params: PumpFunSellParams,
    signer: PumpFunSigner
  ): Promise<TransactionResult> {
    const user = new PublicKey(params.userPublicKey);
    const slippageBps = params.slippageBps ?? DEFAULT_SLIPPAGE_BPS;
    const market = await this.getTradableMarket(params.mint);

    const instructions =
      market.venue === 'pumpswap'
        ? await this.pumpSwap.sellInstructions(
            await this.pumpSwap.getSnapshot(market.curve.mint, market.curve.quoteMint, user),
            params.tokenAmount,
            slippageBps
          )
        : await this.curveSellInstructions(market.curve, user, params.tokenAmount, slippageBps);

    return this.sendInstructions(instructions, user, signer, SINGLE_TRADE_COMPUTE_UNITS);
  }

  /**
   * Swap through several pump curves or PumpSwap pools in one
   * `multi_hop_swap` instruction, e.g. SOL to coin A to coin B where B is
   * quoted in A. The expected output is simulated on chain and the minimum
   * output is set from `slippageBps`.
   */
  async multiHopSwapWithSigner(
    params: PumpFunMultiHopParams,
    signer: PumpFunSigner
  ): Promise<TransactionResult & { expectedAmountOut: bigint; minAmountOut: bigint }> {
    const hopCount = params.path.length - 1;
    if (hopCount < 1) {
      throw new Error('A multi-hop route needs at least two mints');
    }
    if (hopCount > MAX_MULTI_HOP_HOPS) {
      throw new Error(
        `Routes longer than ${MAX_MULTI_HOP_HOPS} hops need an address lookup table`
      );
    }

    const user = new PublicKey(params.userPublicKey);
    const slippageBps = params.slippageBps ?? DEFAULT_SLIPPAGE_BPS;
    const sdk = this.bondingCurve.getSdk();
    const path = params.path.map(mint => new PublicKey(mint));
    const amountIn = new BN(params.amountIn.toString());

    const hops = await sdk.resolveMultiHopRoute(path, params.side);
    const expected = await sdk.simulateMultiHopSwap({
      user,
      hops,
      side: params.side,
      amountIn,
    });
    const expectedAmountOut = BigInt(expected.toString());
    const minAmountOut = (expectedAmountOut * BigInt(10_000 - slippageBps)) / 10_000n;

    const instructions = await PUMP_SDK.multiHopSwapInstructions({
      user,
      hops,
      side: params.side,
      amountIn,
      minAmountOut: new BN(minAmountOut.toString()),
    });

    const result = await this.sendInstructions(
      instructions,
      user,
      signer,
      MULTI_HOP_COMPUTE_UNITS
    );
    return { ...result, expectedAmountOut, minAmountOut };
  }

  /**
   * Subscribe to new token launches
   */
  subscribeToNewTokens(callback: (token: NewPumpFunToken) => void): () => void {
    return this.monitor.subscribeToNewTokens(callback);
  }

  /**
   * Recent token launches
   */
  async getRecentTokens(limit: number = 50): Promise<NewPumpFunToken[]> {
    return this.monitor.getRecentTokens(limit);
  }

  /**
   * Current price in quote mint units per whole token, on the live venue
   */
  async getCurrentPrice(mint: string): Promise<number> {
    const market = await this.getMarket(mint);
    return market.venue === 'raydium'
      ? (await this.getTokenInfo(mint)).priceInQuote
      : this.marketPricing(market).priceInQuote;
  }

  /**
   * Market cap in quote mint units, on the live venue
   */
  async getMarketCapQuote(mint: string): Promise<number> {
    const market = await this.getMarket(mint);
    return market.venue === 'raydium'
      ? (await this.getTokenInfo(mint)).marketCapQuote
      : this.marketPricing(market).marketCapQuote;
  }

  /**
   * Share of the curve's sellable supply already bought (0-100)
   */
  async getMigrationProgress(mint: string): Promise<number> {
    const state = await this.bondingCurve.getBondingCurveState(mint);
    return this.bondingCurve.getMigrationProgress(state);
  }

  /**
   * Get connection instance
   */
  getConnection(): Connection {
    return this.connection;
  }

  /**
   * Clear token cache
   */
  clearCache(): void {
    this.tokenCache.clear();
  }

  /**
   * Clean up resources
   */
  async dispose(): Promise<void> {
    await this.monitor.dispose();
    this.clearCache();
  }

  private async getTradableMarket(mint: string): Promise<TradableMarket> {
    const market = await this.getMarket(mint);
    if (market.venue === 'completed') {
      throw new Error(
        `${mint} completed its bonding curve and is waiting for migration; trading resumes on PumpSwap once the pool opens`
      );
    }
    if (market.venue === 'raydium') {
      throw new Error(
        `${mint} migrated to Raydium before PumpSwap existed; trade it through the Raydium or Jupiter clients`
      );
    }
    return market;
  }

  private marketPricing(market: Exclude<PumpFunMarket, { venue: 'raydium' }>): { priceInQuote: number; marketCapQuote: number } {
    if (market.venue === 'pumpswap') {
      return {
        priceInQuote: this.pumpSwap.getCurrentPrice(market.pool.state),
        marketCapQuote: this.pumpSwap.getMarketCapQuote(market.pool.state),
      };
    }
    return {
      priceInQuote: this.bondingCurve.getCurrentPrice(market.curve.state),
      marketCapQuote: this.bondingCurve.getMarketCapQuote(market.curve.state),
    };
  }

  /**
   * Curve buy spending at most `quoteAmount`.
   *
   * v3 (`buy_exact_quote_in_v3`) spends the budget and requires the quoted
   * tokens less slippage. Cashback coins go through `buy_v2`, whose cap is
   * the quoted cost plus slippage, so the buy is sized on the budget less
   * slippage to keep the cap at `quoteAmount`.
   */
  private async curveBuyInstructions(
    snapshot: CurveSnapshot,
    user: PublicKey,
    quoteAmount: bigint,
    slippageBps: number
  ): Promise<TransactionInstruction[]> {
    const { curve, mint, tokenProgram, quoteTokenProgram } = snapshot;
    const userAta = getAssociatedTokenAddressSync(mint, user, true, tokenProgram);
    const associatedUserAccountInfo = await this.connection.getAccountInfo(userAta);
    const slippage = slippageBps / 100;

    if (curve.isCashbackCoin) {
      const sizedBudget = (quoteAmount * 10_000n) / BigInt(10_000 + slippageBps);
      const quote = this.bondingCurve.quoteBuy(snapshot, sizedBudget);
      return PUMP_SDK.buyV2Instructions({
        global: snapshot.global,
        bondingCurveAccountInfo: snapshot.accountInfo,
        bondingCurve: curve,
        associatedUserAccountInfo,
        mint,
        user,
        amount: new BN(quote.amountOut.toString()),
        quoteAmount: new BN(sizedBudget.toString()),
        slippage,
        tokenProgram,
        quoteTokenProgram,
      });
    }

    const quote = this.bondingCurve.quoteBuy(snapshot, quoteAmount);
    return PUMP_SDK.buyExactQuoteInV3Instructions({
      bondingCurve: curve,
      associatedUserAccountInfo,
      mint,
      user,
      amount: new BN(quote.amountOut.toString()),
      quoteAmount: new BN(quoteAmount.toString()),
      slippage,
      tokenProgram,
      quoteTokenProgram,
    });
  }

  /**
   * Curve sell of `tokenAmount`: `sell_v3`, or `sell_v2` for cashback coins.
   */
  private async curveSellInstructions(
    snapshot: CurveSnapshot,
    user: PublicKey,
    tokenAmount: bigint,
    slippageBps: number
  ): Promise<TransactionInstruction[]> {
    const { curve, mint, tokenProgram, quoteTokenProgram } = snapshot;
    const quote = this.bondingCurve.quoteSell(snapshot, tokenAmount);
    const amount = new BN(tokenAmount.toString());
    const quoteAmount = new BN(quote.amountOut.toString());
    const slippage = slippageBps / 100;

    if (curve.isCashbackCoin) {
      return PUMP_SDK.sellV2Instructions({
        global: snapshot.global,
        bondingCurveAccountInfo: snapshot.accountInfo,
        bondingCurve: curve,
        mint,
        user,
        amount,
        quoteAmount,
        slippage,
        tokenProgram,
        quoteTokenProgram,
      });
    }

    return PUMP_SDK.sellV3Instructions({
      bondingCurve: curve,
      mint,
      user,
      amount,
      quoteAmount,
      slippage,
      tokenProgram,
      quoteTokenProgram,
    });
  }

  /**
   * Compile `instructions` into a v0 transaction with a compute limit, sign
   * it with the keypair or the signing callback, send it and confirm it.
   */
  private async sendInstructions(
    instructions: TransactionInstruction[],
    payer: PublicKey,
    signer: PumpFunSigner,
    computeUnits: number
  ): Promise<TransactionResult> {
    const { blockhash, lastValidBlockHeight } = await this.connection.getLatestBlockhash();
    const message = new TransactionMessage({
      payerKey: payer,
      recentBlockhash: blockhash,
      instructions: [
        ComputeBudgetProgram.setComputeUnitLimit({ units: computeUnits }),
        ...instructions,
      ],
    }).compileToV0Message();

    let transaction = new VersionedTransaction(message);
    if (signer instanceof Uint8Array) {
      const keypair = Keypair.fromSecretKey(signer);
      if (!keypair.publicKey.equals(payer)) {
        throw new Error('Signing key does not match userPublicKey');
      }
      transaction.sign([keypair]);
    } else {
      transaction = await signer(transaction);
    }

    try {
      const signature = await this.connection.sendRawTransaction(transaction.serialize(), {
        skipPreflight: false,
        maxRetries: 3,
      });

      const confirmation = await this.connection.confirmTransaction(
        { signature, blockhash, lastValidBlockHeight },
        'confirmed'
      );

      return {
        signature,
        confirmed: !confirmation.value.err,
        error: confirmation.value.err ? JSON.stringify(confirmation.value.err) : undefined,
      };
    } catch (error) {
      return {
        signature: '',
        confirmed: false,
        error: error instanceof Error ? error.message : 'Unknown error',
      };
    }
  }
}

/** pump.fun coin record (metadata and market cap). */
async function fetchCoin(mint: string): Promise<PumpFunAPICoin> {
  const response = await fetch(`${PUMP_FUN_COIN_API}/${encodeURIComponent(mint)}`, {
    headers: { accept: 'application/json' },
  });
  if (!response.ok) {
    throw new Error(`pump.fun metadata unavailable for ${mint}: HTTP ${response.status}`);
  }
  return (await response.json()) as PumpFunAPICoin;
}

/**
 * Price and market cap of a coin trading on a Raydium pool, from pump.fun's
 * SOL market cap (this client does not read Raydium pools).
 */
function apiPricing(
  data: PumpFunAPICoin,
  state: BondingCurveState
): { priceInQuote: number; marketCapQuote: number } {
  const marketCapQuote = data.market_cap ?? 0;
  const supply = Number(state.tokenTotalSupply) / Math.pow(10, state.tokenDecimals);
  return { marketCapQuote, priceInQuote: supply > 0 ? marketCapQuote / supply : 0 };
}

function venueOf(state: BondingCurveState): Exclude<PumpFunVenue, 'raydium'> {
  if (state.migrated) return 'pumpswap';
  if (state.complete) return 'completed';
  return 'curve';
}
