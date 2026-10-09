/**
 * PumpFun Integration
 *
 * Creates, reads, quotes and trades pump coins through the official
 * `@pump-fun/pump-sdk` for the October 2026 Pump program:
 *
 * - curves are decoded by the SDK (the account outgrew the old 49-byte
 *   layout) and every reserve is quote-denominated, since a coin can be
 *   paired with SOL, a listed quote mint, or another pump coin;
 * - buys go through `buy_exact_quote_in_v3` and sells through `sell_v3`;
 *   cashback coins, which the v3 instructions do not support, use
 *   `buy_v2` / `sell_v2`;
 * - new coins are Token-2022 mints made with `create_v2`, optionally with the
 *   creator's first buy in the same transaction;
 * - a coin that migrated off its curve trades on its canonical PumpSwap pool.
 *
 * Transactions are compiled against pump.fun's address lookup table, which
 * is what keeps `create_v2` plus a first buy inside one transaction.
 */

import {
  ComputeBudgetProgram,
  Connection,
  Keypair,
  PublicKey,
  PACKET_DATA_SIZE,
  TransactionMessage,
  VersionedTransaction,
  type AccountInfo,
  type AddressLookupTableAccount,
  type MessageV0,
  type TransactionInstruction,
} from '@solana/web3.js';
import {
  NATIVE_MINT,
  TOKEN_2022_PROGRAM_ID,
  TOKEN_PROGRAM_ID,
  getAssociatedTokenAddressSync,
  unpackAccount,
  unpackMint,
} from '@solana/spl-token';
import {
  OnlinePumpSdk,
  PUMP_SDK,
  bondingCurvePda,
  getBuyTokenAmountFromSolAmount,
  getBuyV3TokenAmountFromQuoteAmount,
  getSellSolAmountFromTokenAmount,
  isBondingCurveMigrated,
  normalizeQuoteMint,
  type BondingCurve,
  type FeeConfig,
  type Global,
  type ResolvedQuoteMint,
} from '@pump-fun/pump-sdk';
import BN from 'bn.js';
import type {
  BondingCurveState,
  CreatePumpFunTokenParams,
  PumpFunTokenResult,
  PumpFunVenue,
} from '../types.js';
import { TokenLaunchError, TokenLaunchErrorCode, CONSTANTS } from '../types.js';
import { toBaseUnits } from '../utils/amounts.js';
import { logger } from '../utils/logger.js';
import {
  buildPumpSwapBuyInstructions,
  buildPumpSwapSellInstructions,
  findPumpSwapPool,
} from './pumpswap.js';

/** Signs a transaction with the trading wallet. */
export type SignTransaction = (tx: VersionedTransaction) => Promise<VersionedTransaction>;

/**
 * Everything read from chain for one curve: the decoded state plus the raw
 * SDK objects the quote helpers and instruction builders take.
 */
export interface PumpFunCurve {
  state: BondingCurveState;
  bondingCurve: BondingCurve;
  accountInfo: AccountInfo<Buffer>;
  mint: PublicKey;
  tokenProgram: PublicKey;
  /** Normalized quote mint (WSOL for SOL-paired coins) */
  quoteMint: PublicKey;
  quoteTokenProgram: PublicKey;
  /** Tokens held by the curve's token account; prices a v3 buy that crosses into the pool-to-be */
  curveTokenBalance: BN;
  /** Canonical PumpSwap pool once the coin migrated there */
  pumpSwapPool: PublicKey | null;
  global: Global;
  feeConfig: FeeConfig;
}

/** Built instructions plus what the trade was quoted for, before slippage. */
export interface PumpFunTradeInstructions {
  instructions: TransactionInstruction[];
  venue: 'curve' | 'pumpswap';
  /** Tokens out for a buy, quote out (net of fees) for a sell, in base units */
  expectedAmount: bigint;
}

const TRADE_COMPUTE_UNITS = 250_000;
const CREATE_COMPUTE_UNITS = 500_000;
const DEFAULT_PRIORITY_MICRO_LAMPORTS = 100_000;
const PROGRAM_STATE_TTL_MS = 60_000;
const BPS = 10_000n;

const NATIVE_QUOTE = { programId: TOKEN_PROGRAM_ID, decimals: 9 };

