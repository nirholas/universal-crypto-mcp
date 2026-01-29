import React, { useState, useRef, useEffect, useCallback } from 'react';

/**
 * W3AG Compliant Network Switcher Component
 * 
 * Conformance: Level AA
 * 
 * Success Criteria Met:
 * - 3.2.2: Network switching requires explicit confirmation
 * - 2.1.1: Fully keyboard navigable
 * - 4.1.1: Proper ARIA roles for combobox pattern
 * - 4.1.2: Network changes announced to screen readers
 * - 1.4.1: Status not indicated by color alone
 */

interface Network {
  chainId: number;
  name: string;
  shortName: string;
  icon?: string;
  nativeCurrency: {
    name: string;
    symbol: string;
    decimals: number;
  };
  rpcUrl?: string;
  blockExplorerUrl?: string;
  testnet?: boolean;
}

interface NetworkSwitcherProps {
  currentNetwork: Network;
  availableNetworks: Network[];
  onSwitch: (chainId: number) => Promise<void>;
  showConfirmation?: boolean;
  disabled?: boolean;
}

// Common networks with accessibility-friendly names
export const COMMON_NETWORKS: Network[] = [
  {
    chainId: 1,
    name: 'Ethereum Mainnet',
    shortName: 'Ethereum',
    nativeCurrency: { name: 'Ether', symbol: 'ETH', decimals: 18 },
  },
  {
    chainId: 42161,
    name: 'Arbitrum One',
    shortName: 'Arbitrum',
    nativeCurrency: { name: 'Ether', symbol: 'ETH', decimals: 18 },
  },
  {
    chainId: 10,
    name: 'Optimism',
    shortName: 'Optimism',
    nativeCurrency: { name: 'Ether', symbol: 'ETH', decimals: 18 },
  },
  {
    chainId: 8453,
    name: 'Base',
    shortName: 'Base',
    nativeCurrency: { name: 'Ether', symbol: 'ETH', decimals: 18 },
  },
  {
    chainId: 137,
    name: 'Polygon',
    shortName: 'Polygon',
    nativeCurrency: { name: 'MATIC', symbol: 'MATIC', decimals: 18 },
  },
];

