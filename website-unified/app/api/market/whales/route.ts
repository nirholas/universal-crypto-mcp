import { NextRequest, NextResponse } from 'next/server';

// Mock whale transaction data
// In production, this would connect to whale alert APIs or on-chain indexers

interface WhaleTransaction {
  id: string;
  hash: string;
  chain: string;
  from: { address: string; label?: string; isExchange?: boolean; isWhale?: boolean };
  to: { address: string; label?: string; isExchange?: boolean; isWhale?: boolean };
  token: { symbol: string; name: string; logo?: string };
  amount: string;
  amountUsd: number;
  timestamp: number;
  blockNumber: number;
  type: 'transfer' | 'swap' | 'bridge';
  significance: 'medium' | 'high' | 'extreme';
}

const EXCHANGES = [
  { address: '0x28C6c06298d514Db089934071355E5743bf21d60', label: 'Binance' },
  { address: '0x21a31Ee1afC51d94C2eFcCAa2092aD1028285549', label: 'Binance' },
  { address: '0xDFd5293D8e347dFe59E90eFd55b2956a1343963d', label: 'Binance' },
  { address: '0x503828976D22510aad0201ac7EC88293211D23Da', label: 'Coinbase' },
  { address: '0x71660c4005BA85c37ccec55d0C4493E66Fe775d3', label: 'Coinbase' },
  { address: '0x2FAF487A4414Fe77e2327F0bf4AE2a264a776AD2', label: 'FTX' },
  { address: '0xC098B2a3Aa256D2140208C3de6543aAEf5cd3A94', label: 'FTX' },
];

function generateMockTransactions(count: number): WhaleTransaction[] {
  const tokens = ['ETH', 'BTC', 'USDT', 'USDC', 'SOL', 'LINK'];
  const chains = ['ethereum', 'bitcoin', 'solana', 'arbitrum'];
  
  return Array.from({ length: count }, (_, i) => {
    const isExchangeTransfer = Math.random() > 0.6;
    const fromExchange = isExchangeTransfer && Math.random() > 0.5 ? EXCHANGES[Math.floor(Math.random() * EXCHANGES.length)] : null;
    const toExchange = isExchangeTransfer && !fromExchange ? EXCHANGES[Math.floor(Math.random() * EXCHANGES.length)] : null;
    
    const amountUsd = 100000 + Math.random() * 50000000;
    
    return {
      id: `whale-${Date.now()}-${i}`,
      hash: `0x${Math.random().toString(16).slice(2)}${Math.random().toString(16).slice(2)}`,
      chain: chains[Math.floor(Math.random() * chains.length)],
      from: {
        address: fromExchange?.address || `0x${Math.random().toString(16).slice(2, 42)}`,
        label: fromExchange?.label,
        isExchange: !!fromExchange,
        isWhale: !fromExchange && Math.random() > 0.7,
      },
      to: {
        address: toExchange?.address || `0x${Math.random().toString(16).slice(2, 42)}`,
        label: toExchange?.label,
        isExchange: !!toExchange,
        isWhale: !toExchange && Math.random() > 0.7,
      },
      token: {
        symbol: tokens[Math.floor(Math.random() * tokens.length)],
        name: tokens[Math.floor(Math.random() * tokens.length)],
      },
      amount: (Math.random() * 10000).toFixed(4),
      amountUsd,
      timestamp: Date.now() - Math.random() * 86400000,
      blockNumber: 19000000 + Math.floor(Math.random() * 100000),
      type: 'transfer',
      significance: amountUsd > 10000000 ? 'extreme' : amountUsd > 1000000 ? 'high' : 'medium',
    };
  });
}

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const chain = searchParams.get('chain');
  const token = searchParams.get('token');
  const minAmount = parseFloat(searchParams.get('minAmount') || '100000');
  const limit = parseInt(searchParams.get('limit') || '50');

  // Generate mock transactions
  let transactions = generateMockTransactions(limit * 2);

  // Filter by chain
  if (chain) {
    transactions = transactions.filter(tx => tx.chain === chain);
  }

  // Filter by token
  if (token) {
    transactions = transactions.filter(tx => 
      tx.token.symbol.toLowerCase() === token.toLowerCase()
    );
  }

  // Filter by min amount
  transactions = transactions.filter(tx => tx.amountUsd >= minAmount);

  // Sort by timestamp descending
  transactions.sort((a, b) => b.timestamp - a.timestamp);

  return NextResponse.json(transactions.slice(0, limit));
}
