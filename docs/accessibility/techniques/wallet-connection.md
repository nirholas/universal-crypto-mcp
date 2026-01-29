# Technique: Accessible Wallet Connection

**W3AG Guidelines**: 2.1.1, 2.1.2, 2.1.3, 4.1.1  
**Conformance Level**: AA  
**Last Updated**: 2024-12-29

---

## Problem Statement

Wallet connection is the gateway to every Web3 application. Current implementations create significant barriers:

### For Screen Reader Users
- **Modal focus chaos**: Focus isn't trapped; users tab into background content
- **No context on open**: Users don't know a modal appeared or what it contains
- **Wallet icons without labels**: Image-only buttons provide no information
- **QR codes are invisible**: WalletConnect QR codes have no text alternative
- **Connection state unclear**: Users don't know if connection succeeded or failed

### For Keyboard Users
- **Mouse-dependent selection**: Wallet grid requires clicking, not arrow keys
- **No escape key support**: Can't close modal with keyboard
- **Focus lost on close**: Focus doesn't return to trigger button

### For Users with Cognitive Disabilities
- **Too many choices**: 10+ wallet options overwhelm users
- **Unclear consequences**: Users don't understand what "connecting" means
- **No progress indication**: Connection process has no status updates

### For Users with Motor Impairments
- **Small touch targets**: Wallet icons are too small
- **Time pressure**: Some wallets time out during connection

---

## Solution Pattern

### Core Principles

1. **Trap focus** inside modal when open
2. **Announce modal** opening and context to screen readers
3. **Support full keyboard navigation** (arrows, Enter, Escape)
4. **Provide text alternatives** for wallet icons and QR codes
5. **Announce connection state changes** via live regions
6. **Return focus** to trigger button on close

### Modal Structure

```
┌─────────────────────────────────────────────────────────┐
│  Connect Wallet                                    [X]  │
│─────────────────────────────────────────────────────────│
│                                                         │
│  ┌─────────────┐  ┌─────────────┐  ┌─────────────┐     │
│  │  MetaMask   │  │  Rainbow    │  │  Coinbase   │     │
│  │  [Icon]     │  │  [Icon]     │  │  [Icon]     │     │
│  │  Installed  │  │  Installed  │  │  Not installed   │
│  └─────────────┘  └─────────────┘  └─────────────┘     │
│                                                         │
│  ─── Or scan with mobile wallet ───                    │
│                                                         │
│  [QR Code]     Can't scan? Copy link                   │
│                                                         │
└─────────────────────────────────────────────────────────┘

Screen reader announces on open:
"Connect wallet dialog. Select a wallet to connect. 
 3 wallets available. Use arrow keys to navigate."
```

---

## Implementation

### Full React Component

