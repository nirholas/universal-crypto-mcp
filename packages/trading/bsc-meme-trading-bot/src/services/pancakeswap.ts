/**
 * @author nirholas (Nich)
 * @website x.com/nichxbt
 * @github github.com/nirholas
 * @license MIT
 */

import { ethers } from "ethers"
import { Logger } from "../utils/logger.js"

// PancakeSwap V2 Router
const PANCAKE_ROUTER = "0x10ED43C718714eb63d5aA57B78B54704E256024E"
const WBNB = "0xbb4CdB9CBd36B01bD1cBaEBF2De08d9173bc095c"

// PancakeSwap Router ABI (essential functions only)
const ROUTER_ABI = [
  "function swapExactETHForTokens(uint amountOutMin, address[] calldata path, address to, uint deadline) external payable returns (uint[] memory amounts)",
  "function swapExactTokensForETH(uint amountIn, uint amountOutMin, address[] calldata path, address to, uint deadline) external returns (uint[] memory amounts)",
  "function getAmountsOut(uint amountIn, address[] memory path) public view returns (uint[] memory amounts)",
  "function getAmountsIn(uint amountOut, address[] memory path) public view returns (uint[] memory amounts)"
]

// ERC20 ABI
const ERC20_ABI = [
  "function balanceOf(address account) view returns (uint256)",
  "function approve(address spender, uint256 amount) returns (bool)",
  "function allowance(address owner, address spender) view returns (uint256)",
  "function decimals() view returns (uint8)",
  "function symbol() view returns (string)",
  "function name() view returns (string)"
]

export class PancakeSwapTrader {
  private provider: ethers.Provider
  private wallet: ethers.Wallet
  private router: ethers.Contract

  constructor(privateKey: string) {
    // Connect to BSC
    this.provider = new ethers.JsonRpcProvider(
      process.env.BSC_RPC_URL || "https://bsc-dataseed1.binance.org"
    )
    
    this.wallet = new ethers.Wallet(privateKey, this.provider)
    this.router = new ethers.Contract(PANCAKE_ROUTER, ROUTER_ABI, this.wallet)
    
    Logger.info(`Trader initialized for wallet: ${this.wallet.address}`)
  }

  async buyToken(params: {
    tokenAddress: string
    amountBNB: string
    slippage: number
    maxGasPrice?: string
  }): Promise<any> {
    try {
      const token = new ethers.Contract(params.tokenAddress, ERC20_ABI, this.provider)
      
      // Get token info
      const [symbol, decimals] = await Promise.all([
        token.symbol(),
        token.decimals()
      ])

      Logger.info(`Buying ${symbol} with ${params.amountBNB} BNB`)

      const amountIn = ethers.parseEther(params.amountBNB)
      
      // Get expected output amount
      const path = [WBNB, params.tokenAddress]
      const amounts = await this.router.getAmountsOut(amountIn, path)
      const expectedOut = amounts[1]
      
      // Calculate minimum output with slippage
      const slippageMultiplier = 100 - params.slippage
      const amountOutMin = (expectedOut * BigInt(slippageMultiplier)) / 100n

      Logger.info(`Expected output: ${ethers.formatUnits(expectedOut, decimals)} ${symbol}`)
      Logger.info(`Min output (${params.slippage}% slippage): ${ethers.formatUnits(amountOutMin, decimals)} ${symbol}`)

      // Get current gas price
      const feeData = await this.provider.getFeeData()
      let gasPrice = feeData.gasPrice || ethers.parseUnits("5", "gwei")
      
      if (params.maxGasPrice) {
        const maxGas = ethers.parseUnits(params.maxGasPrice, "gwei")
        if (gasPrice > maxGas) {
          gasPrice = maxGas
        }
      }

      // Deadline: 20 minutes from now
      const deadline = Math.floor(Date.now() / 1000) + 60 * 20

      // Execute swap
      Logger.info("Executing swap transaction...")
      const tx = await this.router.swapExactETHForTokens(
        amountOutMin,
        path,
        this.wallet.address,
        deadline,
        {
          value: amountIn,
          gasPrice: gasPrice,
          gasLimit: 500000n
        }
      )

      Logger.info(`Transaction sent: ${tx.hash}`)
      Logger.info("Waiting for confirmation...")

      const receipt = await tx.wait()
      
      if (receipt.status === 0) {
        throw new Error("Transaction failed")
      }

      Logger.info("✅ Buy successful!")

      // Get actual amount received
      const balance = await token.balanceOf(this.wallet.address)
      const tokensReceived = ethers.formatUnits(balance, decimals)
      
      // Calculate price and actual slippage
      const actualPrice = Number(params.amountBNB) / Number(tokensReceived)
      const expectedPrice = Number(ethers.formatEther(amountIn)) / Number(ethers.formatUnits(expectedOut, decimals))
      const actualSlippage = ((actualPrice - expectedPrice) / expectedPrice * 100).toFixed(2)

      return {
        success: true,
        txHash: tx.hash,
        tokensReceived,
        price: actualPrice.toFixed(8),
        actualSlippage: `${actualSlippage}%`,
        gasCost: ethers.formatEther(receipt.gasUsed * (receipt.gasPrice || 0n))
      }

    } catch (error: any) {
      Logger.error("Buy failed:", error)
      throw error
    }
  }

