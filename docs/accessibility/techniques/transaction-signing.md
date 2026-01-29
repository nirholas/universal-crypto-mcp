# Technique: Accessible Transaction Signing

**W3AG Guidelines**: 2.2.1, 2.2.2, 2.2.3, 1.2.1, 1.2.4, 3.1.1  
**Conformance Level**: AA  
**Last Updated**: 2024-12-29

---

## Problem Statement

Transaction signing is the most security-critical moment in any Web3 interaction. Users are confirming irreversible, financially consequential actions. Current implementations fail accessibility in dangerous ways:

### For Screen Reader Users
- **Raw hex data**: Transaction data shown as unreadable hex strings
- **No semantic structure**: Amount, recipient, fees are not in labeled regions
- **Simulation results invisible**: "What will happen" shown only visually
- **No announcement**: Sign/reject button states not communicated

### For Users with Cognitive Disabilities
- **Information overload**: Too much technical data (gas limit, nonce, hex data)
- **No plain language**: "Approve USDC spending" vs "approve(address,uint256)"
- **Risk not explained**: Users don't understand what they're agreeing to
- **No confirmation delay**: Easy to click "Sign" by mistake

### For Users with Motor Impairments
- **Small buttons**: Sign/Reject too small or close together
- **Timeout pressure**: Wallet popups may timeout
- **Double-signing**: No protection against accidental double-clicks

### For Users with Low Vision
- **Poor contrast**: Transaction details hard to read
- **No scaling**: Fixed font sizes on wallet popups

---

## Solution Pattern

### Core Principles

1. **Plain language summary first**: "You're sending 1.5 ETH to vitalik.eth"
2. **Structured, labeled sections**: Amount, Recipient, Gas, etc.
3. **Simulation results in text**: "After this: Your balance will be X"
4. **Risk warnings are prominent**: Unusual amounts, unverified contracts
5. **Confirmation requires explicit action**: Not just one click
6. **All actions keyboard accessible**: Sign, reject, view details

### Transaction Confirmation Flow

```
┌─────────────────────────────────────────────────────────┐
│  Confirm Transaction                              [X]   │
├─────────────────────────────────────────────────────────┤
│                                                         │
│  📤 You're sending                                      │
│  ┌─────────────────────────────────────────────────┐   │
│  │  1.5 ETH ($3,450.00)                            │   │
│  │  To: vitalik.eth (0x742d...35Cc)                │   │
│  └─────────────────────────────────────────────────┘   │
│                                                         │
│  ⛽ Network Fee                                         │
│  ┌─────────────────────────────────────────────────┐   │
│  │  ~$2.45 (0.001 ETH)                             │   │
│  │  Estimated time: ~15 seconds                    │   │
│  └─────────────────────────────────────────────────┘   │
│                                                         │
│  📊 After this transaction:                            │
│  • Your ETH balance: 2.3 ETH → 0.8 ETH                 │
│  • Recipient receives: 1.5 ETH                          │
│                                                         │
│  ⚠️  This action cannot be undone                      │
│                                                         │
│  [View Details]                                         │
│                                                         │
│  ┌─────────────────┐  ┌─────────────────────────┐      │
│  │     Reject      │  │    Confirm & Sign       │      │
│  └─────────────────┘  └─────────────────────────┘      │
│                                                         │
└─────────────────────────────────────────────────────────┘

Screen reader announces:
"Confirm transaction dialog. You're sending 1.5 ETH, worth 
$3,450, to vitalik.eth. Network fee approximately $2.45.
After this transaction, your ETH balance will decrease from 
2.3 to 0.8 ETH. Warning: This action cannot be undone."
```

---

## Implementation

### Full React Component