```tsx
import React, { useEffect, useRef, useState, useCallback } from 'react';
import { useConnect, useAccount } from 'wagmi';

/**
 * W3AG Compliant Wallet Connection Modal
 * 
 * Conformance: Level AA
 * Guidelines: 2.1.1, 2.1.2, 2.1.3, 4.1.1, 4.1.2
 */

interface WalletOption {
  id: string;
  name: string;
  icon: string;
  description: string;
  installed: boolean;
  type: 'injected' | 'walletconnect' | 'coinbase';
}

interface WalletConnectionModalProps {
  isOpen: boolean;
  onClose: () => void;
  walletConnectUri?: string;
}

export function WalletConnectionModal({
  isOpen,
  onClose,
  walletConnectUri,
}: WalletConnectionModalProps) {
  const modalRef = useRef<HTMLDivElement>(null);
  const triggerRef = useRef<HTMLElement | null>(null);
  const firstFocusableRef = useRef<HTMLButtonElement>(null);
  
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [announcement, setAnnouncement] = useState('');
  
  const { connectors, connect, isPending, error } = useConnect();
  const { isConnected } = useAccount();

  // Build wallet options from wagmi connectors
  const walletOptions: WalletOption[] = connectors.map(connector => ({
    id: connector.id,
    name: connector.name,
    icon: connector.icon || '',
    description: getWalletDescription(connector.id),
    installed: connector.type === 'injected' ? 
      typeof window !== 'undefined' && !!(window as any).ethereum : true,
    type: connector.type as WalletOption['type'],
  }));

  // Store trigger element on open
  useEffect(() => {
    if (isOpen) {
      triggerRef.current = document.activeElement as HTMLElement;
      
      // Announce modal opening
      const installedCount = walletOptions.filter(w => w.installed).length;
      setAnnouncement(
        `Connect wallet dialog opened. ${walletOptions.length} wallets available, ` +
        `${installedCount} installed. Use arrow keys to navigate, Enter to select.`
      );
      
      // Focus first wallet option after announcement
      setTimeout(() => {
        firstFocusableRef.current?.focus();
      }, 100);
    } else {
      // Return focus to trigger
      triggerRef.current?.focus();
    }
  }, [isOpen, walletOptions.length]);

  // Handle successful connection
  useEffect(() => {
    if (isConnected && isOpen) {
      setAnnouncement('Wallet connected successfully.');
      setTimeout(onClose, 1500);
    }
  }, [isConnected, isOpen, onClose]);

  // Handle connection error
  useEffect(() => {
    if (error) {
      setAnnouncement(`Connection failed: ${error.message}. Please try again.`);
    }
  }, [error]);

  // Focus trap and keyboard navigation
  const handleKeyDown = useCallback((e: React.KeyboardEvent) => {
    switch (e.key) {
      case 'Escape':
        e.preventDefault();
        onClose();
        break;
        
      case 'Tab': {
        // Focus trap
        const focusable = modalRef.current?.querySelectorAll<HTMLElement>(
          'button:not([disabled]), [href], input:not([disabled]), ' +
          'select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])'
        );
        
        if (!focusable?.length) return;
        
        const first = focusable[0];
        const last = focusable[focusable.length - 1];
        
        if (e.shiftKey && document.activeElement === first) {
          e.preventDefault();
          last.focus();
        } else if (!e.shiftKey && document.activeElement === last) {
          e.preventDefault();
          first.focus();
        }
        break;
      }
      
      case 'ArrowDown':
      case 'ArrowRight':
        e.preventDefault();
        setSelectedIndex(prev => 
          Math.min(prev + 1, walletOptions.length - 1)
        );
        break;
        
      case 'ArrowUp':
      case 'ArrowLeft':
        e.preventDefault();
        setSelectedIndex(prev => Math.max(prev - 1, 0));
        break;
        
      case 'Home':
        e.preventDefault();
        setSelectedIndex(0);
        break;
        
      case 'End':
        e.preventDefault();
        setSelectedIndex(walletOptions.length - 1);
        break;
    }
  }, [onClose, walletOptions.length]);

  // Focus selected wallet option
  useEffect(() => {
    if (!isOpen) return;
    
    const options = modalRef.current?.querySelectorAll<HTMLButtonElement>(
      '[role="option"]'
    );
    options?.[selectedIndex]?.focus();
    
    // Announce selected wallet
    const wallet = walletOptions[selectedIndex];
    if (wallet) {
      setAnnouncement(
        `${wallet.name}. ${wallet.description}. ` +
        `${wallet.installed ? 'Installed' : 'Not installed'}.`
      );
    }
  }, [selectedIndex, isOpen, walletOptions]);

  // Handle wallet selection
  const handleSelectWallet = useCallback((wallet: WalletOption) => {
    if (!wallet.installed && wallet.type === 'injected') {
      setAnnouncement(
        `${wallet.name} is not installed. ` +
        `Please install the ${wallet.name} browser extension first.`
      );
      return;
    }
    
    setAnnouncement(`Connecting to ${wallet.name}. Please check your wallet.`);
    
    const connector = connectors.find(c => c.id === wallet.id);
    if (connector) {
      connect({ connector });
    }
  }, [connectors, connect]);

  // Copy WalletConnect URI
  const handleCopyUri = useCallback(async () => {
    if (!walletConnectUri) return;
    
    try {
      await navigator.clipboard.writeText(walletConnectUri);
      setAnnouncement(
        'WalletConnect link copied to clipboard. ' +
        'Paste it in your mobile wallet app to connect.'
      );
    } catch {
      setAnnouncement('Failed to copy link. Please try again.');
    }
  }, [walletConnectUri]);

  if (!isOpen) return null;

  return (
    <>
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/50 z-40"
        onClick={onClose}
        aria-hidden="true"
      />

      {/* Modal */}
      <div
        ref={modalRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby="wallet-modal-title"
        aria-describedby="wallet-modal-description"
        className="fixed inset-4 md:inset-auto md:top-1/2 md:left-1/2 
                   md:-translate-x-1/2 md:-translate-y-1/2
                   md:max-w-md md:w-full
                   bg-white rounded-xl shadow-2xl z-50
                   flex flex-col max-h-[90vh]"
        onKeyDown={handleKeyDown}
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

        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b">
          <div>
            <h2 
              id="wallet-modal-title" 
              className="text-lg font-semibold"
            >
              Connect Wallet
            </h2>
            <p 
              id="wallet-modal-description" 
              className="text-sm text-gray-500"
            >
              Select a wallet to connect to this app
            </p>
          </div>
          
          <button
            onClick={onClose}
            className="p-2 rounded-lg hover:bg-gray-100 
                       focus:outline-none focus:ring-2 focus:ring-blue-500"
            aria-label="Close wallet connection dialog"
          >
            <CloseIcon className="w-5 h-5" />
          </button>
        </div>

        {/* Wallet list */}
        <div 
          className="flex-1 overflow-y-auto p-4"
          role="listbox"
          aria-label="Available wallets"
        >
          <ul className="space-y-2">
            {walletOptions.map((wallet, index) => (
              <li key={wallet.id}>
                <button
                  ref={index === 0 ? firstFocusableRef : undefined}
                  role="option"
                  aria-selected={selectedIndex === index}
                  aria-disabled={!wallet.installed && wallet.type === 'injected'}
                  onClick={() => handleSelectWallet(wallet)}
                  className={`
                    w-full flex items-center gap-3 p-3 rounded-lg
                    border-2 transition-all
                    focus:outline-none focus:ring-2 focus:ring-blue-500
                    ${selectedIndex === index 
                      ? 'border-blue-500 bg-blue-50' 
                      : 'border-gray-200 hover:border-gray-300'}
                    ${!wallet.installed && wallet.type === 'injected'
                      ? 'opacity-50 cursor-not-allowed'
                      : 'cursor-pointer'}
                  `}
                >
                  {/* Wallet icon */}
                  {wallet.icon ? (
                    <img
                      src={wallet.icon}
                      alt="" // Decorative, name is in text
                      className="w-10 h-10 rounded-lg"
                      aria-hidden="true"
                    />
                  ) : (
                    <div 
                      className="w-10 h-10 rounded-lg bg-gray-200 
                                 flex items-center justify-center"
                      aria-hidden="true"
                    >
                      <WalletIcon className="w-6 h-6 text-gray-500" />
                    </div>
                  )}

                  {/* Wallet info */}
                  <div className="flex-1 text-left">
                    <div className="font-medium">{wallet.name}</div>
                    <div className="text-sm text-gray-500">
                      {wallet.description}
                    </div>
                  </div>

                  {/* Status badge */}
                  <div className="text-right">
                    {isPending && selectedIndex === index ? (
                      <span className="text-sm text-blue-600">
                        Connecting...
                      </span>
                    ) : wallet.installed ? (
                      <span className="text-xs text-green-600 bg-green-100 
                                       px-2 py-1 rounded-full">
                        Installed
                      </span>
                    ) : wallet.type === 'injected' ? (
                      <span className="text-xs text-gray-500 bg-gray-100 
                                       px-2 py-1 rounded-full">
                        Not installed
                      </span>
                    ) : null}
                  </div>
                </button>
              </li>
            ))}
          </ul>
        </div>

        {/* WalletConnect QR alternative */}
        {walletConnectUri && (
          <div className="p-4 border-t bg-gray-50">
            <div className="text-center mb-3">
              <span className="text-sm text-gray-500">
                Or scan with a mobile wallet
              </span>
            </div>

            {/* QR Code with accessible alternative */}
            <div className="flex flex-col items-center gap-3">
              <div 
                className="p-4 bg-white rounded-lg"
                role="img"
                aria-label="QR code for WalletConnect. Use the copy link button below if you cannot scan."
              >
                <QRCode value={walletConnectUri} size={160} />
              </div>

              {/* Text alternative for QR */}
              <button
                onClick={handleCopyUri}
                className="text-sm text-blue-600 hover:text-blue-800
                           underline focus:outline-none focus:ring-2 
                           focus:ring-blue-500 rounded px-2 py-1"
              >
                Can't scan? Copy connection link
              </button>
            </div>
          </div>
        )}

        {/* Keyboard hints (visible on focus) */}
        <div className="p-3 border-t bg-gray-50 text-xs text-gray-500 text-center">
          <kbd className="px-1.5 py-0.5 bg-gray-200 rounded">↑↓</kbd> Navigate
          <span className="mx-2">·</span>
          <kbd className="px-1.5 py-0.5 bg-gray-200 rounded">Enter</kbd> Select
          <span className="mx-2">·</span>
          <kbd className="px-1.5 py-0.5 bg-gray-200 rounded">Esc</kbd> Close
        </div>
      </div>
    </>
  );
}

// Helper function for wallet descriptions
function getWalletDescription(id: string): string {
  const descriptions: Record<string, string> = {
    'injected': 'Browser extension wallet',
    'metaMask': 'Popular browser extension',
    'walletConnect': 'Connect mobile wallet via QR',
    'coinbaseWallet': 'Coinbase Wallet app',
    'rainbow': 'Rainbow mobile wallet',
    'trust': 'Trust Wallet mobile app',
  };
  return descriptions[id] || 'Cryptocurrency wallet';
}

// Placeholder for QR code component (use a library like qrcode.react)
function QRCode({ value, size }: { value: string; size: number }) {
  return (
    <div 
      style={{ width: size, height: size }}
      className="bg-gray-100 flex items-center justify-center"
    >
      {/* Replace with actual QR code library */}
      <span className="text-xs text-gray-400">QR Code</span>
    </div>
  );
}

// Icon components
function CloseIcon({ className }: { className?: string }) {
  return (
    <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
    </svg>
  );
}

function WalletIcon({ className }: { className?: string }) {
  return (
    <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} 
        d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
    </svg>
  );
}
```

