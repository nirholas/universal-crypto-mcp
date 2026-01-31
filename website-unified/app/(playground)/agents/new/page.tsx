'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useAgentMutations } from '@/hooks/useAgents';
import { cn } from '@/lib/utils';
import {
  ArrowLeft,
  Bot,
  Zap,
  Eye,
  TrendingUp,
  Settings,
  Clock,
  Webhook,
  DollarSign,
  Calendar,
  Plus,
  X,
} from 'lucide-react';

const AGENT_TYPES = [
  { id: 'trading', label: 'Trading', icon: TrendingUp, description: 'Automated trading strategies' },
  { id: 'monitoring', label: 'Monitoring', icon: Eye, description: 'Watch prices and trigger alerts' },
  { id: 'automation', label: 'Automation', icon: Zap, description: 'Automate DeFi operations' },
  { id: 'analysis', label: 'Analysis', icon: Bot, description: 'Analyze market data' },
] as const;

const TRIGGER_TYPES = [
  { id: 'schedule', label: 'Schedule', icon: Calendar, description: 'Run on a schedule' },
  { id: 'webhook', label: 'Webhook', icon: Webhook, description: 'Trigger via HTTP' },
  { id: 'price', label: 'Price Alert', icon: DollarSign, description: 'Trigger on price change' },
  { id: 'manual', label: 'Manual', icon: Settings, description: 'Trigger manually' },
] as const;

const AVAILABLE_TOOLS = [
  { id: 'swap', name: 'Swap Tokens', category: 'DeFi' },
  { id: 'get_price', name: 'Get Token Price', category: 'Data' },
  { id: 'get_balance', name: 'Get Wallet Balance', category: 'Wallet' },
  { id: 'send_notification', name: 'Send Notification', category: 'Notification' },
  { id: 'analyze_chart', name: 'Analyze Chart', category: 'Analysis' },
  { id: 'place_order', name: 'Place Order', category: 'Trading' },
  { id: 'get_trending', name: 'Get Trending Tokens', category: 'Data' },
  { id: 'bridge_tokens', name: 'Bridge Tokens', category: 'DeFi' },
];

