# Technique: Accessible Token Approval

**W3AG Guidelines**: 3.4.1, 3.4.2, 2.2.1, 1.2.1, 3.3.2  
**Conformance Level**: AA  
**Last Updated**: 2024-12-29

---

## Problem Statement

Token approvals grant smart contracts permission to spend tokens on a user's behalf. This is one of the most dangerous operations in DeFi, yet current implementations make it nearly impossible for users to understand what they're agreeing to:

### For Screen Reader Users
- **"Approve" means nothing**: No explanation of what approval grants
- **Unlimited = invisible**: The concept of "unlimited approval" isn't communicated
- **Contract addresses unlabeled**: Users can't identify what they're approving
- **No revocation guidance**: Users don't know approvals persist

### For Users with Cognitive Disabilities
- **Abstract concept**: "Token approval" doesn't map to real-world mental models
- **Hidden consequences**: Approval ≠ transaction; users don't understand the difference
- **Risk unexplained**: "Unlimited" approval risks aren't articulated
- **Revocation forgotten**: Approvals persist indefinitely without reminders

### For All Users
- **Scam approvals**: Malicious dApps request unlimited approvals for popular tokens
- **Approval fatigue**: Users click "Approve" reflexively without reading
- **No visibility**: Users can't see existing approvals

### Real-World Attack Vectors
- **Ice phishing**: Trick users into approving attacker-controlled contracts
- **Unlimited drain**: Compromised protocols drain all approved tokens
- **Stale approvals**: Old approvals to abandoned protocols remain exploitable

---

## Solution Pattern

### Core Principles

1. **Explain in plain language**: "You're giving [Protocol] permission to spend your USDC"
2. **Highlight unlimited vs. limited**: Default to limited, warn strongly about unlimited
3. **Show the spender clearly**: Verified contract name + address
4. **Explain persistence**: "This permission stays active until you revoke it"
5. **Recommend exact amounts**: Pre-fill with only what's needed
6. **Provide easy revocation**: Link to revoke after approval

### Approval Dialog Structure

```
┌─────────────────────────────────────────────────────────┐
│  Token Approval Request                            [X]  │
├─────────────────────────────────────────────────────────┤
│                                                         │
│  🔐 Permission Request                                  │
│                                                         │
│  Uniswap V3 Router wants permission to                  │
│  spend your USDC tokens.                                │
│                                                         │
│  ┌─────────────────────────────────────────────────┐   │
│  │  Token: USDC (USD Coin)                          │   │
│  │  Spender: Uniswap V3 Router                     │   │
│  │           0x68b3...4d8f ✓ Verified              │   │
│  └─────────────────────────────────────────────────┘   │
│                                                         │
│  📊 Approval Amount                                     │
│  ┌─────────────────────────────────────────────────┐   │
│  │  ○ Exact amount: 100 USDC (Recommended)         │   │
│  │  ○ Unlimited (Not recommended)                   │   │
│  │                                                  │   │
│  │  [Custom amount: __________ USDC]               │   │
│  └─────────────────────────────────────────────────┘   │
│                                                         │
│  ⚠️  What this means:                                  │
│  • Uniswap can move up to 100 USDC from your wallet    │
│  • This permission remains until you revoke it         │
│  • You can revoke anytime at revoke.cash               │
│                                                         │
│  ⛔ UNLIMITED APPROVAL WARNING (if selected)           │
│  This contract could drain ALL your USDC at any time.  │
│                                                         │
│  ┌─────────────────┐  ┌─────────────────────────┐      │
│  │     Reject      │  │      Approve            │      │
│  └─────────────────┘  └─────────────────────────┘      │
│                                                         │
└─────────────────────────────────────────────────────────┘

Screen reader announces:
"Token approval request dialog. Uniswap V3 Router wants permission 
to spend your USDC tokens. Approval amount options: Exact amount 
100 USDC, recommended. Or Unlimited, not recommended. Warning: 
This permission remains until you revoke it."
```

---

## Implementation

### Full React Component

