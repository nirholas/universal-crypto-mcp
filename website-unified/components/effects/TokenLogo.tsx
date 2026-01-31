'use client';

import { useState } from 'react';
import Image from 'next/image';
import { cn } from '@/lib/utils';

interface TokenLogoProps {
  symbol: string;
  src?: string;
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

const sizes = {
  sm: 24,
  md: 32,
  lg: 48,
};

export function TokenLogo({ symbol, src, size = 'md', className }: TokenLogoProps) {
  const [error, setError] = useState(false);
  const dimension = sizes[size];

  if (error || !src) {
    return (
      <div
        className={cn(
          'flex items-center justify-center rounded-full bg-gradient-to-br from-purple-500 to-pink-500 text-white font-bold',
          className
        )}
        style={{ width: dimension, height: dimension, fontSize: dimension * 0.4 }}
      >
        {symbol.slice(0, 2).toUpperCase()}
      </div>
    );
  }

  return (
    <Image
      src={src}
      alt={symbol}
      width={dimension}
      height={dimension}
      className={cn('rounded-full', className)}
      onError={() => setError(true)}
    />
  );
}