export default function NewAgentPage() {
  const router = useRouter();
  const { create, isCreating } = useAgentMutations();
  
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    type: '' as typeof AGENT_TYPES[number]['id'] | '',
    systemPrompt: '',
    tools: [] as string[],
    triggers: [] as Array<{ type: string; config: Record<string, unknown> }>,
    schedule: '',
  });

  const handleSubmit = async () => {
    try {
      await create({
        name: formData.name,
        description: formData.description,
        type: formData.type as any,
        config: {
          systemPrompt: formData.systemPrompt,
          tools: formData.tools,
          triggers: formData.triggers,
          schedule: formData.schedule || undefined,
        },
      });
      router.push('/agents');
    } catch (error) {
      console.error('Failed to create agent:', error);
    }
  };

  const toggleTool = (toolId: string) => {
    setFormData((prev) => ({
      ...prev,
      tools: prev.tools.includes(toolId)
        ? prev.tools.filter((t) => t !== toolId)
        : [...prev.tools, toolId],
    }));
  };

  const addTrigger = (type: string) => {
    setFormData((prev) => ({
      ...prev,
      triggers: [...prev.triggers, { type, config: {} }],
    }));
  };

  const removeTrigger = (index: number) => {
    setFormData((prev) => ({
      ...prev,
      triggers: prev.triggers.filter((_, i) => i !== index),
    }));
  };

  return (
    <div className="min-h-screen bg-black text-white p-6">
      {/* Header */}
      <div className="flex items-center gap-4 mb-8">
        <Link
          href="/agents"
          className="p-2 hover:bg-white/10 rounded-lg transition-colors"
        >
          <ArrowLeft className="w-5 h-5" />
        </Link>
        <div>
          <h1 className="text-2xl font-bold">Create New Agent</h1>
          <p className="text-gray-400">Configure your AI agent step by step</p>
        </div>
      </div>

      {/* Progress */}
      <div className="flex items-center gap-2 mb-8">
        {[1, 2, 3, 4].map((s) => (
          <div
            key={s}
            className={cn(
              'flex-1 h-2 rounded-full transition-colors',
              s <= step ? 'bg-purple-500' : 'bg-white/10'
            )}
          />
        ))}
      </div>

      {/* Step 1: Basic Info */}
      {step === 1 && (
        <div className="max-w-2xl mx-auto">
          <h2 className="text-xl font-semibold mb-6">Basic Information</h2>
          
          <div className="space-y-6">
            <div>
              <label className="block text-sm font-medium mb-2">Agent Name</label>
              <input
                type="text"
                value={formData.name}
                onChange={(e) => setFormData((p) => ({ ...p, name: e.target.value }))}
                placeholder="My Trading Bot"
                className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-lg focus:outline-none focus:border-purple-500"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium mb-2">Description</label>
              <textarea
                value={formData.description}
                onChange={(e) => setFormData((p) => ({ ...p, description: e.target.value }))}
                placeholder="Describe what this agent does..."
                rows={3}
                className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-lg focus:outline-none focus:border-purple-500 resize-none"
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-4">Agent Type</label>
              <div className="grid grid-cols-2 gap-4">
                {AGENT_TYPES.map((type) => (
                  <button
                    key={type.id}
                    onClick={() => setFormData((p) => ({ ...p, type: type.id }))}
                    className={cn(
                      'p-4 rounded-xl border text-left transition-colors',
                      formData.type === type.id
                        ? 'border-purple-500 bg-purple-500/10'
                        : 'border-white/10 hover:border-white/20'
                    )}
                  >
                    <type.icon className="w-6 h-6 mb-2 text-purple-400" />
                    <div className="font-medium">{type.label}</div>
                    <div className="text-sm text-gray-400">{type.description}</div>
                  </button>
                ))}
              </div>
            </div>
          </div>

          <div className="flex justify-end mt-8">
            <button
              onClick={() => setStep(2)}
              disabled={!formData.name || !formData.type}
              className="px-6 py-3 bg-purple-600 hover:bg-purple-700 disabled:opacity-50 disabled:cursor-not-allowed rounded-lg font-medium transition-colors"
            >
              Continue
            </button>
          </div>
        </div>
      )}

      {/* Step 2: System Prompt */}
      {step === 2 && (
        <div className="max-w-2xl mx-auto">
          <h2 className="text-xl font-semibold mb-6">System Prompt</h2>
          
          <div>
            <label className="block text-sm font-medium mb-2">
              Instructions for your agent
            </label>
            <textarea
              value={formData.systemPrompt}
              onChange={(e) => setFormData((p) => ({ ...p, systemPrompt: e.target.value }))}
              placeholder="You are a trading assistant that..."
              rows={10}
              className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-lg focus:outline-none focus:border-purple-500 resize-none font-mono text-sm"
            />
            <p className="text-sm text-gray-400 mt-2">
              Define how your agent should behave, what strategies to use, and any constraints.
            </p>
          </div>

          <div className="flex justify-between mt-8">
            <button
              onClick={() => setStep(1)}
              className="px-6 py-3 bg-white/10 hover:bg-white/20 rounded-lg font-medium transition-colors"
            >
              Back
            </button>
            <button
              onClick={() => setStep(3)}
              className="px-6 py-3 bg-purple-600 hover:bg-purple-700 rounded-lg font-medium transition-colors"
            >
              Continue
            </button>
          </div>
        </div>
      )}

      {/* Step 3: Tools */}
      {step === 3 && (
        <div className="max-w-2xl mx-auto">
          <h2 className="text-xl font-semibold mb-6">Available Tools</h2>
          <p className="text-gray-400 mb-6">
            Select the tools your agent can use to accomplish its tasks.
          </p>
          
          <div className="grid grid-cols-2 gap-3">
            {AVAILABLE_TOOLS.map((tool) => (
              <button
                key={tool.id}
                onClick={() => toggleTool(tool.id)}
                className={cn(
                  'p-4 rounded-xl border text-left transition-colors',
                  formData.tools.includes(tool.id)
                    ? 'border-purple-500 bg-purple-500/10'
                    : 'border-white/10 hover:border-white/20'
                )}
              >
                <div className="font-medium">{tool.name}</div>
                <div className="text-sm text-gray-400">{tool.category}</div>
              </button>
            ))}
          </div>

          <div className="flex justify-between mt-8">
            <button
              onClick={() => setStep(2)}
              className="px-6 py-3 bg-white/10 hover:bg-white/20 rounded-lg font-medium transition-colors"
            >
              Back
            </button>
            <button
              onClick={() => setStep(4)}
              className="px-6 py-3 bg-purple-600 hover:bg-purple-700 rounded-lg font-medium transition-colors"
            >
              Continue
            </button>
          </div>
        </div>
      )}

      {/* Step 4: Triggers */}
      {step === 4 && (
        <div className="max-w-2xl mx-auto">
          <h2 className="text-xl font-semibold mb-6">Triggers</h2>
          <p className="text-gray-400 mb-6">
            Configure when your agent should run.
          </p>

          {/* Existing triggers */}
          {formData.triggers.length > 0 && (
            <div className="space-y-3 mb-6">
              {formData.triggers.map((trigger, index) => (
                <div
                  key={index}
                  className="flex items-center justify-between p-4 bg-white/5 rounded-lg border border-white/10"
                >
                  <div className="flex items-center gap-3">
                    <Clock className="w-5 h-5 text-purple-400" />
                    <span className="capitalize">{trigger.type}</span>
                  </div>
                  <button
                    onClick={() => removeTrigger(index)}
                    className="p-1 hover:bg-white/10 rounded"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
              ))}
            </div>
          )}

          {/* Add trigger */}
          <div className="grid grid-cols-2 gap-3">
            {TRIGGER_TYPES.map((trigger) => (
              <button
                key={trigger.id}
                onClick={() => addTrigger(trigger.id)}
                className="p-4 rounded-xl border border-white/10 hover:border-purple-500 text-left transition-colors"
              >
                <trigger.icon className="w-6 h-6 mb-2 text-purple-400" />
                <div className="font-medium">{trigger.label}</div>
                <div className="text-sm text-gray-400">{trigger.description}</div>
              </button>
            ))}
          </div>

          {/* Schedule input if schedule trigger selected */}
          {formData.triggers.some((t) => t.type === 'schedule') && (
            <div className="mt-6">
              <label className="block text-sm font-medium mb-2">Cron Expression</label>
              <input
                type="text"
                value={formData.schedule}
                onChange={(e) => setFormData((p) => ({ ...p, schedule: e.target.value }))}
                placeholder="*/5 * * * *"
                className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-lg focus:outline-none focus:border-purple-500 font-mono"
              />
              <p className="text-sm text-gray-400 mt-1">
                Example: */5 * * * * (every 5 minutes)
              </p>
            </div>
          )}

          <div className="flex justify-between mt-8">
            <button
              onClick={() => setStep(3)}
              className="px-6 py-3 bg-white/10 hover:bg-white/20 rounded-lg font-medium transition-colors"
            >
              Back
            </button>
            <button
              onClick={handleSubmit}
              disabled={isCreating}
              className="px-6 py-3 bg-purple-600 hover:bg-purple-700 disabled:opacity-50 rounded-lg font-medium transition-colors flex items-center gap-2"
            >
              {isCreating ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white" />
                  Creating...
                </>
              ) : (
                <>
                  <Plus className="w-5 h-5" />
                  Create Agent
                </>
              )}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
