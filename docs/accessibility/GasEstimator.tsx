import React, { useState, useEffect, useCallback } from 'react';

/**
 * W3AG Compliant Gas Estimator Component
 * 
 * Conformance: Level AA
 * 
 * Success Criteria Met:
 * - 1.2.3: Gas estimates include text descriptions, not just visual indicators
 * - 3.1.1: Plain language descriptions of fees
 * - 4.1.2: Dynamic fee updates announced to screen readers
 * - 1.4.1: Speed indicators don't rely on color alone
 */

interface GasEstimate {
  gasLimit: bigint;
  maxFeePerGas: bigint;
  maxPriorityFeePerGas: bigint;
  estimatedCostWei: bigint;
  estimatedCostUsd: number;
  estimatedTime: number; // seconds
}

interface GasSpeed {
  id: 'slow' | 'standard' | 'fast' | 'instant';
  label: string;
  description: string;
  icon: string;
  estimate: GasEstimate;
}

interface GasEstimatorProps {
  speeds: GasSpeed[];
  selectedSpeed: GasSpeed['id'];
  onSpeedChange: (speed: GasSpeed['id']) => void;
  nativeSymbol: string;
  isLoading?: boolean;
  lastUpdated?: Date;
  onRefresh?: () => void;
  showAdvanced?: boolean;
}

// Format wei to readable amount
function formatGwei(wei: bigint): string {
  const gwei = Number(wei) / 1e9;
  return gwei.toFixed(2);
}

function formatEth(wei: bigint, symbol: string): string {
  const eth = Number(wei) / 1e18;
  if (eth < 0.0001) {
    return `< 0.0001 ${symbol}`;
  }
  return `${eth.toFixed(4)} ${symbol}`;
}

function formatUsd(amount: number): string {
  if (amount < 0.01) {
    return '< $0.01';
  }
  return `$${amount.toFixed(2)}`;
}

function formatTime(seconds: number): string {
  if (seconds < 60) {
    return `~${seconds} seconds`;
  }
  const minutes = Math.floor(seconds / 60);
  return `~${minutes} minute${minutes !== 1 ? 's' : ''}`;
}

function formatTimeForSR(seconds: number): string {
  if (seconds < 60) {
    return `approximately ${seconds} seconds`;
  }
  const minutes = Math.floor(seconds / 60);
  return `approximately ${minutes} minute${minutes !== 1 ? 's' : ''}`;
}

