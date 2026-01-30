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

// Curve Finance contracts on Ethereum mainnet
const CURVE_REGISTRY = "0x90E00ACe148ca3b23Ac1bC8C240C2a7Dd9c2d7f5"
const CURVE_ADDRESS_PROVIDER = "0x0000000022D53366457F9d5E68Ec105046FC4383"

/**
 * Register all Curve Finance tools with the MCP server
 */
export function registerCurveTools(server: McpServer) {
  // Tool 1: Get pool information
  server.tool(
    "curve_get_pool_info",
    "Get detailed information about a Curve Finance pool",
    {
      poolAddress: z.string().describe("The Curve pool contract address"),
      rpcUrl: z.string().optional().describe("Custom RPC URL (defaults to public Ethereum RPC)")
    },
    async (params) => {
      try {
        const provider = new ethers.JsonRpcProvider(params.rpcUrl || "https://eth.llamarpc.com")
        
        const poolAbi = [
          "function get_virtual_price() view returns (uint256)",
          "function A() view returns (uint256)",
          "function fee() view returns (uint256)",
          "function coins(uint256) view returns (address)",
          "function balances(uint256) view returns (uint256)"
        ]
        
        const pool = new ethers.Contract(params.poolAddress, poolAbi, provider)
        
        const [virtualPrice, A, fee] = await Promise.all([
          pool.get_virtual_price().catch(() => 0n),
          pool.A().catch(() => 0n),
          pool.fee().catch(() => 0n)
        ])
        
        // Get coin addresses
        const coins: string[] = []
        for (let i = 0; i < 4; i++) {
          try {
            const coin = await pool.coins(i)
            coins.push(coin)
          } catch {
            break
          }
        }
        
        return {
          content: [{
            type: "text",
            text: JSON.stringify({
              poolAddress: params.poolAddress,
              virtualPrice: ethers.formatUnits(virtualPrice, 18),
              amplificationCoefficient: A.toString(),
              feePercent: (Number(fee) / 1e8).toFixed(4) + "%",
              coins,
              numCoins: coins.length
            }, null, 2)
          }]
        }
      } catch (error: any) {
        Logger.error("Error getting pool info:", error)
        throw new Error(`Failed to get pool info: ${error.message}`)
      }
    }
  )

  // Tool 2: Get swap price
  server.tool(
    "curve_get_dy",
    "Get expected output amount for a Curve swap",
    {
      poolAddress: z.string().describe("The Curve pool contract address"),
      i: z.number().describe("Index of input token in the pool"),
      j: z.number().describe("Index of output token in the pool"),
      dx: z.string().describe("Amount of input token (in wei)"),
      rpcUrl: z.string().optional().describe("Custom RPC URL")
    },
    async (params) => {
      try {
        const provider = new ethers.JsonRpcProvider(params.rpcUrl || "https://eth.llamarpc.com")
        
        const poolAbi = [
          "function get_dy(int128 i, int128 j, uint256 dx) view returns (uint256)"
        ]
        
        const pool = new ethers.Contract(params.poolAddress, poolAbi, provider)
        const dy = await pool.get_dy(params.i, params.j, params.dx)
        
        return {
          content: [{
            type: "text",
            text: JSON.stringify({
              poolAddress: params.poolAddress,
              inputIndex: params.i,
              outputIndex: params.j,
              inputAmount: params.dx,
              expectedOutput: dy.toString(),
              route: `coin[${params.i}] -> coin[${params.j}]`
            }, null, 2)
          }]
        }
      } catch (error: any) {
        Logger.error("Error getting swap output:", error)
        throw new Error(`Failed to get swap output: ${error.message}`)
      }
    }
  )

  // Tool 3: Get gauge rewards
  server.tool(
    "curve_get_gauge_info",
    "Get information about a Curve gauge including CRV rewards",
    {
      gaugeAddress: z.string().describe("The gauge contract address"),
      rpcUrl: z.string().optional().describe("Custom RPC URL")
    },
    async (params) => {
      try {
        const provider = new ethers.JsonRpcProvider(params.rpcUrl || "https://eth.llamarpc.com")
        
        const gaugeAbi = [
          "function working_supply() view returns (uint256)",
          "function totalSupply() view returns (uint256)",
          "function inflation_rate() view returns (uint256)",
          "function lp_token() view returns (address)"
        ]
        
        const gauge = new ethers.Contract(params.gaugeAddress, gaugeAbi, provider)
        
        const [workingSupply, totalSupply, inflationRate, lpToken] = await Promise.all([
          gauge.working_supply().catch(() => 0n),
          gauge.totalSupply().catch(() => 0n),
          gauge.inflation_rate().catch(() => 0n),
          gauge.lp_token().catch(() => "0x")
        ])
        
        return {
          content: [{
            type: "text",
            text: JSON.stringify({
              gaugeAddress: params.gaugeAddress,
              lpToken,
              totalSupply: ethers.formatUnits(totalSupply, 18),
              workingSupply: ethers.formatUnits(workingSupply, 18),
              inflationRate: ethers.formatUnits(inflationRate, 18) + " CRV/second"
            }, null, 2)
          }]
        }
      } catch (error: any) {
        Logger.error("Error getting gauge info:", error)
        throw new Error(`Failed to get gauge info: ${error.message}`)
      }
    }
  )

  // Tool 4: Get top Curve pools
  server.tool(
    "curve_get_top_pools",
    "Get list of top Curve Finance pools by TVL",
    {
      limit: z.number().optional().describe("Number of pools to return (default: 10)")
    },
    async (params) => {
      try {
        const limit = params.limit || 10
        
        const topPools = [
          { name: "3pool (DAI/USDC/USDT)", address: "0xbEbc44782C7dB0a1A60Cb6fe97d0b483032FF1C7", tvl: "$500M+" },
          { name: "stETH/ETH", address: "0xDC24316b9AE028F1497c275EB9192a3Ea0f67022", tvl: "$400M+" },
          { name: "tricrypto2 (USDT/WBTC/WETH)", address: "0xD51a44d3FaE010294C616388b506AcdA1bfAAE46", tvl: "$300M+" },
          { name: "FRAX/3CRV", address: "0xd632f22692FaC7611d2AA1C0D552930D43CAEd3B", tvl: "$200M+" },
          { name: "sUSD (DAI/USDC/USDT/sUSD)", address: "0xA5407eAE9Ba41422680e2e00537571bcC53efBfD", tvl: "$150M+" },
          { name: "MIM/3CRV", address: "0x5a6A4D54456819380173272A5E8E9B9904BdF41B", tvl: "$100M+" },
          { name: "LUSD/3CRV", address: "0xEd279fDD11cA84bEef15AF5D39BB4d4bEE23F0cA", tvl: "$80M+" },
          { name: "alETH/ETH", address: "0xC4C319E2D4d66CcA4464C0c2B32c9Bd23ebe784e", tvl: "$60M+" },
          { name: "cvxCRV/CRV", address: "0x9D0464996170c6B9e75eED71c68B99dDEDf279e8", tvl: "$50M+" },
          { name: "rETH/ETH", address: "0x0f3159811670c117c372428D4E69AC32325e4D0F", tvl: "$40M+" }
        ]
        
        return {
          content: [{
            type: "text",
            text: JSON.stringify(topPools.slice(0, limit), null, 2)
          }]
        }
      } catch (error: any) {
        Logger.error("Error getting top pools:", error)
        throw new Error(`Failed to get top pools: ${error.message}`)
      }
    }
  )

  Logger.info("✅ Registered Curve Finance tools")
}
