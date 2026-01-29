/**
 * Jupiter Aggregator Service - Real swap execution
 * Author: nich (@nirholas) - x.com/nichxbt
 */

import { Connection, PublicKey, VersionedTransaction, Keypair } from '@solana/web3.js'
import { config } from '../config/config'
import { SwapParams, SwapResult } from '../types'
import axios from 'axios'

const JUPITER_API_URL = 'https://quote-api.jup.ag/v6'
const JUPITER_PRICE_API = 'https://price.jup.ag/v6'

export interface JupiterQuote {
  inputMint: string
  inAmount: string
  outputMint: string
  outAmount: string
  otherAmountThreshold: string
  swapMode: string
  slippageBps: number
  platformFee: null
  priceImpactPct: string
  routePlan: Array<{
    swapInfo: {
      ammKey: string
      label: string
      inputMint: string
      outputMint: string
      inAmount: string
      outAmount: string
      feeAmount: string
      feeMint: string
    }
    percent: number
  }>
  contextSlot: number
  timeTaken: number
}

export class JupiterService {
  private connection: Connection
  
  constructor(connection: Connection) {
    this.connection = connection
  }
  
  /**
   * Get swap quote from Jupiter
   */
  async getQuote(params: SwapParams): Promise<JupiterQuote | null> {
    try {
      const slippageBps = Math.floor(params.slippage * 100)
      
      const response = await axios.get(`${JUPITER_API_URL}/quote`, {
        params: {
          inputMint: params.tokenIn,
          outputMint: params.tokenOut,
          amount: params.amountIn,
          slippageBps,
          onlyDirectRoutes: false,
          asLegacyTransaction: false,
          maxAccounts: 64
        },
        timeout: 10000
      })
      
      if (response.data) {
        return response.data as JupiterQuote
      }
      
      return null
    } catch (error) {
      console.error('Jupiter quote error:', error)
      return null
    }
  }
  
  /**
   * Execute swap transaction
   */
  async executeSwap(
    quote: JupiterQuote,
    wallet: Keypair,
    priorityFee?: number
  ): Promise<SwapResult> {
    try {
      // Get swap transaction from Jupiter
      const swapResponse = await axios.post(`${JUPITER_API_URL}/swap`, {
        quoteResponse: quote,
        userPublicKey: wallet.publicKey.toBase58(),
        wrapAndUnwrapSol: true,
        dynamicComputeUnitLimit: true,
        prioritizationFeeLamports: priorityFee || config.priorityFee || 'auto'
      }, {
        timeout: 15000
      })
      
      const { swapTransaction } = swapResponse.data
      
      // Deserialize transaction
      const transactionBuf = Buffer.from(swapTransaction, 'base64')
      const transaction = VersionedTransaction.deserialize(transactionBuf)
      
      // Sign transaction
      transaction.sign([wallet])
      
      // Send transaction
      const rawTransaction = transaction.serialize()
      const signature = await this.connection.sendRawTransaction(rawTransaction, {
        skipPreflight: false,
        maxRetries: 3,
        preflightCommitment: 'confirmed'
      })
      
      // Confirm transaction
      const latestBlockhash = await this.connection.getLatestBlockhash()
      await this.connection.confirmTransaction({
        signature,
        ...latestBlockhash
      }, 'confirmed')
      
      // Calculate price
      const inAmount = parseFloat(quote.inAmount)
      const outAmount = parseFloat(quote.outAmount)
      const price = outAmount / inAmount
      
      return {
        signature,
        tokenIn: quote.inputMint,
        tokenOut: quote.outputMint,
        amountIn: quote.inAmount,
        amountOut: quote.outAmount,
        price,
        success: true
      }
    } catch (error) {
      console.error('Swap execution error:', error)
      return {
        signature: '',
        tokenIn: quote.inputMint,
        tokenOut: quote.outputMint,
        amountIn: quote.inAmount,
        amountOut: '0',
        price: 0,
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error'
      }
    }
  }
  
  /**
   * Get token price from Jupiter
   */
  async getTokenPrice(tokenMint: string): Promise<number | null> {
    try {
      const response = await axios.get(`${JUPITER_PRICE_API}/price`, {
        params: {
          ids: tokenMint
        },
        timeout: 5000
      })
      
      if (response.data?.data?.[tokenMint]) {
        return response.data.data[tokenMint].price
      }
      
      return null
    } catch (error) {
      console.error('Price fetch error:', error)
      return null
    }
  }
  
  /**
   * Get multiple token prices
   */
  async getTokenPrices(tokenMints: string[]): Promise<Map<string, number>> {
    const prices = new Map<string, number>()
    
    try {
      const response = await axios.get(`${JUPITER_PRICE_API}/price`, {
        params: {
          ids: tokenMints.join(',')
        },
        timeout: 5000
      })
      
      if (response.data?.data) {
        for (const [mint, data] of Object.entries(response.data.data)) {
          prices.set(mint, (data as any).price)
        }
      }
    } catch (error) {
      console.error('Batch price fetch error:', error)
    }
    
    return prices
  }
  
  /**
   * Check if token is tradeable on Jupiter
   */
  async isTokenTradeable(tokenMint: string): Promise<boolean> {
    try {
      const price = await this.getTokenPrice(tokenMint)
      return price !== null && price > 0
    } catch {
      return false
    }
  }
}