export function GasEstimator({
  speeds,
  selectedSpeed,
  onSpeedChange,
  nativeSymbol,
  isLoading = false,
  lastUpdated,
  onRefresh,
  showAdvanced = false,
}: GasEstimatorProps) {
  const [announcement, setAnnouncement] = useState('');
  const [showDetails, setShowDetails] = useState(false);

  const selectedEstimate = speeds.find(s => s.id === selectedSpeed);

  // Announce when estimates update
  useEffect(() => {
    if (selectedEstimate && !isLoading) {
      setAnnouncement(
        `Gas estimate updated. ${selectedEstimate.label} speed: ` +
        `${formatUsd(selectedEstimate.estimate.estimatedCostUsd)}, ` +
        `${formatTimeForSR(selectedEstimate.estimate.estimatedTime)}`
      );
    }
  }, [selectedEstimate, isLoading]);

  // Announce speed changes
  const handleSpeedChange = useCallback((speedId: GasSpeed['id']) => {
    const speed = speeds.find(s => s.id === speedId);
    if (speed) {
      setAnnouncement(
        `Selected ${speed.label} speed. ` +
        `Estimated cost: ${formatUsd(speed.estimate.estimatedCostUsd)}. ` +
        `Estimated time: ${formatTimeForSR(speed.estimate.estimatedTime)}.`
      );
    }
    onSpeedChange(speedId);
  }, [speeds, onSpeedChange]);

  return (
    <div className="w3ag-gas-estimator">
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
      <div className="gas-header">
        <h3 id="gas-heading">Network Fee</h3>
        
        {lastUpdated && (
          <span className="last-updated">
            Updated {formatTimeAgo(lastUpdated)}
          </span>
        )}
        
        {onRefresh && (
          <button
            onClick={onRefresh}
            disabled={isLoading}
            className="refresh-btn"
            aria-label="Refresh gas estimates"
          >
            {isLoading ? '⟳' : '↻'}
          </button>
        )}
      </div>

      {/* Speed selector */}
      <div 
        role="radiogroup" 
        aria-labelledby="gas-heading"
        className="speed-selector"
      >
        {speeds.map((speed) => (
          <SpeedOption
            key={speed.id}
            speed={speed}
            isSelected={selectedSpeed === speed.id}
            onSelect={() => handleSpeedChange(speed.id)}
            nativeSymbol={nativeSymbol}
            isLoading={isLoading}
          />
        ))}
      </div>

      {/* Selected estimate summary */}
      {selectedEstimate && (
        <div className="estimate-summary" aria-live="polite">
          <div className="summary-row">
            <span className="label">Estimated cost</span>
            <span className="value">
              <span className="cost-usd">
                {formatUsd(selectedEstimate.estimate.estimatedCostUsd)}
              </span>
              <span className="cost-native">
                ({formatEth(selectedEstimate.estimate.estimatedCostWei, nativeSymbol)})
              </span>
            </span>
          </div>
          
          <div className="summary-row">
            <span className="label">Estimated time</span>
            <span className="value">
              {formatTime(selectedEstimate.estimate.estimatedTime)}
            </span>
          </div>
        </div>
      )}

      {/* Advanced details */}
      {showAdvanced && (
        <details 
          className="advanced-details"
          open={showDetails}
          onToggle={(e) => setShowDetails((e.target as HTMLDetailsElement).open)}
        >
          <summary>
            Advanced gas settings
            <span className="sr-only">
              {showDetails ? '(expanded)' : '(collapsed)'}
            </span>
          </summary>
          
          {selectedEstimate && (
            <dl className="gas-details">
              <div className="detail-row">
                <dt>Gas limit</dt>
                <dd>{selectedEstimate.estimate.gasLimit.toLocaleString()}</dd>
              </div>
              
              <div className="detail-row">
                <dt>Max fee per gas</dt>
                <dd>{formatGwei(selectedEstimate.estimate.maxFeePerGas)} Gwei</dd>
              </div>
              
              <div className="detail-row">
                <dt>Priority fee</dt>
                <dd>{formatGwei(selectedEstimate.estimate.maxPriorityFeePerGas)} Gwei</dd>
              </div>
            </dl>
          )}
        </details>
      )}

      {/* Help text */}
      <p className="gas-help">
        Network fees go to validators who process your transaction. 
        Higher fees = faster confirmation.
      </p>
    </div>
  );
}

/**
 * Individual speed option component
 */
interface SpeedOptionProps {
  speed: GasSpeed;
  isSelected: boolean;
  onSelect: () => void;
  nativeSymbol: string;
  isLoading: boolean;
}

function SpeedOption({
  speed,
  isSelected,
  onSelect,
  nativeSymbol,
  isLoading,
}: SpeedOptionProps) {
  return (
    <label
      className={`speed-option ${isSelected ? 'selected' : ''}`}
      aria-disabled={isLoading}
    >
      <input
        type="radio"
        name="gas-speed"
        value={speed.id}
        checked={isSelected}
        onChange={onSelect}
        disabled={isLoading}
        className="sr-only"
      />
      
      <div className="speed-content">
        <div className="speed-header">
          <span className="speed-icon" aria-hidden="true">
            {speed.icon}
          </span>
          <span className="speed-label">{speed.label}</span>
        </div>
        
        <div className="speed-details">
          <span className="speed-cost">
            {formatUsd(speed.estimate.estimatedCostUsd)}
          </span>
          <span className="speed-time">
            {formatTime(speed.estimate.estimatedTime)}
          </span>
        </div>
      </div>
      
      {/* Selected indicator - not color only */}
      <span className="selected-indicator" aria-hidden="true">
        {isSelected ? '●' : '○'}
      </span>
      
      <span className="sr-only">
        {speed.description}. 
        Cost: {formatUsd(speed.estimate.estimatedCostUsd)}, 
        or {formatEth(speed.estimate.estimatedCostWei, nativeSymbol)}. 
        Time: {formatTimeForSR(speed.estimate.estimatedTime)}.
        {isSelected ? ' Currently selected.' : ''}
      </span>
    </label>
  );
}