```tsx
import React, { useState, useCallback, useEffect, useRef, useMemo } from 'react';
import { useWriteContract, useSimulateContract, useAccount } from 'wagmi';
import { formatUnits, parseUnits, maxUint256 } from 'viem';
import { erc20Abi } from 'viem';

/**
 * W3AG Compliant Token Approval Dialog
 * 
 * Conformance: Level AA
 * Guidelines: 3.4.1, 3.4.2, 2.2.1, 1.2.1, 3.3.2
 */

interface TokenInfo {
  address: `0x${string}`;
  symbol: string;
  name: string;
  decimals: number;
  balance: bigint;
  logoUrl?: string;
}

interface SpenderInfo {
  address: `0x${string}`;
  name: string;
  verified: boolean;
  riskLevel: 'low' | 'medium' | 'high' | 'unknown';
  explorerUrl?: string;
}

interface TokenApprovalDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onApprove: (amount: bigint) => Promise<void>;
  token: TokenInfo;
  spender: SpenderInfo;
  requestedAmount: bigint;
  chainId: number;
}

type ApprovalType = 'exact' | 'unlimited' | 'custom';

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
      
      // Build announcement
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
  }, [onClose]);

  // Handle approval
  const handleApprove = useCallback(async () => {
    if (approvalType === 'unlimited') {
      // Extra confirmation for unlimited
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
        aria-labelledby="approval-title"
        aria-describedby="approval-description"
        className="fixed inset-4 md:inset-auto md:top-1/2 md:left-1/2 
                   md:-translate-x-1/2 md:-translate-y-1/2
                   md:max-w-lg md:w-full
                   bg-white rounded-xl shadow-2xl z-50
                   flex flex-col max-h-[90vh]"
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
        <div className="flex items-center justify-between p-4 border-b">
          <div className="flex items-center gap-2">
            <LockIcon className="w-5 h-5 text-blue-600" />
            <h2 id="approval-title" className="text-lg font-semibold">
              Token Approval Request
            </h2>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-lg hover:bg-gray-100 
                       focus:outline-none focus:ring-2 focus:ring-blue-500"
            aria-label="Cancel approval and close"
          >
            <CloseIcon className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4">
          {/* Plain language explanation */}
          <section id="approval-description" className="bg-blue-50 rounded-lg p-4">
            <p className="text-lg">
              <strong>{spender.name}</strong> wants permission to spend your{' '}
              <strong>{token.symbol}</strong> tokens.
            </p>
          </section>

          {/* Token and Spender details */}
          <section aria-labelledby="details-heading" className="bg-gray-50 rounded-lg p-4">
            <h3 id="details-heading" className="text-sm font-medium text-gray-700 mb-3">
              Details
            </h3>
            
            <div className="space-y-3">
              {/* Token info */}
              <div className="flex items-center justify-between">
                <span className="text-gray-600">Token:</span>
                <div className="flex items-center gap-2">
                  {token.logoUrl && (
                    <img 
                      src={token.logoUrl} 
                      alt="" 
                      className="w-5 h-5 rounded-full"
                      aria-hidden="true"
                    />
                  )}
                  <span className="font-medium">
                    {token.symbol} ({token.name})
                  </span>
                </div>
              </div>

              {/* Your balance */}
              <div className="flex items-center justify-between">
                <span className="text-gray-600">Your balance:</span>
                <span className="font-medium">
                  {formattedBalance} {token.symbol}
                </span>
              </div>

              {/* Spender info */}
              <div className="flex items-center justify-between">
                <span className="text-gray-600">Spender:</span>
                <div className="text-right">
                  <div className="flex items-center gap-2">
                    <span className="font-medium">{spender.name}</span>
                    {spender.verified ? (
                      <span className="text-green-600 text-xs bg-green-100 px-1.5 py-0.5 rounded-full">
                        ✓ Verified
                      </span>
                    ) : (
                      <span className="text-red-600 text-xs bg-red-100 px-1.5 py-0.5 rounded-full">
                        ⚠ Unverified
                      </span>
                    )}
                  </div>
                  <a
                    href={spender.explorerUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-xs text-blue-600 hover:underline font-mono"
                  >
                    {truncateAddress(spender.address)}
                  </a>
                </div>
              </div>
            </div>
          </section>

          {/* Approval amount selection */}
          <fieldset aria-labelledby="amount-heading">
            <legend id="amount-heading" className="text-sm font-medium text-gray-700 mb-3">
              Approval Amount
            </legend>
            
            <div className="space-y-3">
              {/* Exact amount option */}
              <label className={`
                flex items-start gap-3 p-3 rounded-lg border-2 cursor-pointer
                ${approvalType === 'exact' 
                  ? 'border-blue-500 bg-blue-50' 
                  : 'border-gray-200 hover:border-gray-300'}
              `}>
                <input
                  ref={firstInputRef}
                  type="radio"
                  name="approvalType"
                  value="exact"
                  checked={approvalType === 'exact'}
                  onChange={() => handleTypeChange('exact')}
                  className="mt-1"
                />
                <div className="flex-1">
                  <div className="font-medium">
                    Exact amount: {formattedRequestedAmount} {token.symbol}
                  </div>
                  <div className="text-sm text-green-600">
                    ✓ Recommended — Only approve what's needed
                  </div>
                </div>
              </label>

              {/* Unlimited option */}
              <label className={`
                flex items-start gap-3 p-3 rounded-lg border-2 cursor-pointer
                ${approvalType === 'unlimited' 
                  ? 'border-red-500 bg-red-50' 
                  : 'border-gray-200 hover:border-gray-300'}
              `}>
                <input
                  type="radio"
                  name="approvalType"
                  value="unlimited"
                  checked={approvalType === 'unlimited'}
                  onChange={() => handleTypeChange('unlimited')}
                  className="mt-1"
                />
                <div className="flex-1">
                  <div className="font-medium">Unlimited</div>
                  <div className="text-sm text-red-600">
                    ⚠ Not recommended — Contract can spend all your {token.symbol}
                  </div>
                </div>
              </label>

              {/* Custom amount option */}
              <label className={`
                flex items-start gap-3 p-3 rounded-lg border-2 cursor-pointer
                ${approvalType === 'custom' 
                  ? 'border-blue-500 bg-blue-50' 
                  : 'border-gray-200 hover:border-gray-300'}
              `}>
                <input
                  type="radio"
                  name="approvalType"
                  value="custom"
                  checked={approvalType === 'custom'}
                  onChange={() => handleTypeChange('custom')}
                  className="mt-1"
                />
                <div className="flex-1">
                  <div className="font-medium">Custom amount</div>
                  {approvalType === 'custom' && (
                    <div className="mt-2">
                      <label htmlFor="custom-amount" className="sr-only">
                        Enter custom approval amount in {token.symbol}
                      </label>
                      <div className="flex items-center gap-2">
                        <input
                          id="custom-amount"
                          type="text"
                          inputMode="decimal"
                          value={customAmount}
                          onChange={(e) => setCustomAmount(e.target.value)}
                          placeholder="0.00"
                          className="flex-1 px-3 py-2 border border-gray-300 rounded-lg
                                     focus:outline-none focus:ring-2 focus:ring-blue-500"
                          aria-describedby="custom-amount-hint"
                        />
                        <span className="text-gray-600">{token.symbol}</span>
                      </div>
                      <div id="custom-amount-hint" className="text-xs text-gray-500 mt-1">
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
            <div
              role="alert"
              className="bg-red-100 border border-red-300 rounded-lg p-4"
            >
              <h4 className="font-bold text-red-800 flex items-center gap-2">
                <DangerIcon className="w-5 h-5" />
                Unlimited Approval Warning
              </h4>
              <ul className="mt-2 text-sm text-red-700 space-y-1">
                <li>• This contract could drain ALL your {token.symbol} at any time</li>
                <li>• If the contract is compromised, you could lose everything</li>
                <li>• This permission never expires automatically</li>
                <li>• You must manually revoke this approval to remove access</li>
              </ul>
            </div>
          )}

          {/* What this means */}
          <section 
            aria-labelledby="explanation-heading"
            className="bg-gray-50 rounded-lg p-4"
          >
            <h3 id="explanation-heading" className="text-sm font-medium text-gray-700 mb-2">
              What this means
            </h3>
            <ul className="text-sm text-gray-600 space-y-1">
              <li>
                • {spender.name} can move up to{' '}
                {approvalType === 'unlimited' 
                  ? `all your ${token.symbol}` 
                  : `${formatUnits(approvalAmount, token.decimals)} ${token.symbol}`
                }{' '}
                from your wallet
              </li>
              <li>• This permission remains active until you revoke it</li>
              <li>
                • You can revoke anytime at{' '}
                <a 
                  href="https://revoke.cash" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="text-blue-600 hover:underline"
                >
                  revoke.cash
                </a>
              </li>
            </ul>
          </section>

          {/* Unverified contract warning */}
          {!spender.verified && (
            <div
              role="alert"
              className="bg-yellow-50 border border-yellow-200 rounded-lg p-4"
            >
              <h4 className="font-medium text-yellow-800 flex items-center gap-2">
                <WarningIcon className="w-5 h-5" />
                Unverified Contract
              </h4>
              <p className="text-sm text-yellow-700 mt-1">
                This contract's source code is not verified on block explorers.
                This could indicate a scam. Proceed with extreme caution.
              </p>
            </div>
          )}
        </div>

        {/* Actions */}
        <div className="p-4 border-t bg-gray-50">
          <div className="flex gap-3">
            <button
              onClick={onClose}
              disabled={isApproving}
              className="flex-1 px-4 py-3 rounded-lg border border-gray-300
                         hover:bg-gray-100 focus:outline-none 
                         focus:ring-2 focus:ring-gray-500
                         disabled:opacity-50
                         text-base font-medium"
            >
              Reject
            </button>
            
            <button
              onClick={handleApprove}
              disabled={isApproving || (approvalType === 'custom' && !customAmount)}
              className={`flex-1 px-4 py-3 rounded-lg text-white
                         focus:outline-none focus:ring-2 focus:ring-offset-2
                         disabled:opacity-50 disabled:cursor-not-allowed
                         text-base font-medium transition-colors
                         ${approvalType === 'unlimited'
                           ? 'bg-red-600 hover:bg-red-700 focus:ring-red-500'
                           : 'bg-blue-600 hover:bg-blue-700 focus:ring-blue-500'
                         }`}
            >
              {isApproving ? (
                <span className="flex items-center justify-center gap-2">
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
      </div>
    </>
  );
}

// Helper function
function truncateAddress(address: string): string {
  return `${address.slice(0, 6)}...${address.slice(-4)}`;
}

// Icon components
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
    <svg className="animate-spin h-5 w-5" fill="none" viewBox="0 0 24 24" aria-hidden="true">
      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
    </svg>
  );
}
```