export function NetworkSwitcher({
  currentNetwork,
  availableNetworks,
  onSwitch,
  showConfirmation = true,
  disabled = false,
}: NetworkSwitcherProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [highlightedIndex, setHighlightedIndex] = useState(0);
  const [pendingSwitch, setPendingSwitch] = useState<Network | null>(null);
  const [isSwitching, setIsSwitching] = useState(false);
  const [announcement, setAnnouncement] = useState('');
  const [error, setError] = useState<string | null>(null);

  const containerRef = useRef<HTMLDivElement>(null);
  const buttonRef = useRef<HTMLButtonElement>(null);
  const listRef = useRef<HTMLUListElement>(null);

  // Close on outside click
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Announce network changes
  useEffect(() => {
    setAnnouncement(`Currently connected to ${currentNetwork.name}`);
  }, [currentNetwork]);

  const handleKeyDown = useCallback((e: React.KeyboardEvent) => {
    if (disabled) return;

    switch (e.key) {
      case 'ArrowDown':
        e.preventDefault();
        if (!isOpen) {
          setIsOpen(true);
        } else {
          setHighlightedIndex(prev => 
            Math.min(prev + 1, availableNetworks.length - 1)
          );
        }
        break;

      case 'ArrowUp':
        e.preventDefault();
        if (isOpen) {
          setHighlightedIndex(prev => Math.max(prev - 1, 0));
        }
        break;

      case 'Enter':
      case ' ':
        e.preventDefault();
        if (!isOpen) {
          setIsOpen(true);
        } else {
          handleNetworkSelect(availableNetworks[highlightedIndex]);
        }
        break;

      case 'Escape':
        e.preventDefault();
        setIsOpen(false);
        buttonRef.current?.focus();
        break;

      case 'Tab':
        setIsOpen(false);
        break;

      case 'Home':
        e.preventDefault();
        setHighlightedIndex(0);
        break;

      case 'End':
        e.preventDefault();
        setHighlightedIndex(availableNetworks.length - 1);
        break;
    }
  }, [isOpen, highlightedIndex, availableNetworks, disabled]);

  // Scroll highlighted item into view
  useEffect(() => {
    if (isOpen && listRef.current) {
      const highlightedEl = listRef.current.children[highlightedIndex] as HTMLElement;
      highlightedEl?.scrollIntoView({ block: 'nearest' });
    }
  }, [highlightedIndex, isOpen]);

  const handleNetworkSelect = (network: Network) => {
    if (network.chainId === currentNetwork.chainId) {
      setIsOpen(false);
      setAnnouncement(`Already connected to ${network.name}`);
      return;
    }

    if (showConfirmation) {
      setPendingSwitch(network);
      setIsOpen(false);
    } else {
      executeSwitch(network);
    }
  };

  const executeSwitch = async (network: Network) => {
    setIsSwitching(true);
    setError(null);
    setAnnouncement(`Switching to ${network.name}. Please confirm in your wallet.`);

    try {
      await onSwitch(network.chainId);
      setAnnouncement(`Successfully switched to ${network.name}`);
      setPendingSwitch(null);
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Failed to switch network';
      setError(message);
      setAnnouncement(`Error: ${message}`);
    } finally {
      setIsSwitching(false);
    }
  };

  const cancelSwitch = () => {
    setPendingSwitch(null);
    setAnnouncement('Network switch cancelled');
    buttonRef.current?.focus();
  };

  const listboxId = 'network-switcher-listbox';

  return (
    <div ref={containerRef} className="w3ag-network-switcher">
      {/* Screen reader announcements */}
      <div 
        role="status" 
        aria-live="polite" 
        aria-atomic="true"
        className="sr-only"
      >
        {announcement}
      </div>

      {/* Current network indicator */}
      <div className="current-network-label" id="network-label">
        <span className="sr-only">Current network:</span>
      </div>

      {/* Network selector button */}
      <button
        ref={buttonRef}
        type="button"
        role="combobox"
        aria-expanded={isOpen}
        aria-haspopup="listbox"
        aria-controls={listboxId}
        aria-labelledby="network-label"
        aria-activedescendant={isOpen ? `network-option-${highlightedIndex}` : undefined}
        className={`network-button ${isOpen ? 'open' : ''}`}
        onClick={() => !disabled && setIsOpen(!isOpen)}
        onKeyDown={handleKeyDown}
        disabled={disabled || isSwitching}
        aria-busy={isSwitching}
      >
        {currentNetwork.icon && (
          <img 
            src={currentNetwork.icon} 
            alt="" 
            aria-hidden="true"
            className="network-icon"
          />
        )}
        <span className="network-name">{currentNetwork.shortName}</span>
        {currentNetwork.testnet && (
          <span className="testnet-badge" aria-label="Test network">
            Testnet
          </span>
        )}
        <span className="dropdown-arrow" aria-hidden="true">
          {isOpen ? '▲' : '▼'}
        </span>
      </button>

      {/* Network list dropdown */}
      {isOpen && (
        <ul
          ref={listRef}
          id={listboxId}
          role="listbox"
          aria-label="Select network"
          className="network-list"
        >
          {availableNetworks.map((network, index) => {
            const isSelected = network.chainId === currentNetwork.chainId;
            const isHighlighted = index === highlightedIndex;

            return (
              <li
                key={network.chainId}
                id={`network-option-${index}`}
                role="option"
                aria-selected={isSelected}
                className={`network-option ${isHighlighted ? 'highlighted' : ''} ${isSelected ? 'selected' : ''}`}
                onClick={() => handleNetworkSelect(network)}
                onMouseEnter={() => setHighlightedIndex(index)}
              >
                {network.icon && (
                  <img 
                    src={network.icon} 
                    alt="" 
                    aria-hidden="true"
                    className="network-icon"
                  />
                )}
                
                <div className="network-info">
                  <span className="network-name">{network.name}</span>
                  <span className="network-currency">
                    {network.nativeCurrency.symbol}
                  </span>
                </div>

                {network.testnet && (
                  <span className="testnet-badge">Testnet</span>
                )}

                {isSelected && (
                  <span className="selected-indicator" aria-hidden="true">
                    ✓
                  </span>
                )}

                <span className="sr-only">
                  {isSelected ? '(currently selected)' : ''}
                  {network.testnet ? ', test network' : ''}
                </span>
              </li>
            );
          })}
        </ul>
      )}

      {/* Error display */}
      {error && (
        <div role="alert" className="network-error">
          <span className="error-icon" aria-hidden="true">⚠️</span>
          <span>{error}</span>
          <button 
            onClick={() => setError(null)}
            aria-label="Dismiss error"
            className="dismiss-btn"
          >
            ✕
          </button>
        </div>
      )}

      {/* Confirmation dialog */}
      {pendingSwitch && (
        <NetworkSwitchConfirmation
          currentNetwork={currentNetwork}
          targetNetwork={pendingSwitch}
          onConfirm={() => executeSwitch(pendingSwitch)}
          onCancel={cancelSwitch}
          isSwitching={isSwitching}
        />
      )}
    </div>
  );
}