const PUMP_LOOKUP_TABLE = new PublicKey(CONSTANTS.PUMPFUN_LOOKUP_TABLE);

const sdks = new WeakMap<Connection, OnlinePumpSdk>();
const lookupTables = new WeakMap<Connection, Promise<AddressLookupTableAccount | null>>();
const programStates = new WeakMap<
  Connection,
  { global: Global; feeConfig: FeeConfig; fetchedAt: number }
>();

function onlineSdk(connection: Connection): OnlinePumpSdk {
  let sdk = sdks.get(connection);
  if (!sdk) {
    sdk = new OnlinePumpSdk(connection);
    sdks.set(connection, sdk);
  }
  return sdk;
}

/** Pump `Global` and pump-fees `FeeConfig`, cached per connection for a minute. */
async function programState(
  connection: Connection
): Promise<{ global: Global; feeConfig: FeeConfig }> {
  const cached = programStates.get(connection);
  if (cached && Date.now() - cached.fetchedAt < PROGRAM_STATE_TTL_MS) {
    return cached;
  }
  const sdk = onlineSdk(connection);
  const [global, feeConfig] = await Promise.all([sdk.fetchGlobal(), sdk.fetchFeeConfig()]);
  const value = { global, feeConfig, fetchedAt: Date.now() };
  programStates.set(connection, value);
  return value;
}

/**
 * pump.fun's lookup table, read once per connection. Null when the RPC does
 * not have it (e.g. a localnet), in which case messages carry every account.
 */
function pumpLookupTable(connection: Connection): Promise<AddressLookupTableAccount | null> {
  let table = lookupTables.get(connection);
  if (!table) {
    table = connection
      .getAddressLookupTable(PUMP_LOOKUP_TABLE)
      .then(result => result.value)
      .catch(error => {
        lookupTables.delete(connection);
        throw error;
      });
    lookupTables.set(connection, table);
  }
  return table;
}

async function quoteMintInfo(
  connection: Connection,
  quoteMint: PublicKey
): Promise<{ programId: PublicKey; decimals: number }> {
  if (quoteMint.equals(NATIVE_MINT)) return NATIVE_QUOTE;
  const accountInfo = await connection.getAccountInfo(quoteMint);
  if (!accountInfo) {
    throw new TokenLaunchError(
      TokenLaunchErrorCode.RPC_ERROR,
      `Quote mint account not found: ${quoteMint.toBase58()}`
    );
  }
  const { decimals } = unpackMint(quoteMint, accountInfo, accountInfo.owner);
  return { programId: accountInfo.owner, decimals };
}

/**
 * Derive PumpFun bonding curve PDA
 */
export function deriveBondingCurve(mint: PublicKey): PublicKey {
  return bondingCurvePda(mint);
}

/**
 * Derive the curve's token account for the coin. `create_v2` coins are
 * Token-2022 mints; coins made with the legacy `create` use SPL Token.
 */
export function deriveAssociatedBondingCurve(
  mint: PublicKey,
  bondingCurve: PublicKey,
  tokenProgram: PublicKey = TOKEN_2022_PROGRAM_ID
): PublicKey {
  return getAssociatedTokenAddressSync(mint, bondingCurve, true, tokenProgram);
}

/**
 * Read a coin's bonding curve, mint and curve token account in one RPC
 * call. Null when the mint has no pump bonding curve.
 */
