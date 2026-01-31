/**
 * Wallet Settings Page
 * 
 * Comprehensive wallet settings and preferences
 * 
 * @author Nich (@nichxbt)
 * @license Apache-2.0
 */

'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  ArrowLeft,
  Shield,
  Eye,
  EyeOff,
  Bell,
  Wallet,
  Network,
  Fuel,
  Lock,
  Key,
  Smartphone,
  Globe,
  Moon,
  Sun,
  Monitor,
  RotateCw,
  Trash2,
  ExternalLink,
  ChevronRight,
  Check,
  AlertTriangle,
  Info,
  Download,
  Upload,
} from 'lucide-react';
import Link from 'next/link';
import { useWallet, WalletGuard } from '@/providers/WalletProvider';
import { useWalletStore, useWalletSettings } from '@/lib/wallets/store';
import { WalletStatus } from '@/components/wallets/WalletStatus';
import { cn } from '@/lib/utils';

// ============================================
// Setting Components
// ============================================

interface SettingRowProps {
  icon: React.ReactNode;
  title: string;
  description?: string;
  children?: React.ReactNode;
  onClick?: () => void;
  danger?: boolean;
}

function SettingRow({ icon, title, description, children, onClick, danger }: SettingRowProps) {
  const content = (
    <div className={cn(
      'flex items-center gap-4 p-4 rounded-xl transition-colors',
      onClick && 'hover:bg-gray-50 dark:hover:bg-gray-800 cursor-pointer',
      danger && onClick && 'hover:bg-red-50 dark:hover:bg-red-900/20'
    )}>
      <div className={cn(
        'w-10 h-10 rounded-full flex items-center justify-center shrink-0',
        danger ? 'bg-red-100 dark:bg-red-900/30' : 'bg-gray-100 dark:bg-gray-800'
      )}>
        {React.cloneElement(icon as React.ReactElement, {
          className: cn('w-5 h-5', danger ? 'text-red-500' : 'text-gray-600 dark:text-gray-400')
        })}
      </div>
      <div className="flex-1 min-w-0">
        <div className={cn(
          'font-medium',
          danger ? 'text-red-600 dark:text-red-400' : 'text-gray-900 dark:text-white'
        )}>
          {title}
        </div>
        {description && (
          <div className="text-sm text-gray-500 mt-0.5">{description}</div>
        )}
      </div>
      {children}
      {onClick && !children && (
        <ChevronRight className="w-5 h-5 text-gray-400" />
      )}
    </div>
  );

  if (onClick) {
    return <button onClick={onClick} className="w-full text-left">{content}</button>;
  }

  return content;
}

interface ToggleProps {
  enabled: boolean;
  onChange: (enabled: boolean) => void;
}

function Toggle({ enabled, onChange }: ToggleProps) {
  return (
    <button
      onClick={() => onChange(!enabled)}
      className={cn(
        'relative w-12 h-6 rounded-full transition-colors',
        enabled ? 'bg-blue-500' : 'bg-gray-200 dark:bg-gray-700'
      )}
    >
      <motion.div
        className="absolute top-1 left-1 w-4 h-4 bg-white rounded-full shadow"
        animate={{ x: enabled ? 24 : 0 }}
        transition={{ type: 'spring', stiffness: 500, damping: 30 }}
      />
    </button>
  );
}

// ============================================
// Settings Sections
// ============================================

