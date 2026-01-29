import { Connection, PublicKey, Keypair, Transaction, sendAndConfirmTransaction } from '@solana/web3.js';
import { TokenInfo, PriceData } from '../types.js';
import { config } from '../config.js';
import { logger } from '../utils/logger.js';
import { IDexClient } from './pancakeswap.js';
import bs58 from 'bs58';

export class RaydiumClient implements IDexClient {
  private connection: Connection;
  private wallet: Keypair;
  private readonly RAYDIUM_AUTHORITY = new PublicKey('5Q544fKrFoe6tsEbD7S8EmxGTJYAKtTVhAW5Q5pge4j1');
  private readonly SOL_MINT = new PublicKey('So11111111111111111111111111111111111111112');

  constructor() {
    if (!config.solanaRpcUrl || !config.solanaPrivateKey) {
      throw new Error('SOLANA_RPC_URL and SOLANA_PRIVATE_KEY must be set for Solana trading');
    }

    this.connection = new Connection(config.solanaRpcUrl, 'confirmed');
    
    try {
      const secretKey = bs58.decode(config.solanaPrivateKey);
      this.wallet = Keypair.fromSecretKey(secretKey);
      logger.info(`Raydium client initialized with wallet: ${this.wallet.publicKey.toString()}`);
    } catch (error) {
      logger.error('Failed to initialize Solana wallet:', error);
      throw error;
    }
  }

  async getTokenPrice(tokenAddress: string): Promise<PriceData> {
    try {
      // In production, use Raydium SDK or Jupiter aggregator API
      // For now, using a simplified approach with Jupiter Price API
      const response = await fetch(`https://price.jup.ag/v4/price?ids=${tokenAddress}`);
      const data = await response.json();
      
      if (data.data && data.data[tokenAddress]) {
        const priceInfo = data.data[tokenAddress];
        return {
          price: priceInfo.price,
          volume24h: 0,
          liquidity: 0,
          priceChange24h: 0,
          timestamp: Date.now(),
        };
      }

      throw new Error('Token price not found');
    } catch (error) {
      logger.error(`Failed to get token price for ${tokenAddress}:`, error);
      throw error;
    }
  }

  async executeBuy(token: TokenInfo, amountIn: number, minAmountOut: number): Promise<string> {
    try {
      logger.info(`Executing buy on Solana: ${amountIn} SOL for ${token.symbol}`);

      // In production, use Raydium SDK or Jupiter aggregator
      // This is a simplified example using Jupiter Swap API
      const quoteResponse = await fetch(
        `https://quote-api.jup.ag/v6/quote?inputMint=${this.SOL_MINT.toString()}&outputMint=${token.address}&amount=${Math.floor(amountIn * 1e9)}&slippageBps=${config.maxSlippagePercent * 100}`
      );
      const quoteData = await quoteResponse.json();

      if (!quoteData || quoteData.error) {
        throw new Error(`Failed to get quote: ${quoteData?.error || 'Unknown error'}`);
      }

      const swapResponse = await fetch('https://quote-api.jup.ag/v6/swap', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          quoteResponse: quoteData,
          userPublicKey: this.wallet.publicKey.toString(),
          wrapUnwrapSOL: true,
        }),
      });

      const swapData = await swapResponse.json();
      
      if (!swapData.swapTransaction) {
        throw new Error('Failed to get swap transaction');
      }

      // Deserialize and sign transaction
      const swapTransactionBuf = Buffer.from(swapData.swapTransaction, 'base64');
      const transaction = Transaction.from(swapTransactionBuf);
      
      const signature = await sendAndConfirmTransaction(
        this.connection,
        transaction,
        [this.wallet],
        { commitment: 'confirmed' }
      );

      logger.info(`Buy transaction confirmed: ${signature}`);
      return signature;
    } catch (error) {
      logger.error('Buy execution failed:', error);
      throw error;
    }
  }

  async executeSell(token: TokenInfo, amountIn: number, minAmountOut: number): Promise<string> {
    try {
      logger.info(`Executing sell on Solana: ${amountIn} ${token.symbol} for SOL`);

      const amountInLamports = Math.floor(amountIn * Math.pow(10, token.decimals));

      const quoteResponse = await fetch(
        `https://quote-api.jup.ag/v6/quote?inputMint=${token.address}&outputMint=${this.SOL_MINT.toString()}&amount=${amountInLamports}&slippageBps=${config.maxSlippagePercent * 100}`
      );
      const quoteData = await quoteResponse.json();

      if (!quoteData || quoteData.error) {
        throw new Error(`Failed to get quote: ${quoteData?.error || 'Unknown error'}`);
      }

      const swapResponse = await fetch('https://quote-api.jup.ag/v6/swap', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          quoteResponse: quoteData,
          userPublicKey: this.wallet.publicKey.toString(),
          wrapUnwrapSOL: true,
        }),
      });

      const swapData = await swapResponse.json();
      
      if (!swapData.swapTransaction) {
        throw new Error('Failed to get swap transaction');
      }

      const swapTransactionBuf = Buffer.from(swapData.swapTransaction, 'base64');
      const transaction = Transaction.from(swapTransactionBuf);
      
      const signature = await sendAndConfirmTransaction(
        this.connection,
        transaction,
        [this.wallet],
        { commitment: 'confirmed' }
      );

      logger.info(`Sell transaction confirmed: ${signature}`);
      return signature;
    } catch (error) {
      logger.error('Sell execution failed:', error);
      throw error;
    }
  }

  async getTokenBalance(tokenAddress: string): Promise<number> {
    try {
      if (tokenAddress === this.SOL_MINT.toString() || tokenAddress === 'SOL') {
        const balance = await this.connection.getBalance(this.wallet.publicKey);
        return balance / 1e9;
      }

      const tokenAccounts = await this.connection.getParsedTokenAccountsByOwner(
        this.wallet.publicKey,
        { mint: new PublicKey(tokenAddress) }
      );

      if (tokenAccounts.value.length === 0) {
        return 0;
      }

      const balance = tokenAccounts.value[0].account.data.parsed.info.tokenAmount.uiAmount;
      return balance || 0;
    } catch (error) {
      logger.error(`Failed to get token balance for ${tokenAddress}:`, error);
      return 0;
    }
  }

  async getSolBalance(): Promise<number> {
    const balance = await this.connection.getBalance(this.wallet.publicKey);
    return balance / 1e9;
  }
}
