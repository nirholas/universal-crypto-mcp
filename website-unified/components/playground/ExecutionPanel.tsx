'use client';

import React, { useState, useRef, useEffect } from 'react';
import { cn } from '@/lib/utils/cn';
import { McpTool, ExecutionResult, ExecutionStatus } from '@/lib/playground/types';
import { executeTool, validateParameters, createMockExecution, formatDuration } from '@/lib/playground/execution';
import { saveExecution, addRecentTool } from '@/lib/playground/storage';
import {
  Play,
  Square,
  RotateCcw,
  Clock,
  CheckCircle2,
  XCircle,
  AlertCircle,
  Loader2,
  Save,
  Share2,
} from 'lucide-react';

interface ExecutionPanelProps {
  tool: McpTool;
  parameters: Record<string, unknown>;
  onResult: (result: ExecutionResult) => void;
  onSavePreset?: (parameters: Record<string, unknown>) => void;
  demoMode?: boolean;
  className?: string;
}

export function ExecutionPanel({
  tool,
  parameters,
  onResult,
  onSavePreset,
  demoMode = false,
  className,
}: ExecutionPanelProps) {
  const [status, setStatus] = useState<ExecutionStatus>('idle');
  const [result, setResult] = useState<ExecutionResult | null>(null);
  const [startTime, setStartTime] = useState<Date | null>(null);
  const [elapsedTime, setElapsedTime] = useState(0);
  const abortControllerRef = useRef<AbortController | null>(null);
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  // Timer for running state
  useEffect(() => {
    if (status === 'running' && startTime) {
      timerRef.current = setInterval(() => {
        setElapsedTime(Date.now() - startTime.getTime());
      }, 100);
    } else {
      if (timerRef.current) {
        clearInterval(timerRef.current);
        timerRef.current = null;
      }
    }

    return () => {
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }
    };
  }, [status, startTime]);

  const handleExecute = async () => {
    // Validate parameters first
    const validation = validateParameters(tool, parameters);
    if (!validation.valid) {
      const errorResult: ExecutionResult = {
        id: `exec_${Date.now()}`,
        toolId: tool.id,
        toolName: tool.name,
        status: 'error',
        parameters,
        startTime: new Date(),
        error: {
          code: 'VALIDATION_ERROR',
          message: 'Invalid parameters',
          details: validation.errors,
        },
      };
      setResult(errorResult);
      onResult(errorResult);
      return;
    }

    // Start execution
    setStatus('running');
    setStartTime(new Date());
    setElapsedTime(0);
    setResult(null);

    // Create abort controller
    abortControllerRef.current = new AbortController();

    try {
      let execResult: ExecutionResult;

      if (demoMode) {
        // Simulate execution delay
        await new Promise(resolve => setTimeout(resolve, 500 + Math.random() * 1000));
        execResult = createMockExecution(tool, parameters);
      } else {
        execResult = await executeTool(tool, parameters, {
          signal: abortControllerRef.current.signal,
        });
      }

      setStatus(execResult.status);
      setResult(execResult);
      onResult(execResult);

      // Save to history
      saveExecution({
        ...execResult,
        favorite: false,
      });

      // Track recent tool usage
      addRecentTool(tool.id);
    } catch (error: any) {
      if (error.name === 'AbortError') {
        setStatus('cancelled');
      } else {
        const errorResult: ExecutionResult = {
          id: `exec_${Date.now()}`,
          toolId: tool.id,
          toolName: tool.name,
          status: 'error',
          parameters,
          startTime: startTime || new Date(),
          endTime: new Date(),
          error: {
            code: 'EXECUTION_ERROR',
            message: error.message || 'Unknown error',
          },
        };
        setResult(errorResult);
        onResult(errorResult);
        setStatus('error');
      }
    } finally {
      abortControllerRef.current = null;
    }
  };

  const handleCancel = () => {
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
    }
    setStatus('cancelled');
  };

  const handleRetry = () => {
    handleExecute();
  };

  const handleSavePreset = () => {
    if (onSavePreset) {
      onSavePreset(parameters);
    }
  };

  const handleShare = async () => {
    if (result) {
      const shareData = {
        toolId: tool.id,
        parameters,
      };
      const encoded = btoa(JSON.stringify(shareData));
      const url = `${window.location.origin}/playground/tool/${tool.id}?params=${encoded}`;
      
      try {
        await navigator.clipboard.writeText(url);
        // TODO: Show toast
        alert('Link copied to clipboard!');
      } catch {
        // Fallback
        prompt('Copy this link:', url);
      }
    }
  };

  const getStatusIcon = () => {
    switch (status) {
      case 'running':
        return <Loader2 className="w-4 h-4 animate-spin" />;
      case 'success':
        return <CheckCircle2 className="w-4 h-4 text-green-600" />;
      case 'error':
        return <XCircle className="w-4 h-4 text-red-600" />;
      case 'cancelled':
        return <AlertCircle className="w-4 h-4 text-yellow-600" />;
      default:
        return <Play className="w-4 h-4" />;
    }
  };

  const getStatusText = () => {
    switch (status) {
      case 'running':
        return `Running... ${formatDuration(elapsedTime)}`;
      case 'success':
        return `Completed in ${formatDuration(result?.duration || 0)}`;
      case 'error':
        return 'Failed';
      case 'cancelled':
        return 'Cancelled';
      default:
        return 'Ready';
    }
  };

  const getStatusColor = () => {
    switch (status) {
      case 'running':
        return 'text-blue-600 bg-blue-50';
      case 'success':
        return 'text-green-600 bg-green-50';
      case 'error':
        return 'text-red-600 bg-red-50';
      case 'cancelled':
        return 'text-yellow-600 bg-yellow-50';
      default:
        return 'text-gray-600 bg-gray-50';
    }
  };

  return (
    <div className={cn('space-y-4', className)}>
      {/* Execute Button */}
      <div className="flex items-center gap-3">
        {status === 'running' ? (
          <button
            onClick={handleCancel}
            className="flex-1 flex items-center justify-center gap-2 h-12 bg-red-600 text-white font-semibold rounded-xl hover:bg-red-700 transition-colors"
          >
            <Square className="w-4 h-4" />
            Cancel
          </button>
        ) : (
          <button
            onClick={handleExecute}
            className="flex-1 flex items-center justify-center gap-2 h-12 bg-black text-white font-semibold rounded-xl hover:bg-gray-900 active:scale-[0.98] transition-all"
          >
            <Play className="w-4 h-4" />
            Execute
          </button>
        )}

        {/* Secondary Actions */}
        <div className="flex items-center gap-2">
          {(status === 'error' || status === 'cancelled') && (
            <button
              onClick={handleRetry}
              className="flex items-center justify-center w-12 h-12 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-xl transition-colors"
              title="Retry"
            >
              <RotateCcw className="w-5 h-5" />
            </button>
          )}
          {onSavePreset && (
            <button
              onClick={handleSavePreset}
              className="flex items-center justify-center w-12 h-12 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-xl transition-colors"
              title="Save as preset"
            >
              <Save className="w-5 h-5" />
            </button>
          )}
          {result && status === 'success' && (
            <button
              onClick={handleShare}
              className="flex items-center justify-center w-12 h-12 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-xl transition-colors"
              title="Share"
            >
              <Share2 className="w-5 h-5" />
            </button>
          )}
        </div>
      </div>

      {/* Status Bar */}
      <div className={cn(
        'flex items-center gap-2 px-4 py-3 rounded-xl transition-colors',
        getStatusColor()
      )}>
        {getStatusIcon()}
        <span className="text-sm font-medium">{getStatusText()}</span>
        {status === 'running' && (
          <div className="ml-auto">
            <Clock className="w-4 h-4 animate-pulse" />
          </div>
        )}
      </div>

      {/* Progress Bar for running state */}
      {status === 'running' && (
        <div className="h-1 bg-gray-200 rounded-full overflow-hidden">
          <div className="h-full bg-blue-600 rounded-full animate-progress" />
        </div>
      )}

      {/* Error Details */}
      {status === 'error' && result?.error && (
        <div className="p-4 bg-red-50 border border-red-200 rounded-xl">
          <div className="flex items-start gap-3">
            <XCircle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
            <div className="min-w-0 flex-1">
              <p className="font-medium text-red-800">{result.error.code}</p>
              <p className="text-sm text-red-600 mt-1">{result.error.message}</p>
              {result.error.details && typeof result.error.details === 'object' && (
                <div className="mt-2 pt-2 border-t border-red-200">
                  <p className="text-xs font-medium text-red-700 mb-1">Details:</p>
                  <ul className="text-xs text-red-600 space-y-0.5">
                    {Object.entries(result.error.details as Record<string, unknown>).map(([key, value]) => (
                      <li key={key}>
                        <span className="font-medium">{key}:</span> {String(value)}
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Demo Mode Indicator */}
      {demoMode && (
        <div className="flex items-center gap-2 px-3 py-2 bg-amber-50 border border-amber-200 rounded-lg">
          <AlertCircle className="w-4 h-4 text-amber-600" />
          <span className="text-xs text-amber-700">
            Demo mode: Responses are simulated
          </span>
        </div>
      )}

      {/* CSS for progress animation */}
      <style jsx>{`
        @keyframes progress {
          0% {
            width: 0%;
          }
          50% {
            width: 70%;
          }
          100% {
            width: 100%;
          }
        }
        .animate-progress {
          animation: progress 2s ease-in-out infinite;
        }
      `}</style>
    </div>
  );
}

export default ExecutionPanel;
