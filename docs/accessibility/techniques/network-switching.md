# Technique: Accessible Network Switching

**W3AG Guidelines**: 3.2.1, 3.2.2, 4.1.2, 1.2.5  
**Conformance Level**: AA  
**Last Updated**: 2024-12-29

---

## Problem Statement

Multi-chain DeFi requires users to switch between networks (Ethereum, Arbitrum, Optimism, Polygon, Base, etc.). Current implementations create dangerous accessibility barriers:

### For Screen Reader Users
- **Silent switching**: Network changes aren't announced
- **Icon-only selectors**: Network shown only with logo, no text
- **Wrong chain warnings invisible**: "Please switch to Polygon" shown visually only
- **Pending state unclear**: Is it switching? Did it fail?

### For Users with Cognitive Disabilities
- **Chain confusion**: Users don't understand they're on the wrong network
- **Asset loss risk**: Sending to wrong chain address loses funds
- **Duplicate addresses**: Same address exists on all chains but with different assets
- **No clear indication**: What chain am I currently on?

### For All Users
- **Automatic switching fails**: Wallet rejects `wallet_switchEthereumChain`
- **Manual instructions missing**: How to add a network manually?
- **RPC errors unexplained**: "Chain not configured" means nothing to users

### Common Attack Vector
- **Phishing chains**: Malicious dApps add fake networks with similar names
- **Wrong chain transactions**: Users lose funds by transacting on wrong network

---

## Solution Pattern

### Core Principles

1. **Always show current network prominently**: Users must know where they are
2. **Announce all network changes**: Screen readers hear when network switches
3. **Confirm before switching**: Don't auto-switch without user consent
4. **Explain chain mismatches clearly**: "You're on Ethereum, this app uses Polygon"
5. **Provide fallback instructions**: If automatic switching fails, explain manual steps
6. **Warn about address reuse**: Same address, different networks = different balances

### Network Switcher UI Structure

```
┌─────────────────────────────────────────────────────────┐
│  Current Network: Ethereum Mainnet    [Change ▼]       │
└─────────────────────────────────────────────────────────┘

[Dropdown opened]
┌─────────────────────────────────────────────────────────┐
│  Select Network                                         │
├─────────────────────────────────────────────────────────┤
│  ✓ Ethereum Mainnet                     $2.45 avg fee  │
│    Arbitrum One                         $0.15 avg fee  │
│    Optimism                             $0.12 avg fee  │
│    Base                                 $0.05 avg fee  │
│    Polygon                              $0.01 avg fee  │
├─────────────────────────────────────────────────────────┤
│  [+ Add custom network]                                 │
└─────────────────────────────────────────────────────────┘

Screen reader announces:
"Current network: Ethereum Mainnet. Change network button, 
expanded. Listbox with 5 options. Ethereum Mainnet selected."
```

### Wrong Network Warning

```
┌─────────────────────────────────────────────────────────┐
│  ⚠️ Wrong Network                                       │
│                                                         │
│  This app requires Arbitrum One                         │
│  You're currently on Ethereum Mainnet                   │
│                                                         │
│  Your Arbitrum balance: 0.5 ETH ($1,150)                │
│                                                         │
│  [Switch to Arbitrum]    [Stay on Ethereum]             │
│                                                         │
│  ℹ️ Switching networks is free and instant              │
└─────────────────────────────────────────────────────────┘
```

---

## Implementation

### Full React Component

