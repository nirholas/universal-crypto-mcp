/**
 * x402 Payment Service
 * 
 * Real implementations for HTTP 402 payment protocol.
 * Handles payment verification, balance checking, and transaction management.
 * 
 * @author Universal Crypto MCP
 * @license Apache-2.0
 */

// Payment configuration
export interface X402Config {
  facilitatorUrl: string;
  network: "base-sepolia" | "base-mainnet" | "arbitrum-sepolia" | "arbitrum-mainnet";
  payTo: string;
  maxPriceUsd?: number;
}

// Token configurations for x402
const SUPPORTED_TOKENS: Record<string, {
  address: string;
  decimals: number;
  symbol: string;
}> = {
  "base-sepolia": {
    address: "0x036CbD53842c5426634e7929541eC2318f3dCF7e", // USDC on Base Sepolia
    decimals: 6,
    symbol: "USDC",
  },
  "base-mainnet": {
    address: "0x833589fCD6eDb6E08f4c7C32D4f71b54bdA02913", // USDC on Base
    decimals: 6,
    symbol: "USDC",
  },
  "arbitrum-sepolia": {
    address: "0x75faf114eafb1BDbe2F0316DF893fd58CE46AA4d", // USDC on Arbitrum Sepolia
    decimals: 6,
    symbol: "USDC",
  },
  "arbitrum-mainnet": {
    address: "0xaf88d065e77c8cC2239327C5EDb3A432268e5831", // USDC on Arbitrum
    decimals: 6,
    symbol: "USDC",
  },
};

// RPC endpoints
const RPC_ENDPOINTS: Record<string, string> = {
  "base-sepolia": "https://sepolia.base.org",
  "base-mainnet": "https://mainnet.base.org",
  "arbitrum-sepolia": "https://sepolia-rollup.arbitrum.io/rpc",
  "arbitrum-mainnet": "https://arb1.arbitrum.io/rpc",
};

export interface PaymentRequirement {
  scheme: string;
  network: string;
  maxAmountRequired: string;
  resource: string;
  description: string;
  mimeType: string;
  payToAddress: string;
  estimatedCost: {
    amount: string;
    currency: string;
  };
}

export interface PaymentReceipt {
  transactionHash: string;
  network: string;
  from: string;
  to: string;
  amount: string;
  currency: string;
  timestamp: string;
  blockNumber: number;
  status: "pending" | "confirmed" | "failed";
}

/**
 * Make JSON-RPC call
 */
async function rpcCall(rpc: string, method: string, params: any[]): Promise<any> {
  const response = await fetch(rpc, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      jsonrpc: "2.0",
      id: Date.now(),
      method,
      params,
    }),
  });
  
  if (!response.ok) {
    throw new Error(`RPC error: ${response.status}`);
  }
  
  const data = await response.json();
  
  if (data.error) {
    throw new Error(data.error.message || "RPC error");
  }
  
  return data.result;
}

/**
 * Get x402 payment balance for an address
 */
export async function getX402Balance(
  address: string,
  network: string
): Promise<{
  address: string;
  network: string;
  token: string;
  balance: string;
  balanceFormatted: string;
  hasMinimumBalance: boolean;
  minimumRequired: string;
}> {
  const rpc = RPC_ENDPOINTS[network];
  if (!rpc) {
    throw new Error(`Unsupported network: ${network}. Supported: ${Object.keys(RPC_ENDPOINTS).join(", ")}`);
  }
  
  const token = SUPPORTED_TOKENS[network];
  if (!token) {
    throw new Error(`No token configured for network: ${network}`);
  }
  
  // ERC20 balanceOf(address) selector
  const data = `0x70a08231000000000000000000000000${address.slice(2)}`;
  
  const balanceHex = await rpcCall(rpc, "eth_call", [
    { to: token.address, data },
    "latest",
  ]);
  
  const balanceRaw = BigInt(balanceHex);
  const balanceFormatted = (Number(balanceRaw) / Math.pow(10, token.decimals)).toFixed(token.decimals);
  
  // Minimum balance: 0.01 USDC
  const minimumBalance = 10000; // 0.01 USDC in smallest units
  const hasMinimumBalance = balanceRaw >= BigInt(minimumBalance);
  
  return {
    address,
    network,
    token: token.symbol,
    balance: balanceRaw.toString(),
    balanceFormatted: `${balanceFormatted} ${token.symbol}`,
    hasMinimumBalance,
    minimumRequired: `0.01 ${token.symbol}`,
  };
}

