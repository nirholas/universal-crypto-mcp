#!/usr/bin/env node
/**
 * Design System Setup Script
 * 
 * Installs and configures a modern, sexy design system combining:
 * - shadcn/ui (base components)
 * - Tremor (charts & metrics)
 * - Aceternity UI patterns (animated components)
 * - Magic UI patterns (backgrounds, effects)
 * - Framer Motion (animations)
 * 
 * Usage: node scripts/webapp/setup-design-system.mjs
 */

import { writeFileSync, mkdirSync, existsSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';
import { execSync } from 'child_process';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const ROOT_DIR = join(__dirname, '../..');
const WEBAPP_DIR = join(ROOT_DIR, 'website-unified');
const COMPONENTS_DIR = join(WEBAPP_DIR, 'components');
const UI_DIR = join(COMPONENTS_DIR, 'ui');
const EFFECTS_DIR = join(COMPONENTS_DIR, 'effects');

// ============================================================
// Dependencies to Install
// ============================================================

const DEPENDENCIES = [
  // Animation
  'framer-motion',
  // Charts
  '@tremor/react',
  'recharts',
  // 3D & Effects
  'three',
  '@react-three/fiber',
  '@react-three/drei',
  // Utilities
  'clsx',
  'tailwind-merge',
  'class-variance-authority',
  // Icons
  'lucide-react',
  '@radix-ui/react-icons',
  // Extra UI
  '@radix-ui/react-dialog',
  '@radix-ui/react-dropdown-menu',
  '@radix-ui/react-tabs',
  '@radix-ui/react-tooltip',
  '@radix-ui/react-popover',
  '@radix-ui/react-select',
  '@radix-ui/react-slider',
  '@radix-ui/react-switch',
  '@radix-ui/react-checkbox',
  '@radix-ui/react-avatar',
  '@radix-ui/react-progress',
  // Notifications
  'sonner',
  // Date
  'date-fns',
];

// ============================================================
// Sexy Animated Components
// ============================================================

const COMPONENTS = {
  // Animated background with gradient orbs
  'AnimatedBackground': `'use client';

import { motion } from 'framer-motion';

export function AnimatedBackground({ children }: { children?: React.ReactNode }) {
  return (
    <div className="relative min-h-screen overflow-hidden bg-black">
      {/* Gradient Orbs */}
      <motion.div
        className="absolute top-0 -left-40 w-80 h-80 bg-purple-500 rounded-full mix-blend-multiply filter blur-3xl opacity-70"
        animate={{
          x: [0, 100, 0],
          y: [0, 50, 0],
        }}
        transition={{
          duration: 20,
          repeat: Infinity,
          ease: 'easeInOut',
        }}
      />
      <motion.div
        className="absolute top-0 -right-40 w-80 h-80 bg-cyan-500 rounded-full mix-blend-multiply filter blur-3xl opacity-70"
        animate={{
          x: [0, -100, 0],
          y: [0, 100, 0],
        }}
        transition={{
          duration: 25,
          repeat: Infinity,
          ease: 'easeInOut',
        }}
      />
      <motion.div
        className="absolute -bottom-40 left-1/2 w-80 h-80 bg-pink-500 rounded-full mix-blend-multiply filter blur-3xl opacity-70"
        animate={{
          x: [0, 50, 0],
          y: [0, -50, 0],
        }}
        transition={{
          duration: 30,
          repeat: Infinity,
          ease: 'easeInOut',
        }}
      />
      
      {/* Grid overlay */}
      <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.02)_1px,transparent_1px)] bg-[size:50px_50px]" />
      
      {/* Content */}
      <div className="relative z-10">{children}</div>
    </div>
  );
}
`,

  // Glow Card with hover effects
  'GlowCard': `'use client';

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
`,

  // Sparkles effect
  'Sparkles': `'use client';

import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface Sparkle {
  id: string;
  x: number;
  y: number;
  size: number;
  color: string;
}

export function Sparkles({ children }: { children: React.ReactNode }) {
  const [sparkles, setSparkles] = useState<Sparkle[]>([]);

  useEffect(() => {
    const interval = setInterval(() => {
      const sparkle: Sparkle = {
        id: Math.random().toString(36),
        x: Math.random() * 100,
        y: Math.random() * 100,
        size: Math.random() * 10 + 5,
        color: ['#ffd700', '#ff69b4', '#00ffff', '#ff6b6b'][Math.floor(Math.random() * 4)],
      };
      setSparkles(prev => [...prev.slice(-20), sparkle]);
    }, 200);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="relative inline-block">
      <AnimatePresence>
        {sparkles.map(sparkle => (
          <motion.svg
            key={sparkle.id}
            className="absolute pointer-events-none"
            style={{ left: \`\${sparkle.x}%\`, top: \`\${sparkle.y}%\` }}
            width={sparkle.size}
            height={sparkle.size}
            viewBox="0 0 160 160"
            initial={{ scale: 0, opacity: 1 }}
            animate={{ scale: 1, opacity: 0 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.6 }}
          >
            <path
              d="M80 0C80 0 84.2 41.2 97.1 60.1C110 79 160 80 160 80C160 80 110 81 97.1 99.9C84.2 118.8 80 160 80 160C80 160 75.8 118.8 62.9 99.9C50 81 0 80 0 80C0 80 50 79 62.9 60.1C75.8 41.2 80 0 80 0Z"
              fill={sparkle.color}
            />
          </motion.svg>
        ))}
      </AnimatePresence>
      {children}
    </div>
  );
}
`,

  // Animated Counter
  'AnimatedCounter': `'use client';

import { useEffect, useRef, useState } from 'react';
import { motion, useSpring, useTransform, useInView } from 'framer-motion';

interface AnimatedCounterProps {
  value: number;
  prefix?: string;
  suffix?: string;
  decimals?: number;
  className?: string;
}

export function AnimatedCounter({
  value,
  prefix = '',
  suffix = '',
  decimals = 0,
  className,
}: AnimatedCounterProps) {
  const ref = useRef<HTMLSpanElement>(null);
  const isInView = useInView(ref, { once: true });
  const spring = useSpring(0, { damping: 30, stiffness: 100 });
  const display = useTransform(spring, (current) =>
    prefix + current.toFixed(decimals) + suffix
  );
  const [displayValue, setDisplayValue] = useState(prefix + '0' + suffix);

  useEffect(() => {
    if (isInView) {
      spring.set(value);
    }
  }, [isInView, value, spring]);

  useEffect(() => {
    return display.on('change', (v) => setDisplayValue(v));
  }, [display]);

  return (
    <motion.span ref={ref} className={className}>
      {displayValue}
    </motion.span>
  );
}
`,

  // Gradient Text
  'GradientText': `'use client';

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
`,

  // Floating Dock (macOS style)
  'FloatingDock': `'use client';

import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';
import Link from 'next/link';

interface DockItem {
  icon: React.ReactNode;
  label: string;
  href: string;
}

interface FloatingDockProps {
  items: DockItem[];
  className?: string;
}

export function FloatingDock({ items, className }: FloatingDockProps) {
  return (
    <motion.div
      className={cn(
        'fixed bottom-8 left-1/2 -translate-x-1/2 flex items-end gap-4 px-4 py-3 bg-black/50 backdrop-blur-xl border border-white/10 rounded-2xl',
        className
      )}
      initial={{ y: 100, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ type: 'spring', stiffness: 300, damping: 30 }}
    >
      {items.map((item, index) => (
        <motion.div
          key={item.href}
          whileHover={{ scale: 1.4, y: -10 }}
          transition={{ type: 'spring', stiffness: 400, damping: 17 }}
        >
          <Link
            href={item.href}
            className="flex flex-col items-center gap-1 text-white/60 hover:text-white transition-colors"
          >
            <div className="w-12 h-12 flex items-center justify-center bg-white/5 rounded-xl hover:bg-white/10 transition-colors">
              {item.icon}
            </div>
          </Link>
        </motion.div>
      ))}
    </motion.div>
  );
}
`,

  // Bento Grid
  'BentoGrid': `'use client';

import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';

interface BentoGridProps {
  children: React.ReactNode;
  className?: string;
}

export function BentoGrid({ children, className }: BentoGridProps) {
  return (
    <div
      className={cn(
        'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 auto-rows-[minmax(180px,auto)]',
        className
      )}
    >
      {children}
    </div>
  );
}

interface BentoCardProps {
  children: React.ReactNode;
  className?: string;
  colSpan?: 1 | 2 | 3;
  rowSpan?: 1 | 2;
}

export function BentoCard({
  children,
  className,
  colSpan = 1,
  rowSpan = 1,
}: BentoCardProps) {
  return (
    <motion.div
      className={cn(
        'relative overflow-hidden rounded-2xl border border-white/10 bg-gradient-to-br from-white/5 to-white/[0.02] p-6',
        colSpan === 2 && 'md:col-span-2',
        colSpan === 3 && 'lg:col-span-3',
        rowSpan === 2 && 'row-span-2',
        className
      )}
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      whileHover={{ scale: 1.02 }}
      transition={{ type: 'spring', stiffness: 300 }}
    >
      {children}
    </motion.div>
  );
}
`,

  // Crypto Price Ticker
  'PriceTicker': `'use client';

import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';
import { TrendingUp, TrendingDown } from 'lucide-react';

interface PriceTickerProps {
  symbol: string;
  price: number;
  change: number;
  className?: string;
}

export function PriceTicker({ symbol, price, change, className }: PriceTickerProps) {
  const isPositive = change >= 0;

  return (
    <motion.div
      className={cn(
        'flex items-center gap-3 px-4 py-2 rounded-xl bg-white/5 border border-white/10',
        className
      )}
      whileHover={{ scale: 1.02 }}
    >
      <span className="font-bold text-white">{symbol}</span>
      <span className="text-white/80 font-mono">
        \${price.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
      </span>
      <div
        className={cn(
          'flex items-center gap-1 text-sm font-medium',
          isPositive ? 'text-green-400' : 'text-red-400'
        )}
      >
        {isPositive ? <TrendingUp className="w-4 h-4" /> : <TrendingDown className="w-4 h-4" />}
        {isPositive ? '+' : ''}{change.toFixed(2)}%
      </div>
    </motion.div>
  );
}
`,

  // Token Logo with fallback
  'TokenLogo': `'use client';

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
`,

  // Wallet Connect Button
  'WalletButton': `'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Wallet, ChevronDown, Copy, ExternalLink, LogOut } from 'lucide-react';
import { cn } from '@/lib/utils';

interface WalletButtonProps {
  address?: string;
  onConnect?: () => void;
  onDisconnect?: () => void;
  className?: string;
}

export function WalletButton({
  address,
  onConnect,
  onDisconnect,
  className,
}: WalletButtonProps) {
  const [isOpen, setIsOpen] = useState(false);

  const shortAddress = address
    ? \`\${address.slice(0, 6)}...\${address.slice(-4)}\`
    : null;

  if (!address) {
    return (
      <motion.button
        className={cn(
          'flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-purple-500 to-pink-500 rounded-xl font-medium text-white',
          className
        )}
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        onClick={onConnect}
      >
        <Wallet className="w-5 h-5" />
        Connect Wallet
      </motion.button>
    );
  }

  return (
    <div className="relative">
      <motion.button
        className={cn(
          'flex items-center gap-2 px-4 py-2 bg-white/5 border border-white/10 rounded-xl text-white',
          className
        )}
        whileHover={{ scale: 1.02 }}
        onClick={() => setIsOpen(!isOpen)}
      >
        <div className="w-6 h-6 rounded-full bg-gradient-to-r from-purple-500 to-pink-500" />
        <span className="font-mono">{shortAddress}</span>
        <ChevronDown className={cn('w-4 h-4 transition-transform', isOpen && 'rotate-180')} />
      </motion.button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            className="absolute right-0 mt-2 w-48 bg-black/90 backdrop-blur-xl border border-white/10 rounded-xl overflow-hidden"
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
          >
            <button
              className="flex items-center gap-2 w-full px-4 py-3 text-left text-white/60 hover:text-white hover:bg-white/5"
              onClick={() => navigator.clipboard.writeText(address)}
            >
              <Copy className="w-4 h-4" /> Copy Address
            </button>
            <a
              href={\`https://etherscan.io/address/\${address}\`}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 w-full px-4 py-3 text-left text-white/60 hover:text-white hover:bg-white/5"
            >
              <ExternalLink className="w-4 h-4" /> View on Explorer
            </a>
            <button
              className="flex items-center gap-2 w-full px-4 py-3 text-left text-red-400 hover:text-red-300 hover:bg-white/5"
              onClick={onDisconnect}
            >
              <LogOut className="w-4 h-4" /> Disconnect
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
`,

  // Stats Card with chart
  'StatsCard': `'use client';

import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';
import { TrendingUp, TrendingDown } from 'lucide-react';

interface StatsCardProps {
  title: string;
  value: string;
  change?: number;
  icon?: React.ReactNode;
  chart?: React.ReactNode;
  className?: string;
}

export function StatsCard({
  title,
  value,
  change,
  icon,
  chart,
  className,
}: StatsCardProps) {
  const isPositive = change && change >= 0;

  return (
    <motion.div
      className={cn(
        'relative overflow-hidden rounded-2xl border border-white/10 bg-gradient-to-br from-white/5 to-transparent p-6',
        className
      )}
      whileHover={{ scale: 1.02 }}
      transition={{ type: 'spring', stiffness: 300 }}
    >
      <div className="flex justify-between items-start">
        <div>
          <p className="text-sm text-white/60">{title}</p>
          <p className="text-3xl font-bold text-white mt-1">{value}</p>
          {change !== undefined && (
            <div
              className={cn(
                'flex items-center gap-1 mt-2 text-sm font-medium',
                isPositive ? 'text-green-400' : 'text-red-400'
              )}
            >
              {isPositive ? <TrendingUp className="w-4 h-4" /> : <TrendingDown className="w-4 h-4" />}
              {isPositive ? '+' : ''}{change.toFixed(2)}%
            </div>
          )}
        </div>
        {icon && (
          <div className="p-3 rounded-xl bg-white/5">
            {icon}
          </div>
        )}
      </div>
      {chart && (
        <div className="mt-4 h-16">
          {chart}
        </div>
      )}
    </motion.div>
  );
}
`,
};

// ============================================================
// Tailwind Config Extension
// ============================================================

const TAILWIND_EXTEND = `
// Add to tailwind.config.ts
const config = {
  theme: {
    extend: {
      animation: {
        'gradient': 'gradient 8s linear infinite',
        'float': 'float 6s ease-in-out infinite',
        'pulse-slow': 'pulse 4s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'shimmer': 'shimmer 2s linear infinite',
      },
      keyframes: {
        gradient: {
          '0%, 100%': { backgroundPosition: '0% 50%' },
          '50%': { backgroundPosition: '100% 50%' },
        },
        float: {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-20px)' },
        },
        shimmer: {
          '0%': { backgroundPosition: '-200% 0' },
          '100%': { backgroundPosition: '200% 0' },
        },
      },
      backgroundSize: {
        '300%': '300%',
      },
    },
  },
};
`;

// ============================================================
// Main
// ============================================================

async function main() {
  console.log('================================================');
  console.log('✨ Design System Setup');
  console.log('================================================\n');

  // Create directories
  mkdirSync(UI_DIR, { recursive: true });
  mkdirSync(EFFECTS_DIR, { recursive: true });

  // Generate components
  console.log('🧩 Generating design components...\n');
  
  for (const [name, content] of Object.entries(COMPONENTS)) {
    const filePath = join(EFFECTS_DIR, `${name}.tsx`);
    if (!existsSync(filePath)) {
      writeFileSync(filePath, content);
      console.log(`   ✅ ${name}.tsx`);
    } else {
      console.log(`   ⏭️  ${name}.tsx (exists)`);
    }
  }

  // Generate index
  const indexContent = Object.keys(COMPONENTS)
    .map(name => `export { ${name} } from './${name}';`)
    .join('\n') + '\n';
  writeFileSync(join(EFFECTS_DIR, 'index.ts'), indexContent);
  console.log(`   ✅ index.ts`);

  // Print install command
  console.log('\n📦 Install dependencies:\n');
  console.log(`cd website-unified && pnpm add ${DEPENDENCIES.join(' ')}`);

  console.log('\n📝 Add to tailwind.config.ts:');
  console.log(TAILWIND_EXTEND);

  console.log('\n================================================');
  console.log('✅ Design system components generated!');
  console.log('================================================');
}

main().catch(console.error);
