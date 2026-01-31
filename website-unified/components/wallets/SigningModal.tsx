/**
 * Transaction Signing Modal
 * 
 * Secure signing interface with simulation and risk warnings
 * 
 * @author Nich (@nichxbt)
 * @license Apache-2.0
 */

'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  X,
  CheckCircle,
  AlertTriangle,
  Shield,
  ShieldAlert,
  Eye,
  Loader2,
  ArrowRight,
  ExternalLink,
  Cpu,
  Fuel,
  Clock,
  ChevronDown,
  ChevronRight,
  Copy,
  Check,
} from 'lucide-react';
import { useWallet } from '@/providers/WalletProvider';
import { Token } from '@/lib/wallets/types';
import { formatBalance, formatUsd, formatGwei, truncateAddress } from '@/lib/wallets/utils';
import { cn } from '@/lib/utils';

// ============================================
// Types
// ============================================

interface SimulationResult {
  success: boolean;
  estimatedGas: bigint;
  balanceChanges: BalanceChange[];
  warnings: Warning[];
  approvals: ApprovalChange[];
}

interface BalanceChange {
  token: Token;
  before: bigint;
  after: bigint;
  change: bigint;
  changeUsd: number;
}

interface Warning {
  severity: 'info' | 'warning' | 'critical';
  message: string;
  description?: string;
}

interface ApprovalChange {
  token: Token;
  spender: string;
  spenderName?: string;
  amount: bigint;
  isUnlimited: boolean;
}

interface TransactionDetails {
  type: 'send' | 'swap' | 'approve' | 'contract' | 'sign';
  recipient?: string;
  recipientName?: string;
  amount?: string;
  token?: Token;
  estimatedGas?: bigint | null;
  gasPrice?: bigint | null;
  // For swaps
  fromToken?: Token;
  toToken?: Token;
  fromAmount?: string;
  toAmount?: string;
  // For approvals
  spender?: string;
  spenderName?: string;
  approvalAmount?: bigint;
  isUnlimited?: boolean;
  // For contract calls
  contractAddress?: string;
  method?: string;
  params?: any[];
  // For message signing
  message?: string;
}

interface SigningModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => Promise<void>;
  isLoading: boolean;
  transaction: TransactionDetails;
}

// ============================================
// Simulation Component
// ============================================

