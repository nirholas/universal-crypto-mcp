'use client';

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
            style={{ left: `${sparkle.x}%`, top: `${sparkle.y}%` }}
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
