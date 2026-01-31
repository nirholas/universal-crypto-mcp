/**
 * x402 Payment Verification Middleware
 * Verifies crypto payments before allowing API access
 * 
 * @author nirholas (Nich)
 * @website x.com/nichxbt
 */

import { Request, Response, NextFunction } from "express";
import { ethers } from "ethers";
import { 
  WALLET_ADDRESS, 
  NETWORK, 
  FACILITATOR,
  getToolPrice, 
  parsePrice, 
  usdToTokenUnits 
} from "../config/pricing.js";

// USDC contract addresses by network
const USDC_ADDRESSES: Record<string, string> = {
  "eip155:1": "0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48",
  "eip155:8453": "0x833589fCD6eDb6E08f4c7C32D4f71b54bdA02913",
  "eip155:84532": "0x036CbD53842c5426634e7929541eC2318f3dCF7e",
  "eip155:42161": "0xaf88d065e77c8cC2239327C5EDb3A432268e5831",
  "eip155:137": "0x3c499c542cEF5E3811e1192ce70d8cC03d5c3359"
};

// RPC endpoints by network
const RPC_ENDPOINTS: Record<string, string> = {
  "eip155:1": "https://eth.llamarpc.com",
  "eip155:8453": "https://mainnet.base.org",
  "eip155:84532": "https://sepolia.base.org",
  "eip155:42161": "https://arb1.arbitrum.io/rpc",
  "eip155:137": "https://polygon-rpc.com"
};

export interface PaymentRequirement {
  scheme: string;
  network: string;
  maxAmountRequired: string;
  resource: string;
  description: string;
  payTo: string;
  maxTimeoutSeconds: number;
  asset: string;
  extra: {
    name: string;
    version: string;
  };
}

// Generate x402 payment requirement
export function generatePaymentRequirement(
  toolName: string,
  serverId?: string
): PaymentRequirement {
  const priceStr = getToolPrice(toolName, serverId);
  const priceUsd = parsePrice(priceStr);
  const amountUnits = usdToTokenUnits(priceUsd);
  
  return {
    scheme: "exact",
    network: NETWORK,
    maxAmountRequired: amountUnits.toString(),
    resource: toolName,
    description: `Payment for ${toolName}`,
    payTo: WALLET_ADDRESS,
    maxTimeoutSeconds: 300,
    asset: USDC_ADDRESSES[NETWORK] || USDC_ADDRESSES["eip155:8453"],
    extra: {
      name: "universal-crypto-mcp",
      version: "1.0.0"
    }
  };
}

// Verify payment using facilitator
async function verifyWithFacilitator(
  paymentHeader: string,
  requirement: PaymentRequirement
): Promise<{ valid: boolean; error?: string }> {
  try {
    const response = await fetch(`${FACILITATOR}/verify`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        payment: paymentHeader,
        requirement
      })
    });
    
    if (!response.ok) {
      return { valid: false, error: `Facilitator error: ${response.status}` };
    }
    
    const result = await response.json() as { valid: boolean; error?: string };
    return { valid: result.valid, error: result.error };
  } catch (error: any) {
    console.error("Facilitator verification failed:", error);
    return { valid: false, error: error.message };
  }
}

// Verify payment on-chain (fallback)
async function verifyOnChain(
  paymentHeader: string,
  requirement: PaymentRequirement
): Promise<{ valid: boolean; error?: string }> {
  try {
    // Parse payment header
    const payment = JSON.parse(Buffer.from(paymentHeader, "base64").toString());
    
    if (!payment.txHash) {
      return { valid: false, error: "No transaction hash in payment" };
    }
    
    // Get provider for the network
    const rpc = RPC_ENDPOINTS[requirement.network];
    if (!rpc) {
      return { valid: false, error: `Unsupported network: ${requirement.network}` };
    }
    
    const provider = new ethers.JsonRpcProvider(rpc);
    
    // Get transaction receipt
    const receipt = await provider.getTransactionReceipt(payment.txHash);
    if (!receipt) {
      return { valid: false, error: "Transaction not found" };
    }
    
    if (!receipt.status) {
      return { valid: false, error: "Transaction failed" };
    }
    
    // Verify transfer event
    const usdcAddress = requirement.asset.toLowerCase();
    const transferTopic = ethers.id("Transfer(address,address,uint256)");
    
    for (const log of receipt.logs) {
      if (log.address.toLowerCase() === usdcAddress && log.topics[0] === transferTopic) {
        const to = "0x" + log.topics[2].slice(26).toLowerCase();
        if (to === requirement.payTo.toLowerCase()) {
          const amount = BigInt(log.data);
          if (amount >= BigInt(requirement.maxAmountRequired)) {
            return { valid: true };
          }
        }
      }
    }
    
    return { valid: false, error: "Payment not found in transaction" };
  } catch (error: any) {
    console.error("On-chain verification failed:", error);
    return { valid: false, error: error.message };
  }
}

