/**
 * Venus Protocol Integration
 *
 * Provides lending and borrowing operations on BNB Chain.
 */

import {
  createPublicClient,
  http,
  formatUnits,
  type PublicClient,
} from "viem";
import { bsc } from "viem/chains";

/**
 * Venus Comptroller address
 */
export const VENUS_COMPTROLLER =
  "0xfD36E2c2a6789Db23113685031d7F16329158384" as const;

/**
 * vBNB (Venus BNB) address
 */
export const VBNB_ADDRESS =
  "0xA07c5b74C9B40447a954e1466938b865b6BBea36" as const;

/**
 * Venus market info
 */
export interface VenusMarket {
  asset: string;
  vToken: string;
  supplyApy: number;
  borrowApy: number;
  totalSupply: string;
  totalBorrow: string;
  collateralFactor: number;
}

/**
 * User position in Venus
 */
export interface VenusPosition {
  supplied: Array<{
    asset: string;
    amount: string;
    valueUSD: number;
  }>;
  borrowed: Array<{
    asset: string;
    amount: string;
    valueUSD: number;
  }>;
  healthFactor: number;
  netApy: number;
}

/**
 * Comptroller ABI (for querying markets)
 */
const COMPTROLLER_ABI = [
  {
    inputs: [],
    name: "getAllMarkets",
    outputs: [{ name: "", type: "address[]" }],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [{ name: "vToken", type: "address" }],
    name: "markets",
    outputs: [
      { name: "isListed", type: "bool" },
      { name: "collateralFactorMantissa", type: "uint256" },
      { name: "isVenus", type: "bool" },
    ],
    stateMutability: "view",
    type: "function",
  },
] as const;

/**
 * vToken ABI
 */
const VTOKEN_ABI = [
  {
    inputs: [{ name: "account", type: "address" }],
    name: "balanceOf",
    outputs: [{ name: "", type: "uint256" }],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [{ name: "account", type: "address" }],
    name: "borrowBalanceCurrent",
    outputs: [{ name: "", type: "uint256" }],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [],
    name: "supplyRatePerBlock",
    outputs: [{ name: "", type: "uint256" }],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "borrowRatePerBlock",
    outputs: [{ name: "", type: "uint256" }],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "exchangeRateCurrent",
    outputs: [{ name: "", type: "uint256" }],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [],
    name: "underlying",
    outputs: [{ name: "", type: "address" }],
    stateMutability: "view",
    type: "function",
  },
] as const;

/**
 * Venus Protocol Client
 */
export class VenusClient {
  private publicClient: PublicClient;

  constructor(rpcUrl?: string) {
    const transport = http(rpcUrl);
    this.publicClient = createPublicClient({
      chain: bsc,
      transport,
    });
  }

  /**
   * Get supply APY for a vToken
   */
  async getSupplyAPY(vTokenAddress: `0x${string}`): Promise<number> {
    const ratePerBlock = await this.publicClient.readContract({
      address: vTokenAddress,
      abi: VTOKEN_ABI,
      functionName: "supplyRatePerBlock",
    });

    // BSC has ~3 second blocks, ~10512000 blocks per year
    const blocksPerYear = 10512000;
    const apy =
      (Math.pow(1 + Number(ratePerBlock) / 1e18, blocksPerYear) - 1) * 100;
    return apy;
  }

  /**
   * Get borrow APY for a vToken
   */
  async getBorrowAPY(vTokenAddress: `0x${string}`): Promise<number> {
    const ratePerBlock = await this.publicClient.readContract({
      address: vTokenAddress,
      abi: VTOKEN_ABI,
      functionName: "borrowRatePerBlock",
    });

    const blocksPerYear = 10512000;
    const apy =
      (Math.pow(1 + Number(ratePerBlock) / 1e18, blocksPerYear) - 1) * 100;
    return apy;
  }

  /**
   * Get user's vToken balance
   */
  async getBalance(
    vTokenAddress: `0x${string}`,
    userAddress: `0x${string}`
  ): Promise<string> {
    const balance = await this.publicClient.readContract({
      address: vTokenAddress,
      abi: VTOKEN_ABI,
      functionName: "balanceOf",
      args: [userAddress],
    });

    return formatUnits(balance as bigint, 8); // vTokens have 8 decimals
  }

