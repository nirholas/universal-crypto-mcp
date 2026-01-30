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

// Compound V3 (Comet) addresses on Ethereum mainnet
const COMPOUND_V3_USDC = "0xc3d688B66703497DAA19211EEdff47f25384cdc3"
const COMPOUND_V3_ETH = "0xA17581A9E3356d9A858b789D68B4d866e593aE94"

/**
 * Register all Compound V3 tools with the MCP server
 */
export function registerCompoundV3Tools(server: McpServer) {
  // Tool 1: Get market info
  server.tool(
    "compound_v3_get_market_info",
    "Get detailed information about a Compound V3 market (Comet)",
    {
      cometAddress: z.string().optional().describe("Comet contract address (defaults to USDC market)"),
      rpcUrl: z.string().optional().describe("Custom RPC URL")
    },
    async (params) => {
      try {
        const provider = new ethers.JsonRpcProvider(params.rpcUrl || "https://eth.llamarpc.com")
        const comet = params.cometAddress || COMPOUND_V3_USDC
        
        const cometAbi = [
          "function totalSupply() view returns (uint256)",
          "function totalBorrow() view returns (uint256)",
          "function getSupplyRate(uint256 utilization) view returns (uint64)",
          "function getBorrowRate(uint256 utilization) view returns (uint64)",
          "function getUtilization() view returns (uint256)",
          "function baseToken() view returns (address)",
          "function baseTokenPriceFeed() view returns (address)"
        ]
        
        const contract = new ethers.Contract(comet, cometAbi, provider)
        
        const [totalSupply, totalBorrow, utilization, baseToken] = await Promise.all([
          contract.totalSupply(),
          contract.totalBorrow(),
          contract.getUtilization(),
          contract.baseToken()
        ])
        
        const supplyRate = await contract.getSupplyRate(utilization)
        const borrowRate = await contract.getBorrowRate(utilization)
        
        // Convert per-second rates to APY
        const secondsPerYear = 31536000n
        const supplyAPY = (Number(supplyRate) * Number(secondsPerYear) / 1e18 * 100).toFixed(2)
        const borrowAPY = (Number(borrowRate) * Number(secondsPerYear) / 1e18 * 100).toFixed(2)
        
        return {
          content: [{
            type: "text",
            text: JSON.stringify({
              cometAddress: comet,
              baseToken,
              totalSupply: totalSupply.toString(),
              totalBorrow: totalBorrow.toString(),
              utilization: (Number(utilization) / 1e18 * 100).toFixed(2) + "%",
              supplyAPY: supplyAPY + "%",
              borrowAPY: borrowAPY + "%"
            }, null, 2)
          }]
        }
      } catch (error: any) {
        Logger.error("Error getting market info:", error)
        throw new Error(`Failed to get market info: ${error.message}`)
      }
    }
  )

  // Tool 2: Get user account
  server.tool(
    "compound_v3_get_user_account",
    "Get user's position in a Compound V3 market",
    {
      userAddress: z.string().describe("The user's wallet address"),
      cometAddress: z.string().optional().describe("Comet contract address"),
      rpcUrl: z.string().optional().describe("Custom RPC URL")
    },
    async (params) => {
      try {
        const provider = new ethers.JsonRpcProvider(params.rpcUrl || "https://eth.llamarpc.com")
        const comet = params.cometAddress || COMPOUND_V3_USDC
        
        const cometAbi = [
          "function balanceOf(address account) view returns (int256)",
          "function borrowBalanceOf(address account) view returns (uint256)",
          "function collateralBalanceOf(address account, address asset) view returns (uint128)",
          "function isLiquidatable(address account) view returns (bool)",
          "function isBorrowCollateralized(address account) view returns (bool)"
        ]
        
        const contract = new ethers.Contract(comet, cometAbi, provider)
        
        const [balance, borrowBalance, isLiquidatable, isCollateralized] = await Promise.all([
          contract.balanceOf(params.userAddress),
          contract.borrowBalanceOf(params.userAddress),
          contract.isLiquidatable(params.userAddress),
          contract.isBorrowCollateralized(params.userAddress)
        ])
        
        return {
          content: [{
            type: "text",
            text: JSON.stringify({
              userAddress: params.userAddress,
              cometAddress: comet,
              balance: balance.toString(),
              borrowBalance: borrowBalance.toString(),
              isLiquidatable,
              isCollateralized,
              status: isLiquidatable ? "⚠️ Liquidatable" : "✅ Healthy"
            }, null, 2)
          }]
        }
      } catch (error: any) {
        Logger.error("Error getting user account:", error)
        throw new Error(`Failed to get user account: ${error.message}`)
      }
    }
  )

  // Tool 3: Get collateral assets
  server.tool(
    "compound_v3_get_collateral_info",
    "Get information about collateral assets in a Compound V3 market",
    {
      cometAddress: z.string().optional().describe("Comet contract address"),
      assetAddress: z.string().describe("The collateral asset address"),
      rpcUrl: z.string().optional().describe("Custom RPC URL")
    },
    async (params) => {
      try {
        const provider = new ethers.JsonRpcProvider(params.rpcUrl || "https://eth.llamarpc.com")
        const comet = params.cometAddress || COMPOUND_V3_USDC
        
        const cometAbi = [
          "function getAssetInfo(uint8 i) view returns (uint8 offset, address asset, address priceFeed, uint64 scale, uint64 borrowCollateralFactor, uint64 liquidateCollateralFactor, uint64 liquidationFactor, uint128 supplyCap)",
          "function totalsCollateral(address asset) view returns (uint128 totalSupplyAsset, uint128 _reserved)"
        ]
        
        const contract = new ethers.Contract(comet, cometAbi, provider)
        
        const totals = await contract.totalsCollateral(params.assetAddress)
        
        return {
          content: [{
            type: "text",
            text: JSON.stringify({
              cometAddress: comet,
              assetAddress: params.assetAddress,
              totalSupplied: totals[0].toString(),
              note: "Use getAssetInfo with index to get full collateral configuration"
            }, null, 2)
          }]
        }
      } catch (error: any) {
        Logger.error("Error getting collateral info:", error)
        throw new Error(`Failed to get collateral info: ${error.message}`)
      }
    }
  )

  // Tool 4: Get available markets
  server.tool(
    "compound_v3_get_markets",
    "Get list of available Compound V3 markets",
    {},
    async () => {
      try {
        const markets = [
          { name: "USDC Market", address: COMPOUND_V3_USDC, baseToken: "USDC", chain: "Ethereum" },
          { name: "ETH Market", address: COMPOUND_V3_ETH, baseToken: "WETH", chain: "Ethereum" },
          { name: "USDC Market (Arbitrum)", address: "0xA5EDBDD9646f8dFF606d7448e414884C7d905dCA", baseToken: "USDC", chain: "Arbitrum" },
          { name: "USDC Market (Polygon)", address: "0xF25212E676D1F7F89Cd72fFEe66158f541246445", baseToken: "USDC", chain: "Polygon" },
          { name: "USDC Market (Base)", address: "0xb125E6687d4313864e53df431d5425969c15Eb2F", baseToken: "USDC", chain: "Base" }
        ]
        
        return {
          content: [{
            type: "text",
            text: JSON.stringify(markets, null, 2)
          }]
        }
      } catch (error: any) {
        Logger.error("Error getting markets:", error)
        throw new Error(`Failed to get markets: ${error.message}`)
      }
    }
  )

  Logger.info("✅ Registered Compound V3 tools")
}