export async function fetchPumpFunCurve(
  connection: Connection,
  mint: string
): Promise<PumpFunCurve | null> {
  const mintKey = new PublicKey(mint);
  const curveAddress = bondingCurvePda(mintKey);
  const legacyAta = deriveAssociatedBondingCurve(mintKey, curveAddress, TOKEN_PROGRAM_ID);
  const token2022Ata = deriveAssociatedBondingCurve(mintKey, curveAddress, TOKEN_2022_PROGRAM_ID);

  const [curveInfo, mintInfo, legacyAtaInfo, token2022AtaInfo] =
    await connection.getMultipleAccountsInfo([curveAddress, mintKey, legacyAta, token2022Ata]);

  if (!curveInfo) return null;
  if (!mintInfo) {
    throw new TokenLaunchError(TokenLaunchErrorCode.RPC_ERROR, `Mint account not found: ${mint}`);
  }

  const bondingCurve = PUMP_SDK.decodeBondingCurve(curveInfo);
  const tokenProgram = mintInfo.owner;
  const tokenDecimals = unpackMint(mintKey, mintInfo, tokenProgram).decimals;
  const isToken2022 = tokenProgram.equals(TOKEN_2022_PROGRAM_ID);
  const curveAta = isToken2022 ? token2022Ata : legacyAta;
  const curveAtaInfo = isToken2022 ? token2022AtaInfo : legacyAtaInfo;
  const curveTokenBalance = curveAtaInfo
    ? new BN(unpackAccount(curveAta, curveAtaInfo, tokenProgram).amount.toString())
    : new BN(0);

  const quoteMint = normalizeQuoteMint(bondingCurve.quoteMint);
  const migrated = isBondingCurveMigrated(bondingCurve);
  const [quote, { global, feeConfig }, pumpSwapPool] = await Promise.all([
    quoteMintInfo(connection, quoteMint),
    programState(connection),
    migrated ? findPumpSwapPool(connection, mintKey, quoteMint) : Promise.resolve(null),
  ]);

  const state: BondingCurveState = {
    mint,
    bondingCurve: curveAddress.toBase58(),
    associatedBondingCurve: curveAta.toBase58(),
    tokenProgram: tokenProgram.toBase58(),
    tokenDecimals,
    quoteMint: quoteMint.toBase58(),
    quoteTokenProgram: quote.programId.toBase58(),
    quoteDecimals: quote.decimals,
    creator: bondingCurve.creator.toBase58(),
    virtualQuoteReserves: bondingCurve.virtualQuoteReserves.toString(),
    virtualTokenReserves: bondingCurve.virtualTokenReserves.toString(),
    realQuoteReserves: bondingCurve.realQuoteReserves.toString(),
    realTokenReserves: bondingCurve.realTokenReserves.toString(),
    tokenTotalSupply: bondingCurve.tokenTotalSupply.toString(),
    complete: bondingCurve.complete,
    migrated,
    isMayhemMode: bondingCurve.isMayhemMode,
    isCashbackCoin: bondingCurve.isCashbackCoin,
    venue: venueOf(bondingCurve.complete, migrated, pumpSwapPool),
    pumpSwapPool: pumpSwapPool?.toBase58(),
  };

  return {
    state,
    bondingCurve,
    accountInfo: curveInfo,
    mint: mintKey,
    tokenProgram,
    quoteMint,
    quoteTokenProgram: quote.programId,
    curveTokenBalance,
    pumpSwapPool,
    global,
    feeConfig,
  };
}

function venueOf(complete: boolean, migrated: boolean, pool: PublicKey | null): PumpFunVenue {
  if (migrated) return pool ? 'pumpswap' : 'raydium';
  return complete ? 'completed' : 'curve';
}

/**
 * Get bonding curve state; null when the mint has no pump bonding curve
 */
export async function getBondingCurveState(
  connection: Connection,
  mint: string
): Promise<BondingCurveState | null> {
  return (await fetchPumpFunCurve(connection, mint))?.state ?? null;
}

/**
 * Check if token is still trading on its bonding curve
 */
export async function isOnBondingCurve(connection: Connection, mint: string): Promise<boolean> {
  const state = await getBondingCurveState(connection, mint);
  return state?.venue === 'curve';
}

function assertOnCurve(state: BondingCurveState): void {
  if (state.venue === 'curve') return;
  const reason =
    state.venue === 'completed'
      ? 'bonding curve is complete and awaiting migration; no trades until its PumpSwap pool opens'
      : `migrated off its bonding curve (${state.venue})`;
  throw new TokenLaunchError(TokenLaunchErrorCode.POOL_NOT_FOUND, `${state.mint} ${reason}`);
}

/**
 * Tokens a curve buy spending `quoteAmount` (fees included) receives.
 *
 * Priced like `buy_exact_quote_in_v3`, so a budget larger than what is left
 * on the curve includes the leg bought at the future pool's price
 * (synthetic migration). Cashback coins are priced like `buy_v2`.
 */
