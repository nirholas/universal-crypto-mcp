import React, { useState, useRef, useEffect } from 'react';

/**
 * W3AG Compliant Token Approval Dialog
 * 
 * Conformance: Level AA
 * 
 * Success Criteria Met:
 * - 3.2.3: Token approvals clearly explain permissions granted
 * - 3.1.1: Plain language descriptions accompany technical data
 * - 3.4.1: Unverified contracts clearly flagged
 * - 2.1.1: Fully keyboard navigable
 * - 4.1.1: Proper ARIA roles and states
 */

interface Token {
  symbol: string;
  name: string;
  address: string;
  decimals: number;
  logoUri?: string;
}

interface SpenderInfo {
  name: string;
  address: string;
  verified: boolean;
  website?: string;
  description?: string;
}

interface TokenApprovalDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onApprove: (amount: bigint) => void;
  onReject: () => void;
  token: Token;
  spender: SpenderInfo;
  requestedAmount: bigint | 'unlimited';
  currentAllowance: bigint;
  isApproving?: boolean;
}

// Format token amount for display
function formatTokenAmount(amount: bigint, decimals: number, symbol: string): string {
  const divisor = BigInt(10 ** decimals);
  const whole = amount / divisor;
  const fraction = amount % divisor;
  
  if (fraction === 0n) {
    return `${whole.toLocaleString()} ${symbol}`;
  }
  
  const fractionStr = fraction.toString().padStart(decimals, '0').slice(0, 4);
  return `${whole.toLocaleString()}.${fractionStr} ${symbol}`;
}

// Format for screen reader
function formatAmountForSR(amount: bigint | 'unlimited', decimals: number, symbol: string): string {
  if (amount === 'unlimited') {
    return `unlimited ${symbol}`;
  }
  return formatTokenAmount(amount, decimals, symbol);
}

