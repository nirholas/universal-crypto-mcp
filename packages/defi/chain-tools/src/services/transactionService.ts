import { ethers } from "ethers";
import { PrismaClient } from "@prisma/client";
import { v4 as uuidv4 } from "uuid";
import { getProvider } from "../utils/blockchain.js";
import { logger } from "../utils/logger.js";

const prisma = new PrismaClient();

export interface TransactionRequest {
  chainId: string;
  to: string;
  value: string;
  data?: string;
  gasLimit?: string;
  userId: string;
}

export interface TransactionDetails {
  id: string;
  chainId: string;
  from?: string;
  to: string;
  value: string;
  data?: string;
  gasLimit?: string;
  status: string;
  txHash?: string;
  createdAt: Date;
  updatedAt: Date;
}

/**
 * Prepare an unsigned transaction for user approval
 */
export async function prepareTransaction(txRequest: TransactionRequest): Promise<TransactionDetails> {
  try {
    // Validate address
    if (!ethers.isAddress(txRequest.to)) {
      throw new Error(`Invalid recipient address: ${txRequest.to}`);
    }
    
    // Validate value
    try {
      ethers.parseEther(txRequest.value);
    } catch (error) {
      throw new Error(`Invalid amount: ${txRequest.value}`);
    }
    
    // Create transaction record
    const transaction = await prisma.transaction.create({
      data: {
        id: uuidv4(),
        chainId: txRequest.chainId,
        to: txRequest.to,
        value: txRequest.value,
        data: txRequest.data || "0x",
        gasLimit: txRequest.gasLimit,
        status: "PENDING",
        userId: txRequest.userId,
      },
    });
    
    logger.info(`Transaction prepared with ID ${transaction.id}`);
    
    return {
      id: transaction.id,
      chainId: transaction.chainId,
      to: transaction.to,
      value: transaction.value,
      data: transaction.data || undefined,
      gasLimit: transaction.gasLimit || undefined,
      status: transaction.status,
      createdAt: transaction.createdAt,
      updatedAt: transaction.updatedAt,
    };
  } catch (error) {
    logger.error("Error preparing transaction:", error);
    throw error;
  }
}

/**
 * Get transaction details by UUID
 */
export async function getTransaction(uuid: string): Promise<TransactionDetails | null> {
  try {
    const transaction = await prisma.transaction.findUnique({
      where: {
        id: uuid,
      },
    });
    
    if (!transaction) {
      return null;
    }
    
    return {
      id: transaction.id,
      chainId: transaction.chainId,
      from: transaction.from || undefined,
      to: transaction.to,
      value: transaction.value,
      data: transaction.data || undefined,
      gasLimit: transaction.gasLimit || undefined,
      status: transaction.status,
      txHash: transaction.txHash || undefined,
      createdAt: transaction.createdAt,
      updatedAt: transaction.updatedAt,
    };
  } catch (error) {
    logger.error(`Error getting transaction ${uuid}:`, error);
    throw error;
  }
}

/**
 * Submit a signed transaction to the blockchain
 */
export async function submitTransaction(
  uuid: string, 
  signedTransaction: string
): Promise<{ id: string; status: string; txHash?: string }> {
  try {
    // Get transaction from database
    const transaction = await prisma.transaction.findUnique({
      where: {
        id: uuid,
      },
      include: {
        chain: true,
      },
    });
    
    if (!transaction) {
      throw new Error(`Transaction with ID ${uuid} not found`);
    }
    
    if (transaction.status !== "PENDING" && transaction.status !== "APPROVED") {
      throw new Error(`Transaction ${uuid} cannot be submitted (status: ${transaction.status})`);
    }
    
    // Get provider for chain
    const provider = getProvider(transaction.chainId);
    
    // Submit transaction
    try {
      const tx = await provider.broadcastTransaction(signedTransaction);
      
      // Update transaction status
      const updatedTransaction = await prisma.transaction.update({
        where: {
          id: uuid,
        },
        data: {
          status: "SUBMITTED",
          txHash: tx.hash,
          updatedAt: new Date(),
        },
      });
      
      logger.info(`Transaction ${uuid} submitted with hash ${tx.hash}`);
      
      // Start watching for confirmation
      watchTransactionConfirmation(uuid, tx.hash, transaction.chainId);
      
      return {
        id: updatedTransaction.id,
        status: updatedTransaction.status,
        txHash: updatedTransaction.txHash || undefined,
      };
    } catch (error) {
      // Update transaction status to failed
      await prisma.transaction.update({
        where: {
          id: uuid,
        },
        data: {
          status: "FAILED",
          updatedAt: new Date(),
        },
      });
      
      logger.error(`Error submitting transaction ${uuid}:`, error);
      throw new Error(`Failed to submit transaction: ${error instanceof Error ? error.message : String(error)}`);
    }
  } catch (error) {
    logger.error(`Error in submitTransaction for ${uuid}:`, error);
    throw error;
  }
}

/**
 * Watch for transaction confirmation
 */
async function watchTransactionConfirmation(uuid: string, txHash: string, chainId: string): Promise<void> {
  try {
    const provider = getProvider(chainId);
    
    // Wait for transaction to be mined
    const receipt = await provider.waitForTransaction(txHash);
    
    // Update transaction status
    if (receipt && receipt.status === 1) {
      await prisma.transaction.update({
        where: {
          id: uuid,
        },
        data: {
          status: "CONFIRMED",
          updatedAt: new Date(),
        },
      });
      
      logger.info(`Transaction ${uuid} confirmed with hash ${txHash}`);
    } else {
      await prisma.transaction.update({
        where: {
          id: uuid,
        },
        data: {
          status: "FAILED",
          updatedAt: new Date(),
        },
      });
      
      logger.error(`Transaction ${uuid} failed on-chain`);
    }
  } catch (error) {
    logger.error(`Error watching confirmation for transaction ${uuid}:`, error);
    
    // Update transaction status to failed
    await prisma.transaction.update({
      where: {
        id: uuid,
      },
      data: {
        status: "FAILED",
        updatedAt: new Date(),
      },
    });
  }
}

/**
 * Get user transactions
 */
export async function getUserTransactions(userId: string): Promise<TransactionDetails[]> {
  try {
    const transactions = await prisma.transaction.findMany({
      where: {
        userId,
      },
      orderBy: {
        createdAt: "desc",
      },
    });
    
    return transactions.map(tx => ({
      id: tx.id,
      chainId: tx.chainId,
      from: tx.from || undefined,
      to: tx.to,
      value: tx.value,
      data: tx.data || undefined,
      gasLimit: tx.gasLimit || undefined,
      status: tx.status,
      txHash: tx.txHash || undefined,
      createdAt: tx.createdAt,
      updatedAt: tx.updatedAt,
    }));
  } catch (error) {
    logger.error(`Error getting transactions for user ${userId}:`, error);
    throw error;
  }
}
