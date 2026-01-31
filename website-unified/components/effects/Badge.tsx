'use client';

import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';
import { X } from 'lucide-react';

// ============================================================
// Badge
// ============================================================

interface BadgeProps {
  children: React.ReactNode;
  variant?: 'default' | 'secondary' | 'success' | 'warning' | 'danger' | 'info' | 'gradient';
  size?: 'sm' | 'md' | 'lg';
  dot?: boolean;
  removable?: boolean;
  onRemove?: () => void;
  icon?: React.ReactNode;
  animated?: boolean;
  className?: string;
}

export function Badge({
  children,
  variant = 'default',
  size = 'md',
  dot = false,
  removable = false,
  onRemove,
  icon,
  animated = false,
  className,
}: BadgeProps) {
  const variants = {
    default: 'bg-white/10 text-white border-white/10',
    secondary: 'bg-purple-500/20 text-purple-400 border-purple-500/30',
    success: 'bg-green-500/20 text-green-400 border-green-500/30',
    warning: 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30',
    danger: 'bg-red-500/20 text-red-400 border-red-500/30',
    info: 'bg-blue-500/20 text-blue-400 border-blue-500/30',
    gradient: 'bg-gradient-to-r from-purple-500/20 to-pink-500/20 text-white border-purple-500/30',
  };

  const sizes = {
    sm: 'px-2 py-0.5 text-xs',
    md: 'px-2.5 py-1 text-xs',
    lg: 'px-3 py-1.5 text-sm',
  };

  const dotColors = {
    default: 'bg-white',
    secondary: 'bg-purple-400',
    success: 'bg-green-400',
    warning: 'bg-yellow-400',
    danger: 'bg-red-400',
    info: 'bg-blue-400',
    gradient: 'bg-pink-400',
  };

  const Component = animated ? motion.span : 'span';
  const animationProps = animated ? {
    initial: { scale: 0.9, opacity: 0 },
    animate: { scale: 1, opacity: 1 },
    exit: { scale: 0.9, opacity: 0 },
    whileHover: { scale: 1.05 },
  } : {};

  return (
    <Component
      className={cn(
        'inline-flex items-center gap-1.5 rounded-full border font-medium',
        variants[variant],
        sizes[size],
        className
      )}
      {...animationProps}
    >
      {dot && (
        <span className={cn('w-1.5 h-1.5 rounded-full', dotColors[variant])} />
      )}
      {icon}
      {children}
      {removable && (
        <button
          onClick={onRemove}
          className="ml-0.5 hover:bg-white/10 rounded-full p-0.5 transition-colors"
        >
          <X className="w-3 h-3" />
        </button>
      )}
    </Component>
  );
}

// ============================================================
// Status Badge (specialized for status)
// ============================================================

type StatusType = 'online' | 'offline' | 'idle' | 'busy' | 'pending' | 'success' | 'error';

interface StatusBadgeProps {
  status: StatusType;
  showDot?: boolean;
  className?: string;
}

export function StatusBadge({ status, showDot = true, className }: StatusBadgeProps) {
  const configs: Record<StatusType, { label: string; variant: BadgeProps['variant']; dotClass: string }> = {
    online: { label: 'Online', variant: 'success', dotClass: 'bg-green-400 animate-pulse' },
    offline: { label: 'Offline', variant: 'default', dotClass: 'bg-white/40' },
    idle: { label: 'Idle', variant: 'warning', dotClass: 'bg-yellow-400' },
    busy: { label: 'Busy', variant: 'danger', dotClass: 'bg-red-400' },
    pending: { label: 'Pending', variant: 'warning', dotClass: 'bg-yellow-400 animate-pulse' },
    success: { label: 'Success', variant: 'success', dotClass: 'bg-green-400' },
    error: { label: 'Error', variant: 'danger', dotClass: 'bg-red-400' },
  };

  const config = configs[status];

  return (
    <Badge variant={config.variant} className={className}>
      {showDot && <span className={cn('w-2 h-2 rounded-full', config.dotClass)} />}
      {config.label}
    </Badge>
  );
}

