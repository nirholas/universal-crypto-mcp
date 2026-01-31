/**
 * Analytics API Utilities
 * 
 * API client for fetching portfolio, market, and DeFi data
 */

import type {
  Portfolio,
  HistoricalData,
  Timeframe,
  AllocationData,
  PnLSummary,
  MarketOverview,
  TokenData,
  TokenDetails,
  TrendingToken,
  DeFiPosition,
  DeFiSummary,
  YieldOpportunity,
  ProtocolData,
  Transaction,
  TransactionSummary,
  TaxReport,
  Alert,
  Notification,
  CostBasisMethod,
  ScreenerFilter,
} from './types';

const API_BASE = process.env.NEXT_PUBLIC_API_URL || '/api';

// ============================================================================
// Portfolio API
// ============================================================================

export async function fetchPortfolio(walletAddresses: string[]): Promise<Portfolio> {
  const response = await fetch(`${API_BASE}/portfolio`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ wallets: walletAddresses }),
  });
  return response.json();
}

export async function fetchPortfolioHistory(
  walletAddresses: string[],
  timeframe: Timeframe
): Promise<HistoricalData> {
  const response = await fetch(
    `${API_BASE}/portfolio/history?timeframe=${timeframe}`,
    {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ wallets: walletAddresses }),
    }
  );
  return response.json();
}

export async function fetchAllocation(walletAddresses: string[]): Promise<AllocationData> {
  const response = await fetch(`${API_BASE}/portfolio/allocation`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ wallets: walletAddresses }),
  });
  return response.json();
}

export async function fetchPnL(
  walletAddresses: string[],
  method: CostBasisMethod
): Promise<PnLSummary> {
  const response = await fetch(`${API_BASE}/portfolio/pnl?method=${method}`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ wallets: walletAddresses }),
  });
  return response.json();
}

// ============================================================================
// Market Data API
// ============================================================================

export async function fetchMarketOverview(): Promise<MarketOverview> {
  const response = await fetch(`${API_BASE}/market/overview`);
  return response.json();
}

export async function fetchTopTokens(
  limit: number = 100,
  page: number = 1
): Promise<{ tokens: TokenData[]; total: number }> {
  const response = await fetch(
    `${API_BASE}/market/tokens?limit=${limit}&page=${page}`
  );
  return response.json();
}

export async function fetchTokenDetails(id: string): Promise<TokenDetails> {
  const response = await fetch(`${API_BASE}/market/token/${id}`);
  return response.json();
}

export async function fetchTokenPrice(
  id: string,
  timeframe: Timeframe
): Promise<HistoricalData> {
  const response = await fetch(
    `${API_BASE}/market/token/${id}/price?timeframe=${timeframe}`
  );
  return response.json();
}

export async function fetchTrendingTokens(): Promise<TrendingToken[]> {
  const response = await fetch(`${API_BASE}/market/trending`);
  return response.json();
}

export async function searchTokens(query: string): Promise<TokenData[]> {
  const response = await fetch(
    `${API_BASE}/market/search?q=${encodeURIComponent(query)}`
  );
  return response.json();
}

export async function screenTokens(
  filters: ScreenerFilter[]
): Promise<TokenData[]> {
  const response = await fetch(`${API_BASE}/market/screen`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ filters }),
  });
  return response.json();
}

// ============================================================================
// DeFi API
// ============================================================================

export async function fetchDeFiPositions(
  walletAddresses: string[]
): Promise<DeFiPosition[]> {
  const response = await fetch(`${API_BASE}/defi/positions`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ wallets: walletAddresses }),
  });
  return response.json();
}

export async function fetchDeFiSummary(
  walletAddresses: string[]
): Promise<DeFiSummary> {
  const response = await fetch(`${API_BASE}/defi/summary`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ wallets: walletAddresses }),
  });
  return response.json();
}

export async function fetchYieldOpportunities(): Promise<YieldOpportunity[]> {
  const response = await fetch(`${API_BASE}/defi/yields`);
  return response.json();
}

export async function fetchProtocols(
  category?: string
): Promise<ProtocolData[]> {
  const url = category
    ? `${API_BASE}/defi/protocols?category=${category}`
    : `${API_BASE}/defi/protocols`;
  const response = await fetch(url);
  return response.json();
}

