import React from 'react';

/**
 * W3AG Compliant Transaction Summary Component
 * 
 * Conformance: Level AA
 * 
 * Success Criteria Met:
 * - 1.2.1: Transaction type clearly labeled
 * - 1.2.2: Token amounts in readable format
 * - 1.2.3: Gas estimates with text descriptions
 * - 3.1.1: Plain language descriptions
 * - 3.1.3: Concrete outcome statements
 */

interface TransactionSummaryProps {
  type: 'send' | 'swap' | 'approve' | 'stake' | 'unstake' | 'mint';
  from?: {
    amount: string;
    symbol: string;
    usdValue?: string;
  };
  to?: {
    address?: string;
    ensName?: string;
    amount?: string;
    symbol?: string;
    usdValue?: string;
  };
  gas: {
    estimateUsd: string;
    estimateNative: string;
    nativeSymbol: string;
  };
  warnings?: Array<{
    id: string;
    severity: 'info' | 'warning' | 'danger';
    message: string;
  }>;
  onConfirm: () => void;
  onReject: () => void;
  isConfirming?: boolean;
}

const TYPE_LABELS: Record<string, string> = {
  send: 'Send Tokens',
  swap: 'Token Swap',
  approve: 'Token Approval',
  stake: 'Stake Tokens',
  unstake: 'Unstake Tokens',
  mint: 'Mint NFT',
};

const TYPE_DESCRIPTIONS: Record<string, string> = {
  send: 'Transfer tokens from your wallet to another address',
  swap: 'Exchange one token for another',
  approve: 'Grant permission for an app to use your tokens',
  stake: 'Lock tokens to earn rewards',
  unstake: 'Withdraw staked tokens',
  mint: 'Create a new NFT',
};

export function TransactionSummary({
  type,
  from,
  to,
  gas,
  warnings = [],
  onConfirm,
  onReject,
  isConfirming = false,
}: TransactionSummaryProps) {
  const typeLabel = TYPE_LABELS[type] || 'Transaction';
  const typeDescription = TYPE_DESCRIPTIONS[type] || '';

  // Generate screen reader summary
  const generateSummary = () => {
    let summary = `${typeLabel}. `;
    
    if (from) {
      summary += `You will send ${from.amount} ${from.symbol}`;
      if (from.usdValue) summary += ` (approximately ${from.usdValue} dollars)`;
      summary += '. ';
    }
    
    if (to?.amount) {
      summary += `You will receive approximately ${to.amount} ${to.symbol}`;
      if (to.usdValue) summary += ` (approximately ${to.usdValue} dollars)`;
      summary += '. ';
    } else if (to?.address) {
      summary += `Sending to ${to.ensName || to.address}. `;
    }
    
    summary += `Network fee approximately ${gas.estimateUsd} dollars.`;
    
    return summary;
  };

  return (
    <div 
      className="w3ag-transaction-summary"
      role="dialog"
      aria-labelledby="tx-type-heading"
      aria-describedby="tx-summary"
    >
      {/* Screen reader summary */}
      <div id="tx-summary" className="sr-only">
        {generateSummary()}
      </div>

      {/* Transaction Type Header */}
      <header className="tx-header">
        <h2 id="tx-type-heading">{typeLabel}</h2>
        <p className="tx-description">{typeDescription}</p>
      </header>

      {/* Transaction Details */}
      <dl className="tx-details">
        {from && (
          <div className="detail-row">
            <dt>You send</dt>
            <dd>
              <span 
                className="amount"
                aria-label={`${from.amount} ${from.symbol}${from.usdValue ? `, approximately ${from.usdValue} dollars` : ''}`}
              >
                {from.amount} {from.symbol}
              </span>
              {from.usdValue && (
                <span className="usd-value" aria-hidden="true">
                  (~${from.usdValue})
                </span>
              )}
            </dd>
          </div>
        )}

        {to?.address && (
          <div className="detail-row">
            <dt>To</dt>
            <dd>
              {to.ensName ? (
                <>
                  <span className="ens-name">{to.ensName}</span>
                  <span className="address-small" aria-label={`Address: ${to.address}`}>
                    ({to.address.slice(0, 6)}...{to.address.slice(-4)})
                  </span>
                </>
              ) : (
                <span aria-label={`Address: ${to.address}`}>
                  {to.address.slice(0, 10)}...{to.address.slice(-8)}
                </span>
              )}
            </dd>
          </div>
        )}

        {to?.amount && (
          <div className="detail-row">
            <dt>You receive</dt>
            <dd>
              <span 
                className="amount"
                aria-label={`Approximately ${to.amount} ${to.symbol}${to.usdValue ? `, approximately ${to.usdValue} dollars` : ''}`}
              >
                ~{to.amount} {to.symbol}
              </span>
              {to.usdValue && (
                <span className="usd-value" aria-hidden="true">
                  (~${to.usdValue})
                </span>
              )}
            </dd>
          </div>
        )}

        <div className="detail-row">
          <dt>Network fee</dt>
          <dd>
            <span aria-label={`Approximately ${gas.estimateUsd} dollars`}>
              ~${gas.estimateUsd}
            </span>
            <details className="gas-details">
              <summary>Details</summary>
              <p>{gas.estimateNative} {gas.nativeSymbol}</p>
            </details>
          </dd>
        </div>
      </dl>

      {/* Warnings */}
      {warnings.length > 0 && (
        <div className="tx-warnings">
          {warnings.map(warning => (
            <div
              key={warning.id}
              role={warning.severity === 'danger' ? 'alert' : 'status'}
              className={`warning warning-${warning.severity}`}
              aria-live={warning.severity === 'danger' ? 'assertive' : 'polite'}
            >
              <WarningIcon severity={warning.severity} />
              <span>{warning.message}</span>
            </div>
          ))}
        </div>
      )}

      {/* Actions */}
      <div className="tx-actions" role="group" aria-label="Transaction actions">
        <button
          type="button"
          onClick={onReject}
          className="btn-reject"
          disabled={isConfirming}
        >
          Reject
        </button>
        
        <button
          type="button"
          onClick={onConfirm}
          className="btn-confirm"
          disabled={isConfirming}
          aria-busy={isConfirming}
        >
          {isConfirming ? 'Confirming...' : 'Confirm'}
        </button>
      </div>
    </div>
  );
}

