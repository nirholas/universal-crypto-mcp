import { api } from './api';

export type TransactionStatus = 'PENDING' | 'APPROVED' | 'REJECTED' | 'SUBMITTED' | 'CONFIRMED' | 'FAILED';

export interface Transaction {
  id: string;
  chainId: string;
  from?: string;
  to: string;
  value: string;
  data?: string;
  gasLimit?: string;
  status: TransactionStatus;
  txHash?: string;
  createdAt: string;
  updatedAt: string;
}

export interface PrepareTransactionRequest {
  chainId: string;
  to: string;
  value?: string;
  data?: string;
  gasLimit?: string;
}

export interface PrepareTransactionResponse {
  id: string;
  url: string;
}

/**
 * Prepare a transaction for user approval
 */
export async function prepareTransaction(request: PrepareTransactionRequest): Promise<PrepareTransactionResponse> {
  try {
    const response = await api.transactions.prepare(request);
    return response;
  } catch (error) {
    console.error('Error preparing transaction:', error);
    throw error;
  }
}

/**
 * Get transaction details
 */
export async function getTransaction(uuid: string): Promise<Transaction> {
  try {
    const response = await api.transactions.get(uuid);
    return response;
  } catch (error) {
    console.error(`Error getting transaction ${uuid}:`, error);
    throw error;
  }
}

/**
 * Submit a signed transaction
 */
export async function submitTransaction(
  uuid: string,
  signedTransaction: string
): Promise<{ id: string; status: string; txHash?: string }> {
  try {
    const response = await api.transactions.submit(uuid, signedTransaction);
    return response;
  } catch (error) {
    console.error(`Error submitting transaction ${uuid}:`, error);
    throw error;
  }
}

/**
 * Get user transactions
 */
export async function getUserTransactions(): Promise<Transaction[]> {
  try {
    const response = await api.user.getTransactions();
    return response.transactions;
  } catch (error) {
    console.error('Error getting user transactions:', error);
    throw error;
  }
}
