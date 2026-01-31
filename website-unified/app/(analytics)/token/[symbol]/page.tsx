'use client';

/**
 * Token Research Page
 * 
 * Detailed token analysis with price charts, stats, exchanges, 
 * social metrics, and on-chain data.
 */

import React, { useState, useMemo } from 'react';
import { cn } from '@/lib/utils/cn';
import { PerformanceChart } from '@/components/analytics/PerformanceChart';
import type { TokenDetails, Timeframe, HistoricalData } from '@/lib/analytics/types';
import { formatCurrency, formatNumber, formatPercentage, formatDate } from '@/lib/analytics/hooks';

// ============================================================================
// Mock Data
// ============================================================================

const MOCK_TOKEN: TokenDetails = {
  id: 'ethereum',
  symbol: 'ETH',
  name: 'Ethereum',
  price: 3200,
  marketCap: 385000000000,
  volume24h: 15200000000,
  change1h: 0.5,
  change24h: 3.2,
  change7d: -0.8,
  change30d: 8.9,
  ath: 4878,
  athDate: '2021-11-10',
  atl: 0.43,
  atlDate: '2015-10-20',
  circulatingSupply: 120000000,
  totalSupply: 120000000,
  maxSupply: null,
  rank: 2,
  logoUrl: '/tokens/eth.svg',
  description: 'Ethereum is a decentralized, open-source blockchain with smart contract functionality. Ether (ETH) is the native cryptocurrency of the platform. Among cryptocurrencies, ether is second only to bitcoin in market capitalization.',
  website: 'https://ethereum.org',
  whitepaper: 'https://ethereum.org/whitepaper',
  twitter: 'ethereum',
  discord: 'https://discord.gg/ethereum',
  telegram: 'ethereum',
  github: 'ethereum',
  exchanges: ['Binance', 'Coinbase', 'Kraken', 'OKX', 'Bybit', 'KuCoin', 'Huobi', 'Gate.io'],
  categories: ['Smart Contract Platform', 'Layer 1', 'Proof of Stake'],
  contractAddresses: [
    { chain: 'ethereum', address: '0x0000000000000000000000000000000000000000' },
    { chain: 'polygon', address: '0x7ceB23fD6bC0adD59E62ac25578270cFf1b9f619' },
    { chain: 'arbitrum', address: '0x82aF49447D8a07e3bd95BD0d56f35241523fBab1' },
  ],
  onChainMetrics: {
    holders: 98500000,
    transactions24h: 1250000,
    activeAddresses24h: 485000,
  },
};

function generateMockPriceData(timeframe: Timeframe): HistoricalData {
  const now = Date.now();
  let points: number;
  let interval: number;

  switch (timeframe) {
    case '1D': points = 24; interval = 60 * 60 * 1000; break;
    case '1W': points = 7 * 24; interval = 60 * 60 * 1000; break;
    case '1M': points = 30; interval = 24 * 60 * 60 * 1000; break;
    case '3M': points = 90; interval = 24 * 60 * 60 * 1000; break;
    case '1Y': points = 365; interval = 24 * 60 * 60 * 1000; break;
    case 'ALL': points = 730; interval = 24 * 60 * 60 * 1000; break;
  }

  const baseValue = 2800;
  const timestamps: string[] = [];
  const values: number[] = [];

  for (let i = 0; i < points; i++) {
    timestamps.push(new Date(now - (points - i) * interval).toISOString());
    const progress = i / points;
    const trend = 400 * progress;
    const noise = (Math.random() - 0.5) * 100;
    const cycle = Math.sin(progress * Math.PI * 4) * 80;
    values.push(baseValue + trend + noise + cycle);
  }

  return { timestamps, values };
}

// ============================================================================
// Price Header Component
// ============================================================================

interface PriceHeaderProps {
  token: TokenDetails;
}

