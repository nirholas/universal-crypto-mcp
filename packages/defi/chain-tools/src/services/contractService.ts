import { ethers } from "ethers";
import { PrismaClient } from "@prisma/client";
import { getProvider } from "../utils/blockchain.js";
import { logger } from "../utils/logger.js";
import axios from "axios";

const prisma = new PrismaClient();

/**
 * Fetch contract ABI from Etherscan (or similar explorer)
 */
async function fetchContractABI(chainId: string, address: string): Promise<string | null> {
  try {
    // Different explorers for different chains
    let apiUrl;
    let apiKey = process.env.ETHERSCAN_API_KEY;

    switch (chainId) {
      case "1": // Ethereum Mainnet
        apiUrl = `https://api.etherscan.io/api?module=contract&action=getabi&address=${address}&apikey=${apiKey}`;
        break;
      case "11155111": // Sepolia Testnet
        apiUrl = `https://api-sepolia.etherscan.io/api?module=contract&action=getabi&address=${address}&apikey=${apiKey}`;
        break;
      case "137": // Polygon Mainnet
        apiUrl = `https://api.polygonscan.com/api?module=contract&action=getabi&address=${address}&apikey=${apiKey}`;
        break;
      case "80001": // Polygon Mumbai
        apiUrl = `https://api-testnet.polygonscan.com/api?module=contract&action=getabi&address=${address}&apikey=${apiKey}`;
        break;
      default:
        logger.warn(`No explorer API configured for chain ID ${chainId}`);
        return null;
    }

    const response = await axios.get(apiUrl);
    
    if (response.data.status === "1" && response.data.result) {
      return response.data.result;
    }
    
    logger.warn(`Could not fetch ABI: ${response.data.message || "Unknown error"}`);
    return null;
  } catch (error) {
    logger.error(`Error fetching ABI for contract ${address} on chain ${chainId}:`, error);
    return null;
  }
}

/**
 * Get contract ABI from database or fetch it from explorer
 */
async function getContractABI(chainId: string, address: string): Promise<any[]> {
  // Try to get from database first
  let contract = await prisma.contract.findUnique({
    where: {
      address_chainId: {
        address: address.toLowerCase(),
        chainId,
      },
    },
  });

  // If not found in DB, fetch from explorer
  if (!contract || !contract.abi) {
    const abiString = await fetchContractABI(chainId, address);
    
    if (!abiString) {
      throw new Error(`Could not fetch ABI for contract ${address} on chain ${chainId}`);
    }
    
    try {
      const abiJson = JSON.parse(abiString);
      
      // Save to database
      contract = await prisma.contract.upsert({
        where: {
          address_chainId: {
            address: address.toLowerCase(),
            chainId,
          },
        },
        update: {
          abi: abiJson,
        },
        create: {
          address: address.toLowerCase(),
          chainId,
          abi: abiJson,
        },
      });
      
      return abiJson;
    } catch (error) {
      logger.error(`Error parsing ABI for contract ${address}:`, error);
      throw new Error(`Invalid ABI format for contract ${address}`);
    }
  }
  
  return contract.abi as any[];
}

/**
 * Read data from a smart contract
 */
export async function readContract(
  chainId: string, 
  address: string, 
  method: string, 
  args: any[] = []
): Promise<any> {
  try {
    // Validate address
    if (!ethers.isAddress(address)) {
      throw new Error(`Invalid address: ${address}`);
    }
    
    // Get provider
    const provider = getProvider(chainId);
    
    // Get ABI
    const abi = await getContractABI(chainId, address);
    
    // Create contract instance
    const contract = new ethers.Contract(address, abi, provider);
    
    // Check if method exists
    if (typeof contract[method] !== "function") {
      throw new Error(`Method ${method} not found in contract ${address}`);
    }
    
    // Call method
    const result = await contract[method](...args);
    
    // Format result for better readability
    return formatContractResult(result);
  } catch (error) {
    logger.error(`Error reading contract ${address} method ${method}:`, error);
    throw error;
  }
}

/**
 * Format contract result for better readability
 */
function formatContractResult(result: any): any {
  if (ethers.isAddress(result)) {
    return result; // Return address as is
  }
  
  if (typeof result === "bigint") {
    // Try to format as ether, but return as string if it's too big
    try {
      return ethers.formatEther(result);
    } catch (error) {
      return result.toString();
    }
  }
  
  if (Array.isArray(result)) {
    return result.map(item => formatContractResult(item));
  }
  
  if (typeof result === "object" && result !== null) {
    const formatted: Record<string, any> = {};
    for (const key in result) {
      // Skip numeric and symbol keys
      if (isNaN(Number(key)) && typeof key !== "symbol") {
        formatted[key] = formatContractResult(result[key]);
      }
    }
    return formatted;
  }
  
  return result;
}
