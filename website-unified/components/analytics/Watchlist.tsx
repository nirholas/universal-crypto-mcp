'use client';

/**
 * Watchlist Component
 * 
 * Create and manage multiple watchlists with drag-and-drop reordering,
 * price alerts, custom columns, and sharing capabilities.
 */

import React, { useState, useMemo, useCallback } from 'react';
import { cn } from '@/lib/utils/cn';
import type { Watchlist as WatchlistType, TokenData, WatchlistColumn, PriceAlert } from '@/lib/analytics/types';
import { formatCurrency, formatNumber, formatPercentage } from '@/lib/analytics/hooks';

// ============================================================================
// Types
// ============================================================================

interface WatchlistProps {
  watchlists: WatchlistType[];
  tokens: Map<string, TokenData>;
  onCreateWatchlist?: (name: string) => void;
  onDeleteWatchlist?: (id: string) => void;
  onAddToken?: (watchlistId: string, tokenId: string) => void;
  onRemoveToken?: (watchlistId: string, tokenId: string) => void;
  onReorderTokens?: (watchlistId: string, tokenIds: string[]) => void;
  onCreateAlert?: (alert: Omit<PriceAlert, 'id' | 'createdAt' | 'triggered'>) => void;
  className?: string;
}

// ============================================================================
// Default Columns
// ============================================================================

const DEFAULT_COLUMNS: WatchlistColumn[] = [
  { id: 'name', label: 'Name', accessor: 'name', sortable: true, visible: true },
  { id: 'price', label: 'Price', accessor: 'price', sortable: true, visible: true },
  { id: 'change24h', label: '24h %', accessor: 'change24h', sortable: true, visible: true },
  { id: 'change7d', label: '7d %', accessor: 'change7d', sortable: true, visible: true },
  { id: 'marketCap', label: 'Market Cap', accessor: 'marketCap', sortable: true, visible: true },
  { id: 'volume24h', label: 'Volume', accessor: 'volume24h', sortable: true, visible: true },
];

// ============================================================================
// Add Token Modal Component
// ============================================================================

interface AddTokenModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAdd: (tokenId: string) => void;
  existingTokens: string[];
}

