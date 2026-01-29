/**
 * PayableAgent - AI Agent with payment capabilities
 *
 * Enables AI agents to make and receive payments for services.
 */

import type { PaymentToken, PaymentChain } from "@universal-crypto-mcp/payments-shared";
import { TOKEN_ADDRESSES } from "@universal-crypto-mcp/payments-shared";
import { 
  createWalletClient, 
  http, 
  parseUnits,
  type WalletClient, 
  type Account 
} from "viem";
import { privateKeyToAccount } from "viem/accounts";
import { arbitrum, optimism, base, mainnet, polygon, bsc } from "viem/chains";

/**
 * Agent wallet configuration
 */
export interface AgentWalletConfig {
  privateKey?: `0x${string}`;
  address?: `0x${string}`;
  chain: PaymentChain;
}

/**
 * Payment policy configuration
 */
export interface PaymentPolicyConfig {
  maxPaymentPerRequest: string;
  maxPaymentPerHour: string;
  maxPaymentPerDay: string;
  allowedTokens: PaymentToken[];
  allowedRecipients?: string[];
  requireApproval?: boolean;
}

/**
 * Payment record for tracking
 */
export interface PaymentRecord {
  timestamp: number;
  amount: string;
  token: PaymentToken;
  recipient: string;
  txHash: string;
  purpose: string;
}

/**
 * PayableAgent - AI agent with integrated payment capabilities
 */
export class PayableAgent {
  private wallet: AgentWalletConfig;
  private policy: PaymentPolicyConfig;
  private paymentHistory: PaymentRecord[] = [];
  private hourlySpent = 0;
  private dailySpent = 0;
  private lastHourReset = Date.now();
  private lastDayReset = Date.now();
  private walletClient?: WalletClient;
  private account?: Account;

  constructor(
    wallet: AgentWalletConfig,
    policy: Partial<PaymentPolicyConfig> = {}
  ) {
    this.wallet = wallet;
    this.policy = {
      maxPaymentPerRequest: policy.maxPaymentPerRequest || "1.00",
      maxPaymentPerHour: policy.maxPaymentPerHour || "10.00",
      maxPaymentPerDay: policy.maxPaymentPerDay || "100.00",
      allowedTokens: policy.allowedTokens || ["USDC"],
      allowedRecipients: policy.allowedRecipients,
      requireApproval: policy.requireApproval ?? false,
    };

    // Initialize wallet client if private key is provided
    if (wallet.privateKey) {
      this.account = privateKeyToAccount(wallet.privateKey);
      
      // Map chain string to viem chain object
      const chainMap: Record<PaymentChain, any> = {
        ethereum: mainnet,
        arbitrum: arbitrum,
        optimism: optimism,
        base: base,
        polygon: polygon,
        bsc: bsc,
      };
      
      const chain = chainMap[wallet.chain];
      if (!chain) {
        throw new Error(`Unsupported chain: ${wallet.chain}`);
      }

      this.walletClient = createWalletClient({
        account: this.account,
        chain,
        transport: http(),
      });
    }
  }

  /**
   * Check if a payment is allowed by policy
   */
  canPay(amount: string, token: PaymentToken, recipient: string): boolean {
    this.resetLimitsIfNeeded();

    const amountNum = parseFloat(amount);

    // Check per-request limit
    if (amountNum > parseFloat(this.policy.maxPaymentPerRequest)) {
      return false;
    }

    // Check hourly limit
    if (this.hourlySpent + amountNum > parseFloat(this.policy.maxPaymentPerHour)) {
      return false;
    }

    // Check daily limit
    if (this.dailySpent + amountNum > parseFloat(this.policy.maxPaymentPerDay)) {
      return false;
    }

    // Check allowed tokens
    if (!this.policy.allowedTokens.includes(token)) {
      return false;
    }

    // Check allowed recipients
    if (
      this.policy.allowedRecipients &&
      !this.policy.allowedRecipients.includes(recipient)
    ) {
      return false;
    }

    return true;
  }