### wagmi Integration

```tsx
import { useWriteContract, useWaitForTransactionReceipt } from 'wagmi';
import { erc20Abi, parseUnits } from 'viem';

export function useTokenApproval(
  tokenAddress: `0x${string}`,
  spenderAddress: `0x${string}`
) {
  const { writeContract, data: hash, isPending } = useWriteContract();
  const { isLoading, isSuccess } = useWaitForTransactionReceipt({ hash });

  const approve = async (amount: bigint) => {
    await writeContract({
      address: tokenAddress,
      abi: erc20Abi,
      functionName: 'approve',
      args: [spenderAddress, amount],
    });
  };

  return {
    approve,
    isPending,
    isConfirming: isLoading,
    isSuccess,
    hash,
  };
}

// Usage
function SwapPage() {
  const [showApproval, setShowApproval] = useState(false);
  const { approve, isPending } = useTokenApproval(USDC_ADDRESS, UNISWAP_ROUTER);

  return (
    <TokenApprovalDialog
      isOpen={showApproval}
      onClose={() => setShowApproval(false)}
      onApprove={approve}
      token={{
        address: USDC_ADDRESS,
        symbol: 'USDC',
        name: 'USD Coin',
        decimals: 6,
        balance: BigInt(100000000), // 100 USDC
      }}
      spender={{
        address: UNISWAP_ROUTER,
        name: 'Uniswap V3 Router',
        verified: true,
        riskLevel: 'low',
        explorerUrl: 'https://etherscan.io/address/...',
      }}
      requestedAmount={parseUnits('50', 6)}
      chainId={1}
    />
  );
}
```

