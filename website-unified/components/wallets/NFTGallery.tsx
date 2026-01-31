/**
 * NFT Gallery Component
 * 
 * Grid view of owned NFTs with collection grouping and metadata
 * 
 * @author Nich (@nichxbt)
 * @license Apache-2.0
 */

'use client';

import React, { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Search,
  Grid3X3,
  Grid2X2,
  List,
  Filter,
  ExternalLink,
  Send,
  Tag,
  Sparkles,
  Image as ImageIcon,
  ChevronDown,
  X,
} from 'lucide-react';
import { useWallet } from '@/providers/WalletProvider';
import { useNFTs } from '@/lib/wallets/hooks';
import { NFT } from '@/lib/wallets/types';
import { formatUsd, truncateAddress } from '@/lib/wallets/utils';
import { cn } from '@/lib/utils';

// ============================================
// Types
// ============================================

type ViewMode = 'grid-large' | 'grid-small' | 'list';
type GroupBy = 'none' | 'collection';

interface NFTGalleryProps {
  className?: string;
}

// ============================================
// NFT Card Component
// ============================================

interface NFTCardProps {
  nft: NFT;
  viewMode: ViewMode;
  onSelect: (nft: NFT) => void;
}

function NFTCard({ nft, viewMode, onSelect }: NFTCardProps) {
  const [imageLoaded, setImageLoaded] = useState(false);
  const [imageError, setImageError] = useState(false);

  const isListView = viewMode === 'list';

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.95 }}
      whileHover={{ scale: 1.02 }}
      onClick={() => onSelect(nft)}
      className={cn(
        'group cursor-pointer bg-white dark:bg-gray-800 rounded-xl overflow-hidden',
        'border border-gray-200 dark:border-gray-700 hover:border-blue-500 dark:hover:border-blue-500',
        'transition-all shadow-sm hover:shadow-lg',
        isListView && 'flex items-center gap-4 p-3'
      )}
    >
      {/* Image */}
      <div
        className={cn(
          'relative bg-gray-100 dark:bg-gray-700 overflow-hidden',
          isListView ? 'w-16 h-16 rounded-lg flex-shrink-0' : 'aspect-square'
        )}
      >
        {!imageLoaded && !imageError && (
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="w-8 h-8 border-2 border-gray-300 border-t-blue-500 rounded-full animate-spin" />
          </div>
        )}
        {imageError ? (
          <div className="absolute inset-0 flex items-center justify-center bg-gray-200 dark:bg-gray-700">
            <ImageIcon className="w-8 h-8 text-gray-400" />
          </div>
        ) : (
          <img
            src={nft.thumbnailUrl || nft.imageUrl}
            alt={nft.name}
            className={cn(
              'w-full h-full object-cover transition-all',
              imageLoaded ? 'opacity-100' : 'opacity-0',
              'group-hover:scale-110'
            )}
            onLoad={() => setImageLoaded(true)}
            onError={() => setImageError(true)}
          />
        )}

        {/* Rarity Badge */}
        {nft.rarity && !isListView && (
          <div className="absolute top-2 left-2 px-2 py-1 bg-black/60 backdrop-blur-sm rounded-lg">
            <div className="flex items-center gap-1 text-xs text-white">
              <Sparkles className="w-3 h-3 text-yellow-400" />
              #{nft.rarity.rank}
            </div>
          </div>
        )}

        {/* Quick Actions (on hover) */}
        {!isListView && (
          <div className="absolute inset-0 bg-black/0 group-hover:bg-black/40 transition-all flex items-center justify-center opacity-0 group-hover:opacity-100">
            <div className="flex gap-2">
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  // Handle send
                }}
                className="p-2 bg-white rounded-lg hover:bg-gray-100 transition-colors"
                title="Send"
              >
                <Send className="w-4 h-4 text-gray-900" />
              </button>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  window.open(nft.externalUrl, '_blank');
                }}
                className="p-2 bg-white rounded-lg hover:bg-gray-100 transition-colors"
                title="View on marketplace"
              >
                <ExternalLink className="w-4 h-4 text-gray-900" />
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Info */}
      <div className={cn('p-3', isListView && 'flex-1 min-w-0 p-0')}>
        <div className="flex items-start justify-between gap-2">
          <div className="min-w-0">
            <h3 className="font-medium text-gray-900 dark:text-white truncate">
              {nft.name || `#${nft.tokenId}`}
            </h3>
            <p className="text-sm text-gray-500 dark:text-gray-400 truncate">
              {nft.collection?.name || 'Unknown Collection'}
            </p>
          </div>
          {isListView && nft.rarity && (
            <div className="flex items-center gap-1 text-xs text-yellow-600 dark:text-yellow-400 bg-yellow-100 dark:bg-yellow-900/30 px-2 py-1 rounded">
              <Sparkles className="w-3 h-3" />
              #{nft.rarity.rank}
            </div>
          )}
        </div>

        {/* Floor Price */}
        {nft.collection?.floorPrice && !isListView && (
          <div className="mt-2 pt-2 border-t border-gray-100 dark:border-gray-700">
            <div className="flex items-center justify-between text-sm">
              <span className="text-gray-500">Floor</span>
              <span className="font-medium text-gray-900 dark:text-white">
                {nft.collection?.floorPrice} {nft.collection?.floorPriceCurrency || 'ETH'}
              </span>
            </div>
          </div>
        )}

        {/* List view extras */}
        {isListView && (
          <div className="flex items-center gap-4 mt-1">
            {nft.collection?.floorPrice && (
              <span className="text-sm text-gray-500">
                Floor: {nft.collection?.floorPrice} {nft.collection?.floorPriceCurrency || 'ETH'}
              </span>
            )}
            {nft.traits && nft.traits.length > 0 && (
              <span className="text-sm text-gray-500">
                {nft.traits.length} traits
              </span>
            )}
          </div>
        )}
      </div>
    </motion.div>
  );
}

