import BN from 'bn.js';
import { ComputeBudgetProgram, PublicKey, Transaction } from '@solana/web3.js';
import type { TransactionInstruction } from '@solana/web3.js';
import { NATIVE_MINT } from '@solana/spl-token';
import {
  OnlinePumpSdk,
  PUMP_SDK,
  getBuyTokenAmountFromSolAmount,
  getBuyV3TokenAmountFromQuoteAmount,
  getSellSolAmountFromTokenAmount,
} from '@pump-fun/pump-sdk';
import type { BondingCurve } from '@pump-fun/pump-sdk';
import type { SolanaClient } from './solana-client';
import type { PumpFunToken } from './types';
import axios from 'axios';

// A v3 buy that also creates the buyer's token account stays well under this.
const TRADE_COMPUTE_UNITS = 200_000;

/**
 * Pump.fun discovery (frontend API) and bonding curve trading.
 *
 * Trades go through the official @pump-fun/pump-sdk 4 builders:
 *  - buys spend an exact SOL amount with buy_exact_quote_in_v3 and sells use
 *    sell_v3, both with a minimum output from the SDK quote less slippage;
 *  - cashback coins reject v3 (error 6094) and keep the legacy buy / sell;
 *  - the token program comes from the mint, so create_v2 (Token-2022) and
 *    legacy create (SPL Token) coins both resolve the right accounts.
 * Coins that left the curve trade on their PumpSwap pool, and coins quoted in
 * a mint other than SOL are not traded here: both throw so the bot falls back
 * to Jupiter.
 */
export class PumpFunClient {
  private solana: SolanaClient;
  private sdk: OnlinePumpSdk | null = null;
  private apiUrl = 'https://frontend-api.pump.fun';

  constructor(solanaClient: SolanaClient) {
    this.solana = solanaClient;
  }

  async getNewTokens(limit: number = 50): Promise<PumpFunToken[]> {
    try {
      const response = await axios.get(`${this.apiUrl}/coins/latest`, {
        params: { limit, offset: 0 },
      });
      return response.data;
    } catch (error) {
      console.error('Error fetching new tokens:', error);
      return [];
    }
  }

  async getTrendingTokens(): Promise<PumpFunToken[]> {
    try {
      const response = await axios.get(`${this.apiUrl}/coins/trending`);
      return response.data;
    } catch (error) {
      console.error('Error fetching trending tokens:', error);
      return [];
    }
  }

  async getTokenInfo(mint: string): Promise<PumpFunToken | null> {
    try {
      const response = await axios.get(`${this.apiUrl}/coins/${mint}`);
      return response.data;
    } catch (error) {
      console.error('Error fetching token info:', error);
      return null;
    }
  }

  async getBondingCurvePrice(mint: PublicKey): Promise<number> {
    try {
      const response = await axios.get(`${this.apiUrl}/coins/${mint.toBase58()}`);
      return response.data.price || 0;
    } catch (error) {
      return 0;
    }
  }

