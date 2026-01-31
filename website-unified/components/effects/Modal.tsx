'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { cn } from '@/lib/utils';
import { X, AlertTriangle, Check, Info, HelpCircle } from 'lucide-react';
import { ReactNode, useState, createContext, useContext, useCallback } from 'react';

type ModalSize = 'sm' | 'md' | 'lg' | 'xl' | 'full';
type ModalVariant = 'default' | 'danger' | 'success' | 'info';

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  description?: string;
  children: ReactNode;
  size?: ModalSize;
  variant?: ModalVariant;
  showClose?: boolean;
  className?: string;
}

const sizeClasses: Record<ModalSize, string> = {
  sm: 'max-w-sm',
  md: 'max-w-md',
  lg: 'max-w-lg',
  xl: 'max-w-xl',
  full: 'max-w-4xl',
};

const variantIcons: Record<ModalVariant, ReactNode> = {
  default: null,
  danger: <AlertTriangle className="w-6 h-6 text-red-400" />,
  success: <Check className="w-6 h-6 text-green-400" />,
  info: <Info className="w-6 h-6 text-blue-400" />,
};

export function Modal({
  isOpen,
  onClose,
  title,
  description,
  children,
  size = 'md',
  variant = 'default',
  showClose = true,
  className,
}: ModalProps) {
  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
          />

          {/* Modal */}
          <div className="fixed inset-0 flex items-center justify-center z-50 p-4">
            <motion.div
              className={cn(
                'w-full bg-gradient-to-b from-gray-900 to-black border border-white/10 rounded-2xl overflow-hidden shadow-2xl',
                sizeClasses[size],
                className
              )}
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              onClick={(e) => e.stopPropagation()}
            >
              {/* Header */}
              {(title || showClose) && (
                <div className="flex items-start gap-4 p-6 border-b border-white/10">
                  {variantIcons[variant] && (
                    <div className={cn(
                      'p-2 rounded-xl',
                      variant === 'danger' && 'bg-red-500/10',
                      variant === 'success' && 'bg-green-500/10',
                      variant === 'info' && 'bg-blue-500/10'
                    )}>
                      {variantIcons[variant]}
                    </div>
                  )}
                  <div className="flex-1">
                    {title && <h2 className="text-xl font-semibold text-white">{title}</h2>}
                    {description && <p className="text-sm text-white/60 mt-1">{description}</p>}
                  </div>
                  {showClose && (
                    <button
                      onClick={onClose}
                      className="p-2 hover:bg-white/5 rounded-lg transition-colors"
                    >
                      <X className="w-5 h-5 text-white/60" />
                    </button>
                  )}
                </div>
              )}

              {/* Content */}
              <div className="p-6">{children}</div>
            </motion.div>
          </div>
        </>
      )}
    </AnimatePresence>
  );
}

// Confirm Modal helper
interface ConfirmModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title: string;
  description?: string;
  confirmText?: string;
  cancelText?: string;
  variant?: 'danger' | 'default';
  isLoading?: boolean;
}

export function ConfirmModal({
  isOpen,
  onClose,
  onConfirm,
  title,
  description,
  confirmText = 'Confirm',
  cancelText = 'Cancel',
  variant = 'default',
  isLoading = false,
}: ConfirmModalProps) {
  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={title}
      description={description}
      size="sm"
      variant={variant === 'danger' ? 'danger' : 'info'}
    >
      <div className="flex gap-3 mt-2">
        <button
          onClick={onClose}
          disabled={isLoading}
          className="flex-1 py-3 bg-white/5 hover:bg-white/10 border border-white/10 rounded-xl font-medium text-white transition-colors disabled:opacity-50"
        >
          {cancelText}
        </button>
        <motion.button
          onClick={onConfirm}
          disabled={isLoading}
          className={cn(
            'flex-1 py-3 rounded-xl font-medium text-white transition-colors disabled:opacity-50',
            variant === 'danger'
              ? 'bg-red-500 hover:bg-red-600'
              : 'bg-gradient-to-r from-purple-500 to-pink-500 hover:opacity-90'
          )}
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
        >
          {isLoading ? 'Processing...' : confirmText}
        </motion.button>
      </div>
    </Modal>
  );
}

// Modal context for programmatic modals
interface ModalContextType {
  confirm: (options: Omit<ConfirmModalProps, 'isOpen' | 'onClose'>) => Promise<boolean>;
  alert: (title: string, description?: string) => Promise<void>;
}

const ModalContext = createContext<ModalContextType | null>(null);

export function useModal() {
  const context = useContext(ModalContext);
  if (!context) {
    throw new Error('useModal must be used within a ModalProvider');
  }
  return context;
}

export function ModalProvider({ children }: { children: ReactNode }) {
  const [confirmState, setConfirmState] = useState<{
    isOpen: boolean;
    resolve?: (value: boolean) => void;
    options: Omit<ConfirmModalProps, 'isOpen' | 'onClose' | 'onConfirm'>;
  }>({
    isOpen: false,
    options: { title: '' },
  });

  const [alertState, setAlertState] = useState<{
    isOpen: boolean;
    resolve?: () => void;
    title: string;
    description?: string;
  }>({
    isOpen: false,
    title: '',
  });

  const confirm = useCallback(
    (options: Omit<ConfirmModalProps, 'isOpen' | 'onClose' | 'onConfirm'>) => {
      return new Promise<boolean>((resolve) => {
        setConfirmState({ isOpen: true, resolve, options });
      });
    },
    []
  );

  const alert = useCallback((title: string, description?: string) => {
    return new Promise<void>((resolve) => {
      setAlertState({ isOpen: true, resolve, title, description });
    });
  }, []);

  return (
    <ModalContext.Provider value={{ confirm, alert }}>
      {children}
      
      <ConfirmModal
        isOpen={confirmState.isOpen}
        onClose={() => {
          confirmState.resolve?.(false);
          setConfirmState({ isOpen: false, options: { title: '' } });
        }}
        onConfirm={() => {
          confirmState.resolve?.(true);
          setConfirmState({ isOpen: false, options: { title: '' } });
        }}
        {...confirmState.options}
      />
      
      <Modal
        isOpen={alertState.isOpen}
        onClose={() => {
          alertState.resolve?.();
          setAlertState({ isOpen: false, title: '' });
        }}
        title={alertState.title}
        description={alertState.description}
        size="sm"
      >
        <button
          onClick={() => {
            alertState.resolve?.();
            setAlertState({ isOpen: false, title: '' });
          }}
          className="w-full py-3 bg-gradient-to-r from-purple-500 to-pink-500 rounded-xl font-medium text-white"
        >
          OK
        </button>
      </Modal>
    </ModalContext.Provider>
  );
}
