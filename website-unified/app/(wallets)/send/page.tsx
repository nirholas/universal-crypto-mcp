/**
 * Send Transaction Page
 * 
 * Complete send flow with address input, token selection, and gas estimation
 * 
 * @author Nich (@nichxbt)
 * @license Apache-2.0
 */

'use client';

import React, { useState, useMemo, useCallback, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  ArrowLeft,
  ArrowDown,
  Wallet,
  ChevronDown,
  AlertTriangle,
  CheckCircle,
  Loader2,
  Fuel,
  Clock,
  User,
  BookOpen,
  QrCode,
  Sparkles,
} from 'lucide-react';
import Link from 'next/link';
import { useWallet, WalletGuard } from '@/providers/WalletProvider';
import { useTokenBalances, useAddressName, useGasEstimate, useAddressValidation, useRecentAddresses, useFavoriteContacts } from '@/lib/wallets/hooks';
import { useWalletStore } from '@/lib/wallets/store';
import { TokenBalance, TransactionRequest } from '@/lib/wallets/types';
import { formatBalance, formatUsd, formatGwei, parseTokenAmount, truncateAddress, isValidAddress } from '@/lib/wallets/utils';
import { NetworkSwitcher } from '@/components/wallets/NetworkSwitcher';
import { WalletStatus } from '@/components/wallets/WalletStatus';
import { SigningModal } from '@/components/wallets/SigningModal';
import { AddressVerifier } from '@/components/wallets/AddressVerifier';
import { cn } from '@/lib/utils';

// ============================================
// Token Selector Component
// ============================================

interface TokenSelectorProps {
  selectedToken: TokenBalance | null;
  tokens: TokenBalance[];
  onSelect: (token: TokenBalance) => void;
}

