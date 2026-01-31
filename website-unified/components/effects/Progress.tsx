'use client';

import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';

// ============================================================
// Linear Progress Bar
// ============================================================

interface ProgressBarProps {
  value: number;
  max?: number;
  label?: string;
  showValue?: boolean;
  formatValue?: (value: number, max: number) => string;
  size?: 'sm' | 'md' | 'lg';
  variant?: 'default' | 'gradient' | 'striped' | 'success' | 'warning' | 'danger';
  animated?: boolean;
  className?: string;
}

export function ProgressBar({
  value,
  max = 100,
  label,
  showValue = true,
  formatValue = (v, m) => `${Math.round((v / m) * 100)}%`,
  size = 'md',
  variant = 'gradient',
  animated = true,
  className,
}: ProgressBarProps) {
  const percentage = Math.min(100, Math.max(0, (value / max) * 100));

  const sizes = {
    sm: 'h-1',
    md: 'h-2',
    lg: 'h-3',
  };

  const variants = {
    default: 'bg-purple-500',
    gradient: 'bg-gradient-to-r from-purple-500 to-pink-500',
    striped: 'bg-purple-500 bg-stripes',
    success: 'bg-green-500',
    warning: 'bg-yellow-500',
    danger: 'bg-red-500',
  };

  return (
    <div className={cn('space-y-2', className)}>
      {(label || showValue) && (
        <div className="flex justify-between items-center text-sm">
          {label && <span className="text-white/70">{label}</span>}
          {showValue && <span className="text-white/60">{formatValue(value, max)}</span>}
        </div>
      )}
      <div className={cn('w-full bg-white/10 rounded-full overflow-hidden', sizes[size])}>
        <motion.div
          className={cn('h-full rounded-full', variants[variant])}
          initial={{ width: 0 }}
          animate={{ width: `${percentage}%` }}
          transition={{ duration: animated ? 0.5 : 0, ease: 'easeOut' }}
        />
      </div>
    </div>
  );
}

// ============================================================
// Circular Progress
// ============================================================

interface CircularProgressProps {
  value: number;
  max?: number;
  size?: number;
  strokeWidth?: number;
  label?: string;
  showValue?: boolean;
  formatValue?: (value: number) => string;
  variant?: 'default' | 'gradient' | 'success' | 'warning' | 'danger';
  className?: string;
}

export function CircularProgress({
  value,
  max = 100,
  size = 100,
  strokeWidth = 8,
  label,
  showValue = true,
  formatValue = (v) => `${Math.round(v)}%`,
  variant = 'gradient',
  className,
}: CircularProgressProps) {
  const percentage = Math.min(100, Math.max(0, (value / max) * 100));
  const radius = (size - strokeWidth) / 2;
  const circumference = radius * 2 * Math.PI;
  const offset = circumference - (percentage / 100) * circumference;

  const gradientId = `circular-gradient-${Math.random().toString(36).slice(2)}`;

  const colors = {
    default: '#8b5cf6',
    gradient: `url(#${gradientId})`,
    success: '#22c55e',
    warning: '#eab308',
    danger: '#ef4444',
  };

  return (
    <div className={cn('relative inline-flex flex-col items-center', className)}>
      <svg width={size} height={size} className="-rotate-90">
        {variant === 'gradient' && (
          <defs>
            <linearGradient id={gradientId} x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#8b5cf6" />
              <stop offset="100%" stopColor="#ec4899" />
            </linearGradient>
          </defs>
        )}
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke="rgba(255,255,255,0.1)"
          strokeWidth={strokeWidth}
        />
        <motion.circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke={colors[variant]}
          strokeWidth={strokeWidth}
          strokeLinecap="round"
          strokeDasharray={circumference}
          initial={{ strokeDashoffset: circumference }}
          animate={{ strokeDashoffset: offset }}
          transition={{ duration: 0.5, ease: 'easeOut' }}
        />
      </svg>
      {showValue && (
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <span className="text-xl font-bold text-white">
            {formatValue(percentage)}
          </span>
          {label && <span className="text-xs text-white/60">{label}</span>}
        </div>
      )}
    </div>
  );
}

// ============================================================
// Step Progress
// ============================================================

interface Step {
  label: string;
  description?: string;
}

interface StepProgressProps {
  steps: Step[];
  currentStep: number;
  orientation?: 'horizontal' | 'vertical';
  className?: string;
}

