import React, { useState, useCallback, useEffect, useRef, useMemo } from 'react';
import { formatUnits, parseUnits, maxUint256 } from 'viem';

/**
 * W3AG Compliant Token Approval Dialog
 * 
 * Conformance: Level AA
 * 
 * Success Criteria Met:
 * - 3.4.1: Risk clearly communicated (unlimited approval warning)
 * - 3.4.2: Spender verification shown
 * - 3.1.1: Plain language explanations
 * - 2.1.1: Fully keyboard navigable
 * - 4.1.1: Proper ARIA roles and states
 * - 4.1.2: Status changes announced
 */

// =============================================================================
// Types
// =============================================================================

export interface TokenInfo {
  address: `0x${string}`;
  symbol: string;
  name: string;
  decimals: number;
  balance: bigint;
  logoUrl?: string;
}

export interface SpenderInfo {
  address: `0x${string}`;
  name: string;
  verified: boolean;
  riskLevel: 'low' | 'medium' | 'high' | 'unknown';
  explorerUrl?: string;
}

export interface TokenApprovalDialogProps {
  /** Whether the dialog is open */
  isOpen: boolean;
  /** Callback when dialog should close */
  onClose: () => void;
  /** Callback when approval is confirmed, receives the amount */
  onApprove: (amount: bigint) => Promise<void>;
  /** Token being approved */
  token: TokenInfo;
  /** Contract that will receive spending permission */
  spender: SpenderInfo;
  /** Amount requested by the dApp */
  requestedAmount: bigint;
  /** Chain ID for explorer links */
  chainId: number;
}

type ApprovalType = 'exact' | 'unlimited' | 'custom';

// =============================================================================
// Component
// =============================================================================

