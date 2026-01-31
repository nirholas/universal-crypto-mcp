'use client';

/**
 * Impermanent Loss Calculator Component
 * 
 * Calculate and visualize impermanent loss for liquidity positions
 * with scenario modeling and break-even analysis.
 */

import React, { useState, useMemo } from 'react';
import { cn } from '@/lib/utils/cn';
import type { ILCalculation } from '@/lib/analytics/types';
import { formatCurrency, formatPercentage } from '@/lib/analytics/hooks';

// ============================================================================
// Types
// ============================================================================

interface ILCalculatorProps {
  onClose?: () => void;
  className?: string;
}

interface PoolInputs {
  token0: { symbol: string; amount: number; initialPrice: number; currentPrice: number };
  token1: { symbol: string; amount: number; initialPrice: number; currentPrice: number };
  feesEarned: number;
}

// ============================================================================
// IL Calculation Functions
// ============================================================================

function calculateIL(priceRatio: number): number {
  // IL formula: 2 * sqrt(priceRatio) / (1 + priceRatio) - 1
  const sqrtRatio = Math.sqrt(priceRatio);
  return (2 * sqrtRatio) / (1 + priceRatio) - 1;
}

function calculatePositionValue(inputs: PoolInputs): ILCalculation {
  const { token0, token1, feesEarned } = inputs;

  // Initial investment value
  const initialValue0 = token0.amount * token0.initialPrice;
  const initialValue1 = token1.amount * token1.initialPrice;
  const initialInvestment = initialValue0 + initialValue1;

  // Calculate price ratio (current / initial)
  const priceRatio0 = token0.currentPrice / token0.initialPrice;
  const priceRatio1 = token1.currentPrice / token1.initialPrice;
  
  // For simplicity, use the ratio of ratios
  const relativeRatio = priceRatio0 / priceRatio1;

  // IL calculation
  const ilFactor = calculateIL(relativeRatio);
  
  // What the position would be worth if HODLing
  const holdValue = (token0.amount * token0.currentPrice) + (token1.amount * token1.currentPrice);
  
  // Actual LP position value (accounting for IL)
  const lpValue = holdValue * (1 + ilFactor);
  
  // IL in dollar terms
  const ilDollars = holdValue - lpValue;
  const ilPercent = ilFactor * 100;

  // Net return including fees
  const netReturn = lpValue + feesEarned - initialInvestment;

  // Break-even APY (fees needed to offset IL)
  // Simplified: fees needed = IL loss, APY = annualized rate
  const breakEvenApy = ilDollars > 0 && lpValue > 0
    ? (ilDollars / lpValue) * 100
    : 0;

  return {
    initialInvestment,
    currentValue: lpValue,
    holdValue,
    impermanentLoss: ilDollars,
    impermanentLossPercent: Math.abs(ilPercent),
    feesEarned,
    netReturn,
    breakEvenApy,
  };
}

// ============================================================================
// Price Scenario Component
// ============================================================================

interface PriceScenarioProps {
  basePrice: number;
  onSelectRatio: (ratio: number) => void;
}

function PriceScenario({ basePrice, onSelectRatio }: PriceScenarioProps) {
  const scenarios = [
    { label: '2x', ratio: 2 },
    { label: '1.5x', ratio: 1.5 },
    { label: '1.25x', ratio: 1.25 },
    { label: '1x (No change)', ratio: 1 },
    { label: '0.75x', ratio: 0.75 },
    { label: '0.5x', ratio: 0.5 },
    { label: '0.25x', ratio: 0.25 },
  ];

  return (
    <div className="flex flex-wrap gap-2">
      {scenarios.map((s) => (
        <button
          key={s.label}
          onClick={() => onSelectRatio(s.ratio)}
          className="rounded-lg bg-gray-100 px-3 py-1.5 text-sm font-medium text-gray-700 hover:bg-gray-200"
        >
          {s.label}
        </button>
      ))}
    </div>
  );
}

