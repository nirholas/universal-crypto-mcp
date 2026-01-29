/**
 * Solana Blockchain Service
 * Author: nich (@nirholas) - x.com/nichxbt
 */

import {
  Connection,
  Keypair,
  PublicKey,
  Transaction,
  sendAndConfirmTransaction,
  SystemProgram,
  ComputeBudgetProgram
} from '@solana/web3.js'
import {
  TOKEN_PROGRAM_ID,
  getAssociatedTokenAddress,
  createAssociatedTokenAccountInstruction,
  getAccount
} from '@solana/spl-token'
import bs58 from 'bs58'
import { config, WSOL } from '../config/config'
import { TokenInfo } from '../types'

export class SolanaService {
  private connection: Connection
  private wallet: Keypair
  
  constructor() {
    this.connection = new Connection(config.rpcUrl, {
      commitment: 'confirmed',
      wsEndpoint: config.wsUrl
    })
    
    // Decode private key from base58
    const secretKey = bs58.decode(config.privateKey)
    this.wallet = Keypair.fromSecretKey(secretKey)
  }
  
  getConnection(): Connection {
    return this.connection
  }
  
  getWallet(): Keypair {
    return this.wallet
  }
  
  getPublicKey(): PublicKey {
    return this.wallet.publicKey
  }
  
  async getBalance(): Promise<number> {
    const balance = await this.connection.getBalance(this.wallet.publicKey)
    return balance / 1e9 // Convert lamports to SOL
  }
  
  async getTokenBalance(tokenMint: string): Promise<string> {
    try {
      const mintPublicKey = new PublicKey(tokenMint)
      const tokenAccount = await getAssociatedTokenAddress(
        mintPublicKey,
        this.wallet.publicKey
      )
      
      const accountInfo = await getAccount(this.connection, tokenAccount)
      return accountInfo.amount.toString()
    } catch (error) {
      return '0'
    }
  }
  
  async getTokenInfo(tokenMint: string): Promise<TokenInfo> {
    const mintPublicKey = new PublicKey(tokenMint)
    const mintInfo = await this.connection.getParsedAccountInfo(mintPublicKey)
    
    if (!mintInfo.value || !('parsed' in mintInfo.value.data)) {
      throw new Error('Invalid token mint')
    }
    
    const data = mintInfo.value.data.parsed.info
    
    return {
      address: tokenMint,
      symbol: '', // Would need to fetch from metadata
      name: '',
      decimals: data.decimals,
      supply: data.supply,
      mintAuthority: data.mintAuthority,
      freezeAuthority: data.freezeAuthority,
      createdAt: new Date()
    }
  }
  
  async getOrCreateTokenAccount(tokenMint: string): Promise<PublicKey> {
    const mintPublicKey = new PublicKey(tokenMint)
    const tokenAccount = await getAssociatedTokenAddress(
      mintPublicKey,
      this.wallet.publicKey
    )
    
    try {
      await getAccount(this.connection, tokenAccount)
      return tokenAccount
    } catch (error) {
      // Account doesn't exist, create it
      const transaction = new Transaction().add(
        createAssociatedTokenAccountInstruction(
          this.wallet.publicKey,
          tokenAccount,
          this.wallet.publicKey,
          mintPublicKey
        )
      )
      
      await sendAndConfirmTransaction(this.connection, transaction, [this.wallet])
      return tokenAccount
    }
  }
  
  async sendTransaction(transaction: Transaction): Promise<string> {
    // Add priority fee
    if (config.priorityFee > 0) {
      transaction.add(
        ComputeBudgetProgram.setComputeUnitPrice({
          microLamports: config.priorityFee
        })
      )
    }
    
    // Get latest blockhash
    const { blockhash, lastValidBlockHeight } = await this.connection.getLatestBlockhash()
    transaction.recentBlockhash = blockhash
    transaction.feePayer = this.wallet.publicKey
    
    // Sign and send
    transaction.sign(this.wallet)
    
    const signature = await this.connection.sendRawTransaction(
      transaction.serialize(),
      {
        skipPreflight: false,
        maxRetries: 3
      }
    )
    
    // Confirm transaction
    await this.connection.confirmTransaction({
      signature,
      blockhash,
      lastValidBlockHeight
    })
    
    return signature
  }
  
  async isTokenSafe(tokenMint: string): Promise<boolean> {
    try {
      const tokenInfo = await this.getTokenInfo(tokenMint)
      
      // Check if mint authority is renounced
      if (tokenInfo.mintAuthority !== null) {
        return false
      }
      
      // Check if freeze authority is renounced
      if (tokenInfo.freezeAuthority !== null) {
        return false
      }
      
      return true
    } catch (error) {
      return false
    }
  }
}
    })
    
    return signature
  }
  
  async waitForTransaction(signature: string, maxAttempts: number = 30): Promise<boolean> {
    for (let i = 0; i < maxAttempts; i++) {
      const status = await this.connection.getSignatureStatus(signature)
      
      if (status.value?.confirmationStatus === 'confirmed' || 
          status.value?.confirmationStatus === 'finalized') {
        return !status.value.err
      }
      
      await new Promise(resolve => setTimeout(resolve, 2000))
    }
    
    return false
  }
  
  async getRecentTransactions(address: string, limit: number = 10): Promise<any[]> {
    const publicKey = new PublicKey(address)
    const signatures = await this.connection.getSignaturesForAddress(publicKey, { limit })
    
    const transactions = await Promise.all(
      signatures.map(sig => this.connection.getParsedTransaction(sig.signature, {
        maxSupportedTransactionVersion: 0
      }))
    )
    
    return transactions.filter(tx => tx !== null)
  }
}