```tsx
import React, { useState, useCallback, useEffect, useRef } from 'react';
import { 
  useSimulateContract, 
  useWriteContract, 
  useWaitForTransactionReceipt,
  useBalance,
  useAccount 
} from 'wagmi';
import { formatEther, formatUnits, parseEther } from 'viem';

/**
 * W3AG Compliant Transaction Confirmation
 * 
 * Conformance: Level AA
 * Guidelines: 2.2.1, 2.2.2, 1.2.1, 1.2.4, 3.1.1, 3.4.1
 */

interface TransactionDetails {
  type: 'send' | 'swap' | 'approve' | 'stake' | 'unstake' | 'contract';
  to: `0x${string}`;
  toLabel?: string;
  value?: bigint;
  tokenAmount?: string;
  tokenSymbol?: string;
  tokenDecimals?: number;
  gasEstimate?: bigint;
  gasPriceGwei?: number;
  data?: `0x${string}`;
  chainId: number;
}

interface TransactionConfirmationProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => Promise<void>;
  transaction: TransactionDetails;
  simulation?: {
    success: boolean;
    balanceChanges: Array<{
      token: string;
      before: string;
      after: string;
    }>;
    warnings: string[];
  };
  ethPrice?: number;
}

export function TransactionConfirmation({
  isOpen,
  onClose,
  onConfirm,
  transaction,
  simulation,
  ethPrice = 0,
}: TransactionConfirmationProps) {
  const modalRef = useRef<HTMLDivElement>(null);
  const triggerRef = useRef<HTMLElement | null>(null);
  const rejectButtonRef = useRef<HTMLButtonElement>(null);
  
  const [isConfirming, setIsConfirming] = useState(false);
  const [showDetails, setShowDetails] = useState(false);
  const [announcement, setAnnouncement] = useState('');
  const [confirmStep, setConfirmStep] = useState<'initial' | 'confirming'>('initial');

  const { address } = useAccount();
  const { data: balance } = useBalance({ address });

  // Focus management
  useEffect(() => {
    if (isOpen) {
      triggerRef.current = document.activeElement as HTMLElement;
      
      // Build and set opening announcement
      const summary = buildTransactionSummary(transaction, simulation, ethPrice);
      setAnnouncement(summary);
      
      // Focus reject button (safer default)
      setTimeout(() => {
        rejectButtonRef.current?.focus();
      }, 100);
    } else {
      triggerRef.current?.focus();
      setConfirmStep('initial');
    }
  }, [isOpen]);

  // Keyboard handling
  const handleKeyDown = useCallback((e: React.KeyboardEvent) => {
    if (e.key === 'Escape') {
      e.preventDefault();
      onClose();
    }
    
    if (e.key === 'Tab') {
      // Focus trap
      const focusable = modalRef.current?.querySelectorAll<HTMLElement>(
        'button:not([disabled]), [tabindex]:not([tabindex="-1"])'
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

  // Two-step confirmation for safety
  const handleConfirmClick = useCallback(async () => {
    if (confirmStep === 'initial') {
      setConfirmStep('confirming');
      setAnnouncement(
        'Are you sure? Press the confirm button again to sign this transaction.'
      );
      return;
    }
    
    setIsConfirming(true);
    setAnnouncement('Signing transaction. Please check your wallet.');
    
    try {
      await onConfirm();
      setAnnouncement('Transaction submitted successfully.');
      setTimeout(onClose, 1500);
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Unknown error';
      setAnnouncement(`Transaction failed: ${message}`);
      setConfirmStep('initial');
    } finally {
      setIsConfirming(false);
    }
  }, [confirmStep, onConfirm, onClose]);

  // Format values for display
  const formattedValue = transaction.value 
    ? formatEther(transaction.value) 
    : transaction.tokenAmount || '0';
    
  const symbol = transaction.tokenSymbol || 'ETH';
  
  const usdValue = transaction.value && ethPrice
    ? (parseFloat(formatEther(transaction.value)) * ethPrice).toFixed(2)
    : null;

  const gasUsd = transaction.gasEstimate && transaction.gasPriceGwei && ethPrice
    ? (
        parseFloat(formatEther(transaction.gasEstimate * BigInt(transaction.gasPriceGwei))) 
        * ethPrice
      ).toFixed(2)
    : null;

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
        role="alertdialog"
        aria-modal="true"
        aria-labelledby="tx-confirm-title"
        aria-describedby="tx-confirm-description"
        className="fixed inset-4 md:inset-auto md:top-1/2 md:left-1/2 
                   md:-translate-x-1/2 md:-translate-y-1/2
                   md:max-w-lg md:w-full
                   bg-white rounded-xl shadow-2xl z-50
                   flex flex-col max-h-[90vh] overflow-hidden"
        onKeyDown={handleKeyDown}
      >
        {/* Live region for announcements */}
        <div
          role="status"
          aria-live="assertive"
          aria-atomic="true"
          className="sr-only"
        >
          {announcement}
        </div>

        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b">
          <h2 id="tx-confirm-title" className="text-lg font-semibold">
            Confirm Transaction
          </h2>
          <button
            onClick={onClose}
            className="p-2 rounded-lg hover:bg-gray-100 
                       focus:outline-none focus:ring-2 focus:ring-blue-500"
            aria-label="Cancel transaction and close"
          >
            <CloseIcon className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4">
          {/* Transaction summary - plain language */}
          <section aria-labelledby="tx-summary-heading">
            <h3 id="tx-summary-heading" className="sr-only">
              Transaction Summary
            </h3>
            
            <div className="bg-blue-50 rounded-lg p-4">
              <div className="flex items-center gap-2 mb-2">
                <TransactionIcon type={transaction.type} />
                <span className="font-medium">
                  {getTransactionVerb(transaction.type)}
                </span>
              </div>
              
              {/* Amount */}
              <div className="text-2xl font-bold" id="tx-confirm-description">
                {formattedValue} {symbol}
                {usdValue && (
                  <span className="text-base font-normal text-gray-600 ml-2">
                    (${usdValue})
                  </span>
                )}
              </div>
              
              {/* Recipient */}
              {transaction.to && (
                <div className="mt-2 text-gray-700">
                  <span className="sr-only">To: </span>
                  <span>To: </span>
                  <span className="font-mono">
                    {transaction.toLabel || truncateAddress(transaction.to)}
                  </span>
                </div>
              )}
            </div>
          </section>

          {/* Gas/Fee section */}
          <section aria-labelledby="tx-fee-heading">
            <h3 id="tx-fee-heading" className="text-sm font-medium text-gray-700 mb-2">
              Network Fee
            </h3>
            <div className="bg-gray-50 rounded-lg p-3">
              <div className="flex justify-between items-center">
                <span>Estimated fee:</span>
                <span className="font-medium">
                  {gasUsd ? `~$${gasUsd}` : 'Calculating...'}
                </span>
              </div>
              <div className="text-sm text-gray-500 mt-1">
                Estimated time: ~15 seconds
              </div>
            </div>
          </section>

          {/* Simulation results */}
          {simulation && (
            <section aria-labelledby="tx-simulation-heading">
              <h3 id="tx-simulation-heading" className="text-sm font-medium text-gray-700 mb-2">
                After this transaction
              </h3>
              <div className="bg-gray-50 rounded-lg p-3 space-y-2">
                {simulation.balanceChanges.map((change, i) => (
                  <div key={i} className="flex justify-between text-sm">
                    <span>{change.token} balance:</span>
                    <span>
                      <span className="text-gray-500">{change.before}</span>
                      <span className="mx-2" aria-hidden="true">→</span>
                      <span className="sr-only">changes to</span>
                      <span className="font-medium">{change.after}</span>
                    </span>
                  </div>
                ))}
              </div>
            </section>
          )}

          {/* Warnings */}
          {simulation?.warnings && simulation.warnings.length > 0 && (
            <section 
              aria-labelledby="tx-warnings-heading"
              className="bg-yellow-50 border border-yellow-200 rounded-lg p-4"
            >
              <h3 
                id="tx-warnings-heading" 
                className="font-medium text-yellow-800 flex items-center gap-2"
              >
                <WarningIcon className="w-5 h-5" />
                Warnings
              </h3>
              <ul className="mt-2 space-y-1 text-sm text-yellow-700">
                {simulation.warnings.map((warning, i) => (
                  <li key={i}>• {warning}</li>
                ))}
              </ul>
            </section>
          )}

          {/* Irreversibility warning */}
          <div 
            className="flex items-center gap-2 text-sm text-gray-600 
                       bg-gray-100 rounded-lg p-3"
            role="note"
          >
            <InfoIcon className="w-4 h-4 flex-shrink-0" />
            <span>
              Blockchain transactions are irreversible. 
              Please verify all details before confirming.
            </span>
          </div>

          {/* View technical details */}
          <details className="text-sm">
            <summary 
              className="cursor-pointer text-blue-600 hover:text-blue-800
                         focus:outline-none focus:ring-2 focus:ring-blue-500 
                         rounded px-1"
            >
              View technical details
            </summary>
            <div className="mt-2 bg-gray-50 rounded-lg p-3 font-mono text-xs space-y-2">
              <div>
                <span className="text-gray-500">To: </span>
                {transaction.to}
              </div>
              {transaction.value && (
                <div>
                  <span className="text-gray-500">Value: </span>
                  {transaction.value.toString()} wei
                </div>
              )}
              {transaction.data && transaction.data !== '0x' && (
                <div>
                  <span className="text-gray-500">Data: </span>
                  <span className="break-all">{transaction.data}</span>
                </div>
              )}
              {transaction.gasEstimate && (
                <div>
                  <span className="text-gray-500">Gas Limit: </span>
                  {transaction.gasEstimate.toString()}
                </div>
              )}
            </div>
          </details>
        </div>

        {/* Actions */}
        <div className="p-4 border-t bg-gray-50">
          <div className="flex gap-3">
            <button
              ref={rejectButtonRef}
              onClick={onClose}
              disabled={isConfirming}
              className="flex-1 px-4 py-3 rounded-lg border border-gray-300
                         hover:bg-gray-100 focus:outline-none 
                         focus:ring-2 focus:ring-gray-500
                         disabled:opacity-50 disabled:cursor-not-allowed
                         text-base font-medium"
            >
              Reject
            </button>
            
            <button
              onClick={handleConfirmClick}
              disabled={isConfirming}
              className={`flex-1 px-4 py-3 rounded-lg text-white
                         focus:outline-none focus:ring-2 focus:ring-offset-2
                         disabled:opacity-50 disabled:cursor-not-allowed
                         text-base font-medium transition-colors
                         ${confirmStep === 'confirming' 
                           ? 'bg-red-600 hover:bg-red-700 focus:ring-red-500' 
                           : 'bg-blue-600 hover:bg-blue-700 focus:ring-blue-500'
                         }`}
              aria-describedby={confirmStep === 'confirming' ? 'confirm-warning' : undefined}
            >
              {isConfirming ? (
                <span className="flex items-center justify-center gap-2">
                  <LoadingSpinner />
                  Signing...
                </span>
              ) : confirmStep === 'confirming' ? (
                'Click again to confirm'
              ) : (
                'Confirm & Sign'
              )}
            </button>
          </div>
          
          {confirmStep === 'confirming' && (
            <p id="confirm-warning" className="text-center text-sm text-red-600 mt-2">
              Click again to sign this transaction
            </p>
          )}
        </div>

        {/* Keyboard hints */}
        <div className="p-2 border-t text-xs text-gray-500 text-center bg-gray-100">
          <kbd className="px-1.5 py-0.5 bg-white rounded border">Esc</kbd>
          {' '}to cancel
          <span className="mx-2">·</span>
          <kbd className="px-1.5 py-0.5 bg-white rounded border">Tab</kbd>
          {' '}to navigate
        </div>
      </div>
    </>
  );
}

// Helper functions

function buildTransactionSummary(
  tx: TransactionDetails,
  simulation: TransactionConfirmationProps['simulation'],
  ethPrice: number
): string {
  const parts: string[] = [];
  
  parts.push('Confirm transaction dialog.');
  parts.push(`${getTransactionVerb(tx.type)}`);
  
  if (tx.value) {
    const ethAmount = formatEther(tx.value);
    const usd = (parseFloat(ethAmount) * ethPrice).toFixed(2);
    parts.push(`${ethAmount} ETH, worth $${usd},`);
  } else if (tx.tokenAmount && tx.tokenSymbol) {
    parts.push(`${tx.tokenAmount} ${tx.tokenSymbol},`);
  }
  
  if (tx.toLabel) {
    parts.push(`to ${tx.toLabel}.`);
  } else if (tx.to) {
    parts.push(`to address ${truncateAddress(tx.to)}.`);
  }
  
  if (simulation?.warnings?.length) {
    parts.push(`Warning: ${simulation.warnings.join('. ')}`);
  }
  
  parts.push('This action cannot be undone.');
  
  return parts.join(' ');
}

function getTransactionVerb(type: TransactionDetails['type']): string {
  const verbs: Record<string, string> = {
    send: "You're sending",
    swap: "You're swapping",
    approve: "You're approving",
    stake: "You're staking",
    unstake: "You're unstaking",
    contract: "Contract interaction",
  };
  return verbs[type] || "Transaction";
}

function truncateAddress(address: string): string {
  return `${address.slice(0, 6)}...${address.slice(-4)}`;
}

// Icon components
function TransactionIcon({ type }: { type: TransactionDetails['type'] }) {
  const icons: Record<string, string> = {
    send: '📤',
    swap: '🔄',
    approve: '✅',
    stake: '🔒',
    unstake: '🔓',
    contract: '📄',
  };
  return <span aria-hidden="true">{icons[type] || '📄'}</span>;
}

function CloseIcon({ className }: { className?: string }) {
  return (
    <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
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

function InfoIcon({ className }: { className?: string }) {
  return (
    <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} 
        d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
    </svg>
  );
}

function LoadingSpinner() {
  return (
    <svg 
      className="animate-spin h-5 w-5" 
      fill="none" 
      viewBox="0 0 24 24"
      aria-hidden="true"
    >
      <circle 
        className="opacity-25" 
        cx="12" cy="12" r="10" 
        stroke="currentColor" 
        strokeWidth="4"
      />
      <path 
        className="opacity-75" 
        fill="currentColor" 
        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
      />
    </svg>
  );
}
```

