/**
 * Wallet Payment Integration
 * 
 * Multi-chain wallet integration for payment processing
 * Supports EVM chains and Solana
 * 
 * @author Nich (@nichxbt)
 * @license Apache-2.0
 */

import { 
  createWalletClient, 
  custom, 
  type WalletClient, 
  type Account,
  type Chain,
  type Transport,
} from 'viem';
import { mainnet, polygon, arbitrum, base, optimism } from 'viem/chains';
import type { 
  PaymentRequest, 
  PaymentResult, 
  Address, 
  ChainId,
  Token,
} from './types';
import { getX402Client } from './x402Client';
import { formatTokenAmount } from './config';

// ============================================
// Chain Configuration
// ============================================

const CHAINS: Record<ChainId, Chain> = {
  1: mainnet,
  137: polygon,
  42161: arbitrum,
  8453: base,
  10: optimism,
};

// ============================================
// Types
// ============================================

export type WalletType = 'metamask' | 'walletconnect' | 'coinbase' | 'phantom' | 'injected';

export interface WalletConnection {
  address: Address;
  chainId: ChainId;
  walletType: WalletType;
  isConnected: boolean;
}

export interface WalletPaymentConfig {
  autoSwitchChain: boolean;
  confirmBeforeSign: boolean;
  gasMultiplier: number;
}

export interface SignedPayment {
  paymentRequest: PaymentRequest;
  signature: string;
  signedAt: number;
}

// ============================================
// Default Configuration
// ============================================

const DEFAULT_WALLET_CONFIG: WalletPaymentConfig = {
  autoSwitchChain: true,
  confirmBeforeSign: true,
  gasMultiplier: 1.2,
};

// ============================================
// Wallet Payment Manager
// ============================================

export class WalletPaymentManager {
  private config: WalletPaymentConfig;
  private walletClient: WalletClient | null = null;
  private currentConnection: WalletConnection | null = null;
  private x402Client = getX402Client();

  constructor(config: Partial<WalletPaymentConfig> = {}) {
    this.config = { ...DEFAULT_WALLET_CONFIG, ...config };
  }

  /**
   * Connect to user's wallet
   */
  async connect(walletType: WalletType = 'injected'): Promise<WalletConnection> {
    if (typeof window === 'undefined') {
      throw new Error('Wallet connection requires browser environment');
    }

    let provider: typeof window.ethereum;

    switch (walletType) {
      case 'metamask':
        provider = window.ethereum;
        if (!provider?.isMetaMask) {
          throw new Error('MetaMask not installed');
        }
        break;
      case 'coinbase':
        provider = window.ethereum;
        if (!provider?.isCoinbaseWallet) {
          throw new Error('Coinbase Wallet not installed');
        }
        break;
      case 'phantom':
        // Phantom also injects as window.ethereum for EVM
        provider = window.phantom?.ethereum || window.ethereum;
        break;
      case 'injected':
      default:
        provider = window.ethereum;
        if (!provider) {
          throw new Error('No wallet detected');
        }
    }

    // Request accounts
    const accounts = await provider.request({
      method: 'eth_requestAccounts',
    });

    if (!accounts || accounts.length === 0) {
      throw new Error('No accounts found');
    }

    // Get chain ID
    const chainIdHex = await provider.request({
      method: 'eth_chainId',
    });
    const chainId = parseInt(chainIdHex, 16);

    // Create wallet client
    this.walletClient = createWalletClient({
      chain: CHAINS[chainId] || mainnet,
      transport: custom(provider),
    });

    this.currentConnection = {
      address: accounts[0] as Address,
      chainId,
      walletType,
      isConnected: true,
    };

    // Set up event listeners
    this.setupEventListeners(provider);

    return this.currentConnection;
  }

  /**
   * Set up wallet event listeners
   */
  private setupEventListeners(provider: typeof window.ethereum): void {
    provider?.on?.('accountsChanged', (accounts: string[]) => {
      if (accounts.length === 0) {
        this.disconnect();
      } else if (this.currentConnection) {
        this.currentConnection.address = accounts[0] as Address;
      }
    });

    provider?.on?.('chainChanged', (chainIdHex: string) => {
      const chainId = parseInt(chainIdHex, 16);
      if (this.currentConnection) {
        this.currentConnection.chainId = chainId;
      }
      // Recreate wallet client with new chain
      if (this.walletClient) {
        this.walletClient = createWalletClient({
          chain: CHAINS[chainId] || mainnet,
          transport: custom(provider as Transport),
        });
      }
    });

    provider?.on?.('disconnect', () => {
      this.disconnect();
    });
  }

