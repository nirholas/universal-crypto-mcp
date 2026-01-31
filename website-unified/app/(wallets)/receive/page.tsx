/**
 * Receive Page
 * 
 * Display wallet address with QR code for receiving funds
 * 
 * @author Nich (@nichxbt)
 * @license Apache-2.0
 */

'use client';

import React, { useState, useMemo } from 'react';
import { motion } from 'framer-motion';
import {
  ArrowLeft,
  Copy,
  Check,
  Share2,
  QrCode,
  ChevronDown,
  ExternalLink,
  Wallet,
  AlertTriangle,
} from 'lucide-react';
import Link from 'next/link';
import { useWallet, WalletGuard } from '@/providers/WalletProvider';
import { useAddressName } from '@/lib/wallets/hooks';
import { truncateAddress, getExplorerUrl } from '@/lib/wallets/utils';
import { NetworkSwitcher } from '@/components/wallets/NetworkSwitcher';
import { WalletStatus } from '@/components/wallets/WalletStatus';
import { cn } from '@/lib/utils';

// ============================================
// QR Code Component (Simple SVG-based)
// ============================================

interface QRCodeProps {
  value: string;
  size?: number;
  bgColor?: string;
  fgColor?: string;
}

function QRCode({ value, size = 200, bgColor = '#ffffff', fgColor = '#000000' }: QRCodeProps) {
  // Simple QR code placeholder - in production use a library like 'qrcode'
  // This creates a decorative pattern that looks like a QR code
  const patternSize = 21; // Standard QR size
  const moduleSize = size / patternSize;
  
  // Generate a deterministic pattern based on the value
  const generatePattern = (val: string) => {
    const pattern: boolean[][] = [];
    const hash = val.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0);
    
    for (let y = 0; y < patternSize; y++) {
      pattern[y] = [];
      for (let x = 0; x < patternSize; x++) {
        // Position patterns (corners)
        const isPositionPattern = (
          (x < 7 && y < 7) || // Top-left
          (x >= patternSize - 7 && y < 7) || // Top-right
          (x < 7 && y >= patternSize - 7) // Bottom-left
        );
        
        // Timing pattern
        const isTimingPattern = (x === 6 || y === 6);
        
        // Data area - pseudo-random based on position and hash
        const isData = !isPositionPattern && !isTimingPattern && 
          ((x * y + hash) % 3 === 0 || (x + y + hash) % 5 === 0);
        
        pattern[y][x] = isPositionPattern || isTimingPattern || isData;
      }
    }
    
    // Draw position patterns properly
    const drawPositionPattern = (startX: number, startY: number) => {
      for (let y = 0; y < 7; y++) {
        for (let x = 0; x < 7; x++) {
          const isOuter = x === 0 || x === 6 || y === 0 || y === 6;
          const isInner = x >= 2 && x <= 4 && y >= 2 && y <= 4;
          pattern[startY + y][startX + x] = isOuter || isInner;
        }
      }
    };
    
    drawPositionPattern(0, 0);
    drawPositionPattern(patternSize - 7, 0);
    drawPositionPattern(0, patternSize - 7);
    
    return pattern;
  };
  
  const pattern = useMemo(() => generatePattern(value), [value]);
  
  return (
    <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`}>
      <rect width={size} height={size} fill={bgColor} />
      {pattern.map((row, y) =>
        row.map((cell, x) =>
          cell ? (
            <rect
              key={`${x}-${y}`}
              x={x * moduleSize}
              y={y * moduleSize}
              width={moduleSize}
              height={moduleSize}
              fill={fgColor}
            />
          ) : null
        )
      )}
    </svg>
  );
}

// ============================================
// Main Receive Page
// ============================================

export default function ReceivePage() {
  const { activeWallet, currentNetwork, openConnectModal } = useWallet();
  const { displayName } = useAddressName(activeWallet?.address);
  
  const [copied, setCopied] = useState(false);
  const [selectedToken, setSelectedToken] = useState<string | null>(null);

  const copyAddress = async () => {
    if (!activeWallet?.address) return;
    
    await navigator.clipboard.writeText(activeWallet.address);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const shareAddress = async () => {
    if (!activeWallet?.address) return;
    
    if (navigator.share) {
      try {
        await navigator.share({
          title: 'My Wallet Address',
          text: `Send ${currentNetwork?.nativeCurrency.symbol || 'tokens'} to this address:`,
          url: activeWallet.address,
        });
      } catch (err) {
        // User cancelled or share failed
        console.log('Share cancelled');
      }
    } else {
      // Fallback to copy
      copyAddress();
    }
  };

  return (
    <div className="container mx-auto px-4 py-8 max-w-2xl">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div className="flex items-center gap-4">
          <Link
            href="/wallets/dashboard"
            className="p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition-colors"
          >
            <ArrowLeft className="w-5 h-5 text-gray-500" />
          </Link>
          <div>
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
              Receive
            </h1>
            <p className="text-gray-500">Share your address to receive funds</p>
          </div>
        </div>
        <div className="flex items-center gap-4">
          <NetworkSwitcher compact />
          <WalletStatus />
        </div>
      </div>

      <WalletGuard
        fallback={
          <div className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-200 dark:border-gray-800 p-8 text-center">
            <Wallet className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
              Connect Wallet
            </h2>
            <p className="text-gray-500 mb-6">
              Connect your wallet to view your receive address
            </p>
            <button
              onClick={openConnectModal}
              className="px-6 py-3 bg-blue-500 hover:bg-blue-600 text-white font-medium rounded-xl transition-colors"
            >
              Connect Wallet
            </button>
          </div>
        }
      >
        <div className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-200 dark:border-gray-800 overflow-hidden">
          {/* Network Warning */}
          {currentNetwork?.testnet && (
            <div className="p-4 bg-yellow-50 dark:bg-yellow-900/20 border-b border-yellow-200 dark:border-yellow-800 flex items-center gap-3">
              <AlertTriangle className="w-5 h-5 text-yellow-500 shrink-0" />
              <div>
                <p className="font-medium text-yellow-700 dark:text-yellow-400">
                  Testnet Network
                </p>
                <p className="text-sm text-yellow-600 dark:text-yellow-500">
                  You're on {currentNetwork.name}. Only send testnet tokens to this address.
                </p>
              </div>
            </div>
          )}

          <div className="p-8">
            {/* Network Info */}
            <div className="text-center mb-6">
              <div className="inline-flex items-center gap-2 px-4 py-2 bg-gray-100 dark:bg-gray-800 rounded-full">
                <div className="w-5 h-5 rounded-full bg-gradient-to-br from-blue-500 to-purple-500" />
                <span className="font-medium text-gray-700 dark:text-gray-300">
                  {currentNetwork?.name || 'Unknown Network'}
                </span>
              </div>
            </div>

            {/* QR Code */}
            <div className="flex justify-center mb-6">
              <motion.div
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                className="p-4 bg-white rounded-2xl shadow-lg"
              >
                <QRCode
                  value={activeWallet?.address || ''}
                  size={220}
                  bgColor="#ffffff"
                  fgColor="#1f2937"
                />
              </motion.div>
            </div>

            {/* Address Display */}
            <div className="mb-6">
              {displayName !== truncateAddress(activeWallet?.address || '') && (
                <p className="text-center text-lg font-medium text-gray-900 dark:text-white mb-2">
                  {displayName}
                </p>
              )}
              
              <div className="bg-gray-100 dark:bg-gray-800 rounded-xl p-4">
                <p className="font-mono text-sm text-center text-gray-700 dark:text-gray-300 break-all">
                  {activeWallet?.address}
                </p>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex gap-3">
              <button
                onClick={copyAddress}
                className={cn(
                  'flex-1 flex items-center justify-center gap-2 py-3 rounded-xl font-medium transition-all',
                  copied
                    ? 'bg-green-500 text-white'
                    : 'bg-blue-500 hover:bg-blue-600 text-white'
                )}
              >
                {copied ? (
                  <>
                    <Check className="w-5 h-5" />
                    Copied!
                  </>
                ) : (
                  <>
                    <Copy className="w-5 h-5" />
                    Copy Address
                  </>
                )}
              </button>
              
              <button
                onClick={shareAddress}
                className="flex-1 flex items-center justify-center gap-2 py-3 bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600 text-gray-700 dark:text-gray-300 font-medium rounded-xl transition-colors"
              >
                <Share2 className="w-5 h-5" />
                Share
              </button>
            </div>

            {/* Explorer Link */}
            <a
              href={getExplorerUrl(currentNetwork?.chainId || 1, 'address', activeWallet?.address || '')}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-center gap-2 mt-4 text-blue-500 hover:text-blue-600 transition-colors"
            >
              View on Explorer
              <ExternalLink className="w-4 h-4" />
            </a>
          </div>

          {/* Tips Section */}
          <div className="p-6 bg-gray-50 dark:bg-gray-800/50 border-t border-gray-200 dark:border-gray-800">
            <h3 className="font-medium text-gray-900 dark:text-white mb-3">
              Tips for receiving
            </h3>
            <ul className="space-y-2 text-sm text-gray-600 dark:text-gray-400">
              <li className="flex items-start gap-2">
                <span className="text-blue-500">•</span>
                Only send <strong>{currentNetwork?.nativeCurrency.symbol || 'tokens'}</strong> and compatible tokens to this address
              </li>
              <li className="flex items-start gap-2">
                <span className="text-blue-500">•</span>
                Double-check the network before sending any funds
              </li>
              <li className="flex items-start gap-2">
                <span className="text-blue-500">•</span>
                Sending tokens on the wrong network may result in permanent loss
              </li>
            </ul>
          </div>
        </div>
      </WalletGuard>
    </div>
  );
}