### Usage Example

```tsx
import { useState } from 'react';
import { useSendTransaction, useWaitForTransactionReceipt } from 'wagmi';
import { parseEther } from 'viem';
import { TransactionConfirmation } from './TransactionConfirmation';

export function SendETHButton() {
  const [isConfirmOpen, setIsConfirmOpen] = useState(false);
  const [txDetails, setTxDetails] = useState<TransactionDetails | null>(null);
  
  const { sendTransaction, data: hash } = useSendTransaction();
  const { isLoading, isSuccess } = useWaitForTransactionReceipt({ hash });

  const handleSend = (to: `0x${string}`, amount: string) => {
    setTxDetails({
      type: 'send',
      to,
      toLabel: 'vitalik.eth',
      value: parseEther(amount),
      gasEstimate: BigInt(21000),
      gasPriceGwei: 30,
      chainId: 1,
    });
    setIsConfirmOpen(true);
  };

  const handleConfirm = async () => {
    if (!txDetails) return;
    
    await sendTransaction({
      to: txDetails.to,
      value: txDetails.value,
    });
  };

  return (
    <>
      <button
        onClick={() => handleSend('0x742d35Cc6634C0532925a3b844Bc9e7595f', '1.5')}
        className="px-4 py-2 bg-blue-600 text-white rounded-lg"
        aria-haspopup="dialog"
      >
        Send 1.5 ETH
      </button>

      {txDetails && (
        <TransactionConfirmation
          isOpen={isConfirmOpen}
          onClose={() => setIsConfirmOpen(false)}
          onConfirm={handleConfirm}
          transaction={txDetails}
          simulation={{
            success: true,
            balanceChanges: [
              { token: 'ETH', before: '2.3', after: '0.8' }
            ],
            warnings: [],
          }}
          ethPrice={2300}
        />
      )}
    </>
  );
}
```

