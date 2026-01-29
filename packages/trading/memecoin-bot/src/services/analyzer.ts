/**
 * Token Safety and Analysis Service
 * Author: nich (@nirholas) - x.com/nichxbt
 */

import { PublicKey } from '@solana/web3.js'
import { SolanaService } from './solana'
import { TokenSafetyCheck, TokenInfo } from '../types'
import axios from 'axios'
import { config } from '../config/config'

export class TokenAnalyzer {
  private solana: SolanaService
  
  constructor(solana: SolanaService) {
    this.solana = solana
  }
  
  async analyzeToken(tokenAddress: string): Promise<TokenSafetyCheck> {
    const issues: string[] = []
    const warnings: string[] = []
    let score = 100
    
    try {
      const tokenInfo = await this.solana.getTokenInfo(tokenAddress)
      
      // Check 1: Mint authority
      const mintAuthorityRenounced = tokenInfo.mintAuthority === null
      if (!mintAuthorityRenounced) {
        issues.push('Mint authority not renounced - supply can be inflated')
        score -= 30
      }
      
      // Check 2: Freeze authority
      const freezeAuthorityRenounced = tokenInfo.freezeAuthority === null
      if (!freezeAuthorityRenounced) {
        issues.push('Freeze authority not renounced - tokens can be frozen')
        score -= 30
      }
      
      // Check 3: Top holders
      const topHolderCheck = await this.checkTopHolders(tokenAddress)
      if (!topHolderCheck) {
        warnings.push('Top holders control significant supply')
        score -= 10
      }
      
      // Check 4: Liquidity lock (if Raydium)
      const liquidityLocked = await this.checkLiquidityLock(tokenAddress)
      if (!liquidityLocked) {
        warnings.push('Liquidity not locked or unverified')
        score -= 15
      }
      
      // Check 5: Rug pull risk
      const rugPullRisk = await this.checkRugPullRisk(tokenAddress)
      if (rugPullRisk) {
        issues.push('High rug pull risk detected')
        score -= 20
      }
      
      const isSafe = score >= 60 && issues.length === 0
      
      return {
        isSafe,
        issues,
        warnings,
        score: Math.max(0, score),
        checks: {
          mintAuthorityRenounced,
          freezeAuthorityRenounced,
          liquidityLocked,
          ownershipRenounced: true, // N/A for SPL tokens
          topHolderCheck,
          rugPullRisk
        }
      }
    } catch (error: any) {
      return {
        isSafe: false,
        issues: [`Analysis failed: ${error.message}`],
        warnings: [],
        score: 0,
        checks: {
          mintAuthorityRenounced: false,
          freezeAuthorityRenounced: false,
          liquidityLocked: false,
          ownershipRenounced: false,
          topHolderCheck: false,
          rugPullRisk: true
        }
      }
    }
  }
  
  private async checkTopHolders(tokenAddress: string): Promise<boolean> {
    try {
      // Use Helius API if available
      if (config.heliusApiKey) {
        const response = await axios.post(`https://mainnet.helius-rpc.com/?api-key=${config.heliusApiKey}`, {
          jsonrpc: '2.0',
          id: 'helius-test',
          method: 'getTokenLargestAccounts',
          params: [tokenAddress]
        })
        
        if (response.data.result?.value) {
          const accounts = response.data.result.value
          const totalSupply = accounts.reduce((sum: number, acc: any) => 
            sum + parseInt(acc.amount), 0)
          
          // Check if top holder has more than 20%
          const topHolderAmount = parseInt(accounts[0]?.amount || '0')
          const topHolderPercentage = (topHolderAmount / totalSupply) * 100
          
          return topHolderPercentage <= 20
        }
      }
      
      // Fallback to basic check
      const mintPubkey = new PublicKey(tokenAddress)
      const largestAccounts = await this.solana.getConnection()
        .getTokenLargestAccounts(mintPubkey)
      
      if (largestAccounts.value.length === 0) return false
      
      const totalSupply = largestAccounts.value.reduce((sum, acc) => 
        sum + Number(acc.amount), 0)
      const topHolderAmount = Number(largestAccounts.value[0].amount)
      const topHolderPercentage = (topHolderAmount / totalSupply) * 100
      
      return topHolderPercentage <= 20
    } catch (error) {
      return false
    }
  }
  
  private async checkLiquidityLock(tokenAddress: string): Promise<boolean> {
    // This is complex and would require checking specific lock programs
    // For now, return false (conservative approach)
    // In production, integrate with services like RugCheck.xyz API
    return false
  }
  
  private async checkRugPullRisk(tokenAddress: string): Promise<boolean> {
    try {
      // Use RugCheck API if available
      const response = await axios.get(`https://api.rugcheck.xyz/v1/tokens/${tokenAddress}/report`)
      
      if (response.data) {
        const risk = response.data.risks || []
        return risk.some((r: any) => r.level === 'danger')
      }
    } catch (error) {
      // API not available or token not found
    }
    
    return false
  }
  
  async isHoneypot(tokenAddress: string): Promise<boolean> {
    try {
      // Try to simulate a small buy and sell
      // If sell fails, it's likely a honeypot
      // This is a simplified check
      
      const tokenInfo = await this.solana.getTokenInfo(tokenAddress)
      
      // If freeze authority exists, high honeypot risk
      if (tokenInfo.freezeAuthority !== null) {
        return true
      }
      
      return false
    } catch (error) {
      return true // Conservative approach
    }
  }
}