/**
 * Confirmation dialog for network switching
 */
interface NetworkSwitchConfirmationProps {
  currentNetwork: Network;
  targetNetwork: Network;
  onConfirm: () => void;
  onCancel: () => void;
  isSwitching: boolean;
}

function NetworkSwitchConfirmation({
  currentNetwork,
  targetNetwork,
  onConfirm,
  onCancel,
  isSwitching,
}: NetworkSwitchConfirmationProps) {
  const dialogRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const firstButton = dialogRef.current?.querySelector('button');
    firstButton?.focus();
  }, []);

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Escape') {
      onCancel();
    }
  };

  return (
    <>
      <div className="w3ag-dialog-backdrop" onClick={onCancel} aria-hidden="true" />
      
      <div
        ref={dialogRef}
        role="alertdialog"
        aria-modal="true"
        aria-labelledby="switch-title"
        aria-describedby="switch-desc"
        className="w3ag-network-switch-dialog"
        onKeyDown={handleKeyDown}
      >
        <h2 id="switch-title">Switch Network?</h2>
        
        <p id="switch-desc">
          You are about to change your active blockchain network.
        </p>

        <div className="network-comparison">
          <div className="network-from">
            <span className="label">Current</span>
            <span className="network-name">{currentNetwork.name}</span>
          </div>

          <span className="arrow" aria-hidden="true">→</span>

          <div className="network-to">
            <span className="label">Switching to</span>
            <span className="network-name">{targetNetwork.name}</span>
          </div>
        </div>

        {targetNetwork.testnet && (
          <div role="note" className="testnet-warning">
            <span aria-hidden="true">ℹ️</span>
            <span>
              {targetNetwork.name} is a test network. 
              Tokens have no real value.
            </span>
          </div>
        )}

        <div className="dialog-actions">
          <button
            onClick={onCancel}
            className="btn-cancel"
            disabled={isSwitching}
          >
            Cancel
          </button>
          
          <button
            onClick={onConfirm}
            className="btn-confirm"
            disabled={isSwitching}
            aria-busy={isSwitching}
          >
            {isSwitching ? 'Switching...' : `Switch to ${targetNetwork.shortName}`}
          </button>
        </div>
      </div>
    </>
  );
}