// Main payment verification middleware
export function x402PaymentMiddleware(
  options: { requirePayment?: boolean } = {}
) {
  return async (req: Request, res: Response, next: NextFunction) => {
    const paymentHeader = req.headers["x-payment"] as string;
    
    // Extract tool name from request
    const toolName = extractToolName(req);
    
    // Check if this is a free endpoint
    if (isFreeEndpoint(req.path)) {
      return next();
    }
    
    // If no payment provided
    if (!paymentHeader) {
      if (options.requirePayment) {
        // Return 402 Payment Required with payment details
        const requirement = generatePaymentRequirement(toolName);
        res.status(402).json({
          error: "Payment Required",
          code: 402,
          accepts: requirement,
          message: `This endpoint requires payment. Price: ${getToolPrice(toolName)}`
        });
        return;
      }
      // Allow with rate limiting for free tier
      return next();
    }
    
    // Verify payment
    const requirement = generatePaymentRequirement(toolName);
    
    // Try facilitator first, then on-chain
    let verification = await verifyWithFacilitator(paymentHeader, requirement);
    
    if (!verification.valid && verification.error?.includes("Facilitator")) {
      // Fallback to on-chain verification
      verification = await verifyOnChain(paymentHeader, requirement);
    }
    
    if (!verification.valid) {
      res.status(402).json({
        error: "Payment Invalid",
        code: 402,
        details: verification.error,
        accepts: requirement
      });
      return;
    }
    
    // Payment verified - add to request context
    (req as any).paymentVerified = true;
    (req as any).paymentAmount = requirement.maxAmountRequired;
    
    // Add payment response header
    res.setHeader("X-Payment-Response", JSON.stringify({
      success: true,
      amount: requirement.maxAmountRequired,
      network: requirement.network
    }));
    
    next();
  };
}

// Extract tool name from request
function extractToolName(req: Request): string {
  // From path: /api/v1/tools/{toolName}
  const pathMatch = req.path.match(/\/tools\/([^/]+)/);
  if (pathMatch) return pathMatch[1];
  
  // From body
  if (req.body?.tool) return req.body.tool;
  if (req.body?.name) return req.body.name;
  
  // From query
  if (req.query.tool) return req.query.tool as string;
  
  return "unknown";
}

// Check if endpoint is free
function isFreeEndpoint(path: string): boolean {
  const freeEndpoints = [
    "/health",
    "/",
    "/.well-known/x402",
    "/api/v1/discovery",
    "/api/v1/pricing"
  ];
  return freeEndpoints.some(ep => path === ep || path.startsWith(ep));
}

// Discovery endpoint middleware
export function x402DiscoveryMiddleware(req: Request, res: Response) {
  res.json({
    version: "1.0",
    payTo: WALLET_ADDRESS,
    network: NETWORK,
    facilitator: FACILITATOR,
    assets: [USDC_ADDRESSES[NETWORK]],
    description: "Universal Crypto MCP - Enterprise API Gateway",
    pricing: {
      model: "per-request",
      currency: "USD",
      defaultPrice: "$0.001"
    },
    categories: ["defi", "layer2", "nft", "market-data", "wallets"],
    documentation: "https://github.com/nirholas/universal-crypto-mcp"
  });
}