function AddTokenModal({ isOpen, onClose, onAdd, existingTokens }: AddTokenModalProps) {
  const [search, setSearch] = useState('');

  // Mock search results - replace with actual API call
  const searchResults: TokenData[] = useMemo(() => {
    if (search.length < 2) return [];
    const mockTokens: TokenData[] = [
      { id: 'bitcoin', symbol: 'BTC', name: 'Bitcoin', price: 62500, marketCap: 1220000000000, volume24h: 28500000000, change1h: 0.2, change24h: 1.8, change7d: 5.2, change30d: 12.5, ath: 69000, athDate: '2021-11-10', atl: 67.81, atlDate: '2013-07-06', circulatingSupply: 19500000, totalSupply: 19500000, maxSupply: 21000000, rank: 1, logoUrl: '/tokens/btc.svg' },
      { id: 'ethereum', symbol: 'ETH', name: 'Ethereum', price: 3200, marketCap: 385000000000, volume24h: 15200000000, change1h: 0.5, change24h: 3.2, change7d: -0.8, change30d: 8.9, ath: 4878, athDate: '2021-11-10', atl: 0.43, atlDate: '2015-10-20', circulatingSupply: 120000000, totalSupply: 120000000, maxSupply: null, rank: 2, logoUrl: '/tokens/eth.svg' },
      { id: 'solana', symbol: 'SOL', name: 'Solana', price: 120, marketCap: 52000000000, volume24h: 2800000000, change1h: 1.2, change24h: 5.4, change7d: -3.2, change30d: 25.1, ath: 260, athDate: '2021-11-06', atl: 0.5, atlDate: '2020-05-11', circulatingSupply: 433000000, totalSupply: 571000000, maxSupply: null, rank: 4, logoUrl: '/tokens/sol.svg' },
    ];
    return mockTokens
      .filter(t => 
        !existingTokens.includes(t.id) &&
        (t.name.toLowerCase().includes(search.toLowerCase()) ||
         t.symbol.toLowerCase().includes(search.toLowerCase()))
      );
  }, [search, existingTokens]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
      <div className="w-full max-w-md rounded-2xl bg-white p-6 shadow-xl">
        <div className="mb-4 flex items-center justify-between">
          <h3 className="text-lg font-semibold">Add Token</h3>
          <button
            onClick={onClose}
            className="rounded-lg p-2 hover:bg-gray-100"
          >
            ✕
          </button>
        </div>

        <input
          type="text"
          placeholder="Search tokens..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="mb-4 w-full rounded-xl border-2 border-gray-200 px-4 py-3 focus:border-black focus:outline-none"
          autoFocus
        />

        <div className="max-h-64 space-y-2 overflow-y-auto">
          {searchResults.map((token) => (
            <button
              key={token.id}
              onClick={() => {
                onAdd(token.id);
                onClose();
              }}
              className="flex w-full items-center justify-between rounded-xl p-3 hover:bg-gray-50"
            >
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-gray-100 text-sm font-bold">
                  {token.symbol.slice(0, 2)}
                </div>
                <div className="text-left">
                  <div className="font-medium">{token.name}</div>
                  <div className="text-sm text-gray-500">{token.symbol}</div>
                </div>
              </div>
              <div className="text-right">
                <div className="font-medium">{formatCurrency(token.price)}</div>
                <div className={cn(
                  'text-sm',
                  token.change24h >= 0 ? 'text-green-600' : 'text-red-600'
                )}>
                  {formatPercentage(token.change24h)}
                </div>
              </div>
            </button>
          ))}
          {search.length >= 2 && searchResults.length === 0 && (
            <div className="py-8 text-center text-gray-500">
              No tokens found
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

// ============================================================================
// Create Alert Modal Component
// ============================================================================

interface CreateAlertModalProps {
  isOpen: boolean;
  onClose: () => void;
  token: TokenData | null;
  onCreateAlert: (alert: Omit<PriceAlert, 'id' | 'createdAt' | 'triggered'>) => void;
}

function CreateAlertModal({ isOpen, onClose, token, onCreateAlert }: CreateAlertModalProps) {
  const [type, setType] = useState<'above' | 'below' | 'change_percent'>('above');
  const [threshold, setThreshold] = useState('');

  if (!isOpen || !token) return null;

  const handleCreate = () => {
    onCreateAlert({
      tokenId: token.id,
      tokenSymbol: token.symbol,
      type,
      threshold: parseFloat(threshold),
      enabled: true,
    });
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
      <div className="w-full max-w-md rounded-2xl bg-white p-6 shadow-xl">
        <div className="mb-4 flex items-center justify-between">
          <h3 className="text-lg font-semibold">Create Alert for {token.symbol}</h3>
          <button onClick={onClose} className="rounded-lg p-2 hover:bg-gray-100">
            ✕
          </button>
        </div>

        <div className="mb-4 rounded-xl bg-gray-50 p-4">
          <div className="text-sm text-gray-500">Current Price</div>
          <div className="text-2xl font-bold">{formatCurrency(token.price)}</div>
        </div>

        <div className="mb-4">
          <label className="mb-2 block text-sm font-medium">Alert Type</label>
          <select
            value={type}
            onChange={(e) => setType(e.target.value as typeof type)}
            className="w-full rounded-xl border-2 border-gray-200 px-4 py-3 focus:border-black focus:outline-none"
          >
            <option value="above">Price Above</option>
            <option value="below">Price Below</option>
            <option value="change_percent">% Change</option>
          </select>
        </div>

        <div className="mb-6">
          <label className="mb-2 block text-sm font-medium">
            {type === 'change_percent' ? 'Percentage' : 'Price'}
          </label>
          <div className="relative">
            <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500">
              {type === 'change_percent' ? '%' : '$'}
            </span>
            <input
              type="number"
              value={threshold}
              onChange={(e) => setThreshold(e.target.value)}
              placeholder={type === 'change_percent' ? '10' : token.price.toString()}
              className="w-full rounded-xl border-2 border-gray-200 px-4 py-3 pl-8 focus:border-black focus:outline-none"
            />
          </div>
        </div>

        <div className="flex gap-3">
          <button
            onClick={onClose}
            className="flex-1 rounded-xl border-2 border-gray-200 py-3 font-medium hover:bg-gray-50"
          >
            Cancel
          </button>
          <button
            onClick={handleCreate}
            disabled={!threshold}
            className="flex-1 rounded-xl bg-black py-3 font-medium text-white hover:bg-gray-900 disabled:opacity-50"
          >
            Create Alert
          </button>
        </div>
      </div>
    </div>
  );
}

// ============================================================================
// Watchlist Table Component
// ============================================================================

interface WatchlistTableProps {
  tokens: TokenData[];
  columns: WatchlistColumn[];
  onRemoveToken: (tokenId: string) => void;
  onCreateAlert: (token: TokenData) => void;
  onReorder: (tokenIds: string[]) => void;
}

function WatchlistTable({ 
  tokens, 
  columns, 
  onRemoveToken, 
  onCreateAlert,
}: WatchlistTableProps) {
  const [sortField, setSortField] = useState<string>('');
  const [sortDir, setSortDir] = useState<'asc' | 'desc'>('asc');

  const sortedTokens = useMemo(() => {
    if (!sortField) return tokens;
    
    return [...tokens].sort((a, b) => {
      const col = columns.find(c => c.id === sortField);
      if (!col) return 0;
      
      const aVal = a[col.accessor];
      const bVal = b[col.accessor];
      
      if (typeof aVal === 'number' && typeof bVal === 'number') {
        return sortDir === 'asc' ? aVal - bVal : bVal - aVal;
      }
      if (typeof aVal === 'string' && typeof bVal === 'string') {
        return sortDir === 'asc' 
          ? aVal.localeCompare(bVal) 
          : bVal.localeCompare(aVal);
      }
      return 0;
    });
  }, [tokens, sortField, sortDir, columns]);

  const handleSort = (field: string) => {
    if (sortField === field) {
      setSortDir(sortDir === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortDir('desc');
    }
  };

  const visibleColumns = columns.filter(c => c.visible);

  return (
    <div className="overflow-x-auto">
      <table className="w-full">
        <thead className="bg-gray-50">
          <tr>
            <th className="w-10 px-4 py-3" />
            {visibleColumns.map((col) => (
              <th
                key={col.id}
                className={cn(
                  'px-4 py-3 text-left text-sm font-semibold text-gray-700',
                  col.sortable && 'cursor-pointer hover:bg-gray-100'
                )}
                onClick={() => col.sortable && handleSort(col.id)}
              >
                <div className="flex items-center gap-1">
                  {col.label}
                  {sortField === col.id && (
                    <span className="text-xs">{sortDir === 'asc' ? '↑' : '↓'}</span>
                  )}
                </div>
              </th>
            ))}
            <th className="w-20 px-4 py-3" />
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-100">
          {sortedTokens.map((token, index) => (
            <tr key={token.id} className="group hover:bg-gray-50">
              <td className="px-4 py-4 text-sm text-gray-400">
                {index + 1}
              </td>
              {visibleColumns.map((col) => (
                <td key={col.id} className="px-4 py-4">
                  {col.accessor === 'name' && (
                    <a
                      href={`/analytics/token/${token.symbol.toLowerCase()}`}
                      className="flex items-center gap-3 hover:underline"
                    >
                      <div className="flex h-8 w-8 items-center justify-center rounded-full bg-gray-100 text-xs font-bold">
                        {token.symbol.slice(0, 2)}
                      </div>
                      <div>
                        <div className="font-semibold">{token.name}</div>
                        <div className="text-xs text-gray-500">{token.symbol}</div>
                      </div>
                    </a>
                  )}
                  {col.accessor === 'price' && (
                    <span className="font-medium">{formatCurrency(token.price)}</span>
                  )}
                  {(col.accessor === 'change24h' || col.accessor === 'change7d' || col.accessor === 'change1h' || col.accessor === 'change30d') && (
                    <span className={cn(
                      'font-medium',
                      (token[col.accessor] as number) >= 0 ? 'text-green-600' : 'text-red-600'
                    )}>
                      {formatPercentage(token[col.accessor] as number)}
                    </span>
                  )}
                  {(col.accessor === 'marketCap' || col.accessor === 'volume24h') && (
                    <span className="text-gray-600">${formatNumber(token[col.accessor] as number)}</span>
                  )}
                </td>
              ))}
              <td className="px-4 py-4">
                <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100">
                  <button
                    onClick={() => onCreateAlert(token)}
                    className="rounded-lg p-2 text-gray-400 hover:bg-gray-100 hover:text-gray-600"
                    title="Create Alert"
                  >
                    🔔
                  </button>
                  <button
                    onClick={() => onRemoveToken(token.id)}
                    className="rounded-lg p-2 text-gray-400 hover:bg-red-50 hover:text-red-600"
                    title="Remove"
                  >
                    ✕
                  </button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {tokens.length === 0 && (
        <div className="py-12 text-center text-gray-500">
          No tokens in this watchlist. Click "Add Token" to get started.
        </div>
      )}
    </div>
  );
}

// ============================================================================
// Main Component
// ============================================================================

export function Watchlist({
  watchlists,
  tokens,
  onCreateWatchlist,
  onDeleteWatchlist,
  onAddToken,
  onRemoveToken,
  onReorderTokens,
  onCreateAlert,
  className,
}: WatchlistProps) {
  const [activeWatchlistId, setActiveWatchlistId] = useState(watchlists[0]?.id || '');
  const [showAddTokenModal, setShowAddTokenModal] = useState(false);
  const [showCreateWatchlistModal, setShowCreateWatchlistModal] = useState(false);
  const [alertToken, setAlertToken] = useState<TokenData | null>(null);
  const [newWatchlistName, setNewWatchlistName] = useState('');
  const [columns] = useState<WatchlistColumn[]>(DEFAULT_COLUMNS);

  const activeWatchlist = watchlists.find(w => w.id === activeWatchlistId);

  const watchlistTokens = useMemo(() => {
    if (!activeWatchlist) return [];
    return activeWatchlist.tokens
      .map(id => tokens.get(id))
      .filter((t): t is TokenData => t !== undefined);
  }, [activeWatchlist, tokens]);

  const handleCreateWatchlist = () => {
    if (newWatchlistName.trim()) {
      onCreateWatchlist?.(newWatchlistName.trim());
      setNewWatchlistName('');
      setShowCreateWatchlistModal(false);
    }
  };

  return (
    <div className={cn('rounded-2xl border-2 border-gray-200 bg-white', className)}>
      {/* Header */}
      <div className="border-b border-gray-200 p-4">
        <div className="flex flex-wrap items-center justify-between gap-4">
          {/* Watchlist Tabs */}
          <div className="flex items-center gap-2 overflow-x-auto">
            {watchlists.map((w) => (
              <button
                key={w.id}
                onClick={() => setActiveWatchlistId(w.id)}
                className={cn(
                  'whitespace-nowrap rounded-lg px-4 py-2 text-sm font-medium transition-all',
                  activeWatchlistId === w.id
                    ? 'bg-black text-white'
                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                )}
              >
                {w.name}
                <span className="ml-2 text-xs opacity-70">({w.tokens.length})</span>
              </button>
            ))}
            <button
              onClick={() => setShowCreateWatchlistModal(true)}
              className="rounded-lg bg-gray-100 px-3 py-2 text-sm font-medium text-gray-600 hover:bg-gray-200"
            >
              + New
            </button>
          </div>

          {/* Actions */}
          <div className="flex items-center gap-2">
            <button
              onClick={() => setShowAddTokenModal(true)}
              className="rounded-lg bg-black px-4 py-2 text-sm font-medium text-white hover:bg-gray-900"
            >
              + Add Token
            </button>
            {activeWatchlist && (
              <button
                onClick={() => onDeleteWatchlist?.(activeWatchlist.id)}
                className="rounded-lg px-3 py-2 text-sm text-red-600 hover:bg-red-50"
              >
                Delete List
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Table */}
      {activeWatchlist && (
        <WatchlistTable
          tokens={watchlistTokens}
          columns={columns}
          onRemoveToken={(tokenId) => onRemoveToken?.(activeWatchlist.id, tokenId)}
          onCreateAlert={(token) => setAlertToken(token)}
          onReorder={(tokenIds) => onReorderTokens?.(activeWatchlist.id, tokenIds)}
        />
      )}

      {/* Add Token Modal */}
      <AddTokenModal
        isOpen={showAddTokenModal}
        onClose={() => setShowAddTokenModal(false)}
        onAdd={(tokenId) => activeWatchlist && onAddToken?.(activeWatchlist.id, tokenId)}
        existingTokens={activeWatchlist?.tokens || []}
      />

      {/* Create Alert Modal */}
      <CreateAlertModal
        isOpen={alertToken !== null}
        onClose={() => setAlertToken(null)}
        token={alertToken}
        onCreateAlert={(alert) => onCreateAlert?.(alert)}
      />

      {/* Create Watchlist Modal */}
      {showCreateWatchlistModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
          <div className="w-full max-w-md rounded-2xl bg-white p-6 shadow-xl">
            <h3 className="mb-4 text-lg font-semibold">Create Watchlist</h3>
            <input
              type="text"
              placeholder="Watchlist name..."
              value={newWatchlistName}
              onChange={(e) => setNewWatchlistName(e.target.value)}
              className="mb-4 w-full rounded-xl border-2 border-gray-200 px-4 py-3 focus:border-black focus:outline-none"
              autoFocus
            />
            <div className="flex gap-3">
              <button
                onClick={() => setShowCreateWatchlistModal(false)}
                className="flex-1 rounded-xl border-2 border-gray-200 py-3 font-medium hover:bg-gray-50"
              >
                Cancel
              </button>
              <button
                onClick={handleCreateWatchlist}
                disabled={!newWatchlistName.trim()}
                className="flex-1 rounded-xl bg-black py-3 font-medium text-white hover:bg-gray-900 disabled:opacity-50"
              >
                Create
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default Watchlist;