---

## Accessibility Checklist

### ARIA Requirements

| Attribute | Element | Purpose |
|-----------|---------|---------|
| `role="alertdialog"` | Modal | Indicates urgent dialog |
| `aria-modal="true"` | Modal | Traps virtual cursor |
| `aria-labelledby` | Modal | Points to title |
| `aria-describedby` | Modal | Points to transaction summary |
| `aria-live="assertive"` | Status region | Urgent announcements |
| `aria-disabled` | Buttons | Loading state |
| `aria-describedby` | Confirm button | Points to warning on 2nd step |

### Keyboard Navigation

| Key | Action |
|-----|--------|
| `Tab` | Move between focusable elements |
| `Shift + Tab` | Move backwards |
| `Enter` | Activate focused button |
| `Space` | Activate focused button |
| `Escape` | Reject and close |

### Screen Reader Testing Script

```
1. Open transaction confirmation
   Expected: Full summary announced including amount, recipient, warnings

2. Tab to Reject button
   Expected: "Reject, button"

3. Tab to Confirm button
   Expected: "Confirm and Sign, button"

4. Press Enter on Confirm
   Expected: "Are you sure? Press the confirm button again..."

5. Press Enter again
   Expected: "Signing transaction. Please check your wallet."

6. On success
   Expected: "Transaction submitted successfully."
```