function TokenSelector({ selectedToken, tokens, onSelect }: TokenSelectorProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [search, setSearch] = useState('');

  const filteredTokens = useMemo(() => {
    if (!search) return tokens;
    const query = search.toLowerCase();
    return tokens.filter(
      t =>
        t.token.name.toLowerCase().includes(query) ||
        t.token.symbol.toLowerCase().includes(query)
    );
  }, [tokens, search]);

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={cn(
          'flex items-center gap-3 px-4 py-3 rounded-xl border transition-all w-full',
          'hover:bg-gray-50 dark:hover:bg-gray-800',
          'border-gray-200 dark:border-gray-700',
          isOpen && 'ring-2 ring-blue-500'
        )}
      >
        {selectedToken ? (
          <>
            <div className="w-8 h-8 rounded-full bg-gray-100 dark:bg-gray-700 flex items-center justify-center overflow-hidden">
              {selectedToken.token.logoUri ? (
                <img src={selectedToken.token.logoUri} alt={selectedToken.token.symbol} className="w-full h-full" />
              ) : (
                <span className="text-sm font-bold">{selectedToken.token.symbol.slice(0, 2)}</span>
              )}
            </div>
            <div className="flex-1 text-left">
              <div className="font-medium text-gray-900 dark:text-white">
                {selectedToken.token.symbol}
              </div>
              <div className="text-sm text-gray-500">
                Balance: {selectedToken.balanceFormatted}
              </div>
            </div>
          </>
        ) : (
          <div className="flex-1 text-left text-gray-500">
            Select token
          </div>
        )}
        <ChevronDown className={cn('w-5 h-5 text-gray-400 transition-transform', isOpen && 'rotate-180')} />
      </button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="absolute top-full mt-2 left-0 right-0 z-50 bg-white dark:bg-gray-900 rounded-xl shadow-xl border border-gray-200 dark:border-gray-700 max-h-80 overflow-hidden"
          >
            <div className="p-2 border-b border-gray-200 dark:border-gray-700">
              <input
                type="text"
                placeholder="Search tokens..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full px-3 py-2 rounded-lg bg-gray-100 dark:bg-gray-800 outline-none text-gray-900 dark:text-white"
              />
            </div>
            <div className="overflow-y-auto max-h-60">
              {filteredTokens.map((token) => (
                <button
                  key={`${token.token.address}-${token.chainId}`}
                  onClick={() => {
                    onSelect(token);
                    setIsOpen(false);
                  }}
                  className="flex items-center gap-3 w-full px-4 py-3 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
                >
                  <div className="w-8 h-8 rounded-full bg-gray-100 dark:bg-gray-700 flex items-center justify-center overflow-hidden">
                    {token.token.logoUri ? (
                      <img src={token.token.logoUri} alt={token.token.symbol} className="w-full h-full" />
                    ) : (
                      <span className="text-sm font-bold">{token.token.symbol.slice(0, 2)}</span>
                    )}
                  </div>
                  <div className="flex-1 text-left">
                    <div className="font-medium text-gray-900 dark:text-white">{token.token.symbol}</div>
                    <div className="text-sm text-gray-500">{token.token.name}</div>
                  </div>
                  <div className="text-right">
                    <div className="text-gray-900 dark:text-white">{token.balanceFormatted}</div>
                    <div className="text-sm text-gray-500">{formatUsd(token.valueUsd)}</div>
                  </div>
                </button>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

// ============================================
// Amount Input Component
// ============================================

interface AmountInputProps {
  value: string;
  onChange: (value: string) => void;
  token: TokenBalance | null;
  usdValue: number;
  onMax: () => void;
}

function AmountInput({ value, onChange, token, usdValue, onMax }: AmountInputProps) {
  return (
    <div className="bg-gray-100 dark:bg-gray-800 rounded-xl p-4">
      <div className="flex items-center justify-between mb-2">
        <span className="text-sm text-gray-500">Amount</span>
        {token && (
          <button
            onClick={onMax}
            className="text-sm text-blue-500 hover:text-blue-600 font-medium"
          >
            MAX
          </button>
        )}
      </div>
      <div className="flex items-center gap-4">
        <input
          type="text"
          placeholder="0.0"
          value={value}
          onChange={(e) => {
            const val = e.target.value;
            if (/^[0-9]*[.,]?[0-9]*$/.test(val)) {
              onChange(val.replace(',', '.'));
            }
          }}
          className="flex-1 text-3xl font-bold bg-transparent outline-none text-gray-900 dark:text-white placeholder-gray-400"
        />
        <div className="text-right">
          <div className="font-medium text-gray-900 dark:text-white">
            {token?.token.symbol || 'Token'}
          </div>
          <div className="text-sm text-gray-500">
            ≈ {formatUsd(usdValue)}
          </div>
        </div>
      </div>
    </div>
  );
}

// ============================================
// Gas Settings Component
// ============================================

interface GasSettingsProps {
  gasLimit: bigint | null;
  gasPrice: bigint | null;
  estimatedCost: bigint | null;
  isLoading: boolean;
}

function GasSettings({ gasLimit, gasPrice, estimatedCost, isLoading }: GasSettingsProps) {
  const [showAdvanced, setShowAdvanced] = useState(false);

  return (
    <div className="bg-gray-100 dark:bg-gray-800 rounded-xl p-4">
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <Fuel className="w-4 h-4 text-gray-500" />
          <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
            Network Fee
          </span>
        </div>
        <button
          onClick={() => setShowAdvanced(!showAdvanced)}
          className="text-sm text-blue-500 hover:text-blue-600"
        >
          {showAdvanced ? 'Simple' : 'Advanced'}
        </button>
      </div>

      {isLoading ? (
        <div className="flex items-center gap-2 text-gray-500">
          <Loader2 className="w-4 h-4 animate-spin" />
          Estimating...
        </div>
      ) : (
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-gray-500">Estimated Fee</span>
            <span className="font-medium text-gray-900 dark:text-white">
              {estimatedCost ? formatBalance(estimatedCost, 18, 6) : '---'} ETH
            </span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-gray-500">Gas Price</span>
            <span className="text-gray-700 dark:text-gray-300">
              {gasPrice ? formatGwei(gasPrice) : '---'}
            </span>
          </div>
          <div className="flex items-center justify-between text-sm">
            <span className="text-gray-500 flex items-center gap-1">
              <Clock className="w-3 h-3" />
              Estimated Time
            </span>
            <span className="text-gray-700 dark:text-gray-300">
              ~30 seconds
            </span>
          </div>
        </div>
      )}

      <AnimatePresence>
        {showAdvanced && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="mt-4 pt-4 border-t border-gray-200 dark:border-gray-700 space-y-3"
          >
            <div>
              <label className="text-sm text-gray-500 mb-1 block">Gas Limit</label>
              <input
                type="text"
                defaultValue={gasLimit?.toString() || '21000'}
                className="w-full px-3 py-2 rounded-lg bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 outline-none focus:border-blue-500"
              />
            </div>
            <div>
              <label className="text-sm text-gray-500 mb-1 block">Max Priority Fee (Gwei)</label>
              <input
                type="text"
                defaultValue="2"
                className="w-full px-3 py-2 rounded-lg bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 outline-none focus:border-blue-500"
              />
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

// ============================================
// Main Send Page
// ============================================

export default function SendPage() {
  const { activeWallet, currentNetwork, openConnectModal } = useWallet();
  const sendTransaction = useWalletStore(state => state.sendTransaction);

  const { balances, isLoading: isLoadingBalances } = useTokenBalances(
    activeWallet?.address,
    currentNetwork?.chainId
  );

  const recentAddresses = useRecentAddresses();
  const favoriteContacts = useFavoriteContacts();

  // Form state
  const [recipient, setRecipient] = useState('');
  const [selectedToken, setSelectedToken] = useState<TokenBalance | null>(null);
  const [amount, setAmount] = useState('');
  const [showSigningModal, setShowSigningModal] = useState(false);
  const [isSending, setIsSending] = useState(false);

  // Validation
  const { isValid: isValidRecipient, isContract, isKnownScam } = useAddressValidation(
    recipient,
    currentNetwork?.family || 'evm'
  );
  const { name: recipientName } = useAddressName(recipient);

  // Gas estimation
  const parsedAmount = selectedToken
    ? parseTokenAmount(amount || '0', selectedToken.token.decimals)
    : BigInt(0);
  const { gasLimit, gasPrice, estimatedCost, isLoading: isLoadingGas } = useGasEstimate(
    recipient,
    selectedToken?.token.isNative ? parsedAmount : undefined,
    undefined
  );

  // Calculate USD value
  const usdValue = useMemo(() => {
    if (!selectedToken || !amount) return 0;
    const numAmount = parseFloat(amount) || 0;
    return numAmount * (selectedToken.token.priceUsd || 0);
  }, [selectedToken, amount]);

  // Set max amount
  const handleMax = useCallback(() => {
    if (!selectedToken) return;
    
    let maxAmount = selectedToken.balance;
    
    // If native token, subtract gas
    if (selectedToken.token.isNative && estimatedCost) {
      maxAmount = maxAmount - estimatedCost;
      if (maxAmount < BigInt(0)) maxAmount = BigInt(0);
    }
    
    setAmount(formatBalance(maxAmount, selectedToken.token.decimals, selectedToken.token.decimals));
  }, [selectedToken, estimatedCost]);

  // Validation
  const canSend = useMemo(() => {
    if (!recipient || !isValidRecipient) return false;
    if (!selectedToken) return false;
    if (!amount || parseFloat(amount) <= 0) return false;
    if (parsedAmount > selectedToken.balance) return false;
    if (isKnownScam) return false;
    return true;
  }, [recipient, isValidRecipient, selectedToken, amount, parsedAmount, isKnownScam]);

  // Insufficient balance check
  const hasInsufficientBalance = selectedToken && parsedAmount > selectedToken.balance;

  // Handle send
  const handleSend = async () => {
    if (!canSend || !activeWallet || !selectedToken) return;
    
    setShowSigningModal(true);
  };

  // Confirm send
  const handleConfirmSend = async () => {
    if (!activeWallet || !selectedToken || !currentNetwork) return;
    
    setIsSending(true);
    
    try {
      const request: TransactionRequest = {
        to: recipient,
        from: activeWallet.address,
        value: selectedToken.token.isNative ? parsedAmount : BigInt(0),
        chainId: currentNetwork.chainId,
        gasLimit: gasLimit || undefined,
        gasPrice: gasPrice || undefined,
      };
      
      await sendTransaction(request);
      
      // Redirect to success or dashboard
      window.location.href = '/wallets/dashboard';
    } catch (error) {
      console.error('Transaction failed:', error);
    } finally {
      setIsSending(false);
      setShowSigningModal(false);
    }
  };

  // Auto-select first token with balance
  useEffect(() => {
    if (!selectedToken && balances.length > 0) {
      const nativeToken = balances.find(b => b.token.isNative);
      setSelectedToken(nativeToken || balances[0]);
    }
  }, [balances, selectedToken]);

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
              Send
            </h1>
            <p className="text-gray-500">Send tokens to any address</p>
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
              Connect your wallet to send tokens
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
          <div className="p-6 space-y-6">
            {/* Recipient Input */}
            <div>
              <div className="flex items-center justify-between mb-2">
                <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
                  Recipient
                </label>
                <div className="flex items-center gap-2">
                  <Link
                    href="/wallets/contacts"
                    className="flex items-center gap-1 text-sm text-blue-500 hover:text-blue-600"
                  >
                    <BookOpen className="w-4 h-4" />
                    Address Book
                  </Link>
                </div>
              </div>
              
              <AddressVerifier
                value={recipient}
                onChange={setRecipient}
                resolvedName={recipientName}
                isValid={isValidRecipient}
                isContract={isContract ?? undefined}
                isKnownScam={isKnownScam}
              />

              {/* Quick Select */}
              {(recentAddresses.length > 0 || favoriteContacts.length > 0) && !recipient && (
                <div className="mt-3">
                  {favoriteContacts.length > 0 && (
                    <div className="mb-2">
                      <p className="text-xs text-gray-500 mb-1">Favorites</p>
                      <div className="flex flex-wrap gap-2">
                        {favoriteContacts.slice(0, 3).map((contact) => (
                          <button
                            key={contact.id}
                            onClick={() => setRecipient(contact.addresses[0]?.address || '')}
                            className="flex items-center gap-2 px-3 py-1.5 bg-gray-100 dark:bg-gray-800 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
                          >
                            <User className="w-3 h-3 text-gray-500" />
                            <span className="text-sm text-gray-700 dark:text-gray-300">
                              {contact.name}
                            </span>
                          </button>
                        ))}
                      </div>
                    </div>
                  )}
                  {recentAddresses.length > 0 && (
                    <div>
                      <p className="text-xs text-gray-500 mb-1">Recent</p>
                      <div className="flex flex-wrap gap-2">
                        {recentAddresses.map((addr) => (
                          <button
                            key={addr}
                            onClick={() => setRecipient(addr)}
                            className="px-3 py-1.5 bg-gray-100 dark:bg-gray-800 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
                          >
                            <span className="text-sm font-mono text-gray-700 dark:text-gray-300">
                              {truncateAddress(addr)}
                            </span>
                          </button>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>

            {/* Arrow Divider */}
            <div className="flex justify-center">
              <div className="w-10 h-10 bg-gray-100 dark:bg-gray-800 rounded-full flex items-center justify-center">
                <ArrowDown className="w-5 h-5 text-gray-500" />
              </div>
            </div>

            {/* Token Selector */}
            <div>
              <label className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2 block">
                Token
              </label>
              <TokenSelector
                selectedToken={selectedToken}
                tokens={balances}
                onSelect={setSelectedToken}
              />
            </div>

            {/* Amount Input */}
            <AmountInput
              value={amount}
              onChange={setAmount}
              token={selectedToken}
              usdValue={usdValue}
              onMax={handleMax}
            />

            {/* Insufficient Balance Warning */}
            {hasInsufficientBalance && (
              <div className="flex items-center gap-2 p-3 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-xl text-red-700 dark:text-red-400">
                <AlertTriangle className="w-5 h-5" />
                <span>Insufficient balance</span>
              </div>
            )}

            {/* Gas Settings */}
            <GasSettings
              gasLimit={gasLimit}
              gasPrice={gasPrice}
              estimatedCost={estimatedCost}
              isLoading={isLoadingGas}
            />
          </div>

          {/* Send Button */}
          <div className="p-6 bg-gray-50 dark:bg-gray-800/50 border-t border-gray-200 dark:border-gray-800">
            <button
              onClick={handleSend}
              disabled={!canSend}
              className={cn(
                'w-full py-4 rounded-xl font-semibold text-lg transition-all',
                canSend
                  ? 'bg-blue-500 hover:bg-blue-600 text-white'
                  : 'bg-gray-200 dark:bg-gray-700 text-gray-500 cursor-not-allowed'
              )}
            >
              {isLoadingBalances ? (
                <span className="flex items-center justify-center gap-2">
                  <Loader2 className="w-5 h-5 animate-spin" />
                  Loading...
                </span>
              ) : !selectedToken ? (
                'Select Token'
              ) : !recipient ? (
                'Enter Recipient'
              ) : !isValidRecipient ? (
                'Invalid Address'
              ) : !amount || parseFloat(amount) <= 0 ? (
                'Enter Amount'
              ) : hasInsufficientBalance ? (
                'Insufficient Balance'
              ) : (
                `Send ${amount} ${selectedToken.token.symbol}`
              )}
            </button>
          </div>
        </div>
      </WalletGuard>

      {/* Signing Modal */}
      {showSigningModal && selectedToken && (
        <SigningModal
          isOpen={showSigningModal}
          onClose={() => setShowSigningModal(false)}
          onConfirm={handleConfirmSend}
          isLoading={isSending}
          transaction={{
            type: 'send',
            recipient,
            recipientName: recipientName ?? undefined,
            amount: amount,
            token: selectedToken.token,
            estimatedGas: estimatedCost,
            gasPrice: gasPrice,
          }}
        />
      )}
    </div>
  );
}