### Usage with wagmi

```tsx
import { useState } from 'react';
import { useAccount, useDisconnect } from 'wagmi';
import { WalletConnectionModal } from './WalletConnectionModal';
import { AddressDisplay } from './AddressDisplay';

export function WalletButton() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const { address, isConnected } = useAccount();
  const { disconnect } = useDisconnect();

  if (isConnected && address) {
    return (
      <div className="flex items-center gap-2">
        <AddressDisplay address={address} />
        <button
          onClick={() => disconnect()}
          className="px-4 py-2 text-sm bg-red-100 text-red-700 
                     rounded-lg hover:bg-red-200
                     focus:outline-none focus:ring-2 focus:ring-red-500"
          aria-label="Disconnect wallet"
        >
          Disconnect
        </button>
      </div>
    );
  }

  return (
    <>
      <button
        onClick={() => setIsModalOpen(true)}
        className="px-4 py-2 bg-blue-600 text-white rounded-lg
                   hover:bg-blue-700 focus:outline-none 
                   focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
        aria-haspopup="dialog"
        aria-expanded={isModalOpen}
      >
        Connect Wallet
      </button>

      <WalletConnectionModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
      />
    </>
  );
}
```

---

## Focus Management

### Focus Flow Diagram

```
[Connect Wallet Button]
         │
         ▼ (click/Enter)
┌─────────────────────────┐
│  Modal Opens            │
│  Focus → First Wallet   │
│                         │
│  ↑↓ Navigate wallets    │
│  Enter → Connect        │
│  Esc → Close            │
│                         │
│  Tab → Cycle focusable  │
│  Shift+Tab → Reverse    │
└─────────────────────────┘
         │
         ▼ (close/connect)
[Focus returns to Connect Wallet Button]
```