export function calculateBuyAmount(curve: PumpFunCurve, quoteAmount: bigint): bigint {
  assertOnCurve(curve.state);
  const { bondingCurve, global, feeConfig } = curve;
  const amount = new BN(quoteAmount.toString());
  const tokens = bondingCurve.isCashbackCoin
    ? getBuyTokenAmountFromSolAmount({
        global,
        feeConfig,
        mintSupply: bondingCurve.tokenTotalSupply,
        bondingCurve,
        amount,
        quoteMint: curve.quoteMint,
      })
    : getBuyV3TokenAmountFromQuoteAmount({
        global,
        feeConfig,
        mintSupply: bondingCurve.tokenTotalSupply,
        bondingCurve,
        amount,
        curveBaseTokenBalance: curve.curveTokenBalance,
      });
  return BigInt(tokens.toString());
}

/**
 * Quote (net of fees) a curve sell of `tokenAmount` receives
 */
export function calculateSellAmount(curve: PumpFunCurve, tokenAmount: bigint): bigint {
  assertOnCurve(curve.state);
  const { bondingCurve, global, feeConfig } = curve;
  return BigInt(
    getSellSolAmountFromTokenAmount({
      global,
      feeConfig,
      mintSupply: bondingCurve.tokenTotalSupply,
      bondingCurve,
      amount: new BN(tokenAmount.toString()),
    }).toString()
  );
}

/**
 * Buy instructions spending `quoteAmount` of the coin's quote mint, on the
 * curve while it trades there and on the PumpSwap pool after migration.
 *
 * On the curve, v3 (`buy_exact_quote_in_v3`) spends the budget and requires
 * the quoted tokens less slippage. Cashback coins go through `buy_v2`, whose
 * cap is the quoted cost plus slippage, so that buy is sized on the budget
 * less slippage to keep the cap at `quoteAmount`. The SDK builders create
 * the user's token account and wrap SOL as needed.
 */
export async function buildPumpFunBuyInstructions(
  connection: Connection,
  curve: PumpFunCurve,
  user: PublicKey,
  quoteAmount: bigint,
  slippageBps: number
): Promise<PumpFunTradeInstructions> {
  if (curve.state.venue === 'pumpswap' && curve.pumpSwapPool) {
    const { instructions, expectedTokens } = await buildPumpSwapBuyInstructions(
      connection,
      curve.pumpSwapPool,
      user,
      quoteAmount,
      slippageBps
    );
    return { instructions, venue: 'pumpswap', expectedAmount: expectedTokens };
  }

  assertOnCurve(curve.state);
  const { bondingCurve, mint, tokenProgram, quoteTokenProgram } = curve;
  const userAta = getAssociatedTokenAddressSync(mint, user, true, tokenProgram);
  const associatedUserAccountInfo = await connection.getAccountInfo(userAta);
  const slippage = slippageBps / 100;

  if (bondingCurve.isCashbackCoin) {
    const sizedBudget = (quoteAmount * BPS) / (BPS + BigInt(slippageBps));
    const tokens = calculateBuyAmount(curve, sizedBudget);
    const instructions = await PUMP_SDK.buyV2Instructions({
      global: curve.global,
      bondingCurveAccountInfo: curve.accountInfo,
      bondingCurve,
      associatedUserAccountInfo,
      mint,
      user,
      amount: new BN(tokens.toString()),
      quoteAmount: new BN(sizedBudget.toString()),
      slippage,
      tokenProgram,
      quoteTokenProgram,
    });
    return { instructions, venue: 'curve', expectedAmount: tokens };
  }

  const tokens = calculateBuyAmount(curve, quoteAmount);
  const instructions = await PUMP_SDK.buyExactQuoteInV3Instructions({
    bondingCurve,
    associatedUserAccountInfo,
    mint,
    user,
    amount: new BN(tokens.toString()),
    quoteAmount: new BN(quoteAmount.toString()),
    slippage,
    tokenProgram,
    quoteTokenProgram,
  });
  return { instructions, venue: 'curve', expectedAmount: tokens };
}

/**
 * Sell instructions for `tokenAmount`: `sell_v3` on the curve (`sell_v2`
 * for cashback coins), or the PumpSwap pool after migration.
 */