---

## Accessibility Checklist

### ARIA Requirements

| Attribute | Element | Purpose |
|-----------|---------|---------|
| `role="alertdialog"` | Modal | Urgent decision required |
| `aria-modal="true"` | Modal | Traps virtual cursor |
| `role="alert"` | Warning banners | Immediate attention |
| `aria-live="assertive"` | Announcements | Urgent status updates |
| `aria-describedby` | Radio inputs | Points to recommendation text |

### Keyboard Navigation

| Key | Action |
|-----|--------|
| `Tab` | Move between options and buttons |
| `Arrow Up/Down` | Navigate radio options |
| `Space` | Select radio option |
| `Enter` | Activate approve/reject |
| `Escape` | Reject and close |

### Screen Reader Testing Script

```
1. Open approval dialog
   Expected: "[Spender] wants permission to spend your [Token]. 
              Requested amount [X]. Your balance [Y]."

2. Navigate to approval options
   Expected: "Exact amount [X], recommended, radio button, 
              1 of 3, checked"

3. Arrow down to unlimited
   Expected: "Unlimited, not recommended, radio button, 2 of 3.
              Warning: Unlimited approval selected..."

4. Tab to Approve button
   Expected: "Approve Unlimited (Risky), button"

5. Press Enter
   Expected: Confirmation dialog or wallet prompt
```

