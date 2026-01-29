# Technique: Accessible Gas Estimation

**W3AG Guidelines**: 1.2.3, 1.2.5, 2.3.1, 3.1.1  
**Conformance Level**: AA  
**Last Updated**: 2024-12-29

---

## Problem Statement

Gas fees are one of the most confusing aspects of blockchain for all users, and current implementations create severe accessibility barriers:

### For Screen Reader Users
- **Live updates silent**: Gas prices change constantly but aren't announced
- **Visual-only indicators**: Congestion shown only with colors or graphs
- **Units meaningless**: "30 gwei" conveys nothing without context
- **No time estimates**: How long until confirmation?

### For Users with Cognitive Disabilities
- **Too many numbers**: Gas limit, gas price, max fee, priority fee, base fee...
- **Abstract units**: Gwei, wei — what does this mean in real money?
- **Dynamic changes**: Prices fluctuate causing decision paralysis
- **No recommendations**: Users don't know what to choose

### For Users with Low Vision
- **Small text**: Fee details often in tiny font
- **Color-coded speed tiers**: Slow/normal/fast distinguished only by color
- **Complex visualizations**: Gas charts assume visual pattern recognition

### Time Sensitivity Issues
- **Stale estimates**: By the time user signs, gas price may have changed
- **Failed transactions**: Too-low gas causes stuck transactions
- **Overpaying**: Users pay more than necessary from confusion

---

## Solution Pattern

### Core Principles

1. **Show USD equivalent prominently**: Users understand dollars, not gwei
2. **Use plain language speed tiers**: "~15 seconds" not "fast"
3. **Announce significant changes**: Alert when gas spikes or drops
4. **Provide recommendations**: Default to reasonable, explain tradeoffs
5. **Explain what gas is**: Brief education for new users
6. **Show network status**: Is the network congested right now?

### Gas Estimation UI Structure

```
┌─────────────────────────────────────────────────────────┐
│  Network Fee                                            │
├─────────────────────────────────────────────────────────┤
│                                                         │
│  Current network: Ethereum                              │
│  Status: 🟢 Low congestion                              │
│                                                         │
│  ┌─────────────────────────────────────────────────┐   │
│  │  ⚡ Speed     │  💰 Fee        │  ⏱️ Time       │   │
│  ├─────────────────────────────────────────────────┤   │
│  │  ○ Slow      │  ~$1.20        │  ~5 minutes    │   │
│  │  ● Standard  │  ~$2.45        │  ~30 seconds   │   │
│  │  ○ Fast      │  ~$4.80        │  ~15 seconds   │   │
│  │  ○ Custom    │  [____] gwei   │  Variable      │   │
│  └─────────────────────────────────────────────────┘   │
│                                                         │
│  💡 Recommended: Standard                               │
│     Good balance of speed and cost                      │
│                                                         │
│  ℹ️  What's this? Network fees pay miners/validators   │
│      to process your transaction.                       │
│                                                         │
└─────────────────────────────────────────────────────────┘

Screen reader announces:
"Network fee selection. Current network Ethereum, low congestion.
Standard speed selected, approximately $2.45, estimated 30 seconds.
This is the recommended option. 3 other options available."
```

---

## Implementation

### Full React Component