/**
 * CSS (add to your stylesheet):
 *
 * .w3ag-network-switcher {
 *   position: relative;
 *   display: inline-block;
 * }
 *
 * .network-button {
 *   display: flex;
 *   align-items: center;
 *   gap: 0.5rem;
 *   padding: 0.5rem 0.75rem;
 *   background: var(--bg-secondary);
 *   border: 1px solid var(--border-color);
 *   border-radius: 8px;
 *   cursor: pointer;
 *   font-size: 0.875rem;
 *   font-weight: 500;
 * }
 *
 * .network-button:hover:not(:disabled) {
 *   background: var(--bg-hover);
 * }
 *
 * .network-button:focus-visible {
 *   outline: 2px solid var(--color-focus);
 *   outline-offset: 2px;
 * }
 *
 * .network-button:disabled {
 *   opacity: 0.6;
 *   cursor: not-allowed;
 * }
 *
 * .network-icon {
 *   width: 20px;
 *   height: 20px;
 *   border-radius: 50%;
 * }
 *
 * .dropdown-arrow {
 *   font-size: 0.625rem;
 *   color: var(--text-secondary);
 * }
 *
 * .testnet-badge {
 *   font-size: 0.625rem;
 *   padding: 0.125rem 0.375rem;
 *   background: var(--bg-warning);
 *   color: var(--text-warning);
 *   border-radius: 4px;
 *   text-transform: uppercase;
 *   font-weight: 600;
 * }
 *
 * .network-list {
 *   position: absolute;
 *   top: 100%;
 *   left: 0;
 *   right: 0;
 *   min-width: 200px;
 *   max-height: 300px;
 *   overflow-y: auto;
 *   background: var(--bg-surface);
 *   border: 1px solid var(--border-color);
 *   border-radius: 8px;
 *   margin-top: 4px;
 *   padding: 0;
 *   list-style: none;
 *   z-index: 50;
 *   box-shadow: 0 4px 20px rgba(0, 0, 0, 0.15);
 * }
 *
 * .network-option {
 *   display: flex;
 *   align-items: center;
 *   gap: 0.75rem;
 *   padding: 0.75rem 1rem;
 *   cursor: pointer;
 * }
 *
 * .network-option:hover,
 * .network-option.highlighted {
 *   background: var(--bg-hover);
 * }
 *
 * .network-option.selected {
 *   background: var(--bg-selected);
 * }
 *
 * .network-option .network-info {
 *   flex: 1;
 *   display: flex;
 *   flex-direction: column;
 * }
 *
 * .network-option .network-currency {
 *   font-size: 0.75rem;
 *   color: var(--text-secondary);
 * }
 *
 * .selected-indicator {
 *   color: var(--color-success);
 * }
 *
 * .network-error {
 *   display: flex;
 *   align-items: center;
 *   gap: 0.5rem;
 *   padding: 0.75rem;
 *   margin-top: 0.5rem;
 *   background: var(--bg-danger-light);
 *   border-radius: 6px;
 *   font-size: 0.875rem;
 * }
 *
 * .dismiss-btn {
 *   background: none;
 *   border: none;
 *   cursor: pointer;
 *   padding: 0.25rem;
 *   margin-left: auto;
 * }
 *
 * .w3ag-network-switch-dialog {
 *   position: fixed;
 *   top: 50%;
 *   left: 50%;
 *   transform: translate(-50%, -50%);
 *   background: var(--bg-surface);
 *   border-radius: 12px;
 *   padding: 1.5rem;
 *   max-width: 360px;
 *   width: 90%;
 *   z-index: 101;
 *   box-shadow: 0 20px 60px rgba(0, 0, 0, 0.3);
 * }
 *
 * .network-comparison {
 *   display: flex;
 *   align-items: center;
 *   justify-content: space-between;
 *   gap: 1rem;
 *   padding: 1rem;
 *   background: var(--bg-secondary);
 *   border-radius: 8px;
 *   margin: 1rem 0;
 * }
 *
 * .network-from,
 * .network-to {
 *   display: flex;
 *   flex-direction: column;
 *   gap: 0.25rem;
 * }
 *
 * .network-comparison .label {
 *   font-size: 0.75rem;
 *   color: var(--text-secondary);
 * }
 *
 * .network-comparison .arrow {
 *   font-size: 1.25rem;
 *   color: var(--text-secondary);
 * }
 *
 * .testnet-warning {
 *   display: flex;
 *   gap: 0.5rem;
 *   padding: 0.75rem;
 *   background: var(--bg-info);
 *   border-radius: 6px;
 *   font-size: 0.875rem;
 *   margin-bottom: 1rem;
 * }
 *
 * .w3ag-network-switch-dialog .dialog-actions {
 *   display: flex;
 *   gap: 0.75rem;
 * }
 *
 * .btn-cancel,
 * .btn-confirm {
 *   flex: 1;
 *   padding: 0.75rem;
 *   border-radius: 8px;
 *   font-weight: 600;
 *   cursor: pointer;
 * }
 *
 * .btn-cancel {
 *   background: var(--bg-secondary);
 *   border: 1px solid var(--border-color);
 * }
 *
 * .btn-confirm {
 *   background: var(--color-primary);
 *   color: white;
 *   border: none;
 * }
 *
 * .btn-confirm:focus-visible,
 * .btn-cancel:focus-visible {
 *   outline: 2px solid var(--color-focus);
 *   outline-offset: 2px;
 * }
 */

export default NetworkSwitcher;
