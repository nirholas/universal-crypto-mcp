'use client';

import { createContext, useContext, useState, useRef, useEffect, useId, useCallback } from 'react';
import { motion, AnimatePresence, Variants } from 'framer-motion';
import { cn } from '@/lib/utils';
import { X, AlertCircle, CheckCircle, Info, AlertTriangle } from 'lucide-react';

// ============================================================
// Types
// ============================================================

type AlertType = 'info' | 'success' | 'warning' | 'error';

interface Alert {
  id: string;
  type: AlertType;
  title?: string;
  message: string;
  duration?: number;
  closable?: boolean;
  action?: {
    label: string;
    onClick: () => void;
  };
}

// ============================================================
// Inline Alert
// ============================================================

interface InlineAlertProps {
  type?: AlertType;
  title?: string;
  message: string;
  closable?: boolean;
  onClose?: () => void;
  action?: {
    label: string;
    onClick: () => void;
  };
  className?: string;
}

export function InlineAlert({
  type = 'info',
  title,
  message,
  closable = false,
  onClose,
  action,
  className,
}: InlineAlertProps) {
  const [isVisible, setIsVisible] = useState(true);

  const configs = {
    info: {
      icon: Info,
      bg: 'bg-blue-500/10',
      border: 'border-blue-500/20',
      text: 'text-blue-400',
    },
    success: {
      icon: CheckCircle,
      bg: 'bg-green-500/10',
      border: 'border-green-500/20',
      text: 'text-green-400',
    },
    warning: {
      icon: AlertTriangle,
      bg: 'bg-yellow-500/10',
      border: 'border-yellow-500/20',
      text: 'text-yellow-400',
    },
    error: {
      icon: AlertCircle,
      bg: 'bg-red-500/10',
      border: 'border-red-500/20',
      text: 'text-red-400',
    },
  };

  const config = configs[type];
  const Icon = config.icon;

  const handleClose = () => {
    setIsVisible(false);
    onClose?.();
  };

  if (!isVisible) return null;

  return (
    <motion.div
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -10 }}
      className={cn(
        'flex items-start gap-3 p-4 rounded-xl border',
        config.bg,
        config.border,
        className
      )}
    >
      <Icon className={cn('w-5 h-5 flex-shrink-0 mt-0.5', config.text)} />
      <div className="flex-1 min-w-0">
        {title && (
          <h4 className={cn('font-semibold mb-1', config.text)}>{title}</h4>
        )}
        <p className="text-sm text-white/80">{message}</p>
        {action && (
          <button
            onClick={action.onClick}
            className={cn('mt-2 text-sm font-medium hover:underline', config.text)}
          >
            {action.label}
          </button>
        )}
      </div>
      {closable && (
        <button
          onClick={handleClose}
          className="p-1 hover:bg-white/10 rounded-lg transition-colors text-white/40 hover:text-white"
        >
          <X className="w-4 h-4" />
        </button>
      )}
    </motion.div>
  );
}

// ============================================================
// Banner Alert (full width)
// ============================================================

interface BannerAlertProps {
  type?: AlertType;
  message: string;
  action?: {
    label: string;
    onClick: () => void;
  };
  closable?: boolean;
  onClose?: () => void;
  className?: string;
}

