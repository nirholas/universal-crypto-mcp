'use client';

import { cn } from '@/lib/utils';

interface GradientTextProps {
  children: React.ReactNode;
  className?: string;
  gradient?: 'purple' | 'blue' | 'green' | 'orange' | 'rainbow';
}

export function GradientText({
  children,
  className,
  gradient = 'purple',
}: GradientTextProps) {
  const gradients = {
    purple: 'from-purple-400 via-pink-500 to-red-500',
    blue: 'from-blue-400 via-cyan-500 to-teal-500',
    green: 'from-green-400 via-emerald-500 to-teal-500',
    orange: 'from-orange-400 via-amber-500 to-yellow-500',
    rainbow: 'from-red-500 via-yellow-500 to-blue-500',
  };

  return (
    <span
      className={cn(
        'bg-gradient-to-r bg-clip-text text-transparent animate-gradient',
        gradients[gradient],
        className
      )}
    >
      {children}
    </span>
  );
}