---

## Testing

### Unit Tests

```tsx
import { render, screen, fireEvent } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { TokenApprovalDialog } from './TokenApprovalDialog';

const mockToken = {
  address: '0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48' as `0x${string}`,
  symbol: 'USDC',
  name: 'USD Coin',
  decimals: 6,
  balance: BigInt(100000000),
};

const mockSpender = {
  address: '0x68b3465833fb72A70ecDF485E0e4C7bD8665Fc45' as `0x${string}`,
  name: 'Uniswap V3 Router',
  verified: true,
  riskLevel: 'low' as const,
};

describe('TokenApprovalDialog', () => {
  it('defaults to exact amount (safe option)', () => {
    render(
      <TokenApprovalDialog
        isOpen={true}
        onClose={() => {}}
        onApprove={async () => {}}
        token={mockToken}
        spender={mockSpender}
        requestedAmount={BigInt(50000000)}
        chainId={1}
      />
    );

    expect(screen.getByLabelText(/exact amount/i)).toBeChecked();
  });

  it('shows warning when unlimited selected', async () => {
    const user = userEvent.setup();
    
    render(
      <TokenApprovalDialog
        isOpen={true}
        onClose={() => {}}
        onApprove={async () => {}}
        token={mockToken}
        spender={mockSpender}
        requestedAmount={BigInt(50000000)}
        chainId={1}
      />
    );

    await user.click(screen.getByLabelText(/unlimited/i));
    
    expect(screen.getByRole('alert')).toHaveTextContent(/unlimited approval warning/i);
  });

  it('changes button style for unlimited approval', async () => {
    const user = userEvent.setup();
    
    render(
      <TokenApprovalDialog
        isOpen={true}
        onClose={() => {}}
        onApprove={async () => {}}
        token={mockToken}
        spender={mockSpender}
        requestedAmount={BigInt(50000000)}
        chainId={1}
      />
    );

    await user.click(screen.getByLabelText(/unlimited/i));
    
    expect(screen.getByText(/approve unlimited \(risky\)/i)).toBeInTheDocument();
  });

  it('warns about unverified contracts', () => {
    render(
      <TokenApprovalDialog
        isOpen={true}
        onClose={() => {}}
        onApprove={async () => {}}
        token={mockToken}
        spender={{ ...mockSpender, verified: false }}
        requestedAmount={BigInt(50000000)}
        chainId={1}
      />
    );

    expect(screen.getByText(/unverified contract/i)).toBeInTheDocument();
  });
});
```

---

## Common Failures

### ❌ Failure 1: No Explanation of "Approve"

```tsx
// BAD: User doesn't understand what approve does
<button onClick={approve}>
  Approve USDC
</button>

// What does "approve" mean? What happens if I click this?
```

### ❌ Failure 2: Unlimited by Default

```tsx
// BAD: Defaults to dangerous option
const [amount, setAmount] = useState(MaxUint256);

// User unknowingly grants unlimited access
```

### ❌ Failure 3: No Spender Identification

```tsx
// BAD: Just shows address
<div>Approve spending to 0x68b3...Fc45</div>

// User can't identify if this is legitimate
```

### ❌ Failure 4: No Revocation Guidance

```tsx
// BAD: No mention of how to revoke
<button onClick={approve}>Approve</button>

// User doesn't know approvals persist or how to remove them
```

### ❌ Failure 5: Same UI for All Risk Levels

```tsx
// BAD: Unlimited approval looks the same as exact
<button className="btn-primary">
  {isUnlimited ? 'Approve Unlimited' : 'Approve'}
</button>

// Visual distinction needed for dangerous actions
```

---

## Related Techniques

- [Transaction Signing](./transaction-signing.md)
- [Address Display](./address-display.md)
- [Network Switching](./network-switching.md)

## Related Guidelines

- [3.4 Risk Communication](../guidelines/understandable/3.4-risk-communication.md)
- [3.3 Error Prevention](../guidelines/understandable/3.3-error-prevention.md)
- [2.2 Transaction Signing](../guidelines/operable/2.2-transaction-signing.md)