function GeneralSettings() {
  const settings = useWalletSettings();
  const updateSettings = useWalletStore(state => state.updateSettings);
  const [theme, setTheme] = useState<'light' | 'dark' | 'system'>('system');

  const currencies = [
    { code: 'USD', symbol: '$', name: 'US Dollar' },
    { code: 'EUR', symbol: '€', name: 'Euro' },
    { code: 'GBP', symbol: '£', name: 'British Pound' },
    { code: 'JPY', symbol: '¥', name: 'Japanese Yen' },
    { code: 'CNY', symbol: '¥', name: 'Chinese Yuan' },
  ];

  const languages = [
    { code: 'en', name: 'English' },
    { code: 'es', name: 'Español' },
    { code: 'fr', name: 'Français' },
    { code: 'de', name: 'Deutsch' },
    { code: 'zh', name: '中文' },
    { code: 'ja', name: '日本語' },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
          General
        </h2>
        <div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-xl overflow-hidden divide-y divide-gray-100 dark:divide-gray-800">
          {/* Theme */}
          <div className="p-4">
            <div className="flex items-center gap-4 mb-3">
              <div className="w-10 h-10 rounded-full bg-gray-100 dark:bg-gray-800 flex items-center justify-center">
                {theme === 'dark' ? (
                  <Moon className="w-5 h-5 text-gray-600 dark:text-gray-400" />
                ) : theme === 'light' ? (
                  <Sun className="w-5 h-5 text-gray-600 dark:text-gray-400" />
                ) : (
                  <Monitor className="w-5 h-5 text-gray-600 dark:text-gray-400" />
                )}
              </div>
              <div className="flex-1">
                <div className="font-medium text-gray-900 dark:text-white">Theme</div>
                <div className="text-sm text-gray-500">Choose your preferred theme</div>
              </div>
            </div>
            <div className="flex gap-2 ml-14">
              {(['light', 'dark', 'system'] as const).map((t) => (
                <button
                  key={t}
                  onClick={() => setTheme(t)}
                  className={cn(
                    'px-4 py-2 rounded-lg font-medium capitalize transition-colors',
                    theme === t
                      ? 'bg-blue-500 text-white'
                      : 'bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700'
                  )}
                >
                  {t}
                </button>
              ))}
            </div>
          </div>

          {/* Currency */}
          <div className="p-4">
            <div className="flex items-center gap-4 mb-3">
              <div className="w-10 h-10 rounded-full bg-gray-100 dark:bg-gray-800 flex items-center justify-center">
                <Globe className="w-5 h-5 text-gray-600 dark:text-gray-400" />
              </div>
              <div className="flex-1">
                <div className="font-medium text-gray-900 dark:text-white">Currency</div>
                <div className="text-sm text-gray-500">Display values in your preferred currency</div>
              </div>
            </div>
            <div className="ml-14">
              <select
                value={settings.currency}
                onChange={(e) => updateSettings({ currency: e.target.value })}
                className="px-4 py-2 rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
              >
                {currencies.map((c) => (
                  <option key={c.code} value={c.code}>
                    {c.symbol} {c.code} - {c.name}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Hide Small Balances */}
          <SettingRow
            icon={<Eye />}
            title="Hide Small Balances"
            description="Hide tokens worth less than $1"
          >
            <Toggle
              enabled={settings.hideSmallBalances}
              onChange={(enabled) => updateSettings({ hideSmallBalances: enabled })}
            />
          </SettingRow>

          {/* Hide Zero Balances */}
          <SettingRow
            icon={<EyeOff />}
            title="Hide Zero Balances"
            description="Hide tokens with zero balance"
          >
            <Toggle
              enabled={settings.hideZeroBalances}
              onChange={(enabled) => updateSettings({ hideZeroBalances: enabled })}
            />
          </SettingRow>
        </div>
      </div>
    </div>
  );
}

function NetworkSettings() {
  const settings = useWalletSettings();
  const updateSettings = useWalletStore(state => state.updateSettings);

  const gasSpeeds = [
    { value: 'slow', label: 'Slow', description: '~5 mins' },
    { value: 'standard', label: 'Standard', description: '~1 min' },
    { value: 'fast', label: 'Fast', description: '~30 secs' },
    { value: 'instant', label: 'Instant', description: '~15 secs' },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
          Network & Gas
        </h2>
        <div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-xl overflow-hidden divide-y divide-gray-100 dark:divide-gray-800">
          {/* Default Gas Speed */}
          <div className="p-4">
            <div className="flex items-center gap-4 mb-3">
              <div className="w-10 h-10 rounded-full bg-gray-100 dark:bg-gray-800 flex items-center justify-center">
                <Fuel className="w-5 h-5 text-gray-600 dark:text-gray-400" />
              </div>
              <div className="flex-1">
                <div className="font-medium text-gray-900 dark:text-white">Default Gas Speed</div>
                <div className="text-sm text-gray-500">Set your preferred transaction speed</div>
              </div>
            </div>
            <div className="flex gap-2 ml-14">
              {gasSpeeds.map((speed) => (
                <button
                  key={speed.value}
                  onClick={() => updateSettings({ defaultGasSpeed: speed.value as any })}
                  className={cn(
                    'flex-1 px-3 py-2 rounded-lg text-center transition-colors',
                    settings.defaultGasSpeed === speed.value
                      ? 'bg-blue-500 text-white'
                      : 'bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700'
                  )}
                >
                  <div className="font-medium text-sm">{speed.label}</div>
                  <div className="text-xs opacity-75">{speed.description}</div>
                </button>
              ))}
            </div>
          </div>

          {/* Testnet Mode */}
          <SettingRow
            icon={<Network />}
            title="Show Testnets"
            description="Display testnet networks in the network switcher"
          >
            <Toggle
              enabled={settings.showTestnets}
              onChange={(enabled) => updateSettings({ showTestnets: enabled })}
            />
          </SettingRow>

          {/* Custom RPC */}
          <SettingRow
            icon={<Globe />}
            title="Custom RPC Endpoints"
            description="Configure custom RPC URLs for networks"
            onClick={() => {}}
          />

          {/* Auto Network Switch */}
          <SettingRow
            icon={<RotateCw />}
            title="Auto Network Switch"
            description="Automatically switch to the correct network for dApps"
          >
            <Toggle enabled={true} onChange={() => {}} />
          </SettingRow>
        </div>
      </div>
    </div>
  );
}

function NotificationSettings() {
  const settings = useWalletSettings();
  const updateSettings = useWalletStore(state => state.updateSettings);
  const [notifications, setNotifications] = useState({
    transactions: true,
    priceAlerts: true,
    security: true,
    marketing: false,
  });

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
          Notifications
        </h2>
        <div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-xl overflow-hidden divide-y divide-gray-100 dark:divide-gray-800">
          <SettingRow
            icon={<Bell />}
            title="Transaction Notifications"
            description="Get notified about transaction status"
          >
            <Toggle
              enabled={notifications.transactions}
              onChange={(enabled) => setNotifications({ ...notifications, transactions: enabled })}
            />
          </SettingRow>

          <SettingRow
            icon={<Bell />}
            title="Price Alerts"
            description="Get notified about significant price changes"
          >
            <Toggle
              enabled={notifications.priceAlerts}
              onChange={(enabled) => setNotifications({ ...notifications, priceAlerts: enabled })}
            />
          </SettingRow>

          <SettingRow
            icon={<Shield />}
            title="Security Alerts"
            description="Get notified about security-related events"
          >
            <Toggle
              enabled={notifications.security}
              onChange={(enabled) => setNotifications({ ...notifications, security: enabled })}
            />
          </SettingRow>

          <SettingRow
            icon={<Bell />}
            title="Marketing"
            description="Receive updates about new features"
          >
            <Toggle
              enabled={notifications.marketing}
              onChange={(enabled) => setNotifications({ ...notifications, marketing: enabled })}
            />
          </SettingRow>
        </div>
      </div>
    </div>
  );
}

function SecuritySettings() {
  const [showSeedPhrase, setShowSeedPhrase] = useState(false);
  const [autoLock, setAutoLock] = useState(5);

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
          Security
        </h2>
        <div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-xl overflow-hidden divide-y divide-gray-100 dark:divide-gray-800">
          <SettingRow
            icon={<Lock />}
            title="Change Password"
            description="Update your wallet password"
            onClick={() => {}}
          />

          <SettingRow
            icon={<Key />}
            title="Export Private Key"
            description="Export your wallet's private key"
            onClick={() => {}}
          />

          <SettingRow
            icon={<Key />}
            title="Show Recovery Phrase"
            description="View your 12/24 word recovery phrase"
            onClick={() => {}}
          />

          <SettingRow
            icon={<Smartphone />}
            title="Two-Factor Authentication"
            description="Add an extra layer of security"
            onClick={() => {}}
          />

          {/* Auto Lock */}
          <div className="p-4">
            <div className="flex items-center gap-4 mb-3">
              <div className="w-10 h-10 rounded-full bg-gray-100 dark:bg-gray-800 flex items-center justify-center">
                <Lock className="w-5 h-5 text-gray-600 dark:text-gray-400" />
              </div>
              <div className="flex-1">
                <div className="font-medium text-gray-900 dark:text-white">Auto-Lock Timer</div>
                <div className="text-sm text-gray-500">Lock wallet after inactivity</div>
              </div>
            </div>
            <div className="ml-14">
              <select
                value={autoLock}
                onChange={(e) => setAutoLock(parseInt(e.target.value))}
                className="px-4 py-2 rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
              >
                <option value="1">1 minute</option>
                <option value="5">5 minutes</option>
                <option value="15">15 minutes</option>
                <option value="30">30 minutes</option>
                <option value="60">1 hour</option>
                <option value="0">Never</option>
              </select>
            </div>
          </div>
        </div>
      </div>

      {/* Connected Sites */}
      <div>
        <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
          Connected Sites
        </h2>
        <div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-xl overflow-hidden">
          <SettingRow
            icon={<Globe />}
            title="Manage Connected Sites"
            description="View and revoke site connections"
            onClick={() => {}}
          />
        </div>
      </div>

      {/* Token Approvals */}
      <div>
        <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
          Token Approvals
        </h2>
        <div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-xl overflow-hidden">
          <Link href="/wallets/security">
            <SettingRow
              icon={<Shield />}
              title="Manage Approvals"
              description="Review and revoke token spending permissions"
            >
              <ChevronRight className="w-5 h-5 text-gray-400" />
            </SettingRow>
          </Link>
        </div>
      </div>
    </div>
  );
}

