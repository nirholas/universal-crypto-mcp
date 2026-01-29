import React, { useEffect, useRef, useState, useCallback } from 'react';

/**
 * W3AG Compliant Wallet Connection Modal
 * 
 * Conformance: Level AA
 * 
 * Success Criteria Met:
 * - 2.1.1: Fully keyboard navigable
 * - 2.1.2: Proper focus trapping
 * - 2.1.3: QR code has copy link alternative
 * - 4.1.1: Proper ARIA roles and states
 */

interface Wallet {
  id: string;
  name: string;
  icon: string;
  installed: boolean;
  type: 'injected' | 'walletconnect' | 'coinbase';
}

interface WalletModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConnect: (walletId: string) => Promise<void>;
  wallets: Wallet[];
  walletConnectUri?: string;
}

export function WalletModal({
  isOpen,
  onClose,
  onConnect,
  wallets,
  walletConnectUri,
}: WalletModalProps) {
  const modalRef = useRef<HTMLDivElement>(null);
  const triggerRef = useRef<HTMLElement | null>(null);
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [connecting, setConnecting] = useState<string | null>(null);
  const [showQrAlternative, setShowQrAlternative] = useState(false);
  const [announcement, setAnnouncement] = useState('');

  // Store trigger element and focus first focusable on open
  useEffect(() => {
    if (isOpen) {
      triggerRef.current = document.activeElement as HTMLElement;
      // Focus first wallet option
      const firstButton = modalRef.current?.querySelector('button[role="option"]') as HTMLButtonElement;
      firstButton?.focus();
      setAnnouncement('Wallet connection dialog opened. Use arrow keys to navigate wallets.');
    } else {
      // Return focus to trigger
      triggerRef.current?.focus();
      setAnnouncement('');
    }
  }, [isOpen]);

  // Focus trap
  const handleKeyDown = useCallback((e: React.KeyboardEvent) => {
    if (e.key === 'Escape') {
      onClose();
      return;
    }

    if (e.key === 'Tab') {
      const focusable = modalRef.current?.querySelectorAll(
        'button:not([disabled]), [href], input:not([disabled]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])'
      );
      
      if (!focusable?.length) return;
      
      const first = focusable[0] as HTMLElement;
      const last = focusable[focusable.length - 1] as HTMLElement;
      
      if (e.shiftKey && document.activeElement === first) {
        e.preventDefault();
        last.focus();
      } else if (!e.shiftKey && document.activeElement === last) {
        e.preventDefault();
        first.focus();
      }
    }

    // Arrow key navigation for wallet list
    if (e.key === 'ArrowDown' || e.key === 'ArrowUp') {
      e.preventDefault();
      const newIndex = e.key === 'ArrowDown'
        ? Math.min(selectedIndex + 1, wallets.length - 1)
        : Math.max(selectedIndex - 1, 0);
      
      setSelectedIndex(newIndex);
      
      // Focus the new item
      const items = modalRef.current?.querySelectorAll('button[role="option"]');
      (items?.[newIndex] as HTMLButtonElement)?.focus();
    }

    // Select with Enter/Space
    if ((e.key === 'Enter' || e.key === ' ') && e.target instanceof HTMLButtonElement) {
      if (e.target.getAttribute('role') === 'option') {
        e.preventDefault();
        handleWalletSelect(wallets[selectedIndex].id);
      }
    }
  }, [onClose, selectedIndex, wallets]);

  const handleWalletSelect = async (walletId: string) => {
    const wallet = wallets.find(w => w.id === walletId);
    if (!wallet) return;

    if (!wallet.installed && wallet.type === 'injected') {
      setAnnouncement(`${wallet.name} is not installed. Please install it first.`);
      return;
    }

    setConnecting(walletId);
    setAnnouncement(`Connecting to ${wallet.name}. Please check your wallet.`);

    try {
      await onConnect(walletId);
      setAnnouncement(`Successfully connected to ${wallet.name}.`);
      onClose();
    } catch (error) {
      setAnnouncement(`Failed to connect to ${wallet.name}. Please try again.`);
    } finally {
      setConnecting(null);
    }
  };

  const copyWalletConnectUri = async () => {
    if (!walletConnectUri) return;
    
    try {
      await navigator.clipboard.writeText(walletConnectUri);
      setAnnouncement('Connection link copied to clipboard. Paste it in your mobile wallet.');
    } catch (error) {
      setAnnouncement('Failed to copy link.');
    }
  };

  if (!isOpen) return null;

  return (
    <>
      {/* Backdrop */}
      <div 
        className="w3ag-modal-backdrop"
        onClick={onClose}
        aria-hidden="true"
      />
      
      {/* Modal */}
      <div
        ref={modalRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby="wallet-modal-title"
        aria-describedby="wallet-modal-desc"
        className="w3ag-wallet-modal"
        onKeyDown={handleKeyDown}
      >
        {/* Screen reader announcements */}
        <div 
          role="status" 
          aria-live="polite" 
          aria-atomic="true"
          className="sr-only"
        >
          {announcement}
        </div>

        {/* Header */}
        <header className="modal-header">
          <h2 id="wallet-modal-title">Connect Wallet</h2>
          <p id="wallet-modal-desc" className="sr-only">
            Choose a wallet to connect. Use arrow keys to navigate, Enter to select, Escape to close.
          </p>
          <button
            type="button"
            onClick={onClose}
            className="close-button"
            aria-label="Close wallet connection dialog"
          >
            ✕
          </button>
        </header>

        {/* Wallet List */}
        <div 
          role="listbox" 
          aria-label="Available wallets"
          className="wallet-list"
        >
          {wallets.map((wallet, index) => (
            <button
              key={wallet.id}
              role="option"
              aria-selected={selectedIndex === index}
              aria-disabled={!wallet.installed && wallet.type === 'injected'}
              className={`wallet-option ${selectedIndex === index ? 'selected' : ''}`}
              onClick={() => handleWalletSelect(wallet.id)}
              disabled={connecting !== null}
            >
              <img 
                src={wallet.icon} 
                alt="" 
                aria-hidden="true"
                className="wallet-icon"
              />
              <span className="wallet-name">{wallet.name}</span>
              
              {connecting === wallet.id && (
                <span className="connecting-indicator" aria-hidden="true">
                  Connecting...
                </span>
              )}
              
              {!wallet.installed && wallet.type === 'injected' && (
                <span className="not-installed">Not installed</span>
              )}
            </button>
          ))}
        </div>

        {/* WalletConnect QR Alternative */}
        {walletConnectUri && (
          <div className="qr-section">
            <div role="tablist" className="qr-tabs">
              <button
                role="tab"
                aria-selected={!showQrAlternative}
                onClick={() => setShowQrAlternative(false)}
              >
                QR Code
              </button>
              <button
                role="tab"
                aria-selected={showQrAlternative}
                onClick={() => setShowQrAlternative(true)}
              >
                Copy Link
              </button>
            </div>

            {!showQrAlternative ? (
              <div role="tabpanel" className="qr-panel">
                <img 
                  src={`https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=${encodeURIComponent(walletConnectUri)}`}
                  alt="WalletConnect QR code. Alternatively, use Copy Link tab for a text link."
                  className="qr-code"
                />
                <p>Scan with your mobile wallet</p>
              </div>
            ) : (
              <div role="tabpanel" className="link-panel">
                <div className="link-input-group">
                  <input
                    type="text"
                    value={walletConnectUri}
                    readOnly
                    aria-label="WalletConnect connection link"
                    className="link-input"
                  />
                  <button
                    onClick={copyWalletConnectUri}
                    className="copy-button"
                    aria-label="Copy connection link to clipboard"
                  >
                    Copy
                  </button>
                </div>
                <p>Paste this link in your mobile wallet app</p>
              </div>
            )}
          </div>
        )}

        {/* Help text */}
        <footer className="modal-footer">
          <p>
            New to wallets?{' '}
            <a 
              href="https://ethereum.org/wallets" 
              target="_blank" 
              rel="noopener noreferrer"
            >
              Learn more about wallets
            </a>
          </p>
        </footer>
      </div>
    </>
  );
}

/**
 * CSS (add to your stylesheet):
 * 
 * .w3ag-modal-backdrop {
 *   position: fixed;
 *   inset: 0;
 *   background: rgba(0, 0, 0, 0.5);
 *   z-index: 100;
 * }
 * 
 * .w3ag-wallet-modal {
 *   position: fixed;
 *   top: 50%;
 *   left: 50%;
 *   transform: translate(-50%, -50%);
 *   background: var(--bg-surface);
 *   border-radius: 16px;
 *   padding: 1.5rem;
 *   max-width: 400px;
 *   width: 90%;
 *   max-height: 90vh;
 *   overflow-y: auto;
 *   z-index: 101;
 * }
 * 
 * .modal-header {
 *   display: flex;
 *   justify-content: space-between;
 *   align-items: center;
 *   margin-bottom: 1.5rem;
 * }
 * 
 * .close-button {
 *   background: none;
 *   border: none;
 *   font-size: 1.5rem;
 *   cursor: pointer;
 *   padding: 0.25rem;
 * }
 * 
 * .close-button:focus-visible {
 *   outline: 2px solid var(--color-focus);
 *   outline-offset: 2px;
 * }
 * 
 * .wallet-list {
 *   display: flex;
 *   flex-direction: column;
 *   gap: 0.5rem;
 * }
 * 
 * .wallet-option {
 *   display: flex;
 *   align-items: center;
 *   gap: 0.75rem;
 *   padding: 0.875rem;
 *   border: 1px solid var(--border-color);
 *   border-radius: 12px;
 *   background: var(--bg-primary);
 *   cursor: pointer;
 *   text-align: left;
 *   width: 100%;
 * }
 * 
 * .wallet-option:hover,
 * .wallet-option.selected {
 *   border-color: var(--color-primary);
 *   background: var(--bg-hover);
 * }
 * 
 * .wallet-option:focus-visible {
 *   outline: 2px solid var(--color-focus);
 *   outline-offset: 2px;
 * }
 * 
 * .wallet-option[aria-disabled="true"] {
 *   opacity: 0.6;
 *   cursor: not-allowed;
 * }
 * 
 * .wallet-icon {
 *   width: 40px;
 *   height: 40px;
 *   border-radius: 8px;
 * }
 * 
 * .wallet-name {
 *   flex: 1;
 *   font-weight: 500;
 * }
 * 
 * .not-installed {
 *   font-size: 0.875rem;
 *   color: var(--text-secondary);
 * }
 * 
 * .connecting-indicator {
 *   font-size: 0.875rem;
 *   color: var(--color-primary);
 * }
 * 
 * .qr-section {
 *   margin-top: 1.5rem;
 *   padding-top: 1.5rem;
 *   border-top: 1px solid var(--border-color);
 * }
 * 
 * .qr-tabs {
 *   display: flex;
 *   gap: 0.5rem;
 *   margin-bottom: 1rem;
 * }
 * 
 * .qr-tabs button {
 *   flex: 1;
 *   padding: 0.5rem;
 *   border: 1px solid var(--border-color);
 *   border-radius: 8px;
 *   background: transparent;
 *   cursor: pointer;
 * }
 * 
 * .qr-tabs button[aria-selected="true"] {
 *   background: var(--color-primary);
 *   color: white;
 *   border-color: var(--color-primary);
 * }
 * 
 * .qr-panel {
 *   text-align: center;
 * }
 * 
 * .qr-code {
 *   margin: 1rem auto;
 *   border-radius: 12px;
 * }
 * 
 * .link-input-group {
 *   display: flex;
 *   gap: 0.5rem;
 * }
 * 
 * .link-input {
 *   flex: 1;
 *   padding: 0.5rem;
 *   border: 1px solid var(--border-color);
 *   border-radius: 8px;
 *   font-family: monospace;
 *   font-size: 0.75rem;
 * }
 * 
 * .copy-button {
 *   padding: 0.5rem 1rem;
 *   background: var(--color-primary);
 *   color: white;
 *   border: none;
 *   border-radius: 8px;
 *   cursor: pointer;
 * }
 * 
 * .modal-footer {
 *   margin-top: 1.5rem;
 *   text-align: center;
 *   font-size: 0.875rem;
 *   color: var(--text-secondary);
 * }
 */

export default WalletModal;
