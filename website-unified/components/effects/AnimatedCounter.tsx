'use client';

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
