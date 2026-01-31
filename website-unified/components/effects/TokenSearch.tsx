'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { cn } from '@/lib/utils';
import { Search, Star, TrendingUp, Clock, Zap } from 'lucide-react';
import { TokenLogo } from './TokenLogo';

interface Token {
  symbol: string;
  name: string;
  logo?: string;
  price?: number;
  change24h?: number;
}

interface TokenSearchProps {
  tokens: Token[];
  recentSearches?: Token[];
  trendingTokens?: Token[];
  onSelect: (token: Token) => void;
  placeholder?: string;
  className?: string;
}

export function TokenSearch({
  tokens,
  recentSearches = [],
  trendingTokens = [],
  onSelect,
  placeholder = 'Search tokens...',
  className,
}: TokenSearchProps) {
  const [query, setQuery] = useState('');
  const [isOpen, setIsOpen] = useState(false);
  const [results, setResults] = useState<Token[]>([]);

  useEffect(() => {
    if (query.length < 1) {
      setResults([]);
      return;
    }
    
    const filtered = tokens.filter(
      (t) =>
        t.symbol.toLowerCase().includes(query.toLowerCase()) ||
        t.name.toLowerCase().includes(query.toLowerCase())
    ).slice(0, 8);
    
    setResults(filtered);
  }, [query, tokens]);

  const handleSelect = (token: Token) => {
    onSelect(token);
    setQuery('');
    setIsOpen(false);
  };

  return (
    <div className={cn('relative', className)}>
      {/* Search Input */}
      <div className="relative">
        <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-white/40" />
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onFocus={() => setIsOpen(true)}
          placeholder={placeholder}
          className="w-full pl-12 pr-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder:text-white/40 focus:outline-none focus:ring-2 focus:ring-purple-500/50 focus:border-purple-500/50 transition-all"
        />
        <kbd className="absolute right-4 top-1/2 -translate-y-1/2 hidden sm:inline-flex items-center gap-1 px-2 py-1 text-xs text-white/40 bg-white/5 rounded">
          ⌘K
        </kbd>
      </div>

      {/* Dropdown */}
      <AnimatePresence>
        {isOpen && (
          <>
            {/* Backdrop */}
            <div 
              className="fixed inset-0 z-40" 
              onClick={() => setIsOpen(false)} 
            />
            
            {/* Results */}
            <motion.div
              className="absolute top-full left-0 right-0 mt-2 bg-black/95 backdrop-blur-xl border border-white/10 rounded-xl overflow-hidden z-50 shadow-2xl"
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
            >
              {/* Search Results */}
              {results.length > 0 && (
                <div className="p-2">
                  <div className="flex items-center gap-2 px-3 py-2 text-xs text-white/40 uppercase">
                    <Search className="w-3 h-3" /> Results
                  </div>
                  {results.map((token, i) => (
                    <motion.button
                      key={token.symbol}
                      className="flex items-center gap-3 w-full px-3 py-2 rounded-lg hover:bg-white/5 text-left transition-colors"
                      onClick={() => handleSelect(token)}
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: i * 0.03 }}
                    >
                      <TokenLogo symbol={token.symbol} src={token.logo} size="sm" />
                      <div className="flex-1 min-w-0">
                        <div className="font-medium text-white">{token.symbol}</div>
                        <div className="text-sm text-white/40 truncate">{token.name}</div>
                      </div>
                      {token.price && (
                        <div className="text-right">
                          <div className="font-mono text-white/80">${token.price.toFixed(2)}</div>
                          {token.change24h !== undefined && (
                            <div className={cn(
                              'text-xs',
                              token.change24h >= 0 ? 'text-green-400' : 'text-red-400'
                            )}>
                              {token.change24h >= 0 ? '+' : ''}{token.change24h.toFixed(2)}%
                            </div>
                          )}
                        </div>
                      )}
                    </motion.button>
                  ))}
                </div>
              )}

              {/* Empty state with suggestions */}
              {query.length === 0 && (
                <>
                  {/* Recent Searches */}
                  {recentSearches.length > 0 && (
                    <div className="p-2 border-b border-white/5">
                      <div className="flex items-center gap-2 px-3 py-2 text-xs text-white/40 uppercase">
                        <Clock className="w-3 h-3" /> Recent
                      </div>
                      <div className="flex flex-wrap gap-2 px-3 py-1">
                        {recentSearches.map((token) => (
                          <button
                            key={token.symbol}
                            onClick={() => handleSelect(token)}
                            className="flex items-center gap-2 px-3 py-1.5 bg-white/5 hover:bg-white/10 rounded-full transition-colors"
                          >
                            <TokenLogo symbol={token.symbol} src={token.logo} size="sm" />
                            <span className="text-sm text-white">{token.symbol}</span>
                          </button>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Trending */}
                  {trendingTokens.length > 0 && (
                    <div className="p-2">
                      <div className="flex items-center gap-2 px-3 py-2 text-xs text-white/40 uppercase">
                        <TrendingUp className="w-3 h-3" /> Trending
                      </div>
                      {trendingTokens.slice(0, 5).map((token, i) => (
                        <button
                          key={token.symbol}
                          className="flex items-center gap-3 w-full px-3 py-2 rounded-lg hover:bg-white/5 text-left transition-colors"
                          onClick={() => handleSelect(token)}
                        >
                          <span className="w-5 text-center text-white/40 text-sm">
                            {i + 1}
                          </span>
                          <TokenLogo symbol={token.symbol} src={token.logo} size="sm" />
                          <span className="font-medium text-white">{token.symbol}</span>
                          <Zap className="w-4 h-4 text-amber-400 ml-auto" />
                        </button>
                      ))}
                    </div>
                  )}
                </>
              )}

              {/* No results */}
              {query.length > 0 && results.length === 0 && (
                <div className="p-8 text-center text-white/40">
                  <Search className="w-8 h-8 mx-auto mb-2 opacity-50" />
                  <p>No tokens found for "{query}"</p>
                </div>
              )}
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}