export function TokenApprovalDialog({
  isOpen,
  onClose,
  onApprove,
  onReject,
  token,
  spender,
  requestedAmount,
  currentAllowance,
  isApproving = false,
}: TokenApprovalDialogProps) {
  const [customAmount, setCustomAmount] = useState<string>('');
  const [useCustom, setUseCustom] = useState(false);
  const [announcement, setAnnouncement] = useState('');
  const [acknowledgedRisk, setAcknowledgedRisk] = useState(false);
  
  const dialogRef = useRef<HTMLDivElement>(null);
  const firstFocusRef = useRef<HTMLButtonElement>(null);
  const triggerRef = useRef<HTMLElement | null>(null);

  const isUnlimited = requestedAmount === 'unlimited';
  const isUnverified = !spender.verified;

  // Focus management
  useEffect(() => {
    if (isOpen) {
      triggerRef.current = document.activeElement as HTMLElement;
      setAnnouncement(
        `Token approval request from ${spender.name}. ` +
        `Requesting permission to spend ${formatAmountForSR(requestedAmount, token.decimals, token.symbol)}. ` +
        (isUnverified ? 'Warning: This contract is unverified.' : '')
      );
      
      // Focus first interactive element after announcement
      setTimeout(() => firstFocusRef.current?.focus(), 100);
    } else {
      triggerRef.current?.focus();
      setAcknowledgedRisk(false);
      setUseCustom(false);
      setCustomAmount('');
    }
  }, [isOpen, spender.name, requestedAmount, token, isUnverified]);

  // Focus trap
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Escape') {
      onReject();
      return;
    }

    if (e.key === 'Tab') {
      const focusable = dialogRef.current?.querySelectorAll(
        'button:not([disabled]), input:not([disabled]), [tabindex]:not([tabindex="-1"])'
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
  };

  const handleApprove = () => {
    if (useCustom && customAmount) {
      const amount = BigInt(Math.floor(parseFloat(customAmount) * (10 ** token.decimals)));
      onApprove(amount);
    } else if (requestedAmount === 'unlimited') {
      // Max uint256
      onApprove(BigInt('0xffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff'));
    } else {
      onApprove(requestedAmount);
    }
  };

  const canApprove = isUnverified ? acknowledgedRisk : true;

  if (!isOpen) return null;

  return (
    <>
      {/* Backdrop */}
      <div 
        className="w3ag-dialog-backdrop"
        onClick={onReject}
        aria-hidden="true"
      />

      {/* Dialog */}
      <div
        ref={dialogRef}
        role="alertdialog"
        aria-modal="true"
        aria-labelledby="approval-title"
        aria-describedby="approval-desc"
        className="w3ag-token-approval-dialog"
        onKeyDown={handleKeyDown}
      >
        {/* Screen reader announcements */}
        <div 
          role="status" 
          aria-live="assertive" 
          aria-atomic="true"
          className="sr-only"
        >
          {announcement}
        </div>

        {/* Header */}
        <header className="dialog-header">
          <h2 id="approval-title">Approve Token Spending</h2>
          <button
            ref={firstFocusRef}
            onClick={onReject}
            className="close-btn"
            aria-label="Close approval dialog"
          >
            ✕
          </button>
        </header>

        {/* Description for screen readers */}
        <p id="approval-desc" className="sr-only">
          {spender.name} is requesting permission to spend your {token.name} tokens.
          Review the details below before approving.
        </p>

        {/* Unverified contract warning */}
        {isUnverified && (
          <div role="alert" className="warning-banner critical">
            <span className="warning-icon" aria-hidden="true">🛑</span>
            <div className="warning-content">
              <strong>Unverified Contract</strong>
              <p>
                This contract's source code has not been verified. 
                It may be malicious and could steal your tokens.
              </p>
            </div>
          </div>
        )}

        {/* Unlimited approval warning */}
        {isUnlimited && (
          <div role="alert" className="warning-banner high">
            <span className="warning-icon" aria-hidden="true">⚠️</span>
            <div className="warning-content">
              <strong>Unlimited Approval Requested</strong>
              <p>
                This app is requesting permission to spend <strong>any amount</strong> of 
                your {token.symbol}, now and in the future.
              </p>
            </div>
          </div>
        )}

        {/* Main content */}
        <div className="approval-content">
          {/* What you're approving */}
          <section className="approval-section">
            <h3>What you're approving</h3>
            <dl className="approval-details">
              <div className="detail-row">
                <dt>App requesting access</dt>
                <dd>
                  <span className="spender-name">{spender.name}</span>
                  {spender.verified && (
                    <span className="verified-badge" aria-label="Verified contract">
                      ✓ Verified
                    </span>
                  )}
                  <span className="spender-address">
                    ({spender.address.slice(0, 6)}...{spender.address.slice(-4)})
                  </span>
                </dd>
              </div>

              <div className="detail-row">
                <dt>Token</dt>
                <dd>
                  {token.logoUri && (
                    <img 
                      src={token.logoUri} 
                      alt="" 
                      aria-hidden="true"
                      className="token-logo"
                    />
                  )}
                  <span>{token.name} ({token.symbol})</span>
                </dd>
              </div>

              <div className="detail-row">
                <dt>Amount</dt>
                <dd className={isUnlimited ? 'amount-unlimited' : ''}>
                  {isUnlimited 
                    ? 'Unlimited (no cap)'
                    : formatTokenAmount(requestedAmount as bigint, token.decimals, token.symbol)
                  }
                </dd>
              </div>

              <div className="detail-row">
                <dt>Current allowance</dt>
                <dd>
                  {currentAllowance === 0n 
                    ? 'None'
                    : formatTokenAmount(currentAllowance, token.decimals, token.symbol)
                  }
                </dd>
              </div>

              <div className="detail-row">
                <dt>Duration</dt>
                <dd>Until you revoke this permission</dd>
              </div>
            </dl>
          </section>

          {/* Plain language explanation */}
          <section className="approval-section">
            <h3>What this means</h3>
            <ul className="explanation-list">
              <li>
                <strong>{spender.name}</strong> will be able to transfer 
                {isUnlimited 
                  ? ` any amount of your ${token.symbol}`
                  : ` up to ${formatTokenAmount(requestedAmount as bigint, token.decimals, token.symbol)}`
                } from your wallet.
              </li>
              <li>
                They can do this <strong>without asking again</strong> — whenever they want.
              </li>
              <li>
                This permission <strong>never expires</strong> unless you manually revoke it.
              </li>
              <li>
                You can revoke this anytime in your wallet's "Approvals" or "Allowances" section.
              </li>
            </ul>
          </section>

          {/* Custom amount option */}
          {isUnlimited && (
            <section className="approval-section">
              <h3>Set a safer limit</h3>
              <p className="section-desc">
                Instead of unlimited access, you can approve only what you need:
              </p>
              
              <label className="custom-amount-toggle">
                <input
                  type="checkbox"
                  checked={useCustom}
                  onChange={(e) => setUseCustom(e.target.checked)}
                />
                <span>Use a custom amount instead of unlimited</span>
              </label>

              {useCustom && (
                <div className="custom-amount-input">
                  <label htmlFor="custom-amount">
                    Maximum {token.symbol} to approve:
                  </label>
                  <input
                    id="custom-amount"
                    type="number"
                    value={customAmount}
                    onChange={(e) => setCustomAmount(e.target.value)}
                    placeholder="Enter amount"
                    min="0"
                    step="any"
                    aria-describedby="custom-amount-help"
                  />
                  <p id="custom-amount-help" className="help-text">
                    Tip: Approve only what you need for this transaction, 
                    plus a small buffer for fees or slippage.
                  </p>
                </div>
              )}
            </section>
          )}

          {/* Risk acknowledgment for unverified contracts */}
          {isUnverified && (
            <div className="risk-acknowledgment">
              <label>
                <input
                  type="checkbox"
                  checked={acknowledgedRisk}
                  onChange={(e) => setAcknowledgedRisk(e.target.checked)}
                  required
                />
                <span>
                  I understand this contract is unverified and may be malicious. 
                  I accept the risk of losing my tokens.
                </span>
              </label>
            </div>
          )}
        </div>

        {/* Actions */}
        <footer className="dialog-actions">
          <button
            onClick={onReject}
            className="btn-reject"
            disabled={isApproving}
          >
            Reject
          </button>
          
          <button
            onClick={handleApprove}
            className="btn-approve"
            disabled={isApproving || !canApprove || (useCustom && !customAmount)}
            aria-busy={isApproving}
            aria-describedby={!canApprove ? 'approve-blocked-reason' : undefined}
          >
            {isApproving ? 'Approving...' : 'Approve'}
          </button>
          
          {!canApprove && (
            <p id="approve-blocked-reason" className="sr-only">
              You must acknowledge the risk before approving an unverified contract.
            </p>
          )}
        </footer>

        {/* Additional help */}
        <details className="approval-help">
          <summary>What are token approvals?</summary>
          <p>
            Token approvals let apps spend tokens from your wallet. They're needed 
            for swapping, staking, and other DeFi activities. However, malicious 
            apps can abuse approvals to steal your tokens.
          </p>
          <p>
            <strong>Best practices:</strong>
          </p>
          <ul>
            <li>Only approve verified contracts from trusted apps</li>
            <li>Set specific amounts instead of unlimited when possible</li>
            <li>Regularly review and revoke unused approvals</li>
          </ul>
        </details>
      </div>
    </>
  );
}