```tsx
import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { useGasPrice, useBlockNumber, useChainId } from 'wagmi';
import { formatGwei, formatEther } from 'viem';

/**
 * W3AG Compliant Gas Estimator
 * 
 * Conformance: Level AA
 * Guidelines: 1.2.3, 1.2.5, 2.3.1, 3.1.1
 */

interface GasEstimatorProps {
  /** Estimated gas units for the transaction */
  gasLimit: bigint;
  /** Current ETH price in USD */
  ethPrice: number;
  /** Callback when user selects a gas option */
  onGasSelect: (gasPrice: bigint, maxPriorityFee: bigint) => void;
  /** Chain-specific settings */
  chainId?: number;
  /** Show educational info for new users */
  showEducation?: boolean;
  /** Additional CSS class */
  className?: string;
}

type SpeedTier = 'slow' | 'standard' | 'fast' | 'custom';

interface GasOption {
  tier: SpeedTier;
  label: string;
  gasPrice: bigint;
  maxPriorityFee: bigint;
  timeEstimate: string;
  timeSeconds: number;
}

export function GasEstimator({
  gasLimit,
  ethPrice,
  onGasSelect,
  chainId: propChainId,
  showEducation = true,
  className = '',
}: GasEstimatorProps) {
  const wagmiChainId = useChainId();
  const chainId = propChainId ?? wagmiChainId;
  
  const { data: baseGasPrice, isLoading } = useGasPrice({ chainId });
  const { data: blockNumber } = useBlockNumber({ chainId, watch: true });
  
  const [selectedTier, setSelectedTier] = useState<SpeedTier>('standard');
  const [customGwei, setCustomGwei] = useState('');
  const [announcement, setAnnouncement] = useState('');
  const [previousGasPrice, setPreviousGasPrice] = useState<bigint | null>(null);
  const [congestionLevel, setCongestionLevel] = useState<'low' | 'medium' | 'high'>('low');

  // Calculate gas options based on current base price
  const gasOptions = useMemo((): GasOption[] => {
    if (!baseGasPrice) return [];

    const base = baseGasPrice;
    
    return [
      {
        tier: 'slow',
        label: 'Slow',
        gasPrice: base * BigInt(90) / BigInt(100), // 90% of base
        maxPriorityFee: BigInt(1e9), // 1 gwei
        timeEstimate: '~5 minutes',
        timeSeconds: 300,
      },
      {
        tier: 'standard',
        label: 'Standard',
        gasPrice: base,
        maxPriorityFee: BigInt(1.5e9), // 1.5 gwei
        timeEstimate: '~30 seconds',
        timeSeconds: 30,
      },
      {
        tier: 'fast',
        label: 'Fast',
        gasPrice: base * BigInt(120) / BigInt(100), // 120% of base
        maxPriorityFee: BigInt(2e9), // 2 gwei
        timeEstimate: '~15 seconds',
        timeSeconds: 15,
      },
    ];
  }, [baseGasPrice]);

  // Calculate USD cost for a gas option
  const calculateUsdCost = useCallback((gasPrice: bigint): string => {
    const costWei = gasPrice * gasLimit;
    const costEth = parseFloat(formatEther(costWei));
    return (costEth * ethPrice).toFixed(2);
  }, [gasLimit, ethPrice]);

  // Get current selected option
  const selectedOption = useMemo(() => {
    if (selectedTier === 'custom') {
      try {
        const customPrice = BigInt(parseFloat(customGwei) * 1e9);
        return {
          tier: 'custom' as const,
          label: 'Custom',
          gasPrice: customPrice,
          maxPriorityFee: customPrice / BigInt(10),
          timeEstimate: 'Variable',
          timeSeconds: -1,
        };
      } catch {
        return null;
      }
    }
    return gasOptions.find(opt => opt.tier === selectedTier) || null;
  }, [selectedTier, customGwei, gasOptions]);

  // Announce significant gas price changes
  useEffect(() => {
    if (!baseGasPrice || !previousGasPrice) {
      setPreviousGasPrice(baseGasPrice || null);
      return;
    }

    const change = Number(baseGasPrice - previousGasPrice) / Number(previousGasPrice);
    
    if (Math.abs(change) > 0.1) { // 10% change threshold
      const direction = change > 0 ? 'increased' : 'decreased';
      const percentage = Math.abs(change * 100).toFixed(0);
      setAnnouncement(
        `Network fees have ${direction} by ${percentage}%. ` +
        `Standard fee is now approximately $${calculateUsdCost(baseGasPrice)}.`
      );
    }

    setPreviousGasPrice(baseGasPrice);
  }, [baseGasPrice, previousGasPrice, calculateUsdCost]);

  // Update congestion level
  useEffect(() => {
    if (!baseGasPrice) return;
    
    const gweiPrice = Number(formatGwei(baseGasPrice));
    
    if (gweiPrice < 20) {
      setCongestionLevel('low');
    } else if (gweiPrice < 50) {
      setCongestionLevel('medium');
    } else {
      setCongestionLevel('high');
    }
  }, [baseGasPrice]);

  // Handle tier selection
  const handleTierSelect = useCallback((tier: SpeedTier) => {
    setSelectedTier(tier);
    
    const option = tier === 'custom' 
      ? null 
      : gasOptions.find(opt => opt.tier === tier);
    
    if (option) {
      onGasSelect(option.gasPrice, option.maxPriorityFee);
      setAnnouncement(
        `${option.label} speed selected. ` +
        `Estimated fee $${calculateUsdCost(option.gasPrice)}, ` +
        `${option.timeEstimate} confirmation time.`
      );
    }
  }, [gasOptions, onGasSelect, calculateUsdCost]);

  // Handle custom gas input
  const handleCustomGasChange = useCallback((value: string) => {
    setCustomGwei(value);
    
    try {
      const customPrice = BigInt(parseFloat(value) * 1e9);
      onGasSelect(customPrice, customPrice / BigInt(10));
    } catch {
      // Invalid input, ignore
    }
  }, [onGasSelect]);

  // Network name helper
  const getNetworkName = (id: number): string => {
    const networks: Record<number, string> = {
      1: 'Ethereum',
      10: 'Optimism',
      137: 'Polygon',
      42161: 'Arbitrum',
      8453: 'Base',
    };
    return networks[id] || `Chain ${id}`;
  };

  // Congestion display
  const congestionDisplay = {
    low: { label: 'Low congestion', color: 'text-green-600', bg: 'bg-green-100', icon: '🟢' },
    medium: { label: 'Moderate congestion', color: 'text-yellow-600', bg: 'bg-yellow-100', icon: '🟡' },
    high: { label: 'High congestion', color: 'text-red-600', bg: 'bg-red-100', icon: '🔴' },
  };

  if (isLoading) {
    return (
      <div className={`w3ag-gas-estimator ${className}`} role="status" aria-busy="true">
        <p className="text-gray-500">Loading network fees...</p>
      </div>
    );
  }

  return (
    <div className={`w3ag-gas-estimator ${className}`}>
      {/* Live region for announcements */}
      <div
        role="status"
        aria-live="polite"
        aria-atomic="true"
        className="sr-only"
      >
        {announcement}
      </div>

      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-medium">Network Fee</h3>
        
        {/* Network status */}
        <div 
          className={`flex items-center gap-2 px-3 py-1 rounded-full text-sm ${congestionDisplay[congestionLevel].bg}`}
          role="status"
          aria-label={`Network status: ${congestionDisplay[congestionLevel].label}`}
        >
          <span aria-hidden="true">{congestionDisplay[congestionLevel].icon}</span>
          <span className={congestionDisplay[congestionLevel].color}>
            {congestionDisplay[congestionLevel].label}
          </span>
        </div>
      </div>

      {/* Current network */}
      <p className="text-sm text-gray-600 mb-4">
        Network: <strong>{getNetworkName(chainId)}</strong>
        {blockNumber && (
          <span className="ml-2 text-gray-400">
            Block #{blockNumber.toString()}
          </span>
        )}
      </p>

      {/* Speed tier selection */}
      <fieldset>
        <legend className="sr-only">Select transaction speed</legend>
        
        {/* Options table */}
        <div className="border rounded-lg overflow-hidden">
          {/* Header row */}
          <div className="grid grid-cols-4 gap-2 p-3 bg-gray-50 text-sm font-medium text-gray-700">
            <span>Speed</span>
            <span>Fee</span>
            <span>Time</span>
            <span className="sr-only">Select</span>
          </div>

          {/* Options */}
          {gasOptions.map((option) => (
            <label
              key={option.tier}
              className={`
                grid grid-cols-4 gap-2 p-3 cursor-pointer
                border-t transition-colors
                ${selectedTier === option.tier 
                  ? 'bg-blue-50' 
                  : 'hover:bg-gray-50'}
              `}
            >
              {/* Radio input */}
              <div className="flex items-center gap-2">
                <input
                  type="radio"
                  name="gasSpeed"
                  value={option.tier}
                  checked={selectedTier === option.tier}
                  onChange={() => handleTierSelect(option.tier)}
                  className="w-4 h-4 text-blue-600"
                  aria-describedby={`gas-${option.tier}-desc`}
                />
                <span className="font-medium">{option.label}</span>
                {option.tier === 'fast' && (
                  <span aria-hidden="true">⚡</span>
                )}
              </div>

              {/* Fee */}
              <div>
                <span className="font-medium">~${calculateUsdCost(option.gasPrice)}</span>
                <span className="sr-only">US dollars</span>
              </div>

              {/* Time */}
              <div className="text-gray-600">{option.timeEstimate}</div>

              {/* Recommendation badge */}
              <div>
                {option.tier === 'standard' && (
                  <span 
                    className="text-xs bg-green-100 text-green-700 px-2 py-0.5 rounded-full"
                    id={`gas-${option.tier}-desc`}
                  >
                    Recommended
                  </span>
                )}
              </div>
            </label>
          ))}

          {/* Custom option */}
          <label
            className={`
              grid grid-cols-4 gap-2 p-3 cursor-pointer
              border-t transition-colors
              ${selectedTier === 'custom' 
                ? 'bg-blue-50' 
                : 'hover:bg-gray-50'}
            `}
          >
            <div className="flex items-center gap-2">
              <input
                type="radio"
                name="gasSpeed"
                value="custom"
                checked={selectedTier === 'custom'}
                onChange={() => handleTierSelect('custom')}
                className="w-4 h-4 text-blue-600"
              />
              <span className="font-medium">Custom</span>
            </div>

            {selectedTier === 'custom' ? (
              <>
                <div className="col-span-2">
                  <label htmlFor="custom-gwei" className="sr-only">
                    Enter custom gas price in gwei
                  </label>
                  <div className="flex items-center gap-1">
                    <input
                      id="custom-gwei"
                      type="text"
                      inputMode="decimal"
                      value={customGwei}
                      onChange={(e) => handleCustomGasChange(e.target.value)}
                      placeholder="30"
                      className="w-20 px-2 py-1 border rounded text-sm
                                 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                    <span className="text-sm text-gray-600">gwei</span>
                    {customGwei && (
                      <span className="text-sm text-gray-600 ml-2">
                        ≈ ${calculateUsdCost(BigInt(parseFloat(customGwei || '0') * 1e9))}
                      </span>
                    )}
                  </div>
                </div>
                <div className="text-gray-600">Variable</div>
              </>
            ) : (
              <>
                <div className="text-gray-400">—</div>
                <div className="text-gray-400">Variable</div>
                <div></div>
              </>
            )}
          </label>
        </div>
      </fieldset>

      {/* Recommendation callout */}
      {selectedTier === 'standard' && (
        <div 
          className="mt-4 p-3 bg-green-50 border border-green-200 rounded-lg"
          role="note"
        >
          <div className="flex items-start gap-2">
            <span aria-hidden="true">💡</span>
            <div>
              <strong className="text-green-800">Recommended: Standard</strong>
              <p className="text-sm text-green-700 mt-1">
                Good balance of speed and cost. Your transaction should confirm within 30 seconds.
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Warning for slow tier */}
      {selectedTier === 'slow' && (
        <div 
          className="mt-4 p-3 bg-yellow-50 border border-yellow-200 rounded-lg"
          role="alert"
        >
          <div className="flex items-start gap-2">
            <span aria-hidden="true">⚠️</span>
            <div>
              <strong className="text-yellow-800">Slower confirmation</strong>
              <p className="text-sm text-yellow-700 mt-1">
                This may take several minutes. If the network gets busier, 
                your transaction could be delayed further or may fail.
              </p>
            </div>
          </div>
        </div>
      )}

      {/* High congestion warning */}
      {congestionLevel === 'high' && (
        <div 
          className="mt-4 p-3 bg-red-50 border border-red-200 rounded-lg"
          role="alert"
        >
          <div className="flex items-start gap-2">
            <span aria-hidden="true">🔴</span>
            <div>
              <strong className="text-red-800">Network is congested</strong>
              <p className="text-sm text-red-700 mt-1">
                Fees are higher than usual. Consider waiting for lower fees 
                or use Fast speed to ensure timely confirmation.
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Educational content */}
      {showEducation && (
        <details className="mt-4">
          <summary 
            className="cursor-pointer text-sm text-blue-600 hover:text-blue-800
                       focus:outline-none focus:ring-2 focus:ring-blue-500 rounded px-1"
          >
            ℹ️ What is a network fee?
          </summary>
          <div className="mt-2 p-3 bg-gray-50 rounded-lg text-sm text-gray-600">
            <p>
              Network fees (also called "gas") pay validators to process your transaction 
              on the blockchain. Fees vary based on network demand:
            </p>
            <ul className="mt-2 space-y-1 ml-4 list-disc">
              <li><strong>Higher fee</strong> = faster confirmation</li>
              <li><strong>Lower fee</strong> = slower, may fail if network gets busy</li>
              <li>Fees are paid in ETH, regardless of what token you're transacting</li>
            </ul>
          </div>
        </details>
      )}

      {/* Technical details */}
      <details className="mt-2">
        <summary 
          className="cursor-pointer text-sm text-gray-500 hover:text-gray-700
                     focus:outline-none focus:ring-2 focus:ring-blue-500 rounded px-1"
        >
          Technical details
        </summary>
        <div className="mt-2 p-3 bg-gray-50 rounded-lg text-xs font-mono space-y-1">
          <div>Gas Limit: {gasLimit.toString()} units</div>
          {baseGasPrice && (
            <div>Base Fee: {formatGwei(baseGasPrice)} gwei</div>
          )}
          {selectedOption && (
            <>
              <div>Max Fee: {formatGwei(selectedOption.gasPrice)} gwei</div>
              <div>Priority Fee: {formatGwei(selectedOption.maxPriorityFee)} gwei</div>
            </>
          )}
        </div>
      </details>
    </div>
  );
}
```

