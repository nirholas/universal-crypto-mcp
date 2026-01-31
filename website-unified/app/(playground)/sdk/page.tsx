'use client';

import React, { useState, useRef, useCallback, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import dynamic from 'next/dynamic';
import { cn } from '@/lib/utils/cn';
import { CodeLanguage, GeneratedCode } from '@/lib/playground/types';
import { SAMPLE_TOOLS, getToolById } from '@/lib/playground/tools-data';
import {
  generateCode,
  getAvailableLanguages,
} from '@/lib/playground/code-generator';
import {
  TemplateLibrary,
  APIReference,
  PRESET_TEMPLATES,
  type Template,
} from '@/components/playground/TemplateLibrary';
import {
  Play,
  Copy,
  Check,
  Download,
  ChevronLeft,
  Terminal,
  Code2,
  Book,
  Layers,
  Settings,
  Loader2,
  AlertCircle,
  CheckCircle2,
  XCircle,
  RotateCcw,
  Split,
  Maximize2,
  Minimize2,
} from 'lucide-react';

// Dynamically import Monaco Editor (client-side only)
const MonacoEditor = dynamic(
  () => import('@monaco-editor/react').then(mod => mod.default),
  {
    ssr: false,
    loading: () => (
      <div className="flex items-center justify-center h-full bg-gray-900">
        <Loader2 className="w-8 h-8 animate-spin text-gray-500" />
      </div>
    ),
  }
);

type RunStatus = 'idle' | 'running' | 'success' | 'error';

interface RunResult {
  status: RunStatus;
  output?: string;
  error?: string;
  duration?: number;
}

// Default starter code
const DEFAULT_CODE = `// Universal Crypto MCP SDK Playground
// Write and test your code here!

import { McpClient } from '@universal-mcp/sdk';

async function main() {
  const client = new McpClient({
    apiKey: 'demo_key',
  });

  // Example: Get wallet balance
  const result = await client.tools.execute('wallet.getBalance', {
    address: '0x742d35Cc6634C0532925a3b844Bc9e7595f0bC61',
    chain: 'ethereum',
  });

  console.log('Balance:', result);
  return result;
}

main().catch(console.error);
`;

export default function SDKPlaygroundPage() {
  const router = useRouter();

  // Editor state
  const [code, setCode] = useState(DEFAULT_CODE);
  const [language, setLanguage] = useState<CodeLanguage>('typescript');
  const [theme, setTheme] = useState<'vs-dark' | 'light'>('vs-dark');

  // Run state
  const [runResult, setRunResult] = useState<RunResult>({ status: 'idle' });
  const [isRunning, setIsRunning] = useState(false);

  // UI state
  const [activeTab, setActiveTab] = useState<'editor' | 'templates' | 'api'>('editor');
  const [showOutput, setShowOutput] = useState(true);
  const [splitView, setSplitView] = useState(true);
  const [copied, setCopied] = useState(false);

  const editorRef = useRef<any>(null);
  const availableLanguages = getAvailableLanguages();

  // Handle editor mount
  const handleEditorMount = (editor: any) => {
    editorRef.current = editor;
    editor.focus();
  };

  // Copy code to clipboard
  const copyCode = async () => {
    await navigator.clipboard.writeText(code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  // Download code as file
  const downloadCode = () => {
    const extensions: Record<CodeLanguage, string> = {
      typescript: '.ts',
      javascript: '.js',
      python: '.py',
      rust: '.rs',
      go: '.go',
      curl: '.sh',
    };

    const blob = new Blob([code], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `mcp-code${extensions[language] || '.txt'}`;
    a.click();
    URL.revokeObjectURL(url);
  };

  // Run code (simulated for demo)
  const runCode = async () => {
    setIsRunning(true);
    setRunResult({ status: 'running' });
    setShowOutput(true);

    const startTime = Date.now();

    try {
      // Simulate execution delay
      await new Promise(r => setTimeout(r, 500 + Math.random() * 1000));

      // Parse code for console.log statements and simulate output
      const logs: string[] = [];

      // Extract console.log calls (simplified regex)
      const logMatches = code.match(/console\.log\([^)]+\)/g) || [];
      for (const match of logMatches) {
        const content = match.replace(/console\.log\(|\)$/g, '');
        logs.push(`> ${content}`);
      }

      // Simulate mock response
      const mockOutput = [
        '🚀 Connecting to MCP Server...',
        '✓ Connected successfully',
        '',
        ...logs,
        '',
        '📦 Response:',
        JSON.stringify(
          {
            success: true,
            data: {
              balance: '1.234567',
              symbol: 'ETH',
              usdValue: 3456.78,
            },
          },
          null,
          2
        ),
        '',
        `✅ Execution completed in ${Date.now() - startTime}ms`,
      ].join('\n');

      setRunResult({
        status: 'success',
        output: mockOutput,
        duration: Date.now() - startTime,
      });
    } catch (error: any) {
      setRunResult({
        status: 'error',
        error: error.message || 'Unknown error occurred',
        duration: Date.now() - startTime,
      });
    } finally {
      setIsRunning(false);
    }
  };

  // Load template
  const handleTemplateSelect = (template: Template) => {
    setCode(template.code);
    setLanguage(template.language);
    setActiveTab('editor');
    editorRef.current?.focus();
  };

  // Handle tool selection from API reference
  const handleToolSelect = (tool: any) => {
    const generated = generateCode(tool, {}, language);
    setCode(generated.code);
    setActiveTab('editor');
  };

  // Reset code
  const resetCode = () => {
    setCode(DEFAULT_CODE);
    setRunResult({ status: 'idle' });
  };

  // Get Monaco language
  const getMonacoLanguage = (lang: CodeLanguage): string => {
    const map: Record<CodeLanguage, string> = {
      typescript: 'typescript',
      javascript: 'javascript',
      python: 'python',
      rust: 'rust',
      go: 'go',
      curl: 'shell',
    };
    return map[lang] || 'plaintext';
  };

  return (
    <div className="h-screen flex flex-col bg-gray-900">
      {/* Header */}
      <header className="flex items-center justify-between px-4 py-3 bg-gray-800 border-b border-gray-700">
        <div className="flex items-center gap-4">
          <button
            onClick={() => router.push('/tools')}
            className="flex items-center gap-1 text-gray-400 hover:text-white transition-colors"
          >
            <ChevronLeft className="w-5 h-5" />
            <span className="text-sm">Back</span>
          </button>

          <div className="h-6 w-px bg-gray-700" />

          <div className="flex items-center gap-3">
            <Code2 className="w-5 h-5 text-gray-400" />
            <h1 className="text-lg font-semibold text-white">SDK Playground</h1>
          </div>
        </div>

        <div className="flex items-center gap-3">
          {/* Language Selector */}
          <select
            value={language}
            onChange={(e) => setLanguage(e.target.value as CodeLanguage)}
            className="h-9 px-3 bg-gray-700 text-white border border-gray-600 rounded-lg text-sm focus:border-blue-500 focus:ring-0"
          >
            {availableLanguages.map(lang => (
              <option key={lang.id} value={lang.id}>
                {lang.icon} {lang.name}
              </option>
            ))}
          </select>

          <div className="h-6 w-px bg-gray-700" />

          <button
            onClick={copyCode}
            className="flex items-center gap-2 px-3 py-2 text-gray-400 hover:text-white hover:bg-gray-700 rounded-lg transition-colors"
            title="Copy Code"
          >
            {copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
          </button>
          <button
            onClick={downloadCode}
            className="flex items-center gap-2 px-3 py-2 text-gray-400 hover:text-white hover:bg-gray-700 rounded-lg transition-colors"
            title="Download Code"
          >
            <Download className="w-4 h-4" />
          </button>
          <button
            onClick={resetCode}
            className="flex items-center gap-2 px-3 py-2 text-gray-400 hover:text-white hover:bg-gray-700 rounded-lg transition-colors"
            title="Reset"
          >
            <RotateCcw className="w-4 h-4" />
          </button>

          <div className="h-6 w-px bg-gray-700" />

          <button
            onClick={runCode}
            disabled={isRunning}
            className={cn(
              'flex items-center gap-2 px-4 py-2 font-medium rounded-lg transition-colors',
              isRunning
                ? 'bg-gray-600 text-gray-300 cursor-not-allowed'
                : 'bg-green-600 text-white hover:bg-green-700'
            )}
          >
            {isRunning ? (
              <Loader2 className="w-4 h-4 animate-spin" />
            ) : (
              <Play className="w-4 h-4" />
            )}
            {isRunning ? 'Running...' : 'Run'}
          </button>
        </div>
      </header>

      <div className="flex-1 flex overflow-hidden">
        {/* Sidebar */}
        <aside className="w-80 bg-gray-800 border-r border-gray-700 flex flex-col">
          {/* Tabs */}
          <div className="flex border-b border-gray-700">
            <button
              onClick={() => setActiveTab('editor')}
              className={cn(
                'flex-1 flex items-center justify-center gap-2 px-4 py-3 text-sm font-medium transition-colors',
                activeTab === 'editor'
                  ? 'text-white border-b-2 border-blue-500'
                  : 'text-gray-400 hover:text-white'
              )}
            >
              <Terminal className="w-4 h-4" />
              Editor
            </button>
            <button
              onClick={() => setActiveTab('templates')}
              className={cn(
                'flex-1 flex items-center justify-center gap-2 px-4 py-3 text-sm font-medium transition-colors',
                activeTab === 'templates'
                  ? 'text-white border-b-2 border-blue-500'
                  : 'text-gray-400 hover:text-white'
              )}
            >
              <Layers className="w-4 h-4" />
              Templates
            </button>
            <button
              onClick={() => setActiveTab('api')}
              className={cn(
                'flex-1 flex items-center justify-center gap-2 px-4 py-3 text-sm font-medium transition-colors',
                activeTab === 'api'
                  ? 'text-white border-b-2 border-blue-500'
                  : 'text-gray-400 hover:text-white'
              )}
            >
              <Book className="w-4 h-4" />
              API
            </button>
          </div>

          {/* Sidebar Content */}
          <div className="flex-1 overflow-y-auto p-4">
            {activeTab === 'editor' && (
              <div className="space-y-4 text-gray-300">
                <div>
                  <h3 className="text-sm font-semibold text-white mb-2">Quick Tips</h3>
                  <ul className="space-y-2 text-sm">
                    <li className="flex items-start gap-2">
                      <span className="text-green-400">•</span>
                      Use <code className="px-1.5 py-0.5 bg-gray-700 rounded text-xs">Ctrl+Enter</code> to run code
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-green-400">•</span>
                      API key is pre-configured for demo
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-green-400">•</span>
                      Browse Templates for quick starts
                    </li>
                  </ul>
                </div>

                <div>
                  <h3 className="text-sm font-semibold text-white mb-2">Available Tools</h3>
                  <p className="text-sm text-gray-400 mb-2">
                    {SAMPLE_TOOLS.length}+ tools available
                  </p>
                  <div className="flex flex-wrap gap-1">
                    {['wallets', 'defi', 'nft', 'trading', 'market-data'].map(cat => (
                      <span
                        key={cat}
                        className="px-2 py-1 bg-gray-700 text-gray-300 text-xs rounded"
                      >
                        {cat}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'templates' && (
              <div className="text-white">
                <TemplateLibrary
                  onSelect={handleTemplateSelect}
                />
              </div>
            )}

            {activeTab === 'api' && (
              <div className="text-white">
                <APIReference
                  tools={SAMPLE_TOOLS}
                  onToolSelect={handleToolSelect}
                />
              </div>
            )}
          </div>
        </aside>

        {/* Main Content */}
        <main className="flex-1 flex flex-col">
          {/* Editor / Output Split */}
          <div className={cn(
            'flex-1 flex',
            splitView ? 'flex-row' : 'flex-col'
          )}>
            {/* Code Editor */}
            <div className={cn(
              'flex-1 overflow-hidden',
              splitView && showOutput ? 'w-1/2' : 'w-full'
            )}>
              <MonacoEditor
                height="100%"
                language={getMonacoLanguage(language)}
                theme={theme}
                value={code}
                onChange={(value) => setCode(value || '')}
                onMount={handleEditorMount}
                options={{
                  fontSize: 14,
                  fontFamily: 'JetBrains Mono, Fira Code, monospace',
                  minimap: { enabled: true },
                  scrollBeyondLastLine: false,
                  padding: { top: 16, bottom: 16 },
                  tabSize: 2,
                  automaticLayout: true,
                  wordWrap: 'on',
                  lineNumbers: 'on',
                  folding: true,
                  bracketPairColorization: { enabled: true },
                }}
              />
            </div>

            {/* Output Panel */}
            {showOutput && (
              <>
                {splitView && (
                  <div className="w-px bg-gray-700" />
                )}

                <div className={cn(
                  'flex flex-col bg-gray-900',
                  splitView ? 'w-1/2' : 'h-1/2'
                )}>
                  {/* Output Header */}
                  <div className="flex items-center justify-between px-4 py-2 bg-gray-800 border-b border-gray-700">
                    <div className="flex items-center gap-2">
                      <Terminal className="w-4 h-4 text-gray-400" />
                      <span className="text-sm font-medium text-white">Output</span>
                      {runResult.status !== 'idle' && (
                        <span className={cn(
                          'flex items-center gap-1 px-2 py-0.5 rounded-full text-xs',
                          runResult.status === 'running' && 'bg-blue-900/50 text-blue-300',
                          runResult.status === 'success' && 'bg-green-900/50 text-green-300',
                          runResult.status === 'error' && 'bg-red-900/50 text-red-300'
                        )}>
                          {runResult.status === 'running' && <Loader2 className="w-3 h-3 animate-spin" />}
                          {runResult.status === 'success' && <CheckCircle2 className="w-3 h-3" />}
                          {runResult.status === 'error' && <XCircle className="w-3 h-3" />}
                          {runResult.status === 'running' ? 'Running...' : `${runResult.duration}ms`}
                        </span>
                      )}
                    </div>
                    <div className="flex items-center gap-1">
                      <button
                        onClick={() => setSplitView(!splitView)}
                        className="p-1.5 text-gray-400 hover:text-white hover:bg-gray-700 rounded transition-colors"
                        title={splitView ? 'Stack View' : 'Split View'}
                      >
                        <Split className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => setShowOutput(false)}
                        className="p-1.5 text-gray-400 hover:text-white hover:bg-gray-700 rounded transition-colors"
                        title="Close Output"
                      >
                        <Minimize2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>

                  {/* Output Content */}
                  <div className="flex-1 overflow-auto p-4 font-mono text-sm">
                    {runResult.status === 'idle' && (
                      <p className="text-gray-500">Click Run to execute your code...</p>
                    )}
                    {runResult.status === 'running' && (
                      <div className="flex items-center gap-2 text-blue-400">
                        <Loader2 className="w-4 h-4 animate-spin" />
                        <span>Executing code...</span>
                      </div>
                    )}
                    {runResult.status === 'success' && (
                      <pre className="text-green-300 whitespace-pre-wrap">
                        {runResult.output}
                      </pre>
                    )}
                    {runResult.status === 'error' && (
                      <div className="text-red-400">
                        <div className="flex items-center gap-2 mb-2">
                          <AlertCircle className="w-4 h-4" />
                          <span className="font-semibold">Error</span>
                        </div>
                        <pre className="whitespace-pre-wrap">{runResult.error}</pre>
                      </div>
                    )}
                  </div>
                </div>
              </>
            )}
          </div>

          {/* Bottom Bar */}
          {!showOutput && (
            <button
              onClick={() => setShowOutput(true)}
              className="flex items-center justify-center gap-2 py-2 bg-gray-800 border-t border-gray-700 text-gray-400 hover:text-white transition-colors"
            >
              <Maximize2 className="w-4 h-4" />
              <span className="text-sm">Show Output</span>
            </button>
          )}
        </main>
      </div>
    </div>
  );
}
