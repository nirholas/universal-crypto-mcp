'use client';

import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';
import { 
  ArrowUpRight, 
  ArrowDownRight, 
  ExternalLink, 
  Clock,
  CheckCircle,
  XCircle,
  Loader2
} from 'lucide-react';
import { TokenLogo } from './TokenLogo';

type TransactionStatus = 'pending' | 'success' | 'failed';
type TransactionType = 'send' | 'receive' | 'swap' | 'approve' | 'stake' | 'unstake' | 'mint' | 'burn';

interface Transaction {
  id: string;
  hash: string;
  type: TransactionType;
  status: TransactionStatus;
  fromToken?: { symbol: string; amount: string; logo?: string };
  toToken?: { symbol: string; amount: string; logo?: string };
  timestamp: Date;
  gasUsed?: string;
  chain?: string;
}

interface TransactionListProps {
  transactions: Transaction[];
  onViewExplorer?: (hash: string) => void;
  className?: string;
}

const typeLabels: Record<TransactionType, string> = {
  send: 'Sent',
  receive: 'Received',
  swap: 'Swapped',
  approve: 'Approved',
  stake: 'Staked',
  unstake: 'Unstaked',
  mint: 'Minted',
  burn: 'Burned',
};

const statusIcons: Record<TransactionStatus, React.ReactNode> = {
  pending: <Loader2 className="w-4 h-4 text-amber-400 animate-spin" />,
  success: <CheckCircle className="w-4 h-4 text-green-400" />,
  failed: <XCircle className="w-4 h-4 text-red-400" />,
};

function formatTimeAgo(date: Date): string {
  const now = new Date();
  const diff = now.getTime() - date.getTime();
  const minutes = Math.floor(diff / 60000);
  const hours = Math.floor(diff / 3600000);
  const days = Math.floor(diff / 86400000);

  if (minutes < 1) return 'Just now';
  if (minutes < 60) return `${minutes}m ago`;
  if (hours < 24) return `${hours}h ago`;
  return `${days}d ago`;
}

export function TransactionList({ 
  transactions, 
  onViewExplorer,
  className 
}: TransactionListProps) {
  return (
    <div className={cn('space-y-2', className)}>
      {transactions.map((tx, index) => (
        <motion.div
          key={tx.id}
          className="flex items-center gap-4 p-4 bg-white/5 hover:bg-white/10 border border-white/10 rounded-xl transition-colors cursor-pointer group"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: index * 0.05 }}
          onClick={() => onViewExplorer?.(tx.hash)}
        >
          {/* Icon */}
          <div className={cn(
            'p-2 rounded-xl',
            tx.type === 'receive' ? 'bg-green-500/20' : 'bg-purple-500/20'
          )}>
            {tx.type === 'receive' ? (
              <ArrowDownRight className="w-5 h-5 text-green-400" />
            ) : (
              <ArrowUpRight className="w-5 h-5 text-purple-400" />
            )}
          </div>

          {/* Details */}
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2">
              <span className="font-medium text-white">{typeLabels[tx.type]}</span>
              {statusIcons[tx.status]}
            </div>
            
            {/* Token info */}
            <div className="flex items-center gap-2 mt-1 text-sm text-white/60">
              {tx.fromToken && (
                <span className="flex items-center gap-1">
                  <TokenLogo symbol={tx.fromToken.symbol} src={tx.fromToken.logo} size="sm" />
                  {tx.fromToken.amount} {tx.fromToken.symbol}
                </span>
              )}
              {tx.toToken && (
                <>
                  <span>→</span>
                  <span className="flex items-center gap-1">
                    <TokenLogo symbol={tx.toToken.symbol} src={tx.toToken.logo} size="sm" />
                    {tx.toToken.amount} {tx.toToken.symbol}
                  </span>
                </>
              )}
            </div>
          </div>

          {/* Time & Explorer */}
          <div className="text-right">
            <div className="flex items-center gap-1 text-sm text-white/40">
              <Clock className="w-3 h-3" />
              {formatTimeAgo(tx.timestamp)}
            </div>
            <div className="text-xs text-white/30 font-mono mt-1 group-hover:text-purple-400 transition-colors">
              {tx.hash.slice(0, 6)}...{tx.hash.slice(-4)}
              <ExternalLink className="w-3 h-3 inline ml-1" />
            </div>
          </div>
        </motion.div>
      ))}
    </div>
  );
}
