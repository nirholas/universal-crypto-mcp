'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';
import { User } from 'lucide-react';

// ============================================================
// Avatar
// ============================================================

interface AvatarProps {
  src?: string;
  alt?: string;
  fallback?: string;
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl' | '2xl';
  status?: 'online' | 'offline' | 'idle' | 'busy';
  bordered?: boolean;
  className?: string;
}

export function Avatar({
  src,
  alt = 'Avatar',
  fallback,
  size = 'md',
  status,
  bordered = false,
  className,
}: AvatarProps) {
  const [imageError, setImageError] = useState(false);

  const sizes = {
    xs: 'w-6 h-6 text-xs',
    sm: 'w-8 h-8 text-sm',
    md: 'w-10 h-10 text-base',
    lg: 'w-12 h-12 text-lg',
    xl: 'w-16 h-16 text-xl',
    '2xl': 'w-24 h-24 text-2xl',
  };

  const statusSizes = {
    xs: 'w-1.5 h-1.5',
    sm: 'w-2 h-2',
    md: 'w-2.5 h-2.5',
    lg: 'w-3 h-3',
    xl: 'w-4 h-4',
    '2xl': 'w-5 h-5',
  };

  const statusColors = {
    online: 'bg-green-500',
    offline: 'bg-gray-500',
    idle: 'bg-yellow-500',
    busy: 'bg-red-500',
  };

  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map(part => part[0])
      .join('')
      .toUpperCase()
      .slice(0, 2);
  };

  return (
    <div className={cn('relative inline-block', className)}>
      <div
        className={cn(
          'relative rounded-full overflow-hidden flex items-center justify-center',
          'bg-gradient-to-br from-purple-500 to-pink-500',
          sizes[size],
          bordered && 'ring-2 ring-white/20'
        )}
      >
        {src && !imageError ? (
          <img
            src={src}
            alt={alt}
            className="w-full h-full object-cover"
            onError={() => setImageError(true)}
          />
        ) : fallback ? (
          <span className="font-semibold text-white">{getInitials(fallback)}</span>
        ) : (
          <User className="w-1/2 h-1/2 text-white/80" />
        )}
      </div>

      {status && (
        <span
          className={cn(
            'absolute bottom-0 right-0 rounded-full border-2 border-black',
            statusSizes[size],
            statusColors[status]
          )}
        />
      )}
    </div>
  );
}

// ============================================================
// Avatar Group
// ============================================================

interface AvatarGroupProps {
  avatars: Array<{
    src?: string;
    alt?: string;
    fallback?: string;
  }>;
  max?: number;
  size?: AvatarProps['size'];
  className?: string;
}

export function AvatarGroup({
  avatars,
  max = 4,
  size = 'md',
  className,
}: AvatarGroupProps) {
  const displayed = avatars.slice(0, max);
  const overflow = avatars.length - max;

  const overlap = {
    xs: '-space-x-2',
    sm: '-space-x-2.5',
    md: '-space-x-3',
    lg: '-space-x-4',
    xl: '-space-x-5',
    '2xl': '-space-x-6',
  };

  const overflowSizes = {
    xs: 'w-6 h-6 text-[10px]',
    sm: 'w-8 h-8 text-xs',
    md: 'w-10 h-10 text-sm',
    lg: 'w-12 h-12 text-base',
    xl: 'w-16 h-16 text-lg',
    '2xl': 'w-24 h-24 text-xl',
  };

  return (
    <div className={cn('flex items-center', overlap[size], className)}>
      {displayed.map((avatar, i) => (
        <motion.div
          key={i}
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: i * 0.05 }}
          className="relative"
        >
          <Avatar
            {...avatar}
            size={size}
            bordered
          />
        </motion.div>
      ))}
      {overflow > 0 && (
        <div
          className={cn(
            'relative flex items-center justify-center rounded-full',
            'bg-white/10 border-2 border-black text-white font-medium',
            overflowSizes[size]
          )}
        >
          +{overflow}
        </div>
      )}
    </div>
  );
}

// ============================================================
// Crypto Avatar (with chain indicator)
// ============================================================

interface CryptoAvatarProps {
  src?: string;
  symbol?: string;
  chain?: 'ethereum' | 'solana' | 'polygon' | 'arbitrum' | 'base';
  size?: AvatarProps['size'];
  className?: string;
}

export function CryptoAvatar({
  src,
  symbol,
  chain,
  size = 'md',
  className,
}: CryptoAvatarProps) {
  const chainColors = {
    ethereum: 'bg-blue-500',
    solana: 'bg-purple-500',
    polygon: 'bg-purple-600',
    arbitrum: 'bg-blue-600',
    base: 'bg-blue-400',
  };

  const chainLogos = {
    ethereum: '⟠',
    solana: '◎',
    polygon: '⬡',
    arbitrum: '◈',
    base: '●',
  };

  const chainIndicatorSizes = {
    xs: 'w-3 h-3 text-[8px]',
    sm: 'w-4 h-4 text-[10px]',
    md: 'w-5 h-5 text-xs',
    lg: 'w-6 h-6 text-sm',
    xl: 'w-8 h-8 text-base',
    '2xl': 'w-10 h-10 text-lg',
  };

  return (
    <div className={cn('relative inline-block', className)}>
      <Avatar
        src={src}
        fallback={symbol}
        size={size}
      />
      {chain && (
        <div
          className={cn(
            'absolute -bottom-1 -right-1 rounded-full flex items-center justify-center',
            'border-2 border-black',
            chainColors[chain],
            chainIndicatorSizes[size]
          )}
        >
          <span className="text-white">{chainLogos[chain]}</span>
        </div>
      )}
    </div>
  );
}

// ============================================================
// Profile Card
// ============================================================

interface ProfileCardProps {
  avatar?: string;
  name: string;
  title?: string;
  address?: string;
  stats?: Array<{ label: string; value: string | number }>;
  className?: string;
}

export function ProfileCard({
  avatar,
  name,
  title,
  address,
  stats,
  className,
}: ProfileCardProps) {
  const formatAddress = (addr: string) => 
    `${addr.slice(0, 6)}...${addr.slice(-4)}`;

  return (
    <motion.div
      className={cn(
        'p-6 rounded-2xl bg-white/5 border border-white/10 backdrop-blur-xl',
        className
      )}
      whileHover={{ y: -2 }}
    >
      <div className="flex items-center gap-4">
        <Avatar src={avatar} fallback={name} size="xl" />
        <div className="flex-1 min-w-0">
          <h3 className="text-lg font-semibold text-white truncate">{name}</h3>
          {title && <p className="text-sm text-white/60">{title}</p>}
          {address && (
            <p className="text-sm text-purple-400 font-mono mt-1">
              {formatAddress(address)}
            </p>
          )}
        </div>
      </div>

      {stats && stats.length > 0 && (
        <div className="mt-6 pt-6 border-t border-white/10 grid grid-cols-3 gap-4">
          {stats.map((stat, i) => (
            <div key={i} className="text-center">
              <div className="text-xl font-bold text-white">{stat.value}</div>
              <div className="text-xs text-white/50">{stat.label}</div>
            </div>
          ))}
        </div>
      )}
    </motion.div>
  );
}