```tsx
import React, { useState, useCallback, useEffect, useRef, useMemo } from 'react';
import { useSwitchChain, useChainId, useAccount, useBalance } from 'wagmi';
import { mainnet, arbitrum, optimism, base, polygon } from 'wagmi/chains';

/**
 * W3AG Compliant Network Switcher
 * 
 * Conformance: Level AA
 * Guidelines: 3.2.1, 3.2.2, 4.1.2, 1.2.5
 */

interface NetworkConfig {
  chain: typeof mainnet;
  icon: string;
  avgFeeUsd: string;
  color: string;
}

interface NetworkSwitcherProps {
  /** Supported chains for this app */
  supportedChains?: number[];
  /** Required chain (if app only works on one chain) */
  requiredChainId?: number;
  /** Called after successful switch */
  onSwitch?: (chainId: number) => void;
  /** Show average fees */
  showFees?: boolean;
  /** Compact mode for headers */
  compact?: boolean;
  /** Additional CSS class */
  className?: string;
}

const NETWORKS: NetworkConfig[] = [
  { chain: mainnet, icon: '🔷', avgFeeUsd: '$2.45', color: '#627EEA' },
  { chain: arbitrum, icon: '🔵', avgFeeUsd: '$0.15', color: '#28A0F0' },
  { chain: optimism, icon: '🔴', avgFeeUsd: '$0.12', color: '#FF0420' },
  { chain: base, icon: '🔵', avgFeeUsd: '$0.05', color: '#0052FF' },
  { chain: polygon, icon: '🟣', avgFeeUsd: '$0.01', color: '#8247E5' },
];

export function NetworkSwitcher({
  supportedChains,
  requiredChainId,
  onSwitch,
  showFees = true,
  compact = false,
  className = '',
}: NetworkSwitcherProps) {
  const dropdownRef = useRef<HTMLDivElement>(null);
  const buttonRef = useRef<HTMLButtonElement>(null);
  
  const [isOpen, setIsOpen] = useState(false);
  const [announcement, setAnnouncement] = useState('');
  const [selectedIndex, setSelectedIndex] = useState(0);
  
  const chainId = useChainId();
  const { address } = useAccount();
  const { switchChain, isPending, error } = useSwitchChain();

  // Filter to supported chains
  const availableNetworks = useMemo(() => {
    if (!supportedChains?.length) return NETWORKS;
    return NETWORKS.filter(n => supportedChains.includes(n.chain.id));
  }, [supportedChains]);

  // Current network info
  const currentNetwork = NETWORKS.find(n => n.chain.id === chainId);
  const requiredNetwork = requiredChainId 
    ? NETWORKS.find(n => n.chain.id === requiredChainId) 
    : null;
  const isWrongNetwork = requiredChainId && chainId !== requiredChainId;

  // Get balance on required chain (for wrong network warning)
  const { data: requiredChainBalance } = useBalance({
    address,
    chainId: requiredChainId,
  });

  // Announce network changes
  useEffect(() => {
    if (currentNetwork) {
      setAnnouncement(`Network changed to ${currentNetwork.chain.name}`);
    }
  }, [chainId]);

  // Announce errors
  useEffect(() => {
    if (error) {
      setAnnouncement(
        `Failed to switch network: ${error.message}. ` +
        `You may need to add this network to your wallet manually.`
      );
    }
  }, [error]);

  // Handle keyboard navigation
  const handleKeyDown = useCallback((e: React.KeyboardEvent) => {
    if (!isOpen) {
      if (e.key === 'Enter' || e.key === ' ' || e.key === 'ArrowDown') {
        e.preventDefault();
        setIsOpen(true);
        setSelectedIndex(
          availableNetworks.findIndex(n => n.chain.id === chainId) || 0
        );
      }
      return;
    }

    switch (e.key) {
      case 'Escape':
        e.preventDefault();
        setIsOpen(false);
        buttonRef.current?.focus();
        break;
        
      case 'ArrowDown':
        e.preventDefault();
        setSelectedIndex(prev => 
          Math.min(prev + 1, availableNetworks.length - 1)
        );
        break;
        
      case 'ArrowUp':
        e.preventDefault();
        setSelectedIndex(prev => Math.max(prev - 1, 0));
        break;
        
      case 'Home':
        e.preventDefault();
        setSelectedIndex(0);
        break;
        
      case 'End':
        e.preventDefault();
        setSelectedIndex(availableNetworks.length - 1);
        break;
        
      case 'Enter':
      case ' ':
        e.preventDefault();
        handleNetworkSelect(availableNetworks[selectedIndex].chain.id);
        break;
    }
  }, [isOpen, availableNetworks, chainId]);

  // Close on outside click
  useEffect(() => {
    if (!isOpen) return;

    const handleClickOutside = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [isOpen]);

  // Handle network selection
  const handleNetworkSelect = useCallback(async (targetChainId: number) => {
    if (targetChainId === chainId) {
      setIsOpen(false);
      return;
    }

    const targetNetwork = NETWORKS.find(n => n.chain.id === targetChainId);
    
    setAnnouncement(
      `Switching to ${targetNetwork?.chain.name}. Please confirm in your wallet.`
    );

    try {
      await switchChain({ chainId: targetChainId });
      setIsOpen(false);
      onSwitch?.(targetChainId);
      setAnnouncement(`Successfully switched to ${targetNetwork?.chain.name}`);
    } catch (err) {
      // Error handled by useEffect above
    }
  }, [chainId, switchChain, onSwitch]);

  // Handle required chain switch
  const handleSwitchToRequired = useCallback(() => {
    if (requiredChainId) {
      handleNetworkSelect(requiredChainId);
    }
  }, [requiredChainId, handleNetworkSelect]);

  return (
    <div className={`w3ag-network-switcher ${className}`} ref={dropdownRef}>
      {/* Live announcements */}
      <div
        role="status"
        aria-live="polite"
        aria-atomic="true"
        className="sr-only"
      >
        {announcement}
      </div>

      {/* Wrong network warning */}
      {isWrongNetwork && requiredNetwork && (
        <div
          role="alertdialog"
          aria-labelledby="wrong-network-title"
          aria-describedby="wrong-network-desc"
          className="mb-4 p-4 bg-yellow-50 border border-yellow-200 rounded-lg"
        >
          <h3 
            id="wrong-network-title" 
            className="font-bold text-yellow-800 flex items-center gap-2"
          >
            <WarningIcon className="w-5 h-5" />
            Wrong Network
          </h3>
          
          <p id="wrong-network-desc" className="mt-2 text-yellow-700">
            This app requires <strong>{requiredNetwork.chain.name}</strong>.
            <br />
            You're currently on <strong>{currentNetwork?.chain.name || 'Unknown'}</strong>.
          </p>

          {requiredChainBalance && (
            <p className="mt-2 text-sm text-yellow-600">
              Your {requiredNetwork.chain.name} balance:{' '}
              <strong>
                {parseFloat(requiredChainBalance.formatted).toFixed(4)} {requiredChainBalance.symbol}
              </strong>
            </p>
          )}

          <div className="mt-4 flex gap-3">
            <button
              onClick={handleSwitchToRequired}
              disabled={isPending}
              className="px-4 py-2 bg-yellow-600 text-white rounded-lg
                         hover:bg-yellow-700 focus:outline-none 
                         focus:ring-2 focus:ring-yellow-500 focus:ring-offset-2
                         disabled:opacity-50"
            >
              {isPending ? 'Switching...' : `Switch to ${requiredNetwork.chain.name}`}
            </button>
          </div>

          <p className="mt-3 text-xs text-yellow-600">
            ℹ️ Switching networks is free and instant
          </p>
        </div>
      )}

      {/* Network selector dropdown */}
      <div className="relative">
        <button
          ref={buttonRef}
          onClick={() => setIsOpen(!isOpen)}
          onKeyDown={handleKeyDown}
          aria-haspopup="listbox"
          aria-expanded={isOpen}
          aria-label={`Current network: ${currentNetwork?.chain.name || 'Unknown'}. Click to change.`}
          className={`
            flex items-center gap-2 rounded-lg border
            hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500
            ${compact ? 'px-2 py-1' : 'px-4 py-2'}
            ${isWrongNetwork ? 'border-yellow-400 bg-yellow-50' : 'border-gray-300'}
          `}
        >
          {/* Network icon */}
          <span 
            className="text-lg"
            aria-hidden="true"
          >
            {currentNetwork?.icon || '❓'}
          </span>
          
          {/* Network name */}
          {!compact && (
            <span className="font-medium">
              {currentNetwork?.chain.name || 'Unknown Network'}
            </span>
          )}
          
          {/* Dropdown arrow */}
          <ChevronIcon 
            className={`w-4 h-4 transition-transform ${isOpen ? 'rotate-180' : ''}`} 
          />
          
          {/* Pending indicator */}
          {isPending && (
            <span className="absolute -top-1 -right-1 flex h-3 w-3">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-blue-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-3 w-3 bg-blue-500"></span>
            </span>
          )}
        </button>

        {/* Dropdown menu */}
        {isOpen && (
          <div
            role="listbox"
            aria-label="Select network"
            aria-activedescendant={`network-${availableNetworks[selectedIndex]?.chain.id}`}
            className="absolute top-full left-0 mt-2 w-72 
                       bg-white border border-gray-200 rounded-lg shadow-xl z-50"
            onKeyDown={handleKeyDown}
          >
            <div className="p-2 border-b border-gray-100">
              <span className="text-sm font-medium text-gray-500">
                Select Network
              </span>
            </div>

            <ul className="py-1 max-h-64 overflow-y-auto">
              {availableNetworks.map((network, index) => {
                const isSelected = network.chain.id === chainId;
                const isFocused = index === selectedIndex;
                
                return (
                  <li key={network.chain.id}>
                    <button
                      id={`network-${network.chain.id}`}
                      role="option"
                      aria-selected={isSelected}
                      onClick={() => handleNetworkSelect(network.chain.id)}
                      className={`
                        w-full flex items-center gap-3 px-4 py-3
                        text-left transition-colors
                        ${isFocused ? 'bg-blue-50' : 'hover:bg-gray-50'}
                        ${isSelected ? 'bg-blue-50' : ''}
                        focus:outline-none focus:bg-blue-100
                      `}
                    >
                      {/* Selection indicator */}
                      <span className="w-5" aria-hidden="true">
                        {isSelected && '✓'}
                      </span>
                      
                      {/* Network icon */}
                      <span 
                        className="text-xl" 
                        aria-hidden="true"
                      >
                        {network.icon}
                      </span>
                      
                      {/* Network info */}
                      <div className="flex-1">
                        <div className="font-medium">{network.chain.name}</div>
                        {showFees && (
                          <div className="text-xs text-gray-500">
                            Avg fee: {network.avgFeeUsd}
                          </div>
                        )}
                      </div>
                      
                      {/* Chain badge */}
                      <div
                        className="w-3 h-3 rounded-full"
                        style={{ backgroundColor: network.color }}
                        aria-hidden="true"
                      />
                    </button>
                  </li>
                );
              })}
            </ul>

            {/* Add custom network option */}
            <div className="p-2 border-t border-gray-100">
              <button
                onClick={() => {
                  setIsOpen(false);
                  // Open custom network modal or link to wallet settings
                  setAnnouncement(
                    'To add a custom network, open your wallet settings ' +
                    'and add a new network with the RPC URL provided by the network.'
                  );
                }}
                className="w-full flex items-center gap-2 px-4 py-2 
                           text-sm text-gray-600 hover:bg-gray-50 rounded
                           focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <PlusIcon className="w-4 h-4" />
                Add custom network
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Error message */}
      {error && (
        <div 
          role="alert"
          className="mt-2 p-3 bg-red-50 border border-red-200 rounded-lg text-sm text-red-700"
        >
          <strong>Failed to switch network</strong>
          <p className="mt-1">{error.message}</p>
          <p className="mt-2 text-xs">
            You may need to add this network to your wallet manually. 
            Check your wallet's network settings.
          </p>
        </div>
      )}
    </div>
  );
}

// Separate Wrong Network Banner component for use elsewhere
export function WrongNetworkBanner({
  requiredChainId,
  onSwitch,
}: {
  requiredChainId: number;
  onSwitch?: () => void;
}) {
  const chainId = useChainId();
  const { switchChain, isPending } = useSwitchChain();
  
  const currentNetwork = NETWORKS.find(n => n.chain.id === chainId);
  const requiredNetwork = NETWORKS.find(n => n.chain.id === requiredChainId);

  if (chainId === requiredChainId || !requiredNetwork) return null;

  const handleSwitch = async () => {
    try {
      await switchChain({ chainId: requiredChainId });
      onSwitch?.();
    } catch (err) {
      // Handle in component
    }
  };

  return (
    <div
      role="alert"
      className="fixed bottom-4 left-4 right-4 md:left-auto md:right-4 md:w-96
                 p-4 bg-yellow-100 border-2 border-yellow-400 rounded-lg shadow-lg z-50"
    >
      <div className="flex items-start gap-3">
        <WarningIcon className="w-6 h-6 text-yellow-600 flex-shrink-0" />
        <div className="flex-1">
          <h4 className="font-bold text-yellow-800">Wrong Network</h4>
          <p className="text-sm text-yellow-700 mt-1">
            Please switch from {currentNetwork?.chain.name} to {requiredNetwork.chain.name}
          </p>
          <button
            onClick={handleSwitch}
            disabled={isPending}
            className="mt-3 px-4 py-2 bg-yellow-600 text-white text-sm rounded
                       hover:bg-yellow-700 focus:outline-none focus:ring-2 
                       focus:ring-yellow-500 disabled:opacity-50"
          >
            {isPending ? 'Switching...' : 'Switch Network'}
          </button>
        </div>
      </div>
    </div>
  );
}

// Icon components
function ChevronIcon({ className }: { className?: string }) {
  return (
    <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
    </svg>
  );
}

function WarningIcon({ className }: { className?: string }) {
  return (
    <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} 
        d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
    </svg>
  );
}

function PlusIcon({ className }: { className?: string }) {
  return (
    <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
    </svg>
  );
}
```