export function StepProgress({
  steps,
  currentStep,
  orientation = 'horizontal',
  className,
}: StepProgressProps) {
  return (
    <div className={cn(
      'flex',
      orientation === 'vertical' ? 'flex-col' : 'flex-row items-center',
      className
    )}>
      {steps.map((step, index) => {
        const isCompleted = index < currentStep;
        const isCurrent = index === currentStep;
        const isLast = index === steps.length - 1;

        return (
          <div
            key={index}
            className={cn(
              'flex',
              orientation === 'vertical' ? 'flex-row gap-4' : 'flex-col items-center flex-1'
            )}
          >
            <div className={cn(
              'flex',
              orientation === 'vertical' ? 'flex-col items-center' : 'flex-row items-center w-full'
            )}>
              {/* Step circle */}
              <motion.div
                className={cn(
                  'w-10 h-10 rounded-full flex items-center justify-center font-semibold border-2 transition-colors',
                  isCompleted && 'bg-purple-500 border-purple-500 text-white',
                  isCurrent && 'border-purple-500 text-purple-400 bg-purple-500/20',
                  !isCompleted && !isCurrent && 'border-white/20 text-white/40'
                )}
                initial={false}
                animate={{
                  scale: isCurrent ? 1.1 : 1,
                }}
              >
                {isCompleted ? (
                  <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                ) : (
                  index + 1
                )}
              </motion.div>

              {/* Connector line */}
              {!isLast && (
                <div className={cn(
                  'transition-colors',
                  orientation === 'vertical' ? 'w-0.5 h-8' : 'h-0.5 flex-1 mx-2',
                  isCompleted ? 'bg-purple-500' : 'bg-white/10'
                )} />
              )}
            </div>

            {/* Label */}
            <div className={cn(
              orientation === 'vertical' ? 'flex-1' : 'text-center mt-2'
            )}>
              <p className={cn(
                'text-sm font-medium',
                isCurrent || isCompleted ? 'text-white' : 'text-white/40'
              )}>
                {step.label}
              </p>
              {step.description && (
                <p className="text-xs text-white/40 mt-0.5">{step.description}</p>
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
}

// ============================================================
// Loading Spinner
// ============================================================

interface SpinnerProps {
  size?: 'sm' | 'md' | 'lg' | 'xl';
  className?: string;
}

export function Spinner({ size = 'md', className }: SpinnerProps) {
  const sizes = {
    sm: 'w-4 h-4',
    md: 'w-6 h-6',
    lg: 'w-8 h-8',
    xl: 'w-12 h-12',
  };

  return (
    <svg
      className={cn('animate-spin', sizes[size], className)}
      viewBox="0 0 24 24"
      fill="none"
    >
      <circle
        cx="12"
        cy="12"
        r="10"
        stroke="currentColor"
        strokeWidth="3"
        strokeOpacity="0.2"
      />
      <path
        d="M12 2a10 10 0 0 1 10 10"
        stroke="currentColor"
        strokeWidth="3"
        strokeLinecap="round"
      />
    </svg>
  );
}

// ============================================================
// Pulse Loader
// ============================================================

interface PulseLoaderProps {
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

export function PulseLoader({ size = 'md', className }: PulseLoaderProps) {
  const sizes = {
    sm: 'w-2 h-2',
    md: 'w-3 h-3',
    lg: 'w-4 h-4',
  };

  return (
    <div className={cn('flex items-center gap-1', className)}>
      {[0, 1, 2].map((i) => (
        <motion.div
          key={i}
          className={cn('rounded-full bg-purple-500', sizes[size])}
          animate={{
            scale: [1, 1.2, 1],
            opacity: [1, 0.5, 1],
          }}
          transition={{
            duration: 0.6,
            repeat: Infinity,
            delay: i * 0.15,
          }}
        />
      ))}
    </div>
  );
}

// ============================================================
// Skeleton Loader
// ============================================================

interface SkeletonLoaderProps {
  width?: string | number;
  height?: string | number;
  rounded?: 'none' | 'sm' | 'md' | 'lg' | 'full';
  className?: string;
}

export function SkeletonLoader({
  width = '100%',
  height = '20px',
  rounded = 'md',
  className,
}: SkeletonLoaderProps) {
  const roundedClasses = {
    none: 'rounded-none',
    sm: 'rounded',
    md: 'rounded-lg',
    lg: 'rounded-xl',
    full: 'rounded-full',
  };

  return (
    <div
      className={cn(
        'bg-white/10 animate-pulse',
        roundedClasses[rounded],
        className
      )}
      style={{ width, height }}
    />
  );
}
