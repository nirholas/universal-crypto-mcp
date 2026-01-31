/**
 * Address Verifier Component
 * 
 * Input with ENS/SNS resolution and address validation
 * 
 * @author Nich (@nichxbt)
 * @license Apache-2.0
 */

'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  CheckCircle,
  AlertTriangle,
  Loader2,
  X,
  FileCode,
  ShieldAlert,
  User,
  Search,
  QrCode,
} from 'lucide-react';
import { cn } from '@/lib/utils';

// ============================================
// Types
// ============================================

interface AddressVerifierProps {
  value: string;
  onChange: (value: string) => void;
  resolvedName?: string | null;
  isValid?: boolean;
  isContract?: boolean;
  isKnownScam?: boolean;
  placeholder?: string;
  className?: string;
  disabled?: boolean;
}

// ============================================
// Main Component
// ============================================

export function AddressVerifier({
  value,
  onChange,
  resolvedName,
  isValid = true,
  isContract = false,
  isKnownScam = false,
  placeholder = 'Enter address or ENS name',
  className,
  disabled = false,
}: AddressVerifierProps) {
  const [isResolving, setIsResolving] = useState(false);
  const [isFocused, setIsFocused] = useState(false);
  const [showQrScanner, setShowQrScanner] = useState(false);

  // Check if input looks like an ENS or SNS name
  const isNameLookup = value.endsWith('.eth') || value.endsWith('.sol') || value.includes('.bnb');

  // Simulate resolution loading when typing ENS names
  useEffect(() => {
    if (isNameLookup && value.length > 4) {
      setIsResolving(true);
      const timer = setTimeout(() => {
        setIsResolving(false);
      }, 1000);
      return () => clearTimeout(timer);
    }
  }, [value, isNameLookup]);

  // Determine status
  const hasValue = value.length > 0;
  const showValidStatus = hasValue && isValid && !isResolving && !isKnownScam;
  const showInvalidStatus = hasValue && !isValid && !isResolving;
  const showScamWarning = hasValue && isKnownScam;

  return (
    <div className={cn('relative', className)}>
      {/* Input Container */}
      <div
        className={cn(
          'relative flex items-center rounded-xl border transition-all',
          'bg-white dark:bg-gray-900',
          isFocused
            ? 'border-blue-500 ring-2 ring-blue-500/20'
            : 'border-gray-200 dark:border-gray-700',
          isKnownScam && 'border-red-500 bg-red-50 dark:bg-red-900/20',
          showInvalidStatus && 'border-yellow-500',
          disabled && 'opacity-50 cursor-not-allowed'
        )}
      >
        {/* Icon */}
        <div className="pl-4 text-gray-400">
          {isResolving ? (
            <Loader2 className="w-5 h-5 animate-spin text-blue-500" />
          ) : showValidStatus ? (
            <CheckCircle className="w-5 h-5 text-green-500" />
          ) : showScamWarning ? (
            <ShieldAlert className="w-5 h-5 text-red-500" />
          ) : showInvalidStatus ? (
            <AlertTriangle className="w-5 h-5 text-yellow-500" />
          ) : (
            <Search className="w-5 h-5" />
          )}
        </div>

        {/* Input */}
        <input
          type="text"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
          placeholder={placeholder}
          disabled={disabled}
          className={cn(
            'flex-1 px-3 py-4 bg-transparent outline-none',
            'text-gray-900 dark:text-white placeholder-gray-400',
            'font-mono text-sm',
            isKnownScam && 'text-red-700 dark:text-red-400'
          )}
        />

        {/* Clear Button */}
        {hasValue && !disabled && (
          <button
            onClick={() => onChange('')}
            className="p-2 mr-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition-colors"
          >
            <X className="w-4 h-4 text-gray-400" />
          </button>
        )}

        {/* QR Scanner Button */}
        <button
          onClick={() => setShowQrScanner(true)}
          className="p-2 mr-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition-colors"
          title="Scan QR Code"
        >
          <QrCode className="w-5 h-5 text-gray-400" />
        </button>
      </div>

      {/* Resolution / Status Display */}
      <AnimatePresence>
        {hasValue && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="mt-2"
          >
            {/* Resolved Name Display */}
            {resolvedName && !isResolving && (
              <div className="flex items-center gap-2 p-3 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg">
                <User className="w-4 h-4 text-green-500" />
                <span className="text-sm text-green-700 dark:text-green-400">
                  Resolved to: <strong>{resolvedName}</strong>
                </span>
              </div>
            )}

            {/* Contract Address Warning */}
            {isContract && !isKnownScam && (
              <div className="flex items-center gap-2 p-3 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg">
                <FileCode className="w-4 h-4 text-blue-500" />
                <span className="text-sm text-blue-700 dark:text-blue-400">
                  This is a smart contract address
                </span>
              </div>
            )}

            {/* Known Scam Warning */}
            {isKnownScam && (
              <div className="p-3 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg">
                <div className="flex items-center gap-2 mb-1">
                  <ShieldAlert className="w-5 h-5 text-red-500" />
                  <span className="font-medium text-red-700 dark:text-red-400">
                    Warning: Known Scam Address
                  </span>
                </div>
                <p className="text-sm text-red-600 dark:text-red-500 ml-7">
                  This address has been flagged as malicious. Do not send funds to this address.
                </p>
              </div>
            )}

            {/* Invalid Address Format */}
            {showInvalidStatus && !isKnownScam && (
              <div className="flex items-center gap-2 p-3 bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-lg">
                <AlertTriangle className="w-4 h-4 text-yellow-500" />
                <span className="text-sm text-yellow-700 dark:text-yellow-400">
                  Invalid address format
                </span>
              </div>
            )}

            {/* Resolving Status */}
            {isResolving && (
              <div className="flex items-center gap-2 p-3 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg">
                <Loader2 className="w-4 h-4 animate-spin text-blue-500" />
                <span className="text-sm text-blue-700 dark:text-blue-400">
                  Resolving name...
                </span>
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>

      {/* QR Scanner Modal */}
      <AnimatePresence>
        {showQrScanner && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50"
              onClick={() => setShowQrScanner(false)}
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              className="fixed inset-x-4 top-1/4 mx-auto max-w-sm bg-white dark:bg-gray-900 rounded-2xl shadow-xl z-50 overflow-hidden"
            >
              <div className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                    Scan QR Code
                  </h3>
                  <button
                    onClick={() => setShowQrScanner(false)}
                    className="p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg"
                  >
                    <X className="w-5 h-5 text-gray-500" />
                  </button>
                </div>
                <div className="aspect-square bg-gray-100 dark:bg-gray-800 rounded-xl flex items-center justify-center">
                  <div className="text-center">
                    <QrCode className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                    <p className="text-sm text-gray-500">
                      Camera access required
                    </p>
                    <button className="mt-4 px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-lg text-sm transition-colors">
                      Enable Camera
                    </button>
                  </div>
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}