export async function buildPumpFunSellInstructions(
  connection: Connection,
  curve: PumpFunCurve,
  user: PublicKey,
  tokenAmount: bigint,
  slippageBps: number
): Promise<PumpFunTradeInstructions> {
  if (curve.state.venue === 'pumpswap' && curve.pumpSwapPool) {
    const { instructions, expectedQuote } = await buildPumpSwapSellInstructions(
      connection,
      curve.pumpSwapPool,
      user,
      tokenAmount,
      slippageBps
    );
    return { instructions, venue: 'pumpswap', expectedAmount: expectedQuote };
  }

  const expectedQuote = calculateSellAmount(curve, tokenAmount);
  const { bondingCurve, mint, tokenProgram, quoteTokenProgram } = curve;
  const amount = new BN(tokenAmount.toString());
  const quoteAmount = new BN(expectedQuote.toString());
  const slippage = slippageBps / 100;

  const instructions = bondingCurve.isCashbackCoin
    ? await PUMP_SDK.sellV2Instructions({
        global: curve.global,
        bondingCurveAccountInfo: curve.accountInfo,
        bondingCurve,
        mint,
        user,
        amount,
        quoteAmount,
        slippage,
        tokenProgram,
        quoteTokenProgram,
      })
    : await PUMP_SDK.sellV3Instructions({
        bondingCurve,
        mint,
        user,
        amount,
        quoteAmount,
        slippage,
        tokenProgram,
        quoteTokenProgram,
      });
  return { instructions, venue: 'curve', expectedAmount: expectedQuote };
}

/** Parameters of `buildPumpFunCreateInstructions`. */
export interface PumpFunCreateInstructionsParams {
  /** New mint; its keypair must sign the transaction */
  mint: PublicKey;
  /** Creator; signs and pays */
  creator: PublicKey;
  name: string;
  symbol: string;
  /** Metadata JSON URI */
  uri: string;
  /** Quote mint, as resolved by `OnlinePumpSdk.resolveQuoteMint`; SOL when omitted */
  quote?: ResolvedQuoteMint;
  /** Creator's first buy in quote base units; none when omitted or zero */
  initialBuyQuoteAmount?: bigint;
  /** Slippage for the first buy (bps) */
  slippageBps?: number;
  mayhemMode?: boolean;
}

/**
 * `create_v2` for a new Token-2022 coin, with the creator's first `buy_v2`
 * in the same transaction when `initialBuyQuoteAmount` is set. A pump-coin
 * quote carries the quote coin's curve (and pool, once migrated) as the
 * extra accounts `create_v2` reads to seed the new curve's reserves.
 */
export async function buildPumpFunCreateInstructions(
  connection: Connection,
  params: PumpFunCreateInstructionsParams
): Promise<{ instructions: TransactionInstruction[]; quote: ResolvedQuoteMint; expectedTokens: bigint }> {
  const sdk = onlineSdk(connection);
  const quote = params.quote ?? (await sdk.resolveQuoteMint());
  const mayhemMode = params.mayhemMode ?? false;
  const base = {
    mint: params.mint,
    name: params.name,
    symbol: params.symbol,
    uri: params.uri,
    creator: params.creator,
    user: params.creator,
    mayhemMode,
    quoteMint: quote.mint,
    quoteTokenProgram: quote.quoteTokenProgram,
    pumpQuote: quote.pumpQuote?.accounts,
  };

  const budget = params.initialBuyQuoteAmount ?? 0n;
  if (budget === 0n) {
    return {
      instructions: [await PUMP_SDK.createV2Instruction(base)],
      quote,
      expectedTokens: 0n,
    };
  }

  const slippageBps = params.slippageBps ?? CONSTANTS.DEFAULT_SLIPPAGE_BPS;
  const sizedBudget = (budget * BPS) / (BPS + BigInt(slippageBps));
  const [{ global, feeConfig }, quoteControl] = await Promise.all([
    programState(connection),
    quote.source === 'quoteControl' ? sdk.fetchQuoteControl() : Promise.resolve(null),
  ]);
  const tokens = getBuyTokenAmountFromSolAmount({
    global,
    feeConfig,
    mintSupply: null,
    bondingCurve: null,
    amount: new BN(sizedBudget.toString()),
    quoteMint: quote.mint,
    quoteControl,
    pumpQuote: quote.pumpQuote?.curve,
  });
  const instructions = await PUMP_SDK.createV2AndBuyV2Instructions({
    ...base,
    global,
    amount: tokens,
    quoteAmount: new BN(sizedBudget.toString()),
    slippage: slippageBps / 100,
  });
  return { instructions, quote, expectedTokens: BigInt(tokens.toString()) };
}

