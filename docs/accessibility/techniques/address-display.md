# Technique: Accessible Address Display

**W3AG Guidelines**: 1.1.1, 1.1.2, 1.1.3, 1.1.4  
**Conformance Level**: AA  
**Last Updated**: 2024-12-29

---

## Problem Statement

Ethereum addresses are 42-character hexadecimal strings (e.g., `0x742d35Cc6634C0532925a3b844Bc9e7595f`). These create severe accessibility barriers:

### For Screen Reader Users
- **Unlistenable**: Hearing "zero x seven four two d three five c c six six three four..." for 40+ characters is cognitively impossible
- **No context**: Raw addresses provide no semantic meaning about who/what the address represents
- **Verification impossible**: Users cannot verify addresses character-by-character when spoken as a continuous string

### For Users with Cognitive Disabilities
- **Pattern recognition**: Hexadecimal is not human-readable; no memory hooks
- **Comparison difficulty**: Comparing two addresses to verify correctness is extremely error-prone
- **Scam vulnerability**: Attackers exploit address confusion (similar-looking addresses)

### For Users with Motor Impairments
- **Copy errors**: Selecting exact text is difficult; partial copies cause fund loss
- **Verification fatigue**: Re-checking addresses manually is exhausting

### For Users with Low Vision
- **Monospace fonts**: Long hex strings blur together
- **Similar characters**: 0/O, 1/l/I, 8/B are easily confused

---

## Solution Pattern

### Core Principles

1. **Always provide human-readable alternatives** (ENS, labels, nicknames)
2. **Chunk addresses for screen readers** (groups of 4 characters)
3. **Validate addresses programmatically** and communicate state accessibly
4. **One-click copy** with confirmation announcement
5. **Progressive disclosure**: Show truncated first, full on demand

### Visual Design

```
┌─────────────────────────────────────────────────────────┐
│  [Avatar] vitalik.eth                          [Copy]   │
│           0x742d...95f                                  │
│           ✓ Valid address                               │
└─────────────────────────────────────────────────────────┘

Screen reader announces:
"vitalik.eth, address: 0x 742d 35Cc 6634 C053 2925 a3b8 44Bc 9e75 95f, 
 valid address. Copy button."
```

---

## Implementation

### Full React Component