### Focus Trap Implementation

```tsx
function useFocusTrap(ref: React.RefObject<HTMLElement>, isActive: boolean) {
  useEffect(() => {
    if (!isActive || !ref.current) return;

    const element = ref.current;
    const focusableSelector = 
      'button:not([disabled]), [href], input:not([disabled]), ' +
      'select:not([disabled]), textarea:not([disabled]), ' +
      '[tabindex]:not([tabindex="-1"])';

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key !== 'Tab') return;

      const focusable = element.querySelectorAll<HTMLElement>(focusableSelector);
      if (!focusable.length) return;

      const first = focusable[0];
      const last = focusable[focusable.length - 1];

      if (e.shiftKey && document.activeElement === first) {
        e.preventDefault();
        last.focus();
      } else if (!e.shiftKey && document.activeElement === last) {
        e.preventDefault();
        first.focus();
      }
    };

    element.addEventListener('keydown', handleKeyDown);
    return () => element.removeEventListener('keydown', handleKeyDown);
  }, [ref, isActive]);
}
```

---

## Accessibility Checklist

### ARIA Requirements

| Attribute | Element | Purpose |
|-----------|---------|---------|
| `role="dialog"` | Modal container | Identifies as dialog |
| `aria-modal="true"` | Modal container | Indicates modal behavior |
| `aria-labelledby` | Modal container | Points to title |
| `aria-describedby` | Modal container | Points to description |
| `aria-haspopup="dialog"` | Trigger button | Indicates opens dialog |
| `aria-expanded` | Trigger button | Modal open state |
| `role="listbox"` | Wallet list | Composite widget |
| `role="option"` | Wallet buttons | Listbox children |
| `aria-selected` | Wallet buttons | Currently focused option |
| `aria-disabled` | Wallet buttons | Not installed state |
| `aria-live="polite"` | Status region | Connection updates |