  async buy(
    mint: PublicKey,
    solAmount: number,
    slippage: number = 5
  ): Promise<string> {
    const user = this.solana.getPublicKey();
    const quoteAmount = new BN(Math.floor(solAmount * 1e9));
    const tokenProgram = await this.solana.getMintTokenProgram(mint);
    const sdk = this.onlineSdk();
    const [global, feeConfig, state] = await Promise.all([
      sdk.fetchGlobal(),
      sdk.fetchFeeConfig(),
      sdk.fetchBuyState(mint, user, tokenProgram),
    ]);
    const curve = state.bondingCurve;
    this.assertTradableSolCurve(mint, curve);

    let instructions: TransactionInstruction[];
    if (curve.isCashbackCoin) {
      const amount = getBuyTokenAmountFromSolAmount({
        global,
        feeConfig,
        mintSupply: curve.tokenTotalSupply,
        bondingCurve: curve,
        amount: quoteAmount,
        quoteMint: NATIVE_MINT,
      });
      instructions = await PUMP_SDK.buyInstructions({
        global,
        bondingCurveAccountInfo: state.bondingCurveAccountInfo,
        bondingCurve: curve,
        associatedUserAccountInfo: state.associatedUserAccountInfo,
        mint,
        user,
        amount,
        solAmount: quoteAmount,
        slippage,
        tokenProgram,
      });
    } else {
      const amount = getBuyV3TokenAmountFromQuoteAmount({
        global,
        feeConfig,
        mintSupply: curve.tokenTotalSupply,
        bondingCurve: curve,
        amount: quoteAmount,
        curveBaseTokenBalance: state.curveBaseTokenBalance,
      });
      instructions = await PUMP_SDK.buyExactQuoteInV3Instructions({
        bondingCurve: curve,
        associatedUserAccountInfo: state.associatedUserAccountInfo,
        mint,
        user,
        amount,
        quoteAmount,
        slippage,
        tokenProgram,
        quoteTokenProgram: state.quoteTokenProgram,
      });
    }

    return this.send(instructions);
  }

  async sell(
    mint: PublicKey,
    tokenAmount: number,
    slippage: number = 5
  ): Promise<string> {
    const user = this.solana.getPublicKey();
    const { decimals, tokenProgram } = await this.solana.getTokenInfo(mint);
    const amount = new BN(Math.floor(tokenAmount * Math.pow(10, decimals)));
    const sdk = this.onlineSdk();
    const [global, feeConfig, state] = await Promise.all([
      sdk.fetchGlobal(),
      sdk.fetchFeeConfig(),
      sdk.fetchSellState(mint, user, tokenProgram),
    ]);
    const curve = state.bondingCurve;
    this.assertTradableSolCurve(mint, curve);

    const quoteAmount = getSellSolAmountFromTokenAmount({
      global,
      feeConfig,
      mintSupply: curve.tokenTotalSupply,
      bondingCurve: curve,
      amount,
    });

    const instructions = curve.isCashbackCoin
      ? await PUMP_SDK.sellInstructions({
          global,
          bondingCurveAccountInfo: state.bondingCurveAccountInfo,
          bondingCurve: curve,
          mint,
          user,
          amount,
          solAmount: quoteAmount,
          slippage,
          tokenProgram,
          mayhemMode: curve.isMayhemMode,
          cashback: true,
        })
      : await PUMP_SDK.sellV3Instructions({
          bondingCurve: curve,
          mint,
          user,
          amount,
          quoteAmount,
          slippage,
          tokenProgram,
          quoteTokenProgram: state.quoteTokenProgram,
        });

    return this.send(instructions);
  }

  private onlineSdk(): OnlinePumpSdk {
    if (!this.sdk) this.sdk = new OnlinePumpSdk(this.solana.getConnection());
    return this.sdk;
  }

  private assertTradableSolCurve(mint: PublicKey, curve: BondingCurve): void {
    if (curve.complete) {
      throw new Error(`${mint.toBase58()} has left the bonding curve; it trades on its PumpSwap pool`);
    }
    // A SOL-paired curve stores the zero key (or wrapped SOL) as its quote mint.
    if (!curve.quoteMint.equals(PublicKey.default) && !curve.quoteMint.equals(NATIVE_MINT)) {
      throw new Error(`${mint.toBase58()} is quoted in ${curve.quoteMint.toBase58()}, not SOL`);
    }
  }

  private async send(instructions: TransactionInstruction[]): Promise<string> {
    const transaction = new Transaction().add(
      ComputeBudgetProgram.setComputeUnitLimit({ units: TRADE_COMPUTE_UNITS }),
      ComputeBudgetProgram.setComputeUnitPrice({
        microLamports: await this.solana.getRecentPriorityFee(),
      }),
      ...instructions
    );
    return this.solana.sendTransaction(transaction, { skipPreflight: false });
  }
}