/**
 * Compile `instructions` behind a compute budget into a v0 message against
 * pump.fun's lookup table. Null when the transaction would exceed the
 * packet size limit.
 */
async function compileMessage(
  connection: Connection,
  payer: PublicKey,
  instructions: TransactionInstruction[],
  computeUnits: number
): Promise<{ message: MessageV0; blockhash: string; lastValidBlockHeight: number } | null> {
  const [{ blockhash, lastValidBlockHeight }, table] = await Promise.all([
    connection.getLatestBlockhash(),
    pumpLookupTable(connection),
  ]);
  const message = new TransactionMessage({
    payerKey: payer,
    recentBlockhash: blockhash,
    instructions: [
      ComputeBudgetProgram.setComputeUnitLimit({ units: computeUnits }),
      ComputeBudgetProgram.setComputeUnitPrice({ microLamports: DEFAULT_PRIORITY_MICRO_LAMPORTS }),
      ...instructions,
    ],
  }).compileToV0Message(table ? [table] : []);
  return transactionFits(message) ? { message, blockhash, lastValidBlockHeight } : null;
}

/** Signatures (shortvec count plus 64 bytes each) and message within one packet. */
function transactionFits(message: MessageV0): boolean {
  try {
    const signatures = 1 + 64 * message.header.numRequiredSignatures;
    return signatures + message.serialize().length <= PACKET_DATA_SIZE;
  } catch {
    return false;
  }
}

/** Sign a compiled message with `extraSigners` (e.g. a new mint) and then the wallet. */
async function signMessage(
  compiled: { message: MessageV0; blockhash: string; lastValidBlockHeight: number },
  signTransaction: SignTransaction,
  extraSigners: Keypair[] = []
): Promise<{ transaction: VersionedTransaction; blockhash: string; lastValidBlockHeight: number }> {
  const transaction = new VersionedTransaction(compiled.message);
  if (extraSigners.length > 0) transaction.sign(extraSigners);
  return {
    transaction: await signTransaction(transaction),
    blockhash: compiled.blockhash,
    lastValidBlockHeight: compiled.lastValidBlockHeight,
  };
}

/** Compile and sign a trade; trades always fit one transaction. */
async function signTrade(
  connection: Connection,
  payer: PublicKey,
  instructions: TransactionInstruction[],
  signTransaction: SignTransaction
): Promise<{ transaction: VersionedTransaction; blockhash: string; lastValidBlockHeight: number }> {
  const compiled = await compileMessage(connection, payer, instructions, TRADE_COMPUTE_UNITS);
  if (!compiled) {
    throw new TokenLaunchError(
      TokenLaunchErrorCode.TRANSACTION_FAILED,
      'Trade transaction exceeds the Solana packet size limit'
    );
  }
  return signMessage(compiled, signTransaction);
}

/** Send a signed transaction and wait for confirmation; throws if it failed on chain. */
async function sendAndConfirm(
  connection: Connection,
  signed: { transaction: VersionedTransaction; blockhash: string; lastValidBlockHeight: number }
): Promise<string> {
  const signature = await connection.sendTransaction(signed.transaction);
  const confirmation = await connection.confirmTransaction(
    { signature, blockhash: signed.blockhash, lastValidBlockHeight: signed.lastValidBlockHeight },
    'confirmed'
  );
  if (confirmation.value.err) {
    throw new TokenLaunchError(
      TokenLaunchErrorCode.TRANSACTION_FAILED,
      `Transaction ${signature} failed: ${JSON.stringify(confirmation.value.err)}`,
      { signature }
    );
  }
  return signature;
}

