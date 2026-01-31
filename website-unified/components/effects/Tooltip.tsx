'use client';

import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { cn } from '@/lib/utils';
import { createPortal } from 'react-dom';

// ============================================================
// Tooltip
// ============================================================

type TooltipPosition = 'top' | 'bottom' | 'left' | 'right';

interface TooltipProps {
  content: React.ReactNode;
  position?: TooltipPosition;
  delay?: number;
  offset?: number;
  className?: string;
  children: React.ReactNode;
}

export function Tooltip({
  content,
  position = 'top',
  delay = 200,
  offset = 8,
  className,
  children,
}: TooltipProps) {
  const [isVisible, setIsVisible] = useState(false);
  const [coords, setCoords] = useState({ x: 0, y: 0 });
  const triggerRef = useRef<HTMLDivElement>(null);
  const timeoutRef = useRef<NodeJS.Timeout>();

  const handleMouseEnter = () => {
    timeoutRef.current = setTimeout(() => {
      if (triggerRef.current) {
        const rect = triggerRef.current.getBoundingClientRect();
        let x = 0, y = 0;

        switch (position) {
          case 'top':
            x = rect.left + rect.width / 2;
            y = rect.top - offset;
            break;
          case 'bottom':
            x = rect.left + rect.width / 2;
            y = rect.bottom + offset;
            break;
          case 'left':
            x = rect.left - offset;
            y = rect.top + rect.height / 2;
            break;
          case 'right':
            x = rect.right + offset;
            y = rect.top + rect.height / 2;
            break;
        }

        setCoords({ x, y });
        setIsVisible(true);
      }
    }, delay);
  };

  const handleMouseLeave = () => {
    clearTimeout(timeoutRef.current);
    setIsVisible(false);
  };

  useEffect(() => {
    return () => clearTimeout(timeoutRef.current);
  }, []);

  const transformOrigin = {
    top: 'center bottom',
    bottom: 'center top',
    left: 'right center',
    right: 'left center',
  };

  const tooltipStyle: React.CSSProperties = {
    position: 'fixed',
    zIndex: 9999,
    ...(position === 'top' && { 
      left: coords.x, 
      top: coords.y, 
      transform: 'translate(-50%, -100%)' 
    }),
    ...(position === 'bottom' && { 
      left: coords.x, 
      top: coords.y, 
      transform: 'translate(-50%, 0)' 
    }),
    ...(position === 'left' && { 
      left: coords.x, 
      top: coords.y, 
      transform: 'translate(-100%, -50%)' 
    }),
    ...(position === 'right' && { 
      left: coords.x, 
      top: coords.y, 
      transform: 'translate(0, -50%)' 
    }),
  };

  return (
    <>
      <div
        ref={triggerRef}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
        className="inline-block"
      >
        {children}
      </div>

      {typeof window !== 'undefined' && createPortal(
        <AnimatePresence>
          {isVisible && (
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              transition={{ duration: 0.1 }}
              style={{ ...tooltipStyle, transformOrigin: transformOrigin[position] }}
              className={cn(
                'px-3 py-2 text-sm text-white bg-gray-900 rounded-lg shadow-xl border border-white/10',
                'max-w-xs backdrop-blur-xl',
                className
              )}
            >
              {content}
            </motion.div>
          )}
        </AnimatePresence>,
        document.body
      )}
    </>
  );
}

// ============================================================
// Info Tooltip (with icon)
// ============================================================

interface InfoTooltipProps {
  content: React.ReactNode;
  position?: TooltipPosition;
  iconClassName?: string;
}

export function InfoTooltip({ content, position = 'top', iconClassName }: InfoTooltipProps) {
  return (
    <Tooltip content={content} position={position}>
      <svg
        className={cn('w-4 h-4 text-white/40 hover:text-white/60 cursor-help transition-colors', iconClassName)}
        viewBox="0 0 24 24"
        fill="currentColor"
      >
        <path d="M12 22C6.477 22 2 17.523 2 12S6.477 2 12 2s10 4.477 10 10-4.477 10-10 10zm0-2a8 8 0 1 0 0-16 8 8 0 0 0 0 16zm-1-5h2v2h-2v-2zm2-1.645V14h-2v-1.5a1 1 0 0 1 1-1 1.5 1.5 0 1 0-1.471-1.794l-1.962-.393A3.501 3.501 0 1 1 13 13.355z" />
      </svg>
    </Tooltip>
  );
}

// ============================================================
// Popover
// ============================================================

interface PopoverProps {
  trigger: React.ReactNode;
  content: React.ReactNode;
  position?: TooltipPosition;
  offset?: number;
  className?: string;
}

export function Popover({
  trigger,
  content,
  position = 'bottom',
  offset = 8,
  className,
}: PopoverProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [coords, setCoords] = useState({ x: 0, y: 0 });
  const triggerRef = useRef<HTMLDivElement>(null);

  const updatePosition = () => {
    if (triggerRef.current) {
      const rect = triggerRef.current.getBoundingClientRect();
      let x = 0, y = 0;

      switch (position) {
        case 'top':
          x = rect.left + rect.width / 2;
          y = rect.top - offset;
          break;
        case 'bottom':
          x = rect.left + rect.width / 2;
          y = rect.bottom + offset;
          break;
        case 'left':
          x = rect.left - offset;
          y = rect.top + rect.height / 2;
          break;
        case 'right':
          x = rect.right + offset;
          y = rect.top + rect.height / 2;
          break;
      }

      setCoords({ x, y });
    }
  };

  const handleToggle = () => {
    if (!isOpen) {
      updatePosition();
    }
    setIsOpen(!isOpen);
  };

  const popoverStyle: React.CSSProperties = {
    position: 'fixed',
    zIndex: 9999,
    ...(position === 'top' && { 
      left: coords.x, 
      top: coords.y, 
      transform: 'translate(-50%, -100%)' 
    }),
    ...(position === 'bottom' && { 
      left: coords.x, 
      top: coords.y, 
      transform: 'translate(-50%, 0)' 
    }),
    ...(position === 'left' && { 
      left: coords.x, 
      top: coords.y, 
      transform: 'translate(-100%, -50%)' 
    }),
    ...(position === 'right' && { 
      left: coords.x, 
      top: coords.y, 
      transform: 'translate(0, -50%)' 
    }),
  };

  return (
    <>
      <div ref={triggerRef} onClick={handleToggle} className="inline-block cursor-pointer">
        {trigger}
      </div>

      {typeof window !== 'undefined' && createPortal(
        <AnimatePresence>
          {isOpen && (
            <>
              <div 
                className="fixed inset-0 z-[9998]" 
                onClick={() => setIsOpen(false)} 
              />
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                transition={{ duration: 0.15 }}
                style={popoverStyle}
                className={cn(
                  'bg-black/95 backdrop-blur-xl rounded-xl border border-white/10 shadow-2xl',
                  className
                )}
              >
                {content}
              </motion.div>
            </>
          )}
        </AnimatePresence>,
        document.body
      )}
    </>
  );
}
