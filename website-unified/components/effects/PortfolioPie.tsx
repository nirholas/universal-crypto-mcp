'use client';

import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';

interface PortfolioToken {
  symbol: string;
  name: string;
  color: string;
  value: number;
  percentage: number;
}

interface PortfolioPieProps {
  tokens: PortfolioToken[];
  totalValue: number;
  className?: string;
}

export function PortfolioPie({ tokens, totalValue, className }: PortfolioPieProps) {
  const sortedTokens = [...tokens].sort((a, b) => b.percentage - a.percentage);
  
  // Calculate pie slices
  let cumulativePercentage = 0;
  const slices = sortedTokens.map((token, index) => {
    const startAngle = cumulativePercentage * 3.6; // 360 / 100
    cumulativePercentage += token.percentage;
    const endAngle = cumulativePercentage * 3.6;
    
    return {
      ...token,
      startAngle,
      endAngle,
      index,
    };
  });

  const polarToCartesian = (angle: number, radius: number) => {
    const rad = ((angle - 90) * Math.PI) / 180;
    return {
      x: 100 + radius * Math.cos(rad),
      y: 100 + radius * Math.sin(rad),
    };
  };

  const describeArc = (startAngle: number, endAngle: number, radius: number) => {
    const start = polarToCartesian(startAngle, radius);
    const end = polarToCartesian(endAngle, radius);
    const largeArcFlag = endAngle - startAngle <= 180 ? 0 : 1;
    
    return [
      'M', 100, 100,
      'L', start.x, start.y,
      'A', radius, radius, 0, largeArcFlag, 1, end.x, end.y,
      'Z'
    ].join(' ');
  };

  return (
    <div className={cn('flex items-center gap-8', className)}>
      {/* Pie Chart */}
      <div className="relative w-48 h-48">
        <svg viewBox="0 0 200 200" className="w-full h-full -rotate-90">
          {slices.map((slice, i) => (
            <motion.path
              key={slice.symbol}
              d={describeArc(slice.startAngle, slice.endAngle - 0.5, 80)}
              fill={slice.color}
              initial={{ scale: 0, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ delay: i * 0.1, type: 'spring' }}
              className="cursor-pointer transition-transform hover:scale-105 origin-center"
            />
          ))}
          {/* Inner circle for donut effect */}
          <circle cx="100" cy="100" r="50" fill="rgb(0 0 0 / 0.8)" />
        </svg>
        
        {/* Center total */}
        <div className="absolute inset-0 flex flex-col items-center justify-center rotate-0">
          <div className="text-sm text-white/60">Total Value</div>
          <div className="text-2xl font-bold text-white">
            ${totalValue.toLocaleString(undefined, { maximumFractionDigits: 0 })}
          </div>
        </div>
      </div>

      {/* Legend */}
      <div className="flex-1 space-y-2">
        {sortedTokens.slice(0, 6).map((token, i) => (
          <motion.div
            key={token.symbol}
            className="flex items-center gap-3 p-2 rounded-lg hover:bg-white/5 transition-colors"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: i * 0.05 }}
          >
            <div 
              className="w-3 h-3 rounded-full" 
              style={{ backgroundColor: token.color }}
            />
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2">
                <span className="font-medium text-white">{token.symbol}</span>
                <span className="text-sm text-white/40">{token.percentage.toFixed(1)}%</span>
              </div>
            </div>
            <div className="font-mono text-white/60">
              ${token.value.toLocaleString(undefined, { maximumFractionDigits: 0 })}
            </div>
          </motion.div>
        ))}
        {sortedTokens.length > 6 && (
          <div className="text-sm text-white/40 pl-6">
            +{sortedTokens.length - 6} more assets
          </div>
        )}
      </div>
    </div>
  );
}