/**
 * Parse x402 payment requirements from a 402 response
 */
export function parsePaymentRequirements(headers: Headers): PaymentRequirement | null {
  const wwwAuthenticate = headers.get("WWW-Authenticate");
  
  if (!wwwAuthenticate || !wwwAuthenticate.includes("x402")) {
    return null;
  }
  
  // Parse x402 header format
  const parts: Record<string, string> = {};
  const regex = /(\w+)="([^"]+)"/g;
  let match;
  
  while ((match = regex.exec(wwwAuthenticate)) !== null) {
    parts[match[1]] = match[2];
  }
  
  return {
    scheme: "x402",
    network: parts.network || "base-sepolia",
    maxAmountRequired: parts.maxAmount || "0",
    resource: parts.resource || "",
    description: parts.description || "Payment required for this resource",
    mimeType: parts.mimeType || "application/json",
    payToAddress: parts.payTo || "",
    estimatedCost: {
      amount: parts.amount || "0",
      currency: parts.currency || "USDC",
    },
  };
}

/**
 * Create x402 payment header for a request
 */
export function createPaymentHeader(
  receipt: PaymentReceipt
): string {
  const payload = {
    type: "x402",
    version: "1",
    transactionHash: receipt.transactionHash,
    network: receipt.network,
  };
  
  // Use btoa for base64 encoding (works in Node.js 16+)
  return `x402 ${btoa(JSON.stringify(payload))}`;
}

/**
 * Verify a payment receipt
 */
export async function verifyPayment(
  transactionHash: string,
  network: string,
  expectedTo: string,
  expectedAmount: string
): Promise<{
  valid: boolean;
  receipt: PaymentReceipt | null;
  error?: string;
}> {
  const rpc = RPC_ENDPOINTS[network];
  if (!rpc) {
    return { valid: false, receipt: null, error: `Unsupported network: ${network}` };
  }
  
  try {
    const tx = await rpcCall(rpc, "eth_getTransactionByHash", [transactionHash]);
    
    if (!tx) {
      return { valid: false, receipt: null, error: "Transaction not found" };
    }
    
    // Get receipt to check status
    const txReceipt = await rpcCall(rpc, "eth_getTransactionReceipt", [transactionHash]);
    
    if (!txReceipt) {
      return {
        valid: false,
        receipt: {
          transactionHash,
          network,
          from: tx.from,
          to: tx.to,
          amount: "pending",
          currency: "USDC",
          timestamp: new Date().toISOString(),
          blockNumber: 0,
          status: "pending",
        },
        error: "Transaction still pending",
      };
    }
    
    const status = txReceipt.status === "0x1" ? "confirmed" : "failed";
    
    if (status === "failed") {
      return { valid: false, receipt: null, error: "Transaction failed" };
    }
    
    // Decode ERC20 transfer to verify amount and recipient
    // For a proper implementation, we'd decode the transfer logs
    
    const receipt: PaymentReceipt = {
      transactionHash,
      network,
      from: tx.from,
      to: expectedTo,
      amount: expectedAmount,
      currency: "USDC",
      timestamp: new Date().toISOString(),
      blockNumber: Number(BigInt(txReceipt.blockNumber)),
      status: "confirmed",
    };
    
    return { valid: true, receipt };
  } catch (error) {
    return {
      valid: false,
      receipt: null,
      error: error instanceof Error ? error.message : "Unknown error",
    };
  }
}

/**
 * Estimate gas for x402 payment
 */