// ============================================================
// Counter Badge
// ============================================================

interface CounterBadgeProps {
  count: number;
  max?: number;
  variant?: BadgeProps['variant'];
  size?: BadgeProps['size'];
  className?: string;
}

export function CounterBadge({
  count,
  max = 99,
  variant = 'danger',
  size = 'sm',
  className,
}: CounterBadgeProps) {
  const displayCount = count > max ? `${max}+` : count;

  if (count === 0) return null;

  return (
    <Badge 
      variant={variant} 
      size={size}
      animated
      className={cn('min-w-[20px] justify-center', className)}
    >
      {displayCount}
    </Badge>
  );
}

// ============================================================
// Tag Input
// ============================================================

interface TagInputProps {
  tags: string[];
  onChange: (tags: string[]) => void;
  placeholder?: string;
  maxTags?: number;
  className?: string;
}

export function TagInput({
  tags,
  onChange,
  placeholder = 'Add tag...',
  maxTags = Infinity,
  className,
}: TagInputProps) {
  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    const input = e.currentTarget;
    const value = input.value.trim();

    if (e.key === 'Enter' && value && tags.length < maxTags && !tags.includes(value)) {
      e.preventDefault();
      onChange([...tags, value]);
      input.value = '';
    } else if (e.key === 'Backspace' && !value && tags.length > 0) {
      onChange(tags.slice(0, -1));
    }
  };

  const removeTag = (tag: string) => {
    onChange(tags.filter(t => t !== tag));
  };

  return (
    <div className={cn(
      'flex flex-wrap items-center gap-2 p-3 bg-white/5 border border-white/10 rounded-xl',
      'focus-within:ring-2 focus-within:ring-purple-500/50 focus-within:border-purple-500/50',
      className
    )}>
      {tags.map((tag) => (
        <Badge
          key={tag}
          variant="secondary"
          removable
          onRemove={() => removeTag(tag)}
          animated
        >
          {tag}
        </Badge>
      ))}
      <input
        type="text"
        placeholder={tags.length < maxTags ? placeholder : ''}
        disabled={tags.length >= maxTags}
        onKeyDown={handleKeyDown}
        className="flex-1 min-w-[120px] bg-transparent text-white placeholder:text-white/40 outline-none disabled:cursor-not-allowed"
      />
    </div>
  );
}

// ============================================================
// Chip Group (selectable badges)
// ============================================================

interface ChipOption {
  value: string;
  label: string;
  icon?: React.ReactNode;
}

interface ChipGroupProps {
  options: ChipOption[];
  value?: string | string[];
  onChange?: (value: string | string[]) => void;
  multiple?: boolean;
  className?: string;
}

export function ChipGroup({
  options,
  value = [],
  onChange,
  multiple = false,
  className,
}: ChipGroupProps) {
  const selectedValues = Array.isArray(value) ? value : [value];

  const handleSelect = (optionValue: string) => {
    if (multiple) {
      const newValues = selectedValues.includes(optionValue)
        ? selectedValues.filter(v => v !== optionValue)
        : [...selectedValues, optionValue];
      onChange?.(newValues);
    } else {
      onChange?.(optionValue);
    }
  };

  return (
    <div className={cn('flex flex-wrap gap-2', className)}>
      {options.map((option) => {
        const isSelected = selectedValues.includes(option.value);
        return (
          <motion.button
            key={option.value}
            onClick={() => handleSelect(option.value)}
            className={cn(
              'inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-sm font-medium border transition-colors',
              isSelected
                ? 'bg-purple-500/20 text-purple-400 border-purple-500/50'
                : 'bg-white/5 text-white/60 border-white/10 hover:bg-white/10 hover:text-white'
            )}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            {option.icon}
            {option.label}
          </motion.button>
        );
      })}
    </div>
  );
}