### Usage Examples

```tsx
// In header - compact mode
<header className="flex items-center justify-between p-4">
  <Logo />
  <div className="flex items-center gap-4">
    <NetworkSwitcher compact showFees={false} />
    <WalletButton />
  </div>
</header>

// With required chain
<NetworkSwitcher 
  requiredChainId={42161} // Arbitrum required
  onSwitch={(chainId) => console.log('Switched to', chainId)}
/>

// Limited chain support
<NetworkSwitcher 
  supportedChains={[1, 42161, 10]} // Only Ethereum, Arbitrum, Optimism
/>

// Floating wrong network banner
function App() {
  return (
    <>
      <MainContent />
      <WrongNetworkBanner 
        requiredChainId={42161}
        onSwitch={() => refetchData()}
      />
    </>
  );
}
```

### Chain-Specific Balance Display

```tsx
import { useBalance, useChainId } from 'wagmi';
import { arbitrum, mainnet, optimism } from 'wagmi/chains';

function MultiChainBalances({ address }: { address: `0x${string}` }) {
  const currentChainId = useChainId();
  
  const chains = [mainnet, arbitrum, optimism];
  
  return (
    <div>
      <h3 className="font-medium mb-2">Balances by Network</h3>
      
      <ul className="space-y-2" role="list" aria-label="Token balances across networks">
        {chains.map(chain => (
          <ChainBalanceRow 
            key={chain.id}
            chain={chain}
            address={address}
            isCurrentChain={chain.id === currentChainId}
          />
        ))}
      </ul>
      
      <p className="mt-3 text-xs text-gray-500" role="note">
        ⚠️ Each network has separate balances. 
        Make sure you're on the correct network before transacting.
      </p>
    </div>
  );
}

function ChainBalanceRow({ 
  chain, 
  address, 
  isCurrentChain 
}: { 
  chain: typeof mainnet; 
  address: `0x${string}`; 
  isCurrentChain: boolean;
}) {
  const { data: balance, isLoading } = useBalance({
    address,
    chainId: chain.id,
  });

  return (
    <li 
      className={`flex items-center justify-between p-2 rounded ${
        isCurrentChain ? 'bg-blue-50 border border-blue-200' : 'bg-gray-50'
      }`}
    >
      <div className="flex items-center gap-2">
        <span>{chain.name}</span>
        {isCurrentChain && (
          <span className="text-xs bg-blue-100 text-blue-700 px-1.5 py-0.5 rounded">
            Current
          </span>
        )}
      </div>
      <span className="font-mono">
        {isLoading ? '...' : `${parseFloat(balance?.formatted || '0').toFixed(4)} ETH`}
      </span>
    </li>
  );
}
```