### Usage Example

```tsx
import { useState } from 'react';
import { parseEther } from 'viem';
import { GasEstimator } from './GasEstimator';

function TransactionForm() {
  const [gasPrice, setGasPrice] = useState<bigint>(BigInt(0));
  const [priorityFee, setPriorityFee] = useState<bigint>(BigInt(0));

  const handleGasSelect = (price: bigint, priority: bigint) => {
    setGasPrice(price);
    setPriorityFee(priority);
  };

  return (
    <div>
      {/* ... transaction form fields ... */}

      <GasEstimator
        gasLimit={BigInt(21000)} // Standard ETH transfer
        ethPrice={2300}
        onGasSelect={handleGasSelect}
        showEducation={true}
      />

      <button onClick={() => sendTransaction({ gasPrice, priorityFee })}>
        Send Transaction
      </button>
    </div>
  );
}
```

### Real-Time Gas Hook

```tsx
import { useGasPrice, useBlockNumber } from 'wagmi';
import { formatGwei } from 'viem';

export function useGasEstimates(chainId: number, gasLimit: bigint, ethPrice: number) {
  const { data: gasPrice, isLoading } = useGasPrice({ 
    chainId,
    query: {
      refetchInterval: 12000, // Refetch every block (~12s on mainnet)
    }
  });
  const { data: blockNumber } = useBlockNumber({ chainId, watch: true });

  const estimates = gasPrice ? {
    slow: {
      price: gasPrice * BigInt(90) / BigInt(100),
      usd: calculateUsd(gasPrice * BigInt(90) / BigInt(100), gasLimit, ethPrice),
      time: '~5 minutes',
    },
    standard: {
      price: gasPrice,
      usd: calculateUsd(gasPrice, gasLimit, ethPrice),
      time: '~30 seconds',
    },
    fast: {
      price: gasPrice * BigInt(120) / BigInt(100),
      usd: calculateUsd(gasPrice * BigInt(120) / BigInt(100), gasLimit, ethPrice),
      time: '~15 seconds',
    },
  } : null;

  return {
    estimates,
    isLoading,
    blockNumber,
    baseGwei: gasPrice ? formatGwei(gasPrice) : null,
  };
}

function calculateUsd(gasPrice: bigint, gasLimit: bigint, ethPrice: number): string {
  const costWei = gasPrice * gasLimit;
  const costEth = Number(costWei) / 1e18;
  return (costEth * ethPrice).toFixed(2);
}
```

