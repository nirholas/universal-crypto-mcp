import { PrismaClient } from '@prisma/client';
import { logger } from '../utils/logger.js';

const prisma = new PrismaClient();

export type Chain = {
  id: string;
  name: string;
  currency: string;
  rpcUrl: string;
  explorerUrl: string;
  isTestnet: boolean;
  isActive: boolean;
};

// Default chains to initialize the database with
const defaultChains: Omit<Chain, 'isActive'>[] = [
  {
    id: '1',
    name: 'Ethereum Mainnet',
    currency: 'ETH',
    rpcUrl: `https://mainnet.infura.io/v3/${process.env.INFURA_API_KEY}`,
    explorerUrl: 'https://etherscan.io',
    isTestnet: false,
  },
  {
    id: '11155111',
    name: 'Sepolia Testnet',
    currency: 'ETH',
    rpcUrl: `https://sepolia.infura.io/v3/${process.env.INFURA_API_KEY}`,
    explorerUrl: 'https://sepolia.etherscan.io',
    isTestnet: true,
  },
  {
    id: '137',
    name: 'Polygon Mainnet',
    currency: 'MATIC',
    rpcUrl: `https://polygon-mainnet.infura.io/v3/${process.env.INFURA_API_KEY}`,
    explorerUrl: 'https://polygonscan.com',
    isTestnet: false,
  },
  {
    id: '80001',
    name: 'Polygon Mumbai',
    currency: 'MATIC',
    rpcUrl: `https://polygon-mumbai.infura.io/v3/${process.env.INFURA_API_KEY}`,
    explorerUrl: 'https://mumbai.polygonscan.com',
    isTestnet: true,
  },
];

/**
 * Initialize chains table with default chains if empty
 */
export async function initializeChains(): Promise<void> {
  try {
    const existingChains = await prisma.chain.findMany();
    
    if (existingChains.length === 0) {
      logger.info('Initializing chains table with default chains');
      
      for (const chain of defaultChains) {
        await prisma.chain.create({
          data: {
            ...chain,
            isActive: true,
          },
        });
      }
      
      logger.info('Chains initialized successfully');
    } else {
      logger.info(`Chains table already contains ${existingChains.length} chains`);
    }
  } catch (error) {
    logger.error('Error initializing chains:', error);
    throw error;
  }
}

/**
 * Get all active chains
 */
export async function getChains(): Promise<Chain[]> {
  try {
    return await prisma.chain.findMany({
      where: {
        isActive: true,
      },
    });
  } catch (error) {
    logger.error('Error fetching chains:', error);
    throw error;
  }
}

/**
 * Get chain by ID
 */
export async function getChainById(chainId: string): Promise<Chain | null> {
  try {
    return await prisma.chain.findUnique({
      where: {
        id: chainId,
      },
    });
  } catch (error) {
    logger.error(`Error fetching chain with ID ${chainId}:`, error);
    throw error;
  }
}