export function BannerAlert({
  type = 'info',
  message,
  action,
  closable = true,
  onClose,
  className,
}: BannerAlertProps) {
  const [isVisible, setIsVisible] = useState(true);

  const configs = {
    info: 'bg-blue-500',
    success: 'bg-green-500',
    warning: 'bg-yellow-500 text-black',
    error: 'bg-red-500',
  };

  if (!isVisible) return null;

  return (
    <motion.div
      initial={{ height: 0, opacity: 0 }}
      animate={{ height: 'auto', opacity: 1 }}
      exit={{ height: 0, opacity: 0 }}
      className={cn(configs[type], className)}
    >
      <div className="container mx-auto px-4 py-3 flex items-center justify-center gap-4 text-sm">
        <p className="font-medium">{message}</p>
        {action && (
          <button
            onClick={action.onClick}
            className="px-3 py-1 bg-white/20 hover:bg-white/30 rounded-lg font-medium transition-colors"
          >
            {action.label}
          </button>
        )}
        {closable && (
          <button
            onClick={() => { setIsVisible(false); onClose?.(); }}
            className="absolute right-4 p-1 hover:bg-white/10 rounded-lg transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        )}
      </div>
    </motion.div>
  );
}

// ============================================================
// Alert Dialog / Confirmation Modal
// ============================================================

interface AlertDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  type?: AlertType;
  title: string;
  message: string;
  confirmLabel?: string;
  cancelLabel?: string;
  loading?: boolean;
}

export function AlertDialog({
  isOpen,
  onClose,
  onConfirm,
  type = 'warning',
  title,
  message,
  confirmLabel = 'Confirm',
  cancelLabel = 'Cancel',
  loading = false,
}: AlertDialogProps) {
  const configs = {
    info: { icon: Info, color: 'bg-blue-500', iconColor: 'text-blue-400' },
    success: { icon: CheckCircle, color: 'bg-green-500', iconColor: 'text-green-400' },
    warning: { icon: AlertTriangle, color: 'bg-yellow-500', iconColor: 'text-yellow-400' },
    error: { icon: AlertCircle, color: 'bg-red-500', iconColor: 'text-red-400' },
  };

  const config = configs[type];
  const Icon = config.icon;

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 bg-black/60 backdrop-blur-sm"
            onClick={onClose}
          />
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            className="relative w-full max-w-md p-6 bg-black/95 backdrop-blur-xl border border-white/10 rounded-2xl shadow-2xl"
          >
            <div className="flex items-start gap-4">
              <div className={cn('p-3 rounded-full', config.color + '/20')}>
                <Icon className={cn('w-6 h-6', config.iconColor)} />
              </div>
              <div className="flex-1">
                <h3 className="text-lg font-semibold text-white">{title}</h3>
                <p className="mt-2 text-sm text-white/70">{message}</p>
              </div>
            </div>

            <div className="mt-6 flex gap-3 justify-end">
              <button
                onClick={onClose}
                disabled={loading}
                className="px-4 py-2 text-sm font-medium text-white/70 hover:text-white hover:bg-white/5 rounded-lg transition-colors"
              >
                {cancelLabel}
              </button>
              <button
                onClick={onConfirm}
                disabled={loading}
                className={cn(
                  'px-4 py-2 text-sm font-medium text-white rounded-lg transition-colors',
                  config.color,
                  'hover:opacity-90 disabled:opacity-50'
                )}
              >
                {loading ? 'Loading...' : confirmLabel}
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}

// ============================================================
// Alert Stack Context (for stacked notifications)
// ============================================================

interface AlertStackContextValue {
  alerts: Alert[];
  showAlert: (alert: Omit<Alert, 'id'>) => void;
  dismissAlert: (id: string) => void;
}

const AlertStackContext = createContext<AlertStackContextValue | null>(null);

export function useAlertStack() {
  const ctx = useContext(AlertStackContext);
  if (!ctx) throw new Error('useAlertStack must be used within AlertStackProvider');
  return ctx;
}

export function AlertStackProvider({ children }: { children: React.ReactNode }) {
  const [alerts, setAlerts] = useState<Alert[]>([]);

  const showAlert = useCallback((alert: Omit<Alert, 'id'>) => {
    const id = Math.random().toString(36).slice(2);
    setAlerts(prev => [...prev, { ...alert, id }]);

    if (alert.duration !== 0) {
      setTimeout(() => {
        setAlerts(prev => prev.filter(a => a.id !== id));
      }, alert.duration || 5000);
    }
  }, []);

  const dismissAlert = useCallback((id: string) => {
    setAlerts(prev => prev.filter(a => a.id !== id));
  }, []);

  return (
    <AlertStackContext.Provider value={{ alerts, showAlert, dismissAlert }}>
      {children}
      <AlertStack alerts={alerts} onDismiss={dismissAlert} />
    </AlertStackContext.Provider>
  );
}

// ============================================================
// Alert Stack Component
// ============================================================

interface AlertStackProps {
  alerts: Alert[];
  onDismiss: (id: string) => void;
}

function AlertStack({ alerts, onDismiss }: AlertStackProps) {
  const configs = {
    info: { icon: Info, color: 'border-blue-500/50' },
    success: { icon: CheckCircle, color: 'border-green-500/50' },
    warning: { icon: AlertTriangle, color: 'border-yellow-500/50' },
    error: { icon: AlertCircle, color: 'border-red-500/50' },
  };

  return (
    <div className="fixed bottom-4 right-4 z-50 flex flex-col gap-2 max-w-sm">
      <AnimatePresence>
        {alerts.map(alert => {
          const config = configs[alert.type];
          const Icon = config.icon;

          return (
            <motion.div
              key={alert.id}
              initial={{ opacity: 0, x: 50, scale: 0.9 }}
              animate={{ opacity: 1, x: 0, scale: 1 }}
              exit={{ opacity: 0, x: 50, scale: 0.9 }}
              className={cn(
                'flex items-start gap-3 p-4 rounded-xl bg-black/95 backdrop-blur-xl border',
                config.color
              )}
            >
              <Icon className="w-5 h-5 text-white/70 flex-shrink-0 mt-0.5" />
              <div className="flex-1 min-w-0">
                {alert.title && (
                  <p className="font-semibold text-white">{alert.title}</p>
                )}
                <p className="text-sm text-white/70">{alert.message}</p>
                {alert.action && (
                  <button
                    onClick={alert.action.onClick}
                    className="mt-2 text-sm text-purple-400 hover:underline"
                  >
                    {alert.action.label}
                  </button>
                )}
              </div>
              {alert.closable !== false && (
                <button
                  onClick={() => onDismiss(alert.id)}
                  className="p-1 hover:bg-white/10 rounded-lg transition-colors text-white/40 hover:text-white"
                >
                  <X className="w-4 h-4" />
                </button>
              )}
            </motion.div>
          );
        })}
      </AnimatePresence>
    </div>
  );
}
