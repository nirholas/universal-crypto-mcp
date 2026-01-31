export const config = { runtime: 'edge' };

// RPC endpoints for different chains
const RPC_ENDPOINTS: Record<string, string> = {
  '1': process.env.ETH_RPC_URL || 'https://eth.llamarpc.com',
  '137': process.env.POLYGON_RPC_URL || 'https://polygon.llamarpc.com',
  '42161': process.env.ARBITRUM_RPC_URL || 'https://arbitrum.llamarpc.com',
  '10': process.env.OPTIMISM_RPC_URL || 'https://optimism.llamarpc.com',
  '8453': process.env.BASE_RPC_URL || 'https://base.llamarpc.com',
  '56': process.env.BSC_RPC_URL || 'https://bsc-dataseed.binance.org',
  '43114': process.env.AVALANCHE_RPC_URL || 'https://api.avax.network/ext/bc/C/rpc',
};

// Gas price APIs
const ETHERSCAN_GAS_API = 'https://api.etherscan.io/api?module=gastracker&action=gasoracle';

/**
 * Estimate gas for a transaction
 * 
 * Parameters:
 * // to: string (required) - Target address
 * // from: string - Sender address
 * // data: string - Transaction calldata (hex)
 * // value: string - ETH value in wei
 * // chainId: string - Chain ID (default: 1 for Ethereum)
 */
export default async function handler(req: Request) {
  if (req.method !== 'POST') {
    return new Response(JSON.stringify({ error: 'Method not allowed' }), {
      status: 405,
      headers: { 'Content-Type': 'application/json' },
    });
  }

  try {
    const body = await req.json() as {
      to?: string;
      from?: string;
      data?: string;
      value?: string;
      chainId?: string;
    };
    
    const { to, from, data, value, chainId = '1' } = body;

    if (!to) {
      return new Response(JSON.stringify({ error: 'Target address (to) is required' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    const rpcUrl = RPC_ENDPOINTS[chainId];
    if (!rpcUrl) {
      return new Response(JSON.stringify({ error: `Unsupported chain ID: ${chainId}` }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    // Estimate gas using eth_estimateGas
    const gasLimit = await estimateGasLimit(rpcUrl, { to, from, data, value });
    
    // Get current gas prices
    const gasPrices = await getGasPrices(rpcUrl, chainId);
    
    // Calculate costs
    const baseCost = gasLimit * gasPrices.standard;
    const fastCost = gasLimit * gasPrices.fast;
    const instantCost = gasLimit * gasPrices.instant;
    
    const result = {
      success: true,
      data: {
        gasLimit,
        gasPrices: {
          slow: {
            gwei: gasPrices.slow,
            costWei: (gasLimit * gasPrices.slow * 1e9).toString(),
            costEth: formatEth(gasLimit * gasPrices.slow * 1e9),
          },
          standard: {
            gwei: gasPrices.standard,
            costWei: (baseCost * 1e9).toString(),
            costEth: formatEth(baseCost * 1e9),
          },
          fast: {
            gwei: gasPrices.fast,
            costWei: (fastCost * 1e9).toString(),
            costEth: formatEth(fastCost * 1e9),
          },
          instant: {
            gwei: gasPrices.instant,
            costWei: (instantCost * 1e9).toString(),
            costEth: formatEth(instantCost * 1e9),
          },
        },
        chainId,
        estimatedAt: new Date().toISOString(),
      },
    };

    return new Response(JSON.stringify(result), {
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (error) {
    return new Response(JSON.stringify({ 
      error: error instanceof Error ? error.message : 'Server error' 
    }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }
}

async function estimateGasLimit(
  rpcUrl: string,
  params: { to: string; from?: string; data?: string; value?: string }
): Promise<number> {
  try {
    const response = await fetch(rpcUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        jsonrpc: '2.0',
        id: 1,
        method: 'eth_estimateGas',
        params: [{
          to: params.to,
          from: params.from || '0x0000000000000000000000000000000000000000',
          data: params.data || '0x',
          value: params.value || '0x0',
        }],
      }),
      signal: AbortSignal.timeout(10000),
    });

    if (!response.ok) throw new Error('RPC request failed');

    const data = await response.json() as { result?: string; error?: { message: string } };
    
    if (data.error) {
      throw new Error(data.error.message);
    }

    return parseInt(data.result || '21000', 16);
  } catch {
    // Return default gas for simple transfer
    return 21000;
  }
}

async function getGasPrices(rpcUrl: string, chainId: string): Promise<{
  slow: number;
  standard: number;
  fast: number;
  instant: number;
}> {
  // For Ethereum mainnet, try Etherscan API
  if (chainId === '1' && process.env.ETHERSCAN_API_KEY) {
    try {
      const response = await fetch(
        `${ETHERSCAN_GAS_API}&apikey=${process.env.ETHERSCAN_API_KEY}`,
        { signal: AbortSignal.timeout(5000) }
      );
      
      if (response.ok) {
        const data = await response.json() as {
          result?: {
            SafeGasPrice?: string;
            ProposeGasPrice?: string;
            FastGasPrice?: string;
          };
        };
        
        if (data.result) {
          return {
            slow: parseFloat(data.result.SafeGasPrice || '20'),
            standard: parseFloat(data.result.ProposeGasPrice || '25'),
            fast: parseFloat(data.result.FastGasPrice || '30'),
            instant: parseFloat(data.result.FastGasPrice || '30') * 1.2,
          };
        }
      }
    } catch {
      // Fall back to RPC
    }
  }

  // Use eth_gasPrice from RPC
  try {
    const response = await fetch(rpcUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        jsonrpc: '2.0',
        id: 1,
        method: 'eth_gasPrice',
        params: [],
      }),
      signal: AbortSignal.timeout(5000),
    });

    if (response.ok) {
      const data = await response.json() as { result?: string };
      const basePriceWei = parseInt(data.result || '0', 16);
      const basePriceGwei = basePriceWei / 1e9;
      
      return {
        slow: basePriceGwei * 0.8,
        standard: basePriceGwei,
        fast: basePriceGwei * 1.2,
        instant: basePriceGwei * 1.5,
      };
    }
  } catch {
    // Return defaults
  }

  return { slow: 20, standard: 25, fast: 30, instant: 40 };
}

function formatEth(wei: number): string {
  return (wei / 1e18).toFixed(8);
}
