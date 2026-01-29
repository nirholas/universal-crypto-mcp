import React from 'react';

/**
 * W3AG Compliant Risk Warning Component
 * 
 * Conformance: Level AA
 * 
 * Success Criteria Met:
 * - 1.2.5: Multi-modal risk communication
 * - 3.4.1: Clear risk flagging
 * - 3.4.2: Plain language explanations
 * - 4.1.2: Announced to screen readers
 */

type RiskLevel = 'info' | 'low' | 'medium' | 'high' | 'critical';

interface RiskWarningProps {
  level: RiskLevel;
  title: string;
  message: string;
  details?: string;
  learnMoreUrl?: string;
  onAcknowledge?: () => void;
  requireAcknowledge?: boolean;
}

const RISK_CONFIG: Record<RiskLevel, {
  icon: string;
  ariaLabel: string;
  className: string;
  liveRegion: 'polite' | 'assertive';
}> = {
  info: {
    icon: 'ℹ️',
    ariaLabel: 'Information',
    className: 'risk-info',
    liveRegion: 'polite',
  },
  low: {
    icon: '📝',
    ariaLabel: 'Low risk notice',
    className: 'risk-low',
    liveRegion: 'polite',
  },
  medium: {
    icon: '⚠️',
    ariaLabel: 'Medium risk warning',
    className: 'risk-medium',
    liveRegion: 'polite',
  },
  high: {
    icon: '🚨',
    ariaLabel: 'High risk warning',
    className: 'risk-high',
    liveRegion: 'assertive',
  },
  critical: {
    icon: '🛑',
    ariaLabel: 'Critical risk alert',
    className: 'risk-critical',
    liveRegion: 'assertive',
  },
};