/**
 * CSS (add to your stylesheet):
 *
 * .w3ag-dialog-backdrop {
 *   position: fixed;
 *   inset: 0;
 *   background: rgba(0, 0, 0, 0.6);
 *   z-index: 100;
 * }
 *
 * .w3ag-token-approval-dialog {
 *   position: fixed;
 *   top: 50%;
 *   left: 50%;
 *   transform: translate(-50%, -50%);
 *   background: var(--bg-surface);
 *   border-radius: 16px;
 *   max-width: 480px;
 *   width: 90%;
 *   max-height: 90vh;
 *   overflow-y: auto;
 *   z-index: 101;
 *   box-shadow: 0 20px 60px rgba(0, 0, 0, 0.3);
 * }
 *
 * .dialog-header {
 *   display: flex;
 *   justify-content: space-between;
 *   align-items: center;
 *   padding: 1.25rem 1.5rem;
 *   border-bottom: 1px solid var(--border-color);
 * }
 *
 * .dialog-header h2 {
 *   margin: 0;
 *   font-size: 1.25rem;
 * }
 *
 * .close-btn {
 *   background: none;
 *   border: none;
 *   font-size: 1.25rem;
 *   cursor: pointer;
 *   padding: 0.25rem;
 *   border-radius: 4px;
 * }
 *
 * .close-btn:focus-visible {
 *   outline: 2px solid var(--color-focus);
 *   outline-offset: 2px;
 * }
 *
 * .warning-banner {
 *   display: flex;
 *   gap: 0.75rem;
 *   padding: 1rem 1.5rem;
 *   margin: 0;
 * }
 *
 * .warning-banner.critical {
 *   background: var(--bg-danger);
 *   color: var(--text-on-danger);
 * }
 *
 * .warning-banner.high {
 *   background: var(--bg-warning);
 * }
 *
 * .warning-icon {
 *   font-size: 1.5rem;
 *   flex-shrink: 0;
 * }
 *
 * .approval-content {
 *   padding: 1.5rem;
 * }
 *
 * .approval-section {
 *   margin-bottom: 1.5rem;
 * }
 *
 * .approval-section h3 {
 *   font-size: 0.875rem;
 *   text-transform: uppercase;
 *   letter-spacing: 0.05em;
 *   color: var(--text-secondary);
 *   margin: 0 0 0.75rem 0;
 * }
 *
 * .approval-details {
 *   display: flex;
 *   flex-direction: column;
 *   gap: 0.75rem;
 * }
 *
 * .detail-row {
 *   display: flex;
 *   justify-content: space-between;
 *   gap: 1rem;
 * }
 *
 * .detail-row dt {
 *   color: var(--text-secondary);
 * }
 *
 * .detail-row dd {
 *   text-align: right;
 *   display: flex;
 *   align-items: center;
 *   gap: 0.5rem;
 * }
 *
 * .amount-unlimited {
 *   color: var(--color-danger);
 *   font-weight: 600;
 * }
 *
 * .verified-badge {
 *   font-size: 0.75rem;
 *   color: var(--color-success);
 *   background: var(--bg-success-light);
 *   padding: 0.125rem 0.5rem;
 *   border-radius: 4px;
 * }
 *
 * .token-logo {
 *   width: 20px;
 *   height: 20px;
 *   border-radius: 50%;
 * }
 *
 * .explanation-list {
 *   margin: 0;
 *   padding-left: 1.25rem;
 * }
 *
 * .explanation-list li {
 *   margin-bottom: 0.5rem;
 * }
 *
 * .custom-amount-toggle {
 *   display: flex;
 *   align-items: center;
 *   gap: 0.5rem;
 *   cursor: pointer;
 * }
 *
 * .custom-amount-input {
 *   margin-top: 0.75rem;
 *   padding: 1rem;
 *   background: var(--bg-secondary);
 *   border-radius: 8px;
 * }
 *
 * .custom-amount-input label {
 *   display: block;
 *   margin-bottom: 0.5rem;
 *   font-weight: 500;
 * }
 *
 * .custom-amount-input input {
 *   width: 100%;
 *   padding: 0.75rem;
 *   border: 1px solid var(--border-color);
 *   border-radius: 6px;
 *   font-size: 1rem;
 * }
 *
 * .help-text {
 *   font-size: 0.875rem;
 *   color: var(--text-secondary);
 *   margin-top: 0.5rem;
 * }
 *
 * .risk-acknowledgment {
 *   padding: 1rem;
 *   background: var(--bg-danger-light);
 *   border-radius: 8px;
 *   margin-bottom: 1rem;
 * }
 *
 * .risk-acknowledgment label {
 *   display: flex;
 *   align-items: flex-start;
 *   gap: 0.75rem;
 *   cursor: pointer;
 * }
 *
 * .dialog-actions {
 *   display: flex;
 *   gap: 1rem;
 *   padding: 1.25rem 1.5rem;
 *   border-top: 1px solid var(--border-color);
 * }
 *
 * .btn-reject,
 * .btn-approve {
 *   flex: 1;
 *   padding: 0.875rem;
 *   border-radius: 8px;
 *   font-weight: 600;
 *   cursor: pointer;
 *   font-size: 1rem;
 * }
 *
 * .btn-reject {
 *   background: var(--bg-secondary);
 *   border: 1px solid var(--border-color);
 * }
 *
 * .btn-approve {
 *   background: var(--color-primary);
 *   color: white;
 *   border: none;
 * }
 *
 * .btn-approve:disabled {
 *   opacity: 0.5;
 *   cursor: not-allowed;
 * }
 *
 * .btn-approve:focus-visible,
 * .btn-reject:focus-visible {
 *   outline: 3px solid var(--color-focus);
 *   outline-offset: 2px;
 * }
 *
 * .approval-help {
 *   padding: 0 1.5rem 1.5rem;
 *   font-size: 0.875rem;
 *   color: var(--text-secondary);
 * }
 *
 * .approval-help summary {
 *   cursor: pointer;
 *   color: var(--color-link);
 * }
 *
 * .approval-help ul {
 *   margin: 0.5rem 0 0 0;
 *   padding-left: 1.25rem;
 * }
 */

export default TokenApprovalDialog;