---

## Testing

### Unit Tests

```tsx
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { TransactionConfirmation } from './TransactionConfirmation';

const mockTransaction = {
  type: 'send' as const,
  to: '0x742d35Cc6634C0532925a3b844Bc9e7595f' as `0x${string}`,
  toLabel: 'vitalik.eth',
  value: BigInt('1500000000000000000'), // 1.5 ETH
  gasEstimate: BigInt(21000),
  gasPriceGwei: 30,
  chainId: 1,
};

describe('TransactionConfirmation', () => {
  const mockOnClose = jest.fn();
  const mockOnConfirm = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('Accessibility', () => {
    it('has correct dialog role', () => {
      render(
        <TransactionConfirmation
          isOpen={true}
          onClose={mockOnClose}
          onConfirm={mockOnConfirm}
          transaction={mockTransaction}
        />
      );

      expect(screen.getByRole('alertdialog')).toBeInTheDocument();
    });

    it('announces transaction summary on open', () => {
      render(
        <TransactionConfirmation
          isOpen={true}
          onClose={mockOnClose}
          onConfirm={mockOnConfirm}
          transaction={mockTransaction}
          ethPrice={2300}
        />
      );

      const status = screen.getByRole('status');
      expect(status).toHaveTextContent(/you're sending/i);
      expect(status).toHaveTextContent(/1\.5 ETH/);
    });

    it('requires two clicks to confirm', async () => {
      const user = userEvent.setup();
      
      render(
        <TransactionConfirmation
          isOpen={true}
          onClose={mockOnClose}
          onConfirm={mockOnConfirm}
          transaction={mockTransaction}
        />
      );

      const confirmButton = screen.getByText('Confirm & Sign');
      await user.click(confirmButton);

      // Should not call onConfirm yet
      expect(mockOnConfirm).not.toHaveBeenCalled();
      expect(screen.getByText('Click again to confirm')).toBeInTheDocument();

      // Second click
      await user.click(screen.getByText('Click again to confirm'));
      expect(mockOnConfirm).toHaveBeenCalled();
    });

    it('closes on Escape', async () => {
      const user = userEvent.setup();
      
      render(
        <TransactionConfirmation
          isOpen={true}
          onClose={mockOnClose}
          onConfirm={mockOnConfirm}
          transaction={mockTransaction}
        />
      );

      await user.keyboard('{Escape}');
      expect(mockOnClose).toHaveBeenCalled();
    });

    it('displays simulation results accessibly', () => {
      render(
        <TransactionConfirmation
          isOpen={true}
          onClose={mockOnClose}
          onConfirm={mockOnConfirm}
          transaction={mockTransaction}
          simulation={{
            success: true,
            balanceChanges: [
              { token: 'ETH', before: '2.3', after: '0.8' }
            ],
            warnings: [],
          }}
        />
      );

      expect(screen.getByText('After this transaction')).toBeInTheDocument();
      expect(screen.getByText('2.3')).toBeInTheDocument();
      expect(screen.getByText('0.8')).toBeInTheDocument();
    });

    it('announces warnings', () => {
      render(
        <TransactionConfirmation
          isOpen={true}
          onClose={mockOnClose}
          onConfirm={mockOnConfirm}
          transaction={mockTransaction}
          simulation={{
            success: true,
            balanceChanges: [],
            warnings: ['This contract is unverified'],
          }}
        />
      );

      expect(screen.getByText(/this contract is unverified/i)).toBeInTheDocument();
    });
  });
});
```