  /**
   * Disconnect wallet
   */
  disconnect(): void {
    this.walletClient = null;
    this.currentConnection = null;
  }

  /**
   * Get current connection
   */
  getConnection(): WalletConnection | null {
    return this.currentConnection;
  }

  /**
   * Check if connected
   */
  isConnected(): boolean {
    return this.currentConnection?.isConnected ?? false;
  }

  /**
   * Switch chain
   */
  async switchChain(chainId: ChainId): Promise<void> {
    if (!this.currentConnection) {
      throw new Error('Wallet not connected');
    }

    if (this.currentConnection.chainId === chainId) {
      return;
    }

    const provider = window.ethereum;
    if (!provider) {
      throw new Error('No provider available');
    }

    const chainIdHex = `0x${chainId.toString(16)}`;

    try {
      await provider.request({
        method: 'wallet_switchEthereumChain',
        params: [{ chainId: chainIdHex }],
      });
    } catch (error: unknown) {
      const switchError = error as { code?: number };
      // Chain not added, try to add it
      if (switchError.code === 4902) {
        await this.addChain(chainId);
      } else {
        throw error;
      }
    }

    this.currentConnection.chainId = chainId;
  }

  /**
   * Add chain to wallet
   */
  private async addChain(chainId: ChainId): Promise<void> {
    const chain = CHAINS[chainId];
    if (!chain) {
      throw new Error(`Chain ${chainId} not supported`);
    }

    const provider = window.ethereum;
    if (!provider) {
      throw new Error('No provider available');
    }

    await provider.request({
      method: 'wallet_addEthereumChain',
      params: [
        {
          chainId: `0x${chainId.toString(16)}`,
          chainName: chain.name,
          nativeCurrency: chain.nativeCurrency,
          rpcUrls: [chain.rpcUrls.default.http[0]],
          blockExplorerUrls: [chain.blockExplorers?.default?.url],
        },
      ],
    });
  }

  /**
   * Sign payment authorization
   */
  async signPayment(paymentRequest: PaymentRequest): Promise<SignedPayment> {
    if (!this.walletClient || !this.currentConnection) {
      throw new Error('Wallet not connected');
    }

    // Switch chain if needed
    if (this.config.autoSwitchChain && this.currentConnection.chainId !== paymentRequest.chainId) {
      await this.switchChain(paymentRequest.chainId);
    }

    // Prepare message to sign
    const message = this.createPaymentMessage(paymentRequest);

    // Request signature
    const signature = await this.walletClient.signMessage({
      account: this.currentConnection.address,
      message,
    });

    return {
      paymentRequest,
      signature,
      signedAt: Math.floor(Date.now() / 1000),
    };
  }

  /**
   * Create payment message for signing
   */
  private createPaymentMessage(request: PaymentRequest): string {
    return [
      'X402 Payment Authorization',
      '',
      `Payment ID: ${request.id}`,
      `Amount: ${request.amount} ${request.token.symbol}`,
      `Recipient: ${request.recipient}`,
      `Chain: ${request.chainId}`,
      `Description: ${request.description}`,
      `Expires: ${new Date(request.expiresAt * 1000).toISOString()}`,
      '',
      `Nonce: ${request.nonce}`,
    ].join('\n');
  }

  /**
   * Execute payment transaction
   */
  async executePayment(paymentRequest: PaymentRequest): Promise<PaymentResult> {
    if (!this.walletClient || !this.currentConnection) {
      throw new Error('Wallet not connected');
    }

    // Switch chain if needed
    if (this.config.autoSwitchChain && this.currentConnection.chainId !== paymentRequest.chainId) {
      await this.switchChain(paymentRequest.chainId);
    }

    // Create account object
    const account: Account = {
      address: this.currentConnection.address,
      type: 'json-rpc',
      signMessage: async ({ message }) => {
        return this.walletClient!.signMessage({
          account: this.currentConnection!.address,
          message: typeof message === 'string' ? message : message.raw as `0x${string}`,
        });
      },
      signTransaction: async (transaction) => {
        return this.walletClient!.signTransaction({
          ...transaction,
          account: this.currentConnection!.address,
        } as Parameters<typeof this.walletClient.signTransaction>[0]);
      },
      signTypedData: async (typedData) => {
        return this.walletClient!.signTypedData({
          ...typedData,
          account: this.currentConnection!.address,
        } as Parameters<typeof this.walletClient.signTypedData>[0]);
      },
    };

    return this.x402Client.processPayment(paymentRequest, this.walletClient, account);
  }

