import { Transaction, VersionedTransaction, PublicKey } from '@solana/web3.js';
import type { SolanaClient } from './solana-client';
import axios from 'axios';

const JUPITER_API = 'https://quote-api.jup.ag/v6';
const SOL_MINT = 'So11111111111111111111111111111111111111112';

export class JupiterClient {
  private solana: SolanaClient;

  constructor(solanaClient: SolanaClient) {
    this.solana = solanaClient;
  }

  async getQuote(
    inputMint: string,
    outputMint: string,
    amount: number,
    slippage: number = 50
  ): Promise<any> {
    try {
      const response = await axios.get(`${JUPITER_API}/quote`, {
        params: {
          inputMint,
          outputMint,
          amount,
          slippageBps: slippage * 100,
        },
      });
      return response.data;
    } catch (error) {
      console.error('Error getting Jupiter quote:', error);
      throw error;
    }
  }

  async swap(
    inputMint: string,
    outputMint: string,
    amount: number,
    slippage: number = 50
  ): Promise<string> {
    const quote = await this.getQuote(inputMint, outputMint, amount, slippage);

    const swapResponse = await axios.post(`${JUPITER_API}/swap`, {
      quoteResponse: quote,
      userPublicKey: this.solana.getPublicKey().toBase58(),
      wrapAndUnwrapSol: true,
      dynamicComputeUnitLimit: true,
      prioritizationFeeLamports: 'auto',
    });

    const { swapTransaction } = swapResponse.data;

    const transactionBuf = Buffer.from(swapTransaction, 'base64');
    const transaction = VersionedTransaction.deserialize(transactionBuf);

    transaction.sign([this.solana.getWallet()]);

    const signature = await this.solana
      .getConnection()
      .sendRawTransaction(transaction.serialize(), {
        skipPreflight: false,
        maxRetries: 3,
      });

    await this.solana.getConnection().confirmTransaction(signature, 'confirmed');

    return signature;
  }

  async buyToken(
    tokenMint: string,
    solAmount: number,
    slippage: number = 50
  ): Promise<string> {
    const amountLamports = Math.floor(solAmount * 1e9);
    return await this.swap(SOL_MINT, tokenMint, amountLamports, slippage);
  }

  async sellToken(
    tokenMint: string,
    tokenAmount: number,
    slippage: number = 50
  ): Promise<string> {
    const tokenInfo = await this.solana.getTokenInfo(new PublicKey(tokenMint));
    const amountWithDecimals = Math.floor(
      tokenAmount * Math.pow(10, tokenInfo.decimals)
    );
    return await this.swap(tokenMint, SOL_MINT, amountWithDecimals, slippage);
  }

  async getPrice(tokenMint: string): Promise<number> {
    try {
      const quote = await this.getQuote(
        tokenMint,
        SOL_MINT,
        1e9, // 1 billion tokens
        100
      );
      const outAmount = parseInt(quote.outAmount);
      return outAmount / 1e9;
    } catch (error) {
      return 0;
    }
  }
}
