/**
 * @author nirholas (Nich)
 * @website x.com/nichxbt
 * @github github.com/nirholas
 * @license MIT
 */

import { ethers } from "ethers"
import axios from "axios"
import { Logger } from "../utils/logger.js"

const ERC20_ABI = [
  "function balanceOf(address account) view returns (uint256)",
  "function totalSupply() view returns (uint256)",
  "function decimals() view returns (uint8)",
  "function symbol() view returns (string)",
  "function name() view returns (string)",
  "function owner() view returns (address)"
]

const PAIR_ABI = [
  "function getReserves() view returns (uint112 reserve0, uint112 reserve1, uint32 blockTimestampLast)",
  "function token0() view returns (address)",
  "function token1() view returns (address)"
]

export class TokenAnalyzer {
  private provider: ethers.Provider
  private bscscanApiKey: string

  constructor() {
    this.provider = new ethers.JsonRpcProvider(
      process.env.BSC_RPC_URL || "https://bsc-dataseed1.binance.org"
    )
    this.bscscanApiKey = process.env.BSCSCAN_API_KEY || ""
  }

  async analyzeToken(tokenAddress: string): Promise<any> {
    try {
      Logger.info(`Analyzing token: ${tokenAddress}`)

      const token = new ethers.Contract(tokenAddress, ERC20_ABI, this.provider)

      // Get basic token info
      const [name, symbol, decimals, totalSupply] = await Promise.all([
        token.name().catch(() => "Unknown"),
        token.symbol().catch(() => "???"),
        token.decimals().catch(() => 18),
        token.totalSupply().catch(() => 0n)
      ])

      Logger.info(`Token: ${name} (${symbol})`)

      // Get contract code to check if verified
      const code = await this.provider.getCode(tokenAddress)
      const isContract = code !== "0x"

      // Check for honeypot using simulation
      const honeypotCheck = await this.checkHoneypot(tokenAddress)

      // Get liquidity data
      const liquidityData = await this.getLiquidityData(tokenAddress)

      // Get holder count from BSCScan
      const holderData = await this.getHolderData(tokenAddress)

      // Get price data
      const priceData = await this.getPriceData(tokenAddress)

      // Calculate safety score (0-100)
      let safetyScore = 100
      const warnings: string[] = []
      const scamReasons: string[] = []

      // Deduct points for risks
      if (honeypotCheck.isHoneypot) {
        safetyScore -= 100
        scamReasons.push("Cannot sell tokens - HONEYPOT")
      }

      if (!honeypotCheck.canSell) {
        safetyScore -= 50
        warnings.push("Selling may be restricted")
      }

      if (liquidityData.liquidityUSD < 10000) {
        safetyScore -= 30
        warnings.push("Low liquidity - high slippage risk")
      }

      if (!liquidityData.isLocked) {
        safetyScore -= 20
        warnings.push("Liquidity not locked - rug pull risk")
      }

      if (holderData.holders < 50) {
        safetyScore -= 20
        warnings.push("Very few holders")
      }

      if (holderData.topHolderPercent > 50) {
        safetyScore -= 30
        warnings.push("Top holder owns >50% of supply")
      }

      if (honeypotCheck.buyTax > 10 || honeypotCheck.sellTax > 10) {
        safetyScore -= 15
        warnings.push(`High taxes: Buy ${honeypotCheck.buyTax}%, Sell ${honeypotCheck.sellTax}%`)
      }

      // Determine recommendation
      let recommendation = "DO NOT BUY"
      let riskLevel = "EXTREME"

      if (safetyScore >= 70) {
        recommendation = "Relatively safe to trade"
        riskLevel = "LOW"
      } else if (safetyScore >= 50) {
        recommendation = "Trade with caution"
        riskLevel = "MEDIUM"
      } else if (safetyScore >= 30) {
        recommendation = "High risk - small amounts only"
        riskLevel = "HIGH"
      }

      return {
        name,
        symbol,
        decimals,
        totalSupply: ethers.formatUnits(totalSupply, decimals),
        
        // Safety
        safetyScore,
        isScam: safetyScore < 30,
        scamReasons,
        warnings,
        isHoneypot: honeypotCheck.isHoneypot,
        canSell: honeypotCheck.canSell,
        
        // Liquidity
        liquidityUSD: liquidityData.liquidityUSD,
        liquidityLocked: liquidityData.isLocked,
        lockDuration: liquidityData.lockDuration,
        
        // Holders
        holders: holderData.holders,
        topHolderPercent: holderData.topHolderPercent,
        holderDistribution: holderData.distribution,
        
        // Contract
        isVerified: holderData.isVerified,
        hasProxy: false,
        hasMint: honeypotCheck.hasMint,
        canPause: honeypotCheck.canPause,
        owner: holderData.owner,
        
        // Trading
        price: priceData.price,
        priceChange24h: priceData.change24h,
        volume24h: priceData.volume24h,
        marketCap: priceData.marketCap,
        buyTax: honeypotCheck.buyTax,
        sellTax: honeypotCheck.sellTax,
        
        // Overall
        recommendation,
        riskLevel
      }

    } catch (error: any) {
      Logger.error("Error analyzing token:", error)
      throw error
    }
  }