  /**
   * Get all Venus markets
   * 
   * Queries the Comptroller for all listed vToken markets.
   * Note: This returns basic market addresses. For full market data with APYs,
   * you would need to call getSupplyAPY/getBorrowAPY for each vToken and
   * fetch price data from an oracle.
   */
  async getMarkets(): Promise<VenusMarket[]> {
    // Query all vToken addresses from Comptroller
    const marketAddresses = (await this.publicClient.readContract({
      address: VENUS_COMPTROLLER,
      abi: COMPTROLLER_ABI,
      functionName: "getAllMarkets",
    })) as `0x${string}`[];

    // Fetch collateral factors for each market
    const markets: VenusMarket[] = [];
    
    for (const vTokenAddress of marketAddresses) {
      try {
        const marketInfo = await this.publicClient.readContract({
          address: VENUS_COMPTROLLER,
          abi: COMPTROLLER_ABI,
          functionName: "markets",
          args: [vTokenAddress],
        }) as [boolean, bigint, boolean];

        const [isListed, collateralFactorMantissa] = marketInfo;
        
        if (isListed) {
          // Get underlying asset address (vBNB doesn't have underlying)
          let underlyingAddress = "0x40252CFDF8B20Ed757D61ff157719F33Ec332402";
          try {
            underlyingAddress = await this.publicClient.readContract({
              address: vTokenAddress,
              abi: VTOKEN_ABI,
              functionName: "underlying",
            }) as string;
          } catch {
            // vBNB (native token wrapper) doesn't have underlying()
          }

          markets.push({
            asset: underlyingAddress,
            vToken: vTokenAddress,
            supplyApy: 0, // Would require additional calls to supplyRatePerBlock
            borrowApy: 0, // Would require additional calls to borrowRatePerBlock
            totalSupply: "0", // Would require additional contract calls
            totalBorrow: "0", // Would require additional contract calls
            collateralFactor: Number(collateralFactorMantissa) / 1e18,
          });
        }
      } catch (error) {
        // Skip markets that fail to fetch
        continue;
      }
    }

    return markets;
  }

  /**
   * Get user's position across all Venus markets
   * 
   * Queries the user's supplied and borrowed balances across all Venus markets.
   * Health factor is calculated as: (sum of collateral in USD) / (sum of borrows in USD)
   * Values below 1.0 indicate the position is at risk of liquidation.
   * 
   * Note: USD values require price oracle integration. This implementation returns
   * balances in native token amounts without USD conversion.
   */
  async getPosition(userAddress: `0x${string}`): Promise<VenusPosition> {
    const markets = await this.getMarkets();
    const supplied: Array<{ asset: string; amount: string; valueUSD: number }> = [];
    const borrowed: Array<{ asset: string; amount: string; valueUSD: number }> = [];

    for (const market of markets) {
      try {
        // Check supplied balance
        const supplyBalance = await this.publicClient.readContract({
          address: market.vToken as `0x${string}`,
          abi: VTOKEN_ABI,
          functionName: "balanceOf",
          args: [userAddress],
        }) as bigint;

        if (supplyBalance > 0n) {
          // Get exchange rate to convert vTokens to underlying
          const exchangeRate = await this.publicClient.readContract({
            address: market.vToken as `0x${string}`,
            abi: VTOKEN_ABI,
            functionName: "exchangeRateCurrent",
          }) as bigint;

          // Calculate underlying amount: vTokenBalance * exchangeRate / 1e18
          const underlyingAmount = (supplyBalance * exchangeRate) / BigInt(1e18);

          supplied.push({
            asset: market.asset,
            amount: formatUnits(underlyingAmount, 18),
            valueUSD: 0, // Requires price oracle integration
          });
        }

        // Check borrowed balance
        const borrowBalance = await this.publicClient.readContract({
          address: market.vToken as `0x${string}`,
          abi: VTOKEN_ABI,
          functionName: "borrowBalanceCurrent",
          args: [userAddress],
        }) as bigint;

        if (borrowBalance > 0n) {
          borrowed.push({
            asset: market.asset,
            amount: formatUnits(borrowBalance, 18),
            valueUSD: 0, // Requires price oracle integration
          });
        }
      } catch (error) {
        // Skip markets that fail to fetch
        continue;
      }
    }

    // Health factor calculation requires USD values from price oracle
    // Formula: (Σ supplied * collateralFactor * price) / (Σ borrowed * price)
    const healthFactor = 0; // Requires price oracle integration
    const netApy = 0; // Requires weighted average of supply/borrow APYs by position size

    return {
      supplied,
      borrowed,
      healthFactor,
      netApy,
    };
  }
}