// ============================================================================
// IL Visualization Component
// ============================================================================

interface ILVisualizationProps {
  calculation: ILCalculation;
}

function ILVisualization({ calculation }: ILVisualizationProps) {
  const maxValue = Math.max(
    calculation.initialInvestment,
    calculation.holdValue,
    calculation.currentValue + calculation.feesEarned
  );

  const barHeight = (value: number) => `${(value / maxValue) * 100}%`;

  return (
    <div className="flex items-end justify-center gap-8 h-64">
      {/* Initial Investment */}
      <div className="flex flex-col items-center">
        <div
          className="w-20 rounded-t-lg bg-gray-400"
          style={{ height: barHeight(calculation.initialInvestment) }}
        />
        <div className="mt-2 text-center">
          <div className="text-sm font-medium">Initial</div>
          <div className="text-xs text-gray-500">
            {formatCurrency(calculation.initialInvestment)}
          </div>
        </div>
      </div>

      {/* HODL Value */}
      <div className="flex flex-col items-center">
        <div
          className="w-20 rounded-t-lg bg-blue-500"
          style={{ height: barHeight(calculation.holdValue) }}
        />
        <div className="mt-2 text-center">
          <div className="text-sm font-medium">HODL</div>
          <div className="text-xs text-gray-500">
            {formatCurrency(calculation.holdValue)}
          </div>
        </div>
      </div>

      {/* LP Value */}
      <div className="flex flex-col items-center">
        <div className="relative w-20">
          {calculation.feesEarned > 0 && (
            <div
              className="absolute bottom-0 w-full rounded-t-lg bg-green-400"
              style={{ height: barHeight(calculation.feesEarned) }}
            />
          )}
          <div
            className={cn(
              'w-full rounded-t-lg',
              calculation.impermanentLoss > 0 ? 'bg-purple-500' : 'bg-green-500'
            )}
            style={{ 
              height: barHeight(calculation.currentValue),
              marginBottom: calculation.feesEarned > 0 ? barHeight(calculation.feesEarned) : 0
            }}
          />
        </div>
        <div className="mt-2 text-center">
          <div className="text-sm font-medium">LP + Fees</div>
          <div className="text-xs text-gray-500">
            {formatCurrency(calculation.currentValue + calculation.feesEarned)}
          </div>
        </div>
      </div>
    </div>
  );
}

// ============================================================================
// Main Component
// ============================================================================