export function TokenApprovalDialog({
  isOpen,
  onClose,
  onApprove,
  token,
  spender,
  requestedAmount,
  chainId,
}: TokenApprovalDialogProps) {
  const modalRef = useRef<HTMLDivElement>(null);
  const triggerRef = useRef<HTMLElement | null>(null);
  const firstInputRef = useRef<HTMLInputElement>(null);
  
  const [approvalType, setApprovalType] = useState<ApprovalType>('exact');
  const [customAmount, setCustomAmount] = useState('');
  const [isApproving, setIsApproving] = useState(false);
  const [announcement, setAnnouncement] = useState('');
  const [showUnlimitedWarning, setShowUnlimitedWarning] = useState(false);

  // Calculate approval amount based on selection
  const approvalAmount = useMemo(() => {
    switch (approvalType) {
      case 'exact':
        return requestedAmount;
      case 'unlimited':
        return maxUint256;
      case 'custom':
        try {
          return parseUnits(customAmount || '0', token.decimals);
        } catch {
          return BigInt(0);
        }
    }
  }, [approvalType, requestedAmount, customAmount, token.decimals]);

  // Format for display
  const formattedRequestedAmount = formatUnits(requestedAmount, token.decimals);
  const formattedBalance = formatUnits(token.balance, token.decimals);

  // Focus management
  useEffect(() => {
    if (isOpen) {
      triggerRef.current = document.activeElement as HTMLElement;
      
      setAnnouncement(
        `Token approval request dialog. ${spender.name} wants permission to ` +
        `spend your ${token.symbol} tokens. ` +
        `Requested amount: ${formattedRequestedAmount} ${token.symbol}. ` +
        `Your balance: ${formattedBalance} ${token.symbol}. ` +
        `${spender.verified ? 'Contract is verified.' : 'Warning: Contract is not verified.'}`
      );
      
      setTimeout(() => firstInputRef.current?.focus(), 100);
    } else {
      triggerRef.current?.focus();
      setApprovalType('exact');
      setShowUnlimitedWarning(false);
    }
  }, [isOpen, spender, token, formattedRequestedAmount, formattedBalance]);

  // Handle approval type change
  const handleTypeChange = useCallback((type: ApprovalType) => {
    setApprovalType(type);
    
    if (type === 'unlimited') {
      setShowUnlimitedWarning(true);
      setAnnouncement(
        'Warning: Unlimited approval selected. This contract could drain ' +
        `all your ${token.symbol} at any time. This is not recommended.`
      );
    } else {
      setShowUnlimitedWarning(false);
      if (type === 'exact') {
        setAnnouncement(
          `Exact amount selected: ${formattedRequestedAmount} ${token.symbol}. ` +
          'This is the recommended option.'
        );
      }
    }
  }, [token.symbol, formattedRequestedAmount]);

  // Keyboard handling
  const handleKeyDown = useCallback((e: React.KeyboardEvent) => {
    if (e.key === 'Escape') {
      e.preventDefault();
      onClose();
    }
    
    // Focus trap
    if (e.key === 'Tab') {
      const focusable = modalRef.current?.querySelectorAll<HTMLElement>(
        'button:not([disabled]), input:not([disabled]), [tabindex]:not([tabindex="-1"])'
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
    }
  }, [onClose]);

  // Handle approval
  const handleApprove = useCallback(async () => {
    if (approvalType === 'unlimited') {
      const confirmed = window.confirm(
        `Are you absolutely sure you want to give ${spender.name} ` +
        `unlimited access to your ${token.symbol}? This is risky.`
      );
      if (!confirmed) return;
    }

    setIsApproving(true);
    setAnnouncement(`Approving ${token.symbol}. Please check your wallet.`);

    try {
      await onApprove(approvalAmount);
      setAnnouncement(
        `Approval successful. ${spender.name} can now spend ` +
        `${approvalType === 'unlimited' ? 'unlimited' : formatUnits(approvalAmount, token.decimals)} ` +
        `${token.symbol}. Remember to revoke this approval when no longer needed.`
      );
      setTimeout(onClose, 2000);
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Unknown error';
      setAnnouncement(`Approval failed: ${message}`);
    } finally {
      setIsApproving(false);
    }
  }, [approvalType, approvalAmount, token, spender, onApprove, onClose]);

  // Truncate address for display
  const truncateAddress = (address: string): string => {
    return `${address.slice(0, 6)}...${address.slice(-4)}`;
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
        role="alertdialog"
        aria-modal="true"
        aria-labelledby="approval-title"
        aria-describedby="approval-description"
        className="w3ag-modal"
        onKeyDown={handleKeyDown}
      >
        {/* Live announcements */}
        <div
          role="status"
          aria-live="assertive"
          aria-atomic="true"
          className="sr-only"
        >
          {announcement}
        </div>

        {/* Header */}
        <div className="w3ag-modal-header">
          <div className="w3ag-modal-header-content">
            <LockIcon className="w3ag-icon" />
            <h2 id="approval-title" className="w3ag-modal-title">
              Token Approval Request
            </h2>
          </div>
          <button
            onClick={onClose}
            className="w3ag-close-button"
            aria-label="Cancel approval and close"
          >
            <CloseIcon className="w3ag-icon" />
          </button>
        </div>

        {/* Content */}
        <div className="w3ag-modal-content">
          {/* Plain language explanation */}
          <section id="approval-description" className="w3ag-info-box w3ag-info-primary">
            <p className="w3ag-text-lg">
              <strong>{spender.name}</strong> wants permission to spend your{' '}
              <strong>{token.symbol}</strong> tokens.
            </p>
          </section>

          {/* Token and Spender details */}
          <section aria-labelledby="details-heading" className="w3ag-details-section">
            <h3 id="details-heading" className="w3ag-section-heading">
              Details
            </h3>
            
            <div className="w3ag-details-grid">
              {/* Token info */}
              <div className="w3ag-detail-row">
                <span className="w3ag-detail-label">Token:</span>
                <div className="w3ag-detail-value">
                  {token.logoUrl && (
                    <img 
                      src={token.logoUrl} 
                      alt="" 
                      className="w3ag-token-logo"
                      aria-hidden="true"
                    />
                  )}
                  <span>
                    {token.symbol} ({token.name})
                  </span>
                </div>
              </div>

              {/* Balance */}
              <div className="w3ag-detail-row">
                <span className="w3ag-detail-label">Your balance:</span>
                <span className="w3ag-detail-value">
                  {formattedBalance} {token.symbol}
                </span>
              </div>

              {/* Spender info */}
              <div className="w3ag-detail-row">
                <span className="w3ag-detail-label">Spender:</span>
                <div className="w3ag-detail-value w3ag-spender-info">
                  <div className="w3ag-spender-name">
                    <span>{spender.name}</span>
                    {spender.verified ? (
                      <span className="w3ag-badge w3ag-badge-success">
                        ✓ Verified
                      </span>
                    ) : (
                      <span className="w3ag-badge w3ag-badge-danger">
                        ⚠ Unverified
                      </span>
                    )}
                  </div>
                  {spender.explorerUrl ? (
                    <a
                      href={spender.explorerUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="w3ag-address-link"
                    >
                      {truncateAddress(spender.address)}
                    </a>
                  ) : (
                    <span className="w3ag-address">
                      {truncateAddress(spender.address)}
                    </span>
                  )}
                </div>
              </div>
            </div>
          </section>

          {/* Approval amount selection */}
          <fieldset aria-labelledby="amount-heading" className="w3ag-fieldset">
            <legend id="amount-heading" className="w3ag-legend">
              Approval Amount
            </legend>
            
            <div className="w3ag-radio-group">
              {/* Exact amount option */}
              <label className={`w3ag-radio-option ${approvalType === 'exact' ? 'w3ag-radio-selected' : ''}`}>
                <input
                  ref={firstInputRef}
                  type="radio"
                  name="approvalType"
                  value="exact"
                  checked={approvalType === 'exact'}
                  onChange={() => handleTypeChange('exact')}
                  className="w3ag-radio-input"
                />
                <div className="w3ag-radio-content">
                  <div className="w3ag-radio-label">
                    Exact amount: {formattedRequestedAmount} {token.symbol}
                  </div>
                  <div className="w3ag-radio-description w3ag-text-success">
                    ✓ Recommended — Only approve what's needed
                  </div>
                </div>
              </label>

              {/* Unlimited option */}
              <label className={`w3ag-radio-option ${approvalType === 'unlimited' ? 'w3ag-radio-selected w3ag-radio-danger' : ''}`}>
                <input
                  type="radio"
                  name="approvalType"
                  value="unlimited"
                  checked={approvalType === 'unlimited'}
                  onChange={() => handleTypeChange('unlimited')}
                  className="w3ag-radio-input"
                />
                <div className="w3ag-radio-content">
                  <div className="w3ag-radio-label">Unlimited</div>
                  <div className="w3ag-radio-description w3ag-text-danger">
                    ⚠ Not recommended — Contract can spend all your {token.symbol}
                  </div>
                </div>
              </label>

              {/* Custom amount option */}
              <label className={`w3ag-radio-option ${approvalType === 'custom' ? 'w3ag-radio-selected' : ''}`}>
                <input
                  type="radio"
                  name="approvalType"
                  value="custom"
                  checked={approvalType === 'custom'}
                  onChange={() => handleTypeChange('custom')}
                  className="w3ag-radio-input"
                />
                <div className="w3ag-radio-content">
                  <div className="w3ag-radio-label">Custom amount</div>
                  {approvalType === 'custom' && (
                    <div className="w3ag-custom-input">
                      <label htmlFor="custom-amount" className="sr-only">
                        Enter custom approval amount in {token.symbol}
                      </label>
                      <div className="w3ag-input-group">
                        <input
                          id="custom-amount"
                          type="text"
                          inputMode="decimal"
                          value={customAmount}
                          onChange={(e) => setCustomAmount(e.target.value)}
                          placeholder="0.00"
                          className="w3ag-input"
                          aria-describedby="custom-amount-hint"
                        />
                        <span className="w3ag-input-suffix">{token.symbol}</span>
                      </div>
                      <div id="custom-amount-hint" className="w3ag-hint">
                        Enter the maximum amount this contract can spend
                      </div>
                    </div>
                  )}
                </div>
              </label>
            </div>
          </fieldset>

          {/* Unlimited warning banner */}
          {showUnlimitedWarning && (
            <div role="alert" className="w3ag-alert w3ag-alert-danger">
              <h4 className="w3ag-alert-title">
                <DangerIcon className="w3ag-icon" />
                Unlimited Approval Warning
              </h4>
              <ul className="w3ag-alert-list">
                <li>This contract could drain ALL your {token.symbol} at any time</li>
                <li>If the contract is compromised, you could lose everything</li>
                <li>This permission never expires automatically</li>
                <li>You must manually revoke this approval to remove access</li>
              </ul>
            </div>
          )}

          {/* What this means */}
          <section aria-labelledby="explanation-heading" className="w3ag-info-box">
            <h3 id="explanation-heading" className="w3ag-section-heading">
              What this means
            </h3>
            <ul className="w3ag-info-list">
              <li>
                {spender.name} can move up to{' '}
                {approvalType === 'unlimited' 
                  ? `all your ${token.symbol}` 
                  : `${formatUnits(approvalAmount, token.decimals)} ${token.symbol}`
                }{' '}
                from your wallet
              </li>
              <li>This permission remains active until you revoke it</li>
              <li>
                You can revoke anytime at{' '}
                <a 
                  href="https://revoke.cash" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="w3ag-link"
                >
                  revoke.cash
                </a>
              </li>
            </ul>
          </section>

          {/* Unverified contract warning */}
          {!spender.verified && (
            <div role="alert" className="w3ag-alert w3ag-alert-warning">
              <h4 className="w3ag-alert-title">
                <WarningIcon className="w3ag-icon" />
                Unverified Contract
              </h4>
              <p>
                This contract's source code is not verified on block explorers.
                This could indicate a scam. Proceed with extreme caution.
              </p>
            </div>
          )}
        </div>

        {/* Actions */}
        <div className="w3ag-modal-footer">
          <button
            onClick={onClose}
            disabled={isApproving}
            className="w3ag-button w3ag-button-secondary"
          >
            Reject
          </button>
          
          <button
            onClick={handleApprove}
            disabled={isApproving || (approvalType === 'custom' && !customAmount)}
            className={`w3ag-button ${
              approvalType === 'unlimited'
                ? 'w3ag-button-danger'
                : 'w3ag-button-primary'
            }`}
          >
            {isApproving ? (
              <span className="w3ag-button-loading">
                <LoadingSpinner />
                Approving...
              </span>
            ) : approvalType === 'unlimited' ? (
              'Approve Unlimited (Risky)'
            ) : (
              'Approve'
            )}
          </button>
        </div>
      </div>
    </>
  );
}

// =============================================================================
// Icon Components
// =============================================================================

function LockIcon({ className }: { className?: string }) {
  return (
    <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} 
        d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
    </svg>
  );
}

function CloseIcon({ className }: { className?: string }) {
  return (
    <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
    </svg>
  );
}

function DangerIcon({ className }: { className?: string }) {
  return (
    <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} 
        d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
    </svg>
  );
}

function WarningIcon({ className }: { className?: string }) {
  return (
    <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} 
        d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
    </svg>
  );
}

function LoadingSpinner() {
  return (
    <svg className="w3ag-spinner" fill="none" viewBox="0 0 24 24" aria-hidden="true">
      <circle className="w3ag-spinner-track" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
      <path className="w3ag-spinner-head" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
    </svg>
  );
}

export default TokenApprovalDialog;