---

## Accessibility Checklist

### ARIA Requirements

| Attribute | Element | Purpose |
|-----------|---------|---------|
| `aria-haspopup="listbox"` | Trigger button | Indicates dropdown |
| `aria-expanded` | Trigger button | Open/closed state |
| `role="listbox"` | Dropdown | Composite widget |
| `role="option"` | Network items | Listbox children |
| `aria-selected` | Network items | Current selection |
| `aria-activedescendant` | Listbox | Focused option |
| `role="alertdialog"` | Wrong network | Urgent warning |
| `aria-live="polite"` | Announcements | State changes |

### Keyboard Navigation

| Key | Action |
|-----|--------|
| `Enter` / `Space` | Open dropdown, select option |
| `Escape` | Close dropdown |
| `Arrow Up/Down` | Navigate options |
| `Home` | Jump to first option |
| `End` | Jump to last option |
| `Tab` | Move focus (closes dropdown) |

### Screen Reader Testing Script

```
1. Navigate to network switcher
   Expected: "Current network: Ethereum Mainnet. Click to change, button, collapsed"

2. Press Enter to open
   Expected: "Select network, listbox. Ethereum Mainnet, selected, 1 of 5"

3. Arrow down to Arbitrum
   Expected: "Arbitrum One, average fee $0.15, 2 of 5"

4. Press Enter to select
   Expected: "Switching to Arbitrum One. Please confirm in your wallet."

5. After successful switch
   Expected: "Successfully switched to Arbitrum One"

6. Navigate to wrong network warning
   Expected: "Wrong Network alert. This app requires Arbitrum One. 
              You're currently on Ethereum Mainnet."
```

