import React, { useState, useCallback, useEffect, useRef, useMemo, Fragment } from 'react';
import type { Chain } from 'viem';

/**
 * W3AG Compliant Network Switcher
 * 
 * Conformance: Level AA
 * 
 * Success Criteria Met:
 * - 3.2.1: No context change without explicit confirmation
 * - 3.2.2: Wrong network clearly indicated
 * - 4.1.1: ARIA combobox pattern for assistive technology
 * - 4.1.2: Network changes announced to screen readers
 * - 2.1.1: Full keyboard navigation with arrow keys
 * - 1.4.1: Network visual identifiers with text alternatives
 */

// =============================================================================
// Types
// =============================================================================

export interface NetworkInfo {
  id: number;
  name: string;
  displayName?: string;
  isTestnet?: boolean;
  iconUrl?: string;
  nativeCurrency: {
    name: string;
    symbol: string;
    decimals: number;
  };
  rpcUrls: {
    default: {
      http: readonly string[];
    };
  };
  blockExplorers?: {
    default: {
      name: string;
      url: string;
    };
  };
}

export interface NetworkSwitcherProps {
  /** Currently connected network ID */
  currentNetworkId: number | undefined;
  /** Network required by the dApp (if any) */
  requiredNetworkId?: number;
  /** List of supported networks */
  networks: NetworkInfo[];
  /** Callback when network switch is requested */
  onNetworkSwitch: (networkId: number) => Promise<void>;
  /** Whether the wallet is connected */
  isConnected: boolean;
  /** Whether a network switch is in progress */
  isSwitching?: boolean;
  /** Error message if switch failed */
  switchError?: string | null;
  /** Custom class name */
  className?: string;
  /** Whether to show network icons */
  showIcons?: boolean;
  /** Whether to require confirmation before switching */
  requireConfirmation?: boolean;
  /** Custom label for screen readers */
  'aria-label'?: string;
}

// =============================================================================
// Common Networks (Pre-configured)
// =============================================================================

export const COMMON_NETWORKS: NetworkInfo[] = [
  {
    id: 1,
    name: 'mainnet',
    displayName: 'Ethereum',
    nativeCurrency: { name: 'Ether', symbol: 'ETH', decimals: 18 },
    rpcUrls: { default: { http: ['https://eth.llamarpc.com'] } },
    blockExplorers: { default: { name: 'Etherscan', url: 'https://etherscan.io' } },
  },
  {
    id: 42161,
    name: 'arbitrum',
    displayName: 'Arbitrum One',
    nativeCurrency: { name: 'Ether', symbol: 'ETH', decimals: 18 },
    rpcUrls: { default: { http: ['https://arb1.arbitrum.io/rpc'] } },
    blockExplorers: { default: { name: 'Arbiscan', url: 'https://arbiscan.io' } },
  },
  {
    id: 10,
    name: 'optimism',
    displayName: 'OP Mainnet',
    nativeCurrency: { name: 'Ether', symbol: 'ETH', decimals: 18 },
    rpcUrls: { default: { http: ['https://mainnet.optimism.io'] } },
    blockExplorers: { default: { name: 'Optimism Explorer', url: 'https://optimistic.etherscan.io' } },
  },
  {
    id: 8453,
    name: 'base',
    displayName: 'Base',
    nativeCurrency: { name: 'Ether', symbol: 'ETH', decimals: 18 },
    rpcUrls: { default: { http: ['https://mainnet.base.org'] } },
    blockExplorers: { default: { name: 'BaseScan', url: 'https://basescan.org' } },
  },
  {
    id: 137,
    name: 'polygon',
    displayName: 'Polygon',
    nativeCurrency: { name: 'POL', symbol: 'POL', decimals: 18 },
    rpcUrls: { default: { http: ['https://polygon-rpc.com'] } },
    blockExplorers: { default: { name: 'PolygonScan', url: 'https://polygonscan.com' } },
  },
];

// =============================================================================
// Component
// =============================================================================

