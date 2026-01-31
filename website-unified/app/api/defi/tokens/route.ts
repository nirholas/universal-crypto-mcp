import { NextRequest, NextResponse } from 'next/server';

// Popular tokens by chain
const TOKENS: Record<string, Array<{
  symbol: string;
  name: string;
  address: string;
  decimals: number;
  logo: string;
}>> = {
  ethereum: [
    { symbol: 'ETH', name: 'Ethereum', address: '0xEeeeeEeeeEeEeeEeEeEeeEEEeeeeEeeeeeeeEEeE', decimals: 18, logo: '/tokens/eth.svg' },
    { symbol: 'WETH', name: 'Wrapped Ether', address: '0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2', decimals: 18, logo: '/tokens/weth.svg' },
    { symbol: 'USDC', name: 'USD Coin', address: '0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48', decimals: 6, logo: '/tokens/usdc.svg' },
    { symbol: 'USDT', name: 'Tether', address: '0xdAC17F958D2ee523a2206206994597C13D831ec7', decimals: 6, logo: '/tokens/usdt.svg' },
    { symbol: 'DAI', name: 'Dai', address: '0x6B175474E89094C44Da98b954EescdeCB5BE3FD51', decimals: 18, logo: '/tokens/dai.svg' },
    { symbol: 'WBTC', name: 'Wrapped Bitcoin', address: '0x2260FAC5E5542a773Aa44fBCfeDf7C193bc2C599', decimals: 8, logo: '/tokens/wbtc.svg' },
    { symbol: 'LINK', name: 'Chainlink', address: '0x514910771AF9Ca656af840dff83E8264EcF986CA', decimals: 18, logo: '/tokens/link.svg' },
    { symbol: 'UNI', name: 'Uniswap', address: '0x1f9840a85d5aF5bf1D1762F925BDADdC4201F984', decimals: 18, logo: '/tokens/uni.svg' },
  ],
  arbitrum: [
    { symbol: 'ETH', name: 'Ethereum', address: '0xEeeeeEeeeEeEeeEeEeEeeEEEeeeeEeeeeeeeEEeE', decimals: 18, logo: '/tokens/eth.svg' },
    { symbol: 'USDC', name: 'USD Coin', address: '0xaf88d065e77c8cC2239327C5EDb3A432268e5831', decimals: 6, logo: '/tokens/usdc.svg' },
    { symbol: 'ARB', name: 'Arbitrum', address: '0x912CE59144191C1204E64559FE8253a0e49E6548', decimals: 18, logo: '/tokens/arb.svg' },
  ],
  base: [
    { symbol: 'ETH', name: 'Ethereum', address: '0xEeeeeEeeeEeEeeEeEeEeeEEEeeeeEeeeeeeeEEeE', decimals: 18, logo: '/tokens/eth.svg' },
    { symbol: 'USDC', name: 'USD Coin', address: '0x833589fCD6eDb6E08f4c7C32D4f71b54bdA02913', decimals: 6, logo: '/tokens/usdc.svg' },
  ],
};

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const chain = searchParams.get('chain') || 'ethereum';

  const tokens = TOKENS[chain] || TOKENS.ethereum;

  return NextResponse.json(tokens);
}
