'use client'

import * as React from 'react'

interface BadgeProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: 'default' | 'outline' | 'secondary'
}

export function Badge({
  className = '',
  variant = 'default',
  ...props
}: BadgeProps) {
  const variants = {
    default: 'bg-brand-100 text-brand-700 border-brand-200',
    outline: 'border-gray-300 text-gray-700',
    secondary: 'bg-gray-100 text-gray-700 border-gray-200',
  }

  return (
    <div
      className={`inline-flex items-center rounded-full border px-3 py-1 text-xs font-semibold transition-colors ${variants[variant]} ${className}`}
      {...props}
    />
  )
}