```tsx
import React, { useState, useCallback, useMemo } from 'react';
import { useEnsName } from 'wagmi';
import { isAddress, getAddress } from 'viem';

/**
 * W3AG Compliant Address Display
 * 
 * Conformance: Level AA
 * Guidelines: 1.1.1, 1.1.2, 1.1.3, 4.1.2
 */

interface AddressDisplayProps {
  /** Ethereum address to display */
  address: `0x${string}`;
  /** Custom label to show instead of ENS */
  label?: string;
  /** Show full address instead of truncated */
  showFull?: boolean;
  /** Number of characters at start/end when truncating */
  truncateLength?: number;
  /** Show copy button */
  showCopy?: boolean;
  /** Show validation status */
  showValidation?: boolean;
  /** Size variant */
  size?: 'sm' | 'md' | 'lg';
  /** Chain ID for ENS resolution */
  chainId?: number;
  /** Additional CSS class */
  className?: string;
}

export function AddressDisplay({
  address,
  label,
  showFull = false,
  truncateLength = 6,
  showCopy = true,
  showValidation = true,
  size = 'md',
  chainId = 1,
  className = '',
}: AddressDisplayProps) {
  const [copied, setCopied] = useState(false);
  const [announcement, setAnnouncement] = useState('');
  const [isExpanded, setIsExpanded] = useState(showFull);

  // Resolve ENS name (only on mainnet)
  const { data: ensName } = useEnsName({
    address,
    chainId: 1, // ENS only on mainnet
  });

  // Validate address and get checksummed version
  const validation = useMemo(() => {
    if (!address) return { isValid: false, checksummed: null };
    
    try {
      const checksummed = getAddress(address);
      return { isValid: true, checksummed };
    } catch {
      return { isValid: false, checksummed: null };
    }
  }, [address]);

  // Format address for screen readers: chunk into groups of 4
  const formatForScreenReader = useCallback((addr: string): string => {
    if (!addr) return '';
    const withoutPrefix = addr.slice(2);
    const chunks = withoutPrefix.match(/.{1,4}/g) || [];
    return `0x ${chunks.join(' ')}`;
  }, []);

  // Truncate address for visual display
  const truncateAddress = useCallback((addr: string): string => {
    if (!addr || addr.length <= truncateLength * 2 + 4) return addr;
    return `${addr.slice(0, truncateLength + 2)}...${addr.slice(-truncateLength)}`;
  }, [truncateLength]);

  // Copy handler with announcement
  const handleCopy = useCallback(async () => {
    try {
      await navigator.clipboard.writeText(
        validation.checksummed || address
      );
      setCopied(true);
      setAnnouncement('Address copied to clipboard');
      
      setTimeout(() => {
        setCopied(false);
        setAnnouncement('');
      }, 2000);
    } catch (err) {
      setAnnouncement('Failed to copy address');
      setTimeout(() => setAnnouncement(''), 2000);
    }
  }, [address, validation.checksummed]);

  // Toggle expanded state
  const toggleExpanded = useCallback(() => {
    setIsExpanded(prev => !prev);
    setAnnouncement(
      isExpanded 
        ? 'Address collapsed' 
        : `Full address: ${formatForScreenReader(address)}`
    );
  }, [isExpanded, address, formatForScreenReader]);

  // Determine display text
  const displayName = label || ensName;
  const displayAddress = isExpanded 
    ? (validation.checksummed || address)
    : truncateAddress(validation.checksummed || address);

  // Build screen reader label
  const screenReaderLabel = useMemo(() => {
    const parts: string[] = [];
    
    if (displayName) {
      parts.push(displayName);
      parts.push('address:');
    }
    
    parts.push(formatForScreenReader(address));
    
    if (showValidation) {
      parts.push(validation.isValid ? 'valid address' : 'invalid address');
    }
    
    return parts.join(', ');
  }, [displayName, address, validation.isValid, showValidation, formatForScreenReader]);

  // Size classes
  const sizeClasses = {
    sm: 'text-sm',
    md: 'text-base',
    lg: 'text-lg',
  };

  return (
    <div 
      className={`w3ag-address inline-flex items-center gap-2 ${sizeClasses[size]} ${className}`}
    >
      {/* Live region for announcements */}
      <div 
        role="status" 
        aria-live="polite" 
        aria-atomic="true"
        className="sr-only"
      >
        {announcement}
      </div>

      {/* Main address display */}
      <div className="flex flex-col">
        {/* Primary display (ENS/label or address) */}
        {displayName ? (
          <>
            <span 
              className="font-medium"
              aria-hidden="true"
            >
              {displayName}
            </span>
            <button
              onClick={toggleExpanded}
              className="text-gray-500 hover:text-gray-700 text-left font-mono"
              aria-label={screenReaderLabel}
              aria-expanded={isExpanded}
            >
              {displayAddress}
            </button>
          </>
        ) : (
          <button
            onClick={toggleExpanded}
            className="font-mono hover:text-blue-600"
            aria-label={screenReaderLabel}
            aria-expanded={isExpanded}
          >
            {displayAddress}
          </button>
        )}

        {/* Validation indicator */}
        {showValidation && (
          <span 
            className={`text-xs flex items-center gap-1 ${
              validation.isValid ? 'text-green-600' : 'text-red-600'
            }`}
            aria-hidden="true" // Already in screenReaderLabel
          >
            {validation.isValid ? (
              <>
                <CheckIcon className="w-3 h-3" />
                Valid address
              </>
            ) : (
              <>
                <XIcon className="w-3 h-3" />
                Invalid checksum
              </>
            )}
          </span>
        )}
      </div>

      {/* Copy button */}
      {showCopy && (
        <button
          onClick={handleCopy}
          className={`p-2 rounded-md transition-colors ${
            copied 
              ? 'bg-green-100 text-green-700' 
              : 'bg-gray-100 hover:bg-gray-200 text-gray-700'
          }`}
          aria-label={copied ? 'Copied' : 'Copy address to clipboard'}
        >
          {copied ? (
            <CheckIcon className="w-4 h-4" />
          ) : (
            <CopyIcon className="w-4 h-4" />
          )}
        </button>
      )}
    </div>
  );
}

// Simple icon components
function CopyIcon({ className }: { className?: string }) {
  return (
    <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} 
        d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
    </svg>
  );
}

function CheckIcon({ className }: { className?: string }) {
  return (
    <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
    </svg>
  );
}

function XIcon({ className }: { className?: string }) {
  return (
    <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
    </svg>
  );
}
```