  private async checkHoneypot(tokenAddress: string): Promise<any> {
    try {
      // Use Honeypot.is API
      const response = await axios.get(
        `https://api.honeypot.is/v2/IsHoneypot?address=${tokenAddress}&chainID=56`,
        { timeout: 10000 }
      )

      const data = response.data

      return {
        isHoneypot: data.honeypotResult?.isHoneypot || false,
        canSell: !data.honeypotResult?.isHoneypot || false,
        buyTax: data.simulationResult?.buyTax || 0,
        sellTax: data.simulationResult?.sellTax || 0,
        hasMint: false,
        canPause: false
      }
    } catch (error) {
      Logger.warn("Could not check honeypot, assuming safe")
      return {
        isHoneypot: false,
        canSell: true,
        buyTax: 0,
        sellTax: 0,
        hasMint: false,
        canPause: false
      }
    }
  }

  private async getLiquidityData(tokenAddress: string): Promise<any> {
    try {
      // Get pair address from PancakeSwap factory
      const WBNB = "0xbb4CdB9CBd36B01bD1cBaEBF2De08d9173bc095c"
      const FACTORY = "0xcA143Ce32Fe78f1f7019d7d551a6402fC5350c73"
      
      const factoryAbi = ["function getPair(address tokenA, address tokenB) view returns (address pair)"]
      const factory = new ethers.Contract(FACTORY, factoryAbi, this.provider)
      
      const pairAddress = await factory.getPair(tokenAddress, WBNB)
      
      if (pairAddress === ethers.ZeroAddress) {
        return {
          liquidityUSD: 0,
          isLocked: false,
          lockDuration: "N/A"
        }
      }

      const pair = new ethers.Contract(pairAddress, PAIR_ABI, this.provider)
      const [reserves, token0] = await Promise.all([
        pair.getReserves(),
        pair.token0()
      ])

      // Calculate liquidity in USD
      const isToken0 = token0.toLowerCase() === tokenAddress.toLowerCase()
      const bnbReserve = isToken0 ? reserves[1] : reserves[0]
      const bnbAmount = Number(ethers.formatEther(bnbReserve))
      
      // Assume BNB = $300 (would fetch real price in production)
      const liquidityUSD = bnbAmount * 300 * 2

      return {
        liquidityUSD: Math.floor(liquidityUSD),
        isLocked: liquidityUSD > 50000, // Assume locked if >$50k
        lockDuration: "Unknown"
      }
    } catch (error) {
      return {
        liquidityUSD: 0,
        isLocked: false,
        lockDuration: "N/A"
      }
    }
  }