/**
 * Compact gas display for transaction summaries
 */
interface GasDisplayProps {
  estimatedCostWei: bigint;
  estimatedCostUsd: number;
  estimatedTime: number;
  nativeSymbol: string;
  speed?: string;
}

export function GasDisplay({
  estimatedCostWei,
  estimatedCostUsd,
  estimatedTime,
  nativeSymbol,
  speed,
}: GasDisplayProps) {
  return (
    <div className="w3ag-gas-display">
      <dt>Network fee</dt>
      <dd>
        <span 
          className="cost"
          aria-label={`Approximately ${formatUsd(estimatedCostUsd)}, or ${formatEth(estimatedCostWei, nativeSymbol)}`}
        >
          ~{formatUsd(estimatedCostUsd)}
        </span>
        
        <details className="gas-breakdown">
          <summary>
            <span className="sr-only">Fee details</span>
            <span aria-hidden="true">ⓘ</span>
          </summary>
          
          <div className="breakdown-content">
            <p>
              <strong>Amount:</strong> {formatEth(estimatedCostWei, nativeSymbol)}
            </p>
            <p>
              <strong>Estimated time:</strong> {formatTime(estimatedTime)}
            </p>
            {speed && (
              <p>
                <strong>Speed:</strong> {speed}
              </p>
            )}
          </div>
        </details>
      </dd>
    </div>
  );
}

/**
 * Gas warning component for high fees
 */
interface GasWarningProps {
  estimatedCostUsd: number;
  thresholdUsd?: number;
  transactionValueUsd?: number;
}

export function GasWarning({
  estimatedCostUsd,
  thresholdUsd = 50,
  transactionValueUsd,
}: GasWarningProps) {
  const isHighFee = estimatedCostUsd > thresholdUsd;
  const feePercentage = transactionValueUsd 
    ? (estimatedCostUsd / transactionValueUsd) * 100 
    : null;
  const isHighPercentage = feePercentage && feePercentage > 10;

  if (!isHighFee && !isHighPercentage) {
    return null;
  }

  return (
    <div role="alert" className="w3ag-gas-warning">
      <span className="warning-icon" aria-hidden="true">⚠️</span>
      <div className="warning-content">
        {isHighFee && (
          <p>
            <strong>High network fee:</strong> This transaction will cost 
            approximately {formatUsd(estimatedCostUsd)} in fees.
          </p>
        )}
        {isHighPercentage && feePercentage && (
          <p>
            The network fee is <strong>{feePercentage.toFixed(1)}%</strong> of 
            your transaction value. Consider waiting for lower fees.
          </p>
        )}
      </div>
    </div>
  );
}

// Helper function
function formatTimeAgo(date: Date): string {
  const seconds = Math.floor((Date.now() - date.getTime()) / 1000);
  if (seconds < 10) return 'just now';
  if (seconds < 60) return `${seconds}s ago`;
  return `${Math.floor(seconds / 60)}m ago`;
}

