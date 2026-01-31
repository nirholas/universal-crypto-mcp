'use client';

import React, { useState, useMemo, useEffect } from 'react';
import { useParams, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { cn } from '@/lib/utils/cn';
import { McpTool, ExecutionResult, ParameterPreset } from '@/lib/playground/types';
import { getToolById, getRelatedTools } from '@/lib/playground/tools-data';
import { getCategoryById } from '@/lib/playground/categories';
import { validateParameters } from '@/lib/playground/execution';
import { savePreset, getPresetsForTool, toggleFavoriteTool, getFavoriteTools } from '@/lib/playground/storage';

import { ParameterForm } from '@/components/playground/ParameterForm';
import { ExecutionPanel } from '@/components/playground/ExecutionPanel';
import { OutputDisplay } from '@/components/playground/OutputDisplay';
import { ToolCard } from '@/components/playground/ToolCard';

import {
  ArrowLeft,
  Star,
  ExternalLink,
  Book,
  Code2,
  ChevronRight,
  Copy,
  Check,
  AlertTriangle,
  Info,
  Coins,
  Lock,
  Zap,
} from 'lucide-react';

export default function ToolDetailPage() {
  const params = useParams();
  const searchParams = useSearchParams();
  const toolId = params.id as string;

  // Get tool data
  const tool = useMemo(() => getToolById(toolId), [toolId]);
  const category = tool ? getCategoryById(tool.category) : null;
  const relatedTools = tool ? getRelatedTools(tool.id) : [];
  const presets = tool ? getPresetsForTool(tool.id) : [];

  // State
  const [parameters, setParameters] = useState<Record<string, unknown>>({});
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [result, setResult] = useState<ExecutionResult | null>(null);
  const [activeTab, setActiveTab] = useState<'execute' | 'docs' | 'examples'>('execute');
  const [isFavorite, setIsFavorite] = useState(false);
  const [copied, setCopied] = useState(false);

  // Load params from URL if present
  useEffect(() => {
    const paramsStr = searchParams.get('params');
    if (paramsStr) {
      try {
        const decoded = atob(paramsStr);
        const parsed = JSON.parse(decoded);
        if (parsed.parameters) {
          setParameters(parsed.parameters);
        }
      } catch {
        // Invalid params
      }
    }
  }, [searchParams]);

  // Check favorite status
  useEffect(() => {
    if (tool) {
      setIsFavorite(getFavoriteTools().includes(tool.id));
    }
  }, [tool]);

  // Validate on parameter change
  useEffect(() => {
    if (tool) {
      const validation = validateParameters(tool, parameters);
      setErrors(validation.errors);
    }
  }, [tool, parameters]);

  const handleResult = (newResult: ExecutionResult) => {
    setResult(newResult);
  };

  const handleSavePreset = (params: Record<string, unknown>) => {
    if (!tool) return;

    const preset: ParameterPreset = {
      id: `preset_${Date.now()}`,
      name: `Preset ${new Date().toLocaleDateString()}`,
      toolId: tool.id,
      parameters: params,
      createdAt: new Date(),
      updatedAt: new Date(),
      isPublic: false,
      usageCount: 0,
    };

    const name = prompt('Preset name:', preset.name);
    if (name) {
      preset.name = name;
      savePreset(preset);
    }
  };

  const handleFavoriteToggle = () => {
    if (!tool) return;
    toggleFavoriteTool(tool.id);
    setIsFavorite(!isFavorite);
  };

  const copyToolId = async () => {
    if (!tool) return;
    await navigator.clipboard.writeText(tool.id);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  if (!tool) {
    return (
      <div className="min-h-screen bg-gray-50 pt-20">
        <div className="max-w-4xl mx-auto px-6 py-16 text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">Tool Not Found</h1>
          <p className="text-gray-600 mb-8">The tool you're looking for doesn't exist.</p>
          <Link
            href="/tools"
            className="inline-flex items-center gap-2 px-6 py-3 bg-black text-white font-medium rounded-xl hover:bg-gray-900 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Tools
          </Link>
        </div>
      </div>
    );
  }

  const hasWritePermission = tool.permissions.some(p => p.type === 'write' || p.type === 'sign');
  const isPaid = tool.pricing?.type !== 'free';

  return (
    <div className="min-h-screen bg-gray-50 pt-20">
      <div className="max-w-7xl mx-auto px-6 py-8">
        {/* Breadcrumb */}
        <nav className="flex items-center gap-2 text-sm text-gray-600 mb-6">
          <Link href="/tools" className="hover:text-gray-900 transition-colors">
            Tools
          </Link>
          <ChevronRight className="w-4 h-4" />
          <span className="text-gray-400">{category?.name}</span>
          <ChevronRight className="w-4 h-4" />
          <span className="text-gray-900 font-medium">{tool.name}</span>
        </nav>

        {/* Header */}
        <div className="bg-white rounded-2xl border border-gray-200 p-6 mb-8">
          <div className="flex items-start justify-between mb-4">
            <div className="flex-1">
              <div className="flex items-center gap-3 mb-2">
                <h1 className="text-2xl font-bold text-gray-900">{tool.name}</h1>
                {hasWritePermission && (
                  <span className="flex items-center gap-1 px-2 py-1 text-xs font-medium text-orange-700 bg-orange-100 rounded-full">
                    <Lock className="w-3 h-3" />
                    Write Access
                  </span>
                )}
                {isPaid && (
                  <span className="flex items-center gap-1 px-2 py-1 text-xs font-medium text-amber-700 bg-amber-100 rounded-full">
                    <Coins className="w-3 h-3" />
                    {tool.pricing?.cost} {tool.pricing?.unit || 'credits'}
                  </span>
                )}
              </div>
              <p className="text-gray-600 text-lg mb-4">
                {tool.longDescription || tool.description}
              </p>

              {/* Meta Tags */}
              <div className="flex flex-wrap items-center gap-2">
                <span className="px-3 py-1 text-sm font-medium text-gray-700 bg-gray-100 rounded-full">
                  {category?.name}
                </span>
                <span className={cn(
                  'px-3 py-1 text-sm font-medium rounded-full',
                  tool.complexity === 'beginner' && 'bg-green-100 text-green-700',
                  tool.complexity === 'intermediate' && 'bg-yellow-100 text-yellow-700',
                  tool.complexity === 'advanced' && 'bg-orange-100 text-orange-700',
                  tool.complexity === 'expert' && 'bg-red-100 text-red-700'
                )}>
                  {tool.complexity}
                </span>
                {tool.chains && tool.chains.length > 0 && (
                  <span className="px-3 py-1 text-sm font-medium text-blue-700 bg-blue-100 rounded-full">
                    {tool.chains.length} chains
                  </span>
                )}
                <span className="px-3 py-1 text-sm font-mono text-gray-500 bg-gray-50 rounded-full">
                  v{tool.version}
                </span>
              </div>
            </div>

            {/* Actions */}
            <div className="flex items-center gap-2 ml-4">
              <button
                onClick={handleFavoriteToggle}
                className={cn(
                  'p-2 rounded-xl transition-colors',
                  isFavorite
                    ? 'text-amber-500 bg-amber-50 hover:bg-amber-100'
                    : 'text-gray-400 hover:text-amber-500 hover:bg-gray-100'
                )}
              >
                <Star className={cn('w-5 h-5', isFavorite && 'fill-current')} />
              </button>
              <button
                onClick={copyToolId}
                className="flex items-center gap-2 px-3 py-2 text-sm font-medium text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-xl transition-colors"
              >
                {copied ? <Check className="w-4 h-4 text-green-600" /> : <Copy className="w-4 h-4" />}
                <span className="font-mono">{tool.id}</span>
              </button>
            </div>
          </div>

          {/* Tags */}
          {tool.tags.length > 0 && (
            <div className="flex flex-wrap gap-2 pt-4 border-t border-gray-100">
              {tool.tags.map(tag => (
                <Link
                  key={tag}
                  href={`/tools?tag=${tag}`}
                  className="px-2 py-1 text-xs text-gray-500 bg-gray-50 rounded hover:bg-gray-100 transition-colors"
                >
                  #{tag}
                </Link>
              ))}
            </div>
          )}
        </div>

        {/* Main Content */}
        <div className="grid lg:grid-cols-2 gap-8">
          {/* Left: Parameters & Execution */}
          <div className="space-y-6">
            {/* Tabs */}
            <div className="flex items-center gap-1 bg-white rounded-xl border border-gray-200 p-1">
              <TabButton
                active={activeTab === 'execute'}
                onClick={() => setActiveTab('execute')}
                icon={<Zap className="w-4 h-4" />}
                label="Execute"
              />
              <TabButton
                active={activeTab === 'docs'}
                onClick={() => setActiveTab('docs')}
                icon={<Book className="w-4 h-4" />}
                label="Documentation"
              />
              <TabButton
                active={activeTab === 'examples'}
                onClick={() => setActiveTab('examples')}
                icon={<Code2 className="w-4 h-4" />}
                label={`Examples (${tool.examples.length})`}
              />
            </div>

            {/* Execute Tab */}
            {activeTab === 'execute' && (
              <div className="bg-white rounded-2xl border border-gray-200 p-6">
                <ParameterForm
                  tool={tool}
                  values={parameters}
                  onChange={setParameters}
                  errors={errors}
                  showPresets={presets.length > 0}
                />

                <div className="mt-6 pt-6 border-t border-gray-100">
                  <ExecutionPanel
                    tool={tool}
                    parameters={parameters}
                    onResult={handleResult}
                    onSavePreset={handleSavePreset}
                    demoMode={true}
                  />
                </div>
              </div>
            )}

            {/* Documentation Tab */}
            {activeTab === 'docs' && (
              <div className="bg-white rounded-2xl border border-gray-200 p-6 space-y-6">
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-3">Description</h3>
                  <p className="text-gray-600">
                    {tool.longDescription || tool.description}
                  </p>
                </div>

                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-3">Input Schema</h3>
                  <pre className="p-4 bg-gray-50 rounded-xl text-sm overflow-x-auto">
                    <code>{JSON.stringify(tool.inputSchema, null, 2)}</code>
                  </pre>
                </div>

                {tool.outputSchema && (
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-3">Output Schema</h3>
                    <pre className="p-4 bg-gray-50 rounded-xl text-sm overflow-x-auto">
                      <code>{JSON.stringify(tool.outputSchema, null, 2)}</code>
                    </pre>
                  </div>
                )}

                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-3">Permissions</h3>
                  <ul className="space-y-2">
                    {tool.permissions.map((perm, i) => (
                      <li key={i} className="flex items-start gap-3">
                        <span className={cn(
                          'px-2 py-0.5 text-xs font-medium rounded',
                          perm.type === 'read' && 'bg-green-100 text-green-700',
                          perm.type === 'write' && 'bg-orange-100 text-orange-700',
                          perm.type === 'sign' && 'bg-purple-100 text-purple-700',
                          perm.type === 'admin' && 'bg-red-100 text-red-700'
                        )}>
                          {perm.type}
                        </span>
                        <span className="text-gray-600">{perm.description}</span>
                        {perm.required && (
                          <span className="text-xs text-gray-400">(required)</span>
                        )}
                      </li>
                    ))}
                  </ul>
                </div>

                {tool.chains && tool.chains.length > 0 && (
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-3">Supported Chains</h3>
                    <div className="flex flex-wrap gap-2">
                      {tool.chains.map(chain => (
                        <span key={chain} className="px-3 py-1 text-sm font-medium text-blue-700 bg-blue-100 rounded-full">
                          {chain}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* Examples Tab */}
            {activeTab === 'examples' && (
              <div className="bg-white rounded-2xl border border-gray-200 p-6">
                {tool.examples.length === 0 ? (
                  <div className="text-center py-8">
                    <Info className="w-12 h-12 text-gray-300 mx-auto mb-4" />
                    <p className="text-gray-500">No examples available for this tool</p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {tool.examples.map((example, i) => (
                      <div key={i} className="p-4 bg-gray-50 rounded-xl">
                        <div className="flex items-center justify-between mb-2">
                          <h4 className="font-medium text-gray-900">{example.name}</h4>
                          <button
                            onClick={() => {
                              setParameters(example.parameters);
                              setActiveTab('execute');
                            }}
                            className="text-sm text-blue-600 hover:text-blue-700 font-medium"
                          >
                            Use this
                          </button>
                        </div>
                        <p className="text-sm text-gray-600 mb-3">{example.description}</p>
                        <pre className="text-xs bg-white p-3 rounded-lg overflow-x-auto">
                          <code>{JSON.stringify(example.parameters, null, 2)}</code>
                        </pre>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Right: Output */}
          <div className="space-y-6">
            <OutputDisplay
              result={result}
              loading={false}
              className="sticky top-24"
            />
          </div>
        </div>

        {/* Related Tools */}
        {relatedTools.length > 0 && (
          <div className="mt-12">
            <h2 className="text-xl font-bold text-gray-900 mb-6">Related Tools</h2>
            <div className="grid md:grid-cols-3 gap-4">
              {relatedTools.map(relTool => (
                <ToolCard key={relTool.id} tool={relTool} variant="compact" />
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

function TabButton({
  active,
  onClick,
  icon,
  label,
}: {
  active: boolean;
  onClick: () => void;
  icon: React.ReactNode;
  label: string;
}) {
  return (
    <button
      onClick={onClick}
      className={cn(
        'flex items-center gap-2 px-4 py-2.5 text-sm font-medium rounded-lg transition-colors flex-1 justify-center',
        active
          ? 'bg-black text-white'
          : 'text-gray-600 hover:bg-gray-50'
      )}
    >
      {icon}
      {label}
    </button>
  );
}
