import React from 'react';
import { cn } from '@/lib/utils';
import { LucideIcon } from 'lucide-react';

interface MetricCardProps {
  title: string;
  value: string | number;
  subtitle?: string;
  icon: LucideIcon;
  color?: 'primary' | 'secondary' | 'accent' | 'success' | 'warning';
  trend?: {
    value: number;
    label: string;
    isPositive?: boolean;
  };
}

export const MetricCard: React.FC<MetricCardProps> = ({
  title,
  value,
  subtitle,
  icon: Icon,
  color = 'primary',
  trend,
}) => {
  const colorClasses = {
    primary: 'from-primary to-cyan-400',
    secondary: 'from-secondary to-orange-400',
    accent: 'from-accent to-pink-400',
    success: 'from-success to-emerald-400',
    warning: 'from-warning to-amber-400',
  };

  const bgClasses = {
    primary: 'bg-primary/10',
    secondary: 'bg-secondary/10',
    accent: 'bg-accent/10',
    success: 'bg-success/10',
    warning: 'bg-warning/10',
  };

  const textClasses = {
    primary: 'text-primary',
    secondary: 'text-secondary',
    accent: 'text-accent',
    success: 'text-success',
    warning: 'text-warning',
  };

  return (
    <div className="metric-card p-6 rounded-xl relative overflow-hidden group hover:border-primary/40 transition-all duration-300">
      {/* Background gradient overlay */}
      <div className={cn(
        'absolute inset-0 opacity-0 group-hover:opacity-10 transition-opacity duration-300',
        `bg-gradient-to-br ${colorClasses[color]}`
      )} />
      
      {/* Icon */}
      <div className={cn(
        'w-12 h-12 rounded-xl flex items-center justify-center mb-4',
        bgClasses[color]
      )}>
        <Icon className={cn('w-6 h-6', textClasses[color])} />
      </div>

      {/* Title */}
      <p className="text-sm text-muted-foreground font-medium mb-1">{title}</p>

      {/* Value */}
      <div className="flex items-baseline gap-2">
        <span className={cn(
          'text-3xl font-bold bg-gradient-to-r bg-clip-text text-transparent',
          colorClasses[color]
        )}>
          {value}
        </span>
        {subtitle && (
          <span className="text-sm text-muted-foreground">{subtitle}</span>
        )}
      </div>

      {/* Trend */}
      {trend && (
        <div className={cn(
          'mt-3 flex items-center gap-1 text-sm',
          trend.isPositive !== false ? 'text-success' : 'text-destructive'
        )}>
          <span className="font-semibold">
            {trend.isPositive !== false ? '↑' : '↓'} {trend.value}%
          </span>
          <span className="text-muted-foreground">{trend.label}</span>
        </div>
      )}

      {/* Decorative element */}
      <div className={cn(
        'absolute -right-4 -bottom-4 w-24 h-24 rounded-full opacity-5',
        `bg-gradient-to-br ${colorClasses[color]}`
      )} />
    </div>
  );
};