// ============================================
// NFT Detail Modal
// ============================================

interface NFTDetailModalProps {
  nft: NFT | null;
  onClose: () => void;
}

function NFTDetailModal({ nft, onClose }: NFTDetailModalProps) {
  if (!nft) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="absolute inset-0 bg-black/50 backdrop-blur-sm"
        />
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.95 }}
          className="relative z-10 w-full max-w-4xl mx-4 bg-white dark:bg-gray-900 rounded-2xl overflow-hidden max-h-[90vh] flex"
        >
          {/* Image */}
          <div className="w-1/2 bg-gray-100 dark:bg-gray-800">
            <img
              src={nft.imageUrl || nft.thumbnailUrl}
              alt={nft.name}
              className="w-full h-full object-contain"
            />
          </div>

          {/* Info */}
          <div className="w-1/2 p-6 overflow-y-auto">
            <div className="flex items-start justify-between mb-4">
              <div>
                <p className="text-sm text-blue-500 font-medium">
                  {nft.collection?.name || 'Unknown Collection'}
                </p>
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
                  {nft.name || `#${nft.tokenId}`}
                </h2>
              </div>
              <button
                onClick={onClose}
                className="p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg"
              >
                <X className="w-5 h-5 text-gray-500" />
              </button>
            </div>

            {/* Description */}
            {nft.description && (
              <p className="text-gray-600 dark:text-gray-400 mb-6">
                {nft.description}
              </p>
            )}

            {/* Rarity */}
            {nft.rarity && (
              <div className="mb-6 p-4 bg-yellow-50 dark:bg-yellow-900/20 rounded-xl">
                <div className="flex items-center gap-2 mb-2">
                  <Sparkles className="w-5 h-5 text-yellow-600" />
                  <span className="font-medium text-yellow-900 dark:text-yellow-100">
                    Rarity Rank #{nft.rarity.rank}
                  </span>
                </div>
                <div className="text-sm text-yellow-700 dark:text-yellow-300">
                  Score: {nft.rarity.score.toFixed(2)} / Top {((nft.rarity.rank / nft.rarity.total) * 100).toFixed(1)}%
                </div>
              </div>
            )}

            {/* Traits */}
            {nft.traits && nft.traits.length > 0 && (
              <div className="mb-6">
                <h3 className="font-medium text-gray-900 dark:text-white mb-3 flex items-center gap-2">
                  <Tag className="w-4 h-4" />
                  Traits
                </h3>
                <div className="grid grid-cols-2 gap-2">
                  {nft.traits.map((trait, i) => (
                    <div
                      key={i}
                      className="p-3 bg-gray-100 dark:bg-gray-800 rounded-lg"
                    >
                      <div className="text-xs text-gray-500 dark:text-gray-400 uppercase">
                        {trait.traitType}
                      </div>
                      <div className="font-medium text-gray-900 dark:text-white">
                        {trait.value}
                      </div>
                      {trait.rarity && (
                        <div className="text-xs text-blue-500">
                          {(trait.rarity * 100).toFixed(1)}% have this
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Actions */}
            <div className="flex gap-3">
              <button className="flex-1 flex items-center justify-center gap-2 py-3 bg-blue-500 hover:bg-blue-600 text-white font-medium rounded-xl transition-colors">
                <Send className="w-4 h-4" />
                Transfer
              </button>
              <button
                onClick={() => window.open(nft.externalUrl, '_blank')}
                className="flex-1 flex items-center justify-center gap-2 py-3 border border-gray-200 dark:border-gray-700 hover:bg-gray-100 dark:hover:bg-gray-800 font-medium rounded-xl transition-colors"
              >
                <ExternalLink className="w-4 h-4" />
                View on Marketplace
              </button>
            </div>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}

// ============================================
// Main Component
// ============================================

export function NFTGallery({ className }: NFTGalleryProps) {
  const { activeWallet, currentNetwork } = useWallet();
  const { nfts, isLoading, error } = useNFTs(activeWallet?.address, currentNetwork?.chainId);

  const [searchQuery, setSearchQuery] = useState('');
  const [viewMode, setViewMode] = useState<ViewMode>('grid-large');
  const [groupBy, setGroupBy] = useState<GroupBy>('none');
  const [selectedNFT, setSelectedNFT] = useState<NFT | null>(null);
  const [selectedCollection, setSelectedCollection] = useState<string | null>(null);

  // Get unique collections
  const collections = useMemo(() => {
    const collectionMap = new Map<string, { name: string; count: number; imageUrl?: string }>();
    nfts.forEach(nft => {
      if (!nft.collection) return;
      const key = nft.collection.slug || nft.collection.name;
      const existing = collectionMap.get(key);
      if (existing) {
        existing.count++;
      } else {
        collectionMap.set(key, {
          name: nft.collection.name,
          count: 1,
          imageUrl: nft.collection.imageUrl,
        });
      }
    });
    return Array.from(collectionMap.entries());
  }, [nfts]);

  // Filter NFTs
  const filteredNFTs = useMemo(() => {
    let filtered = [...nfts];

    // Search filter
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(
        nft =>
          nft.name?.toLowerCase().includes(query) ||
          nft.collection?.name?.toLowerCase().includes(query) ||
          nft.tokenId.includes(query)
      );
    }

    // Collection filter
    if (selectedCollection) {
      filtered = filtered.filter(
        nft => nft.collection && (nft.collection.slug || nft.collection.name) === selectedCollection
      );
    }

    return filtered;
  }, [nfts, searchQuery, selectedCollection]);

  // Group NFTs by collection
  const groupedNFTs = useMemo(() => {
    if (groupBy !== 'collection') return { ungrouped: filteredNFTs };

    const groups: Record<string, NFT[]> = {};
    filteredNFTs.forEach(nft => {
      const key = nft.collection?.slug || nft.collection?.name || 'unknown';
      if (!groups[key]) groups[key] = [];
      groups[key].push(nft);
    });
    return groups;
  }, [filteredNFTs, groupBy]);

  // Loading state
  if (isLoading) {
    return (
      <div className={cn('p-6', className)}>
        <div className={cn(
          'grid gap-4',
          viewMode === 'grid-large' ? 'grid-cols-2 md:grid-cols-3 lg:grid-cols-4' : 'grid-cols-3 md:grid-cols-4 lg:grid-cols-6'
        )}>
          {[1, 2, 3, 4, 5, 6, 7, 8].map((i) => (
            <div key={i} className="animate-pulse">
              <div className="aspect-square bg-gray-200 dark:bg-gray-700 rounded-xl mb-2" />
              <div className="h-4 w-3/4 bg-gray-200 dark:bg-gray-700 rounded mb-1" />
              <div className="h-3 w-1/2 bg-gray-200 dark:bg-gray-700 rounded" />
            </div>
          ))}
        </div>
      </div>
    );
  }

  // Empty state
  if (nfts.length === 0) {
    return (
      <div className={cn('p-12 text-center', className)}>
        <div className="w-20 h-20 bg-gray-100 dark:bg-gray-800 rounded-full flex items-center justify-center mx-auto mb-4">
          <ImageIcon className="w-10 h-10 text-gray-400" />
        </div>
        <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
          No NFTs Found
        </h3>
        <p className="text-gray-500 dark:text-gray-400">
          You don't have any NFTs in this wallet yet
        </p>
      </div>
    );
  }

  return (
    <div className={className}>
      {/* Header */}
      <div className="p-4 border-b border-gray-200 dark:border-gray-800">
        <div className="flex items-center gap-4">
          {/* Search */}
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input
              type="text"
              placeholder="Search NFTs..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className={cn(
                'w-full pl-10 pr-4 py-2 rounded-xl',
                'bg-gray-100 dark:bg-gray-800',
                'border border-transparent focus:border-blue-500',
                'text-gray-900 dark:text-white placeholder-gray-500',
                'outline-none transition-colors'
              )}
            />
          </div>

          {/* Collection Filter */}
          <select
            value={selectedCollection || ''}
            onChange={(e) => setSelectedCollection(e.target.value || null)}
            className={cn(
              'px-4 py-2 rounded-xl',
              'bg-gray-100 dark:bg-gray-800',
              'border border-gray-200 dark:border-gray-700',
              'text-gray-900 dark:text-white',
              'outline-none focus:border-blue-500'
            )}
          >
            <option value="">All Collections</option>
            {collections.map(([key, { name, count }]) => (
              <option key={key} value={key}>
                {name} ({count})
              </option>
            ))}
          </select>

          {/* View Mode */}
          <div className="flex gap-1 p-1 bg-gray-100 dark:bg-gray-800 rounded-lg">
            <button
              onClick={() => setViewMode('grid-large')}
              className={cn(
                'p-2 rounded-lg transition-colors',
                viewMode === 'grid-large'
                  ? 'bg-white dark:bg-gray-700 shadow-sm'
                  : 'hover:bg-gray-200 dark:hover:bg-gray-700'
              )}
            >
              <Grid2X2 className="w-4 h-4" />
            </button>
            <button
              onClick={() => setViewMode('grid-small')}
              className={cn(
                'p-2 rounded-lg transition-colors',
                viewMode === 'grid-small'
                  ? 'bg-white dark:bg-gray-700 shadow-sm'
                  : 'hover:bg-gray-200 dark:hover:bg-gray-700'
              )}
            >
              <Grid3X3 className="w-4 h-4" />
            </button>
            <button
              onClick={() => setViewMode('list')}
              className={cn(
                'p-2 rounded-lg transition-colors',
                viewMode === 'list'
                  ? 'bg-white dark:bg-gray-700 shadow-sm'
                  : 'hover:bg-gray-200 dark:hover:bg-gray-700'
              )}
            >
              <List className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      {/* NFT Grid */}
      <div className="p-4">
        {groupBy === 'collection' ? (
          Object.entries(groupedNFTs).map(([collection, items]) => (
            <div key={collection} className="mb-8">
              <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-4">
                {collection} ({items.length})
              </h3>
              <div
                className={cn(
                  'grid gap-4',
                  viewMode === 'list'
                    ? 'grid-cols-1'
                    : viewMode === 'grid-large'
                    ? 'grid-cols-2 md:grid-cols-3 lg:grid-cols-4'
                    : 'grid-cols-3 md:grid-cols-4 lg:grid-cols-6'
                )}
              >
                {items.map((nft) => (
                  <NFTCard
                    key={`${nft.contractAddress}-${nft.tokenId}`}
                    nft={nft}
                    viewMode={viewMode}
                    onSelect={setSelectedNFT}
                  />
                ))}
              </div>
            </div>
          ))
        ) : (
          <div
            className={cn(
              'grid gap-4',
              viewMode === 'list'
                ? 'grid-cols-1'
                : viewMode === 'grid-large'
                ? 'grid-cols-2 md:grid-cols-3 lg:grid-cols-4'
                : 'grid-cols-3 md:grid-cols-4 lg:grid-cols-6'
            )}
          >
            <AnimatePresence>
              {filteredNFTs.map((nft) => (
                <NFTCard
                  key={`${nft.contractAddress}-${nft.tokenId}`}
                  nft={nft}
                  viewMode={viewMode}
                  onSelect={setSelectedNFT}
                />
              ))}
            </AnimatePresence>
          </div>
        )}
      </div>

      {/* Summary */}
      <div className="p-4 bg-gray-50 dark:bg-gray-800/50 border-t border-gray-200 dark:border-gray-800">
        <div className="flex items-center justify-between text-sm">
          <span className="text-gray-500">
            {filteredNFTs.length} NFT{filteredNFTs.length !== 1 && 's'}
            {selectedCollection && ` in ${selectedCollection}`}
          </span>
          <span className="text-gray-500">
            {collections.length} collection{collections.length !== 1 && 's'}
          </span>
        </div>
      </div>

      {/* NFT Detail Modal */}
      {selectedNFT && (
        <NFTDetailModal nft={selectedNFT} onClose={() => setSelectedNFT(null)} />
      )}
    </div>
  );
}

export default NFTGallery;