export function RiskWarning({
  level,
  title,
  message,
  details,
  learnMoreUrl,
  onAcknowledge,
  requireAcknowledge = false,
}: RiskWarningProps) {
  const [acknowledged, setAcknowledged] = React.useState(false);
  const config = RISK_CONFIG[level];

  const handleAcknowledge = () => {
    setAcknowledged(true);
    onAcknowledge?.();
  };

  return (
    <div
      role={level === 'high' || level === 'critical' ? 'alert' : 'status'}
      aria-live={config.liveRegion}
      aria-atomic="true"
      className={`w3ag-risk-warning ${config.className}`}
    >
      {/* Icon with accessible label */}
      <span className="risk-icon" aria-label={config.ariaLabel}>
        {config.icon}
      </span>

      <div className="risk-content">
        {/* Title */}
        <h4 className="risk-title">{title}</h4>

        {/* Main message */}
        <p className="risk-message">{message}</p>

        {/* Expandable details */}
        {details && (
          <details className="risk-details">
            <summary>More information</summary>
            <p>{details}</p>
          </details>
        )}

        {/* Learn more link */}
        {learnMoreUrl && (
          <a 
            href={learnMoreUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="learn-more-link"
          >
            Learn more about this risk
            <span className="sr-only">(opens in new tab)</span>
          </a>
        )}

        {/* Acknowledgment checkbox */}
        {requireAcknowledge && (
          <label className="acknowledge-label">
            <input
              type="checkbox"
              checked={acknowledged}
              onChange={handleAcknowledge}
              required
            />
            <span>I understand this risk and want to proceed</span>
          </label>
        )}
      </div>
    </div>
  );
}

/**
 * Risk Meter Component - Visual + accessible risk indicator
 */
interface RiskMeterProps {
  score: number; // 0-100
  label?: string;
}

export function RiskMeter({ score, label = 'Risk level' }: RiskMeterProps) {
  const getRiskLabel = (score: number): string => {
    if (score < 20) return 'Very Low';
    if (score < 40) return 'Low';
    if (score < 60) return 'Medium';
    if (score < 80) return 'High';
    return 'Very High';
  };

  const riskLabel = getRiskLabel(score);

  return (
    <div className="w3ag-risk-meter">
      <div className="meter-label">
        <span>{label}</span>
        <span className="risk-score">
          {riskLabel} ({score}/100)
        </span>
      </div>

      <div
        role="meter"
        aria-valuenow={score}
        aria-valuemin={0}
        aria-valuemax={100}
        aria-label={`${label}: ${riskLabel}, ${score} out of 100`}
        className="meter-bar"
      >
        <div 
          className="meter-fill"
          style={{ width: `${score}%` }}
          aria-hidden="true"
        />
      </div>

      {/* Text fallback for screen readers */}
      <p className="sr-only">
        Risk score is {score} out of 100, which is considered {riskLabel} risk.
      </p>
    </div>
  );
}

/**
 * Contract Verification Badge
 */
interface VerificationBadgeProps {
  verified: boolean;
  contractAddress: string;
  explorerUrl?: string;
}

export function VerificationBadge({
  verified,
  contractAddress,
  explorerUrl,
}: VerificationBadgeProps) {
  return (
    <div 
      className={`w3ag-verification-badge ${verified ? 'verified' : 'unverified'}`}
      role={verified ? 'status' : 'alert'}
    >
      <span className="badge-icon" aria-hidden="true">
        {verified ? '✓' : '⚠️'}
      </span>

      <span className="badge-text">
        {verified ? 'Verified Contract' : 'Unverified Contract'}
      </span>

      {!verified && (
        <p className="unverified-warning">
          This contract's source code has not been verified. 
          Proceed with caution.
        </p>
      )}

      {explorerUrl && (
        <a 
          href={explorerUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="explorer-link"
        >
          View on explorer
          <span className="sr-only">(opens in new tab)</span>
        </a>
      )}
    </div>
  );
}

/**
 * CSS:
 * 
 * .w3ag-risk-warning {
 *   display: flex;
 *   gap: 0.75rem;
 *   padding: 1rem;
 *   border-radius: 8px;
 *   margin: 1rem 0;
 * }
 * 
 * .risk-info { background: var(--bg-info); border-left: 4px solid var(--color-info); }
 * .risk-low { background: var(--bg-success-light); border-left: 4px solid var(--color-success); }
 * .risk-medium { background: var(--bg-warning); border-left: 4px solid var(--color-warning); }
 * .risk-high { background: var(--bg-danger-light); border-left: 4px solid var(--color-danger); }
 * .risk-critical { background: var(--bg-danger); border-left: 4px solid var(--color-critical); }
 * 
 * .risk-icon {
 *   font-size: 1.5rem;
 *   flex-shrink: 0;
 * }
 * 
 * .risk-title {
 *   margin: 0 0 0.5rem 0;
 *   font-weight: 600;
 * }
 * 
 * .risk-message {
 *   margin: 0 0 0.5rem 0;
 * }
 * 
 * .risk-details summary {
 *   cursor: pointer;
 *   color: var(--color-link);
 * }
 * 
 * .acknowledge-label {
 *   display: flex;
 *   align-items: center;
 *   gap: 0.5rem;
 *   margin-top: 0.75rem;
 *   cursor: pointer;
 * }
 * 
 * .w3ag-risk-meter {
 *   margin: 1rem 0;
 * }
 * 
 * .meter-label {
 *   display: flex;
 *   justify-content: space-between;
 *   margin-bottom: 0.5rem;
 * }
 * 
 * .meter-bar {
 *   height: 8px;
 *   background: var(--bg-secondary);
 *   border-radius: 4px;
 *   overflow: hidden;
 * }
 * 
 * .meter-fill {
 *   height: 100%;
 *   background: linear-gradient(to right, var(--color-success), var(--color-warning), var(--color-danger));
 *   transition: width 0.3s ease;
 * }
 * 
 * .w3ag-verification-badge {
 *   display: inline-flex;
 *   flex-direction: column;
 *   gap: 0.25rem;
 *   padding: 0.5rem 0.75rem;
 *   border-radius: 6px;
 * }
 * 
 * .verified { background: var(--bg-success-light); }
 * .unverified { background: var(--bg-warning); }
 */

export default RiskWarning;