### Usage Examples

```tsx
// Basic usage
<AddressDisplay address="0x742d35Cc6634C0532925a3b844Bc9e7595f" />

// With custom label
<AddressDisplay 
  address="0x742d35Cc6634C0532925a3b844Bc9e7595f"
  label="Treasury Wallet"
/>

// Full address display
<AddressDisplay 
  address="0x742d35Cc6634C0532925a3b844Bc9e7595f"
  showFull={true}
  showValidation={true}
/>

// Compact for tables
<AddressDisplay 
  address="0x742d35Cc6634C0532925a3b844Bc9e7595f"
  size="sm"
  showCopy={false}
  showValidation={false}
/>
```

---

## Utility Functions

### Address Formatting

```tsx
/**
 * Format an address for screen reader announcement
 * Chunks into groups of 4 for digestible listening
 */
export function formatAddressForSR(address: string): string {
  if (!address || !address.startsWith('0x')) return address;
  
  const withoutPrefix = address.slice(2);
  const chunks = withoutPrefix.match(/.{1,4}/g) || [];
  return `0x ${chunks.join(' ')}`;
}

/**
 * Truncate address for visual display
 * Default: 0x742d...95f (6 chars each side)
 */
export function truncateAddress(
  address: string, 
  startChars = 6, 
  endChars = 4
): string {
  if (!address) return '';
  if (address.length <= startChars + endChars + 4) return address;
  
  return `${address.slice(0, startChars + 2)}...${address.slice(-endChars)}`;
}

/**
 * Validate and checksum an address
 * Returns null if invalid
 */
export function validateAddress(address: string): string | null {
  try {
    return getAddress(address);
  } catch {
    return null;
  }
}

/**
 * Compare two addresses (case-insensitive)
 */
export function addressesEqual(a: string, b: string): boolean {
  if (!a || !b) return false;
  return a.toLowerCase() === b.toLowerCase();
}
```

### Address Book Integration

```tsx
import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface AddressBookEntry {
  address: string;
  label: string;
  createdAt: number;
}

interface AddressBookStore {
  entries: AddressBookEntry[];
  addEntry: (address: string, label: string) => void;
  removeEntry: (address: string) => void;
  getLabel: (address: string) => string | undefined;
}

export const useAddressBook = create<AddressBookStore>()(
  persist(
    (set, get) => ({
      entries: [],
      
      addEntry: (address, label) => {
        const checksummed = validateAddress(address);
        if (!checksummed) return;
        
        set(state => ({
          entries: [
            ...state.entries.filter(e => 
              e.address.toLowerCase() !== checksummed.toLowerCase()
            ),
            { address: checksummed, label, createdAt: Date.now() }
          ]
        }));
      },
      
      removeEntry: (address) => {
        set(state => ({
          entries: state.entries.filter(e => 
            e.address.toLowerCase() !== address.toLowerCase()
          )
        }));
      },
      
      getLabel: (address) => {
        const entry = get().entries.find(e => 
          e.address.toLowerCase() === address.toLowerCase()
        );
        return entry?.label;
      },
    }),
    { name: 'w3ag-address-book' }
  )
);
```

---

## Accessibility Checklist

### ARIA Requirements

| Attribute | Usage | Requirement |
|-----------|-------|-------------|
| `aria-label` | Address element | Full chunked address + context |
| `aria-live="polite"` | Announcement region | Copy confirmation, errors |
| `aria-expanded` | Truncated address | Toggle state for full/truncated |
| `aria-invalid` | Input fields | Address validation state |

### Keyboard Navigation

| Key | Action |
|-----|--------|
| `Tab` | Move between address, copy button |
| `Enter` / `Space` | Activate copy, toggle expand |
| `Escape` | Close any popover/tooltip |

### Screen Reader Testing Script

```
1. Navigate to address component
   Expected: "[Label/ENS], address: 0x 742d 35Cc ... , valid address"

2. Press Enter to expand
   Expected: "Full address: 0x 742d 35Cc 6634 C053 2925 a3b8 44Bc 9e75 95f"

3. Tab to copy button, press Enter
   Expected: "Address copied to clipboard"

4. Navigate to invalid address
   Expected: "... invalid address"
```