export function ILCalculator({ onClose, className }: ILCalculatorProps) {
  const [inputs, setInputs] = useState<PoolInputs>({
    token0: { symbol: 'ETH', amount: 1, initialPrice: 3000, currentPrice: 3000 },
    token1: { symbol: 'USDC', amount: 3000, initialPrice: 1, currentPrice: 1 },
    feesEarned: 0,
  });

  const calculation = useMemo(() => {
    return calculatePositionValue(inputs);
  }, [inputs]);

  const handleToken0Change = (field: keyof typeof inputs.token0, value: string | number) => {
    setInputs(prev => ({
      ...prev,
      token0: { ...prev.token0, [field]: typeof value === 'string' ? parseFloat(value) || 0 : value }
    }));
  };

  const handleToken1Change = (field: keyof typeof inputs.token1, value: string | number) => {
    setInputs(prev => ({
      ...prev,
      token1: { ...prev.token1, [field]: typeof value === 'string' ? parseFloat(value) || 0 : value }
    }));
  };

  return (
    <div className={cn('rounded-2xl border-2 border-gray-200 bg-white p-6', className)}>
      {/* Header */}
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h3 className="text-lg font-semibold">Impermanent Loss Calculator</h3>
          <p className="text-sm text-gray-500">
            Calculate potential IL for your liquidity positions
          </p>
        </div>
        {onClose && (
          <button
            onClick={onClose}
            className="rounded-lg p-2 hover:bg-gray-100"
          >
            ✕
          </button>
        )}
      </div>

      <div className="grid gap-8 lg:grid-cols-2">
        {/* Inputs */}
        <div className="space-y-6">
          {/* Token 0 */}
          <div className="rounded-xl bg-gray-50 p-4">
            <div className="mb-3 flex items-center justify-between">
              <label className="font-medium">Token A</label>
              <input
                type="text"
                value={inputs.token0.symbol}
                onChange={(e) => handleToken0Change('symbol', e.target.value)}
                className="w-20 rounded border border-gray-200 px-2 py-1 text-center text-sm font-medium"
              />
            </div>
            <div className="grid gap-3 sm:grid-cols-3">
              <div>
                <label className="text-xs text-gray-500">Amount</label>
                <input
                  type="number"
                  value={inputs.token0.amount}
                  onChange={(e) => handleToken0Change('amount', e.target.value)}
                  className="mt-1 w-full rounded border border-gray-200 px-3 py-2 text-sm"
                />
              </div>
              <div>
                <label className="text-xs text-gray-500">Initial Price ($)</label>
                <input
                  type="number"
                  value={inputs.token0.initialPrice}
                  onChange={(e) => handleToken0Change('initialPrice', e.target.value)}
                  className="mt-1 w-full rounded border border-gray-200 px-3 py-2 text-sm"
                />
              </div>
              <div>
                <label className="text-xs text-gray-500">Current Price ($)</label>
                <input
                  type="number"
                  value={inputs.token0.currentPrice}
                  onChange={(e) => handleToken0Change('currentPrice', e.target.value)}
                  className="mt-1 w-full rounded border border-gray-200 px-3 py-2 text-sm"
                />
              </div>
            </div>
            <div className="mt-3">
              <label className="text-xs text-gray-500">Quick Scenarios</label>
              <PriceScenario
                basePrice={inputs.token0.initialPrice}
                onSelectRatio={(ratio) => handleToken0Change('currentPrice', inputs.token0.initialPrice * ratio)}
              />
            </div>
          </div>

          {/* Token 1 */}
          <div className="rounded-xl bg-gray-50 p-4">
            <div className="mb-3 flex items-center justify-between">
              <label className="font-medium">Token B</label>
              <input
                type="text"
                value={inputs.token1.symbol}
                onChange={(e) => handleToken1Change('symbol', e.target.value)}
                className="w-20 rounded border border-gray-200 px-2 py-1 text-center text-sm font-medium"
              />
            </div>
            <div className="grid gap-3 sm:grid-cols-3">
              <div>
                <label className="text-xs text-gray-500">Amount</label>
                <input
                  type="number"
                  value={inputs.token1.amount}
                  onChange={(e) => handleToken1Change('amount', e.target.value)}
                  className="mt-1 w-full rounded border border-gray-200 px-3 py-2 text-sm"
                />
              </div>
              <div>
                <label className="text-xs text-gray-500">Initial Price ($)</label>
                <input
                  type="number"
                  value={inputs.token1.initialPrice}
                  onChange={(e) => handleToken1Change('initialPrice', e.target.value)}
                  className="mt-1 w-full rounded border border-gray-200 px-3 py-2 text-sm"
                />
              </div>
              <div>
                <label className="text-xs text-gray-500">Current Price ($)</label>
                <input
                  type="number"
                  value={inputs.token1.currentPrice}
                  onChange={(e) => handleToken1Change('currentPrice', e.target.value)}
                  className="mt-1 w-full rounded border border-gray-200 px-3 py-2 text-sm"
                />
              </div>
            </div>
          </div>

          {/* Fees Earned */}
          <div className="rounded-xl bg-green-50 p-4">
            <label className="font-medium text-green-800">Fees Earned ($)</label>
            <input
              type="number"
              value={inputs.feesEarned}
              onChange={(e) => setInputs(prev => ({ ...prev, feesEarned: parseFloat(e.target.value) || 0 }))}
              className="mt-2 w-full rounded border border-green-200 bg-white px-3 py-2 text-sm"
              placeholder="0"
            />
          </div>
        </div>

        {/* Results */}
        <div className="space-y-6">
          {/* Visualization */}
          <div className="rounded-xl bg-gray-50 p-4">
            <h4 className="mb-4 font-medium">Value Comparison</h4>
            <ILVisualization calculation={calculation} />
          </div>

          {/* Stats */}
          <div className="grid gap-4 sm:grid-cols-2">
            <div className={cn(
              'rounded-xl p-4',
              calculation.impermanentLoss > 0 ? 'bg-red-50' : 'bg-green-50'
            )}>
              <div className={cn(
                'text-sm',
                calculation.impermanentLoss > 0 ? 'text-red-700' : 'text-green-700'
              )}>
                Impermanent Loss
              </div>
              <div className={cn(
                'mt-1 text-2xl font-bold',
                calculation.impermanentLoss > 0 ? 'text-red-800' : 'text-green-800'
              )}>
                {calculation.impermanentLoss > 0 ? '-' : ''}{formatCurrency(Math.abs(calculation.impermanentLoss))}
              </div>
              <div className={cn(
                'mt-1 text-sm',
                calculation.impermanentLoss > 0 ? 'text-red-600' : 'text-green-600'
              )}>
                {calculation.impermanentLossPercent.toFixed(2)}% of position
              </div>
            </div>

            <div className={cn(
              'rounded-xl p-4',
              calculation.netReturn >= 0 ? 'bg-green-50' : 'bg-red-50'
            )}>
              <div className={cn(
                'text-sm',
                calculation.netReturn >= 0 ? 'text-green-700' : 'text-red-700'
              )}>
                Net Return
              </div>
              <div className={cn(
                'mt-1 text-2xl font-bold',
                calculation.netReturn >= 0 ? 'text-green-800' : 'text-red-800'
              )}>
                {calculation.netReturn >= 0 ? '+' : ''}{formatCurrency(calculation.netReturn)}
              </div>
              <div className={cn(
                'mt-1 text-sm',
                calculation.netReturn >= 0 ? 'text-green-600' : 'text-red-600'
              )}>
                After fees: {formatCurrency(inputs.feesEarned)}
              </div>
            </div>
          </div>

          {/* Break-even Analysis */}
          {calculation.impermanentLoss > 0 && (
            <div className="rounded-xl bg-yellow-50 p-4">
              <div className="font-semibold text-yellow-800">Break-even Analysis</div>
              <div className="mt-2 text-sm text-yellow-700">
                You need to earn <span className="font-bold">{formatCurrency(calculation.impermanentLoss)}</span> in fees
                to offset the impermanent loss.
              </div>
              <div className="mt-1 text-sm text-yellow-600">
                Minimum APY required: <span className="font-bold">{calculation.breakEvenApy.toFixed(2)}%</span>
              </div>
            </div>
          )}

          {/* Summary */}
          <div className="rounded-xl border border-gray-200 p-4">
            <h4 className="mb-3 font-medium">Summary</h4>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-gray-500">Initial Investment</span>
                <span className="font-medium">{formatCurrency(calculation.initialInvestment)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-500">If HODLing</span>
                <span className="font-medium">{formatCurrency(calculation.holdValue)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-500">LP Position Value</span>
                <span className="font-medium">{formatCurrency(calculation.currentValue)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-500">Fees Earned</span>
                <span className="font-medium text-green-600">+{formatCurrency(calculation.feesEarned)}</span>
              </div>
              <hr className="my-2" />
              <div className="flex justify-between text-base">
                <span className="font-medium">Total Value</span>
                <span className="font-bold">{formatCurrency(calculation.currentValue + calculation.feesEarned)}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ILCalculator;
