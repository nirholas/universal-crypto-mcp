import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { formatUnits, formatEther, parseGwei } from 'viem';

/**
 * W3AG Compliant Gas Estimator
 * 
 * Conformance: Level AA
 * 
 * Success Criteria Met:
 * - 1.2.3: Gas costs displayed in both native currency and USD
 * - 1.2.5: Time estimates shown (e.g., "~30 seconds")
 * - 2.3.1: Real-time updates without causing distraction
 * - 3.1.1: Plain language explanations of gas concepts
 * - 4.1.2: Dynamic changes announced to assistive technology
 * - 1.4.1: Visual indicators with text alternatives
 */

// =============================================================================
// Types
// =============================================================================

export interface GasPrice {
  /** Price in wei */
  price: bigint;
  /** Suggested max priority fee (for EIP-1559) */
  maxPriorityFeePerGas?: bigint;
  /** Suggested max fee (for EIP-1559) */
  maxFeePerGas?: bigint;
}

export interface GasSpeed {
  id: 'slow' | 'standard' | 'fast' | 'instant';
  label: string;
  description: string;
  estimatedTime: string;
  gasPrice: GasPrice;
}

export interface GasEstimatorProps {
  /** Estimated gas units for the transaction */
  gasLimit: bigint;
  /** Available gas speed options */
  gasSpeeds: GasSpeed[];
  /** Currently selected speed ID */
  selectedSpeedId: GasSpeed['id'];
  /** Callback when speed selection changes */
  onSpeedChange: (speedId: GasSpeed['id']) => void;
  /** USD price of the native currency */
  nativeTokenPriceUsd: number;
  /** Native currency symbol (e.g., "ETH") */
  nativeCurrencySymbol: string;
  /** Native currency decimals (usually 18) */
  nativeCurrencyDecimals?: number;
  /** Current network congestion level */
  congestionLevel?: 'low' | 'normal' | 'high' | 'very-high';
  /** Whether gas prices are loading */
  isLoading?: boolean;
  /** Error message if gas estimation failed */
  error?: string | null;
  /** Whether to show detailed breakdown */
  showDetails?: boolean;
  /** Whether to allow custom gas price input */
  allowCustom?: boolean;
  /** Custom class name */
  className?: string;
}

export interface GasDisplayProps {
  /** Gas amount in wei */
  gasWei: bigint;
  /** USD price of native token */
  priceUsd: number;
  /** Currency symbol */
  symbol: string;
  /** Decimals for native token */
  decimals?: number;
  /** Size variant */
  size?: 'sm' | 'md' | 'lg';
}

export interface GasWarningProps {
  /** Type of warning */
  type: 'high-gas' | 'congestion' | 'spike' | 'custom';
  /** Warning message */
  message: string;
  /** Optional detailed explanation */
  explanation?: string;
  /** Severity level */
  severity?: 'info' | 'warning' | 'danger';
  /** Whether the warning can be dismissed */
  dismissible?: boolean;
  /** Callback when dismissed */
  onDismiss?: () => void;
}

// =============================================================================
// GasDisplay Component
// =============================================================================

export function GasDisplay({
  gasWei,
  priceUsd,
  symbol,
  decimals = 18,
  size = 'md',
}: GasDisplayProps) {
  const gasEther = formatUnits(gasWei, decimals);
  const gasNumber = parseFloat(gasEther);
  const gasUsd = gasNumber * priceUsd;

  // Format for display
  const formattedEther = gasNumber < 0.0001 
    ? '< 0.0001' 
    : gasNumber.toFixed(6).replace(/\.?0+$/, '');
  
  const formattedUsd = gasUsd < 0.01 
    ? '< $0.01' 
    : `$${gasUsd.toFixed(2)}`;

  const sizeClasses = {
    sm: 'w3ag-gas-display-sm',
    md: 'w3ag-gas-display-md',
    lg: 'w3ag-gas-display-lg',
  };

  return (
    <div 
      className={`w3ag-gas-display ${sizeClasses[size]}`}
      aria-label={`Gas cost: ${formattedEther} ${symbol}, approximately ${formattedUsd}`}
    >
      <span className="w3ag-gas-crypto">
        {formattedEther} {symbol}
      </span>
      <span className="w3ag-gas-fiat" aria-hidden="true">
        ≈ {formattedUsd}
      </span>
    </div>
  );
}

