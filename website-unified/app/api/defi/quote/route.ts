import { NextRequest, NextResponse } from 'next/server';

/**
 * Get swap quote from 1inch or similar DEX aggregator
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { fromToken, toToken, amount, chain = 'ethereum' } = body;

    if (!fromToken || !toToken || !amount) {
      return NextResponse.json(
        { error: 'Missing required fields: fromToken, toToken, amount' },
        { status: 400 }
      );
    }

    // Chain ID mapping
    const chainIds: Record<string, number> = {
      ethereum: 1,
      arbitrum: 42161,
      base: 8453,
      optimism: 10,
      polygon: 137,
    };

    const chainId = chainIds[chain] || 1;
    const apiKey = process.env.ONEINCH_API_KEY;

    if (!apiKey) {
      // Return mock quote for demo
      const mockRate = 3200; // ETH/USDC example
      return NextResponse.json({
        fromToken: {
          symbol: 'ETH',
          name: 'Ethereum',
          address: fromToken,
          decimals: 18,
        },
        toToken: {
          symbol: 'USDC',
          name: 'USD Coin',
          address: toToken,
          decimals: 6,
        },
        fromAmount: amount,
        toAmount: String(parseFloat(amount) * mockRate),
        rate: mockRate,
        priceImpact: 0.05,
        fee: 0.003,
        estimatedGas: '150000',
        route: ['1inch'],
      });
    }

    // Real 1inch API call
    const quoteUrl = new URL(`https://api.1inch.dev/swap/v6.0/${chainId}/quote`);
    quoteUrl.searchParams.set('src', fromToken);
    quoteUrl.searchParams.set('dst', toToken);
    quoteUrl.searchParams.set('amount', amount);

    const response = await fetch(quoteUrl.toString(), {
      headers: { Authorization: `Bearer ${apiKey}` },
    });

    if (!response.ok) {
      const error = await response.text();
      return NextResponse.json({ error: `Quote failed: ${error}` }, { status: 502 });
    }

    const quote = await response.json();

    return NextResponse.json({
      fromToken: quote.srcToken,
      toToken: quote.dstToken,
      fromAmount: quote.fromAmount,
      toAmount: quote.toAmount,
      rate: parseFloat(quote.toAmount) / parseFloat(quote.fromAmount),
      priceImpact: quote.estimatedPriceImpact || 0,
      fee: 0.003,
      estimatedGas: quote.gas,
      route: quote.protocols || ['1inch'],
    });
  } catch (error) {
    console.error('Quote error:', error);
    return NextResponse.json(
      { error: 'Failed to get quote' },
      { status: 500 }
    );
  }
}