  /**
   * Sign and execute payment in one step
   */
  async pay(paymentRequest: PaymentRequest): Promise<{
    signed: SignedPayment;
    result: PaymentResult;
    header: string;
  }> {
    // Sign payment
    const signed = await this.signPayment(paymentRequest);

    // Execute payment
    const result = await this.executePayment(paymentRequest);

    // Generate X-PAYMENT header
    const header = this.x402Client.generatePaymentHeader(
      paymentRequest,
      this.currentConnection!.address,
      signed.signature
    );

    return { signed, result, header };
  }

  /**
   * Get token balance
   */
  async getBalance(token: Token): Promise<{ balance: bigint; formatted: string }> {
    if (!this.currentConnection) {
      throw new Error('Wallet not connected');
    }

    return this.x402Client.getTokenBalance(this.currentConnection.address, token);
  }

  /**
   * Track payment confirmation
   */
  async trackPayment(
    paymentId: string,
    chainId: ChainId,
    onUpdate?: (status: string, confirmations: number) => void
  ): Promise<PaymentResult> {
    const maxAttempts = 30;
    const pollInterval = 2000; // 2 seconds

    for (let attempt = 0; attempt < maxAttempts; attempt++) {
      const status = await this.x402Client.getStatus(paymentId, chainId);
      
      onUpdate?.(status, attempt);

      if (status === 'completed') {
        return {
          success: true,
          paymentId,
          amount: '',
          token: '',
          recipient: '0x0' as Address,
          sender: this.currentConnection?.address || '0x0' as Address,
          chainId,
          status: 'completed',
          timestamp: Math.floor(Date.now() / 1000),
        };
      }

      if (status === 'failed' || status === 'expired') {
        return {
          success: false,
          paymentId,
          amount: '',
          token: '',
          recipient: '0x0' as Address,
          sender: this.currentConnection?.address || '0x0' as Address,
          chainId,
          status,
          timestamp: Math.floor(Date.now() / 1000),
          error: `Payment ${status}`,
        };
      }

      await new Promise((resolve) => setTimeout(resolve, pollInterval));
    }

    throw new Error('Payment tracking timeout');
  }
}

// ============================================
// Solana Payment Support
// ============================================

export class SolanaPaymentManager {
  private connection: WalletConnection | null = null;

  /**
   * Connect to Solana wallet (Phantom)
   */
  async connect(): Promise<WalletConnection> {
    if (typeof window === 'undefined') {
      throw new Error('Wallet connection requires browser environment');
    }

    const phantom = window.phantom?.solana;
    if (!phantom?.isPhantom) {
      throw new Error('Phantom wallet not installed');
    }

    const response = await phantom.connect();
    
    this.connection = {
      address: response.publicKey.toString() as Address,
      chainId: 0, // Solana mainnet
      walletType: 'phantom',
      isConnected: true,
    };

    return this.connection;
  }

  /**
   * Disconnect
   */
  async disconnect(): Promise<void> {
    const phantom = window.phantom?.solana;
    await phantom?.disconnect();
    this.connection = null;
  }

  /**
   * Sign and send transaction
   */
  async signAndSendTransaction(transaction: unknown): Promise<string> {
    const phantom = window.phantom?.solana;
    if (!phantom) {
      throw new Error('Phantom not available');
    }

    const { signature } = await phantom.signAndSendTransaction(transaction);
    return signature;
  }
}

// ============================================
// Singleton Instances
// ============================================

let walletPaymentManager: WalletPaymentManager | null = null;
let solanaPaymentManager: SolanaPaymentManager | null = null;

export function getWalletPaymentManager(config?: Partial<WalletPaymentConfig>): WalletPaymentManager {
  if (!walletPaymentManager || config) {
    walletPaymentManager = new WalletPaymentManager(config);
  }
  return walletPaymentManager;
}

export function getSolanaPaymentManager(): SolanaPaymentManager {
  if (!solanaPaymentManager) {
    solanaPaymentManager = new SolanaPaymentManager();
  }
  return solanaPaymentManager;
}

// ============================================
// Global Type Declarations
// ============================================

declare global {
  interface Window {
    ethereum?: {
      isMetaMask?: boolean;
      isCoinbaseWallet?: boolean;
      request: (args: { method: string; params?: unknown[] }) => Promise<unknown>;
      on?: (event: string, callback: (...args: unknown[]) => void) => void;
    };
    phantom?: {
      ethereum?: typeof window.ethereum;
      solana?: {
        isPhantom?: boolean;
        connect: () => Promise<{ publicKey: { toString: () => string } }>;
        disconnect: () => Promise<void>;
        signAndSendTransaction: (tx: unknown) => Promise<{ signature: string }>;
      };
    };
  }
}

export default WalletPaymentManager;