---

## Common Failures

### ❌ Failure 1: Raw Hex Data Only

```tsx
// BAD: No human-readable summary
<div>
  <code>{transaction.data}</code>
</div>

// User has no idea what the transaction does
```

### ❌ Failure 2: One-Click Signing

```tsx
// BAD: No confirmation step
<button onClick={signTransaction}>
  Sign
</button>

// Too easy to accidentally sign
```

### ❌ Failure 3: No Simulation Results

```tsx
// BAD: User doesn't know outcome
<div>
  Amount: {amount}
  <button>Sign</button>
</div>

// "What will happen to my balance?"
```

### ❌ Failure 4: Silent Status Changes

```tsx
// BAD: No announcements
useEffect(() => {
  if (isSuccess) router.push('/success');
}, [isSuccess]);

// Screen reader users don't know what happened
```

---

## Related Techniques

- [Address Display](./address-display.md)
- [Token Approval](./token-approval.md)
- [Gas Estimation](./gas-estimation.md)

## Related Guidelines

- [2.2 Transaction Signing](../guidelines/operable/2.2-transaction-signing.md)
- [1.2 Transaction Clarity](../guidelines/perceivable/1.2-transaction-clarity.md)
- [3.1 Readable Transactions](../guidelines/understandable/3.1-readable-transactions.md)
- [3.4 Risk Communication](../guidelines/understandable/3.4-risk-communication.md)
