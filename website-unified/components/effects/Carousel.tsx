'use client';

import { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { cn } from '@/lib/utils';
import { ChevronLeft, ChevronRight } from 'lucide-react';

// ============================================================
// Image Carousel
// ============================================================

interface CarouselItem {
  id: string | number;
  content: React.ReactNode;
}

interface CarouselProps {
  items: CarouselItem[];
  autoPlay?: boolean;
  interval?: number;
  showDots?: boolean;
  showArrows?: boolean;
  className?: string;
}

export function Carousel({
  items,
  autoPlay = false,
  interval = 5000,
  showDots = true,
  showArrows = true,
  className,
}: CarouselProps) {
  const [current, setCurrent] = useState(0);
  const [direction, setDirection] = useState(0);

  const goTo = useCallback((index: number) => {
    setDirection(index > current ? 1 : -1);
    setCurrent(index);
  }, [current]);

  const next = useCallback(() => {
    setDirection(1);
    setCurrent((prev) => (prev + 1) % items.length);
  }, [items.length]);

  const prev = useCallback(() => {
    setDirection(-1);
    setCurrent((prev) => (prev - 1 + items.length) % items.length);
  }, [items.length]);

  useEffect(() => {
    if (!autoPlay) return;
    const timer = setInterval(next, interval);
    return () => clearInterval(timer);
  }, [autoPlay, interval, next]);

  const variants = {
    enter: (dir: number) => ({
      x: dir > 0 ? '100%' : '-100%',
      opacity: 0,
    }),
    center: {
      x: 0,
      opacity: 1,
    },
    exit: (dir: number) => ({
      x: dir > 0 ? '-100%' : '100%',
      opacity: 0,
    }),
  };

  return (
    <div className={cn('relative overflow-hidden rounded-2xl', className)}>
      <div className="relative aspect-video">
        <AnimatePresence initial={false} custom={direction} mode="popLayout">
          <motion.div
            key={current}
            custom={direction}
            variants={variants}
            initial="enter"
            animate="center"
            exit="exit"
            transition={{ type: 'spring', stiffness: 300, damping: 30 }}
            className="absolute inset-0"
          >
            {items[current].content}
          </motion.div>
        </AnimatePresence>
      </div>

      {showArrows && (
        <>
          <button
            onClick={prev}
            className="absolute left-4 top-1/2 -translate-y-1/2 p-2 rounded-full bg-black/50 hover:bg-black/70 text-white transition-colors backdrop-blur-sm"
          >
            <ChevronLeft className="w-6 h-6" />
          </button>
          <button
            onClick={next}
            className="absolute right-4 top-1/2 -translate-y-1/2 p-2 rounded-full bg-black/50 hover:bg-black/70 text-white transition-colors backdrop-blur-sm"
          >
            <ChevronRight className="w-6 h-6" />
          </button>
        </>
      )}

      {showDots && (
        <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2">
          {items.map((_, i) => (
            <button
              key={i}
              onClick={() => goTo(i)}
              className={cn(
                'w-2 h-2 rounded-full transition-all',
                i === current ? 'bg-white w-6' : 'bg-white/40 hover:bg-white/60'
              )}
            />
          ))}
        </div>
      )}
    </div>
  );
}

// ============================================================
// Card Slider (horizontal scroll)
// ============================================================

interface CardSliderProps {
  children: React.ReactNode;
  showArrows?: boolean;
  gap?: number;
  className?: string;
}

export function CardSlider({
  children,
  showArrows = true,
  gap = 16,
  className,
}: CardSliderProps) {
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(true);
  const [scrollContainer, setScrollContainer] = useState<HTMLDivElement | null>(null);

  const checkScroll = useCallback(() => {
    if (!scrollContainer) return;
    setCanScrollLeft(scrollContainer.scrollLeft > 0);
    setCanScrollRight(
      scrollContainer.scrollLeft < scrollContainer.scrollWidth - scrollContainer.clientWidth - 1
    );
  }, [scrollContainer]);

  useEffect(() => {
    if (!scrollContainer) return;
    checkScroll();
    scrollContainer.addEventListener('scroll', checkScroll);
    window.addEventListener('resize', checkScroll);
    return () => {
      scrollContainer.removeEventListener('scroll', checkScroll);
      window.removeEventListener('resize', checkScroll);
    };
  }, [scrollContainer, checkScroll]);

  const scroll = (direction: 'left' | 'right') => {
    if (!scrollContainer) return;
    const amount = scrollContainer.clientWidth * 0.8;
    scrollContainer.scrollBy({
      left: direction === 'left' ? -amount : amount,
      behavior: 'smooth',
    });
  };

  return (
    <div className={cn('relative group', className)}>
      <div
        ref={setScrollContainer}
        className="flex overflow-x-auto scrollbar-hide scroll-smooth"
        style={{ gap }}
      >
        {children}
      </div>

      {showArrows && (
        <>
          <button
            onClick={() => scroll('left')}
            className={cn(
              'absolute left-0 top-1/2 -translate-y-1/2 -translate-x-4 p-3 rounded-full',
              'bg-black/80 hover:bg-black text-white shadow-xl backdrop-blur-sm',
              'transition-all opacity-0 group-hover:opacity-100 group-hover:translate-x-0',
              !canScrollLeft && 'hidden'
            )}
          >
            <ChevronLeft className="w-5 h-5" />
          </button>
          <button
            onClick={() => scroll('right')}
            className={cn(
              'absolute right-0 top-1/2 -translate-y-1/2 translate-x-4 p-3 rounded-full',
              'bg-black/80 hover:bg-black text-white shadow-xl backdrop-blur-sm',
              'transition-all opacity-0 group-hover:opacity-100 group-hover:translate-x-0',
              !canScrollRight && 'hidden'
            )}
          >
            <ChevronRight className="w-5 h-5" />
          </button>
        </>
      )}

      {/* Fade edges */}
      <div className={cn(
        'absolute left-0 top-0 bottom-0 w-12 bg-gradient-to-r from-black/80 to-transparent pointer-events-none',
        !canScrollLeft && 'opacity-0'
      )} />
      <div className={cn(
        'absolute right-0 top-0 bottom-0 w-12 bg-gradient-to-l from-black/80 to-transparent pointer-events-none',
        !canScrollRight && 'opacity-0'
      )} />
    </div>
  );
}

// ============================================================
// Infinite Marquee
// ============================================================

interface MarqueeProps {
  children: React.ReactNode;
  speed?: number;
  direction?: 'left' | 'right';
  pauseOnHover?: boolean;
  gap?: number;
  className?: string;
}

export function Marquee({
  children,
  speed = 30,
  direction = 'left',
  pauseOnHover = true,
  gap = 32,
  className,
}: MarqueeProps) {
  return (
    <div 
      className={cn('relative overflow-hidden group', className)}
      style={{ ['--gap' as string]: `${gap}px` }}
    >
      <motion.div
        className="flex w-max"
        animate={{ x: direction === 'left' ? '-50%' : '0%' }}
        transition={{
          x: {
            repeat: Infinity,
            repeatType: 'loop',
            duration: speed,
            ease: 'linear',
          },
        }}
        style={{
          gap,
          animationPlayState: pauseOnHover ? undefined : 'running',
        }}
        whileHover={pauseOnHover ? { animationPlayState: 'paused' } : undefined}
      >
        {children}
        {children}
      </motion.div>
    </div>
  );
}

// ============================================================
// Logo Cloud
// ============================================================

interface Logo {
  name: string;
  src: string;
}

interface LogoCloudProps {
  logos: Logo[];
  animated?: boolean;
  className?: string;
}

export function LogoCloud({ logos, animated = true, className }: LogoCloudProps) {
  if (animated) {
    return (
      <Marquee speed={40} className={className}>
        {logos.map((logo, i) => (
          <div
            key={i}
            className="flex items-center justify-center h-12 px-8 grayscale hover:grayscale-0 transition-all"
          >
            <img
              src={logo.src}
              alt={logo.name}
              className="h-full w-auto object-contain"
            />
          </div>
        ))}
      </Marquee>
    );
  }

  return (
    <div className={cn('flex flex-wrap items-center justify-center gap-8', className)}>
      {logos.map((logo, i) => (
        <motion.div
          key={i}
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ delay: i * 0.1 }}
          className="flex items-center justify-center h-12 px-4 grayscale hover:grayscale-0 transition-all"
        >
          <img
            src={logo.src}
            alt={logo.name}
            className="h-full w-auto object-contain"
          />
        </motion.div>
      ))}
    </div>
  );
}
