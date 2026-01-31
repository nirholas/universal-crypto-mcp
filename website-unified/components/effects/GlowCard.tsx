'use client';

import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';

interface GlowCardProps {
  children: React.ReactNode;
  className?: string;
  glowColor?: string;
}

export function GlowCard({ children, className, glowColor = 'purple' }: GlowCardProps) {
  const colors = {
    purple: 'from-purple-500 to-pink-500',
    blue: 'from-blue-500 to-cyan-500',
    green: 'from-green-500 to-emerald-500',
    orange: 'from-orange-500 to-yellow-500',
  };

  return (
    <motion.div
      className={cn('relative group', className)}
      whileHover={{ scale: 1.02 }}
      transition={{ type: 'spring', stiffness: 300 }}
    >
      {/* Glow effect */}
      <div
        className={cn(
          'absolute -inset-0.5 bg-gradient-to-r opacity-0 group-hover:opacity-75 rounded-xl blur transition-opacity duration-500',
          colors[glowColor as keyof typeof colors] || colors.purple
        )}
      />
      
      {/* Card content */}
      <div className="relative bg-black/80 backdrop-blur-xl border border-white/10 rounded-xl p-6">
        {children}
      </div>
    </motion.div>
  );
}