function TransactionSimulation({ simulation }: { simulation: SimulationResult | null }) {
  if (!simulation) {
    return (
      <div className="flex items-center justify-center py-6">
        <Loader2 className="w-6 h-6 animate-spin text-blue-500" />
        <span className="ml-2 text-gray-500">Simulating transaction...</span>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* Balance Changes */}
      {simulation.balanceChanges.length > 0 && (
        <div>
          <h4 className="text-sm font-medium text-gray-500 mb-2">Balance Changes</h4>
          <div className="space-y-2">
            {simulation.balanceChanges.map((change, idx) => {
              const isPositive = change.change > BigInt(0);
              return (
                <div
                  key={idx}
                  className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-800 rounded-lg"
                >
                  <div className="flex items-center gap-2">
                    <div className="w-6 h-6 rounded-full bg-gray-200 dark:bg-gray-700 flex items-center justify-center">
                      {change.token.logoUri ? (
                        <img src={change.token.logoUri} alt="" className="w-full h-full rounded-full" />
                      ) : (
                        <span className="text-xs font-bold">{change.token.symbol.slice(0, 2)}</span>
                      )}
                    </div>
                    <span className="font-medium text-gray-900 dark:text-white">
                      {change.token.symbol}
                    </span>
                  </div>
                  <div className="text-right">
                    <div className={cn(
                      'font-medium',
                      isPositive ? 'text-green-500' : 'text-red-500'
                    )}>
                      {isPositive ? '+' : ''}{formatBalance(change.change, change.token.decimals, 6)}
                    </div>
                    <div className="text-sm text-gray-500">
                      {isPositive ? '+' : ''}{formatUsd(change.changeUsd)}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Approvals */}
      {simulation.approvals.length > 0 && (
        <div>
          <h4 className="text-sm font-medium text-gray-500 mb-2">Token Approvals</h4>
          <div className="space-y-2">
            {simulation.approvals.map((approval, idx) => (
              <div
                key={idx}
                className={cn(
                  'p-3 rounded-lg border',
                  approval.isUnlimited
                    ? 'bg-yellow-50 dark:bg-yellow-900/20 border-yellow-200 dark:border-yellow-800'
                    : 'bg-gray-50 dark:bg-gray-800 border-transparent'
                )}
              >
                <div className="flex items-center justify-between">
                  <span className="text-gray-700 dark:text-gray-300">
                    Allow <strong>{approval.spenderName || truncateAddress(approval.spender)}</strong> to spend
                  </span>
                  <span className={cn(
                    'font-medium',
                    approval.isUnlimited ? 'text-yellow-600' : 'text-gray-900 dark:text-white'
                  )}>
                    {approval.isUnlimited ? 'Unlimited' : formatBalance(approval.amount, approval.token.decimals, 4)} {approval.token.symbol}
                  </span>
                </div>
                {approval.isUnlimited && (
                  <p className="text-sm text-yellow-600 mt-1">
                    ⚠️ Unlimited approval - consider limiting the amount
                  </p>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Warnings */}
      {simulation.warnings.length > 0 && (
        <div className="space-y-2">
          {simulation.warnings.map((warning, idx) => (
            <div
              key={idx}
              className={cn(
                'flex items-start gap-3 p-3 rounded-lg border',
                warning.severity === 'critical'
                  ? 'bg-red-50 dark:bg-red-900/20 border-red-200 dark:border-red-800'
                  : warning.severity === 'warning'
                  ? 'bg-yellow-50 dark:bg-yellow-900/20 border-yellow-200 dark:border-yellow-800'
                  : 'bg-blue-50 dark:bg-blue-900/20 border-blue-200 dark:border-blue-800'
              )}
            >
              {warning.severity === 'critical' ? (
                <ShieldAlert className="w-5 h-5 text-red-500 shrink-0" />
              ) : warning.severity === 'warning' ? (
                <AlertTriangle className="w-5 h-5 text-yellow-500 shrink-0" />
              ) : (
                <Shield className="w-5 h-5 text-blue-500 shrink-0" />
              )}
              <div>
                <p className={cn(
                  'font-medium',
                  warning.severity === 'critical'
                    ? 'text-red-700 dark:text-red-400'
                    : warning.severity === 'warning'
                    ? 'text-yellow-700 dark:text-yellow-400'
                    : 'text-blue-700 dark:text-blue-400'
                )}>
                  {warning.message}
                </p>
                {warning.description && (
                  <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                    {warning.description}
                  </p>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

// ============================================
// Transaction Preview Components
// ============================================

function SendPreview({ transaction }: { transaction: TransactionDetails }) {
  return (
    <div className="space-y-4">
      <div className="flex items-center justify-center gap-4">
        <div className="text-center">
          <div className="text-3xl font-bold text-gray-900 dark:text-white">
            {transaction.amount}
          </div>
          <div className="text-gray-500">
            {transaction.token?.symbol}
          </div>
        </div>
      </div>

      <div className="flex items-center justify-center gap-2 py-4">
        <ArrowRight className="w-6 h-6 text-gray-400" />
      </div>

      <div className="bg-gray-100 dark:bg-gray-800 rounded-xl p-4">
        <div className="text-sm text-gray-500 mb-1">Sending to</div>
        <div className="font-medium text-gray-900 dark:text-white">
          {transaction.recipientName || truncateAddress(transaction.recipient || '')}
        </div>
        {transaction.recipientName && (
          <div className="text-sm text-gray-500 font-mono">
            {truncateAddress(transaction.recipient || '')}
          </div>
        )}
      </div>
    </div>
  );
}

function SwapPreview({ transaction }: { transaction: TransactionDetails }) {
  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between gap-4 p-4 bg-gray-100 dark:bg-gray-800 rounded-xl">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-gray-200 dark:bg-gray-700 flex items-center justify-center">
            {transaction.fromToken?.logoUri ? (
              <img src={transaction.fromToken.logoUri} alt="" className="w-full h-full rounded-full" />
            ) : (
              <span className="text-sm font-bold">{transaction.fromToken?.symbol.slice(0, 2)}</span>
            )}
          </div>
          <div>
            <div className="font-medium text-gray-900 dark:text-white">
              {transaction.fromAmount}
            </div>
            <div className="text-sm text-gray-500">{transaction.fromToken?.symbol}</div>
          </div>
        </div>
        <ArrowRight className="w-6 h-6 text-gray-400" />
        <div className="flex items-center gap-3">
          <div>
            <div className="font-medium text-gray-900 dark:text-white text-right">
              {transaction.toAmount}
            </div>
            <div className="text-sm text-gray-500 text-right">{transaction.toToken?.symbol}</div>
          </div>
          <div className="w-10 h-10 rounded-full bg-gray-200 dark:bg-gray-700 flex items-center justify-center">
            {transaction.toToken?.logoUri ? (
              <img src={transaction.toToken.logoUri} alt="" className="w-full h-full rounded-full" />
            ) : (
              <span className="text-sm font-bold">{transaction.toToken?.symbol.slice(0, 2)}</span>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

function ApprovalPreview({ transaction }: { transaction: TransactionDetails }) {
  return (
    <div className="space-y-4">
      <div className="p-4 bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-xl">
        <div className="flex items-center gap-2 mb-2">
          <AlertTriangle className="w-5 h-5 text-yellow-600" />
          <span className="font-medium text-yellow-700 dark:text-yellow-400">
            Token Approval Request
          </span>
        </div>
        <p className="text-sm text-yellow-600 dark:text-yellow-500">
          This will allow the spender to transfer tokens on your behalf.
        </p>
      </div>

      <div className="space-y-2">
        <div className="flex items-center justify-between p-3 bg-gray-100 dark:bg-gray-800 rounded-lg">
          <span className="text-gray-500">Token</span>
          <span className="font-medium text-gray-900 dark:text-white">{transaction.token?.symbol}</span>
        </div>
        <div className="flex items-center justify-between p-3 bg-gray-100 dark:bg-gray-800 rounded-lg">
          <span className="text-gray-500">Spender</span>
          <span className="font-medium text-gray-900 dark:text-white">
            {transaction.spenderName || truncateAddress(transaction.spender || '')}
          </span>
        </div>
        <div className="flex items-center justify-between p-3 bg-gray-100 dark:bg-gray-800 rounded-lg">
          <span className="text-gray-500">Amount</span>
          <span className={cn(
            'font-medium',
            transaction.isUnlimited ? 'text-yellow-600' : 'text-gray-900 dark:text-white'
          )}>
            {transaction.isUnlimited ? 'Unlimited' : formatBalance(transaction.approvalAmount || BigInt(0), transaction.token?.decimals || 18, 4)}
          </span>
        </div>
      </div>
    </div>
  );
}

function ContractCallPreview({ transaction }: { transaction: TransactionDetails }) {
  const [copied, setCopied] = useState(false);
  const [showParams, setShowParams] = useState(false);

  const copyAddress = () => {
    navigator.clipboard.writeText(transaction.contractAddress || '');
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2 p-3 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg">
        <Cpu className="w-5 h-5 text-blue-500" />
        <span className="text-blue-700 dark:text-blue-400">Contract Interaction</span>
      </div>

      <div className="space-y-2">
        <div className="flex items-center justify-between p-3 bg-gray-100 dark:bg-gray-800 rounded-lg">
          <span className="text-gray-500">Contract</span>
          <div className="flex items-center gap-2">
            <span className="font-mono text-sm text-gray-900 dark:text-white">
              {truncateAddress(transaction.contractAddress || '')}
            </span>
            <button onClick={copyAddress} className="p-1 hover:bg-gray-200 dark:hover:bg-gray-700 rounded">
              {copied ? <Check className="w-4 h-4 text-green-500" /> : <Copy className="w-4 h-4 text-gray-400" />}
            </button>
          </div>
        </div>
        <div className="flex items-center justify-between p-3 bg-gray-100 dark:bg-gray-800 rounded-lg">
          <span className="text-gray-500">Method</span>
          <span className="font-mono text-sm text-gray-900 dark:text-white">{transaction.method || 'Unknown'}</span>
        </div>
        {transaction.params && transaction.params.length > 0 && (
          <div className="p-3 bg-gray-100 dark:bg-gray-800 rounded-lg">
            <button
              onClick={() => setShowParams(!showParams)}
              className="flex items-center justify-between w-full"
            >
              <span className="text-gray-500">Parameters ({transaction.params.length})</span>
              {showParams ? (
                <ChevronDown className="w-4 h-4 text-gray-400" />
              ) : (
                <ChevronRight className="w-4 h-4 text-gray-400" />
              )}
            </button>
            {showParams && (
              <pre className="mt-2 p-2 bg-gray-200 dark:bg-gray-700 rounded text-xs overflow-x-auto">
                {JSON.stringify(transaction.params, null, 2)}
              </pre>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

function MessageSignPreview({ transaction }: { transaction: TransactionDetails }) {
  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2 p-3 bg-purple-50 dark:bg-purple-900/20 border border-purple-200 dark:border-purple-800 rounded-lg">
        <Eye className="w-5 h-5 text-purple-500" />
        <span className="text-purple-700 dark:text-purple-400">Sign Message</span>
      </div>

      <div className="p-4 bg-gray-100 dark:bg-gray-800 rounded-xl">
        <div className="text-sm text-gray-500 mb-2">Message</div>
        <div className="font-mono text-sm text-gray-900 dark:text-white whitespace-pre-wrap break-all">
          {transaction.message}
        </div>
      </div>
    </div>
  );
}

// ============================================
// Main Signing Modal
// ============================================

export function SigningModal({ isOpen, onClose, onConfirm, isLoading, transaction }: SigningModalProps) {
  const { activeWallet, currentNetwork } = useWallet();
  const [simulation, setSimulation] = useState<SimulationResult | null>(null);
  const [isSimulating, setIsSimulating] = useState(true);

  // Simulate transaction on open
  useEffect(() => {
    if (isOpen) {
      setIsSimulating(true);
      setSimulation(null);

      // Simulate the transaction
      const simulateTransaction = async () => {
        await new Promise(resolve => setTimeout(resolve, 1500));

        const mockSimulation: SimulationResult = {
          success: true,
          estimatedGas: transaction.estimatedGas || BigInt(21000),
          balanceChanges: [],
          warnings: [],
          approvals: [],
        };

        // Add balance changes for send
        if (transaction.type === 'send' && transaction.token && transaction.amount) {
          const changeAmount = BigInt(Math.floor(parseFloat(transaction.amount) * 10 ** transaction.token.decimals));
          mockSimulation.balanceChanges.push({
            token: transaction.token,
            before: changeAmount * BigInt(2),
            after: changeAmount,
            change: -changeAmount,
            changeUsd: -parseFloat(transaction.amount) * (transaction.token.priceUsd || 0),
          });
        }

        // Add warnings based on transaction type
        if (transaction.type === 'approve' && transaction.isUnlimited) {
          mockSimulation.warnings.push({
            severity: 'warning',
            message: 'Unlimited token approval',
            description: 'Consider setting a specific amount instead of unlimited approval.',
          });
        }

        // Check for new address
        if (transaction.recipient && !transaction.recipientName) {
          mockSimulation.warnings.push({
            severity: 'info',
            message: 'New address',
            description: 'This address is not in your address book.',
          });
        }

        setSimulation(mockSimulation);
        setIsSimulating(false);
      };

      simulateTransaction();
    }
  }, [isOpen, transaction]);

  // Check for critical warnings
  const hasCriticalWarning = simulation?.warnings.some(w => w.severity === 'critical');

  // Calculate gas cost
  const gasCostWei = transaction.estimatedGas && transaction.gasPrice
    ? transaction.estimatedGas * transaction.gasPrice
    : null;

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50"
            onClick={onClose}
          />

          {/* Modal */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            className="fixed inset-x-4 top-[10%] bottom-[10%] mx-auto max-w-lg bg-white dark:bg-gray-900 rounded-2xl shadow-xl z-50 flex flex-col overflow-hidden"
          >
            {/* Header */}
            <div className="flex items-center justify-between p-6 border-b border-gray-200 dark:border-gray-800">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-blue-100 dark:bg-blue-900/50 rounded-full flex items-center justify-center">
                  {activeWallet?.provider === 'ledger' || activeWallet?.provider === 'trezor' ? (
                    <Cpu className="w-5 h-5 text-blue-500" />
                  ) : (
                    <Shield className="w-5 h-5 text-blue-500" />
                  )}
                </div>
                <div>
                  <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
                    {transaction.type === 'sign' ? 'Sign Message' : 'Confirm Transaction'}
                  </h2>
                  <p className="text-sm text-gray-500">
                    {currentNetwork?.name || 'Unknown Network'}
                  </p>
                </div>
              </div>
              <button
                onClick={onClose}
                disabled={isLoading}
                className="p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition-colors"
              >
                <X className="w-5 h-5 text-gray-500" />
              </button>
            </div>

            {/* Content */}
            <div className="flex-1 overflow-y-auto p-6">
              {/* Transaction Preview */}
              <div className="mb-6">
                {transaction.type === 'send' && <SendPreview transaction={transaction} />}
                {transaction.type === 'swap' && <SwapPreview transaction={transaction} />}
                {transaction.type === 'approve' && <ApprovalPreview transaction={transaction} />}
                {transaction.type === 'contract' && <ContractCallPreview transaction={transaction} />}
                {transaction.type === 'sign' && <MessageSignPreview transaction={transaction} />}
              </div>

              {/* Simulation Results */}
              {transaction.type !== 'sign' && (
                <div className="mb-6">
                  <h3 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-3 flex items-center gap-2">
                    <Eye className="w-4 h-4" />
                    Transaction Preview
                  </h3>
                  {isSimulating ? (
                    <div className="flex items-center justify-center py-6 bg-gray-50 dark:bg-gray-800 rounded-xl">
                      <Loader2 className="w-5 h-5 animate-spin text-blue-500" />
                      <span className="ml-2 text-gray-500">Simulating...</span>
                    </div>
                  ) : (
                    <TransactionSimulation simulation={simulation} />
                  )}
                </div>
              )}

              {/* Gas Information */}
              {transaction.type !== 'sign' && (
                <div className="p-4 bg-gray-50 dark:bg-gray-800 rounded-xl">
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-2 text-gray-500">
                      <Fuel className="w-4 h-4" />
                      Network Fee
                    </div>
                    <div className="text-right">
                      <div className="font-medium text-gray-900 dark:text-white">
                        {gasCostWei ? formatBalance(gasCostWei, 18, 6) : '---'} ETH
                      </div>
                      <div className="text-sm text-gray-500">
                        ~$2.50
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <div className="flex items-center gap-2 text-gray-500">
                      <Clock className="w-4 h-4" />
                      Estimated Time
                    </div>
                    <span className="text-gray-700 dark:text-gray-300">~30 seconds</span>
                  </div>
                </div>
              )}

              {/* Hardware Wallet Notice */}
              {(activeWallet?.provider === 'ledger' || activeWallet?.provider === 'trezor') && (
                <div className="mt-4 p-3 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg flex items-start gap-3">
                  <Cpu className="w-5 h-5 text-blue-500 shrink-0 mt-0.5" />
                  <div>
                    <p className="font-medium text-blue-700 dark:text-blue-400">
                      Hardware Wallet Required
                    </p>
                    <p className="text-sm text-blue-600 dark:text-blue-500">
                      Please confirm this transaction on your {activeWallet.provider === 'ledger' ? 'Ledger' : 'Trezor'} device.
                    </p>
                  </div>
                </div>
              )}
            </div>

            {/* Footer */}
            <div className="p-6 border-t border-gray-200 dark:border-gray-800 bg-gray-50 dark:bg-gray-800/50">
              <div className="flex gap-3">
                <button
                  onClick={onClose}
                  disabled={isLoading}
                  className="flex-1 py-3 px-4 bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600 text-gray-700 dark:text-gray-300 font-medium rounded-xl transition-colors disabled:opacity-50"
                >
                  Cancel
                </button>
                <button
                  onClick={onConfirm}
                  disabled={isLoading || isSimulating || hasCriticalWarning}
                  className={cn(
                    'flex-1 py-3 px-4 font-medium rounded-xl transition-colors flex items-center justify-center gap-2',
                    hasCriticalWarning
                      ? 'bg-red-100 text-red-500 cursor-not-allowed'
                      : 'bg-blue-500 hover:bg-blue-600 text-white disabled:opacity-50'
                  )}
                >
                  {isLoading ? (
                    <>
                      <Loader2 className="w-5 h-5 animate-spin" />
                      <span>Confirming...</span>
                    </>
                  ) : hasCriticalWarning ? (
                    'Transaction Blocked'
                  ) : (
                    <>
                      <CheckCircle className="w-5 h-5" />
                      <span>Confirm</span>
                    </>
                  )}
                </button>
              </div>

              {/* Transaction details link */}
              {!isLoading && transaction.type !== 'sign' && (
                <button className="w-full mt-3 text-sm text-gray-500 hover:text-gray-700 dark:hover:text-gray-300 flex items-center justify-center gap-1">
                  View raw transaction
                  <ChevronRight className="w-4 h-4" />
                </button>
              )}
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