  /**
   * Execute a payment
   */
  async pay(
    amount: string,
    token: PaymentToken,
    recipient: string,
    purpose: string
  ): Promise<{ success: boolean; txHash?: string; error?: string }> {
    if (!this.canPay(amount, token, recipient)) {
      return {
        success: false,
        error: "Payment not allowed by policy",
      };
    }

    try {
      // Execute actual payment transaction
      if (!this.walletClient || !this.account) {
        throw new Error("Wallet not initialized for payment execution");
      }

      // Get token address for the specified chain and token
      const tokenAddress = TOKEN_ADDRESSES[this.wallet.chain][token];
      if (!tokenAddress) {
        throw new Error(`Token ${token} not supported on chain ${this.wallet.chain}`);
      }

      // ERC20 transfer ABI
      const transferAbi = [
        {
          inputs: [
            { name: "to", type: "address" },
            { name: "amount", type: "uint256" }
          ],
          name: "transfer",
          outputs: [{ name: "", type: "bool" }],
          stateMutability: "nonpayable",
          type: "function",
        },
      ] as const;

      // Convert amount to token units (assuming 6 decimals for stablecoins)
      const decimals = token === "DAI" ? 18 : 6;
      const amountInUnits = parseUnits(amount, decimals);

      // Execute the transfer
      const txHash = await this.walletClient.writeContract({
        address: tokenAddress as `0x${string}`,
        abi: transferAbi,
        functionName: "transfer",
        args: [recipient as `0x${string}`, amountInUnits],
        account: this.account,
      });

      // Record the payment after successful execution
      const record: PaymentRecord = {
        timestamp: Date.now(),
        amount,
        token,
        recipient,
        txHash,
        purpose,
      };
      this.paymentHistory.push(record);

      // Update spending limits
      const amountNum = parseFloat(amount);
      this.hourlySpent += amountNum;
      this.dailySpent += amountNum;

      return {
        success: true,
        txHash,
      };
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : "Unknown error",
      };
    }
  }

  /**
   * Handle incoming x402 payment request
   */
  async handlePaymentRequired(
    paymentDetails: {
      amount: string;
      token: PaymentToken;
      recipient: string;
      description?: string;
    }
  ): Promise<{ paid: boolean; txHash?: string; reason?: string }> {
    const { amount, token, recipient, description } = paymentDetails;

    if (!this.canPay(amount, token, recipient)) {
      return {
        paid: false,
        reason: "Payment exceeds policy limits",
      };
    }

    const result = await this.pay(
      amount,
      token,
      recipient,
      description || "x402 payment"
    );

    return {
      paid: result.success,
      txHash: result.txHash,
      reason: result.error,
    };
  }

  /**
   * Get payment history
   */
  getPaymentHistory(): PaymentRecord[] {
    return [...this.paymentHistory];
  }

  /**
   * Get current spending summary
   */
  getSpendingSummary(): {
    hourlySpent: number;
    dailySpent: number;
    hourlyLimit: string;
    dailyLimit: string;
    hourlyRemaining: number;
    dailyRemaining: number;
  } {
    this.resetLimitsIfNeeded();

    return {
      hourlySpent: this.hourlySpent,
      dailySpent: this.dailySpent,
      hourlyLimit: this.policy.maxPaymentPerHour,
      dailyLimit: this.policy.maxPaymentPerDay,
      hourlyRemaining: parseFloat(this.policy.maxPaymentPerHour) - this.hourlySpent,
      dailyRemaining: parseFloat(this.policy.maxPaymentPerDay) - this.dailySpent,
    };
  }

  /**
   * Get wallet address
   */
  getAddress(): `0x${string}` | undefined {
    return this.wallet.address;
  }

  private resetLimitsIfNeeded(): void {
    const now = Date.now();
    const oneHour = 60 * 60 * 1000;
    const oneDay = 24 * oneHour;

    if (now - this.lastHourReset > oneHour) {
      this.hourlySpent = 0;
      this.lastHourReset = now;
    }

    if (now - this.lastDayReset > oneDay) {
      this.dailySpent = 0;
      this.lastDayReset = now;
    }
  }
}