### Keyboard Navigation

| Key | Action |
|-----|--------|
| `Tab` | Move between focusable elements (trapped) |
| `Shift + Tab` | Move backwards |
| `Arrow Up/Down` | Navigate wallet options |
| `Arrow Left/Right` | Navigate wallet options (alternative) |
| `Home` | Jump to first wallet |
| `End` | Jump to last wallet |
| `Enter` | Select focused wallet / Activate button |
| `Space` | Select focused wallet / Activate button |
| `Escape` | Close modal |

### Screen Reader Testing Script

```
1. Tab to "Connect Wallet" button
   Expected: "Connect Wallet, button"

2. Press Enter
   Expected: "Connect wallet dialog opened. [X] wallets available..."

3. Use arrow keys to navigate
   Expected: "[Wallet name]. [Description]. Installed/Not installed."

4. Press Enter on wallet
   Expected: "Connecting to [Wallet]. Please check your wallet."

5. After connection
   Expected: "Wallet connected successfully."

6. Press Escape to close
   Expected: Focus returns to "Connect Wallet" button
```

---

## Testing

### Unit Tests

```tsx
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { WagmiProvider } from 'wagmi';
import { WalletConnectionModal } from './WalletConnectionModal';

describe('WalletConnectionModal', () => {
  const mockOnClose = jest.fn();

  beforeEach(() => {
    mockOnClose.mockClear();
  });

  describe('Accessibility', () => {
    it('has correct ARIA attributes', () => {
      render(
        <WalletConnectionModal isOpen={true} onClose={mockOnClose} />
      );

      const dialog = screen.getByRole('dialog');
      expect(dialog).toHaveAttribute('aria-modal', 'true');
      expect(dialog).toHaveAttribute('aria-labelledby');
    });

    it('announces when opened', async () => {
      render(
        <WalletConnectionModal isOpen={true} onClose={mockOnClose} />
      );

      const status = screen.getByRole('status');
      expect(status).toHaveTextContent(/connect wallet dialog opened/i);
    });

    it('traps focus inside modal', async () => {
      const user = userEvent.setup();
      render(
        <WalletConnectionModal isOpen={true} onClose={mockOnClose} />
      );

      const closeButton = screen.getByLabelText(/close/i);
      closeButton.focus();

      // Tab from last element should go to first
      await user.tab();
      expect(document.activeElement).not.toBe(document.body);
    });

    it('closes on Escape key', async () => {
      const user = userEvent.setup();
      render(
        <WalletConnectionModal isOpen={true} onClose={mockOnClose} />
      );

      await user.keyboard('{Escape}');
      expect(mockOnClose).toHaveBeenCalled();
    });

    it('supports arrow key navigation', async () => {
      const user = userEvent.setup();
      render(
        <WalletConnectionModal isOpen={true} onClose={mockOnClose} />
      );

      const firstOption = screen.getAllByRole('option')[0];
      firstOption.focus();

      await user.keyboard('{ArrowDown}');
      
      const options = screen.getAllByRole('option');
      expect(options[1]).toHaveFocus();
    });
  });

  describe('QR Code Alternative', () => {
    it('provides copy link alternative for QR', () => {
      render(
        <WalletConnectionModal 
          isOpen={true} 
          onClose={mockOnClose}
          walletConnectUri="wc:abc123"
        />
      );

      expect(screen.getByText(/can't scan/i)).toBeInTheDocument();
    });
  });
});
```