---

## L2 Considerations

### Chain-Specific Adjustments

```tsx
const chainConfig: Record<number, ChainGasConfig> = {
  1: { // Ethereum
    blockTime: 12,
    showPriorityFee: true,
    showBaseFee: true,
    avgGasPrice: 30, // gwei baseline
  },
  10: { // Optimism
    blockTime: 2,
    showPriorityFee: false,
    showBaseFee: true,
    avgGasPrice: 0.001,
    l1DataFee: true, // Show L1 data posting fee
  },
  42161: { // Arbitrum
    blockTime: 0.25,
    showPriorityFee: false,
    showBaseFee: true,
    avgGasPrice: 0.1,
  },
  137: { // Polygon
    blockTime: 2,
    showPriorityFee: true,
    showBaseFee: true,
    avgGasPrice: 50,
  },
};
```

---

## Accessibility Checklist

### ARIA Requirements

| Attribute | Element | Purpose |
|-----------|---------|---------|
| `role="status"` | Congestion indicator | Network status |
| `aria-live="polite"` | Announcements | Gas price changes |
| `aria-describedby` | Radio inputs | Links to recommendation |
| `aria-busy` | Loading state | Indicates loading |
| `role="alert"` | Warning messages | Urgent conditions |
| `role="note"` | Recommendations | Supplementary info |

