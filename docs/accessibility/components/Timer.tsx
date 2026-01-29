import React, { useState, useEffect, useCallback } from 'react';

/**
 * W3AG Compliant Timer Component
 * 
 * Conformance: Level AA
 * 
 * Success Criteria Met:
 * - 2.3.1: Warns before time-sensitive actions
 * - 2.3.2: Supports deadline extensions
 * - 4.1.2: Announces time changes appropriately
 */

interface TimerProps {
  /** End time as Unix timestamp (ms) or Date */
  endTime: number | Date;
  /** Warning threshold in seconds */
  warningThreshold?: number;
  /** Called when timer reaches warning threshold */
  onWarning?: () => void;
  /** Called when timer expires */
  onExpire?: () => void;
  /** Called to request extension */
  onRequestExtension?: () => void;
  /** Whether extension is available */
  extensionAvailable?: boolean;
  /** Label for the timer */
  label?: string;
  /** Announcement frequency in seconds (0 = off) */
  announceEvery?: number;
}

export function Timer({
  endTime,
  warningThreshold = 30,
  onWarning,
  onExpire,
  onRequestExtension,
  extensionAvailable = false,
  label = 'Time remaining',
  announceEvery = 0,
}: TimerProps) {
  const [remaining, setRemaining] = useState(0);
  const [isWarning, setIsWarning] = useState(false);
  const [announcement, setAnnouncement] = useState('');
  const [hasExpired, setHasExpired] = useState(false);

  const endTimeMs = typeof endTime === 'number' ? endTime : endTime.getTime();

  // Format time for display
  const formatTime = (seconds: number): string => {
    if (seconds <= 0) return '0:00';
    
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    
    if (mins >= 60) {
      const hours = Math.floor(mins / 60);
      const remainingMins = mins % 60;
      return `${hours}:${remainingMins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
    }
    
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  // Format time for screen reader
  const formatTimeForSR = (seconds: number): string => {
    if (seconds <= 0) return 'expired';
    
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    
    const parts = [];
    if (mins > 0) parts.push(`${mins} minute${mins !== 1 ? 's' : ''}`);
    if (secs > 0 || mins === 0) parts.push(`${secs} second${secs !== 1 ? 's' : ''}`);
    
    return parts.join(' and ');
  };

  // Timer tick
  useEffect(() => {
    const tick = () => {
      const now = Date.now();
      const diff = Math.max(0, Math.floor((endTimeMs - now) / 1000));
      setRemaining(diff);

      // Check for warning threshold
      if (diff <= warningThreshold && diff > 0 && !isWarning) {
        setIsWarning(true);
        onWarning?.();
        setAnnouncement(`Warning: ${formatTimeForSR(diff)} remaining`);
      }

      // Check for expiration
      if (diff === 0 && !hasExpired) {
        setHasExpired(true);
        onExpire?.();
        setAnnouncement('Timer expired');
      }

      // Periodic announcements
      if (announceEvery > 0 && diff > 0 && diff % announceEvery === 0) {
        setAnnouncement(`${formatTimeForSR(diff)} remaining`);
      }
    };

    tick();
    const interval = setInterval(tick, 1000);
    return () => clearInterval(interval);
  }, [endTimeMs, warningThreshold, isWarning, hasExpired, onWarning, onExpire, announceEvery]);

  // Clear announcement after it's read
  useEffect(() => {
    if (announcement) {
      const timeout = setTimeout(() => setAnnouncement(''), 1000);
      return () => clearTimeout(timeout);
    }
  }, [announcement]);

  const handleRequestExtension = useCallback(() => {
    onRequestExtension?.();
    setAnnouncement('Extension requested');
  }, [onRequestExtension]);

  return (
    <div className={`w3ag-timer ${isWarning ? 'warning' : ''}`}>
      {/* Screen reader announcements */}
      <div 
        role="status" 
        aria-live={isWarning ? 'assertive' : 'polite'} 
        aria-atomic="true"
        className="sr-only"
      >
        {announcement}
      </div>

      {/* Timer display */}
      <div
        role="timer"
        aria-label={`${label}: ${formatTimeForSR(remaining)}`}
        className="timer-display"
      >
        <span className="timer-label">{label}:</span>
        <span className="timer-value" aria-hidden="true">
          {formatTime(remaining)}
        </span>
      </div>

      {/* Warning state */}
      {isWarning && !hasExpired && (
        <div className="timer-warning" role="alert">
          <span className="warning-icon" aria-hidden="true">⚠️</span>
          <span>Expiring soon!</span>
        </div>
      )}

      {/* Extension button */}
      {isWarning && extensionAvailable && !hasExpired && (
        <button
          onClick={handleRequestExtension}
          className="extension-button"
          aria-label="Request more time"
        >
          Need more time?
        </button>
      )}

      {/* Expired state */}
      {hasExpired && (
        <div className="timer-expired" role="alert">
          <span>Expired</span>
        </div>
      )}
    </div>
  );
}

/**
 * CSS:
 * 
 * .w3ag-timer {
 *   display: flex;
 *   flex-direction: column;
 *   align-items: center;
 *   gap: 0.5rem;
 * }
 * 
 * .timer-display {
 *   display: flex;
 *   align-items: center;
 *   gap: 0.5rem;
 * }
 * 
 * .timer-value {
 *   font-size: 1.25rem;
 *   font-weight: 600;
 *   font-variant-numeric: tabular-nums;
 * }
 * 
 * .w3ag-timer.warning .timer-value {
 *   color: var(--color-warning, #ca8a04);
 *   animation: pulse 1s ease-in-out infinite;
 * }
 * 
 * @keyframes pulse {
 *   0%, 100% { opacity: 1; }
 *   50% { opacity: 0.6; }
 * }
 * 
 * .timer-warning {
 *   display: flex;
 *   align-items: center;
 *   gap: 0.25rem;
 *   color: var(--color-warning);
 *   font-weight: 500;
 * }
 * 
 * .extension-button {
 *   padding: 0.5rem 1rem;
 *   background: var(--color-primary);
 *   color: white;
 *   border: none;
 *   border-radius: 8px;
 *   cursor: pointer;
 *   font-weight: 500;
 * }
 * 
 * .extension-button:focus-visible {
 *   outline: 2px solid var(--color-focus);
 *   outline-offset: 2px;
 * }
 * 
 * .timer-expired {
 *   color: var(--color-error);
 *   font-weight: 600;
 * }
 * 
 * @media (prefers-reduced-motion: reduce) {
 *   .w3ag-timer.warning .timer-value {
 *     animation: none;
 *   }
 * }
 */

export default Timer;