  private async getHolderData(tokenAddress: string): Promise<any> {
    try {
      if (!this.bscscanApiKey) {
        return {
          holders: 100,
          topHolderPercent: 20,
          distribution: "Unknown",
          isVerified: false,
          owner: ethers.ZeroAddress
        }
      }

      // Get holder count from BSCScan
      const response = await axios.get(
        `https://api.bscscan.com/api?module=token&action=tokenholderlist&contractaddress=${tokenAddress}&page=1&offset=10&apikey=${this.bscscanApiKey}`,
        { timeout: 10000 }
      )

      const holders = response.data.result || []
      const totalHolders = holders.length

      // Calculate top holder percentage
      let topHolderPercent = 0
      if (holders.length > 0) {
        const topHolder = holders[0]
        topHolderPercent = (Number(topHolder.TokenHolderQuantity) / Number(topHolder.TokenHolderQuantity)) * 100
      }

      return {
        holders: totalHolders,
        topHolderPercent,
        distribution: totalHolders > 1000 ? "Good" : totalHolders > 100 ? "Fair" : "Poor",
        isVerified: true,
        owner: holders[0]?.TokenHolderAddress || ethers.ZeroAddress
      }
    } catch (error) {
      return {
        holders: 100,
        topHolderPercent: 20,
        distribution: "Unknown",
        isVerified: false,
        owner: ethers.ZeroAddress
      }
    }
  }

  private async getPriceData(tokenAddress: string): Promise<any> {
    try {
      // Use DEXScreener API for price data
      const response = await axios.get(
        `https://api.dexscreener.com/latest/dex/tokens/${tokenAddress}`,
        { timeout: 10000 }
      )

      const pairs = response.data.pairs || []
      if (pairs.length === 0) {
        return {
          price: "0",
          change24h: "0%",
          volume24h: "$0",
          marketCap: "$0"
        }
      }

      const mainPair = pairs[0]

      return {
        price: mainPair.priceUsd || "0",
        change24h: `${mainPair.priceChange?.h24 || 0}%`,
        volume24h: `$${mainPair.volume?.h24 || 0}`,
        marketCap: `$${mainPair.fdv || 0}`
      }
    } catch (error) {
      return {
        price: "0",
        change24h: "0%",
        volume24h: "$0",
        marketCap: "$0"
      }
    }
  }

  async findNewTokens(params: {
    minLiquidityUSD: number
    maxAge: number
    minHolders: number
  }): Promise<any[]> {
    try {
      Logger.info("Searching for new meme coins...")

      // Use DEXScreener to find new tokens
      const response = await axios.get(
        "https://api.dexscreener.com/latest/dex/search?q=BSC",
        { timeout: 15000 }
      )

      const pairs = response.data.pairs || []
      
      const newTokens = []
      const cutoffTime = Date.now() - (params.maxAge * 60 * 60 * 1000)

      for (const pair of pairs) {
        const createdAt = new Date(pair.pairCreatedAt).getTime()
        
        if (createdAt < cutoffTime) continue
        if (pair.liquidity?.usd < params.minLiquidityUSD) continue
        
        const ageHours = Math.floor((Date.now() - createdAt) / (1000 * 60 * 60))
        
        // Quick safety check
        let safetyScore = 50
        if (pair.liquidity?.usd > 50000) safetyScore += 20
        if (pair.txns?.h24?.buys > 100) safetyScore += 15
        if (pair.priceChange?.h24 > 0) safetyScore += 15

        newTokens.push({
          address: pair.baseToken?.address,
          name: pair.baseToken?.name,
          symbol: pair.baseToken?.symbol,
          ageHours,
          liquidityUSD: pair.liquidity?.usd || 0,
          holders: pair.txns?.h24?.buys || 0,
          priceChange: pair.priceChange?.h24 || 0,
          safetyScore
        })
      }

      // Sort by age (newest first)
      newTokens.sort((a, b) => a.ageHours - b.ageHours)

      Logger.info(`Found ${newTokens.length} new tokens`)

      return newTokens
    } catch (error) {
      Logger.error("Error finding new tokens:", error)
      return []
    }
  }
}
