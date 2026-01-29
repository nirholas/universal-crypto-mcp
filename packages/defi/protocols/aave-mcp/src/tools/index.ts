/**
 * @author nirholas (Nich)
 * @website x.com/nichxbt
 * @github github.com/nirholas
 * @license MIT
 */

import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js"
import { z } from "zod"
import { ethers } from "ethers"
import { Logger } from "../utils/logger.js"

// Aave V3 Pool address on Ethereum mainnet
const AAVE_V3_POOL = "0x87870Bca3F3fD6335C3F4ce8392D69350B4fA4E2"
const AAVE_V3_DATA_PROVIDER = "0x7B4EB56E7CD4b454BA8ff71E4518426369a138a3"

/**
 * Register all Aave tools with the MCP server
 */
export function registerAaveTools(server: McpServer) {
  // Tool 1: Get user account data
  server.tool(
    "aave_get_user_account",
    "Get user's Aave account data including collateral, debt, and health factor",
    {
      userAddress: z.string().describe("The user's wallet address"),
      rpcUrl: z.string().optional().describe("Custom RPC URL (defaults to public Ethereum RPC)")
    },
    async (params) => {
      try {
        const provider = new ethers.JsonRpcProvider(params.rpcUrl || "https://eth.llamarpc.com")
        
        const poolAbi = [
          "function getUserAccountData(address user) view returns (uint256 totalCollateralBase, uint256 totalDebtBase, uint256 availableBorrowsBase, uint256 currentLiquidationThreshold, uint256 ltv, uint256 healthFactor)"
        ]
        
        const pool = new ethers.Contract(AAVE_V3_POOL, poolAbi, provider)
        const accountData = await pool.getUserAccountData(params.userAddress)
        
        const healthFactor = Number(accountData[5]) / 1e18
        const isHealthy = healthFactor > 1.0 || accountData[5] === ethers.MaxUint256
        
        return {
          content: [{
            type: "text",
            text: JSON.stringify({
              userAddress: params.userAddress,
              totalCollateralUSD: ethers.formatUnits(accountData[0], 8),
              totalDebtUSD: ethers.formatUnits(accountData[1], 8),
              availableBorrowsUSD: ethers.formatUnits(accountData[2], 8),
              currentLiquidationThreshold: Number(accountData[3]) / 100 + "%",
              ltv: Number(accountData[4]) / 100 + "%",
              healthFactor: healthFactor.toFixed(4),
              status: isHealthy ? "Healthy" : "⚠️ At Risk of Liquidation",
              warning: healthFactor < 1.1 && healthFactor !== Infinity ? "Health factor is low! Consider adding collateral or repaying debt." : null
            }, null, 2)
          }]
        }
      } catch (error: any) {
        Logger.error("Error getting user account:", error)
        throw new Error(`Failed to get user account: ${error.message}`)
      }
    }
  )

  // Tool 2: Get reserve data
  server.tool(
    "aave_get_reserve_data",
    "Get detailed data about an Aave reserve (lending pool for a specific asset)",
    {
      assetAddress: z.string().describe("The asset token address"),
      rpcUrl: z.string().optional().describe("Custom RPC URL")
    },
    async (params) => {
      try {
        const provider = new ethers.JsonRpcProvider(params.rpcUrl || "https://eth.llamarpc.com")
        
        const dataProviderAbi = [
          "function getReserveData(address asset) view returns (uint256 availableLiquidity, uint256 totalStableDebt, uint256 totalVariableDebt, uint256 liquidityRate, uint256 variableBorrowRate, uint256 stableBorrowRate, uint256 averageStableBorrowRate, uint256 liquidityIndex, uint256 variableBorrowIndex, uint40 lastUpdateTimestamp)"
        ]
        
        const dataProvider = new ethers.Contract(AAVE_V3_DATA_PROVIDER, dataProviderAbi, provider)
        const reserveData = await dataProvider.getReserveData(params.assetAddress)
        
        return {
          content: [{
            type: "text",
            text: JSON.stringify({
              assetAddress: params.assetAddress,
              availableLiquidity: reserveData[0].toString(),
              totalStableDebt: reserveData[1].toString(),
              totalVariableDebt: reserveData[2].toString(),
              liquidityRate: (Number(reserveData[3]) / 1e27 * 100).toFixed(2) + "% APY",
              variableBorrowRate: (Number(reserveData[4]) / 1e27 * 100).toFixed(2) + "% APR",
              stableBorrowRate: (Number(reserveData[5]) / 1e27 * 100).toFixed(2) + "% APR",
              lastUpdate: new Date(Number(reserveData[9]) * 1000).toISOString()
            }, null, 2)
          }]
        }
      } catch (error: any) {
        Logger.error("Error getting reserve data:", error)
        throw new Error(`Failed to get reserve data: ${error.message}`)
      }
    }
  )

  // Tool 3: Get user reserve data
  server.tool(
    "aave_get_user_reserve",
    "Get user's position in a specific Aave reserve",
    {
      userAddress: z.string().describe("The user's wallet address"),
      assetAddress: z.string().describe("The asset token address"),
      rpcUrl: z.string().optional().describe("Custom RPC URL")
    },
    async (params) => {
      try {
        const provider = new ethers.JsonRpcProvider(params.rpcUrl || "https://eth.llamarpc.com")
        
        const dataProviderAbi = [
          "function getUserReserveData(address asset, address user) view returns (uint256 currentATokenBalance, uint256 currentStableDebt, uint256 currentVariableDebt, uint256 principalStableDebt, uint256 scaledVariableDebt, uint256 stableBorrowRate, uint256 liquidityRate, uint40 stableRateLastUpdated, bool usageAsCollateralEnabled)"
        ]
        
        const dataProvider = new ethers.Contract(AAVE_V3_DATA_PROVIDER, dataProviderAbi, provider)
        const userReserve = await dataProvider.getUserReserveData(params.assetAddress, params.userAddress)
        
        return {
          content: [{
            type: "text",
            text: JSON.stringify({
              userAddress: params.userAddress,
              assetAddress: params.assetAddress,
              supplied: userReserve[0].toString(),
              stableDebt: userReserve[1].toString(),
              variableDebt: userReserve[2].toString(),
              usedAsCollateral: userReserve[8],
              supplying: userReserve[0] > 0n ? "Yes" : "No",
              borrowing: (userReserve[1] + userReserve[2]) > 0n ? "Yes" : "No"
            }, null, 2)
          }]
        }
      } catch (error: any) {
        Logger.error("Error getting user reserve:", error)
        throw new Error(`Failed to get user reserve: ${error.message}`)
      }
    }
  )

  // Tool 4: Get all reserves
  server.tool(
    "aave_get_all_reserves",
    "Get list of all available reserves in Aave V3",
    {
      rpcUrl: z.string().optional().describe("Custom RPC URL")
    },
    async (params) => {
      try {
        // Return well-known Aave V3 reserves on Ethereum
        const reserves = [
          { symbol: "WETH", address: "0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2", aToken: "0x4d5F47FA6A74757f35C14fD3a6Ef8E3C9BC514E8" },
          { symbol: "USDC", address: "0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48", aToken: "0x98C23E9d8f34FEFb1B7BD6a91B7FF122F4e16F5c" },
          { symbol: "USDT", address: "0xdAC17F958D2ee523a2206206994597C13D831ec7", aToken: "0x23878914EFE38d27C4D67Ab83ed1b93A74D4086a" },
          { symbol: "DAI", address: "0x6B175474E89094C44Da98b954EedeAC495271d0F", aToken: "0x018008bfb33d285247A21d44E50697654f754e63" },
          { symbol: "WBTC", address: "0x2260FAC5E5542a773Aa44fBCfeDf7C193bc2C599", aToken: "0x5Ee5bf7ae06D1Be5997A1A72006FE6C607eC6DE8" },
          { symbol: "LINK", address: "0x514910771AF9Ca656af840dff83E8264EcF986CA", aToken: "0x5E8C8A7243651DB1384C0dDfDbE39761E8e7E51a" },
          { symbol: "AAVE", address: "0x7Fc66500c84A76Ad7e9c93437bFc5Ac33E2DDaE9", aToken: "0xA700b4eB416Be35b2911fd5Dee80678ff64fF6C9" }
        ]
        
        return {
          content: [{
            type: "text",
            text: JSON.stringify(reserves, null, 2)
          }]
        }
      } catch (error: any) {
        Logger.error("Error getting reserves:", error)
        throw new Error(`Failed to get reserves: ${error.message}`)
      }
    }
  )

  Logger.info("✅ Registered Aave tools")
}