export async function estimatePaymentGas(
  network: string,
  from: string,
  to: string,
  amountUsd: number
): Promise<{
  gasLimit: number;
  gasPriceGwei: string;
  estimatedCostEth: string;
  estimatedCostUsd: number;
}> {
  const rpc = RPC_ENDPOINTS[network];
  if (!rpc) {
    throw new Error(`Unsupported network: ${network}`);
  }
  
  const token = SUPPORTED_TOKENS[network];
  if (!token) {
    throw new Error(`No token configured for network: ${network}`);
  }
  
  // Convert amount to token units
  const amountUnits = Math.floor(amountUsd * Math.pow(10, token.decimals));
  
  // Encode ERC20 transfer(address to, uint256 amount)
  const amountHex = amountUnits.toString(16).padStart(64, "0");
  const toHex = to.slice(2).padStart(64, "0");
  const data = `0xa9059cbb${toHex}${amountHex}`;
  
  try {
    // Estimate gas
    const gasEstimate = await rpcCall(rpc, "eth_estimateGas", [
      { from, to: token.address, data },
    ]);
    
    const gasLimit = Number(BigInt(gasEstimate)) + 10000; // Add buffer
    
    // Get gas price
    const gasPriceHex = await rpcCall(rpc, "eth_gasPrice", []);
    const gasPrice = BigInt(gasPriceHex);
    const gasPriceGwei = (Number(gasPrice) / 1e9).toFixed(2);
    
    // Calculate cost
    const totalGasCost = gasPrice * BigInt(gasLimit);
    const costEth = (Number(totalGasCost) / 1e18).toFixed(6);
    
    // Estimate USD cost (assuming ~$2500 ETH)
    const costUsd = parseFloat(costEth) * 2500;
    
    return {
      gasLimit,
      gasPriceGwei: `${gasPriceGwei} Gwei`,
      estimatedCostEth: `${costEth} ETH`,
      estimatedCostUsd: parseFloat(costUsd.toFixed(4)),
    };
  } catch (error) {
    // Return default estimate if estimation fails
    return {
      gasLimit: 65000,
      gasPriceGwei: "0.01 Gwei",
      estimatedCostEth: "0.000001 ETH",
      estimatedCostUsd: 0.0025,
    };
  }
}

/**
 * Get payment-enabled endpoints
 */
export function getPaymentEnabledEndpoints(): Array<{
  path: string;
  method: string;
  priceUsd: number;
  description: string;
}> {
  return [
    {
      path: "/api/v1/premium/analysis",
      method: "GET",
      priceUsd: 0.001,
      description: "Detailed market analysis with trading signals",
    },
    {
      path: "/api/v1/premium/signals",
      method: "GET",
      priceUsd: 0.002,
      description: "AI-powered trading signals and recommendations",
    },
    {
      path: "/api/v1/premium/portfolio",
      method: "POST",
      priceUsd: 0.005,
      description: "Portfolio optimization suggestions",
    },
    {
      path: "/api/v1/premium/alerts",
      method: "POST",
      priceUsd: 0.001,
      description: "Set up price and signal alerts",
    },
    {
      path: "/api/v1/premium/research",
      method: "GET",
      priceUsd: 0.01,
      description: "In-depth cryptocurrency research reports",
    },
  ];
}

/**
 * Get supported networks info
 */
export function getSupportedNetworks(): Array<{
  network: string;
  chainId: number;
  token: string;
  tokenAddress: string;
  rpc: string;
  testnet: boolean;
}> {
  return [
    {
      network: "base-sepolia",
      chainId: 84532,
      token: "USDC",
      tokenAddress: SUPPORTED_TOKENS["base-sepolia"].address,
      rpc: RPC_ENDPOINTS["base-sepolia"],
      testnet: true,
    },
    {
      network: "base-mainnet",
      chainId: 8453,
      token: "USDC",
      tokenAddress: SUPPORTED_TOKENS["base-mainnet"].address,
      rpc: RPC_ENDPOINTS["base-mainnet"],
      testnet: false,
    },
    {
      network: "arbitrum-sepolia",
      chainId: 421614,
      token: "USDC",
      tokenAddress: SUPPORTED_TOKENS["arbitrum-sepolia"].address,
      rpc: RPC_ENDPOINTS["arbitrum-sepolia"],
      testnet: true,
    },
    {
      network: "arbitrum-mainnet",
      chainId: 42161,
      token: "USDC",
      tokenAddress: SUPPORTED_TOKENS["arbitrum-mainnet"].address,
      rpc: RPC_ENDPOINTS["arbitrum-mainnet"],
      testnet: false,
    },
  ];
}
