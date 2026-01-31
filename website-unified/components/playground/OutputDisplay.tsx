'use client';

import React, { useState, useMemo } from 'react';
import { cn } from '@/lib/utils/cn';
import { ExecutionResult, ExecutionContent, CodeLanguage } from '@/lib/playground/types';
import { generateCodeFromExecution, getAvailableLanguages, getFileExtension } from '@/lib/playground/code-generator';
import { getToolById } from '@/lib/playground/tools-data';
import {
  Copy,
  Check,
  Download,
  ChevronDown,
  ChevronRight,
  Code2,
  Table2,
  BarChart3,
  FileJson,
  Image as ImageIcon,
  Maximize2,
  Minimize2,
} from 'lucide-react';

interface OutputDisplayProps {
  result: ExecutionResult | null;
  loading?: boolean;
  className?: string;
}

export function OutputDisplay({
  result,
  loading = false,
  className,
}: OutputDisplayProps) {
  const [viewMode, setViewMode] = useState<'json' | 'table' | 'chart' | 'raw'>('json');
  const [isExpanded, setIsExpanded] = useState(false);
  const [copiedIndex, setCopiedIndex] = useState<number | null>(null);
  const [showCodeGen, setShowCodeGen] = useState(false);
  const [selectedLanguage, setSelectedLanguage] = useState<CodeLanguage>('typescript');

  const content = result?.content || [];
  const languages = getAvailableLanguages();

  const handleCopy = async (data: unknown, index: number) => {
    try {
      const text = typeof data === 'string' ? data : JSON.stringify(data, null, 2);
      await navigator.clipboard.writeText(text);
      setCopiedIndex(index);
      setTimeout(() => setCopiedIndex(null), 2000);
    } catch {
      // Fallback
      console.error('Failed to copy');
    }
  };

  const handleDownload = (data: unknown, filename: string) => {
    const text = typeof data === 'string' ? data : JSON.stringify(data, null, 2);
    const blob = new Blob([text], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    a.click();
    URL.revokeObjectURL(url);
  };

  const generatedCode = useMemo(() => {
    if (!result || !showCodeGen) return null;
    const tool = getToolById(result.toolId);
    if (!tool) return null;
    return generateCodeFromExecution(result, tool, selectedLanguage);
  }, [result, showCodeGen, selectedLanguage]);

  if (loading) {
    return (
      <div className={cn('bg-gray-50 rounded-xl p-8', className)}>
        <div className="flex flex-col items-center justify-center text-center">
          <div className="w-12 h-12 mb-4 rounded-full bg-gray-200 flex items-center justify-center animate-pulse">
            <Code2 className="w-6 h-6 text-gray-400" />
          </div>
          <p className="text-gray-500">Executing...</p>
        </div>
      </div>
    );
  }

  if (!result) {
    return (
      <div className={cn('bg-gray-50 rounded-xl p-8', className)}>
        <div className="flex flex-col items-center justify-center text-center">
          <div className="w-12 h-12 mb-4 rounded-full bg-gray-200 flex items-center justify-center">
            <Code2 className="w-6 h-6 text-gray-400" />
          </div>
          <p className="text-gray-500">Execute the tool to see results</p>
        </div>
      </div>
    );
  }

  if (result.status === 'error') {
    return (
      <div className={cn('bg-red-50 rounded-xl p-6', className)}>
        <div className="flex items-center gap-2 mb-3">
          <span className="text-red-600 font-semibold">Error</span>
        </div>
        <pre className="text-sm text-red-700 whitespace-pre-wrap break-words">
          {result.error?.message}
        </pre>
      </div>
    );
  }

  return (
    <div className={cn('bg-white rounded-xl border border-gray-200 overflow-hidden', className)}>
      {/* Header */}
      <div className="flex items-center justify-between px-4 py-3 bg-gray-50 border-b border-gray-200">
        <div className="flex items-center gap-2">
          <span className="text-sm font-semibold text-gray-900">Output</span>
          {result.duration && (
            <span className="text-xs text-gray-500">
              ({result.duration}ms)
            </span>
          )}
        </div>

        <div className="flex items-center gap-2">
          {/* View Mode Tabs */}
          <div className="flex items-center bg-white rounded-lg border border-gray-200 p-0.5">
            <ViewModeButton
              active={viewMode === 'json'}
              onClick={() => setViewMode('json')}
              icon={<FileJson className="w-3.5 h-3.5" />}
              label="JSON"
            />
            <ViewModeButton
              active={viewMode === 'table'}
              onClick={() => setViewMode('table')}
              icon={<Table2 className="w-3.5 h-3.5" />}
              label="Table"
            />
            <ViewModeButton
              active={viewMode === 'raw'}
              onClick={() => setViewMode('raw')}
              icon={<Code2 className="w-3.5 h-3.5" />}
              label="Raw"
            />
          </div>

          {/* Code Gen Toggle */}
          <button
            onClick={() => setShowCodeGen(!showCodeGen)}
            className={cn(
              'px-2 py-1.5 text-xs font-medium rounded-lg transition-colors',
              showCodeGen
                ? 'bg-black text-white'
                : 'text-gray-600 hover:bg-gray-100'
            )}
          >
            {'</>'}
          </button>

          {/* Expand */}
          <button
            onClick={() => setIsExpanded(!isExpanded)}
            className="p-1.5 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-lg transition-colors"
          >
            {isExpanded ? (
              <Minimize2 className="w-4 h-4" />
            ) : (
              <Maximize2 className="w-4 h-4" />
            )}
          </button>
        </div>
      </div>

      {/* Content */}
      <div className={cn('overflow-auto', isExpanded ? 'max-h-[600px]' : 'max-h-[400px]')}>
        {content.map((item, index) => (
          <ContentRenderer
            key={index}
            content={item}
            viewMode={viewMode}
            index={index}
            onCopy={handleCopy}
            onDownload={handleDownload}
            copied={copiedIndex === index}
          />
        ))}
      </div>

      {/* Code Generation Panel */}
      {showCodeGen && generatedCode && (
        <div className="border-t border-gray-200">
          <div className="flex items-center justify-between px-4 py-2 bg-gray-50">
            <span className="text-xs font-medium text-gray-700">Generated Code</span>
            <select
              value={selectedLanguage}
              onChange={(e) => setSelectedLanguage(e.target.value as CodeLanguage)}
              className="h-7 px-2 text-xs border border-gray-200 rounded-lg focus:border-black focus:ring-0"
            >
              {languages.map(lang => (
                <option key={lang.id} value={lang.id}>{lang.name}</option>
              ))}
            </select>
          </div>
          <div className="p-4 bg-gray-900">
            <pre className="text-xs text-gray-300 overflow-x-auto">
              <code>{generatedCode.code}</code>
            </pre>
            <div className="flex items-center gap-2 mt-3 pt-3 border-t border-gray-700">
              <button
                onClick={() => handleCopy(generatedCode.code, -1)}
                className="flex items-center gap-1.5 px-2 py-1 text-xs text-gray-400 hover:text-white transition-colors"
              >
                {copiedIndex === -1 ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                {copiedIndex === -1 ? 'Copied!' : 'Copy'}
              </button>
              <button
                onClick={() => handleDownload(generatedCode.code, `${result.toolId}.${getFileExtension(selectedLanguage)}`)}
                className="flex items-center gap-1.5 px-2 py-1 text-xs text-gray-400 hover:text-white transition-colors"
              >
                <Download className="w-3.5 h-3.5" />
                Download
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Metadata */}
      {result.metadata && Object.keys(result.metadata).length > 0 && (
        <div className="px-4 py-3 bg-gray-50 border-t border-gray-200">
          <div className="flex flex-wrap gap-3">
            {result.metadata.chain && (
              <MetadataItem label="Chain" value={result.metadata.chain} />
            )}
            {result.metadata.transactionHash && (
              <MetadataItem label="Tx Hash" value={result.metadata.transactionHash} truncate />
            )}
            {result.metadata.blockNumber && (
              <MetadataItem label="Block" value={String(result.metadata.blockNumber)} />
            )}
            {result.metadata.gasUsed && (
              <MetadataItem label="Gas Used" value={result.metadata.gasUsed} />
            )}
          </div>
        </div>
      )}
    </div>
  );
}

// Sub-components
function ViewModeButton({ active, onClick, icon, label }: {
  active: boolean;
  onClick: () => void;
  icon: React.ReactNode;
  label: string;
}) {
  return (
    <button
      onClick={onClick}
      className={cn(
        'flex items-center gap-1.5 px-2 py-1 text-xs font-medium rounded-md transition-colors',
        active
          ? 'bg-gray-900 text-white'
          : 'text-gray-600 hover:bg-gray-100'
      )}
    >
      {icon}
      {label}
    </button>
  );
}

function MetadataItem({ label, value, truncate }: { label: string; value: string; truncate?: boolean }) {
  return (
    <div className="text-xs">
      <span className="text-gray-500">{label}: </span>
      <span className={cn('font-mono text-gray-700', truncate && 'max-w-[120px] truncate inline-block align-bottom')}>
        {value}
      </span>
    </div>
  );
}

function ContentRenderer({
  content,
  viewMode,
  index,
  onCopy,
  onDownload,
  copied,
}: {
  content: ExecutionContent;
  viewMode: string;
  index: number;
  onCopy: (data: unknown, index: number) => void;
  onDownload: (data: unknown, filename: string) => void;
  copied: boolean;
}) {
  const [expanded, setExpanded] = useState(true);

  if (content.type === 'text') {
    return (
      <div className="p-4">
        <pre className="text-sm text-gray-700 whitespace-pre-wrap break-words">
          {String(content.data)}
        </pre>
      </div>
    );
  }

  if (content.type === 'image') {
    return (
      <div className="p-4">
        <img
          src={`data:${content.mimeType || 'image/png'};base64,${content.data}`}
          alt="Output"
          className="max-w-full rounded-lg"
        />
      </div>
    );
  }

  if (content.type === 'table' && Array.isArray(content.data) && viewMode === 'table') {
    const data = content.data as Record<string, unknown>[];
    if (data.length === 0) return null;

    const columns = Object.keys(data[0]);

    return (
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead className="bg-gray-50 border-b border-gray-200">
            <tr>
              {columns.map(col => (
                <th key={col} className="px-4 py-2 text-left font-medium text-gray-700">
                  {col}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {data.slice(0, 50).map((row, i) => (
              <tr key={i} className="hover:bg-gray-50">
                {columns.map(col => (
                  <td key={col} className="px-4 py-2 text-gray-600">
                    {formatCellValue(row[col])}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
        {data.length > 50 && (
          <div className="px-4 py-2 text-xs text-gray-500 bg-gray-50">
            Showing 50 of {data.length} rows
          </div>
        )}
      </div>
    );
  }

  // JSON view (default)
  return (
    <div className="relative">
      <div className="absolute top-3 right-3 flex items-center gap-1.5">
        <button
          onClick={() => onCopy(content.data, index)}
          className="p-1.5 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded transition-colors"
        >
          {copied ? <Check className="w-3.5 h-3.5 text-green-600" /> : <Copy className="w-3.5 h-3.5" />}
        </button>
        <button
          onClick={() => onDownload(content.data, `output-${index}.json`)}
          className="p-1.5 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded transition-colors"
        >
          <Download className="w-3.5 h-3.5" />
        </button>
      </div>
      <pre className="p-4 pr-20 text-sm text-gray-700 overflow-x-auto">
        <code>{JSON.stringify(content.data, null, 2)}</code>
      </pre>
    </div>
  );
}

function formatCellValue(value: unknown): string {
  if (value === null || value === undefined) return '-';
  if (typeof value === 'object') return JSON.stringify(value);
  return String(value);
}

export default OutputDisplay;
