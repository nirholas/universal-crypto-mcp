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

// Uniswap V3 Factory address on Ethereum mainnet
const UNISWAP_V3_FACTORY = "0x1F98431c8aD98523631AE4a59f267346ea31F984"
const UNISWAP_V3_ROUTER = "0xE592427A0AEce92De3Edee1F18E0157C05861564"

/**
 * Register all Uniswap V3 tools with the MCP server
 */
export function registerUniswapV3Tools(server: McpServer) {
  // Tool 1: Get pool information
  server.tool(
    "uniswap_v3_get_pool_info",
    "Get detailed information about a Uniswap V3 liquidity pool",
    {
      poolAddress: z.string().describe("The pool contract address"),
      rpcUrl: z.string().optional().describe("Custom RPC URL (defaults to public Ethereum RPC)")
    },
    async (params) => {
      try {
        const provider = new ethers.JsonRpcProvider(params.rpcUrl || "https://eth.llamarpc.com")
        
        const poolAbi = [
          "function token0() view returns (address)",
          "function token1() view returns (address)",
          "function fee() view returns (uint24)",
          "function liquidity() view returns (uint128)",
          "function slot0() view returns (uint160 sqrtPriceX96, int24 tick, uint16 observationIndex, uint16 observationCardinality, uint16 observationCardinalityNext, uint8 feeProtocol, bool unlocked)"
        ]
        
        const pool = new ethers.Contract(params.poolAddress, poolAbi, provider)
        
        const [token0, token1, fee, liquidity, slot0] = await Promise.all([
          pool.token0(),
          pool.token1(),
          pool.fee(),
          pool.liquidity(),
          pool.slot0()
        ])
        
        return {
          content: [{
            type: "text",
            text: JSON.stringify({
              poolAddress: params.poolAddress,
              token0,
              token1,
              feeTier: fee.toString(),
              liquidity: liquidity.toString(),
              sqrtPriceX96: slot0[0].toString(),
              tick: slot0[1].toString(),
              observationIndex: slot0[2].toString()
            }, null, 2)
          }]
        }
      } catch (error: any) {
        Logger.error("Error getting pool info:", error)
        throw new Error(`Failed to get pool info: ${error.message}`)
      }
    }
  )

  // Tool 2: Get swap quote
  server.tool(
    "uniswap_v3_get_swap_quote",
    "Get a swap quote for trading on Uniswap V3",
    {
      tokenIn: z.string().describe("Input token address"),
      tokenOut: z.string().describe("Output token address"),
      amountIn: z.string().describe("Amount of input token (in wei)"),
      feeTier: z.number().optional().describe("Pool fee tier (500, 3000, or 10000). Defaults to 3000"),
      rpcUrl: z.string().optional().describe("Custom RPC URL")
    },
    async (params) => {
      try {
        const provider = new ethers.JsonRpcProvider(params.rpcUrl || "https://eth.llamarpc.com")
        const feeTier = params.feeTier || 3000
        
        // This is a simplified quote - in production would use Quoter contract
        const result = {
          tokenIn: params.tokenIn,
          tokenOut: params.tokenOut,
          amountIn: params.amountIn,
          feeTier,
          estimatedAmountOut: "0", // Would calculate via Quoter
          priceImpact: "0%",
          route: `${params.tokenIn} -> ${params.tokenOut}`,
          notice: "Use Uniswap SDK or Quoter contract for accurate quotes in production"
        }
        
        return {
          content: [{
            type: "text",
            text: JSON.stringify(result, null, 2)
          }]
        }
      } catch (error: any) {
        Logger.error("Error getting swap quote:", error)
        throw new Error(`Failed to get swap quote: ${error.message}`)
      }
    }
  )

  // Tool 3: Get position information
  server.tool(
    "uniswap_v3_get_position",
    "Get information about a Uniswap V3 liquidity position",
    {
      tokenId: z.string().describe("The NFT token ID representing the position"),
      nftManagerAddress: z.string().optional().describe("NFT Position Manager address (defaults to mainnet)"),
      rpcUrl: z.string().optional().describe("Custom RPC URL")
    },
    async (params) => {
      try {
        const provider = new ethers.JsonRpcProvider(params.rpcUrl || "https://eth.llamarpc.com")
        const nftManager = params.nftManagerAddress || "0xC36442b4a4522E871399CD717aBDD847Ab11FE88"
        
        const nftManagerAbi = [
          "function positions(uint256 tokenId) view returns (uint96 nonce, address operator, address token0, address token1, uint24 fee, int24 tickLower, int24 tickUpper, uint128 liquidity, uint256 feeGrowthInside0LastX128, uint256 feeGrowthInside1LastX128, uint128 tokensOwed0, uint128 tokensOwed1)"
        ]
        
        const nftContract = new ethers.Contract(nftManager, nftManagerAbi, provider)
        const position = await nftContract.positions(params.tokenId)
        
        return {
          content: [{
            type: "text",
            text: JSON.stringify({
              tokenId: params.tokenId,
              nonce: position[0].toString(),
              operator: position[1],
              token0: position[2],
              token1: position[3],
              feeTier: position[4].toString(),
              tickLower: position[5].toString(),
              tickUpper: position[6].toString(),
              liquidity: position[7].toString(),
              tokensOwed0: position[10].toString(),
              tokensOwed1: position[11].toString()
            }, null, 2)
          }]
        }
      } catch (error: any) {
        Logger.error("Error getting position:", error)
        throw new Error(`Failed to get position: ${error.message}`)
      }
    }
  )

  // Tool 4: Get top pools
  server.tool(
    "uniswap_v3_get_top_pools",
    "Get information about top Uniswap V3 pools by TVL",
    {
      limit: z.number().optional().describe("Number of pools to return (default: 10)")
    },
    async (params) => {
      try {
        const limit = params.limit || 10
        
        // These are well-known top pools on Uniswap V3
        const topPools = [
          { name: "ETH/USDC 0.05%", address: "0x88e6A0c2dDD26FEEb64F039a2c41296FcB3f5640", tvl: "$500M+" },
          { name: "ETH/USDC 0.3%", address: "0x8ad599c3A0ff1De082011EFDDc58f1908eb6e6D8", tvl: "$300M+" },
          { name: "ETH/USDT 0.05%", address: "0x11b815efB8f581194ae79006d24E0d814B7697F6", tvl: "$200M+" },
          { name: "WBTC/ETH 0.3%", address: "0xCBCdF9626bC03E24f779434178A73a0B4bad62eD", tvl: "$150M+" },
          { name: "ETH/DAI 0.05%", address: "0x60594a405d53811d3BC4766596EFD80fd545A270", tvl: "$100M+" },
          { name: "USDC/USDT 0.01%", address: "0x3416cF6C708Da44DB2624D63ea0AAef7113527C6", tvl: "$80M+" },
          { name: "ETH/USDT 0.3%", address: "0x4e68Ccd3E89f51C3074ca5072bbAC773960dFa36", tvl: "$75M+" },
          { name: "WBTC/USDC 0.3%", address: "0x99ac8cA7087fA4A2A1FB6357269965A2014ABc35", tvl: "$60M+" },
          { name: "DAI/USDC 0.01%", address: "0x5777d92f208679DB4b9778590Fa3CAB3aC9e2168", tvl: "$50M+" },
          { name: "MATIC/ETH 0.3%", address: "0x290A6a7460B308ee3F19023D2D00dE604bcf5B42", tvl: "$40M+" }
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

  Logger.info("✅ Registered Uniswap V3 tools")
}
