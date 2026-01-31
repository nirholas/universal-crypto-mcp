'use client';

import { DonutChart as TremorDonutChart, Card, Title, Text, Legend } from '@tremor/react';
import { cn } from '@/lib/utils';

interface DataPoint {
  name: string;
  value: number;
}

interface DonutChartProps {
  title?: string;
  subtitle?: string;
  data: DataPoint[];
  category?: string;
  index?: string;
  colors?: ('purple' | 'cyan' | 'emerald' | 'amber' | 'rose' | 'indigo' | 'fuchsia')[];
  valueFormatter?: (value: number) => string;
  showAnimation?: boolean;
  showLabel?: boolean;
  label?: string;
  variant?: 'donut' | 'pie';
  className?: string;
}

export function DonutChart({
  title,
  subtitle,
  data,
  category = 'value',
  index = 'name',
  colors = ['purple', 'cyan', 'emerald', 'amber', 'rose'],
  valueFormatter = (v) => `$${v.toLocaleString()}`,
  showAnimation = true,
  showLabel = true,
  label,
  variant = 'donut',
  className,
}: DonutChartProps) {
  return (
    <Card className={cn('bg-black/50 border-white/10 ring-0', className)}>
      {title && <Title className="text-white">{title}</Title>}
      {subtitle && <Text className="text-white/60">{subtitle}</Text>}
      <div className="flex flex-col items-center">
        <TremorDonutChart
          className="h-52 mt-4"
          data={data}
          category={category}
          index={index}
          colors={colors}
          valueFormatter={valueFormatter}
          showAnimation={showAnimation}
          showLabel={showLabel}
          label={label}
          variant={variant}
        />
        <Legend
          className="mt-4"
          categories={data.map(d => d.name)}
          colors={colors}
        />
      </div>
    </Card>
  );
}