// =============================================================================
// GasWarning Component
// =============================================================================

export function GasWarning({
  type,
  message,
  explanation,
  severity = 'warning',
  dismissible = false,
  onDismiss,
}: GasWarningProps) {
  const [isDismissed, setIsDismissed] = useState(false);

  const handleDismiss = useCallback(() => {
    setIsDismissed(true);
    onDismiss?.();
  }, [onDismiss]);

  if (isDismissed) return null;

  const severityClasses = {
    info: 'w3ag-gas-warning-info',
    warning: 'w3ag-gas-warning-warning',
    danger: 'w3ag-gas-warning-danger',
  };

  const icons = {
    info: <InfoIcon className="w3ag-icon" />,
    warning: <WarningIcon className="w3ag-icon" />,
    danger: <DangerIcon className="w3ag-icon" />,
  };

  return (
    <div
      role="alert"
      className={`w3ag-gas-warning ${severityClasses[severity]}`}
    >
      <div className="w3ag-gas-warning-content">
        {icons[severity]}
        <div className="w3ag-gas-warning-text">
          <p className="w3ag-gas-warning-message">{message}</p>
          {explanation && (
            <p className="w3ag-gas-warning-explanation">{explanation}</p>
          )}
        </div>
      </div>
      {dismissible && (
        <button
          onClick={handleDismiss}
          className="w3ag-gas-warning-dismiss"
          aria-label="Dismiss warning"
        >
          <CloseIcon className="w3ag-icon-sm" />
        </button>
      )}
    </div>
  );
}

// =============================================================================
// GasEstimator Component
// =============================================================================