---

## Testing

### Unit Tests

```tsx
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { WagmiProvider } from 'wagmi';
import { NetworkSwitcher, WrongNetworkBanner } from './NetworkSwitcher';

describe('NetworkSwitcher', () => {
  it('shows current network', () => {
    render(<NetworkSwitcher />);
    
    expect(screen.getByRole('button')).toHaveAccessibleName(
      expect.stringContaining('Current network')
    );
  });

  it('opens dropdown on click', async () => {
    const user = userEvent.setup();
    render(<NetworkSwitcher />);
    
    await user.click(screen.getByRole('button'));
    
    expect(screen.getByRole('listbox')).toBeInTheDocument();
  });

  it('supports keyboard navigation', async () => {
    const user = userEvent.setup();
    render(<NetworkSwitcher />);
    
    const button = screen.getByRole('button');
    button.focus();
    
    await user.keyboard('{Enter}');
    expect(screen.getByRole('listbox')).toBeInTheDocument();
    
    await user.keyboard('{ArrowDown}');
    await user.keyboard('{Escape}');
    expect(screen.queryByRole('listbox')).not.toBeInTheDocument();
  });

  it('announces network changes', async () => {
    const user = userEvent.setup();
    render(<NetworkSwitcher />);
    
    await user.click(screen.getByRole('button'));
    await user.click(screen.getByText('Arbitrum One'));
    
    const status = screen.getByRole('status');
    expect(status).toHaveTextContent(/switching to arbitrum/i);
  });
});

describe('WrongNetworkBanner', () => {
  it('shows when on wrong network', () => {
    // Mock chainId to be different from required
    render(<WrongNetworkBanner requiredChainId={42161} />);
    
    expect(screen.getByRole('alert')).toHaveTextContent(/wrong network/i);
  });

  it('provides switch button', () => {
    render(<WrongNetworkBanner requiredChainId={42161} />);
    
    expect(screen.getByRole('button', { name: /switch/i })).toBeInTheDocument();
  });
});
```

