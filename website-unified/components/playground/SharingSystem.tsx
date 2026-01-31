'use client';

import React, { useState, useCallback } from 'react';
import { cn } from '@/lib/utils/cn';
import { ExecutionResult, Workflow, ParameterPreset } from '@/lib/playground/types';
import {
  Share2,
  Link,
  Copy,
  Check,
  Lock,
  Globe,
  Users,
  Mail,
  Twitter,
  MessageSquare,
  QrCode,
  ExternalLink,
  Settings,
  Eye,
  EyeOff,
} from 'lucide-react';

type ShareableItem = ExecutionResult | Workflow | ParameterPreset;
type ShareVisibility = 'private' | 'unlisted' | 'public';

interface ShareSettings {
  visibility: ShareVisibility;
  allowCopy: boolean;
  allowFork: boolean;
  expiresIn?: '1h' | '24h' | '7d' | '30d' | 'never';
  password?: string;
}

interface SharingSystemProps {
  item: ShareableItem;
  itemType: 'execution' | 'workflow' | 'preset';
  onShare?: (shareUrl: string, settings: ShareSettings) => void;
  className?: string;
}

export function SharingSystem({
  item,
  itemType,
  onShare,
  className,
}: SharingSystemProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [settings, setSettings] = useState<ShareSettings>({
    visibility: 'unlisted',
    allowCopy: true,
    allowFork: true,
    expiresIn: '7d',
  });
  const [shareUrl, setShareUrl] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);

  // Generate share URL (mock)
  const generateShareUrl = async () => {
    setIsGenerating(true);
    
    // Simulate API call
    await new Promise(r => setTimeout(r, 500));
    
    const id = (item as any).id || Date.now().toString();
    const url = `https://mcp.tools/share/${itemType}/${id}?v=${settings.visibility}`;
    setShareUrl(url);
    setIsGenerating(false);
    onShare?.(url, settings);
  };

  // Copy URL to clipboard
  const copyUrl = async () => {
    if (!shareUrl) return;
    await navigator.clipboard.writeText(shareUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  // Share to social platforms
  const shareToTwitter = () => {
    const text = `Check out this ${itemType} on MCP Tools!`;
    const url = `https://twitter.com/intent/tweet?text=${encodeURIComponent(text)}&url=${encodeURIComponent(shareUrl || '')}`;
    window.open(url, '_blank');
  };

  const shareViaEmail = () => {
    const subject = `Shared ${itemType} from MCP Tools`;
    const body = `I wanted to share this ${itemType} with you:\n\n${shareUrl}`;
    window.location.href = `mailto:?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
  };

  const getVisibilityIcon = (visibility: ShareVisibility) => {
    switch (visibility) {
      case 'private':
        return <Lock className="w-4 h-4" />;
      case 'unlisted':
        return <Link className="w-4 h-4" />;
      case 'public':
        return <Globe className="w-4 h-4" />;
    }
  };

  const getVisibilityDescription = (visibility: ShareVisibility) => {
    switch (visibility) {
      case 'private':
        return 'Only you can access this';
      case 'unlisted':
        return 'Anyone with the link can access';
      case 'public':
        return 'Listed publicly and searchable';
    }
  };

  return (
    <div className={cn('relative', className)}>
      {/* Trigger Button */}
      <button
        onClick={() => setIsOpen(true)}
        className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 transition-colors"
      >
        <Share2 className="w-4 h-4" />
        Share
      </button>

      {/* Modal */}
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-md mx-4 overflow-hidden">
            {/* Header */}
            <div className="flex items-center justify-between px-6 py-4 border-b border-gray-200">
              <h3 className="text-lg font-semibold text-gray-900">
                Share {itemType.charAt(0).toUpperCase() + itemType.slice(1)}
              </h3>
              <button
                onClick={() => setIsOpen(false)}
                className="text-gray-400 hover:text-gray-600"
              >
                <span className="sr-only">Close</span>
                ×
              </button>
            </div>

            {/* Content */}
            <div className="p-6 space-y-6">
              {/* Visibility Options */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-3">
                  Who can access?
                </label>
                <div className="space-y-2">
                  {(['private', 'unlisted', 'public'] as ShareVisibility[]).map(visibility => (
                    <button
                      key={visibility}
                      onClick={() => setSettings(s => ({ ...s, visibility }))}
                      className={cn(
                        'w-full flex items-center gap-3 p-3 rounded-lg border-2 transition-colors text-left',
                        settings.visibility === visibility
                          ? 'border-blue-500 bg-blue-50'
                          : 'border-gray-200 hover:border-gray-300'
                      )}
                    >
                      <span className={cn(
                        'p-2 rounded-lg',
                        settings.visibility === visibility
                          ? 'bg-blue-100 text-blue-600'
                          : 'bg-gray-100 text-gray-500'
                      )}>
                        {getVisibilityIcon(visibility)}
                      </span>
                      <div>
                        <p className="font-medium text-gray-900 capitalize">{visibility}</p>
                        <p className="text-sm text-gray-500">{getVisibilityDescription(visibility)}</p>
                      </div>
                    </button>
                  ))}
                </div>
              </div>

              {/* Additional Settings */}
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <label className="flex items-center gap-2 text-sm text-gray-700">
                    <Copy className="w-4 h-4 text-gray-400" />
                    Allow copying
                  </label>
                  <button
                    onClick={() => setSettings(s => ({ ...s, allowCopy: !s.allowCopy }))}
                    className={cn(
                      'w-10 h-6 rounded-full transition-colors',
                      settings.allowCopy ? 'bg-blue-500' : 'bg-gray-300'
                    )}
                  >
                    <span
                      className={cn(
                        'block w-4 h-4 bg-white rounded-full transition-transform',
                        settings.allowCopy ? 'translate-x-5' : 'translate-x-1'
                      )}
                    />
                  </button>
                </div>

                <div className="flex items-center justify-between">
                  <label className="flex items-center gap-2 text-sm text-gray-700">
                    <Users className="w-4 h-4 text-gray-400" />
                    Allow forking
                  </label>
                  <button
                    onClick={() => setSettings(s => ({ ...s, allowFork: !s.allowFork }))}
                    className={cn(
                      'w-10 h-6 rounded-full transition-colors',
                      settings.allowFork ? 'bg-blue-500' : 'bg-gray-300'
                    )}
                  >
                    <span
                      className={cn(
                        'block w-4 h-4 bg-white rounded-full transition-transform',
                        settings.allowFork ? 'translate-x-5' : 'translate-x-1'
                      )}
                    />
                  </button>
                </div>

                <div className="flex items-center justify-between">
                  <label className="text-sm text-gray-700">Link expires in</label>
                  <select
                    value={settings.expiresIn}
                    onChange={(e) => setSettings(s => ({ ...s, expiresIn: e.target.value as any }))}
                    className="h-8 px-2 border border-gray-200 rounded-lg text-sm focus:border-blue-500 focus:ring-0"
                  >
                    <option value="1h">1 hour</option>
                    <option value="24h">24 hours</option>
                    <option value="7d">7 days</option>
                    <option value="30d">30 days</option>
                    <option value="never">Never</option>
                  </select>
                </div>
              </div>

              {/* Share URL */}
              {shareUrl ? (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Share Link
                  </label>
                  <div className="flex gap-2">
                    <input
                      type="text"
                      value={shareUrl}
                      readOnly
                      className="flex-1 h-10 px-3 bg-gray-50 border border-gray-200 rounded-lg text-sm font-mono"
                    />
                    <button
                      onClick={copyUrl}
                      className="px-4 py-2 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors"
                    >
                      {copied ? <Check className="w-5 h-5 text-green-500" /> : <Copy className="w-5 h-5" />}
                    </button>
                  </div>
                </div>
              ) : (
                <button
                  onClick={generateShareUrl}
                  disabled={isGenerating}
                  className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50"
                >
                  {isGenerating ? (
                    <>
                      <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                      Generating...
                    </>
                  ) : (
                    <>
                      <Link className="w-4 h-4" />
                      Generate Share Link
                    </>
                  )}
                </button>
              )}

              {/* Social Sharing */}
              {shareUrl && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-3">
                    Share via
                  </label>
                  <div className="flex gap-2">
                    <button
                      onClick={shareToTwitter}
                      className="flex-1 flex items-center justify-center gap-2 px-4 py-2 bg-[#1DA1F2] text-white rounded-lg hover:opacity-90 transition-opacity"
                    >
                      <Twitter className="w-4 h-4" />
                      Twitter
                    </button>
                    <button
                      onClick={shareViaEmail}
                      className="flex-1 flex items-center justify-center gap-2 px-4 py-2 bg-gray-600 text-white rounded-lg hover:opacity-90 transition-opacity"
                    >
                      <Mail className="w-4 h-4" />
                      Email
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default SharingSystem;
