'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';
import { Copy, Check, ExternalLink, QrCode, Wallet } from 'lucide-react';
import { TokenLogo } from './TokenLogo';

interface TokenBalance {
  symbol: string;
  name: string;
  logo?: string;
  balance: number;
  value: number;
  change24h?: number;
}

interface AddressCardProps {
  address: string;
  ensName?: string;
  avatar?: string;
  balances: TokenBalance[];
  totalValue: number;
  chain?: string;
  explorerUrl?: string;
  onShowQR?: () => void;
  className?: string;
}

export function AddressCard({
  address,
  ensName,
  avatar,
  balances,
  totalValue,
  chain = 'Ethereum',
  explorerUrl,
  onShowQR,
  className,
}: AddressCardProps) {
  const [copied, setCopied] = useState(false);

  const shortAddress = `${address.slice(0, 6)}...${address.slice(-4)}`;

  const handleCopy = async () => {
    await navigator.clipboard.writeText(address);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <motion.div
      className={cn(
        'bg-gradient-to-br from-white/5 to-white/[0.02] border border-white/10 rounded-2xl overflow-hidden',
        className
      )}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
    >
      {/* Header with gradient */}
      <div className="relative h-24 bg-gradient-to-r from-purple-500/20 via-pink-500/20 to-cyan-500/20">
        <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.02)_1px,transparent_1px)] bg-[size:20px_20px]" />
      </div>

      {/* Avatar */}
      <div className="relative px-6 -mt-10">
        <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-purple-500 to-pink-500 border-4 border-black flex items-center justify-center overflow-hidden">
          {avatar ? (
            <img src={avatar} alt="Avatar" className="w-full h-full object-cover" />
          ) : (
            <Wallet className="w-8 h-8 text-white" />
          )}
        </div>
      </div>

      {/* Address Info */}
      <div className="px-6 pt-4 pb-6">
        <div className="flex items-start justify-between">
          <div>
            {ensName && (
              <h3 className="text-xl font-bold text-white">{ensName}</h3>
            )}
            <div className="flex items-center gap-2 mt-1">
              <span className="font-mono text-white/60">{shortAddress}</span>
              <button
                onClick={handleCopy}
                className="p-1 hover:bg-white/10 rounded transition-colors"
              >
                {copied ? (
                  <Check className="w-4 h-4 text-green-400" />
                ) : (
                  <Copy className="w-4 h-4 text-white/40" />
                )}
              </button>
              {explorerUrl && (
                <a
                  href={explorerUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-1 hover:bg-white/10 rounded transition-colors"
                >
                  <ExternalLink className="w-4 h-4 text-white/40" />
                </a>
              )}
              {onShowQR && (
                <button
                  onClick={onShowQR}
                  className="p-1 hover:bg-white/10 rounded transition-colors"
                >
                  <QrCode className="w-4 h-4 text-white/40" />
                </button>
              )}
            </div>
          </div>
          <div className="text-right">
            <div className="text-sm text-white/40">Total Value</div>
            <div className="text-2xl font-bold text-white">
              ${totalValue.toLocaleString(undefined, { maximumFractionDigits: 2 })}
            </div>
          </div>
        </div>

        {/* Token Balances */}
        <div className="mt-6 space-y-3">
          <h4 className="text-sm font-medium text-white/40 uppercase tracking-wide">
            Assets
          </h4>
          {balances.slice(0, 4).map((token, i) => (
            <motion.div
              key={token.symbol}
              className="flex items-center gap-3 p-3 bg-white/5 rounded-xl hover:bg-white/10 transition-colors"
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: i * 0.05 }}
            >
              <TokenLogo symbol={token.symbol} src={token.logo} size="md" />
              <div className="flex-1 min-w-0">
                <div className="font-medium text-white">{token.symbol}</div>
                <div className="text-sm text-white/40">{token.name}</div>
              </div>
              <div className="text-right">
                <div className="font-mono text-white">
                  {token.balance.toLocaleString(undefined, { maximumFractionDigits: 4 })}
                </div>
                <div className="text-sm text-white/40">
                  ${token.value.toLocaleString(undefined, { maximumFractionDigits: 2 })}
                </div>
              </div>
            </motion.div>
          ))}
          {balances.length > 4 && (
            <button className="w-full py-2 text-sm text-purple-400 hover:text-purple-300 transition-colors">
              View all {balances.length} assets →
            </button>
          )}
        </div>
      </div>
    </motion.div>
  );
}