function PriceHeader({ token }: PriceHeaderProps) {
  const athChange = ((token.price - token.ath) / token.ath) * 100;
  const atlChange = ((token.price - token.atl) / token.atl) * 100;

  return (
    <div className="rounded-2xl border-2 border-gray-200 bg-white p-6">
      <div className="flex flex-wrap items-start justify-between gap-6">
        {/* Left: Token Info & Price */}
        <div>
          <div className="flex items-center gap-4">
            <div className="flex h-16 w-16 items-center justify-center rounded-full bg-gradient-to-br from-blue-500 to-purple-600 text-2xl font-bold text-white">
              {token.symbol.slice(0, 2)}
            </div>
            <div>
              <div className="flex items-center gap-3">
                <h1 className="text-2xl font-bold">{token.name}</h1>
                <span className="rounded-lg bg-gray-100 px-2 py-1 text-sm font-medium text-gray-600">
                  {token.symbol}
                </span>
                <span className="rounded-lg bg-gray-100 px-2 py-1 text-sm font-medium text-gray-500">
                  Rank #{token.rank}
                </span>
              </div>
              <div className="mt-2 flex flex-wrap gap-2">
                {token.categories.map((cat) => (
                  <span
                    key={cat}
                    className="rounded-full bg-blue-100 px-2 py-0.5 text-xs font-medium text-blue-700"
                  >
                    {cat}
                  </span>
                ))}
              </div>
            </div>
          </div>

          <div className="mt-6">
            <div className="flex items-baseline gap-3">
              <span className="text-4xl font-bold">{formatCurrency(token.price)}</span>
              <span className={cn(
                'text-lg font-semibold',
                token.change24h >= 0 ? 'text-green-600' : 'text-red-600'
              )}>
                {formatPercentage(token.change24h)} (24h)
              </span>
            </div>
            
            <div className="mt-4 grid grid-cols-2 gap-4 sm:grid-cols-4">
              <div>
                <div className="text-sm text-gray-500">1h</div>
                <div className={cn(
                  'font-medium',
                  token.change1h >= 0 ? 'text-green-600' : 'text-red-600'
                )}>
                  {formatPercentage(token.change1h)}
                </div>
              </div>
              <div>
                <div className="text-sm text-gray-500">24h</div>
                <div className={cn(
                  'font-medium',
                  token.change24h >= 0 ? 'text-green-600' : 'text-red-600'
                )}>
                  {formatPercentage(token.change24h)}
                </div>
              </div>
              <div>
                <div className="text-sm text-gray-500">7d</div>
                <div className={cn(
                  'font-medium',
                  token.change7d >= 0 ? 'text-green-600' : 'text-red-600'
                )}>
                  {formatPercentage(token.change7d)}
                </div>
              </div>
              <div>
                <div className="text-sm text-gray-500">30d</div>
                <div className={cn(
                  'font-medium',
                  token.change30d >= 0 ? 'text-green-600' : 'text-red-600'
                )}>
                  {formatPercentage(token.change30d)}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Right: ATH/ATL */}
        <div className="flex gap-4">
          <div className="rounded-xl bg-green-50 p-4">
            <div className="text-sm text-green-700">All-Time High</div>
            <div className="mt-1 text-xl font-bold text-green-800">
              {formatCurrency(token.ath)}
            </div>
            <div className="mt-1 text-xs text-green-600">
              {formatDate(token.athDate)}
            </div>
            <div className="mt-1 text-sm font-medium text-red-600">
              {formatPercentage(athChange)} from ATH
            </div>
          </div>
          <div className="rounded-xl bg-red-50 p-4">
            <div className="text-sm text-red-700">All-Time Low</div>
            <div className="mt-1 text-xl font-bold text-red-800">
              {formatCurrency(token.atl)}
            </div>
            <div className="mt-1 text-xs text-red-600">
              {formatDate(token.atlDate)}
            </div>
            <div className="mt-1 text-sm font-medium text-green-600">
              {formatPercentage(atlChange)} from ATL
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// ============================================================================
// Stats Cards Component
// ============================================================================

interface StatsCardsProps {
  token: TokenDetails;
}

function StatsCards({ token }: StatsCardsProps) {
  const fullyDilutedValuation = token.maxSupply 
    ? token.price * token.maxSupply 
    : token.price * token.totalSupply;

  const volumeToMarketCap = (token.volume24h / token.marketCap) * 100;

  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
      <div className="rounded-xl border border-gray-200 bg-white p-4">
        <div className="text-sm text-gray-500">Market Cap</div>
        <div className="mt-1 text-xl font-bold">${formatNumber(token.marketCap)}</div>
        <div className="mt-1 text-xs text-gray-500">Rank #{token.rank}</div>
      </div>

      <div className="rounded-xl border border-gray-200 bg-white p-4">
        <div className="text-sm text-gray-500">24h Volume</div>
        <div className="mt-1 text-xl font-bold">${formatNumber(token.volume24h)}</div>
        <div className="mt-1 text-xs text-gray-500">
          {volumeToMarketCap.toFixed(2)}% of MCap
        </div>
      </div>

      <div className="rounded-xl border border-gray-200 bg-white p-4">
        <div className="text-sm text-gray-500">Fully Diluted Valuation</div>
        <div className="mt-1 text-xl font-bold">${formatNumber(fullyDilutedValuation)}</div>
      </div>

      <div className="rounded-xl border border-gray-200 bg-white p-4">
        <div className="text-sm text-gray-500">Circulating Supply</div>
        <div className="mt-1 text-xl font-bold">{formatNumber(token.circulatingSupply)}</div>
        {token.maxSupply && (
          <div className="mt-2">
            <div className="h-2 overflow-hidden rounded-full bg-gray-200">
              <div
                className="h-full bg-blue-500"
                style={{
                  width: `${(token.circulatingSupply / token.maxSupply) * 100}%`,
                }}
              />
            </div>
            <div className="mt-1 text-xs text-gray-500">
              {((token.circulatingSupply / token.maxSupply) * 100).toFixed(1)}% of max supply
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

// ============================================================================
// About Section Component
// ============================================================================

interface AboutSectionProps {
  token: TokenDetails;
}

function AboutSection({ token }: AboutSectionProps) {
  const [expanded, setExpanded] = useState(false);

  return (
    <div className="rounded-2xl border-2 border-gray-200 bg-white p-6">
      <h3 className="mb-4 text-lg font-semibold">About {token.name}</h3>
      
      <p className={cn(
        'text-gray-600',
        !expanded && 'line-clamp-3'
      )}>
        {token.description}
      </p>
      
      {token.description.length > 200 && (
        <button
          onClick={() => setExpanded(!expanded)}
          className="mt-2 text-sm font-medium text-blue-600 hover:underline"
        >
          {expanded ? 'Show less' : 'Read more'}
        </button>
      )}

      {/* Links */}
      <div className="mt-6 flex flex-wrap gap-3">
        {token.website && (
          <a
            href={token.website}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 rounded-lg bg-gray-100 px-3 py-2 text-sm font-medium text-gray-700 hover:bg-gray-200"
          >
            🌐 Website
          </a>
        )}
        {token.whitepaper && (
          <a
            href={token.whitepaper}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 rounded-lg bg-gray-100 px-3 py-2 text-sm font-medium text-gray-700 hover:bg-gray-200"
          >
            📄 Whitepaper
          </a>
        )}
        {token.twitter && (
          <a
            href={`https://twitter.com/${token.twitter}`}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 rounded-lg bg-gray-100 px-3 py-2 text-sm font-medium text-gray-700 hover:bg-gray-200"
          >
            𝕏 Twitter
          </a>
        )}
        {token.discord && (
          <a
            href={token.discord}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 rounded-lg bg-gray-100 px-3 py-2 text-sm font-medium text-gray-700 hover:bg-gray-200"
          >
            💬 Discord
          </a>
        )}
        {token.github && (
          <a
            href={`https://github.com/${token.github}`}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 rounded-lg bg-gray-100 px-3 py-2 text-sm font-medium text-gray-700 hover:bg-gray-200"
          >
            💻 GitHub
          </a>
        )}
      </div>

      {/* Contract Addresses */}
      {token.contractAddresses.length > 0 && (
        <div className="mt-6">
          <h4 className="mb-3 text-sm font-semibold text-gray-700">Contract Addresses</h4>
          <div className="space-y-2">
            {token.contractAddresses.map((contract) => (
              <div
                key={contract.chain}
                className="flex items-center justify-between rounded-lg bg-gray-50 p-3"
              >
                <span className="text-sm font-medium capitalize">{contract.chain}</span>
                <code className="text-xs text-gray-600">
                  {contract.address.slice(0, 10)}...{contract.address.slice(-8)}
                </code>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

// ============================================================================
// On-Chain Metrics Component
// ============================================================================

interface OnChainMetricsProps {
  metrics: TokenDetails['onChainMetrics'];
}

function OnChainMetrics({ metrics }: OnChainMetricsProps) {
  if (!metrics) return null;

  return (
    <div className="rounded-2xl border-2 border-gray-200 bg-white p-6">
      <h3 className="mb-4 text-lg font-semibold">On-Chain Metrics</h3>

      <div className="grid gap-4 sm:grid-cols-3">
        <div className="rounded-xl bg-purple-50 p-4">
          <div className="text-sm text-purple-700">Holders</div>
          <div className="mt-1 text-2xl font-bold text-purple-900">
            {formatNumber(metrics.holders)}
          </div>
        </div>

        <div className="rounded-xl bg-blue-50 p-4">
          <div className="text-sm text-blue-700">24h Transactions</div>
          <div className="mt-1 text-2xl font-bold text-blue-900">
            {formatNumber(metrics.transactions24h)}
          </div>
        </div>

        <div className="rounded-xl bg-green-50 p-4">
          <div className="text-sm text-green-700">24h Active Addresses</div>
          <div className="mt-1 text-2xl font-bold text-green-900">
            {formatNumber(metrics.activeAddresses24h)}
          </div>
        </div>
      </div>
    </div>
  );
}

// ============================================================================
// Exchanges Component
// ============================================================================

interface ExchangesProps {
  exchanges: string[];
}

function Exchanges({ exchanges }: ExchangesProps) {
  return (
    <div className="rounded-2xl border-2 border-gray-200 bg-white p-6">
      <h3 className="mb-4 text-lg font-semibold">Available on {exchanges.length} Exchanges</h3>

      <div className="flex flex-wrap gap-2">
        {exchanges.map((exchange) => (
          <span
            key={exchange}
            className="rounded-lg bg-gray-100 px-3 py-2 text-sm font-medium text-gray-700"
          >
            {exchange}
          </span>
        ))}
      </div>
    </div>
  );
}

// ============================================================================
// Main Page Component
// ============================================================================

export default function TokenPage({ params }: { params: { symbol: string } }) {
  const [timeframe, setTimeframe] = useState<Timeframe>('1M');

  const priceData = useMemo(() => {
    return generateMockPriceData(timeframe);
  }, [timeframe]);

  // In a real app, fetch token data based on params.symbol
  const token = MOCK_TOKEN;

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
      {/* Breadcrumb */}
      <nav className="mb-6 text-sm text-gray-500">
        <a href="/analytics/market" className="hover:text-black">Market</a>
        <span className="mx-2">›</span>
        <span className="text-black">{token.name}</span>
      </nav>

      {/* Price Header */}
      <div className="mb-6">
        <PriceHeader token={token} />
      </div>

      {/* Stats Cards */}
      <div className="mb-6">
        <StatsCards token={token} />
      </div>

      {/* Price Chart */}
      <div className="mb-8">
        <PerformanceChart
          data={priceData}
          timeframe={timeframe}
          onTimeframeChange={setTimeframe}
        />
      </div>

      {/* Two Column Layout */}
      <div className="grid gap-8 lg:grid-cols-3">
        <div className="lg:col-span-2 space-y-8">
          {/* About */}
          <AboutSection token={token} />

          {/* On-Chain Metrics */}
          <OnChainMetrics metrics={token.onChainMetrics} />
        </div>

        <div className="space-y-8">
          {/* Exchanges */}
          <Exchanges exchanges={token.exchanges} />
        </div>
      </div>
    </div>
  );
}