export function NetworkSwitcher({
  currentNetworkId,
  requiredNetworkId,
  networks,
  onNetworkSwitch,
  isConnected,
  isSwitching = false,
  switchError = null,
  className = '',
  showIcons = true,
  requireConfirmation = true,
  'aria-label': ariaLabel,
}: NetworkSwitcherProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const listboxRef = useRef<HTMLUListElement>(null);
  const buttonRef = useRef<HTMLButtonElement>(null);
  
  const [isOpen, setIsOpen] = useState(false);
  const [activeIndex, setActiveIndex] = useState(-1);
  const [announcement, setAnnouncement] = useState('');
  const [pendingNetworkId, setPendingNetworkId] = useState<number | null>(null);
  const [showConfirmDialog, setShowConfirmDialog] = useState(false);

  // Get current network info
  const currentNetwork = useMemo(
    () => networks.find((n) => n.id === currentNetworkId),
    [networks, currentNetworkId]
  );

  // Get required network info
  const requiredNetwork = useMemo(
    () => (requiredNetworkId ? networks.find((n) => n.id === requiredNetworkId) : undefined),
    [networks, requiredNetworkId]
  );

  // Is user on wrong network?
  const isWrongNetwork = useMemo(
    () => requiredNetworkId !== undefined && currentNetworkId !== requiredNetworkId,
    [requiredNetworkId, currentNetworkId]
  );

  // Handle click outside to close
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    };

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
      return () => document.removeEventListener('mousedown', handleClickOutside);
    }
  }, [isOpen]);

  // Announce wrong network status
  useEffect(() => {
    if (isWrongNetwork && requiredNetwork) {
      setAnnouncement(
        `Warning: You are connected to ${currentNetwork?.displayName || 'an unsupported network'}. ` +
        `This application requires ${requiredNetwork.displayName}. ` +
        `Please switch networks to continue.`
      );
    }
  }, [isWrongNetwork, currentNetwork, requiredNetwork]);

  // Announce switch result
  useEffect(() => {
    if (switchError) {
      setAnnouncement(`Network switch failed: ${switchError}`);
    }
  }, [switchError]);

  // Toggle dropdown
  const toggleDropdown = useCallback(() => {
    setIsOpen((prev) => !prev);
    if (!isOpen) {
      const currentIndex = networks.findIndex((n) => n.id === currentNetworkId);
      setActiveIndex(currentIndex >= 0 ? currentIndex : 0);
    }
  }, [isOpen, networks, currentNetworkId]);

  // Handle network selection
  const selectNetwork = useCallback(async (network: NetworkInfo) => {
    if (network.id === currentNetworkId) {
      setIsOpen(false);
      return;
    }

    if (requireConfirmation) {
      setPendingNetworkId(network.id);
      setShowConfirmDialog(true);
      setIsOpen(false);
    } else {
      await performSwitch(network.id);
    }
  }, [currentNetworkId, requireConfirmation]);

  // Actually perform the switch
  const performSwitch = useCallback(async (networkId: number) => {
    const network = networks.find((n) => n.id === networkId);
    if (!network) return;

    setAnnouncement(`Switching to ${network.displayName || network.name}. Please confirm in your wallet.`);
    
    try {
      await onNetworkSwitch(networkId);
      setAnnouncement(`Successfully switched to ${network.displayName || network.name}.`);
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Unknown error';
      setAnnouncement(`Failed to switch network: ${message}`);
    }

    setShowConfirmDialog(false);
    setPendingNetworkId(null);
    buttonRef.current?.focus();
  }, [networks, onNetworkSwitch]);

  // Cancel switch
  const cancelSwitch = useCallback(() => {
    setShowConfirmDialog(false);
    setPendingNetworkId(null);
    setAnnouncement('Network switch cancelled.');
    buttonRef.current?.focus();
  }, []);

  // Keyboard navigation
  const handleKeyDown = useCallback((e: React.KeyboardEvent) => {
    switch (e.key) {
      case 'ArrowDown':
        e.preventDefault();
        if (!isOpen) {
          setIsOpen(true);
          setActiveIndex(0);
        } else {
          setActiveIndex((prev) => Math.min(prev + 1, networks.length - 1));
        }
        break;
        
      case 'ArrowUp':
        e.preventDefault();
        if (isOpen) {
          setActiveIndex((prev) => Math.max(prev - 1, 0));
        }
        break;
        
      case 'Enter':
      case ' ':
        e.preventDefault();
        if (isOpen && activeIndex >= 0) {
          selectNetwork(networks[activeIndex]);
        } else {
          toggleDropdown();
        }
        break;
        
      case 'Escape':
        e.preventDefault();
        setIsOpen(false);
        buttonRef.current?.focus();
        break;
        
      case 'Home':
        e.preventDefault();
        if (isOpen) setActiveIndex(0);
        break;
        
      case 'End':
        e.preventDefault();
        if (isOpen) setActiveIndex(networks.length - 1);
        break;
        
      case 'Tab':
        if (isOpen) {
          setIsOpen(false);
        }
        break;
    }
  }, [isOpen, activeIndex, networks, selectNetwork, toggleDropdown]);

  // Scroll active option into view
  useEffect(() => {
    if (isOpen && activeIndex >= 0 && listboxRef.current) {
      const option = listboxRef.current.children[activeIndex] as HTMLElement;
      option?.scrollIntoView({ block: 'nearest' });
    }
  }, [isOpen, activeIndex]);

  if (!isConnected) {
    return (
      <div className={`w3ag-network-switcher ${className}`}>
        <span className="w3ag-network-disconnected" aria-live="polite">
          Wallet not connected
        </span>
      </div>
    );
  }

  const pendingNetwork = pendingNetworkId ? networks.find((n) => n.id === pendingNetworkId) : undefined;

  return (
    <>
      <div ref={containerRef} className={`w3ag-network-switcher ${className}`}>
        {/* Live announcements */}
        <div
          role="status"
          aria-live="assertive"
          aria-atomic="true"
          className="sr-only"
        >
          {announcement}
        </div>

        {/* Wrong network warning banner */}
        {isWrongNetwork && requiredNetwork && (
          <div 
            role="alert"
            className="w3ag-wrong-network-alert"
          >
            <WarningIcon className="w3ag-icon" />
            <span>
              Wrong network. Please switch to{' '}
              <strong>{requiredNetwork.displayName || requiredNetwork.name}</strong>
            </span>
            <button
              onClick={() => selectNetwork(requiredNetwork)}
              className="w3ag-switch-button"
              disabled={isSwitching}
            >
              Switch now
            </button>
          </div>
        )}

        {/* Network selector combobox */}
        <div className="w3ag-combobox-container">
          <button
            ref={buttonRef}
            role="combobox"
            aria-expanded={isOpen}
            aria-haspopup="listbox"
            aria-controls="network-listbox"
            aria-label={ariaLabel || `Select network. Current: ${currentNetwork?.displayName || 'Unknown'}`}
            aria-activedescendant={isOpen && activeIndex >= 0 ? `network-option-${networks[activeIndex]?.id}` : undefined}
            onClick={toggleDropdown}
            onKeyDown={handleKeyDown}
            disabled={isSwitching}
            className={`w3ag-network-button ${isWrongNetwork ? 'w3ag-network-button-warning' : ''}`}
          >
            {currentNetwork ? (
              <>
                {showIcons && currentNetwork.iconUrl && (
                  <img
                    src={currentNetwork.iconUrl}
                    alt=""
                    className="w3ag-network-icon"
                    aria-hidden="true"
                  />
                )}
                {showIcons && !currentNetwork.iconUrl && (
                  <span className="w3ag-network-icon-placeholder" aria-hidden="true">
                    {currentNetwork.displayName?.charAt(0) || currentNetwork.name.charAt(0)}
                  </span>
                )}
                <span className="w3ag-network-name">
                  {currentNetwork.displayName || currentNetwork.name}
                </span>
              </>
            ) : (
              <span className="w3ag-network-unknown">
                Unknown Network
              </span>
            )}
            
            {isSwitching ? (
              <LoadingSpinner className="w3ag-dropdown-icon" />
            ) : (
              <ChevronIcon className={`w3ag-dropdown-icon ${isOpen ? 'w3ag-dropdown-icon-open' : ''}`} />
            )}
          </button>

          {/* Network options listbox */}
          {isOpen && (
            <ul
              ref={listboxRef}
              id="network-listbox"
              role="listbox"
              aria-label="Available networks"
              className="w3ag-network-listbox"
            >
              {networks.map((network, index) => {
                const isSelected = network.id === currentNetworkId;
                const isActive = index === activeIndex;
                
                return (
                  <li
                    key={network.id}
                    id={`network-option-${network.id}`}
                    role="option"
                    aria-selected={isSelected}
                    onClick={() => selectNetwork(network)}
                    className={`w3ag-network-option ${isActive ? 'w3ag-network-option-active' : ''} ${isSelected ? 'w3ag-network-option-selected' : ''}`}
                  >
                    {showIcons && network.iconUrl && (
                      <img
                        src={network.iconUrl}
                        alt=""
                        className="w3ag-network-icon"
                        aria-hidden="true"
                      />
                    )}
                    {showIcons && !network.iconUrl && (
                      <span className="w3ag-network-icon-placeholder" aria-hidden="true">
                        {network.displayName?.charAt(0) || network.name.charAt(0)}
                      </span>
                    )}
                    
                    <span className="w3ag-network-option-content">
                      <span className="w3ag-network-option-name">
                        {network.displayName || network.name}
                      </span>
                      {network.isTestnet && (
                        <span className="w3ag-badge w3ag-badge-testnet">Testnet</span>
                      )}
                    </span>
                    
                    {isSelected && (
                      <CheckIcon className="w3ag-check-icon" aria-hidden="true" />
                    )}
                  </li>
                );
              })}
            </ul>
          )}
        </div>

        {/* Error display */}
        {switchError && (
          <div role="alert" className="w3ag-network-error">
            <span className="sr-only">Error: </span>
            {switchError}
          </div>
        )}
      </div>

      {/* Confirmation Dialog */}
      {showConfirmDialog && pendingNetwork && (
        <div
          className="w3ag-modal-backdrop"
          onClick={cancelSwitch}
          aria-hidden="true"
        />
      )}
      {showConfirmDialog && pendingNetwork && (
        <div
          role="alertdialog"
          aria-modal="true"
          aria-labelledby="confirm-switch-title"
          aria-describedby="confirm-switch-desc"
          className="w3ag-confirm-dialog"
        >
          <h2 id="confirm-switch-title" className="w3ag-confirm-title">
            Switch Network?
          </h2>
          <p id="confirm-switch-desc" className="w3ag-confirm-description">
            You are about to switch from{' '}
            <strong>{currentNetwork?.displayName || 'your current network'}</strong> to{' '}
            <strong>{pendingNetwork.displayName || pendingNetwork.name}</strong>.
          </p>
          
          <div className="w3ag-confirm-info">
            <p>This will:</p>
            <ul>
              <li>Change which blockchain your wallet interacts with</li>
              <li>Show assets and transactions from {pendingNetwork.displayName || pendingNetwork.name}</li>
              <li>Use {pendingNetwork.nativeCurrency.symbol} for gas fees</li>
            </ul>
          </div>
          
          <div className="w3ag-confirm-actions">
            <button
              onClick={cancelSwitch}
              className="w3ag-button w3ag-button-secondary"
            >
              Cancel
            </button>
            <button
              onClick={() => performSwitch(pendingNetwork.id)}
              className="w3ag-button w3ag-button-primary"
            >
              Yes, switch to {pendingNetwork.displayName || pendingNetwork.name}
            </button>
          </div>
        </div>
      )}
    </>
  );
}

// =============================================================================
// Icon Components
// =============================================================================

function ChevronIcon({ className }: { className?: string }) {
  return (
    <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
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

function WarningIcon({ className }: { className?: string }) {
  return (
    <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} 
        d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
    </svg>
  );
}

function LoadingSpinner({ className }: { className?: string }) {
  return (
    <svg className={`w3ag-spinner ${className || ''}`} fill="none" viewBox="0 0 24 24" aria-hidden="true">
      <circle className="w3ag-spinner-track" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
      <path className="w3ag-spinner-head" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
    </svg>
  );
}

export default NetworkSwitcher;
