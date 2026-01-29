import { createPublicClient, http, parseUnits, formatUnits, decodeEventLog, parseAbi } from "viem";
import { base, baseSepolia, arbitrum, mainnet, polygon } from "viem/chains";

// ERC20 Transfer event ABI
const erc20TransferAbi = parseAbi([
  "event Transfer(address indexed from, address indexed to, uint256 value)"
]);

// USDC contract addresses by network
const USDC_ADDRESSES: Record<string, `0x${string}`> = {
  "eip155:1": "0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48",
  "eip155:8453": "0x833589fCD6eDb6E08f4c7C32D4f71b54bdA02913",
  "eip155:84532": "0x036CbD53842c5426634e7929541eC2318f3dCF7e",
  "eip155:42161": "0xaf88d065e77c8cC2239327C5EDb3A432268e5831",
  "eip155:137": "0x3c499c542cEF5E3811e1192ce70d8cC03d5c3359",
};

export interface VerifyPaymentOptions {
  paymentHeader: string;
  expectedPrice: string;
  expectedPayTo: string;
  network: string;
  facilitatorUrl: string;
  testMode?: boolean;
}

export interface PaymentVerification {
  valid: boolean;
  payer: string;
  amount: string;
  txHash?: string;
  remainingBalance?: string;
  error?: string;
}

/**
 * Verify an x402 payment header
 */
export async function verifyPayment(
  options: VerifyPaymentOptions
): Promise<PaymentVerification> {
  const { paymentHeader, expectedPrice, expectedPayTo, network, facilitatorUrl, testMode } = options;

  try {
    // Parse the payment header
    const payment = JSON.parse(Buffer.from(paymentHeader, "base64").toString());

    // In test mode, accept any valid-looking payment
    if (testMode) {
      return {
        valid: true,
        payer: payment.payer || "0xTestPayer",
        amount: expectedPrice,
        txHash: "0xtest_" + Date.now().toString(16),
      };
    }

    // Verify with facilitator
    const response = await fetch(`${facilitatorUrl}/verify`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        payment,
        expectedPrice: parsePrice(expectedPrice),
        expectedPayTo,
        network,
      }),
    });

    if (!response.ok) {
      const error = await response.json();
      return {
        valid: false,
        payer: payment.payer || "unknown",
        amount: "0",
        error: error.message || "Facilitator verification failed",
      };
    }

    const result = await response.json();

    return {
      valid: result.valid,
      payer: result.payer,
      amount: result.amount,
      txHash: result.txHash,
      remainingBalance: result.remainingBalance,
    };
  } catch (error) {
    return {
      valid: false,
      payer: "unknown",
      amount: "0",
      error: `Payment verification failed: ${error}`,
    };
  }
}

/**
 * Verify payment directly on-chain (without facilitator)
 */
export async function verifyPaymentOnChain(
  options: VerifyPaymentOptions
): Promise<PaymentVerification> {
  const { paymentHeader, expectedPrice, expectedPayTo, network } = options;

  try {
    const payment = JSON.parse(Buffer.from(paymentHeader, "base64").toString());
    const chain = getChain(network);
    
    const client = createPublicClient({
      chain,
      transport: http(),
    });

    // Get transaction receipt
    const receipt = await client.getTransactionReceipt({
      hash: payment.txHash as `0x${string}`,
    });

    if (receipt.status !== "success") {
      return {
        valid: false,
        payer: payment.payer,
        amount: "0",
        error: "Transaction failed",
      };
    }

    // Get the USDC contract address for this network
    const usdcAddress = USDC_ADDRESSES[network];
    if (!usdcAddress) {
      return {
        valid: false,
        payer: payment.payer,
        amount: "0",
        error: `Unsupported network for on-chain verification: ${network}`,
      };
    }

    // Parse ERC20 Transfer events from the transaction logs
    let totalTransferred = BigInt(0);
    let recipientMatched = false;

    for (const log of receipt.logs) {
      // Check if this log is from the USDC contract
      if (log.address.toLowerCase() !== usdcAddress.toLowerCase()) {
        continue;
      }

      try {
        const decoded = decodeEventLog({
          abi: erc20TransferAbi,
          data: log.data,
          topics: log.topics,
        });

        if (decoded.eventName === "Transfer") {
          const { from, to, value } = decoded.args as { from: string; to: string; value: bigint };
          
          // Verify the recipient matches expected payTo address
          if (to.toLowerCase() === expectedPayTo.toLowerCase()) {
            totalTransferred += value;
            recipientMatched = true;
          }
        }
      } catch (e) {
        // Not a Transfer event, skip
        continue;
      }
    }

    if (!recipientMatched) {
      return {
        valid: false,
        payer: payment.payer,
        amount: "0",
        error: `No transfer found to expected recipient: ${expectedPayTo}`,
      };
    }

    // Verify the amount meets the expected price
    const expectedAmount = parsePrice(expectedPrice);
    if (totalTransferred < expectedAmount) {
      return {
        valid: false,
        payer: payment.payer,
        amount: formatUnits(totalTransferred, 6),
        error: `Insufficient payment: expected ${formatUnits(expectedAmount, 6)}, got ${formatUnits(totalTransferred, 6)}`,
      };
    }

    return {
      valid: true,
      payer: payment.payer,
      amount: formatUnits(totalTransferred, 6),
      txHash: payment.txHash,
    };
  } catch (error) {
    return {
      valid: false,
      payer: "unknown",
      amount: "0",
      error: `On-chain verification failed: ${error}`,
    };
  }
}

function parsePrice(price: string): bigint {
  // Parse "$0.01" format to wei
  const numericPrice = parseFloat(price.replace("$", ""));
  return parseUnits(numericPrice.toString(), 6); // USDC decimals
}

function getChain(network: string) {
  const chains: Record<string, any> = {
    "eip155:1": mainnet,
    "eip155:8453": base,
    "eip155:84532": baseSepolia,
    "eip155:42161": arbitrum,
    "eip155:137": polygon,
  };
  return chains[network] || baseSepolia;
}