---

## Testing

### Unit Tests

```tsx
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { AddressDisplay } from './AddressDisplay';

const mockAddress = '0x742d35Cc6634C0532925a3b844Bc9e7595f' as `0x${string}`;

describe('AddressDisplay', () => {
  describe('Accessibility', () => {
    it('has accessible name with chunked address', () => {
      render(<AddressDisplay address={mockAddress} />);
      
      const button = screen.getByRole('button');
      expect(button).toHaveAccessibleName(
        expect.stringContaining('0x 742d')
      );
    });

    it('announces copy action', async () => {
      const user = userEvent.setup();
      render(<AddressDisplay address={mockAddress} />);
      
      const copyButton = screen.getByLabelText(/copy/i);
      await user.click(copyButton);
      
      expect(screen.getByRole('status')).toHaveTextContent(
        'Address copied to clipboard'
      );
    });

    it('indicates validation state accessibly', () => {
      render(
        <AddressDisplay 
          address={mockAddress} 
          showValidation={true} 
        />
      );
      
      expect(screen.getByRole('button')).toHaveAccessibleName(
        expect.stringContaining('valid address')
      );
    });

    it('toggles between truncated and full address', async () => {
      const user = userEvent.setup();
      render(<AddressDisplay address={mockAddress} />);
      
      const button = screen.getByRole('button');
      expect(button).toHaveAttribute('aria-expanded', 'false');
      
      await user.click(button);
      expect(button).toHaveAttribute('aria-expanded', 'true');
    });
  });

  describe('Keyboard Navigation', () => {
    it('copy button is keyboard accessible', async () => {
      const user = userEvent.setup();
      render(<AddressDisplay address={mockAddress} />);
      
      const copyButton = screen.getByLabelText(/copy/i);
      copyButton.focus();
      
      await user.keyboard('{Enter}');
      
      await waitFor(() => {
        expect(screen.getByRole('status')).toHaveTextContent(/copied/i);
      });
    });
  });
});
```

### Automated Accessibility Tests

```tsx
import { axe, toHaveNoViolations } from 'jest-axe';

expect.extend(toHaveNoViolations);

describe('AddressDisplay Accessibility', () => {
  it('has no axe violations', async () => {
    const { container } = render(
      <AddressDisplay address={mockAddress} />
    );
    
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });
});
```

### Manual Testing Checklist

- [ ] **NVDA + Chrome**: Address announced in chunks
- [ ] **JAWS + Chrome**: Copy confirmation heard
- [ ] **VoiceOver + Safari**: All buttons reachable via rotor
- [ ] **Keyboard only**: Full functionality without mouse
- [ ] **High contrast mode**: Address still visible
- [ ] **200% zoom**: Layout doesn't break

---

## Common Failures

### ❌ Failure 1: Raw Address Only

```tsx
// BAD: No accessible formatting
<span>{address}</span>

// Screen reader: "zero x seven four two d three five c c..."
// User cannot process or verify
```

### ❌ Failure 2: Color-Only Validation

```tsx
// BAD: Only color indicates validity
<span className={isValid ? 'text-green-500' : 'text-red-500'}>
  {address}
</span>

// Colorblind users cannot distinguish
// Screen readers get no information
```

### ❌ Failure 3: No Copy Confirmation

```tsx
// BAD: Copy without feedback
const handleCopy = () => {
  navigator.clipboard.writeText(address);
};

// User doesn't know if copy succeeded
// Especially problematic for screen reader users
```

### ❌ Failure 4: Inaccessible ENS Resolution

```tsx
// BAD: ENS replaces address completely
<span>{ensName || address}</span>

// User cannot verify the actual address
// Must be able to see/hear both
```

---

## Related Techniques

- [Wallet Connection](./wallet-connection.md)
- [Transaction Signing](./transaction-signing.md)
- [Token Approval](./token-approval.md)

## Related Guidelines

- [1.1 Address Accessibility](../guidelines/perceivable/1.1-address-accessibility.md)
- [1.2 Transaction Clarity](../guidelines/perceivable/1.2-transaction-clarity.md)
- [4.1 Assistive Technology Compatibility](../guidelines/robust/4.1-assistive-technology.md)
