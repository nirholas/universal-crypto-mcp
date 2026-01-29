import React, { useState, useCallback } from 'react';

/**
 * W3AG Compliant Address Display Component
 * 
 * Conformance: Level AA
 * 
 * Success Criteria Met:
 * - 1.1.1: Text alternative via ENS name or aria-label
 * - 1.1.3: Screen reader announces in digestible chunks
 * - 2.1.1: Copy button is keyboard accessible
 * - 4.1.2: Dynamic copy confirmation is announced
 */

interface AddressDisplayProps {
  /** The full Ethereum address */
  address: `0x${string}`;
  /** Optional ENS name to display instead */
  ensName?: string;
  /** Whether to show the copy button */
  showCopyButton?: boolean;
  /** Number of characters to show at start/end when truncating */
  truncateLength?: number;
  /** Additional CSS classes */
  className?: string;
}

export function AddressDisplay({
  address,
  ensName,
  showCopyButton = true,
  truncateLength = 6,
  className = '',
}: AddressDisplayProps) {
  const [copied, setCopied] = useState(false);
  const [announcement, setAnnouncement] = useState('');

  // Format address for screen readers: chunk into groups of 4
  const formatAddressForScreenReader = (addr: string): string => {
    // Remove 0x prefix, chunk remaining into groups of 4
    const withoutPrefix = addr.slice(2);
    const chunks = withoutPrefix.match(/.{1,4}/g) || [];
    return `0x ${chunks.join(' ')}`;
  };

  // Truncate address for visual display
  const truncateAddress = (addr: string): string => {
    if (addr.length <= truncateLength * 2 + 2) return addr;
    return `${addr.slice(0, truncateLength + 2)}...${addr.slice(-truncateLength)}`;
  };

  const handleCopy = useCallback(async () => {
    try {
      await navigator.clipboard.writeText(address);
      setCopied(true);
      setAnnouncement('Address copied to clipboard');
      
      // Reset after 2 seconds
      setTimeout(() => {
        setCopied(false);
        setAnnouncement('');
      }, 2000);
    } catch (err) {
      setAnnouncement('Failed to copy address');
    }
  }, [address]);

  const handleKeyDown = useCallback((e: React.KeyboardEvent) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      handleCopy();
    }
  }, [handleCopy]);

  const displayText = ensName || truncateAddress(address);
  const screenReaderText = ensName 
    ? `${ensName}, address: ${formatAddressForScreenReader(address)}`
    : formatAddressForScreenReader(address);

  return (
    <div className={`w3ag-address-display ${className}`}>
      {/* Screen reader announcement for copy action */}
      <div 
        role="status" 
        aria-live="polite" 
        aria-atomic="true"
        className="sr-only"
      >
        {announcement}
      </div>

      {/* Address display */}
      <span
        className="w3ag-address-text"
        // Visual users see truncated, screen readers get full chunked address
        aria-label={screenReaderText}
      >
        {displayText}
      </span>

      {/* Copy button */}
      {showCopyButton && (
        <button
          type="button"
          onClick={handleCopy}
          onKeyDown={handleKeyDown}
          className="w3ag-copy-button"
          aria-label={copied ? 'Copied!' : 'Copy address to clipboard'}
          // Prevent double-announcing the status
          aria-describedby={undefined}
        >
          {copied ? (
            <CheckIcon aria-hidden="true" />
          ) : (
            <CopyIcon aria-hidden="true" />
          )}
        </button>
      )}

      {/* Tooltip with full address (optional, for visual users) */}
      <span className="w3ag-address-tooltip" role="tooltip" aria-hidden="true">
        {address}
      </span>
    </div>
  );
}

// Simple icon components
function CopyIcon({ className = '' }: { className?: string }) {
  return (
    <svg 
      className={className} 
      width="16" 
      height="16" 
      viewBox="0 0 24 24" 
      fill="none" 
      stroke="currentColor" 
      strokeWidth="2"
      aria-hidden="true"
    >
      <rect x="9" y="9" width="13" height="13" rx="2" ry="2" />
      <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1" />
    </svg>
  );
}

function CheckIcon({ className = '' }: { className?: string }) {
  return (
    <svg 
      className={className} 
      width="16" 
      height="16" 
      viewBox="0 0 24 24" 
      fill="none" 
      stroke="currentColor" 
      strokeWidth="2"
      aria-hidden="true"
    >
      <polyline points="20 6 9 17 4 12" />
    </svg>
  );
}

/**
 * CSS (add to your stylesheet):
 * 
 * .w3ag-address-display {
 *   display: inline-flex;
 *   align-items: center;
 *   gap: 0.5rem;
 *   position: relative;
 * }
 * 
 * .w3ag-address-text {
 *   font-family: monospace;
 * }
 * 
 * .w3ag-copy-button {
 *   padding: 0.25rem;
 *   border: none;
 *   background: transparent;
 *   cursor: pointer;
 *   border-radius: 4px;
 * }
 * 
 * .w3ag-copy-button:hover,
 * .w3ag-copy-button:focus-visible {
 *   background: rgba(0, 0, 0, 0.1);
 *   outline: 2px solid currentColor;
 *   outline-offset: 2px;
 * }
 * 
 * .w3ag-address-tooltip {
 *   display: none;
 *   position: absolute;
 *   // ... tooltip styles
 * }
 * 
 * .w3ag-address-display:hover .w3ag-address-tooltip,
 * .w3ag-address-display:focus-within .w3ag-address-tooltip {
 *   display: block;
 * }
 * 
 * // Tailwind utility class for screen-reader-only content
 * .sr-only {
 *   position: absolute;
 *   width: 1px;
 *   height: 1px;
 *   padding: 0;
 *   margin: -1px;
 *   overflow: hidden;
 *   clip: rect(0, 0, 0, 0);
 *   white-space: nowrap;
 *   border-width: 0;
 * }
 */

export default AddressDisplay;
