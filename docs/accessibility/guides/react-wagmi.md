# React + wagmi Implementation Guide

A practical guide to building W3AG-compliant DeFi interfaces with React and wagmi v2.

## Table of Contents

1. [Setup](#setup)
2. [Accessible Wallet Connection](#accessible-wallet-connection)
3. [Address Display](#address-display)
4. [Transaction Signing](#transaction-signing)
5. [Token Lists & Tables](#token-lists--tables)
6. [Form Inputs](#form-inputs)
7. [Live Updates & Announcements](#live-updates--announcements)
8. [Token Approval Dialog](#token-approval-dialog)
9. [Network Switcher](#network-switcher)
10. [Gas Estimator](#gas-estimator)
11. [Testing](#testing)

---

## Setup

### Dependencies

```bash
npm install wagmi viem @tanstack/react-query
```

### Accessibility-First Config

```tsx
// wagmi.config.ts
import { http, createConfig } from 'wagmi';
import { mainnet, polygon, arbitrum } from 'wagmi/chains';
import { injected, walletConnect, coinbaseWallet } from 'wagmi/connectors';

export const config = createConfig({
  chains: [mainnet, polygon, arbitrum],
  connectors: [
    injected(),
    walletConnect({
      projectId: process.env.NEXT_PUBLIC_WC_PROJECT_ID!,
    }),
    coinbaseWallet({ appName: 'Your App' }),
  ],
  transports: {
    [mainnet.id]: http(),
    [polygon.id]: http(),
    [arbitrum.id]: http(),
  },
});
```

### Global Accessibility Providers

```tsx
// providers.tsx
import { WagmiProvider } from 'wagmi';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { AccessibilityProvider } from './accessibility-context';

const queryClient = new QueryClient();

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <WagmiProvider config={config}>
      <QueryClientProvider client={queryClient}>
        <AccessibilityProvider>
          {children}
        </AccessibilityProvider>
      </QueryClientProvider>
    </WagmiProvider>
  );
}
```

---

## Accessible Wallet Connection

### ConnectButton Component

```tsx
// components/ConnectButton.tsx
import { useAccount, useConnect, useDisconnect } from 'wagmi';
import { useState } from 'react';
import { WalletModal } from './WalletModal';

export function ConnectButton() {
  const { address, isConnected, connector } = useAccount();
  const { connectors, connect, isPending } = useConnect();
  const { disconnect } = useDisconnect();
  const [isModalOpen, setIsModalOpen] = useState(false);

  if (isConnected) {
    return (
      <div className="connected-wallet">
        <span className="sr-only">Connected wallet:</span>
        <AddressDisplay address={address!} />
        
        <button
          onClick={() => disconnect()}
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
        aria-haspopup="dialog"
        aria-expanded={isModalOpen}
      >
        Connect Wallet
      </button>

      <WalletModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        wallets={connectors.map(c => ({
          id: c.id,
          name: c.name,
          icon: getConnectorIcon(c.id),
          installed: c.type === 'injected' ? !!window.ethereum : true,
          type: c.type as 'injected' | 'walletconnect' | 'coinbase',
        }))}
        onConnect={async (walletId) => {
          const connector = connectors.find(c => c.id === walletId);
          if (connector) {
            await connect({ connector });
          }
        }}
      />
    </>
  );
}
```

### Key Accessibility Features

- **Focus management**: Focus returns to trigger button after modal closes
- **Keyboard navigation**: Arrow keys, Enter, Escape all work
- **Screen reader announcements**: Connection status changes announced
- **ARIA attributes**: Proper roles, states, and properties

---

## Address Display

### Accessible Address Component

```tsx
// components/AddressDisplay.tsx
import { useEnsName } from 'wagmi';
import { useState, useCallback } from 'react';

interface AddressDisplayProps {
  address: `0x${string}`;
  showCopy?: boolean;
  truncate?: boolean;
}

export function AddressDisplay({ 
  address, 
  showCopy = true,
  truncate = true 
}: AddressDisplayProps) {
  const { data: ensName } = useEnsName({ address });
  const [copied, setCopied] = useState(false);
  const [announcement, setAnnouncement] = useState('');

  // Format address for screen readers (chunked)
  const formatForSR = (addr: string) => {
    const chunks = addr.slice(2).match(/.{1,4}/g);
    return `0x ${chunks?.join(' ')}`;
  };

  // Truncate for visual display
  const truncateAddr = (addr: string) => 
    `${addr.slice(0, 6)}...${addr.slice(-4)}`;

  const handleCopy = useCallback(async () => {
    await navigator.clipboard.writeText(address);
    setCopied(true);
    setAnnouncement('Address copied to clipboard');
    setTimeout(() => {
      setCopied(false);
      setAnnouncement('');
    }, 2000);
  }, [address]);

  const displayText = ensName || (truncate ? truncateAddr(address) : address);
  const srLabel = ensName 
    ? `${ensName}, address: ${formatForSR(address)}`
    : formatForSR(address);

  return (
    <span className="address-display">
      {/* SR announcement */}
      <span role="status" aria-live="polite" className="sr-only">
        {announcement}
      </span>

      {/* Address text */}
      <span aria-label={srLabel}>
        {displayText}
      </span>

      {/* Copy button */}
      {showCopy && (
        <button
          onClick={handleCopy}
          aria-label={copied ? 'Copied!' : 'Copy address'}
          className="copy-btn"
        >
          {copied ? '✓' : '📋'}
        </button>
      )}
    </span>
  );
}
```

### W3AG Criteria Met

- **1.1.1**: ENS name as text alternative
- **1.1.3**: Chunked format for screen readers
- **4.1.2**: Copy action announced via live region

---

## Transaction Signing

### useAccessibleTransaction Hook

```tsx
// hooks/useAccessibleTransaction.tsx
import { useSendTransaction, useWaitForTransactionReceipt } from 'wagmi';
import { useState, useCallback, useEffect } from 'react';
import { parseEther, formatEther } from 'viem';

interface TransactionParams {
  to: `0x${string}`;
  value?: bigint;
  data?: `0x${string}`;
}

export function useAccessibleTransaction() {
  const [announcement, setAnnouncement] = useState('');
  const [showConfirmation, setShowConfirmation] = useState(false);
  const [pendingTx, setPendingTx] = useState<TransactionParams | null>(null);

  const { 
    sendTransaction, 
    data: hash, 
    isPending: isSending,
    error: sendError 
  } = useSendTransaction();

  const { 
    isLoading: isConfirming, 
    isSuccess,
    error: confirmError 
  } = useWaitForTransactionReceipt({ hash });

  // Announce status changes
  useEffect(() => {
    if (isSending) {
      setAnnouncement('Transaction pending. Please confirm in your wallet.');
    } else if (isConfirming) {
      setAnnouncement('Transaction submitted. Waiting for confirmation.');
    } else if (isSuccess) {
      setAnnouncement('Transaction confirmed successfully!');
    } else if (sendError || confirmError) {
      setAnnouncement(`Transaction failed: ${(sendError || confirmError)?.message}`);
    }
  }, [isSending, isConfirming, isSuccess, sendError, confirmError]);

  const prepareTransaction = useCallback((params: TransactionParams) => {
    setPendingTx(params);
    setShowConfirmation(true);
  }, []);

  const confirmTransaction = useCallback(() => {
    if (!pendingTx) return;
    sendTransaction(pendingTx);
    setShowConfirmation(false);
    setPendingTx(null);
  }, [pendingTx, sendTransaction]);

  const cancelTransaction = useCallback(() => {
    setShowConfirmation(false);
    setPendingTx(null);
    setAnnouncement('Transaction cancelled.');
  }, []);

  return {
    prepareTransaction,
    confirmTransaction,
    cancelTransaction,
    showConfirmation,
    pendingTx,
    announcement,
    isSending,
    isConfirming,
    isSuccess,
    hash,
  };
}
```

### Transaction Confirmation Flow

```tsx
// components/SendForm.tsx
import { useAccessibleTransaction } from '../hooks/useAccessibleTransaction';
import { TransactionSummary } from './TransactionSummary';

export function SendForm() {
  const [to, setTo] = useState('');
  const [amount, setAmount] = useState('');
  
  const {
    prepareTransaction,
    confirmTransaction,
    cancelTransaction,
    showConfirmation,
    pendingTx,
    announcement,
    isSending,
    isConfirming,
  } = useAccessibleTransaction();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    prepareTransaction({
      to: to as `0x${string}`,
      value: parseEther(amount),
    });
  };

  return (
    <>
      {/* SR announcements */}
      <div role="status" aria-live="assertive" className="sr-only">
        {announcement}
      </div>

      <form onSubmit={handleSubmit}>
        <label>
          Recipient address
          <input
            type="text"
            value={to}
            onChange={(e) => setTo(e.target.value)}
            placeholder="0x... or ENS name"
            aria-describedby="to-help"
            required
          />
        </label>
        <p id="to-help" className="help-text">
          Enter an Ethereum address or ENS name
        </p>

        <label>
          Amount (ETH)
          <input
            type="number"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            step="0.0001"
            min="0"
            required
          />
        </label>

        <button type="submit" disabled={isSending || isConfirming}>
          Review Transaction
        </button>
      </form>

      {/* Confirmation modal */}
      {showConfirmation && pendingTx && (
        <TransactionSummary
          type="send"
          from={{
            amount: formatEther(pendingTx.value || 0n),
            symbol: 'ETH',
            usdValue: '1,950', // Calculate from price
          }}
          to={{
            address: pendingTx.to,
          }}
          gas={{
            estimateUsd: '2.50',
            estimateNative: '0.001',
            nativeSymbol: 'ETH',
          }}
          onConfirm={confirmTransaction}
          onReject={cancelTransaction}
          isConfirming={isSending}
        />
      )}
    </>
  );
}
```

---

## Token Lists & Tables

### Accessible Token Table

```tsx
// components/TokenTable.tsx
import { useBalance } from 'wagmi';

interface Token {
  address: `0x${string}`;
  symbol: string;
  name: string;
  decimals: number;
}

export function TokenTable({ 
  tokens, 
  userAddress 
}: { 
  tokens: Token[];
  userAddress: `0x${string}`;
}) {
  return (
    <table aria-label="Your token holdings">
      <caption className="sr-only">
        List of tokens in your wallet with balances and actions
      </caption>
      
      <thead>
        <tr>
          <th scope="col">Token</th>
          <th scope="col">Balance</th>
          <th scope="col">Value</th>
          <th scope="col">
            <span className="sr-only">Actions</span>
          </th>
        </tr>
      </thead>
      
      <tbody>
        {tokens.map(token => (
          <TokenRow 
            key={token.address} 
            token={token} 
            userAddress={userAddress}
          />
        ))}
      </tbody>
    </table>
  );
}

function TokenRow({ 
  token, 
  userAddress 
}: { 
  token: Token;
  userAddress: `0x${string}`;
}) {
  const { data: balance } = useBalance({
    address: userAddress,
    token: token.address,
  });

  return (
    <tr>
      <th scope="row">
        <span className="token-name">{token.name}</span>
        <span className="token-symbol">({token.symbol})</span>
      </th>
      
      <td>
        {balance?.formatted || '0'} {token.symbol}
      </td>
      
      <td>
        ${calculateUsdValue(balance?.value, token.address)}
      </td>
      
      <td>
        <button aria-label={`Send ${token.symbol}`}>
          Send
        </button>
        <button aria-label={`Swap ${token.symbol}`}>
          Swap
        </button>
      </td>
    </tr>
  );
}
```

---

## Form Inputs

### Amount Input with Accessibility

```tsx
// components/AmountInput.tsx
interface AmountInputProps {
  value: string;
  onChange: (value: string) => void;
  token: { symbol: string; balance: string };
  label: string;
  id: string;
}

export function AmountInput({
  value,
  onChange,
  token,
  label,
  id,
}: AmountInputProps) {
  const [announcement, setAnnouncement] = useState('');

  const handleMax = () => {
    onChange(token.balance);
    setAnnouncement(`Max amount set: ${token.balance} ${token.symbol}`);
  };

  return (
    <div className="amount-input">
      <div role="status" aria-live="polite" className="sr-only">
        {announcement}
      </div>

      <label htmlFor={id}>{label}</label>
      
      <div className="input-group">
        <input
          id={id}
          type="text"
          inputMode="decimal"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          aria-describedby={`${id}-balance`}
        />
        
        <button
          type="button"
          onClick={handleMax}
          aria-label={`Use maximum balance: ${token.balance} ${token.symbol}`}
        >
          Max
        </button>
        
        <span className="token-symbol">{token.symbol}</span>
      </div>
      
      <p id={`${id}-balance`} className="balance-text">
        Balance: {token.balance} {token.symbol}
      </p>
    </div>
  );
}
```

---

## Live Updates & Announcements

### Balance Change Announcer

```tsx
// components/BalanceAnnouncer.tsx
import { useBalance } from 'wagmi';
import { useEffect, useRef, useState } from 'react';
import { formatEther } from 'viem';

export function BalanceAnnouncer({ 
  address 
}: { 
  address: `0x${string}` 
}) {
  const { data: balance } = useBalance({ address, watch: true });
  const prevBalance = useRef(balance?.value);
  const [announcement, setAnnouncement] = useState('');

  useEffect(() => {
    if (!balance?.value || !prevBalance.current) {
      prevBalance.current = balance?.value;
      return;
    }

    const prev = prevBalance.current;
    const curr = balance.value;

    if (curr !== prev) {
      const diff = curr - prev;
      const direction = diff > 0 ? 'increased' : 'decreased';
      const amount = formatEther(diff > 0 ? diff : -diff);
      
      setAnnouncement(
        `Balance ${direction} by ${amount} ETH. ` +
        `New balance: ${balance.formatted} ETH.`
      );

      prevBalance.current = curr;
    }
  }, [balance]);

  return (
    <div 
      role="status" 
      aria-live="polite" 
      aria-atomic="true"
      className="sr-only"
    >
      {announcement}
    </div>
  );
}
```

---

## Testing

### Automated Testing Setup

```tsx
// tests/accessibility.test.tsx
import { render, screen } from '@testing-library/react';
import { axe, toHaveNoViolations } from 'jest-axe';
import userEvent from '@testing-library/user-event';
import { WalletModal } from '../components/WalletModal';

expect.extend(toHaveNoViolations);

describe('WalletModal Accessibility', () => {
  it('should have no axe violations', async () => {
    const { container } = render(
      <WalletModal
        isOpen={true}
        onClose={() => {}}
        onConnect={async () => {}}
        wallets={mockWallets}
      />
    );

    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });

  it('should trap focus within modal', async () => {
    render(
      <WalletModal
        isOpen={true}
        onClose={() => {}}
        onConnect={async () => {}}
        wallets={mockWallets}
      />
    );

    const firstWallet = screen.getByRole('option', { name: /metamask/i });
    const closeButton = screen.getByRole('button', { name: /close/i });

    // Tab through all focusable elements
    await userEvent.tab();
    await userEvent.tab();
    await userEvent.tab();
    
    // Should cycle back to first element
    expect(document.activeElement).toBe(firstWallet);
  });

  it('should close on Escape', async () => {
    const onClose = jest.fn();
    
    render(
      <WalletModal
        isOpen={true}
        onClose={onClose}
        onConnect={async () => {}}
        wallets={mockWallets}
      />
    );

    await userEvent.keyboard('{Escape}');
    expect(onClose).toHaveBeenCalled();
  });

  it('should announce wallet selection to screen readers', async () => {
    render(
      <WalletModal
        isOpen={true}
        onClose={() => {}}
        onConnect={async () => {}}
        wallets={mockWallets}
      />
    );

    const status = screen.getByRole('status');
    expect(status).toHaveTextContent(/navigate wallets/i);
  });
});
```

### Manual Testing Checklist

- [ ] Test with NVDA on Windows
- [ ] Test with VoiceOver on macOS
- [ ] Test with VoiceOver on iOS
- [ ] Test with TalkBack on Android
- [ ] Test keyboard-only navigation
- [ ] Test at 200% zoom
- [ ] Test with high contrast mode
- [ ] Test with reduced motion preference

---

## Token Approval Dialog

### Accessible Token Approval Flow

```tsx
// components/ApprovalExample.tsx
import { TokenApprovalDialog } from '@w3ag/react';
import { useWriteContract, useWaitForTransactionReceipt } from 'wagmi';
import { erc20Abi, parseUnits, maxUint256 } from 'viem';
import { useState } from 'react';

export function ApprovalExample() {
  const [showApproval, setShowApproval] = useState(false);
  const { writeContract, data: hash } = useWriteContract();
  
  const token = {
    address: '0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48' as const, // USDC
    symbol: 'USDC',
    name: 'USD Coin',
    decimals: 6,
    balance: parseUnits('1000', 6),
  };
  
  const spender = {
    address: '0x1111111254EEB25477B68fb85Ed929f73A960582' as const, // 1inch
    name: '1inch Router',
    verified: true,
    riskLevel: 'low' as const,
    explorerUrl: 'https://etherscan.io/address/0x1111111254EEB25477B68fb85Ed929f73A960582',
  };

  const handleApprove = async (amount: bigint) => {
    await writeContract({
      address: token.address,
      abi: erc20Abi,
      functionName: 'approve',
      args: [spender.address, amount],
    });
  };

  return (
    <>
      <button onClick={() => setShowApproval(true)}>
        Approve USDC
      </button>
      
      <TokenApprovalDialog
        isOpen={showApproval}
        onClose={() => setShowApproval(false)}
        onApprove={handleApprove}
        token={token}
        spender={spender}
        requestedAmount={parseUnits('100', 6)}
        chainId={1}
      />
    </>
  );
}
```

### W3AG Criteria Met

- **3.4.1**: Risk clearly communicated (unlimited approval warning)
- **3.4.2**: Spender verification status shown
- **3.1.1**: Plain language explanations of what approval means
- **2.1.1**: Full keyboard navigation with focus trap
- **4.1.2**: Approval status changes announced to screen readers

---

## Network Switcher

### Accessible Network Selection

```tsx
// components/NetworkExample.tsx
import { NetworkSwitcher, COMMON_NETWORKS } from '@w3ag/react';
import { useSwitchChain, useChainId, useAccount } from 'wagmi';

export function NetworkExample() {
  const chainId = useChainId();
  const { isConnected } = useAccount();
  const { switchChain, isPending, error } = useSwitchChain();

  return (
    <NetworkSwitcher
      currentNetworkId={chainId}
      requiredNetworkId={1} // Optional: require Ethereum mainnet
      networks={COMMON_NETWORKS}
      onNetworkSwitch={async (networkId) => {
        await switchChain({ chainId: networkId });
      }}
      isConnected={isConnected}
      isSwitching={isPending}
      switchError={error?.message}
      requireConfirmation={true}
    />
  );
}
```

### Custom Networks

```tsx
// Add custom networks to the list
const customNetworks = [
  ...COMMON_NETWORKS,
  {
    id: 324,
    name: 'zksync',
    displayName: 'zkSync Era',
    nativeCurrency: { name: 'Ether', symbol: 'ETH', decimals: 18 },
    rpcUrls: { default: { http: ['https://mainnet.era.zksync.io'] } },
    blockExplorers: { default: { name: 'zkSync Explorer', url: 'https://explorer.zksync.io' } },
  },
];
```

### W3AG Criteria Met

- **3.2.1**: No context change without explicit user confirmation
- **3.2.2**: Wrong network clearly indicated with alert banner
- **4.1.1**: ARIA combobox pattern for assistive technology
- **2.1.1**: Full keyboard navigation (arrow keys, Enter, Escape)
- **4.1.2**: Network changes announced to screen readers

---

## Gas Estimator

### Accessible Gas Fee Display

```tsx
// components/GasExample.tsx
import { GasEstimator, GasDisplay, GasWarning } from '@w3ag/react';
import { useGasPrice, useFeeData } from 'wagmi';
import { parseGwei } from 'viem';
import { useState } from 'react';

export function GasExample() {
  const [selectedSpeed, setSelectedSpeed] = useState<'slow' | 'standard' | 'fast' | 'instant'>('standard');
  const { data: feeData } = useFeeData();
  
  // Build gas speed options from current network data
  const gasSpeeds = [
    {
      id: 'slow' as const,
      label: 'Slow',
      description: 'May take several minutes',
      estimatedTime: '5-10 min',
      gasPrice: {
        price: parseGwei('20'),
        maxFeePerGas: feeData?.maxFeePerGas ? feeData.maxFeePerGas * 80n / 100n : parseGwei('20'),
        maxPriorityFeePerGas: parseGwei('1'),
      },
    },
    {
      id: 'standard' as const,
      label: 'Standard',
      description: 'Typical confirmation time',
      estimatedTime: '1-3 min',
      gasPrice: {
        price: parseGwei('30'),
        maxFeePerGas: feeData?.maxFeePerGas ?? parseGwei('30'),
        maxPriorityFeePerGas: parseGwei('1.5'),
      },
    },
    {
      id: 'fast' as const,
      label: 'Fast',
      description: 'Higher priority',
      estimatedTime: '15-30 sec',
      gasPrice: {
        price: parseGwei('40'),
        maxFeePerGas: feeData?.maxFeePerGas ? feeData.maxFeePerGas * 120n / 100n : parseGwei('40'),
        maxPriorityFeePerGas: parseGwei('2'),
      },
    },
    {
      id: 'instant' as const,
      label: 'Instant',
      description: 'Next block',
      estimatedTime: '< 15 sec',
      gasPrice: {
        price: parseGwei('60'),
        maxFeePerGas: feeData?.maxFeePerGas ? feeData.maxFeePerGas * 150n / 100n : parseGwei('60'),
        maxPriorityFeePerGas: parseGwei('3'),
      },
    },
  ];

  return (
    <GasEstimator
      gasLimit={21000n} // Simple ETH transfer
      gasSpeeds={gasSpeeds}
      selectedSpeedId={selectedSpeed}
      onSpeedChange={setSelectedSpeed}
      nativeTokenPriceUsd={3500}
      nativeCurrencySymbol="ETH"
      congestionLevel="normal"
      showDetails={true}
    />
  );
}
```

### Standalone Gas Display

```tsx
// Use GasDisplay independently for inline gas costs
<GasDisplay
  gasWei={parseGwei('30') * 21000n}
  priceUsd={3500}
  symbol="ETH"
  size="md"
/>
```

### Gas Warning Component

```tsx
// Show manual gas warnings when needed
<GasWarning
  type="high-gas"
  message="Gas fees are unusually high"
  explanation="Consider waiting for lower network activity, typically weekends or late night UTC."
  severity="warning"
  dismissible
/>
```

### W3AG Criteria Met

- **1.2.3**: Gas costs displayed in both native currency and USD
- **1.2.5**: Time estimates shown (e.g., "~30 seconds")
- **2.3.1**: Real-time updates without causing distraction
- **3.1.1**: Plain language explanations with help tooltip
- **4.1.2**: Speed changes announced to assistive technology
- **1.4.1**: Visual congestion indicator with text alternatives

---

## Additional Resources

- [W3AG Full Specification](../README.md)
- [Component Library](../components/)
- [WCAG 2.2 Guidelines](https://www.w3.org/WAI/WCAG22/quickref/)
- [wagmi Documentation](https://wagmi.sh)