async function requireCurve(connection: Connection, mint: string): Promise<PumpFunCurve> {
  const curve = await fetchPumpFunCurve(connection, mint);
  if (!curve) {
    throw new TokenLaunchError(
      TokenLaunchErrorCode.POOL_NOT_FOUND,
      `${mint} has no pump bonding curve`
    );
  }
  if (curve.state.venue === 'raydium') {
    throw new TokenLaunchError(
      TokenLaunchErrorCode.POOL_NOT_FOUND,
      `${mint} migrated to Raydium before PumpSwap existed; trade it on its Raydium pool`
    );
  }
  return curve;
}

/**
 * Build and sign (without sending) a buy spending `quoteAmount` base units
 * of the coin's quote mint. Used directly for Jito bundles.
 */
export async function buildPumpFunBuyTransaction(
  connection: Connection,
  mint: string,
  payer: PublicKey,
  quoteAmount: bigint,
  slippageBps: number,
  signTransaction: SignTransaction
): Promise<{
  transaction: VersionedTransaction;
  blockhash: string;
  lastValidBlockHeight: number;
  venue: 'curve' | 'pumpswap';
  expectedTokens: bigint;
}> {
  const curve = await requireCurve(connection, mint);
  const trade = await buildPumpFunBuyInstructions(connection, curve, payer, quoteAmount, slippageBps);
  logger.info('Buying pump coin', {
    mint,
    venue: trade.venue,
    quoteMint: curve.state.quoteMint,
    quoteAmount: quoteAmount.toString(),
    expectedTokens: trade.expectedAmount.toString(),
  });
  const signed = await signTrade(connection, payer, trade.instructions, signTransaction);
  return { ...signed, venue: trade.venue, expectedTokens: trade.expectedAmount };
}

/**
 * Buy a pump coin spending `quoteAmount` base units of its quote mint
 * (lamports for SOL-paired coins), on its curve or, after migration, its
 * PumpSwap pool. `tokensReceived` is the quote at send time, before slippage.
 */
export async function buyOnPumpFun(
  connection: Connection,
  mint: string,
  payer: PublicKey,
  quoteAmount: bigint,
  slippageBps: number,
  signTransaction: SignTransaction
): Promise<{ signature: string; tokensReceived: bigint; venue: 'curve' | 'pumpswap' }> {
  const built = await buildPumpFunBuyTransaction(
    connection,
    mint,
    payer,
    quoteAmount,
    slippageBps,
    signTransaction
  );
  const signature = await sendAndConfirm(connection, built);
  return { signature, tokensReceived: built.expectedTokens, venue: built.venue };
}

/**
 * Sell `tokenAmount` base units of a pump coin for its quote mint, on its
 * curve or, after migration, its PumpSwap pool. `quoteReceived` is the quote
 * net of fees at send time, before slippage.
 */
export async function sellOnPumpFun(
  connection: Connection,
  mint: string,
  payer: PublicKey,
  tokenAmount: bigint,
  slippageBps: number,
  signTransaction: SignTransaction
): Promise<{ signature: string; quoteReceived: bigint; venue: 'curve' | 'pumpswap' }> {
  const curve = await requireCurve(connection, mint);
  const trade = await buildPumpFunSellInstructions(connection, curve, payer, tokenAmount, slippageBps);
  logger.info('Selling pump coin', {
    mint,
    venue: trade.venue,
    quoteMint: curve.state.quoteMint,
    tokenAmount: tokenAmount.toString(),
    expectedQuote: trade.expectedAmount.toString(),
  });
  const signed = await signTrade(connection, payer, trade.instructions, signTransaction);
  const signature = await sendAndConfirm(connection, signed);
  return { signature, quoteReceived: trade.expectedAmount, venue: trade.venue };
}

/**
 * Create a pump coin with `create_v2`: upload its metadata JSON, then send
 * the create signed by a fresh mint keypair and the creator. The creator's
 * first buy (`initialBuyAmount`) rides in the same transaction; when the two
 * do not fit one transaction, which happens for a coin quoted in another
 * pump coin, the buy is sent right after the create confirms.
 */