function DataSettings() {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
          Data & Privacy
        </h2>
        <div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-xl overflow-hidden divide-y divide-gray-100 dark:divide-gray-800">
          <SettingRow
            icon={<Download />}
            title="Export Data"
            description="Download your wallet data and history"
            onClick={() => {}}
          />

          <SettingRow
            icon={<Upload />}
            title="Import Data"
            description="Restore from a backup file"
            onClick={() => {}}
          />

          <SettingRow
            icon={<Trash2 />}
            title="Clear Transaction History"
            description="Remove local transaction cache"
            onClick={() => {}}
            danger
          />

          <SettingRow
            icon={<Trash2 />}
            title="Reset Wallet"
            description="Remove all wallet data from this device"
            onClick={() => {}}
            danger
          />
        </div>
      </div>
    </div>
  );
}

// ============================================
// Main Settings Page
// ============================================

type SettingsTab = 'general' | 'network' | 'notifications' | 'security' | 'data';

export default function SettingsPage() {
  const [activeTab, setActiveTab] = useState<SettingsTab>('general');

  const tabs: { id: SettingsTab; label: string; icon: React.ReactNode }[] = [
    { id: 'general', label: 'General', icon: <Wallet className="w-4 h-4" /> },
    { id: 'network', label: 'Network', icon: <Network className="w-4 h-4" /> },
    { id: 'notifications', label: 'Notifications', icon: <Bell className="w-4 h-4" /> },
    { id: 'security', label: 'Security', icon: <Shield className="w-4 h-4" /> },
    { id: 'data', label: 'Data', icon: <Download className="w-4 h-4" /> },
  ];

  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
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
              Settings
            </h1>
            <p className="text-gray-500">Customize your wallet experience</p>
          </div>
        </div>
        <WalletStatus />
      </div>

      <div className="flex flex-col md:flex-row gap-8">
        {/* Sidebar */}
        <div className="md:w-48 shrink-0">
          <nav className="flex md:flex-col gap-1 overflow-x-auto pb-2 md:pb-0">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={cn(
                  'flex items-center gap-2 px-4 py-2 rounded-lg font-medium whitespace-nowrap transition-colors',
                  activeTab === tab.id
                    ? 'bg-blue-500 text-white'
                    : 'text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800'
                )}
              >
                {tab.icon}
                {tab.label}
              </button>
            ))}
          </nav>
        </div>

        {/* Content */}
        <div className="flex-1 min-w-0">
          <AnimatePresence mode="wait">
            <motion.div
              key={activeTab}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.15 }}
            >
              {activeTab === 'general' && <GeneralSettings />}
              {activeTab === 'network' && <NetworkSettings />}
              {activeTab === 'notifications' && <NotificationSettings />}
              {activeTab === 'security' && <SecuritySettings />}
              {activeTab === 'data' && <DataSettings />}
            </motion.div>
          </AnimatePresence>
        </div>
      </div>

      {/* Version Info */}
      <div className="mt-12 text-center text-sm text-gray-500">
        <p>Universal Wallet v1.0.0</p>
        <p className="mt-1">
          <a href="#" className="text-blue-500 hover:text-blue-600">Privacy Policy</a>
          {' · '}
          <a href="#" className="text-blue-500 hover:text-blue-600">Terms of Service</a>
        </p>
      </div>
    </div>
  );
}
