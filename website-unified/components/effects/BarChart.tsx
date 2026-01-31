'use client';

import { BarChart as TremorBarChart, Card, Title, Text } from '@tremor/react';
import { cn } from '@/lib/utils';

interface DataPoint {
  name: string;
  [key: string]: string | number;
}

interface BarChartProps {
  title?: string;
  subtitle?: string;
  data: DataPoint[];
  index: string;
  categories: string[];
  colors?: ('purple' | 'cyan' | 'emerald' | 'amber' | 'rose')[];
  valueFormatter?: (value: number) => string;
  showLegend?: boolean;
  showAnimation?: boolean;
  layout?: 'vertical' | 'horizontal';
  className?: string;
}

export function BarChart({
  title,
  subtitle,
  data,
  index,
  categories,
  colors = ['purple', 'cyan'],
  valueFormatter = (v) => `$${v.toLocaleString()}`,
  showLegend = true,
  showAnimation = true,
  layout = 'vertical',
  className,
}: BarChartProps) {
  return (
    <Card className={cn('bg-black/50 border-white/10 ring-0', className)}>
      {title && <Title className="text-white">{title}</Title>}
      {subtitle && <Text className="text-white/60">{subtitle}</Text>}
      <TremorBarChart
        className="h-72 mt-4"
        data={data}
        index={index}
        categories={categories}
        colors={colors}
        valueFormatter={valueFormatter}
        showLegend={showLegend}
        showAnimation={showAnimation}
        layout={layout}
      />
    </Card>
  );
}