export async function createPumpFunToken(
  connection: Connection,
  params: CreatePumpFunTokenParams,
  creator: PublicKey,
  signTransaction: SignTransaction,
  uploadMetadata: (metadata: Record<string, unknown>) => Promise<string>
): Promise<PumpFunTokenResult> {
  const quote = await onlineSdk(connection).resolveQuoteMint(
    params.quoteMint ? new PublicKey(params.quoteMint) : undefined
  );
  const initialBuyQuoteAmount = params.initialBuyAmount
    ? toBaseUnits(params.initialBuyAmount, quote.decimals)
    : 0n;
  const slippageBps = params.slippageBps ?? CONSTANTS.DEFAULT_SLIPPAGE_BPS;

  const uri = await uploadPumpFunMetadata(params, uploadMetadata);
  const mintKeypair = Keypair.generate();
  const mint = mintKeypair.publicKey;
  const createParams: PumpFunCreateInstructionsParams = {
    mint,
    creator,
    name: params.name,
    symbol: params.symbol,
    uri,
    quote,
    slippageBps,
    mayhemMode: params.mayhemMode,
  };

  logger.info('Creating pump coin', {
    mint: mint.toBase58(),
    quoteMint: quote.mint.toBase58(),
    quoteSource: quote.source,
    initialBuyQuoteAmount: initialBuyQuoteAmount.toString(),
  });

  let devBuy: { signature?: string; tokens: bigint } = { tokens: 0n };
  let signature: string;
  const combined =
    initialBuyQuoteAmount > 0n
      ? await buildPumpFunCreateInstructions(connection, { ...createParams, initialBuyQuoteAmount })
      : null;
  const combinedMessage = combined
    ? await compileMessage(connection, creator, combined.instructions, CREATE_COMPUTE_UNITS)
    : null;

  if (combined && combinedMessage) {
    signature = await sendAndConfirm(
      connection,
      await signMessage(combinedMessage, signTransaction, [mintKeypair])
    );
    devBuy = { tokens: combined.expectedTokens };
  } else {
    const createOnly = await buildPumpFunCreateInstructions(connection, createParams);
    const createMessage = await compileMessage(
      connection,
      creator,
      createOnly.instructions,
      CREATE_COMPUTE_UNITS
    );
    if (!createMessage) {
      throw new TokenLaunchError(
        TokenLaunchErrorCode.TRANSACTION_FAILED,
        'create_v2 transaction exceeds the Solana packet size limit'
      );
    }
    signature = await sendAndConfirm(
      connection,
      await signMessage(createMessage, signTransaction, [mintKeypair])
    );
    if (initialBuyQuoteAmount > 0n) {
      const buy = await buyOnPumpFun(
        connection,
        mint.toBase58(),
        creator,
        initialBuyQuoteAmount,
        slippageBps,
        signTransaction
      );
      devBuy = { signature: buy.signature, tokens: buy.tokensReceived };
    }
  }

  const bondingCurve = deriveBondingCurve(mint);
  return {
    success: true,
    mint: mint.toBase58(),
    bondingCurve: bondingCurve.toBase58(),
    associatedBondingCurve: deriveAssociatedBondingCurve(mint, bondingCurve).toBase58(),
    quoteMint: quote.mint.toBase58(),
    metadataUri: uri,
    signature,
    devBuySignature: devBuy.signature,
    devBuyAmount: devBuy.tokens > 0n ? devBuy.tokens.toString() : undefined,
  };
}

/** Upload the coin's metadata JSON in the shape pump.fun reads. */
async function uploadPumpFunMetadata(
  params: CreatePumpFunTokenParams,
  uploadMetadata: (metadata: Record<string, unknown>) => Promise<string>
): Promise<string> {
  try {
    return await uploadMetadata({
      name: params.name,
      symbol: params.symbol,
      description: params.description,
      image: params.image,
      showName: true,
      ...(params.socials?.twitter ? { twitter: params.socials.twitter } : {}),
      ...(params.socials?.telegram ? { telegram: params.socials.telegram } : {}),
      ...(params.socials?.website ? { website: params.socials.website } : {}),
    });
  } catch (error) {
    throw new TokenLaunchError(
      TokenLaunchErrorCode.METADATA_UPLOAD_FAILED,
      `Metadata upload failed: ${error instanceof Error ? error.message : String(error)}`
    );
  }
}