/**
 * CSS (add to your stylesheet):
 *
 * .w3ag-gas-estimator {
 *   padding: 1rem;
 *   background: var(--bg-secondary);
 *   border-radius: 12px;
 * }
 *
 * .gas-header {
 *   display: flex;
 *   align-items: center;
 *   gap: 0.75rem;
 *   margin-bottom: 1rem;
 * }
 *
 * .gas-header h3 {
 *   margin: 0;
 *   font-size: 0.875rem;
 *   font-weight: 600;
 * }
 *
 * .last-updated {
 *   font-size: 0.75rem;
 *   color: var(--text-secondary);
 * }
 *
 * .refresh-btn {
 *   margin-left: auto;
 *   background: none;
 *   border: none;
 *   cursor: pointer;
 *   font-size: 1rem;
 *   padding: 0.25rem;
 *   border-radius: 4px;
 * }
 *
 * .refresh-btn:focus-visible {
 *   outline: 2px solid var(--color-focus);
 * }
 *
 * .speed-selector {
 *   display: flex;
 *   gap: 0.5rem;
 *   margin-bottom: 1rem;
 * }
 *
 * .speed-option {
 *   flex: 1;
 *   display: flex;
 *   flex-direction: column;
 *   align-items: center;
 *   padding: 0.75rem;
 *   border: 2px solid var(--border-color);
 *   border-radius: 8px;
 *   cursor: pointer;
 *   transition: border-color 0.15s;
 * }
 *
 * .speed-option:hover {
 *   border-color: var(--border-hover);
 * }
 *
 * .speed-option.selected {
 *   border-color: var(--color-primary);
 *   background: var(--bg-selected);
 * }
 *
 * .speed-option:focus-within {
 *   outline: 2px solid var(--color-focus);
 *   outline-offset: 2px;
 * }
 *
 * .speed-content {
 *   text-align: center;
 * }
 *
 * .speed-header {
 *   display: flex;
 *   align-items: center;
 *   justify-content: center;
 *   gap: 0.375rem;
 *   margin-bottom: 0.5rem;
 * }
 *
 * .speed-icon {
 *   font-size: 1rem;
 * }
 *
 * .speed-label {
 *   font-weight: 600;
 *   font-size: 0.875rem;
 * }
 *
 * .speed-details {
 *   display: flex;
 *   flex-direction: column;
 *   gap: 0.125rem;
 * }
 *
 * .speed-cost {
 *   font-size: 0.875rem;
 * }
 *
 * .speed-time {
 *   font-size: 0.75rem;
 *   color: var(--text-secondary);
 * }
 *
 * .selected-indicator {
 *   margin-top: 0.5rem;
 *   font-size: 0.625rem;
 *   color: var(--color-primary);
 * }
 *
 * .estimate-summary {
 *   padding: 0.75rem;
 *   background: var(--bg-surface);
 *   border-radius: 8px;
 *   margin-bottom: 1rem;
 * }
 *
 * .summary-row {
 *   display: flex;
 *   justify-content: space-between;
 *   padding: 0.25rem 0;
 * }
 *
 * .summary-row .label {
 *   color: var(--text-secondary);
 * }
 *
 * .cost-usd {
 *   font-weight: 600;
 * }
 *
 * .cost-native {
 *   color: var(--text-secondary);
 *   margin-left: 0.5rem;
 * }
 *
 * .advanced-details {
 *   margin-bottom: 1rem;
 * }
 *
 * .advanced-details summary {
 *   cursor: pointer;
 *   color: var(--color-link);
 *   font-size: 0.875rem;
 * }
 *
 * .gas-details {
 *   margin-top: 0.75rem;
 *   padding: 0.75rem;
 *   background: var(--bg-surface);
 *   border-radius: 6px;
 * }
 *
 * .detail-row {
 *   display: flex;
 *   justify-content: space-between;
 *   font-size: 0.875rem;
 *   padding: 0.25rem 0;
 * }
 *
 * .detail-row dt {
 *   color: var(--text-secondary);
 * }
 *
 * .gas-help {
 *   font-size: 0.75rem;
 *   color: var(--text-secondary);
 *   margin: 0;
 * }
 *
 * .w3ag-gas-display {
 *   display: flex;
 *   justify-content: space-between;
 * }
 *
 * .gas-breakdown {
 *   display: inline;
 *   margin-left: 0.5rem;
 * }
 *
 * .gas-breakdown summary {
 *   display: inline;
 *   cursor: pointer;
 *   color: var(--text-secondary);
 * }
 *
 * .breakdown-content {
 *   position: absolute;
 *   background: var(--bg-surface);
 *   border: 1px solid var(--border-color);
 *   border-radius: 8px;
 *   padding: 0.75rem;
 *   font-size: 0.875rem;
 *   box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
 *   z-index: 10;
 * }
 *
 * .w3ag-gas-warning {
 *   display: flex;
 *   gap: 0.75rem;
 *   padding: 0.75rem 1rem;
 *   background: var(--bg-warning);
 *   border-radius: 8px;
 *   margin-top: 0.75rem;
 * }
 *
 * .warning-icon {
 *   flex-shrink: 0;
 * }
 *
 * .warning-content p {
 *   margin: 0 0 0.5rem 0;
 * }
 *
 * .warning-content p:last-child {
 *   margin-bottom: 0;
 * }
 */

export default GasEstimator;