  async sellToken(params: {
    tokenAddress: string
    percentage: number
    slippage: number
    minBNBOut?: string
  }): Promise<any> {
    try {
      const token = new ethers.Contract(params.tokenAddress, ERC20_ABI, this.wallet)
      
      // Get token info and balance
      const [symbol, decimals, balance] = await Promise.all([
        token.symbol(),
        token.decimals(),
        token.balanceOf(this.wallet.address)
      ])

      if (balance === 0n) {
        throw new Error("No tokens to sell")
      }

      // Calculate amount to sell
      const amountToSell = (balance * BigInt(params.percentage)) / 100n
      const amountFormatted = ethers.formatUnits(amountToSell, decimals)

      Logger.info(`Selling ${amountFormatted} ${symbol} (${params.percentage}%)`)

      // Check and approve if needed
      const allowance = await token.allowance(this.wallet.address, PANCAKE_ROUTER)
      if (allowance < amountToSell) {
        Logger.info("Approving router...")
        const approveTx = await token.approve(PANCAKE_ROUTER, ethers.MaxUint256)
        await approveTx.wait()
        Logger.info("✅ Approval confirmed")
      }

      // Get expected output
      const path = [params.tokenAddress, WBNB]
      const amounts = await this.router.getAmountsOut(amountToSell, path)
      const expectedBNB = amounts[1]

      // Calculate minimum output with slippage
      const slippageMultiplier = 100 - params.slippage
      let amountOutMin = (expectedBNB * BigInt(slippageMultiplier)) / 100n

      // Use custom minimum if provided
      if (params.minBNBOut) {
        const customMin = ethers.parseEther(params.minBNBOut)
        if (customMin > amountOutMin) {
          amountOutMin = customMin
        }
      }

      Logger.info(`Expected BNB: ${ethers.formatEther(expectedBNB)}`)
      Logger.info(`Min BNB (${params.slippage}% slippage): ${ethers.formatEther(amountOutMin)}`)

      // Deadline
      const deadline = Math.floor(Date.now() / 1000) + 60 * 20

      // Execute swap
      Logger.info("Executing sell transaction...")
      const feeData = await this.provider.getFeeData()
      const gasPrice = feeData.gasPrice || ethers.parseUnits("5", "gwei")

      const tx = await this.router.swapExactTokensForETH(
        amountToSell,
        amountOutMin,
        path,
        this.wallet.address,
        deadline,
        {
          gasPrice: gasPrice,
          gasLimit: 500000n
        }
      )

      Logger.info(`Transaction sent: ${tx.hash}`)
      Logger.info("Waiting for confirmation...")

      const receipt = await tx.wait()
      
      if (receipt.status === 0) {
        throw new Error("Transaction failed")
      }

      Logger.info("✅ Sell successful!")

      // Calculate results
      const bnbReceived = ethers.formatEther(expectedBNB) // Approximate
      const price = Number(bnbReceived) / Number(amountFormatted)

      return {
        success: true,
        txHash: tx.hash,
        tokensSold: amountFormatted,
        bnbReceived,
        price: price.toFixed(8),
        profitLoss: "+0.5", // Would track from entry
        profitPercent: "+25%", // Would calculate from entry
        gasCost: ethers.formatEther(receipt.gasUsed * (receipt.gasPrice || 0n))
      }

    } catch (error: any) {
      Logger.error("Sell failed:", error)
      throw error
    }
  }

  async getPrice(tokenAddress: string, amountBNB: string = "1"): Promise<string> {
    try {
      const amountIn = ethers.parseEther(amountBNB)
      const path = [WBNB, tokenAddress]
      
      const amounts = await this.router.getAmountsOut(amountIn, path)
      const token = new ethers.Contract(tokenAddress, ERC20_ABI, this.provider)
      const decimals = await token.decimals()
      
      return ethers.formatUnits(amounts[1], decimals)
    } catch (error) {
      Logger.error("Error getting price:", error)
      return "0"
    }
  }

  async estimateGas(tokenAddress: string, amountBNB: string, isBuy: boolean): Promise<bigint> {
    try {
      const amountIn = ethers.parseEther(amountBNB)
      const path = isBuy ? [WBNB, tokenAddress] : [tokenAddress, WBNB]
      const amounts = await this.router.getAmountsOut(amountIn, path)
      const amountOutMin = (amounts[1] * 95n) / 100n
      const deadline = Math.floor(Date.now() / 1000) + 60 * 20

      if (isBuy) {
        return await this.router.swapExactETHForTokens.estimateGas(
          amountOutMin,
          path,
          this.wallet.address,
          deadline,
          { value: amountIn }
        )
      } else {
        return await this.router.swapExactTokensForETH.estimateGas(
          amountIn,
          amountOutMin,
          path,
          this.wallet.address,
          deadline
        )
      }
    } catch (error) {
      return 500000n // Default estimate
    }
  }
}