function WarningIcon({ severity }: { severity: 'info' | 'warning' | 'danger' }) {
  const labels = {
    info: 'Information',
    warning: 'Warning',
    danger: 'Critical warning',
  };
  
  return (
    <span 
      className={`warning-icon warning-icon-${severity}`}
      aria-label={labels[severity]}
    >
      {severity === 'info' && 'ℹ️'}
      {severity === 'warning' && '⚠️'}
      {severity === 'danger' && '🚨'}
    </span>
  );
}

/**
 * CSS (add to your stylesheet):
 * 
 * .w3ag-transaction-summary {
 *   max-width: 420px;
 *   padding: 1.5rem;
 *   border-radius: 12px;
 *   background: var(--bg-surface);
 * }
 * 
 * .tx-header {
 *   margin-bottom: 1.5rem;
 *   text-align: center;
 * }
 * 
 * .tx-details {
 *   display: flex;
 *   flex-direction: column;
 *   gap: 1rem;
 *   margin-bottom: 1.5rem;
 * }
 * 
 * .detail-row {
 *   display: flex;
 *   justify-content: space-between;
 *   align-items: baseline;
 * }
 * 
 * .detail-row dt {
 *   color: var(--text-secondary);
 * }
 * 
 * .detail-row dd {
 *   text-align: right;
 * }
 * 
 * .amount {
 *   font-weight: 600;
 *   font-size: 1.1rem;
 * }
 * 
 * .usd-value {
 *   color: var(--text-secondary);
 *   margin-left: 0.5rem;
 * }
 * 
 * .tx-warnings {
 *   margin-bottom: 1.5rem;
 * }
 * 
 * .warning {
 *   display: flex;
 *   align-items: flex-start;
 *   gap: 0.5rem;
 *   padding: 0.75rem;
 *   border-radius: 8px;
 *   margin-bottom: 0.5rem;
 * }
 * 
 * .warning-info { background: var(--bg-info); }
 * .warning-warning { background: var(--bg-warning); }
 * .warning-danger { background: var(--bg-danger); }
 * 
 * .tx-actions {
 *   display: flex;
 *   gap: 1rem;
 * }
 * 
 * .btn-reject,
 * .btn-confirm {
 *   flex: 1;
 *   padding: 0.875rem;
 *   border-radius: 8px;
 *   font-weight: 600;
 *   cursor: pointer;
 * }
 * 
 * .btn-reject {
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
 * .btn-confirm:disabled,
 * .btn-reject:disabled {
 *   opacity: 0.6;
 *   cursor: not-allowed;
 * }
 * 
 * .btn-confirm:focus-visible,
 * .btn-reject:focus-visible {
 *   outline: 3px solid var(--color-focus);
 *   outline-offset: 2px;
 * }
 */

export default TransactionSummary;
