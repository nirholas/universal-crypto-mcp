/**
 * UI Component Layer
 * 
 * Re-exports from shadcn/ui and Radix primitives.
 * 
 * Reference: /vendor/ui/
 */

// This module would re-export from @radix-ui/* and shadcn components
// For now, export types and utilities

export interface ButtonProps {
  variant?: 'default' | 'destructive' | 'outline' | 'secondary' | 'ghost' | 'link';
  size?: 'default' | 'sm' | 'lg' | 'icon';
  children: React.ReactNode;
  onClick?: () => void;
  disabled?: boolean;
  className?: string;
}

export interface CardProps {
  children: React.ReactNode;
  className?: string;
}

export interface InputProps {
  type?: string;
  placeholder?: string;
  value?: string;
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
  className?: string;
}

// Component type definitions for shadcn/ui compatibility
export type { ButtonProps as UCMButtonProps };
export type { CardProps as UCMCardProps };
export type { InputProps as UCMInputProps };
