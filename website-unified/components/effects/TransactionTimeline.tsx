'use client';

import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';

interface TimelineEvent {
  id: string;
  title: string;
  description: string;
  time: string;
  type: 'success' | 'pending' | 'error' | 'info';
  icon?: React.ReactNode;
}

interface TransactionTimelineProps {
  events: TimelineEvent[];
  className?: string;
}

export function TransactionTimeline({ events, className }: TransactionTimelineProps) {
  const typeStyles = {
    success: {
      dot: 'bg-green-500',
      line: 'from-green-500',
      bg: 'bg-green-500/10',
      text: 'text-green-400',
    },
    pending: {
      dot: 'bg-amber-500 animate-pulse',
      line: 'from-amber-500',
      bg: 'bg-amber-500/10',
      text: 'text-amber-400',
    },
    error: {
      dot: 'bg-red-500',
      line: 'from-red-500',
      bg: 'bg-red-500/10',
      text: 'text-red-400',
    },
    info: {
      dot: 'bg-blue-500',
      line: 'from-blue-500',
      bg: 'bg-blue-500/10',
      text: 'text-blue-400',
    },
  };

  return (
    <div className={cn('space-y-0', className)}>
      {events.map((event, index) => {
        const styles = typeStyles[event.type];
        const isLast = index === events.length - 1;
        
        return (
          <motion.div
            key={event.id}
            className="relative flex gap-4"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: index * 0.1 }}
          >
            {/* Timeline line and dot */}
            <div className="flex flex-col items-center">
              <div className={cn('w-3 h-3 rounded-full z-10', styles.dot)} />
              {!isLast && (
                <div 
                  className={cn(
                    'w-0.5 flex-1 bg-gradient-to-b to-transparent',
                    styles.line
                  )} 
                />
              )}
            </div>

            {/* Content */}
            <div className={cn('flex-1 pb-6', isLast && 'pb-0')}>
              <div className={cn('p-4 rounded-xl', styles.bg)}>
                <div className="flex items-start justify-between gap-2">
                  <div className="flex items-center gap-2">
                    {event.icon && (
                      <span className={styles.text}>{event.icon}</span>
                    )}
                    <h4 className="font-medium text-white">{event.title}</h4>
                  </div>
                  <span className="text-xs text-white/40 whitespace-nowrap">
                    {event.time}
                  </span>
                </div>
                <p className="mt-1 text-sm text-white/60">{event.description}</p>
              </div>
            </div>
          </motion.div>
        );
      })}
    </div>
  );
}
