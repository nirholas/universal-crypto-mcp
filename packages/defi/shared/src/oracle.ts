/**
 * Price Oracle Integrations
 * 
 * Professional price feed aggregation using Chainlink, Uniswap V3 TWAP,
 * and fallback mechanisms for reliable price data.
 */

import {
  createPublicClient,
  http,
  formatUnits,
  type PublicClient,
  type Address,
} from "viem";
import { mainnet, arbitrum, optimism, base, polygon } from "viem/chains";

/**
 * Chainlink Price Feed ABI
 */
const CHAINLINK_AGGREGATOR_ABI = [
  {
    inputs: [],
    name: "latestRoundData",
    outputs: [
      { name: "roundId", type: "uint80" },
      { name: "answer", type: "int256" },
      { name: "startedAt", type: "uint256" },
      { name: "updatedAt", type: "uint256" },
      { name: "answeredInRound", type: "uint80" },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "decimals",
    outputs: [{ name: "", type: "uint8" }],
    stateMutability: "view",
    type: "function",
  },
] as const;

/**
 * Uniswap V3 Pool ABI for TWAP
 */
const UNISWAP_V3_POOL_ABI = [
  {
    inputs: [{ name: "secondsAgos", type: "uint32[]" }],
    name: "observe",
    outputs: [
      { name: "tickCumulatives", type: "int56[]" },
      { name: "secondsPerLiquidityCumulativeX128s", type: "uint160[]" },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "slot0",
    outputs: [
      { name: "sqrtPriceX96", type: "uint160" },
      { name: "tick", type: "int24" },
      { name: "observationIndex", type: "uint16" },
      { name: "observationCardinality", type: "uint16" },
      { name: "observationCardinalityNext", type: "uint16" },
      { name: "feeProtocol", type: "uint8" },
      { name: "unlocked", type: "bool" },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "token0",
    outputs: [{ name: "", type: "address" }],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "token1",
    outputs: [{ name: "", type: "address" }],
    stateMutability: "view",
    type: "function",
  },
] as const;

/**
 * Chainlink price feed addresses by chain and pair
 */
export const CHAINLINK_FEEDS: Record<number, Record<string, Address>> = {
  1: { // Ethereum
    "ETH/USD": "0x5f4eC3Df9cbd43714FE2740f5E3616155c5b8419",
    "BTC/USD": "0xF4030086522a5bEEa4988F8cA5B36dbC97BeE88c",
    "USDC/USD": "0x8fFfFfd4AfB6115b954Bd326cbe7B4BA576818f6",
    "USDT/USD": "0x3E7d1eAB13ad0104d2750B8863b489D65364e32D",
    "DAI/USD": "0xAed0c38402a5d19df6E4c03F4E2DceD6e29c1ee9",
  },
  42161: { // Arbitrum
    "ETH/USD": "0x639Fe6ab55C921f74e7fac1ee960C0B6293ba612",
    "BTC/USD": "0x6ce185860a4963106506C203335A2910413708e9",
    "USDC/USD": "0x50834F3163758fcC1Df9973b6e91f0F0F0434aD3",
    "USDT/USD": "0x3f3f5dF88dC9F13eac63DF89EC16ef6e7E25DdE7",
  },
  10: { // Optimism
    "ETH/USD": "0x13e3Ee699D1909E989722E753853AE30b17e08c5",
    "BTC/USD": "0xD702DD976Fb76Fffc2D3963D037dfDae5b04E593",
    "USDC/USD": "0x16a9FA2FDa030272Ce99B29CF780dFA30361E0f3",
  },
  8453: { // Base
    "ETH/USD": "0x71041dddad3595F9CEd3DcCFBe3D1F4b0a16Bb70",
    "BTC/USD": "0x07DA0E54543a844a80ABE69c8A12F22B3aA59f9D",
  },
  137: { // Polygon
    "ETH/USD": "0xF9680D99D6C9589e2a93a78A04A279e509205945",
    "BTC/USD": "0xc907E116054Ad103354f2D350FD2514433D57F6f",
    "MATIC/USD": "0xAB594600376Ec9fD91F8e885dADF0CE036862dE0",
  },
};

/**
 * Price data from oracle
 */
export interface PriceData {
  price: string;
  decimals: number;
  timestamp: number;
  source: "chainlink" | "uniswap_v3" | "fallback";
  confidence?: number;
}

/**
 * Price Oracle Client
 */
export class PriceOracle {
  private publicClient: PublicClient;
  private chainId: number;

  constructor(chainId: number, rpcUrl?: string) {
    this.chainId = chainId;

    const chains = {
      1: mainnet,
      42161: arbitrum,
      10: optimism,
      8453: base,
      137: polygon,
    };

    const chain = chains[chainId as keyof typeof chains];
    if (!chain) {
      throw new Error(`Unsupported chain ID: ${chainId}`);
    }

    this.publicClient = createPublicClient({
      chain,
      transport: http(rpcUrl),
    });
  }

  /**
   * Get price from Chainlink oracle
   */
  async getChainlinkPrice(pair: string): Promise<PriceData | null> {
    const feeds = CHAINLINK_FEEDS[this.chainId];
    if (!feeds || !feeds[pair]) {
      return null;
    }

    const feedAddress = feeds[pair];

    try {
      // Get latest round data
      const [roundId, answer, startedAt, updatedAt, answeredInRound] = await this.publicClient.readContract({
        address: feedAddress,
        abi: CHAINLINK_AGGREGATOR_ABI,
        functionName: "latestRoundData",
      }) as [bigint, bigint, bigint, bigint, bigint];

      // Get decimals
      const decimals = await this.publicClient.readContract({
        address: feedAddress,
        abi: CHAINLINK_AGGREGATOR_ABI,
        functionName: "decimals",
      }) as number;

      // Check if price is stale (older than 1 hour)
      const now = Math.floor(Date.now() / 1000);
      const priceAge = now - Number(updatedAt);
      if (priceAge > 3600) {
        return null; // Price is stale
      }

      // Calculate confidence based on how recent the update is
      const confidence = Math.max(0, 100 - (priceAge / 36)); // Decreases over time

      return {
        price: formatUnits(answer, decimals),
        decimals,
        timestamp: Number(updatedAt),
        source: "chainlink",
        confidence,
      };
    } catch (error) {
      return null;
    }
  }

  /**
   * Get price from Uniswap V3 TWAP
   */
  async getUniswapV3Price(
    poolAddress: Address,
    twapPeriod: number = 1800 // 30 minutes default
  ): Promise<PriceData | null> {
    try {
      // Get current and historical tick cumulatives
      const [tickCumulatives] = await this.publicClient.readContract({
        address: poolAddress,
        abi: UNISWAP_V3_POOL_ABI,
        functionName: "observe",
        args: [[twapPeriod, 0]],
      }) as [bigint[], bigint[]];

      // Calculate TWAP tick
      const tickDiff = tickCumulatives[1] - tickCumulatives[0];
      const twapTick = Number(tickDiff) / twapPeriod;

      // Convert tick to price
      // Price = 1.0001^tick
      const price = Math.pow(1.0001, twapTick);

      // Get token addresses for reference
      const token0 = await this.publicClient.readContract({
        address: poolAddress,
        abi: UNISWAP_V3_POOL_ABI,
        functionName: "token0",
      });

      const token1 = await this.publicClient.readContract({
        address: poolAddress,
        abi: UNISWAP_V3_POOL_ABI,
        functionName: "token1",
      });

      return {
        price: price.toString(),
        decimals: 18,
        timestamp: Math.floor(Date.now() / 1000),
        source: "uniswap_v3",
        confidence: 95, // TWAP is generally reliable
      };
    } catch (error) {
      return null;
    }
  }

  /**
   * Get price with automatic fallback
   * Tries Chainlink first, then Uniswap V3 TWAP
   */
  async getPrice(
    pair: string,
    uniswapPoolAddress?: Address
  ): Promise<PriceData> {
    // Try Chainlink first
    const chainlinkPrice = await this.getChainlinkPrice(pair);
    if (chainlinkPrice) {
      return chainlinkPrice;
    }

    // Fallback to Uniswap V3 if pool address provided
    if (uniswapPoolAddress) {
      const uniswapPrice = await this.getUniswapV3Price(uniswapPoolAddress);
      if (uniswapPrice) {
        return uniswapPrice;
      }
    }

    throw new Error(`Unable to fetch price for ${pair}`);
  }

  /**
   * Get multiple prices in parallel
   */
  async getPrices(pairs: string[]): Promise<Record<string, PriceData>> {
    const results = await Promise.allSettled(
      pairs.map(pair => this.getChainlinkPrice(pair))
    );

    const prices: Record<string, PriceData> = {};

    results.forEach((result, index) => {
      if (result.status === "fulfilled" && result.value) {
        prices[pairs[index]] = result.value;
      }
    });

    return prices;
  }

  /**
   * Calculate USD value of a token amount
   */
  async calculateUSDValue(
    tokenAmount: string,
    tokenPair: string
  ): Promise<string> {
    const priceData = await this.getPrice(tokenPair);
    const amount = parseFloat(tokenAmount);
    const price = parseFloat(priceData.price);

    return (amount * price).toFixed(2);
  }

  /**
   * Monitor price and execute callback when threshold is reached
   */
  async watchPrice(
    pair: string,
    targetPrice: number,
    direction: "above" | "below",
    callback: (price: PriceData) => void,
    checkIntervalMs: number = 10000
  ): Promise<() => void> {
    let isActive = true;

    const check = async () => {
      while (isActive) {
        try {
          const priceData = await this.getPrice(pair);
          const currentPrice = parseFloat(priceData.price);

          if (
            (direction === "above" && currentPrice >= targetPrice) ||
            (direction === "below" && currentPrice <= targetPrice)
          ) {
            callback(priceData);
          }
        } catch (error) {
          // Continue monitoring even if one check fails
        }

        await new Promise(resolve => setTimeout(resolve, checkIntervalMs));
      }
    };

    check();

    // Return stop function
    return () => {
      isActive = false;
    };
  }
}

/**
 * Create price oracle for specific chain
 */
export function createPriceOracle(chainId: number, rpcUrl?: string): PriceOracle {
  return new PriceOracle(chainId, rpcUrl);
}
