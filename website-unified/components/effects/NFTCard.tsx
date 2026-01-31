'use client';

import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';
import { Flame, TrendingUp, Clock, Users } from 'lucide-react';
import { TokenLogo } from './TokenLogo';

interface NFT {
  id: string;
  name: string;
  collection: string;
  image: string;
  price: number;
  currency: string;
  lastSale?: number;
  rarity?: string;
  likes?: number;
}

interface NFTCardProps {
  nft: NFT;
  onBuy?: () => void;
  onView?: () => void;
  className?: string;
}

export function NFTCard({ nft, onBuy, onView, className }: NFTCardProps) {
  return (
    <motion.div
      className={cn(
        'group relative bg-gradient-to-br from-white/5 to-white/[0.02] border border-white/10 rounded-2xl overflow-hidden cursor-pointer',
        className
      )}
      whileHover={{ scale: 1.02, y: -5 }}
      transition={{ type: 'spring', stiffness: 300 }}
      onClick={onView}
    >
      {/* Image */}
      <div className="relative aspect-square overflow-hidden">
        <img
          src={nft.image}
          alt={nft.name}
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
        />
        
        {/* Overlay on hover */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
        
        {/* Rarity badge */}
        {nft.rarity && (
          <div className="absolute top-3 left-3 px-2 py-1 bg-amber-500/90 backdrop-blur-sm rounded-lg text-xs font-bold text-black flex items-center gap-1">
            <Flame className="w-3 h-3" />
            {nft.rarity}
          </div>
        )}
        
        {/* Buy button on hover */}
        <motion.button
          className="absolute bottom-3 left-3 right-3 py-3 bg-gradient-to-r from-purple-500 to-pink-500 rounded-xl font-semibold text-white opacity-0 group-hover:opacity-100 transition-opacity"
          onClick={(e) => {
            e.stopPropagation();
            onBuy?.();
          }}
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
        >
          Buy Now
        </motion.button>
      </div>

      {/* Info */}
      <div className="p-4">
        <div className="flex items-start justify-between gap-2">
          <div className="min-w-0">
            <p className="text-sm text-white/40 truncate">{nft.collection}</p>
            <h3 className="font-semibold text-white truncate">{nft.name}</h3>
          </div>
          {nft.likes !== undefined && (
            <div className="flex items-center gap-1 text-sm text-white/40">
              <Users className="w-3 h-3" />
              {nft.likes}
            </div>
          )}
        </div>

        <div className="flex items-center justify-between mt-3 pt-3 border-t border-white/10">
          <div>
            <p className="text-xs text-white/40">Price</p>
            <div className="flex items-center gap-1">
              <TokenLogo symbol={nft.currency} size="sm" />
              <span className="font-bold text-white">{nft.price}</span>
              <span className="text-white/60">{nft.currency}</span>
            </div>
          </div>
          {nft.lastSale && (
            <div className="text-right">
              <p className="text-xs text-white/40">Last Sale</p>
              <div className="flex items-center gap-1 text-sm">
                <span className="text-white/60">{nft.lastSale} {nft.currency}</span>
                {nft.price > nft.lastSale && (
                  <TrendingUp className="w-3 h-3 text-green-400" />
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </motion.div>
  );
}

interface NFTGridProps {
  nfts: NFT[];
  onBuy?: (nft: NFT) => void;
  onView?: (nft: NFT) => void;
  className?: string;
}

export function NFTGrid({ nfts, onBuy, onView, className }: NFTGridProps) {
  return (
    <div className={cn('grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6', className)}>
      {nfts.map((nft, i) => (
        <motion.div
          key={nft.id}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: i * 0.05 }}
        >
          <NFTCard
            nft={nft}
            onBuy={() => onBuy?.(nft)}
            onView={() => onView?.(nft)}
          />
        </motion.div>
      ))}
    </div>
  );
}