### Keyboard Navigation

| Key | Action |
|-----|--------|
| `Tab` | Move between options |
| `Arrow Up/Down` | Navigate radio options |
| `Space` | Select option |
| `Enter` | Expand/collapse details |

### Screen Reader Testing Script

```
1. Navigate to gas estimator
   Expected: "Network fee. Network status: [Low/Medium/High] congestion."

2. Navigate through options
   Expected: "Slow, approximately $1.20, 5 minutes, radio button, 1 of 4"
   Expected: "Standard, approximately $2.45, 30 seconds, Recommended, 
              radio button, 2 of 4, checked"

3. Select Fast option
   Expected: "Fast speed selected. Estimated fee $4.80, 
              approximately 15 seconds confirmation time."

4. When gas price changes significantly
   Expected: "Network fees have increased by 15%. 
              Standard fee is now approximately $2.82."
```

---

## Testing

### Unit Tests

```tsx
import { render, screen, fireEvent } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { GasEstimator } from './GasEstimator';

describe('GasEstimator', () => {
  const defaultProps = {
    gasLimit: BigInt(21000),
    ethPrice: 2300,
    onGasSelect: jest.fn(),
  };

  it('defaults to standard (recommended) option', () => {
    render(<GasEstimator {...defaultProps} />);
    
    expect(screen.getByLabelText(/standard/i)).toBeChecked();
    expect(screen.getByText(/recommended/i)).toBeInTheDocument();
  });

  it('displays USD estimates for all tiers', () => {
    render(<GasEstimator {...defaultProps} />);
    
    const fees = screen.getAllByText(/\$[\d.]+/);
    expect(fees.length).toBeGreaterThanOrEqual(3);
  });

  it('shows time estimates in human-readable format', () => {
    render(<GasEstimator {...defaultProps} />);
    
    expect(screen.getByText(/~30 seconds/)).toBeInTheDocument();
    expect(screen.getByText(/~15 seconds/)).toBeInTheDocument();
    expect(screen.getByText(/~5 minutes/)).toBeInTheDocument();
  });

  it('announces when selection changes', async () => {
    const user = userEvent.setup();
    render(<GasEstimator {...defaultProps} />);
    
    await user.click(screen.getByLabelText(/fast/i));
    
    const status = screen.getByRole('status');
    expect(status).toHaveTextContent(/fast speed selected/i);
  });

  it('shows warning for slow tier', async () => {
    const user = userEvent.setup();
    render(<GasEstimator {...defaultProps} />);
    
    await user.click(screen.getByLabelText(/slow/i));
    
    expect(screen.getByRole('alert')).toHaveTextContent(/slower confirmation/i);
  });

  it('allows custom gas price input', async () => {
    const user = userEvent.setup();
    render(<GasEstimator {...defaultProps} />);
    
    await user.click(screen.getByLabelText(/custom/i));
    await user.type(screen.getByLabelText(/enter custom gas price/i), '50');
    
    expect(defaultProps.onGasSelect).toHaveBeenCalled();
  });

  it('provides educational content', () => {
    render(<GasEstimator {...defaultProps} showEducation={true} />);
    
    expect(screen.getByText(/what is a network fee/i)).toBeInTheDocument();
  });
});
```