export async function fetchProtocolDetails(id: string): Promise<ProtocolData> {
  const response = await fetch(`${API_BASE}/defi/protocol/${id}`);
  return response.json();
}

// ============================================================================
// Transaction API
// ============================================================================

export async function fetchTransactions(
  walletAddresses: string[],
  options?: {
    limit?: number;
    offset?: number;
    chain?: string;
    type?: string;
  }
): Promise<{ transactions: Transaction[]; total: number }> {
  const params = new URLSearchParams();
  if (options?.limit) params.set('limit', options.limit.toString());
  if (options?.offset) params.set('offset', options.offset.toString());
  if (options?.chain) params.set('chain', options.chain);
  if (options?.type) params.set('type', options.type);

  const response = await fetch(`${API_BASE}/transactions?${params}`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ wallets: walletAddresses }),
  });
  return response.json();
}

export async function fetchTransactionSummary(
  walletAddresses: string[]
): Promise<TransactionSummary> {
  const response = await fetch(`${API_BASE}/transactions/summary`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ wallets: walletAddresses }),
  });
  return response.json();
}

// ============================================================================
// Tax API
// ============================================================================

export async function generateTaxReport(
  walletAddresses: string[],
  year: number,
  jurisdiction: string,
  method: CostBasisMethod
): Promise<TaxReport> {
  const response = await fetch(`${API_BASE}/tax/report`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      wallets: walletAddresses,
      year,
      jurisdiction,
      method,
    }),
  });
  return response.json();
}

export async function exportTaxReport(
  report: TaxReport,
  format: 'csv' | 'pdf' | 'turbotax' | 'form8949'
): Promise<Blob> {
  const response = await fetch(`${API_BASE}/tax/export`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ report, format }),
  });
  return response.blob();
}

// ============================================================================
// Alerts API
// ============================================================================

export async function fetchAlerts(): Promise<Alert[]> {
  const response = await fetch(`${API_BASE}/alerts`);
  return response.json();
}

export async function createAlert(alert: Omit<Alert, 'id' | 'createdAt' | 'triggerCount'>): Promise<Alert> {
  const response = await fetch(`${API_BASE}/alerts`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(alert),
  });
  return response.json();
}

export async function updateAlert(id: string, updates: Partial<Alert>): Promise<Alert> {
  const response = await fetch(`${API_BASE}/alerts/${id}`, {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(updates),
  });
  return response.json();
}

export async function deleteAlert(id: string): Promise<void> {
  await fetch(`${API_BASE}/alerts/${id}`, { method: 'DELETE' });
}

export async function fetchNotifications(
  unreadOnly?: boolean
): Promise<Notification[]> {
  const url = unreadOnly
    ? `${API_BASE}/notifications?unread=true`
    : `${API_BASE}/notifications`;
  const response = await fetch(url);
  return response.json();
}

export async function markNotificationRead(id: string): Promise<void> {
  await fetch(`${API_BASE}/notifications/${id}/read`, { method: 'POST' });
}

export async function markAllNotificationsRead(): Promise<void> {
  await fetch(`${API_BASE}/notifications/read-all`, { method: 'POST' });
}

// ============================================================================
// Watchlist API
// ============================================================================

export async function fetchWatchlists(): Promise<import('./types').Watchlist[]> {
  const response = await fetch(`${API_BASE}/watchlists`);
  return response.json();
}

export async function createWatchlist(
  name: string,
  tokens: string[]
): Promise<import('./types').Watchlist> {
  const response = await fetch(`${API_BASE}/watchlists`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ name, tokens }),
  });
  return response.json();
}

export async function updateWatchlist(
  id: string,
  updates: { name?: string; tokens?: string[] }
): Promise<import('./types').Watchlist> {
  const response = await fetch(`${API_BASE}/watchlists/${id}`, {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(updates),
  });
  return response.json();
}

export async function deleteWatchlist(id: string): Promise<void> {
  await fetch(`${API_BASE}/watchlists/${id}`, { method: 'DELETE' });
}