### Manual Testing Checklist

- [ ] **NVDA + Chrome**: Modal announced, wallets navigable
- [ ] **JAWS + Chrome**: Focus trap works correctly
- [ ] **VoiceOver + Safari**: Wallet selection announced
- [ ] **Keyboard only**: Full flow without mouse
- [ ] **High contrast mode**: Buttons visible
- [ ] **200% zoom**: Modal still usable
- [ ] **Touch device**: Tap targets ≥44x44px

---

## Common Failures

### ❌ Failure 1: No Focus Trap

```tsx
// BAD: Focus escapes to background
<div className="modal">
  {/* No focus trapping logic */}
</div>

// User tabs into background content while modal is open
```

### ❌ Failure 2: Focus Not Returned

```tsx
// BAD: Focus lost on close
const handleClose = () => {
  setIsOpen(false);
  // Focus goes to <body>, not trigger button
};
```

### ❌ Failure 3: Icon-Only Wallet Buttons

```tsx
// BAD: No text label
<button onClick={() => connect(wallet)}>
  <img src={wallet.icon} />
</button>

// Screen reader says "button" with no context
```

### ❌ Failure 4: No QR Alternative

```tsx
// BAD: QR code only for WalletConnect
<div>
  <QRCode value={uri} />
</div>

// Blind users cannot scan QR codes
```

### ❌ Failure 5: Silent Connection Changes

```tsx
// BAD: No status announcements
useEffect(() => {
  if (isConnected) {
    closeModal(); // User doesn't know it worked
  }
}, [isConnected]);
```

---

## Related Techniques

- [Address Display](./address-display.md)
- [Transaction Signing](./transaction-signing.md)
- [Network Switching](./network-switching.md)

## Related Guidelines

- [2.1 Wallet Connection](../guidelines/operable/2.1-wallet-connection.md)
- [4.1 Assistive Technology](../guidelines/robust/4.1-assistive-technology.md)