export function GasEstimator({
  gasLimit,
  gasSpeeds,
  selectedSpeedId,
  onSpeedChange,
  nativeTokenPriceUsd,
  nativeCurrencySymbol,
  nativeCurrencyDecimals = 18,
  congestionLevel = 'normal',
  isLoading = false,
  error = null,
  showDetails = true,
  allowCustom = false,
  className = '',
}: GasEstimatorProps) {
  const [announcement, setAnnouncement] = useState('');
  const [showCustomInput, setShowCustomInput] = useState(false);
  const [customGasPrice, setCustomGasPrice] = useState('');
  const [showHelp, setShowHelp] = useState(false);

  // Get selected speed info
  const selectedSpeed = useMemo(
    () => gasSpeeds.find((s) => s.id === selectedSpeedId),
    [gasSpeeds, selectedSpeedId]
  );

  // Calculate gas cost for selected speed
  const gasCost = useMemo(() => {
    if (!selectedSpeed) return BigInt(0);
    const gasPrice = selectedSpeed.gasPrice.maxFeePerGas ?? selectedSpeed.gasPrice.price;
    return gasLimit * gasPrice;
  }, [gasLimit, selectedSpeed]);

  // Calculate USD cost
  const gasCostUsd = useMemo(() => {
    const costEther = parseFloat(formatUnits(gasCost, nativeCurrencyDecimals));
    return costEther * nativeTokenPriceUsd;
  }, [gasCost, nativeCurrencyDecimals, nativeTokenPriceUsd]);

  // Announce gas price changes
  useEffect(() => {
    if (selectedSpeed && !isLoading) {
      const costFormatted = formatUnits(gasCost, nativeCurrencyDecimals);
      const usdFormatted = gasCostUsd.toFixed(2);
      setAnnouncement(
        `Gas speed changed to ${selectedSpeed.label}. ` +
        `Estimated cost: ${parseFloat(costFormatted).toFixed(6)} ${nativeCurrencySymbol}, ` +
        `approximately $${usdFormatted}. ` +
        `Estimated time: ${selectedSpeed.estimatedTime}.`
      );
    }
  }, [selectedSpeedId, selectedSpeed, gasCost, gasCostUsd, nativeCurrencySymbol, nativeCurrencyDecimals, isLoading]);

  // Get congestion info
  const congestionInfo = useMemo(() => {
    const levels = {
      low: {
        label: 'Low',
        description: 'Network is quiet. Good time to transact.',
        color: 'success',
      },
      normal: {
        label: 'Normal',
        description: 'Network has typical activity.',
        color: 'neutral',
      },
      high: {
        label: 'High',
        description: 'Network is busy. Consider waiting if not urgent.',
        color: 'warning',
      },
      'very-high': {
        label: 'Very High',
        description: 'Network is very congested. Expect delays or high fees.',
        color: 'danger',
      },
    };
    return levels[congestionLevel];
  }, [congestionLevel]);

  // Handle speed selection
  const handleSpeedSelect = useCallback((speedId: GasSpeed['id']) => {
    setShowCustomInput(false);
    onSpeedChange(speedId);
  }, [onSpeedChange]);

  if (error) {
    return (
      <div className={`w3ag-gas-estimator w3ag-gas-estimator-error ${className}`}>
        <GasWarning
          type="custom"
          message="Unable to estimate gas"
          explanation={error}
          severity="danger"
        />
      </div>
    );
  }

  return (
    <div className={`w3ag-gas-estimator ${className}`} aria-labelledby="gas-heading">
      {/* Live announcements */}
      <div
        role="status"
        aria-live="polite"
        aria-atomic="true"
        className="sr-only"
      >
        {announcement}
      </div>

      {/* Header */}
      <div className="w3ag-gas-header">
        <h3 id="gas-heading" className="w3ag-gas-title">
          <GasIcon className="w3ag-icon" />
          Network Fee (Gas)
        </h3>
        
        <button
          onClick={() => setShowHelp(!showHelp)}
          aria-expanded={showHelp}
          aria-controls="gas-help"
          className="w3ag-help-button"
        >
          <HelpIcon className="w3ag-icon-sm" />
          <span className="sr-only">
            {showHelp ? 'Hide gas fee explanation' : 'What are gas fees?'}
          </span>
        </button>
      </div>

      {/* Help text */}
      {showHelp && (
        <div id="gas-help" className="w3ag-gas-help">
          <p>
            <strong>Gas fees</strong> are payments made to network validators who 
            process your transaction. They are not charged by this application.
          </p>
          <ul>
            <li><strong>Slow:</strong> Cheaper but may take several minutes</li>
            <li><strong>Standard:</strong> Balanced price and speed</li>
            <li><strong>Fast:</strong> Higher priority, usually under 30 seconds</li>
            <li><strong>Instant:</strong> Highest priority for urgent transactions</li>
          </ul>
        </div>
      )}

      {/* Congestion indicator */}
      {showDetails && (
        <div 
          className={`w3ag-congestion-indicator w3ag-congestion-${congestionInfo.color}`}
          aria-label={`Network congestion: ${congestionInfo.label}. ${congestionInfo.description}`}
        >
          <span className="w3ag-congestion-label">Network:</span>
          <span className="w3ag-congestion-value">{congestionInfo.label}</span>
          <span className="w3ag-congestion-description">{congestionInfo.description}</span>
        </div>
      )}

      {/* High congestion warning */}
      {(congestionLevel === 'high' || congestionLevel === 'very-high') && (
        <GasWarning
          type="congestion"
          message={`Network congestion is ${congestionLevel === 'very-high' ? 'very high' : 'high'}`}
          explanation="Gas fees are elevated. Consider waiting for lower fees if your transaction is not time-sensitive."
          severity={congestionLevel === 'very-high' ? 'danger' : 'warning'}
          dismissible
        />
      )}

      {/* Loading state */}
      {isLoading ? (
        <div className="w3ag-gas-loading" aria-busy="true" aria-live="polite">
          <LoadingSpinner className="w3ag-icon" />
          <span>Estimating gas fees...</span>
        </div>
      ) : (
        <>
          {/* Speed selector */}
          <fieldset className="w3ag-gas-speeds" aria-labelledby="speed-legend">
            <legend id="speed-legend" className="sr-only">
              Select transaction speed
            </legend>
            
            <div className="w3ag-speed-options" role="radiogroup">
              {gasSpeeds.map((speed) => {
                const isSelected = speed.id === selectedSpeedId;
                const speedCost = gasLimit * (speed.gasPrice.maxFeePerGas ?? speed.gasPrice.price);
                const speedCostUsd = parseFloat(formatUnits(speedCost, nativeCurrencyDecimals)) * nativeTokenPriceUsd;
                
                return (
                  <label
                    key={speed.id}
                    className={`w3ag-speed-option ${isSelected ? 'w3ag-speed-option-selected' : ''}`}
                  >
                    <input
                      type="radio"
                      name="gasSpeed"
                      value={speed.id}
                      checked={isSelected}
                      onChange={() => handleSpeedSelect(speed.id)}
                      className="w3ag-speed-radio"
                    />
                    <div className="w3ag-speed-content">
                      <div className="w3ag-speed-header">
                        <span className="w3ag-speed-label">{speed.label}</span>
                        <span className="w3ag-speed-time">{speed.estimatedTime}</span>
                      </div>
                      <div className="w3ag-speed-cost">
                        <span className="w3ag-speed-crypto">
                          {parseFloat(formatUnits(speedCost, nativeCurrencyDecimals)).toFixed(6)} {nativeCurrencySymbol}
                        </span>
                        <span className="w3ag-speed-fiat">
                          ≈ ${speedCostUsd < 0.01 ? '< 0.01' : speedCostUsd.toFixed(2)}
                        </span>
                      </div>
                    </div>
                  </label>
                );
              })}
            </div>
          </fieldset>

          {/* Custom gas input */}
          {allowCustom && (
            <div className="w3ag-custom-gas">
              {!showCustomInput ? (
                <button
                  onClick={() => setShowCustomInput(true)}
                  className="w3ag-custom-gas-toggle"
                >
                  Set custom gas price
                </button>
              ) : (
                <div className="w3ag-custom-gas-input">
                  <label htmlFor="custom-gas-price" className="w3ag-custom-gas-label">
                    Custom gas price (Gwei)
                  </label>
                  <div className="w3ag-input-group">
                    <input
                      id="custom-gas-price"
                      type="text"
                      inputMode="decimal"
                      value={customGasPrice}
                      onChange={(e) => setCustomGasPrice(e.target.value)}
                      placeholder="e.g., 50"
                      className="w3ag-input"
                      aria-describedby="custom-gas-hint"
                    />
                    <span className="w3ag-input-suffix">Gwei</span>
                  </div>
                  <p id="custom-gas-hint" className="w3ag-hint">
                    Setting gas too low may cause your transaction to fail or get stuck.
                  </p>
                </div>
              )}
            </div>
          )}

          {/* Selected summary */}
          {showDetails && selectedSpeed && (
            <div className="w3ag-gas-summary" aria-live="polite">
              <div className="w3ag-gas-summary-row">
                <span className="w3ag-gas-summary-label">Estimated fee:</span>
                <GasDisplay
                  gasWei={gasCost}
                  priceUsd={nativeTokenPriceUsd}
                  symbol={nativeCurrencySymbol}
                  decimals={nativeCurrencyDecimals}
                  size="lg"
                />
              </div>
              <div className="w3ag-gas-summary-row">
                <span className="w3ag-gas-summary-label">Estimated time:</span>
                <span className="w3ag-gas-summary-value">{selectedSpeed.estimatedTime}</span>
              </div>
              <div className="w3ag-gas-summary-row">
                <span className="w3ag-gas-summary-label">Gas units:</span>
                <span className="w3ag-gas-summary-value">{gasLimit.toLocaleString()}</span>
              </div>
            </div>
          )}

          {/* High gas warning */}
          {gasCostUsd > 50 && (
            <GasWarning
              type="high-gas"
              message={`Gas fee is high: $${gasCostUsd.toFixed(2)}`}
              explanation="Consider whether this transaction is worth the cost, or wait for lower network fees."
              severity="warning"
              dismissible
            />
          )}
        </>
      )}
    </div>
  );
}

// =============================================================================
// Icon Components
// =============================================================================

function GasIcon({ className }: { className?: string }) {
  return (
    <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} 
        d="M17 10h1a2 2 0 011 3.732V17a2 2 0 01-2 2H7a2 2 0 01-2-2v-1a2 2 0 01-2-2v-2a2 2 0 012-2h1m10-4V5a2 2 0 00-2-2H9a2 2 0 00-2 2v2m10 0H7" />
    </svg>
  );
}

function HelpIcon({ className }: { className?: string }) {
  return (
    <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} 
        d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
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

function WarningIcon({ className }: { className?: string }) {
  return (
    <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} 
        d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
    </svg>
  );
}

function DangerIcon({ className }: { className?: string }) {
  return (
    <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} 
        d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
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

function LoadingSpinner({ className }: { className?: string }) {
  return (
    <svg className={`w3ag-spinner ${className || ''}`} fill="none" viewBox="0 0 24 24" aria-hidden="true">
      <circle className="w3ag-spinner-track" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
      <path className="w3ag-spinner-head" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
    </svg>
  );
}

export default GasEstimator;