---

## Common Failures

### ❌ Failure 1: Icon-Only Network Indicator

```tsx
// BAD: Only logo, no text
<button>
  <img src="/eth-logo.png" alt="" />
</button>

// Screen reader says "button" with no context
```

### ❌ Failure 2: Silent Network Switching

```tsx
// BAD: No announcement
useEffect(() => {
  if (chainId !== requiredChainId) {
    switchChain({ chainId: requiredChainId });
  }
}, [chainId]);

// User doesn't know network changed
```

### ❌ Failure 3: Auto-Switch Without Consent

```tsx
// BAD: Switches without asking
if (wrongNetwork) {
  await switchChain({ chainId: requiredChainId });
}

// Unexpected behavior, user should confirm
```

### ❌ Failure 4: No Wrong Network Warning

```tsx
// BAD: App just doesn't work on wrong network
if (chainId !== REQUIRED_CHAIN) {
  return null; // Blank screen
}

// User has no idea why app isn't working
```

### ❌ Failure 5: Color-Only Chain Distinction

```tsx
// BAD: Networks distinguished only by color
<div style={{ color: network.color }}>
  {network.name}
</div>

// Colorblind users can't distinguish networks
```

---

## Cross-Chain Safety Warning

Always warn users about the dangers of multi-chain addresses:

```tsx
function CrossChainWarning() {
  return (
    <div role="alert" className="bg-yellow-50 border border-yellow-200 p-4 rounded-lg">
      <h4 className="font-bold text-yellow-800">⚠️ Same Address, Different Balances</h4>
      <p className="text-sm text-yellow-700 mt-1">
        Your wallet address is the same on all networks, but each network 
        has <strong>separate balances</strong>. Tokens on Ethereum are not 
        accessible on Arbitrum, and vice versa.
      </p>
      <p className="text-sm text-yellow-700 mt-2">
        Always verify you're on the correct network before sending or receiving tokens.
      </p>
    </div>
  );
}
```

---

## Related Techniques

- [Wallet Connection](./wallet-connection.md)
- [Transaction Signing](./transaction-signing.md)
- [Gas Estimation](./gas-estimation.md)

## Related Guidelines

- [3.2 Predictable Behavior](../guidelines/understandable/3.2-predictable-behavior.md)
- [4.1 Assistive Technology](../guidelines/robust/4.1-assistive-technology.md)
- [1.2 Transaction Clarity](../guidelines/perceivable/1.2-transaction-clarity.md)