---

## Common Failures

### ❌ Failure 1: Gwei Only, No USD

```tsx
// BAD: Users don't understand gwei
<div>Gas: 30 gwei</div>

// "What does 30 gwei cost me in real money?"
```

### ❌ Failure 2: Color-Only Speed Tiers

```tsx
// BAD: Speed indicated only by color
<div className="text-green-500">Fast</div>
<div className="text-yellow-500">Standard</div>
<div className="text-red-500">Slow</div>

// Colorblind users can't distinguish tiers
```

### ❌ Failure 3: Silent Price Updates

```tsx
// BAD: No announcement when gas spikes
useEffect(() => {
  fetchGasPrice().then(setPrice);
}, [blockNumber]);

// Screen reader users don't know prices changed
```

### ❌ Failure 4: No Time Estimates

```tsx
// BAD: Only shows fee, not time
<option>$2.45</option>
<option>$4.80</option>

// User doesn't know the tradeoff
```

### ❌ Failure 5: Complex Technical Display

```tsx
// BAD: Too much jargon upfront
<div>
  Base Fee: 25.3 gwei
  Priority Fee: 1.5 gwei
  Max Fee: 30.2 gwei
  Gas Limit: 21000
</div>

// Overwhelms non-technical users
```

---

## Related Techniques

- [Transaction Signing](./transaction-signing.md)
- [Token Approval](./token-approval.md)
- [Network Switching](./network-switching.md)

## Related Guidelines

- [1.2 Transaction Clarity](../guidelines/perceivable/1.2-transaction-clarity.md)
- [2.3 Time-Sensitive Operations](../guidelines/operable/2.3-time-sensitive-operations.md)
- [3.1 Readable Transactions](../guidelines/understandable/3.1-readable-transactions.md)
