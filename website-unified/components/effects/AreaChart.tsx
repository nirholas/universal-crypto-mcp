'use client';

import { AreaChart as TremorAreaChart, Card, Title, Text } from '@tremor/react';
import { cn } from '@/lib/utils';

interface DataPoint {
  date: string;
  value: number;
  [key: string]: string | number;
}

interface AreaChartProps {
  title?: string;
  subtitle?: string;
  data: DataPoint[];
  index: string;
  categories: string[];
  colors?: ('purple' | 'cyan' | 'emerald' | 'amber' | 'rose')[];
  valueFormatter?: (value: number) => string;
  showLegend?: boolean;
  showGridLines?: boolean;
  showAnimation?: boolean;
  className?: string;
}

export function AreaChart({
  title,
  subtitle,
  data,
  index,
  categories,
  colors = ['purple', 'cyan'],
  valueFormatter = (v) => `$${v.toLocaleString()}`,
  showLegend = true,
  showGridLines = false,
  showAnimation = true,
  className,
}: AreaChartProps) {
  return (
    <Card className={cn('bg-black/50 border-white/10 ring-0', className)}>
      {title && <Title className="text-white">{title}</Title>}
      {subtitle && <Text className="text-white/60">{subtitle}</Text>}
      <TremorAreaChart
        className="h-72 mt-4"
        data={data}
        index={index}
        categories={categories}
        colors={colors}
        valueFormatter={valueFormatter}
        showLegend={showLegend}
        showGridLines={showGridLines}
        showAnimation={showAnimation}
        curveType="natural"
      />
    </Card>
  );
}
