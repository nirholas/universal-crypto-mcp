import React from 'react';

/**
 * W3AG Compliant Price Change Component
 * 
 * Conformance: Level AA
 * 
 * Success Criteria Met:
 * - 1.4.1: Color independence - uses symbols, not just color
 */

interface PriceChangeProps {
  value: number;
  showPercent?: boolean;
  showArrow?: boolean;
  className?: string;
}

export function PriceChange({
  value,
  showPercent = true,
  showArrow = true,
  className = '',
}: PriceChangeProps) {
  const isPositive = value >= 0;
  const absValue = Math.abs(value);
  
  // Generate accessible label
  const getAriaLabel = () => {
    const direction = isPositive ? 'up' : 'down';
    const amount = showPercent ? `${absValue.toFixed(2)} percent` : absValue.toFixed(2);
    return `${direction} ${amount}`;
  };

  return (
    <span
      className={`w3ag-price-change ${isPositive ? 'positive' : 'negative'} ${className}`}
      aria-label={getAriaLabel()}
    >
      {/* Arrow indicator - not just color */}
      {showArrow && (
        <span aria-hidden="true" className="arrow">
          {isPositive ? '▲' : '▼'}
        </span>
      )}
      
      {/* Value with sign */}
      <span className="value">
        {isPositive ? '+' : '-'}
        {absValue.toFixed(2)}
        {showPercent && '%'}
      </span>
    </span>
  );
}

/**
 * CSS:
 * 
 * .w3ag-price-change {
 *   display: inline-flex;
 *   align-items: center;
 *   gap: 0.25rem;
 *   font-weight: 500;
 * }
 * 
 * .w3ag-price-change.positive {
 *   color: var(--color-success, #16a34a);
 * }
 * 
 * .w3ag-price-change.negative {
 *   color: var(--color-error, #dc2626);
 * }
 * 
 * .w3ag-price-change .arrow {
 *   font-size: 0.75em;
 * }
 * 
 * // High contrast support
 * @media (prefers-contrast: more) {
 *   .w3ag-price-change.positive {
 *     color: #000;
 *     background: #90EE90;
 *     padding: 0.125rem 0.25rem;
 *   }
 *   
 *   .w3ag-price-change.negative {
 *     color: #000;
 *     background: #FFB6C1;
 *     padding: 0.125rem 0.25rem;
 *   }
 * }
 */

export default PriceChange;
