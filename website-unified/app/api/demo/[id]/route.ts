import { NextRequest, NextResponse } from 'next/server'

export const runtime = 'edge'

interface RouteContext {
  params: {
    id: string
  }
}

// Mock data generators for demos
async function getPortfolioDemo() {
  const address = "0x742d35Cc6634C0532925a3b844Bc9e7595f0bEb"
  const chains = ["ethereum", "base", "arbitrum", "polygon"]
  
  const portfolio = await Promise.all(
    chains.map(async (chain) => {
      const balance = (Math.random() * 10).toFixed(4)
      const ethPrice = 2500 + Math.random() * 100
      const value = parseFloat(balance) * ethPrice
      
      return {
        chain,
        balance: `${balance} ETH`,
        usdValue: `$${value.toFixed(2)}`,
      }
    })
  )
  
  const totalValue = portfolio.reduce(
    (sum, item) => sum + parseFloat(item.usdValue.slice(1)),
    0
  )
  
  return {
    address,
    portfolio,
    totalValue: `$${totalValue.toFixed(2)}`,
  }
}

async function getSwapQuoteDemo() {
  const dexes = ['Uniswap', '1inch', 'Paraswap', 'Cowswap']
  
  const quotes = dexes.map((dex) => ({
    dex,
    amountOut: (2500 + Math.random() * 50).toFixed(2),
    gasEstimate: (Math.random() * 100000 + 50000).toFixed(0),
    priceImpact: (Math.random() * 0.5).toFixed(2) + '%',
  }))
  
  // Sort by best rate
  quotes.sort((a, b) => parseFloat(b.amountOut) - parseFloat(a.amountOut))
  
  return {
    input: '1.0 ETH',
    output: 'USDC',
    quotes,
    bestQuote: quotes[0],
  }
}

async function getNFTGalleryDemo() {
  const address = "0x742d35Cc6634C0532925a3b844Bc9e7595f0bEb"
  const chains = ["ethereum", "base", "polygon"]
  
  const nfts = chains.flatMap((chain) => {
    const count = Math.floor(Math.random() * 5)
    return Array.from({ length: count }, (_, i) => ({
      chain,
      contract: `0x${Math.random().toString(16).slice(2, 42)}`,
      tokenId: String(i + 1),
      name: `NFT #${i + 1}`,
      collection: ['CryptoPunks', 'BAYC', 'Pudgy Penguins', 'Azuki'][Math.floor(Math.random() * 4)],
      imageUrl: `https://via.placeholder.com/150?text=NFT+${i + 1}`,
    }))
  })
  
  return {
    address,
    totalNFTs: nfts.length,
    nfts: nfts.slice(0, 10), // Limit to first 10
  }
}

async function getDeFiAPYDemo() {
  const protocols = [
    { name: 'Aave', chain: 'ethereum', token: 'USDC' },
    { name: 'Compound', chain: 'ethereum', token: 'DAI' },
    { name: 'Yearn', chain: 'ethereum', token: 'USDT' },
    { name: 'Curve', chain: 'ethereum', token: '3pool' },
    { name: 'Convex', chain: 'ethereum', token: 'cvxCRV' },
    { name: 'Lido', chain: 'ethereum', token: 'stETH' },
  ]
  
  const opportunities = protocols.map((protocol) => ({
    ...protocol,
    apy: (Math.random() * 15 + 2).toFixed(2) + '%',
    tvl: `$${(Math.random() * 1000 + 100).toFixed(1)}M`,
    risk: ['Low', 'Medium', 'High'][Math.floor(Math.random() * 3)],
  }))
  
  // Sort by APY
  opportunities.sort((a, b) => 
    parseFloat(b.apy) - parseFloat(a.apy)
  )
  
  return {
    opportunities,
    bestYield: opportunities[0],
  }
}

export async function GET(
  request: NextRequest,
  context: RouteContext
) {
  try {
    const { id } = context.params
    
    let data: any
    
    switch (id) {
      case 'portfolio':
        data = await getPortfolioDemo()
        break
      case 'swap-quote':
        data = await getSwapQuoteDemo()
        break
      case 'nft-gallery':
        data = await getNFTGalleryDemo()
        break
      case 'defi-apy':
        data = await getDeFiAPYDemo()
        break
      default:
        return NextResponse.json(
          { error: 'Demo not found' },
          { status: 404 }
        )
    }
    
    return NextResponse.json({
      demoId: id,
      timestamp: new Date().toISOString(),
      data,
    })
    
  } catch (error: any) {
    console.error('Demo API error:', error)
    return NextResponse.json(
      { error: error.message || 'Demo failed' },
      { status: 500 }
    )
  }
}
